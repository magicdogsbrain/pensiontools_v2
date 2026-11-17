/**
 * The slider on an answer moves the answer it sits on (reported from the live site, 16 Nov 2026: on "What does it pay a
 * month?" the slider "What if you took this a month?" moved, and only one small line under it changed — the headline, the
 * chance, the run-out ages and what it is made of all stayed at the amount worked out at the level).
 *
 * The test build (checkScreen runs on the page), at desktop-1440 and phone-390, without an account:
 *   C  drag the slider well past the level's amount: the headline reads "Taking £… a month" at the slider's amount, the
 *      chance line is that amount's (weighted, its fixed-age line beside it), the level's amount stays in view under the
 *      slider with "Back to £…", and the three tiles stay the most at each level; "Back to £…" puts the slider and the
 *      page back to the level's amount. Nothing scrolls sideways.
 *   B  the slider (what goes in a month) moves where paying in gets you, and the verdict's words;
 *   D  the slider (what you take a month) moves the verdict's line and the amount in the tiles.
 * The figures are made up, round, and nobody's: one person of 58 with £250,000 (C); Alex, 34, saving (B); Sam, 68 (D).
 */
import { test, expect, v7, waitsFor, checkScreenOnPage } from './helpers/app.js';

const C_TYPED = { 'you.pot': '250000', 'you.age': '58' };
/** Alex, 34, saving (made up): £41,000 in a pension, £250 a month going in, stopping at 65, wanting £2,000 a month. */
const ALEX = { 'you.age': '34', 'you.pot': '41000', 'you.payIn.total': '250', 'stop.age': '65', 'spend.amount': '2000' };
/** Sam, 68, retired (made up): £300,000 in a pension, £40,000 saved, £1,650 a month. */
const SAM = { 'you.age': '68', 'you.pot': '300000', 'you.taxFreeTaken': 'no', savings: '40000', 'spend.amount': '1650' };

async function noSideways(page) {
  const { sw, cw } = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
  expect(sw, 'the page scrolls sideways').toBeLessThanOrEqual(cw);
}

/** A mouse drag along a slider's track, from where its thumb is to `to` (a share of the track), a step at a time. */
async function drag(page, slider, to) {
  // (in view first: a press further down the page, such as a level, leaves the slider above the window)
  await slider.scrollIntoViewIfNeeded();
  const box = await slider.boundingBox();
  const min = Number(await slider.getAttribute('min'));
  const max = Number(await slider.getAttribute('max'));
  const value = Number(await slider.inputValue());
  const from = max > min ? (value - min) / (max - min) : 0;
  const y = box.y + box.height / 2;
  const frame = () => page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => r()))));
  await page.mouse.move(box.x + box.width * from, y);
  await page.mouse.down();
  for (let i = 1; i <= 10; i++) { await page.mouse.move(box.x + box.width * (from + ((to - from) * i) / 10), y); await frame(); }
  await page.mouse.up();
}

