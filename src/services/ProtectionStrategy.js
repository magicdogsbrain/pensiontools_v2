/**
 * Protection Strategy — the single downturn-protection decision both engines use.
 *
 * "Protection" means: during a market downturn, reduce the SIPP draw (the pull on the stressed
 * growth/cash pots) to preserve the portfolio, accepting lower income until it recovers. The
 * ISA top-up is unaffected (a stable money-market fund — see SimulationEngine / legacyDecision).
 *
 * THE RULE, in the owner's words (Pots & Valves):
 *   "For a month to count in the X number of consecutive months that would switch protection mode
 *    on - the growth pots (i.e. shares plus bonds) must be below their glide paths. That means total
 *    shares pot plus total bonds pot (plus diversifiers etc) - must add up to less than the sum of
 *    the glidepaths of the relevant pots."
 *   - ENTER protection in the month that completes X consecutive months in which the growth pots
 *     (shares + bonds + diversifiers) add up to less than the sum of their glidepaths. The current
 *     month counts. X is consecutiveLimit (default 3).
 *   - STAY in protection, once in it, until the growth pots recover above the sum of their
 *     glidepaths plus the recovery buffer.
 *   Which pot PAID a month's income plays no part: a month paid from cash while the growth pots
 *   are on or above their glidepaths does not count (until 6.13.4 the count was of consecutive
 *   cash-sourced draws, and the diversifiers were left out of the comparison).
 *
 * The diversifiers sleeve is "held flat": its glidepath is its starting value, every month (the
 * same target WithdrawalSourcing ranks it against). The break-glass HODL reserve is not a growth
 * pot and is on neither side.
 *
 * Buckets in order has its own comparison (the WHOLE pot against the whole track, cash included,
 * with a dead band) and passes that through the same function: only what is compared differs.
 *
 * Pure. Evaluated once per month on the start-of-month pot values vs that month's glidepaths.
 */

import { DRAWDOWN_DEFAULTS } from '../constants.js';

export const PROTECTION_DEFAULTS = {
  CONSECUTIVE_LIMIT: 3,   // consecutive months below the glidepaths (the current month included) to enter
  // Growth must exceed min by this to leave protection. SINGLE SOURCE: the same
  // DRAWDOWN_DEFAULTS.RECOVERY_BUFFER every saved Decision settings doc is stamped with —
  // previously this was 10000 while saved settings carried 15000, so the Stress engine
  // (which never received the user's value) ran a different protection rule.
  RECOVERY_BUFFER: DRAWDOWN_DEFAULTS.RECOVERY_BUFFER
};

/**
 * The two sides of the owner's comparison for one month: what the growth pots add up to, and what
 * their glidepaths add up to. ONE definition for both engines, so neither can leave a pot out.
 * @param {object} p
 * @param {number} p.equity, p.bond - shares and bonds pots
 * @param {number} [p.diversifier=0] - diversifiers sleeve
 * @param {number} p.equityGlide, p.bondGlide - this month's glidepath value of each
 * @param {number} [p.diversifierGlide=0] - the sleeve's held-flat target (its starting value)
 * @returns {{growth: number, glide: number, below: boolean}}
 */
export function growthVsGlide({ equity, bond, diversifier = 0, equityGlide, bondGlide, diversifierGlide = 0 }) {
  const growth = (equity || 0) + (bond || 0) + (diversifier || 0);
  const glide = (equityGlide || 0) + (bondGlide || 0) + (diversifierGlide || 0);
  return { growth, glide, below: growth < glide };
}

/**
 * @param {object} p
 * @param {number} p.totalGrowth - the growth pots added up (shares + bonds + diversifiers), start of month
 * @param {number} p.minGrowth - the sum of those pots' glidepaths this month
 * @param {number} p.consecBelowGlide - how many months IMMEDIATELY BEFORE this one, in an unbroken
 *   run, had the growth pots below the sum of their glidepaths (this month is judged here and added)
 * @param {boolean} p.wasInProtection - whether last month was in protection
 * @param {number} [p.consecutiveLimit]
 * @param {number} [p.recoveryBuffer]
 * @returns {boolean} whether this month is in protection
 */
export function assessProtection({
  totalGrowth,
  minGrowth,
  consecBelowGlide,
  wasInProtection,
  consecutiveLimit = PROTECTION_DEFAULTS.CONSECUTIVE_LIMIT,
  recoveryBuffer = PROTECTION_DEFAULTS.RECOVERY_BUFFER
}) {
  let inProtection = false;

  // Continue protection from last month until the growth pots recover above their glidepaths + buffer.
  if (wasInProtection) {
    inProtection = totalGrowth <= minGrowth + recoveryBuffer;
  }

  // Enter when this month is below the glidepaths and completes the run (+1 = this month).
  if (!inProtection && totalGrowth < minGrowth && (consecBelowGlide || 0) + 1 >= consecutiveLimit) {
    inProtection = true;
  }

  return inProtection;
}

/**
 * Protection income multiplier with a Guyton-Klinger-aligned first step: published guardrail
 * practice cuts ~10% first (G-K's decision rule; risk-based guardrails cut even less) and only
 * deepens if stress persists — a single immediate 20% cut is double the standard. The user's
 * configured multiplier remains the DEEP cut; the first ESCALATE_MONTHS of a protection
 * episode apply half that cut (e.g. deep 0.8 → first-step 0.9).
 */
export const PROTECTION_ESCALATE_MONTHS = 12;

export function protectionMultForStreak(protStreakMonths, deepMult, escalateMonths = PROTECTION_ESCALATE_MONTHS) {
  const dm = deepMult ?? 0.8;
  const esc = Number.isFinite(+escalateMonths) ? Math.max(0, +escalateMonths) : PROTECTION_ESCALATE_MONTHS;
  if (protStreakMonths < esc) return 1 - (1 - dm) / 2;   // first stage: half the cut (0 months = straight to the deep cut)
  return dm;
}
