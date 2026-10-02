/**
 * What you spend changing with age, in the engine adapter (research/v7/spending-shape.md 5, 9.1): a shape becomes a target
 * for each year; neither engine changes.
 *
 *   I-SS2  a shape that never changes is no shape: the household has none, and every figure of C, A and B is the flat
 *          answer's (only the inputs echo differs)
 *   I-SS3  cuts change nothing: a plan cut at a step's age where r is the same on both sides gives the same configs, value
 *          for value
 *   I-SS4  the engine: a shaped config through `simulate` and through the fast path — the same run-out month and end pots,
 *          bit for bit (falls, moves evenly, a step up, a couple)
 *   T2     a step is the TOTAL spent: the State Pension and other pensions pay first (each year's target is the before-tax
 *          figure of max(H × r(y), their take-home), per person)
 *   T12    never below the income you get anyway: a year whose incomes pay more than the shape draws nothing from the pots
 *   T17    one shape for everything: every run's target schedule, the breakdown, the floor and the ceiling of the search
 *   T19    try a flat income: the same inputs with the shape left out are the flat answer ("Try it the same every year")
 *   P-SS1  a shape lower or equal in every year never lasts in fewer futures; P-SS3 the band's floor lasts and its ceiling
 *          fails in every future
 * Made-up figures only.
 */
import { describe, it, expect } from 'vitest';
import { answerA } from '../a/_a.js';
import { answerB } from '../b/_b.js';
import { answerC } from '../c/_c.js';
import { SCHEMA_C } from '../../../src/answers/c/schema.js';
import { checkInputs } from '../../../src/answers/shared/validate.js';
import { toHousehold as toHouseholdC } from '../../../src/answers/c/toHousehold.js';
import { toHousehold as toHouseholdA } from '../../../src/answers/a/toHousehold.js';
import { SCHEMA_A } from '../../../src/answers/a/schema.js';
import { enginePlan, configsAt, breakdownAt, yearlyPlan, potsNeedByYear, amountInYear } from '../../../src/answers/shared/toEngine.js';
import { bandRange, runFuture, STEP } from '../../../src/answers/shared/band.js';
import { futuresList } from '../../../src/answers/shared/futures.js';
import { simulate } from '../../../src/services/SimulationEngine.js';
import { simulateFast, fastEligible } from '../../../src/answers/shared/fastEngine.js';
import { netToGross } from '../../../src/services/TaxCalculator.js';
import { stopAtPlan, createStopRunner, verdictAt } from '../../../src/answers/shared/stopAt.js';

const TODAY = '2026-09-30';
const ENV = { today: TODAY, futures: 20, seed: 0, trace: false };
const gross = (n) => netToGross(n, 12570, 50270, 125140);
const noInputs = (r) => JSON.stringify({ ...r, inputs: null });

function planC(inputs) {
  const checked = checkInputs(SCHEMA_C, inputs, ENV);
  if (!checked.ok) throw new Error(JSON.stringify(checked.errors));
  const { household } = toHouseholdC(checked.inputs, ENV);
  return { household, plan: enginePlan(household, ENV) };
}

const C_FLAT = { you: { age: 67, pot: 400000 }, start: { kind: 'now' } };
const C_STEPS = [{ fromAge: 75, share: 85, then: 'level' }, { fromAge: 85, share: 70, then: 'level' }];

describe('I-SS2 — a shape that never changes is no shape', () => {
  it('C: a step at 100%, staying the same; and "stays the same" said outright — the flat answer, but for the inputs', () => {
    const flat = answerC(C_FLAT, ENV);
    for (const shape of [{ steps: [{ fromAge: 80, share: 100, then: 'level' }] }, { then: 'level' }, { then: 'level', steps: [] }]) {
      const r = answerC({ ...C_FLAT, shape }, ENV);
      expect(noInputs(r)).toBe(noInputs(flat));
    }
    expect(planC({ ...C_FLAT, shape: { steps: [{ fromAge: 80, share: 100, then: 'level' }] } }).household.shape).toBeUndefined();
  });

  it('A and B: a step equal to the figure, staying the same — the flat answer, but for the inputs', () => {
    const a = { you: { age: 60, pot: 350000, payIn: { total: 500 } }, savings: 30000, stop: { kind: 'age', age: 62 }, spend: { kind: 'amount', amount: 2200 } };
    const aEnv = { ...ENV, detail: 'chart', ages: [61, 62, 63] };
    expect(noInputs(answerA({ ...a, spend: { ...a.spend, then: 'level', steps: [{ fromAge: 80, perMonth: 2200, then: 'level' }] } }, aEnv))).toBe(noInputs(answerA(a, aEnv)));
    const b = { you: { age: 55, pot: 300000, payIn: { kind: 'split', own: 500, employer: 300 } }, savings: 40000, stop: { age: 62 }, spend: { amount: 2200 } };
    const bEnv = { ...ENV, detail: 'answer' };
    expect(noInputs(answerB({ ...b, spend: { ...b.spend, steps: [{ fromAge: 80, perMonth: 2200 }] } }, bEnv))).toBe(noInputs(answerB(b, bEnv)));
  });

  it('T19 — "Try it the same every year": the same inputs with the shape left out are the flat answer, to the byte', () => {
    const shaped = { ...C_FLAT, shape: { steps: C_STEPS } };
    const { shape, ...flatAgain } = shaped;
    void shape;
    expect(JSON.stringify(answerC(flatAgain, ENV))).toBe(JSON.stringify(answerC(C_FLAT, ENV)));
  });

  it('a flat household\'s plan has no shape key, no cut and no new field: the plan of a shaped household that does not move here is today\'s too', () => {
    const { plan } = planC(C_FLAT);
    expect('shape' in plan).toBe(false);
    // a shape whose every step is past the plan: no change inside it (validation refuses it on the form; the model holds)
    const { household } = planC(C_FLAT);
    const late = enginePlan({ ...household, shape: { unit: 'share', start: { then: 'level' }, steps: [{ fromAge: 99, share: 50, then: 'level' }] } }, ENV);
    expect(JSON.stringify(late)).toBe(JSON.stringify(plan));
  });
});

