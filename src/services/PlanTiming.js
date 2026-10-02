/**
 * Plan timing — WHEN the plan starts, in one place.
 *
 * Until v6.4.0 the Stress tester had no retirement date: the first tax year was never saved and
 * fell back to "the calendar year after today", so every plan silently re-anchored each 1 January,
 * and the Decision tool used five different year-0 conventions (a hard-coded 2026, the first tax
 * year set up, "today", the income shape's age, the Stress fallback). This module derives ONE saved
 * anchor — `firstTaxYear`, meaning the tax year starting 6 April of that year — from the user's age
 * today and retirement status, and every engine and the Decision tool read it. Tax years before it
 * are bridge years (money is being spent, but the plan's rungs and tracks have not started).
 *
 * Age convention (matches the ladder and the State Pension maths already in the app): a plan year's
 * "age" is the age REACHED during that tax year, i.e. the age on 5 April at its end. Someone born
 * 21 April 1970 is "57" in 2027/28 and their State Pension (21 April 2037) lands in 2037/38 =
 * plan year 10 = startAge + 10.
 *
 * Pure: `now` is injectable everywhere so results are date-stable in tests.
 */
import { parseStatePensionDate } from '../utils/StatePensionUtils.js';
import { projectAccumulation, contributionBreakdown } from './AccumulationEngine.js';
import { chargesPctOf } from './Charges.js';
import { isaGrowthOf, cashProjectionRate } from './IsaGrowth.js';
import { isaFundsDecide } from './IsaFunds.js';
import { potScaleOf, sippTodayOf } from './PotsAtRetirement.js';
import { INFLATION_DEFAULTS } from '../constants.js';

const MS_PER_DAY = 24 * 3600 * 1000;

/** Calendar year Y of the tax year (6 April Y – 5 April Y+1) containing `d`. */
export function taxYearStartOf(d) {
  const dt = d instanceof Date ? d : new Date(d);
  return (dt.getMonth() > 3 || (dt.getMonth() === 3 && dt.getDate() >= 6)) ? dt.getFullYear() : dt.getFullYear() - 1;
}
/** '2027/28' */
export function taxYearLabel(Y) { return Y + '/' + String(Y + 1).slice(2); }
/** '27/28' — the Decision tool's key format. */
export function taxYearKey(Y) { return String(Y % 100).padStart(2, '0') + '/' + String((Y + 1) % 100).padStart(2, '0'); }
/** '27/28' → 2027 (also accepts '2027/28'). */
export function yearOfTaxKey(key) {
  const a = parseInt(String(key).split('/')[0], 10);
  if (!Number.isFinite(a)) return NaN;
  return a < 100 ? 2000 + a : a;
}

/**
 * Signed plan year of a tax year relative to the anchor. Negative = bridge year (before the plan).
 * `x` may be a 'YY/YY' key, a 'YYYY-MM' / 'YYYY-MM-DD' string, a Date, or a calendar year number.
 */
export function planYearOf(x, firstTaxYear) {
  let Y;
  if (typeof x === 'number') Y = x;
  else if (x instanceof Date) Y = taxYearStartOf(x);
  else if (typeof x === 'string' && x.includes('/')) Y = yearOfTaxKey(x);
  else if (typeof x === 'string') { const [y, m] = x.split('-').map(Number); Y = m >= 4 ? y : y - 1; }
  else return NaN;
  return Y - (+firstTaxYear);
}

/**
 * The date an age was recorded on. `currentAgeAsOf` is saved as 'YYYY-MM-DD', a LOCAL calendar day: it is read as
 * local midnight (as parseStatePensionDate reads the State Pension date). `new Date('YYYY-MM-DD')` would be midnight
 * UTC, which west of Greenwich is the evening BEFORE — so a birthday on the day the age was recorded counted as a new
 * birthday and the person was a year older from then on (found 1 Oct 2026 in America/New_York: every plan made from a
 * V7 answer started a tax year early). Anything else (an ISO time) is read as it always was.
 */
