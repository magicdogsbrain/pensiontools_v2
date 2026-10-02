/**
 * The spending shape's model (src/answers/shared/shape.js; research/v7/spending-shape.md 3, 9.2): the same meaning as
 * today's planner, read from today's own functions — never a copy of them.
 *
 *   PAR1  ratiosOf × the first amount IS IncomeSchedule.amountAtAge on the same steps, at every age (falls, moves evenly,
 *         steps in force from before the start)
 *   PAR2  suggest is today's suggestSteps (src/ui/incomeShapeGraphic.js) in V7's units: the same ages, the same steps added,
 *         the same floor-then-round order (to £10 a month for £500 a year)
 *   PAR3  "Slowly less" is today's smileToSteps on a one-step shape, year by year
 *   PAR4  every capability of today's income shape (spending-shape.md section 1, T1–T21) is named by a test here or in
 *         the other shape tests, or (screens) by the screen package — this file checks that the list is complete
 * And each function on its own: startFactor, isTrivial, rescale, shareOf, stepsAt, the two roundings.
 * Made-up figures only.
 */
import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { amountAtAge, smileToSteps } from '../../../src/services/IncomeSchedule.js';
import { suggestSteps } from '../../../src/ui/incomeShapeGraphic.js';
import {
  SHAPE_LIMITS, THEN, ratioOf, todaysSteps, startFactor, ratiosOf, isTrivial, suggest, slowlyLess, rescale, shareOf, stepsAt, downMonthly, nearMonthly
} from '../../../src/answers/shared/shape.js';

const SEED = 20261002;
const shapeArb = (unit) => fc.record({
  start: fc.record({ then: fc.constantFrom('level', 'falls', 'glides'), fallsPct: fc.integer({ min: 1, max: 40 }).map((q) => q / 4) }),
  steps: fc.uniqueArray(fc.integer({ min: 56, max: 99 }), { minLength: 0, maxLength: 6 }).chain((ages) => fc.tuple(...[...ages].sort((a, b) => a - b).map((fromAge, i, all) => fc.record({
    fromAge: fc.constant(fromAge),
    amount: unit === 'share' ? fc.integer({ min: 100, max: 50000 }).map((x) => x / 100) : fc.integer({ min: 1, max: 50000 }),
    then: fc.constantFrom(...(i === all.length - 1 ? ['level', 'falls'] : ['level', 'falls', 'glides'])),
    fallsPct: fc.integer({ min: 1, max: 40 }).map((q) => q / 4)
  }))))
}).map(({ start, steps }) => ({
  unit,
  start: start.then === 'falls' ? { then: 'falls', fallsPct: start.fallsPct } : { then: steps.length ? start.then : 'level' },
  steps: steps.map((s) => ({ fromAge: s.fromAge, [unit]: s.amount, then: s.then, ...(s.then === 'falls' ? { fallsPct: s.fallsPct } : {}) }))
}));

/** Today's step list written by hand from a shape in £ a month (the planner's own fields), the first at the start. */
function todayByHand(shape, first, startAge) {
  const later = shape.steps.map((s) => ({ fromAge: s.fromAge, amount: s.perMonth, decline: s.then === 'falls' ? s.fallsPct : 0, glideToNext: s.then === 'glides' }));
  const head = later.some((s) => s.fromAge <= startAge) ? [] : [{ fromAge: startAge, amount: first, decline: shape.start.then === 'falls' ? shape.start.fallsPct : 0, glideToNext: shape.start.then === 'glides' }];
  return [...head, ...later];
}

