/**
 * Pension Tools Application
 * Main entry point for the refactored application
 *
 * Version 6.0 - Single advice output with ISA top-up logic
 */

// Services
import { saveDecision } from './services/DecisionService.js';
import { longevityAge } from './services/LongevityModel.js';
import { modelPortfolio } from './services/ModelPortfolios.js';
import { contributionBreakdown, contributionWarnings, projectAccumulation, requiredPotForSuccess } from './services/AccumulationEngine.js';
import { getActiveAccumulation, saveActiveAccumulation, getHouseholdPartnerId, setHouseholdPartnerId, getActivePlanOfRecord, saveActivePlanOfRecord, getActiveStrategy, setActiveStrategy } from './storage/ScenarioRepository.js';
import { runHouseholdMonteCarlo, householdIncomeTimeline, runSurvivorCheck, allowanceNudge, runCareCheck } from './services/HouseholdService.js';

import {
  analyzeResults,
  optimizeAllocation
} from './services/SimulationEngine.js';
// Phase B (strategy brief §3): tools obtain their engine from the STRATEGY REGISTRY, keyed by
// the plan's locked strategy — never from the engine modules directly.
import { getStrategy, listStrategies, ENGINE_VERSION } from './strategies/registry.js';
import { runCompare, cannedDecade } from './strategies/compareRunner.js';
import { stressTestStrategy, stressTestAll, planFromSettings, STRATEGY_NAMES, pnvDecadeSeries } from './strategies/stressTest.js';
import { giltLadderSvg, inflationDecadesSvg, GILT_FRAMES } from './ui/giltLadderGraphic.js';
import { floorToAgeSvg, ftaDecadesSvg, FTA_FRAMES } from './ui/floorToAgeGraphic.js';
import { stackedConesSvg, STRATEGY_COLORS, incomeSmallMultiplesSvg, riskBarsSvg, leftBarsSvg } from './ui/comparisonGraphic.js';
import { incomeStaircaseSvg, suggestSteps, amountAtAge as shapeAmountAtAge } from './ui/incomeShapeGraphic.js';
import { ladderRatchetSvg, floorFlexSvg, floorScheduleSvg, potsValvesSvg, LR_FRAMES, FF_FRAMES, FS_FRAMES, PV_FRAMES } from './ui/strategyMachines.js';
import { getRtr } from './strategies/ladderEngine.js';
import { getCpi } from './strategies/ladderEngine.js';
import { orderSheet, realYieldForYear, nominalYieldForYear, loadLiveGilts, dataProvenance, activeLinkers } from './services/LinkerUniverse.js';
import { runLadderWindows, runLadderMonteCarlo } from './strategies/LadderAndRatchet.js';
import { runFlexWindows } from './strategies/FloorAndFlex.js';

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
  decisionSettingsChecksum,
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

import { getBudgetAsync, saveBudget } from './storage/BudgetRepository.js';
import {
  PLSA_2024,
  BUDGET_CATEGORIES,
  starterLines,
  starterOneOffs,
  missingSuggestions,
  typicalMonthlyFor,
  TYPICAL_TIERS,
  PLSA_TIER_LABELS,
  plsaTierOf,
  summariseBudget,
  targetScheduleFromBudget,
  budgetToCsv,
  parseBudgetCsv,
  annualNetAtAge,
  oneOffSchedule,
  grossUpAnnual,
  defaultBudget,
  evalAmountExpr,
  typicalSanityFlag,
  breakdownAnnual,
  DEFAULT_TAX_BANDS
} from './services/BudgetModel.js';

import { grossToNet } from './services/TaxCalculator.js';

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
  const results = getStrategy(config.strategyId).engine.runMonteCarlo(config);
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
  const results = getStrategy(config.strategyId).engine.runHistorical(config);
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
      result: getStrategy(config.strategyId).engine.runScenario(config, scenario)
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
  console.error(message);
  if (typeof window.showToast === 'function') {
    window.showToast(message, 'error');
  }
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
  saveDecision,
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
  decisionSettingsChecksum,
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

  // Budget (net-first budgeting tool, Stage 0)
  getBudgetAsync,
  saveBudget,
  PLSA_2024,
  BUDGET_CATEGORIES,
  starterLines,
  starterOneOffs,
  missingSuggestions,
  typicalMonthlyFor,
  TYPICAL_TIERS,
  PLSA_TIER_LABELS,
  plsaTierOf,
  summariseBudget,
  budgetToCsv,
  parseBudgetCsv,
  longevityAge,
  modelPortfolio,
  contributionBreakdown,
  contributionWarnings,
  projectAccumulation,
  requiredPotForSuccess,
  getActiveAccumulation,
  saveActiveAccumulation,
  getHouseholdPartnerId,
  setHouseholdPartnerId,
  getActivePlanOfRecord,
  saveActivePlanOfRecord,
  getActiveStrategy,
  setActiveStrategy,
  listStrategies,
  runCompare,
  cannedDecade,
  orderSheet,
  stressTestStrategy,
  stressTestAll,
  planFromSettings,
  STRATEGY_NAMES,
  pnvDecadeSeries,
  giltLadderSvg,
  inflationDecadesSvg,
  GILT_FRAMES,
  getCpi,
  floorToAgeSvg,
  ftaDecadesSvg,
  FTA_FRAMES,
  getRtr,
  stackedConesSvg,
  STRATEGY_COLORS,
  incomeSmallMultiplesSvg,
  riskBarsSvg,
  leftBarsSvg,
  incomeStaircaseSvg,
  suggestSteps,
  shapeAmountAtAge,
  ladderRatchetSvg,
  floorFlexSvg,
  floorScheduleSvg,
  potsValvesSvg,
  LR_FRAMES,
  FF_FRAMES,
  FS_FRAMES,
  PV_FRAMES,
  realYieldForYear,
  nominalYieldForYear,
  loadLiveGilts,
  dataProvenance,
  activeLinkers,
  runLadderWindows,
  runLadderMonteCarlo,
  runFlexWindows,
  getStrategy,
  ENGINE_VERSION,
  runHouseholdMonteCarlo,
  householdIncomeTimeline,
  runSurvivorCheck,
  allowanceNudge,
  runCareCheck,
  targetScheduleFromBudget,
  annualNetAtAge,
  oneOffSchedule,
  grossUpAnnual,
  defaultBudget,
  evalAmountExpr,
  typicalSanityFlag,
  breakdownAnnual,
  DEFAULT_TAX_BANDS,
  grossToNet,

  // Constants
  VERSION,
  SCENARIOS
};
