/**
 * Decision Service
 * Main orchestrator for monthly drawdown decisions
 *
 * This service brings together all the components to produce a single
 * unified recommendation based on the new ISA top-up logic.
 */

import { createDecision, createAlert, AlertSeverity, decisionToHistory } from '../models/Decision.js';
import { calculateDrawdownRecommendation } from './DrawdownService.js';
import { calculateAllGlidepaths, calculateCumulativeInflation, checkGlidepathStatus, calculateProportionalDraw } from './GlidepathService.js';
import { checkProtectionStatus, determineWithdrawalSource, recommendRebalancing } from './ProtectionService.js';
import { getTaxYear, getElapsedTaxYearMonths, getRemainingTaxYearMonths, parseMonth } from '../utils/DateUtils.js';
import {
  getDecisionSettings,
  getDecisionSettingsAsync,
  getTaxYearConfig,
  getTaxYearConfigAsync,
  getTaxYearHistory,
  addHistoryRecord,
  getAllTaxYears,
  getAllTaxYearsAsync,
  recalculateIsaSavingsUsed
} from '../storage/DecisionRepository.js';

/**
 * Calculates a complete monthly decision
 *
 * This is the main entry point that produces a single recommendation
 * following the new logic:
 *
 * 1. If SIPP + Other would exceed BRL but ISA is available:
 *    - Cap SIPP + Other at BRL
 *    - Use ISA as top-up to reach target net income
 *
 * 2. If sufficient ISA for remaining tax year months:
 *    - Tax-efficient mode is active
 *    - Tax boost is available
 *
 * 3. If insufficient ISA for remaining months:
 *    - NOT tax-efficient mode
 *    - Draw to Target Gross Salary (may exceed BRL)
 *    - Tax boost can still apply
 *
 * @param {object} params - Input parameters
 * @returns {object} Complete decision with single recommendation
 */
