/**
 * Main-thread side of the engine worker. `runInWorker(type, payload, onProgress)` resolves with the
 * worker's result; it rejects (so callers can fall back to the synchronous path) when workers are
 * unavailable or the worker itself fails. One worker is shared; jobs are matched by id.
 */
import { cloneSafe } from '../utils/cloneSafe.js';

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

export function workerAvailable() { return typeof Worker !== 'undefined'; }

export function runInWorker(type, payload, onProgress) {
  return new Promise((resolve, reject) => {
    let w;
    try { w = get(); } catch (e) { reject(e); return; }
    const id = ++seq;
    pending.set(id, { resolve, reject, onProgress });
    try { w.postMessage({ id, type, payload: cloneSafe(payload) }); } catch (e) { pending.delete(id); reject(e); }
  });
}
