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
import { getDefaultStressDB as defaultStressDB, migrateStressSettings } from '../services/PlanReading.js';
import { timingPinPatch } from '../services/PlanTiming.js';
import { budgetAgesKnown } from '../services/BudgetModel.js';
import { DEFAULT_CHARGES_PCT } from '../services/Charges.js';
import { simulationConfigFromSettings } from '../services/SimulationConfig.js';
import { DEFAULT_ISA_GROWTH } from '../services/IsaGrowth.js';
export { scheduleFromSteps, defaultSpYear };
import {
  getActiveStressSettings,
  saveActiveStressSettings,
  invalidateScenarioCache, getActiveBudget, activePlanLocked, storedActiveSettings, getDefaultStressSettings, getActiveScenarioAsync } from './ScenarioRepository.js';
import { potsAsOfFor, withoutPotsAsOf, draftPotsAsOf } from '../services/PlanFromToday.js';
import { laterDraftOf, withLockedStart } from '../services/PlanMove.js';
import { onPlanCopyStale } from './planCopies.js';
import { isPlanLockedError } from '../services/LockedPlanGuard.js';

// In-memory cache
// Cache is valid until explicitly invalidated (login/logout/wipe/scenario switch)
let cachedStressDB = null;
// The one-off write of a plan's derived start (see loadStressDBAsync). Resolved when there is none in flight.
let timingPinWrite = Promise.resolve();
/** Resolves once a pending write of the plan's start has settled (tests; nothing in the app needs to wait). */
export function timingPinSettled() { return timingPinWrite; }

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
 * The plan was unlocked in this tab (PlanLock.unlockPlan): a draft again, so the copy in memory is seen from today when its
 * year 0 is behind it, and no longer from where its lock stood (6.50.0, PlanFromToday.potsAsOfFor). The copy stays, so
 * nothing reading it in the meantime falls back to the defaults.
 */
export function forgetLockedPosition(scenario = null) {
  if (!cachedStressDB || !cachedStressDB.settings) return;
  const plain = withoutPotsAsOf(cachedStressDB.settings);
  const potsAsOf = draftPotsAsOf(plain, new Date(), scenario);   // the plan, for what came before it (6.56.0)
  const settings = potsAsOf ? { ...plain, potsAsOf } : plain;
  if (settings !== cachedStressDB.settings) cachedStressDB = { ...cachedStressDB, settings };
}

/**
 * The copy in memory with where its pots belong said again (6.51.0): a save can move the plan's year 0 — the month work
 * stopped typed, a start year chosen — so a draft saved in its year 0 or before can be one whose year 0 is behind it, seen
 * from today, and the other way. Derived as on load (PlanFromToday.potsAsOfFor), never saved.
 */
async function withPositionAgain(db) {
  const plain = withoutPotsAsOf(db.settings);
  let potsAsOf = null;
  try { potsAsOf = potsAsOfFor(await getActiveScenarioAsync(), plain, new Date()); } catch (e) { /* no plan open */ }
  return { ...db, settings: potsAsOf ? { ...plain, potsAsOf } : plain };
}

/**
 * Loads stress database - returns defaults if not logged in
 * @returns {object} Stress database (from cache or defaults)
 */
export function loadStressDB() {
  // Return cached data if available
  if (cachedStressDB) {
    return cachedStressDB;
  }
  // Return defaults - async load should be used for actual data
  return getDefaultStressDB();
}

/**
 * Loads stress database asynchronously from active scenario
 * @returns {Promise<object>} Stress database
 */
