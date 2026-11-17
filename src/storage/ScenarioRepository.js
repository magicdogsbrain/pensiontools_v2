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
  isScenarioNewerThanApp,
  loadUserProfile,
  saveUserProfile
} from '../firebase/FirestoreService.js';
import { SCHEMA_VERSION, isNewerSchema } from './schema.js';
import { DRAWDOWN_DEFAULTS, TAX_DEFAULTS, SIMULATION_DEFAULTS, ISA_DEFAULTS } from '../constants.js';
import { simpleHash } from '../utils/MathUtils.js';
import { defaultBudget } from '../services/BudgetModel.js';
import { deriveTiming } from '../services/PlanTiming.js';
import { emptyHoldings, normaliseHoldings } from '../services/HoldingsRecord.js';
import { DEFAULT_CHARGES_PCT, isChargesPct, chargesPctOf } from '../services/Charges.js';
import { DEFAULT_ISA_GROWTH, isIsaGrowth } from '../services/IsaGrowth.js';
import { getDefaultDecisionSettings, seedDecisionFromStress, chargesPatchOnUnlock, unlockPatchesOf, budgetSharedFromOf, BUDGET_OWN_SIDE, ownSideOf, sharedBudgetView, shareBudgetWrite, stopSharingWrite, sharedBudgetWrites } from '../services/PlanCommit.js';
import { getDefaultTaxYears, getDefaultBudget, defaultStrategyBlock as pureDefaultStrategyBlock, getDefaultScenario as pureGetDefaultScenario, strategyOf as pureStrategyOf } from '../services/PlanFromSeed.js';
import { PlanLockedError, lockedWriteRefusal, isLockedSettings, isPlanLockedError, lockedPlanWriteRefusal, phaseWriteRefusal } from '../services/LockedPlanGuard.js';
import { taskPatch } from '../answers/plan/tasks.js';
import { savingPatch } from '../answers/plan/saving.js';
import { accumulationTabPatch } from '../answers/plan/accumulationTab.js';
import { localDay } from '../answers/plan/dates.js';
import { upgradeScenario } from '../firebase/scenarioMigration.js';
import { getDefaultStressSettings } from './stressDefaults.js';
import { onPlanCopyStale, dropStalePlanCopies } from './planCopies.js';
import { cadenceOf, normaliseCadence } from '../services/DrawCadence.js';
import { isExamplePlan } from '../services/GuestPlans.js';
import { OPEN_PLAN_KEY } from '../services/OpenPlace.js';
import { copyOf as planCopyOf } from '../services/PlanCopy.js';
import { withoutPotsAsOf } from '../services/PlanFromToday.js';
import { isClosedPlan, monthRefusal, monthRefusalWords, nextPlanIdOf } from '../services/PlanClosed.js';
import { pensionTodayPatch } from '../services/PensionToday.js';
import { partnerOf } from '../services/HouseholdLink.js';
import { withV7Keys } from '../services/SaverPayIn.js';

/** A closed plan's household is read, not changed (6.56.0, PlanClosed.js): its partner's plan pairs with its successor. */
function refuseClosedHousehold(scenario) {
  if (isClosedPlan(scenario)) throw new PlanLockedError(['household'], { closed: true });
}

// In-memory cache
// Cache is valid until explicitly invalidated (login/logout/wipe/scenario switch)
let cachedScenarios = null;
let cachedActiveScenario = null;
// The plan last open, as the account's settings hold it (7.12.0): read once per cache; undefined: not read yet.
let cachedLastPlanId = undefined;

// "Which plan is open in THIS WINDOW" (6.26, research/v7/your-plan.md 5.5): the preview's "Change this" on a plan that is
// not the account's open plan pins that plan in this window's session storage. Every "which plan is open" read prefers
// the pin while it names a plan in the list; otherwise `isActive`, as always. Nothing is written to any plan, so other
// windows and devices stay on the account's open plan. Choosing a plan from the menu, making a new plan the open one, or
// deleting the pinned plan clears the pin.
function pinnedPlanId() {
  try { return typeof sessionStorage !== 'undefined' ? sessionStorage.getItem(OPEN_PLAN_KEY) : null; } catch (e) { return null; }
}
export function pinPlanInWindow(scenarioId) {
  try { if (scenarioId) sessionStorage.setItem(OPEN_PLAN_KEY, String(scenarioId)); else sessionStorage.removeItem(OPEN_PLAN_KEY); } catch (e) { /* storage refused */ }
}
export function clearPinnedPlan() { pinPlanInWindow(null); }

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
  cachedLastPlanId = undefined;
}

