/**
 * The saving years' closed forms (step 4 brief 4.3.3, CF-S1–S9; test plan 3.4). Made-up lives (env.futureReturns) and
 * exact mixes (env.savingMix, env.mix), so every sum can be done by hand. Payments go in at the start of the month
 * (annuity-due) and rise with prices; the charge comes off monthly.
 */
import { describe, it, expect } from 'vitest';
import { savingPlan, potsAtStop, livesList, savingKernel, projectAccumulation, RISK_PRESETS, TEST_ENV } from './_saving.js';
import { saver, flatLife } from './invariants.js';

const SHARES = { equity: 1, bond: 0, cash: 0 };
const CASH = { equity: 0, bond: 0, cash: 1 };
const PENNY = 0.01;

/** The pot at the stop of person 0 in life 0, today's prices. */
function potAt(h, stopAge, env) {
  const plan = savingPlan(h, stopAge, env);
  const lives = livesList(1, Math.max(1, plan.S + 1), env);
  const pots = potsAtStop(plan, lives);
  return { plan, lives, you: pots.byLife[0].you, spread: pots.spread, byLife: pots.byLife };
}

describe('CF-S1 nothing grows: 0%, flat prices, no charge → pot + 12 × S × c', () => {
  for (const [age, stop, pot, c] of [[45, 60, 120_000, 500], [30, 67, 0, 687.5], [50, 51, 250_000, 1], [60, 60, 80_000, 900]]) {
    it(`${age} → ${stop}, £${pot}, £${c} a month`, () => {
      const env = { ...TEST_ENV, futures: 1, futureReturns: flatLife(0, 0), savingMix: SHARES, mix: SHARES };
      const { you, spread } = potAt(saver({ age, pot, payIn: c, stopAge: stop, charge: 0 }), stop, env);
      expect(Math.abs(you.pension - (pot + 12 * (stop - age) * c))).toBeLessThan(PENNY);
      expect(spread.pension.careful).toBe(spread.pension.middling);
      expect(spread.pension.middling).toBe(spread.pension.good);
    });
  }
  it('the same in cash (cash at its floor earns 0 when prices are flat)', () => {
    const env = { ...TEST_ENV, futures: 1, futureReturns: flatLife(0, 0), savingMix: CASH, mix: CASH };
    const { you } = potAt(saver({ age: 45, pot: 120_000, payIn: 500, stopAge: 60, charge: 0 }), 60, env);
    expect(Math.abs(you.pension - 210_000)).toBeLessThan(PENNY);
  });
});

describe('CF-S2 a charge q a year: P × Q^(12S) + c × Q × (Q^(12S) − 1) / (Q − 1), Q = (1 − q)^(1/12)', () => {
  for (const q of [0.005, 0.01, 0.02]) {
    it(`charge ${q * 100}%`, () => {
      const env = { ...TEST_ENV, futures: 1, futureReturns: flatLife(0, 0), savingMix: SHARES, mix: SHARES };
      const P = 120_000, c = 500, S = 15;
      const { you } = potAt(saver({ age: 45, pot: P, payIn: c, stopAge: 45 + S, charge: q }), 45 + S, env);
      const Q = Math.pow(1 - q, 1 / 12);
      const M = 12 * S;
      const want = P * Math.pow(Q, M) + c * Q * (Math.pow(Q, M) - 1) / (Q - 1);
      expect(Math.abs(you.pension - want)).toBeLessThan(PENNY);
    });
  }
});

describe('CF-S3 compound interest: shares r a year, all shares, no charge (annuity-due)', () => {
  const cases = [];
  for (const S of [1, 15, 40]) for (const P of [0, 120_000]) for (const c of [0, 687.5]) for (const r of [0.02, 0.05, 0.08]) cases.push([S, P, c, r]);
  it(`${cases.length} cases, each within 1p`, () => {
    for (const [S, P, c, r] of cases) {
      const env = { ...TEST_ENV, futures: 1, futureReturns: flatLife(r, 0), savingMix: SHARES, mix: SHARES };
      const age = 60 - S;
      const { you } = potAt(saver({ age, pot: P, payIn: c, stopAge: 60, charge: 0 }), 60, env);
      const q = Math.pow(1 + r, 1 / 12);
      const M = 12 * S;
      const want = P * Math.pow(q, M) + (c > 0 ? c * q * (Math.pow(q, M) - 1) / (q - 1) : 0);
      expect(Math.abs(you.pension - want), `S ${S} P ${P} c ${c} r ${r}`).toBeLessThan(PENNY);
    }
  });
});

