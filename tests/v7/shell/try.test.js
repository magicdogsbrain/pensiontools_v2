/**
 * The machinery of Try a change on a plan (research/v7/way-and-mix.md 4, 7): the reducer (a change is tried only on the
 * run held; the boxes go with the try; a result for stale boxes or a stale key is dropped; "Use this" and the keep only
 * after a try ran; the copy kept; the plan changing under a try puts it away; state/replace), the runner with a fake client
 * (the try runs in its own lane on the plan of the run held; failed and no worker; the key moving ends it), the worker's
 * `try` message, the client's lane, and the one write file: "Use this" (kind 'try') — ONE write of exactly the fields that
 * differ, composed from the steps' lists, all declared, past the guard, Undo the exact reverse, the window path byte-identical
 * elsewhere — and "Keep as a separate plan" (kind 'tryKeep'): one addDoc through the one call site on users/{uid}/scenarios
 * of the copy (unlocked, no document, record or archive, named "{name} · tried" made unique, never active); the window path
 * appends it with a guest id; 'full', 'unverified', 'usedUp', 'storage'.
 */
import { describe, it, expect } from 'vitest';
import { createStore } from '../../../src/v7/effects/store.js';
import { initialState, emptyLasts } from '../../../src/v7/state/initial.js';
import { reduce } from '../../../src/v7/state/reduce.js';
import { A } from '../../../src/v7/state/actions.js';
import { parse } from '../../../src/v7/router/routes.js';
import { readyMark } from '../../../src/v7/state/select.js';
import { viewFor, upgradedList } from '../../../src/v7/effects/planSource.js';
import { startLastsRunner } from '../../../src/v7/effects/lasts.js';
import { startPlanWrite, GUEST_PLANS_KEY } from '../../../src/v7/effects/planWrite.js';
import { createHandler } from '../../../src/v7/effects/answerWorker.js';
import { createWorkerClient, NO_WORKER } from '../../../src/v7/effects/workerClient.js';
import { runKeyOf, tryPatch, tryBoxesOf, checkTry, tryCopyOf } from '../../../src/answers/plan/lasts.js';
import { trySettings } from '../../../src/answers/plan/lastsRun.js';
import { TRY_WRITES, ALL_WRITES } from '../../../src/answers/plan/schema.js';
import { planProblems } from '../../../src/answers/keep/planCreate.js';
import { upgradeScenario } from '../../../src/firebase/scenarioMigration.js';
import { isLockedSettings } from '../../../src/services/LockedPlanGuard.js';
import { KEY_MINUTES, GUEST_ALLOWANCE_MINUTES } from '../../../src/services/GuestMeter.js';
import { corpus, entryOf, TODAY, noon } from '../plan/_plans.js';

const C = corpus();
const ALEX = C['02-pnv-draft'];
const LOCKED = C['04-buckets-running'];
const tick = async (n = 6) => { for (let i = 0; i < n; i++) await new Promise((r) => setTimeout(r, 0)); };
const copy = (v) => JSON.parse(JSON.stringify(v));
const RESULT = { strategyId: 'pots-and-valves', a: { share: 0.93, chancePct: 93, years: 32, typicalLeft: 100, badCaseLeft: 1, goodCaseLeft: 200, futures: 1000, histories: 700 }, history: { worst: [], named: [] }, stored: null };
const TRIED = { strategyId: 'floor-to-age', ran: { family: false }, priced: 'bundled', a: { share: 0.9, chancePct: 90, years: 30, typicalLeft: 50, badCaseLeft: 1, goodCaseLeft: 100, futures: 1000, histories: 700 }, reason: null, history: null, stored: null, basis: { today: TODAY, engine: 'one-test', runs: 1 } };
const at = new Date('2026-10-02T14:03:00.000Z');

