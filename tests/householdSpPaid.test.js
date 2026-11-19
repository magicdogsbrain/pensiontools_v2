/**
 * A State Pension already being paid counts in the household's years (walks3 W8-H4). Fictional: Kim, 66, retired, has
 * been paid the full State Pension since March 2026 (£230.25 a week) and a £6,000 final-salary pension, and wants £28,000
 * a year; Sam, 60, still works until 62. Worked by hand for this year (row 0):
 *   Kim's State Pension     230.25 × 52 = £11,973 (it showed £0)
 *   from the pots           28,000 − 11,973 − 6,000 = £10,027 (it showed £22,000)
 */
import { describe, it, expect } from 'vitest';
import { householdIncomeTimeline } from '../src/services/HouseholdService.js';

const NOW = new Date(2026, 10, 18, 12);
const kim = { retired: true, currentAge: 66, shapeAgeNow: 67, spStartDate: '2026-03-06', spWeeklyAmount: 230.25, baseSalary: 28000, duration: 25, dbAmount: 6000, dbStartYear: 0, other: 0 };
const sam = { retired: false, currentAge: 60, shapeAgeNow: 62, spStartDate: '2033-05-06', spWeeklyAmount: 230.25, baseSalary: 20000, duration: 30, other: 0 };

describe('the household years count a State Pension already paid', () => {
  it('Kim\'s, this year: £11,973, and the pots pay £10,027', () => {
    const r0 = householdIncomeTimeline(kim, sam, 5, NOW)[0];
    expect(r0.spA).toBeCloseTo(11973, 6);
    expect(r0.drawNeed).toBeCloseTo(10027, 6);
    expect(r0.workingB).toBe(true);
  });
  it('the same when Kim is the partner', () => {
    const r0 = householdIncomeTimeline(sam, kim, 5, NOW)[0];
    expect(r0.spB).toBeCloseTo(11973, 6);
    expect(r0.drawNeed).toBeCloseTo(10027, 6);
  });
  it('a State Pension still to come waits for its year', () => {
    const rows = householdIncomeTimeline(kim, sam, 10, NOW);
    expect(rows[0].spB).toBe(0);
    expect(rows.find((r) => r.spB > 0).calendarYear).toBeGreaterThanOrEqual(2033);
  });
});

import { personProfile } from '../src/services/HouseholdDraw.js';
describe('the household split\'s years read the same', () => {
  it('Kim\'s row this year carries her State Pension', () => {
    const r0 = personProfile(kim, { now: NOW, years: 3 }).rows[0];
    expect(r0.sp).toBeCloseTo(11973, 6);
    expect(r0.fixed).toBeCloseTo(11973 + 6000, 6);
  });
});
