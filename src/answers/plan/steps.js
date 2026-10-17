/**
 * "Your plan": the steps for each life stage, as data (research/v7/your-plan.md 2.2, 2.4). The reading that fills them
 * is read.js; the words are src/v7/copy/plan.js under the same ids.
 *
 *   STEPS[stage]   the step ids for a stage, in order; the first is the one the plan opens on
 *   OPTIONAL       the steps that say "optional" on the rail (R4)
 *   ALL_STEPS      every step id (an address may open any; one not on the stage's list says why — R7)
 *   NEXT_ORDER     the next sentences, in the order they are tried (first match wins)
 */
export const STEPS = Object.freeze({
  unknown:            ['plan', 'budget', 'hold', 'household'],
  saving:             ['saving', 'pot', 'plan', 'budget', 'lock', 'hold', 'household'],
  approaching:        ['plan', 'saving', 'pot', 'budget', 'lock', 'hold', 'move', 'household'],
  'committed-saving': ['pot', 'where', 'plan', 'saving', 'budget', 'hold', 'move', 'household'],
  'draft-retired':    ['plan', 'budget', 'lock', 'hold', 'move', 'household'],
  bridge:             ['month', 'where', 'plan', 'hold', 'move', 'budget', 'household'],
  running:            ['month', 'where', 'plan', 'hold', 'move', 'budget', 'household']
});

/** Optional on every rail but one: the pot record is the first thing a plan locked while saving asks for. */
export const OPTIONAL = Object.freeze(['pot', 'budget', 'lock', 'hold', 'move', 'household']);
export const ALL_STEPS = Object.freeze(['month', 'where', 'plan', 'pot', 'saving', 'budget', 'lock', 'hold', 'move', 'household']);

/** The stages in which a retired person is shown (the retired wording rules apply; never a countdown). */
export const RETIRED_STAGES = Object.freeze(['draft-retired', 'bridge', 'running']);
/** The stages in which someone still working is shown (the saver wording rules apply). */
export const SAVER_STAGES = Object.freeze(['saving', 'approaching', 'committed-saving']);

export const NEXT_ORDER = Object.freeze(['P.readonly', 'P.noAge', 'P.arrive', 'P.taxyear', 'P.month', 'P.idle', 'P.pot', 'P.working', 'P.recheck', 'P.stale', 'P.draft', 'P.approaching', 'P.saving']);

/**
 * The editing sub-steps of a step (research/v7/editing-in-v7.md 2, 7, 8, 9, 10): "About you and when", "Money that comes in
 * anyway", "What you spend", "Your pots and tax" and "Does it last?" sit under "Your plan" / "Your plan as locked" (read-only
 * there). A sub-step is an address under the plan (#/plan/<id>/about, …/income, …/spend, …/pots, …/lasts), not a rail step.
 */
export const SUB_STEPS = Object.freeze({ plan: Object.freeze(['about', 'income', 'spend', 'pots', 'lasts']) });
export const ALL_SUB_STEPS = Object.freeze(['about', 'income', 'spend', 'pots', 'lasts']);

/** The sub-steps a plan's page links to: those of every step the stage lists. */
export function subStepsFor(stageKey, o) {
  return stepsFor(stageKey, o).flatMap((s) => (SUB_STEPS[s.id] || []).map((id) => ({ id, under: s.id })));
}

/**
 * The steps a plan shows: the stage's list, less "lock" on a locked plan, less "household" without a link when the
 * account holds one plan. `pot` is optional except in committed-saving.
 */
export function stepsFor(stageKey, { locked, linked, manyPlans }) {
  const base = STEPS[stageKey] || STEPS.unknown;
  return base.filter((id) => !(id === 'lock' && locked) && !(id === 'household' && !linked && !manyPlans))
    .map((id) => ({ id, optional: OPTIONAL.includes(id) && !(id === 'pot' && stageKey === 'committed-saving') }));
}
