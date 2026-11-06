/**
 * The published build, exactly as deployed, served with the real security headers (test plan 7.4; brief section 6).
 *
 *  - every V7 address opens with no security-policy violation, no console error, no failed request and
 *    nothing asked of any other site;
 *  - the forum guest's path once more, with the policy as the only thing looked at (the worker is where a
 *    policy would bite);
 *  - the published build carries no test hook: window.__pt is undefined and no file in it holds the text.
 *  - 7.0 (research/v7/switch-readiness.md §2 steps 5, 6 and 8): "do not index" is the classic page's, not V7's (in the
 *    rollback layout, the other way round); the files a person or a browser asks for by name (the privacy policy, the
 *    market data, the classic engine worker's copy, the kill-switch sw.js, the manifest) are served as files, never the
 *    single-page fallback; an old /v7/ link lands on the same place at the root; an old link to the root with the
 *    classic page's own options (?demo=1m, ?signup=1, ?signin=1) still opens the example plan or its account screens.
 *  - step 4: A's and B's addresses are in the walk above as soon as they are open (helpers/app.js ADDRESSES), and
 *    each question's first answer — and A's optional step, one more pass in the worker — breaks no policy.
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { test, expect, v7, waitsFor, fixtureTyping, mustFill, ADDRESSES, NEEDS, BUILT, DIST, PROD, TEST, REPO, FIXED_NOW, V7_PATH, CLASSIC_PATH, OLD_V7_PATH, OLD_CLASSIC_PATH, LAYOUT_UNDER_TEST, WORKER_DATA_MISSING } from './helpers/app.js';
import { parseHeaders, headersFor } from './helpers/serve.mjs';

const PUBLISHED_V7 = join(DIST, 'prod', V7_PATH);
/** Which page is never indexed: the classic page at 7.0; V7's page, the preview, in the rollback layout. */
const SWITCHED = LAYOUT_UNDER_TEST.name === 'switch';

function filesUnder(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) filesUnder(p, out); else out.push(p);
  }
  return out;
}

