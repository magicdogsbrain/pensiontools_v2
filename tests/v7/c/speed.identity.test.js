/**
 * The fast path gives the reference's answer, byte for byte (V7 answer C; band.js, fastEngine.js).
 *
 * Two references are kept in src/answers/shared and used only here:
 *   - bandReference.js: the band search as it was before the fast path, running today's engine run by run;
 *   - services/SimulationEngine.js simulate: what fastEngine.js replicates for the answer's config shape.
 * Every test here runs both and asserts identity — the whole result object through answerC (a JSON text
 * compare; the evaluation count in the trace is the one field left out, it counts a different search), and the
 * engine's own outcome run by run (failed, the month, and the end pots to the bit).
 *
 * A small sample, so it runs in CI in seconds (the reference is the slow path, and vitest runs it slower still):
 * the three fixtures and every named state at 40 futures, 40 random households at 12, and the forum guest at 300
 * (tests/v7/c/render.test.js re-runs every named state at its published 1,000 futures against the result pinned
 * by the reference path on the day the states were built, which is the same check at full size). The full proof — every named state and fixture at 1,000 futures, 200 random households at 20
 * and 12 more at 100 then 1,000 — is speed.identity.slow.test.js (test:all / nightly), which runs for minutes.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import fc from 'fast-check';
import { SCHEMA_C, TEST_ENV } from './_c.js';
import { answerC } from './invariants.js';
import { arbitraryInputs } from '../gen/arbitrary.mjs';
import { checkInputs } from '../../../src/answers/shared/validate.js';
import { toHousehold } from '../../../src/answers/c/toHousehold.js';
import { enginePlan, configsAt } from '../../../src/answers/shared/toEngine.js';
import { futuresList } from '../../../src/answers/shared/futures.js';
import { simulate } from '../../../src/services/SimulationEngine.js';
import { simulateFast, fastEligible, createFastRunner } from '../../../src/answers/shared/fastEngine.js';
import { createBandSolver, mostPerFuture, bandFrom } from '../../../src/answers/shared/band.js';
import { createReferenceBandSolver } from '../../../src/answers/shared/bandReference.js';
import { bothWays, asText } from './identity.js';

const FIXTURES = resolve(process.cwd(), 'tests/v7/fixtures/c');
const STATES = resolve(process.cwd(), 'tests/v7/states/c');
const SEED = 20260930;

const fixtures = readdirSync(FIXTURES).filter((f) => f.endsWith('.json')).map((f) => JSON.parse(readFileSync(resolve(FIXTURES, f), 'utf8')));
/** The inputs of every named state that carries an answer (its inputs are the checked inputs the answer was made from). */
const stateInputs = readdirSync(STATES).filter((f) => f.endsWith('.json')).map((f) => {
  const s = JSON.parse(readFileSync(resolve(STATES, f), 'utf8'));
  const r = s.answers && s.answers.c && s.answers.c.result;
  return r && r.inputs ? { name: f, inputs: r.inputs, today: s.env.today } : null;
}).filter(Boolean);

const random = (count, env) => fc.sample(arbitraryInputs(SCHEMA_C, env), { seed: SEED, numRuns: count });

describe('the fast path is the reference, byte for byte', () => {
  it('the three fixtures, at their own futures, with the trace', () => {
    for (const fx of fixtures) {
      const fast = bothWays(fx.inputs, { ...TEST_ENV, ...fx.env, trace: true });
      expect(fast.status).toBe(fx.expect.status);
    }
  });

  it('every named state (inputs as pinned), at 40 futures', () => {
    expect(stateInputs.length).toBeGreaterThanOrEqual(10);
    for (const s of stateInputs) bothWays(s.inputs, { today: s.today, futures: 40, seed: 0, trace: false });
  });

  it('40 random households, at 12 futures', () => {
    let ok = 0;
    for (const inputs of random(40, TEST_ENV)) {
      const fast = bothWays(inputs, { ...TEST_ENV, futures: 12 });
      if (fast.status === 'ok') ok++;
    }
    expect(ok).toBeGreaterThan(20);
  }, 60_000);

  it('the forum guest at 300 futures, and again with the amounts remembered from a first pass of 100', () => {
    const F1 = fixtures.find((f) => f.id === 'F1');
    const env = { today: TEST_ENV.today, futures: 300, seed: 0, trace: false };
    const reference = answerC(F1.inputs, { ...env, solver: 'reference' });
    answerC(F1.inputs, { ...env, futures: 100 });            // the first figure: leaves its amounts as the next search's estimate
    const fast = answerC(F1.inputs, env);
    expect(asText(fast)).toBe(asText(reference));
  }, 60_000);

  it('the same answer with the reference solver asked for by name is the reference (guards the test hook)', () => {
    const F1 = fixtures.find((f) => f.id === 'F1');
    const a = answerC(F1.inputs, { ...TEST_ENV, solver: 'reference' });
    const b = answerC(F1.inputs, { ...TEST_ENV, solver: 'reference' });
    expect(asText(a)).toBe(asText(b));
    expect(a.basis.futures).toBe(TEST_ENV.futures);
  });
});

