/**
 * The machinery of the three levers on "Does it last?" (research/v7/answer-D.md 3.9; road-to-7.md step 7): the reducer
 * (a lever is tried only on the run held; the work lever opens its boxes first and refuses figures that will not do; a
 * result for a stale key is dropped; the plan changing under a lever puts it away; closing forgets it; state/replace),
 * the runner with a fake client (the lever runs in its own lane on the plan of the run held; failed and no worker; a key
 * that moved ends the run), the worker handler's `lever` message, and the client's lane. Nothing is written anywhere.
 */
import { describe, it, expect, vi } from 'vitest';
import { createStore } from '../../../src/v7/effects/store.js';
import { initialState, emptyLasts, cleanLever } from '../../../src/v7/state/initial.js';
import { reduce } from '../../../src/v7/state/reduce.js';
import { A } from '../../../src/v7/state/actions.js';
import { parse } from '../../../src/v7/router/routes.js';
import { viewFor, upgradedList } from '../../../src/v7/effects/planSource.js';
import { startLastsRunner } from '../../../src/v7/effects/lasts.js';
import { createHandler } from '../../../src/v7/effects/answerWorker.js';
import { createWorkerClient, NO_WORKER } from '../../../src/v7/effects/workerClient.js';
import { runKeyOf } from '../../../src/answers/plan/lasts.js';
import { corpus, TODAY, noon } from '../plan/_plans.js';

const C = corpus();
const ALEX = C['02-pnv-draft'];
const tick = async (n = 6) => { for (let i = 0; i < n; i++) await new Promise((r) => setTimeout(r, 0)); };
const RESULT = { strategyId: 'pots-and-valves', a: { share: 0.93, chancePct: 93, years: 32, typicalLeft: 100 }, history: { worst: [], named: [] }, stored: null };
const FALL = { kind: 'fall', ok: true, runs: 1, share: 0.2, potBefore: 10, potAfter: 8, at: { share: 0.9, chancePct: 90, typicalLeft: 1, badCaseLeft: 0, years: 32, lasts: true } };

function pageOn(raws, planId) {
  const store = createStore(initialState({ today: TODAY, build: 'test' }), reduce);
  store.dispatch({ type: A.ROUTE_SET, route: parse('#/plan/' + planId + '/lasts') });
  store.dispatch({ type: A.SESSION_SET, session: { kind: 'in', email: 'a@b.c' } });
  const list = upgradedList(raws, noon(TODAY));
  store.dispatch({ type: A.PLANS_SET, list, source: 'account', readAt: '14:03' });
  store.dispatch({ type: A.PLANS_VIEW, view: viewFor(store.getState()) });
  store.subscribe((state) => { if (state.plans && state.plans.status === 'read' && (!state.plans.view || state.plans.view.page === undefined)) store.dispatch({ type: A.PLANS_VIEW, view: viewFor(state) }); });
  const key = runKeyOf(list.find((e) => String(e.plan.id) === String(planId)).plan);
  return { store, key };
}
const held = (key) => [{ type: A.LASTS_WORKING, key }, { type: A.LASTS_DONE, key, result: RESULT }];
const run = (s, ...actions) => actions.reduce((x, a) => reduce(x, a), s);

