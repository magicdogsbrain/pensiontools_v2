/**
 * Plans kept without an account (6.23.0, research/v7/v6-usability-audit.md decision 7).
 *
 * A visitor without an account keeps their plans in this browser window only (FirestoreService's guest store). Two
 * rules live here, pure, with no storage or DOM:
 *   - a guest may keep up to GUEST_MAX_PLANS plans of their own in the window;
 *   - the example plan ("Look around an example") is read-only: it is flagged `example: true`, does not count toward
 *     the three, and the store refuses every write to it except opening it (isActive).
 */

/** How many plans of their own a guest may keep in the window. */
export const GUEST_MAX_PLANS = 3;

/** What a guest is told when the window already holds three plans. */
export const GUEST_PLANS_FULL_MESSAGE = 'Without an account you can keep up to ' + GUEST_MAX_PLANS
  + ' plans in this browser window. Make a free account to keep more — your plans come with you.';

/** The example plan is read-only. */
export const EXAMPLE_PLAN_CODE = 'example-plan';
export const EXAMPLE_PLAN_MESSAGE = 'This is the example plan: look around as much as you like, but it cannot be changed. '
  + 'To use your own figures, start your own plan (the plan menu → + New plan).';

export class ExamplePlanError extends Error {
  constructor() {
    super(EXAMPLE_PLAN_MESSAGE);
    this.name = 'ExamplePlanError';
    this.code = EXAMPLE_PLAN_CODE;
  }
}
export const isExamplePlanError = (e) => !!e && e.code === EXAMPLE_PLAN_CODE;

/** Is this stored plan the read-only example? */
export function isExamplePlan(plan) {
  return !!(plan && typeof plan === 'object' && plan.example === true);
}

/** The plans that count toward the guest's three: every plan but the example. */
export function guestOwnPlans(list) {
  return (Array.isArray(list) ? list : []).filter((p) => !isExamplePlan(p));
}

/** May a guest add one more plan of their own? */
export function guestHasRoom(list) {
  return guestOwnPlans(list).length < GUEST_MAX_PLANS;
}

/** The message when a guest may not add another plan; null when they may. */
export function guestPlanRefusal(list) {
  return guestHasRoom(list) ? null : GUEST_PLANS_FULL_MESSAGE;
}

// A write to the example plan may only open or close it (the plan menu), or stamp when it was last touched.
const HARMLESS_KEYS = new Set(['isActive', 'lastModified']);

/**
 * Does this write (a saveScenario `data` map) change the stored example plan? null when the plan is not the example,
 * or when the write only opens/closes it; otherwise the keys it would change.
 */
export function examplePlanWriteRefusal(stored, data) {
  if (!isExamplePlan(stored)) return null;
  const keys = Object.keys(data || {}).filter((k) => !HARMLESS_KEYS.has(k));
  return keys.length ? keys : null;
}

/**
 * The example plan: the r/FiredUK £1M story — £40k rising with inflation from 56, 700/200/100 pots for the flexible
 * strategies, a 15-rung ladder with reviews at 5/10/15 for Ladder & Ratchet, State Pension at 67. Reachable from the
 * landing page ("Look around an example") and the ?demo=1m link; a signed-in visitor gets it added to their account
 * as an ordinary plan of their own.
 */
export const DEMO_PLANS = Object.freeze({
  '1m': {
    name: 'r/FiredUK — £1M, £40k rising', tab: 'strategies', page: 'overview',
    stress: { configured: true, equityMin: 700000, bondMin: 200000, cashTarget: 100000, diversifierStart: 0, isaBalance: 0, isaDrawdownStrategy: 'hold', baseSalary: 40000, duration: 39, shapeAgeNow: 56, currentAge: 56, statePension: 11973, statePensionYear: 11, riskMode: 'risk', strategyId: 'pots-and-valves', strategyParams: {} }
  }
});
export const EXAMPLE_PLAN_KEY = '1m';
/** What the example plan's description says, in the plan menu. */
export const EXAMPLE_PLAN_DESCRIPTION = 'An example to look around — it cannot be changed. Start your own plan for your own figures.';
