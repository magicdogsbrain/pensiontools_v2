/**
 * This month (lead4.md D17; step F5): ONE gatherer for the month's engine (legacyDecision.calcDecision through
 * services/MonthDecision.js), used by both views, and one builder each for the month's after-tax figure and for where it
 * comes from. The simple view's Month by month and the full view's Monthly Entry both call these; neither gathers the
 * engine's inputs itself.
 *
 *   monthReadingOf(plan, ctx, { month, pots, history?, taxYears?, entered?, paidAhead?, draftLadder? }) → the month worked out
 *       Everything is read from the plan (monthInputsOf: the settings as read, the effective Stress settings, the strategy,
 *       the records, the tax years, the plan year the pots' floors start from), on ctx.now (the one clock). `history` and
 *       `taxYears` replace the plan's own when a caller holds a newer copy of the same records (the full view's fill, between
 *       its writes). The overlay is the one ladder overlay (MonthDecision.decideMonth: the plan document's ladder; for a
 *       ladder plan with no document, `draftLadder()` gives the ladder its own run would buy, when the caller has one).
 *       The cadence is the plan's (decisionTool.cadence), in both views.
 *   monthAfterTaxOf(d)   what reaches the bank this month after tax: the engine's own figure; for a decision without one,
 *                        the engine's monthly tax taken off; else the flat tax estimate the caller gives (fallbackTax)
 *   monthFromOf(d)       where it comes from: [{ id, slots, amount }] (ids as src/v7/copy/month.js advice.from names them)
 *   monthFromText(d)     the same in words, as both views say it (the fact `month.take.from`): "Shares £1,122; Cash £1,046"
 *
 * Pure: the day arrives in ctx.now; nothing is written.
 */
import { monthInputsOf, decideMonth } from '../services/MonthDecision.js';
import { CASH_SHORT_LABEL } from '../services/DecisionOverlay.js';
import { MONTH } from '../v7/copy/month.js';
import { money } from './format.js';

const nowOf = (ctx) => (ctx && ctx.now instanceof Date ? ctx.now : new Date());

/** The month worked out on the plan (the header). Throws as the engine throws (a tax year not set up). */
export function monthReadingOf(plan, ctx, { month, pots, history = null, taxYears = null, entered = null, paidAhead = false, draftLadder = null } = {}) {
  const I = monthInputsOf(plan, { now: nowOf(ctx) });
  const J = { ...I, ...(Array.isArray(history) ? { history } : {}), ...(taxYears && typeof taxYears === 'object' ? { taxYears } : {}) };
  return decideMonth(J, month, pots || {}, { history: J.history, taxYears: J.taxYears, entered, paidAhead, draftLadder });
}

/** What reaches the bank this month after tax (the header). `fallbackTax(d, annualTaxable)`: a year's tax, for a decision with no tax figure. */
export function monthAfterTaxOf(d, { fallbackTax = null } = {}) {
  if (!d) return null;
  if (d.totalMonthlyNet != null && Number.isFinite(+d.totalMonthlyNet)) return +d.totalMonthlyNet;
  const taxable = (+d.sippDraw || 0) + (+d.other || 0) + (+d.statePension || 0);
  if (d.monthlyTax != null && Number.isFinite(+d.monthlyTax)) return taxable - +d.monthlyTax + (+d.isaDraw || 0);
  const annual = typeof fallbackTax === 'function' ? +fallbackTax(d, taxable * 12) || 0 : 0;
  return taxable - annual / 12 + (+d.isaDraw || 0);
}

/** Where the month comes from (the header): a bought way's rung or cash years, else each pot drawn. */
export function monthFromOf(d) {
  if (!d) return [];
  const ov = d.strategyOverlay || null;
  const from = [];
  if (ov && (ov.floorMonthly > 0 || ov.hidePots)) {
    const label = String(ov.floorLabel || '');
    const rung = /^rung (.+) \(already cash\)$/.exec(label);
    const where = rung ? { id: 'rung', slots: { year: rung[1] } }
      : label === 'the cash years bucket' ? { id: 'cashYears', slots: {} }
        : label === CASH_SHORT_LABEL ? { id: 'cashShort', slots: {} }
          : /^cash, (before|until)/.test(label) ? { id: 'cashBefore', slots: {} }   // its label until 7.4.2, and since
            : label === 'the essentials rung' ? { id: 'essentials', slots: {} }
              : label === 'the engine' ? { id: 'invested', slots: {} }
                : { id: 'thisYear', slots: {} };
    if (ov.floorMonthly > 0) from.push({ ...where, amount: Math.round(+ov.floorMonthly) });
    if (ov.sleeveMonthly > 0) from.push({ id: 'investedRest', slots: {}, amount: Math.round(+ov.sleeveMonthly) });
  } else {
    if (d.drawFromCash > 0.5) from.push({ id: 'cash', slots: {}, amount: Math.round(+d.drawFromCash) });
    if (d.drawFromBond > 0.5) from.push({ id: 'bonds', slots: {}, amount: Math.round(+d.drawFromBond) });
    if (d.drawFromEquity > 0.5) from.push({ id: 'shares', slots: {}, amount: Math.round(+d.drawFromEquity) });
    if (d.drawFromDiversifier > 0.5) from.push({ id: 'diversifiers', slots: {}, amount: Math.round(+d.drawFromDiversifier) });
  }
  return from;
}

const fill = (t, slots) => String(t || '').replace(/\{(\w+)\}/g, (m, k) => (slots && slots[k] != null ? String(slots[k]) : m));

/** The words of one part ("Shares", "Your gilt 2027"), as both views label it. */
export const fromLabel = (x) => fill(MONTH.advice.from[x.id] || x.id, x.slots);

/** Where the month comes from, in the words both views say (the fact `month.take.from`); '' when nothing is drawn. */
export function monthFromText(d) {
  return monthFromOf(d).map((x) => fromLabel(x) + ' ' + money(x.amount)).join('; ');
}