/**
 * The plan a page opens (7.12.0): the plan this window was pinned to; else the plan last open in either view (the
 * account's settings, `lastLocation.planId`) while it is in the account; else the main plan. A closed plan is never landed
 * on while the plan that carries it on is there: that plan opens instead (a window pin, opened on purpose, stays as it is).
 * Pure.
 * @param {object[]} scenarios
 * @param {{ pin?: string|null, lastPlanId?: string|null }} [o]
 */
export function openingPlanOf(scenarios, { pin = null, lastPlanId = null } = {}) {
  const list = Array.isArray(scenarios) ? scenarios.filter(Boolean) : [];
  const byId = (id) => (id ? list.find((s) => s.id === id) || null : null);
  const carriedOn = (s) => {
    let cur = s;
    const seen = new Set();
    while (cur && isClosedPlan(cur) && !seen.has(cur.id)) { seen.add(cur.id); const next = byId(nextPlanIdOf(cur)); if (!next) break; cur = next; }
    return cur;
  };
  const pinned = byId(pin);
  if (pinned) return pinned;
  const last = carriedOn(byId(lastPlanId));
  if (last && !isClosedPlan(last)) return last;
  const main = list.find((s) => s.isActive) || null;
  return main ? carriedOn(main) : null;
}

async function lastPlanIdRead() {
  if (cachedLastPlanId !== undefined) return cachedLastPlanId;
  let id = null;
  try { const p = await loadUserProfile(); id = p && p.lastLocation && typeof p.lastLocation.planId === 'string' ? p.lastLocation.planId : null; } catch (e) { id = null; }
  cachedLastPlanId = id;
  return id;
}

// ============================================================================
// DEFAULT SETTINGS
// ============================================================================

// Default stress settings for a new scenario: in storage/stressDefaults.js since 6.20.2, so the store's lock check
// (FirestoreService.saveScenario) can read what a locked plan with no Stress settings reads, without importing this module.
export { getDefaultStressSettings };

// The default Decision settings, the seed of the Decision tool from the Stress settings, the defaults an unlock writes and
// the shared-budget view live in services/PlanCommit.js since 6.38.0 ("Lock the plan" in the preview: the preview may not
// reach this module, tests/v7/boundaries.test.js rule 3a). Their names are kept here, unchanged, for everything that
// imports them from the repository.
export { getDefaultDecisionSettings, seedDecisionFromStress, chargesPatchOnUnlock, unlockPatchesOf, budgetSharedFromOf, BUDGET_OWN_SIDE, ownSideOf, sharedBudgetView };

// The defaults of a new plan — the tax years, the budget, the strategy block and the default scenario — live in
// services/PlanFromSeed.js since 6.39.0 (the preview makes a plan itself: road-to-7.md step 7). The pure module takes the
// time it stamps; these wrappers read the clock as the originals did, so nothing the planner calls changes.
export { getDefaultTaxYears, getDefaultBudget };

/**
 * Create a default scenario object
 * @param {string} name - Scenario name
 * @param {string} description - Scenario description
 * @param {string[]} enabledTools - Enabled tools array
 * @returns {object} Default scenario
 */
