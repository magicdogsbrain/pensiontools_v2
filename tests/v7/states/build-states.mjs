/**
 * Makes the named states the render tests, the browser journeys and the pictures all draw:
 * tests/v7/states/c/<name>.json — each a whole V7 state (build brief 4.5), with the answer inside produced by the
 * answer function and pinned.
 *
 *   npx -y node@20 tests/v7/states/build-states.mjs          (futures: 1,000 — what the published page shows)
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
import { writeFileSync, mkdirSync, readdirSync, rmSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { initialState } from '../../../src/v7/state/initial.js';
import { parse } from '../../../src/v7/router/routes.js';
import { SCHEMA_C } from '../../../src/answers/c/schema.js';
import { parseDraft } from '../../../src/answers/shared/validate.js';
import { partsText } from '../../../src/answers/shared/format.js';
import { answerC } from '../../../src/answers/c/answer.js';

const here = dirname(fileURLToPath(import.meta.url));
const TODAY = '2026-09-30';
const FUTURES = Number(process.env.V7_STATES_FUTURES || 1000);

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
states['answer-small-pot'] = answered('answer-small-pot', { 'you.pot': '12,000', 'you.age': '58' }, { patch: 'small' });
states['answer-pensions-only'] = answered('answer-pensions-only', { 'you.pot': '0', 'you.age': '68' }, { patch: 'pensionsOnly' });
// the same with the State Pension still to come (58): the amounts are what it will pay, the phases say nothing until 67
states['answer-pensions-only-later'] = answered('answer-pensions-only-later', { 'you.pot': '0', 'you.age': '58' });
states['answer-nothing'] = answered('answer-nothing', { 'you.pot': '0', 'you.age': '68', 'you.statePension.kind': 'none' }, { patch: 'nothing' });
states['answer-assumed-open'] = answered('answer-assumed-open', F1, { open: ['madeOf', 'assumed', 'allAssumed'] });
{
  const s = answered('answer-failed', F1);
  s.answers.c = { ...s.answers.c, status: 'failed', result: null };
  states['answer-failed'] = s;
}
states['soon-a'] = base('#/soon/a');
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
