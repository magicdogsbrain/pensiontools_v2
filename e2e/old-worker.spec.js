/**
 * An old service worker is cleared by the kill switch (public/sw.js; research/v7/switch-readiness.md §3, R5).
 *
 * Nothing on the site registers a worker any more, but a browser that installed one keeps it until it fetches /sw.js
 * again. Each test here runs its own server on one port, so the site's origin stays the same while the folder behind it
 * changes, as a deploy changes it:
 *   1. an "old site" (e2e/fixtures/old-worker/) whose page registers an old worker of the site's own shape, and a planted
 *      cache entry marked as old; the old worker is seen serving it;
 *   2. the server is stopped and started again on the same port over the published build (dist/prod), whose /sw.js is
 *      the kill switch; the browser looks for an update, as it does on any visit;
 *   3. the window reloads by itself and gets the page from the network; the old caches are gone and no worker is left.
 * Two old shapes: the older cache-first worker with a cached page at the site's root, and today's network-first worker
 * with a cached data file, seen from V7's page. And today's worker when the visit after the deploy is a plain one: to the
 * classic page, in two tabs, and to V7's page, the site's front page at 7.0. Each page's start-up asks an old worker to
 * update (index.html; src/v7/main.jsx), as the browser does on a visit, so the kill switch clears it, in every tab.
 *
 * The one spec that lets service workers run (serviceWorkers: 'allow'; every other spec blocks them: tests/v7/e2eRules.test.js).
 * Firebase is never reached: every request outside the local server is stopped.
 */
import { copyFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { test, expect, DIST, REPO, V7_PATH, CLASSIC_PATH, CLASSIC_TITLE, WORKER_DATA_MISSING } from './helpers/app.js';
import { startServer } from './helpers/serve.mjs';

test.use({ outside: 'block', serviceWorkers: 'allow' });

const FIXTURE = join(REPO, 'e2e', 'fixtures', 'old-worker');
const OLD_CACHE = 'pension-planner-v17';
const STALE_PAGE = '<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Old cached page</title></head><body><p id="stalePage">An old page from the cache.</p></body></html>';

/** The old site in a folder of this test's own: its page at /, at V7's address and at the classic page's, the register script, the worker as /sw.js and the files it precaches. */
function oldSite(folder, worker) {
  for (const at of new Set(['/', V7_PATH, CLASSIC_PATH])) {
    mkdirSync(join(folder, at), { recursive: true });
    copyFileSync(join(FIXTURE, 'index.html'), join(folder, at, 'index.html'));
  }
  copyFileSync(join(FIXTURE, 'register.js'), join(folder, 'register.js'));
  copyFileSync(join(FIXTURE, worker), join(folder, 'sw.js'));
  for (const f of ['icon-192.png', 'icon-512.png', 'favicon.png', 'icon.svg']) copyFileSync(join(REPO, 'public', f), join(folder, f));
  writeFileSync(join(folder, 'manifest.json'), '{}');
  return folder;
}

const listening = (server) => new Promise((done, fail) => { server.once('listening', done); server.once('error', fail); });
async function stop(server) {
  server.closeAllConnections();
  await new Promise((done) => server.close(done));
}

/** The old site on a free port; then, on the same port, the published build. */
async function serveOldThenNew(folder, use) {
  let server = startServer(folder, 0);
  await listening(server);
  const port = server.address().port;
  const base = `http://127.0.0.1:${port}`;
  const deploy = async () => { await stop(server); server = startServer(join(DIST, 'prod'), port); await listening(server); };
  try { await use(base, deploy); } finally { await stop(server); }
}

/** What the browser holds for the site: its caches, its workers, and whether one controls this page. */
const held = (page) => page.evaluate(async () => ({
  caches: await caches.keys(),
  workers: (await navigator.serviceWorker.getRegistrations()).length,
  controlled: !!navigator.serviceWorker.controller
}));

/** What the published build serves at the site's root: V7's page at 7.0; the classic page in the rollback layout (src/appLayout.js). */
const ROOT_TITLE = CLASSIC_PATH === '/' ? CLASSIC_TITLE : /^PensionTools: plan your pension, from saving to living on it$/;

/** The visit after the deploy: the browser asks for /sw.js again (here at once; a real browser does it on its own visit). Not awaited in the page: the kill switch reloads it. */
const lookForUpdate = (page) => page.evaluate(() => { navigator.serviceWorker.getRegistration().then((r) => r && r.update()); });

test.describe('an old service worker, after the kill switch is published', () => {
  test('the older cache-first worker with the site\'s root page cached: the window reloads from the network, the cache is gone, no worker is left', async ({ page, watch }, testInfo) => {
    // as on the live site today: the classic page's engine worker asks for the market files from its own address (old-app-unchanged.spec.js)
    watch.allow(WORKER_DATA_MISSING);
    const folder = oldSite(testInfo.outputPath('old-site'), 'sw-cache-first.js');
    await serveOldThenNew(folder, async (base, deploy) => {
      // the old site: its worker installs and takes the page
      await page.goto(base + '/');
      await expect(page.locator('#oldSite')).toBeVisible();
      await page.waitForFunction(() => !!navigator.serviceWorker.controller);
      // a page marked as old, planted in the old worker's cache at '/': the address that worker cached, whatever the
      // layout (it precached './' and './index.html'), and where V7 lives at 7.0; the old worker serves it
      await page.evaluate(async ([name, html]) => {
        const cache = await caches.open(name);
        await cache.put('/', new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } }));
      }, [OLD_CACHE, STALE_PAGE]);
      await page.reload();
      await expect(page.locator('#stalePage')).toBeVisible();
      expect((await held(page)).caches).toContain(OLD_CACHE);

      // the deploy: the same address, the published build with the kill switch at /sw.js
      await deploy();
      await lookForUpdate(page);
      // the window reloads by itself, from the network: the site's page at its root, not the cached one
      await expect(page).toHaveTitle(ROOT_TITLE, { timeout: 30_000 });
      await expect(page.locator('#stalePage')).toHaveCount(0);
      await expect.poll(() => held(page), { timeout: 15_000 }).toEqual({ caches: [], workers: 0, controlled: false });
      // and stays so: the next load is the network's too
      await page.reload();
      await expect(page).toHaveTitle(ROOT_TITLE);
      expect(await held(page)).toEqual({ caches: [], workers: 0, controlled: false });
    });
  });

  test('today\'s network-first worker with a data file cached, seen from V7\'s page: the kill switch alone clears it, and the data comes from the network', async ({ page }, testInfo) => {
    const folder = oldSite(testInfo.outputPath('old-site'), 'sw-network-first.js');
    await serveOldThenNew(folder, async (base, deploy) => {
      await page.goto(base + V7_PATH);
      await expect(page.locator('#oldSite')).toBeVisible();
      await page.waitForFunction(() => !!navigator.serviceWorker.controller);
      // a market file marked as old, planted in the old worker's cache; the old worker answers it from the cache (cache-first for data)
      await page.evaluate(async ([name]) => {
        const cache = await caches.open(name);
        await cache.put('/data/equity.json', new Response(JSON.stringify({ stale: true }), { headers: { 'Content-Type': 'application/json' } }));
      }, [OLD_CACHE]);
      expect(await page.evaluate(() => fetch('/data/equity.json').then((r) => r.json()))).toEqual({ stale: true });

      await deploy();
      await lookForUpdate(page);
      // the window reloads by itself: V7's front door from the network, the kill switch's doing (V7's own start-up only asks for an update)
      await expect(page.locator('#app [data-screen]')).toHaveAttribute('data-screen', 'front', { timeout: 30_000 });
      await expect.poll(() => held(page), { timeout: 15_000 }).toEqual({ caches: [], workers: 0, controlled: false });
      const data = await page.evaluate(() => fetch('/data/equity.json').then((r) => r.json()));
      expect(data.stale).toBeUndefined();
      expect(Number.isFinite(data.level)).toBe(true);
      expect(await held(page)).toEqual({ caches: [], workers: 0, controlled: false });
    });
  });

  test('today\'s worker in two tabs, and a plain visit to the classic page after the deploy: its start-up updates the old worker, so the kill switch clears it in both tabs, each reloaded once', async ({ page, context, watch }, testInfo) => {
    watch.allow(WORKER_DATA_MISSING);
    const folder = oldSite(testInfo.outputPath('old-site'), 'sw-network-first.js');
    await serveOldThenNew(folder, async (base, deploy) => {
      // two tabs on the old site, both served by the old worker: the classic page's address and V7's
      await page.goto(base + CLASSIC_PATH);
      await page.waitForFunction(() => !!navigator.serviceWorker.controller);
      const other = await context.newPage();
      await other.goto(base + V7_PATH);
      await other.waitForFunction(() => !!navigator.serviceWorker.controller);
      // a market file marked as old in the old worker's cache, which it answers from the cache
      await page.evaluate(async ([name]) => {
        const cache = await caches.open(name);
        await cache.put('/data/equity.json', new Response(JSON.stringify({ stale: true }), { headers: { 'Content-Type': 'application/json' } }));
      }, [OLD_CACHE]);
      expect(await other.evaluate(() => fetch('/data/equity.json').then((r) => r.json()))).toEqual({ stale: true });

      await deploy();
      const loads = { page: 0, other: 0 };
      page.on('framenavigated', (f) => { if (f === page.mainFrame()) loads.page += 1; });
      other.on('framenavigated', (f) => { if (f === other.mainFrame()) loads.other += 1; });
      // a plain visit, as a person makes one: nothing here asks the browser to look for an update. The old worker hands
      // the classic page over from the network; before this change its start-up unregistered the worker at once, which
      // left the old caches and left the other tab served by the old worker
      await page.goto(base + CLASSIC_PATH);
      await expect(page).toHaveTitle(CLASSIC_TITLE);
      // the kill switch reloads both tabs once: this one after the visit, the other one by itself
      await expect.poll(() => loads, { timeout: 30_000 }).toEqual({ page: 2, other: 1 });
      await expect(other.locator('#app [data-screen]')).toHaveAttribute('data-screen', 'front', { timeout: 30_000 });
      await expect(page).toHaveTitle(CLASSIC_TITLE);
      await expect.poll(() => held(page), { timeout: 15_000 }).toEqual({ caches: [], workers: 0, controlled: false });
      expect(await held(other)).toEqual({ caches: [], workers: 0, controlled: false });
      const data = await other.evaluate(() => fetch('/data/equity.json').then((r) => r.json()));
      expect(data.stale).toBeUndefined();
      // no more reloads: the worker that made them is gone
      expect(loads).toEqual({ page: 2, other: 1 });
      await other.close();
    });
  });

  test('today\'s worker, and a plain visit to V7\'s page after the deploy (the front page at 7.0): the old worker is updated, the kill switch clears it, the page is reloaded once and reads the data from the network', async ({ page }, testInfo) => {
    const folder = oldSite(testInfo.outputPath('old-site'), 'sw-network-first.js');
    await serveOldThenNew(folder, async (base, deploy) => {
      await page.goto(base + V7_PATH);
      await expect(page.locator('#oldSite')).toBeVisible();
      await page.waitForFunction(() => !!navigator.serviceWorker.controller);
      await page.evaluate(async ([name]) => {
        const cache = await caches.open(name);
        await cache.put('/data/equity.json', new Response(JSON.stringify({ stale: true }), { headers: { 'Content-Type': 'application/json' } }));
      }, [OLD_CACHE]);
      expect(await page.evaluate(() => fetch('/data/equity.json').then((r) => r.json()))).toEqual({ stale: true });

      await deploy();
      let loads = 0;
      page.on('framenavigated', (f) => { if (f === page.mainFrame()) loads += 1; });
      // a plain visit: the old worker hands V7's page over from the network, and nothing in this test asks for an update
      await page.goto(base + V7_PATH);
      await expect(page.locator('#app [data-screen]')).toHaveAttribute('data-screen', 'front', { timeout: 30_000 });
      await expect.poll(() => loads, { timeout: 30_000 }).toBe(2);
      await expect(page.locator('#app [data-screen]')).toHaveAttribute('data-screen', 'front', { timeout: 30_000 });
      await expect.poll(() => held(page), { timeout: 15_000 }).toEqual({ caches: [], workers: 0, controlled: false });
      const data = await page.evaluate(() => fetch('/data/equity.json').then((r) => r.json()));
      expect(data.stale).toBeUndefined();
      expect(loads).toBe(2);
    });
  });
});
