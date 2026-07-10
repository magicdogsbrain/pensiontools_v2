/**
 * Failure-severity analytics — a binary pass/fail hides that a year-34 failure is a near-success
 * while a year-5 failure is a collapse. analyzeResults().severity adds coverage (share of
 * retirement-years funded), failure timing, and a plain-English reason diagnosis.
 */
import { describe, it, expect } from 'vitest';
import { runMonteCarlo, analyzeResults } from '../src/services/SimulationEngine.js';

// A config with meaningful failures (no State Pension, so plenty run dry late).
const config = {
  equityStart: 600000, bondStart: 480000, cashStart: 120000,
  equityMin: 600000, bondMin: 480000, cashTarget: 120000,
  years: 30, duration: 30, baseSalary: 59450, other: 0,
  pa: 12570, brl: 50270, hrl: 125140, taxMode: 'inflates',
  protectionMult: 0.8, consecutiveLimit: 3, disableProtection: false,
  hodlEnabled: false, hodlValue: 0
};

describe('failure severity', () => {
  const stats = analyzeResults(runMonteCarlo(config, 1000));
  const sev = stats.severity;

  it('coverage is never below the binary success rate (late failures earn partial credit)', () => {
    // Every success contributes 1.0; every failure contributes years/duration ∈ (0,1) — so the
    // coverage % must be >= the binary success %, and strictly higher when there are failures.
    expect(sev.coverage).toBeGreaterThanOrEqual(stats.successRate - 1e-6);
    if (sev.failCount > 0) expect(sev.coverage).toBeGreaterThan(stats.successRate);
  });

  it('reports failure timing and a non-empty diagnosis', () => {
    expect(sev.failCount).toBeGreaterThan(0);
    expect(sev.medianFailYear).toBeGreaterThan(0);
    expect(sev.medianFailYear).toBeLessThanOrEqual(config.duration);
    expect(sev.pctNearMiss).toBeGreaterThanOrEqual(0);
    expect(typeof sev.diagnosis).toBe('string');
    expect(sev.diagnosis.length).toBeGreaterThan(20);
  });

  it('identifies sequence-of-returns risk: failing runs start with weaker markets', () => {
    // The defining signature of sequence risk — a worse first 5 years for the runs that fail.
    expect(sev.succEarlyEq).toBeGreaterThan(sev.failEarlyEq);
    expect(sev.diagnosis).toMatch(/sequence-of-returns risk|early-market/);
  });
});
