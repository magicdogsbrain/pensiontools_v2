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
 * THE DIVERSIFIERS SLEEVE'S GLIDEPATH (owner, 30 Sep 2026: "same as shares and bonds"): the sleeve's
 * starting value, raised by inflation and run down in a straight line to nothing at the end of the
 * plan — exactly how the shares and bonds glidepaths move (GlidepathService.calculateGlidepath with
 * the growth-fund flag; see diversifierGlidepath below). Until 6.14.0 it was the starting value,
 * flat in pounds. The bond tent re-divides the shares + bonds total between those two only, so it
 * does not touch the sleeve's line. The break-glass HODL reserve is not a growth pot and is on
 * neither side. (WithdrawalSourcing still ranks the sleeve against its flat starting value when it
 * chooses which pot pays — a separate question from this comparison.)
 *
 * WHOLE PENNIES: both sides are rounded to the penny before they are compared (pennies / isBelow).
 * Sourcing leaves pots sitting EXACTLY on their floors, so the comparison is regularly made at
 * equality, where the last binary digit of a sum of three pots decided the month (one case turned
 * on 2.9e-11 of a pound). A pot on its glidepath to the penny is on it, not below it. The same
 * penny comparison decides leaving (above glidepaths + buffer), in both engines.
 *
 * Buckets in order has its own comparison (the WHOLE pot against the whole track, cash included,
 * with a dead band) and passes that through the same function: only what is compared differs.
 *
 * Pure. Evaluated once per month on the start-of-month pot values vs that month's glidepaths.
 */

import { DRAWDOWN_DEFAULTS } from '../constants.js';
import { calculateGlidepath } from './GlidepathService.js';

export const PROTECTION_DEFAULTS = {
  CONSECUTIVE_LIMIT: 3,   // consecutive months below the glidepaths (the current month included) to enter
  // Growth must exceed min by this to leave protection. SINGLE SOURCE: the same
  // DRAWDOWN_DEFAULTS.RECOVERY_BUFFER every saved Decision settings doc is stamped with —
  // previously this was 10000 while saved settings carried 15000, so the Stress engine
  // (which never received the user's value) ran a different protection rule.
  RECOVERY_BUFFER: DRAWDOWN_DEFAULTS.RECOVERY_BUFFER
};

/** An amount in whole pennies — what every protection comparison is made in. */
export function pennies(amount) {
  return Math.round((amount || 0) * 100);
}

/** Is `amount` less than `line`, to the penny? (A pot on its line to the penny is ON it.) */
export function isBelow(amount, line) {
  return pennies(amount) < pennies(line);
}

/**
 * The diversifiers sleeve's glidepath for a plan year: its starting value raised by inflation and
 * run down in a straight line to nothing at the end of the plan — the identical treatment to the
 * shares and bonds glidepaths. ONE definition for both engines.
 * @param {number} startValue - the sleeve's starting value (settings/config diversifierStart)
 * @param {number} year - plan year (0-indexed)
 * @param {number} duration - plan length in years
 * @param {number} cumulativeInflation - cumulative inflation factor for that year
 * @returns {number}
 */
export function diversifierGlidepath(startValue, year, duration, cumulativeInflation) {
  return calculateGlidepath(startValue || 0, year, duration, cumulativeInflation, true);
}

/**
 * The two sides of the owner's comparison for one month: what the growth pots add up to, and what
 * their glidepaths add up to. ONE definition for both engines, so neither can leave a pot out.
 * @param {object} p
 * @param {number} p.equity, p.bond - shares and bonds pots
 * @param {number} [p.diversifier=0] - diversifiers sleeve
 * @param {number} p.equityGlide, p.bondGlide - this month's glidepath value of each
 * @param {number} [p.diversifierGlide=0] - the sleeve's glidepath this month (diversifierGlidepath)
 * @returns {{growth: number, glide: number, below: boolean}} below: growth is less than glide, in whole pennies
 */
export function growthVsGlide({ equity, bond, diversifier = 0, equityGlide, bondGlide, diversifierGlide = 0 }) {
  const growth = (equity || 0) + (bond || 0) + (diversifier || 0);
  const glide = (equityGlide || 0) + (bondGlide || 0) + (diversifierGlide || 0);
  return { growth, glide, below: isBelow(growth, glide) };
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

  // Both tests in whole pennies (see the header): equality to the penny is "on the line".
  // Continue protection from last month until the growth pots recover above their glidepaths + buffer.
  if (wasInProtection) {
    inProtection = pennies(totalGrowth) <= pennies(minGrowth + recoveryBuffer);
  }

  // Enter when this month is below the glidepaths and completes the run (+1 = this month).
  if (!inProtection && isBelow(totalGrowth, minGrowth) && (consecBelowGlide || 0) + 1 >= consecutiveLimit) {
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
