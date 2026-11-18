/**
 * Marks inside an answer's sentence (src/reading/sentenceMarks.js; lead4.md G1): one grouping, drawn by both views, so a
 * figure is marked the same way wherever the sentence is drawn. The words never change.
 */
import { describe, it, expect } from 'vitest';
import { groupParts, sentenceHtml, SAVER_MARKS, saverSlotsOf, GILTS_HELD_FIND, LASTS_FINDS } from '../../src/reading/sentenceMarks.js';
import { saverLineHtml } from '../../src/ui/saverAnswerUi.js';
import { unmarked, markWithin } from '../../src/reading/mark.js';

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

describe('the mix by bucket (mix.held.#, mix.plan.#)', () => {
  it('the full view\'s held-mix line marks the same numbers the simple view\'s slots hold', async () => {
    const { HELD_MIX_FINDS, HELD_MIX_SLOTS, PLAN_MIX_SLOTS } = await import('../../src/reading/sentenceMarks.js');
    const { markWithin } = await import('../../src/reading/mark.js');
    const { describeMix } = await import('../../src/services/Holdings.js');
    const { mixWords } = await import('../../src/answers/plan/hold.js');
    const p = { total: 100000, buckets: { shares: 0.78, bonds: 0.17, diversifiers: 0, cash: 0.05 }, weightedOcf: 0.0018, expectedReal: 0.043, untagged: [] };
    const html = markWithin(esc(describeMix(p)), HELD_MIX_FINDS);
    const marked = Object.fromEntries([...html.matchAll(/data-fact="([^"]+)">([^<]*)</g)].map((m) => [m[1], m[2]]));
    const w = mixWords(p);
    expect(marked).toEqual({ 'mix.held.shares': w.shares, 'mix.held.bonds': w.bonds, 'mix.held.cash': w.cash });   // a bucket the line leaves out is not marked
    expect(unmarked(html)).toBe(esc(describeMix(p)));   // "0.18%/yr" is never taken for a bucket
    expect(Object.keys(HELD_MIX_SLOTS)).toEqual(['shares', 'bonds', 'diversifiers', 'cash']);
    expect(PLAN_MIX_SLOTS.shares).toBe('mix.plan.shares');
  });
});

describe('the words under "Does it last?" (LASTS_FINDS), marked the same way in both views', () => {
  // the sentences OneAnswer writes (weightedWordsOf), as both views draw them
  const words = {
    floor: 'If the money ran out at 101, you would still have £20,350 a year after tax from the income you get anyway.',
    left: 'If you live to 92, what is typically left then is £687,000 at today\'s prices. In the best 1 in 10 futures it is £2,342,000 or more.',
    assumed: 'We tested to 92, the age your plan runs to. About 4 in 10 women your age live longer than that. We follow each future on to 104, when fewer than 1 in 50 women your age are still alive.',
    fixed: 'If you live to 92, the money lasts that long in every future we tried.'
  };
  const marksOf = (html) => [...html.matchAll(/<span data-fact="([^"]+)">([^<]*)<\/span>/g)].map((m) => [m[1], m[2]]);
  it('each figure is marked as its fact; the words are unchanged', () => {
    const got = Object.fromEntries(Object.entries(words).map(([k, w]) => [k, markWithin(esc(w), LASTS_FINDS[k])]));
    expect(marksOf(got.floor)).toEqual([['lasts.runOutAge', '101'], ['lasts.floorIncome', '£20,350']]);
    expect(marksOf(got.left)).toEqual([['left.typically', '£687,000'], ['left.goodCase', '£2,342,000']]);
    expect(marksOf(got.assumed)).toEqual([['lasts.liveLonger', '4 in 10'], ['lasts.followTo', '104']]);
    expect(marksOf(got.fixed)).toEqual([['plan.endAge', '92'], ['lasts.fixedChance', 'in every future we tried']]);
    for (const [k, w] of Object.entries(words)) expect(unmarked(got[k])).toBe(esc(w));
  });
  it('the fixed-age chance in every form the words take', () => {
    for (const s of ['in 14 of 20 futures we tried', 'in none of the futures we tried', 'in more than 19 of 20 futures we tried', 'in fewer than 1 of 20 futures we tried']) {
      expect(marksOf(markWithin('If you live to 97, the money lasts that long ' + s + '.', LASTS_FINDS.fixed))).toContainEqual(['lasts.fixedChance', s]);
    }
  });
});
