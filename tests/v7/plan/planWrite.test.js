/**
 * E4 (research/v7/editing-in-v7.md 5): the one write file. A fake firestore/lite records every call, so every write is
 * seen: refuses a locked plan (the guard), a plan not in the list, nobody signed in with no window plan, a window whose
 * free time is used up; writes exactly the declared paths plus lastModified; the window's text byte-identical elsewhere;
 * Undo writes the previous values; the account path reads again before the guard, so a lock made elsewhere is seen;
 * a property test over random boxes and plans: every path written is declared.
 */
import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { startPlanWrite, GUEST_PLANS_KEY, TOAST_MS } from '../../../src/v7/effects/planWrite.js';
import { upgradedList, viewFor } from '../../../src/v7/effects/planSource.js';
import { createStore } from '../../../src/v7/effects/store.js';
import { initialState } from '../../../src/v7/state/initial.js';
import { reduce } from '../../../src/v7/state/reduce.js';
import { A } from '../../../src/v7/state/actions.js';
import { parse } from '../../../src/v7/router/routes.js';
import { ALL_WRITES, ABOUT_WRITES, INCOME_WRITES, SPEND_WRITES, POTS_WRITES, LASTS_WRITES, LOCK_WRITES, UNLOCK_WRITES, DOCUMENT_WRITES, WAY_WRITES, MIX_WRITES, HOUSEHOLD_WRITES, LOCK_FLAG_WRITES, PLANS_WRITES } from '../../../src/answers/plan/schema.js';
import { applyPatch, boxesOf, checkAbout } from '../../../src/answers/plan/about.js';
import { checkIncome } from '../../../src/answers/plan/income.js';
import { checkSpend, savedSpend } from '../../../src/answers/plan/spend.js';
import { checkPots, savedPots } from '../../../src/answers/plan/pots.js';
import { checkLasts, savedLasts } from '../../../src/answers/plan/lasts.js';
import { runForDocument } from '../../../src/answers/plan/lastsRun.js';
import { lockPatch, unlockPatch, documentPatch, LOCKED_BY } from '../../../src/answers/plan/lock.js';
import { upgradeScenario } from '../../../src/firebase/scenarioMigration.js';
import { isLockedSettings } from '../../../src/services/LockedPlanGuard.js';
import { NO_WORKER } from '../../../src/v7/effects/workerClient.js';
import { KEY_MINUTES } from '../../../src/services/GuestMeter.js';
import { corpus, entryOf, TODAY, noon } from './_plans.js';

const C = corpus();
const tick = async (n = 6) => { for (let i = 0; i < n; i++) await new Promise((r) => setTimeout(r, 0)); };
const copy = (v) => JSON.parse(JSON.stringify(v));

function storage(start = {}) {
  const map = new Map(Object.entries(start));
  const calls = [];
  return {
    calls,
    getItem(k) { calls.push(['getItem', k]); return map.has(k) ? map.get(k) : null; },
    setItem(k, v) { calls.push(['setItem', k]); map.set(k, String(v)); },
    removeItem(k) { calls.push(['removeItem', k]); map.delete(k); },
    raw: (k) => map.get(k)
  };
}
/** The fake firestore/lite: only doc and updateDoc exist; every call is recorded; `fail` makes updateDoc reject. */
function fakeLite({ fail = false } = {}) {
  const writes = [];
  return {
    writes,
    doc: (db, ...path) => ({ db, path: path.join('/') }),
    updateDoc: (ref, data) => { if (fail) return Promise.reject(new Error('offline')); writes.push({ path: ref.path, data: copy(data) }); return Promise.resolve(); }
  };
}

/**
 * A page on a plan's about step with the plans read: signed in (source 'account') or nobody (source 'window', the text in
 * sessionStorage). `handles` is what planSource would hand in; `reread` swaps in `rereadList` when given.
 */
function page({ raws, planId, session = 'in', typed = {}, local = storage(), sessionStore = null, fb = fakeLite(), rereadList = null, win = null, client = null, step = 'about' }) {
  const store = createStore(initialState({ today: TODAY, build: 'test' }), reduce);
  store.dispatch({ type: A.ROUTE_SET, route: parse('#/plan/' + planId + '/' + step) });
  store.dispatch({ type: A.SESSION_SET, session: { kind: session, email: session === 'in' ? 'a@b.c' : null } });
  const list = upgradedList(raws, noon(TODAY));
  const source = session === 'in' ? 'account' : 'window';
  store.dispatch({ type: A.PLANS_SET, list, source, readAt: '14:03' });
  for (const [path, value] of Object.entries(typed)) store.dispatch({ type: A.PLAN_EDIT, planId, path, value });
  store.dispatch({ type: A.PLANS_VIEW, view: viewFor(store.getState()) });
  const rereads = [];
  const user = session === 'in' ? { uid: 'u1', email: 'a@b.c', emailVerified: true } : null;
  const handles = () => ({
    db: session === 'in' ? { name: 'db' } : null,
    user,
    reread: () => { rereads.push(1); if (rereadList) store.dispatch({ type: A.PLANS_SET, list: upgradedList(rereadList, noon(TODAY)), source: 'account', readAt: '14:04' }); return Promise.resolve(); }
  });
  const sess = sessionStore || storage(session === 'in' ? {} : { [GUEST_PLANS_KEY]: JSON.stringify(raws) });
  const stop = startPlanWrite(store, { win, session: sess, local, now: () => new Date(TODAY + 'T14:03:00.000Z'), fb, client, handles });
  // the plan source's own reading after every change (the page does this itself; the tests keep it in step by hand)
  store.subscribe((state) => { if (state.plans && state.plans.status === 'read' && !state.plans.view) store.dispatch({ type: A.PLANS_VIEW, view: viewFor(state) }); });
  return { store, fb, session: sess, local, rereads, stop, save: () => store.dispatch({ type: A.PLAN_SAVE, planId }), undo: () => store.dispatch({ type: A.PLAN_UNDO, planId }),
    lock: () => store.dispatch({ type: A.PLAN_LOCK, planId }), unlock: () => store.dispatch({ type: A.PLAN_UNLOCK, planId }), newVersion: () => store.dispatch({ type: A.PLAN_DOCUMENT, planId }) };
}

const SAVER = C['10-couple-b'];           // unlocked, stopping at 62 (approaching)
const LOCKED = C['03-gilt-ladder-runup'];
const STAMP = '2026-10-02T14:03:00.000Z';

