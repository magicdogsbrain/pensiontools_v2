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
  STATE_REPLACE:   'state/replace',    // { state }                          the test hook only

  // ---- the budget step (research/v7/budget-step.md; save-as-plan.md Contract C.5) ------------------------------------
  DRAFT_ONWARD:    'draft/onward',     // { q }                              A, B: the numbers step's button. Its own boxes checked
                                       //                                     (left ones marked); all right → the spend step
  SPEND_HOW:       'spend/how',        // { q, how: 'lines' | 'one' }        A, B: how the spending is chosen; 'lines' starts the sheet
  BUDGET_LINE:     'budget/line',      // { id, field, value }               field: amount | period | essential | label (added lines)
  BUDGET_ADD:      'budget/add',       // { heading }                        a blank line under that heading
  BUDGET_REMOVE:   'budget/remove',    // { id }
  BUDGET_ONE_OFF:  'budget/oneOff',    // { id, field, value }               field: label | amount | year | everyYears
  BUDGET_ADD_ONE_OFF: 'budget/addOneOff',      // {}
  BUDGET_REMOVE_ONE_OFF: 'budget/removeOneOff', // { id }
  BUDGET_TOUCH:    'budget/touch',     // { id, field }                      a box of the sheet has been left
  BUDGET_USE:      'budget/use',       // { q }                              THE ONLY WAY the budget reaches a figure: its total, to
                                       //                                     the pound, into draft[q] spend.amount (spend.kind 'amount')

  // ---- "Save this as a plan" (save-as-plan.md Contract C.2) --------------------------------------------------------
  KEEP_NAME:       'keep/name',        // { q, value }                       the name box, as typed
  KEEP_SAVE:       'keep/save',        // { q }                              checks the answer and the name; saving: true → the effect
  KEEP_SENT:       'keep/sent',        // { q, name, createdAt }             the effect wrote the seed (then opens ../#new-plan)
  KEEP_FAILED:     'keep/failed',      // { q, problem: 'storage' | 'notReady' }
  KEEP_BACK:       'keep/back',        // { q, outcome, name? } on coming back: 'waiting' | 'taken' (made, as `name`) |
                                       // 'declined' ("Not now") | 'notMade' | 'gone' (too old, deleted) | 'unknown' (no word)

  // ---- the spending shape (research/v7/spending-shape.md 4.3): A's and B's spend step, C's "Add more detail" ----------
  // The first amount's own "then" and fall are fields of the input list (draft/set); the later steps are one value, a list,
  // edited here. Box marks and errors know a step's box as "<base>.steps.<i>.<field>" (state/shapeDraft.js).
  SHAPE_STEP:      'shape/step',       // { q, i, field, value }             one box of later step i, as typed (then: level | falls | glides)
  SHAPE_TOUCH:     'shape/touch',      // { q, i, field }                    step i's box has been left
  SHAPE_ADD:       'shape/add',        // { q }                              a step 10 years after the last (or the start), 10% less
  SHAPE_REMOVE:    'shape/remove',     // { q, i }
  SHAPE_SORT:      'shape/sort',       // { q }                              the steps in order of age (once the keyboard leaves them)
  SHAPE_SUGGEST:   'shape/suggest',    // { q }                              go-go, go-slow and no-go: 15% less from 75, 30% from 85
                                       //                                     (of the younger of you), never below the budget's essentials
  SHAPE_PRESET:    'shape/preset',     // { q, id: 'level' | 'slowly' }      "The same every year" / "Slowly less" (today's old setting)
  SHAPE_UNDO:      'shape/undo',       // { q }                              the shape before the last suggestion or preset
  SHAPE_RESCALE:   'shape/rescale',    // { q, from? }                       A, B: the later steps × new figure ÷ the figure they were set
                                       //                                     against (or `from`: "Try a change" moving the start by £100)

  // ---- the saved plans, read-only (research/v7/your-plan.md 4.2, 4.3) ------------------------------------------------
  SESSION_SET:     'session/set',      // { session }                        who is signed in: 'checking' | 'in' | 'unverified' | 'nobody' | 'failed'
  SESSION_OUT:     'session/out',      // {}                                 "Sign out" pressed: signingOut: true → the plan source signs out
  PLANS_READING:   'plans/reading',    // {}                                 a read is under way (the page opened, shown again, "Read again")
  PLANS_SET:       'plans/set',        // { list, source, readAt }           the plans, brought up to date in memory; never stored anywhere
  PLANS_FAILED:    'plans/failed',     // {}                                 the read failed; nothing was changed
  PLANS_CLEAR:     'plans/clear',      // {}                                 pagehide, sign-out, nobody: the plans leave the page's memory
  PLANS_VIEW:      'plans/view',       // { view }                           the plan source's reading of the plans for the route: { today, rows, page }
  PLAN_CHANGE:     'plan/change',      // { planId, place, back }            "Change this": leaving: the hand-over effect writes the request
  PLAN_CHANGE_FAILED: 'plan/changeFailed', // {}                            this browser would not pass the request on

  // ---- editing a saved plan in V7: "About you and when" (research/v7/editing-in-v7.md 2, 4) --------------------------
  PLAN_EDIT:       'plan/edit',        // { planId, path, value }            one typed value of the plan's draft (text or a choice)
  PLAN_TOUCH:      'plan/touch',       // { planId, path }                   a box has been left
  PLAN_SAVE:       'plan/save',        // { planId }                         Save pressed: asked; saving: the write effect runs
  PLAN_SAVED:      'plan/saved',       // { planId, previous, line }         written: the draft goes, the Undo toast shows (previous: the values put back)
  PLAN_SAVE_FAILED: 'plan/saveFailed', // { planId, problem }                nothing written: locked | notHere | usedUp | nobody | storage | failed | problems
  PLAN_CANCEL:     'plan/cancel',      // { planId }                         the draft goes
  PLAN_UNDO:       'plan/undo',        // { planId }                         Undo pressed: the write effect puts the previous values back
  PLAN_UNDO_DONE:  'plan/undoDone',    // { planId }                         put back; the toast says so
  PLAN_TOAST_CLOSE: 'plan/toastClose', // {}                                 the toast goes (its time is up, or Close)

  // ---- "Does it last?": the one test of a saved plan, run in the preview (research/v7/editing-in-v7.md 10.4) ---------
  LASTS_WORKING:   'lasts/working',    // { key }                            the run for this key (lasts.js runKeyOf) is under way; an old result stays greyed
  LASTS_PROGRESS:  'lasts/progress',   // { key, done, total }               ignored unless the key is the one under way
  LASTS_DONE:      'lasts/done',       // { key, result }                    the result (lastsRun.js), plain data; ignored if the key is stale
  LASTS_FAILED:    'lasts/failed',     // { key, reason? }                   the run failed; "Try again" offered — or reason 'noWorker': this browser cannot start one
  LASTS_SLOW:      'lasts/slow',       // { key }                            slow: true
  LASTS_RETRY:     'lasts/retry'       // {}                                 after a failure: idle again, so the runner starts over
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

/**
 * The ids `ui/toggle` accepts: C's, and A's and B's blocks (split, partTime, pots, levers, chart); the spending shape's
 * block and its table of every year (shape, shapeYears).
 */
export const OPENABLE = Object.freeze(['partner', 'more', 'assumed', 'madeOf', 'allAssumed', 'split', 'partTime', 'pots', 'levers', 'chart', 'shape', 'shapeYears', 'allOptions', 'allLines']);
