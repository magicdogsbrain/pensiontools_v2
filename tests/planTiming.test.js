import { describe, it, expect } from 'vitest';
import {
  taxYearStartOf, taxYearLabel, taxYearKey, planYearOf, ageOnDate, ageInTaxYear, taxYearOfAge,
  migrateTiming, deriveTiming, potScaleOf, projectedPotAtRetirement, describeTiming,
  stoppedWorkOf, taxYearOfMonth, hasStopped, startYearChoices
} from '../src/services/PlanTiming.js';

// Alex (fictional): born 12 June 1963; age 62 recorded on 1 March 2026; State Pension 12 June 2030.
const NOW = new Date(2026, 8, 9);
const alex = { currentAge: 62, currentAgeAsOf: '2026-03-01', spStartDate: '12 June 2030', spWeeklyAmount: 230, shapeAgeNow: 64, duration: 30 };

describe('tax-year arithmetic', () => {
  it('6 April is the boundary', () => {
    expect(taxYearStartOf(new Date(2027, 3, 5))).toBe(2026);
    expect(taxYearStartOf(new Date(2027, 3, 6))).toBe(2027);
    expect(taxYearLabel(2027)).toBe('2027/28');
    expect(taxYearKey(2027)).toBe('27/28');
  });
  it('planYearOf is signed and accepts keys, months and dates', () => {
    expect(planYearOf('26/27', 2027)).toBe(-1);
    expect(planYearOf('27/28', 2027)).toBe(0);
    expect(planYearOf('2030-03', 2027)).toBe(2);     // March 2030 is still 29/30
    expect(planYearOf('2030-04-15', 2027)).toBe(3);
    expect(planYearOf(new Date(2036, 8, 1), 2027)).toBe(9);
  });
});

describe("ages the way the plan counts them (age reached during the tax year)", () => {
  it("Alex is 64 in 2027/28 and 67 in 2030/31 — the State Pension year", () => {
    expect(ageOnDate(alex, NOW, NOW)).toBe(63);          // 62 when recorded in March, 63 since June
    expect(ageInTaxYear(alex, 2026, NOW)).toBe(63);
    expect(ageInTaxYear(alex, 2027, NOW)).toBe(64);
    expect(ageInTaxYear(alex, 2030, NOW)).toBe(67);
    expect(taxYearOfAge(alex, 64, NOW)).toBe(2027);
    expect(taxYearOfAge(alex, 66, NOW)).toBe(2029);
  });
  it('a 1 March birthday reaches the next age inside the same tax year', () => {
    const s = { currentAge: 60, currentAgeAsOf: '2026-09-09', spStartDate: '1 March 2033' };   // born 1 Mar 1966
    expect(ageInTaxYear(s, 2027, NOW)).toBe(62);      // turns 61 in Mar 2027 and 62 in Mar 2028, inside 27/28
    expect(taxYearOfAge(s, 67, NOW)).toBe(2032);      // SP 1 Mar 2033 is in 2032/33
  });
  it('without a State Pension date the recorded date stands in for the birthday', () => {
    const s = { currentAge: 50, currentAgeAsOf: '2026-09-09' };
    expect(ageInTaxYear(s, 2026, NOW)).toBe(50);
    expect(ageInTaxYear(s, 2036, NOW)).toBe(60);
    expect(taxYearOfAge(s, 60, NOW)).toBe(2036);
  });
  it('no age recorded → null', () => {
    expect(ageOnDate({}, NOW, NOW)).toBeNull();
    expect(taxYearOfAge({ shapeAgeNow: 64 }, 64, NOW)).toBeNull();
  });
});

