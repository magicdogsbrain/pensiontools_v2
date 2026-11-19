/**
 * The plan's clock, stage and name (lead4.md D5; step F1): ONE reader each, given (plan, ctx) — ctx as
 * src/reading/context.js builds it (`now`), with the plan's effective settings when the caller has them (`settings`).
 * Both views draw these through these functions and the one formatter (src/reading/format.js).
 *
 *   ageToday(plan, ctx)    the whole-years age on ctx.now, rolled on from the age given and its day (PlanTiming.deriveTiming),
 *                          never a stored age as it was typed; null when no age is known
 *   stopMonth(plan, ctx)   'YYYY-MM': the month work stops (still saving) or stopped (when the plan says it); null else
 *   yearsToGo(plan, ctx)   whole months from ctx.now to the stop month (still saving); null else
 *   planEndAge(plan, ctx)  the age the plan runs to (PlanTiming.planEndAgeOf); null without a length
 *   stage(plan, ctx)       'Saving' | 'Moving' | 'Living on it' (or 'Closed'); null when the plan is not placed
 *                          (LifeStage.stageOf on PlanReading.planStage — the words of both views, the full view's chip too)
 *   planName(plan, ctx)    the name every place prints (PlanName.shownPlanName)
 *
 * Pure (the plan's settings are read once, by PlanReading, on ctx.now).
 */
import { deriveTiming, planEndAgeOf } from '../services/PlanTiming.js';
import { stageOf } from '../services/LifeStage.js';
import { planStage } from '../services/PlanReading.js';
import { shownPlanName } from '../services/PlanName.js';
import { settingsOf } from './money.js';

const nowOf = (ctx) => (ctx && ctx.now instanceof Date ? ctx.now : new Date());

// the three stage words (and a closed plan's), by LifeStage.stageOf's key: the label table's (src/reading/labels.js)
import { STAGE_WORD_OF as STAGE_WORD } from './labels.js';

function timingOf(plan, ctx) {
  const ss = settingsOf(plan, ctx);
  if (!ss || ss.readFault) return null;
  try { return deriveTiming(ss, nowOf(ctx)); } catch { return null; }
}

export function ageToday(plan, ctx = {}) {
  const t = timingOf(plan, ctx);
  return t && Number.isFinite(+t.currentAge) && +t.currentAge > 0 ? Math.floor(+t.currentAge) : null;
}

export function stopMonth(plan, ctx = {}) {
  const t = timingOf(plan, ctx);
  if (!t) return null;
  if (t.mode === 'future') return t.startMonth || null;
  return t.stoppedWork ? String(t.stoppedWork).slice(0, 7) : null;
}

export function yearsToGo(plan, ctx = {}) {
  const t = timingOf(plan, ctx);
  return t && t.mode === 'future' && Number.isFinite(+t.monthsToStop) ? Math.max(0, Math.round(+t.monthsToStop)) : null;
}

export function planEndAge(plan, ctx = {}) {
  const ss = settingsOf(plan, ctx);
  if (!ss || ss.readFault) return null;
  try { return planEndAgeOf(ss, nowOf(ctx)); } catch { return null; }
}

export function stage(plan, ctx = {}) {
  if (!plan) return null;
  const now = nowOf(ctx);
  let st = null;
  try { st = stageOf(plan, now, { placing: planStage(plan, { now }), settings: settingsOf(plan, ctx) }); } catch { st = null; }
  return st && st.key && STAGE_WORD[st.key] ? STAGE_WORD[st.key] : null;
}

export function planName(plan, ctx = {}) {
  try { return shownPlanName(plan, { now: nowOf(ctx) }); } catch { return ''; }
}
