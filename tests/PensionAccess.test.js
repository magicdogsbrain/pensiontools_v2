import { describe, it, expect } from 'vitest';
import {
  ufplsFromGross,
  ufplsForNet,
  pcls,
  TAX_FREE_RATE,
  LUMP_SUM_ALLOWANCE
} from '../src/services/PensionAccess.js';
import { grossToNet, netToGross } from '../src/services/TaxCalculator.js';

const PA = 12570;
const BRL = 50270;
const HRL = 125140;

describe('netToGross (inverter)', () => {
  it('round-trips grossToNet across all bands', () => {
    for (const gross of [5000, 12570, 20000, 50270, 80000, 130000, 200000]) {
      const net = grossToNet(gross, PA, BRL, HRL);
      expect(netToGross(net, PA, BRL, HRL)).toBeCloseTo(gross, 2);
    }
  });

  it('returns net unchanged when below the personal allowance (no tax)', () => {
    expect(netToGross(10000, PA, BRL, HRL)).toBeCloseTo(10000, 2);
  });

  it('returns 0 for non-positive net', () => {
    expect(netToGross(0, PA, BRL, HRL)).toBe(0);
    expect(netToGross(-100, PA, BRL, HRL)).toBe(0);
  });
});

describe('ufplsFromGross', () => {
  it('returns zeros for a non-positive amount', () => {
    expect(ufplsFromGross({ amount: 0, pa: PA, brl: BRL, hrl: HRL })).toEqual({
      gross: 0, taxFree: 0, taxablePortion: 0, tax: 0, net: 0
    });
  });

  it('always makes 25% tax-free', () => {
    const r = ufplsFromGross({ amount: 40000, otherTaxableIncome: 20000, pa: PA, brl: BRL, hrl: HRL });
    expect(r.taxFree).toBeCloseTo(40000 * TAX_FREE_RATE, 6);
    expect(r.taxablePortion).toBeCloseTo(30000, 6);
  });

  it('is entirely tax-free when the taxable 75% fits under the personal allowance', () => {
    // £10k UFPLS, no other income: £2.5k tax-free + £7.5k taxable, but £7.5k < PA → no tax
    const r = ufplsFromGross({ amount: 10000, otherTaxableIncome: 0, pa: PA, brl: BRL, hrl: HRL });
    expect(r.tax).toBe(0);
    expect(r.net).toBeCloseTo(10000, 6);
  });

  it('taxes the 75% marginally on top of existing income', () => {
    // Other income already at BRL → the £7.5k taxable portion is all at 40%
    const r = ufplsFromGross({ amount: 10000, otherTaxableIncome: BRL, pa: PA, brl: BRL, hrl: HRL });
    expect(r.tax).toBeCloseTo(7500 * 0.40, 6); // £3,000
    expect(r.net).toBeCloseTo(7000, 6);
  });
});

describe('ufplsForNet', () => {
  it('round-trips: the gross it returns nets the requested amount', () => {
    for (const netNeeded of [5000, 10000, 25000, 60000]) {
      for (const other of [0, 20000, BRL]) {
        const r = ufplsForNet({ netNeeded, otherTaxableIncome: other, pa: PA, brl: BRL, hrl: HRL });
        expect(r.net).toBeCloseTo(netNeeded, 2);
      }
    }
  });

  it('needs only the net amount gross when fully tax-free (no other income, small draw)', () => {
    const r = ufplsForNet({ netNeeded: 10000, otherTaxableIncome: 0, pa: PA, brl: BRL, hrl: HRL });
    expect(r.gross).toBeCloseTo(10000, 2);
  });
});

describe('pcls', () => {
  it('gives 25% tax-free cash and 75% into drawdown', () => {
    const r = pcls({ crystallised: 100000 });
    expect(r.taxFreeCash).toBeCloseTo(25000, 6);
    expect(r.intoDrawdown).toBeCloseTo(75000, 6);
    expect(r.cappedByLSA).toBe(false);
  });

  it('caps tax-free cash at the remaining Lump Sum Allowance', () => {
    const r = pcls({ crystallised: 100000, lumpSumAllowanceRemaining: 10000 });
    expect(r.taxFreeCash).toBe(10000);
    expect(r.intoDrawdown).toBe(90000);
    expect(r.cappedByLSA).toBe(true);
  });

  it('exposes the default Lump Sum Allowance', () => {
    expect(LUMP_SUM_ALLOWANCE).toBe(268275);
  });

  it('returns zeros for a non-positive crystallised amount', () => {
    const r = pcls({ crystallised: 0 });
    expect(r).toEqual({
      crystallised: 0, taxFreeCash: 0, intoDrawdown: 0, cappedByLSA: false, lumpSumAllowanceUsed: 0
    });
  });
});
