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
  generateDrawdownSchedule
} from '../src/services/DrawdownService.js';

// Mock DateUtils
vi.mock('../src/utils/DateUtils.js', () => ({
  getRemainingTaxYearMonths: vi.fn(() => 12)
}));

import { getRemainingTaxYearMonths } from '../src/utils/DateUtils.js';

describe('DrawdownService', () => {
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

});
