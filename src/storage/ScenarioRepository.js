/**
 * Scenario Repository
 * Manages named scenarios that contain settings for both Decision Tool and Stress Tester.
 *
 * Each scenario has:
 *   - planDetails: { name, description }
 *   - enabledTools: Array of enabled tools (e.g. ["stress", "decision"])
 *   - isActive: Boolean - only one scenario active at a time
 *   - decisionTool: { settings, history, taxYears }
 *   - stressTool: { settings }
 *
 * Requires user to be logged in - no local storage fallback.
 */

import { ENGINE_VERSION } from '../strategies/registry.js';
import { isFirebaseConfigured, isLoggedIn } from '../firebase/index.js';
import {
  loadAllScenarios,
  loadScenario,
  saveScenario,
  createScenario,
  deleteScenarioDoc,
  setActiveScenarioDoc,
  isScenarioNewerThanApp
} from '../firebase/FirestoreService.js';
import { SCHEMA_VERSION, isNewerSchema } from './schema.js';
import { DRAWDOWN_DEFAULTS, TAX_DEFAULTS, SIMULATION_DEFAULTS, ISA_DEFAULTS } from '../constants.js';
import { simpleHash } from '../utils/MathUtils.js';
import { defaultBudget } from '../services/BudgetModel.js';
import { deriveTiming } from '../services/PlanTiming.js';
import { emptyHoldings, normaliseHoldings } from '../services/HoldingsRecord.js';
import { DEFAULT_CHARGES_PCT, isChargesPct, chargesPctOf } from '../services/Charges.js';
import { DEFAULT_ISA_GROWTH, isIsaGrowth } from '../services/IsaGrowth.js';
import { PlanLockedError, lockedWriteRefusal, isLockedSettings, isPlanLockedError } from '../services/LockedPlanGuard.js';
import { getDefaultStressSettings } from './stressDefaults.js';
import { onPlanCopyStale, dropStalePlanCopies } from './planCopies.js';

// In-memory cache
// Cache is valid until explicitly invalidated (login/logout/wipe/scenario switch)
let cachedScenarios = null;
let cachedActiveScenario = null;

// The Stress and Decision settings of every loaded plan AS STORED: the lock guard's yardstick (6.20.2,
// services/LockedPlanGuard.js). The cached plan objects cannot be it: they are handed out by reference, and some readers
// adjust them in memory (the Budget's age today folded into the Stress copy, the old "Declining with age" rewrite of the
// Decision copy). Taken when the plans are loaded; moved on by every settings write that succeeds; dropped, with every
// other copy, when the store refuses a write because the plan was locked elsewhere (planCopies.js).
let storedSettings = new Map();   // plan id → { stress, decision }
const copyOf = (v) => (v === undefined ? undefined : JSON.parse(JSON.stringify(v)));
function rememberStored(scenario) {
  if (scenario && scenario.id != null) storedSettings.set(scenario.id, { stress: copyOf(scenario.stressTool?.settings), decision: copyOf(scenario.decisionTool?.settings) });
}
function storedOf(scenario) {
  if (!storedSettings.has(scenario.id)) rememberStored(scenario);
  return storedSettings.get(scenario.id) || { stress: undefined, decision: undefined };
}
/**
 * Refuse a write that would change a locked plan's settings (PlanLockedError, nothing written). A locked plan with no
 * Stress settings saved reads the defaults (getActiveStressSettings), so those are what a write is measured against.
 */
function refuseIfLocked(scenario, kind, settings) {
  const st = storedOf(scenario);
  const stored = kind === 'stress' && st.stress === undefined ? getDefaultStressSettings() : st[kind];
  const keys = lockedWriteRefusal(kind, { locked: isLockedSettings(st.decision), stored, next: settings });
  if (keys) throw new PlanLockedError(keys);
}

// A write the STORE refused (FirestoreService.saveScenario, 6.20.2): the plan was locked after this tab loaded it — on
// another device, or in another tab. Every copy this tab holds is out of date, so all of them are dropped (planCopies.js:
// this module's, the Stress and Decision repositories'): the next read loads the plan as stored (locked), and the tab's
// own check refuses from then on, before anything is sent.
onPlanCopyStale(() => invalidateScenarioCache());
/** saveScenario for a write the store may refuse as locked (settings, strategy): on that refusal the tab's copies go. */
async function saveGuardedWrite(id, data) {
  try { await saveScenario(id, data); }
  catch (e) { if (isPlanLockedError(e)) dropStalePlanCopies(); throw e; }
}

/**
 * Check if Firebase is available
 */
function isFirebaseAvailable() {
  return isFirebaseConfigured() && isLoggedIn();
}

/**
 * Invalidate the scenario cache
 */
export function invalidateScenarioCache() {
  cachedScenarios = null;
  cachedActiveScenario = null;
  storedSettings = new Map();
}

// ============================================================================
// DEFAULT SETTINGS
// ============================================================================

// Default stress settings for a new scenario: in storage/stressDefaults.js since 6.20.2, so the store's lock check
// (FirestoreService.saveScenario) can read what a locked plan with no Stress settings reads, without importing this module.
export { getDefaultStressSettings };

/**
 * Default decision settings for a new scenario
 */
