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
import { calculateTax, grossToNet } from './TaxCalculator.js';
import { planDrawdown } from './DrawdownStrategy.js';
import { taxFreeFractionOf } from './FlexibleAccess.js';
import { TAX_DEFAULTS } from '../constants.js';
import { spendingDeclineRateForYear, spendingSmileFactor } from './SpendingModel.js';
import { decisionAnchorYear, yearOfTaxKey, taxYearKey, taxYearLabel } from './PlanTiming.js';
import { pensionLockOf, closedYearsWords } from './PensionLock.js';
import { scheduleFromSteps } from './IncomeSchedule.js';


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
    grossIncomeToDate = 0, // Income already received before starting pension
    pensionClosed = false // the pension cannot be touched this tax year (7.4.1): the savings pay the whole of it
  } = params;

  // Tax on a gross income: the ONE sum in TaxCalculator (6.16.0). The copy that lived here stopped at
  // 40% — no 45% band and no loss of the allowance above £100,000.
  const calcTax = (gross) => calculateTax(gross, pa, brl, hrl);

  // A year the pension is closed (7.4.1): nothing is drawn from it, so the ISA and other savings pay all that the income asked
  // for leaves in the hand on top of the other income — tax-free, so only its net. No band to keep within, no choice to make.
  if (pensionClosed) {
    const fixed = (other || 0) + (statePension || 0);
    const isaNeededAnnual = Math.max(0, (targetAnnualGross - calcTax(targetAnnualGross)) - (fixed - calcTax(fixed)));
    return {
      isaNeeded: (isaNeededAnnual / 12) * remainingMonths, isaNeededAnnual,
      brlExhausted: false, remainingBrlHeadroom: Math.max(0, brl - grossIncomeToDate), maxTaxEfficientSalary: brl, reducedSalaryOption: brl,
      canBeTaxEfficient: true, targetAchievableAtBrl: false, pensionClosed: true,
      reason: 'The pension cannot be touched this tax year: the ISA and other savings pay it'
    };
  }

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
export function wizardDataFrom(selectedMonth, { settings, stressSettings = null, existingConfig, allTaxYears, statePensionInfo, now = new Date(), history = [] }) {
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
  // legacyDecision). Negative only on a plan stored the old way, with a later start: its tracks read as year 0.
  const planStartYear = decisionAnchorYear(settings, allTaxYears, taxYear, stressSettings);
  const planYearSigned = yearOfTaxKey(taxYear) - planStartYear;
  const planYear = Math.max(0, planYearSigned);
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
    // the plan's income a year as every engine reads it: a stored schedule, else the steps compiled (IncomeSchedule.js), else
    // a level plan's one figure every year — read so only while no year has been confirmed (the chain below follows a
    // confirmed figure); a plan's first year is never grown by a year of prices that has not passed
    const level = !(prevYearConfig && prevYearConfig.confirmedSalary) && +(stress && stress.baseSalary) > 0 ? +stress.baseSalary : null;
    const sched = stress ? (scheduleFromSteps(stress) || (level ? Array.from({ length: Math.max(1, +stress.duration || 35) + 1 }, () => level) : null)) : null;
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

  // The pension cannot be touched in this tax year (7.4.1, services/PensionLock.js; read from the plan's Stress settings, which
  // hold the age): the year is set up with nothing from the pension, and its income comes from the other savings.
  let pensionClosed = null;
  try {
    const lock = stressSettings ? pensionLockOf(stressSettings, { now, fromTaxYear: yearOfTaxKey(taxYear) }) : null;
    if (lock) pensionClosed = { accessAge: lock.accessAge, opensTaxYear: lock.opensTaxYear, words: closedYearsWords({ accessAge: lock.accessAge }) };
  } catch { pensionClosed = null; }

  const suggestedSalary = scheduleSuggestedSalary ?? chainSuggestedSalary;
  const suggestionSource = scheduleSuggestedSalary != null ? 'budget-schedule' : 'chain';

  return {
    taxYear,
    selectedMonth,
    isApril,
    remainingMonths,
    // the day the year is set up on (step F2, lead4.md D7): kept with the set-up, so it is read as the dated record it is
    setUpOn: now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0'),
    // Where this tax year sits in the plan (6.4.0): year 0 is the plan's first tax year.
    planStartYear,
    planYear: planYearSigned,
    // The share of each pension payment that is tax-free this year (7.12.0): the month's own rule (FlexibleAccess)
    taxFreeFraction: taxFreeFractionOf(settings, history, planYear),
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
    existingConfig: existingConfig.yearSetupComplete ? existingConfig : null,
    // A year the pension cannot be touched (7.4.1): only then, so every other year's set-up is what it always was
    ...(pensionClosed ? { pensionClosed } : {})
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
  return 'We assume a tax-free allowance of ' + gbp(pa) + ', then 20% tax on income up to ' + gbp(brl) + ', 40% up to ' + gbp(hrl) + ' and 45% above.';
}

/**
 * The State Pension for the set-up, as one fact (7.12.0: ONE reader for both views; the simple view words it from
 * copy/month.js, the full view from statePensionLine). `sp` is getStatePensionForTaxYear's result (this tax year's amount:
 * 0 when it starts in a later year); `planYearly` the plan's own yearly amount (Decision settings `statePension`, else the
 * Stress settings' weekly amount × 52), so "no amount" is said only when the plan truly holds none.
 *   { id: 'paying' | 'startsThisYear' | 'later' | 'noAmount' | 'none', slots: { when, monthly, amount, yearly } }
 * @param {string} ym 'YYYY-MM' the set-up starts from
 */
export function statePensionFact(sp, ym, planYearly = 0) {
  const s = sp || {};
  const amount = +s.amount || 0;
  const when = s.startDate || s.startYm || null;
  const yearly = +planYearly > 0 ? +planYearly : 0;
  if (!amount) {
    // it starts in a later tax year and the plan holds an amount: said as that amount, from that date
    const key = ym ? String(ym).slice(0, 7) : null;
    const yearEnd = key ? (+key.slice(5, 7) >= 4 ? (+key.slice(0, 4) + 1) : +key.slice(0, 4)) + '-03' : null;
    const startYm = s.startYm || ymOfWords(when);
    if (when && yearly > 0 && startYm && yearEnd && String(startYm) > yearEnd) return { id: 'later', slots: { when, yearly: gbp(yearly) } };
    return { id: when ? 'noAmount' : 'none', slots: { when } };
  }
  const monthly = s.monthlyFull != null ? +s.monthlyFull : (s.monthly != null ? +s.monthly : amount / 12);
  const started = s.startYm ? (!ym || String(s.startYm) <= String(ym)) : !!s.isReceiving;
  if (!started && !s.isReceiving) return { id: 'later', slots: { when, yearly: gbp(yearly || amount) } };
  return { id: started ? 'paying' : 'startsThisYear', slots: { when, monthly: gbp(monthly), amount: gbp(amount) } };
}

const MONTH_NAMES = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
/** 'YYYY-MM' of a date in words ('16 November 2031', 'November 2031') or already 'YYYY-MM(-DD)'; null otherwise. */
function ymOfWords(v) {
  const t = String(v || '').trim();
  const iso = /^(\d{4})-(\d{2})/.exec(t);
  if (iso) return iso[1] + '-' + iso[2];
  const w = /([A-Za-z]+)\s+(\d{4})/.exec(t);
  const i = w ? MONTH_NAMES.indexOf(w[1].toLowerCase()) : -1;
  return i >= 0 ? w[2] + '-' + String(i + 1).padStart(2, '0') : null;
}

/** The full view's words for statePensionFact (the simple view's are copy/month.js setUp.statePension). */
const SP_WORDS = {
  paying: 'State Pension: {monthly} a month ({amount} this tax year).',
  startsThisYear: 'State Pension: starts {when}, {monthly} a month ({amount} this tax year).',
  later: 'State Pension: {yearly} a year from {when}. None is paid in {year}.',
  noAmount: 'State Pension: starts {when}. Your plan has no amount for it yet. You can add your forecast under Settings.',
  none: 'State Pension: not in your plan. You can add your forecast under Settings.'
};

/**
 * The State Pension line for the full view's set-up: statePensionFact in words. Never "the amount is not in your plan" for a
 * State Pension the plan holds but that starts in a later tax year.
 */
export function statePensionLine(sp, selectedMonth, planYearly = 0, key = '') {
  const f = statePensionFact(sp, selectedMonth, planYearly);
  const m = /^(\d{4})-(\d{2})/.exec(String(selectedMonth || ''));
  const Y = key ? yearOfTaxKey(key) : m ? (+m[2] >= 4 ? +m[1] : +m[1] - 1) : NaN;
  const year = Number.isFinite(Y) ? taxYearLabel(Y) : '';
  return SP_WORDS[f.id].replace(/\{(\w+)\}/g, (m, k) => (k === 'year' ? year : f.slots[k] != null ? String(f.slots[k]) : m));
}

/**
 * Why less reaches the bank this tax year than in a full one (7.12.0): a set-up part-way through the year, money received
 * before it, and the after-tax month £1 or more below a full year's (`grossToNet(income) / 12`). { full, month, before }
 * as pounds and the month the set-up runs from, or null.
 */
export function partYearReason(ctx, inputs, breakdown) {
  if (!ctx || ctx.isApril || !(+inputs.grossIncomeToDate > 0) || !breakdown) return null;
  const full = grossToNet(+inputs.confirmedSalary || 0, inputs.pa, inputs.brl, inputs.hrl || undefined) / 12;
  if (!(Math.round(full) - Math.round(breakdown.totalNet) >= 1)) return null;
  const d = parseMonth(ctx.selectedMonth);
  // what the pension would pay a month before tax for the full year's after-tax month to reach the bank this tax year
  // (the same breakdown, its income raised until the month's after-tax figure is the full one); null when nothing finds it
  let take = null;
  try {
    const at = (T) => breakdownFor(ctx, { ...inputs, confirmedSalary: T });
    let lo = +inputs.confirmedSalary || 0, hi = lo * 2 + 1000;
    if (at(hi).totalNet >= full) {
      for (let i = 0; i < 60; i++) { const mid = (lo + hi) / 2; if (at(mid).totalNet < full) lo = mid; else hi = mid; }
      const b = at(hi);
      if (b && b.sipp && b.sipp.gross > 0) take = gbp(b.sipp.gross);
    }
  } catch (e) { take = null; }
  return { full: gbp(full), month: gbp(breakdown.totalNet), before: d.toLocaleDateString('en-GB', { month: 'long' }), take };
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
    isTaxEfficient = true,
    pensionClosed = false,            // the pension cannot be touched this tax year (7.4.1): nothing from it
    taxFreeFraction = 0               // the share of each pension payment that is tax-free (7.12.0, FlexibleAccess)
  } = params;
  const f = Math.max(0, Math.min(0.75, +taxFreeFraction || 0));

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
  const monthsLeft = Math.max(1, Math.min(12, remainingMonths || 12));
  const receivedBefore = monthsLeft < 12 ? (grossIncomeToDate || 0) : 0;

  if (pensionClosed) {
    // A closed year (7.4.1): nothing from the pension; the ISA and other savings pay what was set aside for the year.
    monthlySippGross = 0;
    monthlyIsaNet = isaSavingsAllocation / remainingMonths;
  } else if (f > 0) {
    // A part of each payment tax-free (7.12.0): the pension figure is the month's own (legacyDecision's planDrawdown call),
    // so the set-up and the month say the same pension, tax and after-tax figures. With f = 0 nothing here runs.
    const fixedAnnual = monthlyFixedIncomeGross * 12;
    if (isTaxEfficient) {
      const share = monthsLeft / 12;
      const p = planDrawdown({ targetGross: targetSalary * share + receivedBefore, fixedIncome: fixedAnnual * share + receivedBefore, pa, brl, hrl, taxFreeFraction: f, isaBalance: isaSavingsAllocation || 0, yearsUntilSp: 0 });
      monthlySippGross = p.sippGross / monthsLeft;
      monthlyIsaNet = p.isaDraw / monthsLeft;
    } else {
      const p = planDrawdown({ targetGross: targetSalary, fixedIncome: fixedAnnual + receivedBefore, pa, brl, hrl, taxFreeFraction: f, isaBalance: 0, yearsUntilSp: 0 });
      monthlySippGross = p.sippGross / 12;
      monthlyIsaNet = 0;
    }
  } else if (!isTaxEfficient) {
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
  // only the taxable part of each pension payment is taxed (f = 0: all of it)
  const monthlySippTaxable = monthlySippGross * (1 - f);
  const drawsThisYear = (monthlySippTaxable + monthlyOtherGross) * months + spInDraws;
  const priorIncome = months < 12 ? (grossIncomeToDate || 0) : 0;
  // With the tax already paid known (payslips), what is still to come is the year's total less that —
  // right for a retiree drawing under cumulative PAYE since April, whose earlier months already carried
  // their share of the higher-rate band. Otherwise the old assumption: the earlier income was taxed on
  // its own bands (an ex-employee starting a pension mid-year).
  const priorTax = (months < 12 && taxPaidToDate != null && taxPaidToDate !== '') ? Math.max(0, +taxPaidToDate || 0) : calcTax(priorIncome);
  const annualTax = Math.max(0, calcTax(drawsThisYear + priorIncome) - priorTax);
  const monthlyTax = annualTax / months;

  // Calculate net for taxable sources (proportional tax allocation)
  const totalTaxableGross = monthlySippTaxable + monthlyFixedIncomeGross;
  const taxProportion = totalTaxableGross > 0 ? monthlyTax / totalTaxableGross : 0;

  const monthlySippTax = monthlySippTaxable * taxProportion;
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
    ...(pensionClosed ? { pensionClosed: true } : {}),

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
    monthlyBreakdown,
    setUpOn,
    planSaid
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

    // The day it was set up and the plan's own figure for the year that day (step F2, lead4.md D7): the year as set up is a
    // dated record, and a later change to the plan is read against what the plan said when it was set up
    ...(setUpOn ? { setUpOn } : {}),
    ...(Number.isFinite(+planSaid) && +planSaid > 0 ? { planSaid: Math.round(+planSaid) } : {}),

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
    grossIncomeToDate: inputs.grossIncomeToDate,
    pensionClosed: !!ctx.pensionClosed
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
  // a closed year (7.4.1): what is set aside from the savings is the year's income; there is no pension to choose between
  if (isaCalc.pensionClosed) return { isaSavingsAllocation: inputs.isaSavingsAllocation, isTaxEfficient: true, taxEfficiencyChoice: 'efficient', confirmedSalary: inputs.confirmedSalary };
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
    isTaxEfficient: inputs.isTaxEfficient,
    pensionClosed: !!ctx.pensionClosed,
    taxFreeFraction: ctx.taxFreeFraction || 0
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
    monthlyBreakdown: breakdownFor(ctx, inputs),
    setUpOn: ctx.setUpOn || null,
    // the plan's figure for the year, by the very call the reading makes later (src/reading/thisYear.js)
    planSaid: suggestedIncomeFor(ctx, Number.isFinite(+inputs.cpi) ? +inputs.cpi : null)
  });
}

