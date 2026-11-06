/**
 * The rules of the input lists that are functions (step 4 brief 4.1; P0's first tests): which stop ages an A result
 * carries, B's grid, and whether a draft describes someone who has already stopped work.
 */
import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { agesToShow, gridToShow, alreadyStopped, statePensionAgeOf, spendLevelAMonth } from '../../../src/answers/shared/schemaParts.js';
import { RULES, SAVING } from '../../../src/answers/shared/rules.js';
import { SCHEMA_A } from '../a/_a.js';
import { SCHEMA_B } from '../b/_b.js';
import { checkInputs } from '../../../src/answers/shared/validate.js';

const TODAY = '2026-09-30';
const ENV = { today: TODAY };
const a = (age, stopAge, extra = {}) => checkInputs(SCHEMA_A, { you: { pot: 250000, age }, stop: stopAge === null ? { kind: 'ages' } : { age: stopAge }, spend: { amount: 2000 }, ...extra }, ENV).inputs;
const b = (age, stopAge, payIn = 700, extra = {}) => checkInputs(SCHEMA_B, { you: { pot: 120000, age, payIn: { total: payIn } }, stop: { age: stopAge }, spend: { amount: 2000 }, ...extra }, ENV).inputs;
const sortedUnique = (list) => [...new Set(list)].sort((x, y) => x - y);

describe('agesToShow — the chart\'s seven ages (conflict 31)', () => {
  it('a named age: the age, two before, two after, five on, and the State Pension age', () => {
    expect(agesToShow(a(50, 60), ENV, 'chart')).toEqual([58, 59, 60, 61, 62, 65, 67]);
    expect(statePensionAgeOf(50, TODAY)).toBe(67);
  });
  it('is clipped to today\'s age and 75, sorted, with no repeats', () => {
    expect(agesToShow(a(40, 40), ENV, 'chart')).toEqual([40, 41, 42, 45, 68]);          // nothing before today; State Pension age 68 at 40
    expect(agesToShow(a(50, 50), ENV, 'chart')).toEqual([50, 51, 52, 55, 67]);
    expect(agesToShow(a(74, 74), ENV, 'chart')).toEqual([74, 75]);                       // 76, 79 and 66 fall away
    expect(agesToShow(a(75, 75), ENV, 'chart')).toEqual([75]);
    expect(agesToShow(a(50, 75), ENV, 'chart')).toEqual([67, 73, 74, 75]);
    expect(agesToShow(a(60, 66), ENV, 'chart')).toEqual([64, 65, 66, 67, 68, 71]);       // 67 is both "one after" and the State Pension age: once
    expect(agesToShow(a(50, 60), ENV)).toEqual(agesToShow(a(50, 60), ENV, 'chart'));   // 'chart' is the default
  });
  it('"show me ages": today\'s age, 55, 57, 60, 62, 65, 67, the State Pension age and the earliest age that worked', () => {
    expect(agesToShow(a(50, null), ENV, 'chart', null)).toEqual([50, 55, 57, 60, 62, 65, 67]);
    expect(agesToShow(a(50, null), ENV, 'chart', 61)).toEqual([50, 55, 57, 60, 61, 62, 65, 67]);
    expect(agesToShow(a(40, null), ENV, 'chart', 63)).toEqual([40, 55, 57, 60, 62, 63, 65, 67, 68]);
    expect(agesToShow(a(58, null), ENV, 'chart', null)).toEqual([58, 60, 62, 65, 67]);
    expect(agesToShow(a(74, null), ENV, 'chart', 75)).toEqual([74, 75]);
    expect(agesToShow(a(75, null), ENV, 'chart', null)).toEqual([75]);
  });
  it('"all": every whole age from max(today\'s age, 50) to 75, and today\'s age', () => {
    const from50 = []; for (let x = 50; x <= 75; x++) from50.push(x);
    expect(agesToShow(a(40, 60), ENV, 'all')).toEqual([40, ...from50]);
    expect(agesToShow(a(40, 45), ENV, 'all')).toEqual([40, 45, ...from50]);   // the named age is always a row, even under 50
    expect(agesToShow(a(50, 60), ENV, 'all')).toEqual(from50);
    expect(agesToShow(a(58, null), ENV, 'all')).toEqual(from50.filter((x) => x >= 58));
    expect(agesToShow(a(74, 74), ENV, 'all')).toEqual([74, 75]);
    expect(agesToShow(a(75, 75), ENV, 'all')).toEqual([75]);
  });
  it('tests may pass env.ages: exactly those ages, clipped the same way', () => {
    expect(agesToShow(a(50, 60), { ...ENV, ages: [62, 60, 58, 60] }, 'chart')).toEqual([58, 60, 62]);
    expect(agesToShow(a(50, 60), { ...ENV, ages: [40, 80, 70] }, 'all')).toEqual([70]);
  });
  it('the State Pension age moves with the age today (the birthday taken as today)', () => {
    expect(statePensionAgeOf(66, TODAY)).toBe(66);
    expect(statePensionAgeOf(65, TODAY)).toBe(67);
    expect(statePensionAgeOf(50, TODAY)).toBe(67);
    expect(statePensionAgeOf(49, TODAY)).toBe(68);                 // born 30 Sep 1977: 67 and 6 months, counted as 68 (the later age)
    expect(statePensionAgeOf(48, TODAY)).toBe(68);
    expect(agesToShow(a(48, 60), ENV, 'chart')).toEqual([58, 59, 60, 61, 62, 65, 68]);
  });
  it('any inputs: whole ages, sorted, no repeats, within [today\'s age, 75]; the named age is always a row', () => {
    fc.assert(fc.property(fc.integer({ min: 18, max: 100 }), fc.integer({ min: 18, max: 75 }), fc.constantFrom('chart', 'all'), (age, stop, detail) => {
      const stopAge = Math.max(age, stop);
      if (stopAge > 75) return;
      const inputs = a(age, stopAge);
      const rows = agesToShow(inputs, ENV, detail);
      expect(rows).toEqual(sortedUnique(rows));
      for (const r of rows) { expect(Number.isInteger(r)).toBe(true); expect(r).toBeGreaterThanOrEqual(age); expect(r).toBeLessThanOrEqual(RULES.stopAgeMax); }
      expect(rows).toContain(stopAge);
      expect(rows).toContain(age === stopAge ? age : rows[0]);
      if (detail === 'chart') expect(rows.length).toBeLessThanOrEqual(7);
    }), { numRuns: 300 });
  });
  it('is pure and copes with nothing', () => {
    expect(agesToShow(null, ENV)).toEqual([]);
    expect(agesToShow({}, ENV)).toEqual([]);
    const inputs = a(50, 60);
    const before = JSON.stringify(inputs);
    agesToShow(inputs, ENV, 'all');
    expect(JSON.stringify(inputs)).toBe(before);
  });
});

