/**
 * Tax-year boundary parity.
 *
 * The UK tax year runs 6 April → 5 April. The canonical helper DateUtils.getTaxYear
 * honours the 6th (checks month AND day); the live decision path approximates it to the
 * 1st (`m >= 4`) in getTaxYearFromDate. Because the tool records data at month granularity
 * and DateUtils.parseMonth resolves a "YYYY-MM" to day 15 (deliberately, to keep April
 * 1–5 out of the wrong year), `getTaxYear(parseMonth(m))` equals the inline approximation
 * for EVERY month.
 *
 * This test proves the equivalence, so the unification can replace every `m >= 4`
 * tax-year boundary with the shared, 6-April-correct helper WITHOUT moving any golden
 * fixture. If it ever fails, the boundary swap is no longer behaviour-neutral and needs
 * review.
 */
import { describe, it, expect } from 'vitest';
import { getTaxYear, parseMonth } from '../../src/utils/DateUtils.js';
import { getTaxYearFromDate } from './legacyDecisionEngine.js';

describe('tax-year boundary parity (6 April, day-15 month convention)', () => {
  it('getTaxYear(parseMonth(m)) === live getTaxYearFromDate(m) for every month 2020–2070', () => {
    for (let y = 2020; y <= 2070; y++) {
      for (let m = 1; m <= 12; m++) {
        const mm = `${y}-${String(m).padStart(2, '0')}`;
        expect(getTaxYear(parseMonth(mm)), mm).toBe(getTaxYearFromDate(mm));
      }
    }
  });

  it('the canonical helper honours the 6th, not the 1st, of April (day granularity)', () => {
    // April 1–5 is still the PREVIOUS tax year; 6 April onward is the new one.
    expect(getTaxYear(new Date(2026, 3, 5))).toBe('25/26'); // 5 Apr 2026
    expect(getTaxYear(new Date(2026, 3, 6))).toBe('26/27'); // 6 Apr 2026
  });
});
