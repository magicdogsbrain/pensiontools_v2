/**
 * The scenario tests' hand library (e2e/scenarios/hand/), against sums written out here as literals. Every expected
 * figure below is worked in its comment, by hand, before the library is asked; none comes from the app.
 */
import { describe, it, expect } from 'vitest';
import {
  shareOfPay, goingIn, fromTakeHome, months, monthly, grossAllTaxable, grossQuarterFree, reachesWhenAllowanceUsed,
  takeForWhenAllowanceUsed, monthlyTaxAllTaxable, higherRateClaim, pence, pounds, ukTax, pocketFromPot
} from '../e2e/scenarios/hand/money.js';
import { FULL_YEARLY, FULL_MONTHLY, statePensionAge, statePensionAgeFromAge } from '../e2e/scenarios/hand/statePension.js';
import { monthsBetween, addMonths, monthName, monthFromName, yearsAndMonths, taxYearOf, monthsLeftInTaxYear, ageOn } from '../e2e/scenarios/hand/dates.js';
import { potBracket, leastMove, nIn20 } from '../e2e/scenarios/hand/growth.js';
import { cashYearsNeed, heldOutside, againstNeed, unitsToBuy } from '../e2e/scenarios/hand/held.js';

describe('money', () => {
  it('a share of pay, and relief at source both ways (s01, s03, s25)', () => {
    // Jo: 8% × 38,000 ÷ 12 = 3,040 ÷ 12 = 253.33 in all
    expect(pence(shareOfPay(8, 38000))).toBe(253.33);
    // Jo's own 5%: 5% × 38,000 ÷ 12 = 158.33 going in; × 0.8 = 126.67 from take-home pay
    expect(pence(fromTakeHome(shareOfPay(5, 38000)))).toBe(126.67);
    // the employer's 3%: 3% × 38,000 ÷ 12 = 95
    expect(pence(shareOfPay(3, 38000))).toBe(95);
    // s01 at T = 37: 37 × 38,000 ÷ 1200 = 1,171.67 in all; Jo's 34% is 1,076.67 going in; × 0.8 = 861.33 from take-home pay
    expect(pounds(shareOfPay(37, 38000))).toBe(1172);
    expect(pence(shareOfPay(34, 38000))).toBe(1076.67);
    expect(pence(fromTakeHome(1076.67))).toBe(861.34);           // 1,076.67 × 0.8 = 861.336
    expect(pounds(fromTakeHome(shareOfPay(34, 38000)))).toBe(861);
    // Sam: 300 from take-home pay is 300 × 1.25 = 375 going in; + 250 from the employer = 625; £100 more is 125 more, 750 in all
    expect(goingIn(300)).toBe(375);
    expect(goingIn(300) + 250).toBe(625);
    expect(goingIn(400) + 250).toBe(750);
    // a lump of 10,000 from take-home pay goes in as 12,500
    expect(goingIn(10000)).toBe(12500);
  });

  it('months × monthly (s04, s06, s07, s10)', () => {
    // a year of Sam's 625 a month: 7,500
    expect(months(12, 625)).toBe(7500);
    // the pots plan: 31,200 ÷ 12 × 6 = 15,600; the ladder: 34,000 ÷ 12 × 3 = 8,500
    expect(months(6, monthly(31200))).toBe(15600);
    expect(months(3, monthly(34000))).toBe(8500);
    // Alex at 64: 2 × 2,500 = 5,000
    expect(months(2, monthly(30000))).toBe(5000);
  });

  it('before tax for an income after tax, in the 20% band (s05, s07)', () => {
    // s05: (26,400 − 2,514) ÷ 0.8 = 23,886 ÷ 0.8 = 29,857.5 → £29,858
    expect(grossAllTaxable(26400)).toBe(29857.5);
    expect(pounds(grossAllTaxable(26400))).toBe(29858);
    // the oracle agrees: 29,857.5 − (29,857.5 − 12,570) × 0.2 = 29,857.5 − 3,457.5 = 26,400
    expect(29857.5 - ukTax(29857.5)).toBeCloseTo(26400, 6);
    // s07: (28,800 − 2,514) ÷ 0.85 = 26,286 ÷ 0.85 = 30,924.71 → £30,925
    expect(pence(grossQuarterFree(28800))).toBe(30924.71);
    expect(pounds(grossQuarterFree(28800))).toBe(30925);
    // the oracle agrees: a quarter of 30,924.71 tax-free, the rest taxed: pocket 28,800
    expect(pocketFromPot(30924.70588).pocket).toBeCloseTo(28800, 2);
  });

  it('a month in a year whose allowance pay has used (s07)', () => {
    // 30,925 ÷ 12 = 2,577.06 a month
    expect(pence(monthly(30925))).toBe(2577.08);                  // 30,925 ÷ 12 = 2,577.083
    expect(pence(monthly(grossQuarterFree(28800)))).toBe(2577.06); // 30,924.71 ÷ 12 = 2,577.059
    // 2,577.06 − 0.75 × 2,577.06 × 0.2 = 2,577.06 − 386.56 = 2,190.50 → £2,191
    expect(pence(reachesWhenAllowanceUsed(2577.06))).toBe(2190.5);
    expect(pounds(reachesWhenAllowanceUsed(2577.06))).toBe(2191);
    // to have 2,400 reach Kim: 2,400 ÷ 0.85 = 2,823.53 → £2,824
    expect(pounds(takeForWhenAllowanceUsed(2400))).toBe(2824);
    // two months: 2 × 2,577.06 = 5,154.12 → £5,154
    expect(pounds(months(2, 2577.06))).toBe(5154);
  });

  it('a month\'s tax when everything is taxable (s10)', () => {
    // (30,000 − 12,570) × 0.2 ÷ 12 = 17,430 × 0.2 ÷ 12 = 3,486 ÷ 12 = 290.50; after tax 2,500 − 290.50 = 2,209.50
    expect(monthlyTaxAllTaxable(30000)).toBe(290.5);
    expect(2500 - monthlyTaxAllTaxable(30000)).toBe(2209.5);
  });

  it('a pay rise into the 40% band: the extra relief to claim (s04)', () => {
    // 55,000 − 50,270 = 4,730 above the band; 375 × 12 = 4,500 going in; 20% × 4,500 = 900
    expect(higherRateClaim(55000, 4500)).toBe(900);
    // at 52,000: 1,730 above; 20% × 1,730 = 346
    expect(higherRateClaim(52000, 4500)).toBe(346);
    // under the band: nothing
    expect(higherRateClaim(38000, 4500)).toBe(0);
  });

  it('the survivor\'s spending after tax (s24)', () => {
    // 32,057 − (32,057 − 12,570) × 0.2 = 32,057 − 3,897.4 = 28,159.6 → £28,160
    expect(pounds(32057 - ukTax(32057))).toBe(28160);
  });
});

