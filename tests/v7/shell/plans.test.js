/**
 * The plan menu on "Your plans" (research/v7/road-to-7.md step 11): every write through the one write file, with fakes
 * so every call is seen — Rename (one updateDoc of the name made unique; the window's text with every other plan byte-identical;
 * a name empty or too long refused by the reducer; the example refused), Make a copy (the planner's rules lifted into
 * services/PlanCopy.js: as it is, or with the records and then locked; through the one addDoc; the window's three), Make this
 * my main plan (two writes of `isActive` alone; one setItem), Download this plan (the file is planExportJson, named by
 * planExportFileName, nothing else touched), Open a downloaded copy (a good file, a hostile one with its id, uid, example and
 * isActive stripped, bad JSON said in words, a plan with a problem refused, nothing partial), Delete (the confirm the reducer
 * insists on; the last plan refused; the example deletable; the main plan handed to another first; the ONE deleteDoc of the
 * right path; the window's list without it), "Look around an example" (the planner's demo plan, read-only in the window,
 * an ordinary plan in an account); a property over random windows and actions; the screen's own drawing.
 */
import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { h, render } from 'preact';
import { App } from '../../../src/v7/App.jsx';
import { startPlanWrite, GUEST_PLANS_KEY, OPENED_SUFFIX } from '../../../src/v7/effects/planWrite.js';
import { startDownloads } from '../../../src/v7/effects/download.js';
import { upgradedList, viewFor } from '../../../src/v7/effects/planSource.js';
import { createStore } from '../../../src/v7/effects/store.js';
import { initialState } from '../../../src/v7/state/initial.js';
import { reduce } from '../../../src/v7/state/reduce.js';
import { A } from '../../../src/v7/state/actions.js';
import { parse } from '../../../src/v7/router/routes.js';
import { plansMenuView } from '../../../src/v7/state/select.js';
import { copyOf, hasRecords } from '../../../src/services/PlanCopy.js';
import { planExportJson, planExportFileName, stripIdentity } from '../../../src/services/PlanExport.js';
import { planProblems } from '../../../src/answers/keep/planCreate.js';
import { upgradeScenario } from '../../../src/firebase/scenarioMigration.js';
import { DEMO_PLANS, EXAMPLE_PLAN_KEY, GUEST_MAX_PLANS, guestOwnPlans } from '../../../src/services/GuestPlans.js';
import { KEY_MINUTES, GUEST_ALLOWANCE_MINUTES } from '../../../src/services/GuestMeter.js';
import { ALL_WRITES, PLANS_WRITES } from '../../../src/answers/plan/schema.js';
import { visibleText, bannedHits } from '../render/checkScreen.js';
import { PLAN } from '../../../src/v7/copy/plan.js';
import { corpus } from '../plan/_plans.js';

const C = corpus();
const TODAY = '2026-10-02';
const NOW = new Date('2026-10-02T14:03:00.000Z');
const tick = async (n = 8) => { for (let i = 0; i < n; i++) await new Promise((r) => setTimeout(r, 0)); };
const copy = (v) => JSON.parse(JSON.stringify(v));
const seededRand = (seed = 7) => () => { seed = (seed * 48271) % 2147483647; return (seed - 1) / 2147483646; };
const nameOf = (p) => (p.planDetails && p.planDetails.name) || p.name || '';

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
/** The fake firestore/lite: every call recorded; `fail` makes a named call reject. */
function fakeLite({ fail = null } = {}) {
  const writes = [], adds = [], deletes = [];
  return {
    writes, adds, deletes,
    doc: (db, ...path) => ({ db, path: path.join('/') }),
    collection: (db, ...path) => ({ db, path: path.join('/') }),
    updateDoc: (ref, data) => { if (fail === 'updateDoc') return Promise.reject(new Error('offline')); writes.push({ path: ref.path, data: copy(data) }); return Promise.resolve(); },
    addDoc: (coll, data) => { if (fail === 'addDoc') return Promise.reject(new Error('offline')); adds.push({ path: coll.path, data: copy(data) }); return Promise.resolve({ id: 'New' + adds.length + 'PlanId' }); },
    deleteDoc: (ref) => { if (fail === 'deleteDoc') return Promise.reject(new Error('offline')); deletes.push(ref.path); return Promise.resolve(); }
  };
}
/** A window that records what was offered to save. */
function fakeWin() {
  const saved = [];
  const win = {
    saved,
    Blob: class { constructor(parts, opts) { this.text = parts.join(''); this.type = opts && opts.type; } },
    URL: { createObjectURL: (b) => 'blob:' + b.text.length, revokeObjectURL: () => {} },
    document: { body: { appendChild: () => {} }, createElement: () => { const a = { attrs: {}, click() { saved.push({ name: a.download, text: win.lastBlob.text }); }, remove() {} }; return a; } },
    setTimeout: (fn) => fn(), clearTimeout: () => {}
  };
  const RealBlob = win.Blob;
  win.Blob = class extends RealBlob { constructor(parts, opts) { super(parts, opts); win.lastBlob = this; } };
  return win;
}

/** A page on "Your plans" with the plans read: signed in ('in', source 'account') or nobody ('nobody', the window's text). */
function page({ raws, session = 'in', local = storage(), sess = null, fb = fakeLite(), rereadList = null, win = null }) {
  const store = createStore(initialState({ today: TODAY, build: 'test' }), reduce);
  store.dispatch({ type: A.ROUTE_SET, route: parse('#/plans') });
  store.dispatch({ type: A.SESSION_SET, session: { kind: session, email: session === 'in' ? 'a@b.c' : null } });
  const source = session === 'in' ? 'account' : 'window';
  store.dispatch({ type: A.PLANS_SET, list: upgradedList(raws, NOW), source, readAt: '14:03' });
  store.dispatch({ type: A.PLANS_VIEW, view: viewFor(store.getState()) });
  const rereads = [];
  const user = session === 'in' ? { uid: 'u1', email: 'a@b.c', emailVerified: true } : null;
  const handles = () => ({ auth: {}, db: session === 'in' ? { name: 'db' } : null, user, reread: () => { rereads.push(1); if (rereadList) store.dispatch({ type: A.PLANS_SET, list: upgradedList(rereadList, NOW), source: 'account', readAt: '14:04' }); return Promise.resolve(); } });
  const sessionStore = sess || storage(session === 'in' ? {} : { [GUEST_PLANS_KEY]: JSON.stringify(raws) });
  const actions = [];
  store.subscribe((s, a) => { actions.push(a); if (s.plans && s.plans.status === 'read' && !s.plans.view) store.dispatch({ type: A.PLANS_VIEW, view: viewFor(s) }); });
  const stops = [startPlanWrite(store, { win, session: sessionStore, local, now: () => NOW, fb, client: null, handles, rand: seededRand() })];
  if (win) stops.push(startDownloads(store, { win, now: () => NOW }));
  return { store, fb, session: sessionStore, local, rereads, actions, stop: () => stops.forEach((s) => s()),
    types: () => actions.map((a) => a.type), problem: () => store.getState().ui.saveProblem, toast: () => store.getState().ui.toast };
}
const stored = (p) => JSON.parse(p.session.raw(GUEST_PLANS_KEY));

