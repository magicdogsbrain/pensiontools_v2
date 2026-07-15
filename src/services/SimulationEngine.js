/**
 * Simulation Engine
 * Monte Carlo and historical simulation for pension stress testing
 *
 * Matches PWA logic for accurate simulation results
 */

import { EQUITY_RETURNS, INFLATION, BOND_MODEL, ISA_DEFAULTS } from '../constants.js';
import { seededRng, gaussianRandom } from '../utils/MathUtils.js';
import { calculateGlidepath, glideShareForYear } from './GlidepathService.js';
import { calculateTax, grossToNet } from './TaxCalculator.js';
import { cappedInflation } from './InflationModel.js';
import { planDrawdown } from './DrawdownStrategy.js';
import { applyIsaGrowthMonthly } from './IsaDrawdown.js';
import { assessProtection, PROTECTION_DEFAULTS } from './ProtectionStrategy.js';
import { planTaxBoost, BOOST_DEFAULTS } from './TaxBoostStrategy.js';
import { bondBucketReturn, diversifierBucketReturn, updateTrendMomentum, trendSignalFromMomentum } from './SubAssetReturns.js';
import { spendingSmileFactor } from './SpendingModel.js';

// Cash / money-market real return spread. Short-term rates LAG inflation (they reset off roughly
// last year's inflation), so in an inflation spike the realised real return (rate − this-year
// inflation) goes sharply negative — the 1970s cash-erosion dynamic — while cash gains in
// disinflation. The long-run average real return ≈ this spread. −1% matches the FCA's prescribed
// cash projection rate (the only asset class the regulator projects as a real-terms loss), the
// deliberately-conservative choice. Replaces the old +1.2% guaranteed real return, under which
// cash could never lose to inflation and an all-cash pot looked unrealistically safe.
export const CASH_REAL_SPREAD = -0.01;

// Monte-Carlo block length (years). Each MC path is stitched from random CONSECUTIVE runs of this
// many historical years, so regimes (e.g. a sustained 1970s inflation stretch) stay intact instead
// of being averaged away by independent single-year resampling. ~5y balances regime realism
// against path variety (cf. Portfolio Visualizer's block bootstrap).
export const MC_BLOCK_YEARS = 5;

/**
 * Nominal annual cash return: roughly last year's inflation plus the (negative) real spread,
 * floored at 0% (retail deposit rates don't go negative). Depends on the inflation PATH, so cash
 * carries genuine inflation/sequence risk instead of a fixed positive real return.
 * @param {number} prevInflation - previous year's inflation (the rate cash reprices off)
 * @returns {number} nominal annual cash return
 */
function cashNominalReturn(prevInflation) {
  return Math.max(0, prevInflation + CASH_REAL_SPREAD);
}

/**
 * Runs a single simulation with given returns
 * @param {object} config - Simulation configuration
 * @param {object} returns - Yearly returns { equity: {}, inflation: {} }
 * @param {number} seed - Random seed
 * @returns {object} Simulation result
 */
