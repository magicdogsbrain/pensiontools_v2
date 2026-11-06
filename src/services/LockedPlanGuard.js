/**
 * The lock guard (6.20.2): what may still be written into a LOCKED plan's settings.
 *
 * A locked plan's Stress tester settings and Decision tool settings are frozen (PlanLock.js: one lock for both tools).
 * Until 6.20.2 only the two settings forms' own Save buttons checked. The Budget's "Use as the start of my income
 * shape", the budget walk-through's "Set as my plan's target", the optimiser's "Apply this split", "Copy from Decision",
 * the add-a-tool wizard, the Decision tool's "Reset" and the Monthly Entry's "how often" picker could still write them.
 * The check now sits in two places, so no button, old or new, can get past it:
 *   - the save functions (ScenarioRepository, StressRepository, DecisionRepository), against the plan as this tab
 *     loaded it;
 *   - the store (FirestoreService.saveScenario), against the plan AS STORED, read just before the write. A tab or
 *     device that loaded the plan before it was locked elsewhere (the first month recorded on a phone, a desktop tab
 *     left open) still thinks it is a draft; the stored plan says otherwise (lockedPlanWriteRefusal).
 *
 * Pure: no storage, no DOM. "Locked" is the planner's own flag, decisionTool.settings.locked.
 *
 * EVERY WRITE A LOCKED PLAN STILL MAKES, by name:
 *   Into its settings (only these keys may change; everything else is refused):
 *    - Stress: the plan's start, written on load the first time it is worked out (6.13.5, the timing pin,
 *      StressRepository.loadStressDBAsync; the keys are PlanTiming.TIMING_PIN_KEYS) — and only then: a key the stored
 *      settings already hold is never written over (6.53.0; the pin itself writes only absent keys, PlanTiming.timingPinPatch).
 *      Until 6.53.0 the allowance was blind to the value, so a write could move the Stress copy of year 0 on a locked
 *      plan while the Decision copy, the one the Decision tool reads first, was refused: two tools would disagree.
 *    - Stress: "Leave it" on the out-of-date draft offer (6.15.0, staleDraftDismissedFor). A locked plan is never
 *      offered it; the key is listed so the answer is harmless if it ever is.
 *    - Stress: the month work stopped (6.53.0, stoppedWork), and "Leave it" to the question that asks it on a locked plan
 *      (stopMonthLeft). The month is the person's own fact, kept apart from the plan's year 0: with the year 0 saved it
 *      changes no figure by itself (research/plan-start.md §3), so it is always writable, lock or no lock.
 *    - Stress AND Decision, together and only together (6.53.0, `reAnchor`): "Move the plan's start" (services/PlanMove.js)
 *      — both copies of year 0 moved to the same tax year, the stop's, and each key the move rewrites at exactly the value
 *      the move works out from the plan as stored (PlanMove.reAnchorAllowance); with them, the strategy block's counts of
 *      years from year 0, moved the same way (PlanMove.strategyBlockAfterMove). Only a write that carries both copies can
 *      be one, so it passes only the check against the plan as stored (lockedPlanWriteRefusal), never a save of one kind.
 *    - Decision: the unlock itself (PlanLock.unlockPlan), and only as an unlock: the flag comes off, the unlock is dated,
 *      and the count of unlocks goes up (isUnlock). While the plan stays locked, its lock record (locked, lockedAt,
 *      lockedBy, unlockedAt, unlockCount) does not move — so a copy that merely says "not locked", from a tab that
 *      loaded the plan before it was locked, cannot lift the lock by being saved.
 *    - Stress, WITH the unlock and only then (6.38.0, the preview's one-write unlock): the defaults a plan locked before a
 *      setting existed gets on unlock — the charge (6.19.0) and how the ISA grows (6.22.0), exactly as PlanCommit.unlockPatchesOf
 *      gives them for the stored settings. The planner writes them in a second save after its unlock; the preview sends
 *      them in the same write (lockedPlanWriteRefusal). Any other Stress key, or either key at another value, is refused.
 *    - The close (6.56.0, research/plan-start.md §2 I; services/PlanClosed.js): `closedAt` and `nextPlanId` at the plan's root,
 *      outside both settings maps — written once, both together, on a plan with neither (PlanClosed.closureRefusal). Once a
 *      plan is closed it reads as locked whatever its flag says, and nothing of it changes again: its settings and strategy
 *      are refused with no unlock and no move of its start, the close itself is never written again, and its months after
 *      `closedAt`, the tax years after it, what you hold and its tick-offs, the plan document, the plan of record and their
 *      archives are refused (PlanClosed.closedPlanRefusal). Its months up to the close stay writable. The plan that carries it
 *      on takes no month before its first, on Month by month or as a saver's pot record or check-in (PlanClosed.successorRefusal).
 *    - Decision: the one-off rewrite of the old "Declining with age" spending profile (v6.2.1, made on load by
 *      DecisionRepository.loadDecisionDBAsync and saved with the next tax-year save), and only when it is exactly
 *      that rewrite (isDecliningBake).
 *   NOT the old `cadence` key inside the Decision settings (a plan saved before 6.23): it is in the settings checksum,
 *   so on a plan unlocked before, changing it relabelled every recorded month "recorded under previous settings". It
 *   is never written again; it stays as stored and is refused like any other Decision setting.
 *   Outside the settings (not checked here, because they are not settings):
 *    - how often you draw (`decisionTool.cadence`, the Monthly Entry's picker; services/DrawCadence.js, v6 usability
 *      audit decision 4): a preference, changeable on a locked plan, outside the checksum;
 *    - the plan document, its refresh and its archive (planDocument, planDocumentArchive);
 *    - the plan of record and its archive (decisionTool.planOfRecord, decisionTool.planOfRecordArchive);
 *    - Decision records and tax years (decisionTool.history, decisionTool.taxYears). A tax-year save carries the
 *      settings with it: on a locked plan they are written as stored (lockedSettingsToWrite);
 *    - what you hold, the Transition tick-offs, the journey, the Accumulation planner and its monthly pot record, the
 *      Budget, the partner link, the plan's name, description and tools, and which plan is open (isActive);
 *    - a saver's check-in (research/saving-enough-and-check-in.md 5.8, release step R3): on a locked plan exactly three
 *      keys under the Accumulation planner — the check-ins, the month's pot record and how often (CHECK_IN_KEYS.locked).
 *      A locked plan's check-in is read against its plan document's saving path and never writes a path of its own; an
 *      unlocked plan's may also write the path it is read against and the paths it replaced (CHECK_IN_KEYS.unlocked).
 *      They are outside the settings, so the rules below let them through anyway; the check-in itself is held to this
 *      narrower list (checkInWriteRefusal), so it can never carry a setting, the plan document or anything else with it;
 *    - the new app's Month by month (7.2.0): the records, the tax years and the journey (MONTH_KEYS), held to that list by
 *      monthWriteRefusal in the same way;
 *    - the saved-plan migrations (storage/migrations.js). They write through FirestoreService directly (not through
 *      saveScenario) and keep their own rules: no key of a locked plan's Decision settings, and from step 2 no key of
 *      its Stress settings.
 *   Refused: everything else, including the strategy switch (ScenarioRepository.setActiveStrategy).
 */