describe('the reducer', () => {
  const s0 = initialState({ today: TODAY, build: 'test' });
  it('a lever is tried only once the run is held; the work lever opens its boxes first, then tries what is typed, refusing what will not do', () => {
    expect(reduce(s0, { type: A.LEVER_TRY, kind: 'fall' })).toBe(s0);                                      // nothing held
    expect(reduce(reduce(s0, { type: A.LASTS_WORKING, key: 'k1' }), { type: A.LEVER_TRY, kind: 'fall' }).lasts.levers).toEqual({});
    let s = run(s0, ...held('k1'));
    s = reduce(s, { type: A.LEVER_TRY, kind: 'fall' });
    expect(s.lasts.levers.fall).toEqual({ status: 'working', lever: { kind: 'fall' }, result: null, reason: null });
    expect(reduce(s, { type: A.LEVER_TRY, kind: 'fall' })).toBe(s);                                       // once
    s = reduce(s, { type: A.LEVER_TRY, kind: 'work' });
    expect(s.lasts.levers.work).toEqual({ status: 'open', lever: { kind: 'work' }, result: null, reason: null });
    s = reduce(s, { type: A.LEVER_TRY, kind: 'work' });
    expect(s.lasts.levers.work).toMatchObject({ status: 'invalid', reason: 'yearly' });
    s = run(s, { type: A.LEVER_TYPE, field: 'yearly', value: '15,000' }, { type: A.LEVER_TYPE, field: 'years', value: '2.5' });
    expect(s.lasts.workDraft).toEqual({ yearly: '15,000', years: '2.5' });
    expect(s.lasts.levers.work.status).toBe('open');                                                      // typing puts a try away
    s = reduce(s, { type: A.LEVER_TRY, kind: 'work' });
    expect(s.lasts.levers.work).toMatchObject({ status: 'invalid', reason: 'years' });
    s = run(s, { type: A.LEVER_TYPE, field: 'years', value: '3' }, { type: A.LEVER_TRY, kind: 'work' });
    expect(s.lasts.levers.work).toEqual({ status: 'working', lever: { kind: 'work', yearly: 15000, years: 3 }, result: null, reason: null });
    expect(() => reduce(s, { type: A.LEVER_TRY, kind: 'sideways' })).toThrow(/no lever/);
    expect(() => reduce(s, { type: A.LEVER_TYPE, field: 'pot', value: '1' })).toThrow();
  });
  it('done and failed file under the run\'s key; a stale key, or a lever not working, is dropped; closing forgets it', () => {
    let s = run(s0, ...held('k1'), { type: A.LEVER_TRY, kind: 'fall' });
    expect(reduce(s, { type: A.LEVER_DONE, key: 'k2', kind: 'fall', result: FALL })).toBe(s);
    expect(reduce(s, { type: A.LEVER_DONE, key: 'k1', kind: 'work', result: FALL })).toBe(s);
    expect(() => reduce(s, { type: A.LEVER_DONE, key: 'k1', kind: 'fall', result: null })).toThrow(/needs a result/);
    const done = reduce(s, { type: A.LEVER_DONE, key: 'k1', kind: 'fall', result: FALL });
    expect(done.lasts.levers.fall).toEqual({ status: 'done', lever: { kind: 'fall' }, result: FALL, reason: null });
    expect(reduce(done, { type: A.LEVER_DONE, key: 'k1', kind: 'fall', result: FALL })).toBe(done);
    const failed = reduce(s, { type: A.LEVER_FAILED, key: 'k1', kind: 'fall', reason: 'noWorker' });
    expect(failed.lasts.levers.fall).toMatchObject({ status: 'failed', reason: 'noWorker' });
    expect(reduce(s, { type: A.LEVER_FAILED, key: 'k1', kind: 'fall' }).lasts.levers.fall.reason).toBe(null);
    const closed = reduce(done, { type: A.LEVER_CLOSE, kind: 'fall' });
    expect(closed.lasts.levers).toEqual({});
    expect(reduce(closed, { type: A.LEVER_CLOSE, kind: 'fall' })).toBe(closed);
    expect(JSON.parse(JSON.stringify(done))).toEqual(done);
  });
  it('the plan changing under a lever (a new key) puts every lever away, the boxes stay as typed; the plans leaving memory clears all; state/replace', () => {
    let s = run(s0, ...held('k1'), { type: A.LEVER_TYPE, field: 'yearly', value: '12,000' }, { type: A.LEVER_TRY, kind: 'fall' });
    s = reduce(s, { type: A.LEVER_DONE, key: 'k1', kind: 'fall', result: FALL });
    const moved = reduce(s, { type: A.LASTS_WORKING, key: 'k2' });
    expect(moved.lasts.levers).toEqual({});
    expect(moved.lasts.workDraft.yearly).toBe('12,000');
    expect(reduce(s, { type: A.LASTS_WORKING, key: 'k1' }).lasts.levers.fall.status).toBe('done');          // the same key keeps them
    expect(reduce(s, { type: A.PLANS_CLEAR }).lasts).toEqual(emptyLasts());
    const r = reduce(s0, { type: A.STATE_REPLACE, state: { ...s, lasts: { ...s.lasts, levers: { fall: s.lasts.levers.fall, work: { status: 'sideways' }, spendMore: null } } } });
    expect(r.lasts.levers).toEqual({ fall: s.lasts.levers.fall });
    expect(r.lasts.workDraft).toEqual({ yearly: '12,000', years: '' });
    expect(cleanLever({ status: 'done', lever: { kind: 'fall' }, result: FALL, reason: 'noWorker' })).toEqual({ status: 'done', lever: { kind: 'fall' }, result: FALL, reason: null });
    expect(cleanLever({ status: 'working', lever: { kind: 'x' } })).toBe(null);
  });
});

