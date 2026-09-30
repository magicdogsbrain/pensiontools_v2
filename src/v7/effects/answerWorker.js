/**
 * The V7 worker (V7 build brief 4.10). Its own file and its own bundle: the current app's engineWorker.js is not
 * touched. It reads no live gilt or share prices and no clock — the date arrives as an input.
 *
 *   page → worker                                   worker → page
 *   { id, type: 'init', today }                     { id, ready: true, historyEnd, engineVersion }
 *   { id, type: 'answer', q: 'c', inputs, env }     { id, progress: { done, total } } …  then  { id, result }  or  { id, error }
 *
 * env = { today, futures, seed, trace: false }. If a message carries no date, the one given at `init` is used.
 * createHandler() is the whole of the logic, so the tests drive the real handler without a Worker.
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

export function createHandler(answers = ANSWERS) {
  let today = null;
  return function handle(msg, post) {
    const id = msg && msg.id;
    try {
      if (!msg || typeof msg !== 'object') throw new Error('not a message');
      if (msg.type === 'init') {
        today = msg.today;
        post({ id, ready: true, historyEnd: historyEndOf(answers), engineVersion: VERSION });
        return;
      }
      if (msg.type === 'answer') {
        const entry = answers[msg.q];
        if (!entry || typeof entry.answer !== 'function') throw new Error(`no answer for question "${msg.q}"`);
        const env = { ...(msg.env || {}) };
        if (!env.today && today) env.today = today;
        let lastStep = -1;
        env.onProgress = (done, total) => {
          const step = total > 0 ? Math.floor((done * PROGRESS_STEPS) / total) : 0;
          if (step === lastStep) return;
          lastStep = step;
          post({ id, progress: { done, total } });
        };
        post({ id, result: cloneSafe(entry.answer(msg.inputs, env)) });
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