describe('the State Pension', () => {
  it('the full amount, 2026/27 (s01, s15)', () => {
    // 241.30 × 52 = 12,547.60 a year; ÷ 12 = 1,045.63 a month, shown as £1,046
    expect(pence(FULL_YEARLY)).toBe(12547.6);
    expect(pence(FULL_MONTHLY)).toBe(1045.63);
    expect(pounds(FULL_MONTHLY)).toBe(1046);
    expect(pounds(FULL_YEARLY)).toBe(12548);
  });

  it('the age, from a date of birth or from an age today', () => {
    expect(statePensionAge('1961-03-06')).toBe(67);
    expect(statePensionAge('1977-04-05')).toBe(67);
    expect(statePensionAge('1978-04-06')).toBe(68);
    expect(statePensionAge('1977-10-01')).toBe(null);             // the year the law moves a month at a time
    // Jo at 33 on 16 Nov 2026: born 1992 or 1993 → 68
    expect(statePensionAgeFromAge(33)).toBe(68);
    // Kim at 62, Alex at 57: born 1963–64, 1968–69 → 67
    expect(statePensionAgeFromAge(62)).toBe(67);
    expect(statePensionAgeFromAge(57)).toBe(67);
    // Sam at 45: born 1980–81 → 68
    expect(statePensionAgeFromAge(45)).toBe(68);
  });
});

