/**
 * Glidepath Service Tests
 */

import { describe, it, expect } from 'vitest';
import {
  calculateGlidepath,
  calculateAllGlidepaths,
  calculateCumulativeInflation,
  calculateCappedInflation,
  generateGlidepathSchedule,
  checkGlidepathStatus,
  calculateProportionalDraw
} from '../src/services/GlidepathService.js';

describe('GlidepathService', () => {
  const settings = {
    equityMin: 250000,
    bondMin: 200000,
    cashTarget: 50000,
    duration: 35
  };

  describe('calculateGlidepath', () => {
    it('should return base value at year 0 with no inflation', () => {
      expect(calculateGlidepath(100000, 0, 35, 1.0, true)).toBe(100000);
      expect(calculateGlidepath(100000, 0, 35, 1.0, false)).toBe(100000);
    });

    it('should deplete growth funds linearly over duration', () => {
      // At year 17.5 (halfway), should be at 50% of base
      const half = calculateGlidepath(100000, 17.5, 35, 1.0, true);
      expect(half).toBeCloseTo(50000, 0);

      // At year 35, should be 0
      const end = calculateGlidepath(100000, 35, 35, 1.0, true);
      expect(end).toBe(0);
    });

    it('should NOT deplete cash (maintains real value)', () => {
      // Cash at year 17.5 should still be full base (inflation-adjusted)
      const cashMid = calculateGlidepath(50000, 17.5, 35, 1.0, false);
      expect(cashMid).toBe(50000);

      // Cash at year 35 should still be full base
      const cashEnd = calculateGlidepath(50000, 35, 35, 1.0, false);
      expect(cashEnd).toBe(50000);
    });

    it('should apply inflation to growth funds', () => {
      const cumInf = 1.5; // 50% cumulative inflation
      const glidepath = calculateGlidepath(100000, 0, 35, cumInf, true);
      expect(glidepath).toBe(150000); // Inflated by 50%
    });

    it('should apply inflation AND depletion to growth funds', () => {
      // Year 17.5 with 50% inflation: base * 1.5 * 0.5 = 75000
      const cumInf = 1.5;
      const glidepath = calculateGlidepath(100000, 17.5, 35, cumInf, true);
      expect(glidepath).toBeCloseTo(75000, 0);
    });

    it('should apply inflation to cash', () => {
      const cumInf = 1.5;
      const cash = calculateGlidepath(50000, 17.5, 35, cumInf, false);
      expect(cash).toBe(75000); // Just inflated, not depleted
    });
  });

  describe('calculateAllGlidepaths', () => {
    it('should calculate all fund glidepaths at once', () => {
      const result = calculateAllGlidepaths(settings, 0, 1.0);

      expect(result.equity).toBe(250000);
      expect(result.bond).toBe(200000);
      expect(result.cash).toBe(50000);
      expect(result.totalGrowth).toBe(450000);
      expect(result.total).toBe(500000);
    });

    it('should apply depletion to growth but not cash', () => {
      // At halfway point
      const result = calculateAllGlidepaths(settings, 17.5, 1.0);

      expect(result.equity).toBeCloseTo(125000, 0);
      expect(result.bond).toBeCloseTo(100000, 0);
      expect(result.cash).toBe(50000); // Cash unchanged
    });
  });

  describe('calculateCumulativeInflation', () => {
    it('should return 1 for empty array', () => {
      expect(calculateCumulativeInflation([])).toBe(1);
    });

    it('should calculate compound inflation correctly', () => {
      // Two years of 2.5% inflation
      const rates = [0.025, 0.025];
      const cumInf = calculateCumulativeInflation(rates);
      expect(cumInf).toBeCloseTo(1.050625, 4); // 1.025 * 1.025
    });

    it('should handle varying rates', () => {
      const rates = [0.03, 0.02, 0.025];
      const cumInf = calculateCumulativeInflation(rates);
      expect(cumInf).toBeCloseTo(1.03 * 1.02 * 1.025, 4);
    });
  });

  describe('calculateCappedInflation', () => {
    it('should cap individual year increases at 4%', () => {
      const rates = [0.10, 0.05, 0.02]; // 10%, 5%, 2% - first two exceed cap
      const result = calculateCappedInflation(1000, rates, 0.04);

      // Should use 4%, 4%, 2%
      const expected = 1000 * 1.04 * 1.04 * 1.02;
      expect(result).toBeCloseTo(expected, 2);
    });

    it('should not cap rates below the cap', () => {
      const rates = [0.02, 0.03, 0.01];
      const result = calculateCappedInflation(1000, rates, 0.04);
      const expected = 1000 * 1.02 * 1.03 * 1.01;
      expect(result).toBeCloseTo(expected, 2);
    });
  });

  describe('generateGlidepathSchedule', () => {
    it('should generate schedule for all years', () => {
      const schedule = generateGlidepathSchedule(settings, 0.025);

      expect(schedule.length).toBe(settings.duration + 1); // 0 to 35 inclusive
      expect(schedule[0].year).toBe(0);
      expect(schedule[35].year).toBe(35);
    });

    it('should have declining growth minimums', () => {
      const schedule = generateGlidepathSchedule(settings, 0);

      // With no inflation, equityMin should decline linearly
      expect(schedule[0].equityMin).toBe(250000);
      expect(schedule[35].equityMin).toBe(0);
    });

    it('should maintain cash target (inflation-adjusted)', () => {
      const schedule = generateGlidepathSchedule(settings, 0);

      // With no inflation, cash stays constant
      expect(schedule[0].cashTarget).toBe(50000);
      expect(schedule[35].cashTarget).toBe(50000);
    });
  });

  describe('checkGlidepathStatus', () => {
    it('should identify healthy portfolio', () => {
      const funds = { equity: 300000, bond: 250000, cash: 60000 };
      const minimums = { equity: 250000, bond: 200000, cash: 50000 };

      const status = checkGlidepathStatus(funds, minimums);

      expect(status.healthy).toBe(true);
      expect(status.growthHealthy).toBe(true);
      expect(status.equitySurplus).toBe(50000);
      expect(status.bondSurplus).toBe(50000);
      expect(status.cashSurplus).toBe(10000);
    });

    it('should identify deficit portfolio', () => {
      const funds = { equity: 200000, bond: 150000, cash: 40000 };
      const minimums = { equity: 250000, bond: 200000, cash: 50000 };

      const status = checkGlidepathStatus(funds, minimums);

      expect(status.healthy).toBe(false);
      expect(status.growthHealthy).toBe(false);
      expect(status.equitySurplus).toBe(-50000);
      expect(status.growthSurplus).toBe(-100000);
    });

    it('should handle growth-healthy but cash-short', () => {
      const funds = { equity: 300000, bond: 250000, cash: 30000 };
      const minimums = { equity: 250000, bond: 200000, cash: 50000 };

      const status = checkGlidepathStatus(funds, minimums);

      expect(status.healthy).toBe(false); // Cash is short
      expect(status.growthHealthy).toBe(true); // Growth is fine
    });
  });

  describe('calculateProportionalDraw', () => {
    it('should draw proportionally from surpluses', () => {
      // Equal surpluses: 50/50 split
      const draw = calculateProportionalDraw(1000, 50000, 50000);
      expect(draw.fromEquity).toBe(500);
      expect(draw.fromBond).toBe(500);
    });

    it('should handle unequal surpluses', () => {
      // Equity has 75% of surplus
      const draw = calculateProportionalDraw(1000, 75000, 25000);
      expect(draw.fromEquity).toBe(750);
      expect(draw.fromBond).toBe(250);
    });

    it('should return zeros when no surplus', () => {
      const draw = calculateProportionalDraw(1000, 0, 0);
      expect(draw.fromEquity).toBe(0);
      expect(draw.fromBond).toBe(0);
    });

    it('should handle only one fund having surplus', () => {
      const draw = calculateProportionalDraw(1000, 50000, 0);
      expect(draw.fromEquity).toBe(1000);
      expect(draw.fromBond).toBe(0);
    });
  });
});
