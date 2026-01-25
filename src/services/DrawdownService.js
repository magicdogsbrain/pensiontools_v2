/**
 * Drawdown Service
 * Calculates optimal SIPP and ISA withdrawals with tax efficiency
 *
 * NEW LOGIC (v6.0):
 * - Single advice output (not two alternatives)
 * - ISA used as top-up to keep SIPP+Other at BRL
 * - Tax-efficient mode requires ISA for remaining tax year months
 * - Tax boost applies when we have enough ISA coverage
 */

import { calculateTax, grossToNet, calculateBRLHeadroom } from './TaxCalculator.js';
import { getRemainingTaxYearMonths } from '../utils/DateUtils.js';
import { INFLATION_DEFAULTS } from '../constants.js';

/**
 * Calculates the recommended SIPP draw based on tax efficiency
 *
 * Strategy:
 * 1. Calculate target gross salary (inflation-adjusted)
 * 2. SIPP + Other should not exceed BRL to stay in basic rate
 * 3. If we have ISA for remaining months, we can be tax-efficient
 * 4. Without sufficient ISA, just draw up to Target Gross Salary
 *
 * @param {object} params - Calculation parameters
 * @returns {object} Draw recommendation
 */
export function calculateSIPPDraw(params) {
  const {
    baseSalary,
    cumulativeInflation,
    yearlyInflation = [],
    other = 0,
    statePension = 0,
    statePensionYear = 12,
    yearNumber = 0,
    pa,
    brl,
    hrl,
    taxMode = 'inflates'
  } = params;

  // Adjust thresholds for inflation if not frozen
  const adjPA = taxMode === 'frozen' ? pa : pa * cumulativeInflation;
  const adjBRL = taxMode === 'frozen' ? brl : brl * cumulativeInflation;
  const adjHRL = taxMode === 'frozen' ? hrl : hrl * cumulativeInflation;

  // Target income (inflation-adjusted)
  const targetGross = baseSalary * cumulativeInflation;

  // Other pension with CPI capped at 4%
  const adjOther = calculateCappedInflation(other, yearlyInflation);

  // State pension (full CPI, starts at specific year)
  const adjStatePension = yearNumber >= statePensionYear
    ? statePension * cumulativeInflation
    : 0;

  // Total fixed income
  const fixedIncome = adjOther + adjStatePension;

  // SIPP should fill up to BRL (to stay in basic rate) OR target, whichever is lower
  const maxGrossAtBRL = adjBRL;
  const sippToReachBRL = Math.max(0, maxGrossAtBRL - fixedIncome);
  const sippToReachTarget = Math.max(0, targetGross - fixedIncome);

  // Standard SIPP draw: minimum of (to BRL) and (to target)
  const annualSippDraw = Math.min(sippToReachBRL, sippToReachTarget);

  return {
    pa: adjPA,
    brl: adjBRL,
    hrl: adjHRL,
    targetGross,
    other: adjOther,
    statePension: adjStatePension,
    fixedIncome,
    annualSippDraw,
    monthlySippDraw: annualSippDraw / 12,
    sippPlusfixedAtBRL: sippToReachBRL + fixedIncome === adjBRL
  };
}

/**
 * Calculates other pension income with CPI capped at 4%
 */
function calculateCappedInflation(base, yearlyRates, cap = INFLATION_DEFAULTS.OTHER_INCOME_CAP) {
  let amount = base;
  for (const rate of yearlyRates) {
    amount *= (1 + Math.min(rate, cap));
  }
  return amount;
}

/**
 * Main decision calculation - NEW UNIFIED LOGIC (v7.0)
 *
 * This version supports year-level tax efficiency determination:
 *
 * 1. If isTaxEfficientYear is true:
 *    - Use ISA allocation proportionally across remaining months
 *    - SIPP capped at BRL, ISA makes up the difference
 *    - Tax boost available when not in protection
 *
 * 2. If isTaxEfficientYear is false:
 *    - No ISA used (preserve for growth)
 *    - Draw full SIPP to target (may exceed BRL, pay 40%)
 *    - Check for protection-induced tax efficiency
 *
 * 3. Protection mode:
 *    - Reduces SIPP draw by protection factor
 *    - In tax-inefficient mode: if projected annual SIPP drops below BRL,
 *      can boost back to BRL (protection-induced efficiency)
 *
 * @param {object} params - Full calculation parameters
 * @returns {object} Single unified recommendation
 */
