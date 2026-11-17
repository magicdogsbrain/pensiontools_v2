/**
 * Whether a plan holds figures someone gave it (7.12.0), read by DraftDecision.js and PlanReading.js alike: Stress settings
 * saved (`configured`), an older plan whose income is not the factory one (before the flag: 30,000 is the default, and a
 * net-first figure never lands on it), a locked plan, or a plan kept from an answer. A plan straight from the full view's
 * wizard has none: its pots and income are the defaults, never a figure.
 *
 * Pure.
 */
import { isLockedSettings } from './LockedPlanGuard.js';

const isObj = (v) => !!v && typeof v === 'object' && !Array.isArray(v);

/** Is the plan locked, as stored? */
export const planLocked = (plan) => isLockedSettings(plan && plan.decisionTool && isObj(plan.decisionTool.settings) ? plan.decisionTool.settings : undefined);

export function planHasFigures(plan) {
  if (!plan) return false;
  if (isObj(plan.fromAnswer)) return true;
  if (planLocked(plan)) return true;
  const s = plan.stressTool && isObj(plan.stressTool.settings) ? plan.stressTool.settings : null;
  if (!s) return false;
  return s.configured === true || (!!s.baseSalary && +s.baseSalary !== 30000);
}

/**
 * Whether the Accumulation planner holds figures someone typed (7.12.0): a pension today or a pay above nothing. A saver who
 * came in by the saver's door types there only; the full view then opens on the Accumulation planner, never on "no figures
 * yet" (LifeStage.openingTab). Ages alone are not figures.
 */
export function planHasSavingFigures(plan) {
  const a = plan && isObj(plan.accumulationTool) && isObj(plan.accumulationTool.settings) ? plan.accumulationTool.settings : null;
  return !!a && ((+a.potNow || 0) > 0 || (+a.salary || 0) > 0);
}
