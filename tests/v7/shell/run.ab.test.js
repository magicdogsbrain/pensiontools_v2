/**
 * The runner for questions A and B (step 4 brief 4.11, conflict 43), with a fake worker.
 *
 *  - The answer step: C's two passes (100 → answer/first, 1,000 → answer/final) at the step's default detail.
 *  - An optional step (A's ages, B's choices): one more pass at 1,000 with more detail — answer/extend, then
 *    answer/final. Three passes in all when the step is opened with no answer yet.
 *  - A change mid-extend ends it; a stale answer/final never reaches the state.
 *  - Each question runs in its own lane: starting A never ends a run of C that is still under way.
 * C's own behaviour is pinned in run.test.js.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
vi.mock('../../../src/v7/rail/questions.js', async () => (await import('./_allOpen.js')).allOpen());

import { createStore } from '../../../src/v7/effects/store.js';
import { startRunner, WAIT_MS, SLOW_MS } from '../../../src/v7/effects/run.js';
import { NO_WORKER } from '../../../src/v7/effects/workerClient.js';
import { reduce } from '../../../src/v7/state/reduce.js';
import { currentKey, readyMark } from '../../../src/v7/state/select.js';
import { A } from '../../../src/v7/state/actions.js';
import { ANSWERS } from '../../../src/answers/index.js';
import { fresh, set, route, typedA, typedB, typedC, resultA, resultB } from './_open.js';
import { deferred } from './_shell.js';

/** A stand-in for the worker client that knows which question each call is for; stop(q) ends only q's calls. */
function fakeClient({ broken = false } = {}) {
  const calls = [];
  const client = {
    calls,
    stops: [],
    inits: [],
    init(today) { client.inits.push(today); return broken ? Promise.reject(Object.assign(new Error('x'), { code: NO_WORKER })) : Promise.resolve({ historyEnd: null, engineVersion: 'x' }); },
    answer(q, inputs, env, onProgress) {
      if (broken) return Promise.reject(Object.assign(new Error('x'), { code: NO_WORKER }));
      const d = deferred();
      const call = { q, inputs, env, onProgress, ...d, stopped: false, settled: false };
      calls.push(call);
      return d.promise;
    },
    stop(q) {
      client.stops.push(q);
      for (const c of calls) {
        if (c.stopped || c.settled || (q !== undefined && c.q !== q)) continue;
        c.stopped = true;
        c.reject(Object.assign(new Error('stopped'), { code: 'stopped' }));
      }
    }
  };
  return client;
}
const flush = async () => { for (let i = 0; i < 10; i++) await Promise.resolve(); };
const settle = async (call, value) => { call.settled = true; call.resolve(value); await flush(); };
const fail = async (call, err = new Error('boom')) => { call.settled = true; call.reject(err); await flush(); };
const envOf = (call) => ({ futures: call.env.futures, detail: call.env.detail });

function setUp({ start = typedA(), q = 'a', step = 'answer', client = fakeClient(), local = () => resultA() } = {}) {
  const store = createStore(start, reduce);
  const seen = [];
  store.subscribe((state, action) => seen.push(action));
  if (step) store.dispatch({ type: A.ROUTE_SET, route: route('step', q, step) });
  seen.length = 0;
  const stop = startRunner({ store, client, local });
  const types = (question = q) => seen.filter((a) => a.type.startsWith('answer/') && a.type !== A.ANSWER_PROGRESS && a.q === question).map((a) => a.type);
  return { store, client, seen, types, stop, answer: (question = q) => store.getState().answers[question], go: (qq, s) => store.dispatch({ type: A.ROUTE_SET, route: route('step', qq, s) }) };
}

beforeEach(() => { vi.useFakeTimers(); });
afterEach(() => { vi.useRealTimers(); });

