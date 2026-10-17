/**
 * The runner of "Does it last?" (research/v7/editing-in-v7.md 10.4). On the step `#/plan/<id>/lasts`, whenever the state
 * changes: if the page's reading names a run key (lastsOf: the plan's id, its stamp, its settings) and state.lasts holds
 * nothing for it — or holds a failed run that has been asked to try again — dispatch lasts/working, run the one test in
 * the worker (client.lasts: the lazy engine chunk loads there) with the plan as data, and dispatch lasts/done with the
 * result (or lasts/failed). Progress messages become lasts/progress; after SLOW_MS without a result, lasts/slow. A result
 * for a key no longer wanted is dropped here and by the reducer.
 *
 * No page fallback, on purpose: the engine's chunk is the worker's alone, so the shell and the plan pages' own chunk never
 * carry the strategies (10.4). A browser that cannot start a worker gets lasts/failed with reason 'noWorker', and the
 * screen offers the planner instead.
 *
 * The result lives in the state only (10.1): nothing is written to the plan after a run.
 *
 *   startLastsRunner({ store, client }) → stop()
 *     client.lasts(plan, env, onProgress)   the worker client; rejects with code NO_WORKER when none can start
 */
import { A } from '../state/actions.js';
import { NO_WORKER } from './workerClient.js';

export const SLOW_MS = 5000;

/** The page's reading of the lasts step, when the route is on it. */
function wanted(state) {
  const r = state.route;
  if (!r || r.screen !== 'plan' || r.step !== 'lasts' || !r.planId) return null;
  const plans = state.plans;
  const page = plans && plans.status === 'read' && plans.view && plans.view.page && plans.view.page.forId === r.planId ? plans.view.page : null;
  const L = page && page.lasts;
  if (!L || !L.found || !L.runKey) return null;
  const entry = plans.list.find((e) => e && e.plan && String(e.plan.id) === String(r.planId));
  return entry ? { key: L.runKey, plan: entry.plan } : null;
}

export function startLastsRunner({ store, client }) {
  let stopped = false;
  let run = 0;
  let underWay = null;        // the key being worked on
  let slowTimer = null;
  const clearSlow = () => { if (slowTimer !== null) clearTimeout(slowTimer); slowTimer = null; };

  async function start(key, plan) {
    const mine = ++run;
    const live = () => mine === run && !stopped;
    if (underWay) client.stop('lasts');
    underWay = key;
    clearSlow();
    store.dispatch({ type: A.LASTS_WORKING, key });
    slowTimer = setTimeout(() => { slowTimer = null; if (live()) store.dispatch({ type: A.LASTS_SLOW, key }); }, SLOW_MS);
    try {
      const result = await client.lasts(plan, { today: store.getState().env.today }, (done, total) => { if (live()) store.dispatch({ type: A.LASTS_PROGRESS, key, done, total }); });
      if (!live()) return;
      if (!result || typeof result !== 'object') throw new Error('no result');
      store.dispatch({ type: A.LASTS_DONE, key, result });
    } catch (e) {
      if (live()) store.dispatch({ type: A.LASTS_FAILED, key, reason: e && e.code === NO_WORKER ? 'noWorker' : null });
    } finally {
      if (mine === run) { underWay = null; clearSlow(); }
    }
  }

  function check(state) {
    if (stopped) return;
    const w = wanted(state);
    if (!w) return;
    const L = state.lasts;
    if (L.key === w.key && L.status !== 'idle') return;      // working, done or failed (until "Try again" makes it idle)
    if (underWay === w.key) return;
    start(w.key, w.plan);
  }

  const off = store.subscribe(check);
  check(store.getState());
  return () => { stopped = true; off(); clearSlow(); if (underWay) client.stop('lasts'); underWay = null; };
}