export function getDefaultDecisionSettings() {
  return {
    equityMin: DRAWDOWN_DEFAULTS.EQUITY_MIN,
    bondMin: DRAWDOWN_DEFAULTS.BOND_MIN,
    cashTarget: DRAWDOWN_DEFAULTS.CASH_TARGET,
    duration: DRAWDOWN_DEFAULTS.DURATION_YEARS,
    baseSalary: DRAWDOWN_DEFAULTS.BASE_SALARY,
    protectionFactor: DRAWDOWN_DEFAULTS.PROTECTION_FACTOR,
    recoveryBuffer: DRAWDOWN_DEFAULTS.RECOVERY_BUFFER,
    consecutiveLimit: DRAWDOWN_DEFAULTS.CONSECUTIVE_LIMIT,
    spStartDate: null,
    spWeeklyAmount: 0,
    statePension: 0,
    statePensionYear: 0,
    // ISA as a depleting pot (see design/settings-model.md). read by both engines.
    isaBalance: 0,
    isaReturn: ISA_DEFAULTS.RETURN,
    isaMin: ISA_DEFAULTS.MIN,
    isaDrawdownStrategy: ISA_DEFAULTS.DRAWDOWN_STRATEGY,
    // Taxable sleeve (GIA): an existing unwrapped account today, what it holds (drives the tax it
    // suffers — gilts are CGT-free), the holder's marginal rate, whether to bed-and-ISA £20k/yr,
    // and relevant UK earnings (sets the SIPP room for a windfall). Read by both engines.
    taxableStart: 0,
    taxableMix: 'equity',
    giaTaxBand: 'basic',
    bedAndIsa: true,
    relevantEarnings: 0
  };
}

/**
 * Seed a Stress Tester settings object from the committed Decision plan ("Copy from
 * Decision"). Copies the shared plan basics (pots, duration, target income, State Pension,
 * ISA) and translates the protection unit (Decision % → Stress multiplier), while
 * preserving the caller's Stress-specific play fields (taxMode, bands, other, HODL,
 * disableProtection). Stamps provenance so the UI can warn if the Decision plan later
 * drifts. Pure — pass `seededAt` for deterministic tests.
 *
 * @param {object} decisionSettings - the committed Decision settings
 * @param {object} [currentStress={}] - existing Stress settings to overlay onto
 * @param {string} [seededAt] - ISO timestamp (injected for testability)
 * @returns {object} new Stress settings
 */
export function seedStressFromDecision(decisionSettings, currentStress = {}, seededAt = new Date().toISOString()) {
  const d = decisionSettings || {};
  return {
    ...getDefaultStressSettings(),
    ...currentStress,
    // shared plan basics from the Decision plan
    equityMin: d.equityMin,
    bondMin: d.bondMin,
    cashTarget: d.cashTarget,
    duration: d.duration,
    baseSalary: d.baseSalary,
    spStartDate: d.spStartDate ?? currentStress.spStartDate ?? null,
    spWeeklyAmount: d.spWeeklyAmount ?? currentStress.spWeeklyAmount ?? 0,
    consecutiveLimit: d.consecutiveLimit,
    recoveryBuffer: d.recoveryBuffer,
    disableProtection: d.disableProtection ?? currentStress.disableProtection ?? false,
    // protection unit: Decision percent → Stress multiplier (20 → 0.8)
    protectionEscalateMonths: d.protectionEscalateMonths ?? currentStress.protectionEscalateMonths ?? 12,
    protectionMult: d.protectionFactor != null
      ? 1 - d.protectionFactor / 100
      : (currentStress.protectionMult ?? SIMULATION_DEFAULTS.PROTECTION_MULTIPLIER),
    // ISA pot
    isaBalance: d.isaBalance ?? 0,
    isaReturn: d.isaReturn ?? ISA_DEFAULTS.RETURN,
    isaMin: d.isaMin ?? ISA_DEFAULTS.MIN,
    isaDrawdownStrategy: d.isaDrawdownStrategy ?? ISA_DEFAULTS.DRAWDOWN_STRATEGY,
    // The full allocation picture — tagged funds ARE the allocation in own-funds mode, and the
    // glide/spending choices are part of the plan being copied (previously missed: the copy
    // brought only the headline numbers across).
    taggedFunds: (d.taggedFunds || []).map((f) => ({ ...f })),
    allocMode: d.allocMode ?? currentStress.allocMode,
    subAsset: d.subAsset ?? null,
    diversifierStart: d.diversifierStart ?? 0,
    glideEndgame: d.glideEndgame ?? null,
    equityGlideEnabled: d.equityGlideEnabled ?? false,
    spendingProfile: d.spendingProfile ?? currentStress.spendingProfile ?? 'flat',
    accessMethod: d.accessMethod ?? currentStress.accessMethod ?? 'drawdown',
    ufplsYears: d.ufplsYears ?? currentStress.ufplsYears ?? null,
    ufplsThenPcls: d.ufplsThenPcls ?? currentStress.ufplsThenPcls ?? false,
    bandFillRecycle: d.bandFillRecycle ?? currentStress.bandFillRecycle ?? false,
    // Taxable sleeve + windfalls travel with the plan in both directions.
    taxableStart: d.taxableStart ?? currentStress.taxableStart ?? 0,
    taxableMix: d.taxableMix ?? currentStress.taxableMix ?? 'equity',
    giaTaxBand: d.giaTaxBand ?? currentStress.giaTaxBand ?? 'basic',
    bedAndIsa: d.bedAndIsa ?? currentStress.bedAndIsa ?? true,
    relevantEarnings: d.relevantEarnings ?? currentStress.relevantEarnings ?? 0,
    windfalls: Array.isArray(d.windfalls) ? d.windfalls.map((w) => ({ ...w })) : (currentStress.windfalls || []),
    // provenance for the drift banner / re-sync
    seededFrom: 'decision',
    seededAt,
    decisionChecksum: simpleHash(d)
  };
}

/**
 * Seed DECISION settings from the Stress Tester's current settings — the reverse direction:
 * "I've found a plan that survives the stress tests; run the Decision Tool on these settings."
 * Mirrors seedStressFromDecision, converting the protection unit back (multiplier → percent).
 * Does NOT set `locked` — the user still reviews and saves (which locks as usual).
 * @param {object} stressSettings
 * @param {object} [currentDecision={}] - existing Decision settings to overlay onto
 * @returns {object} new Decision settings
 */
