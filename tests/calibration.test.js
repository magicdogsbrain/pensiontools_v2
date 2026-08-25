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
  it('S&P 500 total return 1928-2024 compounds at ~10% nominal / ~6.7% real (Damodaran; the old table said 5.7%)', () => {
    const ys = Object.keys(EQUITY_RETURNS);
    expect(ys.length).toBe(97);
    let g = 1, gr = 1;
    for (const y of ys) { g *= 1 + EQUITY_RETURNS[y]; gr *= (1 + EQUITY_RETURNS[y]) / (1 + INFLATION[y]); }
    expect(g ** (1 / ys.length) - 1).toBeGreaterThan(0.095);
    expect(g ** (1 / ys.length) - 1).toBeLessThan(0.105);
    expect(gr ** (1 / ys.length) - 1).toBeGreaterThan(0.062);
    // spot years that the old table got badly wrong
    expect(EQUITY_RETURNS[1950]).toBeCloseTo(0.308, 2);
    expect(EQUITY_RETURNS[2022]).toBeCloseTo(-0.180, 2);
    expect(EQUITY_RETURNS[2008]).toBeCloseTo(-0.366, 2);
  });
});

describe('engine sits inside the published Trinity/Bengen bands (slightly pessimistic end)', () => {
  it('4% over 30 years, 60/40: 88-100%', () => {
    expect(mcSuccess(trinity(0.04, 30))).toBeGreaterThan(88);
    expect(histSuccess(trinity(0.04, 30))).toBeGreaterThan(90);
  });
  it('5% over 30 years, 60/40: 65-85%', () => {
    const mc = mcSuccess(trinity(0.05, 30));
    expect(mc).toBeGreaterThan(65); expect(mc).toBeLessThan(85);
  });
  it('6% over 30 years, 60/40: 45-70% — the engine must still fail a reckless plan', () => {
    const mc = mcSuccess(trinity(0.06, 30));
    expect(mc).toBeGreaterThan(45); expect(mc).toBeLessThan(70);
  });
  it('3% over 40 years is essentially safe', () => {
    expect(mcSuccess(trinity(0.03, 40))).toBeGreaterThan(94);
  });
});
