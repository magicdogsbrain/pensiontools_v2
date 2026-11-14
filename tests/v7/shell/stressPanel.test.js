/**
 * The machinery of "Try the bad years" on a plan (7.9.0; the build spec's §2.1, §3): the reducer (the rows filed under the
 * plan's key as they come, done when every row asked for is in, a stale row dropped, a stop keeps the rows so far, failed
 * and noWorker, state/replace, readyMark busy only while working, plan/amend with a row), the runner with a fake client
 * (stress/run → one stressRow lane call per row, in the order asked, each filed as it comes; leaving the page and the plan
 * changing under the run stop it with client.stop('stressRow'); no worker), the worker handler's `stressRow` message and the
 * client's lane, and the one write file: "I accept this risk" on a row is ONE write of `planAmendments` (and the stamp) on an
 * unlocked plan and a locked one, the keep entry carried byte for byte; withdraw takes only its own; a result for the plan as
 * it was is refused ('oldResult'); opening and running write nothing. Fictional plans only.
 */
import { describe, it, expect } from 'vitest';
import { createStore } from '../../../src/v7/effects/store.js';
import { initialState, emptyStressPanel, cleanStressPanel } from '../../../src/v7/state/initial.js';
import { reduce } from '../../../src/v7/state/reduce.js';
import { A, OPENABLE } from '../../../src/v7/state/actions.js';
import { parse } from '../../../src/v7/router/routes.js';
import { readyMark, planStressView } from '../../../src/v7/state/select.js';
import { viewFor, upgradedList } from '../../../src/v7/effects/planSource.js';
import { startStressPanelRunner } from '../../../src/v7/effects/stressPanel.js';
import { startPlanWrite } from '../../../src/v7/effects/planWrite.js';
import { createHandler } from '../../../src/v7/effects/answerWorker.js';
import { createWorkerClient, NO_WORKER } from '../../../src/v7/effects/workerClient.js';
import { stressKeyOf, stressAmendPatch } from '../../../src/answers/plan/stressPanel.js';
import { applyPatch } from '../../../src/answers/plan/about.js';
import { AMEND_WRITES, ALL_WRITES } from '../../../src/answers/plan/schema.js';
import { corpus, TODAY, noon } from '../plan/_plans.js';

const C = corpus();
const tick = async (n = 6) => { for (let i = 0; i < n; i++) await new Promise((r) => setTimeout(r, 0)); };
const copy = (v) => JSON.parse(JSON.stringify(v));
const planted = (raw, id) => ({ ...copy(raw), id, planDetails: { ...(raw.planDetails || {}), name: 'A plan' }, isActive: false, household: undefined });
const KEEP = { at: '2026-09-01T10:00:00.000Z', kind: 'keep', lines: [], expected: [], retest: {}, engineVersion: '6.39.0', othersValue: 0, fingerprint: 'k1', documentAt: null };

/** A made-up row result (runStressRow's shape) for `key`, a future or more failing. */
const rowOf = (key, id, w = 0.8) => ({
  id, key, na: null, runs: 2, ran: { family: true, cutsOn: false }, basis: { today: TODAY, strategyId: 'pots-and-valves' },
  shortfall: { when: { typical: 88, worst: 84, worstLasts: false }, howLong: { paid: 22, of: 31 }, howMuch: 0.9 },
  a: { weighted: w, sumW: 1000, n: 1000, fixedAge: w - 0.05, share: w - 0.05, futures: 1000, planToAge: 97, typicalLeft: 1000, badCaseLeft: 0, goodCaseLeft: 5000, floor: { age: 88, yearly: 100 }, cuts: null, level: 'balanced', verdict: 'no', words: null }
});