describe('migrateTiming — plans saved before 6.4.0', () => {
  // Re-written in 6.51.0 (research/plan-start.md §3, "How deriveTiming reads them"): next April is no longer THE retiree's
  // default — it is the default for a plan that does not say when work stopped (every plan saved before 6.51.0, so this
  // still holds byte for byte). A retiree who says when they stopped starts in that tax year: the case after this one.
  it("Alex's saved plan becomes: already retired, starts 2027/28 (no stop month: next April, as before)", () => {
    const m = migrateTiming(alex, null, NOW);
    expect(m.firstTaxYear).toBe(2027);
    expect(m.retired).toBe(true);
    expect(m.retireAge).toBeNull();
  });
  it('a retiree with a stop month starts in the tax year they stopped — a past one, never pulled forward', () => {
    const m = migrateTiming({ ...alex, stoppedWork: '2023-10' }, null, NOW);
    expect(m).toMatchObject({ firstTaxYear: 2023, retired: true, retireAge: null });
    // the month alone says whether work has stopped, when no flag is saved
    expect(migrateTiming({ currentAge: 50, currentAgeAsOf: '2026-09-09', stoppedWork: '2025-06' }, null, NOW)).toMatchObject({ retired: true, firstTaxYear: 2025 });
    expect(migrateTiming({ currentAge: 58, currentAgeAsOf: '2026-09-09', stoppedWork: '2029-06', retireAge: 61 }, null, NOW)).toMatchObject({ retired: false, firstTaxYear: 2029 });
  });
  it('a pre-retiree (age 50, steps from 60) becomes retire-at-60 → 2036/37', () => {
    const m = migrateTiming({ currentAge: 50, currentAgeAsOf: '2026-09-09', shapeAgeNow: 60 }, null, NOW);
    expect(m).toMatchObject({ firstTaxYear: 2036, retired: false, retireAge: 60 });
  });
  it('the Budget\'s flag decides when the start age is not clearly ahead; a clearly future age beats it', () => {
    const m = migrateTiming({ currentAge: 63, currentAgeAsOf: '2026-09-09', shapeAgeNow: 64 }, { retired: false }, NOW);
    expect(m).toMatchObject({ retired: false, retireAge: 64, firstTaxYear: 2027 });
    const f = migrateTiming({ currentAge: 50, currentAgeAsOf: '2026-09-09', shapeAgeNow: 60 }, { retired: true }, NOW);
    expect(f).toMatchObject({ retired: false, retireAge: 60, firstTaxYear: 2036 });
  });
  it('an explicit "retired" flag with no saved start means next April, whatever the old step age said', () => {
    const m = migrateTiming({ currentAge: 45, currentAgeAsOf: '2026-09-09', retired: true }, null, NOW);
    expect(m.firstTaxYear).toBe(2027);
  });
  it('steps starting at the age today keep the old implicit start (next April), relabelled to the age reached then', () => {
    const demo = { currentAge: 63, currentAgeAsOf: '2026-09-09', shapeAgeNow: 63 };
    const m = migrateTiming(demo, null, NOW);
    expect(m).toMatchObject({ firstTaxYear: 2027, retired: true });
    expect(deriveTiming(m, NOW).shapeAgeNow).toBe(64);
  });
  it('a start age already passed is pulled forward to next April', () => {
    const m = migrateTiming({ currentAge: 66, currentAgeAsOf: '2026-09-09', shapeAgeNow: 63 }, null, NOW);
    expect(m.firstTaxYear).toBe(2027);
    expect(m.retired).toBe(true);
  });
  it('no age today → untouched (legacy)', () => {
    const s = { shapeAgeNow: 64 };
    expect(migrateTiming(s, null, NOW)).toBe(s);
  });
  it('is idempotent', () => {
    const once = migrateTiming(alex, null, NOW);
    expect(migrateTiming(once, null, NOW)).toBe(once);
  });
});

