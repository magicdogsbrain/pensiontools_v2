import { describe, it, expect, vi } from 'vitest';
vi.mock('../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));
import { proportions, describeMix, pensionPotFromHoldings, ASSUMED_CPI } from '../src/services/Holdings.js';
import { tagPortfolio } from '../src/services/PortfolioTagger.js';
import { projectAccumulation, potOnPath } from '../src/services/AccumulationEngine.js';
import { buildAccumulationPath, buildPlanDocument, whereAmI } from '../src/services/PlanDocument.js';
import { whereAmIHtml } from '../src/ui/components/PlanDocumentView.js';
import { deriveTiming } from '../src/services/PlanTiming.js';

// Wendy-like saver: LifeStrategy 80 in the SIPP, a world tracker in the ISA, some cash; contributes into VLS80.
const ledger = [
  { ticker: 'VLS80', value: 300000, wrapper: 'SIPP', ocf: 0.22, contribution: 1500 },
  { ticker: 'VWRP', value: 100000, wrapper: 'ISA', ocf: 0.22 },
  { ticker: 'CSH2', value: 20000, wrapper: 'SIPP', ocf: 0.10 }
];

describe('multi-asset funds split by the catalogue mix', () => {
  it('a LifeStrategy 80 counts as 80% shares and 20% bonds', () => {
    const t = tagPortfolio([{ ticker: 'VLS80', value: 100000, wrapper: 'SIPP' }]);
    expect(t.tagged.length).toBe(2);
    expect(Math.round(t.buckets.shares)).toBe(80000);
    expect(Math.round(t.buckets.bonds)).toBe(20000);
    expect(t.untagged).toEqual([]);
  });
  it('an explicit mix on the holding is honoured, weights normalised', () => {
    const t = tagPortfolio([{ ticker: 'XYZ', value: 1000, mix: { worldGrowth: 3, globalAggHedged: 1 } }]);
    expect(Math.round(t.buckets.shares)).toBe(750);
    expect(Math.round(t.buckets.bonds)).toBe(250);
  });
  it('a plain single-class ticker is untouched', () => {
    const t = tagPortfolio([{ ticker: 'VWRP', value: 500 }]);
    expect(t.tagged.length).toBe(1);
    expect(t.buckets.shares).toBe(500);
  });
});

describe('proportions — tickers in, proportions modelled', () => {
  const p = proportions(ledger);
  it('rolls every wrapper up to bucket fractions and wrapper totals', () => {
    expect(p.total).toBe(420000);
    expect(p.byWrapper).toEqual({ SIPP: 320000, ISA: 100000, GIA: 0, CASH: 0 });
    expect(Math.round(p.buckets.shares * 100)).toBe(81);   // 240k + 100k of 420k
    expect(Math.round(p.buckets.bonds * 100)).toBe(14);    // 60k
    expect(Math.round(p.buckets.cash * 100)).toBe(5);      // 20k
    expect(Math.abs(p.buckets.shares + p.buckets.bonds + p.buckets.diversifiers + p.buckets.cash - 1)).toBeLessThan(1e-9);
  });
  it('costs are value-weighted and the expected real return is net of CPI and cost', () => {
    expect(p.weightedOcf).toBeCloseTo((300000 * 0.0022 + 100000 * 0.0022 + 20000 * 0.001) / 420000, 6);
    expect(p.expectedReal).toBeCloseTo(p.expectedNominal - ASSUMED_CPI - p.weightedOcf, 9);
    expect(p.expectedReal).toBeGreaterThan(0.02);
    expect(p.expectedReal).toBeLessThan(0.06);
  });
  it('contributions go where the destination holding sits', () => {
    expect(p.contributions.monthly).toBe(1500);
    expect(Math.round(p.contributions.byBucket.shares * 100)).toBe(80);
    expect(p.contributions.byWrapper.SIPP).toBe(1500);
  });
  it('reads as a sentence; pension pot = SIPP-wrapped holdings', () => {
    expect(describeMix(p)).toMatch(/81% shares · 14% bonds · 5% cash; cost 0\.2\d%\/yr; about \d\.\d% a year real/);
    expect(pensionPotFromHoldings(ledger)).toBe(320000);
    expect(describeMix(proportions([]))).toBe('No holdings entered yet.');
  });
  it('untagged tickers are reported, not silently dropped', () => {
    const q = proportions([{ ticker: 'ZZZZ', value: 100 }]);
    expect(q.total).toBe(0);
    expect(q.untagged[0].ticker).toBe('ZZZZ');
  });
});

describe('projection at your own mix + a point on the path', () => {
  const rows = projectAccumulation({ currentAge: 58, retirementAge: 60, potNow: 320000, totalMonthly: 1875, mixRealReturn: 0.04 });
  it('adds a potMix column between the FCA bands when a mix return is given', () => {
    expect(rows[2].potMix).toBeGreaterThan(rows[2].potLow);
    expect(rows[2].potMix).toBeLessThan(rows[2].potHigh);
    expect(projectAccumulation({ currentAge: 58, retirementAge: 60, potNow: 1000, totalMonthly: 0 })[1].potMix).toBeUndefined();
  });
  it('potOnPath interpolates between yearly rows', () => {
    const mid = potOnPath(rows, 0.5, 'potMix');
    expect(mid).toBeGreaterThan(rows[0].potMix);
    expect(mid).toBeLessThan(rows[1].potMix);
    expect(potOnPath(rows, 9, 'potMix')).toBe(rows[2].potMix);   // clamped to the last row
    expect(potOnPath([], 1)).toBeNull();
  });
});

describe('the locked accumulation path in the plan document, and the saver\'s where-am-I', () => {
  const NOW = new Date(2026, 8, 10);
  const settings = { currentAge: 58, currentAgeAsOf: '2026-09-10', retired: false, retireAge: 60, taggedFunds: ledger, equityMin: 0, bondMin: 0, cashTarget: 0, baseSalary: 40000, duration: 30, incomeShape: 'phases', incomeSteps: [{ fromAge: 60, amount: 40000 }] };
  const accumulation = { netMonthly: 1200, salary: 60000, schemeType: 'ras', employerMonthly: 375 };
  it('buildAccumulationPath: two years, from the SIPP holdings, at the ledger\'s mix', () => {
    const t = deriveTiming(settings, NOW);
    const a = buildAccumulationPath({ settings, timing: t, accumulation });
    expect(a.years).toBe(2);
    expect(a.potNow).toBe(320000);
    expect(a.totalMonthly).toBeGreaterThan(1500);      // gross-up of £1,200 net plus employer £375
    expect(a.path.length).toBe(3);
    expect(a.path[2].potMix).toBeGreaterThan(320000);
    expect(a.mixText).toMatch(/shares/);
  });
  it('no path for someone already retired', () => {
    expect(buildAccumulationPath({ settings: { ...settings, retired: true, retireAge: null }, timing: deriveTiming({ ...settings, retired: true, retireAge: null }, NOW), accumulation })).toBeNull();
  });
  it('whereAmI reads the latest pot record against the path', () => {
    const doc = buildPlanDocument({ planName: 'Wendy Real', settings, p: null, r: null, accumulation, lockedAt: NOW.toISOString(), now: NOW });
    expect(doc.accumulation.path.length).toBe(3);
    const later = new Date(2027, 8, 10);   // a year on
    const w = whereAmI(doc, { today: later, accHistory: [{ date: '2027-09', sipp: 380000, isa: 110000, total: 490000 }] });
    expect(w.bridge).toBe(true);
    expect(w.saving.monthsToGo).toBe(7);
    expect(w.saving.actual).toBe(380000);
    expect(w.saving.expected).toBeGreaterThan(320000);
    expect(['below the locked path', 'on or above the locked path', 'above the strong line', 'below the cautious line']).toContain(w.saving.band);
    const h = whereAmIHtml(w);
    expect(h).toContain('to go');
    expect(h).toContain('£380,000');
    expect(h).toContain('locked path');
  });
  it('without a record it asks for one', () => {
    const doc = buildPlanDocument({ planName: 'Wendy Real', settings, accumulation, lockedAt: NOW.toISOString(), now: NOW });
    const w = whereAmI(doc, { today: new Date(2027, 0, 10) });
    expect(w.saving.actual).toBeNull();
    expect(whereAmIHtml(w)).toMatch(/Record this month's pot/);
  });
});