export function calculateDecision(params) {
  const {
    date,           // YYYY-MM format or Date
    equity,         // Current equity fund value
    bond,           // Current bond fund value
    cash,           // Current cash fund value
    isaBalance = 0  // Current ISA balance
  } = params;

  // Load settings
  const settings = getDecisionSettings();

  // Parse date and determine context
  const dateObj = typeof date === 'string' ? parseMonth(date) : date;
  const dateStr = typeof date === 'string' ? date : date.toISOString().slice(0, 7);
  const taxYear = getTaxYear(dateObj);
  const taxYearConfig = getTaxYearConfig(taxYear);

  // Get history for this tax year
  const priorHistory = getTaxYearHistory(taxYear);

  // Calculate cumulative ISA used EXCLUDING the current month (if it exists in history)
  // This prevents double-counting when recalculating the same month
  const existingMonthRecord = priorHistory.find(h => h.date === dateStr);
  const existingMonthIsa = existingMonthRecord?.isa || 0;
  const cumulativeIsaExcludingCurrentMonth = Math.max(0, (taxYearConfig.isaSavingsUsed || 0) - existingMonthIsa);

  // Calculate year number based on tax years recorded
  // This is more accurate than date-based calculation as it reflects actual usage
  const allTaxYears = getAllTaxYears();
  const sortedTaxYears = Object.keys(allTaxYears).sort();
  const yearNumber = sortedTaxYears.indexOf(taxYear);
  // If current tax year isn't in the list yet, it's year 0 or we use the count
  const effectiveYearNumber = yearNumber >= 0 ? yearNumber : sortedTaxYears.length;

  // Calculate cumulative inflation from CPI of each tax year
  const yearlyInflation = sortedTaxYears.slice(0, effectiveYearNumber + 1).map(ty => {
    const config = allTaxYears[ty];
    return config?.cpi || 0.04;
  });
  const cumulativeInflation = calculateCumulativeInflation(yearlyInflation);

  // Calculate glidepath minimums
  const glidepaths = calculateAllGlidepaths(settings, effectiveYearNumber, cumulativeInflation);

  // Check protection status
  const protectionStatus = checkProtectionStatus({
    equity,
    bond,
    cash,
    adjEquityMin: glidepaths.equity,
    adjBondMin: glidepaths.bond,
    adjCashTarget: glidepaths.cash,
    priorHistory,
    consecutiveLimit: settings.consecutiveLimit,
    recoveryBuffer: settings.recoveryBuffer
  });

  // Calculate drawdown recommendation (NEW UNIFIED LOGIC)
  // State pension comes from decision settings (base value in today's money)
  // statePensionYear is the original setting, but we calculate effective years
  // based on how many tax years have been recorded
  const baseStatePensionYear = settings.statePensionYear || 12;
  // Effective years remaining = original setting minus years already elapsed
  const effectiveStatePensionYear = Math.max(0, baseStatePensionYear - effectiveYearNumber);

  const recommendation = calculateDrawdownRecommendation({
    equity,
    bond,
    cash,
    isaBalance,
    baseSalary: settings.baseSalary,
    cumulativeInflation,
    yearlyInflation,
    other: taxYearConfig.other,
    statePension: settings.statePension || 0,
    statePensionYear: baseStatePensionYear,  // Use original setting - DrawdownService compares to yearNumber
    yearNumber: effectiveYearNumber,
    pa: taxYearConfig.pa,
    brl: taxYearConfig.brl,
    hrl: taxYearConfig.hrl,
    taxMode: settings.taxMode || 'inflates',
    currentDate: dateObj,
    taxYearHistory: priorHistory,
    inProtection: protectionStatus.inProtection,
    protectionFactor: settings.protectionFactor,
    adjEquityMin: glidepaths.equity,
    adjBondMin: glidepaths.bond,
    // Year-level ISA parameters from wizard
    isTaxEfficientYear: taxYearConfig.isTaxEfficient !== false,
    yearlyIsaSavingsAllocation: taxYearConfig.isaSavingsAllocation || 0,
    cumulativeIsaSavingsUsed: cumulativeIsaExcludingCurrentMonth,  // Excludes current month to prevent double-counting
    grossIncomeToDate: taxYearConfig.grossIncomeToDate || 0
  });

  // Determine withdrawal source
  const withdrawalSource = determineWithdrawalSource({
    drawAmount: recommendation.monthlySipp + recommendation.boostAmount,
    equity,
    bond,
    cash,
    adjEquityMin: glidepaths.equity,
    adjBondMin: glidepaths.bond,
    adjCashTarget: glidepaths.cash,
    inProtection: protectionStatus.inProtection
  });

  // Check for rebalancing needs
  const rebalanceActions = recommendRebalancing({
    equity,
    bond,
    cash,
    adjEquityMin: glidepaths.equity,
    adjBondMin: glidepaths.bond,
    adjCashTarget: glidepaths.cash,
    inProtection: protectionStatus.inProtection
  });

  // Build alerts
  const alerts = buildAlerts({
    recommendation,
    protectionStatus,
    glidepaths,
    funds: { equity, bond, cash },
    withdrawalSource
  });

  // Build complete decision (sync version)
  const decision = createDecision({
    // Context
    date: dateStr,
    taxYear,
    yearNumber: effectiveYearNumber,
    monthInTaxYear: getElapsedTaxYearMonths(dateObj),
    remainingMonths: getRemainingTaxYearMonths(dateObj),

    // Fund values
    equity,
    bond,
    cash,
    isa: isaBalance,

    // Glidepath minimums
    adjEquityMin: glidepaths.equity,
    adjBondMin: glidepaths.bond,
    adjCashTarget: glidepaths.cash,

    // Tax thresholds
    pa: recommendation.taxInfo.pa,
    brl: recommendation.taxInfo.brl,
    hrl: recommendation.taxInfo.hrl,

    // Income sources (monthly)
    other: recommendation.monthlyOther,
    statePension: recommendation.monthlyState,

    // Recommended draws (THE SINGLE RECOMMENDATION)
    sippDraw: recommendation.monthlySipp + recommendation.boostAmount,
    isaDraw: recommendation.monthlyIsa,
    totalMonthlyNet: recommendation.monthlyNet,

    // Tax efficiency
    taxEfficient: recommendation.mode === 'tax-efficient',
    annualTaxableSoFar: recommendation.taxInfo.annualTaxable,
    headroomToBRL: recommendation.taxInfo.headroomToBRL,

    // Protection status
    inProtection: protectionStatus.inProtection,
    protectionReason: protectionStatus.reason,
    consecutiveCashDraws: protectionStatus.consecutiveCashDraws,

    // Tax boost
    boostAmount: recommendation.boostAmount,
    boostEligible: recommendation.taxBoostEligible,

    // Withdrawal source
    source: withdrawalSource.source,
    drawFromEquity: withdrawalSource.fromEquity,
    drawFromBond: withdrawalSource.fromBond,
    drawFromCash: withdrawalSource.fromCash,

    // Rebalancing
    rebalanceNeeded: rebalanceActions.length > 0,
    rebalanceActions: rebalanceActions.map(a => a.action),

    // Alerts
    alerts,

    // Year-level ISA/Savings tracking
    yearlyIsaSavingsAllocation: recommendation.yearlyIsaSavingsAllocation,
    cumulativeIsaSavingsUsed: recommendation.newCumulativeIsaSavingsUsed,  // After this month's draw
    isTaxEfficientYear: recommendation.isTaxEfficientYear,

    // Tax tracking
    taxPaidYTD: recommendation.taxInfo.taxPaidYTD || 0,
    taxProjectedAnnual: recommendation.taxInfo.taxProjectedAnnual || 0,
    taxSavedMonthly: recommendation.taxInfo.taxSavedMonthly || 0,
    taxSavedYTD: recommendation.taxInfo.taxSavedYTD || 0,
    taxSavedProjectedAnnual: recommendation.taxInfo.taxSavedAnnual || 0,

    // Protection-induced efficiency
    protectionInducedTaxEfficiency: recommendation.protectionInducedTaxEfficiency || false,

    // Debug/calculation details
    calculationDetails: {
      mode: recommendation.mode,
      reason: recommendation.reason,
      isaNeededMonthly: recommendation.isaNeededMonthly,
      totalIsaNeeded: recommendation.totalIsaNeeded,
      hasSufficientIsa: recommendation.hasSufficientIsa,
      cumulativeInflation,
      yearlyInflation,
      glidepaths,
      protectionStatus,
      taxInfo: recommendation.taxInfo
    }
  });

  return decision;
}

