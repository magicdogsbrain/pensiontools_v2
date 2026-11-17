/**
 * Living on it: the monthly record and "am I on course" (7.12.0, the living-record brief, Part 1). Plain scenarios with
 * fictional people (Sam, Kim, Alex, Pat, Jo); every figure is made up, and every expected figure is worked by hand here,
 * never by calling the function under test.
 *
 *   Step 1  what was taken against what the plan said: one reader (services/YearPlan.js), the same words in both views.
 *   Step 2  the month the plan first pays, and the year's plan: no month before it is "not recorded".
 *   Step 3  one month to record: the home's button, Month by month and the full view's box name the same month.
 *   Step 4  what reaches your bank: the tax-year set-up and the month work it out with one sum.
 *   Step 5  the pot on one basis, and the ISA typed each month kept.
 *   Step 6  the full view before the lock: the plan's own figures, never the old "set up first" banner (joined with the
 *           two-views line, src/ui/draftPlanLine.js: recording the first month locks the plan, and asks first).
 */
import { describe, it, expect } from 'vitest';
import { planPage } from '../../src/answers/plan/read.js';
import { homeOf } from '../../src/answers/plan/home.js';
import { whereAmIFor } from '../../src/services/PlanReading.js';
import { incomeThisYearText } from '../../src/ui/components/PlanDocumentView.js';
import { takenAgainstPlan, firstPaymentMonth, monthToRecord } from '../../src/services/YearPlan.js';
import { monthOf, readMonth, monthRecordPatch } from '../../src/answers/plan/month.js';
import { calculateMonthlyBreakdown, statePensionFact, statePensionLine, bandsAssumptionText } from '../../src/services/TaxYearSetUp.js';
import { MONTH } from '../../src/v7/copy/month.js';
import { PLAN } from '../../src/v7/copy/plan.js';
import { decisionToHistory } from '../../src/models/Decision.js';
import { draftLineOf } from '../../src/ui/draftPlanLine.js';
import { effectiveStressSettings } from '../../src/services/PlanReading.js';
import { readFileSync } from 'node:fs';
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
    // before the year is set up, the month's amount and the pot it comes from: the document's 2026/27 row takes £30,000
    // from the pension, 30,000 ÷ 12 = 2,500 a month
    expect(fillSlots(MONTH.planMonth, M.planMonth)).toBe('In November 2026 your plan takes £2,500 before tax from your pension.');
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
    expect(M.planMonth).toBe(null);   // the year is set up: the month is worked out from it instead
    expect(fillSlots(MONTH.future, M.future)).toBe('December 2026 has not happened yet. Record it now only if the payment has gone.');
  });
});

