/**
 * 7.8.0 step 3: the figures at each weighted level.
 *   - weightedThresholdReference (bandReference.js): the plain bisection on the £10 grid, every future run at every probe;
 *   - solveLevels (band.js createBandSolver): the fast path, held to the reference on 200 futures (C's futures, and D's
 *     lives through the stop runner);
 *   - withinWeighted / lastsWithinWeighted / potNeededWeighted (stopAt.js), B's pot and pay-in, held to plain bisection.
 * The weighted path is reached with env.weighted (SUCCESS.weighted ships false until the pins move). All fictional.
 */
import { describe, it, expect } from 'vitest';
import { checkInputs } from '../../../src/answers/shared/validate.js';
import { SCHEMA_C } from '../../../src/answers/c/schema.js';
import { SCHEMA_D } from '../../../src/answers/d/schema.js';
import { SCHEMA_B } from '../../../src/answers/b/schema.js';
import { toHousehold as toHouseholdC } from '../../../src/answers/c/toHousehold.js';
import { toHousehold as toHouseholdD } from '../../../src/answers/d/toHousehold.js';
import { toHousehold as toHouseholdB } from '../../../src/answers/b/toHousehold.js';
import { enginePlan } from '../../../src/answers/shared/toEngine.js';
import { futuresList } from '../../../src/answers/shared/futures.js';
import { livesList } from '../../../src/answers/shared/lives.js';
import { createFastRunner } from '../../../src/answers/shared/fastEngine.js';
import { createBandSolver, bandIndexes } from '../../../src/answers/shared/band.js';
import { weightedThresholdReference } from '../../../src/answers/shared/bandReference.js';
import {
  stopAtPlan, createStopRunner, verdictAt, withinWeighted, lastsWithinWeighted, lastsWithin, potNeededAt, potNeededWeighted,
  potNeededWeightedPlain, leastPayIn, runnerAtPayIns
} from '../../../src/answers/shared/stopAt.js';
import { weigherOf, weightedFails, failsBound } from '../../../src/answers/shared/weigh.js';
import { LEVEL_FAILS20, WEIGHT_ONE, passes } from '../../../src/answers/shared/rules.js';

const TODAY = '2026-11-11';
const LEVELS = ['careful', 'balanced', 'bold'];
const ON = (n) => ({ today: TODAY, futures: n, seed: 0, weighted: true });

/** Nobody dies: every weight one whole future. */
const IMMORTAL = { scale: 1e7, firstBirthYear: 1960, lastBirthYear: 1960, ageTo: 200, m: { 1960: [18, 0] }, f: { 1960: [18, 0] } };

/** C's plan, futures and a fast runner for some checked inputs. */
function cCase(inputs, sexes, n, envMore = {}) {
  const env = { ...ON(n), ...envMore };
  const checked = checkInputs(SCHEMA_C, inputs, env);
  expect(checked.ok, JSON.stringify(checked.errors)).toBe(true);
  const { household } = toHouseholdC(checked.inputs, env);
  const plan = enginePlan(household, env);
  const futures = futuresList(n, plan.years, env);
  return { plan, futures, weigher: weigherOf(plan, sexes, env), run: () => createFastRunner(plan, futures).run };
}

/** D's stop plan on its lives (today's drawing years), the stop runner, and the weights. */
function dCase(inputs, n) {
  const env = ON(n);
  const checked = checkInputs(SCHEMA_D, inputs, env);
  expect(checked.ok, JSON.stringify(checked.errors)).toBe(true);
  const ins = checked.inputs;
  const { household } = toHouseholdD(ins, env);
  const younger = Math.min(ins.you.age, ins.partner ? ins.partner.age : Infinity);
  const lives = livesList(n, ins.endAge - younger, env);
  const sp = stopAtPlan(household, ins.you.age, env, lives);
  return { sp, ins, env, weigher: weigherOf(sp.plan, ins, env) };
}

const C_CASES = {
  'Alex, 66, a man, £400,000': [{ you: { pot: 400000, age: 66 } }, { you: { sex: 'male' } }],
  'Alex, followed on to 101': [{ you: { pot: 400000, age: 66 }, endAge: 101 }, { you: { sex: 'male' } }],
  'Alex 66 and Sam 63, women': [{ household: 'couple', you: { pot: 300000, age: 66 }, partner: { age: 63, pot: 150000 }, endAge: 104 }, {}],
  'Sam, 58, £250,000, from 58': [{ you: { pot: 250000, age: 58 }, endAge: 102 }, {}],
  'Sam, 70, a small pot': [{ you: { pot: 60000, age: 70 }, endAge: 100 }, {}],
  'Alex, 60, cautious': [{ you: { pot: 120000, age: 60 }, risk: 'cautious', endAge: 103 }, { you: { sex: 'male' } }]
};

