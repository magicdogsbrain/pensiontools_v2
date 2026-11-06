/**
 * The futures are one market (test plan 3.2; step 4 brief 4.4). A life is one market path from today to the end
 * age; C's future `i` is its first years, bond stream and all. This is what makes "stop now" question C, and what
 * lets every stop age be a cut of the same thousand lives.
 */
import { describe, it, expect } from 'vitest';
import {
  livesList, lifeReturns, sliceReturns, bondStream, futuresList, marketSeed, engineSeed, bootstrapPaths, annualNominal,
  prepareFutureFrom, prepareFutureFull, stopAtPlan, TEST_ENV
} from './_saving.js';
import { saver } from './invariants.js';

const SAMPLE = Array.from({ length: 20 }, (_, k) => k * 37 + 3);    // 20 future indexes spread over the first 700
const hash = (lives) => {
  let h = 0;
  const mix = (x) => { h = (Math.imul(h ^ (x | 0), 2654435761) + ((x * 1e6) | 0)) | 0; };
  for (const l of lives) {
    mix(l.id); mix(l.seed);
    for (const k of Object.keys(l.returns.equity)) { mix(l.returns.equity[k] * 1e9); mix(l.returns.inflation[k] * 1e9); }
    for (let m = 0; m < l.stream.length; m++) mix(l.stream[m] * 1e9);
  }
  return h;
};

describe('a life is a prefix-extension of C\'s future', () => {
  it('lifeReturns(i, T1) is the first T1 years of lifeReturns(i, T2), for 20 lives and several seeds', () => {
    for (const seed of [0, 1, 7]) {
      for (const i of SAMPLE) {
        const short = lifeReturns(i, 20, { seed });
        const long = lifeReturns(i, 65, { seed });
        for (let y = 0; y < 20; y++) {
          expect(short.equity[y]).toBe(long.equity[y]);
          expect(short.inflation[y]).toBe(long.inflation[y]);
        }
      }
    }
  });

  it('the bond stream of a short life is the first 12 × T1 months of a long one', () => {
    const short = livesList(40, 20, { seed: 0 });
    const long = livesList(40, 65, { seed: 0 });
    for (const i of SAMPLE.filter((k) => k < 40)) {
      expect(short[i].stream.length).toBe(240);
      expect(long[i].stream.length).toBe(780);
      for (let m = 0; m < 240; m++) expect(short[i].stream[m]).toBe(long[i].stream[m]);
    }
  });

  it('a life at seed s is C\'s future at seed s: the same returns, the same engine seed', () => {
    for (const seed of [0, 3]) {
      const futures = futuresList(40, 30, { seed });
      const lives = livesList(40, 50, { seed });
      for (let i = 0; i < 40; i++) {
        expect(lives[i].seed).toBe(futures[i].seed);
        expect(lives[i].seed).toBe(engineSeed(i, seed));
        for (let y = 0; y < 30; y++) {
          expect(lives[i].returns.equity[y]).toBe(futures[i].returns.equity[y]);
          expect(lives[i].returns.inflation[y]).toBe(futures[i].returns.inflation[y]);
        }
      }
    }
  });

  it('sliceReturns(life, S, D) is annualNominal(path, 12S, D), bit for bit', () => {
    for (const i of SAMPLE) {
      const T = 60;
      const life = livesList(i + 1, T, { seed: 0 })[i];
      const path = bootstrapPaths(marketSeed(i, 0), T * 12);
      for (const [S, D] of [[0, 30], [10, 35], [25, 35], [59, 1]]) {
        const want = annualNominal(path.rtr, path.cpi, 12 * S, D);
        const got = sliceReturns(life, S, D);
        expect(Object.keys(got.equity).length).toBe(D);
        for (let y = 0; y < D; y++) {
          expect(got.equity[y]).toBe(want.equity[y]);
          expect(got.inflation[y]).toBe(want.inflation[y]);
        }
      }
    }
  });

  it('the drawing years at offset 0 are C\'s prepared future, to the bit (prepareFutureFrom(life, 0, D) = prepareFuture)', () => {
    const D = 35;
    const futures = futuresList(40, D, { seed: 0 });
    const lives = livesList(40, 60, { seed: 0 });
    for (let i = 0; i < 40; i++) {
      const a = prepareFutureFrom(lives[i], 0, D);
      const b = prepareFutureFull(futures[i], D);
      for (const f of ['cumInf', 'mEq', 'mCash', 'inf', 'eq', 'prevInf']) expect(Array.from(a[f]), f).toEqual(Array.from(b[f]));
      expect(a.months).toBe(b.months);
      expect(a.bondMonths).toBe(D * 12);
      expect(Array.from(a.mBond)).toEqual(Array.from(b.mBond));
    }
  });

  it('the drawing years at a later stop read the life on: prices from 1, shares and bonds continued, cash from the true previous year', () => {
    const life = livesList(1, 60, { seed: 0 })[0];
    const S = 12, D = 30;
    const pf = prepareFutureFrom(life, 12 * S, D);
    expect(pf.cumInf[0]).toBe(1);
    for (let y = 0; y < D; y++) {
      expect(pf.eq[y]).toBe(life.returns.equity[S + y]);
      expect(pf.inf[y]).toBe(life.returns.inflation[S + y]);
    }
    expect(pf.prevInf[0]).toBe(life.returns.inflation[S - 1]);
    expect(pf.mCash[0]).toBe(Math.pow(1 + Math.max(0, life.returns.inflation[S - 1] - 0.01), 1 / 12));
    for (let m = 0; m < 12 * D; m++) expect(pf.mBond[m]).toBe(life.stream[12 * S + m]);
    expect(pf.cumInf[5]).toBeCloseTo([1, 2, 3, 4, 5].reduce((c, y) => c * (1 + life.returns.inflation[S + y]), 1), 14);
  });
});

describe('the lives depend on the seed, the count and the length only', () => {
  it('two households of every different amount, the same length, get the same lives (hash unchanged)', () => {
    const env = { ...TEST_ENV, futures: 25 };
    const a = stopAtPlan(saver({ age: 40, pot: 10_000, payIn: 300, stopAge: 60, endAge: 95 }), 60, env);
    const b = stopAtPlan(saver({ age: 40, pot: 900_000, isa: 50_000, payIn: 4000, savingsIn: 500, stopAge: 55, endAge: 90, risk: 'adventurous', charge: 0.02 }), 55, env);
    expect(a.T).toBe(55);
    expect(b.T).toBe(50);
    expect(hash(livesList(25, 55, env))).toBe(hash(a.lives));
    expect(hash(b.lives)).toBe(hash(livesList(25, 50, env)));
    // and the first 50 years of a's lives are b's
    for (let i = 0; i < 25; i++) for (let m = 0; m < 600; m++) expect(a.lives[i].stream[m]).toBe(b.lives[i].stream[m]);
  });

  it('is deterministic: two builds are equal, and the stream is the engine\'s own generator on engineSeed', () => {
    const one = livesList(15, 40, { seed: 2 });
    const two = livesList(15, 40, { seed: 2 });
    expect(hash(one)).toBe(hash(two));
    for (const life of one) expect(Array.from(bondStream(life))).toEqual(Array.from(life.stream));
    expect(hash(livesList(15, 40, { seed: 3 }))).not.toBe(hash(one));
  });
});
