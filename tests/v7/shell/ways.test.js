/**
 * The machinery of "How the money is taken" (research/v7/way-and-mix.md 2.2, 7): the reducer (a result for an old key is
 * dropped; the plan saved under the run empties the cards; a card opened puts the closed card's try away; a try for stale
 * values is dropped; the plans leaving memory clears it; "Does it last?"'s result goes when the way is switched; readyMark),
 * the runner with a fake client (the nine run once per key with progress and the cost timed; a stale result dropped when the
 * plan changes under it; the slow flag; a failed run and "Try again"; no worker; a card that needs a run tried once its
 * dials settle, in the 'way' lane, and dropped when its values move), the worker handler's `ways` and `way` messages through
 * the real handler, the client's lanes, and the one write file's kind 'way': exactly WAY_WRITES plus the stamp, past the
 * guard (a locked plan refused with the screen bypassed), Undo the exact reverse on the account and the window paths.
 */
import { describe, it, expect, vi } from 'vitest';
import { createStore } from '../../../src/v7/effects/store.js';
import { initialState, emptyWays, emptyLasts } from '../../../src/v7/state/initial.js';
import { reduce } from '../../../src/v7/state/reduce.js';
import { A } from '../../../src/v7/state/actions.js';
import { parse } from '../../../src/v7/router/routes.js';
import { readyMark, planWayView } from '../../../src/v7/state/select.js';
import { viewFor, upgradedList } from '../../../src/v7/effects/planSource.js';
import { startWaysRunner, SLOW_MS, SETTLE_MS } from '../../../src/v7/effects/ways.js';
import { startPlanWrite, GUEST_PLANS_KEY } from '../../../src/v7/effects/planWrite.js';
import { createHandler } from '../../../src/v7/effects/answerWorker.js';
import { createWorkerClient, NO_WORKER } from '../../../src/v7/effects/workerClient.js';
import { runKeyOf, wayPatch } from '../../../src/answers/plan/way.js';
import { WAY_WRITES, WAY_IDS } from '../../../src/answers/plan/schema.js';
import { corpus, entryOf, TODAY, noon } from '../plan/_plans.js';

const C = corpus();
const ALEX = C['02-pnv-draft'];
const LOCKED = C['03-gilt-ladder-runup'];
const tick = async (n = 6) => { for (let i = 0; i < n; i++) await new Promise((r) => setTimeout(r, 0)); };
const copy = (v) => JSON.parse(JSON.stringify(v));
const dialsOf = (id, over = {}) => ({ defaults: over, ranWith: over });
const WAY = (id, over = {}) => ({ id, affordable: true, reason: null, bought: false, a: { strategyId: id, chancePct: 93, share: 0.93, typicalLeft: 500000, badCaseLeft: 50000, goodCaseLeft: 900000, years: 33, futures: 1000, histories: 700 },
  ruin: { mc: 7, hist: 0 }, terminal: { p10: 50000, p50: 500000, p90: 900000 }, coverage: 99, spentMedian: 1000000, worst12: 20000, vol: 0.1, vac: 10, coverageRatio: 1.1, cost: 0, left: null, dials: dialsOf(id, over) });
const RESULT = { strategyId: 'pots-and-valves', priced: 'bundled', ways: WAY_IDS.map((id) => WAY(id, id === 'floor-to-age' ? { floorToAge: 80 } : id === 'pots-and-valves' || id === 'buckets-in-order' ? { protectionOn: 'yes', cutPct: 20, consecutiveLimit: 3, ...(id === 'buckets-in-order' ? { bucketBand: 10 } : {}) } : {})), basis: { today: TODAY, engine: 'one-test', runs: 9 } };
const TRIED = { ...WAY('floor-to-age', { floorToAge: 80 }), tried: true, a: { strategyId: 'floor-to-age', chancePct: 88, share: 0.88, typicalLeft: 400000, badCaseLeft: 40000, goodCaseLeft: 800000, years: 33, futures: 1000, histories: 700 }, basis: { today: TODAY, engine: 'one-test', runs: 1 } };

