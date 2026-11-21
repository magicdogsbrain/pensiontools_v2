/**
 * Decision Repository
 * Manages persistence of Decision Tool data.
 *
 * All data (settings, history, tax years) is stored per-scenario via ScenarioRepository.
 *
 * Requires user to be logged in - no local storage fallback.
 */

import { spendingSmileFactor } from '../services/SpendingModel.js';
import { DRAWDOWN_DEFAULTS, TAX_DEFAULTS } from '../constants.js';
import { DECISION_ASSUMED_CPI } from '../services/InflationModel.js';
import { simpleHash } from '../utils/MathUtils.js';
import { decisionSettingsChecksum } from '../services/PlanCommit.js';
import { isFirebaseConfigured, isLoggedIn } from '../firebase/index.js';
import {
  getActiveDecisionSettings,
  saveActiveDecisionSettings,
  getActiveTaxYears,
  saveActiveTaxYears,
  getActiveHistory,
  saveActiveHistory,
  invalidateScenarioCache,
  activePlanLocked,
  storedActiveSettings,
  assertActiveSettingsWritable,
  getActiveScenarioAsync
} from './ScenarioRepository.js';
import { decisionSettingsAsRead, planLocked, settingsWithPatch } from '../services/DraftDecision.js';
import { todayOf } from '../reading/clock.js';
import { onPlanCopyStale } from './planCopies.js';
import { defaultTaxYearConfig } from '../models/TaxYear.js';
import { PlanLockedError, isPlanLockedError, lockedWriteRefusal, lockedSettingsToWrite } from '../services/LockedPlanGuard.js';

// In-memory cache for the combined decision DB (all from active scenario)
// Cache is valid until explicitly invalidated (login/logout/wipe/scenario switch)
let cachedDecisionDB = null;
// What an unlocked plan's settings were read from (7.12.0): when any of these changes (a Stress save, a new pot today), the
// settings are read again, so the Decision tool never runs on figures the plan no longer holds.
let cachedFrom = null;
const sourcesOf = (sc) => (sc ? [sc, sc.stressTool && sc.stressTool.settings, sc.accumulationTool && sc.accumulationTool.settings, sc.accumulationTool && sc.accumulationTool.history, sc.holdings, sc.budgetTool && sc.budgetTool.settings] : []);
const sameSources = (a, b) => !!a && !!b && a.length === b.length && a.every((x, i) => x === b[i]);

/**
 * The Decision settings as read (services/DraftDecision.js): a locked plan's stored copy; an unlocked plan's worked from its
 * Stress settings, never the defaults a draft used to carry. Nothing is written.
 */
function settingsAsRead(scenario, stored) {
  if (!scenario) return stored || getDefaultDecisionDB().settings;
  return decisionSettingsAsRead(scenario, { now: todayOf() });   // the one clock (lead4.md R5)
}

/**
 * Default decision database structure
 */
function getDefaultDecisionDB() {
  return {
    settings: {
      equityMin: DRAWDOWN_DEFAULTS.EQUITY_MIN,
      bondMin: DRAWDOWN_DEFAULTS.BOND_MIN,
      cashTarget: DRAWDOWN_DEFAULTS.CASH_TARGET,
      duration: DRAWDOWN_DEFAULTS.DURATION_YEARS,
      // Rising-equity glidepath ("bond tent") for the Decision plan (opt-in). When on,
      // calcDecisionWithDeps derives equityGlide from the risk split so the monthly draw/rebalance
      // advice follows the glide.
      equityGlideEnabled: false,
      // Plan lock: set true the first time these settings are saved. A locked plan's Decision settings
      // can't be edited — the user creates a new plan to use different settings. See refreshDecisionLock.
      locked: false,
      baseSalary: DRAWDOWN_DEFAULTS.BASE_SALARY,
      // Spending over retirement, locked with the plan: 'flat' (level real spend, default) or
      // 'declining' (real spend drifts down ~1%/yr — Blanchett's spending smile). Mirrors the Stress
      // tester so the Decision tool / April wizard adjust the target salary the same way: the yearly
      // inflation uplift is netted by the ~1% decline (e.g. CPI 2.5% − 1% = 1.5% nominal rise).
      spendingProfile: 'flat',
      protectionFactor: DRAWDOWN_DEFAULTS.PROTECTION_FACTOR,
      recoveryBuffer: DRAWDOWN_DEFAULTS.RECOVERY_BUFFER,
      consecutiveLimit: DRAWDOWN_DEFAULTS.CONSECUTIVE_LIMIT,
      startDate: null,
      // State Pension - from HMRC forecast
      spStartDate: null,        // Date when SP starts (e.g., "6 May 2040")
      spWeeklyAmount: 0,        // Weekly SP amount from HMRC forecast
      // Legacy fields (deprecated, kept for migration)
      statePension: 0,
      statePensionYear: 0
    },
    taxYears: {
      // Default tax year with full schema
    },
    history: [],
    lastModified: null,
    checksum: null
  };
}

