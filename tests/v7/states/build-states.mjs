/**
 * Makes the named states the render tests, the browser journeys and the pictures all draw:
 * tests/v7/states/<q>/<name>.json — each a whole V7 state (build brief 4.5; step 4 brief 4.11), with the answer inside
 * produced by the answer function and pinned.
 *
 *   npx -y node@20 tests/v7/states/build-states.mjs                  question C (futures: 1,000 — what the published page shows)
 *   npx -y node@20 tests/v7/states/build-states.mjs --question a     question A (states/a/), with src/answers/a/answer.js
 *   npx -y node@20 tests/v7/states/build-states.mjs --question b     question B
 *   npx -y node@20 tests/v7/states/build-states.mjs --question d     question D (states/d/), with src/answers/d/answer.js
 *   V7_STATES_FUTURES=40 npx -y node@20 tests/v7/states/build-states.mjs
 *   … --only numbers-apart,answer-apart      writes only the states named (the others, and made-with.json, are left as
 *                                            they are): a new state is added without touching the pinned ones
 *   … --out <dir>                            writes the whole set into <dir> instead (to compare a fresh run with the
 *                                            pinned states, file by file), and nothing in the repo
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
import { SCHEMA_D } from '../../../src/answers/d/schema.js';
import { answerD } from '../../../src/answers/d/answer.js';
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
if (!['a', 'b', 'c', 'd', 'plan'].includes(QUESTION)) throw new Error(`--question takes a, b, c, d or plan, not ${QUESTION}`);
const argOf = (name) => { const i = process.argv.indexOf(name); return i === -1 ? null : process.argv[i + 1]; };
const ONLY = argOf('--only') ? argOf('--only').split(',').map((x) => x.trim()).filter(Boolean) : null;
const OUT = argOf('--out');
if (ONLY && OUT) throw new Error('--only and --out do not go together');

/**
 * A state cut to the shape of the states already pinned in `dir` (--only): the same top-level keys and the same keys in
 * each question's draft. The pinned states were written before the state gained `budget`, `keep` and the drafts'
 * `spendHow` and `skipNoted` (all empty in a named state, and drawn the same without them); a state added to the set is
 * written in the set's shape, so the set stays one shape. Nothing else is cut.
 */
function inPinnedShape(state, dir) {
  const ref = readdirSync(dir).filter((f) => f.endsWith('.json') && !f.startsWith('_') && f !== 'made-with.json')
    .map((f) => JSON.parse(readFileSync(join(dir, f), 'utf8'))).find((x) => x && x.draft && x.route);
  if (!ref) return state;
  // the reference's keys in its order, then any slice the state has that the reference predates (the move's, since 6.43.0)
  const out = Object.fromEntries([...Object.keys(ref).filter((k) => k in state), ...Object.keys(state).filter((k) => !(k in ref))].map((k) => [k, state[k]]));
  out.draft = Object.fromEntries(Object.entries(state.draft).map(([q, d]) => [q, ref.draft[q]
    ? Object.fromEntries(Object.keys(ref.draft[q]).filter((k) => k in d).map((k) => [k, d[k]])) : d]));
  return out;
}

/**
 * Writes the states into `dir` (states/<q>/, or --out): every one, after emptying it — or, with --only, just those named,
 * in the shape of the states already there, leaving the rest. → whether the whole set was written (made-with is then
 * written too).
 */
function writeStates(states, dir) {
  const target = OUT ? join(OUT, QUESTION) : dir;
  mkdirSync(target, { recursive: true });
  const names = ONLY || Object.keys(states);
  for (const n of names) if (!states[n]) throw new Error(`--only: there is no state called ${n} in question ${QUESTION}`);
  if (!ONLY) for (const f of readdirSync(target)) if (f.endsWith('.json')) rmSync(join(target, f));
  for (const name of names) {
    const text = JSON.stringify(ONLY ? inPinnedShape(states[name], target) : states[name], null, 2) + '\n';
    if (/undefined/.test(text)) throw new Error(`${name}: the state does not survive JSON`);
    writeFileSync(join(target, `${name}.json`), text);
  }
  return { target, whole: !ONLY, names };
}

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
    r.assumed = r.assumed.filter((a) => !['all-pension', 'quarter-tax-free', 'risk', 'steady', 'futures', 'charges'].includes(a.id));
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
    // "Save this as a plan?" opened before there is an answer (the keep step is built: save-as-plan.md).
    states['keep-no-answer'] = saverState('a', 'keep', A1);
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

// =====================================================================================================================
// Question D (research/v7/answer-D.md; road-to-7.md step 7): `--question d`, from the real answerD. As A and B: every
// state's answer is worked out for what is typed; `expectKind` stops the script if the inputs no longer give the kind.
// The households are made up (Alex and Sam): nobody's own.
// =====================================================================================================================

/** The design's worked example (answer-D.md 1): 68, £300,000 left, £40,000 of savings, the full State Pension, £2,100 a month. */
const D1 = { 'you.age': '68', 'you.pot': '300,000', 'you.taxFreeTaken': 'no', savings: '40,000', 'spend.amount': '2,100' };
/** A couple of 72 and 70, both stopped, one final-salary pension, the tax-free part had (answer-D.md 11.4 D2). */
const D2 = { household: 'couple', 'you.age': '72', 'you.pot': '250,000', 'you.taxFreeTaken': 'yes', 'you.finalSalary.has': true, 'you.finalSalary.yearly': '8,000', 'you.finalSalary.fromAge': '65',
  'partner.age': '70', 'partner.pot': '150,000', 'partner.taxFreeTaken': 'yes', savings: '30,000', 'spend.amount': '2,800' };