describe('Step 4: what reaches your bank, one sum', () => {
  /** Kim: a quarter of each payment tax-free, nothing set up yet for 2026/27, nothing recorded. */
  const kimUfpls = (id) => {
    const r = lockedOn('2026-11-16T10:00:00.000Z', { id, name: 'Kim' });
    r.decisionTool.settings.accessMethod = 'ufpls'; r.decisionTool.settings.ufplsYears = null;
    return r;
  };
  // (7.12.0) the income box says the year before tax as it is taken, a quarter of each payment tax-free:
  //   £2,400 a month after tax is 28,800 a year; (28,800 − 2,514) ÷ 0.85 = 30,924.71, typed as 30,925 (the plan keeps 32,858)
  const typedKim = { 'ty.income': '30925', 'ty.toDate': '24000', 'ty.taxToDate': '2286', 'ty.isa': '0', 'mo.total': '520000', 'mo.cash': '40000', 'mo.bonds': '150000' };

  it('Kim: set up from November after £24,000 received — the table, the month and the reason agree', () => {
    const e = entryOf(kimUfpls('LivingKim05'), '2026-11-16');
    const R = readMonth(e.plan, typedKim, { today: '2026-11-16' });
    expect(R.month).toBe('2026-11');
    // worked by hand: the prior £24,000 used the allowance, so each pension payment is taxed at 20% on three quarters of it.
    // After tax a month = 0.8 × 32,858 / 12 = 2,190.53; before tax = 2,190.53 / 0.85 = 2,577.10; tax = 386.57
    const net = 0.8 * 32858 / 12, gross = net / 0.85;
    const pension = R.setUp.bank.find((b) => b.id === 'pension');
    expect(pension).toEqual({ id: 'pension', before: '£' + Math.round(gross).toLocaleString('en-GB'), tax: '£' + Math.round(gross - net).toLocaleString('en-GB'), after: '£' + Math.round(net).toLocaleString('en-GB') });
    expect(pension).toEqual({ id: 'pension', before: '£2,577', tax: '£387', after: '£2,191' });
    expect(R.setUp.taxFree).toBe(true);
    expect(fillSlots(MONTH.setUp.taxFree, {})).toBe('A quarter of each pension payment is tax-free.');
    // the month as it will be worked out once the year is set up: the same pension figure
    expect(R.advice.raw.sippDraw).toBe(Math.round(gross));
    // a full year: 32,858 − 0.2 × (32,858 − 12,570) = 28,800.40 a year, £2,400 a month
    const full = (32858 - 0.2 * (32858 - 12570)) / 12;
    expect(fillSlots(MONTH.setUp.reason, R.setUp.reason)).toBe('In a full tax year this income is £' + Math.round(full).toLocaleString('en-GB') + ' a month after tax. This tax year £2,191 a month reaches your bank, because the money you received before November used your tax-free allowance.');
    // and what the pension would pay for £2,400 to reach the bank this year: 2,400 ÷ 0.85 = 2,823.53
    expect(fillSlots(MONTH.setUp.reasonTake, R.setUp.reason)).toBe('For £2,400 a month to reach your bank this tax year, the pension would pay £2,824 a month before tax.');
    // the box and the suggestion say the year as taken
    expect(R.setUp.words.income).toBe('£30,925');
  });

  it('Kim: the month records the same £2,577 with or without an ISA figure typed', () => {
    const e = entryOf(kimUfpls('LivingKim06'), '2026-11-16');
    const none = readMonth(e.plan, typedKim, { today: '2026-11-16' });
    const withIsa = readMonth(e.plan, { ...typedKim, 'mo.isa': '60000' }, { today: '2026-11-16' });
    expect(none.advice.raw.sippDraw).toBe(2577);
    expect(withIsa.advice.raw.sippDraw).toBe(2577);
  });

  it('Sam, nothing tax-free, set up from April at £30,000: the figures are what they were, to the penny', () => {
    const b = calculateMonthlyBreakdown({ targetSalary: 30000, pa: 12570, brl: 50270, hrl: 125140, remainingMonths: 12, isaSavingsAllocation: 0 });
    expect(b.sipp.gross).toBe(30000 / 12);
    expect(b.sipp.tax).toBeCloseTo((30000 - 12570) * 0.2 / 12, 9);
    expect(b.sipp.net).toBeCloseTo(30000 / 12 - (30000 - 12570) * 0.2 / 12, 9);
    expect(calculateMonthlyBreakdown({ targetSalary: 30000, pa: 12570, brl: 50270, hrl: 125140, remainingMonths: 12, taxFreeFraction: 0 })).toEqual(b);
  });

  it('the State Pension: a plan that holds one starting in a later tax year says so, never "no amount"', () => {
    const later = statePensionFact({ amount: 0, startDate: '16 November 2031', startYm: '2031-11' }, '2026-04', 12548);
    expect(later.id).toBe('later');
    expect(fillSlots(MONTH.setUp.statePension.later, { ...later.slots, year: '2026/27' })).toBe('State Pension: £12,548 a year from 16 November 2031. None is paid in 2026/27.');
    expect(statePensionLine({ amount: 0, startDate: '16 November 2031', startYm: '2031-11' }, '2026-04', 12548, '26/27')).toBe('State Pension: £12,548 a year from 16 November 2031. None is paid in 2026/27.');
    // Decision settings hold none, the plan's Stress settings £230.25 a week: £11,973 a year (230.25 × 52)
    const r = lockedOn('2026-03-20T10:00:00.000Z', { id: 'LivingSam05', name: 'Sam' });
    Object.assign(r.decisionTool.settings, { statePension: 0, spWeeklyAmount: 0, spStartDate: '16 November 2031' });
    r.stressTool.settings.spWeeklyAmount = 230.25; r.stressTool.settings.spStartDate = '16 November 2031';
    const e = entryOf(r, '2026-04-10');
    const R = readMonth(e.plan, { 'mo.month': '2026-04' }, { today: '2026-04-10' });
    expect(R.setUp.statePension.id).toBe('later');
    expect(fillSlots(MONTH.setUp.statePension[R.setUp.statePension.id], R.setUp.statePension.slots)).toBe('State Pension: £' + Math.round(230.25 * 52).toLocaleString('en-GB') + ' a year from 16 November 2031. None is paid in 2026/27.');
    expect(JSON.stringify(R.setUp.statePension)).not.toMatch(/noAmount|none/);
  });

  it('the bands sentence says 40% too', () => {
    expect(bandsAssumptionText({ pa: 12570, brl: 50270, hrl: 125140 })).toBe('We assume a tax-free allowance of £12,570, then 20% tax on income up to £50,270, 40% up to £125,140 and 45% above.');
  });
});

