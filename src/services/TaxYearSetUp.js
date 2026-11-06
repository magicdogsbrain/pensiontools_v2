/**
 * Setting up a tax year: the pure part of the classic planner's set-up (services/TaxYearWizardService.js until 7.2.0, which
 * re-exports all of this and keeps only what reads the repositories). The new app's Month by month sets a year up with these
 * same functions: the suggestion and its context (wizardDataFrom), the tax-free top-up and the choice when it falls short
 * (calculateIsaNeeded, validateIsaInput, settleTopUp), what reaches the bank each month (calculateMonthlyBreakdown) and the
 * year as stored (buildTaxYearConfig, setUpConfigOf).
 *
 * Pure: no storage, no DOM.
 */

import { getTaxYear, getRemainingTaxYearMonths, parseMonth } from '../utils/DateUtils.js';
import { DECISION_ASSUMED_CPI } from './InflationModel.js';
import { calculateTax } from './TaxCalculator.js';
import { TAX_DEFAULTS } from '../constants.js';
import { spendingDeclineRateForYear, spendingSmileFactor } from './SpendingModel.js';
import { decisionAnchorYear, yearOfTaxKey, taxYearKey } from './PlanTiming.js';


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
    hrl = TAX_DEFAULTS.HIGHER_RATE_LIMIT, // taxable income above which 45% applies
    other = 0,            // Annual other taxable income
    statePension = 0,     // Annual state pension
    remainingMonths,      // Months remaining in tax year
    grossIncomeToDate = 0 // Income already received before starting pension
  } = params;

  // Tax on a gross income: the ONE sum in TaxCalculator (6.16.0). The copy that lived here stopped at
  // 40% — no 45% band and no loss of the allowance above £100,000.
  const calcTax = (gross) => calculateTax(gross, pa, brl, hrl);

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
/**
 * FALLBACK anchor for plans that pre-date 6.4.0: the first tax year the user set up in the Decision
 * tool. Since 6.4.0 the plan carries an explicit start (`firstTaxYear`, derived from age today and
 * retirement status in the Stress tester's Timing block) and `PlanTiming.decisionAnchorYear` prefers
 * it — the old objection (that the Stress value was only "the year after the plan was built") no
 * longer holds because it is saved, not implied by today's date.
 * @param {object} allTaxYears  the Decision tool's tax-year configs, keyed "27/28"
 * @param {string} currentTaxYear  the year being set up now (used when nothing is set up yet)
 */
export function planYearBaseline(allTaxYears, currentTaxYear, now = new Date()) {
  const yearOf = (k) => 2000 + parseInt(String(k).split('/')[0], 10);
  const keys = Object.keys(allTaxYears || {}).filter((k) => /^\d{2}\/\d{2}$/.test(k) && Number.isFinite(yearOf(k)));
  if (keys.length) return Math.min(...keys.map(yearOf));
  return currentTaxYear ? yearOf(currentTaxYear) : now.getFullYear();
}

/** True when the plan actually carries an other-income projection worth trusting. */
export function hasOtherIncomePlan(ss) {
  if (!ss) return false;
  return (+ss.other > 0) || (+ss.dbAmount > 0) || ((ss.extraIncomes || []).some((i) => +i.annual > 0));
}

export function otherIncomeFromStress(ss, taxYear, baseline) {
  if (!ss) return 0;
  const base = baseline != null ? baseline : (2000 + parseInt(String(taxYear).split('/')[0], 10));
  const y = Math.max(0, (2000 + parseInt(String(taxYear).split('/')[0], 10)) - base);
  let t = +ss.other || 0;
  if ((ss.dbAmount || 0) > 0 && y >= (ss.dbStartYear || 0)) t += +ss.dbAmount;
  for (const inc of ss.extraIncomes || []) if (inc.annual > 0 && y >= (inc.startYear || 0) && (inc.endYear == null || y <= inc.endYear)) t += +inc.annual;
  return Math.round(t);
}