/** A store on the way step of a plan, the plans read (an account), the reading done as the plan source does it. */
function pageOn(raws, planId, { step = 'way', source = 'account', session = 'in' } = {}) {
  const store = createStore(initialState({ today: TODAY, build: 'test' }), reduce);
  store.dispatch({ type: A.ROUTE_SET, route: parse('#/plan/' + planId + '/' + step) });
  store.dispatch({ type: A.SESSION_SET, session: { kind: session, email: session === 'in' ? 'a@b.c' : null } });
  const list = upgradedList(raws, noon(TODAY));
  store.dispatch({ type: A.PLANS_SET, list, source, readAt: '14:03' });
  store.dispatch({ type: A.PLANS_VIEW, view: viewFor(store.getState()) });
  // the plan source's own reading after every change (the page does this itself; here by hand)
  let lastWays = store.getState().ways;
  store.subscribe((state) => {
    if (state.plans && state.plans.status === 'read' && (!state.plans.view || state.plans.view.page === undefined || state.ways !== lastWays)) { lastWays = state.ways; store.dispatch({ type: A.PLANS_VIEW, view: viewFor(state) }); }
  });
  return { store, key: runKeyOf(list.find((e) => String(e.plan.id) === String(planId)).plan), list };
}

describe('the reducer: the nine ways in page memory', () => {
  const s0 = initialState({ today: TODAY, build: 'test' });
  it('starts empty; working, progress, done with the cost, failed, slow, retry; a result for another key is dropped', () => {
    expect(s0.ways).toEqual(emptyWays());
    let s = reduce(s0, { type: A.WAYS_WORKING, key: 'k1' });
    expect(s.ways).toMatchObject({ key: 'k1', status: 'working', result: null, progress: null, slow: false, open: null, dials: {}, tried: {}, rankBy: 'lasts' });
    s = reduce(s, { type: A.WAYS_PROGRESS, key: 'k1', done: 3, total: 9 });
    expect(s.ways.progress).toEqual({ done: 3, total: 9 });
    expect(reduce(s, { type: A.WAYS_PROGRESS, key: 'k2', done: 4, total: 9 })).toBe(s);
    expect(reduce(s, { type: A.WAYS_DONE, key: 'k2', result: RESULT, ms: 100 })).toBe(s);                                     // stale
    s = reduce(s, { type: A.WAYS_SLOW, key: 'k1' });
    expect(s.ways.slow).toBe(true);
    s = reduce(s, { type: A.WAYS_DONE, key: 'k1', result: RESULT, ms: 4567.4 });
    expect(s.ways).toMatchObject({ key: 'k1', status: 'done', result: RESULT, progress: null, slow: false, ran: { runs: 9, ms: 4567 } });
    expect(reduce(s, { type: A.WAYS_DONE, key: 'k1', result: RESULT, ms: 1 })).toBe(s);
    const f = reduce(reduce(s0, { type: A.WAYS_WORKING, key: 'k2' }), { type: A.WAYS_FAILED, key: 'k2', reason: 'noWorker' });
    expect(f.ways).toMatchObject({ status: 'failed', reason: 'noWorker' });
    expect(reduce(f, { type: A.WAYS_RETRY }).ways.status).toBe('idle');
    expect(reduce(s, { type: A.WAYS_RETRY })).toBe(s);
    expect(() => reduce(s0, { type: A.WAYS_WORKING })).toThrow(/needs a key/);
    expect(() => reduce(reduce(s0, { type: A.WAYS_WORKING, key: 'k1' }), { type: A.WAYS_DONE, key: 'k1', result: { ways: null } })).toThrow(/needs a result/);
  });
  it('a card opened, a dial typed, a try: one open at a time, the closed card\'s try goes; a try is filed under its key and values, a stale one dropped; the rank-by', () => {
    let s = reduce(reduce(s0, { type: A.WAYS_WORKING, key: 'k1' }), { type: A.WAYS_DONE, key: 'k1', result: RESULT, ms: 100 });
    expect(reduce(s0, { type: A.WAY_TRY, id: 'floor-to-age', values: { floorToAge: 82 } })).toBe(s0);                      // never before the nine are held
    s = reduce(s, { type: A.WAY_OPEN, id: 'floor-to-age' });
    expect(s.ways.open).toBe('floor-to-age');
    s = reduce(s, { type: A.WAY_DIAL, id: 'floor-to-age', key: 'floorToAge', value: '82' });
    expect(s.ways.dials).toEqual({ 'floor-to-age': { floorToAge: '82' } });
    s = reduce(s, { type: A.WAY_TRY, id: 'floor-to-age', values: { floorToAge: 82 } });
    expect(s.ways.tried['floor-to-age']).toMatchObject({ status: 'working', values: { floorToAge: 82 } });
    expect(reduce(s, { type: A.WAY_TRIED, key: 'k1', id: 'floor-to-age', values: { floorToAge: 84 }, result: TRIED, ms: 10 })).toBe(s);   // other values: stale
    expect(reduce(s, { type: A.WAY_TRIED, key: 'k2', id: 'floor-to-age', values: { floorToAge: 82 }, result: TRIED, ms: 10 })).toBe(s);   // other key: stale
    s = reduce(s, { type: A.WAY_TRIED, key: 'k1', id: 'floor-to-age', values: { floorToAge: 82 }, result: TRIED, ms: 180.6 });
    expect(s.ways.tried['floor-to-age']).toMatchObject({ status: 'done', result: TRIED, ms: 181 });
    // another card opened: the first card's try is put away, its dials stay as typed
    const o = reduce(s, { type: A.WAY_OPEN, id: 'full-il-gilt' });
    expect(o.ways.tried).toEqual({});
    expect(o.ways.dials['floor-to-age']).toEqual({ floorToAge: '82' });
    const back = reduce(o, { type: A.WAY_OPEN, id: null });
    expect(back.ways.open).toBe(null);
    const failed = reduce(reduce(s, { type: A.WAY_TRY, id: 'full-il-gilt', values: { cashYears: 1 } }), { type: A.WAY_TRY_FAILED, key: 'k1', id: 'full-il-gilt', values: { cashYears: 1 }, reason: 'noWorker' });
    expect(failed.ways.tried['full-il-gilt']).toMatchObject({ status: 'failed', reason: 'noWorker' });
    expect(reduce(s, { type: A.WAY_RANK, by: 'score' }).ways.rankBy).toBe('score');
    expect(() => reduce(s, { type: A.WAY_RANK, by: 'odd' })).toThrow(/no order/);
    expect(() => reduce(s, { type: A.WAY_OPEN, id: 'odd' })).toThrow(/no way/);
    expect(() => reduce(s, { type: A.WAY_DIAL, id: 'odd', key: 'x', value: '1' })).toThrow(/no way/);
    // the plan saved under the run (a new key): the cards, dials and tries go; a retry for the same key keeps them
    const saved = reduce(s, { type: A.WAYS_WORKING, key: 'k2' });
    expect(saved.ways).toMatchObject({ key: 'k2', status: 'working', result: null, open: null, dials: {}, tried: {} });
    const again = reduce(s, { type: A.WAYS_WORKING, key: 'k1' });
    expect(again.ways).toMatchObject({ key: 'k1', status: 'working', result: RESULT, open: 'floor-to-age' });
  });
  it('plan/useWay sets the write under way and closes the confirm; plan/saved with op way clears "Does it last?"\'s result; the plans leaving memory clears the ways; state/replace takes a ways state or starts empty', () => {
    let s = reduce(s0, { type: A.UI_TOGGLE, id: 'wayConfirm' });
    s = reduce(s, { type: A.PLAN_WAY, planId: 'p1', id: 'floor-to-age' });
    expect(s.ui.saving).toEqual({ planId: 'p1', kind: 'way', way: 'floor-to-age' });
    expect(s.ui.open).not.toContain('wayConfirm');
    expect(reduce(s, { type: A.PLAN_WAY, planId: 'p1', id: 'full-il-gilt' })).toBe(s);
    expect(() => reduce(s0, { type: A.PLAN_WAY, planId: 'p1', id: 'odd' })).toThrow(/no way/);
    let withLasts = reduce(reduce(s, { type: A.LASTS_WORKING, key: 'L' }), { type: A.LASTS_DONE, key: 'L', result: { strategyId: 'pots-and-valves', a: null } });
    withLasts = reduce(withLasts, { type: A.PLAN_SAVED, planId: 'p1', previous: { 'stressTool.settings.strategyId': 'pots-and-valves' }, line: { id: 'way', slots: { way: 'floor-to-age' } }, op: 'way' });
    expect(withLasts.lasts).toEqual(emptyLasts());
    expect(withLasts.ui.toast).toMatchObject({ kind: 'saved', op: 'way' });
    const plain = reduce(withLasts, { type: A.PLAN_SAVED, planId: 'p1', previous: { 'stressTool.settings.duration': 32 }, line: null });
    expect(plain.lasts).toEqual(emptyLasts());
    const held = reduce(reduce(s0, { type: A.WAYS_WORKING, key: 'k1' }), { type: A.WAYS_DONE, key: 'k1', result: RESULT, ms: 1 });
    expect(reduce(held, { type: A.PLANS_CLEAR }).ways).toEqual(emptyWays());
    expect(JSON.parse(JSON.stringify(held))).toEqual(held);
    const r = reduce(s0, { type: A.STATE_REPLACE, state: { ...held, ways: { ...held.ways, open: 'floor-to-age', dials: { 'floor-to-age': { floorToAge: '82' }, odd: { x: '1' } }, tried: { 'floor-to-age': { status: 'done', values: { floorToAge: 82 }, result: TRIED, ms: 180 } }, rankBy: 'left' } } });
    expect(r.ways).toMatchObject({ key: 'k1', status: 'done', open: 'floor-to-age', dials: { 'floor-to-age': { floorToAge: '82' } }, rankBy: 'left' });
    expect(r.ways.tried['floor-to-age']).toMatchObject({ status: 'done', ms: 180 });
    expect(reduce(s0, { type: A.STATE_REPLACE, state: { ...held, ways: { key: 3 } } }).ways).toEqual(emptyWays());
  });
  it('readyMark: the nine under way, or due for the plan on the step, or a card that needs a run, is not ready; the result held is', () => {
    const { store, key } = pageOn([ALEX], ALEX.id);
    expect(readyMark(store.getState()).ready).toBe('0');
    store.dispatch({ type: A.WAYS_WORKING, key });
    expect(readyMark(store.getState()).ready).toBe('0');
    store.dispatch({ type: A.WAYS_DONE, key, result: RESULT, ms: 1 });
    expect(readyMark(store.getState()).ready).toBe('1');
    store.dispatch({ type: A.WAY_OPEN, id: 'floor-to-age' });
    store.dispatch({ type: A.WAY_DIAL, id: 'floor-to-age', key: 'floorToAge', value: '82' });
    expect(readyMark(store.getState()).ready, 'a card needs a run').toBe('0');
    store.dispatch({ type: A.WAY_TRY, id: 'floor-to-age', values: { floorToAge: 82 } });
    expect(readyMark(store.getState()).ready).toBe('0');
    store.dispatch({ type: A.WAY_TRIED, key, id: 'floor-to-age', values: { floorToAge: 82 }, result: TRIED, ms: 1 });
    expect(readyMark(store.getState()).ready).toBe('1');
    const away = pageOn([ALEX], ALEX.id, { step: 'plan' });
    expect(readyMark(away.store.getState()).ready).toBe('1');
  });
  it('planWayView: the reading with the run\'s status for this plan\'s key only, the confirm and "More columns" from ui.open, the write\'s state', () => {
    const { store, key } = pageOn([ALEX], ALEX.id);
    expect(planWayView(store.getState())).toMatchObject({ found: true, id: ALEX.id, run: { status: 'idle' }, more: false, confirm: false, has: false });
    store.dispatch({ type: A.WAYS_WORKING, key: 'other' });
    expect(planWayView(store.getState()).run.status).toBe('idle');
    store.dispatch({ type: A.WAYS_WORKING, key });
    store.dispatch({ type: A.WAYS_DONE, key, result: RESULT, ms: 1 });
    store.dispatch({ type: A.UI_TOGGLE, id: 'waysMore' });
    store.dispatch({ type: A.UI_TOGGLE, id: 'wayConfirm' });
    const v = planWayView(store.getState());
    expect(v).toMatchObject({ run: { status: 'done' }, more: true, confirm: true, has: true, ran: { runs: 9, ms: 1 } });
    expect(v.cards).toHaveLength(9);
    expect(planWayView(reduce(store.getState(), { type: A.ROUTE_SET, route: parse('#/plans') })).found).toBe(false);
  });
});

