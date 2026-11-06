/**
 * Accounting identity (strategy brief Appendix D4): money is conserved. On a deterministic
 * (epsilon-inflation, zero-equity-return) path with a single equity pot — the bond model has
 * stochastic terms and `inflation: 0` reads as unset, so exact-zero paths are impossible —
 * the engine must satisfy exactly:
 *     final pots = start − Σ(monthly SIPP draws)      and
 *     final ISA  = start ISA − Σ(monthly ISA top-ups)
 * Internal transfers cancel by construction. Conservation violations are how simulator bugs
 * announce themselves.
 */
import { describe, it, expect } from 'vitest';
import { simulate } from '../../src/services/SimulationEngine.js';
import { planDrawdown } from '../../src/services/DrawdownStrategy.js';

const EPS_INF = 1e-9;
function detPath(years) {
  const p = { equity: {}, inflation: {} };
  for (let y = 0; y < years; y++) { p.equity[y] = 0; p.inflation[y] = EPS_INF; }
  return p;
}
const baseCfg = (years, target, isa) => ({
  equityStart: 2000000, bondStart: 0, cashStart: 0,
  equityMin: 100000, bondMin: 0, cashTarget: 0,
  duration: 35, years, baseSalary: target, other: 0,
  statePension: 0, statePensionYear: 99,
  pa: 12570, brl: 50270, hrl: 125140, taxMode: 'frozen',
  disableProtection: true, protectionMult: 0.8,
  hodlEnabled: false, hodlValue: 0,
  isaBalance: isa, isaReturn: 0
});

describe('conservation on a deterministic path (equity-only, frozen bands)', () => {
  it('inside the band: pots deplete by exactly the drawn gross; the ISA is untouched', () => {
    const years = 10;
    const r = simulate(baseCfg(years, 30000, 100000), detPath(years), 1);
    expect(r.failed).toBe(false);
    const plan = planDrawdown({ targetGross: 30000, fixedIncome: 0, pa: 12570, brl: 50270, hrl: 125140, isaBalance: 100000 });
    expect(plan.isaDraw).toBe(0);
    const potsFinal = r.finalEquity + r.finalBond + r.finalCash;
    expect(potsFinal).toBeCloseTo(2000000 - plan.sippGross * years, 1);
    expect(r.finalIsa).toBeCloseTo(100000, 1);
  });

  it('above the band: SIPP capped at the BRL and the ISA depletes by exactly its top-up', () => {
    const years = 5;
    const r = simulate(baseCfg(years, 110000, 500000), detPath(years), 1);
    expect(r.failed).toBe(false);
    const plan = planDrawdown({ targetGross: 110000, fixedIncome: 0, pa: 12570, brl: 50270, hrl: 125140, isaBalance: 500000 });
    expect(plan.sippGross).toBeCloseTo(50270, 6);        // band-capped
    expect(plan.isaDraw).toBeGreaterThan(0);
    const potsFinal = r.finalEquity + r.finalBond + r.finalCash;
    expect(potsFinal).toBeCloseTo(2000000 - plan.sippGross * years, 1);
    expect(r.finalIsa).toBeCloseTo(500000 - plan.isaDraw * years, 1);
  });
});