/**
 * The set-up's context for a month, from what the plan holds (getWizardData until 7.2.0, which now reads the repositories and
 * calls this): the new app's Month by month sets a tax year up from the same suggestion and the same defaults.
 * @param {string} selectedMonth  'YYYY-MM'
 * @param {{ settings: object, stressSettings: object|null, existingConfig: object, allTaxYears: object, statePensionInfo: object }} read
 *   settings: the Decision settings as loaded; stressSettings: the stored Stress settings (ScenarioRepository.getActiveStressSettings);
 *   existingConfig: the year's stored settings or the defaults (getTaxYearConfigAsync); statePensionInfo: getStatePensionForTaxYear's
 */
export function wizardDataFrom(selectedMonth, { settings, stressSettings = null, existingConfig, allTaxYears, statePensionInfo }) {
  const dateObj = parseMonth(selectedMonth);
  const taxYear = getTaxYear(dateObj);
  const month = dateObj.getMonth() + 1;
  const isApril = month === 4;
  const remainingMonths = getRemainingTaxYearMonths(dateObj);

  // Get previous year's config for defaults. NOTE: the year being SET UP usually isn't in
  // allTaxYears yet, so indexOf(taxYear)-1 was -2 → null → the suggestion silently fell back to
  // the plan base salary (losing the year-on-year confirmed-salary chain). Take the latest
  // existing year strictly BEFORE this one instead.
  const sortedTaxYears = Object.keys(allTaxYears).sort();
  const prevKey = sortedTaxYears.filter((k) => k < taxYear).pop() || null;
  const prevYearConfig = prevKey ? allTaxYears[prevKey] : null;


  // Suggest salary: uplift LAST year's confirmed salary (or the plan base in year 1) by last year's
  // CPI, netted by the spending decline for THIS plan year — mirrors the Stress tester's smile.
  const prevCpi = prevYearConfig?.cpi || DECISION_ASSUMED_CPI;
  const spendingProfile = settings.spendingProfile || 'flat';
  // Plan year for this tax year — the plan's saved first tax year is year 0 (6.4.0, one anchor with
  // legacyDecision). Negative = a BRIDGE year: the plan has not started, money is being spent to reach it.
  const planStartYear = decisionAnchorYear(settings, allTaxYears, taxYear, stressSettings);
  const planYearSigned = yearOfTaxKey(taxYear) - planStartYear;
  const planYear = Math.max(0, planYearSigned);
  const bridgeYear = planYearSigned < 0;
  const declineRate = spendingDeclineRateForYear(planYear, spendingProfile);
  const suggestionBase = (prevYearConfig && prevYearConfig.confirmedSalary) || settings.baseSalary;
  const chainSuggestedSalary = suggestSalary(suggestionBase, prevCpi, declineRate);

  // BUDGET-SCHEDULE suggestion (preferred when available): "Set as my plan's target" saves a
  // per-year schedule (today's money, gross) built from the budget's dated lines and one-offs —
  // a car lease ending at 62 leaves the target in that exact year. The old chain (last year's
  // salary × CPI − decline) can't know that. Uplift the year's scheduled figure to nominal with
  // the SAME cpi chain the decision engine compounds (entered CPI per year, 4% assumption for
  // unentered years), and apply the spending profile the stress engine applies on top.
  let scheduleSuggestedSalary = null, schedulePrevCpiAssumed = false, scheduleSuggestedBase = null;
  try {
    const stress = stressSettings;
    const sched = Array.isArray(stress?.targetSchedule) ? stress.targetSchedule : null;
    if (sched && sched[planYear] != null) {
      let cumInf = 1;
      for (let i = 0; i < planYear; i++) {
        const yStr = taxYearKey(planStartYear + i);   // walk the tax years from the plan's start
        cumInf *= 1 + ((allTaxYears[yStr] || {}).cpi || DECISION_ASSUMED_CPI);
      }
      const smile = spendingSmileFactor(planYear, settings.spendingProfile || 'flat');
      scheduleSuggestedSalary = Math.round(sched[planYear] * cumInf * smile);
      // The CPI typed in the wizard is LAST year's: when last year's CPI was never entered, the chain used the
      // assumption for it — so the typed figure replaces that factor (6.11.6; it changed nothing before).
      if (planYear > 0) {
        const prevKey = taxYearKey(planStartYear + planYear - 1);
        const prevCpiEntered = (allTaxYears[prevKey] || {}).cpi;
        schedulePrevCpiAssumed = !prevCpiEntered;
        scheduleSuggestedBase = prevCpiEntered ? null : sched[planYear] * cumInf / (1 + DECISION_ASSUMED_CPI) * smile;
      }
    }
  } catch (e) { /* no stress settings / no schedule — chain fallback below */ }

  // BRIDGE year (before the plan starts): the plan says nothing about this year's income except that
  // its first step is the rate the bridge cash was sized for. Suggest the first step (today's money, the
  // rate the ladder starts at) and say how many of the payments to come the bridge cash covers at that
  // rate. (6.5.4: spreading the whole bridge cash over the months left overstated the rate for anyone
  // who had already spent part of it — a September start is 5 payments in.)
  let bridgeSuggestedSalary = null, bridgeCoverMonths = null;
  if (bridgeYear) {
    const bridgeCash = +(stressSettings?.strategyParams?.bridgeCash) || 0;
    const sched0 = Array.isArray(stressSettings?.targetSchedule) ? +stressSettings.targetSchedule[0] : 0;
    // Income streams running at year 0 (rent, part-time work) reduce what the cash has to cover, like the DB pension (6.11.4).
    const streamsNow = (Array.isArray(stressSettings?.extraIncomes) ? stressSettings.extraIncomes : []).reduce((t, r) => t + ((r && +r.annual > 0 && (+r.startYear || 0) <= 0 && (r.endYear == null || +r.endYear >= 0)) ? +r.annual : 0), 0);
    const otherNow = +(stressSettings?.other || 0) + +(stressSettings?.dbAmount || 0) + streamsNow;
    bridgeSuggestedSalary = sched0 > 0 ? sched0 : (scheduleSuggestedSalary ?? (bridgeCash > 0 && remainingMonths > 0 ? Math.round(bridgeCash * 12 / remainingMonths) : null));
    if (bridgeCash > 0 && bridgeSuggestedSalary > 0) bridgeCoverMonths = Math.floor(bridgeCash / Math.max(1, (bridgeSuggestedSalary - otherNow) / 12));
  }

  const suggestedSalary = bridgeSuggestedSalary ?? scheduleSuggestedSalary ?? chainSuggestedSalary;
  const suggestionSource = bridgeSuggestedSalary != null ? 'bridge' : scheduleSuggestedSalary != null ? 'budget-schedule' : 'chain';

  return {
    taxYear,
    selectedMonth,
    isApril,
    remainingMonths,
    // Where this tax year sits in the plan (6.4.0): year 0 is the plan's first tax year; negative = bridge.
    planStartYear,
    planYear: planYearSigned,
    bridgeYear,
    bridgeCoverMonths,   // how many of the payments to come the plan's bridge cash covers at the suggested rate (bridge years only)
    schedulePrevCpiAssumed, scheduleSuggestedBase,   // schedule suggestions: last year's CPI was assumed → the typed CPI re-uplifts from this base

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
      // What the Stress plan says about THIS tax year — DB pension once started, income streams
      // (part-time work, rent) inside their window, and flat 'other'. The plan wins whenever it
      // carries a projection, so a stream that starts or ENDS is reflected instead of last year's
      // figure being inherited for ever. Only when the plan has no other-income at all do we fall
      // back to carrying the previous year forward (a purely hand-entered figure).
      other: hasOtherIncomePlan(stressSettings)
        ? otherIncomeFromStress(stressSettings, taxYear, planStartYear)
        : (prevYearConfig?.other || 0)
    },

    // State pension
    statePension: statePensionInfo,

    // Existing config (if partially filled)
    existingConfig: existingConfig.yearSetupComplete ? existingConfig : null
  };
}

