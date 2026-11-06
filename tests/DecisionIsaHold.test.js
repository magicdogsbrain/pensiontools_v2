/**
 * The Decision tool honours the ISA policy 'hold': it advises no ISA draw even when tax-efficient
 * band management would top up from the ISA, and the SIPP draw rises to cover the target instead.
 */
import { describe, it, expect } from 'vitest';
import { decisionCases } from './golden/matrix.js';
import { calcDecisionPWA } from '../src/services/legacyDecision.js';

describe('Decision tool + ISA policy hold', () => {
  const base = decisionCases.find((c) => /ISA pot \(Option A\)/.test(c.name));
  it('Option A tops up from the ISA; hold draws nothing from it and takes the whole target from the SIPP', async () => {
    const a = await calcDecisionPWA(base.input.dateStr, base.input.equity, base.input.bond, base.input.cash, base.deps);
    expect(a.isaDraw).toBeGreaterThan(0);
    const holdDeps = { ...base.deps, settings: { ...base.deps.settings, isaDrawdownStrategy: 'hold' } };
    const h = await calcDecisionPWA(base.input.dateStr, base.input.equity, base.input.bond, base.input.cash, holdDeps);
    expect(h.isaDraw).toBe(0);
    expect(h.sippDraw).toBeGreaterThan(a.sippDraw);
    expect(h.totalMonthlyNet).toBeCloseTo(a.totalMonthlyNet, 0);   // same money in the bank, more tax
  });
});