/** A store on "Does it last?" of a plan, the plans read, the reading done as the plan source does. */
function pageOn(raws, planId, { step = 'lasts' } = {}) {
  const store = createStore(initialState({ today: TODAY, build: 'test' }), reduce);
  store.dispatch({ type: A.ROUTE_SET, route: parse('#/plan/' + planId + '/' + step) });
  store.dispatch({ type: A.SESSION_SET, session: { kind: 'in', email: 'a@b.c' } });
  const list = upgradedList(raws, noon(TODAY));
  store.dispatch({ type: A.PLANS_SET, list, source: 'account', readAt: '14:03' });
  store.dispatch({ type: A.PLANS_VIEW, view: viewFor(store.getState()) });
  let last = null;
  store.subscribe((state) => {
    const now = [state.stressPanel, state.route, state.plans && state.plans.list];
    if (state.plans && state.plans.status === 'read' && (!last || now.some((v, i) => v !== last[i]))) { last = now; store.dispatch({ type: A.PLANS_VIEW, view: viewFor(state) }); }
  });
  const plan = list.find((e) => String(e.plan.id) === String(planId)).plan;
  return { store, list, plan, key: stressKeyOf(plan, TODAY) };
}
const fakeClient = (fns = {}, stopped = []) => ({ ...fns, stop: (q) => stopped.push(q) });
function fakeFb() {
  const writes = [];
  return { writes, fb: { doc: (db, ...path) => ({ path: path.join('/') }), collection: (db, ...path) => ({ path: path.join('/') }), updateDoc: async (ref, data) => { writes.push({ ref: ref.path, data: copy(data) }); }, addDoc: async () => ({ id: 'NewPlanId' }) } };
}
const at = new Date('2026-10-02T14:03:00.000Z');
const handlesFor = (store, uid = 'u1') => () => ({ db: {}, user: { uid }, reread: async () => store.dispatch({ type: A.PLANS_SET, list: store.getState().plans.list, source: 'account', readAt: '14:04' }) });
const started = (p, f) => startPlanWrite(p.store, { win: null, session: null, local: null, now: () => at, fb: f.fb, client: null, handles: handlesFor(p.store), rand: () => 0.42 });

