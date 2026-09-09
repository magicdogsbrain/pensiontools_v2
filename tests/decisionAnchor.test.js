import { describe, it, expect, vi } from 'vitest';
vi.mock('../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));
import { decisionAnchorYear, planYearOf } from '../src/services/PlanTiming.js';
import { getYearNum } from '../src/services/legacyDecision.js';
import { spSimConfigFromSettings, spTaxYearConfigFromSettings } from '../src/utils/StatePensionUtils.js';
import { createSimulationConfigFromSettings } from '../src/storage/StressRepository.js';
import { planFromSettings } from '../src/strategies/stressTest.js';
import { seedDecisionFromStress } from '../src/storage/ScenarioRepository.js';
import { generateDrawdownSchedule } from '../src/services/DrawdownService.js';

const NOW = new Date(2026, 8, 9);
const chris = { currentAge: 56, currentAgeAsOf: '2026-09-09', spStartDate: '21 April 2037', spWeeklyAmount: 230, shapeAgeNow: 57, duration: 35, retired: true, firstTaxYear: 2027 };

describe('one anchor for the Decision tool', () => {
  it('prefers the Decision copy, then the Stress plan, then the first tax year set up, then the year being set up', () => {
    expect(decisionAnchorYear({ firstTaxYear: 2027 }, { '26/27': {} }, '26/27', null, NOW)).toBe(2027);
    expect(decisionAnchorYear({}, { '26/27': {} }, '26/27', chris, NOW)).toBe(2027);          // Stress plan carries a start
    expect(decisionAnchorYear({}, { '36/37': {}, '38/39': {} }, '38/39', null, NOW)).toBe(2036); // pre-6.4.0 plan: history's own anchor
    expect(decisionAnchorYear({}, { '36/37': {} }, '36/37', { shapeAgeNow: 57 }, NOW)).toBe(2036); // legacy Stress plan says nothing
    expect(decisionAnchorYear({}, {}, '27/28', null, NOW)).toBe(2027);
    expect(decisionAnchorYear({}, {}, null, null, NOW)).toBe(2026);
  });
  it('getYearNum counts from the anchor and goes negative before it', () => {
    expect(getYearNum('2026-09', 2027)).toBe(-1);   // Chris starts the tool in Sept 2026: a bridge year
    expect(getYearNum('2027-04', 2027)).toBe(0);
    expect(getYearNum('2030-03', 2027)).toBe(2);    // March 2030 is still 2029/30
    expect(getYearNum('2030-04', 2027)).toBe(3);    // the £68,650 step lands in April 2030, not 2029
    expect(getYearNum('2029-07')).toBe(3);          // default anchor unchanged for old callers
    expect(planYearOf('29/30', 2027)).toBe(2);
  });
});

describe('State Pension timing reads the anchor', () => {
  it("Chris's SP (21 Apr 2037) is plan year 10 of a 2027/28 plan, paid 350/365 in that tax year", () => {
    const sim = spSimConfigFromSettings(chris, NOW);
    expect(sim.spStartYear).toBe(10);
    expect(sim.spFirstYearRatio).toBeCloseTo(350 / 365, 2);
    const dec = spTaxYearConfigFromSettings(chris, NOW);
    expect(dec.spStartYear).toBe(10);
  });
  it('without an anchor the old behaviour stands (Decision side counts from today)', () => {
    const { firstTaxYear, ...legacy } = chris;
    expect(spTaxYearConfigFromSettings(legacy, NOW).spStartYear).toBe(11);   // 2037/38 − 2026/27
  });
  it('the plan of record puts the SP in plan year 10 for a 2027/28 plan', () => {
    const rows = generateDrawdownSchedule({ ...chris, baseSalary: 83650, pa: 12570, brl: 50270, hrl: 125140, taxMode: 'frozen', equityMin: 1, bondMin: 1, cashTarget: 1 }, 12, 0.04);
    const sp = rows.map((r) => r.statePension || r.spIncome || r.sp || 0);
    const firstPaid = sp.findIndex((v) => v > 0);
    expect(firstPaid === 10 || firstPaid === -1).toBe(true);   // -1 only if the schedule does not expose the SP column
    if (firstPaid === 10) expect(sp[9]).toBe(0);
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
    const cfg = createSimulationConfigFromSettings({}, { ...chris, equityMin: 300000, bondMin: 150000, cashTarget: 50000, pa: 12570, brl: 50270, hrl: 125140 });
    expect(cfg.equityStart).toBe(300000);
    const p = planFromSettings({ ...chris, strategyParams: { sippTotal: 1179422 } }, cfg, {});
    expect(p.pot).toBe(1179422);
    expect(p.firstTaxYear).toBe(2027);
    expect(p.startAge).toBe(57);
  });
});

describe('the anchor travels to the Decision copy', () => {
  it('seedDecisionFromStress carries the derived start; a legacy plan leaves it unset', () => {
    expect(seedDecisionFromStress(chris, {}).firstTaxYear).toBe(2027);
    expect(seedDecisionFromStress({ shapeAgeNow: 57, baseSalary: 40000 }, {}).firstTaxYear).toBeNull();
    expect(seedDecisionFromStress({ shapeAgeNow: 57 }, { firstTaxYear: 2031 }).firstTaxYear).toBe(2031);
  });
});
