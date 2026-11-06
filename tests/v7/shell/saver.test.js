/**
 * "What you pay in": the plan's verdict, run (research/saving-enough-and-check-in.md 4.4; release step R2). The worker's
 * 'saver' message is question B's own answer on the inputs it is given, in a lane of its own and never kept as B's last
 * answer; the runner, on the saving step, asks it at 100 futures then 1,000 for the key the page's reading names, files the
 * figures under that key, drops a stale one, says 'noWorker' plainly, and is not ready until the final figure; the
 * reducer keeps an older figure while the same plan is asked again. Nothing is written. Fictional plans only.
 */
import { describe, it, expect } from 'vitest';
import { createStore } from '../../../src/v7/effects/store.js';
import { initialState, emptySaver, cleanSaver } from '../../../src/v7/state/initial.js';
import { reduce } from '../../../src/v7/state/reduce.js';
import { A } from '../../../src/v7/state/actions.js';
import { parse } from '../../../src/v7/router/routes.js';
import { readyMark, planSavingView } from '../../../src/v7/state/select.js';
import { viewFor, upgradedList } from '../../../src/v7/effects/planSource.js';
import { startSaverRunner } from '../../../src/v7/effects/saver.js';
import { createHandler } from '../../../src/v7/effects/answerWorker.js';
import { NO_WORKER } from '../../../src/v7/effects/workerClient.js';
import { ANSWERS } from '../../../src/answers/index.js';
import { corpus, TODAY, noon } from '../plan/_plans.js';

const C = corpus();
const tick = async (n = 6) => { for (let i = 0; i < n; i++) await new Promise((r) => setTimeout(r, 0)); };
const copy = (v) => JSON.parse(JSON.stringify(v));
const RESULT = (futures) => ({ status: 'ok', verdict: { band: 'close' }, basis: { futures }, sentences: {} });

/** A store on the saving step of the corpus saver, the reading done as the plan source does. */
function pageOn(raw, planId) {
  const store = createStore(initialState({ today: TODAY, build: 'test' }), reduce);
  store.dispatch({ type: A.ROUTE_SET, route: parse('#/plan/' + planId + '/saving') });
  store.dispatch({ type: A.SESSION_SET, session: { kind: 'in', email: 'a@b.c' } });
  const list = upgradedList([{ ...copy(raw), id: planId }], noon(TODAY));
  store.dispatch({ type: A.PLANS_SET, list, source: 'account', readAt: '14:03' });
  store.dispatch({ type: A.PLANS_VIEW, view: viewFor(store.getState()) });
  return { store, verdict: store.getState().plans.view.page.saving.verdict };
}
function fakeClient(saver) {
  const stops = [];
  return { stops, saver, stop: (q) => stops.push(q) };
}

describe('the worker\'s "saver" message: B\'s own answer, in its own lane', () => {
  it('answers with question B on the inputs given, once; never kept as B\'s last answer', () => {
    const inputs = { household: 'single', you: { pot: 62000, age: 41, payIn: { kind: 'total', total: 500 } }, stop: { age: 63 }, spend: { kind: 'amount', amount: 1810 } };
    const env = { today: '2026-11-04', futures: 100, seed: 0, trace: false, detail: 'answer' };
    const out = [];
    const handle = createHandler();
    handle({ id: 7, type: 'saver', inputs, env }, (m) => out.push(m));
    const last = out[out.length - 1];
    expect(last.id).toBe(7);
    expect(last.result).toEqual(JSON.parse(JSON.stringify(ANSWERS.b.answer(inputs, env))));
    expect(out.filter((m) => 'result' in m).length).toBe(1);
    // a following question B is not offered the plan's verdict as its `reuse`
    let seen = null;
    const spy = createHandler({ ...ANSWERS, b: { ...ANSWERS.b, answer: (i, e) => { seen = e; return { status: 'ok' }; } } });
    spy({ id: 8, type: 'saver', inputs, env }, () => {});
    spy({ id: 9, type: 'answer', q: 'b', inputs, env }, () => {});
    expect('reuse' in seen).toBe(false);
    const bad = [];
    createHandler()({ id: 10, type: 'saver', env }, (m) => bad.push(m));
    expect(bad[0].error).toMatch(/no inputs/);
  });
});