test.describe(`the published build of ${V7_PATH}`, () => {
  test(SWITCHED ? 'is served with the security headers of public/_headers, and indexed; the classic page is marked "do not index"' : 'is served with the security headers of public/_headers, and marked "do not index"', async ({ page }) => {
    const wanted = headersFor(parseHeaders(readFileSync(join(REPO, 'public', '_headers'), 'utf8')), V7_PATH);
    expect(wanted['Content-Security-Policy']).toBeTruthy();

    const response = await page.goto(PROD + V7_PATH);
    const got = response.headers();
    for (const [name, value] of Object.entries(wanted)) expect(got[name.toLowerCase()], name).toBe(value);
    if (SWITCHED) {
      expect(got['x-robots-tag']).toBeUndefined();
      await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
      // the one installable app: V7's page links the manifest, named PensionTools, starting at the site's root page
      const manifest = await page.locator('link[rel="manifest"]').getAttribute('href');
      const m = await page.request.get(new URL(manifest, page.url()).href);
      expect(m.headers()['x-e2e-fallback']).toBeUndefined();
      const body = await m.json();
      expect(body.name).toBe('PensionTools');
      expect(new URL(body.start_url, m.url()).pathname).toBe('/index.html');
    } else {
      expect(got['x-robots-tag']).toBe('noindex');
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
    }

    // The classic page carries the policy too; at 7.0 it is the one marked "do not index" (header and page), and links no manifest.
    const classic = await page.request.get(PROD + CLASSIC_PATH);
    expect(classic.headers()['content-security-policy']).toBe(wanted['Content-Security-Policy']);
    if (SWITCHED) {
      expect(classic.headers()['x-robots-tag']).toBe('noindex');
      const html = await classic.text();
      expect(html).toContain('<meta name="robots" content="noindex">');
      expect(html).not.toMatch(/rel="manifest"/);
    } else expect(classic.headers()['x-robots-tag']).toBeUndefined();
  });

  test('the files asked for by name are served as files, never the front page in their place', async ({ page }) => {
    const worker = new URL(LAYOUT_UNDER_TEST.classic.data, PROD + CLASSIC_PATH + 'assets/').pathname;
    const files = ['/privacy.html', '/data/gilts.json', '/data/equity.json', '/sw.js', ...(SWITCHED ? ['/manifest.json', worker + 'gilts.json', worker + 'equity.json'] : [])];
    for (const f of files) {
      const r = await page.request.get(PROD + f);
      expect(r.status(), f).toBe(200);
      expect(r.headers()['x-e2e-fallback'], f).toBeUndefined();
      if (f.endsWith('.json')) expect(typeof JSON.parse(await r.text()), f).toBe('object');
    }
    // the policy, as a person opens it from a footer
    await page.goto(PROD + '/privacy.html');
    await expect(page.getByRole('heading', { level: 1, name: 'Privacy Policy' })).toBeVisible();
  });

  test('an old link to the preview\'s address lands on the same place at the root', async ({ page }) => {
    test.skip(!SWITCHED, 'the rollback layout serves the preview itself at that address');
    const app = v7(page, 'prod');
    await page.clock.setFixedTime(new Date(FIXED_NOW));
    await page.goto(PROD + OLD_V7_PATH + '#/plans');
    await expect(page).toHaveURL(PROD + V7_PATH + '#/plans');
    await app.at('plans');
    await page.goto(PROD + OLD_V7_PATH + 'index.html#/c/numbers');
    await expect(page).toHaveURL(PROD + V7_PATH + '#/c/numbers');
    await app.at('c.numbers');
    // the folder without its slash, as an old bookmark may have it: the host adds the slash, then the forward
    await page.goto(PROD + OLD_V7_PATH.slice(0, -1));
    await expect(page).toHaveURL(PROD + V7_PATH);
    await app.at('front');
  });

  test('the page has one module script and nothing inline', async ({ page }) => {
    await page.goto(PROD + V7_PATH);
    const found = await page.evaluate(() => ({
      scripts: [...document.scripts].map((s) => ({ type: s.type, src: s.getAttribute('src'), inline: !s.src && s.textContent.trim().length > 0 })),
      styles: document.querySelectorAll('style').length,
      styled: document.querySelectorAll('html[style], head [style], body[style]').length,
      handlers: [...document.querySelectorAll('*')].filter((el) => [...el.attributes].some((a) => /^on/i.test(a.name))).length
    }));
    expect(found.scripts).toHaveLength(1);
    expect(found.scripts[0].type).toBe('module');
    expect(found.scripts[0].inline).toBe(false);
    expect(found.scripts[0].src).toMatch(/^\.\/assets\/[\w.-]+\.js$/);
    expect(found.styles).toBe(0);
    expect(found.handlers).toBe(0);
  });

  test('every address opens cleanly: no policy violation, no console error, no failed request', async ({ page }) => {
    const app = v7(page, 'prod');
    await app.open('#/');
    await app.ready();
    for (const { hash, screen } of ADDRESSES) {
      await test.step(hash, async () => {
        await app.go(hash);
        expect(await app.screen(), hash).toBe(screen);
        // An answer needs figures; with none typed, every address settles.
        await app.ready();
      });
    }
    // And each opened cold, as a link from somewhere else (a fresh load is where a blocked script would show).
    for (const { hash, screen } of ADDRESSES) {
      await page.goto('about:blank');
      await app.open(hash);
      await app.ready();
      expect(await app.screen(), hash).toBe(screen);
    }
    // The `watch` fixture fails this test if anything was blocked or logged.
  });

  test('the forum guest\'s path breaks no policy (the answer is worked out in a worker)', async ({ page }) => {
    waitsFor('screens', 'shell');
    const app = v7(page, 'prod');
    await app.open('#/');
    await app.type('front.c.pot', '250000', { path: 'you.pot' });
    await app.click('front.c.show');
    await app.type('c.you.age', '58', { path: 'you.age' });
    await app.click('c.action.show');
    await app.ready(60_000);
    await expect(page.locator('[data-headline="monthly.careful"]')).toBeVisible();
    await expect(page.locator('#app')).toHaveAttribute('data-answer', 'final');
  });

  for (const q of ['a', 'b']) {
    test(`question ${q.toUpperCase()}'s first answer breaks no policy (the worker, the extra pass)`, async ({ page }) => {
      waitsFor(...NEEDS[q]);
      test.setTimeout(180_000);
      const typing = fixtureTyping(q === 'a' ? 'A1' : 'B3');
      const app = v7(page, 'prod', q);
      await app.open(`#/${q}/numbers`);
      await app.ready();
      await app.fill(Object.fromEntries(mustFill(q, typing).map((p) => [p, typing[p]])));
      await app.click(`${q}.action.show`);
      await app.at(`${q}.answer`);
      await app.ready(120_000);
      await expect(page.locator('#app')).toHaveAttribute('data-answer', 'final');
      // A and B each lead with their verdict (B: on course or not, and what would be enough, the number a guide under it)
      await expect(page.locator('#app [data-headline="verdict"]').first()).toBeVisible();
      if (BUILT.extend) {
        await app.rail(q === 'a' ? 'ages' : 'choices');
        await app.partialThenFinal(180_000);
      }
      // The `watch` fixture fails this test if anything was blocked or logged.
    });
  }

  test('carries no test hook', async ({ page }) => {
    const app = v7(page, 'prod');
    await app.open('#/');
    await app.ready();
    expect(await page.evaluate(() => typeof window.__pt)).toBe('undefined');

    // No file of the published V7 build holds the hook's name.
    expect(existsSync(PUBLISHED_V7), `${PUBLISHED_V7} — run "npm run e2e:build"`).toBe(true);
    const files = filesUnder(PUBLISHED_V7);
    expect(files.length).toBeGreaterThan(1);
    const holding = files.filter((f) => /\.(js|mjs|html|css|json|map)$/.test(f) && readFileSync(f, 'utf8').includes('__pt'));
    expect(holding).toEqual([]);
  });

  test('the test build is the one with the hook', async ({ page }) => {
    waitsFor('hooks');
    await page.goto(TEST + V7_PATH);
    await expect(page.locator('#app [data-screen]')).toBeVisible();
    expect(await page.evaluate(() => typeof window.__pt)).toBe('object');
    expect(BUILT.hooks).toBe(true);
  });
});

