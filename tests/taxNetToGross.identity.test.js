/**
 * netToGross (6.18.0) reads the gross off the straight stretch first and works the tax out only for the last steps
 * of its search. Its result must be the plain search's to the last binary digit: every plan, golden and pinned
 * figure depends on it. The plain search is kept here as the reference.
 */
import { describe, it, expect } from 'vitest';
import { netToGross, grossToNet, taxKinks } from '../src/services/TaxCalculator.js';
import { TAX_DEFAULTS } from '../src/constants.js';
import { seededRng } from '../src/utils/MathUtils.js';

function plainSearch(net, pa, brl, hrl = TAX_DEFAULTS.HIGHER_RATE_LIMIT) {
  if (net <= 0) return 0;
  let lo = net, hi = net + 1;
  while (grossToNet(hi, pa, brl, hrl) < net && hi < 1e12) hi *= 2;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (grossToNet(mid, pa, brl, hrl) < net) lo = mid; else hi = mid;
  }
  return (lo + hi) / 2;
}

const BASE = { pa: 12570, brl: 50270, hrl: 125140 };
const BANDS = [
  BASE,
  ...[1.0001, 1.03, 1.25, 1.7, 2.6, 4].map((f) => ({ pa: BASE.pa * f, brl: BASE.brl * f, hrl: BASE.hrl * f })),
  { pa: 0, brl: 37700, hrl: 125140 },                 // no allowance
  { pa: 20000, brl: 15000, hrl: 125140 },             // limit below the allowance
  { pa: 60000, brl: 90000, hrl: 70000 },              // taper running into the top rate
  { pa: 12570, brl: 50270, hrl: 0 },                  // odd, all at the top rate
  { pa: 12570.37, brl: 50270.11, hrl: 125140.59 }
];

const same = (a, b) => Object.is(a, b);

describe('netToGross is the plain search, bit for bit', () => {
  it('on 300,000 random nets from 1p to £50m across the band sets', () => {
    const rng = seededRng(20261001);
    let checked = 0;
    for (const b of BANDS) {
      for (let i = 0; i < 30_000; i++) {
        const net = Math.exp(Math.log(0.01) + rng() * (Math.log(5e7) - Math.log(0.01)));
        const fast = netToGross(net, b.pa, b.brl, b.hrl), ref = plainSearch(net, b.pa, b.brl, b.hrl);
        if (!same(fast, ref)) throw new Error(`net ${net} bands ${JSON.stringify(b)}: ${fast} vs ${ref}`);
        checked++;
      }
    }
    expect(checked).toBe(BANDS.length * 30_000);
  });

  it('at and around every kink: the nets of the kinks, a few units in the last place either side', () => {
    for (const b of BANDS) {
      for (const k of taxKinks(b.pa, b.brl, b.hrl)) {
        const n0 = grossToNet(k, b.pa, b.brl, b.hrl);
        for (let d = -64; d <= 64; d++) {
          const net = n0 + d * Number.EPSILON * Math.max(1, Math.abs(n0));
          expect(same(netToGross(net, b.pa, b.brl, b.hrl), plainSearch(net, b.pa, b.brl, b.hrl)), `${net} ${JSON.stringify(b)}`).toBe(true);
        }
        for (const net of [n0 - 1, n0 - 0.01, n0 + 0.01, n0 + 1, Math.round(n0), Math.floor(n0 / 10) * 10]) {
          expect(same(netToGross(net, b.pa, b.brl, b.hrl), plainSearch(net, b.pa, b.brl, b.hrl)), `${net} ${JSON.stringify(b)}`).toBe(true);
        }
      }
    }
  });

  it('whole pounds and pence a person would type, every £1 from £1 to £200,000 (base bands)', () => {
    for (let net = 1; net <= 200_000; net++) {
      if (!same(netToGross(net, BASE.pa, BASE.brl, BASE.hrl), plainSearch(net, BASE.pa, BASE.brl, BASE.hrl))) throw new Error(`net ${net}`);
      const p = net + 0.37;
      if (!same(netToGross(p, BASE.pa, BASE.brl, BASE.hrl), plainSearch(p, BASE.pa, BASE.brl, BASE.hrl))) throw new Error(`net ${p}`);
    }
  });

  it('alternating band sets (the remembered stretches are for the bands asked about)', () => {
    const rng = seededRng(7);
    for (let i = 0; i < 20_000; i++) {
      const b = BANDS[Math.floor(rng() * BANDS.length)];
      const net = rng() * 300_000;
      expect(same(netToGross(net, b.pa, b.brl, b.hrl), plainSearch(net, b.pa, b.brl, b.hrl))).toBe(true);
    }
  });

  it('zero, negative, NaN and the default top limit behave as before', () => {
    for (const net of [0, -5, NaN, 1e-9, 1e11]) {
      expect(same(netToGross(net, 12570, 50270), plainSearch(net, 12570, 50270))).toBe(true);
    }
    expect(same(netToGross(30000, NaN, 50270, 125140), plainSearch(30000, NaN, 50270, 125140))).toBe(true);
  });
});
