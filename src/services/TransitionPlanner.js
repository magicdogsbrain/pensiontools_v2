/**
 * Transition planner — "how do I actually buy it?" (6.8.0)
 *
 * Target = the plan document (the order sheet for a gilt ladder; the year-0 target mix for a pot
 * strategy). Ledger = today's holdings — the plan's `holdings.lines` record (6.12: NOT the Stress tester's
 * fund list, which is a strategy input). This module diffs the two in units and pounds per wrapper, lays
 * the moves out on a dated schedule to the plan start (cash first, near rungs before far ones, sales in
 * tranches, new contributions before sales), and measures progress. It says what to buy and sell; it
 * never places an order. Pure: no DOM, no storage.
 *
 * Time-aware (6.12, corrected 6.13): a ladder target is read against TODAY. A rung whose gilt has matured has
 * paid — it is no longer a target (the ladder buys gilts maturing BEFORE the April their year starts, so the
 * date, not the tax year, is the test). Once the plan is running the cash years' money is being spent as
 * designed, so cash is reported (held vs target) rather than diffed as a move. Rungs the rotation sold are not
 * targets either, and the fund their proceeds bought is kept. Spare SIPP cash and bank cash are never sells.
 */
import { tagPortfolio } from './PortfolioTagger.js';
import { taxYearLabel, taxYearStartOf } from './PlanTiming.js';
import giltsSnapshot from '../data/giltsSnapshot.js';

const num = (v) => (Number.isFinite(+v) ? +v : 0);
const up = (s) => String(s || '').toUpperCase().trim();
const gbp = (v) => '£' + Math.round(num(v)).toLocaleString('en-GB');
const dateGB = (iso) => { const d = new Date(String(iso).slice(0, 10) + 'T00:00:00Z'); return Number.isNaN(d.getTime()) ? String(iso) : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }); };
export const TRANSITION_TOLERANCE = 0.02;   // a rung within 2% of its target counts as held
const MONEY_MARKET = new Set(['CSH2', 'CASH', 'MMF', 'XSTR', 'ERNS', 'ERNX']);
// Every TIDM in the bundled gilt universe (6.13.0): codes like TRTQ, T2IL or TR8F fit no ticker pattern.
const GILT_TIDMS = new Set((Array.isArray(giltsSnapshot?.gilts) ? giltsSnapshot.gilts : []).map((g) => up(g && g.tidm)).filter(Boolean));

/** Is this ledger line a gilt? A TIDM in the bundled universe, a ticker shape (TRxx / TGxx / Txx) or a GB00B… ISIN. */
export function isGiltTicker(t) { const u = up(t); return GILT_TIDMS.has(u) || /^T[RGNS]?\d{2}[A-Z]?$/.test(u) || /^GB00B/.test(u); }

/** The plan's first tax year: the plan object's own anchor, else the document's timing, else the earliest year it funds. */
function planStartYear(d, plan) {
  if (+plan?.firstTaxYear > 0) return +plan.firstTaxYear;
  if (+d.timing?.firstTaxYear > 0) return +d.timing.firstTaxYear;
  if (+d.assumptions?.firstTaxYear > 0) return +d.assumptions.firstTaxYear;
  const ys = [...(Array.isArray(plan?.cashYears) ? plan.cashYears.map((c) => +c.Y) : []), ...(Array.isArray(plan?.orders) ? plan.orders.flatMap((o) => (Array.isArray(o.taxYears) ? o.taxYears.map(Number) : [])) : [])].filter((y) => y > 2000);
  return ys.length ? Math.min(...ys) : null;
}

/**
 * Is the plan running on `today`? From 6 April of its first tax year — or, for someone retiring later in
 * that year, from the retirement month the document carries (`timing.startMonth`, 'YYYY-MM').
 */
export function planRunning(doc, today = new Date()) {
  const d = doc || {};
  const plan = d.strategy?.r?.plan;
  const fty = planStartYear(d, plan);
  if (!(fty > 0)) return false;
  if (taxYearStartOf(today) < fty) return false;
  const sm = d.timing?.startMonth;
  if (typeof sm === 'string' && /^\d{4}-\d{2}$/.test(sm)) {
    const nowKey = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0');
    return nowKey >= sm;
  }
  return true;
}

