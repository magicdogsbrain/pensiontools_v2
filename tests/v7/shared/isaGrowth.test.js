/**
 * How ISAs and savings grow, in V7's numbers (6.22.0; research/saver-lock-and-savings-growth.md 2d, tests 4–6): the
 * household's one choice, `household.isaGrowth` — 'cash' ("Mostly cash") or 'invested' ("Invested like my pension") —
 * while saving AND while drawing.
 *
 *   - the replica (fastEngine.js) is today's engine at each choice, run by run, to the bit — the ordinary path and the
 *     locked run (against chain.mjs, the chain of today's `simulate`);
 *   - the adapter hands the choice to every drawing run, with the household's drawing mix for "invested" (a savings-only
 *     run has no pension to read a mix from); a household without a choice runs as before (absent = today's fixed 3% at
 *     the engine level — V7's household model supplies the 'cash' default, not the engine); a test's fixed rate
 *     (env.savingsGrowth) still wins;
 *   - the saving years: "invested" (and no choice) is today's kernel, bit for bit — the savings grow with the pension's
 *     saving mix; "cash" gives the savings a kernel of their own on the cash factors; the pension never depends on it;
 *   - closed forms in both phases; sense checks.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import fc from 'fast-check';
import { checkInputs } from '../../../src/answers/shared/validate.js';
import { SCHEMA_C } from '../../../src/answers/c/schema.js';
import { toHousehold } from '../../../src/answers/c/toHousehold.js';
import { enginePlan, configsAt } from '../../../src/answers/shared/toEngine.js';
import { futuresList } from '../../../src/answers/shared/futures.js';
import { simulate } from '../../../src/services/SimulationEngine.js';
import { simulateFast, fastEligible } from '../../../src/answers/shared/fastEngine.js';
import { createBandSolver } from '../../../src/answers/shared/band.js';
import { createReferenceBandSolver } from '../../../src/answers/shared/bandReference.js';
import { savingPlan, savingKernel, savingRows, potsByPerson } from '../../../src/answers/shared/saving.js';
import { stopAtPlan, createStopRunner, bandAt } from '../../../src/answers/shared/stopAt.js';
import { livesList } from '../../../src/answers/shared/lives.js';
import { RULES } from '../../../src/answers/shared/rules.js';
import { DEFAULT_ISA_GROWTH } from '../../../src/services/IsaGrowth.js';
import { arbitraryInputs } from '../gen/arbitrary.mjs';
import { saver, priceLevels, flatLife } from '../saving/invariants.js';
import { chainRun } from '../saving/chain.mjs';
import { perLifeBandReference } from '../c/identity.js';

const TODAY = '2026-09-30';
const ENV = { today: TODAY, futures: 40, seed: 0, trace: false };
const FIXTURES = resolve(process.cwd(), 'tests/v7/fixtures/c');
const fixtures = readdirSync(FIXTURES).filter((f) => f.endsWith('.json')).map((f) => JSON.parse(readFileSync(resolve(FIXTURES, f), 'utf8')));
const SHARES = { equity: 1, bond: 0, cash: 0 };
const CASH = { equity: 0, bond: 0, cash: 1 };

/** C's household for some inputs, with a choice — or, with `isaGrowth` undefined, with NO choice at all. null when the inputs do not check. */
function householdC(inputs, env, isaGrowth) {
  const checked = checkInputs(SCHEMA_C, inputs, env);
  if (!checked.ok) return null;
  const { household } = toHousehold(checked.inputs, env);
  const { isaGrowth: given, ...without } = household;
  void given;
  return isaGrowth === undefined ? without : { ...without, isaGrowth };
}

const same = (a, b) => a.failed === b.failed && a.failMonth === b.failMonth && a.finalEquity === b.equity && a.finalBond === b.bond && a.finalCash === b.cash && a.finalIsa === b.isa;
const rel = (a, b) => Math.abs(a - b) / Math.max(1, Math.abs(a), Math.abs(b));

