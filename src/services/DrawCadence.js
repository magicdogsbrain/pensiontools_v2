/**
 * How often you draw (the Monthly Entry's "How often you draw" picker) — a PREFERENCE, not a plan setting (v6 usability
 * audit, decision 4, 17 Oct 2026).
 *
 * Until now the picker wrote `decisionTool.settings.cadence`. That put it inside the Decision settings and so inside
 * the settings checksum: on a locked plan it was refused, and on a plan unlocked once before, changing it relabelled
 * every recorded month "recorded under previous settings". It now lives at `decisionTool.cadence`, outside both
 * settings maps: changeable on a locked plan, never in the checksum, and no recorded month is relabelled by it.
 *
 * Reading: the new field first; a plan saved before this change still carries `settings.cadence`, which is read as a
 * fallback and left exactly as it is (a locked plan's stored settings stay byte-identical). Writing: the new field only.
 *
 * Pure: no storage, no DOM.
 */

export const CADENCES = Object.freeze(['monthly', 'quarterly', 'annual']);
export const DEFAULT_CADENCE = 'monthly';
/** The field the preference is written to (ScenarioRepository.saveActiveDrawCadence). */
export const DRAW_CADENCE_FIELD = 'decisionTool.cadence';

/** A valid cadence, or the default. */
export function normaliseCadence(c) {
  return CADENCES.includes(c) ? c : DEFAULT_CADENCE;
}

/** Months one recommendation covers: 1, 3 or 12. */
export function cadenceMonths(c) {
  return c === 'annual' ? 12 : c === 'quarterly' ? 3 : 1;
}

/**
 * The plan's cadence from its `decisionTool` block: the preference field, else the old settings key, else monthly.
 * @param {object|null|undefined} decisionTool  scenario.decisionTool
 */
export function cadenceOf(decisionTool) {
  const dt = decisionTool && typeof decisionTool === 'object' ? decisionTool : {};
  if (CADENCES.includes(dt.cadence)) return dt.cadence;
  const legacy = dt.settings && typeof dt.settings === 'object' ? dt.settings.cadence : undefined;
  return normaliseCadence(legacy);
}

/** The note under the picker: '' for monthly, else what a batch does. */
export function cadenceNote(c) {
  const n = cadenceMonths(c);
  return n === 1 ? '' : 'Enter this month\'s values; the recommendation covers the next ' + n + ' months and Save records them all.';
}
