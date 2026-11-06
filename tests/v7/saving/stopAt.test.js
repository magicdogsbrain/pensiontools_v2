/**
 * The join (step 4 brief 4.5, 4.6): the saving years handed to today's engine, per life, through C's adapter and fast
 * path. What is fixed in place here:
 *   - every config the adapter builds under start 'asGiven' is one the fast path covers (a locked config must never
 *     reach `simulate`, which cannot keep a pension shut);
 *   - X1's engine half: at a stop of today's age, the band on the stop runner is C's band on futuresList, amount for
 *     amount, fail count for fail count, run-out month for run-out month;
 *   - at any stop age with an all-shares mix, each life's run is `simulate` on the same config with that life's pots
 *     and annualNominal(life, 12S, D) (the bond stream then plays no part);
 *   - the work each solve does (1 run per life for a verdict, a band in a few runs per life, ≤ 14 verdicts for the pot);
 *   - the pot needed: the least whole £1,000 that works, and £1,000 less does not.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import fc from 'fast-check';
import {
  stopAtPlan, createStopRunner, verdictAt, verdictAtPot, bandAt, potNeeded, phasesAt, monthlyAt, enginePlan, configsAt, breakdownAt,
  fastEligible, futuresList, createBandSolver, simulate, sliceReturns, checkInputs, toHouseholdC, SCHEMA_C, SAVING, TEST_ENV,
  verdictOf, bandIndexes, livesList
} from './_saving.js';
import { saver } from './invariants.js';
import { arbitraryInputs } from '../gen/arbitrary.mjs';
import { stopsOf } from '../../../src/answers/shared/household.js';

const SEED = 20261003;
const SHARES = { equity: 1, bond: 0, cash: 0 };
const FIXTURES = resolve(process.cwd(), 'tests/v7/fixtures/c');
const fixtures = readdirSync(FIXTURES).filter((f) => f.endsWith('.json')).map((f) => JSON.parse(readFileSync(resolve(FIXTURES, f), 'utf8')));

/** Random saver households: one or two people, pots, pay-ins, savings, stop ages either side of 55/57, part-time work, a final-salary pension. */
const saverArb = fc.record({
  age: fc.integer({ min: 30, max: 66 }), gap: fc.integer({ min: 0, max: 20 }),
  pot: fc.constantFrom(0, 1, 30_000, 150_000, 600_000), isa: fc.constantFrom(0, 20_000, 90_000),
  payIn: fc.constantFrom(0, 250, 900), savingsIn: fc.constantFrom(0, 300),
  risk: fc.constantFrom('cautious', 'balanced', 'adventurous'), savingRisk: fc.constantFrom('cautious', 'balanced', 'adventurous'),
  work: fc.option(fc.record({ yearly: fc.constantFrom(12_000, 30_000), years: fc.integer({ min: 1, max: 6 }) }), { freq: 3 }),
  fs: fc.option(fc.record({ yearly: fc.constantFrom(6_000, 15_000), fromAge: fc.constantFrom(55, 60, 65) }), { freq: 4 }),
  partner: fc.option(fc.record({ age: fc.integer({ min: 30, max: 66 }), pot: fc.constantFrom(0, 50_000, 400_000), isa: fc.constantFrom(0, 30_000), payIn: fc.constantFrom(0, 400) }), { freq: 2 }),
  endAge: fc.constantFrom(90, 95, 100)
}).map((k) => {
  const stopAge = Math.min(75, k.age + k.gap);
  return { stopAge, h: saver({ age: k.age, pot: k.pot, isa: k.isa, payIn: k.payIn, savingsIn: k.savingsIn, stopAge, risk: k.risk, savingRisk: k.savingRisk, work: k.work, finalSalary: k.fs, partner: k.partner, endAge: k.endAge }) };
});