/**
 * Check if Firebase is available
 */
function isFirebaseAvailable() {
  return isFirebaseConfigured() && isLoggedIn();
}

/**
 * Invalidate the cache
 */
export function invalidateCache() {
  cachedDecisionDB = null;
  cachedFrom = null;
}
// The plan was locked after this tab loaded it (the store refused a write, 6.20.2): this copy goes with the others.
onPlanCopyStale(invalidateCache);

/**
 * Loads decision database - returns defaults if not logged in
 * @returns {object} Decision database (from cache or defaults)
 */
export function loadDecisionDB() {
  // Return cached data if available
  if (cachedDecisionDB) {
    return cachedDecisionDB;
  }
  // Return defaults - async load should be used for actual data
  return getDefaultDecisionDB();
}

/**
 * Loads decision database asynchronously
 * All data comes from the active scenario
 * @returns {Promise<object>} Decision database
 */
export async function loadDecisionDBAsync() {
  // Check cache: an unlocked plan's settings follow its Stress settings, so they are read again when those have changed
  if (cachedDecisionDB) {
    if (cachedFrom && isFirebaseAvailable()) {
      const was = cachedDecisionDB;
      const sc = await getActiveScenarioAsync().catch(() => null);
      // The copy was dropped (a write's repaint) or replaced while the plan was read: read again from the start, never
      // refresh a copy that is no longer the one held (a half copy, the settings alone, failed every later save).
      if (cachedDecisionDB !== was) return loadDecisionDBAsync();
      if (sc && !planLocked(sc) && !sameSources(cachedFrom, sourcesOf(sc))) {
        cachedDecisionDB = { ...cachedDecisionDB, settings: settingsAsRead(sc, sc.decisionTool && sc.decisionTool.settings) };
        cachedDecisionDB.checksum = generateDecisionChecksum(cachedDecisionDB);
        cachedFrom = sourcesOf(sc);
      }
    }
    return cachedDecisionDB;
  }

  if (!isFirebaseAvailable()) {
    console.warn('Firebase not available - returning defaults');
    return getDefaultDecisionDB();
  }

  try {
    // Load all data from the active scenario in parallel
    const [decisionSettings, taxYears, history, scenario] = await Promise.all([
      getActiveDecisionSettings(),
      getActiveTaxYears(),
      getActiveHistory(),
      getActiveScenarioAsync()
    ]);

    // an unlocked plan's settings are its Stress settings' (DraftDecision.js); a locked plan's, as stored
    const settingsIn = settingsAsRead(scenario, decisionSettings);
    // The "Declining with age" spending profile is gone (v6.2.1): the taper now lives on the income
    // steps and arrives here baked into targetSchedule. A Decision copy still carrying the flag gets
    // its saved schedule multiplied by the old smile once, so the tax-year wizard's suggestions and
    // the drawdown projection do not change.
    if (settingsIn.spendingProfile === 'declining') {
      if (Array.isArray(settingsIn.targetSchedule) && settingsIn.targetSchedule.length) settingsIn.targetSchedule = settingsIn.targetSchedule.map((v, y) => Math.round((+v || 0) * spendingSmileFactor(y, 'declining')));
      settingsIn.spendingProfile = 'flat';
      settingsIn.spendingMigratedFrom = 'declining';
    }
    const db = {
      settings: settingsIn,
      taxYears: taxYears || {},
      history: history || [],
      lastModified: new Date().toISOString(),
      checksum: null
    };
    db.checksum = generateDecisionChecksum(db);
    cachedDecisionDB = db;
    cachedFrom = scenario && !planLocked(scenario) ? sourcesOf(scenario) : null;
    return db;
  } catch (error) {
    console.error('Error loading decision data:', error);
  }

  // Return defaults if no data
  return getDefaultDecisionDB();
}