export function seedDecisionFromStress(stressSettings, currentDecision = {}) {
  const s = stressSettings || {};
  return {
    ...getDefaultDecisionSettings(),
    ...currentDecision,
    equityMin: s.equityMin,
    bondMin: s.bondMin,
    cashTarget: s.cashTarget,
    duration: s.duration,
    baseSalary: s.baseSalary,
    spStartDate: s.spStartDate ?? currentDecision.spStartDate ?? null,
    spWeeklyAmount: s.spWeeklyAmount ?? currentDecision.spWeeklyAmount ?? 0,
    consecutiveLimit: s.consecutiveLimit ?? currentDecision.consecutiveLimit,
    recoveryBuffer: s.recoveryBuffer ?? currentDecision.recoveryBuffer,
    disableProtection: s.disableProtection ?? currentDecision.disableProtection ?? false,
    // protection unit: Stress multiplier → Decision percent (0.8 → 20)
    protectionEscalateMonths: s.protectionEscalateMonths ?? currentDecision.protectionEscalateMonths ?? 12,
    protectionFactor: s.protectionMult != null
      ? Math.round((1 - s.protectionMult) * 100)
      : currentDecision.protectionFactor,
    isaBalance: s.isaBalance ?? 0,
    isaReturn: s.isaReturn ?? ISA_DEFAULTS.RETURN,
    isaMin: s.isaMin ?? ISA_DEFAULTS.MIN,
    isaDrawdownStrategy: s.isaDrawdownStrategy ?? ISA_DEFAULTS.DRAWDOWN_STRATEGY,
    taggedFunds: (s.taggedFunds || []).map((f) => ({ ...f })),
    allocMode: s.allocMode ?? currentDecision.allocMode,
    subAsset: s.subAsset ?? null,
    diversifierStart: s.diversifierStart ?? 0,
    glideEndgame: s.glideEndgame ?? null,
    equityGlideEnabled: s.equityGlideEnabled ?? false,
    spendingProfile: s.spendingProfile ?? currentDecision.spendingProfile ?? 'flat',
    accessMethod: s.accessMethod ?? currentDecision.accessMethod ?? 'drawdown',
    ufplsYears: s.ufplsYears ?? currentDecision.ufplsYears ?? null,
    ufplsThenPcls: s.ufplsThenPcls ?? currentDecision.ufplsThenPcls ?? false,
    bandFillRecycle: s.bandFillRecycle ?? currentDecision.bandFillRecycle ?? false,
    // The plan's strategy travels with the copy. Without this the Decision tool runs pure
    // Pots & Valves against pot floors the user never chose for that strategy (see
    // research/rotation-plan-aug-2026.md, audit item D1).
    strategyId: s.strategyId ?? currentDecision.strategyId ?? 'pots-and-valves',
    strategyParams: s.strategyParams ? { ...s.strategyParams } : (currentDecision.strategyParams || {}),
    incomeShape: s.incomeShape ?? currentDecision.incomeShape ?? null,
    incomeSteps: Array.isArray(s.incomeSteps) ? s.incomeSteps.map((x) => ({ ...x })) : (currentDecision.incomeSteps || null),
    shapeAgeNow: s.shapeAgeNow ?? currentDecision.shapeAgeNow ?? null,
    // The plan's start (6.4.0): the Decision tool's plan year 0 is the Stress plan's first tax year,
    // derived from age today + retirement status. A legacy plan (no age today) leaves it unset and the
    // Decision tool falls back to the first tax year set up.
    firstTaxYear: (s.firstTaxYear > 0 || s.currentAge > 0) ? deriveTiming(s).firstTaxYear : (currentDecision.firstTaxYear ?? null),
    // Taxable sleeve (GIA) + the plan's windfalls: the Decision tool draws the sleeve before the
    // ISA, taxes it, and advises where each lump sum can legally go in its year. An explicit list
    // (like everything above) — a key missing here is silently dropped (audit item D1).
    taxableStart: s.taxableStart ?? currentDecision.taxableStart ?? 0,
    taxableMix: s.taxableMix ?? currentDecision.taxableMix ?? 'equity',
    giaTaxBand: s.giaTaxBand ?? currentDecision.giaTaxBand ?? 'basic',
    bedAndIsa: s.bedAndIsa ?? currentDecision.bedAndIsa ?? true,
    relevantEarnings: s.relevantEarnings ?? currentDecision.relevantEarnings ?? 0,
    windfalls: Array.isArray(s.windfalls) ? s.windfalls.map((w) => ({ ...w })) : (currentDecision.windfalls || []),
    configured: true,   // a full copy IS a configuration — routing can go straight to the tool
    seededFrom: 'stress'
  };
}

/**
 * Default tax years object for a new scenario
 */
export function getDefaultTaxYears() {
  return {};
}

/**
 * Default budget object for a new scenario (net-first budgeting tool, Stage 0)
 */
export function getDefaultBudget() {
  return defaultBudget();
}

/**
 * Create a default scenario object
 * @param {string} name - Scenario name
 * @param {string} description - Scenario description
 * @param {string[]} enabledTools - Enabled tools array
 * @returns {object} Default scenario
 */
export function defaultStrategyBlock(lockedAt = new Date().toISOString()) {
  return { id: 'pots-and-valves', params: {}, lockedAt, engineVersion: ENGINE_VERSION };
}

/**
 * Phase B migration: scenarios created before the strategy schema get the incumbent strategy
 * stamped, lockedAt = migration time (per the brief). In-memory always; persisted with the
 * scenario's next save — no forced write storm on load.
 */
export function ensureStrategyBlock(scenario) {
  if (scenario && !scenario.strategy) {
    scenario.strategy = defaultStrategyBlock();
  }
  return scenario;
}