describe('every config the adapter builds under asGiven is covered by the fast path', () => {
  it('120 random saver households (locked pensions, couples, part-time work, final-salary pensions), at five amounts, per life', () => {
    const env = { ...TEST_ENV, futures: 6 };
    let configs = 0, locked = 0, work = 0;
    for (const { h, stopAge } of fc.sample(saverArb, { seed: SEED, numRuns: 120 })) {
      const sp = stopAtPlan(h, stopAge, env);
      const runner = createStopRunner(sp);
      for (const run of sp.plan.runs) expect(fastEligible(run.base), JSON.stringify(run.base)).toBe(true);
      for (const H of [0, 6_000, 24_000, 60_000, 200_000]) {
        for (let i = 0; i < sp.n; i++) {
          for (const { config } of runner.configsAtH(H, i)) {
            expect(fastEligible(config)).toBe(true);
            configs++;
            if (config.lockedMonths > 0) locked++;
            if ((config.extraIncomes || []).some((e) => e.endYear !== null && e.endYear !== undefined)) work++;
          }
        }
      }
    }
    expect(configs).toBeGreaterThan(1000);
    expect(locked).toBeGreaterThan(20);
    expect(work).toBeGreaterThan(20);
  });

  it('a locked config never reaches simulate: the runner refuses it rather than draw a closed pension', () => {
    const sp = stopAtPlan(saver({ age: 50, pot: 200_000, isa: 60_000, stopAge: 53 }), 53, { ...TEST_ENV, futures: 3 });
    expect(sp.plan.runs[0].base.lockedMonths).toBe(12 * 4);
    const runner = createStopRunner(sp);
    const [{ config }] = runner.configsAtH(24_000, 0);
    expect(() => runner.run(0, 0, { ...config, trace: true })).toThrow();
  });
});

describe('X1, the engine half: a stop at today\'s age is question C', () => {
  const env = { today: TEST_ENV.today, futures: 40, seed: 0 };
  // 40 random households (30 before 6.19.0: C's list gained the charge, which moved the draws, and 30 then gave 11 that
  // start today with every pension open)
  const households = [...fixtures.map((f) => f.inputs), ...fc.sample(arbitraryInputs(SCHEMA_C, env), { seed: SEED, numRuns: 40 })];

  it('the fixtures and 40 random C households, where C starts today with every pension open: the band, the fail counts and the run-out months equal C\'s', () => {
    let compared = 0;
    for (const inputs of households) {
      const checked = checkInputs(SCHEMA_C, inputs, env);
      if (!checked.ok) continue;
      const { household } = toHouseholdC(checked.inputs, env);
      const plan = enginePlan(household, env);
      if (!(plan.totalPots > 0) || plan.yearsFromNow > 0 || plan.lockedUntil.length) continue;
      // C from now is today's answer only when both have stopped (couples-different-years.md 5.1): a partner who stops at
      // an age of their own is answered on the lives, each at their own stop (tests/v7/shared/apart.*)
      if (new Set(stopsOf(household, env.today).map((x) => x.S)).size > 1) continue;
      const futures = futuresList(env.futures, plan.years, env);
      const solver = createBandSolver(plan, futures);
      const want = solver.solve();
      const sp = stopAtPlan(household, household.people[0].age, env);
      expect(sp.S).toBe(0);
      const band = bandAt(sp, createStopRunner(sp));
      expect(band.k).toEqual(want.k);
      expect(band.fails).toEqual(want.fails);
      for (const which of ['careful', 'middling', 'good']) expect(band.runOutMonths[which]).toEqual(solver.runOutMonthsAt(want.k[which]));
      // the verdict at an amount is C's `take`: the same run-out months
      const spend = want.k.middling * 10 + 30;
      const v = verdictAt(sp, createStopRunner(sp), spend * 12);
      expect(v.runOutMonths).toEqual(solver.runOutMonthsAtMonthly(spend));
      compared++;
    }
    expect(compared).toBeGreaterThan(12);
  }, 60_000);
});

