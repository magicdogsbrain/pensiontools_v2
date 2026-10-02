/**
 * One bar for "on course" (6.22.0; research/saver-lock-and-savings-growth.md §6; the owner's decision of 2 Oct 2026).
 *
 * "On course" means the money lasts in 9 futures out of 10, everywhere. Until 6.22.0 today's planner had three bars:
 * "Am I on track?" searched for the pot that lasted in 85% of futures, the "When could I retire?" spin cleared 90%, and
 * the couples, survivor and care checks called a plan solid from 85%. V7 has always used 9 in 10 (BAND.careful = 0.9,
 * VERDICT.yes = 0.10 in src/answers/shared/rules.js); tests/onCourse.test.js holds the two apps to this one number.
 *
 * Pure: no DOM, no storage. index.html imports the words and thresholds from here (its script may only shrink).
 */

/** The share of futures the money must last in to be "on course". */
export const ON_COURSE_SHARE = 0.9;
/** The same bar as a whole percent (the age spin's picker and rows are in percent). */
export const ON_COURSE_PCT = 90;
/** The bar in words. */
export const ON_COURSE_WORDS = 'lasts in 9 futures out of 10';
/** Below the bar but not far: the amber band of the checks (unchanged from before 6.22.0). */
export const BORDERLINE_SHARE = 0.7;

/** On course: a share of futures (0–1) at or above the bar. */
export function isOnCourse(share) {
  return typeof share === 'number' && Number.isFinite(share) && share >= ON_COURSE_SHARE - 1e-12;
}

/** The colour of a check's verdict box: on course green, borderline amber, else red. */
export function onCourseAlertClass(share) {
  return isOnCourse(share) ? 'alert-success' : share >= BORDERLINE_SHARE ? 'alert-warning' : 'alert-danger';
}

const pct = (x) => Math.round((+x || 0) * 100) + '%';

/** The couples check's headline: on course at 9 in 10 or more for both of them (it was "Looking solid" from 85%). */
export function jointVerdictHtml(share) {
  if (isOnCourse(share)) return 'On course: in ' + pct(share) + ' of 1,000 possible market futures the money lasted the whole way for <strong>both</strong> of you (9 in 10 or more).';
  if (share >= BORDERLINE_SHARE) return 'Not on course yet: the money lasted for both of you in only ' + pct(share) + ' of 1,000 possible market futures (on course is 9 in 10).';
  return 'At risk: the money lasted for both of you in just ' + pct(share) + ' of 1,000 possible market futures (on course is 9 in 10).';
}

// ---- "Am I on course?" (the Accumulation planner) ----

export const ON_COURSE_SEARCHING = 'Searching for the pot that ' + ON_COURSE_WORDS + ' against your plan… (a few seconds)';

/**
 * What the pot "Am I on course?" found is for, in words (moved out of index.html's runOnTrackCheck in 6.22.0).
 * @param {{ strategyId: string, name: string }} s   this plan's strategy, and its name (already safe for HTML)
 */
export function onCourseBasisHtml({ strategyId, name }) {
  if (strategyId === 'pots-and-valves') return 'to last in 9 futures out of 10 with <strong>Pots &amp; Valves</strong> (this plan\'s strategy) against your budget-derived target';
  if (strategyId === 'full-il-gilt' || strategyId === 'floor-the-schedule') return 'to buy every year of your income shape by contract with <strong>' + name + '</strong> (this plan\'s strategy) — no growth assumed after retirement, today\'s prices';
  return 'to last in 9 futures out of 10 with <strong>' + name + '</strong> (this plan\'s strategy) against your income shape';
}

/** One row's verdict: on course, or short by how much. */
export function onCourseVerdictHtml(pot, requiredPot) {
  const gbp = (v) => '£' + Math.round(+v || 0).toLocaleString('en-GB');
  return pot >= requiredPot
    ? '<span style="color:var(--success,#22c55e);font-weight:600;">on course ✓</span>'
    : '<span style="color:var(--danger,#ef4444);font-weight:600;">short by ' + gbp(Math.round(requiredPot - pot)) + '</span>';
}

// ---- The "When could I retire?" spin ----

/** "9 in 10" for 90, "3 in 4" for 75 — the counts a person reads; any other figure as a percent. */
export function confidenceWords(pctTarget) {
  const p = Math.round(+pctTarget || 0);
  if (p === ON_COURSE_PCT) return 'in 9 futures out of 10';
  if (p === 75) return 'in 3 futures out of 4';
  return 'in ' + p + '% of futures';
}