describe('the answer step: C\'s two passes at the step\'s default detail', () => {
  it('A: 100 → first, 1,000 → final, both at "chart"', async () => {
    const { client, types, answer, store } = setUp();
    expect(client.calls.length).toBe(1);
    expect(client.calls[0].q).toBe('a');
    expect(client.calls[0].env).toEqual({ today: '2026-09-30', futures: 100, seed: 0, trace: false, detail: 'chart' });
    expect(client.calls[0].inputs).toMatchObject({ you: { age: 50, pot: 250000 }, stop: { kind: 'age', age: 60 }, spend: { kind: 'amount', amount: 2000 } });
    await settle(client.calls[0], resultA({ detail: 'chart' }));
    expect(answer().status).toBe('first');
    expect(client.calls[1].env).toEqual({ today: '2026-09-30', futures: 1000, seed: 0, trace: false, detail: 'chart' });
    await settle(client.calls[1], resultA({ detail: 'chart' }));
    expect(answer()).toMatchObject({ status: 'final', detail: 'chart', extending: false, inputsKey: currentKey(store.getState(), 'a') });
    expect(types()).toEqual([A.ANSWER_WORKING, A.ANSWER_FIRST, A.ANSWER_FINAL]);
    vi.advanceTimersByTime(60000);
    expect(client.calls.length).toBe(2);
  });
  it('B: at "answer"', async () => {
    const { client } = setUp({ start: typedB(), q: 'b' });
    expect(client.calls[0].q).toBe('b');
    expect(envOf(client.calls[0])).toEqual({ futures: 100, detail: 'answer' });
    await settle(client.calls[0], resultB());
    expect(envOf(client.calls[1])).toEqual({ futures: 1000, detail: 'answer' });
  });
  it('the real stub answers take the env as it is sent', async () => {
    const local = vi.fn((q, inputs, env) => ANSWERS[q].answer(inputs, env));
    const { answer } = setUp({ client: fakeClient({ broken: true }), local });
    for (let i = 0; i < 4; i++) { await flush(); await vi.advanceTimersByTimeAsync(1); }
    expect(local.mock.calls.map((c) => [c[0], c[2].futures, c[2].detail])).toEqual([['a', 100, 'chart'], ['a', 1000, 'chart']]);
    expect(answer()).toMatchObject({ status: 'final', detail: 'chart' });
    expect(answer().result.basis.detail).toBe('chart');
  });
});

describe('an optional step: one more pass at 1,000 with more detail', () => {
  it('A\'s ages step opened with no answer: chart 100, chart 1,000, then all 1,000 — working, first, final, extend, final', async () => {
    const { client, types, answer, store } = setUp({ step: 'ages' });
    expect(readyMark(store.getState()).answer).toBe('none');
    await settle(client.calls[0], resultA({ detail: 'chart' }));
    await settle(client.calls[1], resultA({ detail: 'chart' }));
    expect(client.calls.length).toBe(3);
    expect(client.calls.map(envOf)).toEqual([{ futures: 100, detail: 'chart' }, { futures: 1000, detail: 'chart' }, { futures: 1000, detail: 'all' }]);
    expect(client.calls[2].inputs).toEqual(client.calls[0].inputs);
    expect(answer()).toMatchObject({ status: 'final', extending: true, detail: 'chart' });
    expect(readyMark(store.getState())).toEqual({ ready: '0', answer: 'partial' });
    client.calls[2].onProgress(400, 1000);
    expect(answer().progress).toEqual({ done: 400, total: 1000 });
    await settle(client.calls[2], resultA({ detail: 'all' }));
    expect(answer()).toMatchObject({ status: 'final', extending: false, detail: 'all', progress: null });
    expect(readyMark(store.getState())).toEqual({ ready: '1', answer: 'final' });
    expect(types()).toEqual([A.ANSWER_WORKING, A.ANSWER_FIRST, A.ANSWER_FINAL, A.ANSWER_EXTEND, A.ANSWER_FINAL]);
    vi.advanceTimersByTime(60000);
    expect(client.calls.length).toBe(3);
  });
  it('from a final answer, opening the step starts the extra pass at once (no wait for typing)', async () => {
    const { client, answer, go, types } = setUp();
    await settle(client.calls[0], resultA());
    await settle(client.calls[1], resultA());
    go('a', 'ages');
    expect(client.calls.length).toBe(3);
    expect(envOf(client.calls[2])).toEqual({ futures: 1000, detail: 'all' });
    expect(answer().extending).toBe(true);
    await settle(client.calls[2], resultA({ detail: 'all' }));
    go('a', 'answer');
    go('a', 'ages');
    vi.advanceTimersByTime(10000);
    expect(client.calls.length).toBe(3);                                   // the detail is there: nothing more
    expect(types().slice(-2)).toEqual([A.ANSWER_EXTEND, A.ANSWER_FINAL]);
  });
  it('B\'s choices step asks for the grid', async () => {
    const { client, go, answer } = setUp({ start: typedB(), q: 'b' });
    await settle(client.calls[0], resultB());
    await settle(client.calls[1], resultB());
    go('b', 'choices');
    expect(client.calls[2].q).toBe('b');
    expect(envOf(client.calls[2])).toEqual({ futures: 1000, detail: 'grid' });
    await settle(client.calls[2], resultB({ detail: 'grid' }));
    expect(answer()).toMatchObject({ status: 'final', detail: 'grid', extending: false });
  });
  it('going back to the answer step mid-extend lets the pass land', async () => {
    const { client, go, answer } = setUp({ step: 'ages' });
    await settle(client.calls[0], resultA());
    await settle(client.calls[1], resultA());
    go('a', 'answer');
    expect(client.stops).toEqual([]);
    await settle(client.calls[2], resultA({ detail: 'all' }));
    expect(answer()).toMatchObject({ status: 'final', detail: 'all', extending: false });
  });
  it('a failed extra pass → failed, and it is not tried again by itself; "try again" runs all three', async () => {
    const { client, answer, store } = setUp({ step: 'ages' });
    await settle(client.calls[0], resultA());
    await settle(client.calls[1], resultA());
    await fail(client.calls[2]);
    expect(answer()).toMatchObject({ status: 'failed', extending: false });
    vi.advanceTimersByTime(60000);
    expect(client.calls.length).toBe(3);
    store.dispatch({ type: A.ANSWER_RETRY, q: 'a' });
    expect(client.calls.length).toBe(4);
    await settle(client.calls[3], resultA());
    await settle(client.calls[4], resultA());
    expect(envOf(client.calls[5])).toEqual({ futures: 1000, detail: 'all' });
  });
  it('an extra pass that answers "invalid" is a failure', async () => {
    const { client, answer } = setUp({ step: 'ages' });
    await settle(client.calls[0], resultA());
    await settle(client.calls[1], resultA());
    await settle(client.calls[2], { status: 'invalid', problems: [] });
    expect(answer().status).toBe('failed');
  });
  it('"slow" after 5 seconds of the extra pass', async () => {
    const { client, answer } = setUp({ step: 'ages' });
    await settle(client.calls[0], resultA());
    await settle(client.calls[1], resultA());
    vi.advanceTimersByTime(SLOW_MS);
    expect(answer()).toMatchObject({ extending: true, slow: true });
    await settle(client.calls[2], resultA({ detail: 'all' }));
    expect(answer().slow).toBe(false);
  });
});

