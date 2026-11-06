/**
 * Question A, a stop at or after one of the steps (review, 2 Oct 2026): the engine tests the step in force from the stop
 * (spending-shape.md 3.5, 6.3), so every word about that stop reads the figure TESTED there — never the first amount typed,
 * which no year of that stop has. "Show me ages" is where it happens: a step only has to be after today, so the rows past
 * it start on the step. The same holds for what is kept: the seed's figure, its shape, the summary, the name and the
 * description start from the figure tested, in age order.
 *
 * And "Slowly less" (today's old "declining with age", T18) counts its years from when the money starts, as today's
 * smileToSteps does from the plan's start: with "show me ages" there is no start yet, so it asks for a stop first.
 * Made-up figures only.
 */
import { describe, it, expect, vi } from 'vitest';

vi.mock('../../../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));
vi.mock('../../../src/v7/rail/questions.js', async () => (await import('../shell/_allOpen.js')).allOpen());

import { answerA, checkAnswerA, scopesForA, allSentences } from '../a/invariants.js';
import { bannedHits } from '../render/checkScreen.js';
import { partsText, get, money } from '../../../src/answers/shared/format.js';
import { slowlyLess } from '../../../src/answers/shared/shape.js';
import { amountAtAge, compileSteps } from '../../../src/services/IncomeSchedule.js';
import { buildPlanSeed } from '../../../src/answers/keep/planSeed.js';
import { seedToScenario, seedSummary, checkSeed } from '../../../src/services/PlanSeed.js';
import { grossUpAnnual } from '../../../src/services/BudgetModel.js';
import { suggestedPlanName } from '../../../src/answers/shared/planName.js';
import { renderScreen } from '../c/_c.js';
import { checkScreen } from '../render/checkScreen.js';
import { reduce } from '../../../src/v7/state/reduce.js';
import { A as ACT } from '../../../src/v7/state/actions.js';
import { stepsOf } from '../../../src/v7/state/shapeDraft.js';
import { parsedDraft, currentKey } from '../../../src/v7/state/select.js';
import { SHAPE } from '../../../src/v7/copy/shape.js';
import { BUDGET } from '../../../src/v7/copy/budget.js';

const fill = (text, values) => String(text).replace(/\{(\w+)\}/g, (m, k) => (k in values ? values[k] : m));
import { fresh, run, set, route, typedA } from '../shell/_open.js';

const ENV = { today: '2026-09-30', futures: 20, seed: 0, trace: false, detail: 'chart' };
const AT = '2026-09-30T14:03:22.511Z';
const NOW_MS = Date.parse(AT) + 60000;
const DAY = new Date(2026, 8, 30, 15, 0);
const grossRow = (perMonth) => Math.round(grossUpAnnual(perMonth * 12));
const rowAt = (rows, age) => { let r = rows[0]; for (const x of rows) if (x.fromAge <= age) r = x; return r; };
const seedOf = (r) => buildPlanSeed({ source: 'a', result: r, env: { today: ENV.today, appVersion: '6.21.0' }, name: { chosen: 'Our try' }, createdAt: AT });

/** P-SS6: each sentence is its parts joined, every key a figure of the result, no banned word in its scopes. */
function wordsHold(result) {
  const list = allSentences(result);
  const context = list.map((s) => s.text).join(' ');
  for (const s of list) {
    expect(partsText(s.parts, result), s.id).toBe(s.text);
    for (const p of s.parts) if (p && typeof p === 'object' && p.key) expect(get(result, p.key), `${s.id}: ${p.key}`).not.toBeUndefined();
    expect(bannedHits(s.text, scopesForA(result.inputs), { context }), `${s.id}: ${s.text}`).toEqual([]);
  }
}

// The review's case: 58, £250,000, paying in £600, savings £30,000, "show me ages", £2,500 a month, "Slowly less" from today
// (as the preset made it before this fix: the same to 63, 1% less a year to 82, then the same).
const SLOWLY = slowlyLess('perMonth', 2500, 58);
const CASE1 = { you: { age: 58, pot: 250000, payIn: { total: 600 } }, savings: 30000, stop: { kind: 'ages' }, spend: { kind: 'amount', amount: 2500, steps: SLOWLY.steps } };
/** The figure tested at a stop: the shape's own amount at that age (today's amountAtAge on the steps as typed). */
const testedAt = (age) => amountAtAge([{ fromAge: 0, amount: 2500 }, ...SLOWLY.steps.map((s) => ({ fromAge: s.fromAge, amount: s.perMonth, decline: s.fallsPct || 0 }))], age);

describe('A: a stop past a step — the words read the figure tested there', () => {
  const r = answerA(CASE1, ENV);

  it('the case: the steps are 63 (falling 1% a year) and 83; the shown stop is 67, past the first; its first year is the step\'s figure', () => {
    expect(SLOWLY.steps.map((s) => [s.fromAge, s.perMonth, s.then])).toEqual([[63, 2475, 'falls'], [83, 2045, 'level']]);
    expect(r.status).toBe('ok');
    expect(r.stop).toEqual({ kind: 'ages', age: 67 });
    expect(r.byYear[0].spend).toBeCloseTo(testedAt(67), 2);
    expect(r.shapeNotes.inForce).toEqual({ age: 63, perMonth: Math.round(testedAt(67)) });
    expect(checkAnswerA(r, CASE1, ENV)).toEqual([]);
    wordsHold(r);
  });

  it('the sub line and the verdict\'s sentence: the figure tested at 67, never the £2,500 typed (no year of a stop at 67 is £2,500)', () => {
    const at67 = money(testedAt(67));
    expect(r.sentences.sub.text).toBe(`spending ${at67} a month after tax from 67 until you are 95, going up each year with prices`);
    expect(r.sentences.line.text).not.toContain('£2,500');
    expect(r.sentences.line.text).toMatch(/^The earliest age at which what you spend, as you set it, lasted to 95 in 9 futures out of 10 is 67\./);
    // "That is at the start": the start is the figure the sub line names — its fall ends where that figure's would
    expect(r.sentences.shape.text).toBe(`That is at the start, falling 1% a year to ${money(Math.round(testedAt(67) * 0.99 ** 15 / 10) * 10)} at 82. Then, as you set it: £2,045 from 83.`);
  });

  it('each row of the ages names the figure tested at ITS stop (the first amount before 63, the step after), and a row that lasted every time is never careful below it', () => {
    r.ages.forEach((row, k) => {
      const tested = testedAt(row.age);
      expect(r.sentences.chart[k].text, `row ${row.age}`).toContain(`; ${money(tested)} a month at the start, as you set it, lasted `);
      if (row.verdict === 'yes') expect(row.monthly.careful, `row ${row.age}`).toBeGreaterThanOrEqual(Math.floor(tested / 10) * 10);
      // a row before the step keeps the typed figure and no extra key; a row past it carries what was tested
      if (row.age < 63) expect(row.spendAtStart).toBeUndefined();
      else expect(row.spendAtStart).toBeCloseTo(tested, 2);
    });
  });

  it('the note says which step is in force from the stop', () => {
    const note = r.warnings.find((w) => w.id === 'shape-step-in-force');
    expect(note.text).toBe(`You stop at 67, after your step from 63, so ${money(testedAt(67))} a month applies from the start.`);
  });

  it('kept as a plan: the seed\'s figure is the one tested, its shape starts there (the step in force, then the later steps), and the summary, the name and the description start from it, ages in order', () => {
    const seed = seedOf(r);
    expect(checkSeed(seed, NOW_MS)).toEqual({ ok: true });
    expect(seed.spend.perMonth).toBe(r.byYear[0].spend);
    expect(seed.spend.shape).toEqual({ unit: 'perMonth', start: { then: 'falls', fallsPct: 1 }, steps: [{ fromAge: 83, perMonth: 2045, then: 'level' }] });
    expect(seedSummary(seed)).toMatch(new RegExp(`^Stop at 67, ${money(testedAt(67)).replace('£', '£')} a month at the start, changing with age as you set it`));
    expect(seed.name.suggested).toBe(`Stop at 67 · ${money(Math.round(testedAt(67) / 10) * 10)} a month, less each year`);
    expect(suggestedPlanName('a', r.inputs, r)).toBe(seed.name.suggested);
    const { yours } = seedToScenario(seed, DAY);
    expect(yours.planDetails.description).toContain(`Spending, after tax at today's prices: ${money(testedAt(67))} a month from 67, then 1% less each year; £2,045 from 83.`);
    // and the plan targets the answer's figure every year, as before (K-SS2)
    const S = yours.stressTool.settings;
    const compiled = compileSteps(S, S.shapeAgeNow);
    for (let y = 0; y <= S.duration; y++) {
      const row = rowAt(seed.people[0].takeHome, S.shapeAgeNow + y);
      expect(Math.abs((compiled ? compiled[y] : S.baseSalary) - grossRow(row.perMonth)), `year ${y}`).toBeLessThan(1);
    }
  });

  it('a stop before every step keeps its words and its seed as before (the typed figure is the start)', () => {
    const before = answerA({ ...CASE1, you: { ...CASE1.you, pot: 600000 } }, ENV);
    expect(before.stop.age).toBeLessThan(63);
    expect(before.shapeNotes.inForce).toBe(null);
    expect(before.sentences.sub.text).toContain('spending £2,500 a month after tax from ');
    expect(before.ages.every((row) => row.age >= 63 || row.spendAtStart === undefined)).toBe(true);
    const seed = seedOf(before);
    expect(seed.spend.perMonth).toBe(2500);
    expect(seed.spend.shape.steps.map((s) => s.fromAge)).toEqual([63, 83]);
  });
});

describe('A: a stop AT a step\'s age', () => {
  // 58, £320,000, savings £30,000, show me ages; £3,000 a month, then from 64 £2,600 falling 1.5% a year: the earliest is 64
  const inputs = { you: { age: 58, pot: 320000, payIn: { total: 600 } }, savings: 30000, stop: { kind: 'ages' },
    spend: { kind: 'amount', amount: 3000, steps: [{ fromAge: 64, perMonth: 2600, then: 'falls', fallsPct: 1.5 }] } };
  const r = answerA(inputs, ENV);

  it('the step\'s figure is the start; the note says the step starts as you stop (not "after")', () => {
    expect(r.stop.age).toBe(64);
    expect(r.sentences.sub.text).toContain('spending £2,600 a month after tax from 64');
    expect(r.warnings.find((w) => w.id === 'shape-step-in-force').text).toBe('Your step from 64 starts as you stop, so £2,600 a month applies from the start.');
    wordsHold(r);
    expect(checkAnswerA(r, inputs, ENV)).toEqual([]);
  });
});

describe('"Slowly less" counts from when the money starts: with "show me ages" it asks for a stop first', () => {
  const go = (state, q, step) => reduce(state, { type: ACT.ROUTE_SET, route: route('step', q, step) });
  const open = (state) => reduce(state, { type: ACT.UI_TOGGLE, id: 'shape' });
  const byAges = () => open(go(run(typedA(fresh(), { age: '58', pot: '250,000', stop: '62', spend: '2,500' }), set('a', 'stop.kind', 'ages')), 'a', 'spend'));

  it('with "show me ages": no steps are filled in, and the line under the buttons says why', () => {
    const s = reduce(byAges(), { type: ACT.SHAPE_PRESET, q: 'a', id: 'slowly' });
    expect(stepsOf('a', s.draft.a.values)).toEqual([]);
    expect(s.draft.a.shapeNote).toEqual({ kind: 'slowlyNeedsStop' });
    const root = renderScreen(s);
    expect(checkScreen(root, s)).toEqual([]);
    const note = root.querySelector('[data-testid="a.shape.note"]');
    expect(note.textContent).toBe(SHAPE.slowlyNeedsStop);
    expect(note.getAttribute('data-note')).toBe('slowlyNeedsStop');
  });

  it('with an age to stop: today\'s smileToSteps from that stop, as before (T18)', () => {
    const s = reduce(open(go(typedA(fresh(), { age: '58', pot: '250,000', stop: '62', spend: '2,500' }), 'a', 'spend')), { type: ACT.SHAPE_PRESET, q: 'a', id: 'slowly' });
    expect(stepsOf('a', s.draft.a.values).map((x) => x.fromAge)).toEqual(['67', '87']);
  });

  it('"Suggest go-go, go-slow and no-go years" still works with "show me ages": its ages are ages (75 and 85), not years from a start', () => {
    const s = reduce(byAges(), { type: ACT.SHAPE_SUGGEST, q: 'a' });
    expect(stepsOf('a', s.draft.a.values).map((x) => x.fromAge)).toEqual(['75', '85']);
  });
});

describe('the ages\' picture: the spending line says a stop after a step starts on the step', () => {
  it('with rows past a step: "from when you stop, then as you set it by age" and why; without: as before', async () => {
    const { ANSWERS } = await import('../../../src/answers/index.js');
    const answered = (state) => {
      const parsed = parsedDraft(state, 'a');
      expect(parsed.ok, JSON.stringify(parsed.errors)).toBe(true);
      const result = ANSWERS.a.answer(parsed.inputs, ENV);
      const key = currentKey(state, 'a');
      return { s: run(state, { type: ACT.ANSWER_WORKING, q: 'a', inputsKey: key }, { type: ACT.ANSWER_FINAL, q: 'a', inputsKey: key, result }), result };
    };
    const typed = run(typedA(fresh(), { age: '58', pot: '250,000', stop: '62', spend: '2,500' }), set('a', 'stop.kind', 'ages'), set('a', 'savings', '30,000'),
      { type: ACT.SHAPE_ADD, q: 'a' }, { type: ACT.SHAPE_STEP, q: 'a', i: 0, field: 'fromAge', value: '63' }, { type: ACT.SHAPE_STEP, q: 'a', i: 0, field: 'perMonth', value: '2,475' },
      { type: ACT.SHAPE_STEP, q: 'a', i: 0, field: 'then', value: 'falls' }, { type: ACT.SHAPE_STEP, q: 'a', i: 0, field: 'fallsPct', value: '1' });
    const { s, result } = answered(reduce(typed, { type: ACT.ROUTE_SET, route: route('step', 'a', 'answer') }));
    expect(result.ages.some((row) => row.spendAtStart !== undefined)).toBe(true);
    const root = renderScreen(s);
    expect(checkScreen(root, s)).toEqual([]);
    const note = root.querySelector('#chart-title').parentElement.querySelector('p.note');
    expect(note.textContent).toBe(`Spending £2,500 ${SHAPE.answer.spendingShapedByAge}`);
    expect(root.textContent).not.toContain(SHAPE.answer.spendingShaped);
    // "Try a change": the box is the figure typed, which is not this stop's start — so it is not called the start
    expect(result.shapeNotes.inForce).not.toBe(null);
    expect(root.querySelector('#try-spend').textContent).toBe(SHAPE.try.spendTyped);
    expect(root.querySelector('[data-typed="spend.amount"]').textContent).toBe('£2,500');
    // and the line about where the figure came from says the steps follow it (never the figure alone, spending-shape.md 7.2)
    expect(root.querySelector('[data-testid="a.spend.line"]').textContent).toContain(fill(BUDGET.answer.noBudgetShaped, { amount: '£2,500' }));
  }, 60_000);
});

describe('the hand-overs from a stop past a step start on the step (found by the lead, 2 Oct 2026, beside the review)', () => {
  // A, "show me ages": £2,500 a month, then from 63 £2,475 falling 1% a year, then £2,045 from 83. The stop shown is past 63,
  // so B's stop and C's start are too: carried as typed, the steps before them were refused there ("before you stop").
  const answeredA = async () => {
    const { ANSWERS } = await import('../../../src/answers/index.js');
    let s = run(typedA(fresh(), { age: '58', pot: '250,000', stop: '62', spend: '2,500' }), set('a', 'stop.kind', 'ages'), set('a', 'savings', '30,000'),
      set('a', 'you.payIn.total', '600'),
      { type: ACT.SHAPE_ADD, q: 'a' }, { type: ACT.SHAPE_STEP, q: 'a', i: 0, field: 'fromAge', value: '63' }, { type: ACT.SHAPE_STEP, q: 'a', i: 0, field: 'perMonth', value: '2,475' },
      { type: ACT.SHAPE_STEP, q: 'a', i: 0, field: 'then', value: 'falls' }, { type: ACT.SHAPE_STEP, q: 'a', i: 0, field: 'fallsPct', value: '1' },
      { type: ACT.SHAPE_ADD, q: 'a' }, { type: ACT.SHAPE_STEP, q: 'a', i: 1, field: 'fromAge', value: '83' }, { type: ACT.SHAPE_STEP, q: 'a', i: 1, field: 'perMonth', value: '2,045' });
    s = reduce(s, { type: ACT.ROUTE_SET, route: route('step', 'a', 'answer') });
    const parsed = parsedDraft(s, 'a');
    expect(parsed.ok, JSON.stringify(parsed.errors)).toBe(true);
    const result = ANSWERS.a.answer(parsed.inputs, ENV);
    const key = currentKey(s, 'a');
    return { s: run(s, { type: ACT.ANSWER_WORKING, q: 'a', inputsKey: key }, { type: ACT.ANSWER_FINAL, q: 'a', inputsKey: key, result }), result, ANSWERS };
  };
  const testedAtTyped = (age) => amountAtAge([{ fromAge: 0, amount: 2500 }, { fromAge: 63, amount: 2475, decline: 1 }, { fromAge: 83, amount: 2045 }], age);

  it('A → C: C starts at the stop shown, on the step in force (falling 1% a year), and the later step is a share of the figure there; C answers', async () => {
    const { s, result, ANSWERS } = await answeredA();
    const stop = result.stop.age;
    expect(stop).toBeGreaterThan(63);
    const t = reduce(s, { type: ACT.DRAFT_CARRY, from: 'a', to: 'c' });
    const v = t.draft.c.values;
    expect(v['start.age']).toBe(String(stop));
    expect(v['shape.then']).toBe('falls');
    expect(v['shape.fallsPct']).toBe('1');
    expect(stepsOf('c', v).map((x) => [x.fromAge, x.share])).toEqual([['83', String(Math.round(10000 * 2045 / testedAtTyped(stop)) / 100)]]);
    const parsed = parsedDraft(t, 'c');
    expect(parsed.ok, JSON.stringify(parsed.errors)).toBe(true);
    expect(ANSWERS.c.answer(parsed.inputs, { ...ENV, detail: undefined }).status).toBe('ok');
  }, 60_000);

  it('A → B: B\'s figure is the one A tested at that stop (to the pound, down), falling 1% a year, then the later step as typed; B reads it', async () => {
    const { s, result } = await answeredA();
    const t = reduce(s, { type: ACT.DRAFT_CARRY, from: 'a', to: 'b' });
    const v = t.draft.b.values;
    expect(v['stop.age']).toBe(String(result.stop.age));
    expect(v['spend.amount']).toBe(money(Math.floor(testedAtTyped(result.stop.age))).slice(1));
    expect(v['spend.then']).toBe('falls');
    expect(v['spend.fallsPct']).toBe('1');
    expect(stepsOf('b', v).map((x) => [x.fromAge, x.perMonth])).toEqual([['83', '2,045']]);
    const parsed = parsedDraft(t, 'b');
    expect(parsed.ok, JSON.stringify(parsed.errors)).toBe(true);
  }, 60_000);

  it('a stop before every step carries the steps as typed, as before', async () => {
    const { s } = await answeredA();
    const before = run(s, set('a', 'stop.kind', 'age'), set('a', 'stop.age', '60'));
    const t = reduce(before, { type: ACT.DRAFT_CARRY, from: 'a', to: 'b' });
    expect(t.draft.b.values['spend.amount']).toBe('2,500');
    expect(stepsOf('b', t.draft.b.values).map((x) => x.fromAge)).toEqual(['63', '83']);
  });
});
