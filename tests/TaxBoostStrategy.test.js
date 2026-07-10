/**
 * TaxBoostStrategy — the shared protection-shortfall catch-up used by both engines.
 */
import { describe, it, expect } from 'vitest';
import { planTaxBoost, BOOST_DEFAULTS } from '../src/services/TaxBoostStrategy.js';

describe('planTaxBoost', () => {
  const std = 4000; // standard monthly SIPP

  it('returns 0 with no shortfall or no surplus', () => {
    expect(planTaxBoost({ shortfall: 0, standardMonthly: std, remainingMonths: 6, surplus: 50000 })).toBe(0);
    expect(planTaxBoost({ shortfall: 10000, standardMonthly: std, remainingMonths: 6, surplus: 0 })).toBe(0);
  });

  it('spreads the shortfall over the remaining months', () => {
    // 12000 shortfall over 6 months = 2000/mo, well under the £2000 per-month cap (50% of 4000).
    const b = planTaxBoost({ shortfall: 12000, standardMonthly: std, remainingMonths: 6, surplus: 100000 });
    expect(b).toBeCloseTo(2000, 6);
  });

  it('caps the boost per month so it cannot cram the shortfall into the final month', () => {
    // 1 month left, huge shortfall + surplus + BRL room: without the cap this would be ~15000.
    const b = planTaxBoost({ shortfall: 15000, standardMonthly: std, remainingMonths: 1, surplus: 100000, brlHeadroom: 100000 });
    expect(b).toBe(std * BOOST_DEFAULTS.MAX_FRACTION); // £2000, not £15000
  });

  it('stays basic-rate: limited by BRL headroom spread over remaining months', () => {
    // BRL headroom 3000 over 6 months = 500/mo, below the other candidates → binds.
    const b = planTaxBoost({ shortfall: 12000, standardMonthly: std, remainingMonths: 6, surplus: 100000, brlHeadroom: 3000 });
    expect(b).toBeCloseTo(500, 6);
  });

  it('does not boost when BRL headroom is already exhausted', () => {
    expect(planTaxBoost({ shortfall: 12000, standardMonthly: std, remainingMonths: 6, surplus: 100000, brlHeadroom: -1 })).toBe(0);
  });

  it('is limited by available surplus', () => {
    // surplus 600 over 6 months = 100/mo → but that is below MIN_BOOST (50)? 100 > 50 → returns 100.
    const b = planTaxBoost({ shortfall: 99000, standardMonthly: std, remainingMonths: 6, surplus: 600 });
    expect(b).toBeCloseTo(100, 6);
  });
});