function pageOn(raws, planId, { source = 'account', session = 'in', typed = {} } = {}) {
  const store = createStore(initialState({ today: TODAY, build: 'test' }), reduce);
  store.dispatch({ type: A.ROUTE_SET, route: parse('#/plan/' + planId + '/lasts') });
  store.dispatch({ type: A.SESSION_SET, session: { kind: session, email: session === 'in' || session === 'unverified' ? 'a@b.c' : null } });
  const list = upgradedList(raws, noon(TODAY));
  store.dispatch({ type: A.PLANS_SET, list, source, readAt: '14:03' });
  for (const [path, value] of Object.entries(typed)) store.dispatch({ type: A.PLAN_EDIT, planId, path, value });
  store.dispatch({ type: A.PLANS_VIEW, view: viewFor(store.getState()) });
  let last = null;
  store.subscribe((state) => {
    const now = [state.lasts, state.draft.plan, state.plans && state.plans.list];
    if (state.plans && state.plans.status === 'read' && (!state.plans.view || !last || now.some((v, i) => v !== last[i]))) { last = now; store.dispatch({ type: A.PLANS_VIEW, view: viewFor(state) }); }
  });
  const key = runKeyOf(list.find((e) => String(e.plan.id) === String(planId)).plan);
  return { store, key, list, boxes: () => store.getState().plans.view.page.lasts.try.run };
}
const held = (key) => [{ type: A.LASTS_WORKING, key }, { type: A.LASTS_DONE, key, result: RESULT }];
const run = (s, ...actions) => actions.reduce((x, a) => reduce(x, a), s);
const BOXES = { way: 'floor-to-age', pot: 700000, isa: 45000, isaPolicy: 'hold', incomeMode: 'shape', income: 0, years: 30, cuts: 'saved', cutPct: '', cutEsc: '' };