/**
 * Calculates a complete monthly decision (async version)
 * Ensures fresh data from Firebase before calculating.
 *
 * @param {object} params - Input parameters
 * @returns {Promise<object>} Complete decision with single recommendation
 */
export async function calculateDecisionAsync(params) {
  const {
    date,           // YYYY-MM format or Date
    equity,         // Current equity fund value
    bond,           // Current bond fund value
    cash,           // Current cash fund value
    isaBalance = 0  // Current ISA balance
  } = params;

  // Load settings asynchronously to ensure fresh data
  const settings = await getDecisionSettingsAsync();

  // Parse date and determine context
  const dateObj = typeof date === 'string' ? parseMonth(date) : date;
  const dateStr = typeof date === 'string' ? date : date.toISOString().slice(0, 7);
  const taxYear = getTaxYear(dateObj);
  const taxYearConfig = await getTaxYearConfigAsync(taxYear);

  // Get history for this tax year
  const priorHistory = getTaxYearHistory(taxYear);

  // Calculate cumulative ISA used EXCLUDING the current month (if it exists in history)
  // This prevents double-counting when recalculating the same month
  const existingMonthRecord = priorHistory.find(h => h.date === dateStr);
  const existingMonthIsa = existingMonthRecord?.isa || 0;
  const cumulativeIsaExcludingCurrentMonth = Math.max(0, (taxYearConfig.isaSavingsUsed || 0) - existingMonthIsa);

  // Calculate year number based on tax years recorded
  const allTaxYears = await getAllTaxYearsAsync();
  const sortedTaxYears = Object.keys(allTaxYears).sort();
  const yearNumber = sortedTaxYears.indexOf(taxYear);
  const effectiveYearNumber = yearNumber >= 0 ? yearNumber : sortedTaxYears.length;

  // Calculate cumulative inflation from CPI of each tax year
  const yearlyInflation = sortedTaxYears.slice(0, effectiveYearNumber + 1).map(ty => {
    const config = allTaxYears[ty];
    return config?.cpi || 0.04;
  });
  const cumulativeInflation = calculateCumulativeInflation(yearlyInflation);

  // Calculate glidepath minimums
  const glidepaths = calculateAllGlidepaths(settings, effectiveYearNumber, cumulativeInflation);

  // Check protection status
  const protectionStatus = checkProtectionStatus({
    equity,
    bond,
    cash,
    adjEquityMin: glidepaths.equity,
    adjBondMin: glidepaths.bond,
    adjCashTarget: glidepaths.cash,
    priorHistory,
    consecutiveLimit: settings.consecutiveLimit,
    recoveryBuffer: settings.recoveryBuffer
  });

  // Calculate drawdown recommendation
  const baseStatePensionYear = settings.statePensionYear || 12;
  const effectiveStatePensionYear = Math.max(0, baseStatePensionYear - effectiveYearNumber);

  const recommendation = calculateDrawdownRecommendation({
    equity,
    bond,
    cash,
    isaBalance,
    baseSalary: settings.baseSalary,
    cumulativeInflation,
    yearlyInflation,
    other: taxYearConfig.other,
    statePension: settings.statePension || 0,
    statePensionYear: baseStatePensionYear,
    yearNumber: effectiveYearNumber,
    pa: taxYearConfig.pa,
    brl: taxYearConfig.brl,
    hrl: taxYearConfig.hrl,
    taxMode: settings.taxMode || 'inflates',
    currentDate: dateObj,
    taxYearHistory: priorHistory,
    inProtection: protectionStatus.inProtection,
    protectionFactor: settings.protectionFactor,
    adjEquityMin: glidepaths.equity,
    adjBondMin: glidepaths.bond,
    // Year-level ISA parameters from wizard
    isTaxEfficientYear: taxYearConfig.isTaxEfficient !== false,
    yearlyIsaSavingsAllocation: taxYearConfig.isaSavingsAllocation || 0,
    cumulativeIsaSavingsUsed: cumulativeIsaExcludingCurrentMonth,  // Excludes current month to prevent double-counting
    grossIncomeToDate: taxYearConfig.grossIncomeToDate || 0
  });

  // Determine withdrawal source (async version)
  const withdrawalSource = determineWithdrawalSource({
    drawAmount: recommendation.monthlySipp + recommendation.boostAmount,
    equity,
    bond,
    cash,
    adjEquityMin: glidepaths.equity,
    adjBondMin: glidepaths.bond,
    adjCashTarget: glidepaths.cash,
    inProtection: protectionStatus.inProtection
  });

  // Check for rebalancing needs
  const rebalanceActions = recommendRebalancing({
    equity,
    bond,
    cash,
    adjEquityMin: glidepaths.equity,
    adjBondMin: glidepaths.bond,
    adjCashTarget: glidepaths.cash,
    inProtection: protectionStatus.inProtection
  });

  // Build alerts
  const alerts = buildAlerts({
    recommendation,
    protectionStatus,
    glidepaths,
    funds: { equity, bond, cash },
    withdrawalSource
  });

  // Build complete decision (async version)
  const decision = createDecision({
    date: dateStr,
    taxYear,
    yearNumber: effectiveYearNumber,
    monthInTaxYear: getElapsedTaxYearMonths(dateObj),
    remainingMonths: getRemainingTaxYearMonths(dateObj),
    equity,
    bond,
    cash,
    isa: isaBalance,
    adjEquityMin: glidepaths.equity,
    adjBondMin: glidepaths.bond,
    adjCashTarget: glidepaths.cash,
    pa: recommendation.taxInfo.pa,
    brl: recommendation.taxInfo.brl,
    hrl: recommendation.taxInfo.hrl,
    other: recommendation.monthlyOther,
    statePension: recommendation.monthlyState,
    sippDraw: recommendation.monthlySipp + recommendation.boostAmount,
    isaDraw: recommendation.monthlyIsa,
    totalMonthlyNet: recommendation.monthlyNet,
    taxEfficient: recommendation.mode === 'tax-efficient',
    annualTaxableSoFar: recommendation.taxInfo.annualTaxable,
    headroomToBRL: recommendation.taxInfo.headroomToBRL,
    inProtection: protectionStatus.inProtection,
    protectionReason: protectionStatus.reason,
    consecutiveCashDraws: protectionStatus.consecutiveCashDraws,
    boostAmount: recommendation.boostAmount,
    boostEligible: recommendation.taxBoostEligible,
    source: withdrawalSource.source,
    drawFromEquity: withdrawalSource.fromEquity,
    drawFromBond: withdrawalSource.fromBond,
    drawFromCash: withdrawalSource.fromCash,
    rebalanceNeeded: rebalanceActions.length > 0,
    rebalanceActions: rebalanceActions.map(a => a.action),
    alerts,

    // Year-level ISA/Savings tracking
    yearlyIsaSavingsAllocation: recommendation.yearlyIsaSavingsAllocation,
    cumulativeIsaSavingsUsed: recommendation.newCumulativeIsaSavingsUsed,  // After this month's draw
    isTaxEfficientYear: recommendation.isTaxEfficientYear,

    // Tax tracking
    taxPaidYTD: recommendation.taxInfo.taxPaidYTD || 0,
    taxProjectedAnnual: recommendation.taxInfo.taxProjectedAnnual || 0,
    taxSavedMonthly: recommendation.taxInfo.taxSavedMonthly || 0,
    taxSavedYTD: recommendation.taxInfo.taxSavedYTD || 0,
    taxSavedProjectedAnnual: recommendation.taxInfo.taxSavedAnnual || 0,

    // Protection-induced efficiency
    protectionInducedTaxEfficiency: recommendation.protectionInducedTaxEfficiency || false,

    calculationDetails: {
      mode: recommendation.mode,
      reason: recommendation.reason,
      isaNeededMonthly: recommendation.isaNeededMonthly,
      totalIsaNeeded: recommendation.totalIsaNeeded,
      hasSufficientIsa: recommendation.hasSufficientIsa,
      cumulativeInflation,
      yearlyInflation,
      glidepaths,
      protectionStatus,
      taxInfo: recommendation.taxInfo
    }
  });

  return decision;
}

