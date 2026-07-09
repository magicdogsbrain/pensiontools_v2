/**
 * Golden-master: the LIVE decision engine (byte-faithful characterization) must keep
 * reproducing the committed fixtures. During the engine-unification refactor, the new
 * unified engine will be run against these same fixtures; every divergence is reviewed.
 *
 * Regenerate fixtures with:  node tests/golden/generate.mjs
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { decisionCases } from './matrix.js';
import { canonical } from './canonical.js';
import { calcDecisionPWA } from './legacyDecisionEngine.js';

const here = dirname(fileURLToPath(import.meta.url));
const fixtures = JSON.parse(readFileSync(join(here, 'fixtures/decision.json'), 'utf8'));

describe('golden-master: live decision engine', () => {
  it('every matrix case reproduces its committed fixture exactly', async () => {
    expect(Object.keys(fixtures).length).toBe(decisionCases.length);
    for (const c of decisionCases) {
      const out = canonical(
        await calcDecisionPWA(c.input.dateStr, c.input.equity, c.input.bond, c.input.cash, c.deps)
      );
      expect(out, `case: ${c.name}`).toEqual(fixtures[c.name]);
    }
  });

  // --- explicit bug captures (documented current-but-wrong behaviour) ---

  it('BUG pinned: crude tax has no 45% band / no PA taper (tax-inefficient 150k)', () => {
    const f = fixtures['tax-inefficient / 150k salary — crude tax on full draw (captures NO 45%/taper)'];
    const taxable = f.calculationDetails.taxInfo.annualTaxable;
    const crude = (50270 - 12570) * 0.2 + (taxable - 50270) * 0.4; // no 45%, no taper
    expect(f.calculationDetails.taxInfo.annualTax).toBeCloseTo(crude, 0);
    // The unified engine (proper bands) will compute MORE tax here → expected diff.
  });

  it('BUG pinned: stranded bucket — draw forced to Cash despite equity surplus', () => {
    const f = fixtures['stranded-bucket (equity surplus but net gate forces Cash)'];
    expect(f.source).toBe('Cash');
    expect(f.drawFromEquity).toBe(0);
  });

  it('State Pension is included in fixed income when receiving', () => {
    const f = fixtures['State Pension receiving'];
    expect(f.statePension).toBeGreaterThan(0);
  });

  // --- branch pins added after adversarial matrix-completeness review ---

  it('wizard expectedMonthly is the primary stdSipp source (not the fallback)', () => {
    expect(fixtures['wizard expectedMonthly path / efficient (primary stdSipp source)'].sippDraw).toBe(3200);
  });

  it('cash-low warning fires when the Cash draw exceeds available cash', () => {
    const f = fixtures['cash-low warning (source Cash, cash=0)'];
    expect(f.source).toBe('Cash');
    expect(f.alerts.some((a) => a.type === 'low-cash' && a.severity === 'danger')).toBe(true);
  });

  it('Bond→Equity rebalance branch is exercised', () => {
    expect(fixtures['Bond→Equity rebalance branch'].rebalanceActions).toEqual(['Move £50,000 Bond→Equity']);
  });

  it('tax-inefficient in-protection: SIPP reduced, no ISA, no protection-induced efficiency', () => {
    const f = fixtures['tax-inefficient + in-protection (continues)'];
    expect(f.inProtection).toBe(true);
    expect(f.isaDraw).toBe(0);
    expect(f.protectionInducedTaxEfficiency).toBe(false);
  });

  it('cross-calendar (Jan) history is attributed to the prior tax year (boost catches up)', () => {
    const f = fixtures['Jan of prev tax year with carried 2026 history (cross-calendar filter + boost)'];
    expect(f.remainingMonths).toBe(3);
    expect(f.boostAmount).toBeGreaterThan(0);
  });
});
