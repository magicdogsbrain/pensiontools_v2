/**
 * "If I switched my plan between the three strategies and stress-tested each, would I see the
 * same numbers the Strategies compare shows?" — pinned here. Both surfaces must run the SAME
 * function on the SAME plan (planFromSettings → stressTestStrategy), so switching the locked
 * strategy in Settings and pressing Run reproduces the compare row exactly, cones included.
 */
import { describe, it, expect, vi } from 'vitest';

vi.mock('../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));

import { createSimulationConfigFromSettings } from '../src/storage/StressRepository.js';
import { stressTestStrategy, stressTestAll, planFromSettings, STRATEGY_NAMES } from '../src/strategies/stressTest.js';
import { runCompare } from '../src/strategies/compareRunner.js';
import { realYieldForYear } from '../src/services/LinkerUniverse.js';

const base = {
  duration: 30, other: 0, pa: 12570, brl: 50270, hrl: 125140, taxMode: 'inflates',
  protectionMult: 0.8, consecutiveLimit: 3, disableProtection: false, recoveryBuffer: 15000,
  hodlEnabled: false, hodlValue: 0, isaReturn: 0.03, statePension: 11500, statePensionYear: 10
};
const PERSONAS = {
  'comfortable 600k+150k ISA, £36k': { ...base, equityMin: 360000, bondMin: 180000, cashTarget: 60000, isaBalance: 150000, baseSalary: 36000 },
  'four-percent 500k, £20k, no SP': { ...base, equityMin: 300000, bondMin: 150000, cashTarget: 50000, isaBalance: 0, baseSalary: 20000, statePension: 0, statePensionYear: 99 },
  'reckless 250k, £25k': { ...base, equityMin: 150000, bondMin: 75000, cashTarget: 25000, isaBalance: 0, baseSalary: 25000 },
  'ladder-tuned 800k, £40k, 12y ladder, calendar': { ...base, equityMin: 480000, bondMin: 240000, cashTarget: 80000, isaBalance: 0, baseSalary: 40000,
    strategyParams: { ladderYears: 12, drawAnnual: 38000, triggerMode: 'calendar', essentialsAnnual: 24000, horizonAge: 90, sleeveRate: 0.035 } }
};
const IDS = Object.keys(STRATEGY_NAMES);
const FAST = { mcRuns: 120, stride: 6 };

/** What the Stress tab runs when the plan is LOCKED to `id` (settings.strategyId). */
function lockedPlanStress(settings, id) {
  const locked = { ...settings, strategyId: id };
  const cfg = createSimulationConfigFromSettings({}, locked);
  const p = { ...planFromSettings(locked, cfg, { yieldForYear: realYieldForYear }), ...FAST };
  return stressTestStrategy(locked.strategyId, p);
}
/** What the Strategies tab shows: all three on the same plan. */
function compareTab(settings) {
  const cfg = createSimulationConfigFromSettings({}, settings);
  const p = { ...planFromSettings(settings, cfg, { yieldForYear: realYieldForYear }), ...FAST };
  return { all: stressTestAll(p), legacy: runCompare(p), p };
}
const strip = (r) => { const { configs, ...rest } = r; return JSON.parse(JSON.stringify(rest)); };

describe('switching strategies: locked-plan stress test == the Strategies compare row', () => {
  for (const [name, settings] of Object.entries(PERSONAS)) {
    it(`${name}: every strategy agrees across both surfaces, cones included`, () => {
      const { all, legacy, p } = compareTab(settings);
      for (const id of IDS) {
        const locked = lockedPlanStress(settings, id);
        expect(strip(locked)).toEqual(strip(all.strategies[id]));
        if (locked.affordable) {
          const t = legacy.strategies[id].table;
          expect(t.ruinPct).toBe(locked.ruin.hist);
          expect(t.ruinPctMc).toBe(locked.ruin.mc);
          expect(t.worst12Min).toBe(locked.worst12.min);
          expect(t.terminalMedian).toBe(locked.terminal.p50);
          expect(legacy.strategies[id].cones).toEqual(locked.cones);
        } else {
          expect(legacy.strategies[id]).toBeUndefined();
          expect(locked.reason).toMatch(/costs/);
        }
      }
      // The plan itself is one object: same pot, target, SP for all three
      expect(p.pot).toBe(settings.equityMin + settings.bondMin + settings.cashTarget);
      expect(p.spStartYear).toBe(settings.statePensionYear);
    });
  }

  it('cones are well-formed: p10 ≤ p25 ≤ p50 ≤ p75 ≤ p90, full length, wealth starts at the whole pot', () => {
    const settings = PERSONAS['comfortable 600k+150k ISA, £36k'];
    const { all, p } = compareTab(settings);
    for (const id of IDS) {
      const r = all.strategies[id];
      expect(r.affordable).toBe(true);
      for (const key of ['wealth', 'income']) {
        const c = r.cones[key];
        expect(c.years.length).toBe(p.durationYears + 1);
        for (let y = 0; y <= p.durationYears; y++) {
          expect(c.p10[y]).toBeLessThanOrEqual(c.p25[y] + 1e-6);
          expect(c.p25[y]).toBeLessThanOrEqual(c.p50[y] + 1e-6);
          expect(c.p50[y]).toBeLessThanOrEqual(c.p75[y] + 1e-6);
          expect(c.p75[y]).toBeLessThanOrEqual(c.p90[y] + 1e-6);
          expect(Number.isFinite(c.p50[y])).toBe(true);
        }
      }
      // Year 0 wealth = everything the plan holds (ladders count their unpaid rungs at cost)
      expect(r.cones.wealth.p50[0]).toBeCloseTo(p.pot + p.isa, -3);
      expect(r.cones.wealth.p10[0]).toBeCloseTo(r.cones.wealth.p90[0], -3);
    }
  });

  it('the strategies genuinely differ on the same plan (a switch changes what you see)', () => {
    const { all } = compareTab(PERSONAS['comfortable 600k+150k ISA, £36k']);
    const pv = all.strategies['pots-and-valves'], lr = all.strategies['ladder-and-ratchet'], ff = all.strategies['floor-and-flex'];
    expect(ff.ruin.mc).toBe(0);
    expect(ff.guaranteedToAge).toMatch(/by contract/);
    expect(lr.guaranteedToAge).toMatch(/^72 by contract/);
    expect(lr.worst12.median).toBe(36000);
    expect(new Set([pv.terminal.p50, lr.terminal.p50, ff.terminal.p50]).size).toBe(3);
    expect(pv.cones.income.p50[5]).not.toBe(ff.cones.income.p50[5]);
  });

  it('saved strategy parameters drive both surfaces (ladder years, draw, trigger, essentials, horizon, rate)', () => {
    const settings = PERSONAS['ladder-tuned 800k, £40k, 12y ladder, calendar'];
    const { all } = compareTab(settings);
    const lr = all.strategies['ladder-and-ratchet'], ff = all.strategies['floor-and-flex'];
    expect(all.configs.lr.ladderYears).toBe(12);
    expect(all.configs.lr.draw).toBe(38000);
    expect(all.configs.lr.trigger.mode).toBe('calendar');
    expect(lr.guaranteedToAge).toMatch(/^69 by contract/);
    expect(all.configs.ff.horizonAge).toBe(87);   // 90 asked, capped by the 30-year plan (57+30)
    expect(all.configs.ff.rate).toBe(0.035);
    expect(ff.guaranteedToAge).toBe('87 by contract (essentials)');
    expect(lockedPlanStress(settings, 'ladder-and-ratchet').signature.ladderYears).toBe(12);
  });

  it('plausibility on the corrected market data: a 4% plan rarely fails, a 10% plan usually does', () => {
    const four = compareTab(PERSONAS['four-percent 500k, £20k, no SP']).all.strategies['pots-and-valves'];
    const reckless = compareTab(PERSONAS['reckless 250k, £25k']).all.strategies['pots-and-valves'];
    expect(four.ruin.mc).toBeLessThan(12);
    expect(reckless.ruin.mc).toBeGreaterThan(50);
    expect(reckless.failAges.length).toBeGreaterThan(0);
  });

  it('ladder rungs are priced on the live real-yield curve, not a flat 2.3%', () => {
    const settings = PERSONAS['comfortable 600k+150k ISA, £36k'];
    const cfg = createSimulationConfigFromSettings({}, settings);
    const live = planFromSettings(settings, cfg, { yieldForYear: realYieldForYear });
    const flat = planFromSettings(settings, cfg, {});
    const a = stressTestAll({ ...live, ...FAST }).configs.baseLadderCost;
    const b = stressTestAll({ ...flat, ...FAST }).configs.baseLadderCost;
    expect(a).not.toBe(b);
    expect(Math.abs(a - b) / b).toBeLessThan(0.25);   // same order of magnitude — sanity
  });
});

describe('worst-12-months is measured on a gross-equivalent basis', () => {
  it('with spending cuts off, a surviving ISA-funded plan lives on its full target; with cuts on, exactly the cut SIPP + grossed-up ISA', () => {
    const settings = { ...PERSONAS['comfortable 600k+150k ISA, £36k'], baseSalary: 60000, equityMin: 800000, bondMin: 400000, cashTarget: 100000, isaBalance: 200000 };
    const off = lockedPlanStress({ ...settings, disableProtection: true }, 'pots-and-valves');
    expect(off.worst12.median).toBeCloseTo(60000, -1);       // full gross target every year
    const on = lockedPlanStress(settings, 'pots-and-valves');
    // A 20% cut applies to the SIPP draw only; the ISA top-up (grossed up) is untouched, so the
    // worst year sits between 80% and 100% of the target — never below the cut.
    expect(on.worst12.min).toBeGreaterThanOrEqual(0.78 * 60000);   // ≈20% (band effects at the margin)
    expect(on.worst12.min).toBeLessThan(60000);
  });
});

describe('stepped income (60k to 72, 50k to 80, 40k after) reaches every strategy', () => {
  const stepped = { ...PERSONAS['comfortable 600k+150k ISA, £36k'], equityMin: 720000, bondMin: 360000, cashTarget: 120000, isaBalance: 60000,
    baseSalary: 60000, duration: 35, incomeShape: 'phases', shapeAgeNow: 57,
    incomeSteps: [{ fromAge: 57, amount: 60000 }, { fromAge: 73, amount: 50000 }, { fromAge: 80, amount: 40000 }] };
  it('compiles a per-year schedule when the saved one is missing, and the P&V worst year is a 40k year', () => {
    const cfg = createSimulationConfigFromSettings({}, stepped);
    expect(cfg.targetSchedule.length).toBe(36);                 // compiled from the steps at the config seam (old saves have no schedule)
    expect(cfg.targetSchedule[23]).toBe(40000);
    const p = planFromSettings(stepped, cfg, { yieldForYear: realYieldForYear });
    expect(p.targetSchedule.length).toBe(36);
    expect(p.targetSchedule[0]).toBe(60000);
    expect(p.targetSchedule[16]).toBe(50000);                    // age 73
    expect(p.targetSchedule[23]).toBe(40000);                    // age 80
    const pv = stressTestStrategy('pots-and-valves', { ...p, ...FAST, pnvCfg: { ...p.pnvCfg, disableProtection: true } });
    expect(pv.worst12.median).toBeCloseTo(40000, -2);
    expect(pv.cones.income.p50[5]).toBeCloseTo(60000, -2);
    expect(pv.cones.income.p50[30]).toBeCloseTo(40000, -2);
  });
  it('the ladder rungs are sized to the steps: cheaper base ladder than flat, worst-12 = lowest bolted year', () => {
    const cfg = createSimulationConfigFromSettings({}, stepped);
    const p = { ...planFromSettings(stepped, cfg, { yieldForYear: realYieldForYear }), ...FAST };
    const flat = { ...p, targetSchedule: null, pnvCfg: { ...p.pnvCfg, targetSchedule: null } };
    const a = stressTestAll(p), b = stressTestAll(flat);
    expect(a.configs.lr.profile.type).toBe('schedule');
    expect(a.configs.baseLadderCost).toBe(b.configs.baseLadderCost);   // first 15 years are all 60k either way
    expect(a.strategies['ladder-and-ratchet'].worst12.median).toBe(40000);
    expect(b.strategies['ladder-and-ratchet'].worst12.median).toBe(60000);
    expect(a.strategies['ladder-and-ratchet'].ruin.mc).toBeLessThan(b.strategies['ladder-and-ratchet'].ruin.mc);
    expect(a.strategies['ladder-and-ratchet'].cones.income.p50[30]).toBeCloseTo(40000, -2);
  });
});

describe('Floor the schedule (4th strategy): the whole income profile bought by contract', () => {
  const stepped = { ...PERSONAS['comfortable 600k+150k ISA, £36k'], equityMin: 720000, bondMin: 360000, cashTarget: 120000, isaBalance: 60000,
    baseSalary: 60000, duration: 35, incomeShape: 'phases', shapeAgeNow: 57,
    incomeSteps: [{ fromAge: 57, amount: 60000 }, { fromAge: 73, amount: 50000 }, { fromAge: 80, amount: 40000 }] };
  it('is in the compare and agrees with the locked-plan run; 0% ruin; worst-12 = lowest step; costs more than the essentials floor', () => {
    const { all } = compareTab(stepped);
    const fs = all.strategies['floor-the-schedule'];
    expect(fs.affordable).toBe(true);
    expect(strip(lockedPlanStress(stepped, 'floor-the-schedule'))).toEqual(strip(fs));
    expect(fs.ruin).toEqual({ hist: 0, mc: 0 });
    expect(fs.worst12).toEqual({ min: 40000, median: 40000 });
    expect(all.configs.fsFloorCost).toBeGreaterThan(all.configs.ffFloorCost);
    expect(all.configs.fsFloorCost).toBeGreaterThan(all.configs.baseLadderCost);
    expect(fs.cones.wealth.p50[0]).toBeCloseTo(1260000, -3);
    expect(fs.cones.income.p50[5]).toBeCloseTo(60000, -2);
    expect(fs.cones.income.p50[30]).toBeCloseTo(40000, -2);
    expect(fs.cones.income.p10[30]).toBe(fs.cones.income.p90[30]);   // by contract: no spread
    expect(fs.signature.sleeveAtEnd.p50).toBeGreaterThan(fs.signature.sleeveE0);
  });
  it('is honestly unaffordable when the schedule costs more than the pot', () => {
    const poor = { ...stepped, equityMin: 300000, bondMin: 150000, cashTarget: 50000, isaBalance: 0 };
    const r = lockedPlanStress(poor, 'floor-the-schedule');
    expect(r.affordable).toBe(false);
    expect(r.reason).toMatch(/costs/);
  });
});