describe('the runner: a lever runs in the worker\'s own lane on the plan of the run held', () => {
  const fakeClient = (lever, { lasts = () => Promise.resolve(RESULT), stopped = [] } = {}) => ({ lasts, lever, stop: (q) => stopped.push(q) });
  it('lasts/leverTry → client.lever(plan, { today, lever }) → lasts/leverDone under the key; nothing is run for a lever not tried', async () => {
    const { store, key } = pageOn([ALEX], ALEX.id);
    const calls = [];
    const client = fakeClient((plan, env) => { calls.push({ id: plan.id, env }); return Promise.resolve(FALL); });
    const stop = startLastsRunner({ store, client });
    await tick();
    expect(store.getState().lasts).toMatchObject({ key, status: 'done' });
    expect(calls).toEqual([]);
    store.dispatch({ type: A.LEVER_TRY, kind: 'fall' });
    await tick();
    expect(calls).toEqual([{ id: ALEX.id, env: { today: TODAY, lever: { kind: 'fall' } } }]);
    expect(store.getState().lasts.levers.fall).toEqual({ status: 'done', lever: { kind: 'fall' }, result: FALL, reason: null });
    // the page's reading carries the lever's words (the plan source reads again on every change of the levers)
    const page = viewFor(store.getState()).page;
    expect(page.lasts.levers.fall.status).toBe('done');
    expect(page.lasts.levers.fall.lines[0].id).toBe('fall.line');
    stop();
  });
  it('a lever that fails, and no worker; a key that moves under a lever ends its run and drops its answer', async () => {
    const { store } = pageOn([ALEX], ALEX.id);
    let n = 0;
    const stopped = [];
    const client = fakeClient(() => (++n === 1 ? Promise.reject(new Error('boom')) : Promise.reject(Object.assign(new Error('none'), { code: NO_WORKER }))), { stopped });
    const stop = startLastsRunner({ store, client });
    await tick();
    store.dispatch({ type: A.LEVER_TRY, kind: 'spendMore' });
    await tick();
    expect(store.getState().lasts.levers.spendMore).toMatchObject({ status: 'failed', reason: null });
    store.dispatch({ type: A.LEVER_TRY, kind: 'spendMore' });
    await tick();
    expect(store.getState().lasts.levers.spendMore).toMatchObject({ status: 'failed', reason: 'noWorker' });
    stop();
    const page2 = pageOn([ALEX], ALEX.id);
    const resolvers = [];
    const stopped2 = [];
    const client2 = fakeClient(() => new Promise((resolve) => resolvers.push(resolve)), { stopped: stopped2 });
    const stop2 = startLastsRunner({ store: page2.store, client: client2 });
    await tick();
    page2.store.dispatch({ type: A.LEVER_TRY, kind: 'fall' });
    await tick();
    expect(page2.store.getState().lasts.levers.fall.status).toBe('working');
    page2.store.dispatch({ type: A.LASTS_WORKING, key: 'moved' });                                      // the plan changed
    await tick();
    expect(stopped2).toContain('lever');
    resolvers[0](FALL);
    await tick();
    expect(page2.store.getState().lasts.levers).toEqual({});
    stop2();
  });
});

