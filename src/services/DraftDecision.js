/**
 * One set of settings until the lock (7.12.0).
 *
 * A plan used to carry two copies of its figures: the Stress settings, which every route writes (keeping an answer, the
 * simple view's steps, Stress tester → Settings), and the Decision settings, which only the lock made true. Until then the
 * Decision copy held the factory defaults, so the Decision tool showed pots and an income nobody had typed, and told the
 * person to "set up this plan first" on a plan that was set up.
 *
 * Now an unlocked plan's Decision settings are READ, never kept apart: the lock's own seed (PlanCommit.seedDecisionFromStress)
 * worked on the Stress settings as read, over whatever the plan stored. A locked plan reads its stored copy exactly as
 * before (the lock wrote it; it is the committed record). Nothing is written by reading; an old plan's stale copy is
 * simply no longer read.
 *
 *   planHasFigures(plan)                     true once the plan holds figures someone gave it
 *   decisionSettingsAsRead(plan, { now, stress })   the Decision settings every reader uses
 *
 * Pure: no storage, no clock (`now` is handed in).
 */
import { seedDecisionFromStress, getDefaultDecisionSettings } from './PlanCommit.js';
import { effectiveStressSettings } from './PlanReading.js';
import { isLockedSettings } from './LockedPlanGuard.js';

const isObj = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const copy = (v) => JSON.parse(JSON.stringify(v));

/** The plan's stored Decision settings, or undefined. */
const storedDecision = (plan) => (plan && plan.decisionTool && isObj(plan.decisionTool.settings) ? plan.decisionTool.settings : undefined);

/** Is the plan locked, as stored? */
export const planLocked = (plan) => isLockedSettings(storedDecision(plan));

/**
 * Whether the plan holds figures someone gave it: Stress settings saved (`configured`), an older plan whose income is not
 * the factory one (before the flag: 30,000 is the default, and a net-first figure never lands on it), a locked plan, or a
 * plan kept from an answer.
 */
export function planHasFigures(plan) {
  if (!plan) return false;
  if (isObj(plan.fromAnswer)) return true;
  if (planLocked(plan)) return true;
  const s = plan.stressTool && isObj(plan.stressTool.settings) ? plan.stressTool.settings : null;
  if (!s) return false;
  return s.configured === true || (!!s.baseSalary && +s.baseSalary !== 30000);
}

/**
 * The Decision settings as every reader takes them. Locked: the stored copy (a copy, so a reader cannot change the record).
 * Unlocked: the lock's seed on the Stress settings as read (`stress` when the caller already has them), with `configured`
 * saying whether the plan has figures, and `locked` false.
 */
export function decisionSettingsAsRead(plan, { now = new Date(), stress = null } = {}) {
  const stored = storedDecision(plan);
  if (planLocked(plan)) return copy(stored);
  const ss = isObj(stress) ? stress : effectiveStressSettings(plan, { now });
  const seeded = seedDecisionFromStress(ss, stored ? copy(stored) : getDefaultDecisionSettings());
  return { ...seeded, locked: false, configured: planHasFigures(plan) };
}
