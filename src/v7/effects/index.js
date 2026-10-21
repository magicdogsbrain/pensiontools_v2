/**
 * The effects — the only code in V7 that touches the outside (address, worker, session storage, the activity stamp in
 * local storage, the page's own attributes). startEffects(store, …) starts them all; main.jsx calls it once.
 *
 *   startEffects(store, { win, client, local }) → { client, stop }
 *   markReady(root, state)      sets #app's data-ready and data-answer, and fires pt:done (brief 4.9)
 */
import { A } from '../state/actions.js';
import { readyMark } from '../state/select.js';
import { startAddress } from './address.js';
import { startDraftStore, sessionStore, localStore } from './draftStore.js';
import { startRunner } from './run.js';
import { startLastsRunner } from './lasts.js';
import { createWorkerClient } from './workerClient.js';
import { startActivity } from './activity.js';
import { startOpenPlace } from './openPlace.js';

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
  // "Does it last?" (research/v7/editing-in-v7.md 10.4): a saved plan's one test, in the worker only, on that step only —
  // no page fallback, so the engine's chunk is the worker's alone and the plan pages' own chunk does not carry it
  stops.push(startLastsRunner({ store, client }));

  // The saved plans (research/v7/your-plan.md 4.1, 4.3): activity for the planner's idle sign-out on every page; the
  // hand-over to the planner; and the plan source — the one Firebase file, with the one write file — loaded only where
  // the plans are needed: the plan pages, "Keep this as a plan?" (road-to-7.md step 7: the preview makes the plan itself,
  // so a keep under way loads it too) and "Will it last?" (answer-D.md: a plan in the account is D's way in).
  stops.push(startActivity(win, { storage: localStore(win) }));
  stops.push(startOpenPlace(store, { session: sessionStore(win), go: (address) => win.location.assign(address) }));
  let planSource = null;
  const onPlanPage = (state) => state.route && (state.route.screen === 'plans' || state.route.screen === 'plan');
  const onKeepPage = (state) => state.route && state.route.screen === 'step' && (state.route.step === 'keep' || state.route.q === 'd');
  const keeping = (state) => !!state.keep && Object.values(state.keep).some((k) => k && k.saving);
  const needsPlans = (state) => onPlanPage(state) || onKeepPage(state) || keeping(state);
  const loadPlanSource = (state) => {
    if (planSource || !needsPlans(state)) return;
    planSource = import('./planSource.js')
      // the worker client goes with it: the lock's write runs the plan's own test in the worker first (road-to-7.md step 6)
      .then((m) => { const stop = m.startPlanSource(store, { win, local: localStore(win), session: sessionStore(win), client }); stops.push(stop); return stop; })
      .catch(() => { store.dispatch({ type: A.PLANS_FAILED }); return () => {}; });
  };
  loadPlanSource(store.getState());
  stops.push(store.subscribe(loadPlanSource));

  const online = () => store.dispatch({ type: A.UI_ONLINE, online: true });
  const offline = () => store.dispatch({ type: A.UI_ONLINE, online: false });
  win.addEventListener('online', online);
  win.addEventListener('offline', offline);
  if (win.navigator && win.navigator.onLine === false) offline();
  stops.push(() => { win.removeEventListener('online', online); win.removeEventListener('offline', offline); });

  return { client, stop: () => stops.splice(0).forEach((fn) => fn()) };
}
