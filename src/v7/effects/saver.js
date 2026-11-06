/**
 * The runner of the plan's verdict on "What you pay in" (research/saving-enough-and-check-in.md 4.1, 4.4; release step R2).
 * On the step `#/plan/<id>/saving`, whenever the state changes: if the page's reading names a run (answers/plan/saving.js
 * `verdict`: the plan's figures as question B's inputs, saverInputs.js, and their key) and state.saver holds nothing for
 * that key — or a failed run that has been asked to try again — dispatch saver/working, run question B on those inputs in
 * the worker's own 'saver' lane with 100 futures (saver/first), then with 1,000 (saver/final), as V7's questions run
 * (run.js PASSES). A result for a key no longer wanted is dropped here and by the reducer; the figures changing under a
 * run end it.
 *
 * No page fallback, as for the plan's other runs: a browser that cannot start a worker gets saver/failed with reason
 * 'noWorker', and the screen says so (the planner's own check stays a link away). Nothing is written: the verdict lives
 * in page memory only.
 *
 *   startSaverRunner({ store, client }) → stop()
 *     client.saver(inputs, env, onProgress)   env = { today, futures, seed, detail, mix?, savingMix? }
 */
import { A } from '../state/actions.js';
import { NO_WORKER } from './workerClient.js';
import { PASSES as SAVER_PASSES } from './run.js';

const SEED = 0;   // the published seed, as every V7 answer

/** The page's reading of the verdict, when the route is on the saving step. */
function wanted(state) {
  const r = state.route;
  if (!r || r.screen !== 'plan' || r.step !== 'saving' || !r.planId) return null;
  const plans = state.plans;
  const page = plans && plans.status === 'read' && plans.view && plans.view.page && plans.view.page.forId === r.planId ? plans.view.page : null;
  const v = page && page.saving && page.saving.found ? page.saving.verdict : null;
  return v && v.ok && v.key ? v : null;
}

export function startSaverRunner({ store, client }) {
  let stopped = false;
  let run = 0;
  let underWay = null;        // the key being worked on

  async function start(v) {
    const mine = ++run;
    const live = () => mine === run && !stopped;
    if (underWay) client.stop('saver');
    underWay = v.key;
    store.dispatch({ type: A.SAVER_WORKING, key: v.key });
    try {
      if (!client || typeof client.saver !== 'function') throw Object.assign(new Error('no saver lane'), { code: NO_WORKER });
      for (const futures of SAVER_PASSES) {
        const env = { today: store.getState().env.today, futures, seed: SEED, trace: false, detail: 'answer', ...(v.env || {}) };
        const result = await client.saver(v.inputs, env);
        if (!live()) return;
        if (!result || typeof result !== 'object') throw new Error('no result');
        store.dispatch({ type: futures === SAVER_PASSES[SAVER_PASSES.length - 1] ? A.SAVER_FINAL : A.SAVER_FIRST, key: v.key, result });
      }
    } catch (e) {
      if (live()) store.dispatch({ type: A.SAVER_FAILED, key: v.key, reason: e && e.code === NO_WORKER ? 'noWorker' : null });
    } finally {
      if (mine === run) underWay = null;
    }
  }

  function check(state) {
    if (stopped) return;
    const v = wanted(state);
    if (!v) {
      // the page left the step, or the plan's figures no longer make a question: the run under way is ended
      if (underWay) { run++; client.stop('saver'); underWay = null; }
      return;
    }
    const S = state.saver;
    if (S && S.key === v.key && S.status !== 'idle') return;   // working, first, final or failed (until "Try again" makes it idle)
    if (underWay === v.key) return;
    start(v);
  }

  const off = store.subscribe(check);
  check(store.getState());
  return () => { stopped = true; off(); if (underWay) client.stop('saver'); underWay = null; };
}
