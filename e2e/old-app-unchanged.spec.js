/**
 * The classic planner still starts and answers (test plan 7.4). Protection for it while two shells share the source:
 * the published build at the classic page's address (/classic/ at 7.0; / in the rollback layout), as a first-time
 * visitor, in guest mode — no account, nothing saved.
 *
 * Kept to what the current shell lets a script drive. Firebase is never reached: every request outside the
 * local server is stopped (`outside: 'block'`), so this cannot touch a real account or real data.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { test, expect, DIST, PROD, CLASSIC_PATH, CLASSIC_TITLE, V7_PATH, LAYOUT_UNDER_TEST, WORKER_DATA_MISSING } from './helpers/app.js';

test.use({ outside: 'block' });

/** At 7.0 the page names itself "The classic planner" and has a way back to the front page (PensionTools); the rollback layout is the page before 7.0. */
const SWITCHED = LAYOUT_UNDER_TEST.name === 'switch';

test.describe('the classic planner, beside V7', () => {
  test('opens, starts guest mode, shows its tabs, and a demo plan produces a result', async ({ page, watch }) => {
    // The engine worker asks for the market files from ITS OWN address (helpers/paths.js CLASSIC_WORKER_DATA): at 7.0
    // /classic/data/, the copy the build makes, so nothing is let pass and a missing copy fails this test; in the rollback
    // layout /assets/data/, where they are not, so the host answers with the home page and the worker falls back to the
    // bundled figures, as before 7.0, and only those two files are let pass: any OTHER missing file fails this test.
    watch.allow(WORKER_DATA_MISSING);

    await page.goto(PROD + CLASSIC_PATH);
    await expect(page).toHaveTitle(CLASSIC_TITLE);

    // A first-time visitor: the landing page, under the page's name, with the way in that needs no account.
    await expect(page.locator('.landing-hero h1')).toHaveText(SWITCHED ? 'The classic planner' : 'Pension Planner');
    await expect(page.locator('#landingTryGuest')).toBeVisible();
    await expect(page.locator('#landingLookAround')).toBeVisible();
    // 7.0.1: the way back to the front page is on the landing page too, before anyone is in (the app's own link, below,
    // is inside the app); the rollback has none, as before 7.0
    const toFrontOutside = page.locator('#classicToFrontOutside a');
    if (SWITCHED) {
      await expect(toFrontOutside).toBeVisible();
      await expect(toFrontOutside).toHaveText('Back to PensionTools');
      expect(new URL(await toFrontOutside.getAttribute('href'), page.url()).pathname).toBe(V7_PATH);
    } else await expect(toFrontOutside).toHaveCount(0);
    await page.locator('#landingLookAround').click();   // the example plan (6.23.0): "Just try it" now opens the setup wizard for a plan of your own

    // Guest mode has started: the banner says so, and the example plan lives in this window only.
    await expect(page.locator('#guestBanner')).toBeVisible();
    await expect(page.locator('#guestBanner')).toContainText('Guest mode');
    const plans = await page.evaluate(() => JSON.parse(sessionStorage.getItem('pt_guest_scenarios') || '[]').length);
    expect(plans).toBe(1);

    // At 7.0 the way back to the site's front page (PensionTools since 7.1.0), is at the top at every width (the header's own
    // buttons are behind the menu on a phone), and the header names the page; the rollback has neither, as before 7.0.
    const wide = page.viewportSize().width >= 900;
    const toFront = page.locator('#classicToFront a');
    if (SWITCHED) {
      await expect(toFront).toBeVisible();
      await expect(toFront).toHaveText('Back to PensionTools');
      expect(new URL(await toFront.getAttribute('href'), page.url()).pathname).toBe(V7_PATH);
      await expect(page.locator('#classicToFrontOutside')).toBeHidden();   // one link at a time: the app's own, once in
    } else await expect(toFront).toHaveCount(0);
    if (wide) await expect(page.locator('header.header h1')).toHaveText(SWITCHED ? 'The classic planner' : 'Pension Planner');

    // The tab bar is there: the row of tabs on a wide screen, the bottom bar on a phone.
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

    // and the way back lands on the front door
    if (SWITCHED) {
      await toFront.click();
      await expect(page.locator('#app [data-screen]')).toHaveAttribute('data-screen', 'front');
      expect(new URL(page.url()).pathname).toBe(V7_PATH);
    }
    // The `watch` fixture fails this test on any console error, uncaught error or failed request of the app's own.
  });

  test('its page still loads its own script, and V7 added nothing to it', async ({ page }) => {
    const response = await page.goto(PROD + CLASSIC_PATH);
    expect(response.status()).toBe(200);
    const html = readFileSync(join(DIST, 'prod', CLASSIC_PATH, 'index.html'), 'utf8');
    // The current page never mentions V7 (the address is the only switch)…
    expect(html).not.toMatch(/\/v7\/|v7\/index|preact/i);
    // …and every script and stylesheet it names is in the build, under the current app's own names.
    const assets = readdirSync(join(DIST, 'prod', CLASSIC_PATH, 'assets'));
    const named = [...html.matchAll(/(?:src|href)="\.\/assets\/([^"]+)"/g)].map((m) => m[1]);
    expect(named.length).toBeGreaterThan(0);
    expect(named.filter((n) => !assets.includes(n))).toEqual([]);
    expect(named.some((n) => /^main-[\w-]+\.js$/.test(n))).toBe(true);
    // The V7 build kept to its own folder. Read each file's name without the build's hash: the hash is eight random
    // characters and can itself spell "v7" (engineWorker-v7puTgnq.js).
    const stem = (n) => n.replace(/-[A-Za-z0-9_-]{8}(\.\w+)$/, '$1');
    expect(assets.filter((n) => /preact|v7/i.test(stem(n)))).toEqual([]);
  });
});
