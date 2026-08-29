import { describe, it, expect } from 'vitest';
import { stressTestStrategy, planFromSettings, STRATEGY_NAMES } from '../src/strategies/stressTest.js';
import { planSourcingOrdered } from '../src/services/WithdrawalSourcing.js';
import { getStrategy } from '../src/strategies/registry.js';
import { createSimulationConfigFromSettings, getStressSettings } from '../src/storage/StressRepository.js';

const settings = { ...getStressSettings(), equityMin: 545400, bondMin: 424200, cashTarget: 242400, isaBalance: 60000, isaDrawdownStrategy: 'hold', baseSalary: 60000, duration: 34, shapeAgeNow: 57, currentAge: 56, statePension: 11973, statePensionYear: 10, configured: true };
const plan = () => planFromSettings(settings, createSimulationConfigFromSettings({}, settings), { startAge: 57 });

describe('registry and names carry the two new strategies', () => {
  it('both ids are named, registered and distinct from their parents', () => {
    expect(STRATEGY_NAMES['bridge-and-engine']).toBe('Bridge & engine');
    expect(STRATEGY_NAMES['buckets-in-order']).toBe('Buckets in order');
    expect(getStrategy('bridge-and-engine').id).toBe('bridge-and-engine');
    expect(getStrategy('buckets-in-order').id).toBe('buckets-in-order');
    expect(getStrategy('buckets-in-order').engine).toBe(getStrategy('pots-and-valves').engine);
  });
});

describe('Bridge & engine', () => {
  const p = { ...plan(), mcRuns: 60, stride: 8 };
  const r = stressTestStrategy('bridge-and-engine', p);
  it('defaults the bridge to the State Pension age and buys it with cash years first', () => {
    expect(r.affordable).toBe(true);
    expect(r.signature.bridgeAge).toBe(67);
    expect(r.signature.B).toBe(10);
    expect(r.signature.cashYears).toBe(3);
    expect(r.signature.bridgeCost).toBeGreaterThan(0);
    expect(r.signature.engineE0).toBeCloseTo(p.pot - r.signature.bridgeCost, 0);
  });
  it('income during the bridge is the schedule by contract; after it the engine pays or fails late', () => {
    for (let y = 0; y < 10; y++) expect(r.cones.income.p10[y]).toBeCloseTo(r.cones.income.p90[y], 0);
    expect(r.ruin.mc).toBeGreaterThanOrEqual(0);
    expect(r.ruin.mc).toBeLessThanOrEqual(100);
    for (const a of r.failAges) expect(a).toBeGreaterThanOrEqual(67);
    expect(r.signature.engineAtB.p50).toBeGreaterThan(0);
    expect(r.signature.engineCone.length).toBe(11);
  });
  it('honours a bridgeAge and cashYears dial', () => {
    const q = { ...p, params: { ...p.params, bridgeAge: 70, cashYears: 2 } };
    const s = stressTestStrategy('bridge-and-engine', q);
    expect(s.signature.bridgeAge).toBe(70);
    expect(s.signature.cashYears).toBe(2);
    expect(s.signature.bridgeCost).toBeGreaterThan(r.signature.bridgeCost);
  });
});

describe('Buckets in order — sourcing rule (cash → bonds → equities, waterfall from surplus)', () => {
  const base = { draw: 5000, equity: 500000, bond: 400000, cash: 200000, diversifier: 0, hodl: 0, eqMin: 0, bdMin: 0, csTarget: 240000, inProtection: false, eqPath: 480000, bdTarget: 400000, band: 0.1 };
  it('cash pays first even when equities are above their path', () => {
    const o = planSourcingOrdered(base);
    expect(o.fromCash).toBe(5000); expect(o.fromEquity).toBe(0); expect(o.source).toBe('Cash');
  });
  it('equities above the band waterfall into bonds up to target; bonds above target into cash up to target', () => {
    const o = planSourcingOrdered({ ...base, equity: 600000, bond: 380000 });
    expect(o.transfers.equityToBond).toBeCloseTo(Math.min(600000 - 480000, 400000 - 380000), 0);
    const b = planSourcingOrdered({ ...base, equity: 480000, bond: 480000, cash: 100000 });
    expect(b.transfers.equityToBond).toBe(0);
    expect(b.transfers.bondToCash).toBeCloseTo(Math.min(480000 - 400000, 240000 - (100000 - 5000)), 0);
    const none = planSourcingOrdered({ ...base, equity: 400000 });
    expect(none.transfers.equityToBond + none.transfers.bondToCash).toBe(0);
  });
  it('when cash is gone bonds pay; when both are gone equities pay', () => {
    const d = planSourcingOrdered({ ...base, cash: 0 });
    expect(d.fromBond).toBe(5000); expect(d.source).toBe('Bond');
    const e = planSourcingOrdered({ ...base, cash: 0, bond: 0 });
    expect(e.fromEquity).toBe(5000); expect(e.source).toBe('Equity');
  });
});

