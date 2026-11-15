/**
 * The simple view's notes in this browser (7.11.0; src/v7/effects/place.js, src/v7/effects/view.js): that someone is
 * signed in here, this browser's copy of their choice of the full view as the one the site opens in, and the strip's
 * "Not now". The simple view sets them and clears them when nobody is signed in; the full view only ever clears them, at
 * its own sign-out (src/firebase/AuthService.js logOut: the header's button, the hour-idle sign-out, the "Confirm your
 * email" screen), so after a sign-out in either view the site's address opens the simple view's front door, for whoever
 * uses this browser next. A session that ends elsewhere (a password changed on another device) leaves them until the
 * simple view is next opened here; the full view's landing page has a line that does that.
 *
 *   SIMPLE_VIEW_NOTES             the three localStorage keys
 *   clearSimpleViewNotes(local)   removes them; a browser that refuses its storage is left as it is
 */
export const SIMPLE_VIEW_NOTES = Object.freeze(['pt_v7_signed_in', 'pt_view', 'pt_view_asked']);

function browserStorage() {
  try { return typeof localStorage !== 'undefined' ? localStorage : null; } catch (e) { return null; }
}

export function clearSimpleViewNotes(local = browserStorage()) {
  if (!local) return;
  for (const key of SIMPLE_VIEW_NOTES) {
    try { local.removeItem(key); } catch (e) { /* private mode */ }
  }
}
