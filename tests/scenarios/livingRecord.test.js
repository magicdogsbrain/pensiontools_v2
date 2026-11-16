/**
 * Living on it: the monthly record and "am I on course" (7.12.0, the living-record brief, Part 1). Plain scenarios with
 * fictional people (Sam, Kim, Alex, Pat, Jo); every figure is made up, and every expected figure is worked by hand here,
 * never by calling the function under test.
 *
 *   Step 1  what was taken against what the plan said: one reader (services/YearPlan.js), the same words in both views.
 */
import { describe, it, expect } from 'vitest';
import { planPage } from '../../src/answers/plan/read.js';
import { homeOf } from '../../src/answers/plan/home.js';
import { whereAmIFor } from '../../src/services/PlanReading.js';
import { incomeThisYearText } from '../../src/ui/components/PlanDocumentView.js';
import { takenAgainstPlan } from '../../src/services/YearPlan.js';
import { corpus, entryOf } from '../v7/plan/_plans.js';

const C = corpus();
const copy = (v) => JSON.parse(JSON.stringify(v));
const noonOf = (d) => { const [y, m, dd] = d.split('-').map(Number); return new Date(y, m - 1, dd, 12); };

/**
 * A locked plan living on its money (from the committed running fixture, 04): the document's year row says £30,000 a year
 * (a twelfth, £2,500 a month) and 2026/27 is set up from April at £31,200 (prices raised by 4%). Records as given.
 */
function living(records, { id = 'LivingSam01', name = 'Sam' } = {}) {
  const r = copy(C['04-buckets-running']);
  r.id = id; r.planDetails.name = name; r.isActive = true;
  r.decisionTool.history = records;
  return r;
}
const rec = (date, f = {}) => ({ date, taxYear: date >= '2027-04' ? '27/28' : '26/27', sipp: 2600, stdSipp: 2600, other: 0, state: 0, monthlyNet: 2289.5, monthlyTax: 310.5, inProtection: false, equity: 370000, bond: 150000, cash: 60000, ...f });

/** The simple view's "Where you are" step, and the full view's strip line, for one plan on one day. */
function bothViews(raw, today) {
  const e = entryOf(raw, today);
  const W = planPage([e], e.plan.id, 'where', { today }).steps.find((s) => s.id === 'where');
  const w = whereAmIFor(e.plan, { now: noonOf(today) });
  return { simple: W.result.text, full: incomeThisYearText(w.incomeThisYear), W, w };
}

describe('Step 1: what was taken against what the plan said, one reader for both views', () => {
  it('Sam, prices raised: six months taken exactly as told read "as your plan said", never against the year row', () => {
    const months = ['2026-04', '2026-05', '2026-06', '2026-07', '2026-08', '2026-09'];
    const { simple, full } = bothViews(living(months.map((m) => rec(m))), '2026-10-02');
    const taken = 6 * 2600;   // £15,600
    for (const s of [simple, full]) {
      expect(s).toContain('£' + taken.toLocaleString('en-GB') + ' taken before tax, as your plan said');
      expect(s).not.toContain('more than');
      expect(s).not.toContain('£15,000');
    }
  });

  it('Kim, a quarter tax-free: two months as told, and what reached the bank', () => {
    const recs = ['2026-11', '2026-12'].map((m) => rec(m, { sipp: 2577, stdSipp: 2577, monthlyNet: 2191 }));
    const { simple, full } = bothViews(living(recs, { id: 'LivingKim01', name: 'Kim' }), '2026-12-16');
    const taken = 2 * 2577, bank = 2 * 2191;   // £5,154 and £4,382
    const want = '£' + taken.toLocaleString('en-GB') + ' taken before tax, as your plan said. £' + bank.toLocaleString('en-GB') + ' reached your bank.';
    for (const s of [simple, full]) {
      expect(s).toContain('2 months recorded in 2026/27: ' + want);
      expect(s).not.toContain('£5,476');
      expect(s).not.toContain('£322');
    }
  });

  it('Alex, ladder: three months of a twelfth of £34,000 read £8,500 and "as your plan said", never £1 out', () => {
    const recs = ['2026-07', '2026-08', '2026-09'].map((m) => rec(m, { sipp: 2833.33, stdSipp: 2833.33, monthlyNet: 2400 }));
    const { simple, full } = bothViews(living(recs, { id: 'LivingAlex01', name: 'Alex' }), '2026-10-02');
    const taken = Math.round(34000 * 3 / 12);   // £8,500
    for (const s of [simple, full]) {
      expect(s).toContain('£' + taken.toLocaleString('en-GB') + ' taken before tax, as your plan said');
      expect(s).not.toMatch(/£1 (more|less)/);
    }
  });

  it('Pat, income cut in two of six months: the difference and why', () => {
    const months = ['2026-04', '2026-05', '2026-06', '2026-07', '2026-08', '2026-09'];
    const recs = months.map((m, i) => (i >= 4 ? rec(m, { sipp: 2080, inProtection: true }) : rec(m)));
    const { simple, full, W } = bothViews(living(recs, { id: 'LivingPat01', name: 'Pat' }), '2026-10-02');
    const taken = 4 * 2600 + 2 * 2080, said = 6 * 2600;   // £14,560 against £15,600
    for (const s of [simple, full]) {
      expect(s).toContain('6 months recorded in 2026/27: £' + taken.toLocaleString('en-GB') + ' taken before tax.');
      expect(s).toContain('That is £' + (said - taken).toLocaleString('en-GB') + ' less than your plan said, because income was cut in 2 of them.');
    }
    expect(W.compare).toBe('where.compareLessCut');
  });

  it('an old record with no stdSipp reads as taken = said', () => {
    const t = takenAgainstPlan([{ date: '2026-05', sipp: 2400, other: 100, state: 0 }]);
    expect(t.taken).toBe(2400 + 100);
    expect(t.said).toBe(2400 + 100);
    expect(t.diff).toBe(0);
  });

  it('the home says the same sentence, and its strip cells say "the plan said" only when it differs', () => {
    const months = ['2026-04', '2026-05', '2026-06', '2026-07', '2026-08', '2026-09'];
    const recs = months.map((m, i) => (i >= 4 ? rec(m, { sipp: 2080, inProtection: true }) : rec(m)));
    const e = entryOf(living(recs, { id: 'LivingPat02', name: 'Pat' }), '2026-10-02');
    const H = homeOf([e], e.plan.id, { today: '2026-10-02' });
    expect(H.where[0].result.text).toContain('That is £1,040 less than your plan said');
    const cells = H.year.cells;
    expect(cells[0]).toMatchObject({ drawn: 2600, plan: 2600, planDiffers: false });
    expect(cells[4]).toMatchObject({ drawn: 2080, plan: 2600, planDiffers: true });
  });
});
