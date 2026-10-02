/**
 * The spending shape in the shell (research/v7/spending-shape.md 3.4, 4.3, 4.5; the owner's rule of 2 Oct 2026: at
 * least what today's planner offers — as many steps and tapers, and the go-go, go-slow and no-go years).
 *
 *   - the editing actions (shape/*): add (today's T5 in V7's units), a box as typed, remove and sort with the marks
 *     following their steps, a second press on a step already gone changes nothing;
 *   - "Suggest go-go, go-slow and no-go years" is today's suggestSteps in V7's units (PAR2): the same ages, the same
 *     steps added, the same floor; the younger of a couple; Undo;
 *   - "Slowly less" is today's smileToSteps on a one-step shape, year by year (PAR3); "The same every year";
 *   - every year's figure is today's own amountAtAge (PAR1): falls compound at today's prices, "moves evenly" is a straight
 *     line that reaches the next step as it starts;
 *   - "Move the later steps in proportion";
 *   - the hand-overs (4.5): A ↔ B as typed, A → C as shares, C → A in pounds from C's careful start, rounded down; a flat
 *     source carries "the same every year"; a flat carry is today's, byte for byte;
 *   - a kept draft keeps its steps; the state survives JSON.
 */
import { describe, it, expect, vi } from 'vitest';
vi.mock('../../../src/v7/rail/questions.js', async () => (await import('./_allOpen.js')).allOpen());

import { reduce } from '../../../src/v7/state/reduce.js';
import { A } from '../../../src/v7/state/actions.js';
import { keptDraft } from '../../../src/v7/state/initial.js';
import { loadDraft, saveDraft } from '../../../src/v7/effects/draftStore.js';
import { shapeView, shapeContext } from '../../../src/v7/state/select.js';
import { suggest, preset, yearFigures, ratiosOf, shareOf, rescale, fromShare, todaysSteps } from '../../../src/v7/state/shapeModel.js';
import { stepsOf, newStep, sortedSteps, touchedWithout } from '../../../src/v7/state/shapeDraft.js';
import { amountAtAge, smileToSteps } from '../../../src/services/IncomeSchedule.js';
import { summaryWords } from '../../../src/v7/components/shapeWords.js';
import { suggestSteps } from '../../../src/ui/incomeShapeGraphic.js';
import { starterSheet } from '../../../src/answers/keep/budgetSheet.js';
import { fresh, run, set, typedA, typedB, typedC, answered } from './_open.js';

const add = (q) => ({ type: A.SHAPE_ADD, q });
const step = (q, i, field, value) => ({ type: A.SHAPE_STEP, q, i, field, value });
const touch = (q, i, field) => ({ type: A.SHAPE_TOUCH, q, i, field });
const steps = (s, q = 'a') => stepsOf(q, s.draft[q].values);
const json = (s) => JSON.parse(JSON.stringify(s));

/** A at 62, stopping now? No: 50 today, stopping at 62, £2,500 a month (the design's example). */
const at62 = (o = {}) => typedA(fresh(), { stop: '62', spend: '2,500', ...o });

/** A sheet with essentials of `n` a month (one essential line). */
function withEssentials(state, n) {
  const sheet = starterSheet();
  const line = sheet.lines.find((l) => l.essential);
  Object.assign(line, { amount: String(n), period: 'mo' });
  return { ...state, budget: sheet };
}

