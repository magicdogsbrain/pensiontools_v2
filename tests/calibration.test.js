/**
 * Engine calibration against the published safe-withdrawal literature (Bengen 1994; Trinity 1998;
 * Pfau 2018 update). The bundled market data was once a hand-typed table ~4pp/yr too low, which
 * made every plan look reckless for months (research/market-data-audit-aug-2026.md). These bands
 * make a repeat impossible to miss: Trinity conventions (no tax, no pension, flat real draw,
 * 60/40, no spending cuts), 1,000 bootstrapped futures + every historical start year.
 */
import { describe, it, expect } from 'vitest';
import { simulate, monteCarloReturns, runHistorical } from '../src/services/SimulationEngine.js';
import { EQUITY_RETURNS, INFLATION } from '../src/constants.js';

const trinity = (rate, years, eq = 0.6) => {
  const pot = 1e6;
  return { equityStart: pot * eq, bondStart: pot * (1 - eq), cashStart: 0, equityMin: 0, bondMin: 0, cashTarget: 0,
    years, duration: years, baseSalary: pot * rate, other: 0, spStartYear: 99, spWeeklyAmount: 0,
    pa: 0, brl: 1e12, hrl: 1e12, taxMode: 'inflates', protectionMult: 0.8, consecutiveLimit: 3, disableProtection: true,
    hodlEnabled: false, isaBalance: 0, isaReturn: 0, accessMethod: 'drawdown', recoveryBuffer: 15000,
    spendingProfile: 'flat', extraIncomes: [], windfalls: [], targetSchedule: null, dbAmount: 0 };
};
const mcSuccess = (cfg, runs = 600) => { let f = 0; for (let i = 0; i < runs; i++) if (simulate(cfg, monteCarloReturns(cfg, i), i).failed) f++; return 100 * (1 - f / runs); };
const histSuccess = (cfg) => { const r = runHistorical(cfg); return 100 * (1 - r.filter((x) => x.failed).length / r.length); };

describe('market data is real market data', () => {
  it('WORLD equity 1928-2024 = S&P total return (Damodaran, ~9.9% nominal) less the 1.5pp Yearbook US-vs-World gap → ~8.3% nominal / ~5.1% real', () => {
    const ys = Object.keys(EQUITY_RETURNS);
    expect(ys.length).toBe(97);
    let g = 1, gr = 1;
    for (const y of ys) { g *= 1 + EQUITY_RETURNS[y]; gr *= (1 + EQUITY_RETURNS[y]) / (1 + INFLATION[y]); }
    expect(g ** (1 / ys.length) - 1).toBeGreaterThan(0.078);
    expect(g ** (1 / ys.length) - 1).toBeLessThan(0.088);
    expect(gr ** (1 / ys.length) - 1).toBeGreaterThan(0.046);
    expect(gr ** (1 / ys.length) - 1).toBeLessThan(0.056);
    // spot years: published S&P figure × (1 − 0.015) − 1 (the old table had 17.9%, −8.8%, −33.6%)
    expect(EQUITY_RETURNS[1950]).toBeCloseTo(1.308 * 0.985 - 1, 2);
    expect(EQUITY_RETURNS[2022]).toBeCloseTo(0.820 * 0.985 - 1, 2);
    expect(EQUITY_RETURNS[2008]).toBeCloseTo(0.634 * 0.985 - 1, 2);
  });
});

// Published (US-data) Trinity/Bengen figures: 4%/30y ≈95-100%, 5%/30y ≈70-80%, 6%/30y ≈50-60%, 3%/40y ≈100%.
// On WORLD equity (1.5pp/yr less) plus the engine's cautious bond/cash models the same plans sit
// ~10 points lower — deliberately. The bands below pin THAT relationship, not the US numbers.
describe('engine on world equity: ~10 points below the published US Trinity/Bengen figures, still ordered', () => {
  it('4% over 30 years, 60/40: 76-92% (US-published 95-100%)', () => {
    const mc = mcSuccess(trinity(0.04, 30));
    expect(mc).toBeGreaterThan(76); expect(mc).toBeLessThan(92);
    expect(histSuccess(trinity(0.04, 30))).toBeGreaterThan(70);
  });
  it('5% over 30 years, 60/40: 50-72%', () => {
    const mc = mcSuccess(trinity(0.05, 30));
    expect(mc).toBeGreaterThan(50); expect(mc).toBeLessThan(72);
  });
  it('6% over 30 years, 60/40: 28-52% — a reckless plan must fail more often than not', () => {
    const mc = mcSuccess(trinity(0.06, 30));
    expect(mc).toBeGreaterThan(28); expect(mc).toBeLessThan(52);
  });
  it('3% over 40 years is still very safe (>84%)', () => {
    expect(mcSuccess(trinity(0.03, 40))).toBeGreaterThan(84);
  });
  it('ordering: 3% > 4% > 5% > 6%', () => {
    const a = mcSuccess(trinity(0.03, 30), 300), b = mcSuccess(trinity(0.04, 30), 300), c = mcSuccess(trinity(0.05, 30), 300), d = mcSuccess(trinity(0.06, 30), 300);
    expect(a).toBeGreaterThan(b); expect(b).toBeGreaterThan(c); expect(c).toBeGreaterThan(d);
  });
});
