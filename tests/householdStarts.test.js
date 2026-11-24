/**
 * The household check says what it starts from (7.12.0), in both views: each plan's pension and ISA at its own start and
 * the sum. Fictional Kim, 66, retired, £280,000 in a pension and £40,000 in an ISA: £320,000 now. Fictional Sam, 61, still
 * working, stopping at 62 with a pension worked out at the stop (the pots the test runs on): the line names each plan's
 * figure and when it starts, and the sum is 320,000 + Sam's figure.
 */
import { describe, it, expect } from 'vitest';
import { householdStartsOf, startsWords, startPotsOf } from '../src/services/HouseholdStarts.js';

const now = new Date(2026, 10, 16, 12);
const kim = { configured: true, retired: true, currentAge: 66, currentAgeAsOf: '2026-11-16', retireAge: 66, firstTaxYear: 2026, shapeAgeNow: 66, duration: 29,
  equityMin: 180000, bondMin: 80000, cashTarget: 20000, diversifierStart: 0, isaBalance: 40000, baseSalary: 26400, strategyId: 'pots-and-valves' };

describe('what the household check starts from', () => {
  it('a retired plan starts from its pension and ISA now: 180,000 + 80,000 + 20,000 + 40,000 = 320,000', () => {
    expect(startPotsOf(kim, now).amount).toBe(320000);
  });
  it('the sentence names each side, when it starts, and the sum', () => {
    const starts = { total: 482000, a: { name: 'Sam', amount: 162000, age: 62, later: true }, b: { name: 'Kim', amount: 320000, age: 66, later: false } };
    expect(startsWords(starts)).toBe('The check starts from £482,000 in pensions and ISAs: £162,000 in ‘Sam’ from the month work stops, and £320,000 in ‘Kim’ now.');
  });
  it('the sum is the two sides\' figures', () => {
    const s = householdStartsOf(kim, kim, { a: 'Kim', b: 'Kim too' }, { a: 0, b: 0 }, now);
    expect(s.total).toBe(640000);
  });
});

import { verdictSectionHtml } from '../src/ui/householdView.js';
import { unmarked } from '../src/reading/mark.js';
describe('the full view says the same sentence', () => {
  it('verdictSectionHtml, given the two plans\' settings, carries the starts line', () => {
    const r = { jointSuccess: 0.9, successA: 0.9, successB: 0.95, runs: 100 };
    const html = verdictSectionHtml({ r, ownName: 'Kim', pName: 'Kim too', setA: kim, setB: kim, offsets: { a: 0, b: 0 } });
    // its figures and this plan's name are marked (step F6): read without the marks
    expect(unmarked(html)).toContain('The check starts from £640,000 in pensions and ISAs: £320,000 in ‘Kim’ now, and £320,000 in ‘Kim too’ now.');
  });
});