/**
 * Saves the decision database
 * Settings and taxYears saved to active scenario
 * @param {object} db - Decision database
 * @returns {Promise<void>}
 */
export async function saveDecisionDB(db) {
  return writeDecisionDB(db, null);
}

/**
 * The one write of the Decision copy. `patch` is the settings change asked for (null for a tax year's save, which changes
 * no setting). A locked plan (6.20.2): the settings ride along as stored, with only the named bookkeeping changes taken from
 * the copy in memory (services/LockedPlanGuard.js) — a settings change itself is refused earlier, by saveDecisionSettings.
 * An unlocked plan: its settings are READ from its Stress settings (DraftDecision.js), so the copy in memory is a reading,
 * never written; the plan stores its settings as stored with `patch` on top (settingsWithPatch), and nothing at all when
 * there is no patch and none stored.
 */
async function writeDecisionDB(db, patch) {
  if (!isFirebaseAvailable()) {
    throw new Error('Must be logged in to save data');
  }

  try {
    const locked = await activePlanLocked();
    let settings;
    if (locked) {
      const asked = patch ? { ...db.settings, ...patch } : db.settings;
      const w = lockedSettingsToWrite('decision', await storedActiveSettings('decision'), asked);
      if (w.dropped.length) console.warn('Locked plan: settings changed in memory were not saved:', w.dropped);
      settings = w.settings;
      db = { ...db, settings: asked };
    } else {
      const stored = await storedActiveSettings('decision');
      settings = patch ? settingsWithPatch(stored, patch) : stored;
    }

    // Save settings, then taxYears, to the active scenario. One after the other (6.20.2): when the store refuses the
    // settings — the plan was locked on another device after this tab loaded it — this tab's tax years, as old as its
    // settings, are not written over the ones that device saved.
    if (settings !== undefined) await saveActiveDecisionSettings(settings);
    await saveActiveTaxYears(db.taxYears);

    // The copy in memory: a locked plan's as written; an unlocked plan's read again from the plan as it now stands.
    if (!locked) {
      const sc = await getActiveScenarioAsync().catch(() => null);
      db = { ...db, settings: settingsAsRead(sc, settings) };
      cachedFrom = sc ? sourcesOf(sc) : null;
    }
    db.lastModified = new Date().toISOString();
    db.checksum = generateDecisionChecksum(db);
    cachedDecisionDB = db;
  } catch (error) {
    if (!isPlanLockedError(error)) console.error('Error saving decision data:', error);   // a refusal is not a fault
    // A plan saved by a newer version of the app (a tab left open across a release), or a locked plan (6.20.2): pass
    // the refusal on as it is, so the screen can say why in plain words instead of a generic failure.
    if (error && (error.code === 'plan-newer-than-app' || isPlanLockedError(error))) throw error;
    throw new Error('Failed to save decision data');
  }
}

/**
 * Generates a checksum for data integrity
 * @param {object} db - Database to checksum
 * @returns {string} Checksum
 */
export function generateDecisionChecksum(db) {
  const data = {
    settings: db.settings,
    taxYears: db.taxYears,
    historyCount: db.history.length,
    lastHistoryDate: db.history.length > 0 ? db.history[db.history.length - 1].date : null
  };
  return simpleHash(data);
}

/**
 * Checksum of the PLAN-DEFINING decision settings only — the allocation, income, spending profile,
 * State Pension, protection and glidepath inputs a decision is computed against. Volatile/bookkeeping
 * fields that don't change the plan (the `locked` flag, timestamps) are excluded so toggling the lock
 * never changes the checksum. Stamped onto each saved decision (history.settingsChecksum) so we can
 * tell whether a decision still matches the current settings, and gate the settings unlock on it.
 *
 * @param {object} settings - Decision settings
 * @returns {string} Stable checksum
 */
