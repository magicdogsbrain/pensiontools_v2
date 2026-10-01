/**
 * Fund and platform charges in the bought strategies (src/strategies; research/charges-setting.md T4, D3–D5).
 *
 *   - The market series stays uncharged: the charge goes on the sleeve held in funds (Ladder & Ratchet's equity sleeve,
 *     the Floor & Flex / Floor the schedule / Floor to an age / Bridge & engine sleeve, the rotation's equity sleeve),
 *     never on the index the trigger reads or the rungs.
 *   - No charge (chargeM absent or 1, a plan without chargesPct) is today's result, whole objects.
 *   - Gilt rungs, their costs, the floor cost and the rungs' present value do not move with the charge; the cash
 *     years of the gilt ladders are money-market cash inside the pension and are charged (D3).
 *   - The plan every strategy is judged on carries the plan's charge; each strategy's figures only fall with it.
 */
import { describe, it, expect } from 'vitest';
import { runLadderWindows, runLadderMonteCarlo } from '../src/strategies/LadderAndRatchet.js';
import { runFlexWindows, runFlexMonteCarlo, floorCost } from '../src/strategies/FloorAndFlex.js';
import { stage1Band, stage1Calendar, stage2, getRtr } from '../src/strategies/ladderEngine.js';
import { rotationPathsCtx, runRotationPath } from '../src/strategies/GiltRotation.js';
import { cashCostFactor, buildGiltLadder, LADDER_DEFAULTS } from '../src/strategies/GiltLadderPlan.js';
import { deriveCompareConfigs } from '../src/strategies/compareRunner.js';
import { planFromSettings, stressTestStrategy, STRATEGY_NAMES } from '../src/strategies/stressTest.js';
import { createSimulationConfigFromSettings, getStressSettings } from '../src/storage/StressRepository.js';
import { activeLinkers } from '../src/services/LinkerUniverse.js';
import { monthlyChargeFactor } from '../src/services/Charges.js';

const M05 = monthlyChargeFactor(0.5);
const asText = (x) => JSON.stringify(x, (k, v) => (typeof v === 'function' ? String(v) : v));

const LR = {
  E0: 183500, ladderYears: 23, L: 276, firstRung: 24, maxRung: 35,
  draw: 27500, END: 420, realYield: 0.023, glideRate: 0.05, startAge: 57,
  trigger: { mode: 'band', b: 1.2 }
};
const LR_CAL = { ...LR, trigger: { mode: 'calendar', reviews: [60, 120, 180] } };
const FF = { E0: 552574, rate: 0.04, END: 420 };

describe('no charge is today\'s result', () => {
  it('Ladder & Ratchet (band and calendar), Floor & Flex: chargeM 1 = no chargeM, whole result', () => {
    expect(asText(runLadderWindows({ ...LR, chargeM: 1 }))).toBe(asText(runLadderWindows(LR)));
    expect(asText(runLadderWindows({ ...LR_CAL, chargeM: 1 }))).toBe(asText(runLadderWindows(LR_CAL)));
    expect(asText(runLadderWindows({ ...LR, chargeM: 1, triggersContinueInDecumulation: true }))).toBe(asText(runLadderWindows({ ...LR, triggersContinueInDecumulation: true })));
    expect(asText(runFlexWindows({ ...FF, chargeM: 1 }))).toBe(asText(runFlexWindows(FF)));
    expect(asText(runLadderMonteCarlo({ ...LR, chargeM: 1 }, 50))).toBe(asText(runLadderMonteCarlo(LR, 50)));
    expect(asText(runFlexMonteCarlo({ ...FF, chargeM: 1 }, 50))).toBe(asText(runFlexMonteCarlo(FF, 50)));
  });

  it('the plan without a charge: every strategy\'s whole result equals the plan at 0%', () => {
    const settings = { ...getStressSettings(), equityMin: 545400, bondMin: 424200, cashTarget: 242400, isaBalance: 60000, baseSalary: 60000, duration: 34, shapeAgeNow: 57, currentAge: 56, statePension: 11973, statePensionYear: 10, configured: true };
    const cfg = createSimulationConfigFromSettings({}, settings);
    const { chargesPct, ...cfgWithout } = cfg;
    void chargesPct;
    const now = new Date('2026-10-01T12:00:00Z');
    const p0 = { ...planFromSettings(settings, cfgWithout, { startAge: 57, now }), mcRuns: 40, stride: 12 };
    const pz = { ...planFromSettings(settings, { ...cfgWithout, chargesPct: 0 }, { startAge: 57, now }), mcRuns: 40, stride: 12 };
    expect(p0.chargesPct).toBe(0);
    expect(pz.chargesPct).toBe(0);
    expect(asText(deriveCompareConfigs(p0))).toBe(asText(deriveCompareConfigs({ ...p0, chargesPct: undefined })));
    for (const id of Object.keys(STRATEGY_NAMES)) expect(asText(stressTestStrategy(id, pz)), id).toBe(asText(stressTestStrategy(id, p0)));
  }, 60_000);
});

