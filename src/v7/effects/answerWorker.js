/**
 * The V7 worker (V7 build brief 4.10). Its own file and its own bundle: the current app's engineWorker.js is not
 * touched. It reads no live gilt or share prices and no clock — the date arrives as an input.
 *
 *   page → worker                                   worker → page
 *   { id, type: 'init', today }                     { id, ready: true, historyEnd, engineVersion }
 *   { id, type: 'answer', q: 'c', inputs, env }     { id, progress: { done, total } } …  then  { id, result }  or  { id, error }
 *   { id, type: 'lasts', plan, env: { today } }     the same shape: a saved plan's one test (answers/plan/lastsRun.js, loaded lazily)
 *   { id, type: 'document', plan, env: { today, essentials } }
 *                                                   the same shape: the run a plan document is built from on a lock or a new
 *                                                   version (lastsRun.js runForDocument, the same lazy chunk; road-to-7.md step 6)
 *   { id, type: 'lever', plan, env: { today, lever } }
 *                                                   the same shape: one of the three levers of "Will it last?" on a saved plan
 *                                                   (lastsRun.js runLever, the same lazy chunk; road-to-7.md step 7)
 *   { id, type: 'ways', plan, env: { today } }      the same shape: the nine ways of drawing on a saved plan (waysRun.js runWays,
 *                                                   loaded lazily beside lastsRun.js; way-and-mix.md 2)
 *   { id, type: 'way', plan, env: { today, way: { id, dials } } }
 *                                                   the same shape: one way tried on its dials (waysRun.js runWay)
 *
 * env = { today, futures, seed, trace: false }. If a message carries no date, the one given at `init` is used.
 * createHandler() is the whole of the logic, so the tests drive the real handler without a Worker.
 *
 * The last result of each question stays in the worker and is offered to that question's next answer as `env.reuse`
 * (unless the message brings its own). An answer takes what it can of it after checking it is for the same inputs and
 * the same lives, or ignores it: question A's every-age step takes the rows its answer step has just worked out (step 4
 * brief 10, J17); C and B ignore it. It never leaves the worker, and it changes no figure — only how long it takes.
 */
import { ANSWERS } from '../../answers/index.js';
import { VERSION } from '../../constants.js';
import { cloneSafe } from '../../utils/cloneSafe.js';

const PROGRESS_STEPS = 20;     // at most this many progress messages per answer (plus the last)

/** The last month of bundled market history, if the answers say (it is also in every result's `basis`). */
function historyEndOf(answers) {
  for (const entry of Object.values(answers)) {
    const h = entry && entry.historyEnd;
    const value = typeof h === 'function' ? h() : h;
    if (typeof value === 'string') return value;
  }
  return null;
}

/**
 * "Does it last?" (research/v7/editing-in-v7.md 10.4): the one test of a saved plan, through the planner's own functions.
 * Loaded LAZILY, so the strategy registry, the nine strategies, the market history and the gilt data reach the worker
 * only when a plan's "Does it last?" is opened; the worker's own chunk carries none of it. `loadLasts` is the one place the
 * lazy module is imported from V7 (the tests hand in a fake to drive the handler without it).
 */
const loadLasts = () => import('../../answers/plan/lastsRun.js');
/** "How the money is taken" (way-and-mix.md 2.2): the nine ways, loaded lazily beside the one test (the same engine, one more door). */
const loadWays = () => import('../../answers/plan/waysRun.js');

