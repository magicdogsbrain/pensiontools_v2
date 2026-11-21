/**
 * COUPLES ON TWO CLOCKS (7.12.0; step P5 of the engine lane, the lead's ruling P): the household run reads two plans that
 * draw from different tax years — one still saving and one retired, or both stopping later — each on its own clock
 * (answers/keep/planPath.js coupleCaseOf):
 *   - the household's clock is this tax year; each plan draws from its own first tax year, g years on (p.yearsToStart);
 *   - a plan still saving runs its whole lives (ruling 8): in future i, its own pots at its stop, drawn on future i's market
 *     from there, as its own plan test runs them — so a saver read as a household of one says what "Does it last?" says;
 *   - the ages are the younger's from this tax year; the household runs to the end of the plan that ends last;
 *   - a plan whose money runs out before the other plan draws ends the household there; after, the other's money pays its
 *     part (the pass-on, on the two plans' own clocks).
 * Before this step two such plans gave no household figure ({ reason: 'notSameStart' }).
 *
 * Measured (40 futures, 30 Sep 2026): Sam (66, £200,000, £10,000 savings, £1,500 a month) and Pat (60, £100,000, paying in
 * £500 a month to 64, then £1,200 a month): 38 of 40 last, weighted 0.9839, "yes", middle run-out at Pat's 95, plan to
 * Pat's 99 — read from either plan. (Pass 1 said 0.9835: it weighed the household from the younger's first draw year,
 * Pat's stop four years on; the household draws from today, Sam's first year, so pass 2 weighs it from there — and two
 * people of one age then weigh it the same in either order.)
 *
 * The households are made up (Sam, Pat, Jo, Kim; round figures).
 */
import { describe, it, expect } from 'vitest';
import { answerD } from '../d/_d.js';
import { answerB } from '../b/_b.js';
import { answerA } from '../a/_a.js';
import { keptPlansOf } from '../../../src/answers/keep/keptPlan.js';
import { lastsOf } from '../../../src/answers/plan/lastsRun.js';
import { planShortfallOf } from '../../../src/services/OneAnswer.js';
import { householdReadingOf, passOnConfig } from '../../../src/answers/keep/planPath.js';
import { householdLastsOf } from '../../../src/answers/plan/householdRun.js';

const TODAY = '2026-09-30';
const N = 40;
const ENV = { today: TODAY, futures: N, seed: 0, trace: false };

/** "Does it last?" on one plan at these futures. */
function planReading(plan) {
  const { a, r, p } = lastsOf(plan, { today: TODAY, futures: N, histories: false });
  const sf = planShortfallOf(r, p, a);
  return { lasted: Math.round(a.fixedAge * N), weighted: a.weighted, verdict: a.verdict, floorAge: a.floor ? a.floor.age : null,
    worstAge: sf.when ? sf.when.worst : a.planToAge, left: { typical: a.left.typical, best: a.left.best }, planToAge: a.planToAge };
}
/** The household reading of two plans, in planReading's shape. */
function householdReading(plan, partner) {
  const h = householdReadingOf(plan, partner, { today: TODAY, futures: N });
  if (h.reason) return h;
  return { lasted: h.lasted, weighted: h.weighted, verdict: h.verdict, floorAge: h.floorAge, worstAge: h.worstAge, left: h.left, planToAge: h.planToAge };
}
const saverPlan = (inputs) => keptPlansOf('b', answerB(inputs, ENV), ENV).yours;
const retiredPlan = (inputs) => keptPlansOf('d', answerD(inputs, ENV), ENV).yours;

const PAT = { you: { age: 60, pot: 100000, payIn: { kind: 'total', total: 500 } }, stop: { kind: 'age', age: 64 }, spend: { kind: 'amount', amount: 1200 } };
const SAM = { you: { age: 66, pot: 200000, taxFreeTaken: 'no' }, savings: 10000, spend: { kind: 'amount', amount: 1500 } };

