/**
 * A ladder's part first year, read in that year (since E2 its need is for the months it pays): what is still to come this tax
 * year is its months at its own monthly rate, the same as the ladder box (LadderPosition rateOf), never its need over twelve.
 *
 * Fictional Alex (tests/v7/plan/_alexLiving.js), living on a locked ladder; today 16 November 2026, 5 months of 2026/27 to
 * come. The fixture's first year is a whole year (£34,000). Here it is built for a part year from July 2026, as a ladder
 * locked in July holds it: 9 months, July to March, need 34,000 × 9 / 12 = £25,500, `months: 9`. By hand: 25,500 ÷ 9 =
 * 2,833.33 a month; × 5 months left = 14,166.67 → £14,167 (the same as the whole year's 34,000 ÷ 12 × 5). Read over twelve
 * it would be 25,500 × 5 / 12 = £10,625: too little by £3,542.
 */
import { describe, it, expect, vi } from 'vitest';
vi.mock('../../../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));
import { heldLadder } from '../../../src/answers/plan/held.js';
import { gapsOf } from '../../../src/answers/plan/gaps.js';
import { yearNeedsOf, shareStillToCome } from '../../../src/services/TransitionPlanner.js';
import { TODAY, alexLivingRaw, living } from './_alexLiving.js';

const partYear = () => {
  const plan = living(alexLivingRaw());
  const y0 = plan.planDocument.strategy.r.plan.years.find((y) => y.Y === 2026);
  y0.need = 25500; y0.cost = 25500; y0.gross = 25500; y0.months = 9;
  return plan;
};

describe('a ladder\'s part first year: its months still to come at its own rate', () => {
  it('the need carries the months it pays, and the share to come is over those', () => {
    const needs = yearNeedsOf(partYear().planDocument);
    expect(needs[2026]).toMatchObject({ need: 25500, months: 9 });
    expect(needs[2027].months).toBeUndefined();
    expect(shareStillToCome(needs[2026], 5)).toBeCloseTo(5 / 9, 10);
    expect(shareStillToCome(needs[2027], 5)).toBeCloseTo(5 / 12, 10);
    expect(shareStillToCome(needs[2026], 12)).toBe(1);
  });

  it('Your plan\'s mix: this year\'s cash still to come is £14,167, as for the whole year', () => {
    const whole = heldLadder(living(alexLivingRaw()), { today: TODAY });
    const part = heldLadder(partYear(), { today: TODAY });
    const row = part.cashYears.rows.find((r) => r.Y === 2026);
    expect(row.thisYear).toBe(true);
    expect(row.monthsLeft).toBe(5);
    expect(Math.round(row.need)).toBe(14167);
    expect(part.cashYears.need).toBe(whole.cashYears.need);
  });

  it('the gaps read the same this year\'s need', () => {
    const row = gapsOf(partYear(), { today: TODAY, asKept: true }).rows.find((r) => r.Y === 2026);
    expect(row.thisYear).toBe(true);
    expect(row.full).toBe(25500);
    expect(row.need).toBe(14167);
    // what is held against it (£12 of cash) leaves the same gap as the whole year's: 14,167 − 12
    const w = gapsOf(living(alexLivingRaw()), { today: TODAY, asKept: true }).rows.find((r) => r.Y === 2026);
    expect(row.gap).toBe(w.gap);
  });
});

// (wrap-up) the dated reading of the same cash years says the same months at the same rate: 5 × £2,833 = £14,167, and its
// total is the cash years' total (one page said "£18,148 still to come" and then "In all £15,034")
describe('the dated cash years read the part first year at its own rate', () => {
  it('this year\'s months: 5 × £2,833 = £14,167; the dated total is the cash years\' total', () => {
    const part = heldLadder(partYear(), { today: TODAY });
    const months = part.dated.rows.filter((r) => r.kind === 'months');
    expect(months.reduce((s, r) => s + r.n, 0)).toBe(5);
    expect(months[0].per).toBe(2833);
    expect(months.reduce((s, r) => s + r.due, 0)).toBeGreaterThanOrEqual(14166);
    expect(months.reduce((s, r) => s + r.due, 0)).toBeLessThanOrEqual(14167);
    expect(Math.abs(part.dated.due - part.cashYears.need)).toBeLessThanOrEqual(1);
  });
});