describe('the replica is today\'s engine at each choice, run by run, to the bit', () => {
  it('fastEligible takes no choice, "cash", and "invested" with a mix; it refuses "invested" without one, and anything else', () => {
    const h = householdC(fixtures[0].inputs, ENV, undefined);
    const [{ config }] = configsAt(enginePlan(h, ENV), 20_000);
    expect('isaGrowth' in config).toBe(false);
    expect(fastEligible(config)).toBe(true);
    expect(fastEligible({ ...config, isaGrowth: 'cash' })).toBe(true);
    expect(fastEligible({ ...config, isaGrowth: 'invested', isaGrowthMix: { equity: 0.5, bond: 0.4, cash: 0.1 } })).toBe(true);
    expect(fastEligible({ ...config, isaGrowth: 'invested' })).toBe(false);                       // simulate would read the pots
    expect(fastEligible({ ...config, isaGrowth: 'invested', isaGrowthMix: { equity: -1, bond: 1, cash: 1 } })).toBe(false);
    for (const v of ['Cash', 'shares', 0.03, null, true]) expect(fastEligible({ ...config, isaGrowth: v }), String(v)).toBe(false);
  });

  it('the fixtures and 20 random households, at each choice and at random mixes, charged and not, at six amounts: failed, the month and the end pots', () => {
    const env = { today: TODAY, seed: 0 };
    const random = fc.sample(arbitraryInputs(SCHEMA_C, env), { seed: 20261002, numRuns: 20 });
    const mixes = [SHARES, CASH, { equity: 0.5, bond: 0.4, cash: 0.1 }, { equity: 0.13, bond: 0.61, cash: 0.26 }, { equity: 0, bond: 1, cash: 0 }];
    let compared = 0, withIsa = 0;
    for (const inputs of [...fixtures.map((f) => f.inputs), ...random]) {
      for (const isaGrowth of ['cash', 'invested']) {
        for (const chargesPct of [0, 0.5]) {
          const h = householdC(inputs, env, isaGrowth);
          if (!h) continue;
          const plan = enginePlan({ ...h, chargesPct }, env);
          if (!(plan.totalPots > 0)) continue;
          const futures = futuresList(6, plan.years, env);
          const kLow = Math.floor(plan.guaranteedAtStartAYear / 120 + 1e-9);
          for (const dk of [0, 3, 30, 90, 200, 600]) {
            for (const { config } of configsAt(plan, (kLow + dk) * 120)) {
              expect(config.isaGrowth).toBe(isaGrowth);
              const shapes = isaGrowth === 'cash' ? [config] : [config, ...mixes.map((m) => ({ ...config, isaGrowthMix: m }))];
              if (config.isaBalance > 0) withIsa++;
              for (const shaped of shapes) {
                expect(fastEligible(shaped)).toBe(true);
                for (const f of futures) {
                  const a = simulate(shaped, f.returns, f.seed);
                  const b = simulateFast(shaped, f);
                  if (!same(a, b)) expect.fail(`differs (${isaGrowth} ${JSON.stringify(shaped.isaGrowthMix)} ${chargesPct}%): ${JSON.stringify(inputs)} future ${f.id}: engine ${JSON.stringify([a.failed, a.failMonth, a.finalEquity, a.finalBond, a.finalCash, a.finalIsa])} replica ${JSON.stringify(b)}`);
                  compared++;
                }
              }
            }
          }
        }
      }
    }
    expect(withIsa).toBeGreaterThan(50);
    expect(compared).toBeGreaterThan(4000);
  }, 120_000);

  it('the locked run, "invested" on an all-shares mix, is the chain of today\'s engine (the ISA follows the shares while the pension is closed)', () => {
    const env = { ...ENV, futures: 20, mix: SHARES, savingMix: SHARES };
    for (const [stopAge, L] of [[55, 2], [53, 4]]) {
      const h = { ...saver({ age: 50, pot: 250_000, isa: 70_000, payIn: 400, savingsIn: 150, stopAge, mix: SHARES }), isaGrowth: 'invested' };
      const sp = stopAtPlan(h, stopAge, env);
      const runner = createStopRunner(sp);
      let lasted = 0;
      for (const H of [15_000, 26_000, 40_000]) {
        for (let i = 0; i < sp.n; i++) {
          const [{ config }] = configsAt(sp.plan, H, sp.potsOf(i));
          expect(config.lockedMonths).toBe(12 * L);
          expect([config.isaGrowth, config.isaGrowthMix]).toEqual(['invested', SHARES]);
          const fast = runner.run(0, i, runner.configsAtH(H, i)[0].config);
          const chain = chainRun(config, sp.lives[i], sp.S);
          expect([fast.failed, fast.failMonth], `H ${H} life ${i}`).toEqual([chain.failed, chain.failMonth]);
          if (!fast.failed) {
            expect(rel(fast.equity, chain.equity)).toBeLessThan(1e-9);
            expect(rel(fast.isa, chain.isa)).toBeLessThan(1e-9);
            lasted++;
          }
        }
      }
      expect(lasted).toBeGreaterThan(0);
    }
  }, 60_000);

  it('the locked run, "Mostly cash", on lives whose prices rise 3.5% every year, is the chain of today\'s engine', () => {
    // With prices moving, the drawing years' first cash rate reads the true year before the stop (prepareFutureFrom) where
    // the chain's slices read their own first year: flat prices make the two the same, so the chain is exact here.
    const shares = (i, years) => { const equity = {}, inflation = {}; for (let y = 0; y < years; y++) { equity[y] = ((i * 7 + y * 13) % 23 - 8) / 100; inflation[y] = 0.035; } return { equity, inflation }; };
    const env = { ...ENV, futures: 16, futureReturns: shares, mix: SHARES, savingMix: SHARES };
    for (const [stopAge, L] of [[55, 2], [53, 4]]) {
      const h = { ...saver({ age: 50, pot: 250_000, isa: 70_000, payIn: 400, savingsIn: 150, stopAge, mix: SHARES }), isaGrowth: 'cash' };
      const sp = stopAtPlan(h, stopAge, env);
      const runner = createStopRunner(sp);
      let lasted = 0, failed = 0;
      for (const H of [15_000, 26_000, 40_000]) {
        for (let i = 0; i < sp.n; i++) {
          const [{ config }] = configsAt(sp.plan, H, sp.potsOf(i));
          expect(config.isaGrowth).toBe('cash');
          const fast = runner.run(0, i, runner.configsAtH(H, i)[0].config);
          const chain = chainRun(config, sp.lives[i], sp.S);
          expect([fast.failed, fast.failMonth], `H ${H} life ${i}`).toEqual([chain.failed, chain.failMonth]);
          if (!fast.failed) {
            expect(rel(fast.equity, chain.equity)).toBeLessThan(1e-9);
            expect(rel(fast.isa, chain.isa)).toBeLessThan(1e-9);
            lasted++;
          } else failed++;
        }
      }
      expect(lasted).toBeGreaterThan(0);
      expect(failed).toBeGreaterThan(0);
    }
  }, 60_000);
});

