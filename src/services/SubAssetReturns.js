/**
 * Sub-Asset Return Kernel — the driver/factor decomposition (opt-in; see SubAssetModel.js).
 * =============================================================================
 * Generates annual returns for the bond-family sub-classes (short/long gilts, index-linked,
 * corporate) as TRANSFORMS of the engine's replayed primitives — the equity path and the
 * inflation path — plus a derived GILT-YIELD path and a small idiosyncratic residual.
 *
 * Nothing here fires unless a run passes `config.subAsset`; with it absent the engine takes
 * the legacy `calculateBondReturn` branch and the golden fixtures stay byte-identical.
 *
 * WHY THIS STAYS CONSISTENT WITH HISTORY + SCENARIOS: every number below is a function of the
 * same (inf, prevInf, eqReturn, prevEqReturn) the engine already replays. So in the 2022 row
 * (high inflation + falling equities) long gilts crash and short gilts barely move; in a 2008/
 * 2020 row (equity crash, low inflation) gilts RALLY (rate-cut flight-to-quality). The crisis
 * behaviour EMERGES from the driver path — it is not hard-coded per scenario.
 */

import { gaussianRandom } from '../utils/MathUtils.js';
import { SUB_ASSET_PROFILES } from './SubAssetModel.js';

// -----------------------------------------------------------------------------
// Gilt-yield path, DERIVED from the inflation driver (decision: derive-from-inflation
// rather than add a separate historical yield series). Calibrated so:
//   • nominal yield ≈ 4.5% at ~2.5% inflation (the current post-2022 regime), and
//   • a 2022-scale inflation spike (~9%) lifts the yield ~2.3pp, which at ~15y duration
//     reproduces the ~35% long-gilt drawdown while leaving short gilts (2.5y) ~flat.
// The pass-through is DAMPENED (< 1) because expectations/policy anchor long yields — yields
// do not move one-for-one with realised inflation.
// -----------------------------------------------------------------------------
export const GILT_YIELD_ANCHOR = 0.036;          // nominal yield at zero inflation, normal regime
export const GILT_INFLATION_PASSTHROUGH = 0.40;  // dampened inflation → nominal-yield pass-through
export const REAL_YIELD_ANCHOR = 0.005;          // real (index-linked) yield at ~2.5% inflation
export const REAL_INFLATION_PASSTHROUGH = 0.35;  // real yields move less, but DID spike hard in 2022
export const CRISIS_RATE_CUT = 0.010;            // yield fall in a low-inflation equity crash (rate cuts)
export const CRISIS_EQ_THRESHOLD = -0.15;        // equity return below this = crash regime
export const HIGH_INFLATION = 0.045;             // above this, crashes do NOT trigger rate cuts (2022)

/** Nominal gilt yield LEVEL for a given inflation + equity state. Rate cuts fire only in a
 *  low-inflation equity crash (flight-to-quality); in a high-inflation crash (2022) they don't. */
export function giltYieldLevel(inf, eqReturn = 0.10) {
  let y = GILT_YIELD_ANCHOR + GILT_INFLATION_PASSTHROUGH * inf;
  if (eqReturn < CRISIS_EQ_THRESHOLD && inf < HIGH_INFLATION) y -= CRISIS_RATE_CUT;
  return y;
}

/** Real (index-linked) yield LEVEL. Real yields also spiked in 2022 (policy raised real rates),
 *  which is why long linkers fell hardest — captured by the positive inflation pass-through. */
export function realYieldLevel(inf, eqReturn = 0.10) {
  let ry = REAL_YIELD_ANCHOR + REAL_INFLATION_PASSTHROUGH * (inf - 0.025);
  if (eqReturn < CRISIS_EQ_THRESHOLD && inf < HIGH_INFLATION) ry -= CRISIS_RATE_CUT;
  return ry;
}

// -----------------------------------------------------------------------------
// Regime-aware equity correlation — the generalisation of the legacy single scalar
// `equityBondRho(inf, eqReturn)` to a PER-SLEEVE, regime-dependent structure.
//
// The rate/inflation co-movement (why gilts fall with equities in 2022, rally in 2008) is
// already carried structurally by each sleeve's `capital` term via the derived-yield path.
// The overlay below adds only the RESIDUAL equity correlation not explained by rates — the
// credit/sentiment channel (corporate spreads blow out with equities; gold stays ~uncorrelated;
// trend turns negative in stress). Imposed on each sleeve's idiosyncratic shock, variance-
// preserving, so the marginal vol still ≈ the CMA vol while the correlation lands on target.
// -----------------------------------------------------------------------------

/** Market regime for a year, generalising the three equityBondRho branches. */
export function marketRegime(ctx) {
  if (ctx.inf > 0.045) return 'inflation';                 // high inflation — assets fall together
  if (ctx.eqReturn < CRISIS_EQ_THRESHOLD) return 'crash';  // equity crash, normal inflation — flight to quality
  return 'normal';                                         // mild positive
}