import { TIMING_PIN_KEYS } from './PlanTiming.js';
import { spendingSmileFactor } from './SpendingModel.js';
import { unlockPatchesOf } from './PlanCommit.js';
import { reAnchorAllowance } from './PlanMove.js';
import { isClosedPlan, closureRefusal, closedPlanRefusal, successorRefusal, writeTouchesClosure, writeTouchesClosedParts, writeTouchesMonths, writeTouchesSaverMonths } from './PlanClosed.js';

export const PLAN_LOCKED_CODE = 'plan-locked';
/** What the person is told when a write is refused. Plain, and says where the unlock is. */
export const PLAN_LOCKED_MESSAGE = 'This plan is locked: unlock it in Stress tester → Settings to change it.';
/** A closed plan (PlanClosed.js) is never unlocked: the change belongs on the plan that carries it on. */
export const PLAN_CLOSED_MESSAGE = 'This plan is closed and is kept as it was: make the change on the plan that carries it on.';

/**
 * A refused write. `keys` are the settings it would have changed (for the console and the tests, never the screen).
 * `fromStore`: refused by the plan as stored, not by this tab's copy — the plan was locked after this tab loaded it.
 */
export class PlanLockedError extends Error {
  constructor(keys = [], { fromStore = false, closed = false } = {}) {
    super(closed ? PLAN_CLOSED_MESSAGE : PLAN_LOCKED_MESSAGE);
    this.name = 'PlanLockedError';
    this.code = PLAN_LOCKED_CODE;
    this.keys = keys;
    this.fromStore = fromStore;
    this.closed = closed;
  }
}

export const isPlanLockedError = (e) => !!e && e.code === PLAN_LOCKED_CODE;

