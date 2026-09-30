/**
 * The page's side of the V7 worker (V7 build brief 4.10). Pairs each reply with its request.
 *
 *   createWorkerClient({ makeWorker }) → {
 *     init(today)                              → Promise<{ historyEnd, engineVersion }>
 *     answer(q, inputs, env, onProgress)       → Promise<AnswerC>      env = { today, futures, seed, trace }
 *     stop()                                   ends the worker if an answer is under way; that answer rejects
 *                                              with code 'stopped'. The next call starts a fresh worker, which
 *                                              is told the date again.
 *     available()                              → false once it is known that no worker can start
 *   }
 *
 * When no worker can start (none in this browser, the constructor throws, or it fails before it was ever ready)
 * every call rejects with code NO_WORKER, and the runner works the answer out on the page instead.
 * Payloads go through cloneSafe, so a function never reaches postMessage.
 */
import { cloneSafe } from '../../utils/cloneSafe.js';

export const NO_WORKER = 'no-worker';

const coded = (message, code) => Object.assign(new Error(message), { code });

function defaultMakeWorker() {
  if (typeof Worker === 'undefined') return null;
  return new Worker(new URL('./answerWorker.js', import.meta.url), { type: 'module' });
}

export function createWorkerClient({ makeWorker = defaultMakeWorker } = {}) {
  let worker = null;
  let broken = false;          // no worker can start: stop trying
  let everReady = false;       // some worker has answered `init`
  let today = null;
  let nextId = 1;
  const pending = new Map();   // id → { kind: 'init' | 'answer', resolve, reject, onProgress }

  function rejectAll(error, kind) {
    for (const [id, entry] of [...pending]) {
      if (kind && entry.kind !== kind) continue;
      pending.delete(id);
      entry.reject(error);
    }
  }

  function drop() {
    const w = worker;
    worker = null;
    if (!w) return;
    w.onmessage = null;
    w.onerror = null;
    try { w.terminate(); } catch { /* already gone */ }
  }

  function onMessage(data) {
    if (!data || typeof data !== 'object') return;
    if (data.ready) {
      everReady = true;
      // Any `init` still waiting is answered by any worker that is ready (a stopped worker's init is re-sent).
      for (const [id, entry] of [...pending]) {
        if (entry.kind !== 'init') continue;
        pending.delete(id);
        entry.resolve({ historyEnd: data.historyEnd ?? null, engineVersion: data.engineVersion ?? null });
      }
      return;
    }
    const entry = pending.get(data.id);
    if (!entry) return;                                   // a reply nobody is waiting for
    if (data.progress) {
      if (entry.onProgress) entry.onProgress(data.progress.done, data.progress.total);
      return;
    }
    pending.delete(data.id);
    if ('error' in data) entry.reject(coded(String(data.error), 'worker-error'));
    else entry.resolve(data.result);
  }

  function onError(event) {
    if (event && typeof event.preventDefault === 'function') event.preventDefault();
    drop();
    if (!everReady) {
      broken = true;
      rejectAll(coded('no worker could start', NO_WORKER));
    } else {
      rejectAll(coded('the worker failed', 'worker-error'));
    }
  }

  function ensure() {
    if (broken) return null;
    if (worker) return worker;
    try { worker = makeWorker(); } catch { worker = null; }
    if (!worker) { broken = true; return null; }
    worker.onmessage = (e) => onMessage(e.data);
    worker.onerror = onError;
    worker.onmessageerror = onError;
    if (today) post({ id: nextId++, type: 'init', today });
    return worker;
  }

  function post(msg) {
    try {
      worker.postMessage(msg);
      return true;
    } catch {
      return false;
    }
  }

  return {
    available: () => !broken,

    init(date) {
      const fresh = !worker;
      today = date;
      if (!ensure()) return Promise.reject(coded('no worker could start', NO_WORKER));
      return new Promise((resolve, reject) => {
        pending.set(nextId++, { kind: 'init', resolve, reject });
        // A worker made just now has already been sent the date by ensure().
        if (!fresh && !post({ id: nextId++, type: 'init', today })) onError();
      });
    },

    answer(q, inputs, env, onProgress) {
      if (!ensure()) return Promise.reject(coded('no worker could start', NO_WORKER));
      return new Promise((resolve, reject) => {
        const id = nextId++;
        pending.set(id, { kind: 'answer', resolve, reject, onProgress });
        if (!post({ id, type: 'answer', q, inputs: cloneSafe(inputs), env: cloneSafe(env) })) {
          pending.delete(id);
          reject(coded('the worker could not be reached', 'worker-error'));
        }
      });
    },

    stop() {
      if (![...pending.values()].some((e) => e.kind === 'answer')) return;   // nothing under way: keep it ready
      drop();
      rejectAll(coded('stopped', 'stopped'), 'answer');
      if ([...pending.values()].some((e) => e.kind === 'init')) ensure();      // someone still waits to hear "ready"
    }
  };
}