/**
 * Builds alert messages based on decision state
 */
function buildAlerts(params) {
  const { recommendation, protectionStatus, glidepaths, funds, withdrawalSource } = params;
  const alerts = [];

  // Protection mode alert
  if (protectionStatus.inProtection) {
    alerts.push(createAlert(
      `Protection Mode Active: ${protectionStatus.reason}`,
      AlertSeverity.WARNING,
      'protection-active'
    ));
  }

  // Exiting protection
  if (protectionStatus.canExitProtection) {
    alerts.push(createAlert(
      'Exiting protection mode - growth funds recovered',
      AlertSeverity.SUCCESS,
      'protection-exit'
    ));
  }

  // Insufficient ISA warning
  if (recommendation.warning) {
    alerts.push(createAlert(
      recommendation.warning,
      AlertSeverity.WARNING,
      'insufficient-isa'
    ));
  }

  // Tax boost notification
  if (recommendation.boostAmount > 0) {
    alerts.push(createAlert(
      `Tax Boost: +£${Math.round(recommendation.boostAmount).toLocaleString()}/mo (${recommendation.boostReason})`,
      AlertSeverity.INFO,
      'tax-boost'
    ));
  }

  // ISA top-up notification
  if (recommendation.isaUsedForTopUp && recommendation.monthlyIsa > 0) {
    alerts.push(createAlert(
      `Using £${Math.round(recommendation.monthlyIsa).toLocaleString()} ISA top-up to stay tax-efficient`,
      AlertSeverity.INFO,
      'isa-topup'
    ));
  }

  // Low cash warning
  const cashBuffer = funds.cash - glidepaths.cash;
  if (cashBuffer < 0) {
    alerts.push(createAlert(
      `Cash £${Math.round(Math.abs(cashBuffer)).toLocaleString()} below target - consider topping up`,
      AlertSeverity.DANGER,
      'low-cash'
    ));
  }

  // Withdrawal shortfall
  if (withdrawalSource.shortfall > 0) {
    alerts.push(createAlert(
      `Withdrawal shortfall: £${Math.round(withdrawalSource.shortfall).toLocaleString()} could not be covered`,
      AlertSeverity.DANGER,
      'shortfall'
    ));
  }

  return alerts;
}

