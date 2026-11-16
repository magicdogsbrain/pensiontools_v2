/**
 * Living on it: the monthly record and "am I on course" (7.12.0, the living-record brief, Part 1). Plain scenarios with
 * fictional people (Sam, Kim, Alex, Pat, Jo); every figure is made up, and every expected figure is worked by hand here,
 * never by calling the function under test.
 *
 *   Step 1  what was taken against what the plan said: one reader (services/YearPlan.js), the same words in both views.
 *   Step 2  the month the plan first pays, and the year's plan: no month before it is "not recorded".
 *   Step 3  one month to record: the home's button, Month by month and the full view's box name the same month.
 */
import { describe, it, expect } from 'vitest';
import { planPage } from '../../src/answers/plan/read.js';
import { homeOf } from '../../src/answers/plan/home.js';
import { whereAmIFor } from '../../src/services/PlanReading.js';
import { incomeThisYearText } from '../../src/ui/components/PlanDocumentView.js';
import { takenAgainstPlan, firstPaymentMonth, monthToRecord } from '../../src/services/YearPlan.js';
import { monthOf } from '../../src/answers/plan/month.js';
import { MONTH } from '../../src/v7/copy/month.js';
import { corpus, entryOf } from '../v7/plan/_plans.js';

const C = corpus();
const copy = (v) => JSON.parse(JSON.stringify(v));
const fillSlots = (t, slots) => String(t).replace(/\{(\w+)\}/g, (m, k) => (slots && slots[k] != null ? String(slots[k]) : m));
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

/** A tax year set up from `startMonth` (4 = April) with `remaining` payments of `sipp` a month before tax. */
const setUpFrom = (startMonth, remaining, sipp) => ({
  yearSetupComplete: true, startMonth, remainingMonths: remaining, confirmedSalary: Math.round(sipp * 12), pa: 12570, brl: 50270, hrl: 125140, cpi: 0.04, other: 0, statePension: 0,
  isaSavingsAllocation: 0, isaSavingsUsed: 0, cgtExemptionUsed: 0, isTaxEfficient: true, taxEfficiencyChoice: 'efficient', grossIncomeToDate: 0, taxPaidToDate: null,
  expectedMonthly: { sipp: { gross: sipp, net: 0, tax: 0 }, other: { gross: 0, net: 0, tax: 0 }, statePension: { gross: 0, net: 0, tax: 0 }, isa: { gross: 0, net: 0, tax: 0 } }
});
/** A plan locked on `lockedAt`, its 2026/27 as given (or not set up), with these records. */
function lockedOn(lockedAt, { taxYear = null, records = [], id, name }) {
  const r = living(records, { id, name });
  r.decisionTool.settings.lockedAt = lockedAt; r.planDocument.lockedAt = lockedAt;
  r.decisionTool.taxYears = taxYear ? { '26/27': taxYear } : {};
  return r;
}
const homeAt = (raw, today) => { const e = entryOf(raw, today); return { e, H: homeOf([e], e.plan.id, { today }), M: monthOf([e], e.plan.id, { today }), pg: planPage([e], e.plan.id, 'plan', { today }) }; };
const cellOf = (H, m) => H.year.cells.find((c) => c.month === m);
const planHead = (pg) => pg.steps.find((s) => s.id === 'plan').result.text;
const whereLine = (raw, today, id) => { const e = entryOf(raw, today); const W = planPage([e], e.plan.id, 'where', { today }).steps.find((s) => s.id === 'where'); const l = W.lines.find((x) => x.id === id); return l ? l.sentence.text : null; };