describe('the adapter hands the choice to every run', () => {
  const inputs = { you: { pot: 300_000, age: 62 }, savings: 40_000, household: 'couple', partner: { pot: 120_000, age: 60 } };

  it('no choice (or a wrong one) leaves every config as it was; "cash" adds the choice alone; "invested" adds it with the drawing mix', () => {
    const plain = configsAt(enginePlan(householdC(inputs, ENV, undefined), ENV), 30_000);
    expect(plain.every(({ config }) => !('isaGrowth' in config) && !('isaGrowthMix' in config))).toBe(true);
    for (const v of ['Cash', 0.03, null]) expect(configsAt(enginePlan(householdC(inputs, ENV, v), ENV), 30_000)).toEqual(plain);
    const cash = configsAt(enginePlan(householdC(inputs, ENV, 'cash'), ENV), 30_000);
    cash.forEach(({ config }, r) => expect(config).toEqual({ ...plain[r].config, isaGrowth: 'cash' }));
    const plan = enginePlan(householdC(inputs, ENV, 'invested'), ENV);
    const inv = configsAt(plan, 30_000);
    inv.forEach(({ config }, r) => expect(config).toEqual({ ...plain[r].config, isaGrowth: 'invested', isaGrowthMix: { equity: plan.mix.equity, bond: plan.mix.bond, cash: plan.mix.cash } }));
  });

  it('a test\'s fixed rate (env.savingsGrowth, asGiven) still wins: the run gets isaReturn and no choice', () => {
    const h = { ...saver({ age: 60, pot: 300_000, isa: 50_000, stopAge: 60 }), isaGrowth: 'cash' };
    const plan = enginePlan(h, { today: TODAY, savingsGrowth: 0 }, { start: 'asGiven', pots: 'perFuture' });
    for (const run of plan.runs) {
      expect(run.base.isaReturn).toBe(0);
      expect('isaGrowth' in run.base).toBe(false);
    }
  });

  it('a household with no savings gives the same band under either choice (C\'s fixtures with the savings taken out)', () => {
    for (const fx of fixtures) {
      const { savings, ...rest } = fx.inputs;
      void savings;
      const hc = householdC(rest, ENV, 'cash');
      if (!hc || !(enginePlan(hc, ENV).totalPots > 0) || enginePlan(hc, ENV).totalIsa > 0) continue;
      const futures = futuresList(40, enginePlan(hc, ENV).years, ENV);
      const a = createBandSolver(enginePlan(hc, ENV), futures).solve();
      const b = createBandSolver(enginePlan(householdC(rest, ENV, 'invested'), ENV), futures).solve();
      const none = createBandSolver(enginePlan(householdC(rest, ENV, undefined), ENV), futures).solve();
      expect(b).toEqual(a);
      expect(none).toEqual(a);
    }
  });

  it('with savings, the fast search is the reference search at each choice (a C fixture with savings)', () => {
    const fx = fixtures.find((f) => (f.inputs.savings || 0) > 0) || { inputs: { ...fixtures[0].inputs, savings: 60_000 } };
    for (const isaGrowth of ['cash', 'invested']) {
      const plan = enginePlan(householdC(fx.inputs, ENV, isaGrowth), ENV);
      const futures = futuresList(30, plan.years, ENV);
      expect(createBandSolver(plan, futures).solve().k, isaGrowth).toEqual(createReferenceBandSolver(plan, futures).solve().k);
    }
  }, 60_000);
});