describe('an account: one updateDoc of the declared paths, past the guard, after a fresh read', () => {
  it('writes exactly the changed paths plus lastModified to users/{uid}/scenarios/{id}; then plan/saved with the previous values and plans/reading', async () => {
    const p = page({ raws: [SAVER, LOCKED], planId: SAVER.id, typed: { stopAge: '63', endAge: '95' } });
    const actions = [];
    p.store.subscribe((s, a) => actions.push(a.type));
    p.save();
    await tick();
    expect(p.rereads.length, 'read again before the write').toBe(1);
    expect(p.fb.writes.length).toBe(1);
    expect(p.fb.writes[0].path).toBe('users/u1/scenarios/' + SAVER.id);
    expect(p.fb.writes[0].data).toEqual({
      'stressTool.settings.retireAge': 63, 'stressTool.settings.firstTaxYear': 2030, 'stressTool.settings.shapeAgeNow': 63,
      'stressTool.settings.duration': 33, 'decisionTool.settings.firstTaxYear': 2030, 'budgetTool.settings.retirementAge': 63,
      lastModified: STAMP
    });
    for (const k of Object.keys(p.fb.writes[0].data)) expect(ALL_WRITES).toContain(k);
    expect(actions).toContain(A.PLAN_SAVED);
    expect(actions).toContain(A.PLANS_READING);
    const ui = p.store.getState().ui;
    expect(ui.saving).toBe(null);
    expect(ui.toast).toMatchObject({ planId: SAVER.id, kind: 'saved', line: { id: 'runsTo', slots: { endAge: 95, years: 33 } } });
    expect(ui.toast.previous).toEqual({ 'stressTool.settings.retireAge': 62, 'stressTool.settings.firstTaxYear': 2029, 'stressTool.settings.shapeAgeNow': 62, 'stressTool.settings.duration': 32, 'decisionTool.settings.firstTaxYear': 2029, 'budgetTool.settings.retirementAge': 62, lastModified: SAVER.lastModified });
    expect(p.store.getState().draft.plan.id, 'the draft is cleared on save').toBe(null);
    // the window's storage was never touched on the account path
    expect(p.session.calls.filter(([c]) => c === 'setItem')).toEqual([]);
  });
  it('Undo: one more updateDoc with the previous values, the last-changed stamp among them (a key the plan did not have goes back as null), then the toast says so', async () => {
    const p = page({ raws: [SAVER], planId: SAVER.id, typed: { stopAge: '63', endAge: '95' } });
    p.save(); await tick();
    // the plan source would hand the written plan back on the read again; the test does it by hand
    const written = applyPatch(entryOf(SAVER).plan, p.fb.writes[0].data);
    p.store.dispatch({ type: A.PLANS_SET, list: [{ plan: written, newer: false, failed: false }], source: 'account', readAt: '14:04' });
    p.undo(); await tick();
    expect(p.fb.writes.length).toBe(2);
    expect(p.fb.writes[1].data).toEqual({ 'stressTool.settings.retireAge': 62, 'stressTool.settings.firstTaxYear': 2029, 'stressTool.settings.shapeAgeNow': 62, 'stressTool.settings.duration': 32, 'decisionTool.settings.firstTaxYear': 2029, 'budgetTool.settings.retirementAge': 62, lastModified: SAVER.lastModified });
    expect(p.store.getState().ui.toast).toEqual({ planId: SAVER.id, kind: 'undone', previous: null, line: null });
    // a key absent before: undone as null on an account
    const q = page({ raws: [SAVER], planId: SAVER.id });
    q.store.dispatch({ type: A.PLAN_SAVED, planId: SAVER.id, previous: { 'stressTool.settings.retireAge': undefined }, line: null });
    q.undo(); await tick();
    expect(q.fb.writes[0].data).toEqual({ 'stressTool.settings.retireAge': null, lastModified: STAMP });
  });
  it('nothing typed: nothing written, the toast says nothing has changed', async () => {
    const p = page({ raws: [SAVER], planId: SAVER.id });
    p.save(); await tick();
    expect(p.fb.writes).toEqual([]);
    expect(p.store.getState().ui.toast).toEqual({ planId: SAVER.id, kind: 'unchanged', previous: null, line: null });
  });
  it('a box with a problem: nothing written, "problems"; the draft stays', async () => {
    const p = page({ raws: [SAVER], planId: SAVER.id, typed: { endAge: '60' } });
    p.save(); await tick();
    expect(p.fb.writes).toEqual([]);
    expect(p.store.getState().ui.saveProblem).toEqual({ planId: SAVER.id, problem: 'problems' });
    expect(p.store.getState().draft.plan.values.endAge).toBe('60');
    expect(p.store.getState().draft.plan.asked).toBe(true);
  });
  it('a locked plan is refused by the guard, even with the screen bypassed: nothing written', async () => {
    const p = page({ raws: [LOCKED], planId: LOCKED.id, typed: { endAge: '99' } });
    p.save(); await tick();
    expect(p.fb.writes).toEqual([]);
    expect(p.store.getState().ui.saveProblem).toEqual({ planId: LOCKED.id, problem: 'locked' });
    // and an undo with made-up previous values on a locked plan is refused too
    p.store.dispatch({ type: A.PLAN_SAVED, planId: LOCKED.id, previous: { 'stressTool.settings.duration': 30 }, line: null });
    p.undo(); await tick();
    expect(p.fb.writes).toEqual([]);
    expect(p.store.getState().ui.saveProblem).toEqual({ planId: LOCKED.id, problem: 'locked' });
  });
  it('a plan locked elsewhere since the page opened: the read again sees the lock, nothing is written', async () => {
    const lockedNow = copy(SAVER);
    lockedNow.decisionTool.settings = { ...lockedNow.decisionTool.settings, locked: true, lockedAt: '2026-10-02T13:00:00.000Z' };
    const p = page({ raws: [SAVER], planId: SAVER.id, typed: { endAge: '95' }, rereadList: [lockedNow] });
    p.save(); await tick();
    expect(p.rereads.length).toBe(1);
    expect(p.fb.writes).toEqual([]);
    expect(p.store.getState().ui.saveProblem).toEqual({ planId: SAVER.id, problem: 'locked' });
  });
  it('a plan not in the list, a plan shown as saved, and a write that fails', async () => {
    const p = page({ raws: [SAVER], planId: 'NoSuchPlan' });
    p.save(); await tick();
    expect(p.store.getState().ui.saveProblem).toEqual({ planId: 'NoSuchPlan', problem: 'notHere' });
    const newer = page({ raws: [{ ...copy(SAVER), schemaVersion: 999 }], planId: SAVER.id, typed: { endAge: '95' } });
    newer.save(); await tick();
    expect(newer.fb.writes).toEqual([]);
    expect(newer.store.getState().ui.saveProblem.problem).toBe('readonly');
    const failing = page({ raws: [SAVER], planId: SAVER.id, typed: { endAge: '95' }, fb: fakeLite({ fail: true }) });
    failing.save(); await tick();
    expect(failing.store.getState().ui.saveProblem).toEqual({ planId: SAVER.id, problem: 'failed' });
    expect(failing.store.getState().ui.toast).toBe(null);
  });
  it('the toast closes after TOAST_MS through the window\'s timer', async () => {
    const timers = [];
    const win = { setTimeout: (fn, ms) => { timers.push({ fn, ms }); return timers.length; }, clearTimeout: () => {} };
    const p = page({ raws: [SAVER], planId: SAVER.id, typed: { endAge: '95' }, win });
    p.save(); await tick();
    expect(timers.length).toBe(1);
    expect(timers[0].ms).toBe(TOAST_MS);
    timers[0].fn();
    expect(p.store.getState().ui.toast).toBe(null);
  });
});

describe('without an account: the window\'s plans, the one plan folded, every other byte the same', () => {
  it('writes the plan into pt_guest_scenarios with the same patch; the other plan is byte-identical; nothing goes to Firestore', async () => {
    const p = page({ raws: [LOCKED, SAVER], planId: SAVER.id, session: 'nobody', typed: { stopAge: '63', endAge: '95' } });
    const before = p.session.raw(GUEST_PLANS_KEY);
    p.save(); await tick();
    expect(p.fb.writes).toEqual([]);
    expect(p.rereads).toEqual([]);
    const after = JSON.parse(p.session.raw(GUEST_PLANS_KEY));
    expect(JSON.stringify(after[0])).toBe(JSON.stringify(JSON.parse(before)[0]));   // the locked plan, byte for byte
    expect(after[1]).toEqual(applyPatch(JSON.parse(before)[1], { 'stressTool.settings.retireAge': 63, 'stressTool.settings.firstTaxYear': 2030, 'stressTool.settings.shapeAgeNow': 63, 'stressTool.settings.duration': 33, 'decisionTool.settings.firstTaxYear': 2030, 'budgetTool.settings.retirementAge': 63, lastModified: STAMP }));
    expect(p.session.calls.filter(([c]) => c === 'setItem').map(([, k]) => k)).toEqual([GUEST_PLANS_KEY]);
    expect(p.session.calls.filter(([c]) => c === 'removeItem')).toEqual([]);
    expect(p.store.getState().ui.toast.kind).toBe('saved');
  });
  it('Undo puts the window\'s text back byte for byte (a key the plan did not have is deleted, not nulled)', async () => {
    const bare = copy(SAVER);
    delete bare.budgetTool.settings.retirementAge;     // a key the plan does not have: written by the save, deleted by the undo
    const p = page({ raws: [bare], planId: bare.id, session: 'nobody', typed: { stopAge: '63' } });
    const before = p.session.raw(GUEST_PLANS_KEY);
    p.save(); await tick();
    expect(JSON.parse(p.session.raw(GUEST_PLANS_KEY))[0].budgetTool.settings.retirementAge).toBe(63);
    p.store.dispatch({ type: A.PLANS_SET, list: upgradedList(JSON.parse(p.session.raw(GUEST_PLANS_KEY)), noon(TODAY)), source: 'window', readAt: '14:04' });
    p.undo(); await tick();
    const undone = JSON.parse(p.session.raw(GUEST_PLANS_KEY))[0];
    expect('retirementAge' in undone.budgetTool.settings).toBe(false);
    expect(JSON.stringify(undone), 'byte-identical, the last-changed stamp included').toBe(JSON.stringify(JSON.parse(before)[0]));
  });
  it('the free time used up: nothing written, "usedUp"; nobody signed in and the plans are an account\'s: "nobody"; the plan gone from the text: "storage"', async () => {
    const used = page({ raws: [SAVER], planId: SAVER.id, session: 'nobody', typed: { endAge: '95' }, local: storage({ [KEY_MINUTES]: '180' }) });
    const before = used.session.raw(GUEST_PLANS_KEY);
    used.save(); await tick();
    expect(used.session.raw(GUEST_PLANS_KEY)).toBe(before);
    expect(used.store.getState().ui.saveProblem.problem).toBe('usedUp');
    // nobody signed in, but the list in memory says 'account' (a session that ended mid-way): nothing written anywhere
    const nobody = page({ raws: [SAVER], planId: SAVER.id, session: 'nobody', typed: { endAge: '95' } });
    nobody.store.dispatch({ type: A.PLANS_SET, list: upgradedList([SAVER], noon(TODAY)), source: 'account', readAt: '14:03' });
    nobody.save(); await tick();
    expect(nobody.fb.writes).toEqual([]);
    expect(nobody.store.getState().ui.saveProblem.problem).toBe('nobody');
    // the window's text no longer holds the plan: nothing written
    const gone = page({ raws: [SAVER], planId: SAVER.id, session: 'nobody', typed: { endAge: '95' }, sessionStore: storage({ [GUEST_PLANS_KEY]: JSON.stringify([LOCKED]) }) });
    gone.save(); await tick();
    expect(gone.session.raw(GUEST_PLANS_KEY)).toBe(JSON.stringify([LOCKED]));
    expect(gone.store.getState().ui.saveProblem.problem).toBe('storage');
  });
  it('a locked window plan is refused by the guard: the text is untouched', async () => {
    const p = page({ raws: [LOCKED], planId: LOCKED.id, session: 'nobody', typed: { endAge: '99' } });
    const before = p.session.raw(GUEST_PLANS_KEY);
    p.save(); await tick();
    expect(p.session.raw(GUEST_PLANS_KEY)).toBe(before);
    expect(p.store.getState().ui.saveProblem.problem).toBe('locked');
  });
});

