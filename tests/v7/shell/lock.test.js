/**
 * The machinery of "Lock the plan" (research/v7/road-to-7.md step 6): the reducer (the three actions set the write under
 * way and close the confirm; a lock's toast keeps its moment; Undo carries it; the problems it knows), the selectors
 * (planActionsView, planLockView), the worker handler's `document` message through the real handler (a fake run, then the
 * real lazily-loaded one: progress then a plain run with the trimmed plan and result), and the client's lane.
 */
import { describe, it, expect } from 'vitest';
import { initialState } from '../../../src/v7/state/initial.js';
import { reduce } from '../../../src/v7/state/reduce.js';
import { A, OPENABLE } from '../../../src/v7/state/actions.js';
import { parse } from '../../../src/v7/router/routes.js';
import { planActionsView, planLockView } from '../../../src/v7/state/select.js';
import { createHandler } from '../../../src/v7/effects/answerWorker.js';
import { createWorkerClient, NO_WORKER } from '../../../src/v7/effects/workerClient.js';
import { corpus, entryOf, entriesAt, stateWith, TODAY } from '../plan/_plans.js';

const C = corpus();
const LUMPY = C['12-lumpy-db-gia'];
const tick = async (n = 6) => { for (let i = 0; i < n; i++) await new Promise((r) => setTimeout(r, 0)); };

describe('the reducer', () => {
  const s0 = initialState({ today: TODAY, build: 'test' });
  it('plan/lock, plan/unlock and plan/newVersion set the write under way for the plan and close the confirm; nothing while another write is under way', () => {
    let s = reduce(s0, { type: A.UI_TOGGLE, id: 'lockConfirm' });
    expect(s.ui.open).toContain('lockConfirm');
    s = reduce(s, { type: A.PLAN_LOCK, planId: 'p1' });
    expect(s.ui.saving).toEqual({ planId: 'p1', kind: 'lock' });
    expect(s.ui.open).not.toContain('lockConfirm');
    expect(reduce(s, { type: A.PLAN_UNLOCK, planId: 'p1' })).toBe(s);
    expect(reduce(s0, { type: A.PLAN_UNLOCK, planId: 'p2' }).ui.saving).toEqual({ planId: 'p2', kind: 'unlock' });
    expect(reduce(s0, { type: A.PLAN_DOCUMENT, planId: 'p2' }).ui.saving).toEqual({ planId: 'p2', kind: 'document' });
    expect(() => reduce(s0, { type: A.PLAN_LOCK })).toThrow(/needs a plan id/);
    for (const id of ['lockConfirm', 'unlockConfirm', 'documentConfirm']) expect(OPENABLE).toContain(id);
  });
  it('a lock\'s toast keeps its op and moment; Undo carries them; undone keeps the op; an editing step\'s toast is as before', () => {
    const lock = reduce(reduce(s0, { type: A.PLAN_LOCK, planId: 'p1' }), { type: A.PLAN_SAVED, planId: 'p1', previous: { 'decisionTool.settings.locked': false }, line: { id: 'locked', slots: { date: '2 October 2026' } }, op: 'lock', lockedAt: '2026-10-02T14:03:00.000Z' });
    expect(lock.ui.toast).toEqual({ planId: 'p1', kind: 'saved', previous: { 'decisionTool.settings.locked': false }, line: { id: 'locked', slots: { date: '2 October 2026' } }, op: 'lock', lockedAt: '2026-10-02T14:03:00.000Z' });
    const undoing = reduce(lock, { type: A.PLAN_UNDO, planId: 'p1' });
    expect(undoing.ui.saving).toEqual({ planId: 'p1', kind: 'undo', previous: { 'decisionTool.settings.locked': false }, op: 'lock', lockedAt: '2026-10-02T14:03:00.000Z' });
    const done = reduce(undoing, { type: A.PLAN_UNDO_DONE, planId: 'p1' });
    expect(done.ui.toast).toEqual({ planId: 'p1', kind: 'undone', previous: null, line: null, op: 'lock' });
    const unlock = reduce(s0, { type: A.PLAN_SAVED, planId: 'p1', previous: { planDocument: null }, line: { id: 'unlocked', slots: {} }, op: 'unlock', lockedAt: 'ignored' });
    expect(unlock.ui.toast).toEqual({ planId: 'p1', kind: 'saved', previous: { planDocument: null }, line: { id: 'unlocked', slots: {} }, op: 'unlock' });
    const plain = reduce(s0, { type: A.PLAN_SAVED, planId: 'p1', previous: { 'stressTool.settings.duration': 32 }, line: null });
    expect(plain.ui.toast).toEqual({ planId: 'p1', kind: 'saved', previous: { 'stressTool.settings.duration': 32 }, line: null });
    expect(() => reduce(s0, { type: A.PLAN_SAVED, planId: 'p1', previous: {}, op: 'other' })).toThrow(/not a write it knows/);
    // the new problems
    for (const problem of ['notLocked', 'noWorker', 'noRun']) expect(reduce(s0, { type: A.PLAN_SAVE_FAILED, planId: 'p1', problem }).ui.saveProblem).toEqual({ planId: 'p1', problem });
    // the toast of a lock survives the move to "Your plan as locked" (the same plan) and goes with another plan's address
    const moved = reduce(lock, { type: A.ROUTE_SET, route: parse('#/plan/p1/plan') });
    expect(moved.ui.toast).toEqual(lock.ui.toast);
    expect(reduce(lock, { type: A.ROUTE_SET, route: parse('#/plan/p2/plan') }).ui.toast).toBe(null);
  });
  it('the state survives JSON with a lock under way and after', () => {
    const s = reduce(reduce(s0, { type: A.PLAN_LOCK, planId: 'p1' }), { type: A.PLAN_SAVED, planId: 'p1', previous: { planDocument: undefined }, line: null, op: 'lock', lockedAt: '2026-10-02T14:03:00.000Z' });
    expect(JSON.parse(JSON.stringify(s)).ui.toast).toMatchObject({ op: 'lock', lockedAt: '2026-10-02T14:03:00.000Z' });
  });
});