export function getDefaultScenario(name = 'My Plan', description = '', enabledTools = ['stress', 'decision']) {
  return {
    // The saved-plan schema version (6.15.0, ./schema.js). At the ROOT — never inside a settings map, so it
    // never enters decisionSettingsChecksum. New plans, duplicates and partner plans are born current.
    schemaVersion: SCHEMA_VERSION,
    planDetails: { name, description },
    enabledTools,
    isActive: true,
    // Phase B (strategy brief §3): every plan locks exactly one strategy. New plans start on
    // the incumbent; changing strategy is an explicit unlock/clone, never a silent edit.
    strategy: defaultStrategyBlock(),
    decisionTool: {
      settings: getDefaultDecisionSettings(),
      history: [],
      taxYears: getDefaultTaxYears()
    },
    stressTool: {
      // Fund and platform charges (6.19.0): every new plan — "+ New plan", the setup wizard, a partner plan, a demo or
      // guest plan, a plan made from a V7 answer — starts at the default, 0.5% a year. A Stress setting only.
      // How the ISA and savings grow (6.22.0): every new plan starts "Mostly cash". A Stress setting only — never in
      // getDefaultStressSettings, which is merged under stored plans and would hand it to a locked one.
      settings: { ...getDefaultStressSettings(), chargesPct: DEFAULT_CHARGES_PCT, isaGrowth: DEFAULT_ISA_GROWTH }
    },
    budgetTool: {
      settings: getDefaultBudget()
    }
  };
}

/**
 * Unlocking a plan that was locked before charges were added (6.19.0, D2): it then gets the default, as every unlocked
 * plan has, so its figures from now on take the charge off. Returns the Stress-settings patch to save, or null when the
 * plan already carries a valid charge (0 included). Pure.
 * @param {object} stressSettings
 * @returns {{ chargesPct: number }|null}
 */
export function chargesPatchOnUnlock(stressSettings) {
  return isChargesPct(stressSettings && stressSettings.chargesPct) ? null : { chargesPct: DEFAULT_CHARGES_PCT };
}

/**
 * Everything unlocking writes into a plan locked before a setting existed (6.22.0): the default charge (6.19.0, D2) and
 * "Mostly cash" for a plan with no choice of how its ISA grows (owner D4) — the defaults every unlocked plan has. One
 * Stress-settings patch, or null when the plan already carries both. Pure.
 * @returns {{ chargesPct?: number, isaGrowth?: string }|null}
 */
export function unlockPatchesOf(stressSettings) {
  const patch = { ...(chargesPatchOnUnlock(stressSettings) || {}), ...(isIsaGrowth(stressSettings && stressSettings.isaGrowth) ? {} : { isaGrowth: DEFAULT_ISA_GROWTH }) };
  return Object.keys(patch).length ? patch : null;
}

/**
 * The charge an unlocked COPY is written with (6.19.0, D7): the original's effective value, explicitly — a copy of a
 * plan locked before charges gets 0, so it reproduces the original's figures and the 0 is there to see and change.
 * @param {object} stressSettings - the original's
 * @returns {number}
 */
export function chargesForCopy(stressSettings) {
  return chargesPctOf(stressSettings);
}

/** Locked (the planner's own flag) — the readers that hand out the default charge must know. */
const isLockedScenario = (scenario) => !!(scenario && scenario.decisionTool && scenario.decisionTool.settings && scenario.decisionTool.settings.locked);

// ============================================================================
// SCENARIO CRUD
// ============================================================================

/**
 * List all scenarios (metadata only from cache or Firestore)
 * @returns {Promise<object[]>} Array of scenarios
 */
export async function listScenariosAsync() {
  if (cachedScenarios) {
    return cachedScenarios;
  }

  if (!isFirebaseAvailable()) {
    return [];
  }

  try {
    const scenarios = await loadAllScenarios();
    scenarios.forEach(ensureStrategyBlock);
    scenarios.forEach(rememberStored);
    cachedScenarios = scenarios;
    return scenarios;
  } catch (error) {
    console.error('Error listing scenarios:', error);
    return [];
  }
}

/**
 * Get the active scenario (full data)
 * @returns {Promise<object|null>} Active scenario or null
 */
export async function getActiveScenarioAsync() {
  if (cachedActiveScenario) {
    return cachedActiveScenario;
  }

  if (!isFirebaseAvailable()) {
    return null;
  }

  try {
    const scenarios = await listScenariosAsync();
    const active = scenarios.find(s => s.isActive);

    if (active) {
      cachedActiveScenario = active;
      return active;
    }

    return null;
  } catch (error) {
    console.error('Error getting active scenario:', error);
    return null;
  }
}

/**
 * True when the plan was saved by a NEWER version of the app than this code — a tab left open across a
 * deploy (6.15.0). Every save of such a plan is refused (saveScenario throws a PlanNewerThanAppError and
 * writes nothing); the shell shows "This plan was updated by a newer version of the app — reload the page".
 * Synchronous, so a banner can ask on every render: with no argument it answers for the active plan as last
 * loaded (false when nothing is loaded). A save that discovers it (the stored copy moved on after this tab
 * loaded it) flips it to true.
 * @param {object} [scenario] - a loaded scenario; default: the active plan
 * @returns {boolean}
 */
export function isPlanNewerThanApp(scenario = cachedActiveScenario) {
  if (!scenario || typeof scenario !== 'object') return false;
  return isNewerSchema(scenario) || (scenario.id != null && isScenarioNewerThanApp(scenario.id));
}

/**
 * Get the active scenario ID
 * @returns {Promise<string|null>}
 */
export async function getActiveScenarioId() {
  const active = await getActiveScenarioAsync();
  return active?.id || null;
}

