/**
 * Fund and platform charges in V7's numbers (6.19.0; research/charges-setting.md T11, T12): the household's one charge,
 * `household.chargesPct` (percent a year), taken monthly while saving AND while drawing.
 *
 *   - the replica (fastEngine.js) is today's engine at every charge, run by run, to the bit — the ordinary path and the
 *     locked run (against chain.mjs, the chain of today's `simulate`);
 *   - the adapter hands the household's charge to every drawing run; a household without one runs without (absent = 0
 *     at the engine level — V7's household model supplies the 0.5 default, not the engine);
 *   - the saving years read the same household charge, with the same monthly factor, and are today's `simulate` over
 *     the same years at that charge;
 *   - closed forms in the drawing years; more charge never gives a larger careful amount or fewer failures.
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
import { savingPlan, savingKernel } from '../../../src/answers/shared/saving.js';
import { stopAtPlan, createStopRunner, verdictAt } from '../../../src/answers/shared/stopAt.js';
import { livesList, sliceReturns } from '../../../src/answers/shared/lives.js';
import { SAVING } from '../../../src/answers/shared/rules.js';
import { ISA_DEFAULTS } from '../../../src/constants.js';
import { monthlyChargeFactor, DEFAULT_CHARGES_PCT } from '../../../src/services/Charges.js';
import { arbitraryInputs } from '../gen/arbitrary.mjs';
import { saver, priceLevels, flatLife } from '../saving/invariants.js';
import { chainRun } from '../saving/chain.mjs';

const TODAY = '2026-09-30';
const ENV = { today: TODAY, futures: 40, seed: 0, trace: false };
const FIXTURES = resolve(process.cwd(), 'tests/v7/fixtures/c');
const fixtures = readdirSync(FIXTURES).filter((f) => f.endsWith('.json')).map((f) => JSON.parse(readFileSync(resolve(FIXTURES, f), 'utf8')));
const CHARGES = [0, 0.05, 0.5, 1.35, 3];

/**
 * C's household for some inputs, with a charge — or, with `chargesPct` undefined, with NO charge at all: the model now
 * writes the 0.5 default (and C's inputs carry it), so the engine's "absent = 0" is tested on a household stripped of it.
 * null when the inputs do not check.
 */
function householdC(inputs, env, chargesPct) {
  const checked = checkInputs(SCHEMA_C, inputs, env);
  if (!checked.ok) return null;
  const { household } = toHousehold(checked.inputs, env);
  if (chargesPct !== undefined) return { ...household, chargesPct };
  const { chargesPct: given, ...without } = household;
  void given;
  return without;
}

const same = (a, b) => a.failed === b.failed && a.failMonth === b.failMonth && a.finalEquity === b.equity && a.finalBond === b.bond && a.finalCash === b.cash && a.finalIsa === b.isa;