const DRAFT = C['02-pnv-draft'];           // unlocked, active
const LADDER = C['03-gilt-ladder-runup'];  // locked, records
const FRESH = C['01-fresh-default'];
const LUMPY = C['12-lumpy-db-gia'];
const EXAMPLE = { ...copy(C['11-guest-demo']), id: 'guest-example1', example: true, isActive: false };
const notActive = (p) => ({ ...copy(p), isActive: false });

describe('Rename: one write of the name made unique, plus the stamp; the window\'s text with every other plan byte-identical', () => {
  it('an account: ONE updateDoc of planDetails.name and lastModified, the name made unique against the other names; then the toast and the plans read again', async () => {
    const p = page({ raws: [DRAFT, notActive(FRESH)] });
    p.store.dispatch({ type: A.PLAN_ACTION, planId: DRAFT.id, kind: 'rename', text: nameOf(DRAFT) });
    expect(p.store.getState().ui.action).toEqual({ planId: DRAFT.id, kind: 'rename', step: 1, text: nameOf(DRAFT) });
    p.store.dispatch({ type: A.PLAN_ACTION_TEXT, value: '  My Plan ' });     // the other plan's name, with spaces
    p.store.dispatch({ type: A.PLAN_RENAME, planId: DRAFT.id, name: p.store.getState().ui.action.text });
    expect(p.store.getState().ui.action).toBe(null);
    await tick();
    expect(p.rereads.length).toBe(1);
    expect(p.fb.writes).toEqual([{ path: 'users/u1/scenarios/' + DRAFT.id, data: { 'planDetails.name': 'My Plan (2)', lastModified: NOW.toISOString() } }]);
    for (const k of Object.keys(p.fb.writes[0].data)) expect(ALL_WRITES).toContain(k);
    expect(p.toast()).toEqual({ planId: DRAFT.id, kind: 'done', previous: null, line: null, op: 'renamed', slots: { name: 'My Plan (2)' } });
    expect(p.types()).toContain(A.PLANS_READING);
    expect(p.session.calls.filter(([c]) => c === 'setItem')).toEqual([]);
    p.stop();
  });
  it('this window: the name folded onto the one plan, one setItem, the other plan byte-identical; the same name again writes nothing', async () => {
    const p = page({ raws: [DRAFT, notActive(FRESH)], session: 'nobody' });
    const before = stored(p);
    p.store.dispatch({ type: A.PLAN_RENAME, planId: DRAFT.id, name: 'Alex’s plan' });
    await tick();
    expect(p.fb.writes).toEqual([]);
    expect(p.session.calls.filter(([c]) => c === 'setItem').length).toBe(1);
    const after = stored(p);
    expect(after[0].planDetails.name).toBe('Alex’s plan');
    expect(after[0].lastModified).toBe(NOW.toISOString());
    expect(JSON.stringify(after[1])).toBe(JSON.stringify(before[1]));
    const { planDetails, lastModified, ...restAfter } = after[0]; const { planDetails: pd0, lastModified: lm0, ...restBefore } = before[0];
    void planDetails; void lastModified; void pd0; void lm0;
    expect(JSON.stringify(restAfter)).toBe(JSON.stringify(restBefore));
    p.store.dispatch({ type: A.PLAN_TOAST_CLOSE });
    p.store.dispatch({ type: A.PLANS_SET, list: upgradedList(after, NOW), source: 'window', readAt: '14:04' });   // as the plan source reads again
    p.store.dispatch({ type: A.PLAN_RENAME, planId: DRAFT.id, name: 'Alex’s plan' });
    await tick();
    expect(p.session.calls.filter(([c]) => c === 'setItem').length).toBe(1);
    expect(p.toast().op).toBe('renamed');
    p.stop();
  });
  it('a name empty or over 60 characters is refused by the reducer, in words, and nothing is written; the example plan is refused by the writer; a locked plan may be renamed (its name is outside the lock)', async () => {
    const p = page({ raws: [DRAFT, EXAMPLE, LADDER], session: 'nobody' });
    const before = p.session.raw(GUEST_PLANS_KEY);
    p.store.dispatch({ type: A.PLAN_RENAME, planId: DRAFT.id, name: '   ' });
    expect(p.problem()).toEqual({ planId: DRAFT.id, problem: 'empty' });
    expect(p.store.getState().ui.saving).toBe(null);
    p.store.dispatch({ type: A.PLAN_RENAME, planId: DRAFT.id, name: 'x'.repeat(61) });
    expect(p.problem()).toEqual({ planId: DRAFT.id, problem: 'tooLong' });
    p.store.dispatch({ type: A.PLAN_RENAME, planId: EXAMPLE.id, name: 'Mine now' });
    await tick();
    expect(p.problem()).toEqual({ planId: EXAMPLE.id, problem: 'example' });
    expect(p.session.raw(GUEST_PLANS_KEY)).toBe(before);
    p.store.dispatch({ type: A.PLAN_RENAME, planId: LADDER.id, name: 'Sam’s ladder' });
    await tick();
    expect(stored(p).find((x) => x.id === LADDER.id).planDetails.name).toBe('Sam’s ladder');
    expect(stored(p).find((x) => x.id === LADDER.id).decisionTool.settings.locked).toBe(true);
    p.stop();
  });
});