describe('the sleeve is charged; the market and the rungs are not', () => {
  it('Ladder & Ratchet, band: the hold multiple (the market) is unchanged; a window that never skims is charged exactly; fewer rungs and survival never better overall', () => {
    // Not "lower in every window": a sleeve the charge keeps below the band skims nothing, and can then hold more than
    // the uncharged sleeve that spent its excess on rungs (the path dependence strategyExtensions.test.js notes too).
    const off = runLadderWindows(LR), on = runLadderWindows({ ...LR, chargeM: M05 });
    expect(on.windows.length).toBe(off.windows.length);
    let exact = 0;
    for (let i = 0; i < off.windows.length; i++) {
      const a = off.windows[i], b = on.windows[i];
      expect(b.holdMultiple).toBe(a.holdMultiple);
      if (a.trades.length === 0 && b.trades.length === 0) {
        expect(Math.abs(b.sleeveAtLadderEnd / (a.sleeveAtLadderEnd * Math.pow(0.995, LR.L / 12)) - 1)).toBeLessThan(1e-12);
        exact++;
      }
    }
    expect(exact).toBeGreaterThan(30);
    const mean = (r) => r.windows.reduce((t, w) => t + w.secured, 0) / r.windows.length;
    expect(mean(on)).toBeLessThan(mean(off));
    expect(on.stats.sleeveMedian).toBeLessThan(off.stats.sleeveMedian);
    expect(on.stats.survivalPct).toBeLessThanOrEqual(off.stats.survivalPct);
  });

  it('stage 1 with no rung bought and stage 2 with nothing drawn: the sleeve is exactly the market × (1 − c)^(months/12)', () => {
    const rtr = getRtr();
    const s = 100, L = 120;
    const never = () => Infinity;                                           // a rung nobody can afford: nothing is bought
    const plain = stage1Band({ rtr, s, E0: 100000, L, firstRung: 11, maxRung: 20, priceForYear: never });
    const charged = stage1Band({ rtr, s, E0: 100000, L, firstRung: 11, maxRung: 20, priceForYear: never, chargeM: M05 });
    expect(Math.abs(charged.V / (plain.V * Math.pow(0.995, L / 12)) - 1)).toBeLessThan(1e-12);
    const cal0 = stage1Calendar({ rtr, s, E0: 100000, reviews: [60, 120], firstRung: 11, maxRung: 20, priceForYear: never });
    const cal = stage1Calendar({ rtr, s, E0: 100000, reviews: [60, 120], firstRung: 11, maxRung: 20, priceForYear: never, chargeM: M05 });
    expect(Math.abs(cal.V / (cal0.V * Math.pow(0.995, 10)) - 1)).toBeLessThan(1e-12);
    const st0 = stage2({ rtr, s, V0: 100000, L: 0, ladderYears: 99, secured: 0, drawForYear: () => 0, END: 120 });
    const st = stage2({ rtr, s, V0: 100000, L: 0, ladderYears: 99, secured: 0, drawForYear: () => 0, END: 120, chargeM: M05 });
    expect(Math.abs(st.terminal / (st0.terminal * Math.pow(0.995, 10)) - 1)).toBeLessThan(1e-12);
  });

  it('Ladder & Ratchet, calendar: the sleeve grown from the last review to the ladder\'s end is charged for those months too', () => {
    const off = runLadderWindows(LR_CAL), on = runLadderWindows({ ...LR_CAL, chargeM: M05 });
    for (let i = 0; i < off.windows.length; i += 41) expect(on.windows[i].sleeveAtLadderEnd).toBeLessThan(off.windows[i].sleeveAtLadderEnd);
  });

  it('Floor & Flex: the sleeve at every year of every window is lower, the floor\'s cost is not', () => {
    const off = runFlexWindows(FF), on = runFlexWindows({ ...FF, chargeM: M05 });
    for (let i = 0; i < off.windows.length; i += 29) {
      for (let y = 1; y < off.windows[i].sleeveByYear.length; y++) expect(on.windows[i].sleeveByYear[y]).toBeLessThan(off.windows[i].sleeveByYear[y]);
    }
    const draw = () => 20000;
    expect(floorCost({ drawForYear: draw, years: 30, realYield: 0.023 })).toBe(floorCost({ drawForYear: draw, years: 30, realYield: 0.023 }));
    // nothing drawn (rate 0): the reserve is the market × (1 − c)^years
    const r0 = runFlexWindows({ E0: 100000, rate: 0, END: 240 }), r1 = runFlexWindows({ E0: 100000, rate: 0, END: 240, chargeM: M05 });
    for (let i = 0; i < r0.windows.length; i += 53) expect(Math.abs(r1.windows[i].terminal / (r0.windows[i].terminal * Math.pow(0.995, 20)) - 1)).toBeLessThan(1e-12);
  });

  it('Gilt ladder + rotation: the trigger fires in the same month (it reads the market); the sleeve after it is charged', () => {
    const plan = {
      firstTaxYear: 2027, spare: 0, cash: 0,
      years: Array.from({ length: 35 }, (_, k) => ({ Y: 2027 + k, age: 57 + k, gross: 40000, need: 27520, from: 'G' + k })),
      orders: Array.from({ length: 35 }, (_, k) => ({ tidm: 'G' + k, taxYears: [2027 + k], cost: 20000, pays: 27520, matures: (2026 + k) + '-11-22' }))
    };
    const series = []; let v = 1;
    for (let m = 0; m < 36 * 12 + 2; m++) { series.push(v); v *= (m > 24 && m < 36) ? 0.955 : 1.007; }
    const p0 = { durationYears: 34, startAge: 57, otherIncomeByYear: [] };
    const off = runRotationPath(series, 0, rotationPathsCtx(plan, p0, { cutAge: 75, trigger: 0.30 }));
    const on = runRotationPath(series, 0, rotationPathsCtx(plan, { ...p0, chargesPct: 0.5 }, { cutAge: 75, trigger: 0.30 }));
    const zero = runRotationPath(series, 0, rotationPathsCtx(plan, { ...p0, chargesPct: 0 }, { cutAge: 75, trigger: 0.30 }));
    expect(asText(zero)).toBe(asText(off));
    expect(on.triggeredYear).toBe(off.triggeredYear);
    expect(on.triggeredYear).toBe(2);
    // before the rotation nothing is held in funds: the block's value (accreted gilts) is the same
    for (let y = 0; y < 2; y++) expect(on.wealth[y]).toBe(off.wealth[y]);
    for (let y = 3; y < 18; y++) expect(on.wealth[y]).toBeLessThan(off.wealth[y]);
  });
});

