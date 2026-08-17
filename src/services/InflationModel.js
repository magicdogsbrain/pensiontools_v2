/**
 * Inflation Model — single source of truth for CPI / inflation mechanics.
 *
 * Consolidates three previously-duplicated implementations (DrawdownService,
 * GlidepathService, and the inline loop in SimulationEngine). The mechanics are identical
 * across them; only the missing-year default diverged (decision path 4% vs stress 2.5%),
 * which is resolved separately at the call sites — this module fixes the CAP and the
 * compounding math in one place.
 */

import { INFLATION_DEFAULTS } from '../constants.js';

/** Default assumed CPI when a year has no explicit rate (BoE-target-plus-margin). */
export const DEFAULT_CPI = INFLATION_DEFAULTS.ASSUMED_CPI; // 2.5%

/**
 * Decision-tool assumed CPI for a tax year the user has NOT entered a rate for.
 * Design: the Decision tool works on ACTUALS — the user knows the current CPI when they set up
 * a tax year, so an entered value is always authoritative. This 4% is only the slightly-
 * pessimistic assumption stamped/suggested when they haven't entered one. The Stress tester,
 * projecting decades ahead, assumes instead (DEFAULT_CPI / bootstrapped history). Every
 * decision-side fallback must use THIS constant so an unentered year behaves identically
 * on every code path.
 */
export const DECISION_ASSUMED_CPI = 0.04;

/** Cap applied to "other pension" CPI increases. */
export const OTHER_INCOME_CAP = INFLATION_DEFAULTS.OTHER_INCOME_CAP; // 4%

/**
 * Cumulative inflation factor from a series of per-year rates.
 * @param {number[]} yearlyRates - e.g. [0.025, 0.03, ...]
 * @returns {number} product of (1 + rate)
 */
export function cumulativeInflation(yearlyRates) {
  return yearlyRates.reduce((acc, rate) => acc * (1 + rate), 1);
}

/**
 * Inflates a base amount by a series of per-year rates, each capped (e.g. the 4% cap on
 * "other pension" CPI increases).
 * @param {number} base - Starting amount
 * @param {number[]} yearlyRates - Per-year inflation rates
 * @param {number} [cap=OTHER_INCOME_CAP] - Per-year cap
 * @returns {number} Inflated amount
 */
export function cappedInflation(base, yearlyRates, cap = OTHER_INCOME_CAP) {
  let amount = base;
  for (const rate of yearlyRates) {
    amount *= (1 + Math.min(rate, cap));
  }
  return amount;
}