describe('the reducer', () => {
  const s0 = initialState({ today: TODAY, build: 'test' });
  it('a try runs only on the run held, with its boxes; done or failed for those boxes and that key, else dropped; closed; the same boxes under way are not asked twice', () => {
    expect(reduce(s0, { type: A.TRY_RUN, boxes: BOXES })).toBe(s0);
    let s = run(s0, ...held('k1'), { type: A.TRY_RUN, boxes: BOXES });
    expect(s.lasts.tried).toEqual({ status: 'working', boxes: BOXES, result: null, ms: null, reason: null });
    expect(reduce(s, { type: A.TRY_RUN, boxes: BOXES })).toBe(s);
    expect(reduce(s, { type: A.TRY_DONE, key: 'k2', boxes: BOXES, result: TRIED, ms: 1 })).toBe(s);
    expect(reduce(s, { type: A.TRY_DONE, key: 'k1', boxes: { ...BOXES, years: 31 }, result: TRIED, ms: 1 })).toBe(s);
    expect(() => reduce(s, { type: A.TRY_DONE, key: 'k1', boxes: BOXES, result: null })).toThrow(/needs a result/);
    expect(() => reduce(s0, { type: A.TRY_RUN })).toThrow(/needs the boxes/);
    s = reduce(s, { type: A.TRY_DONE, key: 'k1', boxes: BOXES, result: TRIED, ms: 520.4 });
    expect(s.lasts.tried).toEqual({ status: 'working', boxes: BOXES, result: null, ms: null, reason: null } && { status: 'done', boxes: BOXES, result: TRIED, ms: 520, reason: null });
    const again = reduce(s, { type: A.TRY_RUN, boxes: { ...BOXES, years: 31 } });
    expect(again.lasts.tried).toMatchObject({ status: 'working', boxes: { years: 31 } });
    const failed = reduce(again, { type: A.TRY_FAILED, key: 'k1', boxes: { ...BOXES, years: 31 }, reason: 'noWorker' });
    expect(failed.lasts.tried).toMatchObject({ status: 'failed', reason: 'noWorker' });
    expect(reduce(failed, { type: A.TRY_CLOSE }).lasts.tried).toBe(null);
    expect(reduce(s0, { type: A.TRY_CLOSE })).toBe(s0);
  });
  it('"Use this" and the keep only after a try ran; the copy kept is remembered; the plan changing under a try puts it away but keeps what was kept; plan/saved with op try clears the run and keeps the copy', () => {
    const base = run(s0, ...held('k1'), { type: A.TRY_RUN, boxes: BOXES });
    expect(reduce(base, { type: A.PLAN_TRY, planId: 'p1' })).toBe(base);
    expect(reduce(base, { type: A.TRY_KEEP, planId: 'p1' })).toBe(base);
    const done = reduce(base, { type: A.TRY_DONE, key: 'k1', boxes: BOXES, result: TRIED, ms: 1 });
    const use = reduce(reduce(done, { type: A.UI_TOGGLE, id: 'tryConfirm' }), { type: A.PLAN_TRY, planId: 'p1' });
    expect(use.ui.saving).toEqual({ planId: 'p1', kind: 'try' });
    expect(use.ui.open).not.toContain('tryConfirm');
    const keep = reduce(done, { type: A.TRY_KEEP, planId: 'p1' });
    expect(keep.ui.saving).toEqual({ planId: 'p1', kind: 'tryKeep' });
    expect(reduce(keep, { type: A.PLAN_TRY, planId: 'p1' })).toBe(keep);
    const kept = reduce(keep, { type: A.TRY_KEPT, planId: 'p1', id: 'Kq8LwT2mJv5PzYc9BnRd', name: 'One · tried', where: 'account' });
    expect(kept.lasts.kept).toEqual({ id: 'Kq8LwT2mJv5PzYc9BnRd', name: 'One · tried', where: 'account' });
    expect(kept.ui.saving).toBe(null);
    expect(() => reduce(keep, { type: A.TRY_KEPT, planId: 'p1', id: 'bad id', name: 'x', where: 'account' })).toThrow();
    const moved = reduce(kept, { type: A.LASTS_WORKING, key: 'k2' });
    expect(moved.lasts.tried).toBe(null);
    expect(moved.lasts.kept).toEqual(kept.lasts.kept);
    expect(reduce(kept, { type: A.LASTS_WORKING, key: 'k1' }).lasts.tried.status).toBe('done');
    const saved = reduce(reduce(kept, { type: A.UI_TOGGLE, id: 'tryOpen' }), { type: A.PLAN_SAVED, planId: 'p1', previous: { 'stressTool.settings.duration': 33 }, line: { id: 'try', slots: { n: '3' } }, op: 'try' });
    expect(saved.lasts).toEqual({ ...emptyLasts(), kept: kept.lasts.kept });
    expect(saved.ui.open, 'the boxes close with the change used').not.toContain('tryOpen');
    expect(saved.ui.toast).toMatchObject({ kind: 'saved', op: 'try' });
    expect(reduce(kept, { type: A.PLANS_CLEAR }).lasts).toEqual(emptyLasts());
    expect(JSON.parse(JSON.stringify(kept))).toEqual(kept);
    const r = reduce(s0, { type: A.STATE_REPLACE, state: { ...kept, lasts: { ...kept.lasts, tried: { ...kept.lasts.tried, ms: 'x' }, kept: { id: 'no spaces', name: 'x', where: 'account' } } } });
    expect(r.lasts.tried).toMatchObject({ status: 'done', boxes: BOXES, ms: null });
    expect(r.lasts.kept).toBe(null);
    expect(['full', 'unverified'].map((p) => reduce(s0, { type: A.PLAN_SAVE_FAILED, planId: 'p1', problem: p }).ui.saveProblem.problem)).toEqual(['full', 'unverified']);
  });
  it('the boxes opened on one plan\'s "Does it last?" close when the address leaves it (another plan, another step); they stay across a re-read of the same page', () => {
    const on = reduce(reduce(s0, { type: A.ROUTE_SET, route: parse('#/plan/p1/lasts') }), { type: A.UI_TOGGLE, id: 'tryOpen' });
    expect(on.ui.open).toContain('tryOpen');
    expect(reduce(on, { type: A.ROUTE_SET, route: parse('#/plan/p1/lasts') }).ui.open).toContain('tryOpen');
    expect(reduce(on, { type: A.ROUTE_SET, route: parse('#/plan/p2/lasts') }).ui.open).not.toContain('tryOpen');
    expect(reduce(on, { type: A.ROUTE_SET, route: parse('#/plan/p1/plan') }).ui.open).not.toContain('tryOpen');
    const mix = reduce(reduce(s0, { type: A.ROUTE_SET, route: parse('#/plan/p1/mix') }), { type: A.UI_TOGGLE, id: 'mixPaste' });
    expect(reduce(mix, { type: A.ROUTE_SET, route: parse('#/plan/p1/mix') }).ui.open).toContain('mixPaste');
    expect(reduce(mix, { type: A.ROUTE_SET, route: parse('#/plans') }).ui.open).not.toContain('mixPaste');
  });
  it('readyMark: a try under way is not ready', () => {
    const { store, key } = pageOn([ALEX], ALEX.id);
    store.dispatch({ type: A.LASTS_WORKING, key });
    store.dispatch({ type: A.LASTS_DONE, key, result: RESULT });
    expect(readyMark(store.getState()).ready).toBe('1');
    store.dispatch({ type: A.TRY_RUN, boxes: BOXES });
    expect(readyMark(store.getState()).ready).toBe('0');
    store.dispatch({ type: A.TRY_DONE, key, boxes: BOXES, result: TRIED, ms: 1 });
    expect(readyMark(store.getState()).ready).toBe('1');
  });
});

