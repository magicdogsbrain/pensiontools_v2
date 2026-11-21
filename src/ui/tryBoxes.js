/**
 * "Try a strategy" on Will it last? (7.12.0, lead decision 2; the second walk: its boxes kept another plan's pot, years and
 * ISA after a switch of plan, and kept the figures from before a Settings save). The boxes are filled from the plan open now:
 * again whenever another plan opens, and whenever the plan's own figures change, unless the person has typed a what-if into
 * them since (that is kept until "Reset to my plan", or another plan).
 *
 *   tryFillKeyOf(planId, settings, stamp)   what the boxes are filled from, as one key (`stamp`: the plan's lastModified —
 *                                           a month recorded moves where a locked plan's boxes start, not its settings)
 *   tryNeedsFill(filledFor, key, touched)   whether to fill them again
 *   watchTryTouched(doc, win)               a box typed into marks the what-if as the person's own (win._tryTouched)
 *   tryPotWordsOf(settings, atStop)         { label, hint } for the pension box: on a plan still saving it holds the
 *                                           pension today (the runs grow it to the reading's pot at the stop, as the line
 *                                           above says; the hint is HTML with that one figure marked)
 *   paintTryPotWords(doc, settings, atStop) the label and the one line under the box
 */
import { startsScaled } from './startingPotsWords.js';
import { markFact } from '../reading/mark.js';
import { moneyK } from '../reading/format.js';

const isObj = (v) => !!v && typeof v === 'object' && !Array.isArray(v);

export function tryFillKeyOf(planId, settings, stamp = null) {
  const s = isObj(settings) ? settings : {};
  const p = isObj(s.strategyParams) ? s.strategyParams : {};
  return String(planId || '') + '|' + JSON.stringify([s.equityMin, s.bondMin, s.cashTarget, s.isaBalance, s.baseSalary, s.duration, s.strategyId,
    p.sippTotal, p.isaTotal, !!s.potsNotSet, !!s.incomeNotSet, s.retireAge, isObj(s.potAtRetirement) ? s.potAtRetirement.sipp : null, s.diversifierStart, stamp == null ? null : String(stamp)]);
}

export function tryNeedsFill(filledFor, key, touched) {
  if (!filledFor) return true;
  if (filledFor.split('|')[0] !== String(key).split('|')[0]) return true;   // another plan: never its what-if
  return !touched && filledFor !== key;
}

export function watchTryTouched(doc, win) {
  const card = doc.getElementById('tryPot') && doc.getElementById('tryPot').closest('.card');
  if (!card) return;
  const mark = (e) => { if (e.isTrusted !== false && e.target && /^(INPUT|SELECT)$/.test(e.target.tagName)) win._tryTouched = true; };
  card.addEventListener('input', mark, true);
  card.addEventListener('change', mark, true);
}

/**
 * The what-if's pension box (the second walk: on a plan still saving it said "SIPP / pension pot" and showed £120,000 right
 * under a line saying the runs start from £142,720). The box holds the pension today: trySettingsOf scales today's pots and
 * the runs grow them to the stop, so a figure typed here is tried as the pension today. Said so, with the pension when work
 * stops beside it; a retired plan's box is as it was.
 */
export const TRY_POT_WORDS = Object.freeze({
  pot: 'SIPP / pension pot (£)',
  today: 'Your pension today (£)',
  hint: 'The runs grow it to {atStop} by {age}, the pension when you stop in the line above. A figure typed here is tried as your pension today.'
});

/**
 * `atStop` the reading's pot at the stop (src/reading/atStop.js potAtStop, step F1): said to £1,000 and marked, as every other
 * place says it — never the settings' own figure to the pound. Null (not saving, or not read yet): the box's plain label.
 */
export function tryPotWordsOf(settings, atStop = null) {
  const s = isObj(settings) ? settings : {};
  const at = isObj(atStop) && +atStop.middle > 0 ? atStop : null;
  if (!at || !startsScaled(s)) return { label: TRY_POT_WORDS.pot, hint: '' };
  const age = Number.isFinite(+at.age) && +at.age > 0 ? +at.age : (+s.shapeAgeNow || +s.retireAge || 0);
  return { label: TRY_POT_WORDS.today, hint: TRY_POT_WORDS.hint.replace('{atStop}', markFact('pot.atStop', moneyK(at.middle))).replace('{age}', String(age)) };
}

export function paintTryPotWords(doc, settings, atStop = null) {
  const box = doc.getElementById('tryPot');
  if (!box) return;
  const w = tryPotWordsOf(settings, atStop);
  const label = doc.getElementById('tryPotLabel');
  if (label) label.textContent = w.label;
  let hint = doc.getElementById('tryPotHint');
  if (!hint) {
    hint = doc.createElement('span');
    hint.id = 'tryPotHint';
    hint.className = 'hint';
    hint.style.cssText = 'display:block; font-size:12px; margin-top:4px;';
    // after the box's own wrapper (the page's number overlay sits in it, placed over the box), never inside it
    const holder = (box.closest && box.closest('.form-group')) || box.parentElement;
    holder.appendChild(hint);
  }
  hint.innerHTML = w.hint;   // the words are ours; the one figure is the formatter's, marked
}
