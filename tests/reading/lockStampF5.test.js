/**
 * Step F5, fix round 1 (lead4.md D18, R3, R4): a lock, an unlock and a new version are stamped with the moment they happened
 * in both views, and a lock writes the plan as it reads, nothing more, whichever view it is pressed in.
 *
 *  1. The full view stamped a lock at the day's noon (src/reading/clock.js todayOf) where the simple view stamps the moment
 *     (src/v7/effects/planWrite.js now()): a morning lock was dated hours ahead, and a lock, an unlock and a second lock on
 *     one day all carried the same time. The full view's gatherer (lockWrite.js lockReadingOf) now carries the moment beside
 *     the day, and the moment is what the one write is stamped with.
 *  2. The full view's lock ran the whole Settings save before it locked (two writes; the first wrote what the person never
 *     typed). It now sends only a change still waiting to go, as leaving the page does, and stops on a box with a problem.
 *  3. A plan saved before the charge and the ISA choice existed reads them from the upgrade (storage/migrations.js toV2, toV3),
 *     which leaves a LOCKED plan alone. The simple view's lock wrote neither, so the plan read 0% and a fixed 3% from the
 *     moment it was locked, though its document was made at the charge and "Mostly cash", and Settings said it was locked
 *     before charges were added. The lock now writes both as the plan read them, in both views (lockPatch).
 */