describe('editing the steps (shape/*)', () => {
  it('"+ Add a step": 10 years after the stop, then after the last; 10% less to the nearest £10; never at or past the end', () => {
    let s = run(at62(), add('a'));
    expect(steps(s)).toEqual([{ fromAge: '72', perMonth: '2,250', then: 'level', fallsPct: '' }]);
    s = run(s, add('a'), add('a'));
    expect(steps(s).map((x) => [x.fromAge, x.perMonth])).toEqual([['72', '2,250'], ['82', '2,030'], ['92', '1,830']]);
    s = run(s, add('a'));                                  // 102 is past 95, the end for one person: the last year before it
    expect(steps(s)[3].fromAge).toBe('94');
    s = run(s, add('a'));                                  // no year left: the age is left for the person
    expect(steps(s)[4].fromAge).toBe('');
    // C: shares, 10 points less each time
    const c = run(typedC(fresh(), '250,000', '67'), add('c'), add('c'));
    expect(stepsOf('c', c.draft.c.values)).toEqual([
      { fromAge: '77', share: '90', then: 'level', fallsPct: '' }, { fromAge: '87', share: '80', then: 'level', fallsPct: '' }]);
  });

  it('a box as typed; "then" one of the three; a second press on a step already gone changes nothing; draft/set can only empty the list', () => {
    let s = run(at62(), add('a'), step('a', 0, 'fromAge', '75'), step('a', 0, 'perMonth', '2,130'), step('a', 0, 'then', 'falls'), step('a', 0, 'fallsPct', '1.5'));
    expect(steps(s)).toEqual([{ fromAge: '75', perMonth: '2,130', then: 'falls', fallsPct: '1.5' }]);
    expect(() => reduce(s, step('a', 0, 'then', 'rises'))).toThrow();
    expect(() => reduce(s, step('a', 0, 'share', '85'))).toThrow();              // A's steps are amounts
    expect(reduce(s, step('a', 5, 'fromAge', '80'))).toBe(s);
    expect(reduce(s, { type: A.SHAPE_REMOVE, q: 'a', i: 3 })).toBe(s);
    expect(reduce(s, step('a', 0, 'fromAge', '75'))).toBe(s);                    // nothing changed
    const emptied = reduce(s, set('a', 'spend.steps', '75'));                    // a text never becomes a step: it can only empty the list
    expect(steps(emptied)).toEqual([]);
    expect('spend.steps' in emptied.draft.a.values).toBe(false);
    expect(reduce(emptied, set('a', 'spend.steps', ''))).toBe(emptied);
    // the first amount's own "then" and fall are the input list's fields, as typed
    s = run(s, set('a', 'spend.then', 'falls'), set('a', 'spend.fallsPct', '2'));
    expect(s.draft.a.values['spend.then']).toBe('falls');
    expect(s.draft.a.values['spend.fallsPct']).toBe('2');
  });

  it('remove and sort: the marks and the "revealed" boxes go with their steps', () => {
    let s = run(at62(), add('a'), add('a'), add('a'));
    s = run(s, touch('a', 0, 'fromAge'), touch('a', 2, 'perMonth'), touch('a', 2, 'fromAge'));
    const r = reduce(s, { type: A.SHAPE_REMOVE, q: 'a', i: 1 });
    expect(steps(r).map((x) => x.fromAge)).toEqual(['72', '92']);
    expect(r.draft.a.touched.filter((t) => t.startsWith('spend.steps.'))).toEqual(['spend.steps.0.fromAge', 'spend.steps.1.perMonth', 'spend.steps.1.fromAge']);
    expect(touchedWithout('a', ['spend.steps.0.then', 'spend.steps.1.then', 'you.age'], 0)).toEqual(['spend.steps.0.then', 'you.age']);
    // sorted by age once the keyboard leaves the steps; steps with no age keep their place after the rest
    let t = run(s, step('a', 0, 'fromAge', '88'), step('a', 1, 'fromAge', ''));
    t = reduce(t, { type: A.SHAPE_SORT, q: 'a' });
    expect(steps(t).map((x) => x.fromAge)).toEqual(['88', '92', '']);
    expect(steps(t).map((x) => x.fromAge)).toEqual(['88', '92', ''].map(String));
    const u = run(s, step('a', 0, 'fromAge', '90'));
    const sorted = reduce(u, { type: A.SHAPE_SORT, q: 'a' });
    expect(steps(sorted).map((x) => x.fromAge)).toEqual(['82', '90', '92']);
    expect(sorted.draft.a.touched.filter((t) => t.startsWith('spend.steps.'))).toEqual(['spend.steps.1.fromAge', 'spend.steps.2.perMonth', 'spend.steps.2.fromAge']);
    expect(reduce(sorted, { type: A.SHAPE_SORT, q: 'a' })).toBe(sorted);
    expect(sortedSteps('a', [{ fromAge: '70' }, { fromAge: '80' }])).toBe(null);
  });

  it('a step added after "Show" is not marked until it is left or "Show" is pressed again', () => {
    const asked = run(at62(), { type: A.DRAFT_ASK, q: 'a' });
    const s = reduce(asked, add('a'));
    expect(s.draft.a.revealed).toEqual(expect.arrayContaining(['spend.steps.0.fromAge', 'spend.steps.0.perMonth', 'spend.steps.0.then', 'spend.steps.0.fallsPct']));
  });

  it('newStep never reads an answer: it works from the typed boxes alone', () => {
    expect(newStep('a', [], { startAge: null, endAge: 95, first: null })).toEqual({ fromAge: '', perMonth: '', then: 'level', fallsPct: '' });
    expect(newStep('a', [{ fromAge: 'x', perMonth: 'y', then: 'level', fallsPct: '' }], { startAge: 60, endAge: 95, first: 2000 }).fromAge).toBe('');
  });
});

