/**
 * One reader of a saver's facts (7.12.0): the age today, the age and month work stops, the pension and savings today, and
 * what goes in. "Are you paying in enough?", the boxes and table on "What you pay in", the full view's Accumulation tab and
 * the pot at the stop all read them here, so the same page can no longer say two ages or two pots.
 *
 *   saverFacts(plan, settings, { now, checkIn }) →
 *     { saving,                                  false: retired, or no ages to save between
 *       age, stopAge, stopMonth, monthsToStop,   the age rolled forward to `now`; the stop month as the plan's timing reads it
 *       pot: { pension, isa, from, at },         PensionToday.pensionTodayOf (from: checkIn|record|holdings|saved|answer|plan|none)
 *       payIn: { kind, ownTakeHome, ownLanded, employer, total, share, scheme, salary, b },
 *       isaMonthly }
 *
 * `settings` are the plan's Stress settings already brought up to date (PlanReading.effectiveStressSettings): this module
 * never calls PlanReading, which reads it, so there is no import cycle.
 *
 * Ages: the Timing block's when it has both (deriveTiming), else the Accumulation tab's own when the plan is placed by them
 * (LifeStage 4.6). Pay-in: a share of pay while it agrees with the pounds (SaverPayIn.payInShareOf), else your part and your
 * employer's in pounds as they land (AccumulationEngine.contributionBreakdown), else one figure. `b` is the same as question
 * B's pay-in input.
 *
 * Pure: no storage, no clock.
 */
import { deriveTiming } from './PlanTiming.js';
import { accumulationAgesOf } from './LifeStage.js';
import { contributionBreakdown } from './AccumulationEngine.js';
import { payInShareOf } from './SaverPayIn.js';
import { pensionTodayOf, isaTodayOf } from './PensionToday.js';

const isObj = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const num = (v) => (v == null || v === '' || !Number.isFinite(+v) ? null : +v);
const round2 = (n) => Math.round(n * 100) / 100;
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
/** The most a month question B takes for what goes in (answers/shared/rules.js SAVING.payInCeiling). */
const PAY_IN_CEILING = 100_000;

const lockedOf = (plan) => !!(plan && plan.decisionTool && isObj(plan.decisionTool.settings) && plan.decisionTool.settings.locked);
const accOf = (plan) => (plan && plan.accumulationTool && isObj(plan.accumulationTool.settings) ? plan.accumulationTool.settings : {});

/**
 * What goes in, from the saving settings: B's pay-in (a share while it agrees with the pounds, else a split or one figure,
 * each as it lands in the pension) and the pounds behind it.
 */
export function payInOf(acc) {
  const a = isObj(acc) ? acc : {};
  const scheme = a.schemeType || 'ras';
  const salary = num(a.salary) || 0;
  const net = num(a.netMonthly) || 0, employer = num(a.employerMonthly) || 0;
  let own = 0;
  try { own = net > 0 ? contributionBreakdown({ netMonthly: net, salary, schemeType: scheme, employerMonthly: 0 }).grossMonthly : 0; } catch { own = 0; }
  const share = payInShareOf(a);
  const cap = PAY_IN_CEILING;
  const pounds = { ownTakeHome: round2(net), ownLanded: round2(own), employer: round2(employer), total: round2(own + employer), scheme, salary };
  if (share) return { kind: 'share', ...pounds, share: { pay: share.pay, ownPct: share.ownPct, employerPct: share.employerPct }, b: { kind: 'share', pay: Math.min(5_000_000, share.pay), ownPct: share.ownPct, employerPct: share.employerPct } };
  if (employer > 0) return { kind: 'split', ...pounds, share: null, b: { kind: 'split', own: clamp(round2(own), 0, cap), employer: clamp(round2(employer), 0, cap) } };
  return { kind: 'total', ...pounds, share: null, b: { kind: 'total', total: clamp(round2(own), 0, cap) } };
}

/** Whole months from `now`'s month to a 'YYYY-MM' month (0 when it has come). */
function monthsUntil(month, now) {
  const m = /^(\d{4})-(\d{2})/.exec(String(month || ''));
  if (!m) return null;
  return Math.max(0, (+m[1] * 12 + +m[2]) - (now.getFullYear() * 12 + now.getMonth() + 1));
}

export function saverFacts(plan, settings, { now = new Date(), checkIn = null } = {}) {
  const ss = isObj(settings) ? settings : {};
  const acc = accOf(plan);
  let age = null, stopAge = null, stopMonth = null, monthsToStop = null;
  let t = null;
  try { t = deriveTiming(ss, now); } catch { t = null; }
  if (t && t.mode === 'future' && t.currentAge > 0 && t.retireAge > 0) {
    age = Math.floor(t.currentAge); stopAge = Math.round(t.retireAge); stopMonth = t.startMonth || null;
    monthsToStop = stopMonth ? monthsUntil(stopMonth, now) : (stopAge - age) * 12;
  } else if (t && t.mode === 'legacy' && !lockedOf(plan) && accumulationAgesOf(plan)) {
    const a = accumulationAgesOf(plan);
    age = Math.floor(a.currentAge); stopAge = Math.round(a.retirementAge); monthsToStop = (stopAge - age) * 12;
  }
  const saving = age != null && stopAge > age && !(t && t.mode === 'retired');

  const today = pensionTodayOf(plan, { now, checkIn, settings: ss });
  const isa = isaTodayOf(plan, { now, checkIn, settings: ss, today }).value;   // the one ISA-today rule (lead4.md D3)

  const payIn = payInOf(acc);
  return {
    saving, age, stopAge, stopMonth, monthsToStop,
    pot: { pension: today.value == null ? 0 : today.value, isa, from: today.from, at: today.asOf },
    payIn,
    isaMonthly: Math.max(0, num(acc.isaMonthly) || 0)
  };
}