describe('gridToShow — B\'s rows and columns (conflict 37)', () => {
  it('rows: the stop age, two before and five after, within 75 and after today\'s age', () => {
    expect(gridToShow(b(50, 60), ENV).ages).toEqual([58, 59, 60, 61, 62, 63, 64, 65]);
    expect(gridToShow(b(50, 51), ENV).ages).toEqual([51, 52, 53, 54, 55, 56]);       // nothing at or before today's age
    expect(gridToShow(b(50, 74), ENV).ages).toEqual([72, 73, 74, 75]);
    expect(gridToShow(b(74, 75), ENV).ages).toEqual([75]);
    expect(gridToShow(b(40, 55), ENV).ages).toEqual([53, 54, 55, 56, 57, 58, 59, 60]);
  });
  it('columns: today\'s pay-in and four steps of £100, £50 under £500, never above the ceiling', () => {
    expect(gridToShow(b(50, 60, 700), ENV).payIns).toEqual([700, 800, 900, 1000, 1100]);
    expect(gridToShow(b(50, 60, 500), ENV).payIns).toEqual([500, 600, 700, 800, 900]);
    expect(gridToShow(b(50, 60, 499), ENV).payIns).toEqual([499, 549, 599, 649, 699]);
    expect(gridToShow(b(50, 60, 0), ENV).payIns).toEqual([0, 50, 100, 150, 200]);
    expect(gridToShow(b(50, 60, SAVING.payInCeiling), ENV).payIns).toEqual([10000]);
    expect(gridToShow(b(50, 60, 9850), ENV).payIns).toEqual([9850, 9950]);
  });
  it('today\'s pay-in is the household\'s: own + employer when split, both people for a couple', () => {
    expect(gridToShow(b(50, 60, 0, { you: { pot: 120000, age: 50, payIn: { kind: 'split', own: 450, employer: 250 } } }), ENV).payIns[0]).toBe(700);
    expect(gridToShow(b(50, 60, 700, { household: 'couple', partner: { age: 48, payIn: { total: 300 } } }), ENV).payIns[0]).toBe(1000);
  });
  it('any inputs: rows whole, sorted, no repeats, after today\'s age and within 75, the stop age among them; columns rising', () => {
    fc.assert(fc.property(fc.integer({ min: 18, max: 74 }), fc.integer({ min: 1, max: 57 }), fc.integer({ min: 0, max: 10000 }), (age, later, payIn) => {
      const stop = Math.min(75, age + later);
      const g = gridToShow(b(age, stop, payIn), ENV);
      expect(g.ages).toEqual(sortedUnique(g.ages));
      for (const r of g.ages) { expect(r).toBeGreaterThan(age); expect(r).toBeLessThanOrEqual(75); }
      expect(g.ages).toContain(stop);
      expect(g.ages.length).toBeLessThanOrEqual(8);
      expect(g.payIns[0]).toBe(payIn);
      expect(g.payIns.length).toBeLessThanOrEqual(5);
      g.payIns.forEach((p, j) => { if (j > 0) expect(p).toBe(g.payIns[j - 1] + (payIn < 500 ? 50 : 100)); expect(p).toBeLessThanOrEqual(SAVING.payInCeiling); });
    }), { numRuns: 300 });
  });
  it('copes with nothing', () => {
    expect(gridToShow(null, ENV)).toEqual({ ages: [], payIns: [] });
  });
});

