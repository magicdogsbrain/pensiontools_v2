/**
 * Month by month: fill in the months that were not recorded, and say why Save is off (3 November 2026).
 *
 * "I guess there is some way to come in to the tool a few months later and just backfill the unsaved months with the
 * same data, to have a complete (albeit not 100% accurate) idea of the history. Especially if you are just withdrawing
 * the same amount." There was not: a month that was missed could only be entered one at a time, with the figures of
 * that month. And "The Save to History button is literally disabled": after a save the button stayed off until the
 * next Calculate, and nothing on the page said so.
 *
 * Now the entry form offers to fill in the months with no record before the month in the box, with the figures typed
 * for this month: one record each, worked out in date order by the same calculation as a normal month (so each sees the
 * records before it — tax to date, ISA used, protection), marked as filled in later with the date. The figures are the
 * ones we chose: the same pension figures for every month, nothing invented between them (no growth, no draw-downs) —
 * so the records are a fair picture of those months, not exact ones, and the mark says so. And a line under the
 * Calculate / Save row says what the Save button is waiting for.
 *
 * Which months. By default the months between the latest record before the month in the box and that month, as 6.48.0
 * offered them, with a "Start from" chooser beside the tick. 6.48.0 never reached a month before the first record, so a
 * person who started recording part-way through a tax year could not fill in the months before it: the chooser reaches
 * back to the April of the earliest tax year that is set up, or the first record's month when that is earlier, and the
 * fill then takes EVERY month with no record from there — before the first record, inside the history and after the
 * latest record alike. When the default offers nothing, the box shows one quiet line that opens the chooser rather than
 * a ready tick: the earlier months stay in reach without being pressed on anyone each month, for years. A month before
 * a set-up that was given nothing as received is never offered: nothing was drawn in it, so there is nothing to fill in.
 *
 * A month before the month its tax year was set up from (beforeSetUp): that set-up (the wizard's mid-year path) took
 * the income and tax already received that year as two totals, and the engine works out the months from the set-up on
 * against them. 6.48.0 left such a month out, so a person who came to the tool part-way could never fill in the months
 * they had drawn before it. Now the month is recorded with its share of those totals (setUpShares: spread evenly over the
 * months before the set-up, the last month taking the pennies) instead of a fresh calculation, the pension figures being
 * the ones typed, and the record carries `fromSetUp`. The set-up asks for pay and other income received as well as
 * pension drawn, and the record is a pension draw: the help says so before the tick, and to leave those months
 * unrecorded when the money was not pension. The set-up itself is left exactly as entered, and the engine is
 * handed the history without those records while their months still come before the set-up (historyForEngine): the
 * set-up already counts their income, so every month from the set-up on is worked out exactly as before — to the penny.
 * Undone from the History view, such a month takes only the later such months with it (recordsToDelete), never the
 * records from the set-up on, which never read it. The month in the box itself, when it comes before its tax year's set-up, is refused at Calculate (refusedMonthWords): the
 * set-up already counts what was received in it, and worked out on its own it would be counted twice; filled in from a
 * later month it takes its share instead.
 * Moving the set-up to April instead (a full-year set-up, the to-date figures dropped, the shares on the records) was
 * the first design, and it cannot keep that without changing the engine: the engine plans a part-year set-up over the
 * months left, net of what came before (the SIPP draw up to the basic-rate band, the ISA top-up), and spreads the year's
 * tax still to pay over those months; a full-year set-up plans twelve months and spreads the whole year's tax over twelve.
 * The two agree only when what came before happens to match, month for month, a full year's draw and tax. On fictional plans the next month's
 * SIPP draw moved by hundreds of pounds a month with an ISA and a target above the band, and its tax by over £100 without
 * one (tests/monthFill.test.js "the invariant"). So the set-up stays as entered, and nothing in the tax years is written.
 *
 * A missed month in the tax year of the month in the box, while that year is not set up, is not offered (pending): the
 * Calculate for the month in the box sets the year up from that month and asks what was received before it; once it
 * has, those months come before the set-up and are offered with their share. A tax year that is not set up, among the
 * months chosen, stops the fill before its first month, and the month in the box is then not recorded either: the label
 * counts only the months that will be written, and the help says so beforehand and how to set that year up.
 *
 * Pure: no storage, no DOM. The entry form's side (src/ui/monthFillEntry.js) does the writing, through saveDecision
 * alone, and DecisionService.saveDecision carries the marks onto the record.
 */
import { calculateTax } from './TaxCalculator.js';

export const MONTH_NAMES = Object.freeze(['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']);

const YM = /^\d{4}-\d{2}$/;
const KEY = /^(\d{2})\/(\d{2})$/;

