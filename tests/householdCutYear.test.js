/**
 * The couples check reads, for every future, the plan year it was first cut and — where a cut still pays part of the
 * income — what it left unpaid (6.37.0). Until then only the rotation said its year: a Floor & Flex future cut by a lean
 * year, or a Floor to an age future cut to a smaller income, kept its wealth, so it read as never cut (or as cut only at
 * the plan's end) and the pooled verdict counted nearly every one as carried by the other plan. Pots & Valves, Buckets
 * in order and Ladder & Ratchet read their year from the start-of-year wealth, a year late.
 */
import { describe, it, expect, vi } from 'vitest';
vi.mock('../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));
import { stressTestStrategy, planFromSettings, futuresOf } from '../src/strategies/stressTest.js';
import { createSimulationConfigFromSettings } from '../src/storage/StressRepository.js';
import { combineHouseholdStrategies, POOLED_TAX_UPLIFT } from '../src/services/HouseholdService.js';

const NOW = new Date('2026-10-17T10:00:00Z');
const sipp = 1180000;
const settings = { configured: true, retired: true, currentAge: 62, shapeAgeNow: 62, duration: 30, baseSalary: 60000, equityMin: Math.round(sipp * 0.68), bondMin: Math.round(sipp * 0.25),
  cashTarget: Math.round(sipp * 0.07), isaBalance: 0, other: 0, isaDrawdownStrategy: 'hold', dbAmount: 0, dbStartYear: 0, statePension: 11973, statePensionYear: 5, accessMethod: 'drawdown',
  pa: 12570, brl: 50270, hrl: 125140, chargesPct: 0.3, strategyParams: { sippTotal: sipp, isaTotal: 0 } };
const runOf = (id) => {
  const st = { ...settings, strategyId: id };
  const p = { ...planFromSettings(st, createSimulationConfigFromSettings({}, st), { startAge: 62, now: NOW }), mcRuns: 80, stride: 24 };
  return { p, r: stressTestStrategy(id, p) };
};
const plannedOf = (p) => (y) => (p.targetSchedule?.[Math.min(y, p.targetSchedule.length - 1)] ?? p.targetAnnual) + ((p.otherIncomeByYear && p.otherIncomeByYear[y]) || 0);
const cutIdx = (r) => r.survivedMc.map((ok, i) => (ok ? null : i)).filter((i) => i != null);

describe('each future says the year it was first cut', () => {
  it('Floor & Flex: the first lean year (more than 10% under the plan), and what the lean years left unpaid', () => {
    const { p, r } = runOf('floor-and-flex');
    const planned = plannedOf(p), cut = cutIdx(r);
    expect(cut.length).toBeGreaterThan(5);
    for (const i of cut) {
      const inc = r.samples.income[i];   // 80 runs: the sample is every future
      const first = inc.findIndex((v, y) => v < planned(y) * 0.9);
      expect(r.futuresMc.failYear[i]).toBe(first);
      expect(r.futuresMc.unpaid[i]).toBeGreaterThan(0);
      expect(Math.min(...r.samples.wealth[i])).toBeGreaterThan(1);   // the case that read as never cut: the wealth never runs out
    }
  });
  it('Floor to an age: the first year after the age that pays under the plan, never the plan\'s end', () => {
    const { p, r } = runOf('floor-to-age');
    const A = r.signature.A, cut = cutIdx(r);
    expect(cut.length).toBeGreaterThan(0);
    for (const i of cut) {
      expect(r.futuresMc.failYear[i]).toBeGreaterThan(A);
      expect(r.futuresMc.failYear[i]).toBeLessThan(p.durationYears);
      expect(r.futuresMc.unpaid[i]).toBeGreaterThan(0);
    }
  });
  it.each(['pots-and-valves', 'ladder-and-ratchet'])('%s: the year the money ran out, not the year after', (id) => {
    const { p, r } = runOf(id);
    const cut = cutIdx(r);
    expect(cut.length).toBeGreaterThan(0);
    const ages = r.failAges.slice().sort((a, b) => a - b), years = cut.map((i) => r.futuresMc.failYear[i]).sort((a, b) => a - b);
    expect(years).toEqual(ages.map((a) => Math.floor(a - p.startAge + 1e-9)));
    expect(r.futuresMc.unpaid).toBeUndefined();   // an empty pot pays nothing from then on
  });
  it('survivors read as never cut', () => {
    for (const id of ['floor-and-flex', 'floor-to-age', 'pots-and-valves']) {
      const { r } = runOf(id);
      r.survivedMc.forEach((ok, i) => { if (ok) expect(r.futuresMc.failYear[i]).toBeNull(); });
    }
  });
});

describe('the pooled verdict asks the other plan for what the cut plan left unpaid', () => {
  const need = Array.from({ length: 31 }, () => 40000);
  const opts = { needA: need, needB: need, startAgeA: 62, startAgeB: 62 };
  const plan = (survived, f) => ({ survivedMc: [survived], futuresMc: f, cones: { wealth: { p50: [0] } } });
  it('a lean cut needs only its shortfall; an empty pot needs all of its need from that year', () => {
    const payer = plan(true, futuresOf([[1]], [true], [100000]));
    const lean = plan(false, futuresOf([[500000]], [false], [500000], [10], [20000]));
    const empty = plan(false, futuresOf([[0]], [false], [0], [10]));
    expect(lean.futuresMc.unpaid).toEqual([20000]);
    expect(combineHouseholdStrategies(lean, payer, opts).pooled.success).toBe(1);   // 100,000 ≥ 20,000 × 1.25
    expect(combineHouseholdStrategies(empty, payer, opts).pooled.success).toBe(0);  // 100,000 < 20 years × 40,000 × 1.25
    expect(20000 * POOLED_TAX_UPLIFT).toBeLessThan(100000);
  });
  it('the demo couple: Floor & Flex next to Pots & Valves is no longer carried in nearly every future', () => {
    const A = runOf('floor-and-flex'), B = runOf('pots-and-valves');
    const needOf = (p) => Array.from({ length: p.durationYears + 1 }, (_, y) => Math.max(0, (p.targetSchedule?.[y] ?? p.targetAnnual) - (y >= (p.spStartYear ?? 99) ? p.spAnnual : 0)));
    const o = { needA: needOf(A.p), needB: needOf(B.p), startAgeA: 62, startAgeB: 62 };
    const now = combineHouseholdStrategies(A.r, B.r, o).pooled;
    const noUnpaid = { ...A.r, futuresMc: { ...A.r.futuresMc, unpaid: undefined } };
    const before = combineHouseholdStrategies({ ...A.r, futuresMc: { ...A.r.futuresMc, failYear: A.r.futuresMc.failYear.map(() => null), unpaid: undefined } }, B.r, o).pooled;   // what 6.36.0 read
    const allNeed = combineHouseholdStrategies(noUnpaid, B.r, o).pooled;   // the cut plan paying nothing from its first lean year
    expect(now.success).toBeLessThan(before.success);
    expect(now.success).toBeGreaterThanOrEqual(allNeed.success);
  });
});
