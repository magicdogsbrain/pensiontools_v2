/**
 * A tab opened before a deploy (reported 16 Nov 2026: "Sorry, we could not work that out." on any question, and "Try again"
 * never worked). Each release names its files by their contents, the deploy took the release before's off the site, and the
 * site answers for a missing file with its own page; a tab opened earlier asks for its worker and the answers' part only when
 * a question is first worked out, gets that page, and nothing loaded the page again.
 *
 * Each test runs its own server on one port, so the site's origin stays the same while the folder behind it changes, as a
 * deploy changes it (old-worker.spec.js does the same):
 *   1. the published build (dist/prod) is opened at the front door; then a deploy: the same site with every hashed file named
 *      afresh, so none of the old names is there any more; then C's two figures and "Show what it pays": the page loads itself
 *      again ONCE, keeps its address and the figures typed (the draft is in the tab), and answers — never "Sorry";
 *   2. a page that comes back as the same build (its parts loaded on demand still missing, as when an old page is held by a
 *      cache): it loads itself again once, then says "PensionTools has been updated since this page was opened. Reload the
 *      page to carry on." with "Reload the page" — never "Sorry", and never a second reload by itself.
 * The figures are made up and round: one person of 58 with £250,000 in a pension.
 */
import { cpSync, readdirSync, readFileSync, writeFileSync, renameSync, rmSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { test, expect, DIST } from './helpers/app.js';
import { startServer } from './helpers/serve.mjs';
import { V7_PATH } from './helpers/paths.js';
import { COMMON } from '../src/v7/copy/common.js';

const C_TYPED = { 'c.you.pot': '250000', 'c.you.age': '58' };
const SORRY = 'Sorry, we could not work that out.';

const listening = (server) => new Promise((done, fail) => { server.once('listening', done); server.once('error', fail); });
async function stop(server) {
  server.closeAllConnections();
  await new Promise((done) => server.close(done));
}

/** Every file under a folder, as paths relative to it. */
function filesUnder(root, dir = root, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) filesUnder(root, p, out); else out.push(relative(root, p));
  }
  return out;
}
const HASHED = /^(.+-)([A-Za-z0-9_-]{8})(\.(js|css|woff2|png|svg))$/;
const TEXT = /\.(html|js|css|json|webmanifest)$/;

