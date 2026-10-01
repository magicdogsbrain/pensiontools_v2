/**
 * Pure readers of the state (V7 build brief 4.5; step 4 brief 4.11). Screens may call these; they do no money arithmetic.
 *
 *   parsedDraft(state, q)   → parseDraft(schema, state.draft[q].values, state.env)
 *   currentKey(state, q)    → the key of what is typed now, or null when it does not parse
 *   isCurrent(state, q)     → the stored answer was worked out from what is typed now
 *   errorsToShow(state, q)  → { [path]: messageId } for fields that have been left, or all once asked — except the
 *                              fields that came onto the form after the ask, until they are left too
 *   appliedPaths(state, q)  → the paths of the fields that apply to what is typed now
 *   stepStates(state, q)    → [ { id, state: 'current' | 'done' | 'open' } ] for the rail
 *   needsRun(state, q)      → the runner should work out an answer (rules 1 and 2 of brief 4.10; step 4 4.11)
 *   wantedDetail(state, q)  → the detail the runner should ask for (A and B; null for C)
 *   isRetired(state, q)     → the draft of A or B describes someone who has stopped: the retired view
 *   readyMark(state)        → { ready: '1' | '0', answer: 'none' | 'first' | 'final' | 'partial' } for #app (brief 4.9, 4.13)
 */
import { SCHEMA_C } from '../../answers/c/schema.js';
import { SCHEMA_A } from '../../answers/a/schema.js';
import { SCHEMA_B } from '../../answers/b/schema.js';
import { parseDraft, fieldsThatApply, nest } from '../../answers/shared/validate.js';
import { alreadyStopped } from '../../answers/shared/schemaParts.js';
import { inputsKey } from './inputsKey.js';
import { BUILT } from '../rail/questions.js';

/** The input list of each question. A question's draft is in the state only while it is open (rail/questions.js OPEN). */
export const SCHEMAS = { c: SCHEMA_C, a: SCHEMA_A, b: SCHEMA_B };

/**
 * The detail each step of A and B shows (conflict 43). The answer step is worked out at its default detail by C's two
 * passes; an optional step that needs more asks for one more pass (answer/extend). C has no details.
 */
export const STEP_DETAIL = Object.freeze({ a: Object.freeze({ answer: 'chart', ages: 'all' }), b: Object.freeze({ answer: 'answer', choices: 'grid' }) });
/** The details in order, least first: a result at a later detail holds everything an earlier one does. */
export const DETAIL_ORDER = Object.freeze({ a: Object.freeze(['chart', 'all']), b: Object.freeze(['answer', 'grid']) });

const rankOf = (q, detail) => (DETAIL_ORDER[q] ? DETAIL_ORDER[q].indexOf(detail) : -1);

const NOTHING = Object.freeze({ ok: false, inputs: null, errors: {}, usedDefault: [], values: {} });

// parseDraft is asked for many times per draw with the same values object (the reducer never changes one in
// place), so the last reading for each is remembered. Same input → same output; nothing outside can tell.
const remembered = new WeakMap();

export function parsedDraft(state, q) {
  const schema = SCHEMAS[q];
  const draft = state && state.draft && state.draft[q];
  if (!schema || !draft || !draft.values) return NOTHING;
  const hit = remembered.get(draft.values);
  if (hit && hit.today === state.env.today) return hit.parsed;
  const parsed = parseDraft(schema, draft.values, state.env);
  remembered.set(draft.values, { today: state.env.today, parsed });
  return parsed;
}

export function currentKey(state, q) {
  const parsed = parsedDraft(state, q);
  return parsed.ok ? inputsKey(parsed.inputs, state.env) : null;
}

export function isCurrent(state, q) {
  const answer = state.answers[q];
  if (!answer || answer.inputsKey === null) return false;
  return answer.inputsKey === currentKey(state, q);
}

/**
 * The errors a person should see: for the fields they have left; once "Show what it pays" has been pressed, for
 * every field that was on the form then. A field that came onto the form afterwards (a partner's age, opened after
 * a first answer) is not marked until it has been left or the button is pressed again — nothing goes red before
 * anyone has had a chance to type in it.
 */
export function errorsToShow(state, q) {
  const draft = state.draft[q];
  if (!draft) return {};
  const { errors } = parsedDraft(state, q);
  const touched = draft.touched || [];
  const revealed = draft.revealed || [];
  const out = {};
  for (const path of Object.keys(errors)) {
    if (touched.includes(path) || (draft.asked && !revealed.includes(path))) out[path] = errors[path];
  }
  return out;
}

/** The paths of the fields that apply to what is typed (defaults by rule included), for the reducer's `revealed`. */
export function appliedPaths(state, q) {
  const schema = SCHEMAS[q];
  if (!schema) return [];
  return fieldsThatApply(schema, parsedDraft(state, q).values).map((f) => f.path);
}