export function simulate(config, returns, seed = 0) {
  const rng = seededRng(seed);

  // Initialize fund values
  let equity = config.equityStart;
  let bond = config.bondStart;
  let cash = config.cashStart;

  // HODL (Break Glass) - emergency reserve
  let hodl = config.hodlEnabled ? (config.hodlStart !== undefined ? config.hodlStart : config.hodlValue) : 0;
  let hodlUsed = 0;

  // Diversifiers pot (gold + trend/macro) — the 4th bucket, held flat and tapped as a crisis
  // reserve. 0 unless the run opts in via config.diversifierStart, so every legacy/golden run
  // keeps a byte-identical instruction + RNG stream. `trendMom` carries trend's path-memory.
  let diversifier = config.diversifierStart || 0;
  let divUsed = 0;
  let trendMom = 0;
  let trendSignal = 0;

  // ISA pot (tax-free top-up; grows at the money-market rate, depletes as drawn)
  let isa = config.isaBalance || 0;
  let hodlUsedMonth = null;

  // ISA stats tracking (for the stress-page ISA analytics)
  const startIsa = config.isaBalance || 0;
  // "Used up" = the REAL (today's-money) balance falls below 5% of the starting balance (or £1k).
  // NOT exactly £0: money-market growth always leaves a nominal sliver, so an exactly-£0 test would
  // never fire and wrongly report "lasts the full term" even as the ISA's real value drains away.
  const isaUsedUpFloor = Math.max(1000, startIsa * 0.05);
  let isaDepletedMonth = null;         // first month the ISA is used up (null = never / not funded)
  let higherRateMonths = 0;            // months of inefficient drawdown (SIPP forced above BRL)
  let totalTaxReal = 0;                // lifetime income tax paid, in today's money
  // Per-year series in TODAY'S money (deflated by cumulative inflation). isaByYear is null after a
  // run fails (no data — never zero-fill dead runs, the old artifact). potByYear carries £0 after a
  // failure because a busted plan genuinely has nothing left — used for the honest outcome fan chart.
  const isaByYear = new Array(config.years + 1).fill(null);
  const potByYear = new Array(config.years + 1).fill(null);

  // State tracking
  let protMonths = 0;
  let maxConsec = 0;
  let curStreak = 0;
  let consecCashDraws = 0;  // trailing consecutive non-growth (cash-side) draws
  let prot = false;  // Protection mode flag
  let failed = false;
  let failMonth = null;

  // Tax boost tracking: shortfall + SIPP drawn within current tax year
  let taxYearShortfall = 0;
  let annualSippSoFar = 0;
  let lastTaxYearStart = -1;

  // History for analysis
  const hist = [];

  // Optional per-month trace (opt-in via config.trace) for the cross-validation harness:
  // records the exact start-of-month state and standard draws so the same trajectory can be
  // replayed through the Decision engine and compared. Off by default → no behaviour change.
  const trace = config.trace ? [] : null;

  // Inflation tracking
  const yearlyInf = [];
  let cumInf = 1;

  // Record initial state
  hist.push({
    year: 0,
    month: 0,
    equity,
    bond,
    cash,
    hodl,
    total: equity + bond + cash,
    draw: 0,
    source: 'None',
    inProtection: false,
    equityMin: config.equityMin,
    bondMin: config.bondMin,
    cashMax: config.cashTarget
  });

  // Run simulation month by month
  for (let month = 0; month < config.years * 12; month++) {
    const year = Math.floor(month / 12);
    const monthInYear = month % 12;

    // Tax year is aligned with the simulation year (annual cycle == tax year), so the shortfall
    // reset, target-inflation and boost remaining-months all share ONE boundary — matching the
    // Decision engine (which uses the 6-April tax year for all three). Previously the shortfall
    // reset used monthInYear>=3, a latent 3-month offset from the year-based target inflation.
    const taxYearStart = year;

    // Reset shortfall + annual SIPP accumulator at start of new tax year
    if (taxYearStart !== lastTaxYearStart) {
      taxYearShortfall = 0;
      annualSippSoFar = 0;
      lastTaxYearStart = taxYearStart;
    }

    // Track yearly inflation for Other calc (matches PWA timing)
    if (month > 0 && month % 12 === 0) {
      const infForYear = returns.inflation[year] || 0.025;
      yearlyInf.push(infForYear);
      cumInf *= (1 + infForYear);
    }
    if (year === 0 && month === 0) {
      // Reset yearlyInf at simulation start
    }

    // Rising-equity glidepath ("bond tent") target equity share for this year, or null when off.
    // The share RISES over retirement — least equity early (the vulnerable "red zone" when the pot
    // is largest), more later once sequence risk has passed (Pfau & Kitces 2014).
    const glideShare = glideShareForYear(config.equityGlide, year, config.duration);

    // When the glidepath is on it OWNS the equity/bond split: rebalance the growth pots to the
    // target share once a year. So only the TOTAL of the entered equity + bond minimums matters;
    // the glide, not the entered split, decides how it's divided. Cash is left alone.
    if (glideShare != null && monthInYear === 0) {
      const growth = equity + bond;
      if (growth > 0) { equity = growth * glideShare; bond = growth * (1 - glideShare); }
    }

    // Diversifiers: refresh trend's LAGGED position once a year. Fold LAST year's equity return
    // into the momentum state, then derive this year's position from it — so trend is short after
    // a sustained fall (profits if it continues, whipsawed if it reverses). Only runs when the
    // pot is funded, so the legacy RNG/instruction stream is untouched.
    if (diversifier > 0 && monthInYear === 0) {
      if (year > 0) trendMom = updateTrendMomentum(trendMom, returns.equity[year - 1] || 0);
      trendSignal = trendSignalFromMomentum(trendMom);
    }

    // Get this year's returns
    const eqReturn = returns.equity[year] || 0;
    const inf = returns.inflation[year] || 0.025;
    // Previous year's inflation for bond model (matches PWA)
    const prevInf = year > 0 ? (returns.inflation[year - 1] || 0.025) : inf;

    // Glidepath depletion floors. With the rising-equity glidepath on, split the TOTAL growth floor
    // by the same glide share, so the floors track the glided allocation instead of the entered
    // equity/bond split (which the glide overrides) — keeping protection and draws consistent.
    let eqMin = calculateGlidepath(config.equityMin, year, config.duration, cumInf, true);
    let bdMin = calculateGlidepath(config.bondMin, year, config.duration, cumInf, true);
    if (glideShare != null) {
      const growthMin = eqMin + bdMin;
      eqMin = growthMin * glideShare;
      bdMin = growthMin * (1 - glideShare);
    }
    const csTarget = calculateGlidepath(config.cashTarget, year, config.duration, cumInf, false);

    // Assess protection for THIS month on the start-of-month growth-pot value (before this
    // month's returns) — the same inputs and rule the Decision engine uses (shared
    // ProtectionStrategy). Reduces the SIPP draw during a sustained downturn.
    const minGrowth = eqMin + bdMin;
    const wasInProtection = prot;
    prot = config.disableProtection ? false : assessProtection({
      totalGrowth: equity + bond,
      minGrowth,
      consecCashDraws,
      wasInProtection,
      consecutiveLimit: config.consecutiveLimit,
      recoveryBuffer: config.recoveryBuffer ?? PROTECTION_DEFAULTS.RECOVERY_BUFFER
    });
    if (prot) { protMonths++; curStreak++; }
    else { maxConsec = Math.max(maxConsec, curStreak); curStreak = 0; }

    // Calculate required draw (SIPP + ISA to hit the target via band management)
    const { sippMonthly, isaMonthly, planInputs, taxAnnual, higherRate } = calculateMonthlyDraw(config, year, cumInf, yearlyInf, isa);

    // ISA analytics: capture start-of-year ISA balance, accumulate projected income tax (in
    // today's money) and count inefficient-drawdown months (SIPP forced into the higher-rate band).
    if (monthInYear === 0) {
      isaByYear[year] = isa / cumInf;                       // today's money
      potByYear[year] = (equity + bond + cash + diversifier) / cumInf;    // today's money
    }
    totalTaxReal += (taxAnnual / 12) / cumInf;
    if (higherRate) higherRateMonths++;

    const draw = sippMonthly;
    const standardMonthDraw = draw;
    let effectiveDraw = prot ? draw * config.protectionMult : draw;
    let monthDraw = effectiveDraw;
    // Protection reduces ONLY the SIPP draw — that's what pulls on the growth/cash pots that
    // are under stress in a downturn. The ISA top-up is a stable money-market fund, so it is
    // drawn at its full non-protected value (matches the Decision engine). Unifies finding (B).
    const isaDrawThisMonth = isaMonthly;

    // Record start-of-month state + the standard (pre-protection) draws for the replay harness.
    // equity/bond/cash/isa here are still start-of-month values (returns applied below).
    // `effectiveSipp` is finalised after the tax-boost block below (traceRow mutation).
    const traceRow = trace ? {
      month, year, monthInYear, cumInf,
      equityStart: equity, bondStart: bond, cashStart: cash, isaStart: isa,
      sippMonthly, isaMonthly,        // standard draws (before protection scaling)
      effectiveSipp: effectiveDraw,   // updated to include tax-boost after the boost block
      effectiveIsa: isaDrawThisMonth,
      boostAmount: 0,
      inProtection: prot,
      planInputs                      // exact planDrawdown inputs used this month
    } : null;
    if (traceRow) trace.push(traceRow);

    // Track protection shortfall for tax boost
    if (prot) {
      taxYearShortfall += (standardMonthDraw - monthDraw);
    }

    // Apply monthly returns (compounded from annual). Clamp the annual return to > -100%
    // so an extreme synthetic bond return (r < -1) can't make (1+r)^(1/12) = NaN — which
    // would otherwise propagate to `final` and be miscounted as a successful full-term run.
    // BONDS-bucket return. When a run opts into sub-asset modelling (config.subAsset), the bond
    // bucket is driven by the labelled sub-classes + the derived gilt-yield path (SubAssetReturns);
    // otherwise the legacy blended model runs, unchanged. Gating on config.subAsset keeps the RNG
    // stream and every golden fixture byte-identical for legacy runs.
    const prevEqReturn = year > 0 ? (returns.equity[year - 1] || 0) : eqReturn;
    const annualBondReturn = config.subAsset
      ? bondBucketReturn({ inf, prevInf, eqReturn, prevEqReturn }, rng, config.subAsset.bondWeights)
      : calculateBondReturn(inf, eqReturn, prevInf, rng);
    const annualCashReturn = cashNominalReturn(prevInf);
    const monthly = (r) => Math.pow(1 + (Number.isFinite(r) ? Math.max(-0.99, r) : -0.99), 1 / 12);

    equity *= monthly(eqReturn);
    bond *= monthly(annualBondReturn);
    cash *= monthly(annualCashReturn);
    isa = applyIsaGrowthMonthly(isa, config.isaReturn || ISA_DEFAULTS.RETURN);

    // HODL fund return (Ruffer-style absolute return)
    if (hodl > 0) {
      const ricaBase = 0.069; // 6.9% mean annual return
      const ricaVol = 0.06;   // 6% annual volatility
      const ricaRandom = (rng() - 0.5) * 2 * ricaVol;

      // Defensive boost when equities fall
      let defensiveBoost = 0;
      if (eqReturn < -0.10) {
        defensiveBoost = Math.min(0.15, Math.abs(eqReturn) * 0.4);
      } else if (eqReturn < -0.05) {
        defensiveBoost = Math.abs(eqReturn) * 0.2;
      }

      let hodlR = ricaBase + ricaRandom + defensiveBoost;
      hodlR = Math.max(-0.08, Math.min(0.18, hodlR));
      hodl *= monthly(hodlR);
    }

    // Diversifiers pot growth (gold + trend). Computed AFTER the HODL block so its RNG draws are
    // appended to the existing stream — guarded on diversifier > 0, so nothing fires for legacy runs.
    if (diversifier > 0) {
      const annualDivReturn = diversifierBucketReturn(
        { inf, eqReturn }, rng, trendSignal, config.subAsset && config.subAsset.diversifierWeights
      );
      diversifier *= monthly(annualDivReturn);
    }

    const totalGrowth = equity + bond;
    // (protection was assessed at the top of the month via the shared ProtectionStrategy)

    // TAX BOOST: catch up on protection shortfall via the shared TaxBoostStrategy (same module,
    // per-month cap and BRL headroom as the Decision engine). Months remaining in the tax year =
    // 12 - monthInYear (April..March under the year-aligned tax year).
    let boostAmount = 0;
    if (!prot) {
      const monthsRemaining = 12 - monthInYear;
      const projectedAnnualTaxable = annualSippSoFar + standardMonthDraw * monthsRemaining + planInputs.fixed;
      boostAmount = planTaxBoost({
        shortfall: taxYearShortfall,
        standardMonthly: standardMonthDraw,
        remainingMonths: monthsRemaining,
        surplus: totalGrowth - minGrowth - BOOST_DEFAULTS.SURPLUS_BUFFER,
        brlHeadroom: planInputs.brl - projectedAnnualTaxable
      });
      if (boostAmount > 50) {
        monthDraw += boostAmount;
        taxYearShortfall -= boostAmount;
      }
    }
    // Accumulate this month's effective SIPP for the tax year (for next month's BRL headroom).
    annualSippSoFar += monthDraw;

    // Finalise the trace row's effective SIPP now that protection scaling + tax-boost are set.
    if (traceRow) {
      traceRow.effectiveSipp = monthDraw;
      traceRow.boostAmount = boostAmount > 50 ? boostAmount : 0;
    }

    let source = 'Growth';

    // Execute withdrawal
    if (!prot && totalGrowth >= minGrowth + monthDraw) {
      // Draw from growth funds proportionally
      const eqSurplus = Math.max(0, equity - eqMin);
      const bdSurplus = Math.max(0, bond - bdMin);
      const totalSurplus = eqSurplus + bdSurplus;

      if (totalSurplus > 0) {
        equity -= monthDraw * eqSurplus / totalSurplus;
        bond -= monthDraw * bdSurplus / totalSurplus;
        source = 'Growth';

        // Cash replenishment: rebuild cash from growth surplus
        if (cash < csTarget) {
          const excess = totalGrowth - minGrowth - monthDraw;
          if (excess > 5000) {
            const rep = Math.min((csTarget - cash) * 0.3, excess * 0.5);
            equity -= rep * eqSurplus / totalSurplus;
            bond -= rep * bdSurplus / totalSurplus;
            cash += rep;
          }
        }
      } else {
        cash -= monthDraw;
        source = 'Cash';
      }
    } else {
      // In protection or unhealthy - draw from cash
      if (cash >= monthDraw) {
        cash -= monthDraw;
        source = 'Cash';
      } else {
        const rem = monthDraw - cash;
        cash = 0;
        if (diversifier > rem) {
          // Sell the crisis hedge FIRST — it's the sleeve that tends to have held up or risen in
          // the downturn, so drawing it preserves the depressed bonds/equity for the recovery.
          diversifier -= rem;
          divUsed += rem;
          source = 'Diversifier';
        } else if (bond > rem) {
          bond -= rem;
          source = 'Bond';
        } else if (equity > rem) {
          equity -= rem;
          source = 'Equity';
        } else if (hodl > rem) {
          // BREAK GLASS: Use HODL emergency reserve
          hodl -= rem;
          hodlUsed += rem;
          if (hodlUsedMonth === null) hodlUsedMonth = month;
          source = 'HODL';
        } else {
          failed = true;
          failMonth = month;
        }
      }
    }

    // Track consecutive non-growth (cash-side) draws for next month's protection assessment,
    // matching the Decision engine's trailing-Cash count (Growth resets, anything else counts).
    consecCashDraws = source === 'Growth' ? 0 : consecCashDraws + 1;

    // Deplete the ISA pot by this month's tax-free top-up (bounded by the balance).
    // When it empties, planDrawdown() draws more taxable SIPP next month, so the SIPP
    // pots bear the full load — a plan only survives on real, finite ISA, never phantom.
    isa = Math.max(0, isa - Math.min(isaDrawThisMonth, isa));
    if (isaDepletedMonth === null && startIsa > 0 && isa / cumInf < isaUsedUpFloor) isaDepletedMonth = month;

    // Ensure no negative values
    equity = Math.max(0, equity);
    bond = Math.max(0, bond);
    cash = Math.max(0, cash);
    diversifier = Math.max(0, diversifier);

    // Record history (yearly snapshots)
    if (monthInYear === 0 || month === config.years * 12 - 1 || failed) {
      hist.push({
        year: year + (monthInYear / 12),
        month,
        equity,
        bond,
        cash,
        hodl,
        diversifier,
        total: equity + bond + cash + diversifier,
        draw: monthDraw,
        boostAmount,
        source,
        inProtection: prot,
        equityMin: eqMin,
        bondMin: bdMin,
        cashMax: csTarget
      });
    }

    if (failed) break;
  }

  maxConsec = Math.max(maxConsec, curStreak);
  // End-of-plan values (today's money) for finished runs; £0 pot carried forward after a failure.
  if (!failed) {
    isaByYear[config.years] = isa / (cumInf || 1);
    potByYear[config.years] = (equity + bond + cash + diversifier) / (cumInf || 1);
  } else {
    for (let y = Math.floor(failMonth / 12) + 1; y <= config.years; y++) potByYear[y] = 0;
  }

  // Per-run environment drivers, for failure-severity diagnosis (sequence risk vs inflation vs
  // weak overall markets) + cumulative inflation for real-terms (today's money) conversion.
  let infSum = 0, eqSum = 0, earlySum = 0, earlyN = 0, cumInfl = 1;
  for (let y = 0; y < config.years; y++) {
    const inflY = returns.inflation[y] ?? 0.025;
    infSum += inflY;
    cumInfl *= (1 + inflY);
    eqSum += (returns.equity[y] ?? 0);
    if (y < 5) { earlySum += (returns.equity[y] ?? 0); earlyN++; }
  }
  const finalNominal = equity + bond + cash + diversifier;

  return {
    failed,
    duration: config.years,
    years: failed ? failMonth / 12 : config.years,
    failMonth,
    avgInflation: infSum / config.years,
    avgEquityReturn: eqSum / config.years,
    earlyEquityReturn: earlyN ? earlySum / earlyN : 0,
    cumInflation: cumInfl,
    finalReal: finalNominal / cumInfl,   // end pot in today's money
    final: finalNominal,
    finalEquity: equity,
    finalBond: bond,
    finalCash: cash,
    finalHodl: hodl,
    finalDiversifier: diversifier,
    divUsed,
    protMonths,
    maxConsec,
    hodlUsed,
    hodlUsedMonth,
    // ISA analytics
    startIsa,
    finalIsa: isa,
    isaDepletedMonth,                                  // null if it survived the full plan
    isaLastedYears: isaDepletedMonth === null ? config.years : isaDepletedMonth / 12,
    higherRateYears: higherRateMonths / 12,            // years of inefficient (40%-band) drawdown
    totalTaxReal,                                      // lifetime income tax, today's money
    isaByYear,
    potByYear,                                         // pot value by year, today's money (£0 after fail)
    hist,
    trace,
    seed
  };
}