/** 'YYYY-MM' moved by k months (k may be negative). */
export function addMonth(ym, k) {
  const [y, m] = ym.split('-').map(Number);
  const d = new Date(Date.UTC(y, m - 1 + k, 1));
  return d.getUTCFullYear() + '-' + String(d.getUTCMonth() + 1).padStart(2, '0');
}

/** 'July 2026' for '2026-07'; anything that is not a month comes back as it is. */
export function monthLabel(ym) {
  if (typeof ym !== 'string' || !YM.test(ym)) return String(ym == null ? '' : ym);
  const [y, m] = ym.split('-').map(Number);
  return (MONTH_NAMES[m - 1] || ym) + ' ' + y;
}

/** '2026/27' for the Decision tool's key '26/27'. */
export function yearWords(key) {
  const k = KEY.exec(String(key || ''));
  return k ? '20' + k[1] + '/' + k[2] : String(key || '');
}

/** The April a tax year starts in, 'YYYY-MM', from its key ('26/27' → '2026-04'); null for anything else. */
export function aprilOf(key) {
  const k = KEY.exec(String(key || ''));
  return k ? '20' + k[1] + '-04' : null;
}

const monthOf = (h) => (h && typeof h.date === 'string' && YM.test(h.date.slice(0, 7)) ? h.date.slice(0, 7) : null);

/** The latest recorded month ('YYYY-MM'), whatever order the history is in; null when nothing is recorded. */
export function latestRecordedMonth(history) {
  let latest = null;
  for (const h of Array.isArray(history) ? history : []) {
    const d = monthOf(h);
    if (d && (latest === null || d > latest)) latest = d;
  }
  return latest;
}

/**
 * The latest recorded month BEFORE a chosen month ('YYYY-MM'); null when nothing is recorded before it. The default
 * offer counts the missed months from here, so a gap inside the history is offered as well as one after it: June and
 * September recorded, August in the box, July is offered (the preview hands a person over on the earliest month missed).
 */
export function latestRecordedBefore(history, chosen) {
  if (typeof chosen !== 'string' || !YM.test(chosen)) return null;
  return latestRecordedMonth((Array.isArray(history) ? history : []).filter((h) => monthOf(h) && monthOf(h) < chosen));
}

/**
 * The months with no record between the latest record and the chosen month, in date order: '2026-06' recorded and
 * '2026-09' chosen gives ['2026-07', '2026-08']. None when the chosen month is the next month, the same month, earlier,
 * or when nothing is recorded yet. Calendar- and tax-year boundaries are just months here.
 */
export function missedMonths(latest, chosen) {
  if (typeof latest !== 'string' || !YM.test(latest) || typeof chosen !== 'string' || !YM.test(chosen)) return [];
  const out = [];
  for (let m = addMonth(latest, 1); m < chosen; m = addMonth(m, 1)) out.push(m);
  return out;
}

/** Whether a tax year's settings say it is set up (TaxYearWizardService.shouldShowWizard asks the same). */
const isSetUp = (config) => !!(config && config.yearSetupComplete === true);
/** A month's place in its tax year: April 0 … March 11. */
const inYear = (m) => (m + 8) % 12;

/**
 * Whether a month comes before the month its tax year was set up from. The tax-year set-up started part-way through a
 * year (TaxYearWizardService.buildTaxYearConfig: startMonth, remainingMonths, grossIncomeToDate, taxPaidToDate) asks for the
 * income and tax already received that year, and the engine delivers the year over the months from the set-up on: such
 * a month is recorded with its share of those figures (setUpShares), never worked out afresh. A year set up from April,
 * or not set up at all, has no such month.
 * @param {string} ym  'YYYY-MM'
 * @param {object} [config]  the month's tax-year settings (allTaxYears[taxYearOf(ym)])
 */
export function beforeSetUp(ym, config) {
  if (typeof ym !== 'string' || !YM.test(ym) || !isSetUp(config)) return false;
  const start = Number(config.startMonth);
  if (!Number.isInteger(start) || start < 1 || start > 12) return false;
  return inYear(Number(ym.slice(5, 7))) < inYear(start);
}

/**
 * Months in words: 'July 2026', 'July 2026 and August 2026' for two, 'July 2026 to September 2026' for a longer run,
 * 'April 2026, June 2026 and July 2026' otherwise.
 */
export function monthsWords(months) {
  const m = Array.isArray(months) ? months : [];
  if (m.length <= 1) return monthLabel(m[0] || '');
  const run = m.length > 2 && m.every((x, i) => i === 0 || x === addMonth(m[i - 1], 1));
  if (run) return monthLabel(m[0]) + ' to ' + monthLabel(m[m.length - 1]);
  return m.slice(0, -1).map(monthLabel).join(', ') + ' and ' + monthLabel(m[m.length - 1]);
}

