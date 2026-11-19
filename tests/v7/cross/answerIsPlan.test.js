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
 * D and C from now are on the plan path for one person (answers/keep/planPath.js): their blocks hold to the last bit. What does not hold yet
 * is `it.fails`, each with the gap measured at 40 futures on 30 September 2026. When an answer is put on the plan path the `it.fails` beside it starts to fail and becomes
 * an `it`: the gap cannot close silently, nor open again.
 *
 * Measured gaps (40 futures; the answer's figure, then the kept plan's; D's, closed by the plan path, kept as the record):
 *   D1 (68, £300,000 pension, £40,000 savings, £2,100 a month): lasts to 99 in 26 of 40 vs 25 of 40; weighted 0.877 vs
 *      0.858; bad-case run-out age 90 vs 93. Both say "close" here; at 1,000 futures the answer says close (597 of 1,000)
 *      and the plan says no (571 of 1,000).
 *   D3 (62, £120,000 pension, £200,000 invested ISA, £2,000 a month): 20 of 40 both; weighted 0.728 vs 0.705; run-out 83 vs 87.
 *   D9 (88, £90,000, £1,500 a month): 36 of 40 vs 34 of 40; weighted 0.981 vs 0.964; run-out 100 vs 100.
 *   C (Alex, 58, £250,000, from now), kept at each level: the answer passed at its level, the kept plan said "close" at
 *      every level. Careful £1,320 a month: 36 of 40 both, weighted 0.957 vs 0.940; balanced £1,370: 32 of 40 both,
 *      0.902 vs 0.879; bold £1,500: 20 of 40 both, 0.713 vs 0.684. The counts agreed; the weights did not. Closed by the
 *      plan path for one person from now (its block holds to the last bit).
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
import { answerD, D1, D3, D5, D7, D9, withPlanPath } from '../d/_d.js';
import { runStressStrip } from '../../../src/answers/shared/stressStrip.js';
import { answerC } from '../c/_c.js';
import { answerA } from '../a/_a.js';
import { answerB } from '../b/_b.js';
import { keptPlansOf } from '../../../src/answers/keep/keptPlan.js';
import { buildPlanSeed } from '../../../src/answers/keep/planSeed.js';
import { seedToScenario } from '../../../src/services/PlanFromSeed.js';
import { lastsOf, runLasts } from '../../../src/answers/plan/lastsRun.js';
import { planShortfallOf } from '../../../src/services/OneAnswer.js';
import { planCaseOf, keptPlanAt } from '../../../src/answers/keep/planPath.js';
import { checkInputs } from '../../../src/answers/shared/validate.js';
import { SCHEMA_D } from '../../../src/answers/d/schema.js';
import { fastEligible } from '../../../src/answers/shared/fastEngine.js';
import { sliceReturns } from '../../../src/answers/shared/lives.js';
import { simulate } from '../../../src/services/SimulationEngine.js';

const TODAY = '2026-09-30';
const N = 40;
const ENV = { today: TODAY, futures: N, seed: 0, trace: false };

/**
 * The kept plan's reading at the answer's futures: the count that lasts to the plan-to age, the weighted chance, the
 * middle run-out age (the floor line's), the bad case (the worst 1 in 10: planShortfallOf's `when.worst`), what is
 * typically left, the plan-to age and the verdict.
 */
function planReading(plan) {
  const { a, r, p } = lastsOf(plan, { today: TODAY, futures: N, histories: false });
  const sf = planShortfallOf(r, p, a);
  return { lasted: Math.round(a.fixedAge * N), weighted: a.weighted, floorAge: a.floor ? a.floor.age : null, worstAge: sf.when ? sf.when.worst : a.planToAge,
    left: a.left.typical, best: a.left.best, planToAge: a.planToAge, verdict: a.verdict, leftWords: a.words.left };
}

/** Pounds to the nearest £1,000, as the plan's words say what is left (OneAnswer gbpK, from the figure to the pound). */
const k = (v) => Math.round(Math.round(v) / 1000) * 1000;

/** The answer's own reading, said the same way. */
const answerReading = (d) => ({ lasted: N - d.fails, weighted: d.chance.weighted, floorAge: d.floorAge ?? null, worstAge: d.runOutAge,
  left: d.left ? d.left.typical : null, best: d.left ? d.left.best : null, planToAge: d.chance.planToAge, verdict: d.verdict,
  // what the answer's words say is left (the sentence a person reads, not only the figure beside it)
  leftWords: d.sentences.left ? d.sentences.left.text : null });

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
    // a whole number of futures out of N: 39 of 40 last to 100 (measured; 34 before a retired plan's year 0 paid only for
    // the months it has — September to March on 30 September — and the State Pension already paid all of them; 36 before
    // April to August, the months before the pots' day, stopped giving the pots that year's returns: the futures that run
    // out are those with a bad first year, and they no longer take five months of it)
    expect(Math.round(a.fixedAge * N)).toBe(39);
    expect(a.fixedAge * N).toBeCloseTo(39, 9);
  });
});

