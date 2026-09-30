/**
 * planDrawdown's tax-free (UFPLS) case: the exact formula against the search it replaced.
 *
 * Until this change the tax-free case found "the taxable amount that leaves this much after tax" by
 * an 80-step search, up to twice a month. Tax is a straight line between the points where its slope
 * changes (TaxCalculator.taxKinks), so the answer can be read off exactly. The OLD search is kept
 * here, word for word, as the reference: every figure planDrawdown returns must equal it within a
 * penny over a dense grid of targets × other income × tax-free fraction × band sets × ISA pots × ISA
 * rules — including the £100,000 allowance taper and every edge.
 */
import { describe, it, expect } from 'vitest';
import { planDrawdown } from '../src/services/DrawdownStrategy.js';
import { grossToNet, netToGross, taxKinks } from '../src/services/TaxCalculator.js';
import { ISA_STRATEGIES } from '../src/services/IsaDrawdown.js';

/** The planDrawdown that shipped up to 6.16.0 — the search. Do not "tidy": it is the reference. */
function planDrawdownBySearch({ targetGross, fixedIncome = 0, pa, brl, hrl, isaBalance = 0, strategy = ISA_STRATEGIES.TAX_EFFICIENT, yearsUntilSp = 0, taxFreeFraction = 0 }) {
  const f = Math.max(0, Math.min(0.75, taxFreeFraction || 0));
  if (f === 0) {
    const targetNet = grossToNet(targetGross, pa, brl, hrl);
    const sippToBrl = Math.max(0, Math.min(brl, targetGross) - fixedIncome);
    const netAtBrl = grossToNet(sippToBrl + fixedIncome, pa, brl, hrl);
    const netGap = Math.max(0, targetNet - netAtBrl);
    const annualCap = strategy === ISA_STRATEGIES.HOLD ? 0
      : (strategy === ISA_STRATEGIES.LONGEVITY && yearsUntilSp > 0) ? isaBalance / yearsUntilSp
      : Infinity;
    const isaDraw = Math.max(0, Math.min(netGap, Math.max(0, isaBalance), annualCap));
    const remainingIsa = isaBalance - isaDraw;
    const uncovered = netGap - isaDraw;
    let sippGross = sippToBrl;
    if (uncovered > 0) {
      const totalTaxable = netToGross(netAtBrl + uncovered, pa, brl, hrl);
      sippGross = Math.max(sippToBrl, totalTaxable - fixedIncome);
    }
    const taxable = sippGross + fixedIncome;
    const netFromTaxable = grossToNet(taxable, pa, brl, hrl);
    return { sippGross, isaDraw, remainingIsa, taxable, tax: taxable - netFromTaxable, net: netFromTaxable + isaDraw, taxFree: 0 };
  }
  const targetNet = grossToNet(targetGross, pa, brl, hrl);
  const netF = grossToNet(fixedIncome, pa, brl, hrl);
  const netOfTaxable = (T) => T * f / (1 - f) + grossToNet(fixedIncome + T, pa, brl, hrl) - netF;
  const solveTaxableForNet = (needNet) => {
    if (needNet <= 0) return 0;
    let lo = 0, hi = Math.max(1000, needNet * (1 - f) * 1.5);
    while (netOfTaxable(hi) < needNet && hi < 1e12) hi *= 2;
    for (let i = 0; i < 80; i++) {
      const mid = (lo + hi) / 2;
      if (netOfTaxable(mid) < needNet) lo = mid; else hi = mid;
    }
    return (lo + hi) / 2;
  };
  const bandTaxable = Math.max(0, brl - fixedIncome);
  const taxableForTarget = solveTaxableForNet(Math.max(0, targetNet - netF));
  const t1 = Math.min(bandTaxable, taxableForTarget);
  const netAtBrl = netF + netOfTaxable(t1);
  const netGap = Math.max(0, targetNet - netAtBrl);
  const annualCap = strategy === ISA_STRATEGIES.HOLD ? 0
    : (strategy === ISA_STRATEGIES.LONGEVITY && yearsUntilSp > 0) ? isaBalance / yearsUntilSp
    : Infinity;
  const isaDraw = Math.max(0, Math.min(netGap, Math.max(0, isaBalance), annualCap));
  const remainingIsa = isaBalance - isaDraw;
  const uncovered = netGap - isaDraw;
  let taxableDrawn = t1;
  if (uncovered > 0) taxableDrawn = solveTaxableForNet(Math.max(0, targetNet - netF - isaDraw));
  const sippGross = taxableDrawn / (1 - f);
  const taxable = taxableDrawn + fixedIncome;
  const netFromTaxable = grossToNet(taxable, pa, brl, hrl);
  return { sippGross, isaDraw, remainingIsa, taxable, tax: taxable - netFromTaxable, net: netFromTaxable + sippGross * f + isaDraw, taxFree: sippGross * f };
}