function dayOf(x) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(typeof x === 'string' ? x.trim() : '');
  return m ? new Date(+m[1], +m[2] - 1, +m[3]) : new Date(x);
}

/** Birthday month/day: the State Pension date IS a birthday; else the date the age was recorded; else today. */
export function birthdayOf(settings, now = new Date()) {
  const s = settings || {};
  const sp = s.spStartDate ? parseStatePensionDate(s.spStartDate) : null;
  if (sp) return { month: sp.getMonth(), day: sp.getDate(), source: 'sp' };
  if (s.currentAgeAsOf) { const t = dayOf(s.currentAgeAsOf); if (Number.isFinite(t.getTime())) return { month: t.getMonth(), day: t.getDate(), source: 'asOf' }; }
  return { month: now.getMonth(), day: now.getDate(), source: 'today' };
}

function birthdaysBetween(from, to, bd) {   // birthdays in (from, to]
  let n = 0;
  for (let y = from.getFullYear(); y <= to.getFullYear(); y++) {
    const b = new Date(y, bd.month, bd.day);
    if (b.getTime() > from.getTime() && b.getTime() <= to.getTime()) n++;
  }
  return n;
}

/** Whole-years age on `date`, from the recorded age today. Null when no age is recorded. */
export function ageOnDate(settings, date, now = new Date()) {
  const s = settings || {};
  const a = Math.floor(+s.currentAge || 0);
  if (!(a > 0)) return null;
  let asOf = s.currentAgeAsOf ? dayOf(s.currentAgeAsOf) : now;
  if (!Number.isFinite(asOf.getTime())) asOf = now;
  const bd = birthdayOf(s, now);
  const d = date instanceof Date ? date : new Date(date);
  return d.getTime() >= asOf.getTime() ? a + birthdaysBetween(asOf, d, bd) : a - birthdaysBetween(d, asOf, bd);
}

/** Age reached during tax year Y (age on 5 April Y+1). */
export function ageInTaxYear(settings, Y, now = new Date()) {
  return ageOnDate(settings, new Date(Y + 1, 3, 5), now);
}

/** The tax year in which the person reaches `age` (inverse of ageInTaxYear). */
export function taxYearOfAge(settings, age, now = new Date()) {
  const Y0 = taxYearStartOf(now);
  const a0 = ageInTaxYear(settings, Y0, now);
  if (a0 == null) return null;
  return Y0 + (Math.round(+age) - a0);
}

/** Months from `now` until 6 April of `firstTaxYear` (0 when already started). */
export function monthsUntilStart(firstTaxYear, now = new Date()) {
  const start = new Date(+firstTaxYear, 3, 6);
  return Math.max(0, Math.round((start.getTime() - now.getTime()) / (30.44 * MS_PER_DAY)));
}
/** Months from `now` until the first of a 'YYYY-MM' month (0 when passed). */
export function monthsUntilMonth(ym, now = new Date()) {
  const [y, m] = String(ym || '').split('-').map(Number);
  if (!Number.isFinite(y) || !Number.isFinite(m)) return 0;
  return Math.max(0, (y - now.getFullYear()) * 12 + (m - 1 - now.getMonth()));
}
/** The 'YYYY-MM' the person reaches `age` — the birthday month, from the recorded age and the birthday. */
export function retirementMonth(settings, age, now = new Date()) {
  const s = settings || {};
  const a = ageOnDate(s, now, now);
  if (a == null) return null;
  const bd = birthdayOf(s, now);
  // The next birthday from today is age a+1: find the year in which the birthday makes them `age`.
  const thisYearBd = new Date(now.getFullYear(), bd.month, bd.day);
  const nextBdYear = thisYearBd.getTime() > now.getTime() ? now.getFullYear() : now.getFullYear() + 1;   // birthday that makes them a+1
  const year = nextBdYear + (Math.round(+age) - (a + 1));
  return year + '-' + String(bd.month + 1).padStart(2, '0');
}