describe('the reducer: the rows in page memory', () => {
  const s0 = initialState({ today: TODAY, build: 'test' });
  it('starts empty; rows filed as they come, done when every row asked for is in; another key\'s dropped; a stop keeps the rows; failed; noWorker', () => {
    expect(s0.stressPanel).toEqual(emptyStressPanel());
    let s = reduce(s0, { type: A.STRESS_RUN, key: 'k1', planId: 'p1', rows: ['asPlanned', 'fall'] });
    expect(s.stressPanel).toEqual({ key: 'k1', planId: 'p1', status: 'working', order: ['asPlanned', 'fall'], rows: {}, reason: null });
    expect(readyMark(s).ready, 'rows under way are not ready').toBe('0');
    expect(reduce(s, { type: A.STRESS_RUN, key: 'k1', planId: 'p1', rows: ['asPlanned'] })).toBe(s);
    expect(reduce(s, { type: A.STRESS_ROW_DONE, key: 'k2', row: 'asPlanned', result: rowOf('k2', 'asPlanned') })).toBe(s);
    expect(reduce(s, { type: A.STRESS_ROW_DONE, key: 'k1', row: 'lower', result: rowOf('k1', 'lower') }), 'a row not asked for').toBe(s);
    expect(() => reduce(s, { type: A.STRESS_ROW_DONE, key: 'k1', row: 'fall', result: null })).toThrow(/needs a result/);
    s = reduce(s, { type: A.STRESS_ROW_DONE, key: 'k1', row: 'asPlanned', result: rowOf('k1', 'asPlanned') });
    expect(s.stressPanel.status).toBe('working');
    const stoppedState = reduce(s, { type: A.STRESS_FAILED, key: 'k1', reason: 'stopped' });
    expect(stoppedState.stressPanel).toMatchObject({ status: 'idle', rows: { asPlanned: rowOf('k1', 'asPlanned') } });
    s = reduce(s, { type: A.STRESS_ROW_DONE, key: 'k1', row: 'fall', result: rowOf('k1', 'fall') });
    expect(s.stressPanel.status).toBe('done');
    expect(readyMark(s).ready).toBe('1');
    expect(reduce(s, { type: A.STRESS_FAILED, key: 'k1' }), 'done is not working').toBe(s);
    const f = reduce(reduce(s0, { type: A.STRESS_RUN, key: 'k1', planId: 'p1', rows: ['asPlanned'] }), { type: A.STRESS_FAILED, key: 'k1', reason: 'noWorker' });
    expect(f.stressPanel).toMatchObject({ status: 'failed', reason: 'noWorker' });
    expect(() => reduce(s0, { type: A.STRESS_RUN, key: 'k1', planId: 'p1', rows: [] })).toThrow(/needs the rows/);
    expect(() => reduce(s0, { type: A.STRESS_RUN, planId: 'p1', rows: ['fall'] })).toThrow(/needs a key/);
    expect(cleanStressPanel({ key: 'k', planId: 'p', status: 'done', order: ['fall', 3], rows: { fall: { a: 1 }, x: 2 }, reason: 'x' })).toEqual({ key: 'k', planId: 'p', status: 'done', order: ['fall'], rows: { fall: { a: 1 } }, reason: null });
    expect(cleanStressPanel(null)).toEqual(emptyStressPanel());
    expect(reduce(s0, { type: A.STATE_REPLACE, state: { ...copy(s), stressPanel: undefined } }).stressPanel).toEqual(emptyStressPanel());
  });
  it('plan/amend with a row: its kind and row ride on the write; a kind it does not write is refused; the confirm closes', () => {
    for (const id of ['asPlanned', 'fall', 'lower', 'spend', 'prices']) expect(OPENABLE).toContain('stressConfirm.' + id);
    let s = reduce(s0, { type: A.UI_TOGGLE, id: 'stressConfirm.fall' });
    s = reduce(s, { type: A.PLAN_AMEND, planId: 'p1', op: 'accept', kind: 'stress', testId: 'fall' });
    expect(s.ui.saving).toEqual({ planId: 'p1', kind: 'amend', op: 'accept', amend: 'stress', testId: 'fall' });
    expect(s.ui.open).toEqual([]);
    expect(reduce(s0, { type: A.PLAN_AMEND, planId: 'p1', op: 'accept' }).ui.saving, 'the keep agreement as in 7.7.0').toEqual({ planId: 'p1', kind: 'amend', op: 'accept' });
    expect(() => reduce(s0, { type: A.PLAN_AMEND, planId: 'p1', op: 'accept', kind: 'keep', testId: 'fall' })).toThrow(/is not a kind it writes/);
    expect(() => reduce(s0, { type: A.PLAN_AMEND, planId: 'p1', op: 'accept', kind: 'stress' })).toThrow(/needs the row/);
  });
});