describe('the runner', () => {
  const fakeClient = (ways, way = null, { stopped = [] } = {}) => ({ ways, way, stop: (q) => stopped.push(q) });
  it('runs the nine on the step once, with progress and the cost timed, and files the result under the page\'s key; nothing is run again for the same key', async () => {
    const { store, key } = pageOn([ALEX], ALEX.id);
    const calls = [];
    let t = 1000;
    const client = fakeClient((plan, env, onProgress) => { calls.push({ id: plan.id, env }); onProgress(0, 9); onProgress(9, 9); t += 4600; return Promise.resolve(RESULT); });
    const stop = startWaysRunner({ store, client, now: () => t });
    await tick();
    expect(calls).toEqual([{ id: ALEX.id, env: { today: TODAY } }]);
    expect(store.getState().ways).toMatchObject({ key, status: 'done', result: RESULT, ran: { runs: 9, ms: 4600 } });
    store.dispatch({ type: A.UI_RAIL, open: true });
    await tick();
    expect(calls.length).toBe(1);
    stop();
  });
  it('a failed run: "failed", then "Try again" runs it again; no worker: failed with the reason, nothing run on the page', async () => {
    const { store, key } = pageOn([ALEX], ALEX.id);
    let n = 0;
    const client = fakeClient(() => (++n === 1 ? Promise.reject(new Error('boom')) : Promise.resolve(RESULT)));
    const stop = startWaysRunner({ store, client });
    await tick();
    expect(store.getState().ways).toMatchObject({ key, status: 'failed', reason: null });
    store.dispatch({ type: A.WAYS_RETRY });
    await tick();
    expect(store.getState().ways).toMatchObject({ key, status: 'done', result: RESULT });
    stop();
    const page2 = pageOn([ALEX], ALEX.id);
    const none = vi.fn(() => Promise.reject(Object.assign(new Error('none'), { code: NO_WORKER })));
    const stop2 = startWaysRunner({ store: page2.store, client: fakeClient(none) });
    await tick(10);
    expect(none).toHaveBeenCalledTimes(1);
    expect(page2.store.getState().ways).toMatchObject({ key: page2.key, status: 'failed', reason: 'noWorker', result: null });
    stop2();
  });
  it('the plan changes under a run: the first result is dropped and the new key is run; the slow flag after SLOW_MS', async () => {
    vi.useFakeTimers();
    try {
      const { store, key } = pageOn([ALEX], ALEX.id);
      const resolvers = [];
      const stopped = [];
      const client = fakeClient(() => new Promise((resolve) => resolvers.push(resolve)), null, { stopped });
      const stop = startWaysRunner({ store, client });
      await vi.advanceTimersByTimeAsync(0);
      expect(store.getState().ways).toMatchObject({ key, status: 'working' });
      await vi.advanceTimersByTimeAsync(SLOW_MS + 1);
      expect(store.getState().ways.slow).toBe(true);
      const changed = copy(ALEX);
      changed.lastModified = '2026-10-02T14:03:00.000Z';
      store.dispatch({ type: A.PLANS_SET, list: upgradedList([changed], noon(TODAY)), source: 'account', readAt: '14:04' });
      store.dispatch({ type: A.PLANS_VIEW, view: viewFor(store.getState()) });
      await vi.advanceTimersByTimeAsync(0);
      const key2 = runKeyOf(upgradedList([changed], noon(TODAY))[0].plan);
      expect(key2).not.toBe(key);
      expect(stopped).toContain('ways');
      expect(store.getState().ways).toMatchObject({ key: key2, status: 'working' });
      resolvers[0]({ ...RESULT, strategyId: 'old' });
      await vi.advanceTimersByTimeAsync(0);
      expect(store.getState().ways.status, 'the old result is dropped').toBe('working');
      resolvers[1](RESULT);
      await vi.advanceTimersByTimeAsync(0);
      expect(store.getState().ways).toMatchObject({ key: key2, status: 'done', result: RESULT });
      stop();
    } finally { vi.useRealTimers(); }
  });
  it('a card that needs a run: the try asked for once the dials settle, run in the way lane with the values, filed under the key; the values moving under it drops the answer and asks again', async () => {
    vi.useFakeTimers();
    try {
      const { store, key } = pageOn([ALEX], ALEX.id);
      const ways = () => Promise.resolve(RESULT);
      const tries = [];
      const resolvers = [];
      const stopped = [];
      const client = fakeClient(ways, (plan, env) => { tries.push(env); return new Promise((resolve) => resolvers.push(resolve)); }, { stopped });
      const stop = startWaysRunner({ store, client });
      await vi.advanceTimersByTimeAsync(0);
      expect(store.getState().ways.status).toBe('done');
      store.dispatch({ type: A.WAY_OPEN, id: 'floor-to-age' });
      store.dispatch({ type: A.WAY_DIAL, id: 'floor-to-age', key: 'floorToAge', value: '8' });
      await vi.advanceTimersByTimeAsync(SETTLE_MS - 50);
      expect(tries).toEqual([]);                                                     // a problem (too low): nothing to try
      store.dispatch({ type: A.WAY_DIAL, id: 'floor-to-age', key: 'floorToAge', value: '82' });
      await vi.advanceTimersByTimeAsync(SETTLE_MS - 50);
      expect(tries).toEqual([]);                                                     // not settled yet
      await vi.advanceTimersByTimeAsync(100);
      expect(tries).toEqual([{ today: TODAY, way: { id: 'floor-to-age', dials: { floorToAge: 82 } } }]);
      expect(store.getState().ways.tried['floor-to-age']).toMatchObject({ status: 'working', values: { floorToAge: 82 } });
      // the dial moves again before the answer: the first answer is dropped, a second try asked for
      store.dispatch({ type: A.WAY_DIAL, id: 'floor-to-age', key: 'floorToAge', value: '84' });
      await vi.advanceTimersByTimeAsync(SETTLE_MS + 10);
      expect(tries).toHaveLength(2);
      expect(stopped).toContain('way');
      resolvers[0]({ ...TRIED, a: { ...TRIED.a, chancePct: 1 } });
      await vi.advanceTimersByTimeAsync(0);
      expect(store.getState().ways.tried['floor-to-age']).toMatchObject({ status: 'working', values: { floorToAge: 84 } });
      resolvers[1](TRIED);
      await vi.advanceTimersByTimeAsync(0);
      expect(store.getState().ways.tried['floor-to-age']).toMatchObject({ status: 'done', values: { floorToAge: 84 }, result: TRIED });
      // settled and tried: nothing more is asked
      await vi.advanceTimersByTimeAsync(SETTLE_MS * 3);
      expect(tries).toHaveLength(2);
      stop();
    } finally { vi.useRealTimers(); }
  });
  it('no way lane (an older client): the try fails with the no-worker reason', async () => {
    vi.useFakeTimers();
    try {
      const { store } = pageOn([ALEX], ALEX.id);
      const stop = startWaysRunner({ store, client: { ways: () => Promise.resolve(RESULT), stop: () => {} } });
      await vi.advanceTimersByTimeAsync(0);
      store.dispatch({ type: A.WAY_OPEN, id: 'floor-to-age' });
      store.dispatch({ type: A.WAY_DIAL, id: 'floor-to-age', key: 'floorToAge', value: '82' });
      await vi.advanceTimersByTimeAsync(SETTLE_MS + 10);
      expect(store.getState().ways.tried['floor-to-age']).toMatchObject({ status: 'failed', reason: 'noWorker' });
      stop();
    } finally { vi.useRealTimers(); }
  });
});

