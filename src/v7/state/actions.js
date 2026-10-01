/**
 * Every action the reducer understands (V7 build brief 4.6; step 4 brief 4.11). Plain objects, so a session can be
 * recorded and replayed. No action can change `plan` or `session` in this slice. The reducer (package 3) throws on an
 * unknown type in the test build and ignores it in the published build.
 */
export const A = Object.freeze({
  ROUTE_SET:       'route/set',        // { route }                          replaces route; closes the rail sheet
  DRAFT_SET:       'draft/set',        // { q, path, value }                 one typed value; household → single keeps the partner's values
  DRAFT_TOUCH:     'draft/touch',      // { q, path }                        adds to touched
  DRAFT_ASK:       'draft/ask',        // { q }                              asked: true; if the draft parses, route → the answer step
  DRAFT_RESET:     'draft/reset',      // { q }                              empties the draft and the answer
  ANSWER_WORKING:  'answer/working',   // { q, inputsKey }                   status working; keeps the old result; old final careful → before
  ANSWER_PROGRESS: 'answer/progress',  // { q, inputsKey, done, total }      ignored unless inputsKey is the one being worked on
  ANSWER_FIRST:    'answer/first',     // { q, inputsKey, result }           status first. Ignored if the key is stale. Stores result.basis.detail as detail
  ANSWER_FINAL:    'answer/final',     // { q, inputsKey, result }           status final. Ignored if the key is stale. Stores result.basis.detail; clears extending
  ANSWER_FAILED:   'answer/failed',    // { q, inputsKey }                   status failed; the draft is untouched
  ANSWER_SLOW:     'answer/slow',      // { q }                              slow: true
  ANSWER_RETRY:    'answer/retry',     // { q }                              clears inputsKey so the runner starts again
  ANSWER_EXTEND:   'answer/extend',    // { q, inputsKey }                   A and B: extending: true on a final answer (an optional step's extra pass)
  DRAFT_CARRY:     'draft/carry',      // { from, to }                       copies by CARRY[from→to] (state/carry.js); opens CARRY_OPENS
  UI_TOGGLE:       'ui/toggle',        // { id }                             adds or removes id in ui.open
  UI_RAIL:         'ui/rail',          // { open }                           the phone rail sheet
  UI_ONLINE:       'ui/online',        // { online }
  ENV_SET:         'env/set',          // { patch }                          start-up and the test hook only
  STATE_REPLACE:   'state/replace'     // { state }                          the test hook only
});

/**
 * Step 4's two actions (brief 4.11), fixed here by P0 so that every package builds against the same names, and part
 * of `A` (so of ACTION_TYPES) since the reducer learnt them (P4). A_NEXT is kept as another name for the two:
 *   DRAFT_CARRY   { from, to }        copies by CARRY[from→to] (state/carry.js) into draft[to].values as text; result keys
 *                                     read from answers[from].result; marks the carried fields touched; sets carriedFrom
 *   ANSWER_EXTEND { q, inputsKey }    extending: true (status stays 'final'); the next answer/final for the key sets detail
 *                                     from result.basis.detail and clears it
 */
export const A_NEXT = Object.freeze({
  DRAFT_CARRY:     A.DRAFT_CARRY,
  ANSWER_EXTEND:   A.ANSWER_EXTEND
});

export const ACTION_TYPES = Object.freeze(Object.values(A));

/** The ids `ui/toggle` accepts: C's, and A's and B's blocks (split, partTime, pots, levers, chart). */
export const OPENABLE = Object.freeze(['partner', 'more', 'assumed', 'madeOf', 'allAssumed', 'split', 'partTime', 'pots', 'levers', 'chart']);