describe('Make a copy: the planner\'s rules (services/PlanCopy.js) through the one create', () => {
  it('as it is: ONE addDoc of the copy — named "{name} (copy)", never the main plan, unlocked, no document; the original untouched', async () => {
    const p = page({ raws: [DRAFT, notActive(LADDER)] });
    p.store.dispatch({ type: A.PLAN_COPY, planId: DRAFT.id, carry: false });
    await tick();
    expect(p.fb.writes).toEqual([]);
    expect(p.fb.deletes).toEqual([]);
    expect(p.fb.adds.length).toBe(1);
    expect(p.fb.adds[0].path).toBe('users/u1/scenarios');
    const w = p.fb.adds[0].data;
    const want = upgradeScenario({ ...copyOf(upgradeScenario(DRAFT, { now: NOW }).scenario, 'Draft — Pots & Valves (copy)', { carryHistory: false, now: NOW }), createdAt: NOW.toISOString(), lastModified: NOW.toISOString() }, { now: NOW }).scenario;
    expect(w).toEqual(want);
    expect(w.planDetails.name).toBe('Draft — Pots & Valves (copy)');
    expect(w.isActive).toBe(false);
    expect(w.decisionTool.settings.locked).toBe(false);
    expect(w.decisionTool.history).toEqual([]);
    expect('planDocument' in w).toBe(false);
    expect('id' in w).toBe(false);
    expect(planProblems(w)).toEqual([]);
    expect(p.toast()).toMatchObject({ kind: 'done', op: 'copied', slots: { name: 'Draft — Pots & Valves (copy)', id: 'New1PlanId' } });
    p.stop();
  });
  it('"as it is" on a plan with a tax year set up: the planner\'s own rule counts the set-up year as a record, so the copy is still locked (the history emptied, the document dropped) — the toast says so', async () => {
    const p = page({ raws: [LADDER] });
    p.store.dispatch({ type: A.PLAN_COPY, planId: LADDER.id, carry: false });
    await tick();
    const w = p.fb.adds[0].data;
    expect(w.decisionTool.history).toEqual([]);
    expect(Object.values(w.decisionTool.taxYears).some((t) => t && t.yearSetupComplete)).toBe(true);
    expect(w.decisionTool.settings.locked).toBe(true);
    expect('planDocument' in w).toBe(false);
    expect(p.toast().op).toBe('copiedLocked');
    p.stop();
  });
  it('with the records: the copy is locked from the start ("copied with records"), the history carried, the document not; the toast says so', async () => {
    const p = page({ raws: [LADDER] });
    p.store.dispatch({ type: A.PLAN_COPY, planId: LADDER.id, carry: true });
    await tick();
    const w = p.fb.adds[0].data;
    expect(hasRecords(w)).toBe(true);
    expect(w.decisionTool.settings.locked).toBe(true);
    expect(w.decisionTool.settings.lockedBy).toBe('copied with records');
    expect(w.decisionTool.settings.lockedAt).toBe(NOW.toISOString());
    expect(w.decisionTool.history.length).toBe(LADDER.decisionTool.history.length);
    expect('planDocument' in w).toBe(false);
    expect('planOfRecord' in w.decisionTool).toBe(false);
    expect(p.toast().op).toBe('copiedLocked');
    p.stop();
  });
  it('this window: the copy appended with a window id, one setItem, every other plan byte-identical; the window\'s three plans refuse a fourth; the example may be copied (its flag dropped), and does not count', async () => {
    const p = page({ raws: [DRAFT, EXAMPLE], session: 'nobody' });
    const before = stored(p);
    p.store.dispatch({ type: A.PLAN_COPY, planId: EXAMPLE.id, carry: false });
    await tick();
    const after = stored(p);
    expect(after.length).toBe(3);
    expect(after[2].id).toMatch(/^guest-[0-9a-z]{8}$/);
    expect(after[2].example).toBeUndefined();
    expect(after[2].planDetails.name).toBe(nameOf(EXAMPLE) + ' (copy)');
    expect(after[2].planDetails.description).toBe('');
    expect(after[2].isActive).toBe(false);
    expect(JSON.stringify(after.slice(0, 2))).toBe(JSON.stringify(before));
    expect(p.session.calls.filter(([c]) => c === 'setItem').length).toBe(1);
    // two copies more fill the window (the example not counted); the fourth is refused in words, nothing written
    for (const n of [2, 3]) { p.store.dispatch({ type: A.PLAN_TOAST_CLOSE }); p.store.dispatch({ type: A.PLANS_SET, list: upgradedList(stored(p), NOW), source: 'window', readAt: '14:03' }); p.store.dispatch({ type: A.PLAN_COPY, planId: DRAFT.id, carry: false }); await tick(); expect(guestOwnPlans(stored(p)).length).toBe(n === 2 ? 3 : 3); }
    expect(guestOwnPlans(stored(p)).length).toBe(GUEST_MAX_PLANS);
    expect(p.problem()).toEqual({ planId: DRAFT.id, problem: 'full' });
    p.stop();
  });
  it('the create failing writes nothing partial and says so', async () => {
    const p = page({ raws: [DRAFT], fb: fakeLite({ fail: 'addDoc' }) });
    p.store.dispatch({ type: A.PLAN_COPY, planId: DRAFT.id, carry: false });
    await tick();
    expect(p.problem()).toEqual({ planId: DRAFT.id, problem: 'failed' });
    expect(p.fb.writes).toEqual([]);
    p.stop();
  });
});

