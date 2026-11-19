/**
 * Stress Repository
 * Manages persistence of Stress Tester data.
 *
 * Settings are stored per-scenario (via ScenarioRepository).
 *
 * Requires user to be logged in - no local storage fallback.
 */

import { simpleHash } from '../utils/MathUtils.js';
import { isFirebaseConfigured, isLoggedIn } from '../firebase/index.js';
import { deriveIsaMix } from '../services/IsaFunds.js';
import { scheduleFromSteps, defaultSpYear } from '../services/IncomeSchedule.js';
import { getDefaultStressDB as defaultStressDB, effectiveStressSettings } from '../services/PlanReading.js';
import { timingPinPatch } from '../services/PlanTiming.js';
import { settingsWithPatch } from '../services/DraftDecision.js';
import { DEFAULT_CHARGES_PCT } from '../services/Charges.js';
import { simulationConfigFromSettings } from '../services/SimulationConfig.js';
import { DEFAULT_ISA_GROWTH } from '../services/IsaGrowth.js';
export { scheduleFromSteps, defaultSpYear };
import { saveActiveStressSettings, activePlanLocked, storedActiveSettings, getDefaultStressSettings, getActiveScenarioAsync } from './ScenarioRepository.js';
import { todayOf, dayKeyOf } from '../reading/clock.js';
import { PlanReadError } from '../reading/readFault.js';
import { onPlanCopyStale } from './planCopies.js';
import { isPlanLockedError } from '../services/LockedPlanGuard.js';

// The one reading, kept while it is the same plan on the same day (lead4.md D1): keyed by the plan (its id, its last
// change, the very objects its settings sit in, so a save in this tab moves the key) and the day. Dropped by every
// invalidation (login, logout, wipe, a change of plan) as before.
let cachedStressDB = null;   // { key, db }
/**
 * Kept for the tests that waited on the old write of a plan's derived start: opening a plan writes nothing since 7.12.0
 * (loadStressDBAsync), so there is never a write to wait for.
 */
export function timingPinSettled() { return Promise.resolve(); }

/**
 * Default stress database structure — the pure one (services/PlanReading.js), merged UNDER every stored plan on load.
 */
function getDefaultStressDB() { return defaultStressDB(); }

/**
 * Check if Firebase is available
 */
function isFirebaseAvailable() {
  return isFirebaseConfigured() && isLoggedIn();
}

/**
 * Invalidate the cache
 */
export function invalidateStressCache() {
  cachedStressDB = null;
}
// The plan was locked after this tab loaded it (the store refused a write, 6.20.2): this copy goes with the others.
onPlanCopyStale(invalidateStressCache);

/**
 * The plan was unlocked in this tab (PlanLock.unlockPlan): a draft again. The reading is made again from the plan as it
 * now stands (PlanReading.effectiveStressSettings sees it from today), so the copy simply goes.
 */
export function forgetLockedPosition() { invalidateStressCache(); }

/** What the reading is kept against: the plan, the objects its settings sit in, and the day (a pure helper, tested). */
export function stressReadingKeyOf(plan, now) {
  const p = plan || null;
  return {
    id: p && p.id != null ? String(p.id) : '', lastModified: (p && p.lastModified) || '', day: dayKeyOf(now),
    refs: p ? [p, p.stressTool && p.stressTool.settings, p.decisionTool && p.decisionTool.settings, p.budgetTool && p.budgetTool.settings,
      p.accumulationTool && p.accumulationTool.settings, p.planDocument, p.holdings, p.fromAnswer] : []
  };
}
export function sameStressReadingKey(a, b) {
  if (!a || !b || a.id !== b.id || a.lastModified !== b.lastModified || a.day !== b.day || a.refs.length !== b.refs.length) return false;
  return a.refs.every((r, i) => r === b.refs[i]);
}

/**
 * Loads stress database - returns defaults if not logged in
 * @returns {object} Stress database (from cache or defaults)
 */
export function loadStressDB() {
  if (cachedStressDB) return cachedStressDB.db;
  // Return defaults - async load should be used for actual data
  return getDefaultStressDB();
}

/**
 * The open plan's settings as read: PlanReading.effectiveStressSettings(plan, { now }) and nothing else — the same reading
 * the simple view makes, on the one clock (src/reading/clock.js). A plan that cannot be read throws PlanReadError (the
 * plain words both views show), never the stored or factory settings in its place.
 * @returns {Promise<object>} { settings, budget, lastModified, checksum }
 */
export async function loadStressDBAsync() {
  if (!isFirebaseAvailable()) return getDefaultStressDB();
  const now = todayOf();
  let plan = null;
  try { plan = await getActiveScenarioAsync(); } catch (e) { plan = null; }
  let key, settings;
  try {
    key = stressReadingKeyOf(plan, now);
    if (cachedStressDB && sameStressReadingKey(cachedStressDB.key, key)) return cachedStressDB.db;
    settings = effectiveStressSettings(plan, { now });
  } catch (error) { console.error('Error reading the plan:', error); throw new PlanReadError(error); }
  const db = { settings, budget: (plan && plan.budgetTool && plan.budgetTool.settings) || null, lastModified: (plan && plan.lastModified) || null, checksum: null };
  cachedStressDB = { key, db };
  return db;
}