// Links shared while the classic page was the site's root carry its options in the query. At 7.0 the root is V7, which
// passes them on to the classic planner (src/v7/effects/address.js); in the rollback layout the root is the classic page
// itself. Either way the link does what it did. The classic page would call Firebase: every request outside the local
// server is stopped quietly, as in old-app-unchanged.spec.js, so no account is reached.
test.describe('an old link to the site\'s root with the classic page\'s options', () => {
  test.use({ outside: 'block' });
  const landsOnClassic = async (page, search) => {
    await expect.poll(() => new URL(page.url()).pathname, { timeout: 15_000 }).toBe(CLASSIC_PATH);
    expect(new URL(page.url()).search).toBe(search);
  };

  test('?demo=1m opens the example plan in the classic planner, without an account', async ({ page, watch }) => {
    watch.allow(WORKER_DATA_MISSING);
    await page.goto(PROD + OLD_CLASSIC_PATH + '?demo=1m');
    await landsOnClassic(page, '?demo=1m');
    await expect(page.locator('#guestBanner')).toBeVisible({ timeout: 20_000 });
    expect(await page.evaluate(() => JSON.parse(sessionStorage.getItem('pt_guest_scenarios') || '[]').length)).toBe(1);
  });
  for (const tab of ['signup', 'signin']) {
    test(`?${tab}=1 opens the classic planner's ${tab === 'signup' ? 'sign-up' : 'sign-in'} screen`, async ({ page }) => {
      await page.goto(PROD + OLD_CLASSIC_PATH + `?${tab}=1`);
      await landsOnClassic(page, `?${tab}=1`);
      await expect(page.locator(`#${tab}Form`)).toBeVisible();
      await expect(page.locator(`.auth-screen-tab.active[data-tab="${tab}"]`)).toBeVisible();
      // 7.0.1: the way back to the front page is on the sign-in screen too, which is drawn outside the app
      if (SWITCHED) await expect(page.locator('#classicToFrontOutside a')).toBeVisible();
      else await expect(page.locator('#classicToFrontOutside')).toHaveCount(0);
    });
  }
});
