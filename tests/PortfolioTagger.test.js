import { describe, it, expect } from 'vitest';
import { tagPortfolio, allocationFromTags, EXAMPLE_PORTFOLIO } from '../src/services/PortfolioTagger.js';
import { runMonteCarlo } from '../src/services/SimulationEngine.js';
import { createSimulationConfig } from '../src/models/SimulationConfig.js';

describe('tagging the example portfolio', () => {
  const tagged = tagPortfolio(EXAMPLE_PORTFOLIO);

  it('rolls up the TAXABLE buckets excluding the ISA (separate pool)', () => {
    expect(tagged.total).toBe(640000);                 // whole portfolio incl. ISA
    expect(tagged.buckets.shares).toBe(320000);        // VWRP+CTY
    expect(tagged.buckets.bonds).toBe(160000);         // IGLS(SIPP)+VAGS — ISA IGLS excluded
    expect(tagged.buckets.diversifiers).toBe(60000);   // SGLN+RICA
    expect(tagged.buckets.cash).toBe(60000);           // XSTR
    const taxable = tagged.total - tagged.isaTotal;    // 600,000
    expect(tagged.buckets.shares + tagged.buckets.bonds + tagged.buckets.diversifiers + tagged.buckets.cash).toBe(taxable);
  });

  it('captures the ISA WITHOUT double counting it in the buckets', () => {
    expect(tagged.isaTotal).toBe(40000);
    const bucketSum = Object.values(tagged.buckets).reduce((a, b) => a + b, 0);
    expect(bucketSum + tagged.isaTotal).toBe(tagged.total); // one pound lives in exactly one pool
  });

  it('derives the bond mix from the TAXABLE bond funds only', () => {
    const w = tagged.bondWeights;
    const sum = Object.values(w).reduce((s, v) => s + v, 0);
    expect(sum).toBeCloseTo(1, 6);
    // ISA-wrapped IGLS is excluded from the weights: SIPP IGLS 80k = VAGS 80k (with the ISA it would be 120k to 80k)
    expect(w.shortGilts).toBeCloseTo(0.5, 6);
    expect(w.globalAggHedged).toBeCloseTo(0.5, 6);
  });

  it('derives the diversifier mix (gold SGLN > trend/macro RICA)', () => {
    const w = tagged.diversifierWeights;
    expect(w.gold).toBeGreaterThan(w.trendMacro);        // SGLN 40k > RICA 20k
    expect(w.trendMacro + w.gold).toBeCloseTo(1, 6);
  });

  it('has no untagged holdings', () => {
    expect(tagged.untagged).toHaveLength(0);
  });

  it('builds an engine config that runs a Monte-Carlo without error', () => {
    const alloc = allocationFromTags(tagged);
    // pots are the taxable side; the ISA rides separately as isaBalance
    expect(alloc.equityStart + alloc.bondStart + alloc.cashStart + (alloc.diversifierStart || 0)).toBe(600000);
    expect(alloc.isaBalance).toBe(40000);
    // An example plan: £30k a year spent, 35 years, State Pension from year 11.
    const cfg = createSimulationConfig({
      ...alloc, baseSalary: 30000, years: 35, duration: 35, statePension: 12000, statePensionYear: 11
    });
    const runs = runMonteCarlo(cfg, 200);
    expect(runs.every(r => Number.isFinite(r.final))).toBe(true);
    expect(cfg.subAsset.bondWeights.shortGilts).toBeGreaterThan(0);
    expect(cfg.subAsset.diversifierWeights.gold).toBeGreaterThan(0);
  });
});
