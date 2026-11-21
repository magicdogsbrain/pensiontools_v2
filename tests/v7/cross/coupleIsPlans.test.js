/**
 * ONE ANSWER FOR THE SAME HOUSEHOLD, COUPLES (7.12.0; the lead's ruling 9, step P4): the household run stays a couple's
 * engine, and ONE adapter feeds it from two plans' settings (answers/keep/planPath.js coupleCaseOf):
 *   - a one-person household run is the plan test: householdReadingOf on one plan says what "Does it last?" (lastsOf) says;
 *   - two linked plans say one household figure, read from either plan (householdRun.householdLastsOf);
 *   - the answer for a couple from now (D, C at each level, A's row at which both stop today) runs on the two plans keeping it
 *     would write, so those two plans read as one household give the answer's figure, to the bit, at the same futures.
 *
 * Measured (40 futures, 30 Sep 2026; the household model's own run before, the two kept plans after, as the household's
 * money is one: step P4, fix round 1):
 *   D2 at £3,800 a month (Alex 72 and Sam 70, £250,000 and £150,000, £30,000 savings, an £8,000 final-salary pension):
 *   the answer said "yes", 30 of 40 last, weighted 0.917; the two kept plans say "close", 28 of 40, weighted 0.889, bad
 *   case 94, and the answer now says the same. D2 at £2,800: 40 of 40 both.
 *   D2's levels moved from £3,710 / £3,830 / £4,160 to £3,650 / £3,770 / £4,100 a month.
 *
 * The households are made up (Alex, Sam, Jo, Pat, Kim; round figures).
 */
import { describe, it, expect } from 'vitest';
import { answerD, D1, D2, D3, D9 } from '../d/_d.js';
import { answerC } from '../c/_c.js';
import { answerA } from '../a/_a.js';
import { answerB } from '../b/_b.js';
import { keptPlansOf } from '../../../src/answers/keep/keptPlan.js';
import { lastsOf } from '../../../src/answers/plan/lastsRun.js';
import { planShortfallOf } from '../../../src/services/OneAnswer.js';
import { householdReadingOf, passOnConfig } from '../../../src/answers/keep/planPath.js';
import { householdLastsOf } from '../../../src/answers/plan/householdRun.js';

const TODAY = '2026-09-30';
const N = 40;
const ENV = { today: TODAY, futures: N, seed: 0, trace: false };

/** "Does it last?" on one plan at the answer's futures (the crossing test's planReading). */
function planReading(plan) {
  const { a, r, p } = lastsOf(plan, { today: TODAY, futures: N, histories: false });
  const sf = planShortfallOf(r, p, a);
  return { lasted: Math.round(a.fixedAge * N), weighted: a.weighted, verdict: a.verdict, floorAge: a.floor ? a.floor.age : null,
    worstAge: sf.when ? sf.when.worst : a.planToAge, left: { typical: a.left.typical, best: a.left.best }, planToAge: a.planToAge };
}

/** The household reading of two plans, in planReading's shape. */
function householdReading(plan, partner) {
  const h = householdReadingOf(plan, partner, { today: TODAY, futures: N });
  return { lasted: h.lasted, weighted: h.weighted, verdict: h.verdict, floorAge: h.floorAge, worstAge: h.worstAge, left: h.left, planToAge: h.planToAge };
}

describe('a one-person household run is the plan test', () => {
  for (const [name, inputs] of Object.entries({ D1, D3, D9 })) {
    it(`${name}: the plan kept from D, read as a household of one, says what "Does it last?" says`, () => {
      const res = answerD(inputs, ENV);
      const kept = keptPlansOf('d', res, ENV);
      expect(kept.partner).toBeNull();
      expect(householdReading(kept.yours, null)).toEqual(planReading(kept.yours));
    });
  }
});