export function createHandler(answers = ANSWERS, { lasts = null, document = null, lever = null, ways = null, way = null } = {}) {
  let today = null;
  const last = new Map();      // question → its last result (offered to its next answer as env.reuse)
  /** `lasts`, `document`, `lever`, `ways` and `way` share the lazy engine: the one test, or the run the plan document is built from, or the nine ways. */
  const runLazy = async (msg, post, id, which) => {
    const env = { ...(msg.env || {}) };
    if (!env.today && today) env.today = today;
    let lastStep = -1;
    const onProgress = (done, total) => {
      const step = total > 0 ? Math.floor((done * PROGRESS_STEPS) / total) : 0;
      if (step === lastStep) return;
      lastStep = step;
      post({ id, progress: { done, total } });
    };
    const fn = which === 'document' ? (document || (await loadLasts()).runForDocument) : which === 'lever' ? (lever || (await loadLasts()).runLever)
      : which === 'ways' ? (ways || (await loadWays()).runWays) : which === 'way' ? (way || (await loadWays()).runWay) : (lasts || (await loadLasts()).runLasts);
    const result = which === 'document' ? fn(msg.plan, { today: env.today, essentials: env.essentials, onProgress })
      : which === 'lever' ? fn(msg.plan, { today: env.today, lever: env.lever, onProgress })
        : which === 'way' ? fn(msg.plan, { today: env.today, id: env.way.id, dials: env.way.dials, onProgress })
          : fn(msg.plan, { today: env.today, onProgress });
    post({ id, result: cloneSafe(result) });
  };
  const runLasts = (msg, post, id) => runLazy(msg, post, id, 'lasts');
  return function handle(msg, post) {
    const id = msg && msg.id;
    try {
      if (!msg || typeof msg !== 'object') throw new Error('not a message');
      if (msg.type === 'init') {
        today = msg.today;
        post({ id, ready: true, historyEnd: historyEndOf(answers), engineVersion: VERSION });
        return;
      }
      if (msg.type === 'lasts') {
        if (!msg.plan || typeof msg.plan !== 'object') throw new Error('lasts: no plan');
        runLasts(msg, post, id).catch((e) => post({ id, error: String((e && e.message) || e) }));
        return;
      }
      if (msg.type === 'document') {
        if (!msg.plan || typeof msg.plan !== 'object') throw new Error('document: no plan');
        runLazy(msg, post, id, 'document').catch((e) => post({ id, error: String((e && e.message) || e) }));
        return;
      }
      if (msg.type === 'lever') {
        if (!msg.plan || typeof msg.plan !== 'object') throw new Error('lever: no plan');
        if (!msg.env || !msg.env.lever || typeof msg.env.lever !== 'object') throw new Error('lever: no lever');
        runLazy(msg, post, id, 'lever').catch((e) => post({ id, error: String((e && e.message) || e) }));
        return;
      }
      if (msg.type === 'ways') {
        if (!msg.plan || typeof msg.plan !== 'object') throw new Error('ways: no plan');
        runLazy(msg, post, id, 'ways').catch((e) => post({ id, error: String((e && e.message) || e) }));
        return;
      }
      if (msg.type === 'way') {
        if (!msg.plan || typeof msg.plan !== 'object') throw new Error('way: no plan');
        if (!msg.env || !msg.env.way || typeof msg.env.way !== 'object' || typeof msg.env.way.id !== 'string') throw new Error('way: no way');
        runLazy(msg, post, id, 'way').catch((e) => post({ id, error: String((e && e.message) || e) }));
        return;
      }
      if (msg.type === 'answer') {
        const entry = answers[msg.q];
        if (!entry || typeof entry.answer !== 'function') throw new Error(`no answer for question "${msg.q}"`);
        const env = { ...(msg.env || {}) };
        if (!env.today && today) env.today = today;
        if (!('reuse' in env) && last.has(msg.q)) env.reuse = last.get(msg.q);
        let lastStep = -1;
        env.onProgress = (done, total) => {
          const step = total > 0 ? Math.floor((done * PROGRESS_STEPS) / total) : 0;
          if (step === lastStep) return;
          lastStep = step;
          post({ id, progress: { done, total } });
        };
        const result = entry.answer(msg.inputs, env);
        if (result && typeof result === 'object' && result.status !== 'invalid') last.set(msg.q, result);
        post({ id, result: cloneSafe(result) });
        return;
      }
      throw new Error(`unknown message "${msg.type}"`);
    } catch (e) {
      post({ id, error: String((e && e.message) || e) });
    }
  };
}

// Inside a real worker: listen. (Imported by a test or by the page, this does nothing.)
const scope = typeof self !== 'undefined' ? self : null;
if (scope && typeof WorkerGlobalScope !== 'undefined' && scope instanceof WorkerGlobalScope) {
  const handle = createHandler();
  scope.onmessage = (e) => handle(e.data, (m) => scope.postMessage(m));
}