describe('the weighted levels: the fast path is the reference', () => {
  it.each(Object.entries(C_CASES))('%s: the same three amounts on 200 futures, in order, never below the count', (name, [inputs, sexes]) => {
    const c = cCase(inputs, sexes, 200);
    const ref = weightedThresholdReference(c.plan, c.futures, c.weigher, LEVELS, { run: c.run() });
    const solver = createBandSolver(c.plan, c.futures);
    const fast = solver.solveLevels(c.weigher);
    for (const l of LEVELS) {
      expect(fast[l].k, `${name} ${l}`).toBe(ref[l].k);
      expect(fast[l].capped).toBe(ref[l].capped);
      expect(fast[l].floorHit).toBe(false);
      expect(fast[l].monthly).toBe(fast[l].k * 10);
      // the reference's own sum at its figure passes; one step up does not (unless capped)
      expect(passes(ref[l].sumW, 200, LEVEL_FAILS20[l])).toBe(true);
      expect(solver.weightedFailsAt(c.weigher, fast[l].k)).toBe(ref[l].sumW);
      if (!ref[l].capped) expect(passes(solver.weightedFailsAt(c.weigher, fast[l].k + 1), 200, LEVEL_FAILS20[l])).toBe(false);
    }
    // monthly: Careful ≤ Balanced ≤ Bold; each at least the count's own figure at floor(t·n/20) failures
    expect(fast.careful.k).toBeLessThanOrEqual(fast.balanced.k);
    expect(fast.balanced.k).toBeLessThanOrEqual(fast.bold.k);
    // (the count of failures only rises with k, so the count's own figure is at or below the weighted one exactly when one
    // step above the weighted figure the count no longer passes)
    const count = createBandSolver(c.plan, c.futures);
    for (const l of LEVELS) {
      const k = fast[l].k;
      expect(k >= count.kMax || count.failsAt(k + 1) > failsBound(200, LEVEL_FAILS20[l]), `${name} ${l}`).toBe(true);
    }
  });

  it('D through the stop runner (a retired couple, 68 and 64): the fast path is the reference on 200 lives', () => {
    const d = dCase({ household: 'couple', you: { age: 68, pot: 280000, statePension: { kind: 'full' }, taxFreeTaken: 'yes' },
      partner: { age: 64, pot: 90000, statePension: { kind: 'full' }, taxFreeTaken: 'no' }, savings: 20000, spend: { kind: 'amount', amount: 2600 } }, 200);
    const runner = createStopRunner(d.sp);
    const ref = weightedThresholdReference(runner.plan, d.sp.lives, d.weigher, LEVELS, { run: runner.run, configsFor: runner.configsFor });
    const r2 = createStopRunner(d.sp);
    const fast = createBandSolver(r2.plan, d.sp.lives, { runner: r2, configsFor: r2.configsFor }).solveLevels(d.weigher);
    for (const l of LEVELS) expect(fast[l].k, l).toBe(ref[l].k);
    expect(fast.careful.k <= fast.balanced.k && fast.balanced.k <= fast.bold.k).toBe(true);
  });

  it('the reference on today\'s engine run by run equals it on the fast engine (and the fast path), at 20 futures', () => {
    const c = cCase({ you: { pot: 180000, age: 64 } }, {}, 20);
    const slow = weightedThresholdReference(c.plan, c.futures, c.weigher, LEVELS);
    const quick = weightedThresholdReference(c.plan, c.futures, c.weigher, LEVELS, { run: c.run() });
    const fast = createBandSolver(c.plan, c.futures).solveLevels(c.weigher);
    for (const l of LEVELS) { expect(slow[l].k).toBe(quick[l].k); expect(fast[l].k).toBe(quick[l].k); expect(slow[l].sumW).toBe(quick[l].sumW); }
  });

  it('the same figures, weights and sums on Node 20 and Node 24 (whole-number sums; pinned from this implementation, 11 Nov 2026)', () => {
    const c = cCase(...C_CASES['Alex, 66, a man, £400,000'], 200);
    const s = createBandSolver(c.plan, c.futures);
    const r = s.solveLevels(c.weigher);
    // (retaken in step 4b: while weighing, C's end age defaults to the plan-to age from the tables — one end-age rule,
    // horizonEndAge: 99 for someone of 66 who has not said, 33 years where it was 95 and 29)
    expect(c.plan.years).toBe(33);
    expect([r.careful.k, r.balanced.k, r.bold.k]).toEqual([212, 227, 266]);
    expect([c.weigher.byMonth[100], c.weigher.byMonth[300]]).toEqual([929174634, 318114023]);
    expect(s.weightedFailsAt(c.weigher, r.balanced.k)).toBe(21130399500);
  });

  it('one level alone is the same figure as all three at once; the same again on a fresh solver (deterministic)', () => {
    const c = cCase(...C_CASES['Sam, 58, £250,000, from 58'], 200);
    const all = createBandSolver(c.plan, c.futures).solveLevels(c.weigher);
    for (const l of LEVELS) expect(createBandSolver(c.plan, c.futures).solveLevels(c.weigher, [l])[l]).toEqual(all[l]);
    expect(createBandSolver(c.plan, c.futures).solveLevels(c.weigher)).toEqual(all);
  });

  it('with nobody dying (every weight whole) Balanced is the count\'s careful amount, Careful the count at n/20, Bold at 6n/20', () => {
    for (const env of [{ lifeTable: IMMORTAL }, { weighted: false }]) {
      const c = cCase({ you: { pot: 400000, age: 66 }, endAge: 95 }, {}, 200, { ...env, weightToAge: 95 });
      if (env.weighted === false) expect(c.weigher.byMonth.every((v) => v === WEIGHT_ONE)).toBe(true);
      const fast = createBandSolver(c.plan, c.futures).solveLevels(c.weigher);
      const count = createBandSolver(c.plan, c.futures);
      expect(fast.balanced.k).toBe(count.solve().k.careful);                 // today's careful figure, byte for byte
      for (const l of LEVELS) {
        const j = failsBound(200, LEVEL_FAILS20[l]);
        expect(count.failsAt(fast[l].k)).toBeLessThanOrEqual(j);
        expect(count.failsAt(fast[l].k + 1)).toBeGreaterThan(j);
      }
      expect(bandIndexes(200).careful).toBe(failsBound(200, LEVEL_FAILS20.balanced));
    }
  });

  it('the ceiling: a weight of nothing for every run-out passes at the top, flagged capped; the reference\'s floor: nothing passes', () => {
    const c = cCase({ you: { pot: 90000, age: 66 } }, {}, 40);
    const none = { ...c.weigher, byMonth: new Float64Array(c.weigher.byMonth.length) };
    const fast = createBandSolver(c.plan, c.futures).solveLevels(none);
    const ref = weightedThresholdReference(c.plan, c.futures, none, LEVELS, { run: c.run() });
    for (const l of LEVELS) {
      expect(fast[l]).toEqual({ k: ref.kMax, monthly: ref.kMax * 10, capped: true, floorHit: false });
      expect(ref[l].k).toBe(ref.kMax);
      expect(ref[l].capped).toBe(true);
    }
    // an engine where every run runs out at once: even the lowest amount fails
    const fail = weightedThresholdReference(c.plan, c.futures, c.weigher, ['balanced'], { run: () => ({ failed: true, failMonth: 0 }) });
    expect(fail.balanced).toMatchObject({ k: null, monthly: null, floorHit: true, verdict: 'no' });
  });
});