describe('Buckets in order — stress test', () => {
  it('runs on the P&V engine with ordered sourcing and reports a signature', () => {
    const p = { ...plan(), mcRuns: 40, stride: 10 };
    const r = stressTestStrategy('buckets-in-order', p);
    expect(r.affordable).toBe(true);
    expect(r.signature.ordered).toBe(true);
    expect(r.signature.band).toBeCloseTo(0.1, 5);
    expect(r.ruin.mc).toBeGreaterThanOrEqual(0);
    expect(r.cones.wealth.p50.length).toBe(35);
  });
});

import { scoreStrategy } from '../src/strategies/stressTest.js';
describe('scoreStrategy — coverage ratio and volatility-adjusted coverage', () => {
  it('a plan that lasts and leaves money scores C > 1; a failing one C < 1; vol is floored', () => {
    const p = { durationYears: 10, targetAnnual: 10000 };
    const ok = { affordable: true, samples: { wealth: [[100000, 110000, 120000, 130000, 140000, 150000, 160000, 170000, 180000, 190000, 200000]] }, cones: { wealth: { p50: [] } } };
    const bad = { affordable: true, samples: { wealth: [[100000, 60000, 30000, 10000, 0, 0, 0, 0, 0, 0, 0]] }, cones: { wealth: { p50: [] } } };
    const a = scoreStrategy(ok, p), b = scoreStrategy(bad, p);
    expect(a.coverageRatio).toBeCloseTo((10 + 20) / 10, 5);
    expect(b.coverageRatio).toBeCloseTo(3 / 10, 5);
    expect(a.vol).toBeGreaterThanOrEqual(0.03);
    expect(a.vac).toBeGreaterThan(b.vac);
  });
});

import { calcDecisionPWA } from '../src/services/legacyDecision.js';
import { getDecisionSettings } from '../src/storage/DecisionRepository.js';
describe('Decision tool executes Buckets in order', () => {
  it('with equities below their path and cash available, the month comes from cash; P&V would have used the overweight sleeve', async () => {
    const settings = { ...getDecisionSettings(), equityMin: 500000, bondMin: 400000, cashTarget: 200000, baseSalary: 60000, isaBalance: 0, configured: true };
    const ty = { '26/27': { taxYear: '26/27', confirmedSalary: 60000, pa: 12570, brl: 50270, hrl: 125140, startMonth: 4, remainingMonths: 12, isTaxEfficient: false, expectedMonthly: { sipp: { gross: 5000 } } } };
    const deps = { settings, history: [], allTaxYears: ty, spInfo: { amount: 0, isReceiving: false }, isaBalance: 0 };
    const ordered = await calcDecisionPWA('2026-06', 450000, 480000, 150000, { ...deps, sourcingMode: 'ordered' });
    expect(ordered.source).toBe('Cash');
    const pnv = await calcDecisionPWA('2026-06', 450000, 480000, 150000, deps);
    expect(pnv.source).not.toBe('Cash');
  });
});

