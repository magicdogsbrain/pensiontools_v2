/**
 * Tax Calculator Tests
 */

import { describe, it, expect } from 'vitest';
import {
  calculateTax,
  grossToNet,
  calculateBRLHeadroom
} from '../src/services/TaxCalculator.js';

describe('TaxCalculator', () => {
  // Standard tax parameters for 2024/25
  const PA = 12570;
  const BRL = 50270;
  const HRL = 125140;

  describe('calculateTax', () => {
    it('should return 0 for income below personal allowance', () => {
      expect(calculateTax(10000, PA, BRL)).toBe(0);
      expect(calculateTax(12570, PA, BRL)).toBe(0);
    });

    it('should calculate basic rate tax correctly', () => {
      // £20,000 gross = £20,000 - £12,570 = £7,430 taxable at 20%
      const tax = calculateTax(20000, PA, BRL);
      expect(tax).toBeCloseTo(1486, 0); // £7,430 * 0.20 = £1,486
    });

    it('should calculate tax at BRL boundary correctly', () => {
      // At exactly BRL, all taxable income is at basic rate
      const taxable = BRL - PA; // £37,700
      const expectedTax = taxable * 0.20; // £7,540
      expect(calculateTax(BRL, PA, BRL)).toBeCloseTo(expectedTax, 0);
    });

    it('should calculate higher rate tax correctly', () => {
      // £60,000 gross
      // Basic rate: £50,270 - £12,570 = £37,700 at 20% = £7,540
      // Higher rate: £60,000 - £50,270 = £9,730 at 40% = £3,892
      // Total: £11,432
      const tax = calculateTax(60000, PA, BRL);
      expect(tax).toBeCloseTo(11432, 0);
    });

    it('should apply PA taper for income over £100,000', () => {
      // At £110,000, PA is reduced by (£110,000 - £100,000) * 0.5 = £5,000
      // Effective PA = £12,570 - £5,000 = £7,570
      const tax = calculateTax(110000, PA, BRL, HRL);
      // More tax due to reduced PA
      expect(tax).toBeGreaterThan(calculateTax(100000, PA, BRL, HRL));
    });

    it('should eliminate PA completely at £125,140+', () => {
      // PA fully tapered away
      const tax125140 = calculateTax(125140, PA, BRL, HRL);
      const tax130000 = calculateTax(130000, PA, BRL, HRL);
      // The difference should only be 45% (additional rate) on the extra £4,860
      const diff = tax130000 - tax125140;
      expect(diff).toBeCloseTo(4860 * 0.45, 0);
    });

    it('should handle zero income', () => {
      expect(calculateTax(0, PA, BRL)).toBe(0);
    });

    it('should handle negative income gracefully', () => {
      expect(calculateTax(-1000, PA, BRL)).toBe(0);
    });
  });

  describe('grossToNet', () => {
    it('should return full amount for income below PA', () => {
      expect(grossToNet(10000, PA, BRL)).toBe(10000);
    });

    it('should calculate net correctly at various levels', () => {
      // £30,000 gross, tax = (30000-12570)*0.2 = £3,486, net = £26,514
      expect(grossToNet(30000, PA, BRL)).toBeCloseTo(26514, 0);
    });

    it('should be consistent with calculateTax', () => {
      const gross = 45000;
      const tax = calculateTax(gross, PA, BRL);
      const net = grossToNet(gross, PA, BRL);
      expect(net).toBeCloseTo(gross - tax, 2);
    });
  });

  describe('calculateBRLHeadroom', () => {
    it('should calculate remaining headroom correctly', () => {
      expect(calculateBRLHeadroom(40000, BRL)).toBe(10270);
      expect(calculateBRLHeadroom(50270, BRL)).toBe(0);
    });

    it('should return 0 when already at or above BRL', () => {
      expect(calculateBRLHeadroom(60000, BRL)).toBe(0);
    });
  });
});