/**
 * The suggested income before tax for the price rise typed (the wizard's first screen and its _updateWizardSalary): the plan's
 * schedule as it is; the schedule again from its base when last year's price rise was only assumed; else
 * last year's figure (or the plan's) raised by the price rise, less the plan's yearly fall in spending.
 * `cpiTyped` null: the suggestion the screen opens with.
 */
export function suggestedIncomeFor(ctx, cpiTyped = null) {
  const fromSchedule = ctx.suggestionSource === 'budget-schedule';
  const fromScheduleAssumed = ctx.suggestionSource === 'budget-schedule' && ctx.schedulePrevCpiAssumed && ctx.scheduleSuggestedBase > 0;
  if (cpiTyped == null) {
    if (fromSchedule) return Math.round(ctx.suggestedSalary);
    return Math.round((ctx.suggestionBase ?? ctx.baseSalary) * (1 + ctx.defaults.cpi - (ctx.declineRate || 0)));
  }
  if (ctx.suggestionSource === 'budget-schedule' && !fromScheduleAssumed) return Math.round(ctx.suggestedSalary);
  if (fromScheduleAssumed) return Math.round(ctx.scheduleSuggestedBase * (1 + cpiTyped));
  return Math.round((ctx.suggestionBase ?? ctx.baseSalary) * (1 + cpiTyped - (ctx.declineRate || 0)));
}
