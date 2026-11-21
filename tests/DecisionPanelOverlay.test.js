import { describe, it, expect } from 'vitest';
import { buildDecisionHTML } from '../src/ui/components/DecisionPanel.js';

const base = { sippDraw: 2333, isaDraw: 0, totalMonthlyNet: 2076, monthlyTax: 257, source: 'Cash', drawFromCash: 2333, equity: 0, bond: 498625, cash: 81375, adjEquityMin: 0, adjBondMin: 0, adjCashTarget: 0, pa: 12570, brl: 50270, hrl: 125140, taxPaidMonthly: 257, taxPaidYTD: 257, taxProjectedAnnual: 3086, alerts: [{ message: 'Cash low! Move £282,000 Bond→Equity', severity: 'danger', type: 'low-cash' }, { message: 'Tax Boost: +£10', severity: 'success', type: 'tax-boost' }] };

describe('Decision panel with a contract-strategy overlay', () => {
  it('full gilt ladder: rung pays everything, no pot advice, no rebalance alert, tax kept', () => {
    const html = buildDecisionHTML({ ...base, strategyOverlay: { id: 'full-il-gilt', name: 'Full index-linked gilt ladder', floorMonthly: 2333, sleeveMonthly: 0, floorLabel: "this year's matured rung", note: 'Nothing is sold.', hidePots: true } });
    // retaken in step F5 (lead4.md D17): where it comes from, in Month by month's words (src/reading/month.js)
    expect(html).toContain('This year’s gilt</span> £2,333');
    expect(html).toContain('data-fact="month.take.from"');
    expect(html).not.toContain('Fund Status');
    expect(html).not.toContain('Cash low!');
    expect(html).toContain('Tax Boost');
    expect(html).toContain('Tax Summary');
  });
  it('floor & flex: floor from the rung, treats from the sleeve', () => {
    const html = buildDecisionHTML({ ...base, sippDraw: 3333, strategyOverlay: { id: 'floor-and-flex', name: 'Floor & Flex', floorMonthly: 1500, sleeveMonthly: 1833, floorLabel: 'the essentials rung', note: 'x', hidePots: true } });
    expect(html).toContain('£1,500');
    expect(html).toContain('£1,833');
    expect(html).toContain('Your invested money, for the rest</span> £1,833');
  });
  it('the total shown is the engine\'s partial-year-aware figure, not a 12× estimate', () => {
    const html = buildDecisionHTML({ ...base, sippDraw: 3333, other: 0, statePension: 0, monthlyTax: 308, totalMonthlyNet: 3025 });
    expect(html).toContain('£3,025');
  });
  it('pots & valves (no overlay) is unchanged', () => {
    const html = buildDecisionHTML(base);
    expect(html).toContain('Where it comes from');   // step F5: Month by month's heading and list
    expect(html).toContain('Cash</span> £2,333');
    // retaken in 7.12.0 round 3 (decision 6): the pots against the plan's levels, and the low-cash alert as what the month does
    expect(html).toContain('Your pots against the plan’s levels');
    expect(html).toContain('This month takes money from pots below the level your plan keeps them at.');
  });
});
