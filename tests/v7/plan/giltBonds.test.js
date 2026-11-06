/**
 * A correction of road step 11b (research/v7/road-to-7.md step 11b): a gilt held directly — a line of the record whose kind is
 * 'gilt' with no sub-class of its own (a gilt typed by its code on "What you hold") — counts as bonds in Holdings.proportions,
 * as a ladder's rung from the order sheet (sub-class indexLinked) already did; the tagger knew a line only by its sub-class
 * or its fund code, so such a line was left out of the mix "What you pay in" and the move read. A line with its own sub-class
 * is left as it is; nothing else in the proportions changes.
 */
import { describe, it, expect } from 'vitest';
import { proportions, giltsAsBonds, slices } from '../../../src/services/Holdings.js';
import { tagPortfolio } from '../../../src/services/PortfolioTagger.js';

const LINES = [
  { wrapper: 'SIPP', ticker: 'VWRP', name: 'Vanguard FTSE All-World', value: 60000, kind: 'fund' },
  { wrapper: 'SIPP', ticker: 'T29', name: 'Gilt T29', value: 20000, kind: 'gilt' },
  { wrapper: 'SIPP', ticker: 'TR28', name: 'Treasury 0 1/8% IL 2028', value: 20000, kind: 'gilt', subClass: 'indexLinked' }
];

describe('a gilt held directly counts as bonds', () => {
  it('the tagger alone leaves a gilt typed by its code untagged; proportions count it as bonds, as the rung with its sub-class', () => {
    const bare = tagPortfolio(LINES.map((h) => ({ ...h })));
    expect(bare.untagged.map((u) => u.ticker)).toEqual(['T29']);
    const p = proportions({ lines: LINES });
    expect(p.untagged).toEqual([]);
    expect(p.total).toBe(100000);
    expect(p.buckets.bonds).toBeCloseTo(0.4, 12);
    expect(p.buckets.shares).toBeCloseTo(0.6, 12);
    expect(p.subClasses.find((s) => s.key === 'indexLinked').value).toBe(40000);
    expect(slices({ lines: LINES }).map((s) => s.bucket).sort()).toEqual(['bonds', 'bonds', 'shares']);
  });

  it('a line with its own sub-class is left as it is; a fund or cash line is untouched; a gilt line with no value is still kept out of the proportions', () => {
    const given = [{ kind: 'gilt', subClass: 'nominalGilt', value: 1 }, { kind: 'fund', ticker: 'VWRP', value: 1 }, { kind: 'cash', value: 1 }, null];
    expect(giltsAsBonds(given)).toEqual(given);
    expect(giltsAsBonds([{ kind: 'gilt', value: 1 }])).toEqual([{ kind: 'gilt', value: 1, subClass: 'indexLinked' }]);
    const p = proportions({ lines: [{ wrapper: 'SIPP', ticker: 'T29', kind: 'gilt', value: 0 }, { wrapper: 'SIPP', ticker: 'VWRP', value: 100, kind: 'fund' }] });
    expect(p.total).toBe(100);
    expect(p.buckets.bonds).toBe(0);
  });
});
