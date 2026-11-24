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
 *   potSentence(w)               the pot set against the plan's band, ONE basis (the band's: whereAmI's `real`), with the
 *                                figure as recorded in brackets when prices have moved and its parts named when there is
 *                                more than one: { pot: 'where.pot' sentence (no full stop: the full view goes on with the
 *                                band), parts: 'where.potParts' sentence (each part with its date, when they are more
 *                                than a month apart) | null, source: { kind: 'record' | 'hold', at } (the record's date,
 *                                R4) }. null with no pot to set against the band.
 *   WHERE_KEYS                   { sentenceId: { figureKey: factId } }: which figure of a sentence is which fact, the
 *                                full view's marks (the simple view's are src/v7/components/facts.js, the same ids)
 *   stepKeysOf(s)                the step sentence's own keys (its figures are numbered by step: step# the amount, from#
 *                                the age it starts at); STEP_FINDS the month its prices are in
 *
 * Sentences are { id, parts, figures } (answers/shared/format.js partText). Pure.
 */
import { FACT, factId } from './facts.js';
import { monthText, money as moneyText } from './format.js';
import { ym, monthWords, monthsBetween } from '../answers/plan/dates.js';

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
  // a step the reading could not give is said as stored, under a key no view marks: it is not the reading's figure
  const keyOf = (k) => (read(k) != null ? 'step' + k : 'storedStep' + k);
  const figures = { [keyOf(i)]: read(i) != null ? read(i) : r0(w.step.amount) };
  const since = w.pot && w.pot.prices && w.pot.prices.since ? monthText(w.pot.prices.since) : '';
  const parts = ['Income step ' + w.step.index + ' of ' + w.step.of + ': ', money(keyOf(i)), ' a year before tax' + (since ? ' at ' + since + ' prices' : '')];
  const nx = w.step.next;
  if (nx) {
    figures[keyOf(i + 1)] = read(i + 1) != null ? read(i + 1) : r0(nx.amount);
    figures['from' + (i + 1)] = r0(nx.fromAge);
    parts.push('; the next step is ', money(keyOf(i + 1)), ' from age ', { key: 'from' + (i + 1), kind: 'age' }, (nx.taxYear ? ' (' + nx.taxYear + ')' : '') + '.');
  } else parts.push('; no further steps.');
  return { id: 'where.step', parts, figures };
}

/**
 * The ladder's month (a plan drawn by a gilt ladder; services/LadderPosition.js, read live): what the plan's rule pays this
 * month, its figure marked (ladder.monthly), or when the ladder starts (what it pays a month from then marked,
 * ladder.firstMonthly) or that it has paid its last year. The month's figure
 * is said once (7.12.0): `yearSaid` (the year as set up is said, with the month's figure) leaves a paying month out.
 */
export function ladderSentence(w, { yearSaid = false } = {}) {
  const L = w && w.ladder;
  if (!L || typeof L.instruction !== 'string' || !L.instruction) return null;
  const pays = typeof L.monthly === 'number' && L.monthly > 0;
  if (pays && yearSaid) return null;
  // not paying yet: the plan's own sentence, its first month's payment marked (ladder.firstMonthly) when it is said
  if (!pays) return markedOnce(L.instruction, 'ladderFirstMonthly', typeof L.firstMonthly === 'number' && L.firstMonthly > 0 ? r0(L.firstMonthly) : null);
  return markedOnce(L.instruction, 'ladderMonthly', r0(L.monthly));
}
/** The ladder's sentence with its one figure marked where it is said (its first saying); no figure, the words alone. */
function markedOnce(text, key, value) {
  if (value == null) return { id: 'where.ladder', parts: [text], figures: {} };
  const fig = moneyText(value);
  const at = text.indexOf(fig);
  if (at < 0) return { id: 'where.ladder', parts: [text], figures: {} };
  const parts = [text.slice(0, at), money(key), text.slice(at + fig.length)].filter((p) => p !== '');
  return { id: 'where.ladder', parts, figures: { [key]: value } };
}

