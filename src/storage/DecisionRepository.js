/**
 * Decision Repository
 * Manages persistence of Decision Tool data via Firebase Firestore
 *
 * Requires user to be logged in - no local storage fallback.
 */

import { DRAWDOWN_DEFAULTS, TAX_DEFAULTS } from '../constants.js';
import { simpleHash } from '../utils/MathUtils.js';
import { isFirebaseConfigured, isLoggedIn } from '../firebase/index.js';
import {
  loadDecisionData,
  saveDecisionData,
  loadDecisionHistory,
  addDecisionHistoryRecord,
  deleteDecisionHistoryRecord,
  clearAllHistory
} from '../firebase/FirestoreService.js';

// In-memory cache for Firebase data
let cachedDecisionDB = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5000; // 5 seconds

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
      baseSalary: DRAWDOWN_DEFAULTS.BASE_SALARY,
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
  cacheTimestamp = null;
}

/**
 * Loads decision database - returns defaults if not logged in
 * @returns {object} Decision database (from cache or defaults)
 */
export function loadDecisionDB() {
  // Return cached data if available
  if (cachedDecisionDB && cacheTimestamp && Date.now() - cacheTimestamp < CACHE_DURATION) {
    return cachedDecisionDB;
  }
  // Return defaults - async load should be used for actual data
  return getDefaultDecisionDB();
}

/**
 * Loads decision database asynchronously from Firebase
 * @returns {Promise<object>} Decision database
 */
export async function loadDecisionDBAsync() {
  // Check cache
  if (cachedDecisionDB && cacheTimestamp && Date.now() - cacheTimestamp < CACHE_DURATION) {
    return cachedDecisionDB;
  }

  if (!isFirebaseAvailable()) {
    console.warn('Firebase not available - returning defaults');
    return getDefaultDecisionDB();
  }

  try {
    const cloudData = await loadDecisionData();
    const cloudHistory = await loadDecisionHistory();

    if (cloudData) {
      const db = {
        settings: cloudData.settings || getDefaultDecisionDB().settings,
        taxYears: cloudData.taxYears || {},
        history: cloudHistory || [],
        lastModified: cloudData.lastModified,
        checksum: cloudData.checksum
      };
      cachedDecisionDB = db;
      cacheTimestamp = Date.now();
      return db;
    }
  } catch (error) {
    console.error('Error loading from Firebase:', error);
  }

  // Return defaults if no cloud data
  return getDefaultDecisionDB();
}

/**
 * Saves the decision database to Firebase
 * @param {object} db - Decision database
 * @returns {Promise<void>}
 */
export async function saveDecisionDB(db) {
  if (!isFirebaseAvailable()) {
    throw new Error('Must be logged in to save data');
  }

  try {
    db.lastModified = new Date().toISOString();
    db.checksum = generateDecisionChecksum(db);

    await saveDecisionData({
      settings: db.settings,
      taxYears: db.taxYears,
      lastModified: db.lastModified,
      checksum: db.checksum
    });

    // Update cache
    cachedDecisionDB = db;
    cacheTimestamp = Date.now();
  } catch (error) {
    console.error('Error saving to Firebase:', error);
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
  db.settings = { ...db.settings, ...settings };
  await saveDecisionDB(db);
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
    cpi: 0.04,

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
 * Gets history records asynchronously (Firebase)
 * @param {object} options - Filter options
 * @returns {Promise<object[]>} History records
 */
export async function getHistoryAsync(options = {}) {
  if (isFirebaseAvailable()) {
    try {
      return await loadDecisionHistory(options);
    } catch (error) {
      console.error('Error loading history from Firebase:', error);
    }
  }
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

  // Save to Firebase
  await addDecisionHistoryRecord(record);

  // Update cache
  if (cachedDecisionDB) {
    const existingIndex = cachedDecisionDB.history.findIndex(h => h.date === record.date);
    if (existingIndex >= 0) {
      cachedDecisionDB.history[existingIndex] = record;
    } else {
      cachedDecisionDB.history.push(record);
    }
    cachedDecisionDB.history.sort((a, b) => a.date.localeCompare(b.date));
  }
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

  await deleteDecisionHistoryRecord(date);

  // Update cache
  if (cachedDecisionDB) {
    cachedDecisionDB.history = cachedDecisionDB.history.filter(h => h.date !== date);
  }
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
 * Clears all history - THE WIPE FUNCTION
 * @returns {Promise<void>}
 */
export async function clearHistory() {
  if (!isFirebaseAvailable()) {
    throw new Error('Must be logged in to clear history');
  }

  await clearAllHistory();

  // Update cache
  if (cachedDecisionDB) {
    cachedDecisionDB.history = [];
  }
}

/**
 * WIPE ALL DECISION DATA - Complete reset
 * Clears settings, tax years, and history
 * @returns {Promise<void>}
 */
export async function wipeAllDecisionData() {
  if (!isFirebaseAvailable()) {
    throw new Error('Must be logged in to wipe data');
  }

  const defaultDB = getDefaultDecisionDB();

  await clearAllHistory();
  await saveDecisionData({
    settings: defaultDB.settings,
    taxYears: {},
    lastModified: new Date().toISOString()
  });

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

  return {
    amount: result.annual,
    monthly: result.monthly,
    yearsUntil: timeUntil.years,
    monthsUntil: timeUntil.months,
    isReceiving: result.isReceiving,
    isFirstYear: result.isFirstYear,
    weeksInYear: result.weeksInYear,
    startDate: result.startDate
  };
}
