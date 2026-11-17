/**
 * A ladder's month reads the months already recorded (7.12.0): what is still to pay this tax year is the year's need less
 * what the recorded months before this one took, over the calendar months from this one to March. One figure for the
 * month in the Decision tool's box, its "Where this month comes from", Month by month and "Where you are".
 *
 * Fictional Alex, 64: a ladder paying £30,000 a year from cash in 2026/27, 2027/28 and 2028/29. April and May 2026 are
 * recorded at £2,500 each (30,000 ÷ 12). By hand:
 *   20 June 2026   drawn 2 × 2,500 = 5,000; June to March is 10 months; (30,000 − 5,000) ÷ 10 = 2,500 a month
 *   29 May 2026    April recorded, May not: drawn 2,500; May to March is 11 months; 27,500 ÷ 11 = 2,500
 *   30 April 2026  nothing recorded: April to March is 12 months; 30,000 ÷ 12 = 2,500
 *   May worked out again once May is recorded: May's own record is not "before" May, so drawn stays 2,500
 */
import { describe, it, expect } from 'vitest';
import { ladderPosition, monthsLeftInTaxYear, drawnFromRecords } from '../src/services/LadderPosition.js';
import { ladderFromDocument } from '../src/services/DecisionOverlay.js';
import { whereAmIInputs } from '../src/services/PlanReading.js';

const plan = {
  firstTaxYear: 2026, cash: 91364,
  years: [
    { Y: 2026, age: 64, gross: 30000, need: 30000, from: 'cash' },
    { Y: 2027, age: 65, gross: 30000, need: 30000, from: 'cash' },
    { Y: 2028, age: 66, gross: 30000, need: 30000, from: 'cash' },
    { Y: 2029, age: 67, gross: 30000, need: 18000, from: 'T29', matures: '2029-03-22' }
  ],
  orders: [{ tidm: 'T29', name: '0 1/8% IL Gilt 2029', matures: '2029-03-22', nominal: 30400, pays: 54000, taxYears: [2029, 2030, 2031] }]
};
const rec = (date, sipp) => ({ date, sipp, stdSipp: sipp, other: 0, state: 0, monthlyNet: 2209.5 });
const records = [rec('2025-03', 9999), rec('2026-04', 2500), rec('2026-05', 2500)];
const day = (s) => new Date(s + 'T12:00:00');

describe('months left in the tax year are calendar months, this one included', () => {
  it('late in a month still counts that month', () => {
    expect(monthsLeftInTaxYear(2026, day('2026-05-29'))).toBe(11);
    expect(monthsLeftInTaxYear(2026, day('2026-04-30'))).toBe(12);
    expect(monthsLeftInTaxYear(2026, day('2026-06-20'))).toBe(10);
    expect(monthsLeftInTaxYear(2026, day('2027-03-31'))).toBe(1);
    expect(monthsLeftInTaxYear(2026, day('2027-04-03'))).toBe(1);
    expect(monthsLeftInTaxYear(2027, day('2027-04-06'))).toBe(12);
  });
});

describe('what the recorded months took', () => {
  it('sums the pension draws of this tax year\'s months before the month', () => {
    expect(drawnFromRecords(records, 2026, '2026-06')).toBe(5000);
    expect(drawnFromRecords(records, 2026, '2026-05')).toBe(2500);
    expect(drawnFromRecords(records, 2026, '2026-04')).toBe(0);
    expect(drawnFromRecords([], 2026, '2026-06')).toBe(0);
  });
});

describe('the month\'s figure with the months recorded', () => {
  it('20 June: £2,500 a month for the 10 months to 5 April 2027', () => {
    const lp = ladderPosition(plan, { today: day('2026-06-20'), records });
    expect(lp.drawnThisYear).toBe(5000);
    expect(lp.monthsLeft).toBe(10);
    expect(lp.monthly).toBe(2500);
    expect(lp.instruction).toContain('£2,500 a month for the 10 months to 5 April 2027');
  });
  it('29 May with April recorded, and 30 April with nothing recorded: £2,500', () => {
    expect(ladderPosition(plan, { today: day('2026-05-29'), records }).monthly).toBe(2500);
    expect(ladderPosition(plan, { today: day('2026-04-30'), records: [] }).monthly).toBe(2500);
  });
  it('a figure typed for what was drawn wins over the records', () => {
    expect(ladderPosition(plan, { today: day('2026-06-20'), records, drawnThisYear: 10000 }).monthly).toBe(2000);
  });
  it('Month by month reads the same figure from the plan document and the records', () => {
    const doc = { lockedAt: '2026-04-10', strategy: { id: 'full-il-gilt', contract: true, r: { plan } } };
    const got = ladderFromDocument(doc, { strategyId: 'full-il-gilt' }, '2026-06', day('2026-06-20'), records);
    expect(got.lp.monthly).toBe(2500);
  });
  it('"Where you are" reads it too', () => {
    const sc = { planDocument: { lockedAt: '2026-04-10', strategy: { id: 'full-il-gilt', contract: true, r: { plan } } }, decisionTool: { history: records } };
    const { ladderPos } = whereAmIInputs(sc, { now: day('2026-06-20') });
    expect(ladderPos.monthly).toBe(2500);
    expect(ladderPos.instruction).toContain('£2,500 a month for the 10 months');
  });
});
