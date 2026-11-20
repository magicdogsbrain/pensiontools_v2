/**
 * This tax year in the full view (step F2, lead4.md D7): the one reader (src/reading/thisYear.js) drawn as HTML, with the
 * figures marked as the simple view marks them.
 *
 *   thisYearOfPlan(plan, now, key)        the reading for the plan as saved (null on a fault)
 *   yearIncomeHtml(t)                     the year's income as set up, a year before tax, marked (Tax Years' "Income for the year")
 *   yearChangedHtml(t, { button })        the line said when the plan's own figure differs from the set-up, with the
 *                                         "Set this year up again" button (button: the onclick call), '' when they agree
 *   yearPlanHtml(t)                       the year as set up, the very sentence "Where you are" says in the simple view
 */
import { thisTaxYearOf, thisYearSentences } from '../reading/thisYear.js';
import { sentenceHtml, THIS_YEAR_FACTS, THIS_YEAR_MARKS } from '../reading/sentenceMarks.js';
import { markFact } from '../reading/mark.js';
import { FACT } from '../reading/facts.js';
import { money, monthText } from '../reading/format.js';

const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export function thisYearOfPlan(plan, now, key = null) {
  try { return thisTaxYearOf(plan, { now }, key ? { key } : {}); } catch { return null; }
}

export function yearIncomeHtml(t, { current = true } = {}) {
  if (!t || !t.setUp || t.setUp.perYear == null) return '—';
  // the fact is THIS tax year's: another year's figure is said, unmarked
  return (current ? markFact(FACT.YEAR_SET_UP, esc(money(t.setUp.perYear))) : esc(money(t.setUp.perYear))) + ' a year before tax';
}

/** The month the year was set up from (April, or the month a part year began), marked as this tax year's fact. */
export function yearFromHtml(t, { current = true } = {}) {
  if (!t || !t.setUp || !t.setUp.from) return '—';
  const w = esc(monthText(t.setUp.from));
  return current ? markFact(FACT.YEAR_FROM, w) : w;
}

const sentenceOf = (t, id) => thisYearSentences(t).find((s) => s.id === id) || null;

export function yearPlanHtml(t) {
  const s = sentenceOf(t, 'where.yearPlan');
  return s ? sentenceHtml(s, s.figures, THIS_YEAR_MARKS, esc) : '';
}

export function yearChangedHtml(t, { button = '' } = {}) {
  const s = sentenceOf(t, 'where.yearChanged');
  if (!s) return '';
  const btn = button ? ' <button class="btn secondary" data-testid="setUpAgain" data-on-click="' + esc(button) + '">Set this year up again</button>' : '';
  return '<div class="alert alert-warning" data-sentence-id="where.yearChanged"><p style="margin:0;">' + sentenceHtml(s, s.figures, { keys: THIS_YEAR_FACTS }, esc) + '</p>' + (btn ? '<p style="margin:8px 0 0;">' + btn + '</p>' : '') + '</div>';
}
