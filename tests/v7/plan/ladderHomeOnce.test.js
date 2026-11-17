/**
 * The home's "Where you are" on a locked ladder (7.12.0): the month's figure is said once, and the pot is never set
 * against a "middle line". A ladder's path is bought by contract and its record is at market prices, so the two are not
 * read as ahead or behind ("Where you are" in the plan document says so); two bare figures side by side read as behind.
 *
 * Corpus 03 (a fictional locked index-linked ladder, £34,000 a year, July to September recorded): by hand, 34,000 ÷ 12 =
 * 2,833.33 a month, said once as "In 2026/27 your plan takes £2,833 a month before tax".
 */
import { describe, it, expect } from 'vitest';
import { planPage } from '../../../src/answers/plan/read.js';
import { PLAN } from '../../../src/v7/copy/plan.js';
import { corpus, entryOf } from './_plans.js';

const where = (name, today) => { const e = entryOf(corpus()[name], today); return planPage([e], e.plan.id, 'where', { today }).steps.find((s) => s.id === 'where'); };

describe('a locked ladder\'s "Where you are"', () => {
  it('says the month\'s figure once, and no middle line beside the pot', () => {
    const W = where('03-gilt-ladder-locked', '2026-11-16');
    const ids = W.lines.map((l) => l.id);
    expect(ids).toContain('where.yearPlan');
    expect(W.lines.find((l) => l.id === 'where.yearPlan').sentence.text).toContain('£2,833 a month before tax');
    expect(ids).toContain('where.pot');
    expect(ids).not.toContain('where.potMid');
    expect(ids).not.toContain('where.ladderMonthly');
    expect(W.lines.filter((l) => /£2,833 a month/.test(l.sentence.text))).toHaveLength(1);
  });
  it('a ladder line, when it is said, says the plan pays (a cash year is not paid by the ladder)', () => {
    expect(PLAN.lines['where.ladderMonthly']).toBe('Your plan pays');
  });
});

import { HELD } from '../../../src/v7/copy/held.js';
describe('"Also in your pension": what a gilt pays by the day it matures', () => {
  it('the column says the sum includes the interest still to come, so it is not read as paid on the day', () => {
    // a 3¾% gilt of 28,056 units on 20 June 2026, maturing 7 March 2027: 28,056 on the day, and two coupons of
    // 28,056 × 3.75 ÷ 200 = 526.05 (September and March): 29,108 by then, not on the day
    expect(HELD.alsoColumns.pays).toBe('Pays by then, with interest');
  });
});
