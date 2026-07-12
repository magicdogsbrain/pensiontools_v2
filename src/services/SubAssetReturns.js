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

  // Corporate credit: spread WIDENS (capital loss) when equities fall, tightens in a rally.
  // eqShock < 0 in a selloff → credit < 0.
  const eqShock = eqReturn - 0.10;                        // demeaned equity shock
  const credit = (profile.creditBeta || 0) * eqShock * 0.5;

  // Crash-hedge boost (long US treasuries, gold): pays in an equity crash.
  const crisisOn = eqReturn < CRISIS_EQ_THRESHOLD ? 1 : 0;
  const crisis = (profile.crisisBeta || 0) * crisisOn * Math.min(0.15, Math.abs(eqShock));

  // Non-linker inflation hedge (gold): partial, distinct from the linker principal accretion.
  const inflHedge = isReal ? 0 : (profile.inflationBeta || 0) * (inf - 0.025);

  // Idiosyncratic residual, calibrated so total modelled vol ≈ profile.vol.
  const idio = gaussianRandom(0, profile.idioVol || 0, rng);

  return carry + capital + credit + crisis + inflHedge + idio;
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
