/**
 * ONE ANSWER FOR THE SAME HOUSEHOLD (7.12.0; the lead's ruling D22, step P): a question's answer on inputs I, and the plan
 * test on the plan that keeping the answer writes, give the same chance (the same count of futures that last), the same
 * run-out age and the same left at the end, at the same number of futures.
 *
 * The two ends are each ONE function:
 *   - the plan keeping writes: answers/keep/keptPlan.js keptPlansOf (planSeed.buildPlanSeed → PlanFromSeed.seedToScenario,
 *     the keep's own two steps);
 *   - the plan test: answers/plan/lastsRun.js lastsOf ("Does it last?" is this run, runLasts reads it), at the answer's
 *     own count of futures, the real histories left out (no figure here reads them).
 *
 * What holds today (the first block) and what does not yet (the second: `it.fails`, each with the gap measured at 40
 * futures on 30 September 2026). When an answer is put on the plan path the `it.fails` beside it starts to fail and becomes
 * an `it`: the gap cannot close silently, nor open again.
 *
 * Measured gaps (40 futures; the answer's figure, then the kept plan's):
 *   D1 (68, £300,000 pension, £40,000 savings, £2,100 a month): lasts to 99 in 26 of 40 vs 25 of 40; weighted 0.877 vs
 *      0.858; bad-case run-out age 90 vs 93. Both say "close" here; at 1,000 futures the answer says close (597 of 1,000)
 *      and the plan says no (571 of 1,000).
 *   D3 (62, £120,000 pension, £200,000 invested ISA, £2,000 a month): 20 of 40 both; weighted 0.728 vs 0.705; run-out 83 vs 87.
 *   D9 (88, £90,000, £1,500 a month): 36 of 40 vs 34 of 40; weighted 0.981 vs 0.964; run-out 100 vs 100.
 *   C (Alex, 58, £250,000, from now), kept at each level: the answer passes at its level, the kept plan says "close" at
 *      every level. Careful £1,320 a month: 36 of 40 both, weighted 0.957 vs 0.940; balanced £1,370: 32 of 40 both,
 *      0.902 vs 0.879; bold £1,500: 20 of 40 both, 0.713 vs 0.684. The counts agree; the weights do not.
 *   A (Sam, 45, £60,000, £800 a month going in, £10,000 savings, £2,000 a month from 60): no in both; 6 of 40 vs 2 of 40,
 *      weighted 0.318 vs 0.242 (the plan draws every future from one middling pot at 60, the answer from each life's own).
 *   B (Sam, the same): kept paying in what would be enough, the kept plan passes at the level (37 of 40); kept paying in as
 *      now, 6 of 40 vs 2 of 40 (stop 60, £2,000) and 25 of 40 vs 27 of 40 (stop 62, £1,800).
 * The causes (map-sums.md 3b): the answers' year grid from today with the State Pension's first year whole, the plan's tax
 * years with its first-year share; monthly weights against the plan's yearly ones; the glidepath over the whole run against
 * the plan's own length; the take-home grossed per year against the kept plan's rounded yearly steps.
 *
 * The households are made up (Alex and Sam, round figures).
 */
import { describe, it, expect } from 'vitest';
import { answerD, D1, D3, D9 } from '../d/_d.js';
import { answerC } from '../c/_c.js';
import { answerA } from '../a/_a.js';
import { answerB } from '../b/_b.js';
import { keptPlansOf } from '../../../src/answers/keep/keptPlan.js';
import { buildPlanSeed } from '../../../src/answers/keep/planSeed.js';
import { seedToScenario } from '../../../src/services/PlanFromSeed.js';
import { lastsOf, runLasts } from '../../../src/answers/plan/lastsRun.js';

const TODAY = '2026-09-30';
const N = 40;
const ENV = { today: TODAY, futures: N, seed: 0, trace: false };

/** The kept plan's reading at the answer's futures: the count that lasts to the plan-to age, the weighted chance, the bad-case run-out age, what is typically left. */
function planReading(plan) {
  const { a } = lastsOf(plan, { today: TODAY, futures: N, histories: false });
  return { lasted: Math.round(a.fixedAge * N), weighted: a.weighted, runOutAge: a.floor.age, left: a.left.typical, planToAge: a.planToAge, verdict: a.verdict };
}

/** The answer's own reading, said the same way. */
const answerReading = (d) => ({ lasted: N - d.fails, weighted: d.chance.weighted, runOutAge: d.runOutAge, planToAge: d.chance.planToAge, verdict: d.verdict });

