/**
 * The plans a kept answer becomes (research/v7/road-to-7.md step 7: the preview makes a plan itself; save-as-plan.md
 * Contract C.3 for the shape). Pure: the seed (src/answers/keep/planSeed.js buildPlanSeed) and the moment in; the plan
 * documents out, exactly as today's planner makes them (services/PlanFromSeed.js seedToScenario, the lifted mapping)
 * with the planner's own stamps on them (FirestoreService.createScenario: createdAt, lastModified) and `isActive` by
 * the rule below. The ids are the store's business (effects/planWrite.js): a Firestore id from addDoc, or a window id.
 *
 *   plansFromSeed(seed, { now, takenNames, first })  → { yours, partner, names }
 *     - the names made different from every name already taken (uniqueName), the partner's "{name} · partner";
 *     - a couple: the partner's plan (never active) and yours, which carries `household.partnerScenarioId` once the
 *       store has given the partner an id (the effect sets it — withPartnerId);
 *     - `isActive`: yours is the account's (or window's) first plan → true; otherwise false. The partner's never.
 *       No other plan's `isActive` is ever touched (the planner's own "set active" stays its own).
 *   withPartnerId(yours, partnerId)                  yours with the link to the partner's plan
 *   planProblems(plan)                               seedProblems' rules on a plan: [] when it can go to Firestore as it is
 *
 * Nothing here reads a clock or a store: `now` is a Date from the effect's clock.
 */
import { seedToScenario, uniqueName } from '../../services/PlanFromSeed.js';
import { seedProblems } from './planSeed.js';

/**
 * @param {object} seed    buildPlanSeed's seed (checked by seedToScenario)
 * @param {{ now: Date, takenNames?: string[], first?: boolean }} o   the moment; the names in the account or window;
 *   whether this will be the first plan there
 * @returns {{ yours: object, partner: object|null, names: { yours: string, partner: string|null } }}
 */
export function plansFromSeed(seed, { now, takenNames = [], first = false }) {
  const yourName = uniqueName(seed.name.chosen, takenNames);
  const partnerName = seed.household === 'couple' ? uniqueName(yourName + ' · partner', [...takenNames, yourName]) : null;
  const { yours, partner } = seedToScenario(seed, now, { name: yourName, ...(partnerName ? { partnerName } : {}) });
  const stamp = now.toISOString();
  const stamped = (plan, isActive) => {
    const { id, ...rest } = plan;      // seedToScenario gives no id; the store does
    void id;
    return { ...rest, isActive, createdAt: stamp, lastModified: stamp };
  };
  return {
    yours: stamped(yours, first === true),
    partner: partner ? stamped(partner, false) : null,
    names: { yours: yourName, partner: partnerName }
  };
}

/** Your plan with the link to the partner's plan, as createPlansFromSeed sets it (household.partnerScenarioId). */
export function withPartnerId(yours, partnerId) {
  return { ...yours, household: { partnerScenarioId: String(partnerId) } };
}

/** seedProblems' rules on a plan document: no undefined, no function, no Date, no non-finite number, no array in an array. */
export function planProblems(plan) {
  return seedProblems(plan);
}