describe('any stop age, an all-shares mix: each life is simulate on its own pots', () => {
  it('singles, couples and part-time work: failed and the month equal simulate(configsAt(plan, H, pots_i), annualNominal(life, 12S, D))', () => {
    const env = { ...TEST_ENV, futures: 12, mix: SHARES, savingMix: SHARES };
    const cases = [
      { h: saver({ age: 45, pot: 150_000, payIn: 600, stopAge: 60, mix: SHARES }), stopAge: 60 },
      { h: saver({ age: 40, pot: 80_000, isa: 30_000, payIn: 900, savingsIn: 200, stopAge: 62, mix: SHARES, work: { yearly: 18_000, years: 3 } }), stopAge: 62 },
      { h: saver({ age: 50, pot: 300_000, payIn: 300, stopAge: 58, mix: SHARES, partner: { age: 49, pot: 100_000, isa: 40_000, payIn: 500 } }), stopAge: 58 },
      { h: saver({ age: 58, pot: 400_000, stopAge: 66, mix: SHARES, finalSalary: { yearly: 9_000, fromAge: 65 } }), stopAge: 66 }
    ];
    let compared = 0;
    for (const { h, stopAge } of cases) {
      const sp = stopAtPlan(h, stopAge, env);
      const runner = createStopRunner(sp);
      for (const H of [12_000, 24_000, 36_000, 50_000]) {
        for (let i = 0; i < sp.n; i++) {
          const pots = sp.potsOf(i);
          const want = configsAt(sp.plan, H, pots);
          const got = runner.configsAtH(H, i);
          want.forEach((w, r) => {
            const s = simulate(w.config, sliceReturns(sp.lives[i], sp.S, sp.D), sp.lives[i].seed);
            const f = runner.run(r, i, got[r].config);
            expect([f.failed, f.failMonth], `H ${H} life ${i} run ${r}`).toEqual([s.failed, s.failMonth]);
            expect(Math.abs(f.equity - s.finalEquity)).toBeLessThanOrEqual(1e-9 * Math.max(1, s.finalEquity));
            expect(Math.abs(f.isa - s.finalIsa)).toBeLessThanOrEqual(1e-9 * Math.max(1, s.finalIsa));
            compared++;
          });
        }
      }
    }
    expect(compared).toBeGreaterThan(200);
  });
});

describe('the work each solve does', () => {
  const env = { ...TEST_ENV, futures: 200 };
  const h = saver({ age: 45, pot: 120_000, payIn: 625, stopAge: 60 });

  it('a verdict is one run per life', () => {
    const sp = stopAtPlan(h, 60, env);
    const runner = createStopRunner(sp);
    const v = verdictAt(sp, runner, 24_000);
    expect(runner.evaluations).toBeLessThanOrEqual(sp.n * sp.plan.runs.length);
    expect(v.fails).toBe(v.runOutMonths.filter((m) => m !== null).length);
    expect(v.verdict).toBe(verdictOf(v.fails, sp.n));
    expect(v.lasted).toBe((sp.n - v.fails) / sp.n);
  });

  it('a band: at most 8 runs a life without an estimate; at most 6 with the previous age\'s', () => {
    const sp59 = stopAtPlan(h, 59, env);
    const first = bandAt(sp59, createStopRunner(sp59));
    expect(first.engineRuns / sp59.n).toBeLessThanOrEqual(8);
    const sp60 = stopAtPlan(h, 60, env, sp59.lives);                    // the same lives: T is 50 for both
    const second = bandAt(sp60, createStopRunner(sp60), first.k);
    expect(second.engineRuns / sp60.n).toBeLessThanOrEqual(6);
    // an estimate changes the order of the runs, never an amount
    const cold = bandAt(sp60, createStopRunner(sp60));
    expect(second.k).toEqual(cold.k);
    expect(second.fails).toEqual(cold.fails);
  });

  it('the kernel is one pass per person per stop age; the pay-in is none', () => {
    const sp = stopAtPlan(saver({ age: 45, pot: 120_000, payIn: 625, stopAge: 60, partner: { age: 43, pot: 50_000, payIn: 300 } }), 60, env);
    expect(sp.kernels).toHaveLength(2);
    expect(sp.kernelPasses).toBe(1);
  });
});

