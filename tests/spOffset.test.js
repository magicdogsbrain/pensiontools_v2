import { describe, it, expect } from 'vitest';
import { spSimConfigFromSettings } from '../src/utils/StatePensionUtils.js';

describe('State Pension offset when the plan starts at a future retirement age', () => {
  const now = new Date('2026-08-26');
  it('plan starting now: years from today', () => {
    const c = spSimConfigFromSettings({ spStartDate: '21 April 2038', spWeeklyAmount: 230.25 }, now);
    expect(c.spStartYear).toBe(11);
  });
  it('55 today, income starts at 60: SP lands 5 plan-years earlier (age 67 → plan year 6)', () => {
    const c = spSimConfigFromSettings({ spStartDate: '21 April 2038', spWeeklyAmount: 230.25, shapeAgeNow: 60, currentAge: 55 }, now);
    expect(c.spStartYear).toBe(6);
  });
  it('already retired (ages equal) is unchanged', () => {
    const c = spSimConfigFromSettings({ spStartDate: '21 April 2038', spWeeklyAmount: 230.25, shapeAgeNow: 57, currentAge: 57 }, now);
    expect(c.spStartYear).toBe(11);
  });
});
