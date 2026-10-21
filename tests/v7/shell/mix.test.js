/**
 * The machinery of "The mix" (research/v7/way-and-mix.md 3.2, 3.3, 7): the reducer (a try or the comparison is filed under
 * the plan's key; a result for an old key is dropped; the plan saved under the runs empties them; the cell picked; the plans
 * leaving memory clears it; state/replace; readyMark), the runner with a fake client (a try runs in the mixTry lane with the
 * plan's own figures when "Does it last?" holds them; the comparison in the mixCompare lane with progress; failed and no
 * worker; the key moving under a run ends it), the worker handler's `mixTry` and `mixCompare` messages, the client's lanes,
 * and the one write file: "Save the mix" (kind 'save' on the mix step) and "Use this mix" (kind 'mix') — exactly MIX_WRITES
 * plus the stamp, past the guard (a locked plan refused), Undo the exact reverse, the window's plans byte-identical elsewhere.
 */
import { describe, it, expect, vi } from 'vitest';
import { createStore } from '../../../src/v7/effects/store.js';
import { initialState, emptyMix, emptyLasts } from '../../../src/v7/state/initial.js';
import { reduce } from '../../../src/v7/state/reduce.js';
import { A } from '../../../src/v7/state/actions.js';
import { parse } from '../../../src/v7/router/routes.js';
import { readyMark, planMixView } from '../../../src/v7/state/select.js';
import { viewFor, upgradedList } from '../../../src/v7/effects/planSource.js';
import { startMixRunner } from '../../../src/v7/effects/mix.js';
import { startPlanWrite, GUEST_PLANS_KEY } from '../../../src/v7/effects/planWrite.js';
import { createHandler } from '../../../src/v7/effects/answerWorker.js';
import { createWorkerClient, NO_WORKER } from '../../../src/v7/effects/workerClient.js';
import { runKeyOf, mixPatch, useMixPatch } from '../../../src/answers/plan/mix.js';
import { MIX_WRITES } from '../../../src/answers/plan/schema.js';
import { corpus, entryOf, TODAY, noon } from '../plan/_plans.js';

const C = corpus();
const ALEX = C['02-pnv-draft'];
const LOCKED = C['04-buckets-running'];
const tick = async (n = 6) => { for (let i = 0; i < n; i++) await new Promise((r) => setTimeout(r, 0)); };
const copy = (v) => JSON.parse(JSON.stringify(v));
const TRIED = { kind: 'sleeve', on: true, affordable: true, a: { share: 0.9, chancePct: 90, typicalLeft: 400000, badCaseLeft: 40000, years: 33, lasts: true }, base: { share: 0.93, chancePct: 93, typicalLeft: 500000, badCaseLeft: 50000 }, basis: { today: TODAY, engine: 'one-test', runs: 1 } };
const CELLS = { cells: ['own', 'cautious', 'balanced', 'adventurous'].flatMap((key) => [false, true].map((tent) => ({ key, tent, affordable: true, share: 0.9, chancePct: 90, typicalLeft: 400000, badCaseLeft: 40000, amounts: { equity: 1, bond: 1, cash: 1, div: 0 } }))), basis: { today: TODAY, engine: 'one-test', runs: 8 } };
const LASTS = { strategyId: 'pots-and-valves', a: { share: 0.93, chancePct: 93, typicalLeft: 500000, badCaseLeft: 50000, years: 33 }, history: { worst: [], named: [] }, stored: null };