/**
 * Back-fill the timing fields on a plan saved before v6.4.0. Pure and idempotent; the repository
 * runs it on load and the result is persisted on the next save (like the spending migration).
 * Without an age today the plan stays in legacy mode (starts the April after the current year,
 * exactly as before) — nothing to derive from.
 */
export function migrateTiming(settings, budget = null, now = new Date()) {
  const s = settings || {};
  if (typeof s.retired === 'boolean' && +s.firstTaxYear > 0) return s;
  if (!(+s.currentAge > 0)) return s;
  const thisTY = taxYearStartOf(now);
  const shape = +s.shapeAgeNow || 57;
  // Before 6.4.0 every plan implicitly started NEXT April. Keep that start for anyone whose steps
  // begin at or before the age they reach then (their ladder and cones are unchanged); only a start
  // age clearly in the future (a pre-retiree) becomes "retire at that age".
  const atShape = taxYearOfAge(s, shape, now);
  const inferredFuture = atShape > thisTY + 1;   // a start age clearly ahead beats any "retired" flag
  const retired = s.retired === true ? true : s.retired === false ? false
    : inferredFuture ? false
    : (budget && typeof budget.retired === 'boolean') ? budget.retired
    : true;
  // A start year that is already SAVED is kept as it is, even once it has passed (6.13.5): only a year derived
  // here, from today's date, may be pulled forward.
  let fty = +s.firstTaxYear > 0 ? +s.firstTaxYear : retired ? thisTY + 1 : taxYearOfAge(s, +s.retireAge || shape, now);
  if (!(+s.firstTaxYear > 0) && !(fty >= thisTY)) fty = thisTY + 1;
  return { ...s, firstTaxYear: fty, retired, retireAge: retired ? null : (+s.retireAge || shape) };
}

/** 'YYYY-MM-DD' of a Date's LOCAL calendar day (the format `currentAgeAsOf` is saved in). */
function localDay(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }

/**
 * The timing fields that are written into the saved plan the FIRST time they are derived, and never derived
 * again (6.13.5). Until then a plan saved before 6.4.0 — and a locked one can never be re-saved from its form —
 * had its start re-derived from today's date on every load, so on 6 April (or 1 January, with no age recorded)
 * it moved a year and every figure with it.
 *  - firstTaxYear, retired, retireAge: what migrateTiming back-fills. (A "retire at an age" plan keeps deriving
 *    its year from that age and the age today — that is its saved anchor — so its year is not pinned.)
 *  - currentAgeAsOf: an age with no date was read as "this age today" for ever, so the person never got older
 *    and the start age crept up a year every year.
 *  - legacyFirstTaxYear: a plan with no age at all started "the calendar year after today". That year is pinned
 *    under its own name: `firstTaxYear` on such a plan would also re-anchor the Decision tool's recorded years
 *    and switch the State Pension to tax-year counting, and a pin must not change any figure on the day it lands.
 */
export const TIMING_PIN_KEYS = ['firstTaxYear', 'retired', 'retireAge', 'currentAgeAsOf', 'legacyFirstTaxYear'];

/** migrateTiming plus the two pins it does not make (the age's date, the no-age start year). Pure, idempotent. */
export function pinTiming(settings, budget = null, now = new Date()) {
  const m = migrateTiming(settings, budget, now);
  if (+m.currentAge > 0) return m.currentAgeAsOf ? m : { ...m, currentAgeAsOf: localDay(now) };
  if (+m.firstTaxYear > 0 || +m.legacyFirstTaxYear > 0) return m;
  return { ...m, legacyFirstTaxYear: now.getFullYear() + 1 };
}

/**
 * What the load path must write back: the pinned fields of `loaded` (the settings after pinTiming) that the
 * stored settings do not already hold. Null when there is nothing to write — every load after the first.
 */
