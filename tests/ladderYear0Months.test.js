/**
 * Year 0 pays for the months it has (walks3 W5-H3, W7-M1). A fictional plan: Sam stops work in October 2027; the plan pays
 * £25,000 a year before tax from the ladder, its first tax year 2027/28.
 *
 * Worked by hand:
 *   a month at the year's rate     25,000 ÷ 12 = 2,083.33 → £2,083
 *   months year 0 has              October 2027 to March 2028 = 6
 *   what year 0 pays               6 × 2,083.33 = 12,500
 * In June 2027 Sam is still at work: nothing is paid yet (it said £2,500 a month: 25,000 over the 10 months left).
 * In November 2027 the month is £2,083 (it said 25,000 over the 5 months left = £5,000).
 *
 * Alex (fictional) entered his pots in July 2026 on a ladder paying £34,000 a year: a month is 34,000 ÷ 12 = 2,833.33;
 * 2026/27 has July 2026 to March 2027 = 9 payments, 9 × 2,833.33 = 25,500. The words say that, never "twelve months from
 * July" (which reads as a year running to June 2027).
 */
import { describe, it, expect } from 'vitest';
import { ladderPosition } from '../src/services/LadderPosition.js';
import { ladderSentence } from '../src/reading/where.js';

const sam = {
  years: [
    { Y: 2027, age: 60, gross: 25000, need: 25000, from: 'cash' },
    { Y: 2028, age: 61, gross: 25000, need: 25000, from: 'cash' },
    { Y: 2029, age: 62, gross: 25000, need: 25000, from: 'T29' }
  ],
  orders: []
};
const day = (y, m, d = 15) => new Date(y, m - 1, d, 12);

describe('a first tax year that starts in the month work stops', () => {
  it('before the stop month nothing is paid yet; the plan says when it starts and what the year pays', () => {
    const lp = ladderPosition(sam, { today: day(2027, 6), startsOn: '2027-10' });
    expect(lp.phase).toBe('before');
    expect(lp.monthly).toBe(0);                                    // was 25,000 ÷ 10 = £2,500
    expect(lp.upcoming.monthly).toBeCloseTo(25000 / 12, 6);       // £2,083
    expect(lp.upcoming.payments).toBe(6);
    expect(lp.upcoming.yearPays).toBeCloseTo(12500, 6);
    expect(lp.upcoming.startsLabel).toBe('October 2027');
    expect(lp.instruction).toBe('The plan starts paying in October 2027: £2,083 a month, 6 payments to March 2028, £12,500.');
    // the one where-reader both views draw (src/reading/where.js): not paying yet, the plan's own sentence, said once
    const said = ladderSentence({ ladder: { instruction: lp.instruction, monthly: lp.monthly } }, { yearSaid: false });
    expect(said).toEqual({ id: 'where.ladder', parts: [lp.instruction], figures: {} });
    // with the first month's payment the reading carries (whereAmI ladder.firstMonthly), that figure is marked where it is said
    const marked = ladderSentence({ ladder: { instruction: lp.instruction, monthly: lp.monthly, firstMonthly: lp.upcoming.monthly } }, { yearSaid: false });
    expect(marked.figures).toEqual({ ladderFirstMonthly: 2083 });
    expect(marked.parts).toEqual(['The plan starts paying in October 2027: ', { key: 'ladderFirstMonthly', kind: 'money' }, ' a month, 6 payments to March 2028, £12,500.']);
  });

  it('from the stop month the year is paid at its monthly rate for the months it has', () => {
    const lp = ladderPosition(sam, { today: day(2027, 11), startsOn: '2027-10' });
    expect(lp.phase).toBe('running');
    expect(lp.monthly).toBeCloseTo(25000 / 12, 6);                 // was 25,000 ÷ 5 = £5,000
    expect(lp.cashCheck).toBeNull();
    expect(lp.instruction).toBe('The plan pays £2,083 a month (£25,000 a year before tax). In 2027/28 that is 6 payments, October 2027 to March 2028: £12,500.');
  });

  it('a ladder built for a part year (its first year holds the months it pays) pays its need over those months', () => {
    const part = { ...sam, years: [{ ...sam.years[0], need: 12500, months: 6 }, ...sam.years.slice(1)] };
    expect(ladderPosition(part, { today: day(2027, 11), startsOn: '2027-10' }).monthly).toBeCloseTo(12500 / 6, 6);
    expect(ladderPosition(part, { today: day(2027, 6), startsOn: '2027-10' }).upcoming.yearPays).toBeCloseTo(12500, 6);
  });

  it('a saver years before the first tax year is told the month it starts', () => {
    const lp = ladderPosition(sam, { today: day(2026, 1), startsOn: '2027-10' });
    expect(lp.phase).toBe('before');
    expect(lp.upcoming.startsLabel).toBe('October 2027');
    expect(lp.upcoming.payments).toBe(6);
  });

  it('later years and a stop in April are as always', () => {
    expect(ladderPosition(sam, { today: day(2028, 5), startsOn: '2027-10' }).monthly).toBeCloseTo(25000 / 11, 6);
    const april = ladderPosition(sam, { today: day(2027, 6), startsOn: '2027-04' });
    expect(april.phase).toBe('running');
    expect(april.monthly).toBeCloseTo(25000 / 10, 6);
  });
});

