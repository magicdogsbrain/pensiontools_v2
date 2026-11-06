import { describe, it, expect } from 'vitest';
import { protectionMultForStreak } from '../src/services/ProtectionStrategy.js';
describe('staged protection cut with a configurable first stage', () => {
  it('default 12 months at half the cut, then the deep cut', () => {
    expect(protectionMultForStreak(0, 0.8)).toBeCloseTo(0.9);
    expect(protectionMultForStreak(11, 0.8)).toBeCloseTo(0.9);
    expect(protectionMultForStreak(12, 0.8)).toBeCloseTo(0.8);
  });
  it('0 first-stage months = straight to the deep cut; 24 = two years at half', () => {
    expect(protectionMultForStreak(0, 0.8, 0)).toBeCloseTo(0.8);
    expect(protectionMultForStreak(20, 0.7, 24)).toBeCloseTo(0.85);
    expect(protectionMultForStreak(24, 0.7, 24)).toBeCloseTo(0.7);
  });
});
