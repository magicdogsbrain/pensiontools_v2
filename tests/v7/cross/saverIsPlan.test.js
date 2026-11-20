/**
 * THE SAVER'S VERDICT ON A KEPT PLAN IS THE PLAN (lead4-engine.md P, ruling 10; lead4.md D12): "Are you paying in enough?"
 * on a saved plan still saving reads the plan through the one adapter, so the plan's own test ("Does it last?",
 * answers/plan/lastsRun.js lastsOf) and the plan's saver verdict (answers/plan/saving.js saverVerdictOf, run as the app
 * runs it: the worker's 'saver' lane, answers/index.js answerFor) give the same count of futures that last, the same
 * weighted chance and the same verdict, at the same number of futures. Every figure of the plan the drawing years read is
 * the plan's own: the State Pension's start date, the access method (a quarter tax-free or all taxed), the final-salary
 * rule, the plan-to age, the charge to the hundredth, a lump sum, a taxable account. The kept answer's own figures are
 * never put in the plan's place, and a plan kept from A, B or C (the same plan apart from the record of the question)
 * gets one verdict.
 *
 * Measured before (100 futures, 30 September 2026; the plan's test, then the saver verdict as the app ran it, off the
 * plan path): Pat B at £2,300 kept, 53 vs 64 of 100 (0.6959 vs 0.7882), enough £2,560 vs £1,660 a month; State Pension
 * two years later 45 vs 64; all taxed 46 vs 64; a level final-salary pension 44 vs 64; a £60,000 lump sum 83 vs 64; a
 * £40,000 taxable account 67 vs 64; charges 0.73 read as 0.75. Pat kept from A at 63: 97 vs 100.
 *
 * Fictional people (Pat, Jo), round figures.
 */
import { describe, it, expect } from 'vitest';
import { answerB } from '../b/_b.js';
import { answerA } from '../a/_a.js';
import { keptPlansOf } from '../../../src/answers/keep/keptPlan.js';
import { lastsOf } from '../../../src/answers/plan/lastsRun.js';
import { saverVerdictOf } from '../../../src/answers/plan/saving.js';
import { answerFor } from '../../../src/answers/index.js';
import { createHandler } from '../../../src/v7/effects/answerWorker.js';

const TODAY = '2026-09-30';
const N = 40;
const ENV = { today: TODAY, futures: N, seed: 0, trace: false };
/** The env the app's saver runs carry (v7/effects/saver.js), at this file's futures. */
const RUN = { today: TODAY, futures: N, seed: 0, trace: false, detail: 'answer' };

const PAT = { household: 'single', you: { age: 60, pot: 200000, statePension: { kind: 'full' }, finalSalary: { has: true, yearly: 9000, fromAge: 63 }, payIn: { kind: 'total', total: 600 } },
  savings: 20000, isaGrowth: 'invested', savingsIn: 0, savingRisk: 'balanced', risk: 'balanced', charge: 0.5, endAge: 95, stop: { age: 63 }, confidence: 'balanced' };
const JO = { household: 'single', you: { age: 35, pot: 40000, statePension: { kind: 'full' }, finalSalary: { has: false }, payIn: { kind: 'total', total: 300 } },
  savings: 0, savingsIn: 0, savingRisk: 'balanced', risk: 'balanced', charge: 0.5, endAge: 95, stop: { age: 65 }, confidence: 'balanced' };

const keptB = (who, perMonth) => ({ ...keptPlansOf('b', answerB({ ...who, spend: { kind: 'amount', amount: perMonth } }, { ...ENV, detail: 'answer' }), ENV).yours, id: 'p1' });
const keptA = (who, perMonth) => {
  const { stop, ...rest } = who;
  const a = answerA({ ...rest, spend: { kind: 'amount', amount: perMonth }, stop: { kind: 'age', age: stop.age }, partTime: { has: false } }, { ...ENV, detail: 'chart' });
  return { ...keptPlansOf('a', a, ENV).yours, id: 'p1' };
};

/** The plan's own test at N futures: the count to its plan-to age, the weighted chance, the verdict. */
function planTest(plan) {
  const { a } = lastsOf(plan, { today: TODAY, futures: N, histories: false });
  return { lasted: Math.round(a.fixedAge * N), weighted: a.weighted, verdict: a.verdict };
}