/** A store on the mix step of a plan, the plans read (an account or this window), the reading done as the plan source does. */
function pageOn(raws, planId, { step = 'mix', source = 'account', session = 'in', typed = {} } = {}) {
  const store = createStore(initialState({ today: TODAY, build: 'test' }), reduce);
  store.dispatch({ type: A.ROUTE_SET, route: parse('#/plan/' + planId + '/' + step) });
  store.dispatch({ type: A.SESSION_SET, session: { kind: session, email: session === 'in' ? 'a@b.c' : null } });
  const list = upgradedList(raws, noon(TODAY));
  store.dispatch({ type: A.PLANS_SET, list, source, readAt: '14:03' });
  for (const [path, value] of Object.entries(typed)) store.dispatch({ type: A.PLAN_EDIT, planId, path, value });
  store.dispatch({ type: A.PLANS_VIEW, view: viewFor(store.getState()) });
  let last = null;
  store.subscribe((state) => {
    const now = [state.mix, state.lasts, state.draft.plan, state.plans && state.plans.list];
    if (state.plans && state.plans.status === 'read' && (!state.plans.view || !last || now.some((v, i) => v !== last[i]))) { last = now; store.dispatch({ type: A.PLANS_VIEW, view: viewFor(state) }); }
  });
  return { store, key: runKeyOf(list.find((e) => String(e.plan.id) === String(planId)).plan), list };
}

