/**
 * ProtectionStrategy — the shared downturn-protection decision used by both engines.
 */
import { describe, it, expect } from 'vitest';
import { assessProtection, PROTECTION_DEFAULTS } from '../src/services/ProtectionStrategy.js';

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
