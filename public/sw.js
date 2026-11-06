/*
 * The kill switch. Nothing on this site registers a service worker any more, but a browser that installed one in the
 * past keeps it until it fetches /sw.js again and finds different bytes; an old one could keep serving a cached page,
 * or cached data, for good (research/v7/switch-readiness.md §3). This file is what such a browser finds. It takes over
 * at once, deletes the old worker's caches, lets go of the site and reloads, once, each window the old worker was
 * serving, so that window gets the site from the network. It has no fetch handler: it never answers a request.
 *
 * No loop: only the windows the old worker controlled when this one took over are reloaded. After the reload nothing
 * controls them (this registration is gone), so a window is reloaded at most once; and if a page ever registered this
 * file afresh, no window would be controlled at that moment, so none would be reloaded.
 *
 * It needs no stamp: its bytes differ from every worker the site ever published, and it never needs to change.
 */
const OLD_CACHES = 'pension-planner';

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    // The windows the old worker was serving: they passed to this worker as it became active (before any claim).
    const served = await self.clients.matchAll({ type: 'window' });
    const names = await caches.keys();
    await Promise.all(names.filter((name) => name.startsWith(OLD_CACHES)).map((name) => caches.delete(name)));
    await self.clients.claim();
    // Unregister BEFORE the reloads, and the order matters: a window's navigation waits for this worker to finish
    // activating while this activation waits for the navigation, so with the registration still in place no window
    // would ever reload. Once it is gone, each reload goes straight to the network.
    await self.registration.unregister();
    // A browser without WindowClient.navigate keeps its windows as they are (the caches are already gone and nothing
    // controls them after their next load); a window that refuses is let be, and neither stops the others.
    await Promise.all(served.map((win) => (typeof win.navigate === 'function' ? Promise.resolve().then(() => win.navigate(win.url)) : Promise.resolve()).catch(() => null)));
  })());
});