describe('the selectors', () => {
  it('planActionsView: the write, the problem, the toast and the open confirm for the route\'s plan only', () => {
    const entries = entriesAt(TODAY);
    let s = stateWith(entries, '#/plan/' + LUMPY.id + '/lock', { open: ['lockConfirm'] });
    expect(planActionsView(s)).toEqual({ id: LUMPY.id, saving: null, problem: null, toast: null, confirm: 'lock' });
    s = reduce(s, { type: A.PLAN_LOCK, planId: LUMPY.id });
    expect(planActionsView(s)).toMatchObject({ saving: { planId: LUMPY.id, kind: 'lock' }, confirm: null });
    const other = { ...s, ui: { ...s.ui, saving: { planId: 'other', kind: 'lock' }, saveProblem: { planId: 'other', problem: 'failed' } } };
    expect(planActionsView(other)).toMatchObject({ saving: null, problem: null });
    const v = planLockView(s);
    expect(v.found).toBe(true);
    expect(v.lock).toMatchObject({ id: 'lock', locked: false });
    expect(v.saving).toEqual({ planId: LUMPY.id, kind: 'lock' });
    expect(planLockView(reduce(s, { type: A.ROUTE_SET, route: parse('#/plans') })).found).toBe(false);
  });
});

describe('the worker: the `document` message, and the client\'s lane', () => {
  const plan = entryOf(LUMPY).plan;
  const collect = async (handle, msg) => { const out = []; handle(msg, (m) => out.push(m)); await tick(12); return out; };
  it('a fake run through the real handler: the date from init, the essentials from the message, progress then the run as plain data; a throw → error; no plan → error', async () => {
    const seen = [];
    const fake = (p, { today, essentials, onProgress }) => { seen.push([p.id, today, essentials]); onProgress(0, 2); onProgress(1, 2); return { p: { a: 1 }, r: { b: 2 }, f: () => 1 }; };
    const handle = createHandler(undefined, { document: fake });
    handle({ id: 1, type: 'init', today: '2026-10-02' }, () => {});
    const out = await collect(handle, { id: 2, type: 'document', plan, env: { essentials: 18000 } });
    expect(seen).toEqual([[LUMPY.id, '2026-10-02', 18000]]);
    expect(out).toEqual([{ id: 2, progress: { done: 0, total: 2 } }, { id: 2, progress: { done: 1, total: 2 } }, { id: 2, result: { p: { a: 1 }, r: { b: 2 } } }]);
    const bad = await collect(createHandler(undefined, { document: () => { throw new Error('boom'); } }), { id: 3, type: 'document', plan, env: { today: TODAY } });
    expect(bad).toEqual([{ id: 3, error: 'boom' }]);
    expect(await collect(createHandler(), { id: 4, type: 'document', env: {} })).toEqual([{ id: 4, error: expect.stringMatching(/no plan/) }]);
  });
  it('the real run, loaded lazily by the handler: progress then a plain run with the trimmed plan and result (no samples, no functions)', async () => {
    const out = [];
    const handle = createHandler();
    handle({ id: 5, type: 'document', plan, env: { today: TODAY } }, (m) => out.push(m));
    for (let i = 0; i < 200 && !out.some((m) => 'result' in m || 'error' in m); i++) await new Promise((r) => setTimeout(r, 25));
    const last = out[out.length - 1];
    expect(out.slice(0, -1).map((m) => m.progress)).toEqual([{ done: 0, total: 2 }, { done: 1, total: 2 }]);
    expect(last.result).toBeTruthy();
    expect(last.result.p.durationYears).toBeGreaterThan(0);
    expect(last.result.p.pnvCfg).toBeUndefined();
    expect(last.result.r.strategyId).toBe('pots-and-valves');
    expect(last.result.r.samples).toBeUndefined();
    expect(last.result.r.histWindows).toBeUndefined();
    expect(() => structuredClone(last.result)).not.toThrow();
  }, 30000);
  it('the client sends the plan as data on its own lane; stop("document") ends it and nothing else; no worker → NO_WORKER', async () => {
    const received = [];
    const handle = (msg, post) => { received.push(msg); if (msg.type === 'init') post({ id: msg.id, ready: true }); };
    const made = [];
    const makeWorker = () => { const w = { onmessage: null, onerror: null, terminated: false, postMessage(m) { const copy = JSON.parse(JSON.stringify(m)); received.push(copy); queueMicrotask(() => { if (!w.terminated) handle(copy, (r) => w.onmessage && w.onmessage({ data: r })); }); }, terminate() { w.terminated = true; } }; made.push(w); return w; };
    const client = createWorkerClient({ makeWorker });
    await client.init(TODAY);
    const p = client.document({ ...plan, f: () => 1 }, { today: TODAY, essentials: 0 }, () => {});
    const sent = received.find((m) => m.type === 'document');
    expect(sent.plan.id).toBe(LUMPY.id);
    expect('f' in sent.plan).toBe(false);
    expect(sent.env).toEqual({ today: TODAY, essentials: 0 });
    client.stop('lasts');
    expect(made[0].terminated).toBe(false);
    client.stop('document');
    await expect(p).rejects.toMatchObject({ code: 'stopped' });
    expect(made[0].terminated).toBe(true);
    const none = createWorkerClient({ makeWorker: () => null });
    await expect(none.document(plan, { today: TODAY })).rejects.toMatchObject({ code: NO_WORKER });
  });
});