describe('Make this my main plan: two writes of isActive alone on an account, one setItem in this window', () => {
  it('an account: the old main plan\'s flag off, then this one\'s on — nothing else in either write; the plan already main writes nothing', async () => {
    const p = page({ raws: [DRAFT, notActive(FRESH), notActive(LUMPY)] });
    p.store.dispatch({ type: A.PLAN_MAIN, planId: FRESH.id });
    await tick();
    expect(p.fb.writes).toEqual([
      { path: 'users/u1/scenarios/' + DRAFT.id, data: { isActive: false } },
      { path: 'users/u1/scenarios/' + FRESH.id, data: { isActive: true } }
    ]);
    for (const w of p.fb.writes) for (const k of Object.keys(w.data)) expect(PLANS_WRITES).toContain(k);
    expect(p.toast()).toMatchObject({ op: 'main', slots: { name: 'My Plan' } });
    p.store.dispatch({ type: A.PLAN_TOAST_CLOSE });
    p.store.dispatch({ type: A.PLANS_SET, list: upgradedList([notActive(DRAFT), FRESH, notActive(LUMPY)], NOW), source: 'account', readAt: '14:04' });
    p.store.dispatch({ type: A.PLAN_MAIN, planId: FRESH.id });
    await tick();
    expect(p.fb.writes.length).toBe(2);
    expect(p.toast().op).toBe('main');
    p.stop();
  });
  it('this window: both flags folded, one setItem, the third plan byte-identical; the example cannot be the main plan', async () => {
    const p = page({ raws: [DRAFT, notActive(FRESH), EXAMPLE], session: 'nobody' });
    const before = stored(p);
    p.store.dispatch({ type: A.PLAN_MAIN, planId: FRESH.id });
    await tick();
    const after = stored(p);
    expect(after.map((x) => x.isActive)).toEqual([false, true, false]);
    expect(JSON.stringify(after[2])).toBe(JSON.stringify(before[2]));
    expect(p.session.calls.filter(([c]) => c === 'setItem').length).toBe(1);
    p.store.dispatch({ type: A.PLAN_TOAST_CLOSE });
    p.store.dispatch({ type: A.PLAN_MAIN, planId: EXAMPLE.id });
    await tick();
    expect(p.problem()).toEqual({ planId: EXAMPLE.id, problem: 'example' });
    expect(p.session.calls.filter(([c]) => c === 'setItem').length).toBe(1);
    p.stop();
  });
});

describe('Download this plan: the file is planExportJson, named by planExportFileName; nothing leaves the page', () => {
  it('offers ONE file to save, identity stripped, and touches no storage and no Firebase', async () => {
    const win = fakeWin();
    const withUid = { ...copy(LUMPY), uid: 'u1', email: 'a@b.c' };
    const p = page({ raws: [withUid], win });
    p.store.dispatch({ type: A.PLAN_DOWNLOAD, planId: LUMPY.id });
    await tick();
    expect(win.saved.length).toBe(1);
    const plan = p.store.getState().plans.list[0].plan;
    expect(win.saved[0].name).toBe(planExportFileName('Everything at once', NOW));
    expect(win.saved[0].text).toBe(planExportJson(plan));
    const parsed = JSON.parse(win.saved[0].text);
    expect('uid' in parsed).toBe(false); expect('email' in parsed).toBe(false);
    expect(parsed).toEqual(stripIdentity(plan));
    expect(p.fb.writes).toEqual([]); expect(p.fb.adds).toEqual([]); expect(p.fb.deletes).toEqual([]);
    expect(p.session.calls.filter(([c]) => c === 'setItem')).toEqual([]);
    // a plan not here: said in words
    p.store.dispatch({ type: A.PLAN_DOWNLOAD, planId: 'NoSuchPlan' });
    await tick();
    expect(p.problem()).toEqual({ planId: 'NoSuchPlan', problem: 'notHere' });
    expect(win.saved.length).toBe(1);
    p.stop();
  });
});

const file = (text) => ({ name: 'plan.json', text: async () => text });

describe('Open a downloaded copy: the file checked, identity stripped, a plan of its own through the one create; any problem said in words', () => {
  it('a file this page downloaded opens as "{name} (opened)", never the main plan, through ONE addDoc; the file\'s id, uid, example and isActive are never trusted', async () => {
    const p = page({ raws: [DRAFT] });
    const hostile = { ...JSON.parse(planExportJson(upgradeScenario(LUMPY, { now: NOW }).scenario)), id: 'Hostile0001', uid: 'someone-else', example: true, isActive: true, planDetails: { name: 'Everything at once', description: '' } };
    p.store.dispatch({ type: A.PLAN_OPEN_FILE, file: file(JSON.stringify(hostile)) });
    expect(p.store.getState().ui.saving).toEqual({ planId: null, kind: 'open' });
    await tick(12);
    expect(p.rereads.length).toBe(1);
    expect(p.fb.adds.length).toBe(1);
    const w = p.fb.adds[0].data;
    expect(w.planDetails.name).toBe('Everything at once' + OPENED_SUFFIX);
    expect(w.isActive).toBe(false);
    expect('id' in w).toBe(false); expect('uid' in w).toBe(false); expect('example' in w).toBe(false);
    expect(w.createdAt).toBe(NOW.toISOString());
    expect(planProblems(w)).toEqual([]);
    expect(p.toast()).toMatchObject({ planId: 'New1PlanId', op: 'opened', slots: { name: 'Everything at once' + OPENED_SUFFIX } });
    expect(p.store.getState().ui.saving).toBe(null);
    p.stop();
  });
  it('a locked plan\'s file opens by the copy\'s rules: the records carried and the copy locked, the document left behind', async () => {
    const p = page({ raws: [DRAFT], session: 'nobody' });
    p.store.dispatch({ type: A.PLAN_OPEN_FILE, file: file(planExportJson(LADDER)) });
    await tick(12);
    const after = stored(p);
    expect(after.length).toBe(2);
    expect(after[1].planDetails.name).toBe('Ladder to 90' + OPENED_SUFFIX);
    expect(after[1].decisionTool.settings.locked).toBe(true);
    expect(after[1].decisionTool.settings.lockedBy).toBe('copied with records');
    expect('planDocument' in after[1]).toBe(false);
    expect(after[1].id).toMatch(/^guest-/);
    p.stop();
  });
  it('bad JSON, a list, no file, a plan with a problem, a file from a newer version: each said in words, nothing written', async () => {
    const p = page({ raws: [DRAFT] });
    const bads = [
      [file('{not json'), 'badFile', undefined],
      [file('[1, 2]'), 'badFile', undefined],
      [null, 'badFile', undefined],
      [file(JSON.stringify({ ...JSON.parse(planExportJson(LUMPY)), stressTool: { settings: { baseSalary: 'NaN' } }, budgetTool: { settings: { lines: [[1, [2]]] } } })), 'fileProblems', /./],
      [file(JSON.stringify({ ...JSON.parse(planExportJson(LUMPY)), schemaVersion: 99 })), 'fileProblems', /newer version/]
    ];
    for (const [f, problem, detail] of bads) {
      p.store.dispatch({ type: A.PLAN_OPEN_FILE, file: f });
      await tick(12);
      expect(p.problem().problem, problem).toBe(problem);
      if (detail) expect(p.problem().detail).toMatch(detail);
      expect(p.store.getState().ui.saving).toBe(null);
    }
    expect(p.fb.adds).toEqual([]);
    expect(p.fb.writes).toEqual([]);
    p.stop();
  });
  it('this window: refused when the window holds its three, or the free time is used up', async () => {
    const p = page({ raws: [DRAFT, notActive(FRESH), notActive(LUMPY)], session: 'nobody' });
    p.store.dispatch({ type: A.PLAN_OPEN_FILE, file: file(planExportJson(LUMPY)) });
    await tick(12);
    expect(p.problem()).toEqual({ planId: null, problem: 'full' });
    const q = page({ raws: [DRAFT], session: 'nobody', local: storage({ [KEY_MINUTES]: String(GUEST_ALLOWANCE_MINUTES) }) });
    q.store.dispatch({ type: A.PLAN_OPEN_FILE, file: file(planExportJson(LUMPY)) });
    await tick(12);
    expect(q.problem()).toEqual({ planId: null, problem: 'usedUp' });
    expect(stored(q).length).toBe(1);
    p.stop(); q.stop();
  });
});

