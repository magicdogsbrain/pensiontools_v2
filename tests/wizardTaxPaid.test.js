import { describe, it, expect, vi } from 'vitest';
vi.mock('../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));
import { calculateMonthlyBreakdown, buildTaxYearConfig } from '../src/services/TaxYearWizardService.js';
import { calcDecisionPWA } from '../src/services/legacyDecision.js';

// Chris, September 2026: five £7,000 SIPP payments + five Aviva £304.68 received (gross £36,523),
// PAYE already deducted £9,364 (payslip to-date £8,755.13 + Aviva £609.35). Target £87,650 incl. £3,656 DB.
const base = { targetSalary: 87650, brl: 50270, pa: 12570, other: 3656, statePension: 0, isaSavingsAllocation: 0, remainingMonths: 7, grossIncomeToDate: 36523, isTaxEfficient: false };

describe('mid-year wizard: tax already paid (6.4.1)', () => {
  it('without it, the old assumption stands (earlier income taxed on its own bands)', () => {
    const b = calculateMonthlyBreakdown(base);
    expect(Math.round(b.sipp.gross)).toBe(7000);
    // tax(87,650 total) − tax(36,523 alone) over 7 months ≈ £2,309 — overstated for someone under PAYE all year
    expect(b.totalTax).toBeGreaterThan(2200);
  });
  it('with it, the tax to come is the year\'s total less what is paid — matches the payslips', () => {
    const b = calculateMonthlyBreakdown({ ...base, taxPaidToDate: 9364 });
    expect(Math.round(b.sipp.gross)).toBe(7000);
    // annual tax on £87,650 = 7,540 + 40% × 37,380 = 22,492; less 9,364 paid = 13,128 over 7 months ≈ £1,875
    expect(Math.abs(b.totalTax - (22492 - 9364) / 7)).toBeLessThan(2);
    expect(Math.abs(b.totalNet - ((87650 / 12) - (22492 - 9364) / 7))).toBeLessThan(2);
  });
  it('a full year ignores the field; a blank string means unknown', () => {
    const full = { ...base, remainingMonths: 12, grossIncomeToDate: 0 };
    expect(calculateMonthlyBreakdown({ ...full, taxPaidToDate: 5000 }).totalTax).toBe(calculateMonthlyBreakdown(full).totalTax);
    expect(calculateMonthlyBreakdown({ ...base, taxPaidToDate: '' }).totalTax).toBe(calculateMonthlyBreakdown(base).totalTax);
  });
  it('is saved on the tax-year config (null when blank)', () => {
    expect(buildTaxYearConfig({ ...base, taxPaidToDate: 9364, startMonth: 9, confirmedSalary: 87650 }).taxPaidToDate).toBe(9364);
    expect(buildTaxYearConfig({ ...base, taxPaidToDate: '', startMonth: 9, confirmedSalary: 87650 }).taxPaidToDate).toBeNull();
    expect(buildTaxYearConfig({ ...base, startMonth: 9, confirmedSalary: 87650 }).taxPaidToDate).toBeNull();
  });
  it('the monthly engine uses the same figure for its tax', async () => {
    const settings = { equityMin: 0, bondMin: 900000, cashTarget: 220000, duration: 35, baseSalary: 87650, protectionFactor: 20, recoveryBuffer: 15000, consecutiveLimit: 3, isaDrawdownStrategy: 'hold', firstTaxYear: 2027 };
    const ty = (o) => ({ pa: 12570, brl: 50270, hrl: 125140, other: 3656, cpi: 0.031, isTaxEfficient: false, isaSavingsAllocation: 0, isaSavingsUsed: 0, grossIncomeToDate: 36523, confirmedSalary: 87650, yearSetupComplete: true, startMonth: 9, remainingMonths: 7, expectedMonthly: { sipp: { gross: 7000 } }, ...o });
    const deps = (o) => ({ settings, history: [], allTaxYears: { '26/27': ty(o) }, spInfo: { amount: 0, isReceiving: false }, isaBalance: 60000 });
    const without = await calcDecisionPWA('2026-09', 0, 952960, 226461, deps({}));
    const withPaid = await calcDecisionPWA('2026-09', 0, 952960, 226461, deps({ taxPaidToDate: 9364 }));
    expect(Math.round(withPaid.sippDraw)).toBe(Math.round(without.sippDraw));   // the gross draw is unaffected
    expect(withPaid.monthlyTax).toBeLessThan(without.monthlyTax);
    expect(Math.abs(withPaid.monthlyTax - (22492 - 9364) / 7)).toBeLessThan(2);
    expect(withPaid.bridgeYear).toBe(true);
  });
});