// The Decision settings' checksum lives in services/PlanCommit.js since 6.38.0 (the plan of record is built in the preview
// too); its name is kept here, unchanged, for everything that imports it from the repository.
export { decisionSettingsChecksum };

/**
 * Gets settings from the database (sync - uses cache)
 * @returns {object} Settings
 */
export function getDecisionSettings() {
  return loadDecisionDB().settings;
}

/**
 * Gets settings asynchronously (for Firebase)
 * @returns {Promise<object>} Settings
 */
export async function getDecisionSettingsAsync() {
  const db = await loadDecisionDBAsync();
  return db.settings;
}

/**
 * Saves settings to the database
 * @param {object} settings - Settings to save
 * @returns {Promise<void>}
 */
export async function saveDecisionSettings(settings) {
  const db = await loadDecisionDBAsync();
  // A locked plan (6.20.2): the change asked for may only be the unlock (services/LockedPlanGuard.js). Anything else is
  // refused here, before a byte is written or the copy in memory is touched. (How often you draw is no longer a setting:
  // ScenarioRepository.saveActiveDrawCadence writes decisionTool.cadence, outside this map and its checksum.)
  if (await activePlanLocked()) {
    const stored = await storedActiveSettings('decision');
    const keys = lockedWriteRefusal('decision', { locked: true, stored, next: { ...stored, ...settings } });
    if (keys) throw new PlanLockedError(keys);
  }
  // Only the keys given are stored, on the settings as stored (writeDecisionDB); the copy in memory changes once the write has gone through.
  await writeDecisionDB(db, settings);
}

// A tax year's defaults live in models/TaxYear.js since 7.2.0 (the new app's Month by month sets a year up with them too).
const getDefaultTaxYearConfig = defaultTaxYearConfig;

/**
 * Gets tax year configuration (sync - uses cache, may return stale data)
 * @param {string} taxYear - Tax year in 'YY/YY' format
 * @returns {object} Tax year configuration
 */
export function getTaxYearConfig(taxYear) {
  const db = loadDecisionDB();
  const config = db.taxYears[taxYear];

  if (!config) {
    return getDefaultTaxYearConfig();
  }

  return config;
}

/**
 * Gets tax year configuration asynchronously (ensures fresh data from Firebase)
 * @param {string} taxYear - Tax year in 'YY/YY' format
 * @returns {Promise<object>} Tax year configuration
 */
export async function getTaxYearConfigAsync(taxYear) {
  const db = await loadDecisionDBAsync();
  const config = db.taxYears[taxYear];

  if (!config) {
    return getDefaultTaxYearConfig();
  }

  return config;
}

/**
 * Saves tax year configuration
 * @param {string} taxYear - Tax year in 'YY/YY' format
 * @param {object} config - Tax year configuration
 * @returns {Promise<void>}
 */
export async function saveTaxYearConfig(taxYear, config) {
  console.log(`saveTaxYearConfig: Saving tax year ${taxYear}`, config);
  const db = await loadDecisionDBAsync();
  db.taxYears[taxYear] = { ...getTaxYearConfig(taxYear), ...config };
  await saveDecisionDB(db);
  console.log(`saveTaxYearConfig: Saved tax year ${taxYear}, yearSetupComplete=${db.taxYears[taxYear].yearSetupComplete}`);
}

/**
 * Updates ISA/Savings usage for a tax year by adding an amount
 * @param {string} taxYear - Tax year in 'YY/YY' format
 * @param {number} amountUsed - Amount of ISA/Savings used this month
 * @returns {Promise<void>}
 */
export async function updateIsaSavingsUsed(taxYear, amountUsed) {
  const db = await loadDecisionDBAsync();
  const config = db.taxYears[taxYear] || getDefaultTaxYearConfig();
  config.isaSavingsUsed = (config.isaSavingsUsed || 0) + amountUsed;
  db.taxYears[taxYear] = config;
  await saveDecisionDB(db);
}

/**
 * Recalculates ISA/Savings usage for a tax year from history records
 * This ensures the cumulative value is always accurate
 * Uses local cache which is already updated after addHistoryRecord
 * @param {string} taxYear - Tax year in 'YY/YY' format
 * @returns {Promise<number>} The recalculated total
 */
