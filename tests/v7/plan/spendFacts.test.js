/**
 * The spending page's worked-out lines carry each income step's two figures as that step's facts (lead4.md G1), numbered in
 * the order the steps come; the other lines carry none. A lump sum's line carries its amount and age by its place.
 */
import { describe, it, expect } from 'vitest';
import { spendDerivedFactsOf, spendLumpFactsOf } from '../../../src/v7/components/facts.js';
import { isFactId } from '../../../src/reading/facts.js';

describe('the spending page marks', () => {
  it('each step line marks its month after tax and its year before tax, by the step\'s number', () => {
    const lines = [{ id: 'first.level' }, { id: 'step.falls' }, { id: 'floor.from' }, { id: 'step.glides' }];
    const got = spendDerivedFactsOf(lines);
    expect(got).toEqual([
      { monthly: 'income.step.0.monthAfterTax', yearly: 'income.step.0.beforeTax' },
      { monthly: 'income.step.1.monthAfterTax', yearly: 'income.step.1.beforeTax' },
      {},
      { monthly: 'income.step.2.monthAfterTax', yearly: 'income.step.2.beforeTax' }
    ]);
    for (const m of got) for (const id of Object.values(m)) expect(isFactId(id)).toBe(true);
  });
  it('a lump sum by its place', () => {
    expect(spendLumpFactsOf(1)).toEqual({ amount: 'lump.1.amount', age: 'lump.1.age' });
  });
});