describe('the worker: the `lever` message, and the client\'s lane', () => {
  const collect = (handle, msg) => new Promise((resolve) => { const out = []; handle(msg, (m) => { out.push(m); if ('result' in m || 'error' in m) resolve(out); }); });
  it('runs the lever handed in with the plan and the lever, posts progress then a plain result; refuses a message with no plan or no lever', async () => {
    const seen = [];
    const handle = createHandler(undefined, { lever: (plan, { today, lever, onProgress }) => { seen.push({ id: plan.id, today, lever }); onProgress(0, 1); onProgress(1, 1); return { ...FALL, basis: { today } }; } });
    const out = await collect(handle, { id: 7, type: 'lever', plan: { id: 'p1' }, env: { today: TODAY, lever: { kind: 'fall' } } });
    expect(seen).toEqual([{ id: 'p1', today: TODAY, lever: { kind: 'fall' } }]);
    expect(out[out.length - 1]).toEqual({ id: 7, result: { ...FALL, basis: { today: TODAY } } });
    expect(await collect(createHandler(), { id: 8, type: 'lever', env: { today: TODAY, lever: { kind: 'fall' } } })).toEqual([{ id: 8, error: expect.stringMatching(/no plan/) }]);
    expect(await collect(createHandler(), { id: 9, type: 'lever', plan: { id: 'p1' }, env: { today: TODAY } })).toEqual([{ id: 9, error: expect.stringMatching(/no lever/) }]);
    const bad = await collect(createHandler(undefined, { lever: () => { throw new Error('boom'); } }), { id: 10, type: 'lever', plan: { id: 'p1' }, env: { today: TODAY, lever: { kind: 'fall' } } });
    expect(bad).toEqual([{ id: 10, error: 'boom' }]);
  });
  it('the client sends the plan as data on its own lane; stop("lever") ends it and nothing else; no worker → NO_WORKER', async () => {
    const received = [];
    const handle = (msg, post) => { received.push(msg); if (msg.type === 'init') post({ id: msg.id, ready: true }); };
    const made = [];
    const makeWorker = () => { const w = { onmessage: null, onerror: null, terminated: false, postMessage(m) { const copy = JSON.parse(JSON.stringify(m)); received.push(copy); queueMicrotask(() => { if (!w.terminated) handle(copy, (r) => w.onmessage && w.onmessage({ data: r })); }); }, terminate() { w.terminated = true; } }; made.push(w); return w; };
    const client = createWorkerClient({ makeWorker });
    await client.init(TODAY);
    const p = client.lever({ id: 'p1', f: () => 1 }, { today: TODAY, lever: { kind: 'work', yearly: 15000, years: 3 } });
    const sent = received.find((m) => m.type === 'lever');
    expect(sent).toMatchObject({ type: 'lever', plan: { id: 'p1' }, env: { today: TODAY, lever: { kind: 'work', yearly: 15000, years: 3 } } });
    expect('f' in sent.plan).toBe(false);
    client.stop('lasts');                                   // another lane: the run goes on
    expect(made[0].terminated).toBe(false);
    client.stop('lever');
    await expect(p).rejects.toMatchObject({ code: 'stopped' });
    expect(made[0].terminated).toBe(true);
    const none = createWorkerClient({ makeWorker: () => null });
    await expect(none.lever({ id: 'p1' }, { today: TODAY, lever: { kind: 'fall' } })).rejects.toMatchObject({ code: NO_WORKER });
  });
});
