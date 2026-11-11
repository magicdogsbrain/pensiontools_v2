/**
 * The ONS life table the chance of the money lasting is weighted by (src/data/onsCohort2024.json, built by
 * scripts/ons-cohort.py from ONS ewppp24qx.xlsx; research/v7/ons-life-tables.md).
 *
 * Every expected figure here was worked out from the raw ONS workbooks (sha256 in the provenance note): the cells read
 * straight from ewppp24qx.xlsx and ewppp24ex.xlsx; the ages worked out by the build script's own check (Python, from the
 * file as stored), which this JavaScript model must agree with.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { LIFE_TABLE, HORIZON, q, survival, jointSurvival, horizonYears, horizonEndAge, weightToAge, sexKey } from '../src/services/LongevityModel.js';

const FILE = 'src/data/onsCohort2024.json';                     // vitest runs from the repo root

/** Exact age (deaths spread evenly in a year of age) at which the joint survival from 65 falls to p: halving to 1e-9. */
function ageAt(people, p) {
  let lo = 0, hi = 60;
  for (let k = 0; k < 60; k++) { const mid = (lo + hi) / 2; if (jointSurvival(people, mid) <= p) hi = mid; else lo = mid; }
  return people[0].age + hi;
}

/** Complete expectation of life from x0: the area under the survival line to the file's close (everyone dead at 112). */
function eFrom(x0, by, sex) {
  let e = 0;
  for (let x = x0; x < LIFE_TABLE.ageTo + 2; x++) e += (survival(x0, by, sex, x - x0) + survival(x0, by, sex, x + 1 - x0)) / 2;
  return e;
}

describe('the data file', () => {
  it('names its source and edition, and keeps every year of birth 1935-2008 from max(18, 2025 - year of birth) to 110', () => {
    expect(LIFE_TABLE.edition).toBe('2024-based');
    expect(LIFE_TABLE.region).toBe('England and Wales');
    expect(LIFE_TABLE.published).toBe('2026-05-15');
    expect(LIFE_TABLE.retrieved).toBe('2026-11-11');
    expect(LIFE_TABLE.tablesVersion).toBe('ons-ew-2024-cohort/1');
    expect(LIFE_TABLE.scale).toBe(1e7);
    expect([LIFE_TABLE.firstBirthYear, LIFE_TABLE.lastBirthYear, LIFE_TABLE.ageTo]).toEqual([1935, 2008, 110]);
    expect(LIFE_TABLE.notes).toHaveLength(5);
    for (const s of ['m', 'f']) {
      expect(Object.keys(LIFE_TABLE[s])).toHaveLength(2008 - 1935 + 1);
      for (let b = 1935; b <= 2008; b++) {
        const line = LIFE_TABLE[s][String(b)];
        const from = Math.max(18, 2025 - b);
        expect(line[0]).toBe(from);
        expect(line.length).toBe(1 + 110 - from + 1);
        for (const v of line.slice(1)) expect(Number.isInteger(v) && v > 0 && v < 1e7).toBe(true);
      }
    }
  });

  it('is small enough to load with the page: under 64 KB, about 31 KB gzipped', () => {
    // The spec guessed 52 KB; as built (8,508 whole numbers, most of 6 or 7 figures) it is 62,437 bytes.
    const raw = readFileSync(FILE);
    expect(raw.length).toBeLessThan(64 * 1024);
    expect(gzipSync(raw).length).toBeLessThan(32 * 1024);
  });

  it('twelve cells exactly as ONS publishes them (ewppp24qx.xlsx, per 100,000)', () => {
    // [sheet, column, cell, age, year of birth, sex, ONS qx per 100,000]
    const cells = [
      ['males cohort qx', 'Year of birth 2000', 'U31', 26, 2000, 'm', 55.83],
      ['females cohort qx', 'Year of birth 2008', 'AC23', 18, 2008, 'f', 17.76],
      ['males cohort qx', 'Year of birth 1981', 'B50', 45, 1981, 'm', 208.58],
      ['females cohort qx', 'Year of birth 1990', 'K75', 70, 1990, 'f', 797.44],
      ['females cohort qx', 'Year of birth 1995', 'P35', 30, 1995, 'f', 32.95],
      // before 1981 a cohort is read off the period sheet on the diagonal: calendar year = year of birth + age
      ['males period qx', 'Year 2025', 'AT70', 65, 1960, 'm', 1141.98],
      ['females period qx', 'Year 2025', 'AT70', 65, 1960, 'f', 733.68],
      ['males period qx', 'Year 2046', 'BO85', 80, 1966, 'm', 3992.04],
      ['females period qx', 'Year 2056', 'BY95', 90, 1966, 'f', 9253.91],
      ['males period qx', 'Year 2025', 'AT95', 90, 1935, 'm', 15561.64],
      ['females period qx', 'Year 2050', 'BS105', 100, 1950, 'f', 32700.12],
      ['males period qx', 'Year 2074', 'CQ105', 100, 1974, 'm', 33833.2]
    ];
    for (const [sheet, col, cell, age, by, sex, per100k] of cells) {
      const got = q(age, by, sex);
      expect(Math.abs(got - per100k / 1e5), `${sheet} ${col} ${cell}`).toBeLessThan(1e-12);
      const line = LIFE_TABLE[sex][String(by)];
      expect(line[1 + age - line[0]], `${sheet} ${cell} as stored`).toBe(Math.round(per100k * 100));
    }
  });
});