describe('withinWeighted, B\'s pot and B\'s pay-in', () => {
  it('withinWeighted is the one test on the verdict\'s own months, stopping early either way', () => {
    const d = dCase({ you: { age: 66, pot: 400000, statePension: { kind: 'full' }, taxFreeTaken: 'yes' }, spend: { kind: 'amount', amount: 2000 } }, 200);
    for (const spend of [1500, 2000, 2300, 2600, 3000]) {
      const months = verdictAt(d.sp, createStopRunner(d.sp), spend * 12).runOutMonths;
      const sum = weightedFails(d.weigher, months);
      for (const t of Object.values(LEVEL_FAILS20)) {
        const w = withinWeighted(d.sp, createStopRunner(d.sp), spend * 12, d.weigher, t);
        expect(w.ok, `${spend} ${t}`).toBe(passes(sum, 200, t));
        expect(w.sumW).toBeLessThanOrEqual(sum);
      }
    }
  });

  const B_CASES = {
    'Alex, 50, stopping at 60': { you: { pot: 120000, age: 50, payIn: { kind: 'split', own: 450, employer: 250 } }, stop: { age: 60 }, spend: { amount: 2000 } },
    'Alex 52 and Sam 50, stopping at 60': { household: 'couple', you: { pot: 200000, age: 52, payIn: { total: 600 } }, partner: { age: 50, pot: 80000, payIn: { total: 300 } },
      stop: { age: 60 }, spend: { kind: 'level', level: 'moderate' } },
    'Sam, 35, stopping at 55 with nothing set aside for the closed years': { you: { pot: 40000, age: 35, payIn: { total: 400 } }, stop: { age: 55 }, spend: { amount: 2000 } }
  };
  /** B's stop plan for checked inputs, followed on to `to`. */
  function bCase(inputs, n, to = 103) {
    const env = ON(n);
    const checked = checkInputs(SCHEMA_B, inputs, env);
    expect(checked.ok, JSON.stringify(checked.errors)).toBe(true);
    const ins = checked.inputs;
    const { household } = toHouseholdB(ins, env);
    const younger = Math.min(ins.you.age, ins.partner ? ins.partner.age : Infinity);
    const sp = stopAtPlan({ ...household, planToAge: to }, ins.stop.age, env, livesList(n, to - younger, env));
    const H = (ins.spend.kind === 'level' ? 3600 : ins.spend.amount) * 12;
    return { sp, ins, H, weigher: weigherOf(sp.plan, ins, env) };
  }

  it.each(Object.entries(B_CASES))('%s: the pot to aim for at each level is plain bisection\'s; Careful ≥ Balanced ≥ Bold; below the count', (name, inputs) => {
    const b = bCase(inputs, 100);
    const got = potNeededWeighted(b.sp, b.H, b.weigher);
    const count = potNeededAt(b.sp, b.H, LEVELS.map((l) => failsBound(100, LEVEL_FAILS20[l])));
    LEVELS.forEach((l, j) => {
      const plain = potNeededWeightedPlain(b.sp, b.H, b.weigher, l);
      expect(got[l].pot, `${name} ${l}`).toBe(plain);
      expect(got[l].capped).toBe(plain === null);
      if (count[j] !== null) expect(got[l].pot).toBeLessThanOrEqual(count[j]);
    });
    if (got.careful.pot !== null && got.bold.pot !== null) {
      expect(got.careful.pot).toBeGreaterThanOrEqual(got.balanced.pot);
      expect(got.balanced.pot).toBeGreaterThanOrEqual(got.bold.pot);
    }
  });

  it('a pot no amount can reach (the closed years with nothing set aside): null, flagged capped, at every level', () => {
    const b = bCase(B_CASES['Sam, 35, stopping at 55 with nothing set aside for the closed years'], 100);
    expect(potNeededWeighted(b.sp, b.H, b.weigher)).toEqual({ careful: { pot: null, capped: true }, balanced: { pot: null, capped: true }, bold: { pot: null, capped: true } });
  });

  it('the pay-in at Balanced holds at its figure and fails £10 below; never more than the count\'s; null at the ceiling', () => {
    for (const name of ['Alex, 50, stopping at 60', 'Alex 52 and Sam 50, stopping at 60']) {
      const b = bCase(B_CASES[name], 100);
      const people = b.sp.saving.people;
      const payIns = (c) => people.map((p) => ({ pension: c / people.length, savings: p.payIn.savings }));
      const t = LEVEL_FAILS20.balanced;
      const c = leastPayIn((x) => lastsWithinWeighted(b.sp, b.H, payIns(x), b.weigher, t), 10000, 0);
      expect(c, name).not.toBe(null);
      expect(lastsWithinWeighted(b.sp, b.H, payIns(c), b.weigher, t)).toBe(true);
      if (c > 0) expect(lastsWithinWeighted(b.sp, b.H, payIns(c - 10), b.weigher, t)).toBe(false);
      // the same test in full: the verdict's months at that pay-in pass
      const months = verdictAt(b.sp, runnerAtPayIns(b.sp, payIns(c)), b.H).runOutMonths;
      expect(passes(weightedFails(b.weigher, months), 100, t)).toBe(true);
      const count = leastPayIn((x) => lastsWithin(b.sp, b.H, payIns(x), failsBound(100, t)), 10000, 0);
      if (count !== null) expect(c).toBeLessThanOrEqual(count);
      // Careful never asks less; Bold never more
      const at = (l) => leastPayIn((x) => lastsWithinWeighted(b.sp, b.H, payIns(x), b.weigher, LEVEL_FAILS20[l]), 10000, 0);
      expect(at('careful') === null || at('careful') >= c).toBe(true);
      expect(at('bold')).toBeLessThanOrEqual(c);
    }
    const s = bCase(B_CASES['Sam, 35, stopping at 55 with nothing set aside for the closed years'], 100);
    const sPay = (x) => [{ pension: x, savings: 0 }];
    expect(leastPayIn((x) => lastsWithinWeighted(s.sp, s.H, sPay(x), s.weigher, LEVEL_FAILS20.bold), 10000, 0)).toBe(null);
  });
});
