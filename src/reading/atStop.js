/**
 * The pot at the stop (lead4.md D4; step F1): ONE model for both views — the saving lives (services/SavingPath.js through
 * services/PotsAtStop.js potsAtStopOf), the middle figure with its bad and good cases from the same lives. The regulator's
 * fixed 2/5/8% table, the "When could I retire?" spin's own projection and any stored `potAtRetirement` are not read: a
 * locked plan's figure is the one it was locked with (a record, with its day), every other plan still saving has its own
 * worked out on the context's day.
 *
 *   potAtStop(plan, ctx) → null (not saving, or no age to work from) | {
 *     middle, low, high   the pension when you stop, today's money (low/high null on a locked plan: the document keeps one figure)
 *     isa                 the ISA and savings when you stop, middle case
 *     age                 the age it is worked out to
 *     source              'worked' | 'locked'
 *     lockedAt            the lock's day (locked only)
 *     from                { pot, monthly } — the pension today and what goes in a month it is worked out from (worked only)
 *     rows                [{ age, low, middle, high, isa }] the year-by-year band to the stop (worked only)
 *   }
 *
 * Pure (the plan's settings are read once, by PlanReading, on ctx.now).
 */
import { potsAtStopOf } from '../services/PotsAtStop.js';
import { isLockedSettings } from '../services/LockedPlanGuard.js';
import { settingsOf } from './money.js';

const isObj = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const nowOf = (ctx) => (ctx && ctx.now instanceof Date ? ctx.now : new Date());

const lockedOf = (plan) => !!(plan && plan.decisionTool && isLockedSettings(plan.decisionTool.settings));

export function potAtStop(plan, ctx = {}) {
  const ss = settingsOf(plan, ctx);
  if (!ss || ss.readFault || ss.retired !== false) return null;
  if (lockedOf(plan)) {
    const doc = plan.planDocument;
    const p = doc && isObj(doc.pots) && isObj(doc.pots.potAtRetirement) ? doc.pots.potAtRetirement : null;
    if (!p || !(+p.sipp > 0 || +p.isa > 0)) return null;
    const age = doc.timing && Number.isFinite(+doc.timing.shapeAgeNow) ? +doc.timing.shapeAgeNow : null;
    return { middle: Math.round(+p.sipp || 0), low: null, high: null, isa: Math.round(+p.isa || 0), age, source: 'locked', lockedAt: doc.lockedAt || null, from: null, rows: null };
  }
  let w = null;
  try { w = potsAtStopOf(plan, { ...ss, potAtRetirement: null }, { now: nowOf(ctx) }); } catch { w = null; }
  if (!w || w.source !== 'worked') return null;
  return {
    middle: w.sipp, low: w.sippLow, high: w.sippHigh, isa: w.isa, age: w.from ? w.from.toAge : null, source: 'worked', lockedAt: null,
    from: w.from ? { pot: w.from.pot, monthly: w.from.monthly, potFrom: w.from.potFrom, potAt: w.from.potAt } : null,
    rows: Array.isArray(w.rows) ? w.rows : null
  };
}