describe('a couple: the answer is the two plans kept from it, read as one household', () => {
  const D2more = { ...D2, spend: { kind: 'amount', amount: 3800 } };
  // D2 at £2,800 lasts in every future on both runs; at £3,800 some futures run out (see the header)
  it('D2: the same count, weighted chance, verdict, run-out ages, left at the end and plan-to age (every future lasts)', () => {
    const res = answerD(D2, ENV);
    const kept = keptPlansOf('d', res, ENV);
    const h = householdReading(kept.yours, kept.partner);
    expect({ lasted: Math.round(res.chance.fixedAge * N), weighted: res.chance.weighted, verdict: res.verdict, worstAge: res.runOutAge, planToAge: res.chance.planToAge })
      .toEqual({ lasted: h.lasted, weighted: h.weighted, verdict: h.verdict, worstAge: h.worstAge, planToAge: h.planToAge });
  });
  for (const [name, inputs] of Object.entries({ D2more })) it(`${name}: the same count, weighted chance, verdict, run-out ages, left at the end and plan-to age`, () => {
    const res = answerD(inputs, ENV);
    const kept = keptPlansOf('d', res, ENV);
    expect(kept.partner).not.toBeNull();
    const h = householdReading(kept.yours, kept.partner);
    const ans = { lasted: Math.round(res.chance.fixedAge * N), weighted: res.chance.weighted, verdict: res.verdict, floorAge: res.floorAge ?? null,
      worstAge: res.runOutAge, left: res.left ? { typical: res.left.typical, best: res.left.best } : null, planToAge: res.chance.planToAge };
    expect(ans).toEqual(h);
  });
});

describe('a linked couple: each plan says the one household figure', () => {
  it('D2 at £3,800 a month: read from either plan, the same count, weighted chance, verdict, run-out ages and left', () => {
    const res = answerD({ ...D2, spend: { kind: 'amount', amount: 3800 } }, ENV);
    const kept = keptPlansOf('d', res, ENV);
    const mine = householdLastsOf(kept.yours, kept.partner, { today: TODAY, futures: N });
    const theirs = householdLastsOf(kept.partner, kept.yours, { today: TODAY, futures: N });
    expect(theirs).toEqual(mine);
    expect(mine.joint).toBe(true);
    expect(mine).toEqual(householdReadingOf(kept.yours, kept.partner, { today: TODAY, futures: N }));
  });
});

// Jo, 66, £300,000, and Kim, 63, £120,000 (the pension still closed to neither), £20,000 savings, from now
const JO_KIM = { household: 'couple', you: { age: 66, pot: 300000 }, partner: { age: 63, pot: 120000 }, savings: 20000 };

describe('a couple, How much can I take from now: each level\'s amount, kept, is the two plans\' household reading', () => {
  for (const level of ['careful', 'balanced', 'bold']) {
    it(`${level}: the same count, weighted chance, verdict, run-out ages, left at the end and plan-to age`, () => {
      const c = answerC({ ...JO_KIM, confidence: level }, ENV);
      const m = c.levels[level].monthly;
      const at = answerC({ ...JO_KIM, confidence: level, take: m }, ENV);
      const kept = keptPlansOf('c', c, ENV);
      expect(kept.partner).not.toBeNull();
      const h = householdReading(kept.yours, kept.partner);
      expect({ lasted: N - c.chance.fails, weighted: c.chance.weighted, verdict: at.take.verdict, floorAge: c.floorAge ?? null, worstAge: at.take.runOutAge,
        left: { typical: c.left.typical, best: c.left.best }, planToAge: c.chance.planToAge }).toEqual(h);
      expect(h.verdict).toBe('yes');
      // £10 a month more, kept as tried, is not "yes" at the level
      const more = keptPlansOf('c', answerC({ ...JO_KIM, confidence: level, take: m + 10 }, ENV), ENV, { take: 'tried' });
      expect(householdReading(more.yours, more.partner).verdict).not.toBe('yes');
    });
  }
});

describe('a couple, When could I stop, the row at which both stop today: kept, it is the two plans\' household reading', () => {
  // Jo and Kim as A asks it: stopping today, nothing paid in, spending £1,500 and £2,200 a month (one lasts in every
  // future, one does not)
  for (const amount of [1500, 2200]) {
    it(`£${amount.toLocaleString('en-GB')} a month: the same count, weighted chance, verdict, bad case and plan-to age`, () => {
      const inputs = { household: 'couple', you: { age: 66, pot: 300000, payIn: { kind: 'total', total: 0 } }, partner: { age: 63, pot: 120000, payIn: { kind: 'total', total: 0 } },
        savings: 20000, stop: { kind: 'age', age: 66 }, spend: { kind: 'amount', amount }, partTime: { has: false } };
      const a = answerA(inputs, { ...ENV, detail: 'chart', ages: [66] });
      expect(a.status).toBe('ok');
      expect(a.basis.planPath).toBe(true);
      const kept = keptPlansOf('a', a, ENV);
      expect(kept.partner).not.toBeNull();
      const h = householdReading(kept.yours, kept.partner);
      expect({ lasted: Math.round(a.shown.lasted * N), weighted: a.shown.weighted, verdict: a.shown.verdict, worstAge: a.shown.runOutAge, planToAge: a.chance.planToAge })
        .toEqual({ lasted: h.lasted, weighted: h.weighted, verdict: h.verdict, worstAge: h.worstAge, planToAge: h.planToAge });
    });
  }
});

