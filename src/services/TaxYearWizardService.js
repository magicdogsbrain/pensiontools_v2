/**
 * Tax Year Wizard Service
 * Handles tax year setup wizard logic including ISA sufficiency calculations
 */

import { getTaxYear, getRemainingTaxYearMonths, parseMonth } from '../utils/DateUtils.js';
import {
  getTaxYearConfigAsync,
  getDecisionSettingsAsync,
  getAllTaxYearsAsync,
  getStatePensionForTaxYear,
  isYearSetupComplete
} from '../storage/DecisionRepository.js';

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
 * Suggests an inflation-adjusted salary based on last year's CPI
 *
 * @param {number} baseSalary - Base salary from settings
 * @param {number} lastYearCpi - CPI from previous tax year (as decimal, e.g., 0.04 for 4%)
 * @returns {number} Suggested salary
 */
export function suggestSalary(baseSalary, lastYearCpi) {
  return baseSalary * (1 + lastYearCpi);
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
    return allTaxYears[prevYear]?.cpi || 0.025;
  }

  // No previous year, use default
  return 0.025;
}

/**
 * Calculates how much ISA/Savings is needed for tax efficiency
 *
 * Target gross represents the income as if it were a fully taxable salary.
 * We calculate the NET income that target would produce, then determine
 * how much tax-free ISA is needed to reach that same NET while staying at BRL.
 *
 * Example: Target £59,450 gross = £48,238 net (after £11,212 tax)
 *          At BRL £50,270 = £42,730 net (after £7,540 tax)
 *          ISA needed = £48,238 - £42,730 = £5,508
 *
 * @param {object} params - Calculation parameters
 * @returns {object} ISA requirement calculation result
 */
export function calculateIsaNeeded(params) {
  const {
    targetAnnualGross,    // Target annual gross salary
    brl,                  // Basic Rate Limit
    pa = 12570,           // Personal Allowance
    other = 0,            // Annual other taxable income
    statePension = 0,     // Annual state pension
    remainingMonths,      // Months remaining in tax year
    grossIncomeToDate = 0 // Income already received before starting pension
  } = params;

  // Helper to calculate tax on gross income
  const calcTax = (gross) => {
    if (gross <= pa) return 0;
    if (gross <= brl) return (gross - pa) * 0.2;
    return (brl - pa) * 0.2 + (gross - brl) * 0.4;
  };

  // Remaining BRL headroom after income-to-date
  const remainingBrlHeadroom = Math.max(0, brl - grossIncomeToDate);

  // If BRL already exhausted, cannot be tax-efficient
  if (remainingBrlHeadroom <= 0) {
    return {
      isaNeeded: 0,
      brlExhausted: true,
      remainingBrlHeadroom: 0,
      maxTaxEfficientSalary: brl,
      reducedSalaryOption: brl,
      canBeTaxEfficient: false,
      reason: 'BRL already exhausted by prior income'
    };
  }

  // If target is at or below BRL, no ISA needed
  if (targetAnnualGross <= brl) {
    return {
      isaNeeded: 0,
      brlExhausted: false,
      remainingBrlHeadroom,
      maxTaxEfficientSalary: brl,
      reducedSalaryOption: brl,
      canBeTaxEfficient: true,
      targetAchievableAtBrl: true,
      reason: 'Target achievable at BRL without ISA'
    };
  }

  // Target exceeds BRL - calculate ISA needed based on NET income difference

  // Net income if we took full target gross (would pay 40% on excess over BRL)
  const taxAtTarget = calcTax(targetAnnualGross);
  const netAtTarget = targetAnnualGross - taxAtTarget;

  // Net income if we stay at BRL (only 20% tax)
  const taxAtBrl = calcTax(brl);
  const netAtBrl = brl - taxAtBrl;

  // ISA needed = the NET shortfall (tax-free supplement to match target net)
  const isaNeededAnnual = Math.max(0, netAtTarget - netAtBrl);

  // Pro-rate for remaining months
  const isaNeeded = (isaNeededAnnual / 12) * remainingMonths;

  return {
    isaNeeded,
    isaNeededAnnual,
    brlExhausted: false,
    remainingBrlHeadroom,
    maxTaxEfficientSalary: brl,
    reducedSalaryOption: brl,
    canBeTaxEfficient: true,
    targetAchievableAtBrl: false,
    netAtTarget,
    netAtBrl,
    taxAtTarget,
    taxAtBrl,
    reason: `Need £${Math.round(isaNeeded).toLocaleString()} ISA/Savings for tax efficiency`
  };
}

/**
 * Validates user's ISA/Savings input against requirement
 *
 * @param {number} isaEntered - Amount user entered
 * @param {number} isaNeeded - Amount needed for tax efficiency
 * @param {boolean} brlExhausted - Whether BRL is already exhausted
 * @returns {object} Validation result with options
 */