describe('pots entered part-way through the first tax year: the payments this tax year, said as they are', () => {
  const alex = { years: [{ Y: 2026, age: 64, gross: 34000, need: 34000, from: 'cash' }, { Y: 2027, age: 65, gross: 34000, need: 34000, from: 'cash' }], orders: [] };
  it('£2,833 a month: 9 payments, July 2026 to March 2027, £25,500', () => {
    const lp = ladderPosition(alex, { today: day(2026, 8), potsDay: '2026-07-10' });
    expect(lp.monthly).toBeCloseTo(34000 / 12, 6);
    expect(lp.instruction).toBe('The plan pays £2,833 a month (£34,000 a year before tax). In 2026/27 that is 9 payments, July 2026 to March 2027: £25,500.');
    expect(lp.instruction).not.toMatch(/twelve months/);
  });
});

/**
 * The ladder buys year 0 for the months it has (walks3 W4-M5). A fictional plan: Alex, 57 today, stops work in November 2029
 * and draws £28,000 a year from a full index-linked ladder, its first two years from cash. Worked by hand:
 *   months year 0 has     November 2029 to March 2030 = 5
 *   year 0's need         28,000 × 5 ÷ 12 = 11,666.67 (it bought the whole £28,000, about £16,000 more)
 *   year 1's need         28,000, a whole year
 */
import { buildGiltLadder } from '../src/strategies/GiltLadderPlan.js';
import { year0MonthsOf } from '../src/services/PlanTiming.js';

