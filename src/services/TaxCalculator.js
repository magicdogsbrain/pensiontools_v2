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
 * Inverts grossToNet: finds the gross taxable income needed to achieve a target net.
 * grossToNet is continuous and monotonically increasing, so we invert by bisection —
 * this stays correct across the PA taper and all rate bands without band-by-band algebra.
 * @param {number} net - Desired net (after-tax) income
 * @param {number} pa - Personal Allowance
 * @param {number} brl - Basic Rate Limit
 * @param {number} hrl - Higher Rate Limit
 * @returns {number} Gross taxable income that yields `net` after tax
 */
export function netToGross(net, pa, brl, hrl = TAX_DEFAULTS.HIGHER_RATE_LIMIT) {
  if (net <= 0) return 0;

  let lo = net;          // gross is always >= net (tax >= 0)
  let hi = net + 1;
  // Expand the upper bound until it nets at least the target.
  while (grossToNet(hi, pa, brl, hrl) < net && hi < 1e12) {
    hi *= 2;
  }
  // ~60 iterations converges well below a penny.
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (grossToNet(mid, pa, brl, hrl) < net) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

/**
 * Marginal tax on an incremental slice of income stacked on top of existing income.
 * (e.g. the taxable 75% of a UFPLS withdrawal, or an extra SIPP draw.)
 * @param {number} amount - The incremental (marginal) taxable amount
 * @param {number} existingIncome - Taxable income already received this year
 * @param {number} pa - Personal Allowance
 * @param {number} brl - Basic Rate Limit
 * @param {number} hrl - Higher Rate Limit
 * @returns {number} Tax attributable to `amount` at the margin
 */
export function marginalTaxOn(amount, existingIncome, pa, brl, hrl = TAX_DEFAULTS.HIGHER_RATE_LIMIT) {
  if (amount <= 0) return 0;
  return calculateTax(existingIncome + amount, pa, brl, hrl) - calculateTax(existingIncome, pa, brl, hrl);
}

/**
 * Resolves the tax bands for a given year — unifying the two mechanisms in the codebase:
 * explicit per-year thresholds (Decision Tool: pass cumulativeInflation=1) and
 * inflate-from-base (Stress Tester / schedules: taxMode 'inflates' scales all bands by
 * cumulativeInflation; 'frozen' leaves them fixed). Note: this inflates PA, BRL AND HRL
 * consistently (the live stress engine currently omits HRL — that gets fixed on wiring).
 * @param {object} p
 * @param {number} p.pa
 * @param {number} p.brl
 * @param {number} [p.hrl]
 * @param {number} [p.cumulativeInflation=1]
 * @param {'inflates'|'frozen'} [p.taxMode='inflates']
 * @returns {{pa:number, brl:number, hrl:number}}
 */
export function bandsForTaxYear({
  pa,
  brl,
  hrl = TAX_DEFAULTS.HIGHER_RATE_LIMIT,
  cumulativeInflation = 1,
  taxMode = 'inflates'
}) {
  const f = taxMode === 'frozen' ? 1 : cumulativeInflation;
  return { pa: pa * f, brl: brl * f, hrl: hrl * f };
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
