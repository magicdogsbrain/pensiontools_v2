/**
 * A page opened before the site was updated (a stale build). Each release names its files by their contents, and the
 * files of the release before are gone from the server, which answers for a missing file with the site's own page. So a
 * page opened earlier can no longer load the parts it loads later: the answer worker, and each part loaded on demand.
 * That is not a failed answer, and "Try again" cannot mend it; loading the page again can.
 *
 * Both views read it here, and each does the same with it: the page loads itself again ONCE, keeping its address (and so
 * its place; the simple view's typed figures are kept in the tab and come back with it); if that has been done already for
 * this build in this tab, or the tab cannot keep the note, it says so in plain words with a button to load the page again.
 *
 *   STALE_BUILD                 the code of an error that is a stale build (the worker client's, src/v7/effects/workerClient.js)
 *   RELOADED_KEY                the tab's note (session storage) naming the build it last loaded itself again for
 *   isStaleBuildError(e)        true for that code, and for a part that could not be loaded (each browser's words for it)
 *   mayReloadOnce(storage, build) true when the page may load itself again now: the note is written first, so it never loops
 *
 * What the page then says is the simple view's copy (src/v7/copy/common.js COMMON.stale), which the full view reads too.
 * Pure: the tab's storage and the build's name are handed in. The simple view's side is src/v7/effects/staleBuild.js, the
 * full view's src/ui/staleBuildPage.js.
 */
export const STALE_BUILD = 'stale-build';
export const RELOADED_KEY = 'pt_reloaded_for';

/** What each browser says when a part of the page could not be loaded (Chrome, Safari, Firefox; and Vite's own). */
const NOT_LOADED = [
  /Failed to fetch dynamically imported module/i,             // Chrome, Edge
  /Importing a module script failed/i,                        // Safari
  /error loading dynamically imported module/i,               // Firefox
  /Failed to load module script/i,                            // Chrome, the worker's own script
  /is not a valid JavaScript MIME type/i,                     // Safari, a page sent for a script
  /Expected a JavaScript(-or-Wasm)? module script/i,          // Chrome, a page sent for a script
  /Unable to preload CSS/i                                    // Vite, a part's styles
];

export function isStaleBuildError(e) {
  if (!e) return false;
  if (typeof e === 'object' && e.code === STALE_BUILD) return true;
  const text = typeof e === 'string' ? e : (typeof e === 'object' && typeof e.message === 'string' ? e.message : '');
  return NOT_LOADED.some((re) => re.test(text));
}

/**
 * Whether the page may load itself again now for `build`. The note is written (and read back) before the answer is yes,
 * so a page that comes back as the same build is told no and says so instead. A tab that cannot keep the note is told no.
 */
export function mayReloadOnce(storage, build) {
  try {
    if (!storage || typeof storage.getItem !== 'function') return false;
    if (storage.getItem(RELOADED_KEY) === String(build)) return false;
    storage.setItem(RELOADED_KEY, String(build));
    return storage.getItem(RELOADED_KEY) === String(build);
  } catch {
    return false;
  }
}