/**
 * The plan's target holdings, from the plan document, as of `today`.
 * @param {object} doc      the plan document
 * @param {{ today?: Date, params?: object|null }} o   `params` — the LIVE strategy params when the shell has them: the
 *   document is a lock-time snapshot, so a rotation fired afterwards (its `borrowedFloor`) is only on the live settings.
 * @returns {{ kind: 'ladder'|'buckets'|'none', lines: [], paid: [], sold: [], rotated: boolean,
 *   cash: { value, spending, yearsLeft, bridgeCash }|null, running: boolean, thisTaxYear: number, firstTaxYear: number|null, note }}
 *   `paid` = rungs whose gilt has matured (no longer targets). `sold` = rungs the rotation sold (no longer targets;
 *   `rotated` says the equity fund it bought is the plan now). `cash.spending` = true once the plan is running: the cash
 *   years are being spent, so the value is what the years still ahead need, for information.
 */
export function targetHoldings(doc, { today = new Date(), params = null } = {}) {
  const d = doc || {};
  const plan = d.strategy?.r?.plan;
  const thisTY = taxYearStartOf(today);
  if (d.strategy?.contract && plan && Array.isArray(plan.orders)) {
    const firstTaxYear = planStartYear(d, plan);
    const running = planRunning(d, today);
    const toLine = (o) => ({
      key: 'gilt:' + up(o.tidm || o.sedol || o.name), wrapper: 'SIPP', kind: 'gilt',
      label: o.name, ticker: up(o.tidm), sedol: o.sedol || null, matures: o.matures || null,
      units: Math.round(num(o.nominal)), cost: Math.round(num(o.cost)), pays: Math.round(num(o.pays)),
      taxYears: Array.isArray(o.taxYears) ? o.taxYears.slice() : [], cleanPrice: num(o.cleanPrice) || null, indexRatio: num(o.indexRatio) || null
    });
    // A gilt that pays nothing is not a target (6.11.3): its years are covered by a lump sum expected later or other income.
    const paying = plan.orders.filter((o) => num(o.pays) > 0);
    // A rung retires once its gilt has MATURED (6.13.0): the ladder buys gilts maturing before the April their tax year
    // starts, so from redemption to that 6 April the money is cash, not a rung to hold — the old "every tax year passed"
    // rule kept a redeemed gilt as a target for up to a year. No maturity date → paid once every year it funds has passed.
    const isPaid = (o) => { const m = o.matures ? Date.parse(o.matures) : NaN; return Number.isFinite(m) ? m < today.getTime() : (Array.isArray(o.taxYears) && o.taxYears.length > 0 && o.taxYears.every((Y) => +Y < thisTY)); };
    // Rungs the rotation sold are not targets either: the borrowed floor (live params first — the document is a snapshot
    // — then the document's params or its rotation record) lists their TIDMs; the proceeds bought the equity fund.
    const bf = (params && params.borrowedFloor) || d.strategy?.params?.borrowedFloor || d.rotation?.borrowedFloor || null;
    const soldTidms = new Set(bf && Array.isArray(bf.tidms) ? bf.tidms.map(up).filter(Boolean) : []);
    const isSold = (o) => soldTidms.has(up(o.tidm));
    const live = paying.filter((o) => !isSold(o));
    const lines = live.filter((o) => !isPaid(o)).map(toLine);
    const paid = live.filter(isPaid).map(toLine);
    const sold = paying.filter(isSold).map(toLine);
    const rotated = !!bf;
    const cashYears = Array.isArray(plan.cashYears) ? plan.cashYears : [];
    const yearsLeft = cashYears.filter((c) => +c.Y >= thisTY).map((c) => +c.Y);
    // plan.cash INCLUDES the bridge cash (GiltLadderPlan.js: `let cash = p.bridgeCash`), which the run-up spends by design,
    // so the target before the start is the cash YEARS' money only: their costs when the plan carries them, else plan.cash
    // less the bridge. The bridge travels on the cash line as information.
    const bridgeCash = Math.max(0, num(d.assumptions?.bridgeCash ?? d.strategy?.params?.bridgeCash));
    const cyCost = cashYears.reduce((s, c) => s + num(c.cost), 0);
    const cashYearsMoney = cyCost > 0 ? cyCost : Math.max(0, num(plan.cash) - bridgeCash);
    // While running, the cash target is what the cash years still ahead need (the current one in full — part of it
    // is already spent, which is exactly why this is information and not a move). From `years` when the plan carries
    // them, else the cash years' money pro-rated by the years left.
    let cashValue = Math.round(cashYearsMoney);
    // Before the start the run-up months still to pay are cash to hold NOW too (6.13.2): each month's draw from the
    // year-0 row of the plan's timeline (gross less State Pension and other income), for the months left to the start,
    // capped at the bridge cash the plan set aside. Spent months drop out as they pass.
    let runUp = { months: 0, monthly: 0, value: 0 };
    if (!running && bridgeCash > 0) {
      const t0 = Array.isArray(d.timeline) && d.timeline[0] ? d.timeline[0] : null;
      const monthly = t0 ? Math.max(0, (num(t0.gross) - num(t0.sp) - num(t0.other)) / 12) : 0;
      const startTs = Date.UTC(firstTaxYear || thisTY + 1, 3, 6);
      const months = Math.max(0, Math.round((startTs - today.getTime()) / (30.44 * 86400000)));
      runUp = { months, monthly: Math.round(monthly), value: Math.round(Math.min(bridgeCash, monthly * months)) };
      cashValue += runUp.value;
    }
    if (running) {
      if (Array.isArray(plan.years) && plan.years.length) cashValue = Math.round(plan.years.filter((y) => y.from === 'cash' && +y.Y >= thisTY).reduce((t, y) => t + num(y.need), 0));
      else if (cashYears.length) cashValue = Math.round(cashYearsMoney * yearsLeft.length / cashYears.length);
    }
    const cash = { key: 'cash:SIPP', wrapper: 'SIPP', kind: 'cash', label: 'Money-market fund / cash for the cash years' + (cashYears.length ? ' (' + (running ? yearsLeft : cashYears.map((c) => +c.Y)).map(taxYearLabel).join(', ') + ')' : '') + (runUp.value > 0 ? ' + the ' + runUp.months + ' run-up month' + (runUp.months === 1 ? '' : 's') + ' still to pay (' + gbp(runUp.value) + ')' : ''), value: cashValue, runUp, spending: running, yearsLeft: running ? yearsLeft : cashYears.map((c) => +c.Y), bridgeCash: Math.round(bridgeCash) };
    let note = 'The ladder is bought in the SIPP. The ISA is ' + (d.pots?.isaPolicy === 'hold' ? 'held aside and not part of the ladder.' : 'drawn by its own policy and not part of the ladder.');
    if (bridgeCash > 0 && !running) note += runUp.value > 0 ? ' The run-up is paid from the same cash: ' + runUp.months + ' month' + (runUp.months === 1 ? '' : 's') + ' at about ' + gbp(runUp.monthly) + ' are still to come, so ' + gbp(runUp.value) + ' of the ' + gbp(bridgeCash) + ' set aside is in the target; the rest has been spent as designed.' : ' The ' + gbp(bridgeCash) + ' of bridge cash for the run-up has been spent as designed, so it is no longer a target.';
    if (running) note += ' The plan is running (tax year ' + taxYearLabel(thisTY) + ')' + (paid.length ? ': ' + paid.length + ' rung' + (paid.length === 1 ? ' has' : 's have') + ' matured and paid, so ' + (paid.length === 1 ? 'it is' : 'they are') + ' no longer targets' : '') + '; the cash years\' money is being spent as designed, so cash is reported, not diffed.';
    if (sold.length) note += ' The rotation fired' + (bf.soldAt ? ' on ' + dateGB(bf.soldAt) : '') + ': ' + sold.length + ' rung' + (sold.length === 1 ? ' was' : 's were') + ' sold and the proceeds bought the equity fund, so ' + (sold.length === 1 ? 'it is no longer a target' : 'they are no longer targets') + ' and the fund is kept.';
    return { kind: 'ladder', lines, paid, sold, rotated, cash, running, thisTaxYear: thisTY, firstTaxYear, note };
  }
  const mix = Array.isArray(d.targetMix) && d.targetMix.length ? d.targetMix[0] : null;
  const pot = num(d.pots?.potAtRetirement?.sipp) > 0 ? num(d.pots.potAtRetirement.sipp) : num(d.pots?.sipp);
  if (mix && pot > 0) {
    const lines = [
      { key: 'bucket:shares', wrapper: 'SIPP', kind: 'bucket', bucket: 'shares', label: 'Shares (world tracker)', value: Math.round(pot * mix.equity / 100), pct: mix.equity },
      { key: 'bucket:bonds', wrapper: 'SIPP', kind: 'bucket', bucket: 'bonds', label: 'Bonds (gilts / index-linked / global agg)', value: Math.round(pot * mix.bond / 100), pct: mix.bond },
      { key: 'bucket:cash', wrapper: 'SIPP', kind: 'bucket', bucket: 'cash', label: 'Cash (money-market fund)', value: Math.round(pot * mix.cash / 100), pct: mix.cash }
    ];
    return { kind: 'buckets', lines, paid: [], sold: [], rotated: false, cash: null, running: planRunning(d, today), thisTaxYear: thisTY, firstTaxYear: planStartYear(d, null), note: 'A pot strategy: the target is a mix, not a list of funds. Any world tracker, gilt fund or money-market fund fills its bucket; the Stress tester\'s "Example funds" shows one way.' };
  }
  return { kind: 'none', lines: [], paid: [], sold: [], rotated: false, cash: null, running: false, thisTaxYear: thisTY, firstTaxYear: null, note: 'No plan document yet — lock the plan first.' };
}

