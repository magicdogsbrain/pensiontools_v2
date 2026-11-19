/**
 * A retired plan's year 0 pays only for the months it has, and a State Pension already being paid pays all of them (7.12.0,
 * the lead's ruling after step P pass 3).
 *
 * A retired plan's year 0 is this tax year. Its pots are the pots of today, so the months of the tax year already gone were
 * paid before they were counted: the plan pays from this month to March. Counted in whole months: this month counts whole,
 * and so does the month a State Pension starts in.
 *
 * Before: the plan paid all twelve months of year 0 from today's pots, and a State Pension begun in an earlier tax year
 * counted only the share of a year it had in the tax year it began (a State Pension from 1 June 2024: 309/365 = 0.8466).
 *
 * A fictional plan: Pat is 66 and retired, wants £12,000 a year before tax, and has a State Pension of £230 a week
 * (£11,960 a year) paid since 1 June 2024, and £1,000 in cash. Today is 30 September 2026. Prices flat. Worked by hand:
 *   year 0's months             September to March: 7 (April to August are gone)
 *   from the pots, a month       (12,000 − 11,960) ÷ 12 = 3.33
 *   year 0 from the pots         7 × 3.33 = 23.33 (before: 12,000 − 11,960 × 0.8466 = 1,874.86, more than the £1,000:
 *                                the money ran out in year 0, though the State Pension alone pays £996.67 of £1,000 a month)
 *   year 1                       12 × 3.33 = 40
 * Sam's State Pension (the same £11,960) starts on 10 January 2027, in year 0: it pays January to March, 3 months.
 *   year 0's State Pension       11,960 × 3 ÷ 12 = 2,990
 *   year 0 from the pots         12,000 × 7 ÷ 12 − 2,990 = 7,000 − 2,990 = 4,010
 */
import { describe, it, expect, vi } from 'vitest';
vi.mock('../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));

import { createSimulationConfigFromSettings } from '../src/storage/StressRepository.js';
import { planFromSettings } from '../src/strategies/stressTest.js';
import { simulate } from '../src/services/SimulationEngine.js';
import { year0MonthsOf, year0SpMonthsOf, deriveTiming } from '../src/services/PlanTiming.js';

const NOW = new Date(2026, 8, 30, 12);
const pat = {
  configured: true, duration: 25, other: 0, pa: 12570, brl: 50270, hrl: 125140, taxMode: 'inflates',
  protectionMult: 0.8, consecutiveLimit: 3, disableProtection: true, recoveryBuffer: 0,
  hodlEnabled: false, hodlValue: 0, isaReturn: 0.03, spStartDate: '2024-06-01', spWeeklyAmount: 230, statePension: 0,
  dbAmount: 0, dbStartYear: 0, dbIndexation: 'cpi',
  equityMin: 0, bondMin: 0, cashTarget: 1000, isaBalance: 0, baseSalary: 12000,
  incomeShape: 'phases', incomeSteps: [{ fromAge: 66, amount: 12000 }], shapeAgeNow: 66,
  currentAge: 66, currentAgeAsOf: '2026-09-30', retired: true, firstTaxYear: 2026
};
const planOf = (s, now = NOW) => planFromSettings(s, createSimulationConfigFromSettings({}, s), { now });
const flat = { equity: Array(30).fill(0), inflation: Array(30).fill(1e-12) };   // 0 would read as "none given" (2.5%)
const run = (cfg) => simulate({ ...cfg, years: 25, trace: true, disableProtection: true }, flat, 1);
const sum = (rows) => rows.reduce((t, r) => t + (r.effectiveSipp || 0) + (r.effectiveIsa || 0), 0);

describe('a retired plan\'s year 0 pays for the months it has', () => {
  it('the months: September 7, April 12, March 1; a locked plan\'s recorded position wins over today', () => {
    expect(year0MonthsOf(deriveTiming(pat, NOW))).toBe(7);
    expect(year0MonthsOf(deriveTiming(pat, new Date(2026, 3, 20)))).toBe(12);
    expect(year0MonthsOf(deriveTiming(pat, new Date(2027, 2, 10)))).toBe(1);
    expect(year0MonthsOf(deriveTiming(pat, NOW), { elapsedYears: 0, monthsIntoYear: 2 })).toBe(10);
    // a year 0 behind it and no position: year0MonthsOf says nothing of it (12); its current year is counted from the pots'
    // day by planFromSettings, the same months (7.12.0, ruling C: tests/partYearOneSum.test.js)
    expect(year0MonthsOf(deriveTiming({ ...pat, firstTaxYear: 2025 }, NOW))).toBe(12);
  });

  it('the State Pension\'s months of it, in whole months', () => {
    expect(year0SpMonthsOf('2024-06-01', 2026, 7)).toBe(7);    // paid since an earlier tax year: all 7
    expect(year0SpMonthsOf('2026-09-30', 2026, 7)).toBe(7);    // from this month: all 7
    expect(year0SpMonthsOf('2026-10-01', 2026, 7)).toBe(6);    // October to March
    expect(year0SpMonthsOf('2027-01-10', 2026, 7)).toBe(3);    // January to March
    expect(year0SpMonthsOf('2027-04-03', 2026, 7)).toBe(0);    // after year 0
    expect(year0SpMonthsOf('2024-06-01', 2026, 12)).toBe(null); // a whole year 0: the share by days stays
  });

  it('Pat: nothing from the pots April to August; 7 × £3.33 = £23.33 September to March; year 1 £40; the money lasts', () => {
    const p = planOf(pat);
    expect(p.year0Months).toBe(7);
    expect(p.pnvCfg.year0Months).toBe(7);
    expect(p.pnvCfg.spFirstYearRatio).toBe(1);         // a whole month's State Pension in each of the 7
    expect(p.spFirstYearRatioTaxYear).toBeCloseTo(7 / 12, 12);   // the ladder's: 7 months of a year
    const r = run(p.pnvCfg);
    expect(sum(r.trace.slice(0, 5))).toBe(0);
    expect(sum(r.trace.slice(5, 12))).toBeCloseTo(23.33, 1);
    expect(sum(r.trace.slice(12, 24))).toBeCloseTo(40, 1);
    expect(r.failed).toBe(false);
  });

  it('Sam: a State Pension from January pays 3 of year 0\'s 7 months: £4,010 from the pots (7,000 − 2,990)', () => {
    const sam = { ...pat, spStartDate: '2027-01-10', cashTarget: 10000 };
    const p = planOf(sam);
    expect(p.pnvCfg.spFirstYearRatio).toBeCloseTo(3 / 7, 12);
    expect(p.spFirstYearRatioTaxYear).toBeCloseTo(3 / 12, 12);
    const r = run(p.pnvCfg);
    expect(sum(r.trace.slice(0, 5))).toBe(0);
    expect(sum(r.trace.slice(5, 12))).toBeCloseTo(4010, 0);
    expect(sum(r.trace.slice(12, 24))).toBeCloseTo(40, 1);
  });

  it('in April nothing changes: year 0 is a whole year and the State Pension begun before it is paid all of it', () => {
    const p = planOf(pat, new Date(2026, 3, 20, 12));
    expect(p.year0Months).toBeUndefined();
    expect(p.pnvCfg.year0Months).toBeUndefined();
    expect(p.pnvCfg.spFirstYearRatio).toBe(1);         // begun in 2024/25: a whole year 0 of it (was 0.8466)
    expect(sum(run(p.pnvCfg).trace.slice(0, 12))).toBeCloseTo(40, 1);
  });
});
