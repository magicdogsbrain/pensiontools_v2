/**
 * The machinery of "Moving to your plan's mix" (research/v7/holdings-and-move.md §3.3, §3.5, §3.7, §7; road-to-7.md step 10):
 * the reducer (the one run on the held mix filed under the plan's key, a stale result dropped; the index the watch reads,
 * cleaned, kept when the plans leave; plan/tick sets the one write file going; the open blocks close with the page;
 * state/replace; readyMark), the runner with a fake client (move/run → the moveHeld lane → move/done, timed; the key moving
 * ends it; a failure; no worker) and a fake fetch (the equity file read once a page life: the live file when newer than the
 * bundled snapshot, else the snapshot; a failed read falls back), the worker handler's `moveHeld` message, the client's lane,
 * and the one write file: a tick-off (kind 'tick') as the whole `transition` object plus the stamp, equal to move.js
 * tickPatch (TransitionPlanner.tickMove / untickMove), past the guard on a LOCKED plan, Undo the exact reverse, a key that
 * is not a move refused, an unlocked plan refused, the window's plans byte-identical elsewhere.
 */
import { describe, it, expect } from 'vitest';
import { createStore } from '../../../src/v7/effects/store.js';
import { initialState, emptyMove, cleanMove } from '../../../src/v7/state/initial.js';
import { reduce } from '../../../src/v7/state/reduce.js';
import { A } from '../../../src/v7/state/actions.js';
import { parse } from '../../../src/v7/router/routes.js';
import { readyMark, planMoveView } from '../../../src/v7/state/select.js';
import { viewFor, upgradedList } from '../../../src/v7/effects/planSource.js';
import { startMoveRunner, indexOf, EQUITY_URL } from '../../../src/v7/effects/move.js';
import { startPlanWrite, GUEST_PLANS_KEY } from '../../../src/v7/effects/planWrite.js';
import { createHandler } from '../../../src/v7/effects/answerWorker.js';
import { createWorkerClient, NO_WORKER } from '../../../src/v7/effects/workerClient.js';
import { tickPatch, runKeyOf, moveOf } from '../../../src/answers/plan/move.js';
import { applyPatch } from '../../../src/answers/plan/about.js';
import { MOVE_WRITES, ALL_WRITES } from '../../../src/answers/plan/schema.js';
import { tickMove, untickMove } from '../../../src/services/TransitionPlanner.js';
import bundled from '../../../src/data/equitySnapshot.js';
import { corpus, entryOf, TODAY, noon } from '../plan/_plans.js';

const C = corpus();
const tick = async (n = 6) => { for (let i = 0; i < n; i++) await new Promise((r) => setTimeout(r, 0)); };
const copy = (v) => JSON.parse(JSON.stringify(v));
const RESULT = { affordable: true, a: { share: 0.95, chancePct: 95, typicalLeft: 400000, badCaseLeft: 40000, years: 30, lasts: true }, reason: null, held: { pcts: { shares: 60, bonds: 30, diversifiers: 0, cash: 10 }, pot: 590000, fromPension: true }, basis: { today: TODAY, engine: 'one-test', runs: 1 } };
const INDEX = { level: 5000, ath: 7000, asOf: '2026-10-19', symbol: 'S&P 500 (price index)', athDate: '2026-10-06' };
const planted = (raw, id) => ({ ...copy(raw), id, planDetails: { ...(raw.planDetails || {}), name: 'A plan' }, isActive: false, household: undefined });