export function timingPinPatch(stored, loaded) {
  const s = stored || {}, l = loaded || {};
  const patch = {};
  for (const k of TIMING_PIN_KEYS) {
    if (k === 'firstTaxYear' && l.retired === false) continue;   // derived from retireAge + the dated age, which ARE pinned
    if (k === 'currentAgeAsOf' && (+s.currentAge || 0) !== (+l.currentAge || 0)) continue;   // the age is the Budget's, folded in on load: its date belongs there
    if (l[k] === undefined || (l[k] ?? null) === (s[k] ?? null)) continue;
    patch[k] = l[k];
  }
  return Object.keys(patch).length ? patch : null;
}

/**
 * The plan's timing, derived from saved settings.
 * @returns {{ mode: 'retired'|'future'|'legacy', firstTaxYear: number, shapeAgeNow: number,
 *   currentAge: number|null, retireAge: number|null, yearsToStart: number, bridgeMonths: number,
 *   startOptions: number[], potScale: { sipp: number, isa: number } }}
 */
export function deriveTiming(settings, now = new Date()) {
  const s = migrateTiming(settings || {}, null, now);
  const thisTY = taxYearStartOf(now);
  const base = { currentAge: null, retireAge: null, potScale: { sipp: 1, isa: 1 }, startOptions: [thisTY, thisTY + 1] };
  if (!(+s.currentAge > 0)) {
    // The pre-6.4.0 start ("the calendar year after today") — pinned the first time the plan is loaded (6.13.5,
    // `legacyFirstTaxYear`), so it no longer moves on 1 January.
    const firstTaxYear = +s.firstTaxYear > 0 ? +s.firstTaxYear : +s.legacyFirstTaxYear > 0 ? +s.legacyFirstTaxYear : now.getFullYear() + 1;
    return { ...base, mode: 'legacy', firstTaxYear, shapeAgeNow: +s.shapeAgeNow || 57, yearsToStart: Math.max(0, firstTaxYear - thisTY), startMonth: firstTaxYear + '-04', bridgeMonths: monthsUntilStart(firstTaxYear, now) };
  }
  const currentAge = ageOnDate(s, now, now);
  if (s.retired === false && +s.retireAge > 0) {
    let firstTaxYear = taxYearOfAge(s, +s.retireAge, now);
    if (!(firstTaxYear >= thisTY)) firstTaxYear = thisTY;   // "retire at 55" at 56: the plan starts now
    const shapeAgeNow = ageInTaxYear(s, firstTaxYear, now);
    // The plan's YEARS are tax years (the ladder buys whole ones), but the person retires on a birthday:
    // that month is when saving stops and the Decision tool opens (6.10.3). Someone 59 in September with an
    // October birthday retiring at 61 has a 2027/28 plan year 0 and retires in October 2027, 13 months away.
    const startMonth = retirementMonth(s, +s.retireAge, now);
    return { ...base, mode: 'future', firstTaxYear, shapeAgeNow, currentAge, retireAge: +s.retireAge,
      yearsToStart: firstTaxYear - thisTY, startMonth, bridgeMonths: monthsUntilMonth(startMonth, now), potScale: potScaleOf(s) };
  }
  // The saved start year is the plan's anchor for good (6.13.5). It used to be honoured only while it was this
  // tax year or later: a plan that started in 2027/28 jumped to 2029/30 on 6 April 2028, the day its second year
  // began — and one saved as "this tax year" jumped two years on its first 6 April.
  const firstTaxYear = +s.firstTaxYear > 0 ? +s.firstTaxYear : thisTY + 1;
  const startMonth = firstTaxYear + '-04';
  return { ...base, mode: 'retired', firstTaxYear, shapeAgeNow: ageInTaxYear(s, firstTaxYear, now), currentAge,
    yearsToStart: Math.max(0, firstTaxYear - thisTY), startMonth, bridgeMonths: monthsUntilStart(firstTaxYear, now) };
}

