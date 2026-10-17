/**
 * L5 (research/v7/editing-in-v7.md 10.6): the machinery of "Does it last?" — the reducer (a result for an old key is
 * dropped; the plans leaving memory clears it; readyMark), the runner with a fake client (progress, slow, failed and
 * "Try again", the page fallback when no worker can start, a stale result dropped when the plan changes under it), the
 * worker client's lane, and the worker handler's `lasts` message through the real handler (a fake run, then the real
 * lazily-loaded one: progress then a plain result).
 */
import { describe, it, expect, vi } from 'vitest';
import { createStore } from '../../../src/v7/effects/store.js';
import { initialState, emptyLasts } from '../../../src/v7/state/initial.js';
import { reduce } from '../../../src/v7/state/reduce.js';
import { A } from '../../../src/v7/state/actions.js';
import { parse } from '../../../src/v7/router/routes.js';
import { readyMark } from '../../../src/v7/state/select.js';
import { viewFor, upgradedList } from '../../../src/v7/effects/planSource.js';
import { startLastsRunner, SLOW_MS } from '../../../src/v7/effects/lasts.js';
import { createHandler } from '../../../src/v7/effects/answerWorker.js';
import { createWorkerClient, NO_WORKER } from '../../../src/v7/effects/workerClient.js';
import { runKeyOf } from '../../../src/answers/plan/lasts.js';
import { corpus, entryOf, TODAY, noon } from '../plan/_plans.js';

const C = corpus();
const LUMPY = C['12-lumpy-db-gia'];
const tick = async (n = 6) => { for (let i = 0; i < n; i++) await new Promise((r) => setTimeout(r, 0)); };
const RESULT = { strategyId: 'pots-and-valves', a: { share: 0.93, chancePct: 93, years: 32 }, history: { worst: [], named: [] }, stored: null };

/** A store on the lasts step of a plan, the plans read (account), the reading done as the plan source does it. */
function pageOn(raws, planId, { step = 'lasts' } = {}) {
  const store = createStore(initialState({ today: TODAY, build: 'test' }), reduce);
  store.dispatch({ type: A.ROUTE_SET, route: parse('#/plan/' + planId + '/' + step) });
  store.dispatch({ type: A.SESSION_SET, session: { kind: 'in', email: 'a@b.c' } });
  const list = upgradedList(raws, noon(TODAY));
  store.dispatch({ type: A.PLANS_SET, list, source: 'account', readAt: '14:03' });
  store.dispatch({ type: A.PLANS_VIEW, view: viewFor(store.getState()) });
  // the plan source's own reading after every change (the page does this itself; here by hand)
  store.subscribe((state) => { if (state.plans && state.plans.status === 'read' && (!state.plans.view || state.plans.view.page === undefined)) store.dispatch({ type: A.PLANS_VIEW, view: viewFor(state) }); });
  return { store, key: runKeyOf(list.find((e) => String(e.plan.id) === String(planId)).plan) };
}

