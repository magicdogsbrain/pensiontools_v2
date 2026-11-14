/**
 * "Your plan": the steps for each life stage, as data (research/v7/your-plan.md 2.2, 2.4). The reading that fills them
 * is read.js; the words are src/v7/copy/plan.js under the same ids.
 *
 *   STEPS[stage]   the step ids for a stage, in order; the first is the one the plan opens on
 *   OPTIONAL       the steps that say "optional" on the rail (R4)
 *   laterFor       the steps a saver keeps "For later" (research/saving-enough-and-check-in.md 4.1)
 *   ALL_STEPS      every step id (an address may open any; one not on the stage's list says why — R7)
 *   NEXT_ORDER     the next sentences, in the order they are tried (first match wins)
 *
 * A saver's rail (research/saving-enough-and-check-in.md 4.1, release step R2): someone still saving was pushed towards
 * recording what they hold, moving it to the plan's mix and locking, none of which their saving needs yet. So a saver's
 * rail opens on "What you pay in" (where the plan now says whether they are on course), and what you hold, the move and
 * the lock sit under "For later" while they are far from stopping: still there and still addressable, never marked
 * "Not done yet", never named by the next sentence. The retired stages are as they were.
 *
 * The check-in (release step R3, 4.1 and 5): a saver's own step, `checkin`, takes the pot step's place on every saver's
 * rail. `pot` stays in ALL_STEPS and its address opens the check-in, so no address breaks. A plan locked while saving that
 * never chose how often is checked in on once a year (7.10.0: the review is yearly; its monthly pot step is gone).
 */
import { WINDOW } from '../../services/Phases.js';

export const STEPS = Object.freeze({
  unknown:            ['plan', 'budget', 'hold', 'household'],
  saving:             ['saving', 'checkin', 'plan', 'budget', 'lock', 'hold', 'household'],
  approaching:        ['saving', 'checkin', 'plan', 'budget', 'lock', 'hold', 'move', 'household'],
  'committed-saving': ['checkin', 'where', 'saving', 'plan', 'budget', 'hold', 'move', 'household'],
  // Month by month on a retired plan not locked yet (7.2.0): there, optional, saying to lock first (research/v7/months-in-v7.md §1.2)
  'draft-retired':    ['plan', 'budget', 'lock', 'month', 'hold', 'move', 'household'],
  running:            ['month', 'where', 'plan', 'hold', 'move', 'budget', 'household'],
  // a closed plan (6.56.0, research/plan-start.md §2 I): kept to read — where it stood when it closed, and the plan as locked;
  // what you hold, the move, the budget and the household are the plan's that carries it on
  closed:             ['where', 'plan']
});

/**
 * Optional on every rail but one: the pot record is the first thing a plan locked while saving asks for. The check-in is
 * never optional: it is a saver's own moment, where the plan is read against what is true today.
 */
export const OPTIONAL = Object.freeze(['pot', 'budget', 'lock', 'hold', 'move', 'household']);
export const ALL_STEPS = Object.freeze(['month', 'where', 'plan', 'pot', 'checkin', 'saving', 'budget', 'lock', 'hold', 'move', 'household']);

/** The stages in which a retired person is shown (the retired wording rules apply; never a countdown). */
export const RETIRED_STAGES = Object.freeze(['draft-retired', 'running', 'closed']);
/** The stages in which someone still working is shown (the saver wording rules apply). */
export const SAVER_STAGES = Object.freeze(['saving', 'approaching', 'committed-saving']);

/**
 * The next sentences, tried in this order (7.10.0; research/v7/replan-nov-2026.md §6.4, spec-7100 §5): the home shows the
 * phase, the next review and at most one thing due, and these are the only things that can be due — closed; no age; the
 * ages taken from the saving figures; "did you stop work?" on an unlocked plan past its stop; the tax year's set-up before
 * its first month (a month cannot be recorded before its year is set up); the month to record, on a plan living on its
 * money that wants months asked for; the review due; off course by the person's own rule; a partner's plan missing. Then
 * the sentences that are not things to do (NEXT_INFO), said only when nothing is due; the last says something always.
 * The rail's "Next" is the first thing to do (read.js dueFor), so it is always the home's first to-do. The rail reads no
 * runs: only the stored readings.
 */
