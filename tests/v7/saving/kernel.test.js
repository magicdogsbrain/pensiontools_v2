/**
 * The kernel (step 4 brief 4.3; CF-S6, CF-S7): because the saving years hold the pot at a mix that does not depend on
 * the pot, the pot at the stop is exactly linear in the payment, A_i + c × B_i, and B_i is the sum of the per-year b_{i,y}.
 * Checked against the three-sleeve loop written from the brief (invariants.js), on real lives with random mixes,
 * charges and slides; and the trace (savingRows) against the rules of test plan 3.1.
 */
import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { savingPlan, savingKernel, livesList, payInFor, reachCount, savingRows, potsAtStop, TEST_ENV } from './_saving.js';
import { saver, threeSleeves, checkSaving, flatLife, priceLevels } from './invariants.js';

const SEED = 20261001;
const mixArb = fc.tuple(fc.integer({ min: 0, max: 10 }), fc.integer({ min: 0, max: 10 }), fc.integer({ min: 0, max: 10 }))
  .filter(([a, b, c]) => a + b + c > 0)
  .map(([a, b, c]) => ({ equity: a / (a + b + c), bond: b / (a + b + c), cash: c / (a + b + c) }));

describe('CF-S6 the kernel is the three-sleeve loop, and linear in the payment', () => {
  it('A_i + c × B_i equals the loop to 1e-9 relative for random pay-ins, mixes, charges and slides; Σ_y b_{i,y} = B_i', () => {
    const cases = fc.sample(fc.record({
      age: fc.integer({ min: 25, max: 64 }), years: fc.integer({ min: 1, max: 40 }), pot: fc.integer({ min: 0, max: 2_000_000 }),
      c: fc.double({ min: 0, max: 10_000, noNaN: true }), charge: fc.constantFrom(0, 0.005, 0.01, 0.02),
      savingMix: mixArb, mix: mixArb
    }), { seed: SEED, numRuns: 40 });
    const lives = livesList(12, 90, { seed: 0 });
    let checked = 0;
    for (const k of cases) {
      const stopAge = Math.min(75, k.age + k.years);
      const h = saver({ age: k.age, pot: k.pot, payIn: 0, stopAge, charge: k.charge });
      const env = { ...TEST_ENV, savingMix: k.savingMix, mix: k.mix };
      const plan = savingPlan(h, stopAge, env);
      const kern = savingKernel(plan, plan.people[0], lives);
      const S = plan.S;
      for (let i = 0; i < lives.length; i++) {
        const loop = threeSleeves(plan, lives[i], k.pot, k.c);
        const lin = kern.A[i] + k.c * kern.B[i];
        expect(Math.abs(lin - loop) / Math.max(1, Math.abs(loop))).toBeLessThan(1e-9);
        let sum = 0;
        for (let y = 0; y < S; y++) sum += kern.b[i * S + y];
        expect(Math.abs(sum - kern.B[i]) / Math.max(1e-12, kern.B[i])).toBeLessThan(1e-12);
        checked++;
      }
    }
    expect(checked).toBe(480);
  });

  it('linearity to 1e-12: the loop at c1, c2 and their mix lies on one line', () => {
    const lives = livesList(8, 60, { seed: 0 });
    const plan = savingPlan(saver({ age: 30, pot: 20_000, stopAge: 65, charge: 0.005, savingRisk: 'adventurous' }), 65, TEST_ENV);
    const kern = savingKernel(plan, plan.people[0], lives);
    for (let i = 0; i < lives.length; i++) {
      for (const c of [0, 1, 500, 3333.33, 10_000]) {
        const loop = threeSleeves(plan, lives[i], 20_000, c);
        expect(Math.abs(kern.A[i] + c * kern.B[i] - loop) / loop).toBeLessThan(1e-12);
      }
    }
  });

  it('the savings kernel is the pension kernel\'s growth on the savings: A = savings × F, the same b', () => {
    const lives = livesList(6, 50, { seed: 1 });
    const plan = savingPlan(saver({ age: 40, pot: 100_000, isa: 30_000, stopAge: 60 }), 60, TEST_ENV);
    const p = savingKernel(plan, plan.people[0], lives, 'pension');
    const s = savingKernel(plan, plan.people[0], lives, 'savings');
    for (let i = 0; i < 6; i++) {
      expect(s.A[i] / 30_000).toBeCloseTo(p.A[i] / 100_000, 12);
      expect(s.B[i]).toBe(p.B[i]);
    }
  });
});