/** 62, stopped, under State Pension age, an invested ISA larger than the pension (D3). */
const D3 = { 'you.age': '62', 'you.pot': '120,000', 'you.taxFreeTaken': 'no', savings: '200,000', isaGrowth: 'invested', 'spend.amount': '2,000' };
/** 53, stopped, the pension closed until 57, savings paying meanwhile (D5). */
const D5 = { 'you.age': '53', 'you.pot': '250,000', 'you.taxFreeTaken': 'no', savings: '60,000', 'spend.amount': '1,800' };
/** 66, thinking about work: £15,000 a year for 3 years (D7). */
const D7 = { 'you.age': '66', 'you.pot': '220,000', 'you.taxFreeTaken': 'some', savings: '10,000', 'spend.amount': '2,200', 'work.has': true, 'work.yearly': '15,000', 'work.years': '3' };

const KIND_D = {
  yes: (r) => r.status === 'ok' && r.verdict === 'yes',
  close: (r) => r.status === 'ok' && r.verdict === 'close',
  no: (r) => r.status === 'ok' && r.verdict === 'no',
  couple: (r) => r.status === 'ok' && r.inputs.household === 'couple',
  invested: (r) => r.status === 'ok' && r.inputs.isaGrowth === 'invested',
  closed: (r) => r.status === 'ok' && r.phases.some((ph) => ph.pensionOpen === false),
  work: (r) => r.status === 'ok' && !!r.work && Array.isArray(r.work.byYears) && r.work.byYears.length > 0,
  fall: (r) => r.status === 'ok' && !!r.fall,
  guaranteedOnly: (r) => r.status === 'guaranteed-only'
};

function dState(step, values, extra = {}) {
  const s = initialState({ today: TODAY, build: 'test' });
  s.route = { screen: 'step', q: 'd', step, planId: null, focus: extra.focus || null };
  s.draft.d.values = { ...values };
  Object.assign(s.draft.d, extra.draft || {});
  if (extra.open) s.ui.open = extra.open;
  return s;
}

function buildDStates({ today, futures, inputsKey: keyOf }) {
  const keyFor = (s) => {
    const parsed = parseDraft(SCHEMA_D, s.draft.d.values, s.env);
    if (!parsed.ok) throw new Error(`the draft does not parse: ${JSON.stringify(parsed.errors)}`);
    return { parsed, key: keyOf(parsed.inputs, s.env) };
  };
  function answered(name, step, values, { status = 'final', kind = null, open = [], n = futures } = {}) {
    const s = dState(step, values, { draft: { asked: true }, open });
    const { parsed, key } = keyFor(s);
    const result = answerD(parsed.inputs, { today, futures: n, seed: 0, trace: false });
    if (kind && !KIND_D[kind](result)) throw new Error(`d/${name}: the inputs no longer give a "${kind}" answer — choose new inputs`);
    s.answers.d = { ...s.answers.d, status, inputsKey: key, result };
    return s;
  }
  const states = {};
  states['numbers-blank'] = dState('numbers', {});
  states['numbers-couple-open'] = dState('numbers', D2);
  states['numbers-more-open'] = dState('numbers', D1, { open: ['more'] });
  // "Not yet" under "Have you stopped work?": the box's own sentence points at "When can I afford to stop work?"
  states['numbers-still-working'] = dState('numbers', { ...D1, stopped: 'notYet' }, { draft: { touched: ['stopped'] } });
  // the way in (answer-D.md 3.10): a plan in this window — its own test is offered first
  {
    const s = dState('numbers', {});
    s.session = { kind: 'nobody', email: null, signingOut: false };
    s.plans = { status: 'read', source: 'window', readAt: '14:03', usedUp: false,
      list: [{ plan: { id: 'guest-wayin001', planDetails: { name: 'Kept from a first answer' }, decisionTool: { settings: { locked: false } } }, newer: false, failed: false }] };
    states['numbers-way-in'] = s;
  }
  states['answer-nothing-entered'] = dState('answer', {});
  {
    const s = answered('answer-working', 'answer', D1);
    s.answers.d = { ...s.answers.d, status: 'working', result: null, progress: { done: 40, total: 100 } };
    states['answer-working'] = s;
  }
  states['answer-first'] = answered('answer-first', 'answer', D1, { status: 'first', n: 100 });
  states['answer-D1'] = answered('answer-D1', 'answer', D1, { kind: 'close' });
  states['answer-yes'] = answered('answer-yes', 'answer', { ...D1, 'spend.amount': '1,800' }, { kind: 'yes' });
  states['answer-no'] = answered('answer-no', 'answer', { ...D1, 'spend.amount': '2,600' }, { kind: 'no' });
  states['answer-D2-couple'] = answered('answer-D2-couple', 'answer', D2, { kind: 'couple' });
  states['answer-D3-invested'] = answered('answer-D3-invested', 'answer', D3, { kind: 'invested', open: ['madeOf'] });
  states['answer-D5-closed'] = answered('answer-D5-closed', 'answer', D5, { kind: 'closed' });
  states['answer-D7-work'] = answered('answer-D7-work', 'answer', D7, { kind: 'work' });
  states['answer-fall'] = answered('answer-fall', 'answer', { ...D1, 'fall.has': true }, { kind: 'fall' });
  states['answer-pensions-only'] = answered('answer-pensions-only', 'answer', { 'you.age': '68', 'you.pot': '0', 'you.taxFreeTaken': 'no', 'spend.amount': '900' }, { kind: 'guaranteedOnly' });
  states['answer-assumed-open'] = answered('answer-assumed-open', 'answer', D1, { open: ['madeOf', 'assumed', 'allAssumed'] });
  {
    // What you take has just been changed: the old answer stays, greyed, while the new one is worked out.
    const s = answered('answer-updating', 'answer', D1);
    s.draft.d.values['spend.amount'] = '2,300';
    const { key } = keyFor(s);
    s.answers.d = { ...s.answers.d, status: 'working', inputsKey: key, progress: { done: 10, total: 100 } };
    states['answer-updating'] = s;
  }
  {
    const s = answered('answer-failed', 'answer', D1);
    s.answers.d = { ...s.answers.d, status: 'failed', result: null };
    states['answer-failed'] = s;
  }
  // "Keep this as a plan?" before there is an answer, and with one
  states['keep-no-answer'] = dState('keep', D1);
  states['keep-D1'] = answered('keep-D1', 'keep', D1, { kind: 'close' });
  return { states, patched: [], answer: 'src/answers/d/answer.js' };
}

