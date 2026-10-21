/**
 * Choosing the split (research/household-draw-split.md §5): "Use this split" writes the split's income steps into both
 * plans; a LOCKED plan is never written — the offer is then "Make copies of both plans with this split" (unlocked drafts,
 * named by the person, linked to each other); "Keep things as they are" dismisses it for that pair of plans until either
 * plan changes (the fingerprint of both plans' settings, HouseholdDraw.splitFingerprint).
 *
 * The store itself refuses a write to a locked plan (FirestoreService.saveScenario, services/LockedPlanGuard.js); this
 * module decides before asking, so a locked plan is never even sent a write. Pure but for the store it is handed
 * (`repo`), so it is tested against fakes and against the guest store.
 */

import { amountAtAge, cleanSteps } from './IncomeSchedule.js';

/** The planner's own lock flag: decisionTool.settings.locked. */
export const isLockedPlan = (scenario) => !!(scenario && scenario.decisionTool && scenario.decisionTool.settings && scenario.decisionTool.settings.locked);

/**
 * Which way the choice can go: write both plans, or make copies because one (or both) is locked.
 * @returns {{ mode: 'write'|'copies', locked: string[] }}  the names of the locked plans
 */
export function splitWriteMode(own, partner, names = { a: 'You', b: 'Partner' }) {
  const locked = [];
  if (isLockedPlan(own)) locked.push(names.a);
  if (isLockedPlan(partner)) locked.push(names.b);
  return { mode: locked.length ? 'copies' : 'write', locked };
}

const gbp = (v) => '£' + Math.round(+v || 0).toLocaleString('en-GB');
/** "£83,650 a year from 62" / "£50,270 a year from 62, £40,000 from 67" — a plan's income shape in a few words. */
export function shapeWords(settings) {
  const s = settings || {};
  const steps = cleanSteps(s.incomeSteps);
  if (s.incomeShape === 'phases' && steps.length) {
    return steps.slice(0, 4).map((st, i) => gbp(st.amount) + (i === 0 ? ' a year' : '') + ' from ' + st.fromAge).join(', ') + (steps.length > 4 ? ', …' : '');
  }
  return gbp(s.baseSalary || 0) + ' a year';
}

/**
 * What "Use this split" changes, plan by plan, for the confirm: each plan's income shape before and after. A plan whose
 * shape is the same is listed as unchanged.
 * @returns {Array<{ name: string, from: string, to: string, changed: boolean }>}
 */
export function splitChanges(split, own, partner) {
  const before = { a: own?.stressTool?.settings || {}, b: partner?.stressTool?.settings || {} };
  return ['a', 'b'].map((k) => {
    const from = shapeWords(before[k]), to = shapeWords(split.settings[k]);
    const sameSchedule = (split.schedules.own[k] || []).every((v, y) => Math.abs(v - (split.schedules.together[k][y] || 0)) < 1);
    return { name: split.names[k], from, to, changed: !sameSchedule };
  });
}

/**
 * Apply the split. `repo` is the store: { saveScenario(id, data), duplicateScenario(id, name, opts), loadScenario(id) }.
 * - write: both plans' Stress settings become the split's (the planner's own settings object, with the new income
 *   shape); returns `undo` which puts both back as they were.
 * - copies: each plan is copied (settings only, no recorded months), the copy unlocked if the copy came back locked
 *   (the planner's own unlock bookkeeping), given the split's settings, and the two copies linked to each other.
 * Never writes a locked plan: with mode 'copies' the originals are not touched.
 * @returns {Promise<{ mode: 'write', undo: () => Promise<void> } | { mode: 'copies', ids: { a: string, b: string } }>}
 */
export async function applySplit({ own, partner, split, names, copyNames, repo, now = new Date() }) {
  const { mode } = splitWriteMode(own, partner, names);
  if (mode === 'write') {
    const w = splitWrites(own, partner, split);
    await repo.saveScenario(w.a.id, w.a.write);
    await repo.saveScenario(w.b.id, w.b.write);
    return {
      mode,
      undo: async () => {
        await repo.saveScenario(w.a.id, w.a.undo);
        await repo.saveScenario(w.b.id, w.b.undo);
      }
    };
  }
  const copyNamesOf = splitCopyNames(split, copyNames);
  const makeCopy = async (source, name, settings) => {
    const made = await repo.duplicateScenario(source.id, name, { carryHistory: false });
    const id = (made && made.id) || made;
    const copy = (await repo.loadScenario(id)) || {};
    const unlock = copyUnlockWrite(copy, now);
    if (unlock) await repo.saveScenario(id, unlock);
    await repo.saveScenario(id, { 'stressTool.settings': settings });
    return id;
  };
  const idA = await makeCopy(own, copyNamesOf.a, split.settings.a);
  const idB = await makeCopy(partner, copyNamesOf.b, split.settings.b);
  await repo.saveScenario(idA, { 'household.partnerScenarioId': idB });
  await repo.saveScenario(idB, { 'household.partnerScenarioId': idA });
  return { mode, ids: { a: idA, b: idB }, names: copyNamesOf };
}

// ---- The pure parts of applySplit (6.42.0, "Your household" in the preview: research/v7/road-to-7.md step 9) --------------
// Lifted out of applySplit above so the preview's one write file writes exactly what the planner writes; applySplit calls them.

/**
 * Mode 'write': what each plan's write is, and the write that puts it back — the planner's own settings object with the
 * split's income shape (the whole map, as applySplit has always written it). Pure.
 * @returns {{ a: { id, write, undo }, b: { id, write, undo } }}
 */
export function splitWrites(own, partner, split) {
  return {
    a: { id: own.id, write: { 'stressTool.settings': split.settings.a }, undo: { 'stressTool.settings': own.stressTool?.settings } },
    b: { id: partner.id, write: { 'stressTool.settings': split.settings.b }, undo: { 'stressTool.settings': partner.stressTool?.settings } }
  };
}

/** Mode 'copies': the two copies' names — the person's, else "{name} — drawing together". Pure. */
export function splitCopyNames(split, copyNames) {
  return {
    a: (copyNames && copyNames.a) || (split.names.a + ' — drawing together'),
    b: (copyNames && copyNames.b) || (split.names.b + ' — drawing together')
  };
}

/** A copy that came back locked (it carried records): the planner's own unlock bookkeeping as one write, else null. Pure. */
export function copyUnlockWrite(copy, now) {
  if (!isLockedPlan(copy)) return null;
  const d = copy.decisionTool.settings;
  return { 'decisionTool.settings': { ...d, locked: false, unlockedAt: now.toISOString(), unlockCount: (+d.unlockCount || 0) + 1 } };
}

/** The five keys settingsWithSchedule changes (HouseholdDraw.js): what a split write amounts to, key by key. */
export const SPLIT_KEYS = Object.freeze(['incomeShape', 'incomeSteps', 'targetSchedule', 'baseSalary', 'spendingProfile']);

/** "Keep things as they are": what is remembered on this plan, and whether it still holds for this pair as they stand now. */
export function dismissalFor(partnerId, fingerprint, now = new Date()) {
  return { partnerScenarioId: partnerId, fingerprint: String(fingerprint), at: now.toISOString() };
}
export function isSplitDismissed(dismissed, partnerId, fingerprint) {
  return !!dismissed && dismissed.partnerScenarioId === partnerId && String(dismissed.fingerprint) === String(fingerprint);
}

/** For the tests and the confirm: an income step's amount at an age, from the steps a plan holds. */
export const stepAmountAt = (settings, age) => amountAtAge((settings || {}).incomeSteps, age, (settings || {}).baseSalary || 0);
