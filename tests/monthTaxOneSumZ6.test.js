/**
 * Ruling Z6: the month's tax is ONE sum on the Decision side. The tax year's set-up (TaxYearSetUp.calculateMonthlyBreakdown)
 * and the month (legacyDecision.calcDecision) count the State Pension inside the months drawn with one function
 * (TaxYearSetUp.spInMonthsDrawn), on the month's rule: the tax year's own total when the State Pension starts on or after
 * the first month drawn; the monthly payment × the months drawn when it was already in payment.
 *
 * Made up by hand (Pat, fictional): the set-up starts in November 2026 with 5 months of 2026/27 to draw; £14,000 received
 * before, £1,500 tax paid on it; £29,858 a year, every pound taxed; the State Pension £12,548 a year (£1,045.67 a month),
 * paid weekly from 25 November 2026: £4,516 in 2026/27.
 *   The pension a month: 29,858 ÷ 12 − 1,045.67 = £1,442.50; over the 5 months 7,212.50.
 *   The year's taxable income: 7,212.50 + 4,516 (the State Pension, the year's own total) + 14,000 = 25,728.50;
 *   tax 20% × (25,728.50 − 12,570) = 2,631.70; less the 1,500 paid: 1,131.70 ÷ 5 = £226.34 a month.
 *   Take-home: 29,858 ÷ 12 − 226.34 = £2,261.83 a month. (It said £254.83 and £2,233.33: the State Pension counted as
 *   1,045.67 × 5 = 5,228.33, against the month's 4,516.)
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { calculateMonthlyBreakdown, spInMonthsDrawn } from '../src/services/TaxYearSetUp.js';

const monthlyFull = 12548 / 12;

describe('the State Pension inside the months drawn: one function', () => {
  it('starting in the first month drawn: the tax year\'s own total', () => {
    expect(spInMonthsDrawn({ yearTotal: 4516, monthlyFull, startYm: '2026-11', firstYm: '2026-11', months: 5 })).toBe(4516);
  });
  it('starting after the first month drawn: the tax year\'s own total', () => {
    expect(spInMonthsDrawn({ yearTotal: 2000, monthlyFull, startYm: '2027-01', firstYm: '2026-11', months: 5 })).toBe(2000);
  });
  it('already in payment: the monthly payment × the months drawn', () => {
    expect(spInMonthsDrawn({ yearTotal: 12548, monthlyFull, startYm: '2025-06', firstYm: '2026-11', months: 5 })).toBeCloseTo(monthlyFull * 5, 6);
  });
  it('no start month or monthly payment known: the year\'s share for the months', () => {
    expect(spInMonthsDrawn({ yearTotal: 12000, monthlyFull: null, startYm: null, firstYm: '2026-11', months: 5 })).toBe(5000);
    expect(spInMonthsDrawn({ yearTotal: 0, monthlyFull, startYm: '2026-11', firstYm: '2026-11', months: 5 })).toBe(0);
  });
});

describe('the set-up says the month\'s own tax and take-home', () => {
  it('Pat: £226.34 tax and £2,261.83 take-home a month (was £254.83 and £2,233.33)', () => {
    const b = calculateMonthlyBreakdown({ targetSalary: 29858, brl: 50270, pa: 12570, hrl: 125140, other: 0, statePension: 4516, statePensionMonthlyFull: monthlyFull,
      spStartYm: '2026-11', startYm: '2026-11', remainingMonths: 5, grossIncomeToDate: 14000, taxPaidToDate: 1500, isTaxEfficient: false, isaSavingsAllocation: 0 });
    expect(b.totalTax).toBeCloseTo(226.34, 2);
    expect(b.totalNet).toBeCloseTo(2261.83, 2);
  });
  it('the month reads the same function', () => {
    const src = readFileSync('src/services/legacyDecision.js', 'utf8');
    expect(src).toMatch(/spInMonthsDrawn\(\{ yearTotal: STATE, monthlyFull: spInfo\.monthlyFull, startYm: spInfo\.startYm, firstYm: firstDrawYm, months: deliverMonths \}\)/);
  });
});