describe('the reducer: the mix\'s runs in page memory', () => {
  const s0 = initialState({ today: TODAY, build: 'test' });
  it('starts empty; a try is filed under its key, done or failed, closed; a result for another key or another kind is dropped', () => {
    expect(s0.mix).toEqual(emptyMix());
    let s = reduce(s0, { type: A.MIX_TRY, key: 'k1', kind: 'sleeve' });
    expect(s.mix).toMatchObject({ key: 'k1', tries: { sleeve: { status: 'working', result: null } } });
    expect(reduce(s, { type: A.MIX_TRY, key: 'k1', kind: 'sleeve' })).toBe(s);                                          // once
    expect(reduce(s, { type: A.MIX_TRIED, key: 'k2', kind: 'sleeve', result: TRIED, ms: 1 })).toBe(s);                 // stale key
    expect(reduce(s, { type: A.MIX_TRIED, key: 'k1', kind: 'tent', result: TRIED, ms: 1 })).toBe(s);                   // not asked
    expect(() => reduce(s, { type: A.MIX_TRIED, key: 'k1', kind: 'sleeve', result: null })).toThrow(/needs a result/);
    s = reduce(s, { type: A.MIX_TRIED, key: 'k1', kind: 'sleeve', result: TRIED, ms: 480.4 });
    expect(s.mix.tries.sleeve).toEqual({ status: 'done', result: TRIED, ms: 480, reason: null });
    const f = reduce(reduce(s, { type: A.MIX_TRY, key: 'k1', kind: 'tent' }), { type: A.MIX_TRY_FAILED, key: 'k1', kind: 'tent', reason: 'noWorker' });
    expect(f.mix.tries.tent).toMatchObject({ status: 'failed', reason: 'noWorker' });
    expect(f.mix.tries.sleeve.status).toBe('done');
    const closed = reduce(f, { type: A.MIX_TRY_CLOSE, kind: 'sleeve' });
    expect(closed.mix.tries).toEqual({ tent: f.mix.tries.tent });
    expect(reduce(closed, { type: A.MIX_TRY_CLOSE, kind: 'sleeve' })).toBe(closed);
    expect(() => reduce(s0, { type: A.MIX_TRY, key: 'k1', kind: 'odd' })).toThrow(/no try/);
    expect(() => reduce(s0, { type: A.MIX_TRY, kind: 'sleeve' })).toThrow(/needs a key/);
    // another key under the tries (the plan saved, or another plan): the old tries go
    const moved = reduce(s, { type: A.MIX_TRY, key: 'k2', kind: 'tent' });
    expect(moved.mix).toMatchObject({ key: 'k2', tries: { tent: { status: 'working' } } });
    expect(moved.mix.tries.sleeve).toBeUndefined();
  });
  it('the comparison: working with progress, done with the cost, failed; a stale result dropped; the cell picked only once it ran; "Use this mix" sets the write under way and clears the pick', () => {
    let s = reduce(s0, { type: A.MIX_COMPARE, key: 'k1' });
    expect(s.mix.compare).toMatchObject({ status: 'working', result: null });
    expect(s.mix.pick).toBe(null);
    expect(reduce(s, { type: A.MIX_COMPARE, key: 'k1' })).toBe(s);
    s = reduce(s, { type: A.MIX_COMPARE_PROGRESS, key: 'k1', done: 3, total: 8 });
    expect(s.mix.compare.progress).toEqual({ done: 3, total: 8 });
    expect(reduce(s, { type: A.MIX_COMPARE_PROGRESS, key: 'k2', done: 4, total: 8 })).toBe(s);
    expect(reduce(s, { type: A.MIX_COMPARED, key: 'k2', result: CELLS, ms: 1 })).toBe(s);
    expect(reduce(s, { type: A.MIX_PICK, cell: { key: 'balanced', tent: true } })).toBe(s);                              // not yet run
    s = reduce(s, { type: A.MIX_COMPARED, key: 'k1', result: CELLS, ms: 3900.2 });
    expect(s.mix.compare).toEqual({ status: 'done', result: CELLS, ms: 3900, progress: null, reason: null });
    s = reduce(s, { type: A.MIX_PICK, cell: { key: 'balanced', tent: true, odd: 1 } });
    expect(s.mix.pick).toEqual({ key: 'balanced', tent: true });
    expect(reduce(s, { type: A.MIX_PICK, cell: { key: 'balanced', tent: true } })).toBe(s);
    expect(() => reduce(s, { type: A.MIX_PICK, cell: { key: 'odd' } })).toThrow(/not a cell/);
    const use = reduce(s, { type: A.PLAN_MIX, planId: 'p1', cell: { key: 'balanced', tent: true } });
    expect(use.ui.saving).toEqual({ planId: 'p1', kind: 'mix', cell: { key: 'balanced', tent: true } });
    expect(use.mix.pick).toBe(null);
    expect(reduce(use, { type: A.PLAN_MIX, planId: 'p1', cell: { key: 'own', tent: false } })).toBe(use);
    expect(() => reduce(s, { type: A.PLAN_MIX, planId: 'p1', cell: { key: 'odd' } })).toThrow(/not a cell/);
    const failed = reduce(reduce(s0, { type: A.MIX_COMPARE, key: 'k1' }), { type: A.MIX_COMPARE_FAILED, key: 'k1' });
    expect(failed.mix.compare).toMatchObject({ status: 'failed', reason: null });
    expect(reduce(s, { type: A.MIX_PICK, cell: null }).mix.pick).toBe(null);
    // another key: the comparison and the pick go
    expect(reduce(s, { type: A.MIX_COMPARE, key: 'k2' }).mix).toMatchObject({ key: 'k2', tries: {}, pick: null, compare: { status: 'working' } });
  });
  it('plan/saved with op mix clears "Does it last?"\'s result; the plans leaving memory clears the mix; state/replace takes a mix state (cleaned) or starts empty; the state survives JSON', () => {
    let s = reduce(reduce(s0, { type: A.MIX_COMPARE, key: 'k1' }), { type: A.MIX_COMPARED, key: 'k1', result: CELLS, ms: 1 });
    s = reduce(reduce(s, { type: A.LASTS_WORKING, key: 'L' }), { type: A.LASTS_DONE, key: 'L', result: LASTS });
    const saved = reduce(s, { type: A.PLAN_SAVED, planId: 'p1', previous: { 'stressTool.settings.equityMin': 1 }, line: { id: 'use', slots: { key: 'balanced', tent: 'on' } }, op: 'mix' });
    expect(saved.lasts).toEqual(emptyLasts());
    expect(saved.ui.toast).toMatchObject({ kind: 'saved', op: 'mix' });
    expect(reduce(s, { type: A.PLANS_CLEAR }).mix).toEqual(emptyMix());
    expect(JSON.parse(JSON.stringify(s))).toEqual(s);
    const r = reduce(s0, { type: A.STATE_REPLACE, state: { ...s, mix: { ...s.mix, tries: { sleeve: { status: 'done', result: TRIED, ms: 480 }, odd: { status: 'done' } }, pick: { key: 'cautious', tent: 'yes' } } } });
    expect(r.mix).toMatchObject({ key: 'k1', compare: { status: 'done', ms: 1 }, pick: { key: 'cautious', tent: false } });
    expect(r.mix.tries).toEqual({ sleeve: { status: 'done', result: TRIED, ms: 480, reason: null } });
    expect(reduce(s0, { type: A.STATE_REPLACE, state: { ...s, mix: { key: 3 } } }).mix).toEqual(emptyMix());
  });
  it('readyMark: a try or the comparison under way is not ready; planMixView carries the open blocks', () => {
    const { store, key } = pageOn([ALEX], ALEX.id);
    expect(readyMark(store.getState()).ready).toBe('1');
    store.dispatch({ type: A.MIX_TRY, key, kind: 'sleeve' });
    expect(readyMark(store.getState()).ready).toBe('0');
    store.dispatch({ type: A.MIX_TRIED, key, kind: 'sleeve', result: TRIED, ms: 1 });
    expect(readyMark(store.getState()).ready).toBe('1');
    store.dispatch({ type: A.MIX_COMPARE, key });
    expect(readyMark(store.getState()).ready).toBe('0');
    store.dispatch({ type: A.MIX_COMPARED, key, result: CELLS, ms: 1 });
    expect(readyMark(store.getState()).ready).toBe('1');
    const v = planMixView(store.getState());
    expect(v).toMatchObject({ found: true, id: ALEX.id, held: 'split', pasteOpen: false, exampleOpen: false });
    expect(v.compare.cells).toHaveLength(8);
    expect(v.sleeve.try.status).toBe('done');
    store.dispatch({ type: A.UI_TOGGLE, id: 'mixExample' });
    expect(planMixView(store.getState()).exampleOpen).toBe(true);
    expect(planMixView(reduce(store.getState(), { type: A.ROUTE_SET, route: parse('#/plans') })).found).toBe(false);
  });
});