describe('CF-S4 prices rising π a year: the pot in today\'s prices', () => {
  it('with nothing paid in, it is S3 at the real rate r′ = (1 + r)/(1 + π) − 1, within 1p', () => {
    for (const [r, pi, S] of [[0.05, 0.025, 15], [0.08, 0.03, 40], [0.02, 0.04, 10]]) {
      const env = { ...TEST_ENV, futures: 1, futureReturns: flatLife(r, pi), savingMix: SHARES, mix: SHARES };
      const P = 120_000;
      const { you } = potAt(saver({ age: 60 - S, pot: P, payIn: 0, stopAge: 60, charge: 0 }), 60, env);
      const real = (1 + r) / (1 + pi) - 1;
      expect(Math.abs(you.pension - P * Math.pow(1 + real, S))).toBeLessThan(PENNY);
    }
  });
  it('with a pay-in, the payments of year y are c × (1 + π)^y (prices step once a year, as the engine\'s) — the stepped sum, within 1p', () => {
    // Deviation from the brief's wording, stated: the real-rate identity is exact for the pot alone. With a monthly
    // payment rising once a year the real value is the stepped sum below, not S3 at r′ (which assumes prices rising monthly).
    for (const [r, pi, S, c] of [[0.05, 0.025, 15, 687.5], [0.08, 0.03, 40, 300]]) {
      const env = { ...TEST_ENV, futures: 1, futureReturns: flatLife(r, pi), savingMix: SHARES, mix: SHARES };
      const P = 120_000;
      const { you } = potAt(saver({ age: 60 - S, pot: P, payIn: c, stopAge: 60, charge: 0 }), 60, env);
      const q = Math.pow(1 + r, 1 / 12);
      let nominal = P * Math.pow(q, 12 * S);
      for (let y = 0; y < S; y++) nominal += c * Math.pow(1 + pi, y) * q * (Math.pow(q, 12) - 1) / (q - 1) * Math.pow(q, 12 * (S - 1 - y));
      const want = nominal / Math.pow(1 + pi, S);
      expect(Math.abs(you.pension - want)).toBeLessThan(PENNY);
    }
  });
});

describe('CF-S5 the slide moves weights, never value', () => {
  it('shares at 0 and cash at its floor: the pot with a slide equals the pot without', () => {
    const base = { ...TEST_ENV, futures: 1, futureReturns: flatLife(0, 0) };
    const slid = potAt(saver({ age: 40, pot: 50_000, payIn: 400, stopAge: 60, charge: 0 }), 60, { ...base, savingMix: SHARES, mix: CASH });
    const flat = potAt(saver({ age: 40, pot: 50_000, payIn: 400, stopAge: 60, charge: 0 }), 60, { ...base, savingMix: SHARES, mix: SHARES });
    expect(Math.abs(slid.you.pension - flat.you.pension)).toBeLessThan(PENNY);
    expect(Math.abs(slid.you.pension - (50_000 + 240 * 400))).toBeLessThan(PENNY);
  });
  it('the mix by year: the saving mix, then a straight line over the last ten years reaching the drawing mix at the stop', () => {
    const env = { ...TEST_ENV, futures: 1, savingMix: SHARES, mix: CASH };
    const plan = savingPlan(saver({ age: 40, stopAge: 60 }), 60, env);
    expect(plan.mixByYear).toHaveLength(20);
    for (let y = 0; y < 10; y++) expect(plan.mixByYear[y]).toEqual(SHARES);
    for (let y = 10; y < 20; y++) {
      const t = (y - 10) / 10;
      expect(plan.mixByYear[y].equity).toBeCloseTo(1 - t, 12);
      expect(plan.mixByYear[y].cash).toBeCloseTo(t, 12);
    }
    const short = savingPlan(saver({ age: 55, stopAge: 60 }), 60, env);
    expect(short.mixByYear.map((w) => w.equity)).toEqual([1, 0.8, 0.6, 0.4, 0.2].map((v, k) => (k === 0 ? 1 : expect.closeTo(v, 12))));
    expect(short.slideYears).toBe(5);
  });
  it('the same levels: no slide; the risk levels are RISK_PRESETS', () => {
    const h = saver({ age: 40, stopAge: 60, risk: 'cautious', savingRisk: 'cautious' });
    const plan = savingPlan(h, 60, TEST_ENV);
    expect(plan.slideYears).toBe(0);
    for (const w of plan.mixByYear) expect(w).toEqual({ equity: RISK_PRESETS.cautious.equity, bond: RISK_PRESETS.cautious.bond, cash: RISK_PRESETS.cautious.cash });
    const up = savingPlan(saver({ age: 40, stopAge: 60, risk: 'balanced', savingRisk: 'adventurous' }), 60, TEST_ENV);
    expect(up.slideYears).toBe(10);
    expect(up.mixByYear[0].equity).toBe(RISK_PRESETS.adventurous.equity);
    expect(up.mixByYear[19].equity).toBeCloseTo(0.7 + (0.5 - 0.7) * 0.9, 12);
  });
});