describe('the pot needed at the stop', () => {
  const env = { ...TEST_ENV, futures: 100 };

  it('the least whole £1,000 that works: it lasts in 9 in 10, £1,000 less does not; at most 14 verdicts', () => {
    for (const [h, stopAge, spend] of [
      [saver({ age: 45, pot: 120_000, payIn: 625, stopAge: 65 }), 65, 24_000],
      [saver({ age: 50, pot: 50_000, isa: 80_000, payIn: 400, stopAge: 55 }), 55, 20_000],   // the ISA pays the two closed years
      [saver({ age: 40, pot: 200_000, payIn: 800, stopAge: 60, partner: { age: 42, pot: 60_000, payIn: 300 } }), 60, 40_000]
    ]) {
      const sp = stopAtPlan(h, stopAge, env);
      const allowed = Math.floor(sp.n / 10);
      const steps = [];
      const P = potNeeded(sp, createStopRunner(sp), spend, allowed, { onStep: (pot, fails) => steps.push([pot, fails]) });
      expect(P).not.toBe(null);
      expect(P % SAVING.potStep).toBe(0);
      expect(steps.length).toBeLessThanOrEqual(14);
      expect(steps.find(([pot]) => pot === P)[1]).toBeLessThanOrEqual(allowed);
      if (P > 0) {
        const below = steps.find(([pot]) => pot === P - SAVING.potStep);
        const failsBelow = below ? below[1] : verdictAtPot(sp, spend, P - SAVING.potStep).fails;
        expect(failsBelow).toBeGreaterThan(allowed);
      }
    }
  }, 60_000);

  it('monotone: more spending needs a bigger pot; more failures allowed needs a smaller one', () => {
    const sp = stopAtPlan(saver({ age: 45, pot: 120_000, payIn: 625, stopAge: 65 }), 65, env);
    const runner = createStopRunner(sp);
    const a = potNeeded(sp, runner, 18_000, 10);
    const b = potNeeded(sp, runner, 24_000, 10);
    const c = potNeeded(sp, runner, 24_000, 25);
    const d = potNeeded(sp, runner, 24_000, 50);
    expect(a).toBeLessThanOrEqual(b);
    expect(c).toBeLessThanOrEqual(b);
    expect(d).toBeLessThanOrEqual(c);
  }, 60_000);

  it('null when the savings cannot pay the years the pension is closed, whatever the pension (B\'s "outside" comes first)', () => {
    const sp = stopAtPlan(saver({ age: 50, pot: 50_000, isa: 40_000, payIn: 400, stopAge: 55 }), 55, { ...TEST_ENV, futures: 100 });
    expect(verdictAtPot(sp, 20_000, SAVING.potMax).runOutAge).toBeLessThan(57);
    expect(potNeeded(sp, createStopRunner(sp), 20_000, 10)).toBe(null);
  });

  it('null when £5,000,000 is not enough; 0 when the State Pension alone covers it', () => {
    const sp = stopAtPlan(saver({ age: 60, pot: 10_000, payIn: 100, stopAge: 67 }), 67, { ...TEST_ENV, futures: 20 });
    expect(potNeeded(sp, createStopRunner(sp), 900_000, 2)).toBe(null);
    expect(potNeeded(sp, createStopRunner(sp), 6_000, 2)).toBe(0);
  });

  it('monthlyAt: the careful amount with every life\'s pension at a given total rises with that total', () => {
    const sp = stopAtPlan(saver({ age: 45, pot: 120_000, payIn: 625, stopAge: 65 }), 65, { ...TEST_ENV, futures: 60 });
    const runner = createStopRunner(sp);
    const low = monthlyAt(sp, runner, 200_000);
    const high = monthlyAt(sp, runner, 400_000);
    expect(high).toBeGreaterThan(low);
    expect(low % 10).toBe(0);
  });
});

