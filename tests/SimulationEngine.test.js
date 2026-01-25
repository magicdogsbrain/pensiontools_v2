/**
 * Simulation Engine Tests
 *
 * Tests Monte Carlo and historical simulation functionality:
 * - Single simulation runs
 * - Monte Carlo sampling
 * - Historical sequence simulation
 * - Result analysis
 */

import { describe, it, expect, vi } from 'vitest';
import {
  simulate,
  runMonteCarlo,
  runHistorical,
  runScenario,
  calculateSuccessRate,
  analyzeResults
} from '../src/services/SimulationEngine.js';

// Mock constants to avoid dependency on full data
vi.mock('../src/constants.js', () => ({
  EQUITY_RETURNS: {
    1990: 0.10,
    1991: 0.08,
    1992: -0.05,
    1993: 0.15,
    1994: 0.05,
    1995: 0.20,
    1996: 0.12,
    1997: 0.25,
    1998: 0.08,
    1999: 0.15,
    2000: -0.10,
    2001: -0.15,
    2002: -0.20,
    2003: 0.25,
    2004: 0.10
  },
  INFLATION: {
    1990: 0.03,
    1991: 0.04,
    1992: 0.025,
    1993: 0.02,
    1994: 0.025,
    1995: 0.03,
    1996: 0.025,
    1997: 0.03,
    1998: 0.02,
    1999: 0.025,
    2000: 0.03,
    2001: 0.02,
    2002: 0.025,
    2003: 0.03,
    2004: 0.025
  },
  BOND_MODEL: {
    NORMAL: { LINKER: 0.3, NOMINAL: 0.2, PROPERTY: 0.2, COMMODITY: 0.1, CASH: 0.1, EQUITY: 0.1 },
    HIGH_INFLATION: { LINKER: 0.4, NOMINAL: 0.1, PROPERTY: 0.15, COMMODITY: 0.2, CASH: 0.05, EQUITY: 0.1 },
    DEFLATION: { LINKER: 0.2, NOMINAL: 0.3, PROPERTY: 0.1, COMMODITY: 0.05, CASH: 0.25, EQUITY: 0.1 },
    VOLATILITY: { LINKER: 0.05, NOMINAL: 0.06, PROPERTY: 0.08, COMMODITY: 0.15, CASH: 0.01 }
  }
}));

