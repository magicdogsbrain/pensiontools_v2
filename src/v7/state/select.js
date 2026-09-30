/**
 * Pure readers of the state (V7 build brief 4.5). Screens may call these; they do no money arithmetic.
 *
 *   parsedDraft(state, q)   → parseDraft(schema, state.draft[q].values, state.env)
 *   currentKey(state, q)    → the key of what is typed now, or null when it does not parse
 *   isCurrent(state, q)     → the stored answer was worked out from what is typed now
 *   errorsToShow(state, q)  → { [path]: messageId } for fields that have been left, or all once asked — except the
 *                              fields that came onto the form after the ask, until they are left too
 *   appliedPaths(state, q)  → the paths of the fields that apply to what is typed now
 *   stepStates(state, q)    → [ { id, state: 'current' | 'done' | 'open' } ] for the rail
 *   needsRun(state, q)      → the runner should work out an answer (rules 1 and 2 of brief 4.10)
 *   readyMark(state)        → { ready: '1' | '0', answer: 'none' | 'first' | 'final' } for #app (brief 4.9)
 */
import { SCHEMA_C } from '../../answers/c/schema.js';
import { parseDraft, fieldsThatApply } from '../../answers/shared/validate.js';
import { inputsKey } from './inputsKey.js';
import { BUILT } from '../rail/questions.js';

/** The input list of each question that is built. */
export const SCHEMAS = { c: SCHEMA_C };

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
    return { id: step.id, state: done ? 'done' : 'open' };
  });
}

/**
 * True when an answer should be worked out now: the answer step is on screen, the draft parses, and the answer
 * held is not for these inputs. A failed run for the same inputs is not run again until 'answer/retry' clears
 * its key.
 */
export function needsRun(state, q) {
  if (!onStep(state, q, 'answer')) return false;
  const key = currentKey(state, q);
  if (key === null) return false;
  const answer = state.answers[q];
  return !(answer.inputsKey === key && ['working', 'first', 'final', 'failed'].includes(answer.status));
}

/**
 * What #app carries for tests: ready is '1' only when no run is under way or about to start and any answer shown
 * is final; answer says which figure is on screen.
 */
export function readyMark(state) {
  let busy = false;
  let shown = 'none';
  for (const q of Object.keys(state.answers)) {
    const { status } = state.answers[q];
    if (status === 'working' || status === 'first' || needsRun(state, q)) busy = true;
    if (status === 'first' || status === 'final') shown = status;
  }
  return { ready: busy ? '0' : '1', answer: shown };
}
