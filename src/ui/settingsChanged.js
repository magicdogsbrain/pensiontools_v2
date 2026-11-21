/**
 * What a full-view Save writes (lead4.md D1, R3; until the field table writes each box itself): only the keys whose box the
 * person changed since the loader filled the form. The form as filled is the baseline (`stressFormBase` in the page's
 * plan state); the form as it stands is compared key by key. Never the defaults merged under a plan, a folded age or pots
 * worked out at the stop. Pure.
 *
 *   changedSettingsPatch(base, form)        the keys of `form` whose value differs from `base` (all of them with no base)
 *   stressSavePatch({ base, form, hadFigures })   what the Save writes: the changed keys; on a plan that had no figures, its
 *                                           pots and income as shown (an empty box is none) with the first change; and
 *                                           `configured` with any change. {} when nothing changed, and {} with NO
 *                                           baseline: a form not yet filled from the plan (the page opening it, or a
 *                                           fill that failed) shows nothing of the plan, so nothing of it is written
 *   touches(patch, keys)                    does the patch change any of `keys`?
 *   settingsFromForm(o)                     the Settings form as the plan's settings keys (a key with no value left out)
 */
const same = (a, b) => JSON.stringify(a === undefined ? null : a) === JSON.stringify(b === undefined ? null : b);

export function changedSettingsPatch(base, form) {
  const out = {};
  for (const [k, v] of Object.entries(form || {})) if (!base || !same(base[k], v)) out[k] = v;
  return out;
}

/** The pots a plan shows in its Settings boxes, and the income: written as shown with a plan's first figures. */
export const POT_KEYS = Object.freeze(['equityMin', 'bondMin', 'cashTarget', 'diversifierStart']);
export const INCOME_KEYS = Object.freeze(['baseSalary', 'incomeShape', 'incomeSteps', 'targetSchedule']);
export const TIMING_KEYS = Object.freeze(['shapeAgeNow', 'currentAge', 'currentAgeAsOf', 'retired', 'retireAge', 'firstTaxYear', 'stoppedWork']);
export const STRATEGY_KEYS = Object.freeze(['strategyId', 'strategyParams', 'strategyState']);

export function stressSavePatch({ base = null, form = {}, hadFigures = true } = {}) {
  if (!base) return {};   // never the whole form (its defaults and worked figures) for want of a baseline
  const patch = changedSettingsPatch(base, form);
  if (!Object.keys(patch).length) return {};
  if (!hadFigures) for (const k of [...POT_KEYS, ...INCOME_KEYS]) if (k in form) patch[k] = form[k];
  patch.configured = true;
  return patch;
}

export const touches = (patch, keys) => keys.some((k) => Object.prototype.hasOwnProperty.call(patch || {}, k));

export function settingsFromForm(o) {
  const out = {};
  for (const [k, v] of Object.entries(o || {})) if (v !== undefined) out[k] = v;
  return out;
}