export function potSentence(w) {
  const P = w && w.pot;
  if (!P || P.real == null || P.actual == null) return null;
  const figures = { pot: r0(P.real), potActual: r0(P.actual) };
  const moved = !!P.prices && Number.isFinite(+P.prices.factor) && Math.abs(+P.prices.factor - 1) >= 0.0005;
  // its parts as recorded: the pension and the ISA, each from where and when it came
  const parts = (Array.isArray(P.parts) ? P.parts : []).filter((x) => x && x.asOf && (x.key === 'pension' || x.key === 'isa'));
  const whence = (x) => (x.source === 'holdings' ? 'from What you hold, ' + monthWords(x.asOf) : 'recorded ' + monthWords(x.asOf));
  const partKey = (x) => (x.key === 'pension' ? 'potPension' : 'potIsa');
  parts.forEach((x) => { figures[partKey(x)] = r0(x.value); });
  const partName = (x) => (x.key === 'isa' ? 'ISA ' : 'pension ');
  const together = parts.length > 1 && whence(parts[0]) === whence(parts[1]);
  // named in the sentence whenever there is more than one; one part, the pension: the figure as recorded is the pension today
  const inLine = parts.length > 1 ? parts.flatMap((x, i) => [...(i ? [', '] : []), partName(x), money(partKey(x))]) : [];
  const named = inLine.length > 0;
  const pensionOnly = parts.length === 1 && parts[0].key === 'pension';
  if (pensionOnly) figures.potPension = r0(P.actual);
  const month = monthWords(P.prices && P.prices.since) || 'the start of the plan';
  const said = moved
    ? [money('pot'), ' at the prices of ' + month + ' (', money(pensionOnly ? 'potPension' : 'potActual'), ' as recorded', ...(named ? [': ', ...inLine] : []), ')']
    : [money(pensionOnly ? 'potPension' : 'pot'), ...(named ? [' (', ...inLine, ')'] : [])];
  // the parts' own dates when they are more than a month apart
  const ms = parts.map((x) => ym(x.asOf)).filter(Boolean);
  let partsSaid = null;
  if (parts.length > 1 && !together && ms.length === parts.length && Math.abs(monthsBetween(ms[0], ms[1])) > 1) {
    const words = parts.map((x) => [(x.key === 'isa' ? 'ISA ' : 'Pension '), money(partKey(x)), ', ' + whence(x) + '.']);
    partsSaid = { id: 'where.potParts', parts: words.reduce((a, b, i) => a.concat(i ? [' '] : [], b), []), figures };
  }
  return { pot: { id: 'where.pot', parts: said, figures }, parts: partsSaid, source: { kind: P.source === 'holdings' ? 'hold' : 'record', at: P.asOf || null } };
}

export const WHERE_KEYS = Object.freeze({
  'where.pot': Object.freeze({ pot: FACT.POT_AGAINST_PLAN, potPension: FACT.POT_TODAY, potIsa: FACT.ISA_TODAY }),
  'where.potParts': Object.freeze({ potPension: FACT.POT_TODAY, potIsa: FACT.ISA_TODAY }),
  'where.planYear': Object.freeze({ planYear: FACT.PLAN_YEAR, planYears: FACT.PLAN_YEARS }),
  'where.ladder': Object.freeze({ ladderMonthly: FACT.LADDER_MONTHLY, ladderFirstMonthly: FACT.LADDER_FIRST_MONTHLY })
});

export function stepKeysOf(s) {
  const keys = {};
  for (const k of Object.keys((s && s.figures) || {})) {
    const m = /^(step|from)(\d+)$/.exec(k);
    if (m) keys[k] = factId(m[1] === 'step' ? FACT.STEP_BEFORE_TAX : FACT.STEP_FROM_AGE, +m[2]);
  }
  return keys;
}
/** The month the step's figures are priced in: the find both views mark it by (src/reading/sentenceMarks.js). */
export { STEP_FINDS } from './sentenceMarks.js';