/**
 * The states of "How the money is taken" on a saved plan (research/v7/way-and-mix.md 2, 7): tests/v7/states/plan/way-*.json —
 * each a whole V7 state on #/plan/<id>/way with the plans in page memory (Alex's Pots & Valves draft, corpus 02; Sam's locked
 * gilt ladder, corpus 03; Alex's first plan, corpus 01, where three ways cannot be bought), the nine-way run held
 * (waysRun.js runWays at the engine's own 1,000 futures) and the cards as the plan source reads them. Nothing hand-made.
 *   npx -y node@20 tests/v7/states/build-states.mjs --question plan
 */
async function buildPlanStates({ today }) {
  const { reduce } = await import('../../../src/v7/state/reduce.js');
  const { A } = await import('../../../src/v7/state/actions.js');
  const { viewFor } = await import('../../../src/v7/effects/planSource.js');
  const { runWays, runWay } = await import('../../../src/answers/plan/waysRun.js');
  const { runKeyOf } = await import('../../../src/answers/plan/way.js');
  const { corpus, entryOf } = await import('../plan/_plans.js');
  const C = corpus();
  const plant = (raw, id, name, { active = false } = {}) => { const p = JSON.parse(JSON.stringify(raw)); p.id = id; p.planDetails = { ...(p.planDetails || {}), name }; p.isActive = active; delete p.household; return p; };
  const alex = plant(C['02-pnv-draft'], 'AlexWay01', 'Alex’s plan', { active: true });
  const sam = plant(C['03-gilt-ladder-runup'], 'SamLocked02', 'Sam’s plan');
  const fresh = plant(C['01-fresh-default'], 'AlexFresh03', 'Alex’s first plan');
  const entries = [alex, sam, fresh].map((p) => entryOf(p, today));
  const planOf = (id) => entries.find((e) => e.plan.id === id).plan;
  const runs = new Map();
  const runOf = (id) => { if (!runs.has(id)) runs.set(id, runWays(planOf(id), { today })); return runs.get(id); };
  /** A state on the way step of a plan, the plans read (an account), then the actions given; the reading refreshed as the plan source does. */
  const stateOn = (id, actions = [], { open = [], newer = false } = {}) => {
    let s = initialState({ today, build: 'test' });
    s = reduce(s, { type: A.ROUTE_SET, route: parse('#/plan/' + id + '/way') });
    s = reduce(s, { type: A.SESSION_SET, session: { kind: 'in', email: 'someone@example.com' } });
    s = reduce(s, { type: A.PLANS_SET, list: entries.map((e) => (e.plan.id === id && newer ? { ...e, newer: true } : e)), source: 'account', readAt: '14:03' });
    s = reduce(s, { type: A.PLANS_VIEW, view: viewFor(s) });
    const key = runKeyOf(planOf(id));
    for (const a of actions) { s = reduce(s, typeof a === 'function' ? a(key, s) : a); s = reduce(s, { type: A.PLANS_VIEW, view: viewFor(s) }); }
    for (const x of open) s = reduce(s, { type: A.UI_TOGGLE, id: x });
    s = reduce(s, { type: A.PLANS_VIEW, view: viewFor(s) });
    return s;
  };
  const ran = (id, ms = 4600) => [(key) => ({ type: A.WAYS_WORKING, key }), (key) => ({ type: A.WAYS_DONE, key, result: runOf(id), ms })];
  const tried = (planId, id, values, ms = 180) => [(key) => ({ type: A.WAY_TRY, id, values }), (key) => ({ type: A.WAY_TRIED, key, id, values, result: runWay(planOf(planId), { today, id, dials: values }), ms })];
  const states = {};
  states['way-working'] = stateOn('AlexWay01', [(key) => ({ type: A.WAYS_WORKING, key }), (key) => ({ type: A.WAYS_PROGRESS, key, done: 3, total: 9 })]);
  states['way-slow'] = stateOn('AlexWay01', [(key) => ({ type: A.WAYS_WORKING, key }), (key) => ({ type: A.WAYS_SLOW, key })]);
  states['way-first'] = stateOn('AlexWay01', ran('AlexWay01'));
  states['way-open-ladder'] = stateOn('AlexWay01', [...ran('AlexWay01'), { type: A.WAY_OPEN, id: 'full-il-gilt' }]);
  states['way-open-flex'] = stateOn('AlexWay01', [...ran('AlexWay01'), { type: A.WAY_OPEN, id: 'floor-and-flex' }]);
  states['way-trying'] = stateOn('AlexWay01', [...ran('AlexWay01'), { type: A.WAY_OPEN, id: 'floor-to-age' }, { type: A.WAY_DIAL, id: 'floor-to-age', key: 'floorToAge', value: '82' }, { type: A.WAY_TRY, id: 'floor-to-age', values: { floorToAge: 82 } }]);
  states['way-tried'] = stateOn('AlexWay01', [...ran('AlexWay01'), { type: A.WAY_OPEN, id: 'floor-to-age' }, { type: A.WAY_DIAL, id: 'floor-to-age', key: 'floorToAge', value: '82' }, ...tried('AlexWay01', 'floor-to-age', { floorToAge: 82 })]);
  states['way-dial-problem'] = stateOn('AlexWay01', [...ran('AlexWay01'), { type: A.WAY_OPEN, id: 'floor-to-age' }, { type: A.WAY_DIAL, id: 'floor-to-age', key: 'floorToAge', value: 'ninety' }]);
  states['way-cuts-tried'] = stateOn('AlexWay01', [...ran('AlexWay01'), { type: A.WAY_DIAL, id: 'pots-and-valves', key: 'cutPct', value: '30' }, ...tried('AlexWay01', 'pots-and-valves', { protectionOn: 'yes', cutPct: 30, consecutiveLimit: 3 })]);
  states['way-confirm'] = stateOn('AlexWay01', [...ran('AlexWay01'), { type: A.WAY_OPEN, id: 'floor-to-age' }, { type: A.WAY_DIAL, id: 'floor-to-age', key: 'floorToAge', value: '82' }, ...tried('AlexWay01', 'floor-to-age', { floorToAge: 82 })], { open: ['wayConfirm'] });
  states['way-more'] = stateOn('AlexWay01', [...ran('AlexWay01'), { type: A.WAY_RANK, by: 'left' }], { open: ['waysMore'] });
  states['way-saved'] = stateOn('AlexWay01', [...ran('AlexWay01'), { type: A.PLAN_SAVED, planId: 'AlexWay01', previous: { 'stressTool.settings.strategyId': 'pots-and-valves', lastModified: planOf('AlexWay01').lastModified }, line: { id: 'way', slots: { way: 'floor-to-age' } }, op: 'way' }]);
  states['way-failed'] = stateOn('AlexWay01', [(key) => ({ type: A.WAYS_WORKING, key }), (key) => ({ type: A.WAYS_FAILED, key })]);
  states['way-no-worker'] = stateOn('AlexWay01', [(key) => ({ type: A.WAYS_WORKING, key }), (key) => ({ type: A.WAYS_FAILED, key, reason: 'noWorker' })]);
  states['way-try-failed'] = stateOn('AlexWay01', [...ran('AlexWay01'), { type: A.WAY_OPEN, id: 'floor-to-age' }, { type: A.WAY_DIAL, id: 'floor-to-age', key: 'floorToAge', value: '82' }, { type: A.WAY_TRY, id: 'floor-to-age', values: { floorToAge: 82 } }, (key) => ({ type: A.WAY_TRY_FAILED, key, id: 'floor-to-age', values: { floorToAge: 82 } })]);
  states['way-locked'] = stateOn('SamLocked02', ran('SamLocked02'));
  states['way-locked-tried'] = stateOn('SamLocked02', [...ran('SamLocked02'), { type: A.WAY_OPEN, id: 'floor-to-age' }, { type: A.WAY_DIAL, id: 'floor-to-age', key: 'floorToAge', value: '82' }, ...tried('SamLocked02', 'floor-to-age', { floorToAge: 82 })]);
  states['way-unaffordable'] = stateOn('AlexFresh03', [...ran('AlexFresh03'), { type: A.WAY_OPEN, id: 'full-il-gilt' }], { open: ['waysMore'] });
  states['way-shown-as-saved'] = stateOn('AlexWay01', [], { newer: true });

  /**
   * "The mix" (research/v7/way-and-mix.md 3, 7) and Try a change on a plan (4): tests/v7/states/plan/mix-*.json and
   * lasts-try-*.json — each a state on #/plan/<id>/mix or …/lasts holding ONE plan (Alex's Pots & Valves draft, corpus 02; Sam's
   * locked Buckets plan, corpus 04; Alex's rotation plan, corpus 07, a bought way), what was typed, and the runs held: the
   * plan's own test (lastsRun.js runLasts), the slice's and the tent's try (mixRun.js runMixTry), the eight cells
   * (runMixCompare), a change tried (runTry) — all at the engine's own 1,000 futures. Nothing hand-made.
   */
  const { runLasts, runTry } = await import('../../../src/answers/plan/lastsRun.js');
  const { runMixTry, runMixCompare } = await import('../../../src/answers/plan/mixRun.js');
  const buckets = plant(C['04-buckets-running'], 'SamBuckets04', 'Sam’s plan');
  const rotation = plant(C['07-pre-6.13-flat-params'], 'AlexRotation05', 'Alex’s rotation plan');
  const oneOf = (id) => [alex, sam, fresh, buckets, rotation].map((p) => entryOf(p, today)).find((e) => e.plan.id === id);
  const lastsRuns = new Map();
  const lastsOf = (id) => { if (!lastsRuns.has(id)) lastsRuns.set(id, runLasts(oneOf(id).plan, { today })); return lastsRuns.get(id); };
  /** A state on a step of ONE plan (the plans read as an account), what was typed laid over it, then the actions; the reading refreshed as the plan source does. */
  const stateOne = (id, step, actions = [], { open = [], newer = false, typed = {}, asked = false } = {}) => {
    const entry = oneOf(id);
    let s = initialState({ today, build: 'test' });
    s = reduce(s, { type: A.ROUTE_SET, route: parse('#/plan/' + id + '/' + step) });
    s = reduce(s, { type: A.SESSION_SET, session: { kind: 'in', email: 'someone@example.com' } });
    s = reduce(s, { type: A.PLANS_SET, list: [newer ? { ...entry, newer: true } : entry], source: 'account', readAt: '14:03' });
    for (const [path, value] of Object.entries(typed)) s = reduce(s, { type: A.PLAN_EDIT, planId: id, path, value });
    if (asked) { s = reduce(s, { type: A.PLAN_SAVE, planId: id }); s = { ...s, ui: { ...s.ui, saving: null } }; }
    s = reduce(s, { type: A.PLANS_VIEW, view: viewFor(s) });
    const key = runKeyOf(entry.plan);
    for (const a of actions) { s = reduce(s, typeof a === 'function' ? a(key, s) : a); s = reduce(s, { type: A.PLANS_VIEW, view: viewFor(s) }); }
    for (const x of open) s = reduce(s, { type: A.UI_TOGGLE, id: x });
    s = reduce(s, { type: A.PLANS_VIEW, view: viewFor(s) });
    return s;
  };
  const held = (id) => [(key) => ({ type: A.LASTS_WORKING, key }), (key) => ({ type: A.LASTS_DONE, key, result: lastsOf(id) })];
  const baseOf = (id) => { const a = lastsOf(id).a; return a ? { share: a.share, chancePct: a.chancePct, typicalLeft: a.typicalLeft, badCaseLeft: a.badCaseLeft } : null; };
  const mixTried = (id, kind, { withBase = true, ms = 480 } = {}) => [(key) => ({ type: A.MIX_TRY, key, kind }), (key) => ({ type: A.MIX_TRIED, key, kind, result: runMixTry(oneOf(id).plan, { today, kind, base: withBase ? baseOf(id) : null }), ms })];
  const compared = (id, ms = 3900) => [(key) => ({ type: A.MIX_COMPARE, key }), (key) => ({ type: A.MIX_COMPARED, key, result: runMixCompare(oneOf(id).plan, { today }), ms })];
  const PASTE = 'Investment,Units,Value\nVanguard FTSE All-World UCITS ETF,500,£52,600.00\nA fund of my own,10,£1,000\nTotal,,£53,600';
  states['mix-first'] = stateOne('AlexWay01', 'mix');
  states['mix-level'] = stateOne('AlexWay01', 'mix', [], { typed: { held: 'level', level: 'balanced', sleeve: 'yes' } });
  states['mix-split-problem'] = stateOne('AlexWay01', 'mix', [], { typed: { shares: '70' }, asked: true });
  states['mix-funds'] = stateOne('AlexWay01', 'mix', [], { typed: { held: 'funds', 'funds.ids': 'n1,n2', 'funds.n1.ticker': 'VWRP', 'funds.n1.value': '300,000', 'funds.n2.ticker': 'ZZZZ', 'funds.n2.value': '50,000', 'funds.n2.wrapper': 'ISA' }, asked: true });
  states['mix-funds-ok'] = stateOne('AlexWay01', 'mix', [], { typed: { held: 'funds', 'funds.ids': 'n1,n2', 'funds.n1.ticker': 'VWRP', 'funds.n1.value': '300,000', 'funds.n2.ticker': 'ZZZZ', 'funds.n2.value': '50,000', 'funds.n2.wrapper': 'ISA', 'funds.n2.category': 'gold', search: 'vang' } });
  states['mix-paste'] = stateOne('AlexWay01', 'mix', [], { typed: { held: 'funds', 'paste.text': PASTE, 'paste.2.what': 'bonds' }, open: ['mixPaste'] });
  states['mix-example'] = stateOne('AlexWay01', 'mix', [], { open: ['mixExample'] });
  states['mix-sleeve-tried'] = stateOne('AlexWay01', 'mix', [...held('AlexWay01'), ...mixTried('AlexWay01', 'sleeve')]);
  states['mix-tent-tried'] = stateOne('AlexWay01', 'mix', mixTried('AlexWay01', 'tent', { withBase: false, ms: 960 }));
  states['mix-try-working'] = stateOne('AlexWay01', 'mix', [(key) => ({ type: A.MIX_TRY, key, kind: 'tent' })]);
  states['mix-try-failed'] = stateOne('AlexWay01', 'mix', [(key) => ({ type: A.MIX_TRY, key, kind: 'sleeve' }), (key) => ({ type: A.MIX_TRY_FAILED, key, kind: 'sleeve' })]);
  states['mix-compare-working'] = stateOne('AlexWay01', 'mix', [(key) => ({ type: A.MIX_COMPARE, key }), (key) => ({ type: A.MIX_COMPARE_PROGRESS, key, done: 3, total: 8 })]);
  states['mix-compared'] = stateOne('AlexWay01', 'mix', compared('AlexWay01'));
  states['mix-pick'] = stateOne('AlexWay01', 'mix', [...compared('AlexWay01'), { type: A.MIX_PICK, cell: { key: 'balanced', tent: true } }]);
  states['mix-compare-failed'] = stateOne('AlexWay01', 'mix', [(key) => ({ type: A.MIX_COMPARE, key }), (key) => ({ type: A.MIX_COMPARE_FAILED, key, reason: 'noWorker' })]);
  states['mix-locked'] = stateOne('SamBuckets04', 'mix', [...held('SamBuckets04'), ...compared('SamBuckets04'), ...mixTried('SamBuckets04', 'sleeve')]);
  states['mix-bought'] = stateOne('AlexRotation05', 'mix');
  states['mix-shown-as-saved'] = stateOne('AlexWay01', 'mix', [], { newer: true });
  // Try a change on "Does it last?" (4): the plan's own test held, then the boxes opened, tried, kept
  const TRIED_TYPED = { 'try.way': 'floor-to-age', 'try.years': '30', 'try.isaPolicy': 'hold' };
  const runBoxes = (s, id) => s.plans.view.page.lasts.try.run;
  const tryDone = (id, { ms = 520 } = {}) => [(key, s) => ({ type: A.TRY_RUN, boxes: runBoxes(s, id) }), (key, s) => ({ type: A.TRY_DONE, key, boxes: s.lasts.tried.boxes, result: runTry(oneOf(id).plan, { today, boxes: s.lasts.tried.boxes }), ms })];
  states['lasts-try-closed'] = stateOne('AlexWay01', 'lasts', held('AlexWay01'));
  states['lasts-try-open'] = stateOne('AlexWay01', 'lasts', held('AlexWay01'), { open: ['tryOpen'] });
  states['lasts-try-working'] = stateOne('AlexWay01', 'lasts', [...held('AlexWay01'), (key, s) => ({ type: A.TRY_RUN, boxes: runBoxes(s, 'AlexWay01') })], { typed: TRIED_TYPED });
  states['lasts-try-tried'] = stateOne('AlexWay01', 'lasts', [...held('AlexWay01'), ...tryDone('AlexWay01')], { typed: TRIED_TYPED });
  states['lasts-try-none'] = stateOne('AlexWay01', 'lasts', [...held('AlexWay01'), ...tryDone('AlexWay01')]);
  states['lasts-try-confirm'] = stateOne('AlexWay01', 'lasts', [...held('AlexWay01'), ...tryDone('AlexWay01')], { typed: TRIED_TYPED, open: ['tryConfirm'] });
  states['lasts-try-kept'] = stateOne('AlexWay01', 'lasts', [...held('AlexWay01'), ...tryDone('AlexWay01'), { type: A.TRY_KEPT, planId: 'AlexWay01', id: 'Kq8LwT2mJv5PzYc9BnRd', name: 'Alex’s plan · tried', where: 'account' }], { typed: TRIED_TYPED });
  states['lasts-try-failed'] = stateOne('AlexWay01', 'lasts', [...held('AlexWay01'), (key, s) => ({ type: A.TRY_RUN, boxes: runBoxes(s, 'AlexWay01') }), (key, s) => ({ type: A.TRY_FAILED, key, boxes: s.lasts.tried.boxes })], { typed: TRIED_TYPED });
  states['lasts-try-problem'] = stateOne('AlexWay01', 'lasts', held('AlexWay01'), { typed: { 'try.years': 'abc', 'try.pot': '' }, open: ['tryOpen'], asked: true });
  states['lasts-try-locked'] = stateOne('SamBuckets04', 'lasts', [...held('SamBuckets04'), ...tryDone('SamBuckets04')], { typed: { 'try.way': 'pots-and-valves', 'try.years': '28' } });

  /**
   * "Your household" (research/v7/road-to-7.md step 9): tests/v7/states/plan/household-*.json — each a state on
   * #/plan/<id>/household holding the couple (corpus 09 and 10 as Alex's and Sam's plans, linked both ways; for the split,
   * Alex's pots four times over and £70,000 a year, as gate 9 derives them), the pooled run held (householdRun.js
   * runHousehold at the engine's own 1,000 futures), the survivor's and the care's results, a locked partner (copies), a plan
   * with no link. Few and small, on purpose: the working, failed, window, confirm and single-question states are made in the render test from these.
   */
  const { runHousehold, runSurvivor, runCare } = await import('../../../src/answers/plan/householdRun.js');
  const { pairKeyOf } = await import('../../../src/answers/plan/household.js');
  const couple = (unequal = false, { lockSam = false } = {}) => {
    const alex = plant(C['09-couple-a'], 'AlexCouple06', 'Alex’s plan', { active: true });
    const sam = plant(C['10-couple-b'], 'SamCouple07', 'Sam’s plan');
    alex.household = { partnerScenarioId: 'SamCouple07' }; sam.household = { partnerScenarioId: 'AlexCouple06' };
    if (unequal) { const st = alex.stressTool.settings; st.equityMin *= 4; st.bondMin *= 4; st.cashTarget *= 4; st.baseSalary = 70000; }
    if (lockSam) sam.decisionTool.settings = { ...sam.decisionTool.settings, locked: true, lockedAt: '2026-09-01T00:00:00.000Z', lockedBy: 'planner' };
    return [alex, sam].map((p) => entryOf(p, today));
  };
  const hhRuns = new Map();
  /** A state on the household step of Alex's plan with the pair read (an account unless said), then the actions; the reading refreshed as the plan source does. */
  const stateHh = (entries, actions = [], { open = [], typed = {}, source = 'account', session = 'in', id = 'AlexCouple06' } = {}) => {
    let s = initialState({ today, build: 'test' });
    s = reduce(s, { type: A.ROUTE_SET, route: parse('#/plan/' + id + '/household') });
    s = reduce(s, { type: A.SESSION_SET, session: { kind: session, email: session === 'in' ? 'someone@example.com' : null } });
    s = reduce(s, { type: A.PLANS_SET, list: entries, source, readAt: '14:03' });
    for (const [path, value] of Object.entries(typed)) s = reduce(s, { type: A.PLAN_EDIT, planId: id, path, value });
    s = reduce(s, { type: A.PLANS_VIEW, view: viewFor(s) });
    const key = entries.length > 1 ? pairKeyOf(entries[0].plan, entries[1].plan) : null;
    for (const a of actions) { s = reduce(s, typeof a === 'function' ? a(key, s) : a); s = reduce(s, { type: A.PLANS_VIEW, view: viewFor(s) }); }
    for (const x of open) s = reduce(s, { type: A.UI_TOGGLE, id: x });
    s = reduce(s, { type: A.PLANS_VIEW, view: viewFor(s) });
    return s;
  };
  const hhOf = (entries, tag) => { if (!hhRuns.has(tag)) hhRuns.set(tag, runHousehold(entries[0].plan, entries[1].plan, { today })); return hhRuns.get(tag); };
  const ranHh = (entries, tag, ms = 1400) => [(key) => ({ type: A.HH_RUN, key, limit: null }), (key) => ({ type: A.HH_DONE, key, limit: null, result: hhOf(entries, tag), ms })];
  const equal = couple(), unequal = couple(true), lockedPair = couple(true, { lockSam: true });
  const sBoxes = (s) => s.plans.view.page.household.run.survivor, cBoxes = (s) => s.plans.view.page.household.run.care;
  states['household-first'] = stateHh(equal);
  states['household-ran'] = stateHh(equal, ranHh(equal, 'equal'), { open: ['hhDetail'] });
  states['household-split'] = stateHh(unequal, ranHh(unequal, 'unequal'));
  states['household-locked'] = stateHh(lockedPair, ranHh(lockedPair, 'locked'));
  // the survivor's and the care's results in one state (the render test draws each; a working or failed one it makes from this)
  states['household-questions'] = stateHh(equal, [...ranHh(equal, 'equal'),
    (key, s) => ({ type: A.HH_SURVIVOR, key, boxes: sBoxes(s) }), (key, s) => ({ type: A.HH_SURVIVOR_DONE, key, boxes: s.household.survivor.boxes, result: runSurvivor(equal[0].plan, equal[1].plan, { today, ...s.household.survivor.boxes }), ms: 2100 }),
    (key, s) => ({ type: A.HH_CARE, key, boxes: cBoxes(s) }), (key, s) => ({ type: A.HH_CARE_DONE, key, boxes: s.household.care.boxes, result: runCare(equal[0].plan, equal[1].plan, { today, ...s.household.care.boxes }), ms: 2300 })]);
  states['household-who-pays'] = stateHh(equal, [], { open: ['hhWhoPays'], typed: { 'budget.shared': 'yes', 'budget.mySharePct': '60' } });
  states['household-unlinked'] = stateHh([entryOf(plant(C['09-couple-a'], 'AlexAlone08', 'Alex’s plan', { active: true }), today), entryOf(plant(C['02-pnv-draft'], 'AlexOther09', 'Alex’s other plan'), today)], [], { id: 'AlexAlone08', typed: { 'link.choice': 'AlexOther09' } });

  /**
   * "What you hold" and "Moving to your plan's mix" (research/v7/holdings-and-move.md §7; road-to-7.md step 10):
   * tests/v7/states/plan/hold-*.json and move-*.json — each a state on #/plan/<id>/hold or …/move holding ONE plan: Alex's
   * Pots & Valves draft with nothing recorded (corpus 02), the committed saver with new money a month (05), the pasted record
   * (12), the locked ladder in its run-up (03, 8 lines, 23 rungs), the locked Buckets plan (04, whose record already holds its
   * mix — "done"; and a copy with its shares line cut by a third, so there is something to buy and sell). Few and small, on
   * purpose (holdings-and-move.md §7: well under half a megabyte in all): five files, and the reading (plans.view) left out of
   * them — the render tests refresh it through viewFor as the plan source does on load; the locked record (hold-locked), the
   * saver's move (move-saver), the unlocked plan's move (move-notLocked) and the done move (move-done) are made in the render
   * tests from these by the reducer, as are the working, failed, confirm, fired-rotation and window states. The one run on
   * the held mix (moveRun.js runHeld) is held in move-mix at the engine's own 1,000 futures.
   */
  const { runHeld } = await import('../../../src/answers/plan/moveRun.js');
  const { runKeyOf: moveKeyOf } = await import('../../../src/answers/plan/move.js');
  const holdEmpty = plant(C['02-pnv-draft'], 'AlexHold01', 'Alex’s plan', { active: true });
  const holdSaver = plant(C['05-saver-committed'], 'SamSaver02', 'Sam’s plan');
  const holdPasted = plant(C['12-lumpy-db-gia'], 'AlexPasted03', 'Alex’s plan');
  const holdLadder = plant(C['03-gilt-ladder-runup'], 'SamLadder04', 'Sam’s plan');
  const moveDone = plant(C['04-buckets-running'], 'SamBuckets05', 'Sam’s plan');
  const moveMix = plant(C['04-buckets-running'], 'SamMoving06', 'Sam’s plan');
  // a third of the shares line sold into cash: shares to buy back, cash to sell down (never a new fixture: derived here)
  moveMix.holdings.lines[0].value = Math.round(moveMix.holdings.lines[0].value * 2 / 3);
  moveMix.holdings.lines[2].value = Math.round(moveMix.holdings.lines[2].value + C['04-buckets-running'].holdings.lines[0].value / 3);
  const HOLD_PASTE = 'Investment\tTicker\tUnits\tValue\niShares Core MSCI World\tSWDA\t3,150\t£284,000.00\nA fund of my own\t\t10\t£1,000\nTotal\t\t\t£285,000';
  const stateHm = (raw, step, actions = [], { open = [], typed = {}, source = 'account', session = 'in', index = null } = {}) => {
    const entry = entryOf(raw, today);
    let s = initialState({ today, build: 'test' });
    s = reduce(s, { type: A.ROUTE_SET, route: parse('#/plan/' + raw.id + '/' + step) });
    s = reduce(s, { type: A.SESSION_SET, session: { kind: session, email: session === 'in' ? 'someone@example.com' : null } });
    s = reduce(s, { type: A.PLANS_SET, list: [entry], source, readAt: '14:03' });
    if (index) s = reduce(s, { type: A.MOVE_INDEX, index });
    for (const [path, value] of Object.entries(typed)) s = reduce(s, { type: A.PLAN_EDIT, planId: raw.id, path, value });
    s = reduce(s, { type: A.PLANS_VIEW, view: viewFor(s) });
    const key = moveKeyOf(entry.plan);
    for (const a of actions) { s = reduce(s, typeof a === 'function' ? a(key, s, entry.plan) : a); s = reduce(s, { type: A.PLANS_VIEW, view: viewFor(s) }); }
    for (const x of open) s = reduce(s, { type: A.UI_TOGGLE, id: x });
    // the reading is left out (it is the plan source's, recomputed on load); the tests refresh it with viewFor
    const { view, ...plans } = s.plans; void view;
    return { ...s, plans };
  };
  // the index the rotation watch reads: the bundled snapshot's figures as the effect would file them (the states carry no live file)
  const INDEX = { level: 7690.73, ath: 7818.93, asOf: '2026-10-19', symbol: 'S&P 500 (price index)', athDate: '2026-10-06' };
  states['hold-empty'] = stateHm(holdEmpty, 'hold', [], { typed: { 'add.text': 'vanguard all-world' } });
  states['hold-typed'] = stateHm(holdSaver, 'hold');
  states['hold-paste'] = stateHm(holdPasted, 'hold', [], { typed: { 'paste.text': HOLD_PASTE, 'paste.wrapper': 'SIPP', 'paste.2.what': 'bonds' }, open: ['holdPaste'] });
  states['move-ladder'] = stateHm(holdLadder, 'move', [], { index: INDEX, open: ['moveExplained'] });
  states['move-mix'] = stateHm(moveMix, 'move', [(key) => ({ type: A.MOVE_RUN, key }), (key, s, plan) => ({ type: A.MOVE_DONE, key, result: runHeld(plan, { today }), ms: 620 })], { index: INDEX });
  void moveDone;
  return { states };
}

