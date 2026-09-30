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
import { loadDraft, sessionStore } from './effects/draftStore.js';
import { startEffects, markReady } from './effects/index.js';

const TEST_BUILD = import.meta.env.MODE === 'test';

async function start() {
  const root = document.getElementById('app');

  // Test build only: the hooks (window.__pt). Loaded first, so every storage write is counted.
  const hooks = TEST_BUILD ? await import('./testing/hooks.js') : null;
  const writes = hooks ? hooks.countWrites(window) : null;

  const store = createStore(
    initialState({ today: today(), build: TEST_BUILD ? 'test' : 'prod', draft: loadDraft(sessionStore(window)) }),
    reduce
  );
  // The route is in the state before the first draw, so the page is never marked ready for the wrong screen.
  store.dispatch({ type: A.ROUTE_SET, route: parse(window.location.hash) });

  const dispatch = (action) => store.dispatch(action);
  const draw = (state) => {
    render(<App state={state} dispatch={dispatch} />, root);
    markReady(root, state);
  };
  store.subscribe(draw);

  let effects = null;
  if (hooks) hooks.installHooks({ store, root, writes, client: () => effects && effects.client });

  draw(store.getState());
  effects = startEffects(store, { win: window });
}

start();
