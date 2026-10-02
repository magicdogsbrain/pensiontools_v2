/**
 * 6.20.2 — the lock guard's rules (src/services/LockedPlanGuard.js): which keys a locked plan may still change, the
 * one-off "Declining with age" rewrite, the unlock, what a tax-year save writes as a locked plan's settings, and the
 * same rules read against the plan as stored (a write from a tab that loaded the plan before it was locked elsewhere).
 */
import { describe, it, expect } from 'vitest';
import {
  PLAN_LOCKED_CODE, PLAN_LOCKED_MESSAGE, PlanLockedError, isPlanLockedError, LOCKED_BOOKKEEPING, UNLOCK_KEYS, DECLINING_BAKE_KEYS,
  isLockedSettings, changedKeys, isDecliningBake, isUnlock, lockedWriteRefusal, lockedSettingsToWrite,
  writeTouchesLockedParts, lockedPartsAfter, lockedPlanWriteRefusal
} from '../src/services/LockedPlanGuard.js';
import { TIMING_PIN_KEYS } from '../src/services/PlanTiming.js';
import { spendingSmileFactor } from '../src/services/SpendingModel.js';
import { decisionSettingsChecksum } from '../src/storage/DecisionRepository.js';

describe('the refusal', () => {
  it('says it plainly, and where the unlock is', () => {
    expect(PLAN_LOCKED_MESSAGE).toBe('This plan is locked: unlock it in Stress tester → Settings to change it.');
    const e = new PlanLockedError(['baseSalary']);
    expect(e).toBeInstanceOf(Error);
    expect(e.message).toBe(PLAN_LOCKED_MESSAGE);
    expect(e.code).toBe(PLAN_LOCKED_CODE);
    expect(e.keys).toEqual(['baseSalary']);
    expect(isPlanLockedError(e)).toBe(true);
    expect(isPlanLockedError(new Error('x'))).toBe(false);
    expect(isPlanLockedError(null)).toBe(false);
    expect(e.fromStore).toBe(false);
    const s = new PlanLockedError(['decision.baseSalary'], { fromStore: true });
    expect(s.fromStore).toBe(true);
    expect(s.message).toBe(PLAN_LOCKED_MESSAGE);   // the same plain words, whoever refused it
  });
});

describe('the named bookkeeping keys', () => {
  it('Stress: the timing pin and the out-of-date-draft answer — nothing that sets a figure', () => {
    expect(LOCKED_BOOKKEEPING.stress).toEqual([...TIMING_PIN_KEYS, 'staleDraftDismissedFor']);
  });
  it('Decision: nothing but the unlock itself — not even how often months are recorded (it is in the checksum)', () => {
    expect(LOCKED_BOOKKEEPING.decision).toEqual([]);
    expect(UNLOCK_KEYS).toEqual(['locked', 'unlockedAt', 'unlockCount']);
    const s = { baseSalary: 40000, equityMin: 1 };
    expect(decisionSettingsChecksum({ ...s, cadence: 'quarterly' })).not.toBe(decisionSettingsChecksum(s));   // why cadence is refused
  });
  it('lock and unlock never move the settings checksum (the reason the unlock may be written)', () => {
    const s = { baseSalary: 40000, equityMin: 1 };
    const sum = decisionSettingsChecksum(s);
    expect(decisionSettingsChecksum({ ...s, locked: true, lockedAt: 'a', lockedBy: 'b', unlockedAt: 'c', unlockCount: 2 })).toBe(sum);
  });
  it('isLockedSettings reads the planner\'s own flag', () => {
    expect(isLockedSettings({ locked: true })).toBe(true);
    expect(isLockedSettings({ locked: false })).toBe(false);
    expect(isLockedSettings({})).toBe(false);
    expect(isLockedSettings(undefined)).toBe(false);
  });
});

describe('changedKeys', () => {
  it('finds added, removed and changed keys; key order inside a value does not count', () => {
    expect(changedKeys({ a: 1, b: { x: 1, y: 2 } }, { a: 1, b: { y: 2, x: 1 } })).toEqual([]);
    expect(changedKeys({ a: 1, b: 2 }, { a: 1, c: 3 })).toEqual(['b', 'c']);
    expect(changedKeys({ a: [1, 2] }, { a: [2, 1] })).toEqual(['a']);
    expect(changedKeys({ a: null }, {})).toEqual(['a']);       // null is a value; absent is not
    expect(changedKeys({ a: undefined }, {})).toEqual([]);     // undefined is absent
    expect(changedKeys(undefined, { a: 1 })).toEqual(['a']);
  });
});