describe('the kept plan\'s config on the answers\' fast path', () => {
  it('a kept plan\'s Pots & Valves config (the default ISA strategy named, the glidepath of the plan\'s length on a longer run) is the fast path\'s, and runs out in the month simulate does', () => {
    const pc = planCaseOf('d', checkInputs(SCHEMA_D, D1, ENV).inputs, ENV);
    const config = pc.runner.configsAtH(2100 * 12)[0].config;
    expect(config.isaDrawdownStrategy).toBe('minimiseEarlyTax');
    expect(config.duration).toBeLessThan(config.years);
    expect(fastEligible(config)).toBe(true);
    for (let i = 0; i < N; i++) {
      const life = pc.sp.lives[i];
      const s = simulate(config, sliceReturns(life, 0, config.years), life.seed);
      const f = pc.runner.run(0, i, config);
      expect([f.failed, f.failMonth]).toEqual([s.failed, s.failMonth]);
    }
  });
  it('a config with year 0 for fewer than twelve months (7 of them) is the fast path\'s too, and runs out in the month simulate does', () => {
    const pc = planCaseOf('d', checkInputs(SCHEMA_D, D1, ENV).inputs, ENV);
    const config = { ...pc.runner.configsAtH(2100 * 12)[0].config, year0Months: 7 };
    expect(fastEligible(config)).toBe(true);
    for (let i = 0; i < N; i++) {
      const life = pc.sp.lives[i];
      const s = simulate(config, sliceReturns(life, 0, config.years), life.seed);
      const f = pc.runner.run(0, i, config);
      expect([f.failed, f.failMonth, f.equity, f.isa]).toEqual([s.failed, s.failMonth, s.finalEquity, s.finalIsa]);
    }
  });
});

describe('D: the answer is the plan kept from it (one person, the plan path)', () => {
  // D1 25 of 40 to 99, weighted 0.858, the money runs out at 93 in the middle of the futures it runs out in, 90 in the worst
  // 1 in 10; D3 20 of 40, 0.705, 87; D5 (53, the pension closed until 57) 12 of 40 to 98 (the kept plan's 45 years), 0.492;
  // D9 34 of 40 to 100, 0.964. Each figure the kept plan's own, to the last bit.
  for (const [name, ins] of [['D1', D1], ['D3', D3], ['D5', D5], ['D9', D9]]) {
    it(`${name}: the same count, weighted chance, verdict, run-out ages, left at the end and plan-to age`, () => {
      const d = answerD(ins, ENV);
      const kept = keptPlansOf('d', d, ENV).yours;
      expect(answerReading(d)).toEqual(planReading(kept));
    });
  }
  it('D7: the answer without the work is the plan kept without it', () => {
    const d = answerD({ ...D7, work: { has: false } }, ENV);
    expect(answerReading(d)).toEqual(planReading(keptPlansOf('d', d, ENV).yours));
  });
  it('each level\'s amount, kept, passes at its level, and £10 a month more does not', () => {
    const d = answerD(D1, ENV);
    for (const level of ['careful', 'balanced', 'bold']) {
      const at = (monthly) => planReading(keptPlansOf('d', answerD({ ...D1, confidence: level, spend: { kind: 'amount', amount: monthly } }, ENV), ENV).yours);
      const m = d.levels[level].monthly;
      expect(at(m).verdict, level).toBe('yes');
      expect(at(m).weighted, level).toBe(d.levels[level].weighted);
      expect(at(m + 10).verdict, level).not.toBe('yes');
    }
  }, 60000);
  it('"Try the bad years": As planned\'s left at the end is the kept plan\'s, said to the nearest £1,000', () => {
    // D1 at £2,100 (before: the strip read the answers' own left, the middle of 40 one lower and the price level a year
    // later, so it said a figure the kept plan does not show)
    const d = answerD(D1, ENV);
    const plan = planReading(keptPlansOf('d', d, ENV).yours);
    const row = runStressStrip('d', d.inputs, withPlanPath(ENV), { perMonth: 2100 }).rows[0];
    expect(row.id).toBe('asPlanned');
    expect(row.sf.left).toEqual({ typical: k(plan.left), best: k(plan.best), mostNone: plan.lasted * 2 < N });
  });
});

