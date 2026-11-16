/**
 * Tax Year Wizard Service
 * Handles tax year setup wizard logic including ISA sufficiency calculations.
 *
 * The pure part lives in services/TaxYearSetUp.js since 7.2.0 (the new app's Month by month sets a tax year up with it) and
 * is re-exported here unchanged; this file keeps what reads the repositories.
 */

import { getTaxYear, parseMonth } from '../utils/DateUtils.js';
import { DECISION_ASSUMED_CPI } from './InflationModel.js';
import {
  getTaxYearConfigAsync,
  getDecisionSettingsAsync,
  getAllTaxYearsAsync,
  getStatePensionForTaxYear,
  isYearSetupComplete,
  getHistoryAsync
} from '../storage/DecisionRepository.js';
import { getActiveStressSettings } from '../storage/ScenarioRepository.js';
import { wizardDataFrom } from './TaxYearSetUp.js';

export * from './TaxYearSetUp.js';

/**
 * Checks if the Tax Year Setup Wizard should be shown
 *
 * The wizard is triggered when:
 * 1. User calculates a decision for a month in a tax year that hasn't been set up
 *
 * @param {string} selectedMonth - Month selected in decision tool (YYYY-MM format)
 * @returns {Promise<object>} { showWizard: boolean, taxYear: string, isApril: boolean, reason: string }
 */
export async function shouldShowWizard(selectedMonth) {
  const dateObj = parseMonth(selectedMonth);
  const taxYear = getTaxYear(dateObj);
  const month = dateObj.getMonth() + 1; // 1-indexed

  // Check if year setup is complete
  const isComplete = await isYearSetupComplete(taxYear);

  if (isComplete) {
    return {
      showWizard: false,
      taxYear,
      isApril: month === 4,
      reason: 'Year setup already complete'
    };
  }

  return {
    showWizard: true,
    taxYear,
    isApril: month === 4,
    reason: `Tax year ${taxYear} has not been set up`
  };
}

/**
 * Gets the previous tax year's CPI for salary suggestion
 *
 * @param {string} taxYear - Current tax year in 'YY/YY' format
 * @returns {Promise<number>} Previous year's CPI (defaults to 0.025 if not found)
 */
export async function getPreviousYearCpi(taxYear) {
  const allTaxYears = await getAllTaxYearsAsync();
  const sortedTaxYears = Object.keys(allTaxYears).sort();

  const currentIndex = sortedTaxYears.indexOf(taxYear);

  // If there's a previous year, get its CPI
  if (currentIndex > 0) {
    const prevYear = sortedTaxYears[currentIndex - 1];
    return allTaxYears[prevYear]?.cpi || DECISION_ASSUMED_CPI;
  }

  // No previous year, use default
  return DECISION_ASSUMED_CPI;
}

/**
 * Gets all data needed for the wizard
 *
 * @param {string} selectedMonth - Selected month in YYYY-MM format
 * @returns {Promise<object>} Wizard initialization data
 */
export async function getWizardData(selectedMonth) {
  const taxYear = getTaxYear(parseMonth(selectedMonth));
  const settings = await getDecisionSettingsAsync();
  let stressSettings = null; try { stressSettings = await getActiveStressSettings(); } catch (e) { stressSettings = null; }
  // the records, for the share of each payment that is tax-free (7.12.0: the month's own rule, FlexibleAccess.taxFreeFractionOf)
  let history = []; try { history = await getHistoryAsync({ limit: 1000 }); } catch (e) { history = []; }
  const ctx = wizardDataFrom(selectedMonth, { settings, stressSettings, existingConfig: await getTaxYearConfigAsync(taxYear), allTaxYears: await getAllTaxYearsAsync(), statePensionInfo: await getStatePensionForTaxYear(taxYear), history });
  // the plan's own State Pension a year, so the line says "no amount" only when the plan holds none
  const w = +(stressSettings && stressSettings.spWeeklyAmount) || +(settings && settings.spWeeklyAmount) || 0;
  ctx.planSpYearly = +(settings && settings.statePension) > 0 ? +settings.statePension : w > 0 ? Math.round(w * 52) : 0;
  return ctx;
}