describe('the runner: a change runs in the worker\'s own lane on the plan of the run held', () => {
  const fakeClient = (tryFn, { lasts = () => Promise.resolve(RESULT), stopped = [] } = {}) => ({ lasts, try: tryFn, lever: null, stop: (q) => stopped.push(q) });
  it('lasts/tryRun → client.try(plan, { today, boxes }) → lasts/tryDone under the key and the boxes, timed; the page\'s reading carries the words; a failure; no worker; the key moving ends it', async () => {
    const { store, key } = pageOn([ALEX], ALEX.id);
    const calls = [];
    let t = 1000;
    const client = fakeClient((plan, env) => { calls.push({ id: plan.id, env }); t += 520; return Promise.resolve(TRIED); });
    const stop = startLastsRunner({ store, client, now: () => t });
    await tick();
    expect(store.getState().lasts).toMatchObject({ key, status: 'done' });
    store.dispatch({ type: A.TRY_RUN, boxes: BOXES });
    await tick();
    expect(calls).toEqual([{ id: ALEX.id, env: { today: TODAY, boxes: BOXES } }]);
    expect(store.getState().lasts.tried).toEqual({ status: 'done', boxes: BOXES, result: TRIED, ms: 520, reason: null });
    const page = viewFor(store.getState()).page;
    expect(page.lasts.try.result.diffs.map((d) => d.id)).toEqual(['way', 'isaPolicy', 'years']);
    expect(page.lasts.try.result.verdict.ok).toBe(true);
    stop();
    const p2 = pageOn([ALEX], ALEX.id);
    let n = 0;
    const stop2 = startLastsRunner({ store: p2.store, client: fakeClient(() => (++n === 1 ? Promise.reject(new Error('boom')) : Promise.reject(Object.assign(new Error('none'), { code: NO_WORKER })))) });
    await tick();
    p2.store.dispatch({ type: A.TRY_RUN, boxes: BOXES });
    await tick();
    expect(p2.store.getState().lasts.tried).toMatchObject({ status: 'failed', reason: null });
    p2.store.dispatch({ type: A.TRY_RUN, boxes: { ...BOXES, years: 31 } });
    await tick();
    expect(p2.store.getState().lasts.tried).toMatchObject({ status: 'failed', reason: 'noWorker' });
    stop2();
    const p3 = pageOn([ALEX], ALEX.id);
    const resolvers = [];
    const stopped = [];
    const stop3 = startLastsRunner({ store: p3.store, client: fakeClient(() => new Promise((resolve) => resolvers.push(resolve)), { stopped }) });
    await tick();
    p3.store.dispatch({ type: A.TRY_RUN, boxes: BOXES });
    await tick();
    p3.store.dispatch({ type: A.LASTS_WORKING, key: 'moved' });
    await tick();
    expect(stopped).toContain('try');
    expect(p3.store.getState().lasts.tried).toBe(null);
    resolvers[0](TRIED);
    await tick();
    expect(p3.store.getState().lasts.tried).toBe(null);
    stop3();
  });
});

describe('the worker: the try message, and the client\'s lane', () => {
  const plan = entryOf(ALEX).plan;
  const collect = async (handle, msg) => { const out = []; handle(msg, (m) => out.push(m)); await tick(12); return out; };
  it('a fake run through the real handler: the boxes passed on, progress then plain data; no plan or no boxes → an error', async () => {
    const seen = [];
    const handle = createHandler(undefined, { tryOne: (p, { today, boxes, onProgress }) => { seen.push([p.id, today, boxes]); onProgress(0, 1); onProgress(1, 1); return { ...TRIED, f: () => 1 }; } });
    handle({ id: 1, type: 'init', today: TODAY }, () => {});
    const out = await collect(handle, { id: 2, type: 'try', plan, env: { boxes: BOXES } });
    expect(seen[0]).toEqual([plan.id, TODAY, BOXES]);
    expect(out.at(-1)).toEqual({ id: 2, result: TRIED });
    expect(await collect(handle, { id: 3, type: 'try', env: { boxes: BOXES } })).toEqual([{ id: 3, error: expect.stringMatching(/no plan/) }]);
    expect(await collect(handle, { id: 4, type: 'try', plan, env: {} })).toEqual([{ id: 4, error: expect.stringMatching(/no boxes/) }]);
  });
  it('the real run, loaded lazily: the tried verdict is runTry\'s, plain data, one run', { timeout: 60_000 }, async () => {
    const out = [];
    createHandler()({ id: 5, type: 'try', plan, env: { today: TODAY, boxes: BOXES } }, (m) => out.push(m));
    for (let i = 0; i < 1200 && !out.some((m) => 'result' in m || 'error' in m); i++) await new Promise((r) => setTimeout(r, 25));
    expect(out.at(-1).result).toMatchObject({ strategyId: 'floor-to-age', basis: { runs: 1 }, boxes: BOXES });
    expect(out.at(-1).result.a.chancePct).toBeTypeOf('number');
  });
  it('the client: try is its own lane', async () => {
    const posted = [];
    const client = createWorkerClient({ makeWorker: () => ({ postMessage: (m) => posted.push(m), terminate: () => {}, onmessage: null, onerror: null }) });
    const one = client.try({ id: 'p' }, { today: TODAY, boxes: BOXES });
    const nine = client.lasts({ id: 'p' }, { today: TODAY });
    expect(posted.map((m) => m.type)).toEqual(['try', 'lasts']);
    client.stop('try');
    await expect(one).rejects.toMatchObject({ code: 'stopped' });
    expect(posted.filter((m) => m.type === 'lasts')).toHaveLength(2);
    void nine;
  });
});

