/**
 * The runner of "Your review" (7.10.0; spec-7100 §4.1), on effects/stressPanel.js's pattern. Only on a press (review/run:
 * never on opening a page), the rows run in the worker's stress lane, one call each, in the order asked, on the plan named by
 * the press (client.stressRow: the lazy engine loads there):
 *   - 'asPlanned'  the plan as it stands (Moving): runStressRow's As planned;
 *   - 'whole'      what is held, whole (Moving, "Test with what I hold"): the held row with `whole` (keepTest.heldSettingsOf);
 *   - 'today'      the plan from today on the pots entered (Living on it, "Work out the chance from today"): As planned on the
 *                  run-only settings review.js reviewSettingsOf builds here, from the pots the press carried — never saved.
 * Each result is filed under the press's key as it comes (review/done). Leaving the plan's review, or the plan and the inputs
 * changing under the run (the page's key moving), stops it (client.stop('stressRow')). Nothing is written.
 *
 * No page fallback, on purpose: the engine's chunk is the worker's alone ('noWorker').
 *
 *   startReviewRunner({ store, client }) → stop()
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

/** Whether the page still wants the run of `key`: the route is that plan's review and — once read — its run key is still `key`. */
function wanted(state, Rv) {
  const r = state.route;
  if (!r || r.screen !== 'plan' || r.step !== 'review' || String(r.planId) !== String(Rv.planId)) return false;
  const page = state.plans && state.plans.view && state.plans.view.page;
  const view = page && page.forId === r.planId && page.review ? page.review : null;
  return !view || !view.run || view.run.key === Rv.key;
}

/**
 * What one row asks the worker for. The review's reader comes with the plan pages (loaded with import(), as the plan source
 * is), so the front door's shell carries none of it.
 */
export async function rowEnv(plan, row, { today, pots }) {
  if (row === 'whole') return { today, row: 'asHeld', whole: true };
  if (row === 'today') {
    const { reviewSettingsOf } = await import('../../answers/plan/review.js');
    return { today, row: 'asPlanned', settings: reviewSettingsOf(plan, { pots, today }) };
  }
  return { today, row: 'asPlanned' };
}

export function startReviewRunner({ store, client } = {}) {
  let stopped = false;
  let running = null;   // the key under way

  async function run(key, plan, order, pots) {
    running = key;
    const mine = () => !stopped && running === key;
    try {
      if (!client || typeof client.stressRow !== 'function') throw Object.assign(new Error('no stress lane'), { code: NO_WORKER });
      for (const row of order) {
        if (!mine()) return;
        const env = await rowEnv(plan, row, { today: store.getState().env.today, pots });
        if (!mine()) return;
        const result = await client.stressRow(plan, env, () => {});
        if (!mine()) return;
        if (!result || typeof result !== 'object') throw new Error('no result');
        store.dispatch({ type: A.REVIEW_DONE, key, row, result });
      }
    } catch (e) {
      if (mine()) store.dispatch({ type: A.REVIEW_FAILED, key, reason: e && e.code === NO_WORKER ? 'noWorker' : e && e.code === 'stopped' ? 'stopped' : null });
    } finally {
      if (running === key) running = null;
    }
  }

  function halt(key) {
    running = null;
    if (client && typeof client.stop === 'function') client.stop('stressRow');
    store.dispatch({ type: A.REVIEW_FAILED, key, reason: 'stopped' });
  }

  function check(state, action) {
    if (stopped || !action) return;
    const Rv = state.review;
    if (!Rv || !Rv.key) { if (running) { running = null; if (client) client.stop('stressRow'); } return; }
    // a new press for another key ends the old run, its answers dropped
    if (running && running !== Rv.key) { running = null; client.stop('stressRow'); }
    // the page left, or the plan or its inputs changed under the run: stopped
    if (Rv.status === 'working' && !wanted(state, Rv)) { halt(Rv.key); return; }
    if (action.type === A.REVIEW_RUN && Rv.status === 'working' && running !== Rv.key) {
      const plan = planOf(state, Rv.planId);
      if (!plan) { store.dispatch({ type: A.REVIEW_FAILED, key: Rv.key, reason: null }); return; }
      run(Rv.key, plan, Rv.order.slice(), Rv.pots);
    }
  }
  const off = store.subscribe(check);
  check(store.getState(), { type: 'start' });
  return () => { stopped = true; off(); if (running && client) client.stop('stressRow'); running = null; };
}
