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
import { spSimConfigFromSettings } from '../utils/StatePensionUtils.js';
import { tentGlideForSettings } from '../services/GlidepathService.js';
import { deriveIsaMix } from '../services/IsaFunds.js';
import { scheduleFromSteps, defaultSpYear, smileToSteps, compileSteps } from '../services/IncomeSchedule.js';
import { pinTiming, timingPinPatch, potScaleOf, isaAtRetirementOf } from '../services/PlanTiming.js';
import { budgetAgesKnown } from '../services/BudgetModel.js';
import { chargesPctOf, DEFAULT_CHARGES_PCT } from '../services/Charges.js';
import { isaGrowthOf, DEFAULT_ISA_GROWTH } from '../services/IsaGrowth.js';
export { scheduleFromSteps, defaultSpYear };
import {
  getActiveStressSettings,
  saveActiveStressSettings,
  invalidateScenarioCache, getActiveBudget, activePlanLocked, storedActiveSettings, getDefaultStressSettings } from './ScenarioRepository.js';
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
 * Default stress database structure.
 * It is merged UNDER every stored plan on load (migrateStressDB), so it never carries the fund and platform charge
 * (6.19.0): a locked plan from before charges must keep reading none, which every engine takes as 0%.
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
// The plan was locked after this tab loaded it (the store refused a write, 6.20.2): this copy goes with the others.
onPlanCopyStale(invalidateStressCache);

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
      const db = {
        settings: stressSettings,
        budget,
        lastModified: new Date().toISOString(),
        checksum: null
      };
      cachedStressDB = migrateStressDB(db);
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

    // Update cache
    cachedStressDB = db;
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

  // The separate "Declining with age" spending profile (v6.2.0 and earlier) is now expressed on the
  // income steps themselves (per-step decline / glide). Bake it in once so the compiled schedule is
  // identical and the plan stops carrying a multiplier nothing shows any more.
  const ms = migrated.settings;
  if (ms.spendingProfile === 'declining') {
    const ageNow = +ms.shapeAgeNow || 57;
    const steps = (ms.incomeShape === 'phases' && Array.isArray(ms.incomeSteps) && ms.incomeSteps.length) ? ms.incomeSteps : [{ fromAge: ageNow, amount: +ms.baseSalary || 0 }];
    ms.incomeShape = 'phases';
    ms.incomeSteps = smileToSteps(steps, ageNow);
    ms.shapeAgeNow = ageNow;
    ms.targetSchedule = compileSteps(ms, ageNow);
    ms.spendingProfile = 'flat';
    ms.spendingMigratedFrom = 'declining';
  }
  // 6.4.0: the plan's start (first tax year, retired / retire-at-age) is saved rather than implied by
  // today's date. Derived once from the age today + the income shape's start age; written back by the load
  // path the first time (6.13.5 — see loadStressDBAsync), not "on the next save".
  migrated.settings = pinTiming(migrated.settings, db.budget || null);

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
  cachedStressDB = next;
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
 * Calculates state pension simulation config from date-based settings
 * @param {object} settings - Settings containing spStartDate and spWeeklyAmount
 * @returns {object} State pension config {spStartYear, spWeeklyAmount, spFirstYearRatio}
 */
