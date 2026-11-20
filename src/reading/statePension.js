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
 *   spAssumedHtml(sp) / spAssumedWords(sp)  "State Pension: we assumed £12,000 a year before tax from age 67, as none was
 *                                            entered." — the one sentence both views say beside the figure (the HTML with
 *                                            its amount and age marked; the words), with a "Change it" that goes to the
 *                                            State Pension's boxes; '' when not assumed
 *   spLineHtml(plan, ctx)                   the State Pension the plan counts, in the simple income page's own line
 *                                            (income.js spLineOf), marked, with the week by the fact's one rule: the full
 *                                            view's line under its State Pension boxes
 *
 * Pure (the plan's settings are read once, by the simple view's income reading, on ctx's day).
 */
import { savedIncome, spLineOf } from '../answers/plan/income.js';
import { parseStatePensionDate } from '../utils/StatePensionUtils.js';
import { formatFact } from './format.js';
import { dayKeyOf } from './clock.js';
import { markFact, unmarked } from './mark.js';
import { INCOME } from '../v7/copy/income.js';
import { slotFactsOf } from '../v7/components/facts.js';

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

const esc = (t) => String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;');

/** Words with {slots}, each slot that holds a fact drawn marked (the full view's HTML; the simple view's fillMarked). */
function fillHtml(text, slots, marks) {
  return esc(text).replace(/\{(\w+)\}/g, (m, k) => (k in slots && slots[k] != null ? (marks[k] ? markFact(marks[k], esc(slots[k])) : esc(slots[k])) : m));
}

/** The assumed State Pension's sentence (the simple view's INCOME.derived 'sp.assumed'), its amount and age marked; ''. */
export function spAssumedHtml(sp) {
  if (!sp || !sp.assumed) return '';
  const id = sp.startAge != null ? 'sp.assumed' : 'sp.assumedNoAge';
  const slots = { yearly: formatFact('statePension.amount', sp.year), age: sp.startAge != null ? formatFact('statePension.age', sp.startAge) : null };
  return fillHtml(INCOME.derived[id], slots, slotFactsOf('income.' + id, slots));
}
export function spAssumedWords(sp) {
  return unmarked(spAssumedHtml(sp));
}
export const SP_CHANGE_IT = 'Change it: choose the full amount, your forecast, or none.';
/** The week the plan counts, after the line, in the full view (the simple plan page says the week as its own figure). */
export const SP_WEEK_WORDS = 'That is {week} a week.';

/**
 * The State Pension the plan counts, as the full view says it under its State Pension boxes: the simple income page's own
 * line (answers/plan/income.js spLineOf over the plan as saved), its figures marked as the simple view marks them; when
 * assumed, "Change it"; when a weekly figure was given, the week by the fact's one rule. { html, assumed }; html '' when
 * the plan cannot be read.
 */
export function spLineHtml(plan, ctx = {}) {
  let saved = null;
  try { saved = savedIncome(plan, { today: todayOfCtx(ctx) }); } catch { saved = null; }
  if (!saved || !saved.sp) return '';
  const ln = spLineOf(saved.sp);
  let html = fillHtml(INCOME.derived[ln.id] || '', ln.slots, slotFactsOf('income.' + ln.id, ln.slots));
  const sp = statePensionOf(plan, ctx);
  if (sp.assumed) html += ' ' + esc(SP_CHANGE_IT);
  else if (sp.kind !== 'none' && sp.week > 0) html += ' ' + fillHtml(SP_WEEK_WORDS, { week: formatFact('statePension.week', sp.week) }, { week: 'statePension.week' });
  return html;
}
