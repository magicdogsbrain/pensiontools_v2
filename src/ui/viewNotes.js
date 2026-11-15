/**
 * The simple view's notes in this browser (7.11.0; src/v7/effects/place.js, src/v7/effects/view.js): that someone is
 * signed in here, this browser's copy of their choice of the full view as the one the site opens in, and the strip's
 * "Not now". The simple view sets them and clears them when nobody is signed in. The full view clears them at its own
 * sign-out (src/firebase/AuthService.js logOut: the header's button, the hour-idle sign-out, the "Confirm your email"
 * screen), so after a sign-out in either view the site's address opens the simple view's front door, for whoever uses
 * this browser next. And at its own sign-in, once the account's settings are read (AuthService.viewNotesAtSignIn), it
 * puts the signed-in note and the copy back for someone whose account says the full view, so the site's address goes
 * on opening the full view for them after signing out and in again there (the hour-idle sign-out among them); for
 * anyone else it sets nothing, and only takes away a copy the account no longer holds. A session that ends elsewhere (a
 * password changed on another device) leaves them until the simple view is next opened here; the full view's landing
 * page has a line that does that.
 *
 *   SIMPLE_VIEW_NOTES                    the three localStorage keys
 *   clearSimpleViewNotes(local)          removes them; a browser that refuses its storage is left as it is
 *   followViewChoice(profile, local)     the account's settings, read: the signed-in note and the copy follow its choice
 */
export const SIMPLE_VIEW_NOTES = Object.freeze(['pt_v7_signed_in', 'pt_view', 'pt_view_asked']);
const [SIGNED_IN, VIEW] = SIMPLE_VIEW_NOTES;

function browserStorage() {
  try { return typeof localStorage !== 'undefined' ? localStorage : null; } catch (e) { return null; }
}

export function clearSimpleViewNotes(local = browserStorage()) {
  if (!local) return;
  for (const key of SIMPLE_VIEW_NOTES) {
    try { local.removeItem(key); } catch (e) { /* private mode */ }
  }
}

/**
 * The account's settings document as read at the full view's sign-in (FirestoreService.loadUserProfile): its `view`
 * 'full' sets the signed-in note ('1') and the copy ('full'), as the simple view's own sign-in and settings read do; any
 * other choice, or none, takes away a copy left in this browser and leaves the signed-in note as it is (the trade-off
 * of setting it for everyone stays the simple view's). Nothing read (no settings yet, or a read that failed) changes
 * nothing. Each note is written only when it differs, so a browser already in step writes nothing.
 * @param {object|null} profile
 * @param {Storage|null} [local]
 */
export function followViewChoice(profile, local = browserStorage()) {
  if (!local || !profile || typeof profile !== 'object') return;
  const set = (key, value) => { try { if (local.getItem(key) !== value) local.setItem(key, value); } catch (e) { /* private mode */ } };
  const remove = (key) => { try { if (local.getItem(key) !== null) local.removeItem(key); } catch (e) { /* private mode */ } };
  if (profile.view === 'full') { set(SIGNED_IN, '1'); set(VIEW, 'full'); }
  else remove(VIEW);
}
