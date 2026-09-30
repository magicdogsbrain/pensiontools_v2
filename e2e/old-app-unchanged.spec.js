/**
 * The current app still starts and answers (test plan 7.4). Protection for the live app while two shells share
 * the source: the published build at /, as a first-time visitor, in guest mode — no account, nothing saved.
 *
 * Kept to what the current shell lets a script drive. Firebase is never reached: every request outside the
 * local server is stopped (`outside: 'block'`), so this cannot touch a real account or real data.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { test, expect, DIST, PROD } from './helpers/app.js';

test.use({ outside: 'block' });

test.describe('the current app, beside V7', () => {
  test('opens, starts guest mode, shows its tabs, and a demo plan produces a result', async ({ page, watch }) => {
    // Known, and as on the live site today: the engine worker asks for the market files beside ITSELF
    // (assets/data/…), where they are not; Cloudflare answers with the home page and the worker falls back to
    // the bundled figures. Listed here so that any OTHER missing file fails this test.
    watch.allow(/^asked for a file that is not there: \/assets\/data\/(gilts|equity)\.json$/);

    await page.goto(PROD + '/');
    await expect(page).toHaveTitle(/Pension Planner/);

    // A first-time visitor: the landing page, with the way in that needs no account.
    await expect(page.locator('#landingTryGuest')).toBeVisible();
    await page.locator('#landingTryGuest').click();

    // Guest mode has started: the banner says so, and the one guest plan lives in this tab only.
    await expect(page.locator('#guestBanner')).toBeVisible();
    await expect(page.locator('#guestBanner')).toContainText('Guest mode');
    const plans = await page.evaluate(() => JSON.parse(sessionStorage.getItem('pt_guest_scenarios') || '[]').length);
    expect(plans).toBe(1);

    // The tab bar is there: the row of tabs on a wide screen, the bottom bar on a phone.
    const wide = page.viewportSize().width >= 900;
    if (wide) {
      for (const tab of ['budget', 'stress', 'strategies', 'decision', 'household']) await expect(page.locator(`nav.tabs .tab[data-tab="${tab}"]`)).toBeVisible();
    } else {
      for (const tab of ['budget', 'stress', 'strategies', 'decision']) await expect(page.locator(`button[data-on-click="mobileGo('${tab}')"]`)).toBeVisible();
    }

    // The demo plan produces a result: the strategies are ranked on it, each row with its figures.
    const ranking = page.locator('#strategies-content');
    await expect(ranking.getByRole('heading', { name: /Which strategy\?.*ranked on your plan/ })).toBeVisible({ timeout: 45_000 });
    const rows = ranking.locator('table').first().locator('tbody tr');
    await expect.poll(() => rows.count(), { timeout: 45_000 }).toBeGreaterThanOrEqual(9);
    const first = (await rows.first().innerText()).replace(/\s+/g, ' ');
    expect(first).toMatch(/£[\d,]+/);
    expect(first).toMatch(/\d+%/);
    expect(first).not.toMatch(/undefined|NaN/);
    // The `watch` fixture fails this test on any console error, uncaught error or failed request of the app's own.
  });

  test('its page still loads its own script, and V7 added nothing to it', async ({ page }) => {
    const response = await page.goto(PROD + '/');
    expect(response.status()).toBe(200);
    const html = readFileSync(join(DIST, 'prod', 'index.html'), 'utf8');
    // The current page never mentions V7 (the address is the only switch)…
    expect(html).not.toMatch(/\/v7\/|v7\/index|preact/i);
    // …and every script and stylesheet it names is in the build, under the current app's own names.
    const assets = readdirSync(join(DIST, 'prod', 'assets'));
    const named = [...html.matchAll(/(?:src|href)="\.\/assets\/([^"]+)"/g)].map((m) => m[1]);
    expect(named.length).toBeGreaterThan(0);
    expect(named.filter((n) => !assets.includes(n))).toEqual([]);
    expect(named.some((n) => /^main-[\w-]+\.js$/.test(n))).toBe(true);
    // The V7 build kept to its own folder.
    expect(assets.filter((n) => /preact|v7/i.test(n))).toEqual([]);
  });
});