export function defaultStrategyBlock(lockedAt = new Date().toISOString()) {
  return pureDefaultStrategyBlock(lockedAt);
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
  return pureGetDefaultScenario(name, description, enabledTools, new Date().toISOString());
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
    const pin = pinnedPlanId();
    const active = openingPlanOf(scenarios, { pin, lastPlanId: pin ? null : await lastPlanIdRead() });

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
  if (setActive) clearPinnedPlan();

  // If setting as active, deactivate others first
  if (setActive && cachedScenarios) {
    const currentActive = cachedScenarios.find(s => s.isActive);
    if (currentActive) {
      await setActiveScenarioDoc(null);
      await saveScenario(currentActive.id, { isActive: false });
    }
  }

  const scenarioId = await createScenario(scenario);
  // the new plan is the plan last open (7.12.0): either view lands on it next time
  if (setActive) { try { await saveUserProfile({ lastLocation: { planId: scenarioId, step: null } }); } catch (e) { /* the main plan still opens it */ } }

  // Invalidate cache so next load picks up the new scenario
  invalidateScenarioCache();
  if (setActive) cachedLastPlanId = scenarioId;

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

  clearPinnedPlan();
  await setActiveScenarioDoc(scenarioId);   // it also writes lastLocation: the plan last open, in either view (7.12.0)
  invalidateScenarioCache();
  cachedLastPlanId = scenarioId;
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

  // The rules of a copy — the holdings record carried and normalised (6.13.0), the copy a DRAFT unless it carries records
  // (then locked, 'copied with records'), the charges and ISA-growth defaults of an unlocked copy (6.19.0 D7, 6.22.0 D3),
  // the example's read-only flag never carried — live in services/PlanCopy.js (6.44.0: the preview makes copies too).
  const data = planCopyOf(source, newName, { carryHistory, now: new Date() });

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

  if (pinnedPlanId() === scenarioId) clearPinnedPlan();
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
export async function saveActiveStressSettings(given) {
  // The position a reader puts on a locked plan's settings for the engines (PlanFromToday.lockedPotsAsOf) is never saved.
  const settings = withoutPotsAsOf(given);
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

/** Is the active plan the read-only example (GuestPlans.js)? False with no plan open. */
export async function activePlanIsExample() {
  return isExamplePlan(await getActiveScenarioAsync());
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
 * The active plan with its Stress and Decision settings AS STORED (the guard's yardstick above), a copy: what a pure patch
 * that changes a locked plan is worked out on (answers/plan/moveStart.js movePatch) — never the cached object, whose Stress
 * copy may carry the Budget's age folded in. Null with no plan open.
 */
export async function getActiveScenarioAsStored() {
  const scenario = await getActiveScenarioAsync();
  if (!scenario) return null;
  const st = storedOf(scenario);
  const out = copyOf(scenario);
  out.stressTool = { ...(out.stressTool || {}), settings: copyOf(st.stress) };
  out.decisionTool = { ...(out.decisionTool || {}), settings: copyOf(st.decision) };
  if (out.stressTool.settings === undefined) delete out.stressTool.settings;
  if (out.decisionTool.settings === undefined) delete out.decisionTool.settings;
  return out;
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
  const own = scenario?.budgetTool?.settings || getDefaultBudget();
  const from = budgetSharedFromOf(scenario);
  if (!from) return own;
  // One household budget (6.25.0, usability audit decision 5): this plan reads the budget of the plan it points at,
  // keeping only its own side of "who pays" and its own ages.
  let source = null; try { source = await loadScenario(from); } catch (e) { source = null; }
  const theirs = source?.budgetTool?.settings;
  return theirs ? sharedBudgetView(theirs, own, from) : own;
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
  const from = budgetSharedFromOf(scenario);
  if (from && budget) {
    // A shared budget: the lines go to the household's plan, our side of who pays stays here (PlanCommit.sharedBudgetWrites, lifted 6.45.0).
    let source = null; try { source = await loadScenario(from); } catch (e) { source = null; }
    const { holder, own: mine } = sharedBudgetWrites(scenario, source, budget);
    if (holder) await saveScenario(from, { 'budgetTool.settings': holder });
    await saveScenario(scenario.id, { 'budgetTool.settings': mine });
    if (cachedActiveScenario) { if (!cachedActiveScenario.budgetTool) cachedActiveScenario.budgetTool = {}; cachedActiveScenario.budgetTool.settings = mine; }
    return;
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
 * How often you draw (v6 usability audit, decision 4): a preference at `decisionTool.cadence`, OUTSIDE the Decision
 * settings — so it is not in the settings checksum, is changeable on a locked plan, and never relabels a recorded
 * month (services/DrawCadence.js). A plan saved before this change is read through its old `settings.cadence`,
 * which is left as it is; only the new field is ever written.
 */
export async function getActiveDrawCadence() {
  const scenario = await getActiveScenarioAsync();
  return cadenceOf(scenario?.decisionTool);
}
export async function saveActiveDrawCadence(cadence) {
  const scenario = await getActiveScenarioAsync();
  if (!scenario) throw new Error('No active scenario');
  const v = normaliseCadence(cadence);
  await saveScenario(scenario.id, { 'decisionTool.cadence': v });   // DRAW_CADENCE_FIELD, written as a literal so the parity harvest sees it
  if (cachedActiveScenario) {
    if (!cachedActiveScenario.decisionTool) cachedActiveScenario.decisionTool = {};
    cachedActiveScenario.decisionTool.cadence = v;
  }
  return v;
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
  // a plan that carries a closed one on records no month before its first (a saving plan whose change-over is still to come):
  // said in words here, before the store refuses it (PlanClosed.successorRefusal)
  const had = new Set((Array.isArray(scenario.accumulationTool?.history) ? scenario.accumulationTool.history : []).map((r) => r && r.date));
  const shut = list.filter((r) => r && !had.has(r.date)).map((r) => monthRefusal(scenario, r.date)).find((r) => r && r.why === 'before');
  if (shut) throw new Error(monthRefusalWords(shut));
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
 * holds (our ruling, 16 Sep 2026). Absent → the empty record, not a fallback.
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

/**
 * "I accept this risk" and "Withdraw this" (7.7.0, services/PlanAmendments.js): the whole list of what the person agreed to
 * keep against the locked plan, written as ONE field (V7 writes it the same way: answers/plan/keepTest.js amendPatch). It sits
 * beside the settings and the plan document, never in them; the store refuses it on a closed plan (PlanClosed.closedPlanRefusal).
 */
export async function saveActivePlanAmendments(list) {
  const scenario = await getActiveScenarioAsync();
  if (!scenario) throw new Error('No active scenario');
  const planAmendments = Array.isArray(list) ? JSON.parse(JSON.stringify(list)) : [];
  await saveScenario(scenario.id, { planAmendments });
  if (cachedActiveScenario) cachedActiveScenario.planAmendments = planAmendments;
  return planAmendments;
}

/**
 * "This is how I want to hold it" and "Take this back" in the full view (7.12.0, answers/plan/agree.js sayHeldPatch and
 * agreeWithdrawPatch): the whole `phases` root, written as ONE field with the stamp, as V7 writes it. The stored plan is read
 * afresh; refused once a close has passed and on the example plan (LockedPlanGuard.phaseWriteRefusal).
 */
export async function saveActivePhases(phases, { now = new Date() } = {}) {
  const active = await getActiveScenarioAsync();
  if (!active) throw new Error('No active scenario');
  const stored = (await loadScenario(active.id)) || active;
  const clean = phases && typeof phases === 'object' ? JSON.parse(JSON.stringify(phases)) : {};
  const refused = phaseWriteRefusal(stored, { phases: clean }, { now });
  if (refused) throw new PlanLockedError(refused);
  await saveScenario(active.id, { phases: clean });
  if (cachedActiveScenario && cachedActiveScenario.id === active.id) cachedActiveScenario.phases = JSON.parse(JSON.stringify(clean));
  return clean;
}

/**
 * "What you want" from the full view's Accumulation tab (7.12.0): the amount to spend a month from the stop and the age you
 * stop, written as the simple view's What you pay in writes them — answers/plan/saving.js savingPatch on the stored plan,
 * ONE write of its paths with the stamp. Only `want.monthly` and `want.stopAge` are read from `typed`. Returns
 * { ok, errors }; nothing is written when a box has a problem or nothing changed. A locked plan's want is never boxed.
 */
export async function saveActiveWant(typed, { now = new Date() } = {}) {
  const active = await getActiveScenarioAsync();
  if (!active) throw new Error('No active scenario');
  const stored = (await loadScenario(active.id)) || active;
  const plan = upgradeScenario(JSON.parse(JSON.stringify(stored)), { now }).scenario;
  const t = typed || {};
  const p = savingPatch(plan, { 'want.monthly': t['want.monthly'] ?? '', 'want.stopAge': t['want.stopAge'] ?? '' }, { today: localDay(now) });
  if (!p.ok) return { ok: false, errors: p.errors };
  if (!Object.keys(p.patch).length) return { ok: true, errors: {}, written: false };
  await saveScenario(active.id, p.patch);
  invalidateScenarioCache();
  return { ok: true, errors: {}, written: true };
}

/**
 * The × on the classic page's banner (7.10.0; research/v7/replan-nov-2026.md §6.4): a to-do put away on the plan itself, so
 * the new app's home and a partner's device see the same quiet home. The stored plan is read afresh (never the cache: another
 * device may have put something else away since), the one key added (answers/plan/tasks.js taskPatch, "Not now" until next
 * month unless `kind` says 'done'), and the whole `tasks` root written with NO stamp (schema.js TASK_WRITES): a dismissal
 * never reorders "Your plans" or changes a "changed on" line. Refused once a close has passed, and on the example plan
 * (LockedPlanGuard.phaseWriteRefusal). Returns the root written.
 * @param {string} key   the to-do's key (taskKeyOf: its id, and its occurrence when it has one)
 * @param {{ kind?: 'notNow'|'done', now?: Date }} [o]
 */
export async function saveActivePlanTasks(key, { kind = 'notNow', now = new Date() } = {}) {
  const active = await getActiveScenarioAsync();
  if (!active) throw new Error('No active scenario');
  const stored = (await loadScenario(active.id)) || active;
  const { tasks } = taskPatch(stored, key, kind, { at: now });
  const refused = phaseWriteRefusal(stored, { tasks }, { now });
  if (refused) throw new PlanLockedError(refused);
  await saveScenario(active.id, { tasks }, { stamp: false });
  if (cachedActiveScenario && cachedActiveScenario.id === active.id) cachedActiveScenario.tasks = JSON.parse(JSON.stringify(tasks));
  return tasks;
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

/**
 * The plan's strategy, as the one test runs it (6.33.0). The test reads the stress settings' strategyId
 * (stressTest via SimulationConfig: absent = Pots & Valves); the scenario's own strategy block is a second copy that
 * every switch writes too, but plans could carry the two apart — and then the page named one strategy above a figure
 * worked out for another. The id is now the tested one; the block's params are kept only when it names the same
 * strategy. A plan with no stress settings at all reads its block as before. Pure — nothing is written.
 */
export function strategyOf(scenario) {
  return pureStrategyOf(scenario, new Date().toISOString());   // the body is PlanFromSeed.strategyOf since 7.2.0 (the new app's Month by month reads it too)
}

export async function getActiveStrategy() {
  return strategyOf(await getActiveScenarioAsync());
}

/**
 * Household pairing: which OTHER scenario is the partner's plan (couples view).
 * Stored on the active scenario; null = no partner selected.
 */
export async function getHouseholdPartnerId() {
  const scenario = await getActiveScenarioAsync();
  if (!scenario) return null;
  // read either way, never a closed plan (services/HouseholdLink.js, 7.12.0): the simple view's reader
  let list = [];
  try { list = await listScenariosAsync(); } catch (e) { list = []; }
  const partner = partnerOf(list, scenario);
  return partner && partner.id != null ? String(partner.id) : null;
}

/**
 * One budget for the household (6.25.0, decision 5): the partner's plan reads this plan's budget from now on
 * (budgetTool.sharedFrom on the partner's plan). Its side of who pays starts as the complement of ours.
 */
export async function shareBudgetWith(partnerScenarioId) {
  const scenario = await getActiveScenarioAsync();
  if (!scenario || !partnerScenarioId || partnerScenarioId === scenario.id) throw new Error('No partner plan to share with');
  refuseClosedHousehold(scenario);
  const partner = await loadScenario(partnerScenarioId);
  if (!partner) throw new Error('Partner plan not found');
  await saveScenario(partnerScenarioId, shareBudgetWrite(scenario, partner));   // the pure part lives in PlanCommit.js (6.42.0)
  invalidateScenarioCache();
}
/** The partner's plan keeps a separate budget again (its own copy of the lines as last read). */
export async function stopSharingBudget(partnerScenarioId) {
  const partner = await loadScenario(partnerScenarioId);
  if (!partner) return;
  const from = budgetSharedFromOf(partner);
  const source = from ? await loadScenario(from) : null;
  await saveScenario(partnerScenarioId, stopSharingWrite(partner, source));   // the pure part lives in PlanCommit.js (6.42.0)
  invalidateScenarioCache();
}

/** "Keep things as they are" (who draws what, 6.25.0): remembered on this plan for one partner and one state of both plans. */
export async function getHouseholdSplitDismissed() {
  const scenario = await getActiveScenarioAsync();
  return scenario?.household?.splitDismissed || null;
}
export async function setHouseholdSplitDismissed(value) {
  const scenario = await getActiveScenarioAsync();
  if (!scenario) throw new Error('No active scenario');
  refuseClosedHousehold(scenario);
  await saveScenario(scenario.id, { 'household.splitDismissed': value || null });
  if (cachedActiveScenario) {
    if (!cachedActiveScenario.household) cachedActiveScenario.household = {};
    cachedActiveScenario.household.splitDismissed = value || null;
  }
}

/** Persist the partner-plan selection on the active scenario. */
export async function setHouseholdPartnerId(partnerScenarioId) {
  const scenario = await getActiveScenarioAsync();
  if (!scenario) throw new Error('No active scenario');
  refuseClosedHousehold(scenario);
  await saveScenario(scenario.id, { 'household.partnerScenarioId': partnerScenarioId || null });
  if (cachedActiveScenario) {
    if (!cachedActiveScenario.household) cachedActiveScenario.household = {};
    cachedActiveScenario.household.partnerScenarioId = partnerScenarioId || null;
  }
}

/** Save accumulation settings to the active scenario. */
/**
 * The Accumulation tab's Save (7.12.0): the boxes as typed, with the keys only V7 writes kept (SaverPayIn.withV7Keys), and —
 * when the pot today typed is not the one read (services/PensionToday.js) — this month's pot record in the same write, so
 * the newest figure given is the one every screen reads.
 */
export async function saveActiveAccumulationInputs(inputs, now = new Date()) {
  const scenario = await getActiveScenarioAsync();
  if (!scenario) throw new Error('No active scenario');
  const settings = withV7Keys(inputs, scenario.accumulationTool && scenario.accumulationTool.settings);
  const pot = +inputs.potNow > 0 ? pensionTodayPatch(scenario, +inputs.potNow, { now, settings }) : {};
  const history = pot['accumulationTool.history'] || null;
  await saveScenario(scenario.id, { 'accumulationTool.settings': settings, ...(history ? { 'accumulationTool.history': history } : {}) });
  if (cachedActiveScenario) {
    if (!cachedActiveScenario.accumulationTool) cachedActiveScenario.accumulationTool = {};
    cachedActiveScenario.accumulationTool.settings = settings;
    if (history) cachedActiveScenario.accumulationTool.history = history;
  }
}

/**
 * The full view's Accumulation tab as its boxes stand (7.12.0, answers/plan/accumulationTab.js): the ages through About's write,
 * what goes in and the pot today through What you pay in's, ONE write; nothing when the boxes say what is stored. A box with a
 * problem writes nothing and comes back by its id: { ok: false, errors: { acRetireAge: 'stop-before-age' } }.
 */
export async function saveActiveAccumulationTab(boxes, { now = new Date() } = {}) {
  const active = await getActiveScenarioAsync();
  if (!active) throw new Error('No active scenario');
  const stored = (await loadScenario(active.id)) || active;
  const plan = upgradeScenario(JSON.parse(JSON.stringify(stored)), { now }).scenario;
  const p = accumulationTabPatch(plan, boxes, { today: localDay(now) });
  if (!p.ok) return { ok: false, errors: p.errors };
  if (!Object.keys(p.patch).length) return { ok: true, errors: {}, written: false };
  await saveScenario(active.id, p.patch);
  invalidateScenarioCache();
  return { ok: true, errors: {}, written: true };
}

/**
 * A saver's pension typed on Stress tester → Settings is the pension today everywhere (7.12.0; the second walk: the Settings
 * pot moved to £52,000 while the Accumulation tab and the pot at the stop still read £45,000): the same write as the
 * Accumulation tab's pot box (PensionToday.pensionTodayPatch: the saving settings' potNow and this month's pot record).
 * Nothing when it is already the pension today, or the plan is locked.
 */
export async function saveActivePensionToday(value, { now = new Date() } = {}) {
  const active = await getActiveScenarioAsync();
  if (!active) throw new Error('No active scenario');
  const stored = (await loadScenario(active.id)) || active;
  const plan = upgradeScenario(JSON.parse(JSON.stringify(stored)), { now }).scenario;
  if (isLockedSettings(plan.decisionTool && plan.decisionTool.settings)) return { written: false };
  const patch = pensionTodayPatch(plan, value, { now });
  if (!Object.keys(patch).length) return { written: false };
  await saveScenario(active.id, patch);
  invalidateScenarioCache();
  return { written: true };
}

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