describe('"Money that comes in anyway" (editing-in-v7.md 7): the same one write, chosen by the step the page is on', () => {
  const LUMPY = C['12-lumpy-db-gia'];
  const onIncome = (o) => { const p = page({ ...o, planId: o.planId || LUMPY.id }); p.store.dispatch({ type: A.ROUTE_SET, route: parse('#/plan/' + (o.planId || LUMPY.id) + '/income') }); for (const [path, value] of Object.entries(o.typed || {})) p.store.dispatch({ type: A.PLAN_EDIT, planId: o.planId || LUMPY.id, path, value }); p.store.dispatch({ type: A.PLANS_VIEW, view: viewFor(p.store.getState()) }); return p; };
  it('an account: exactly the changed income paths plus lastModified; the toast line is the step\'s; Undo puts the previous values back', async () => {
    const p = onIncome({ raws: [LUMPY, LOCKED], typed: { spKind: 'none', 'lumps.ids': '0', 'fs.0.fromAge': '66' } });
    p.save(); await tick();
    expect(p.rereads.length).toBe(1);
    expect(p.fb.writes.length).toBe(1);
    expect(p.fb.writes[0].path).toBe('users/u1/scenarios/' + LUMPY.id);
    expect(p.fb.writes[0].data).toEqual({
      'stressTool.settings.spWeeklyAmount': 0, 'stressTool.settings.statePension': 0,
      'stressTool.settings.dbStartYear': 6, 'stressTool.settings.dbStartAge': 66,
      'stressTool.settings.windfalls': [LUMPY.stressTool.settings.windfalls[0]],
      lastModified: STAMP
    });
    for (const k of Object.keys(p.fb.writes[0].data)) expect(ALL_WRITES).toContain(k);
    for (const k of Object.keys(p.fb.writes[0].data)) if (k !== 'lastModified') expect(INCOME_WRITES).toContain(k);
    const ui = p.store.getState().ui;
    expect(ui.toast).toMatchObject({ planId: LUMPY.id, kind: 'saved', line: { id: 'income', slots: { sp: 'none', fs: 1, streams: 2, lumps: 1 } } });
    expect(ui.toast.previous).toEqual({ 'stressTool.settings.spWeeklyAmount': 224.9, 'stressTool.settings.statePension': 12000, 'stressTool.settings.dbStartYear': 5, 'stressTool.settings.dbStartAge': undefined, 'stressTool.settings.windfalls': LUMPY.stressTool.settings.windfalls, lastModified: LUMPY.lastModified });
    expect(p.store.getState().draft.plan.id).toBe(null);
    const written = applyPatch(entryOf(LUMPY).plan, p.fb.writes[0].data);
    p.store.dispatch({ type: A.PLANS_SET, list: [{ plan: written, newer: false, failed: false }], source: 'account', readAt: '14:04' });
    p.undo(); await tick();
    expect(p.fb.writes[1].data).toEqual({ 'stressTool.settings.spWeeklyAmount': 224.9, 'stressTool.settings.statePension': 12000, 'stressTool.settings.dbStartYear': 5, 'stressTool.settings.dbStartAge': null, 'stressTool.settings.windfalls': LUMPY.stressTool.settings.windfalls, lastModified: LUMPY.lastModified });
    expect(p.store.getState().ui.toast).toEqual({ planId: LUMPY.id, kind: 'undone', previous: null, line: null });
  });
  it('the window: the plan folded with the same patch, every other byte the same, the other plan byte-identical; Undo byte for byte', async () => {
    const p = onIncome({ raws: [LOCKED, LUMPY], session: 'nobody', typed: { 'fs.ids': '0,n1', 'fs.n1.amount': '3000', 'fs.n1.fromAge': '66', 'lumps.ids': '0,1,n1', 'lumps.n1.label': 'Gift', 'lumps.n1.amount': '10000', 'lumps.n1.atAge': '62' } });
    const before = p.session.raw(GUEST_PLANS_KEY);
    p.save(); await tick();
    expect(p.fb.writes).toEqual([]);
    const after = JSON.parse(p.session.raw(GUEST_PLANS_KEY));
    expect(JSON.stringify(after[0])).toBe(JSON.stringify(JSON.parse(before)[0]));
    expect(after[1].stressTool.settings.extraIncomes[2]).toEqual({ label: 'Final-salary pension', annual: 3000, startYear: 6, endYear: null, indexation: 'lpi5' });
    expect(after[1].stressTool.settings.windfalls[2]).toEqual({ label: 'Gift', amount: 10000, year: 2, wrapper: 'cash' });
    const stripped = (plan) => { const out = copy(plan); for (const path of ALL_WRITES) { const parts = path.split('.'); let o = out; for (let i = 0; i < parts.length - 1 && o; i++) o = o[parts[i]]; if (o) delete o[parts[parts.length - 1]]; } return JSON.stringify(out); };
    expect(stripped(after[1])).toBe(stripped(JSON.parse(before)[1]));
    p.store.dispatch({ type: A.PLANS_SET, list: upgradedList(after, noon(TODAY)), source: 'window', readAt: '14:04' });
    p.undo(); await tick();
    expect(JSON.stringify(JSON.parse(p.session.raw(GUEST_PLANS_KEY))[1])).toBe(JSON.stringify(JSON.parse(before)[1]));
  });
  it('a locked plan is refused by the guard on this step too; a card with a problem writes nothing; nothing typed writes nothing', async () => {
    const locked = onIncome({ raws: [LOCKED], planId: LOCKED.id, typed: { spKind: 'none' } });
    locked.save(); await tick();
    expect(locked.fb.writes).toEqual([]);
    expect(locked.store.getState().ui.saveProblem).toEqual({ planId: LOCKED.id, problem: 'locked' });
    const bad = onIncome({ raws: [LUMPY], typed: { 'lumps.1.atAge': '59' } });
    bad.save(); await tick();
    expect(bad.fb.writes).toEqual([]);
    expect(bad.store.getState().ui.saveProblem).toEqual({ planId: LUMPY.id, problem: 'problems' });
    const nothing = onIncome({ raws: [LUMPY] });
    nothing.save(); await tick();
    expect(nothing.fb.writes).toEqual([]);
    expect(nothing.store.getState().ui.toast.kind).toBe('unchanged');
  });
  it('property: whatever is typed on the income step, every path written is declared and on this step\'s list; the window\'s text differs only there', async () => {
    const anyTyped = fc.record({
      spKind: fc.oneof(fc.constant(undefined), fc.constantFrom('full', 'forecast', 'none', 'assumed', 'x')),
      spWeekly: fc.oneof(fc.constant(undefined), fc.constantFrom('', '200', '230.25', 'abc')),
      other: fc.oneof(fc.constant(undefined), fc.constantFrom('', '0', '3000', 'x')),
      'fs.ids': fc.oneof(fc.constant(undefined), fc.constantFrom('', '0', 'n1', '0,n1')),
      'fs.n1.amount': fc.oneof(fc.constant(undefined), fc.constantFrom('', '4000')),
      'fs.n1.fromAge': fc.oneof(fc.constant(undefined), fc.constantFrom('', '60', '70', '99')),
      'lumps.ids': fc.oneof(fc.constant(undefined), fc.constantFrom('', '1', '1,0', 'n1')),
      'lumps.n1.amount': fc.oneof(fc.constant(undefined), fc.constantFrom('', '5000')),
      'lumps.n1.atAge': fc.oneof(fc.constant(undefined), fc.constantFrom('', '59', '65')),
      'streams.ids': fc.oneof(fc.constant(undefined), fc.constantFrom('', '1', '0,1'))
    }, { requiredKeys: [] }).map((r) => Object.fromEntries(Object.entries(r).filter(([, v]) => v !== undefined)));
    const EDITABLE = Object.values(C).filter((p) => !(p.decisionTool.settings && p.decisionTool.settings.locked));
    await fc.assert(fc.asyncProperty(fc.constantFrom(...EDITABLE), anyTyped, fc.boolean(), async (raw, typed, account) => {
      const p = onIncome({ raws: [raw, LOCKED], planId: raw.id, session: account ? 'in' : 'nobody', typed });
      const before = p.session.raw(GUEST_PLANS_KEY);
      p.save(); await tick();
      const c = checkIncome(entryOf(raw).plan, typed, { today: TODAY });
      if (account) {
        for (const w of p.fb.writes) for (const k of Object.keys(w.data)) expect(k === 'lastModified' || INCOME_WRITES.includes(k), k).toBe(true);
        if (!c.ok) expect(p.fb.writes).toEqual([]);
      } else {
        expect(p.fb.writes).toEqual([]);
        const after = JSON.parse(p.session.raw(GUEST_PLANS_KEY));
        expect(JSON.stringify(after[1])).toBe(JSON.stringify(JSON.parse(before)[1]));
        if (!c.ok) expect(p.session.raw(GUEST_PLANS_KEY)).toBe(before);
        else {
          const stripped = (plan) => { const out = copy(plan); for (const path of INCOME_WRITES.concat('lastModified')) { const parts = path.split('.'); let o = out; for (let i = 0; i < parts.length - 1 && o; i++) o = o[parts[i]]; if (o) delete o[parts[parts.length - 1]]; } return JSON.stringify(out); };
          expect(stripped(after[0])).toBe(stripped(JSON.parse(before)[0]));
        }
      }
      p.stop();
    }), { numRuns: 50 });
  });
});

