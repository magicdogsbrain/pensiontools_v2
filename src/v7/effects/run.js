/**
 * The runner (V7 build brief 4.10; step 4 brief 4.11). For each open question, whenever the state changes:
 *
 *  1. If the route is not the question's answer step (or an optional step of A or B), or the draft does not parse,
 *     do nothing. The retired view of A or B runs nothing.
 *  2. If the answer held is for these inputs (working, first, final — or failed and not yet retried), do nothing.
 *  3. Otherwise: wait 250 ms for typing to pause (no wait when no answer has been asked for yet: the first run
 *     after "Show what it pays", and "Try again"); end any worker run of this question under way; dispatch
 *     answer/working; run with 100 futures → answer/first; run with 1,000 → answer/final. After 5 seconds without a
 *     final result dispatch answer/slow. On any error dispatch answer/failed. If no worker can start, run the same
 *     passes on the page.
 *  4. A and B: both passes ask for the answer step's detail (env.detail: A 'chart', B 'answer'). On an optional step
 *     (A's ages, B's choices), once a final answer for these inputs is held at a lower detail, one more pass at 1,000
 *     with the step's detail (A 'all', B 'grid'): answer/extend at once (nothing is being typed), then answer/final.
 *     C's env carries no detail, as before.
 *
 * A result for inputs that are no longer the ones being worked on never reaches the state: the run that produced
 * it has been replaced (checked here), and the reducer drops anything filed under an old key (checked there).
 * Each question has its own lane: a new run of A ends only A's run under way (client.stop('a')), so moving from C's
 * answer to A's never loses C's figures. The worker is made ready when a question is first opened, so it is there
 * before the button is pressed.
 */
import { A } from '../state/actions.js';
import { parsedDraft, currentKey, needsRun, wantedDetail, STEP_DETAIL } from '../state/select.js';
import { BUILT } from '../rail/questions.js';
import { NO_WORKER } from './workerClient.js';

export const PASSES = [100, 1000];     // futures: the first figure, then the final figure
export const EXTEND_FUTURES = 1000;    // an optional step's extra pass (conflict 43)
export const WAIT_MS = 250;
export const SLOW_MS = 5000;
const SEED = 0;                         // the published seed (brief 2.3, conflict 48)

/**
 * @param {object} o
 * @param {{ getState, dispatch, subscribe }} o.store
 * @param {{ init, answer, stop }} o.client                      the worker client; stop(q) ends q's answers under way
 * @param {(q: string, inputs: object, env: object) => object} o.local   the answer function, for the page itself
 * @param {string} [o.q]                                          one question only; by default every open question
 * @returns {() => void} stop
 */
