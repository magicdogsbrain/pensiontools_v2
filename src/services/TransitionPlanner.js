/**
 * Transition planner — "how do I actually buy it?" (6.8.0)
 *
 * Target = the plan document (the order sheet for a gilt ladder; the year-0 target mix for a pot
 * strategy). Ledger = today's holdings (the tagged-funds list). This module diffs the two in units and
 * pounds per wrapper, lays the moves out on a dated schedule to the plan start (cash first, near rungs
 * before far ones, sales in tranches, new contributions before sales), and measures progress. It says
 * what to buy and sell; it never places an order. Pure: no DOM, no storage.
 */
import { tagPortfolio } from './PortfolioTagger.js';
import { taxYearLabel } from './PlanTiming.js';

const num = (v) => (Number.isFinite(+v) ? +v : 0);
const up = (s) => String(s || '').toUpperCase().trim();
export const TRANSITION_TOLERANCE = 0.02;   // a rung within 2% of its target counts as held
const MONEY_MARKET = new Set(['CSH2', 'CASH', 'MMF', 'XSTR', 'ERNS', 'ERNX']);

/** Is this ledger line a gilt? By ticker shape (TRxx / TGxx / Txx) or an explicit kind. */
export function isGiltTicker(t) { return /^T[RGNS]?\d{2}[A-Z]?$/.test(up(t)) || /^GB00B/.test(up(t)); }

/**
 * The plan's target holdings, from the plan document.
 * @returns {{ kind: 'ladder'|'buckets'|'none', lines: [], cash: { value }|null, note }}
 */
export function targetHoldings(doc) {
  const d = doc || {};
  const plan = d.strategy?.r?.plan;
  if (d.strategy?.contract && plan && Array.isArray(plan.orders)) {
    // A gilt that pays nothing is not a target (6.11.3): its years are covered by a lump sum expected later or other income.
    const lines = plan.orders.filter((o) => num(o.pays) > 0).map((o) => ({
      key: 'gilt:' + up(o.tidm || o.sedol || o.name), wrapper: 'SIPP', kind: 'gilt',
      label: o.name, ticker: up(o.tidm), sedol: o.sedol || null, matures: o.matures || null,
      units: Math.round(num(o.nominal)), cost: Math.round(num(o.cost)), pays: Math.round(num(o.pays)),
      taxYears: Array.isArray(o.taxYears) ? o.taxYears.slice() : [], cleanPrice: num(o.cleanPrice) || null, indexRatio: num(o.indexRatio) || null
    }));
    return { kind: 'ladder', lines, cash: { key: 'cash:SIPP', wrapper: 'SIPP', kind: 'cash', label: 'Money-market fund / cash for the cash years' + (Array.isArray(plan.cashYears) && plan.cashYears.length ? ' (' + plan.cashYears.map((c) => taxYearLabel(c.Y)).join(', ') + ')' : ''), value: Math.round(num(plan.cash)) }, note: 'The ladder is bought in the SIPP. The ISA is ' + (d.pots?.isaPolicy === 'hold' ? 'held aside and not part of the ladder.' : 'drawn by its own policy and not part of the ladder.') };
  }
  const mix = Array.isArray(d.targetMix) && d.targetMix.length ? d.targetMix[0] : null;
  const pot = num(d.pots?.potAtRetirement?.sipp) > 0 ? num(d.pots.potAtRetirement.sipp) : num(d.pots?.sipp);
  if (mix && pot > 0) {
    const lines = [
      { key: 'bucket:shares', wrapper: 'SIPP', kind: 'bucket', bucket: 'shares', label: 'Shares (world tracker)', value: Math.round(pot * mix.equity / 100), pct: mix.equity },
      { key: 'bucket:bonds', wrapper: 'SIPP', kind: 'bucket', bucket: 'bonds', label: 'Bonds (gilts / index-linked / global agg)', value: Math.round(pot * mix.bond / 100), pct: mix.bond },
      { key: 'bucket:cash', wrapper: 'SIPP', kind: 'bucket', bucket: 'cash', label: 'Cash (money-market fund)', value: Math.round(pot * mix.cash / 100), pct: mix.cash }
    ];
    return { kind: 'buckets', lines, cash: null, note: 'A pot strategy: the target is a mix, not a list of funds. Any world tracker, gilt fund or money-market fund fills its bucket; the Stress tester\'s "Example funds" shows one way.' };
  }
  return { kind: 'none', lines: [], cash: null, note: 'No plan document yet — lock the plan first.' };
}

