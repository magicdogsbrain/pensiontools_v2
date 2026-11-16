/**
 * A page opened before the site was updated (src/utils/staleBuild.js): the full view's side.
 *
 * The full view loads one part on demand ("Test what you keep against your plan", src/ui/keepHoldingsUi.js), and its
 * engine worker (src/workers/engineClient.js), whose every caller works the figures out on the page when the worker fails —
 * so the worker needs nothing here. A part on demand that cannot be loaded (Vite's 'vite:preloadError') loads the page
 * again, once for this build in this tab, keeping its address; when that has been done already, or the tab cannot keep the
 * note, a line at the top of the page says so in the simple view's words, with a button to load the page again. The error
 * still reaches whoever asked for the part.
 *
 *   installStaleBuild(win, { build }) → { hit, stop }      called once as the page's code loads (src/app.js)
 *   staleWordsText()                                       the words as one line, for a message (keepHoldingsUi.js)
 *   BUILD                                                  this build's name: the version and the address of its file
 *
 * Nothing is written on open: the tab's note is written only when a stale build is met.
 */
import { VERSION } from '../constants.js';
import { mayReloadOnce } from '../utils/staleBuild.js';
import { COMMON } from '../v7/copy/common.js';
import { esc } from './components/ReleaseNotesView.js';

export const BUILD = `${VERSION} ${import.meta.url}`;

export const staleWordsText = () => `${COMMON.stale.title} ${COMMON.stale.body}`;

export function installStaleBuild(win, { build = BUILD } = {}) {
  let reloading = false;
  let said = false;
  const reload = () => { try { win.location.reload(); } catch { /* the browser would not: the words stay */ } };
  const session = (() => { try { return win.sessionStorage; } catch { return null; } })();

  function showWords() {
    const doc = win.document;
    if (!doc || !doc.body || doc.querySelector('[data-testid="stale"]')) return;
    const W = COMMON.stale;
    const box = doc.createElement('div');
    box.className = 'alert alert-warning stale-build';
    box.setAttribute('role', 'alert');
    box.setAttribute('data-testid', 'stale');
    box.innerHTML = `<strong>${esc(W.title)}</strong> ${esc(W.body)} <button type="button" class="btn btn-primary" data-testid="stale.reload">${esc(W.reload)}</button>`;
    box.querySelector('button').addEventListener('click', reload);
    doc.body.insertBefore(box, doc.body.firstChild);
  }

  function hit() {
    if (reloading) return 'reloading';
    if (said) return 'words';
    if (mayReloadOnce(session, build)) {
      reloading = true;
      reload();
      return 'reloading';
    }
    said = true;
    showWords();
    return 'words';
  }

  const onPreloadError = () => { hit(); };
  win.addEventListener('vite:preloadError', onPreloadError);
  return { hit, stop: () => win.removeEventListener('vite:preloadError', onPreloadError) };
}
