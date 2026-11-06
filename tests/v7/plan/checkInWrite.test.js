/**
 * "Check in" through the one write file (research/saving-enough-and-check-in.md 5.4, 5.8; release step R3): the boxes
 * checked, question B run in the worker's own lane on the check-in's figures (a fake client here, handing back B's own
 * answer), then ONE write of the check-in's own keys past the guard; the answer held for the result; Undo byte for byte.
 * Refused, with nothing written: a drawing plan, no worker, boxes with a problem. A locked saver's check-in writes three
 * keys and the plan stays locked. "Use these in my plan" and "Start the path again" are one write each. Fictional plans only.
 */
import { describe, it, expect } from 'vitest';
import { startPlanWrite, GUEST_PLANS_KEY } from '../../../src/v7/effects/planWrite.js';
import { upgradedList, viewFor } from '../../../src/v7/effects/planSource.js';
import { createStore } from '../../../src/v7/effects/store.js';
import { initialState } from '../../../src/v7/state/initial.js';
import { reduce } from '../../../src/v7/state/reduce.js';
import { A } from '../../../src/v7/state/actions.js';
import { parse } from '../../../src/v7/router/routes.js';
import { CHECKIN_WRITES, SAVING_WRITES } from '../../../src/answers/plan/schema.js';
import { CHECK_IN_KEYS, isLockedSettings } from '../../../src/services/LockedPlanGuard.js';
import { answerB } from '../../../src/answers/b/answer.js';
import { buildPlanSeed } from '../../../src/answers/keep/planSeed.js';
import { seedToScenario } from '../../../src/services/PlanFromSeed.js';
import { NO_WORKER } from '../../../src/v7/effects/workerClient.js';
import { startDownloads } from '../../../src/v7/effects/download.js';
import { applyPatch as applyPatchSync } from '../../../src/answers/plan/about.js';
import { corpus, noon } from './_plans.js';

const C = corpus();
const TODAY = '2026-11-20';
const STAMP = TODAY + 'T14:03:00.000Z';
const tick = async (n = 8) => { for (let i = 0; i < n; i++) await new Promise((r) => setTimeout(r, 0)); };
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
function fakeLite() {
  const writes = [];
  return { writes, doc: (db, ...path) => ({ db, path: path.join('/') }), updateDoc: (ref, data) => { writes.push({ path: ref.path, data: copy(data) }); return Promise.resolve(); } };
}
/** The worker client's check-in lane: B's own answer on the inputs it is handed, at the futures asked (fewer here, for time). */
function fakeClient({ broken = false } = {}) {
  const asked = [];
  return {
    asked,
    checkIn: (inputs, env) => { asked.push({ inputs: copy(inputs), env: copy(env) }); return broken ? Promise.reject(Object.assign(new Error('no worker'), { code: NO_WORKER })) : Promise.resolve(answerB(inputs, { ...env, futures: 100 })); }
  };
}

/** Sam, 41 (fictional): a share of pay, kept from "Am I saving enough?" — an unlocked saver's plan. */
function samRaw() {
  const inputs = { household: 'single', you: { pot: 62000, age: 41, statePension: { kind: 'full' }, finalSalary: { has: false }, payIn: { kind: 'share', pay: 38000, ownPct: 6, employerPct: 4 } }, stop: { age: 63 }, spend: { kind: 'amount', amount: 1810 }, endAge: 95 };
  const result = answerB(inputs, { today: '2026-11-04', futures: 100, seed: 0, trace: false, detail: 'answer' });
  const seed = buildPlanSeed({ source: 'b', result, env: { today: '2026-11-04', appVersion: 'test' }, name: 'Sam saving', createdAt: '2026-11-04T10:00:00.000Z', payIn: 'now' });
  const made = seedToScenario(seed, '2026-11-04').yours;
  made.id = 'SamSaving01';
  made.lastModified = '2026-11-04T10:00:00.000Z';
  return made;
}

