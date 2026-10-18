import { describe, it, expect } from 'vitest';
import { householdIncomeTimeline, targetForYear } from '../src/services/HouseholdService.js';
import { scheduleFromSteps } from '../src/services/IncomeSchedule.js';

describe('householdIncomeTimeline', () => {
  const setA = { duration: 30, baseSalary: 30000, statePension: 12000, statePensionYear: 8, other: 0 };
  const setB = { duration: 25, baseSalary: 22000, statePension: 11000, statePensionYear: 3, dbAmount: 6000, dbStartYear: 0 };

  it('SP steps land in the right years; bridge flag clears once both SPs pay', () => {
    const rows = householdIncomeTimeline(setA, setB);
    expect(rows[0].guaranteed).toBe(6000);              // DB only
    expect(rows[0].bridge).toBe(true);
    expect(rows[3].spB).toBe(11000);                    // partner SP starts year 3
    expect(rows[3].bridge).toBe(true);                  // still bridging A's SP
    expect(rows[8].spA).toBe(12000);
    expect(rows[8].bridge).toBe(false);                 // both in payment
    expect(rows[8].guaranteed).toBe(12000 + 11000 + 6000);
  });

  it('needs stack while both plans run, drop when the shorter plan ends', () => {
    const rows = householdIncomeTimeline(setA, setB);
    expect(rows[0].need).toBe(52000);
    expect(rows[26].needB).toBe(0);                     // B's 25-year plan is over
    expect(rows[26].need).toBe(rows[26].needA);
    expect(rows[10].drawNeed).toBe(52000 - 29000);      // need − (both SPs + DB)
  });

  it('respects a per-year targetSchedule when present', () => {
    const rows = householdIncomeTimeline({ ...setA, targetSchedule: [40000, 20000] }, setB);
    expect(rows[0].needA).toBe(40000);
    expect(rows[1].needA).toBe(20000);
    expect(rows[2].needA).toBe(30000);                  // falls back to baseSalary
  });

  // Review, 1 Oct 2026: a couple's plans made from a V7 answer hold their shape as income STEPS with no saved schedule
  // (the engines compile it). The Household table read only a saved schedule, so it showed each plan's first step in
  // every year ("£25,300 | £9,046" from 2036 to 2071) while the plans' own tests followed the steps.
  it('follows the income steps the engines run when there is no saved schedule (as createSimulationConfigFromSettings does)', () => {
    const stepsA = { ...setA, shapeAgeNow: 62, incomeShape: 'phases', baseSalary: 25300, incomeSteps: [{ fromAge: 62, amount: 25300 }, { fromAge: 67, amount: 29761 }, { fromAge: 69, amount: 18539 }] };
    const stepsB = { ...setB, shapeAgeNow: 60, incomeShape: 'phases', baseSalary: 9046, incomeSteps: [{ fromAge: 60, amount: 9046 }, { fromAge: 65, amount: 5477 }, { fromAge: 67, amount: 14926 }] };
    const rows = householdIncomeTimeline(stepsA, stepsB);
    expect([rows[0].needA, rows[4].needA, rows[5].needA, rows[6].needA, rows[7].needA, rows[20].needA]).toEqual([25300, 25300, 29761, 29761, 18539, 18539]);
    expect([rows[0].needB, rows[4].needB, rows[5].needB, rows[6].needB, rows[7].needB]).toEqual([9046, 9046, 5477, 5477, 14926]);
    // one schedule for both: what the Household tab reads is what the engine config carries
    for (const [set, rowKey] of [[stepsA, 'needA'], [stepsB, 'needB']]) {
      const sched = scheduleFromSteps(set);
      for (let y = 0; y < 20; y++) expect(rows[y][rowKey], rowKey + ' ' + y).toBe(sched[y]);
    }
    // the survivor and care checks and the tax nudge read the same per-year target
    expect(targetForYear(stepsA, 5)).toBe(29761);
    expect(targetForYear(setA, 5)).toBe(30000);                                          // a level plan: unchanged
    expect(targetForYear({ ...stepsA, targetSchedule: [1, 2, 3] }, 1)).toBe(2);           // a saved schedule still wins
  });
});

