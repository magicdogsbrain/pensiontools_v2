/**
 * The first visit (7.5.0; research/v7/mockups/first-visit.html and its README), on the PUBLISHED build, without an account,
 * every request outside the site stopped (nothing signs in, no account is touched), at desktop-1440 and phone-390:
 *   - the stranger's front door: one headline, the life as a picture, three doors in the order of a life, the other
 *     questions as plain links; nothing scrolls sideways; no account mentioned;
 *   - a personal answer in under a minute: "Already retired" → four things → "Will it last?" → the answer with its slider,
 *     three figures and the pot over the years ahead drawn from those figures; the slider moved by the keyboard works it
 *     out again; "Still saving" → "Am I saving enough?" draws the rising half;
 *   - Keep → sign in: the Keep line opens the question's own Keep step, and only there is the account asked for;
 *   - no limit: with the free hours used up, the questions still answer, with no stop and no reminder;
 *   - with less motion asked for, the pictures are drawn complete and nothing moves.
 * The figures are made up (Alex and Sam, round figures). Screenshots of the four screens of the mock-up go to
 * E2E_SHOTS (the lead's folder), when it is set.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test, expect, v7, PROD, REPO, FIXED_NOW, V7_PATH } from './helpers/app.js';
import { KEY_MINUTES, GUEST_ALLOWANCE_MINUTES } from '../src/services/GuestMeter.js';
import { FRONT } from '../src/v7/copy/common.js';

test.use({ outside: 'block' });

const SHOTS = process.env.E2E_SHOTS || null;
/** Sam, 68, retired (made up): £300,000 in a pension, £40,000 saved, £1,650 a month. */
const SAM = { 'you.age': '68', 'you.pot': '300000', 'you.taxFreeTaken': 'no', savings: '40000', 'spend.amount': '1650' };
/** Alex, 34, saving (made up): £41,000 in a pension, £250 a month going in, stopping at 65, wanting £2,000 a month. */
const ALEX = { 'you.age': '34', 'you.pot': '41000', 'you.payIn.total': '250', 'stop.age': '65', 'spend.amount': '2000' };

async function noSideways(page) {
  const { sw, cw } = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
  expect(sw, 'the page scrolls sideways').toBeLessThanOrEqual(cw);
}
async function shot(page, name, testInfo) {
  if (!SHOTS) return;
  const width = page.viewportSize().width;
  await page.screenshot({ path: `${SHOTS}/${name}-${width}.png`, fullPage: true });
  void testInfo;
}

