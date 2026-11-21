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
 *   ladderSentence(w, { yearSaid })  a gilt ladder's month: what the plan's rule pays, its figure marked; null beside a
 *                                year set up that says the month (the month's figure once)
 *   WHERE_KEYS                   { sentenceId: { figureKey: factId } }: which figure of a sentence is which fact, the
 *                                full view's marks (the simple view's are src/v7/components/facts.js, the same ids)
 *   stepKeysOf(s)                the step sentence's own keys (its figures are numbered by step: step# the amount, from#
 *                                the age it starts at); STEP_FINDS the month its prices are in
 *
 * Sentences are { id, parts, figures } (answers/shared/format.js partText). Pure.
 */
import { FACT, factId } from './facts.js';
import { monthText, money as moneyText } from './format.js';

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
    figures['from' + (i + 1)] = r0(nx.fromAge);
    parts.push('; the next step is ', money('step' + (i + 1)), ' from age ', { key: 'from' + (i + 1), kind: 'age' }, (nx.taxYear ? ' (' + nx.taxYear + ')' : '') + '.');
  } else parts.push('; no further steps.');
  return { id: 'where.step', parts, figures };
}

/**
 * The ladder's month (a plan drawn by a gilt ladder; services/LadderPosition.js, read live): what the plan's rule pays this
 * month, its figure marked (ladder.monthly), or when the ladder starts or that it has paid its last year. The month's figure
 * is said once (7.12.0): `yearSaid` (the year as set up is said, with the month's figure) leaves a paying month out.
 */
export function ladderSentence(w, { yearSaid = false } = {}) {
  const L = w && w.ladder;
  if (!L || typeof L.instruction !== 'string' || !L.instruction) return null;
  const pays = typeof L.monthly === 'number' && L.monthly > 0;
  if (pays && yearSaid) return null;
  if (!pays) return { id: 'where.ladder', parts: [L.instruction], figures: {} };
  const figures = { ladderMonthly: r0(L.monthly) };
  const fig = moneyText(figures.ladderMonthly);
  const at = L.instruction.indexOf(fig);
  const parts = at < 0 ? [L.instruction] : [L.instruction.slice(0, at), money('ladderMonthly'), L.instruction.slice(at + fig.length)].filter((p) => p !== '');
  return { id: 'where.ladder', parts, figures };
}

export const WHERE_KEYS = Object.freeze({
  'where.planYear': Object.freeze({ planYear: FACT.PLAN_YEAR, planYears: FACT.PLAN_YEARS }),
  'where.ladder': Object.freeze({ ladderMonthly: FACT.LADDER_MONTHLY })
});

export function stepKeysOf(s) {
  const keys = {};
  for (const k of Object.keys((s && s.figures) || {})) {
    const m = /^(step|from)(\d+)$/.exec(k);
    if (m) keys[k] = factId(m[1] === 'step' ? FACT.STEP_BEFORE_TAX : FACT.STEP_FROM_AGE, +m[2]);
  }
  return keys;
}
/** The month the step's figures are priced in ("… a year before tax at April 2026 prices"), the same find in both views. */
export const PRICES_FIND = / at ((?:January|February|March|April|May|June|July|August|September|October|November|December) \d{4}) prices\b/;
export const STEP_FINDS = Object.freeze([[PRICES_FIND, FACT.PRICES_FROM]]);
