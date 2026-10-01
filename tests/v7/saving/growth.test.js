/**
 * Growth is the drawing engine's growth (test plan 3.3; step 4 brief section 6, P1). The saving years keep their own
 * copy of the monthly arithmetic; this is the test that keeps the copy honest: with nothing paid in and no charge,
 * a pot held in shares grows exactly as today's `simulate` grows it over the same years of the same life, and in the
 * balanced mix every sleeve's month is the drawing engine's month (prepareFutureFrom at offset 0 = the engine).
 */
import { describe, it, expect } from 'vitest';
import {
  savingPlan, savingKernel, livesList, sliceReturns, prepareFutureFrom, simulate, enginePlan, configsAt, TEST_ENV, RISK_PRESETS
} from './_saving.js';
import { saver, priceLevels } from './invariants.js';

const SHARES = { equity: 1, bond: 0, cash: 0 };

/** A config of today's engine for one person's pot in a given mix, drawing nothing, over `years` years. */
function idleConfig(pot, mix, years) {
  const h = saver({ age: 60, pot, stopAge: 60, sp: 'none', mix });
  const plan = enginePlan(h, { today: TEST_ENV.today });
  const [{ config }] = configsAt(plan, 0);
  return { ...config, years, duration: years, targetSchedule: new Array(years).fill(0), baseSalary: 0 };
}

describe('the saving years grow as the drawing engine grows', () => {
  const lives = livesList(20, 50, { seed: 0 });

  it('all shares, nothing paid in, no charge: the pot at the stop is simulate\'s over the same years, to 1p', () => {
    for (const S of [1, 5, 20, 40]) {
      const h = saver({ age: 70 - S, pot: 250_000, stopAge: 70, charge: 0 });
      const plan = savingPlan(h, 70, { ...TEST_ENV, savingMix: SHARES, mix: SHARES });
      const kern = savingKernel(plan, plan.people[0], lives);
      const config = idleConfig(250_000, SHARES, S);
      for (let i = 0; i < lives.length; i++) {
        const sim = simulate(config, sliceReturns(lives[i], 0, S), lives[i].seed);
        expect(sim.failed).toBe(false);
        const nominal = kern.A[i] * priceLevels(lives[i], S)[S];
        expect(Math.abs(nominal - sim.finalEquity), `S ${S} life ${i}`).toBeLessThan(0.01);
      }
    }
  });

  it('each sleeve\'s month is the engine\'s: shares, bonds (the life\'s stream) and cash through prepareFutureFrom at offset 0', () => {
    const S = 12;
    for (let i = 0; i < lives.length; i++) {
      const pf = prepareFutureFrom(lives[i], 0, S);
      for (const [sleeve, mix, field, table] of [['equity', SHARES, 'finalEquity', 'mEq'], ['bond', { equity: 0, bond: 1, cash: 0 }, 'finalBond', 'mBond'], ['cash', { equity: 0, bond: 0, cash: 1 }, 'finalCash', 'mCash']]) {
        const sim = simulate(idleConfig(100_000, mix, S), sliceReturns(lives[i], 0, S), lives[i].seed);
        let v = 100_000;
        for (let m = 0; m < 12 * S; m++) v *= table === 'mBond' ? pf.mBond[m] : pf[table][Math.floor(m / 12)];
        expect(Math.abs(v - sim[field]), `${sleeve} in life ${i}`).toBeLessThan(0.01);
      }
    }
  });

  it('the balanced mix, rebalanced monthly: the kernel is the weighted month of those three sleeves, charged', () => {
    const S = 15;
    const h = saver({ age: 45, pot: 180_000, stopAge: 60, charge: 0.005 });
    const plan = savingPlan(h, 60, TEST_ENV);
    const kern = savingKernel(plan, plan.people[0], lives);
    const w = RISK_PRESETS.balanced;
    const chargeM = Math.pow(1 - 0.005, 1 / 12);
    for (let i = 0; i < lives.length; i++) {
      const pf = prepareFutureFrom(lives[i], 0, S);
      let v = 180_000;
      for (let m = 0; m < 12 * S; m++) {
        const y = Math.floor(m / 12);
        v *= (w.equity * pf.mEq[y] + w.bond * pf.mBond[m] + w.cash * pf.mCash[y]) * chargeM;
      }
      expect(Math.abs(v / priceLevels(lives[i], S)[S] - kern.A[i]) / kern.A[i]).toBeLessThan(1e-12);
    }
  });

  it('the saving mix and the drawing mix are independent: changing the drawing level changes nothing but the slide', () => {
    const a = savingPlan(saver({ age: 45, stopAge: 60, savingRisk: 'adventurous', risk: 'adventurous' }), 60, TEST_ENV);
    const b = savingPlan(saver({ age: 45, stopAge: 60, savingRisk: 'adventurous', risk: 'cautious' }), 60, TEST_ENV);
    for (let y = 0; y < 5; y++) expect(a.mixByYear[y]).toEqual(b.mixByYear[y]);
    expect(a.mixByYear[14]).not.toEqual(b.mixByYear[14]);
  });
});
