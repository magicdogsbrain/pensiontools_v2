/**
 * Main-thread side of the engine worker. `runInWorker(type, payload, onProgress)` resolves with the
 * worker's result; it rejects (so callers can fall back to the synchronous path) when workers are
 * unavailable or the worker itself fails. One worker is shared; jobs are matched by id.
 */
import { cloneSafe } from '../utils/cloneSafe.js';
import { trackBusy } from '../reading/busy.js';
import { todayOf } from '../reading/clock.js';
import { marketFolderOf } from '../reading/marketPlain.js';
import { LAYOUT } from '../appLayout.js';

/** The site's one data folder, as this page's address resolves it (src/reading/market.js): handed to the worker with every job. */
const folder = () => (typeof document !== 'undefined' ? marketFolderOf(document.baseURI, LAYOUT.classic.data) : null);

let worker = null;
let seq = 0;
const pending = new Map();

function get() {
  if (worker) return worker;
  if (typeof Worker === 'undefined') throw new Error('no Worker');
  worker = new Worker(new URL('./engineWorker.js', import.meta.url), { type: 'module' });
  worker.onmessage = (e) => {
    const { id, progress, result, error } = e.data || {};
    const job = pending.get(id);
    if (!job) return;
    if (progress) { try { job.onProgress && job.onProgress(progress); } catch (err) { /* cosmetic */ } return; }
    pending.delete(id);
    if (error) job.reject(new Error(error)); else job.resolve(result);
  };
  worker.onerror = (e) => {
    const err = new Error('engine worker failed: ' + (e && e.message ? e.message : 'unknown'));
    for (const job of pending.values()) job.reject(err);
    pending.clear();
    try { worker.terminate(); } catch (x) { /* already gone */ }
    worker = null;
  };
  return worker;
}

/**
 * What a job carries across to the worker: the payload as given, plus the one clock (src/reading/clock.js) when it names no
 * day, and the site's one data folder; through cloneSafe (a Date stays a Date). The worker sees the plan from the page's day.
 */
export function jobPayload(payload) {
  const withNow = payload && typeof payload === 'object' ? { ...payload, ...(payload.now == null ? { now: todayOf().toISOString() } : {}), ...(payload.market == null ? { market: folder() } : {}) } : payload;
  return cloneSafe(withNow);
}

export function workerAvailable() { return typeof Worker !== 'undefined'; }

export function runInWorker(type, payload, onProgress) {
  // the page carries data-busy while a job is in flight (src/reading/busy.js), so a sweep waits for its figures
  return trackBusy(new Promise((resolve, reject) => {
    let w;
    try { w = get(); } catch (e) { reject(e); return; }
    const id = ++seq;
    pending.set(id, { resolve, reject, onProgress });
    try { w.postMessage({ id, type, payload: jobPayload(payload) }); } catch (e) { pending.delete(id); reject(e); }
  }), 'worker');
}