describe('Delete: the planner\'s rules, the ONE deleteDoc, never undone', () => {
  it('an account: the main plan deleted — another made main first (one write of isActive), then ONE deleteDoc of users/{uid}/scenarios/{id}; the toast names it', async () => {
    const p = page({ raws: [DRAFT, notActive(FRESH), notActive(LUMPY)] });
    p.store.dispatch({ type: A.PLAN_ACTION, planId: DRAFT.id, kind: 'delete' });
    expect(p.store.getState().ui.action).toMatchObject({ planId: DRAFT.id, kind: 'delete', step: 1 });
    p.store.dispatch({ type: A.PLAN_DELETE, planId: DRAFT.id });
    expect(p.store.getState().ui.action).toBe(null);
    await tick();
    expect(p.fb.writes).toEqual([{ path: 'users/u1/scenarios/' + FRESH.id, data: { isActive: true } }]);
    expect(p.fb.deletes).toEqual(['users/u1/scenarios/' + DRAFT.id]);
    expect(p.toast()).toMatchObject({ planId: DRAFT.id, op: 'deleted', slots: { name: 'Draft — Pots & Valves' } });
    expect(p.types()).toContain(A.PLANS_READING);
    p.stop();
  });
  it('a plan that is not the main one: just the one deleteDoc; a locked plan goes after its two confirms, the same way', async () => {
    const p = page({ raws: [DRAFT, notActive(LADDER)] });
    p.store.dispatch({ type: A.PLAN_ACTION, planId: LADDER.id, kind: 'delete' });
    p.store.dispatch({ type: A.PLAN_ACTION, planId: LADDER.id, kind: 'delete', step: 2 });
    expect(p.store.getState().ui.action.step).toBe(2);
    p.store.dispatch({ type: A.PLAN_DELETE, planId: LADDER.id });
    await tick();
    expect(p.fb.writes).toEqual([]);
    expect(p.fb.deletes).toEqual(['users/u1/scenarios/' + LADDER.id]);
    p.stop();
  });
  it('the last plan is never deleted; the example is deletable; this window: the list without the plan, one setItem, the heir made main', async () => {
    const p = page({ raws: [DRAFT], session: 'nobody' });
    const before = p.session.raw(GUEST_PLANS_KEY);
    p.store.dispatch({ type: A.PLAN_DELETE, planId: DRAFT.id });
    await tick();
    expect(p.problem()).toEqual({ planId: DRAFT.id, problem: 'lastPlan' });
    expect(p.session.raw(GUEST_PLANS_KEY)).toBe(before);
    const q = page({ raws: [DRAFT, EXAMPLE, notActive(FRESH)], session: 'nobody' });
    q.store.dispatch({ type: A.PLAN_DELETE, planId: EXAMPLE.id });
    await tick();
    expect(stored(q).map((x) => x.id)).toEqual([DRAFT.id, FRESH.id]);
    q.store.dispatch({ type: A.PLAN_TOAST_CLOSE });
    q.store.dispatch({ type: A.PLANS_SET, list: upgradedList(stored(q), NOW), source: 'window', readAt: '14:03' });
    q.store.dispatch({ type: A.PLAN_DELETE, planId: DRAFT.id });
    await tick();
    const after = stored(q);
    expect(after.map((x) => x.id)).toEqual([FRESH.id]);
    expect(after[0].isActive).toBe(true);
    expect(q.session.calls.filter(([c]) => c === 'removeItem')).toEqual([]);
    expect(q.fb.deletes).toEqual([]);
    p.stop(); q.stop();
  });
  it('the heir is never the example when another plan is there; the delete failing writes nothing more and says so', async () => {
    const p = page({ raws: [DRAFT, EXAMPLE, notActive(FRESH)], session: 'nobody' });
    p.store.dispatch({ type: A.PLAN_DELETE, planId: DRAFT.id });
    await tick();
    expect(stored(p).find((x) => x.id === FRESH.id).isActive).toBe(true);
    expect(stored(p).find((x) => x.id === EXAMPLE.id).isActive).toBe(false);
    const q = page({ raws: [DRAFT, notActive(FRESH)], fb: fakeLite({ fail: 'deleteDoc' }) });
    q.store.dispatch({ type: A.PLAN_DELETE, planId: FRESH.id });
    await tick();
    expect(q.problem()).toEqual({ planId: FRESH.id, problem: 'failed' });
    expect(q.fb.writes).toEqual([]);
    p.stop(); q.stop();
  });
  it('the reducer: a delete only through plan/delete; no action can delete without it, and nothing deletes while another write is under way', () => {
    let s = initialState({ today: TODAY, build: 'test' });
    s = reduce(s, { type: A.PLAN_COPY, planId: 'p1', carry: false });
    expect(s.ui.saving).toEqual({ planId: 'p1', kind: 'copy', carry: false });
    expect(reduce(s, { type: A.PLAN_DELETE, planId: 'p1' })).toBe(s);
    expect(reduce(s, { type: A.PLAN_RENAME, planId: 'p1', name: 'x' })).toBe(s);
    expect(reduce(s, { type: A.PLAN_MAIN, planId: 'p1' })).toBe(s);
    expect(reduce(s, { type: A.PLAN_EXAMPLE })).toBe(s);
    expect(reduce(s, { type: A.PLAN_OPEN_FILE, file: {} })).toBe(s);
  });
});

