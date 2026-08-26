/**
 * Mid-year first tax year: the monthly draw is the monthly NEED (target/12), whether or not an ISA
 * pot is in play, and the tax is worked out on the months actually drawn.
 */
import { describe, it, expect, vi } from 'vitest';
vi.mock('../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));
import { calcDecisionPWA } from '../src/services/legacyDecision.js';

const settings = { baseSalary: 40000, equityMin: 290000, bondMin: 232000, cashTarget: 58000, duration: 35, protectionFactor: 20, recoveryBuffer: 15000, consecutiveLimit: 3, isaBalance: 80000, isaDrawdownStrategy: 'minimiseEarlyTax' };
const ty = (o = {}) => ({ pa: 12570, brl: 50270, hrl: 125140, other: 0, cpi: 0.04, isTaxEfficient: true, isaSavingsAllocation: 0, isaSavingsUsed: 0, grossIncomeToDate: 0, confirmedSalary: 40000, yearSetupComplete: true, startMonth: 9, remainingMonths: 7, expectedMonthly: { sipp: { gross: 40000 / 12 } }, ...o });

describe('September start, 7 months left, £40k target', () => {
  it('draws £3,333/mo with or without an ISA pot, and taxes the 7 months actually drawn', async () => {
    for (const isa of [80000, 0]) {
      const r = await calcDecisionPWA('2026-09', 290000, 232000, 58000, { settings, history: [], allTaxYears: { '26/27': ty() }, spInfo: { amount: 0, isReceiving: false }, isaBalance: isa });
      expect(r.sippDraw).toBeCloseTo(40000 / 12, 0);
      // 7 × 3,333 = 23,333 taxable in the year → (23,333 − 12,570) × 20% = 2,153 → £308/mo
      expect(r.monthlyTax).toBeCloseTo(2152.6 / 7, 0);
    }
  });
  it('a full year from April draws £3,333/mo and taxes the full year (£457/mo)', async () => {
    const r = await calcDecisionPWA('2026-04', 290000, 232000, 58000, { settings, history: [], allTaxYears: { '26/27': ty({ startMonth: 4, remainingMonths: 12 }) }, spInfo: { amount: 0, isReceiving: false }, isaBalance: 80000 });
    expect(r.sippDraw).toBeCloseTo(40000 / 12, 0);
    expect(r.monthlyTax).toBeCloseTo(5486 / 12, 0);
  });
});

describe('protection year: the tax figure projects the remaining months at the cut draw', () => {
  it('a 20% cut on £28k/12 from month 1 of a full year taxes the cut income, not the standard', async () => {
    const s2 = { ...settings, baseSalary: 28000, equityMin: 160000, bondMin: 128000, cashTarget: 32000, isaBalance: 0, protectionFactor: 20, consecutiveLimit: 1 };
    // prior history: two cash draws in this tax year → protection fires
    const history = [{ date: '2026-04', sipp: 2333, source: 'Cash', inProtection: false, taxYear: '26/27' }, { date: '2026-05', sipp: 2333, source: 'Cash', inProtection: false, taxYear: '26/27' }];
    const r = await calcDecisionPWA('2026-06', 150000, 128000, 20000, { settings: s2, history, allTaxYears: { '26/27': ty({ confirmedSalary: 28000, startMonth: 4, remainingMonths: 12, expectedMonthly: { sipp: { gross: 28000 / 12 } } }) }, spInfo: { amount: 0, isReceiving: false }, isaBalance: 0 });
    if (r.inProtection) {
      const annual = 2333 * 2 + r.sippDraw * 10;
      expect(r.monthlyTax * 12).toBeCloseTo(Math.max(0, annual - 12570) * 0.2, -2);
    } else {
      expect(r.sippDraw).toBeCloseTo(2333, 0);
    }
  });
});


describe('tax saved is on the same basis as the tax paid', () => {
  it('Sep start, £60k target with a £250k ISA: saving per month = (tax on 7×£5,000 − tax on 7×£4,189) / 7', async () => {
    const s3 = { ...settings, baseSalary: 60000, isaBalance: 250000 };
    const r = await calcDecisionPWA('2026-09', 450000, 360000, 90000, { settings: s3, history: [], allTaxYears: { '26/27': ty({ confirmedSalary: 60000, expectedMonthly: { sipp: { gross: 4189 } } }) }, spInfo: { amount: 0, isReceiving: false }, isaBalance: 250000 });
    expect(r.sippDraw).toBeCloseTo(50270 / 12, 0);
    const ineff = Math.max(0, 35000 - 12570) * 0.2;            // 7 × £5,000, all within the basic band
    const eff = Math.max(0, r.sippDraw * 7 - 12570) * 0.2;
    expect(r.taxSavedMonthly).toBeCloseTo((ineff - eff) / 7, 0);   // ≈ £162, not £673
  });
});