describe('a change mid-extend ends it', () => {
  it('the old pass is stopped; its result never reaches the state; the new figures get all three passes', async () => {
    const { client, store, answer, types } = setUp({ step: 'ages' });
    await settle(client.calls[0], resultA());
    await settle(client.calls[1], resultA());
    const oldKey = answer().inputsKey;
    store.dispatch(set('a', 'you.pot', '300,000'));
    vi.advanceTimersByTime(WAIT_MS);
    expect(client.stops).toEqual(['a']);
    expect(client.calls[2].stopped).toBe(true);
    expect(answer()).toMatchObject({ status: 'working', extending: false });
    expect(answer().inputsKey).not.toBe(oldKey);
    expect(client.calls[3].inputs.you.pot).toBe(300000);
    // Whatever the stopped pass still says is dropped, and so is a final filed under the old key.
    const before = store.getState();
    store.dispatch({ type: A.ANSWER_FINAL, q: 'a', inputsKey: oldKey, result: resultA({ detail: 'all' }) });
    expect(store.getState()).toBe(before);
    await settle(client.calls[3], resultA());
    await settle(client.calls[4], resultA());
    expect(envOf(client.calls[5])).toEqual({ futures: 1000, detail: 'all' });
    await settle(client.calls[5], resultA({ detail: 'all' }));
    expect(answer()).toMatchObject({ status: 'final', detail: 'all', inputsKey: currentKey(store.getState(), 'a') });
    expect(types().filter((t) => t === A.ANSWER_FAILED)).toEqual([]);
  });
});

describe('each question in its own lane', () => {
  it('starting A while C is still working never ends C\'s run; C\'s figures land in C', async () => {
    const both = typedA(typedC());
    const { client, go, answer } = setUp({ start: both, q: 'c', step: 'answer', local: () => null });
    expect(client.calls.map((c) => c.q)).toEqual(['c']);
    go('a', 'answer');
    expect(client.calls.map((c) => c.q)).toEqual(['c', 'a']);
    expect(client.stops).toEqual([]);
    await settle(client.calls[0], { status: 'ok', monthly: { careful: 1380 }, basis: {} });
    expect(answer('c').status).toBe('first');
    await settle(client.calls[1], resultA());
    expect(answer('a').status).toBe('first');
  });
  it('the worker is made ready once, whichever question is opened first', () => {
    const { client, go } = setUp({ start: fresh(), q: 'a', step: 'numbers' });
    go('b', 'numbers');
    go('c', 'numbers');
    expect(client.inits).toEqual(['2026-09-30']);
  });
  it('C\'s passes carry no detail (C\'s env is as it was)', () => {
    const { client } = setUp({ start: typedC(), q: 'c' });
    expect(client.calls[0].env).toEqual({ today: '2026-09-30', futures: 100, seed: 0, trace: false });
  });
  it('the retired view runs nothing', () => {
    const { client } = setUp({ start: typedA(fresh(), { age: '70', stop: '70' }) });
    vi.advanceTimersByTime(10000);
    expect(client.calls.length).toBe(0);
  });
  it('after stop() nothing more is run in any lane', async () => {
    const { client, stop, go } = setUp({ step: 'numbers' });
    stop();
    go('a', 'answer');
    vi.advanceTimersByTime(10000);
    expect(client.calls.length).toBe(0);
  });
});
