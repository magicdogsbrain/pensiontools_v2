/**
 * The full view still starts and answers, and keeps every page it has (test plan 7.4; 7.11.0: research/v7/replan-nov-2026.md
 * §8, "Full keeps every tab, sub-tab and dial"). The published build at the full view's address (/classic/ at 7.0; / in the
 * rollback layout), as a first-time visitor, in guest mode — no account, nothing saved.
 *
 * Kept to what the current shell lets a script drive. Firebase is never reached: every request outside the
 * local server is stopped (`outside: 'block'`), so this cannot touch a real account or real data.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { test, expect, DIST, PROD, REPO, CLASSIC_PATH, CLASSIC_TITLE, V7_PATH, LAYOUT_UNDER_TEST, WORKER_DATA_MISSING, atClassic } from './helpers/app.js';

test.use({ outside: 'block' });

/** At 7.0 the page names itself (since 7.11.0 "PensionTools (full view)") and has a way back to the simple view; the rollback layout is the page before 7.0. */
const SWITCHED = LAYOUT_UNDER_TEST.name === 'switch';
/** Every strategy page the Strategies tab links to (index.html's nav), and the seven with dials of their own (STRATEGY_PAGES). */
const STRATEGY_LINKS = ['gilt-rotation', 'ladder-and-ratchet', 'floor-and-flex', 'floor-the-schedule', 'bridge-and-engine', 'buckets-in-order', 'pots-and-valves', 'floor-to-age', 'full-il-gilt', 'gilts', 'overview', 'assumptions', 'whatsnew'];
const STRATEGY_PAGES = ['gilt-rotation', 'ladder-and-ratchet', 'floor-and-flex', 'floor-the-schedule', 'bridge-and-engine', 'buckets-in-order', 'pots-and-valves'];
const NAME = 'PensionTools (full view)';
/** A screen drawn over the whole window (the landing page, the sign-in screen) starts below the line naming the view. */
async function belowTheLine(page, selector) {
  const line = await page.locator('#classicToFrontOutside').boundingBox();
  const screen = await page.locator(selector).boundingBox();
  expect(line && screen, selector).toBeTruthy();
  expect(screen.y, selector).toBeGreaterThanOrEqual(line.y + line.height - 0.5);
  const hit = await page.evaluate(() => { const a = document.querySelector('#classicToFrontOutside a'); const r = a.getBoundingClientRect(); const at = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return at === a || a.contains(at); });
  expect(hit, 'the line\'s link is the topmost thing where it is drawn').toBe(true);
}
const LINE = 'This is the full view. Back to the simple view.';
const BACK = 'Back to the simple view.';

