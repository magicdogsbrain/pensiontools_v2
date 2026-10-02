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
 *      StressRepository.loadStressDBAsync; the keys are PlanTiming.TIMING_PIN_KEYS).
 *    - Stress: "Leave it" on the out-of-date draft offer (6.15.0, staleDraftDismissedFor). A locked plan is never
 *      offered it; the key is listed so the answer is harmless if it ever is.
 *    - Decision: the unlock itself (PlanLock.unlockPlan), and only as an unlock: the flag comes off, the unlock is dated,
 *      and the count of unlocks goes up (isUnlock). While the plan stays locked, its lock record (locked, lockedAt,
 *      lockedBy, unlockedAt, unlockCount) does not move — so a copy that merely says "not locked", from a tab that
 *      loaded the plan before it was locked, cannot lift the lock by being saved.
 *    - Decision: the one-off rewrite of the old "Declining with age" spending profile (v6.2.1, made on load by
 *      DecisionRepository.loadDecisionDBAsync and saved with the next tax-year save), and only when it is exactly
 *      that rewrite (isDecliningBake).
 *   NOT how often months are recorded (`cadence`, the Monthly Entry's picker). It sits in the Decision settings and so in
 *   the settings checksum: on a plan unlocked before, changing it relabelled every recorded month "recorded under
 *   previous settings". On a locked plan it is refused like any other Decision setting.
 *   Outside the settings (not checked here, because they are not settings):
 *    - the plan document, its refresh and its archive (planDocument, planDocumentArchive);
 *    - the plan of record and its archive (decisionTool.planOfRecord, decisionTool.planOfRecordArchive);
 *    - Decision records and tax years (decisionTool.history, decisionTool.taxYears). A tax-year save carries the
 *      settings with it: on a locked plan they are written as stored (lockedSettingsToWrite);
 *    - what you hold, the Transition tick-offs, the journey, the Accumulation planner and its monthly pot record, the
 *      Budget, the partner link, the plan's name, description and tools, and which plan is open (isActive);
 *    - the saved-plan migrations (storage/migrations.js). They write through FirestoreService directly (not through
 *      saveScenario) and keep their own rules: no key of a locked plan's Decision settings, and from step 2 no key of
 *      its Stress settings.
 *   Refused: everything else, including the strategy switch (ScenarioRepository.setActiveStrategy).
 */
import { TIMING_PIN_KEYS } from './PlanTiming.js';
import { spendingSmileFactor } from './SpendingModel.js';

export const PLAN_LOCKED_CODE = 'plan-locked';
/** What the person is told when a write is refused. Plain, and says where the unlock is. */
export const PLAN_LOCKED_MESSAGE = 'This plan is locked: unlock it in Stress tester → Settings to change it.';

/**
 * A refused write. `keys` are the settings it would have changed (for the console and the tests, never the screen).
 * `fromStore`: refused by the plan as stored, not by this tab's copy — the plan was locked after this tab loaded it.
 */
export class PlanLockedError extends Error {
  constructor(keys = [], { fromStore = false } = {}) {
    super(PLAN_LOCKED_MESSAGE);
    this.name = 'PlanLockedError';
    this.code = PLAN_LOCKED_CODE;
    this.keys = keys;
    this.fromStore = fromStore;
  }
}

export const isPlanLockedError = (e) => !!e && e.code === PLAN_LOCKED_CODE;

/** The keys a locked plan may still change, by kind of settings (see the header for whose they are). */
export const LOCKED_BOOKKEEPING = Object.freeze({
  stress: Object.freeze([...TIMING_PIN_KEYS, 'staleDraftDismissedFor']),
  decision: Object.freeze([])
});

/** The keys the unlock writes (PlanLock.unlockPlan) — allowed only when the write IS an unlock (isUnlock). */
export const UNLOCK_KEYS = Object.freeze(['locked', 'unlockedAt', 'unlockCount']);

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

function allowedKeys(kind, stored, next) {
  const allowed = new Set(LOCKED_BOOKKEEPING[kind] || []);
  if (kind === 'decision' && isUnlock(stored, next)) UNLOCK_KEYS.forEach((k) => allowed.add(k));
  if (kind === 'decision' && isDecliningBake(stored, next)) DECLINING_BAKE_KEYS.forEach((k) => allowed.add(k));
  return allowed;
}

/**
 * May `next` replace `stored` as a plan's `kind` settings ('stress' or 'decision')?
 * @param {'stress'|'decision'} kind
 * @param {{ locked: boolean, stored: object|undefined, next: object }} write
 * @returns {string[]|null} null when it may (the plan is not locked, or only named bookkeeping changes); otherwise the
 *   keys that would change.
 */
export function lockedWriteRefusal(kind, { locked, stored, next }) {
  if (!locked) return null;
  const allowed = allowedKeys(kind, stored, next);
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
 * @returns {string[]|null} null when it may; otherwise the keys it would change, named by part ('stress.baseSalary',
 *   'decision.locked', 'strategy').
 */
export function lockedPlanWriteRefusal(plan, data, stressDefaults) {
  const before = { stress: plan?.stressTool?.settings, decision: plan?.decisionTool?.settings, strategy: plan?.strategy };
  if (!isLockedSettings(before.decision) || !writeTouchesLockedParts(data)) return null;
  const after = lockedPartsAfter(plan, data);
  const orDefaults = (s) => (s === undefined ? stressDefaults : s);
  const bad = [
    ...(lockedWriteRefusal('stress', { locked: true, stored: orDefaults(before.stress), next: orDefaults(after.stress) }) || []).map((k) => 'stress.' + k),
    ...(lockedWriteRefusal('decision', { locked: true, stored: before.decision, next: after.decision }) || []).map((k) => 'decision.' + k),
    ...(text(before.strategy) !== text(after.strategy) ? ['strategy'] : [])
  ];
  return bad.length ? bad : null;
}
