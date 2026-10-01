/**
 * The saved-plan schema version (6.15.0, V7 plan step 2).
 *
 * Every plan document (`users/{uid}/scenarios/{id}`, and a guest's copy in sessionStorage) carries ONE integer
 * at its ROOT: `schemaVersion`. Absent means 0 — every plan saved before 6.15.0. It sits outside
 * `decisionTool.settings` and `stressTool.settings`, so it never enters `decisionSettingsChecksum` or the
 * Stress drift hash: stamping it cannot orphan a recorded month.
 *
 * A plan moves from its version to SCHEMA_VERSION through the ordered chain in ./migrations.js, on load.
 * To change the shape of a saved plan: bump SCHEMA_VERSION by one and add ONE entry to MIGRATIONS
 * (RELEASING.md, "Saved-plan schema version"). tests/migrations.test.js fails if the two drift apart.
 *
 * The other stamps are NOT schema markers and must not drive a migration: `holdings.version`,
 * `planDocument.version` and `budget.version` are local format marks of those records; ENGINE_VERSION and
 * `appVersion` are provenance.
 *
 * Versions: 1 (6.15.0) the version stamp and the shapes written once; 2 (6.19.0) fund and platform charges written
 * into every unlocked plan (a locked plan is not touched and runs without them until it is unlocked).
 *
 * Pure: no storage, no DOM, no clock.
 */
export const SCHEMA_VERSION = 2;

/** A plan's stored version: a whole number ≥ 0; anything else (absent, a string, garbage) reads as 0. */
export function schemaVersionOf(scenario) {
  const v = scenario && typeof scenario === 'object' ? scenario.schemaVersion : undefined;
  return Number.isInteger(v) && v >= 0 ? v : 0;
}

/**
 * True when the plan was written by a NEWER version of the app than this code (a tab left open across a
 * deploy). Such a plan must not be saved from here: this code would write old-shape settings over it.
 */
export function isNewerSchema(scenario) {
  return schemaVersionOf(scenario) > SCHEMA_VERSION;
}

/** What the shell shows when a save is refused for that reason. */
export const PLAN_NEWER_MESSAGE = 'This plan was updated by a newer version of the app — reload the page.';
/** `error.code` of the refusal, and the name of the window event fired when it is first detected. */
export const PLAN_NEWER_CODE = 'plan-newer-than-app';
export const PLAN_NEWER_EVENT = 'pt:plan-newer-than-app';

/** Thrown by every save path when the stored plan is newer than this code. Nothing was written. */
export class PlanNewerThanAppError extends Error {
  constructor(scenarioId = null) {
    super(PLAN_NEWER_MESSAGE);
    this.name = 'PlanNewerThanAppError';
    this.code = PLAN_NEWER_CODE;
    this.scenarioId = scenarioId;
  }
}