/** A store on the move step of a plan, the plans read (an account or this window), the reading done as the plan source does. */
function pageOn(raws, planId, { source = 'account', session = 'in' } = {}) {
  const store = createStore(initialState({ today: TODAY, build: 'test' }), reduce);
  store.dispatch({ type: A.ROUTE_SET, route: parse('#/plan/' + planId + '/move') });
  store.dispatch({ type: A.SESSION_SET, session: { kind: session, email: session === 'in' ? 'a@b.c' : null } });
  const list = upgradedList(raws, noon(TODAY));
  store.dispatch({ type: A.PLANS_SET, list, source, readAt: '14:03' });
  store.dispatch({ type: A.PLANS_VIEW, view: viewFor(store.getState()) });
  let last = null;
  store.subscribe((state) => {
    const now = [state.move, state.draft.plan, state.plans && state.plans.list];
    if (state.plans && state.plans.status === 'read' && (!state.plans.view || !last || now.some((v, i) => v !== last[i]))) { last = now; store.dispatch({ type: A.PLANS_VIEW, view: viewFor(state) }); }
  });
  const plan = list.find((e) => String(e.plan.id) === String(planId)).plan;
  return { store, list, plan, key: runKeyOf(plan) };
}
function fakeFb() {
  const writes = [];
  return { writes, fb: { doc: (db, ...path) => ({ path: path.join('/') }), collection: (db, ...path) => ({ path: path.join('/') }), updateDoc: async (ref, data) => { writes.push({ ref: ref.path, data: copy(data) }); }, addDoc: async () => ({ id: 'NewPlanId' }) } };
}
const at = new Date('2026-10-02T14:03:00.000Z');
const handlesFor = (store, uid = 'u1') => () => ({ db: {}, user: store.getState().session.kind === 'in' ? { uid } : null, reread: async () => store.dispatch({ type: A.PLANS_SET, list: store.getState().plans.list, source: 'account', readAt: '14:04' }) });
const started = (p, fb, { session = null } = {}) => startPlanWrite(p.store, { win: null, session, local: null, now: () => at, fb: fb.fb, client: null, handles: session ? () => ({ db: null, user: null, reread: async () => {} }) : handlesFor(p.store), rand: () => 0.42 });

describe('the reducer: the held run and the index in page memory', () => {
  const s0 = initialState({ today: TODAY, build: 'test' });
  it('starts empty; the run is filed under its key, done or failed; a result for another key is dropped; the index cleaned; plan/tick sets the write going', () => {
    expect(s0.move).toEqual(emptyMove());
    let s = reduce(s0, { type: A.MOVE_RUN, key: 'k1' });
    expect(s.move).toMatchObject({ key: 'k1', status: 'working', result: null });
    expect(reduce(s, { type: A.MOVE_RUN, key: 'k1' })).toBe(s);
    expect(reduce(s, { type: A.MOVE_DONE, key: 'k2', result: RESULT, ms: 1 })).toBe(s);
    expect(() => reduce(s, { type: A.MOVE_DONE, key: 'k1', result: null })).toThrow(/needs a result/);
    s = reduce(s, { type: A.MOVE_DONE, key: 'k1', result: RESULT, ms: 620.4 });
    expect(s.move).toMatchObject({ status: 'done', result: RESULT, ms: 620 });
    expect(reduce(s, { type: A.MOVE_FAILED, key: 'k1' }), 'done is not working').toBe(s);
    const f = reduce(reduce(s0, { type: A.MOVE_RUN, key: 'k1' }), { type: A.MOVE_FAILED, key: 'k1', reason: 'noWorker' });
    expect(f.move).toMatchObject({ status: 'failed', reason: 'noWorker', result: null });
    expect(() => reduce(s0, { type: A.MOVE_RUN })).toThrow(/needs a key/);
    // the index: cleaned, two positive numbers and the day; the same index again changes nothing; the plans leaving keep it
    const i = reduce(s, { type: A.MOVE_INDEX, index: { ...INDEX, extra: 1 } });
    expect(i.move.index).toEqual(INDEX);
    expect(reduce(i, { type: A.MOVE_INDEX, index: INDEX })).toBe(i);
    expect(reduce(i, { type: A.MOVE_INDEX, index: { level: 0, ath: 1 } }).move.index).toBe(null);
    expect(reduce(i, { type: A.MOVE_INDEX, index: null }).move.index).toBe(null);
    const cleared = reduce(reduce(i, { type: A.PLANS_SET, list: [], source: 'account', readAt: '1' }), { type: A.PLANS_CLEAR });
    expect(cleared.move).toEqual({ ...emptyMove(), index: INDEX });
    expect(cleanMove({ key: 'k', status: 'done', result: RESULT, ms: 3, reason: 'x', index: INDEX })).toEqual({ key: 'k', status: 'done', result: RESULT, ms: 3, reason: null, index: INDEX });
    expect(cleanMove({ status: 'done', result: RESULT })).toEqual(emptyMove());
    expect(cleanMove(null)).toEqual(emptyMove());
    // plan/tick
    const t = reduce(s0, { type: A.PLAN_TICK, planId: 'p1', key: 'gilt:T29', done: true });
    expect(t.ui.saving).toEqual({ planId: 'p1', kind: 'tick', key: 'gilt:T29', done: true });
    expect(reduce(s0, { type: A.PLAN_TICK, planId: 'p1', key: 'gilt:T29', done: false }).ui.saving.done).toBe(false);
    expect(reduce(t, { type: A.PLAN_TICK, planId: 'p1', key: 'x', done: true })).toBe(t);
    expect(() => reduce(s0, { type: A.PLAN_TICK, planId: 'p1' })).toThrow(/key/);
    // the open blocks close with the page
    const open = reduce(reduce(s0, { type: A.ROUTE_SET, route: parse('#/plan/p1/move') }), { type: A.UI_TOGGLE, id: 'moveSheet' });
    expect(reduce(open, { type: A.ROUTE_SET, route: parse('#/plan/p1/hold') }).ui.open).toEqual([]);
    expect(JSON.parse(JSON.stringify(i))).toEqual(i);
    const r = reduce(s0, { type: A.STATE_REPLACE, state: { ...i, move: { ...i.move, status: 'odd' } } });
    expect(r.move).toEqual({ ...emptyMove(), key: 'k1', index: INDEX });
    expect(reduce(s0, { type: A.STATE_REPLACE, state: { ...i, move: 7 } }).move).toEqual(emptyMove());
  });
  it('readyMark: the held run under way is not ready; planMoveView carries the open blocks', () => {
    const p = pageOn([planted(C['04-buckets-running'], 'M1')], 'M1');
    expect(readyMark(p.store.getState()).ready).toBe('1');
    p.store.dispatch({ type: A.MOVE_RUN, key: p.key });
    expect(readyMark(p.store.getState()).ready).toBe('0');
    p.store.dispatch({ type: A.MOVE_DONE, key: p.key, result: RESULT, ms: 1 });
    expect(readyMark(p.store.getState()).ready).toBe('1');
    const v = planMoveView(p.store.getState());
    expect(v).toMatchObject({ found: true, id: 'M1', kind: 'buckets', complete: true, howOpen: false, sheetOpen: false, explainedOpen: false });
    expect(v.heldRun).toMatchObject({ status: 'done', ms: 1 });
    expect(v.heldRun.result.words).toBe('in more than 9 futures out of 10');
    p.store.dispatch({ type: A.UI_TOGGLE, id: 'moveHow' });
    expect(planMoveView(p.store.getState()).howOpen).toBe(true);
    expect(planMoveView(reduce(p.store.getState(), { type: A.ROUTE_SET, route: parse('#/plans') })).found).toBe(false);
  });
});

