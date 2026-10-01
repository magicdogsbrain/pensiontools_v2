/**
 * The rail as data (V7 build brief 4.7; step 4 brief 4.12): one pure function over every open question. No screen
 * decides any of this.
 *
 *   railFor(state) → {
 *     question: 'a' | 'b' | 'c',
 *     steps: [ { id, state: 'current' | 'done' | 'open', optional, built, end, href,
 *                result: null | Sentence,     // numbers: what was typed; spend (A, B): the figure in use; answer: the
 *                                             // careful amount (C), the verdict (A), the pay-in or number (B); A's ages:
 *                                             // the earliest age that worked; keep: "Saved" once the planner took it
 *                source: null | object } ],   // the object the keys of `result.parts` are paths into
 *     position: { n, of },
 *     next: { id, button: null | { labelId, href } | { labelId, action } }
 *   }
 *
 * Away from a question (the front door, a "not in the preview yet" screen, an unknown address) there is no rail:
 * { question: null, steps: [], position: null, next: null }.
 *
 * Exactly one step is 'current'; exactly one next sentence applies — the first match in the question's order
 * (NEXT_C, NEXT_A, NEXT_B). A and B have the budget step ('a.spend', 'b.spend': the numbers are there, the spending is
 * not); every question has its "Save this as a plan?" step ('c.keep', 'a.keep', 'b.keep'). A button never leads to the
 * step on screen. Labels and the sentences themselves are words: they are in copy/<q>.js under the same ids.
 * No step is ever blocked. The rail never shows a number the answer function did not produce (the numbers step shows
 * what was typed), never counts down to anything, and never reads the old app's life stages.
 */
import { QUESTIONS, BUILT } from './questions.js';
import { NEXT_C } from './c.js';
import { NEXT_A } from './a.js';
import { NEXT_B } from './b.js';
import { href } from '../router/routes.js';
import { A } from '../state/actions.js';
import { parsedDraft, isCurrent, stepStates, needsRun, appliedPaths, isRetired, SPEND_STEP, SPEND_PATHS, numbersDone, figureInUse, keepView } from '../state/select.js';
import { nest } from '../../answers/shared/validate.js';

const NO_RAIL = Object.freeze({ question: null, steps: [], position: null, next: null });

/** The six questions as the front door links to them: a built one to its first step, the others to "soon". */
export function frontDoor() {
  return QUESTIONS.map((q) => ({ id: q.id, built: q.built, href: q.built ? href.step(q.id, BUILT[q.id].steps[0].id) : href.soon(q.id) }));
}

const blank = (v) => v === undefined || v === null || (typeof v === 'string' && v.trim() === '');
const running = (state, q) => ['working', 'first'].includes(state.answers[q].status) || !!state.answers[q].extending || needsRun(state, q);
const answeredNow = (state, q) => state.answers[q].status === 'final' && isCurrent(state, q);
const resultOf = (state, q) => state.answers[q].result || {};

/**
 * A needed field of the answer step (rail/a.js, b.js `needs`) is missing: blank as typed, and on the form — a needed
 * field that does not apply to what is typed (the stop age under "show me ages", the amount under a level) is met.
 */
function missingNeeds(state, q, which = 'all') {
  const step = BUILT[q].steps.find((s) => s.id === 'answer');
  const applies = new Set(appliedPaths(state, q));
  const values = state.draft[q].values;
  const counts = (n) => (which === 'spend' ? SPEND_PATHS.includes(n) : which === 'numbers' ? !SPEND_PATHS.includes(n) : true);
  return step.needs.some((n) => n !== 'answer' && counts(n) && applies.has(n) && blank(values[n]));
}

/**
 * A's and B's budget step: the numbers step has what it needs and the spending does not yet ('a.spend', 'b.spend').
 * The numbers step's own blanks come first ('a.blank'); a figure marked wrong there, after ('a.fix').
 */