const round2 = (v) => Math.round(v * 100) / 100;

const COUNT = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
/** A count of months in words up to twelve ('one', 'two' …), in figures beyond: read in a sentence, not a table. */
export function countWords(n) {
  return Number.isInteger(n) && n >= 0 && n < COUNT.length ? COUNT[n] : String(n);
}

/**
 * A tax year's set-up figures for the months before it, one share each: what the set-up took as received before it
 * (grossIncomeToDate) and the tax on it (taxPaidToDate when entered, else the tax that income pays on its own — the
 * engine's own assumption, legacyDecision `priorTax`), spread evenly over the months from April to the month before the
 * set-up, the last month taking the pennies, so the shares add up to the totals exactly. Only what the engine counts:
 * a set-up whose months left are twelve counts nothing received before it. Null for a year not set up, or set up from April.
 * @param {string} key  the tax year's key ('26/27')
 * @param {object} config  its settings
 * @returns {{ key, setUpMonth, months: string[], gross, tax, taxEntered: boolean,
 *   byMonth: Object<string, { gross: number, tax: number, taxToDate: number }> }|null}
 */
export function setUpShares(key, config) {
  if (!isSetUp(config)) return null;
  const start = Number(config.startMonth);
  const april = aprilOf(key);
  if (!april || !Number.isInteger(start) || start < 1 || start > 12) return null;
  const k = inYear(start);
  if (!k) return null;
  const deliverMonths = Math.max(1, Math.min(12, Number(config.remainingMonths) || 12));
  const partYear = deliverMonths < 12;
  const gross = partYear ? Math.max(0, +config.grossIncomeToDate || 0) : 0;
  const taxEntered = partYear && config.taxPaidToDate != null && config.taxPaidToDate !== '';
  const tax = taxEntered ? Math.max(0, +config.taxPaidToDate || 0) : calculateTax(gross, config.pa || 12570, config.brl || 50270, config.hrl || 125140);
  const months = Array.from({ length: k }, (_, i) => addMonth(april, i));
  const split = (total) => {
    const pence = Math.round(total * 100), each = Math.floor(pence / k);
    return months.map((_, i) => (i < k - 1 ? each : pence - each * (k - 1)) / 100);
  };
  const g = split(gross), t = split(tax);
  const byMonth = {};
  let toDate = 0;
  months.forEach((m, i) => { toDate = round2(toDate + t[i]); byMonth[m] = { gross: g[i], tax: t[i], taxToDate: toDate }; });
  return { key, setUpMonth: addMonth(april, k), months, gross: round2(gross), tax: round2(tax), taxEntered, byMonth };
}

/**
 * A month before its tax year's set-up, as it is recorded: the month as worked out (so the record has every field a
 * record has — the glidepaths, the plan year, the pots typed), with its income and tax replaced by its share of the
 * set-up's figures. The gross is the month's other income and State Pension first (as the engine had them), the rest
 * the SIPP, so the three add up to the share exactly; nothing tax-free, no ISA or taxable-account sale, no boost, and
 * not in protection (the money was received, not cut); which pot paid is scaled to the new draw. `fromSetUp` marks it.
 * @param {object} d  the month as calcDecisionPWA worked it out
 * @param {{ gross: number, tax: number, taxToDate: number }} share
 */
export function setUpShareDecision(d, share) {
  const gross = share.gross, tax = share.tax;
  // the engine's other income and State Pension are a twelfth of a year's figure, rarely whole pennies: rounded before
  // the SIPP takes the rest, so the three add up to the share to the penny and the months to the set-up's total
  const other = round2(Math.min(Math.max(0, +d.other || 0), gross));
  const state = round2(Math.min(Math.max(0, +d.statePension || 0), round2(gross - other)));
  const sipp = round2(gross - other - state);
  const scale = (+d.sippDraw || 0) > 0 ? sipp / d.sippDraw : 0;
  const out = {
    ...d, sippDraw: sipp, stdSipp: sipp, other, statePension: state, isaDraw: 0, isaSavingsUsedThisMonth: 0,
    monthlyTax: tax, totalMonthlyNet: round2(gross - tax), taxPaidYTD: share.taxToDate,
    taxFree: 0, boostAmount: 0, boostEligible: false, recycleGross: 0, recycleNet: 0, pclsSuggestion: 0,
    taxSavedMonthly: 0, taxSavedYTD: 0, taxSavedProjectedAnnual: 0, inProtection: false, protectionReason: null,
    drawFromEquity: round2((+d.drawFromEquity || 0) * scale), drawFromBond: round2((+d.drawFromBond || 0) * scale), drawFromCash: round2((+d.drawFromCash || 0) * scale),
    fromSetUp: true
  };
  if (d.drawFromDiversifier != null) out.drawFromDiversifier = round2((+d.drawFromDiversifier || 0) * scale);
  if (d.giaBalance != null) Object.assign(out, { giaDraw: 0, giaCgt: 0, giaNet: 0, giaGainUsed: 0, giaBalanceAfter: d.giaBalance, giaBasisAfter: d.giaBasis });
  return out;
}

