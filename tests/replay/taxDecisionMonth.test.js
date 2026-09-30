/**
 * Bug replays — the monthly decision step and the tax-year setup (the owner's live path, and the most
 * corrected code in September 2026). Ids are from research/bug-replay-catalogue.md.
 */
import { describe, it, expect, vi } from 'vitest';
vi.mock('../../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));
// The wizard reads the Stress plan through one seam; each test sets what it should see.
const stress = vi.hoisted(() => ({ current: null }));
vi.mock('../../src/storage/ScenarioRepository.js', async (orig) => ({ ...(await orig()), getActiveStressSettings: async () => stress.current }));

import { calcDecisionPWA, getYearNum } from '../../src/services/legacyDecision.js';
import { calculateMonthlyBreakdown, getWizardData } from '../../src/services/TaxYearWizardService.js';
import { decisionToHistory } from '../../src/models/Decision.js';
import { buildDecisionHTML } from '../../src/ui/components/DecisionPanel.js';
import { frozenAt, SEPT_2026, ukTax } from './_replay.js';

const settings = { equityMin: 300000, bondMin: 200000, cashTarget: 50000, duration: 30, baseSalary: 36000, protectionFactor: 20, recoveryBuffer: 15000, consecutiveLimit: 3, isaDrawdownStrategy: 'minimiseEarlyTax', firstTaxYear: 2026 };
const taxYear = (o = {}) => ({ pa: 12570, brl: 50270, hrl: 125140, other: 0, cpi: 0.03, isTaxEfficient: false, isaSavingsAllocation: 0, isaSavingsUsed: 0, grossIncomeToDate: 0, confirmedSalary: 36000, yearSetupComplete: true, startMonth: 4, remainingMonths: 12, ...o });
const noSp = { amount: 0, isReceiving: false };
const deps = (ty, o = {}) => ({ settings, history: [], allTaxYears: { '26/27': ty }, spInfo: noSp, isaBalance: 0, ...o });
// Three months behind us with the growth pots (shares + bonds) under the sum of their glidepaths, and still under
// them now: the protection trigger (the owner's rule — it is the pots against their glidepaths that count, not
// which pot paid; each record carries its pot values and that month's glidepaths, as a saved record does).
const cashMonths = ['2026-04', '2026-05', '2026-06'].map((date) => ({ date, taxYear: '26/27', source: 'Cash', sipp: 3000, stdSipp: 3000, inProtection: false,
  equity: 200000, bond: 150000, cash: 60000, adjEquity: 300000, adjBond: 200000, adjCash: 50000 }));

describe('calculation reason and the History row', () => {
  it('C7 — the reason never repeats itself ("Protection | Protection")', async () => {
    const r = await calcDecisionPWA('2026-07', 200000, 150000, 60000, deps(taxYear(), { history: cashMonths }));
    expect(r.inProtection).toBe(true);
    const parts = r.calculationDetails.reason.split(' | ');
    expect(new Set(parts).size).toBe(parts.length);
  });

  it('R6.4.2-c — a saved month keeps how a gilt-ladder plan paid it and that it was before year 0', () => {
    const row = decisionToHistory({ date: '2026-09', taxYear: '26/27', yearNumber: 0, equity: 0, bond: 950000, cash: 220000, sippDraw: 7000, isaDraw: 0, monthlyTax: 1800, totalMonthlyNet: 5200,
      bridgeYear: true, planStartYear: 2027, strategyOverlay: { id: 'gilt-rotation', hidePots: true, floorLabel: 'SIPP cash', note: 'Nothing is sold.' } });
    expect(row).toMatchObject({ bridgeYear: true, planStartYear: 2027, strategyId: 'gilt-rotation', contract: true, strategySource: 'SIPP cash', strategyNote: 'Nothing is sold.' });
    // A pot-strategy month in the plan proper carries none of it (old records stay readable).
    const plain = decisionToHistory({ date: '2027-05', taxYear: '27/28', yearNumber: 0, equity: 1, bond: 1, cash: 1, sippDraw: 1000, isaDraw: 0 });
    expect(plain.bridgeYear).toBeUndefined();
    expect(plain.contract).toBeUndefined();
  });

  it('R6.4.0-b — plan years are counted from the plan\'s own start, not a hard-coded 2026/27', () => {
    expect(getYearNum('2026-09', 2027)).toBe(-1);   // before the plan: the run-up
    expect(getYearNum('2030-03', 2027)).toBe(2);    // March 2030 is still 2029/30
    expect(getYearNum('2030-04', 2027)).toBe(3);    // the step down lands in April 2030, not April 2029
  });
});

describe('"tax saved" is tax-free money used, nothing else', () => {
  it('R6.11.2 — a month whose SIPP draw is short of the target, with nothing tax-free in it, saved no tax', async () => {
    // Tax-efficient year, no ISA, the setup expects £2,000 a month against a £36,000 target (the run-up shape:
    // the draw is below target/12 for a reason that has nothing to do with tax).
    const r = await calcDecisionPWA('2026-04', 400000, 250000, 60000, deps(taxYear({ isTaxEfficient: true, expectedMonthly: { sipp: { gross: 2000 } } })));
    expect(r.sippDraw).toBeCloseTo(2000, 0);
    expect(r.isaDraw || 0).toBe(0);
    expect(r.taxSavedMonthly).toBe(0);
  });

  it('R6.11.2 — a protection month (draw trimmed by a fifth) is not a tax saving either', async () => {
    const r = await calcDecisionPWA('2026-07', 200000, 150000, 60000, deps(taxYear({ isTaxEfficient: true, expectedMonthly: { sipp: { gross: 3000 } } }), { history: cashMonths }));
    expect(r.inProtection).toBe(true);
    expect(r.sippDraw).toBeLessThan(3000);
    expect(r.taxSavedMonthly).toBe(0);
  });

  it('R6.4.2-a — State Pension and other income are not counted twice in the comparison', async () => {
    // Full target from the SIPP with £12,000 DB and an £11,960 State Pension in payment: that IS the
    // "inefficient" case, so there is nothing to save. The old sum added the fixed income on top of a target
    // that already included it and reported a few hundred pounds a month.
    const sp = { amount: 11960, monthly: 11960 / 12, monthlyFull: 996.67, startYm: '2024-05', isReceiving: true };
    const r = await calcDecisionPWA('2026-04', 400000, 250000, 60000, deps(taxYear({ other: 12000, confirmedSalary: 60000 }), { spInfo: sp }));
    expect(r.sippDraw).toBeCloseTo((60000 - 12000 - 996.67 * 12) / 12, 0);
    expect(r.taxSavedMonthly).toBe(0);
  });

  it('P4d — floating-point dust is not a "Tax Saved -£0.00" row', () => {
    const base = { sippDraw: 2333, isaDraw: 0, totalMonthlyNet: 2076, monthlyTax: 257, source: 'Cash', drawFromCash: 2333, equity: 0, bond: 498625, cash: 81375, adjEquityMin: 0, adjBondMin: 0, adjCashTarget: 0, pa: 12570, brl: 50270, hrl: 125140, taxPaidMonthly: 257, taxPaidYTD: 257, taxProjectedAnnual: 3086, alerts: [] };
    const dust = buildDecisionHTML({ ...base, isTaxEfficientYear: true, calculationDetails: { taxInfo: { taxSavedAnnual: 3e-12 } }, taxSavedMonthly: 2.5e-13, taxSavedProjectedAnnual: 3e-12 });
    expect(dust).not.toContain('Tax Saved');
    expect(dust).not.toMatch(/-£0(\.00)?</);
    const real = buildDecisionHTML({ ...base, isTaxEfficientYear: true, calculationDetails: { taxInfo: { taxSavedAnnual: 1200 } }, taxSavedMonthly: 100, taxSavedProjectedAnnual: 1200 });
    expect(real).toContain('Tax Saved');
  });
});

describe('a tax year that starts part-way through', () => {
  // The owner, September 2026: five £7,000 payments and five £304.68 DB payments already received (gross
  // £36,523), PAYE deducted so far £9,364. Target £87,650 including £3,656 DB. Seven payments to come.
  const chris = { targetSalary: 87650, brl: 50270, pa: 12570, other: 3656, statePension: 0, isaSavingsAllocation: 0, remainingMonths: 7, grossIncomeToDate: 36523, isTaxEfficient: false };

  it('R6.4.1-a — with the tax already paid known, the tax to come is the year\'s total less that', () => {
    const yearTax = ukTax(87650);                                   // £22,492
    const told = calculateMonthlyBreakdown({ ...chris, taxPaidToDate: 9364 });
    expect(Math.round(told.sipp.gross)).toBe(7000);                 // the gross draw never moved
    expect(Math.abs(told.totalTax - (yearTax - 9364) / 7)).toBeLessThan(2);      // ≈ £1,875 a month, as the payslips show
    const blank = calculateMonthlyBreakdown(chris);
    expect(blank.totalTax - told.totalTax).toBeGreaterThan(300);    // the old assumption overstated it by hundreds a month
  });

  it('R6.4.1-b — other income in a partial year counts only for the months left (the rest is in the income to date)', async () => {
    // September start, £22,000 DB, £9,167 of it and other income already received. SIPP £1,167 × 7.
    const ty = taxYear({ other: 22000, grossIncomeToDate: 9167, startMonth: 9, remainingMonths: 7, expectedMonthly: { sipp: { gross: 1166.67 } } });
    const r = await calcDecisionPWA('2026-09', 300000, 200000, 60000, deps(ty));
    const taxable = r.sippDraw * 7 + 22000 * 7 / 12 + 9167;
    expect(Math.abs(r.monthlyTax - (ukTax(taxable) - ukTax(9167)) / 7)).toBeLessThan(2);
    // The double count: the whole £22,000 on top of an income-to-date that already held five months of it.
    const doubleCounted = (ukTax(r.sippDraw * 7 + 22000 + 9167) - ukTax(9167)) / 7;
    expect(doubleCounted - r.monthlyTax).toBeGreaterThan(200);
  });
});

describe('the setup\'s suggested income', () => {
  // The owner's plan as the wizard sees it: retired, year 0 = 2027/28, £50,000 SIPP cash to the first April.
  const chrisStress = {
    currentAge: 56, currentAgeAsOf: '2026-09-09', retired: true, firstTaxYear: 2027, shapeAgeNow: 57,
    spStartDate: '21 April 2037', spWeeklyAmount: 230, baseSalary: 83650, duration: 35, dbAmount: 3650,
    incomeShape: 'phases', incomeSteps: [{ fromAge: 57, amount: 83650 }, { fromAge: 60, amount: 68650 }],
    targetSchedule: [83650, 83650, 83650, 68650, 68650],
    strategyId: 'gilt-rotation', strategyParams: { cashYears: 3, bridgeCash: 50000 }
  };

  it('R6.5.4-b — before year 0 the suggestion is the plan\'s first step, not the run-up cash spread over the months left', async () => {
    stress.current = chrisStress;
    const d = await frozenAt(SEPT_2026, () => getWizardData('2026-09'));
    expect(d.bridgeYear).toBe(true);
    expect(d.remainingMonths).toBe(7);
    expect(d.suggestedSalary).toBe(83650);                          // not 50,000 × 12 / 7 = £85,714
    expect(d.suggestedSalary).not.toBe(Math.round(50000 * 12 / 7));
  });

  it('P9 — "the cash to April covers N payments" nets off rent, like the DB pension', async () => {
    stress.current = { ...chrisStress, extraIncomes: [{ label: 'rent', annual: 12000, startYear: 0, endYear: 3 }] };
    const withRent = await frozenAt(SEPT_2026, () => getWizardData('2026-09'));
    stress.current = chrisStress;
    const without = await frozenAt(SEPT_2026, () => getWizardData('2026-09'));
    expect(without.bridgeCoverMonths).toBe(Math.floor(50000 / ((83650 - 3650) / 12)));           // 7
    expect(withRent.bridgeCoverMonths).toBe(Math.floor(50000 / ((83650 - 3650 - 12000) / 12)));  // 8
  });

  it('P11 — when last year\'s CPI was only assumed, the wizard hands over a base the typed CPI re-uplifts', async () => {
    stress.current = chrisStress;
    const d = await frozenAt(SEPT_2026, () => getWizardData('2030-04'));       // plan year 3, no CPI ever entered
    expect(d.planYear).toBe(3);
    expect(d.schedulePrevCpiAssumed).toBe(true);
    expect(d.suggestedSalary).toBe(Math.round(68650 * 1.04 ** 3));              // the assumed 4% for each skipped year
    // Typing 3% for last year must give 68,650 × 1.04² × 1.03 — the figure the audit expected.
    expect(Math.round(d.scheduleSuggestedBase * 1.03)).toBe(Math.round(68650 * 1.04 ** 2 * 1.03));
  });
});
