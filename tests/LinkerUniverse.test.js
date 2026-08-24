import { describe, it, expect } from 'vitest';
import { coverage, giltsForYear, orderSheet, isStale, setLinkersOverride, activeLinkers } from '../src/services/LinkerUniverse.js';

describe('LinkerUniverse (Appendix C semantics)', () => {
  it('gap years are derived from the data, never hard-coded', () => {
    const c = coverage();
    expect(c.gaps).toContain(2038);          // known gap in the universe
    expect(c.gaps).toContain(2043);
    expect(c.years).toContain(2030);         // the old 8-month-lag stock is present
    expect(c.lastYear).toBe(2073);           // linkers run out around 2073 (the F&F honesty line)
  });

  it('exact years resolve to one gilt; gap years bracket; beyond-the-end degrades honestly', () => {
    expect(giltsForYear(2033).mode).toBe('exact');
    const gap = giltsForYear(2038);
    expect(gap.mode).toBe('bracket');
    expect(gap.gilts.map((g) => g.maturity)).toEqual([2037, 2039]);
    expect(giltsForYear(2090).mode).toBe('beyond');
  });

  it('old-style stocks carry the 8-month lag', () => {
    expect(giltsForYear(2030).gilts[0].lag).toBe(8);
  });

  it('order sheet prices rungs on the flat curve and flags gap bracketing', () => {
    const sheet = orderSheet({ rungYears: [10, 12], drawForYear: () => 20000, startYear: 2026, realYield: 0.023 });
    expect(sheet.rows[0].calYear).toBe(2036);
    expect(sheet.rows[0].mode).toBe('exact');
    expect(sheet.rows[1].calYear).toBe(2038);
    expect(sheet.rows[1].mode).toBe('bracket');
    expect(sheet.rows[0].estCost).toBe(Math.round(20000 * Math.pow(1.023, -10)));
    expect(sheet.priced).toMatch(/flat real yield/);
  });

  it('staleness: the bundled snapshot is stale after 48h; an override refreshes it', () => {
    expect(isStale()).toBe(true);            // bundled snapshot is dated
    setLinkersOverride({ generated_at: new Date().toISOString(), gilts: activeLinkers().gilts });
    expect(isStale()).toBe(false);
    setLinkersOverride(null);
  });
});