/**
 * The records the engine is handed (index.html calcDecisionWithDeps): every record except one recorded from its tax
 * year's set-up figures (`fromSetUp`) whose month still comes before that set-up — the set-up already counts what was
 * received in it, so the engine sees exactly what it saw before the month was filled in. Should the year be set up again
 * from April, the record comes back into the engine's view with the income it carries.
 */
export function historyForEngine(history, taxYears) {
  const list = Array.isArray(history) ? history : [];
  if (!taxYears) return list;
  return list.filter((h) => !(h && h.fromSetUp === true && beforeSetUp(monthOf(h), taxYears[h.taxYear])));
}

/**
 * The month the chooser reaches back to: the April of the earliest tax year that is set up, or the first record's month
 * when that is earlier; null with neither. Given the plan's own first month (`planStart`, planFillStart), that month when it
 * is earlier still (6.53.0): a plan whose start is behind everything recorded and set up — its start moved back to the tax
 * year work stopped, or a plan whose income started that tax year and was first recorded later — reaches the months it has
 * lived. A tax year among them not set up stops the fill before it, and the help says how to set it up, as always.
 */
export function earliestFillMonth(history, taxYears, planStart = null) {
  const first = (Array.isArray(history) ? history : []).map(monthOf).filter(Boolean).sort()[0] || null;
  const aprils = Object.keys(taxYears || {}).filter((k) => isSetUp(taxYears[k])).map(aprilOf).filter(Boolean).sort();
  const start = typeof planStart === 'string' && YM.test(planStart) ? planStart : null;
  return [first, aprils[0], start].filter(Boolean).sort()[0] || null;
}

/**
 * The plan's first month its lived months can be filled in from (6.53.0): the April of its first tax year, or the month
 * work stopped when that is later (the months before it were not drawn on the plan). Null without a first tax year.
 * @param {number} firstTaxYear  the plan's year 0 (PlanTiming.decisionAnchorYear)
 * @param {string|null} stopMonth  'YYYY-MM' work stopped (PlanTiming.stoppedWorkOf), or null
 */
export function planFillStart(firstTaxYear, stopMonth = null) {
  if (!(+firstTaxYear > 0)) return null;
  const april = String(Math.round(+firstTaxYear)) + '-04';
  return typeof stopMonth === 'string' && YM.test(stopMonth) && stopMonth > april ? stopMonth : april;
}

/**
 * Whether a month comes before a set-up that was given nothing as received (no income, no tax): nothing was drawn in it,
 * so there is nothing to fill in, and recording it would only add a month of no income for the strip to count.
 */
function nothingBeforeSetUp(ym, key, config) {
  if (!beforeSetUp(ym, config)) return false;
  const s = setUpShares(key, config);
  return !s || (!(s.gross > 0) && !(s.tax > 0));
}

/**
 * The offer for the entry form. `choices` are the months the chooser lists: every month with no record from
 * earliestFillMonth to the month before the chosen one, less the pending ones and those before a set-up given nothing.
 * `chosenFrom` is the chooser's month: the one asked for (`o.from`) when it is a choice, else the first of the months
 * 6.48.0 offered (those after the latest record before the chosen month). When 6.48.0's offer is empty and nothing was
 * asked for, the offer is `closed`: no months and no tick, only the quiet line (MORE_WORDS) that opens the chooser — the
 * earlier months stay in reach without a ready tick on every entry. `months` are the months the fill will write, in date
 * order: the choices from `chosenFrom` up to a tax year not set up among them (`notSetUp`: the fill stops before its first
 * month, and the month in the box is then not recorded either); those before their tax year's set-up carry their share
 * (`shares`, keyed by month). Null when the chosen month is recorded (its Calculate is refused) or there is nothing to
 * offer; with only pending months, or none the fill could write, an offer with no months and the help alone, so the
 * reason shows.
 * @param {object[]} history  the plan's records, any order
 * @param {string} chosen  the month in the box, 'YYYY-MM'
 * @param {{ taxYears?: object, taxYearOf?: (ym: string) => string, from?: string, planStart?: string|null, floor?: string|null, ceiling?: string|null }} [o]  planStart:
 *   the plan's own first month (planFillStart), so the chooser reaches its lived months (earliestFillMonth); `floor` and
 *   `ceiling` the first and last months the plan may record (6.56.0, services/PlanClosed.js: the plan that carries a closed
 *   one on records nothing before its first month, a closed plan nothing after its last), outside which nothing is offered —
 *   and a month in the box after the ceiling, which is not recorded here, is offered no fill at all
 * @returns {{ months: string[], from: string|null, to: string|null, words: string, choices: string[], chosenFrom: string|null,
 *   widened: boolean, closed: boolean, shares: object, setUp: object[], notSetUp: { key: string, month: string }|null,
 *   pending: string[], help: string }|null}
 */