// ---- step P4, fix round 1: the household's money is one, and the two plans spend what was asked -------------------------
// Sam, 64, £160,000, and Pat, 62, £60,000 with a £14,000 a year final-salary pension (rises capped at 5%) from 65, £20,000
// savings, from now. Before step P4 (the household model's run, b6eb63a1) C said £3,210 / £3,240 / £3,330 a month and D at
// £1,500 "yes", 40 of 40. On the two kept plans as first written, C said £0 / £0 / £2,840 and D at £1,500 "no", 27 of 40
// (weighted 0.782) with £355,091 typically left: the keep wrote each one's take-home as all of their own income that comes
// anyway (from 67: £12,548 + £26,548 = £39,096 a year where £18,000 was asked), Pat's capped pension fell behind prices in
// some futures, Pat's own small pot paid the gap until it was empty, and the household was out then although Sam's money
// was still there.
const SAM_PAT = { household: 'couple', you: { age: 64, pot: 160000 }, partner: { age: 62, pot: 60000, finalSalary: { has: true, yearly: 14000, fromAge: 65 } }, savings: 20000 };
/** The same couple as "Will it last?" asks it (the tax-free part not yet had). */
const SAM_PAT_D = { ...SAM_PAT, you: { ...SAM_PAT.you, taxFreeTaken: 'no' }, partner: { ...SAM_PAT.partner, taxFreeTaken: 'no' } };
const netA = (g) => (g <= 12570 ? g : g <= 50270 ? 12570 + (g - 12570) * 0.8 : 12570 + 37700 * 0.8 + (g - 50270) * 0.6);

