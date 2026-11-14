/**
 * A row of "Try the bad years" in short (7.9.0; research/v7/replan-nov-2026.md §5: each row is "weighted chance, run-out
 * age, floor"), for the panel on a plan (answers/plan/stressPanel.js, both apps) and the strip under C's and D's answers
 * (shared/stressStrip.js): ONE builder, so the three places say a row the same way. Each is a sentence of
 * src/v7/copy/stressPanel.js STRESS.short as { id, slots } (a slot may itself be one); the screens fill them (sayStress).
 *
 *   chanceShort(me, ref, o)      the chance line: the weighted chance and, beside it, the count to the plan-to age that names
 *                                its age — { weighted: part|null, fixed: part } — each with the reference's figure on a row
 *                                that has one ("(as planned 18)"). With no weighted figure, the fixed-age sentence alone.
 *   runsOutShort(when, ref, o)   where it runs out: the typical age in the futures that run out and the worst 1 in 10 of
 *                                all of them, beside the reference's ("(as planned 97 and 93)")
 *   planFloorShort(floor, o)     what still comes in, said once above the rows (a plan's words, OneAnswer.weightedWordsOf)
 *   answerFloorShort(floor, o)   the same under an answer (shared/lastsWords.js floorParts' words)
 *   sameFloor(a, b)              whether a row's floor says what the one above the rows says (then its own is not said)
 *
 * The floor is said without an age when something comes in (or nothing ever does); when nothing has started by then, the
 * row's own sentence, with its age, is the one said. Every figure is the row's own (the same twentieths, ages and pounds the
 * long sentences say); nothing is worked out here. Pure: no clock, no storage, no copy (the screens hold the words).
 */
import { chanceWords, chanceTwentieths, twentiethsOfFutures, fixedAgeWords, money } from './format.js';

const isNum = (v) => typeof v === 'number' && Number.isFinite(v);
const clamp = (v) => Math.max(0, Math.min(1, Number(v) || 0));
const noStop = (t) => String(t || '').replace(/\.\s*$/, '');
const P = (id, slots = {}) => ({ id: 'short.' + id, slots });

/** A reference's figure in a row's brackets: "18", or its words ("more than 19", "in every one"). */
function refN(share, { weighted = false, sumW = null, n = null } = {}) {
  const v = clamp(share);
  if (v >= 1) return P('n.every');
  if (v <= 0) return P('n.none');
  const k = weighted ? chanceTwentieths(v, { sumW, n }) : Math.round(v * 20);
  if (k >= 20) return P('n.moreThan19');
  if (k <= 0) return P('n.fewerThan1');
  return String(k);
}
const asOf = (as) => P('as.' + (as === 'asHeld' ? 'asHeld' : 'asPlanned'));
const refOf = (as, n) => P('ref', { as: asOf(as), n });
const LASTS = { 'ran-out': 'ranOut', cut: 'cut', lean: 'lean' };

/**
 * The chance line (see the header).
 * @param {{ weighted: number|null, sumW?: number|null, n?: number|null, fixedAge: number }} me   the row's figures
 * @param {object|null} ref   the reference's, the same shape (null: the row is the reference itself)
 * @param {{ planToAge: number, kind?: string, couple?: null|'you'|'younger', as?: string, fixedWords?: string }} o
 *   `couple` how a couple's age is said ('younger': "the younger of you is 99", an answer's; 'you': "you are 103", a plan's);
 *   `fixedWords` the row's own fixed-age sentence when it has no weighted figure (a plan's: OneAnswer's own words)
 */
export function chanceShort(me, ref, { planToAge, kind = 'ran-out', couple = null, as = 'asPlanned', fixedWords = null } = {}) {
  const fixedRef = ref ? refOf(as, refN(ref.fixedAge)) : '';
  const age = String(planToAge);
  const k = LASTS[kind] || 'ranOut';
  if (isNum(me.weighted) && couple !== 'you') {
    const weighted = P('weighted', {
      lasts: P('lasts.' + (k === 'ranOut' && couple ? 'ranOutCouple' : k)),
      chance: chanceWords(me.weighted, { sumW: me.sumW, n: me.n }),
      ref: ref && isNum(ref.weighted) ? refOf(as, refN(ref.weighted, { weighted: true, sumW: ref.sumW, n: ref.n })) : ''
    });
    return { weighted, fixed: P(couple ? 'fixedCouple' : 'fixed', { age, count: twentiethsOfFutures(me.fixedAge), ref: fixedRef }) };
  }
  const words = fixedWords || fixedAgeWords(me.fixedAge, planToAge, { kind, couple: couple ? { name: couple === 'you' ? 'you' : 'the younger of you' } : null });
  return { weighted: null, fixed: P('fixedOnly', { words: noStop(words), ref: fixedRef }) };
}

