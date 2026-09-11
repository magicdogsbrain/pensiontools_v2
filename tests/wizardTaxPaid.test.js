import { describe, it, expect, vi } from 'vitest';
vi.mock('../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));
import { calculateMonthlyBreakdown, buildTaxYearConfig } from '../src/services/TaxYearWizardService.js';
import { calcDecisionPWA } from '../src/services/legacyDecision.js';

// Chris, September 2026: five £7,000 SIPP payments + five Aviva £304.68 received (gross £36,523),
// PAYE already deducted £9,364 (payslip to-date £8,755.13 + Aviva £609.35). Target £87,650 incl. £3,656 DB.
const base = { targetSalary: 87650, brl: 50270, pa: 12570, other: 3656, statePension: 0, isaSavingsAllocation: 0, remainingMonths: 7, grossIncomeToDate: 36523, isTaxEfficient: false };

describe('State Pension in its first year: the monthly payment from its start month, not the partial year spread over twelve (6.11.0)', () => {
  const settings = { equityMin: 27000, bondMin: 40500, cashTarget: 22500, duration: 28, baseSalary: 36000, protectionFactor: 20, recoveryBuffer: 15000, consecutiveLimit: 3, isaDrawdownStrategy: 'minimiseEarlyTax', firstTaxYear: 2026 };
  const ty = { pa: 12570, brl: 50270, hrl: 125140, other: 22000, cpi: 0.031, isTaxEfficient: true, isaSavingsAllocation: 0, isaSavingsUsed: 0, grossIncomeToDate: 9167, confirmedSalary: 36000, yearSetupComplete: true, startMonth: 9, remainingMonths: 7, expectedMonthly: { sipp: { gross: 800 } } };
  // SP starts 9 Nov 2026 at £230/week: the tax year's total is ~£4,829, the monthly payment £996.67
  const spInfo = { amount: 4829, monthly: 4829 / 12, monthlyFull: 996.67, startYm: '2026-11', isReceiving: true, isFirstYear: true };
  const deps = (o = {}) => ({ settings, history: [], allTaxYears: { '26/27': ty }, spInfo: { ...spInfo, ...o }, isaBalance: 25000 });
  it('September: no State Pension yet — the SIPP covers the whole gap', async () => {
    const r = await calcDecisionPWA('2026-09', 27000, 40500, 22500, deps());
    expect(r.statePension).toBe(0);
    expect(r.sippDraw).toBeCloseTo((36000 - 22000) / 12, 0);   // ≈ £1,167 — target less the DB pension only
  });
  it('September: the year\'s tax counts the whole partial-year State Pension, which all falls in the months to come', async () => {
    const r = await calcDecisionPWA('2026-09', 27000, 40500, 22500, deps());
    // SIPP 1,167 × 7 + SP 4,829 (all of it) + DB 22,000 × 7/12 + income to date 9,167 = 35,000 → tax (35,000 − 12,570) × 20% = 4,485 / 7 ≈ £641
    expect(Math.abs(r.monthlyTax - ((1166.67 * 7 + 4829 + 22000 * 7 / 12 + 9167 - 12570) * 0.2) / 7)).toBeLessThan(2);
  });
  it('November: the full monthly payment arrives and the SIPP draw drops', async () => {
    const r = await calcDecisionPWA('2026-11', 27000, 40500, 22500, deps());
    expect(r.statePension).toBeCloseTo(996.67, 1);
    expect(r.sippDraw).toBeCloseTo((36000 - 22000) / 12 - 996.67, 0);   // ≈ £170
  });
  it('a plan without the new fields behaves as before (year total ÷ 12)', async () => {
    const r = await calcDecisionPWA('2026-09', 27000, 40500, 22500, deps({ monthlyFull: undefined, startYm: undefined }));
    expect(r.statePension).toBeCloseTo(4829 / 12, 1);
  });
  it('the wizard shows the monthly payment, or nothing before the start month', () => {
    const base = { targetSalary: 36000, brl: 50270, pa: 12570, other: 22000, statePension: 4829, statePensionMonthlyFull: 996.67, spStartYm: '2026-11', isaSavingsAllocation: 0, remainingMonths: 7, grossIncomeToDate: 9167, isTaxEfficient: false };
    expect(calculateMonthlyBreakdown({ ...base, startYm: '2026-09' }).statePension.gross).toBe(0);
    expect(calculateMonthlyBreakdown({ ...base, startYm: '2026-11' }).statePension.gross).toBeCloseTo(996.67, 2);
    expect(calculateMonthlyBreakdown({ ...base, statePensionMonthlyFull: null }).statePension.gross).toBeCloseTo(4829 / 12, 2);
  });
  it('the year\'s tax still counts the State Pension that arrives later in the year', () => {
    const b = calculateMonthlyBreakdown({ targetSalary: 24000, brl: 50270, pa: 12570, other: 0, statePension: 4829, statePensionMonthlyFull: 996.67, spStartYm: '2026-11', startYm: '2026-09', isaSavingsAllocation: 0, remainingMonths: 7, grossIncomeToDate: 0, isTaxEfficient: false });
    expect(b.sipp.gross).toBeCloseTo(2000, 0);                       // before November the SIPP pays the whole £2,000
    expect(b.statePension.gross).toBe(0);
    expect(Math.abs(b.totalTax - ((2000 * 7 + 4829 - 12570) * 0.2) / 7)).toBeLessThan(1);   // ≈ £179, not £41
  });
});

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
    // Drawing the full target from the SIPP IS the "inefficient" comparison — no saving to report (6.4.2)
    expect(withPaid.taxSavedMonthly).toBe(0);
  });
});
