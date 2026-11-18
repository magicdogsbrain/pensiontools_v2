/**
 * Everything the full view knows about the open plan, in ONE object (lead4.md R2): the budget being edited, the projection,
 * the budget's essentials for the plan document, the one test and the comparison already run, the chance level chosen,
 * the arrival check, a holdings draft, the life stage, the stress form as last filled. It is dropped and made again on any
 * change of plan (repaintPlan in index.html), keyed by the plan's id and its last change, so nothing worked out for one
 * plan is ever read for another. The tabs not on screen are marked to draw again when they are opened.
 *
 *   planKeyOf(plan)            'id|lastModified' ('' with no plan)
 *   createPlanState()          → state: the fields below, plus
 *     state.reset(key)         every field back to empty, for the plan `key`
 *     state.markAllStale()     every tab draws again when opened
 *     state.takeStale(tab)     true once for a tab marked stale (and clears the mark)
 *     state.isFor(key)         is this state the plan `key`'s?
 */
const TABS = Object.freeze(['stress', 'decision', 'budget', 'accumulation', 'transition', 'household', 'strategies']);

export const PLAN_STATE_FIELDS = Object.freeze([
  'budget', 'budLoaded', 'budGuide', 'budFor',
  'acProjection', 'acHoldingsProps', 'acMixOn',
  'shapeRefs', 'oneTest', 'cmpCache', 'latestStrategyStress', 'chanceLevel', 'arrivalChecked',
  'holdingsDraft', 'holdingsDraftFor', 'transitionLast', 'lifeStage', 'stressFormBase'
]);

const fresh = () => ({
  budget: null, budLoaded: false, budGuide: null, budFor: null,
  acProjection: null, acHoldingsProps: null, acMixOn: false,
  shapeRefs: null, oneTest: null, cmpCache: null, latestStrategyStress: null, chanceLevel: null, arrivalChecked: false,
  holdingsDraft: null, holdingsDraftFor: null, transitionLast: null, lifeStage: null, stressFormBase: null
});

export function planKeyOf(plan) {
  if (!plan || plan.id == null) return '';
  return String(plan.id) + '|' + String(plan.lastModified || '');
}

/** The plan id a key names ('' for none). */
export const planIdOfKey = (key) => String(key || '').split('|')[0];

export function createPlanState() {
  let stale = new Set();
  const state = { key: null, ...fresh() };
  Object.defineProperties(state, {
    reset: { enumerable: false, value: (key = null) => { Object.assign(state, fresh(), { key }); stale = new Set(); return state; } },
    markAllStale: { enumerable: false, value: () => { stale = new Set(TABS); return state; } },
    takeStale: { enumerable: false, value: (tab) => { const was = stale.has(tab); stale.delete(tab); return was; } },
    isFor: { enumerable: false, value: (key) => state.key === key }
  });
  return state;
}

export { TABS as PLAN_TABS };