describe('a couple: the two kept plans spend what was asked, and the household\'s money is one', () => {
  it('Sam and Pat at £1,500 a month: the two plans\' spending adds up to £18,000 a year after tax in every stretch', () => {
    // Worked by hand. What each one takes home in the household's split (D's phases, a month): from 64 / 62, Sam £1,062.50
    // and Pat £437.50 (= £1,500: the pots pay all of it, shared by the money each holds). From 67 / 65 their incomes that
    // come anyway alone pay £1,045.63 + £1,142.83 = £2,188.47, so each one's part of the £1,500 is cut in proportion:
    // Sam £1,045.63 × 1,500 / 2,188.47 = £716.69, Pat £783.31 (£8,600 and £9,400 a year, both under the £12,570 allowance,
    // so before and after tax alike). From 69 / 67 (Pat's State Pension too): £1,045.63 + £1,979.34 = £3,024.97, so
    // £518.50 and £981.50 (£6,222 and £11,778 a year). From 64 Sam's £12,750 after tax is £12,795 before it (£45 tax).
    const d = answerD({ ...SAM_PAT_D, spend: { kind: 'amount', amount: 1500 } }, ENV);
    const kept = keptPlansOf('d', d, ENV);
    const steps = (pl) => pl.stressTool.settings.incomeSteps.map((s) => [s.fromAge, s.amount]);
    expect(steps(kept.yours)).toEqual([[64, 12795], [67, 8600], [69, 6222]]);
    expect(steps(kept.partner)).toEqual([[62, 5250], [65, 9400], [67, 11778]]);
    // (Sam is two years older: Sam's 64 / 67 / 69 are Pat's 62 / 65 / 67)
    for (const [y, p] of [[12795, 5250], [8600, 9400], [6222, 11778]]) expect(Math.abs(netA(y) + netA(p) - 18000)).toBeLessThan(1);
  });

  it('Sam and Pat at £1,500 a month: "yes", 40 of 40, as before the step, and the answer is the two plans read as one', () => {
    const d = answerD({ ...SAM_PAT_D, spend: { kind: 'amount', amount: 1500 } }, ENV);
    expect(d.verdict).toBe('yes');
    expect(d.chance.fails).toBe(0);
    const kept = keptPlansOf('d', d, ENV);
    const h = householdReading(kept.yours, kept.partner);
    expect({ lasted: N - d.chance.fails, weighted: d.chance.weighted, verdict: d.verdict, worstAge: d.runOutAge, planToAge: d.chance.planToAge })
      .toEqual({ lasted: h.lasted, weighted: h.weighted, verdict: h.verdict, worstAge: h.worstAge, planToAge: h.planToAge });
  });

  for (const [name, inputs] of Object.entries({ 'final-salary from 65': SAM_PAT, 'final-salary paid since 60': { ...SAM_PAT, partner: { ...SAM_PAT.partner, finalSalary: { has: true, yearly: 14000, fromAge: 60 } } } })) {
    it(`Sam and Pat, ${name}: How much can I take never offers £0, each level is "yes" kept, and the answer is the two plans`, () => {
      const c = answerC(inputs, ENV);
      for (const level of ['careful', 'balanced', 'bold']) expect(c.levels[level].monthly).toBeGreaterThan(2500);
      for (const level of ['careful', 'balanced', 'bold']) {
        const cl = answerC({ ...inputs, confidence: level }, ENV);
        const m = cl.levels[level].monthly;
        const at = answerC({ ...inputs, confidence: level, take: m }, ENV);
        expect(at.take.verdict).toBe('yes');
        const kept = keptPlansOf('c', cl, ENV);
        const h = householdReading(kept.yours, kept.partner);
        expect({ lasted: N - cl.chance.fails, weighted: cl.chance.weighted, verdict: at.take.verdict, floorAge: cl.floorAge ?? null, worstAge: at.take.runOutAge,
          left: { typical: cl.left.typical, best: cl.left.best }, planToAge: cl.chance.planToAge }).toEqual(h);
      }
    });
  }

  it('money moves between the two plans: once one plan\'s money is gone, the other\'s pays its part', () => {
    // Sam 67 (£160,000) and Pat 65 (£60,000), £20,000 savings, £3,400 a month: 1 future of 40 lasts. Pat's saved plan then
    // gains a £30,000 a year final-salary pension from now, rises capped at 5% (Pat's own part unchanged, £8,240 a year
    // before tax at first): Pat's pots need not pay anything, and once Sam's money is gone Pat's pension and pots pay Sam's
    // part, so 39 of 40 last ("yes"). The one that does not is a future whose prices rise 4.73 times over the 33 years, so
    // the pension, rising by at most 5%, buys far less by then; it runs out when Pat is 98.
    // As first written the household was out when Sam's plan was: 0 of 40 became 1 of 40 (the checker's couple: 19 of 40 and
    // 0.677 before and after; only the best case left moved).
    const inputs = { household: 'couple', you: { age: 67, pot: 160000, taxFreeTaken: 'no' }, partner: { age: 65, pot: 60000, taxFreeTaken: 'no' }, savings: 20000, spend: { kind: 'amount', amount: 3400 } };
    const kept = keptPlansOf('d', answerD(inputs, ENV), ENV);
    const before = householdReadingOf(kept.yours, kept.partner, { today: TODAY, futures: N });
    const s = kept.partner.stressTool.settings;
    const more = { ...kept.partner, stressTool: { ...kept.partner.stressTool, settings: { ...s, dbAmount: 30000, dbStartYear: 0, dbIndexation: 'lpi5' } } };
    const after = householdReadingOf(kept.yours, more, { today: TODAY, futures: N });
    expect(before.lasted).toBe(1);
    expect({ lasted: after.lasted, verdict: after.verdict }).toEqual({ lasted: 39, verdict: 'yes' });
  });
});

