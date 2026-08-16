import { describe, it, expect } from 'vitest';
import { tagPortfolio, allocationFromTags, PDF_PORTFOLIO } from '../src/services/PortfolioTagger.js';
import { runMonteCarlo } from '../src/services/SimulationEngine.js';
import { createSimulationConfig } from '../src/models/SimulationConfig.js';

describe('tagging the PDF £1.3M portfolio', () => {
  const tagged = tagPortfolio(PDF_PORTFOLIO);

  it('rolls up the TAXABLE buckets excluding the ISA (separate pool)', () => {
    expect(tagged.total).toBe(1300000);                // whole portfolio incl. ISA
    expect(tagged.buckets.shares).toBe(670000);        // UKW+HICL+CTY+MYI+LWDB+PACW
    expect(tagged.buckets.bonds).toBe(325000);         // SEQI+IGLS(SIPP)+IBTM+TI5G — ISA IGLS excluded
    expect(tagged.buckets.diversifiers).toBe(245000);  // CGT+SGLN+BHMG
    expect(tagged.buckets.cash).toBe(0);
    const taxable = tagged.total - tagged.isaTotal;    // 1,240,000
    expect(tagged.buckets.shares + tagged.buckets.bonds + tagged.buckets.diversifiers).toBe(taxable);
  });

  it('captures the £60k ISA bridge WITHOUT double counting it in the buckets', () => {
    expect(tagged.isaTotal).toBe(60000);
    const bucketSum = Object.values(tagged.buckets).reduce((a, b) => a + b, 0);
    expect(bucketSum + tagged.isaTotal).toBe(tagged.total); // one pound lives in exactly one pool
  });

  it('derives the bond mix from the TAXABLE bond funds only', () => {
    const w = tagged.bondWeights;
    const sum = Object.values(w).reduce((s, v) => s + v, 0);
    expect(sum).toBeCloseTo(1, 6);
    // ISA-wrapped IGLS is excluded from the weights: SIPP IGLS 85k < SEQI 90k
    expect(w.infraDebt).toBeGreaterThan(w.shortGilts);
    expect(w).toHaveProperty('usTreasHedged');
    expect(w).toHaveProperty('indexLinked');
  });

  it('derives the diversifier mix (trend/macro CGT+BHMG > gold)', () => {
    const w = tagged.diversifierWeights;
    expect(w.trendMacro).toBeGreaterThan(w.gold);        // CGT+BHMG 160k > SGLN 85k
    expect(w.trendMacro + w.gold).toBeCloseTo(1, 6);
  });

  it('has no untagged holdings', () => {
    expect(tagged.untagged).toHaveLength(0);
  });

  it('builds an engine config that runs a Monte-Carlo without error', () => {
    const alloc = allocationFromTags(tagged);
    // pots are the taxable side; the ISA rides separately as isaBalance
    expect(alloc.equityStart + alloc.bondStart + alloc.cashStart + (alloc.diversifierStart || 0)).toBe(1240000);
    expect(alloc.isaBalance).toBe(60000);
    // The PDF plan: ~£50k/yr spend, 35 years. State pension from year 11.
    const cfg = createSimulationConfig({
      ...alloc, baseSalary: 50000, years: 35, duration: 35, statePension: 12000, statePensionYear: 11
    });
    const runs = runMonteCarlo(cfg, 200);
    expect(runs.every(r => Number.isFinite(r.final))).toBe(true);
    expect(cfg.subAsset.bondWeights.shortGilts).toBeGreaterThan(0);
    expect(cfg.subAsset.diversifierWeights.gold).toBeGreaterThan(0);
  });
});
