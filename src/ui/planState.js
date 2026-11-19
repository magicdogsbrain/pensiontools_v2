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
 *     state.dropWorked()       the plan was written (a save, a record): every figure worked out from it goes; what is being
 *                              edited on screen (the budget, a holdings draft, the form's baseline) stays
 */
const TABS = Object.freeze(['stress', 'decision', 'budget', 'accumulation', 'transition', 'household', 'strategies']);

export const PLAN_STATE_FIELDS = Object.freeze([
  'budget', 'budLoaded', 'budGuide', 'budFor',
  'acProjection', 'acHoldingsProps', 'acMixOn',
  'shapeRefs', 'oneTest', 'cmpCache', 'latestStrategyStress', 'chanceLevel', 'arrivalChecked',
  'holdingsDraft', 'holdingsDraftFor', 'transitionLast', 'lifeStage', 'stressFormBase',
  // what was chosen or turned on a page of this plan: a strategy page's dials and the defaults its last run gave them, the
  // household's limit, the budget's last removal and import (each offered back for a while), its +10%, the year chosen in
  // History and in Tax years, the custom split and allocation mode per surface, the Decision tool's year 0 — none of them
  // may be read for, or written into, another plan
  'stratDials', 'beAge', 'ffHorizon', 'hhLimit', 'budLastRemoved', 'budImportUndo', 'budPlusTen', 'historyYear', 'taxYear',
  'customAlloc', 'allocMode', 'decisionAnchor'
]);

/** The fields worked out from the plan (dropped after a write); the rest are what is being edited. */
const WORKED = Object.freeze(['budGuide', 'acProjection', 'acHoldingsProps', 'acMixOn', 'shapeRefs', 'oneTest', 'cmpCache', 'latestStrategyStress', 'lifeStage', 'transitionLast', 'beAge', 'ffHorizon']);

const fresh = () => ({
  budget: null, budLoaded: false, budGuide: null, budFor: null,
  acProjection: null, acHoldingsProps: null, acMixOn: false,
  shapeRefs: { essentials: 0, budgetGross: 0 }, oneTest: null,   // no budget essentials known: none (as the page has always started)
  cmpCache: null, latestStrategyStress: null, chanceLevel: null, arrivalChecked: false,
  holdingsDraft: null, holdingsDraftFor: null, transitionLast: null, lifeStage: null, stressFormBase: null,
  stratDials: {}, beAge: null, ffHorizon: null, hhLimit: null, budLastRemoved: null, budImportUndo: null, budPlusTen: false,
  historyYear: 'all', taxYear: null, customAlloc: {}, allocMode: {}, decisionAnchor: null
});

/** A field's value for a plan just opened (a new object each time). */
export const emptyPlanField = (field) => fresh()[field];

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
    isFor: { enumerable: false, value: (key) => state.key === key },
    dropWorked: { enumerable: false, value: () => { for (const f of WORKED) state[f] = fresh()[f]; return state; } }
  });
  return state;
}

export { TABS as PLAN_TABS };

/** The page's older names for these fields, each now a window property that reads and writes the one state (so a reset drops them all). */
export const PLAN_STATE_GLOBALS = Object.freeze({
  _budget: 'budget', _budGuide: 'budGuide', _acProjection: 'acProjection', _acHoldingsProps: 'acHoldingsProps', _acMixOn: 'acMixOn',
  _shapeRefs: 'shapeRefs', _oneTest: 'oneTest', _cmpCache: 'cmpCache', _latestStrategyStress: 'latestStrategyStress',
  _chanceLevel: 'chanceLevel', _arrivalChecked: 'arrivalChecked', _holdingsDraft: 'holdingsDraft', _holdingsDraftFor: 'holdingsDraftFor',
  _transitionLast: 'transitionLast', _lifeStage: 'lifeStage',
  _stratDials: 'stratDials', _beAge: 'beAge', _ffHorizon: 'ffHorizon', _hhLimit: 'hhLimit', _budImportUndo: 'budImportUndo',
  _budPlusTen: 'budPlusTen', _customAlloc: 'customAlloc', _allocMode: 'allocMode', _decisionAnchor: 'decisionAnchor'
});

/** Binds the page's names to the one state: `win._budget` is `state.budget`, and so on; nothing is kept beside it. */
export function bindPlanState(win, state) {
  for (const [name, field] of Object.entries(PLAN_STATE_GLOBALS)) {
    Object.defineProperty(win, name, { configurable: true, enumerable: false, get: () => state[field], set: (v) => { state[field] = v; } });
  }
  win._plan = state;
  return state;
}
