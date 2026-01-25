/**
 * Tax Year Model
 * Represents UK tax year configuration and calculations
 */

import { TAX_DEFAULTS } from '../constants.js';

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