describe('the runner: the held run in its lane, and the index read once', () => {
  const fakeClient = (fns = {}, stopped = []) => ({ ...fns, stop: (q) => stopped.push(q) });
  const live = { ...bundled, generated_at: '2099-01-01T00:00:00.000Z', date: '2098-12-31', level: 9000, ath: 9500, athDate: '2098-12-01' };
  it('move/run → client.moveHeld(plan, { today }) → move/done, timed; the key moving ends it; a failure; no worker', async () => {
    const p = pageOn([planted(C['04-buckets-running'], 'M1')], 'M1');
    const calls = [];
    let t = 1000;
    const stopped = [];
    const client = fakeClient({ moveHeld: (plan, env) => { calls.push({ id: plan.id, env }); t += 620; return Promise.resolve(RESULT); } }, stopped);
    const stop = startMoveRunner({ store: p.store, client, now: () => t, fetchImpl: null });
    p.store.dispatch({ type: A.MOVE_RUN, key: p.key });
    await tick();
    expect(calls).toEqual([{ id: 'M1', env: { today: TODAY } }]);
    expect(p.store.getState().move).toMatchObject({ key: p.key, status: 'done', ms: 620 });
    expect(viewFor(p.store.getState()).page.move.heldRun.result.words).toBe('in more than 9 futures out of 10');
    stop();
    const p2 = pageOn([planted(C['04-buckets-running'], 'M1')], 'M1');
    const resolvers = [];
    const stopped2 = [];
    const stop2 = startMoveRunner({ store: p2.store, client: fakeClient({ moveHeld: () => new Promise((resolve) => resolvers.push(resolve)) }, stopped2), fetchImpl: null });
    p2.store.dispatch({ type: A.MOVE_RUN, key: p2.key });
    await tick();
    const changed = planted(C['04-buckets-running'], 'M1');
    changed.lastModified = '2026-10-02T14:03:00.000Z';
    p2.store.dispatch({ type: A.PLANS_SET, list: upgradedList([changed], noon(TODAY)), source: 'account', readAt: '14:04' });
    p2.store.dispatch({ type: A.UI_RAIL, open: true });
    await tick();
    expect(stopped2).toContain('moveHeld');
    resolvers[0](RESULT);
    await tick();
    expect(p2.store.getState().move.status, 'the old answer is dropped').toBe('working');
    stop2();
    const p3 = pageOn([planted(C['04-buckets-running'], 'M1')], 'M1');
    const stop3 = startMoveRunner({ store: p3.store, client: fakeClient({ moveHeld: () => Promise.reject(Object.assign(new Error('none'), { code: NO_WORKER })) }), fetchImpl: null });
    p3.store.dispatch({ type: A.MOVE_RUN, key: p3.key });
    await tick();
    expect(p3.store.getState().move).toMatchObject({ status: 'failed', reason: 'noWorker' });
    stop3();
  });
  it('the index: fetched once on the move step from ../data/equity.json; the live file when newer than the bundled snapshot, else the snapshot; a failed read falls back; no fetch: the snapshot', async () => {
    const urls = [];
    const p = pageOn([planted(C['03-gilt-ladder-runup'], 'L1')], 'L1');
    const stop = startMoveRunner({ store: p.store, client: fakeClient({}), fetchImpl: async (u) => { urls.push(u); return { ok: true, json: async () => live }; } });
    await tick();
    expect(urls).toEqual([EQUITY_URL]);
    expect(EQUITY_URL).toBe('../data/equity.json');
    expect(p.store.getState().move.index).toEqual({ level: 9000, ath: 9500, asOf: '2098-12-31', symbol: bundled.symbol, athDate: '2098-12-01' });
    p.store.dispatch({ type: A.ROUTE_SET, route: parse('#/plan/L1/hold') });
    p.store.dispatch({ type: A.ROUTE_SET, route: parse('#/plan/L1/move') });
    await tick();
    expect(urls, 'once a page life').toHaveLength(1);
    stop();
    const old = pageOn([planted(C['03-gilt-ladder-runup'], 'L1')], 'L1');
    const stopOld = startMoveRunner({ store: old.store, client: fakeClient({}), fetchImpl: async () => ({ ok: true, json: async () => ({ ...live, generated_at: '2000-01-01T00:00:00.000Z' }) }) });
    await tick();
    expect(old.store.getState().move.index).toEqual(indexOf(null, bundled));
    expect(old.store.getState().move.index).toMatchObject({ level: bundled.level, ath: bundled.ath, asOf: bundled.date });
    stopOld();
    const failed = pageOn([planted(C['03-gilt-ladder-runup'], 'L1')], 'L1');
    const stopFailed = startMoveRunner({ store: failed.store, client: fakeClient({}), fetchImpl: async () => { throw new Error('offline'); } });
    await tick();
    expect(failed.store.getState().move.index).toEqual(indexOf(null, bundled));
    stopFailed();
    const none = pageOn([planted(C['03-gilt-ladder-runup'], 'L1')], 'L1');
    const stopNone = startMoveRunner({ store: none.store, client: fakeClient({}), fetchImpl: null });
    await tick();
    expect(none.store.getState().move.index).toEqual(indexOf(null, bundled));
    expect(viewFor(none.store.getState()).page.move.watch, 'the full ladder has no watch').toBe(null);
    stopNone();
    expect(indexOf({ level: 1, ath: 2 }, { generated_at: null, level: 3, ath: 4, date: 'd' })).toEqual({ level: 1, ath: 2, asOf: null, symbol: null, athDate: null });
    expect(indexOf({ level: 'x' }, null)).toBe(null);
  });
});