const onStep = (state, q, step) => state.route.screen === 'step' && state.route.q === q && state.route.step === step;

/**
 * The state of each step of a question. Exactly one is 'current' when the route is a step of that question.
 * 'done' = has what it needs: the numbers step when the draft parses; the answer step when a final answer for
 * what is typed now is held. Steps that are not built are never done.
 */
export function stepStates(state, q) {
  const question = BUILT[q];
  if (!question) return [];
  const answer = state.answers[q];
  return question.steps.map((step) => {
    if (onStep(state, q, step.id)) return { id: step.id, state: 'current' };
    let done = false;
    if (step.id === 'numbers') done = parsedDraft(state, q).ok;
    else if (step.id === 'answer') done = !!answer && answer.status === 'final' && isCurrent(state, q);
    else if (step.built && STEP_DETAIL[q] && STEP_DETAIL[q][step.id]) {
      // An optional step of A or B: done once a final answer for what is typed holds the step's detail.
      done = !!answer && answer.status === 'final' && !answer.extending && isCurrent(state, q) &&
        rankOf(q, answer.detail) >= rankOf(q, STEP_DETAIL[q][step.id]);
    }
    return { id: step.id, state: done ? 'done' : 'open' };
  });
}

/** The step of question q on screen that asks for more detail than the answer step (A's ages, B's choices), or null. */
function optionalStepDetail(state, q) {
  const r = state.route;
  const table = STEP_DETAIL[q];
  if (!table || r.screen !== 'step' || r.q !== q || r.step === 'answer') return null;
  const step = BUILT[q] && BUILT[q].steps.find((s) => s.id === r.step);
  return step && step.built && table[r.step] ? table[r.step] : null;
}

/** A final answer for what is typed now, at a lower detail than the optional step on screen asks for, not being extended. */
function wantsMore(state, q, key) {
  const want = optionalStepDetail(state, q);
  const answer = state.answers[q];
  return !!want && !!answer && answer.inputsKey === key && answer.status === 'final' && !answer.extending &&
    rankOf(q, answer.detail) < rankOf(q, want);
}

/**
 * True when an answer should be worked out now:
 *  - the answer step (as C): the draft parses and the answer held is not for these inputs. A failed run for the same
 *    inputs is not run again until 'answer/retry' clears its key;
 *  - an optional step of A or B (ages, choices): the same — the answer step's passes first — and then, once a final
 *    answer for these inputs is held at a lower detail than the step shows and is not being extended, one more pass;
 *  - never on the retired view of A or B, which shows no answer.
 */
export function needsRun(state, q) {
  const onOptional = !!optionalStepDetail(state, q);
  if (!onStep(state, q, 'answer') && !onOptional) return false;
  const key = currentKey(state, q);
  if (key === null) return false;
  if (isRetired(state, q)) return false;
  const answer = state.answers[q];
  if (!(answer.inputsKey === key && ['working', 'first', 'final', 'failed'].includes(answer.status))) return true;
  return onOptional && wantsMore(state, q, key);
}

/**
 * The detail the runner should ask for now (A and B): the optional step's own once a final answer for what is typed is
 * held at a lower detail; otherwise the answer step's default. null for a question without details (C), whose env
 * carries none.
 */
export function wantedDetail(state, q) {
  const table = STEP_DETAIL[q];
  if (!table) return null;
  return wantsMore(state, q, currentKey(state, q)) ? optionalStepDetail(state, q) : table.answer;
}

/**
 * The retired view (step 4 brief 4.11, conflict 44): the draft of A or B says the person has stopped — the stop age at
 * or before today's age — and is at or past their State Pension age (alreadyStopped). Read from every figure that
 * parsed, so that B, whose own rule refuses a stop at today's age, still recognises a draft carried in from C.
 * Never for C, and never for "show me ages" (no stop age).
 */
export function isRetired(state, q) {
  if (q !== 'a' && q !== 'b') return false;
  const parsed = parsedDraft(state, q);
  const inputs = parsed.ok ? parsed.inputs : nest(parsed.values || {});
  return alreadyStopped(inputs, state.env.today);
}

/**
 * What #app carries for tests: ready is '1' only when no run is under way or about to start and everything shown is
 * final; answer says which figure is on screen — 'partial' while an optional step's extra pass is due or running
 * (the headline is final, the rest is arriving).
 */
export function readyMark(state) {
  let busy = false;
  let shown = 'none';
  let partial = false;
  for (const q of Object.keys(state.answers)) {
    const answer = state.answers[q];
    const { status } = answer;
    const due = needsRun(state, q);
    if (status === 'working' || status === 'first' || due || answer.extending) busy = true;
    if (answer.extending || (due && status === 'final' && isCurrent(state, q))) partial = true;
    if (status === 'first' || status === 'final') shown = status;
  }
  return { ready: busy ? '0' : '1', answer: partial ? 'partial' : shown };
}