// ---- The set-up's screens and words (6.23: collapsed to three screens, plain English; audit §2.7) ----

/** The screens, in order. The same three whether the year starts in April or mid-year: the mid-year questions sit on the first. */
export function wizardScreens() {
  return [
    { key: 'this-year', title: 'This year\'s figures' },
    { key: 'top-up', title: 'Tax-free top-up' },
    { key: 'confirm', title: 'Confirm' }
  ];
}

const gbp = (v) => '£' + Math.round(+v || 0).toLocaleString('en-GB');

/** The tax bands as an assumption the person can change, not a question. */
export function bandsAssumptionText({ pa, brl, hrl } = {}) {
  return 'We assume a tax-free allowance of ' + gbp(pa) + ', 20% tax up to ' + gbp(brl) + ' of taxable income and 45% above ' + gbp(hrl) + '.';
}

/**
 * The State Pension line for the set-up. Says the right thing when the pension is already in payment, starts
 * later this year, is years away, or is not in the plan — never "0 years until state pension".
 * @param {object} sp  getStatePensionForTaxYear's result
 * @param {string} selectedMonth 'YYYY-MM' the set-up starts from
 */
export function statePensionLine(sp, selectedMonth) {
  const s = sp || {};
  const amount = +s.amount || 0;
  const when = s.startDate || s.startYm || null;
  if (!amount) {
    return when
      ? 'Starts ' + when + ' — the amount is not in your plan yet; add your forecast under Settings.'
      : 'Not in your plan yet — add your State Pension forecast under Settings if you have one.';
  }
  const monthly = s.monthlyFull != null ? +s.monthlyFull : (s.monthly != null ? +s.monthly : amount / 12);
  const startedByStart = s.startYm ? (!selectedMonth || String(s.startYm) <= String(selectedMonth)) : !!s.isReceiving;
  if (startedByStart) return 'In payment: ' + gbp(monthly) + ' a month (' + gbp(amount) + ' this tax year).';
  if (s.isReceiving) return 'Starts ' + when + ': ' + gbp(monthly) + ' a month (' + gbp(amount) + ' this tax year).';
  const y = Math.max(0, +s.yearsUntil || 0), m = Math.max(0, +s.monthsUntil || 0);
  const parts = [];
  if (y) parts.push(y + (y === 1 ? ' year' : ' years'));
  if (m) parts.push(m + (m === 1 ? ' month' : ' months'));
  return 'Starts ' + when + (parts.length ? ' — ' + parts.join(' ') + ' away.' : '.');
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
    hrl = TAX_DEFAULTS.HIGHER_RATE_LIMIT,   // taxable income above which 45% applies
    other = 0,
    statePension = 0,
    isaSavingsAllocation = 0,
    remainingMonths,
    grossIncomeToDate = 0,
    taxPaidToDate = null,   // PAYE already deducted on that income (6.4.1); null = not known
    statePensionMonthlyFull = null,   // the monthly PAYMENT once it has started (6.11.0); null = derive from the annual
    spStartYm = null,                 // 'YYYY-MM' the State Pension starts
    startYm = null,                   // 'YYYY-MM' this setup starts from
    isTaxEfficient = true
  } = params;

  // Tax on a gross income: the ONE sum in TaxCalculator (6.16.0). The copy that lived here stopped at
  // 40% — no 45% band and no loss of the allowance above £100,000.
  const calcTax = (gross) => calculateTax(gross, pa, brl, hrl);

  const monthlyOtherGross = other / 12;
  // The State Pension is a monthly PAYMENT from its start month — never the year's partial total spread
  // over twelve (6.11.0). Before the start month there is none; after it, the full monthly.
  const spStartedByStart = !spStartYm || !startYm || startYm >= spStartYm;
  const monthlyStatePensionGross = statePension > 0 && statePensionMonthlyFull != null
    ? (spStartedByStart ? statePensionMonthlyFull : 0)
    : statePension / 12;
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
  // The State Pension inside the months to come: the year's whole total when it starts on or after the start
  // month (none of it is in the income to date), the monthly payment × months when it started earlier (6.11.5 —
  // the monthly figure of 0 before the start month was leaving the year's SP out of the tax altogether).
  const spInDraws = statePension > 0 && statePensionMonthlyFull != null
    ? (spStartedByStart ? statePensionMonthlyFull * months : statePension)
    : monthlyStatePensionGross * months;
  const drawsThisYear = (monthlySippGross + monthlyOtherGross) * months + spInDraws;
  const priorIncome = months < 12 ? (grossIncomeToDate || 0) : 0;
  // With the tax already paid known (payslips), what is still to come is the year's total less that —
  // right for a retiree drawing under cumulative PAYE since April, whose earlier months already carried
  // their share of the higher-rate band. Otherwise the old assumption: the earlier income was taxed on
  // its own bands (an ex-employee starting a pension mid-year).
  const priorTax = (months < 12 && taxPaidToDate != null && taxPaidToDate !== '') ? Math.max(0, +taxPaidToDate || 0) : calcTax(priorIncome);
  const annualTax = Math.max(0, calcTax(drawsThisYear + priorIncome) - priorTax);
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
    cgtExemptionUsed,
    isaSavingsAllocation,
    isTaxEfficient,
    taxEfficiencyChoice,
    grossIncomeToDate,
    taxPaidToDate,
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

    // Capital gains realised outside the tool this tax year (shares the £3,000 CGT exemption with
    // the taxable-account sales the Decision tool advises)
    cgtExemptionUsed: cgtExemptionUsed || 0,

    // ISA/Savings
    isaSavingsAllocation: isTaxEfficient ? isaSavingsAllocation : 0,
    isaSavingsUsed: 0,

    // Tax efficiency
    isTaxEfficient,
    taxEfficiencyChoice,

    // Mid-year start
    grossIncomeToDate: grossIncomeToDate || 0,
    taxPaidToDate: (taxPaidToDate == null || taxPaidToDate === '') ? null : Math.max(0, +taxPaidToDate || 0),
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

