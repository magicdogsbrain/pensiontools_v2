/**
 * Cash model — pins the realistic cash return (a deliberate design decision).
 *
 * Cash reprices off ROUGHLY LAST YEAR'S inflation plus a −1% real spread (FCA prescribed rate),
 * floored at 0% nominal. So cash LAGS inflation: it loses in real terms during inflation spikes
 * and gains in disinflation, with a long-run average real return of ~−1%. This replaced the old
 * `max(0.5%, inflation + 1.2%)` — a guaranteed +1.2% real return that made an all-cash pot look
 * unrealistically safe (100% success at 35y). See the model-review research for sourcing.
 */
import { describe, it, expect } from 'vitest';
import { runMonteCarlo, runHistorical, analyzeResults, CASH_REAL_SPREAD } from '../src/services/SimulationEngine.js';

const allCash = {
  equityStart: 0, bondStart: 0, cashStart: 1200000,
  equityMin: 0, bondMin: 0, cashTarget: 1200000,
  years: 35, duration: 35, baseSalary: 60000, other: 15000,
  pa: 12570, brl: 50270, hrl: 125140, taxMode: 'inflates',
  protectionMult: 0.8, consecutiveLimit: 3, disableProtection: false,
  hodlEnabled: false, hodlValue: 0,
  isaBalance: 60000, isaReturn: 0.03, isaDrawdownStrategy: 'minimiseEarlyTax',
  spStartYear: 1, spWeeklyAmount: 230, spFirstYearRatio: 1
};

describe('cash model', () => {
  it('uses the FCA-prescribed −1% real spread', () => {
    expect(CASH_REAL_SPREAD).toBe(-0.01);
  });

  it('an all-cash pot is realistically RISKY over a long horizon (was 100% under the old model)', () => {
    // With cash losing ~1% real per year and lagging inflation, £1.2M all-cash drawing a real
    // income over 35 years should fail in most Monte-Carlo runs — not sail through at 100%.
    const mc = analyzeResults(runMonteCarlo(allCash, 1000)).successRate;
    expect(mc).toBeLessThan(60);        // realistically risky (observed ~35%)
    expect(mc).toBeGreaterThan(5);      // but not absurdly doomed either
  });

  it('the historical backtest (sustained 1970s inflation) is harsher than Monte Carlo', () => {
    // Sequential inflation captures the sustained high-inflation regime that iid Monte Carlo
    // averages away — so an all-cash plan should look even worse under historical replay.
    const mc = analyzeResults(runMonteCarlo(allCash, 1000)).successRate;
    const hist = analyzeResults(runHistorical(allCash)).successRate;
    expect(hist).toBeLessThan(mc);
  });
});