describe('"What you spend" (editing-in-v7.md 8): the same one write, chosen by the step the page is on', () => {
  const LUMPY = C['12-lumpy-db-gia'];
  const onSpend = (o) => { const id = o.planId || LUMPY.id; const p = page({ ...o, planId: id }); p.store.dispatch({ type: A.ROUTE_SET, route: parse('#/plan/' + id + '/spend') }); for (const [path, value] of Object.entries(o.typed || {})) p.store.dispatch({ type: A.PLAN_EDIT, planId: id, path, value }); p.store.dispatch({ type: A.PLANS_VIEW, view: viewFor(p.store.getState()) }); return p; };
  it('an account: exactly the changed spend paths plus lastModified (the steps, the schedule, the first figure, the Decision copies); the toast line is the step\'s; Undo puts the previous values back', async () => {
    const p = onSpend({ raws: [LUMPY, LOCKED], typed: { 'first.amount': '3000', 'costs.ids': '0' } });
    p.save(); await tick();
    expect(p.rereads.length).toBe(1);
    expect(p.fb.writes.length).toBe(1);
    expect(p.fb.writes[0].path).toBe('users/u1/scenarios/' + LUMPY.id);
    const data = p.fb.writes[0].data;
    expect(Object.keys(data).sort()).toEqual(['decisionTool.settings.baseSalary', 'decisionTool.settings.targetSchedule', 'lastModified', 'stressTool.settings.baseSalary', 'stressTool.settings.extraWithdrawals', 'stressTool.settings.incomeSteps', 'stressTool.settings.targetSchedule']);
    expect(data.lastModified).toBe(STAMP);
    expect(data['stressTool.settings.incomeSteps'].slice(1)).toEqual(LUMPY.stressTool.settings.incomeSteps.slice(1));
    expect(data['stressTool.settings.incomeSteps'][0].fromAge).toBe(60);
    expect(data['stressTool.settings.baseSalary']).toBe(data['stressTool.settings.incomeSteps'][0].amount);
    expect(data['decisionTool.settings.baseSalary']).toBe(data['stressTool.settings.baseSalary']);
    expect(data['stressTool.settings.extraWithdrawals']).toEqual([LUMPY.stressTool.settings.extraWithdrawals[0]]);
    for (const k of Object.keys(data)) expect(ALL_WRITES).toContain(k);
    for (const k of Object.keys(data)) if (k !== 'lastModified') expect(SPEND_WRITES).toContain(k);
    const ui = p.store.getState().ui;
    expect(ui.toast).toMatchObject({ planId: LUMPY.id, kind: 'saved', line: { id: 'spend', slots: { age: 60, monthly: '£3,000', steps: 2, costs: 1 } } });
    expect(ui.toast.previous['stressTool.settings.incomeSteps']).toEqual(LUMPY.stressTool.settings.incomeSteps);
    expect(ui.toast.previous['stressTool.settings.baseSalary']).toBe(48000);
    expect(ui.toast.previous.lastModified).toBe(LUMPY.lastModified);
    expect(p.store.getState().draft.plan.id).toBe(null);
    const written = applyPatch(entryOf(LUMPY).plan, data);
    expect(savedSpend(written, { today: TODAY }).first.monthly).toBe(3000);
    p.store.dispatch({ type: A.PLANS_SET, list: [{ plan: written, newer: false, failed: false }], source: 'account', readAt: '14:04' });
    p.undo(); await tick();
    expect(p.fb.writes[1].data).toEqual({ ...ui.toast.previous, lastModified: LUMPY.lastModified });
    expect(p.store.getState().ui.toast).toEqual({ planId: LUMPY.id, kind: 'undone', previous: null, line: null });
  });
  it('the window: the plan folded with the same patch, every other byte the same, the other plan byte-identical; Undo byte for byte', async () => {
    const p = onSpend({ raws: [LOCKED, LUMPY], session: 'nobody', typed: { 'steps.ids': '0,1,n1', 'steps.n1.fromAge': '85', 'steps.n1.amount': '1500', 'steps.n1.then': 'falls', 'steps.n1.fallsPct': '1', 'costs.ids': '0,1,n1', 'costs.n1.label': 'Car', 'costs.n1.amount': '10000', 'costs.n1.atAge': '63' } });
    const before = p.session.raw(GUEST_PLANS_KEY);
    p.save(); await tick();
    expect(p.fb.writes).toEqual([]);
    const after = JSON.parse(p.session.raw(GUEST_PLANS_KEY));
    expect(JSON.stringify(after[0])).toBe(JSON.stringify(JSON.parse(before)[0]));
    const steps = after[1].stressTool.settings.incomeSteps;
    expect(steps.length).toBe(4);
    expect(steps[3]).toMatchObject({ fromAge: 85, decline: 1 });
    expect(after[1].stressTool.settings.targetSchedule.length).toBe(after[1].stressTool.settings.duration + 1);
    expect(after[1].stressTool.settings.extraWithdrawals[2]).toMatchObject({ label: 'Car', year: 3, years: 1, indexation: 'cpi' });
    const stripped = (plan) => { const out = copy(plan); for (const path of ALL_WRITES) { const parts = path.split('.'); let o = out; for (let i = 0; i < parts.length - 1 && o; i++) o = o[parts[i]]; if (o) delete o[parts[parts.length - 1]]; } return JSON.stringify(out); };
    expect(stripped(after[1])).toBe(stripped(JSON.parse(before)[1]));
    p.store.dispatch({ type: A.PLANS_SET, list: upgradedList(after, noon(TODAY)), source: 'window', readAt: '14:04' });
    p.undo(); await tick();
    expect(JSON.stringify(JSON.parse(p.session.raw(GUEST_PLANS_KEY))[1])).toBe(JSON.stringify(JSON.parse(before)[1]));
  });
  it('a locked plan is refused by the guard on this step too; a box with a problem writes nothing; nothing typed writes nothing', async () => {
    const locked = onSpend({ raws: [LOCKED], planId: LOCKED.id, typed: { 'first.amount': '3000' } });
    locked.save(); await tick();
    expect(locked.fb.writes).toEqual([]);
    expect(locked.store.getState().ui.saveProblem).toEqual({ planId: LOCKED.id, problem: 'locked' });
    const bad = onSpend({ raws: [LUMPY], typed: { 'steps.0.fromAge': '60' } });
    bad.save(); await tick();
    expect(bad.fb.writes).toEqual([]);
    expect(bad.store.getState().ui.saveProblem).toEqual({ planId: LUMPY.id, problem: 'problems' });
    const nothing = onSpend({ raws: [LUMPY] });
    nothing.save(); await tick();
    expect(nothing.fb.writes).toEqual([]);
    expect(nothing.store.getState().ui.toast.kind).toBe('unchanged');
  });
  it('property: whatever is typed on the spend step, every path written is declared and on this step\'s list; the window\'s text differs only there', async () => {
    const anyTyped = fc.record({
      'first.amount': fc.oneof(fc.constant(undefined), fc.constantFrom('', '2000', '3,000', 'abc')),
      'first.then': fc.oneof(fc.constant(undefined), fc.constantFrom('level', 'falls', 'glides', 'x')),
      'first.fallsPct': fc.oneof(fc.constant(undefined), fc.constantFrom('', '1', '0.3')),
      'steps.ids': fc.oneof(fc.constant(undefined), fc.constantFrom('', '0', 'n1', '0,n1')),
      'steps.n1.fromAge': fc.oneof(fc.constant(undefined), fc.constantFrom('', '70', '99')),
      'steps.n1.amount': fc.oneof(fc.constant(undefined), fc.constantFrom('', '1800')),
      'costs.ids': fc.oneof(fc.constant(undefined), fc.constantFrom('', '0', 'n1')),
      'costs.n1.amount': fc.oneof(fc.constant(undefined), fc.constantFrom('', '5000')),
      'costs.n1.atAge': fc.oneof(fc.constant(undefined), fc.constantFrom('', '59', '65'))
    }, { requiredKeys: [] }).map((r) => Object.fromEntries(Object.entries(r).filter(([, v]) => v !== undefined)));
    const EDITABLE = Object.values(C).filter((p) => !(p.decisionTool.settings && p.decisionTool.settings.locked));
    await fc.assert(fc.asyncProperty(fc.constantFrom(...EDITABLE), anyTyped, fc.boolean(), async (raw, typed, account) => {
      const p = onSpend({ raws: [raw, LOCKED], planId: raw.id, session: account ? 'in' : 'nobody', typed });
      const before = p.session.raw(GUEST_PLANS_KEY);
      p.save(); await tick();
      const c = checkSpend(entryOf(raw).plan, typed, { today: TODAY });
      if (account) {
        for (const w of p.fb.writes) for (const k of Object.keys(w.data)) expect(k === 'lastModified' || SPEND_WRITES.includes(k), k).toBe(true);
        if (!c.ok) expect(p.fb.writes).toEqual([]);
      } else {
        expect(p.fb.writes).toEqual([]);
        const after = JSON.parse(p.session.raw(GUEST_PLANS_KEY));
        expect(JSON.stringify(after[1])).toBe(JSON.stringify(JSON.parse(before)[1]));
        if (!c.ok) expect(p.session.raw(GUEST_PLANS_KEY)).toBe(before);
        else {
          const stripped = (plan) => { const out = copy(plan); for (const path of SPEND_WRITES.concat('lastModified')) { const parts = path.split('.'); let o = out; for (let i = 0; i < parts.length - 1 && o; i++) o = o[parts[i]]; if (o) delete o[parts[parts.length - 1]]; } return JSON.stringify(out); };
          expect(stripped(after[0])).toBe(stripped(JSON.parse(before)[0]));
        }
      }
      p.stop();
    }), { numRuns: 40 });
  });
});

