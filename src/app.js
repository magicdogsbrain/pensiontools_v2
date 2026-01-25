/**
 * Pension Tools Application
 * Main entry point for the refactored application
 *
 * Version 6.0 - Single advice output with ISA top-up logic
 */

// Services
import {
  calculateDecision,
  calculateDecisionAsync,
  saveDecision,
  getDecisionSummary,
  formatAdvice
} from './services/DecisionService.js';

import {
  runMonteCarlo,
  runHistorical,
  runScenario,
  analyzeResults,
  optimizeAllocation
} from './services/SimulationEngine.js';

import {
  generateDrawdownSchedule
} from './services/DrawdownService.js';

import {
  generateGlidepathSchedule
} from './services/GlidepathService.js';

// Storage
import {
  loadDecisionDB,
  loadDecisionDBAsync,
  saveDecisionDB,
  getDecisionSettings,
  getDecisionSettingsAsync,
  saveDecisionSettings,
  getTaxYearConfig,
  getTaxYearConfigAsync,
  saveTaxYearConfig,
  getAllTaxYears,
  getAllTaxYearsAsync,
  getHistory,
  getHistoryAsync,
  addHistoryRecord,
  invalidateCache
} from './storage/DecisionRepository.js';

import {
  loadStressDB,
  loadStressDBAsync,
  saveStressDB,
  getStressSettings,
  getStressSettingsAsync,
  saveStressSettings,
  createSimulationConfigFromSettings
} from './storage/StressRepository.js';

// UI
import {
  renderDecisionPanel,
  buildDecisionHTML,
  getDecisionPanelStyles
} from './ui/components/DecisionPanel.js';

import {
  initTaxYearWizard,
  checkWizardNeeded,
  showWizard as showTaxYearWizard,
  hideWizard as hideTaxYearWizard,
  getTaxYearWizardStyles
} from './ui/components/TaxYearSetupWizard.js';

// Utils
import {
  getTaxYear,
  getCurrentMonth,
  getRemainingTaxYearMonths
} from './utils/DateUtils.js';

import {
  formatCurrency,
  formatPercent,
  formatDate
} from './utils/FormatUtils.js';

// Constants
import { VERSION, SCENARIOS } from './constants.js';

/**
 * Application state
 */
const AppState = {
  currentDecision: null,
  hasUnsavedChanges: false,
  activeTab: 'decision'
};

/**
 * Initializes the application
 */
export async function initApp() {
  console.log(`Pension Tools v${VERSION} initializing...`);

  // Inject styles
  injectStyles();

  // Load data asynchronously
  const decisionDB = await loadDecisionDBAsync();
  const stressDB = await loadStressDBAsync();

  // Set up event listeners
  setupEventListeners();

  // Render initial state
  renderApp();

  console.log('App initialized');
}

/**
 * Injects CSS styles into the document
 */
function injectStyles() {
  const styleId = 'pension-tools-styles';
  if (document.getElementById(styleId)) return;

  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = getDecisionPanelStyles();
  document.head.appendChild(style);
}

/**
 * Sets up event listeners
 */
function setupEventListeners() {
  // Tab switching
  document.querySelectorAll('[data-tab]').forEach(tab => {
    tab.addEventListener('click', () => switchTab(tab.dataset.tab));
  });

  // Form submissions will be handled by individual form handlers
}

/**
 * Switches active tab
 * @param {string} tabId - Tab identifier
 */
function switchTab(tabId) {
  AppState.activeTab = tabId;

  // Update tab buttons
  document.querySelectorAll('[data-tab]').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.tab === tabId);
  });

  // Update tab content
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.toggle('hidden', content.id !== `${tabId}-content`);
  });
}

/**
 * Renders the application
 */
function renderApp() {
  // This would be called to refresh the entire app state
}

/**
 * Calculates and displays a decision (async to ensure fresh Firebase data)
 * @param {object} params - Input parameters { date, equity, bond, cash, isaBalance }
 * @returns {Promise<object>} The calculated decision
 */
export async function runDecision(params) {
  try {
    // Use async version to ensure fresh data from Firebase
    const decision = await calculateDecisionAsync(params);
    AppState.currentDecision = decision;

    // Render to output container
    const container = document.getElementById('decisionOutput');
    if (container) {
      renderDecisionPanel(decision, container);
    }

    return decision;
  } catch (error) {
    console.error('Decision calculation error:', error);
    showError('Failed to calculate decision: ' + error.message);
    return null;
  }
}