test.describe('the slider moves the answer it sits on', () => {
  test.beforeEach(() => waitsFor('screens', 'shell'));

  test('C: dragged, the whole answer reads for the slider\'s amount; "Back to" puts it back', async ({ page }) => {
    test.setTimeout(300_000);
    const app = v7(page, 'test');
    await app.open('#/c/numbers');
    await app.ready();
    await app.fill(C_TYPED);
    await app.click('c.action.show');
    await app.at('c.answer');
    await app.ready(120_000);

    const levelHead = page.locator('#app [data-headline="levels.balanced.monthly"]');
    await expect(levelHead).toBeVisible();
    const solved = Number(await levelHead.locator('[data-key="levels.balanced.monthly"]').first().getAttribute('data-value'));
    const solvedLine = await levelHead.locator('[data-sentence="levels.balanced.monthly"]').innerText();
    const slider = app.id('c.slider.input');
    expect(Number(await slider.inputValue())).toBe(solved);
    await expect(app.id('c.answer.back')).toHaveCount(0);

    // dragged well past the level's amount
    await drag(page, slider, 0.85);
    const tried = Number(await slider.inputValue());
    expect(tried).toBeGreaterThan(solved);
    // the way back is there as soon as the slider moves, and while the answer is worked out again
    await expect(app.id('c.answer.back')).toBeVisible();
    await app.ready(120_000);

    const head = page.locator('#app [data-headline="take.perMonth"]');
    await expect(head).toBeVisible();
    await expect(levelHead).toHaveCount(0);
    await expect(head.locator('#answer-figure')).toHaveText(/^Taking £[\d,]+ a month$/);
    await expect(head.locator('#answer-figure [data-key="take.perMonth"]')).toHaveAttribute('data-value', String(tried));
    // its chance: the page's own measure (weighted), not the level's line, with the fixed-age line beside it
    const line = head.locator('[data-sentence="take.perMonth"]');
    await expect(line).toHaveAttribute('data-weighted', '1');
    await expect(line).toContainText('the money lasts as long as you do');
    expect(await line.innerText()).not.toBe(solvedLine);
    await expect(head.locator('[data-testid="lasts.fixed"]')).toContainText(/^If you live to \d+, the money lasts that long /);
    await expect(head).toContainText('the worst 1 in 10');
    // the slider's card: the level's amount kept in view, no second measure
    const card = app.id('c.slider');
    await expect(card).not.toContainText(/futures? out of 10|lasted to/);
    await expect(app.id('c.answer.solved')).toContainText(/^At Balanced you could take about £[\d,]+ a month\./);
    await expect(app.id('c.answer.solved').locator('[data-key="levels.balanced.monthly"]').first()).toHaveAttribute('data-value', String(solved));
    // the three tiles stay the most at each level
    await expect(page.locator('#app [data-testid="c.tiles"] [data-tile="balanced"] [data-key="levels.balanced.monthly"]')).toHaveAttribute('data-value', String(solved));
    // Keep asks which amount the plan keeps (7.12.0): the one tried, or the level's; neither is chosen for you
    await expect(app.id('c.keep.trying')).toHaveCount(0);
    await expect(app.id('c.action.save.level').locator('[data-key="levels.balanced.monthly"]').first()).toHaveAttribute('data-value', String(solved));
    await expect(app.id('c.action.save.tried')).toContainText('(the amount you are trying)');
    expect(await checkScreenOnPage(page)).toEqual([]);
    await noSideways(page);

    // "Back to £…": the slider and the page as they were
    await app.click('c.answer.back');
    await app.ready(120_000);
    await expect(levelHead).toBeVisible();
    await expect(head).toHaveCount(0);
    await expect(levelHead.locator('[data-sentence="levels.balanced.monthly"]')).toHaveText(solvedLine);
    expect(Number(await slider.inputValue())).toBe(solved);
    await expect(app.id('c.answer.back')).toHaveCount(0);
    await expect(app.id('c.take')).toHaveValue('');
    expect(await checkScreenOnPage(page)).toEqual([]);
    await noSideways(page);
  });

  // (a sceptical walk of the fix: a level pressed while an amount was tried changed nothing above it, and new figures on
  // step 1 opened on the amount tried for the old ones)
  test('C: an amount tried goes when a level is chosen, and when the figures on step 1 change', async ({ page }) => {
    test.setTimeout(300_000);
    const app = v7(page, 'test');
    await app.open('#/c/numbers');
    await app.ready();
    await app.fill(C_TYPED);
    await app.click('c.action.show');
    await app.at('c.answer');
    await app.ready(120_000);
    const slider = app.id('c.slider.input');
    const take = page.locator('#app [data-headline="take.perMonth"]');

    await drag(page, slider, 0.85);
    await app.ready(120_000);
    await expect(take).toBeVisible();
    // Careful chosen: the page reads at Careful's amount, and the slider stands on it
    await app.click('c.level.careful');
    await app.ready(120_000);
    const careful = page.locator('#app [data-headline="levels.careful.monthly"]');
    await expect(careful).toBeVisible();
    await expect(take).toHaveCount(0);
    await expect(app.id('c.answer.back')).toHaveCount(0);
    expect(await slider.inputValue()).toBe(await careful.locator('[data-key="levels.careful.monthly"]').first().getAttribute('data-value'));

    // tried again, then other figures on step 1: the answer for them opens on its level's amount
    await drag(page, slider, 0.85);
    await app.ready(120_000);
    await expect(take).toBeVisible();
    await app.go('#/c/numbers');
    await app.fill({ 'you.pot': '400000', 'you.age': '63' });
    await app.click('c.action.show');
    await app.at('c.answer');
    await app.ready(120_000);
    const head = page.locator('#app [data-headline="levels.careful.monthly"]');
    await expect(head).toBeVisible();
    await expect(take).toHaveCount(0);
    await expect(app.id('c.answer.back')).toHaveCount(0);
    expect(await slider.inputValue()).toBe(await head.locator('[data-key="levels.careful.monthly"]').first().getAttribute('data-value'));
    expect(await checkScreenOnPage(page)).toEqual([]);
    await noSideways(page);
  });

  test('B: the slider moves where paying in gets you', async ({ page }) => {
    test.setTimeout(300_000);
    const app = v7(page, 'test', 'b');
    await app.open('#/b/numbers');
    await app.ready();
    await app.fill(ALEX);
    await app.click('b.action.show');
    await app.at('b.answer');
    await app.ready(120_000);
    const where = page.locator('#app [data-testid="b.tiles"] [data-key="potAtStop.now.careful"]');
    const before = await where.getAttribute('data-value');
    const words = await page.locator('#app [data-region="answer"]').innerText();
    const slider = app.id('b.slider.input');
    await slider.focus();
    await page.keyboard.press('End');
    await app.ready(120_000);
    await expect(where).not.toHaveAttribute('data-value', before);
    expect(await page.locator('#app [data-region="answer"]').innerText()).not.toBe(words);
    await noSideways(page);
  });

  test('D: the slider moves the verdict and what you take', async ({ page }) => {
    test.setTimeout(300_000);
    const app = v7(page, 'test', 'd');
    await app.open('#/d/numbers');
    await app.ready();
    await app.fill(SAM);
    await app.click('d.action.show');
    await app.at('d.answer');
    await app.ready(120_000);
    const verdict = page.locator('#app [data-sentence="verdict"]');
    const before = await verdict.innerText();
    const slider = app.id('d.slider.input');
    await drag(page, slider, 0.9);
    const now = Number(await slider.inputValue());
    await app.ready(120_000);
    await expect(page.locator('#app [data-testid="d.tiles"] [data-key="spend.perMonth"]')).toHaveAttribute('data-value', String(now));
    expect(await verdict.innerText()).not.toBe(before);
    await noSideways(page);
  });
});