describe('"Suggest go-go, go-slow and no-go years" — today\'s suggestSteps in V7\'s units (PAR2)', () => {
  it('the same ages, the same steps added, the same floor, as today\'s planner (before its £500 rounding)', () => {
    for (const first of [800, 1500, 2500, 4000]) {
      for (const start of [55, 62, 74, 75, 80, 84, 85, 90]) {
        for (const essentials of [0, 1200, 3000]) {
          const ours = suggest('perMonth', first, start, 0, essentials);
          const today = suggestSteps(first * 12, start, essentials * 12);
          expect(ours.steps.map((x) => x.fromAge)).toEqual(today.slice(1).map((x) => x.fromAge));
          const unrounded = [0.85, 0.7].slice(2 - ours.steps.length).map((k) => Math.max(k * first, essentials));
          ours.steps.forEach((x, i) => {
            expect(Math.abs(x.perMonth - unrounded[i])).toBeLessThanOrEqual(5);              // to the nearest £10 a month
            expect(x.perMonth % 10).toBe(0);
            expect(x.then).toBe('level');
          });
          expect(ours.start).toEqual({ then: 'level' });
        }
      }
    }
  });

  it('A at 62, £2,500 a month: £2,130 from 75 and £1,750 from 85, each the same every year; the line says so; Undo', () => {
    const s = run(at62(), { type: A.SHAPE_SUGGEST, q: 'a' });
    expect(steps(s)).toEqual([{ fromAge: '75', perMonth: '2,130', then: 'level', fallsPct: '' }, { fromAge: '85', perMonth: '1,750', then: 'level', fallsPct: '' }]);
    expect(s.draft.a.shapeNote).toEqual({ kind: 'suggest', values: { age75: 75, age85: 85, couple: false } });
    expect(shapeView(s, 'a').canUndo).toBe(true);
    const back = reduce(s, { type: A.SHAPE_UNDO, q: 'a' });
    expect(back.draft.a.values).toEqual(at62().draft.a.values);
    expect(back.draft.a.shapeNote).toEqual({ kind: 'undone' });
    expect(shapeView(back, 'a').canUndo).toBe(false);
    expect(reduce(back, { type: A.SHAPE_UNDO, q: 'a' })).toBe(back);                // one level
  });

  it('never below the budget\'s essentials (and the line names them); the first amount stays the same', () => {
    const s = run(withEssentials(at62(), 2000), set('a', 'spend.then', 'falls'), set('a', 'spend.fallsPct', '1'), { type: A.SHAPE_SUGGEST, q: 'a' });
    expect(steps(s).map((x) => x.perMonth)).toEqual(['2,130', '2,000']);
    expect(s.draft.a.shapeNote.values.floor).toBe(2000);
    expect(s.draft.a.values['spend.then']).toBeUndefined();                      // "stays the same" (not answered)
    expect(s.draft.a.values['spend.fallsPct']).toBeUndefined();
  });

  it('a couple: from when the younger of you is 75 and 85, written as your age; starting after 75 — only 85; after 85 — nothing', () => {
    const couple = run(typedA(fresh(), { age: '60', stop: '66', spend: '3,000' }), set('a', 'household', 'couple'), set('a', 'partner.age', '54'), set('a', 'partner.pot', '0'));
    const s = reduce(couple, { type: A.SHAPE_SUGGEST, q: 'a' });
    expect(steps(s).map((x) => x.fromAge)).toEqual(['81', '91']);
    expect(s.draft.a.shapeNote.values).toMatchObject({ age75: 81, age85: 91, couple: true });
    expect(shapeView(s, 'a').steps.map((x) => x.partnerAge)).toEqual([75, 85]);
    const late = reduce(typedA(fresh(), { age: '70', stop: '75', spend: '2,000' }), { type: A.SHAPE_SUGGEST, q: 'a' });
    expect(steps(late).map((x) => x.fromAge)).toEqual(['85']);
    expect(late.draft.a.shapeNote.values.age75).toBe(null);
    const none = reduce(typedC(fresh(), '250,000', '86'), { type: A.SHAPE_SUGGEST, q: 'c' });
    expect(stepsOf('c', none.draft.c.values)).toEqual([]);
    expect(none.draft.c.shapeNote.values).toMatchObject({ age75: null, age85: null });
  });

  it('with no figure yet it asks for one first; in C the go-slow and no-go years are shares', () => {
    const blank = run(fresh(), set('a', 'you.age', '50'), set('a', 'stop.age', '62'));
    const s = reduce(blank, { type: A.SHAPE_SUGGEST, q: 'a' });
    expect(s.draft.a.values).toEqual(blank.draft.a.values);
    expect(s.draft.a.shapeNote).toEqual({ kind: 'suggestNeedsFirst' });
    const c = reduce(typedC(fresh(), '250,000', '67'), { type: A.SHAPE_SUGGEST, q: 'c' });
    expect(stepsOf('c', c.draft.c.values)).toEqual([{ fromAge: '75', share: '85', then: 'level', fallsPct: '' }, { fromAge: '85', share: '70', then: 'level', fallsPct: '' }]);
  });
});