/** The keys a locked plan may still change, by kind of settings (see the header for whose they are). */
export const LOCKED_BOOKKEEPING = Object.freeze({
  stress: Object.freeze([...TIMING_PIN_KEYS, 'staleDraftDismissedFor', 'stoppedWork', 'stopMonthLeft']),
  decision: Object.freeze([])
});

/** The keys the unlock writes (PlanLock.unlockPlan) — allowed only when the write IS an unlock (isUnlock). */
export const UNLOCK_KEYS = Object.freeze(['locked', 'unlockedAt', 'unlockCount']);

/**
 * A saver's check-in, by name (the header; research/saving-enough-and-check-in.md 5.8): every key it may write, and on a
 * locked plan only the first three. The stamp every save carries (lastModified) goes with either.
 */
const CHECK_IN_LOCKED = Object.freeze(['accumulationTool.checkIns', 'accumulationTool.history', 'accumulationTool.checkInEvery']);
export const CHECK_IN_KEYS = Object.freeze({
  locked: CHECK_IN_LOCKED,
  unlocked: Object.freeze([...CHECK_IN_LOCKED, 'accumulationTool.path', 'accumulationTool.pathArchive'])
});

/**
 * May this write (dotted keys, as Firestore's updateDoc reads them) go to `plan` as a check-in? The keys beyond the
 * check-in's allowance for the plan as stored (locked or not), or null when every key is within it.
 * @returns {string[]|null}
 */
export function checkInWriteRefusal(plan, data) {
  const allowed = isLockedSettings(plan?.decisionTool?.settings) ? CHECK_IN_KEYS.locked : CHECK_IN_KEYS.unlocked;
  const bad = Object.keys(data || {}).filter((k) => k !== 'lastModified' && !allowed.includes(k)).sort();
  return bad.length ? bad : null;
}

/**
 * Month by month in the new app (research/v7/months-in-v7.md §3, 7.2.0): every key a month's record, the months filled in with
 * it, a tax year's set-up and their Undo may write — the records, the tax years and the journey (the arrival check), each a
 * whole field, as the classic repositories write them. The stamp every save carries (lastModified) goes with them. They are
 * outside the settings, so the rules below let them through on a locked plan anyway; Month by month is held to this narrower
 * list (monthWriteRefusal), so a month can never carry a setting with it.
 */
export const MONTH_KEYS = Object.freeze(['decisionTool.history', 'decisionTool.taxYears', 'journey']);

/**
 * May this write (dotted keys) go to a plan as Month by month's? The keys beyond MONTH_KEYS, or null when every key is within
 * them. The whole guard (lockedPlanWriteRefusal: a closed plan's months after its close, the plan that carries one on, its
 * months before its first) still runs on every write as well.
 * @returns {string[]|null}
 */
export function monthWriteRefusal(data) {
  const bad = Object.keys(data || {}).filter((k) => k !== 'lastModified' && !MONTH_KEYS.includes(k)).sort();
  return bad.length ? bad : null;
}

/** The keys of the Decision copy's "Declining with age" rewrite (allowed only as that exact rewrite). */
export const DECLINING_BAKE_KEYS = Object.freeze(['targetSchedule', 'spendingProfile', 'spendingMigratedFrom']);

const isObj = (v) => !!v && typeof v === 'object' && !Array.isArray(v);

/** Locked: the planner's own flag on the Decision settings. */
export function isLockedSettings(decisionSettings) {
  return !!(isObj(decisionSettings) && decisionSettings.locked);
}

function sortKeys(v) {
  if (Array.isArray(v)) return v.map(sortKeys);
  if (isObj(v)) return Object.keys(v).sort().reduce((o, k) => { if (v[k] !== undefined) o[k] = sortKeys(v[k]); return o; }, {});
  return v;
}
/** Text for a value: key order does not count (Firestore hands objects back in its own order); undefined is "absent". */
const text = (v) => (v === undefined ? '<absent>' : JSON.stringify(sortKeys(v)));

/** The top-level keys whose values differ between two settings maps (added, removed or changed). */
export function changedKeys(before, after) {
  const a = isObj(before) ? before : {}, b = isObj(after) ? after : {};
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  return [...keys].filter((k) => text(a[k]) !== text(b[k])).sort();
}

/** True when `next` is the stored Decision settings with exactly the v6.2.1 "Declining with age" rewrite made. */
export function isDecliningBake(stored, next) {
  if (!isObj(stored) || !isObj(next) || stored.spendingProfile !== 'declining') return false;
  if (next.spendingProfile !== 'flat' || next.spendingMigratedFrom !== 'declining') return false;
  const ts = stored.targetSchedule;
  const want = Array.isArray(ts) && ts.length ? ts.map((v, y) => Math.round((+v || 0) * spendingSmileFactor(y, 'declining'))) : ts;
  return text(want) === text(next.targetSchedule);
}

