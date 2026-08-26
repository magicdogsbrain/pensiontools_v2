import { describe, it, expect } from 'vitest';
import { planDrawdown } from '../src/services/DrawdownStrategy.js';
import { grossToNet } from '../src/services/TaxCalculator.js';
import { ISA_STRATEGIES } from '../src/services/IsaDrawdown.js';

const PA = 12570, BRL = 50270, HRL = 125140;
const bands = { pa: PA, brl: BRL, hrl: HRL };

describe('planDrawdown (band management + ISA, Option A)', () => {
  it('target within basic rate: all SIPP, no ISA needed, hits target net', () => {
    const r = planDrawdown({ targetGross: 40000, fixedIncome: 0, ...bands, isaBalance: 50000 });
    expect(r.isaDraw).toBe(0);
    expect(r.sippGross).toBeCloseTo(40000, 6);
    expect(r.net).toBeCloseTo(grossToNet(40000, PA, BRL, HRL), 6);
  });

  it('target above BRL: SIPP fills to BRL, ISA covers the rest tax-free', () => {
    const r = planDrawdown({ targetGross: 60000, fixedIncome: 0, ...bands, isaBalance: 50000 });
    expect(r.sippGross).toBeCloseTo(BRL, 6);                    // filled to basic-rate limit
    const targetNet = grossToNet(60000, PA, BRL, HRL);
    const netAtBrl = grossToNet(BRL, PA, BRL, HRL);
    expect(r.isaDraw).toBeCloseTo(targetNet - netAtBrl, 4);     // ISA covers the net gap
    expect(r.net).toBeCloseTo(targetNet, 4);                    // target hit
    expect(r.tax).toBeCloseTo(BRL - netAtBrl, 4);               // only basic-rate tax paid
  });

  it('State Pension reduces the SIPP-to-BRL room (SP-aware)', () => {
    const noSp = planDrawdown({ targetGross: 60000, fixedIncome: 0, ...bands, isaBalance: 50000 });
    const withSp = planDrawdown({ targetGross: 60000, fixedIncome: 12000, ...bands, isaBalance: 50000 });
    expect(withSp.sippGross).toBeCloseTo(BRL - 12000, 6);       // SP fills part of the band
    expect(withSp.net).toBeCloseTo(noSp.net, 4);                // same target income
  });

  it('when the ISA is exhausted, extra SIPP above BRL covers the gap (Option A) — target still met, more tax', () => {
    const r = planDrawdown({ targetGross: 60000, fixedIncome: 0, ...bands, isaBalance: 1000 });
    expect(r.isaDraw).toBe(1000);                               // ISA drained
    expect(r.remainingIsa).toBe(0);
    expect(r.sippGross).toBeGreaterThan(BRL);                   // drew above BRL
    expect(r.net).toBeCloseTo(grossToNet(60000, PA, BRL, HRL), 3); // target still met
    const bandOnly = planDrawdown({ targetGross: 60000, fixedIncome: 0, ...bands, isaBalance: 50000 });
    expect(r.tax).toBeGreaterThan(bandOnly.tax);                // paid higher-rate tax for the top-up
  });

  it('empty ISA: entirely SIPP (above BRL), target met at higher tax', () => {
    const r = planDrawdown({ targetGross: 60000, fixedIncome: 0, ...bands, isaBalance: 0 });
    expect(r.isaDraw).toBe(0);
    expect(r.sippGross).toBeCloseTo(60000, 3);
    expect(r.net).toBeCloseTo(grossToNet(60000, PA, BRL, HRL), 3);
  });
});

describe('planDrawdown — Option B (maximise longevity)', () => {
  it('caps the ISA draw and covers the rest with taxable SIPP (more tax, less ISA used)', () => {
    const a = planDrawdown({ targetGross: 60000, fixedIncome: 0, ...bands, isaBalance: 50000, strategy: ISA_STRATEGIES.TAX_EFFICIENT });
    const b = planDrawdown({ targetGross: 60000, fixedIncome: 0, ...bands, isaBalance: 50000, strategy: ISA_STRATEGIES.LONGEVITY, yearsUntilSp: 20 });
    expect(b.isaDraw).toBeLessThan(a.isaDraw);   // spreads the pot → draws less this year
    expect(b.sippGross).toBeGreaterThan(a.sippGross);
    expect(b.tax).toBeGreaterThan(a.tax);        // less tax-efficient
    expect(b.net).toBeCloseTo(a.net, 3);         // same target income
  });
});