export function startRunner({ store, client, local, q = null }) {
  const questions = q ? [q] : Object.keys(BUILT);
  let onPage = false;          // no worker: work on the page
  let opened = false;
  let stopped = false;

  const noteHistory = (historyEnd) => {
    if (typeof historyEnd === 'string' && store.getState().env.historyEnd === null) store.dispatch({ type: A.ENV_SET, patch: { historyEnd } });
  };

  async function once(question, inputs, env, onProgress) {
    if (!onPage) {
      try {
        return await client.answer(question, inputs, env, onProgress);
      } catch (e) {
        if (!e || e.code !== NO_WORKER) throw e;
        onPage = true;
      }
    }
    await new Promise((resolve) => setTimeout(resolve, 0));      // let "Working out your answer" be drawn first
    return local(question, inputs, { ...env, onProgress });
  }

  /** One question's runs: its own newest-run id, typing wait and "slow" clock. */
  function lane(question) {
    let run = 0;                 // the id of the newest run; an older run's results are dropped
    let underWay = false;
    let waitingFor = null;       // the key a typing-pause timer is waiting on
    let waitTimer = null;
    let slowTimer = null;

    const clearWait = () => { if (waitTimer !== null) clearTimeout(waitTimer); waitTimer = null; waitingFor = null; };
    const clearSlow = () => { if (slowTimer !== null) clearTimeout(slowTimer); slowTimer = null; };
    const envFor = (today, futures, detail) => {
      const env = { today, futures, seed: SEED, trace: false };
      if (STEP_DETAIL[question]) env.detail = detail;             // C's env is exactly as it was
      return env;
    };

    /** Begin a run: end the one under way, dispatch its first action, start the slow clock. → live() */
    function begin(first) {
      const mine = ++run;
      const live = () => mine === run && !stopped;
      if (underWay) client.stop(question);                        // nobody is waiting for the old figures
      underWay = true;
      clearSlow();
      store.dispatch(first);
      slowTimer = setTimeout(() => { slowTimer = null; if (live()) store.dispatch({ type: A.ANSWER_SLOW, q: question }); }, SLOW_MS);
      return { mine, live };
    }

    async function passes(key, first, list) {
      const state = store.getState();
      const inputs = parsedDraft(state, question).inputs;
      const today = state.env.today;
      const { mine, live } = begin(first);
      try {
        for (let i = 0; i < list.length; i++) {
          const { futures, detail, then } = list[i];
          const result = await once(question, inputs, envFor(today, futures, detail), (done, total) => {
            if (live()) store.dispatch({ type: A.ANSWER_PROGRESS, q: question, inputsKey: key, done, total });
          });
          if (!live()) return;
          if (!result || typeof result !== 'object' || result.status === 'invalid') throw new Error('the answer could not use inputs the form had passed');
          noteHistory(result.basis && result.basis.historyEnd);
          // The last figure: this run is over before it is filed, so a pass that filing it calls for (an optional
          // step's extra pass) starts clean instead of "ending" a run that has nothing left under way.
          if (i === list.length - 1) { underWay = false; clearSlow(); }
          store.dispatch({ type: then, q: question, inputsKey: key, result });
        }
      } catch {
        if (live()) store.dispatch({ type: A.ANSWER_FAILED, q: question, inputsKey: key });
      } finally {
        if (mine === run) { underWay = false; clearSlow(); }
      }
    }

    /** The answer step's two passes, at the answer step's detail. */
    function start(key) {
      const detail = wantedDetail(store.getState(), question);
      return passes(key, { type: A.ANSWER_WORKING, q: question, inputsKey: key }, PASSES.map((futures, i) => ({
        futures, detail, then: i < PASSES.length - 1 ? A.ANSWER_FIRST : A.ANSWER_FINAL
      })));
    }

    /** An optional step's extra pass, at the step's detail. */
    function extend(key) {
      const detail = wantedDetail(store.getState(), question);
      return passes(key, { type: A.ANSWER_EXTEND, q: question, inputsKey: key }, [{ futures: EXTEND_FUTURES, detail, then: A.ANSWER_FINAL }]);
    }

    function check(state) {
      if (!needsRun(state, question)) { clearWait(); return; }
      const key = currentKey(state, question);
      const answer = state.answers[question];
      if (answer.inputsKey === key && answer.status === 'final') { clearWait(); extend(key); return; }   // nothing is being typed
      if (key === waitingFor) return;
      clearWait();
      if (answer.inputsKey === null) { start(key); return; }
      waitingFor = key;
      waitTimer = setTimeout(() => {
        waitTimer = null;
        waitingFor = null;
        const now = store.getState();
        if (!stopped && needsRun(now, question) && currentKey(now, question) === key) start(key);
      }, WAIT_MS);
    }

    function end() {
      clearWait();
      clearSlow();
      if (underWay) client.stop(question);
      underWay = false;
    }

    return { check, end };
  }

  const lanes = questions.map(lane);

  function check(state) {
    if (stopped) return;
    if (!opened && questions.includes(state.route.q)) {
      opened = true;
      client.init(state.env.today).then((ready) => noteHistory(ready && ready.historyEnd), (e) => { if (e && e.code === NO_WORKER) onPage = true; });
    }
    for (const l of lanes) l.check(state);
  }

  const unsubscribe = store.subscribe(check);
  check(store.getState());

  return () => {
    stopped = true;
    unsubscribe();
    for (const l of lanes) l.end();
  };
}
