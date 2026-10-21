/**
 * The runner of "How the money is taken" (research/v7/way-and-mix.md 2.2, 2.5). On the step `#/plan/<id>/way`, whenever the
 * state changes: if the page's reading names a run key (way.js runKeyOf: the plan's id, its stamp, its settings) and
 * state.ways holds nothing for it — or holds a failed run asked to try again — dispatch ways/working, run the nine ways in
 * the worker (client.ways: the lazy engine loads there) with the plan as data, and dispatch ways/done with the result and
 * the time it took (the clock is this effect's: "Ran the nine ways in N s"), or ways/failed. Progress messages become
 * ways/progress; after SLOW_MS without a result, ways/slow. A result for a key no longer wanted is dropped here and by the
 * reducer; a save of the plan moves the key, so the result is held per plan and per stamp and a second visit does not run again.
 *
 * One way on its dials ("Tried in 1 run"): when the page's cards say a card needs a run — it is open and its dials show
 * values the comparison did not run it with, with no try held for them — dispatch ways/try with those values and run
 * client.way in its own lane; ways/tried (or ways/tryFailed) files the figures under the run's key and the values. A try
 * whose values or key moved under it is dropped; a newer try for the same way ends the older one. Nothing is written.
 *
 * No page fallback, on purpose (editing-in-v7.md 10.4): the engine's chunk is the worker's alone. A browser that cannot
 * start a worker gets ways/failed with reason 'noWorker', and the screen says so.
 *
 *   startWaysRunner({ store, client, now }) → stop()
 *     client.ways(plan, env, onProgress)   the worker client; rejects with code NO_WORKER when none can start
 *     client.way(plan, env, onProgress)    the same, for one way: env = { today, way: { id, dials } }
 *     now()                                the clock, for the cost said on screen only
 */
import { A } from '../state/actions.js';
import { NO_WORKER } from './workerClient.js';

export const SLOW_MS = 5000;
/** How long a card's dials must stand still before the way is tried on them (one run per change, not per keystroke). */
export const SETTLE_MS = 350;

/** The page's reading of the way step, when the route is on it. */
function wanted(state) {
  const r = state.route;
  if (!r || r.screen !== 'plan' || r.step !== 'way' || !r.planId) return null;
  const plans = state.plans;
  const page = plans && plans.status === 'read' && plans.view && plans.view.page && plans.view.page.forId === r.planId ? plans.view.page : null;
  const W = page && page.way;
  if (!W || !W.found || !W.runKey) return null;
  const entry = plans.list.find((e) => e && e.plan && String(e.plan.id) === String(r.planId));
  return entry ? { key: W.runKey, plan: entry.plan, cards: W.cards || [] } : null;
}

export function startWaysRunner({ store, client, now = () => 0 }) {
  let stopped = false;
  let run = 0;
  let underWay = null;        // the key being worked on
  let slowTimer = null;
  const clearSlow = () => { if (slowTimer !== null) clearTimeout(slowTimer); slowTimer = null; };

  async function start(key, plan) {
    const mine = ++run;
    const live = () => mine === run && !stopped;
    if (underWay) client.stop('ways');
    underWay = key;
    clearSlow();
    store.dispatch({ type: A.WAYS_WORKING, key });
    slowTimer = setTimeout(() => { slowTimer = null; if (live()) store.dispatch({ type: A.WAYS_SLOW, key }); }, SLOW_MS);
    const t0 = now();
    try {
      const result = await client.ways(plan, { today: store.getState().env.today }, (done, total) => { if (live()) store.dispatch({ type: A.WAYS_PROGRESS, key, done, total }); });
      if (!live()) return;
      if (!result || typeof result !== 'object') throw new Error('no result');
      store.dispatch({ type: A.WAYS_DONE, key, result, ms: now() - t0 });
    } catch (e) {
      if (live()) store.dispatch({ type: A.WAYS_FAILED, key, reason: e && e.code === NO_WORKER ? 'noWorker' : null });
    } finally {
      if (mine === run) { underWay = null; clearSlow(); }
    }
  }

  function check(state) {
    if (stopped) return;
    const w = wanted(state);
    if (!w) return;
    const W = state.ways;
    if (W.key === w.key && W.status !== 'idle') return;      // working, done or failed (until "Try again" makes it idle)
    if (underWay === w.key) return;
    start(w.key, w.plan);
  }

  // one way on its dials: tried on the plan of the run held, in the worker's 'way' lane; a stale answer is dropped. A dial
  // is typed a character at a time, so a try is asked for once the values have stood still for SETTLE_MS.
  const tries = new Map();                                   // id → { key, values, n }
  let tryN = 0;
  let settle = null;                                         // { id, values, timer }: the try waiting for the dials to settle
  const clearSettle = () => { if (settle) clearTimeout(settle.timer); settle = null; };
  async function tryWay(key, id, values, plan) {
    const n = ++tryN;
    tries.set(id, { key, values, n });
    const t0 = now();
    const mine = () => { const t = tries.get(id); return !stopped && t && t.n === n; };
    try {
      if (typeof client.way !== 'function') throw Object.assign(new Error('no way lane'), { code: NO_WORKER });
      const result = await client.way(plan, { today: store.getState().env.today, way: { id, dials: values } });
      if (!mine()) return;
      if (!result || typeof result !== 'object') throw new Error('no result');
      store.dispatch({ type: A.WAY_TRIED, key, id, values, result, ms: now() - t0 });
    } catch (e) {
      if (mine()) store.dispatch({ type: A.WAY_TRY_FAILED, key, id, values, reason: e && e.code === NO_WORKER ? 'noWorker' : null });
    } finally {
      if (mine()) tries.delete(id);
    }
  }
  function checkTries(state, action) {
    if (stopped) return;
    const w = wanted(state);
    if (!w) return;
    const W = state.ways;
    if (!W || W.key !== w.key || W.status !== 'done') return;
    // the page says a card needs a run: ask for it once its values have settled (the reducer marks the try under way); then run what the reducer holds
    if (!action || action.type !== A.WAY_TRY) {
      const due = w.cards.find((c) => c.needsRun && c.values);
      if (!due) { clearSettle(); return; }
      const text = JSON.stringify(due.values);
      if (settle && settle.id === due.id && settle.text === text) return;
      clearSettle();
      const timer = setTimeout(() => { settle = null; if (!stopped) store.dispatch({ type: A.WAY_TRY, id: due.id, values: due.values }); }, SETTLE_MS);
      settle = { id: due.id, text, timer };
      return;
    }
    const t = W.tried && W.tried[action.id];
    if (!t || t.status !== 'working') return;
    const cur = tries.get(action.id);
    if (cur && cur.key === W.key && JSON.stringify(cur.values) === JSON.stringify(t.values)) return;   // already under way for these values
    if (cur) client.stop('way');
    tryWay(W.key, action.id, t.values, w.plan);
  }
  const offTries = store.subscribe((state, action) => {
    checkTries(state, action);
    // the plan changed under a try: the old tries are ended, their answers dropped
    if (action && action.type === A.WAYS_WORKING && tries.size && [...tries.values()].some((t) => t.key !== action.key)) { client.stop('way'); tries.clear(); }
  });

  const off = store.subscribe(check);
  check(store.getState());
  checkTries(store.getState(), null);
  return () => { stopped = true; off(); offTries(); clearSlow(); clearSettle(); if (underWay) client.stop('ways'); if (tries.size) client.stop('way'); underWay = null; tries.clear(); };
}