describe('the worker: the `ways` and `way` messages, and the client\'s lanes', () => {
  const plan = entryOf(ALEX).plan;
  const collect = async (handle, msg) => { const out = []; handle(msg, (m) => out.push(m)); await tick(12); return out; };
  it('fake runs through the real handler: the date from init, progress then plain data; no plan or no way → an error', async () => {
    const seen = [];
    const fakeWays = (p, { today, onProgress }) => { seen.push(['ways', p.id, today]); onProgress(0, 9); onProgress(9, 9); return { ...RESULT, f: () => 1 }; };
    const fakeWay = (p, { today, id, dials, onProgress }) => { seen.push(['way', p.id, today, id, dials]); onProgress(0, 1); onProgress(1, 1); return TRIED; };
    const handle = createHandler(undefined, { ways: fakeWays, way: fakeWay });
    handle({ id: 1, type: 'init', today: TODAY }, () => {});
    const out = await collect(handle, { id: 2, type: 'ways', plan, env: {} });
    expect(seen[0]).toEqual(['ways', plan.id, TODAY]);
    expect(out[0]).toEqual({ id: 2, progress: { done: 0, total: 9 } });
    expect(out.at(-1)).toEqual({ id: 2, result: RESULT });
    const one = await collect(handle, { id: 3, type: 'way', plan, env: { today: TODAY, way: { id: 'floor-to-age', dials: { floorToAge: 82 } } } });
    expect(seen[1]).toEqual(['way', plan.id, TODAY, 'floor-to-age', { floorToAge: 82 }]);
    expect(one.at(-1)).toEqual({ id: 3, result: TRIED });
    expect(await collect(handle, { id: 4, type: 'ways', env: {} })).toEqual([{ id: 4, error: expect.stringMatching(/no plan/) }]);
    expect(await collect(handle, { id: 5, type: 'way', plan, env: {} })).toEqual([{ id: 5, error: expect.stringMatching(/no way/) }]);
    expect(await collect(createHandler(undefined, { ways: () => { throw new Error('boom'); } }), { id: 6, type: 'ways', plan, env: { today: TODAY } })).toEqual([{ id: 6, error: 'boom' }]);
  });
  it('the real run, loaded lazily by the handler: the nine then plain data; one way then plain data', { timeout: 120_000 }, async () => {
    const out = [];
    const handle = createHandler();
    handle({ id: 7, type: 'ways', plan, env: { today: TODAY } }, (m) => out.push(m));
    for (let i = 0; i < 2400 && !out.some((m) => 'result' in m || 'error' in m); i++) await new Promise((r) => setTimeout(r, 25));
    const last = out[out.length - 1];
    expect(last.result, JSON.stringify(last)).toBeTruthy();
    expect(last.result.ways.map((w) => w.id)).toEqual(WAY_IDS);
    expect(out.slice(0, -1).every((m) => m.progress)).toBe(true);
    const one = [];
    handle({ id: 8, type: 'way', plan, env: { today: TODAY, way: { id: 'floor-to-age', dials: { floorToAge: 82 } } } }, (m) => one.push(m));
    for (let i = 0; i < 800 && !one.some((m) => 'result' in m || 'error' in m); i++) await new Promise((r) => setTimeout(r, 25));
    expect(one.at(-1).result).toMatchObject({ id: 'floor-to-age', tried: true, basis: { runs: 1 } });
  });
  it('the client: ways and way are their own lanes; stop(\'way\') ends a try and leaves the nine running', async () => {
    const posted = [];
    let w;
    const makeWorker = () => { w = { postMessage: (m) => posted.push(m), terminate: () => {}, onmessage: null, onerror: null }; return w; };
    const client = createWorkerClient({ makeWorker });
    const nine = client.ways({ id: 'p' }, { today: TODAY });
    const one = client.way({ id: 'p' }, { today: TODAY, way: { id: 'floor-to-age', dials: { floorToAge: 82 } } });
    expect(posted.map((m) => m.type)).toEqual(['ways', 'way']);
    client.stop('way');
    await expect(one).rejects.toMatchObject({ code: 'stopped' });
    // the nine were sent again, unchanged, to the fresh worker
    expect(posted.filter((m) => m.type === 'ways')).toHaveLength(2);
    expect(posted.at(-1).type).toBe('ways');
    w.onmessage({ data: { id: posted.at(-1).id, result: RESULT } });
    await expect(nine).resolves.toEqual(RESULT);
  });
});

