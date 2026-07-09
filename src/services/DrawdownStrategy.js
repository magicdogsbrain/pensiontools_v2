/**
 * Drawdown Strategy — the single tax-efficient withdrawal decision both engines will use.
 *
 * Given a target income, fixed income (State Pension + other), tax bands and an ISA pot,
 * decide how much to draw from the SIPP (taxable) and the ISA (tax-free) to deliver the
 * target NET income, using the research-backed band-management rule:
 *
 *   1. Draw SIPP up to the basic-rate limit (fills the personal allowance + basic band).
 *   2. Top the remaining NET gap up from the tax-free ISA (Option A: as much as needed;
 *      Option B: capped so the pot lasts across the pre-State-Pension years).
 *   3. If the ISA can't cover the gap, draw extra SIPP ABOVE the basic-rate limit and pay
 *      the higher-rate tax (Option A "use the ISA until we can't"). Income still hits
 *      target; the pot bears the cost.
 *
 * State-Pension-aware by construction: fixed income (incl. SP) fills the band first, so
 * once SP is in payment the SIPP-to-BRL room shrinks and the ISA/extra-SIPP covers less.
 *
 * Pure and annual-basis (tax bands are annual). Callers divide by 12 for monthly amounts
 * and track the ISA pot's depletion themselves.
 */

import { grossToNet, netToGross } from './TaxCalculator.js';
import { ISA_STRATEGIES } from './IsaDrawdown.js';

/**
 * @param {object} p
 * @param {number} p.targetGross - desired gross-equivalent total income (annual)
 * @param {number} [p.fixedIncome=0] - taxable fixed income: State Pension + other (annual)
 * @param {number} p.pa - personal allowance
 * @param {number} p.brl - basic-rate limit
 * @param {number} p.hrl - higher-rate limit
 * @param {number} [p.isaBalance=0] - current ISA pot
 * @param {string} [p.strategy] - ISA_STRATEGIES value (default tax-efficient / Option A)
 * @param {number} [p.yearsUntilSp=0] - whole years until State Pension (for Option B leveling)
 * @returns {{sippGross:number, isaDraw:number, remainingIsa:number, taxable:number, tax:number, net:number}}
 */
export function planDrawdown({
  targetGross,
  fixedIncome = 0,
  pa,
  brl,
  hrl,
  isaBalance = 0,
  strategy = ISA_STRATEGIES.TAX_EFFICIENT,
  yearsUntilSp = 0
}) {
  const targetNet = grossToNet(targetGross, pa, brl, hrl);

  // Step 1: SIPP up to BRL (with fixed income), not exceeding the target.
  const sippToBrl = Math.max(0, Math.min(brl, targetGross) - fixedIncome);
  const netAtBrl = grossToNet(sippToBrl + fixedIncome, pa, brl, hrl);

  // Step 2: net gap the ISA should fill.
  const netGap = Math.max(0, targetNet - netAtBrl);

  // ISA cap: Option A uncapped; Option B levels the pot across the pre-SP years.
  const annualCap = (strategy === ISA_STRATEGIES.LONGEVITY && yearsUntilSp > 0)
    ? isaBalance / yearsUntilSp
    : Infinity;
  const isaDraw = Math.max(0, Math.min(netGap, Math.max(0, isaBalance), annualCap));
  const remainingIsa = isaBalance - isaDraw;
  const uncovered = netGap - isaDraw;

  // Step 3: cover any remaining net gap with extra taxable SIPP above BRL.
  let sippGross = sippToBrl;
  if (uncovered > 0) {
    const totalTaxable = netToGross(netAtBrl + uncovered, pa, brl, hrl);
    sippGross = Math.max(sippToBrl, totalTaxable - fixedIncome);
  }

  const taxable = sippGross + fixedIncome;
  const netFromTaxable = grossToNet(taxable, pa, brl, hrl);
  return {
    sippGross,
    isaDraw,
    remainingIsa,
    taxable,
    tax: taxable - netFromTaxable,
    net: netFromTaxable + isaDraw // == targetNet when the pots can cover it
  };
}
