/**
 * The pay-in that gets there (step 4 brief 4.3.2, conflict 13; test plan 3.5): the least monthly total, in whole £10,
 * that reaches a pot in a share of lives — a quantile of c_i = (target − A_i) / B_i, no engine runs.
 */
import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { savingPlan, savingKernel, livesList, payInFor, reachCount, SAVING, TEST_ENV } from './_saving.js';
import { saver } from './invariants.js';

const SEED = 20261002;
const N = 40;
const required = (n, share) => n - Math.floor(n * (1 - share) + 1e-9);

describe('payInFor round trips on 30 random households at 40 lives', () => {
  const lives = livesList(N, 80, { seed: 0 });
  const cases = fc.sample(fc.record({
    age: fc.integer({ min: 22, max: 66 }), years: fc.integer({ min: 1, max: 40 }), pot: fc.integer({ min: 0, max: 1_500_000 }),
    target: fc.integer({ min: 1_000, max: 3_000_000 }), charge: fc.constantFrom(0, 0.005, 0.02),
    savingRisk: fc.constantFrom('cautious', 'balanced', 'adventurous'), risk: fc.constantFrom('cautious', 'balanced', 'adventurous')
  }), { seed: SEED, numRuns: 30 });

  for (const share of [0.9, 0.75, 0.5]) {
    it(`at ${share}: the pay-in reaches the pot in at least the share of lives; £10 less does not`, () => {
      let solved = 0;
      for (const k of cases) {
        const stopAge = Math.min(75, k.age + k.years);
        const plan = savingPlan(saver({ age: k.age, pot: k.pot, stopAge, charge: k.charge, risk: k.risk, savingRisk: k.savingRisk }), stopAge, TEST_ENV);
        const kern = savingKernel(plan, plan.people[0], lives);
        const p = payInFor(kern, k.target, share);
        if (p === null) {
          // out of reach at the ceiling: the ceiling does not reach it
          expect(reachCount(kern, SAVING.payInCeiling, k.target)).toBeLessThan(required(N, share));
          continue;
        }
        expect(p % 10).toBe(0);
        expect(p).toBeLessThanOrEqual(SAVING.payInCeiling);
        expect(reachCount(kern, p, k.target)).toBeGreaterThanOrEqual(required(N, share));
        if (p > 0) expect(reachCount(kern, p - 10, k.target)).toBeLessThan(required(N, share));
        solved++;
      }
      expect(solved).toBeGreaterThan(10);
    });
  }

  it('a lower share never needs more: payInFor(0.5) ≤ payInFor(0.75) ≤ payInFor(0.9)', () => {
    for (const k of cases) {
      const stopAge = Math.min(75, k.age + k.years);
      const plan = savingPlan(saver({ age: k.age, pot: k.pot, stopAge, charge: k.charge }), stopAge, TEST_ENV);
      const kern = savingKernel(plan, plan.people[0], lives);
      const [a, b, c] = [0.5, 0.75, 0.9].map((s) => payInFor(kern, k.target, s));
      const v = (x) => (x === null ? Infinity : x);
      expect(v(a)).toBeLessThanOrEqual(v(b));
      expect(v(b)).toBeLessThanOrEqual(v(c));
    }
  });

  it('more paid in never reaches fewer lives, in every life (A_i + c × B_i rises with c)', () => {
    const plan = savingPlan(saver({ age: 35, pot: 40_000, stopAge: 65 }), 65, TEST_ENV);
    const kern = savingKernel(plan, plan.people[0], lives);
    let before = -1;
    for (let c = 0; c <= 3000; c += 250) {
      const n = reachCount(kern, c, 600_000);
      expect(n).toBeGreaterThanOrEqual(before);
      before = n;
      for (let i = 0; i < N; i++) expect(kern.B[i]).toBeGreaterThan(0);
    }
  });

  it('never a figure over the ceiling: a pot one step out of reach is null, not £10,010', () => {
    const plan = savingPlan(saver({ age: 64, pot: 0, stopAge: 65, charge: 0 }), 65, TEST_ENV);
    const kern = savingKernel(plan, plan.people[0], lives);
    let lo = Infinity;
    for (let i = 0; i < N; i++) lo = Math.min(lo, kern.A[i] + SAVING.payInCeiling * kern.B[i]);
    expect(payInFor(kern, lo, 1)).toBe(SAVING.payInCeiling);
    expect(payInFor(kern, lo * 1.01, 1)).toBe(null);
  });
});
