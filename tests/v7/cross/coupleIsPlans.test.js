/**
 * ONE ANSWER FOR THE SAME HOUSEHOLD, COUPLES (7.12.0; the lead's ruling 9, step P4): the household run stays a couple's
 * engine, and ONE adapter feeds it from two plans' settings (answers/keep/planPath.js coupleCaseOf):
 *   - a one-person household run is the plan test: householdReadingOf on one plan says what "Does it last?" (lastsOf) says;
 *   - two linked plans say one household figure, read from either plan (householdRun.householdLastsOf);
 *   - the answer for a couple from now (D, C at each level, A's row at which both stop today) runs on the two plans keeping it
 *     would write, so those two plans read as one household give the answer's figure, to the bit, at the same futures.
 *
 * Measured (40 futures, 30 Sep 2026; the household model's own run before, the two kept plans after):
 *   D2 at £3,800 a month (Alex 72 and Sam 70, £250,000 and £150,000, £30,000 savings, an £8,000 final-salary pension):
 *   the answer said "yes", 30 of 40 last, weighted 0.917; the two kept plans say "close", 27 of 40, weighted 0.868, middle
 *   run-out 96, bad case 93, left £152,350 (best £709,886), and the answer now says the same. D2 at £2,800: 40 of 40 both.
 *   D2's levels moved from £3,710 / £3,830 / £4,160 to £3,590 / £3,730 / £4,080 a month.
 *
 * The households are made up (Alex, Sam, Jo, Pat, Kim; round figures).
 */
import { describe, it, expect } from 'vitest';
import { answerD, D1, D2, D3, D9 } from '../d/_d.js';
import { answerC } from '../c/_c.js';
import { answerA } from '../a/_a.js';
import { keptPlansOf } from '../../../src/answers/keep/keptPlan.js';
import { lastsOf } from '../../../src/answers/plan/lastsRun.js';
import { planShortfallOf } from '../../../src/services/OneAnswer.js';
import { householdReadingOf } from '../../../src/answers/keep/planPath.js';
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
