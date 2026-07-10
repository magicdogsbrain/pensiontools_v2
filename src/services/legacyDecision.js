/**
 * Legacy Decision Engine (de-inlined from index.html's calcDecisionPWA).
 *
 * This is the monthly Decision Tool calculation, now a real module. Storage/SP reads are
 * injected via `deps` ({ settings, history, allTaxYears, spInfo }); index.html builds them
 * in calcDecisionWithDeps and delegates here. Behaviour is pinned by the golden master
 * (tests/golden) — any change here shows up as a reviewed fixture diff.
 *
 * This is the seam the unification is progressively refactoring (proper tax, 6-April tax
 * year, one protection/glidepath/SP source), on the way to the unified DrawdownStrategy.
 */

import { getTaxYear, parseMonth } from '../utils/DateUtils.js';
import { DEFAULT_CPI } from './InflationModel.js';
import { grossToNet, calculateTax } from './TaxCalculator.js';
import { calculateGlidepath } from './GlidepathService.js';
import { planDrawdown } from './DrawdownStrategy.js';

// Tax year from a "YYYY-MM" string. Delegates to the canonical helper, which honours the
// 6 April boundary; parseMonth resolves the month to day 15 so month-granularity dates
// always land on the correct side of 6 April. Parity-proven vs the old `m >= 4` rule.
    export function getTaxYearFromDate(dateStr) {
      return getTaxYear(parseMonth(dateStr));
    }

    // Get year number (0-based from 2026)
    export function getYearNum(dateStr) {
      const [y, m] = dateStr.split('-').map(Number);
      return Math.max(0, (m >= 4 ? y : y - 1) - 2026);
    }



