/**
 * "Try the bad years" under C's and D's answers (7.9.0; the build spec's §2.2, §9), on the PUBLISHED build, without an
 * account, every request outside the site stopped. The strip's button shows only on a final answer and runs only on a press:
 * the five rows (As planned first, at the amount the answer stands behind, on the answer's own futures) arrive within the
 * strip's budget, each in short (its chance and where it runs out; the rest closed under "More about this line"; what still
 * comes in said once), the strip within 1,400 px at 1,440; a new answer drops the strip, and its first figure still arrives within the first answer's budget while a
 * strip was under way (the answer runner stops it first); no sideways scroll; nothing unfilled. The households are made up.
 */
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { test, expect, v7, fixtureTyping, askAndTime, record, STRIP_BUDGET, SLOWDOWN } from './helpers/app.js';

test.use({ outside: 'block' });

const ROWS = ['asPlanned', 'fall', 'lower', 'spend', 'prices'];
/** D's worked example (answer-D.md 1): 68, £300,000 left, the tax-free part not had, £40,000 of savings, £2,100 a month. */
const D_TYPED = { 'you.age': '68', 'you.pot': '300000', 'you.taxFreeTaken': 'no', savings: '40000', 'spend.amount': '2100' };
const FIRST_MS = 3_000;   // the first figure's budget (e2e/helpers/app.js FIRST_ANSWER_BUDGET.firstMs), measured as the journeys measure it
const shots = (name, info) => { const dir = process.env.SHOTS_DIR; if (!dir) return null; mkdirSync(dir, { recursive: true }); return join(dir, name + '-' + info.project.name + '.png'); };
const noSideways = async (page) => { const w = await page.evaluate(() => ({ doc: document.documentElement.scrollWidth, win: window.innerWidth })); expect(w.doc, 'no sideways scroll').toBeLessThanOrEqual(w.win); };

/** Press the strip's button under question `q`'s final answer; the five rows within the budget, As planned first. */
async function tryStrip(page, q, info) {
  const strip = page.locator(`[data-stress-strip="${q}"]`);
  await expect(strip).toHaveAttribute('data-status', 'idle');
  await expect(page.getByTestId(`${q}.stress.rows`)).toHaveCount(0);
  const t0 = Date.now();
  await page.getByTestId(`${q}.stress.run`).click();
  await expect(strip).toHaveAttribute('data-status', 'done', { timeout: 120_000 });
  const ms = Date.now() - t0;
  record(info, `strip/${q}-${info.project.name}.json`, { stripMs: ms, slowdown: SLOWDOWN, budgetMs: STRIP_BUDGET, method: 'From the press to the five rows on the page (one worker call), measured at full speed against 2.5 s × the slowdown.' });
  info.annotations.push({ type: `strip-${q}-ms`, description: `${ms} ms at full speed, against ${STRIP_BUDGET} ms` });
  expect(ms, 'the strip within its budget').toBeLessThanOrEqual(STRIP_BUDGET);
  expect(await page.locator(`[data-testid="${q}.stress.rows"] > li.stress-row`).evaluateAll((els) => els.map((e) => e.getAttribute('data-row')))).toEqual(ROWS);
  const text = await strip.innerText();
  expect(text).not.toMatch(/undefined|NaN|\[object|\{\w+\}/);
  expect(text).not.toMatch(/one every [\d,]+ months|you should|\brecommend/i);
  await expect(page.getByTestId(`${q}.stress.spend`)).toContainText('You spend a tenth more:');
  // each row in short: its chance and where it runs out; the rest closed under "More about this line"; what still comes in
  // said once, above the rows
  for (const id of ROWS) {
    await expect(page.getByTestId(`${q}.stress.${id}`).locator(':scope > [data-line="chance"]')).toHaveCount(1);
    await expect(page.getByTestId(`${q}.stress.${id}`).locator(':scope > [data-line="runsOut"]')).toHaveCount(1);
  }
  await expect(strip.locator('.stress-floor')).toHaveCount(1);
  await expect(strip.locator('.stress-floor')).toContainText(/^If the money runs out, you would still have £[\d,]+ a year after tax/);
  await noSideways(page);
  const tall = Math.round((await strip.boundingBox()).height);
  record(info, `strip/height-${q}-${info.project.name}.json`, { stripPx: tall, method: 'The strip\'s own box, five rows in, "More about this line" closed.' });
  info.annotations.push({ type: `strip-${q}-px`, description: `${tall} px tall` });
  if (info.project.name === 'desktop-1440') expect(tall, 'the strip within 1,400 px at 1,440').toBeLessThanOrEqual(1400);
  const shot = shots(`strip-${q}`, info);
  if (shot) await strip.screenshot({ path: shot });
  // "More about this line": closed until opened; the rest of the row's words inside it
  const more = page.getByTestId(`${q}.stress.fall.more`);
  expect(await more.evaluate((d) => d.open)).toBe(false);
  await expect(more.locator('[data-line="when"]')).toBeHidden();
  await more.locator('summary').click();
  await expect(more.locator('[data-line="when"]')).toBeVisible();
  await expect(more.locator('[data-line="when"]')).toContainText(/In the futures where the money runs out before .*\([\d,]+ of the 1,000; as planned: /);
  await noSideways(page);
  await more.locator('summary').click();
}

test.describe('"Try the bad years" under an answer', () => {
  test('C: the strip on a press within its budget; a new answer drops it, and its first figure is not held up', async ({ page }, info) => {
    test.setTimeout(300_000);
    const F3 = fixtureTyping('F3');
    const { take, ...figures } = F3;
    const app = v7(page, 'prod');
    await app.open('#/');
    await app.ready();
    await app.type('front.c.pot', figures['you.pot'], { path: 'you.pot' });
    await app.click('front.c.show');
    await app.at('c.numbers');
    const rest = { ...figures };
    delete rest['you.pot'];
    await app.fill(rest);
    await app.click('c.action.show');
    await app.at('c.answer');
    await app.ready(120_000);
    await tryStrip(page, 'c', info);

    // the strip pressed again, and a new answer asked for while it works: the strip is dropped, the first figure on time
    await page.getByTestId('c.stress.run').click();
    await app.go('#/c/numbers');
    await app.set('you.age', String(Number(figures['you.age']) + 1));
    const times = await askAndTime(app, 'c.action.show');
    record(info, `strip/c-after-${info.project.name}.json`, { ...times, slowdown: SLOWDOWN, budgetFirstMs: FIRST_MS });
    expect(times.firstMs * SLOWDOWN, 'the next answer\'s first figure within its budget').toBeLessThanOrEqual(FIRST_MS);
    await expect(page.getByTestId('c.stress.rows')).toHaveCount(0);
    await expect(page.locator('[data-stress-strip="c"]')).toHaveAttribute('data-status', 'idle');
  });

  test('D: the strip on a press within its budget', async ({ page }, info) => {
    test.setTimeout(300_000);
    const app = v7(page, 'prod', 'd');
    await app.open('#/');
    await app.ready();
    await app.click('front.q.d');
    await app.at('d.numbers');
    await app.fill(D_TYPED);
    await app.click('d.action.show');
    await app.at('d.answer');
    await app.ready(120_000);
    await tryStrip(page, 'd', info);
    await expect(page.locator('[data-stress-strip="d"]')).toContainText('at the £2,100 a month it stands behind');
  });
});