describe('PAR1 — each year\'s figure is today\'s amountAtAge, the same function', () => {
  it('£ a month: ratiosOf × the figure in force at the start = amountAtAge on today\'s own steps, at every age (fast-check)', () => {
    fc.assert(fc.property(shapeArb('perMonth'), fc.integer({ min: 100, max: 50000 }), fc.integer({ min: 50, max: 80 }), (shape, first, startAge) => {
      const years = 100 - startAge;
      const list = todayByHand(shape, first, startAge);
      const a0 = amountAtAge(list, startAge);
      const r = ratiosOf(shape, first, startAge, years);
      for (let y = 0; y < years; y++) {
        const want = amountAtAge(list, startAge + y);
        const got = (r ? r[y] : 1) * a0;
        expect(Math.abs(got - want)).toBeLessThanOrEqual(1e-9 * Math.max(1, want));
      }
      // the figure in force at the start, in units of the first
      expect(Math.abs(startFactor(shape, first, startAge) * first - a0)).toBeLessThanOrEqual(1e-9 * Math.max(1, a0));
    }), { numRuns: 300, seed: SEED });
  });

  it('shares: one division of the two numbers given, so equal shares give the same bits whichever question they came from', () => {
    const inShares = { unit: 'share', start: { then: 'level' }, steps: [{ fromAge: 75, share: 85, then: 'falls', fallsPct: 1 }, { fromAge: 85, share: 70, then: 'level' }] };
    const inPounds = { unit: 'perMonth', start: { then: 'level' }, steps: [{ fromAge: 75, perMonth: 2125, then: 'falls', fallsPct: 1 }, { fromAge: 85, perMonth: 1750, then: 'level' }] };
    expect(ratioOf(inShares, inShares.steps[0], 1)).toBe(ratioOf(inPounds, inPounds.steps[0], 2500));
    expect(ratiosOf(inShares, 1, 62, 33)).toEqual(ratiosOf(inPounds, 2500, 62, 33));
  });

  it('falls compound at today\'s prices (1% a year: 0.99, 0.9801 …); moves evenly is a straight line arriving as the next step starts', () => {
    const falls = { unit: 'perMonth', start: { then: 'falls', fallsPct: 1 }, steps: [] };
    const r = ratiosOf(falls, 2000, 62, 5);
    expect(r).toEqual([1, 0.99, Math.pow(0.99, 2), Math.pow(0.99, 3), Math.pow(0.99, 4)]);
    const glides = { unit: 'perMonth', start: { then: 'glides' }, steps: [{ fromAge: 66, perMonth: 1000, then: 'level' }] };
    expect(ratiosOf(glides, 2000, 62, 6)).toEqual([1, 0.875, 0.75, 0.625, 0.5, 0.5]);
  });

  it('a later step at or before the start is in force from it, its fall counting from its own age (A\'s row past a step)', () => {
    const shape = { unit: 'perMonth', start: { then: 'level' }, steps: [{ fromAge: 75, perMonth: 2000, then: 'falls', fallsPct: 2 }] };
    expect(startFactor(shape, 2500, 77)).toBeCloseTo(0.8 * 0.98 * 0.98, 12);
    expect(startFactor(shape, 2500, 74)).toBe(1);
    expect(todaysSteps(shape, 2500, 77).map((s) => s.fromAge)).toEqual([75]);
    const r = ratiosOf(shape, 2500, 77, 3);
    [1, 0.98, 0.98 * 0.98].forEach((x, i) => expect(r[i]).toBeCloseTo(x, 12));
  });

  it('a shape that never changes is no shape: ratiosOf null, isTrivial true', () => {
    const level = { unit: 'perMonth', start: { then: 'level' }, steps: [{ fromAge: 75, perMonth: 2500, then: 'level' }] };
    expect(ratiosOf(level, 2500, 62, 33)).toBeNull();
    expect(isTrivial(level, 2500)).toBe(true);
    expect(isTrivial({ unit: 'share', start: { then: 'level' }, steps: [{ fromAge: 75, share: 100, then: 'level' }] }, 1)).toBe(true);
    expect(isTrivial({ ...level, start: { then: 'falls', fallsPct: 0.25 } }, 2500)).toBe(false);
    expect(isTrivial({ ...level, steps: [{ fromAge: 75, perMonth: 2499, then: 'level' }] }, 2500)).toBe(false);
    // a step past the plan's years: no change inside it
    expect(ratiosOf({ ...level, steps: [{ fromAge: 99, perMonth: 1000, then: 'level' }] }, 2500, 62, 33)).toBeNull();
  });
});