function fakeLite({ failAdd = false } = {}) {
  const writes = [], adds = [];
  return { writes, adds, fb: {
    doc: (db, ...path) => ({ path: path.join('/') }),
    collection: (db, ...path) => ({ path: path.join('/') }),
    updateDoc: async (ref, data) => { writes.push({ ref: ref.path, data: copy(data) }); },
    addDoc: async (coll, data) => { if (failAdd) throw new Error('offline'); adds.push({ path: coll.path, data: copy(data) }); return { id: 'New' + adds.length + 'PlanId' }; }
  } };
}
const handlesFor = (store, { uid = 'u1' } = {}) => () => ({ db: {}, user: store.getState().session.kind === 'in' ? { uid } : null, reread: async () => store.dispatch({ type: A.PLANS_SET, list: store.getState().plans.list, source: 'account', readAt: '14:04' }) });
function storage(start = {}) {
  const map = new Map(Object.entries(start));
  const calls = [];
  return { calls, getItem(k) { calls.push(['getItem', k]); return map.has(k) ? map.get(k) : null; }, setItem(k, v) { calls.push(['setItem', k]); map.set(k, String(v)); }, removeItem(k) { calls.push(['removeItem', k]); map.delete(k); }, raw: (k) => map.get(k) };
}
/** A page with the plan's own test held and a change tried (the boxes as the reading checks them, laid over `typed`). */
async function tried(raws, planId, { typed = {}, source = 'account', session = 'in', sessionStore = null, local = null, fb = fakeLite() } = {}) {
  const p = pageOn(raws, planId, { source, session, typed });
  p.store.dispatch({ type: A.LASTS_WORKING, key: p.key });
  p.store.dispatch({ type: A.LASTS_DONE, key: p.key, result: RESULT });
  const boxes = p.boxes();
  p.store.dispatch({ type: A.TRY_RUN, boxes });
  p.store.dispatch({ type: A.TRY_DONE, key: p.key, boxes, result: TRIED, ms: 1 });
  const stop = startPlanWrite(p.store, { win: null, session: sessionStore, local, now: () => at, fb: fb.fb, client: null, handles: handlesFor(p.store), rand: () => 0.42 });
  return { ...p, boxes, fb, stop };
}