describe('"Your pots and tax" (editing-in-v7.md 9): the same one write, chosen by the step the page is on', () => {
  const LUMPY = C['12-lumpy-db-gia'];
  const onPots = (o) => { const id = o.planId || LUMPY.id; const p = page({ ...o, planId: id }); p.store.dispatch({ type: A.ROUTE_SET, route: parse('#/plan/' + id + '/pots') }); for (const [path, value] of Object.entries(o.typed || {})) p.store.dispatch({ type: A.PLAN_EDIT, planId: id, path, value }); p.store.dispatch({ type: A.PLANS_VIEW, view: viewFor(p.store.getState()) }); return p; };
  it('an account: exactly the changed pots paths plus lastModified (the three pots in the saved proportions, the ISA choice, the charge); the toast line is the step\'s; Undo puts the previous values back', async () => {
    const p = onPots({ raws: [LUMPY, LOCKED], typed: { pension: '500,000', isaGrowth: 'invested', charges: '0.25' } });
    p.save(); await tick();
    expect(p.rereads.length).toBe(1);
    expect(p.fb.writes.length).toBe(1);
    expect(p.fb.writes[0].path).toBe('users/u1/scenarios/' + LUMPY.id);
    const data = p.fb.writes[0].data;
    expect(data).toEqual({ 'stressTool.settings.equityMin': 318182, 'stressTool.settings.bondMin': 136364, 'stressTool.settings.cashTarget': 45454, 'stressTool.settings.isaGrowth': 'invested', 'stressTool.settings.chargesPct': 0.25, lastModified: STAMP });
    for (const k of Object.keys(data)) expect(ALL_WRITES).toContain(k);
    for (const k of Object.keys(data)) if (k !== 'lastModified') expect(POTS_WRITES).toContain(k);
    const ui = p.store.getState().ui;
    expect(ui.toast).toMatchObject({ planId: LUMPY.id, kind: 'saved', line: { id: 'pots', slots: { pension: '£500,000', isa: '£60,000', charges: '0.25' } } });
    expect(ui.toast.previous).toEqual({ 'stressTool.settings.equityMin': 280000, 'stressTool.settings.bondMin': 120000, 'stressTool.settings.cashTarget': 40000, 'stressTool.settings.isaGrowth': 'cash', 'stressTool.settings.chargesPct': 0.5, lastModified: LUMPY.lastModified });
    expect(p.store.getState().draft.plan.id).toBe(null);
    const written = applyPatch(entryOf(LUMPY).plan, data);
    expect(savedPots(written, { today: TODAY }).values).toMatchObject({ pension: 500000, isaGrowth: 'invested', charges: 0.25 });
    p.store.dispatch({ type: A.PLANS_SET, list: [{ plan: written, newer: false, failed: false }], source: 'account', readAt: '14:04' });
    p.undo(); await tick();
    expect(p.fb.writes[1].data).toEqual({ ...ui.toast.previous, lastModified: LUMPY.lastModified });
    expect(p.store.getState().ui.toast).toEqual({ planId: LUMPY.id, kind: 'undone', previous: null, line: null });
  });
  it('the window: the plan folded with the same patch, every other byte the same, the other plan byte-identical; Undo byte for byte', async () => {
    const p = onPots({ raws: [LOCKED, LUMPY], session: 'nobody', typed: { isa: '70,000', taxFree: 'ufpls', ufplsYears: '8', bedAndIsa: 'no', taxMode: 'frozen' } });
    const before = p.session.raw(GUEST_PLANS_KEY);
    p.save(); await tick();
    expect(p.fb.writes).toEqual([]);
    const after = JSON.parse(p.session.raw(GUEST_PLANS_KEY));
    expect(JSON.stringify(after[0])).toBe(JSON.stringify(JSON.parse(before)[0]));
    expect(after[1].stressTool.settings).toMatchObject({ isaBalance: 70000, accessMethod: 'ufpls', ufplsYears: 8, bedAndIsa: false, taxMode: 'frozen' });
    const stripped = (plan) => { const out = copy(plan); for (const path of ALL_WRITES) { const parts = path.split('.'); let o = out; for (let i = 0; i < parts.length - 1 && o; i++) o = o[parts[i]]; if (o) delete o[parts[parts.length - 1]]; } return JSON.stringify(out); };
    expect(stripped(after[1])).toBe(stripped(JSON.parse(before)[1]));
    p.store.dispatch({ type: A.PLANS_SET, list: upgradedList(after, noon(TODAY)), source: 'window', readAt: '14:04' });
    p.undo(); await tick();
    expect(JSON.stringify(JSON.parse(p.session.raw(GUEST_PLANS_KEY))[1])).toBe(JSON.stringify(JSON.parse(before)[1]));
  });
  it('a locked plan is refused by the guard on this step too; a box with a problem writes nothing; nothing typed writes nothing', async () => {
    const locked = onPots({ raws: [LOCKED], planId: LOCKED.id, typed: { pension: '1' } });
    locked.save(); await tick();
    expect(locked.fb.writes).toEqual([]);
    expect(locked.store.getState().ui.saveProblem).toEqual({ planId: LOCKED.id, problem: 'locked' });
    const bad = onPots({ raws: [LUMPY], typed: { charges: '9' } });
    bad.save(); await tick();
    expect(bad.fb.writes).toEqual([]);
    expect(bad.store.getState().ui.saveProblem).toEqual({ planId: LUMPY.id, problem: 'problems' });
    const nothing = onPots({ raws: [LUMPY] });
    nothing.save(); await tick();
    expect(nothing.fb.writes).toEqual([]);
    expect(nothing.store.getState().ui.toast.kind).toBe('unchanged');
  });
  it('property: whatever is typed on the pots step, every path written is declared and on this step\'s list; the window\'s text differs only there', async () => {
    const anyTyped = fc.record({
      pension: fc.oneof(fc.constant(undefined), fc.constantFrom('', '0', '400,000', 'abc')),
      isa: fc.oneof(fc.constant(undefined), fc.constantFrom('', '0', '25,000')),
      isaGrowth: fc.oneof(fc.constant(undefined), fc.constantFrom('cash', 'invested', 'x')),
      isaUse: fc.oneof(fc.constant(undefined), fc.constantFrom('minimiseEarlyTax', 'hold')),
      taxable: fc.oneof(fc.constant(undefined), fc.constantFrom('', '0', '30,000')),
      charges: fc.oneof(fc.constant(undefined), fc.constantFrom('', '0', '0.5', '1.2', '4')),
      pa: fc.oneof(fc.constant(undefined), fc.constantFrom('', '12,570', '10,000')),
      taxFree: fc.oneof(fc.constant(undefined), fc.constantFrom('drawdown', 'ufpls')),
      ufplsYears: fc.oneof(fc.constant(undefined), fc.constantFrom('', '5', '70')),
      bandFill: fc.oneof(fc.constant(undefined), fc.constantFrom('yes', 'no')),
      stopSipp: fc.oneof(fc.constant(undefined), fc.constantFrom('', '300,000'))
    }, { requiredKeys: [] }).map((r) => Object.fromEntries(Object.entries(r).filter(([, v]) => v !== undefined)));
    const EDITABLE = Object.values(C).filter((p) => !(p.decisionTool.settings && p.decisionTool.settings.locked));
    await fc.assert(fc.asyncProperty(fc.constantFrom(...EDITABLE), anyTyped, fc.boolean(), async (raw, typed, account) => {
      const p = onPots({ raws: [raw, LOCKED], planId: raw.id, session: account ? 'in' : 'nobody', typed });
      const before = p.session.raw(GUEST_PLANS_KEY);
      p.save(); await tick();
      const c = checkPots(entryOf(raw).plan, typed, { today: TODAY });
      if (account) {
        for (const w of p.fb.writes) for (const k of Object.keys(w.data)) expect(k === 'lastModified' || POTS_WRITES.includes(k), k).toBe(true);
        if (!c.ok) expect(p.fb.writes).toEqual([]);
      } else {
        expect(p.fb.writes).toEqual([]);
        const after = JSON.parse(p.session.raw(GUEST_PLANS_KEY));
        expect(JSON.stringify(after[1])).toBe(JSON.stringify(JSON.parse(before)[1]));
        if (!c.ok) expect(p.session.raw(GUEST_PLANS_KEY)).toBe(before);
        else {
          const stripped = (plan) => { const out = copy(plan); for (const path of POTS_WRITES.concat('lastModified')) { const parts = path.split('.'); let o = out; for (let i = 0; i < parts.length - 1 && o; i++) o = o[parts[i]]; if (o) delete o[parts[parts.length - 1]]; } return JSON.stringify(out); };
          expect(stripped(after[0])).toBe(stripped(JSON.parse(before)[0]));
        }
      }
      p.stop();
    }), { numRuns: 40 });
  });
});

