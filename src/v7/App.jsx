/**
 * STUB (V7 package 1) — package 4 replaces this with the real screens.
 * State in, page out: draws <main data-screen="…"> with the screen's name, and nothing else.
 */
import { screenName } from './router/routes.js';

export function App({ state, dispatch }) {   // eslint-disable-line no-unused-vars
  const name = screenName(state.route);
  return (
    <main data-screen={name} data-question={state.route.q === 'c' ? 'c' : null}>
      <h1>PensionTools preview</h1>
      <p>Screen: {name}</p>
    </main>
  );
}