/** The plan's saver verdict, as the app runs it: the reading, then question B through answerFor (the worker's lane). */
async function saverRun(plan) {
  const v = saverVerdictOf([{ plan }], plan.id, { today: TODAY });
  expect(v && v.ok, 'the plan is read as a saver').toBe(true);
  return answerFor('b', v.inputs, { ...RUN, ...(v.env || {}) });
}
const said = (b) => ({ lasted: N - b.chance.fails, weighted: b.chance.weighted, verdict: b.verdict.band });

/** One setting of the plan changed, as its own page writes it. */
const withSettings = (plan, patch) => ({ ...plan, stressTool: { ...plan.stressTool, settings: { ...plan.stressTool.settings, ...patch } } });
const twoYearsOn = (d) => String(+d.slice(0, 4) + 2) + d.slice(4);

describe('the saver verdict on a kept plan is the plan\'s own test', () => {
  it('Pat kept from B at £2,300: the verdict and what would be enough are the answer\'s and the plan\'s', async () => {
    const answer = answerB({ ...PAT, spend: { kind: 'amount', amount: 2300 } }, { ...ENV, detail: 'answer' });
    const plan = keptB(PAT, 2300);
    const b = await saverRun(plan);
    expect(said(b)).toEqual(planTest(plan));
    expect(said(b)).toEqual(said(answer));
    // what would be enough, figure for figure (the plan also says its own scheme, so what leaves take-home pay is said
    // exactly: `takeHomeExact`, a words flag the answer asked without a scheme does not carry)
    expect(b.enough.atLevel).toEqual(answer.enough.atLevel);
    expect(b.enough.atLevel.payIn).toBeGreaterThan(600);
  });

  it('Jo kept from B at £1,800: the same', async () => {
    const plan = keptB(JO, 1800);
    expect(said(await saverRun(plan))).toEqual(planTest(plan));
  });

  // each figure the plan's drawing years read, changed on Pat's kept plan: the saver verdict follows the plan's test
  const CHANGES = [
    ['the State Pension two years later', (s) => ({ spStartDate: twoYearsOn(s.spStartDate) })],
    ['all taxed (no quarter tax-free)', () => ({ accessMethod: 'drawdown' })],
    ['a level final-salary pension', () => ({ dbIndexation: 'level' })],
    ['a £60,000 lump sum in year 5', () => ({ windfalls: [{ amount: 60000, year: 5, label: 'Lump sum', wrapper: 'cash' }] })],
    ['a £40,000 taxable account', () => ({ taxableStart: 40000 })],
    ['charges of 0.73% (never read as 0.75%)', () => ({ chargesPct: 0.73 })],
    ['charges of 0.62% (never read as 0.6%)', () => ({ chargesPct: 0.62 })],
    ['a plan to 110 (no 105 limit the plan does not have)', (s) => ({ duration: s.duration + 15 })]
  ];
  for (const [label, change] of CHANGES) {
    it(`Pat's kept plan with ${label}: the saver verdict is the plan's test`, async () => {
      const kept = keptB(PAT, 2300);
      const plan = withSettings(kept, change(kept.stressTool.settings));
      const test = planTest(plan);
      expect(test, 'the change moves the plan\'s own test').not.toEqual(planTest(kept));
      expect(said(await saverRun(plan))).toEqual(test);
    });
  }

  it('a plan kept from A gets the verdict the same plan kept from B gets (Pat at 63, £2,300)', async () => {
    const fromA = keptA(PAT, 2300);
    const fromB = keptB(PAT, 2300);
    const a = said(await saverRun(fromA));
    expect(a).toEqual(planTest(fromA));
    expect(a).toEqual(said(await saverRun(fromB)));
  });
});

describe('the worker\'s saver lane runs the plan path', () => {
  it('the lane\'s answer is answerFor\'s (Pat kept from B at £2,300)', async () => {
    const plan = keptB(PAT, 2300);
    const v = saverVerdictOf([{ plan }], plan.id, { today: TODAY });
    const handle = createHandler();
    const out = await new Promise((resolve) => {
      handle({ id: 7, type: 'saver', inputs: v.inputs, env: { ...RUN, ...v.env } }, (m) => { if (m.id === 7 && (m.result || m.error)) resolve(m); });
    });
    expect(out.error).toBeUndefined();
    expect(said(out.result)).toEqual(planTest(plan));
  });
});