describe('"Look around an example": the planner\'s demo plan', () => {
  it('the front door offers it too: the button dispatches plan/example, which the reducer takes as a create under way (the plan source loads for it)', () => {
    let s = initialState({ today: TODAY, build: 'test' });
    s = reduce(s, { type: A.ROUTE_SET, route: parse('#/') });
    const { root, actions } = draw(s);
    root.querySelector('[data-testid="front.example"]').click();
    expect(actions).toEqual([{ type: 'plan/example' }]);
    expect(reduce(s, actions[0]).ui.saving).toEqual({ planId: null, kind: 'example' });
  });
  it('this window: made read-only (example: true), the main plan when the window was empty, the page moved to it; a second press opens the one there', async () => {
    const p = page({ raws: [], session: 'nobody' });
    p.store.dispatch({ type: A.PLAN_EXAMPLE });
    await tick(12);
    const after = stored(p);
    expect(after.length).toBe(1);
    const ex = after[0];
    expect(ex.example).toBe(true);
    expect(ex.isActive).toBe(true);
    expect(ex.planDetails.name).toBe(DEMO_PLANS[EXAMPLE_PLAN_KEY].name);
    expect(ex.stressTool.settings).toMatchObject(DEMO_PLANS[EXAMPLE_PLAN_KEY].stress);
    expect(ex.decisionTool.settings.locked).toBeFalsy();
    expect(planProblems(ex)).toEqual([]);
    expect(p.store.getState().route).toEqual(parse('#/plan/' + ex.id));
    expect(p.store.getState().ui.saving).toBe(null);
    expect(guestOwnPlans(after).length).toBe(0);
    p.store.dispatch({ type: A.ROUTE_SET, route: parse('#/plans') });
    p.store.dispatch({ type: A.PLANS_SET, list: upgradedList(after, NOW), source: 'window', readAt: '14:03' });
    p.store.dispatch({ type: A.PLAN_EXAMPLE });
    await tick(12);
    expect(stored(p).length).toBe(1);
    expect(p.store.getState().route).toEqual(parse('#/plan/' + ex.id));
    p.stop();
  });
  it('an account: an ordinary plan of the person\'s own through the one addDoc (never flagged), named uniquely; the free time used up refuses in this window', async () => {
    const p = page({ raws: [{ ...copy(DRAFT), planDetails: { name: DEMO_PLANS[EXAMPLE_PLAN_KEY].name } }] });
    p.store.dispatch({ type: A.PLAN_EXAMPLE });
    await tick(12);
    expect(p.fb.adds.length).toBe(1);
    expect(p.fb.adds[0].data.example).toBeUndefined();
    expect(p.fb.adds[0].data.planDetails.name).toBe(DEMO_PLANS[EXAMPLE_PLAN_KEY].name + ' (2)');
    expect(p.fb.adds[0].data.isActive).toBe(false);
    const q = page({ raws: [], session: 'nobody', local: storage({ [KEY_MINUTES]: String(GUEST_ALLOWANCE_MINUTES) }) });
    q.store.dispatch({ type: A.PLAN_EXAMPLE });
    await tick(12);
    expect(q.problem()).toEqual({ planId: null, problem: 'usedUp' });
    p.stop(); q.stop();
  });
});

