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
