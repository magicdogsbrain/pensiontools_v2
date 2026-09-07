/**
 * Windfalls reach the bought strategies. Before this, `lumpyByYear` handled extra incomes and
 * one-off spends but not one-off RECEIPTS, so every ladder / floor strategy was judged without
 * the lump sum the plan expected — a bias against them in the ranked table. The lump now pays the
 * need from its year onward (buying the rungs), and the unspent balance counts as wealth.
 */
import { describe, it, expect, vi } from 'vitest';
vi.mock('../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));

import { createSimulationConfigFromSettings } from '../src/storage/StressRepository.js';
import { stressTestStrategy, planFromSettings, lumpyByYear, applyWindfallsToNeed } from '../src/strategies/stressTest.js';

const base = {
  duration: 30, other: 0, pa: 12570, brl: 50270, hrl: 125140, taxMode: 'inflates',
  protectionMult: 0.8, consecutiveLimit: 3, disableProtection: false, recoveryBuffer: 15000,
  hodlEnabled: false, hodlValue: 0, isaReturn: 0.03, statePension: 11500, statePensionYear: 10,
  equityMin: 480000, bondMin: 240000, cashTarget: 80000, isaBalance: 0, baseSalary: 40000
};
const FAST = { mcRuns: 60, stride: 12 };
const plan = (settings) => { const cfg = createSimulationConfigFromSettings({}, settings); return { ...planFromSettings(settings, cfg), ...FAST }; };

describe('windfalls reach the bought strategies', () => {
  it('applyWindfallsToNeed: the lump pays its year and carries forward until spent', () => {
    const r = applyWindfallsToNeed([30000, 30000, 30000, 30000], [0, 70000, 0, 0]);
    expect(r.usedByYear).toEqual([0, 30000, 30000, 10000]);
    expect(r.carryByYear).toEqual([0, 40000, 10000, 0]);
  });

  it('lumpyByYear reports windfalls per year in today\'s money (a level £ is deflated)', () => {
    const cfg = { windfalls: [{ year: 4, amount: 50000 }, { year: 4, amount: 10000, indexation: 'level' }] };
    const { windfallByYear } = lumpyByYear({}, cfg, 6);
    expect(windfallByYear[4]).toBeCloseTo(50000 + 10000 / Math.pow(1.025, 4), 6);
    expect(windfallByYear[3]).toBe(0);
  });

  it('a £150k lump in year 5 removes the need the ladder must buy from year 5 until it is spent, and is wealth meanwhile', () => {
    const with_ = plan({ ...base, windfalls: [{ year: 5, amount: 150000 }] });
    expect(with_.windfallByYear[5]).toBe(150000);
    for (let y = 0; y < 5; y++) expect(with_.targetSchedule[y]).toBe(with_.needByYear[y]);
    expect(with_.targetSchedule[5]).toBe(0);
    expect(with_.targetSchedule[6]).toBe(0);
    expect(with_.targetSchedule[7]).toBe(0);                                   // 3 × £40k = £120k
    expect(with_.targetSchedule[8]).toBeCloseTo(with_.needByYear[8] - 30000, 6);
    expect(with_.windfallCarryByYear[5]).toBe(110000);
    expect(with_.windfallCarryByYear[8]).toBe(0);
    expect(with_.otherIncomeByYear[5]).toBe(40000);                           // it shows as income that year
    expect(plan(base).windfallCarryByYear).toBeNull();
  });

  it('an EXISTING taxable account (GIA) is day-one money for every bought strategy — not only the P&V engine', () => {
    const with_ = plan({ ...base, taxableStart: 120000 });
    expect(with_.windfallByYear[0]).toBe(120000);
    expect(with_.targetSchedule[0]).toBe(0);                                   // it buys the first rungs
    expect(with_.targetSchedule[1]).toBe(0);
    expect(with_.targetSchedule[2]).toBe(0);                                   // 3 × £40k
    expect(with_.targetSchedule[3]).toBe(with_.needByYear[3]);
    expect(with_.windfallCarryByYear[0]).toBe(80000);
    expect(with_.pnvCfg.taxableStart).toBe(120000);                            // P&V holds it as its sleeve (no double count: pnvCfg keeps the raw schedule)
    const without = plan(base);
    let checked = 0;
    for (const id of ['full-il-gilt', 'floor-the-schedule', 'ladder-and-ratchet', 'floor-to-age']) {
      const a = stressTestStrategy(id, without), b = stressTestStrategy(id, with_);
      if (!a.affordable || !b.affordable) continue;
      expect(b.terminal.p50, id).toBeGreaterThan(a.terminal.p50);
      checked++;
    }
    expect(checked).toBeGreaterThanOrEqual(3);
  });

  it('every bought strategy is better off with the lump — and the P&V engine still handles it itself', () => {
    const without = plan(base);
    const with_ = plan({ ...base, windfalls: [{ year: 5, amount: 150000 }] });
    let checked = 0;
    for (const id of ['full-il-gilt', 'floor-the-schedule', 'ladder-and-ratchet', 'bridge-and-engine', 'floor-to-age']) {
      const a = stressTestStrategy(id, without), b = stressTestStrategy(id, with_);
      if (!a.affordable || !b.affordable) continue;
      expect(b.terminal.p50, id).toBeGreaterThan(a.terminal.p50);
      expect(b.cones.wealth.p50[5], id).toBeGreaterThan(a.cones.wealth.p50[5]);
      checked++;
    }
    expect(checked).toBeGreaterThanOrEqual(3);
    const pnv = stressTestStrategy('pots-and-valves', with_);
    expect(pnv.affordable).toBe(true);
    expect(with_.pnvCfg.windfalls).toEqual([{ year: 5, amount: 150000 }]);
  });
});