describe('the one write file: kind \'way\' (way-and-mix.md 2.4)', { timeout: 60_000 }, () => {
  const at = new Date('2026-10-02T14:03:00.000Z');
  function fakeFb() {
    const writes = [];
    return { writes, fb: { doc: (db, ...path) => ({ path: path.join('/') }), updateDoc: async (ref, data) => { writes.push({ ref: ref.path, data: copy(data) }); }, addDoc: async () => { throw new Error('never'); }, collection: () => ({}) } };
  }
  const handlesFor = (store, uid = 'u1') => () => ({ db: {}, user: { uid }, reread: async () => store.dispatch({ type: A.PLANS_SET, list: store.getState().plans.list, source: 'account', readAt: '14:04' }) });
  async function useWay(raws, planId, id, { dials = {}, source = 'account', session = 'in', sessionStore = null } = {}) {
    const { store, key } = pageOn(raws, planId, { source, session });
    store.dispatch({ type: A.WAYS_WORKING, key });
    store.dispatch({ type: A.WAYS_DONE, key, result: RESULT, ms: 1 });
    store.dispatch({ type: A.WAY_OPEN, id });
    for (const [k, v] of Object.entries(dials)) store.dispatch({ type: A.WAY_DIAL, id, key: k, value: v });
    const { writes, fb } = fakeFb();
    const stop = startPlanWrite(store, { win: null, session: sessionStore, local: null, now: () => at, fb, client: null, handles: handlesFor(store) });
    store.dispatch({ type: A.PLAN_WAY, planId, id });
    await tick(12);
    return { store, writes, stop, key };
  }
  it('an account: ONE updateDoc of exactly wayPatch\'s paths plus lastModified, all declared; plan/saved with op way and the previous values; the plans read again; Undo one more write with the previous values, the stamp among them', async () => {
    const plan = entryOf(ALEX).plan;
    const { store, writes, stop } = await useWay([ALEX], ALEX.id, 'floor-to-age', { dials: { floorToAge: '82' } });
    expect(writes).toHaveLength(1);
    expect(writes[0].ref).toBe('users/u1/scenarios/' + ALEX.id);
    const expected = wayPatch(plan, 'floor-to-age', { floorToAge: '82' }, { today: TODAY, at: at.toISOString(), defaults: { floorToAge: 80 } });
    expect(writes[0].data).toEqual({ ...expected.patch, lastModified: at.toISOString() });
    for (const k of Object.keys(writes[0].data)) expect([...WAY_WRITES, 'lastModified']).toContain(k);
    expect(writes[0].data['stressTool.settings.strategyId']).toBe('floor-to-age');
    expect(writes[0].data['stressTool.settings.strategyParams']).toEqual({ floorToAge: 82 });
    expect(writes[0].data.strategy).toMatchObject({ id: 'floor-to-age', params: { floorToAge: 82 }, lockedAt: at.toISOString() });
    const toast = store.getState().ui.toast;
    expect(toast).toMatchObject({ planId: ALEX.id, kind: 'saved', op: 'way', line: { id: 'way', slots: { way: 'floor-to-age' } } });
    expect(toast.previous).toEqual({ ...expected.previous, lastModified: plan.lastModified });
    expect(store.getState().plans.status).toBe('reading');
    expect(store.getState().lasts).toEqual(emptyLasts());
    // Undo: the previous values back (a key the plan did not have goes back as null)
    store.dispatch({ type: A.PLANS_SET, list: upgradedList([ALEX], noon(TODAY)), source: 'account', readAt: '14:05' });
    store.dispatch({ type: A.PLAN_UNDO, planId: ALEX.id });
    await tick(12);
    expect(writes).toHaveLength(2);
    const back = writes[1].data;
    expect(Object.keys(back).sort()).toEqual(Object.keys(writes[0].data).sort());
    for (const [k, v] of Object.entries(toast.previous)) expect(back[k]).toEqual(v === undefined ? null : v);
    expect(store.getState().ui.toast).toMatchObject({ kind: 'undone' });
    stop();
  });
  it('a locked plan is refused by the guard with the screen bypassed: nothing written; a dial with a problem writes nothing; the plan\'s own way untouched writes nothing but says so', async () => {
    const locked = await useWay([LOCKED], LOCKED.id, 'floor-to-age');
    expect(locked.writes).toEqual([]);
    expect(locked.store.getState().ui.saveProblem).toEqual({ planId: LOCKED.id, problem: 'locked' });
    locked.stop();
    const bad = await useWay([ALEX], ALEX.id, 'floor-to-age', { dials: { floorToAge: 'x' } });
    expect(bad.writes).toEqual([]);
    expect(bad.store.getState().ui.saveProblem).toEqual({ planId: ALEX.id, problem: 'problems' });
    bad.stop();
  });
  it('without an account: the window\'s plan folded with the same patch, the other plan byte-identical; Undo puts the text back byte for byte (a key the plan did not have is deleted)', async () => {
    const other = copy(LOCKED);
    const planted = JSON.stringify([copy(ALEX), other]);
    const sessionStore = { text: planted, getItem: (k) => (k === GUEST_PLANS_KEY ? sessionStore.text : null), setItem: (k, v) => { if (k === GUEST_PLANS_KEY) sessionStore.text = v; } };
    const { store, writes, stop } = await useWay([ALEX, LOCKED], ALEX.id, 'full-il-gilt', { dials: { cashYears: '1' }, source: 'window', session: 'nobody', sessionStore });
    expect(writes).toEqual([]);
    const after = JSON.parse(sessionStore.text);
    expect(JSON.stringify(after[1])).toBe(JSON.stringify(other));
    expect(after[0].stressTool.settings.strategyId).toBe('full-il-gilt');
    expect(after[0].stressTool.settings.strategyParams).toEqual({ cashYears: 1 });
    expect(after[0].strategy).toMatchObject({ id: 'full-il-gilt' });
    const plan = entryOf(ALEX).plan;
    const expected = wayPatch(plan, 'full-il-gilt', { cashYears: '1' }, { today: TODAY, at: at.toISOString(), defaults: {} });
    const stripped = (p) => { const out = copy(p); for (const path of [...WAY_WRITES, 'lastModified']) { const parts = path.split('.'); let o = out; for (let i = 0; i < parts.length - 1 && o; i++) o = o[parts[i]]; if (o) delete o[parts[parts.length - 1]]; } return JSON.stringify(out); };
    expect(stripped(after[0])).toBe(stripped(JSON.parse(planted)[0]));
    for (const [k, v] of Object.entries(expected.patch)) { const parts = k.split('.'); let o = after[0]; for (const part of parts) o = o[part]; expect(o, k).toEqual(v); }
    store.dispatch({ type: A.PLANS_SET, list: upgradedList(after, noon(TODAY)), source: 'window', readAt: '14:05' });
    store.dispatch({ type: A.PLAN_UNDO, planId: ALEX.id });
    await tick(12);
    expect(sessionStore.text).toBe(planted);
    stop();
  });
});
