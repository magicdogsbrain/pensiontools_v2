/**
 * 7.12.0 round 3 (walker 6, decision 6) — living on a pots plan, the month never gives orders. Kim's November (fictional): the
 * engine's alerts were "Move £8,000 Equity→Bond" and "Replenish Cash: Move £6,000 from growth funds", the Fund Status showed
 * "Cash … -£22,000" in red and "Total Surplus: -£6,000 (1.2% below target)", and the tax row read "Tax Saved -£129". Now both
 * views say what the plan's rule does this month in "you can" words, the pots against the plan's levels as facts in one
 * colour, and a saving as the amount saved.
 */
import { describe, it, expect, vi } from 'vitest';
vi.mock('../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));
import { buildDecisionHTML } from '../src/ui/components/DecisionPanel.js';
import { monthAdviceOf } from '../src/answers/plan/month.js';
import { moveOfAlert } from '../src/services/PlanRuleWords.js';
import { MONTH } from '../src/v7/copy/month.js';

const flat = (t) => t.replace(/\s+/g, ' ').trim();
const fill = (t, s) => t.replace(/\{(\w+)\}/g, (m, k) => s[k]);
// shares 285,500 against a level of 277,500; bonds 201,000 against 209,000 (8,000 below); cash 27,500 against 49,500 (22,000 below)
const kim = { date: '2026-11', sippDraw: 2577, isaDraw: 0, totalMonthlyNet: 2191, monthlyTax: 386, source: 'Equity', drawFromEquity: 2577,
  equity: 285500, bond: 201000, cash: 27500, adjEquityMin: 277500, adjBondMin: 209000, adjCashTarget: 49500, pa: 12570, brl: 50270, hrl: 125140,
  isTaxEfficientYear: true, taxSavedMonthly: -129, taxSavedYTD: -129, taxSavedProjectedAnnual: 1546,
  rebalanceNeeded: true, rebalanceActions: ['Move £8,000 Equity→Bond'],
  alerts: [{ message: 'Move £8,000 Equity→Bond', severity: 'warning', type: 'rebalance' }, { message: 'Replenish Cash: Move £6,000 from growth funds', severity: 'info', type: 'cash-replenish' }] };

describe('the plan\'s rule, never an order', () => {
  const full = (() => { const div = document.createElement('div'); div.innerHTML = buildDecisionHTML(kim); return flat(div.textContent); })();
  const SAID = [
    'The plan’s rule moves £8,000 from shares to bonds, back towards its mix. You can make the move, or leave what you hold as it is.',
    'The plan’s rule tops up cash with £6,000 from shares and bonds. You can make the move, or leave your cash as it is.'
  ];
  it('the full view says what the rule does, once each, under "What the plan’s rule does this month"', () => {
    expect(full).toContain('What the plan’s rule does this month');
    for (const s of SAID) expect(full.split(s).length - 1, s).toBe(1);
    for (const w of ['Equity→Bond', 'Replenish Cash', 'Rebalancing Suggestions', 'Move £']) expect(full, w).not.toContain(w);
  });
  it('Month by month says the same sentences', () => {
    const a = monthAdviceOf(kim);
    expect(a.moves.map((m) => fill(MONTH.advice.moves[m.id], m.slots))).toEqual(SAID);
    expect(a.moves).toEqual(kim.alerts.map(moveOfAlert));
  });
  it('the pots are set against the plan\'s levels as facts: 22,000 and 8,000 below, 8,000 above; in all 22,000 below (22,000 ÷ 536,000 = 4.1%)', () => {
    // 285,500 + 201,000 + 27,500 = 514,000 held; 277,500 + 209,000 + 49,500 = 536,000 the levels
    expect(full).toContain('Your pots against the plan’s levels');
    expect(full).toContain('£22,000 below');
    expect(full).toContain('£8,000 below');
    expect(full).toContain('£8,000 above');
    expect(full).toContain('In all: £22,000 below the plan’s levels (4.1%).');
    expect(full).not.toMatch(/-£|Total Surplus|Min:/);
  });
  it('a saving is the amount saved, never "-£129"', () => {
    expect(full).toMatch(/Tax Saved\s*£129\s*£129\s*£1,546/);
  });
});