describe('the replica is today\'s engine at every charge, run by run, to the bit', () => {
  it('fastEligible takes a valid charge and refuses an invalid one (that config goes to simulate)', () => {
    const h = householdC(fixtures[0].inputs, ENV, 0.5);
    const [{ config }] = configsAt(enginePlan(h, ENV), 20_000);
    expect(config.chargesPct).toBe(0.5);
    expect(fastEligible(config)).toBe(true);
    for (const v of [0, 0.05, 3]) expect(fastEligible({ ...config, chargesPct: v })).toBe(true);
    for (const v of [-0.05, 3.05, NaN, '0.5', null]) expect(fastEligible({ ...config, chargesPct: v }), String(v)).toBe(false);
    const { chargesPct, ...without } = config;
    void chargesPct;
    expect(fastEligible(without)).toBe(true);
  });

  it('the fixtures and 30 random households, at 0, 0.05, 0.5, 1.35 and 3% and at six amounts: failed, the month and the end pots', () => {
    const env = { today: TODAY, seed: 0 };
    const random = fc.sample(arbitraryInputs(SCHEMA_C, env), { seed: 20261001, numRuns: 30 });
    let compared = 0;
    for (const inputs of [...fixtures.map((f) => f.inputs), ...random]) {
      const h0 = householdC(inputs, env);
      if (!h0) continue;
      for (const pct of CHARGES) {
        const plan = enginePlan({ ...h0, chargesPct: pct }, env);
        if (!(plan.totalPots > 0)) break;
        const futures = futuresList(8, plan.years, env);
        const kLow = Math.floor(plan.guaranteedAtStartAYear / 120 + 1e-9);
        for (const dk of [0, 3, 30, 90, 200, 600]) {
          for (const { config } of configsAt(plan, (kLow + dk) * 120)) {
            expect(config.chargesPct).toBe(pct);
            if (!fastEligible(config)) continue;
            for (const f of futures) {
              const a = simulate(config, f.returns, f.seed);
              const b = simulateFast(config, f);
              if (!same(a, b)) expect.fail(`differs at ${pct}%: ${JSON.stringify(inputs)} future ${f.id}: engine ${JSON.stringify([a.failed, a.failMonth, a.finalEquity, a.finalBond, a.finalCash, a.finalIsa])} replica ${JSON.stringify(b)}`);
              compared++;
            }
          }
        }
      }
    }
    expect(compared).toBeGreaterThan(2000);
  }, 120_000);

  it('the locked run with a charge is the chain of today\'s engine (all-shares mix): the pension sleeves are charged while closed', () => {
    const SHARES = { equity: 1, bond: 0, cash: 0 };
    const env = { ...ENV, futures: 20, mix: SHARES, savingMix: SHARES };
    for (const pct of [0.5, 2]) {
      for (const [stopAge, L] of [[55, 2], [53, 4]]) {
        const h = { ...saver({ age: 50, pot: 250_000, isa: 70_000, payIn: 400, savingsIn: 150, stopAge, mix: SHARES }), chargesPct: pct };
        const sp = stopAtPlan(h, stopAge, env);
        const runner = createStopRunner(sp);
        let lasted = 0;
        for (const H of [15_000, 26_000]) {
          for (let i = 0; i < sp.n; i++) {
            const [{ config }] = configsAt(sp.plan, H, sp.potsOf(i));
            expect(config.lockedMonths).toBe(12 * L);
            expect(config.chargesPct).toBe(pct);
            const fast = runner.run(0, i, runner.configsAtH(H, i)[0].config);
            const chain = chainRun(config, sp.lives[i], sp.S);
            expect([fast.failed, fast.failMonth], `${pct}% H ${H} life ${i}`).toEqual([chain.failed, chain.failMonth]);
            if (!fast.failed) {
              expect(Math.abs(fast.equity - chain.equity) / Math.max(1, chain.equity)).toBeLessThan(1e-9);
              expect(Math.abs(fast.isa - chain.isa) / Math.max(1, chain.isa)).toBeLessThan(1e-9);
              lasted++;
            }
          }
        }
        expect(lasted).toBeGreaterThan(0);
      }
    }
  }, 60_000);
});

describe('the adapter hands the household\'s charge to every run', () => {
  it('a valid household charge is on every run\'s config; none (or an invalid one) leaves the config as it was', () => {
    const inputs = { you: { pot: 300_000, age: 62 }, savings: 40_000, household: 'couple', partner: { pot: 120_000, age: 60 } };
    const h = householdC(inputs, ENV);
    expect(h).not.toBeNull();
    const plain = configsAt(enginePlan(h, ENV), 30_000);
    expect(plain.every(({ config }) => !('chargesPct' in config))).toBe(true);
    for (const v of [NaN, -1, 4, '0.5']) expect(configsAt(enginePlan({ ...h, chargesPct: v }, ENV), 30_000)).toEqual(plain);
    const charged = configsAt(enginePlan({ ...h, chargesPct: 1.25 }, ENV), 30_000);
    expect(charged.length).toBe(plain.length);
    charged.forEach(({ config }, r) => expect(config).toEqual({ ...plain[r].config, chargesPct: 1.25 }));
  });

  it('a household at 0% runs exactly as one without a charge (a C fixture\'s band)', () => {
    const h = householdC(fixtures[0].inputs, ENV);
    const futures = futuresList(40, enginePlan(h, ENV).years, ENV);
    const a = createBandSolver(enginePlan(h, ENV), futures).solve();
    const b = createBandSolver(enginePlan({ ...h, chargesPct: 0 }, ENV), futures).solve();
    expect(b).toEqual(a);
  });
});