describe('a plan still saving, read as a household of one, is its own plan test (whole lives)', () => {
  const savers = {
    'Pat, 60, stopping at 64': PAT,
    'Jo, 35, stopping at 65': { you: { age: 35, pot: 30000, payIn: { kind: 'total', total: 600 } }, stop: { kind: 'age', age: 65 }, spend: { kind: 'amount', amount: 2000 } },
    'Kim, 58, stopping at 61 with savings, where every future runs out': { you: { age: 58, pot: 150000, payIn: { kind: 'total', total: 300 } }, stop: { kind: 'age', age: 61 }, savings: 20000, spend: { kind: 'amount', amount: 2200 } }
  };
  for (const [name, inputs] of Object.entries(savers)) {
    it(`${name}: the same count, weighted chance, verdict, run-out ages, left at the end and plan-to age`, () => {
      const plan = saverPlan(inputs);
      expect(plan.stressTool.settings.retired).toBe(false);
      expect(householdReading(plan, null)).toEqual(planReading(plan));
    });
  }
});

describe('one saving, one retired: one household figure on two clocks', () => {
  it('Sam drawing now, Pat saving to 64: a figure, the same from either plan, to the younger\'s plan-to age', () => {
    const sam = retiredPlan(SAM), pat = saverPlan(PAT);
    const h = householdReading(sam, pat);
    expect(h.reason).toBeUndefined();
    expect(householdReading(pat, sam)).toEqual(h);
    // the ages are Pat's (the younger) from this tax year: Pat's plan runs to 99, after Sam's (Sam's 99 is Pat's 93)
    expect(h.planToAge).toBe(planReading(pat).planToAge);
    expect(h.planToAge).toBe(99);
    expect({ lasted: h.lasted, verdict: h.verdict, floorAge: h.floorAge }).toEqual({ lasted: 38, verdict: 'yes', floorAge: 95 });
    // (weighed from the household's first draw year: Sam's, today)
    expect(h.weighted).toBeCloseTo(0.9839, 4);
    const fromSam = householdLastsOf(sam, pat, { today: TODAY, futures: N });
    expect(fromSam).toEqual(householdLastsOf(pat, sam, { today: TODAY, futures: N }));
    expect(fromSam.lasted).toBe(38);
  });

  it('a plan whose money runs out before the other plan draws ends the household there', () => {
    // Sam, 66, £30,000 and nothing else to draw on, £2,500 a month: Sam's money is gone in his first year or two, every
    // future (alone: run out at 67). Pat's pension is not drawn until Pat stops at 64, four years on, so nothing pays Sam's
    // part meanwhile: the household runs out in Pat's 61st year, never later.
    const sam = retiredPlan({ you: { age: 66, pot: 30000, taxFreeTaken: 'no' }, spend: { kind: 'amount', amount: 2500 } });
    const pat = saverPlan(PAT);
    const alone = householdReading(sam, null);
    expect({ lasted: alone.lasted, worstAge: alone.worstAge }).toEqual({ lasted: 0, worstAge: 67 });
    const h = householdReading(sam, pat);
    expect(h.lasted).toBe(0);
    expect(h.worstAge).toBeLessThan(64);
    expect(h.worstAge).toBe(61);
    expect(householdReading(pat, sam)).toEqual(h);
  });
});

describe('the household is weighed from its first draw year, in either order', () => {
  it('Sam and Pat, both 60, Sam drawing now and Pat saving to 62: the same figures whichever plan is read first', () => {
    // Two people of one age: before pass 2 the household took the drawing start of whichever plan came first as its own
    // (the younger's, and on a tie the first), so Sam's plan read first weighed from today and Pat's from Pat's stop two
    // years on, and the weighted chance moved with the order (40 futures: 0.5837 from Sam's plan, 0.5819 from Pat's). The
    // household draws from today (Sam's first year): S(0) = 1, and both orders say 0.5837.
    const sam = retiredPlan({ you: { age: 60, pot: 150000, taxFreeTaken: 'no' }, savings: 10000, spend: { kind: 'amount', amount: 1400 } });
    const pat = saverPlan({ you: { age: 60, pot: 90000, payIn: { kind: 'total', total: 400 } }, stop: { kind: 'age', age: 62 }, spend: { kind: 'amount', amount: 1100 } });
    const a = householdReading(sam, pat), b = householdReading(pat, sam);
    expect(a.reason).toBeUndefined();
    expect(b).toEqual(a);
  });
});

