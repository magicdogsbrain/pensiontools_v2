/**
 * The State Pension a plan counts (lead4.md D2, D6; step F2): ONE reader, given (plan, ctx), for both views — its amount (a
 * week and a year), the day it starts and the age then, or none — and ONE sentence for a State Pension nobody entered.
 *
 *   statePensionOf(plan, ctx) → {
 *     kind        'full' | 'forecast'   a weekly amount the person gave (the full new State Pension, or their forecast)
 *                 'assumed'             nothing entered: the runs count the plan's yearly figure from the age they put it at
 *                                       (IncomeSchedule.defaultSpYear) — said in both views, never hidden
 *                 'none'                the person said they have none: nothing is counted
 *     week, year  the amount (week null when only a yearly figure is held)
 *     startDate   the person's own date ('YYYY-MM-DD'), or null (an assumed one has none)
 *     startWords  the date as both views write it ("2 November 2053"), '' when none
 *     startAge    the age the runs start paying it (from the date; for an assumed one, the age the runs put it at)
 *     taxYear     the tax year it starts in (the year it falls in), or null
 *     assumed     true for 'assumed'
 *   }
 *   SP_ASSUMED_WORDS / spAssumedWords(sp)   "We assumed £12,000 a year before tax from age 67: no State Pension was
 *                                            entered." — the one sentence both views say beside the figure, with a
 *                                            "Change it" that goes to the State Pension's boxes; '' when not assumed
 *
 * Pure (the plan's settings are read once, by the simple view's income reading, on ctx's day).
 */
import { savedIncome } from '../answers/plan/income.js';
import { parseStatePensionDate } from '../utils/StatePensionUtils.js';
import { money } from './format.js';
import { dayKeyOf } from './clock.js';

const num = (v) => (v == null || v === '' || !Number.isFinite(+v) ? null : +v);
const pad = (n) => String(n).padStart(2, '0');
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/** A State Pension date as stored (the planner's "6 May 2040" or a seed's '2040-05-06') → 'YYYY-MM-DD', or null. */
export function spDayOf(text) {
  if (!text) return null;
  const iso = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(text));
  if (iso) return iso[1] + '-' + iso[2] + '-' + iso[3];
  const d = parseStatePensionDate(String(text));
  return d && Number.isFinite(d.getTime()) ? d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) : null;
}

/** 'YYYY-MM-DD' → "2 November 2053" (the words both views write a State Pension date in); '' when not a day. */
export function spDayWords(day) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(day || ''));
  return m && +m[2] >= 1 && +m[2] <= 12 ? +m[3] + ' ' + MONTHS[+m[2] - 1] + ' ' + m[1] : '';
}

const todayOfCtx = (ctx) => (ctx && typeof ctx.today === 'string' ? ctx.today : dayKeyOf(ctx && ctx.now instanceof Date ? ctx.now : new Date()));

export function statePensionOf(plan, ctx = {}) {
  let sp = null;
  try { sp = savedIncome(plan, { today: todayOfCtx(ctx) }).sp; } catch { sp = null; }
  if (!sp) return { kind: 'none', week: null, year: 0, startDate: null, startWords: '', startAge: null, taxYear: null, assumed: false };
  const kind = sp.kind;
  const startDate = kind === 'none' || kind === 'assumed' ? null : spDayOf(sp.date);
  return {
    kind,
    week: num(sp.weekly),
    year: kind === 'none' ? 0 : num(sp.yearly) || 0,
    startDate,
    startWords: spDayWords(startDate),
    startAge: kind === 'none' ? null : num(sp.fromAge),
    taxYear: kind === 'none' ? null : num(sp.taxYear),
    assumed: kind === 'assumed'
  };
}

export function spAssumedWords(sp) {
  if (!sp || !sp.assumed) return '';
  return 'State Pension: we assumed ' + money(sp.year) + ' a year before tax from ' + (sp.startAge != null ? 'age ' + sp.startAge : 'your State Pension age') + ', as none was entered.';
}
export const SP_CHANGE_IT = 'Change it: choose the full amount, your forecast, or none.';
