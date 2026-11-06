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
  it('duration = target age minus current age, clamps outside the table', () => {
    expect(suggestedDuration(65, 'm', 10)).toBe(96 - 65);
    expect(suggestedDuration(40, 'm', 10)).toBe(96 - 40);  // clamped to the age-55 row
    expect(suggestedDuration(80, 'f', 50)).toBe(89 - 80);  // clamped to the age-75 row
  });
});
