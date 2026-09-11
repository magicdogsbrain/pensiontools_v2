import { describe, it, expect } from 'vitest';
import {
  taxYearStartOf, taxYearLabel, taxYearKey, planYearOf, ageOnDate, ageInTaxYear, taxYearOfAge,
  migrateTiming, deriveTiming, potScaleOf, projectedPotAtRetirement, describeTiming
} from '../src/services/PlanTiming.js';

// Chris: born 21 April 1970; age 56 recorded on 9 Sep 2026; State Pension 21 April 2037.
const NOW = new Date(2026, 8, 9);
const chris = { currentAge: 56, currentAgeAsOf: '2026-09-09', spStartDate: '21 April 2037', spWeeklyAmount: 230, shapeAgeNow: 57, duration: 35 };

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
  it("Chris is 57 in 2027/28 and 67 in 2037/38 — the State Pension year", () => {
    expect(ageOnDate(chris, NOW, NOW)).toBe(56);
    expect(ageInTaxYear(chris, 2026, NOW)).toBe(56);
    expect(ageInTaxYear(chris, 2027, NOW)).toBe(57);
    expect(ageInTaxYear(chris, 2037, NOW)).toBe(67);
    expect(taxYearOfAge(chris, 57, NOW)).toBe(2027);
    expect(taxYearOfAge(chris, 60, NOW)).toBe(2030);
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
    expect(taxYearOfAge({ shapeAgeNow: 57 }, 57, NOW)).toBeNull();
  });
});

describe('migrateTiming — plans saved before 6.4.0', () => {
  it("Chris's saved plan becomes: already retired, starts 2027/28", () => {
    const m = migrateTiming(chris, null, NOW);
    expect(m.firstTaxYear).toBe(2027);
    expect(m.retired).toBe(true);
    expect(m.retireAge).toBeNull();
  });
  it('a pre-retiree (age 50, steps from 60) becomes retire-at-60 → 2036/37', () => {
    const m = migrateTiming({ currentAge: 50, currentAgeAsOf: '2026-09-09', shapeAgeNow: 60 }, null, NOW);
    expect(m).toMatchObject({ firstTaxYear: 2036, retired: false, retireAge: 60 });
  });
  it('the Budget\'s flag decides when the start age is not clearly ahead; a clearly future age beats it', () => {
    const m = migrateTiming({ currentAge: 56, currentAgeAsOf: '2026-09-09', shapeAgeNow: 57 }, { retired: false }, NOW);
    expect(m).toMatchObject({ retired: false, retireAge: 57, firstTaxYear: 2027 });
    const f = migrateTiming({ currentAge: 50, currentAgeAsOf: '2026-09-09', shapeAgeNow: 60 }, { retired: true }, NOW);
    expect(f).toMatchObject({ retired: false, retireAge: 60, firstTaxYear: 2036 });
  });
  it('an explicit "retired" flag with no saved start means next April, whatever the old step age said', () => {
    const m = migrateTiming({ currentAge: 45, currentAgeAsOf: '2026-09-09', retired: true }, null, NOW);
    expect(m.firstTaxYear).toBe(2027);
  });
  it('steps starting at the age today keep the old implicit start (next April), relabelled to the age reached then', () => {
    const demo = { currentAge: 56, currentAgeAsOf: '2026-09-09', shapeAgeNow: 56 };
    const m = migrateTiming(demo, null, NOW);
    expect(m).toMatchObject({ firstTaxYear: 2027, retired: true });
    expect(deriveTiming(m, NOW).shapeAgeNow).toBe(57);
  });
  it('a start age already passed is pulled forward to next April', () => {
    const m = migrateTiming({ currentAge: 60, currentAgeAsOf: '2026-09-09', shapeAgeNow: 57 }, null, NOW);
    expect(m.firstTaxYear).toBe(2027);
    expect(m.retired).toBe(true);
  });
  it('no age today → untouched (legacy)', () => {
    const s = { shapeAgeNow: 57 };
    expect(migrateTiming(s, null, NOW)).toBe(s);
  });
  it('is idempotent', () => {
    const once = migrateTiming(chris, null, NOW);
    expect(migrateTiming(once, null, NOW)).toBe(once);
  });
});

