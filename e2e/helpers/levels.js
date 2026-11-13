/**
 * 7.8.0 (research/v7/replan-nov-2026.md 5; the build spec's section 10, e2e): the chance the money lasts as long as you
 * do, as an answer draws it — "How careful?" beside the verdict, the fixed-age line to the plan-to age beside every
 * weighted sentence, the floor when the money runs out — and a change of level that changes the figures. Each figure is
 * Node's own for what was typed (the spec's engine), so the page and the engine are held to each other.
 */
import { expect } from '@playwright/test';

/** The lines an answer wrote, as drawn: the level control, the fixed-age line, the floor; nothing wider than the window. */
export async function expectLevelLines(page, q, answer) {
  const s = answer.sentences || {};
  const strip = page.locator(`#app [data-testid="${q}.level"]`).first();
  await expect(strip).toBeVisible();
  await expect(strip).toHaveAttribute('data-level', answer.level);
  await expect(strip).toHaveAttribute('data-weighted', '1');
  await expect(strip.locator('button')).toHaveCount(3);
  await expect(page.locator('#app [data-testid="lasts.fixed"]').first()).toHaveText(s.fixed.text);
  await expect(page.locator('#app [data-testid="lasts.fixed"]').first()).toHaveAttribute('data-fixed', 'age');
  if (s.floor) await expect(page.locator('#app [data-testid="lasts.floor"]').first()).toHaveText(s.floor.text);
  if (s.boldLine) await expect(page.locator('#app [data-testid="lasts.boldLine"]').first()).toHaveText(s.boldLine.text);
  // every weighted sentence on the page has a fixed-age line in its block (the render rule, in the browser)
  const lonely = await page.evaluate(() => {
    const BLOCK = 'section, .block, .headline, .band, .checkin-kept, [data-chance-block], .plan-section, details';
    return [...document.querySelectorAll('#app [data-weighted]')].filter((el) => {
      const block = (el.parentElement && el.parentElement.closest(BLOCK)) || document.body;
      return ![...block.querySelectorAll('[data-fixed="age"], [data-fixed="1"]')].some((f) => f !== el && /\d{2,3}/.test(f.textContent));
    }).map((el) => el.textContent.trim().slice(0, 80));
  });
  expect(lonely).toEqual([]);
  // the strip fits at this width: no sideways scroll
  const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(over).toBeLessThanOrEqual(0);
}

/**
 * A press on another level: the answer is worked out again at it. `app` is the spec's helper (v7()), `engine(typed)` the
 * spec's own Node answer for what was typed. Returns the new answer.
 */
export async function pickLevel(page, app, q, level, engine) {
  await page.locator(`#app [data-testid="${q}.level.${level}"]`).first().scrollIntoViewIfNeeded();
  await page.locator(`#app [data-testid="${q}.level.${level}"]`).first().click();
  app.typed.confidence = level;
  await app.ready(120_000);
  const answer = engine(app.typed);
  expect(answer.level).toBe(level);
  await expect(page.locator(`#app [data-testid="${q}.level"]`).first()).toHaveAttribute('data-level', level);
  await expect(page.locator(`#app [data-testid="${q}.level.${level}"]`).first()).toHaveAttribute('aria-pressed', 'true');
  return answer;
}
