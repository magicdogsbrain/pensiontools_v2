import { describe, it, expect } from 'vitest';
import { modelPortfolio } from '../src/services/ModelPortfolios.js';
import { DEFAULT_FUND_CATALOGUE } from '../src/services/FundCatalogue.js';

describe('modelPortfolio', () => {
  it('sums to exactly 100% for every preset and variant', () => {
    for (const risk of ['cautious', 'balanced', 'adventurous']) {
      for (const div of [false, true]) {
        const p = modelPortfolio(risk, { diversifiers: div });
        expect(p.rows.reduce((t, r) => t + r.pct, 0)).toBe(100);
        expect(p.rows.every((r) => r.pct >= 0)).toBe(true);
      }
    }
  });

  it('diversifiers variant adds gold + wealth-preservers; plain does not', () => {
    const plain = modelPortfolio('balanced');
    const sleeve = modelPortfolio('balanced', { diversifiers: true });
    expect(plain.rows.some((r) => r.ticker === 'SGLN')).toBe(false);
    expect(sleeve.rows.some((r) => r.ticker === 'SGLN')).toBe(true);
    expect(sleeve.rows.some((r) => /PNL/.test(r.ticker))).toBe(true);
  });

  it('single-ticker examples exist in the fund catalogue (so tagging them reproduces the preset)', () => {
    const p = modelPortfolio('balanced', { diversifiers: true });
    for (const r of p.rows) {
      for (const t of r.ticker.split('/').map((x) => x.trim())) {
        expect(DEFAULT_FUND_CATALOGUE.some((f) => f.ticker === t), t + ' missing from catalogue').toBe(true);
      }
    }
  });

  it('VWRP anchors the equity block, as requested', () => {
    expect(modelPortfolio('cautious').rows[0].ticker).toBe('VWRP');
  });
});