export async function recalculateIsaSavingsUsed(taxYear) {
  // Use cached DB which has been updated by addHistoryRecord
  // If no cache, load from Firebase
  const db = cachedDecisionDB || await loadDecisionDBAsync();
  const history = (db.history || []).filter(h => h.taxYear === taxYear);

  // Sum up all ISA draws from history for this tax year
  // Note: History records store ISA as 'isa' (see decisionToHistory in Decision.js)
  const totalUsed = history.reduce((sum, record) => {
    return sum + (record.isa || 0);
  }, 0);

  console.log(`recalculateIsaSavingsUsed: Tax year ${taxYear}, found ${history.length} records, total ISA used: ${totalUsed}`);
  console.log(`recalculateIsaSavingsUsed: History records:`, history.map(h => ({ date: h.date, isa: h.isa })));

  // Get existing config or create default - must preserve existing settings
  if (!db.taxYears[taxYear]) {
    console.log(`recalculateIsaSavingsUsed: No existing config for ${taxYear}, creating default`);
    db.taxYears[taxYear] = getDefaultTaxYearConfig();
  }

  // Update only the isaSavingsUsed field
  console.log(`recalculateIsaSavingsUsed: Before update, isaSavingsUsed=${db.taxYears[taxYear].isaSavingsUsed}`);
  db.taxYears[taxYear].isaSavingsUsed = totalUsed;
  console.log(`recalculateIsaSavingsUsed: After update, isaSavingsUsed=${db.taxYears[taxYear].isaSavingsUsed}`);

  // Save and update cache
  await saveDecisionDB(db);
  console.log(`recalculateIsaSavingsUsed: Saved to Firebase`);

  return totalUsed;
}

/**
 * Marks a tax year setup as complete
 * @param {string} taxYear - Tax year in 'YY/YY' format
 * @returns {Promise<void>}
 */
export async function markYearSetupComplete(taxYear) {
  const db = await loadDecisionDBAsync();
  const config = db.taxYears[taxYear] || getDefaultTaxYearConfig();
  config.yearSetupComplete = true;
  db.taxYears[taxYear] = config;
  await saveDecisionDB(db);
}

/**
 * Checks if a tax year setup is complete
 * @param {string} taxYear - Tax year in 'YY/YY' format
 * @returns {Promise<boolean>}
 */
export async function isYearSetupComplete(taxYear) {
  const config = await getTaxYearConfigAsync(taxYear);
  const isComplete = config.yearSetupComplete === true;
  console.log(`isYearSetupComplete: Tax year ${taxYear}, yearSetupComplete=${config.yearSetupComplete}, result=${isComplete}`);
  return isComplete;
}

/**
 * Resets a tax year setup (allows re-running wizard)
 * @param {string} taxYear - Tax year in 'YY/YY' format
 * @returns {Promise<void>}
 */
export async function resetYearSetup(taxYear) {
  const db = await loadDecisionDBAsync();
  const config = db.taxYears[taxYear] || getDefaultTaxYearConfig();
  config.yearSetupComplete = false;
  config.isaSavingsUsed = 0;
  db.taxYears[taxYear] = config;
  await saveDecisionDB(db);
}

/**
 * Gets all tax years
 * @returns {object} All tax year configurations
 */
export function getAllTaxYears() {
  return loadDecisionDB().taxYears;
}

/**
 * Gets all tax years asynchronously (ensures fresh data from Firebase)
 * @returns {Promise<object>} All tax year configurations
 */
export async function getAllTaxYearsAsync() {
  const db = await loadDecisionDBAsync();
  return db.taxYears;
}

/**
 * Gets history records
 * @param {object} options - Filter options
 * @returns {object[]} History records
 */
export function getHistory(options = {}) {
  const db = loadDecisionDB();
  let history = [...db.history];

  // Filter by tax year if specified
  if (options.taxYear) {
    history = history.filter(h => h.taxYear === options.taxYear);
  }

  // Filter by date range
  if (options.startDate) {
    history = history.filter(h => h.date >= options.startDate);
  }
  if (options.endDate) {
    history = history.filter(h => h.date <= options.endDate);
  }

  // Sort
  if (options.sortDesc) {
    history.sort((a, b) => b.date.localeCompare(a.date));
  } else {
    history.sort((a, b) => a.date.localeCompare(b.date));
  }

  // Limit
  if (options.limit) {
    history = history.slice(0, options.limit);
  }

  return history;
}

