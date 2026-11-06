/**
 * The guest example plan (tests/fixtures/plans/11-guest-demo.json, Pots & Valves, 39 years, cuts on) gives ONE
 * "chance of lasting" on every screen (usability audit decision 2, option (a)): the Monte Carlo tab, the strategy
 * page, the Strategies ranking row, the plan document, "Try a strategy" with nothing changed, and the couples
 * check's own-plan figure all read the same stressTestStrategy result on the same plan — the plan's own cuts
 * setting, its full length. Before 6.24 the same plan read 94% / 100% / 91% / 96% on those screens.
 *
 * Every path below is the code the screens run (index.html's strategyPlanFor → planFromSettings; the ranking's
 * deriveCompareConfigs; buildPlanDocument; the worker's cloneSafe). Full runs — this is the slow tier.
 */
import { describe, it, expect, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

vi.mock('../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));

import { normalizeScenario } from '../src/firebase/scenarioMigration.js';
import { createSimulationConfigFromSettings } from '../src/storage/StressRepository.js';
import { planFromSettings, stressTestStrategy, pnvDecadeSeries } from '../src/strategies/stressTest.js';
import { deriveCompareConfigs } from '../src/strategies/compareRunner.js';
import { realYieldForYear } from '../src/services/LinkerUniverse.js';
import { buildPlanDocument } from '../src/services/PlanDocument.js';
import { combineHouseholdStrategies } from '../src/services/HouseholdService.js';
import { cloneSafe } from '../src/utils/cloneSafe.js';
import { oneAnswer, worstStarts, summariseCuts } from '../src/services/OneAnswer.js';
import { namedStartRows } from '../src/services/NamedStarts.js';

const raw = JSON.parse(readFileSync(resolve(process.cwd(), 'tests/fixtures/plans/11-guest-demo.json'), 'utf8'));
const settings = normalizeScenario(raw).scenario.stressTool.settings;
const now = new Date('2026-09-30T08:00:00.000Z');
// index.html strategyPlanFor(): the plan every screen runs.
const planFor = (s) => planFromSettings(s, createSimulationConfigFromSettings({}, s), { yieldForYear: realYieldForYear, startAge: +s.shapeAgeNow || 57, now });

describe('one answer: the guest example plan', () => {
  const p = planFor(settings);
  const tab = stressTestStrategy(settings.strategyId, p);                                   // the Monte Carlo tab and the strategy page (runStrategyWindowsUI)
  const ranking = stressTestStrategy(settings.strategyId, p, deriveCompareConfigs(p));      // the Strategies ranking row (cmpRun)
  const tried = stressTestStrategy(settings.strategyId, planFor(JSON.parse(JSON.stringify(settings))));   // Try a strategy, nothing changed
  const docFig = buildPlanDocument({ planName: 'Example', settings, p, r: tab, now }).strategy.r;   // the plan document at lock
  const figure = (r) => Math.round((100 - r.ruin.mc) * 10) / 10;

  it('is a Pots & Valves plan with its cuts on and its full 39-year length — the case the audit read five figures on', () => {
    expect(settings.strategyId).toBe('pots-and-valves');
    expect(!!settings.disableProtection).toBe(false);
    expect(p.durationYears).toBe(39);
    expect(p.pnvCfg.disableProtection).toBeFalsy();
  });
  it('the Monte Carlo tab, the strategy page, the ranking row, the plan document and Try give the same figure', () => {
    expect(figure(tab)).toBe(figure(ranking));
    expect(figure(tab)).toBe(figure(tried));
    expect(figure(tab)).toBe(figure(docFig));
    expect(tab.terminal).toEqual(ranking.terminal);
    expect(tab.terminal).toEqual(docFig.terminal);
    expect(tab.cuts).toEqual(ranking.cuts);
    expect(tab.n).toEqual({ hist: tab.n.hist, mc: 1000 });
    expect(figure(tab)).toBeGreaterThan(90);   // the plan lasts in more than 9 futures out of 10
  });
  it('the couples check reads the same per-future survival as the tab (paired, not re-run)', () => {
    const hh = combineHouseholdStrategies(tab, tab);
    expect(hh.runs).toBe(1000);
    expect(Math.round(hh.successA * 1000) / 10).toBe(figure(tab));
    expect(Math.round(hh.jointSuccess * 1000) / 10).toBe(figure(tab));
  });
  it('the worker hands the same figures back (nothing the screens read is a function)', () => {
    const w = cloneSafe({ p, r: tab });
    expect(w.r.ruin).toEqual(tab.ruin); expect(w.r.terminal).toEqual(tab.terminal); expect(w.r.cuts).toEqual(tab.cuts);
    expect(w.r.histWindows.length).toBe(tab.histWindows.length);
    expect(oneAnswer(w.r, w.p)).toEqual(oneAnswer(tab, p));
  });
  it('the answer carries the cuts and the bad case as the worst 1 in 10', () => {
    const a = oneAnswer(tab, p);
    expect(a.badCaseLeft).toBe(tab.terminal.p10);
    expect(a.typicalLeft).toBe(tab.terminal.p50);
    expect(a.cuts.futures).toBe(1000);
    expect(a.cuts.cutN).toBeGreaterThanOrEqual(a.cuts.ranOutN);
    expect(a.cuts.cutN).toBeGreaterThan(0);
    expect(a.cuts.typicalCutPerYear).toBeGreaterThan(0);
    expect(a.cuts.typicalCutYears).toBeGreaterThanOrEqual(1);
  });
  it('the history rows are the one test\'s own windows: the worst starts and the named years replay the same arithmetic', () => {
    expect(tab.histWindows.length).toBe(tab.n.hist);
    const ranOut = tab.histWindows.filter((w) => w.failed).length;
    expect(Math.round(100 * ranOut / tab.n.hist * 10) / 10).toBe(Math.round(tab.ruin.hist * 10) / 10);
    const worst = worstStarts(tab.histWindows, 5);
    expect(worst.length).toBe(5);
    for (const w of worst) expect(w.year).toBeGreaterThanOrEqual(1871);
    // A named start is the same window the test counted (the test strides by 2 months: January windows are in it).
    const rows = namedStartRows('pots-and-valves', p);
    const r1929 = rows.find((x) => x.year === 1929);
    const w1929 = tab.histWindows.find((x) => x.s === (1929 - 1871) * 12);
    expect(r1929.available).toBe(true);
    expect(r1929.failed).toBe(w1929.failed);
    expect(r1929.terminal).toBeCloseTo(w1929.terminal, 6);
    expect(r1929.worst12).toBeCloseTo(w1929.worst12, 6);
    expect(rows.find((x) => x.year === 2008).tooShort).toBe(true);   // 2008 + 39 years is not history yet
    expect(pnvDecadeSeries(p, 2008, 1)).toBeNull();
  });
  it('the cuts summary is the per-future record, not a second run', () => {
    const c = summariseCuts(tab.histWindows.map(() => ({ failed: false, cutYears: 0, cutReal: 0 })), 39);
    expect(c.cutN).toBe(0);
    expect(tab.cuts.futures).toBe(1000);
  });
});
