/**
 * The view PensionTools opens in (7.11.0; research/v7/replan-nov-2026.md §8): the simple view (this page) or the full view
 * (the classic page). The choice is the account's — users/{uid}/profile/settings `view`, read into ui.profile and written
 * by the account effect's one settings write, from Your account. 7.11.1: someone signed in whose account holds no choice
 * opens in the full view (services/ViewChoice.js openingView); only the choice of the simple view keeps the simple view.
 * Nothing is written to the account for someone who never chose. This file keeps this browser's copy of it.
 *
 *   VIEW_KEY    localStorage 'pt_view': 'full' while the person signed in here opens in the full view (chosen, or no choice
 *               stored), so the site's root can open it before anything is drawn; nothing otherwise. Set and removed only
 *               when it differs. Set only for someone signed in here, once their settings are read.
 *   ASKED_KEY   localStorage 'pt_view_asked': the "Not now" of the strip that asked whether to open in the full view from now
 *               on (7.11.0). 7.11.1 retired the strip — the full view is the default — so nothing sets it; a browser that
 *               holds one has it removed when nobody is signed in, with the other notes.
 *   Both go when nobody is signed in here (as the signed-in note does, effects/place.js), and the account's deletion clears
 *   all of this browser's storage (effects/account.js).
 *
 *   fullViewForward(loc, local, layout)   the full view's address when the root, opened with no address of its own in a
 *                                         browser where someone is signed in who opens in the full view, should go there at
 *                                         once; else null
 *   startView(store, { local }) → stop()
 */
import { A } from '../state/actions.js';
import { LAYOUT } from '../../appLayout.js';
import { hasSignedInHint } from './place.js';
import { openingView } from '../../services/ViewChoice.js';

export const VIEW_KEY = 'pt_view';
export const ASKED_KEY = 'pt_view_asked';

const get = (local, key) => { try { return local ? local.getItem(key) : null; } catch { return null; } };

export function fullViewForward(loc, local, layout = LAYOUT) {
  const hash = loc && typeof loc.hash === 'string' ? loc.hash : '';
  const search = loc && typeof loc.search === 'string' ? loc.search : '';
  if ((hash !== '' && hash !== '#') || search) return null;
  if (!hasSignedInHint(local)) return null;
  if (get(local, VIEW_KEY) !== 'full') return null;
  return layout.v7.classic;
}

/**
 * @param {{ getState, dispatch, subscribe }} store
 * @param {object} o
 * @param {Storage|null} [o.local]     localStorage (this browser's copy)
 */
export function startView(store, { local = null } = {}) {
  const set = (key, value) => { try { if (local && local.getItem(key) !== value) local.setItem(key, value); } catch { /* private mode */ } };
  const remove = (key) => { try { if (local && local.getItem(key) !== null) local.removeItem(key); } catch { /* private mode */ } };
  const copy = (view) => { if (view === 'full') set(VIEW_KEY, 'full'); else remove(VIEW_KEY); };

  const off = store.subscribe((state, action) => {
    if (action.type === A.VIEW_SET) { if (state.ui.profile) copy(state.ui.profile.view); return; }
    // the account's settings read: the copy follows the view they open in (7.11.1: no choice is the full view); a read that
    // failed leaves it as it was
    if (action.type === A.PROFILE_SET) { if (action.read !== false && state.ui.profile) copy(openingView(state.ui.profile)); return; }
    if (action.type === A.SESSION_SET) { if (state.session.kind === 'nobody') { remove(VIEW_KEY); remove(ASKED_KEY); } return; }
  });

  return () => { off(); };
}