/**
 * Calculates bond return using multi-asset model
 * Matches PWA logic with randomized reaction quality
 */
function calculateBondReturn(inf, eqReturn, prevInf, rng) {
  // Base allocation (normal times)
  let linkerWeight = 0.15;    // Index-linked gilts
  let nomBondWeight = 0.30;   // Nominal bonds
  let propertyWeight = 0.20;  // Property
  let commodityWeight = 0.10; // Commodities
  let cashWeight = 0.10;      // Cash
  let equityWeight = 0.15;    // Partial equity exposure

  // Regime detection - use lagged inflation (models delayed recognition)
  const laggedInf = prevInf !== undefined ? prevInf : inf;
  const highInflation = laggedInf > 0.045;  // > 4.5%
  const veryHighInflation = laggedInf > 0.07; // > 7%

  if (highInflation) {
    // Shift towards inflation protection - but not perfectly
    // 30% chance they're slow to react or get it partially wrong
    const reactionQuality = rng() > 0.30 ? 1.0 : 0.5;

    if (veryHighInflation) {
      // Aggressive shift to linkers
      linkerWeight = 0.15 + (0.35 * reactionQuality);   // Up to 50%
      nomBondWeight = 0.30 - (0.20 * reactionQuality);  // Down to 10%
      equityWeight = 0.15 - (0.10 * reactionQuality);   // Down to 5%
      commodityWeight = 0.10 + (0.05 * reactionQuality); // Up slightly
    } else {
      // Moderate shift
      linkerWeight = 0.15 + (0.20 * reactionQuality);   // Up to 35%
      nomBondWeight = 0.30 - (0.10 * reactionQuality);  // Down to 20%
      equityWeight = 0.15 - (0.05 * reactionQuality);   // Down to 10%
    }
  }

  // 15% chance of mistimed reversion (shift back too early even if inflation still high)
  if (highInflation && rng() < 0.15) {
    linkerWeight = 0.20;
    nomBondWeight = 0.25;
    equityWeight = 0.12;
  }

  // Asset returns (matches PWA formulas)
  const linkerReturn = inf + 0.005 + gaussianRandom(0, 0.03, rng);  // Inflation + small real + low vol
  const nomBondReturn = 0.04 - (inf > 0.04 ? (inf - 0.04) * 0.5 : 0) + gaussianRandom(0, 0.05, rng);
  const propertyReturn = 0.03 + inf * 0.3 + gaussianRandom(0, 0.08, rng);  // Partial inflation hedge
  const commodityReturn = inf * 0.8 + gaussianRandom(0, 0.15, rng);  // Good inflation hedge, volatile
  const cashReturn = cashNominalReturn(prevInf); // lag model — cash reprices off last year's inflation
  const equityReturn = eqReturn * 0.5 + gaussianRandom(0, 0.02, rng);  // Dampened equity exposure

  // Weighted return
  const bondReturn = linkerWeight * linkerReturn +
         nomBondWeight * nomBondReturn +
         propertyWeight * propertyReturn +
         commodityWeight * commodityReturn +
         cashWeight * cashReturn +
         equityWeight * equityReturn;

  // Equity–bond correlation (regime-based). The model review flagged that bonds were sampled
  // INDEPENDENTLY of equities, overstating diversification. Impose a co-movement between the bond
  // return and this year's equity shock: bonds usually rally when equities crash (flight to
  // quality) but in an inflation shock BOTH fall together (2022) — the dangerous case for a
  // drawdown retiree. Mean-preserving (E[equity shock] = 0); scale ≈ bond vol so the imposed
  // correlation ≈ rho. See docs/model-review-feb-2026.md.
  const rho = equityBondRho(inf, eqReturn);
  const eqZ = (eqReturn - 0.10) / 0.17;                 // standardised equity shock (mean 10%, sd 17%)
  return bondReturn + rho * eqZ * 0.055;
}