/**
 * Saves a decision to history
 * @param {object} decision - Decision to save
 * @returns {Promise<void>}
 */
export async function saveDecision(decision) {
  const historyRecord = decisionToHistory(decision);

  // Add standard SIPP for boost calculations
  historyRecord.stdSipp = decision.sippDraw - (decision.boostAmount || 0);

  // Save the history record (this will overwrite if same date exists)
  await addHistoryRecord(historyRecord);

  // Recalculate ISA/Savings usage from all history records for this tax year
  // This ensures accuracy whether it's a new record or an overwrite
  if (decision.taxYear) {
    await recalculateIsaSavingsUsed(decision.taxYear);
  }
}

/**
 * Gets a summary suitable for display
 * @param {object} decision - Decision object
 * @returns {object} Display summary
 */
export function getDecisionSummary(decision) {
  const totalFunds = decision.equity + decision.bond + decision.cash;
  const totalMins = decision.adjEquityMin + decision.adjBondMin + decision.adjCashTarget;

  return {
    // Key recommendation
    sippDraw: decision.sippDraw,
    isaDraw: decision.isaDraw,
    totalMonthlyIncome: decision.totalMonthlyNet,

    // Where to withdraw from
    source: decision.source,
    drawFromEquity: decision.drawFromEquity,
    drawFromBond: decision.drawFromBond,

    // Status indicators
    mode: decision.taxEfficient ? 'Tax-Efficient' : 'Standard',
    inProtection: decision.inProtection,
    hasBoost: decision.boostAmount > 0,

    // Fund health
    totalFunds,
    surplus: totalFunds - totalMins,
    surplusPercent: totalMins > 0 ? ((totalFunds - totalMins) / totalMins * 100).toFixed(1) : 0,

    // Alerts count by severity
    dangerAlerts: decision.alerts.filter(a => a.severity === AlertSeverity.DANGER).length,
    warningAlerts: decision.alerts.filter(a => a.severity === AlertSeverity.WARNING).length,

    // Context
    taxYear: decision.taxYear,
    monthsRemaining: decision.remainingMonths
  };
}

