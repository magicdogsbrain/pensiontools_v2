/**
 * How ISAs and savings grow — the one shared module (research/saver-lock-and-savings-growth.md 3.1; test 1).
 *
 *   - two choices, 'cash' ("Mostly cash", the default for new plans) and 'invested' ("Invested like my pension");
 *   - a plan with no choice reads as null: every engine then runs today's fixed rate (ISA_DEFAULTS.RETURN), so a plan
 *     locked before the choice existed keeps its figures;
 *   - "invested" weighs the month's three pension factors by the pension's mix: an explicit mix (V7) wins, else the
 *     run's own pension pots, else all cash; the bond tent re-splits the shares and bonds part.
 */
import { describe, it, expect } from 'vitest';
import {
  ISA_GROWTH, ISA_GROWTH_VALUES, DEFAULT_ISA_GROWTH, isIsaGrowth, isaGrowthOf, isIsaGrowthMix, isaGrowthWeights,
  glidedIsaWeights, investedIsaFactor, ISA_CASH_SPREAD, cashProjectionRate
} from '../src/services/IsaGrowth.js';
import { CASH_REAL_SPREAD } from '../src/services/SimulationEngine.js';
import { ISA_DEFAULTS } from '../src/constants.js';

describe('the names and the default', () => {
  it('two choices, "cash" first and the default', () => {
    expect(ISA_GROWTH).toEqual({ CASH: 'cash', INVESTED: 'invested' });
    expect(ISA_GROWTH_VALUES).toEqual(['cash', 'invested']);
    expect(DEFAULT_ISA_GROWTH).toBe('cash');
    expect(Object.isFrozen(ISA_GROWTH)).toBe(true);
    expect(Object.isFrozen(ISA_GROWTH_VALUES)).toBe(true);
  });

  it('isIsaGrowth takes the two names only', () => {
    expect(isIsaGrowth('cash')).toBe(true);
    expect(isIsaGrowth('invested')).toBe(true);
    for (const v of [undefined, null, '', 'Cash', 'CASH', 'mixed', 0.03, 3, true, {}, []]) expect(isIsaGrowth(v), String(v)).toBe(false);
  });

  it('isaGrowthOf: the plan\'s choice, or null when it has none (absent, null, a number, a wrong string)', () => {
    expect(isaGrowthOf({ isaGrowth: 'cash' })).toBe('cash');
    expect(isaGrowthOf({ isaGrowth: 'invested' })).toBe('invested');
    for (const s of [undefined, null, 'cash', 3, {}, { isaGrowth: null }, { isaGrowth: 0.03 }, { isaGrowth: 'shares' }, { isaReturn: 0.03 }]) {
      expect(isaGrowthOf(s), JSON.stringify(s)).toBe(null);
    }
  });

  it('the cash spread is the engine\'s, and today\'s fixed rate is still 3% (what "no choice" runs at)', () => {
    expect(ISA_CASH_SPREAD).toBe(CASH_REAL_SPREAD);
    expect(ISA_DEFAULTS.RETURN).toBe(0.03);
  });
});

describe('"invested": the weights of the pension\'s three factors', () => {
  it('an explicit mix wins over the pots, and is put on shares of the whole', () => {
    expect(isaGrowthWeights({ isaGrowthMix: { equity: 1, bond: 0, cash: 0 }, equityStart: 0, bondStart: 0, cashStart: 100 })).toEqual({ equity: 1, bond: 0, cash: 0 });
    expect(isaGrowthWeights({ isaGrowthMix: { equity: 0, bond: 0, cash: 1 } })).toEqual({ equity: 0, bond: 0, cash: 1 });
    const w = isaGrowthWeights({ isaGrowthMix: { equity: 60, bond: 30, cash: 10 } });
    expect(w.equity).toBeCloseTo(0.6, 15);
    expect(w.bond).toBeCloseTo(0.3, 15);
    expect(w.cash).toBeCloseTo(0.1, 15);
  });

  it('without a mix: the run\'s own pension pots (shares, bonds, cash), the diversifiers and the reserve left out', () => {
    const w = isaGrowthWeights({ equityStart: 600000, bondStart: 300000, cashStart: 100000, diversifierStart: 500000, hodlStart: 50000 });
    expect(w.equity).toBeCloseTo(0.6, 15);
    expect(w.bond).toBeCloseTo(0.3, 15);
    expect(w.cash).toBeCloseTo(0.1, 15);
  });

  it('no pension at all: all cash', () => {
    expect(isaGrowthWeights({ equityStart: 0, bondStart: 0, cashStart: 0 })).toEqual({ equity: 0, bond: 0, cash: 1 });
    expect(isaGrowthWeights({})).toEqual({ equity: 0, bond: 0, cash: 1 });
    expect(isaGrowthWeights({ isaGrowthMix: { equity: 0, bond: 0, cash: 0 } })).toEqual({ equity: 0, bond: 0, cash: 1 });
  });

  it('isIsaGrowthMix: three finite shares, none below nought, some above', () => {
    expect(isIsaGrowthMix({ equity: 0.5, bond: 0.4, cash: 0.1 })).toBe(true);
    expect(isIsaGrowthMix({ equity: 1, bond: 0, cash: 0 })).toBe(true);
    for (const m of [undefined, null, {}, { equity: 0.5, bond: 0.5 }, { equity: -0.1, bond: 0.6, cash: 0.5 }, { equity: NaN, bond: 0, cash: 1 }, { equity: 0, bond: 0, cash: 0 }, { equity: '0.5', bond: 0.4, cash: 0.1 }]) {
      expect(isIsaGrowthMix(m), JSON.stringify(m)).toBe(false);
    }
  });

  it('the bond tent re-splits the shares-and-bonds part by the year\'s share; cash is unchanged', () => {
    const w = { equity: 0.5, bond: 0.4, cash: 0.1 };
    const g = glidedIsaWeights(w, 0.3);
    expect(g.equity).toBeCloseTo(0.9 * 0.3, 15);
    expect(g.bond).toBeCloseTo(0.9 * 0.7, 15);
    expect(g.cash).toBe(0.1);
    expect(glidedIsaWeights(w, null)).toBe(w);
  });

  it('the month\'s factor is wE × shares + wB × bonds + wC × cash, in that order', () => {
    const w = { equity: 0.5, bond: 0.4, cash: 0.1 };
    expect(investedIsaFactor(w, 1.01, 1.002, 1.001)).toBe(0.5 * 1.01 + 0.4 * 1.002 + 0.1 * 1.001);
    expect(investedIsaFactor({ equity: 1, bond: 0, cash: 0 }, 1.0123, 7, 9)).toBe(1.0123);
    expect(investedIsaFactor({ equity: 0, bond: 0, cash: 1 }, 7, 9, 1.0011)).toBe(1.0011);
  });
});

describe('the deterministic projections\' cash rate', () => {
  it('at 2.5% prices: 1.5% a year; never below nought', () => {
    expect(cashProjectionRate(0.025)).toBeCloseTo(0.015, 15);
    expect(cashProjectionRate()).toBeCloseTo(0.015, 15);
    expect(cashProjectionRate(0.005)).toBe(0);
    expect(cashProjectionRate(0.08)).toBeCloseTo(0.07, 15);
  });
});