describe('Step 5: the pot on one basis, the ISA remembered', () => {
  const lineText = (W, id) => { const l = W.lines.find((x) => x.id === id); return l ? (PLAN.lines[id] ? PLAN.lines[id] + ': ' : '') + l.sentence.text : null; };
  const whereOf = (raw, today) => { const e = entryOf(raw, today); return { e, W: planPage([e], e.plan.id, 'where', { today }).steps.find((x) => x.id === 'where') }; };

  it('Sam: pension recorded in September, ISA under What you hold from March, 4% entered — the pot in the band\'s prices first', () => {
    const months = ['2026-04', '2026-05', '2026-06', '2026-07', '2026-08', '2026-09'];
    const sam = living(months.map((m) => (m === '2026-09' ? rec(m, { equity: 377700, bond: 150000, cash: 60000 }) : rec(m))), { id: 'LivingSam06', name: 'Sam' });
    const { e, W } = whereOf(sam, '2026-10-02');
    // worked by hand: as recorded 587,700 + 25,040 = 612,740; September is 5 months into 2026/27, prices 1.04^(5/12)
    const recorded = 587700 + 25040;
    const compared = Math.round(recorded / Math.pow(1.04, 5 / 12));
    const L = (n) => '£' + n.toLocaleString('en-GB');
    expect(lineText(W, 'where.pot')).toBe('Your pot: ' + L(compared) + ' at the prices of April 2026 (' + L(recorded) + ' as recorded).');
    expect(lineText(W, 'where.potParts')).toBe('Pension £587,700, recorded September 2026. ISA £25,040, from What you hold, March 2026.');
    // the figure Review and the full view compare is the same number
    expect(whereAmIFor(e.plan, { now: noonOf('2026-10-02') }).pot.real).toBe(compared);
  });

  it('Kim: no holdings, the ISA typed on December\'s record — a pot reading, and January\'s ISA box opens on it', () => {
    const kim = lockedOn('2026-11-16T10:00:00.000Z', { id: 'LivingKim07', name: 'Kim', taxYear: setUpFrom(11, 5, 2577),
      records: [rec('2026-11', { sipp: 2577, stdSipp: 2577, monthlyNet: 2191 }), rec('2026-12', { sipp: 2577, stdSipp: 2577, monthlyNet: 2191, equity: 302500, bond: 150000, cash: 60000, isaBalance: 60000, isa: 0 })] });
    kim.holdings = null;
    const { e, W } = whereOf(kim, '2027-01-05');
    const w = whereAmIFor(e.plan, { now: noonOf('2027-01-05') });
    expect(w.pot.missing).toEqual([]);
    expect(w.pot.actual).toBe(302500 + 150000 + 60000 + 60000);
    expect(lineText(W, 'where.potNoIsa')).toBe(null);
    // the ISA typed with the month is said back on the home, with the pension, both from December's record
    //   pension 302,500 + 150,000 + 60,000 = 512,500; ISA 60,000 as typed
    expect(lineText(W, 'where.pot')).toMatch(/\(£572,500 as recorded: pension £512,500, ISA £60,000\)\.$/);
    expect(lineText(W, 'where.potParts')).toBe(null);   // one month, one place: said in the pot's own line
    const M = monthOf([e], e.plan.id, { today: '2027-01-05' });
    expect(M.pots.fields.find((f) => f.path === 'mo.isa').shown).toBe('60000');
  });

  it('a record from before the ISA was kept, and no holdings: we say we have no figure for the ISA', () => {
    const old = lockedOn('2026-11-16T10:00:00.000Z', { id: 'LivingKim08', name: 'Kim', taxYear: setUpFrom(11, 5, 2577), records: [rec('2026-11', { sipp: 2577, stdSipp: 2577 })] });
    old.holdings = null;
    const { W } = whereOf(old, '2026-12-05');
    expect(lineText(W, 'where.potNoIsa')).toBe('Your plan counts your ISA too, and we have no figure for it. You can type it in the ISA box when you next record a month, or add it under What you hold.');
    expect(lineText(W, 'where.pot')).toBe(null);
  });

  it('recording a month with the ISA box filled keeps it on the record', () => {
    const kim = lockedOn('2026-11-16T10:00:00.000Z', { id: 'LivingKim09', name: 'Kim', taxYear: setUpFrom(11, 5, 2577), records: [rec('2026-11', { sipp: 2577, stdSipp: 2577 })] });
    const e = entryOf(kim, '2026-12-05');
    const P = monthRecordPatch(e.plan, { 'mo.month': '2026-12', 'mo.total': '512500', 'mo.cash': '60000', 'mo.bonds': '150000', 'mo.isa': '60000' }, { today: '2026-12-05', nowIso: '2026-12-05T10:00:00.000Z' });
    expect(P.ok).toBe(true);
    const dec = P.patch['decisionTool.history'].find((h) => h.date === '2026-12');
    expect(dec.isaBalance).toBe(60000);
  });
  it('the record keeps the ISA typed, and leaves it out when the box was blank', () => {
    const base = { date: '2026-12', taxYear: '26/27', equity: 1, bond: 1, cash: 1, sippDraw: 0, isaDraw: 0, other: 0, statePension: 0, monthlyTax: 0, totalMonthlyNet: 0 };
    expect(decisionToHistory({ ...base, isaBalanceTyped: 60000.4 }).isaBalance).toBe(60000);
    expect('isaBalance' in decisionToHistory(base)).toBe(false);
  });
});