// ---- The set-up's own steps (src/ui/components/TaxYearSetupWizard.js until 7.2.0, which calls these now) -----------------

/** The top-up need for the answers so far (the wizard's isaCalcNow): the year's figures with the State Pension as the plan has it. */
export function isaCalcFor(ctx, inputs) {
  return calculateIsaNeeded({
    targetAnnualGross: inputs.confirmedSalary,
    brl: inputs.brl,
    pa: inputs.pa,
    hrl: inputs.hrl || undefined,   // the 45% threshold the set-up collects (until 6.16.0 the sums always used the standard £125,140)
    other: inputs.other,
    statePension: ctx.statePension.amount,
    statePensionMonthlyFull: ctx.statePension.monthlyFull ?? null,
    spStartYm: ctx.statePension.startYm ?? null,
    startYm: ctx.selectedMonth,
    remainingMonths: ctx.remainingMonths,
    grossIncomeToDate: inputs.grossIncomeToDate
  });
}

/** What the top-up box starts at (the wizard's top-up screen): none when the band is used up or not needed, else the need. */
export function topUpStart(isaCalc) {
  if (isaCalc.brlExhausted || isaCalc.targetAchievableAtBrl) return 0;
  return Math.round(isaCalc.isaNeeded);
}

/**
 * The top-up screen's answer settled (the wizard's settleTopUp): enough typed → tax-efficient; short (or the band used up) →
 * the choice made: 'increase' (top up what is needed), 'reduced' (take the band's limit), 'inefficient' (take it all and pay
 * the higher rate). Null when a choice is needed and none was made.
 * @returns {{ isaSavingsAllocation, isTaxEfficient, taxEfficiencyChoice, confirmedSalary }|null}
 */