describe('property: any run of the menu\'s actions over any window leaves every other plan byte-identical, never fewer than one plan, the example never changed, every account key declared', () => {
  it('holds', async () => {
    const OWN = [DRAFT, FRESH, LUMPY, LADDER].map(notActive);
    const anyWindow = fc.tuple(fc.subarray([0, 1, 2, 3], { minLength: 1, maxLength: 3 }), fc.boolean(), fc.integer({ min: 0, max: 3 })).map(([idx, withExample, main]) => {
      const list = idx.map((i) => copy(OWN[i]));
      if (withExample) list.push(copy(EXAMPLE));
      if (list[main]) list[main].isActive = true;
      return list;
    });
    const anyAction = fc.tuple(fc.constantFrom('rename', 'copy', 'main', 'delete'), fc.integer({ min: 0, max: 4 }), fc.boolean());
    await fc.assert(fc.asyncProperty(anyWindow, fc.array(anyAction, { minLength: 1, maxLength: 4 }), fc.boolean(), async (list, actions, account) => {
      const p = page({ raws: list, session: account ? 'in' : 'nobody' });
      for (const [kind, i, flag] of actions) {
        const now = p.store.getState().plans.list.map((e) => e.plan);
        const target = now[i % now.length];
        const before = account ? null : stored(p);
        p.store.dispatch({ type: A.PLAN_TOAST_CLOSE });
        if (kind === 'rename') p.store.dispatch({ type: A.PLAN_RENAME, planId: String(target.id), name: flag ? 'Renamed' : 'My Plan' });
        else if (kind === 'copy') p.store.dispatch({ type: A.PLAN_COPY, planId: String(target.id), carry: flag });
        else if (kind === 'main') p.store.dispatch({ type: A.PLAN_MAIN, planId: String(target.id) });
        else p.store.dispatch({ type: A.PLAN_DELETE, planId: String(target.id) });
        await tick(12);
        if (account) {
          for (const w of p.fb.writes) for (const k of Object.keys(w.data)) expect(PLANS_WRITES.includes(k) || k === 'lastModified', k).toBe(true);
          for (const a of p.fb.adds) { expect(planProblems(a.data)).toEqual([]); expect(a.data.isActive).toBe(false); expect('id' in a.data).toBe(false); }
          // nothing is written to the example but its main flag (the planner's own harmless key: GuestPlans.examplePlanWriteRefusal)
          for (const w of p.fb.writes) if (w.path.endsWith('/' + EXAMPLE.id)) expect(Object.keys(w.data)).toEqual(['isActive']);
          // the next round reads what was written, as the plan source would: deletes and flags applied by hand
          let next = p.store.getState().plans.list.map((e) => copy(e.plan));
          for (const w of p.fb.writes.splice(0)) { const t = next.find((x) => 'users/u1/scenarios/' + x.id === w.path); if (t) { for (const [k, v] of Object.entries(w.data)) { if (k === 'planDetails.name') t.planDetails.name = v; else t[k] = v; } } }
          for (const a of p.fb.adds.splice(0)) next.push({ ...a.data, id: 'Added' + next.length + String(Math.random()).slice(2, 8) });
          for (const d of p.fb.deletes.splice(0)) next = next.filter((x) => 'users/u1/scenarios/' + x.id !== d);
          expect(next.length).toBeGreaterThanOrEqual(1);
          p.store.dispatch({ type: A.PLANS_SET, list: upgradedList(next, NOW), source: 'account', readAt: '14:05' });
        } else {
          const after = stored(p);
          expect(after.length).toBeGreaterThanOrEqual(1);
          expect(guestOwnPlans(after).length).toBeLessThanOrEqual(GUEST_MAX_PLANS);
          const ex = after.find((x) => x.example === true);
          const exBefore = before.find((x) => x.example === true);
          if (ex && exBefore) { const { isActive: a1, ...r1 } = ex; const { isActive: a2, ...r2 } = exBefore; void a1; void a2; expect(JSON.stringify(r1)).toBe(JSON.stringify(r2)); }
          // every plan the action did not name is byte-identical but for its main flag
          for (const b of before) {
            const a = after.find((x) => x.id === b.id);
            if (!a || String(b.id) === String(target.id)) continue;
            const { isActive: x1, ...r1 } = a; const { isActive: x2, ...r2 } = b; void x1; void x2;
            expect(JSON.stringify(r1)).toBe(JSON.stringify(r2));
          }
          p.store.dispatch({ type: A.PLANS_SET, list: upgradedList(after, NOW), source: 'window', readAt: '14:05' });
        }
      }
      p.stop();
    }), { numRuns: 25 });
  }, 120000);
});

// ---- the screen: the menu drawn, the boxes and confirms, the words ------------------------------------------------------

function draw(state) {
  const root = document.createElement('div');
  root.id = 'app';
  const actions = [];
  render(h(App, { state, dispatch: (a) => actions.push(a) }), root);
  const words = (() => { const c = root.cloneNode(true); for (const el of c.querySelectorAll('.plan-name')) el.remove(); return visibleText(c); })();
  return { root, actions, text: visibleText(root), words };
}
function listState(raws, { session = 'in', ui = {} } = {}) {
  let s = initialState({ today: TODAY, build: 'test' });
  s = reduce(s, { type: A.ROUTE_SET, route: parse('#/plans') });
  s = reduce(s, { type: A.SESSION_SET, session: { kind: session, email: session === 'in' ? 'someone@example.com' : null } });
  s = reduce(s, { type: A.PLANS_SET, list: upgradedList(raws, NOW), source: session === 'in' ? 'account' : 'window', readAt: '14:03' });
  s = reduce(s, { type: A.PLANS_VIEW, view: viewFor(s) });
  return { ...s, ui: { ...s.ui, ...ui } };
}
const q = (root, sel) => root.querySelector(sel);