/**
 * Regime-dependent equity–bond correlation. High inflation → both fall together (2022-style);
 * an equity crash in normal inflation → bonds rally (flight to quality); otherwise mild positive.
 */
function equityBondRho(inf, eqReturn) {
  if (inf > 0.045) return 0.4;        // high-inflation regime — joint down moves
  if (eqReturn < -0.15) return -0.3;  // equity crash, normal inflation — flight to quality
  return 0.1;                          // long-run mild positive
}

// Retirement spending profile. 'flat' (default, pessimistic) holds real spending level for life.
// 'declining' uses the shared spending smile (level years 0-4, ~1%/yr decline years 5-24, level after
// — see SpendingModel). Both engines consume the SAME curve so Stress and Decision agree. Opt-in, so
// the conservative flat profile stays the default.
function spendingFactor(config, year) {
  return spendingSmileFactor(year, config.spendingProfile || 'flat');
}

/**
 * Number of whole simulation years until State Pension starts (0 = already in payment).
 */
function yearsUntilStatePension(config, year) {
  if (config.spStartYear !== undefined) return Math.max(0, config.spStartYear - year);
  if (config.statePensionYear !== undefined) return Math.max(0, config.statePensionYear - year);
  return 0;
}

/**
 * Monthly SIPP + ISA draw to deliver the target income via band management, given the
 * current ISA balance (see DrawdownStrategy.planDrawdown). Replaces the old draw-to-BRL
 * (which under-drew the target and ignored the ISA).
 * @returns {{sippMonthly:number, isaMonthly:number}}
 */