describe('"Does it last?" (editing-in-v7.md 10): the same one write for the cut and reserve dials, chosen by the step the page is on; the run writes nothing', () => {
  const LUMPY = C['12-lumpy-db-gia'];
  const onLasts = (o) => { const id = o.planId || LUMPY.id; const p = page({ ...o, planId: id }); p.store.dispatch({ type: A.ROUTE_SET, route: parse('#/plan/' + id + '/lasts') }); for (const [path, value] of Object.entries(o.typed || {})) p.store.dispatch({ type: A.PLAN_EDIT, planId: id, path, value }); p.store.dispatch({ type: A.PLANS_VIEW, view: viewFor(p.store.getState()) }); return p; };
  it('an account: exactly the changed lasts paths plus lastModified (the months, the multiplier from the percent); the toast line is the step\'s; Undo puts the previous values back; a held result is never written', async () => {
    const p = onLasts({ raws: [LUMPY, LOCKED], typed: { cutPct: '30', cutAfterMonths: '4', reserveOn: 'yes', reserveAmount: '30,000' } });
    // a result in page memory for this plan, as the runner would file it: nothing of it reaches the write
    p.store.dispatch({ type: A.LASTS_WORKING, key: p.store.getState().plans.view.page.lasts.runKey });
    p.store.dispatch({ type: A.LASTS_DONE, key: p.store.getState().lasts.key, result: { strategyId: 'pots-and-valves', a: { share: 0.9 } } });
    p.save(); await tick();
    expect(p.rereads.length).toBe(1);
    expect(p.fb.writes.length).toBe(1);
    expect(p.fb.writes[0].path).toBe('users/u1/scenarios/' + LUMPY.id);
    const data = p.fb.writes[0].data;
    expect(data).toEqual({ 'stressTool.settings.consecutiveLimit': 4, 'stressTool.settings.protectionMult': 0.7, 'stressTool.settings.hodlEnabled': true, 'stressTool.settings.hodlValue': 30000, lastModified: STAMP });
    for (const k of Object.keys(data)) expect(ALL_WRITES).toContain(k);
    for (const k of Object.keys(data)) if (k !== 'lastModified') expect(LASTS_WRITES).toContain(k);
    const ui = p.store.getState().ui;
    expect(ui.toast).toMatchObject({ planId: LUMPY.id, kind: 'saved', line: { id: 'lasts', slots: { pct: '30', months: '4', reserve: 'a reserve of £30,000' } } });
    expect(ui.toast.previous).toEqual({ 'stressTool.settings.consecutiveLimit': 3, 'stressTool.settings.protectionMult': 0.8, 'stressTool.settings.hodlEnabled': false, 'stressTool.settings.hodlValue': 25000, lastModified: LUMPY.lastModified });
    expect(p.store.getState().draft.plan.id).toBe(null);
    const written = applyPatch(entryOf(LUMPY).plan, data);
    expect(savedLasts(written, { today: TODAY }).values).toMatchObject({ cutPct: 30, cutAfterMonths: 4, reserveOn: 'yes', reserveAmount: 30000 });
    p.store.dispatch({ type: A.PLANS_SET, list: [{ plan: written, newer: false, failed: false }], source: 'account', readAt: '14:04' });
    p.undo(); await tick();
    expect(p.fb.writes[1].data).toEqual({ ...ui.toast.previous, lastModified: LUMPY.lastModified });
    expect(p.store.getState().ui.toast).toEqual({ planId: LUMPY.id, kind: 'undone', previous: null, line: null });
  });
  it('the window: the plan folded with the same patch, every other byte the same, the other plan byte-identical; Undo byte for byte', async () => {
    const p = onLasts({ raws: [LOCKED, LUMPY], session: 'nobody', typed: { cutsOn: 'no', reserveOn: 'yes', reserveAmount: '40,000' } });
    const before = p.session.raw(GUEST_PLANS_KEY);
    p.save(); await tick();
    expect(p.fb.writes).toEqual([]);
    const after = JSON.parse(p.session.raw(GUEST_PLANS_KEY));
    expect(JSON.stringify(after[0])).toBe(JSON.stringify(JSON.parse(before)[0]));
    expect(after[1].stressTool.settings).toMatchObject({ disableProtection: true, hodlEnabled: true, hodlValue: 40000, protectionMult: 0.8, consecutiveLimit: 3 });
    const stripped = (plan) => { const out = copy(plan); for (const path of ALL_WRITES) { const parts = path.split('.'); let o = out; for (let i = 0; i < parts.length - 1 && o; i++) o = o[parts[i]]; if (o) delete o[parts[parts.length - 1]]; } return JSON.stringify(out); };
    expect(stripped(after[1])).toBe(stripped(JSON.parse(before)[1]));
    p.store.dispatch({ type: A.PLANS_SET, list: upgradedList(after, noon(TODAY)), source: 'window', readAt: '14:04' });
    p.undo(); await tick();
    expect(JSON.stringify(JSON.parse(p.session.raw(GUEST_PLANS_KEY))[1])).toBe(JSON.stringify(JSON.parse(before)[1]));
  });
  it('a locked plan is refused by the guard on this step too; a box with a problem writes nothing; nothing typed writes nothing', async () => {
    const locked = onLasts({ raws: [LOCKED], planId: LOCKED.id, typed: { cutPct: '30' } });
    locked.save(); await tick();
    expect(locked.fb.writes).toEqual([]);
    expect(locked.store.getState().ui.saveProblem).toEqual({ planId: LOCKED.id, problem: 'locked' });
    const bad = onLasts({ raws: [LUMPY], typed: { cutPct: '120' } });
    bad.save(); await tick();
    expect(bad.fb.writes).toEqual([]);
    expect(bad.store.getState().ui.saveProblem).toEqual({ planId: LUMPY.id, problem: 'problems' });
    const same = onLasts({ raws: [LUMPY], typed: {} });
    same.save(); await tick();
    expect(same.fb.writes).toEqual([]);
    expect(same.store.getState().ui.toast).toEqual({ planId: LUMPY.id, kind: 'unchanged', previous: null, line: null });
  });
  it('property: whatever is typed on the lasts step, every path written is declared and on this step\'s list; the window\'s text differs only there', async () => {
    const anyTyped = fc.record({
      cutsOn: fc.oneof(fc.constant(undefined), fc.constantFrom('yes', 'no', 'x')),
      cutAfterMonths: fc.oneof(fc.constant(undefined), fc.constantFrom('', '0', '3', '6', '30')),
      cutPct: fc.oneof(fc.constant(undefined), fc.constantFrom('', '0', '20', '35', 'abc', '120')),
      deeperAfterMonths: fc.oneof(fc.constant(undefined), fc.constantFrom('', '0', '12', '99')),
      buffer: fc.oneof(fc.constant(undefined), fc.constantFrom('', '0', '15,000', '20000')),
      reserveOn: fc.oneof(fc.constant(undefined), fc.constantFrom('yes', 'no')),
      reserveAmount: fc.oneof(fc.constant(undefined), fc.constantFrom('', '0', '25,000', '40000'))
    }, { requiredKeys: [] }).map((r) => Object.fromEntries(Object.entries(r).filter(([, v]) => v !== undefined)));
    const EDITABLE = Object.values(C).filter((p) => !(p.decisionTool.settings && p.decisionTool.settings.locked));
    await fc.assert(fc.asyncProperty(fc.constantFrom(...EDITABLE), anyTyped, fc.boolean(), async (raw, typed, account) => {
      const p = onLasts({ raws: [raw, LOCKED], planId: raw.id, session: account ? 'in' : 'nobody', typed });
      const before = p.session.raw(GUEST_PLANS_KEY);
      p.save(); await tick();
      const c = checkLasts(entryOf(raw).plan, typed, { today: TODAY });
      if (account) {
        for (const w of p.fb.writes) for (const k of Object.keys(w.data)) expect(k === 'lastModified' || LASTS_WRITES.includes(k), k).toBe(true);
        if (!c.ok) expect(p.fb.writes).toEqual([]);
      } else {
        expect(p.fb.writes).toEqual([]);
        const after = JSON.parse(p.session.raw(GUEST_PLANS_KEY));
        expect(JSON.stringify(after[1])).toBe(JSON.stringify(JSON.parse(before)[1]));
        if (!c.ok) expect(p.session.raw(GUEST_PLANS_KEY)).toBe(before);
        else {
          const stripped = (plan) => { const out = copy(plan); for (const path of LASTS_WRITES.concat('lastModified')) { const parts = path.split('.'); let o = out; for (let i = 0; i < parts.length - 1 && o; i++) o = o[parts[i]]; if (o) delete o[parts[parts.length - 1]]; } return JSON.stringify(out); };
          expect(stripped(after[0])).toBe(stripped(JSON.parse(before)[0]));
        }
      }
      p.stop();
    }), { numRuns: 40 });
  });
});

describe('property: whatever is typed, every path written is declared, and the plan written reads back as typed', () => {
  const EDITABLE = Object.values(C).filter((p) => !(p.decisionTool.settings && p.decisionTool.settings.locked) && +p.stressTool.settings.currentAge > 0);
  const anyTyped = fc.record({
    age: fc.oneof(fc.constant(undefined), fc.constantFrom('', 'abc', '17', '40', '58', '64', '75')),
    stopped: fc.oneof(fc.constant(undefined), fc.constantFrom('yes', 'age', 'month', 'x')),
    stopAge: fc.oneof(fc.constant(undefined), fc.constantFrom('', '50', '60', '63', '70', '90')),
    stopMonth: fc.oneof(fc.constant(undefined), fc.constantFrom('', '2026-01', '2030-06', 'June 2031', 'soon')),
    startWhen: fc.oneof(fc.constant(undefined), fc.constantFrom('now', 'april', 'saved', 'z')),
    endAge: fc.oneof(fc.constant(undefined), fc.constantFrom('', '60', '80', '93', '95', '100', '111'))
  }, { requiredKeys: [] }).map((r) => Object.fromEntries(Object.entries(r).filter(([, v]) => v !== undefined)));
  it('on the account path and the window path alike', async () => {
    await fc.assert(fc.asyncProperty(fc.constantFrom(...EDITABLE), anyTyped, fc.boolean(), async (raw, typed, account) => {
      const p = page({ raws: [raw, LOCKED], planId: raw.id, session: account ? 'in' : 'nobody', typed });
      const before = p.session.raw(GUEST_PLANS_KEY);
      p.save(); await tick();
      const c = checkAbout(entryOf(raw).plan, typed, { today: TODAY });
      if (account) {
        for (const w of p.fb.writes) for (const k of Object.keys(w.data)) expect(ALL_WRITES).toContain(k);
        if (!c.ok) expect(p.fb.writes).toEqual([]);
        if (p.fb.writes.length) {
          expect(p.fb.writes[0].data.lastModified).toBe(STAMP);
          const after = applyPatch(entryOf(raw).plan, p.fb.writes[0].data);
          const boxes = boxesOf(after, { today: TODAY });
          const want = { ...boxesOf(entryOf(raw).plan, { today: TODAY }), ...typed };
          expect(boxes.age).toBe(want.age);
          expect(boxes.endAge).toBe(want.endAge);
        }
      } else {
        expect(p.fb.writes).toEqual([]);
        const after = JSON.parse(p.session.raw(GUEST_PLANS_KEY));
        expect(JSON.stringify(after[1])).toBe(JSON.stringify(JSON.parse(before)[1]));   // the locked plan, always byte-identical
        if (!c.ok) expect(p.session.raw(GUEST_PLANS_KEY)).toBe(before);
        else {
          // only declared paths differ (strip them from both and compare)
          const stripped = (plan) => { const out = copy(plan); for (const path of ALL_WRITES) { const parts = path.split('.'); let o = out; for (let i = 0; i < parts.length - 1 && o; i++) o = o[parts[i]]; if (o) delete o[parts[parts.length - 1]]; } return JSON.stringify(out); };
          expect(stripped(after[0])).toBe(stripped(JSON.parse(before)[0]));
        }
      }
      p.stop();
    }), { numRuns: 60 });
  });
  it('the declared list is the steps\' and the stamp, nothing more (the record and the tick-offs each one field since step 10; the plan menu\'s name and main flag since step 11)', () => {
    expect(ALL_WRITES.length).toBe(new Set([...ABOUT_WRITES, ...INCOME_WRITES, ...SPEND_WRITES, ...POTS_WRITES, ...LASTS_WRITES, ...LOCK_WRITES, ...UNLOCK_WRITES, ...DOCUMENT_WRITES, ...WAY_WRITES, ...MIX_WRITES, ...HOUSEHOLD_WRITES, 'holdings', 'transition', ...PLANS_WRITES, 'lastModified']).size);
    expect(new Set(ALL_WRITES).size).toBe(ALL_WRITES.length);
  });
});


