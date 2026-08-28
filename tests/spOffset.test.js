import { describe, it, expect } from 'vitest';
import { spSimConfigFromSettings } from '../src/utils/StatePensionUtils.js';

describe('State Pension offset when the plan starts at a future retirement age', () => {
  const now = new Date('2026-08-26');
  it('plan starting now: years from today', () => {
    const c = spSimConfigFromSettings({ spStartDate: '21 April 2038', spWeeklyAmount: 230.25 }, now);
    expect(c.spStartYear).toBe(11);
  });
  it('55 today (birthday 21 April), income starts at 60 (21 Apr 2031): SP on 21 Apr 2038 is plan year 7', () => {
    const c = spSimConfigFromSettings({ spStartDate: '21 April 2038', spWeeklyAmount: 230.25, shapeAgeNow: 60, currentAge: 55 }, now);
    expect(c.spStartYear).toBe(7);
  });
  it('already retired (ages equal) is unchanged', () => {
    const c = spSimConfigFromSettings({ spStartDate: '21 April 2038', spWeeklyAmount: 230.25, shapeAgeNow: 57, currentAge: 57 }, now);
    expect(c.spStartYear).toBe(11);
  });
});

import { spTaxYearConfigFromSettings } from '../src/utils/StatePensionUtils.js';
describe('Decision-side SP is indexed by TAX year', () => {
  const now = new Date('2026-08-26');
  it('6 April 2029 is tax year 29/30 → plan year 3 from 26/27, full first year', () => {
    const c = spTaxYearConfigFromSettings({ spStartDate: '6 April 2029', spWeeklyAmount: 230.25 }, now);
    expect(c.spStartYear).toBe(3);
    expect(c.spFirstYearRatio).toBeCloseTo(1, 2);
  });
  it('21 April 2038 is tax year 38/39 → plan year 12, ratio just under 1', () => {
    const c = spTaxYearConfigFromSettings({ spStartDate: '21 April 2038', spWeeklyAmount: 230.25 }, now);
    expect(c.spStartYear).toBe(12);
    expect(c.spFirstYearRatio).toBeGreaterThan(0.95);
  });
  it('5 April 2029 is still tax year 28/29 → plan year 2, tiny ratio', () => {
    const c = spTaxYearConfigFromSettings({ spStartDate: '5 April 2029', spWeeklyAmount: 230.25 }, now);
    expect(c.spStartYear).toBe(2);
    expect(c.spFirstYearRatio).toBeLessThan(0.01);
  });
});