import { describe, it, expect, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { FIXTURES, PARITY_TODAY, PARITY_DAY } from '../../e2e/parity/fixtures/plans.js';
import { upgradeScenario } from '../../src/firebase/scenarioMigration.js';
import { lockReadingOf, lockWrite, unlockWrite, documentWrite } from '../../src/ui/lockWrite.js';
import { lockPatch, applyPatch, isLockReversal } from '../../src/answers/plan/lock.js';
import { runForDocument } from '../../src/answers/plan/lastsRun.js';
import { effectiveStressSettings } from '../../src/services/PlanReading.js';
import { momentOf, todayOf } from '../../src/reading/clock.js';
import { installLockFromStress, settleBeforeLock } from '../../src/ui/lockFromStressUi.js';
import { LOCK_AS_READ_WRITES, ALL_WRITES, LOCK_WRITES } from '../../src/answers/plan/schema.js';

const AT = new Date(PARITY_TODAY);   // 10:00 in London, a morning
const copy = (v) => JSON.parse(JSON.stringify(v));
const rawOf = (key) => { const f = FIXTURES.find((x) => x.key === key); return { raw: f.plans(), id: f.subject }; };
const readAgain = (stored) => upgradeScenario(copy(stored), { now: AT }).scenario;

describe('the moment a lock happened, in the full view as in the simple view', () => {
  it('momentOf is the instant given, never the day\'s noon', () => {
    expect(momentOf(AT).toISOString()).toBe(PARITY_TODAY);
    expect(todayOf(AT).toISOString()).not.toBe(PARITY_TODAY);
  });
  it('the full view\'s gatherer carries the moment beside the day it reads the plan on', () => {
    const { raw, id } = rawOf('retired-draft');
    const R = lockReadingOf(raw, id, AT);
    expect(R.at.toISOString()).toBe(PARITY_TODAY);
    expect(R.now.getTime()).toBe(todayOf(AT).getTime());
    expect(String(R.plan.id)).toBe(String(id));
    expect(R.entries.length).toBe(raw.length);
  });
  it('a lock, its document and an unlock written from the gatherer are stamped with the moment', async () => {
    const { raw, id } = rawOf('retired-draft');
    const R = lockReadingOf(raw, id, AT);
    const run = runForDocument(R.plan, { today: PARITY_DAY });
    const writes = [];
    const p = await lockWrite({ planId: R.id, plan: R.plan, entries: R.entries, now: R.at, run, save: async (_, patch) => writes.push(patch) });
    expect(p.ok).toBe(true);
    expect(writes[0]['decisionTool.settings.lockedAt']).toBe(PARITY_TODAY);
    expect(writes[0].planDocument.createdAt).toBe(PARITY_TODAY);
    expect(writes[0].planDocument.lockedAt).toBe(PARITY_TODAY);
    // the same lock as the simple view makes it (planWrite.js: lockPatch with now())
    expect(writes[0]).toEqual(lockPatch(R.plan, { now: AT, run, entries: R.entries }).patch);
    const locked = applyPatch(R.plan, writes[0]);
    const later = new Date(AT.getTime() + 60 * 60 * 1000);
    const u = await unlockWrite({ planId: R.id, plan: locked, now: later, save: async (_, patch) => writes.push(patch) });
    expect(u.ok).toBe(true);
    expect(writes[1]['decisionTool.settings.unlockedAt']).toBe(later.toISOString());
  });
  it('index.html stamps its lock, unlock and new version with the gatherer\'s moment, never the day', () => {
    const html = readFileSync('index.html', 'utf8');
    expect(html).toContain('lockReadingOf(');
    for (const call of ['lockWrite(', 'unlockWrite(', 'documentWrite(']) {
      const at = html.indexOf('await ' + call);
      expect(at, call).toBeGreaterThan(0);
      const line = html.slice(at, html.indexOf('\n', at));
      expect(line, call).toContain('now: R.at');
      expect(line, call).not.toContain('now: R.now');
    }
  });
});

describe('a plan saved before the charge and the ISA choice is locked as it reads, in both views', () => {
  for (const key of ['saver-ladder-draft', 'retired-everything']) {
    it(`${key}: read again after the lock, it runs on the charge and the ISA choice its document was made on`, () => {
      const { raw, id } = rawOf(key);
      const stored = raw.find((p) => p.id === id);
      expect(stored.stressTool.settings.chargesPct).toBeUndefined();   // a plan saved before 6.19.0
      const R = lockReadingOf(raw, id, AT);
      const before = effectiveStressSettings(R.plan, { now: AT });
      const run = runForDocument(R.plan, { today: PARITY_DAY });
      const p = lockPatch(R.plan, { now: AT, run, entries: R.entries });
      expect(p.ok).toBe(true);
      // the simple view writes the patch's dotted paths onto the plan as stored (no upgrade written back)
      const after = effectiveStressSettings(readAgain(applyPatch(copy(stored), p.patch)), { now: AT });
      expect(after.chargesPct).toBe(before.chargesPct);
      expect(after.isaGrowth).toBe(before.isaGrowth);
      expect(p.patch.planDocument.assumptions.chargesPct).toBe(after.chargesPct);
      expect(p.patch.planDocument.assumptions.isaGrowth).toBe(after.isaGrowth);
    });
  }
  it('the paths are declared, written by the lock beside LOCK_WRITES and never in an Undo of it', () => {
    for (const k of LOCK_AS_READ_WRITES) { expect(ALL_WRITES).toContain(k); expect(LOCK_WRITES).not.toContain(k); }
    const { raw, id } = rawOf('saver-ladder-draft');
    const R = lockReadingOf(raw, id, AT);
    const run = runForDocument(R.plan, { today: PARITY_DAY });
    const p = lockPatch(R.plan, { now: AT, run, entries: R.entries });
    for (const k of LOCK_AS_READ_WRITES) { expect(k in p.patch, k).toBe(true); expect(k in p.previous, k).toBe(false); }
    const locked = applyPatch(R.plan, p.patch);
    expect(isLockReversal(locked, { ...p.previous }, p.lockedAt)).toBe(true);
  });
  it('a plan with no Stress settings saved is not given a one-key map', () => {
    const { raw, id } = rawOf('retired-draft');
    const R = lockReadingOf(raw, id, AT);
    const bare = copy(R.plan); delete bare.stressTool;
    const run = runForDocument(R.plan, { today: PARITY_DAY });
    const p = lockPatch(bare, { now: AT, run, entries: [{ plan: bare }] });
    if (p.ok) for (const k of LOCK_AS_READ_WRITES) expect(k in p.patch, k).toBe(false);
  });
});

describe('the full view\'s lock never runs the Settings save', () => {
  const deps = (over = {}) => {
    const d = {
      isLoggedIn: () => true, planIsLocked: async () => false, appConfirm: async () => true,
      saveStressSettingsUI: vi.fn(async () => true), settle: vi.fn(async () => true), runPlan: vi.fn(async () => ({ p: {}, r: {} })),
      commitPlanLock: vi.fn(async () => true), showToast: vi.fn(), openPlanDocument: vi.fn(), ...over
    };
    const w = {};
    installLockFromStress(w, d);
    return { w, d };
  };
  it('a lock sends only what is waiting to go, then locks: one write, the lock\'s own', async () => {
    const { w, d } = deps();
    await w.lockPlanFromStress();
    expect(d.saveStressSettingsUI).not.toHaveBeenCalled();
    expect(d.settle).toHaveBeenCalledTimes(1);
    expect(d.commitPlanLock).toHaveBeenCalledTimes(1);
  });
  it('a box with a problem (or a change that could not be saved) stops the lock: nothing is run or written', async () => {
    const { w, d } = deps({ settle: vi.fn(async () => false) });
    await w.lockPlanFromStress();
    expect(d.runPlan).not.toHaveBeenCalled();
    expect(d.commitPlanLock).not.toHaveBeenCalled();
  });
});

describe('settleBeforeLock: what typed is left unsaved stops the lock, said in plain words', () => {
  it('a box with a problem: said, nothing sent', async () => {
    const said = []; const flushAll = vi.fn(async () => ['nothing']);
    const ok = await settleBeforeLock({ autosave: { checkNow: () => false }, flushAll, showToast: (m) => said.push(m), fixBox: 'Fix the box.' });
    expect(ok).toBe(false); expect(flushAll).not.toHaveBeenCalled(); expect(said).toEqual(['Fix the box.']);
  });
  it('a change sent and saved, or nothing waiting: the lock goes on; one that could not be written says why', async () => {
    const A = { checkNow: () => true };
    expect(await settleBeforeLock({ autosave: A, flushAll: async () => ['saved', 'nothing', undefined] })).toBe(true);
    const said = [];
    expect(await settleBeforeLock({ autosave: A, flushAll: async () => ['notSaved', 'nothing'], showToast: (m) => said.push(m), outcomeWords: { notSaved: 'Nothing was saved.' } })).toBe(false);
    expect(said).toEqual(['Nothing was saved.']);
  });
});
