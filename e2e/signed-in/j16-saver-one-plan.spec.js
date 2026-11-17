/**
 * J16 (reported 16 Nov 2026): "Am I saving enough?" asked again by someone who already has a saving plan. B started from
 * the front door, a new tab or after starting again knew no plan, so "Keep this as a plan" led and each keep made one
 * more plan of the same name ("…", "… (2)", …). Now B's answer reads the account's plans and, with no plan opened or kept
 * from this answer, names your own saving plan: "Use these in ‘…’" leads and "Keep as a new plan" is second; pressing it
 * updates that plan, and the account still holds one plan.
 *
 * Sam (fictional) signs in, answers B from its first step and keeps it; then a new tab (this tab's storage emptied, as a
 * new tab's is, and the app opened afresh; the sign-in is the browser's and stays) asks B again. Run with the signed-in journeys (the emulator build),
 * at desktop-1440 and phone-390.
 */
import { test, expect, PROD, WORKER_DATA_MISSING } from '../helpers/app.js';
import { clearEmulators, makeAccount, putSettings, plansOf, SAM } from './emulator.js';
import { answer, keep, signIn, openAt } from './journeys.js';
import { VERSION } from '../../src/constants.js';

test('B asked again in a new tab: "Use these in ‘…’" leads, updates the plan kept, and the plans stay one', async ({ page, watch }) => {
  test.setTimeout(420_000);
  await clearEmulators();
  watch.allow(WORKER_DATA_MISSING);
  const { uid } = await makeAccount(SAM);
  await putSettings(uid, { lastSeenVersion: VERSION });
  await openAt(page, '#/account');
  await signIn(page, SAM);

  // the first time: B answered and kept, one plan in the account
  await answer(page, 'b');
  const made = await keep(page, 'b');
  await expect(made).toContainText('in your account');
  const planId = await made.getAttribute('data-plan-id');
  const before = await plansOf(uid);
  expect(before.map((p) => p.id)).toEqual([planId]);
  const name = before[0].planDetails.name;

  // a new tab: nothing of the first answer in it, still signed in. The app is left first (its draft store would write the
  // tab's notes back), this tab's storage emptied on a page of the same site without it, and the app opened afresh.
  await page.goto(PROD + '/privacy.html');
  await page.evaluate(() => sessionStorage.clear());
  await openAt(page, '#/');
  await expect(page.locator('#app [data-screen]')).toHaveAttribute('data-screen', 'front');
  const app = await answer(page, 'b');
  // … with £500 a month going in this time, so there is something to put in the plan
  await app.go('#/b/numbers');
  await app.fill({ 'you.payIn.total': '500' });
  await app.click('b.action.show');
  await app.at('b.answer');
  await app.ready(120_000);
  const use = page.getByTestId('b.use');
  await expect(use).toBeVisible({ timeout: 60_000 });
  await expect(use).toHaveAttribute('data-plan-id', planId);
  // 7.12.0: a name the person did not type is shown from the plan's present figures, without the pay-in (PlanName.js); a
  // name kept from B carries none either (round 3), so the two are the same
  const shown = name.replace(/ · paying £[\d,]+$/, '');
  expect(shown).toBe(name);
  await expect(page.getByTestId('b.use.own')).toContainText(`‘${shown}’`);
  // "Use these in ‘…’" leads (B not on course: its two pay-in buttons); "Keep as a new plan" is second
  const onCourse = await page.getByTestId('b.action.use').isVisible();
  const press = onCourse ? page.getByTestId('b.action.use') : page.getByTestId('b.action.use.now');
  await expect(press).toHaveClass(/primary/);
  if (onCourse) await expect(press).toHaveText(`Use these in ‘${shown}’`);
  const second = onCourse ? page.getByTestId('b.action.save') : page.getByTestId('b.action.save.now');
  await expect(second).not.toHaveClass(/primary/);
  await expect(page.getByTestId('b.keep.name')).not.toHaveValue(name);

  // pressed: that plan is updated, and the account still holds one plan
  await press.click();
  await expect(page.getByTestId('b.use.done')).toBeVisible({ timeout: 30_000 });
  const after = await plansOf(uid);
  expect(after.map((p) => p.id)).toEqual([planId]);
  expect(JSON.stringify(after[0].accumulationTool)).not.toBe(JSON.stringify(before[0].accumulationTool));
  expect(after[0].planDetails.name).toBe(name);
});
