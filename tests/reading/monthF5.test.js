/**
 * Step F5 (lead4.md D17): this month has ONE gatherer (src/reading/month.js monthReadingOf), used by both views; its cadence
 * is the plan's in both; the after-tax figure and where the month comes from have one builder each, drawn in the same
 * structure and words by Month by month and the full view's Monthly Entry (the fact `month.take.from`).
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { FIXTURES, PARITY_DAY } from '../../e2e/parity/fixtures/plans.js';
import { upgradeScenario } from '../../src/firebase/scenarioMigration.js';
import { monthReadingOf, monthAfterTaxOf, monthFromOf, monthFromText, fromLabel } from '../../src/reading/month.js';
import { contextFor } from '../../src/reading/context.js';
import { readMonth } from '../../src/answers/plan/month.js';
import { buildDecisionHTML, monthFromHtml } from '../../src/ui/components/DecisionPanel.js';
import { getTaxYearFromDate } from '../../src/services/legacyDecision.js';
import { isLockedSettings } from '../../src/services/LockedPlanGuard.js';

const NOW = new Date(2026, 10, 16, 12);
const up = (p) => upgradeScenario(JSON.parse(JSON.stringify(p)), { now: NOW }).scenario;
const html = readFileSync('index.html', 'utf8');
const tagless = (h) => String(h).replace(/<li[^>]*>/g, '\n').replace(/<[^>]+>/g, '').trim();

describe('this month: one gatherer, both views', () => {
  const tried = [];
  for (const f of FIXTURES) {
    it(f.key, () => {
      const plans = f.plans().map(up);
      const plan = plans.find((p) => p.id === f.subject);
      if (!isLockedSettings(plan.decisionTool && plan.decisionTool.settings)) return;
      const month = '2026-11';
      const cfg = (plan.decisionTool.taxYears || {})[getTaxYearFromDate(month)];
      if (!(cfg && cfg.yearSetupComplete)) return;
      const typed = { 'mo.month': month, 'mo.mode': 'type', 'mo.equity': '300000', 'mo.bond': '100000', 'mo.cashT': '30000', 'mo.diversifier': '0' };
      const v = readMonth(plan, typed, { today: PARITY_DAY });
      if (!v.firstDecision) return;
      tried.push(f.key);
      expect(v.pots && v.pots.pots, 'the boxes read').toBeTruthy();
      const d = monthReadingOf(plan, contextFor(plan, { today: PARITY_DAY }), { month, pots: v.pots.pots });
      // the simple view's month is the one gatherer's, figure for figure
      for (const k of ['sippDraw', 'monthlyTax', 'totalMonthlyNet', 'isaDraw', 'drawFromEquity', 'drawFromBond', 'drawFromCash', 'cadenceMonths']) expect(v.firstDecision[k], k).toEqual(d[k]);
      // the full view's panel says the same where-from, in the same words, as the simple view's list
      const simpleList = v.advice.from.map((x) => fromLabel(x) + ' ' + x.amount).join('\n');
      expect(tagless(monthFromHtml(d)), 'the same list in both views').toBe(simpleList);
      expect(monthFromText(d)).toBe(simpleList.split('\n').join('; '));
      expect(buildDecisionHTML(d)).toContain('data-fact="month.take.from"');
    });
  }
  it('the locked plans with a tax year set up are tried', () => {
    expect(tried.length).toBeGreaterThan(0);
  });
});

describe('the one builders', () => {
  it('after tax: the engine\'s figure, else its monthly tax taken off, else the caller\'s tax estimate', () => {
    expect(monthAfterTaxOf({ totalMonthlyNet: 2076, sippDraw: 9 })).toBe(2076);
    expect(monthAfterTaxOf({ sippDraw: 2000, other: 100, statePension: 900, monthlyTax: 300, isaDraw: 50 })).toBe(2750);
    expect(monthAfterTaxOf({ sippDraw: 1000, other: 0, statePension: 0 }, { fallbackTax: (d, a) => a * 0.1 })).toBe(900);
    expect(monthAfterTaxOf(null)).toBe(null);
  });
  it('where from: each pot drawn, in the simple view\'s words and the one formatter', () => {
    const d = { drawFromCash: 1046.4, drawFromBond: 0, drawFromEquity: 1122.2, drawFromDiversifier: 0 };
    expect(monthFromOf(d).map((x) => x.id)).toEqual(['cash', 'shares']);
    expect(monthFromText(d)).toBe('Cash £1,046; Shares £1,122');
    expect(tagless(monthFromHtml(d))).toBe('Cash £1,046\nShares £1,122');
  });
  it('where from: a bought way\'s rung and the invested rest', () => {
    const d = { strategyOverlay: { floorMonthly: 1500, sleeveMonthly: 1833, floorLabel: 'the essentials rung', hidePots: true } };
    expect(monthFromText(d)).toBe('The gilt that pays for essentials £1,500; Your invested money, for the rest £1,833');
    const r = { strategyOverlay: { floorMonthly: 2333, floorLabel: 'rung T29 (already cash)', hidePots: true } };
    expect(monthFromText(r)).toBe('Your gilt T29 £2,333');
  });
  it('the cadence is the plan\'s, in both views', () => {
    const f = FIXTURES.find((x) => x.key === 'retired-locked-months');
    const plan = f.plans().map(up).find((p) => p.id === f.subject);
    const ctx = contextFor(plan, { today: PARITY_DAY });
    const pots = { equity: 300000, bond: 100000, cash: 30000 };
    expect(monthReadingOf(plan, ctx, { month: '2026-11', pots }).cadenceMonths).toBe(1);
    const q = { ...plan, decisionTool: { ...plan.decisionTool, cadence: 'quarterly' } };
    expect(monthReadingOf(q, ctx, { month: '2026-11', pots }).cadenceMonths).toBe(3);
  });
});

describe('the full view reads the month through the one gatherer, and the superseded reader is gone', () => {
  const f = html.slice(html.indexOf('async function calcDecisionWithDeps'), html.indexOf('// ---- Cadence: monthly, quarterly or annual batches.'));
  it('calcDecisionWithDeps hands the plan to monthReadingOf and builds no engine input itself', () => {
    expect(f).toContain('monthReadingOf(plan, contextFor(plan, { now })');
    for (const w of ['engineDeps(', 'engineSetup(', 'calcDecisionPWA(', 'getStatePensionForTaxYear(', 'decisionPotsYear(', 'getActiveDrawCadence(', 'decisionStrategyOverlay(']) expect(f, w).not.toContain(w);
    expect(existsSync('src/ui/decisionOverlayUi.js')).toBe(false);
    expect(html).not.toContain('decisionOverlayFor');
  });
  it('the simple view\'s month and the full view\'s panel draw where-from and after tax with the one builders', () => {
    const m = readFileSync('src/answers/plan/month.js', 'utf8');
    expect(m).toContain('monthFromOf(d)');
    expect(m).toContain('monthAfterTaxOf(d)');
    const p = readFileSync('src/ui/components/DecisionPanel.js', 'utf8');
    expect(p).toContain('monthAfterTaxOf(d, { fallbackTax: fallbackAnnualTax })');
    expect(p).not.toContain("d.source.toLowerCase()");
    const s = readFileSync('src/v7/screens/plan/MonthScreen.jsx', 'utf8');
    expect(s).toContain('data-fact="month.take.from"');
  });
});
