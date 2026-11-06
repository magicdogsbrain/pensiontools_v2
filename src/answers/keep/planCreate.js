/**
 * The plans a kept answer becomes (research/v7/road-to-7.md step 7: the preview makes a plan itself; save-as-plan.md
 * Contract C.3 for the shape). Pure: the seed (src/answers/keep/planSeed.js buildPlanSeed) and the moment in; the plan
 * documents out, exactly as today's planner makes them (services/PlanFromSeed.js seedToScenario, the lifted mapping)
 * with the planner's own stamps on them (FirestoreService.createScenario: createdAt, lastModified) and `isActive` by
 * the rule below. The ids are the store's business (effects/planWrite.js): a Firestore id from addDoc, or a window id.
 *
 *   plansFromSeed(seed, { now, takenNames, first, flexibleAccess })  → { yours, partner, names }
 *     - the names made different from every name already taken (uniqueName), the partner's "{name} · partner";
 *     - a couple: the partner's plan (never active) and yours, which carries `household.partnerScenarioId` once the
 *       store has given the partner an id (the effect sets it — withPartnerId);
 *     - `isActive`: yours is the account's (or window's) first plan → true; otherwise false. The partner's never.
 *       No other plan's `isActive` is ever touched (the planner's own "set active" stays its own).
 *     - `flexibleAccess` (services/FlexibleAccess.js): the person's fact of money taken from a pension flexibly, when the
 *       answer was opened from a plan that carries it (a saving plan made on going back to work) — put on yours, as a
 *       close carries it, while the answer still says you have already drawn (`alreadyDrawing`); else nothing.
 *   withPartnerId(yours, partnerId)                  yours with the link to the partner's plan
 *   stillSavingOf(seed)                              which of the plans made is someone still saving: 'yours', 'partner'
 *                                                    or null (who "See whether what you pay in is enough" is for)
 *   planProblems(plan)                               seedProblems' rules on a plan: [] when it can go to Firestore as it is
 *
 * Nothing here reads a clock or a store: `now` is a Date from the effect's clock.
 */
import { seedToScenario, uniqueName } from '../../services/PlanFromSeed.js';
import { flexibleAccessOf } from '../../services/FlexibleAccess.js';
import { seedProblems } from './planSeed.js';

/**
 * @param {object} seed    buildPlanSeed's seed (checked by seedToScenario)
 * @param {{ now: Date, takenNames?: string[], first?: boolean, flexibleAccess?: { since: string, fromPlanId: string|null }|null }} o
 *   the moment; the names in the account or window; whether this will be the first plan there; the person's fact the
 *   answer came with
 * @returns {{ yours: object, partner: object|null, names: { yours: string, partner: string|null } }}
 */
export function plansFromSeed(seed, { now, takenNames = [], first = false, flexibleAccess = null }) {
  const yourName = uniqueName(seed.name.chosen, takenNames);
  const partnerName = seed.household === 'couple' ? uniqueName(yourName + ' · partner', [...takenNames, yourName]) : null;
  const { yours, partner } = seedToScenario(seed, now, { name: yourName, ...(partnerName ? { partnerName } : {}) });
  const stamp = now.toISOString();
  const stamped = (plan, isActive) => {
    const { id, ...rest } = plan;      // seedToScenario gives no id; the store does
    void id;
    return { ...rest, isActive, createdAt: stamp, lastModified: stamp };
  };
  const you = Array.isArray(seed.people) ? seed.people.find((p) => p && p.who === 'you') : null;
  const fa = flexibleAccessOf({ flexibleAccess });
  const carried = fa && you && you.alreadyDrawing === true ? { flexibleAccess: fa } : {};
  return {
    yours: { ...stamped(yours, first === true), ...carried },
    partner: partner ? stamped(partner, false) : null,
    names: { yours: yourName, partner: partnerName }
  };
}

/**
 * Which plan made from the seed belongs to someone still saving (their stop is later): yours first, else the partner's,
 * else null. A couple's answer where you have already stopped makes your plan a drawing one and the partner's a saving
 * one, so keeping it points at the partner's "What you pay in" (research/saving-enough-and-check-in.md 4.3).
 */
export function stillSavingOf(seed) {
  const people = seed && Array.isArray(seed.people) ? seed.people : [];
  const later = (who) => people.some((p) => p && p.who === who && p.stop && p.stop.kind === 'later');
  if (later('you')) return 'yours';
  return seed && seed.household === 'couple' && later('partner') ? 'partner' : null;
}

/** Your plan with the link to the partner's plan, as createPlansFromSeed sets it (household.partnerScenarioId). */
export function withPartnerId(yours, partnerId) {
  return { ...yours, household: { partnerScenarioId: String(partnerId) } };
}

/** seedProblems' rules on a plan document: no undefined, no function, no Date, no non-finite number, no array in an array. */
export function planProblems(plan) {
  return seedProblems(plan);
}