/**
 * True when `next` is the unlock of the locked Decision settings `stored`: the flag off, the unlock dated, and counted
 * one more than stored. A copy that simply says "not locked" (loaded before the plan was locked) is not.
 */
export function isUnlock(stored, next) {
  if (!isLockedSettings(stored) || !isObj(next) || isLockedSettings(next)) return false;
  return !!next.unlockedAt && (+next.unlockCount || 0) > (+stored.unlockCount || 0);
}

function allowedKeys(kind, stored, next, also = [], { closed = false } = {}) {
  const allowed = new Set(LOCKED_BOOKKEEPING[kind] || []);
  // The pin writes a key the stored settings do not hold yet, and nothing else (6.53.0): never one already there.
  if (kind === 'stress' && isObj(stored)) for (const k of TIMING_PIN_KEYS) if (stored[k] != null) allowed.delete(k);
  // a closed plan is never unlocked (PlanClosed.js): the change belongs on the plan that carries it on
  if (kind === 'decision' && !closed && isUnlock(stored, next)) UNLOCK_KEYS.forEach((k) => allowed.add(k));
  if (kind === 'decision' && isDecliningBake(stored, next)) DECLINING_BAKE_KEYS.forEach((k) => allowed.add(k));
  for (const k of also) allowed.add(k);
  return allowed;
}

/**
 * May `next` replace `stored` as a plan's `kind` settings ('stress' or 'decision')?
 * @param {'stress'|'decision'} kind
 * @param {{ locked: boolean, stored: object|undefined, next: object, also?: string[] }} write  `also`: keys a check that
 *   sees both copies has found a move of the plan's start may change (lockedPlanWriteRefusal, `reAnchor`)
 * @returns {string[]|null} null when it may (the plan is not locked, or only named bookkeeping changes); otherwise the
 *   keys that would change.
 */
export function lockedWriteRefusal(kind, { locked, stored, next, also = [], closed = false }) {
  if (!locked && !closed) return null;
  const allowed = allowedKeys(kind, stored, next, also, { closed });
  const bad = changedKeys(stored, next).filter((k) => !allowed.has(k));
  return bad.length ? bad : null;
}

/**
 * What a save that is not a settings save (a tax year, the ISA used so far) writes as a LOCKED plan's settings: the
 * settings as stored, with only the allowed changes taken from the copy in memory. Anything else that copy carries is
 * left out, so it can never reach the stored plan by riding along with a tax-year save.
 * @returns {{ settings: object, dropped: string[] }}
 */
export function lockedSettingsToWrite(kind, stored, next) {
  const base = isObj(stored) ? JSON.parse(JSON.stringify(stored)) : {};
  const allowed = allowedKeys(kind, stored, next);
  const dropped = [];
  for (const k of changedKeys(stored, next)) {
    if (!allowed.has(k)) { dropped.push(k); continue; }
    if (next[k] === undefined) delete base[k];
    else base[k] = JSON.parse(JSON.stringify(next[k]));
  }
  return { settings: base, dropped };
}

// ---- The same rules against the plan AS STORED (FirestoreService.saveScenario) ------------------------------------

/** The root fields a write may reach a locked plan's settings or strategy through. */
const LOCKED_ROOTS = ['stressTool', 'decisionTool', 'strategy'];
// A write touches them when it replaces a root (stressTool, decisionTool, strategy), a settings map, or a key inside one
// (a dotted path, as Firestore's updateDoc reads it). decisionTool.history / taxYears / planOfRecord do not.
const TOUCHES = /^(?:stressTool|decisionTool|strategy)$|^(?:stressTool|decisionTool)\.settings(?:\.|$)|^strategy\./;

/** Does this write (a saveScenario `data` map) reach a plan's Stress or Decision settings, or its strategy? */
export function writeTouchesLockedParts(data) {
  return !!data && typeof data === 'object' && Object.keys(data).some((k) => TOUCHES.test(k));
}

/**
 * Must the store check this write against the plan as stored (FirestoreService.saveScenario)? When it reaches a plan's
 * settings or strategy, the close's keys, on a plan the store holds as closed anything the close froze, or on the plan that
 * carries one on its Month by month or a saver's pot records and check-ins (no month before its first). Every other write (the journey, the budget, the name, which
 * plan is open) goes as it always did, with no read of the stored plan's rules.
 */
