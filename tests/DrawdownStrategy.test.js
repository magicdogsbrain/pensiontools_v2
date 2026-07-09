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