describe('the drawing years under asGiven: the start is the stop, a closed pension waits, part-time work ends', () => {
  it('a stop at 53 with the pension opening at 57: the start never moves; one run carries the pension and the ISA, closed for four years', () => {
    const h = saver({ age: 50, pot: 200_000, isa: 60_000, payIn: 500, stopAge: 53 });
    const sp = stopAtPlan(h, 53, { ...TEST_ENV, futures: 5 });
    expect(sp.plan.startAge).toBe(53);
    expect(sp.plan.startMoved).toBe(false);
    expect(sp.plan.yearsFromNow).toBe(3);
    expect(sp.plan.lockedUntil).toEqual([{ who: 'you', untilAge: 57, years: 4 }]);
    expect(sp.plan.runs).toHaveLength(1);
    expect(sp.plan.runs[0].base.lockedMonths).toBe(48);
    expect(sp.plan.periods[0]).toMatchObject({ from: 0, to: 4 });
    // C's own plan of the same household moves the start to 57
    expect(enginePlan(h, { today: TEST_ENV.today }).startAge).toBe(57);
  });

  it('the phases: the closed years are paid from savings (pensionOpen false, nothing from the pension); every phase adds up', () => {
    const h = saver({ age: 50, pot: 200_000, isa: 60_000, payIn: 500, stopAge: 53, work: { yearly: 15_000, years: 2 } });
    const sp = stopAtPlan(h, 53, { ...TEST_ENV, futures: 5 });
    const phases = phasesAt(sp, 24_000);
    expect(phases[0].pensionOpen).toBe(false);
    expect(phases[0].fromPension).toBe(0);
    expect(phases[0].fromWork).toBeGreaterThan(0);
    expect(phases.find((p) => p.fromAge === 57).pensionOpen).toBe(true);
    for (const p of phases) {
      expect(p.shown.takeHome).toBe(p.shown.fromPots + p.shown.statePension + p.shown.finalSalary + p.shown.fromWork);
      // work is the earnings before tax, fromWork what they add after tax; the tax is on all of it
      expect(Math.abs(p.takeHome - (p.fromPension + p.fromSavings + p.statePension + p.finalSalary + p.work - p.tax))).toBeLessThan(0.05);
      expect(p.fromWork).toBeLessThanOrEqual(p.work + 0.005);
      if (!p.pensionOpen) expect(p.fromPension).toBe(0);
    }
    expect(phases.find((p) => p.fromAge === 55).fromWork).toBe(0);
  });

  it('part-time work: a period ends when the work does, the run carries it as an income that ends, and the floor of the band is the lowest guaranteed take-home', () => {
    const h = saver({ age: 58, pot: 300_000, stopAge: 60, work: { yearly: 20_000, years: 3 } });
    const sp = stopAtPlan(h, 60, { ...TEST_ENV, futures: 5 });
    const [run] = sp.plan.runs;
    expect(run.base.extraIncomes).toEqual([{ startYear: 0, endYear: 2, annual: 20_000, indexation: 'cpi' }]);
    expect(sp.plan.periods.map((p) => p.from)).toContain(3);
    expect(sp.plan.periods[0].byPerson[0].work).toBe(20_000);
    expect(sp.plan.periods[1].byPerson[0].work).toBe(0);
    expect(sp.plan.guaranteedAtStartAYear).toBe(Math.min(...sp.plan.periods.map((p) => p.netTotal)));
    const b = breakdownAt(sp.plan, 30_000);
    expect(b[0].byPerson[0].work).toBe(20_000);
  });

  it('without the option, enginePlan and configsAt are C\'s, whatever the household carries', () => {
    const h = saver({ age: 58, pot: 300_000, isa: 20_000, stopAge: 58, partner: { age: 54, pot: 80_000 } });
    const a = enginePlan(h, { today: TEST_ENV.today });
    const b = enginePlan(h, { today: TEST_ENV.today }, {});
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
    expect(a.asGiven).toBe(undefined);
    expect(JSON.stringify(configsAt(a, 30_000))).toBe(JSON.stringify(configsAt(b, 30_000)));
    for (const run of a.runs) expect('lockedMonths' in run.base).toBe(false);
  });
});