function page({ raws, planId, session = 'nobody', typed = {}, client = fakeClient(), fb = fakeLite() }) {
  const store = createStore(initialState({ today: TODAY, build: 'test' }), reduce);
  store.dispatch({ type: A.ROUTE_SET, route: parse('#/plan/' + planId + '/checkin') });
  store.dispatch({ type: A.SESSION_SET, session: { kind: session, email: session === 'in' ? 'a@b.c' : null } });
  const list = upgradedList(raws, noon(TODAY));
  store.dispatch({ type: A.PLANS_SET, list, source: session === 'in' ? 'account' : 'window', readAt: '14:03' });
  for (const [path, value] of Object.entries(typed)) store.dispatch({ type: A.PLAN_EDIT, planId, path, value });
  store.dispatch({ type: A.PLANS_VIEW, view: viewFor(store.getState()) });
  const sess = storage(session === 'in' ? {} : { [GUEST_PLANS_KEY]: JSON.stringify(raws) });
  const handles = () => ({ db: session === 'in' ? { name: 'db' } : null, user: session === 'in' ? { uid: 'u1', email: 'a@b.c', emailVerified: true } : null, reread: () => Promise.resolve() });
  const actions = [];
  store.subscribe((s, a) => actions.push(a));
  const stop = startPlanWrite(store, { win: null, session: sess, local: storage(), now: () => new Date(STAMP), fb, client, handles });
  return { store, fb, session: sess, client, actions, stop };
}
const TYPED = { 'ci.pension': '64500', 'ci.isa': '3200', 'ci.note': 'Moved to a new team.' };

describe('"Check in" without an account: the run, then one write of the check-in\'s keys; Undo byte for byte', () => {
  it('B runs on the check-in\'s figures at 1,000 futures, seed 0; the window\'s text differs only in the check-in\'s keys; the answer is held; Undo puts it back', async () => {
    const sam = samRaw();
    const other = copy(C['12-lumpy-db-gia']);
    const p = page({ raws: [sam, other], planId: sam.id, typed: TYPED });
    const before = p.session.raw(GUEST_PLANS_KEY);
    p.store.dispatch({ type: A.PLAN_CHECK_IN, planId: sam.id });
    expect(p.store.getState().ui.saving).toEqual({ planId: sam.id, kind: 'checkIn' });
    await tick();
    expect(p.client.asked).toHaveLength(1);
    expect(p.client.asked[0].env).toMatchObject({ today: TODAY, futures: 1000, seed: 0, detail: 'answer' });
    expect(p.client.asked[0].inputs.you).toMatchObject({ pot: 64500, payIn: { kind: 'share', pay: 38000, ownPct: 6, employerPct: 4 } });
    const after = JSON.parse(p.session.raw(GUEST_PLANS_KEY));
    const was = JSON.parse(before);
    expect(JSON.stringify(after[1]), 'the other plan byte-identical').toBe(JSON.stringify(was[1]));
    const rest = (plan) => { const o = copy(plan); delete o.lastModified; for (const k of ['checkIns', 'history', 'checkInEvery', 'path', 'pathArchive']) delete o.accumulationTool[k]; return JSON.stringify(o); };
    expect(rest(after[0])).toBe(rest(was[0]));
    expect(after[0].lastModified).toBe(STAMP);
    expect(after[0].accumulationTool.checkIns).toHaveLength(1);
    expect(after[0].accumulationTool.checkIns[0]).toMatchObject({ date: TODAY, pot: { pension: 64500, isa: 3200 }, note: 'Moved to a new team.' });
    expect(['yes', 'close', 'no']).toContain(after[0].accumulationTool.checkIns[0].reading.band);
    expect(after[0].accumulationTool.path.path[0].nominal.middling).toBe(67700);
    expect(after[0].accumulationTool.history.map((r) => r.date)).toEqual(['2026-11']);
    const s = p.store.getState();
    expect(s.checkIn).toMatchObject({ planId: sam.id, date: TODAY });
    expect(s.checkIn.result.verdict.band).toBe(after[0].accumulationTool.checkIns[0].reading.band);
    expect(s.ui.toast).toMatchObject({ planId: sam.id, kind: 'saved', op: 'checkIn', line: { id: 'checkedIn', slots: { month: 'November 2026' } } });
    expect(s.draft.plan.id, 'the boxes are emptied once checked in').toBe(null);
    for (const k of Object.keys(s.ui.toast.previous)) expect(CHECKIN_WRITES).toContain(k);
    // Undo: the window's text exactly as it was, and the answer drawn for it goes
    p.store.dispatch({ type: A.PLANS_SET, list: upgradedList(after, noon(TODAY)), source: 'window', readAt: '14:04' });
    p.store.dispatch({ type: A.PLAN_UNDO, planId: sam.id });
    await tick();
    expect(p.session.raw(GUEST_PLANS_KEY)).toBe(before);
    expect(p.store.getState().ui.toast.kind).toBe('undone');
    expect(p.store.getState().checkIn.planId).toBe(null);
  }, 60000);
  it('boxes with a problem: nothing run, nothing written; the problems show', async () => {
    const sam = samRaw();
    const p = page({ raws: [sam], planId: sam.id, typed: { 'ci.pension': 'lots' } });
    const before = p.session.raw(GUEST_PLANS_KEY);
    p.store.dispatch({ type: A.PLAN_CHECK_IN, planId: sam.id });
    await tick();
    expect(p.client.asked).toHaveLength(0);
    expect(p.session.raw(GUEST_PLANS_KEY)).toBe(before);
    expect(p.store.getState().ui.saveProblem).toEqual({ planId: sam.id, problem: 'problems' });
    expect(p.store.getState().draft.plan.asked).toBe(true);
  });
  it('no worker: nothing written ("noWorker") — a check-in\'s verdict is never a lesser run', async () => {
    const sam = samRaw();
    const p = page({ raws: [sam], planId: sam.id, typed: TYPED, client: fakeClient({ broken: true }) });
    const before = p.session.raw(GUEST_PLANS_KEY);
    p.store.dispatch({ type: A.PLAN_CHECK_IN, planId: sam.id });
    await tick();
    expect(p.session.raw(GUEST_PLANS_KEY)).toBe(before);
    expect(p.store.getState().ui.saveProblem).toEqual({ planId: sam.id, problem: 'noWorker' });
  });
  it('a drawing plan: refused before anything runs ("notSaving"); nothing written', async () => {
    const drawing = copy(C['04-buckets-running']);
    const p = page({ raws: [drawing], planId: drawing.id, typed: { 'ci.pension': '100000' } });
    const before = p.session.raw(GUEST_PLANS_KEY);
    p.store.dispatch({ type: A.PLAN_CHECK_IN, planId: drawing.id });
    await tick();
    expect(p.client.asked).toHaveLength(0);
    expect(p.session.raw(GUEST_PLANS_KEY)).toBe(before);
    expect(p.store.getState().ui.saveProblem).toEqual({ planId: drawing.id, problem: 'notSaving' });
    // nor "Use these in my plan" from check-ins kept from its saving years
    const kept = copy(drawing);
    kept.accumulationTool = { ...(kept.accumulationTool || {}), checkIns: [{ date: '2026-11-02', pot: { pension: 100000, isa: null, other: null }, pay: 30000, payIn: { kind: 'total', total: 500, savingsIn: 0 }, paused: null }] };
    const q = page({ raws: [kept], planId: kept.id });
    const was = q.session.raw(GUEST_PLANS_KEY);
    q.store.dispatch({ type: A.PLAN_USE_CHECKIN, planId: kept.id });
    await tick();
    expect(q.session.raw(GUEST_PLANS_KEY)).toBe(was);
    expect(q.store.getState().ui.saveProblem).toEqual({ planId: kept.id, problem: 'notSaving' });
  });
});