// Today's SIPP-side pot, the pots-at-retirement scale and the ISA a run starts from live in ./PotsAtRetirement.js (a light
// module the Drawdown table and the household checks can import without this one's engines); kept here by name.
export { sippTodayOf, potScaleOf, isaAtRetirementOf } from './PotsAtRetirement.js';

/**
 * How the projections to retirement grow the ISA (the Timing block, the Accumulation planner's column, the age spin):
 *   { kind, payIns, fromFunds } — `kind` the growth line ('cash' | 'invested', or null: the line used before the choice);
 *   `payIns` whether what goes into ISAs and savings each month is paid in.
 *  - no choice (a plan locked before it): the line used before, nothing paid in;
 *  - the ISA funds in the list of funds to test decide (the runs follow them, and the choice is hidden behind their line):
 *    the line used before the choice too — never the hidden choice (review of 6.22.0: a shares ISA was projected as cash)
 *    — with the pay-ins;
 *  - otherwise the plan's choice, with the pay-ins.
 */
export function isaProjectionOf(settings) {
  const kind = isaGrowthOf(settings);
  const fromFunds = isaFundsDecide(settings);
  return { kind: fromFunds ? null : kind, payIns: !!kind, fromFunds };
}

/**
 * The ISA year by year to retirement (today's money; projectAccumulation's rows) by how the plan's ISA grows (6.22.0,
 * services/IsaGrowth.js; isaProjectionOf):
 *   - no choice (a plan locked before it): the FCA middle band less charges, nothing paid in — as before the choice;
 *   - the ISA funds in the list of funds to test decide: the same middle band (6.21.0's figure), with the pay-ins;
 *   - 'cash' ("Mostly cash"): the cash rule at the planner's 2.5% prices, 1.5% a year, less charges;
 *   - 'invested' ("Invested like my pension"): the pension's middle band, less charges.
 * With a choice, what goes into ISAs and savings each month (accumulation.isaMonthly) is paid in, rising with the
 * planner's "Raise contributions by" as the pension's payments do. The Timing block's ISA at retirement is the last row;
 * the Accumulation planner's "ISA and savings" line shows them all (src/ui/accumulationProjection.js), so the two agree.
 */
export function projectedIsaRows(stress, accumulation, years, isaToday, chargesPct = chargesPctOf(stress)) {
  const a = accumulation || {};
  const how = isaProjectionOf(stress);
  const isaMonthly = how.payIns && Number.isFinite(+a.isaMonthly) && +a.isaMonthly > 0 ? +a.isaMonthly : 0;
  return projectAccumulation({ currentAge: 0, retirementAge: years, potNow: isaToday, totalMonthly: isaMonthly, escalationPct: +a.escalationPct || 0, chargesPct,
    ...(how.kind === 'cash' ? { fixedNominal: cashProjectionRate(INFLATION_DEFAULTS.ASSUMED_CPI) } : {}) });
}
function projectedIsa(stress, a, years, isaToday, chargesPct) {
  const rows = projectedIsaRows(stress, a, years, isaToday, chargesPct);
  return rows[rows.length - 1];
}

/**
 * Projected pots at retirement in TODAY'S money, from the Accumulation planner's saved inputs
 * (contributions, escalation) at the FCA middle band, less the plan's fund and platform charges (stress.chargesPct,
 * 6.19.0; none on a plan without the setting). With no contributions saved the pots simply
 * grow at the middle band — the UI says so. The ISA follows the plan's ISA choice (6.22.0; projectedIsa).
 */