describe('the engine replica is today\'s engine, run by run', () => {
  /** Every run's config for a household at a few amounts, over its futures. */
  const cases = (inputs, env, n, ks) => {
    const checked = checkInputs(SCHEMA_C, inputs, env);
    if (!checked.ok) return null;
    const { household } = toHousehold(checked.inputs, env);
    const plan = enginePlan(household, env);
    if (!(plan.totalPots > 0)) return null;
    const futures = futuresList(n, plan.years, env);
    const kLow = Math.floor(plan.guaranteedAtStartAYear / 12 / 10 + 1e-9);
    return { plan, futures, configsAtK: ks.map((dk) => configsAt(plan, (kLow + dk) * 120)) };
  };
  const same = (a, b) => a.failed === b.failed && a.failMonth === b.failMonth && a.finalEquity === b.equity && a.finalBond === b.bond && a.finalCash === b.cash && a.finalIsa === b.isa;

  it('the fixtures and 40 random households: failed, the month, and the end pots to the bit', () => {
    const env = { today: TEST_ENV.today, seed: 0 };
    const households = [...fixtures.map((f) => f.inputs), ...random(40, env)];
    let compared = 0, eligibleRuns = 0, ineligible = 0;
    for (const inputs of households) {
      const c = cases(inputs, env, 12, [0, 3, 30, 90, 200, 600]);
      if (!c) continue;
      for (const configs of c.configsAtK) {
        for (const { config } of configs) {
          if (!fastEligible(config)) { ineligible++; continue; }
          eligibleRuns++;
          for (const future of c.futures) {
            const a = simulate(config, future.returns, future.seed);
            const b = simulateFast(config, future);
            if (!same(a, b)) expect.fail(`differs: ${JSON.stringify(inputs)} at ${config.targetSchedule[0]} in future ${future.id}: engine ${JSON.stringify([a.failed, a.failMonth, a.finalEquity, a.finalBond, a.finalCash, a.finalIsa])} replica ${JSON.stringify(b)}`);
            compared++;
          }
        }
      }
    }
    expect(ineligible).toBe(0);                    // every config the adapter builds is covered by the replica
    expect(eligibleRuns).toBeGreaterThan(100);
    expect(compared).toBeGreaterThan(2000);
  }, 60_000);

  it('the runner shares a future\'s drivers between runs and gives the same outcome as a fresh replica', () => {
    const env = { today: TEST_ENV.today, seed: 0 };
    const c = cases(fixtures.find((f) => f.id === 'F2').inputs, env, 25, [40, 300, 450, 380]);
    const runner = createFastRunner(c.plan, c.futures);
    expect(runner.eligible.every(Boolean)).toBe(true);
    for (const configs of c.configsAtK) {
      configs.forEach((entry, r) => {
        for (let i = 0; i < c.futures.length; i++) {
          const viaRunner = runner.run(r, i, entry.config);
          const fresh = simulateFast(entry.config, c.futures[i]);
          expect([viaRunner.failed, viaRunner.failMonth]).toEqual([fresh.failed, fresh.failMonth]);
        }
      });
    }
  });

  it('a config the replica does not cover falls back to the engine', () => {
    const env = { today: TEST_ENV.today, seed: 0 };
    const c = cases(fixtures.find((f) => f.id === 'F1').inputs, env, 3, [100]);
    const [{ config }] = c.configsAtK[0];
    const odd = { ...config, hodlEnabled: true, hodlValue: 25000 };
    expect(fastEligible(odd)).toBe(false);
    expect(simulateFast(odd, c.futures[0])).toBe(null);
    const oddPlan = { ...c.plan, runs: c.plan.runs.map((r) => ({ ...r, base: { ...r.base, hodlEnabled: true, hodlValue: 25000 } })) };
    const runner = createFastRunner(oddPlan, c.futures);
    expect(runner.eligible).toEqual([false]);
    const viaRunner = runner.run(0, 0, odd);
    const engine = simulate(odd, c.futures[0].returns, c.futures[0].seed);
    expect([viaRunner.failed, viaRunner.failMonth]).toEqual([engine.failed, engine.failMonth]);
  });
});

describe('the search settles on the brackets alone', () => {
  it('with and without an estimate, right or wrong, the same three amounts as the reference and as every future on its own', () => {
    const env = { today: TEST_ENV.today, seed: 0 };
    const c = cases2(env);
    const reference = createReferenceBandSolver(c.plan, c.futures).solve();
    const most = c.futures.map((f) => mostPerFuture(c.plan, f)).sort((a, b) => a - b);
    const band = bandFrom(most);
    for (const estimate of [null, reference.k, { careful: 5, middling: 6, good: 7 }, { careful: 400, middling: 500, good: 900 }, { careful: reference.k.careful + 2, middling: reference.k.middling - 3, good: reference.k.good + 9 }]) {
      const solver = createBandSolver(c.plan, c.futures, { estimate });
      const { k, fails } = solver.solve();
      expect(k).toEqual(reference.k);
      expect(fails).toEqual(reference.fails);
      expect({ careful: k.careful * 10, middling: k.middling * 10, good: k.good * 10 }).toEqual(band);
      for (const kk of [k.careful, k.middling, k.good]) {
        expect(solver.runOutMonthsAt(kk)).toEqual(createReferenceBandSolver(c.plan, c.futures).runOutMonthsAt(kk));
      }
    }
  });
  function cases2(env) {
    const inputs = { household: 'couple', you: { pot: 180000, age: 61 }, partner: { pot: 90000, age: 59 }, savings: 20000 };
    const checked = checkInputs(SCHEMA_C, inputs, env);
    const { household } = toHousehold(checked.inputs, env);
    const plan = enginePlan(household, env);
    return { plan, futures: futuresList(30, plan.years, env) };
  }
});