describe('the ladder buys year 0 for the months it has', () => {
  it('months a first tax year has, from the month work stops', () => {
    expect(year0MonthsOf({ mode: 'future', startMonth: '2029-11', firstTaxYear: 2029 })).toBe(5);
    expect(year0MonthsOf({ mode: 'future', startMonth: '2030-02', firstTaxYear: 2029 })).toBe(2);
    expect(year0MonthsOf({ mode: 'future', startMonth: '2029-04', firstTaxYear: 2029 })).toBe(12);
    expect(year0MonthsOf({ mode: 'retired', startMonth: '2029-04', firstTaxYear: 2029 })).toBe(12);
    expect(year0MonthsOf({ mode: 'future', startMonth: '2030-05', firstTaxYear: 2029 })).toBe(12);   // not in that year
  });
  it('year 0 is 5/12 of £28,000 and says so; the next year is whole', () => {
    const base = { todayIso: '2026-11-18', pot: 700000, startAge: 60, durationYears: 30, amountAtAge: () => 28000, spAnnual: 0, spStartAge: 99,
      firstTaxYear: 2029, linkers: [], cashYears: 2 };
    const whole = buildGiltLadder(base);
    const part = buildGiltLadder({ ...base, firstYearMonths: 5 });
    expect(whole.years[0].need).toBe(28000);
    expect(part.years[0].need).toBeCloseTo(28000 * 5 / 12, 6);
    expect(part.years[0].months).toBe(5);
    expect(part.years[1].need).toBe(28000);
    expect(part.cash).toBeLessThan(whole.cash - 16000);              // about 16,333 less cash bought
    expect(part.cash).toBeGreaterThan(whole.cash - 16500);
  });
  it('a stored part-year ladder: a step of £28,000 a year, £2,333 a month from November, £11,667 in its 5 months', () => {
    const part = { years: [{ Y: 2029, age: 60, gross: 28000 * 5 / 12, need: 28000 * 5 / 12, months: 5, from: 'cash' }, { Y: 2030, age: 61, gross: 28000, need: 28000, from: 'cash' }], orders: [] };
    const lp = ladderPosition(part, { today: day(2029, 12), startsOn: '2029-11' });
    expect(lp.monthly).toBeCloseTo(28000 / 12, 6);
    expect(lp.gross).toBeCloseTo(28000, 6);
    // the ladder's part is what the year's 5 months hold (28,000 × 5 ÷ 12), said beside `months`, so it and the State
    // Pension add to the step for those months (checker round 2: a year's figure backed the State Pension out wrongly)
    expect(lp.months).toBe(5);
    expect(lp.fromLadder).toBeCloseTo(28000 * 5 / 12, 6);
    const before = ladderPosition(part, { today: day(2027, 1), startsOn: '2029-11' });
    expect(before.upcoming.gross).toBeCloseTo(28000, 6);
    expect(before.upcoming.yearPays).toBeCloseTo(28000 * 5 / 12, 6);
  });
});

/**
 * A State Pension that starts in the same tax year as the stop (the checker's case). Fictional: Jo stops work in November
 * 2029 (year 0 holds November to March = 5 months) and draws £28,000 a year; a State Pension of £12,000 a year starts in
 * that tax year. The State Pension is paid in the LAST months of the tax year, so in year 0 it pays only the months that
 * are both in year 0 and after it starts. Worked by hand:
 *   from January 2030 (3 of the tax year's 12 months)  paid in Nov–Mar: 12,000 × 3 ÷ 12 = 3,000
 *                                                       need 28,000 × 5 ÷ 12 − 3,000 = 11,666.67 − 3,000 = 8,666.67
 *                                                       (it bought (28,000 − 12,000 × 3/12) × 5/12 = 10,416.67: £1,750 too much)
 *   from June 2029 (10 of 12)                           paid in Nov–Mar: all 5 months, 12,000 × 5 ÷ 12 = 5,000
 *                                                       need 11,666.67 − 5,000 = 6,666.67 (it bought 7,500)
 *   paid all year (a State Pension already started)    need (28,000 − 12,000) × 5 ÷ 12 = 6,666.67, as before
 */
describe('year 0 for its months when the State Pension starts in that tax year', () => {
  const base = { todayIso: '2026-11-18', pot: 700000, startAge: 66, durationYears: 25, amountAtAge: () => 28000, spAnnual: 12000,
    spStartAge: 66, firstTaxYear: 2029, linkers: [], cashYears: 2, firstYearMonths: 5 };
  it('from January: £8,666.67', () => {
    expect(buildGiltLadder({ ...base, spFirstYearRatio: 3 / 12 }).years[0].need).toBeCloseTo(8666.67, 2);
  });
  it('from June: £6,666.67', () => {
    expect(buildGiltLadder({ ...base, spFirstYearRatio: 10 / 12 }).years[0].need).toBeCloseTo(6666.67, 2);
  });
  it('already paid: £6,666.67; the next year is whole, less the State Pension', () => {
    const l = buildGiltLadder({ ...base, spStartAge: 65 });
    expect(l.years[0].need).toBeCloseTo(6666.67, 2);
    expect(l.years[1].need).toBe(16000);
  });
});

