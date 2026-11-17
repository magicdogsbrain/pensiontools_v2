/**
 * "Try a strategy" on Will it last? (7.12.0, lead decision 2; the second walk: its boxes kept another plan's pot, years and
 * ISA after a switch of plan, and kept the figures from before a Settings save). The boxes are filled from the plan open now:
 * again whenever another plan opens, and whenever the plan's own figures change, unless the person has typed a what-if into
 * them since (that is kept until "Reset to my plan", or another plan).
 *
 *   tryFillKeyOf(planId, settings)          what the boxes are filled from, as one key
 *   tryNeedsFill(filledFor, key, touched)   whether to fill them again
 *   watchTryTouched(doc, win)               a box typed into marks the what-if as the person's own (win._tryTouched)
 */
const isObj = (v) => !!v && typeof v === 'object' && !Array.isArray(v);

export function tryFillKeyOf(planId, settings) {
  const s = isObj(settings) ? settings : {};
  const p = isObj(s.strategyParams) ? s.strategyParams : {};
  return String(planId || '') + '|' + JSON.stringify([s.equityMin, s.bondMin, s.cashTarget, s.isaBalance, s.baseSalary, s.duration, s.strategyId,
    p.sippTotal, p.isaTotal, !!s.potsNotSet, !!s.incomeNotSet]);
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