describe('the runner', () => {
  const fakeClient = ({ mixTry = null, mixCompare = null, stopped = [] } = {}) => ({ mixTry, mixCompare, stop: (q) => stopped.push(q) });
  it('mix/try → client.mixTry(plan, { today, kind, base }) in its lane, the base from "Does it last?" when held for the key, else null; filed under the key with the cost', async () => {
    const { store, key } = pageOn([ALEX], ALEX.id);
    const calls = [];
    let t = 1000;
    const client = fakeClient({ mixTry: (plan, env) => { calls.push({ id: plan.id, env }); t += 480; return Promise.resolve(TRIED); } });
    const stop = startMixRunner({ store, client, now: () => t });
    store.dispatch({ type: A.MIX_TRY, key, kind: 'sleeve' });
    await tick();
    expect(calls).toEqual([{ id: ALEX.id, env: { today: TODAY, kind: 'sleeve', base: null } }]);
    expect(store.getState().mix.tries.sleeve).toEqual({ status: 'done', result: TRIED, ms: 480, reason: null });
    store.dispatch({ type: A.LASTS_WORKING, key });
    store.dispatch({ type: A.LASTS_DONE, key, result: LASTS });
    store.dispatch({ type: A.MIX_TRY, key, kind: 'tent' });
    await tick();
    expect(calls[1].env).toEqual({ today: TODAY, kind: 'tent', base: { share: 0.93, chancePct: 93, typicalLeft: 500000, badCaseLeft: 50000 } });
    // the page's reading carries the try's words (the plan source reads again on every change of the mix)
    expect(viewFor(store.getState()).page.mix.sleeve.try.status).toBe('done');
    stop();
  });
  it('mix/compare → client.mixCompare with progress → mix/compared; a failure, and no worker; the key moving under a run ends it and drops its answer', async () => {
    const { store, key } = pageOn([ALEX], ALEX.id);
    let n = 0;
    const stopped = [];
    const client = fakeClient({ mixCompare: (plan, env, onProgress) => { onProgress(3, 8); return ++n === 1 ? Promise.resolve(CELLS) : Promise.reject(new Error('boom')); }, mixTry: () => Promise.reject(Object.assign(new Error('none'), { code: NO_WORKER })), stopped });
    const stop = startMixRunner({ store, client });
    store.dispatch({ type: A.MIX_COMPARE, key });
    await tick();
    expect(store.getState().mix.compare).toMatchObject({ status: 'done', result: CELLS });
    store.dispatch({ type: A.MIX_COMPARE, key });
    await tick();
    expect(store.getState().mix.compare).toMatchObject({ status: 'failed', reason: null });
    store.dispatch({ type: A.MIX_TRY, key, kind: 'sleeve' });
    await tick();
    expect(store.getState().mix.tries.sleeve).toMatchObject({ status: 'failed', reason: 'noWorker' });
    stop();
    // the plan changes under a run: the old run is ended, its answer dropped
    const page2 = pageOn([ALEX], ALEX.id);
    const resolvers = [];
    const stopped2 = [];
    const stop2 = startMixRunner({ store: page2.store, client: fakeClient({ mixCompare: () => new Promise((resolve) => resolvers.push(resolve)), stopped: stopped2 }) });
    page2.store.dispatch({ type: A.MIX_COMPARE, key: page2.key });
    await tick();
    expect(page2.store.getState().mix.compare.status).toBe('working');
    const changed = copy(ALEX);
    changed.lastModified = '2026-10-02T14:03:00.000Z';
    page2.store.dispatch({ type: A.PLANS_SET, list: upgradedList([changed], noon(TODAY)), source: 'account', readAt: '14:04' });
    page2.store.dispatch({ type: A.UI_RAIL, open: true });
    await tick();
    expect(stopped2).toContain('mixCompare');
    resolvers[0](CELLS);
    await tick();
    expect(page2.store.getState().mix.key).toBe(page2.key);
    expect(page2.store.getState().mix.compare.status, 'the old answer is dropped').toBe('working');
    stop2();
  });
});