describe('PAR2 — "Suggest go-go, go-slow and no-go years" is today\'s suggestSteps', () => {
  it('the same ages, the same steps added, 85% and 70% never below the essentials, floor then round (today: £500 a year; V7: £10 a month)', () => {
    fc.assert(fc.property(fc.integer({ min: 500, max: 10000 }), fc.integer({ min: 50, max: 90 }), fc.option(fc.integer({ min: 100, max: 8000 }), { nil: null }), (first, startAge, essentials) => {
      const today = suggestSteps(first * 12, startAge, essentials === null ? 0 : essentials * 12);
      const mine = suggest('perMonth', first, startAge, 0, essentials);
      expect(mine.shape.steps.map((s) => s.fromAge)).toEqual(today.slice(1).map((s) => s.fromAge));
      mine.shape.steps.forEach((s, k) => {
        const share = s.fromAge === 75 ? 0.85 : 0.7;
        const floored = Math.max(share * first, essentials || 0);
        expect(s.perMonth).toBe(Math.round(floored / 10) * 10);                       // V7's rounding of the same floor
        expect(Math.abs(s.perMonth * 12 - today[k + 1].amount)).toBeLessThanOrEqual(250 + 60);  // today's £500 a year, our £10 a month
        expect(s.then).toBe('level');
      });
      expect(mine.shape.start).toEqual({ then: 'level' });
    }), { numRuns: 200, seed: SEED });
  });

  it('a couple: from 75 and 85 of the younger of you, written as your age; C: shares, no floor; after 85 nothing', () => {
    const couple = suggest('perMonth', 2500, 66, 6, null);
    expect(couple.shape.steps.map((s) => s.fromAge)).toEqual([81, 91]);
    expect([couple.age75, couple.age85]).toEqual([81, 91]);
    const c = suggest('share', null, 67, 0, 3000);
    expect(c.shape.steps).toEqual([{ fromAge: 75, share: 85, then: 'level' }, { fromAge: 85, share: 70, then: 'level' }]);
    expect(c.floor).toBeNull();
    expect(suggest('perMonth', 2500, 86).shape.steps).toEqual([]);
    expect(suggest('perMonth', 2500, 80).shape.steps.map((s) => s.fromAge)).toEqual([85]);
    expect(suggest('perMonth', 2500, 62, 0, 2300).shape.steps.map((s) => s.perMonth)).toEqual([2300, 2300]);
  });
});

describe('PAR3 — "Slowly less" is today\'s old "declining with age", baked by smileToSteps', () => {
  it('the same for 5 years, then 1% less each year for 20 years, then the same: year for year as smileToSteps', () => {
    for (const [first, startAge] of [[2500, 62], [1830, 55], [4000, 67]]) {
      const shape = slowlyLess('perMonth', first, startAge);
      const today = smileToSteps([{ fromAge: startAge, amount: first }], startAge);
      const r = ratiosOf(shape, first, startAge, 40);
      for (let y = 0; y < 40; y++) {
        const want = amountAtAge(today, startAge + y);
        expect(Math.abs(r[y] * first - want), `${first} at ${startAge + y}`).toBeLessThanOrEqual(1e-9 * want);
      }
      expect(r[4]).toBe(1);
      expect(r[5]).toBe(Math.round(first * 0.99) / first);                 // smileToSteps rounds each step to the pound
      expect(r[30]).toBeCloseTo(r[25], 12);
    }
    const c = slowlyLess('share', null, 67);
    expect(c.steps.map((s) => s.share)).toEqual([99, Math.round(10000 * Math.pow(0.99, 20)) / 100]);
  });
});

describe('the other functions of the model', () => {
  it('rescale: every later amount in proportion, to the pound; shares do not move', () => {
    const shape = { unit: 'perMonth', start: { then: 'level' }, steps: [{ fromAge: 75, perMonth: 2130, then: 'level' }, { fromAge: 85, perMonth: 1750, then: 'falls', fallsPct: 1 }] };
    expect(rescale(shape, 2500, 3000).steps).toEqual([{ fromAge: 75, perMonth: 2556, then: 'level' }, { fromAge: 85, perMonth: 2100, then: 'falls', fallsPct: 1 }]);
    const c = { unit: 'share', start: { then: 'level' }, steps: [{ fromAge: 75, share: 85, then: 'level' }] };
    expect(rescale(c, 1, 2)).toBe(c);
  });

  it('shareOf: to two places', () => {
    expect(shareOf(2130, 2500)).toBe(85.2);
    expect(shareOf(1, 3)).toBe(33.33);
    expect(shareOf(2130, 0)).toBeNull();
  });

  it('downMonthly and nearMonthly: £10 from £1,000, £5 below — careful figures down, the rest to the nearest', () => {
    expect([downMonthly(2379.99), downMonthly(999.99), downMonthly(1000), downMonthly(4.99)]).toEqual([2370, 995, 1000, 0]);
    expect([nearMonthly(2375), nearMonthly(997.4), nearMonthly(1004.9)]).toEqual([2380, 995, 1000]);
  });

  it('stepsAt: the start, each later step in the plan, where a fall ends, where moving evenly arrives — at a household amount', () => {
    const shape = { unit: 'perMonth', start: { then: 'falls', fallsPct: 1 }, steps: [{ fromAge: 75, perMonth: 2000, then: 'glides' }, { fromAge: 85, perMonth: 1500, then: 'level' }, { fromAge: 99, perMonth: 900, then: 'level' }] };
    const list = stepsAt(shape, 2500, 62, 33, 2300, (n) => n);
    expect(list.map((s) => [s.fromAge, s.then])).toEqual([[62, 'falls'], [75, 'glides'], [85, 'level']]);   // 99 is past the plan
    expect(list[0]).toMatchObject({ perMonth: 2300, fallsPct: 1, endAge: 74 });
    expect(list[0].endPerMonth).toBeCloseTo(2300 * Math.pow(0.99, 12), 9);
    expect(list[1].perMonth).toBeCloseTo(2300 * 0.8, 9);
    expect(list[1]).toMatchObject({ endAge: 85 });
    expect(list[1].endPerMonth).toBeCloseTo(2300 * 0.6, 9);
    expect(list[2].perMonth).toBeCloseTo(2300 * 0.6, 9);
    expect(SHAPE_LIMITS.fallsPct).toEqual({ min: 0.25, max: 10, step: 0.25 });
    expect(THEN).toEqual(['level', 'falls', 'glides']);
  });
});