describe('T2, T12, T17 — each year\'s target, per person, from the shape', () => {
  it('one person with a State Pension: the target in year y is the before-tax figure of max(H × r(y), the State Pension\'s take-home)', () => {
    const { plan } = planC({ ...C_FLAT, shape: { then: 'falls', fallsPct: 2, steps: [{ fromAge: 80, share: 40, then: 'level' }] } });
    expect(plan.shape.stepYears).toEqual([13]);
    expect(plan.periods.map((p) => p.from)).toEqual([0, 13]);
    const H = 2600 * 12;
    const [entry] = configsAt(plan, H);
    const sched = entry.config.targetSchedule;
    for (let y = 0; y < plan.years; y++) {
      const per = plan.periods.find((p) => p.from <= y && y < p.to);
      const Hy = amountInYear(plan, H, y);
      expect(sched[y]).toBe(gross(per.byPerson[0].net + Math.max(0, Hy - per.netTotal)));
    }
    // T12: from 80 the State Pension pays more than 40% of the start: the pots pay nothing, the target is the State Pension
    const need = potsNeedByYear(plan, H);
    expect(need.slice(13).every((v) => v === 0)).toBe(true);
    expect(sched[13]).toBe(gross(plan.periods[1].byPerson[0].net));
    expect(need[1]).toBeCloseTo(H * 0.98 - plan.periods[0].netTotal, 6);
  });

  it('a couple: the household\'s need each year is shared by their money, each grossed up on their own tax (as the flat need is)', () => {
    const { plan } = planC({ household: 'couple', you: { age: 66, pot: 300000 }, partner: { age: 60, pot: 150000 }, start: { kind: 'now' }, shape: { steps: [{ fromAge: 76, share: 80, then: 'glides' }, { fromAge: 86, share: 60, then: 'level' }] } });
    const H = 3200 * 12;
    const entries = configsAt(plan, H);
    for (let y = 0; y < plan.years; y++) {
      const per = plan.periods.find((p) => p.from <= y && y < p.to);
      const R = Math.max(0, amountInYear(plan, H, y) - per.netTotal);
      entries.forEach((e, r) => {
        const run = plan.runs[r];
        const b = per.byPerson[run.index];
        expect(e.config.targetSchedule[y]).toBe(b.locked ? 0 : gross(b.net + per.shares[r] * R));
      });
    }
  });

  it('the breakdown: each period\'s first year at H × r there; one a year (yearlyPlan) gives every year\'s figures', () => {
    const { plan } = planC({ ...C_FLAT, shape: { then: 'falls', fallsPct: 1, steps: C_STEPS } });
    const H = 2500 * 12;
    const per = breakdownAt(plan, H);
    expect(per.map((p) => p.from)).toEqual(plan.periods.map((p) => p.from));
    per.forEach((p) => expect(p.takeHome).toBe(Math.max(amountInYear(plan, H, p.from), plan.periods.find((x) => x.from === p.from).netTotal)));
    const yearly = breakdownAt(yearlyPlan(plan), H);
    expect(yearly).toHaveLength(plan.years);
    yearly.forEach((p, y) => expect(p.takeHome).toBe(Math.max(amountInYear(plan, H, y), plan.periods.find((x) => x.from <= y && y < x.to).netTotal)));
  });
});

describe('I-SS3 — cuts change nothing', () => {
  it('a step whose ratio is the one before it cuts the plan but the configs are the same, value for value', () => {
    const { household } = planC(C_FLAT);
    const only85 = enginePlan({ ...household, shape: { unit: 'share', start: { then: 'level' }, steps: [{ fromAge: 85, share: 70, then: 'level' }] } }, ENV);
    const with75 = enginePlan({ ...household, shape: { unit: 'share', start: { then: 'level' }, steps: [{ fromAge: 75, share: 100, then: 'level' }, { fromAge: 85, share: 70, then: 'level' }] } }, ENV);
    expect(with75.periods.length).toBe(only85.periods.length + 1);
    for (const H of [1200 * 12, 2600 * 12, 9000 * 12]) {
      expect(JSON.stringify(configsAt(with75, H))).toBe(JSON.stringify(configsAt(only85, H)));
    }
  });
});

