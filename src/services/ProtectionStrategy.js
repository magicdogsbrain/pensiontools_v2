/**
 * Protection Strategy — the single downturn-protection decision both engines use.
 *
 * "Protection" means: during a market downturn, reduce the SIPP draw (the pull on the stressed
 * growth/cash pots) to preserve the portfolio, accepting lower income until it recovers. The
 * ISA top-up is unaffected (a stable money-market fund — see SimulationEngine / legacyDecision).
 *
 * Canonical rule (the Decision engine's, adopted for both after cross-validation showed the two
 * hand-written rules disagreed on ~2.8% of months):
 *   - ENTER protection when the growth pots are below their glidepath minimum AND there have
 *     been enough consecutive cash draws (growth<min AND consecCashDraws+1 >= consecutiveLimit).
 *   - STAY in protection, once in it, until the growth pots recover above min + recoveryBuffer.
 *
 * Pure. Evaluated once per month on the start-of-month growth-pot value vs the glidepath minimum.
 */

import { DRAWDOWN_DEFAULTS } from '../constants.js';

export const PROTECTION_DEFAULTS = {
  CONSECUTIVE_LIMIT: 3,   // consecutive cash draws (incl. the prospective current one) to enter
  // Growth must exceed min by this to leave protection. SINGLE SOURCE: the same
  // DRAWDOWN_DEFAULTS.RECOVERY_BUFFER every saved Decision settings doc is stamped with —
  // previously this was 10000 while saved settings carried 15000, so the Stress engine
  // (which never received the user's value) ran a different protection rule.
  RECOVERY_BUFFER: DRAWDOWN_DEFAULTS.RECOVERY_BUFFER
};

/**
 * @param {object} p
 * @param {number} p.totalGrowth - current growth-pot value (equity + bond), start of month
 * @param {number} p.minGrowth - glidepath minimum for the growth pots (equityMin + bondMin)
 * @param {number} p.consecCashDraws - trailing consecutive months whose draw came from cash
 * @param {boolean} p.wasInProtection - whether last month was in protection
 * @param {number} [p.consecutiveLimit]
 * @param {number} [p.recoveryBuffer]
 * @returns {boolean} whether this month is in protection
 */
export function assessProtection({
  totalGrowth,
  minGrowth,
  consecCashDraws,
  wasInProtection,
  consecutiveLimit = PROTECTION_DEFAULTS.CONSECUTIVE_LIMIT,
  recoveryBuffer = PROTECTION_DEFAULTS.RECOVERY_BUFFER
}) {
  let inProtection = false;

  // Continue protection from last month until the growth pots recover above min + buffer.
  if (wasInProtection) {
    inProtection = totalGrowth <= minGrowth + recoveryBuffer;
  }

  // Enter new protection when below minimum with enough consecutive cash draws (+1 = this month).
  if (!inProtection && totalGrowth < minGrowth && consecCashDraws + 1 >= consecutiveLimit) {
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

export function protectionMultForStreak(protStreakMonths, deepMult) {
  const dm = deepMult ?? 0.8;
  if (protStreakMonths < PROTECTION_ESCALATE_MONTHS) return 1 - (1 - dm) / 2;
  return dm;
}