export function projectedPotAtRetirement(stress, accumulation, now = new Date()) {
  const t = deriveTiming(stress, now);
  const sippToday = sippTodayOf(stress), isaToday = +stress?.isaBalance || 0;
  if (t.mode !== 'future' || !(t.currentAge > 0)) return { sipp: sippToday, isa: isaToday, low: sippToday, high: sippToday, years: 0, source: 'none', hasContributions: false };
  const a = accumulation || {};
  let totalMonthly = 0;
  try {
    if (+a.netMonthly > 0 || +a.employerMonthly > 0) totalMonthly = contributionBreakdown({ netMonthly: +a.netMonthly || 0, salary: +a.salary || 0, schemeType: a.schemeType || 'ras', employerMonthly: +a.employerMonthly || 0 }).totalMonthly || 0;
  } catch (e) { totalMonthly = 0; }
  const years = Math.max(0, t.shapeAgeNow - t.currentAge);
  const chargesPct = chargesPctOf(stress);   // the plan's fund and platform charges come off the saving years too (6.19.0)
  const rows = projectAccumulation({ currentAge: 0, retirementAge: years, potNow: sippToday, totalMonthly, escalationPct: +a.escalationPct || 0, chargesPct });
  const last = rows[rows.length - 1];
  const isaLast = projectedIsa(stress, a, years, isaToday, chargesPct);
  return { sipp: Math.round(last.potMid), isa: Math.round(isaLast.potMid), low: Math.round(last.potLow), high: Math.round(last.potHigh), years, source: 'accumulation', hasContributions: totalMonthly > 0 };
}

/**
 * The Decision tool's plan year 0 — ONE rule for the monthly engine, the tax-year wizard, the cards
 * and "plan vs actual". Priority: the Decision settings' saved anchor (seeded from the Stress plan);
 * the Stress plan's derived start when it carries one; else the first tax year set up (a plan that
 * pre-dates 6.4.0 keeps the indices its history was recorded with); else the year being set up.
 */
export function decisionAnchorYear(decisionSettings, allTaxYears, currentTaxYearKey, stressSettings = null, now = new Date()) {
  const d = decisionSettings || {};
  if (+d.firstTaxYear > 0) return +d.firstTaxYear;
  if (stressSettings && (+stressSettings.firstTaxYear > 0 || +stressSettings.currentAge > 0)) return deriveTiming(stressSettings, now).firstTaxYear;
  const keys = Object.keys(allTaxYears || {}).filter((k) => /^\d{2}\/\d{2}$/.test(k));
  if (keys.length) return Math.min(...keys.map(yearOfTaxKey));
  if (currentTaxYearKey) { const y = yearOfTaxKey(currentTaxYearKey); if (Number.isFinite(y)) return y; }
  return taxYearStartOf(now);
}

/** One-line description for the Timing block and the release notes. */
export function describeTiming(t, settings, now = new Date()) {
  const s = settings || {};
  const start = new Date(t.firstTaxYear, 3, 6);
  const when = t.yearsToStart <= 0 && start.getTime() <= now.getTime() ? 'already running'
    : t.bridgeMonths < 24 ? 'in ' + t.bridgeMonths + ' month' + (t.bridgeMonths === 1 ? '' : 's')
    : 'in ' + Math.round(t.bridgeMonths / 12) + ' years';
  const parts = [];
  if (t.mode === 'future' && t.startMonth) {
    const [y, m] = t.startMonth.split('-').map(Number);
    const mon = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][m - 1];
    parts.push('You retire in ' + mon + ' ' + y + ' at ' + t.retireAge + ', ' + (t.bridgeMonths >= 24 ? Math.round(t.bridgeMonths / 12) + ' years' : t.bridgeMonths + ' month' + (t.bridgeMonths === 1 ? '' : 's')) + ' away; the plan\'s year 0 is tax year ' + taxYearLabel(t.firstTaxYear) + ' (from 6 April ' + t.firstTaxYear + ').');
  } else parts.push('Plan starts 6 April ' + t.firstTaxYear + ' (tax year ' + taxYearLabel(t.firstTaxYear) + '), ' + when + '.');
  parts.push('Income steps start at age ' + t.shapeAgeNow + '.');
  if (s.spStartDate) {
    const sp = parseStatePensionDate(s.spStartDate);
    if (sp) { const y = taxYearStartOf(sp) - t.firstTaxYear; parts.push('State Pension from ' + taxYearLabel(taxYearStartOf(sp)) + (y >= 0 ? ' (plan year ' + y + ')' : ' (before the plan starts)') + '.'); }
  }
  if (+s.duration > 0) parts.push('Plan runs to age ' + (t.shapeAgeNow + (+s.duration) - 1) + '.');
  return parts.join(' ');
}