/**
 * Formats decision as advice text
 * @param {object} decision - Decision object
 * @returns {string} Formatted advice text
 */
export function formatAdvice(decision) {
  const lines = [];

  // Main recommendation
  lines.push(`SIPP Withdrawal: £${decision.sippDraw.toFixed(2)}`);

  if (decision.isaDraw > 0) {
    lines.push(`ISA Top-up: £${decision.isaDraw.toFixed(2)}`);
  }

  lines.push(`Total Monthly Net: £${decision.totalMonthlyNet.toFixed(2)}`);
  lines.push('');

  // Withdrawal source
  lines.push(`Withdraw from: ${decision.source}`);
  if (decision.source === 'Growth') {
    lines.push(`  - Equity: £${decision.drawFromEquity.toFixed(2)}`);
    lines.push(`  - Bond: £${decision.drawFromBond.toFixed(2)}`);
  }
  lines.push('');

  // Mode
  lines.push(`Mode: ${decision.taxEfficient ? 'Tax-Efficient' : 'Standard Draw'}`);
  if (decision.inProtection) {
    lines.push(`Protection: ACTIVE - ${decision.protectionReason}`);
  }
  if (decision.boostAmount > 0) {
    lines.push(`Tax Boost: +£${decision.boostAmount.toFixed(2)}`);
  }

  return lines.join('\n');
}