describe('closed forms in the drawing years: a flat future (shares 7%, prices 5%), nothing drawn', () => {
  const flat = () => { const equity = {}, inflation = {}; for (let y = 0; y < 60; y++) { equity[y] = 0.07; inflation[y] = 0.05; } return { equity, inflation }; };
  for (const pct of [0, 0.5]) {
    it(`at ${pct}% charges: "cash" grows the ISA at 4% a year (prices less 1%); "invested" with all shares at 7%; no choice at the fixed 3%`, () => {
      const FLAT = { ...ENV, futures: 1, futureReturns: flat, mix: SHARES };
      const h = householdC({ you: { pot: 300_000, age: 65, statePension: { kind: 'none' } }, savings: 50_000 }, FLAT, undefined);
      const keep = (Y) => Math.pow(1 - pct / 100, Y);
      for (const [isaGrowth, rate] of [['cash', 0.04], ['invested', 0.07], [undefined, 0.03]]) {
        const plan = enginePlan({ ...h, chargesPct: pct, ...(isaGrowth ? { isaGrowth } : {}) }, FLAT);
        const [{ config }] = configsAt(plan, 0);
        const [future] = futuresList(1, plan.years, FLAT);
        const r = simulateFast(config, future);
        const Y = plan.years;
        expect(r.failed).toBe(false);
        expect(rel(r.isa, 50_000 * Math.pow(1 + rate, Y) * keep(Y)), String(isaGrowth)).toBeLessThan(1e-11);
        expect(same(simulate(config, future.returns, future.seed), r)).toBe(true);
      }
    });
  }
});

