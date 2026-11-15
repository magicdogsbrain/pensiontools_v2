/**
 * 7.11.1 — a gilt still on someone's record after it has matured is known by its SEDOL or name: the nightly gilt data keeps
 * the gilts that matured lately (scripts/fetch-gilt-data.mjs maturedGilts), and a line is never "cannot tell when it
 * matures" once the list of gilts in issue has dropped it. Here the bundled list is read as it will be after the next refresh:
 * a conventional gilt gone from the gilts in issue, kept among those matured.
 */
import { describe, it, expect, vi } from 'vitest';
vi.mock('../src/data/giltsSnapshot.js', async (importOriginal) => {
  const d = (await importOriginal()).default;
  const g = d.gilts.find((x) => String(x.isin).slice(4, 11) === 'BL6C772');
  return { default: { ...d, gilts: d.gilts.filter((x) => x !== g), matured: [{ isin: g.isin, name: g.name, tidm: g.tidm, type: g.type, coupon: g.coupon, maturity: g.maturity }] } };
});
import { giltMaturityOf } from '../src/services/TransitionPlanner.js';
import { maturedGilts, MATURED_YEARS } from '../scripts/fetch-gilt-data.mjs';

describe('a gilt matured lately is still known', () => {
  it('by its SEDOL, or its exact name, once it is no longer in issue', () => {
    expect(giltMaturityOf({ name: null, sedol: 'BL6C772', ticker: null })).toBe('2027-01-29');
    expect(giltMaturityOf({ name: '4 1/8% Treasury Gilt 2027', sedol: null, ticker: null })).toBe('2027-01-29');
    // a year alone is still never a maturity date
    expect(giltMaturityOf({ name: 'Treasury 2027', sedol: null, ticker: null })).toBe(null);
  });

  it('the nightly data keeps those the previous file listed that are no longer in issue, for a few years', () => {
    const now = new Date('2027-02-10T06:00:00Z');
    const previous = {
      gilts: [{ isin: 'GB00BL6C7720', name: '4 1/8% Treasury Gilt 2027', tidm: 'T27A', type: 'conventional', coupon: 4.125, maturity: '2027-01-29', cleanPrice: 99.96 },
        { isin: 'GB00B16NNR78', name: '4¼% Treasury Gilt 2027', tidm: 'TR27', type: 'conventional', coupon: 4.25, maturity: '2027-12-07' }],
      matured: [{ isin: 'GB00OLD00001', name: 'An old gilt', type: 'conventional', coupon: 1, maturity: '2020-01-01' },
        { isin: 'GB00RECENT01', name: 'A recent gilt', type: 'conventional', coupon: 2, maturity: '2026-06-07' }]
    };
    const inIssue = [{ isin: 'GB00B16NNR78' }];
    const out = maturedGilts(previous, inIssue, now);
    expect(out.map((g) => g.isin)).toEqual(['GB00RECENT01', 'GB00BL6C7720']);
    expect(out[1]).toEqual({ isin: 'GB00BL6C7720', name: '4 1/8% Treasury Gilt 2027', tidm: 'T27A', type: 'conventional', coupon: 4.125, maturity: '2027-01-29' });
    expect(MATURED_YEARS).toBeGreaterThanOrEqual(2);
    expect(maturedGilts(null, inIssue, now)).toEqual([]);
  });
});
