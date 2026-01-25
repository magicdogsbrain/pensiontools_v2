/**
 * Drawdown Service Tests
 *
 * Tests the new unified ISA top-up logic:
 * - SIPP + Other capped at BRL when ISA available
 * - Tax-efficient mode (determined at year level)
 * - Tax boost logic
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  calculateSIPPDraw,
  calculateDrawdownRecommendation,
  generateDrawdownSchedule
} from '../src/services/DrawdownService.js';

// Mock DateUtils
vi.mock('../src/utils/DateUtils.js', () => ({
  getRemainingTaxYearMonths: vi.fn(() => 12)
}));

import { getRemainingTaxYearMonths } from '../src/utils/DateUtils.js';

describe('DrawdownService', () => {
  describe('calculateSIPPDraw', () => {
    const baseParams = {
      baseSalary: 40000,
      cumulativeInflation: 1.0,
      yearlyInflation: [],
      other: 5000,
      statePension: 0,
      statePensionYear: 12,
      yearNumber: 0,
      pa: 12570,
      brl: 50270,
      hrl: 125140,
      taxMode: 'inflates'
    };

    it('should calculate basic SIPP draw to reach target', () => {
      const result = calculateSIPPDraw(baseParams);

      // Target is 40000, other is 5000, so SIPP needed is 35000
      expect(result.annualSippDraw).toBe(35000);
      expect(result.monthlySippDraw).toBeCloseTo(35000 / 12, 2);
    });

    it('should cap SIPP at BRL when target would exceed it', () => {
      const params = {
        ...baseParams,
        baseSalary: 60000,  // Higher target
        other: 10000
      };

      const result = calculateSIPPDraw(params);

      // Target is 60000, other is 10000
      // SIPP to BRL = 50270 - 10000 = 40270
      // SIPP to target = 60000 - 10000 = 50000
      // Should take min = 40270
      expect(result.annualSippDraw).toBe(40270);
    });

    it('should include state pension after specified year', () => {
      const params = {
        ...baseParams,
        statePension: 10000,
        statePensionYear: 10,
        yearNumber: 15  // Past state pension year
      };

      const result = calculateSIPPDraw(params);

      // Fixed income = other (5000) + state (10000) = 15000
      // SIPP to target = 40000 - 15000 = 25000
      expect(result.fixedIncome).toBe(15000);
      expect(result.annualSippDraw).toBe(25000);
    });

    it('should NOT include state pension before specified year', () => {
      const params = {
        ...baseParams,
        statePension: 10000,
        statePensionYear: 10,
        yearNumber: 5  // Before state pension year
      };

      const result = calculateSIPPDraw(params);

      // Fixed income = other (5000) only
      expect(result.fixedIncome).toBe(5000);
      expect(result.annualSippDraw).toBe(35000);
    });

    it('should adjust thresholds for inflation when not frozen', () => {
      const params = {
        ...baseParams,
        cumulativeInflation: 1.5,
        taxMode: 'inflates'
      };

      const result = calculateSIPPDraw(params);

      expect(result.pa).toBe(12570 * 1.5);
      expect(result.brl).toBe(50270 * 1.5);
      expect(result.targetGross).toBe(40000 * 1.5);
    });

    it('should NOT adjust thresholds when frozen', () => {
      const params = {
        ...baseParams,
        cumulativeInflation: 1.5,
        taxMode: 'frozen'
      };

      const result = calculateSIPPDraw(params);

      expect(result.pa).toBe(12570);
      expect(result.brl).toBe(50270);
    });
  });

  describe('calculateDrawdownRecommendation', () => {
    const baseParams = {
      equity: 300000,
      bond: 200000,
      cash: 50000,
      isaBalance: 0,
      baseSalary: 40000,
      cumulativeInflation: 1.0,
      yearlyInflation: [],
      other: 0,
      statePension: 0,
      statePensionYear: 12,
      yearNumber: 0,
      pa: 12570,
      brl: 50270,
      hrl: 125140,
      taxMode: 'inflates',
      currentDate: new Date('2024-04-01'),
      taxYearHistory: [],
      inProtection: false,
      protectionFactor: 20,
      adjEquityMin: 250000,
      adjBondMin: 200000
    };

    beforeEach(() => {
      vi.mocked(getRemainingTaxYearMonths).mockReturnValue(12);
    });

    it('should recommend tax-efficient mode when no ISA top-up needed', () => {
      const result = calculateDrawdownRecommendation(baseParams);

      expect(result.mode).toBe('tax-efficient');
      expect(result.monthlyIsa).toBe(0);
      expect(result.isaUsedForTopUp).toBe(false);
    });

    it('should apply protection factor when in protection mode', () => {
      const params = {
        ...baseParams,
        inProtection: true,
        protectionFactor: 20
      };

      const normalResult = calculateDrawdownRecommendation(baseParams);
      const protectedResult = calculateDrawdownRecommendation(params);

      // Protected draw should be 80% of normal
      expect(protectedResult.monthlySipp).toBeCloseTo(normalResult.monthlySipp * 0.8, 0);
    });

    it('should track remaining tax year months correctly', () => {
      vi.mocked(getRemainingTaxYearMonths).mockReturnValue(6);

      const params = {
        ...baseParams,
        baseSalary: 55000,
        isaBalance: 3000
      };

      const result = calculateDrawdownRecommendation(params);

      expect(result.remainingMonths).toBe(6);
    });

    it('should calculate tax info correctly', () => {
      const result = calculateDrawdownRecommendation(baseParams);

      expect(result.taxInfo).toBeDefined();
      expect(result.taxInfo.pa).toBe(12570);
      expect(result.taxInfo.brl).toBe(50270);
      expect(result.taxInfo.annualTaxable).toBeGreaterThan(0);
    });

    it('should handle state pension income', () => {
      const params = {
        ...baseParams,
        statePension: 10000,
        statePensionYear: 0,  // Already receiving
        yearNumber: 5
      };

      const result = calculateDrawdownRecommendation(params);

      expect(result.monthlyState).toBeGreaterThan(0);
    });
  });

  describe('generateDrawdownSchedule', () => {
    const settings = {
      baseSalary: 40000,
      other: 5000,
      statePension: 10000,
      statePensionYear: 10,
      pa: 12570,
      brl: 50270,
      hrl: 125140,
      taxMode: 'inflates'
    };

    it('should generate schedule for specified duration', () => {
      const schedule = generateDrawdownSchedule(settings, 30, 0.025);

      expect(schedule.length).toBe(31); // 0 to 30 inclusive
      expect(schedule[0].year).toBe(0);
      expect(schedule[30].year).toBe(30);
    });

    it('should show increasing values with inflation', () => {
      const schedule = generateDrawdownSchedule(settings, 10, 0.03);

      expect(schedule[10].other).toBeGreaterThan(schedule[0].other);
      expect(schedule[10].brl).toBeGreaterThan(schedule[0].brl);
    });

    it('should include state pension after specified year', () => {
      const schedule = generateDrawdownSchedule(settings, 15, 0.025);

      expect(schedule[5].statePension).toBe(0);
      expect(schedule[12].statePension).toBeGreaterThan(0);
    });

    it('should calculate net income correctly', () => {
      const schedule = generateDrawdownSchedule(settings, 5, 0);

      for (const entry of schedule) {
        expect(entry.netIncome).toBe(entry.totalTaxable - entry.tax);
      }
    });
  });

  describe('Tax Boost Logic', () => {
    beforeEach(() => {
      vi.mocked(getRemainingTaxYearMonths).mockReturnValue(6);
    });

    it('should not allow boost when in protection mode', () => {
      const params = {
        equity: 300000,
        bond: 200000,
        cash: 50000,
        isaBalance: 0,
        baseSalary: 40000,
        cumulativeInflation: 1.0,
        yearlyInflation: [],
        other: 0,
        statePension: 0,
        statePensionYear: 12,
        yearNumber: 0,
        pa: 12570,
        brl: 50270,
        hrl: 125140,
        taxMode: 'inflates',
        currentDate: new Date('2024-10-01'),
        taxYearHistory: [],
        inProtection: true,
        protectionFactor: 20,
        adjEquityMin: 250000,
        adjBondMin: 200000
      };

      const result = calculateDrawdownRecommendation(params);

      expect(result.boostAmount).toBe(0);
      expect(result.boostReason).toContain('protection');
    });

    it('should calculate boost from protection shortfall', () => {
      const params = {
        equity: 350000,
        bond: 250000,
        cash: 50000,
        isaBalance: 0,
        baseSalary: 40000,
        cumulativeInflation: 1.0,
        yearlyInflation: [],
        other: 0,
        statePension: 0,
        statePensionYear: 12,
        yearNumber: 0,
        pa: 12570,
        brl: 50270,
        hrl: 125140,
        taxMode: 'inflates',
        currentDate: new Date('2024-10-01'),
        taxYearHistory: [
          { sipp: 2000, stdSipp: 2500, inProtection: true, boostAmount: 0 },
          { sipp: 2000, stdSipp: 2500, inProtection: true, boostAmount: 0 },
          { sipp: 2000, stdSipp: 2500, inProtection: true, boostAmount: 0 }
        ],
        inProtection: false,  // Now out of protection
        protectionFactor: 20,
        adjEquityMin: 250000,
        adjBondMin: 200000
      };

      const result = calculateDrawdownRecommendation(params);

      // Should have some boost amount (shortfall was 3 months * 500 = 1500)
      expect(result.taxBoostEligible).toBe(true);
    });
  });
});
