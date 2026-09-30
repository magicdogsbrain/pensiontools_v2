/**
 * Bug replays — State Pension: the year it starts, the month it starts, and the plan year it lands in.
 * Ids are from research/bug-replay-catalogue.md.
 */
import { describe, it, expect, vi } from 'vitest';
vi.mock('../../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));

import { calcDecisionPWA } from '../../src/services/legacyDecision.js';
import { calculateMonthlyBreakdown } from '../../src/services/TaxYearWizardService.js';
import { spSimConfigFromSettings, spTaxYearConfigFromSettings } from '../../src/utils/StatePensionUtils.js';
import { at, SEPT_2026, ukTax } from './_replay.js';

// "QA SP starts Nov 66": State Pension £230 a week from 9 November 2026 — £996.67 a month once it starts,
// £4,829 in the 2026/27 tax year. Set up in September, seven payments to come.
const SP = { amount: 4829, monthly: 4829 / 12, monthlyFull: 996.67, startYm: '2026-11', isReceiving: true, isFirstYear: true };

describe('the tax-year setup in the year the State Pension starts', () => {
  const setup = { targetSalary: 24000, brl: 50270, pa: 12570, other: 0, statePension: 4829, statePensionMonthlyFull: 996.67, spStartYm: '2026-11', isaSavingsAllocation: 0, remainingMonths: 7, grossIncomeToDate: 0, isTaxEfficient: false };

  it('P7 — the pension is the monthly payment from its start month, never the partial year spread over twelve', () => {
    const sept = calculateMonthlyBreakdown({ ...setup, startYm: '2026-09' });
    expect(sept.statePension.gross).toBe(0);                       // nothing arrives before November
    expect(sept.sipp.gross).toBeCloseTo(2000, 0);                  // so the SIPP pays the whole month
    const nov = calculateMonthlyBreakdown({ ...setup, startYm: '2026-11', remainingMonths: 5 });
    expect(nov.statePension.gross).toBeCloseTo(996.67, 2);         // £997, not £402
    expect(nov.statePension.gross).not.toBeCloseTo(4829 / 12, 0);
  });

  it('P12 — the year\'s tax still counts the State Pension that arrives later in the year (£179 a month, not £41)', () => {
    const b = calculateMonthlyBreakdown({ ...setup, startYm: '2026-09' });
    const right = ukTax(2000 * 7 + 4829) / 7;                      // ≈ £179
    const wrong = ukTax(2000 * 7) / 7;                             // ≈ £41 — the pension left out
    expect(Math.abs(b.totalTax - right)).toBeLessThan(1);
    expect(b.totalTax - wrong).toBeGreaterThan(100);
  });
});

describe('the monthly recommendation in the year the State Pension starts', () => {
  const settings = { equityMin: 27000, bondMin: 40500, cashTarget: 22500, duration: 28, baseSalary: 24000, protectionFactor: 20, recoveryBuffer: 15000, consecutiveLimit: 3, isaDrawdownStrategy: 'minimiseEarlyTax', firstTaxYear: 2026 };
  const ty = { pa: 12570, brl: 50270, hrl: 125140, other: 0, cpi: 0.031, isTaxEfficient: true, isaSavingsAllocation: 0, isaSavingsUsed: 0, grossIncomeToDate: 0, confirmedSalary: 24000, yearSetupComplete: true, startMonth: 9, remainingMonths: 7, expectedMonthly: { sipp: { gross: 2000 } } };
  const deps = (history = []) => ({ settings, history, allTaxYears: { '26/27': ty }, spInfo: SP, isaBalance: 0 });

  it('P7 — September shows no State Pension and the SIPP covers the gap; November shows the full payment', async () => {
    const sept = await calcDecisionPWA('2026-09', 100000, 80000, 40000, deps());
    expect(sept.statePension).toBe(0);
    const nov = await calcDecisionPWA('2026-11', 100000, 80000, 40000, deps());
    expect(nov.statePension).toBeCloseTo(996.67, 2);
  });

  it('R6.11.6-a — the recommendation\'s own tax counts the whole partial-year pension (£179, not £121)', async () => {
    const sept = await calcDecisionPWA('2026-09', 100000, 80000, 40000, deps());
    const right = ukTax(sept.sippDraw * 7 + 4829) / 7;             // all £4,829 lands in the seven months drawn
    const wrong = ukTax(sept.sippDraw * 7 + 4829 * 7 / 12) / 7;    // only 7/12 of it: the old share
    expect(Math.abs(sept.monthlyTax - right)).toBeLessThan(2);
    expect(sept.monthlyTax - wrong).toBeGreaterThan(40);
  });
});

describe('the plan year the State Pension lands in', () => {
  // The owner's plan: year 0 is 2027/28, State Pension from 21 April 2037 (tax year 2037/38 → plan year 10).
  const chris = { currentAge: 56, currentAgeAsOf: '2026-09-09', spStartDate: '21 April 2037', spWeeklyAmount: 230, shapeAgeNow: 57, duration: 35, retired: true, firstTaxYear: 2027 };

  it('R6.4.0-c — the Stress run and the Decision tool agree, and neither moves with the date it is read on', () => {
    for (const today of [SEPT_2026, at(2027, 1, 15), at(2027, 4, 8)]) {
      expect(spSimConfigFromSettings(chris, today).spStartYear).toBe(10);
      expect(spTaxYearConfigFromSettings(chris, today).spStartYear).toBe(10);
    }
    expect(spSimConfigFromSettings(chris, SEPT_2026).spFirstYearRatio).toBeCloseTo(350 / 365, 2);   // measured against 6 April
  });
});
