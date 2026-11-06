import { describe, it, expect } from 'vitest';
import {
  ISA_STRATEGIES,
  strategyMonthlyCap,
  isaDrawForPeriod,
  applyIsaGrowthMonthly
} from '../src/services/IsaDrawdown.js';

describe('isaDrawForPeriod', () => {
  it('Option A: draws the full net gap when the pot can cover it', () => {
    const r = isaDrawForPeriod({ netGap: 500, isaBalance: 50000 });
    expect(r.isaDraw).toBe(500);
    expect(r.remainingBalance).toBe(49500);
    expect(r.shortfall).toBe(0);
  });

  it('draws all remaining balance and reports the shortfall when the pot is nearly dry', () => {
    const r = isaDrawForPeriod({ netGap: 500, isaBalance: 200 });
    expect(r.isaDraw).toBe(200);
    expect(r.remainingBalance).toBe(0);
    expect(r.shortfall).toBe(300); // engine covers this with more SIPP (or lower income)
  });

  it('draws nothing from an empty pot', () => {
    const r = isaDrawForPeriod({ netGap: 500, isaBalance: 0 });
    expect(r.isaDraw).toBe(0);
    expect(r.shortfall).toBe(500);
  });

  it('respects the longevity cap', () => {
    const r = isaDrawForPeriod({ netGap: 500, isaBalance: 50000, cap: 300 });
    expect(r.isaDraw).toBe(300);
    expect(r.remainingBalance).toBe(49700);
    expect(r.shortfall).toBe(200);
  });

  it('clamps a negative gap to zero', () => {
    expect(isaDrawForPeriod({ netGap: -100, isaBalance: 50000 }).isaDraw).toBe(0);
  });
});

describe('strategyMonthlyCap', () => {
  it('Option A (tax-efficient) is always uncapped', () => {
    expect(strategyMonthlyCap(ISA_STRATEGIES.TAX_EFFICIENT, { isaBalance: 50000, monthsUntilSp: 60 }))
      .toBe(Infinity);
  });

  it('Option B levels the pot across the pre-SP months', () => {
    expect(strategyMonthlyCap(ISA_STRATEGIES.LONGEVITY, { isaBalance: 60000, monthsUntilSp: 120 }))
      .toBe(500); // 60000 / 120
  });

  it('Option B is uncapped once State Pension is in payment', () => {
    expect(strategyMonthlyCap(ISA_STRATEGIES.LONGEVITY, { isaBalance: 60000, monthsUntilSp: 0 }))
      .toBe(Infinity);
    expect(strategyMonthlyCap(ISA_STRATEGIES.LONGEVITY, { isaBalance: 60000, monthsUntilSp: null }))
      .toBe(Infinity);
  });
});

describe('applyIsaGrowthMonthly', () => {
  it('compounds one month of the annual rate', () => {
    expect(applyIsaGrowthMonthly(10000, 0.03)).toBeCloseTo(10000 * Math.pow(1.03, 1 / 12), 6);
  });
  it('leaves a non-positive balance unchanged', () => {
    expect(applyIsaGrowthMonthly(0, 0.03)).toBe(0);
  });
});