describe('deriveTiming', () => {
  // Re-written in 6.51.0: "7 months of bridge" is what a retiree with no stop month still derives (next April); one who
  // says they stopped work starts in that tax year with no months before it — the two cases after this one.
  it('Alex without a stop month: retired, 2027/28, steps from 64, 7 months before the plan\'s income starts', () => {
    const t = deriveTiming(alex, NOW);
    expect(t.mode).toBe('retired');
    expect(t.firstTaxYear).toBe(2027);
    expect(t.shapeAgeNow).toBe(64);
    expect(t.yearsToStart).toBe(1);
    expect(t.bridgeMonths).toBe(7);
    expect(t.potScale).toEqual({ sipp: 1, isa: 1 });
  });
  it('a retiree with a stop month starts that tax year: plan year 3 now, nothing before the start, steps from the age then', () => {
    const t = deriveTiming({ ...alex, retired: true, stoppedWork: '2023-10' }, NOW);
    expect(t).toMatchObject({ mode: 'retired', firstTaxYear: 2023, shapeAgeNow: 60, yearsToStart: 0, bridgeMonths: 0, planYearNow: 3, elapsedYears: 3, monthsIntoYear: 5, stoppedWork: '2023-10' });
    // the years a retiree may choose from: the stop's to next April
    expect(t.startOptions).toEqual([2023, 2024, 2025, 2026, 2027]);
    // a later start is a choice that is kept (research/plan-start.md §2 D): the saved year wins over the stop's
    expect(deriveTiming({ ...alex, retired: true, stoppedWork: '2026-07', firstTaxYear: 2027 }, NOW)).toMatchObject({ firstTaxYear: 2027, bridgeMonths: 7, planYearNow: -1, elapsedYears: 0 });
  });
  it('a plan with no stop month carries no new key: its timing (and the document that spreads it) is what it was', () => {
    expect('stoppedWork' in deriveTiming(alex, NOW)).toBe(false);
    expect(deriveTiming({ ...alex, stoppedWork: 'soon' }, NOW)).toEqual(deriveTiming(alex, NOW));   // not a month: not said
  });
  it('stopping later in a month: that month opens the plan, and year 0 is its tax year', () => {
    const s = { currentAge: 58, currentAgeAsOf: '2026-09-09', retired: false, retireAge: 61, stoppedWork: '2029-06' };
    const t = deriveTiming(s, NOW);
    expect(t).toMatchObject({ mode: 'future', firstTaxYear: 2029, startMonth: '2029-06', retireAge: 61, planYearNow: -3, elapsedYears: 0 });
    // a month already past on a plan still saying "later" is not a stop to come: the age decides, as before
    expect(deriveTiming({ ...s, stoppedWork: '2025-06' }, NOW).startMonth).toBe(deriveTiming({ ...s, stoppedWork: undefined }, NOW).startMonth);
  });
  it('the month helpers: a month, its tax year (April opens one), stopped by this month', () => {
    expect(stoppedWorkOf({ stoppedWork: '2023-7' })).toBe('2023-07');
    expect(stoppedWorkOf({ stoppedWork: '2023-13' })).toBeNull();
    expect(stoppedWorkOf({})).toBeNull();
    expect([taxYearOfMonth('2024-03'), taxYearOfMonth('2024-04')]).toEqual([2023, 2024]);
    expect([hasStopped('2026-09', NOW), hasStopped('2026-10', NOW), hasStopped(null, NOW)]).toEqual([true, false, false]);
  });
  it('is date-stable: the same saved plan read on 15 Jan 2027 still starts 2027/28', () => {
    const saved = migrateTiming(alex, null, NOW);
    const t = deriveTiming(saved, new Date(2027, 0, 15));
    expect(t.firstTaxYear).toBe(2027);
    expect(t.shapeAgeNow).toBe(64);
  });
  it('a retiree may choose this tax year instead', () => {
    const t = deriveTiming({ ...alex, retired: true, firstTaxYear: 2026 }, NOW);
    expect(t.firstTaxYear).toBe(2026);
    expect(t.shapeAgeNow).toBe(63);
    expect(t.yearsToStart).toBe(0);
    expect(t.bridgeMonths).toBe(0);
  });
  // 6.13.5: this used to "fall forward to next April" (2027) — which is the April slide: a plan that started in
  // 2027/28 jumped to 2029/30 the day its second year began. A saved start is the plan's anchor for good.
  it('a saved start year in the past is kept: the plan is running, it does not start again next April', () => {
    const t = deriveTiming({ ...alex, retired: true, firstTaxYear: 2024 }, NOW);
    expect(t.firstTaxYear).toBe(2024);
    expect(t.yearsToStart).toBe(0);
    expect(t.bridgeMonths).toBe(0);
  });
  it('retire at 66 → 2029/30, three years out', () => {
    const t = deriveTiming({ ...alex, retired: false, retireAge: 66 }, NOW);
    expect(t).toMatchObject({ mode: 'future', firstTaxYear: 2029, shapeAgeNow: 66, yearsToStart: 3, retireAge: 66 });
  });
  it('a future retiree has a retirement MONTH as well as a plan tax year (59 in Sept, October birthday, retiring at 61)', () => {
    const s = { currentAge: 59, currentAgeAsOf: '2026-09-11', spStartDate: '20 October 2034', retired: false, retireAge: 61 };
    const t = deriveTiming(s, new Date(2026, 8, 11));
    expect(t.firstTaxYear).toBe(2027);          // 61 is reached in 2027/28 (20 Oct 2027)
    expect(t.startMonth).toBe('2027-10');       // but they retire in October, 13 months away
    expect(t.bridgeMonths).toBe(13);
    expect(describeTiming(t, s, new Date(2026, 8, 11))).toContain('You retire in October 2027 at 61, 13 months away; the plan\'s year 0 is tax year 2027/28');
    expect(deriveTiming({ ...alex, retired: true, firstTaxYear: 2027 }, NOW).startMonth).toBe('2027-04');
  });
  it('"retire at 60" when already 63 starts now', () => {
    const t = deriveTiming({ ...alex, retired: false, retireAge: 60 }, NOW);
    expect(t.firstTaxYear).toBe(2026);
  });
  it('legacy (no age today) is the pre-6.4.0 behaviour: the calendar year after today', () => {
    const t = deriveTiming({ shapeAgeNow: 64 }, NOW);
    expect(t).toMatchObject({ mode: 'legacy', firstTaxYear: 2027, shapeAgeNow: 64 });
    expect(deriveTiming({ shapeAgeNow: 60 }, new Date(2027, 0, 15)).firstTaxYear).toBe(2028);
    expect(deriveTiming({}, NOW).shapeAgeNow).toBe(57);   // the fallback a saved plan with no age relies on
  });
});

