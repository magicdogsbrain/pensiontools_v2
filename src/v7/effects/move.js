/**
 * The runner of "Moving to your plan's mix" (research/v7/holdings-and-move.md §3.3, §3.7; road-to-7.md step 10). On the step
 * `#/plan/<id>/move`:
 *   - the equity index the rotation watch reads is the one market's (src/reading/market.js through pageMarket.js): loaded
 *     ONCE a page life on this page, as both workers load it — the day's file when it loads and is no older than the copy
 *     built in, else that copy; the figures go to the state as move/index ({ level, ath, asOf, symbol, athDate }) and the
 *     reader says the date;
 *   - whenever "What if I keep what I hold?" is asked for (move/run), the one run on the held mix runs in the worker's own
 *     lane on the plan the page's reading names (client.moveHeld: the lazy engine loads there) and the figures are filed
 *     under the plan's key (move/done), or it failed. A result for a key no longer wanted is dropped here and by the
 *     reducer; the plan changing under a run (the key moving) ends it.
 *
 * No page fallback, on purpose: the engine's chunk is the worker's alone. A browser that cannot start a worker gets the
 * reason 'noWorker', and the screen says so. Nothing is written.
 *
 *   startMoveRunner({ store, client, now, market }) → stop()
 *     client.moveHeld(plan, env, onProgress)   env = { today }
 *     now()                                    the clock, for the cost said on screen only
 *     market()                                 → Promise<{ equity }>: the one market on this page (pageMarket.loadPageMarket)
 */
import { A } from '../state/actions.js';
import { NO_WORKER } from './workerClient.js';
import { loadPageMarket } from './pageMarket.js';

/** The page's reading of the move step, when the route is on it. */
function wanted(state) {
  const r = state.route;
  if (!r || r.screen !== 'plan' || r.step !== 'move' || !r.planId) return null;
  const plans = state.plans;
  const page = plans && plans.status === 'read' && plans.view && plans.view.page && plans.view.page.forId === r.planId ? plans.view.page : null;
  const Mv = page && page.move;
  if (!Mv || !Mv.found || !Mv.runKey) return null;
  const entry = plans.list.find((e) => e && e.plan && String(e.plan.id) === String(r.planId));
  return entry ? { key: Mv.runKey, plan: entry.plan } : null;
}

/** The index as the reader takes it, from the share index the one market holds (no choosing here: the loader chose). */
export function indexOf(e) {
  if (!e || !(+e.level > 0) || !(+e.ath > 0)) return null;
  return { level: +e.level, ath: +e.ath, asOf: typeof e.date === 'string' ? e.date : null, symbol: typeof e.symbol === 'string' ? e.symbol : null, athDate: typeof e.athDate === 'string' ? e.athDate : null };
}

export function startMoveRunner({ store, client, now = () => 0, market = loadPageMarket } = {}) {
  let stopped = false;
  let running = null;          // the key under way
  let fetched = false;         // the index asked for once a page life

  async function loadIndex() {
    fetched = true;
    let equity = null;
    try { equity = (await market()).equity; } catch { equity = null; }
    if (stopped) return;
    store.dispatch({ type: A.MOVE_INDEX, index: indexOf(equity) });
  }

  async function run(key, plan) {
    running = key;
    const t0 = now();
    const mine = () => !stopped && running === key;
    try {
      if (!client || typeof client.moveHeld !== 'function') throw Object.assign(new Error('no move lane'), { code: NO_WORKER });
      const result = await client.moveHeld(plan, { today: store.getState().env.today });
      if (!mine()) return;
      if (!result || typeof result !== 'object') throw new Error('no result');
      store.dispatch({ type: A.MOVE_DONE, key, result, ms: now() - t0 });
    } catch (e) {
      if (mine()) store.dispatch({ type: A.MOVE_FAILED, key, reason: e && e.code === NO_WORKER ? 'noWorker' : null });
    } finally {
      if (running === key) running = null;
    }
  }

  function check(state, action) {
    if (stopped || !action) return;
    const r = state.route;
    const onStep = r && r.screen === 'plan' && r.step === 'move';
    if (onStep && !fetched) loadIndex();
    const w = wanted(state);
    const Mv = state.move;
    if (!w || !Mv || Mv.key !== w.key) {
      // the plan changed under a run (or the page left): the old run is ended, its answer dropped
      if (running && (!w || running !== w.key)) { client.stop('moveHeld'); running = null; }
      return;
    }
    if (action.type === A.MOVE_RUN && Mv.status === 'working' && running !== w.key) { if (running) client.stop('moveHeld'); run(w.key, w.plan); }
  }
  const off = store.subscribe(check);
  check(store.getState(), { type: 'start' });
  return () => { stopped = true; off(); if (running) client.stop('moveHeld'); running = null; };
}
