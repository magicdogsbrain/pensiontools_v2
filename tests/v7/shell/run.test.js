/**
 * The runner (V7 build brief 4.10), with a fake worker: two passes in order; a change mid-run ends the old run and
 * its result never reaches the state; failure → answer/failed; the 5-second "slow"; no worker → the same two
 * passes on the page. And the ready mark, which the shell owns.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createStore } from '../../../src/v7/effects/store.js';
import { startRunner, PASSES, WAIT_MS, SLOW_MS } from '../../../src/v7/effects/run.js';
import { NO_WORKER } from '../../../src/v7/effects/workerClient.js';
import { markReady } from '../../../src/v7/effects/index.js';
import { reduce } from '../../../src/v7/state/reduce.js';
import { currentKey } from '../../../src/v7/state/select.js';
import { A } from '../../../src/v7/state/actions.js';
import { fresh, set, route, result, deferred } from './_shell.js';

/** A stand-in for the worker client: every call is recorded and settled by the test. */
function fakeClient({ broken = false } = {}) {
  const calls = [];
  const client = {
    calls,
    stops: 0,
    inits: [],
    init(today) { client.inits.push(today); return broken ? Promise.reject(Object.assign(new Error('x'), { code: NO_WORKER })) : Promise.resolve({ historyEnd: null, engineVersion: 'x' }); },
    answer(q, inputs, env, onProgress) {
      if (broken) return Promise.reject(Object.assign(new Error('x'), { code: NO_WORKER }));
      const d = deferred();
      const call = { q, inputs, env, onProgress, ...d, stopped: false };
      calls.push(call);
      return d.promise;
    },
    stop() {
      client.stops++;
      for (const c of calls) if (!c.stopped && !c.settled) { c.stopped = true; c.reject(Object.assign(new Error('stopped'), { code: 'stopped' })); }
    }
  };
  return client;
}
const settle = async (call, value) => { call.settled = true; call.resolve(value); await flush(); };
const fail = async (call, err = new Error('boom')) => { call.settled = true; call.reject(err); await flush(); };
const flush = async () => { for (let i = 0; i < 10; i++) await Promise.resolve(); };

function setUp({ client = fakeClient(), local = () => result(1), at = 'answer', pot = '250000', age = '58' } = {}) {
  const store = createStore(fresh(), reduce);
  const seen = [];
  store.subscribe((state, action) => seen.push(action));
  if (pot !== null) store.dispatch(set('you.pot', pot));
  if (age !== null) store.dispatch(set('you.age', age));
  if (at) store.dispatch({ type: A.ROUTE_SET, route: route('step', 'c', at) });
  seen.length = 0;
  const stop = startRunner({ store, client, local });
  const types = () => seen.map((a) => a.type).filter((t) => t.startsWith('answer/'));
  return { store, client, seen, types, stop, answer: () => store.getState().answers.c };
}

beforeEach(() => { vi.useFakeTimers(); });
afterEach(() => { vi.useRealTimers(); });

describe('when a run starts', () => {
  it('not away from the answer step', () => {
    const { client, types } = setUp({ at: 'numbers' });
    vi.advanceTimersByTime(10000);
    expect(client.calls.length).toBe(0);
    expect(types()).toEqual([]);
  });
  it('not while the draft does not parse', () => {
    const { client, store } = setUp({ age: null });
    vi.advanceTimersByTime(10000);
    expect(client.calls.length).toBe(0);
    store.dispatch(set('you.age', '58'));
    expect(client.calls.length).toBe(1);
  });
  it('at once on the first run (no wait for typing to pause)', () => {
    const { client, answer } = setUp();
    expect(client.calls.length).toBe(1);
    expect(answer().status).toBe('working');
  });
  it('at once after "Show what it pays"', () => {
    const { client, store, answer } = setUp({ at: 'numbers' });
    store.dispatch({ type: A.DRAFT_ASK, q: 'c' });
    expect(store.getState().route.step).toBe('answer');
    expect(client.calls.length).toBe(1);
    expect(answer().inputsKey).toBe(currentKey(store.getState(), 'c'));
  });
  it('the worker is made ready as soon as the question is opened, before the button is pressed', () => {
    const { client } = setUp({ at: 'numbers', pot: null, age: null });
    expect(client.inits).toEqual(['2026-09-30']);
    expect(client.calls.length).toBe(0);
  });
  it('not on the front door', () => {
    const { client } = setUp({ at: null });
    expect(client.inits).toEqual([]);
  });
});

