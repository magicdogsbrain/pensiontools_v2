/**
 * "Change this": the hand-over to the planner (research/v7/your-plan.md 1.4, 5.2). When the state says a person is
 * leaving (ui.leaving, from plan/change), this effect writes ONE request to this window's session storage — the plan's
 * id, the place, the way back and, from the month step's button, the month to record; no figures, no name — and opens
 * the planner in the same window. The sign-in place opens the planner's own sign-in door (`?signin=1`), with the request
 * left so the planner can say "Back to your plans". If the browser refuses storage, nothing is opened and the screen says
 * so (plan/changeFailed).
 *
 *   PLANNER                       the classic planner, from V7's page (src/appLayout.js: './classic/' at 7.0)
 *   SIGN_IN_DOOR                  the planner's own sign-in door, beside it
 *   startOpenPlace(store, { session, now, go }) → stop()
 */
import { A } from '../state/actions.js';
import { OPEN_PLACE_KEY, makeRequest } from '../../services/OpenPlace.js';
import { LAYOUT } from '../../appLayout.js';

export const PLANNER = LAYOUT.v7.classic;
export const SIGN_IN_DOOR = PLANNER + '?signin=1';

export function startOpenPlace(store, { session, now = () => new Date(), go }) {
  // (wrap-up) a box left as the link is pressed starts its save (plan/save, auto): the planner opens only once that save,
  // and one queued behind it, has landed — the page leaving earlier lost what was typed. A save that failed keeps the
  // person here, where the page says why; nothing is left in the window.
  const busy = (st) => !!(st.ui.saving || st.ui.saveAgain);
  let waitingFor = null;
  const leave = (state, leaving) => {
    const text = makeRequest({ planId: leaving.planId, place: leaving.place, back: leaving.back, at: now().toISOString(), month: leaving.month || null });
    let written = false;
    try {
      if (text && session) { session.setItem(OPEN_PLACE_KEY, text); written = session.getItem(OPEN_PLACE_KEY) === text; }
    } catch { written = false; }
    if (!written) { store.dispatch({ type: A.PLAN_CHANGE_FAILED }); return; }
    Promise.resolve().then(() => go(leaving.place === 'signin' ? SIGN_IN_DOOR : PLANNER));
  };
  return store.subscribe((state, action, previous) => {
    if (waitingFor && action.type !== A.PLAN_CHANGE) {
      if (state.ui.leaving !== waitingFor) { waitingFor = null; return; }
      if (busy(state)) return;
      const leaving = waitingFor;
      waitingFor = null;
      if (state.ui.saveProblem) return;
      leave(state, leaving);
      return;
    }
    if (action.type !== A.PLAN_CHANGE) return;
    const leaving = state.ui.leaving;
    if (!leaving || leaving === previous.ui.leaving) return;
    if (busy(state)) { waitingFor = leaving; return; }
    waitingFor = null;
    leave(state, leaving);
  });
}
