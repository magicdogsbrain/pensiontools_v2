/**
 * Year 0 pays for the months it has, on Pots & Valves and Buckets in order too (check round 2; walks3 W4-M5, W6-H4). The
 * gilt ladder already buys only the months from the stop to March; the pots paid all twelve, so the list of ways compared a
 * ladder that pays 5 months with pots that pay 12.
 *
 * A fictional plan: Pat wants £40,000 a year before tax, all from the pots (no State Pension or other pension yet in this
 * sketch). Pat's first plan year starts in November (5 months: November to March). Prices flat, so every figure is today's
 * money. Worked by hand:
 *   from the pots, a month         40,000 ÷ 12 = 3,333.33
 *   April to October (7 months)    nothing from the pots: Pat is still at work
 *   November to March (5 months)   5 × 3,333.33 = 16,666.67 (it took 12 × 3,333.33 = 40,000)
 *   year 1 and on                  12 months as always
 */
import { describe, it, expect, vi } from 'vitest';
vi.mock('../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));

import { createSimulationConfigFromSettings } from '../src/storage/StressRepository.js';
import { stressTestStrategy, planFromSettings } from '../src/strategies/stressTest.js';
import { simulate } from '../src/services/SimulationEngine.js';

const NOW = new Date('2026-11-18T12:00:00Z');
const pat = {
  configured: true, duration: 25, other: 0, pa: 12570, brl: 50270, hrl: 125140, taxMode: 'inflates',
  protectionMult: 0.8, consecutiveLimit: 3, disableProtection: false, recoveryBuffer: 0,
  hodlEnabled: false, hodlValue: 0, isaReturn: 0.03, spStartDate: null, spWeeklyAmount: 0, statePension: 0,
  dbAmount: 0, dbStartYear: 0, dbIndexation: 'cpi',
  equityMin: 400000, bondMin: 100000, cashTarget: 40000, isaBalance: 0, baseSalary: 40000,
  incomeShape: 'phases', incomeSteps: [{ fromAge: 68, amount: 40000 }], shapeAgeNow: 68, currentAge: 68
};
const base = planFromSettings(pat, createSimulationConfigFromSettings({}, pat), { now: NOW });
const flat = { equity: Array(30).fill(0), inflation: Array(30).fill(1e-12) };   // 0 would read as "none given" (2.5%)
// protection off: flat prices put the pots under their glidepath, and a cut would hide the sum being tested
const run = (cfg) => simulate({ ...cfg, years: 25, trace: true, disableProtection: true }, flat, 1).trace;
const sum = (rows) => rows.reduce((t, r) => t + (r.effectiveSipp || 0) + (r.effectiveIsa || 0), 0);

describe('Pots & Valves: year 0 pays for the months it has', () => {
  it('nothing April to October; 5 × £3,333.33 = £16,666.67 November to March; year 1 whole', () => {
    const whole = run(base.pnvCfg);
    const part = run({ ...base.pnvCfg, year0Months: 5 });
    expect(sum(whole.slice(0, 12))).toBeCloseTo(40000, 0);
    expect(sum(part.slice(0, 7))).toBe(0);
    expect(sum(part.slice(7, 12))).toBeCloseTo(16666.67, 0);
    expect(sum(part.slice(12, 24))).toBeCloseTo(40000, 0);
  });
  it('a plan whose year 0 starts in the stop month runs it so: planFromSettings passes the months to the pots', () => {
    const p = { ...base, year0Months: 5, pnvCfg: { ...base.pnvCfg, year0Months: 5 }, mcRuns: 20, stride: 12 };
    const r = stressTestStrategy('pots-and-valves', p);
    // the income cone's year 0 holds the 5 months: 5 × 3,333.33 = 16,666.67 — never twelve months' (40,000)
    expect(r.cones.income.p50[0]).toBeCloseTo(40000 * 5 / 12, -1);
    expect(r.cones.income.p50[1]).toBeCloseTo(40000, -1);
    // the months before the stop are not a lean 12 months: the worst 12 months are those of the whole-year plan
    const whole = stressTestStrategy('pots-and-valves', { ...base, mcRuns: 20, stride: 12 });
    expect(r.worst12.min).toBeGreaterThanOrEqual(whole.worst12.min - 1);
  });
  it('Buckets in order: the same months', () => {
    const p = { ...base, year0Months: 5, pnvCfg: { ...base.pnvCfg, year0Months: 5 }, mcRuns: 20, stride: 12 };
    expect(stressTestStrategy('buckets-in-order', p).cones.income.p50[0]).toBeCloseTo(40000 * 5 / 12, -1);
  });
});

/**
 * The bought ways buy the same share of year 0 (the floors, Bridge & engine, Ladder & Ratchet's base ladder). Pat as above:
 * £40,000 a year, nothing coming anyway. Worked by hand:
 *   year 1 (plan year 0) bought   40,000 × 5 ÷ 12 = 16,666.67 (it bought 40,000)
 *   year 2 bought                 40,000, a whole year
 *   the lowest year drawn         40,000 (the year's rate; the part year is not a lower step)
 */
import { deriveCompareConfigs } from '../src/strategies/compareRunner.js';

describe('the bought ways buy year 0 for the months it has', () => {
  // pots large enough for every way to be bought (£1,250,000)
  const rich = { ...pat, equityMin: 950000, bondMin: 200000, cashTarget: 100000 };
  const big = planFromSettings(rich, createSimulationConfigFromSettings({}, rich), { now: NOW });
  const part = deriveCompareConfigs({ ...big, year0Months: 5 });
  const whole = deriveCompareConfigs(big);
  it('floors and Bridge & engine: £16,666.67 for year 0, £40,000 after; the lowest year £40,000', () => {
    for (const c of [part.fs, part.fa, part.be]) {
      expect(c.floorDraw(1)).toBeCloseTo(16666.67, 2);
      expect(c.floorDraw(2)).toBe(40000);
    }
    expect(part.scheduleMin).toBe(40000);
    // 40,000 − 16,666.67 = 23,333.33 less to buy for year 0, discounted one year at the curve's first-year yield (under 5%)
    expect(part.fsFloorCost).toBeLessThan(whole.fsFloorCost - 23333.33 / 1.05);
    expect(part.fsFloorCost).toBeGreaterThan(whole.fsFloorCost - 23334);
  });
  it('Ladder & Ratchet: its schedule pays £16,666.67 in year 0', () => {
    expect(part.lr.profile.values[0]).toBeCloseTo(16666.67, 2);
    expect(part.lr.profile.values[1]).toBe(40000);
    expect(part.lr.drawNetOfSp(1)).toBeCloseTo(16666.67, 2);
  });
});