describe('lockedWriteRefusal', () => {
  const stored = { baseSalary: 40000, equityMin: 300000, locked: true };
  it('an unlocked plan: everything goes', () => {
    expect(lockedWriteRefusal('stress', { locked: false, stored, next: { baseSalary: 1 } })).toBeNull();
    expect(lockedWriteRefusal('decision', { locked: false, stored, next: {} })).toBeNull();
  });
  it('a locked plan: the same settings again go (a tax-year save re-writes them)', () => {
    expect(lockedWriteRefusal('decision', { locked: true, stored, next: { ...stored } })).toBeNull();
  });
  it('a locked plan: a plan setting is refused, with the keys it would change', () => {
    expect(lockedWriteRefusal('stress', { locked: true, stored, next: { ...stored, baseSalary: 1, equityMin: 2 } })).toEqual(['baseSalary', 'equityMin']);
    expect(lockedWriteRefusal('decision', { locked: true, stored, next: { ...stored, cadence: 'annual', baseSalary: 1 } })).toEqual(['baseSalary', 'cadence']);
  });
  it('a locked plan: how often months are recorded is refused like any other Decision setting', () => {
    expect(lockedWriteRefusal('decision', { locked: true, stored, next: { ...stored, cadence: 'quarterly' } })).toEqual(['cadence']);
  });
  it('a locked plan: a bookkeeping key alone goes; a Stress key is not a Decision one', () => {
    expect(lockedWriteRefusal('stress', { locked: true, stored, next: { ...stored, firstTaxYear: 2027, retired: true } })).toBeNull();
    expect(lockedWriteRefusal('decision', { locked: true, stored, next: { ...stored, locked: false, unlockedAt: 't', unlockCount: 1 } })).toBeNull();
    expect(lockedWriteRefusal('decision', { locked: true, stored, next: { ...stored, firstTaxYear: 2027 } })).toEqual(['firstTaxYear']);
    expect(lockedWriteRefusal('stress', { locked: true, stored, next: { ...stored, cadence: 'annual' } })).toEqual(['cadence']);
  });
  it('a locked plan: the whole settings map replaced by the defaults is refused', () => {
    expect(lockedWriteRefusal('stress', { locked: true, stored, next: { equityMin: 250000 } })).toEqual(['baseSalary', 'equityMin', 'locked']);
  });
});

describe('the unlock: the only way the lock\'s own record changes on a locked plan', () => {
  const stored = { baseSalary: 40000, locked: true, lockedAt: '2026-09-01', lockedBy: 'record', unlockCount: 1, unlockedAt: '2026-08-01' };
  it('is the flag off, dated, and counted one more (PlanLock.unlockPlan)', () => {
    const unlock = { ...stored, locked: false, unlockedAt: '2026-10-02', unlockCount: 2 };
    expect(isUnlock(stored, unlock)).toBe(true);
    expect(lockedWriteRefusal('decision', { locked: true, stored, next: unlock })).toBeNull();
  });
  it('a copy that simply says "not locked" is not an unlock: a tab that loaded the plan before it was locked must not unlock it by saving', () => {
    const stale = { baseSalary: 40000, locked: false };
    expect(isUnlock(stored, stale)).toBe(false);
    expect(lockedWriteRefusal('decision', { locked: true, stored, next: stale })).toEqual(['locked', 'lockedAt', 'lockedBy', 'unlockCount', 'unlockedAt']);
    expect(lockedWriteRefusal('decision', { locked: true, stored, next: { ...stored, locked: false } })).toEqual(['locked']);
    expect(lockedWriteRefusal('decision', { locked: true, stored, next: { ...stored, locked: false, unlockedAt: 'x', unlockCount: 1 } })).toEqual(['locked', 'unlockedAt']);
  });
  it('while it stays locked, when and why it was locked, and how often it was unlocked, do not move', () => {
    expect(lockedWriteRefusal('decision', { locked: true, stored, next: { ...stored, lockedAt: 'later' } })).toEqual(['lockedAt']);
    const { lockedBy, ...noReason } = stored;
    expect(lockedWriteRefusal('decision', { locked: true, stored, next: noReason })).toEqual(['lockedBy']);
    expect(lockedWriteRefusal('decision', { locked: true, stored, next: { ...stored, unlockCount: 0 } })).toEqual(['unlockCount']);
  });
});