describe('the household\'s pass-on on two clocks, worked by hand (planPath passOnConfig)', () => {
  it('k, drawing now, pays the part of j, who draws from two years on, from j\'s run-out month, in the same tax years', () => {
    // As the one-clock example (coupleIsPlans.test.js): j a target of £20,000 a year before tax (£18,514 after), a £10,000
    // final-salary pension from j's year 0 rising by at most 5% a year; k £30,000 before tax (£26,514 after); prices rise 10% a
    // year. Now j draws from two years after k (shift 2: j's year y is k's year y + 2) and runs out in j's month 6.
    //   j's year 0 = k's year 2: the pension buys £10,000 (no tax). Short £8,514; for months 6–11 of k's twelve: half,
    //           £4,257. k takes home 26,514 + 4,257 = £30,771: before tax 12,570 + 18,201 / 0.8 = £35,321.25.
    //   j's year 1 = k's year 3: 10,000 × 1.05 / 1.1 = £9,545.45; short £8,968.55; k £35,482.55 after tax,
    //           12,570 + 22,912.55 / 0.8 = £41,210.69.
    //   j's year 2 = k's year 4: 10,000 × (1.05 / 1.1)² = £9,111.57; short £9,402.43; k £35,916.43, before tax £41,753.04.
    //   k's years 0 and 1: £30,000, as k's plan has it (j does not draw yet).
    const base = { baseSalary: 0, pa: 12570, brl: 50270, hrl: 125140, spStartYear: 99, spWeeklyAmount: 0, other: 0, extraIncomes: [] };
    const cJ = { ...base, years: 3, targetSchedule: [20000, 20000, 20000], dbAmount: 10000, dbStartYear: 0, dbIndexation: 'lpi5' };
    const cK = { ...base, years: 5, targetSchedule: [30000, 30000, 30000, 30000, 30000], dbAmount: 0 };
    const out = passOnConfig(cK, cJ, { inflation: [0.1, 0.1, 0.1] }, 6, 2);
    expect(out.targetSchedule.slice(0, 2)).toEqual([30000, 30000]);
    expect(out.targetSchedule[2]).toBeCloseTo(35321.25, 1);
    expect(out.targetSchedule[3]).toBeCloseTo(41210.69, 1);
    expect(out.targetSchedule[4]).toBeCloseTo(41753.04, 1);
    expect(cK.targetSchedule).toEqual([30000, 30000, 30000, 30000, 30000]);
  });
});

// ---- step P5, pass 2: the answers for couples on two clocks are the two kept plans ----------------------------------------
describe('a couple on two clocks, When could I stop: the row, kept, is the two plans\' household reading', () => {
  // the answer's row and the two plans its Keep writes, read as one household (householdReadingOf), on the same futures: the
  // count, the weighted chance, the verdict, the bad case and the plan-to age, every figure equal
  const cases = {
    'one saving, one retired: you stop at 62, Pat (64) has stopped': { household: 'couple', you: { age: 58, pot: 150000, payIn: { kind: 'total', total: 500 } },
      partner: { age: 64, pot: 220000, stop: { kind: 'already' } }, savings: 30000, stop: { kind: 'age', age: 62 }, spend: { kind: 'amount', amount: 2400 } },
    'both 58, paying in, stopping together at 61': { household: 'couple', you: { age: 58, pot: 250000, payIn: { kind: 'total', total: 400 } },
      partner: { age: 58, pot: 180000, payIn: { kind: 'total', total: 300 } }, savings: 20000, stop: { kind: 'age', age: 61 }, spend: { kind: 'amount', amount: 2600 } }
  };
  for (const [name, inputs] of Object.entries(cases)) {
    it(name, () => {
      const a = answerA(inputs, { ...ENV, detail: 'chart', ages: [inputs.stop.age] });
      expect(a.status).toBe('ok');
      expect(a.basis.planPath).toBe(true);
      const kept = keptPlansOf('a', a, ENV);
      expect(kept.partner).not.toBeNull();
      const h = householdReading(kept.yours, kept.partner);
      expect(h.reason).toBeUndefined();
      expect({ lasted: Math.round(a.shown.lasted * N), weighted: a.shown.weighted, verdict: a.shown.verdict, worstAge: a.shown.runOutAge, planToAge: a.chance.planToAge })
        .toEqual({ lasted: h.lasted, weighted: h.weighted, verdict: h.verdict, worstAge: h.worstAge, planToAge: h.planToAge });
    });
  }
});

