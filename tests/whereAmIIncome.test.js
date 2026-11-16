/**
 * The "where you are" strip's income line, like with like.
 *
 * It said "N months recorded this tax year: £X gross so far against £Y a month planned": a total set against a monthly
 * figure. Now it says what was taken in the months recorded against what the plan said for those same months (the plan
 * document's figure for the year, a twelfth a month, times the months) and the difference, as the preview's "Where you
 * are" says it (answers/plan/read.js whereStep), and it names the months, saying apart those filled in from the tax
 * year's set-up.
 *
 * Which months it counts: every record of this tax year, whatever it is marked (filled in later, paid ahead) — a year set
 * up part-way with a gap inside the records (September and November recorded, then October) counts two, then three. As
 * drawn at Calculate, before the month being entered was saved, the strip counted one month fewer than were on record:
 * nothing drew it again after Save. The planner now does.
 */
import { describe, it, expect, vi } from 'vitest';
import { readFileSync } from 'node:fs';
vi.mock('../src/firebase/index.js', () => ({ isFirebaseConfigured: () => false, isLoggedIn: () => false }));
import { whereAmI } from '../src/services/PlanDocument.js';
import { whereAmIHtml, incomeThisYearText } from '../src/ui/components/PlanDocumentView.js';

const strip = (w) => whereAmIHtml(w).replace(/<[^>]+>/g, '');
const series = (n, f) => Array.from({ length: n }, (_, y) => f(y));

/** A made-up locked plan document (Alex, fictional): only the fields the strip reads. Plan year 0 = 2026/27, £30,000 a year. */
const doc = {
  version: 2, lockedAt: '2026-09-01T10:00:00.000Z', createdAt: '2026-09-01T10:00:00.000Z',
  timing: { firstTaxYear: 2026, shapeAgeNow: 63, mode: 'retired' },
  steps: [{ fromAge: 63, amount: 30000, taxYear: '2026/27' }],
  timeline: series(10, (y) => ({ y, gross: 30000, sp: 0, other: 0, lumpIn: [] })),
  strategy: { id: 'pots-and-valves', r: {} },
  assumptions: { duration: 10, firstTaxYear: 2026 }
};
const NOV = new Date(2026, 10, 4, 12);
const rec = (date, sipp = 2600, extra = {}) => ({ date, taxYear: date >= '2026-04' ? '26/27' : '25/26', sipp, other: 0, state: 0, ...extra });

// retaken in 7.12.0: "the plan said" is each month's own figure (YearPlan.takenAgainstPlan), never the document's year row a
// twelfth a month; the words are the simple view's, so the full view no longer lists every month (the year strip does)
describe('which months the strip counts: every record of this tax year, whatever it is marked', () => {
  it('a year set up part-way with a gap inside the records (September and November recorded, then October): two months, then three', () => {
    const two = whereAmI(doc, { today: NOV, history: [rec('2026-09'), rec('2026-11')] }).incomeThisYear;
    expect(two).toMatchObject({ recorded: 2, drawn: 5200, said: 5200, months: ['2026-09', '2026-11'], cut: 0, taxYear: '2026/27' });
    expect(two.setUpMonths).toEqual([]);
    expect(incomeThisYearText(two)).toBe('2 months recorded in 2026/27: £5,200 taken before tax, as your plan said.');
    const three = whereAmI(doc, { today: NOV, history: [rec('2026-09'), rec('2026-11'), rec('2026-10')] }).incomeThisYear;
    expect(three).toMatchObject({ recorded: 3, drawn: 7800, months: ['2026-09', '2026-10', '2026-11'] });
    expect(incomeThisYearText(three)).toBe('3 months recorded in 2026/27: £7,800 taken before tax, as your plan said.');
  });
  it('a month filled in later, one paid ahead and one recorded from the tax year\'s set-up count like any other; another tax year\'s do not', () => {
    const history = [rec('2026-03'), rec('2026-04', 2600, { filledIn: true, fromSetUp: true }), rec('2026-09'), rec('2026-10', 2600, { filledIn: true }), rec('2026-12', 2600, { paidAhead: true })];
    const inc = whereAmI(doc, { today: NOV, history }).incomeThisYear;
    expect(inc.recorded).toBe(4);
    expect(inc.months).toEqual(['2026-04', '2026-09', '2026-10', '2026-12']);
    expect(inc.setUpMonths).toEqual(['2026-04']);
    expect(incomeThisYearText(inc)).toBe('4 months recorded in 2026/27 (April 2026 is filled in from your tax-year set-up): £10,400 taken before tax, as your plan said.');
  });
  it('months filled in from the set-up are said apart', () => {
    const setUp = ['2026-04', '2026-05', '2026-06', '2026-07', '2026-08'].map((d) => rec(d, 2200, { filledIn: true, fromSetUp: true }));
    const inc = whereAmI(doc, { today: NOV, history: [...setUp, rec('2026-09'), rec('2026-10')] }).incomeThisYear;
    // 5 × 2,200 + 2 × 2,600
    expect(incomeThisYearText(inc)).toBe('7 months recorded in 2026/27 (April 2026 to August 2026 are filled in from your tax-year set-up): £16,200 taken before tax, as your plan said.');
  });
});

