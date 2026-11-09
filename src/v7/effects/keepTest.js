/**
 * The runner of "Test what you keep against your plan" (7.7.0). Whenever the test is asked for (keepTest/run, a press of the
 * button on "What you hold" — never on opening a page), the re-test runs in the worker's own lane on the plan named by the
 * press (client.keepRetest: the lazy engine loads there), and the result is filed under the plan's key (keepTest/done), or it
 * failed. A result for a key no longer wanted is dropped here and by the reducer; the plan changing under a run (the key
 * moving: a change of what is held, an agreement written) ends it. Nothing is written.
 *
 * No page fallback, on purpose: the engine's chunk is the worker's alone. A browser that cannot start a worker gets the
 * reason 'noWorker', and the screen says so.
 *
 *   startKeepTestRunner({ store, client }) → stop()
 *     client.keepRetest(plan, env, onProgress)   env = { today }
 */
import { A } from '../state/actions.js';
import { NO_WORKER } from './workerClient.js';

/** The plan the re-test is for, from the plans the page holds; null when it is no longer there. */
function planOf(state, planId) {
  const plans = state.plans;
  if (!plans || plans.status !== 'read' || !Array.isArray(plans.list)) return null;
  const e = plans.list.find((x) => x && x.plan && String(x.plan.id) === String(planId));
  return e ? e.plan : null;
}

export function startKeepTestRunner({ store, client } = {}) {
  let stopped = false;
  let running = null;   // the key under way

  async function run(key, plan) {
    running = key;
    const mine = () => !stopped && running === key;
    try {
      if (!client || typeof client.keepRetest !== 'function') throw Object.assign(new Error('no keep lane'), { code: NO_WORKER });
      const result = await client.keepRetest(plan, { today: store.getState().env.today }, (done, total) => { if (mine()) store.dispatch({ type: A.KEEP_TEST_PROGRESS, key, done, total }); });
      if (!mine()) return;
      if (!result || typeof result !== 'object') throw new Error('no result');
      store.dispatch({ type: A.KEEP_TEST_DONE, key, result });
    } catch (e) {
      if (mine()) store.dispatch({ type: A.KEEP_TEST_FAILED, key, reason: e && e.code === NO_WORKER ? 'noWorker' : null });
    } finally {
      if (running === key) running = null;
    }
  }

  function check(state, action) {
    if (stopped || !action) return;
    const Kt = state.keepTest;
    if (!Kt || !Kt.key) { if (running) { client.stop('keepRetest'); running = null; } return; }
    // the plan changed under a run (its key moved), or it left: the old run is ended, its answer dropped
    if (running && (running !== Kt.key || Kt.status !== 'working')) { client.stop('keepRetest'); running = null; }
    if (action.type === A.KEEP_TEST_RUN && Kt.status === 'working' && running !== Kt.key) {
      const plan = planOf(state, Kt.planId);
      if (!plan) { store.dispatch({ type: A.KEEP_TEST_FAILED, key: Kt.key, reason: null }); return; }
      run(Kt.key, plan);
    }
  }
  const off = store.subscribe(check);
  check(store.getState(), { type: 'start' });
  return () => { stopped = true; off(); if (running) client.stop('keepRetest'); running = null; };
}