describe('the saving years', () => {
  const lives = livesList(10, 60, { seed: 0 });

  it('no choice and "invested": today\'s kernels, bit for bit — the savings grow with the pension\'s saving mix', () => {
    const h = saver({ age: 40, pot: 100_000, isa: 30_000, payIn: 500, savingsIn: 200, stopAge: 60, savingRisk: 'adventurous' });
    const plain = savingPlan(h, 60, ENV);
    const inv = savingPlan({ ...h, isaGrowth: 'invested' }, 60, ENV);
    for (const which of ['pension', 'savings']) {
      const a = savingKernel(plain, plain.people[0], lives, which), b = savingKernel(inv, inv.people[0], lives, which);
      expect(Array.from(b.A)).toEqual(Array.from(a.A));
      expect(Array.from(b.b)).toEqual(Array.from(a.b));
      expect(Array.from(b.B)).toEqual(Array.from(a.B));
    }
    expect(JSON.stringify(savingRows(inv, 0, lives[3]))).toBe(JSON.stringify(savingRows(plain, 0, lives[3])));
  });

  it('"cash": the pension\'s kernel and rows never move; the savings get a kernel of their own', () => {
    const h = saver({ age: 40, pot: 100_000, isa: 30_000, payIn: 500, savingsIn: 200, stopAge: 60 });
    const plain = savingPlan(h, 60, ENV);
    const cash = savingPlan({ ...h, isaGrowth: 'cash' }, 60, ENV);
    expect(cash.isaGrowth).toBe('cash');
    expect('isaGrowth' in plain).toBe(false);                            // no choice: the plan is today's, key for key
    const pa = savingKernel(plain, 0, lives, 'pension'), pc = savingKernel(cash, 0, lives, 'pension');
    expect(Array.from(pc.A)).toEqual(Array.from(pa.A));
    expect(Array.from(pc.B)).toEqual(Array.from(pa.B));
    const sc = savingKernel(cash, 0, lives, 'savings');
    expect(Array.from(sc.B)).not.toEqual(Array.from(pa.B));
    expect(Array.from(sc.priceAtStop)).toEqual(Array.from(pa.priceAtStop));
    const rowsPlain = savingRows(plain, 0, lives[2]), rowsCash = savingRows(cash, 0, lives[2]);
    rowsCash.forEach((r, k) => {
      expect([r.potStart, r.paidIn.total, r.growth, r.charge, r.potEnd]).toEqual([rowsPlain[k].potStart, rowsPlain[k].paidIn.total, rowsPlain[k].growth, rowsPlain[k].charge, rowsPlain[k].potEnd]);
    });
  });

  it('"cash": the savings kernel does not depend on the mix, saving or drawing', () => {
    const h = { ...saver({ age: 40, pot: 100_000, isa: 30_000, savingsIn: 200, stopAge: 60 }), isaGrowth: 'cash' };
    const a = savingKernel(savingPlan(h, 60, { ...ENV, savingMix: SHARES, mix: SHARES }), 0, lives, 'savings');
    const b = savingKernel(savingPlan(h, 60, { ...ENV, savingMix: CASH, mix: { equity: 0.2, bond: 0.7, cash: 0.1 } }), 0, lives, 'savings');
    expect(Array.from(b.A)).toEqual(Array.from(a.A));
    expect(Array.from(b.B)).toEqual(Array.from(a.B));
  });

  it('"cash" closed form: flat shares 6%, prices π, charge q — the savings at the stop (today\'s prices) within 1p', () => {
    for (const [pi, q, S, P, c] of [[0.03, 0, 15, 40_000, 300], [0.05, 0.005, 25, 0, 500], [0.008, 0.005, 10, 60_000, 0], [0.025, 0.01, 1, 10_000, 1_000]]) {
      const env = { ...ENV, futures: 1, futureReturns: flatLife(0.06, pi), savingMix: SHARES, mix: SHARES };
      const h = { ...saver({ age: 60 - S, pot: 200_000, isa: P, payIn: 700, savingsIn: c, stopAge: 60, charge: q }), isaGrowth: 'cash' };
      const plan = savingPlan(h, 60, env);
      const L = livesList(1, S + 1, env);
      const [you] = potsByPerson(plan, L);
      const Q = Math.pow(1 + Math.max(0, pi - 0.01), 1 / 12) * Math.pow(1 - q, 1 / 12);
      let nominal = P * Math.pow(Q, 12 * S);
      for (let y = 0; y < S; y++) nominal += c * Math.pow(1 + pi, y) * Q * (Math.pow(Q, 12) - 1) / (Q - 1) * Math.pow(Q, 12 * (S - 1 - y));
      const want = nominal / Math.pow(1 + pi, S);
      expect(Math.abs(you.savings[0] - want), `π ${pi} q ${q} S ${S}`).toBeLessThan(0.01);
      // the trace: each month's savings end is (start + paid in) × the cash factor × the charge factor
      const rows = savingRows(plan, 0, L[0]);
      for (const r of rows) expect(rel(r.savingsEnd, (r.savingsStart + r.savingsIn) * Q)).toBeLessThan(1e-12);
      if (rows.length) expect(Math.abs(rows[rows.length - 1].savingsEnd / priceLevels(L[0], S)[S] - want)).toBeLessThan(0.01);
    }
  });

  it('shares far ahead of cash: "invested" ends the saving years with more savings than "cash" in every life; with nothing in savings, the same', () => {
    const env = { ...ENV, futures: 8 };
    const L = livesList(8, 40, env);
    const h = saver({ age: 40, pot: 100_000, isa: 50_000, savingsIn: 300, stopAge: 65, risk: 'adventurous' });
    const inv = potsByPerson(savingPlan({ ...h, isaGrowth: 'invested' }, 65, { ...env, futureReturns: flatLife(0.08, 0.02) }), livesList(8, 40, { ...env, futureReturns: flatLife(0.08, 0.02) }))[0];
    const cash = potsByPerson(savingPlan({ ...h, isaGrowth: 'cash' }, 65, { ...env, futureReturns: flatLife(0.08, 0.02) }), livesList(8, 40, { ...env, futureReturns: flatLife(0.08, 0.02) }))[0];
    for (let i = 0; i < 8; i++) expect(inv.savings[i]).toBeGreaterThan(cash.savings[i]);
    const none = saver({ age: 40, pot: 100_000, isa: 0, savingsIn: 0, stopAge: 65 });
    const a = potsByPerson(savingPlan({ ...none, isaGrowth: 'cash' }, 65, env), L)[0];
    const b = potsByPerson(savingPlan({ ...none, isaGrowth: 'invested' }, 65, env), L)[0];
    expect(Array.from(a.savings)).toEqual(Array.from(b.savings));
    expect(Array.from(a.pension)).toEqual(Array.from(b.pension));
  });
});

