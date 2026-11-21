/**
 * Step F5 (lead4.md R4): records are dated. A tax year's set-up, where it is shown (both views draw thisYearSentences),
 * says the day it was set up, and the day is one fact (income.thisYear.setUpOn) marked the same way in both views; a
 * set-up made before the day was kept says nothing it cannot back. Every figure here is made up.
 */
import { describe, it, expect } from 'vitest';
import { thisYearSentences } from '../../src/reading/thisYear.js';
import { yearPlanHtml, yearChangedHtml } from '../../src/ui/thisYearHtml.js';
import { sentenceFindsOf } from '../../src/v7/components/facts.js';
import { groupParts } from '../../src/reading/sentenceMarks.js';
import { FACT } from '../../src/reading/facts.js';
import { formatFact } from '../../src/reading/format.js';
import { LABELS } from '../../src/reading/labels.js';

const words = (s) => s.parts.map((p) => (typeof p === 'string' ? p : '£' + s.figures[p.key])).join('');
const year = (on, extra = {}) => ({ key: '26/27', year: '2026/27', differs: false, planSays: null, setUp: { on, from: '2026-04', payments: 12, perMonth: 2600, total: 31200, perYear: 31200, stored: 31200 }, ...extra });
const marksIn = (html) => [...html.matchAll(/data-fact="([^"]+)"[^>]*>([^<]*)</g)].map((m) => [m[1], m[2]]);

describe('a tax year\'s set-up says its day', () => {
  it('with the day kept', () => {
    const [s] = thisYearSentences(year('2026-11-03'));
    expect(s.id).toBe('where.yearPlan');
    expect(words(s)).toBe('In 2026/27 your plan takes £2600 a month before tax. This tax year was set up on 3 November 2026.');
  });
  it('without it, as before', () => {
    expect(words(thisYearSentences(year(null))[0])).toBe('In 2026/27 your plan takes £2600 a month before tax.');
  });
  it('the day is one fact, with one label and one rule, marked in the full view', () => {
    expect(FACT.YEAR_SET_UP_ON).toBe('income.thisYear.setUpOn');
    expect(LABELS[FACT.YEAR_SET_UP_ON].label).toBe('This tax year, set up on');
    expect(formatFact(FACT.YEAR_SET_UP_ON, '2026-11-03')).toBe('3 November 2026');
    expect(marksIn(yearPlanHtml(year('2026-11-03')))).toContainEqual([FACT.YEAR_SET_UP_ON, '3 November 2026']);
  });
  it('… and in the simple view, by the same find', () => {
    const [s] = thisYearSentences(year('2026-11-03'));
    const groups = groupParts(s.parts, s.figures, { keys: {}, finds: sentenceFindsOf('where.yearPlan') });
    const g = groups.find((x) => x.fact === FACT.YEAR_SET_UP_ON);
    expect(g && g.items.map((x) => x.text).join('')).toBe('3 November 2026');
  });
  it('the line said when the plan has changed since marks the same day, in both views', () => {
    const t = year('2026-06-12', { differs: true, planSays: { perYear: 33000, stored: 33000 } });
    const changed = thisYearSentences(t).find((x) => x.id === 'where.yearChanged');
    expect(words(changed)).toContain('This tax year was set up on 12 June 2026 at £31200');
    expect(marksIn(yearChangedHtml(t))).toContainEqual([FACT.YEAR_SET_UP_ON, '12 June 2026']);
    const groups = groupParts(changed.parts, changed.figures, { keys: {}, finds: sentenceFindsOf('where.yearChanged') });
    expect(groups.some((x) => x.fact === FACT.YEAR_SET_UP_ON)).toBe(true);
  });
});
