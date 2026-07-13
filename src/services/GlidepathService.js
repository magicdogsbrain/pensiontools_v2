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

// ---------------------------------------------------------------------------
// Rising-equity glidepath ("bond tent") — shared by BOTH engines
// ---------------------------------------------------------------------------
// The tent holds LESS in equity during the vulnerable early "red zone" (pot at
// its largest, sequence risk highest) and RAISES equity over retirement once
// that danger has largely passed (Pfau & Kitces 2014). These helpers are the
// single source of truth so the Stress engine and the Decision engine compute
// an identical target share each year (required by the cross-validation tests).

/**
 * Named risk levels → a whole-portfolio split (fractions summing to 1).
 * This is the ENDGAME allocation: with the tent off it's held flat the whole time; with the tent
 * on it's the DESTINATION the mix glides up to (from a more bond-heavy start) and then holds for
 * the flat remainder of retirement — not an average.
 */
export const RISK_PRESETS = {
  cautious:    { key: 'cautious',    label: 'Cautious',    equity: 0.30, bond: 0.45, cash: 0.25 },
  balanced:    { key: 'balanced',    label: 'Balanced',    equity: 0.50, bond: 0.40, cash: 0.10 },
  adventurous: { key: 'adventurous', label: 'Adventurous', equity: 0.70, bond: 0.25, cash: 0.05 }
};

/**
 * The equity share of the GROWTH sleeve (equity+bond) for a given year under the
 * tent, or null when the tent is off. MUST match the inline formula the Stress
 * engine uses so both engines agree month-by-month.
 * @param {?{start:number,end:number}} equityGlide - {start,end} growth-sleeve equity fractions, or falsy
 * @param {number} year - 0-indexed year
 * @param {number} duration - plan length in years
 * @returns {?number} equity fraction of the growth sleeve, or null
 */
export function glideShareForYear(equityGlide, year, duration) {
  if (!equityGlide) return null;
  // Rise-then-plateau: equities climb through the early "red zone" then HOLD at the endgame level
  // for the flat remainder. The rise runs for (duration - 20) years (floored at 5) — so a 35y plan
  // rises for 15y, a 30y for 10y, a 25y for 5y — matching the practitioner "reach the target within
  // the first ~10-15 years, then hold" shape (Pfau-Kitces red zone; the first ~15 years dominate a
  // 30y outcome). Before this the glide ran linearly to the final year.
  const riseYears = Math.max(5, duration - 20);
  const progress = Math.min(1, year / riseYears);
  return equityGlide.start + (equityGlide.end - equityGlide.start) * progress;
}

/**
 * Derive the tent's {start,end} growth-sleeve equity fractions from the chosen ENDGAME split.
 * The chosen allocation is the DESTINATION (end): the tent starts `spread` lower in equity (more
 * bond-heavy for the early red zone) and rises up to the chosen level, then holds. So "Balanced +
 * tent" ends at Balanced and is more cautious than Balanced early — never more aggressive.
 * @param {number} equityPct - whole-portfolio equity fraction of the chosen endgame (0..1)
 * @param {number} bondPct - whole-portfolio bond fraction of the chosen endgame (0..1)
 * @param {number} [spread=0.22] - how much lower (in growth-sleeve terms) equity starts vs the endgame
 * @returns {{start:number,end:number}}
 */
export function equityGlideFromRisk(equityPct, bondPct, spread = 0.22) {
  const growth = equityPct + bondPct;
  if (growth <= 0) return { start: 0, end: 0 };
  const endShare = equityPct / growth;                     // endgame equity share of the growth sleeve
  return {
    start: Math.max(0, endShare - spread),
    end:   endShare
  };
}

// Default growth-sleeve equity-share RISE for a start-anchored (tagged) tent. Kept modest — the tent
// can be subtle. Overridable per plan once the endgame picker exists.
export const TENT_DEFAULT_RISE = 0.12;

/**
 * Tent glide for a TAGGED portfolio: the tagged allocation is the START (the user's real holdings NOW),
 * and equity rises FROM there toward an endgame — the opposite anchoring to equityGlideFromRisk (where
 * the chosen mix is the destination). Year-0 target therefore equals current holdings, so there is no
 * spurious "rebalance now" advice; the moves appear gradually as the glide progresses.
 * @param {number} startEquityPct - whole-portfolio equity fraction of the tagged start
 * @param {number} startBondPct - whole-portfolio bond fraction of the tagged start
 * @param {?{equityPct:number,bondPct:number}} endgame - optional endgame allocation; default = start + rise
 * @param {number} [rise=TENT_DEFAULT_RISE] - fallback rise in growth-sleeve equity share
 * @returns {{start:number,end:number}} growth-sleeve equity shares
 */
