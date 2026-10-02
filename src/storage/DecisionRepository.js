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
  assertActiveSettingsWritable
} from './ScenarioRepository.js';
import { onPlanCopyStale } from './planCopies.js';
import { PlanLockedError, isPlanLockedError, lockedWriteRefusal, lockedSettingsToWrite } from '../services/LockedPlanGuard.js';

// In-memory cache for the combined decision DB (all from active scenario)
// Cache is valid until explicitly invalidated (login/logout/wipe/scenario switch)
let cachedDecisionDB = null;

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
      spStartDate: null,        // Date when SP starts (e.g., "21 April 2037")
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
  // Check cache
  if (cachedDecisionDB) {
    return cachedDecisionDB;
  }

  if (!isFirebaseAvailable()) {
    console.warn('Firebase not available - returning defaults');
    return getDefaultDecisionDB();
  }

  try {
    // Load all data from the active scenario in parallel
    const [decisionSettings, taxYears, history] = await Promise.all([
      getActiveDecisionSettings(),
      getActiveTaxYears(),
      getActiveHistory()
    ]);

    const settingsIn = decisionSettings || getDefaultDecisionDB().settings;
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
  if (!isFirebaseAvailable()) {
    throw new Error('Must be logged in to save data');
  }

  try {
    // A locked plan (6.20.2): this save is a tax year's (the ISA used so far, a year set up or removed), and the
    // settings ride along. They are written as stored, with only the named bookkeeping changes taken from the copy in
    // memory (services/LockedPlanGuard.js) — a change made to that copy can never reach a locked plan this way. A
    // settings change itself is refused earlier, by saveDecisionSettings.
    let settings = db.settings;
    if (await activePlanLocked()) {
      const w = lockedSettingsToWrite('decision', await storedActiveSettings('decision'), db.settings);
      if (w.dropped.length) console.warn('Locked plan: settings changed in memory were not saved:', w.dropped);
      settings = w.settings;
    }
    db.lastModified = new Date().toISOString();
    db.checksum = generateDecisionChecksum(db);

    // Save settings, then taxYears, to the active scenario. One after the other (6.20.2): when the store refuses the
    // settings — the plan was locked on another device after this tab loaded it — this tab's tax years, as old as its
    // settings, are not written over the ones that device saved.
    await saveActiveDecisionSettings(settings);
    await saveActiveTaxYears(db.taxYears);

    // Update cache
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
function stableSort(v) {
  if (Array.isArray(v)) return v.map(stableSort);
  if (v && typeof v === 'object') return Object.keys(v).sort().reduce((o, k) => { if (v[k] !== undefined) o[k] = stableSort(v[k]); return o; }, {});
  return v;
}

export function decisionSettingsChecksum(settings) {
  if (!settings) return '';
  // Lock bookkeeping is volatile: it must never move the checksum (an unlock alone would otherwise
  // mark every entry as "under previous settings").
  const { locked, lockedAt, lockedBy, unlockedAt, unlockCount, ...planDefining } = settings;
  // Key-order independent: Firestore hands objects back with keys in a different order from the
  // in-memory object they were saved from, and JSON.stringify would hash them differently.
  return simpleHash(stableSort(planDefining));
}

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
  // A locked plan (6.20.2): the change asked for may only be the unlock (services/LockedPlanGuard.js) — not even how
  // often months are recorded, which is in the settings checksum. Anything else is refused here, before a byte is
  // written or the copy in memory is touched.
  if (await activePlanLocked()) {
    const stored = await storedActiveSettings('decision');
    const keys = lockedWriteRefusal('decision', { locked: true, stored, next: { ...stored, ...settings } });
    if (keys) throw new PlanLockedError(keys);
  }
  // The copy in memory changes only once the write has gone through.
  await saveDecisionDB({ ...db, settings: { ...db.settings, ...settings } });
}

/**
 * Gets default tax year configuration
 */
function getDefaultTaxYearConfig() {
  return {
    // Tax thresholds
    pa: TAX_DEFAULTS.PERSONAL_ALLOWANCE,
    brl: TAX_DEFAULTS.BASIC_RATE_LIMIT,
    hrl: TAX_DEFAULTS.HIGHER_RATE_LIMIT,

    // Previous year's CPI (for salary inflation)
    cpi: DECISION_ASSUMED_CPI,   // assumption only — the wizard chains the user's entered CPI year-on-year

    // Other taxable income (annual)
    other: 0,

    // ISA/Savings allocation for tax efficiency
    isaSavingsAllocation: 0,      // Total ISA/Savings available for this year
    isaSavingsUsed: 0,            // Cumulative used so far this year

    // Tax efficiency mode
    isTaxEfficient: true,         // Year-level tax efficiency flag
    taxEfficiencyChoice: null,    // 'efficient', 'reduced', 'inefficient'

    // Mid-year start support
    grossIncomeToDate: 0,         // Taxable income before starting pension
    taxPaidToDate: null,          // PAYE already deducted on it (null = unknown → assume it was taxed on its own)
    startMonth: 4,                // Month number (4 = April) when started

    // Wizard completion tracking
    yearSetupComplete: false,     // Has wizard been completed?
    confirmedSalary: null         // User-confirmed target salary for this year
  };
}

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
  // and tax years are not wiped either.
  await saveActiveDecisionSettings(defaultDB.settings);
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

  // Use new SP fields if available
  const spStartDate = settings.spStartDate;
  const spWeeklyAmount = settings.spWeeklyAmount || 0;

  // If no SP data configured, return zeros
  if (!spStartDate || !spWeeklyAmount) {
    // Still try to format the start date if available
    let formattedStartDate = null;
    if (spStartDate) {
      const { formatStatePensionDate } = await import('../utils/StatePensionUtils.js');
      formattedStartDate = formatStatePensionDate(spStartDate);
    }
    return {
      amount: 0,
      monthly: 0,
      yearsUntil: 0,
      isReceiving: false,
      isFirstYear: false,
      startDate: formattedStartDate
    };
  }

  // Import the calculation utility dynamically to avoid circular deps
  const { calculateStatePensionForTaxYear, getTimeUntilStatePension, parseStatePensionDate } =
    await import('../utils/StatePensionUtils.js');

  const result = calculateStatePensionForTaxYear({
    taxYear,
    spStartDate,
    weeklyAmount: spWeeklyAmount,
    taxYearConfigs: allTaxYears
  });

  // Calculate years until SP starts
  const timeUntil = getTimeUntilStatePension(spStartDate);

  // The monthly PAYMENT (weekly × 52 / 12) and the month it starts: a first-year State Pension is paid in
  // full from its start month, not spread thinly over twelve (6.11.0). `amount` stays the year's total.
  const sd = parseStatePensionDate(spStartDate);
  const startYm = sd ? sd.getFullYear() + '-' + String(sd.getMonth() + 1).padStart(2, '0') : null;
  return {
    amount: result.annual,
    monthly: result.monthly,
    monthlyFull: Math.round((spWeeklyAmount * 52 / 12) * 100) / 100,
    startYm,
    yearsUntil: timeUntil.years,
    monthsUntil: timeUntil.months,
    isReceiving: result.isReceiving,
    isFirstYear: result.isFirstYear,
    weeksInYear: result.weeksInYear,
    startDate: result.startDate
  };
}