describe('every year\'s figure is today\'s own amountAtAge (PAR1); "Slowly less" is today\'s smileToSteps (PAR3)', () => {
  it('falls compound at today\'s prices; "moves evenly" reaches the next step as it starts; a level shape is no shape', () => {
    const shape = { unit: 'perMonth', start: { then: 'level' }, steps: [
      { fromAge: 75, perMonth: 3000, then: 'falls', fallsPct: 2 }, { fromAge: 85, perMonth: 2000, then: 'level' }] };
    const go = { unit: 'perMonth', start: { then: 'level' }, steps: [] };
    const first = 3000;
    const y = yearFigures(shape, first, 62, 33);
    expect(y[0]).toBe(3000);
    expect(y[13]).toBe(3000);                                                       // 75: the step starts
    expect(y[14]).toBeCloseTo(3000 * 0.98, 9);
    expect(y[22]).toBeCloseTo(3000 * 0.98 ** 9, 9);                                 // 84
    expect(y[23]).toBe(2000);                                                       // 85
    for (let k = 0; k < 33; k++) expect(y[k]).toBeCloseTo(amountAtAge(todaysSteps(shape, first, 62), 62 + k) * first, 9);
    expect(ratiosOf(go, first, 62, 33)).toBe(null);
    const glide = { unit: 'perMonth', start: { then: 'glides' }, steps: [{ fromAge: 72, perMonth: 2000, then: 'level' }] };
    const g = yearFigures(glide, 3000, 62, 15);
    expect(g[5]).toBe(2500);
    expect(g[10]).toBe(2000);
    expect(g[14]).toBe(2000);
  });

  it('"Slowly less": the same for 5 years, then 1% less each year for 20 years, then the same — today\'s smileToSteps, year by year', () => {
    for (const [first, start] of [[2500, 62], [1800, 55], [4000, 67]]) {
      const p = preset('perMonth', 'slowly', first, start);
      const ours = yearFigures(p, first, start, 40);
      const todays = smileToSteps([{ fromAge: start, amount: first * 12 }], start);
      ours.forEach((v, k) => expect(Math.abs(v * 12 - amountAtAge(todays, start + k))).toBeLessThanOrEqual(6));   // today's rounds each step to £1 a year
      expect(ours[4]).toBe(first);
      expect(Math.abs(ours[5] - first * 0.99)).toBeLessThanOrEqual(0.5);                  // each step to the pound, as today rounds it
      expect(Math.abs(ours[24] - first * 0.99 ** 20)).toBeLessThanOrEqual(0.5);
      expect(ours[30]).toBe(ours[25]);
    }
    const s = run(at62(), { type: A.SHAPE_PRESET, q: 'a', id: 'slowly' });
    expect(steps(s)).toEqual([{ fromAge: '67', perMonth: '2,475', then: 'falls', fallsPct: '1' }, { fromAge: '87', perMonth: '2,045', then: 'level', fallsPct: '' }]);
    expect(s.draft.a.shapeNote).toEqual({ kind: 'slowly' });
    const level = reduce(s, { type: A.SHAPE_PRESET, q: 'a', id: 'level' });
    expect(steps(level)).toEqual([]);
    expect(level.draft.a.values).toEqual(at62().draft.a.values);
    expect(reduce(level, { type: A.SHAPE_UNDO, q: 'a' }).draft.a.values).toEqual(s.draft.a.values);
    expect(() => reduce(s, { type: A.SHAPE_PRESET, q: 'a', id: 'rises' })).toThrow();
  });
});