const spendNext = (state, q) => SPEND_STEP[q] && numbersDone(state, q) && missingNeeds(state, q, 'spend');
const onStep = (state, q, step) => state.route.screen === 'step' && state.route.q === q && state.route.step === step;
/** On "Save this as a plan?" with an answer for what is typed: name it and save — or, when it cannot be saved, back. */
const onKeep = (q) => (state) => onStep(state, q, 'keep') && answeredNow(state, q);
const KEEP_BUTTON = (q) => (state) => (keepView(state, q).can ? null : { labelId: `${q}.action.back`, href: href.step(q, 'answer') });

/** When each next sentence of question C applies. They are tried in the order of NEXT_C; the first match wins. */
export const NEXT = {
  'c.failed':   (state) => state.answers.c.status === 'failed',
  'c.working':  (state) => running(state, 'c'),
  'c.blank':    (state) => blank(state.draft.c.values['you.pot']) || blank(state.draft.c.values['you.age']),
  'c.fix':      (state) => !parsedDraft(state, 'c').ok,
  'c.ready':    (state) => !answeredNow(state, 'c'),
  'c.keep':     onKeep('c'),
  'c.answered': () => true
};

/**
 * Question A (screens-A-B.md 2.1). The verdict sentences read the answer's headline; "show me ages" reads its kind.
 * On the every-age step itself the next thing is to press an age in the table ('a.ages') — never "see every age",
 * which is the step on screen.
 */
const headlineOf = (state) => resultOf(state, 'a').headline || {};
const onAges = (state) => state.route.screen === 'step' && state.route.q === 'a' && state.route.step === 'ages';
const named = (state) => !onAges(state) && !['earliest', 'noneWorked'].includes(headlineOf(state).kind);
const NEXT_A_RULES = {
  'a.retired':   (state) => isRetired(state, 'a'),
  'a.failed':    (state) => state.answers.a.status === 'failed',
  'a.working':   (state) => running(state, 'a'),
  'a.blank':     (state) => missingNeeds(state, 'a', 'numbers'),
  'a.spend':     (state) => spendNext(state, 'a'),
  'a.fix':       (state) => !parsedDraft(state, 'a').ok,
  'a.ready':     (state) => !answeredNow(state, 'a'),
  'a.keep':      onKeep('a'),
  'a.no':        (state) => named(state) && !['yes', 'close'].includes(headlineOf(state).verdict),
  'a.close':     (state) => named(state) && headlineOf(state).verdict === 'close',
  'a.yes':       (state) => named(state) && headlineOf(state).verdict === 'yes',
  'a.ages':      (state) => onAges(state) || headlineOf(state).kind === 'earliest',
  'a.ages.none': () => true
};

/**
 * Question B (screens-A-B.md 2.2). On the grid step itself the next thing is to read (or press) a cell — never "try two
 * together", which is the step on screen.
 */
const onChoices = (state) => state.route.screen === 'step' && state.route.q === 'b' && state.route.step === 'choices';
const NEXT_B_RULES = {
  'b.retired':   (state) => isRetired(state, 'b'),
  'b.failed':    (state) => state.answers.b.status === 'failed',
  'b.working':   (state) => running(state, 'b'),
  'b.blank':     (state) => missingNeeds(state, 'b', 'numbers'),
  'b.spend':     (state) => spendNext(state, 'b'),
  'b.fix':       (state) => !parsedDraft(state, 'b').ok,
  'b.ready':     (state) => !answeredNow(state, 'b'),
  'b.keep':      onKeep('b'),
  'b.choices':   onChoices,
  'b.none':      (state) => resultOf(state, 'b').status === 'out-of-reach',
  'b.short':     (state) => resultOf(state, 'b').onCourse !== true,
  'b.onCourse':  () => true
};

/** Each question's next sentences: the rules, and the order they are tried in. */
export const NEXT_RULES = { c: NEXT, a: NEXT_A_RULES, b: NEXT_B_RULES };
export const NEXT_ORDER = { c: NEXT_C, a: NEXT_A, b: NEXT_B };