export function calculateDrawdownRecommendation(params) {
  const {
    // Fund values
    equity,
    bond,
    cash,
    isaBalance = 0,

    // Settings
    baseSalary,
    cumulativeInflation,
    yearlyInflation = [],
    other = 0,
    statePension = 0,
    statePensionYear = 12,
    yearNumber = 0,
    pa,
    brl,
    hrl,
    taxMode = 'inflates',

    // Date context
    currentDate,

    // History for tax year
    taxYearHistory = [],
    inProtection = false,
    protectionFactor = 20,  // % reduction in protection mode

    // NEW: Year-level tax efficiency (from tax year config)
    isTaxEfficientYear = true,      // Set during wizard
    yearlyIsaSavingsAllocation = 0, // Total ISA allocation for year
    cumulativeIsaSavingsUsed = 0,   // ISA already used this year
    grossIncomeToDate = 0           // Pre-pension income
  } = params;

  // Step 1: Calculate standard SIPP draw (annual)
  const sippCalc = calculateSIPPDraw({
    baseSalary,
    cumulativeInflation,
    yearlyInflation,
    other,
    statePension,
    statePensionYear,
    yearNumber,
    pa,
    brl,
    hrl,
    taxMode
  });

  // Step 2: Calculate target net income
  const targetGross = sippCalc.targetGross;
  const targetNet = grossToNet(targetGross, sippCalc.pa, sippCalc.brl, sippCalc.hrl);
  const monthlyTargetNet = targetNet / 12;

  // Step 3: Calculate what SIPP + Other + State would give us at BRL cap
  const monthlySippAtBRL = sippCalc.monthlySippDraw;
  const monthlyOther = sippCalc.other / 12;
  const monthlyState = sippCalc.statePension / 12;
  const monthlyFixedIncome = monthlyOther + monthlyState;

  // Gross at BRL cap (monthly)
  const monthlyGrossAtBRL = monthlySippAtBRL + monthlyFixedIncome;

  // Net at BRL cap (annual calculation, then divide)
  const annualGrossAtBRL = monthlyGrossAtBRL * 12;
  const annualNetAtBRL = grossToNet(annualGrossAtBRL, sippCalc.pa, sippCalc.brl, sippCalc.hrl);
  const monthlyNetAtBRL = annualNetAtBRL / 12;

  // Step 4: Calculate ISA needs
  const isaNeededMonthly = Math.max(0, monthlyTargetNet - monthlyNetAtBRL);
  const remainingMonths = getRemainingTaxYearMonths(currentDate);

  // Step 5: Calculate ISA available (from year-level allocation)
  const remainingIsaAllocation = Math.max(0, yearlyIsaSavingsAllocation - cumulativeIsaSavingsUsed);
  const monthlyIsaFromAllocation = remainingMonths > 0 ? remainingIsaAllocation / remainingMonths : 0;

  // Step 6: Determine mode based on year-level efficiency flag
  let recommendation;
  let protectionInducedEfficiency = false;

  if (isTaxEfficientYear) {
    // TAX-EFFICIENT YEAR MODE
    // Use ISA allocation to keep SIPP at BRL
    const monthlyIsaToUse = Math.min(isaNeededMonthly, monthlyIsaFromAllocation);

    recommendation = {
      mode: 'tax-efficient',
      monthlySipp: inProtection
        ? monthlySippAtBRL * (1 - protectionFactor / 100)
        : monthlySippAtBRL,
      monthlyIsa: monthlyIsaToUse,
      monthlyOther,
      monthlyState,
      reason: monthlyIsaToUse > 0
        ? 'Tax-efficient year: ISA top-up keeps SIPP at BRL'
        : 'Tax-efficient year: Target income achieved within BRL',
      taxBoostEligible: !inProtection,
      isaUsedForTopUp: monthlyIsaToUse > 0,
      isTaxEfficientYear: true
    };
  } else {
    // TAX-INEFFICIENT YEAR MODE
    // Draw full SIPP to target, no ISA used
    const sippToTarget = Math.max(0, targetGross / 12 - monthlyFixedIncome);

    // Calculate SIPP draw (with protection reduction if applicable)
    let actualMonthlySipp = inProtection
      ? sippToTarget * (1 - protectionFactor / 100)
      : sippToTarget;

    // Check for PROTECTION-INDUCED TAX EFFICIENCY
    // If protection has reduced SIPP draw such that projected annual is below BRL,
    // we can boost back up to BRL and effectively become tax-efficient
    if (inProtection) {
      const projectedAnnualSipp = calculateProjectedAnnualSipp(
        taxYearHistory, actualMonthlySipp, remainingMonths
      );
      const projectedAnnualTaxable = projectedAnnualSipp + (monthlyFixedIncome * 12) + grossIncomeToDate;

      if (projectedAnnualTaxable < sippCalc.brl) {
        // We can boost to BRL while staying in basic rate!
        const brlHeadroom = sippCalc.brl - projectedAnnualTaxable;
        const boostPerMonth = brlHeadroom / remainingMonths;

        actualMonthlySipp += boostPerMonth;
        protectionInducedEfficiency = true;
      }
    }

    recommendation = {
      mode: protectionInducedEfficiency ? 'protection-induced-efficient' : 'tax-inefficient',
      monthlySipp: actualMonthlySipp,
      monthlyIsa: 0,  // No ISA in tax-inefficient mode
      monthlyOther,
      monthlyState,
      reason: protectionInducedEfficiency
        ? 'Protection reduced income below BRL - boosting to stay in basic rate'
        : 'Tax-inefficient year: Full SIPP draw to target (ISA preserved for growth)',
      taxBoostEligible: !inProtection || protectionInducedEfficiency,
      isaUsedForTopUp: false,
      isTaxEfficientYear: false,
      protectionInducedTaxEfficiency: protectionInducedEfficiency
    };
  }

  // Step 7: Calculate tax boost opportunity (catch-up from protection periods)
  // Only applies in tax-efficient mode or protection-induced efficiency
  const boostInfo = (isTaxEfficientYear || protectionInducedEfficiency) ? calculateTaxBoost({
    taxYearHistory,
    remainingMonths,
    brl: sippCalc.brl,
    currentMonthlySipp: recommendation.monthlySipp,
    monthlyFixedIncome,
    inProtection,
    growthSurplus: (equity + bond) - (params.adjEquityMin || 0) - (params.adjBondMin || 0)
  }) : { boostAmount: 0, reason: 'Tax-inefficient year - no boost' };

  // Step 8: Build final recommendation
  const monthlyTotal = recommendation.monthlySipp +
                       recommendation.monthlyIsa +
                       recommendation.monthlyOther +
                       recommendation.monthlyState;

  const annualTaxable = (recommendation.monthlySipp + monthlyFixedIncome) * 12;
  const annualTax = calculateTax(annualTaxable, sippCalc.pa, sippCalc.brl, sippCalc.hrl);

  // Calculate tax that would have been paid in inefficient mode
  const inefficientSipp = Math.max(0, targetGross / 12 - monthlyFixedIncome);
  const annualTaxableInefficient = (inefficientSipp + monthlyFixedIncome) * 12;
  const annualTaxInefficient = calculateTax(annualTaxableInefficient, sippCalc.pa, sippCalc.brl, sippCalc.hrl);
  const taxSavedAnnual = annualTaxInefficient - annualTax;

  return {
    ...recommendation,

    // Add boost if eligible and available
    boostAmount: boostInfo.boostAmount,
    boostReason: boostInfo.reason,

    // Tax info
    taxInfo: {
      pa: sippCalc.pa,
      brl: sippCalc.brl,
      hrl: sippCalc.hrl,
      annualTaxable,
      annualTax,
      monthlyTax: annualTax / 12,
      effectiveRate: annualTaxable > 0 ? annualTax / annualTaxable : 0,
      headroomToBRL: calculateBRLHeadroom(annualTaxable, sippCalc.brl),
      // NEW: Tax saved vs inefficient scenario
      annualTaxInefficient,
      taxSavedAnnual,
      taxSavedMonthly: taxSavedAnnual / 12
    },

    // Totals
    monthlyGross: recommendation.monthlySipp + monthlyFixedIncome,
    monthlyNet: grossToNet((recommendation.monthlySipp + monthlyFixedIncome) * 12,
                           sippCalc.pa, sippCalc.brl, sippCalc.hrl) / 12 +
                recommendation.monthlyIsa,
    monthlyTotal,

    // Context
    remainingMonths,

    // ISA tracking (year-level)
    yearlyIsaSavingsAllocation,
    cumulativeIsaSavingsUsed,
    isaSavingsUsedThisMonth: recommendation.monthlyIsa,
    newCumulativeIsaSavingsUsed: cumulativeIsaSavingsUsed + recommendation.monthlyIsa,
    remainingIsaAllocation: remainingIsaAllocation - recommendation.monthlyIsa,

    // Legacy fields for compatibility
    isaBalance,
    isaNeededMonthly,
    totalIsaNeeded: isaNeededMonthly * remainingMonths,
    hasSufficientIsa: isTaxEfficientYear,

    // Protection-induced efficiency flag
    protectionInducedTaxEfficiency: protectionInducedEfficiency,

    // Debug
    calculation: {
      targetGross,
      targetNet,
      monthlyTargetNet,
      monthlyGrossAtBRL,
      monthlyNetAtBRL,
      grossIncomeToDate
    }
  };
}

