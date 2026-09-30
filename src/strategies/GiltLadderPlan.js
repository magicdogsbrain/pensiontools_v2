/**
 * Full index-linked gilt ladder — the fully deterministic plan ("Full IL Gilt strategy").
 *
 * Every year's income is bought today: the first N tax years from cash (a money-market fund),
 * every later year from ONE index-linked gilt that matures BEFORE the April that year starts,
 * so the money is sitting in cash when the tax year begins. Where no linker matures in a tax
 * year's window (Apr of the year before → Mar), the most recent earlier linker is bought for
 * that year too and the surplus held in cash ("double drop"). Only 3-month-lag linkers are used
 * (old-style stocks are quoted with the uplift built in and confuse everyone).
 *
 * Pure: takes the linker universe (prices, index ratios, maturities) and the plan; returns the
 * order sheet, the what-arrives-when table and the totals. All £ are today's money (gross).
 * Illustration from public data, not advice — the UI says so.
 */

// cashRealDrag: cash earns about inflation minus 1% (the FCA-prescribed assumption every other strategy in the
// app runs on), so £1 of need k years out costs £1 × 1.01^k of cash today. Two cash years barely notice;
// fifteen would have looked free without it.
export const LADDER_DEFAULTS = { cashYears: 2, bridgeCash: 0, dealFee: 20, spreadShort: 0.0015, spreadMid: 0.0025, spreadLong: 0.004, cashRealDrag: 0.01 };
/** Cash set aside today to pay £1 of need in plan year k (k = 1 is spent straight away). */
export function cashCostFactor(k, drag = LADDER_DEFAULTS.cashRealDrag) { return Math.pow(1 + drag, Math.max(0, k - 1)); }

/** Bid-offer allowance by years to maturity: 0.15% ≤5y, 0.25% ≤15y, 0.40% beyond. */
export function spreadFor(yearsToMaturity, o = LADDER_DEFAULTS) {
  return yearsToMaturity <= 5 ? o.spreadShort : yearsToMaturity <= 15 ? o.spreadMid : o.spreadLong;
}

/**
 * @param {object} p
 *  pot, startAge, durationYears, amountAtAge(age) → gross £/yr today's money,
 *  spAnnual, spStartAge, spFirstYearRatio (share of the first year SP is paid), firstTaxYear (Apr of),
 *  linkers: [{ name, tidm, isin, maturityDateIso, cleanPrice, indexRatio, lag }], cashYears, bridgeCash,
 *  todayIso ('YYYY-MM-DD', the pricing date) or now (a Date) — either pins the clock; neither = today
 */
export function buildGiltLadder(p) {
  const o = { ...LADDER_DEFAULTS, ...(p.options || {}) };
  const today = Date.parse(p.todayIso || (p.now || new Date()).toISOString().slice(0, 10));
  const il = (p.linkers || []).filter((g) => g.lag === 3 && g.cleanPrice != null && g.maturityDateIso)
    .sort((a, b) => a.maturityDateIso.localeCompare(b.maturityDateIso));
  const cashYears = Math.max(0, p.cashYears ?? o.cashYears);
  const sedol = (isin) => (isin && isin.startsWith('GB') ? isin.slice(4, 11) : null);
  const spIn = (age) => {
    if (!(p.spAnnual > 0) || age < p.spStartAge) return 0;
    if (age === p.spStartAge) return p.spAnnual * (p.spFirstYearRatio ?? 1);   // partial first year (SP starts on the birthday)
    return p.spAnnual;
  };
  const years = [];
  let cash = p.bridgeCash || 0;
  const cashYearsList = [];
  const perGilt = new Map();
  for (let k = 1; k <= p.durationYears; k++) {
    const age = p.startAge + k - 1;
    const Y = p.firstTaxYear + k - 1;
    const gross = p.amountAtAge(age);
    const need = Math.max(0, gross - spIn(age));
    if (k <= cashYears) { const cost = need * cashCostFactor(k, o.cashRealDrag); cash += cost; cashYearsList.push({ Y, age, gross, need, cost }); years.push({ Y, age, gross, need, cost, from: 'cash' }); continue; }
    const lo = (Y - 1) + '-04-01', hi = Y + '-03-31';
    let g = il.filter((x) => x.maturityDateIso >= lo && x.maturityDateIso <= hi).pop();
    let held = false;
    if (!g) { g = il.filter((x) => x.maturityDateIso < lo).pop(); held = true; }
    if (!g) { years.push({ Y, age, gross, need, from: 'none' }); continue; }
    years.push({ Y, age, gross, need, from: g.tidm, held, matures: g.maturityDateIso });
    const e = perGilt.get(g.tidm) || { g, pays: 0, taxYears: [] };
    e.pays += need; e.taxYears.push(Y); perGilt.set(g.tidm, e);
  }
  const orders = [];
  let giltsCost = 0;
  for (const e of perGilt.values()) {
    const t = (Date.parse(e.g.maturityDateIso) - today) / (365.25 * 864e5);
    const sp = spreadFor(t, o);
    const cost = e.pays * e.g.cleanPrice / 100 * (1 + sp) + o.dealFee;
    const nominal = e.g.indexRatio ? Math.ceil(e.pays / e.g.indexRatio / 100) * 100 : null;
    giltsCost += cost;
    orders.push({ name: e.g.name, tidm: e.g.tidm, isin: e.g.isin, sedol: sedol(e.g.isin), matures: e.g.maturityDateIso,
      pays: e.pays, taxYears: e.taxYears, indexRatio: e.g.indexRatio, nominal, cleanPrice: e.g.cleanPrice, spread: sp, cost });
  }
  const total = cash + giltsCost + (cash > 0 ? o.dealFee : 0);
  const uncovered = years.filter((y) => y.from === 'none');
  return {
    cash, cashYears: cashYearsList, orders, years, giltsCost, total, spare: p.pot - total,
    affordable: total <= p.pot && uncovered.length === 0,
    uncoveredYears: uncovered.map((y) => y.Y),
    firstTaxYear: p.firstTaxYear, lastTaxYear: p.firstTaxYear + p.durationYears - 1,
    reason: uncovered.length ? `no index-linked gilt covers ${uncovered.map((y) => y.Y).join(', ')}` : total > p.pot ? `it costs ${Math.round(total).toLocaleString()} — ${Math.round(total - p.pot).toLocaleString()} more than the pot` : null
  };
}