describe('the household\'s pass-on, worked by hand (planPath passOnConfig)', () => {
  it('k pays j\'s part less what j\'s capped pension still buys, from j\'s run-out month, at k\'s bands', () => {
    // j: a target of £20,000 a year before tax (£18,514 after: 20,000 − 20% × 7,430), a £10,000 final-salary pension from
    // year 0 rising by at most 5% a year; k: £30,000 before tax (£26,514 after). Prices rise 10% a year. j runs out in month
    // 30 (year 2, month 6).
    //   year 2: the pension pays 10,000 × 1.05² = £11,025, which buys 11,025 / 1.1² = £9,111.57 today (under the allowance:
    //           no tax). Short £18,514 − £9,111.57 = £9,402.43; for months 30–35 of k's twelve: half, £4,701.21. k takes home
    //           26,514 + 4,701.21 = £31,215.21: before tax 12,570 + 18,645.21 / 0.8 = £35,876.52.
    //   year 3: 10,000 × (1.05 / 1.1)³ = £8,697.41; short £9,816.59; k £36,330.59 after tax, 12,570 + 23,760.59 / 0.8 =
    //           £42,270.74 before.
    //   years 0 and 1: £30,000, as k's plan has it.
    const base = { years: 5, baseSalary: 0, pa: 12570, brl: 50270, hrl: 125140, spStartYear: 99, spWeeklyAmount: 0, other: 0, extraIncomes: [] };
    const cJ = { ...base, targetSchedule: [20000, 20000, 20000, 20000, 20000], dbAmount: 10000, dbStartYear: 0, dbIndexation: 'lpi5' };
    const cK = { ...base, targetSchedule: [30000, 30000, 30000, 30000, 30000], dbAmount: 0 };
    const out = passOnConfig(cK, cJ, { inflation: [0.1, 0.1, 0.1, 0.1, 0.1] }, 30);
    expect(out.targetSchedule.slice(0, 2)).toEqual([30000, 30000]);
    expect(out.targetSchedule[2]).toBeCloseTo(35876.52, 1);
    expect(out.targetSchedule[3]).toBeCloseTo(42270.74, 1);
    expect(cK.targetSchedule).toEqual([30000, 30000, 30000, 30000, 30000]);
  });
});

describe('two linked plans that start in different years are not read on one clock', () => {
  it('Sam stops now, Pat works to 64: no household figure from mixed clocks (a reason instead)', () => {
    // Sam's plan draws from this tax year (66, 33 years); Pat's still saves and draws from April 2030 (64). As first written
    // both runs read the futures from year 0 and the ages ran from 64 for the longer plan's years: plan-to 104 for a couple
    // whose plans end when the younger is 100.
    const sam = keptPlansOf('d', answerD({ you: { age: 66, pot: 200000, taxFreeTaken: 'no' }, savings: 10000, spend: { kind: 'amount', amount: 1500 } }, ENV), ENV).yours;
    const pat = keptPlansOf('b', answerB({ you: { age: 60, pot: 100000, payIn: { kind: 'total', total: 500 } }, stop: { kind: 'age', age: 64 }, spend: { kind: 'amount', amount: 1200 } }, ENV), ENV).yours;
    const h = householdReadingOf(sam, pat, { today: TODAY, futures: N });
    expect(h.reason).toBe('notSameStart');
    expect(householdLastsOf(pat, sam, { today: TODAY, futures: N }).reason).toBe('notSameStart');
  });
});

// ---- step P4, fix round 2 ----------------------------------------------------------------------------------------------
// Sam, 54, £250,000, and Pat, 53, £150,000, £60,000 savings: both pensions closed today (they open at 57). As the answer
// first ran it (the household model's own run, as the route kept for anyone under the access age), against the two plans
// keeping it writes, read as one household (40 futures, 30 Sep 2026):
//   £1,500: 40, weighted 1, yes, bad case 101, plan-to 101      against 40, 1, yes, 98, 98
//   £2,200: 34, 0.865, close, 86, 101                           against 39, 0.982, yes, 98, 98
//   £2,800: 2, 0.113, no, 63, 101                               against 13, 0.413, no, 66, 98
//   £3,400: 0, 0.0003, no, 56, 101                              against 2, 0.058, no, 64, 98
// The plan-to age differed too: the keep's 45-year limit (53 + 45 = 98) against the household model's 101 (ruling H: one
// limit, the kept plan's). Whose money pays a closed person's part is the household's split, which the keep writes into each
// plan as its take-home; once one plan's money cannot pay its part, the other's pays it (the household's money is one).
const SAM_PAT_CLOSED = { household: 'couple', you: { age: 54, pot: 250000, taxFreeTaken: 'no' }, partner: { age: 53, pot: 150000, taxFreeTaken: 'no' }, savings: 60000 };

