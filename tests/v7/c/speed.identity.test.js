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

/*
 * Step 4 (the saving years): the new shapes the fast path takes, each against today's engine run by run
 * (step 4 brief 4.6; test plan 3.6) — an income that ends (part-time work), a finite ISA rate (env.savingsGrowth),
 * and per-future starting pots (the stop runner). The locked run's reference is the chain in tests/v7/saving/locked.test.js.
 */
import { stopAtPlan, createStopRunner, bandAt } from '../saving/_saving.js';
import { saver } from '../saving/invariants.js';
import { identityCases, perLifeBandReference } from './identity.js';

describe('the new shapes of step 4: the replica is today\'s engine', () => {
  const env = { today: TEST_ENV.today, seed: 0 };
  const same = (a, b) => a.failed === b.failed && a.failMonth === b.failMonth && a.finalEquity === b.equity && a.finalBond === b.bond && a.finalCash === b.cash && a.finalIsa === b.isa;

  it('an income that ends (N ∈ {1, 3, 10} years, £1 / £12,570 / £50,000 a year) and a finite ISA rate: failed, the month and the end pots to the bit', () => {
    const households = [...fixtures.map((f) => f.inputs), ...random(15, env)];
    let compared = 0;
    for (const inputs of households) {
      const c = identityCases(inputs, env, 8, [0, 30, 200, 600]);
      if (!c) continue;
      for (const configs of c.configsAtK) {
        for (const { config, role } of configs) {
          const shapes = [];
          if (role === 'pension') for (const N of [1, 3, 10]) for (const annual of [1, 12570, 50000]) shapes.push({ ...config, extraIncomes: [...(config.extraIncomes || []), { startYear: 0, endYear: N - 1, annual, indexation: 'cpi' }] });
          for (const isaReturn of [0, 0.03, 0.05]) shapes.push({ ...config, isaReturn });
          for (const shaped of shapes) {
            expect(fastEligible(shaped)).toBe(true);
            for (const future of c.futures) {
              const a = simulate(shaped, future.returns, future.seed);
              const b = simulateFast(shaped, future);
              if (!same(a, b)) expect.fail(`differs: ${JSON.stringify(inputs)} ${JSON.stringify(shaped.extraIncomes)} isa ${shaped.isaReturn} in future ${future.id}`);
              compared++;
            }
          }
        }
      }
    }
    expect(compared).toBeGreaterThan(3000);
  }, 60_000);

  it('per-future pots, a stop now in any mix: the band on the stop runner is the band read off each life\'s most, by today\'s engine', () => {
    let compared = 0;
    for (const [h, n] of [
      [saver({ age: 62, pot: 300_000, isa: 40_000, stopAge: 62 }), 12],
      [saver({ age: 66, pot: 150_000, stopAge: 66, partner: { age: 63, pot: 250_000, isa: 20_000 } }), 12],
      [saver({ age: 60, pot: 500_000, stopAge: 60, finalSalary: { yearly: 9_000, fromAge: 65 }, risk: 'adventurous' }), 12]
    ]) {
      const sp = stopAtPlan(h, h.people[0].age, { ...TEST_ENV, futures: n });
      // every life a different pot: from a third to twice today's, by life
      const runner = createStopRunner(sp, sp.lives, sp.kernels, { pensionOf: (i, j) => sp.potsOf(i)[j].pension * (0.33 + (i * 7919 % 17) / 10) });
      const band = bandAt(sp, runner);
      expect(perLifeBandReference(sp, runner, sp.S)).toEqual(band.monthly);
      compared++;
    }
    expect(compared).toBe(3);
  }, 60_000);

  it('per-future pots after saving years, all-shares mix: the same', () => {
    const SHARES = { equity: 1, bond: 0, cash: 0 };
    for (const h of [
      saver({ age: 45, pot: 120_000, payIn: 700, stopAge: 60, mix: SHARES }),
      saver({ age: 50, pot: 60_000, isa: 50_000, payIn: 500, savingsIn: 300, stopAge: 58, mix: SHARES }),
      saver({ age: 48, pot: 200_000, payIn: 300, stopAge: 61, mix: SHARES, partner: { age: 52, pot: 90_000, isa: 30_000, payIn: 600 } })
    ]) {
      const stopAge = h.people[0].stopWork.age;
      const sp = stopAtPlan(h, stopAge, { ...TEST_ENV, futures: 12, mix: SHARES, savingMix: SHARES });
      const runner = createStopRunner(sp);
      const band = bandAt(sp, runner);
      expect(perLifeBandReference(sp, runner, sp.S)).toEqual(band.monthly);
    }
  }, 60_000);
});

