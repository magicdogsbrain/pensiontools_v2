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

describe('spTaxYearFirstRatio (ladder rungs are per tax year)', () => {
  it('SP starting 21 April pays 350/365 of that tax year, not the calendar 255/365', async () => {
    const { spTaxYearFirstRatio } = await import('../src/utils/StatePensionUtils.js');
    expect(spTaxYearFirstRatio({ spStartDate: '21 April 2037' })).toBeCloseTo(350 / 365, 3);
    expect(spTaxYearFirstRatio({ spStartDate: '1 April 2037' })).toBeCloseTo(5 / 365, 3);   // lands in 36/37
    expect(spTaxYearFirstRatio({})).toBeNull();
  });
});

// Day counts are whole CALENDAR days, not milliseconds (6.13.4). 6 April is in summer time and a winter date is
// not, so in the UK "14 March to 6 April" is an hour short of 23 days in milliseconds: the ratio was 22.958/366
// under Europe/London and 23/366 under UTC, and the same plan gave answers a few pounds apart. These are exact
// fractions, so they fail under ANY zone with a clock change if milliseconds creep back in.
describe('State Pension day counts do not depend on the time zone or the clock change', () => {
  it('first tax-year share is an exact fraction of whole days (winter and summer start dates)', async () => {
    const { spTaxYearFirstRatio, spTaxYearConfigFromSettings } = await import('../src/utils/StatePensionUtils.js');
    expect(spTaxYearFirstRatio({ spStartDate: '14 March 2032' })).toBe(23 / 366);        // 31/32 holds 29 Feb 2032
    expect(spTaxYearFirstRatio({ spStartDate: '9 November 2036' })).toBe(148 / 365);
    expect(spTaxYearFirstRatio({ spStartDate: '21 April 2037' })).toBe(350 / 365);
    expect(spTaxYearFirstRatio({ spStartDate: '6 April 2037' })).toBe(1);
    expect(spTaxYearConfigFromSettings({ spStartDate: '14 March 2032', spWeeklyAmount: 221.2, firstTaxYear: 2027 }, NOW).spFirstYearRatio).toBe(23 / 366);
  });
  it('the Decision tool\'s first-year weeks are whole days ÷ 7', () => {
    const r = calculateStatePensionForTaxYear({ taxYear: '31/32', spStartDate: '14 March 2032', weeklyAmount: 200, taxYearConfigs: {} });
    expect(r.isFirstYear).toBe(true);
    expect(r.annual).toBe(200 * 22 / 7);   // 14 March → 5 April = 22 days
  });
  it('a plan with no saved start year: the calendar-year share counts the start day itself, summer or winter', async () => {
    const { spSimConfigFromSettings } = await import('../src/utils/StatePensionUtils.js');
    expect(spSimConfigFromSettings({ spStartDate: '1 July 2035', spWeeklyAmount: 200 }, NOW).spFirstYearRatio).toBe((365 - 182) / 365);
    expect(spSimConfigFromSettings({ spStartDate: '1 February 2035', spWeeklyAmount: 200 }, NOW).spFirstYearRatio).toBe((365 - 32) / 365);
  });
  it('an ISO date is the same calendar day as the same date typed in words, in any zone', async () => {
    const { parseStatePensionDate, formatStatePensionDate } = await import('../src/utils/StatePensionUtils.js');
    const iso = parseStatePensionDate('2037-04-06'), words = parseStatePensionDate('6 April 2037');
    expect(iso.getTime()).toBe(words.getTime());
    expect(formatStatePensionDate('2037-04-06')).toBe('6 April 2037');
    expect([iso.getFullYear(), iso.getMonth(), iso.getDate(), iso.getHours()]).toEqual([2037, 3, 6, 0]);
  });
});
