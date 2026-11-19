import { describe, it, expect, vi } from 'vitest';
vi.mock('../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));
import { candidateAges, potAtAge, sweepRetirementAges, sweepPlanAt, earliestAt, sweepHeadline, NO_POT_MESSAGE } from '../src/services/RetireSweep.js';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const NOW = new Date(2026, 8, 10);
// A 50-year-old saver: £400k SIPP (world tracker), £1,875/month going in, wants £40k a year, P&V strategy.
// The Stress settings carry pot floors and a `taggedFunds` test list with OTHER numbers: the sweep must never read them as the pot.
const settings = {
  currentAge: 50, currentAgeAsOf: '2026-09-10', retired: false, retireAge: 60, duration: 35, shapeAgeNow: 60,
  taggedFunds: [{ ticker: 'VWRP', value: 999999, wrapper: 'SIPP', ocf: 0.22, contribution: 9999 }],
  equityMin: 800000, bondMin: 0, cashTarget: 0, isaBalance: 0, baseSalary: 40000,
  incomeShape: 'phases', incomeSteps: [{ fromAge: 60, amount: 40000 }, { fromAge: 75, amount: 32000 }],
  pa: 12570, brl: 50270, hrl: 125140, taxMode: 'inflates', spStartDate: '10 September 2043', spWeeklyAmount: 230,
  strategyId: 'pots-and-valves', strategyParams: {}
};
// What the saver actually holds — the holdings record (6.13.0).
const holdings = { version: 1, updatedAt: '2026-09-10', source: 'typed', offerDismissed: false, lines: [{ ticker: 'VWRP', value: 400000, wrapper: 'SIPP', ocf: 0.22, contribution: 1875 }] };
const accumulation = { netMonthly: 1200, salary: 60000, schemeType: 'ras', employerMonthly: 375 };

describe('candidateAges and potAtAge', () => {
  it('ages run from next year to 75 (or the plan\'s own age if later)', () => {
    expect(candidateAges(50)[0]).toBe(55);
    expect(candidateAges(50).slice(-1)[0]).toBe(75);
    expect(candidateAges(57, 80).slice(-1)[0]).toBe(80);
  });
  it('the pot grows with the years and is bigger at the holder\'s own mix than the cautious band', () => {
    const p60 = potAtAge({ settings, accumulation, holdings, currentAge: 50, age: 60 });
    const p65 = potAtAge({ settings, accumulation, holdings, currentAge: 50, age: 65 });
    expect(p60.potNow).toBe(400000);   // from the holdings record, not the £800k floor or the £999,999 test list
    expect(p60.basis).toBe('your mix');
    expect(p60.pot).toBeGreaterThan(400000);
    expect(p65.pot).toBeGreaterThan(p60.pot);
    expect(p60.low).toBeLessThan(p60.pot);
    expect(p60.totalMonthly).toBeGreaterThan(1500);
    expect(potAtAge({ settings, accumulation, holdings: holdings.lines, currentAge: 50, age: 60 }).potNow).toBe(400000);   // lines alone work too
  });
  it('no holdings: the Accumulation planner\'s pot today is the fallback; nothing at all → null, never the tested pots', () => {
    const acc = potAtAge({ settings, accumulation: { ...accumulation, potNow: 250000 }, currentAge: 50, age: 60 });
    expect(acc.potNow).toBe(250000);
    expect(acc.basis).toBe('FCA middle band');
    const none = potAtAge({ settings, accumulation, currentAge: 50, age: 60 });
    expect(none).toMatchObject({ potNow: null, pot: null, low: null, high: null, basis: null });
    expect(none.totalMonthly).toBeGreaterThan(1500);
  });
});

describe('sweepRetirementAges', () => {
  const result = sweepRetirementAges({ settings, accumulation, holdings, ages: [58, 62, 67], now: NOW });
  it('with no pot on record it says so instead of spinning on the tested pots', () => {
    const r = sweepRetirementAges({ settings, accumulation, ages: [58], now: NOW });
    expect(r.rows).toEqual([]);
    expect(r.error).toBe(NO_POT_MESSAGE);
    expect(sweepHeadline(r)).toBe(NO_POT_MESSAGE);
    const ok = sweepRetirementAges({ settings, accumulation: { ...accumulation, potNow: 400000 }, ages: [62], now: NOW });
    expect(ok.rows.length).toBe(1);
    expect(ok.basis).toBe('FCA middle band');
  });
  it('gives a confidence per age that rises with age, with the pot each was priced on', () => {
    expect(result.income).toBe(40000);
    expect(result.rows.length).toBe(3);
    for (const r of result.rows) { expect(r.success).not.toBeNull(); expect(r.pot).toBeGreaterThan(400000); expect(r.affordable).toBe(true); }
    expect(result.rows[2].success).toBeGreaterThanOrEqual(result.rows[0].success);
    expect(result.rows[0].yearsAway).toBe(8);
  });
  it('a flat income override is respected', () => {
    const r = sweepRetirementAges({ settings, accumulation, holdings, ages: [62], incomeOverride: 25000, now: NOW });
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
    expect(e).toMatchObject({ age: 58, met: true });
    const none = earliestAt(result.rows, 101);
    expect(none.met).toBe(false);
    expect(sweepHeadline(result, 0)).toMatch(/At £40,000 a year you could retire at 58/);
    expect(sweepHeadline({ rows: [], error: 'x' })).toBe('x');
  });
});

// lead4.md R5/R6 (step M, fix round 2): "When could I retire?" judges each age on the ONE gatherer's engine plan
// (src/reading/gather.js enginePlanOf: the one market's real-yield curve for a bought way, the plan's own futures and
// histories), never a plan of its own on a flat yield, 200 futures and every 6th history.
describe('the sweep runs each age on the one engine plan, the one market and the one futures rule', () => {
  it('a bought way at an age: the row is the plan test of enginePlanOf for that age, at RUN_FUTURES', async () => {
    const { enginePlanOf } = await import('../src/reading/gather.js');
    const { stressTestStrategy } = await import('../src/strategies/stressTest.js');
    const { RUN_FUTURES } = await import('../src/reading/runs.js');
    const s0 = { ...settings, strategyId: 'floor-to-age' };
    const out = sweepRetirementAges({ settings: s0, accumulation, holdings, ages: [62], now: NOW });
    const { s } = sweepPlanAt({ settings: s0, accumulation, holdings, currentAge: 50, age: 62, timing: undefined });
    const p = enginePlanOf({ settings: s, now: NOW.toISOString() });
    expect(p.mcRuns).toBe(RUN_FUTURES);
    expect(typeof p.yieldForYear).toBe('function');
    const r = stressTestStrategy('floor-to-age', p);
    expect(out.rows[0].affordable).toBe(r.affordable !== false);
    expect(out.rows[0].ruin).toBe(+r.ruin.mc || 0);
    expect(out.rows[0].coverage).toBe(+(r.coverage ?? 100 - r.ruin.mc));
  }, 120000);
  it('the sweep has no futures or history knobs of its own, and the full view asks none', () => {
    const src = readFileSync(join(process.cwd(), 'src', 'services', 'RetireSweep.js'), 'utf8');
    expect(src).toMatch(/import \{ enginePlanOf \} from '\.\.\/reading\/gather\.js'/);
    expect(src).not.toMatch(/planFromSettings\(/);
    expect(src).not.toMatch(/mcRuns|stride/);
    const page = readFileSync(join(process.cwd(), 'index.html'), 'utf8');
    const at = page.indexOf('window.runRetireSweep = async function');
    const body = page.slice(at, page.indexOf('\n    };', at));
    expect(body).not.toMatch(/mcRuns|stride|200 futures|every 6th history/);
  });
});