describe('two passes, in order', () => {
  it('100 futures → answer/first, then 1,000 → answer/final', async () => {
    const { client, types, answer, store } = setUp();
    expect(PASSES).toEqual([100, 1000]);
    expect(client.calls[0].env).toEqual({ today: '2026-09-30', futures: 100, seed: 0, trace: false });
    expect(client.calls[0].q).toBe('c');
    expect(client.calls[0].inputs).toMatchObject({ household: 'single', you: { pot: 250000, age: 58 } });
    await settle(client.calls[0], result(1370));
    expect(answer().status).toBe('first');
    expect(answer().result.monthly.careful).toBe(1370);
    expect(client.calls.length).toBe(2);
    expect(client.calls[1].env).toEqual({ today: '2026-09-30', futures: 1000, seed: 0, trace: false });
    expect(client.calls[1].inputs).toEqual(client.calls[0].inputs);
    await settle(client.calls[1], result(1380));
    expect(answer().status).toBe('final');
    expect(answer().result.monthly.careful).toBe(1380);
    expect(types()).toEqual([A.ANSWER_WORKING, A.ANSWER_FIRST, A.ANSWER_FINAL]);
    expect(answer().inputsKey).toBe(currentKey(store.getState(), 'c'));
    vi.advanceTimersByTime(60000);
    expect(client.calls.length).toBe(2);                 // and nothing more
    expect(answer().slow).toBe(false);
  });
  it('progress reaches the state', async () => {
    const { client, answer } = setUp();
    client.calls[0].onProgress(40, 100);
    expect(answer().progress).toEqual({ done: 40, total: 100 });
    await settle(client.calls[0], result());
    client.calls[1].onProgress(500, 1000);
    expect(answer().progress).toEqual({ done: 500, total: 1000 });
  });
  it('the month the market history ends is kept from the first result', async () => {
    const { client, store } = setUp();
    expect(store.getState().env.historyEnd).toBe(null);
    await settle(client.calls[0], result());
    expect(store.getState().env.historyEnd).toBe('2025-12');
  });
  it('the same answer is not worked out twice', async () => {
    const { client, store } = setUp();
    await settle(client.calls[0], result());
    await settle(client.calls[1], result());
    store.dispatch({ type: A.UI_TOGGLE, id: 'assumed' });
    store.dispatch({ type: A.ROUTE_SET, route: route('step', 'c', 'numbers') });
    store.dispatch({ type: A.ROUTE_SET, route: route('step', 'c', 'answer') });
    store.dispatch(set('you.pot', '£250,000'));          // the same figure typed another way
    vi.advanceTimersByTime(10000);
    expect(client.calls.length).toBe(2);
  });
});

