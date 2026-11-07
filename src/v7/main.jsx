/**
 * V7 start-up: make the state (the date from the clock, the draft this tab kept), draw App from it after every
 * change, and start the effects. Everything that touches the outside is in effects/; screens work out nothing.
 */
import { render } from 'preact';
import { App } from './App.jsx';
import { initialState } from './state/initial.js';
import { reduce } from './state/reduce.js';
import { A } from './state/actions.js';
import { parse } from './router/routes.js';
import { createStore } from './effects/store.js';
import { today } from './effects/clock.js';
import { loadDraft, sessionStore, localStore } from './effects/draftStore.js';
import { hasSignedInHint } from './effects/place.js';
import { startEffects, markReady } from './effects/index.js';
import { classicQueryForward } from './effects/address.js';

const TEST_BUILD = import.meta.env.MODE === 'test';

async function start() {
  const root = document.getElementById('app');

  // Nothing registers a service worker any more, but a browser may still hold an old one from before the kill switch
  // (public/sw.js; research/v7/switch-readiness.md §3), which since 7.0 serves this page at the site's root. Updating it
  // fetches the kill switch, which clears the old caches and lets go in every tab; only one that cannot update is let go here.
  try { navigator.serviceWorker?.getRegistrations?.().then((rs) => rs.forEach((r) => r.update().catch(() => r.unregister()))).catch(() => {}); } catch (e) { /* no service workers in this browser */ }

  // A link made for the classic page when it was the site's root (?demo=, ?signup=1, ?signin=1) goes on to it, before
  // anything is drawn here (effects/address.js).
  const forward = classicQueryForward(window.location);
  if (forward) { window.location.replace(forward); return; }

  // Test build only: the hooks (window.__pt). Loaded first, so every storage write is counted.
  const hooks = TEST_BUILD ? await import('./testing/hooks.js') : null;
  const writes = hooks ? hooks.countWrites(window) : null;

  const store = createStore(
    initialState({ today: today(), build: TEST_BUILD ? 'test' : 'prod', draft: loadDraft(sessionStore(window)) }),
    reduce
  );
  // The route is in the state before the first draw, so the page is never marked ready for the wrong screen.
  store.dispatch({ type: A.ROUTE_SET, route: parse(window.location.hash) });
  // … and the note that someone is signed in here, so the front door's first draw waits for the session rather than drawing
  // the stranger's door it would swap a moment later (state/select.js frontWaiting)
  if (hasSignedInHint(localStore(window))) store.dispatch({ type: A.ENV_SET, patch: { signedInHint: true } });

  const dispatch = (action) => store.dispatch(action);
  const draw = (state) => {
    render(<App state={state} dispatch={dispatch} />, root);
    markReady(root, state);
  };
  store.subscribe(draw);
  // a question's first answer let go by its least time on the ring (components/Spinner.jsx HeldAnswer): mark the page again
  root.addEventListener('pt:held', () => markReady(root, store.getState()));

  let effects = null;
  if (hooks) hooks.installHooks({ store, root, writes, client: () => effects && effects.client });

  draw(store.getState());
  effects = startEffects(store, { win: window });
}

start();