// Per-sleeve residual equity correlation by regime. `normal` ≈ each profile's eqCorr net of the
// rate channel; `inflation` raises it (2022 co-crash); `crash` flips the safe sleeves NEGATIVE
// (flight to quality) but pushes credit POSITIVE (spreads blow out with equities).
export const SLEEVE_EQ_RHO = Object.freeze({
  shortGilts:      { normal: 0.05, inflation: 0.30, crash: -0.20 },
  longGilts:       { normal: 0.10, inflation: 0.45, crash: -0.35 },
  indexLinked:     { normal: 0.15, inflation: 0.35, crash: -0.15 },
  corporateIG:     { normal: 0.35, inflation: 0.45, crash:  0.55 },
  globalAggHedged: { normal: 0.25, inflation: 0.40, crash:  0.10 },
  usTreasHedged:   { normal: 0.05, inflation: 0.25, crash: -0.40 },
  infraDebt:       { normal: 0.30, inflation: 0.35, crash:  0.35 },
  gold:            { normal: 0.00, inflation: -0.05, crash: -0.20 },
  trendMacro:      { normal: 0.05, inflation: -0.10, crash: -0.30 }
});

/** Regime-dependent residual equity correlation for a named sleeve (0 if unknown). */
export function subAssetEquityRho(key, ctx) {
  const row = SLEEVE_EQ_RHO[key];
  if (!row) return 0;
  const r = row[marketRegime(ctx)];
  return r == null ? row.normal : r;
}

// Reverse lookup so subAssetReturn can find a profile's sleeve key without an extra argument.
const PROFILE_KEY = new Map(Object.entries(SUB_ASSET_PROFILES).map(([k, v]) => [v, k]));

/**
 * A shock with marginal sd = `sd` and correlation `rho` with the standardised equity surprise
 * (eqZ, mean 10% / sd 17% — the same anchor the legacy overlay used). Variance-preserving:
 *   z = rho·eqZ + sqrt(1−rho²)·independent-normal.
 */
function correlatedResidual(sd, rho, eqReturn, rng) {
  if (!sd) return 0;
  const eqZ = (eqReturn - 0.10) / 0.17;
  const indep = gaussianRandom(0, 1, rng);
  const z = rho * eqZ + Math.sqrt(Math.max(0, 1 - rho * rho)) * indep;
  return sd * z;
}

/**
 * Annual return for a single (bond-family) sub-class, via the driver decomposition:
 *   return = carry + capital + credit + crisis + inflationHedge + idiosyncratic
 *     carry    — last year's yield you were earning (+ inflation accretion for linkers)
 *     capital  — −duration × change in the relevant yield (the 2022 crash mechanic)
 *     credit   — corporate spread co-moves with the equity shock (widens as equities fall)
 *     crisis   — flight-to-quality boost for designated crash hedges (long UST) / gold
 *     inflHedge— partial inflation hedge for non-linker real assets (gold)
 * @param {object} profile - a SUB_ASSET_PROFILES entry
 * @param {object} ctx - { inf, prevInf, eqReturn, prevEqReturn }
 * @param {function} rng - seeded RNG (for the idiosyncratic draw only)
 */
export function subAssetReturn(profile, ctx, rng) {
  const { inf, prevInf, eqReturn, prevEqReturn = 0.10 } = ctx;
  const isReal = !!profile.realYield;
  const dur = profile.duration || 0;

  // The gilt-yield path drives only the CURVE SHIFT (capital gains/losses); each sub-class
  // earns its OWN yield as carry, so the short/long curve (short carries less than long) is
  // preserved instead of being flattened to one level.
  const dYield = isReal
    ? realYieldLevel(inf, eqReturn) - realYieldLevel(prevInf, prevEqReturn)
    : giltYieldLevel(inf, eqReturn) - giltYieldLevel(prevInf, prevEqReturn);

  // carry: the sub-class's own yield. Linkers additionally accrete this year's inflation.
  const carry = isReal
    ? (profile.yieldReal || 0) + inf
    : (profile.yield || 0);

  const capital = -dur * dYield;

  // Non-linker inflation hedge (gold): partial, distinct from the linker principal accretion.
  const inflHedge = isReal ? 0 : (profile.inflationBeta || 0) * (inf - 0.025);

  // Regime-aware, equity-correlated idiosyncratic residual (generalises equityBondRho). Carries
  // the RESIDUAL credit/sentiment correlation — corporate spreads widen with equities, gilts turn
  // negative in a flight-to-quality crash — on top of the structural rate co-movement in `capital`.
  const idio = correlatedResidual(profile.idioVol || 0, subAssetEquityRho(PROFILE_KEY.get(profile), ctx), eqReturn, rng);

  return carry + capital + inflHedge + idio;
}

// Default composition of the BONDS bucket across its sub-classes (used when a run opts in but
// doesn't specify weights). Balances the reliable short-gilt buffer, a long-duration sleeve,
// inflation-linked protection, and credit income.
export const DEFAULT_BOND_WEIGHTS = Object.freeze({
  shortGilts: 0.30, longGilts: 0.20, indexLinked: 0.20, corporateIG: 0.30
});