describe('pots at retirement (future mode)', () => {
  const pre = { currentAge: 50, currentAgeAsOf: '2026-09-09', retired: false, retireAge: 60, equityMin: 300000, bondMin: 150000, cashTarget: 50000, isaBalance: 100000 };
  it('potScale is 1 unless retiring later with a pot at retirement saved', () => {
    expect(potScaleOf(pre)).toEqual({ sipp: 1, isa: 1 });
    expect(potScaleOf({ ...pre, retired: true, potAtRetirement: { sipp: 1000000 } })).toEqual({ sipp: 1, isa: 1 });
    expect(potScaleOf({ ...pre, potAtRetirement: { sipp: 1000000, isa: 150000 } })).toEqual({ sipp: 2, isa: 1.5 });
  });
  it('projects from the Accumulation planner inputs at the middle band, in today\'s money', () => {
    const p = projectedPotAtRetirement(pre, { netMonthly: 800, salary: 60000, schemeType: 'ras', employerMonthly: 400 }, NOW);
    expect(p.source).toBe('accumulation');
    expect(p.years).toBe(10);
    expect(p.hasContributions).toBe(true);
    expect(p.sipp).toBeGreaterThan(500000 * Math.pow(1.05 / 1.025, 9));   // growth net of inflation plus contributions
    expect(p.low).toBeLessThan(p.sipp);
    expect(p.high).toBeGreaterThan(p.sipp);
    expect(p.isa).toBeGreaterThan(100000);
  });
  it('no contributions saved → growth only, flagged', () => {
    const p = projectedPotAtRetirement(pre, {}, NOW);
    expect(p.hasContributions).toBe(false);
    expect(p.sipp).toBeGreaterThan(500000);
  });
  it('retired → today\'s pots, source none', () => {
    expect(projectedPotAtRetirement(alex, {}, NOW).source).toBe('none');
  });
});

describe('describeTiming', () => {
  it('a started plan says where today stands; one that says when work stopped says that too; a later start says what the months are', () => {
    const c = deriveTiming({ ...alex, retired: true, stoppedWork: '2023-10' }, NOW);
    expect(describeTiming(c, { ...alex, stoppedWork: '2023-10' }, NOW)).toMatch(/^You stopped work in October 2023\. Plan started 6 April 2023 \(tax year 2023\/24\); today is plan year 3 of 30\./);
    const r = deriveTiming({ ...alex, retired: true, firstTaxYear: 2024 }, NOW);
    expect(describeTiming(r, alex, NOW)).toMatch(/^Plan started 6 April 2024 \(tax year 2024\/25\); today is plan year 2 of 30\./);
    const d = deriveTiming({ ...alex, retired: true, stoppedWork: '2026-07', firstTaxYear: 2027 }, NOW);
    expect(describeTiming(d, alex, NOW)).toContain('You stopped work in July 2026. Plan starts 6 April 2027 (tax year 2027/28), in 7 months.');
    expect(describeTiming(d, alex, NOW)).not.toMatch(/set aside|before the plan/);   // 7.3.3
  });
  it('the stop\'s tax year is named among the choices, and a saved year outside them is kept', () => {
    const t = deriveTiming({ ...alex, retired: true, stoppedWork: '2024-11' }, NOW);
    // 7.3.3: never a later year than this one
    expect(startYearChoices(t, 2024).map((c) => c.label)).toEqual(['2024/25 — the year you stopped work', '2025/26', 'this tax year — pick up from here — 2026/27']);
    const same = deriveTiming({ ...alex, retired: true, stoppedWork: '2026-06' }, NOW);
    expect(startYearChoices(same, null).map((c) => c.label)).toEqual(['2026/27 — the year you stopped work (this tax year)']);
    const outside = deriveTiming({ ...alex, retired: true, stoppedWork: '2024-11', firstTaxYear: 2022 }, NOW);
    expect(startYearChoices(outside, 2022)[0]).toEqual({ year: 2022, label: '2022/23 (saved)', saved: true });
  });
  it('reads like a sentence and names the State Pension plan year', () => {
    const s = migrateTiming(alex, null, NOW);
    const text = describeTiming(deriveTiming(s, NOW), s, NOW);
    expect(text).toContain('Plan starts 6 April 2027 (tax year 2027/28), in 7 months.');
    expect(text).toContain('Income steps start at age 64.');
    expect(text).toContain('State Pension from 2030/31 (plan year 3).');
    expect(text).toContain('Plan runs to age 93.');
  });
});