describe('the stop: saving years then drawing years, at each choice', () => {
  it('a stop now: the band on the stop runner is the band read off each life by today\'s engine, at each choice', () => {
    for (const isaGrowth of ['cash', 'invested']) {
      for (const h of [
        saver({ age: 62, pot: 300_000, isa: 80_000, stopAge: 62 }),
        saver({ age: 66, pot: 150_000, stopAge: 66, partner: { age: 63, pot: 250_000, isa: 40_000 } })
      ]) {
        const sp = stopAtPlan({ ...h, isaGrowth }, h.people[0].age, { ...ENV, futures: 12 });
        const runner = createStopRunner(sp);
        expect(perLifeBandReference(sp, runner, sp.S), isaGrowth).toEqual(bandAt(sp, runner).monthly);
      }
    }
  }, 60_000);

  it('after saving years, all shares, "invested": the same (the savings follow the shares in both phases)', () => {
    const env = { ...ENV, futures: 12, mix: SHARES, savingMix: SHARES };
    const h = { ...saver({ age: 50, pot: 60_000, isa: 50_000, payIn: 500, savingsIn: 300, stopAge: 58, mix: SHARES }), isaGrowth: 'invested' };
    const sp = stopAtPlan(h, 58, env);
    const runner = createStopRunner(sp);
    expect(perLifeBandReference(sp, runner, sp.S)).toEqual(bandAt(sp, runner).monthly);
  }, 60_000);

  it('the savings at the stop are the savings kernel\'s: "cash" and "invested" differ, the pensions do not', () => {
    const h = saver({ age: 45, pot: 120_000, isa: 40_000, payIn: 600, savingsIn: 250, stopAge: 62 });
    const a = stopAtPlan({ ...h, isaGrowth: 'cash' }, 62, { ...ENV, futures: 20 });
    const b = stopAtPlan({ ...h, isaGrowth: 'invested' }, 62, { ...ENV, futures: 20 }, a.lives);
    for (let i = 0; i < a.n; i++) {
      expect(a.pots[0].pension[i]).toBe(b.pots[0].pension[i]);
      expect(a.pots[0].savings[i]).not.toBe(b.pots[0].savings[i]);
      expect(rel(a.pots[0].savings[i], a.kernels[0].savings.A[i] + 250 * a.kernels[0].savings.B[i])).toBeLessThan(1e-12);
    }
  });
});