describe('the reducer: the one test\'s result in page memory', () => {
  const s0 = initialState({ today: TODAY, build: 'test' });
  it('starts empty; working, progress, done for one key; a result for another key is dropped; failed; slow; retry', () => {
    expect(s0.lasts).toEqual(emptyLasts());
    let s = reduce(s0, { type: A.LASTS_WORKING, key: 'k1' });
    expect(s.lasts).toEqual({ key: 'k1', status: 'working', reason: null, result: null, progress: null, slow: false });
    s = reduce(s, { type: A.LASTS_PROGRESS, key: 'k1', done: 1, total: 2 });
    expect(s.lasts.progress).toEqual({ done: 1, total: 2 });
    expect(reduce(s, { type: A.LASTS_PROGRESS, key: 'k2', done: 2, total: 2 })).toBe(s);
    expect(reduce(s, { type: A.LASTS_DONE, key: 'k2', result: RESULT })).toBe(s);                 // stale
    s = reduce(s, { type: A.LASTS_SLOW, key: 'k1' });
    expect(s.lasts.slow).toBe(true);
    s = reduce(s, { type: A.LASTS_DONE, key: 'k1', result: RESULT });
    expect(s.lasts).toEqual({ key: 'k1', status: 'done', reason: null, result: RESULT, progress: null, slow: false });
    expect(reduce(s, { type: A.LASTS_DONE, key: 'k1', result: RESULT })).toBe(s);                 // not working any more
    expect(reduce(s, { type: A.LASTS_FAILED, key: 'k1' })).toBe(s);
    // a new run for another key keeps the old result until the new one comes (greyed on the screen)
    const w = reduce(s, { type: A.LASTS_WORKING, key: 'k2' });
    expect(w.lasts).toMatchObject({ key: 'k2', status: 'working', result: RESULT });
    const f = reduce(w, { type: A.LASTS_FAILED, key: 'k2' });
    expect(f.lasts).toMatchObject({ status: 'failed', reason: null });
    expect(reduce(w, { type: A.LASTS_FAILED, key: 'k2', reason: 'noWorker' }).lasts.reason).toBe('noWorker');
    expect(reduce(f, { type: A.LASTS_RETRY }).lasts.status).toBe('idle');
    expect(reduce(s, { type: A.LASTS_RETRY })).toBe(s);
    expect(() => reduce(s0, { type: A.LASTS_WORKING })).toThrow(/needs a key/);
    expect(() => reduce(reduce(s0, { type: A.LASTS_WORKING, key: 'k1' }), { type: A.LASTS_DONE, key: 'k1', result: null })).toThrow(/needs a result/);
  });
  it('the plans leaving memory clears it; state/replace takes a result or starts empty; the state survives JSON', () => {
    let s = reduce(reduce(s0, { type: A.LASTS_WORKING, key: 'k1' }), { type: A.LASTS_DONE, key: 'k1', result: RESULT });
    expect(reduce(s, { type: A.PLANS_CLEAR }).lasts).toEqual(emptyLasts());
    expect(JSON.parse(JSON.stringify(s))).toEqual(s);
    const r = reduce(s0, { type: A.STATE_REPLACE, state: { ...s, lasts: { key: 'k9', status: 'done', result: RESULT } } });
    expect(r.lasts).toEqual({ key: 'k9', status: 'done', reason: null, result: RESULT, progress: null, slow: false });
    expect(reduce(s0, { type: A.STATE_REPLACE, state: { ...s, lasts: { key: 3, status: 'done' } } }).lasts).toEqual(emptyLasts());
  });
  it('readyMark: a run under way, or one due for the plan on the step, is not ready; a result for the key is', () => {
    const { store, key } = pageOn([LUMPY], LUMPY.id);
    expect(readyMark(store.getState()).ready).toBe('0');                                        // due: no result for the key
    store.dispatch({ type: A.LASTS_WORKING, key });
    expect(readyMark(store.getState()).ready).toBe('0');
    store.dispatch({ type: A.LASTS_DONE, key, result: RESULT });
    expect(readyMark(store.getState()).ready).toBe('1');
    store.dispatch({ type: A.LASTS_WORKING, key: 'other' });
    expect(readyMark(store.getState()).ready).toBe('0');
    store.dispatch({ type: A.LASTS_FAILED, key: 'other' });
    expect(readyMark(store.getState()).ready, 'a failed run for another key: this key is still due').toBe('0');
    // off the step, a held result does not matter
    const away = pageOn([LUMPY], LUMPY.id, { step: 'plan' });
    expect(readyMark(away.store.getState()).ready).toBe('1');
  });
});

