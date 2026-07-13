import { describe, it, expect } from 'vitest';
import { tagPortfolio, allocationFromTags, PDF_PORTFOLIO } from '../src/services/PortfolioTagger.js';
import { runMonteCarlo } from '../src/services/SimulationEngine.js';
import { createSimulationConfig } from '../src/models/SimulationConfig.js';

describe('tagging the PDF £1.3M portfolio', () => {
  const tagged = tagPortfolio(PDF_PORTFOLIO);

  it('rolls up to the expected 4-bucket split (~52/30/19/0)', () => {
    expect(tagged.total).toBe(1300000);
    expect(tagged.buckets.shares).toBe(670000);        // UKW+HICL+CTY+MYI+LWDB+PACW
    expect(tagged.buckets.bonds).toBe(385000);         // SEQI+IGLS(x2)+IBTM+TI5G
    expect(tagged.buckets.diversifiers).toBe(245000);  // CGT+SGLN+BHMG
    expect(tagged.buckets.cash).toBe(0);
    const pct = b => Math.round(tagged.buckets[b] / tagged.total * 100);
    expect([pct('shares'), pct('bonds'), pct('diversifiers')]).toEqual([52, 30, 19]);
  });

  it('captures the £60k ISA bridge', () => {
    expect(tagged.isaTotal).toBe(60000);
  });

  it('derives the bond mix from the tagged funds (short gilts the largest)', () => {
    const w = tagged.bondWeights;
    const sum = Object.values(w).reduce((s, v) => s + v, 0);
    expect(sum).toBeCloseTo(1, 6);
    expect(w.shortGilts).toBeGreaterThan(w.infraDebt);   // IGLS 145k > SEQI 90k
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
    expect(alloc.equityStart + alloc.bondStart + alloc.cashStart + (alloc.diversifierStart || 0)).toBe(1300000);
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
