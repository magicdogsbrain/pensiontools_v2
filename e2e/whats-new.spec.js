/**
 * What's new in the preview (research/v7/road-to-7.md step 11), on the PUBLISHED build, without an account:
 *   - a first-visit visitor with a plan in the window sees no pop-up and is marked seen silently (pt_lastSeenVersion);
 *   - a visitor who last saw an older version sees the once-only pop-up with every announced release since, "Got it" marks
 *     this version seen, and a reload shows nothing;
 *   - the page #/whats-new (the footer's link) lists every release in src/releases.js and the reconstructed history, the
 *     newest open, says the version you are on, and reading it marks seen.
 * No figure in any address; none of the preview's own words banned (the notes are quoted as written). Firebase is never reached.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test, expect, PROD, REPO, FIXED_NOW } from './helpers/app.js';
import { RELEASES, releasesSince } from '../src/releases.js';
import { RELEASE_HISTORY } from '../src/releases-history.js';
import { VERSION } from '../src/constants.js';

test.use({ outside: 'block' });

const GUEST_KEY = 'pt_guest_scenarios';
const SEEN_KEY = 'pt_lastSeenVersion';
const v7 = (hash) => PROD + '/v7/' + hash;
const OLD = '6.30.0';

function plan() {
  const alex = JSON.parse(readFileSync(join(REPO, 'tests', 'fixtures', 'plans', '12-lumpy-db-gia.json'), 'utf8'));
  alex.id = 'NewsPlan01'; alex.planDetails.name = 'Alex’s plan'; alex.isActive = true; delete alex.household;
  return alex;
}
async function plant(page, { seen = null } = {}) {
  await page.clock.setFixedTime(new Date(FIXED_NOW));
  await page.goto(v7('#/'));
  await expect(page.locator('#app [data-screen]')).toBeVisible();
  await page.evaluate(([k, text, sk, seenV]) => { sessionStorage.setItem(k, text); if (seenV) localStorage.setItem(sk, seenV); else localStorage.removeItem(sk); }, [GUEST_KEY, JSON.stringify([plan()]), SEEN_KEY, seen]);
  // a fresh page life: the pop-up is offered once per life, and a move to another address is not a new one
  await page.reload();
  await expect(page.locator('#app [data-screen]')).toBeVisible();
}
const seen = (page) => page.evaluate((k) => localStorage.getItem(k), SEEN_KEY);

test.describe('What\'s new, without an account', () => {
  test('a first visit is silent; an older mark brings the once-only pop-up; "Got it" marks this version; the page lists every release and marks seen', async ({ page }) => {
    test.setTimeout(180_000);
    const since = releasesSince(OLD);
    expect(since.length, 'releases to announce since ' + OLD).toBeGreaterThan(1);

    await test.step('a first-visit visitor with a plan: no pop-up, the mark set to this version', async () => {
      await plant(page);
      await page.goto(v7('#/plans'));
      await expect(page.getByTestId('plans.group.window')).toBeVisible();
      await expect(page.getByTestId('news.popup')).toHaveCount(0);
      await expect.poll(() => seen(page)).toBe(VERSION);
    });

    await test.step('a visitor who last saw ' + OLD + ': the pop-up, newest first, the announced releases only; "Got it"; nothing on a reload', async () => {
      await plant(page, { seen: OLD });
      await page.goto(v7('#/plans'));
      const popup = page.getByTestId('news.popup');
      await expect(popup).toBeVisible();
      await expect(popup).toContainText(`What’s new since you were last here (versions ${since[since.length - 1].version} to ${since[0].version})`);
      await expect(popup.locator('[data-quoted="release"]')).toHaveCount(since.length);
      await expect(popup.getByTestId(`news.release.${since[0].version}`)).toHaveAttribute('open', '');
      for (const r of since) await expect(popup.getByTestId(`news.release.${r.version}`)).toBeVisible();
      expect(await popup.locator('[data-testid="news.release.6.0.10"]').count()).toBe(0);
      await expect(page.getByTestId('news.seeAll')).toHaveAttribute('href', '#/whats-new');
      await page.getByTestId('news.gotIt').click();
      await expect(popup).toHaveCount(0);
      expect(await seen(page)).toBe(VERSION);
      await page.reload();
      await expect(page.getByTestId('plans.group.window')).toBeVisible();
      await expect(page.getByTestId('news.popup')).toHaveCount(0);
      expect(new URL(page.url()).hash).toBe('#/plans');
    });

    await test.step('the page: every release and the history, the newest open, the version you are on; reading it marks seen', async () => {
      await page.evaluate((k) => { localStorage.setItem(k, '6.30.0'); }, SEEN_KEY);
      await page.goto(v7('#/'));
      await expect(page.locator('#app [data-screen]')).toHaveAttribute('data-screen', 'front');
      await expect(page.getByTestId('nav.whatsNew')).toHaveText(`What’s new (version ${VERSION})`);
      await page.getByTestId('nav.whatsNew').click();
      await expect(page.locator('#app [data-screen]')).toHaveAttribute('data-screen', 'news');
      await expect(page.getByTestId('news.current')).toHaveText(`You are on version ${VERSION}.`);
      await expect(page.getByTestId('news.page')).toHaveAttribute('data-count', String(RELEASES.length));
      await expect(page.locator('[data-quoted="release"]')).toHaveCount(RELEASES.length + RELEASE_HISTORY.length);
      await expect(page.getByTestId(`news.release.${VERSION}`)).toHaveAttribute('open', '');
      await expect(page.getByTestId(`news.release.${RELEASES[1].version}`)).not.toHaveAttribute('open', '');
      await expect(page.getByTestId('news.history')).toBeVisible();
      await expect(page.getByTestId(`news.release.${RELEASE_HISTORY[0].version}`)).toBeVisible();
      await expect.poll(() => seen(page)).toBe(VERSION);
      expect(await page.locator('#app input, #app select, #app textarea').count()).toBe(0);
      const widths = await page.evaluate(() => ({ doc: document.documentElement.scrollWidth, win: window.innerWidth }));
      expect(widths.doc, 'no sideways scroll').toBeLessThanOrEqual(widths.win);
      // the page's own words (the notes left out) carry none of the planner's names
      const own = await page.evaluate(() => { const c = document.getElementById('app').cloneNode(true); for (const el of c.querySelectorAll('[data-quoted]')) el.remove(); return c.textContent; });
      expect(own).not.toMatch(/\bStress Tester\b|\bDecision tool\b|\bscenario\b|\bguest\b/i);
      expect(new URL(page.url()).hash).toBe('#/whats-new');
    });
  });
});
