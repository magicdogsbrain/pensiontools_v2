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

import { isFirebaseConfigured, isLoggedIn } from '../firebase/index.js';
import {
  loadAllScenarios,
  loadScenario,
  saveScenario,
  createScenario,
  deleteScenarioDoc,
  setActiveScenarioDoc
} from '../firebase/FirestoreService.js';
import { DRAWDOWN_DEFAULTS, TAX_DEFAULTS, SIMULATION_DEFAULTS } from '../constants.js';

// In-memory cache
// Cache is valid until explicitly invalidated (login/logout/wipe/scenario switch)
let cachedScenarios = null;
let cachedActiveScenario = null;

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
}

// ============================================================================
// DEFAULT SETTINGS
// ============================================================================

/**
 * Default stress settings for a new scenario
 */
export function getDefaultStressSettings() {
  return {
    equityMin: DRAWDOWN_DEFAULTS.EQUITY_MIN,
    bondMin: DRAWDOWN_DEFAULTS.BOND_MIN,
    cashTarget: DRAWDOWN_DEFAULTS.CASH_TARGET,
    duration: DRAWDOWN_DEFAULTS.DURATION_YEARS,
    baseSalary: DRAWDOWN_DEFAULTS.BASE_SALARY,
    other: 0,
    statePension: 12000,
    statePensionYear: 12,
    pa: TAX_DEFAULTS.PERSONAL_ALLOWANCE,
    brl: TAX_DEFAULTS.BASIC_RATE_LIMIT,
    hrl: TAX_DEFAULTS.HIGHER_RATE_LIMIT,
    taxMode: 'inflates',
    protectionMult: SIMULATION_DEFAULTS.PROTECTION_MULTIPLIER,
    consecutiveLimit: DRAWDOWN_DEFAULTS.CONSECUTIVE_LIMIT,
    disableProtection: false,
    hodlEnabled: SIMULATION_DEFAULTS.HODL_ENABLED,
    hodlValue: SIMULATION_DEFAULTS.HODL_VALUE
  };
}

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
    statePensionYear: 0
  };
}

/**
 * Default tax years object for a new scenario
 */
export function getDefaultTaxYears() {
  return {};
}

/**
 * Create a default scenario object
 * @param {string} name - Scenario name
 * @param {string} description - Scenario description
 * @param {string[]} enabledTools - Enabled tools array
 * @returns {object} Default scenario
 */
export function getDefaultScenario(name = 'My Plan', description = '', enabledTools = ['stress', 'decision']) {
  return {
    planDetails: { name, description },
    enabledTools,
    isActive: true,
    decisionTool: {
      settings: getDefaultDecisionSettings(),
      history: [],
      taxYears: getDefaultTaxYears()
    },
    stressTool: {
      settings: getDefaultStressSettings()
    }
  };
}

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
export async function duplicateScenario(scenarioId, newName) {
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
  return scenario?.stressTool?.settings || getDefaultStressSettings();
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

  await saveScenario(scenario.id, { 'stressTool.settings': settings });

  // Update cache
  if (cachedActiveScenario) {
    if (!cachedActiveScenario.stressTool) cachedActiveScenario.stressTool = {};
    cachedActiveScenario.stressTool.settings = settings;
  }
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

  await saveScenario(scenario.id, { 'decisionTool.settings': settings });

  // Update cache
  if (cachedActiveScenario) {
    if (!cachedActiveScenario.decisionTool) cachedActiveScenario.decisionTool = {};
    cachedActiveScenario.decisionTool.settings = settings;
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