describe('a couple both under the access age today: the answer is the two plans kept from it', () => {
  for (const amount of [1500, 2200, 2800, 3400]) {
    it(`Will it last at £${amount.toLocaleString('en-GB')} a month: the same count, weighted chance, verdict, run-out ages, left and plan-to age (the kept plan's limit)`, () => {
      const res = answerD({ ...SAM_PAT_CLOSED, spend: { kind: 'amount', amount } }, ENV);
      const kept = keptPlansOf('d', res, ENV);
      expect(kept.partner).not.toBeNull();
      const h = householdReading(kept.yours, kept.partner);
      const ans = { lasted: Math.round(res.chance.fixedAge * N), weighted: res.chance.weighted, verdict: res.verdict, floorAge: res.floorAge ?? null,
        worstAge: res.runOutAge, left: res.left ? { typical: res.left.typical, best: res.left.best } : null, planToAge: res.chance.planToAge };
      expect(ans).toEqual(h);
      expect(ans.planToAge).toBe(98);                                   // 53 + the keep's 45 years
    });
  }
});

// Sam, 70, £220,000, and Pat, 67, £90,000, £25,000 savings, kept from How much can I take at "bold" (£3,260 a month: 17 of
// 40 last, weighted 0.7013). Pat's plan is then set to "careful". As first written the household's verdict was read at the
// level of the plan it was read from: "yes" from Sam's (bold allows 6 of 20 to fail), "no" from Pat's (careful allows 1), for
// one count and one weighted chance. The household's verdict is now read at the more careful of the two plans' levels, so
// both plans say "no" (0.7013 is under careful's 0.95 and the count is not every future).
describe('two linked plans at different levels: one household verdict', () => {
  it('Sam bold, Pat careful: read from either plan, the same verdict, at the more careful level', () => {
    const c = answerC({ household: 'couple', you: { age: 70, pot: 220000 }, partner: { age: 67, pot: 90000 }, savings: 25000, confidence: 'bold' }, ENV);
    const kept = keptPlansOf('c', c, ENV);
    const a = kept.partner.fromAnswer.answer;
    const pat = { ...kept.partner, fromAnswer: { ...kept.partner.fromAnswer, answer: { ...a, level: 'careful', levelChosen: true } } };
    const fromSam = householdReadingOf(kept.yours, pat, { today: TODAY, futures: N });
    const fromPat = householdReadingOf(pat, kept.yours, { today: TODAY, futures: N });
    expect(fromSam).toEqual(fromPat);
    expect({ lasted: fromSam.lasted, verdict: fromSam.verdict }).toEqual({ lasted: 17, verdict: 'no' });
    expect(fromSam.weighted).toBeCloseTo(0.7013, 4);
    // both at bold, the household says what the answer said: "yes"
    expect(householdReadingOf(kept.yours, kept.partner, { today: TODAY, futures: N }).verdict).toBe('yes');
    expect(householdLastsOf(pat, kept.yours, { today: TODAY, futures: N })).toEqual(householdLastsOf(kept.yours, pat, { today: TODAY, futures: N }));
  });
});

// Kim, 100, £200,000, and Jo, 36, with nothing (Jo's pension closed until 57): the household runs on to Jo's end, so its
// stretches start at Jo's birthdays, when Kim would be 121 and 131. As first written on the two kept plans the keep wrote a
// row for Kim from 131, past the oldest age a plan holds (130), and refused the seed: "How much can I take?" threw. A stretch
// that starts after 130 is not Kim's.
describe('a couple far apart in age: the keep writes no row past the oldest age a plan holds', () => {
  it('Kim 100 and Jo 36: How much can I take answers, and its two kept plans read as one household are its figure', () => {
    const inputs = { household: 'couple', you: { age: 100, pot: 200000 }, partner: { age: 36, pot: 0 } };
    const c = answerC(inputs, ENV);
    expect(c.status).toBe('ok');
    const kept = keptPlansOf('c', c, ENV);
    expect(kept.partner).not.toBeNull();
    for (const pl of [kept.yours, kept.partner]) for (const s of pl.stressTool.settings.incomeSteps) expect(s.fromAge).toBeLessThanOrEqual(130);
    const h = householdReading(kept.yours, kept.partner);
    expect({ lasted: N - c.chance.fails, weighted: c.chance.weighted, planToAge: c.chance.planToAge }).toEqual({ lasted: h.lasted, weighted: h.weighted, planToAge: h.planToAge });
  });
});