describe('"Move the later steps in proportion"', () => {
  it('is due once the figure above changes under the steps; each moves to the pound; then it is not due', () => {
    let s = run(at62(), { type: A.SHAPE_SUGGEST, q: 'a' });
    expect(shapeView(s, 'a').rescaleDue).toBe(false);
    s = reduce(s, set('a', 'spend.amount', '3,000'));
    expect(shapeView(s, 'a').rescaleDue).toBe(true);
    s = reduce(s, { type: A.SHAPE_RESCALE, q: 'a' });
    expect(steps(s).map((x) => x.perMonth)).toEqual(['2,556', '2,100']);           // 2,130 × 3,000 ÷ 2,500; 1,750 × 1.2
    expect(shapeView(s, 'a').rescaleDue).toBe(false);
    expect(s.draft.a.shapeNote).toEqual({ kind: 'rescaled' });
    expect(reduce(s, { type: A.SHAPE_RESCALE, q: 'a' })).toBe(s);
    expect(rescale(2130, 2500, 3000)).toBe(2556);
    expect(rescale(2130, 0, 3000)).toBe(null);
  });
});

describe('the hand-overs carry the shape (spending-shape.md 4.5)', () => {
  const shaped = () => run(at62(), { type: A.SHAPE_SUGGEST, q: 'a' }, set('a', 'spend.then', 'falls'), set('a', 'spend.fallsPct', '0.5'));
  it('A → B as typed (the same paths), and the boxes are marked', () => {
    const s = reduce(shaped(), { type: A.DRAFT_CARRY, from: 'a', to: 'b' });
    expect(steps(s, 'b')).toEqual(steps(shaped(), 'a'));
    expect(s.draft.b.values['spend.then']).toBe('falls');
    expect(s.draft.b.values['spend.fallsPct']).toBe('0.5');
    expect(s.draft.b.touched).toEqual(expect.arrayContaining(['spend.then', 'spend.steps.0.fromAge', 'spend.steps.1.perMonth']));
  });
  it('A → C: each later step as a share of the figure, to two places', () => {
    const s = reduce(answered(shaped(), 'a', { status: 'ok', shown: { age: 62 }, saving: [{ payIn: { total: 0 } }], basis: { detail: 'chart' } }), { type: A.DRAFT_CARRY, from: 'a', to: 'c' });
    expect(stepsOf('c', s.draft.c.values)).toEqual([{ fromAge: '75', share: '85.2', then: 'level', fallsPct: '' }, { fromAge: '85', share: '70', then: 'level', fallsPct: '' }]);
    expect(s.draft.c.values['shape.then']).toBe('falls');
    expect(shareOf(2130, 2500)).toBe(85.2);
    expect(shareOf(1000, 3000)).toBe(33.33);
  });
  it('C → A: each step in pounds from C\'s careful start, rounded down; the box takes the careful start', () => {
    let c = run(typedC(fresh(), '250,000', '67'), { type: A.SHAPE_SUGGEST, q: 'c' }, { type: A.SHAPE_STEP, q: 'c', i: 0, field: 'share', value: '85.5' });
    c = answered(c, 'c', { status: 'ok', monthly: { careful: 1333, middling: 1500, good: 1700 }, basis: {} });
    const s = reduce(c, { type: A.DRAFT_CARRY, from: 'c', to: 'a' });
    expect(s.draft.a.values['spend.amount']).toBe('1,333');
    expect(steps(s)).toEqual([{ fromAge: '75', perMonth: '1,139', then: 'level', fallsPct: '' }, { fromAge: '85', perMonth: '933', then: 'level', fallsPct: '' }]);
    expect(fromShare(85.5, 1333)).toBe(1139);                                       // 1,139.7 → down to the pound
  });
  it('a flat source carries "the same every year"; a flat carry into a flat draft is today\'s, byte for byte', () => {
    const b = run(typedB(), add('b'));                                             // B has a step of its own; A is flat
    const suggestedB = run(b, { type: A.SHAPE_SUGGEST, q: 'b' });
    expect(suggestedB.draft.b.shapeUndo).toBeTruthy();
    const cleared = reduce({ ...at62(), draft: { ...at62().draft, b: suggestedB.draft.b } }, { type: A.DRAFT_CARRY, from: 'a', to: 'b' });
    expect(steps(cleared, 'b')).toEqual([]);
    expect(cleared.draft.b.shapeUndo).toBeUndefined();                              // its Undo went with the shape it had
    expect('spend.steps' in cleared.draft.b.values).toBe(false);
    // flat into flat: exactly what the carry wrote before the shape existed (no shape key, no extra mark)
    const flat = reduce(at62(), { type: A.DRAFT_CARRY, from: 'a', to: 'b' });
    expect(Object.keys(flat.draft.b.values).some((p) => /^spend\.(then|fallsPct|steps)/.test(p))).toBe(false);
    expect(flat.draft.b.touched.some((p) => /^spend\.(then|fallsPct|steps)/.test(p))).toBe(false);
  });
});

