/**
 * 7.8.0, speed with nothing moved: every way the weighted searches save runs gives the answer the plain way gives.
 *   - a runner that keeps its runs (createStopRunner `keep`) gives what a fresh one gives, asked twice or in another order;
 *   - a life's later runs asked only up to its earliest run-out so far (lifeOutcome, runUntil): the same months;
 *   - withinWeighted with some lives tried first (`first`): the same answer;
 *   - B's pot to aim for on the runners its least pots were found on (potRunners): the same pots;
 *   - leastPayIn tests each figure once;
 *   - the levels' searches started from a hint (known.ratios) find what they find without one.
 * All fictional (Alex, Sam).
 */
import { describe, it, expect } from 'vitest';
import { checkInputs } from '../../../src/answers/shared/validate.js';
import { SCHEMA_B } from '../../../src/answers/b/schema.js';
import { SCHEMA_C } from '../../../src/answers/c/schema.js';
import { toHousehold as toHouseholdB } from '../../../src/answers/b/toHousehold.js';
import { toHousehold as toHouseholdC } from '../../../src/answers/c/toHousehold.js';
import { enginePlan } from '../../../src/answers/shared/toEngine.js';
import { futuresList } from '../../../src/answers/shared/futures.js';
import { livesList } from '../../../src/answers/shared/lives.js';
import { createFastRunner } from '../../../src/answers/shared/fastEngine.js';
import { createBandSolver, runFuture } from '../../../src/answers/shared/band.js';
import {
  stopAtPlan, createStopRunner, verdictAt, withinWeighted, potNeededWeighted, potRunners, leastPotsOf, leastPayIn, runnerAtPayIns
} from '../../../src/answers/shared/stopAt.js';
import { weigherOf } from '../../../src/answers/shared/weigh.js';
import { LEVEL_FAILS20 } from '../../../src/answers/shared/rules.js';

const TODAY = '2026-11-11';
const ON = (n) => ({ today: TODAY, futures: n, seed: 0, weighted: true });
const LEVELS = ['careful', 'balanced', 'bold'];

/** B's stop plan for a couple saving to 60 (both people's runs in every life), and its weights. */
function coupleStop(n) {
  const env = ON(n);
  const inputs = { household: 'couple', you: { pot: 200000, age: 52, payIn: { total: 600 } }, partner: { age: 50, pot: 80000, payIn: { total: 300 } },
    stop: { age: 60 }, spend: { kind: 'level', level: 'moderate' } };
  const checked = checkInputs(SCHEMA_B, inputs, env);
  expect(checked.ok).toBe(true);
  const { household } = toHouseholdB(checked.inputs, env);
  const sp = stopAtPlan(household, 60, env, livesList(n, 70, env));
  return { sp, weigher: weigherOf(sp.plan, checked.inputs, env), H: 3600 * 12 };
}

