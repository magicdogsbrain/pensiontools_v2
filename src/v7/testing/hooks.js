/**
 * The test hooks (V7 build brief 4.9) — window.__pt. Loaded by main.jsx ONLY when the build mode is 'test';
 * a browser test fails if `__pt` appears anywhere in the published output.
 *
 *   setState(state)                   draws any named state (dispatches state/replace)
 *   getState()                        a copy of the state
 *   setEnv({ today })                 pins the date, and tells the worker
 *   answer(q, inputs, env)            the answer function, called on the page itself (for the sameness test)
 *   parseDraft(q, values, env)        text as typed → checked inputs, by the page's own parseDraft
 *   answerInWorker(q, inputs, env)    the same through a worker
 *   writes()                          { [storageKey]: count } of session and local storage writes since load
 *   whenDone()                        a promise for data-ready="1"
 */
import { ANSWERS } from '../../answers/index.js';
import { A } from '../state/actions.js';
import { createWorkerClient } from '../effects/workerClient.js';
import { SCHEMAS } from '../state/select.js';
import { parseDraft } from '../../answers/shared/validate.js';

const copy = (v) => JSON.parse(JSON.stringify(v));

/** Count every storage write from now on. Call before anything else can write. */
export function countWrites(win = window) {
  const counts = {};
  const proto = win.Storage && win.Storage.prototype;
  if (!proto) return () => ({});
  for (const name of ['setItem', 'removeItem']) {
    const real = proto[name];
    proto[name] = function counted(key, ...rest) {
      counts[key] = (counts[key] || 0) + 1;
      return real.call(this, key, ...rest);
    };
  }
  const realClear = proto.clear;
  proto.clear = function counted() {
    counts['(clear)'] = (counts['(clear)'] || 0) + 1;
    return realClear.call(this);
  };
  return () => ({ ...counts });
}

/**
 * @param {object} o
 * @param {{ getState, dispatch }} o.store
 * @param {Element} o.root                 #app
 * @param {() => object} o.writes          from countWrites()
 * @param {() => object|null} [o.client]   the app's own worker client (to tell it a pinned date)
 */
export function installHooks({ store, root, writes, client = () => null, win = window }) {
  let own = null;                       // a worker of the hooks' own, so a test never ends the app's run
  const mine = () => (own ||= createWorkerClient());

  win.__pt = {
    setState(state) { store.dispatch({ type: A.STATE_REPLACE, state }); },
    getState() { return copy(store.getState()); },
    setEnv(patch) {
      store.dispatch({ type: A.ENV_SET, patch: copy(patch || {}) });
      const c = client();
      if (c && patch && patch.today) c.init(patch.today).catch(() => {});
    },
    answer(q, inputs, env) { return ANSWERS[q].answer(inputs, env); },
    parseDraft(q, values, env) { return parseDraft(SCHEMAS[q], values, env || store.getState().env); },
    answerInWorker(q, inputs, env) { return mine().answer(q, inputs, env); },
    writes,
    whenDone() {
      if (root.getAttribute('data-ready') === '1') return Promise.resolve();
      return new Promise((resolve) => root.addEventListener('pt:done', () => resolve(), { once: true }));
    }
  };
  return win.__pt;
}
