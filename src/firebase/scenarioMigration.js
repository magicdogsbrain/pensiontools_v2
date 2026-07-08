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
 */

/** First defined value among the candidates (in priority order). */
function pick(...vals) {
  return vals.find((v) => v !== undefined);
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
  const hasLegacy =
    'decisionSettings' in raw ||
    'stressSettings' in raw ||
    'name' in raw ||
    'description' in raw ||
    'taxYears' in raw;

  const migrated = dottedKeys.length > 0 || hasLegacy;
  if (!migrated) {
    return { scenario: raw, migrated: false };
  }

  const nestedDecision = raw.decisionTool || {};
  const nestedStress = raw.stressTool || {};
  const nestedPlan = raw.planDetails || {};

  const clean = {
    isActive: raw.isActive ?? false,
    enabledTools: raw.enabledTools || ['stress', 'decision'],
    planDetails: {
      // priority: phantom (latest) > nested (creation) > legacy top-level
      name: pick(raw['planDetails.name'], nestedPlan.name, raw.name) ?? 'My Plan',
      description:
        pick(raw['planDetails.description'], nestedPlan.description, raw.description) ?? ''
    },
    decisionTool: {
      settings:
        pick(raw['decisionTool.settings'], nestedDecision.settings, raw.decisionSettings) ?? {},
      history: pick(raw['decisionTool.history'], nestedDecision.history) ?? [],
      taxYears:
        pick(raw['decisionTool.taxYears'], nestedDecision.taxYears, raw.taxYears) ?? {}
    },
    stressTool: {
      settings: pick(raw['stressTool.settings'], nestedStress.settings, raw.stressSettings) ?? {}
    }
  };

  if (raw.id !== undefined) clean.id = raw.id;
  if (raw.createdAt !== undefined) clean.createdAt = raw.createdAt;
  if (raw.lastModified !== undefined) clean.lastModified = raw.lastModified;

  return { scenario: clean, migrated: true };
}
