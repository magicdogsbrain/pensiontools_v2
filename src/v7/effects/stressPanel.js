/**
 * The runner of "Try the bad years" (7.9.0; the build spec's §2.1), on effects/keepTest.js's pattern. Only on a press
 * (stress/run: never on opening a page), the rows run in the worker's own lane, one call each, in the order asked — As
 * planned first, then As held when there are kept lines — on the plan named by the press (client.stressRow: the lazy engine
 * loads there). Each result is filed under the plan's key as it comes (stress/rowDone), so the rows stream in. Leaving the
 * plan's "Does it last?", or the plan changing under the run (the page's key moving), stops it (client.stop('stressRow')):
 * the rows tried so far stay under their own key. Nothing is written.
 *
 * No page fallback, on purpose: the engine's chunk is the worker's alone. A browser that cannot start a worker gets the
 * reason 'noWorker', and the panel says so.
 *
 *   startStressPanelRunner({ store, client }) → stop()
 *     client.stressRow(plan, env, onProgress)   env = { today, row }
 */
import { A } from '../state/actions.js';
import { NO_WORKER } from './workerClient.js';

/** The plan the rows are for, from the plans the page holds; null when it is no longer there. */
function planOf(state, planId) {
  const plans = state.plans;
  if (!plans || plans.status !== 'read' || !Array.isArray(plans.list)) return null;
  const e = plans.list.find((x) => x && x.plan && String(x.plan.id) === String(planId));
  return e ? e.plan : null;
}

/**
 * Whether the page still wants the run of `key`: the route is that plan's "Does it last?", and — once the page has read the
 * plan — its key is still `key` (a plan saved, a new day, a new document moves it).
 */
function wanted(state, Sp) {
  const r = state.route;
  if (!r || r.screen !== 'plan' || r.step !== 'lasts' || String(r.planId) !== String(Sp.planId)) return false;
  const page = state.plans && state.plans.view && state.plans.view.page;
  const view = page && page.forId === r.planId && page.lasts && page.lasts.stressPanel ? page.lasts.stressPanel : null;
  return !view || view.key === Sp.key;
}

export function startStressPanelRunner({ store, client } = {}) {
  let stopped = false;
  let running = null;   // the key under way

  async function run(key, plan, order) {
    running = key;
    const mine = () => !stopped && running === key;
    try {
      if (!client || typeof client.stressRow !== 'function') throw Object.assign(new Error('no stress lane'), { code: NO_WORKER });
      for (const row of order) {
        if (!mine()) return;
        const result = await client.stressRow(plan, { today: store.getState().env.today, row }, () => {});
        if (!mine()) return;
        if (!result || typeof result !== 'object') throw new Error('no result');
        store.dispatch({ type: A.STRESS_ROW_DONE, key, row, result });
      }
    } catch (e) {
      if (mine()) store.dispatch({ type: A.STRESS_FAILED, key, reason: e && e.code === NO_WORKER ? 'noWorker' : e && e.code === 'stopped' ? 'stopped' : null });
    } finally {
      if (running === key) running = null;
    }
  }

  function halt(key) {
    running = null;
    if (client && typeof client.stop === 'function') client.stop('stressRow');
    store.dispatch({ type: A.STRESS_FAILED, key, reason: 'stopped' });
  }

  function check(state, action) {
    if (stopped || !action) return;
    const Sp = state.stressPanel;
    if (!Sp || !Sp.key) { if (running) { running = null; client.stop('stressRow'); } return; }
    // a new press for another key ends the old run, its answers dropped
    if (running && running !== Sp.key) { running = null; client.stop('stressRow'); }
    // the page left, or the plan changed under the run: stopped, the rows so far kept under their key
    if (Sp.status === 'working' && !wanted(state, Sp)) { halt(Sp.key); return; }
    if (action.type === A.STRESS_RUN && Sp.status === 'working' && running !== Sp.key) {
      const plan = planOf(state, Sp.planId);
      if (!plan) { store.dispatch({ type: A.STRESS_FAILED, key: Sp.key, reason: null }); return; }
      run(Sp.key, plan, Sp.order.slice());
    }
  }
  const off = store.subscribe(check);
  check(store.getState(), { type: 'start' });
  return () => { stopped = true; off(); if (running) client.stop('stressRow'); running = null; };
}