/**
 * A hand-over (step 4 brief 4.11, screens-A-B.md 5) as a button: one action, draft/carry, which fills the target's
 * draft by the declared map and opens the place CARRY_OPENS names. The label is `<from>.next.<to>` in copy/.
 */
export const carryButton = (from, to) => ({ labelId: `${from}.next.${to}`, action: { type: A.DRAFT_CARRY, from, to } });

/** "Will it last?" — question D, not in the preview yet. */
const TO_D = (q) => () => ({ labelId: `${q}.action.willItLast`, href: href.soon('d') });
/** "What would you spend?" — the spend step; no button on the step itself. */
const TO_SPEND = (q) => (state) => (onStep(state, q, 'spend') ? null : { labelId: `${q}.action.spend`, href: href.step(q, 'spend') });

const BUTTONS = {
  'c.failed':    () => ({ labelId: 'c.action.retry', action: { type: A.ANSWER_RETRY, q: 'c' } }),
  'c.ready':     () => ({ labelId: 'c.action.show', action: { type: A.DRAFT_ASK, q: 'c' } }),
  'c.keep':      KEEP_BUTTON('c'),
  'c.answered':  () => ({ labelId: 'c.action.keep', href: href.step('c', 'keep') }),
  'a.retired':   TO_D('a'),
  'a.failed':    () => ({ labelId: 'a.action.retry', action: { type: A.ANSWER_RETRY, q: 'a' } }),
  'a.spend':     TO_SPEND('a'),
  'a.ready':     () => ({ labelId: 'a.action.show', action: { type: A.DRAFT_ASK, q: 'a' } }),
  'a.keep':      KEEP_BUTTON('a'),
  'a.no':        () => ({ labelId: 'a.action.seeAges', href: href.step('a', 'ages') }),
  'a.yes':       () => ({ labelId: 'a.action.keep', href: href.step('a', 'keep') }),
  'a.ages.none': () => carryButton('a', 'c'),
  'b.retired':   TO_D('b'),
  'b.failed':    () => ({ labelId: 'b.action.retry', action: { type: A.ANSWER_RETRY, q: 'b' } }),
  'b.spend':     TO_SPEND('b'),
  'b.ready':     () => ({ labelId: 'b.action.show', action: { type: A.DRAFT_ASK, q: 'b' } }),
  'b.keep':      KEEP_BUTTON('b'),
  'b.choices':   () => ({ labelId: 'b.action.back', href: href.step('b', 'answer') }),
  'b.short':     () => ({ labelId: 'b.action.together', href: href.step('b', 'choices') }),
  'b.onCourse':  () => ({ labelId: 'b.action.keep', href: href.step('b', 'keep') })
};
/** On a step that is not in the preview yet there is nothing to try again, show or keep: a button there leads back to the answer. */
const BACK_TO_ANSWER = (q) => ({ labelId: `${q}.action.back`, href: href.step(q, 'answer') });

// The rail may not import the formatter (it sits with the answers); these lines say the same thing, and
// tests/v7/rail/rail.test.js and rail.ab.test.js check every short result against format.js.
const pounds = (n) => '£' + String(Math.abs(Math.round(Number(n) || 0))).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
const potText = (n) => pounds(Math.round(Math.abs(Number(n) || 0) / 1000) * 1000);
const years = (n) => String(Math.floor(Number(n) || 0));
const get = (obj, key) => key.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
const textOf = (p, source) => (typeof p === 'string' ? p : p.kind === 'age' ? years(get(source, p.key)) : p.kind === 'pot' ? potText(get(source, p.key)) : pounds(get(source, p.key)));
const sentence = (id, parts, source) => ({ id, text: parts.map((p) => textOf(p, source)).join(''), parts });
const NONE = Object.freeze({ result: null, source: null });

/**
 * The figures typed, when they can be used: "£250,000, age 58" (C); A and B add the stop and what goes in — the
 * spending is the spend step's own short result.
 */