describe('the worker: the moveHeld message, and the client\'s lane', () => {
  const plan = entryOf(C['04-buckets-running']).plan;
  const collect = async (handle, msg) => { const out = []; handle(msg, (m) => out.push(m)); await tick(12); return out; };
  it('a fake run through the real handler: the date from init, progress then plain data; no plan → an error', async () => {
    const seen = [];
    const handle = createHandler(undefined, { moveHeld: (p, { today, onProgress }) => { seen.push([p.id, today]); onProgress(0, 1); onProgress(1, 1); return { ...RESULT, f: () => 1 }; } });
    handle({ id: 1, type: 'init', today: TODAY }, () => {});
    const out = await collect(handle, { id: 2, type: 'moveHeld', plan, env: {} });
    expect(seen).toEqual([[plan.id, TODAY]]);
    expect(out[0]).toEqual({ id: 2, progress: { done: 0, total: 1 } });
    expect(out.at(-1)).toEqual({ id: 2, result: RESULT });
    expect(await collect(handle, { id: 3, type: 'moveHeld', env: {} })).toEqual([{ id: 3, error: expect.stringMatching(/no plan/) }]);
  });
  it('the client sends the plan as data on its own lane; stop("moveHeld") ends it and nothing else; no worker → NO_WORKER', async () => {
    const posted = [];
    let w;
    const makeWorker = () => { w = { postMessage: (m) => posted.push(m), terminate: () => {}, onmessage: null, onerror: null }; return w; };
    const client = createWorkerClient({ makeWorker });
    const held = client.moveHeld({ id: 'p' }, { today: TODAY });
    const other = client.lasts({ id: 'p' }, { today: TODAY });
    expect(posted.map((m) => m.type)).toEqual(['moveHeld', 'lasts']);
    client.stop('moveHeld');
    await expect(held).rejects.toMatchObject({ code: 'stopped' });
    expect(posted.filter((m) => m.type === 'lasts')).toHaveLength(2);
    w.onmessage({ data: { id: posted.at(-1).id, result: RESULT } });
    await expect(other).resolves.toEqual(RESULT);
    const none = createWorkerClient({ makeWorker: () => null });
    await expect(none.moveHeld({ id: 'p' }, { today: TODAY })).rejects.toMatchObject({ code: NO_WORKER });
  });
});