describe('I-SS4 — a shaped config through simulate and through the fast path: the same, bit for bit', () => {
  const same = (a, b) => a.failed === b.failed && a.failMonth === b.failMonth && a.finalEquity === b.equity && a.finalBond === b.bond && a.finalCash === b.cash && a.finalIsa === b.isa;
  const SHAPES = [
    { then: 'falls', fallsPct: 1 },
    { steps: C_STEPS },
    { then: 'glides', steps: [{ fromAge: 80, share: 60, then: 'falls', fallsPct: 2.5 }] },
    { steps: [{ fromAge: 85, share: 140, then: 'level' }] }                                     // a step up, for care
  ];
  const HOUSEHOLDS = [
    { you: { age: 67, pot: 400000 }, savings: 50000, start: { kind: 'now' } },
    { household: 'couple', you: { age: 66, pot: 300000, finalSalary: { has: true, yearly: 9000, fromAge: 66 } }, partner: { age: 62, pot: 200000 }, savings: 80000, start: { kind: 'now' } },
    { you: { age: 58, pot: 250000, statePension: { kind: 'none' } }, savings: 20000, start: { kind: 'now' } }
  ];
  it('the households and shapes above, at five amounts and 12 futures', () => {
    let compared = 0;
    for (const h of HOUSEHOLDS) {
      for (const shape of SHAPES) {
        const { plan } = planC({ ...h, shape });
        expect(plan.shape && plan.shape.r).toBeTruthy();
        const futures = futuresList(12, plan.years, { today: TODAY, seed: 0 });
        for (const k of [50, 150, 250, 400, 700]) {
          for (const { config } of configsAt(plan, k * STEP * 12)) {
            expect(fastEligible(config)).toBe(true);
            for (const f of futures) {
              const a = simulate(config, f.returns, f.seed);
              const b = simulateFast(config, f);
              if (!same(a, b)) expect.fail(`differs: ${JSON.stringify([h, shape, k])} in future ${f.id}`);
              compared++;
            }
          }
        }
      }
    }
    expect(compared).toBeGreaterThan(900);
  }, 120_000);
});

describe('P-SS1, P-SS3 — the search still rests on its one rule', () => {
  it('the floor lasts in every future and the ceiling fails in every future, for falls, a step down and a step up', () => {
    for (const shape of [{ then: 'falls', fallsPct: 3 }, { steps: C_STEPS }, { steps: [{ fromAge: 85, share: 150, then: 'level' }] }]) {
      const { plan } = planC({ ...C_FLAT, shape });
      const { kLow, kMax } = bandRange(plan);
      const futures = futuresList(12, plan.years, { today: TODAY, seed: 0 });
      for (const f of futures) {
        expect(runFuture(configsAt(plan, kLow * STEP * 12), f).failed).toBe(false);
        expect(runFuture(configsAt(plan, kMax * STEP * 12), f).failed).toBe(true);
      }
      // at the floor the pots pay nothing in any year
      expect(potsNeedByYear(plan, kLow * STEP * 12).every((v) => v <= 1e-6)).toBe(true);
    }
  });

  it('a shape lower or equal in every year never lasts in fewer lives (A\'s verdict on the same lives)', () => {
    const base = { you: { age: 58, pot: 300000, payIn: { total: 600 } }, savings: 40000, stop: { kind: 'age', age: 61 }, spend: { kind: 'amount', amount: 2300 } };
    const lower = [
      { then: 'falls', fallsPct: 1 },
      { steps: [{ fromAge: 75, perMonth: 1955, then: 'level' }] },
      { steps: [{ fromAge: 75, perMonth: 1955, then: 'level' }, { fromAge: 85, perMonth: 1610, then: 'level' }] },
      { then: 'falls', fallsPct: 1, steps: [{ fromAge: 75, perMonth: 1600, then: 'falls', fallsPct: 2 }] }
    ];
    const verdictOf = (spend) => {
      const checked = checkInputs(SCHEMA_A, { ...base, spend: { ...base.spend, ...spend } }, ENV);
      const { household } = toHouseholdA(checked.inputs, ENV, 61);
      const sp = stopAtPlan(household, 61, ENV);
      return verdictAt(sp, createStopRunner(sp), 2300 * 12).fails;
    };
    const flat = verdictOf({});
    let last = flat;
    for (const s of lower) {
      const f = verdictOf(s);
      expect(f).toBeLessThanOrEqual(flat);
      if (s === lower[2]) expect(f).toBeLessThanOrEqual(last);   // the second step lowers the first shape further
      last = f;
    }
  });
});
