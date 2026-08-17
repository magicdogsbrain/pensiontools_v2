/**
 * Stress Repository
 * Manages persistence of Stress Tester data.
 *
 * Settings are stored per-scenario (via ScenarioRepository).
 *
 * Requires user to be logged in - no local storage fallback.
 */

import { DRAWDOWN_DEFAULTS, TAX_DEFAULTS, SIMULATION_DEFAULTS } from '../constants.js';
import { simpleHash } from '../utils/MathUtils.js';
import { isFirebaseConfigured, isLoggedIn } from '../firebase/index.js';
import { parseStatePensionDate } from '../utils/StatePensionUtils.js';
import { tentGlideForSettings } from '../services/GlidepathService.js';
import { tagPortfolio } from '../services/PortfolioTagger.js';
import {
  getActiveStressSettings,
  saveActiveStressSettings,
  invalidateScenarioCache
} from './ScenarioRepository.js';

// In-memory cache
// Cache is valid until explicitly invalidated (login/logout/wipe/scenario switch)
let cachedStressDB = null;

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
      hodlValue: SIMULATION_DEFAULTS.HODL_VALUE,

      // Spending profile ('flat' default; 'declining' = spending drifts down with age)
      spendingProfile: 'flat',
      // Rising-equity glidepath / bond tent (opt-in)
      equityGlideEnabled: false,
      // Diversifiers sleeve (gold + trend/macro), opt-in — 0 = off (legacy 3-bucket)
      diversifierStart: 0,
      // Tagged fund holdings (from "Build from my funds"), reused across tabs
      taggedFunds: []
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
      const db = {
        settings: stressSettings,
        lastModified: new Date().toISOString(),
        checksum: null
      };
      cachedStressDB = migrateStressDB(db);
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

    // Update cache
    cachedStressDB = db;
  } catch (error) {
    console.error('Error saving stress data:', error);
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
 * Resets stress settings to defaults in the active scenario
 * @returns {Promise<void>}
 */
export async function resetStressSettings() {
  if (!isFirebaseAvailable()) {
    throw new Error('Must be logged in to reset settings');
  }

  const defaultDB = getDefaultStressDB();
  await saveActiveStressSettings(defaultDB.settings);
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
    return null; // no date-based SP → caller falls back to legacy statePension fields
  }

  // Parse the SP start date
  const spDate = parseStatePensionDate(settings.spStartDate);
  if (!spDate) {
    console.warn('Could not parse spStartDate:', settings.spStartDate);
    return null;
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

  // Prefer date-based SP; fall back to the legacy statePension/statePensionYear fields so
  // a plan configured only with those (e.g. the defaults) is not silently ignored.
  const spConfig = calculateSpConfigFromSettings(settings);
  const spFields = spConfig
    ? { spStartYear: spConfig.spStartYear, spWeeklyAmount: spConfig.spWeeklyAmount, spFirstYearRatio: spConfig.spFirstYearRatio }
    : { statePension: settings.statePension || 0, statePensionYear: settings.statePensionYear ?? 999 };

  // ISA composition (own-funds mode): when the plan has tagged ISA-wrapped holdings, model the
  // ISA pool at THEIR asset mix (same driver machinery as the taxable pots) instead of the flat
  // conservative rate. Re-wrapped as SIPP for tagging because tagPortfolio deliberately keeps
  // ISA-wrapped holdings out of the buckets. Absent => engine keeps the legacy flat-rate path
  // (and an untouched RNG stream — golden-safe).
  const isaMix = deriveIsaMix(settings.taggedFunds);

  return {
    ...(isaMix ? { isaMix } : {}),
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
    // State pension - date-based, or legacy fallback (see spFields above)
    ...spFields,
    pa: settings.pa,
    brl: settings.brl,
    hrl: settings.hrl,
    taxMode: settings.taxMode,
    protectionMult: settings.protectionMult,
    consecutiveLimit: settings.consecutiveLimit,
    disableProtection: settings.disableProtection,
    hodlEnabled: settings.hodlEnabled,
    hodlValue: settings.hodlValue,
    // ISA pot (tax-free top-up drawn via band management; see DrawdownStrategy)
    isaBalance: settings.isaBalance || 0,
    isaReturn: settings.isaReturn,
    accessMethod: settings.accessMethod || 'drawdown',
    ufplsYears: settings.ufplsYears || null,
    ufplsThenPcls: !!settings.ufplsThenPcls,
    isaDrawdownStrategy: settings.isaDrawdownStrategy,
    // Spending profile: 'flat' (level real spend, default) or 'declining' (spending drifts down
    // with age — Blanchett's spending smile). See SimulationEngine.spendingFactor.
    spendingProfile: settings.spendingProfile || 'flat',
    // Rising-equity glidepath (bond tent): the equity share rises over the early years UP TO the chosen
    // split (the ENDGAME/destination) and then holds — so the chosen allocation is where it settles, and
    // the tent's time-average equity is BELOW it (more cautious early). Derived from the equity:bond
    // ratio (scale-invariant, so passing the raw £ minimums is fine). Opt-in.
    equityGlide: settings.equityGlideEnabled ? tentGlideForSettings(settings) : undefined,
    // Diversifiers sleeve (gold + trend/macro), opt-in. When set, the engine runs the 4-bucket
    // sub-asset path (subAsset present) and holds this pot flat, tapping it first in a downturn.
    // Absent/0 → legacy 3-bucket path, byte-identical.
    diversifierStart: overrides.diversifierStart ?? (settings.diversifierStart || undefined),
    subAsset: settings.subAsset || undefined
  };
}


/**
 * Asset mix of the ISA-wrapped tagged holdings, as bucket fractions (+ sub-class weights),
 * or null when there are none.
 */
export function deriveIsaMix(taggedFunds) {
  const isaHoldings = (taggedFunds || []).filter(
    (f) => (f.wrapper || '').toUpperCase() === 'ISA' && +f.value > 0
  );
  if (!isaHoldings.length) return null;
  const t = tagPortfolio(isaHoldings.map((f) => ({ ...f, wrapper: 'SIPP' })));
  if (!(t.total > 0)) return null;
  const mix = {
    shares: t.buckets.shares / t.total,
    bonds: t.buckets.bonds / t.total,
    diversifiers: t.buckets.diversifiers / t.total,
    cash: t.buckets.cash / t.total
  };
  if (Object.keys(t.bondWeights).length) mix.bondWeights = t.bondWeights;
  if (Object.keys(t.diversifierWeights).length) mix.diversifierWeights = t.diversifierWeights;
  return mix;
}