describe('the runner', () => {
  const fakeClient = (fn, { stopped = [] } = {}) => ({ lasts: fn, stop: (q) => stopped.push(q) });
  it('runs the plan on the step once, with progress, and files the result under the page\'s key; nothing is run again for the same key', async () => {
    const { store, key } = pageOn([LUMPY], LUMPY.id);
    const calls = [];
    const client = fakeClient((plan, env, onProgress) => { calls.push({ id: plan.id, env }); onProgress(0, 2); onProgress(1, 2); return Promise.resolve(RESULT); });
    const stop = startLastsRunner({ store, client });
    await tick();
    expect(calls).toEqual([{ id: LUMPY.id, env: { today: TODAY } }]);
    expect(store.getState().lasts).toEqual({ key, status: 'done', reason: null, result: RESULT, progress: null, slow: false });
    store.dispatch({ type: A.UI_RAIL, open: true });
    await tick();
    expect(calls.length).toBe(1);
    stop();
  });
  it('a failed run: "failed", then "Try again" runs it again; no worker: failed with the reason, nothing run on the page', async () => {
    const { store, key } = pageOn([LUMPY], LUMPY.id);
    let n = 0;
    const client = fakeClient(() => (++n === 1 ? Promise.reject(new Error('boom')) : Promise.resolve(RESULT)));
    const stop = startLastsRunner({ store, client });
    await tick();
    expect(store.getState().lasts).toMatchObject({ key, status: 'failed', reason: null });
    store.dispatch({ type: A.LASTS_RETRY });
    await tick();
    expect(store.getState().lasts).toMatchObject({ key, status: 'done', result: RESULT });
    stop();
    const page2 = pageOn([LUMPY], LUMPY.id);
    const none = vi.fn(() => Promise.reject(Object.assign(new Error('none'), { code: NO_WORKER })));
    const stop2 = startLastsRunner({ store: page2.store, client: fakeClient(none) });
    await tick(10);
    expect(none).toHaveBeenCalledTimes(1);
    expect(page2.store.getState().lasts).toMatchObject({ key: page2.key, status: 'failed', reason: 'noWorker', result: null });
    stop2();
  });
  it('the plan changes under a run: the first result is dropped and the new key is run; the slow flag after SLOW_MS', async () => {
    vi.useFakeTimers();
    try {
      const { store, key } = pageOn([LUMPY], LUMPY.id);
      const resolvers = [];
      const stopped = [];
      const client = fakeClient(() => new Promise((resolve) => resolvers.push(resolve)), { stopped });
      const stop = startLastsRunner({ store, client });
      await vi.advanceTimersByTimeAsync(0);
      expect(store.getState().lasts).toMatchObject({ key, status: 'working' });
      await vi.advanceTimersByTimeAsync(SLOW_MS + 1);
      expect(store.getState().lasts.slow).toBe(true);
      // the plan is saved (its stamp moves): a new key, the old run ended
      const changed = JSON.parse(JSON.stringify(LUMPY));
      changed.lastModified = '2026-10-02T14:03:00.000Z';
      store.dispatch({ type: A.PLANS_SET, list: upgradedList([changed], noon(TODAY)), source: 'account', readAt: '14:04' });
      store.dispatch({ type: A.PLANS_VIEW, view: viewFor(store.getState()) });
      await vi.advanceTimersByTimeAsync(0);
      const key2 = runKeyOf(upgradedList([changed], noon(TODAY))[0].plan);
      expect(key2).not.toBe(key);
      expect(stopped).toEqual(['lasts']);
      expect(store.getState().lasts).toMatchObject({ key: key2, status: 'working' });
      resolvers[0]({ ...RESULT, strategyId: 'old' });        // the old run's result arrives late
      await vi.advanceTimersByTimeAsync(0);
      expect(store.getState().lasts.status).toBe('working');
      resolvers[1](RESULT);
      await vi.advanceTimersByTimeAsync(0);
      expect(store.getState().lasts).toMatchObject({ key: key2, status: 'done', result: RESULT });
      stop();
    } finally { vi.useRealTimers(); }
  });
  it('off the step nothing runs; a plan shown as saved (no run key) is not run', async () => {
    const away = pageOn([LUMPY], LUMPY.id, { step: 'plan' });
    const fn = vi.fn(() => Promise.resolve(RESULT));
    const stop = startLastsRunner({ store: away.store, client: fakeClient(fn) });
    await tick();
    expect(fn).not.toHaveBeenCalled();
    stop();
    const store = createStore(initialState({ today: TODAY, build: 'test' }), reduce);
    store.dispatch({ type: A.ROUTE_SET, route: parse('#/plan/' + LUMPY.id + '/lasts') });
    store.dispatch({ type: A.SESSION_SET, session: { kind: 'in', email: 'a@b.c' } });
    store.dispatch({ type: A.PLANS_SET, list: upgradedList([LUMPY], noon(TODAY)).map((e) => ({ ...e, newer: true })), source: 'account', readAt: '14:03' });
    store.dispatch({ type: A.PLANS_VIEW, view: viewFor(store.getState()) });
    const stop2 = startLastsRunner({ store, client: fakeClient(fn) });
    await tick();
    expect(fn).not.toHaveBeenCalled();
    expect(store.getState().lasts).toEqual(emptyLasts());
    stop2();
  });
});

