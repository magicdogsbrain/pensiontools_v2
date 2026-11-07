/**
 * J1 (research/v7/after-7.md §2): a first visit, saving, without an account. Someone in their thirties wants to know
 * "am I saving enough, how much do I need, what does a share of my pay come to":
 *   - the front page is PensionTools, with its one line ("Plan your pension, from saving to living on it."; on a phone the
 *     stranger's headline says it, 7.5.0), and (7.5.0)
 *     three doors in the order of a life — "Still saving" first, opening "Am I saving enough?" — and no sign-in line: the
 *     account is asked for only when something is kept;
 *   - that question, answered with a share of pay, gives the ballpark: the pot to aim for, what paying in as now comes to,
 *     and the share of pay that would be enough with what it is in pounds a month.
 * On 7.0.0 the page was headed "Drawdown Planner" and the questions were one list (this test failed there, at the name).
 * Nothing here signs in. Run with the signed-in journeys (the emulator build), at desktop-1440 and phone-390.
 */
import { test, expect, v7 } from '../helpers/app.js';
import { COMMON, FRONT } from '../../src/v7/copy/common.js';

/** A saver of 33 (fictional): £30,000 in pensions, 5% of £32,000 pay in and 3% from the employer, stopping at 62, £2,000 a month. */
const TYPED = { 'you.age': '33', 'you.pot': '30000', 'you.payIn.kind': 'share', 'you.payIn.pay': '32000', 'you.payIn.ownPct': '5', 'you.payIn.employerPct': '3', 'stop.age': '62', 'spend.amount': '2000' };

test('the front page speaks to a saver; "Am I saving enough?" gives the ballpark', async ({ page }) => {
  const app = v7(page, 'prod', 'b');
  await app.open('');
  await app.ready();
  await expect(page).toHaveTitle(/^PensionTools/);
  await expect(page.getByTestId('nav.brand').locator('.brand-name')).toHaveText('PensionTools');
  // the one line: in the header where there is room; on a phone (7.5.0) the stranger's headline says it, never twice
  if ((await page.viewportSize()).width < 700) {
    await expect(page.locator('#app h1')).toHaveText(FRONT.stranger.title.join(''));
    await expect(page.getByTestId('front.tagline')).toHaveCount(0);
  } else {
    const line = page.getByTestId('nav.brand').locator('.brand-line');
    await expect(line).toBeVisible();
    await expect(line).toHaveText(COMMON.tagline);
  }
  expect(await page.locator('#app').innerText()).not.toMatch(/drawdown planner/i);

  // the three doors (7.5.0): still saving first, with "Am I saving enough?" in it; no sign-in line for a stranger
  const doors = page.locator('#app [data-door]');
  await expect(doors).toHaveCount(3);
  await expect(doors.first()).toHaveAttribute('data-door', 'b');
  await expect(doors.first()).toContainText(FRONT.stranger.doors.b.stage);
  await expect(doors.first().getByTestId('front.q.b')).toContainText('Am I saving enough?');
  await expect(page.getByTestId('front.signIn')).toHaveCount(0);

  await app.click('front.q.b');
  await app.at('b.numbers');
  await app.fill(TYPED);
  await app.click('b.action.show');
  await app.at('b.answer');
  await app.ready(120_000);

  // the ballpark: the pot to aim for, what paying in as now comes to, the share of pay that would be enough and its pounds
  await expect(page.locator('#app [data-guide="number.careful"]')).toContainText(/About £[\d,]+ by age 62/);
  await expect(page.locator('#app main')).toContainText(/Paying in 8% of your pay as now/);
  await expect(page.locator('#app main')).toContainText(/your pension at 62: £[\d,]+ in a bad case/);
  await expect(page.locator('#enough-title')).toContainText(/To be on course: [\d.]+% of your pay/);
  await expect(page.getByTestId('b.enough.line')).toContainText(/£[\d,]+ a month going into your pension/);
});