describe('the reading rules', () => {
  it('clamps: born after 2008 reads 2008, before 1935 reads 1935; below a line\'s first age its first; above 110 a certain death', () => {
    expect(q(18, 2015, 'm')).toBe(q(18, 2008, 'm'));
    expect(q(95, 1930, 'f')).toBe(q(95, 1935, 'f'));
    expect(q(60, 1935, 'f')).toBe(q(90, 1935, 'f'));          // 1935's line starts at 90 (calendar 2025)
    expect(q(10, 2008, 'm')).toBe(q(18, 2008, 'm'));
    expect(q(111, 1960, 'm')).toBe(1);
    expect(q(110, 1960, 'm')).toBeLessThan(1);
    expect(survival(110, 1960, 'f', 2)).toBe(0);
  });
  it('a year of birth with a fraction reads on a straight line between the two years either side', () => {
    for (const [age, sex] of [[70, 'm'], [85, 'f'], [40, 'f']]) {
      const a = q(age, 1960, sex), b = q(age, 1961, sex);
      expect(q(age, 1960.25, sex)).toBeCloseTo(a + (b - a) * 0.25, 15);
    }
  });
  it('deaths are spread evenly within a year of age: S(x+u to x+u+f) = (1 - (u+f)q) / (1 - uq)', () => {
    const qq = q(70, 1960, 'm');
    expect(survival(70.25, 1960, 'm', 0.5)).toBeCloseTo((1 - 0.75 * qq) / (1 - 0.25 * qq), 15);
    expect(survival(70, 1960, 'm', 1)).toBeCloseTo(1 - qq, 15);
    expect(survival(70, 1960, 'm', 2)).toBeCloseTo((1 - qq) * (1 - q(71, 1960, 'm')), 15);
  });
  it('sex: men\'s figures for "male", women\'s for "female" and for not said', () => {
    expect(['m', 'male', 'f', 'female', 'notSaid', undefined].map((s) => sexKey(s))).toEqual(['m', 'm', 'f', 'f', 'f', 'f']);
    expect(sexKey(undefined, 'm')).toBe('m');
    expect(sexKey('notSaid', 'm')).toBe('f');
  });
  it('q rises with age from 30 on every line; women\'s q is never above men\'s', () => {
    for (const s of ['m', 'f']) {
      for (let b = 1935; b <= 2008; b++) {
        for (let x = Math.max(30, LIFE_TABLE[s][String(b)][0]); x < 110; x++) expect(q(x + 1, b, s) >= q(x, b, s), `${s} ${b} ${x}`).toBe(true);
      }
    }
    for (let b = 1935; b <= 2008; b++) for (let x = LIFE_TABLE.m[String(b)][0]; x <= 110; x++) expect(q(x, b, 'f') <= q(x, b, 'm'), `${b} ${x}`).toBe(true);
  });
});