/**
 * BONDS-bucket annual return: the weighted sum of its sub-class returns. This is the opt-in
 * replacement for the legacy blended `calculateBondReturn` — same single bond pot, but its
 * return is now driven by the labelled sub-classes and the derived yield path.
 * @param {object} ctx - { inf, prevInf, eqReturn, prevEqReturn }
 * @param {function} rng - seeded RNG
 * @param {object} weights - sub-class -> weight (defaults to DEFAULT_BOND_WEIGHTS)
 */
export function bondBucketReturn(ctx, rng, weights = DEFAULT_BOND_WEIGHTS) {
  let r = 0;
  for (const key of Object.keys(weights)) {
    const w = weights[key];
    if (!w) continue;
    const profile = SUB_ASSET_PROFILES[key];
    if (!profile) continue;
    r += w * subAssetReturn(profile, ctx, rng);
  }
  return r;
}

// -----------------------------------------------------------------------------
// DIVERSIFIERS bucket — gold + trend/macro. These are the two sleeves the {equity,
// inflation, yield} drivers don't explain; they're the actual tail hedges. Each carries
// a base drift (the CMA expected return net of the systematic terms) rather than a yield.
// -----------------------------------------------------------------------------
// Base drifts are the CMA NOMINAL returns from docs/asset-class-research.md (gold ~5.5%,
// trend ~4.5%), less a small offset for the crisis boost's positive expected value, so the
// sleeve earns its documented long-run return on average and only ADDS tail protection —
// it must not silently under-return vs bonds (~5%), which would fake a compounding drag.
export const GOLD_DRIFT = 0.048;  // + inflation hedge + (rare) crisis boost ≈ 5.5% nominal mean
export const TREND_DRIFT = 0.045; // managed-futures nominal; captured-momentum term is ~zero-mean

/**
 * Gold: near-uncorrelated, a partial inflation hedge, and a flight-to-quality asset that RISES
 * when equities crash (held up in 2022 when stocks AND bonds both fell). Memoryless.
 * @param {object} ctx - { inf, eqReturn }
 */
export function goldReturn(ctx, rng) {
  const { inf, eqReturn } = ctx;
  const p = SUB_ASSET_PROFILES.gold;
  const inflHedge = (p.inflationBeta || 0) * (inf - 0.025);
  // Flight-to-quality now comes from the NEGATIVE crash-regime correlation (gold rises as equities
  // fall), not an ad-hoc crisis term — one principled correlation mechanism across all sleeves.
  const idio = correlatedResidual(p.idioVol || 0, subAssetEquityRho('gold', ctx), eqReturn, rng);
  return GOLD_DRIFT + inflHedge + idio;
}

/**
 * Trend / managed futures: PATH-DEPENDENT. It holds a LAGGED position (the sign of trailing
 * market momentum) and earns that position times the current move — so it profits when a trend
 * PERSISTS (the prolonged 2008/2022 selloffs) but is whipsawed when the market reverses sharply
 * (the V-shaped 2020 crash-and-rebound). `trendSignal` in [-1, 1] is the lagged position.
 * @param {object} ctx - { eqReturn }
 * @param {number} trendSignal - lagged position, sign/scale of trailing momentum, clamped [-1,1]
 */
export function trendReturn(ctx, rng, trendSignal) {
  const p = SUB_ASSET_PROFILES.trendMacro;
  const eqExcess = ctx.eqReturn - 0.05;                    // move relative to a cash-ish anchor
  const captured = (p.momentumBeta || 0) * trendSignal * eqExcess;
  const idio = correlatedResidual(p.idioVol || 0, subAssetEquityRho('trendMacro', ctx), ctx.eqReturn, rng);
  return TREND_DRIFT + captured + idio;
}

// EWMA smoothing + scale for the trend position. Update folds in each year's equity return;
// the position is the smoothed momentum divided by a ~15% scale, clamped to [-1, 1].
export const TREND_MOM_DECAY = 0.6;
export const TREND_MOM_SCALE = 0.15;

/** Fold one year's equity return into the running trend-momentum state. */
export function updateTrendMomentum(mom, eqReturn) {
  return TREND_MOM_DECAY * mom + (1 - TREND_MOM_DECAY) * eqReturn;
}

/** Lagged trend position in [-1, 1] from the momentum state. */
export function trendSignalFromMomentum(mom) {
  return Math.max(-1, Math.min(1, mom / TREND_MOM_SCALE));
}

export const DEFAULT_DIVERSIFIER_WEIGHTS = Object.freeze({ gold: 0.5, trendMacro: 0.5 });

/**
 * DIVERSIFIERS-bucket annual return: weighted blend of gold + trend.
 * @param {object} ctx - { inf, eqReturn }
 * @param {function} rng - seeded RNG
 * @param {number} trendSignal - the lagged trend position for this year
 * @param {object} weights - sub-class -> weight (defaults to DEFAULT_DIVERSIFIER_WEIGHTS)
 */
export function diversifierBucketReturn(ctx, rng, trendSignal, weights = DEFAULT_DIVERSIFIER_WEIGHTS) {
  let r = 0;
  if (weights.gold) r += weights.gold * goldReturn(ctx, rng);
  if (weights.trendMacro) r += weights.trendMacro * trendReturn(ctx, rng, trendSignal);
  return r;
}
