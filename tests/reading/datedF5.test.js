/**
 * Step F5 (lead4.md R4): records are dated. A tax year's set-up, where it is shown (both views draw thisYearSentences),
 * says the day it was set up; a set-up made before the day was kept says nothing it cannot back.
 */
import { describe, it, expect } from 'vitest';
import { thisYearSentences } from '../../src/reading/thisYear.js';

const words = (s) => s.parts.map((p) => (typeof p === 'string' ? p : '£' + s.figures[p.key])).join('');
const year = (on) => ({ key: '26/27', year: '2026/27', differs: false, planSays: null, setUp: { on, from: '2026-04', payments: 12, perMonth: 2600, total: 31200, perYear: 31200, stored: 31200 } });

describe('a tax year\'s set-up says its day', () => {
  it('with the day kept', () => {
    const [s] = thisYearSentences(year('2026-11-03'));
    expect(s.id).toBe('where.yearPlan');
    expect(words(s)).toBe('In 2026/27 your plan takes £2600 a month before tax. This tax year was set up on 3 November 2026.');
  });
  it('without it, as before', () => {
    expect(words(thisYearSentences(year(null))[0])).toBe('In 2026/27 your plan takes £2600 a month before tax.');
  });
});
