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

/** Birthday month/day: the State Pension date IS a birthday; else the date the age was recorded; else today. */
export function birthdayOf(settings, now = new Date()) {
  const s = settings || {};
  const sp = s.spStartDate ? parseStatePensionDate(s.spStartDate) : null;
  if (sp) return { month: sp.getMonth(), day: sp.getDate(), source: 'sp' };
  if (s.currentAgeAsOf) { const t = new Date(s.currentAgeAsOf); if (Number.isFinite(t.getTime())) return { month: t.getMonth(), day: t.getDate(), source: 'asOf' }; }
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
  let asOf = s.currentAgeAsOf ? new Date(s.currentAgeAsOf) : now;
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
  let fty = +s.firstTaxYear > 0 ? +s.firstTaxYear : retired ? thisTY + 1 : taxYearOfAge(s, +s.retireAge || shape, now);
  if (!(fty >= thisTY)) fty = thisTY + 1;
  return { ...s, firstTaxYear: fty, retired, retireAge: retired ? null : (+s.retireAge || shape) };
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
    const firstTaxYear = +s.firstTaxYear > 0 ? +s.firstTaxYear : now.getFullYear() + 1;   // the pre-6.4.0 behaviour, unchanged
    return { ...base, mode: 'legacy', firstTaxYear, shapeAgeNow: +s.shapeAgeNow || 57, yearsToStart: Math.max(0, firstTaxYear - thisTY), bridgeMonths: monthsUntilStart(firstTaxYear, now) };
  }
  const currentAge = ageOnDate(s, now, now);
  if (s.retired === false && +s.retireAge > 0) {
    let firstTaxYear = taxYearOfAge(s, +s.retireAge, now);
    if (!(firstTaxYear >= thisTY)) firstTaxYear = thisTY;   // "retire at 55" at 56: the plan starts now
    const shapeAgeNow = ageInTaxYear(s, firstTaxYear, now);
    return { ...base, mode: 'future', firstTaxYear, shapeAgeNow, currentAge, retireAge: +s.retireAge,
      yearsToStart: firstTaxYear - thisTY, bridgeMonths: monthsUntilStart(firstTaxYear, now), potScale: potScaleOf(s) };
  }
  const firstTaxYear = +s.firstTaxYear >= thisTY ? +s.firstTaxYear : thisTY + 1;
  return { ...base, mode: 'retired', firstTaxYear, shapeAgeNow: ageInTaxYear(s, firstTaxYear, now), currentAge,
    yearsToStart: firstTaxYear - thisTY, bridgeMonths: monthsUntilStart(firstTaxYear, now) };
}

/** Today's SIPP-side pot as the settings describe it (the allocation pots + diversifiers). */
export function sippTodayOf(settings) {
  const s = settings || {};
  return (+s.equityMin || 0) + (+s.bondMin || 0) + (+s.cashTarget || 0) + (+s.diversifierStart || 0);
}

/**
 * Scale factors that turn today's pots into the pots at retirement (future mode only). Read from the
 * saved `potAtRetirement` — the UI writes the projection (or the user's override) there at save time,
 * so the engines never need the Accumulation inputs. 1 when nothing is set.
 */
export function potScaleOf(settings) {
  const s = settings || {};
  const p = s.potAtRetirement;
  const out = { sipp: 1, isa: 1 };
  if (!p || s.retired !== false) return out;
  const sippToday = sippTodayOf(s), isaToday = +s.isaBalance || 0;
  if (+p.sipp > 0 && sippToday > 0) out.sipp = +p.sipp / sippToday;
  if (+p.isa > 0 && isaToday > 0) out.isa = +p.isa / isaToday;
  return out;
}

/**
 * Projected pots at retirement in TODAY'S money, from the Accumulation planner's saved inputs
 * (contributions, escalation) at the FCA middle band. With no contributions saved the pots simply
 * grow at the middle band — the UI says so.
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
  const rows = projectAccumulation({ currentAge: 0, retirementAge: years, potNow: sippToday, totalMonthly, escalationPct: +a.escalationPct || 0 });
  const last = rows[rows.length - 1];
  const isaRows = projectAccumulation({ currentAge: 0, retirementAge: years, potNow: isaToday, totalMonthly: 0 });
  const isaLast = isaRows[isaRows.length - 1];
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
  const parts = ['Plan starts 6 April ' + t.firstTaxYear + ' (tax year ' + taxYearLabel(t.firstTaxYear) + '), ' + when + '.'];
  parts.push('Income steps start at age ' + t.shapeAgeNow + '.');
  if (s.spStartDate) {
    const sp = parseStatePensionDate(s.spStartDate);
    if (sp) { const y = taxYearStartOf(sp) - t.firstTaxYear; parts.push('State Pension from ' + taxYearLabel(taxYearStartOf(sp)) + (y >= 0 ? ' (plan year ' + y + ')' : ' (before the plan starts)') + '.'); }
  }
  if (+s.duration > 0) parts.push('Plan runs to age ' + (t.shapeAgeNow + (+s.duration) - 1) + '.');
  return parts.join(' ');
}
