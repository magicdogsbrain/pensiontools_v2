/**
 * "Where you are" (lead4.md D17, R8; step F5): ONE sentence builder for both views, over the one gatherer
 * (PlanReading.whereAmIFor). The full view's strip (PlanDocumentView.whereAmIHtml) and the simple view's Where you are
 * (answers/plan/read.js) draw these sentences; neither words the plan year or the income step of its own.
 *
 *   planYearSentence(w)          the plan year this tax year is, and how many tax years the plan runs, said without
 *                                "plan year N" (the simple view's wording rule: an age or a tax year): the plan's own
 *                                count from its first tax year (0 in it), as the full view's Timing and plan document
 *                                count it. null before the plan's first tax year (a saver, a plan set to start later).
 *   stepSentence(w, steps)       the income step in force, a year before tax as it is taken (src/reading/income.js
 *                                incomeStepsOf: never the stored figure as "gross"), in the plan's own prices, and the
 *                                next step with the age it starts at. null with no step.
 *   WHERE_KEYS                   { sentenceId: { figureKey: factId } }: which figure of a sentence is which fact, the
 *                                full view's marks (the simple view's are src/v7/components/facts.js, the same ids)
 *   stepKeysOf(s)                the step sentence's own keys (its figures are numbered by step)
 *
 * Sentences are { id, parts, figures } (answers/shared/format.js partText). Pure.
 */
import { FACT, factId } from './facts.js';
import { monthText } from './format.js';

const money = (key) => ({ key, kind: 'money' });
const count = (key) => ({ key, kind: 'count' });
const r0 = (v) => Math.round(Number(v) || 0);

export function planYearSentence(w) {
  if (!w || w.beforeStart || w.saving) return null;
  const y = Number(w.planYear), n = Number(w.planYears);
  if (!Number.isFinite(y) || !Number.isFinite(n) || y < 0 || !(n > 0)) return null;
  const figures = { planYear: r0(y), planYears: r0(n) };
  const head = 'Tax year ' + w.taxYear + ' is ';
  const years = (k) => (figures[k] === 1 ? ' tax year' : ' tax years');
  const parts = y === 0 ? [head + 'the first of your plan’s ', count('planYears'), years('planYears') + '.']
    : y >= n ? [head + 'after the last of your plan’s ', count('planYears'), years('planYears') + '.']
      : [head, count('planYear'), (y === 1 ? ' year' : ' years') + ' into your plan, which runs ', count('planYears'), years('planYears') + '.'];
  return { id: 'where.planYear', parts, figures };
}

export function stepSentence(w, steps = null) {
  if (!w || !w.step || w.step.amount == null) return null;
  const i = w.step.index - 1;
  const read = (k) => (Array.isArray(steps) && steps[k] && Number.isFinite(+steps[k].beforeTax) ? r0(steps[k].beforeTax) : null);
  const figures = { ['step' + i]: read(i) != null ? read(i) : r0(w.step.amount) };
  const since = w.pot && w.pot.prices && w.pot.prices.since ? monthText(w.pot.prices.since) : '';
  const parts = ['Income step ' + w.step.index + ' of ' + w.step.of + ': ', money('step' + i), ' a year before tax' + (since ? ' at ' + since + ' prices' : '')];
  const nx = w.step.next;
  if (nx) {
    figures['step' + (i + 1)] = read(i + 1) != null ? read(i + 1) : r0(nx.amount);
    parts.push('; the next step is ', money('step' + (i + 1)), ' from age ' + nx.fromAge + (nx.taxYear ? ' (' + nx.taxYear + ')' : '') + '.');
  } else parts.push('; no further steps.');
  return { id: 'where.step', parts, figures };
}

export const WHERE_KEYS = Object.freeze({
  'where.planYear': Object.freeze({ planYear: FACT.PLAN_YEAR, planYears: FACT.PLAN_YEARS })
});

export function stepKeysOf(s) {
  const keys = {};
  for (const k of Object.keys((s && s.figures) || {})) { const m = /^step(\d+)$/.exec(k); if (m) keys[k] = factId(FACT.STEP_BEFORE_TAX, +m[1]); }
  return keys;
}