/**
 * Create a new scenario and optionally set it as active
 * @param {string} name - Scenario name
 * @param {string} description - Scenario description
 * @param {string[]} enabledTools - Enabled tools
 * @param {object} overrides - Optional settings overrides { stressSettings, decisionSettings, taxYears }
 * @param {boolean} setActive - Whether to set as active (default true)
 * @returns {Promise<string>} New scenario ID
 */
export async function createNewScenario(name, description, enabledTools, overrides = {}, setActive = true) {
  if (!isFirebaseAvailable()) {
    throw new Error('Must be logged in to create scenarios');
  }

  const scenario = getDefaultScenario(name, description, enabledTools);

  // Apply overrides (using new nested structure)
  if (overrides.stressSettings) {
    scenario.stressTool.settings = { ...scenario.stressTool.settings, ...overrides.stressSettings };
  }
  if (overrides.decisionSettings) {
    scenario.decisionTool.settings = { ...scenario.decisionTool.settings, ...overrides.decisionSettings };
  }
  if (overrides.taxYears) {
    scenario.decisionTool.taxYears = overrides.taxYears;
  }

  scenario.isActive = setActive;

  // If setting as active, deactivate others first
  if (setActive && cachedScenarios) {
    const currentActive = cachedScenarios.find(s => s.isActive);
    if (currentActive) {
      await setActiveScenarioDoc(null);
      await saveScenario(currentActive.id, { isActive: false });
    }
  }

  const scenarioId = await createScenario(scenario);

  // Invalidate cache so next load picks up the new scenario
  invalidateScenarioCache();

  return scenarioId;
}

/**
 * Switch to a different active scenario
 * @param {string} scenarioId - Scenario to activate
 * @returns {Promise<void>}
 */
export async function switchScenario(scenarioId) {
  if (!isFirebaseAvailable()) {
    throw new Error('Must be logged in to switch scenarios');
  }

  await setActiveScenarioDoc(scenarioId);
  invalidateScenarioCache();
}

/**
 * Duplicate an existing scenario with a new name
 * @param {string} scenarioId - Scenario to duplicate
 * @param {string} newName - Name for the copy
 * @returns {Promise<string>} New scenario ID
 */
export async function duplicateScenario(scenarioId, newName, { carryHistory = true } = {}) {
  if (!isFirebaseAvailable()) {
    throw new Error('Must be logged in to duplicate scenarios');
  }

  const source = await loadScenario(scenarioId);
  if (!source) {
    throw new Error('Source scenario not found');
  }

  const { id, createdAt, lastModified, ...data } = source;
  data.planDetails = { ...data.planDetails, name: newName };
  data.isActive = false;
  // The copy is the same person: the holdings record (what they actually hold) travels with it, so the
  // copy's Transition tool and Accumulation planner have a ledger from the start. Normalised so an old
  // record is written back in today's shape (6.13.0).
  if (data.holdings) data.holdings = normaliseHoldings(data.holdings);
  // A copy starts as a DRAFT: nothing has been recorded against the copy's settings yet, even if
  // the history came along (it is kept for reference and shows as "under previous settings" once
  // the settings diverge). The plan of record is rebuilt when the copy locks.
  if (data.decisionTool) {
    data.decisionTool = { ...data.decisionTool };
    data.decisionTool.settings = { ...(data.decisionTool.settings || {}), locked: false };
    delete data.decisionTool.settings.lockedAt; delete data.decisionTool.settings.lockedBy;
    delete data.decisionTool.planOfRecord; delete data.decisionTool.planOfRecordArchive;
    delete data.planDocument; delete data.planDocumentArchive;   // the copy writes its own when it locks
    if (!carryHistory) data.decisionTool.history = [];
    // A copy that carries records is depended on from the moment it exists — lock it (no plan of
    // record yet; it is rebuilt on the copy's first save).
    const hasRecords = (data.decisionTool.history || []).length > 0 || Object.values(data.decisionTool.taxYears || {}).some((t) => t && t.yearSetupComplete);
    if (hasRecords) { data.decisionTool.settings.locked = true; data.decisionTool.settings.lockedAt = new Date().toISOString(); data.decisionTool.settings.lockedBy = 'copied with records'; }
  }
  // Fund and platform charges (6.19.0, D7): an UNLOCKED copy of a plan with no setting (one locked before charges) gets
  // the original's effective value written, 0 — the copy reproduces the original's figures, and the 0 is visible and
  // changeable in Settings. How the ISA grows (6.22.0, owner D3): such a copy is a new plan, so it starts "Mostly cash" —
  // the original's fixed 3% is not one of the two choices. A copy that is locked (it carries records) is left as the
  // original was.
  const copySt = data.stressTool && typeof data.stressTool === 'object' && data.stressTool.settings && typeof data.stressTool.settings === 'object' ? data.stressTool.settings : null;
  if (copySt && !isLockedScenario(data)) {
    const patch = { ...(isChargesPct(copySt.chargesPct) ? {} : { chargesPct: chargesForCopy(copySt) }), ...(isIsaGrowth(copySt.isaGrowth) ? {} : { isaGrowth: DEFAULT_ISA_GROWTH }) };
    if (Object.keys(patch).length) data.stressTool = { ...data.stressTool, settings: { ...copySt, ...patch } };
  }

  const newId = await createScenario(data);
  invalidateScenarioCache();
  return newId;
}

/**
 * Rename a scenario
 * @param {string} scenarioId - Scenario to rename
 * @param {string} newName - New name
 * @returns {Promise<void>}
 */
export async function renameScenario(scenarioId, newName) {
  if (!isFirebaseAvailable()) {
    throw new Error('Must be logged in to rename scenarios');
  }

  await saveScenario(scenarioId, { 'planDetails.name': newName });
  invalidateScenarioCache();
}

/**
 * Update a scenario's description
 * @param {string} scenarioId - Scenario to update
 * @param {string} description - New description
 * @returns {Promise<void>}
 */