export function fillOffer(history, chosen, o = {}) {
  const hist = Array.isArray(history) ? history : [];
  if (typeof chosen !== 'string' || !YM.test(chosen)) return null;
  const recorded = new Set(hist.map(monthOf).filter(Boolean));
  if (recorded.has(chosen)) return null;
  const known = !!(typeof o.taxYearOf === 'function' && o.taxYears);
  const yearOf = known ? o.taxYearOf : null;
  const taxYears = known ? o.taxYears : null;
  const floor = typeof o.floor === 'string' && YM.test(o.floor) ? o.floor : null;
  const ceiling = typeof o.ceiling === 'string' && YM.test(o.ceiling) ? o.ceiling : null;
  if (ceiling && chosen > ceiling) return null;
  const found = earliestFillMonth(hist, taxYears, o.planStart);
  const earliest = found && floor && found < floor ? floor : found;
  const all = [];
  if (earliest) for (let m = earliest; m < chosen; m = addMonth(m, 1)) if (!recorded.has(m)) all.push(m);
  const chosenYear = yearOf ? yearOf(chosen) : null;
  const pending = yearOf && !isSetUp(taxYears[chosenYear]) ? all.filter((m) => yearOf(m) === chosenYear) : [];
  const choices = all.filter((m) => !pending.includes(m) && !(yearOf && nothingBeforeSetUp(m, yearOf(m), taxYears[yearOf(m)])));
  const empty = { months: [], from: null, to: null, words: '', choices, chosenFrom: null, widened: false, closed: false, shares: {}, setUp: [], notSetUp: null, pending, help: pending.length ? pendingWords(pending, chosen) : '' };
  if (!choices.length) return pending.length ? { ...empty, choices: [] } : null;
  const base = missedMonths(latestRecordedBefore(hist, chosen), chosen).filter((m) => choices.includes(m));
  const chosenFrom = choices.includes(o.from) ? o.from : (base[0] || null);
  if (!chosenFrom) return { ...empty, closed: true };
  const widened = !(base.length && chosenFrom === base[0]);
  // the months the fill writes: from the chooser's month up to the first tax year not set up, where it stops; those
  // before their tax year's set-up, with their share
  const months = [], shares = {}, setUp = [];
  let notSetUp = null;
  for (const m of choices.filter((x) => x >= chosenFrom)) {
    const key = yearOf ? yearOf(m) : null, cfg = yearOf ? taxYears[key] : null;
    if (yearOf && !isSetUp(cfg)) { notSetUp = { key, month: m }; break; }
    months.push(m);
    if (!yearOf || !beforeSetUp(m, cfg)) continue;
    let s = setUp.find((x) => x.key === key);
    if (!s) { const all12 = setUpShares(key, cfg); if (!all12) continue; s = { ...all12, filled: [] }; setUp.push(s); }
    s.filled.push(m);
    shares[m] = s.byMonth[m];
  }
  // what happens to a set-up's figures first (on a phone the help is long, and that is what the tick changes most), then
  // the stop, then what every filled-in month is, then the months not offered yet
  const help = [...setUp.map(setUpWords), notSetUp ? notSetUpWords(notSetUp.key, notSetUp.month, months.length ? chosen : null, o.planStart) : '', months.length ? FILL_HELP : '', pending.length ? pendingWords(pending, chosen) : ''].filter(Boolean).join(' ');
  return {
    months, from: months[0] || null, to: months[months.length - 1] || null, words: months.length ? fillWords(months, setUp.length > 0) : '',
    choices, chosenFrom, widened, closed: false, shares, setUp, notSetUp, pending, help
  };
}

/**
 * The tick's label, one wording whichever month the chooser starts from: "Fill in 2 months you did not record, July 2026
 * and August 2026, with these figures". When some of the months take their income and tax from a tax year's set-up,
 * only the pension figures typed are theirs: "…, with these pension figures".
 */
export function fillWords(months, fromSetUp = false) {
  const n = months.length;
  return 'Fill in ' + n + ' month' + (n === 1 ? '' : 's') + ' you did not record, ' + monthsWords(months) + ', with these ' + (fromSetUp ? 'pension ' : '') + 'figures';
}

/** The quiet line in the box when the default offer has no months but earlier ones can be filled in: it opens the chooser. */
export const MORE_WORDS = 'Fill in earlier months you did not record…';

