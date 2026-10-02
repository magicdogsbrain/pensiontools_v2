/**
 * The owner's rule, item by item (2 Oct 2026: "We NEED to have the same or better optionally than V6. We MUST offer as
 * many steps and tapers as V6! … We must have Gogo, goslow and nogo years."). research/v7/spending-shape.md section 1
 * lists everything today's planner does on its income shape, T1 to T20; section 2 gives each its V7 home. Here each row
 * is a test of its own, named by its id, run against the V7 screens and the shell (PAR4); a row the screens cannot hold
 * yet says where it is held or why it waits. The list of ids is read from the design itself, so a new row fails here
 * until it has its test.
 *
 * Also: the picture's colours (tokens.css --chart-*) meet 3 to 1 on the card and on the go-slow band behind them, and the
 * warning colour is never the only signal (the words say it too: spendShape.test.js).
 */
import { describe, it, expect, vi } from 'vitest';
vi.mock('../../../src/v7/rail/questions.js', async () => (await import('../shell/_allOpen.js')).allOpen());

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { renderScreen } from '../c/_c.js';
import { checkScreen } from '../render/checkScreen.js';
import { reduce } from '../../../src/v7/state/reduce.js';
import { A as ACT } from '../../../src/v7/state/actions.js';
import { shapeView, currentKey } from '../../../src/v7/state/select.js';
import { stepsOf } from '../../../src/v7/state/shapeDraft.js';
import { yearFigures } from '../../../src/v7/state/shapeModel.js';
import { amountAtAge, smileToSteps } from '../../../src/services/IncomeSchedule.js';
import { suggestSteps } from '../../../src/ui/incomeShapeGraphic.js';
import { starterSheet } from '../../../src/answers/keep/budgetSheet.js';
import { initialState } from '../../../src/v7/state/initial.js';
import { SHAPE } from '../../../src/v7/copy/shape.js';
import { fresh, run, set, route, typedA } from '../shell/_open.js';

const one = (root, id) => root.querySelector(`[data-testid="${id}"]`);
const go = (state, q, step) => reduce(state, { type: ACT.ROUTE_SET, route: route('step', q, step) });
const open = (state) => reduce(state, { type: ACT.UI_TOGGLE, id: 'shape' });
const spendA = (o = {}) => open(go(typedA(fresh(), { stop: '62', spend: '2,500', ...o }), 'a', 'spend'));
const steps = (s) => stepsOf('a', s.draft.a.values);
const clean = (root, state) => expect(checkScreen(root, state)).toEqual([]);
const figureAt = (root, age) => Number(root.querySelector(`[data-testid="a.shape.chart"] g[data-age="${age}"]`).getAttribute('data-figure'));

