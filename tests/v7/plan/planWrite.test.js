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
import { ALL_WRITES, ABOUT_WRITES, INCOME_WRITES } from '../../../src/answers/plan/schema.js';
import { applyPatch, boxesOf, checkAbout } from '../../../src/answers/plan/about.js';
import { checkIncome } from '../../../src/answers/plan/income.js';
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
function page({ raws, planId, session = 'in', typed = {}, local = storage(), sessionStore = null, fb = fakeLite(), rereadList = null, win = null }) {
  const store = createStore(initialState({ today: TODAY, build: 'test' }), reduce);
  store.dispatch({ type: A.ROUTE_SET, route: parse('#/plan/' + planId + '/about') });
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
  const stop = startPlanWrite(store, { win, session: sess, local, now: () => new Date(TODAY + 'T14:03:00.000Z'), fb, handles });
  // the plan source's own reading after every change (the page does this itself; the tests keep it in step by hand)
  store.subscribe((state) => { if (state.plans && state.plans.status === 'read' && !state.plans.view) store.dispatch({ type: A.PLANS_VIEW, view: viewFor(state) }); });
  return { store, fb, session: sess, local, rereads, stop, save: () => store.dispatch({ type: A.PLAN_SAVE, planId }), undo: () => store.dispatch({ type: A.PLAN_UNDO, planId }) };
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
  it('the declared list is the two steps\' and the stamp, nothing more', () => {
    expect(ALL_WRITES.length).toBe(ABOUT_WRITES.length + INCOME_WRITES.length + 1);
    expect(new Set(ALL_WRITES).size).toBe(ALL_WRITES.length);
  });
});