test.describe('the full view, beside the simple view', () => {
  test('opens, starts guest mode, shows its tabs, and a demo plan produces a result', async ({ page, watch }) => {
    // The engine worker asks for the market files from ITS OWN address (helpers/paths.js CLASSIC_WORKER_DATA): at 7.0
    // /classic/data/, the copy the build makes, so nothing is let pass and a missing copy fails this test; in the rollback
    // layout /assets/data/, where they are not, so the host answers with the home page and the worker falls back to the
    // bundled figures, as before 7.0, and only those two files are let pass: any OTHER missing file fails this test.
    watch.allow(WORKER_DATA_MISSING);

    await page.goto(PROD + CLASSIC_PATH);
    await expect(page).toHaveTitle(CLASSIC_TITLE);

    // A first-time visitor: the landing page, under the page's name, with the way in that needs no account.
    await expect(page.locator('.landing-hero h1')).toHaveText(SWITCHED ? NAME : 'Pension Planner');
    await expect(page.locator('#landingTryGuest')).toBeVisible();
    await expect(page.locator('#landingLookAround')).toBeVisible();
    // 7.0.1: the way back to the simple view is on the landing page too, before anyone is in (the app's own link, below,
    // is inside the app); the rollback has none, as before 7.0. Every way back carries a hash (7.11.0), so the simple
    // view's root never sends it on to the full view again; the landing page's own line too.
    const toFrontOutside = page.locator('#classicToFrontOutside a');
    if (SWITCHED) {
      await expect(page.locator('#classicToFrontOutside')).toHaveText(LINE);
      await expect(toFrontOutside).toBeVisible();
      await expect(toFrontOutside).toHaveText(BACK);
      const out = new URL(await toFrontOutside.getAttribute('href'), page.url());
      expect(out.pathname).toBe(V7_PATH);
      expect(out.hash).toBe('#/');
      // …and it can be pressed: the landing page covers the whole window, and starts below the line, never over it
      // (before 7.11.0 it covered the line, and a press never reached it)
      await toFrontOutside.click({ trial: true, timeout: 5_000 });
      await belowTheLine(page, '.landing-page');
    } else await expect(toFrontOutside).toHaveCount(0);
    const preview = new URL(await page.locator('#landingPreviewLink').getAttribute('href'), page.url());
    expect(preview.pathname).toBe(V7_PATH);
    expect(preview.hash).toBe('#/');
    await page.locator('#landingPreviewLink').click({ trial: true, timeout: 5_000 });   // and nothing lies over the landing page's own line
    await page.locator('#landingLookAround').click();   // the example plan (6.23.0): "Just try it" now opens the setup wizard for a plan of your own

    // Guest mode has started: the banner says so, and the example plan lives in this window only.
    await expect(page.locator('#guestBanner')).toBeVisible();
    await expect(page.locator('#guestBanner')).toContainText('Guest mode');
    const plans = await page.evaluate(() => JSON.parse(sessionStorage.getItem('pt_guest_scenarios') || '[]').length);
    expect(plans).toBe(1);

    // At 7.0 the way back to the simple view is at the top at every width (the header's own buttons are behind the menu on
    // a phone), and the header names the page; the rollback has neither, as before 7.0. Once the example plan is open the
    // link goes to that plan's home in the simple view (7.11.0: the banner points it at the plan that is open).
    const wide = page.viewportSize().width >= 900;
    const toFront = page.locator('#classicToFront a');
    const exampleId = await page.evaluate(() => JSON.parse(sessionStorage.getItem('pt_guest_scenarios') || '[]')[0].id);
    if (SWITCHED) {
      await expect(page.locator('#classicToFront')).toHaveText(LINE);
      await expect(toFront).toBeVisible();
      await expect(toFront).toHaveText(BACK);
      await expect.poll(async () => new URL(await toFront.getAttribute('href'), page.url()).hash, { timeout: 45_000 }).toBe('#/plan/' + exampleId);
      expect(new URL(await toFront.getAttribute('href'), page.url()).pathname).toBe(V7_PATH);
      await expect(page.locator('#classicToFrontOutside')).toBeHidden();   // one link at a time: the app's own, once in
    } else await expect(toFront).toHaveCount(0);
    if (wide) await expect(page.locator('header.header h1')).toHaveText(SWITCHED ? NAME : 'Pension Planner');

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

    // 7.8.0: the plan's verdict block on the stress page says the chance the money lasts as long as you do at the level, with
    // the count to the plan's age in the same block (the one render rule, both apps)
    await (wide ? page.locator('nav.tabs .tab[data-tab="stress"]') : page.locator(`button[data-on-click="mobileGo('stress')"]`)).click();
    // ("Run the test": the one test on the demo plan, its card opening with the verdict block)
    await page.locator('#stress-content button[data-on-click="runMonteCarloUI()"]').click();
    const chanceBlock = page.locator('#stress-content [data-chance-block]').first();
    await expect(chanceBlock).toBeVisible({ timeout: 120_000 });
    const weightedLine = chanceBlock.locator('[data-weighted]');
    if (await weightedLine.count()) {
      await expect(weightedLine.first()).toContainText(/times? in 20|every future we tried|none of the futures we tried/);
      await expect(chanceBlock.locator('[data-fixed]').first()).toContainText(/If (you live to|one of you is still alive when) /);
    } else await expect(chanceBlock.locator('[data-fixed]').first()).toContainText(/If (you live to|one of you is still alive when) /);
    expect(await chanceBlock.innerText()).not.toMatch(/undefined|NaN/);

    // and the way back lands on that plan in the simple view, and stays there (no bounce back to the full view)
    if (SWITCHED) {
      await toFront.click();
      await page.waitForURL((u) => new URL(u.href).pathname === V7_PATH && new URL(u.href).hash === '#/plan/' + exampleId);
      await expect(page.locator('#app')).toBeAttached();
      const went = await page.waitForURL((u) => atClassic(u.href), { timeout: 3_000 }).then(() => true, () => false);
      expect(went, 'the way back went on to the full view again').toBe(false);
    }
    // The `watch` fixture fails this test on any console error, uncaught error or failed request of the app's own.
  });

  // The sign-in screen covers the whole window too (7.11.0): it starts below the line naming the view, whose link can be
  // pressed there and takes the visitor to the simple view's front door.
  test('the sign-in screen starts below the line naming the view, and its way back can be pressed', async ({ page }) => {
    test.skip(!SWITCHED, 'the rollback layout has no such line, as before 7.0');
    await page.goto(PROD + CLASSIC_PATH + '?signin=1');
    await expect(page.locator('#signinForm')).toBeVisible({ timeout: 30_000 });
    const line = page.locator('#classicToFrontOutside');
    await expect(line).toHaveText(LINE);
    await line.locator('a').click({ trial: true, timeout: 5_000 });
    await belowTheLine(page, '.auth-screen');
    await page.locator('#signinEmail').click({ trial: true, timeout: 5_000 });
    await line.locator('a').click();
    await page.waitForURL((u) => new URL(u.href).pathname === V7_PATH && new URL(u.href).hash === '#/');
    await expect(page.locator('#app [data-screen]')).toHaveAttribute('data-screen', 'front', { timeout: 30_000 });
  });

  // Parity by presence (7.11.0): every page the full view has is still there. Counted, not looked at: a plan's stage can
  // hide a tab, and a phone puts the tab row behind the bottom bar.
  test('every page is there: the seven tabs, the bottom bar and its More sheet, every sub-page and every strategy page', async ({ page, watch }) => {
    watch.allow(WORKER_DATA_MISSING);
    await page.goto(PROD + CLASSIC_PATH);
    await page.locator('#landingLookAround').click();
    await expect(page.locator('#guestBanner')).toBeVisible();
    for (const tab of ['budget', 'stress', 'strategies', 'decision', 'accumulation', 'transition', 'household']) await expect(page.locator(`.tab[data-tab="${tab}"]`), tab).toHaveCount(1);
    await expect(page.locator('.tab[data-tab]')).toHaveCount(7);
    for (const m of ['budget', 'stress', 'strategies', 'decision', 'more']) await expect(page.locator(`[data-mtab="${m}"]`), m).toHaveCount(1);
    for (const sub of ['montecarlo', 'historical', 'scenarios', 'drawdown', 'glidepath', 'stresssettings']) await expect(page.locator(`.sub-tab[data-stresstab="${sub}"]`), sub).toHaveCount(1);
    for (const sub of ['entry', 'history', 'plandoc', 'taxyears', 'decisionsettings']) await expect(page.locator(`.sub-tab[data-decisiontab="${sub}"]`), sub).toHaveCount(1);
    const wide = page.viewportSize().width >= 900;
    if (!wide) {
      // the phone's More sheet: the tabs the bottom bar has no room for (src/ui/mobileMenu.js moreSheetHtml)
      await page.evaluate(() => window.openMobileMore());
      const sheet = page.locator('#mobileSheetBody');
      for (const t of ['accumulation', 'transition']) await expect(sheet.locator(`[data-on-click="mobileGo('${t}')"]`), t).toHaveCount(1);
      const household = await page.evaluate(() => { const b = document.querySelector('.tab[data-tab="household"]'); return !!b && b.style.display !== 'none'; });
      await expect(sheet.locator(`[data-on-click="mobileGo('household')"]`)).toHaveCount(household ? 1 : 0);
      await page.evaluate(() => window.closeMobileSheet());
    }
    await (wide ? page.locator('nav.tabs .tab[data-tab="strategies"]') : page.locator(`button[data-on-click="mobileGo('strategies')"]`)).click();
    for (const id of STRATEGY_LINKS) await expect.poll(() => page.locator(`[data-on-click*="showStrategyPage('${id}')"]`).count(), { message: id }).toBeGreaterThanOrEqual(1);
  });

  // Each strategy's own page still draws its dials (7.11.0): once, at 1440 (the dials are the same at every width).
  test.describe('each strategy page draws its dials', () => {
    test('the strategy pages are the ones the page defines', () => {
      const html = readFileSync(join(REPO, 'index.html'), 'utf8');
      const block = html.slice(html.indexOf('const STRATEGY_PAGES = {'), html.indexOf('const spec = STRATEGY_PAGES[id];'));
      expect([...block.matchAll(/^ {6}'([a-z-]+)': \{/gm)].map((m) => m[1]).sort()).toEqual([...STRATEGY_PAGES].sort());
    });
    for (const id of STRATEGY_PAGES) {
      test(id, async ({ page, watch }, testInfo) => {
        test.skip(testInfo.project.name !== 'desktop-1440', 'the dials are the same at every width: drawn once, at 1440');
        test.slow();
        watch.allow(WORKER_DATA_MISSING);
        await page.goto(PROD + CLASSIC_PATH);
        await page.locator('#landingLookAround').click();
        await expect(page.locator('#guestBanner')).toBeVisible();
        await page.locator('nav.tabs .tab[data-tab="strategies"]').click();
        // the tab opens on its overview: let it finish, so it does not land over the page asked for
        await expect(page.locator('#strategies-content').getByRole('heading', { name: /Which strategy\?.*ranked on your plan/ })).toBeVisible({ timeout: 45_000 });
        await page.evaluate((x) => window.showStrategyPage(x), id);
        expect(await page.evaluate(() => window._stratPage)).toBe(id);
        const box = page.locator('#stratPage');
        if (id === 'floor-the-schedule') await expect(box).toContainText('No dials', { timeout: 45_000 });
        else await expect.poll(() => box.locator('[data-on-change*="setSpecDial"]').count(), { timeout: 45_000 }).toBeGreaterThanOrEqual(1);
      });
    }
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
