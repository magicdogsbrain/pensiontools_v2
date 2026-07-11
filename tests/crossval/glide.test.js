/**
 * Cross-validation with the bond tent (rising-equity glidepath) ON.
 *
 * The Stress engine and the Decision engine share GlidepathService.glideShareForYear, so with the tent
 * enabled both must still land on the SAME monthly SIPP + ISA withdrawal — otherwise the "you are here /
 * rebalance" advice the Decision Tool gives would diverge from the plan the Stress Tester scored. This
 * pins that: replay a tent-on Monte-Carlo trajectory month-by-month through the real Decision engine and
 * require agreement to the penny (the same guarantee replay.test.js makes for the tent-off path).
 */
import { describe, it, expect } from 'vitest';
import { simulateTraced, monteCarloReturns } from '../../src/services/SimulationEngine.js';
import { calcDecisionPWA } from '../../src/services/legacyDecision.js';
import { buildDecisionContext, aprilDate, summarize } from './harness.js';
import { equityGlideFromRisk } from '../../src/services/GlidepathService.js';

// Balanced 50/40/10, £500k, with the bond tent ON (equityGlide derived from the split, as the app does).
const base = {
  equityStart: 250000, bondStart: 200000, cashStart: 50000,
  equityMin: 250000, bondMin: 200000, cashTarget: 50000,
  years: 35, duration: 35, baseSalary: 40000, other: 0,
  statePension: 9000, statePensionYear: 8,
  pa: 12570, brl: 50270, hrl: 125140, taxMode: 'inflates',
  protectionMult: 0.8, consecutiveLimit: 3, disableProtection: true,
  hodlEnabled: false, hodlValue: 0,
  isaBalance: 150000, isaDrawdownStrategy: 'minimiseEarlyTax',
  equityGlide: equityGlideFromRisk(250000, 200000)
};

async function replayGlide(config, seed) {
  const returns = monteCarloReturns(config, seed);
  const sim = simulateTraced(config, seed);
  const { settings, allTaxYears } = buildDecisionContext(config, sim.trace, returns);
  settings.equityGlide = config.equityGlide; // hand the Decision engine the same glide the sim used
  const rows = [];
  for (const t of sim.trace) {
    const dec = await calcDecisionPWA(aprilDate(t.month), t.equityStart, t.bondStart, t.cashStart, {
      settings, history: [], allTaxYears, spInfo: { amount: t.planInputs.statePension }, isaBalance: t.isaStart
    });
    rows.push({
      decSipp: dec.sippDraw, decIsa: dec.isaDraw,
      dSipp: dec.sippDraw - t.sippMonthly, dIsa: dec.isaDraw - t.isaMonthly
    });
  }
  return rows;
}

describe('cross-validation: bond tent (rising-equity glidepath) ON', () => {
  it('the Decision engine reproduces the Stress trajectory to the penny with the tent on (50 seeds)', async () => {
    const all = [];
    for (let seed = 1; seed <= 50; seed++) all.push(...await replayGlide(base, seed));
    const s = summarize(all);
    expect(s.nonFiniteRows).toBe(0);
    expect(s.maxAbsSippDivergence).toBeLessThan(0.01);
    expect(s.maxAbsIsaDivergence).toBeLessThan(0.01);
  });
});