describe('"Check in" on an account: one updateDoc of the check-in\'s keys', () => {
  it('a locked saver: three keys and the stamp, the plan still locked; nothing of the settings or the plan document', async () => {
    const locked = copy(C['05-saver-committed']);
    const p = page({ raws: [locked], planId: locked.id, session: 'in', typed: { 'ci.pension': '330000', 'ci.isa': '42000' } });
    p.store.dispatch({ type: A.PLAN_CHECK_IN, planId: locked.id });
    await tick();
    expect(p.fb.writes).toHaveLength(1);
    expect(p.fb.writes[0].path).toBe('users/u1/scenarios/' + locked.id);
    expect(Object.keys(p.fb.writes[0].data).sort()).toEqual([...CHECK_IN_KEYS.locked, 'lastModified'].sort());
    expect(p.fb.writes[0].data['accumulationTool.checkInEvery']).toBe('month');   // "Each month" kept: the locked saver never chose
    expect(isLockedSettings(locked.decisionTool.settings)).toBe(true);
  }, 60000);
  it('"Use these in my plan" writes What you pay in\'s settings; "Start the path again" the path and its archive — one write each', async () => {
    const sam = samRaw();
    const p = page({ raws: [sam], planId: sam.id, session: 'in', typed: { ...TYPED, 'ci.ownPct': '9' } });
    p.store.dispatch({ type: A.PLAN_CHECK_IN, planId: sam.id });
    await tick();
    expect(p.fb.writes).toHaveLength(1);
    // the plan as written, read again
    const { applyPatch } = await import('../../../src/answers/plan/about.js');
    const written = applyPatch(upgradedList([sam], noon(TODAY))[0].plan, p.fb.writes[0].data);
    p.store.dispatch({ type: A.PLANS_SET, list: [{ plan: written, newer: false, failed: false }], source: 'account', readAt: '14:05' });
    p.store.dispatch({ type: A.PLAN_TOAST_CLOSE });
    p.store.dispatch({ type: A.PLAN_USE_CHECKIN, planId: sam.id });
    await tick();
    expect(p.fb.writes).toHaveLength(2);
    expect(Object.keys(p.fb.writes[1].data).sort()).toEqual(['accumulationTool.settings', 'lastModified']);
    for (const k of Object.keys(p.fb.writes[1].data)) expect(SAVING_WRITES).toContain(k);
    expect(p.fb.writes[1].data['accumulationTool.settings']).toMatchObject({ payInKind: 'share', ownPct: 9, employerPct: 4 });
    p.store.dispatch({ type: A.PLAN_TOAST_CLOSE });
    p.store.dispatch({ type: A.PLAN_RESTART_PATH, planId: sam.id });
    await tick();
    expect(p.fb.writes).toHaveLength(3);
    expect(Object.keys(p.fb.writes[2].data).sort()).toEqual(['accumulationTool.path', 'accumulationTool.pathArchive', 'lastModified']);
  }, 60000);
  it('"Start the path again" from a check-in of an earlier month: refused ("restartOld"), nothing written', async () => {
    const sam = samRaw();
    const old = applyPatchSync(upgradedList([sam], noon(TODAY))[0].plan, {
      'accumulationTool.checkIns': [{ date: '2026-08-14', pot: { pension: 60000, isa: null, other: null }, pay: 38000, payIn: { kind: 'share', ownPct: 6, employerPct: 4, total: 316.67, savingsIn: 0 }, paused: null, reading: { path: null }, recordedAt: '2026-08-14T10:00:00.000Z' }],
      'accumulationTool.path': { version: 3, asOf: '2026-08', potSource: 'check-in', path: [{ year: 0, nominal: { careful: 60000, middling: 60000, good: 60000 } }] }
    });
    const p = page({ raws: [old], planId: sam.id, session: 'in' });
    p.store.dispatch({ type: A.PLAN_RESTART_PATH, planId: sam.id });
    await tick();
    expect(p.fb.writes).toHaveLength(0);
    expect(p.store.getState().ui.saveProblem).toEqual({ planId: sam.id, problem: 'restartOld' });
  });
});

