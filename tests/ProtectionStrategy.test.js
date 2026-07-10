/**
 * ProtectionStrategy — the shared downturn-protection decision used by both engines.
 */
import { describe, it, expect } from 'vitest';
import { assessProtection, PROTECTION_DEFAULTS } from '../src/services/ProtectionStrategy.js';

describe('assessProtection', () => {
  const P = { consecutiveLimit: 3, recoveryBuffer: 10000 };

  it('does not enter when growth is at/above the minimum', () => {
    expect(assessProtection({ totalGrowth: 100000, minGrowth: 100000, consecCashDraws: 5, wasInProtection: false, ...P })).toBe(false);
    expect(assessProtection({ totalGrowth: 120000, minGrowth: 100000, consecCashDraws: 9, wasInProtection: false, ...P })).toBe(false);
  });

  it('enters when below minimum AND enough consecutive cash draws (incl. this month)', () => {
    // consecCashDraws + 1 must reach consecutiveLimit (3): 2 prior draws + this month.
    expect(assessProtection({ totalGrowth: 99000, minGrowth: 100000, consecCashDraws: 2, wasInProtection: false, ...P })).toBe(true);
    // Only 1 prior draw → 1+1=2 < 3 → not yet.
    expect(assessProtection({ totalGrowth: 99000, minGrowth: 100000, consecCashDraws: 1, wasInProtection: false, ...P })).toBe(false);
  });

  it('stays in protection until growth recovers above min + recoveryBuffer', () => {
    // Still within the buffer band → stays.
    expect(assessProtection({ totalGrowth: 105000, minGrowth: 100000, consecCashDraws: 0, wasInProtection: true, ...P })).toBe(true);
    // Exactly at min + buffer → stays (<=).
    expect(assessProtection({ totalGrowth: 110000, minGrowth: 100000, consecCashDraws: 0, wasInProtection: true, ...P })).toBe(true);
    // Above min + buffer → exits.
    expect(assessProtection({ totalGrowth: 110001, minGrowth: 100000, consecCashDraws: 0, wasInProtection: true, ...P })).toBe(false);
  });

  it('applies sensible defaults', () => {
    expect(PROTECTION_DEFAULTS.CONSECUTIVE_LIMIT).toBe(3);
    expect(PROTECTION_DEFAULTS.RECOVERY_BUFFER).toBe(10000);
    // With defaults: below min, 2 prior cash draws → enters.
    expect(assessProtection({ totalGrowth: 99000, minGrowth: 100000, consecCashDraws: 2, wasInProtection: false })).toBe(true);
  });
});