describe('the words: what was taken against what each month said, and the difference', () => {
  const told = (date, sipp, f = {}) => rec(date, sipp, { stdSipp: 2500, ...f });
  it('less, and why when a recorded month says the plan\'s protection cut it; more; the same; one month', () => {
    const cut = whereAmI(doc, { today: NOV, history: [told('2026-09', 2500), told('2026-10', 2000, { inProtection: true })] }).incomeThisYear;
    expect(incomeThisYearText(cut)).toBe('2 months recorded in 2026/27: £4,500 taken before tax. That is £500 less than your plan said, because income was cut in 1 of them.');
    const allCut = whereAmI(doc, { today: NOV, history: [told('2026-10', 2000, { inProtection: true })] }).incomeThisYear;
    expect(incomeThisYearText(allCut)).toBe('1 month recorded in 2026/27: £2,000 taken before tax. That is £500 less than your plan said, because income was cut in that month.');
    const less = whereAmI(doc, { today: NOV, history: [told('2026-09', 2400), told('2026-10', 2400)] }).incomeThisYear;
    expect(incomeThisYearText(less)).toContain('That is £200 less than your plan said.');
    const more = whereAmI(doc, { today: NOV, history: [told('2026-09', 2600), told('2026-10', 2600)] }).incomeThisYear;
    expect(incomeThisYearText(more)).toContain('That is £200 more than your plan said.');
    const same = whereAmI(doc, { today: NOV, history: [told('2026-09', 2500, { monthlyNet: 2210 })] }).incomeThisYear;
    expect(incomeThisYearText(same)).toBe('1 month recorded in 2026/27: £2,500 taken before tax, as your plan said. £2,210 reached your bank.');
  });
  it('a plan whose start is ahead: what was taken alone; nothing recorded: said so', () => {
    expect(incomeThisYearText({ recorded: 2, drawn: 5200, said: 5000, diff: 200, taxYear: '2026/27' }, { compare: false })).toBe('2 months recorded in 2026/27: £5,200 taken before tax.');
    expect(incomeThisYearText({ recorded: 0, drawn: 0, taxYear: '2026/27' })).toBe('No month recorded in 2026/27 yet.');
    expect(incomeThisYearText(null)).toBe('');
  });
  it('in the strip: never a total against a monthly figure', () => {
    const w = whereAmI(doc, { today: NOV, history: [told('2026-09', 2600), told('2026-10', 2600), told('2026-11', 2600)] });
    const s = strip(w);
    expect(s).toContain('3 months recorded in 2026/27: £7,800 taken before tax. That is £300 more than your plan said.');
    expect(s).not.toContain('gross so far');
    expect(s).not.toContain('a month planned');
  });
});

describe('the planner draws the strip again after Save, so it counts the month just saved', () => {
  it('index.html: Save ends by drawing the strip again', () => {
    const html = readFileSync('index.html', 'utf8');
    const save = html.slice(html.indexOf('window.saveCurrentDecision'), html.indexOf('// Render the read-only "starting from Settings" summary'));
    expect(save.length).toBeGreaterThan(0);
    expect(save).toMatch(/monthEntry\.refreshOffer\(\); renderWhereAmILine\(\)/);
  });
});
