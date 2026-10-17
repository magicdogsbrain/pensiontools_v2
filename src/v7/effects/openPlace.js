/**
 * "Change this": the hand-over to the planner (research/v7/your-plan.md 1.4, 5.2). When the state says a person is
 * leaving (ui.leaving, from plan/change), this effect writes ONE request to this window's session storage — the plan's
 * id, the place and the way back; no figures, no name — and opens the planner in the same window. The sign-in place
 * opens the planner's own sign-in door (`?signin=1`), with the request left so the planner can say "Back to your plans".
 * If the browser refuses storage, nothing is opened and the screen says so (plan/changeFailed).
 *
 *   PLANNER                       '../' — the planner, from /v7/
 *   startOpenPlace(store, { session, now, go }) → stop()
 */
import { A } from '../state/actions.js';
import { OPEN_PLACE_KEY, makeRequest } from '../../services/OpenPlace.js';

export const PLANNER = '../';
export const SIGN_IN_DOOR = '../?signin=1';

export function startOpenPlace(store, { session, now = () => new Date(), go }) {
  return store.subscribe((state, action, previous) => {
    if (action.type !== A.PLAN_CHANGE) return;
    const leaving = state.ui.leaving;
    if (!leaving || leaving === previous.ui.leaving) return;
    const text = makeRequest({ planId: leaving.planId, place: leaving.place, back: leaving.back, at: now().toISOString() });
    let written = false;
    try {
      if (text && session) { session.setItem(OPEN_PLACE_KEY, text); written = session.getItem(OPEN_PLACE_KEY) === text; }
    } catch { written = false; }
    if (!written) { store.dispatch({ type: A.PLAN_CHANGE_FAILED }); return; }
    Promise.resolve().then(() => go(leaving.place === 'signin' ? SIGN_IN_DOOR : PLANNER));
  });
}