/**
 * Today's holdings, normalised: ticker, wrapper, value, units, bucket, and whether it is a gilt or cash. A CASH
 * wrapper (bank / savings money) keeps its wrapper (6.13.0) — it is outside the pension and never the SIPP's cash years.
 */
export function ledgerView(holdings) {
  const list = (holdings || []).filter((h) => h && (num(h.value) > 0 || num(h.units) > 0));
  const tagged = tagPortfolio(list.map((h) => ({ ...h, value: num(h.value) })));
  return list.map((h) => {
    const ticker = up(h.ticker);
    const gilt = isGiltTicker(ticker) || h.kind === 'gilt';
    const cash = MONEY_MARKET.has(ticker) || up(h.wrapper) === 'CASH' || h.kind === 'cash' || h.subClass === 'cash' || h.subClass === 'moneyMarket';
    const slice = tagged.tagged.find((t) => t.ticker === h.ticker && t.wrapper === h.wrapper && Math.abs(num(t.value) - num(h.value)) < 1);
    return { ticker, name: h.name || '', sedol: h.sedol || null, wrapper: up(h.wrapper) || 'SIPP', value: num(h.value), units: num(h.units) || null, gilt, cash, bucket: cash ? 'cash' : gilt ? 'bonds' : (slice ? slice.bucket : (h.subClass ? 'shares' : null)) };
  });
}