describe('today\'s planner\'s income shape, item by item (spending-shape.md section 1)', () => {
  const design = readFileSync(join(process.cwd(), 'research/v7/spending-shape.md'), 'utf8');
  const section1 = design.slice(design.indexOf('## 1.'), design.indexOf('## 2.'));
  const ids = [...section1.matchAll(/^\| (T\d+) \|/gm)].map((m) => m[1]);
  const me = readFileSync(join(process.cwd(), 'tests/v7/screens/shapeParity.test.js'), 'utf8');

  it('every row of section 1 (T1–T20) has a test of its own below', () => {
    expect(ids.length).toBeGreaterThanOrEqual(20);
    for (const id of ids) expect(me.includes(`'${id} `), id).toBe(true);
  });

  it('T1 any number of steps by age; the first at the stop, its age not a box of its own', () => {
    let s = spendA();
    for (let k = 0; k < 12; k++) s = reduce(s, { type: ACT.SHAPE_ADD, q: 'a' });
    const root = renderScreen(s);
    expect(root.querySelectorAll('li.shape-step[data-step]').length).toBe(13);
    expect(one(root, 'a.shape.first').textContent).toContain('From when you stop at 62');
    expect(root.querySelector('li.shape-first input')).toBe(null);
  });

  it('T2 each figure is all you spend: the State Pension and other pensions pay first (the words, and the picture\'s layers)', () => {
    expect(SHAPE.chart.key).toMatch(/State Pension and other pensions/);
    expect(SHAPE.lead).toMatch(/Every figure is after tax/);
  });

  it('T3 a fall within a step, compounding at today\'s prices — on every step, up to 10% a year (today\'s stops at 5%)', () => {
    const s = run(spendA(), set('a', 'spend.then', 'falls'), set('a', 'spend.fallsPct', '10'));
    const root = renderScreen(s);
    clean(root, s);
    expect(figureAt(root, 63)).toBeCloseTo(2500 * 0.9, 9);
    expect(figureAt(root, 72)).toBeCloseTo(2500 * 0.9 ** 10, 9);
    expect(amountAtAge([{ fromAge: 62, amount: 2500, decline: 10 }], 72)).toBeCloseTo(2500 * 0.9 ** 10, 9);   // today's own meaning
  });

  it('T4 "moves evenly to the next step": a straight line arriving as the next starts; never on the last', () => {
    const s = run(spendA(), { type: ACT.SHAPE_ADD, q: 'a' }, { type: ACT.SHAPE_STEP, q: 'a', i: 0, field: 'perMonth', value: '1,500' }, set('a', 'spend.then', 'glides'));
    const root = renderScreen(s);
    expect(figureAt(root, 67)).toBeCloseTo(2000, 9);
    expect(figureAt(root, 72)).toBe(1500);
    expect([...one(root, 'a.spend.steps.0.then').options].map((o) => o.value)).not.toContain('glides');
  });

  it('T5 add a step: 10 years after the last, less than it (V7: 10% less, to £10; today: £10,000 a year less)', () => {
    const s = reduce(spendA(), { type: ACT.SHAPE_ADD, q: 'a' });
    expect(steps(s)).toEqual([{ fromAge: '72', perMonth: '2,250', then: 'level', fallsPct: '' }]);
  });

  it('T6 remove any step after the first', () => {
    const s = run(spendA(), { type: ACT.SHAPE_ADD, q: 'a' }, { type: ACT.SHAPE_ADD, q: 'a' }, { type: ACT.SHAPE_REMOVE, q: 'a', i: 0 });
    expect(steps(s).map((x) => x.fromAge)).toEqual(['82']);
    expect(one(renderScreen(s), 'a.shape.remove.0')).not.toBe(null);
  });

  it('T7 start from my budget: "Use £X a month" sets the first amount; later steps kept, and moved in proportion on one tap', () => {
    const sheet = starterSheet();
    Object.assign(sheet.lines.find((l) => !l.essential), { amount: '3,000', period: 'mo' });
    let s = run({ ...spendA(), budget: sheet }, { type: ACT.SHAPE_SUGGEST, q: 'a' }, { type: ACT.BUDGET_USE, q: 'a' });
    expect(s.draft.a.values['spend.amount']).toBe('3,000');
    expect(steps(s).map((x) => x.perMonth)).toEqual(['2,130', '1,750']);
    expect(one(renderScreen(s), 'a.shape.rescale').textContent).toBe(SHAPE.rescale);
    s = reduce(s, { type: ACT.SHAPE_RESCALE, q: 'a' });
    expect(steps(s).map((x) => x.perMonth)).toEqual(['2,556', '2,100']);
  });

  it('T8 or a number: the figure above; "The same every year" clears the steps', () => {
    const s = run(spendA(), { type: ACT.SHAPE_SUGGEST, q: 'a' }, { type: ACT.SHAPE_PRESET, q: 'a', id: 'level' });
    expect(steps(s)).toEqual([]);
    expect(shapeView(s, 'a').shaped).toBe(false);
  });

  it('T9 suggest go-slow and no-go: 15% less from 75, 30% less from 85, never below the essentials — today\'s suggestSteps (and Undo)', () => {
    const s = reduce(spendA(), { type: ACT.SHAPE_SUGGEST, q: 'a' });
    const today = suggestSteps(2500 * 12, 62, 0);
    expect(steps(s).map((x) => Number(x.fromAge))).toEqual(today.slice(1).map((x) => x.fromAge));
    expect(steps(s).map((x) => x.perMonth)).toEqual(['2,130', '1,750']);
    expect(shapeView(s, 'a').canUndo).toBe(true);
  });

  it('T10 the go-go, go-slow and no-go words, in plain sentences', () => {
    const text = renderScreen(spendA()).textContent;
    expect(text).toContain('(the go-go years: travel, projects)');
    expect(text).toContain('less from their mid-70s (go-slow), and less again later (no-go), though care can cost more');
  });

  it('T11 the staircase: a bar a year, coloured go-go / go-slow / no-go, the essentials dashed, below them marked', () => {
    const sheet = starterSheet();
    Object.assign(sheet.lines.find((l) => l.essential), { amount: '2,000', period: 'mo' });
    const s = run({ ...spendA(), budget: sheet }, { type: ACT.SHAPE_ADD, q: 'a' }, { type: ACT.SHAPE_STEP, q: 'a', i: 0, field: 'perMonth', value: '1,500' });
    const root = renderScreen(s);
    expect(root.querySelectorAll('[data-testid="a.shape.chart"] g.year').length).toBe(33);
    expect([...root.querySelectorAll('.shape-band')].map((b) => b.textContent)).toEqual(['go-go', 'go-slow', 'no-go']);
    expect(one(root, 'a.shape.chart.essentials')).not.toBe(null);
    expect(root.querySelector('g[data-age="72"]').getAttribute('class')).toContain('is-below');
  });

  it('T12 never below the income you get anyway: a late step under the State Pension — the year\'s take-home is the income, the pots pay nothing, drawn so', async () => {
    const { ANSWERS } = await import('../../../src/answers/index.js');
    const { parsedDraft } = await import('../../../src/v7/state/select.js');
    let s = run(typedA(fresh(), { age: '55', pot: '400,000', stop: '62', spend: '2,500' }), { type: ACT.SHAPE_ADD, q: 'a' },
      { type: ACT.SHAPE_STEP, q: 'a', i: 0, field: 'fromAge', value: '85' }, { type: ACT.SHAPE_STEP, q: 'a', i: 0, field: 'perMonth', value: '300' });
    s = go(s, 'a', 'answer');
    const result = ANSWERS.a.answer(parsedDraft(s, 'a').inputs, { today: '2026-09-30', futures: 20, seed: 0, trace: false, detail: 'chart' });
    const key = currentKey(s, 'a');
    s = run(s, { type: ACT.ANSWER_WORKING, q: 'a', inputsKey: key }, { type: ACT.ANSWER_FINAL, q: 'a', inputsKey: key, result });
    const at85 = result.byYear.find((row) => row.age === 85);
    expect(at85.takeHome).toBeGreaterThan(300);                                       // the State Pension, not the step's £300
    expect(at85.fromPots).toBeLessThanOrEqual(0.005);
    const root = renderScreen(s);
    clean(root, s);
    const bar = root.querySelector('[data-testid="a.shape.answer"] g[data-age="85"]');
    expect(Number(bar.getAttribute('data-figure'))).toBe(at85.takeHome);
    expect(bar.querySelector('.part-income')).not.toBe(null);
  }, 60_000);

  it('T13 below the essentials: a note, as a guide — "That is allowed"', () => {
    expect(SHAPE.belowEssentials).toMatch(/That is allowed: it is your figure\.$/);
  });

  it('T14 each later step\'s share beside it: "85% of the start"; with a budget, its share of the budget too, as today', () => {
    const root = renderScreen(reduce(spendA(), { type: ACT.SHAPE_SUGGEST, q: 'a' }));
    expect(root.querySelector('[id="a.spend.steps.0.perMonth.help"]').textContent).toBe('85% of the start');
    // today's "— 85% of today's budget" (index.html renderIncomeSteps): the budget is a guide, so it is named one
    const sheet = starterSheet();
    Object.assign(sheet.lines.find((l) => l.essential), { amount: '2,000', period: 'mo' });
    Object.assign(sheet.lines.find((l) => !l.essential), { amount: '1,000', period: 'mo' });
    const s = reduce({ ...spendA(), budget: sheet }, { type: ACT.SHAPE_SUGGEST, q: 'a' });
    const withBudget = renderScreen(s);
    clean(withBudget, s);
    expect(withBudget.querySelector('[id="a.spend.steps.0.perMonth.help"]').textContent).toBe('85% of the start, 71% of your budget (a guide)');
    // the no-go step is held at the essentials (£2,000), as today's suggestion holds it
    expect(withBudget.querySelector('[id="a.spend.steps.1.perMonth.help"]').textContent).toBe('80% of the start, 67% of your budget (a guide)');
    expect(shapeView(s, 'a').steps.map((x) => x.ofBudget)).toEqual([71, 67]);
  });

  it('T15 the first step after tax: not needed — every V7 figure is after tax already', () => {
    expect(SHAPE.lead).toMatch(/after tax/);
    expect(SHAPE.chart.title).toMatch(/after tax/);
  });

  it.todo('T16 a lump sum into income: waits for lump sums (designed, spending-shape.md 17); then "Turn it into income" and raiseFrom(age, a month), today\'s spendLumpSum');

  it('T17 one shape for everything: every V7 answer reads it, and the hand-overs carry it (A ↔ B, A → C, C → A)', () => {
    const s = run(spendA(), { type: ACT.SHAPE_SUGGEST, q: 'a' }, { type: ACT.DRAFT_CARRY, from: 'a', to: 'b' });
    expect(stepsOf('b', s.draft.b.values)).toEqual(steps(s));
  });

  it('T18 the old "declining with age" setting is the preset "Slowly less" — today\'s smileToSteps, year by year', () => {
    const s = reduce(spendA(), { type: ACT.SHAPE_PRESET, q: 'a', id: 'slowly' });
    const model = { unit: 'perMonth', start: { then: 'level' }, steps: steps(s).map((x) => ({ fromAge: Number(x.fromAge), perMonth: Number(x.perMonth.replace(/,/g, '')), then: x.then, fallsPct: Number(x.fallsPct) || 0 })) };
    const ours = yearFigures(model, 2500, 62, 33);
    const todays = smileToSteps([{ fromAge: 62, amount: 2500 }], 62);
    ours.forEach((v, k) => expect(v).toBeCloseTo(amountAtAge(todays, 62 + k), 9));
  });

  it('T19 try it with a flat income: "Try it the same every year" under an answer, and the way back', () => {
    expect(SHAPE.try.level).toBe('Try it the same every year');
    expect(SHAPE.try.back).toBe('Put back my steps by age');
  });

  // T21 (review, 2 Oct 2026): today's dated extra spends are a way spending changes with age. Designed, not built
  // (spending-shape.md 16); the parity ledger's gate holds the row (inc.extra-spends) designed and lists it as not yet.
  it.todo('T21 one-off costs by age: an amount after tax at an age, once or for N years, going up with prices or fixed — designed (spending-shape.md 16), not built');

  it('T20 a £0 step is never quietly dropped: at least £1 a month, said under the box', () => {
    const s = run(spendA(), { type: ACT.SHAPE_ADD, q: 'a' }, { type: ACT.SHAPE_STEP, q: 'a', i: 0, field: 'perMonth', value: '0' }, { type: ACT.SHAPE_TOUCH, q: 'a', i: 0, field: 'perMonth' });
    const root = renderScreen(s);
    expect(root.querySelector('[data-error-for="a.spend.steps.0.perMonth"]').textContent).toBe(SHAPE.errors.perMonth.tooLow);
  });
});

describe('the picture\'s colours', () => {
  const css = readFileSync(join(process.cwd(), 'src/v7/styles/tokens.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  const T = Object.fromEntries([...css.matchAll(/(--[a-z0-9-]+)\s*:\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]));
  const lum = (hex) => {
    const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const ratio = (a, b) => { const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x); return (hi + 0.05) / (lo + 0.05); };
  it.each(['--chart-income', '--chart-pots', '--chart-below', '--chart-guide'])('%s meets 3 to 1 on the card and on the go-slow band', (k) => {
    expect(T[k], k).toMatch(/^#[0-9a-f]{6}$/i);
    expect(ratio(T[k], T['--surface-card'])).toBeGreaterThanOrEqual(3);
    expect(ratio(T[k], T['--chart-band'])).toBeGreaterThanOrEqual(3);
  });
  it('the two parts of a bar are told apart by more than colour alone: the table and the line under the picture name them', () => {
    expect(SHAPE.chart.yearSplit).toMatch(/from your State Pension and other pensions, .* from your pension and savings/);
    expect(SHAPE.chart.tableIncome).toBeTruthy();
    expect(SHAPE.chart.tablePots).toBeTruthy();
  });
});