describe('the worker: the mixTry and mixCompare messages, and the client\'s lanes', () => {
  const plan = entryOf(ALEX).plan;
  const collect = async (handle, msg) => { const out = []; handle(msg, (m) => out.push(m)); await tick(12); return out; };
  it('fake runs through the real handler: the date from init, the base passed on, progress then plain data; no plan, no kind → an error', async () => {
    const seen = [];
    const fakeTry = (p, { today, kind, base, onProgress }) => { seen.push(['mixTry', p.id, today, kind, base]); onProgress(0, 1); onProgress(1, 1); return { ...TRIED, f: () => 1 }; };
    const fakeCompare = (p, { today, onProgress }) => { seen.push(['mixCompare', p.id, today]); onProgress(0, 8); onProgress(8, 8); return CELLS; };
    const handle = createHandler(undefined, { mixTry: fakeTry, mixCompare: fakeCompare });
    handle({ id: 1, type: 'init', today: TODAY }, () => {});
    const out = await collect(handle, { id: 2, type: 'mixTry', plan, env: { kind: 'sleeve', base: { badCaseLeft: 1 } } });
    expect(seen[0]).toEqual(['mixTry', plan.id, TODAY, 'sleeve', { badCaseLeft: 1 }]);
    expect(out.at(-1)).toEqual({ id: 2, result: TRIED });
    const cmp = await collect(handle, { id: 3, type: 'mixCompare', plan, env: { today: TODAY } });
    expect(seen[1]).toEqual(['mixCompare', plan.id, TODAY]);
    expect(cmp[0]).toEqual({ id: 3, progress: { done: 0, total: 8 } });
    expect(cmp.at(-1)).toEqual({ id: 3, result: CELLS });
    expect(await collect(handle, { id: 4, type: 'mixTry', env: { kind: 'sleeve' } })).toEqual([{ id: 4, error: expect.stringMatching(/no plan/) }]);
    expect(await collect(handle, { id: 5, type: 'mixTry', plan, env: { kind: 'odd' } })).toEqual([{ id: 5, error: expect.stringMatching(/no kind/) }]);
    expect(await collect(handle, { id: 6, type: 'mixCompare', env: {} })).toEqual([{ id: 6, error: expect.stringMatching(/no plan/) }]);
  });
  it('the real run, loaded lazily by the handler: a try then plain data (two runs without a base, one with); the eight cells then plain data', { timeout: 120_000 }, async () => {
    const handle = createHandler();
    const wait = async (out) => { for (let i = 0; i < 2400 && !out.some((m) => 'result' in m || 'error' in m); i++) await new Promise((r) => setTimeout(r, 25)); return out.at(-1); };
    const one = [];
    handle({ id: 7, type: 'mixTry', plan, env: { today: TODAY, kind: 'tent' } }, (m) => one.push(m));
    const r1 = await wait(one);
    expect(r1.result, JSON.stringify(r1)).toMatchObject({ kind: 'tent', on: true, affordable: true, basis: { runs: 2 } });
    expect(r1.result.base.badCaseLeft).toBeTypeOf('number');
    const two = [];
    handle({ id: 8, type: 'mixTry', plan, env: { today: TODAY, kind: 'sleeve', base: { share: 0.9, chancePct: 90, typicalLeft: 1, badCaseLeft: 2 } } }, (m) => two.push(m));
    const r2 = await wait(two);
    expect(r2.result).toMatchObject({ kind: 'sleeve', on: true, basis: { runs: 1 }, base: { badCaseLeft: 2 } });
    const eight = [];
    handle({ id: 9, type: 'mixCompare', plan, env: { today: TODAY } }, (m) => eight.push(m));
    const r3 = await wait(eight);
    expect(r3.result.cells.map((c) => c.key + (c.tent ? '+' : '-'))).toEqual(['own-', 'own+', 'cautious-', 'cautious+', 'balanced-', 'balanced+', 'adventurous-', 'adventurous+']);
    expect(eight.slice(0, -1).every((m) => m.progress)).toBe(true);
  });
  it('the client: mixTry and mixCompare are their own lanes; stop(\'mixTry\') ends a try and leaves the comparison running', async () => {
    const posted = [];
    let w;
    const makeWorker = () => { w = { postMessage: (m) => posted.push(m), terminate: () => {}, onmessage: null, onerror: null }; return w; };
    const client = createWorkerClient({ makeWorker });
    const eight = client.mixCompare({ id: 'p' }, { today: TODAY });
    const one = client.mixTry({ id: 'p' }, { today: TODAY, kind: 'sleeve', base: null });
    expect(posted.map((m) => m.type)).toEqual(['mixCompare', 'mixTry']);
    client.stop('mixTry');
    await expect(one).rejects.toMatchObject({ code: 'stopped' });
    expect(posted.filter((m) => m.type === 'mixCompare')).toHaveLength(2);
    w.onmessage({ data: { id: posted.at(-1).id, result: CELLS } });
    await expect(eight).resolves.toEqual(CELLS);
  });
});