describe('the old "Declining with age" rewrite of the Decision copy', () => {
  const stored = { locked: true, spendingProfile: 'declining', targetSchedule: [40000, 40000, 40000, 40000, 40000, 40000, 40000, 40000, 40000, 40000, 40000, 40000] };
  const baked = { ...stored, spendingProfile: 'flat', spendingMigratedFrom: 'declining', targetSchedule: stored.targetSchedule.map((v, y) => Math.round(v * spendingSmileFactor(y, 'declining'))) };
  it('exactly that rewrite goes through on a locked plan', () => {
    expect(isDecliningBake(stored, baked)).toBe(true);
    expect(lockedWriteRefusal('decision', { locked: true, stored, next: baked })).toBeNull();
    expect(DECLINING_BAKE_KEYS).toEqual(['targetSchedule', 'spendingProfile', 'spendingMigratedFrom']);
  });
  it('anything else dressed as it is refused', () => {
    const other = { ...baked, targetSchedule: baked.targetSchedule.map((v) => v + 1) };
    expect(isDecliningBake(stored, other)).toBe(false);
    expect(lockedWriteRefusal('decision', { locked: true, stored, next: other })).toEqual(DECLINING_BAKE_KEYS.slice().sort());
    expect(isDecliningBake({ ...stored, spendingProfile: 'flat' }, baked)).toBe(false);
    expect(lockedWriteRefusal('stress', { locked: true, stored, next: baked })).not.toBeNull();   // a Decision rewrite only
  });
});

describe('lockedSettingsToWrite (a tax-year save on a locked plan)', () => {
  const stored = { locked: true, baseSalary: 40000, cadence: 'monthly', b: { x: 1 } };
  it('writes the settings as stored, takes only the allowed changes, and names what it left out', () => {
    const next = { ...stored, cadence: 'quarterly', baseSalary: 1, extra: 2 };
    const w = lockedSettingsToWrite('decision', stored, next);
    expect(w.settings).toEqual(stored);
    expect(w.dropped).toEqual(['baseSalary', 'cadence', 'extra']);
    expect(w.settings).not.toBe(stored);
    expect(stored.cadence).toBe('monthly');   // the stored copy is not touched
  });
  it('the unlock is taken; a copy that only says "not locked" is not (the lock stays as stored)', () => {
    expect(lockedSettingsToWrite('decision', { locked: true, lockedBy: 'x' }, { locked: false, lockedBy: 'x', unlockedAt: 't', unlockCount: 1 }).settings)
      .toEqual({ locked: false, lockedBy: 'x', unlockedAt: 't', unlockCount: 1 });
    const w = lockedSettingsToWrite('decision', { locked: true, lockedBy: 'x' }, { locked: false });
    expect(w.settings).toEqual({ locked: true, lockedBy: 'x' });
    expect(w.dropped).toEqual(['locked', 'lockedBy']);
  });
  it('an allowed Stress key removed is removed', () => {
    expect(lockedSettingsToWrite('stress', { a: 1, staleDraftDismissedFor: 'x' }, { a: 1 }).settings).toEqual({ a: 1 });
  });
});

