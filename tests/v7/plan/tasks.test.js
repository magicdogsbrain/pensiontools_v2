/**
 * The home's to-dos put off or done, stored on the plan (7.10.0; research/v7/replan-nov-2026.md §6.4; answers/plan/tasks.js):
 *   - "Not now" puts a to-do off until next month; "Not this time", "I have seen this" and "I have done this" for good, for that
 *     occurrence only (the next month, tax year or review still comes);
 *   - a write drops the dismissals that have run out, and at TASKS_MAX the oldest whose occurrence is in the past — only a
 *     write does that; reading changes nothing;
 *   - one writer from the root as stored, `of` stamped with the plan's createdAt; a copy, an opened file and a 7.9.0 copy that
 *     cloned the root keep none of them;
 *   - the guard: refused once a close has passed, on the example plan and on an entry shown as saved; a closing plan is lived
 *     on until its close, so its to-dos keep "Not now";
 *   - the classic page's × (ScenarioRepository.saveActivePlanTasks): the stored plan read afresh, one key added, `tasks` written
 *     with no stamp.
 * Fictional plans only.
 */
import { describe, it, expect } from 'vitest';
import { taskKeyOf, isTaskKey, dismissedOf, isPutOff, taskPatch, DISMISS, DISMISS_KINDS } from '../../../src/answers/plan/tasks.js';
import { TASK_WRITES } from '../../../src/answers/plan/schema.js';
import { TASKS_MAX } from '../../../src/services/Phases.js';
import { phaseWriteRefusal, lockedPlanWriteRefusal } from '../../../src/services/LockedPlanGuard.js';
import { copyOf } from '../../../src/services/PlanCopy.js';
import { getDefaultStressSettings } from '../../../src/storage/stressDefaults.js';
import { enterGuestMode, leaveGuestMode } from '../../../src/firebase/AuthService.js';
import { createScenario, clearGuestData, guestSnapshot } from '../../../src/firebase/FirestoreService.js';
import { invalidateScenarioCache, saveActivePlanTasks } from '../../../src/storage/ScenarioRepository.js';
import { corpus } from './_plans.js';

const C = corpus();
const copy = (v) => JSON.parse(JSON.stringify(v));
const at = (iso) => new Date(iso);
const ALEX = { id: 'AlexTasks01', createdAt: '2026-05-01T09:00:00.000Z', planDetails: { name: 'Alex’s plan' } };

describe('keys and kinds', () => {
  it('a key is the to-do\'s id and its occurrence; the buttons map to two kinds', () => {
    expect(taskKeyOf('month.record', '2026-10')).toBe('month.record@2026-10');
    expect(taskKeyOf('review.due', '2027/28')).toBe('review.due@2027/28');
    expect(taskKeyOf('hold.stale')).toBe('hold.stale');
    expect(taskKeyOf('household.pending', '')).toBe('household.pending');
    for (const k of ['month.record@2026-10', 'review.due@2027/28', 'review.offCourse@2027-04-06', 'household.pending@PlanB-02', 'plan.confirmStop@2030-01']) expect(isTaskKey(k), k).toBe(true);
    for (const k of ['', 'month', 'month.record@', 'month.record@a b', 'x|y.z', 'month.record@£1', 5, null]) expect(isTaskKey(k), String(k)).toBe(false);
    expect(DISMISS).toEqual({ notNow: 'notNow', notThisTime: 'done', seen: 'done', done: 'done' });
    expect(DISMISS_KINDS).toEqual(['notNow', 'notThisTime', 'seen', 'done']);
    expect(TASK_WRITES).toEqual(['tasks']);
  });
});