import { householdDrawSplit, headlineWords } from '../src/services/HouseholdDraw.js';
// The allowance-filling nudge (one sentence about year 0, the saving reckoned at 20% of the shifted slice) was replaced
// in 6.25.0 by "who draws what" (services/HouseholdDraw.js, tests/householdDraw.test.js): the same situations, read
// from the real withdrawal policy year by year, with the saving from the app's own tax sums.
describe('who draws what, where the nudge used to be', () => {
  const base = { configured: true, retired: true, currentAge: 60, shapeAgeNow: 60, duration: 30, other: 0, statePensionYear: 99, statePension: 0, equityMin: 600000, bondMin: 200000, cashTarget: 50000, isaBalance: 0, isaDrawdownStrategy: 'hold', pa: 12570, brl: 50270, hrl: 125140 };
  const split = (a, b) => householdDrawSplit({ settings: { ...base, ...a }, name: 'Alex' }, { settings: { ...base, equityMin: 100000, bondMin: 50000, cashTarget: 20000, ...b }, name: 'Sam' }, { now: new Date('2026-10-17T10:00:00Z') });
  it('40%-band spend on one side against unused 20% band on the other: a saving, and the words name who pays 40%', () => {
    const s = split({ baseSalary: 70000 }, { baseSalary: 20000 });
    expect(s.saving.year).toBeGreaterThan(1000);
    expect(s.applies).toBe(true);
    expect(headlineWords(s).why).toMatch(/Alex pays 40%/);
    expect(headlineWords(s).why).toMatch(/Sam/);
  });
  it('stays silent when both are inside their bands', () => {
    const s = split({ baseSalary: 30000 }, { baseSalary: 25000 });
    expect(s.unchanged).toBe(true);
    expect(s.applies).toBe(false);
  });
  it('a large ISA bridge means NO higher-rate tax and NO bogus saving (the real withdrawal policy caps the SIPP at the band)', () => {
    const s = split({ baseSalary: 70000, isaBalance: 500000, isaDrawdownStrategy: 'tax-efficient' }, { baseSalary: 20000 });
    expect(s.rows[0].own.taxableA).toBeLessThanOrEqual(50270 + 1);
    expect(s.rows[0].saving).toBeLessThan(1);
  });
});

import { startOffset } from '../src/services/HouseholdService.js';

describe('calendar alignment for a partner who is still working', () => {
  it('startOffset = income-start age − age today (0 when retired or unknown)', () => {
    expect(startOffset({ currentAge: 58, shapeAgeNow: 60 })).toBe(2);
    expect(startOffset({ currentAge: 62, shapeAgeNow: 62 })).toBe(0);
    expect(startOffset({})).toBe(0);
  });
  it('timeline: the working partner needs nothing and gets no SP until their plan starts', () => {
    const a = { baseSalary: 30000, duration: 30, currentAge: 58, shapeAgeNow: 60, statePension: 12000, statePensionYear: 7 };
    const b = { baseSalary: 20000, duration: 30, statePension: 11000, statePensionYear: 3 };
    const rows = householdIncomeTimeline(a, b);
    expect(rows[0].workingA).toBe(true);
    expect(rows[0].needA).toBe(0);
    expect(rows[0].needB).toBe(20000);
    expect(rows[2].workingA).toBe(false);
    expect(rows[2].needA).toBe(30000);
    // A's SP is plan year 7 → calendar year 9
    expect(rows[8].spA).toBe(0);
    expect(rows[9].spA).toBe(12000);
    expect(rows[3].spB).toBe(11000);
    expect(rows.length).toBe(33);
  });
});

import { combineHouseholdStrategies } from '../src/services/HouseholdService.js';
describe('household with each partner on their own strategy', () => {
  it('pairs futures by index and sums the wealth samples', () => {
    const rA = { survivedMc: [true, true, false, true], samples: { wealth: [[100, 90], [100, 80]] }, cones: { wealth: { p50: [] } } };
    const rB = { survivedMc: [true, false, false, true], samples: { wealth: [[50, 60], [50, 40]] }, cones: { wealth: { p50: [] } } };
    const r = combineHouseholdStrategies(rA, rB);
    expect(r.runs).toBe(4);
    expect(r.successA).toBeCloseTo(0.75, 5);
    expect(r.successB).toBeCloseTo(0.5, 5);
    expect(r.jointSuccess).toBeCloseTo(0.5, 5);
    expect(r.potFan[0].p50).toBe(150);
    expect(r.byStrategy).toBe(true);
  });
});

describe('household pairing with a deterministic partner', () => {
  it('a one-future plan is broadcast across the other plan\'s futures', () => {
    const rA = { survivedMc: [true, false, true, true], samples: { wealth: [[100, 90], [100, 0]] }, cones: { wealth: { p50: [] } } };
    const gilt = { survivedMc: [true], samples: null, cones: { wealth: { p50: [40, 30] } } };
    const r = combineHouseholdStrategies(rA, gilt);
    expect(r.runs).toBe(4);
    expect(r.successB).toBe(1);
    expect(r.jointSuccess).toBeCloseTo(0.75, 5);
    expect(r.potFan[0].p50).toBe(140);
  });
});

describe('householdIncomeTimeline — already retired in the run-up (6.12.5)', () => {
  it('a retired person whose ladder starts next April is not "still working" this year', () => {
    const alex = { retired: true, currentAge: 56, currentAgeAsOf: '2026-09-16', shapeAgeNow: 57, baseSalary: 83650, duration: 35, spStartDate: '17 April 2037', spWeeklyAmount: 230 };
    const sam = { retired: false, currentAge: 55, currentAgeAsOf: '2026-09-16', shapeAgeNow: 56, baseSalary: 30000, duration: 35, spStartDate: '1 June 2038', spWeeklyAmount: 230 };
    const rows = householdIncomeTimeline(alex, sam, 3);
    expect(rows[0].workingA).toBe(false);          // Alex retired in 2025: drawing now
    expect(rows[0].needA).toBe(83650);             // his run-up need is the first step
    expect(rows[0].workingB).toBe(true);           // Sam stops next June
    expect(rows[1].workingB).toBe(false);
  });
});