describe('the screen: the plan menu on every row, the boxes and confirms, no box by default, the words', () => {
  it('each row has its menu: Rename, Make a copy, Make this my main plan (not on the main plan), Download this plan, Delete; the main plan is marked; the example is marked, read-only, with a copy, a download and a delete only', () => {
    const { root, words, text } = draw(listState([DRAFT, notActive(FRESH), EXAMPLE], { session: 'nobody' }));
    expect(q(root, 'input, select, textarea')).toBe(null);
    expect(q(root, `[data-testid="plans.rename.${DRAFT.id}"]`)).not.toBe(null);
    expect(q(root, `[data-testid="plans.main.${DRAFT.id}"]`)).toBe(null);
    expect(q(root, `[data-testid="plans.mainTag.${DRAFT.id}"]`).textContent).toContain(PLAN.list.actions.mainNow);
    expect(q(root, `[data-testid="plans.main.${FRESH.id}"]`)).not.toBe(null);
    for (const id of [DRAFT.id, FRESH.id, EXAMPLE.id]) { expect(q(root, `[data-testid="plans.download.${id}"]`)).not.toBe(null); expect(q(root, `[data-testid="plans.delete.${id}"]`)).not.toBe(null); expect(q(root, `[data-testid="plans.copy.${id}"]`)).not.toBe(null); }
    expect(q(root, `[data-testid="plans.rename.${EXAMPLE.id}"]`)).toBe(null);
    expect(q(root, `[data-testid="plans.main.${EXAMPLE.id}"]`)).toBe(null);
    expect(q(root, `[data-testid="plans.exampleTag.${EXAMPLE.id}"]`).textContent).toContain(PLAN.list.actions.exampleRow);
    expect(text).toContain(PLAN.list.actions.exampleLine);
    // under the list: a new plan from the front door, a downloaded copy, the example (a visitor), sign in
    expect(q(root, '[data-testid="plans.start"]').getAttribute('href')).toBe('#/');
    expect(q(root, '[data-testid="plans.openCopy"]')).not.toBe(null);
    expect(q(root, '[data-testid="plans.example"]')).not.toBe(null);
    expect(q(root, '[data-testid="plans.signIn"]').getAttribute('href')).toBe('#/account');
    expect(q(root, '[data-testid="plans.banner"]').textContent).toContain('of your 3 free hours used');
    for (const hit of bannedHits(words, ['all', 'record', 'retired', 'saver', 'planner'])) expect(hit).toBe('');
    // signed in: no example button, no banner, no sign-in
    const acc = draw(listState([DRAFT]));
    expect(q(acc.root, '[data-testid="plans.example"]')).toBe(null);
    expect(q(acc.root, '[data-testid="plans.banner"]')).toBe(null);
    expect(q(acc.root, '[data-testid="plans.signIn"]')).toBe(null);
  });
  it('Rename opens its box with the name in it; "Rename it" dispatches plan/rename with the box\'s text; "Not now" closes it', () => {
    const s = listState([DRAFT]);
    const opened = draw(s);
    opened.root.querySelector(`[data-testid="plans.rename.${DRAFT.id}"]`).click();
    expect(opened.actions).toEqual([{ type: 'plan/action', planId: DRAFT.id, kind: 'rename', text: nameOf(DRAFT) }]);
    const withBox = draw(reduce(s, opened.actions[0]));
    const box = q(withBox.root, '[data-testid="plans.rename.name"]');
    expect(box.value).toBe(nameOf(DRAFT));
    expect(q(withBox.root, 'label[for="plans.rename.name"]').textContent).toBe(PLAN.list.actions.renameLabel);
    expect(box.getAttribute('data-shell-box')).toBe('rename');
    q(withBox.root, `[data-testid="plans.renameBox.${DRAFT.id}"]`).dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    expect(withBox.actions).toEqual([{ type: 'plan/rename', planId: DRAFT.id, name: nameOf(DRAFT) }]);
    q(withBox.root, '[data-testid="plans.rename.notNow"]').click();
    expect(withBox.actions[1]).toEqual({ type: 'plan/action', planId: DRAFT.id, kind: null });
  });
  it('Make a copy asks "as it is, or with the records" on a plan with records, and a plain question on one without; Delete asks once, twice for a locked plan, and says there is no undo', () => {
    const s = listState([LADDER, notActive(DRAFT)]);
    const withRecords = draw(reduce(s, { type: A.PLAN_ACTION, planId: LADDER.id, kind: 'copy' }));
    expect(q(withRecords.root, `[data-testid="plans.copyBox.${LADDER.id}"]`).textContent).toContain('with its monthly records');
    q(withRecords.root, '[data-testid="plans.copy.records"]').click();
    expect(withRecords.actions).toEqual([{ type: 'plan/copy', planId: LADDER.id, carry: true }]);
    const plain = draw(reduce(s, { type: A.PLAN_ACTION, planId: DRAFT.id, kind: 'copy' }));
    expect(q(plain.root, '[data-testid="plans.copy.records"]')).toBe(null);
    q(plain.root, '[data-testid="plans.copy.plain"]').click();
    expect(plain.actions).toEqual([{ type: 'plan/copy', planId: DRAFT.id, carry: false }]);
    const del1 = draw(reduce(s, { type: A.PLAN_ACTION, planId: LADDER.id, kind: 'delete' }));
    const box1 = q(del1.root, `[data-testid="plans.deleteBox.${LADDER.id}"]`);
    expect(box1.getAttribute('data-step')).toBe('1');
    expect(box1.textContent).toContain('Delete ‘Ladder to 90’?');
    expect(box1.textContent).toContain('This cannot be undone.');
    q(del1.root, '[data-testid="plans.delete.yes"]').click();
    expect(del1.actions).toEqual([{ type: 'plan/action', planId: LADDER.id, kind: 'delete', step: 2 }]);
    const del2 = draw(reduce(s, del1.actions[0]));
    const box2 = q(del2.root, `[data-testid="plans.deleteBox.${LADDER.id}"]`);
    expect(box2.getAttribute('data-step')).toBe('2');
    expect(box2.textContent).toContain('is locked (1 July 2026)');
    q(del2.root, '[data-testid="plans.delete.yes"]').click();
    expect(del2.actions).toEqual([{ type: 'plan/delete', planId: LADDER.id }]);
    const delPlain = draw(reduce(s, { type: A.PLAN_ACTION, planId: DRAFT.id, kind: 'delete' }));
    q(delPlain.root, '[data-testid="plans.delete.yes"]').click();
    expect(delPlain.actions).toEqual([{ type: 'plan/delete', planId: DRAFT.id }]);
  });
  it('a problem is said on its row (or under the list) in words with no slot left; the toast after an action has no Undo; "Open a downloaded copy" opens a labelled file box', () => {
    const s = listState([DRAFT, notActive(FRESH)]);
    const last = draw({ ...s, ui: { ...s.ui, saveProblem: { planId: DRAFT.id, problem: 'lastPlan' } } });
    expect(q(last.root, `[data-testid="plans.problem.${DRAFT.id}"]`).textContent).toBe(PLAN.list.actions.problems.lastPlan);
    const bad = draw({ ...s, ui: { ...s.ui, saveProblem: { planId: null, problem: 'fileProblems', detail: 'a number that is not a number' } } });
    expect(q(bad.root, '[data-testid="plans.problem"]').textContent).toContain('a number that is not a number');
    expect(q(bad.root, '[data-testid="plans.problem"]').textContent).not.toMatch(/\{\w+\}/);
    const done = draw(reduce(s, { type: A.PLAN_ACTION_DONE, planId: DRAFT.id, op: 'copied', slots: { name: 'Draft — Pots & Valves (copy)' } }));
    expect(q(done.root, '[data-testid="plans.toast"]').textContent).toContain('Copied as ‘Draft — Pots & Valves (copy)’.');
    expect(q(done.root, '[data-testid="plans.undo"]')).toBe(null);
    const open = draw(reduce(s, { type: A.UI_TOGGLE, id: 'openCopy' }));
    const fileBox = q(open.root, '[data-testid="plans.openFile"]');
    expect(fileBox.type).toBe('file');
    expect(q(open.root, 'label[for="plans.openFile"]').textContent).toBe(PLAN.list.actions.openPick);
    expect(plansMenuView(reduce(s, { type: A.UI_TOGGLE, id: 'openCopy' })).openCopy).toBe(true);
    // the box is the plans page's: leaving the page closes the rename box
    const away = reduce(reduce(s, { type: A.PLAN_ACTION, planId: DRAFT.id, kind: 'rename', text: 'x' }), { type: A.ROUTE_SET, route: parse('#/') });
    expect(away.ui.action).toBe(null);
  });
});