function numbersResult(state, q) {
  const parsed = parsedDraft(state, q);
  if (SPEND_STEP[q] ? !numbersDone(state, q) : !parsed.ok) return NONE;
  const inputs = parsed.ok ? parsed.inputs : nest(parsed.values);
  const source = { inputs };
  const parts = [{ key: 'inputs.you.pot', kind: 'money' }, ', age ', { key: 'inputs.you.age', kind: 'age' }];
  const stop = inputs.stop && typeof inputs.stop.age === 'number' && !isRetired(state, q);
  if (q === 'a') {
    if (stop) parts.push(', stop at ', { key: 'inputs.stop.age', kind: 'age' });
  } else if (q === 'b') {
    if (inputs.you.payIn && inputs.you.payIn.kind === 'total') parts.push(', ', { key: 'inputs.you.payIn.total', kind: 'money' }, ' a month in');
    if (stop) parts.push(', stop at ', { key: 'inputs.stop.age', kind: 'age' });
  } else if (q === 'c') {
    // still paying in (C's first form): what goes in, as typed — one figure, or the two parts as they were typed
    const p = inputs.you.payIn;
    if (p && p.has === 'yes' && p.kind === 'total' && typeof p.total === 'number') parts.push(', ', { key: 'inputs.you.payIn.total', kind: 'money' }, ' a month in');
    else if (p && p.has === 'yes' && p.kind === 'split' && typeof p.own === 'number' && typeof p.employer === 'number') {
      parts.push(', ', { key: 'inputs.you.payIn.own', kind: 'money' }, ' + ', { key: 'inputs.you.payIn.employer', kind: 'money' }, ' a month in');
    }
  }
  if (inputs.household === 'couple') parts.push(' and a partner');
  return { result: sentence(`${q}.rail.numbers`, parts, source), source };
}

/** A result for what is typed now, first or final, that is not a problem: the only kind a short result may read. */
function shownResult(state, q) {
  const answer = state.answers[q];
  const r = answer.result;
  const ok = (answer.status === 'first' || answer.status === 'final') && isCurrent(state, q) && r && typeof r === 'object';
  return ok ? r : null;
}

/**
 * C: "about £1,380 a month" — only when the result holds an amount it stands by: not when the years before a closed
 * pension opens hold the steady amount down (closedYears: the answer says that in words, with two figures).
 */
function answerResultC(state) {
  const r = shownResult(state, 'c');
  if (!r || !(r.status === 'ok' || r.status === 'guaranteed-only') || !r.monthly || typeof r.monthly.careful !== 'number' || r.closedYears) return NONE;
  return { result: sentence('c.rail.answer', ['about ', { key: 'monthly.careful', kind: 'money' }, ' a month'], r), source: r };
}

/** A: "Yes at 60" / "Close at 60" / "Not at 60" / "Earliest that worked: 61" — the headline's verdict and age. */
function answerResultA(state) {
  const r = shownResult(state, 'a');
  const h = r && r.headline;
  if (!h || typeof h.age !== 'number' || !['named', 'earliest', 'noneWorked'].includes(h.kind)) return NONE;
  const lead = h.kind === 'earliest' ? 'Earliest that worked: ' : h.verdict === 'yes' ? 'Yes at ' : h.verdict === 'close' ? 'Close at ' : 'Not at ';
  return { result: sentence('a.rail.answer', [lead, { key: 'headline.age', kind: 'age' }], r), source: r };
}

/** A's every-age step: "Earliest that worked: 61" — once a final answer holds every age. */
function agesResultA(state) {
  const r = shownResult(state, 'a');
  const answer = state.answers.a;
  if (!r || answer.status !== 'final' || answer.extending || answer.detail !== 'all' || !r.earliest || typeof r.earliest.yes !== 'number') return NONE;
  return { result: sentence('a.rail.ages', ['Earliest that worked: ', { key: 'earliest.yes', kind: 'age' }], r), source: r };
}