/**
 * Calculates projected annual SIPP based on history and current draw
 */
function calculateProjectedAnnualSipp(taxYearHistory, currentMonthlySipp, remainingMonths) {
  // Sum SIPP draws from history
  const historicalSipp = taxYearHistory.reduce((sum, h) => sum + (h.sipp || 0), 0);

  // Project remaining months at current rate
  const projectedRemaining = currentMonthlySipp * remainingMonths;

  return historicalSipp + projectedRemaining;
}

/**
 * Calculates tax boost opportunity (catch-up from protection shortfalls)
 */
function calculateTaxBoost(params) {
  const {
    taxYearHistory,
    remainingMonths,
    brl,
    currentMonthlySipp,
    monthlyFixedIncome,
    inProtection,
    growthSurplus
  } = params;

  if (inProtection) {
    return { boostAmount: 0, reason: 'In protection mode - no boost' };
  }

  // Calculate shortfall from protection periods this tax year
  let protectionShortfall = 0;
  let boostAlreadyTaken = 0;

  for (const h of taxYearHistory) {
    if (h.inProtection && h.stdSipp) {
      protectionShortfall += (h.stdSipp - (h.sipp || 0));
    }
    if (h.boostAmount > 0) {
      boostAlreadyTaken += h.boostAmount;
    }
  }

  const remainingShortfall = Math.max(0, protectionShortfall - boostAlreadyTaken);

  if (remainingShortfall <= 0) {
    return { boostAmount: 0, reason: 'No shortfall to recover' };
  }

  // Calculate BRL headroom for remaining months
  const annualSippSoFar = taxYearHistory.reduce((sum, h) => sum + (h.sipp || 0), 0) * 12 / taxYearHistory.length;
  const projectedAnnual = annualSippSoFar + (currentMonthlySipp * remainingMonths * 12 / remainingMonths);
  const annualTaxable = projectedAnnual + (monthlyFixedIncome * 12);
  const brlHeadroom = Math.max(0, brl - annualTaxable);

  // Boost limited by: remaining shortfall, BRL headroom, fund surplus
  const maxBoostFromBRL = brlHeadroom / remainingMonths;
  const maxBoostFromFunds = growthSurplus / remainingMonths;
  const catchUpPerMonth = remainingShortfall / remainingMonths;

  const boostAmount = Math.min(catchUpPerMonth, maxBoostFromBRL, maxBoostFromFunds);

  if (boostAmount <= 0) {
    return { boostAmount: 0, reason: 'No headroom for boost' };
  }

  return {
    boostAmount,
    reason: `Catching up £${Math.round(remainingShortfall).toLocaleString()} protection shortfall`
  };
}

