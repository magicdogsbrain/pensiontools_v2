/**
 * Simulation Engine
 * Monte Carlo and historical simulation for pension stress testing
 *
 * Matches PWA logic for accurate simulation results
 */

import { EQUITY_RETURNS, INFLATION, BOND_MODEL } from '../constants.js';
import { seededRng, gaussianRandom } from '../utils/MathUtils.js';
import { calculateGlidepath } from './GlidepathService.js';
import { calculateTax, grossToNet } from './TaxCalculator.js';

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
  let hodlUsedMonth = null;

  // State tracking
  let protMonths = 0;
  let maxConsec = 0;
  let curStreak = 0;
  let consec = 0;  // Consecutive cash draws
  let prot = false;  // Protection mode flag
  let failed = false;
  let failMonth = null;

  // Tax boost tracking: shortfall within current tax year
  let taxYearShortfall = 0;
  let lastTaxYearStart = -1;

  // History for analysis
  const hist = [];

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

    // Tax year runs April (month 3 in 0-indexed) to March
    const taxYearStart = monthInYear >= 3 ? year : year - 1;

    // Reset shortfall at start of new tax year
    if (taxYearStart !== lastTaxYearStart) {
      taxYearShortfall = 0;
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

    // Get this year's returns
    const eqReturn = returns.equity[year] || 0;
    const inf = returns.inflation[year] || 0.025;
    // Previous year's inflation for bond model (matches PWA)
    const prevInf = year > 0 ? (returns.inflation[year - 1] || 0.025) : inf;

    // Calculate glidepath minimums
    const eqMin = calculateGlidepath(config.equityMin, year, config.duration, cumInf, true);
    const bdMin = calculateGlidepath(config.bondMin, year, config.duration, cumInf, true);
    const csTarget = calculateGlidepath(config.cashTarget, year, config.duration, cumInf, false);

    // Calculate required draw
    const draw = calculateMonthlyDraw(config, year, cumInf, yearlyInf);
    const standardMonthDraw = draw;
    let effectiveDraw = prot ? draw * config.protectionMult : draw;
    let monthDraw = effectiveDraw;

    // Track protection shortfall for tax boost
    if (prot) {
      taxYearShortfall += (standardMonthDraw - monthDraw);
    }

    // Apply monthly returns (compounded from annual) - matches PWA exactly
    const annualBondReturn = calculateBondReturn(inf, eqReturn, prevInf, rng);
    const annualCashReturn = Math.max(0.005, inf + 0.012);

    equity *= (1 + Math.pow(1 + eqReturn, 1/12) - 1);
    bond *= (1 + Math.pow(1 + annualBondReturn, 1/12) - 1);
    cash *= (1 + Math.pow(1 + annualCashReturn, 1/12) - 1);

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
      hodl *= (1 + Math.pow(1 + hodlR, 1/12) - 1);
    }

    const totalGrowth = equity + bond;
    const minGrowth = eqMin + bdMin;

    // Exit protection (with 5000 buffer)
    if (prot && totalGrowth > minGrowth + 5000) {
      prot = false;
      consec = 0;
      maxConsec = Math.max(maxConsec, curStreak);
      curStreak = 0;
    }
    if (prot) {
      protMonths++;
      curStreak++;
    }

    // TAX BOOST: After protection ends, try to catch up on shortfall
    let boostAmount = 0;
    if (!prot && taxYearShortfall > 0 && totalGrowth > minGrowth + 15000) {
      // Calculate months remaining in tax year (April = month index 3)
      let monthsToApril = monthInYear >= 3 ? (15 - monthInYear) : (3 - monthInYear);
      if (monthsToApril < 1) monthsToApril = 1;

      // Surplus available for boost
      const surplus = totalGrowth - minGrowth - 15000;

      // Spread catch-up, capped by surplus
      const catchUpPerMonth = Math.min(taxYearShortfall / monthsToApril, surplus / monthsToApril);
      const maxBoost = standardMonthDraw * 0.5; // Cap boost at 50% of standard draw
      boostAmount = Math.min(catchUpPerMonth, maxBoost);

      if (boostAmount > 50) {
        monthDraw += boostAmount;
        taxYearShortfall -= boostAmount;
      }
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
        consec = 0;
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
        consec++;
        source = 'Cash';
        // Enter protection after consecutive cash draws
        if (!config.disableProtection && consec >= config.consecutiveLimit) {
          prot = true;
        }
      } else {
        const rem = monthDraw - cash;
        cash = 0;
        if (bond > rem) {
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

    // Ensure no negative values
    equity = Math.max(0, equity);
    bond = Math.max(0, bond);
    cash = Math.max(0, cash);

    // Record history (yearly snapshots)
    if (monthInYear === 0 || month === config.years * 12 - 1 || failed) {
      hist.push({
        year: year + (monthInYear / 12),
        month,
        equity,
        bond,
        cash,
        hodl,
        total: equity + bond + cash,
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

  return {
    failed,
    years: failed ? failMonth / 12 : config.years,
    failMonth,
    final: equity + bond + cash,
    finalEquity: equity,
    finalBond: bond,
    finalCash: cash,
    finalHodl: hodl,
    protMonths,
    maxConsec,
    hodlUsed,
    hodlUsedMonth,
    hist,
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
  const cashReturn = Math.max(0.005, inf + 0.005);
  const equityReturn = eqReturn * 0.5 + gaussianRandom(0, 0.02, rng);  // Dampened equity exposure

  // Weighted return
  return linkerWeight * linkerReturn +
         nomBondWeight * nomBondReturn +
         propertyWeight * propertyReturn +
         commodityWeight * commodityReturn +
         cashWeight * cashReturn +
         equityWeight * equityReturn;
}

/**
 * Calculates monthly draw amount
 */
function calculateMonthlyDraw(config, year, cumInf, yearlyInf) {
  // Adjust tax thresholds
  const pa = config.taxMode === 'frozen' ? config.pa : config.pa * cumInf;
  const brl = config.taxMode === 'frozen' ? config.brl : config.brl * cumInf;

  // Target income
  const target = config.baseSalary * cumInf;

  // Other income with CPI cap
  let other = config.other;
  for (const inf of yearlyInf) {
    other *= (1 + Math.min(inf, 0.04));
  }

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

  // SIPP draw (capped at BRL)
  const fixed = other + statePension;
  const sippDraw = Math.max(0, Math.min(brl, target) - fixed);

  return sippDraw / 12;
}

/**
 * Runs Monte Carlo simulation
 * @param {object} config - Simulation configuration
 * @param {number} runs - Number of simulation runs
 * @returns {object[]} Array of simulation results
 */
export function runMonteCarlo(config, runs = 1000) {
  const years = Object.keys(EQUITY_RETURNS).map(Number).sort((a, b) => a - b);
  const results = [];

  for (let i = 0; i < runs; i++) {
    const rng = seededRng(i * 12345);

    // Build random return sequence by sampling from history
    const returns = { equity: {}, inflation: {} };
    for (let y = 0; y < config.years; y++) {
      const randomYear = years[Math.floor(rng() * years.length)];
      returns.equity[y] = EQUITY_RETURNS[randomYear];
      returns.inflation[y] = INFLATION[randomYear] || 0.025;
    }

    results.push(simulate(config, returns, i));
  }

  return results;
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
