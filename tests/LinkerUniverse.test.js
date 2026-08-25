import { describe, it, expect } from 'vitest';
import {
  coverage, giltsForYear, orderSheet, isStale, setLinkersOverride, setLiveGilts, activeLinkers,
  realYieldForYear, loadLiveGilts, dataProvenance, FLAT_REAL_YIELD_FALLBACK
} from '../src/services/LinkerUniverse.js';

describe('LinkerUniverse (Appendix C semantics, live-data edition)', () => {
  it('the bundled snapshot is the real DMO universe: 3-month and 8-month lag linkers, priced', () => {
    const a = activeLinkers();
    expect(a.gilts.length).toBeGreaterThan(25);
    expect(a.gilts.every((g) => g.isin && g.maturity >= 2026)).toBe(true);
    expect(a.gilts.filter((g) => g.lag === 8).length).toBe(2);        // 4⅛% 2030, 2% 2035
    expect(a.gilts.filter((g) => g.cleanPrice != null).length).toBe(a.gilts.length);
    expect(a.realCurve.length).toBeGreaterThan(25);
  });

  it('gap years are derived from the data, never hard-coded', () => {
    const c = coverage();
    expect(c.gaps).toContain(2043);
    expect(c.gaps).toContain(2053);
    expect(c.years).toContain(2030);         // the old 8-month-lag stock is present
    expect(c.lastYear).toBe(2073);           // linkers run out around 2073 (the F&F honesty line)
  });

  it('exact years resolve to one gilt; gap years bracket; beyond-the-end degrades honestly', () => {
    expect(giltsForYear(2033).mode).toBe('exact');
    const gap = giltsForYear(2043);
    expect(gap.mode).toBe('bracket');
    expect(gap.gilts.map((g) => g.maturity)).toEqual([2042, 2044]);
    expect(giltsForYear(2090).mode).toBe('beyond');
  });

  it('old-style stocks carry the 8-month lag and are excluded from the real curve', () => {
    expect(giltsForYear(2030).gilts[0].lag).toBe(8);
    expect(giltsForYear(2030).gilts[0].realYield).toBeNull();
  });

  it('real-yield curve: interpolates between maturities, flat beyond the ends, plausible shape', () => {
    const c = activeLinkers().realCurve;
    expect(realYieldForYear(0)).toBe(c[0].yield);
    expect(realYieldForYear(200)).toBe(c[c.length - 1].yield);
    const mid = (c[3].years + c[4].years) / 2;
    const y = realYieldForYear(mid);
    expect(y).toBeGreaterThanOrEqual(Math.min(c[3].yield, c[4].yield));
    expect(y).toBeLessThanOrEqual(Math.max(c[3].yield, c[4].yield));
    // A real curve: short end well below the 10-30y plateau; everything within sane bounds
    expect(realYieldForYear(2)).toBeLessThan(realYieldForYear(20));
    for (const k of [1, 5, 10, 20, 30, 45]) { expect(realYieldForYear(k)).toBeGreaterThan(-0.03); expect(realYieldForYear(k)).toBeLessThan(0.06); }
  });

  it('order sheet prices rungs on the live curve by default, on a forced flat yield when asked', () => {
    const live = orderSheet({ rungYears: [10, 17], drawForYear: () => 20000, startYear: 2026 });
    expect(live.rows[0].calYear).toBe(2036);
    expect(live.rows[0].mode).toBe('exact');
    expect(live.rows[1].calYear).toBe(2043);
    expect(live.rows[1].mode).toBe('bracket');
    expect(live.rows[0].estCost).toBe(Math.round(20000 * Math.pow(1 + realYieldForYear(10), -10)));
    expect(live.priced).toMatch(/Bank of England GLC real spot curve as of \d{4}-\d{2}-\d{2}/);
    expect(live.notice).toMatch(/Not a recommendation/);
    expect(live.rows[0].giltDetails[0].cleanPrice).toBeGreaterThan(0);
    const flat = orderSheet({ rungYears: [10], drawForYear: () => 20000, startYear: 2026, realYield: 0.023 });
    expect(flat.rows[0].estCost).toBe(Math.round(20000 * Math.pow(1.023, -10)));
    expect(flat.priced).toMatch(/flat real yield/);
  });

  it('a bare admin CSV override (no prices) falls back to the flat yield; live data lifts it', () => {
    setLinkersOverride({ generated_at: new Date().toISOString(), gilts: [{ name: 'x 2036', coupon: 0.125, maturity: 2036, lag: 3 }] });
    expect(realYieldForYear(10)).toBe(FLAT_REAL_YIELD_FALLBACK);
    expect(isStale()).toBe(false);
    setLinkersOverride(null);
    expect(realYieldForYear(10)).not.toBe(FLAT_REAL_YIELD_FALLBACK);
  });

  it('loadLiveGilts swaps in a newer fetched file and ignores failures/older files', async () => {
    const bundled = activeLinkers();
    const newer = { ...JSON.parse(JSON.stringify(bundled)), generated_at: new Date(Date.now() + 1000).toISOString(),
      realCurve: [{ years: 1, yield: 0.01 }, { years: 30, yield: 0.03 }] };
    const okFetch = async () => ({ ok: true, json: async () => newer });
    await loadLiveGilts('./data/gilts.json', okFetch);
    expect(realYieldForYear(30)).toBe(0.03);
    setLiveGilts(null);
    const badFetch = async () => { throw new Error('offline'); };
    expect(await loadLiveGilts('./data/gilts.json', badFetch)).toBeNull();
    expect(activeLinkers()).toBe(bundled);
    const older = { ...newer, generated_at: '2000-01-01T00:00:00Z' };
    await loadLiveGilts('./data/gilts.json', async () => ({ ok: true, json: async () => older }));
    expect(activeLinkers()).toBe(bundled);
    expect(dataProvenance().source).toMatch(/DMO/);
  });
});