describe('alreadyStopped — the retired view\'s rule (conflict 44)', () => {
  it('stop now at or past the State Pension age is retired; a stop in the future never is', () => {
    expect(alreadyStopped(a(66, 66), TODAY)).toBe(true);
    expect(alreadyStopped(a(67, 67), TODAY)).toBe(true);
    expect(alreadyStopped(a(68, 68), TODAY)).toBe(true);
    expect(alreadyStopped(a(65, 65), TODAY)).toBe(false);          // State Pension age 67 for someone 65 today
    expect(alreadyStopped(a(66, 67), TODAY)).toBe(false);          // still working until 67
    expect(alreadyStopped(a(70, 72), TODAY)).toBe(false);
    expect(alreadyStopped(a(50, 50), TODAY)).toBe(false);
  });
  it('either side of the birthday rule: a person of 66 today is retired when born before 6 March 1961, not from then', () => {
    expect(alreadyStopped(a(66, 66), '2027-03-05')).toBe(true);    // born 5 March 1961: State Pension age 66 and 11 months, counted as 66
    expect(alreadyStopped(a(66, 66), '2027-03-06')).toBe(false);   // born 6 March 1961: 67
    expect(alreadyStopped(a(67, 67), '2027-03-06')).toBe(true);
    expect(alreadyStopped(a(66, 66), '2026-04-05')).toBe(true);    // born 5 April 1960: 66
    expect(alreadyStopped(a(66, 66), '2026-04-06')).toBe(true);    // born 6 April 1960: 66 and 1 month, counted as 66
  });
  it('"show me ages" and a stop before today\'s age are never retired; a missing draft is not', () => {
    expect(alreadyStopped(a(70, null), TODAY)).toBe(false);
    expect(alreadyStopped({ you: { age: 70 }, stop: { age: 60 } }, TODAY)).toBe(true);   // the draft says stopped and past State Pension age (the rule is not the validation)
    expect(alreadyStopped(null, TODAY)).toBe(false);
    expect(alreadyStopped({}, TODAY)).toBe(false);
    expect(alreadyStopped(a(66, 66), undefined)).toBe(false);
  });
  it('B\'s inputs read the same way (a stop after today is never retired)', () => {
    expect(alreadyStopped(b(66, 67), TODAY)).toBe(false);
    expect(alreadyStopped({ you: { age: 68 }, stop: { age: 68 } }, TODAY)).toBe(true);
  });
});

describe('spendLevelAMonth', () => {
  it('is RULES.plsa ÷ 12 to the pound', () => {
    for (const h of ['single', 'couple']) for (const l of ['minimum', 'moderate', 'comfortable']) expect(spendLevelAMonth(h, l)).toBe(Math.round(RULES.plsa[h][l] / 12));
    expect(spendLevelAMonth('other', 'minimum')).toBe(1200);   // anything but a couple is one person
  });
});
