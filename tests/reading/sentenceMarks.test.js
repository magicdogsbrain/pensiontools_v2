/**
 * Marks inside an answer's sentence (src/reading/sentenceMarks.js; lead4.md G1): one grouping, drawn by both views, so a
 * figure is marked the same way wherever the sentence is drawn. The words never change.
 */
import { describe, it, expect } from 'vitest';
import { groupParts, sentenceHtml, SAVER_MARKS, saverSlotsOf, GILTS_HELD_FIND } from '../../src/reading/sentenceMarks.js';
import { saverLineHtml } from '../../src/ui/saverAnswerUi.js';
import { unmarked } from '../../src/reading/mark.js';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const result = { income: { bad: 1450 }, enough: { atLevel: { payIn: 610 } } };

describe('groupParts', () => {
  it('a keyed figure is gathered under its fact; the text is the sentence as written', () => {
    const parts = ['To last, you could spend ', { key: 'income.bad', kind: 'money' }, ' a month.'];
    const g = groupParts(parts, result, SAVER_MARKS.income);
    expect(g.map((x) => x.fact)).toEqual([null, 'saver.incomeAtStop', null]);
    expect(g.flatMap((x) => x.items.map((i) => i.text)).join('')).toBe('To last, you could spend £1,450 a month.');
  });

  it('a chance said across counts and words is one mark, the string around it cut at its edges', () => {
    const parts = ['Paying in as now, your money lasts as long as you do about ', { fixed: '17' }, ' times in ', { fixed: '20' }, '.'];
    const g = groupParts(parts, result, SAVER_MARKS.line);
    const marked = g.filter((x) => x.fact === 'saver.chance');
    expect(marked).toHaveLength(1);
    expect(marked[0].items.map((i) => i.text).join('')).toBe('about 17 times in 20');
    expect(g.flatMap((x) => x.items.map((i) => i.text)).join('')).toBe('Paying in as now, your money lasts as long as you do about 17 times in 20.');
  });

  it('a find whose edge falls inside a figure is left unmarked', () => {
    const g = groupParts([{ key: 'income.bad', kind: 'money' }], result, { finds: [[/£(1),450/, 'saver.incomeAtStop']] });
    expect(g.every((x) => x.fact === null)).toBe(true);
  });

  it('"3 of 22 gilts bought" marks "3 of 22", counts drawn as whole numbers', () => {
    const g = groupParts([{ key: 'b', kind: 'count' }, ' of ', { key: 'r', kind: 'count' }, ' gilts bought.'], { b: 3, r: 22 }, { finds: [[GILTS_HELD_FIND, 'gilts.held']] });
    expect(g[0].fact).toBe('gilts.held');
    expect(g[0].items.map((i) => i.text).join('')).toBe('3 of 22');
  });
});

describe('the full view draws the same marks', () => {
  it('sentenceHtml: the words as text, each figure in a span carrying its fact', () => {
    const s = { parts: ['You could spend ', { key: 'income.bad', kind: 'money' }, ' a month.'] };
    const html = sentenceHtml(s, result, SAVER_MARKS.income, esc);
    expect(html).toBe('You could spend <span data-fact="saver.incomeAtStop">£1,450</span> a month.');
    expect(unmarked(html)).toBe('You could spend £1,450 a month.');
  });

  it('the saver block: the head is the verdict, the want line marks the amount and the age, as the simple view does', () => {
    const head = { id: 'head', s: { text: 'On course for £1,500 a month from 66', parts: ['On course for ', { key: 'spend.perMonth', kind: 'money' }, ' a month from 66'] } };
    const html = saverLineHtml(head, { spend: { perMonth: 1500 } });
    expect(html).toBe('<span data-fact="saver.verdict">On course for <span data-fact="want.income">£1,500</span> a month from 66</span>');
    const want = saverLineHtml({ id: 'want', slots: { amount: '£1,500', age: '66' } }, null);
    expect(want).toContain('<span data-fact="want.income">£1,500</span>');
    expect(want).toContain('<span data-fact="want.stopAge">66</span>');
    expect(saverSlotsOf('now.share')).toBe(saverSlotsOf('now.pounds'));
  });
});
