/**
 * The runner of "The mix" (research/v7/way-and-mix.md 3.2b, 3.2d, 3.2e). On the step `#/plan/<id>/mix`, whenever a try
 * is asked for (mix/try: the sleeve or the tent the other way) or the comparison (mix/compare: the eight cells), run it in
 * the worker's own lane on the plan the page's reading names (client.mixTry, client.mixCompare: the lazy engine loads
 * there) and file the figures under the key (mix/tried, mix/compared), or say it failed. A result for a key no longer wanted
 * is dropped here and by the reducer; the plan changing under a run (the key moving) ends it. Progress messages of the
 * comparison become mix/compareProgress. The plan's own figures ("Does it last?", state.lasts) go with a try when they are
 * held for the key, so the try is one run; without them the worker runs the plan as saved too and says so (runs: 2).
 *
 * No page fallback, on purpose: the engine's chunk is the worker's alone. A browser that cannot start a worker gets the
 * reason 'noWorker', and the screen says so. Nothing is written.
 *
 *   startMixRunner({ store, client, now }) → stop()
 *     client.mixTry(plan, env, onProgress)      env = { today, kind, base }
 *     client.mixCompare(plan, env, onProgress)  env = { today }
 *     now()                                     the clock, for the cost said on screen only
 */
import { A } from '../state/actions.js';
import { NO_WORKER } from './workerClient.js';

/** The page's reading of the mix step, when the route is on it. */
function wanted(state) {
  const r = state.route;
  if (!r || r.screen !== 'plan' || r.step !== 'mix' || !r.planId) return null;
  const plans = state.plans;
  const page = plans && plans.status === 'read' && plans.view && plans.view.page && plans.view.page.forId === r.planId ? plans.view.page : null;
  const M = page && page.mix;
  if (!M || !M.found || !M.runKey) return null;
  const entry = plans.list.find((e) => e && e.plan && String(e.plan.id) === String(r.planId));
  return entry ? { key: M.runKey, plan: entry.plan } : null;
}

export function startMixRunner({ store, client, now = () => 0 }) {
  let stopped = false;
  const tries = new Map();      // kind → key under way
  let compareKey = null;

  async function tryOne(key, kind, plan) {
    tries.set(kind, key);
    const t0 = now();
    const mine = () => !stopped && tries.get(kind) === key;
    try {
      if (!client || typeof client.mixTry !== 'function') throw Object.assign(new Error('no mix lane'), { code: NO_WORKER });
      const L = store.getState().lasts;
      const base = L && L.key === key && L.status === 'done' && L.result && L.result.a ? { share: L.result.a.share, chancePct: L.result.a.chancePct, typicalLeft: L.result.a.typicalLeft, badCaseLeft: L.result.a.badCaseLeft } : null;
      const result = await client.mixTry(plan, { today: store.getState().env.today, kind, base });
      if (!mine()) return;
      if (!result || typeof result !== 'object') throw new Error('no result');
      store.dispatch({ type: A.MIX_TRIED, key, kind, result, ms: now() - t0 });
    } catch (e) {
      if (mine()) store.dispatch({ type: A.MIX_TRY_FAILED, key, kind, reason: e && e.code === NO_WORKER ? 'noWorker' : null });
    } finally {
      if (tries.get(kind) === key) tries.delete(kind);
    }
  }

  async function compare(key, plan) {
    compareKey = key;
    const t0 = now();
    const mine = () => !stopped && compareKey === key;
    try {
      if (!client || typeof client.mixCompare !== 'function') throw Object.assign(new Error('no mix lane'), { code: NO_WORKER });
      const result = await client.mixCompare(plan, { today: store.getState().env.today }, (done, total) => { if (mine()) store.dispatch({ type: A.MIX_COMPARE_PROGRESS, key, done, total }); });
      if (!mine()) return;
      if (!result || typeof result !== 'object') throw new Error('no result');
      store.dispatch({ type: A.MIX_COMPARED, key, result, ms: now() - t0 });
    } catch (e) {
      if (mine()) store.dispatch({ type: A.MIX_COMPARE_FAILED, key, reason: e && e.code === NO_WORKER ? 'noWorker' : null });
    } finally {
      if (compareKey === key) compareKey = null;
    }
  }

  function check(state, action) {
    if (stopped || !action) return;
    const w = wanted(state);
    const M = state.mix;
    if (!w || !M || M.key !== w.key) {
      // the plan changed under a run (or the page left): the old runs are ended, their answers dropped
      if (tries.size && [...tries.values()].some((k) => !w || k !== w.key)) { client.stop('mixTry'); tries.clear(); }
      if (compareKey && (!w || compareKey !== w.key)) { client.stop('mixCompare'); compareKey = null; }
      return;
    }
    if (action.type === A.MIX_TRY) {
      const t = M.tries[action.kind];
      if (t && t.status === 'working' && tries.get(action.kind) !== w.key) tryOne(w.key, action.kind, w.plan);
    } else if (action.type === A.MIX_COMPARE) {
      if (M.compare.status === 'working' && compareKey !== w.key) compare(w.key, w.plan);
    }
  }
  const off = store.subscribe(check);
  return () => { stopped = true; off(); if (tries.size) client.stop('mixTry'); if (compareKey) client.stop('mixCompare'); tries.clear(); compareKey = null; };
}