export function equityGlideFromStart(startEquityPct, startBondPct, endgame = null, rise = TENT_DEFAULT_RISE) {
  const growth = startEquityPct + startBondPct;
  if (growth <= 0) return { start: 0, end: 0 };
  const startShare = startEquityPct / growth;
  let endShare;
  if (endgame && (endgame.equityPct + endgame.bondPct) > 0) {
    endShare = endgame.equityPct / (endgame.equityPct + endgame.bondPct);
  } else {
    endShare = Math.min(1, startShare + rise);
  }
  return { start: startShare, end: endShare };
}

/**
 * The tent glide for a plan's settings, used by BOTH engines so they stay in lockstep:
 *   - TAGGED allocation (settings carry sub-class weights) → START-anchored (tagged mix = the start),
 *     rising toward settings.glideEndgame (or a default rise). Year-0 target = current holdings.
 *   - otherwise → DESTINATION-anchored (chosen mix = the endgame), the classic behaviour.
 * @param {object} settings - plan settings (equityMin/bondMin, optional subAsset, optional glideEndgame)
 * @returns {{start:number,end:number}}
 */
export function tentGlideForSettings(settings) {
  const tagged = !!(settings.subAsset && settings.subAsset.bondWeights &&
    Object.keys(settings.subAsset.bondWeights).length > 0);
  const endgame = (settings.glideEndgame &&
    (settings.glideEndgame.equityPct + settings.glideEndgame.bondPct) > 0) ? settings.glideEndgame : null;
  return tagged
    ? equityGlideFromStart(settings.equityMin, settings.bondMin, endgame)
    : equityGlideFromRisk(settings.equityMin, settings.bondMin);
}

/**
 * The whole-portfolio target mix for a given year (tent-aware) — what the
 * Decision Tool reports as "this year's target" and rebalances toward. Cash is
 * held flat as the downturn buffer; only equity/bond glide within the growth sleeve.
 * @param {{equity:number,bond:number,cash:number,equityGlide?:{start:number,end:number}}} alloc - fractions
 * @param {number} year
 * @param {number} duration
 * @returns {{equity:number,bond:number,cash:number}} fractions summing to 1
 */
export function targetMixForYear(alloc, year, duration) {
  const cash = alloc.cash;
  const growth = Math.max(0, 1 - cash);                    // == equity + bond
  const share = glideShareForYear(alloc.equityGlide, year, duration);
  if (share == null) return { equity: alloc.equity, bond: alloc.bond, cash };
  return { equity: growth * share, bond: growth * (1 - share), cash };
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

// Inflation mechanics now live in InflationModel (single source of truth).
// Re-exported here to preserve this module's public API for existing importers.
export { cumulativeInflation as calculateCumulativeInflation, cappedInflation as calculateCappedInflation } from './InflationModel.js';

/**
 * Generates a complete glidepath schedule
 * @param {object} settings - Settings with equityMin, bondMin, cashTarget, duration
 * @param {number} assumedInflation - Assumed annual inflation rate
 * @returns {object[]} Array of yearly glidepath values
 */
export function generateGlidepathSchedule(settings, assumedInflation = INFLATION_DEFAULTS.ASSUMED_CPI) {
  const schedule = [];

  // Bond tent: when enabled, re-split the growth floor each year by the same rising-equity glide the
  // engine uses, so this schedule reflects the equity share RISING over the early years then holding —
  // not the flat entered split. Cash is left alone. Off → unchanged (the original depleting floors).
  const glide = settings.equityGlideEnabled ? equityGlideFromRisk(settings.equityMin, settings.bondMin) : null;

  for (let year = 0; year <= settings.duration; year++) {
    const cumInf = Math.pow(1 + assumedInflation, year);
    const values = calculateAllGlidepaths(settings, year, cumInf);

    let equityMin = values.equity, bondMin = values.bond;
    if (glide) {
      const share = glideShareForYear(glide, year, settings.duration);
      const growthMin = equityMin + bondMin;
      equityMin = growthMin * share;
      bondMin = growthMin * (1 - share);
    }

    schedule.push({
      year,
      cumulativeInflation: cumInf,
      equityMin,
      bondMin,
      cashTarget: values.cash,
      totalMin: equityMin + bondMin + values.cash
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
