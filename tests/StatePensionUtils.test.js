import { describe, it, expect } from 'vitest';
import {
  validateStatePensionDate,
  calculateStatePensionForTaxYear
} from '../src/utils/StatePensionUtils.js';

const NOW = new Date('2026-07-08');

// Projection tax years like a real plan: 26/27 .. 40/41
const CONFIGS = {};
for (let y = 26; y <= 40; y++) CONFIGS[`${y}/${y + 1}`] = { cpi: 0.025 };

describe('validateStatePensionDate', () => {
  it('accepts an empty value (State Pension is optional)', () => {
    const r = validateStatePensionDate('', { now: NOW });
    expect(r.valid).toBe(true);
    expect(r.error).toBeNull();
  });

  it('rejects a date of birth (1900s) with a helpful error', () => {
    const r = validateStatePensionDate('21-4-1970', { now: NOW });
    expect(r.valid).toBe(false);
    expect(r.error).toMatch(/date of birth/i);
  });

  it('rejects any date before the modern State Pension began (2016)', () => {
    expect(validateStatePensionDate('1 January 2010', { now: NOW }).valid).toBe(false);
  });

  it('accepts a future start date with no warning', () => {
    const r = validateStatePensionDate('21 April 2038', { now: NOW });
    expect(r.valid).toBe(true);
    expect(r.warning).toBeNull();
  });

  it('accepts a recent past date but warns it is treated as already in payment', () => {
    const r = validateStatePensionDate('21 April 2024', { now: NOW });
    expect(r.valid).toBe(true);
    expect(r.warning).toMatch(/already/i);
  });

  it('rejects an unparseable date', () => {
    expect(validateStatePensionDate('not a date', { now: NOW }).valid).toBe(false);
  });
});

describe('calculateStatePensionForTaxYear (chronological ordering)', () => {
  it('counts a legitimate past start date as in payment across all years', () => {
    const r = calculateStatePensionForTaxYear({
      taxYear: '26/27',
      spStartDate: '21-4-2024',
      weeklyAmount: 230,
      taxYearConfigs: CONFIGS
    });
    expect(r.isReceiving).toBe(true);
    expect(r.annual).toBeGreaterThan(0);
  });

  it('does not pay before a future start date, and pays after', () => {
    const before = calculateStatePensionForTaxYear({
      taxYear: '30/31',
      spStartDate: '21-4-2038',
      weeklyAmount: 230,
      taxYearConfigs: CONFIGS
    });
    const after = calculateStatePensionForTaxYear({
      taxYear: '40/41',
      spStartDate: '21-4-2038',
      weeklyAmount: 230,
      taxYearConfigs: CONFIGS
    });
    expect(before.isReceiving).toBe(false);
    expect(before.annual).toBe(0);
    expect(after.isReceiving).toBe(true);
    expect(after.annual).toBeGreaterThan(0);
  });

  it('regression: a 2-digit year does not misorder (2038 is NOT treated as past)', () => {
    // Before the fix, string sort placed later years wrongly; ensure 26/27
    // pays £0 for a 2038 start (i.e. future is future).
    const r = calculateStatePensionForTaxYear({
      taxYear: '26/27',
      spStartDate: '21-4-2038',
      weeklyAmount: 230,
      taxYearConfigs: CONFIGS
    });
    expect(r.annual).toBe(0);
  });
});

import { spSimConfigFromSettings, currentAgeNow } from '../src/utils/StatePensionUtils.js';
describe('State Pension plan year: ages do not go stale, boundaries get a month of tolerance', () => {
  it('a stored age is aged forward from its date stamp', () => {
    expect(currentAgeNow({ currentAge: 55, currentAgeAsOf: '2025-08-01' }, new Date('2026-08-28'))).toBeCloseTo(56.07, 1);
  });
  it('SP on 6 Aug 2037 for a 56-year-old retiring at 57 is plan year 10 (age 67)', () => {
    const c = spSimConfigFromSettings({ spStartDate: '6 Aug 2037', spWeeklyAmount: 230.25, shapeAgeNow: 57, currentAge: 56 }, new Date('2026-08-28'));
    expect(c.spStartYear).toBe(10);
  });
});

describe('State Pension date is a birthday: plan year = age at SP − start age', () => {
  it('21 Apr 2037 for a 56-year-old (Aug 2026) retiring at 57 → 67 → plan year 10', () => {
    const c = spSimConfigFromSettings({ spStartDate: '21 Apr 2037', spWeeklyAmount: 240, shapeAgeNow: 57, currentAge: 56 }, new Date('2026-08-28'));
    expect(c.spStartYear).toBe(10);
  });
  it('already retired (plan year 0 = today): SP 6 May 2029 is 2.7 years away → arrives during plan year 2 (partial year)', () => {
    const c = spSimConfigFromSettings({ spStartDate: '6 May 2029', spWeeklyAmount: 230, shapeAgeNow: 64, currentAge: 64 }, new Date('2026-08-28'));
    expect(c.spStartYear).toBe(2);
  });
});
