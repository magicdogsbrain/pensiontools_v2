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
import { lastsOf, runLasts, weightedOptsOf } from '../../../src/answers/plan/lastsRun.js';
import { dateOf } from '../../../src/answers/plan/dates.js';
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
  it('D7 with the work lever on: Keep keeps the main verdict\'s household, so the kept plan is the main verdict, not the lever\'s', () => {
    // (the lead's ruling A: "Would some work help?" is a try; Keep never writes it. Before, Keep wrote D's £15,000 a year
    // for 3 years as part-time work, so the plan kept from D7 tested a household the main verdict had not)
    const d = answerD(D7, ENV);
    expect(d.work).not.toBeNull();
    const kept = keptPlansOf('d', d, ENV).yours;
    expect(kept.stressTool.settings.extraIncomes).toEqual([]);
    expect(answerReading(d)).toEqual(planReading(kept));
    // the lever itself still runs with the work in (a try on the same plan)
    expect(d.work.lasted).toBeGreaterThan(d.lasted);
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

/**
 * The kept plan's own "when, how long, how much" and floor (the stress panel's As planned row: OneAnswer.planShortfallOf on
 * the plan's run and the run followed on to the weighting age; the floor line weightedPartOf's), in the answers' shape.
 */
function planShortfall(plan) {
  const { settings, strategyId, p, r, a } = lastsOf(plan, { today: TODAY, futures: N, histories: false });
  const w = weightedOptsOf(plan, { settings, strategyId, p, r, now: dateOf(TODAY) });
  const sf = planShortfallOf(r, p, a, w.opts);
  return {
    when: sf.when ? { typical: sf.when.typical, worst: sf.when.worst, worstLasts: sf.when.worstLasts } : null,
    howLong: sf.howLong ? { paid: sf.howLong.paid, of: sf.howLong.of, ...(sf.howLong.anyway ? { anyway: true } : {}) } : null,
    howMuch: sf.howMuch, floor: a.floor ? { age: a.floor.age, yearly: a.floor.yearly } : null
  };
}
const answerShortfall = (sf) => ({ when: sf.when, howLong: sf.howLong, howMuch: sf.howMuch, floor: sf.floor ? { age: sf.floor.age, yearly: sf.floor.yearly } : null });

/** Pat (made up): 60, stopped, £200,000 in a pension, £20,000 of savings, a final-salary pension of £9,000 a year from 63. */
const PAT_D = { you: { age: 60, pot: 200000, taxFreeTaken: 'no', finalSalary: { has: true, yearly: 9000, fromAge: 63 } }, savings: 20000 };

describe('D and C from now: the words are the kept plan\'s (one reader of its incomes and of when the money runs out)', () => {
  // Before, the words read the household's own stop plan beside the kept plan's runs: "how long it still pays" counted a
  // future that ran out in month m as m/12 years paid (the household's rule), the plan as the whole years before the year
  // it ran out in (planShortfallOf: the year it first failed, f.fy). Pat at £1,950 a month, 100 futures (the check): the
  // words said "still pays for 28 of the 39 years", the plan's own stress panel 27 — e.g. a future out in month 330 (age
  // 87½) counted 27.5 years in the words and 27 in the plan, and the mean of such counts rounded down one apart.
  for (const [name, ins, amounts] of [['Pat', PAT_D, [1850, 1950]], ['D1', D1, [2100]], ['D3', D3, [2000]], ['D5', D5, [1800]]]) {
    it(`${name}: "Try the bad years"' As planned row and the words say the kept plan's when, how long, how much and floor`, () => {
      for (const amount of amounts) {
        const ins1 = { ...ins, spend: { kind: 'amount', amount } };
        const d = answerD(ins1, ENV);
        const kept = keptPlansOf('d', d, ENV).yours;
        const plan = planShortfall(kept);
        const row = runStressStrip('d', d.inputs, withPlanPath(ENV), { perMonth: amount }).rows[0];
        expect(answerShortfall(row.sf), `${name} £${amount}`).toEqual(plan);
        if (plan.howLong) expect(d.sentences.howLong.text, `${name} £${amount}`).toContain(` ${plan.howLong.paid} of the ${plan.howLong.of} years`);
      }
    }, 60000);
  }
  it('Pat, How much can I take, at an amount tried: As planned\'s when, how long, how much and floor are the kept plan\'s', () => {
    const PAT_C = { you: { age: 60, pot: 200000, finalSalary: { has: true, yearly: 9000, fromAge: 63 } }, savings: 20000 };
    for (const take of [1850, 1950]) {
      const c = answerC({ ...PAT_C, take }, ENV);
      const plan = planShortfall(keptPlansOf('c', c, ENV, { take: 'tried' }).yours);
      const row = runStressStrip('c', c.inputs, withPlanPath(ENV), { perMonth: take }).rows[0];
      expect(answerShortfall(row.sf), `£${take}`).toEqual(plan);
    }
  }, 60000);
  it('Pat: what it is made of, and what comes in anyway, are the kept plan\'s incomes', () => {
    // the kept plan pays the final-salary pension from its run year 3 (63) at £9,000 a year at today's prices (£750 a month)
    // and the full State Pension, £241.30 a week (£12,547.60 a year, £1,045.63 a month), from run year 7 (67); taxed with
    // the plan's bands, a quarter tax-free: the phases are 60-63 pots only, 63-67 £750 a month, 67-99 £750 and £1,045.63
    const d = answerD({ ...PAT_D, spend: { kind: 'amount', amount: 1950 } }, ENV);
    expect(d.phases.map((ph) => [ph.fromAge, ph.toAge, ph.finalSalary, ph.statePension])).toEqual([[60, 63, 0, 0], [63, 67, 750, 0], [67, 99, 750, 1045.63]]);
    // what comes in anyway once all of it has started, after tax: £21,547.60 a year less tax on £8,977.60 above the
    // £12,570 allowance at 20% (£1,795.52) = £19,752.08 a year, £1,646.01 a month
    expect(d.guaranteed.monthlyAfterTax).toBe(1646.01);
  });
});

describe('How much can I take never offers less than what comes in anyway (the lead\'s ruling D)', () => {
  // Kim (made up), 68, a final-salary pension of £30,000 a year and the full State Pension (£12,547.60) both being paid:
  // £42,547.60 a year before tax, £29,977.60 of it above the £12,570 allowance at 20% = £5,995.52 tax, £36,552.08 a year
  // after tax = £3,046.01 a month, said in whole £10s: £3,040. Before, with £1 in a pension, every level was below it
  // (careful £2,160, balanced £2,310, bold £2,620 at 40 futures): the kept plan's final-salary pension rises by at most 5%
  // a year, falls behind prices in some futures, and the pots (£1) could not make up the gap.
  for (const pot of [1, 10000]) {
    it(`£${pot} in a pension: each level is at least £3,040, with the kept plan's own chance at it, and says why`, () => {
      const KIM = { you: { age: 68, pot, finalSalary: { has: true, yearly: 30000, fromAge: 60 } } };
      const c = answerC(KIM, ENV);
      for (const id of ['careful', 'balanced', 'bold']) expect(c.levels[id].monthly, id).toBeGreaterThanOrEqual(3040);
      expect(c.levels.balanced.monthly).toBe(3040);
      // its own chance: the plan kept at £3,040 says the same weighted chance and count
      const plan = planReading(keptPlansOf('c', c, ENV).yours);
      expect({ weighted: c.levels.balanced.weighted, lasted: Math.round(c.levels.balanced.fixedAge * N) }).toEqual({ weighted: plan.weighted, lasted: plan.lasted });
      expect(c.warnings.find((w) => w.id === 'final-salary-capped').text).toBe('Your pension from your final-salary scheme rises by at most 5% a year; in years when prices rise faster it buys less.');
      // the first phase is what comes in anyway (the pots add nothing), within the £10 the amount is rounded down by
      expect(c.phases[0].takeHome).toBe(3046.01);
    });
  }
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