describe('the runner on "What you pay in"', () => {
  it('asks at 100 futures then 1,000 for the key the reading names, with the plan\'s own mixes; ready only at the final figure; nothing written', async () => {
    const { store, verdict } = pageOn(C['05-saver-committed'], 'SamSaver01');
    expect(verdict.ok).toBe(true);
    expect(readyMark(store.getState()).ready).toBe('0');   // due before the runner starts
    const calls = [];
    const client = fakeClient((inputs, env) => { calls.push({ inputs, env }); return Promise.resolve(RESULT(env.futures)); });
    const stop = startSaverRunner({ store, client });
    await tick();
    expect(calls.map((c) => c.env.futures)).toEqual([100, 1000]);
    expect(calls[0].inputs).toEqual(verdict.inputs);
    expect(calls[0].env).toMatchObject({ today: TODAY, seed: 0, detail: 'answer', ...verdict.env });
    const S = store.getState().saver;
    expect(S).toEqual({ key: verdict.key, status: 'final', result: RESULT(1000), reason: null });
    expect(readyMark(store.getState()).ready).toBe('1');
    const V = planSavingView(store.getState());
    expect(V.run).toEqual({ status: 'final', result: RESULT(1000), reason: null });
    stop();
  });
  it('no worker: failed with the reason said; "Try again" asks once more; a stale figure is dropped', async () => {
    const { store, verdict } = pageOn(C['05-saver-committed'], 'SamSaver01');
    const stop = startSaverRunner({ store, client: fakeClient(() => Promise.reject(Object.assign(new Error('none'), { code: NO_WORKER }))) });
    await tick();
    expect(store.getState().saver).toMatchObject({ key: verdict.key, status: 'failed', reason: 'noWorker' });
    stop();
    // a figure for a key no longer asked about never lands
    const s = reduce(reduce(initialState({ today: TODAY, build: 'test' }), { type: A.SAVER_WORKING, key: 'saver:p1:a' }), { type: A.SAVER_FINAL, key: 'saver:p1:b', result: RESULT(1000) });
    expect(s.saver).toEqual({ key: 'saver:p1:a', status: 'working', result: null, reason: null });
    // the same plan asked again keeps its older figure on screen; another plan starts clean
    const done = reduce(s, { type: A.SAVER_FINAL, key: 'saver:p1:a', result: RESULT(1000) });
    expect(reduce(done, { type: A.SAVER_WORKING, key: 'saver:p1:c' }).saver.result).toEqual(RESULT(1000));
    expect(reduce(done, { type: A.SAVER_WORKING, key: 'saver:p2:a' }).saver.result).toBe(null);
    const retried = reduce(reduce(done, { type: A.SAVER_WORKING, key: 'saver:p1:a' }), { type: A.SAVER_FAILED, key: 'saver:p1:a' });
    expect(reduce(retried, { type: A.SAVER_RETRY }).saver.status).toBe('idle');
    expect(cleanSaver(null)).toEqual(emptySaver());
    expect(cleanSaver({ key: 'saver:p1:a', status: 'final', result: { status: 'ok' } })).toEqual({ key: 'saver:p1:a', status: 'final', result: { status: 'ok' }, reason: null });
  });
  it('off the step, or a plan with nothing to ask (retired): nothing runs', async () => {
    const { store } = pageOn(C['04-buckets-running'], 'Retired01');
    const calls = [];
    const stop = startSaverRunner({ store, client: fakeClient(() => { calls.push(1); return Promise.resolve(RESULT(100)); }) });
    await tick();
    expect(calls).toEqual([]);
    expect(store.getState().saver.key).toBe(null);
    stop();
  });
});