describe('the drawing years read the life on from the stop', () => {
  it('pots per life at the stop: careful ≤ middling ≤ good; at S = 0 every life holds today\'s pots', () => {
    const sp = stopAtPlan(saver({ age: 45, pot: 120_000, isa: 10_000, payIn: 625, stopAge: 60 }), 60, { ...TEST_ENV, futures: 40 });
    const at = bandIndexes(sp.n);
    const sorted = Array.from(sp.pots[0].pension).sort((x, y) => x - y);
    expect(sorted[at.careful]).toBeLessThanOrEqual(sorted[at.middling]);
    expect(sp.middling[0].pension).toBe(sorted[at.middling]);
    const now = stopAtPlan(saver({ age: 60, pot: 120_000, isa: 10_000, payIn: 625, stopAge: 60 }), 60, { ...TEST_ENV, futures: 10 });
    for (let i = 0; i < 10; i++) expect(now.potsOf(i)).toEqual([{ pension: 120_000, isa: 10_000 }]);
  });

  it('lives passed in are used as they are (every stop age a cut of the same lives)', () => {
    const lives = livesList(20, 60, TEST_ENV);
    const h = saver({ age: 40, pot: 50_000, payIn: 400, stopAge: 60 });
    const a = stopAtPlan(h, 58, TEST_ENV, lives);
    const b = stopAtPlan(h, 62, TEST_ENV, lives);
    expect(a.lives).toBe(lives);
    expect(b.lives).toBe(lives);
    expect(a.S).toBe(18);
    expect(b.S).toBe(22);
  });
});