/**
 * B: "On course for 60" / "About £1,050 a month in" — the pay-in is B's answer (one test everywhere: what goes in
 * that makes the money last); the number by the age, a guide, only when there is no pay-in to name.
 */
function answerResultB(state) {
  const r = shownResult(state, 'b');
  if (!r || !r.stop || typeof r.stop.age !== 'number') return NONE;
  if (r.onCourse === true) return { result: sentence('b.rail.answer', ['On course for ', { key: 'stop.age', kind: 'age' }], r), source: r };
  if (r.payIn && typeof r.payIn.needed === 'number' && r.payIn.needed > 0) {
    return { result: sentence('b.rail.answer', ['About ', { key: 'payIn.needed', kind: 'money' }, ' a month in'], r), source: r };
  }
  if (!r.number || typeof r.number.careful !== 'number' || r.number.careful <= 0) return NONE;
  return { result: sentence('b.rail.answer', ['About ', { key: 'number.careful', kind: 'pot' }, ' by ', { key: 'stop.age', kind: 'age' }], r), source: r };
}

/** The spend step: "£2,000 a month" as typed, or "Moderate level: £2,608 a month" — the one figure the answer uses. */
const LEVEL_WORD = { minimum: 'Basic', moderate: 'Moderate', comfortable: 'Comfortable' };
function spendResult(state, q) {
  const figure = figureInUse(state, q);
  if (figure === null) return NONE;
  const v = parsedDraft(state, q).values;
  const source = { spend: { figure } };
  const parts = v['spend.kind'] === 'level'
    ? [`${LEVEL_WORD[v['spend.level']] || 'The'} level: `, { key: 'spend.figure', kind: 'money' }, ' a month']
    : [{ key: 'spend.figure', kind: 'money' }, ' a month'];
  return { result: sentence(`${q}.rail.spend`, parts, source), source };
}

/** The keep step, once the planner has taken a plan saved from here: "Saved". */
function keepResult(state, q) {
  const k = state.keep && state.keep[q];
  return k && k.back === 'taken' ? { result: sentence(`${q}.rail.keep`, ['Saved'], {}), source: null } : NONE;
}

const SHORT = {
  c: { numbers: (s) => numbersResult(s, 'c'), answer: answerResultC, keep: (s) => keepResult(s, 'c') },
  a: { numbers: (s) => numbersResult(s, 'a'), spend: (s) => spendResult(s, 'a'), answer: answerResultA, ages: agesResultA, keep: (s) => keepResult(s, 'a') },
  b: { numbers: (s) => numbersResult(s, 'b'), spend: (s) => spendResult(s, 'b'), answer: answerResultB, keep: (s) => keepResult(s, 'b') }
};

export function railFor(state) {
  const { route } = state;
  const q = route.q;
  if (route.screen !== 'step' || !BUILT[q] || !NEXT_RULES[q] || !state.draft[q] || !state.answers[q]) return { ...NO_RAIL, steps: [] };
  const question = BUILT[q];
  const states = stepStates(state, q);
  const steps = question.steps.map((step, i) => {
    const short = SHORT[q][step.id] ? SHORT[q][step.id](state) : NONE;
    return { id: step.id, state: states[i].state, optional: step.optional, built: step.built, end: step.end, href: href.step(q, step.id), ...short };
  });
  const id = NEXT_ORDER[q].find((x) => NEXT_RULES[q][x](state));
  const here = question.steps.find((s) => s.id === route.step);
  const found = BUTTONS[id] ? (here && !here.built ? BACK_TO_ANSWER(q) : BUTTONS[id](state)) : null;
  // A button never leads to the step already on screen (the keep step's own "Save this as a plan").
  const button = found && found.href && found.href === href.step(q, route.step) ? null : found;
  return {
    question: q,
    steps,
    position: { n: question.steps.findIndex((s) => s.id === route.step) + 1, of: question.steps.length },
    next: { id, button }
  };
}
