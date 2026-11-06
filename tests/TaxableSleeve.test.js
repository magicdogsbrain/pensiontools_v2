import { describe, it, expect } from 'vitest';
import { sippRoomFor, newSleeve, sleeveIncome, incomeTaxOnSleeve, withdrawFromSleeve, addToSleeve, growSleeve, bedAndIsa, shelterLumpSum, GIA_DEFAULTS, mixFromChoice, payTaxFromSleeve, topUpFromSleeve, routeWindfall } from '../src/services/TaxableSleeve.js';

const EQ = { equity: 1, bond: 0, gilt: 0, cash: 0 };
const GILT = { equity: 0, bond: 0, gilt: 1, cash: 0 };

describe('a lump sum cannot be sheltered at speed', () => {
  it('£100k splits into ISA £20k, SIPP £3,600, and £76,400 stuck in the GIA', () => {
    expect(shelterLumpSum(100000, {})).toEqual({ toIsa: 20000, toSipp: 3600, toGia: 76400 });
  });
  it('the MPAA caps a drawdown retiree at £10,000 however much they earn', () => {
    // flexible access has happened (any drawdown plan), so £10k beats their earnings
    const r = shelterLumpSum(100000, { relevantEarnings: 40000 });
    expect(r.toSipp).toBe(10000);
    expect(r.toGia).toBe(70000);
  });
  it('before flexible access the Annual Allowance applies and earnings are the cap', () => {
    const r = shelterLumpSum(100000, { relevantEarnings: 40000, mpaaTriggered: false });
    expect(r.toSipp).toBe(40000);
    expect(r.toGia).toBe(40000);
  });
  it('no earnings means £3,600 whether or not the MPAA has been triggered', async () => {
    const { sippRoomFor } = await import('../src/services/TaxableSleeve.js');
    expect(sippRoomFor({ relevantEarnings: 0, mpaaTriggered: true })).toBe(3600);
    expect(sippRoomFor({ relevantEarnings: 0, mpaaTriggered: false })).toBe(3600);
    expect(sippRoomFor({ relevantEarnings: 200000, mpaaTriggered: true })).toBe(10000);
    expect(sippRoomFor({ relevantEarnings: 200000, mpaaTriggered: false })).toBe(60000);
  });
  it('a part-used ISA allowance shelters less', () => {
    expect(shelterLumpSum(100000, { isaAllowanceLeft: 5000 }).toIsa).toBe(5000);
  });
  it('a small windfall fits entirely', () => {
    expect(shelterLumpSum(15000, {}).toGia).toBe(0);
  });
});

describe('gilts vs equities — the distinction a flat drag would miss', () => {
  it('an equity GIA pays dividend tax; a gilt GIA pays essentially nothing', () => {
    expect(incomeTaxOnSleeve(newSleeve(100000, EQ), 'basic')).toBeGreaterThan(100);
    expect(incomeTaxOnSleeve(newSleeve(100000, GILT), 'basic')).toBe(0);
  });
  it('gilts are CGT-exempt, so growth is realised tax-free', () => {
    const g = newSleeve(100000, GILT); growSleeve(g, 1.5);
    expect(withdrawFromSleeve(g, 50000, 'basic', 0).cgt).toBe(0);
  });
  it('equities pay CGT on the gain above the exemption', () => {
    const s = newSleeve(100000, EQ); growSleeve(s, 1.5);
    const w = withdrawFromSleeve(s, 50000, 'basic', 0);
    // slice sold = 1/3 of a 150k pot: basis 33,333, gain 16,667, less £3,000 exemption, at 18%
    expect(w.cgt).toBeCloseTo((50000 - 100000 / 3 - GIA_DEFAULTS.CGT_EXEMPTION) * 0.18, 0);
    expect(w.net).toBeCloseTo(50000 - w.cgt, 6);
  });
  it('a higher-rate holder pays more on both', () => {
    const s = newSleeve(200000, EQ); growSleeve(s, 2);
    expect(incomeTaxOnSleeve(s, 'higher')).toBeGreaterThan(incomeTaxOnSleeve(s, 'basic'));
    const a = withdrawFromSleeve(newSleeve(100000, EQ), 100000, 'basic', 0);
    const b = withdrawFromSleeve(newSleeve(100000, EQ), 100000, 'higher', 0);
    expect(b.cgt).toBeGreaterThanOrEqual(a.cgt);
  });
});

describe('basis tracking', () => {
  it('new money carries its own basis, so it is not taxed as gain', () => {
    const s = newSleeve(100000, EQ); growSleeve(s, 2);          // 200k, basis 100k
    addToSleeve(s, 100000);                                      // 300k, basis 200k
    expect(s.value).toBe(300000); expect(s.basis).toBe(200000);
    const w = withdrawFromSleeve(s, 300000, 'basic', 0);         // gain 100k
    expect(w.cgt).toBeCloseTo((100000 - 3000) * 0.18, 0);
  });
  it('growth raises value but never basis', () => {
    const s = newSleeve(50000, EQ); growSleeve(s, 1.2);
    expect(s.value).toBe(60000); expect(s.basis).toBe(50000);
  });
  it('withdrawing more than the sleeve holds takes only what is there', () => {
    const s = newSleeve(1000, EQ);
    expect(withdrawFromSleeve(s, 5000, 'basic', 0).taken).toBe(1000);
    expect(s.value).toBe(0);
  });
});

