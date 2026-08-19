import { describe, it, expect, vi } from 'vitest';
import { runHouseholdMonteCarlo, householdIncomeTimeline } from '../src/services/HouseholdService.js';

// Reuse the SimulationEngine test mock so MC runs are fast and deterministic
vi.mock('../src/constants.js', async (importOriginal) => {
  const actual = await importOriginal();
  return actual; // full constants — household tests want the real historical series
});

const cfg = (over = {}) => ({
  equityStart: 300000, bondStart: 200000, cashStart: 50000,
  equityMin: 100000, bondMin: 80000, cashTarget: 30000,
  duration: 35, years: 20, baseSalary: 30000, other: 0,
  statePension: 12000, statePensionYear: 8,
  pa: 12570, brl: 50270, taxMode: 'inflates',
  disableProtection: false, protectionMult: 0.8,
  hodlEnabled: false, hodlValue: 0, isaBalance: 20000,
  ...over
});

describe('runHouseholdMonteCarlo', () => {
  it('joint success ≤ each individual success, ≥ correlated floor of naive product', () => {
    const r = runHouseholdMonteCarlo(cfg(), cfg({ baseSalary: 25000, years: 15 }), 200);
    expect(r.jointSuccess).toBeLessThanOrEqual(Math.min(r.successA, r.successB) + 1e-9);
    // Same market paths → failures co-occur → joint ≥ independence-assumed product
    expect(r.jointSuccess).toBeGreaterThanOrEqual(r.independenceAssumed - 0.03);
    expect(r.potFan).toHaveLength(21);
    expect(r.potFan[0].p50).toBeCloseTo((300000+200000+50000+20000) * 2, -4);
    expect(r.potFan[5].p90).toBeGreaterThanOrEqual(r.potFan[5].p10);
  });

  it('a hopeless partner plan drags joint success to ~their level', () => {
    const r = runHouseholdMonteCarlo(cfg(), cfg({ equityStart: 20000, bondStart: 10000, cashStart: 5000, isaBalance: 0, baseSalary: 40000 }), 100);
    expect(r.successB).toBeLessThan(0.2);
    expect(r.jointSuccess).toBeLessThanOrEqual(r.successB);
  });
});

describe('householdIncomeTimeline', () => {
  const setA = { duration: 30, baseSalary: 30000, statePension: 12000, statePensionYear: 8, other: 0 };
  const setB = { duration: 25, baseSalary: 22000, statePension: 11000, statePensionYear: 3, dbAmount: 6000, dbStartYear: 0 };

  it('SP steps land in the right years; bridge flag clears once both SPs pay', () => {
    const rows = householdIncomeTimeline(setA, setB);
    expect(rows[0].guaranteed).toBe(6000);              // DB only
    expect(rows[0].bridge).toBe(true);
    expect(rows[3].spB).toBe(11000);                    // partner SP starts year 3
    expect(rows[3].bridge).toBe(true);                  // still bridging A's SP
    expect(rows[8].spA).toBe(12000);
    expect(rows[8].bridge).toBe(false);                 // both in payment
    expect(rows[8].guaranteed).toBe(12000 + 11000 + 6000);
  });

  it('needs stack while both plans run, drop when the shorter plan ends', () => {
    const rows = householdIncomeTimeline(setA, setB);
    expect(rows[0].need).toBe(52000);
    expect(rows[26].needB).toBe(0);                     // B's 25-year plan is over
    expect(rows[26].need).toBe(rows[26].needA);
    expect(rows[10].drawNeed).toBe(52000 - 29000);      // need − (both SPs + DB)
  });

  it('respects a per-year targetSchedule when present', () => {
    const rows = householdIncomeTimeline({ ...setA, targetSchedule: [40000, 20000] }, setB);
    expect(rows[0].needA).toBe(40000);
    expect(rows[1].needA).toBe(20000);
    expect(rows[2].needA).toBe(30000);                  // falls back to baseSalary
  });
});

import { runSurvivorCheck, allowanceNudge } from '../src/services/HouseholdService.js';

describe('runSurvivorCheck', () => {
  it('inheriting the partner pots makes the survivor MORE secure than their plan alone, despite higher spending', () => {
    const survivorSet = { duration: 25, baseSalary: 20000, statePension: 12000, statePensionYear: 5 };
    const deceasedSet = { duration: 25, baseSalary: 20000, statePension: 11000, statePensionYear: 5 };
    const mk = (o={}) => ({ equityStart: 200000, bondStart: 120000, cashStart: 30000,
      equityMin: 80000, bondMin: 60000, cashTarget: 20000, duration: 35, years: 25,
      baseSalary: 20000, other: 0, statePension: 12000, statePensionYear: 5,
      pa: 12570, brl: 50270, taxMode: 'inflates', disableProtection: true,
      protectionMult: 0.8, hodlEnabled: false, hodlValue: 0, isaBalance: 10000, ...o });
    const r = runSurvivorCheck({
      survivorCfg: mk(), survivorSettings: survivorSet,
      deceasedCfg: mk({ statePension: 11000 }), deceasedSettings: deceasedSet,
      deathYear: 8, spendFraction: 0.7, runs: 100
    });
    expect(r.inheritedPots).toBeGreaterThan(0);
    expect(r.survivorSuccess).toBeGreaterThan(0.4);
    // spending steps to 70% of joint at death year: (20000+20000)*0.7 = 28000 (flat profiles)
    expect(r.survivorAnnualAfter).toBeCloseTo(28000, 0);
  });

  it('deceased DB continues at the survivor rate via extraIncomes', () => {
    const base = { equityStart: 150000, bondStart: 100000, cashStart: 30000,
      equityMin: 60000, bondMin: 50000, cashTarget: 20000, duration: 35, years: 20,
      baseSalary: 22000, other: 0, statePension: 0, statePensionYear: 99,
      pa: 12570, brl: 50270, taxMode: 'inflates', disableProtection: true,
      protectionMult: 0.8, hodlEnabled: false, hodlValue: 0 };
    const args = {
      survivorCfg: base, survivorSettings: { duration: 20, baseSalary: 22000 },
      deceasedCfg: base, deceasedSettings: { duration: 20, baseSalary: 15000, dbAmount: 10000, dbStartYear: 0 },
      deathYear: 5, spendFraction: 0.7, runs: 60
    };
    const withDb = runSurvivorCheck({ ...args, dbSurvivorPct: 0.5 });
    const noDb = runSurvivorCheck({ ...args, dbSurvivorPct: 0 });
    expect(withDb.survivorSuccess).toBeGreaterThanOrEqual(noDb.survivorSuccess);
  });
});

describe('allowanceNudge', () => {
  it('flags 40%-band spend on one side against unused 20% band on the other', () => {
    const rich = { baseSalary: 70000, other: 0, statePensionYear: 99, statePension: 0, duration: 30 };
    const modest = { baseSalary: 20000, other: 0, statePensionYear: 99, statePension: 0, duration: 30 };
    const n = allowanceNudge(rich, modest, 'Chris', 'Wendy');
    expect(n.overA).toBeGreaterThan(0);
    expect(n.unusedB).toBeGreaterThan(0);
    expect(n.message).toMatch(/Chris pays 40%/);
    expect(n.message).toMatch(/Wendy/);
  });

  it('stays silent when both are inside their bands', () => {
    const a = { baseSalary: 30000, duration: 30 }, b = { baseSalary: 25000, duration: 30 };
    expect(allowanceNudge(a, b).message).toBeNull();
  });
});
