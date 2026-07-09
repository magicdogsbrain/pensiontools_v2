import { describe, it, expect } from 'vitest';
import {
  cumulativeInflation,
  cappedInflation,
  DEFAULT_CPI,
  OTHER_INCOME_CAP
} from '../src/services/InflationModel.js';

describe('InflationModel', () => {
  describe('cumulativeInflation', () => {
    it('is 1 for an empty series', () => {
      expect(cumulativeInflation([])).toBe(1);
    });
    it('compounds per-year rates', () => {
      expect(cumulativeInflation([0.02, 0.03])).toBeCloseTo(1.02 * 1.03, 9);
    });
  });

  describe('cappedInflation', () => {
    it('inflates a base by the series', () => {
      expect(cappedInflation(1000, [0.02, 0.03])).toBeCloseTo(1000 * 1.02 * 1.03, 6);
    });
    it('caps each year at the default 4%', () => {
      // 8% is capped to 4%
      expect(cappedInflation(1000, [0.08])).toBeCloseTo(1040, 6);
      expect(OTHER_INCOME_CAP).toBe(0.04);
    });
    it('respects a custom cap', () => {
      expect(cappedInflation(1000, [0.08], 0.02)).toBeCloseTo(1020, 6);
    });
    it('returns the base for an empty series', () => {
      expect(cappedInflation(500, [])).toBe(500);
    });
  });

  it('exposes the 2.5% default CPI', () => {
    expect(DEFAULT_CPI).toBe(0.025);
  });
});