describe('the same rules against the plan AS STORED (FirestoreService.saveScenario, 6.20.2)', () => {
  // A tab or device that loaded the plan before it was locked elsewhere still thinks it is a draft. The store reads the
  // stored plan before every write (it already did, for the newer-version check) and applies these rules to it.
  const DEFAULTS = { equityMin: 250000, baseSalary: 30000, retired: null, firstTaxYear: null };
  const plan = {
    stressTool: { settings: { equityMin: 300000, baseSalary: 40000, retired: true, firstTaxYear: 2026 } },
    decisionTool: { settings: { baseSalary: 40000, locked: true, lockedAt: 't', lockedBy: 'first monthly entry' }, history: [{ date: '2026-09' }], taxYears: {} },
    strategy: { id: 'pots-and-valves', params: {} },
    planDocument: { version: 1 }
  };
  const draft = { ...plan, decisionTool: { ...plan.decisionTool, settings: { baseSalary: 40000 } } };

  it('which writes touch the guarded parts: the two settings maps (whole, or a key inside) and the strategy', () => {
    for (const k of ['stressTool', 'stressTool.settings', 'stressTool.settings.baseSalary', 'decisionTool', 'decisionTool.settings', 'decisionTool.settings.cadence', 'strategy', 'strategy.params'])
      expect(writeTouchesLockedParts({ [k]: 1 }), k).toBe(true);
    for (const k of ['decisionTool.history', 'decisionTool.taxYears', 'decisionTool.planOfRecord', 'planDocument', 'planDocumentArchive', 'holdings', 'journey', 'isActive', 'budgetTool.settings', 'accumulationTool.history', 'stressToolX'])
      expect(writeTouchesLockedParts({ [k]: 1 }), k).toBe(false);
    expect(writeTouchesLockedParts(null)).toBe(false);
  });

  it('reads a write as Firestore\'s updateDoc does: a dotted key is a path, a value replaces what is at it', () => {
    const after = lockedPartsAfter(plan, { 'stressTool.settings.baseSalary': 1, 'decisionTool.settings': { a: 1 }, strategy: { id: 'x' } });
    expect(after.stress).toEqual({ ...plan.stressTool.settings, baseSalary: 1 });
    expect(after.decision).toEqual({ a: 1 });
    expect(after.strategy).toEqual({ id: 'x' });
    expect(plan.stressTool.settings.baseSalary).toBe(40000);   // the stored plan is not touched
    expect(lockedPartsAfter(plan, { stressTool: { other: 1 } }).stress).toBeUndefined();
  });

  it('an unlocked plan, or a write that touches nothing guarded: no refusal', () => {
    expect(lockedPlanWriteRefusal(draft, { 'stressTool.settings': { baseSalary: 1 } }, DEFAULTS)).toBeNull();
    expect(lockedPlanWriteRefusal(plan, { 'decisionTool.history': [], planDocument: null, holdings: {} }, DEFAULTS)).toBeNull();
  });

  it('a locked plan: every form of a settings or strategy change is refused, the keys named by part', () => {
    expect(lockedPlanWriteRefusal(plan, { 'stressTool.settings': { ...plan.stressTool.settings, baseSalary: 77777 } }, DEFAULTS)).toEqual(['stress.baseSalary']);
    expect(lockedPlanWriteRefusal(plan, { 'stressTool.settings.equityMin': 1 }, DEFAULTS)).toEqual(['stress.equityMin']);
    expect(lockedPlanWriteRefusal(plan, { stressTool: { settings: { ...plan.stressTool.settings, equityMin: 1 } } }, DEFAULTS)).toEqual(['stress.equityMin']);
    expect(lockedPlanWriteRefusal(plan, { 'decisionTool.settings': { ...plan.decisionTool.settings, cadence: 'quarterly' } }, DEFAULTS)).toEqual(['decision.cadence']);
    expect(lockedPlanWriteRefusal(plan, { decisionTool: { history: [] } }, DEFAULTS)).toContain('decision.locked');   // the settings wiped
    expect(lockedPlanWriteRefusal(plan, { strategy: { id: 'floor-and-flex', params: {} } }, DEFAULTS)).toEqual(['strategy']);
    expect(lockedPlanWriteRefusal(plan, { 'strategy.params': { x: 1 } }, DEFAULTS)).toEqual(['strategy']);
  });

  it('a tab that thinks the plan is a draft saves its copy of the settings: the lock is not lifted by it', () => {
    expect(lockedPlanWriteRefusal(plan, { 'decisionTool.settings': { baseSalary: 40000 } }, DEFAULTS)).toEqual(['decision.locked', 'decision.lockedAt', 'decision.lockedBy']);
  });

  it('a locked plan: the named bookkeeping still goes — the plan\'s start pinned, the unlock, the same settings again', () => {
    expect(lockedPlanWriteRefusal(plan, { 'stressTool.settings': { ...plan.stressTool.settings, retireAge: null, staleDraftDismissedFor: 'x' } }, DEFAULTS)).toBeNull();
    expect(lockedPlanWriteRefusal(plan, { 'decisionTool.settings': { ...plan.decisionTool.settings, locked: false, unlockedAt: 'now', unlockCount: 1 } }, DEFAULTS)).toBeNull();
    expect(lockedPlanWriteRefusal(plan, { 'decisionTool.settings': JSON.parse(JSON.stringify(plan.decisionTool.settings)) }, DEFAULTS)).toBeNull();
  });

  it('a locked plan with no Stress settings saved reads the defaults: the plan\'s start pinned onto them goes; a figure does not', () => {
    const noStress = { ...plan, stressTool: undefined };
    expect(lockedPlanWriteRefusal(noStress, { 'stressTool.settings': { ...DEFAULTS, retired: false, firstTaxYear: 2027 } }, DEFAULTS)).toBeNull();
    expect(lockedPlanWriteRefusal(noStress, { 'stressTool.settings': { ...DEFAULTS, baseSalary: 1 } }, DEFAULTS)).toEqual(['stress.baseSalary']);
    // with no defaults to hand, nothing but bookkeeping can be told apart: refused, the safe way round
    expect(lockedPlanWriteRefusal(noStress, { 'stressTool.settings': { ...DEFAULTS, firstTaxYear: 2027 } })).not.toBeNull();
  });
});