describe('Step 6: the full view before the lock', () => {
  // Joined at integration with the two-views brief's line (one box on Monthly Entry, src/ui/draftPlanLine.js): the first
  // recorded month still locks the plan, after asking, as it always has, so the form stays; the figures are the plan's own.
  it('a kept plan not locked: the Monthly Entry tab says the plan\'s own figures, read as the simple view reads them', () => {
    const r = living([], { id: 'LivingPat03', name: 'Pat' });
    r.decisionTool.settings.locked = false; delete r.decisionTool.settings.lockedAt; delete r.planDocument; r.decisionTool.taxYears = {};
    Object.assign(r.stressTool.settings, { equityMin: 300000, bondMin: 160000, cashTarget: 60000, diversifierStart: 0, isaBalance: 60000, baseSalary: 32858, targetSchedule: null, incomeShape: 'flat', strategyParams: {} });
    const e = entryOf(r, '2026-11-16');
    const line = draftLineOf(e.plan, { stress: effectiveStressSettings(e.plan, { now: noonOf('2026-11-16') }) });
    // by hand: 300,000 + 160,000 + 60,000 = £520,000 pension; £60,000 ISA; the first step £32,858 a year before tax
    expect(line.text).toBe('This plan is not locked yet. Recording its first month locks it, and you are asked first. It runs on your plan\'s figures: pension £520,000, ISAs and savings £60,000, £32,858 a year before tax.');
    expect(line.text).not.toMatch(/meaningless|defaults/);
  });
  it('the old banner is gone from the Decision tool\'s Monthly Entry', () => {
    const html = readFileSync('index.html', 'utf8');
    const entry = html.slice(html.indexOf('<div id="decision-entry"'), html.indexOf('<div class="grid-2">', html.indexOf('<div id="decision-entry"')));
    expect(entry).not.toMatch(/meaningless|defaults/);
    expect(entry).toContain('id="dsSetupBanner"');   // an empty box src/ui/draftPlanLine.js fills
    expect(entry).not.toMatch(/Set up this plan first/);
  });
});

import { tryBoxesOf, tryViews, savedLasts } from '../../src/answers/plan/lasts.js';
import { LASTS } from '../../src/v7/copy/lasts.js';

describe('Try a change on a locked plan starts from the pot as last recorded (7.12.0, G)', () => {
  it('Kim, December recorded: the boxes open on the pension and ISA as recorded, said with their month', () => {
    const kim = lockedOn('2026-11-16T10:00:00.000Z', { id: 'LivingKim20', name: 'Kim', taxYear: setUpFrom(11, 5, 2577),
      records: [rec('2026-11', { sipp: 2577, stdSipp: 2577, monthlyNet: 2191 }), rec('2026-12', { sipp: 2577, stdSipp: 2577, monthlyNet: 2191, equity: 302500, bond: 150000, cash: 60000, isaBalance: 60000, isa: 0 })] });
    kim.holdings = null;
    const e = entryOf(kim, '2027-01-05');
    const b = tryBoxesOf(e.plan, { today: '2027-01-05' });
    // the pension as recorded in December: 302,500 + 150,000 + 60,000 = 512,500; the ISA typed with it, 60,000
    expect(b['try.pot']).toBe('512500');
    expect(b['try.isa']).toBe('60000');
    const t = tryViews(e.plan, {}, null, null, { today: '2027-01-05', editable: false, saved: savedLasts(e.plan, { today: '2027-01-05' }) });
    expect(fillSlots(LASTS.try.from[t.from.id], t.from.slots)).toBe('Pension £512,500, recorded December 2026. ISA £60,000, recorded December 2026.');
  });
  it('nothing recorded since the lock: the plan as locked, said so', () => {
    const kim = lockedOn('2026-11-16T10:00:00.000Z', { id: 'LivingKim21', name: 'Kim' });
    kim.holdings = null;
    const e = entryOf(kim, '2026-11-20');
    const t = tryViews(e.plan, {}, null, null, { today: '2026-11-20', editable: false, saved: savedLasts(e.plan, { today: '2026-11-20' }) });
    expect(t.from.id).toBe('locked');
    expect(fillSlots(LASTS.try.from.locked, t.from.slots)).toBe('As your plan was locked on 16 November 2026.');
  });
});