export function writeNeedsGuard(storedPlan, data) {
  return writeTouchesLockedParts(data) || writeTouchesClosure(data) || (!!storedPlan && storedPlan.closedAt != null && writeTouchesClosedParts(data))
    || (!!storedPlan && storedPlan.before != null && (writeTouchesMonths(data) || writeTouchesSaverMonths(data)));
}

/**
 * The plan's Stress settings, Decision settings and strategy as they would stand after `data` is written, read the way
 * Firestore's updateDoc reads it: a dotted key is a path into nested maps, and a value replaces what is at its path.
 * (A guest's save folds dotted keys the same way, scenarioMigration.normalizeScenario.) `plan` is not changed.
 */
export function lockedPartsAfter(plan, data) {
  const out = JSON.parse(JSON.stringify({ stressTool: plan?.stressTool, decisionTool: plan?.decisionTool, strategy: plan?.strategy }));
  for (const [k, v] of Object.entries(data || {})) {
    const path = k.split('.');
    if (!LOCKED_ROOTS.includes(path[0])) continue;
    let o = out;
    for (let i = 0; i < path.length - 1; i++) { if (!isObj(o[path[i]])) o[path[i]] = {}; o = o[path[i]]; }
    o[path[path.length - 1]] = v;
  }
  return { stress: out.stressTool?.settings, decision: out.decisionTool?.settings, strategy: out.strategy };
}

/**
 * May `data` be written to the stored `plan`? The repositories' rules, applied to the plan as stored: on a locked plan,
 * only the named bookkeeping changes in either settings map, and no change of strategy.
 * @param {object} plan  the stored plan, read as a load reads it (normalised and upgraded)
 * @param {object} data  the write (saveScenario's map; dotted keys allowed)
 * @param {object} [stressDefaults]  what a plan with no Stress settings saved reads (ScenarioRepository.getActiveStressSettings
 *   on a locked plan: the defaults). Without them such a write is refused unless nothing changes — the safe way round.
 * @param {{ now?: Date }} [o]  the day the write is made, where the caller has it: the move of a plan's start to this tax
 *   year, with no month said, must then be to exactly this tax year (PlanMove.reAnchorAllowance).
 * @returns {string[]|null} null when it may; otherwise the keys it would change, named by part ('stress.baseSalary',
 *   'decision.locked', 'strategy').
 */
export function lockedPlanWriteRefusal(plan, data, stressDefaults, { now = null } = {}) {
  const before = { stress: plan?.stressTool?.settings, decision: plan?.decisionTool?.settings, strategy: plan?.strategy };
  // The close (PlanClosed.js): its two keys once, on any plan; on a closed plan, nothing it froze.
  const closed = isClosedPlan(plan) || (!!plan && plan.closedAt != null);
  const closure = [...(closureRefusal(plan, data) || []), ...(closed ? closedPlanRefusal(plan, data) || [] : []), ...(successorRefusal(plan, data) || [])];
  if (!(isLockedSettings(before.decision) || closed) || !writeTouchesLockedParts(data)) return closure.length ? closure : null;
  const after = lockedPartsAfter(plan, data);
  const orDefaults = (s) => (s === undefined ? stressDefaults : s);
  // With the unlock, and only then: the Stress defaults an unlock gives the plan (unlockPatchesOf), at exactly those values.
  // A closed plan is never unlocked, nor its start moved.
  const onUnlock = !closed && isUnlock(before.decision, after.decision) ? (unlockPatchesOf(orDefaults(before.stress)) || {}) : {};
  const stressNext = orDefaults(after.stress);
  // A move of the plan's start (`reAnchor`, 6.53.0): both copies at once, exactly as the move works them out.
  const none = { stress: [], decision: [], strategy: false };
  const reAnchor = closed ? none : (reAnchorAllowance({ stress: orDefaults(before.stress), decision: before.decision, strategy: before.strategy }, { stress: stressNext, decision: after.decision, strategy: after.strategy }, { now }) || none);
  const stressBad = (lockedWriteRefusal('stress', { locked: true, closed, stored: orDefaults(before.stress), next: stressNext, also: reAnchor.stress }) || [])
    .filter((k) => !(k in onUnlock && isObj(stressNext) && text(stressNext[k]) === text(onUnlock[k])));
  const bad = [
    ...closure,
    ...stressBad.map((k) => 'stress.' + k),
    ...(lockedWriteRefusal('decision', { locked: true, closed, stored: before.decision, next: after.decision, also: reAnchor.decision }) || []).map((k) => 'decision.' + k),
    ...(text(before.strategy) !== text(after.strategy) && !reAnchor.strategy ? ['strategy'] : [])
  ];
  return bad.length ? bad : null;
}
