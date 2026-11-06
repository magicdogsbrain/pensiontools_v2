/**
 * ProtectionStrategy — the shared downturn-protection decision used by both engines.
 */
import { describe, it, expect } from 'vitest';
import { assessProtection, growthVsGlide, diversifierGlidepath, isBelow, pennies, PROTECTION_DEFAULTS } from '../src/services/ProtectionStrategy.js';
import { calculateGlidepath } from '../src/services/GlidepathService.js';

describe('assessProtection', () => {
  const P = { consecutiveLimit: 3, recoveryBuffer: 10000 };

  it('does not enter when growth is at/above the minimum', () => {
    expect(assessProtection({ totalGrowth: 100000, minGrowth: 100000, consecBelowGlide: 5, wasInProtection: false, ...P })).toBe(false);
    expect(assessProtection({ totalGrowth: 120000, minGrowth: 100000, consecBelowGlide: 9, wasInProtection: false, ...P })).toBe(false);
  });

  it('enters when below the glidepaths for enough consecutive months (incl. this month)', () => {
    // consecBelowGlide + 1 must reach consecutiveLimit (3): 2 prior months below + this month.
    expect(assessProtection({ totalGrowth: 99000, minGrowth: 100000, consecBelowGlide: 2, wasInProtection: false, ...P })).toBe(true);
    // Only 1 prior month below → 1+1=2 < 3 → not yet.
    expect(assessProtection({ totalGrowth: 99000, minGrowth: 100000, consecBelowGlide: 1, wasInProtection: false, ...P })).toBe(false);
  });

  it('stays in protection until growth recovers above min + recoveryBuffer', () => {
    // Still within the buffer band → stays.
    expect(assessProtection({ totalGrowth: 105000, minGrowth: 100000, consecBelowGlide: 0, wasInProtection: true, ...P })).toBe(true);
    // Exactly at min + buffer → stays (<=).
    expect(assessProtection({ totalGrowth: 110000, minGrowth: 100000, consecBelowGlide: 0, wasInProtection: true, ...P })).toBe(true);
    // Above min + buffer → exits.
    expect(assessProtection({ totalGrowth: 110001, minGrowth: 100000, consecBelowGlide: 0, wasInProtection: true, ...P })).toBe(false);
  });

  it('applies sensible defaults', () => {
    expect(PROTECTION_DEFAULTS.CONSECUTIVE_LIMIT).toBe(3);
    expect(PROTECTION_DEFAULTS.RECOVERY_BUFFER).toBe(15000); // single source: DRAWDOWN_DEFAULTS (was 10000 while saved settings carried 15000)
    // With defaults: below the glidepaths, 2 prior months below → enters.
    expect(assessProtection({ totalGrowth: 99000, minGrowth: 100000, consecBelowGlide: 2, wasInProtection: false })).toBe(true);
  });
});

describe('whole-penny comparison (6.15.0)', () => {
  it('rounds both sides to the penny before comparing', () => {
    expect(pennies(100.004)).toBe(10000);
    expect(pennies(100.006)).toBe(10001);
    expect(isBelow(100, 100)).toBe(false);
    expect(isBelow(100 - 1e-10, 100)).toBe(false);   // rounding error is not "below"
    expect(isBelow(99.99, 100)).toBe(true);
  });

  it('growthVsGlide.below is the penny comparison', () => {
    expect(growthVsGlide({ equity: 0.3, bond: 0, equityGlide: 0.1, bondGlide: 0.2 }).below).toBe(false);   // 0.3 < 0.1 + 0.2 as raw numbers
    expect(growthVsGlide({ equity: 50, bond: 49.99, equityGlide: 50, bondGlide: 50 }).below).toBe(true);
  });

  it('assessProtection enters and leaves on penny lines', () => {
    const P = { consecutiveLimit: 3, recoveryBuffer: 10000 };
    expect(assessProtection({ totalGrowth: 100000 - 1e-9, minGrowth: 100000, consecBelowGlide: 5, wasInProtection: false, ...P })).toBe(false);
    expect(assessProtection({ totalGrowth: 99999.99, minGrowth: 100000, consecBelowGlide: 2, wasInProtection: false, ...P })).toBe(true);
    expect(assessProtection({ totalGrowth: 110000 + 1e-9, minGrowth: 100000, consecBelowGlide: 0, wasInProtection: true, ...P })).toBe(true);
    expect(assessProtection({ totalGrowth: 110000.01, minGrowth: 100000, consecBelowGlide: 0, wasInProtection: true, ...P })).toBe(false);
  });
});

describe('diversifierGlidepath (6.15.0): the sleeve moves like shares and bonds', () => {
  it('is the growth-fund glidepath of the starting value', () => {
    for (const [year, cumInf] of [[0, 1], [7, 1.2], [29, 2.1], [30, 2.2], [35, 2.5]]) {
      expect(diversifierGlidepath(60000, year, 30, cumInf)).toBe(calculateGlidepath(60000, year, 30, cumInf, true));
    }
    expect(diversifierGlidepath(60000, 15, 30, 1.5)).toBeCloseTo(45000, 9);   // 60,000 × 1.5 × half the plan left
    expect(diversifierGlidepath(0, 5, 30, 1.1)).toBe(0);
  });
});
