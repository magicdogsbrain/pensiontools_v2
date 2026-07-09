/**
 * Pension Access Service
 *
 * Models the UK tax-free entitlement when accessing a defined-contribution pension.
 * These are the levers a tax-efficient drawdown strategy chooses between — the app
 * previously ignored them entirely (treating all SIPP income as fully taxable).
 *
 * Two ways to access the 25% tax-free element:
 *   - UFPLS (Uncrystallised Funds Pension Lump Sum): every withdrawal is 25% tax-free,
 *     75% taxable at the marginal rate.
 *   - PCLS (Pension Commencement Lump Sum): take 25% as a tax-free lump sum on
 *     crystallisation; the remaining 75% moves into drawdown and is taxed only when
 *     later withdrawn.
 *
 * All functions are pure and operate on ONE person's numbers (per-person primitives),
 * so a future household layer can call them per spouse without changes.
 *
 * Note: these compute the true marginal-tax position for planning. Real-world PAYE may
 * over-tax a first UFPLS via an emergency code and be reclaimed later — not modelled.
 */

import { TAX_DEFAULTS } from '../constants.js';
import { calculateTax } from './TaxCalculator.js';

/** Proportion of a DC pension accessible tax-free. */
export const TAX_FREE_RATE = 0.25;

/**
 * Lump Sum Allowance — lifetime cap on total tax-free cash (2024/25: £268,275).
 * Tax-free cash beyond this is not available.
 */
export const LUMP_SUM_ALLOWANCE = 268275;

/**
 * UFPLS from a given gross withdrawal amount.
 * The 75% taxable portion stacks on top of the person's other taxable income for the
 * year, so tax is computed marginally.
 *
 * @param {object} p
 * @param {number} p.amount - Gross amount withdrawn from the pension
 * @param {number} [p.otherTaxableIncome=0] - Other taxable income already in the year
 * @param {number} [p.pa] - Personal Allowance
 * @param {number} [p.brl] - Basic Rate Limit
 * @param {number} [p.hrl] - Higher Rate Limit
 * @returns {{gross:number, taxFree:number, taxablePortion:number, tax:number, net:number}}
 */
export function ufplsFromGross({
  amount,
  otherTaxableIncome = 0,
  pa = TAX_DEFAULTS.PERSONAL_ALLOWANCE,
  brl = TAX_DEFAULTS.BASIC_RATE_LIMIT,
  hrl = TAX_DEFAULTS.HIGHER_RATE_LIMIT
}) {
  if (amount <= 0) {
    return { gross: 0, taxFree: 0, taxablePortion: 0, tax: 0, net: 0 };
  }
  const taxFree = amount * TAX_FREE_RATE;
  const taxablePortion = amount - taxFree; // 75%
  const tax =
    calculateTax(otherTaxableIncome + taxablePortion, pa, brl, hrl) -
    calculateTax(otherTaxableIncome, pa, brl, hrl);
  const net = amount - tax; // taxFree + (taxablePortion - tax)
  return { gross: amount, taxFree, taxablePortion, tax, net };
}

/**
 * How much gross UFPLS to withdraw to receive a target net amount in hand, given the
 * person's other income. Net is monotonic in the withdrawal, so invert by bisection.
 *
 * @param {object} p
 * @param {number} p.netNeeded - Desired net cash from this withdrawal
 * @param {number} [p.otherTaxableIncome=0]
 * @param {number} [p.pa]
 * @param {number} [p.brl]
 * @param {number} [p.hrl]
 * @returns {{gross:number, taxFree:number, taxablePortion:number, tax:number, net:number}}
 */
export function ufplsForNet({
  netNeeded,
  otherTaxableIncome = 0,
  pa = TAX_DEFAULTS.PERSONAL_ALLOWANCE,
  brl = TAX_DEFAULTS.BASIC_RATE_LIMIT,
  hrl = TAX_DEFAULTS.HIGHER_RATE_LIMIT
}) {
  const args = { otherTaxableIncome, pa, brl, hrl };
  if (netNeeded <= 0) return ufplsFromGross({ amount: 0, ...args });

  let lo = netNeeded; // gross >= net
  let hi = netNeeded + 1;
  while (ufplsFromGross({ amount: hi, ...args }).net < netNeeded && hi < 1e12) {
    hi *= 2;
  }
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (ufplsFromGross({ amount: mid, ...args }).net < netNeeded) lo = mid;
    else hi = mid;
  }
  return ufplsFromGross({ amount: (lo + hi) / 2, ...args });
}

/**
 * PCLS — crystallise an amount and take the 25% tax-free cash (capped by remaining
 * Lump Sum Allowance). The remaining 75% moves into drawdown (taxable only when later
 * withdrawn, e.g. via subsequent income drawdown — not taxed here).
 *
 * @param {object} p
 * @param {number} p.crystallised - Amount being crystallised
 * @param {number} [p.lumpSumAllowanceRemaining=LUMP_SUM_ALLOWANCE] - Remaining tax-free cap
 * @returns {{crystallised:number, taxFreeCash:number, intoDrawdown:number, cappedByLSA:boolean, lumpSumAllowanceUsed:number}}
 */
export function pcls({
  crystallised,
  lumpSumAllowanceRemaining = LUMP_SUM_ALLOWANCE
}) {
  if (crystallised <= 0) {
    return {
      crystallised: 0,
      taxFreeCash: 0,
      intoDrawdown: 0,
      cappedByLSA: false,
      lumpSumAllowanceUsed: 0
    };
  }
  const uncappedTaxFree = crystallised * TAX_FREE_RATE;
  const taxFreeCash = Math.min(uncappedTaxFree, Math.max(0, lumpSumAllowanceRemaining));
  const cappedByLSA = taxFreeCash < uncappedTaxFree;
  const intoDrawdown = crystallised - taxFreeCash;
  return {
    crystallised,
    taxFreeCash,
    intoDrawdown,
    cappedByLSA,
    lumpSumAllowanceUsed: taxFreeCash
  };
}
