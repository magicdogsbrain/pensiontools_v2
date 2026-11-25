/**
 * The link at the top of every page is a choice (7.12.0). "Show everything." (simple view) and "Back to the simple view."
 * (full view) were plain links, so the one control most people press to pick a view chose nothing: the next visit opened
 * the view the account last saved from Your account. Now pressing either leaves a one-shot note in this window, and the
 * view that arrives, once the account's settings are read, saves the choice when it differs and removes the note. A note
 * survives the page leaving before any write could land; a guest's note is removed and nothing is written.
 *
 *   VIEW_SWITCH_KEY                 sessionStorage 'pt_view_switch': 'simple' | 'full'
 *   noteViewSwitch(view, session)   the link's press
 *   takeViewSwitch(session)         the note, removed: 'simple' | 'full' | null
 *   viewChoiceToSave(profile, note) the `view` to write: the note when the settings hold another view (or none), else null
 *   followViewSwitch(profile, { session, save, signedIn })   the arriving view's one step: reads and removes the note and,
 *                                   for someone signed in, saves `{ view }` once; returns the view saved, or null
 *   leaveForView(e, view, href, { flush, go, session })   the press itself (wrap-up): a save waiting (a box just left) is
 *                                   sent first and the page moves only once it has landed; one refused ('problem',
 *                                   'notSaved' or a fault) keeps the page, where the box says why. A press for a new tab is
 *                                   the plain link. → 'went' | 'stay' | 'link'
 */
export const VIEW_SWITCH_KEY = 'pt_view_switch';

const VIEWS = ['simple', 'full'];

function windowSession() {
  try { return typeof sessionStorage !== 'undefined' ? sessionStorage : null; } catch (e) { return null; }
}

export function noteViewSwitch(view, session = windowSession()) {
  if (!VIEWS.includes(view) || !session) return;
  try { session.setItem(VIEW_SWITCH_KEY, view); } catch (e) { /* private mode: this visit only */ }
}

export function takeViewSwitch(session = windowSession()) {
  if (!session) return null;
  let v = null;
  try { v = session.getItem(VIEW_SWITCH_KEY); if (v !== null) session.removeItem(VIEW_SWITCH_KEY); } catch (e) { return null; }
  return VIEWS.includes(v) ? v : null;
}

export function viewChoiceToSave(profile, note) {
  if (!VIEWS.includes(note)) return null;
  const held = profile && typeof profile === 'object' ? profile.view : null;
  return held === note ? null : note;
}

export function followViewSwitch(profile, { session = windowSession(), save = null, signedIn = false } = {}) {
  const note = takeViewSwitch(session);
  if (!note || !signedIn) return null;
  const view = viewChoiceToSave(profile, note);
  if (!view) return null;
  if (typeof save === 'function') {
    try { const p = save({ view }); if (p && typeof p.catch === 'function') p.catch(() => {}); } catch (e) { /* the next press tries again */ }
  }
  return view;
}

const REFUSED = ['problem', 'notSaved'];

export async function leaveForView(e, view, href, { flush = null, go, session = windowSession() } = {}) {
  const plain = e && e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;
  if (!plain || typeof flush !== 'function' || typeof go !== 'function') { noteViewSwitch(view, session); return 'link'; }
  e.preventDefault();
  let out;
  try { out = await flush(); } catch (err) { return 'stay'; }
  const outs = Array.isArray(out) ? out : [out];
  if (outs.some((o) => REFUSED.includes(o))) return 'stay';
  noteViewSwitch(view, session);
  go(href);
  return 'went';
}