describe('the one default', () => {
  it('V7\'s rule is today\'s planner\'s default: "Mostly cash"', () => {
    expect(RULES.isaGrowthDefault).toBe(DEFAULT_ISA_GROWTH);
    expect(RULES.isaGrowthDefault).toBe('cash');
  });
});

/*
 * The saving years year by year, per life (savingYearsByLife; research/saver-lock-and-savings-growth.md 4.2): the engine
 * primitive a saver's locked path is drawn from — the same factors as the kernels run forward month by month, each year's
 * start recorded in pounds of the day, with the price level and what has been paid in.
 */
import { savingYearsByLife } from '../../../src/answers/shared/saving.js';

describe('the saving years, year by year (savingYearsByLife)', () => {
  const lives = livesList(12, 40, { seed: 0 });

  it('payments rising with prices: at the stop, in today\'s prices, the pots are potsByPerson\'s to 1e-9 — at each choice, and with none', () => {
    for (const isaGrowth of [undefined, 'cash', 'invested']) {
      const h = { ...saver({ age: 45, pot: 120_000, isa: 40_000, payIn: 600, savingsIn: 250, stopAge: 62 }), ...(isaGrowth ? { isaGrowth } : {}) };
      const plan = savingPlan(h, 62, ENV);
      const yrs = savingYearsByLife(plan, 0, lives);
      const [you] = potsByPerson(plan, lives);
      const W = yrs.S + 1;
      expect(yrs.S).toBe(17);
      expect(yrs.n).toBe(lives.length);
      for (let i = 0; i < lives.length; i++) {
        const P = yrs.price[i * W + yrs.S];
        expect(rel(yrs.pension[i * W + yrs.S] / P, you.pension[i]), `${isaGrowth} life ${i}`).toBeLessThan(1e-9);
        expect(rel(yrs.savings[i * W + yrs.S] / P, you.savings[i]), `${isaGrowth} life ${i}`).toBeLessThan(1e-9);
        expect([yrs.pension[i * W], yrs.savings[i * W], yrs.price[i * W], yrs.paidIn[i * W]]).toEqual([120_000, 40_000, 1, 0]);
        expect(yrs.price[i * W + 5]).toBe(priceLevels(lives[i], 5)[5]);
      }
    }
  });

  it('the rows of each year are savingRows\' at the turn of the year', () => {
    const h = { ...saver({ age: 50, pot: 90_000, isa: 20_000, payIn: 400, savingsIn: 100, stopAge: 58 }), isaGrowth: 'cash' };
    const plan = savingPlan(h, 58, ENV);
    const yrs = savingYearsByLife(plan, 0, lives);
    const W = yrs.S + 1;
    for (const i of [0, 7]) {
      const rows = savingRows(plan, 0, lives[i]);
      let paid = 0;
      for (let y = 1; y <= yrs.S; y++) {
        const last = rows[12 * y - 1];
        for (let m = 12 * (y - 1); m < 12 * y; m++) paid += rows[m].paidIn.total + rows[m].paidIn.savings;
        expect(rel(yrs.pension[i * W + y], last.potEnd)).toBeLessThan(1e-12);
        expect(rel(yrs.savings[i * W + y], last.savingsEnd)).toBeLessThan(1e-12);
        expect(rel(yrs.paidIn[i * W + y], paid)).toBeLessThan(1e-12);
      }
    }
  });

  it('payments fixed in pounds of the day, raised by a share a year (today\'s planner): the closed form on a flat life', () => {
    const env = { ...ENV, futures: 1, futureReturns: flatLife(0.05, 0.03), savingMix: SHARES, mix: SHARES };
    const L = livesList(1, 20, env);
    const h = { ...saver({ age: 50, pot: 100_000, isa: 10_000, payIn: 500, savingsIn: 200, stopAge: 60, charge: 0 }), isaGrowth: 'cash' };
    const plan = savingPlan(h, 60, env);
    const yrs = savingYearsByLife(plan, 0, L, { escalation: 0.02 });
    const q = Math.pow(1.05, 1 / 12), qc = Math.pow(1.02, 1 / 12);           // shares 5%; cash at prices 3% less 1%
    let pot = 100_000, sav = 10_000, paid = 0;
    for (let y = 0; y < 10; y++) {
      const pay = 500 * Math.pow(1.02, y), payS = 200 * Math.pow(1.02, y);
      for (let m = 0; m < 12; m++) { pot = (pot + pay) * q; sav = (sav + payS) * qc; paid += pay + payS; }
      expect(rel(yrs.pension[y + 1], pot), `y ${y + 1}`).toBeLessThan(1e-12);
      expect(rel(yrs.savings[y + 1], sav), `y ${y + 1}`).toBeLessThan(1e-12);
      expect(rel(yrs.paidIn[y + 1], paid), `y ${y + 1}`).toBeLessThan(1e-12);
      expect(rel(yrs.price[y + 1], Math.pow(1.03, y + 1))).toBeLessThan(1e-12);
    }
  });

  it('a stop now: one column, the pots as given; plain numbers only', () => {
    const plan = savingPlan(saver({ age: 60, pot: 80_000, isa: 5_000, stopAge: 60 }), 60, ENV);
    const yrs = savingYearsByLife(plan, 0, lives);
    expect(yrs.S).toBe(0);
    expect(Array.from(yrs.pension)).toEqual(new Array(lives.length).fill(80_000));
    expect(Array.from(yrs.savings)).toEqual(new Array(lives.length).fill(5_000));
    expect(() => savingYearsByLife(savingPlan(saver({ age: 30, stopAge: 70 }), 70, ENV), 0, livesList(2, 20, { seed: 0 }))).toThrow(/shorter/);
  });
});