describe('ages worked from the file, against ONS', () => {
  it('life expectancy at 65 matches the ONS cohort table (ewppp24ex.xlsx) within 0.1 years', () => {
    // [year of birth, sex, ONS cohort ex at 65 (column = calendar year at 65, row 70)]
    const ons = [[1960, 'm', 20.18], [1960, 'f', 22.9], [1966, 'm', 20.62], [1966, 'f', 23.39]];
    for (const [by, sex, e] of ons) expect(Math.abs(eFrom(65, by, sex) - e), `${by} ${sex}`).toBeLessThan(0.1);
    // and to the build script's own check, to 0.001
    expect(eFrom(65, 1960, 'm')).toBeCloseTo(20.179, 3);
    expect(eFrom(65, 1966, 'f')).toBeCloseTo(23.393, 3);
  });
  it('the age 1 in 10 people of 65 live beyond, and 1 in 50', () => {
    const one = (by, sex) => [{ age: 65, by, sex }];
    for (const [by, sex, p10] of [[1960, 'm', 96.36], [1960, 'f', 98.57], [1966, 'm', 96.84], [1966, 'f', 98.98]]) {
      expect(Math.abs(ageAt(one(by, sex), 0.10) - p10), `${by} ${sex}`).toBeLessThan(0.01);
    }
    expect(Math.abs(ageAt(one(1960, 'm'), 0.02) - 100.83)).toBeLessThan(0.01);
    expect(Math.abs(ageAt(one(1960, 'f'), 0.02) - 102.78)).toBeLessThan(0.01);
  });
  it('a couple both born 1961, at 65: one of them alive at 1 in 10 to 99.8 (a man and a woman), 100.6 (two women)', () => {
    const mf = [{ age: 65, by: 1961, sex: 'm' }, { age: 65, by: 1961, sex: 'f' }];
    const ff = [{ age: 65, by: 1961, sex: 'f' }, { age: 65, by: 1961, sex: 'f' }];
    expect(Math.abs(ageAt(mf, 0.10) - 99.78)).toBeLessThan(0.01);
    expect(Math.abs(ageAt(ff, 0.10) - 100.64)).toBeLessThan(0.01);
  });
  it('joint survival is never below either person\'s own', () => {
    const pairs = [[{ age: 65, by: 1961, sex: 'm' }, { age: 62, by: 1964, sex: 'f' }], [{ age: 80, by: 1946, sex: 'm' }, { age: 50, by: 1976, sex: 'f' }]];
    for (const [a, b] of pairs) {
      for (let t = 0; t <= 50; t += 0.5) {
        const j = jointSurvival([a, b], t);
        expect(j).toBeGreaterThanOrEqual(jointSurvival([a], t));
        expect(j).toBeGreaterThanOrEqual(jointSurvival([b], t) - 1e-15);   // the second added: to the last binary places
      }
    }
  });
  it('conditioned on the drawing start: from d, a 40-year-old\'s line is the same person\'s at 40 + d', () => {
    const at40 = [{ age: 40, by: 1986, sex: 'f' }];
    const at66 = [{ age: 66, by: 1986, sex: 'f' }];
    for (const t of [26.5, 30, 41.25]) expect(jointSurvival(at40, t, 26)).toBeCloseTo(jointSurvival(at66, t - 26), 14);
    expect(horizonYears(at40, 0.10, 26)).toBeCloseTo(26 + horizonYears(at66, 0.10), 12);
  });
});

