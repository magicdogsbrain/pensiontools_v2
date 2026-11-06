/**
 * Spending Model — the single source of truth for how real spending changes through retirement.
 *
 * Both engines (Stress SimulationEngine + Decision drawdown/wizard) consume THIS so they move the
 * target income identically.
 *
 * Shape (the "retirement spending smile", simplified to level → gentle decline → level):
 *   • Years 0..4            LEVEL   (go-go years — spending holds)
 *   • Years 5..24           DECLINE ~1%/yr real (slow-go years)
 *   • Years 25+             LEVEL   (no-go years — holds at the reached floor)
 *
 * The phase boundaries are ANCHORED IN YEARS-FROM-RETIREMENT (life stage), NOT scaled to the plan
 * duration: a longer plan simply spends more years on the final level; a plan shorter than 25 years
 * gets a truncated curve. This is gentler than a plain 1%/yr-from-year-0 decline — total real drop is
 * ~0.99^20 ≈ 18% (vs the old 25% floor), and only across the middle of retirement.
 *
 * Late-life care costs are deliberately NOT rebounded here — they belong in a separate overlay.
 * 'flat' profiles are unaffected (factor 1, rate 0), so the conservative default is byte-identical.
 */

// First year in which spending steps down (years 0..DECLINE_START-1 are level).
export const SPEND_DECLINE_START_YEAR = 5;
// Number of years over which spending declines before levelling off again.
export const SPEND_DECLINE_YEARS = 20;
// Real decline per declining year (~1%/yr, Blanchett's spending smile).
export const SPEND_DECLINE_RATE = 0.01;

/**
 * How many 1%-decline steps have been applied by a given plan year.
 * year 4 → 0, year 5 → 1 (first drop), year 24 → 20, year 25+ → 20 (capped, then level).
 */
function declineSteps(year) {
  return Math.min(
    Math.max(0, Math.floor(year) - SPEND_DECLINE_START_YEAR + 1),
    SPEND_DECLINE_YEARS
  );
}

/**
 * ABSOLUTE spending factor at a plan year (multiplies the inflation-adjusted target income).
 * Used by the Stress engine and the Decision drawdown projection.
 *
 * @param {number} year - Plan year, 0-based (0 = retirement start).
 * @param {string} profile - 'flat' (returns 1) or 'declining'.
 * @returns {number} Factor in (0, 1].
 */
export function spendingSmileFactor(year, profile = 'declining') {
  if (profile !== 'declining') return 1;
  return Math.pow(1 - SPEND_DECLINE_RATE, declineSteps(year));
}

/**
 * INCREMENTAL real decline applied going from (year-1) to (year) — i.e. 1 − factor(year)/factor(year-1).
 * Used by the April tax-year wizard, which uplifts LAST year's confirmed salary: it is ~1% only during
 * the slow-go window and 0 in the level phases, so the wizard reproduces the same curve step by step.
 *
 * @param {number} year - Plan year the salary is being set FOR, 0-based.
 * @param {string} profile - 'flat' (returns 0) or 'declining'.
 * @returns {number} Decline rate for that single year (0 or ~SPEND_DECLINE_RATE).
 */
export function spendingDeclineRateForYear(year, profile = 'declining') {
  if (profile !== 'declining') return 0;
  const prev = spendingSmileFactor(year - 1, profile);
  if (prev === 0) return 0;
  return 1 - spendingSmileFactor(year, profile) / prev;
}
