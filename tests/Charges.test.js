/**
 * Fund and platform charges — the one shared module (research/charges-setting.md T1).
 *   - absent / null / NaN / a string / out of range all read as 0 (a locked plan from before charges keeps its figures);
 *   - the monthly factor is exactly 1 at 0% and twelve months of it take off exactly the yearly charge;
 *   - V7's default is today's planner's default.
 */
import { describe, it, expect } from 'vitest';
import {
  DEFAULT_CHARGES_PCT, CHARGES_LIMITS, chargesPctOf, monthlyChargeFactor, normaliseChargesPct, isChargesPct, yearlyChargeFactor
} from '../src/services/Charges.js';
import { SAVING } from '../src/answers/shared/rules.js';

describe('chargesPctOf: the stored value when valid, else 0', () => {
  it('reads a valid percent as it is', () => {
    for (const v of [0, 0.05, 0.5, 1.25, 2.95, 3]) expect(chargesPctOf({ chargesPct: v })).toBe(v);
  });
  it('reads anything else as 0 — absent, null, NaN, Infinity, a string, a negative, above 3', () => {
    for (const s of [undefined, null, {}, { chargesPct: undefined }, { chargesPct: null }, { chargesPct: NaN }, { chargesPct: Infinity },
      { chargesPct: '0.5' }, { chargesPct: -0.05 }, { chargesPct: 3.05 }, { chargesPct: true }, 'x', 7]) {
      expect(chargesPctOf(s), JSON.stringify(s)).toBe(0);
    }
  });
  it('isChargesPct agrees', () => {
    expect(isChargesPct(0)).toBe(true);
    expect(isChargesPct(3)).toBe(true);
    expect(isChargesPct(3.0000001)).toBe(false);
    expect(isChargesPct('1')).toBe(false);
  });
});

describe('monthlyChargeFactor', () => {
  it('is exactly 1 at 0% (and for anything chargesPctOf would read as 0)', () => {
    expect(monthlyChargeFactor(0)).toBe(1);
    for (const v of [undefined, null, NaN, -1, 4, '0.5']) expect(monthlyChargeFactor(v)).toBe(1);
  });
  it('is (1 − c)^(1/12) — the same number V7\'s saving years have always used at 0.5%', () => {
    expect(monthlyChargeFactor(0.5)).toBe(Math.pow(0.995, 1 / 12));
    expect(monthlyChargeFactor(0.5)).toBe(Math.pow(1 - SAVING.charge, 1 / 12));   // saving.js's chargeM before 6.19.0
    expect(monthlyChargeFactor(1.35)).toBe(Math.pow(1 - 1.35 / 100, 1 / 12));
  });
  it('twelve months take off exactly the yearly charge (to 1e-12)', () => {
    for (let k = 0; k <= 60; k++) {
      const pct = k * 0.05;
      let v = 1;
      for (let m = 0; m < 12; m++) v *= monthlyChargeFactor(pct);
      expect(Math.abs(v - (1 - pct / 100)), String(pct)).toBeLessThan(1e-12);
    }
  });
  it('is strictly falling in the charge', () => {
    let last = 1;
    for (let k = 1; k <= 60; k++) { const f = monthlyChargeFactor(k * 0.05); expect(f).toBeLessThan(last); last = f; }
  });
  it('yearlyChargeFactor is (1 − c)^years, exactly 1 at 0% or 0 years', () => {
    expect(yearlyChargeFactor(0, 10)).toBe(1);
    expect(yearlyChargeFactor(0.5, 0)).toBe(1);
    expect(yearlyChargeFactor(0.5, 3)).toBe(Math.pow(0.995, 3));
  });
});

describe('the default and the range', () => {
  it('0.5% a year, 0–3 in steps of 0.05', () => {
    expect(DEFAULT_CHARGES_PCT).toBe(0.5);
    expect(CHARGES_LIMITS).toEqual({ min: 0, max: 3, step: 0.05 });
  });
  it('V7 uses the same default as today\'s planner', () => {
    expect(SAVING.chargesPct).toBe(DEFAULT_CHARGES_PCT);
    expect(SAVING.charge * 100).toBe(DEFAULT_CHARGES_PCT);
  });
  it('normaliseChargesPct clamps to 0–3 and puts a value on the 0.05 grid', () => {
    expect(normaliseChargesPct(0.5)).toBe(0.5);
    expect(normaliseChargesPct('0.45')).toBe(0.45);
    expect(normaliseChargesPct(0.07)).toBe(0.05);
    expect(normaliseChargesPct(0.08)).toBe(0.1);
    expect(normaliseChargesPct(2.95)).toBe(2.95);
    expect(normaliseChargesPct(3.4)).toBe(3);
    expect(normaliseChargesPct(-1)).toBe(0);
    expect(normaliseChargesPct('')).toBeNull();
    expect(normaliseChargesPct('abc')).toBeNull();
    expect(normaliseChargesPct(undefined)).toBeNull();
    for (let k = 0; k <= 60; k++) expect(isChargesPct(normaliseChargesPct(k * 0.05))).toBe(true);
  });
});
