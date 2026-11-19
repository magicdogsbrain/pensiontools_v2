/**
 * What is left at the plan-to age is read ONE way (the lead's D8, "left at the end: one precision"): the way the plan's
 * "Does it last?" reads its terminal (OneAnswer a.left, SimulationEngine cumInflation, ladderEngine.pct), said to the
 * nearest £1,000 as the plan's words say it. Every figure here is worked by hand; the futures are made up.
 */
import { describe, it, expect } from 'vitest';
import { leftOf } from '../../../src/answers/shared/shortfall.js';
import { leftAt } from '../../../src/answers/shared/band.js';

describe('shortfall.leftOf: the plan\'s middle and best 1 in 10', () => {
  it('ten futures left £0, £1,000 … £9,000: the middle is the 6th in order (position ⌊0.5 × 10⌋ = 5), the best 1 in 10 the 10th', () => {
    // before: the middle was position ⌊(10 − 1) / 2⌋ = 4, £4,000 — the plan says £5,000 for the same ten futures
    const values = Array.from({ length: 10 }, (_, i) => i * 1000);
    expect(leftOf(values)).toEqual({ typical: 5000, best: 9000, mostNone: false });
  });
  it('the figure is taken to the pound first, then said to the nearest £1,000 (OneAnswer: Math.round, then gbpK)', () => {
    // £85,499.60 is £85,500 to the pound, said as £86,000 (the plan's words); rounding straight to £1,000 would say £85,000
    expect(leftOf([85499.6, 85499.6, 85499.6]).typical).toBe(86000);
  });
  it('more than half the futures with nothing left: mostNone (the plan\'s a.share < 0.5)', () => {
    expect(leftOf([0, 0, 0, 5000, 7000]).mostNone).toBe(true);
    expect(leftOf([0, 0, 5000, 7000]).mostNone).toBe(false);
  });
});

describe('band.leftAt: brought to today\'s prices over the run\'s years, as the plan\'s terminal is', () => {
  it('two years at 10% then 20% price rises: £1,320 left at month 24 is £1,000 at today\'s prices', () => {
    // the plan (SimulationEngine): cumInflation = (1 + 0.10) × (1 + 0.20) = 1.32 over years 0 and 1; 1,320 / 1.32 = 1,000.
    // before: the price level of year 2's start, (1 + 0.20) × (1 + 0.05) = 1.26, gave £1,047.62
    const runner = {
      run: () => ({ equity: 1000, bond: 200, cash: 100, isa: 20, failed: false }),
      driversOf: () => ({ inf: Float64Array.from([0.10, 0.20, 0.05]), cumInf: Float64Array.from([1, 1.2, 1.26]) })
    };
    const out = leftAt({ runner, configsOf: () => [{ config: {} }], months: [null], toMonth: 24, years: 3 });
    expect(out[0]).toBeCloseTo(1000, 9);
  });
  it('a future that ran out before then has £0 left', () => {
    const runner = { run: () => { throw new Error('not run'); }, driversOf: () => ({ inf: Float64Array.from([0.1]) }) };
    expect(Array.from(leftAt({ runner, configsOf: () => [], months: [5], toMonth: 12, years: 1 }))).toEqual([0]);
  });
});
