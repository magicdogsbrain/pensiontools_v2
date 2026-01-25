/**
 * Tax Calculator Service
 * Handles all UK income tax calculations
 */

import { TAX_DEFAULTS } from '../constants.js';

/**
 * Calculates income tax on a gross amount
 * @param {number} gross - Gross taxable income
 * @param {number} pa - Personal Allowance
 * @param {number} brl - Basic Rate Limit
 * @param {number} hrl - Higher Rate Limit (for PA taper)
 * @returns {number} Total tax payable
 */
export function calculateTax(gross, pa, brl, hrl = TAX_DEFAULTS.HIGHER_RATE_LIMIT) {
  if (gross <= 0) return 0;

  // Apply PA taper for high earners
  let effectivePA = pa;
  if (gross > TAX_DEFAULTS.PA_TAPER_THRESHOLD) {
    const reduction = (gross - TAX_DEFAULTS.PA_TAPER_THRESHOLD) * TAX_DEFAULTS.PA_TAPER_RATE;
    effectivePA = Math.max(0, pa - reduction);
  }

  // Taxable income after PA
  const taxable = Math.max(0, gross - effectivePA);

  // Basic rate band (up to BRL - PA originally, but we use BRL as the threshold)
  const basicBand = Math.max(0, brl - effectivePA);
  const higherBand = hrl - brl;

  let tax = 0;

  // Basic rate (20%)
  const basicTaxable = Math.min(taxable, basicBand);
  tax += basicTaxable * TAX_DEFAULTS.BASIC_RATE;

  // Higher rate (40%)
  if (taxable > basicBand) {
    const higherTaxable = Math.min(taxable - basicBand, higherBand);
    tax += higherTaxable * TAX_DEFAULTS.HIGHER_RATE;
  }

  // Additional rate (45%)
  if (taxable > basicBand + higherBand) {
    const additionalTaxable = taxable - basicBand - higherBand;
    tax += additionalTaxable * TAX_DEFAULTS.ADDITIONAL_RATE;
  }

  return tax;
}

/**
 * Calculates net income from gross
 * @param {number} gross - Gross income
 * @param {number} pa - Personal Allowance
 * @param {number} brl - Basic Rate Limit
 * @param {number} hrl - Higher Rate Limit
 * @returns {number} Net income after tax
 */
export function grossToNet(gross, pa, brl, hrl = TAX_DEFAULTS.HIGHER_RATE_LIMIT) {
  return gross - calculateTax(gross, pa, brl, hrl);
}

/**
 * Calculates BRL headroom (how much more can be withdrawn at basic rate)
 * @param {number} currentAnnualTaxable - Current year-to-date taxable income
 * @param {number} brl - Basic Rate Limit
 * @returns {number} Remaining headroom to BRL
 */
export function calculateBRLHeadroom(currentAnnualTaxable, brl) {
  return Math.max(0, brl - currentAnnualTaxable);
}