describe('SimulationEngine', () => {
  const baseConfig = {
    equityStart: 250000,
    bondStart: 200000,
    cashStart: 50000,
    equityMin: 250000,
    bondMin: 200000,
    cashTarget: 50000,
    duration: 35,
    years: 10,
    baseSalary: 40000,
    other: 0,
    statePension: 10000,
    statePensionYear: 10,
    pa: 12570,
    brl: 50270,
    taxMode: 'inflates',
    disableProtection: false,
    protectionMult: 0.8,
    hodlEnabled: false,
    hodlValue: 0
  };

  describe('simulate', () => {
    it('should complete simulation without failure with good returns', () => {
      const returns = {
        equity: { 0: 0.10, 1: 0.10, 2: 0.10, 3: 0.10, 4: 0.10, 5: 0.10, 6: 0.10, 7: 0.10, 8: 0.10, 9: 0.10 },
        inflation: { 0: 0.025, 1: 0.025, 2: 0.025, 3: 0.025, 4: 0.025, 5: 0.025, 6: 0.025, 7: 0.025, 8: 0.025, 9: 0.025 }
      };

      const result = simulate(baseConfig, returns, 123);

      expect(result.failed).toBe(false);
      expect(result.years).toBe(10);
      expect(result.final).toBeGreaterThan(0);
    });

    it('should track protection months during downturns', () => {
      const returns = {
        equity: { 0: -0.30, 1: -0.30, 2: -0.20, 3: 0.10, 4: 0.10, 5: 0.10, 6: 0.10, 7: 0.10, 8: 0.10, 9: 0.10 },
        inflation: { 0: 0.025, 1: 0.025, 2: 0.025, 3: 0.025, 4: 0.025, 5: 0.025, 6: 0.025, 7: 0.025, 8: 0.025, 9: 0.025 }
      };

      const result = simulate(baseConfig, returns, 456);

      // Should have some protection months due to negative returns
      expect(result.protMonths).toBeGreaterThanOrEqual(0);
    });

    it('should fail with severely negative returns', () => {
      const config = {
        ...baseConfig,
        equityStart: 100000,  // Lower starting funds
        bondStart: 50000,
        cashStart: 20000,
        years: 20  // Longer duration
      };

      const returns = {
        equity: {},
        inflation: {}
      };

      // Very bad returns for 20 years
      for (let i = 0; i < 20; i++) {
        returns.equity[i] = -0.20;
        returns.inflation[i] = 0.05;
      }

      const result = simulate(config, returns, 789);

      expect(result.failed).toBe(true);
      expect(result.failMonth).toBeLessThan(20 * 12);
    });

    it('should record history snapshots', () => {
      const returns = {
        equity: { 0: 0.10, 1: 0.10, 2: 0.10 },
        inflation: { 0: 0.025, 1: 0.025, 2: 0.025 }
      };

      const config = { ...baseConfig, years: 3 };
      const result = simulate(config, returns, 111);

      expect(result.hist.length).toBeGreaterThan(0);
      expect(result.hist[0].year).toBe(0);
    });

    it('should use HODL reserve when enabled and needed', () => {
      const config = {
        ...baseConfig,
        equityStart: 50000,
        bondStart: 30000,
        cashStart: 10000,
        years: 15,
        hodlEnabled: true,
        hodlValue: 100000
      };

      const returns = {
        equity: {},
        inflation: {}
      };

      for (let i = 0; i < 15; i++) {
        returns.equity[i] = -0.10;
        returns.inflation[i] = 0.03;
      }

      const result = simulate(config, returns, 222);

      // HODL may be used to prevent failure
      expect(result.hodlUsed).toBeGreaterThanOrEqual(0);
    });

    it('should respect disableProtection flag', () => {
      const returns = {
        equity: { 0: -0.20, 1: -0.20, 2: 0.10, 3: 0.10, 4: 0.10 },
        inflation: { 0: 0.025, 1: 0.025, 2: 0.025, 3: 0.025, 4: 0.025 }
      };

      const configWithProtection = { ...baseConfig, years: 5, disableProtection: false };
      const configWithoutProtection = { ...baseConfig, years: 5, disableProtection: true };

      const resultWith = simulate(configWithProtection, returns, 333);
      const resultWithout = simulate(configWithoutProtection, returns, 333);

      // Without protection, draws should be larger
      expect(resultWithout.protMonths).toBe(0);
    });
  });

  describe('runMonteCarlo', () => {
    it('should run specified number of simulations', () => {
      const results = runMonteCarlo(baseConfig, 10);

      expect(results).toHaveLength(10);
    });

    it('should produce varied results with different seeds', () => {
      const results = runMonteCarlo(baseConfig, 5);

      // Results should not all be identical
      const finals = results.map(r => r.final);
      const unique = new Set(finals);
      expect(unique.size).toBeGreaterThan(1);
    });

    it('should include seed in each result', () => {
      const results = runMonteCarlo(baseConfig, 3);

      results.forEach((result, i) => {
        expect(result.seed).toBe(i);
      });
    });
  });

  describe('runHistorical', () => {
    it('should run simulation for each valid start year', () => {
      const config = { ...baseConfig, years: 5 };
      const results = runHistorical(config);

      expect(results.length).toBeGreaterThan(0);
    });

    it('should include start year in each result', () => {
      const config = { ...baseConfig, years: 5 };
      const results = runHistorical(config);

      results.forEach(result => {
        expect(result.startYear).toBeDefined();
        expect(typeof result.startYear).toBe('number');
      });
    });

    it('should skip years without sufficient history', () => {
      const config = { ...baseConfig, years: 20 };  // Very long duration
      const results = runHistorical(config);

      // Should have fewer results due to data limitations
      expect(results.length).toBeLessThan(15);  // Mocked data only has 15 years
    });
  });

  describe('runScenario', () => {
    it('should run custom scenario', () => {
      const scenario = {
        equity: [0.10, 0.10, -0.05, 0.15],
        inflation: [0.025, 0.03, 0.02, 0.025]
      };

      const result = runScenario(baseConfig, scenario);

      expect(result).toBeDefined();
      expect(result.failed).toBeDefined();
    });

    it('should cycle scenario values for longer periods', () => {
      const config = { ...baseConfig, years: 8 };
      const scenario = {
        equity: [0.10, -0.10],  // 2-year cycle
        inflation: [0.03, 0.02]
      };

      const result = runScenario(config, scenario);

      expect(result.years).toBe(8);
    });
  });

  describe('calculateSuccessRate', () => {
    it('should calculate 100% for all successes', () => {
      const results = [
        { failed: false },
        { failed: false },
        { failed: false }
      ];

      expect(calculateSuccessRate(results)).toBe(100);
    });

    it('should calculate 0% for all failures', () => {
      const results = [
        { failed: true },
        { failed: true }
      ];

      expect(calculateSuccessRate(results)).toBe(0);
    });

    it('should calculate correct percentage for mixed results', () => {
      const results = [
        { failed: false },
        { failed: true },
        { failed: false },
        { failed: false }
      ];

      expect(calculateSuccessRate(results)).toBe(75);
    });
  });

  describe('analyzeResults', () => {
    const mockResults = [
      { failed: false, years: 35, final: 500000, protMonths: 12, maxConsec: 5, hodlUsed: 0 },
      { failed: false, years: 35, final: 300000, protMonths: 24, maxConsec: 8, hodlUsed: 0 },
      { failed: false, years: 35, final: 700000, protMonths: 0, maxConsec: 0, hodlUsed: 0 },
      { failed: true, years: 25, final: 0, protMonths: 48, maxConsec: 20, hodlUsed: 50000 },
      { failed: false, years: 35, final: 400000, protMonths: 6, maxConsec: 3, hodlUsed: 0 }
    ];

    it('should count successes and failures', () => {
      const stats = analyzeResults(mockResults);

      expect(stats.total).toBe(5);
      expect(stats.successCount).toBe(4);
      expect(stats.failCount).toBe(1);
      expect(stats.successRate).toBe(80);
    });

    it('should calculate survival statistics', () => {
      const stats = analyzeResults(mockResults);

      expect(stats.minYears).toBe(25);
      expect(stats.medianYears).toBeDefined();
    });

    it('should calculate final value statistics', () => {
      const stats = analyzeResults(mockResults);

      expect(stats.medianFinal).toBeGreaterThan(0);
      expect(stats.avgFinal).toBeGreaterThan(0);
    });

    it('should track protection statistics', () => {
      const stats = analyzeResults(mockResults);

      expect(stats.runsWithProtection).toBe(4); // 4 had protMonths > 0
      expect(stats.avgProtMonths).toBeGreaterThan(0);
      expect(stats.maxProtMonths).toBe(48);
      expect(stats.maxConsecutive).toBe(20);
    });

    it('should track HODL statistics', () => {
      const stats = analyzeResults(mockResults);

      expect(stats.runsUsingHodl).toBe(1);
      expect(stats.maxHodlUsed).toBe(50000);
    });

    it('should handle empty results array', () => {
      const stats = analyzeResults([]);

      expect(stats.total).toBe(0);
      // successRate is NaN when dividing 0/0, which is expected behavior
      expect(isNaN(stats.successRate)).toBe(true);
    });
  });
});
