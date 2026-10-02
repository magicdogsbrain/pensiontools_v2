/**
 * The saving path a lock (or a refresh of the plan document) draws on V7's saving-years engine (6.22.0; plan document
 * version 3; services/SavingPath.js). This small module is what index.html imports: it loads SavingPath.js — and with it
 * the parts of V7's engine it uses (src/answers/shared) — only when a plan is locked or its document refreshed, so the
 * main bundle stays as it was (research/saver-lock-and-savings-growth.md R9).
 *
 * Returns undefined (→ buildPlanDocument draws the FCA path, as before 6.22.0) for a plan that is not retiring later, or
 * when the engine cannot be loaded (offline, an old cached chunk): the lock never fails for want of it.
 */
import { deriveTiming } from '../services/PlanTiming.js';

export async function savingPathForLock({ settings, accumulation = null, holdings = null, now = new Date() } = {}) {
  const timing = deriveTiming(settings || {}, now);
  if (timing.mode !== 'future' || !(timing.currentAge > 0)) return undefined;
  try {
    const { buildSavingPath } = await import('../services/SavingPath.js');
    return buildSavingPath({ settings, timing, accumulation, holdings, now });
  } catch (e) {
    console.warn('The saving path could not be drawn on the saving-years engine; the FCA path is used instead:', e);
    return undefined;
  }
}