describe('a change mid-run', () => {
  it('waits 250 ms for typing to pause, then ends the old run and starts again', async () => {
    const { client, store, answer } = setUp();
    store.dispatch(set('you.pot', '30'));
    vi.advanceTimersByTime(WAIT_MS - 1);
    store.dispatch(set('you.pot', '300'));
    vi.advanceTimersByTime(WAIT_MS - 1);
    store.dispatch(set('you.pot', '300000'));
    vi.advanceTimersByTime(WAIT_MS - 1);
    expect(client.calls.length).toBe(1);                 // still only the first run
    expect(client.stops).toBe(0);
    vi.advanceTimersByTime(1);
    expect(client.stops).toBe(1);                        // the old worker run was ended
    expect(client.calls[0].stopped).toBe(true);
    expect(client.calls.length).toBe(2);
    expect(client.calls[1].inputs.you.pot).toBe(300000);
    expect(answer().inputsKey).toBe(currentKey(store.getState(), 'c'));
  });
  it('the old result never reaches the state, even if it arrives', async () => {
    const { client, store, answer, types } = setUp();
    const oldKey = answer().inputsKey;
    store.dispatch(set('you.pot', '300000'));
    // The old run answers before the wait is over: it is for figures nobody is looking at now.
    await settle(client.calls[0], result(1111));
    expect(answer().inputsKey).toBe(oldKey);
    expect(store.getState().answers.c.status).toBe('first');     // filed under its own key…
    vi.advanceTimersByTime(WAIT_MS);
    await flush();
    const newCall = client.calls.find((c) => c.inputs.you.pot === 300000 && c.env.futures === 100);
    expect(newCall).toBeTruthy();
    expect(answer().status).toBe('working');
    // …and whatever the old run still sends is dropped.
    for (const c of client.calls) if (c !== newCall && c.inputs.you.pot === 250000) { c.settled = true; c.resolve(result(2222)); }
    await flush();
    expect(answer().status).toBe('working');
    await settle(newCall, result(1650));
    expect(answer().status).toBe('first');
    expect(answer().result.monthly.careful).toBe(1650);
    const last = client.calls[client.calls.length - 1];
    await settle(last, result(1660));
    expect(answer().status).toBe('final');
    expect(answer().result.monthly.careful).toBe(1660);
    expect(answer().inputsKey).toBe(currentKey(store.getState(), 'c'));
    expect(types().filter((t) => t === A.ANSWER_FAILED)).toEqual([]);
  });
  it('a result delivered straight to the reducer under an old key is ignored', async () => {
    const { client, store, answer } = setUp();
    const oldKey = answer().inputsKey;
    store.dispatch(set('you.pot', '300000'));
    vi.advanceTimersByTime(WAIT_MS);
    const before = store.getState();
    store.dispatch({ type: A.ANSWER_FINAL, q: 'c', inputsKey: oldKey, result: result(9999) });
    expect(store.getState()).toBe(before);
    expect(client.calls.length).toBe(2);
  });
  it('"before" holds the last final amount while the new one is worked out', async () => {
    const { client, store, answer } = setUp();
    await settle(client.calls[0], result(1370));
    await settle(client.calls[1], result(1380));
    store.dispatch(set('you.pot', '300000'));
    expect(answer().status).toBe('final');               // still the old answer, no longer current
    vi.advanceTimersByTime(WAIT_MS);
    expect(answer().status).toBe('working');
    expect(answer().before).toEqual({ monthly: { careful: 1380 }, take: null });
    expect(answer().result.monthly.careful).toBe(1380);  // kept on screen, greyed
  });
  it('typing back to the figures already answered cancels the wait', async () => {
    const { client, store } = setUp();
    await settle(client.calls[0], result());
    await settle(client.calls[1], result());
    store.dispatch(set('you.pot', '2500000'));
    store.dispatch(set('you.pot', '250000'));
    vi.advanceTimersByTime(10000);
    expect(client.calls.length).toBe(2);
  });
  it('leaving the answer step cancels the wait', () => {
    const { client, store } = setUp();
    store.dispatch(set('you.pot', '300000'));
    store.dispatch({ type: A.ROUTE_SET, route: route('step', 'c', 'numbers') });
    vi.advanceTimersByTime(10000);
    expect(client.calls.length).toBe(1);
  });
});

describe('failure', () => {
  it('an error in the first pass → answer/failed, and no second pass', async () => {
    const { client, answer, store } = setUp();
    const draft = store.getState().draft;
    await fail(client.calls[0]);
    expect(answer().status).toBe('failed');
    expect(store.getState().draft).toBe(draft);
    expect(client.calls.length).toBe(1);
    vi.advanceTimersByTime(60000);
    expect(client.calls.length).toBe(1);                 // not tried again by itself
    expect(answer().slow).toBe(false);
  });
  it('an error in the final pass → answer/failed', async () => {
    const { client, answer } = setUp();
    await settle(client.calls[0], result());
    await fail(client.calls[1]);
    expect(answer().status).toBe('failed');
  });
  it('an answer that says the inputs are invalid counts as a failure (the form had passed them)', async () => {
    const { client, answer } = setUp();
    await settle(client.calls[0], { status: 'invalid', problems: [] });
    expect(answer().status).toBe('failed');
  });
  it('"try again" runs both passes again, at once', async () => {
    const { client, answer, store } = setUp();
    await fail(client.calls[0]);
    store.dispatch({ type: A.ANSWER_RETRY, q: 'c' });
    expect(client.calls.length).toBe(2);
    expect(answer().status).toBe('working');
    await settle(client.calls[1], result());
    await settle(client.calls[2], result());
    expect(answer().status).toBe('final');
  });
  it('the failure of a run that was replaced is not shown', async () => {
    const { client, store, answer } = setUp();
    store.dispatch(set('you.pot', '300000'));
    vi.advanceTimersByTime(WAIT_MS);
    expect(client.calls[0].stopped).toBe(true);          // rejected by stop()
    await flush();
    expect(answer().status).toBe('working');
  });
});