describe('what the block draws (select.js shapeView)', () => {
  it('closed by default; the same every year; the start is the stop; the end is the plan\'s', () => {
    const v = shapeView(at62(), 'a');
    expect(v).toMatchObject({ open: false, shaped: false, startAge: 62, startKind: 'stop', endAge: 95, first: 2500, then: 'level', steps: [] });
    expect(v.chart.years).toHaveLength(33);
    expect(v.chart.years.every((y) => y.value === 2500)).toBe(true);
    expect(shapeView(fresh(), 'z')).toBe(null);
  });
  it('the summary in words; each later step\'s share of the start; years under the essentials', () => {
    const s = run(withEssentials(at62(), 1800), { type: A.SHAPE_SUGGEST, q: 'a' });
    const v = shapeView(s, 'a');
    expect(summaryWords(v)).toBe('Yes, as you set it: £2,500 a month from 62, £2,130 from 75 and £1,800 from 85.');
    expect(v.steps.map((x) => x.ofStart)).toEqual([85, 72]);
    expect(v.below).toBe(null);
    const lower = run(s, step('a', 1, 'perMonth', '1,500'));
    expect(shapeView(lower, 'a').below).toEqual({ age: 85, amount: 1800 });
    expect(shapeView(lower, 'a').chart.years.find((y) => y.age === 85).below).toBe(true);
    const falls = run(s, step('a', 0, 'then', 'falls'), step('a', 0, 'fallsPct', '2'));
    expect(summaryWords(shapeView(falls, 'a'))).toBe('Yes, as you set it: £2,500 a month from 62; £2,130 from 75, falling 2% a year; and £1,800 from 85.');
    expect(summaryWords(shapeView(at62(), 'a'))).toBe('No: the same every year, going up with prices.');
  });
  it('stopping now, "show me ages", a couple apart: where the shape starts, in your age', () => {
    expect(shapeContext(typedA(fresh(), { age: '62', stop: '62' }), 'a')).toMatchObject({ startAge: 62, startKind: 'now' });
    const ages = run(fresh(), set('a', 'you.age', '50'), set('a', 'stop.kind', 'ages'));
    expect(shapeContext(ages, 'a')).toMatchObject({ startAge: null, startKind: 'ages' });
    const apart = run(typedA(fresh(), { age: '55', stop: '60' }), set('a', 'household', 'couple'), set('a', 'partner.age', '53'), set('a', 'partner.pot', '0'),
      set('a', 'partner.stop.kind', 'age'), set('a', 'partner.stop.age', '55'));
    expect(shapeContext(apart, 'a')).toMatchObject({ startAge: 57, startKind: 'apart', gap: 2, olderBy: 2, endAge: 97 });
  });
});

