import { describe, it, expect } from 'vitest';
import { longevityAge, suggestedDuration } from '../src/services/LongevityModel.js';

describe('LongevityModel', () => {
  it('10% survival age is later than 25%, which is later than the median', () => {
    expect(longevityAge(65, 'm', 10)).toBeGreaterThan(longevityAge(65, 'm', 25));
    expect(longevityAge(65, 'm', 25)).toBeGreaterThan(longevityAge(65, 'm', 50));
  });
  it('women plan longer than men at every percentile', () => {
    for (const p of [50, 25, 10]) {
      expect(longevityAge(65, 'f', p)).toBeGreaterThanOrEqual(longevityAge(65, 'm', p));
    }
  });
  // Retaken 11 Nov 2026 (7.8.0): the hand-typed table (ages 55-75) gave way to the ONS 2024-based cohort tables, read by
  // year of birth from `today` and rounded up — so no clamping to a table's rows, and the date is fixed.
  it('duration = target age minus current age, at any age, read at a fixed today', () => {
    const today = '2026-11-11';
    expect(suggestedDuration(65, 'm', 10, today)).toBe(97 - 65);
    expect(suggestedDuration(40, 'm', 10, today)).toBe(99 - 40);
    expect(suggestedDuration(80, 'f', 50, today)).toBe(91 - 80);
  });
});