describe('CF-S8 today\'s Accumulation tab, while it exists (the two conventions differ)', () => {
  it('the FCA rates 2 / 5 / 8% with prices at 2.5%: within 2% of projectAccumulation at 60, and why', () => {
    // The two conventions: here, a twelfth root of the year's return a month, the payment at the START of the month,
    // rising with prices once a year; projectAccumulation: r/12 a month, the payment at the END of the month, rising
    // by escalationPct once a year (set to prices here so the payments match). The old tab grows faster (r/12 compounds
    // to more than r a year: 8.30% for 8%) and pays in later. Measured 1 Oct 2026: +0.12% at 2%, +1.12% at 5%, +3.20%
    // at 8% — so the brief's "within 2%" holds at 2% and 5% only; at 8% the old tab's r/12 is 0.3% a year faster,
    // which over 15 years is 3.2%. Exact in the engine's own convention: CF-S3.
    const rows = projectAccumulation({ currentAge: 45, retirementAge: 60, potNow: 120_000, totalMonthly: 687.5, escalationPct: 2.5, assumedCpi: 0.025 });
    const old = rows[rows.length - 1];
    const differences = {};
    for (const [key, r] of [['potLow', 0.02], ['potMid', 0.05], ['potHigh', 0.08]]) {
      const env = { ...TEST_ENV, futures: 1, futureReturns: flatLife(r, 0.025), savingMix: SHARES, mix: SHARES };
      const { you } = potAt(saver({ age: 45, pot: 120_000, payIn: 687.5, stopAge: 60, charge: 0 }), 60, env);
      differences[key] = (old[key] - you.pension) / you.pension;
    }
    expect(differences.potLow).toBeGreaterThan(0);
    expect(Math.abs(differences.potLow), JSON.stringify(differences)).toBeLessThan(0.02);
    expect(Math.abs(differences.potMid), JSON.stringify(differences)).toBeLessThan(0.02);
    expect(Math.abs(differences.potHigh), JSON.stringify(differences)).toBeLessThan(0.035);
  });
});

describe('CF-S9 savings, and a couple', () => {
  it('savingsIn £500 on S1: savings at the stop = savings + 500 × 12S', () => {
    const env = { ...TEST_ENV, futures: 1, futureReturns: flatLife(0, 0), savingMix: SHARES, mix: SHARES };
    const { you } = potAt(saver({ age: 45, pot: 120_000, isa: 60_000, payIn: 500, savingsIn: 500, stopAge: 60, charge: 0 }), 60, env);
    expect(Math.abs(you.savings - (60_000 + 500 * 180))).toBeLessThan(PENNY);
    expect(Math.abs(you.pension - 210_000)).toBeLessThan(PENNY);
  });
  it('a couple, both S1: each person\'s pot as S1, the household twice it', () => {
    const env = { ...TEST_ENV, futures: 1, futureReturns: flatLife(0, 0), savingMix: SHARES, mix: SHARES };
    const h = saver({ age: 45, pot: 120_000, payIn: 500, stopAge: 60, charge: 0, partner: { age: 45, pot: 120_000, payIn: 500 } });
    const { byLife, spread } = potAt(h, 60, env);
    expect(Math.abs(byLife[0].you.pension - 210_000)).toBeLessThan(PENNY);
    expect(Math.abs(byLife[0].partner.pension - 210_000)).toBeLessThan(PENNY);
    expect(Math.abs(spread.pension.middling - 420_000)).toBeLessThanOrEqual(1);
  });
  it('a stop at today\'s age: zero saving months, the kernel is the pot', () => {
    const plan = savingPlan(saver({ age: 60, pot: 80_000, isa: 5_000, payIn: 900, stopAge: 60 }), 60, TEST_ENV);
    expect(plan.S).toBe(0);
    const lives = livesList(5, 35, TEST_ENV);
    const k = savingKernel(plan, plan.people[0], lives);
    expect(Array.from(k.A)).toEqual([80_000, 80_000, 80_000, 80_000, 80_000]);
    expect(k.b.length).toBe(0);
    expect(Array.from(k.priceAtStop)).toEqual([1, 1, 1, 1, 1]);
    const s = savingKernel(plan, plan.people[0], lives, 'savings');
    expect(Array.from(s.A)).toEqual([5_000, 5_000, 5_000, 5_000, 5_000]);
    const pots = potsAtStop(plan, lives);
    expect(pots.spread.pension).toEqual({ careful: 80_000, middling: 80_000, good: 80_000 });
  });
});
