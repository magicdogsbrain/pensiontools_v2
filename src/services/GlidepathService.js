/**
 * Glidepath Service
 * Manages declining fund minimums over time
 */

import { INFLATION_DEFAULTS } from '../constants.js';

/**
 * Calculates the glidepath minimum for a fund at a given year
 * Growth funds deplete linearly to zero; cash maintains real value
 *
 * @param {number} baseMin - Initial minimum value
 * @param {number} year - Current year (0-indexed)
 * @param {number} duration - Total duration in years
 * @param {number} cumulativeInflation - Cumulative inflation factor (1.0 = no inflation)
 * @param {boolean} isGrowthFund - Whether this is a growth fund (depletes) or cash (maintains)
 * @returns {number} Adjusted minimum for this year
 */
export function calculateGlidepath(baseMin, year, duration, cumulativeInflation, isGrowthFund) {
  if (isGrowthFund) {
    // Growth funds: inflate AND deplete linearly
    const depletionFactor = Math.max(0, 1 - year / duration);
    return baseMin * cumulativeInflation * depletionFactor;
  }

  // Cash: inflate only (maintains real value)
  return baseMin * cumulativeInflation;
}

/**
 * Calculates all glidepath values for a given point in time
 * @param {object} settings - Settings with equityMin, bondMin, cashTarget, duration
 * @param {number} year - Current year
 * @param {number} cumulativeInflation - Cumulative inflation factor
 * @returns {object} Adjusted minimums { equity, bond, cash, total }
 */
export function calculateAllGlidepaths(settings, year, cumulativeInflation) {
  const equity = calculateGlidepath(
    settings.equityMin, year, settings.duration, cumulativeInflation, true
  );
  const bond = calculateGlidepath(
    settings.bondMin, year, settings.duration, cumulativeInflation, true
  );
  const cash = calculateGlidepath(
    settings.cashTarget, year, settings.duration, cumulativeInflation, false
  );

  return {
    equity,
    bond,
    cash,
    totalGrowth: equity + bond,
    total: equity + bond + cash
  };
}

/**
 * Calculates cumulative inflation from yearly rates
 * @param {number[]} yearlyRates - Array of yearly inflation rates (as decimals)
 * @returns {number} Cumulative inflation factor
 */
export function calculateCumulativeInflation(yearlyRates) {
  return yearlyRates.reduce((acc, rate) => acc * (1 + rate), 1);
}

/**
 * Calculates cumulative inflation with cap on individual years
 * Used for "other pension" income where CPI is capped
 * @param {number} baseAmount - Base amount
 * @param {number[]} yearlyRates - Array of yearly inflation rates
 * @param {number} cap - Maximum annual increase (default 4%)
 * @returns {number} Inflated amount
 */
export function calculateCappedInflation(baseAmount, yearlyRates, cap = INFLATION_DEFAULTS.OTHER_INCOME_CAP) {
  let amount = baseAmount;
  for (const rate of yearlyRates) {
    const cappedRate = Math.min(rate, cap);
    amount *= (1 + cappedRate);
  }
  return amount;
}

/**
 * Generates a complete glidepath schedule
 * @param {object} settings - Settings with equityMin, bondMin, cashTarget, duration
 * @param {number} assumedInflation - Assumed annual inflation rate
 * @returns {object[]} Array of yearly glidepath values
 */
export function generateGlidepathSchedule(settings, assumedInflation = INFLATION_DEFAULTS.ASSUMED_CPI) {
  const schedule = [];

  for (let year = 0; year <= settings.duration; year++) {
    const cumInf = Math.pow(1 + assumedInflation, year);
    const values = calculateAllGlidepaths(settings, year, cumInf);

    schedule.push({
      year,
      cumulativeInflation: cumInf,
      equityMin: values.equity,
      bondMin: values.bond,
      cashTarget: values.cash,
      totalMin: values.total
    });
  }

  return schedule;
}

/**
 * Checks if current fund values are above glidepath minimums
 * @param {object} funds - Current fund values { equity, bond, cash }
 * @param {object} minimums - Glidepath minimums { equity, bond, cash }
 * @returns {object} Status { healthy, equitySurplus, bondSurplus, cashSurplus, growthHealthy }
 */
export function checkGlidepathStatus(funds, minimums) {
  const equitySurplus = funds.equity - minimums.equity;
  const bondSurplus = funds.bond - minimums.bond;
  const cashSurplus = funds.cash - minimums.cash;
  const growthSurplus = (funds.equity + funds.bond) - (minimums.equity + minimums.bond);

  return {
    healthy: equitySurplus >= 0 && bondSurplus >= 0 && cashSurplus >= 0,
    growthHealthy: growthSurplus >= 0,
    equitySurplus,
    bondSurplus,
    cashSurplus,
    growthSurplus,
    totalSurplus: equitySurplus + bondSurplus + cashSurplus
  };
}

/**
 * Calculates proportional draw from growth funds based on surplus
 * @param {number} drawAmount - Amount to withdraw
 * @param {number} equitySurplus - Equity above minimum
 * @param {number} bondSurplus - Bond above minimum
 * @returns {object} Proportional draws { fromEquity, fromBond }
 */
export function calculateProportionalDraw(drawAmount, equitySurplus, bondSurplus) {
  const totalSurplus = equitySurplus + bondSurplus;

  if (totalSurplus <= 0) {
    // No surplus - can't draw from growth
    return { fromEquity: 0, fromBond: 0 };
  }

  // Draw proportionally from surplus
  const equityProportion = equitySurplus / totalSurplus;
  const bondProportion = bondSurplus / totalSurplus;

  return {
    fromEquity: drawAmount * equityProportion,
    fromBond: drawAmount * bondProportion
  };
}