describe('CF-S7 the pay-in that reaches a pot, and the reach count', () => {
  it('payInFor(kernel, A + 400 × B, 1) is 400 on one flat life; a pound more needs 410', () => {
    const env = { ...TEST_ENV, futures: 1, futureReturns: flatLife(0.04, 0.02), savingMix: { equity: 1, bond: 0, cash: 0 }, mix: { equity: 1, bond: 0, cash: 0 } };
    const plan = savingPlan(saver({ age: 45, pot: 120_000, stopAge: 60, charge: 0.005 }), 60, env);
    const lives = livesList(1, 16, env);
    const kern = savingKernel(plan, plan.people[0], lives);
    const target = kern.A[0] + 400 * kern.B[0];
    expect(payInFor(kern, target, 1)).toBe(400);
    expect(payInFor(kern, target + 1, 1)).toBe(410);
    expect(reachCount(kern, 400, target)).toBe(1);
    expect(reachCount(kern, 399, target)).toBe(0);
  });
  it('0 when the pot is there already; null above the £10,000 ceiling; null when a stop now cannot reach it', () => {
    const lives = livesList(40, 50, { seed: 0 });
    const plan = savingPlan(saver({ age: 40, pot: 300_000, stopAge: 60 }), 60, TEST_ENV);
    const kern = savingKernel(plan, plan.people[0], lives);
    expect(payInFor(kern, 1000, 0.9)).toBe(0);
    expect(payInFor(kern, 50_000_000, 0.9)).toBe(null);
    const now = savingPlan(saver({ age: 60, pot: 300_000, stopAge: 60 }), 60, TEST_ENV);
    const k0 = savingKernel(now, now.people[0], lives);
    expect(payInFor(k0, 300_000, 0.9)).toBe(0);
    expect(payInFor(k0, 300_001, 0.9)).toBe(null);
  });
});

describe('the trace of the saving months (checkSaving, test plan 3.1)', () => {
  it('real lives, a pay-in, savings, a charge and a slide: every rule holds, and the trace ends where the kernel does', () => {
    const lives = livesList(10, 60, { seed: 0 });
    for (const [age, stopAge] of [[45, 60], [30, 67], [59, 60]]) {
      const h = saver({ age, pot: 150_000, isa: 20_000, payIn: 700, savingsIn: 250, stopAge, charge: 0.005, savingRisk: 'adventurous' });
      const plan = savingPlan(h, stopAge, TEST_ENV);
      const pots = potsAtStop(plan, lives);
      for (let i = 0; i < lives.length; i++) {
        const rows = savingRows(plan, plan.people[0], lives[i]);
        const P = priceLevels(lives[i], plan.S);
        expect(checkSaving(rows, { pot: 150_000, savings: 20_000, payIn: 700, savingsIn: 250, stopAge, ageToday: age, prices: P })).toEqual([]);
        const last = rows[rows.length - 1];
        expect(last.potEnd / P[plan.S]).toBeCloseTo(pots.byLife[i].you.pension, 6);
        expect(last.savingsEnd / P[plan.S]).toBeCloseTo(pots.byLife[i].you.savings, 6);
      }
    }
  });
  it('S7 nothing paid in, nothing grows, no charge: the pot never moves', () => {
    const env = { ...TEST_ENV, futures: 1, futureReturns: flatLife(0, 0), savingMix: { equity: 1, bond: 0, cash: 0 }, mix: { equity: 1, bond: 0, cash: 0 } };
    const plan = savingPlan(saver({ age: 50, pot: 99_000, stopAge: 55, charge: 0 }), 55, env);
    const life = livesList(1, 6, env)[0];
    const rows = savingRows(plan, plan.people[0], life);
    expect(rows).toHaveLength(60);
    for (const r of rows) { expect(r.potEnd).toBeCloseTo(99_000, 6); expect(r.paidIn.total).toBe(0); }
  });
  it('the planted fault "paid at the end of the month" is caught: growth on the payment is required', () => {
    const lives = livesList(1, 30, { seed: 0 });
    const plan = savingPlan(saver({ age: 45, pot: 100_000, payIn: 1000, stopAge: 55 }), 55, TEST_ENV);
    const rows = savingRows(plan, plan.people[0], lives[0]);
    const bad = rows.map((r) => ({ ...r, growth: r.growth - r.paidIn.total * (r.potEnd / (r.potStart + r.paidIn.total) - 1) }));
    expect(checkSaving(bad, { pot: 100_000, savings: 0, payIn: 1000, savingsIn: 0, stopAge: 55, ageToday: 45 }).length).toBeGreaterThan(0);
  });
});