/** Today's holdings, normalised: ticker, wrapper, value, units, bucket, and whether it is a gilt or cash. */
export function ledgerView(holdings) {
  const list = (holdings || []).filter((h) => h && (num(h.value) > 0 || num(h.units) > 0));
  const tagged = tagPortfolio(list.map((h) => ({ ...h, value: num(h.value) })));
  const bucketOf = new Map(); for (const t of tagged.tagged) bucketOf.set(t, t.bucket);
  return list.map((h) => {
    const ticker = up(h.ticker);
    const gilt = isGiltTicker(ticker) || h.kind === 'gilt';
    const cash = MONEY_MARKET.has(ticker) || up(h.wrapper) === 'CASH' || h.kind === 'cash' || h.subClass === 'cash' || h.subClass === 'moneyMarket';
    const slice = tagged.tagged.find((t) => t.ticker === h.ticker && t.wrapper === h.wrapper && Math.abs(num(t.value) - num(h.value)) < 1);
    return { ticker, name: h.name || '', sedol: h.sedol || null, wrapper: up(h.wrapper) === 'CASH' ? 'SIPP' : (up(h.wrapper) || 'SIPP'), value: num(h.value), units: num(h.units) || null, gilt, cash, bucket: cash ? 'cash' : gilt ? 'bonds' : (slice ? slice.bucket : (h.subClass ? 'shares' : null)) };
  });
}

/**
 * Diff the ledger against the target.
 * @returns {{ kind, buy: [], sell: [], hold: [], keep: [], totals: { buyCost, sellValue, cashHeld, cashTarget, contributionsNeeded }, progressPct }}
 */
