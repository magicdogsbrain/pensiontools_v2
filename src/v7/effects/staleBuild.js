/**
 * A page opened before the site was updated (src/utils/staleBuild.js): the simple view's side.
 *
 *   startStaleBuild(store, { win, session, build }) → { hit, stop }
 *     hit()    a stale build was met (the worker client's code, a part that could not be loaded): the page loads itself
 *              again, once for this build in this tab, keeping its address (and, through the draft store, the figures
 *              typed) → 'reloading'; when it has done that already, or the tab cannot keep the note, the state is told
 *              (env.stale), so the page says so in plain words with a button to load it again → 'words'. Called again, it
 *              answers the same and does nothing more.
 *     Vite's 'vite:preloadError' (a part loaded on demand that could not be loaded) is a hit; the error still reaches
 *     whoever asked for the part. "Reload the page" (page/reload) loads the page again.
 *   watchClient(client, hit) → the worker client, each call's stale build told to hit() as well as to its caller
 *   BUILD    this build's name: the version and the address of the file this code was built into (named by its contents)
 *
 * Nothing is written on open: the tab's note is written only when a stale build is met.
 */
import { A } from '../state/actions.js';
import { VERSION } from '../../constants.js';
import { isStaleBuildError, mayReloadOnce } from '../../utils/staleBuild.js';

export const BUILD = `${VERSION} ${import.meta.url}`;

export function startStaleBuild(store, { win, session, build = BUILD } = {}) {
  let reloading = false;
  const reload = () => { try { win.location.reload(); } catch { /* the browser would not: the words stay */ } };

  function hit() {
    if (reloading) return 'reloading';
    if (store.getState().env.stale) return 'words';
    if (mayReloadOnce(session, build)) {
      reloading = true;
      reload();
      return 'reloading';
    }
    store.dispatch({ type: A.ENV_SET, patch: { stale: true } });
    return 'words';
  }

  const onPreloadError = () => { hit(); };
  const listening = !!(win && typeof win.addEventListener === 'function');
  if (listening) win.addEventListener('vite:preloadError', onPreloadError);
  const unsubscribe = store.subscribe((state, action) => { if (action.type === A.PAGE_RELOAD) reload(); });

  return {
    hit,
    stop() {
      unsubscribe();
      if (listening) win.removeEventListener('vite:preloadError', onPreloadError);
    }
  };
}

/** Every call of the client as it was; a promise it rejects with a stale build tells hit() first. */
export function watchClient(client, hit) {
  const out = {};
  for (const [name, fn] of Object.entries(client)) {
    out[name] = typeof fn !== 'function' ? fn : (...args) => {
      const r = fn(...args);
      if (!r || typeof r.then !== 'function') return r;
      return r.then(undefined, (e) => { if (isStaleBuildError(e)) hit(); throw e; });
    };
  }
  return out;
}