describe('closed forms in the drawing years: a flat future, 0% on everything, the pension in cash, nothing drawn', () => {
  const FLAT = { ...ENV, futures: 1, futureReturns: () => ({ equity: {}, inflation: {} }), mix: { equity: 0, bond: 0, cash: 1 } };
  for (const pct of [0.05, 0.5, 3]) {
    it(`at ${pct}%: the pension ends at pot × (1 − c)^years, the ISA at isa × ((1 + 3%)(1 − c))^years`, () => {
      const h = householdC({ you: { pot: 300_000, age: 65, statePension: { kind: 'none' } }, savings: 50_000 }, FLAT, pct);
      const plan = enginePlan(h, FLAT);
      const [{ config }] = configsAt(plan, 0);
      const [future] = futuresList(1, plan.years, FLAT);
      const r = simulateFast(config, future);
      const Y = plan.years;
      expect(r.failed).toBe(false);
      expect(Math.abs(r.cash / (300_000 * Math.pow(1 - pct / 100, Y)) - 1)).toBeLessThan(1e-12);
      expect(Math.abs(r.isa / (50_000 * Math.pow((1 + ISA_DEFAULTS.RETURN) * (1 - pct / 100), Y)) - 1)).toBeLessThan(1e-11);
      expect(same(simulate(config, future.returns, future.seed), r)).toBe(true);
    });
  }
});

describe('the saving years read the same charge', () => {
  it('household.chargesPct (percent) is the charge; the factor is the shared one; at 0.5 it is the factor the saving years always used', () => {
    const h = saver({ age: 45, pot: 100_000, stopAge: 60, charge: 0.005 });
    const before = savingPlan(h, 60, ENV);
    expect(before.chargeM).toBe(Math.pow(1 - 0.005, 1 / 12));
    expect(savingPlan({ ...h, chargesPct: 0.5 }, 60, ENV).chargeM).toBe(before.chargeM);
    expect(savingPlan({ ...h, chargesPct: 1.35 }, 60, ENV).chargeM).toBe(monthlyChargeFactor(1.35));
    expect(savingPlan({ ...h, chargesPct: 0 }, 60, ENV).chargeM).toBe(1);
    expect(savingPlan({ ...h, chargesPct: 1.35 }, 60, ENV).chargesPct).toBe(1.35);
    // the household's charge wins over the older saving.charge
    expect(savingPlan({ ...h, saving: { ...h.saving, charge: 0.02 }, chargesPct: 0.25 }, 60, ENV).chargeM).toBe(monthlyChargeFactor(0.25));
    // a household with neither (a saving block without a charge): the shared default, 0.5%
    const { saving, chargesPct, ...noSaving } = h;
    void saving; void chargesPct;
    expect(savingPlan(noSaving, 60, ENV).chargeM).toBe(monthlyChargeFactor(DEFAULT_CHARGES_PCT));
    // an older household that carries only the saving-years share: read as before, to the bit
    expect(savingPlan({ ...noSaving, saving: { risk: 'balanced', charge: 0.012 } }, 60, ENV).chargeM).toBe(Math.pow(1 - 0.012, 1 / 12));
    expect(SAVING.chargesPct).toBe(DEFAULT_CHARGES_PCT);
  });

  it('all shares, nothing paid in, charged: the pot at the stop is today\'s simulate at the same charge over the same years, to 1p', () => {
    const SHARES = { equity: 1, bond: 0, cash: 0 };
    const lives = livesList(12, 40, { seed: 0 });
    for (const pct of [0.5, 1.75]) {
      for (const S of [1, 10, 25]) {
        const h = { ...saver({ age: 70 - S, pot: 250_000, stopAge: 70, charge: 0 }), chargesPct: pct };
        const plan = savingPlan(h, 70, { ...ENV, savingMix: SHARES, mix: SHARES });
        const kern = savingKernel(plan, plan.people[0], lives);
        const idle = saver({ age: 60, pot: 250_000, stopAge: 60, sp: 'none', mix: SHARES });
        const [{ config: c0 }] = configsAt(enginePlan({ ...idle, chargesPct: pct }, { today: TODAY }), 0);
        const config = { ...c0, years: S, duration: S, targetSchedule: new Array(S).fill(0), baseSalary: 0 };
        expect(config.chargesPct).toBe(pct);
        for (let i = 0; i < lives.length; i++) {
          const sim = simulate(config, sliceReturns(lives[i], 0, S), lives[i].seed);
          const nominal = kern.A[i] * priceLevels(lives[i], S)[S];
          expect(Math.abs(nominal - sim.finalEquity), `${pct}% S ${S} life ${i}`).toBeLessThan(0.01);
        }
      }
    }
  });
});