if (QUESTION === 'plan') {
  const { states } = await buildPlanStates({ today: TODAY });
  const { target, whole, names } = writeStates(states, join(here, 'plan'));
  if (whole) {
    writeFileSync(join(target, '_made-with.json'), JSON.stringify({
      note: 'Written by tests/v7/states/build-states.mjs --question plan. Do not edit by hand.',
      today: TODAY, futures: 1000, version: VERSION, run: 'src/answers/plan/waysRun.js', runs: ['src/answers/plan/waysRun.js', 'src/answers/plan/lastsRun.js', 'src/answers/plan/mixRun.js', 'src/answers/plan/householdRun.js'],
      plans: ['tests/fixtures/plans/02-pnv-draft.json (Alex’s plan)', 'tests/fixtures/plans/03-gilt-ladder-runup.json (Sam’s plan, locked)', 'tests/fixtures/plans/01-fresh-default.json (Alex’s first plan)', 'tests/fixtures/plans/04-buckets-running.json (Sam’s plan, locked, Buckets in order)', 'tests/fixtures/plans/07-pre-6.13-flat-params.json (Alex’s rotation plan)', 'tests/fixtures/plans/09-couple-a.json and 10-couple-b.json (Alex’s and Sam’s plans, the couple; the split pair with Alex’s pots four times over)'], patched: []
    }, null, 2) + '\n');
  }
  console.log(`${names.length} states written to ${target}/`);
  process.exit(0);
}