describe('the weighted searches save runs, never change an answer', () => {
  it('a runner that keeps its runs gives the fresh runner\'s months, asked twice; a later run asked only to the earliest run-out so far gives the same month', () => {
    const { sp, H } = coupleStop(120);
    expect(sp.plan.runs.length).toBe(2);
    for (const spend of [H * 0.8, H, H * 1.25]) {
      const fresh = verdictAt(sp, createStopRunner(sp), spend).runOutMonths;
      // the months as band.js runFuture gives them, every run in full
      const full = sp.lives.map((_, i) => { const r = createStopRunner(sp); const res = runFuture(r.configsAtH(spend, i), null, true, (k, config) => r.run(k, i, config)); return res.failed ? res.failMonth : null; });
      expect(fresh).toEqual(full);
      const kept = createStopRunner(sp, sp.lives, sp.kernels, { keep: true });
      expect(verdictAt(sp, kept, spend).runOutMonths).toEqual(fresh);
      expect(verdictAt(sp, kept, spend).runOutMonths).toEqual(fresh);
      expect(fresh.some((m) => m !== null)).toBe(true);
    }
  });

  it('withinWeighted with some lives tried first gives the same answer at every level', () => {
    const { sp, weigher, H } = coupleStop(120);
    for (const spend of [H * 0.9, H, H * 1.1, H * 1.3]) {
      const months = verdictAt(sp, createStopRunner(sp), spend).runOutMonths;
      const failing = months.map((m, i) => (m === null ? -1 : i)).filter((i) => i >= 0);
      const lasting = months.map((m, i) => (m === null ? i : -1)).filter((i) => i >= 0);
      for (const t of Object.values(LEVEL_FAILS20)) {
        const plain = withinWeighted(sp, createStopRunner(sp), spend, weigher, t).ok;
        expect(withinWeighted(sp, createStopRunner(sp), spend, weigher, t, Infinity, null, failing).ok, `${spend} ${t}`).toBe(plain);
        expect(withinWeighted(sp, createStopRunner(sp), spend, weigher, t, Infinity, null, lasting).ok, `${spend} ${t}`).toBe(plain);
      }
    }
  });

  it('B\'s pot to aim for on the runners its own least pots were found on is the pot found on fresh runners', () => {
    const { sp, weigher, H } = coupleStop(80);
    const runnerAt = potRunners(sp);
    const least = leastPotsOf(sp, H, runnerAt);
    const shared = potNeededWeighted(sp, H, weigher, LEVELS, { least, runnerAt });
    expect(shared).toEqual(potNeededWeighted(sp, H, weigher, LEVELS));
    expect(shared.careful.pot).toBeGreaterThanOrEqual(shared.balanced.pot);
    expect(shared.balanced.pot).toBeGreaterThanOrEqual(shared.bold.pot);
  });

  it('the pay-in runners kept for a stop plan are the ones asked for: the same pay-ins, the same runner and runs', () => {
    const { sp, H } = coupleStop(60);
    const payIns = (c) => sp.saving.people.map((p, j) => ({ pension: c * (j === 0 ? 2 / 3 : 1 / 3), savings: p.payIn.savings }));
    const a = runnerAtPayIns(sp, payIns(5000));
    expect(runnerAtPayIns(sp, payIns(5000))).toBe(a);
    expect(runnerAtPayIns(sp, payIns(5010))).not.toBe(a);
    expect(verdictAt(sp, a, H).runOutMonths).toEqual(verdictAt(sp, createStopRunner(sp, sp.lives, sp.kernels, {
      pensionOf: (i, j) => sp.kernels[j].pension.A[i] + payIns(5000)[j].pension * sp.kernels[j].pension.B[i],
      savingsOf: (i, j) => sp.kernels[j].savings.A[i] + payIns(5000)[j].savings * sp.kernels[j].savings.B[i]
    }), H).runOutMonths);
  });

  it('leastPayIn tests each figure once, and finds what it found', () => {
    const tested = [];
    const ok = (c) => { tested.push(c); return c >= 1230; };
    // a bracket whose widening comes back to a figure it tested
    expect(leastPayIn(ok, 10000, 0, { lo: 1180, hi: 1190 })).toBe(1230);
    expect(new Set(tested).size).toBe(tested.length);
    expect(leastPayIn((c) => c >= 1230, 10000, 0)).toBe(1230);
  });

  it('each level\'s search started from a hint finds the amount it finds with none (C\'s futures, a man of 66 and a couple)', () => {
    for (const [inputs, sexes] of [[{ you: { pot: 400000, age: 66 } }, { you: { sex: 'male' } }],
      [{ household: 'couple', you: { pot: 300000, age: 66 }, partner: { age: 63, pot: 150000 }, endAge: 104 }, {}]]) {
      const env = ON(150);
      const checked = checkInputs(SCHEMA_C, inputs, env);
      const { household } = toHouseholdC(checked.inputs, env);
      const plan = enginePlan(household, env);
      const futures = futuresList(150, plan.years, env);
      const weigher = weigherOf(plan, sexes, env);
      const plain = createBandSolver(plan, futures, { runner: createFastRunner(plan, futures) });
      plain.solve();
      const want = plain.solveLevels(weigher, LEVELS);
      expect(plain.levelRatios.balanced).toBeGreaterThan(0);
      for (const ratios of [plain.levelRatios, { careful: 1, balanced: 1, bold: 1 }, { careful: 1.5, balanced: 0.7, bold: 2 }]) {
        const hinted = createBandSolver(plan, futures, { runner: createFastRunner(plan, futures) });
        hinted.solve();
        expect(hinted.solveLevels(weigher, LEVELS, { ratios })).toEqual(want);
      }
    }
  });
});
