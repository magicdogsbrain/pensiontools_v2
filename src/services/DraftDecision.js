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
 *   settingsWithPatch(stored, patch)         what a write stores: the settings AS STORED with the keys given on top (a key
 *                                            given as undefined is taken out) — never the reading, its defaults or its
 *                                            worked figures (lead4.md R3, D2)
 *
 * Pure: no storage, no clock (`now` is handed in).
 */
import { seedDecisionFromStress, getDefaultDecisionSettings } from './PlanCommit.js';
import { effectiveStressSettings } from './PlanReading.js';
import { planHasFigures, planLocked } from './PlanFigures.js';

const isObj = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const copy = (v) => JSON.parse(JSON.stringify(v));

/** The plan's stored Decision settings, or undefined. */
const storedDecision = (plan) => (plan && plan.decisionTool && isObj(plan.decisionTool.settings) ? plan.decisionTool.settings : undefined);

export { planHasFigures, planLocked };

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

/**
 * What a settings write stores (both repositories): the settings as stored (a copy; none = {}), with each key of `patch` put
 * on top, and a key given as undefined taken out. The reading (defaults merged under it, figures worked out from the Stress
 * settings) is never the base: only what the person changed reaches the plan.
 */
export function settingsWithPatch(stored, patch) {
  const out = isObj(stored) ? copy(stored) : {};
  for (const [k, v] of Object.entries(patch || {})) {
    if (v === undefined) delete out[k];
    else out[k] = v;
  }
  return out;
}
