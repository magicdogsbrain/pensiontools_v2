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

export const LADDER_DEFAULTS = { cashYears: 2, bridgeCash: 0, dealFee: 20, spreadShort: 0.0015, spreadMid: 0.0025, spreadLong: 0.004 };

/** Bid-offer allowance by years to maturity: 0.15% ≤5y, 0.25% ≤15y, 0.40% beyond. */
export function spreadFor(yearsToMaturity, o = LADDER_DEFAULTS) {
  return yearsToMaturity <= 5 ? o.spreadShort : yearsToMaturity <= 15 ? o.spreadMid : o.spreadLong;
}

/**
 * @param {object} p
 *  pot, startAge, durationYears, amountAtAge(age) → gross £/yr today's money,
 *  spAnnual, spStartAge, spFirstYearRatio (share of the first year SP is paid), firstTaxYear (Apr of),
 *  linkers: [{ name, tidm, isin, maturityDateIso, cleanPrice, indexRatio, lag }], cashYears, bridgeCash,
 *  todayIso
 */
export function buildGiltLadder(p) {
  const o = { ...LADDER_DEFAULTS, ...(p.options || {}) };
  const today = Date.parse(p.todayIso || new Date().toISOString().slice(0, 10));
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
    if (k <= cashYears) { cash += need; cashYearsList.push({ Y, age, gross, need }); years.push({ Y, age, gross, need, from: 'cash' }); continue; }
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
