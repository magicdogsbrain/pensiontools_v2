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
import { DECISION_ASSUMED_CPI } from './InflationModel.js';
import { grossToNet, calculateTax } from './TaxCalculator.js';
import { calculateGlidepath, glideShareForYear } from './GlidepathService.js';
import { planDrawdown } from './DrawdownStrategy.js';
import { assessProtection, PROTECTION_DEFAULTS, protectionMultForStreak } from './ProtectionStrategy.js';
import { planTaxBoost, BOOST_DEFAULTS, planBandFillRecycle, RECYCLE_DEFAULTS } from './TaxBoostStrategy.js';
import { planSourcing } from './WithdrawalSourcing.js';

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
        const yearCPI = (allTaxYears[yStr] || {}).cpi || DECISION_ASSUMED_CPI; // entered CPI is authoritative; unentered assumes 4%
        cumInf *= 1 + yearCPI;
      }

      // Calculate glidepath minimums
      // Depleting fund minimums. With the rising-equity glidepath ("bond tent") on, the entered
      // equity/bond split is overridden: only their TOTAL matters, re-divided by the glide's target
      // share for this year (identical formula to the Stress engine, so the two stay in lockstep).
      // Cash is left alone. Glide off (equityGlide falsy) → byte-identical to the old behaviour.
      let adjEquity = calculateGlidepath(settings.equityMin, yearNum, settings.duration, cumInf, true);
      let adjBond = calculateGlidepath(settings.bondMin, yearNum, settings.duration, cumInf, true);
      const adjCash = Math.round(calculateGlidepath(settings.cashTarget, yearNum, settings.duration, cumInf, false));
      const glideShare = glideShareForYear(settings.equityGlide, yearNum, settings.duration);
      if (glideShare != null) {
        const growthMin = adjEquity + adjBond;
        adjEquity = growthMin * glideShare;
        adjBond = growthMin * (1 - glideShare);
      }
      adjEquity = Math.round(adjEquity);
      adjBond = Math.round(adjBond);

      const totalGrowth = equity + bond;
      const minGrowth = adjEquity + adjBond;
      let consec = 0;

      // Get prior history for protection mode calculation
      const priorHistory = history.filter(h => h.date < dateStr);

      // Count consecutive Cash draws from history
      for (let i = priorHistory.length - 1; i >= 0; i--) {
        // Any non-Growth month counts toward the streak (Cash, Mixed, Diversifier…) — the SAME
        // rule the stress engine applies, so both engines see identical protection triggers.
        if (priorHistory[i].source && priorHistory[i].source !== 'Growth') consec++;
        else break;
      }

      // Trailing protection streak (consecutive most-recent records in protection) — drives the
      // Guyton-Klinger-aligned escalating cut: half-depth for the first year of an episode.
      let protStreak = 0;
      for (let i = priorHistory.length - 1; i >= 0; i--) {
        if (priorHistory[i].inProtection) protStreak++;
        else break;
      }

      // Shared protection decision (same module the Stress engine uses). disableProtection is
      // honoured the same way the Stress engine honours it (previously decision-side had no off
      // switch, so seeded plans could disagree about whether protection fired at all).
      const inProtection = settings.disableProtection ? false : assessProtection({
        totalGrowth,
        minGrowth,
        consecCashDraws: consec,
        wasInProtection: priorHistory.length > 0 && priorHistory[priorHistory.length - 1].inProtection,
        consecutiveLimit: settings.consecutiveLimit || 3,
        recoveryBuffer: settings.recoveryBuffer || PROTECTION_DEFAULTS.RECOVERY_BUFFER
      });

      // Calculate remaining months in tax year
      const remainingMonths = month >= 4 ? (16 - month) : (4 - month);
      const effectiveRemainingMonths = Math.max(1, remainingMonths);

      // Target income. A WIZARD-CONFIRMED salary is nominal for its own tax year (the wizard's
      // suggestion chain already compounds CPI/decline year on year), so it is used as-is; only
      // the unconfirmed fallback (plan base salary) is inflated by cumulative CPI. Previously the
      // engine multiplied confirmedSalary by cumInf too — a double-uplift that was masked by a
      // wizard bug which reset the suggestion base to the plan salary each year.
      const target = taxYearConfig.confirmedSalary
        ? taxYearConfig.confirmedSalary
        : settings.baseSalary * cumInf;
      const other = OTHER + STATE;
      const targetNet = grossToNet(target, PA, BRL, HRL);

      // Calculate ISA/SIPP based on year-level tax efficiency mode
      let sipp, isa, note;
      let stdSippForHistory = 0; // Standard SIPP before protection reduction, for tax boost tracking
      let boostAmount = 0;
      let protectionInducedTaxEfficiency = false;
      let isaSavingsUsedThisMonth = 0;

      // Pension access method (plan-defining, locked with the settings): 'drawdown' = tax-free
      // cash already taken, every withdrawal fully taxable (f=0, the historical behaviour);
      // 'ufpls' = a quarter of each withdrawal is tax-free (f=0.25) UNTIL the lifetime Lump Sum
      // Allowance is exhausted, after which withdrawals revert to fully taxable.
      const LSA = 268275;
      const lifetimeTaxFreeUsed = history.reduce((sum, h) => sum + (h.taxFree || 0), 0);
      // Phased access: settings.ufplsYears limits the UFPLS phase to the first N plan years
      // (yearNum is 0-based from the 2026 plan epoch — the same clock the stress engine's
      // `year` index runs on); blank/0 = UFPLS for the whole plan.
      const inUfplsPhase = !settings.ufplsYears || yearNum < settings.ufplsYears;
      const ufpls = (settings.accessMethod === 'ufpls') && inUfplsPhase && lifetimeTaxFreeUsed < LSA;
      const taxFreeF = ufpls ? 0.25 : 0;
      // PCLS-at-switch: the decision tool ADVISES the real-world action rather than silently
      // moving money the user actually holds. In the switch year (only — assume done after),
      // suggest taking 25% of the remaining pot tax-free into the ISA, capped by remaining LSA.
      let pclsSuggestion = 0;
      if (settings.accessMethod === 'ufpls' && settings.ufplsThenPcls && settings.ufplsYears > 0
          && yearNum === Math.floor(settings.ufplsYears) && lifetimeTaxFreeUsed < LSA) {
        pclsSuggestion = Math.max(0, Math.min(0.25 * (equity + bond + cash), LSA - lifetimeTaxFreeUsed));
      }

      // Mid-year start frame (wizard-configured partial first year): the year's target is
      // delivered over the REMAINING months, and income received before drawdown started
      // (grossIncomeToDate) both reduces what the SIPP must provide AND consumes the year's
      // tax bands. For a normal full year this collapses to the identity (12 months, £0).
      const deliverMonths = Math.max(1, Math.min(12, taxYearConfig.remainingMonths || 12));
      const preStartIncome = deliverMonths < 12 ? (grossIncomeToDate || 0) : 0;

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
            targetGross: target, fixedIncome: other + preStartIncome, pa: PA, brl: BRL, hrl: HRL,
            taxFreeFraction: taxFreeF,
            isaBalance,
            strategy: settings.isaDrawdownStrategy || 'minimiseEarlyTax',
            // yearsUntilSp only affects the maximiseLongevity ration cap. The Decision Tool has
            // no UI to select that strategy (always Option A / minimiseEarlyTax, which ignores
            // this), so 0 is safe today. If longevity is ever exposed here, compute real
            // years-until-SP from the SP start date — see tests/crossval/replay.test.js "KNOWN GAP".
            yearsUntilSp: 0
          });
          // Monthly NEED, not the annual target crammed into the remaining months: a September start
          // draws 1/12 of the year's target each month (the no-ISA path already did this); the tax
          // below is then worked out on the months actually drawn.
          stdSipp = plan.sippGross / 12;
          isaToUse = plan.isaDraw / 12;
        } else {
          // Legacy per-tax-year ISA allocation path (unchanged when no ISA balance is set).
          if (taxYearConfig.expectedMonthly?.sipp?.gross > 0) {
            stdSipp = taxYearConfig.expectedMonthly.sipp.gross;
          } else {
            const brlHeadroom = Math.max(0, BRL - grossIncomeToDate - other);
            // headroom is TAXABLE capacity; under UFPLS a gross draw only counts (1-f) taxable
            const maxMonthlySippAtBrl = (brlHeadroom / (1 - taxFreeF)) / 12;
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
          const deepMult = 1 - (settings.protectionFactor || 20) / 100;
          sipp = stdSipp * protectionMultForStreak(protStreak, deepMult, settings.protectionEscalateMonths);
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

          // Shared tax-boost decision (same module the Stress engine uses). The per-month cap
          // inside planTaxBoost is what stops the old end-of-tax-year "draw £17k this month" cram.
          const projectedAnnualTaxable = (annualSippSoFar + sipp * effectiveRemainingMonths) * (1 - taxFreeF) + other;
          boostAmount = planTaxBoost({
            shortfall: protectionShortfall,
            standardMonthly: stdSipp,
            remainingMonths: effectiveRemainingMonths,
            surplus: totalGrowth - minGrowth - BOOST_DEFAULTS.SURPLUS_BUFFER,
            brlHeadroom: BRL - projectedAnnualTaxable
          });
          if (boostAmount > 50) {
            sipp += boostAmount;
            note = 'Tax Boost';
          }
        }
      } else {
        // TAX-INEFFICIENT MODE: full SIPP draw to the target, no ISA — via the SAME shared
        // planners as the efficient branch (planDrawdown with an empty ISA + planTaxBoost).
        // Folding this (Aug 2026) fixed three latent divergences of the old hand-rolled copy:
        // UFPLS was ignored (gross wasn't reduced by the tax-free quarter), the partial-year
        // frame was ignored (always /12), and the boosts had no per-month anti-cram cap.
        let stdSipp;
        if (taxYearConfig.expectedMonthly?.sipp?.gross > 0) {
          stdSipp = taxYearConfig.expectedMonthly.sipp.gross;
        } else {
          const plan = planDrawdown({
            targetGross: target, fixedIncome: other + preStartIncome, pa: PA, brl: BRL, hrl: HRL,
            taxFreeFraction: taxFreeF, isaBalance: 0,
            strategy: settings.isaDrawdownStrategy || 'minimiseEarlyTax', yearsUntilSp: 0
          });
          stdSipp = plan.sippGross / 12;   // monthly need (see the efficient branch)
        }
        stdSippForHistory = stdSipp; // Capture for history (before protection reduction)
        isa = 0; // No ISA in tax-inefficient mode

        // This tax year's history scan (same shape as the efficient branch)
        const taxYearStart = month >= 4 ? year : year - 1;
        const thisTaxYearHistory = priorHistory.filter(h => {
          const [hy, hm] = h.date.split('-').map(Number);
          return (hm >= 4 ? hy : hy - 1) === taxYearStart;
        });
        let protectionShortfall = 0;
        let annualSippSoFar = 0;
        thisTaxYearHistory.forEach(h => {
          annualSippSoFar += h.sipp || 0;
          if (h.inProtection && h.stdSipp) protectionShortfall += (h.stdSipp - h.sipp);
          if (h.boostAmount > 0) protectionShortfall -= h.boostAmount;
        });

        if (inProtection) {
          const deepMult = 1 - (settings.protectionFactor || 20) / 100;
          sipp = stdSipp * protectionMultForStreak(protStreak, deepMult, settings.protectionEscalateMonths);
          note = 'Protection';

          // Protection-induced tax efficiency: the reduced draw may bring the projected annual
          // taxable below the BRL — fill the freed headroom via the shared planner (shortfall =
          // the whole headroom; planTaxBoost spreads it over the remaining months, funds it from
          // growth surplus, and applies the per-month cap the old hand-rolled version lacked).
          const projectedAnnualTaxable = (annualSippSoFar + sipp * effectiveRemainingMonths) * (1 - taxFreeF) + other;
          const brlHeadroom = BRL - projectedAnnualTaxable;
          boostAmount = planTaxBoost({
            shortfall: brlHeadroom,
            standardMonthly: stdSipp,
            remainingMonths: effectiveRemainingMonths,
            surplus: totalGrowth - minGrowth - BOOST_DEFAULTS.SURPLUS_BUFFER,
            brlHeadroom
          });
          if (boostAmount > 0) {
            sipp += boostAmount;
            protectionInducedTaxEfficiency = true;
            note = 'Protection-Induced Efficiency';
          }
        } else {
          sipp = stdSipp;
          note = 'Tax-Inefficient';

          // Catch-up after protection months — the same shared decision the efficient branch
          // and the Stress engine use.
          const projectedAnnualTaxable = (annualSippSoFar + sipp * effectiveRemainingMonths) * (1 - taxFreeF) + other;
          boostAmount = planTaxBoost({
            shortfall: protectionShortfall,
            standardMonthly: stdSipp,
            remainingMonths: effectiveRemainingMonths,
            surplus: totalGrowth - minGrowth - BOOST_DEFAULTS.SURPLUS_BUFFER,
            brlHeadroom: BRL - projectedAnnualTaxable
          });
          if (boostAmount > 0) {
            sipp += boostAmount;
            note = 'Tax Boost';
          }
        }
      }

      // Band-fill-and-recycle (opt-in, locked with the plan): with unused basic-rate headroom,
      // draw extra SIPP up to the band and contribute the net to the ISA. Advised only while
      // fully taxable (no UFPLS quarter in play) and not in protection. The extra draw is added
      // to `sipp` BEFORE the tax section below, so all tax figures include it automatically.
      let recycleGross = 0, recycleNet = 0;
      if (settings.bandFillRecycle && taxFreeF === 0 && !inProtection) {
        const tyStartR = month >= 4 ? year : year - 1;
        const tyHistR = priorHistory.filter(h => {
          const [hy, hm] = h.date.split('-').map(Number);
          return (hm >= 4 ? hy : hy - 1) === tyStartR;
        });
        let sippSoFarR = 0, recycledSoFar = 0;
        tyHistR.forEach(h => { sippSoFarR += h.sipp || 0; recycledSoFar += h.recycleNet || 0; });
        const projectedTaxableR = sippSoFarR + sipp * effectiveRemainingMonths + other + preStartIncome;
        const r = planBandFillRecycle({
          brlHeadroom: BRL - projectedTaxableR,
          remainingMonths: effectiveRemainingMonths,
          isaAllowanceLeft: RECYCLE_DEFAULTS.ISA_ANNUAL_ALLOWANCE - recycledSoFar
        });
        recycleGross = r.gross;
        recycleNet = r.net;
        if (recycleGross > 0) sipp += recycleGross;
      }

      // Store stdSipp for future catch-up calculations
      const stdSippMonthly = (BRL - other) / 12;

      // Determine withdrawal source
      // Diversifiers sleeve (opt-in via deps.diversifier). Held flat; tapped as a crisis reserve in a
      // downturn BEFORE the depressed growth pots — the same rule the Stress engine uses. Absent/0 →
      // every branch below is byte-identical to the 3-bucket behaviour (golden-safe).
      const diversifier = deps.diversifier || 0;

      // ---- Which pot pays: the SHARED sourcing rules (WithdrawalSourcing) ----
      // Identical module and numbers to the Stress engine — one rules engine, two surfaces:
      // the sim EXECUTES this plan; here it becomes the month's recommendation.
      const sourcing = planSourcing({
        draw: sipp,
        equity, bond, cash,
        diversifier, diversifierTarget: deps.diversifierTarget || diversifier || 0,
        hodl: 0,
        eqMin: adjEquity, bdMin: adjBond, csTarget: adjCash,
        inProtection
      });
      const source = sourcing.source;
      const reason = sourcing.reason;
      const dEquity = sourcing.fromEquity;
      const dBond = sourcing.fromBond;
      const dCash = sourcing.fromCash;
      const dDiversifier = sourcing.fromDiversifier;
      // Warn when the month needed to eat into pots BELOW their floors (or genuinely ran out):
      // the cascade will sell depressed sleeves rather than fail, but the user must know.
      const dippedBelowFloors = (sourcing.fromEquity + sourcing.fromBond > 1e-9)
        && (inProtection || totalGrowth < minGrowth + sipp);
      const warn = (sourcing.shortfall > 1e-6 || dippedBelowFloors) ? 'Cash low!' : '';

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

      // Cash replenishment advice — the module's own figure, so the recommendation matches what
      // the stress tester actually executes (rounded to £1k for readability; ≥£1k to show).
      let cashReplenish = '';
      const repAmount = Math.floor((sourcing.replenish || 0) / 1000) * 1000;
      if (repAmount >= 1000) {
        cashReplenish = `Replenish Cash: Move £${repAmount.toLocaleString()} from growth funds`;
      }

      // Build alerts array
      const alerts = [];
      // Protection is cutting income while an ISA sits idle (policy never touches it below the BRL):
      // say what the cut is and how long the ISA could cover it. Advice, not an automatic draw.
      const protCut = inProtection ? Math.max(0, (stdSippForHistory || 0) - sipp) : 0;
      const isaIdle = (deps.isaBalance || 0);
      if (protCut > 1 && isaIdle > 0 && isa <= 0 && settings.isaDrawdownStrategy !== 'hold') {
        const yrs = isaIdle / (protCut * 12);
        alerts.push({ message: `Protection is cutting your draw by £${Math.round(protCut).toLocaleString()}/mo. Your ISA (£${Math.round(isaIdle).toLocaleString()}) could cover that cut for about ${yrs >= 10 ? '10+' : yrs.toFixed(1)} years, tax-free — your call.`, severity: 'info', type: 'isa-bridge' });
      }
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

      // Calculate remaining months after this one (partial first year has fewer slots)
      const monthsPassedIncludingThis = thisTaxYearHistory.length + 1;
      const monthsRemaining = Math.max(0, deliverMonths - monthsPassedIncludingThis);

      // Project the remaining months at THIS month's draw (protection included): assuming a snap back
      // to the standard draw overstated the year's tax in every protection month (persona test B27).
      const projectedRemainingSipp = monthsRemaining * sipp;

      // Total annual SIPP = YTD + this month + projected remaining at standard rate
      const totalAnnualSipp = sippYTD + sipp + projectedRemainingSipp;

      // Annual taxable = total SIPP + Other + State Pension + income earned before drawdown
      // started (mid-year first year) — that income consumed personal allowance/band headroom,
      // so ignoring it under-taxes every drawn month.
      const annualTaxable = totalAnnualSipp * (1 - taxFreeF) + OTHER + STATE + preStartIncome;

      // Proper HMRC bands: 20% to BRL, 40% to HRL, 45% above, plus PA taper over £100k.
      const annualTax = calculateTax(annualTaxable, PA, BRL, HRL);

      // Monthly tax: the drawdown months carry the year's tax NET of what the pre-start income
      // would owe on its own, spread evenly over the months actually drawn.
      const monthlyTax = (annualTax - calculateTax(preStartIncome, PA, BRL, HRL)) / deliverMonths;

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
        monthlyTax,   // the engine's per-month tax (partial-year aware) — decisionToHistory prefers this
        taxFree: sipp * taxFreeF,          // UFPLS tax-free slice this month (0 for drawdown)
        accessMethod: ufpls ? 'ufpls' : 'drawdown',
        lsaRemaining: ufpls ? Math.max(0, LSA - lifetimeTaxFreeUsed) : null,
        pclsSuggestion,                    // switch-year advice: take this much tax-free into the ISA (£0 = n/a)
        recycleGross,                      // band-fill: extra monthly SIPP gross included in sippDraw (£0 = off/none)
        recycleNet,                        // band-fill: net of that to contribute to the ISA this month

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
        // Diversifier fields emitted ONLY when the sleeve is in use, so 3-bucket (golden) output
        // is byte-identical.
        ...(diversifier > 0 ? { drawFromDiversifier: dDiversifier, diversifier } : {}),

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
