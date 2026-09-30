/**
 * State in, page out. Picks the screen the route names and draws it inside the one Shell (so the frame, and the
 * keyboard focus it manages, persist from screen to screen). No arithmetic, no state of its own.
 */
import { Shell } from './components/index.js';
import { SCREENS } from './screens/index.js';
import { screenName } from './router/routes.js';

export function App({ state, dispatch }) {
  const name = screenName(state.route);
  const screen = SCREENS[name] || SCREENS.front;
  const { question = null, rail = false, full = false, content } = screen(state, dispatch);
  return (
    <Shell state={state} dispatch={dispatch} name={name} question={question} rail={rail} full={full}>
      {content}
    </Shell>
  );
}
