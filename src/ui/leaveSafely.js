/**
 * Leaving the page never loses what was typed (lead4.md R3: a pending save is flushed before a link, tab, plan switch or
 * unload). Sign Out waits for the flush; closing or reloading starts it at once (the page hidden, put away or about to go),
 * and while a save is still on its way the browser is asked to hold the page, so the save can land and nothing is lost
 * without a word.
 *
 *   installLeaveSafely(win, doc, { flush, waiting })   flush(): sends every save waiting; waiting(): one is still on its way
 *   signOutSafely(flush, logOut)                       the flush, then the sign-out (which happens even if the flush fails)
 */
export function installLeaveSafely(win, doc, { flush, waiting }) {
  const go = () => { try { const p = flush(); if (p && p.catch) p.catch(() => {}); } catch (e) { /* the page is going */ } };
  doc.addEventListener('visibilitychange', () => { if (doc.visibilityState === 'hidden') go(); });
  win.addEventListener('pagehide', go);
  win.addEventListener('beforeunload', (e) => {
    let held = false;
    try { held = !!waiting(); } catch (err) { held = false; }
    if (!held) return;
    go();
    e.preventDefault();
    e.returnValue = '';   // the browser's own "leave this page?" question, while the save lands
  });
}

export async function signOutSafely(flush, logOut) {
  try { await flush(); } catch (e) { /* signing out goes ahead; the save said why it failed */ }
  return logOut();
}
