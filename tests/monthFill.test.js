/**
 * Month by month: fill in the months not recorded, and say why Save is off (decided 3 November 2026; src/services/MonthFill.js).
 *
 * By default the missed months are the months with no record between the latest record before the month in the box and
 * that month — none when the chosen month is the next one, the same one or earlier; a calendar-year or tax-year boundary
 * is just months. The "Start from" chooser reaches back to the April of the earliest tax year set up (or the first record, when
 * earlier) and takes every month with no record from there; when the default offers nothing, the offer is closed (a quiet
 * line opens the chooser, no ready tick), and a month before a set-up given nothing as received is never offered. A month before its tax year's set-up is recorded with its
 * share of what that set-up was given as received, and the engine is handed the history without it while the set-up still
 * counts it: every month from the set-up on is worked out exactly as before (the invariant, on the real engine). A
 * filled-in record carries `filledIn: true` and `filledInOn` (the ISO instant) through saveDecision, and `fromSetUp` when
 * its figures came from the set-up; an ordinary record carries none of them. The words on screen never say "backfill".
 */
import { describe, it, expect, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import {
  addMonth, monthLabel, latestRecordedMonth, latestRecordedBefore, missedMonths, fillOffer, fillWords, FILL_HELP, MORE_WORDS, fillMarks, isFilledIn,
  dateLabel, filledInLabel, filledInNote, savingProgress, fillStoppedWords, saveStateWords, beforeSetUp, monthsWords, countWords,
  pendingWords, recalcWords, setUpShares, setUpWords, notSetUpWords, earliestFillMonth, yearWords, aprilOf, setUpShareDecision, historyForEngine,
  refusedMonthWords, recordsToDelete, deleteButtonWords
} from '../src/services/MonthFill.js';
import { calcDecisionPWA } from '../src/services/legacyDecision.js';

// saveDecision's collaborators, so the marks can be read off the record it stores (as tests/DecisionAutoLock.test.js does)
const stored = [];
vi.mock('../src/services/PlanLock.js', () => ({ lockPlanIfNeeded: async () => true }));
vi.mock('../src/storage/DecisionRepository.js', () => ({
  getDecisionSettingsAsync: async () => ({ baseSalary: 1 }),
  addHistoryRecord: async (r) => { stored.push(r); },
  recalculateIsaSavingsUsed: async () => {},
  decisionSettingsChecksum: () => 'x'
}));
const { saveDecision } = await import('../src/services/DecisionService.js');

const fixture = JSON.parse(readFileSync('tests/fixtures/plans/04-buckets-running.json', 'utf8'));   // records April–September 2026

describe('the missed months between the latest record and the month in the box', () => {
  it('moves a month by k, across a year end either way', () => {
    expect(addMonth('2026-06', 1)).toBe('2026-07');
    expect(addMonth('2026-12', 1)).toBe('2027-01');
    expect(addMonth('2027-01', -1)).toBe('2026-12');
    expect(addMonth('2026-03', 14)).toBe('2027-05');
  });
  it('the latest record, whatever order the history is in; null when there is none', () => {
    expect(latestRecordedMonth(fixture.decisionTool.history)).toBe('2026-09');
    expect(latestRecordedMonth([...fixture.decisionTool.history].reverse())).toBe('2026-09');
    expect(latestRecordedMonth([{ date: '2026-04' }, { date: 'nonsense' }, { date: '2025-12' }])).toBe('2026-04');
    expect(latestRecordedMonth([])).toBe(null);
    expect(latestRecordedMonth(null)).toBe(null);
  });
  it('two months missed: June recorded, September in the box', () => {
    expect(missedMonths('2026-06', '2026-09')).toEqual(['2026-07', '2026-08']);
  });
  it('none when the month in the box is the next month, the same month, or earlier', () => {
    expect(missedMonths('2026-06', '2026-07')).toEqual([]);
    expect(missedMonths('2026-06', '2026-06')).toEqual([]);
    expect(missedMonths('2026-06', '2026-03')).toEqual([]);
  });
  it('none when nothing is recorded yet, or a month is not a month', () => {
    expect(missedMonths(null, '2026-09')).toEqual([]);
    expect(missedMonths('2026-06', '')).toEqual([]);
    expect(missedMonths('2026-06', '2026-9')).toEqual([]);
    expect(missedMonths(undefined, undefined)).toEqual([]);
  });
  it('across a calendar-year boundary and across a tax-year boundary: just months, in order', () => {
    expect(missedMonths('2026-11', '2027-02')).toEqual(['2026-12', '2027-01']);
    expect(missedMonths('2027-02', '2027-06')).toEqual(['2027-03', '2027-04', '2027-05']);   // April begins tax year 27/28: the fill stops there if it is not set up (the caller's test)
  });
  it('the offer for the form: the months, first and last, and the tick\'s words; null when there is nothing to offer', () => {
    const history = fixture.decisionTool.history.filter((h) => h.date < '2026-07');
    const none = { widened: false, closed: false, shares: {}, setUp: [], notSetUp: null, pending: [], help: FILL_HELP };
    expect(fillOffer(history, '2026-09')).toEqual({ months: ['2026-07', '2026-08'], from: '2026-07', to: '2026-08', words: 'Fill in 2 months you did not record, July 2026 and August 2026, with these figures', choices: ['2026-07', '2026-08'], chosenFrom: '2026-07', ...none });
    expect(fillOffer(history, '2026-07')).toBe(null);
    expect(fillOffer([], '2026-09')).toBe(null);
    expect(fillOffer(fixture.decisionTool.history, '2026-11')).toEqual({ months: ['2026-10'], from: '2026-10', to: '2026-10', words: 'Fill in 1 month you did not record, October 2026, with these figures', choices: ['2026-10'], chosenFrom: '2026-10', ...none });
  });
});

describe('a month before its tax year\'s set-up takes its share of what that set-up was given as received', () => {
  const ty = (s) => { const [y, m] = s.split('-').map(Number); const t = m >= 4 ? y : y - 1; return String(t % 100).padStart(2, '0') + '/' + String((t + 1) % 100).padStart(2, '0'); };
  // a year set up from September with £13,000 received and £1,552.50 of tax before it (fictional figures)
  const sep = { yearSetupComplete: true, startMonth: 9, remainingMonths: 7, grossIncomeToDate: 13000, taxPaidToDate: 1552.5, pa: 12570, brl: 50270, hrl: 125140 };
  it('beforeSetUp: only for a year set up part-way, and only the months before the set-up\'s month, in tax-year order', () => {
    const june = { yearSetupComplete: true, startMonth: 6 };
    expect(beforeSetUp('2026-04', june)).toBe(true);
    expect(beforeSetUp('2026-05', june)).toBe(true);
    expect(beforeSetUp('2026-06', june)).toBe(false);
    expect(beforeSetUp('2027-03', june)).toBe(false);
    const jan = { yearSetupComplete: true, startMonth: 1 };   // a year set up from January: April to December come before it
    expect(beforeSetUp('2026-12', jan)).toBe(true);
    expect(beforeSetUp('2027-01', jan)).toBe(false);
    expect(beforeSetUp('2027-02', jan)).toBe(false);
    expect(beforeSetUp('2026-04', { yearSetupComplete: true, startMonth: 4 })).toBe(false);   // set up from April: nothing before it
    expect(beforeSetUp('2026-04', { yearSetupComplete: false, startMonth: 6 })).toBe(false); // not set up: the fill stops there instead
    expect(beforeSetUp('2026-04', { yearSetupComplete: true })).toBe(false);
    expect(beforeSetUp('2026-04', undefined)).toBe(false);
    expect(beforeSetUp('April', june)).toBe(false);
  });
  it('setUpShares: the totals spread evenly over the months before the set-up, the last month taking the pennies, adding up exactly', () => {
    const s = setUpShares('26/27', sep);
    expect(s.setUpMonth).toBe('2026-09');
    expect(s.months).toEqual(['2026-04', '2026-05', '2026-06', '2026-07', '2026-08']);
    expect(s.byMonth['2026-04']).toEqual({ gross: 2600, tax: 310.5, taxToDate: 310.5 });
    expect(s.byMonth['2026-08']).toEqual({ gross: 2600, tax: 310.5, taxToDate: 1552.5 });
    expect(s.taxEntered).toBe(true);
    // pennies that do not divide: the last month takes them, and the shares add up to the totals to the penny
    const odd = setUpShares('26/27', { ...sep, grossIncomeToDate: 10000.01, taxPaidToDate: 999.99 });
    expect(s.months.map((m) => odd.byMonth[m].gross)).toEqual([2000, 2000, 2000, 2000, 2000.01]);
    expect(s.months.map((m) => odd.byMonth[m].tax)).toEqual([199.99, 199.99, 199.99, 199.99, 200.03]);
    const add = (k) => Math.round(s.months.reduce((t, m) => t + odd.byMonth[m][k] * 100, 0));
    expect(add('gross')).toBe(1000001);
    expect(add('tax')).toBe(99999);
    expect(odd.byMonth['2026-08'].taxToDate).toBe(999.99);
    // no tax paid entered: the tax that income pays on its own, as the engine counts it
    const blank = setUpShares('26/27', { ...sep, taxPaidToDate: null, grossIncomeToDate: 20000 });
    expect(blank.taxEntered).toBe(false);
    expect(blank.tax).toBe(1486);   // (£20,000 − £12,570) × 20%
    // a year set up from April, not set up, or whose months left are twelve: nothing before it to share
    expect(setUpShares('26/27', { ...sep, startMonth: 4 })).toBe(null);
    expect(setUpShares('26/27', { ...sep, yearSetupComplete: false })).toBe(null);
    expect(setUpShares('nonsense', sep)).toBe(null);
    expect(setUpShares('26/27', { ...sep, remainingMonths: 12 }).gross).toBe(0);
  });
  it('setUpShareDecision: the month as worked out, its income and tax its share — other income and the State Pension first, the SIPP the rest — nothing tax-free, not cut, marked', () => {
    const d = { date: '2026-05', taxYear: '26/27', sippDraw: 2000, stdSipp: 2000, other: 300, statePension: 0, isaDraw: 500, monthlyTax: 250, totalMonthlyNet: 2550, taxPaidYTD: 500,
      boostAmount: 120, taxFree: 10, inProtection: true, protectionReason: 'below', drawFromEquity: 0, drawFromBond: 500, drawFromCash: 1500, giaBalance: 9000, giaBasis: 8000, giaDraw: 400, giaNet: 390, equity: 1, bond: 2, cash: 3, adjEquityMin: 7 };
    const out = setUpShareDecision(d, { gross: 2600, tax: 310.5, taxToDate: 621 });
    expect(out).toMatchObject({ sippDraw: 2300, stdSipp: 2300, other: 300, statePension: 0, isaDraw: 0, monthlyTax: 310.5, totalMonthlyNet: 2289.5, taxPaidYTD: 621,
      boostAmount: 0, taxFree: 0, inProtection: false, protectionReason: null, drawFromBond: 575, drawFromCash: 1725, giaDraw: 0, giaNet: 0, giaBalanceAfter: 9000, giaBasisAfter: 8000,
      equity: 1, bond: 2, cash: 3, adjEquityMin: 7, fromSetUp: true });
    expect(out.sippDraw + out.other + out.statePension).toBe(2600);
    // a share smaller than the fixed incomes: they take it all and the SIPP nothing, still adding up exactly
    const small = setUpShareDecision({ ...d, statePension: 900 }, { gross: 1000, tax: 0, taxToDate: 0 });
    expect([small.other, small.statePension, small.sippDraw]).toEqual([300, 700, 0]);
  });
  it('setUpShareDecision: other income and a State Pension that are not whole pennies a month (a twelfth of a year\'s figure) are rounded first, so the months add up to the set-up\'s total to the penny', () => {
    // £5,000 a year of other income (£416.666… a month) and a State Pension of £11,502.40 a year (£958.5333… a month): fictional
    const shares = setUpShares('26/27', { ...sep, grossIncomeToDate: 13000, taxPaidToDate: 1552.5 });
    const d = (m) => ({ date: m, taxYear: '26/27', sippDraw: 1500, other: 5000 / 12, statePension: 11502.4 / 12, monthlyTax: 200, drawFromEquity: 1500, drawFromBond: 0, drawFromCash: 0 });
    const out = shares.months.map((m) => setUpShareDecision(d(m), shares.byMonth[m]));
    expect(out[0].other).toBe(416.67);
    expect(out[0].statePension).toBe(958.53);
    for (const r of out) expect(Math.round((r.sippDraw + r.other + r.statePension) * 100)).toBe(Math.round(shares.byMonth[r.date].gross * 100));
    expect(Math.round(out.reduce((t, r) => t + (r.sippDraw + r.other + r.statePension) * 100, 0))).toBe(1300000);
    // every figure on the record is whole pennies
    for (const r of out) for (const k of ['sippDraw', 'other', 'statePension']) expect(Math.round(r[k] * 100) / 100).toBe(r[k]);
  });
  it('historyForEngine: leaves out only a month recorded from its set-up while it still comes before that set-up', () => {
    const recs = [{ date: '2026-05', taxYear: '26/27', fromSetUp: true }, { date: '2026-06', taxYear: '26/27', filledIn: true }, { date: '2026-09', taxYear: '26/27' }];
    expect(historyForEngine(recs, { '26/27': sep }).map((h) => h.date)).toEqual(['2026-06', '2026-09']);
    // the year set up again from April: the record comes back into view with the income it carries
    expect(historyForEngine(recs, { '26/27': { ...sep, startMonth: 4, remainingMonths: 12 } }).map((h) => h.date)).toEqual(['2026-05', '2026-06', '2026-09']);
    expect(historyForEngine(recs, null)).toBe(recs);
    expect(historyForEngine(null, {})).toEqual([]);
  });
  it('the offer takes them, with their share, and the help says where the figures come from and that the year\'s totals stay the same', () => {
    const history = [{ date: '2026-02' }];
    const taxYears = { '25/26': { yearSetupComplete: true, startMonth: 4 }, '26/27': { yearSetupComplete: true, startMonth: 6, remainingMonths: 10, grossIncomeToDate: 5000, taxPaidToDate: 0 } };
    const o = fillOffer(history, '2026-08', { taxYears, taxYearOf: ty });
    expect(o.months).toEqual(['2026-03', '2026-04', '2026-05', '2026-06', '2026-07']);
    expect(o.words).toBe('Fill in 5 months you did not record, March 2026 to July 2026, with these pension figures');
    expect(Object.keys(o.shares)).toEqual(['2026-04', '2026-05']);
    expect(o.shares['2026-04']).toEqual({ gross: 2500, tax: 0, taxToDate: 0 });
    expect(o.help).toBe('You set up 2026/27 from June 2026 and entered £5,000 of income received before then, with no tax on it. That is spread evenly over April 2026 and May 2026 (£2,500 a month before tax), and ticked, they are recorded as drawn from your pension, so the year\'s totals stay the same; the months from June 2026 on are worked out exactly as before. Only tick this if that money was pension you drew: if it was pay or other income, leave those months unrecorded. ' + FILL_HELP);
    // every missed month before the set-up: all of them on offer, with their share
    const only = fillOffer([{ date: '2026-03' }], '2026-06', { taxYears, taxYearOf: ty });
    expect(only.months).toEqual(['2026-04', '2026-05']);
    expect(Object.keys(only.shares)).toEqual(['2026-04', '2026-05']);
  });
  it('the help\'s sentences, said before the tick: what was entered at the set-up, that it is recorded as drawn from the pension, spread evenly, and to leave the months unrecorded when it was not pension; tax entered or not, part of the months, one month', () => {
    const s = (cfg, filled) => ({ ...setUpShares('26/27', cfg), filled });
    const only = 'Only tick this if that money was pension you drew: if it was pay or other income, leave those months unrecorded.';
    expect(setUpWords(s(sep))).toBe('You set up 2026/27 from September 2026 and entered £13,000 of income received before then, with £1,553 of tax on it. That is spread evenly over April 2026 to August 2026 (£2,600 a month before tax, £311 of tax), and ticked, they are recorded as drawn from your pension, so the year\'s totals stay the same; the months from September 2026 on are worked out exactly as before. ' + only);
    expect(setUpWords(s(sep, ['2026-06', '2026-07', '2026-08']))).toBe('You set up 2026/27 from September 2026 and entered £13,000 of income received before then, with £1,553 of tax on it. That is spread evenly over April 2026 to August 2026 (£2,600 a month before tax, £311 of tax), and ticked, June 2026 to August 2026 are recorded with their share, as drawn from your pension; the months from September 2026 on are worked out exactly as before. ' + only);
    expect(setUpWords(s({ ...sep, taxPaidToDate: null, grossIncomeToDate: 20000 }))).toBe('You set up 2026/27 from September 2026 and entered £20,000 of income received before then, but no tax on it, so the tax that income would pay by itself is used: £1,486. That is spread evenly over April 2026 to August 2026 (£4,000 a month before tax, £297 of tax), and ticked, they are recorded as drawn from your pension, so the year\'s totals stay the same; the months from September 2026 on are worked out exactly as before. ' + only);
    expect(setUpWords(s({ ...sep, taxPaidToDate: null, grossIncomeToDate: 10000 }))).toContain('but no tax on it, so the tax that income would pay by itself is used: none. That is spread evenly over April 2026 to August 2026 (£2,000 a month before tax), and ticked');
    expect(setUpWords(s({ ...sep, taxPaidToDate: 0 }))).toContain('entered £13,000 of income received before then, with no tax on it.');
    expect(setUpWords(s({ ...sep, startMonth: 5, remainingMonths: 11, grossIncomeToDate: 3000, taxPaidToDate: 100 }))).toBe('You set up 2026/27 from May 2026 and entered £3,000 of income received before then, with £100 of tax on it. That is the income for April 2026, and ticked, it is recorded as drawn from your pension, so the year\'s totals stay the same; the months from May 2026 on are worked out exactly as before. Only tick this if that money was pension you drew: if it was pay or other income, leave that month unrecorded.');
    expect(setUpWords(s(sep, ['2026-08']))).toContain('and ticked, August 2026 is recorded with its share, as drawn from your pension;');
  });
  it('a set-up given nothing as received: the months before it are never offered (nothing was drawn in them), so no offer at all, however long ago', () => {
    const nothing = { ...sep, grossIncomeToDate: 0, taxPaidToDate: null };
    expect(fillOffer([{ date: '2026-09' }, { date: '2026-10' }], '2026-11', { taxYears: { '26/27': nothing }, taxYearOf: ty })).toBe(null);
    expect(fillOffer([{ date: '2026-09' }, { date: '2026-10' }], '2026-11', { taxYears: { '26/27': nothing }, taxYearOf: ty, from: '2026-04' })).toBe(null);
    // a year and more later, every month recorded since the set-up: still nothing
    const since = Array.from({ length: 20 }, (_, i) => ({ date: addMonth('2026-09', i) }));
    expect(fillOffer(since, '2028-05', { taxYears: { '26/27': nothing, '27/28': { yearSetupComplete: true, startMonth: 4 } }, taxYearOf: ty })).toBe(null);
    // tax entered with nothing received is still something to record
    expect(fillOffer([{ date: '2026-09' }], '2026-10', { taxYears: { '26/27': { ...nothing, taxPaidToDate: 50 } }, taxYearOf: ty }).choices).toEqual(['2026-04', '2026-05', '2026-06', '2026-07', '2026-08']);
  });
  it('a tax year not set up among the months: the fill stops before its first month, the label counts only the months written, and the help says beforehand that the month in the box will not be recorded either, and how to set the year up', () => {
    // records to February 2026; 27/28 set up and the month in the box in it; 26/27 between them not set up
    const later = fillOffer([{ date: '2026-02' }], '2027-05', { taxYears: { '25/26': { yearSetupComplete: true, startMonth: 4 }, '27/28': { yearSetupComplete: true, startMonth: 4 } }, taxYearOf: ty });
    // the label counts and names only the months that will be written: those before the year not set up
    expect(later.months).toEqual(['2026-03']);
    expect(later.words).toBe('Fill in 1 month you did not record, March 2026, with these figures');
    expect(later.pending).toEqual([]);
    expect(later.notSetUp).toEqual({ key: '26/27', month: '2026-04' });
    expect(later.help).toBe('2026/27 is not set up, so the fill stops before April 2026, and May 2027 will not be recorded either until 2026/27 is set up. Set that year up first: put April 2026 in the month box and press Calculate (it is then set up from April, with nothing received before it). ' + FILL_HELP);
    // a start in the year not set up: nothing the fill could write, so no tick (months empty) and the reason alone
    const inIt = fillOffer([{ date: '2026-02' }], '2027-05', { taxYears: { '25/26': { yearSetupComplete: true, startMonth: 4 }, '27/28': { yearSetupComplete: true, startMonth: 4 } }, taxYearOf: ty, from: '2026-06' });
    expect(inIt.months).toEqual([]);
    expect(inIt.words).toBe('');
    expect(inIt.help).toBe('2026/27 is not set up, so the months from June 2026 cannot be filled in until it is. Set that year up first: put April 2026 in the month box and press Calculate (it is then set up from April, with nothing received before it).');
    // a start after it: from there, and the month in the box is recorded as usual
    expect(fillOffer([{ date: '2026-02' }], '2027-05', { taxYears: { '25/26': { yearSetupComplete: true, startMonth: 4 }, '27/28': { yearSetupComplete: true, startMonth: 4 } }, taxYearOf: ty, from: '2027-04' })).toMatchObject({ months: ['2027-04'], notSetUp: null });
    expect(notSetUpWords('27/28', '2027-06', '2027-09')).toBe('2027/28 is not set up, so the fill stops before June 2027, and September 2027 will not be recorded either until 2027/28 is set up. Set that year up first: put April 2027 in the month box and press Calculate (it is then set up from April, with nothing received before it).');
    expect(fillOffer([{ date: '2026-02' }], '2026-08').months.length).toBe(5);   // no tax years given: every missed month, worked out afresh
  });
  it('the month in the box\'s own tax year, not set up yet: its months are not offered yet, since the Calculate sets the year up from the month in the box; once it has, they are, with their share', () => {
    const taxYears = { '25/26': { yearSetupComplete: true, startMonth: 4 } };
    const words = 'April 2026 to August 2026 are not offered yet: their tax year will be set up from September 2026 when you press Calculate, with what you received in them, and they can then be filled in with their share of that.';
    // nothing else to offer (25/26 is recorded month by month): the help alone
    const all25 = [{ date: '2025-04' }, ...Array.from({ length: 11 }, (_, i) => ({ date: addMonth('2025-05', i) }))];
    expect(fillOffer(all25, '2026-09', { taxYears, taxYearOf: ty })).toEqual({
      months: [], from: null, to: null, words: '', choices: [], chosenFrom: null, widened: false, closed: false, shares: {}, setUp: [], notSetUp: null, pending: ['2026-04', '2026-05', '2026-06', '2026-07', '2026-08'], help: words
    });
    // once the Calculate has set 26/27 up from September with what came before, the same months are offered with their share
    const after = fillOffer(all25, '2026-09', { taxYears: { ...taxYears, '26/27': { ...sep } }, taxYearOf: ty });
    expect(after.months).toEqual(['2026-04', '2026-05', '2026-06', '2026-07', '2026-08']);
    expect(Object.keys(after.shares)).toEqual(after.months);
    // the earlier year's months stay in the chooser beside them; that year is not set up either, so nothing can be written yet
    const both = fillOffer([{ date: '2026-01' }], '2026-06', { taxYears: {}, taxYearOf: ty });
    expect(both.choices).toEqual(['2026-02', '2026-03']);
    expect(both.months).toEqual([]);
    expect(both.pending).toEqual(['2026-04', '2026-05']);
    expect(both.help).toBe('2025/26 is not set up, so the months from February 2026 cannot be filled in until it is. Set that year up first: put April 2025 in the month box and press Calculate (it is then set up from April, with nothing received before it). April 2026 and May 2026 are not offered yet: their tax year will be set up from June 2026 when you press Calculate, with what you received in them, and they can then be filled in with their share of that.');
    // set up already: offered as before
    expect(fillOffer([{ date: '2026-05' }], '2026-07', { taxYears: { '26/27': { yearSetupComplete: true, startMonth: 4 } }, taxYearOf: ty }).months).toEqual(['2026-06']);
    expect(pendingWords(['2026-06'], '2026-07')).toBe('June 2026 is not offered yet: its tax year will be set up from July 2026 when you press Calculate, with what you received in it, and it can then be filled in with its share of that.');
  });
  it('the months in words; the tax year in words; its April', () => {
    expect(monthsWords(['2026-07'])).toBe('July 2026');
    expect(monthsWords(['2026-07', '2026-08', '2026-09'])).toBe('July 2026 to September 2026');
    expect(monthsWords(['2026-12', '2027-01'])).toBe('December 2026 and January 2027');
    expect(monthsWords(['2026-12', '2027-01', '2027-02'])).toBe('December 2026 to February 2027');
    expect(monthsWords(['2026-03', '2026-06'])).toBe('March 2026 and June 2026');
    expect(monthsWords(['2026-03', '2026-06', '2026-07'])).toBe('March 2026, June 2026 and July 2026');
    expect(monthsWords([])).toBe('');
    expect(yearWords('26/27')).toBe('2026/27');
    expect(aprilOf('26/27')).toBe('2026-04');
    expect(aprilOf('2026')).toBe(null);
  });
});

describe('fill in from a month you choose: a person who started recording part-way through a tax year can fill in the months before their first record', () => {
  const ty = (s) => { const [y, m] = s.split('-').map(Number); const t = m >= 4 ? y : y - 1; return String(t % 100).padStart(2, '0') + '/' + String((t + 1) % 100).padStart(2, '0'); };
  const at = (...ms) => ms.map((date) => ({ date }));
  const sep = { yearSetupComplete: true, startMonth: 9, remainingMonths: 7, grossIncomeToDate: 13000, taxPaidToDate: 1552.5 };
  it('the chooser reaches back to the April of the earliest tax year set up, or the first record when that is earlier', () => {
    expect(earliestFillMonth(at('2026-09', '2026-11'), { '26/27': sep })).toBe('2026-04');
    expect(earliestFillMonth(at('2026-02', '2026-09'), { '26/27': sep })).toBe('2026-02');
    expect(earliestFillMonth(at('2026-09'), { '25/26': { yearSetupComplete: true, startMonth: 4 }, '26/27': sep, '24/25': { yearSetupComplete: false } })).toBe('2025-04');
    expect(earliestFillMonth(at('2026-09'), null)).toBe('2026-09');
    expect(earliestFillMonth([], { '26/27': { yearSetupComplete: false } })).toBe(null);
  });
  it('a year set up part-way with income before it, a gap inside the records: the default offers nothing, so the offer is closed (the quiet line, no tick); opened, April to August with their share', () => {
    // set up from September; September and November recorded, October in the box
    const o = fillOffer(at('2026-09', '2026-11'), '2026-10', { taxYears: { '26/27': sep }, taxYearOf: ty });
    expect(o).toMatchObject({ closed: true, months: [], words: '', help: '', chosenFrom: null, notSetUp: null });
    expect(o.choices).toEqual(['2026-04', '2026-05', '2026-06', '2026-07', '2026-08']);
    expect(MORE_WORDS).toBe('Fill in earlier months you did not record…');
    // opened at its earliest month (what the quiet line does): the widened offer, said before the tick
    const open = fillOffer(at('2026-09', '2026-11'), '2026-10', { taxYears: { '26/27': sep }, taxYearOf: ty, from: '2026-04' });
    expect(open.chosenFrom).toBe('2026-04');
    expect(open.months).toEqual(open.choices);
    expect(open.closed).toBe(false);
    expect(open.widened).toBe(true);
    expect(open.words).toBe('Fill in 5 months you did not record, April 2026 to August 2026, with these pension figures');
    expect(open.help).toBe(setUpWords(open.setUp[0]) + ' ' + FILL_HELP);
    expect(open.help.startsWith('You set up 2026/27 from September 2026 and entered £13,000 of income received before then, with £1,553 of tax on it.')).toBe(true);
    // a later month chosen: from there on
    const june = fillOffer(at('2026-09', '2026-11'), '2026-10', { taxYears: { '26/27': sep }, taxYearOf: ty, from: '2026-06' });
    expect(june.months).toEqual(['2026-06', '2026-07', '2026-08']);
    expect(june.words).toBe('Fill in 3 months you did not record, June 2026 to August 2026, with these pension figures');
    // a month that is not a choice (recorded, or after the box) falls back to the default: closed again
    expect(fillOffer(at('2026-09', '2026-11'), '2026-10', { taxYears: { '26/27': sep }, taxYearOf: ty, from: '2026-09' })).toMatchObject({ closed: true, chosenFrom: null });
    // a year later, every month recorded since: still only the quiet line, never a ready tick
    const since = at(...Array.from({ length: 20 }, (_, i) => addMonth('2026-09', i)));
    expect(fillOffer(since, '2028-05', { taxYears: { '26/27': sep, '27/28': { yearSetupComplete: true, startMonth: 4 } }, taxYearOf: ty })).toMatchObject({ closed: true, months: [] });
  });
  it('the default stays where 6.48.0\'s offer started; the chooser widens it to every month with no record — before the first record, inside the history and after the latest record alike', () => {
    // set up from April 2026; June and September recorded; December in the box
    const taxYears = { '26/27': { yearSetupComplete: true, startMonth: 4 } };
    const history = at('2026-06', '2026-09');
    const o = fillOffer(history, '2026-12', { taxYears, taxYearOf: ty });
    expect(o.chosenFrom).toBe('2026-10');
    expect(o.months).toEqual(['2026-10', '2026-11']);
    expect(o.widened).toBe(false);
    expect(o.words).toBe('Fill in 2 months you did not record, October 2026 and November 2026, with these figures');
    expect(o.closed).toBe(false);
    expect(o.choices).toEqual(['2026-04', '2026-05', '2026-07', '2026-08', '2026-10', '2026-11']);
    const wide = fillOffer(history, '2026-12', { taxYears, taxYearOf: ty, from: '2026-04' });
    expect(wide.months).toEqual(['2026-04', '2026-05', '2026-07', '2026-08', '2026-10', '2026-11']);
    expect(wide.widened).toBe(true);
    expect(wide.words).toBe('Fill in 6 months you did not record, April 2026, May 2026, July 2026, August 2026, October 2026 and November 2026, with these figures');
    expect(wide.shares).toEqual({});   // set up from April: every month worked out afresh
    // choosing 6.48.0's own first month is the default view again
    expect(fillOffer(history, '2026-12', { taxYears, taxYearOf: ty, from: '2026-10' }).words).toBe(o.words);
    expect(fillWords(['2026-07'])).toBe('Fill in 1 month you did not record, July 2026, with these figures');
  });
});

describe('the invariant, on the real engine: filling in the months before a part-year set-up leaves every month from the set-up on exactly as it was', () => {
  // Corpus 04's settings (Alex, Buckets in order: fictional), its 2026/27 set up from September with figures received
  // before it that are NOT five times the month's own draw — so a re-base that moved the figures would show. September
  // and October recorded; November is the month after the latest record. Records go through saveDecision (its
  // repository mocked above), the history the engine is handed through historyForEngine, as index.html hands it.
  const settings = fixture.decisionTool.settings;
  const E = 388200, B = 151900, C = 47600, NOW_ISO = '2026-11-03T09:00:00.000Z';
  const cases = [
    { name: 'no ISA, a target inside the basic-rate band, tax paid entered', salary: 31200, isa: 0, gross: 20000, tax: 3000 },
    { name: 'an ISA and a target above the basic-rate band, tax paid entered', salary: 70000, isa: 25000, gross: 25000, tax: 3000 },
    { name: 'an ISA, no tax paid entered', salary: 70000, isa: 25000, gross: 25000, tax: null },
    { name: 'other income of £5,000 a year (not whole pennies a month), tax paid entered', salary: 31200, isa: 0, gross: 13000, tax: 1552.5, other: 5000 }
  ];
  for (const c of cases) {
    it(c.name, async () => {
      const cfg = { ...fixture.decisionTool.taxYears['26/27'], confirmedSalary: c.salary, startMonth: 9, remainingMonths: 7, grossIncomeToDate: c.gross, taxPaidToDate: c.tax, ...(c.other ? { other: c.other } : {}) };
      const taxYears = { '26/27': cfg };
      const before = JSON.parse(JSON.stringify(taxYears));
      stored.length = 0;
      const engine = (date) => calcDecisionPWA(date, E, B, C, { settings, history: historyForEngine(stored.slice().sort((a, b) => a.date.localeCompare(b.date)), taxYears), allTaxYears: taxYears, spInfo: { amount: 0 }, isaBalance: c.isa, sourcingMode: 'ordered', bucketBand: 0.1 });
      for (const m of ['2026-09', '2026-10']) await saveDecision(await engine(m));
      const nextBefore = await engine('2026-11');
      // the fill, as the entry form does it: from April, each month worked out, then its share, then saved with the marks
      const offer = fillOffer(stored, '2026-11', { taxYears, taxYearOf: (s) => (s >= '2026-04' && s < '2027-04' ? '26/27' : 'x'), from: '2026-04' });
      expect(offer.months).toEqual(['2026-04', '2026-05', '2026-06', '2026-07', '2026-08']);
      for (const m of offer.months) await saveDecision({ ...setUpShareDecision(await engine(m), offer.shares[m]), ...fillMarks(NOW_ISO), paidAhead: false });
      const nextAfter = await engine('2026-11');
      // to the penny, every field
      expect(nextAfter).toEqual(nextBefore);
      // the year's totals: the five months carry exactly what the set-up was given
      const filled = stored.filter((h) => h.fromSetUp);
      expect(filled.map((h) => h.date)).toEqual(offer.months);
      expect(filled.every((h) => h.filledIn === true && h.filledInOn === NOW_ISO)).toBe(true);
      expect(Math.round(filled.reduce((t, h) => t + (h.sipp + h.other + h.state) * 100, 0))).toBe(Math.round(c.gross * 100));
      if (c.other) expect(filled.every((h) => h.other === 416.67)).toBe(true);   // the engine's twelfth, to the penny
      const taxTotal = c.tax == null ? setUpShares('26/27', cfg).tax : c.tax;
      expect(Math.round(filled.reduce((t, h) => t + h.monthlyTax * 100, 0))).toBe(Math.round(taxTotal * 100));
      expect(filled[4].taxPaidYTD).toBe(taxTotal);
      expect(filled.every((h) => h.isa === 0 && !h.inProtection && h.equity === E && h.bond === B && h.cash === C)).toBe(true);
      // the set-up is left exactly as it was entered
      expect(taxYears).toEqual(before);
      // what keeps it: handed the history with those months in it, the engine counts their income twice
      const raw = await calcDecisionPWA('2026-11', E, B, C, { settings, history: stored.slice().sort((a, b) => a.date.localeCompare(b.date)), allTaxYears: taxYears, spInfo: { amount: 0 }, isaBalance: c.isa, sourcingMode: 'ordered', bucketBand: 0.1 });
      expect(raw).not.toEqual(nextBefore);
    });
  }
  // why the set-up is not moved to April instead (the first design): the engine plans a part-year set-up over the months
  // left, net of what came before, and spreads the tax still to pay over those months; a full-year set-up plans twelve
  // months and spreads the year's tax over twelve — so with the shares on record and the set-up moved to April, the next
  // month is not what it was. With an ISA and a target above the basic-rate band the SIPP draw moves; without an ISA, the tax.
  for (const c of [
    { name: 'an ISA and a target above the basic-rate band: the SIPP draw moves', salary: 70000, isa: 25000, gross: 25000, tax: 3000, field: 'sippDraw' },
    { name: 'no ISA: the month\'s tax moves', salary: 31200, isa: 0, gross: 20000, tax: 3000, field: 'monthlyTax' }
  ]) {
    it('why the set-up is not moved to April instead — ' + c.name, async () => {
      const cfg = { ...fixture.decisionTool.taxYears['26/27'], confirmedSalary: c.salary, startMonth: 9, remainingMonths: 7, grossIncomeToDate: c.gross, taxPaidToDate: c.tax };
      stored.length = 0;
      const run = (date, taxYears) => calcDecisionPWA(date, E, B, C, { settings, history: historyForEngine(stored.slice().sort((a, b) => a.date.localeCompare(b.date)), taxYears), allTaxYears: taxYears, spInfo: { amount: 0 }, isaBalance: c.isa, sourcingMode: 'ordered', bucketBand: 0.1 });
      for (const m of ['2026-09', '2026-10']) await saveDecision(await run(m, { '26/27': cfg }));
      const kept = await run('2026-11', { '26/27': cfg });
      const shares = setUpShares('26/27', cfg);
      for (const m of shares.months) await saveDecision({ ...setUpShareDecision(await run(m, { '26/27': cfg }), shares.byMonth[m]), ...fillMarks(NOW_ISO) });
      const april = { ...cfg, startMonth: 4, remainingMonths: 12, grossIncomeToDate: 0, taxPaidToDate: null };
      const moved = await run('2026-11', { '26/27': april });
      expect(Math.abs(moved[c.field] - kept[c.field])).toBeGreaterThan(100);
    });
  }
});

describe('the words', () => {
  it('month labels', () => {
    expect(monthLabel('2026-07')).toBe('July 2026');
    expect(monthLabel('')).toBe('');
    expect(monthLabel(null)).toBe('');
    expect(monthLabel('not a month')).toBe('not a month');
  });
  it('the tick: one wording, one month, two, or first to last; "pension figures" when some months take a set-up\'s figures', () => {
    expect(fillWords(['2026-07'])).toBe('Fill in 1 month you did not record, July 2026, with these figures');
    expect(fillWords(['2026-07', '2026-08'])).toBe('Fill in 2 months you did not record, July 2026 and August 2026, with these figures');
    expect(fillWords(['2026-12', '2027-01', '2027-02'])).toBe('Fill in 3 months you did not record, December 2026 to February 2027, with these figures');
    expect(fillWords(['2026-04', '2026-05'], true)).toBe('Fill in 2 months you did not record, April 2026 and May 2026, with these pension figures');
    expect([0, 1, 2, 12, 13].map(countWords)).toEqual(['no', 'one', 'two', 'twelve', '13']);
  });
  it('the help text says what is written, when to use it, and that the records are a fair picture, not exact ones', () => {
    expect(FILL_HELP).toBe('One record for each month, worked out in order with the pension figures above, marked as filled in later. '
      + 'Use it when you drew the same amount each month and did not record it at the time. '
      + 'The figures were not the pot\'s on those months, so the records are a fair picture, not exact ones.');
  });
  it('the line under Calculate / Save, state by state', () => {
    expect(saveStateWords('none', { month: '2026-09' })).toBe('Press Calculate to work out September 2026.');
    expect(saveStateWords('calculated', { month: '2026-09' })).toBe('');
    expect(saveStateWords('saved', { month: '2026-09' })).toBe('September 2026 saved. To record another month, change the month and press Calculate.');
    expect(saveStateWords('saved', { month: '2026-09', filled: ['2026-08'] })).toBe('September 2026 saved, with August 2026 filled in. To record another month, change the month and press Calculate.');
    expect(saveStateWords('saved', { month: '2026-09', filled: ['2026-07', '2026-08'] })).toBe('September 2026 saved, with July 2026 and August 2026 filled in. To record another month, change the month and press Calculate.');
    expect(saveStateWords('saved', { month: '2026-09', through: '2026-11' })).toBe('September 2026 to November 2026 saved. To record another month, change the month and press Calculate.');
    expect(saveStateWords('saved', { month: '2026-09', through: '2026-09' })).toBe('September 2026 saved. To record another month, change the month and press Calculate.');
    expect(saveStateWords('changed')).toBe('Changed since the last calculation: press Calculate again.');
    expect(saveStateWords('failed', { month: '2026-10' })).toBe('October 2026 could not be worked out — see the message in the panel. Put it right and press Calculate again.');
    expect(saveStateWords('stopped', { words: 'the stop\'s own words' })).toBe('the stop\'s own words');
    expect(saveStateWords('nonsense')).toBe('');
    // the month in the box worked out again after a fill, and moved: said between what was saved and what to do next
    expect(saveStateWords('saved', { month: '2026-09', filled: ['2026-07', '2026-08'], recalc: 'What moved.' })).toBe('September 2026 saved, with July 2026 and August 2026 filled in. What moved. To record another month, change the month and press Calculate.');
    // a write failed after filled-in months went in: Save waits for a Calculate that sees them
    expect(saveStateWords('interrupted', { month: '2026-09', filled: ['2026-07'] })).toBe('July 2026 was filled in before the save failed, and September 2026 was not recorded. Press Calculate to work it out again with that month on record.');
    expect(saveStateWords('interrupted', { month: '2026-10', filled: ['2026-07', '2026-08'] })).toBe('July 2026 and August 2026 were filled in before the save failed, and October 2026 was not recorded. Press Calculate to work it out again with those months on record.');
    // an empty month box still reads as a sentence
    expect(saveStateWords('none', { month: '' })).toBe('Press Calculate to work out this month.');
    expect(saveStateWords('failed', { month: '' })).toBe('This month could not be worked out — see the message in the panel. Put it right and press Calculate again.');
  });
  it('what moved when the month in the box was worked out again after a fill: the panel\'s headline figures, to the pound', () => {
    const before = { date: '2026-09', sippDraw: 2600, totalMonthlyNet: 2290.4, inProtection: false };
    expect(recalcWords(before, { ...before, sippDraw: 2340, totalMonthlyNet: 2064.2, inProtection: true })).toBe('September 2026 was worked out again with the filled-in months on record, and the recommendation changed: SIPP withdrawal £2,340 a month (it was £2,600); income after tax £2,064 a month (it was £2,290); now in Protection Mode.');
    expect(recalcWords({ ...before, inProtection: true }, { ...before, inProtection: false })).toBe('September 2026 was worked out again with the filled-in months on record, and the recommendation changed: no longer in Protection Mode.');
    expect(recalcWords(before, { ...before, totalMonthlyNet: 2250 })).toBe('September 2026 was worked out again with the filled-in months on record, and the recommendation changed: income after tax £2,250 a month (it was £2,290).');
    // nothing moved to the pound: nothing said
    expect(recalcWords(before, { ...before, sippDraw: 2600.2, totalMonthlyNet: 2290.1 })).toBe('');
    expect(recalcWords(before, { ...before, totalMonthlyNet: undefined })).toBe('');
    expect(recalcWords(null, before)).toBe('');
  });
  it('the stop at a tax year not set up: which year, how to set it up, and that the month in the box was not recorded', () => {
    expect(fillStoppedWords(2, '2027-06', '2027-04', '27/28')).toBe('Recorded two months; the fill stopped before April 2027 because 2027/28 is not set up. Set it up first: put April 2027 in the month box and press Calculate. June 2027 was not recorded.');
    expect(fillStoppedWords(0, '2027-06', '2026-11', '26/27')).toBe('Nothing was recorded; the fill stopped before November 2026 because 2026/27 is not set up. Set it up first: put April 2026 in the month box and press Calculate. June 2027 was not recorded.');
    // without the month it stopped at: the batch's own words
    expect(fillStoppedWords(2, '2027-06')).toBe('Recorded two months — the next tax year needs setting up first (enter its first month). June 2027 was not recorded.');
    expect(fillStoppedWords(1, '2027-06')).toMatch(/^Recorded one month — /);
    expect(fillStoppedWords(0, '2027-06')).toMatch(/^Nothing was recorded — /);
  });
  it('the spinner counts', () => {
    expect(savingProgress(3, 5)).toBe('Saving 3 of 5…');
  });
  it('never "backfill" on screen', () => {
    const onScreen = [FILL_HELP, MORE_WORDS, fillWords(['2026-07', '2026-08']), fillWords(['2026-04', '2026-05'], true), refusedMonthWords([], '2026-09', { '26/27': { yearSetupComplete: true, startMonth: 10, remainingMonths: 6, grossIncomeToDate: 1000 } }, () => '26/27'),
      deleteButtonWords([{ fromSetUp: true }, { fromSetUp: true }], '26/27'), pendingWords(['2026-04', '2026-05'], '2026-06'), fillStoppedWords(1, '2026-09'), fillStoppedWords(1, '2026-09', '2026-04', '26/27'),
      setUpWords({ ...setUpShares('26/27', { yearSetupComplete: true, startMonth: 9, remainingMonths: 7, grossIncomeToDate: 13000, taxPaidToDate: null }), filled: ['2026-06'] }), notSetUpWords('26/27', '2026-04'),
      filledInNote({ filledIn: true, filledInOn: '2026-09-30T08:00:00.000Z' }), filledInNote({ filledIn: true, filledInOn: '2026-09-30T08:00:00.000Z', fromSetUp: true }),
      recalcWords({ date: '2026-09', sippDraw: 2600, inProtection: false }, { date: '2026-09', sippDraw: 2340, inProtection: true }),
      ...['none', 'calculated', 'saved', 'changed', 'failed', 'interrupted'].map((s) => saveStateWords(s, { month: '2026-09', filled: ['2026-07'] }))];
    for (const w of onScreen) expect(w).not.toMatch(/backfill/i);
    const markup = readFileSync('index.html', 'utf8');
    expect(markup).not.toMatch(/backfill/i);
  });
});

describe('the marks', () => {
  it('fillMarks: that it was, and when', () => {
    expect(fillMarks('2026-09-30T08:00:00.000Z')).toEqual({ filledIn: true, filledInOn: '2026-09-30T08:00:00.000Z' });
  });
  it('isFilledIn reads only the true flag', () => {
    expect(isFilledIn({ filledIn: true })).toBe(true);
    expect(isFilledIn({ filledIn: 'yes' })).toBe(false);
    expect(isFilledIn({})).toBe(false);
    expect(isFilledIn(null)).toBe(false);
  });
  it('the date from the instant\'s date part, so it never moves with the time zone', () => {
    expect(dateLabel('2026-09-30T23:30:00.000Z')).toBe('30 September 2026');
    expect(dateLabel('2026-11-03T00:10:00.000Z')).toBe('3 November 2026');
    expect(dateLabel('')).toBe('');
    expect(dateLabel(undefined)).toBe('');
  });
  it('the History view\'s label and the record\'s sentence; nothing for an ordinary record', () => {
    const r = { filledIn: true, filledInOn: '2026-09-30T08:00:00.000Z' };
    expect(filledInLabel(r)).toBe('Filled in later on 30 September 2026');
    expect(filledInLabel({ filledIn: true })).toBe('Filled in later');
    expect(filledInLabel(fixture.decisionTool.history[0])).toBe('');
    expect(filledInNote(r)).toBe('Filled in later on 30 September 2026, with the pension figures entered for a later month: a fair picture of this month, not an exact one.');
    expect(filledInNote({})).toBe('');
    // a month recorded from its tax year's set-up says where its income and tax came from
    expect(filledInNote({ ...r, fromSetUp: true })).toBe('Filled in later on 30 September 2026. Its income and tax are its share of what you entered, when you set up the tax year, as received before the month you set it up from, recorded as drawn from your pension; its pension figures are the ones entered for a later month: a fair picture of this month, not an exact one.');
  });
  it('saveDecision carries the marks onto the stored record, and an ordinary record carries neither key', async () => {
    stored.length = 0;
    const base = { date: '2026-07', sippDraw: 2600, taxYear: '26/27', equity: 368100, bond: 150400, cash: 55100 };
    await saveDecision({ ...base, ...fillMarks('2026-09-30T08:00:00.000Z') });
    await saveDecision({ ...base, date: '2026-09' });
    expect(stored.length).toBe(2);
    expect(stored[0].date).toBe('2026-07');
    expect(stored[0].filledIn).toBe(true);
    expect(stored[0].filledInOn).toBe('2026-09-30T08:00:00.000Z');
    expect('filledIn' in stored[1]).toBe(false);
    expect('filledInOn' in stored[1]).toBe(false);
    // the marks are the only difference between the two records' shapes
    const keys = (r) => Object.keys(r).filter((k) => k !== 'filledIn' && k !== 'filledInOn' && k !== 'date').sort();
    expect(keys(stored[0])).toEqual(keys(stored[1]));
    // a month recorded from its tax year's set-up carries that mark too, and only then
    await saveDecision({ ...base, date: '2026-05', ...fillMarks('2026-09-30T08:00:00.000Z'), fromSetUp: true });
    expect(stored[2].fromSetUp).toBe(true);
    expect('fromSetUp' in stored[0]).toBe(false);
    expect('fromSetUp' in stored[1]).toBe(false);
  });
});

describe('a gap inside the history is offered too (the verifier\'s walk, 3 Nov 2026)', () => {
  const at = (...ms) => ms.map((date) => ({ date }));
  it('the latest record before the month in the box', () => {
    expect(latestRecordedBefore(at('2026-04', '2026-05', '2026-06', '2026-09'), '2026-08')).toBe('2026-06');
    expect(latestRecordedBefore(at('2026-09', '2026-04'), '2026-04')).toBe(null);
    expect(latestRecordedBefore(at('2026-04'), 'nonsense')).toBe(null);
  });
  it('June and September recorded: August in the box offers July; September in the box offers nothing (it is recorded); a month before the first record offers nothing (no tax year known to reach back to)', () => {
    const history = at('2026-04', '2026-05', '2026-06', '2026-09');
    expect(fillOffer(history, '2026-08')).toMatchObject({ months: ['2026-07'], words: 'Fill in 1 month you did not record, July 2026, with these figures' });
    expect(fillOffer(history, '2026-07')).toBe(null);
    expect(fillOffer(history, '2026-09')).toBe(null);
    expect(fillOffer(history, '2026-03')).toBe(null);
    expect(fillOffer(history, '2026-11')).toMatchObject({ months: ['2026-10'] });
  });
});

describe('the month in the box before its own tax year\'s set-up: refused at Calculate, filled in from a later month instead', () => {
  const ty = (s) => { const [y, m] = s.split('-').map(Number); const t = m >= 4 ? y : y - 1; return String(t % 100).padStart(2, '0') + '/' + String((t + 1) % 100).padStart(2, '0'); };
  // a year set up from October with £12,000 received and £1,000 of tax before it (fictional figures); October recorded
  const oct = { yearSetupComplete: true, startMonth: 10, remainingMonths: 6, grossIncomeToDate: 12000, taxPaidToDate: 1000 };
  const history = [{ date: '2026-10', taxYear: '26/27' }];
  it('September in the box: refused before the engine runs, with what to do instead; October and later, and a year set up from April, are not', () => {
    expect(refusedMonthWords(history, '2026-09', { '26/27': oct }, ty)).toBe('September 2026 comes before your 2026/27 set-up: you set the year up from October 2026 and entered £12,000 of income received before then, which already counts September 2026. To record it, put a later month in the box, press Calculate and fill in earlier months from there: September 2026 then takes its share.');
    expect(refusedMonthWords(history, '2026-04', { '26/27': oct }, ty)).toContain('April 2026 comes before your 2026/27 set-up');
    expect(refusedMonthWords(history, '2026-11', { '26/27': oct }, ty)).toBe('');
    expect(refusedMonthWords(history, '2026-09', { '26/27': { ...oct, startMonth: 4, remainingMonths: 12 } }, ty)).toBe('');
    expect(refusedMonthWords(history, '2026-09', {}, ty)).toBe('');   // not set up: the wizard runs instead, from this month
    expect(refusedMonthWords(history, '2026-09', null, ty)).toBe('');
    // nothing received before the set-up: nothing to record, and how to set the year up again if there was
    expect(refusedMonthWords(history, '2026-09', { '26/27': { ...oct, grossIncomeToDate: 0, taxPaidToDate: null } }, ty)).toBe('September 2026 comes before your 2026/27 set-up: you set the year up from October 2026 with nothing received before then. If you did draw from your pension in September 2026, set the year up again from an earlier month (Tax Years, Reconfigure via Wizard), then press Calculate with that month in the box.');
  });
  it('a month already recorded: refused as before, in the same words', () => {
    expect(refusedMonthWords(history, '2026-10', { '26/27': oct }, ty)).toBe('October 2026 already has a saved decision. Delete it from the History tab first to recalculate.');
    expect(refusedMonthWords([{ date: '2026-10' }], '2026-10')).toBe('October 2026 already has a saved decision. Delete it from the History tab first to recalculate.');
  });
  it('from November, the fill takes September with its share like the months before it, so the year\'s totals hold', () => {
    const o = fillOffer(history, '2026-11', { taxYears: { '26/27': oct }, taxYearOf: ty });
    expect(o.closed).toBe(true);
    const open = fillOffer(history, '2026-11', { taxYears: { '26/27': oct }, taxYearOf: ty, from: '2026-04' });
    expect(open.months).toEqual(['2026-04', '2026-05', '2026-06', '2026-07', '2026-08', '2026-09']);
    expect(Object.keys(open.shares)).toEqual(open.months);
    expect(Math.round(open.months.reduce((t, m) => t + open.shares[m].gross * 100, 0))).toBe(1200000);
    expect(open.shares['2026-09'].taxToDate).toBe(1000);
  });
  it('index.html: Calculate asks refusedMonthWords before the engine runs, and says it on the page as well as in the toast', () => {
    const html = readFileSync('index.html', 'utf8');
    const f = html.slice(html.indexOf('window.handleDecisionSubmit'), html.indexOf('window.saveCurrentDecision'));
    const at = f.indexOf('refusedMonthWords(');
    expect(at).toBeGreaterThan(0);
    expect(at).toBeLessThan(f.indexOf('checkWizardNeeded(dateStr)'));
    expect(f).toContain('if (refused) { showToast(refused, \'error\', 8000); monthEntry.failed(dateStr, refused); return; }');
  });
});

describe('undoing a fill from the History view never costs a real record', () => {
  const ty = (s) => { const [y, m] = s.split('-').map(Number); const t = m >= 4 ? y : y - 1; return String(t % 100).padStart(2, '0') + '/' + String((t + 1) % 100).padStart(2, '0'); };
  const sep = { yearSetupComplete: true, startMonth: 9, remainingMonths: 7, grossIncomeToDate: 11000, taxPaidToDate: 900 };
  const r = (date, extra = {}) => ({ date, taxYear: ty(date), ...extra });
  // April to August filled in from the set-up; September and October recorded; a record of the year before
  const history = [r('2026-03'), ...['2026-04', '2026-05', '2026-06', '2026-07', '2026-08'].map((d) => r(d, { filledIn: true, fromSetUp: true })), r('2026-09'), r('2026-10')];
  const dates = (list) => list.map((h) => h.date);
  it('a month filled in from the set-up takes only the later such months with it; the records from the set-up on stay', () => {
    expect(dates(recordsToDelete(history, '2026-04', { '26/27': sep }, ty))).toEqual(['2026-04', '2026-05', '2026-06', '2026-07', '2026-08']);
    expect(dates(recordsToDelete(history, '2026-07', { '26/27': sep }, ty))).toEqual(['2026-07', '2026-08']);
    expect(dates(recordsToDelete(history, '2026-08', { '26/27': sep }, ty))).toEqual(['2026-08']);
  });
  it('any other record: it and every later one in its tax year, as before; a year set up again from April reads the filled-in months, so they cascade too', () => {
    expect(dates(recordsToDelete(history, '2026-09', { '26/27': sep }, ty))).toEqual(['2026-09', '2026-10']);
    expect(dates(recordsToDelete(history, '2026-10', { '26/27': sep }, ty))).toEqual(['2026-10']);
    expect(dates(recordsToDelete(history, '2026-03', { '26/27': sep }, ty))).toEqual(['2026-03']);
    expect(dates(recordsToDelete(history, '2026-04', { '26/27': { ...sep, startMonth: 4, remainingMonths: 12 } }, ty))).toEqual(['2026-04', '2026-05', '2026-06', '2026-07', '2026-08', '2026-09', '2026-10']);
    expect(dates(recordsToDelete(history, '2026-04', null, ty))).toEqual(['2026-04', '2026-05', '2026-06', '2026-07', '2026-08', '2026-09', '2026-10']);
    // a record with no tax year on it is placed by its date
    expect(dates(recordsToDelete([{ date: '2026-05' }, { date: '2026-06' }, { date: '2027-04' }], '2026-05', {}, ty))).toEqual(['2026-05', '2026-06']);
    expect(recordsToDelete(history, '2026-12', { '26/27': sep }, ty)).toEqual([]);
  });
  it('the button says what it takes', () => {
    expect(deleteButtonWords(recordsToDelete(history, '2026-04', { '26/27': sep }, ty), '26/27')).toBe('Delete this & the later months filled in from the set-up');
    expect(deleteButtonWords(recordsToDelete(history, '2026-09', { '26/27': sep }, ty), '26/27')).toBe('Delete this & later months in 26/27');
    expect(deleteButtonWords(recordsToDelete(history, '2026-08', { '26/27': sep }, ty), '26/27')).toBe('Delete Entry');
    expect(deleteButtonWords([], '26/27')).toBe('Delete Entry');
  });
  it('index.html: the History view\'s delete and its button both go through recordsToDelete', () => {
    const html = readFileSync('index.html', 'utf8');
    const del = html.slice(html.indexOf('window.deleteHistoryEntry'), html.indexOf('window.deleteHistoryForTaxYear'));
    expect(del).toContain('recordsToDelete(');
    expect(del).not.toContain('slice(entryIndex)');
    expect(html).toContain('deleteButtonWords(recordsToDelete(allHistoryData, h.date, historyTaxYears, getTaxYearFromDateStr), h.taxYear)');
  });
});