export async function updateScenarioDescription(scenarioId, description) {
  if (!isFirebaseAvailable()) {
    throw new Error('Must be logged in to update scenarios');
  }

  await saveScenario(scenarioId, { 'planDetails.description': description });
  invalidateScenarioCache();
}

/**
 * Update a scenario's enabled tools
 * @param {string} scenarioId - Scenario to update
 * @param {string[]} enabledTools - New enabled tools array
 * @returns {Promise<void>}
 */
export async function updateScenarioTools(scenarioId, enabledTools) {
  if (!isFirebaseAvailable()) {
    throw new Error('Must be logged in to update scenarios');
  }

  await saveScenario(scenarioId, { enabledTools });
  invalidateScenarioCache();
}

/**
 * Delete a scenario
 * @param {string} scenarioId - Scenario to delete
 * @returns {Promise<void>}
 */
export async function deleteScenario(scenarioId) {
  if (!isFirebaseAvailable()) {
    throw new Error('Must be logged in to delete scenarios');
  }

  // Don't allow deleting the last scenario
  const scenarios = await listScenariosAsync();
  if (scenarios.length <= 1) {
    throw new Error('Cannot delete the last scenario');
  }

  // If deleting the active scenario, activate another one
  const scenario = scenarios.find(s => s.id === scenarioId);
  if (scenario?.isActive) {
    const other = scenarios.find(s => s.id !== scenarioId);
    if (other) {
      await setActiveScenarioDoc(other.id);
    }
  }

  await deleteScenarioDoc(scenarioId);
  invalidateScenarioCache();
}

// ============================================================================
// SETTINGS ACCESS (convenience methods for the active scenario)
// ============================================================================

/**
 * Get stress settings from the active scenario
 * @returns {Promise<object>} Stress settings
 */
export async function getActiveStressSettings() {
  const scenario = await getActiveScenarioAsync();
  if (scenario?.stressTool?.settings) return scenario.stressTool.settings;
  // No Stress settings saved yet: the defaults — with the default fund and platform charge and "Mostly cash" only when
  // the plan is not locked (6.19.0, 6.22.0); a locked plan without settings keeps running without charges, its ISA at 3%.
  return scenario && !isLockedScenario(scenario) ? { ...getDefaultStressSettings(), chargesPct: DEFAULT_CHARGES_PCT, isaGrowth: DEFAULT_ISA_GROWTH } : getDefaultStressSettings();
}

/**
 * Save stress settings to the active scenario
 * @param {object} settings - Updated stress settings
 * @returns {Promise<void>}
 */
export async function saveActiveStressSettings(settings) {
  const scenario = await getActiveScenarioAsync();
  if (!scenario) {
    throw new Error('No active scenario');
  }
  // A locked plan's settings are frozen (6.20.2): only the named bookkeeping keys may change (services/LockedPlanGuard.js).
  refuseIfLocked(scenario, 'stress', settings);

  await saveGuardedWrite(scenario.id, { 'stressTool.settings': settings });
  storedOf(scenario).stress = copyOf(settings);

  // Update cache
  if (cachedActiveScenario) {
    if (!cachedActiveScenario.stressTool) cachedActiveScenario.stressTool = {};
    cachedActiveScenario.stressTool.settings = settings;
  }
}

/**
 * Is the active plan locked, as stored? (The planner's own flag, decisionTool.settings.locked.) False with no plan open.
 * @returns {Promise<boolean>}
 */
export async function activePlanLocked() {
  const scenario = await getActiveScenarioAsync();
  return !!scenario && isLockedSettings(storedOf(scenario).decision);
}

/**
 * The active plan's settings exactly as stored (a copy), never the copy in memory that readers adjust: 'stress' or
 * 'decision'. Undefined when the plan has none saved (or no plan is open).
 * @param {'stress'|'decision'} kind
 */
export async function storedActiveSettings(kind) {
  const scenario = await getActiveScenarioAsync();
  return scenario ? copyOf(storedOf(scenario)[kind]) : undefined;
}

/**
 * Throws PlanLockedError (and writes nothing) when saving `settings` as the active plan's `kind` settings would change
 * a locked plan — for a caller that writes more than the settings in one go and must refuse before any of it.
 */
export async function assertActiveSettingsWritable(kind, settings) {
  const scenario = await getActiveScenarioAsync();
  if (scenario) refuseIfLocked(scenario, kind, settings);
}

/**
 * Get decision settings from the active scenario
 * @returns {Promise<object>} Decision settings
 */
export async function getActiveDecisionSettings() {
  const scenario = await getActiveScenarioAsync();
  return scenario?.decisionTool?.settings || getDefaultDecisionSettings();
}

/**
 * Save decision settings to the active scenario
 * @param {object} settings - Updated decision settings
 * @returns {Promise<void>}
 */
export async function saveActiveDecisionSettings(settings) {
  const scenario = await getActiveScenarioAsync();
  if (!scenario) {
    throw new Error('No active scenario');
  }
  // A locked plan's settings are frozen (6.20.2): the unlock only (services/LockedPlanGuard.js).
  refuseIfLocked(scenario, 'decision', settings);

  await saveGuardedWrite(scenario.id, { 'decisionTool.settings': settings });
  storedOf(scenario).decision = copyOf(settings);

  // Update cache
  if (cachedActiveScenario) {
    if (!cachedActiveScenario.decisionTool) cachedActiveScenario.decisionTool = {};
    cachedActiveScenario.decisionTool.settings = settings;
  }
}

/**
 * Get the budget from the active scenario
 * @returns {Promise<object>} Budget object
 */
export async function getActiveBudget() {
  const scenario = await getActiveScenarioAsync();
  return scenario?.budgetTool?.settings || getDefaultBudget();
}