/**
 * Saves the stress database to active scenario: `db.settings` written as given (the caller's whole copy). Only the reset
 * and the tests write a whole copy; every change a person makes goes through saveStressSettings, onto the plan as stored.
 * @param {object} db - Stress database
 * @returns {Promise<void>}
 */
export async function saveStressDB(db) {
  if (!isFirebaseAvailable()) {
    throw new Error('Must be logged in to save data');
  }
  try {
    await saveActiveStressSettings(db.settings);
    invalidateStressCache();   // read again from the plan as it now stands
  } catch (error) {
    if (!isPlanLockedError(error)) console.error('Error saving stress data:', error);   // a refusal is not a fault
    // A plan saved by a newer version of the app (a tab left open across a release), or a locked plan (6.20.2): pass the
    // refusal on as it is, so the screen can say why in plain words instead of a generic failure.
    if (error && (error.code === 'plan-newer-than-app' || isPlanLockedError(error))) throw error;
    throw new Error('Failed to save stress data');
  }
}

/**
 * Generates a checksum for data integrity
 * @param {object} db - Database to checksum
 * @returns {string} Checksum
 */
export function generateStressChecksum(db) {
  return simpleHash(db.settings);
}

/**
 * Gets stress settings
 * @returns {object} Settings
 */
export function getStressSettings() {
  return loadStressDB().settings;
}

/**
 * Gets stress settings asynchronously (for Firebase)
 * @returns {Promise<object>} Settings
 */
export async function getStressSettingsAsync() {
  const db = await loadStressDBAsync();
  return db.settings;
}

/**
 * Saves a change to the open plan's Stress settings: ONLY the keys given, written onto the settings as STORED (lead4.md
 * D1, R3) — never the reading's copy, so no default merged under it, no age folded in from the Budget, no pots worked out
 * at the stop and no position in time is ever stored as if typed. The plan's start read on opening (in memory only) goes
 * with the save for the keys not yet stored (PlanTiming.timingPinPatch), as it always has. A locked plan (6.20.2,
 * services/LockedPlanGuard.js) lets through only a named bookkeeping key; anything else is refused with PlanLockedError
 * and nothing is written. The reading is made again from the plan as saved.
 * @param {object} settings - the keys that changed
 * @returns {Promise<void>}
 */
export async function saveStressSettings(settings) {
  if (!isFirebaseAvailable()) throw new Error('Must be logged in to save data');
  const db = await loadStressDBAsync();
  const locked = await activePlanLocked();
  try {
    // a locked plan with none saved is measured against the defaults (the guard's yardstick); a draft with none adds only its own
    const asStored = (await storedActiveSettings('stress')) || (locked ? getDefaultStressSettings() : {});
    await saveActiveStressSettings(settingsWithPatch(asStored, { ...(timingPinPatch(asStored, db.settings) || {}), ...settings }));   // a key given as undefined is taken out (an Undo of a key that was not there)
  } catch (error) {
    if (error && (error.code === 'plan-newer-than-app' || isPlanLockedError(error))) throw error;
    console.error('Error saving stress data:', error);
    throw new Error('Failed to save stress data');
  } finally {
    invalidateStressCache();
  }
}

/**
 * Updates a single setting
 * @param {string} key - Setting key
 * @param {*} value - Setting value
 * @returns {Promise<void>}
 */
export async function updateStressSetting(key, value) {
  await saveStressSettings({ [key]: value });
}

/**
 * Resets stress settings to defaults in the active scenario
 * @returns {Promise<void>}
 */
export async function resetStressSettings() {
  if (!isFirebaseAvailable()) {
    throw new Error('Must be logged in to reset settings');
  }

  const defaultDB = getDefaultStressDB();
  // A reset plan is a new plan's settings, so it carries the default fund and platform charge (6.19.0) and grows its ISA
  // "Mostly cash" (6.22.0). The screen refuses a reset while the plan is locked (index.html resetStressSettingsUI).
  await saveActiveStressSettings({ ...defaultDB.settings, chargesPct: DEFAULT_CHARGES_PCT, isaGrowth: DEFAULT_ISA_GROWTH });
  invalidateStressCache();
}

/**
 * Creates simulation config from stress settings. The body lives in services/SimulationConfig.js (6.31.0): this is the
 * same function with the settings filled from the cache when none are handed in.
 * @param {object} overrides - Optional overrides
 * @param {object} preloadedSettings - Optional pre-loaded settings (to avoid cache issues)
 * @param {Date} [now] - the day the plan is seen from (today when omitted; see SimulationConfig.js)
 * @returns {object} Simulation config
 */
export function createSimulationConfigFromSettings(overrides = {}, preloadedSettings = null, now = undefined) {
  return simulationConfigFromSettings(overrides, preloadedSettings || getStressSettings(), now);
}


/** Asset mix of the ISA-wrapped tagged holdings (or null): moved to services/IsaFunds.js in the review of 6.22.0; kept here by name. */
export { deriveIsaMix };