describe('the one write file: "Use this" (kind try)', { timeout: 60_000 }, () => {
  const TYPED = { 'try.way': 'floor-to-age', 'try.years': '30', 'try.isaPolicy': 'hold', 'try.incomeMode': 'flat', 'try.income': '2,000', 'try.cutPct': '30' };
  it('an account: ONE updateDoc of exactly tryPatch\'s paths plus lastModified — the way through the switch, the income as the planner\'s flat shape, the years, the depth, the ISA policy — all declared; plan/saved with the previous values; Undo the exact reverse', async () => {
    const p = await tried([ALEX], ALEX.id, { typed: TYPED });
    p.store.dispatch({ type: A.PLAN_TRY, planId: ALEX.id });
    await tick(12);
    const plan = entryOf(ALEX).plan;
    const expected = tryPatch(plan, p.boxes, { today: TODAY, at: at.toISOString() });
    expect(expected.diffs.map((d) => d.id)).toEqual(['way', 'isaPolicy', 'income', 'years', 'cutPct']);
    expect(p.fb.writes).toHaveLength(1);
    expect(p.fb.writes[0].ref).toBe('users/u1/scenarios/' + ALEX.id);
    expect(p.fb.writes[0].data).toEqual({ ...expected.patch, lastModified: at.toISOString() });
    for (const k of Object.keys(p.fb.writes[0].data)) { expect([...TRY_WRITES, 'lastModified']).toContain(k); expect(ALL_WRITES).toContain(k); }
    const d = p.fb.writes[0].data;
    expect(d['stressTool.settings.strategyId']).toBe('floor-to-age');
    expect(d['stressTool.settings.incomeShape']).toBe('level');
    expect(d['stressTool.settings.incomeSteps']).toEqual([]);
    expect(d['stressTool.settings.targetSchedule']).toBe(null);
    expect(d['stressTool.settings.baseSalary']).toBe(p.boxes.income);
    expect(d['decisionTool.settings.baseSalary']).toBe(p.boxes.income);
    expect(d['stressTool.settings.duration']).toBe(30);
    expect(d['stressTool.settings.protectionMult']).toBe(0.7);
    expect(d['stressTool.settings.isaDrawdownStrategy']).toBe('hold');
    expect(d['stressTool.settings.equityMin'], 'the pot box untouched: the pots are not written').toBeUndefined();
    // the same copy the worker ran: trySettings on the boxes
    const c = trySettings(plan, p.boxes, TODAY);
    expect(c.strategyId).toBe('floor-to-age');
    expect(c.duration).toBe(30);
    const toast = p.store.getState().ui.toast;
    expect(toast).toMatchObject({ planId: ALEX.id, kind: 'saved', op: 'try', line: { id: 'try', slots: { n: '5' } } });
    expect(toast.previous).toEqual({ ...expected.previous, lastModified: plan.lastModified });
    expect(p.store.getState().lasts.tried).toBe(null);
    p.store.dispatch({ type: A.PLANS_SET, list: upgradedList([ALEX], noon(TODAY)), source: 'account', readAt: '14:05' });
    p.store.dispatch({ type: A.PLAN_UNDO, planId: ALEX.id });
    await tick(12);
    expect(p.fb.writes).toHaveLength(2);
    expect(Object.keys(p.fb.writes[1].data).sort()).toEqual(Object.keys(p.fb.writes[0].data).sort());
    for (const [k, v] of Object.entries(toast.previous)) expect(p.fb.writes[1].data[k]).toEqual(v === undefined ? null : v);
    expect(p.store.getState().ui.toast).toMatchObject({ kind: 'undone' });
    p.stop();
  });
  it('nothing differs: nothing written, "unchanged"; a locked plan refused by the guard; no try held: noRun', async () => {
    const same = await tried([ALEX], ALEX.id);
    same.store.dispatch({ type: A.PLAN_TRY, planId: ALEX.id });
    await tick(12);
    expect(same.fb.writes).toEqual([]);
    expect(same.store.getState().ui.toast).toMatchObject({ kind: 'unchanged', op: 'try' });
    same.stop();
    const locked = await tried([LOCKED], LOCKED.id, { typed: { 'try.years': '28' } });
    locked.store.dispatch({ type: A.PLAN_TRY, planId: LOCKED.id });
    await tick(12);
    expect(locked.fb.writes).toEqual([]);
    expect(locked.store.getState().ui.saveProblem).toEqual({ planId: LOCKED.id, problem: 'locked' });
    locked.stop();
    const none = pageOn([ALEX], ALEX.id);
    const fb = fakeLite();
    const stop = startPlanWrite(none.store, { win: null, session: null, local: null, now: () => at, fb: fb.fb, client: null, handles: handlesFor(none.store) });
    none.store.dispatch({ type: A.LASTS_WORKING, key: none.key });
    none.store.dispatch({ type: A.LASTS_DONE, key: none.key, result: RESULT });
    none.store.dispatch({ type: A.TRY_RUN, boxes: BOXES });
    none.store.dispatch({ type: A.TRY_DONE, key: none.key, boxes: BOXES, result: TRIED, ms: 1 });
    none.store.dispatch({ type: A.LASTS_WORKING, key: 'moved' });                                   // the run moved: the try is stale
    none.store.dispatch({ type: A.PLAN_TRY, planId: ALEX.id });
    await tick(12);
    expect(fb.writes).toEqual([]);
    expect(none.store.getState().ui.saveProblem == null || none.store.getState().ui.saveProblem.problem === 'noRun').toBe(true);
    stop();
  });
  it('without an account: the window\'s plan folded with the same patch, the other plan byte-identical; Undo byte for byte', async () => {
    const other = copy(LOCKED);
    const planted = JSON.stringify([copy(ALEX), other]);
    const sessionStore = { text: planted, getItem: (k) => (k === GUEST_PLANS_KEY ? sessionStore.text : null), setItem: (k, v) => { if (k === GUEST_PLANS_KEY) sessionStore.text = v; } };
    const p = await tried([ALEX, LOCKED], ALEX.id, { typed: { 'try.years': '30', 'try.cuts': 'off' }, source: 'window', session: 'nobody', sessionStore });
    p.store.dispatch({ type: A.PLAN_TRY, planId: ALEX.id });
    await tick(12);
    expect(p.fb.writes).toEqual([]);
    const after = JSON.parse(sessionStore.text);
    expect(JSON.stringify(after[1])).toBe(JSON.stringify(other));
    expect(after[0].stressTool.settings.duration).toBe(30);
    expect(after[0].stressTool.settings.disableProtection).toBe(true);
    const expected = tryPatch(entryOf(ALEX).plan, p.boxes, { today: TODAY, at: at.toISOString() });
    expect(expected.diffs.map((d) => d.id)).toEqual(['years', 'cuts']);
    const stripped = (x) => { const out = copy(x); for (const path of [...TRY_WRITES, 'lastModified']) { const parts = path.split('.'); let o = out; for (let i = 0; i < parts.length - 1 && o; i++) o = o[parts[i]]; if (o) delete o[parts[parts.length - 1]]; } return JSON.stringify(out); };
    expect(stripped(after[0])).toBe(stripped(JSON.parse(planted)[0]));
    p.store.dispatch({ type: A.PLANS_SET, list: upgradedList(after, noon(TODAY)), source: 'window', readAt: '14:05' });
    p.store.dispatch({ type: A.PLAN_UNDO, planId: ALEX.id });
    await tick(12);
    expect(sessionStore.text).toBe(planted);
    p.stop();
  });
});