export function validateIsaInput(isaEntered, isaNeeded, brlExhausted) {
  if (brlExhausted) {
    return {
      sufficient: false,
      isBrlExhausted: true,
      options: [
        { key: 'reduced', label: 'Reduce salary to BRL', description: 'Accept lower income to stay tax-efficient' },
        { key: 'inefficient', label: 'Accept tax-inefficient year', description: 'Draw full SIPP, pay 40% on excess' }
      ]
    };
  }

  if (isaEntered >= isaNeeded) {
    return {
      sufficient: true,
      isBrlExhausted: false,
      options: []
    };
  }

  // ISA insufficient
  return {
    sufficient: false,
    isBrlExhausted: false,
    shortfall: isaNeeded - isaEntered,
    options: [
      { key: 'increase', label: `Increase ISA to £${Math.round(isaNeeded).toLocaleString()}`, description: 'Provide enough ISA for tax efficiency' },
      { key: 'reduced', label: 'Reduce salary to BRL', description: 'Keep ISA to grow, accept lower income' },
      { key: 'inefficient', label: 'Accept tax-inefficient year', description: 'Draw full SIPP, ISA stays untouched' }
    ]
  };
}

/**
 * Gets all data needed for the wizard
 *
 * @param {string} selectedMonth - Selected month in YYYY-MM format
 * @returns {Promise<object>} Wizard initialization data
 */
export async function getWizardData(selectedMonth) {
  const dateObj = parseMonth(selectedMonth);
  const taxYear = getTaxYear(dateObj);
  const month = dateObj.getMonth() + 1;
  const isApril = month === 4;
  const remainingMonths = getRemainingTaxYearMonths(dateObj);

  // Get settings and existing config
  const settings = await getDecisionSettingsAsync();
  const existingConfig = await getTaxYearConfigAsync(taxYear);
  const allTaxYears = await getAllTaxYearsAsync();

  // Get previous year's config for defaults
  const sortedTaxYears = Object.keys(allTaxYears).sort();
  const prevYearIndex = sortedTaxYears.indexOf(taxYear) - 1;
  const prevYearConfig = prevYearIndex >= 0
    ? allTaxYears[sortedTaxYears[prevYearIndex]]
    : null;

  // Get state pension info
  const statePensionInfo = await getStatePensionForTaxYear(taxYear);

  // Suggest salary based on CPI
  const prevCpi = prevYearConfig?.cpi || 0.025;
  const suggestedSalary = suggestSalary(settings.baseSalary, prevCpi);

  return {
    taxYear,
    selectedMonth,
    isApril,
    remainingMonths,

    // Current settings
    baseSalary: settings.baseSalary,
    suggestedSalary,

    // Previous year defaults
    defaults: {
      pa: prevYearConfig?.pa || existingConfig.pa,
      brl: prevYearConfig?.brl || existingConfig.brl,
      hrl: prevYearConfig?.hrl || existingConfig.hrl,
      cpi: prevCpi,
      other: prevYearConfig?.other || 0
    },

    // State pension
    statePension: statePensionInfo,

    // Existing config (if partially filled)
    existingConfig: existingConfig.yearSetupComplete ? existingConfig : null
  };
}

/**
 * Calculates the monthly breakdown for the confirmation step
 *
 * Shows gross amounts, tax, and net (take-home) for each income source.
 * ISA is already net (tax-free).
 *
 * @param {object} params - Confirmed wizard parameters
 * @returns {object} Monthly breakdown with gross, tax, and net values
 */