describe('slow', () => {
  it('after 5 seconds without a final result', async () => {
    const { client, answer, types } = setUp();
    vi.advanceTimersByTime(SLOW_MS - 1);
    expect(answer().slow).toBe(false);
    await settle(client.calls[0], result());             // a first figure does not stop the clock
    vi.advanceTimersByTime(1);
    expect(answer().slow).toBe(true);
    expect(types()).toEqual([A.ANSWER_WORKING, A.ANSWER_FIRST, A.ANSWER_SLOW]);
    await settle(client.calls[1], result());
    expect(answer().slow).toBe(false);
  });
  it('not when the final result came in time', async () => {
    const { client, types } = setUp();
    await settle(client.calls[0], result());
    await settle(client.calls[1], result());
    vi.advanceTimersByTime(SLOW_MS * 3);
    expect(types()).not.toContain(A.ANSWER_SLOW);
  });
  it('the clock starts again with a new run', async () => {
    const { store, answer } = setUp();
    vi.advanceTimersByTime(SLOW_MS - 300);
    store.dispatch(set('you.pot', '300000'));
    vi.advanceTimersByTime(WAIT_MS);                     // the new run starts here
    vi.advanceTimersByTime(SLOW_MS - 1);
    expect(answer().slow).toBe(false);
    vi.advanceTimersByTime(1);
    expect(answer().slow).toBe(true);
  });
});

describe('no worker', () => {
  it('the same two passes run on the page', async () => {
    const local = vi.fn((q, inputs, env) => result(env.futures === 100 ? 1370 : 1380));
    const { answer, types } = setUp({ client: fakeClient({ broken: true }), local });
    expect(answer().status).toBe('working');             // "Working" is drawn before the page is busy
    await flush();
    await vi.advanceTimersByTimeAsync(1);
    await flush();
    await vi.advanceTimersByTimeAsync(1);
    await flush();
    expect(local.mock.calls.map((c) => [c[0], c[2].futures, c[2].today, c[2].seed])).toEqual([['c', 100, '2026-09-30', 0], ['c', 1000, '2026-09-30', 0]]);
    expect(types()).toEqual([A.ANSWER_WORKING, A.ANSWER_FIRST, A.ANSWER_FINAL]);
    expect(answer().result.monthly.careful).toBe(1380);
  });
  it('an error on the page → answer/failed', async () => {
    const { answer } = setUp({ client: fakeClient({ broken: true }), local: () => { throw new Error('boom'); } });
    await flush();
    await vi.advanceTimersByTimeAsync(1);
    await flush();
    expect(answer().status).toBe('failed');
  });
});

describe('stopping', () => {
  it('after stop() nothing more is run or sent to the state', async () => {
    const { client, store, stop, answer } = setUp();
    stop();
    expect(client.stops).toBe(1);
    await flush();
    const status = answer().status;
    store.dispatch(set('you.pot', '300000'));
    vi.advanceTimersByTime(10000);
    expect(client.calls.length).toBe(1);
    expect(answer().status).toBe(status);
  });
});

describe('the ready mark', () => {
  const root = () => {
    const el = document.createElement('div');
    el.setAttribute('data-ready', '0');
    el.setAttribute('data-answer', 'none');
    return el;
  };
  it('data-ready is "1" only when nothing is running and any answer shown is final; pt:done each time it becomes "1"', async () => {
    const el = root();
    const parent = document.createElement('div');
    parent.appendChild(el);
    let done = 0;
    parent.addEventListener('pt:done', () => done++);     // it bubbles

    const store = createStore(fresh(), reduce);
    const marks = [];
    store.subscribe((state) => { markReady(el, state); marks.push(el.getAttribute('data-ready') + el.getAttribute('data-answer')); });
    markReady(el, store.getState());
    expect(el.getAttribute('data-ready')).toBe('1');
    expect(done).toBe(1);
    markReady(el, store.getState());
    expect(done).toBe(1);                                 // only when it BECOMES "1"

    const client = fakeClient();
    startRunner({ store, client, local: () => result() });
    store.dispatch(set('you.pot', '250000'));
    store.dispatch(set('you.age', '58'));
    store.dispatch({ type: A.DRAFT_ASK, q: 'c' });
    expect(el.getAttribute('data-ready')).toBe('0');
    expect(el.getAttribute('data-answer')).toBe('none');
    await settle(client.calls[0], result());
    expect(el.getAttribute('data-ready')).toBe('0');
    expect(el.getAttribute('data-answer')).toBe('first');
    expect(done).toBe(1);
    await settle(client.calls[1], result());
    expect(el.getAttribute('data-ready')).toBe('1');
    expect(el.getAttribute('data-answer')).toBe('final');
    expect(done).toBe(2);
    // The page is never marked ready between pressing the button and the final figure.
    const from = marks.lastIndexOf('1none');
    expect(marks.slice(from + 1, -1).every((m) => m.startsWith('0'))).toBe(true);

    store.dispatch(set('you.pot', '300000'));             // typing on the answer step: a run is on its way
    expect(el.getAttribute('data-ready')).toBe('0');
  });
});
