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

describe('which months the strip counts: every record of this tax year, whatever it is marked', () => {
  it('a year set up part-way with a gap inside the records (September and November recorded, then October): two months, then three, named', () => {
    const two = whereAmI(doc, { today: NOV, history: [rec('2026-09'), rec('2026-11')] }).incomeThisYear;
    expect(two).toMatchObject({ recorded: 2, drawn: 5200, perMonth: 2500, months: ['2026-09', '2026-11'], cut: 0 });
    expect(two.setUpMonths).toEqual([]);
    expect(incomeThisYearText(two)).toBe('2 months recorded this tax year (September 2026 and November 2026): £5,200 taken before tax, against £5,000 the plan said for those months (£2,500 a month) — £200 more than the plan said.');
    const three = whereAmI(doc, { today: NOV, history: [rec('2026-09'), rec('2026-11'), rec('2026-10')] }).incomeThisYear;
    expect(three).toMatchObject({ recorded: 3, drawn: 7800, months: ['2026-09', '2026-10', '2026-11'] });
    expect(incomeThisYearText(three)).toBe('3 months recorded this tax year (September 2026 to November 2026): £7,800 taken before tax, against £7,500 the plan said for those months (£2,500 a month) — £300 more than the plan said.');
  });
  it('a month filled in later, one paid ahead and one recorded from the tax year\'s set-up count like any other; another tax year\'s do not', () => {
    const history = [rec('2026-03'), rec('2026-04', 2600, { filledIn: true, fromSetUp: true }), rec('2026-09'), rec('2026-10', 2600, { filledIn: true }), rec('2026-12', 2600, { paidAhead: true })];
    const inc = whereAmI(doc, { today: NOV, history }).incomeThisYear;
    expect(inc.recorded).toBe(4);
    expect(inc.months).toEqual(['2026-04', '2026-09', '2026-10', '2026-12']);
    expect(inc.setUpMonths).toEqual(['2026-04']);
    expect(incomeThisYearText(inc)).toBe('4 months recorded this tax year (April 2026, September 2026, October 2026 and December 2026; April 2026 is filled in from your tax-year set-up): £10,400 taken before tax, against £10,000 the plan said for those months (£2,500 a month) — £400 more than the plan said.');
  });
  it('months filled in from the set-up are said apart, so the strip and Plan vs actual (which measures a part-year first year from its set-up on) do not seem to disagree', () => {
    const setUp = ['2026-04', '2026-05', '2026-06', '2026-07', '2026-08'].map((d) => rec(d, 2200, { filledIn: true, fromSetUp: true }));
    const inc = whereAmI(doc, { today: NOV, history: [...setUp, rec('2026-09'), rec('2026-10')] }).incomeThisYear;
    expect(incomeThisYearText(inc)).toBe('7 months recorded this tax year (April 2026 to October 2026; April 2026 to August 2026 are filled in from your tax-year set-up): £16,200 taken before tax, against £17,500 the plan said for those months (£2,500 a month) — £1,300 less than the plan said.');
  });
});

describe('the words: what was taken against what the plan said for the same months, and the difference', () => {
  it('less, and why when a recorded month says the plan\'s protection cut it; the same; one month', () => {
    const cut = whereAmI(doc, { today: NOV, history: [rec('2026-09', 2500), rec('2026-10', 2000, { inProtection: true })] }).incomeThisYear;
    expect(incomeThisYearText(cut)).toBe('2 months recorded this tax year (September 2026 and October 2026): £4,500 taken before tax, against £5,000 the plan said for those months (£2,500 a month) — £500 less, because income was cut in one of them.');
    const allCut = whereAmI(doc, { today: NOV, history: [rec('2026-10', 2000, { inProtection: true })] }).incomeThisYear;
    expect(incomeThisYearText(allCut)).toBe('1 month recorded this tax year (October 2026): £2,000 taken before tax, against £2,500 the plan said for that month (£2,500 a month) — £500 less, because income was cut in it.');
    const less = whereAmI(doc, { today: NOV, history: [rec('2026-09', 2400), rec('2026-10', 2400)] }).incomeThisYear;
    expect(incomeThisYearText(less)).toContain('— £200 less than the plan said.');
    const same = whereAmI(doc, { today: NOV, history: [rec('2026-09', 2500)] }).incomeThisYear;
    expect(incomeThisYearText(same)).toBe('1 month recorded this tax year (September 2026): £2,500 taken before tax, against £2,500 the plan said for that month (£2,500 a month) — the same as the plan said.');
  });
  it('no plan figure for the year: what was taken alone; nothing recorded: no line', () => {
    expect(incomeThisYearText({ recorded: 2, drawn: 5200, perMonth: null, months: ['2026-09', '2026-10'] })).toBe('2 months recorded this tax year (September 2026 and October 2026): £5,200 taken before tax.');
    expect(incomeThisYearText({ recorded: 0, drawn: 0, perMonth: 2500 })).toBe('');
    expect(incomeThisYearText(null)).toBe('');
  });
  it('in the strip: never a total against a monthly figure', () => {
    const w = whereAmI(doc, { today: NOV, history: [rec('2026-09'), rec('2026-10'), rec('2026-11')] });
    const s = strip(w);
    expect(s).toContain('3 months recorded this tax year (September 2026 to November 2026): £7,800 taken before tax, against £7,500 the plan said for those months (£2,500 a month) — £300 more than the plan said.');
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
