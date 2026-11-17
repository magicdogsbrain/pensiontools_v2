/**
 * BeforeTax.js: a year's income before tax as it is taken, worked by hand (bands 2026/27: allowance £12,570, 20% to £50,270).
 */
import { describe, it, expect } from 'vitest';
import { takenBeforeTax, targetOfTaken, taxFreeShareOf } from '../src/services/BeforeTax.js';

// £2,400 a month after tax is 28,800 a year. Counted as if all of it were taxed (the plan's target):
//   (28,800 − 0.2 × 12,570) ÷ 0.8 = (28,800 − 2,514) ÷ 0.8 = 32,857.50
const TARGET = 32857.5;

describe('a year before tax as it is taken', () => {
  it('with every withdrawal taxed, the target is what is taken', () => {
    expect(takenBeforeTax(TARGET, { taxFreeFraction: 0 })).toBe(TARGET);
    expect(targetOfTaken(TARGET, {})).toBe(TARGET);
  });

  it('with a quarter of each withdrawal tax-free: (28,800 − 2,514) ÷ 0.85 = 30,924.71', () => {
    // taken D: a quarter free, three quarters taxed at 20% above the allowance: 0.85 D + 2,514 = 28,800
    const hand = (28800 - 2514) / 0.85;
    expect(takenBeforeTax(TARGET, { taxFreeFraction: 0.25 })).toBeCloseTo(hand, 2);
    expect(Math.round(takenBeforeTax(TARGET, { taxFreeFraction: 0.25 }))).toBe(30925);
    // and back: the figure typed as taken is the same target
    expect(targetOfTaken(hand, { taxFreeFraction: 0.25 })).toBeCloseTo(TARGET, 2);
  });

  it('with the State Pension in the year (£12,548, taxed in full), the pension draw is the rest', () => {
    // 0.25 D + (12,548 + 0.75 D) − 0.2 × (12,548 + 0.75 D − 12,570) = 28,800  →  0.85 D + 12,552.40 = 28,800
    const D = (28800 - 12552.4) / 0.85;            // 19,114.82
    expect(takenBeforeTax(TARGET, { taxFreeFraction: 0.25, fixed: 12548 })).toBeCloseTo(12548 + D, 2);
    expect(targetOfTaken(12548 + D, { taxFreeFraction: 0.25, fixed: 12548 })).toBeCloseTo(TARGET, 2);
  });

  it('the share comes from the plan: a quarter when it takes each withdrawal partly tax-free, else none', () => {
    expect(taxFreeShareOf({ accessMethod: 'ufpls' })).toBe(0.25);
    expect(taxFreeShareOf({ accessMethod: 'drawdown' })).toBe(0);
    expect(taxFreeShareOf(null)).toBe(0);
  });
});

import { partYearReason, breakdownFor } from '../src/services/TaxYearSetUp.js';
import { firstStepNoteHtml } from '../src/ui/plannerWords.js';

describe('the pages that say a year before tax, with a quarter of each payment tax-free', () => {
  it('the Stress settings line: the shape as held, and what is taken before tax for it', () => {
    const ufpls = firstStepNoteHtml(TARGET, { access: 'ufpls' });
    expect(ufpls).toContain('First step £32,858/yr gross ≈ £2,400/mo take-home');
    expect(ufpls).toContain('you take £30,925 a year before tax for it');
    expect(firstStepNoteHtml(TARGET, { access: 'drawdown' })).not.toContain('a year before tax for it');
  });

  it('a set-up in November after £21,000 of pay: what reaches the bank, and what the pension would pay for £2,400 to', () => {
    const ctx = { isApril: false, selectedMonth: '2026-11', remainingMonths: 5, taxFreeFraction: 0.25, statePension: { amount: 0 } };
    const inputs = { confirmedSalary: TARGET, pa: 12570, brl: 50270, hrl: 125140, other: 0, isaSavingsAllocation: 0, grossIncomeToDate: 21000, taxPaidToDate: null, isTaxEfficient: true };
    const r = partYearReason(ctx, inputs, breakdownFor(ctx, inputs));
    // the pay used the allowance: each £1 taken is 75p taxed at 20%, so 85p reaches the bank
    //   the plan's month 30,924.71 ÷ 12 = 2,577.06 → 2,577.06 × 0.85 = 2,190.50
    //   for £2,400 to reach the bank: 2,400 ÷ 0.85 = 2,823.53
    expect(r.full).toBe('£2,400');
    expect(r.month).toBe('£2,191');
    expect(r.take).toBe('£2,824');
  });
});