/**
 * What the ladder position says of the State Pension in a part year 0 (checker round 2). The same fictional Jo: stops work
 * in November 2029, £28,000 a year, State Pension £12,000 a year from January 2030. Worked by hand:
 *   year 0 holds November 2029 to March 2030 = 5 months; the State Pension pays January to March = 3 months
 *   State Pension paid in year 0      12,000 × 3 ÷ 12 = 3,000
 *   what the ladder pays in year 0    28,000 × 5 ÷ 12 − 3,000 = 11,666.67 − 3,000 = 8,666.67
 *   3,000 + 8,666.67 = 11,666.67, the year's income for its 5 months; the step is still £28,000 a year.
 * It said "State Pension £7,200 + ladder £20,800": (11,666.67 − 8,666.67) × 12 ÷ 5 = 7,200, which is neither the £3,000
 * paid in the year nor the £12,000 a year.
 * With the State Pension from June 2029 (paid all of November to March): 12,000 × 5 ÷ 12 = 5,000; ladder 6,666.67.
 */
describe('a part year 0 says the State Pension it holds, not one backed out of a year', () => {
  const base = { todayIso: '2026-11-18', pot: 700000, startAge: 66, durationYears: 25, amountAtAge: () => 28000, spAnnual: 12000,
    spStartAge: 66, firstTaxYear: 2029, linkers: [], cashYears: 2, firstYearMonths: 5 };
  it('the ladder year carries its State Pension: £3,000 from January, £5,000 from June', () => {
    expect(buildGiltLadder({ ...base, spFirstYearRatio: 3 / 12 }).years[0].sp).toBeCloseTo(3000, 6);
    expect(buildGiltLadder({ ...base, spFirstYearRatio: 10 / 12 }).years[0].sp).toBeCloseTo(5000, 6);
    expect(buildGiltLadder({ ...base, spFirstYearRatio: 3 / 12 }).years[1].sp).toBe(12000);
  });
  it('before the stop: step £28,000 a year; in its 5 months State Pension £3,000 + ladder £8,666.67', () => {
    const ladder = buildGiltLadder({ ...base, spFirstYearRatio: 3 / 12 });
    const u = ladderPosition(ladder, { today: day(2027, 1), startsOn: '2029-11' }).upcoming;
    expect(u.gross).toBeCloseTo(28000, 6);
    expect(u.months).toBe(5);
    expect(u.statePension).toBeCloseTo(3000, 6);                    // was 7,200
    expect(u.fromLadder).toBeCloseTo(8666.67, 2);                   // was 20,800
    expect(u.statePension + u.fromLadder).toBeCloseTo(28000 * 5 / 12, 6);
  });
  it('in year 0 after the stop: the same split; the next year is whole (£12,000 + £16,000, 12 months)', () => {
    const ladder = buildGiltLadder({ ...base, spFirstYearRatio: 3 / 12 });
    const lp = ladderPosition(ladder, { today: day(2030, 2), startsOn: '2029-11' });
    expect(lp.months).toBe(5);
    expect(lp.statePension).toBeCloseTo(3000, 6);
    expect(lp.fromLadder).toBeCloseTo(8666.67, 2);
    const next = ladderPosition(ladder, { today: day(2030, 6), startsOn: '2029-11' });
    expect(next.months).toBe(12);
    expect(next.statePension).toBe(12000);
    expect(next.fromLadder).toBe(16000);
  });
  it('from June: State Pension £5,000 + ladder £6,666.67', () => {
    const u = ladderPosition(buildGiltLadder({ ...base, spFirstYearRatio: 10 / 12 }), { today: day(2027, 1), startsOn: '2029-11' }).upcoming;
    expect(u.statePension).toBeCloseTo(5000, 6);
    expect(u.fromLadder).toBeCloseTo(6666.67, 2);
  });
});