export async function loadStressDBAsync() {
  // Check cache
  if (cachedStressDB) {
    return cachedStressDB;
  }

  if (!isFirebaseAvailable()) {
    console.warn('Firebase not available - returning defaults');
    return getDefaultStressDB();
  }

  try {
    const stressSettings = await getActiveStressSettings();

    if (stressSettings) {
      // "Age today" is maintained on the Budget page; a copy frozen in the Stress settings at the last
      // save goes stale every birthday and shifts the State Pension a plan year. Prefer the newer figure —
      // but only an age a person gave: a Budget nobody has opened carries 45 / 60 placeholders, and folding
      // those in made every plan with no age of its own a 45-year-old's (budgetAgesKnown, 6.13.5).
      let budget = null;
      // As saved, before the Budget's age is folded in below (the timing pin is written onto THIS): the stored copy itself
      // when there is one (6.20.2) — the cached plan object may already carry the Budget's age from an earlier load.
      const stored = (await storedActiveSettings('stress')) || { ...stressSettings };
      try {
        const b = await getActiveBudget();
        if (b && budgetAgesKnown(b) && +b.currentAge > (+stressSettings.currentAge || 0)) { stressSettings.currentAge = +b.currentAge; stressSettings.currentAgeAsOf = b.currentAgeAsOf || stressSettings.currentAgeAsOf || null; }
        budget = b || null;
      } catch (e) { /* no budget yet */ }
      // A locked plan that never saved its year 0 keeps the year it was locked with (7.4.0, PlanMove.withLockedStart;
      // PlanReading the same); the pin below then writes that year, as it wrote the derived one before.
      let open = null;
      try { open = await getActiveScenarioAsync(); } catch (e) { open = null; }
      const db = {
        settings: stressSettings,
        budget,
        lastModified: new Date().toISOString(),
        checksum: null
      };
      cachedStressDB = migrateStressDB(db, open ? (s) => withLockedStart(open, s, new Date()) : null);
      // Where the plan's pots belong (6.50.0, PlanFromToday.potsAsOfFor; PlanReading.effectiveStressSettings the same): on
      // the copy in memory, never on what is saved, and derived again on every load (a copy saved with one decides nothing).
      let plain = withoutPotsAsOf(cachedStressDB.settings);
      let potsAsOf = null;
      // A retired draft saved with a later start than it should have (7.4.0, PlanMove.laterDraftOf; PlanReading the same):
      // read, in memory, from the tax year work stopped or this one. The form shows it so, and its next Save writes it.
      try { const later = open ? laterDraftOf(open, plain, new Date()) : null; if (later) plain = later.settings; } catch (e) { /* read as saved */ }
      try { potsAsOf = open ? potsAsOfFor(open, plain, new Date()) : null; } catch (e) { /* no plan open */ }
      if (potsAsOf || plain !== cachedStressDB.settings) cachedStressDB = { ...cachedStressDB, settings: potsAsOf ? { ...plain, potsAsOf } : plain };
      // 6.13.5: the plan's start is written into the saved plan the first time it is derived, and only then —
      // for drafts AND locked plans (a locked plan cannot be re-saved from its form, so "persisted on the next
      // save" never came and its start moved a year every 6 April). Only the timing fields are added to what is
      // stored (never the Budget's age — that stays the Budget's); the Decision settings, and so a locked plan's
      // checksum, are not touched. Not awaited: a slow connection must not hold up the page; if the write fails
      // the next load tries again.
      const pin = timingPinPatch(stored, cachedStressDB.settings);
      if (pin) {
        timingPinWrite = saveActiveStressSettings({ ...stored, ...pin })
          .catch((e) => { console.warn('Could not save the plan start (will retry on the next load):', e); });
      }
      return cachedStressDB;
    }
  } catch (error) {
    console.error('Error loading stress data:', error);
  }

  // Return defaults if no data
  return getDefaultStressDB();
}

/**
 * Saves the stress database to active scenario
 * @param {object} db - Stress database
 * @returns {Promise<void>}
 */
export async function saveStressDB(db) {
  if (!isFirebaseAvailable()) {
    throw new Error('Must be logged in to save data');
  }

  try {
    db.lastModified = new Date().toISOString();
    db.checksum = generateStressChecksum(db);

    await saveActiveStressSettings(db.settings);

    // Update cache: where the pots belong is said again, as on load (the save may have moved year 0)
    cachedStressDB = await withPositionAgain(db);
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
 * Migrates old database formats to current version — the pure migration (services/PlanReading.js migrateStressSettings),
 * which the preview runs in memory too; this load path alone writes the start pin it derives (loadStressDBAsync).
 * @param {object} db - Database to migrate
 * @returns {object} Migrated database
 */
function migrateStressDB(db, beforePin = null) {
  return migrateStressSettings(db, new Date(), { beforePin });
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
 * Saves stress settings
 * @param {object} settings - Settings to save
 * @returns {Promise<void>}
 */
export async function saveStressSettings(settings) {
  const db = await loadStressDBAsync();
  // The copy in memory changes only once the write has gone through: a refused or failed save leaves it as it was.
  const next = { ...db, settings: { ...db.settings, ...settings } };
  if (!(await activePlanLocked())) { await saveStressDB(next); return; }
  // A locked plan (6.20.2, services/LockedPlanGuard.js): only the change asked for is written, onto the settings as
  // stored — never the defaults and derived fields this loaded copy carries — and ScenarioRepository lets through only
  // a named bookkeeping key. Anything else is refused with PlanLockedError and nothing is written.
  try {
    await saveActiveStressSettings({ ...((await storedActiveSettings('stress')) || getDefaultStressSettings()), ...settings });
  } catch (error) {
    if (error && (error.code === 'plan-newer-than-app' || isPlanLockedError(error))) throw error;
    console.error('Error saving stress data:', error);
    throw new Error('Failed to save stress data');
  }
  next.lastModified = new Date().toISOString();
  next.checksum = generateStressChecksum(next);
  cachedStressDB = await withPositionAgain(next);
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