describe('helpers for the Decision tool and windfall routing', () => {
  it('mixFromChoice maps the one-word choices; anything else is all-shares (the pessimistic default)', () => {
    expect(mixFromChoice('gilt')).toEqual(GILT);
    expect(mixFromChoice(null)).toEqual(EQ);
    expect(mixFromChoice('nonsense')).toEqual(EQ);
    expect(mixFromChoice({ equity: 0.5, gilt: 0.5 })).toEqual({ equity: 0.5, bond: 0, gilt: 0.5, cash: 0 });
    expect(newSleeve(1000, 'gilt').mix).toEqual(GILT);
  });
  it('a sleeve can start with a cost basis below its value (an existing account with a gain)', () => {
    const s = newSleeve(200000, EQ, 120000);
    expect(s.basis).toBe(120000);
    expect(newSleeve(100000, EQ, 150000).basis).toBe(100000);   // never above what it is worth
  });
  it('paying tax out of the sleeve is a sale: the basis falls pro-rata', () => {
    const s = newSleeve(100000, EQ); growSleeve(s, 2);           // 200k, basis 100k
    payTaxFromSleeve(s, 2000);
    expect(s.value).toBe(198000); expect(s.basis).toBeCloseTo(99000, 6);
  });
  it('topUpFromSleeve delivers the NET amount asked for, grossing up for the CGT', () => {
    const s = newSleeve(100000, EQ); growSleeve(s, 2);
    const r = topUpFromSleeve(s, 10000, 'basic', GIA_DEFAULTS.CGT_EXEMPTION);   // exemption already used
    expect(r.net).toBeCloseTo(10000, 2);
    expect(r.taken).toBeGreaterThan(10000);
    expect(r.cgt).toBeCloseTo(r.taken - 10000, 2);
    expect(topUpFromSleeve(newSleeve(500, EQ), 10000).net).toBe(500);          // an empty sleeve stops
  });
  it('routeWindfall: cash is limited by the allowances; an inherited pension or ISA is not', () => {
    expect(routeWindfall({ amount: 100000 }, {})).toMatchObject({ toIsa: 20000, toSipp: 3600, toGia: 76400, usesIsaAllowance: 20000, usesSippRoom: 3600 });
    expect(routeWindfall({ amount: 100000, wrapper: 'pension' }, {})).toMatchObject({ toSipp: 100000, toGia: 0, usesSippRoom: 0 });
    expect(routeWindfall({ amount: 100000, wrapper: 'isa' }, {})).toMatchObject({ toIsa: 100000, toGia: 0, usesIsaAllowance: 0 });
    expect(routeWindfall({ amount: 100000 }, { isaAllowanceLeft: 5000, sippRoomLeft: 0 })).toMatchObject({ toIsa: 5000, toSipp: 0, toGia: 95000 });
    expect(routeWindfall({ amount: 100000, toIsa: false }, {}).toIsa).toBe(0);
  });
});

describe('bed and ISA', () => {
  it('moves up to the allowance and realises CGT on the way', () => {
    const s = newSleeve(100000, EQ); growSleeve(s, 1.5);
    const r = bedAndIsa(s, 20000, 'basic', 0);
    expect(r.moved).toBeGreaterThan(19000);
    expect(r.moved).toBeLessThanOrEqual(20000);
    expect(s.value).toBeCloseTo(130000, 0);
  });
  it('a gilt sleeve moves the full allowance with no CGT', () => {
    const g = newSleeve(100000, GILT); growSleeve(g, 1.5);
    const r = bedAndIsa(g, 20000, 'basic', 0);
    expect(r.cgt).toBe(0);
    expect(r.moved).toBe(20000);
  });
  it('shelters a £100k windfall in about five years', () => {
    const s = newSleeve(76400, GILT);
    let years = 0; while (s.value > 1 && years < 20) { bedAndIsa(s, 20000, 'basic', 0); years++; }
    expect(years).toBeLessThanOrEqual(5);
  });
});

describe('adding money held differently blends the sleeve mix by value', () => {
  it('£100k of gilts into £100k of shares = half-and-half; CGT on a later sale is halved', () => {
    const s = newSleeve(100000, EQ); growSleeve(s, 2);            // 200k, basis 100k, all shares
    addToSleeve(s, 200000, 'gilt');                              // 400k, basis 300k
    expect(s.mix.equity).toBeCloseTo(0.5, 9);
    expect(s.mix.gilt).toBeCloseTo(0.5, 9);
    const r = withdrawFromSleeve(s, 40000, 'basic', 3000);       // gain 10k, only the share half chargeable
    expect(r.cgt).toBeCloseTo(10000 * 0.5 * 0.18, 6);
  });
  it('no mix given = held like the existing account (unchanged behaviour)', () => {
    const s = newSleeve(100000, GILT); addToSleeve(s, 50000);
    expect(s.mix).toEqual({ equity: 0, bond: 0, gilt: 1, cash: 0 });
    const e = newSleeve(0, EQ); addToSleeve(e, 50000, 'gilt');   // an empty sleeve simply takes the new money's mix
    expect(e.mix.gilt).toBe(1);
  });
});
