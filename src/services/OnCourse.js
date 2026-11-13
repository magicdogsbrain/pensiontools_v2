/**
 * One bar for "on course" (6.22.0; research/saver-lock-and-savings-growth.md §6; our decision of 2 Oct 2026).
 *
 * "On course" means the money lasts in 9 futures out of 10, everywhere. Until 6.22.0 today's planner had three bars:
 * "Am I on track?" searched for the pot that lasted in 85% of futures, the "When could I retire?" spin cleared 90%, and
 * the couples, survivor and care checks called a plan solid from 85%. V7 has always used 9 in 10 (BAND.careful = 0.9,
 * LEGACY_VERDICT.yes = 0.10 in src/answers/shared/rules.js); tests/onCourse.test.js holds the two apps to this one number.
 *
 * Pure: no DOM, no storage. index.html imports the words and thresholds from here (its script may only shrink).
 */

import { pctText } from './OneAnswer.js';
import { chanceWords, fixedAgeWords } from '../answers/shared/format.js';

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

const pct = (x) => pctText((+x || 0) * 100, 0, [ON_COURSE_PCT, BORDERLINE_SHARE * 100]);   // 89.6% never reads "90%" beside "not on course" (6.33.0)

/** The couples check's headline: on course at 9 in 10 or more for both of them (it was "Looking solid" from 85%). */
export function jointVerdictHtml(share) {
  if (isOnCourse(share)) return 'On course: in ' + pct(share) + ' of 1,000 possible market futures the money lasted the whole way for <strong>both</strong> of you (9 in 10 or more).';
  if (share >= BORDERLINE_SHARE) return 'Not on course yet: the money lasted for both of you in only ' + pct(share) + ' of 1,000 possible market futures (on course is 9 in 10).';
  return 'At risk: the money lasted for both of you in just ' + pct(share) + ' of 1,000 possible market futures (on course is 9 in 10).';
}

// ---- "Am I on course?" (the Accumulation planner) ----

/**
 * While "Am I on course?" works: what it looks for, in words that hold whichever test it runs (7.8.0: at the level chosen,
 * counting how long people live; in the rollback, 9 futures out of 10). The result says which.
 */
export const ON_COURSE_SEARCHING = 'Searching for the pot your plan needs to be on course… (a few seconds)';

const LEVEL_NAMES = { careful: 'Careful', balanced: 'Balanced', bold: 'Bold' };
const gbpOf = (v) => '£' + Math.round(+v || 0).toLocaleString('en-GB');
/** Why a plan has no figure counted by how long people live (7.8.0; life.weightedReasonOf's reasons). */
const NO_WEIGHTED = {
  couple: 'a plan made from a couple\'s answer',
  linked: 'two plans linked as a household',
  durationShaped: 'its way of drawing buys what the plan\'s own years need'
};

/**
 * What the pot "Am I on course?" found is for, in words (moved out of index.html's runOnTrackCheck in 6.22.0).
 * @param {{ strategyId: string, name: string, found?: object }} s   this plan's strategy, and its name (already safe for
 *   HTML); `found` (7.8.0): stressTest.requiredPotForStrategy's result at a level — the words then name the level and the
 *   other two levels' pots; without it (the rollback), "9 futures out of 10" as before
 */
export function onCourseBasisHtml({ strategyId, name, found = null }) {
  const contract = strategyId === 'full-il-gilt' || strategyId === 'floor-the-schedule';
  if (found && found.level && !contract) {
    const lv = found.levels || null;
    const others = lv ? Object.keys(LEVEL_NAMES).filter((k) => k !== found.level && Number.isFinite(lv[k])) : [];
    const range = others.length === 2 && others.some((k) => lv[k] !== lv[found.level]) ? ' (' + others.map((k) => LEVEL_NAMES[k] + ' ' + gbpOf(lv[k])).join(', ') + ')' : '';
    return 'to be on course at <strong>' + LEVEL_NAMES[found.level] + '</strong>' + range + ' with <strong>' + (strategyId === 'pots-and-valves' ? 'Pots &amp; Valves' : name) + '</strong> (this plan\'s strategy) against your ' + (strategyId === 'pots-and-valves' ? 'budget-derived target' : 'income shape');
  }
  if (strategyId === 'pots-and-valves') return 'to last in 9 futures out of 10 with <strong>Pots &amp; Valves</strong> (this plan\'s strategy) against your budget-derived target';
  if (contract) return 'to buy every year of your income shape by contract with <strong>' + name + '</strong> (this plan\'s strategy) — no growth assumed after retirement, today\'s prices';
  return 'to last in 9 futures out of 10 with <strong>' + name + '</strong> (this plan\'s strategy) against your income shape';
}

/**
 * Under the pot (7.8.0): the chance it stands behind, said as a chance, with the count to the plan's own age beside it
 * (the render rule: a weighted figure never stands without its fixed-age line); with no weighted figure, the count to the
 * plan's age at the level and why. '' in the rollback (no level) and for a strategy bought by contract.
 * @param {object|null} found   stressTest.requiredPotForStrategy's result at a level
 * @param {{ strategyId?: string, reason?: string|null }} o
 */
export function onCourseChanceHtml(found, { strategyId = null, reason = null } = {}) {
  if (!found || !found.level || !found.chance || strategyId === 'full-il-gilt' || strategyId === 'floor-the-schedule') return '';
  const c = found.chance;
  const fixed = '<p class="hint" data-fixed="1" style="margin:6px 0 0;">With exactly that: ' + fixedAgeWords(c.fixedAge, found.planToAge).replace(/^If/, 'if') + '</p>';
  if (found.weighted && typeof c.weighted === 'number') {
    return '<div class="chance-block"><p class="hint" data-weighted="1" style="margin:6px 0 0;">Counting how long people your age live, with exactly that the money lasts as long as you do '
      + chanceWords(c.weighted, { sumW: c.sumW, n: c.n }) + ': on course at ' + LEVEL_NAMES[found.level] + '.</p>' + fixed + '</div>';
  }
  const why = NO_WEIGHTED[reason] ? ' This is ' + NO_WEIGHTED[reason] + ', so it has no figure counted by how long people live yet: at ' + LEVEL_NAMES[found.level] + ' it is judged on how many futures last to the age it runs to.' : '';
  return '<div class="chance-block">' + fixed + (why ? '<p class="hint" style="margin:4px 0 0;">' + why.trim() + '</p>' : '') + '</div>';
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