/**
 * Save the budget to the active scenario
 * @param {object} budget - Updated budget object
 * @returns {Promise<void>}
 */
export async function saveActiveBudget(budget) {
  const scenario = await getActiveScenarioAsync();
  if (!scenario) {
    throw new Error('No active scenario');
  }

  await saveScenario(scenario.id, { 'budgetTool.settings': budget });

  // Update cache
  if (cachedActiveScenario) {
    if (!cachedActiveScenario.budgetTool) cachedActiveScenario.budgetTool = {};
    cachedActiveScenario.budgetTool.settings = budget;
  }
}

/**
 * Accumulation tool settings on the active scenario (pre-retirement contributions projection).
 */
export async function getActiveAccumulation() {
  const scenario = await getActiveScenarioAsync();
  return scenario?.accumulationTool?.settings || {};
}

/**
 * Plan of record: the drawdown + glidepath projection frozen at the moment the Decision plan
 * was locked — a yardstick that doesn't move. Stored OUTSIDE decisionTool.settings so it never
 * participates in the settings checksum (adding it there would orphan saved decisions).
 */
export async function getActivePlanOfRecord() {
  const scenario = await getActiveScenarioAsync();
  return scenario?.decisionTool?.planOfRecord || null;
}

export async function saveActivePlanOfRecord(planOfRecord) {
  const scenario = await getActiveScenarioAsync();
  if (!scenario) throw new Error('No active scenario');
  await saveScenario(scenario.id, { 'decisionTool.planOfRecord': planOfRecord });
  if (cachedActiveScenario) {
    if (!cachedActiveScenario.decisionTool) cachedActiveScenario.decisionTool = {};
    cachedActiveScenario.decisionTool.planOfRecord = planOfRecord;
  }
}

/** On unlock: move the current plan of record into a short archive (last 10) and clear it. */
export async function archivePlanOfRecord() {
  const scenario = await getActiveScenarioAsync();
  if (!scenario) throw new Error('No active scenario');
  const por = scenario.decisionTool?.planOfRecord || null;
  const archive = Array.isArray(scenario.decisionTool?.planOfRecordArchive) ? scenario.decisionTool.planOfRecordArchive.slice(-9) : [];
  if (por) archive.push({ ...por, archivedAt: new Date().toISOString() });
  await saveScenario(scenario.id, { 'decisionTool.planOfRecordArchive': archive, 'decisionTool.planOfRecord': null });
  if (cachedActiveScenario && cachedActiveScenario.decisionTool) { cachedActiveScenario.decisionTool.planOfRecordArchive = archive; cachedActiveScenario.decisionTool.planOfRecord = null; }
}

/**
 * Plan document (6.5.0): the plan as it was when it was locked — timeline, steps, strategy verdict,
 * pots, assumptions — kept as the historical yardstick the user reads each month. Stored at the
 * scenario root (outside both settings objects, so no checksum moves). Unlock archives it (last 10).
 */
export async function getActivePlanDocument() {
  const scenario = await getActiveScenarioAsync();
  return scenario?.planDocument || null;
}
export async function getActivePlanDocumentArchive() {
  const scenario = await getActiveScenarioAsync();
  return Array.isArray(scenario?.planDocumentArchive) ? scenario.planDocumentArchive : [];
}
export async function saveActivePlanDocument(doc) {
  const scenario = await getActiveScenarioAsync();
  if (!scenario) throw new Error('No active scenario');
  await saveScenario(scenario.id, { planDocument: doc });
  if (cachedActiveScenario) cachedActiveScenario.planDocument = doc;
}
export async function archivePlanDocument() {
  const scenario = await getActiveScenarioAsync();
  if (!scenario) throw new Error('No active scenario');
  const doc = scenario.planDocument || null;
  const archive = Array.isArray(scenario.planDocumentArchive) ? scenario.planDocumentArchive.slice(-9) : [];
  if (doc) archive.push({ ...doc, archivedAt: new Date().toISOString() });
  await saveScenario(scenario.id, { planDocumentArchive: archive, planDocument: null });
  if (cachedActiveScenario) { cachedActiveScenario.planDocumentArchive = archive; cachedActiveScenario.planDocument = null; }
}

/**
 * Journey (6.6.0): the plan's stage changes with dates — "saving → approaching → committed → running".
 * The stage itself is derived on every load (services/LifeStage.js); only the history of changes is kept.
 */
export async function getActiveJourney() {
  const scenario = await getActiveScenarioAsync();
  return Array.isArray(scenario?.journey) ? scenario.journey : [];
}
export async function saveActiveJourney(journey) {
  const scenario = await getActiveScenarioAsync();
  if (!scenario) throw new Error('No active scenario');
  await saveScenario(scenario.id, { journey });
  if (cachedActiveScenario) cachedActiveScenario.journey = journey;
}

/**
 * Accumulation history (6.7.0): one light record a month while still saving — the pot by wrapper.
 * No recommendation attached; read against the locked projection by whereAmI.
 */
export async function getActiveAccumulationHistory() {
  const scenario = await getActiveScenarioAsync();
  return Array.isArray(scenario?.accumulationTool?.history) ? scenario.accumulationTool.history : [];
}
export async function saveActiveAccumulationHistory(history) {
  const scenario = await getActiveScenarioAsync();
  if (!scenario) throw new Error('No active scenario');
  const list = (Array.isArray(history) ? history : []).slice().sort((a, b) => String(a.date).localeCompare(String(b.date))).slice(-600);
  await saveScenario(scenario.id, { 'accumulationTool.history': list });
  if (cachedActiveScenario) { if (!cachedActiveScenario.accumulationTool) cachedActiveScenario.accumulationTool = {}; cachedActiveScenario.accumulationTool.history = list; }
  return list;
}

