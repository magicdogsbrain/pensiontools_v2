/**
 * How ISAs and savings grow, in the strategies (src/strategies; research/saver-lock-and-savings-growth.md 2b, test 7).
 *
 *   - The plan every strategy is judged on carries the choice to Pots & Valves and Buckets in order through their engine
 *     config (pnvCfg spreads the config the one builder made), so their figures move with it when the plan has an ISA.
 *   - The bought strategies (both ladders, the rotation, the floor-and-flex family, bridge and engine) spend the ISA as part
 *     of their own pot — it becomes rungs or the strategy's own invested part — so the choice does not change them:
 *     whole results, identical under no choice, "Mostly cash" and "Invested like my pension".
 */
import { describe, it, expect } from 'vitest';
import { planFromSettings, stressTestStrategy, STRATEGY_NAMES } from '../src/strategies/stressTest.js';
import { createSimulationConfigFromSettings, getStressSettings } from '../src/storage/StressRepository.js';

const asText = (x) => JSON.stringify(x, (k, v) => (typeof v === 'function' ? String(v) : v));
const settings = { ...getStressSettings(), equityMin: 545400, bondMin: 424200, cashTarget: 242400, isaBalance: 160000, baseSalary: 60000, duration: 34, shapeAgeNow: 57, currentAge: 56, statePension: 11973, statePensionYear: 10, configured: true, chargesPct: 0.5 };
const now = new Date('2026-10-01T12:00:00Z');
const planAt = (isaGrowth, extra = {}) => {
  const s = { ...settings, ...extra, ...(isaGrowth ? { isaGrowth } : {}) };
  return { ...planFromSettings(s, createSimulationConfigFromSettings({}, s), { startAge: 57, now }), mcRuns: 60, stride: 12 };
};
const ENGINE_RUN = new Set(['pots-and-valves', 'buckets-in-order']);

describe('the plan carries the choice to the strategies that run the monthly engine', () => {
  it('planFromSettings: Pots & Valves\' config carries the choice when the plan has one, and nothing when it has none', () => {
    expect(planAt('cash').pnvCfg.isaGrowth).toBe('cash');
    expect(planAt('invested').pnvCfg.isaGrowth).toBe('invested');
    expect('isaGrowth' in planAt(null).pnvCfg).toBe(false);
    expect('isaGrowthMix' in planAt('invested').pnvCfg).toBe(false);       // the engine reads the run's own pots
  });

  it('Pots & Valves and Buckets in order move with the ISA choice; with no ISA they do not', () => {
    for (const id of ENGINE_RUN) {
      const none = asText(stressTestStrategy(id, planAt(null)));
      expect(asText(stressTestStrategy(id, planAt('cash'))), id).not.toBe(none);
      expect(asText(stressTestStrategy(id, planAt('invested'))), id).not.toBe(none);
      const noIsa = asText(stressTestStrategy(id, planAt(null, { isaBalance: 0 })));
      expect(asText(stressTestStrategy(id, planAt('cash', { isaBalance: 0 }))), id).toBe(noIsa);
      expect(asText(stressTestStrategy(id, planAt('invested', { isaBalance: 0 }))), id).toBe(noIsa);
    }
  }, 120_000);
});

describe('the bought strategies spend the ISA as part of their own pot: the choice does not change them', () => {
  it('every bought strategy, whole result: no choice = "Mostly cash" = "Invested like my pension"', () => {
    const bought = Object.keys(STRATEGY_NAMES).filter((id) => !ENGINE_RUN.has(id));
    expect(bought.length).toBeGreaterThanOrEqual(7);
    const p0 = planAt(null), pc = planAt('cash'), pi = planAt('invested');
    for (const id of bought) {
      const a = asText(stressTestStrategy(id, p0));
      expect(asText(stressTestStrategy(id, pc)), id).toBe(a);
      expect(asText(stressTestStrategy(id, pi)), id).toBe(a);
    }
  }, 120_000);
});