/** The households of the C, A and B checks (made up). */
const ALEX = { you: { pot: 250000, age: 58 } };
const SAM = { household: 'single', you: { age: 45, pot: 60000, statePension: { kind: 'full' }, finalSalary: { has: false }, payIn: { kind: 'split', own: 500, employer: 300 } },
  savings: 10000, savingsIn: 0, savingRisk: 'balanced', risk: 'balanced', charge: 0.5, endAge: 95 };
const samB = (stop, spend) => answerB({ ...SAM, spend: { kind: 'amount', amount: spend }, stop: { age: stop }, confidence: 'balanced' }, { ...ENV, detail: 'answer' });

describe('C from now: the plan path keeps what the answer keeps', () => {
  // the plan path's own keep (planPath.keptPlanAt, from the checked inputs and the level's amount alone) writes the plan the
  // real answer's keep writes: Alex at 58 and someone of 68 with savings, each at the level's amount
  for (const ins of [ALEX, { you: { pot: 300000, age: 68 }, savings: 40000 }]) {
    it(`${ins.you.age}: the same settings and saving block as keptPlansOf on the answer`, () => {
      const c = answerC(ins, ENV);
      const real = keptPlansOf('c', c, ENV).yours;
      const mine = keptPlanAt('c', c.inputs, ENV, c.levels[c.level].monthly, c.basis.startAge);
      expect(mine.stressTool.settings).toEqual(real.stressTool.settings);
      expect(mine.accumulationTool).toEqual(real.accumulationTool);
    });
  }
});

describe('C from now: the answer is the plan kept from it (one person, the plan path)', () => {
  it('"Try the bad years": As planned\'s left at the end is the kept plan\'s, said to the nearest £1,000', () => {
    const c = answerC({ ...ALEX, confidence: 'balanced' }, ENV);
    const m = c.levels.balanced.monthly;
    const plan = planReading(keptPlansOf('c', c, ENV).yours);
    const row = runStressStrip('c', c.inputs, withPlanPath(ENV), { perMonth: m }).rows[0];
    expect(row.sf.left).toEqual({ typical: k(plan.left), best: k(plan.best), mostNone: plan.lasted * 2 < N });
  });
  // Alex, 58, £250,000, from now: each level's amount, kept, is the kept plan's own reading to the last bit — the count of
  // futures that last to the plan-to age, the weighted chance (so the verdict "yes" at the level), the middle and bad-case
  // run-out ages, what is typically left and in the best 1 in 10; £10 a month more is not "yes" at the level.
  for (const level of ['careful', 'balanced', 'bold']) {
    it(`${level}: the same count, weighted chance, verdict, run-out ages, left at the end and plan-to age`, () => {
      const c = answerC({ ...ALEX, confidence: level }, ENV);
      const m = c.levels[level].monthly;
      const at = answerC({ ...ALEX, confidence: level, take: m }, ENV);
      const plan = planReading(keptPlansOf('c', c, ENV).yours);
      expect({ lasted: N - c.chance.fails, weighted: c.chance.weighted, floorAge: c.floorAge, worstAge: at.take.runOutAge, left: c.left.typical, best: c.left.best,
        planToAge: c.chance.planToAge, verdict: at.take.verdict, leftWords: c.sentences.left.text }).toEqual(plan);
      // the amount tried at the level's amount says the same left
      expect(at.sentences.takeLeft.text).toBe(plan.leftWords);
      expect(plan.verdict).toBe('yes');
      const more = planReading(keptPlansOf('c', answerC({ ...ALEX, confidence: level, take: m + 10 }, ENV), ENV, { take: 'tried' }).yours);
      expect(more.verdict).not.toBe('yes');
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