/**
 * What the rungs of an EXISTING ladder would cost to buy today — a comparison, never the plan (6.13.5).
 *
 * A locked plan's ladder is the one priced when it was locked (it sits in the plan document). Rebuilding it
 * from today's prices gave a different order sheet every day, and after a year or two a nonsense one (a gilt
 * that has matured is no longer in the list to buy). This takes the locked orders as they are and prices the
 * same gilts, for the same income, at today's clean price, index ratio and dealing spread:
 *   - a rung that has already matured is paid, not bought: it is left out of both sides and counted in `paid`;
 *   - a gilt that is not in today's list cannot be priced: left out of both sides and named in `unpriced`.
 * So with the prices of the day the ladder was built, `todayCost === lockedCost` exactly.
 *
 * @param {object} plan     buildGiltLadder() output as stored in the plan document
 * @param {Array}  linkers  today's linker universe ([{ tidm, cleanPrice, indexRatio, ... }])
 * @param {object} [o]      { todayIso | now, options } — the pricing date, as buildGiltLadder takes it
 * @returns {null | { asOf, rungs, paid, unpriced: string[], lockedCost, todayCost, difference, orders: [] }}
 */
export function repriceLadder(plan, linkers, o = {}) {
  if (!plan || !Array.isArray(plan.orders)) return null;
  const opt = { ...LADDER_DEFAULTS, ...(o.options || {}) };
  const asOf = o.todayIso || (o.now || new Date()).toISOString().slice(0, 10);
  const today = Date.parse(asOf);
  const byTidm = new Map((linkers || []).filter((g) => g && g.tidm && g.cleanPrice != null).map((g) => [g.tidm, g]));
  const orders = [], unpriced = [];
  let paid = 0, lockedCost = 0, todayCost = 0;
  for (const ord of plan.orders) {
    if (!(ord.pays > 0)) continue;                                   // a rung that buys nothing is not an order
    if (Date.parse(ord.matures) <= today) { paid++; continue; }
    const g = byTidm.get(ord.tidm);
    if (!g) { unpriced.push(ord.tidm); continue; }
    const t = (Date.parse(ord.matures) - today) / (365.25 * 864e5);
    // The same units pay more pounds as the index ratio grows: the income bought is unchanged in real terms.
    const uplift = ord.indexRatio > 0 && g.indexRatio > 0 ? g.indexRatio / ord.indexRatio : 1;
    const cost = ord.pays * uplift * g.cleanPrice / 100 * (1 + spreadFor(t, opt)) + opt.dealFee;
    lockedCost += ord.cost; todayCost += cost;
    orders.push({ tidm: ord.tidm, name: ord.name, matures: ord.matures, lockedCost: ord.cost, todayCost: cost });
  }
  return { asOf, rungs: orders.length, paid, unpriced, lockedCost, todayCost, difference: todayCost - lockedCost, orders };
}