export function diffHoldings(holdings, target, { tolerance = TRANSITION_TOLERANCE } = {}) {
  const L = ledgerView(holdings);
  const sipp = L.filter((h) => h.wrapper === 'SIPP');
  const buy = [], sell = [], hold = [], keep = L.filter((h) => h.wrapper !== 'SIPP').map((h) => ({ ...h, why: h.wrapper === 'ISA' ? 'ISA — kept as it is' : 'taxable account — kept as it is' }));
  let targetTotal = 0, heldOfTarget = 0;
  if (target.kind === 'ladder') {
    const used = new Set();
    // A rung matches a ledger gilt by code, by SEDOL, or — the pasted name gave only a guessed code like
    // "T31" — by maturity year (6.10.5). Each ledger line is used once.
    const yearOf = (x) => { const m = String(x || '').match(/(20\d{2})/); if (m) return +m[1]; const c = String(x || '').match(/^T[RGNS]?(\d{2})[A-Z]?$/i); return c ? 2000 + +c[1] : null; };
    for (const t of target.lines) {
      const ty = yearOf(t.matures) || yearOf(t.label) || yearOf(t.ticker);
      const rows = sipp.filter((h) => !used.has(h) && h.gilt && (h.ticker === t.ticker || (t.sedol && (up(h.sedol) === up(t.sedol) || up(h.name).includes(up(t.sedol)))) || (h.ticker && t.label && up(t.label).includes(h.ticker)) || (ty && (yearOf(h.name) === ty || yearOf(h.ticker) === ty))));
      rows.forEach((r) => used.add(r));
      const unitPrice = t.cleanPrice && t.indexRatio ? (t.cleanPrice * t.indexRatio / 100) : (t.units > 0 ? t.cost / t.units : null);
      const heldUnits = rows.reduce((s, r) => s + (r.units != null ? r.units : (unitPrice ? r.value / unitPrice : 0)), 0);
      const delta = t.units - heldUnits;
      targetTotal += t.cost; heldOfTarget += Math.min(t.cost, unitPrice ? heldUnits * unitPrice : 0);
      if (t.units > 0 && Math.abs(delta) <= tolerance * t.units) hold.push({ ...t, heldUnits: Math.round(heldUnits) });
      else if (delta > 0) buy.push({ ...t, units: Math.round(delta), amount: Math.round(unitPrice ? delta * unitPrice : t.cost * (delta / t.units)), heldUnits: Math.round(heldUnits), why: 'rung for ' + t.taxYears.map(taxYearLabel).join(', ') });
      else sell.push({ ...t, units: Math.round(-delta), amount: Math.round(unitPrice ? -delta * unitPrice : 0), heldUnits: Math.round(heldUnits), why: 'more than the rung needs' });
    }
    const cashHeld = sipp.filter((h) => h.cash).reduce((s, h) => s + h.value, 0);
    const cashTarget = target.cash ? target.cash.value : 0;
    targetTotal += cashTarget; heldOfTarget += Math.min(cashTarget, cashHeld);
    if (cashTarget > 0 && Math.abs(cashTarget - cashHeld) <= tolerance * cashTarget) hold.push({ ...target.cash, heldValue: Math.round(cashHeld) });
    else if (cashTarget > cashHeld) buy.push({ ...target.cash, amount: Math.round(cashTarget - cashHeld), heldValue: Math.round(cashHeld), why: 'the cash years' });
    else if (cashHeld > cashTarget) sell.push({ ...target.cash, amount: Math.round(cashHeld - cashTarget), heldValue: Math.round(cashHeld), why: 'more cash than the cash years need' });
    // Everything else in the SIPP funds the buys
    for (const h of sipp) if (!used.has(h) && !h.cash) sell.push({ key: 'sell:' + h.ticker, wrapper: 'SIPP', kind: h.gilt ? 'gilt' : 'fund', label: h.name || h.ticker, ticker: h.ticker, amount: Math.round(h.value), units: h.units, why: 'not in the plan — proceeds fund the ladder' });
  } else if (target.kind === 'buckets') {
    const held = { shares: 0, bonds: 0, cash: 0, diversifiers: 0 };
    for (const h of sipp) held[h.bucket || 'shares'] += h.value;
    for (const t of target.lines) {
      const hv = held[t.bucket] || 0; const delta = t.value - hv;
      targetTotal += t.value; heldOfTarget += Math.min(t.value, hv);
      if (t.value > 0 && Math.abs(delta) <= tolerance * t.value) hold.push({ ...t, heldValue: Math.round(hv) });
      else if (delta > 0) buy.push({ ...t, amount: Math.round(delta), heldValue: Math.round(hv), why: 'bring ' + t.bucket + ' up to ' + t.pct + '% of the pot' });
      else sell.push({ ...t, amount: Math.round(-delta), heldValue: Math.round(hv), why: 'bring ' + t.bucket + ' down to ' + t.pct + '% of the pot' });
    }
    if (held.diversifiers > 0) sell.push({ key: 'bucket:diversifiers', wrapper: 'SIPP', kind: 'bucket', bucket: 'diversifiers', label: 'Diversifiers', amount: Math.round(held.diversifiers), why: 'not in the target mix' });
  }
  const buyCost = buy.reduce((s, b) => s + num(b.amount), 0), sellValue = sell.reduce((s, b) => s + num(b.amount), 0);
  return { kind: target.kind, buy, sell, hold, keep, totals: { buyCost: Math.round(buyCost), sellValue: Math.round(sellValue), shortfall: Math.round(Math.max(0, buyCost - sellValue)) }, progressPct: targetTotal > 0 ? Math.round(100 * heldOfTarget / targetTotal) : 0 };
}

/**
 * A dated schedule to the plan start: cash and near rungs first, sales in tranches, contributions before sales.
 * @param {ReturnType<typeof diffHoldings>} diff
 * @param {{ today?: Date, startYear: number, contributionsMonthly?: number, trancheMonths?: number, decisionPoint?: { when: string, label: string } }} o
 * @returns {{ steps: [{ when, action, wrapper, label, ticker, units, amount, why }], months, tranches, funded: boolean, note }}
 */
