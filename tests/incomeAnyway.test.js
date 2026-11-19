/**
 * Worst 12 months and the guaranteed line count the income that comes anyway (State Pension, a final-salary pension,
 * other income), not only what the pots pay. A fictional plan: Pat, 68, has a State Pension already being paid and a
 * final-salary pension, and asks for £40,000 a year.
 *
 * Worked by hand:
 *   State Pension      £230 a week × 52            = £11,960 a year (rises with prices: the same in today's money)
 *   Final-salary       £8,040 a year, rising with prices (cpi)  = £8,040 in today's money
 *   Comes anyway                                     = £20,000 a year
 * Small pots (£90,000) paying £40,000 a year run out within a few years in every future, so the worst 12 months are the
 * months after the money has run out: the £20,000 that comes anyway. Never £0.
 * Larger pots (£520,000) on Ladder & Ratchet run out in some histories after the base ladder: the same £20,000 then.
 */
import { describe, it, expect, vi } from 'vitest';
vi.mock('../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));

import { createSimulationConfigFromSettings } from '../src/storage/StressRepository.js';
import { stressTestStrategy, planFromSettings, pnvDecadeSeries } from '../src/strategies/stressTest.js';
import { cannedDecade } from '../src/strategies/compareRunner.js';

const NOW = new Date('2026-11-18T12:00:00Z');
const pat = {
  configured: true, duration: 25, other: 0, pa: 12570, brl: 50270, hrl: 125140, taxMode: 'inflates',
  protectionMult: 0.8, consecutiveLimit: 3, disableProtection: false, recoveryBuffer: 0,
  hodlEnabled: false, hodlValue: 0, isaReturn: 0.03, spStartDate: '2024-01-06', spWeeklyAmount: 230,
  dbAmount: 8040, dbStartYear: 0, dbIndexation: 'cpi',
  equityMin: 60000, bondMin: 20000, cashTarget: 10000, isaBalance: 0, baseSalary: 40000,
  incomeShape: 'phases', incomeSteps: [{ fromAge: 68, amount: 40000 }], shapeAgeNow: 68, currentAge: 68
};
const FAST = { mcRuns: 60, stride: 12 };
const plan = (s) => ({ ...planFromSettings(s, createSimulationConfigFromSettings({}, s), { now: NOW }), ...FAST });

describe('worst 12 months include the income that comes anyway', () => {
  it('Pots & Valves: a plan that runs out still lives on £20,000 a year', () => {
    const p = plan(pat);
    const r = stressTestStrategy('pots-and-valves', p);
    expect(r.ruin.mc).toBe(100);                     // every future runs out…
    expect(Math.round(r.worst12.min)).toBe(20000);   // …and the person still has £11,960 + £8,040 (was £0)
    expect(Math.round(r.worst12.median)).toBe(20000);
  });

  it('runs in a browser that has no `process` (the dev server defines none): a run that runs out still lives on £20,000', () => {
    const p = plan(pat);
    const keep = globalThis.process;
    let r;
    try { globalThis.process = undefined; r = stressTestStrategy('pots-and-valves', p); } finally { globalThis.process = keep; }
    expect(Math.round(r.worst12.min)).toBe(20000);
  });

  it('Buckets in order: the same £20,000', () => {
    const r = stressTestStrategy('buckets-in-order', plan(pat));
    expect(Math.round(r.worst12.min)).toBe(20000);
  });

  it('one named start (the year-by-year replay) and the canned decade say the same, never £0', () => {
    const p = plan(pat);
    const w = pnvDecadeSeries(p, 1966, 1);
    expect(w.failed).toBe(true);
    expect(Math.round(w.worst12)).toBe(20000);
    const d = cannedDecade(p, 1966, 1)['pots-and-valves'];
    expect(d.failed).toBe(true);
    expect(d.worst12).toBeGreaterThan(19999);
  });

  it('a failed run\'s income after the money runs out is the income that comes anyway, in the income cone too', () => {
    const r = stressTestStrategy('pots-and-valves', plan(pat));
    const last = r.cones.income.p50[r.cones.income.p50.length - 2];
    expect(Math.round(last)).toBe(20000);            // late years: the money has run out; £20,000 still comes (was £0)
  });

  it('Ladder & Ratchet: a history that runs out after the base ladder still pays £20,000 a year', () => {
    const p = plan({ ...pat, equityMin: 330000, bondMin: 150000, cashTarget: 40000 });
    const r = stressTestStrategy('ladder-and-ratchet', p);
    expect(r.affordable).toBe(true);
    expect(r.ruin.hist).toBeGreaterThan(0);          // some histories run out…
    expect(Math.round(r.worst12.min)).toBe(20000);   // …and still pay £11,960 + £8,040 (was £0)
  });
});

describe('the guaranteed line names every source that comes anyway', () => {
  it('names the State Pension (being paid now) and the final-salary pension with its amount', () => {
    const g = stressTestStrategy('pots-and-valves', plan(pat)).guaranteedToAge;
    expect(g).toMatch(/State Pension \(being paid now\)/);
    expect(g).toMatch(/final-salary pension £8,040 a year \(being paid now\)/);
    expect(g).not.toMatch(/only/);
  });

  it('a State Pension still to come keeps its age; a final-salary pension from a later year says its age', () => {
    const p = plan({ ...pat, spStartDate: '2030-06-06', dbStartYear: 2 });
    const g = stressTestStrategy('pots-and-valves', p).guaranteedToAge;
    expect(g).toMatch(/^State Pension \(from age \d+\)/);   // first, so the full view's age mark still finds it
    expect(g).toContain('final-salary pension £8,040 a year (from age ' + (p.startAge + 2) + ')');   // plan year 2
  });

  it('other income is named; nothing at all says so', () => {
    expect(stressTestStrategy('pots-and-valves', plan({ ...pat, other: 3000 })).guaranteedToAge).toMatch(/other income £3,000 a year/);
    const none = stressTestStrategy('pots-and-valves', plan({ ...pat, spWeeklyAmount: 0, spStartDate: null, statePension: 0, dbAmount: 0 })).guaranteedToAge;
    expect(none).toBe('None — market-dependent');
  });
});

/**
 * The bought ways (check round 2): their guaranteed line said only what the contract buys ("N by contract …"), though their
 * worst 12 months count the State Pension and the final-salary pension (£11,960 + £8,040 = £20,000 for Pat). The line now
 * names those sources beside the contract, State Pension first, in the same words as the Pots & Valves family's line.
 * Pat's pots here are £900,000, enough for every bought way to be bought.
 */
describe('a bought way\'s guaranteed line names the income that comes anyway beside the contract', () => {
  const rich = { ...pat, equityMin: 600000, bondMin: 200000, cashTarget: 100000 };
  const BOUGHT = ['full-il-gilt', 'gilt-rotation', 'floor-the-schedule', 'floor-to-age', 'bridge-and-engine', 'floor-and-flex', 'ladder-and-ratchet'];
  for (const id of BOUGHT) {
    it(id + ': the contract, plus State Pension (being paid now) and final-salary pension £8,040 a year (being paid now)', () => {
      const r = stressTestStrategy(id, plan(rich));
      expect(r.affordable).toBe(true);
      expect(r.guaranteedToAge).toMatch(/by contract/);
      expect(r.guaranteedToAge).toMatch(/; plus State Pension \(being paid now\) and final-salary pension £8,040 a year \(being paid now\)$/);
    });
  }
  it('with nothing that comes anyway, the contract line is as it was', () => {
    const r = stressTestStrategy('full-il-gilt', plan({ ...rich, spWeeklyAmount: 0, spStartDate: null, statePension: 0, dbAmount: 0 }));
    expect(r.guaranteedToAge).toMatch(/^\d+ by contract \(every year bought today\)$/);
  });
});