function calculateMonthlyDraw(config, year, cumInf, yearlyInf, isaBalance = 0) {
  // Adjust tax thresholds
  const pa = config.taxMode === 'frozen' ? config.pa : config.pa * cumInf;
  const brl = config.taxMode === 'frozen' ? config.brl : config.brl * cumInf;
  const hrl = config.taxMode === 'frozen' ? config.hrl : (config.hrl || 125140) * cumInf;

  // Target income
  const target = config.baseSalary * cumInf * spendingFactor(config, year);

  // Other income with CPI cap (4%)
  const other = cappedInflation(config.other, yearlyInf);

  // State pension - supports both legacy (year number) and new (date-based) formats
  let statePension = 0;

  if (config.spStartYear !== undefined) {
    // New format: spStartYear is the simulation year (0-indexed) when SP starts
    // spWeeklyAmount is the weekly amount in today's money
    if (year >= config.spStartYear && config.spWeeklyAmount > 0) {
      const spAnnual = config.spWeeklyAmount * 52;
      // First year might be partial
      if (year === config.spStartYear && config.spFirstYearRatio !== undefined) {
        statePension = spAnnual * config.spFirstYearRatio * cumInf;
      } else {
        statePension = spAnnual * cumInf;
      }
    }
  } else if (config.statePensionYear !== undefined) {
    // Legacy format: statePensionYear and statePension (annual)
    statePension = year >= config.statePensionYear
      ? (config.statePension || 0) * cumInf
      : 0;
  }

  const fixed = other + statePension;
  const yearsUntilSp = yearsUntilStatePension(config, year);
  const plan = planDrawdown({
    targetGross: target,
    fixedIncome: fixed,
    pa, brl, hrl,
    isaBalance,
    strategy: config.isaDrawdownStrategy || ISA_DEFAULTS.DRAWDOWN_STRATEGY,
    yearsUntilSp
  });

  return {
    sippMonthly: plan.sippGross / 12,
    isaMonthly: plan.isaDraw / 12,
    taxAnnual: plan.tax,                 // income tax the plan pays this year (nominal)
    higherRate: plan.taxable > brl + 1,  // SIPP forced above the basic-rate limit → 40% band
                                         // (inefficient drawdown: happens once the ISA can't cover the gap)
    // Exact planDrawdown inputs, surfaced so the cross-validation harness can build
    // Decision-engine tax-year configs that reproduce this call rather than re-deriving them.
    planInputs: { target, other, statePension, fixed, pa, brl, hrl, yearsUntilSp }
  };
}

/**
 * Runs Monte Carlo simulation
 * @param {object} config - Simulation configuration
 * @param {number} runs - Number of simulation runs
 * @returns {object[]} Array of simulation results
 */
export function runMonteCarlo(config, runs = 1000) {
  const results = [];
  for (let i = 0; i < runs; i++) {
    results.push(simulate(config, monteCarloReturns(config, i), i));
  }
  return results;
}

/**
 * Builds the exact random return sequence Monte-Carlo run `i` uses (seed = i * 12345,
 * sampling years from history). Exported so the cross-validation harness can reproduce a
 * single trajectory deterministically and replay it through the Decision engine.
 * @param {object} config - Simulation configuration (uses config.years)
 * @param {number} i - Monte-Carlo run index
 * @returns {{equity: object, inflation: object}} Yearly returns
 */