/**
 * Where it runs out (see the header).
 * @param {{ typical: number, worst: number, worstLasts: boolean }|null} when   the row's (null: none ran out)
 * @param {object|null|undefined} ref   the reference's `when`: undefined when the row is the reference, null when none ran out there
 * @param {{ planToAge: number, younger?: boolean, as?: string }} o   `younger`: a couple's ages, said as the younger person's
 */
export function runsOutShort(when, ref, { planToAge, younger = false, as = 'asPlanned' } = {}) {
  const age = String(planToAge);
  const has = ref !== undefined;
  const rLasts = !ref || ref.worstLasts;
  if (!when) {
    return P('stillLasts', { age, refWorst: has && !rLasts ? P('refWorstBy', { as: asOf(as), age: String(ref.worst) }) : '' });
  }
  const typical = P(younger ? 'atYounger' : 'at', { age: String(when.typical) });
  const worst = P(younger ? 'byYounger' : 'by', { age: String(when.worst) });
  if (!has) return when.worstLasts ? P('runsOutLasts', { typical, refTypical: '', age, refWorst: '' }) : P('runsOut', { typical, refTypical: '', worst, refWorst: '' });
  // beside the reference: both of its ages in one bracket when both are ages, else each figure's own
  if (!when.worstLasts && !rLasts) return P('runsOutBoth', { typical, worst, as: asOf(as), age1: String(ref.typical), age2: String(ref.worst) });
  const refTypical = ref ? P('refTypical', { as: asOf(as), age: String(ref.typical) }) : P('refTypicalNone', { as: asOf(as) });
  if (when.worstLasts) {
    return P('runsOutLasts', { typical, refTypical, age, refWorst: rLasts ? P('refWorstSame', { as: asOf(as) }) : P('refWorstBy', { as: asOf(as), age: String(ref.worst) }) });
  }
  return P('runsOut', { typical, refTypical, worst, refWorst: P('refWorstLasts', { as: asOf(as), age }) });
}

/**
 * What still comes in if the money runs out, on a plan (OneAnswer's floor { age, yearly, spAge, spAssumed? }): without an age
 * when something comes in; else the row's own sentence (`words`, with its age). Null with no floor.
 */
export function planFloorShort(floor, { kind = 'ran-out', words = null } = {}) {
  if (!floor || !isNum(floor.yearly)) return null;
  if (floor.yearly > 0) {
    return P('floor.plan', { runsOut: P('floor.runsOut.' + (LASTS[kind] || 'ranOut')), amount: money(floor.yearly), assumed: floor.spAssumed ? P('floor.assumed') : '' });
  }
  return words ? { id: 'lines.plain', slots: { words } } : null;
}

/**
 * The same under an answer (shortfall.js floor { age, yearly, survivor, sp, fs, spAge }; a couple's both and the one left):
 * without an age when something comes in; else the row's own sentence (`words`). Null with no floor.
 */
export function answerFloorShort(floor, { couple = false, words = null } = {}) {
  if (!floor) return null;
  if (floor.yearly > 0) {
    const from = floor.fs ? 'pensions' : couple && floor.sp > 1 ? 'statePensions' : floor.sp ? 'statePension' : 'pensions';
    const survivor = !(couple && isNum(floor.survivor)) ? '' : floor.survivor > 0 ? P('floor.survivor', { amount: money(floor.survivor) }) : P('floor.survivorNone');
    return P('floor.answer', { amount: money(floor.yearly), between: couple ? P('floor.between') : '', from: P('floor.from.' + from), survivor });
  }
  return words ? { id: 'lines.plain', slots: { words } } : null;
}

/** Whether two floors say the same (the row's is then not said again). */
export const sameFloor = (a, b) => !!a && !!b && JSON.stringify(a) === JSON.stringify(b);