/** The help text under the tick. */
export const FILL_HELP = 'One record for each month, worked out in order with the pension figures above, marked as filled in later. '
  + 'Use it when you drew the same amount each month and did not record it at the time. '
  + 'The figures were not the pot\'s on those months, so the records are a fair picture, not exact ones.';

const pounds = (v) => '£' + Math.round(v).toLocaleString('en-GB');

/**
 * The help's sentences for the months before a tax year's set-up, said before the tick: what was entered at the set-up
 * as received before its month, that the fill records it as drawn from the pension, spread evenly over those months (so
 * the year's totals stay the same and the months from the set-up on are worked out exactly as before), and that it is
 * only right when that money was pension drawn — the set-up asks for pay and other income received too.
 * @param {{ key, setUpMonth, months, gross, tax, taxEntered, byMonth, filled: string[] }} s  setUpShares, with the months filled
 */
export function setUpWords(s) {
  const year = yearWords(s.key), from = monthLabel(s.setUpMonth), filled = Array.isArray(s.filled) && s.filled.length ? s.filled : s.months;
  const taxed = Math.round(s.tax) > 0, one = filled.length === 1;
  const taxPart = s.taxEntered
    ? (taxed ? ', with ' + pounds(s.tax) + ' of tax on it' : ', with no tax on it')
    : ', but no tax on it, so the tax that income would pay by itself is used: ' + (taxed ? pounds(s.tax) : 'none');
  const intro = 'You set up ' + year + ' from ' + from + ' and entered ' + pounds(s.gross) + ' of income received before then' + taxPart + '.';
  const first = s.byMonth[s.months[0]];
  const each = ' (' + pounds(first.gross) + ' a month before tax' + (taxed ? ', ' + pounds(first.tax) + ' of tax' : '') + ')';
  const spread = s.months.length === 1 ? 'That is the income for ' + monthLabel(s.months[0]) : 'That is spread evenly over ' + monthsWords(s.months) + each;
  const ticked = filled.length === s.months.length
    ? ', and ticked, ' + (one ? 'it is' : 'they are') + ' recorded as drawn from your pension, so the year\'s totals stay the same'
    : ', and ticked, ' + monthsWords(filled) + (one ? ' is recorded with its' : ' are recorded with their') + ' share, as drawn from your pension';
  return intro + ' ' + spread + ticked + '; the months from ' + from + ' on are worked out exactly as before. '
    + 'Only tick this if that money was pension you drew: if it was pay or other income, leave ' + (one ? 'that month' : 'those months') + ' unrecorded.';
}

/**
 * The help's sentence for a tax year not set up among the months: with months to write before it, the fill stops before
 * it and the month in the box (`boxMonth`) is then not recorded either; with none, its months cannot be filled in yet.
 * Then how to set that year up.
 */
export function notSetUpWords(key, month, boxMonth, planStart = null) {
  const april = aprilOf(key), year = yearWords(key);
  const stop = boxMonth
    ? ' is not set up, so the fill stops before ' + monthLabel(month) + ', and ' + monthLabel(boxMonth) + ' will not be recorded either until ' + year + ' is set up'
    : ' is not set up, so the months from ' + monthLabel(month) + ' cannot be filled in until it is';
  // the plan's first month inside that year (the month work stopped, 6.53.0): set up from there, nothing before it was the plan's
  const first = typeof planStart === 'string' && YM.test(planStart) && april && planStart > april && planStart < addMonth(april, 12) ? planStart : null;
  if (first) return year + stop + '. Set that year up first: put ' + monthLabel(first) + ', the plan\'s first month, in the month box and press Calculate (the year is then set up from it).';
  return year + stop + '. Set that year up first: put ' + monthLabel(april || month) + ' in the month box and press Calculate (it is then set up from April, with nothing received before it).';
}

/**
 * The help's sentence for the missed months in the chosen month's own tax year while that year is not set up: the
 * Calculate for the chosen month sets the year up from it and asks for what was received before it; once it has, those
 * months come before the set-up and are offered with their share of what was entered there.
 */
export function pendingWords(months, chosen) {
  const one = months.length === 1;
  return monthsWords(months) + (one ? ' is' : ' are') + ' not offered yet: ' + (one ? 'its' : 'their') + ' tax year will be set up from ' + monthLabel(chosen)
    + ' when you press Calculate, with what you received in ' + (one ? 'it' : 'them') + ', and ' + (one ? 'it' : 'they') + ' can then be filled in with ' + (one ? 'its' : 'their') + ' share of that.';
}