describe('Step 2: the month the plan first pays, and the year\'s plan', () => {
  it('Kim: set up from November, November and December recorded; April to October are before the plan, not missed', () => {
    const kim = lockedOn('2026-11-16T10:00:00.000Z', { id: 'LivingKim02', name: 'Kim', taxYear: setUpFrom(11, 5, 2577),
      records: ['2026-11', '2026-12'].map((m) => rec(m, { sipp: 2577, stdSipp: 2577, monthlyNet: 2191 })) });
    const { e, H, M, pg } = homeAt(kim, '2026-12-16');
    expect(firstPaymentMonth(e.plan, { now: noonOf('2026-12-16') })).toEqual({ month: '2026-11', from: 'setUp' });
    const april = ['2026-04', '2026-05', '2026-06', '2026-07', '2026-08', '2026-09', '2026-10'];
    for (const m of april) expect(cellOf(H, m).state, m).toBe('before');
    expect(H.year.cells.some((c) => c.state === 'none')).toBe(false);
    expect(planHead(pg)).toContain('your plan pays from November 2026');
    expect(M.gap).toBe(null);
    expect(M.earlier).toBe(true);
    // 5 payments of £2,577
    expect(whereLine(kim, '2026-12-16', 'where.yearPlan')).toBe('In 2026/27 your plan takes £2,577 a month before tax, from November 2026: 5 payments, £' + (5 * 2577).toLocaleString('en-GB') + '.');
  });

  it('Kim the day she locked: nothing set up, nothing recorded — the first month is not known, and nothing is said about earlier months', () => {
    const kim = lockedOn('2026-11-16T10:00:00.000Z', { id: 'LivingKim03', name: 'Kim' });
    kim.decisionTool.recordMonths = true;   // Kim said she keeps a monthly record
    const { e, H, M, pg } = homeAt(kim, '2026-11-16');
    expect(firstPaymentMonth(e.plan, { now: noonOf('2026-11-16') })).toEqual({ month: null, from: null });
    expect(planHead(pg)).toContain('your plan’s first tax year is 2026/27');
    expect(H.year.cells.some((c) => c.state === 'none')).toBe(false);
    expect(M.gap == null || M.gap.count === 0).toBe(true);
    expect([...H.todo.items, ...H.todo.more].map((i) => i.id)).toContain('month.taxYear');
  });

  it('Jo, a real gap: set up from April, April, May and July recorded, today in August — June is the month to record', () => {
    const jo = lockedOn('2026-03-20T10:00:00.000Z', { id: 'LivingJo01', name: 'Jo', taxYear: setUpFrom(4, 12, 2600), records: ['2026-04', '2026-05', '2026-07'].map((m) => rec(m)) });
    const { H, M } = homeAt(jo, '2026-08-10');
    // unchanged behaviour, pinned: the gap is the one month due on the strip (a second gap would read "not recorded")
    expect(cellOf(H, '2026-06').state).toBe('due');
    expect(H.year.cells.some((c) => c.state === 'before')).toBe(false);
    // the page opens on June itself (step 3); with August chosen, the banner names June
    expect(M.chosen).toBe('2026-06');
    const aug = monthOf([entryOf(jo, '2026-08-10')], jo.id, { today: '2026-08-10', typed: { 'mo.month': '2026-08' } });
    expect(aug.gap).toMatchObject({ count: 1, words: 'June 2026' });
    expect(fillSlots(MONTH.gap.one, aug.gap)).toBe('June 2026 is not recorded.');
    expect(whereLine(jo, '2026-08-10', 'where.yearPlan')).toBe('In 2026/27 your plan takes £2,600 a month before tax.');
    // two months missed: the first is due, the second reads "not recorded"
    const jo2 = lockedOn('2026-03-20T10:00:00.000Z', { id: 'LivingJo02', name: 'Jo', taxYear: setUpFrom(4, 12, 2600), records: ['2026-04', '2026-07'].map((m) => rec(m)) });
    const two = homeAt(jo2, '2026-08-10');
    expect(cellOf(two.H, '2026-05').state).toBe('due');
    expect(cellOf(two.H, '2026-06').state).toBe('none');
    expect(two.M.chosen).toBe('2026-05');
  });

  it('Alex: set up from July with nine payments — April to June are before the plan', () => {
    const alex = lockedOn('2026-06-20T10:00:00.000Z', { id: 'LivingAlex02', name: 'Alex', taxYear: setUpFrom(7, 9, 2833.33), records: [rec('2026-07', { sipp: 2833.33, stdSipp: 2833.33 })] });
    const { H } = homeAt(alex, '2026-08-02');
    for (const m of ['2026-04', '2026-05', '2026-06']) expect(cellOf(H, m).state, m).toBe('before');
    expect(whereLine(alex, '2026-08-02', 'where.yearPlan')).toBe('In 2026/27 your plan takes £2,833 a month before tax, from July 2026: 9 payments, £' + Math.round(9 * 2833.33).toLocaleString('en-GB') + '.');
  });
});

describe('Step 3: one month to record', () => {
  const set = setUpFrom(4, 12, 2600);
  it('Kim records December early (16 November): the step names December with its own figure, and nothing is left to record', () => {
    const kim = lockedOn('2026-11-01T10:00:00.000Z', { id: 'LivingKim04', name: 'Kim', taxYear: setUpFrom(11, 5, 2577),
      records: [rec('2026-11', { sipp: 2577, stdSipp: 2577, monthlyNet: 2191 }), rec('2026-12', { sipp: 2577, stdSipp: 2577, monthlyNet: 2191 })] });
    const e = entryOf(kim, '2026-11-16');
    const step = planPage([e], e.plan.id, 'month', { today: '2026-11-16' }).steps.find((s) => s.id === 'month');
    expect(step.result.text).toBe('December 2026 recorded: £2,191 after tax');
    expect(monthToRecord(e.plan, '2026-11').month).toBe(null);
    expect(monthOf([e], e.plan.id, { today: '2026-11-16' }).idle).toBeTruthy();
  });
  it('Jo, June missed: the home\'s button, Month by month and the one reader all name June', () => {
    const jo = lockedOn('2026-03-20T10:00:00.000Z', { id: 'LivingJo03', name: 'Jo', taxYear: set, records: ['2026-04', '2026-05', '2026-07'].map((m) => rec(m)) });
    const { e, H, M } = homeAt(jo, '2026-08-10');
    const todo = [...H.todo.items, ...H.todo.more].find((i) => i.button && /\/month$/.test(i.button.href || ''));
    expect(todo.button.month).toBe('2026-06');
    expect(M.chosen).toBe('2026-06');
    expect(monthToRecord(e.plan, '2026-08').month).toBe('2026-06');
  });
  it('a month still ahead is said once, and not refused', () => {
    const jo = lockedOn('2026-03-20T10:00:00.000Z', { id: 'LivingJo04', name: 'Jo', taxYear: set, records: ['2026-04', '2026-05', '2026-06', '2026-07', '2026-08', '2026-09', '2026-10'].map((m) => rec(m)) });
    const e = entryOf(jo, '2026-11-16');
    const M = monthOf([e], e.plan.id, { today: '2026-11-16', typed: { 'mo.month': '2026-12' } });
    expect(M.chosen).toBe('2026-12');
    expect(M.future).toEqual({ month: 'December 2026' });
    expect(fillSlots(MONTH.future, M.future)).toBe('December 2026 has not happened yet. Record it now only if the payment has gone.');
  });
});