/** Transition tick-offs (6.8.0): { [moveKey]: 'YYYY-MM-DD' } — which buys/sells the user says are placed. */
export async function getActiveTransition() {
  const scenario = await getActiveScenarioAsync();
  return scenario?.transition && typeof scenario.transition === 'object' ? scenario.transition : { done: {} };
}
export async function saveActiveTransition(transition) {
  const scenario = await getActiveScenarioAsync();
  if (!scenario) throw new Error('No active scenario');
  await saveScenario(scenario.id, { transition });
  if (cachedActiveScenario) cachedActiveScenario.transition = transition;
}

/**
 * Holdings record (6.13.0): what the person ACTUALLY holds — the one ledger for the Transition tool, the
 * Accumulation planner, the plan document's holdings snapshot and the retire sweep. Stored at the scenario
 * root (services/HoldingsRecord.js has the shape). It is never derived from the Stress tester's `taggedFunds`:
 * that list is a strategy input — the funds a strategy is tested on are not assumed to be what the person
 * holds (owner's ruling, 16 Sep 2026). Absent → the empty record, not a fallback.
 */
export async function getActiveHoldings() {
  const scenario = await getActiveScenarioAsync();
  return scenario && scenario.holdings && typeof scenario.holdings === 'object' ? normaliseHoldings(scenario.holdings) : emptyHoldings();
}
export async function saveActiveHoldings(record) {
  const scenario = await getActiveScenarioAsync();
  if (!scenario) throw new Error('No active scenario');
  const holdings = normaliseHoldings(record);   // every field present, null not undefined — Firestore-safe
  await saveScenario(scenario.id, { holdings });
  if (cachedActiveScenario) cachedActiveScenario.holdings = holdings;
  return holdings;
}

/** Switch the active plan's strategy (a switch, not a lock). Refused on a locked plan (6.20.2): its strategy is part of it. */
export async function setActiveStrategy(id, params = {}) {
  const scenario = await getActiveScenarioAsync();
  if (!scenario) throw new Error('No active scenario');
  if (isLockedSettings(storedOf(scenario).decision)) throw new PlanLockedError(['strategy']);
  const block = { id, params, lockedAt: new Date().toISOString(), engineVersion: ENGINE_VERSION };
  await saveGuardedWrite(scenario.id, { strategy: block });
  if (cachedActiveScenario) cachedActiveScenario.strategy = block;
  return block;
}

export async function getActiveStrategy() {
  const scenario = await getActiveScenarioAsync();
  return (scenario && scenario.strategy) || defaultStrategyBlock();
}

/**
 * Household pairing: which OTHER scenario is the partner's plan (couples view).
 * Stored on the active scenario; null = no partner selected.
 */
export async function getHouseholdPartnerId() {
  const scenario = await getActiveScenarioAsync();
  return scenario?.household?.partnerScenarioId || null;
}

/** Persist the partner-plan selection on the active scenario. */
export async function setHouseholdPartnerId(partnerScenarioId) {
  const scenario = await getActiveScenarioAsync();
  if (!scenario) throw new Error('No active scenario');
  await saveScenario(scenario.id, { 'household.partnerScenarioId': partnerScenarioId || null });
  if (cachedActiveScenario) {
    if (!cachedActiveScenario.household) cachedActiveScenario.household = {};
    cachedActiveScenario.household.partnerScenarioId = partnerScenarioId || null;
  }
}

/** Save accumulation settings to the active scenario. */
export async function saveActiveAccumulation(settings) {
  const scenario = await getActiveScenarioAsync();
  if (!scenario) throw new Error('No active scenario');
  await saveScenario(scenario.id, { 'accumulationTool.settings': settings });
  if (cachedActiveScenario) {
    if (!cachedActiveScenario.accumulationTool) cachedActiveScenario.accumulationTool = {};
    cachedActiveScenario.accumulationTool.settings = settings;
  }
}

/**
 * Get tax years from the active scenario
 * @returns {Promise<object>} Tax years object
 */
export async function getActiveTaxYears() {
  const scenario = await getActiveScenarioAsync();
  return scenario?.decisionTool?.taxYears || getDefaultTaxYears();
}

/**
 * Save tax years to the active scenario
 * @param {object} taxYears - Updated tax years
 * @returns {Promise<void>}
 */
export async function saveActiveTaxYears(taxYears) {
  const scenario = await getActiveScenarioAsync();
  if (!scenario) {
    throw new Error('No active scenario');
  }

  await saveScenario(scenario.id, { 'decisionTool.taxYears': taxYears });

  // Update cache
  if (cachedActiveScenario) {
    if (!cachedActiveScenario.decisionTool) cachedActiveScenario.decisionTool = {};
    cachedActiveScenario.decisionTool.taxYears = taxYears;
  }
}

/**
 * Get history from the active scenario
 * @returns {Promise<object[]>} History array
 */
export async function getActiveHistory() {
  const scenario = await getActiveScenarioAsync();
  return scenario?.decisionTool?.history || [];
}

/**
 * Save history to the active scenario
 * @param {object[]} history - Updated history array
 * @returns {Promise<void>}
 */
export async function saveActiveHistory(history) {
  const scenario = await getActiveScenarioAsync();
  if (!scenario) {
    throw new Error('No active scenario');
  }

  await saveScenario(scenario.id, { 'decisionTool.history': history });

  // Update cache
  if (cachedActiveScenario) {
    if (!cachedActiveScenario.decisionTool) cachedActiveScenario.decisionTool = {};
    cachedActiveScenario.decisionTool.history = history;
  }
}

/**
 * Get enabled tools for the active scenario
 * @returns {Promise<string[]>} Enabled tools array
 */
export async function getActiveEnabledTools() {
  const scenario = await getActiveScenarioAsync();
  return scenario?.enabledTools || ['stress', 'decision'];
}
