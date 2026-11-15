/**
 * The view PensionTools opens in (7.11.0; research/v7/replan-nov-2026.md §8): the simple view (this page) or the full view
 * (the classic page). The choice is the account's — users/{uid}/profile/settings `view`, read into ui.profile and written
 * by the account effect's one settings write, from Your account or the strip — and absent means the simple view. This
 * file keeps this browser's copy of it, and offers the strip.
 *
 *   VIEW_KEY    localStorage 'pt_view': 'full' while the person signed in here chose the full view, so the site's root can
 *               open it before anything is drawn; nothing otherwise. Set and removed only when it differs from the account's.
 *   ASKED_KEY   localStorage 'pt_view_asked': '1' once "Not now" was pressed on the strip in this browser.
 *   Both go when nobody is signed in here (as the signed-in note does, effects/place.js), and the account's deletion clears
 *   all of this browser's storage (effects/account.js).
 *
 *   fullViewForward(loc, local, layout)   the full view's address when the root, opened with no address of its own in a
 *                                         browser where someone is signed in and chose it, should go there at once; else null
 *   cameFromFull(referrer, here, layout)  whether this page was opened from the full view (same site, the full view's page)
 *   startView(store, { win, local }) → stop()
 *
 * The strip ("make this my usual view") is offered once per page, at the start, only to a page opened afresh from the full
 * view (a reload or a step back keeps the old referrer and is not asked again) in a browser that has not said "Not now".
 * The shell draws it only for someone signed in whose settings were read and hold no choice (select.js viewStripView). A
 * move to another page puts it, or its done line, away.
 */
import { A } from '../state/actions.js';
import { format } from '../router/routes.js';
import { LAYOUT } from '../../appLayout.js';
import { hasSignedInHint } from './place.js';

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

export function cameFromFull(referrer, here, layout = LAYOUT) {
  if (typeof referrer !== 'string' || !referrer || typeof here !== 'string' || !here) return false;
  let from, at;
  try { from = new URL(referrer); at = new URL(here); } catch { return false; }
  if (from.origin !== at.origin) return false;
  const full = new URL(layout.v7.classic, at).pathname;
  return from.pathname === full || from.pathname === full + 'index.html';
}

/** A fresh open of the page (not a reload, not a step back or forward); with no Navigation Timing entry, a fresh one. */
function freshOpen(win) {
  try {
    const nav = win.performance && win.performance.getEntriesByType && win.performance.getEntriesByType('navigation')[0];
    return !nav || nav.type === 'navigate';
  } catch { return true; }
}

/**
 * @param {{ getState, dispatch, subscribe }} store
 * @param {object} o
 * @param {Window|null} [o.win]        the page (its referrer, address and navigation entry: the strip's offer)
 * @param {Storage|null} [o.local]     localStorage (this browser's copy, and "Not now")
 */
export function startView(store, { win = null, local = null } = {}) {
  let stopped = false;
  const dispatch = (a) => { if (!stopped) store.dispatch(a); };
  const set = (key, value) => { try { if (local && local.getItem(key) !== value) local.setItem(key, value); } catch { /* private mode */ } };
  const remove = (key) => { try { if (local && local.getItem(key) !== null) local.removeItem(key); } catch { /* private mode */ } };
  const copy = (view) => { if (view === 'full') set(VIEW_KEY, 'full'); else remove(VIEW_KEY); };

  const off = store.subscribe((state, action, previous) => {
    if (action.type === A.VIEW_SET) { if (state.ui.profile) copy(state.ui.profile.view); return; }
    // the account's settings read: the copy follows them; a read that failed leaves it as it was
    if (action.type === A.PROFILE_SET) { if (action.read !== false) copy(state.ui.profile && state.ui.profile.view); return; }
    if (action.type === A.SESSION_SET) { if (state.session.kind === 'nobody') { remove(VIEW_KEY); remove(ASKED_KEY); } return; }
    if (action.type === A.VIEW_STRIP) { if (action.to === 'gone' && action.notNow === true) set(ASKED_KEY, '1'); return; }
    if (action.type === A.ROUTE_SET) {
      const s = state.ui.viewStrip;
      if ((s === 'offer' || s === 'doneFull' || s === 'doneSimple') && format(state.route) !== format(previous.route)) dispatch({ type: A.VIEW_STRIP, to: 'gone' });
    }
  });

  let offer = false;
  try {
    const doc = win && win.document;
    const here = win && win.location && typeof win.location.href === 'string' ? win.location.href : '';
    offer = !!doc && cameFromFull(doc.referrer, here) && get(local, ASKED_KEY) === null && freshOpen(win);
  } catch { offer = false; }
  if (offer) dispatch({ type: A.VIEW_STRIP, to: 'offer' });

  return () => { stopped = true; off(); };
}
