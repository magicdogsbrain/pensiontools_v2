/**
 * "Try a strategy" on Will it last? (7.12.0, lead decision 2; the second walk: its boxes kept another plan's pot, years and
 * ISA after a switch of plan, and kept the figures from before a Settings save). The boxes are filled from the plan open now:
 * again whenever another plan opens, and whenever the plan's own figures change, unless the person has typed a what-if into
 * them since (that is kept until "Reset to my plan", or another plan).
 *
 *   tryFillKeyOf(planId, settings)          what the boxes are filled from, as one key
 *   tryNeedsFill(filledFor, key, touched)   whether to fill them again
 *   watchTryTouched(doc, win)               a box typed into marks the what-if as the person's own (win._tryTouched)
 *   tryPotWordsOf(settings)                 { label, hint } for the pension box: on a plan still saving it holds the
 *                                           pension today (the runs grow it to the stop, as the line above says)
 *   paintTryPotWords(doc, settings)         the label and the one line under the box
 */
import { startsScaled } from './startingPotsWords.js';

const isObj = (v) => !!v && typeof v === 'object' && !Array.isArray(v);

export function tryFillKeyOf(planId, settings) {
  const s = isObj(settings) ? settings : {};
  const p = isObj(s.strategyParams) ? s.strategyParams : {};
  return String(planId || '') + '|' + JSON.stringify([s.equityMin, s.bondMin, s.cashTarget, s.isaBalance, s.baseSalary, s.duration, s.strategyId,
    p.sippTotal, p.isaTotal, !!s.potsNotSet, !!s.incomeNotSet, s.retireAge, isObj(s.potAtRetirement) ? s.potAtRetirement.sipp : null]);
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

export function tryPotWordsOf(settings) {
  const s = isObj(settings) ? settings : {};
  const atStop = isObj(s.potAtRetirement) ? +s.potAtRetirement.sipp || 0 : 0;
  if (!(atStop > 0) || !startsScaled(s)) return { label: TRY_POT_WORDS.pot, hint: '' };
  const age = +s.shapeAgeNow || +s.retireAge || 0;
  return { label: TRY_POT_WORDS.today, hint: TRY_POT_WORDS.hint.replace('{atStop}', '£' + Math.round(atStop).toLocaleString('en-GB')).replace('{age}', String(age)) };
}

export function paintTryPotWords(doc, settings) {
  const box = doc.getElementById('tryPot');
  if (!box) return;
  const w = tryPotWordsOf(settings);
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
  hint.textContent = w.hint;
}