/**
 * Diff the ledger against the target.
 * @returns {{ kind, buy: [], sell: [], hold: [], keep: [], matured: [], sold: [], cashInfo: { held, target, yearsLeft }|null,
 *   totals: { buyCost, sellValue, shortfall, cashHeld, cashTarget }, progressPct, complete: boolean, reason: string }}
 *   `complete` = no buys, no sells, and every remaining target held. `matured` / `sold` = ledger gilts that match a rung
 *   already paid / sold by the rotation (stale lines to remove from the record — not sales). `keep` = ISA, GIA and bank
 *   cash lines, plus — once the rotation has fired — the equity fund it bought. `cashInfo` is set while the plan is
 *   running: cash is being spent, so it is reported here and never diffed as a move. A cash `hold` before the start
 *   carries `spare` (held above the target): spare cash is never a sell.
 */
export function diffHoldings(holdings, target, { tolerance = TRANSITION_TOLERANCE } = {}) {
  const L = ledgerView(holdings);
  const sipp = L.filter((h) => h.wrapper === 'SIPP');
  const keepWhy = (h) => h.wrapper === 'ISA' ? 'ISA — kept as it is' : h.wrapper === 'CASH' ? 'bank / savings cash — outside the pension, kept as it is' : 'taxable account — kept as it is';
  const buy = [], sell = [], hold = [], matured = [], sold = [], keep = L.filter((h) => h.wrapper !== 'SIPP').map((h) => ({ ...h, why: keepWhy(h) }));
  let targetTotal = 0, heldOfTarget = 0, targetCount = 0, cashHeld = 0, cashTarget = 0, cashInfo = null;
  if (target.kind === 'ladder') {
    const used = new Set();
    const yearOf = (x) => { const m = String(x || '').match(/(20\d{2})/); if (m) return +m[1]; const c = String(x || '').match(/^T[RGNS]?(\d{2})[A-Z]?$/i); return c ? 2000 + +c[1] : null; };
    // Two passes (6.13.0): every rung takes its EXACT matches (code or SEDOL) first; only a rung left with nothing then
    // falls back to the maturity year — the pasted name gave only a guessed code like "T31" (6.10.5). Each ledger line
    // is used once, so two linkers maturing the same year (T2IL and TR35, both 2035) cannot be mis-paired.
    const exact = (h, t) => (h.ticker && t.ticker && h.ticker === t.ticker) || (t.sedol && (up(h.sedol) === up(t.sedol) || up(h.name).includes(up(t.sedol))));
    const loose = (h, t, ty) => (h.ticker && h.ticker.length >= 3 && t.label && up(t.label).includes(h.ticker)) || (ty && (yearOf(h.name) === ty || yearOf(h.ticker) === ty));
    const all = [...(target.paid || []), ...(target.sold || []), ...target.lines];
    const rowsOf = new Map();
    const take = (t, pred) => { const rows = sipp.filter((h) => !used.has(h) && h.gilt && pred(h)); rows.forEach((r) => used.add(r)); rowsOf.set(t, rows); };
    for (const t of all) take(t, (h) => exact(h, t));
    for (const t of all) if (!rowsOf.get(t).length) { const ty = yearOf(t.matures) || yearOf(t.label) || yearOf(t.ticker); take(t, (h) => loose(h, t, ty)); }
    const rowsFor = (t) => rowsOf.get(t) || [];
    // Rungs already paid (6.12): a ledger line still carrying one is stale — the platform paid it out — not a sale.
    for (const t of (target.paid || [])) for (const r of rowsFor(t)) matured.push({ ...r, key: 'matured:' + (r.ticker || t.ticker), label: r.name || r.ticker || t.label, rung: t.label, why: 'matured and paid' + (t.taxYears.length ? ' in ' + t.taxYears.map(taxYearLabel).join(', ') : '') + ' — remove it from your record' });
    // Rungs the rotation sold: a line still carrying one is stale too — the sale is on record — not a sale to make.
    for (const t of (target.sold || [])) for (const r of rowsFor(t)) sold.push({ ...r, key: 'sold:' + (r.ticker || t.ticker), label: r.name || r.ticker || t.label, rung: t.label, why: 'sold by the rotation — remove it from your record' });
    for (const t of target.lines) {
      const rows = rowsFor(t);
      const unitPrice = t.cleanPrice && t.indexRatio ? (t.cleanPrice * t.indexRatio / 100) : (t.units > 0 ? t.cost / t.units : null);
      const heldUnits = rows.reduce((s, r) => s + (r.units != null ? r.units : (unitPrice ? r.value / unitPrice : 0)), 0);
      const delta = t.units - heldUnits;
      targetTotal += t.cost; heldOfTarget += Math.min(t.cost, unitPrice ? heldUnits * unitPrice : 0); targetCount++;
      if (t.units > 0 && Math.abs(delta) <= tolerance * t.units) hold.push({ ...t, heldUnits: Math.round(heldUnits) });
      else if (delta > 0) buy.push({ ...t, units: Math.round(delta), amount: Math.round(unitPrice ? delta * unitPrice : t.cost * (delta / t.units)), heldUnits: Math.round(heldUnits), why: 'rung for ' + t.taxYears.map(taxYearLabel).join(', ') });
      else sell.push({ ...t, units: Math.round(-delta), amount: Math.round(unitPrice ? -delta * unitPrice : 0), heldUnits: Math.round(heldUnits), why: 'more than the rung needs' });
    }
    // SIPP money-market cash only: a CASH-wrapper line is bank money, kept outside the plan.
    cashHeld = sipp.filter((h) => h.cash).reduce((s, h) => s + h.value, 0);
    cashTarget = target.cash ? target.cash.value : 0;
    if (target.cash && target.cash.spending) {
      // The plan is running: the cash years are being spent as designed. Held vs target is information, not a move.
      cashInfo = { held: Math.round(cashHeld), target: Math.round(cashTarget), yearsLeft: Array.isArray(target.cash.yearsLeft) ? target.cash.yearsLeft.slice() : [] };
    } else if (target.cash) {
      targetTotal += cashTarget; heldOfTarget += Math.min(cashTarget, cashHeld); if (cashTarget > 0) targetCount++;
      // Spare SIPP cash before the start is never a sell (6.13.0): it is the run-up's spending money, the bridge, or a
      // float — held, with the spare said. Only a shortfall (beyond tolerance) is a move.
      if (cashTarget > 0 && cashHeld >= cashTarget * (1 - tolerance)) hold.push({ ...target.cash, heldValue: Math.round(cashHeld), spare: Math.round(Math.max(0, cashHeld - cashTarget)) });
      else if (cashTarget > cashHeld) buy.push({ ...target.cash, amount: Math.round(cashTarget - cashHeld), heldValue: Math.round(cashHeld), why: 'the cash years' });
    }
    // Everything else in the SIPP funds the buys — unless the rotation has fired: the fund its proceeds bought IS the plan now.
    for (const h of sipp) if (!used.has(h) && !h.cash) {
      if (target.rotated && !h.gilt) keep.push({ ...h, why: 'bought by the rotation — kept' });
      else sell.push({ key: 'sell:' + (h.ticker || h.name), wrapper: 'SIPP', kind: h.gilt ? 'gilt' : 'fund', label: h.name || h.ticker, ticker: h.ticker, amount: Math.round(h.value), units: h.units, why: 'not in the plan — proceeds fund the ladder' });
    }
  } else if (target.kind === 'buckets') {
    const held = { shares: 0, bonds: 0, cash: 0, diversifiers: 0 };
    for (const h of sipp) held[h.bucket || 'shares'] += h.value;
    cashHeld = held.cash;
    for (const t of target.lines) {
      const hv = held[t.bucket] || 0; const delta = t.value - hv;
      targetTotal += t.value; heldOfTarget += Math.min(t.value, hv); if (t.value > 0) targetCount++;
      if (t.bucket === 'cash') cashTarget = t.value;
      if (t.value > 0 && Math.abs(delta) <= tolerance * t.value) hold.push({ ...t, heldValue: Math.round(hv) });
      else if (delta > 0) buy.push({ ...t, amount: Math.round(delta), heldValue: Math.round(hv), why: 'bring ' + t.bucket + ' up to ' + t.pct + '% of the pot' });
      else if (t.value > 0 || hv > 0) sell.push({ ...t, amount: Math.round(-delta), heldValue: Math.round(hv), why: 'bring ' + t.bucket + ' down to ' + t.pct + '% of the pot' });
    }
    if (held.diversifiers > 0) sell.push({ key: 'bucket:diversifiers', wrapper: 'SIPP', kind: 'bucket', bucket: 'diversifiers', label: 'Diversifiers', amount: Math.round(held.diversifiers), why: 'not in the target mix' });
  }
  const buyCost = buy.reduce((s, b) => s + num(b.amount), 0), sellValue = sell.reduce((s, b) => s + num(b.amount), 0);
  // Complete = nothing to buy, nothing to sell, and every target that still counts is held (6.12). Said with a reason
  // so the page can say WHY it is (or is not) complete — a ladder with every remaining rung held reads "nothing to do".
  let complete = false, reason;
  if (target.kind === 'none') reason = 'no plan document to read against';
  else if (buy.length) reason = buy.length + ' line' + (buy.length === 1 ? '' : 's') + ' still to buy';
  else if (sell.length) reason = sell.length + ' line' + (sell.length === 1 ? '' : 's') + ' to sell';
  else if (hold.length < targetCount) reason = (targetCount - hold.length) + ' target line' + (targetCount - hold.length === 1 ? '' : 's') + ' not held';
  else if (targetCount === 0) { complete = true; reason = target.kind === 'ladder' ? 'every rung has matured and paid — nothing left to hold' : 'the target is empty'; }
  else { complete = true; reason = target.kind === 'ladder' ? 'every rung the plan still needs is held' + (target.cash && !target.cash.spending ? ', and the cash years are covered' : '') : 'every bucket is within ' + Math.round(tolerance * 100) + '% of its target'; }
  return { kind: target.kind, buy, sell, hold, keep, matured, sold, cashInfo,
    totals: { buyCost: Math.round(buyCost), sellValue: Math.round(sellValue), shortfall: Math.round(Math.max(0, buyCost - sellValue)), cashHeld: Math.round(cashHeld), cashTarget: Math.round(cashTarget) },
    progressPct: targetTotal > 0 ? Math.round(100 * heldOfTarget / targetTotal) : (complete ? 100 : 0), complete, reason };
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
