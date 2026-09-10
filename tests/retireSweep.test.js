import { describe, it, expect, vi } from 'vitest';
vi.mock('../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));
import { candidateAges, potAtAge, sweepRetirementAges, earliestAt, sweepHeadline } from '../src/services/RetireSweep.js';

const NOW = new Date(2026, 8, 10);
// A 50-year-old saver: £400k SIPP (world tracker), £1,875/month going in, wants £40k a year, P&V strategy.
const settings = {
  currentAge: 50, currentAgeAsOf: '2026-09-10', retired: false, retireAge: 60, duration: 35, shapeAgeNow: 60,
  taggedFunds: [{ ticker: 'VWRP', value: 400000, wrapper: 'SIPP', ocf: 0.22, contribution: 1875 }],
  equityMin: 400000, bondMin: 0, cashTarget: 0, isaBalance: 0, baseSalary: 40000,
  incomeShape: 'phases', incomeSteps: [{ fromAge: 60, amount: 40000 }, { fromAge: 75, amount: 32000 }],
  pa: 12570, brl: 50270, hrl: 125140, taxMode: 'inflates', spStartDate: '10 September 2043', spWeeklyAmount: 230,
  strategyId: 'pots-and-valves', strategyParams: {}
};
const accumulation = { netMonthly: 1200, salary: 60000, schemeType: 'ras', employerMonthly: 375, potNow: 400000 };

describe('candidateAges and potAtAge', () => {
  it('ages run from next year to 75 (or the plan\'s own age if later)', () => {
    expect(candidateAges(50)[0]).toBe(55);
    expect(candidateAges(50).slice(-1)[0]).toBe(75);
    expect(candidateAges(57, 80).slice(-1)[0]).toBe(80);
  });
  it('the pot grows with the years and is bigger at the holder\'s own mix than the cautious band', () => {
    const p60 = potAtAge({ settings, accumulation, currentAge: 50, age: 60 });
    const p65 = potAtAge({ settings, accumulation, currentAge: 50, age: 65 });
    expect(p60.basis).toBe('your mix');
    expect(p60.pot).toBeGreaterThan(400000);
    expect(p65.pot).toBeGreaterThan(p60.pot);
    expect(p60.low).toBeLessThan(p60.pot);
    expect(p60.totalMonthly).toBeGreaterThan(1500);
  });
});

describe('sweepRetirementAges', () => {
  const result = sweepRetirementAges({ settings, accumulation, ages: [57, 62, 67], mcRuns: 30, stride: 24, now: NOW });
  it('gives a confidence per age that rises with age, with the pot each was priced on', () => {
    expect(result.income).toBe(40000);
    expect(result.rows.length).toBe(3);
    for (const r of result.rows) { expect(r.success).not.toBeNull(); expect(r.pot).toBeGreaterThan(400000); expect(r.affordable).toBe(true); }
    expect(result.rows[2].success).toBeGreaterThanOrEqual(result.rows[0].success);
    expect(result.rows[0].yearsAway).toBe(7);
  });
  it('a flat income override is respected', () => {
    const r = sweepRetirementAges({ settings, accumulation, ages: [62], incomeOverride: 25000, mcRuns: 20, stride: 24, now: NOW });
    expect(r.income).toBe(25000);
    expect(r.rows[0].success).toBeGreaterThanOrEqual(result.rows[1].success);   // less income, same age → at least as safe
  });
  it('no age today → an error message, no crash', () => {
    const r = sweepRetirementAges({ settings: { baseSalary: 30000 }, now: NOW });
    expect(r.rows).toEqual([]);
    expect(r.error).toMatch(/age today/);
  });
  it('earliestAt and the headline read sensibly', () => {
    const e = earliestAt(result.rows, 0);
    expect(e).toMatchObject({ age: 57, met: true });
    const none = earliestAt(result.rows, 101);
    expect(none.met).toBe(false);
    expect(sweepHeadline(result, 0)).toMatch(/At £40,000 a year you could retire at 57/);
    expect(sweepHeadline({ rows: [], error: 'x' })).toBe('x');
  });
});