export const NEXT_ORDER = Object.freeze(['P.readonly', 'P.closed', 'P.closedAlone', 'P.noAge', 'P.agesFromSaving', 'P.confirmStop', 'P.taxyear', 'P.arrive', 'P.month', 'P.review', 'P.offCourse', 'P.householdPending',
  'P.idle', 'P.window', 'P.onCourse', 'P.nextReview', 'P.reviewAny']);
/** The next sentences that say where things stand rather than something to do: never a to-do on the home. */
export const NEXT_INFO = Object.freeze(['P.readonly', 'P.closedAlone', 'P.idle', 'P.window', 'P.onCourse', 'P.nextReview', 'P.reviewAny']);
/** Each thing to do by the design's own id (the home and its tests name them so; the rail's words are the P.* ones). */
export const DUE_IDS = Object.freeze({
  'P.closed': 'closed.next', 'P.noAge': 'plan.noAge', 'P.agesFromSaving': 'plan.agesFromSaving', 'P.confirmStop': 'plan.confirmStop',
  'P.taxyear': 'month.taxYear', 'P.arrive': 'month.arrive', 'P.month': 'month.record',
  'P.review': 'review.due', 'P.offCourse': 'review.offCourse', 'P.householdPending': 'household.pending'
});

/**
 * What a saver keeps "For later" (4.1): on `saving`, the lock and what you hold; on `committed-saving`, what you hold
 * and the move while the stop is further away than the plan's move window (`windowYears`, Phases.windowYearsOf: the one
 * clock for when what you hold starts to matter, 7.10.0) — inside it they are back on the rail, optional. Every other
 * stage keeps nothing for later.
 */
export function laterFor(stageKey, { yearsToStop = null, windowYears = WINDOW.def } = {}) {
  if (stageKey === 'saving') return ['lock', 'hold'];
  if (stageKey === 'committed-saving' && !(Number.isFinite(yearsToStop) && yearsToStop <= windowYears)) return ['hold', 'move'];
  return [];
}

/**
 * The editing sub-steps of a step (research/v7/editing-in-v7.md 2, 7, 8, 9, 10): "About you and when", "Money that comes in
 * anyway", "What you spend", "Your pots and tax", "Does it last?", "How the money is taken" (way-and-mix.md 2) and "The mix"
 * (way-and-mix.md 3) sit under "Your plan" / "Your plan as locked" (read-only there, but for the ways and mixes tried). A
 * sub-step is an address under the plan (#/plan/<id>/about, …/income, …/spend, …/pots, …/lasts, …/way, …/mix), not a rail step.
 */
export const SUB_STEPS = Object.freeze({ plan: Object.freeze(['about', 'income', 'spend', 'pots', 'lasts', 'way', 'mix']) });
export const ALL_SUB_STEPS = Object.freeze(['about', 'income', 'spend', 'pots', 'lasts', 'way', 'mix']);

/** The sub-steps a plan's page links to: those of every step the stage lists. */
export function subStepsFor(stageKey, o) {
  return stepsFor(stageKey, o).flatMap((s) => (SUB_STEPS[s.id] || []).map((id) => ({ id, under: s.id })));
}

/**
 * The steps a plan shows: the stage's list, less "lock" on a locked plan, less "household" without a link when the
 * account holds one plan. `pot` is optional except in committed-saving. A saver's steps kept for later (laterFor) come
 * last, marked `later` (and optional).
 */
export function stepsFor(stageKey, { locked, linked, manyPlans, yearsToStop = null, windowYears = WINDOW.def }) {
  const base = STEPS[stageKey] || STEPS.unknown;
  const later = laterFor(stageKey, { yearsToStop, windowYears });
  const shown = base.filter((id) => !(id === 'lock' && locked) && !(id === 'household' && !linked && !manyPlans));
  const step = (id) => ({ id, optional: (OPTIONAL.includes(id) && !(id === 'pot' && stageKey === 'committed-saving')) || (id === 'month' && stageKey === 'draft-retired') });
  return [...shown.filter((id) => !later.includes(id)).map(step), ...shown.filter((id) => later.includes(id)).map((id) => ({ ...step(id), optional: true, later: true }))];
}