test.describe('the first visit', () => {
  test('the front door: one headline, the life as a picture, three doors, the other questions one tap away', async ({ page }, testInfo) => {
    const app = v7(page, 'prod');
    await app.open('#/');
    await app.ready();
    await expect(page.locator('#app h1')).toHaveText(FRONT.stranger.title.join(''));
    await expect(app.id('front.life')).toBeVisible();
    await expect(page.locator('#app [data-door]')).toHaveCount(3);
    for (const q of ['b', 'c', 'd']) await expect(app.id(`front.q.${q}`)).toBeVisible();
    for (const q of ['a', 'f', 'e']) await expect(app.id(`front.q.${q}`)).toBeVisible();
    await expect(page.locator('#app main')).not.toContainText(/sign in|sign up|create an account|free hours/i);
    await noSideways(page);
    // the fonts are the site's own: every font file asked for came from this site
    const fonts = await page.evaluate(() => performance.getEntriesByType('resource').filter((e) => /\.woff2/.test(e.name)).map((e) => new URL(e.name).origin));
    for (const o of fonts) expect(o).toBe(new URL(page.url()).origin);
    await shot(page, '1-front', testInfo);

    // the doors: B and D open their question's numbers; C takes its first number in the door
    await app.click('front.q.b');
    await app.at('b.numbers');
    await app.open('#/');
    await app.click('front.q.d');
    await app.at('d.numbers');
    await app.open('#/');
    await app.type('front.c.pot', '250000', { path: 'you.pot' });
    await app.click('front.c.show');
    await app.at('c.numbers');
  });

  test('a personal answer in under a minute: "Already retired", four things, the answer drawn from them; the slider works it out again', async ({ page }, testInfo) => {
    test.setTimeout(180_000);
    const app = v7(page, 'prod', 'd');
    const started = Date.now();
    await app.open('#/');
    await app.ready();
    await app.click('front.q.d');
    await app.at('d.numbers');
    await app.fill(SAM);
    await app.click('d.action.show');
    await app.at('d.answer');
    await app.ready(60_000);
    expect(Date.now() - started, 'a personal answer in under a minute').toBeLessThan(60_000);
    // the three figures, the pot over the years ahead, the Keep line — all on the page, all the answer's own
    await expect(page.locator('#app [data-testid="d.tiles"] .fig-tile')).toHaveCount(3);
    await expect(page.locator('#app [data-testid="d.tiles"] [data-key="spend.perMonth"]')).toHaveText('£1,650');
    const pot = app.id('d.pot');
    await expect(pot).toBeVisible();
    await expect(pot.locator('path.pot-band')).toHaveCount(1);
    await expect(pot.locator('[data-mark="you"]')).toHaveAttribute('data-pounds', '340000');
    await expect(app.id('d.pot.legend').locator('li')).toHaveCount(3);
    // 7.8.0: the verdict said as the chance the money lasts as long as you do, the count to one named age beside it, and
    // "How careful?" beside the verdict — all fitting the width
    await expect(page.locator('#app [data-sentence="verdict"]')).toHaveAttribute('data-weighted', '1');
    await expect(page.locator('#app [data-sentence="verdict"]')).toContainText(/^Counting how long people your age live, £1,650 a month after tax lasts as long as you do /);
    await expect(page.locator('#app [data-testid="lasts.fixed"]').first()).toContainText(/^If you live to \d+, the money lasts that long /);
    await expect(app.id('d.level')).toBeVisible();
    await expect(app.id('d.level').locator('button[aria-pressed="true"]')).toHaveText('18 times in 20: Balanced (we start here)');
    await noSideways(page);
    await shot(page, '3-retired', testInfo);

    // the slider: reached by the keyboard, it moves what you take and the answer is worked out again
    const slider = app.id('d.slider.input');
    await slider.focus();
    const before = await slider.inputValue();
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');
    await expect(slider).not.toHaveValue(before);
    const now = Number(await slider.inputValue());
    await app.ready(60_000);
    await expect(page.locator('#app [data-testid="d.tiles"] [data-key="spend.perMonth"]')).toHaveAttribute('data-value', String(now));
  });

  test('the slider holds its range while it moves, and neither end loses the answer (the 7.5.0 review)', async ({ page }) => {
    test.setTimeout(180_000);
    const app = v7(page, 'prod', 'd');
    await app.open('#/d/numbers');
    await app.ready();
    await app.fill(SAM);
    await app.click('d.action.show');
    await app.at('d.answer');
    await app.ready(60_000);
    const slider = app.id('d.slider.input');
    const max = await slider.getAttribute('max');
    // a mouse drag from 40% of the track past its right end, a step at a time, as a hand does
    const box = await slider.boundingBox();
    const y = box.y + box.height / 2;
    await page.mouse.move(box.x + box.width * 0.4, y);
    await page.mouse.down();
    // a frame drawn between moves, so each move meets the page the last one left
    const frame = () => page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => r()))));
    for (let i = 1; i <= 12; i++) { await page.mouse.move(box.x + box.width * (0.4 + i * 0.06), y); await frame(); }
    await page.mouse.up();
    await app.ready(60_000);
    await expect(slider).toHaveAttribute('max', max);
    await expect(slider).toHaveValue(max);
    await expect(app.id('d.tiles')).toBeVisible();
    // the keyboard's two ends: the answer stays, the box takes the figure the slider wrote
    await slider.focus();
    await page.keyboard.press('Home');
    await app.ready(60_000);
    await expect(slider).toBeVisible();
    await expect(app.id('d.tiles')).toBeVisible();
    expect(Number(await slider.inputValue())).toBeGreaterThanOrEqual(1);
    await expect(slider).toHaveAttribute('max', max);
    await slider.focus();
    await page.keyboard.press('End');
    await app.ready(60_000);
    await expect(slider).toHaveValue(max);
    await expect(slider).toHaveAttribute('max', max);
  });

  test('each door is one target: a press anywhere on the "Still saving" card opens its question', async ({ page }) => {
    const app = v7(page, 'prod');
    await app.open('#/');
    await app.ready();
    const door = page.locator('#app [data-door="b"]');
    const box = await door.boundingBox();
    await page.mouse.click(box.x + box.width / 2, box.y + box.height - 12);
    await app.at('b.numbers');
  });

  test('"Am I saving enough?" draws the rising half: the pot today, what paying in as now comes to, and what would be enough', async ({ page }, testInfo) => {
    test.setTimeout(240_000);
    const app = v7(page, 'prod', 'b');
    await app.open('#/');
    await app.ready();
    await app.click('front.q.b');
    await app.at('b.numbers');
    await app.fill(ALEX);
    await app.click('b.action.show');
    await app.at('b.answer');
    await app.ready(120_000);
    const pot = app.id('b.pot');
    await expect(pot).toBeVisible();
    await expect(pot.locator('[data-mark="you"]')).toHaveAttribute('data-pounds', '41000');
    await expect(pot.locator('path[data-series="now"]')).toHaveCount(1);
    await expect(pot.locator('path.pot-band')).toHaveCount(1);
    await expect(page.locator('#app [data-testid="b.tiles"] .fig-tile')).toHaveCount(3);
    await expect(app.id('b.slider.input')).toBeVisible();
    await noSideways(page);
    await shot(page, '2-saving', testInfo);
  });

  test('Keep → sign in: the Keep line opens the question\'s own Keep step, the one place the account is asked for', async ({ page }) => {
    test.setTimeout(180_000);
    const app = v7(page, 'prod', 'd');
    await app.open('#/d/numbers');
    await app.ready();
    await app.fill(SAM);
    await app.click('d.action.show');
    await app.at('d.answer');
    await app.ready(60_000);
    // the answer itself asks for nothing: the account is the Keep panel's (at its foot) and the Keep step's alone
    await expect(page.locator('#app [data-region="answer"]')).not.toContainText(/sign in|sign up|create an account/i);
    await app.click('d.keepLine.keep');
    await app.at('d.keep');
    await expect(app.id('d.action.save')).toBeVisible();
    await app.click('d.keep.signInFirst');
    await app.at('account');
  });

  test('no limit on the questions: with the free hours used up, an answer is still given, with no stop and no reminder', async ({ page }) => {
    test.setTimeout(180_000);
    await page.addInitScript(([k, v]) => { try { localStorage.setItem(k, v); } catch { /* none */ } }, [KEY_MINUTES, String(GUEST_ALLOWANCE_MINUTES + 20)]);
    const app = v7(page, 'prod', 'd');
    await app.open('#/');
    await app.ready();
    await expect(app.id('guest.stop')).toHaveCount(0);
    await app.click('front.q.d');
    await app.fill(SAM);
    await app.click('d.action.show');
    await app.at('d.answer');
    await app.ready(60_000);
    await expect(app.id('d.pot')).toBeVisible();
    await expect(app.id('guest.stop')).toHaveCount(0);
    await expect(app.id('guest.remindBox')).toHaveCount(0);
    await expect(app.id('guest.reminder')).toHaveCount(0);
  });

  test('with less motion asked for, every picture is drawn complete at once and nothing moves', async ({ page }) => {
    test.setTimeout(180_000);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const app = v7(page, 'prod', 'd');
    await app.open('#/');
    await app.ready();
    const still = (sel) => page.locator(sel).first().evaluate((el) => { const cs = getComputedStyle(el); return { animation: cs.animationName, clip: cs.clipPath, opacity: cs.opacity }; });
    expect(await still('.life-svg')).toEqual({ animation: 'none', clip: 'none', opacity: '1' });
    await app.click('front.q.d');
    await app.fill(SAM);
    await app.click('d.action.show');
    await app.at('d.answer');
    await app.ready(60_000);
    expect(await still('.pot-svg')).toEqual({ animation: 'none', clip: 'none', opacity: '1' });
    expect(await still('.pot-band')).toMatchObject({ animation: 'none', opacity: '1' });
    expect(await page.locator('.is-counting').count()).toBe(0);
  });

  test('the record keeper\'s home: the stage strip and the year — a running plan (made up) kept in this window', async ({ page }, testInfo) => {
    test.setTimeout(120_000);
    // Sam's locked Buckets plan from the fictional corpus, planted in this window as plan-home.spec.js plants it
    const plan = JSON.parse(readFileSync(join(REPO, 'tests', 'fixtures', 'plans', '04-buckets-running.json'), 'utf8'));
    plan.id = 'HomeBuckets04';
    plan.planDetails = { ...(plan.planDetails || {}), name: 'Sam’s plan' };
    delete plan.household;
    plan.isActive = true;
    await page.clock.setFixedTime(new Date(FIXED_NOW));
    await page.goto(PROD + V7_PATH + '#/');
    await expect(page.locator('#app [data-screen]')).toBeVisible();
    await page.evaluate(([k, text]) => { sessionStorage.setItem(k, text); }, ['pt_guest_scenarios', JSON.stringify([plan])]);
    await page.goto(PROD + V7_PATH + '#/plan/HomeBuckets04');
    await expect(page.locator('#app [data-testid="plan.home"]')).toBeVisible({ timeout: 60_000 });
    const strip = page.getByTestId('plan.home.strip');
    await expect(strip).toBeVisible();
    await expect(strip.locator('.strip-dot')).toHaveCount(1);
    await expect(page.getByTestId('plan.home.year').locator('.year-cell')).toHaveCount(12);
    await noSideways(page);
    await shot(page, '4-home', testInfo);
  });
});
