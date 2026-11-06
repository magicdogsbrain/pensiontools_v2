/**
 * Tax Year Model
 * Represents UK tax year configuration and calculations
 */

import { TAX_DEFAULTS } from '../constants.js';
import { DECISION_ASSUMED_CPI } from '../services/InflationModel.js';

/**
 * Creates a TaxYear configuration object
 * @param {object} config - Tax year configuration
 * @returns {object} TaxYear object
 */
export function createTaxYear(config = {}) {
  return {
    // Tax thresholds
    pa: config.pa ?? TAX_DEFAULTS.PERSONAL_ALLOWANCE,
    brl: config.brl ?? TAX_DEFAULTS.BASIC_RATE_LIMIT,
    hrl: config.hrl ?? TAX_DEFAULTS.HIGHER_RATE_LIMIT,

    // Expected inflation for the year
    cpi: config.cpi ?? 0.025,

    // Other income sources (annual amounts)
    other: config.other ?? 0,          // Other pension income
    statePension: config.statePension ?? 0,

    // ISA configuration
    isaBalance: config.isaBalance ?? 0,
    isaMonthlyDraw: config.isaMonthlyDraw ?? 0
  };
}

/**
 * Gets the default tax year configuration
 * @returns {object} Default TaxYear
 */
export function getDefaultTaxYear() {
  return createTaxYear({
    pa: TAX_DEFAULTS.PERSONAL_ALLOWANCE,
    brl: TAX_DEFAULTS.BASIC_RATE_LIMIT,
    hrl: TAX_DEFAULTS.HIGHER_RATE_LIMIT,
    cpi: 0.025,
    other: 0,
    statePension: 0,
    isaBalance: 0,
    isaMonthlyDraw: 0
  });
}

/**
 * A tax year's settings before its set-up (DecisionRepository until 7.2.0): what saveTaxYearConfig merges a set-up over,
 * and what the ISA count starts a year that has none from.
 */
export function defaultTaxYearConfig() {
  return {
    // Tax thresholds
    pa: TAX_DEFAULTS.PERSONAL_ALLOWANCE,
    brl: TAX_DEFAULTS.BASIC_RATE_LIMIT,
    hrl: TAX_DEFAULTS.HIGHER_RATE_LIMIT,

    // Previous year's CPI (for salary inflation)
    cpi: DECISION_ASSUMED_CPI,   // assumption only — the wizard chains the user's entered CPI year-on-year

    // Other taxable income (annual)
    other: 0,

    // ISA/Savings allocation for tax efficiency
    isaSavingsAllocation: 0,      // Total ISA/Savings available for this year
    isaSavingsUsed: 0,            // Cumulative used so far this year

    // Tax efficiency mode
    isTaxEfficient: true,         // Year-level tax efficiency flag
    taxEfficiencyChoice: null,    // 'efficient', 'reduced', 'inefficient'

    // Mid-year start support
    grossIncomeToDate: 0,         // Taxable income before starting pension
    taxPaidToDate: null,          // PAYE already deducted on it (null = unknown → assume it was taxed on its own)
    startMonth: 4,                // Month number (4 = April) when started

    // Wizard completion tracking
    yearSetupComplete: false,     // Has wizard been completed?
    confirmedSalary: null         // User-confirmed target salary for this year
  };
}
