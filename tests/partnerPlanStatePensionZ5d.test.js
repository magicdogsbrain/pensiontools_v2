/**
 * Ruling Z5d: a partner's plan made from the full view's Household tab assumes the same State Pension as every other place:
 * the full new amount the questions assume (£241.30 a week, £12,547.60 a year), from the State Pension age by date of birth
 * (answers/shared/household.js; answers/plan/income.js derivedSpDate) — never the planner's £12,000 from 67.
 * Sam (fictional) is 35 on 25 November 2026: born after 6 April 1978, State Pension age 68, so from 25 November 2059.
 */
import { describe, it, expect } from 'vitest';
import { partnerPlanSettingsOf } from '../src/ui/planStartUi.js';
import { derivedSpDate } from '../src/answers/plan/income.js';

const NOW = new Date(2026, 10, 25, 12);

describe('a partner\'s plan made in the full view', () => {
  it('Sam, 35, stopping at 62: the full amount from 68', () => {
    const made = partnerPlanSettingsOf({ ageToday: 35, stopAge: 62 }, NOW);
    expect(made.ok).toBe(true);
    const ss = made.stressSettings;
    expect(ss.spWeeklyAmount).toBe(241.3);
    expect(ss.statePension).toBeCloseTo(12547.6, 2);
    expect(ss.spStartDate).toBe('2059-11-25');
    expect(ss.spStartDate).toBe(derivedSpDate(ss, '2026-11-25'));
  });
  it('someone who has stopped, aged 64: the full amount from the State Pension age by date of birth', () => {
    const ss = partnerPlanSettingsOf({ ageToday: 64, stopped: true }, NOW).stressSettings;
    expect(ss.spWeeklyAmount).toBe(241.3);
    expect(ss.spStartDate).toBe(derivedSpDate(ss, '2026-11-25'));
  });
  it('no age: nothing assumed', () => {
    expect(partnerPlanSettingsOf({}, NOW).stressSettings).toEqual({});
  });
});