/**
 * A DRAFT whose start year has passed (owner decision, 6.15.0: "offer to update it to today; no automatic
 * deletion"). Since 6.13.5 a saved start year is never moved, so a plan drafted for 2027/28 and opened in 2029
 * reads as "already running" although nothing was ever committed. Pure; the screen decides what to do with it.
 *
 *  - Locked plans are never stale: their start year is the plan of record (null).
 *  - Nor is a plan with months already recorded in the Decision tool (an unlocked plan keeps its records): it
 *    really is running, and moving its year 0 would turn its recorded months into run-up months.
 *  - Already retired (or no age recorded): stale when the saved year is before the current tax year.
 *  - Retiring later at an age: the year is derived from that age, so the plan is stale once the tax year in
 *    which the age is reached has passed.
 *  - "Leave it" is remembered per saved year in `staleDraftDismissedFor`: no second offer for that year.
 * The suggestion is always the current tax year ("start now").
 *
 * @returns {null | { savedYear: number, savedLabel: string, suggestedYear: number, suggestedLabel: string, mode: 'retired'|'future'|'legacy' }}
 */
export function staleDraft(settings, { locked = false, hasRecords = false, now = new Date() } = {}) {
  if (locked || hasRecords) return null;
  const s = settings || {};
  const thisTY = taxYearStartOf(now);
  const hasAge = +s.currentAge > 0;
  let savedYear = 0, mode = 'retired';
  if (hasAge && s.retired === false && +s.retireAge > 0) { mode = 'future'; savedYear = taxYearOfAge(s, +s.retireAge, now) || 0; }
  else if (+s.firstTaxYear > 0) { savedYear = +s.firstTaxYear; if (!hasAge) mode = 'legacy'; }
  else if (!hasAge && +s.legacyFirstTaxYear > 0) { mode = 'legacy'; savedYear = +s.legacyFirstTaxYear; }
  if (!(savedYear > 0) || savedYear >= thisTY) return null;
  if (+s.staleDraftDismissedFor === savedYear) return null;
  return { savedYear, savedLabel: taxYearLabel(savedYear), suggestedYear: thisTY, suggestedLabel: taxYearLabel(thisTY), mode };
}

/** The banner's one sentence. */
export function staleDraftMessage(sd) {
  return 'This plan was set to start in ' + sd.savedLabel + ', which has passed. Update it to start now (' + sd.suggestedLabel + ')?';
}

/**
 * The start-year drop-down's options: this tax year and next 6 April, plus — so the control is never blank —
 * a saved (or currently chosen) year that is neither, labelled "2027/28 (saved)".
 * @returns {{ year: number, label: string, saved: boolean }[]} in year order
 */
export function startYearChoices(timing, savedYear = null) {
  const two = (timing && timing.startOptions) || [];
  const extra = [...new Set([+savedYear, +(timing && timing.firstTaxYear)].filter((Y) => Y > 0 && !two.includes(Y)))];
  const out = two.map((Y, i) => ({ year: Y, label: (i === 0 ? 'this tax year' : 'next 6 April') + ' — ' + taxYearLabel(Y), saved: false }));
  if (timing && timing.mode !== 'future') for (const Y of extra) out.push({ year: Y, label: taxYearLabel(Y) + ' (saved)', saved: true });
  return out.sort((a, b) => a.year - b.year);
}
