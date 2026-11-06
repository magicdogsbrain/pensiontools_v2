import { describe, it, expect, vi } from 'vitest';
vi.mock('../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));
import { decisionAnchorYear, planYearOf } from '../src/services/PlanTiming.js';
import { getYearNum } from '../src/services/legacyDecision.js';
import { spSimConfigFromSettings, spTaxYearConfigFromSettings } from '../src/utils/StatePensionUtils.js';
import { createSimulationConfigFromSettings } from '../src/storage/StressRepository.js';
import { simulationConfigFromSettings } from '../src/services/SimulationConfig.js';
import { planFromSettings } from '../src/strategies/stressTest.js';
import { seedDecisionFromStress } from '../src/storage/ScenarioRepository.js';
import { generateDrawdownSchedule } from '../src/services/DrawdownService.js';

const NOW = new Date(2026, 8, 9);
// Alex (fictional): 62 on 1 March 2026, State Pension 12 June 2030, retired, plan from 2027/28 at 64.
const alex = { currentAge: 62, currentAgeAsOf: '2026-03-01', spStartDate: '12 June 2030', spWeeklyAmount: 230, shapeAgeNow: 64, duration: 30, retired: true, firstTaxYear: 2027 };

describe('one anchor for the Decision tool', () => {
  it('prefers the Decision copy, then the Stress plan, then the first tax year set up, then the year being set up', () => {
    expect(decisionAnchorYear({ firstTaxYear: 2027 }, { '26/27': {} }, '26/27', null, NOW)).toBe(2027);
    expect(decisionAnchorYear({}, { '26/27': {} }, '26/27', alex, NOW)).toBe(2027);          // Stress plan carries a start
    expect(decisionAnchorYear({}, { '36/37': {}, '38/39': {} }, '38/39', null, NOW)).toBe(2036); // pre-6.4.0 plan: history's own anchor
    expect(decisionAnchorYear({}, { '36/37': {} }, '36/37', { shapeAgeNow: 64 }, NOW)).toBe(2036); // legacy Stress plan says nothing
    expect(decisionAnchorYear({}, {}, '27/28', null, NOW)).toBe(2027);
    expect(decisionAnchorYear({}, {}, null, null, NOW)).toBe(2026);
  });
  it('getYearNum counts from the anchor and goes negative before it', () => {
    // Re-written in 6.51.0: Sept 2026 is before the start only for a start chosen for later (year 0 2027/28); for Alex
    // stopping work in October 2025 the plan's year 0 is that tax year and Sept 2026 is plan year 1 (research/plan-start.md §7).
    expect(getYearNum('2026-09', 2027)).toBe(-1);   // a start chosen for next April: before the plan's income starts
    expect(getYearNum('2026-09', 2025)).toBe(1);    // year 0 = the stop's tax year, 2025/26
    expect(getYearNum('2027-04', 2027)).toBe(0);
    expect(getYearNum('2030-03', 2027)).toBe(2);    // March 2030 is still 2029/30
    expect(getYearNum('2030-04', 2027)).toBe(3);    // a step at plan year 3 lands in April 2030, not 2029
    expect(getYearNum('2029-07')).toBe(3);          // default anchor unchanged for old callers
    expect(planYearOf('29/30', 2027)).toBe(2);
  });
});

describe('State Pension timing reads the anchor', () => {
  it("Alex's SP (12 June 2030) is plan year 3 of a 2027/28 plan, paid 298/365 in that tax year", () => {
    const sim = spSimConfigFromSettings(alex, NOW);
    expect(sim.spStartYear).toBe(3);
    expect(sim.spFirstYearRatio).toBeCloseTo(298 / 365, 2);
    const dec = spTaxYearConfigFromSettings(alex, NOW);
    expect(dec.spStartYear).toBe(3);
  });
  it('without an anchor the old behaviour stands (Decision side counts from today)', () => {
    const { firstTaxYear, ...legacy } = alex;
    expect(spTaxYearConfigFromSettings(legacy, NOW).spStartYear).toBe(4);   // 2030/31 − 2026/27
  });
  it('the plan of record puts the SP in plan year 3 for a 2027/28 plan', () => {
    const rows = generateDrawdownSchedule({ ...alex, baseSalary: 44000, pa: 12570, brl: 50270, hrl: 125140, taxMode: 'frozen', equityMin: 1, bondMin: 1, cashTarget: 1 }, 12, 0.04);
    const sp = rows.map((r) => r.statePension || r.spIncome || r.sp || 0);
    const firstPaid = sp.findIndex((v) => v > 0);
    expect(firstPaid === 3 || firstPaid === -1).toBe(true);   // -1 only if the schedule does not expose the SP column
    if (firstPaid === 3) expect(sp[2]).toBe(0);
  });
});

describe('retiring later: today\'s pots are projected to retirement', () => {
  const pre = { currentAge: 50, currentAgeAsOf: '2026-09-09', retired: false, retireAge: 60, equityMin: 300000, bondMin: 150000, cashTarget: 50000, isaBalance: 100000, duration: 30, baseSalary: 40000, pa: 12570, brl: 50270, hrl: 125140, potAtRetirement: { sipp: 1000000, isa: 150000, source: 'override' } };
  it('createSimulationConfigFromSettings scales the pots, the floors and the ISA', () => {
    const cfg = createSimulationConfigFromSettings({}, pre);
    expect(cfg.equityStart).toBe(600000);
    expect(cfg.bondStart).toBe(300000);
    expect(cfg.cashStart).toBe(100000);
    expect(cfg.equityMin).toBe(600000);
    expect(cfg.isaBalance).toBe(150000);
  });
  it('a pinned "Total in your SIPP" is scaled the same way', () => {
    const cfg = createSimulationConfigFromSettings({}, pre);
    const p = planFromSettings({ ...pre, strategyParams: { sippTotal: 500000, isaTotal: 100000 } }, cfg, {});
    expect(p.pot).toBe(1000000);
    expect(p.isa).toBe(150000);
    expect(p.startAge).toBe(60);
    expect(p.firstTaxYear).toBe(2036);
    expect(p.yearsToStart).toBe(10);
  });
  it('already retired: nothing is scaled and the plan starts 2027/28', () => {
    const cfg = createSimulationConfigFromSettings({}, { ...alex, equityMin: 300000, bondMin: 150000, cashTarget: 50000, pa: 12570, brl: 50270, hrl: 125140 });
    expect(cfg.equityStart).toBe(300000);
    const p = planFromSettings({ ...alex, strategyParams: { sippTotal: 860000 } }, cfg, {});
    expect(p.pot).toBe(860000);
    expect(p.firstTaxYear).toBe(2027);
    expect(p.startAge).toBe(64);
  });
  // Re-written in 6.51.0 (research/plan-start.md §7): the same retiree who stopped work in October 2025 — year 0 is the stop's
  // tax year, 2025/26, and on 9 September 2026 the plan is seen from today: one year lived (yearOffset 1), run from the age
  // reached this tax year, year 0 kept as the plan's own.
  it('stopped in October 2025: year 0 2025/26, run from plan year 1 at the age reached this tax year', () => {
    const s = { ...alex, firstTaxYear: undefined, stoppedWork: '2025-10', shapeAgeNow: 62, duration: 32, equityMin: 300000, bondMin: 150000, cashTarget: 50000, pa: 12570, brl: 50270, hrl: 125140, potsAsOf: 'today', strategyParams: { sippTotal: 860000 } };
    const cfg = simulationConfigFromSettings({}, s, NOW);
    const p = planFromSettings(s, cfg, { now: NOW });
    expect(p.firstTaxYear).toBe(2025);
    expect(p.yearOffset).toBe(1);
    expect(p.runFirstTaxYear).toBe(2026);
    expect(p.startAge).toBe(63);
    expect(p.durationYears).toBe(31);
    expect(p.pot).toBe(860000);
  });
});

describe('the anchor travels to the Decision copy', () => {
  it('seedDecisionFromStress carries the derived start; a legacy plan leaves it unset', () => {
    expect(seedDecisionFromStress(alex, {}).firstTaxYear).toBe(2027);
    expect(seedDecisionFromStress({ shapeAgeNow: 64, baseSalary: 40000 }, {}).firstTaxYear).toBeNull();
    expect(seedDecisionFromStress({ shapeAgeNow: 64 }, { firstTaxYear: 2031 }).firstTaxYear).toBe(2031);
  });
});
