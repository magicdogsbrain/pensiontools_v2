/**
 * Ruling Z1a: the reader says what the plan's way TAKES before tax.
 *
 * A way that draws (Pots & Valves, Buckets in order) takes from the pension the figure planDrawdown works out, so with a
 * quarter of each payment tax-free it takes less before tax than the figure held (the held figure is counted as if every
 * pound were taxed). A way that buys its income (a gilt ladder, a floor) buys and pays the figure as held: that IS what it
 * takes before tax. So the steps table, Settings, the simple plan page, the year table and the cone all say the held figure
 * for a plan on a ladder.
 *
 * Made up by hand, on the bands £12,570 / £50,270 (20% between): Jo holds 23,858 a year (£1,800 a month after tax), a
 * quarter of each payment tax-free, nothing else coming in. Drawn: 0.85G + 2,514 = 21,600.40, G = £22,455. Bought: £23,858.
 */
import { describe, it, expect } from 'vitest';
import { takenOfTarget } from '../../src/services/BeforeTax.js';
import { stepFiguresOf, incomeStepsOf } from '../../src/reading/income.js';
import { contextFor } from '../../src/reading/context.js';
import { FIXTURES, PARITY_DAY } from '../../e2e/parity/fixtures/plans.js';

const base = { accessMethod: 'ufpls', pa: 12570, brl: 50270, hrl: 125140 };

describe('the one rule: a way that draws converts, a way that buys says the figure held', () => {
  it('Pots & Valves and Buckets in order take £22,455; no way named is Pots & Valves', () => {
    expect(takenOfTarget(23858, { ...base, strategyId: 'pots-and-valves' })).toBe(22455);
    expect(takenOfTarget(23858, { ...base, strategyId: 'buckets-in-order' })).toBe(22455);
    expect(takenOfTarget(23858, base)).toBe(22455);
  });
  it('a ladder or a floor takes £23,858: the figure it buys and pays', () => {
    expect(takenOfTarget(23858, { ...base, strategyId: 'full-il-gilt' })).toBe(23858);
    expect(takenOfTarget(23858, { ...base, strategyId: 'floor-the-schedule' })).toBe(23858);
    expect(stepFiguresOf(23858, { settings: { ...base, strategyId: 'full-il-gilt' } }).beforeTax).toBe(23858);
  });
});

describe('the income reader on a plan that buys its income', () => {
  for (const key of ['saver-ladder-draft', 'saver-locked-ladder']) {
    it(`${key}: every step says the figure held, with a quarter tax-free`, () => {
      const plans = FIXTURES.find((f) => f.key === key).plans();
      const plan = plans[0];
      plan.stressTool.settings.accessMethod = 'ufpls';
      if (plan.planDocument && plan.planDocument.strategy) plan.planDocument.strategy.id = 'full-il-gilt';
      const r = incomeStepsOf(plan, contextFor(plan, { today: PARITY_DAY, plans }));
      expect(r.steps.length).toBeGreaterThan(0);
      for (const st of r.steps) expect(st.beforeTax).toBe(st.stored);
    });
  }
  it('the same plan on Pots & Valves still converts (less than held)', () => {
    const plans = FIXTURES.find((f) => f.key === 'saver-ladder-draft').plans();
    const plan = plans[0];
    plan.stressTool.settings.accessMethod = 'ufpls';
    plan.stressTool.settings.strategyId = 'pots-and-valves';
    plan.strategy = { ...(plan.strategy || {}), id: 'pots-and-valves' };
    const st = incomeStepsOf(plan, contextFor(plan, { today: PARITY_DAY, plans })).steps[0];
    expect(st.beforeTax).toBeLessThan(st.stored);
  });
});