describe('the household\'s saving fields (step 4 brief 4.10)', () => {
  it('a saver household: the saving block filled, the defaults listed; C\'s households are untouched', async () => {
    const { expandHousehold, validateHousehold, HOUSEHOLD_LIMITS } = await import('./_saving.js');
    const today = TEST_ENV.today;
    const { household, assumed } = expandHousehold({ people: [{ age: 45, pots: { pension: 1 }, stopWork: { kind: 'age', age: 60 } }], saving: {} }, today);
    // 6.19.0: the charge is the household's one charge (percent a year, saving and drawing), not part of the saving block
    expect(household.saving).toEqual({ risk: 'balanced' });
    expect(household.chargesPct).toBe(0.5);
    expect(household.people[0].saving).toBe(null);
    expect(assumed.map((a) => a.id)).toEqual(expect.arrayContaining(['nothing-paid-in', 'risk-saving', 'charges']));
    const c = expandHousehold({ people: [{ age: 45, pots: { pension: 1 } }] }, today);
    expect('saving' in c.household).toBe(false);
    expect('saving' in c.household.people[0]).toBe(false);
    expect(c.assumed.map((a) => a.id)).not.toContain('nothing-paid-in');
    // …and C's households carry the same charge (every question takes it while drawing)
    expect(c.household.chargesPct).toBe(0.5);
    expect(c.assumed.map((a) => a.id)).toContain('charges');
    const given = expandHousehold({ people: [{ age: 45, pots: { pension: 1 } }], chargesPct: 0.05 }, today);
    expect(given.household.chargesPct).toBe(0.05);
    expect(given.assumed.map((a) => a.id)).not.toContain('charges');
    const split = expandHousehold({ people: [{ age: 45, pots: { pension: 1 }, saving: { payIn: { own: 300, employer: 250 } } }], saving: { risk: 'adventurous' }, chargesPct: 1 }, today);
    expect(split.household.chargesPct).toBe(1);
    expect(split.household.people[0].saving).toEqual({ payIn: { total: 550, own: 300, employer: 250 }, savingsIn: 0, alreadyDrawing: false });
    expect(HOUSEHOLD_LIMITS.payInAMonth).toEqual({ min: 0, max: 10_000 });
    expect(validateHousehold(split.household, today)).toEqual([]);
  });

  it('validateHousehold: the new ranges; people who stop in different years are valid when the household says how the years apart are paid', async () => {
    const { validateHousehold } = await import('./_saving.js');
    const today = TEST_ENV.today;
    const h = saver({ age: 45, pot: 100_000, payIn: 600, stopAge: 60, charge: 0.005, work: { yearly: 20_000, years: 3 }, partner: { age: 44, pot: 50_000 } });
    expect(validateHousehold(h, today)).toEqual([]);
    const fields = (x) => validateHousehold(x, today).map((p) => `${p.field}:${p.problem}`);
    expect(fields({ ...h, chargesPct: 3.05 })).toEqual(['chargesPct:tooHigh']);
    expect(fields({ ...h, chargesPct: -0.05 })).toEqual(['chargesPct:tooLow']);
    expect(fields({ ...h, chargesPct: 3 })).toEqual([]);
    const tooMuch = { ...h, people: h.people.map((p, j) => (j ? p : { ...p, saving: { ...p.saving, payIn: { total: 10_001, own: null, employer: null } } })) };
    expect(fields(tooMuch)).toEqual(['people.0.saving.payIn.total:tooHigh']);
    const longWork = { ...h, people: h.people.map((p, j) => (j ? p : { ...p, otherIncome: [{ kind: 'work', amountPerYear: 20_000, fromAge: 60, toAge: 76 }] })) };
    expect(fields(longWork)).toEqual(['people.0.otherIncome.0.years:tooHigh']);
    // couples-different-years.md 9.5: each stops on their own date, with the pay line (expandHousehold always gives one)
    const apart = { ...h, people: h.people.map((p, j) => (j ? { ...p, stopWork: { kind: 'age', age: 62 } } : p)), untilBothStop: { payCovers: 0.5 } };
    expect(fields(apart)).toEqual([]);
    for (const payCovers of [0, 1]) expect(fields({ ...apart, untilBothStop: { payCovers } })).toEqual([]);
    expect(fields({ ...apart, untilBothStop: { payCovers: 0.25 } })).toEqual(['untilBothStop.payCovers:notAnOption']);
    // made by hand without the pay line: household.js still names it (P0 kept 'stop-together' for that case only)
    const { untilBothStop, ...bare } = apart;
    void untilBothStop;
    expect(fields(bare)).toEqual(['people.1.stopWork:stop-together']);
  });

  it('a stop plan of a couple apart: each saves to their own stop, the drawing years start at the first, the stop asked about must be one of theirs', async () => {
    const { expandHousehold } = await import('./_saving.js');
    const short = (partnerStop) => ({
      people: [
        { who: 'you', age: 55, pots: { pension: 200_000 }, stopWork: { kind: 'age', age: 60 }, saving: { payIn: { total: 500 }, savingsIn: 0 } },
        { who: 'partner', age: 58, pots: { pension: 150_000, isa: 20_000 }, stopWork: partnerStop, saving: { payIn: { total: 0 }, savingsIn: 0 } }
      ],
      saving: {}, planToAge: 95
    });
    const h = expandHousehold(short({ kind: 'already' }), TEST_ENV.today).household;
    const sp = stopAtPlan(h, 60, { ...TEST_ENV, futures: 4 });
    expect(sp.S).toBe(0);
    expect(sp.stops).toEqual([{ who: 'you', S: 5, join: 5 }, { who: 'partner', S: 0, join: 0 }]);
    expect(sp.saving.people.map((p) => p.until)).toEqual([5, 0]);
    expect(sp.kernelPasses).toBe(2);                                  // one growth pass per distinct stop
    expect(sp.stillSaving).toEqual([true, false]);
    expect(sp.split).toEqual([1, 0]);
    expect(sp.plan.apart.years).toBe(5);
    expect(sp.D).toBe(95 - 55);
    expect(() => stopAtPlan(h, 61, { ...TEST_ENV, futures: 4 })).toThrow(/neither person/);
    expect(stopAtPlan(h, 58, { ...TEST_ENV, futures: 4 }).S).toBe(0);  // the partner's stop: the same plan
    // both still working, apart: both save, each to their own stop; both are scaled by the pot needed
    const both = expandHousehold(short({ kind: 'age', age: 62 }), TEST_ENV.today).household;
    const sb = stopAtPlan(both, 60, { ...TEST_ENV, futures: 4 });
    expect(sb.S).toBe(4);
    expect(sb.stops.map((x) => x.join)).toEqual([1, 0]);
    expect(sb.stillSaving).toEqual([true, true]);
  });
});