describe('planDrawdown — UFPLS (taxFreeFraction = 0.25)', () => {
  const f = 0.25;

  it('taxFreeFraction 0 (or omitted) is byte-identical to the original drawdown path', () => {
    const a = planDrawdown({ targetGross: 40000, fixedIncome: 0, ...bands, isaBalance: 50000 });
    const b = planDrawdown({ targetGross: 40000, fixedIncome: 0, ...bands, isaBalance: 50000, taxFreeFraction: 0 });
    expect(b).toEqual(a);
    expect(a.taxFree).toBe(0);
  });

  it('hits the same target net with a SMALLER gross withdrawal (25% escapes tax)', () => {
    const dd = planDrawdown({ targetGross: 40000, fixedIncome: 0, ...bands, isaBalance: 0 });
    const uf = planDrawdown({ targetGross: 40000, fixedIncome: 0, ...bands, isaBalance: 0, taxFreeFraction: f });
    expect(uf.net).toBeCloseTo(dd.net, 3);            // same net income delivered
    expect(uf.sippGross).toBeLessThan(dd.sippGross);  // needs less gross to get there
    expect(uf.tax).toBeLessThan(dd.tax);              // because a quarter is tax-free
  });

  it('tax-free element is exactly 25% of the gross withdrawal; taxable is the rest', () => {
    const r = planDrawdown({ targetGross: 40000, fixedIncome: 0, ...bands, isaBalance: 0, taxFreeFraction: f });
    expect(r.taxFree).toBeCloseTo(r.sippGross * f, 6);
    expect(r.taxable).toBeCloseTo(r.sippGross * (1 - f), 6);
  });

  // Note: UFPLS is efficient enough that a £70k gross-equivalent target fits INSIDE the basic
  // band (the tax-free quarter does a lot of work), so these band tests use a £110k target.
  // `taxable` in the result is the TOTAL taxable position (SIPP taxable element + fixed income).

  it('a modest target fits entirely in the basic band — no ISA needed even above the drawdown BRL point', () => {
    const r = planDrawdown({ targetGross: 70000, fixedIncome: 0, ...bands, isaBalance: 100000, taxFreeFraction: f });
    expect(r.taxable).toBeLessThanOrEqual(BRL + 1e-6);  // never crossed the band
    expect(r.isaDraw).toBe(0);                          // …so the ISA was untouched
    expect(r.net).toBeCloseTo(grossToNet(70000, PA, BRL, HRL), 3);
  });

  it('band management: taxable element fills to BRL, never past it while ISA remains', () => {
    const r = planDrawdown({ targetGross: 110000, fixedIncome: 0, ...bands, isaBalance: 100000, taxFreeFraction: f });
    expect(r.taxable).toBeCloseTo(BRL, 4);              // filled the band exactly
    expect(r.net).toBeCloseTo(grossToNet(110000, PA, BRL, HRL), 3);
    expect(r.isaDraw).toBeGreaterThan(0);               // ISA tops up beyond the band
  });

  it('fixed income (State Pension) consumes band room for the taxable element', () => {
    const r = planDrawdown({ targetGross: 110000, fixedIncome: 12000, ...bands, isaBalance: 100000, taxFreeFraction: f });
    expect(r.taxable).toBeCloseTo(BRL, 4);              // SIPP taxable + SP together fill the band
    expect(r.sippGross * (1 - f)).toBeCloseTo(BRL - 12000, 4);
    expect(r.net).toBeCloseTo(grossToNet(110000, PA, BRL, HRL), 3);
  });

  it('empty ISA: taxable pushes above BRL but the target net is still met', () => {
    const r = planDrawdown({ targetGross: 110000, fixedIncome: 0, ...bands, isaBalance: 0, taxFreeFraction: f });
    expect(r.taxable).toBeGreaterThan(BRL);
    expect(r.net).toBeCloseTo(grossToNet(110000, PA, BRL, HRL), 3);
    expect(r.taxFree).toBeCloseTo(r.sippGross * f, 4);
  });
});

import { planDrawdown as planDD } from '../src/services/DrawdownStrategy.js';
import { ISA_STRATEGIES as S } from '../src/services/IsaDrawdown.js';
describe('planDrawdown — Option C (hold: keep the ISA powder dry)', () => {
  const bands = { pa: 12570, brl: 50270, hrl: 125140 };
  it('never draws the ISA for income, even above the basic-rate limit: SIPP pays it all and the target net is still met', () => {
    const r = planDD({ targetGross: 80000, fixedIncome: 0, ...bands, isaBalance: 300000, strategy: S.HOLD, yearsUntilSp: 10 });
    expect(r.isaDraw).toBe(0);
    expect(r.remainingIsa).toBe(300000);
    expect(r.sippGross).toBeCloseTo(80000, 0);
    const a = planDD({ targetGross: 80000, fixedIncome: 0, ...bands, isaBalance: 300000, strategy: S.TAX_EFFICIENT, yearsUntilSp: 10 });
    expect(a.isaDraw).toBeGreaterThan(0);
    expect(r.tax).toBeGreaterThan(a.tax);           // the price of keeping it dry
    expect(r.net).toBeCloseTo(a.net, 0);            // same money in the bank
  });
  it('UFPLS path honours hold too', () => {
    const r = planDD({ targetGross: 80000, fixedIncome: 0, ...bands, isaBalance: 300000, strategy: S.HOLD, taxFreeFraction: 0.25 });
    expect(r.isaDraw).toBe(0);
    expect(r.remainingIsa).toBe(300000);
  });
});