describe('the one write file: a tick-off, the whole transition object (road-to-7.md step 10)', { timeout: 60_000 }, () => {
  it('on a LOCKED ladder plan: ONE write of `transition` plus the stamp, equal to tickPatch (TransitionPlanner.tickMove); the toast; Undo writes the object the plan had (none → null); the untick; a key that is not a move is refused', async () => {
    const raw = planted(C['03-gilt-ladder-runup'], 'T1');
    const p = pageOn([raw], 'T1');
    const f = fakeFb();
    const stop = started(p, f);
    const view = moveOf([{ plan: p.plan }], 'T1', { today: TODAY });
    const key = view.buy[0].key;
    expect(key).toBe('gilt:T29');
    p.store.dispatch({ type: A.PLAN_TICK, planId: 'T1', key, done: true });
    await tick(12);
    expect(f.writes).toHaveLength(1);
    expect(f.writes[0].ref).toBe('users/u1/scenarios/T1');
    const expected = tickPatch(p.plan, key, { today: TODAY, done: true });
    expect(f.writes[0].data).toEqual({ ...expected.patch, lastModified: at.toISOString() });
    expect(f.writes[0].data.transition).toEqual(tickMove(undefined, key, TODAY));
    expect(Object.keys(f.writes[0].data).sort()).toEqual([...MOVE_WRITES].sort());
    for (const k of Object.keys(f.writes[0].data)) expect(ALL_WRITES).toContain(k);
    const toast = p.store.getState().ui.toast;
    expect(toast).toMatchObject({ kind: 'saved', op: 'tick', line: { id: 'ticked', slots: { label: '0 1/8% Index-linked Treasury Gilt 2029' } } });
    expect(toast.previous).toEqual({ transition: undefined, lastModified: raw.lastModified });
    // the plan as written, read again: the move says 1 of N ticked; Undo puts the object back (none: null on an account)
    const ticked = applyPatch(p.plan, f.writes[0].data);
    p.store.dispatch({ type: A.PLANS_SET, list: [{ plan: ticked, newer: false, failed: false }], source: 'account', readAt: '14:05' });
    expect(viewFor(p.store.getState()).page.move.movesDone).toBe('1');
    p.store.dispatch({ type: A.PLAN_UNDO, planId: 'T1' });
    await tick(12);
    expect(f.writes).toHaveLength(2);
    expect(f.writes[1].data).toEqual({ transition: null, lastModified: raw.lastModified });
    // the untick on the ticked plan: the object without the key, never deleteField
    p.store.dispatch({ type: A.PLAN_TOAST_CLOSE });
    p.store.dispatch({ type: A.PLANS_SET, list: [{ plan: ticked, newer: false, failed: false }], source: 'account', readAt: '14:06' });
    p.store.dispatch({ type: A.PLAN_TICK, planId: 'T1', key, done: false });
    await tick(12);
    expect(f.writes).toHaveLength(3);
    expect(f.writes[2].data.transition).toEqual(untickMove(ticked.transition, key));
    expect(f.writes[2].data.transition).toEqual({ done: {} });
    expect(p.store.getState().ui.toast).toMatchObject({ kind: 'saved', op: 'tick', line: { id: 'unticked' } });
    expect(p.store.getState().ui.toast.previous).toEqual({ transition: ticked.transition, lastModified: ticked.lastModified });
    // a key that is not one of the moves
    p.store.dispatch({ type: A.PLAN_TOAST_CLOSE });
    p.store.dispatch({ type: A.PLAN_TICK, planId: 'T1', key: 'gilt:NONE', done: true });
    await tick(12);
    expect(f.writes).toHaveLength(3);
    expect(p.store.getState().ui.saveProblem).toEqual({ planId: 'T1', problem: 'problems' });
    // the document and the settings are never touched
    for (const w of f.writes) for (const k of Object.keys(w.data)) expect(k.startsWith('stressTool') || k.startsWith('decisionTool') || k.startsWith('planDocument')).toBe(false);
    stop();
  });
  it('an unlocked plan has no move to tick ("notLocked"); on a locked plan every other write stays refused', async () => {
    const raw = planted(C['12-lumpy-db-gia'], 'T2');
    const p = pageOn([raw], 'T2');
    const f = fakeFb();
    const stop = started(p, f);
    p.store.dispatch({ type: A.PLAN_TICK, planId: 'T2', key: 'bucket:shares', done: true });
    await tick(12);
    expect(f.writes).toEqual([]);
    expect(p.store.getState().ui.saveProblem).toEqual({ planId: 'T2', problem: 'notLocked' });
    stop();
    const locked = pageOn([planted(C['04-buckets-running'], 'T3')], 'T3');
    const g = fakeFb();
    const stopL = started(locked, g);
    locked.store.dispatch({ type: A.PLAN_SAVE, planId: 'T3' });
    await tick(12);
    expect(g.writes).toEqual([]);
    expect(locked.store.getState().ui.saveProblem).toEqual({ planId: 'T3', problem: 'locked' });
    stopL();
  });
  it('without an account: the tick folds into this window\'s plan, the other plan byte-identical, Undo byte for byte', async () => {
    const raw = planted(C['03-gilt-ladder-runup'], 'W1');
    const other = planted(C['02-pnv-draft'], 'W2');
    const plantedText = JSON.stringify([raw, other]);
    const sessionStore = { text: plantedText, getItem: (k) => (k === GUEST_PLANS_KEY ? sessionStore.text : null), setItem: (k, v) => { if (k === GUEST_PLANS_KEY) sessionStore.text = v; } };
    const p = pageOn([raw, other], 'W1', { source: 'window', session: 'nobody' });
    const f = fakeFb();
    const stop = started(p, f, { session: sessionStore });
    p.store.dispatch({ type: A.PLAN_TICK, planId: 'W1', key: 'gilt:T29', done: true });
    await tick(12);
    expect(f.writes).toEqual([]);
    const after = JSON.parse(sessionStore.text);
    const expected = tickPatch(p.plan, 'gilt:T29', { today: TODAY, done: true });
    expect(JSON.stringify(after[0])).toBe(JSON.stringify(applyPatch(raw, { ...expected.patch, lastModified: at.toISOString() })));
    expect(after[0].transition).toEqual({ done: { 'gilt:T29': TODAY } });
    expect(JSON.stringify(after[1])).toBe(JSON.stringify(other));
    p.store.dispatch({ type: A.PLANS_SET, list: upgradedList(after, noon(TODAY)), source: 'window', readAt: '14:05' });
    p.store.dispatch({ type: A.PLAN_UNDO, planId: 'W1' });
    await tick(12);
    expect(sessionStore.text).toBe(plantedText);
    stop();
  });
});