function calculateSpConfigFromSettings(settings) {
  return spSimConfigFromSettings(settings);
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
    : { statePension: settings.statePension || 0, statePensionYear: defaultSpYear(settings) };

  // ISA composition (own-funds mode): when the plan has tagged ISA-wrapped holdings, model the
  // ISA pool at THEIR asset mix (same driver machinery as the taxable pots) instead of the flat
  // conservative rate. Re-wrapped as SIPP for tagging because tagPortfolio deliberately keeps
  // ISA-wrapped holdings out of the buckets. Absent => engine keeps the legacy flat-rate path
  // (and an untouched RNG stream — golden-safe).
  const isaMix = deriveIsaMix(settings.taggedFunds);

  // Retiring later (6.4.0 Timing block): the pots entered are today's; the plan runs from retirement
  // on the pots projected to then (today's money), so everything pot-shaped is scaled by the same
  // factor — starts, glidepath floors, the ISA — exactly as requiredPotForStrategy scales a plan.
  // Already retired / no projection → 1, byte-identical to before.
  const ps = potScaleOf(settings);
  const kS = (v) => (v == null ? v : v * ps.sipp);

  return {
    ...(isaMix ? { isaMix } : {}),
    equityStart: kS(overrides.equityStart ?? settings.equityMin),
    bondStart: kS(overrides.bondStart ?? settings.bondMin),
    cashStart: kS(overrides.cashStart ?? settings.cashTarget),
    equityMin: kS(settings.equityMin),
    bondMin: kS(settings.bondMin),
    cashTarget: kS(settings.cashTarget),
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
    protectionEscalateMonths: settings.protectionEscalateMonths ?? 12
      ?? (settings.protectionFactor != null ? 1 - settings.protectionFactor / 100 : SIMULATION_DEFAULTS.PROTECTION_MULTIPLIER),
    consecutiveLimit: settings.consecutiveLimit,
    disableProtection: settings.disableProtection,
    hodlEnabled: settings.hodlEnabled,
    hodlValue: settings.hodlValue,
    // ISA pot (tax-free top-up drawn via band management; see DrawdownStrategy). Retiring later: today's ISA scaled to the
    // ISA at retirement — or, with no ISA today but money going into one, that ISA itself (a scale cannot lift £0; review of
    // 6.22.0, PlanTiming.isaAtRetirementOf). A plan without the ISA choice: exactly as before.
    isaBalance: isaAtRetirementOf(settings),
    isaReturn: settings.isaReturn,
    // Tax bands from settings (previously only supplied by UI call-site overrides — configs
    // built without overrides had pa/brl/hrl undefined, which NaN'd every draw).
    strategyId: settings.strategyId || 'pots-and-valves',
    // Buckets in order runs the same engine with ordered sourcing and no rebalancing.
    sourcingMode: settings.strategyId === 'buckets-in-order' ? 'ordered' : undefined,
    bucketBand: settings.strategyId === 'buckets-in-order' ? ((settings.strategyParams && settings.strategyParams.bucketBand > 0) ? settings.strategyParams.bucketBand / 100 : 0.10) : undefined,
    pa: settings.pa ?? 12570,
    brl: settings.brl ?? 50270,
    hrl: settings.hrl ?? 125140,
    accessMethod: settings.accessMethod || 'drawdown',
    // Protection knobs — pass the USER'S values through (previously recoveryBuffer was never
    // emitted, so the engine always used its default regardless of settings). protectionMult
    // falls back to the Decision-side protectionFactor (one unit, translated at this seam).
    recoveryBuffer: settings.recoveryBuffer ?? DRAWDOWN_DEFAULTS.RECOVERY_BUFFER,
    ufplsYears: settings.ufplsYears || null,
    ufplsThenPcls: !!settings.ufplsThenPcls,
    bandFillRecycle: !!settings.bandFillRecycle,
    targetSchedule: scheduleFromSteps(settings),
    dbAmount: settings.dbAmount || 0,
    dbStartYear: settings.dbStartYear || 0,
    dbIndexation: settings.dbIndexation || 'lpi5',
    // Lumpy income (user-defined): income streams with start/end years + one-off lump sums.
    extraIncomes: Array.isArray(settings.extraIncomes) ? settings.extraIncomes : [],
    windfalls: Array.isArray(settings.windfalls) ? settings.windfalls : [],
    // Taxable sleeve (GIA): where a lump sum actually has to live, because the ISA takes £20k/yr
    // and a retiree's SIPP £3,600/yr. Default mix is equities unless the plan says otherwise;
    // a GIA holding gilts is near tax-free (CGT-exempt uplift) and the engine models that.
    taxableStart: +settings.taxableStart || 0,
    taxableMix: settings.taxableMix || null,        // 'equity' | 'gilt' | 'bond' | 'cash' | 'balanced' | { equity, bond, gilt, cash }
    giaTaxBand: settings.giaTaxBand || 'basic',
    bedAndIsa: settings.bedAndIsa !== false,
    relevantEarnings: +settings.relevantEarnings || 0,
    extraWithdrawals: Array.isArray(settings.extraWithdrawals) ? settings.extraWithdrawals : [],
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
    diversifierStart: kS(overrides.diversifierStart ?? (settings.diversifierStart || undefined)),
    subAsset: settings.subAsset || undefined,
    // Fund and platform charges (6.19.0, services/Charges.js): the plan's percent a year, taken off every charged pot
    // each month by every engine and strategy. Only when there is one — absent, 0 or invalid (a plan locked before
    // charges) leaves the config exactly as it always was, so its figures cannot move.
    ...(chargesPctOf(settings) > 0 ? { chargesPct: chargesPctOf(settings) } : {}),
    // How the ISA grows (6.22.0, services/IsaGrowth.js): 'cash' or 'invested', only when the plan has the choice — without
    // it (a plan locked before the choice) the ISA grows at isaReturn, exactly as before. No mix is passed: "invested"
    // reads the run's own pension pots, so the optimiser and the pots-at-retirement scaling carry the ISA with them.
    ...(isaGrowthOf(settings) ? { isaGrowth: isaGrowthOf(settings) } : {})
  };
}


/** Asset mix of the ISA-wrapped tagged holdings (or null): moved to services/IsaFunds.js in the review of 6.22.0; kept here by name. */
export { deriveIsaMix };
