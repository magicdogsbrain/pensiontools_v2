/**
 * Spending Model — the shared retirement spending curve used identically by the Stress engine,
 * the Decision drawdown projection, and the April tax-year wizard.
 *
 * Shape: level years 0-4, ~1%/yr real decline years 5-24, level thereafter.
 */

import { describe, it, expect } from 'vitest';
import {
  spendingSmileFactor,
  spendingDeclineRateForYear,
  SPEND_DECLINE_START_YEAR,
  SPEND_DECLINE_YEARS,
  SPEND_DECLINE_RATE
} from '../src/services/SpendingModel.js';

const FLOOR = Math.pow(1 - SPEND_DECLINE_RATE, SPEND_DECLINE_YEARS); // ~0.8179

describe('SpendingModel — absolute factor (engines)', () => {
  it('flat profile is a no-op at every year', () => {
    for (const y of [0, 5, 12, 25, 40]) expect(spendingSmileFactor(y, 'flat')).toBe(1);
  });

  it('declining: level for the first 5 years (0-4)', () => {
    for (const y of [0, 1, 2, 3, 4]) expect(spendingSmileFactor(y, 'declining')).toBeCloseTo(1, 10);
  });

  it('declining: first drop at year 5, then ~1%/yr', () => {
    expect(spendingSmileFactor(5, 'declining')).toBeCloseTo(0.99, 10);       // 1 step
    expect(spendingSmileFactor(6, 'declining')).toBeCloseTo(0.99 ** 2, 10);  // 2 steps
    expect(spendingSmileFactor(24, 'declining')).toBeCloseTo(FLOOR, 10);     // 20 steps
  });

  it('declining: levels off after year 24 (no further decline)', () => {
    expect(spendingSmileFactor(25, 'declining')).toBeCloseTo(FLOOR, 10);
    expect(spendingSmileFactor(35, 'declining')).toBeCloseTo(FLOOR, 10);
    expect(spendingSmileFactor(60, 'declining')).toBeCloseTo(FLOOR, 10);
  });

  it('total real drop is gentle (~18%, less severe than the old 25% floor)', () => {
    expect(FLOOR).toBeGreaterThan(0.80);
    expect(FLOOR).toBeLessThan(0.83);
  });

  it('exposes the phase constants (5 flat / 20 declining)', () => {
    expect(SPEND_DECLINE_START_YEAR).toBe(5);
    expect(SPEND_DECLINE_YEARS).toBe(20);
    expect(SPEND_DECLINE_RATE).toBeCloseTo(0.01, 10);
  });
});

describe('SpendingModel — incremental rate (wizard)', () => {
  it('flat profile never declines', () => {
    for (const y of [0, 5, 12, 25]) expect(spendingDeclineRateForYear(y, 'flat')).toBe(0);
  });

  it('declining: 0 in the level phases, ~1% only across years 5-24', () => {
    expect(spendingDeclineRateForYear(4, 'declining')).toBeCloseTo(0, 10);
    expect(spendingDeclineRateForYear(5, 'declining')).toBeCloseTo(0.01, 10);
    expect(spendingDeclineRateForYear(24, 'declining')).toBeCloseTo(0.01, 10);
    expect(spendingDeclineRateForYear(25, 'declining')).toBeCloseTo(0, 10);
    expect(spendingDeclineRateForYear(40, 'declining')).toBeCloseTo(0, 10);
  });

  it('the wizard (incremental) reconstructs the engine (absolute) factor exactly', () => {
    // ∏ (1 − rate(k)) for k=1..N must equal the absolute factor(N): same curve, two views.
    for (const N of [3, 5, 10, 24, 25, 35]) {
      let compounded = 1;
      for (let k = 1; k <= N; k++) compounded *= (1 - spendingDeclineRateForYear(k, 'declining'));
      expect(compounded).toBeCloseTo(spendingSmileFactor(N, 'declining'), 10);
    }
  });
});
