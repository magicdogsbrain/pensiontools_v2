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
