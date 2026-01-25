/**
 * Stress Repository
 * Manages persistence of Stress Tester data via Firebase Firestore
 *
 * Requires user to be logged in - no local storage fallback.
 */

import { DRAWDOWN_DEFAULTS, TAX_DEFAULTS, SIMULATION_DEFAULTS } from '../constants.js';
import { simpleHash } from '../utils/MathUtils.js';
import { isFirebaseConfigured, isLoggedIn } from '../firebase/index.js';
import { loadStressData, saveStressData } from '../firebase/FirestoreService.js';
import { parseStatePensionDate } from '../utils/StatePensionUtils.js';

// In-memory cache
let cachedStressDB = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5000; // 5 seconds

/**
 * Default stress database structure
 */
function getDefaultStressDB() {
  return {
    settings: {
      // Fund minimums
      equityMin: DRAWDOWN_DEFAULTS.EQUITY_MIN,
      bondMin: DRAWDOWN_DEFAULTS.BOND_MIN,
      cashTarget: DRAWDOWN_DEFAULTS.CASH_TARGET,
      duration: DRAWDOWN_DEFAULTS.DURATION_YEARS,

      // Income
      baseSalary: DRAWDOWN_DEFAULTS.BASE_SALARY,
      other: 0,
      statePension: 12000,
      statePensionYear: 12,

      // Tax
      pa: TAX_DEFAULTS.PERSONAL_ALLOWANCE,
      brl: TAX_DEFAULTS.BASIC_RATE_LIMIT,
      hrl: TAX_DEFAULTS.HIGHER_RATE_LIMIT,
      taxMode: 'inflates',

      // Protection
      protectionMult: SIMULATION_DEFAULTS.PROTECTION_MULTIPLIER,
      consecutiveLimit: DRAWDOWN_DEFAULTS.CONSECUTIVE_LIMIT,
      disableProtection: false,

      // HODL (emergency reserve)
      hodlEnabled: SIMULATION_DEFAULTS.HODL_ENABLED,
      hodlValue: SIMULATION_DEFAULTS.HODL_VALUE
    },
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
export function invalidateStressCache() {
  cachedStressDB = null;
  cacheTimestamp = null;
}

/**
 * Loads stress database - returns defaults if not logged in
 * @returns {object} Stress database (from cache or defaults)
 */
export function loadStressDB() {
  // Return cached data if available
  if (cachedStressDB && cacheTimestamp && Date.now() - cacheTimestamp < CACHE_DURATION) {
    return cachedStressDB;
  }
  // Return defaults - async load should be used for actual data
  return getDefaultStressDB();
}

/**
 * Loads stress database asynchronously from Firebase
 * @returns {Promise<object>} Stress database
 */
export async function loadStressDBAsync() {
  // Check cache
  if (cachedStressDB && cacheTimestamp && Date.now() - cacheTimestamp < CACHE_DURATION) {
    return cachedStressDB;
  }

  if (!isFirebaseAvailable()) {
    console.warn('Firebase not available - returning defaults');
    return getDefaultStressDB();
  }

  try {
    const cloudData = await loadStressData();

    if (cloudData) {
      const db = {
        settings: cloudData.settings || getDefaultStressDB().settings,
        lastModified: cloudData.lastModified,
        checksum: cloudData.checksum
      };
      cachedStressDB = migrateStressDB(db);
      cacheTimestamp = Date.now();
      return cachedStressDB;
    }
  } catch (error) {
    console.error('Error loading stress data from Firebase:', error);
  }

  // Return defaults if no cloud data
  return getDefaultStressDB();
}

/**
 * Saves the stress database to Firebase
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

    await saveStressData({
      settings: db.settings,
      lastModified: db.lastModified,
      checksum: db.checksum
    });

    // Update cache
    cachedStressDB = db;
    cacheTimestamp = Date.now();
  } catch (error) {
    console.error('Error saving stress data to Firebase:', error);
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
 * Migrates old database formats to current version
 * @param {object} db - Database to migrate
 * @returns {object} Migrated database
 */
function migrateStressDB(db) {
  const migrated = { ...getDefaultStressDB() };

  // Merge settings
  if (db.settings) {
    migrated.settings = { ...migrated.settings, ...db.settings };

    // Migrate old field names
    if (db.settings.pacwMin !== undefined && db.settings.equityMin === undefined) {
      migrated.settings.equityMin = db.settings.pacwMin;
    }
    if (db.settings.cgtMin !== undefined && db.settings.bondMin === undefined) {
      migrated.settings.bondMin = db.settings.cgtMin;
    }
    if (db.settings.csh2Target !== undefined && db.settings.cashTarget === undefined) {
      migrated.settings.cashTarget = db.settings.csh2Target;
    }

    // Ensure HODL fields exist
    if (migrated.settings.hodlEnabled === undefined) {
      migrated.settings.hodlEnabled = false;
    }
    if (migrated.settings.hodlValue === undefined) {
      migrated.settings.hodlValue = 25000;
    }
  }

  migrated.lastModified = db.lastModified;
  migrated.checksum = db.checksum;

  return migrated;
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
  db.settings = { ...db.settings, ...settings };
  await saveStressDB(db);
}

/**
 * Updates a single setting
 * @param {string} key - Setting key
 * @param {*} value - Setting value
 * @returns {Promise<void>}
 */
export async function updateStressSetting(key, value) {
  const db = await loadStressDBAsync();
  db.settings[key] = value;
  await saveStressDB(db);
}

/**
 * Resets stress settings to defaults
 * @returns {Promise<void>}
 */
export async function resetStressSettings() {
  if (!isFirebaseAvailable()) {
    throw new Error('Must be logged in to reset settings');
  }

  const defaultDB = getDefaultStressDB();

  await saveStressData({
    settings: defaultDB.settings,
    lastModified: new Date().toISOString()
  });

  invalidateStressCache();
}

/**
 * Calculates state pension simulation config from date-based settings
 * @param {object} settings - Settings containing spStartDate and spWeeklyAmount
 * @returns {object} State pension config {spStartYear, spWeeklyAmount, spFirstYearRatio}
 */
function calculateSpConfigFromSettings(settings) {
  // If no SP start date configured, return config that means no state pension
  if (!settings.spStartDate || !settings.spWeeklyAmount) {
    return {
      spStartYear: 999,  // Never starts
      spWeeklyAmount: 0,
      spFirstYearRatio: 1
    };
  }

  // Parse the SP start date
  const spDate = parseStatePensionDate(settings.spStartDate);
  if (!spDate) {
    console.warn('Could not parse spStartDate:', settings.spStartDate);
    return {
      spStartYear: 999,
      spWeeklyAmount: 0,
      spFirstYearRatio: 1
    };
  }

  // Calculate years until SP starts from now
  const now = new Date();
  const msPerYear = 365.25 * 24 * 60 * 60 * 1000;
  const yearsUntilSp = Math.max(0, (spDate.getTime() - now.getTime()) / msPerYear);

  // The simulation year when SP starts (0-indexed)
  const spStartYear = Math.floor(yearsUntilSp);

  // Calculate ratio for first partial year
  const daysInYear = 365;
  const dayOfYear = Math.floor((spDate - new Date(spDate.getFullYear(), 0, 0)) / (24 * 60 * 60 * 1000));
  const daysRemaining = daysInYear - dayOfYear;
  const firstYearRatio = daysRemaining / daysInYear;

  return {
    spStartYear: spStartYear,
    spWeeklyAmount: settings.spWeeklyAmount,
    spFirstYearRatio: firstYearRatio
  };
}

/**
 * Creates simulation config from stress settings
 * @param {object} overrides - Optional overrides
 * @param {object} preloadedSettings - Optional pre-loaded settings (to avoid cache issues)
 * @returns {object} Simulation config
 */
export function createSimulationConfigFromSettings(overrides = {}, preloadedSettings = null) {
  const settings = preloadedSettings || getStressSettings();

  // Calculate state pension config from date-based settings
  const spConfig = calculateSpConfigFromSettings(settings);

  return {
    equityStart: overrides.equityStart ?? settings.equityMin,
    bondStart: overrides.bondStart ?? settings.bondMin,
    cashStart: overrides.cashStart ?? settings.cashTarget,
    equityMin: settings.equityMin,
    bondMin: settings.bondMin,
    cashTarget: settings.cashTarget,
    years: overrides.years ?? settings.duration,
    duration: settings.duration,
    baseSalary: settings.baseSalary,
    other: settings.other,
    // State pension - use date-based config
    spStartYear: spConfig.spStartYear,
    spWeeklyAmount: spConfig.spWeeklyAmount,
    spFirstYearRatio: spConfig.spFirstYearRatio,
    pa: settings.pa,
    brl: settings.brl,
    hrl: settings.hrl,
    taxMode: settings.taxMode,
    protectionMult: settings.protectionMult,
    consecutiveLimit: settings.consecutiveLimit,
    disableProtection: settings.disableProtection,
    hodlEnabled: settings.hodlEnabled,
    hodlValue: settings.hodlValue
  };
}