describe('a couple on two clocks, Am I paying in enough: kept, it is the two plans\' household reading, and A\'s row', () => {
  const cases = {
    'one saving, one retired: you stop at 62, Pat (64) has stopped': { household: 'couple', you: { age: 58, pot: 150000, payIn: { kind: 'total', total: 500 } },
      partner: { age: 64, pot: 220000, stop: { kind: 'already' } }, savings: 30000, stop: { kind: 'age', age: 62 }, spend: { kind: 'amount', amount: 2400 } },
    'both 58, paying in, stopping together at 61': { household: 'couple', you: { age: 58, pot: 250000, payIn: { kind: 'total', total: 400 } },
      partner: { age: 58, pot: 180000, payIn: { kind: 'total', total: 300 } }, savings: 20000, stop: { kind: 'age', age: 61 }, spend: { kind: 'amount', amount: 2600 } }
  };
  for (const [name, inputs] of Object.entries(cases)) {
    it(name, () => {
      const b = answerB(inputs, ENV);
      expect(b.status).toBe('ok');
      expect(b.basis.planPath).toBe(true);
      const kept = keptPlansOf('b', b, ENV);
      expect(kept.partner).not.toBeNull();
      const h = householdReading(kept.yours, kept.partner);
      expect(h.reason).toBeUndefined();
      expect({ lasted: Math.round(b.wholeLife.lasted * N), weighted: b.wholeLife.weighted, planToAge: b.chance.planToAge })
        .toEqual({ lasted: h.lasted, weighted: h.weighted, planToAge: h.planToAge });
      const a = answerA(inputs, { ...ENV, detail: 'chart', ages: [inputs.stop.age] });
      expect({ lasted: a.shown.lasted, weighted: a.shown.weighted }).toEqual({ lasted: b.wholeLife.lasted, weighted: b.wholeLife.weighted });
    });
  }
});

describe('a couple whose later stop is past the years a kept plan holds stays on the household run (P6: cannot move yet)', () => {
  // Jo stopped at 20 and Kim, 20, stops at 57, the plan to 80: the plans a keep writes run from the first stop for at most
  // 45 years (RULES.maxYears; 60 are wanted, 20 to 80), so to Jo's and Kim's 65. B's later rows (Kim stopping at 58 to 67)
  // put Kim's stop 38 to 47 years after Jo's: from 45 on, Kim's own plan has no year left (45 − 45 = 0), and no plan the keep
  // can write ("people.0.years"). Before: B threw; now the household run answers them.
  it('Am I paying in enough, Kim 20 stopping at 57 and Jo 20 already stopped: an answer, on the household run', () => {
    const inputs = { household: 'couple', you: { age: 20, pot: 20000, payIn: { kind: 'total', total: 300 } }, stop: { kind: 'age', age: 57 },
      partner: { age: 20, pot: 10000, stop: { kind: 'already' } }, endAge: 80, spend: { kind: 'amount', amount: 2000 } };
    const b = answerB(inputs, ENV);
    expect(b.status).not.toBe('invalid');
  });
});

describe('a couple from a later stop with a pension still closed at its own stop stays on the household run until ruling W (P6)', () => {
  // Sam, 40, pays in 4% of £14,000 and stops at 68 (a £200,000 final-salary pension from 75); Kim, 18, pays in £1 a month
  // and stops with Sam, at 46, the pension closed until 57. The household split puts all the spending on Sam; Sam's kept
  // plan (about £22,000 at the stop against about £24,900 a year) runs out in its fourth year, and Kim's money would pay on —
  // but those are Kim's closed years, which the kept plan reads as unpaid, not as running out (ruling W, not built yet), so
  // the two kept plans said every future lasts with about £500 between them. On the household run nothing pays: 0 of 20.
  it('Am I paying in enough: the count is the household run\'s, none of 20 futures lasts', () => {
    const inputs = { household: 'couple', you: { pot: 0, age: 40, statePension: { kind: 'full' }, finalSalary: { has: true, yearly: 200000, fromAge: 75 }, payIn: { kind: 'share', pay: 14000, ownPct: 4, employerPct: 0 } },
      stop: { kind: 'age', age: 68 }, spend: { kind: 'level', level: 'minimum' }, partner: { age: 18, pot: 0, stop: { kind: 'same' }, payIn: { kind: 'total', total: 1 } },
      savings: 0, savingsIn: 0, savingRisk: 'cautious', risk: 'cautious', charge: 0, endAge: 75, confidence: 'careful' };
    const b = answerB(inputs, { ...ENV, futures: 20 });
    expect(b.basis.planPath).toBeUndefined();
    expect(b.chance.fails).toBe(20);
  });
});

