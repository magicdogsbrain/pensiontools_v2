/**
 * The one formatter (lead4.md R1, R7; step F1): how every figure drawn from the reading is written, in both views, with ONE
 * rounding rule per fact. Pure, and the same on every device: no toLocaleString. The simple view's sentences
 * (src/answers/shared/format.js money, ageText, pot) are these functions; the full view's marked figures are written here.
 *
 *   money(n)        1380 → '£1,380'. Whole pounds; never a minus, never pence; 0 → '£0'.
 *   moneyK(n)       the nearest £1,000: 468,250 → '£468,000' (a figure worked out over many futures, never to the pound)
 *   ageText(n)      95.6 → '95'. Whole years, rounded down.
 *   monthText(ym)   '2027-05' (or '2027-05-14', or a Date) → 'May 2027'; '' when it is not a month
 *   dayText(d)      '2026-11-03' → '3 November 2026'; '' when it is not a day
 *   spanText(m)     months to go: 7 → '7 months', 19 → '1 year 7 months', 24 → '2 years', 131 → '10 years' (whole years
 *                   rounded down; the months said too under two years, and alone under one)
 *   pctText(n)      31 → '31%', 26.5 → '26.5%' (two places at most)
 *   weekText(n)     a State Pension a week, pounds and pence as the forecast gives it: 241.3 → '£241.30'
 *
 *   FACT_FORMAT     fact id (src/reading/facts.js) → its rule
 *   formatFact(id, value)   the value as every place shows it ('' for nothing known)
 */

import { patternOf } from './facts.js';

const group = (v) => String(v).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

export function money(n) {
  return '£' + group(Math.abs(Math.round(Number(n) || 0)));
}

export function moneyK(n) {
  return money(Math.round(Math.abs(Number(n) || 0) / 1000) * 1000);
}

export function ageText(n) {
  return String(Math.floor(Number(n) || 0));
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export function monthText(x) {
  if (x instanceof Date) return Number.isFinite(x.getTime()) ? MONTHS[x.getMonth()] + ' ' + x.getFullYear() : '';
  const m = /^(\d{4})-(\d{2})/.exec(String(x == null ? '' : x));
  if (!m || +m[2] < 1 || +m[2] > 12) return '';
  return MONTHS[+m[2] - 1] + ' ' + m[1];
}

/** A calendar day: '2026-11-03' (or an ISO time on that day) → '3 November 2026'; '' when it is not a day. */
export function dayText(x) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(x == null ? '' : x));
  if (!m || +m[2] < 1 || +m[2] > 12) return '';
  return +m[3] + ' ' + MONTHS[+m[2] - 1] + ' ' + m[1];
}

export function spanText(months) {
  const n = Math.max(0, Math.round(Number(months) || 0));
  const y = Math.floor(n / 12), m = n % 12;
  const yw = y + ' year' + (y === 1 ? '' : 's'), mw = m + ' month' + (m === 1 ? '' : 's');
  return y === 0 ? mw : y < 2 && m > 0 ? yw + ' ' + mw : yw;
}

/** A State Pension a week, as the forecast letter gives it: pounds and pence. 241.3 → '£241.30'. */
export function weekText(n) {
  return '£' + (Math.round(Math.abs(Number(n) || 0) * 100) / 100).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/, ',');
}

export function pctText(n) {
  return String(Math.round((Number(n) || 0) * 100) / 100) + '%';
}

const asIs = (v) => (v == null ? '' : String(v));

/** One rule per fact (the facts this formatter holds so far; a fact moved onto the reading adds its rule here). */
export const FACT_FORMAT = Object.freeze({
  'pot.today': money,
  'isa.today': money,
  'pot.today.asOf': monthText,   // the month of the record the pension today is from (step F5, R4)
  'gia.today': money,
  'cash.today': money,
  'pot.againstPlan': money,
  'pot.planMiddle': money,
  'pot.planLow': money,
  'pot.atStop': moneyK,
  'pot.atStop.low': moneyK,
  'pot.atStop.high': moneyK,
  'age.today': ageText,
  'plan.endAge': ageText,
  'plan.year': (n) => String(Math.round(Number(n) || 0)),
  'plan.years': (n) => String(Math.round(Number(n) || 0)),
  'income.step.#.fromAge': ageText,
  'plan.pricesFrom': monthText,
  'ladder.monthly': money,
  'doc.lasts.chance': asIs,
  'doc.lasts.fixedChance': asIs,
  'doc.lasts.toAge': asIs,
  'stop.month': monthText,
  yearsToGo: spanText,
  stage: asIs,
  'plan.name': asIs,
  // step F2: income steps (indexed: the pattern's rule), the State Pension (its start in the person's own day words)
  'income.step.#.beforeTax': money,
  'income.step.#.monthAfterTax': money,
  'statePension.week': weekText,
  'statePension.amount': money,
  'statePension.age': ageText,
  'statePension.start': asIs,
  // step F2 (D7): this tax year as set up, and the plan's own figure for it
  'income.thisYear.beforeTax': money,
  'income.thisYear.planSays': money,
  'income.thisYear.perMonth': money,
  'income.thisYear.total': money,
  'income.thisYear.from': monthText,
  'income.thisYear.setUpOn': dayText,
  // step F3: each way's figures in the ways list (src/reading/ways.js wayFiguresOf). What is left at the end is worked out
  // over many futures: the nearest £1,000, as "Does it last?" says it (lead4.md D8: one precision); the rest whole pounds
  'way.#.left': moneyK,
  'way.#.badLeft': moneyK,
  'way.#.worst12': money,
  'way.#.spent': money
});

/** The value of a fact as every place writes it; '' when nothing is known. */
export function formatFact(id, value) {
  if (value == null || value === '') return '';
  const f = FACT_FORMAT[id] || FACT_FORMAT[patternOf(id)];
  if (!f) throw new Error('format: no rule for "' + id + '" (src/reading/format.js FACT_FORMAT)');
  return f(value);
}
