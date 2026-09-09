import { describe, it, expect, vi } from 'vitest';
vi.mock('../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));
import { calculateMonthlyBreakdown, buildTaxYearConfig } from '../src/services/TaxYearWizardService.js';
import { calcDecisionPWA } from '../src/services/legacyDecision.js';

// Alex, September 2026: five £7,000 SIPP payments + five DB scheme £281.40 received (gross £33,907),
// PAYE already deducted £8,475 (payslip to-date £7,912.40 + DB scheme £562.80). Target £81,375 incl. £3,377 DB.
const base = { targetSalary: 81375, brl: 50270, pa: 12570, other: 3377, statePension: 0, isaSavingsAllocation: 0, remainingMonths: 7, grossIncomeToDate: 33907, isTaxEfficient: false };

describe('mid-year wizard: tax already paid (6.4.1)', () => {
  it('without it, the old assumption stands (earlier income taxed on its own bands)', () => {
    const b = calculateMonthlyBreakdown(base);
    expect(Math.round(b.sipp.gross)).toBe(7000);
    // tax(81,375 total) − tax(33,907 alone) over 7 months ≈ £2,309 — overstated for someone under PAYE all year
    expect(b.totalTax).toBeGreaterThan(2200);
  });
  it('with it, the tax to come is the year\'s total less what is paid — matches the payslips', () => {
    const b = calculateMonthlyBreakdown({ ...base, taxPaidToDate: 8475 });
    expect(Math.round(b.sipp.gross)).toBe(7000);
    // annual tax on £81,375 = 7,540 + 40% × 37,380 = 22,492; less 8,475 paid = 13,128 over 7 months ≈ £1,875
    expect(Math.abs(b.totalTax - (22492 - 8475) / 7)).toBeLessThan(2);
    expect(Math.abs(b.totalNet - ((81375 / 12) - (22492 - 8475) / 7))).toBeLessThan(2);
  });
  it('a full year ignores the field; a blank string means unknown', () => {
    const full = { ...base, remainingMonths: 12, grossIncomeToDate: 0 };
    expect(calculateMonthlyBreakdown({ ...full, taxPaidToDate: 5000 }).totalTax).toBe(calculateMonthlyBreakdown(full).totalTax);
    expect(calculateMonthlyBreakdown({ ...base, taxPaidToDate: '' }).totalTax).toBe(calculateMonthlyBreakdown(base).totalTax);
  });
  it('is saved on the tax-year config (null when blank)', () => {
    expect(buildTaxYearConfig({ ...base, taxPaidToDate: 8475, startMonth: 9, confirmedSalary: 81375 }).taxPaidToDate).toBe(8475);
    expect(buildTaxYearConfig({ ...base, taxPaidToDate: '', startMonth: 9, confirmedSalary: 81375 }).taxPaidToDate).toBeNull();
    expect(buildTaxYearConfig({ ...base, startMonth: 9, confirmedSalary: 81375 }).taxPaidToDate).toBeNull();
  });
  it('the monthly engine uses the same figure for its tax', async () => {
    const settings = { equityMin: 0, bondMin: 900000, cashTarget: 220000, duration: 35, baseSalary: 81375, protectionFactor: 20, recoveryBuffer: 15000, consecutiveLimit: 3, isaDrawdownStrategy: 'hold', firstTaxYear: 2027 };
    const ty = (o) => ({ pa: 12570, brl: 50270, hrl: 125140, other: 3377, cpi: 0.031, isTaxEfficient: false, isaSavingsAllocation: 0, isaSavingsUsed: 0, grossIncomeToDate: 33907, confirmedSalary: 81375, yearSetupComplete: true, startMonth: 9, remainingMonths: 7, expectedMonthly: { sipp: { gross: 7000 } }, ...o });
    const deps = (o) => ({ settings, history: [], allTaxYears: { '26/27': ty(o) }, spInfo: { amount: 0, isReceiving: false }, isaBalance: 60000 });
    const without = await calcDecisionPWA('2026-09', 0, 912960, 216461, deps({}));
    const withPaid = await calcDecisionPWA('2026-09', 0, 912960, 216461, deps({ taxPaidToDate: 8475 }));
    expect(Math.round(withPaid.sippDraw)).toBe(Math.round(without.sippDraw));   // the gross draw is unaffected
    expect(withPaid.monthlyTax).toBeLessThan(without.monthlyTax);
    expect(Math.abs(withPaid.monthlyTax - (22492 - 8475) / 7)).toBeLessThan(2);
    expect(withPaid.bridgeYear).toBe(true);
    // Drawing the full target from the SIPP IS the "inefficient" comparison — no saving to report (6.4.2)
    expect(withPaid.taxSavedMonthly).toBe(0);
  });
});
