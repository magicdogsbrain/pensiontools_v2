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
import { cappedInflation as calculateCappedInflation, OTHER_INCOME_CAP } from './InflationModel.js';
import { planDrawdown } from './DrawdownStrategy.js';
import { spSimConfigFromSettings } from '../utils/StatePensionUtils.js';
import { spendingSmileFactor } from './SpendingModel.js';

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

  // ISA bridge + drawdown via the SAME planDrawdown the engine and Decision Tool use, so the SIPP/ISA
  // split matches them exactly. baseSalary is a GROSS target: SIPP fills the basic-rate band, then the
  // ISA tops the NET take-home up to the take-home of that gross salary. The remaining ISA rolls up at
  // the money-market rate (~inflation - 1% real, FCA, floored at 0% nominal). Deterministic projection.
  let isaBalance = settings.isaBalance || 0;
  const isaReturn = Math.max(0, assumedInflation - 0.01);

  // Same SP derivation as the Monte-Carlo config (shared helper): date-based when a real SP
  // date is set, legacy statePension/statePensionYear fields otherwise.
  const spCfg = spSimConfigFromSettings(settings);
  const spStartYear = spCfg ? spCfg.spStartYear : (settings.statePensionYear ?? Infinity);
  const spAnnualBase = spCfg ? spCfg.spWeeklyAmount * 52 : (settings.statePension || 0);
  const spFirstYearRatio = spCfg ? spCfg.spFirstYearRatio : 1;

  // UFPLS/phased access — the same treatment as both live engines: 25% of each withdrawal
  // tax-free during the UFPLS phase, until the lifetime Lump Sum Allowance runs out.
  let lsaRemaining = settings.accessMethod === 'ufpls' ? 268275 : 0;

  for (let year = 0; year <= duration; year++) {
    const cumInf = Math.pow(1 + assumedInflation, year);
    const pa = settings.taxMode === 'frozen' ? settings.pa : settings.pa * cumInf;
    const brl = settings.taxMode === 'frozen' ? settings.brl : settings.brl * cumInf;
    const hrl = settings.taxMode === 'frozen' ? (settings.hrl || 125140) : (settings.hrl || 125140) * cumInf;

    // Declining-spending profile — shared spending smile (level 0-4, ~1%/yr decline 5-24, level after).
    // Same curve as SimulationEngine.spendingFactor and the Decision wizard.
    const spendFactor = spendingSmileFactor(year, settings.spendingProfile || 'flat');
    const scheduledTarget = Array.isArray(settings.targetSchedule) && settings.targetSchedule[year] != null
      ? settings.targetSchedule[year]
      : (settings.baseSalary || 0);
    const target = scheduledTarget * cumInf * spendFactor;

    // Other pension: CPI-capped uplift (4%), matching the stress engine's cappedInflation.
    const other = (settings.other || 0) * Math.pow(1 + Math.min(assumedInflation, OTHER_INCOME_CAP), year);
    let statePension = 0;
    if (year >= spStartYear && spAnnualBase > 0) {
      statePension = spAnnualBase * (year === spStartYear ? spFirstYearRatio : 1) * cumInf;
    }
    let dbPension = 0;
    if (settings.dbAmount > 0 && year >= (settings.dbStartYear || 0)) {
      const mode = settings.dbIndexation || 'lpi5';
      if (mode === 'level') dbPension = settings.dbAmount;
      else if (mode === 'cpi') dbPension = settings.dbAmount * cumInf;
      else dbPension = settings.dbAmount * Math.pow(1 + Math.min(assumedInflation, 0.05), year);
    }
    let extraIncome = 0;
    for (const inc of settings.extraIncomes || []) {
      if (inc.annual > 0 && year >= (inc.startYear || 0) && (inc.endYear == null || year <= inc.endYear)) {
        const mode = inc.indexation || 'lpi5';
        if (mode === 'level') extraIncome += inc.annual;
        else if (mode === 'cpi') extraIncome += inc.annual * cumInf;
        else extraIncome += inc.annual * Math.pow(1 + Math.min(assumedInflation, 0.05), year);
      }
    }
    const fixed = other + statePension + dbPension + extraIncome;
    const yearsUntilSp = Math.max(0, spStartYear === Infinity ? 0 : spStartYear - year);

    const inUfplsPhase = !settings.ufplsYears || year < settings.ufplsYears;
    const taxFreeFraction = (settings.accessMethod === 'ufpls' && inUfplsPhase && lsaRemaining > 0) ? 0.25 : 0;

    const plan = planDrawdown({
      targetGross: target, fixedIncome: fixed, pa, brl, hrl,
      isaBalance, strategy: settings.isaDrawdownStrategy, yearsUntilSp,
      taxFreeFraction
    });
    if (lsaRemaining > 0) lsaRemaining = Math.max(0, lsaRemaining - (plan.taxFree || 0));

    const netFromTaxable = plan.taxable - plan.tax; // SIPP + fixed income, net of tax
    const isaStart = isaBalance;
    isaBalance = plan.remainingIsa * (1 + isaReturn);

    schedule.push({
      year,
      brl,
      other,
      statePension,
      sippDraw: plan.sippGross,
      totalTaxable: plan.taxable,
      tax: plan.tax,
      netIncome: netFromTaxable,
      target,
      isaDraw: plan.isaDraw,
      isaBalance: isaStart,
      spendable: plan.net
    });
  }

  return schedule;
}