export function calculateMonthlyBreakdown(params) {
  const {
    targetSalary,
    brl,
    pa = 12570,
    other = 0,
    statePension = 0,
    isaSavingsAllocation = 0,
    remainingMonths,
    grossIncomeToDate = 0,
    isTaxEfficient = true
  } = params;

  // Helper to calculate tax on gross income
  const calcTax = (gross) => {
    if (gross <= pa) return 0;
    if (gross <= brl) return (gross - pa) * 0.2;
    return (brl - pa) * 0.2 + (gross - brl) * 0.4;
  };

  const monthlyOtherGross = other / 12;
  const monthlyStatePensionGross = statePension / 12;
  const monthlyFixedIncomeGross = monthlyOtherGross + monthlyStatePensionGross;

  let monthlySippGross, monthlyIsaNet;

  if (!isTaxEfficient) {
    // Tax-inefficient mode: full SIPP draw to target, no ISA
    monthlySippGross = (targetSalary / 12) - monthlyFixedIncomeGross;
    monthlyIsaNet = 0;
  } else {
    // Tax-efficient mode: SIPP capped at BRL, ISA supplements
    const remainingBrl = Math.max(0, brl - grossIncomeToDate);
    const maxMonthlySippAtBrl = Math.max(0, (remainingBrl / remainingMonths) - monthlyFixedIncomeGross);
    monthlySippGross = Math.min((targetSalary / 12) - monthlyFixedIncomeGross, maxMonthlySippAtBrl);
    monthlyIsaNet = isaSavingsAllocation / remainingMonths;
  }

  // Calculate annual gross taxable income (SIPP + Other + State Pension)
  const annualTaxableGross = (monthlySippGross + monthlyFixedIncomeGross) * 12;
  const annualTax = calcTax(annualTaxableGross);
  const monthlyTax = annualTax / 12;

  // Calculate net for taxable sources (proportional tax allocation)
  const totalTaxableGross = monthlySippGross + monthlyFixedIncomeGross;
  const taxProportion = totalTaxableGross > 0 ? monthlyTax / totalTaxableGross : 0;

  const monthlySippTax = monthlySippGross * taxProportion;
  const monthlyOtherTax = monthlyOtherGross * taxProportion;
  const monthlyStatePensionTax = monthlyStatePensionGross * taxProportion;

  const monthlySippNet = monthlySippGross - monthlySippTax;
  const monthlyOtherNet = monthlyOtherGross - monthlyOtherTax;
  const monthlyStatePensionNet = monthlyStatePensionGross - monthlyStatePensionTax;

  // Total net (what goes in your pocket)
  const monthlyTotalNet = monthlySippNet + monthlyOtherNet + monthlyStatePensionNet + monthlyIsaNet;

  return {
    // SIPP (taxable)
    sipp: {
      gross: monthlySippGross,
      tax: monthlySippTax,
      net: monthlySippNet
    },
    // Other income (taxable)
    other: {
      gross: monthlyOtherGross,
      tax: monthlyOtherTax,
      net: monthlyOtherNet
    },
    // State pension (taxable)
    statePension: {
      gross: monthlyStatePensionGross,
      tax: monthlyStatePensionTax,
      net: monthlyStatePensionNet
    },
    // ISA (tax-free, already net)
    isa: {
      gross: monthlyIsaNet,  // Same as net for ISA
      tax: 0,
      net: monthlyIsaNet
    },
    // Totals
    totalGross: monthlySippGross + monthlyOtherGross + monthlyStatePensionGross + monthlyIsaNet,
    totalTax: monthlyTax,
    totalNet: monthlyTotalNet,

    // Mode
    mode: isTaxEfficient ? 'tax-efficient' : 'tax-inefficient',

    // Legacy fields for compatibility
    monthlySipp: monthlySippGross,
    monthlyIsa: monthlyIsaNet,
    monthlyOther: monthlyOtherGross,
    monthlyStatePension: monthlyStatePensionGross,
    monthlyTotal: monthlyTotalNet
  };
}

/**
 * Builds the tax year config to save after wizard completion
 *
 * @param {object} wizardData - Data collected from wizard
 * @returns {object} Tax year config to save
 */
export function buildTaxYearConfig(wizardData) {
  const {
    pa,
    brl,
    hrl,
    cpi,
    other,
    isaSavingsAllocation,
    isTaxEfficient,
    taxEfficiencyChoice,
    grossIncomeToDate,
    startMonth,
    confirmedSalary,
    remainingMonths,
    statePension,
    monthlyBreakdown
  } = wizardData;

  return {
    // Tax thresholds
    pa,
    brl,
    hrl,

    // Previous year's CPI
    cpi,

    // Other taxable income (annual)
    other,

    // ISA/Savings
    isaSavingsAllocation: isTaxEfficient ? isaSavingsAllocation : 0,
    isaSavingsUsed: 0,

    // Tax efficiency
    isTaxEfficient,
    taxEfficiencyChoice,

    // Mid-year start
    grossIncomeToDate: grossIncomeToDate || 0,
    startMonth: startMonth || 4,
    remainingMonths: remainingMonths || 12,

    // Wizard completion
    yearSetupComplete: true,
    confirmedSalary,

    // State pension (for reference)
    statePension: statePension || 0,

    // Monthly breakdown (expected values from wizard)
    expectedMonthly: monthlyBreakdown ? {
      sipp: {
        gross: monthlyBreakdown.sipp?.gross || 0,
        tax: monthlyBreakdown.sipp?.tax || 0,
        net: monthlyBreakdown.sipp?.net || 0
      },
      other: {
        gross: monthlyBreakdown.other?.gross || 0,
        tax: monthlyBreakdown.other?.tax || 0,
        net: monthlyBreakdown.other?.net || 0
      },
      statePension: {
        gross: monthlyBreakdown.statePension?.gross || 0,
        tax: monthlyBreakdown.statePension?.tax || 0,
        net: monthlyBreakdown.statePension?.net || 0
      },
      isa: {
        gross: monthlyBreakdown.isa?.gross || 0,
        tax: 0,
        net: monthlyBreakdown.isa?.net || 0
      },
      totalGross: monthlyBreakdown.totalGross || 0,
      totalTax: monthlyBreakdown.totalTax || 0,
      totalNet: monthlyBreakdown.totalNet || 0
    } : null
  };
}