const BAND_SETS = [
  ['2026/27', { pa: 12570, brl: 50270, hrl: 125140 }],
  ['bands after 20 years of 2.5% inflation', { pa: 12570 * 1.6386, brl: 50270 * 1.6386, hrl: 125140 * 1.6386 }],
  ['a small allowance, a narrow 20% band', { pa: 5000, brl: 30000, hrl: 80000 }],
  ['45% starting above £150,000 of taxable income', { pa: 12570, brl: 50270, hrl: 150000 }],
  ['no allowance at all', { pa: 0, brl: 37700, hrl: 125140 }],
  ['an allowance above £100,000 (the taper never starts below it)', { pa: 110000, brl: 160000, hrl: 300000 }]
];
const FRACTIONS = [0, 0.25];
const FIELDS = ['sippGross', 'isaDraw', 'remainingIsa', 'taxable', 'tax', 'net', 'taxFree'];
const PENNY = 0.01;

/** Targets: a dense sweep, plus a penny and a pound either side of every point where the tax slope changes. */
function targetsFor(b) {
  const out = [0, 1, 0.01];
  for (let t = 250; t <= 300000; t += 1237) out.push(t);
  for (const k of [...taxKinks(b.pa, b.brl, b.hrl), b.pa, b.brl, b.hrl, 100000, 100000 + 2 * b.pa]) {
    for (const d of [-1, -0.01, 0, 0.01, 1]) out.push(Math.max(0, k + d));
  }
  out.push(500000, 2000000);
  return out;
}
/** Other (taxable, fixed) income: none, a State Pension, the edges themselves, and well above them. */
function fixedFor(b) {
  return [0, 5000, 11973, b.pa, b.pa + 0.01, 30000, b.brl - 1, b.brl, b.brl + 1, 75000, 99999.99, 100000, 110000, 100000 + 2 * b.pa, b.hrl, b.hrl + b.pa, 140000, 200000];
}
const ISA_CASES = [
  { isaBalance: 0 },
  { isaBalance: 3000 },
  { isaBalance: 1e6 },
  { isaBalance: 40000, strategy: ISA_STRATEGIES.LONGEVITY, yearsUntilSp: 8 },
  { isaBalance: 40000, strategy: ISA_STRATEGIES.HOLD }
];

describe('planDrawdown: the exact formula equals the old search within a penny', () => {
  for (const [name, b] of BAND_SETS) {
    for (const f of FRACTIONS) {
      it(`${name}; tax-free fraction ${f}`, () => {
        let cases = 0, worst = 0, worstAt = null;
        for (const targetGross of targetsFor(b)) {
          for (const fixedIncome of fixedFor(b)) {
            for (const isa of ISA_CASES) {
              const p = { targetGross, fixedIncome, ...b, ...isa, taxFreeFraction: f };
              const now = planDrawdown(p), was = planDrawdownBySearch(p);
              for (const k of FIELDS) {
                const d = Math.abs(now[k] - was[k]);
                if (!(d <= worst)) { worst = Number.isFinite(d) ? d : Infinity; worstAt = { ...p, field: k, now: now[k], was: was[k] }; }
              }
              cases++;
            }
          }
        }
        expect(cases).toBeGreaterThan(20000);
        expect(worst, JSON.stringify(worstAt)).toBeLessThanOrEqual(PENNY);
      });
    }
  }

  it('other tax-free fractions a caller could pass (clamped to 0–0.75) agree too', () => {
    const b = BAND_SETS[0][1];
    let worst = 0;
    for (const f of [0.1, 0.5, 0.75, 0.9, -1]) {
      for (const targetGross of targetsFor(b)) {
        for (const fixedIncome of [0, 11973, 60000, 110000]) {
          const p = { targetGross, fixedIncome, ...b, isaBalance: 5000, taxFreeFraction: f };
          const now = planDrawdown(p), was = planDrawdownBySearch(p);
          for (const k of FIELDS) worst = Math.max(worst, Math.abs(now[k] - was[k]));
        }
      }
    }
    expect(worst).toBeLessThanOrEqual(PENNY);
  });

  it('the money adds up exactly: what is delivered is the target take-home whenever the pots can pay it', () => {
    const b = BAND_SETS[0][1];
    for (const targetGross of [20000, 50270, 80000, 100000, 112570, 125140, 180000]) {
      for (const fixedIncome of [0, 11973, 40000]) {
        if (fixedIncome > targetGross) continue;
        const r = planDrawdown({ targetGross, fixedIncome, ...b, isaBalance: 0, taxFreeFraction: 0.25 });
        expect(r.net).toBeCloseTo(grossToNet(targetGross, b.pa, b.brl, b.hrl), 6);
        expect(r.taxFree).toBeCloseTo(r.sippGross * 0.25, 9);
        expect(r.taxable).toBeCloseTo(r.sippGross * 0.75 + fixedIncome, 9);
      }
    }
  });

  it('a worked case by hand: £40,000 target, no other income, a quarter tax-free', () => {
    // Take-home wanted: 40,000 − (40,000 − 12,570) × 20% = 34,514. A withdrawal G is taxed on 0.75 G:
    // G − (0.75 G − 12,570) × 20% = 34,514  →  0.85 G = 32,000  →  G = 37,647.06 (tax 3,133.06).
    const r = planDrawdown({ targetGross: 40000, pa: 12570, brl: 50270, hrl: 125140, taxFreeFraction: 0.25 });
    expect(r.sippGross).toBeCloseTo(32000 / 0.85, 6);
    expect(r.tax).toBeCloseTo((0.75 * 32000 / 0.85 - 12570) * 0.2, 6);
    expect(r.isaDraw).toBe(0);
  });
});