/**
 * Why Calculate refuses the month in the box before the engine runs, or '' when it does not: a month already recorded
 * (as before), or one that comes before its own tax year's set-up. That set-up already counts what was received before
 * its month, so a month before it worked out on its own would be counted twice — the year's totals would stop matching
 * what was entered and every later month would move. Filled in from a later month, it takes its share instead.
 * @param {object[]} history  the plan's records, any order
 * @param {string} ym  the month in the box
 * @param {object} [taxYears]  the tax-year settings
 * @param {(ym: string) => string} [taxYearOf]
 */
export function refusedMonthWords(history, ym, taxYears, taxYearOf) {
  const month = monthLabel(ym);
  if ((Array.isArray(history) ? history : []).some((h) => monthOf(h) === ym)) return month + ' already has a saved decision. Delete it from the History tab first to recalculate.';
  const key = typeof taxYearOf === 'function' && taxYears ? taxYearOf(ym) : null;
  const cfg = key ? taxYears[key] : null;
  if (!beforeSetUp(ym, cfg)) return '';
  const s = setUpShares(key, cfg);
  if (!s) return '';
  const from = monthLabel(s.setUpMonth), year = yearWords(key);
  if (!(s.gross > 0) && !(s.tax > 0)) {
    return month + ' comes before your ' + year + ' set-up: you set the year up from ' + from + ' with nothing received before then. If you did draw from your pension in '
      + month + ', set the year up again from an earlier month (Tax Years, Reconfigure via Wizard), then press Calculate with that month in the box.';
  }
  return month + ' comes before your ' + year + ' set-up: you set the year up from ' + from + ' and entered ' + pounds(s.gross) + ' of income received before then, which already counts '
    + month + '. To record it, put a later month in the box, press Calculate and fill in earlier months from there: ' + month + ' then takes its share.';
}

/**
 * The records the History view's delete takes with a month (index.html deleteHistoryEntry): the month and every later one
 * in its tax year, since each later month was worked out with it on record (tax to date, ISA used, protection) — except
 * a month recorded from its tax year's set-up figures that the engine still leaves out (historyForEngine): no record from
 * the set-up on ever read it, so it goes with the later such months alone, and undoing a fill never costs a real record.
 * Empty when the month is not on record.
 * @param {object[]} history  the plan's records, any order
 * @param {string} date  the record's date
 * @param {object} [taxYears]  the tax-year settings
 * @param {(ym: string) => string} [taxYearOf]  for a record with no tax year on it
 */
export function recordsToDelete(history, date, taxYears, taxYearOf) {
  const list = (Array.isArray(history) ? history : []).filter((h) => h && typeof h.date === 'string');
  const yearOf = (h) => h.taxYear || (typeof taxYearOf === 'function' ? taxYearOf(h.date) : null);
  const target = list.find((h) => h.date === date);
  if (!target) return [];
  const later = list.filter((h) => yearOf(h) === yearOf(target) && h.date >= date).sort((a, b) => a.date.localeCompare(b.date));
  const leftOut = (h) => historyForEngine([h], taxYears).length === 0;
  return leftOut(target) ? later.filter(leftOut) : later;
}

/** The History view's delete button, for the records it takes (recordsToDelete). */
export function deleteButtonWords(records, taxYear) {
  const r = Array.isArray(records) ? records : [];
  if (r.length <= 1) return 'Delete Entry';
  return r[0].fromSetUp === true && r.every((h) => h.fromSetUp === true) ? 'Delete this & the later months filled in from the set-up' : 'Delete this & later months in ' + taxYear;
}

/** The marks a filled-in record carries (through saveDecision): that it was, and when (the ISO instant). */
export function fillMarks(nowIso) {
  return { filledIn: true, filledInOn: nowIso };
}

/** Whether a record was filled in later. */
export function isFilledIn(record) {
  return !!(record && record.filledIn === true);
}

/** '30 September 2026' from an ISO instant (its date part, so the label never moves with the time zone); '' when there is none. */
export function dateLabel(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(iso || ''));
  if (!m) return '';
  return Number(m[3]) + ' ' + MONTH_NAMES[Number(m[2]) - 1] + ' ' + m[1];
}

/** The History view's mark: 'Filled in later on 30 September 2026' ('Filled in later' when the record has no date); '' for an ordinary record. */
export function filledInLabel(record) {
  if (!isFilledIn(record)) return '';
  const on = dateLabel(record.filledInOn);
  return 'Filled in later' + (on ? ' on ' + on : '');
}

/** The sentence under a filled-in record's heading (and so in its PDF). */
export function filledInNote(record) {
  const label = filledInLabel(record);
  if (!label) return '';
  if (record.fromSetUp === true) return label + '. Its income and tax are its share of what you entered, when you set up the tax year, as received before the month you set it up from, recorded as drawn from your pension; its pension figures are the ones entered for a later month: a fair picture of this month, not an exact one.';
  return label + ', with the pension figures entered for a later month: a fair picture of this month, not an exact one.';
}