describe('not now, done, not this time', () => {
  it('"Not now" is until the 1st of next month; done is for good — for that occurrence only', () => {
    const p1 = taskPatch(ALEX, 'month.record@2026-10', 'notNow', { at: at('2026-10-02T14:03:00.000Z') });
    expect(p1).toEqual({ tasks: { of: ALEX.createdAt, dismissed: { 'month.record@2026-10': { at: '2026-10-02T14:03:00.000Z', until: '2026-11' } } }, until: '2026-11' });
    const plan = { ...ALEX, tasks: p1.tasks };
    expect(isPutOff(plan, 'month.record@2026-10', { now: at('2026-10-31T12:00:00Z') })).toBe(true);
    expect(isPutOff(plan, 'month.record@2026-10', { now: at('2026-11-01T12:00:00Z') })).toBe(false);
    // December: a "Not now" runs to January of the next year
    expect(taskPatch(ALEX, 'month.record@2026-12', 'notNow', { at: at('2026-12-15T12:00:00Z') }).until).toBe('2027-01');
    // "Not this time" on the yearly review: done for 2027/28, so 2028/29's still comes
    const p2 = taskPatch(plan, 'review.due@2027/28', DISMISS.notThisTime, { at: at('2027-04-07T09:00:00Z') });
    const plan2 = { ...ALEX, tasks: p2.tasks };
    expect(p2.tasks.dismissed['review.due@2027/28']).toEqual({ at: '2027-04-07T09:00:00.000Z', until: null });
    expect(isPutOff(plan2, 'review.due@2027/28', { now: at('2028-01-01T12:00:00Z') })).toBe(true);
    expect(isPutOff(plan2, 'review.due@2028/29', { now: at('2028-04-07T12:00:00Z') })).toBe(false);
    // the October "Not now" ran out in November: the next write drops it
    expect(Object.keys(p2.tasks.dismissed)).toEqual(['review.due@2027/28']);
  });
  it('reading changes nothing: a plan with run-out and stray entries is read, never tidied', () => {
    const plan = { ...ALEX, tasks: { of: ALEX.createdAt, dismissed: { 'hold.stale': { at: '2026-01-02T12:00:00.000Z', until: '2026-02' }, 'not a key': { at: 'x', until: null }, 'month.record@2026-10': { at: 'x', until: 'soon' } } } };
    const before = JSON.stringify(plan);
    expect(dismissedOf(plan)).toEqual({ 'hold.stale': { at: '2026-01-02T12:00:00.000Z', until: '2026-02' } });
    expect(isPutOff(plan, 'hold.stale', { now: at('2026-10-02T12:00:00Z') })).toBe(false);
    expect(JSON.stringify(plan)).toBe(before);
  });
  it('a moment must come in: the readers and the writer read no clock', () => {
    expect(() => isPutOff({ ...ALEX, tasks: { dismissed: { 'hold.stale': { at: 'x', until: '2026-11' } } } }, 'hold.stale')).toThrow(/date/);
    expect(() => taskPatch(ALEX, 'hold.stale', 'notNow')).toThrow(/date/);
    expect(() => taskPatch(ALEX, 'hold stale', 'notNow', { at: at('2026-10-02T12:00:00Z') })).toThrow(/not a to-do/);
    expect(() => taskPatch(ALEX, 'hold.stale', 'later', { at: at('2026-10-02T12:00:00Z') })).toThrow(/put away/);
  });
});

describe('the cap, on a write only', () => {
  it('at TASKS_MAX a write drops the oldest whose occurrence is in the past, then the oldest — never the one it makes', () => {
    expect(TASKS_MAX).toBe(50);
    const dismissed = {};
    // 30 done months of 2024 and 2025 (in the past) and 20 done partner links (no date), all for good
    for (let i = 0; i < 30; i++) { const y = 2024 + Math.floor(i / 12); const m = String((i % 12) + 1).padStart(2, '0'); dismissed['month.record@' + y + '-' + m] = { at: '2025-' + String((i % 12) + 1).padStart(2, '0') + '-01T00:00:0' + (i % 10) + '.000Z', until: null }; }
    for (let i = 0; i < 20; i++) dismissed['household.pending@Partner' + i] = { at: '2024-01-01T00:00:' + String(10 + i) + '.000Z', until: null };
    const plan = { ...ALEX, tasks: { of: ALEX.createdAt, dismissed } };
    expect(Object.keys(dismissedOf(plan))).toHaveLength(50);
    const p = taskPatch(plan, 'review.due@2027/28', 'done', { at: at('2027-04-07T12:00:00Z') });
    const keys = Object.keys(p.tasks.dismissed);
    expect(keys).toHaveLength(50);
    expect(keys).toContain('review.due@2027/28');
    // the partner links are older, but their occurrence is no date: a past month went first
    for (let i = 0; i < 20; i++) expect(keys).toContain('household.pending@Partner' + i);
    expect(keys.filter((k) => k.startsWith('month.record@'))).toHaveLength(29);
  });
});