describe('the worker: the `lasts` message, and the client\'s lane', () => {
  const plan = entryOf(LUMPY).plan;
  const collect = async (handle, msg) => { const out = []; handle(msg, (m) => out.push(m)); await tick(12); return out; };
  it('a fake run through the real handler: progress then the result, plain data; the date from init when the message has none; a throw → error', async () => {
    const seen = [];
    const fake = (p, { today, onProgress }) => { seen.push([p.id, today]); onProgress(0, 2); onProgress(1, 2); return { strategyId: 'x', a: { share: 0.5 }, f: () => 1 }; };
    const handle = createHandler(undefined, { lasts: fake });
    handle({ id: 1, type: 'init', today: '2026-10-02' }, () => {});
    const out = await collect(handle, { id: 2, type: 'lasts', plan, env: {} });
    expect(seen).toEqual([[LUMPY.id, '2026-10-02']]);
    expect(out).toEqual([{ id: 2, progress: { done: 0, total: 2 } }, { id: 2, progress: { done: 1, total: 2 } }, { id: 2, result: { strategyId: 'x', a: { share: 0.5 } } }]);
    const bad = await collect(createHandler(undefined, { lasts: () => { throw new Error('boom'); } }), { id: 3, type: 'lasts', plan, env: { today: TODAY } });
    expect(bad).toEqual([{ id: 3, error: 'boom' }]);
    expect(await collect(createHandler(), { id: 4, type: 'lasts', env: {} })).toEqual([{ id: 4, error: expect.stringMatching(/no plan/) }]);
  });
  it('the real run, loaded lazily by the handler: progress then a plain result with the one answer\'s figures', async () => {
    const out = [];
    const handle = createHandler();
    handle({ id: 5, type: 'lasts', plan, env: { today: TODAY } }, (m) => out.push(m));
    for (let i = 0; i < 200 && !out.some((m) => 'result' in m || 'error' in m); i++) await new Promise((r) => setTimeout(r, 25));
    const last = out[out.length - 1];
    expect(out.slice(0, -1).map((m) => m.progress)).toEqual([{ done: 0, total: 2 }, { done: 1, total: 2 }]);
    expect(last.result).toBeTruthy();
    expect(last.result.strategyId).toBe('pots-and-valves');
    expect(last.result.a.futures).toBe(1000);
    expect(() => structuredClone(last.result)).not.toThrow();
  }, 30000);
  it('the client sends the plan as data on its own lane; stop("lasts") ends it and nothing else; no worker → NO_WORKER', async () => {
    const received = [];
    const handle = (msg, post) => { received.push(msg); if (msg.type === 'init') post({ id: msg.id, ready: true }); };
    const made = [];
    // delivered a moment later, as a real worker does (the client sets its listeners after making the worker)
    const makeWorker = () => { const w = { onmessage: null, onerror: null, terminated: false, postMessage(m) { const copy = JSON.parse(JSON.stringify(m)); received.push(copy); queueMicrotask(() => { if (!w.terminated) handle(copy, (r) => w.onmessage && w.onmessage({ data: r })); }); }, terminate() { w.terminated = true; } }; made.push(w); return w; };
    const client = createWorkerClient({ makeWorker });
    await client.init(TODAY);
    const p = client.lasts({ ...plan, f: () => 1 }, { today: TODAY }, () => {});
    const sent = received.find((m) => m.type === 'lasts');
    expect(sent.plan.id).toBe(LUMPY.id);
    expect('f' in sent.plan).toBe(false);
    client.stop('c');                                   // another lane: the run goes on
    expect(made[0].terminated).toBe(false);
    client.stop('lasts');
    await expect(p).rejects.toMatchObject({ code: 'stopped' });
    expect(made[0].terminated).toBe(true);
    const none = createWorkerClient({ makeWorker: () => null });
    await expect(none.lasts(plan, { today: TODAY })).rejects.toMatchObject({ code: NO_WORKER });
  });
});