export async function calcDecisionPWA(dateStr, equity, bond, cash, deps) {
      const settings = deps.settings;
      const history = deps.history;
      const allTaxYears = deps.allTaxYears;
      const taxYear = getTaxYearFromDate(dateStr);
      const yearNum = getYearNum(dateStr);
      const [year, month] = dateStr.split('-').map(Number);

      // Validate that the tax year exists
      if (!allTaxYears[taxYear]) {
        throw new Error(`Tax year ${taxYear} is not configured. Please add it in the Settings tab before calculating.`);
      }

      const taxYearConfig = allTaxYears[taxYear];

      // Get tax config from the specific tax year
      const PA = taxYearConfig.pa || 12570;
      const BRL = taxYearConfig.brl || 50270;
      const HRL = taxYearConfig.hrl || 125140;
      const OTHER = taxYearConfig.other || 0;

      // Year-level tax efficiency settings (from wizard)
      const isTaxEfficientYear = taxYearConfig.isTaxEfficient !== false; // Default true
      const yearlyIsaSavingsAllocation = taxYearConfig.isaSavingsAllocation || 0;
      const grossIncomeToDate = taxYearConfig.grossIncomeToDate || 0;
      const confirmedSalary = taxYearConfig.confirmedSalary || settings.baseSalary;

      // Calculate ISA used so far EXCLUDING the current month (to prevent double-counting when recalculating)
      const existingMonthRecord = history.find(h => h.date === dateStr);
      const existingMonthIsa = existingMonthRecord?.isa || 0;
      const isaSavingsUsedSoFar = Math.max(0, (taxYearConfig.isaSavingsUsed || 0) - existingMonthIsa);

      // State pension comes from decision settings using HMRC forecast data
      // Uses the new spStartDate and spWeeklyAmount fields
      const spInfo = deps.spInfo;
      const STATE = spInfo.amount || 0;

      // Calculate cumulative inflation using each year's CPI (PWA logic)
      let cumInf = 1;
      for (let i = 0; i < yearNum; i++) {
        const yStr = String((26 + i) % 100).padStart(2, '0') + '/' + String((27 + i) % 100).padStart(2, '0');
        const yearCPI = (allTaxYears[yStr] || {}).cpi || DEFAULT_CPI; // was 0.04; unified to 2.5%
        cumInf *= 1 + yearCPI;
      }

      // Calculate glidepath minimums
      const adjEquity = Math.round(calculateGlidepath(settings.equityMin, yearNum, settings.duration, cumInf, true));
      const adjBond = Math.round(calculateGlidepath(settings.bondMin, yearNum, settings.duration, cumInf, true));
      const adjCash = Math.round(calculateGlidepath(settings.cashTarget, yearNum, settings.duration, cumInf, false));

      const totalGrowth = equity + bond;
      const minGrowth = adjEquity + adjBond;
      let inProtection = false;
      let consec = 0;

      // Get prior history for protection mode calculation
      const priorHistory = history.filter(h => h.date < dateStr);

      // Count consecutive Cash draws from history
      for (let i = priorHistory.length - 1; i >= 0; i--) {
        if (priorHistory[i].source === 'Cash') consec++;
        else break;
      }

      // Check if we're continuing protection from last month
      if (priorHistory.length && priorHistory[priorHistory.length - 1].inProtection) {
        inProtection = totalGrowth <= minGrowth + (settings.recoveryBuffer || 10000);
      }

      // Enter NEW protection if below minimum with consecutive cash draws
      if (!inProtection && totalGrowth < minGrowth && consec + 1 >= (settings.consecutiveLimit || 3)) {
        inProtection = true;
      }

      // Calculate remaining months in tax year
      const remainingMonths = month >= 4 ? (16 - month) : (4 - month);
      const effectiveRemainingMonths = Math.max(1, remainingMonths);

      // Use confirmed salary from wizard, or base salary with inflation
      const target = confirmedSalary * cumInf;
      const other = OTHER + STATE;
      const targetNet = grossToNet(target, PA, BRL, HRL);

      // Calculate ISA/SIPP based on year-level tax efficiency mode
      let sipp, isa, note;
      let stdSippForHistory = 0; // Standard SIPP before protection reduction, for tax boost tracking
      let boostAmount = 0;
      let protectionInducedTaxEfficiency = false;
      let isaSavingsUsedThisMonth = 0;

      // Calculate remaining ISA allocation
      const remainingIsaAllocation = Math.max(0, yearlyIsaSavingsAllocation - isaSavingsUsedSoFar);
      const monthlyIsaFromAllocation = remainingIsaAllocation / effectiveRemainingMonths;

      if (isTaxEfficientYear) {
        // TAX-EFFICIENT MODE: Use ISA to keep SIPP at/below BRL
        const monthlyFixedIncome = other / 12;

        // Calculate the STANDARD monthly SIPP (what we'd draw without protection)
        // This must be CONSISTENT regardless of prior protection draws
        //
        // Use the expectedMonthly.sipp.gross from tax year config (calculated by wizard)
        // This ensures stdSipp is always the same value regardless of protection history
        const thisTaxYearHistory = history.filter(h => h.taxYear === taxYear && h.date < dateStr);

        const monthlyTargetGross = target / 12;
        const isaBalance = deps.isaBalance || 0;
        let stdSipp, isaToUse;

        if (isaBalance > 0) {
          // ISA as a real pot via the shared DrawdownStrategy (Option A band management):
          // SIPP to BRL, ISA tops up the net gap tax-free, extra SIPP above BRL when the pot
          // can't cover it. Same engine as the Stress Tester (both call planDrawdown), which
          // is what lets a replayed Monte-Carlo trajectory agree with the Decision Tool.
          const plan = planDrawdown({
            targetGross: target, fixedIncome: other, pa: PA, brl: BRL, hrl: HRL,
            isaBalance,
            strategy: settings.isaDrawdownStrategy || 'minimiseEarlyTax',
            yearsUntilSp: 0
          });
          stdSipp = plan.sippGross / 12;
          isaToUse = plan.isaDraw / 12;
        } else {
          // Legacy per-tax-year ISA allocation path (unchanged when no ISA balance is set).
          if (taxYearConfig.expectedMonthly?.sipp?.gross > 0) {
            stdSipp = taxYearConfig.expectedMonthly.sipp.gross;
          } else {
            const brlHeadroom = Math.max(0, BRL - grossIncomeToDate - other);
            const maxMonthlySippAtBrl = brlHeadroom / 12;
            stdSipp = Math.min(monthlyTargetGross - monthlyFixedIncome, maxMonthlySippAtBrl);
          }
          const monthlyTargetNet = grossToNet(target, PA, BRL, HRL) / 12;
          const grossAtBrl = Math.min(target, BRL);
          const monthlyNetAtBrl = grossToNet(grossAtBrl, PA, BRL, HRL) / 12;
          const isaNeeded = Math.max(0, monthlyTargetNet - monthlyNetAtBrl);
          isaToUse = Math.min(isaNeeded, monthlyIsaFromAllocation);
        }
        isaSavingsUsedThisMonth = isaToUse;
        stdSippForHistory = stdSipp; // Capture for history (before protection reduction)

        if (inProtection) {
          // Protection = reduce SIPP draw by protection factor
          const protectionFactor = (settings.protectionFactor || 20) / 100;
          sipp = stdSipp * (1 - protectionFactor);
          isa = isaToUse;
          note = 'Protection';
        } else {
          sipp = stdSipp;
          isa = isaToUse;
          note = 'Tax-Efficient';

          // TAX BOOST: Catch up on protection shortfall (existing logic)
          const taxYearStart = month >= 4 ? year : year - 1;
          const thisTaxYearHistory = priorHistory.filter(h => {
            const [hy, hm] = h.date.split('-').map(Number);
            const hTaxYearStart = hm >= 4 ? hy : hy - 1;
            return hTaxYearStart === taxYearStart;
          });

          let protectionShortfall = 0;
          let annualSippSoFar = 0;

          thisTaxYearHistory.forEach(h => {
            annualSippSoFar += h.sipp || 0;
            if (h.inProtection && h.stdSipp) {
              protectionShortfall += (h.stdSipp - h.sipp);
            }
            if (h.boostAmount > 0) {
              protectionShortfall -= h.boostAmount;
            }
          });

          if (protectionShortfall > 0) {
            const projectedAnnualTaxable = annualSippSoFar + sipp * effectiveRemainingMonths + other;
            const brlHeadroom = BRL - projectedAnnualTaxable;
            const surplus = totalGrowth - minGrowth - (settings.recoveryBuffer || 10000);

            if (brlHeadroom > 0 && surplus > 0) {
              const maxBoostFromBRL = brlHeadroom / effectiveRemainingMonths;
              const catchUpPerMonth = protectionShortfall / effectiveRemainingMonths;
              const maxBoostFromSurplus = surplus / effectiveRemainingMonths;

              boostAmount = Math.min(catchUpPerMonth, maxBoostFromBRL, maxBoostFromSurplus);

              if (boostAmount > 50) {
                sipp += boostAmount;
                note = 'Tax Boost';
              }
            }
          }
        }
      } else {
        // TAX-INEFFICIENT MODE: Full SIPP draw to target, no ISA
        const monthlyTargetGross = target / 12;
        const monthlyFixedIncome = other / 12;

        // Use expected monthly SIPP from tax year config if available (set by wizard)
        let stdSipp;
        if (taxYearConfig.expectedMonthly?.sipp?.gross > 0) {
          stdSipp = taxYearConfig.expectedMonthly.sipp.gross;
        } else {
          // Fallback: calculate fresh (for older tax years without expectedMonthly)
          stdSipp = Math.max(0, monthlyTargetGross - monthlyFixedIncome);
        }
        stdSippForHistory = stdSipp; // Capture for history (before protection reduction)

        isa = 0; // No ISA in tax-inefficient mode

        if (inProtection) {
          // Protection = reduce SIPP draw by protection factor
          const protectionFactor = (settings.protectionFactor || 20) / 100;
          sipp = stdSipp * (1 - protectionFactor);
          note = 'Protection';

          // Check for protection-induced tax efficiency
          // If protection has reduced projected annual taxable below BRL, we can boost to BRL
          const taxYearStart = month >= 4 ? year : year - 1;
          const thisTaxYearHistory = priorHistory.filter(h => {
            const [hy, hm] = h.date.split('-').map(Number);
            const hTaxYearStart = hm >= 4 ? hy : hy - 1;
            return hTaxYearStart === taxYearStart;
          });

          let annualSippSoFar = 0;
          thisTaxYearHistory.forEach(h => {
            annualSippSoFar += h.sipp || 0;
          });

          const projectedAnnualTaxable = annualSippSoFar + sipp * effectiveRemainingMonths + other;

          if (projectedAnnualTaxable < BRL) {
            // Protection has brought us below BRL - we can boost back up to BRL
            const brlHeadroom = BRL - projectedAnnualTaxable;
            const maxBoostPerMonth = brlHeadroom / effectiveRemainingMonths;
            const surplus = totalGrowth - minGrowth - (settings.recoveryBuffer || 10000);

            if (surplus > 0 && maxBoostPerMonth > 50) {
              boostAmount = Math.min(maxBoostPerMonth, surplus / effectiveRemainingMonths);
              if (boostAmount > 50) {
                sipp += boostAmount;
                protectionInducedTaxEfficiency = true;
                note = 'Protection-Induced Efficiency';
              }
            }
          }
        } else {
          sipp = stdSipp;
          note = 'Tax-Inefficient';

          // TAX BOOST in tax-inefficient mode: If we had protection periods earlier,
          // we may be able to catch up while staying under BRL
          const taxYearStart = month >= 4 ? year : year - 1;
          const thisTaxYearHistory = priorHistory.filter(h => {
            const [hy, hm] = h.date.split('-').map(Number);
            const hTaxYearStart = hm >= 4 ? hy : hy - 1;
            return hTaxYearStart === taxYearStart;
          });

          let protectionShortfall = 0;
          let annualSippSoFar = 0;

          thisTaxYearHistory.forEach(h => {
            annualSippSoFar += h.sipp || 0;
            if (h.inProtection && h.stdSipp) {
              protectionShortfall += (h.stdSipp - h.sipp);
            }
            if (h.boostAmount > 0) {
              protectionShortfall -= h.boostAmount;
            }
          });

          if (protectionShortfall > 0) {
            // Check if we can boost while staying under BRL
            const projectedAnnualTaxable = annualSippSoFar + sipp * effectiveRemainingMonths + other;
            const brlHeadroom = BRL - projectedAnnualTaxable;
            const surplus = totalGrowth - minGrowth - (settings.recoveryBuffer || 10000);

            if (brlHeadroom > 0 && surplus > 0) {
              const maxBoostFromBRL = brlHeadroom / effectiveRemainingMonths;
              const catchUpPerMonth = protectionShortfall / effectiveRemainingMonths;
              const maxBoostFromSurplus = surplus / effectiveRemainingMonths;

              boostAmount = Math.min(catchUpPerMonth, maxBoostFromBRL, maxBoostFromSurplus);

              if (boostAmount > 50) {
                sipp += boostAmount;
                note = 'Tax Boost';
              }
            }
          }
        }
      }

      // Store stdSipp for future catch-up calculations
      const stdSippMonthly = (BRL - other) / 12;

      // Determine withdrawal source
      let source, reason, dEquity = 0, dBond = 0, dCash = 0, warn = '';

      if (!inProtection && totalGrowth >= minGrowth + sipp) {
        source = 'Growth';
        const pS = Math.max(0, equity - adjEquity);
        const cS = Math.max(0, bond - adjBond);
        const tot = pS + cS;
        if (tot > 0) {
          dEquity = sipp * pS / tot;
          dBond = sipp * cS / tot;
          reason = 'Healthy';
        } else {
          source = 'Cash';
          dCash = sipp;
          reason = 'At min';
        }
      } else {
        source = 'Cash';
        dCash = sipp;
        reason = inProtection ? 'Protection' : 'Below min';
        if (cash < sipp) warn = 'Cash low!';
      }

      // Rebalancing check
      let rebal = '';
      const pDev = equity - adjEquity;
      const cDev = bond - adjBond;
      if (pDev > 5000 && cDev < -5000) {
        const mv = Math.floor(Math.min(pDev, -cDev) / 1000) * 1000;
        if (mv >= 5000) rebal = `Move £${mv.toLocaleString()} Equity→Bond`;
      } else if (cDev > 5000 && pDev < -5000) {
        const mv = Math.floor(Math.min(cDev, -pDev) / 1000) * 1000;
        if (mv >= 5000) rebal = `Move £${mv.toLocaleString()} Bond→Equity`;
      }

      // Cash replenishment suggestion
      let cashReplenish = '';
      const cashShortfall = adjCash - cash;
      if (cashShortfall > 5000 && source === 'Growth' && !inProtection) {
        const excess = totalGrowth - minGrowth - sipp;
        if (excess > 10000) {
          const repAmount = Math.floor(Math.min(cashShortfall * 0.3, excess * 0.5) / 1000) * 1000;
          if (repAmount >= 5000) {
            cashReplenish = `Replenish Cash: Move £${repAmount.toLocaleString()} from growth funds`;
          }
        }
      }

      // Build alerts array
      const alerts = [];
      if (warn) {
        alerts.push({ message: warn, severity: 'danger', type: 'low-cash' });
      }
      if (boostAmount > 50) {
        alerts.push({ message: `Tax Boost: +£${Math.round(boostAmount).toLocaleString()}/mo catch-up from protection shortfall`, severity: 'success', type: 'tax-boost' });
      }
      if (rebal) {
        alerts.push({ message: rebal, severity: 'warning', type: 'rebalance' });
      }
      if (cashReplenish) {
        alerts.push({ message: cashReplenish, severity: 'info', type: 'cash-replenish' });
      }

      // Calculate annual tax based on ACTUAL income for the year
      // Sum up: history SIPP + this month's SIPP + projected remaining at stdSipp
      const taxYearStart = month >= 4 ? year : year - 1;
      const thisTaxYearHistory = priorHistory.filter(h => {
        const [hy, hm] = h.date.split('-').map(Number);
        const hTaxYearStart = hm >= 4 ? hy : hy - 1;
        return hTaxYearStart === taxYearStart;
      });

      // SIPP drawn so far this tax year (from history)
      const sippYTD = thisTaxYearHistory.reduce((sum, h) => sum + (h.sipp || 0), 0);

      // Calculate remaining months after this one
      const monthsPassedIncludingThis = thisTaxYearHistory.length + 1;
      const monthsRemaining = Math.max(0, 12 - monthsPassedIncludingThis);

      // Use stdSipp for projected remaining months (standard draw without boost/protection)
      const projectedRemainingSipp = monthsRemaining * stdSippForHistory;

      // Total annual SIPP = YTD + this month + projected remaining at standard rate
      const totalAnnualSipp = sippYTD + sipp + projectedRemainingSipp;

      // Annual taxable = total SIPP + Other + State Pension
      const annualTaxable = totalAnnualSipp + OTHER + STATE;

      // Proper HMRC bands: 20% to BRL, 40% to HRL, 45% above, plus PA taper over £100k.
      const annualTax = calculateTax(annualTaxable, PA, BRL, HRL);

      // Monthly tax = annual tax / 12 (even distribution)
      const monthlyTax = annualTax / 12;

      // Net = gross taxable this month - monthly tax + ISA (tax-free)
      const monthlyTaxable = sipp + OTHER / 12 + STATE / 12;
      const monthlyNet = monthlyTaxable - monthlyTax + isa;

      // Calculate YTD tax paid (based on actual annual tax, distributed evenly)
      const taxPaidYTD = monthlyTax * monthsPassedIncludingThis;

      // Projected annual tax is now based on actual income profile
      const taxProjectedAnnual = annualTax;

      // Calculate tax saved vs inefficient scenario
      const inefficientMonthlyTaxable = (target / 12); // Full target draw
      const inefficientAnnualTax = calculateTax(inefficientMonthlyTaxable * 12, PA, BRL, HRL);
      const taxSavedMonthly = Math.max(0, (inefficientAnnualTax / 12) - (annualTax / 12));

      // Calculate cumulative ISA used including this month
      const cumulativeIsaSavingsUsed = isaSavingsUsedSoFar + isaSavingsUsedThisMonth;

      // Return object matching renderDecisionPanel expectations
      return {
        // Context
        date: dateStr,
        taxYear,
        yearNumber: yearNum,
        remainingMonths: effectiveRemainingMonths,

        // Fund values
        equity,
        bond,
        cash,
        isa: 0, // Legacy field - ISA balance input not used

        // Glidepath minimums (match expected field names)
        adjEquityMin: adjEquity,
        adjBondMin: adjBond,
        adjCashTarget: adjCash,

        // Tax thresholds
        pa: PA,
        brl: BRL,

        // Income sources (monthly)
        other: OTHER / 12,
        statePension: STATE / 12,

        // Recommended draws
        sippDraw: sipp,
        stdSipp: stdSippForHistory, // Standard SIPP before protection, for tax boost tracking
        isaDraw: isa,
        totalMonthlyNet: monthlyNet,

        // Year-level tax efficiency
        isTaxEfficientYear,
        yearlyIsaSavingsAllocation,
        cumulativeIsaSavingsUsed,
        isaSavingsUsedThisMonth,

        // Tax tracking
        taxPaidYTD,
        taxProjectedAnnual,
        taxSavedMonthly,
        taxSavedYTD: taxSavedMonthly * monthsPassedIncludingThis,
        taxSavedProjectedAnnual: taxSavedMonthly * 12,

        // Status flags
        taxEfficient: isTaxEfficientYear && !protectionInducedTaxEfficiency,
        inProtection,
        protectionReason: inProtection ? reason : null,
        consecutiveCashDraws: consec,
        protectionInducedTaxEfficiency,

        // Tax boost
        boostAmount: boostAmount > 50 ? boostAmount : 0,
        boostEligible: boostAmount > 50,

        // Withdrawal source
        source,
        drawFromEquity: dEquity,
        drawFromBond: dBond,
        drawFromCash: dCash,

        // Rebalancing
        rebalanceNeeded: rebal !== '',
        rebalanceActions: rebal ? [rebal] : [],

        // Alerts
        alerts,

        // Calculation details for debug
        calculationDetails: {
          mode: note,
          reason: `${reason} | ${note}`,
          totalGrowth,
          minGrowth,
          consec,
          stdSipp: sipp, // Current SIPP draw
          // Input values for debugging
          inputs: {
            baseSalary: settings.baseSalary,
            confirmedSalary,
            targetGross: target,
            cumInf,
            yearNum,
            taxYear,
            OTHER,
            STATE,
            PA,
            BRL,
            isTaxEfficientYear,
            yearlyIsaSavingsAllocation,
            grossIncomeToDate
          },
          taxInfo: {
            annualTaxable: annualTaxable,
            headroomToBRL: BRL - annualTaxable,
            annualTax,
            monthlyNet: monthlyNet
          }
        }
      };
    }
