/**
 * The runner of "Try the bad years" under C's and D's answers (7.9.0; the build spec's §2.2). Only on a press of a final
 * answer (strip/run: never on its own), the answer is worked out again row by row in the worker's own lane
 * (client.stressStrip: shared/stressStrip.js runStressStrip, in the worker's own chunk), on the final answer's own inputs,
 * date, futures and seed, at the amount it stands behind (state/select.js stripAmountOf); the rows are filed under the
 * answer's key (strip/done) or it failed. A new answer (the key moving: the reducer drops the strip) ends it
 * (client.stop('stressStrip')); so does the answer runner before it posts a new answer (effects/run.js). Nothing is written.
 *
 * No page fallback: a browser that cannot start a worker gets the reason 'noWorker', and the strip says so.
 *
 *   startStressStripRunner({ store, client, on }) → stop()     on: rules.js STRESS.strip (false: the strip switched off)
 *     client.stressStrip(q, inputs, env, at, onProgress)   env = { today, futures, seed }, at = { perMonth }
 */
import { A } from '../state/actions.js';
import { stripAmountOf } from '../state/select.js';
import { NO_WORKER } from './workerClient.js';
import { STRESS as STRESS_ON } from '../../answers/shared/rules.js';

export function startStressStripRunner({ store, client, on = STRESS_ON.strip } = {}) {
  // the rollback (rules.js STRESS.strip false): the page told, so no strip is drawn under any answer
  if (!on) store.dispatch({ type: A.ENV_SET, patch: { stressStrip: false } });
  let stopped = false;
  let running = null;   // 'q|key' under way

  async function run(q, key, result) {
    const id = q + '|' + key;
    running = id;
    const mine = () => !stopped && running === id;
    try {
      if (!client || typeof client.stressStrip !== 'function') throw Object.assign(new Error('no strip lane'), { code: NO_WORKER });
      const b = result.basis || {};
      const env = { today: b.today, futures: b.futures, seed: b.seed ?? 0 };
      const out = await client.stressStrip(q, result.inputs, env, { perMonth: stripAmountOf(q, result) }, () => {});
      if (!mine()) return;
      if (!out || typeof out !== 'object' || !Array.isArray(out.rows)) throw new Error('no result');
      store.dispatch({ type: A.STRIP_DONE, q, inputsKey: key, result: out });
    } catch (e) {
      if (mine()) store.dispatch({ type: A.STRIP_FAILED, q, inputsKey: key, reason: e && e.code === NO_WORKER ? 'noWorker' : e && e.code === 'stopped' ? 'stopped' : null });
    } finally {
      if (running === id) running = null;
    }
  }

  function check(state, action) {
    if (stopped || !action) return;
    const St = state.stressStrip;
    const want = St && St.status === 'working' && St.q ? St.q + '|' + St.key : null;
    // the answer moved on (the strip dropped or for other inputs): the old run is ended, its rows never filed
    if (running && running !== want) { running = null; client.stop('stressStrip'); }
    if (action.type === A.STRIP_RUN && want && running !== want) {
      const answer = state.answers[St.q];
      if (!answer || !answer.result) { store.dispatch({ type: A.STRIP_FAILED, q: St.q, inputsKey: St.key, reason: null }); return; }
      run(St.q, St.key, answer.result);
    }
  }
  const off = store.subscribe(check);
  check(store.getState(), { type: 'start' });
  return () => { stopped = true; off(); if (running) client.stop('stressStrip'); running = null; };
}
