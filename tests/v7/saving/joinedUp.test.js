/**
 * The three join functions added at joining up (step 4 brief 10, J1 and B's speed): each against potNeeded / the
 * verdict it stands in for.
 *   - potNeededAt(sp, H, [f…]) is potNeeded at each fail count, figure for figure;
 *   - potNeededWithin(sp, H, f, P) says exactly whether potNeeded(…) ≤ P;
 *   - savingsNeeded(sp, H, f, from) is the least whole £1,000 ≥ from at which the closed years last with the pension
 *     at its most, and £1,000 less does not (unless it is `from` rounded up).
 */
import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { stopAtPlan, createStopRunner, potNeeded, potNeededAt, potNeededWithin, savingsNeeded, verdictAtPot, SAVING, TEST_ENV } from './_saving.js';
import { saver } from './invariants.js';

const SEED = 20261004;
const env = { ...TEST_ENV, futures: 40 };
const households = fc.record({
  age: fc.integer({ min: 35, max: 64 }), gap: fc.integer({ min: 1, max: 15 }),
  pot: fc.constantFrom(0, 60_000, 250_000), isa: fc.constantFrom(0, 30_000, 120_000), payIn: fc.constantFrom(0, 400, 1_200),
  spend: fc.constantFrom(12_000, 20_000, 30_000, 45_000),
  partner: fc.option(fc.record({ age: fc.integer({ min: 35, max: 64 }), pot: fc.constantFrom(0, 80_000), isa: fc.constant(0), payIn: fc.constantFrom(0, 300) }), { freq: 3 })
}).map((k) => {
  const stopAge = Math.min(75, k.age + k.gap);
  return { stopAge, spend: k.spend, h: saver({ age: k.age, pot: k.pot, isa: k.isa, payIn: k.payIn, stopAge, partner: k.partner }) };
});

describe('potNeededAt — the three numbers at once', () => {
  it('equals potNeeded at 10%, 50% and 90% of the lives allowed to fail, on 16 random households', () => {
    for (const { h, stopAge, spend } of fc.sample(households, { seed: SEED, numRuns: 16 })) {
      const sp = stopAtPlan(h, stopAge, env);
      const fails = [4, 20, 36];
      const want = fails.map((f) => potNeeded(sp, createStopRunner(sp), spend, f));
      expect(potNeededAt(sp, spend, fails), JSON.stringify({ stopAge, spend })).toEqual(want);
    }
  }, 120_000);
});

describe('potNeededWithin — one verdict in place of a search', () => {
  it('true exactly when potNeeded is no more than the pot asked about', () => {
    for (const { h, stopAge, spend } of fc.sample(households, { seed: SEED + 1, numRuns: 10 })) {
      const sp = stopAtPlan(h, stopAge, env);
      const need = potNeeded(sp, createStopRunner(sp), spend, 4);
      for (const P of [0, 99_999, 250_000, 600_499, 1_500_000]) {
        expect(potNeededWithin(sp, spend, 4, P), JSON.stringify({ stopAge, spend, P, need })).toBe(need !== null && need <= P);
      }
    }
  }, 120_000);
});

describe('savingsNeeded — the savings the closed years need in 9 lives out of 10', () => {
  it('stopping at 52 with the pension closed until 57: no less than the draw, it carries those years, £1,000 less does not', () => {
    const sp = stopAtPlan(saver({ age: 48, pot: 200_000, isa: 0, payIn: 500, stopAge: 52 }), 52, { ...TEST_ENV, futures: 100 });
    const from = 5 * 24_000;
    const F = savingsNeeded(sp, 24_000, 10, from);
    expect(F).not.toBe(null);
    expect(F % SAVING.potStep).toBe(0);
    expect(F).toBeGreaterThanOrEqual(from);
    const lastsWith = (x) => verdictAtPot(sp, 24_000, SAVING.potMax, { savingsOf: (i, j) => Math.max(sp.pots[j].savings[i], x * sp.split[j]) }).fails <= 10;
    expect(lastsWith(F)).toBe(true);
    if (F > Math.ceil(from / SAVING.potStep) * SAVING.potStep) expect(lastsWith(F - SAVING.potStep)).toBe(false);
  }, 60_000);
});