/**
 * Generates a drawdown schedule for planning
 * @param {object} settings - Drawdown settings
 * @param {number} duration - Years to project
 * @param {number} assumedInflation - Assumed annual inflation
 * @returns {object[]} Schedule of annual withdrawals
 */
export function generateDrawdownSchedule(settings, duration, assumedInflation = 0.025) {
  const schedule = [];
  const yearlyInflation = [];

  for (let year = 0; year <= duration; year++) {
    if (year > 0) yearlyInflation.push(assumedInflation);

    const cumInf = Math.pow(1 + assumedInflation, year);

    const calc = calculateSIPPDraw({
      baseSalary: settings.baseSalary,
      cumulativeInflation: cumInf,
      yearlyInflation: [...yearlyInflation],
      other: settings.other,
      statePension: settings.statePension,
      statePensionYear: settings.statePensionYear,
      yearNumber: year,
      pa: settings.pa,
      brl: settings.brl,
      hrl: settings.hrl,
      taxMode: settings.taxMode
    });

    const totalTaxable = calc.annualSippDraw + calc.other + calc.statePension;
    const tax = calculateTax(totalTaxable, calc.pa, calc.brl, calc.hrl);

    schedule.push({
      year,
      brl: calc.brl,
      other: calc.other,
      statePension: calc.statePension,
      sippDraw: calc.annualSippDraw,
      totalTaxable,
      tax,
      netIncome: totalTaxable - tax
    });
  }

  return schedule;
}