describe('the one write file: "Save the mix" and "Use this mix" (way-and-mix.md 3.3)', { timeout: 60_000 }, () => {
  const at = new Date('2026-10-02T14:03:00.000Z');
  function fakeFb() {
    const writes = [];
    return { writes, fb: { doc: (db, ...path) => ({ path: path.join('/') }), updateDoc: async (ref, data) => { writes.push({ ref: ref.path, data: copy(data) }); }, addDoc: async () => { throw new Error('never'); }, collection: () => ({}) } };
  }
  const handlesFor = (store, uid = 'u1') => () => ({ db: {}, user: { uid }, reread: async () => store.dispatch({ type: A.PLANS_SET, list: store.getState().plans.list, source: 'account', readAt: '14:04' }) });
  it('an account: Save on the mix step writes exactly mixPatch\'s paths plus lastModified (a level with the slice), all declared; plan/saved with the previous values; Undo one more write with the previous values', async () => {
    const typed = { held: 'level', level: 'balanced', sleeve: 'yes' };
    const { store } = pageOn([ALEX], ALEX.id, { typed });
    const { writes, fb } = fakeFb();
    const stop = startPlanWrite(store, { win: null, session: null, local: null, now: () => at, fb, client: null, handles: handlesFor(store) });
    store.dispatch({ type: A.PLAN_SAVE, planId: ALEX.id });
    await tick(12);
    const plan = entryOf(ALEX).plan;
    const expected = mixPatch(plan, typed, { today: TODAY });
    expect(writes).toHaveLength(1);
    expect(writes[0].ref).toBe('users/u1/scenarios/' + ALEX.id);
    expect(writes[0].data).toEqual({ ...expected.patch, lastModified: at.toISOString() });
    for (const k of Object.keys(writes[0].data)) expect([...MIX_WRITES, 'lastModified']).toContain(k);
    expect(writes[0].data['stressTool.settings.diversifierStart']).toBeGreaterThan(0);
    expect(writes[0].data['stressTool.settings.subAsset']).toEqual({});
    expect(writes[0].data['stressTool.settings.strategyState']['pots-and-valves']).toMatchObject({ allocMode: 'risk', savedAt: TODAY });
    const toast = store.getState().ui.toast;
    expect(toast).toMatchObject({ planId: ALEX.id, kind: 'saved', line: { id: 'mix', slots: { held: 'level' } } });
    expect(toast.previous).toEqual({ ...expected.previous, lastModified: plan.lastModified });
    store.dispatch({ type: A.PLANS_SET, list: upgradedList([ALEX], noon(TODAY)), source: 'account', readAt: '14:05' });
    store.dispatch({ type: A.PLAN_UNDO, planId: ALEX.id });
    await tick(12);
    expect(writes).toHaveLength(2);
    expect(Object.keys(writes[1].data).sort()).toEqual(Object.keys(writes[0].data).sort());
    for (const [k, v] of Object.entries(toast.previous)) expect(writes[1].data[k]).toEqual(v === undefined ? null : v);
    stop();
  });
  it('"Use this mix" on a cell of the comparison held: one write of the cell\'s amounts, allocMode risk and the tent; refused as noRun without the comparison; a locked plan refused by the guard; nothing written on a plan saved as it is', async () => {
    const { store, key } = pageOn([ALEX], ALEX.id);
    const { writes, fb } = fakeFb();
    const stop = startPlanWrite(store, { win: null, session: null, local: null, now: () => at, fb, client: null, handles: handlesFor(store) });
    store.dispatch({ type: A.PLAN_MIX, planId: ALEX.id, cell: { key: 'balanced', tent: true } });
    await tick(12);
    expect(writes).toEqual([]);
    expect(store.getState().ui.saveProblem).toEqual({ planId: ALEX.id, problem: 'noRun' });
    store.dispatch({ type: A.MIX_COMPARE, key });
    store.dispatch({ type: A.MIX_COMPARED, key, result: CELLS, ms: 1 });
    store.dispatch({ type: A.PLAN_MIX, planId: ALEX.id, cell: { key: 'balanced', tent: true } });
    await tick(12);
    expect(writes).toHaveLength(1);
    const expected = useMixPatch(entryOf(ALEX).plan, { key: 'balanced', tent: true }, { today: TODAY });
    expect(writes[0].data).toEqual({ ...expected.patch, lastModified: at.toISOString() });
    expect(writes[0].data['stressTool.settings.equityGlideEnabled']).toBe(true);
    expect(writes[0].data['stressTool.settings.allocMode']).toBeUndefined();   // already 'risk' on this plan: not written
    expect(store.getState().ui.toast).toMatchObject({ kind: 'saved', op: 'mix', line: { id: 'use', slots: { key: 'balanced', tent: 'on' } } });
    expect(store.getState().lasts).toEqual(emptyLasts());
    stop();
    const locked = pageOn([LOCKED], LOCKED.id);
    const l = fakeFb();
    const stopL = startPlanWrite(locked.store, { win: null, session: null, local: null, now: () => at, fb: l.fb, client: null, handles: handlesFor(locked.store) });
    locked.store.dispatch({ type: A.MIX_COMPARE, key: locked.key });
    locked.store.dispatch({ type: A.MIX_COMPARED, key: locked.key, result: CELLS, ms: 1 });
    locked.store.dispatch({ type: A.PLAN_MIX, planId: LOCKED.id, cell: { key: 'cautious', tent: false } });
    await tick(12);
    expect(l.writes).toEqual([]);
    expect(locked.store.getState().ui.saveProblem).toEqual({ planId: LOCKED.id, problem: 'locked' });
    locked.store.dispatch({ type: A.PLAN_SAVE, planId: LOCKED.id });
    await tick(12);
    expect(l.writes).toEqual([]);
    expect(locked.store.getState().ui.saveProblem).toEqual({ planId: LOCKED.id, problem: 'locked' });
    stopL();
    const same = pageOn([ALEX], ALEX.id);
    const s = fakeFb();
    const stopS = startPlanWrite(same.store, { win: null, session: null, local: null, now: () => at, fb: s.fb, client: null, handles: handlesFor(same.store) });
    same.store.dispatch({ type: A.PLAN_SAVE, planId: ALEX.id });
    await tick(12);
    expect(s.writes).toEqual([]);
    expect(same.store.getState().ui.toast).toMatchObject({ kind: 'unchanged' });
    stopS();
  });
  it('without an account: the window\'s plan folded with the same patch (a funds list typed), the other plan byte-identical; Undo puts the text back byte for byte', async () => {
    const other = copy(LOCKED);
    const planted = JSON.stringify([copy(ALEX), other]);
    const sessionStore = { text: planted, getItem: (k) => (k === GUEST_PLANS_KEY ? sessionStore.text : null), setItem: (k, v) => { if (k === GUEST_PLANS_KEY) sessionStore.text = v; } };
    const typed = { held: 'funds', 'funds.ids': 'n1,n2', 'funds.n1.ticker': 'VWRP', 'funds.n1.value': '300000', 'funds.n2.ticker': 'IGLS', 'funds.n2.value': '100000', 'funds.n2.wrapper': 'ISA' };
    const { store } = pageOn([ALEX, LOCKED], ALEX.id, { source: 'window', session: 'nobody', typed });
    const { writes, fb } = fakeFb();
    const stop = startPlanWrite(store, { win: null, session: sessionStore, local: null, now: () => at, fb, client: null, handles: () => ({ db: null, user: null, reread: async () => {} }) });
    store.dispatch({ type: A.PLAN_SAVE, planId: ALEX.id });
    await tick(12);
    expect(writes).toEqual([]);
    const after = JSON.parse(sessionStore.text);
    expect(JSON.stringify(after[1])).toBe(JSON.stringify(other));
    expect(after[0].stressTool.settings.allocMode).toBe('funds');
    expect(after[0].stressTool.settings.taggedFunds).toEqual([{ ticker: 'VWRP', value: 300000, wrapper: 'SIPP', subClass: 'worldGrowth' }, { ticker: 'IGLS', value: 100000, wrapper: 'ISA', subClass: 'shortGilts' }]);
    expect(after[0].stressTool.settings.isaBalance).toBe(100000);
    expect(after[0].stressTool.settings.equityMin).toBe(300000);
    const expected = mixPatch(entryOf(ALEX).plan, typed, { today: TODAY });
    const stripped = (p) => { const out = copy(p); for (const path of [...MIX_WRITES, 'lastModified']) { const parts = path.split('.'); let o = out; for (let i = 0; i < parts.length - 1 && o; i++) o = o[parts[i]]; if (o) delete o[parts[parts.length - 1]]; } return JSON.stringify(out); };
    expect(stripped(after[0])).toBe(stripped(JSON.parse(planted)[0]));
    for (const [k, v] of Object.entries(expected.patch)) { const parts = k.split('.'); let o = after[0]; for (const part of parts) o = o[part]; expect(o, k).toEqual(v); }
    store.dispatch({ type: A.PLANS_SET, list: upgradedList(after, noon(TODAY)), source: 'window', readAt: '14:05' });
    store.dispatch({ type: A.PLAN_UNDO, planId: ALEX.id });
    await tick(12);
    expect(sessionStore.text).toBe(planted);
    stop();
  });
});