// ---- "Lock the plan" (research/v7/road-to-7.md step 6): the same one write, three more kinds ------------------------------

/** The run every lock shares, once per plan: what the worker would send back (lastsRun.js runForDocument on the plan as read). */
const runs = new Map();
const runOf = (plan) => { const k = String(plan.id); if (!runs.has(k)) runs.set(k, runForDocument(plan, { today: TODAY })); return runs.get(k); };
/** A fake worker client: the real run in Node, as the worker would hand it back; records what it was asked. */
function fakeClient({ reject = null } = {}) {
  const asked = [];
  return { asked, document: (plan, env) => { asked.push({ id: plan.id, env }); if (reject) return Promise.reject(reject); return Promise.resolve(runOf(plan)); } };
}
const planOf = (raw) => upgradeScenario(raw, { now: noon(TODAY) }).scenario;
const stripOf = (plan, paths) => { const out = copy(plan); for (const path of paths) { const parts = path.split('.'); let o = out; for (let i = 0; i < parts.length - 1 && o; i++) o = o[parts[i]]; if (o) delete o[parts[parts.length - 1]]; } return JSON.stringify(out); };

describe('the lock (road-to-7.md step 6): the run in the worker, then ONE write of the declared paths, past the guard; the page moves to "Your plan as locked"; Undo is the exact reverse', { timeout: 120_000 }, () => {
  const DRAFT = C['02-pnv-draft'];
  it('an account: the client is asked once with the date and the budget\'s essentials; one updateDoc of exactly lockPatch\'s paths plus lastModified; plan/saved with op lock and the moment; plans/reading; the route is the plan step', async () => {
    const client = fakeClient();
    const p = page({ raws: [DRAFT, LOCKED], planId: DRAFT.id, step: 'lock', client });
    const actions = [];
    p.store.subscribe((s, a) => actions.push(a.type));
    p.lock(); await tick(12);
    expect(client.asked).toEqual([{ id: DRAFT.id, env: { today: TODAY, essentials: 0 } }]);
    expect(p.rereads.length, 'read again before the write').toBe(1);
    expect(p.fb.writes.length).toBe(1);
    expect(p.fb.writes[0].path).toBe('users/u1/scenarios/' + DRAFT.id);
    const data = p.fb.writes[0].data;
    const want = lockPatch(planOf(DRAFT), { now: new Date(STAMP), run: runOf(planOf(DRAFT)), entries: [] });
    expect(data).toEqual({ ...want.patch, lastModified: STAMP });
    for (const k of Object.keys(data)) expect(k === 'lastModified' || LOCK_WRITES.includes(k), k).toBe(true);
    for (const k of LOCK_FLAG_WRITES) expect(data).toHaveProperty(k);
    expect(data['decisionTool.settings.lockedBy']).toBe(LOCKED_BY);
    expect(data.planDocument.version).toBe(3);
    expect(actions).toContain(A.PLAN_SAVED);
    expect(actions).toContain(A.PLANS_READING);
    expect(actions).toContain(A.ROUTE_SET);
    expect(p.store.getState().route).toEqual({ screen: 'plan', q: null, step: 'plan', planId: DRAFT.id, focus: null });
    const ui = p.store.getState().ui;
    expect(ui.saving).toBe(null);
    expect(ui.toast).toMatchObject({ planId: DRAFT.id, kind: 'saved', op: 'lock', lockedAt: STAMP, line: { id: 'locked', slots: { date: '2 October 2026' } } });
    expect(ui.toast.previous).toEqual({ ...want.previous, lastModified: DRAFT.lastModified });
    expect(p.session.calls.filter(([c]) => c === 'setItem')).toEqual([]);
    // Undo, on the plan as now stored (locked by this page at that moment): one more updateDoc of the reversal, absent keys as null
    const written = applyPatch(planOf(DRAFT), data);
    expect(isLockedSettings(written.decisionTool.settings)).toBe(true);
    p.store.dispatch({ type: A.PLANS_SET, list: [{ plan: written, newer: false, failed: false }], source: 'account', readAt: '14:04' });
    p.undo(); await tick(12);
    expect(p.fb.writes.length).toBe(2);
    const back = p.fb.writes[1].data;
    for (const k of Object.keys(back)) expect(k === 'lastModified' || LOCK_WRITES.includes(k), k).toBe(true);
    expect(back['decisionTool.settings.locked']).toBe(want.previous['decisionTool.settings.locked'] === undefined ? null : want.previous['decisionTool.settings.locked']);
    expect(back['decisionTool.settings.lockedAt']).toBe(null);
    expect(back['decisionTool.settings.lockedBy']).toBe(null);
    expect(back.planDocument).toBe(null);
    expect(back['decisionTool.planOfRecord']).toBe(null);
    expect(back.lastModified).toBe(DRAFT.lastModified);
    expect(p.store.getState().ui.toast).toEqual({ planId: DRAFT.id, kind: 'undone', previous: null, line: null, op: 'lock' });
    p.stop();
  });
  it('without an account: the window\'s plan folded with the same patch, the other plan byte-identical, the text otherwise identical; Undo byte for byte, the keys the plan did not have deleted', async () => {
    const client = fakeClient();
    const p = page({ raws: [LOCKED, DRAFT], planId: DRAFT.id, step: 'lock', session: 'nobody', client });
    const before = p.session.raw(GUEST_PLANS_KEY);
    p.lock(); await tick(12);
    expect(p.fb.writes).toEqual([]);
    expect(p.rereads).toEqual([]);
    const after = JSON.parse(p.session.raw(GUEST_PLANS_KEY));
    expect(JSON.stringify(after[0])).toBe(JSON.stringify(JSON.parse(before)[0]));
    expect(after[1].decisionTool.settings.locked).toBe(true);
    expect(after[1].decisionTool.settings.lockedBy).toBe(LOCKED_BY);
    expect(after[1].planDocument.lockedAt).toBe(STAMP);
    expect(after[1].decisionTool.planOfRecord.savedAt).toBe(STAMP);
    expect(stripOf(after[1], [...LOCK_WRITES, 'lastModified'])).toBe(stripOf(JSON.parse(before)[1], [...LOCK_WRITES, 'lastModified']));
    expect(p.session.calls.filter(([c]) => c === 'setItem').map(([, k]) => k)).toEqual([GUEST_PLANS_KEY]);
    expect(p.store.getState().route.step).toBe('plan');
    p.store.dispatch({ type: A.PLANS_SET, list: upgradedList(after, noon(TODAY)), source: 'window', readAt: '14:04' });
    p.undo(); await tick(12);
    expect(JSON.stringify(JSON.parse(p.session.raw(GUEST_PLANS_KEY))[1])).toBe(JSON.stringify(JSON.parse(before)[1]));
    expect(JSON.stringify(JSON.parse(p.session.raw(GUEST_PLANS_KEY))[0])).toBe(JSON.stringify(JSON.parse(before)[0]));
    p.stop();
  });
  it('refused, nothing written: a locked plan; no client; a client with no worker; a run that fails; the free time used up; a plan shown as saved; a plan locked elsewhere since the page opened', async () => {
    const locked = page({ raws: [LOCKED], planId: LOCKED.id, step: 'lock', client: fakeClient() });
    locked.lock(); await tick(12);
    expect(locked.fb.writes).toEqual([]);
    expect(locked.store.getState().ui.saveProblem).toEqual({ planId: LOCKED.id, problem: 'locked' });
    const none = page({ raws: [DRAFT], planId: DRAFT.id, step: 'lock', client: null });
    none.lock(); await tick(12);
    expect(none.fb.writes).toEqual([]);
    expect(none.store.getState().ui.saveProblem.problem).toBe('noWorker');
    const noWorker = page({ raws: [DRAFT], planId: DRAFT.id, step: 'lock', client: fakeClient({ reject: Object.assign(new Error('none'), { code: NO_WORKER }) }) });
    noWorker.lock(); await tick(12);
    expect(noWorker.store.getState().ui.saveProblem.problem).toBe('noWorker');
    const broken = page({ raws: [DRAFT], planId: DRAFT.id, step: 'lock', client: fakeClient({ reject: new Error('boom') }) });
    broken.lock(); await tick(12);
    expect(broken.fb.writes).toEqual([]);
    expect(broken.store.getState().ui.saveProblem.problem).toBe('failed');
    const used = page({ raws: [DRAFT], planId: DRAFT.id, step: 'lock', session: 'nobody', client: fakeClient(), local: storage({ [KEY_MINUTES]: '180' }) });
    const before = used.session.raw(GUEST_PLANS_KEY);
    used.lock(); await tick(12);
    expect(used.session.raw(GUEST_PLANS_KEY)).toBe(before);
    expect(used.store.getState().ui.saveProblem.problem).toBe('usedUp');
    const newer = page({ raws: [{ ...copy(DRAFT), schemaVersion: 999 }], planId: DRAFT.id, step: 'lock', client: fakeClient() });
    newer.lock(); await tick(12);
    expect(newer.store.getState().ui.saveProblem.problem).toBe('readonly');
    const lockedNow = copy(DRAFT);
    lockedNow.decisionTool.settings = { ...lockedNow.decisionTool.settings, locked: true, lockedAt: '2026-10-02T13:00:00.000Z', lockedBy: 'locked from Stress settings' };
    const elsewhere = page({ raws: [DRAFT], planId: DRAFT.id, step: 'lock', client: fakeClient(), rereadList: [lockedNow] });
    elsewhere.lock(); await tick(12);
    expect(elsewhere.fb.writes).toEqual([]);
    expect(elsewhere.store.getState().ui.saveProblem.problem).toBe('locked');
  });
  it('an undo claiming to reverse a lock is refused unless the stored plan is locked by this page at that very moment', async () => {
    // locked elsewhere (another label): the reversal is not this page's
    const lockedElsewhere = copy(DRAFT);
    lockedElsewhere.decisionTool.settings = { ...lockedElsewhere.decisionTool.settings, locked: true, lockedAt: STAMP, lockedBy: 'locked from Stress settings' };
    const p = page({ raws: [lockedElsewhere], planId: DRAFT.id, step: 'plan', client: fakeClient() });
    p.store.dispatch({ type: A.PLAN_SAVED, planId: DRAFT.id, previous: { 'decisionTool.settings.locked': false, 'decisionTool.settings.lockedAt': undefined, 'decisionTool.settings.lockedBy': undefined, planDocument: undefined }, line: null, op: 'lock', lockedAt: STAMP });
    p.undo(); await tick(12);
    expect(p.fb.writes).toEqual([]);
    expect(p.store.getState().ui.saveProblem.problem).toBe('locked');
    // locked by the preview, but at another moment
    const other = copy(lockedElsewhere);
    other.decisionTool.settings.lockedBy = LOCKED_BY; other.decisionTool.settings.lockedAt = '2026-10-02T13:00:00.000Z';
    const q = page({ raws: [other], planId: DRAFT.id, step: 'plan', client: fakeClient() });
    q.store.dispatch({ type: A.PLAN_SAVED, planId: DRAFT.id, previous: { 'decisionTool.settings.locked': false, 'decisionTool.settings.lockedAt': undefined, 'decisionTool.settings.lockedBy': undefined, planDocument: undefined }, line: null, op: 'lock', lockedAt: STAMP });
    q.undo(); await tick(12);
    expect(q.fb.writes).toEqual([]);
    expect(q.store.getState().ui.saveProblem.problem).toBe('locked');
    // the reversal carrying a setting of its own is refused
    const mine = copy(other); mine.decisionTool.settings.lockedAt = STAMP;
    const r = page({ raws: [mine], planId: DRAFT.id, step: 'plan', client: fakeClient() });
    r.store.dispatch({ type: A.PLAN_SAVED, planId: DRAFT.id, previous: { 'decisionTool.settings.locked': false, 'decisionTool.settings.lockedAt': undefined, 'decisionTool.settings.lockedBy': undefined, planDocument: undefined, 'stressTool.settings.duration': 30 }, line: null, op: 'lock', lockedAt: STAMP });
    r.undo(); await tick(12);
    expect(r.fb.writes).toEqual([]);
    expect(r.store.getState().ui.saveProblem.problem).toBe('locked');
  });
});