/*
 * Couples who stop work in different years (research/v7/couples-different-years.md 4.3 e, f; 9.1 I6, I7): the replica's
 * new shapes against today's engine itself, run by run, on C's configs in any mix. Cover months that are never short,
 * and a hand-over whose schedule is written in beforehand, are `simulate` bit for bit; a run that starts at its holder's
 * own stop is `simulate` on the life read from that stop (all shares: the bond stream plays no part).
 */
import { simulateFastFrom, prepareFuture } from '../../../src/answers/shared/fastEngine.js';
import { sliceReturns } from '../../../src/answers/shared/lives.js';
import { apart } from '../shared/apart.mjs';

describe('couples apart: the replica\'s new shapes are today\'s engine', () => {
  const env = { today: TEST_ENV.today, seed: 0 };
  const same = (a, b) => a.failed === b.failed && a.failMonth === b.failMonth && a.finalEquity === b.equity && a.finalBond === b.bond && a.finalCash === b.cash && a.finalIsa === b.isa;

  it('cover months none of which is short, and a schedule changed part-way by the hook: simulate, bit for bit (the fixtures and 12 random households)', () => {
    let covered = 0, hooked = 0;
    for (const inputs of [...fixtures.map((f) => f.inputs), ...random(12, env)]) {
      const c = identityCases(inputs, env, 8, [3, 90, 300]);
      if (!c) continue;
      for (const configs of c.configsAtK) {
        for (const { config } of configs) {
          for (const f of c.futures) {
            const cov = simulateFast({ ...config, coverMonths: 36 }, f);
            if (cov.coveredFrom === null) {
              const s = simulate(config, f.returns, f.seed);
              if (!same(s, cov)) expect.fail(`cover months: ${JSON.stringify(inputs)} future ${f.id}`);
              covered++;
            }
            // the hook at year 3: a schedule 10% higher from there on, against the same schedule written in beforehand
            const M = 36;
            if (config.years <= 3) continue;
            const changed = config.targetSchedule.map((t, y) => (y >= 3 ? t * 1.1 : t));
            const pf = prepareFuture(f, config.years);
            const viaHook = simulateFastFrom(config, pf, { hook: { month: M, retarget: () => ({ targetSchedule: changed }) } });
            const s = simulate({ ...config, targetSchedule: changed }, f.returns, f.seed);
            if (!same(s, viaHook)) expect.fail(`hook: ${JSON.stringify(inputs)} future ${f.id}`);
            hooked++;
          }
        }
      }
    }
    expect(covered).toBeGreaterThan(300);
    expect(hooked).toBeGreaterThan(300);
  }, 60_000);

  it('a run that starts at its holder\'s own stop is simulate on the life read from there (all shares), its run-out moved onto the household\'s clock', () => {
    const SHARES = { equity: 1, bond: 0, cash: 0 };
    const env2 = { ...TEST_ENV, futures: 12, mix: SHARES, savingMix: SHARES };
    let compared = 0;
    for (const [h, a] of [
      [apart({ you: { age: 55, pot: 300_000, isa: 20_000, payIn: 600, stop: 60 }, partner: { age: 61, stop: 'already' }, payCovers: 1, mix: SHARES }), 60],
      [apart({ you: { age: 63, stop: 'already', sp: 4_000 }, partner: { age: 54, pot: 200_000, isa: 10_000, payIn: 900, stop: 58, finalSalary: { yearly: 7_000, fromAge: 60 } }, payCovers: 1, mix: SHARES }), 58]
    ]) {
      const sp = stopAtPlan(h, a, env2);
      const runner = createStopRunner(sp);
      const run = sp.plan.runs[0];
      expect(run.offset).toBeGreaterThan(0);
      for (const H of [18_000, 30_000, 45_000]) {
        for (let i = 0; i < sp.n; i++) {
          const entries = runner.configsAtH(H, i);
          const got = runner.run(0, i, entries[0].config);
          const q = sp.potsOf(i)[run.index];
          const config = { ...entries[0].config, equityStart: q.pension, bondStart: 0, cashStart: 0, equityMin: q.pension, bondMin: 0, cashTarget: 0, isaBalance: q.isa };
          const s = simulate(config, sliceReturns(sp.lives[i], sp.S + run.offset, sp.D - run.offset), sp.lives[i].seed);
          expect([got.failed, got.failMonth]).toEqual([s.failed, s.failed ? s.failMonth + 12 * run.offset : null]);
          if (!s.failed) expect(Math.abs(got.equity - s.finalEquity)).toBeLessThanOrEqual(1e-9 * Math.max(1, s.finalEquity));
          compared++;
        }
      }
    }
    expect(compared).toBeGreaterThan(50);
  });
});
