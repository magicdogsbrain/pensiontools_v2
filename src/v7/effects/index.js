/**
 * The effects — the only code in V7 that touches the outside (address, worker, session storage, the plan seed in
 * local storage, the page's own attributes). startEffects(store, …) starts them all; main.jsx calls it once.
 *
 *   startEffects(store, { win, client, local }) → { client, stop }
 *   markReady(root, state)      sets #app's data-ready and data-answer, and fires pt:done (brief 4.9)
 */
import { A } from '../state/actions.js';
import { readyMark } from '../state/select.js';
import { startAddress } from './address.js';
import { startDraftStore, sessionStore } from './draftStore.js';
import { startRunner } from './run.js';
import { createWorkerClient } from './workerClient.js';
import { startPlanSeed, localStore } from './planSeed.js';

/**
 * The answer worked out on the page itself — used only when no worker can start. The answers (and the engines
 * behind them) are fetched only then, so the shell stays small; the worker has its own copy.
 */
export async function answerOnPage(q, inputs, env) {
  const { ANSWERS } = await import('../../answers/index.js');
  return ANSWERS[q].answer(inputs, env);
}

/**
 * #app carries data-ready="1" only when no run is under way and any answer shown is final, else "0"; and
 * data-answer="none" | "first" | "final". A pt:done event (bubbling) is sent each time data-ready becomes "1".
 * Call it after the screen has been drawn for `state`.
 */
export function markReady(root, state) {
  const { ready, answer } = readyMark(state);
  const was = root.getAttribute('data-ready');
  if (root.getAttribute('data-answer') !== answer) root.setAttribute('data-answer', answer);
  if (was !== ready) root.setAttribute('data-ready', ready);
  if (ready === '1' && was !== '1') root.dispatchEvent(new CustomEvent('pt:done', { bubbles: true }));
}

export function startEffects(store, { win = window, client = createWorkerClient(), local = answerOnPage } = {}) {
  const stops = [];
  stops.push(startAddress(store, win));
  stops.push(startDraftStore(store, sessionStore(win)));
  stops.push(startRunner({ store, client, local }));
  // "Save this as a plan": the seed in localStorage, then today's planner in this tab (save-as-plan.md Contract C.2)
  stops.push(startPlanSeed(store, {
    storage: localStore(win),
    session: sessionStore(win),
    go: (address) => win.location.assign(address),
    onShow: (fn) => {
      const shown = (e) => { if (e && e.persisted) fn(); };
      win.addEventListener('pageshow', shown);
      return () => win.removeEventListener('pageshow', shown);
    }
  }));

  const online = () => store.dispatch({ type: A.UI_ONLINE, online: true });
  const offline = () => store.dispatch({ type: A.UI_ONLINE, online: false });
  win.addEventListener('online', online);
  win.addEventListener('offline', offline);
  if (win.navigator && win.navigator.onLine === false) offline();
  stops.push(() => { win.removeEventListener('online', online); win.removeEventListener('offline', offline); });

  return { client, stop: () => stops.splice(0).forEach((fn) => fn()) };
}