export function sequence(diff, { today = new Date(), startYear, startMonth = null, contributionsMonthly = 0, trancheMonths = 3, horizonMonths = 6 } = {}) {
  // The deadline is the retirement month when known (a future retiree), else 6 April of plan year 0. Once the
  // plan is already running there is no deadline: reconcile over a rolling horizon instead (6.10.5).
  let start;
  if (startMonth && /^\d{4}-\d{2}$/.test(startMonth)) { const [y, m] = startMonth.split('-').map(Number); start = new Date(y, m - 1, 1); }
  else start = new Date(+startYear || today.getFullYear() + 1, 3, 6);
  const startPassed = start.getTime() <= today.getTime();
  const months = startPassed ? Math.max(1, horizonMonths) : Math.max(1, Math.round((start.getTime() - today.getTime()) / (30.44 * 24 * 3600 * 1000)));
  const tranches = Math.max(1, Math.ceil(months / trancheMonths));
  const monthKey = (k) => { const d = new Date(today.getFullYear(), today.getMonth() + k, 1); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0'); };
  // Buy order: cash years first, then rungs by maturity, then buckets bonds → cash → shares
  const order = (b) => b.kind === 'cash' ? 0 : b.kind === 'gilt' ? 1 + (b.matures ? new Date(b.matures).getFullYear() / 10000 : 0.5) : b.bucket === 'bonds' ? 2 : b.bucket === 'cash' ? 2.5 : 3;
  const buys = diff.buy.slice().sort((a, b) => order(a) - order(b));
  const sells = diff.sell.slice().sort((a, b) => num(b.amount) - num(a.amount));
  const totalBuy = buys.reduce((s, b) => s + num(b.amount), 0);
  const totalSell = sells.reduce((s, b) => s + num(b.amount), 0);
  const contributions = num(contributionsMonthly) * months;
  const funded = totalSell + contributions >= totalBuy - 1;
  const steps = [];
  const perTranche = totalBuy / tranches;
  let bi = 0, remainingInBuy = buys.length ? num(buys[0].amount) : 0;
  for (let t = 0; t < tranches; t++) {
    const when = monthKey(t * trancheMonths);
    let budget = perTranche;
    // Sales for this tranche: the share of each sale not covered by contributions, spread evenly
    const contribThis = num(contributionsMonthly) * Math.min(trancheMonths, months - t * trancheMonths);
    let needFromSales = Math.max(0, budget - contribThis);
    for (const s of sells) { const part = Math.round(num(s.amount) / tranches); if (part > 0) steps.push({ when, action: 'sell', wrapper: s.wrapper, label: s.label, ticker: s.ticker || null, units: s.units ? Math.round(s.units / tranches) : null, amount: part, why: s.why }); }
    // Buys: walk the ordered list until this tranche's budget is used
    while (bi < buys.length && budget > 0) {
      const b = buys[bi];
      const take = Math.min(remainingInBuy, budget);
      const frac = num(b.amount) > 0 ? take / num(b.amount) : 1;
      steps.push({ when, action: 'buy', wrapper: b.wrapper, label: b.label, ticker: b.ticker || null, units: b.units ? Math.round(b.units * frac) : null, amount: Math.round(take), why: b.why });
      budget -= take; remainingInBuy -= take;
      if (remainingInBuy <= 0.5) { bi++; remainingInBuy = bi < buys.length ? num(buys[bi].amount) : 0; }
    }
  }
  return { steps, months, tranches, funded, startPassed, totals: { buy: Math.round(totalBuy), sell: Math.round(totalSell), contributions: Math.round(contributions) },
    note: funded ? 'Funded by sales' + (contributions > 0 ? ' and contributions' : '') + '.' : 'Short by ' + Math.round(totalBuy - totalSell - contributions).toLocaleString('en-GB') + ' — the plan was priced on a bigger pot than the ledger holds, or holdings are missing from the ledger.' };
}

/** Progress and the next item, with tick-offs applied. */
export function progress(diff, done = {}) {
  const items = [...diff.buy.map((b) => ({ ...b, action: 'buy' })), ...diff.sell.map((s) => ({ ...s, action: 'sell' }))];
  const outstanding = items.filter((i) => !done[i.key]);
  const doneCount = items.length - outstanding.length;
  return { pct: items.length ? Math.round(100 * (diff.progressPct / 100 * 0 + (items.length - outstanding.length) / items.length)) : 100, held: diff.progressPct, doneCount, total: items.length, next: outstanding[0] || null };
}