describe('"Add to my calendar" (5.2): a file made in the browser, the date and the words only', () => {
  it('after a check-in, the download effect saves the check-in step\'s calendar file: an .ics with the next date and "PensionTools check-in", no figure', async () => {
    const sam = samRaw();
    const p = page({ raws: [sam], planId: sam.id, typed: TYPED });
    p.store.dispatch({ type: A.PLAN_CHECK_IN, planId: sam.id });
    await tick();
    const after = JSON.parse(p.session.raw(GUEST_PLANS_KEY));
    p.store.dispatch({ type: A.PLANS_SET, list: upgradedList(after, noon(TODAY)), source: 'window', readAt: '14:04' });
    p.store.dispatch({ type: A.PLANS_VIEW, view: viewFor(p.store.getState()) });
    const saved = [];
    const win = { Blob: class { constructor(parts, opts) { this.text = parts.join(''); this.type = opts.type; } }, URL: { createObjectURL: (b) => { win.last = b; return 'blob:x'; }, revokeObjectURL: () => {} }, document: { body: { appendChild: () => {} }, createElement: () => { const a = { click() { saved.push({ name: a.download, text: win.last.text, type: win.last.type }); }, remove() {} }; return a; } }, setTimeout: (fn) => fn() };
    const stop = startDownloads(p.store, { win, now: () => new Date(STAMP) });
    p.store.dispatch({ type: A.PLAN_CALENDAR, planId: sam.id });
    stop();
    expect(saved).toHaveLength(1);
    expect(saved[0].name).toBe('pensiontools-check-in-2027-11.ics');
    expect(saved[0].type).toMatch(/^text\/calendar/);
    expect(saved[0].text).toContain('SUMMARY:PensionTools check-in');
    expect(saved[0].text).toContain('DTSTART;VALUE=DATE:20271101');
    expect(saved[0].text.replace(/VERSION:2\.0/, '').replace(/\b\d{8}(T\d{6}Z)?\b/g, '')).not.toMatch(/\d|£/);
  }, 60000);
});