export function monteCarloReturns(config, i) {
  const years = Object.keys(EQUITY_RETURNS).map(Number).sort((a, b) => a - b);
  const H = years.length;
  const rng = seededRng(i * 12345);
  const returns = { equity: {}, inflation: {} };
  // BLOCK BOOTSTRAP (circular): stitch the future from random CONSECUTIVE blocks of history
  // rather than independent single years. This preserves autocorrelation / regimes — a block
  // that lands in the 1970s drags the whole sustained-inflation run along — so sequence-of-
  // returns and inflation risk show up in the headline number (iid resampling averaged them away).
  const blockYears = config.blockYears || MC_BLOCK_YEARS;
  let y = 0;
  while (y < config.years) {
    const start = Math.floor(rng() * H);
    for (let b = 0; b < blockYears && y < config.years; b++, y++) {
      const hy = years[(start + b) % H]; // circular wrap around the historical record
      returns.equity[y] = EQUITY_RETURNS[hy];
      returns.inflation[y] = INFLATION[hy] || 0.025;
    }
  }
  return returns;
}

/**
 * Runs Monte-Carlo trajectory `i` with the per-month trace enabled (config.trace).
 * @returns {object} Simulation result including a `.trace` array (one row per month).
 */
export function simulateTraced(config, i) {
  return simulate({ ...config, trace: true }, monteCarloReturns(config, i), i);
}

/**
 * Runs historical simulation (all possible start years)
 * @param {object} config - Simulation configuration
 * @returns {object[]} Array of simulation results with start years
 */
export function runHistorical(config) {
  const years = Object.keys(EQUITY_RETURNS).map(Number).sort((a, b) => a - b);
  const maxYear = Math.max(...years);
  const results = [];

  for (const startYear of years) {
    // Skip if not enough history for full simulation
    if (startYear + config.years - 1 > maxYear) continue;

    // Build sequential return sequence
    const returns = { equity: {}, inflation: {} };
    for (let y = 0; y < config.years; y++) {
      returns.equity[y] = EQUITY_RETURNS[startYear + y] || 0;
      returns.inflation[y] = INFLATION[startYear + y] || 0.025;
    }

    const result = simulate(config, returns, startYear);
    result.startYear = startYear;
    results.push(result);
  }

  return results;
}

/**
 * Runs scenario simulation
 * @param {object} config - Simulation configuration
 * @param {object} scenario - Scenario definition { equity: [], inflation: [] }
 * @returns {object} Simulation result
 */
export function runScenario(config, scenario) {
  const returns = { equity: {}, inflation: {} };

  for (let y = 0; y < config.years; y++) {
    returns.equity[y] = scenario.equity[y % scenario.equity.length];
    returns.inflation[y] = scenario.inflation[y % scenario.inflation.length];
  }

  return simulate(config, returns, 999);
}

/**
 * Calculates success rate from results
 * @param {object[]} results - Array of simulation results
 * @returns {number} Success rate as percentage
 */
export function calculateSuccessRate(results) {
  const failures = results.filter(r => r.failed).length;
  return ((results.length - failures) / results.length) * 100;
}

/**
 * Analyzes simulation results for statistics
 * @param {object[]} results - Array of simulation results
 * @returns {object} Statistics summary
 */
/**
 * Plain-English diagnosis of WHY runs fail, from the per-run environment drivers. Ranks the
 * failed-vs-survived gaps in early-market returns (sequence risk), overall returns, and inflation.
 */
function buildFailureDiagnosis(sev) {
  if (!sev || sev.failCount === 0) return 'No shortfalls: every simulated future funded the whole plan.';
  const pct = (x) => (x * 100).toFixed(1) + '%';

  // WHEN — adapt to whether shortfalls cluster late (a near-miss, funds most of retirement) or
  // early (the dangerous kind). The old text always said "most failures are late", which was wrong
  // whenever they weren't and just echoed the coverage number.
  const my = Math.round(sev.medianFailYear), dur = sev.duration, nm = Math.round(sev.pctNearMiss);
  let timing;
  if (sev.pctNearMiss >= 60) {
    timing = `and when they do it's usually late — the typical shortfall is at year ${my} of ${dur}, and ${nm}% happen only in the final years, after funding almost the whole of retirement`;
  } else if (sev.pctNearMiss <= 30) {
    timing = `and they tend to come EARLY — the typical shortfall is at year ${my} of ${dur}, with only ${nm}% holding on to the final years. An early shortfall is the serious kind, with little retirement left to adjust`;
  } else {
    timing = `spread through retirement — the typical shortfall is at year ${my} of ${dur}`;
  }

  // WHY — rank the failed-vs-survived gaps in the market environment.
  const candidates = [
    { mag: sev.succEarlyEq - sev.failEarlyEq, text: `a poor first few years of markets (sequence-of-returns risk): the futures that fell short averaged ${pct(sev.failEarlyEq)} equity in the opening 5 years versus ${pct(sev.succEarlyEq)} for those that lasted` },
    { mag: sev.succAvgEq - sev.failAvgEq, text: `weak markets across the whole plan: ${pct(sev.failAvgEq)} average equity return versus ${pct(sev.succAvgEq)} for those that lasted` },
    { mag: sev.failAvgInf - sev.succAvgInf, text: `higher inflation eroding spending power: ${pct(sev.failAvgInf)} a year versus ${pct(sev.succAvgInf)} for those that lasted` }
  ].filter(c => c.mag > 0.005).sort((a, b) => b.mag - a.mag);

  const lead = `About ${Math.round(sev.failRate || 0)}% of futures fall short`;
  if (!candidates.length) return `${lead}, ${timing}. No single market driver stands out — the shortfalls come down to broadly bad luck across returns and inflation.`;
  let reason = `The common thread is ${candidates[0].text}`;
  if (candidates[1] && candidates[1].mag > candidates[0].mag * 0.5) reason += `. A secondary factor is ${candidates[1].text}`;
  return `${lead}, ${timing}. ${reason}.`;
}

