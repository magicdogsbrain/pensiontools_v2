/**
 * J2a (research/v7/after-7.md §2): an answer kept without an account, then an account — the person is on the plan they
 * kept, at the step they were on, the plan is in the account, and nothing leaves them on "Your account".
 *   - "Am I saving enough?" kept in this window → "Sign in or make an account" → a NEW account (email confirmed) → on the
 *     kept plan's "What you pay in", the plan in the account, none left in the window;
 *   - the same, signing in to an EXISTING account;
 *   - "Sign in first" before keeping → signed in → back on the answer, which then keeps the plan in the account;
 *   - an answer kept from A, C and D → signed in → on that plan.
 * On 7.0.0 the keep panel had no way to an account at all: a person went to "Your account" from the header, signed in,
 * and was left there (these tests failed there, at the first press). Run against the local emulators, at desktop-1440 and
 * phone-390; the accounts and figures are fictional.
 */
import { test, expect, WORKER_DATA_MISSING } from '../helpers/app.js';
import { clearEmulators, makeAccount, putSettings, plansOf, uidOf, ALEX, SAM } from './emulator.js';
import { answer, keep, signIn, signUp, planAddress, windowPlans } from './journeys.js';
import { VERSION } from '../../src/constants.js';

test.beforeEach(async ({ watch }) => {
  await clearEmulators();
  watch.allow(WORKER_DATA_MISSING);
});

/** After the sign-in: on the plan (by the account's id) at the step, the plan in the account, none of the person's left in the window. */
async function onKeptPlan(page, uid, { step, name }) {
  await expect(page.locator('#app [data-screen]')).toHaveAttribute('data-screen', step ? `plan.${step}` : /^plan/, { timeout: 30_000 });
  const at = planAddress(page);
  expect(at, page.url()).not.toBeNull();
  expect(at.step).toBe(step);
  const plans = await plansOf(uid);
  expect(plans.map((p) => p.id)).toContain(at.planId);
  // the name kept, marked as brought in from this window (as every plan the bring-in carries over is)
  expect(plans.find((p) => p.id === at.planId).planDetails.name.startsWith(name)).toBe(true);
  expect((await windowPlans(page)).filter((p) => !p.example)).toEqual([]);
  await expect(page.getByTestId('account.signedIn')).toHaveCount(0);
  return at;
}

test('B kept without an account, then a new account: on the kept plan\'s "What you pay in", in the account', async ({ page }) => {
  await answer(page, 'b');
  const made = await keep(page, 'b');
  await expect(made).toContainText('in this browser window');
  const name = await page.evaluate(() => JSON.parse(sessionStorage.getItem('pt_guest_scenarios'))[0].planDetails.name);
  await page.getByTestId('b.keep.toAccount').click();
  await expect(page.locator('#app [data-screen]')).toHaveAttribute('data-screen', 'account');
  await signUp(page, ALEX);
  const uid = await uidOf(ALEX.email);
  await onKeptPlan(page, uid, { step: 'saving', name });
});

test('B kept without an account, then signing in to an existing account: on the kept plan\'s "What you pay in"', async ({ page }) => {
  const { uid } = await makeAccount(SAM);
  await putSettings(uid, { lastSeenVersion: VERSION });
  await answer(page, 'b');
  await keep(page, 'b');
  const name = await page.evaluate(() => JSON.parse(sessionStorage.getItem('pt_guest_scenarios'))[0].planDetails.name);
  await page.getByTestId('b.keep.toAccount').click();
  await signIn(page, SAM);
  await onKeptPlan(page, uid, { step: 'saving', name });
});

test('"Sign in first" before keeping: back on the answer, which keeps the plan in the account', async ({ page }) => {
  const { uid } = await makeAccount(SAM);
  await putSettings(uid, { lastSeenVersion: VERSION });
  await answer(page, 'b');
  await page.goto(page.url().replace(/#.*$/, '#/b/keep'));
  await expect(page.getByTestId('b.keep.signInFirst')).toBeVisible({ timeout: 30_000 });
  await page.getByTestId('b.keep.signInFirst').click();
  await signIn(page, SAM);
  await expect(page.locator('#app [data-screen]')).toHaveAttribute('data-screen', 'b.keep', { timeout: 30_000 });
  const made = await keep(page, 'b');
  await expect(made).toContainText('in your account');
  expect((await plansOf(uid)).length).toBe(1);
});

for (const q of ['a', 'c', 'd']) {
  test(`${q.toUpperCase()} kept without an account, then signing in: on the kept plan, in the account`, async ({ page }) => {
    const { uid } = await makeAccount(SAM);
    await putSettings(uid, { lastSeenVersion: VERSION });
    await answer(page, q);
    await keep(page, q);
    const name = await page.evaluate(() => JSON.parse(sessionStorage.getItem('pt_guest_scenarios')).find((p) => !p.example).planDetails.name);
    await page.getByTestId(`${q}.keep.toAccount`).click();
    await signIn(page, SAM);
    await onKeptPlan(page, uid, { step: null, name });
  });
}
