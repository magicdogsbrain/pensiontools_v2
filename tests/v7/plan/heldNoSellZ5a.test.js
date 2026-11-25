/**
 * Ruling Z5a: someone living on a ladder is never told to sell. Your plan's mix says only that the months before the first
 * gilt pays are not yet paid for by cash or by a gilt that pays in them (never "not covered": the page's own rule).
 */
import { describe, it, expect } from 'vitest';
import { HELD } from '../../../src/v7/copy/held.js';

describe('the timing line on Your plan\'s mix', () => {
  for (const key of ['timing', 'timingNoNext']) {
    it(`${key}: no sell, no sale, no price of a sale; the months said as not yet paid for`, () => {
      expect(HELD[key]).not.toMatch(/\bsell|\bsold|\bsale|that day’s price/i);
      expect(HELD[key]).toContain('Those months are not yet paid for by cash or by a gilt that pays in them.');
      expect(HELD[key]).not.toMatch(/not (yet )?covered/);
    });
  }
});