/**
 * Gets history records asynchronously
 * @param {object} options - Filter options
 * @returns {Promise<object[]>} History records
 */
export async function getHistoryAsync(options = {}) {
  // Ensure cache is loaded from scenario
  await loadDecisionDBAsync();
  return getHistory(options);
}

/**
 * Adds a history record
 * @param {object} record - History record to add
 * @returns {Promise<void>}
 */
export async function addHistoryRecord(record) {
  if (!isFirebaseAvailable()) {
    throw new Error('Must be logged in to save history');
  }

  // Ensure cache is loaded
  const db = await loadDecisionDBAsync();

  // Update cache first
  const existingIndex = db.history.findIndex(h => h.date === record.date);
  if (existingIndex >= 0) {
    db.history[existingIndex] = record;
  } else {
    db.history.push(record);
  }
  db.history.sort((a, b) => a.date.localeCompare(b.date));

  // Save the full history array to the scenario
  await saveActiveHistory(db.history);
}

/**
 * Deletes a history record
 * @param {string} date - Date of record to delete
 * @returns {Promise<void>}
 */
export async function deleteHistoryRecord(date) {
  if (!isFirebaseAvailable()) {
    throw new Error('Must be logged in to delete history');
  }

  // Ensure cache is loaded
  const db = await loadDecisionDBAsync();

  // Filter out the record
  db.history = db.history.filter(h => h.date !== date);

  // Save the updated history array to the scenario
  await saveActiveHistory(db.history);
}

/**
 * Gets history for a specific tax year
 * @param {string} taxYear - Tax year in 'YY/YY' format
 * @returns {object[]} History records for that tax year
 */
export function getTaxYearHistory(taxYear) {
  return getHistory({ taxYear });
}

/**
 * Clears all history
 * @returns {Promise<void>}
 */
export async function clearHistory() {
  if (!isFirebaseAvailable()) {
    throw new Error('Must be logged in to clear history');
  }

  // Save empty history array to the scenario
  await saveActiveHistory([]);

  // Update cache
  if (cachedDecisionDB) {
    cachedDecisionDB.history = [];
  }
}

/**
 * WIPE ALL DECISION DATA - Complete reset
 * Resets settings, tax years, and history in the active scenario
 * @returns {Promise<void>}
 */
export async function wipeAllDecisionData() {
  if (!isFirebaseAvailable()) {
    throw new Error('Must be logged in to wipe data');
  }

  const defaultDB = getDefaultDecisionDB();
  // A locked plan refuses the whole reset before any of it is written (6.20.2): its records and tax years stay with it.
  await assertActiveSettingsWritable('decision', defaultDB.settings);

  // The settings first (6.20.2): if the store refuses them (the plan was locked after this tab loaded it), the records
  // and tax years are not wiped either. Emptied, not filled with the defaults: an unlocked plan reads its Decision settings
  // from its Stress settings, and a default is never stored as if typed (lead4.md D2).
  await saveActiveDecisionSettings({});
  await Promise.all([
    saveActiveTaxYears({}),
    saveActiveHistory([])
  ]);

  invalidateCache();
}

/**
 * Calculates state pension for a given tax year based on settings
 * Uses HMRC forecast data: start date and weekly amount
 *
 * @param {string} taxYear - Tax year in 'YY/YY' format
 * @returns {Promise<object>} { amount, monthly, yearsUntil, isReceiving, isFirstYear, startDate }
 */
export async function getStatePensionForTaxYear(taxYear) {
  const settings = await getDecisionSettingsAsync();
  const allTaxYears = await getAllTaxYearsAsync();
  // The reading itself is pure since 7.2.0 (the new app's Month by month reads a saved plan with it too).
  const { statePensionInfoFor } = await import('../utils/StatePensionUtils.js');
  return statePensionInfoFor(settings, allTaxYears, taxYear);
}
