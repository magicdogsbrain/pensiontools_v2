/**
 * Makes the named states the render tests, the browser journeys and the pictures all draw:
 * tests/v7/states/<q>/<name>.json — each a whole V7 state (build brief 4.5; step 4 brief 4.11), with the answer inside
 * produced by the answer function and pinned.
 *
 *   npx -y node@20 tests/v7/states/build-states.mjs                  question C (futures: 1,000 — what the published page shows)
 *   npx -y node@20 tests/v7/states/build-states.mjs --question a     question A (states/a/), with src/answers/a/answer.js
 *   npx -y node@20 tests/v7/states/build-states.mjs --question b     question B
 *   V7_STATES_FUTURES=40 npx -y node@20 tests/v7/states/build-states.mjs
 *
 * Run it again whenever the answer function, the input list or the shell's inputsKey changes;
 * tests/v7/c/render.test.js fails when a state no longer matches a fresh run.
 *
 * While the answer function is package 1's STUB, its figures do not follow the inputs and it never returns the
 * `take`, small-pot, pensions-only or nothing-at-all results. For those four states a hand-made result of the
 * contract's shape is put in, and tests/v7/states/made-with.json says so. With the real function nothing is
 * patched: delete nothing here, just run the script again (joining up, step 2).
 */
import { writeFileSync, mkdirSync, readdirSync, rmSync, existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { initialState } from '../../../src/v7/state/initial.js';
import { parse } from '../../../src/v7/router/routes.js';
import { SCHEMA_C } from '../../../src/answers/c/schema.js';
import { parseDraft } from '../../../src/answers/shared/validate.js';
import { partsText } from '../../../src/answers/shared/format.js';
import { answerC } from '../../../src/answers/c/answer.js';
import { SCHEMA_A } from '../../../src/answers/a/schema.js';
import { SCHEMA_B } from '../../../src/answers/b/schema.js';
import { answerA } from '../../../src/answers/a/answer.js';
import { answerB } from '../../../src/answers/b/answer.js';
import { outOfTen } from '../../../src/answers/shared/format.js';
import { verdictOf } from '../../../src/answers/shared/rules.js';
import { emptySaverDraft, emptySaverAnswer } from '../../../src/v7/state/initial.js';
import { checkInputs } from '../../../src/answers/shared/validate.js';
import { VERSION } from '../../../src/constants.js';

const here = dirname(fileURLToPath(import.meta.url));
const TODAY = '2026-09-30';
const FUTURES = Number(process.env.V7_STATES_FUTURES || 1000);
const at = process.argv.indexOf('--question');
const QUESTION = at === -1 ? 'c' : process.argv[at + 1];
if (!['a', 'b', 'c'].includes(QUESTION)) throw new Error(`--question takes a, b or c, not ${QUESTION}`);

/** The shell's own key for a set of inputs (package 3). Until that file exists: the brief's definition (4.5). */
async function keyFunction() {
  const file = join(here, '../../../src/v7/state/inputsKey.js');
  if (existsSync(file)) {
    const m = await import(file);
    if (typeof m.inputsKey === 'function') return { inputsKey: m.inputsKey, from: 'src/v7/state/inputsKey.js' };
  }
  const stable = (v) => (v && typeof v === 'object' && !Array.isArray(v)
    ? '{' + Object.keys(v).sort().map((k) => JSON.stringify(k) + ':' + stable(v[k])).join(',') + '}'
    : JSON.stringify(v));
  return { inputsKey: (inputs, env) => `${stable(inputs)}|${env.today}|${env.appVersion}`, from: 'the brief (4.5) — package 3\'s file was not there' };
}

// ---- what is typed, as typed ----------------------------------------------------------------------------------
const F1 = { 'you.pot': '250,000', 'you.age': '58' };
const F2 = {
  household: 'couple', 'you.pot': '400,000', 'you.age': '62', 'you.finalSalary.has': true, 'you.finalSalary.yearly': '9,000',
  'you.finalSalary.fromAge': '65', 'partner.age': '60', 'partner.pot': '150,000'
};
const F3 = {
  'you.pot': '180,000', 'you.age': '68', 'you.statePension.kind': 'forecast', 'you.statePension.yearly': '11,000',
  'you.finalSalary.has': true, 'you.finalSalary.yearly': '6,000', 'you.finalSalary.fromAge': '60', risk: 'cautious', take: '2,200'
};
/**
 * The owner's 55-year-old (the owner's report, 1 Oct 2026): £275,000, the money from 67, still paying in — £500 of their
 * own and £300 from the employer a month (what lands in the pension). e2e/c-paying-in.spec.js types the same.
 */
const PAYING_IN = {
  'you.pot': '275,000', 'you.age': '55', 'you.payIn.has': 'yes', 'you.payIn.own': '500', 'you.payIn.employer': '300',
  'start.kind': 'age', 'start.age': '67'
};

const sentence = (id, parts, result) => ({ id, text: partsText(parts, result), parts });
const ONE_IN_TEN = ['(the worst ', { fixed: '1' }, ' in ', { fixed: '10' }, ')'];

/** Stand-ins for what the stub cannot return. Each only fills what is missing, so the real function is left alone. */
const PATCH = {
  take(r) {
    if (r.take && r.sentences.take) return false;
    r.take = { perMonth: r.inputs.take, lasted: 0.7, runOutAge: 84, covered: false };
    r.sentences.take = sentence('c.take', ['Taking ', { key: 'take.perMonth', kind: 'money' }, ' a month, the money lasted to ',
      { key: 'inputs.endAge', kind: 'age' }, ' in only ', { fixed: '7' }, ' futures out of ', { fixed: '10' }, '. In a bad case ', ...ONE_IN_TEN,
      ' it would run out at age ', { key: 'take.runOutAge', kind: 'age' }, '.'], r);
    return true;
  },
  small(r) {
    if (r.sentences.small) return false;
    r.sentences.small = sentence('c.small', ['A pot of ', { key: 'inputs.you.pot', kind: 'money' }, ' is small to spread over ',
      { key: 'basis.years', kind: 'age' }, ' years. Many people with a pot this size take it as one or a few lump sums instead.'], r);
    return true;
  },
  pensionsOnly(r) {
    if (r.status === 'guaranteed-only') return false;
    r.status = 'guaranteed-only';
    const g = r.guaranteed.monthlyAfterTax;
    r.monthly = { careful: g, middling: g, good: g };
    r.yearly = { careful: g * 12, middling: g * 12, good: g * 12 };
    r.lasted = { careful: 1, middling: 1, good: 1 };
    r.runOutAge = { careful: r.basis.endAge, middling: r.basis.endAge, good: r.basis.endAge };
    r.assumed = r.assumed.filter((a) => !['all-pension', 'quarter-tax-free', 'risk', 'steady', 'futures', 'no-charges'].includes(a.id));
    r.warnings = [{ id: 'nothing-to-draw', severity: 'note', text: '', parts: ['There is no pot to draw on, so this is your State Pension only.'] }];
    r.warnings.forEach((w) => { w.text = partsText(w.parts, r); });
    r.sentences = { madeOf: [], nothing: sentence('c.nothing.pensions', ['There is no pot to draw on, so this is your State Pension only: ',
      { key: 'guaranteed.monthlyAfterTax', kind: 'money' }, ' a month after tax.'], r) };
    return true;
  },
  nothing(r) {
    if (r.status === 'none') return false;
    r.status = 'none';
    r.monthly = { careful: 0, middling: 0, good: 0 };
    r.yearly = { careful: 0, middling: 0, good: 0 };
    r.lasted = { careful: 1, middling: 1, good: 1 };
    r.runOutAge = { careful: r.basis.endAge, middling: r.basis.endAge, good: r.basis.endAge };
    r.guaranteed = { monthlyAfterTax: 0 };
    r.phases = [];
    r.assumed = r.assumed.filter((a) => ['plan-to', 'todays-prices', 'tax-rules'].includes(a.id));
    r.warnings = [];
    r.sentences = { madeOf: [], nothing: sentence('c.nothing', ['With no pot and no pension income there is nothing to work out here. If your money is in ISAs or cash, put it under "Add more detail".'], r) };
    return true;
  }
};

const { inputsKey, from: keyFrom } = await keyFunction();
const patched = [];

// =====================================================================================================================
// Questions A and B (step 4 brief 4.13): `--question a` and `--question b`, from the real answerA and answerB.
//
// Every state's answer is worked out by the answer function for what is typed: nothing is hand-made. Each state that
// is named for a kind of answer (a yes, a no, "show me ages", stopping before the pension opens, on course, out of
// reach, already there …) has inputs that give that kind, and `expectKind` stops the script if they no longer do —
// then pick new inputs, never patch the result.
// =====================================================================================================================

const A1 = { 'you.age': '50', 'you.pot': '250,000', 'you.payIn.total': '600', savings: '40,000', 'stop.age': '60', 'spend.amount': '1,900' };
const B1 = { 'you.age': '50', 'you.pot': '120,000', 'you.payIn.kind': 'split', 'you.payIn.own': '450', 'you.payIn.employer': '250', 'stop.age': '60', 'spend.amount': '2,000' };
/** B2's household (tests/v7/fixtures/b/B2-coast.json): on course for 60. */
const B2 = { 'you.age': '48', 'you.pot': '350,000', 'you.payIn.total': '1,400', savings: '20,000', 'stop.age': '60', 'spend.amount': '2,000' };
/** B4's household (fixtures/b/B4-young.json): stops at 55, before the pension opens. */
const B4 = { 'you.age': '35', 'you.pot': '40,000', 'you.payIn.total': '400', savingsIn: '300', savingRisk: 'adventurous', 'stop.age': '55', 'spend.amount': '2,000' };

/** The kind each named state must be, read off the real result. */
const KIND = {
  a: {
    yes: (r) => r.status === 'ok' && r.headline.kind === 'named' && r.headline.verdict === 'yes',
    close: (r) => r.status === 'ok' && r.headline.kind === 'named' && r.headline.verdict === 'close',
    no: (r) => r.status === 'ok' && r.headline.kind === 'named' && r.headline.verdict === 'no',
    earliest: (r) => r.status === 'ok' && r.headline.kind === 'earliest',
    noneWorked: (r) => r.status === 'ok' && r.headline.kind === 'noneWorked',
    before57: (r) => r.status === 'ok' && r.shown.phases.some((ph) => ph.pensionOpen === false),
    partTime: (r) => r.status === 'ok' && r.shown.phases.some((ph) => ph.fromWork > 0),
    couple: (r) => r.status === 'ok' && r.inputs.household === 'couple',
    stopNow: (r) => r.status === 'ok' && r.stop.age === r.inputs.you.age,
    all: (r) => r.status === 'ok' && r.basis.detail === 'all'
  },
  b: {
    short: (r) => r.status === 'ok' && !r.onCourse,
    onCourse: (r) => r.status === 'ok' && r.onCourse && !r.already,
    before57: (r) => r.status === 'ok' && r.outside && r.outside.amount > 0,
    outOfReach: (r) => r.status === 'out-of-reach',
    have: (r) => r.status === 'ok' && r.already,
    couple: (r) => r.status === 'ok' && r.inputs.household === 'couple',
    grid: (r) => r.status === 'ok' && r.basis.detail === 'grid' && r.grid
  }
};

function saverState(q, step, values, extra = {}) {
  const s = initialState({ today: TODAY, build: 'test' });
  s.route = { screen: 'step', q, step, planId: null, focus: extra.focus || null };
  for (const x of ['a', 'b']) { s.draft[x] = emptySaverDraft(); s.answers[x] = emptySaverAnswer(); }
  s.draft[q].values = { ...values };
  Object.assign(s.draft[q], extra.draft || {});
  if (extra.open) s.ui.open = extra.open;
  return s;
}

function buildSaverStates(q, { today, futures, inputsKey: keyOf }) {
  const schema = q === 'a' ? SCHEMA_A : SCHEMA_B;
  const answer = q === 'a' ? answerA : answerB;
  const made = [];
  const keyFor = (s) => {
    const parsed = parseDraft(schema, s.draft[q].values, s.env);
    if (!parsed.ok) throw new Error(`the draft does not parse: ${JSON.stringify(parsed.errors)}`);
    return { parsed, key: keyOf(parsed.inputs, s.env) };
  };
  /** A state with an answer worked out for what is typed; `kind` names what the answer must be (KIND). */
  function answered(name, step, values, { status = 'final', detail, kind = null, open = [], n = futures } = {}) {
    const s = saverState(q, step, values, { draft: { asked: true }, open });
    const { parsed, key } = keyFor(s);
    const result = answer(parsed.inputs, { today, futures: n, seed: 0, trace: false, detail });
    if (kind && !KIND[q][kind](result)) throw new Error(`${q}/${name}: the inputs no longer give a "${kind}" answer — choose new inputs`);
    s.answers[q] = { ...emptySaverAnswer(), status, inputsKey: key, result, detail: result.basis.detail };
    return s;
  }
  const states = {};
  if (q === 'a') {
    const D = 'chart';
    states['numbers-blank'] = saverState('a', 'numbers', {});
    {
      const values = { household: 'single', 'you.pot': '250,000', 'you.age': '58', 'you.statePension.kind': 'full', 'you.finalSalary.has': false, 'stop.kind': 'age' };
      states['numbers-carried-from-c'] = saverState('a', 'numbers', values, { focus: 'stop.age', draft: { touched: Object.keys(values), carriedFrom: 'c' } });
    }
    states['numbers-part-time-open'] = saverState('a', 'numbers', { ...A1, 'partTime.has': true, 'partTime.yearly': '12,000', 'partTime.years': '3' });
    states['numbers-couple-open'] = saverState('a', 'numbers', { ...A1, household: 'couple', 'partner.age': '48', 'partner.pot': '120,000', 'partner.payIn.total': '300' });
    states['numbers-more-open'] = saverState('a', 'numbers', A1, { open: ['more'] });
    states['answer-nothing-entered'] = saverState('a', 'answer', {});
    {
      const s = answered('answer-working', 'answer', A1, { detail: D });
      s.answers.a = { ...s.answers.a, status: 'working', result: null, detail: null, progress: { done: 40, total: 100 } };
      states['answer-working'] = s;
    }
    states['answer-first'] = answered('answer-first', 'answer', A1, { status: 'first', detail: D, n: 100 });
    states['answer-A1'] = answered('answer-A1', 'answer', A1, { detail: D, kind: 'close' });
    states['answer-yes'] = answered('answer-yes', 'answer', { ...A1, 'spend.amount': '1,600' }, { detail: D, kind: 'yes' });
    states['answer-no'] = answered('answer-no', 'answer', { ...A1, 'spend.amount': '2,600' }, { detail: D, kind: 'no' });
    const ages = { ...A1, 'stop.kind': 'ages' };
    delete ages['stop.age'];
    states['answer-ages'] = answered('answer-ages', 'answer', ages, { detail: D, kind: 'earliest' });
    states['answer-ages-none'] = answered('answer-ages-none', 'answer', { ...ages, 'spend.amount': '4,000' }, { detail: D, kind: 'noneWorked' });
    states['answer-A4'] = answered('answer-A4', 'answer', { 'you.age': '50', 'you.pot': '310,000', 'you.payIn.total': '1,500', savings: '95,000', 'stop.age': '55', 'spend.amount': '2,200' },
      { detail: D, kind: 'before57', open: ['madeOf'] });
    states['answer-A3-part-time'] = answered('answer-A3-part-time', 'answer', { ...A1, 'partTime.has': true, 'partTime.yearly': '12,000', 'partTime.years': '3' },
      { detail: D, kind: 'partTime' });
    states['answer-A2-couple'] = answered('answer-A2-couple', 'answer', { household: 'couple', 'you.age': '55', 'you.pot': '420,000', 'you.payIn.total': '600', savings: '40,000',
      'partner.age': '53', 'partner.pot': '180,000', 'partner.payIn.total': '300', 'stop.age': '56', 'spend.amount': '3,592' }, { detail: D, kind: 'couple' });
    states['answer-stop-now'] = answered('answer-stop-now', 'answer', { 'you.age': '60', 'you.pot': '480,000', savings: '40,000', 'stop.age': '60', 'spend.amount': '2,000' },
      { detail: D, kind: 'stopNow' });
    {
      // The stop age has just been moved: the old answer stays, greyed, while the new one is worked out.
      const s = answered('answer-updating', 'answer', A1, { detail: D });
      s.draft.a.values['stop.age'] = '61';
      const { key } = keyFor(s);
      s.answers.a = { ...s.answers.a, status: 'working', inputsKey: key, progress: { done: 10, total: 100 } };
      states['answer-updating'] = s;
    }
    {
      // Step 3 opened on a final answer at the chart's detail: one more pass for every age is under way.
      const s = answered('answer-partial', 'ages', A1, { detail: D });
      s.answers.a = { ...s.answers.a, extending: true };
      states['answer-partial'] = s;
    }
    {
      const s = answered('answer-failed', 'answer', A1, { detail: D });
      s.answers.a = { ...s.answers.a, status: 'failed', result: null, detail: null };
      states['answer-failed'] = s;
    }
    states['answer-retired'] = saverState('a', 'answer', { 'you.age': '68', 'you.pot': '200,000', 'stop.age': '68', 'spend.amount': '1,500' }, { draft: { carriedFrom: 'c' } });
    states['ages-A1'] = answered('ages-A1', 'ages', A1, { detail: 'all', kind: 'all' });
    states['not-built-keep'] = saverState('a', 'keep', A1);
  } else {
    const D = 'answer';
    states['numbers-blank'] = saverState('b', 'numbers', {});
    states['numbers-split-open'] = saverState('b', 'numbers', B1);
    states['numbers-level'] = saverState('b', 'numbers', { ...B1, 'spend.kind': 'level', 'spend.level': 'moderate' });
    states['answer-nothing-entered'] = saverState('b', 'answer', {});
    {
      const s = answered('answer-working', 'answer', B1, { detail: D });
      s.answers.b = { ...s.answers.b, status: 'working', result: null, detail: null, progress: { done: 40, total: 100 } };
      states['answer-working'] = s;
    }
    states['answer-first'] = answered('answer-first', 'answer', B1, { status: 'first', detail: D, n: 100 });
    states['answer-B1'] = answered('answer-B1', 'answer', B1, { detail: D, kind: 'short' });
    states['answer-B2-on-course'] = answered('answer-B2-on-course', 'answer', B2, { detail: D, kind: 'onCourse' });
    states['answer-B4-before-57'] = answered('answer-B4-before-57', 'answer', B4, { detail: D, kind: 'before57', open: ['more'] });
    states['answer-out-of-reach'] = answered('answer-out-of-reach', 'answer', { ...B1, 'stop.age': '52', 'spend.amount': '5,000' }, { detail: D, kind: 'outOfReach' });
    states['answer-have'] = answered('answer-have', 'answer', { ...B1, 'you.pot': '900,000' }, { detail: D, kind: 'have' });
    states['answer-B5-couple'] = answered('answer-B5-couple', 'answer', { 'you.age': '50', 'you.pot': '250,000', 'you.payIn.total': '700', household: 'couple', 'partner.age': '48',
      'partner.pot': '150,000', 'partner.payIn.total': '300', 'stop.age': '60', 'spend.amount': '3,200' }, { detail: D, kind: 'couple' });
    {
      const s = answered('answer-failed', 'answer', B1, { detail: D });
      s.answers.b = { ...s.answers.b, status: 'failed', result: null, detail: null };
      states['answer-failed'] = s;
    }
    states['answer-retired'] = saverState('b', 'answer', { 'you.age': '68', 'you.pot': '200,000', 'you.payIn.total': '0', 'stop.age': '68', 'spend.amount': '1,500' },
      { draft: { carriedFrom: 'c' } });
    states['choices-B1'] = answered('choices-B1', 'choices', B1, { detail: 'grid', kind: 'grid' });
    states['choices-on-course'] = answered('choices-on-course', 'choices', B2, { detail: 'grid', kind: 'onCourse' });
  }
  return { states, patched: made, answer: `src/answers/${q}/answer.js` };
}

if (QUESTION !== 'c') {
  const { states, patched: made, answer } = buildSaverStates(QUESTION, { today: TODAY, futures: FUTURES, inputsKey });
  const dir = join(here, QUESTION);
  mkdirSync(dir, { recursive: true });
  for (const f of readdirSync(dir)) if (f.endsWith('.json')) rmSync(join(dir, f));
  for (const [name, state] of Object.entries(states)) {
    const text = JSON.stringify(state, null, 2) + '\n';
    if (/undefined/.test(text)) throw new Error(`${name}: the state does not survive JSON`);
    writeFileSync(join(dir, `${name}.json`), text);
  }
  writeFileSync(join(dir, '_made-with.json'), JSON.stringify({
    note: 'Written by tests/v7/states/build-states.mjs --question ' + QUESTION + '. Do not edit by hand.',
    today: TODAY, futures: FUTURES, inputsKeyFrom: keyFrom, answer, patched: made
  }, null, 2) + '\n');
  console.log(`${Object.keys(states).length} states written to tests/v7/states/${QUESTION}/ (${made.length} with a hand-made result: ${made.join(', ') || 'none'})`);
  process.exit(0);
}

function base(hash, values = {}, extra = {}) {
  const s = initialState({ today: TODAY, build: 'test' });
  s.route = parse(hash);
  s.draft.c.values = { ...values };
  Object.assign(s.draft.c, extra.draft || {});
  if (extra.open) s.ui.open = extra.open;
  return s;
}

/** A state on the answer step with an answer worked out for what is typed. */
function answered(name, values, { futures = FUTURES, status = 'final', patch = null, open = [] } = {}) {
  const s = base('#/c/answer', values, { draft: { asked: true }, open });
  const parsed = parseDraft(SCHEMA_C, s.draft.c.values, s.env);
  if (!parsed.ok) throw new Error(`${name}: the draft does not parse: ${JSON.stringify(parsed.errors)}`);
  const result = answerC(parsed.inputs, { today: TODAY, futures, seed: 0, trace: false });
  if (patch && PATCH[patch](result)) patched.push(name);
  s.answers.c = { status, inputsKey: inputsKey(parsed.inputs, s.env), result, before: null, progress: null, slow: false };
  return s;
}

const states = {};
states['front-door'] = base('#/');
states['numbers-blank'] = base('#/c/numbers');
states['numbers-half-typed-with-an-error'] = base('#/c/numbers', { 'you.pot': '250,00o', 'you.age': '' }, { draft: { touched: ['you.pot', 'you.age'] } });
states['numbers-couple-open'] = base('#/c/numbers', F2);
states['numbers-more-open'] = base('#/c/numbers', F1, { open: ['more'] });
states['answer-nothing-entered'] = base('#/c/answer');

{
  const s = answered('answer-working', F1);
  s.answers.c = { ...s.answers.c, status: 'working', result: null, progress: { done: 40, total: 100 } };
  states['answer-working'] = s;
}
states['answer-first'] = answered('answer-first', F1, { futures: 100, status: 'first' });
states['answer-F1'] = answered('answer-F1', F1);
states['answer-F2'] = answered('answer-F2', F2);
states['answer-F3'] = answered('answer-F3', F3, { patch: 'take' });
{
  // The pot has just been changed: the old answer stays on screen, greyed, while the new one is worked out.
  const s = answered('answer-updating', F1);
  const old = s.answers.c.result;
  s.draft.c.values['you.pot'] = '275,000';
  const parsed = parseDraft(SCHEMA_C, s.draft.c.values, s.env);
  s.answers.c = { status: 'working', inputsKey: inputsKey(parsed.inputs, s.env), result: old,
    before: { monthly: { careful: old.monthly.careful } }, progress: { done: 10, total: 100 }, slow: false };
  states['answer-updating'] = s;
}
states['answer-take'] = answered('answer-take', { ...F1, take: '1,500' }, { patch: 'take' });
// Still paying in, on C's first form: the form with "Yes" open, and the answer from 67 that says what it assumed.
states['numbers-paying-in'] = base('#/c/numbers', PAYING_IN);
states['answer-paying-in'] = answered('answer-paying-in', PAYING_IN);
// …and the same person who never touches "Start taking it": the form starts it at their State Pension age, 67, as they
// are still paying in (the reviewers' finding, 1 Oct 2026 — it used to stay on "Now", the pay-in left out)
{
  const { 'start.kind': kind, 'start.age': age, ...untouched } = PAYING_IN;
  void kind; void age;
  states['answer-paying-in-default'] = answered('answer-paying-in-default', untouched);
}
// From an age before the pension opens with a few thousand in savings: the years until it opens set the amount, said in
// words with both figures (the reviewers' finding, 1 Oct 2026: it was "About £180 a month")
states['answer-closed-years'] = answered('answer-closed-years', { 'you.pot': '300,000', 'you.age': '50', savings: '5,000', 'start.kind': 'age', 'start.age': '55' });
states['answer-small-pot'] = answered('answer-small-pot', { 'you.pot': '12,000', 'you.age': '58' }, { patch: 'small' });
states['answer-pensions-only'] = answered('answer-pensions-only', { 'you.pot': '0', 'you.age': '68' }, { patch: 'pensionsOnly' });
// the same with the State Pension still to come (58): the amounts are what it will pay, the phases say nothing until 67
states['answer-pensions-only-later'] = answered('answer-pensions-only-later', { 'you.pot': '0', 'you.age': '58' });
states['answer-nothing'] = answered('answer-nothing', { 'you.pot': '0', 'you.age': '68', 'you.statePension.kind': 'none' }, { patch: 'nothing' });
states['answer-assumed-open'] = answered('answer-assumed-open', F1, { open: ['madeOf', 'assumed', 'allAssumed'] });
{
  // the paying-in answer is worked on the lives (step 4 brief J8; fixture F4 is the same household at 40 futures)
  for (const name of ['answer-paying-in', 'answer-paying-in-default']) {
    const r = states[name].answers.c.result;
    if (!(r.status === 'ok' && r.saving && r.payIn && r.payIn.total === 800 && r.sentences.payIn && r.basis.yearsSaving === 12)) {
      throw new Error(`${name}: the inputs no longer give an answer on the lives with £800 a month going in from 67 — choose new inputs`);
    }
  }
  const cy = states['answer-closed-years'].answers.c.result;
  if (!(cy.status === 'ok' && cy.closedYears && cy.sentences.none && cy.sentences.none.id === 'c.none.closed')) {
    throw new Error('answer-closed-years: the inputs no longer give an answer the closed years set — choose new inputs');
  }
}
{
  const s = answered('answer-failed', F1);
  s.answers.c = { ...s.answers.c, status: 'failed', result: null };
  states['answer-failed'] = s;
}
// A question that is not in the preview yet (D; before step 4's joining up this was A, which is now built).
states['soon-d'] = base('#/soon/d');
states['not-built-ways'] = base('#/c/ways', F1);
states['not-found'] = base('#/plan/abc/c/answer');

const out = join(here, 'c');
mkdirSync(out, { recursive: true });
for (const f of readdirSync(out)) if (f.endsWith('.json')) rmSync(join(out, f));
for (const [name, state] of Object.entries(states)) {
  const text = JSON.stringify(state, null, 2) + '\n';
  if (/undefined/.test(text)) throw new Error(`${name}: the state does not survive JSON`);
  writeFileSync(join(out, `${name}.json`), text);
}
const probe = answerC({ household: 'single', you: { pot: 12000, age: 58 } }, { today: TODAY, futures: 10, seed: 0 });
writeFileSync(join(here, 'made-with.json'), JSON.stringify({
  note: 'Written by tests/v7/states/build-states.mjs. Do not edit by hand.',
  today: TODAY,
  futures: FUTURES,
  inputsKeyFrom: keyFrom,
  answer: probe.monthly && probe.monthly.careful === 1380 ? 'the STUB of package 1 (figures do not follow the inputs)' : 'src/answers/c/answer.js',
  patched
}, null, 2) + '\n');
console.log(`${Object.keys(states).length} states written to tests/v7/states/c/ (${patched.length} with a hand-made result: ${patched.join(', ') || 'none'})`);
