/**
 * (wrap-up) "What you would have left, combined" reads each plan's money in the calendar year it is in: two plans still
 * saving start their runs at their stops, so the first row is the year the later one stops, each plan's figure that
 * many years into its own run — never the pots at the stop said against this year.
 */
import { describe, it, expect } from 'vitest';
import { combineHouseholdStrategies, runHouseholdWays } from '../src/services/HouseholdService.js';
import { householdLeftOf } from '../src/answers/plan/household.js';

const run = (wealth) => ({ survivedMc: wealth.map(() => true), samples: { wealth }, cones: { wealth: { p50: wealth[0] } }, affordable: true });
const A = run([[100, 90, 80, 70, 60, 50, 40, 30, 20, 10]]);
const B = run([[1000, 900, 800, 700, 600, 500, 400, 300, 200, 100]]);

describe('the combined money by calendar year', () => {
  it('both drawing now: as before, year 0 is this year', () => {
    const c = combineHouseholdStrategies(A, B, {});
    expect(c.potFan[0]).toEqual({ year: 0, p10: 1100, p50: 1100, p90: 1100 });
    expect(c.potFan.length).toBe(10);
  });
  it('A stops in 3 years, B in 5: the first row is year 5, A two years into its run, B at its start', () => {
    const c = combineHouseholdStrategies(A, B, { startA: 3, startB: 5 });
    expect(c.potFan[0]).toEqual({ year: 5, p10: 80 + 1000, p50: 1080, p90: 1080 });
    expect(c.potFan[1].year).toBe(6);
    expect(c.potFan[1].p50).toBe(70 + 900);
    const rows = householdLeftOf(c.potFan, 2026);
    expect(rows[0].year).toBe('2031');
    expect(rows[1].year).toBe('2036');
  });
  it('the household run hands each plan\'s start on', () => {
    const ways = { own: { settingsA: {}, cfgA: {}, settingsB: {}, cfgB: {} } };
    const test = (s, cfg, id) => ({ r: id === 'a' ? A : B, p: { startAge: 60 } });
    const out = runHouseholdWays(ways, {}, 'a', 'b', test, { a: 3, b: 5 });
    expect(out.own.combined.potFan[0].year).toBe(5);
    expect(runHouseholdWays(ways, {}, 'a', 'b', test).own.combined.potFan[0].year).toBe(0);
  });
});