describe('belonging, copies and opened files', () => {
  it('a 7.9.0 copy that cloned the root reads none of it, and its next write drops it; `of` is the plan\'s own', () => {
    const source = { ...ALEX, tasks: { of: ALEX.createdAt, dismissed: { 'hold.stale': { at: '2026-10-02T12:00:00.000Z', until: null } } } };
    const cloned = { ...copy(source), id: 'AlexCopy02', createdAt: '2026-10-05T09:00:00.000Z' };
    expect(dismissedOf(cloned)).toEqual({});
    expect(isPutOff(cloned, 'hold.stale', { now: at('2026-10-06T12:00:00Z') })).toBe(false);
    const p = taskPatch(cloned, 'month.record@2026-10', 'notNow', { at: at('2026-10-06T12:00:00Z') });
    expect(p.tasks).toEqual({ of: '2026-10-05T09:00:00.000Z', dismissed: { 'month.record@2026-10': { at: '2026-10-06T12:00:00.000Z', until: '2026-11' } } });
    // a plan with no createdAt is read as stored
    const noStamp = { id: 'Old03', tasks: { of: 'whatever', dismissed: { 'hold.stale': { at: 'x', until: null } } } };
    expect(isPutOff(noStamp, 'hold.stale', { now: at('2026-10-06T12:00:00Z') })).toBe(true);
    expect(taskPatch(noStamp, 'month.record@2026-10', 'done', { at: at('2026-10-06T12:00:00Z') }).tasks.of).toBeUndefined();
  });
  it('a copy keeps none (PlanCopy.copyOf, which an opened file goes through)', () => {
    const plan = { ...copy(C['04-buckets-running']), tasks: { of: C['04-buckets-running'].createdAt, dismissed: { 'month.record@2026-10': { at: '2026-10-02T12:00:00.000Z', until: '2026-11' } } } };
    expect('tasks' in copyOf(plan, 'Copy', { now: at('2026-10-02T12:00:00Z') })).toBe(false);
  });
});

describe('the guard', () => {
  const data = { tasks: { dismissed: {} } };
  it('a plan with a close: refused once the close has passed; a closing plan keeps "Not now" on its months until then', () => {
    const closed = copy(C['18-moved-to-new-plan']);   // closed at the end of March 2025, lived on until then
    expect(closed.closedAt).toBeTruthy();
    expect(phaseWriteRefusal(closed, data, { now: at('2026-10-02T12:00:00Z') })).toEqual(['tasks']);
    // before its close, it is still being lived on: a month's "Not now" stores
    const before = at('2025-02-10T12:00:00Z');
    expect(phaseWriteRefusal(closed, data, { now: before })).toBe(null);
    const p = taskPatch(closed, 'month.record@2025-02', 'notNow', { at: before });
    expect(phaseWriteRefusal(closed, { tasks: p.tasks }, { now: before })).toBe(null);
    expect(lockedPlanWriteRefusal(closed, { tasks: p.tasks }, getDefaultStressSettings(), { now: before })).toBe(null);
    // the phases are refused on it either way
    expect(phaseWriteRefusal(closed, { phases: {} }, { now: before })).toEqual(['phases']);
  });
  it('the example plan and an entry shown as saved: refused; a locked plan: allowed (the lock does not freeze it)', () => {
    expect(phaseWriteRefusal({ ...ALEX, example: true }, data, { now: at('2026-10-02T12:00:00Z') })).toEqual(['tasks']);
    expect(phaseWriteRefusal(ALEX, data, { now: at('2026-10-02T12:00:00Z'), readonly: true })).toEqual(['tasks']);
    const locked = copy(C['04-buckets-running']);
    expect(phaseWriteRefusal(locked, data, { now: at('2026-10-02T12:00:00Z') })).toBe(null);
    expect(lockedPlanWriteRefusal(locked, data, getDefaultStressSettings(), { now: at('2026-10-02T12:00:00Z') })).toBe(null);
  });
});

describe('the classic page\'s × (ScenarioRepository.saveActivePlanTasks)', () => {
  it('reads the stored plan afresh, adds its one key, writes `tasks` with no stamp', async () => {
    enterGuestMode(); clearGuestData(); invalidateScenarioCache();
    await createScenario({ planDetails: { name: 'Sam’s plan' }, isActive: true, createdAt: '2026-05-01T09:00:00.000Z' });
    const stored = guestSnapshot()[0];
    const stamp = stored.lastModified;
    // another device put something away since this page read the plan: it is kept
    const seeded = [{ ...stored, tasks: { of: stored.createdAt, dismissed: { 'household.pending@PartnerX': { at: '2026-10-01T12:00:00.000Z', until: null } } } }];
    clearGuestData(); sessionStorage.setItem('pt_guest_scenarios', JSON.stringify(seeded));
    const tasks = await saveActivePlanTasks('month.record@2026-10', { now: at('2026-10-02T14:03:00.000Z') });
    const after = guestSnapshot()[0];
    expect(after.lastModified).toBe(stamp);
    expect(after.tasks).toEqual(tasks);
    expect(after.tasks).toEqual({ of: stored.createdAt, dismissed: { 'household.pending@PartnerX': { at: '2026-10-01T12:00:00.000Z', until: null }, 'month.record@2026-10': { at: '2026-10-02T14:03:00.000Z', until: '2026-11' } } });
    // every other part of the plan as it was
    const { tasks: t1, ...rest1 } = after; void t1;
    const { tasks: t0, ...rest0 } = { ...seeded[0] };
    void t0;
    expect(rest1).toEqual(rest0);
    leaveGuestMode(); clearGuestData(); invalidateScenarioCache();
  });
});
