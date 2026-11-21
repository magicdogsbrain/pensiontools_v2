/**
 * How the pension's tax-free part is taken (lead4.md D6; step F2): ONE field, ONE default rule, read the same way by every
 * route — the plan's own test (P1: PlanReading.effectiveStressSettings carries it), the saver's verdict (P2:
 * answers/plan/saverInputs.js hands it to question B) and every "a year before tax" figure (src/reading/income.js).
 *
 *   'ufpls'     a quarter of each pension payment tax-free (until the tax-free allowance is used)
 *   'drawdown'  every pound taxed: the tax-free part kept separate or already taken
 *
 * The rule: what the plan holds when the person (or the answer they kept: "Already had the tax-free part?") chose it; with
 * nothing chosen, a quarter of each payment tax-free — the answers' own rule, so the door a plan was made through no longer
 * decides it. A LOCKED plan with nothing stored keeps what its engines read when it was locked (every pound taxed): a locked
 * plan changes only when the person confirms a change.
 *
 *   accessMethodOf(stored, { locked })  → 'ufpls' | 'drawdown'   from the plan's stored Stress settings
 *   accessOf(plan)                      → { method, chosen }     chosen: false when the rule gave it (both views say so)
 *   ACCESS_WORDS[method]                the one short name of each choice, in both views
 *   accessAssumedWords(method)          "We assumed …" — said beside the choice when nothing was chosen, the same in both views
 *
 * Pure.
 */
export const ACCESS_METHODS = Object.freeze(['ufpls', 'drawdown']);
export const DEFAULT_ACCESS_METHOD = 'ufpls';

export const ACCESS_WORDS = Object.freeze({
  ufpls: 'A quarter of each payment tax-free',
  drawdown: 'Every pound taxed (tax-free part kept separate or already taken)'
});

const isObj = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const isLocked = (plan) => !!(plan && plan.decisionTool && plan.decisionTool.settings && plan.decisionTool.settings.locked);

export function accessMethodOf(stored, { locked = false } = {}) {
  const m = stored && stored.accessMethod;
  if (ACCESS_METHODS.includes(m)) return m;
  return locked ? 'drawdown' : DEFAULT_ACCESS_METHOD;
}

export function accessOf(plan) {
  const stored = plan && isObj(plan.stressTool) && isObj(plan.stressTool.settings) ? plan.stressTool.settings : {};
  const chosen = ACCESS_METHODS.includes(stored.accessMethod);
  return { method: accessMethodOf(stored, { locked: isLocked(plan) }), chosen };
}

export function accessAssumedWords(method) {
  return 'We assumed ' + (method === 'drawdown' ? 'every pound of what you take is taxed' : 'a quarter of each payment is tax-free') + ': nothing was chosen.';
}