describe('the unlock and the new version (road-to-7.md step 6): one write each to a locked plan, the guard\'s own allowance', { timeout: 120_000 }, () => {
  const BUCKETS = C['04-buckets-running'];
  it('the unlock on an account: exactly unlockPatch\'s paths plus lastModified; the toast with op unlock; Undo re-locks the now-unlocked plan with the document back', async () => {
    const p = page({ raws: [BUCKETS], planId: BUCKETS.id, step: 'plan' });
    p.unlock(); await tick(12);
    expect(p.rereads.length).toBe(1);
    expect(p.fb.writes.length).toBe(1);
    const data = p.fb.writes[0].data;
    const want = unlockPatch(planOf(BUCKETS), { now: new Date(STAMP) });
    expect(data).toEqual({ ...want.patch, lastModified: STAMP });
    for (const k of Object.keys(data)) expect(k === 'lastModified' || UNLOCK_WRITES.includes(k), k).toBe(true);
    expect(data['decisionTool.settings.locked']).toBe(false);
    expect(data.planDocument).toBe(null);
    expect(data.planDocumentArchive[data.planDocumentArchive.length - 1].archivedAt).toBe(STAMP);
    expect(p.store.getState().ui.toast).toMatchObject({ planId: BUCKETS.id, kind: 'saved', op: 'unlock', line: { id: 'unlocked' } });
    const written = applyPatch(planOf(BUCKETS), data);
    expect(isLockedSettings(written.decisionTool.settings)).toBe(false);
    p.store.dispatch({ type: A.PLANS_SET, list: [{ plan: written, newer: false, failed: false }], source: 'account', readAt: '14:04' });
    p.undo(); await tick(12);
    expect(p.fb.writes.length).toBe(2);
    expect(p.fb.writes[1].data['decisionTool.settings.locked']).toBe(true);
    expect(p.fb.writes[1].data.planDocument).toEqual(planOf(BUCKETS).planDocument);
    expect(p.store.getState().ui.toast).toEqual({ planId: BUCKETS.id, kind: 'undone', previous: null, line: null, op: 'unlock' });
    p.stop();
  });
  it('the unlock without an account: the text differs only in the declared keys; the other plan byte-identical; refused on an unlocked plan (notLocked)', async () => {
    const DRAFT = C['02-pnv-draft'];
    const p = page({ raws: [DRAFT, BUCKETS], planId: BUCKETS.id, step: 'plan', session: 'nobody' });
    const before = p.session.raw(GUEST_PLANS_KEY);
    p.unlock(); await tick(12);
    expect(p.fb.writes).toEqual([]);
    const after = JSON.parse(p.session.raw(GUEST_PLANS_KEY));
    expect(JSON.stringify(after[0])).toBe(JSON.stringify(JSON.parse(before)[0]));
    expect(after[1].decisionTool.settings.locked).toBe(false);
    expect(after[1].decisionTool.settings.unlockCount).toBe((+BUCKETS.decisionTool.settings.unlockCount || 0) + 1);
    expect(after[1].planDocument).toBe(null);
    expect(stripOf(after[1], [...UNLOCK_WRITES, 'lastModified'])).toBe(stripOf(JSON.parse(before)[1], [...UNLOCK_WRITES, 'lastModified']));
    const draft = page({ raws: [DRAFT], planId: DRAFT.id, step: 'plan' });
    draft.unlock(); await tick(12);
    expect(draft.fb.writes).toEqual([]);
    expect(draft.store.getState().ui.saveProblem.problem).toBe('notLocked');
  });
  it('a new version on an account: the client asked, exactly documentPatch\'s paths plus lastModified, the settings untouched; Undo puts the old document back; refused on an unlocked plan and without a worker', async () => {
    const client = fakeClient();
    const p = page({ raws: [BUCKETS], planId: BUCKETS.id, step: 'plan', client });
    p.newVersion(); await tick(12);
    expect(client.asked.length).toBe(1);
    expect(p.fb.writes.length).toBe(1);
    const data = p.fb.writes[0].data;
    const want = documentPatch(planOf(BUCKETS), { now: new Date(STAMP), run: runOf(planOf(BUCKETS)), entries: [] });
    expect(data).toEqual({ ...want.patch, lastModified: STAMP });
    expect(Object.keys(data).sort()).toEqual([...DOCUMENT_WRITES, 'lastModified'].sort());
    expect(data.planDocument.note).toBe('document refreshed');
    expect(data.planDocument.lockedAt).toBe(BUCKETS.decisionTool.settings.lockedAt);
    expect(p.store.getState().ui.toast).toMatchObject({ kind: 'saved', op: 'document', line: { id: 'newVersion' } });
    const written = applyPatch(planOf(BUCKETS), data);
    expect(written.decisionTool.settings).toEqual(planOf(BUCKETS).decisionTool.settings);
    p.store.dispatch({ type: A.PLANS_SET, list: [{ plan: written, newer: false, failed: false }], source: 'account', readAt: '14:04' });
    p.undo(); await tick(12);
    expect(p.fb.writes[1].data.planDocument).toEqual(planOf(BUCKETS).planDocument);
    expect(p.fb.writes[1].data.planDocumentArchive).toEqual(planOf(BUCKETS).planDocumentArchive === undefined ? null : planOf(BUCKETS).planDocumentArchive);
    const DRAFT = C['02-pnv-draft'];
    const draft = page({ raws: [DRAFT], planId: DRAFT.id, step: 'plan', client: fakeClient() });
    draft.newVersion(); await tick(12);
    expect(draft.fb.writes).toEqual([]);
    expect(draft.store.getState().ui.saveProblem.problem).toBe('notLocked');
    const none = page({ raws: [BUCKETS], planId: BUCKETS.id, step: 'plan', client: null });
    none.newVersion(); await tick(12);
    expect(none.fb.writes).toEqual([]);
    expect(none.store.getState().ui.saveProblem.problem).toBe('noWorker');
    p.stop();
  });
  it('property: over every unlocked corpus plan, on the account path and the window path, the lock writes only the declared paths; the other plan in the window is byte-identical; the text differs nowhere else', async () => {
    const EDITABLE = Object.values(C).filter((p) => !(p.decisionTool.settings && p.decisionTool.settings.locked));
    await fc.assert(fc.asyncProperty(fc.constantFrom(...EDITABLE), fc.boolean(), async (raw, account) => {
      const p = page({ raws: [raw, LOCKED], planId: raw.id, step: 'lock', session: account ? 'in' : 'nobody', client: fakeClient() });
      const before = p.session.raw(GUEST_PLANS_KEY);
      p.lock(); await tick(12);
      if (account) {
        expect(p.fb.writes.length).toBe(1);
        for (const k of Object.keys(p.fb.writes[0].data)) expect(k === 'lastModified' || LOCK_WRITES.includes(k), k).toBe(true);
      } else {
        expect(p.fb.writes).toEqual([]);
        const after = JSON.parse(p.session.raw(GUEST_PLANS_KEY));
        expect(JSON.stringify(after[1])).toBe(JSON.stringify(JSON.parse(before)[1]));
        expect(after[0].decisionTool.settings.locked).toBe(true);
        expect(stripOf(after[0], [...LOCK_WRITES, 'lastModified'])).toBe(stripOf(JSON.parse(before)[0], [...LOCK_WRITES, 'lastModified']));
      }
      p.stop();
    }), { numRuns: 24 });
  });
});