/** The Save button's spinner while a fill writes several records: 'Saving 3 of 5…'. */
export function savingProgress(k, total) {
  return 'Saving ' + k + ' of ' + total + '…';
}

/**
 * The toast and the line when a month's tax year is not set up: the fill stops before it, and the month in the box is
 * not recorded. Given the month it stopped before and its tax year, the words say which year and how to set it up.
 */
export function fillStoppedWords(written, boxMonth, stopMonth, stopKey) {
  const head = written ? 'Recorded ' + countWords(written) + ' month' + (written === 1 ? '' : 's') : 'Nothing was recorded';
  if (stopMonth && stopKey) {
    return head + '; the fill stopped before ' + monthLabel(stopMonth) + ' because ' + yearWords(stopKey) + ' is not set up. Set it up first: put '
      + monthLabel(aprilOf(stopKey) || stopMonth) + ' in the month box and press Calculate. ' + monthLabel(boxMonth) + ' was not recorded.';
  }
  return head + ' — the next tax year needs setting up first (enter its first month). ' + monthLabel(boxMonth) + ' was not recorded.';
}

const sum = (v) => typeof v === 'number' && Number.isFinite(v);

/**
 * When a fill is saved, the month in the box is worked out again once the filled-in months are on record, and the
 * recommendation can move (a pot held level month after month can tip the month into protection): the person read the
 * first one at Calculate and is acting on it, so the saved line and the toast say what moved — the SIPP withdrawal, the
 * income after tax and Protection Mode, the panel's own headline figures, to the pound. '' when none of them moved.
 * @param {object} before  the month as worked out at Calculate
 * @param {object} after   the same month worked out again after the fill
 */
export function recalcWords(before, after) {
  if (!before || !after) return '';
  const moved = [];
  if (sum(before.sippDraw) && sum(after.sippDraw) && Math.round(before.sippDraw) !== Math.round(after.sippDraw)) {
    moved.push('SIPP withdrawal ' + pounds(after.sippDraw) + ' a month (it was ' + pounds(before.sippDraw) + ')');
  }
  if (sum(before.totalMonthlyNet) && sum(after.totalMonthlyNet) && Math.round(before.totalMonthlyNet) !== Math.round(after.totalMonthlyNet)) {
    moved.push('income after tax ' + pounds(after.totalMonthlyNet) + ' a month (it was ' + pounds(before.totalMonthlyNet) + ')');
  }
  if (!!before.inProtection !== !!after.inProtection) moved.push(after.inProtection ? 'now in Protection Mode' : 'no longer in Protection Mode');
  if (!moved.length) return '';
  return monthLabel(after.date || before.date) + ' was worked out again with the filled-in months on record, and the recommendation changed: ' + moved.join('; ') + '.';
}

/**
 * The line under the Calculate / Save row: why Save is off, or what was just done.
 * @param {'none'|'calculated'|'saved'|'changed'|'failed'|'stopped'|'interrupted'} state
 * @param {{ month?: string, through?: string, filled?: string[], words?: string, recalc?: string }} [o]  month: the month in
 *   the box (or just saved); through: the last month a quarterly or annual batch saved; filled: the months filled in with
 *   it (or, interrupted, before the failed write); words: the stop's own words; recalc: what moved when the month was
 *   worked out again after a fill (recalcWords)
 */
export function saveStateWords(state, o = {}) {
  const month = state === 'saved' && o.through && o.through !== o.month ? monthLabel(o.month) + ' to ' + monthLabel(o.through) : monthLabel(o.month);
  const f = Array.isArray(o.filled) ? o.filled : [];
  switch (state) {
    case 'none': return 'Press Calculate to work out ' + (month || 'this month') + '.';
    case 'calculated': return '';
    case 'changed': return 'Changed since the last calculation: press Calculate again.';
    case 'failed': return (month || 'This month') + ' could not be worked out — see the message in the panel. Put it right and press Calculate again.';
    case 'stopped': return o.words || '';
    case 'interrupted': {
      // a write failed after some filled-in months went in: the calculation on the panel did not see them, so Save stays
      // off until a Calculate works the month out again with them on record
      const one = f.length === 1;
      return monthsWords(f) + (one ? ' was' : ' were') + ' filled in before the save failed, and ' + month + ' was not recorded. '
        + 'Press Calculate to work it out again with ' + (one ? 'that month' : 'those months') + ' on record.';
    }
    case 'saved': {
      const withFill = f.length === 0 ? '' : ', with ' + monthsWords(f) + ' filled in';
      return month + ' saved' + withFill + '. ' + (o.recalc ? o.recalc + ' ' : '') + 'To record another month, change the month and press Calculate.';
    }
    default: return '';
  }
}
