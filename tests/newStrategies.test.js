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
