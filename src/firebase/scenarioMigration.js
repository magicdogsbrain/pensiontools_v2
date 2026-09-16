/**
 * Scenario Migration / Normalisation
 *
 * Repairs two historical data problems in stored scenario documents:
 *
 * 1. Phantom dot-notation fields. `saveScenario` previously wrote nested updates
 *    with `setDoc(..., { merge: true })` using dotted keys (e.g.
 *    'decisionTool.settings'). Firestore only treats dotted keys as nested paths
 *    with `updateDoc` — with `setDoc` merge they became LITERAL top-level fields
 *    named "decisionTool.settings". The user's real edits ended up there and were
 *    never read back. These phantom fields hold the most recent (correct) data.
 *
 * 2. Legacy schema. Scenarios created before the planDetails/decisionTool/stressTool
 *    restructure stored decisionSettings/stressSettings/name/description/taxYears at
 *    the top level.
 *
 * `normalizeScenario` folds both back into the canonical nested shape, giving
 * phantom fields (latest edits) priority over the creation-time nested defaults.
 *
 * Every OTHER root key travels untouched (6.13.0): strategy, planDocument and its archive,
 * journey, transition, holdings, accumulationTool, budgetTool, household, id, createdAt,
 * lastModified — and the parts of decisionTool/stressTool outside settings/history/taxYears
 * (planOfRecord and its archive). The previous fixed-key rebuild threw all of those away, and
 * the follow-up `setDoc` (no merge) made the loss permanent.
 */

/** The pre-restructure top-level fields; they are folded in and then dropped. */
const LEGACY_KEYS = ['decisionSettings', 'stressSettings', 'name', 'description', 'taxYears'];

const isObj = (v) => v && typeof v === 'object' && !Array.isArray(v);

/** Set `value` at a dotted path, cloning each map on the way so the raw document is never mutated. */
function setPath(obj, path, value) {
  const parts = path.split('.');
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const k = parts[i];
    cur[k] = isObj(cur[k]) ? { ...cur[k] } : {};
    cur = cur[k];
  }
  cur[parts[parts.length - 1]] = value;
}

/**
 * Normalise a raw scenario document into the canonical nested shape.
 *
 * @param {object} raw - Raw Firestore document data (may include `id`)
 * @returns {{ scenario: object, migrated: boolean }} normalised scenario and
 *   whether any phantom/legacy fields were found (i.e. it should be rewritten)
 */
export function normalizeScenario(raw) {
  if (!raw || typeof raw !== 'object') {
    return { scenario: raw, migrated: false };
  }

  const dottedKeys = Object.keys(raw).filter((k) => k.includes('.'));
  const hasLegacy = LEGACY_KEYS.some((k) => k in raw);

  const migrated = dottedKeys.length > 0 || hasLegacy;
  if (!migrated) {
    return { scenario: raw, migrated: false };
  }

  // 1. Every ordinary root key as it stands (nested = creation-time values).
  const clean = {};
  for (const [k, v] of Object.entries(raw)) if (!k.includes('.') && !LEGACY_KEYS.includes(k)) clean[k] = v;
  // 2. Phantom dotted fields are the LATEST edits: fold each onto its path, winning over the nested value.
  for (const k of dottedKeys) setPath(clean, k, raw[k]);
  // 3. Legacy top-level fields fill only what is still missing, and the canonical shape is guaranteed.
  clean.isActive = clean.isActive ?? false;
  clean.enabledTools = clean.enabledTools || ['stress', 'decision'];
  const pd = isObj(clean.planDetails) ? clean.planDetails : {};
  clean.planDetails = { ...pd, name: pd.name ?? raw.name ?? 'My Plan', description: pd.description ?? raw.description ?? '' };
  const dt = isObj(clean.decisionTool) ? clean.decisionTool : {};
  clean.decisionTool = { ...dt, settings: dt.settings ?? raw.decisionSettings ?? {}, history: dt.history ?? [], taxYears: dt.taxYears ?? raw.taxYears ?? {} };
  const st = isObj(clean.stressTool) ? clean.stressTool : {};
  clean.stressTool = { ...st, settings: st.settings ?? raw.stressSettings ?? {} };

  return { scenario: clean, migrated: true };
}
