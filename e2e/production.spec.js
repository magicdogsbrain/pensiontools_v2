/**
 * The published build, exactly as deployed, served with the real security headers (test plan 7.4; brief section 6).
 *
 *  - every V7 address opens with no security-policy violation, no console error, no failed request and
 *    nothing asked of any other site;
 *  - the forum guest's path once more, with the policy as the only thing looked at (the worker is where a
 *    policy would bite);
 *  - the published build carries no test hook: window.__pt is undefined and no file in it holds the text.
 *  - step 4: A's and B's addresses are in the walk above as soon as they are open (helpers/app.js ADDRESSES), and
 *    each question's first answer — and A's optional step, one more pass in the worker — breaks no policy.
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { test, expect, v7, waitsFor, fixtureTyping, mustFill, ADDRESSES, NEEDS, BUILT, DIST, PROD, TEST, REPO } from './helpers/app.js';
import { parseHeaders, headersFor } from './helpers/serve.mjs';

const PUBLISHED_V7 = join(DIST, 'prod', 'v7');

function filesUnder(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) filesUnder(p, out); else out.push(p);
  }
  return out;
}

test.describe('the published build of /v7/', () => {
  test('is served with the security headers of public/_headers, and marked "do not index"', async ({ page }) => {
    const wanted = headersFor(parseHeaders(readFileSync(join(REPO, 'public', '_headers'), 'utf8')), '/v7/');
    expect(wanted['Content-Security-Policy']).toBeTruthy();

    const response = await page.goto(PROD + '/v7/');
    const got = response.headers();
    for (const [name, value] of Object.entries(wanted)) expect(got[name.toLowerCase()], name).toBe(value);
    expect(got['x-robots-tag']).toBe('noindex');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');

    // The current app's page carries the policy too, and is not marked "do not index".
    const home = await page.request.get(PROD + '/');
    expect(home.headers()['content-security-policy']).toBe(wanted['Content-Security-Policy']);
    expect(home.headers()['x-robots-tag']).toBeUndefined();
  });

  test('the page has one module script and nothing inline', async ({ page }) => {
    await page.goto(PROD + '/v7/');
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
      // B: the pay-in when short (its one headline, the number a guide under it), the number when on course
      await expect(page.locator(q === 'a' ? '#app [data-headline="verdict"]' : '#app [data-headline="payIn.needed"], #app [data-headline="number.careful"]').first()).toBeVisible();
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
    await page.goto(TEST + '/v7/');
    await expect(page.locator('#app [data-screen]')).toBeVisible();
    expect(await page.evaluate(() => typeof window.__pt)).toBe('object');
    expect(BUILT.hooks).toBe(true);
  });
});