describe('more charge never gives more', () => {
  it('C: the careful, middling and good amounts never rise as the charge rises (the fixtures, 40 futures), and the fast search is the reference search', () => {
    for (const fx of fixtures) {
      const h0 = householdC(fx.inputs, ENV);
      if (!h0) continue;
      let last = null;
      for (const pct of [0, 0.5, 1, 3]) {
        const plan = enginePlan({ ...h0, chargesPct: pct }, ENV);
        if (!(plan.totalPots > 0)) break;
        const futures = futuresList(40, plan.years, ENV);
        const fast = createBandSolver(plan, futures).solve();
        if (pct === 0.5) expect(createReferenceBandSolver(plan, futures).solve().k).toEqual(fast.k);
        if (last) for (const w of ['careful', 'middling', 'good']) expect(fast.k[w], `${fx.id} ${w} at ${pct}%`).toBeLessThanOrEqual(last[w]);
        last = fast.k;
      }
    }
  }, 60_000);

  it('A and B (the stop and the lives): the failures at a spend never fall as the charge rises', () => {
    const env = { ...ENV, futures: 30 };
    const h0 = saver({ age: 50, pot: 200_000, isa: 30_000, payIn: 600, savingsIn: 100, stopAge: 60 });
    let last = -1;
    for (const pct of [0, 0.5, 1, 2]) {
      const sp = stopAtPlan({ ...h0, chargesPct: pct }, 60, env);
      const v = verdictAt(sp, createStopRunner(sp), 24_000);
      expect(v.fails, `${pct}%`).toBeGreaterThanOrEqual(last);
      last = v.fails;
    }
    expect(last).toBeGreaterThan(0);
  }, 60_000);

  it('the saving years at a flat 0%: the pot at the stop falls by exactly (1 − c)^S', () => {
    const env = { ...ENV, futures: 3, futureReturns: flatLife(0, 0), mix: { equity: 0, bond: 0, cash: 1 }, savingMix: { equity: 1, bond: 0, cash: 0 } };
    const lives = livesList(3, 30, env);
    for (const pct of [0.5, 2.5]) {
      const plan = savingPlan({ ...saver({ age: 45, pot: 100_000, stopAge: 60, charge: 0 }), chargesPct: pct }, 60, env);
      const k = savingKernel(plan, plan.people[0], lives);
      for (let i = 0; i < 3; i++) expect(Math.abs(k.A[i] / (100_000 * Math.pow(1 - pct / 100, 15)) - 1)).toBeLessThan(1e-10);   // prices rise by 1e-12 a year (futures.js FLAT_PRICES)
    }
  });
});