describe('couples apart: the pay of the one still working makes up what the stopped one\'s money cannot, until the second stop', () => {
  // Jo, 18, has stopped with nothing in a pension and a £125,140 final-salary pension from 50; Kim, 31, works on to 75, and
  // half of the £1 a month is the pay's ("half"). Jo's kept plan has no money for Jo's 50p a month, so it runs out in its
  // first month — 44 years before Kim's plan draws. The household's rule for couples apart (household.js APART.payCoversGap):
  // until the second stop the pay makes up what the stopped one's money cannot, so that is no run-out; from Kim's stop Kim's
  // money pays on for Jo (nothing to pay: Jo's final-salary pension covers Jo's part, and Kim's State Pension Kim's). Every
  // future lasts, as on the household run; before, the kept plans ended the household in Jo's first month (0 of 20).
  it('Am I paying in enough, Jo stopped with nothing and Kim working to 75: 20 of 20 futures last', () => {
    const inputs = { household: 'couple', you: { pot: 0, age: 18, statePension: { kind: 'full' }, finalSalary: { has: true, yearly: 125140, fromAge: 50 }, taxFreeTaken: false, payIn: { kind: 'share', pay: 31000, ownPct: 0, employerPct: 4 } },
      stop: { kind: 'already' }, spend: { kind: 'amount', amount: 1 }, partner: { age: 31, pot: 0, statePension: { kind: 'full' }, finalSalary: { has: false }, stop: { kind: 'age', age: 75 }, payIn: { kind: 'total', total: 0 } },
      untilBothStop: 'half', savings: 0, savingsIn: 1, savingRisk: 'cautious', risk: 'cautious', charge: 0, endAge: 75, isaGrowth: 'cash', confidence: 'careful' };
    const b = answerB(inputs, { ...ENV, futures: 20 });
    expect(b.basis.planPath).toBe(true);
    expect(b.chance.fails).toBe(0);
  });
});

describe('couples apart whose second stop is past the oldest age the first one\'s plan holds stay on the household run (P6)', () => {
  // Jo, 90, has stopped (a £125,140 final-salary pension); Kim, 31, works on to 75, 44 years on, when Jo would be 134. A
  // kept plan holds no one past AgeConvention's oldest age, so Jo's plan ends long before Kim's starts and nobody's plan
  // pays Jo's part in between: the kept plans said every future fails (0 of 20) where the household run, Jo's pension
  // paying, says every one lasts. Until P6 those couples stay on the household run.
  it('Am I paying in enough, Jo 90 stopped and Kim 31 working to 75: the household run, 20 of 20', () => {
    const inputs = { household: 'couple', you: { pot: 0, age: 90, statePension: { kind: 'full' }, finalSalary: { has: true, yearly: 125140, fromAge: 50 }, taxFreeTaken: false, payIn: { kind: 'share', pay: 31000, ownPct: 0, employerPct: 4 } },
      stop: { kind: 'already' }, spend: { kind: 'amount', amount: 1 }, partner: { age: 31, pot: 0, statePension: { kind: 'full' }, finalSalary: { has: false }, stop: { kind: 'age', age: 75 }, payIn: { kind: 'total', total: 0 } },
      untilBothStop: 'half', savings: 0, savingsIn: 1, savingRisk: 'cautious', risk: 'cautious', charge: 0, endAge: 95, isaGrowth: 'cash', confidence: 'careful' };
    const b = answerB(inputs, { ...ENV, futures: 20 });
    expect(b.basis.planPath).toBeUndefined();
    expect(b.chance.fails).toBe(0);
  });
});
