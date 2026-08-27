/**
 * Tax Year Wizard Service
 * Handles tax year setup wizard logic including ISA sufficiency calculations
 */

import { getTaxYear, getRemainingTaxYearMonths, parseMonth } from '../utils/DateUtils.js';
import { DECISION_ASSUMED_CPI } from './InflationModel.js';
import { spendingDeclineRateForYear, spendingSmileFactor } from './SpendingModel.js';
import {
  getTaxYearConfigAsync,
  getDecisionSettingsAsync,
  getAllTaxYearsAsync,
  getStatePensionForTaxYear,
  isYearSetupComplete
} from '../storage/DecisionRepository.js';
import { getActiveStressSettings } from '../storage/ScenarioRepository.js';

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

// Re-exported so callers/tests can reach the shared constant from here. The per-year decline is now
// driven by SpendingModel.spendingDeclineRateForYear (the smile: level 0-4, ~1%/yr 5-24, level after),
// so the wizard reproduces the same curve the engines use rather than a flat rate every year.
export { SPEND_DECLINE_RATE } from './SpendingModel.js';

/**
 * Suggests next year's target salary by uplifting the PREVIOUS year's confirmed salary by last
 * year's CPI, netted by the real-spending decline when the plan declines. Compounding off last
 * year's income (not a fixed base) is what makes the declining profile actually reduce real spend
 * over time, exactly as the Stress engine does.
 *
 * @param {number} prevSalary - Previous tax year's confirmed salary (or the plan base for year 1)
 * @param {number} lastYearCpi - CPI from previous tax year (as decimal, e.g., 0.04 for 4%)
 * @param {number} declineRate - Real-spending decline (0 for 'flat', SPEND_DECLINE_RATE for 'declining')
 * @returns {number} Suggested salary
 */
export function suggestSalary(prevSalary, lastYearCpi, declineRate = 0) {
  return prevSalary * (1 + lastYearCpi - declineRate);
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
    return allTaxYears[prevYear]?.cpi || DECISION_ASSUMED_CPI;
  }

  // No previous year, use default
  return DECISION_ASSUMED_CPI;
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
/** Other taxable income the Stress plan already carries for a tax year ('YY/YY'), today's money. */
export function otherIncomeFromStress(ss, taxYear) {
  if (!ss) return 0;
  const y = Math.max(0, (2000 + parseInt(String(taxYear).split('/')[0], 10)) - 2026);   // plan year 0 = 26/27
  let t = +ss.other || 0;
  if ((ss.dbAmount || 0) > 0 && y >= (ss.dbStartYear || 0)) t += +ss.dbAmount;
  for (const inc of ss.extraIncomes || []) if (inc.annual > 0 && y >= (inc.startYear || 0) && (inc.endYear == null || y <= inc.endYear)) t += +inc.annual;
  return Math.round(t);
}