describe('the cash years of the gilt ladders are charged (D3); the rungs are not', () => {
  it('cashCostFactor: ((1 + drag) / (1 − c))^(k − 1); exactly today\'s factor at 0', () => {
    for (const k of [1, 2, 5, 15]) {
      expect(cashCostFactor(k, LADDER_DEFAULTS.cashRealDrag, 0)).toBe(cashCostFactor(k));
      expect(cashCostFactor(k, undefined, undefined)).toBe(Math.pow(1.01, Math.max(0, k - 1)));
      expect(Math.abs(cashCostFactor(k, 0.01, 0.5) / Math.pow(1.01 / 0.995, k - 1) - 1)).toBeLessThan(1e-14);
    }
    expect(cashCostFactor(1, 0.01, 3)).toBe(1);                              // spent straight away: nothing to charge
  });

  it('buildGiltLadder: the cash years cost more at a charge; every gilt order is the same', () => {
    const base = { pot: 2000000, startAge: 57, durationYears: 35, amountAtAge: () => 40000, spAnnual: 12000, spStartAge: 67, firstTaxYear: 2027, linkers: activeLinkers().gilts, cashYears: 3, todayIso: '2026-10-01' };
    const off = buildGiltLadder(base), on = buildGiltLadder({ ...base, chargesPct: 0.5 }), zero = buildGiltLadder({ ...base, chargesPct: 0 });
    expect(asText(zero)).toBe(asText(off));
    expect(on.orders).toEqual(off.orders);
    expect(on.giltsCost).toBe(off.giltsCost);
    expect(on.cashYears[0].cost).toBe(off.cashYears[0].cost);
    expect(on.cashYears[1].cost).toBeCloseTo(off.cashYears[1].need * 1.01 / 0.995, 6);
    expect(on.cash).toBeGreaterThan(off.cash);
    expect(on.spare).toBeLessThan(off.spare);
  });
});

