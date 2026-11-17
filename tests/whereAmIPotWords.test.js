/**
 * The full view's pot sentence in "Where you are" follows the simple view's (7.12.0, the living-record brief A): the figure
 * the plan's band is in first, at the prices of the month the plan's figures are in, and the figure as recorded in brackets;
 * then where it came from. One month for "the prices of", read once by whereAmI (`pot.prices.since`) for both views.
 *
 * A made-up plan document (as tests/whereAmIBand.test.js): plan year 0 is 2026/27, no ISA; a pot recorded in April 2029 of
 * £753,659, which is £670,000 in April 2026's prices after three years at the plan's 4% (670,000 × 1.04³ = 753,659.0).
 */
import { describe, it, expect, vi } from 'vitest';
vi.mock('../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));
import { whereAmI } from '../src/services/PlanDocument.js';
import { whereAmIHtml } from '../src/ui/components/PlanDocumentView.js';

const at = (y, m, d) => new Date(y, m - 1, d, 12, 0, 0, 0);
const series = (n, f) => Array.from({ length: n }, (_, y) => f(y));
const strip = (w) => whereAmIHtml(w).replace(/<(?!\/?strong)[^>]+>/g, '');
const cones = { p10: series(11, (y) => 700000 - 25000 * y), p50: series(11, (y) => 700000 - 10000 * y), p90: series(11, (y) => 700000 + 5000 * y) };
const doc = (over = {}) => ({
  version: 2, lockedAt: '2026-04-01T10:00:00.000Z', createdAt: '2026-04-01T10:00:00.000Z',
  timing: { firstTaxYear: 2026, shapeAgeNow: 60, mode: 'retired', bridgeMonths: 0 },
  steps: [{ fromAge: 60, amount: 40000, taxYear: '2026/27' }],
  timeline: series(10, (y) => ({ y, gross: 40000, sp: 0, other: 0, lumpIn: [] })),
  pots: { sipp: 600000, isa: 0, gia: 0, isaPolicy: 'minimiseEarlyTax', allocation: { equityMin: 360000, bondMin: 180000, cashTarget: 60000, diversifierStart: 0 } },
  strategy: { id: 'pots-and-valves', contract: false, r: { cones: { wealth: cones } } },
  assumptions: { duration: 10, firstTaxYear: 2026, bridgeCash: 0, cpiDecision: 0.04 },
  holdingsAtLock: { updatedAt: '2026-03-20', source: 'typed', lines: [] },
  ...over
});
const record = (date, equity, bond, cash, extra = {}) => ({ date, taxYear: '29/30', equity, bond, cash, sipp: 3000, other: 0, state: 0, ...extra });

describe('the full view says the pot the simple view\'s way', () => {
  const w = whereAmI(doc(), { today: at(2029, 4, 20), history: [record('2029-04', 500000, 200000, 53659)] });

  it('whereAmI says which month\'s prices the plan\'s figures are in: April of the first tax year', () => {
    expect(w.pot.prices.since).toBe('2026-04');
  });

  it('the figure the band is in first, at the prices of April 2026, the recorded one in brackets with its month', () => {
    const t = strip(w);
    expect(t).toContain('Your pot: £670,000 at the prices of April 2026 (£753,659, recorded April 2029)');
    expect(t).not.toContain('which is £670,000 in prices at the start of the plan');
  });

  it('a document locked in a later plan year is in the prices of the month it was locked', () => {
    const later = doc({ lockedAt: '2027-11-03T10:00:00.000Z', pots: { ...doc().pots, asOfPlanYear: 1 }, timing: { ...doc().timing, monthsIntoYear: 7 } });
    const w2 = whereAmI(later, { today: at(2029, 4, 20), history: [record('2029-04', 500000, 200000, 53659)] });
    expect(w2.pot.prices.since).toBe('2027-11');
  });
});