describe('gilt-rotation (the ninth strategy)', () => {
  it('is registered everywhere the master lists look', async () => {
    const { STRATEGY_NAMES } = await import('../src/strategies/stressTest.js');
    const { getStrategy } = await import('../src/strategies/registry.js');
    const { STRATEGY_COLORS } = await import('../src/ui/comparisonGraphic.js');
    expect(STRATEGY_NAMES['gilt-rotation']).toBe('Gilt ladder + rotation');
    expect(getStrategy('gilt-rotation').id).toBe('gilt-rotation');
    expect(getStrategy('gilt-rotation').describe().usesTrigger).toBe(true);
    expect(STRATEGY_COLORS['gilt-rotation']).toBeTruthy();
  });

  it('splits the ladder at the cut age without ever splitting one gilt\'s job', async () => {
    const { splitLadderAtAge } = await import('../src/strategies/GiltRotation.js');
    const plan = {
      firstTaxYear: 2027,
      years: [
        { Y: 2044, age: 74, gross: 45000, need: 32520, from: 'T44' },
        { Y: 2045, age: 75, gross: 40000, need: 27520, from: 'TR45' },
        { Y: 2046, age: 76, gross: 40000, need: 27520, from: 'TR46' },
        { Y: 2047, age: 77, gross: 40000, need: 27520, from: 'TR46' },
        { Y: 2058, age: 88, gross: 40000, need: 27520, from: 'T58' }
      ],
      orders: [
        { tidm: 'T44', taxYears: [2044], cost: 22000, pays: 32520, matures: '2044-03-22' },
        { tidm: 'TR45', taxYears: [2045], cost: 20000, pays: 27520, matures: '2045-03-22' },
        { tidm: 'TR46', taxYears: [2046, 2047], cost: 35000, pays: 55040, matures: '2046-03-22' },
        { tidm: 'T58', taxYears: [2058], cost: 55000, pays: 27520, matures: '2058-03-22' }
      ]
    };
    const sp = splitLadderAtAge(plan, 75);
    expect(sp.soldOrders.map((o) => o.tidm).sort()).toEqual(['T58', 'TR46']);
    expect(sp.soldIncomeTotal).toBe(27520 * 3);
    expect(sp.blockCostToday).toBe(90000);
    // cut at 76: TR46 funds 76 AND 77 — both above? 76 is not above 76, so TR46 must be KEPT
    expect(splitLadderAtAge(plan, 76).soldOrders.map((o) => o.tidm)).toEqual(['T58']);
  });

  it('a flat, never-crashing market never triggers and pays everything', async () => {
    const { rotationPathsCtx, runRotationPath } = await import('../src/strategies/GiltRotation.js');
    const plan = {
      firstTaxYear: 2027, spare: 1000, cash: 0,
      years: Array.from({ length: 35 }, (_, k) => ({ Y: 2027 + k, age: 57 + k, gross: 40000, need: 27520, from: k < 19 ? 'KEEP' + k : 'SELL' + k })),
      orders: Array.from({ length: 35 }, (_, k) => ({ tidm: (k < 19 ? 'KEEP' : 'SELL') + k, taxYears: [2027 + k], cost: 20000, pays: 27520, matures: (2026 + k) + '-11-22' }))
    };
    const p = { durationYears: 34, startAge: 57, otherIncomeByYear: [] };
    const ctx = rotationPathsCtx(plan, p, { cutAge: 75, trigger: 0.30 });
    const series = Array.from({ length: 36 * 12 + 2 }, (_, m) => Math.pow(1.002, m));   // gentle rise: no drawdown
    const r = runRotationPath(series, 0, ctx);
    expect(r.triggeredYear).toBeNull();
    expect(r.failAge).toBeNull();
    expect(Math.min(...r.income)).toBeGreaterThanOrEqual(27519);
  });

  it('a crash fires the trigger once, with runway, and the sleeve then pays the sold years', async () => {
    const { rotationPathsCtx, runRotationPath } = await import('../src/strategies/GiltRotation.js');
    const plan = {
      firstTaxYear: 2027, spare: 0, cash: 0,
      years: Array.from({ length: 35 }, (_, k) => ({ Y: 2027 + k, age: 57 + k, gross: 40000, need: 27520, from: 'G' + k })),
      orders: Array.from({ length: 35 }, (_, k) => ({ tidm: 'G' + k, taxYears: [2027 + k], cost: 20000, pays: 27520, matures: (2026 + k) + '-11-22' }))
    };
    const p = { durationYears: 34, startAge: 57, otherIncomeByYear: [] };
    const ctx = rotationPathsCtx(plan, p, { cutAge: 75, trigger: 0.30 });
    // crash 40% in year 2, then a strong recovery
    const series = []; let v = 1;
    for (let m = 0; m < 36 * 12 + 2; m++) { series.push(v); v *= (m > 24 && m < 36) ? 0.955 : 1.007; }
    const r = runRotationPath(series, 0, ctx);
    expect(r.triggeredYear).toBe(2);
    expect(r.failAge).toBeNull();          // long recovery leaves the sleeve comfortably ahead
    expect(r.wealth[34]).toBeGreaterThan(0);
  });

  it('a trigger with no runway is ignored (disarmed 3 years before the block pays)', async () => {
    const { rotationPathsCtx, runRotationPath } = await import('../src/strategies/GiltRotation.js');
    const plan = {
      firstTaxYear: 2027, spare: 0, cash: 0,
      years: Array.from({ length: 35 }, (_, k) => ({ Y: 2027 + k, age: 57 + k, gross: 40000, need: 27520, from: 'G' + k })),
      orders: Array.from({ length: 35 }, (_, k) => ({ tidm: 'G' + k, taxYears: [2027 + k], cost: 20000, pays: 27520, matures: (2026 + k) + '-11-22' }))
    };
    const p = { durationYears: 34, startAge: 57, otherIncomeByYear: [] };
    const ctx = rotationPathsCtx(plan, p, { cutAge: 75, trigger: 0.30 });
    // crash at plan year 20 (age 77): past lastRotateYear (72-57=15) — must NOT rotate
    const series = []; let v = 1;
    for (let m = 0; m < 36 * 12 + 2; m++) { series.push(v); v *= (m > 240 && m < 252) ? 0.95 : 1.004; }
    const r = runRotationPath(series, 0, ctx);
    expect(r.triggeredYear).toBeNull();
    expect(r.failAge).toBeNull();          // rungs still owned: everything contracted
  });
});