/** The next release, as a deploy puts it up: the published build with every hashed file under assets/ named afresh. */
function nextRelease(folder) {
  cpSync(join(DIST, 'prod'), folder, { recursive: true });
  const files = filesUnder(folder);
  const renames = [];
  for (const f of files) {
    if (!/(^|\/)assets\//.test(f)) continue;
    const base = f.split('/').pop();
    const m = HASHED.exec(base);
    if (!m) continue;
    const next = `${m[1]}${m[2].slice(0, 7)}Z${m[3]}`;
    renameSync(join(folder, f), join(folder, f.slice(0, -base.length) + next));
    renames.push([base, next]);
  }
  renames.sort((a, b) => b[0].length - a[0].length);
  for (const f of filesUnder(folder)) {
    if (!TEXT.test(f)) continue;
    const before = readFileSync(join(folder, f), 'utf8');
    let text = before;
    for (const [from, to] of renames) text = text.split(from).join(to);
    if (text !== before) writeFileSync(join(folder, f), text);
  }
  expect(renames.some(([from]) => from.startsWith('answerWorker-')), 'the worker is among the files named afresh').toBe(true);
  return folder;
}

/** The same build, with every script the page loads only on demand gone (the worker, the answers' part): the page itself loads. */
function sameBuildPartsGone(folder) {
  cpSync(join(DIST, 'prod'), folder, { recursive: true });
  const page = readFileSync(join(folder, 'index.html'), 'utf8');
  const named = new Set([...page.matchAll(/(?:src|href)="\.?\/?(assets\/[^"]+)"/g)].map((m) => m[1]));
  let gone = 0;
  for (const name of readdirSync(join(folder, 'assets'))) {
    if (!name.endsWith('.js') || named.has(`assets/${name}`)) continue;
    rmSync(join(folder, 'assets', name));
    gone++;
  }
  expect(gone, 'parts loaded on demand were removed').toBeGreaterThan(0);
  return folder;
}

/** The published build on a free port; then, on the same port, `next` (a deploy under the open tab). */
async function serveThenDeploy(next, use) {
  let server = startServer(join(DIST, 'prod'), 0);
  await listening(server);
  const port = server.address().port;
  const base = `http://127.0.0.1:${port}`;
  const deploy = async () => { await stop(server); server = startServer(next, port); await listening(server); };
  try { await use(base, deploy); } finally { await stop(server); }
}

/** What the browser says when the old page asks for a file the site no longer has: expected here, and only here. */
function allowStale(watch) {
  watch.allow(/asked for a file that is not there: .*\/assets\//);
  watch.allow(/Failed to load module script|Failed to fetch dynamically imported module|Expected a JavaScript(-or-Wasm)? module script|is not a valid JavaScript MIME type/);
}

/** "Sorry" counted wherever it is drawn, even for a moment, across loads of the page (kept in the tab). */
async function countSorry(page) {
  await page.addInitScript((sorry) => {
    const seen = () => { try { sessionStorage.setItem('e2e-sorry', '1'); } catch { /* none */ } };
    new MutationObserver(() => { if (document.body && document.body.textContent.includes(sorry)) seen(); })
      .observe(document, { subtree: true, childList: true, characterData: true });
  }, SORRY);
}
const sawSorry = (page) => page.evaluate(() => sessionStorage.getItem('e2e-sorry') === '1');
const loads = (page) => page.evaluate(() => Number(sessionStorage.getItem('e2e-loads') || '0'));

/**
 * The front door opened on the old release; the deploy; then C asked, as a person would after leaving the tab open. (A
 * question opened before the deploy has its worker already, which carries on with the old release: nothing to see.)
 */
async function openThenAskC(page, base, deploy) {
  await page.goto(base + V7_PATH + '#/');
  await expect(page.locator('#app [data-screen]')).toHaveAttribute('data-screen', 'front');
  expect(await loads(page)).toBe(1);
  await deploy();
  await page.evaluate(() => { window.location.hash = '#/c/numbers'; });
  await expect(page.locator('#app [data-screen]')).toHaveAttribute('data-screen', 'c.numbers');
  for (const [id, value] of Object.entries(C_TYPED)) await page.getByTestId(id).fill(value);
  await page.getByTestId('c.action.show').click();
}

test.beforeEach(async ({ page }) => {
  await countSorry(page);
  // each load of the page counted in the tab, so a reload (and never a second by itself) can be seen
  await page.addInitScript(() => { try { sessionStorage.setItem('e2e-loads', String(Number(sessionStorage.getItem('e2e-loads') || '0') + 1)); } catch { /* none */ } });
});

test('a deploy under an open tab: the page loads itself again once, keeps the figures, and answers', async ({ page, watch }, testInfo) => {
  allowStale(watch);
  const next = nextRelease(testInfo.outputPath('next-release'));
  await serveThenDeploy(next, async (base, deploy) => {
    await openThenAskC(page, base, deploy);
    // loaded again by itself, at the answer's address, the figures still typed; the answer is the new release's
    await expect.poll(() => loads(page), { timeout: 30_000 }).toBe(2);
    await expect(page.locator('#app [data-screen]')).toHaveAttribute('data-screen', 'c.answer', { timeout: 30_000 });
    await expect(page.locator('#app')).toHaveAttribute('data-answer', 'final', { timeout: 120_000 });
    await expect(page.locator('#app')).toHaveAttribute('data-ready', '1');
    expect(new URL(page.url()).hash).toBe('#/c/answer');
    const scripts = await page.$$eval('script[src]', (els) => els.map((e) => e.getAttribute('src')));
    expect(scripts.some((s) => /Z\.js$/.test(s)), 'the page is the new release').toBe(true);
    await expect(page.locator('#problem-title')).toHaveCount(0);
    expect(await sawSorry(page)).toBe(false);
    expect(await loads(page)).toBe(2);
  });
});

test('still the old page after loading again: the plain words and "Reload the page", never "Sorry", never a loop', async ({ page, watch }, testInfo) => {
  allowStale(watch);
  const same = sameBuildPartsGone(testInfo.outputPath('same-build'));
  await serveThenDeploy(same, async (base, deploy) => {
    await openThenAskC(page, base, deploy);
    const words = page.getByTestId('c.stale');
    await expect(words).toBeVisible({ timeout: 60_000 });
    await expect(words).toContainText(COMMON.stale.title);
    await expect(words).toContainText(COMMON.stale.body);
    await expect(page.getByTestId('c.stale.reload')).toHaveText(COMMON.stale.reload);
    await expect(page.getByTestId('c.action.retry')).toHaveCount(0);
    // the figures typed are still said; loaded again once by itself, and no more
    await expect(words).toContainText('£250,000');
    expect(await loads(page)).toBe(2);
    expect(await sawSorry(page)).toBe(false);
    // "Reload the page" is the person's own: it loads the page again
    await page.getByTestId('c.stale.reload').click();
    await expect.poll(() => loads(page), { timeout: 30_000 }).toBe(3);
    await expect(page.getByTestId('c.stale')).toBeVisible({ timeout: 60_000 });
    expect(await loads(page)).toBe(3);
    expect(await sawSorry(page)).toBe(false);
  });
});