describe('dates', () => {
  it('months between, and in years and months (s06)', () => {
    // November 2026 to February 2038: 12 × 12 − 9 = 135 months = 11 years 3 months
    expect(monthsBetween('2026-11', '2038-02')).toBe(135);
    expect(yearsAndMonths(135)).toEqual({ years: 11, months: 3 });
    // the move window opens 36 months before the stop: February 2035
    expect(addMonths('2038-02', -36)).toBe('2035-02');
    expect(monthName('2035-02')).toBe('February 2035');
    expect(monthFromName('You stop work in February 2038.')).toBe('2038-02');
  });

  it('tax years and the months left in one (s07, s10)', () => {
    expect(taxYearOf('2026-04-05')).toBe('2025/26');
    expect(taxYearOf('2026-04-06')).toBe('2026/27');
    expect(taxYearOf('2026-11-16')).toBe('2026/27');
    // from November: November, December, January, February, March = 5
    expect(monthsLeftInTaxYear('2026-11')).toBe(5);
    // from June: June to March = 10
    expect(monthsLeftInTaxYear('2026-06')).toBe(10);
  });

  it('an age on a date', () => {
    expect(ageOn('1964-05-01', '2026-11-16')).toBe(62);
    expect(ageOn('1964-12-01', '2026-11-16')).toBe(61);
  });
});

describe('growth and chance', () => {
  it('the pot at the stop, bracketed (s01)', () => {
    // low: 22,000 + 3,040 × 27 = 22,000 + 82,080 = 104,080
    // high: 22,000 × 1.05^27 + 3,040 × (1.05^27 − 1) ÷ 0.05 = 22,000 × 3.733456 + 3,040 × 54.66912 = 82,136.0 + 166,194.1 = 248,330
    const b = potBracket({ pot: 22000, yearlyIn: 3040, years: 27 });
    expect(b.low).toBe(104080);
    expect(pounds(b.high)).toBe(248330);
  });

  it('the least move for more years of paying in (s02, s05, s12)', () => {
    expect(leastMove(5, 3040)).toBe(15200);     // 5 × 3,040
    expect(leastMove(2, 7500)).toBe(15000);     // 2 × 7,500
    expect(leastMove(1, (375 + 200) * 12)).toBe(6900);   // (375 + 200) × 12
  });

  it('"N in 20" for a percentage', () => {
    expect(nIn20(95)).toBe(19);
    expect(nIn20(87)).toBe(17);                 // 87 ÷ 5 = 17.4
    expect(nIn20(88)).toBe(18);                 // 88 ÷ 5 = 17.6
  });
});

describe('held against need', () => {
  it('Alex at 64, the cash years (s10)', () => {
    // June 2026 to March 2027 is 10 months: 10 × 2,500 + 30,000 (2027/28) + 30,000 (2028/29) = 85,000
    const need = cashYearsNeed({ monthsLeft: monthsLeftInTaxYear('2026-06'), perMonth: 2500, laterYears: [30000, 30000] });
    expect(need).toBe(85000);
    // held outside the ladder: three gilts worth 86,000 and 500 in cash = 86,500; 1,500 more than needed
    expect(heldOutside([86000, 500])).toBe(86500);
    expect(againstNeed(86500, 85000)).toEqual({ spare: 1500, short: 0 });
  });

  it('Sam at 59, what is left to buy (s11)', () => {
    expect(unitsToBuy(44000, 17300)).toBe(26700);      // T29: 44,000 − 17,300
    expect(unitsToBuy(18100, 14700)).toBe(3400);       // TR31: 18,100 − 14,700
    expect(52392 - 25000).toBe(27392);                 // cash: 52,392 − 25,000
  });
});