export function settleTopUp(inputs, isaCalc, choice = null) {
  const typed = isaCalc.brlExhausted ? 0 : (inputs.isaSavingsAllocation || 0);
  const validation = validateIsaInput(typed, isaCalc.isaNeeded || 0, !!isaCalc.brlExhausted);
  const out = { isaSavingsAllocation: isaCalc.brlExhausted ? 0 : inputs.isaSavingsAllocation, isTaxEfficient: inputs.isTaxEfficient, taxEfficiencyChoice: inputs.taxEfficiencyChoice, confirmedSalary: inputs.confirmedSalary };
  if (validation.sufficient && !validation.isBrlExhausted) return { ...out, isTaxEfficient: true, taxEfficiencyChoice: 'efficient' };
  if (!choice) return null;
  if (choice === 'increase') return { ...out, taxEfficiencyChoice: choice, isaSavingsAllocation: isaCalc.isaNeeded, isTaxEfficient: true };
  if (choice === 'reduced') return { ...out, taxEfficiencyChoice: choice, confirmedSalary: inputs.brl, isaSavingsAllocation: 0, isTaxEfficient: true };
  if (choice === 'inefficient') return { ...out, taxEfficiencyChoice: choice, isaSavingsAllocation: 0, isTaxEfficient: false };
  return null;
}

