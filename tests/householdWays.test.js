/**
 * Both ways through the ONE test (household-draw-split.md §3, §8; usability audit §5 decision 5): every strategy's
 * result carries the per-future read-out the household pools pots with (futuresMc); runHouseholdWays runs each plan
 * each way through stressTestStrategy, paired future for future, and the household verdict is the pooled one — never
 * below the paired one. Small Monte Carlo counts: the arithmetic is the engines' own.
 */
import { describe, it, expect } from 'vitest';
import { stressTestStrategy, planFromSettings, futuresOf } from '../src/strategies/stressTest.js';
import { createSimulationConfigFromSettings } from '../src/storage/StressRepository.js';
import { runHouseholdWays, combineHouseholdStrategies, compactStrategyResult, POOLED_TAX_UPLIFT, heldIsaOf } from '../src/services/HouseholdService.js';
import { householdDrawSplit, comparisonFigures } from '../src/services/HouseholdDraw.js';
import { STRATEGY_IDS } from '../src/strategies/registry.js';
import { trimResult } from '../src/services/PlanDocument.js';

const NOW = new Date('2026-10-17T10:00:00Z');
const BANDS = { pa: 12570, brl: 50270, hrl: 125140 };
const stressA = { configured: true, retired: true, currentAge: 62, shapeAgeNow: 62, duration: 25, baseSalary: 83650, equityMin: 800000, bondMin: 300000, cashTarget: 80000, isaBalance: 0, other: 0, isaDrawdownStrategy: 'hold', dbAmount: 3650, dbStartYear: 0, statePension: 11973, statePensionYear: 5, accessMethod: 'drawdown', ...BANDS, strategyId: 'pots-and-valves', chargesPct: 0.3 };
const stressB = { configured: true, retired: true, currentAge: 57, shapeAgeNow: 57, duration: 30, baseSalary: 0, equityMin: 150000, bondMin: 50000, cashTarget: 20000, isaBalance: 0, other: 0, isaDrawdownStrategy: 'hold', statePension: 11973, statePensionYear: 10, accessMethod: 'ufpls', ...BANDS, strategyId: 'pots-and-valves', chargesPct: 0.3 };
const small = (settings, cfg, id) => { const p = { ...planFromSettings(settings, cfg, { startAge: +settings.shapeAgeNow || 57, now: NOW }), mcRuns: 40, stride: 24 }; return { r: stressTestStrategy(id, p), p }; };

describe('the per-future read-out', () => {
  it('futuresOf: the plan year the money ran out, null when it lasted or was only cut', () => {
    const f = futuresOf([[100, 50, 0, 0], [100, 80, 60, 40], [100, 90, 80, 70]], [false, true, false], [0, 40, 70]);
    expect(f.failYear).toEqual([2, null, null]);
    expect(f.terminal).toEqual([0, 40, 70]);
  });
  it('every strategy\'s result carries it, one entry per future, and the plan document never stores it', () => {
    const settings = { ...stressA, baseSalary: 40000, strategyParams: { sippTotal: 1180000, isaTotal: 0 } };
    const cfg = createSimulationConfigFromSettings({}, settings);
    for (const id of Object.values(STRATEGY_IDS)) {
      const { r } = small({ ...settings, strategyId: id }, cfg, id);
      if (!r.affordable) continue;
      expect(r.futuresMc, id).toBeTruthy();
      const n = (r.survivedMc || [true]).length;
      expect(r.futuresMc.terminal.length, id).toBe(n);
      expect(r.futuresMc.failYear.length, id).toBe(n);
      r.futuresMc.failYear.forEach((y, i) => { if (r.survivedMc && r.survivedMc[i]) expect(y, id).toBeNull(); });
      expect(trimResult(r).futuresMc).toBeUndefined();
    }
  }, 120000);
});

