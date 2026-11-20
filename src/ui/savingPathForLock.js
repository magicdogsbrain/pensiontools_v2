/**
 * The saving path a lock (or a refresh of the plan document) draws on V7's saving-years engine (6.22.0; plan document
 * version 3; services/SavingPath.js). This small module is what index.html imports: it loads SavingPath.js — and with it
 * the parts of V7's engine it uses (src/answers/shared) — only when a plan is locked or its document refreshed, so the
 * main bundle stays as it was (research/saver-lock-and-savings-growth.md R9).
 *
 * `phases` (7.10.0): the plan's `phases` root, so a saving level the person chose is the path's saving mix, as in the new app.
 * `plan` (7.12.0): the saved plan; its pension today is then the one every screen reads (services/PensionToday.js: a
 * check-in, the newest pot record, What you hold, the pot saved, the plan's own pension total), and its phases are read from it.
 *
 * Returns undefined (→ buildPlanDocument draws the FCA path, as before 6.22.0) for a plan that is not retiring later, or
 * when the engine cannot be loaded (offline, an old cached chunk): the lock never fails for want of it.
 */
import { deriveTiming } from '../services/PlanTiming.js';
import { pathPensionOf } from '../services/PensionToday.js';
import { todayOf } from '../reading/clock.js';   // the one clock (lead4.md R5)

export async function savingPathForLock({ settings, accumulation = null, holdings = null, now = todayOf(), phases = null, plan = null } = {}) {
  const timing = deriveTiming(settings || {}, now);
  if (timing.mode !== 'future' || !(timing.currentAge > 0)) return undefined;
  try {
    const { buildSavingPath } = await import('../services/SavingPath.js');
    return buildSavingPath({ settings, timing, accumulation, holdings, now, phases: phases || (plan && plan.phases) || null, explicit: pathPensionOf(plan, { now, settings }) });
  } catch (e) {
    console.warn('The saving path could not be drawn on the saving-years engine; the FCA path is used instead:', e);
    return undefined;
  }
}