describe('the runner: one lane call per row, in the order asked, each filed as it comes', () => {
  it('stress/run → client.stressRow(plan, { today, row }) per row → stress/rowDone each; done; nothing written', async () => {
    const p = pageOn([planted(C['02-pnv-draft'], 'S1')], 'S1');
    const calls = [];
    const client = fakeClient({ stressRow: (plan, env) => { calls.push([plan.id, env]); return Promise.resolve(rowOf(p.key, env.row)); } });
    const stop = startStressPanelRunner({ store: p.store, client });
    const order = p.store.getState().plans.view.page.lasts.stressPanel.order;
    expect(order[0]).toBe('asPlanned');
    p.store.dispatch({ type: A.STRESS_RUN, key: p.key, planId: 'S1', rows: order });
    await tick(20);
    expect(calls).toEqual(order.map((row) => ['S1', { today: TODAY, row }]));
    expect(p.store.getState().stressPanel.status).toBe('done');
    expect(Object.keys(p.store.getState().stressPanel.rows)).toEqual(order);
    const v = planStressView(p.store.getState());
    expect(v.run).toMatchObject({ status: 'done', done: order.length, total: order.length });
    expect(v.rows.find((r) => r.id === 'fall').status).toBe('done');
    stop();
  });
  it('leaving the page stops it (client.stop("stressRow")): the rows so far kept, the late answer dropped', async () => {
    const p = pageOn([planted(C['02-pnv-draft'], 'S1')], 'S1');
    const resolvers = [];
    const stopped = [];
    const stop = startStressPanelRunner({ store: p.store, client: fakeClient({ stressRow: (plan, env) => new Promise((resolve) => resolvers.push(() => resolve(rowOf(p.key, env.row)))) }, stopped) });
    p.store.dispatch({ type: A.STRESS_RUN, key: p.key, planId: 'S1', rows: ['asPlanned', 'fall', 'lower'] });
    await tick();
    resolvers[0]();
    await tick();
    expect(p.store.getState().stressPanel.rows.asPlanned).toBeTruthy();
    p.store.dispatch({ type: A.ROUTE_SET, route: parse('#/plan/S1') });
    await tick();
    expect(stopped).toContain('stressRow');
    expect(p.store.getState().stressPanel).toMatchObject({ status: 'idle', key: p.key });
    resolvers[1]();
    await tick();
    expect(p.store.getState().stressPanel.rows.fall, 'the late answer is dropped').toBeUndefined();
    expect(Object.keys(p.store.getState().stressPanel.rows)).toEqual(['asPlanned']);
    stop();
  });
  it('the plan changing under the run (its key moving) stops it; no worker → noWorker', async () => {
    const p = pageOn([planted(C['02-pnv-draft'], 'S1')], 'S1');
    const stopped = [];
    const stop = startStressPanelRunner({ store: p.store, client: fakeClient({ stressRow: () => new Promise(() => {}) }, stopped) });
    p.store.dispatch({ type: A.STRESS_RUN, key: p.key, planId: 'S1', rows: ['asPlanned', 'fall'] });
    await tick();
    const changed = applyPatch(p.plan, { 'stressTool.settings.statePension': 9000 });
    p.store.dispatch({ type: A.PLANS_SET, list: [{ plan: changed, newer: false, failed: false }], source: 'account', readAt: '14:05' });
    await tick();
    expect(stopped).toContain('stressRow');
    expect(p.store.getState().stressPanel.status).toBe('idle');
    expect(planStressView(p.store.getState()).key).not.toBe(p.key);
    stop();
    const p2 = pageOn([planted(C['02-pnv-draft'], 'S1')], 'S1');
    const stop2 = startStressPanelRunner({ store: p2.store, client: fakeClient({ stressRow: () => Promise.reject(Object.assign(new Error('none'), { code: NO_WORKER })) }) });
    p2.store.dispatch({ type: A.STRESS_RUN, key: p2.key, planId: 'S1', rows: ['asPlanned'] });
    await tick();
    expect(p2.store.getState().stressPanel).toMatchObject({ status: 'failed', reason: 'noWorker' });
    stop2();
  });
});

describe('the worker: the stressRow message, and the client\'s lane', () => {
  const plan = upgradedList([planted(C['02-pnv-draft'], 'S1')], noon(TODAY))[0].plan;
  const collect = async (handle, msg) => { const out = []; handle(msg, (m) => out.push(m)); await tick(12); return out; };
  it('a fake row through the real handler: the date from init and the row; plain data; no plan or no row → an error', async () => {
    const seen = [];
    const handle = createHandler(undefined, { stressRow: (p, { today, row, onProgress }) => { seen.push([p.id, today, row]); onProgress(1, 1); return { id: row, f: () => 1 }; } });
    handle({ id: 1, type: 'init', today: TODAY }, () => {});
    const out = await collect(handle, { id: 2, type: 'stressRow', plan, env: { row: 'fall' } });
    expect(seen).toEqual([['S1', TODAY, 'fall']]);
    expect(out.at(-1)).toEqual({ id: 2, result: { id: 'fall' } });
    expect(await collect(handle, { id: 3, type: 'stressRow', env: { row: 'fall' } })).toEqual([{ id: 3, error: expect.stringMatching(/no plan/) }]);
    expect(await collect(handle, { id: 4, type: 'stressRow', plan, env: {} })).toEqual([{ id: 4, error: expect.stringMatching(/no row/) }]);
  });
  it('the client sends the plan as data on its own lane; stop("stressRow") ends it and nothing else; no worker → NO_WORKER', async () => {
    const posted = [];
    let w;
    const makeWorker = () => { w = { postMessage: (m) => posted.push(m), terminate: () => {}, onmessage: null, onerror: null }; return w; };
    const client = createWorkerClient({ makeWorker });
    const row = client.stressRow({ id: 'p' }, { today: TODAY, row: 'fall' });
    const other = client.lasts({ id: 'p' }, { today: TODAY });
    expect(posted.map((m) => m.type)).toEqual(['stressRow', 'lasts']);
    expect(posted[0].env).toEqual({ today: TODAY, row: 'fall' });
    client.stop('stressRow');
    await expect(row).rejects.toMatchObject({ code: 'stopped' });
    expect(posted.filter((m) => m.type === 'lasts')).toHaveLength(2);
    w.onmessage({ data: { id: posted.at(-1).id, result: { ok: 1 } } });
    await expect(other).resolves.toEqual({ ok: 1 });
    const none = createWorkerClient({ makeWorker: () => null });
    await expect(none.stressRow({ id: 'p' }, { today: TODAY, row: 'fall' })).rejects.toMatchObject({ code: NO_WORKER });
  });
});