if (QUESTION === 'd') {
  const { states, patched: made, answer } = buildDStates({ today: TODAY, futures: FUTURES, inputsKey });
  const { target, whole, names } = writeStates(states, join(here, 'd'));
  if (whole) {
    writeFileSync(join(target, '_made-with.json'), JSON.stringify({
      note: 'Written by tests/v7/states/build-states.mjs --question d. Do not edit by hand.',
      today: TODAY, futures: FUTURES, inputsKeyFrom: keyFrom, answer, patched: made
    }, null, 2) + '\n');
  }
  console.log(`${names.length} states written to ${target}/ (${made.length} with a hand-made result: ${made.join(', ') || 'none'})`);
  process.exit(0);
}

if (QUESTION !== 'c') {
  const { states, patched: made, answer } = buildSaverStates(QUESTION, { today: TODAY, futures: FUTURES, inputsKey });
  const { target, whole, names } = writeStates(states, join(here, QUESTION));
  if (whole) {
    writeFileSync(join(target, '_made-with.json'), JSON.stringify({
      note: 'Written by tests/v7/states/build-states.mjs --question ' + QUESTION + '. Do not edit by hand.',
      today: TODAY, futures: FUTURES, inputsKeyFrom: keyFrom, answer, patched: made
    }, null, 2) + '\n');
  }
  console.log(`${names.length} states written to ${target}/ (${made.length} with a hand-made result: ${made.join(', ') || 'none'})`);
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
/**
 * A couple who stop work in different years (research/v7/couples-different-years.md 9.7 B1; fixture F5): you 56, stopped
 * and drawing, so the money is from now; your partner 55, still working and paying in £500 and £350 from the employer,
 * stops next year at 56; £60,000 of savings between you. Made-up round figures, nobody's own.
 * tests/v7/states/states.slow.test.js checks the same household with the other of you as "you" gives the same figures.
 */
const APART = {
  household: 'couple', 'you.pot': '500,000', 'you.age': '56', 'start.kind': 'now',
  'partner.age': '55', 'partner.pot': '450,000', 'partner.stop.kind': 'age', 'partner.stop.age': '56',
  'partner.payIn.has': 'yes', 'partner.payIn.kind': 'split', 'partner.payIn.own': '500', 'partner.payIn.employer': '350', savings: '60,000'
};
states['numbers-apart'] = base('#/c/numbers', APART, { open: ['more'] });
states['answer-apart'] = answered('answer-apart', APART, { open: ['madeOf'] });
{
  const r = states['answer-apart'].answers.c.result;
  if (!(r.status === 'ok' && r.apart && r.apart.first === 'you' && r.apart.years === 1 && r.payIn && r.payIn.total === 850)) {
    throw new Error('answer-apart: the inputs no longer give a couple apart, you stopped and your partner a year on — choose new inputs');
  }
}
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
// A question that is not in the preview yet (E; before road-to-7.md step 7 this was D, and before step 4's joining up A — both now built).
states['soon-e'] = base('#/soon/e');
states['not-built-ways'] = base('#/c/ways', F1);
states['not-found'] = base('#/plan/abc/c/answer');

const { target, whole, names } = writeStates(states, join(here, 'c'));
if (whole) {
  const probe = answerC({ household: 'single', you: { pot: 12000, age: 58 } }, { today: TODAY, futures: 10, seed: 0 });
  writeFileSync(join(OUT ? target : here, 'made-with.json'), JSON.stringify({
    note: 'Written by tests/v7/states/build-states.mjs. Do not edit by hand.',
    today: TODAY,
    futures: FUTURES,
    inputsKeyFrom: keyFrom,
    answer: probe.monthly && probe.monthly.careful === 1380 ? 'the STUB of package 1 (figures do not follow the inputs)' : 'src/answers/c/answer.js',
    patched
  }, null, 2) + '\n');
}
console.log(`${names.length} states written to ${target}/ (${patched.length} with a hand-made result: ${patched.join(', ') || 'none'})`);