/**
 * Saves the current decision to history
 */
export function saveCurrentDecision() {
  if (!AppState.currentDecision) {
    showError('No decision to save');
    return false;
  }

  try {
    saveDecision(AppState.currentDecision);
    AppState.hasUnsavedChanges = true;
    showSuccess('Decision saved to history');
    return true;
  } catch (error) {
    console.error('Save error:', error);
    showError('Failed to save decision: ' + error.message);
    return false;
  }
}

/**
 * Runs Monte Carlo simulation with current settings
 * @param {object} overrides - Optional config overrides
 * @param {object} preloadedSettings - Optional pre-loaded settings (to avoid cache issues in loops)
 */
export function runMonteCarloSimulation(overrides = {}, preloadedSettings = null) {
  const config = createSimulationConfigFromSettings(overrides, preloadedSettings);
  const results = runMonteCarlo(config);
  const stats = analyzeResults(results);

  return { results, stats, config };
}

/**
 * Runs historical simulation with current settings
 * @param {object} overrides - Optional config overrides
 * @param {object} preloadedSettings - Optional pre-loaded settings (to avoid cache issues in loops)
 */
export function runHistoricalSimulation(overrides = {}, preloadedSettings = null) {
  const config = createSimulationConfigFromSettings(overrides, preloadedSettings);
  const results = runHistorical(config);
  const stats = analyzeResults(results);

  return { results, stats, config };
}

/**
 * Runs all predefined scenarios
 * @param {object} overrides - Optional config overrides
 */
export function runAllScenarios(overrides = {}) {
  const config = createSimulationConfigFromSettings(overrides);
  const results = {};

  for (const [key, scenario] of Object.entries(SCENARIOS)) {
    results[key] = {
      ...scenario,
      result: runScenario(config, scenario)
    };
  }

  return results;
}

/**
 * Generates a drawdown schedule projection
 * @param {number} years - Years to project
 * @returns {Promise<Array>} Drawdown schedule
 */
export async function getDrawdownProjection(years = 35) {
  const settings = await getStressSettingsAsync();
  return generateDrawdownSchedule(settings, years);
}

/**
 * Generates a glidepath schedule projection
 * @param {number} years - Years to project
 * @returns {Promise<Array>} Glidepath schedule
 */
export async function getGlidepathProjection(years = 35) {
  const settings = await getStressSettingsAsync();
  return generateGlidepathSchedule(settings);
}

/**
 * Shows an error message
 * @param {string} message - Error message
 */
function showError(message) {
  // Could be replaced with a toast notification system
  console.error(message);
  alert(message);
}

/**
 * Shows a success message
 * @param {string} message - Success message
 */
function showSuccess(message) {
  console.log(message);
  // Could show a toast notification
}


// Export everything for use in the HTML
export {
  // Services
  calculateDecision,
  calculateDecisionAsync,
  saveDecision,
  getDecisionSummary,
  runMonteCarlo,
  runHistorical,
  runScenario,
  analyzeResults,
  generateDrawdownSchedule,
  generateGlidepathSchedule,

  // Storage
  loadDecisionDBAsync,
  saveDecisionDB,
  getDecisionSettings,
  getDecisionSettingsAsync,
  saveDecisionSettings,
  getTaxYearConfig,
  getTaxYearConfigAsync,
  saveTaxYearConfig,
  getAllTaxYears,
  getAllTaxYearsAsync,
  getHistory,
  getHistoryAsync,
  getStressSettings,
  getStressSettingsAsync,
  saveStressSettings,
  invalidateCache,

  // Utils
  getTaxYear,
  getCurrentMonth,
  getRemainingTaxYearMonths,
  formatCurrency,
  formatPercent,
  formatDate,

  // UI
  renderDecisionPanel,
  getDecisionPanelStyles,

  // Tax Year Wizard
  initTaxYearWizard,
  checkWizardNeeded,
  showTaxYearWizard,
  hideTaxYearWizard,
  getTaxYearWizardStyles,

  // Constants
  VERSION
};
