/**
 * The rail as data (V7 build brief 4.7): one pure function. No screen decides any of this.
 *
 *   railFor(state) → {
 *     question: 'c',
 *     steps: [ { id, state: 'current' | 'done' | 'open', optional, built, end, href,
 *                result: null | Sentence,     // numbers: what was typed; answer: the careful amount
 *                source: null | object } ],   // the object the keys of `result.parts` are paths into
 *     position: { n, of },
 *     next: { id, button: null | { labelId, href } | { labelId, action } }
 *   }
 *
 * Away from a question (the front door, a "not in the preview yet" screen, an unknown address) there is no rail:
 * { question: null, steps: [], position: null, next: null }.
 *
 * Exactly one step is 'current'; exactly one next sentence applies — the first match in the order of NEXT_C.
 * Labels and the sentences themselves are words: they are in copy/c.js under the same ids. No step is ever blocked.
 * The rail never shows a number the answer function did not produce, and never reads the old app's life stages.
 */
import { QUESTIONS, BUILT } from './questions.js';
import { NEXT_C } from './c.js';
import { href } from '../router/routes.js';
import { A } from '../state/actions.js';
import { parsedDraft, isCurrent, stepStates, needsRun } from '../state/select.js';

const NO_RAIL = Object.freeze({ question: null, steps: [], position: null, next: null });

/** The six questions as the front door links to them: a built one to its first step, the others to "soon". */
export function frontDoor() {
  return QUESTIONS.map((q) => ({ id: q.id, built: q.built, href: q.built ? href.step(q.id, BUILT[q.id].steps[0].id) : href.soon(q.id) }));
}

const blank = (v) => v === undefined || v === null || (typeof v === 'string' && v.trim() === '');
const running = (state) => ['working', 'first'].includes(state.answers.c.status) || needsRun(state, 'c');

/** When each next sentence of question C applies. They are tried in the order of NEXT_C; the first match wins. */
export const NEXT = {
  'c.failed':   (state) => state.answers.c.status === 'failed',
  'c.working':  (state) => running(state),
  'c.blank':    (state) => blank(state.draft.c.values['you.pot']) || blank(state.draft.c.values['you.age']),
  'c.fix':      (state) => !parsedDraft(state, 'c').ok,
  'c.ready':    (state) => !(state.answers.c.status === 'final' && isCurrent(state, 'c')),
  'c.answered': () => true
};

const BUTTONS = {
  'c.failed':   () => ({ labelId: 'c.action.retry', action: { type: A.ANSWER_RETRY, q: 'c' } }),
  'c.ready':    () => ({ labelId: 'c.action.show', action: { type: A.DRAFT_ASK, q: 'c' } }),
  'c.answered': () => ({ labelId: 'c.action.keep', href: href.step('c', 'keep') })
};
/** On a step that is not in the preview yet there is nothing to try again, show or keep: a button there leads back to the answer. */
const BACK_TO_ANSWER = () => ({ labelId: 'c.action.back', href: href.step('c', 'answer') });

// The rail may not import the formatter (it sits with the answers); these two lines say the same thing, and
// tests/v7/rail/rail.test.js checks every short result against format.js.
const pounds = (n) => '£' + String(Math.abs(Math.round(Number(n) || 0))).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
const years = (n) => String(Math.floor(Number(n) || 0));
const get = (obj, key) => key.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
const sentence = (id, parts, source) => ({
  id,
  text: parts.map((p) => (typeof p === 'string' ? p : p.kind === 'age' ? years(get(source, p.key)) : pounds(get(source, p.key)))).join(''),
  parts
});

/** "£250,000, age 58" (and "and a partner" for two) — only when the figures typed can be used. */
function numbersResult(state) {
  const parsed = parsedDraft(state, 'c');
  if (!parsed.ok) return { result: null, source: null };
  const source = { inputs: parsed.inputs };
  const parts = [{ key: 'inputs.you.pot', kind: 'money' }, ', age ', { key: 'inputs.you.age', kind: 'age' }];
  if (parsed.inputs.household === 'couple') parts.push(' and a partner');
  return { result: sentence('c.rail.numbers', parts, source), source };
}

/** "about £1,380 a month" — only from a result for what is typed now, and only when it holds an amount. */
function answerResult(state) {
  const answer = state.answers.c;
  const r = answer.result;
  const shown = (answer.status === 'first' || answer.status === 'final') && isCurrent(state, 'c') &&
    r && (r.status === 'ok' || r.status === 'guaranteed-only') && r.monthly && typeof r.monthly.careful === 'number';
  if (!shown) return { result: null, source: null };
  return { result: sentence('c.rail.answer', ['about ', { key: 'monthly.careful', kind: 'money' }, ' a month'], r), source: r };
}

export function railFor(state) {
  const { route } = state;
  if (route.screen !== 'step' || route.q !== 'c' || !BUILT.c) return { ...NO_RAIL, steps: [] };
  const question = BUILT.c;
  const states = stepStates(state, 'c');
  const steps = question.steps.map((step, i) => {
    const short = step.id === 'numbers' ? numbersResult(state) : step.id === 'answer' ? answerResult(state) : { result: null, source: null };
    return { id: step.id, state: states[i].state, optional: step.optional, built: step.built, end: step.end, href: href.step('c', step.id), ...short };
  });
  const id = NEXT_C.find((x) => NEXT[x](state));
  const here = question.steps.find((s) => s.id === route.step);
  const button = BUTTONS[id] ? (here && !here.built ? BACK_TO_ANSWER() : BUTTONS[id]()) : null;
  return {
    question: 'c',
    steps,
    position: { n: question.steps.findIndex((s) => s.id === route.step) + 1, of: question.steps.length },
    next: { id, button }
  };
}