describe('both ways through the one test', () => {
  const s = householdDrawSplit({ settings: stressA, name: 'A' }, { settings: stressB, name: 'B' }, { now: NOW });
  const cfgOf = (st) => createSimulationConfigFromSettings({}, st);
  const ways = { own: { settingsA: stressA, cfgA: cfgOf(stressA), settingsB: stressB, cfgB: cfgOf(stressB) }, together: { settingsA: s.settings.a, cfgA: cfgOf(s.settings.a), settingsB: s.settings.b, cfgB: cfgOf(s.settings.b) } };
  const res = runHouseholdWays(ways, s.needs, 'pots-and-valves', 'pots-and-valves', small);

  it('each way has the combined (pooled) verdict and each plan\'s compact result; pooled is never below paired', () => {
    for (const w of ['own', 'together']) {
      const c = res[w].combined;
      expect(c.pooled).toBeTruthy();
      expect(c.pooled.success).toBeGreaterThanOrEqual(c.jointSuccess - 1e-12);
      expect(c.pooled.success).toBeLessThanOrEqual(1);
      expect(res[w].rA.cones.wealth.p50.length).toBe(26);
      expect(res[w].rB.cones.wealth.p50.length).toBe(31);
      expect(res[w].rA.ruin.mc).toBeGreaterThanOrEqual(0);
    }
  }, 120000);

  it('the figures of the table come from those runs: the smaller pot is lower drawing together, the larger pot higher', () => {
    const fig = comparisonFigures(s, res);
    expect(fig.together.potB[0]).toBeLessThan(fig.own.potB[0]);        // B at 67: spent as the bridge
    expect(fig.together.potA[0]).toBeGreaterThan(fig.own.potA[0]);     // A at 67: drew less
    expect(fig.own.lasts.household.n).toBeGreaterThanOrEqual(0);
    expect(fig.own.left90).toBeTruthy();
    expect(typeof fig.betterOff90).toBe('number');
    expect(fig.tax.whole.together).toBeLessThan(fig.tax.whole.own);
  }, 120000);

  it('what you would have left, combined, counts an ISA a bought strategy holds aside — the test\'s wealth leaves it out (sweep 20 Oct 2026)', () => {
    expect(heldIsaOf({ isaHold: true, isa: 80000 }, 'gilt-rotation')).toBe(80000);
    expect(heldIsaOf({ isaHold: true, isa: 80000 }, 'full-il-gilt')).toBe(80000);
    expect(heldIsaOf({ isaHold: true, isa: 80000 }, 'pots-and-valves')).toBe(0);   // the P&V engine carries it in its own pots
    expect(heldIsaOf({ isaHold: false, isa: 80000 }, 'gilt-rotation')).toBe(0);
    const w = (v) => [v, v, v];
    const rA = { survivedMc: [true], samples: { wealth: [w(500000)] }, cones: { wealth: { p50: w(500000) } } };
    const rB = { survivedMc: [true], samples: { wealth: [w(200000)] }, cones: { wealth: { p50: w(200000) } } };
    expect(combineHouseholdStrategies(rA, rB).potFan[1].p50).toBe(700000);
    const c = combineHouseholdStrategies(rA, rB, { heldA: 80000 });
    expect(c.potFan.map((f) => f.p50)).toEqual([780000, 780000, 780000]);
    expect(c.jointSuccess).toBe(1);
  });

  it('the pooled verdict: a future where one pot is empty counts when the other has enough left for that share (a quarter higher for tax)', () => {
    const years = 5;
    const w = (v) => Array.from({ length: years + 1 }, () => v);
    const rA = { survivedMc: [true, true, true], futuresMc: { terminal: [100000, 10000, 100000], failYear: [null, null, null] }, samples: { wealth: [w(1), w(1), w(1)] }, cones: { wealth: { p50: w(1) } } };
    const rB = { survivedMc: [true, false, false], futuresMc: { terminal: [0, 0, 0], failYear: [null, 2, 2] }, samples: { wealth: [w(1), w(0), w(0)] }, cones: { wealth: { p50: w(0) } } };
    const needB = [20000, 20000, 20000, 20000, 20000, 20000];   // from year 2: 4 × £20,000 = £80,000, ×1.25 = £100,000
    const c = combineHouseholdStrategies(rA, rB, { needA: w(0), needB, startAgeA: 62, startAgeB: 57 });
    expect(c.jointSuccess).toBeCloseTo(1 / 3, 9);
    expect(c.pooled.success).toBeCloseTo(2 / 3, 9);   // future 1: A has £100,000 ≥ £100,000; future 2: £10,000 is not enough
    expect(c.pooled.coveredByA).toBe(1);
    expect(c.pooled.fromAgeMedian).toBe(59);
    expect(POOLED_TAX_UPLIFT).toBe(1.25);
    expect(combineHouseholdStrategies(rA, rB).pooled).toBeNull();   // without the needs: the paired figure only
  });

  it('compactStrategyResult keeps what the table reads and nothing heavy', () => {
    const c = compactStrategyResult(res.own.rA ? { affordable: true, ruin: { mc: 1 }, terminal: { p50: 2 }, n: { mc: 40 }, cones: { wealth: { p10: [1], p50: [2], p90: [3] }, income: { p50: [9] } }, samples: { wealth: [[1]] }, survivedMc: [true], futuresMc: {} } : null);
    expect(c).toEqual({ affordable: true, name: undefined, ruin: { mc: 1 }, terminal: { p50: 2 }, n: { mc: 40 }, cones: { wealth: { p10: [1], p50: [2] } } });
    expect(compactStrategyResult({ affordable: false, reason: 'no' })).toEqual({ affordable: false, reason: 'no', name: undefined });
  });
});