describe('the two ages', () => {
  const TODAY = '2026-11-11';
  it('horizonYears is the first whole month after the start at or below the share (as a month-by-month count finds it)', () => {
    const cases = [[[{ age: 66, sex: 'm' }], 0], [[{ age: 66, sex: 'f' }, { age: 63, sex: 'f' }], 0], [[{ age: 40, sex: 'm' }], 20], [[{ age: 99, sex: 'f' }], 0]];
    for (const [people, d] of cases) {
      const ps = people.map((p) => ({ ...p, by: 2026 - p.age }));
      for (const share of [HORIZON.planToShare, HORIZON.weightShare]) {
        let m = 1;
        while (jointSurvival(ps, d + m / 12, d) > share) m++;
        expect(horizonYears(ps, share, d)).toBe(d + m / 12);
      }
    }
  });
  it('a single person of 66: plan to 97 (a man) or 99 (a woman); followed on to 101 or 103', () => {
    expect(horizonEndAge({ people: [{ age: 66, sex: 'male' }], today: TODAY })).toBe(97);
    expect(weightToAge({ people: [{ age: 66, sex: 'male' }], today: TODAY })).toBe(101);
    expect(horizonEndAge({ people: [{ age: 66, sex: 'female' }], today: TODAY })).toBe(99);
    expect(weightToAge({ people: [{ age: 66, sex: 'female' }], today: TODAY })).toBe(103);
    // not said reads the women's figures
    expect(horizonEndAge({ people: [{ age: 66, sex: 'notSaid' }], today: TODAY })).toBe(99);
  });
  it('a couple 15 years apart (Alex 80, a man; Sam 65, a woman): the joint age is the younger alone, plan to 99', () => {
    const people = [{ age: 80, sex: 'm' }, { age: 65, sex: 'f' }];
    expect(horizonEndAge({ people, today: TODAY })).toBe(99);
    expect(horizonEndAge({ people: [people[1]], today: TODAY })).toBe(99);
    const ps = [{ age: 80, by: 1946, sex: 'm' }, { age: 65, by: 1961, sex: 'f' }];
    const t = horizonYears(ps, 0.10);
    expect(jointSurvival(ps, t) - jointSurvival([ps[1]], t)).toBeLessThan(1e-3);
  });
  it('no clamp inversion: the plan-to age is at least 5 years after the start (up to 105), and neither age passes 105', () => {
    for (let age = 18; age <= 100; age++) {
      for (const sex of ['m', 'f']) {
        for (const d of [0, Math.max(0, 60 - age)]) {
          const people = [{ age, sex }];
          const planTo = horizonEndAge({ people, today: TODAY, d });
          const w = weightToAge({ people, today: TODAY, d });
          expect(planTo, `${age} ${sex} d${d}`).toBeGreaterThanOrEqual(Math.min(105, age + d + 5));
          expect(planTo).toBeLessThanOrEqual(105);
          expect(w).toBeLessThanOrEqual(105);
          expect(w).toBeGreaterThan(age + d);
        }
      }
    }
  });
  it('a table where nobody dies never reaches either share: both ages are 105', () => {
    const immortal = { ...LIFE_TABLE, m: Object.fromEntries(Object.entries(LIFE_TABLE.m).map(([b, l]) => [b, [l[0], ...l.slice(1).map(() => 0)]])), ageTo: 200 };
    immortal.f = immortal.m;
    expect(horizonYears([{ age: 66, by: 1960, sex: 'm' }], 0.1, 0, immortal)).toBe(Infinity);
    expect(horizonEndAge({ people: [{ age: 66, sex: 'm' }], today: TODAY, table: immortal })).toBe(105);
    expect(weightToAge({ people: [{ age: 66, sex: 'm' }], today: TODAY, table: immortal })).toBe(105);
  });
});