describe('the one write file: "I accept this risk" on a row (7.9.0)', { timeout: 60_000 }, () => {
  it('an unlocked plan: ONE write of planAmendments and the stamp, equal to stressAmendPatch; the toast; Undo; withdraw takes only its own; nothing on opening or running', async () => {
    const raw = planted(C['02-pnv-draft'], 'U1');
    raw.planAmendments = [KEEP];
    const p = pageOn([raw], 'U1');
    const f = fakeFb();
    const stop = started(p, f);
    expect(f.writes, 'opening writes nothing').toEqual([]);
    p.store.dispatch({ type: A.STRESS_RUN, key: p.key, planId: 'U1', rows: ['asPlanned', 'fall'] });
    p.store.dispatch({ type: A.STRESS_ROW_DONE, key: p.key, row: 'asPlanned', result: rowOf(p.key, 'asPlanned', 0.9) });
    p.store.dispatch({ type: A.STRESS_ROW_DONE, key: p.key, row: 'fall', result: rowOf(p.key, 'fall', 0.7) });
    await tick(4);
    expect(f.writes, 'running writes nothing').toEqual([]);
    p.store.dispatch({ type: A.PLAN_AMEND, planId: 'U1', op: 'accept', kind: 'stress', testId: 'fall' });
    await tick(12);
    expect(f.writes).toHaveLength(1);
    expect(f.writes[0].ref).toBe('users/u1/scenarios/U1');
    const expected = stressAmendPatch(p.plan, { id: 'fall', result: rowOf(p.key, 'fall', 0.7), same: false }, { at: at.toISOString(), today: TODAY });
    expect(f.writes[0].data).toEqual({ ...expected.patch, lastModified: at.toISOString() });
    expect(Object.keys(f.writes[0].data).sort()).toEqual([...AMEND_WRITES].sort());
    for (const k of Object.keys(f.writes[0].data)) expect(ALL_WRITES).toContain(k);
    expect(f.writes[0].data.planAmendments[0], 'the keep entry carried byte for byte').toEqual(KEEP);
    expect(f.writes[0].data.planAmendments[1]).toMatchObject({ kind: 'stress', test: { id: 'fall' }, result: { chance: 0.7, planToAge: 97 } });
    expect(p.store.getState().ui.toast).toMatchObject({ kind: 'saved', op: 'amend', line: { id: 'stressAgreed', slots: { date: '2 October 2026' } } });
    // Undo: the list the plan had, byte for byte
    p.store.dispatch({ type: A.PLAN_UNDO, planId: 'U1' });
    await tick(12);
    expect(f.writes).toHaveLength(2);
    expect(f.writes[1].data).toEqual({ planAmendments: [KEEP], lastModified: raw.lastModified });
    // read again: the rows stay (accepting does not move the key); the row says it is accepted
    const accepted = applyPatch(p.plan, f.writes[0].data);
    p.store.dispatch({ type: A.PLANS_SET, list: [{ plan: accepted, newer: false, failed: false }], source: 'account', readAt: '14:05' });
    expect(stressKeyOf(accepted, TODAY)).toBe(p.key);
    const v = planStressView(p.store.getState());
    expect(v.rows.find((r) => r.id === 'fall').agreement.status).toBe('agreed');
    expect(v.rows.find((r) => r.id === 'fall').status).toBe('done');
    // withdraw: the list without it; the keep entry untouched
    p.store.dispatch({ type: A.PLAN_TOAST_CLOSE });
    p.store.dispatch({ type: A.PLAN_AMEND, planId: 'U1', op: 'withdraw', kind: 'stress', testId: 'fall' });
    await tick(12);
    expect(f.writes).toHaveLength(3);
    expect(f.writes[2].data).toEqual({ planAmendments: [KEEP], lastModified: at.toISOString() });
    expect(p.store.getState().ui.toast).toMatchObject({ kind: 'saved', op: 'amend', line: { id: 'stressWithdrawn' } });
    for (const w of f.writes) for (const k of Object.keys(w.data)) expect(k.startsWith('stressTool') || k.startsWith('decisionTool') || k.startsWith('planDocument') || k.startsWith('holdings')).toBe(false);
    stop();
  });
  it('a result for the plan as it was is refused ("oldResult"); a row with none ("noResult"); a row that changes nothing ("same")', async () => {
    const p = pageOn([planted(C['02-pnv-draft'], 'U2')], 'U2');
    const f = fakeFb();
    const stop = started(p, f);
    p.store.dispatch({ type: A.PLAN_AMEND, planId: 'U2', op: 'accept', kind: 'stress', testId: 'fall' });
    await tick(12);
    expect(p.store.getState().ui.saveProblem).toEqual({ planId: 'U2', problem: 'noResult' });
    const old = 'U2|2026-10-01|x';
    p.store.dispatch({ type: A.STRESS_RUN, key: p.key, planId: 'U2', rows: ['asPlanned', 'fall'] });
    p.store.dispatch({ type: A.STRESS_ROW_DONE, key: p.key, row: 'asPlanned', result: rowOf(p.key, 'asPlanned', 0.8) });
    p.store.dispatch({ type: A.STRESS_ROW_DONE, key: p.key, row: 'fall', result: { ...rowOf(p.key, 'fall', 0.8) } });
    p.store.dispatch({ type: A.PLAN_AMEND, planId: 'U2', op: 'accept', kind: 'stress', testId: 'fall' });
    await tick(12);
    expect(p.store.getState().ui.saveProblem).toEqual({ planId: 'U2', problem: 'same' });
    p.store.dispatch({ type: A.STRESS_RUN, key: p.key, planId: 'U2', rows: ['fall'] });
    p.store.dispatch({ type: A.STRESS_ROW_DONE, key: p.key, row: 'fall', result: { ...rowOf(p.key, 'fall', 0.7), key: old } });
    p.store.dispatch({ type: A.PLAN_AMEND, planId: 'U2', op: 'accept', kind: 'stress', testId: 'fall' });
    await tick(12);
    expect(p.store.getState().ui.saveProblem).toEqual({ planId: 'U2', problem: 'oldResult' });
    expect(f.writes).toEqual([]);
    stop();
  });
  it('a locked plan: the same one write, past the guard; settings and document never touched', async () => {
    const raw = planted(C['04-buckets-running'], 'L1');
    const p = pageOn([raw], 'L1');
    const f = fakeFb();
    const stop = started(p, f);
    p.store.dispatch({ type: A.STRESS_RUN, key: p.key, planId: 'L1', rows: ['asPlanned', 'lower'] });
    p.store.dispatch({ type: A.STRESS_ROW_DONE, key: p.key, row: 'asPlanned', result: rowOf(p.key, 'asPlanned', 0.9) });
    p.store.dispatch({ type: A.STRESS_ROW_DONE, key: p.key, row: 'lower', result: rowOf(p.key, 'lower', 0.75) });
    p.store.dispatch({ type: A.PLAN_AMEND, planId: 'L1', op: 'accept', kind: 'stress', testId: 'lower' });
    await tick(12);
    expect(f.writes).toHaveLength(1);
    expect(Object.keys(f.writes[0].data).sort()).toEqual(['lastModified', 'planAmendments']);
    expect(f.writes[0].data.planAmendments).toHaveLength(1);
    stop();
  });
});