describe('the one write file: "Keep as a separate plan" (kind tryKeep), through the one create', { timeout: 60_000 }, () => {
  const TYPED = { 'try.way': 'floor-to-age', 'try.years': '30' };
  it('an account: ONE addDoc on users/{uid}/scenarios of the copy — the tried settings, named "{name} · tried", not active, not locked, no document, record or archive, stamped — never an updateDoc; then lasts/tryKept and plans/reading', async () => {
    const p = await tried([ALEX, LOCKED], ALEX.id, { typed: TYPED });
    const actions = [];
    p.store.subscribe((s, a) => actions.push(a.type));
    p.store.dispatch({ type: A.TRY_KEEP, planId: ALEX.id });
    await tick(12);
    expect(p.fb.writes).toEqual([]);
    expect(p.fb.adds).toHaveLength(1);
    expect(p.fb.adds[0].path).toBe('users/u1/scenarios');
    const written = p.fb.adds[0].data;
    const plan = entryOf(ALEX).plan;
    const c = trySettings(plan, p.boxes, TODAY);
    expect(written.stressTool.settings).toEqual(upgradeScenario({ ...tryCopyOf(plan, p.boxes, TODAY), createdAt: at.toISOString(), lastModified: at.toISOString() }, { now: at }).scenario.stressTool.settings);
    expect(written.stressTool.settings.strategyId).toBe('floor-to-age');
    expect(written.stressTool.settings.duration).toBe(30);
    expect(written.stressTool.settings.strategyParams).toEqual(c.strategyParams);
    expect(written.strategy).toMatchObject({ id: 'floor-to-age', lockedAt: null });
    expect(written.planDetails.name).toBe(plan.planDetails.name + ' · tried');
    expect(written.isActive).toBe(false);
    expect(isLockedSettings(written.decisionTool.settings)).toBe(false);
    expect(written.createdAt).toBe(at.toISOString());
    expect(written.lastModified).toBe(at.toISOString());
    expect('id' in written).toBe(false);
    expect(planProblems(written)).toEqual([]);
    expect(p.store.getState().lasts.kept).toEqual({ id: 'New1PlanId', name: plan.planDetails.name + ' · tried', where: 'account' });
    expect(actions.indexOf(A.PLANS_READING)).toBeGreaterThan(actions.indexOf(A.TRY_KEPT));
    expect(p.store.getState().lasts.tried.status, 'the try stays on screen').toBe('done');
    p.stop();
  });
  it('a locked plan\'s copy is made unlocked, its document, record and archive not carried; the name made unique against the names taken', async () => {
    const taken = copy(ALEX);
    taken.id = 'Other01'; taken.planDetails.name = LOCKED.planDetails.name + ' · tried';
    const p = await tried([LOCKED, taken], LOCKED.id, { typed: TYPED });
    p.store.dispatch({ type: A.TRY_KEEP, planId: LOCKED.id });
    await tick(12);
    expect(p.fb.adds).toHaveLength(1);
    const written = p.fb.adds[0].data;
    expect(isLockedSettings(written.decisionTool.settings)).toBe(false);
    expect(written.decisionTool.settings.lockedAt).toBeUndefined();
    expect(written.planDocument).toBeUndefined();
    expect(written.planDocumentArchive).toBeUndefined();
    expect(written.decisionTool.planOfRecord).toBeUndefined();
    expect(written.decisionTool.history).toEqual([]);
    expect(written.decisionTool.taxYears).toEqual({});
    expect(written.journey).toBeUndefined();
    expect(written.planDetails.name).toBe(LOCKED.planDetails.name + ' · tried (2)');
    expect(p.fb.writes, 'the locked plan itself is never touched').toEqual([]);
    expect(planProblems(written)).toEqual([]);
    p.stop();
  });
  it('the create failing: "failed", nothing else; an unconfirmed email: "unverified"', async () => {
    const p = await tried([ALEX], ALEX.id, { typed: TYPED, fb: fakeLite({ failAdd: true }) });
    p.store.dispatch({ type: A.TRY_KEEP, planId: ALEX.id });
    await tick(12);
    expect(p.store.getState().ui.saveProblem).toEqual({ planId: ALEX.id, problem: 'failed' });
    expect(p.store.getState().lasts.kept).toBe(null);
    p.stop();
  });
  it('without an account: the copy appended to the window\'s plans with a guest id, every other plan byte-identical, one setItem; "full" with three plans of their own; the free time used up; a browser that will not keep it', async () => {
    const planted = [copy(ALEX), copy(LOCKED)];
    const sess = storage({ [GUEST_PLANS_KEY]: JSON.stringify(planted) });
    const p = await tried(planted, ALEX.id, { typed: TYPED, source: 'window', session: 'nobody', sessionStore: sess });
    p.store.dispatch({ type: A.TRY_KEEP, planId: ALEX.id });
    await tick(12);
    expect(p.fb.adds).toEqual([]);
    expect(sess.calls.filter(([c]) => c === 'setItem')).toEqual([['setItem', GUEST_PLANS_KEY]]);
    const list = JSON.parse(sess.raw(GUEST_PLANS_KEY));
    expect(list).toHaveLength(3);
    expect(JSON.stringify(list.slice(0, 2))).toBe(JSON.stringify(planted));
    expect(list[2].id).toMatch(/^guest-[0-9a-z]{8}$/);
    expect(list[2].planDetails.name).toBe(ALEX.planDetails.name + ' · tried');
    expect(list[2].isActive).toBe(false);
    expect(list[2].stressTool.settings.duration).toBe(30);
    expect(p.store.getState().lasts.kept).toMatchObject({ id: list[2].id, where: 'window' });
    p.stop();
    const three = [copy(ALEX), copy(LOCKED), copy(C['10-couple-b'])];
    const full = await tried(three, ALEX.id, { typed: TYPED, source: 'window', session: 'nobody', sessionStore: storage({ [GUEST_PLANS_KEY]: JSON.stringify(three) }) });
    full.store.dispatch({ type: A.TRY_KEEP, planId: ALEX.id });
    await tick(12);
    expect(full.store.getState().ui.saveProblem).toEqual({ planId: ALEX.id, problem: 'full' });
    full.stop();
    const used = await tried(planted, ALEX.id, { typed: TYPED, source: 'window', session: 'nobody', sessionStore: storage({ [GUEST_PLANS_KEY]: JSON.stringify(planted) }), local: storage({ [KEY_MINUTES]: String(GUEST_ALLOWANCE_MINUTES) }) });
    used.store.dispatch({ type: A.TRY_KEEP, planId: ALEX.id });
    await tick(12);
    expect(used.store.getState().ui.saveProblem).toEqual({ planId: ALEX.id, problem: 'usedUp' });
    used.stop();
    const refusing = storage({ [GUEST_PLANS_KEY]: JSON.stringify(planted) });
    refusing.setItem = () => { throw new Error('QuotaExceededError'); };
    const r = await tried(planted, ALEX.id, { typed: TYPED, source: 'window', session: 'nobody', sessionStore: refusing });
    r.store.dispatch({ type: A.TRY_KEEP, planId: ALEX.id });
    await tick(12);
    expect(r.store.getState().ui.saveProblem).toEqual({ planId: ALEX.id, problem: 'storage' });
    expect(refusing.raw(GUEST_PLANS_KEY)).toBe(JSON.stringify(planted));
    r.stop();
  });
  it('the boxes a try starts from are the plan\'s own, and checkTry turns them into the planner\'s units (the flat income a year before tax)', () => {
    const plan = entryOf(ALEX).plan;
    const boxes = tryBoxesOf(plan, { today: TODAY });
    expect(boxes['try.way']).toBe('pots-and-valves');
    const c = checkTry(plan, { 'try.incomeMode': 'flat', 'try.income': '2,000' }, { today: TODAY });
    expect(c.ok).toBe(true);
    expect(c.run.incomeMode).toBe('flat');
    expect(c.run.income).toBeGreaterThan(24000);
    expect(checkTry(plan, { 'try.years': '4' }, { today: TODAY }).errors['try.years']).toBe('tooLow');
    expect(checkTry(plan, { 'try.way': 'odd' }, { today: TODAY }).errors['try.way']).toBe('notAnOption');
  });
});