export function analyzeResults(results) {
  const successful = results.filter(r => !r.failed);
  const failed = results.filter(r => r.failed);

  const survivalYears = results.map(r => r.years).sort((a, b) => a - b);
  const finals = successful.map(r => r.final).sort((a, b) => a - b);
  const protMonths = results.map(r => r.protMonths).sort((a, b) => a - b);

  // Helper for percentile calculation
  const percentile = (arr, p) => arr[Math.floor(arr.length * p)] || 0;

  return {
    total: results.length,
    successCount: successful.length,
    failCount: failed.length,
    successRate: calculateSuccessRate(results),

    // 7-point survival percentiles
    survival: {
      p5: percentile(survivalYears, 0.05),
      p10: percentile(survivalYears, 0.10),
      p25: percentile(survivalYears, 0.25),
      p50: percentile(survivalYears, 0.50),
      p75: percentile(survivalYears, 0.75),
      p90: percentile(survivalYears, 0.90),
      p95: percentile(survivalYears, 0.95),
      min: survivalYears[0],
      max: survivalYears[survivalYears.length - 1]
    },

    // 7-point final value percentiles (successful runs only)
    finalValue: {
      p5: percentile(finals, 0.05),
      p10: percentile(finals, 0.10),
      p25: percentile(finals, 0.25),
      p50: percentile(finals, 0.50),
      p75: percentile(finals, 0.75),
      p90: percentile(finals, 0.90),
      p95: percentile(finals, 0.95),
      min: finals[0] || 0,
      max: finals[finals.length - 1] || 0,
      avg: successful.reduce((a, r) => a + r.final, 0) / (successful.length || 1)
    },

    // Legacy format for backward compatibility
    minYears: survivalYears[0],
    p10Years: percentile(survivalYears, 0.10),
    medianYears: percentile(survivalYears, 0.50),
    medianFinal: percentile(finals, 0.50),
    p10Final: percentile(finals, 0.10),
    p90Final: percentile(finals, 0.90),
    avgFinal: successful.reduce((a, r) => a + r.final, 0) / (successful.length || 1),

    // Protection statistics with percentiles
    protection: {
      runsWithProtection: results.filter(r => r.protMonths > 0).length,
      pctWithProtection: (results.filter(r => r.protMonths > 0).length / results.length) * 100,
      avgMonths: protMonths.reduce((a, b) => a + b, 0) / results.length,
      maxMonths: Math.max(...protMonths),
      maxConsecutive: Math.max(...results.map(r => r.maxConsec)),
      avgConsecutive: results.reduce((a, r) => a + r.maxConsec, 0) / results.length,
      p50Months: percentile(protMonths, 0.50),
      p90Months: percentile(protMonths, 0.90),
      p95Months: percentile(protMonths, 0.95)
    },

    // Legacy protection format
    runsWithProtection: results.filter(r => r.protMonths > 0).length,
    avgProtMonths: protMonths.reduce((a, b) => a + b, 0) / results.length,
    maxProtMonths: Math.max(...protMonths),
    maxConsecutive: Math.max(...results.map(r => r.maxConsec)),
    avgConsecutive: results.reduce((a, r) => a + r.maxConsec, 0) / results.length,

    // HODL statistics
    hodl: {
      runsUsingHodl: results.filter(r => r.hodlUsed > 0).length,
      pctUsingHodl: (results.filter(r => r.hodlUsed > 0).length / results.length) * 100,
      avgUsed: results.filter(r => r.hodlUsed > 0).length > 0
        ? results.filter(r => r.hodlUsed > 0).reduce((a, r) => a + r.hodlUsed, 0) /
          results.filter(r => r.hodlUsed > 0).length
        : 0,
      maxUsed: Math.max(...results.map(r => r.hodlUsed || 0))
    },

    // Legacy HODL format
    runsUsingHodl: results.filter(r => r.hodlUsed > 0).length,
    avgHodlUsed: results.filter(r => r.hodlUsed > 0).length > 0
      ? results.filter(r => r.hodlUsed > 0).reduce((a, r) => a + r.hodlUsed, 0) /
        results.filter(r => r.hodlUsed > 0).length
      : 0,
    maxHodlUsed: Math.max(...results.map(r => r.hodlUsed || 0)),

    // Failure SEVERITY + reason diagnosis. Binary success is too crude — a failure at year 34
    // is a near-success, a failure at year 5 is a collapse. "Coverage" is the average share of
    // retirement-years funded across all runs; the diagnosis explains what drives the failures.
    severity: (() => {
      const duration = Math.max(...results.map(r => r.duration || r.years), 1);
      const failedRuns = results.filter(r => r.failed);
      const successRuns = results.filter(r => !r.failed);
      const failYears = failedRuns.map(r => r.years).sort((a, b) => a - b);
      const nearMissYear = duration * 0.85;
      const meanBy = (arr, k) => arr.length ? arr.reduce((s, r) => s + (r[k] || 0), 0) / arr.length : 0;
      const sev = {
        duration,
        coverage: results.reduce((a, r) => a + Math.min(1, (r.years || 0) / duration), 0) / results.length * 100,
        failCount: failedRuns.length,
        failRate: results.length ? failedRuns.length / results.length * 100 : 0,
        medianFailYear: failYears.length ? percentile(failYears, 0.5) : 0,
        pctNearMiss: failedRuns.length ? failedRuns.filter(r => r.years >= nearMissYear).length / failedRuns.length * 100 : 0,
        failEarlyEq: meanBy(failedRuns, 'earlyEquityReturn'), succEarlyEq: meanBy(successRuns, 'earlyEquityReturn'),
        failAvgEq: meanBy(failedRuns, 'avgEquityReturn'), succAvgEq: meanBy(successRuns, 'avgEquityReturn'),
        failAvgInf: meanBy(failedRuns, 'avgInflation'), succAvgInf: meanBy(successRuns, 'avgInflation')
      };
      sev.diagnosis = buildFailureDiagnosis(sev);
      // Dominant driver of failure, for a targeted "what you could do" hint in the UI.
      const gaps = [
        { k: 'sequence', m: sev.succEarlyEq - sev.failEarlyEq },
        { k: 'market', m: sev.succAvgEq - sev.failAvgEq },
        { k: 'inflation', m: sev.failAvgInf - sev.succAvgInf }
      ].filter(g => g.m > 0.005).sort((a, b) => b.m - a.m);
      sev.primaryDriver = (sev.failCount > 0 && gaps.length) ? gaps[0].k : null;
      return sev;
    })(),

    // End-of-plan pot in TODAY'S money across ALL runs (a run that ran out counts as £0). The
    // honest "what's typically left" figure — free of the survivorship bias + future-pounds
    // inflation in `finalValue` (which is successful-runs-only and nominal).
    finalReal: (() => {
      const reals = results.map(r => (r.failed ? 0 : (r.finalReal || 0))).sort((a, b) => a - b);
      return {
        p5: percentile(reals, 0.05), p10: percentile(reals, 0.10), p25: percentile(reals, 0.25),
        p50: percentile(reals, 0.50), p75: percentile(reals, 0.75), p90: percentile(reals, 0.90),
        p95: percentile(reals, 0.95), min: reals[0] || 0, max: reals[reals.length - 1] || 0
      };
    })(),

    // Per-year data for the charts (today's money): the outcome fan (pot-value percentile bands,
    // busted runs counted as £0 — no survivorship) and the plan-survival curve (% still solvent).
    chartData: (() => {
      const duration = Math.max(...results.map(r => r.duration || r.years), 1);
      const nY = duration + 1;
      const potBand = { p10: [], p25: [], p50: [], p75: [], p90: [] };
      const solvency = [];
      for (let y = 0; y < nY; y++) {
        const vals = results.map(r => (r.potByYear && r.potByYear[y] != null) ? r.potByYear[y] : 0).sort((a, b) => a - b);
        potBand.p10.push(percentile(vals, 0.10)); potBand.p25.push(percentile(vals, 0.25));
        potBand.p50.push(percentile(vals, 0.50)); potBand.p75.push(percentile(vals, 0.75));
        potBand.p90.push(percentile(vals, 0.90));
        const alive = results.filter(r => (r.failed ? r.failMonth / 12 : duration) >= y).length;
        solvency.push(results.length ? alive / results.length * 100 : 0);
      }
      return { years: nY, potBand, solvency };
    })(),

    // ISA analytics (only meaningful when the plan is funded with an ISA)
    isa: (() => {
      const funded = results.filter(r => (r.startIsa || 0) > 0);
      if (!funded.length) return { funded: false };
      const lasted = funded.map(r => r.isaLastedYears).sort((a, b) => a - b);
      const finalsIsa = funded.map(r => r.finalIsa).sort((a, b) => a - b);
      const hrYears = funded.map(r => r.higherRateYears);
      const taxes = funded.map(r => r.totalTaxReal).sort((a, b) => a - b);
      // ISA chart series, by year (today's money, so not inflated by future pounds). Two honest series:
      //  • pctHoldingByYear — share of ALL funded plans that still have ISA money (a survival curve)
      //  • medianIsaByYear — typical ISA balance across ALL funded plans, counting failed/spent as £0
      const nYears = Math.max(...funded.map(r => (r.isaByYear || []).length));
      const pctHoldingByYear = [], medianIsaByYear = [];
      for (let y = 0; y < nYears; y++) {
        const holding = funded.filter(r => r.isaByYear && r.isaByYear[y] > 0).length;
        pctHoldingByYear.push(funded.length ? holding / funded.length * 100 : 0);
        // Median across ALL funded runs — a run whose plan has failed (isaByYear null) or whose ISA
        // is spent counts as £0, exactly like the pot fan chart. Taking the median only over runs
        // still alive would let the surviving pool get richer as poorer runs drop out, so the line
        // spuriously RISES in the final years (the "£484k in year 35" survivorship artifact).
        const vals = funded
          .map(r => (r.isaByYear && r.isaByYear[y] != null) ? r.isaByYear[y] : 0)
          .sort((a, b) => a - b);
        medianIsaByYear.push(vals[Math.floor(vals.length / 2)]);
      }
      return {
        funded: true,
        runs: funded.length,
        startBalance: funded[0].startIsa,
        medianLastedYears: percentile(lasted, 0.50),
        minLastedYears: lasted[0],
        pctSurviveFullTerm: (funded.filter(r => r.isaDepletedMonth === null).length / funded.length) * 100,
        finalBalance: {
          p10: percentile(finalsIsa, 0.10),
          p50: percentile(finalsIsa, 0.50),
          p90: percentile(finalsIsa, 0.90)
        },
        avgHigherRateYears: hrYears.reduce((a, b) => a + b, 0) / funded.length,
        maxHigherRateYears: Math.max(...hrYears),
        pctEverHigherRate: (funded.filter(r => r.higherRateYears > 0).length / funded.length) * 100,
        medianTotalTax: percentile(taxes, 0.50),
        p90TotalTax: percentile(taxes, 0.90),
        pctHoldingByYear,
        medianIsaByYear
      };
    })(),

    // Failed runs detail (for worst periods table)
    failures: failed.map(r => ({
      seed: r.seed,
      startYear: r.startYear,
      years: r.years,
      failMonth: r.failMonth,
      protMonths: r.protMonths
    }))
  };
}