export async function getWizardData(selectedMonth) {
  const dateObj = parseMonth(selectedMonth);
  const taxYear = getTaxYear(dateObj);
  const month = dateObj.getMonth() + 1;
  const isApril = month === 4;
  const remainingMonths = getRemainingTaxYearMonths(dateObj);

  // Get settings and existing config
  const settings = await getDecisionSettingsAsync();
  let stressSettings = null; try { stressSettings = await getActiveStressSettings(); } catch (e) { stressSettings = null; }
  const existingConfig = await getTaxYearConfigAsync(taxYear);
  const allTaxYears = await getAllTaxYearsAsync();

  // Get previous year's config for defaults. NOTE: the year being SET UP usually isn't in
  // allTaxYears yet, so indexOf(taxYear)-1 was -2 → null → the suggestion silently fell back to
  // the plan base salary (losing the year-on-year confirmed-salary chain). Take the latest
  // existing year strictly BEFORE this one instead.
  const sortedTaxYears = Object.keys(allTaxYears).sort();
  const prevKey = sortedTaxYears.filter((k) => k < taxYear).pop() || null;
  const prevYearConfig = prevKey ? allTaxYears[prevKey] : null;

  // Get state pension info
  const statePensionInfo = await getStatePensionForTaxYear(taxYear);

  // Suggest salary: uplift LAST year's confirmed salary (or the plan base in year 1) by last year's
  // CPI, netted by the spending decline for THIS plan year — mirrors the Stress tester's smile.
  const prevCpi = prevYearConfig?.cpi || DECISION_ASSUMED_CPI;
  const spendingProfile = settings.spendingProfile || 'flat';
  // Plan year (0-based) for this tax year — same anchor as legacyDecision.getYearNum (26/27 = year 0).
  const planYear = Math.max(0, (2000 + (parseInt(taxYear.split('/')[0], 10) || 26)) - 2026);
  const declineRate = spendingDeclineRateForYear(planYear, spendingProfile);
  const suggestionBase = (prevYearConfig && prevYearConfig.confirmedSalary) || settings.baseSalary;
  const chainSuggestedSalary = suggestSalary(suggestionBase, prevCpi, declineRate);

  // BUDGET-SCHEDULE suggestion (preferred when available): "Set as my plan's target" saves a
  // per-year schedule (today's money, gross) built from the budget's dated lines and one-offs —
  // a car lease ending at 62 leaves the target in that exact year. The old chain (last year's
  // salary × CPI − decline) can't know that. Uplift the year's scheduled figure to nominal with
  // the SAME cpi chain the decision engine compounds (entered CPI per year, 4% assumption for
  // unentered years), and apply the spending profile the stress engine applies on top.
  let scheduleSuggestedSalary = null;
  try {
    const stress = await getActiveStressSettings();
    const sched = Array.isArray(stress?.targetSchedule) ? stress.targetSchedule : null;
    if (sched && sched[planYear] != null) {
      let cumInf = 1;
      for (let i = 0; i < planYear; i++) {
        const yStr = String((26 + i) % 100).padStart(2, '0') + '/' + String((27 + i) % 100).padStart(2, '0');
        cumInf *= 1 + ((allTaxYears[yStr] || {}).cpi || DECISION_ASSUMED_CPI);
      }
      const smile = spendingSmileFactor(planYear, settings.spendingProfile || 'flat');
      scheduleSuggestedSalary = Math.round(sched[planYear] * cumInf * smile);
    }
  } catch (e) { /* no stress settings / no schedule — chain fallback below */ }

  const suggestedSalary = scheduleSuggestedSalary ?? chainSuggestedSalary;
  const suggestionSource = scheduleSuggestedSalary != null ? 'budget-schedule' : 'chain';

  return {
    taxYear,
    selectedMonth,
    isApril,
    remainingMonths,

    // Current settings
    baseSalary: settings.baseSalary,
    // The figure the yearly uplift compounds off (last year's confirmed salary, else the plan base)
    suggestionBase,
    // Locked spending behaviour + the per-year real decline it implies (0 when 'flat')
    spendingProfile,
    declineRate,
    suggestedSalary,
    // Where the suggestion came from: the budget's per-year plan for this year, or the
    // CPI-uplift chain fallback (also carried so the UI can show both).
    suggestionSource,
    chainSuggestedSalary,

    // Previous year defaults
    defaults: {
      pa: prevYearConfig?.pa || existingConfig.pa,
      brl: prevYearConfig?.brl || existingConfig.brl,
      hrl: prevYearConfig?.hrl || existingConfig.hrl,
      cpi: prevCpi,
      // Last year's figure, else what the Stress plan already knows about this tax year: DB pension
      // once started, income streams (part-time work, rent) active in this plan year, and 'other'.
      other: prevYearConfig?.other || otherIncomeFromStress(stressSettings, taxYear)
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

  // Tax for THIS tax year: the draws over the remaining months sit on top of any income already
  // received before drawdown started (which has used up allowance/band). The extra tax the draws
  // cause is total tax less the tax already due on that earlier income, spread over the months
  // actually drawn. For a full year with nothing earned before, this is the plain annual figure.
  const months = Math.max(1, Math.min(12, remainingMonths || 12));
  const drawsThisYear = (monthlySippGross + monthlyFixedIncomeGross) * months;
  const priorIncome = months < 12 ? (grossIncomeToDate || 0) : 0;
  const annualTax = calcTax(drawsThisYear + priorIncome) - calcTax(priorIncome);
  const monthlyTax = annualTax / months;

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