describe('deriveTiming', () => {
  it('Chris: retired, 2027/28, steps from 57, 7 months of bridge', () => {
    const t = deriveTiming(chris, NOW);
    expect(t.mode).toBe('retired');
    expect(t.firstTaxYear).toBe(2027);
    expect(t.shapeAgeNow).toBe(57);
    expect(t.yearsToStart).toBe(1);
    expect(t.bridgeMonths).toBe(7);
    expect(t.potScale).toEqual({ sipp: 1, isa: 1 });
  });
  it('is date-stable: the same saved plan read on 15 Jan 2027 still starts 2027/28', () => {
    const saved = migrateTiming(chris, null, NOW);
    const t = deriveTiming(saved, new Date(2027, 0, 15));
    expect(t.firstTaxYear).toBe(2027);
    expect(t.shapeAgeNow).toBe(57);
  });
  it('a retiree may choose this tax year instead', () => {
    const t = deriveTiming({ ...chris, retired: true, firstTaxYear: 2026 }, NOW);
    expect(t.firstTaxYear).toBe(2026);
    expect(t.shapeAgeNow).toBe(56);
    expect(t.yearsToStart).toBe(0);
    expect(t.bridgeMonths).toBe(0);
  });
  it('a saved start year in the past falls forward to next April', () => {
    expect(deriveTiming({ ...chris, retired: true, firstTaxYear: 2024 }, NOW).firstTaxYear).toBe(2027);
  });
  it('retire at 60 → 2030/31, four years out', () => {
    const t = deriveTiming({ ...chris, retired: false, retireAge: 60 }, NOW);
    expect(t).toMatchObject({ mode: 'future', firstTaxYear: 2030, shapeAgeNow: 60, yearsToStart: 4, retireAge: 60 });
  });
  it('a future retiree has a retirement MONTH as well as a plan tax year (59 in Sept, October birthday, retiring at 61)', () => {
    const s = { currentAge: 59, currentAgeAsOf: '2026-09-11', spStartDate: '20 October 2034', retired: false, retireAge: 61 };
    const t = deriveTiming(s, new Date(2026, 8, 11));
    expect(t.firstTaxYear).toBe(2027);          // 61 is reached in 2027/28 (20 Oct 2027)
    expect(t.startMonth).toBe('2027-10');       // but they retire in October, 13 months away
    expect(t.bridgeMonths).toBe(13);
    expect(describeTiming(t, s, new Date(2026, 8, 11))).toContain('You retire in October 2027 at 61, 13 months away; the plan\'s year 0 is tax year 2027/28');
    expect(deriveTiming({ ...chris, retired: true, firstTaxYear: 2027 }, NOW).startMonth).toBe('2027-04');
  });
  it('"retire at 55" when already 56 starts now', () => {
    const t = deriveTiming({ ...chris, retired: false, retireAge: 55 }, NOW);
    expect(t.firstTaxYear).toBe(2026);
  });
  it('legacy (no age today) is the pre-6.4.0 behaviour: the calendar year after today', () => {
    const t = deriveTiming({ shapeAgeNow: 57 }, NOW);
    expect(t).toMatchObject({ mode: 'legacy', firstTaxYear: 2027, shapeAgeNow: 57 });
    expect(deriveTiming({ shapeAgeNow: 60 }, new Date(2027, 0, 15)).firstTaxYear).toBe(2028);
    expect(deriveTiming({}, NOW).shapeAgeNow).toBe(57);
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
    expect(projectedPotAtRetirement(chris, {}, NOW).source).toBe('none');
  });
});

describe('describeTiming', () => {
  it('reads like a sentence and names the State Pension plan year', () => {
    const s = migrateTiming(chris, null, NOW);
    const text = describeTiming(deriveTiming(s, NOW), s, NOW);
    expect(text).toContain('Plan starts 6 April 2027 (tax year 2027/28), in 7 months.');
    expect(text).toContain('Income steps start at age 57.');
    expect(text).toContain('State Pension from 2037/38 (plan year 10).');
    expect(text).toContain('Plan runs to age 91.');
  });
});