/** What reaches the bank each month on the answers (the wizard's confirm screen and its save). */
export function breakdownFor(ctx, inputs) {
  return calculateMonthlyBreakdown({
    targetSalary: inputs.confirmedSalary,
    brl: inputs.brl,
    pa: inputs.pa,
    hrl: inputs.hrl || undefined,
    other: inputs.other,
    statePension: ctx.statePension.amount,
    statePensionMonthlyFull: ctx.statePension.monthlyFull ?? null,
    spStartYm: ctx.statePension.startYm ?? null,
    startYm: ctx.selectedMonth,
    isaSavingsAllocation: inputs.isaSavingsAllocation || 0,
    remainingMonths: ctx.remainingMonths,
    grossIncomeToDate: inputs.grossIncomeToDate,
    taxPaidToDate: inputs.taxPaidToDate,
    isTaxEfficient: inputs.isTaxEfficient
  });
}

/** The year as the set-up stores it (the wizard's finishWizard): the answers, the start month, and what reaches the bank. */
export function setUpConfigOf(ctx, inputs) {
  return buildTaxYearConfig({
    pa: inputs.pa,
    brl: inputs.brl,
    hrl: inputs.hrl,
    cpi: inputs.cpi,
    other: inputs.other,
    cgtExemptionUsed: inputs.cgtExemptionUsed || 0,
    isaSavingsAllocation: inputs.isaSavingsAllocation || 0,
    isTaxEfficient: inputs.isTaxEfficient,
    taxEfficiencyChoice: inputs.taxEfficiencyChoice,
    grossIncomeToDate: inputs.grossIncomeToDate,
    taxPaidToDate: inputs.taxPaidToDate,
    startMonth: parseInt(ctx.selectedMonth.split('-')[1]),
    confirmedSalary: inputs.confirmedSalary,
    remainingMonths: ctx.remainingMonths,
    statePension: ctx.statePension.amount,
    monthlyBreakdown: breakdownFor(ctx, inputs)
  });
}

/**
 * The suggested income before tax for the price rise typed (the wizard's first screen and its _updateWizardSalary): the plan's
 * schedule or its bridge figure as it is; the schedule again from its base when last year's price rise was only assumed; else
 * last year's figure (or the plan's) raised by the price rise, less the plan's yearly fall in spending.
 * `cpiTyped` null: the suggestion the screen opens with.
 */
export function suggestedIncomeFor(ctx, cpiTyped = null) {
  const fromSchedule = ctx.suggestionSource === 'budget-schedule' || ctx.suggestionSource === 'bridge';
  const fromScheduleAssumed = ctx.suggestionSource === 'budget-schedule' && ctx.schedulePrevCpiAssumed && ctx.scheduleSuggestedBase > 0;
  if (cpiTyped == null) {
    if (fromSchedule) return Math.round(ctx.suggestedSalary);
    return Math.round((ctx.suggestionBase ?? ctx.baseSalary) * (1 + ctx.defaults.cpi - (ctx.declineRate || 0)));
  }
  if (ctx.suggestionSource === 'bridge' || (ctx.suggestionSource === 'budget-schedule' && !fromScheduleAssumed)) return Math.round(ctx.suggestedSalary);
  if (fromScheduleAssumed) return Math.round(ctx.scheduleSuggestedBase * (1 + cpiTyped));
  return Math.round((ctx.suggestionBase ?? ctx.baseSalary) * (1 + cpiTyped - (ctx.declineRate || 0)));
}