/**
 * Optimizes fund allocation for best success rate
 * @param {object} baseConfig - Base simulation configuration
 * @param {function} simulationFn - Simulation function (runMonteCarlo or runHistorical)
 * @returns {object} Optimization result
 */
export function optimizeAllocation(baseConfig, simulationFn) {
  const total = baseConfig.equityStart + baseConfig.bondStart + baseConfig.cashStart;
  const results = [];

  // Test different allocations
  for (let eqPct = 20; eqPct <= 80; eqPct += 10) {
    for (let bdPct = 10; bdPct <= 80 - eqPct + 10; bdPct += 10) {
      const csPct = 100 - eqPct - bdPct;
      if (csPct < 5) continue;

      const config = {
        ...baseConfig,
        equityStart: total * eqPct / 100,
        bondStart: total * bdPct / 100,
        cashStart: total * csPct / 100
      };

      const simResults = simulationFn(config, 500); // Reduced runs for speed
      const stats = analyzeResults(simResults);

      results.push({
        equityPct: eqPct,
        bondPct: bdPct,
        cashPct: csPct,
        successRate: stats.successRate,
        medianFinal: stats.medianFinal,
        avgProtMonths: stats.avgProtMonths
      });
    }
  }

  // Sort by success rate
  results.sort((a, b) => b.successRate - a.successRate);

  return {
    best: results[0],
    all: results
  };
}
