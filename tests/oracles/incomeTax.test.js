/**
 * Income tax against the published rules — the figures in incomeTax-2026-27.json are worked by hand
 * from gov.uk's rates (source and date in the file), not produced by the app.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { calculateTax, grossToNet, netToGross, taxKinks } from '../../src/services/TaxCalculator.js';
import { TAX_DEFAULTS } from '../../src/constants.js';

const oracle = JSON.parse(readFileSync(resolve(process.cwd(), 'tests/oracles/incomeTax-2026-27.json'), 'utf8'));
const { personalAllowance: PA, basicRateLimit: BRL, additionalRateThreshold: HRL } = oracle.rules;
const pence = (x) => Math.round(x * 100);

describe('income tax 2026/27 (England, Wales, Northern Ireland) — to the penny', () => {
  it('the app\'s default bands are the published ones', () => {
    expect(TAX_DEFAULTS.PERSONAL_ALLOWANCE).toBe(PA);
    expect(TAX_DEFAULTS.BASIC_RATE_LIMIT).toBe(BRL);
    expect(TAX_DEFAULTS.HIGHER_RATE_LIMIT).toBe(HRL);
    expect(TAX_DEFAULTS.PA_TAPER_THRESHOLD).toBe(oracle.rules.allowanceWithdrawalStartsAt);
    expect(TAX_DEFAULTS.PA_TAPER_RATE).toBe(oracle.rules.allowanceWithdrawalRate);
    expect(BRL - PA).toBe(oracle.rules.basicRateBandWidth);
  });

  it('covers every income the oracle must cover', () => {
    expect(oracle.rows.map((r) => r.gross)).toEqual([0, 12570, 12571, 30000, 50270, 50271, 80000, 100000, 100002, 110000, 125140, 125141, 150000, 200000]);
  });

  for (const row of oracle.rows) {
    it(`£${row.gross.toLocaleString('en-GB')} → £${row.tax.toLocaleString('en-GB')} (${row.working})`, () => {
      expect(pence(calculateTax(row.gross, PA, BRL, HRL))).toBe(pence(row.tax));
      expect(pence(calculateTax(row.gross, PA, BRL))).toBe(pence(row.tax));          // default limit
      expect(pence(grossToNet(row.gross, PA, BRL, HRL))).toBe(pence(row.gross - row.tax));
      if (row.gross > PA) expect(netToGross(row.gross - row.tax, PA, BRL, HRL)).toBeCloseTo(row.gross, 4);
    });
  }

  it('the marginal rate is 60% while the allowance is being withdrawn, 45% after', () => {
    expect(calculateTax(110001, PA, BRL, HRL) - calculateTax(110000, PA, BRL, HRL)).toBeCloseTo(0.60, 9);
    expect(calculateTax(130001, PA, BRL, HRL) - calculateTax(130000, PA, BRL, HRL)).toBeCloseTo(0.45, 9);
  });

  it('tax is a straight line between neighbouring kinks (so taxKinks lists every change of slope)', () => {
    for (const [pa, brl, hrl] of [[PA, BRL, HRL], [PA * 1.6, BRL * 1.6, HRL * 1.6], [0, 37700, 125140], [12570, 110000, 125140], [20000, 60000, 90000]]) {
      const k = [0, ...taxKinks(pa, brl, hrl), 400000];
      for (let i = 1; i < k.length; i++) {
        const a = k[i - 1], b = k[i];
        if (b - a < 1e-6) continue;
        const mid = (a + b) / 2;
        const line = (calculateTax(a, pa, brl, hrl) + calculateTax(b, pa, brl, hrl)) / 2;
        expect(Math.abs(calculateTax(mid, pa, brl, hrl) - line)).toBeLessThan(1e-6);
      }
    }
  });
});