describe('the plan carries the charge to every strategy', () => {
  const settings = { ...getStressSettings(), equityMin: 545400, bondMin: 424200, cashTarget: 242400, isaBalance: 60000, baseSalary: 60000, duration: 34, shapeAgeNow: 57, currentAge: 56, statePension: 11973, statePensionYear: 10, configured: true };
  const now = new Date('2026-10-01T12:00:00Z');
  const planAt = (chargesPct) => ({ ...planFromSettings(settings, { ...createSimulationConfigFromSettings({}, settings), chargesPct }, { startAge: 57, now }), mcRuns: 60, stride: 12 });

  it('planFromSettings: the plan\'s charge, and Pots & Valves\' config carries it', () => {
    const p = planAt(0.5);
    expect(p.chargesPct).toBe(0.5);
    expect(p.pnvCfg.chargesPct).toBe(0.5);
    expect(planAt(7).chargesPct).toBe(0);                                  // invalid → none
  });

  it('deriveCompareConfigs: each sleeve strategy gets the monthly factor; the rung and floor costs do not move; Bridge & engine\'s cash years do', () => {
    const off = deriveCompareConfigs(planAt(0)), on = deriveCompareConfigs(planAt(0.5));
    for (const k of ['lr', 'ff', 'fs', 'fa', 'be']) {
      expect(on[k].chargeM, k).toBe(M05);
      expect(off[k].chargeM, k).toBeUndefined();
    }
    expect(on.baseLadderCost).toBe(off.baseLadderCost);
    expect(on.ffFloorCost).toBe(off.ffFloorCost);
    expect(on.fsFloorCost).toBe(off.fsFloorCost);
    expect(on.faFloorCost).toBe(off.faFloorCost);
    expect(on.be.cashYears).toBeGreaterThan(1);
    expect(on.beCost).toBeGreaterThan(off.beCost);
  });

  it('every strategy: the chance of running out never falls, the typical amount left never rises', () => {
    const p0 = planAt(0), p1 = planAt(0.5);
    for (const id of Object.keys(STRATEGY_NAMES)) {
      const a = stressTestStrategy(id, p0), b = stressTestStrategy(id, p1);
      if (!a.affordable) { expect(b.affordable, id).toBe(false); continue; }
      if (!b.affordable) continue;
      expect(b.ruin.mc, id).toBeGreaterThanOrEqual(a.ruin.mc);
      expect(b.terminal.p50, id).toBeLessThanOrEqual(a.terminal.p50 + 1e-6);
    }
  }, 60_000);
});