describe('kept across a reload; the state survives JSON', () => {
  it('keptDraft and the draft store keep the steps, cleaned; never anything else', () => {
    const s = run(at62(), { type: A.SHAPE_SUGGEST, q: 'a' });
    const k = keptDraft({ a: { values: { ...s.draft.a.values, 'spend.steps': [...steps(s), 'x', { fromAge: 80, perMonth: '1', then: 'up', extra: 1 }] } } }, 'a');
    expect(stepsOf('a', k.values)).toEqual([...steps(s), { fromAge: '80', perMonth: '1', then: 'level', fallsPct: '' }]);
    const store = new Map();
    const storage = { getItem: (key) => (store.has(key) ? store.get(key) : null), setItem: (key, v) => store.set(key, v), removeItem: (key) => store.delete(key) };
    expect(saveDraft(storage, { ...s.draft, a: { ...s.draft.a, touched: ['spend.steps.0.fromAge', 'nope'] } })).toBe(true);
    const back = loadDraft(storage);
    expect(stepsOf('a', back.a.values)).toEqual(steps(s));
    expect(back.a.touched).toEqual(['spend.steps.0.fromAge']);
  });
  it('"Try it the same every year", then a reload: "Put back my steps by age" still puts them back (the Undo is kept, cleaned)', () => {
    // today's "Try a strategy … with a flat income" never touches the saved shape; V7's try edits what is typed, so its way
    // back must survive the tab being reloaded, or a person's steps would be lost
    const s = run(at62(), { type: A.SHAPE_SUGGEST, q: 'a' }, step('a', 0, 'then', 'falls'), step('a', 0, 'fallsPct', '1.5'), { type: A.SHAPE_PRESET, q: 'a', id: 'level' });
    expect(steps(s)).toEqual([]);
    const store = new Map();
    const storage = { getItem: (key) => (store.has(key) ? store.get(key) : null), setItem: (key, v) => store.set(key, v), removeItem: (key) => store.delete(key) };
    const dirty = { ...s.draft.a, shapeUndo: { values: { ...s.draft.a.shapeUndo.values, 'spend.steps': [...s.draft.a.shapeUndo.values['spend.steps'], 'x'], 'you.age': '99' }, extra: 1 },
      shapeNote: { kind: 'level', values: { junk: 'x' }, more: 1 }, shapeBase: 2500 };
    expect(saveDraft(storage, { ...s.draft, a: dirty })).toBe(true);
    const back = loadDraft(storage);
    expect(back.a.shapeUndo).toEqual({ values: { 'spend.steps': [{ fromAge: '75', perMonth: '2,130', then: 'falls', fallsPct: '1.5' }, { fromAge: '85', perMonth: '1,750', then: 'level', fallsPct: '' }] } });
    expect(back.a.shapeNote).toEqual({ kind: 'level', values: {} });
    expect(back.a.shapeBase).toBe(2500);
    const reloaded = { ...fresh(), draft: { ...fresh().draft, a: keptDraft(back, 'a') } };
    const put = reduce({ ...reloaded, route: s.route }, { type: A.SHAPE_UNDO, q: 'a' });
    expect(steps(put)).toEqual([{ fromAge: '75', perMonth: '2,130', then: 'falls', fallsPct: '1.5' }, { fromAge: '85', perMonth: '1,750', then: 'level', fallsPct: '' }]);
    // nothing that is not a shape's: a note of another kind, or an Undo of the wrong form, is dropped
    saveDraft(storage, { ...s.draft, a: { ...s.draft.a, shapeUndo: 'x', shapeNote: { kind: 'nope' }, shapeBase: 'x' } });
    const none = loadDraft(storage);
    expect(['shapeUndo', 'shapeNote', 'shapeBase'].some((k) => k in none.a)).toBe(false);
  });
  it('a state with a shape, its Undo and its line survives JSON as it is', () => {
    const s = run(at62(), { type: A.SHAPE_SUGGEST, q: 'a' }, add('a'), { type: A.UI_TOGGLE, id: 'shape' });
    expect(json(s)).toEqual(s);
    const replaced = reduce(fresh(), { type: A.STATE_REPLACE, state: json(s) });
    expect(replaced.draft.a).toEqual(s.draft.a);
    expect(replaced.ui.open).toContain('shape');
  });
});
