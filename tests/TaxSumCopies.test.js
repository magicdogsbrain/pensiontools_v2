/**
 * The last hand-written copies of the income tax sum (6.16.0 corrected calculateTax; these still
 * carried the old arithmetic: no withdrawal of the allowance above £100,000, and in two places no
 * 45% rate either). Each now calls the one sum in TaxCalculator:
 *   - Decision.decisionToHistory's fallback (a record made without the engine's monthly tax);
 *   - DecisionPanel's two fallbacks (Tax Summary and the monthly total);
 *   - BudgetModel.grossUpAnnual (take-home → before-tax income);
 *   - the tax-year wizard hands the 45% threshold it collects to the three sums it asks for.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { calculateTax, grossToNet } from '../src/services/TaxCalculator.js';
import { decisionToHistory } from '../src/models/Decision.js';
import { buildDecisionHTML } from '../src/ui/components/DecisionPanel.js';
import { grossUpAnnual, DEFAULT_TAX_BANDS } from '../src/services/BudgetModel.js';

const PA = 12570, BRL = 50270, HRL = 125140;
const here = dirname(fileURLToPath(import.meta.url));
const gbp = (n) => '£' + Math.round(n).toLocaleString('en-GB');

describe('decisionToHistory: the fallback tax is the one tax sum', () => {
  const rec = (annual, extra = {}) => decisionToHistory({ date: '2026-06', sippDraw: annual / 12, other: 0, statePension: 0, isaDraw: 0, equity: 0, bond: 0, cash: 0, pa: PA, brl: BRL, hrl: HRL, ...extra });

  it('matches calculateTax at every level, including the £100,000 taper and the 45% rate', () => {
    for (const annual of [10000, 30000, 50270, 80000, 100000, 110000, 125140, 150000, 200000]) {
      const h = rec(annual);
      expect(h.monthlyTax).toBeCloseTo(calculateTax(annual, PA, BRL, HRL) / 12, 6);
      expect(h.monthlyNet).toBeCloseTo(grossToNet(annual, PA, BRL, HRL) / 12, 6);
    }
  });

  it('£110,000 a year: £33,432 of tax (the old sum said £31,432)', () => {
    expect(rec(110000).monthlyTax * 12).toBeCloseTo(33432, 6);
    expect(rec(150000).monthlyTax * 12).toBeCloseTo(53703, 6);   // old sum: £51,189
  });

  it('missing bands fall back to the standard ones; the engine\'s own monthly tax still wins when present', () => {
    const h = decisionToHistory({ date: '2026-06', sippDraw: 110000 / 12, equity: 0, bond: 0, cash: 0 });
    expect(h.monthlyTax * 12).toBeCloseTo(33432, 6);
    expect(rec(110000, { monthlyTax: 1234 }).monthlyTax).toBe(1234);
  });
});

describe('DecisionPanel: the fallback tax figures are the one tax sum', () => {
  const d = (annual, extra = {}) => ({ sippDraw: annual / 12, other: 0, statePension: 0, isaDraw: 0, source: 'Growth', drawFromEquity: annual / 12, drawFromBond: 0, drawFromCash: 0, equity: 900000, bond: 300000, cash: 50000, adjEquityMin: 0, adjBondMin: 0, adjCashTarget: 0, pa: PA, brl: BRL, hrl: HRL, alerts: [], rebalanceNeeded: false, rebalanceActions: [], ...extra });

  it('£110,000 a year with no engine tax: the monthly total and the projected tax use the taper', () => {
    const html = buildDecisionHTML(d(110000));
    expect(html).toContain(gbp((110000 - 33432) / 12));        // £6,381 a month (old sum: £6,547)
    expect(html).not.toContain(gbp((110000 - 31432) / 12));
    expect(html).toContain(gbp(33432));                        // projected tax for the year
  });

  it('£150,000 a year: the 45% rate is included (the panel\'s old sum stopped at 40%)', () => {
    const html = buildDecisionHTML(d(150000));
    expect(html).toContain(gbp(53703));
    expect(html).toContain(gbp((150000 - 53703) / 12));
  });

  it('below £100,000 nothing moves; the engine\'s figures still win when present', () => {
    expect(buildDecisionHTML(d(60000))).toContain(gbp((60000 - calculateTax(60000, PA, BRL, HRL)) / 12));
    const html = buildDecisionHTML(d(110000, { monthlyTax: 2000, totalMonthlyNet: 7166 }));
    expect(html).toContain('£7,166');
  });
});

describe('BudgetModel.grossUpAnnual: before-tax income for a take-home, with the allowance withdrawn above £100,000', () => {
  const { pa, brl, hrl } = DEFAULT_TAX_BANDS;

  it('round-trips through the one tax sum at every level', () => {
    for (const net of [0, 5000, 12570, 20000, 42730, 45000, 60000, 72568, 75000, 82624, 80000, 90000, 100000, 130000, 200000]) {
      const gross = grossUpAnnual(net);
      expect(grossToNet(gross, pa, brl, hrl)).toBeCloseTo(net, 4);
    }
  });

  it('is unchanged up to a take-home of £72,568 (before-tax £100,000)', () => {
    expect(grossUpAnnual(12000)).toBe(12000);
    expect(grossUpAnnual(40000)).toBeCloseTo(46857.5, 4);
    expect(grossUpAnnual(60000)).toBeCloseTo(79053.33, 2);
    expect(grossUpAnnual(72568)).toBeCloseTo(100000, 4);
  });

  it('above that it is higher than before: £80,000 → £118,580; £100,000 → £156,733', () => {
    expect(grossUpAnnual(75000)).toBeCloseTo(106080, 2);       // was £104,053
    expect(grossUpAnnual(80000)).toBeCloseTo(118580, 2);       // was £112,387
    expect(grossUpAnnual(90000)).toBeCloseTo(138550.91, 2);    // was £129,409
    expect(grossUpAnnual(100000)).toBeCloseTo(156732.73, 2);   // was £147,591 (from £82,624 of take-home up, always £9,141.82 more)
  });

  it('takes other bands when given them', () => {
    const b = { pa: 20000, brl: 60000, hrl: 150000 };
    const gross = grossUpAnnual(95000, b);
    expect(grossToNet(gross, b.pa, b.brl, b.hrl)).toBeCloseTo(95000, 4);
  });
});

describe('Tax-year wizard: the 45% threshold it collects reaches the three sums it asks for', () => {
  const src = readFileSync(join(here, '../src/ui/components/TaxYearSetupWizard.js'), 'utf8');
  const callsOf = (name) => {
    const out = []; const re = new RegExp(name + '\\(\\{', 'g'); let m;
    while ((m = re.exec(src))) out.push(src.slice(m.index, src.indexOf('});', m.index)));
    return out;
  };
  it('calculateIsaNeeded and both calculateMonthlyBreakdown calls pass hrl', () => {
    const isa = callsOf('calculateIsaNeeded'), bd = callsOf('calculateMonthlyBreakdown');
    expect(isa.length).toBe(1);
    expect(bd.length).toBe(2);
    for (const call of [...isa, ...bd]) expect(call).toMatch(/hrl:\s*wizardInputs\.hrl/);
  });
});
