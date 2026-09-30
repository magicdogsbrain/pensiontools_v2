/**
 * The runner (V7 build brief 4.10). For the question on screen, whenever the state changes:
 *
 *  1. If the route is not the answer step, or the draft does not parse, do nothing.
 *  2. If the answer held is for these inputs (working, first, final — or failed and not yet retried), do nothing.
 *  3. Otherwise: wait 250 ms for typing to pause (no wait when no answer has been asked for yet: the first run
 *     after "Show what it pays", and "Try again"); end any worker run under way; dispatch answer/working; run
 *     with 100 futures → answer/first; run with 1,000 → answer/final. After 5 seconds without a final result
 *     dispatch answer/slow. On any error dispatch answer/failed. If no worker can start, run the same two passes
 *     on the page.
 *
 * A result for inputs that are no longer the ones being worked on never reaches the state: the run that produced
 * it has been replaced (checked here), and the reducer drops anything filed under an old key (checked there).
 * The worker is made ready when the question is first opened, so it is there before the button is pressed.
 */
import { A } from '../state/actions.js';
import { parsedDraft, currentKey, needsRun } from '../state/select.js';
import { NO_WORKER } from './workerClient.js';

export const PASSES = [100, 1000];     // futures: the first figure, then the final figure
export const WAIT_MS = 250;
export const SLOW_MS = 5000;
const SEED = 0;                         // the published seed (brief 2.3, conflict 48)

/**
 * @param {object} o
 * @param {{ getState, dispatch, subscribe }} o.store
 * @param {{ init, answer, stop }} o.client                      the worker client
 * @param {(q: string, inputs: object, env: object) => object} o.local   the answer function, for the page itself
 * @param {string} [o.q]
 * @returns {() => void} stop
 */
export function startRunner({ store, client, local, q = 'c' }) {
  let run = 0;                 // the id of the newest run; an older run's results are dropped
  let underWay = false;
  let waitingFor = null;       // the key a typing-pause timer is waiting on
  let waitTimer = null;
  let slowTimer = null;
  let onPage = false;          // no worker: work on the page
  let opened = false;
  let stopped = false;

  const clearWait = () => { if (waitTimer !== null) clearTimeout(waitTimer); waitTimer = null; waitingFor = null; };
  const clearSlow = () => { if (slowTimer !== null) clearTimeout(slowTimer); slowTimer = null; };
  const noteHistory = (historyEnd) => {
    if (typeof historyEnd === 'string' && store.getState().env.historyEnd === null) store.dispatch({ type: A.ENV_SET, patch: { historyEnd } });
  };

  async function once(inputs, env, onProgress) {
    if (!onPage) {
      try {
        return await client.answer(q, inputs, env, onProgress);
      } catch (e) {
        if (!e || e.code !== NO_WORKER) throw e;
        onPage = true;
      }
    }
    await new Promise((resolve) => setTimeout(resolve, 0));      // let "Working out your answer" be drawn first
    return local(q, inputs, { ...env, onProgress });
  }

  async function start(key) {
    const state = store.getState();
    const inputs = parsedDraft(state, q).inputs;
    const today = state.env.today;
    const mine = ++run;
    const live = () => mine === run && !stopped;
    if (underWay) client.stop();                                  // nobody is waiting for the old figures
    underWay = true;
    clearSlow();
    store.dispatch({ type: A.ANSWER_WORKING, q, inputsKey: key });
    slowTimer = setTimeout(() => { slowTimer = null; if (live()) store.dispatch({ type: A.ANSWER_SLOW, q }); }, SLOW_MS);
    try {
      for (let i = 0; i < PASSES.length; i++) {
        const env = { today, futures: PASSES[i], seed: SEED, trace: false };
        const result = await once(inputs, env, (done, total) => { if (live()) store.dispatch({ type: A.ANSWER_PROGRESS, q, inputsKey: key, done, total }); });
        if (!live()) return;
        if (!result || typeof result !== 'object' || result.status === 'invalid') throw new Error('the answer could not use inputs the form had passed');
        noteHistory(result.basis && result.basis.historyEnd);
        store.dispatch({ type: i < PASSES.length - 1 ? A.ANSWER_FIRST : A.ANSWER_FINAL, q, inputsKey: key, result });
      }
    } catch {
      if (live()) store.dispatch({ type: A.ANSWER_FAILED, q, inputsKey: key });
    } finally {
      if (mine === run) { underWay = false; clearSlow(); }
    }
  }

  function check(state) {
    if (stopped) return;
    if (!opened && state.route.q === q) {
      opened = true;
      client.init(state.env.today).then((ready) => noteHistory(ready && ready.historyEnd), (e) => { if (e && e.code === NO_WORKER) onPage = true; });
    }
    if (!needsRun(state, q)) { clearWait(); return; }
    const key = currentKey(state, q);
    if (key === waitingFor) return;
    clearWait();
    if (state.answers[q].inputsKey === null) { start(key); return; }
    waitingFor = key;
    waitTimer = setTimeout(() => {
      waitTimer = null;
      waitingFor = null;
      const now = store.getState();
      if (!stopped && needsRun(now, q) && currentKey(now, q) === key) start(key);
    }, WAIT_MS);
  }

  const unsubscribe = store.subscribe(check);
  check(store.getState());

  return () => {
    stopped = true;
    unsubscribe();
    clearWait();
    clearSlow();
    if (underWay) client.stop();
    underWay = false;
  };
}
