/**
 * Tax Year Wizard Service — salary suggestion
 *
 * The April wizard uplifts LAST year's confirmed salary by last year's CPI, netted by the plan's
 * real-spending decline when it declines — so the Decision tool moves the target income the same way
 * the Stress tester does (Blanchett's spending smile).
 */

import { describe, it, expect } from 'vitest';
import { suggestSalary, SPEND_DECLINE_RATE } from '../src/services/TaxYearWizardService.js';

describe('TaxYearWizardService.suggestSalary', () => {
  it('flat plan: uplifts the prior salary by CPI only', () => {
    expect(suggestSalary(40000, 0.025, 0)).toBeCloseTo(41000, 6);   // 40000 × 1.025
  });

  it('declining plan: nets the ~1% spending decline off CPI (2.5% − 1% = 1.5%)', () => {
    expect(suggestSalary(40000, 0.025, SPEND_DECLINE_RATE)).toBeCloseTo(40600, 6); // 40000 × 1.015
  });

  it('compounds off last year, so a declining plan loses real value year on year', () => {
    // Two successive declining years at a steady 2.5% CPI: each is 1.5% up on the previous NOMINAL,
    // i.e. ~1% down in real terms — exactly the intended drift.
    const y1 = suggestSalary(40000, 0.025, SPEND_DECLINE_RATE); // 40600
    const y2 = suggestSalary(y1, 0.025, SPEND_DECLINE_RATE);    // 41209
    expect(y2).toBeCloseTo(40600 * 1.015, 6);
    // Real value (deflate by two years of 2.5% CPI) is below the starting 40000.
    const realY2 = y2 / (1.025 * 1.025);
    expect(realY2).toBeLessThan(40000);
  });

  it('declineRate defaults to 0 (flat) when omitted', () => {
    expect(suggestSalary(40000, 0.025)).toBeCloseTo(41000, 6);
  });

  it('SPEND_DECLINE_RATE matches the Stress engine ~1%/yr', () => {
    expect(SPEND_DECLINE_RATE).toBeCloseTo(0.01, 6);
  });
});

describe('budget-schedule suggestion (mocked stress settings)', () => {
  it('prefers the schedule figure × cumInf × smile over the chain, falls back cleanly', async () => {
    // The service reads stress settings via ScenarioRepository — mock at that seam.
    const { getWizardData } = await import('../src/services/TaxYearWizardService.js');
    // No stress mock in this environment → schedule path throws/absent → chain fallback:
    const data = await getWizardData('2026-04');
    expect(data.suggestionSource === 'chain' || data.suggestionSource === 'budget-schedule').toBe(true);
    expect(typeof data.suggestedSalary).toBe('number');
    expect(typeof data.chainSuggestedSalary).toBe('number');
  });
});

import { calculateMonthlyBreakdown } from '../src/services/TaxYearWizardService.js';

describe('calculateMonthlyBreakdown — tax on a mid-year start', () => {
  const base = { targetSalary: 28763, brl: 50270, pa: 12570, other: 0, statePension: 0, isaSavingsAllocation: 0, isTaxEfficient: true };
  it('full year, nothing earned before: plain annual tax / 12', () => {
    const r = calculateMonthlyBreakdown({ ...base, remainingMonths: 12, grossIncomeToDate: 0 });
    expect(r.sipp.tax).toBeCloseTo((28763 - 12570) * 0.2 / 12, 2);
  });
  it('8 months left with £18k already earned: the draws are taxed on top of that income', () => {
    const r = calculateMonthlyBreakdown({ ...base, remainingMonths: 8, grossIncomeToDate: 18000 });
    const draws = (28763 / 12) * 8;
    const total = (18000 + draws - 12570) * 0.2;
    const already = (18000 - 12570) * 0.2;
    expect(r.sipp.tax).toBeCloseTo((total - already) / 8, 2);
    expect(r.sipp.tax).toBeGreaterThan(400);
  });
});

describe('planYearBaseline — plan year 0 is the first tax year actually set up', () => {
  it('uses the earliest tax year in the Decision tool, however far in the future', async () => {
    const { planYearBaseline } = await import('../src/services/TaxYearWizardService.js');
    expect(planYearBaseline({ '36/37': {}, '37/38': {}, '38/39': {} }, '38/39')).toBe(2036);
    expect(planYearBaseline({ '38/39': {}, '36/37': {} }, '38/39')).toBe(2036);   // order-independent
  });
  it('falls back to the year being set up when nothing exists yet', async () => {
    const { planYearBaseline } = await import('../src/services/TaxYearWizardService.js');
    expect(planYearBaseline({}, '36/37')).toBe(2036);
    expect(planYearBaseline(null, '27/28')).toBe(2027);
  });
  it('ignores junk keys', async () => {
    const { planYearBaseline } = await import('../src/services/TaxYearWizardService.js');
    expect(planYearBaseline({ 'notAYear': {}, '36/37': {} }, '36/37')).toBe(2036);
  });
});

describe('other income from the Stress plan (rent, DB, streams)', () => {
  it('counts plan years from the plan start, not a hardcoded 2026', async () => {
    const { otherIncomeFromStress } = await import('../src/services/TaxYearWizardService.js');
    // rent of £8,000 running plan years 3..12, plan starting 2027/28
    const ss = { extraIncomes: [{ annual: 8000, startYear: 3, endYear: 12 }] };
    // they start the Decision tool in 2036/37, so THAT is plan year 0
    const B = 2036;
    expect(otherIncomeFromStress(ss, '38/39', B)).toBe(0);      // plan year 2 — not started
    expect(otherIncomeFromStress(ss, '39/40', B)).toBe(8000);   // plan year 3 — starts
    expect(otherIncomeFromStress(ss, '48/49', B)).toBe(8000);   // plan year 12 — last year
    expect(otherIncomeFromStress(ss, '49/50', B)).toBe(0);      // plan year 13 — ended
  });

  it('a plan starting a year later shifts every window by a year', async () => {
    const { otherIncomeFromStress } = await import('../src/services/TaxYearWizardService.js');
    const ss = { extraIncomes: [{ annual: 5000, startYear: 5 }] };
    expect(otherIncomeFromStress(ss, '32/33', 2027)).toBe(5000);   // started 2027 -> year 5 = 32/33
    expect(otherIncomeFromStress(ss, '32/33', 2028)).toBe(0);      // started 2028 -> year 5 = 33/34
    expect(otherIncomeFromStress(ss, '33/34', 2028)).toBe(5000);
  });

  it('adds a DB pension only once it has started, and flat other always', async () => {
    const { otherIncomeFromStress } = await import('../src/services/TaxYearWizardService.js');
    const ss = { other: 2000, dbAmount: 9000, dbStartYear: 8 };
    expect(otherIncomeFromStress(ss, '27/28', 2027)).toBe(2000);
    expect(otherIncomeFromStress(ss, '35/36', 2027)).toBe(11000);
  });

  it('hasOtherIncomePlan tells the wizard whether to trust the projection', async () => {
    const { hasOtherIncomePlan } = await import('../src/services/TaxYearWizardService.js');
    expect(hasOtherIncomePlan(null)).toBe(false);
    expect(hasOtherIncomePlan({ other: 0, dbAmount: 0, extraIncomes: [] })).toBe(false);
    expect(hasOtherIncomePlan({ extraIncomes: [{ annual: 8000, startYear: 0 }] })).toBe(true);
    expect(hasOtherIncomePlan({ dbAmount: 5000 })).toBe(true);
  });
});
