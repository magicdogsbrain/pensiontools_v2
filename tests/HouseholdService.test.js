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

describe('allowanceNudge respects the real withdrawal policy', () => {
  it('a large ISA bridge means NO higher-rate tax and NO bogus nudge', () => {
    // £70k gross-equivalent target but a big ISA: planDrawdown caps SIPP at the BRL and the
    // ISA covers the rest tax-free — taxable stays at the band, so nothing to flag.
    const bigIsa = { baseSalary: 70000, isaBalance: 500000, duration: 30 };
    const modest = { baseSalary: 20000, duration: 30 };
    const n = allowanceNudge(bigIsa, modest, 'Chris', 'Wendy');
    expect(n.overA).toBeLessThanOrEqual(1);   // taxable ≤ BRL (numerical dust only)
    expect(n.message).toBeNull();
  });

  it('without an ISA the higher-rate spend is real and still flagged', () => {
    const rich = { baseSalary: 70000, duration: 30 };
    const modest = { baseSalary: 20000, duration: 30 };
    const n = allowanceNudge(rich, modest, 'Chris', 'Wendy');
    expect(n.overA).toBeGreaterThan(15000);
    expect(n.message).toMatch(/Chris pays 40%/);
  });
});

import { runCareCheck } from '../src/services/HouseholdService.js';

describe('runCareCheck', () => {
  const mk = () => ({ equityStart: 350000, bondStart: 250000, cashStart: 60000,
    equityMin: 100000, bondMin: 80000, cashTarget: 30000, duration: 35, years: 30,
    baseSalary: 34000, other: 0, statePension: 12000, statePensionYear: 5,
    pa: 12570, brl: 50270, taxMode: 'inflates', disableProtection: true,
    protectionMult: 0.8, hodlEnabled: false, hodlValue: 0, isaBalance: 20000 });
  const set = { duration: 30, baseSalary: 34000, statePension: 12000, statePensionYear: 5 };

  it('care years reduce joint success; a heavier burden hurts more', () => {
    const care = runCareCheck({ cfgA: mk(), cfgB: mk(), setA: set, setB: set, who: 'A', startYear: 5, years: 3, annualCost: 90000, runs: 80 });
    expect(care.careJoint).toBeLessThan(care.baselineJoint);
    expect(care.totalCareCost).toBe(270000);
    const heavy = runCareCheck({ cfgA: mk(), cfgB: mk(), setA: set, setB: set, who: 'A', startYear: 5, years: 6, annualCost: 120000, runs: 80 });
    expect(heavy.careJoint).toBeLessThan(care.careJoint);
  });
});

import { startOffset } from '../src/services/HouseholdService.js';

describe('calendar alignment for a partner who is still working', () => {
  it('startOffset = income-start age − age today (0 when retired or unknown)', () => {
    expect(startOffset({ currentAge: 58, shapeAgeNow: 60 })).toBe(2);
    expect(startOffset({ currentAge: 62, shapeAgeNow: 62 })).toBe(0);
    expect(startOffset({})).toBe(0);
  });
  it('timeline: the working partner needs nothing and gets no SP until their plan starts', () => {
    const a = { baseSalary: 30000, duration: 30, currentAge: 58, shapeAgeNow: 60, statePension: 12000, statePensionYear: 7 };
    const b = { baseSalary: 20000, duration: 30, statePension: 11000, statePensionYear: 3 };
    const rows = householdIncomeTimeline(a, b);
    expect(rows[0].workingA).toBe(true);
    expect(rows[0].needA).toBe(0);
    expect(rows[0].needB).toBe(20000);
    expect(rows[2].workingA).toBe(false);
    expect(rows[2].needA).toBe(30000);
    // A's SP is plan year 7 → calendar year 9
    expect(rows[8].spA).toBe(0);
    expect(rows[9].spA).toBe(12000);
    expect(rows[3].spB).toBe(11000);
    expect(rows.length).toBe(33);
  });
  it('Monte Carlo: shifting a plan by its offset leaves its own success rate unchanged in shape and runs it on later market years', () => {
    const cfg = (o = {}) => ({ equityStart: 150000, bondStart: 100000, cashStart: 30000, isaBalance: 0, baseSalary: 12000, years: 20, pa: 12570, brl: 50270, hrl: 125140, ...o });
    const r0 = runHouseholdMonteCarlo(cfg(), cfg(), 60, { a: 0, b: 0 });
    const r2 = runHouseholdMonteCarlo(cfg(), cfg(), 60, { a: 0, b: 2 });
    expect(r2.potFan.length).toBe(23);
    expect(r2.successA).toBe(r0.successA);
    expect(r2.potFan[0].p50).toBeCloseTo(r0.potFan[0].p50, -3);
  });
});

import { combineHouseholdStrategies } from '../src/services/HouseholdService.js';
describe('household with each partner on their own strategy', () => {
  it('pairs futures by index and sums the wealth samples', () => {
    const rA = { survivedMc: [true, true, false, true], samples: { wealth: [[100, 90], [100, 80]] }, cones: { wealth: { p50: [] } } };
    const rB = { survivedMc: [true, false, false, true], samples: { wealth: [[50, 60], [50, 40]] }, cones: { wealth: { p50: [] } } };
    const r = combineHouseholdStrategies(rA, rB);
    expect(r.runs).toBe(4);
    expect(r.successA).toBeCloseTo(0.75, 5);
    expect(r.successB).toBeCloseTo(0.5, 5);
    expect(r.jointSuccess).toBeCloseTo(0.5, 5);
    expect(r.potFan[0].p50).toBe(150);
    expect(r.byStrategy).toBe(true);
  });
});