describe('PAR4 — every capability of today\'s income shape has a home that is tested', () => {
  it('section 1\'s T1–T21 are each named in a test title of the shape tests (or left to the screen package, or to the parity gate, by name)', () => {
    const design = readFileSync(resolve(process.cwd(), 'research/v7/spending-shape.md'), 'utf8');
    const ids = [...design.matchAll(/^\| (T\d+) \|/gm)].map((m) => m[1]);
    expect(ids).toEqual(Array.from({ length: 21 }, (_, i) => `T${i + 1}`));
    const dir = resolve(process.cwd(), 'tests/v7/shared');
    const text = readdirSync(dir).filter((f) => /^shape.*\.test\.js$/.test(f)).map((f) => readFileSync(resolve(dir, f), 'utf8')).join('\n')
      + readFileSync(resolve(process.cwd(), 'tests/v7/keep/planSeed.shape.test.js'), 'utf8');
    // The capabilities the screens carry (the editor's buttons, the chart, the words beside the steps) are the screen package's
    // (spending-shape.md 10, S5): named here so the list stays whole, and tested there.
    const SCREEN = { T5: 'add a step', T6: 'remove a step', T7: 'start from my budget', T8: 'or a number', T10: 'the words', T11: 'the staircase chart', T13: 'below essentials', T14: 'share beside each step', T15: 'first step after tax (not needed)', T16: 'lump sum into income (waits for lump sums: designed, spending-shape.md 17)',
      // added by the review of 2 Oct 2026: designed (spending-shape.md 16), not built — tests/v7/parity/ledger.test.js holds its row
      T21: 'one-off costs by age (designed, not built: the parity gate holds inc.extra-spends)' };
    const missing = ids.filter((id) => !SCREEN[id] && !new RegExp(`\\b${id}\\b`).test(text));
    expect(missing).toEqual([]);
  });

  it('T1 any number of steps by age, T3 falls within a step (0.25% to 10%), T4 moves evenly to the next, T20 no £0 step — the model', () => {
    const many = { unit: 'perMonth', start: { then: 'level' }, steps: Array.from({ length: 30 }, (_, i) => ({ fromAge: 63 + i, perMonth: 2500 - 10 * (i + 1), then: 'level' })) };
    expect(ratiosOf(many, 2500, 62, 33).filter((x, y, a) => y > 0 && x !== a[y - 1]).length).toBe(30);
    const ten = ratiosOf({ unit: 'perMonth', start: { then: 'falls', fallsPct: 10 }, steps: [] }, 2000, 62, 3);
    expect(ten[2]).toBeCloseTo(0.81, 12);
    expect(SHAPE_LIMITS.perMonth.min).toBe(1);   // a step is at least £1 a month (1% in C): none is quietly dropped (T20)
    expect(SHAPE_LIMITS.share.min).toBe(1);
  });

  it('T9 suggest, T18 the old declining setting — PAR2 and PAR3 above; T2 a step is the total, T12 never below the income you get anyway, T17 one shape for everything, T19 try a flat income — shape.engine.test.js and planSeed.shape.test.js', () => {
    expect(typeof suggest).toBe('function');
    expect(typeof slowlyLess).toBe('function');
  });
});
