import { describe, it, expect } from 'vitest';
import { calcDecisionPWA } from '../src/services/legacyDecision.js';

// Minimal deps matching the golden-master shape.
const ty = (o = {}) => ({ pa: 12570, brl: 50270, other: 0, cpi: 0.025, isTaxEfficient: true,
  isaSavingsAllocation: 0, isaSavingsUsed: 0, grossIncomeToDate: 0, confirmedSalary: 50270, ...o });
const baseSettings = { baseSalary: 50270, equityMin: 500000, bondMin: 300000, cashTarget: 50000,
  duration: 35, protectionFactor: 20, recoveryBuffer: 15000, consecutiveLimit: 3 };
const noSP = { amount: 0, isReceiving: false };
const deps = (extra = {}) => ({ settings: baseSettings, history: [], allTaxYears: { '26/27': ty() }, spInfo: noSP, ...extra });

describe('Decision engine — Diversifiers sleeve (opt-in, golden-safe)', () => {
  it('with NO diversifier the output has no diversifier fields (byte-identical shape)', async () => {
    const out = await calcDecisionPWA('2026-04', 500000, 300000, 50000, deps());
    expect(out).not.toHaveProperty('drawFromDiversifier');
    expect(out).not.toHaveProperty('diversifier');
  });

  it('in a downturn with cash exhausted, advises drawing the DIVERSIFIER reserve, not warning', async () => {
    // Force the "below min / cash low" path: pots below their glidepath minimums and no cash.
    const out = await calcDecisionPWA('2026-04', 300000, 150000, 0, deps({ diversifier: 200000 }));
    expect(out.source).toMatch(/Diversifier/);
    expect(out.drawFromDiversifier).toBeGreaterThan(0);
    // the shortfall is met from the reserve, so NO cash-low alert
    expect(out.alerts.some(a => a.type === 'low-cash')).toBe(false);
  });

  it('warns only when BOTH cash and the diversifier reserve are exhausted', async () => {
    const out = await calcDecisionPWA('2026-04', 300000, 150000, 0, deps({ diversifier: 100 }));
    expect(out.alerts.some(a => a.type === 'low-cash')).toBe(true);
  });

  it('a healthy month still draws from Growth — the reserve is untouched', async () => {
    const out = await calcDecisionPWA('2026-04', 700000, 400000, 120000, deps({ diversifier: 200000 }));
    expect(out.source).toBe('Growth');
    expect(out.drawFromDiversifier).toBe(0);
  });
});