describe('the one adapter and the one runner', () => {
  it('the adapter is the keep: the plan it makes is the plan buildPlanSeed and seedToScenario make for the same answer', () => {
    const d = answerD(D1, ENV);
    const mine = keptPlansOf('d', d, ENV);
    const seed = buildPlanSeed({ source: 'd', result: d, env: { today: TODAY, appVersion: '' }, name: null, createdAt: TODAY + 'T00:00:00.000Z' });
    const keep = seedToScenario(seed, TODAY);
    expect(mine.yours.stressTool.settings).toEqual(keep.yours.stressTool.settings);
    expect(mine.yours.accumulationTool).toEqual(keep.yours.accumulationTool);
    expect(mine.partner).toBeNull();
  });

  it('an answer that cannot be kept has no kept plan', () => {
    expect(keptPlansOf('d', { status: 'invalid' }, ENV)).toBeNull();
  });

  it('"Does it last?" is the one runner: runLasts gives the figures lastsOf gives on the same plan', () => {
    const plan = keptPlansOf('d', answerD(D9, ENV), ENV).yours;
    const one = lastsOf(plan, { today: TODAY });
    const shown = runLasts(plan, { today: TODAY });
    expect(shown.a.chancePct).toBe(one.a.chancePct);
    expect(shown.a.weighted).toBe(one.a.weighted);
    expect(shown.a.floor).toEqual(one.a.floor);
    expect(shown.a.left).toEqual(one.a.left);
  }, 60000);

  it('the runner runs the answer\'s own count of futures, on the plan and on the plan followed on to the weighting age', () => {
    const plan = keptPlansOf('d', answerD(D9, ENV), ENV).yours;
    const { a, p } = lastsOf(plan, { today: TODAY, futures: N, histories: false });
    expect(p.mcRuns).toBe(N);
    expect(a.n).toBe(N);
    // a whole number of futures out of N: 34 of 40 last to 100 (measured; the plan's own run, not the answer's 36)
    expect(Math.round(a.fixedAge * N)).toBe(34);
    expect(a.fixedAge * N).toBeCloseTo(34, 9);
  });
});

describe('D: the answer and the plan kept from it (not yet one: the gaps measured above)', () => {
  for (const [name, ins] of [['D1', D1], ['D3', D3], ['D9', D9]]) {
    it.fails(`${name}: the same count, weighted chance, run-out age and plan-to age`, () => {
      const d = answerD(ins, ENV);
      const kept = keptPlansOf('d', d, ENV).yours;
      const plan = planReading(kept);
      const answer = answerReading(d);
      expect(answer.planToAge).toBe(plan.planToAge);
      expect(answer.lasted).toBe(plan.lasted);
      expect(answer.weighted).toBe(plan.weighted);
      expect(answer.runOutAge).toBe(plan.runOutAge);
    });
  }
});

/** The households of the C, A and B checks (made up). */
const ALEX = { you: { pot: 250000, age: 58 } };
const SAM = { household: 'single', you: { age: 45, pot: 60000, statePension: { kind: 'full' }, finalSalary: { has: false }, payIn: { kind: 'split', own: 500, employer: 300 } },
  savings: 10000, savingsIn: 0, savingRisk: 'balanced', risk: 'balanced', charge: 0.5, endAge: 95 };
const samB = (stop, spend) => answerB({ ...SAM, spend: { kind: 'amount', amount: spend }, stop: { age: stop }, confidence: 'balanced' }, { ...ENV, detail: 'answer' });

describe('C: the plan kept at a level passes at that level (not yet: the weights differ)', () => {
  for (const level of ['careful', 'balanced', 'bold']) {
    it(`${level}: the same count of futures that last to the plan-to age (holds today)`, () => {
      const c = answerC({ ...ALEX, confidence: level }, ENV);
      const plan = planReading(keptPlansOf('c', c, ENV).yours);
      expect(plan.planToAge).toBe(c.chance.planToAge);
      expect(plan.lasted).toBe(N - c.chance.fails);
    });
    it.fails(`${level}: the kept plan says yes at the level, with the answer's weighted chance`, () => {
      const c = answerC({ ...ALEX, confidence: level }, ENV);
      const plan = planReading(keptPlansOf('c', c, ENV).yours);
      expect(plan.verdict).toBe('yes');
      expect(plan.weighted).toBe(c.chance.weighted);
    });
  }
});

describe('A and B: the plan kept from a saver\'s answer', () => {
  it('B kept paying in what would be enough: the kept plan passes at the level (holds today)', () => {
    for (const [stop, spend] of [[60, 2000], [62, 1800]]) {
      const plan = planReading(keptPlansOf('b', samB(stop, spend), ENV, { payIn: 'enough' }).yours);
      expect(plan.verdict).toBe('yes');
    }
  });
  it.fails('B kept paying in as now: the same count of futures that last (the plan draws from one middling pot)', () => {
    const b = samB(60, 2000);
    const plan = planReading(keptPlansOf('b', b, ENV).yours);
    expect(plan.lasted).toBe(N - b.chance.fails);
  });
  it.fails('A at the age it shows: the same count of futures that last and the same weighted chance', () => {
    const a = answerA({ ...SAM, spend: { kind: 'amount', amount: 2000 }, stop: { kind: 'age', age: 60 }, partTime: { has: false } }, { ...ENV, detail: 'chart' });
    const plan = planReading(keptPlansOf('a', a, ENV).yours);
    expect(plan.verdict).toBe(a.shown.verdict);
    expect(plan.lasted).toBe(N - a.chance.fails);
    expect(plan.weighted).toBe(a.chance.weighted);
  });
});
