/**
 * J17 (7.12.0): what a person types on Stress tester → Settings just after a new plan opens stays typed. The full view
 * presses Settings a second time 400 ms after it opens (homeBannerUi.pressOpeningSub; the wizard's openStressSettings via
 * NextStep's later()); that press used to load the form again from the store, over the way of drawing pressed and the
 * figures typed. Fictional (Alex, 63, already drawing). Signed in, against the local emulators.
 */
import { test, expect } from '../helpers/app.js';
import { clearEmulators, makeAccount, putSettings, plansOf, ALEX } from './emulator.js';
import { openAt, signIn } from './journeys.js';
import { CLASSIC_PATH, PROD } from '../helpers/app.js';
import { VERSION } from '../../src/constants.js';

test.beforeEach(async () => { await clearEmulators(); });

test('a way of drawing pressed and figures typed on a new plan\'s Settings are still there after the page\'s own presses', async ({ page }) => {
  test.setTimeout(180_000);
  const { uid } = await makeAccount(ALEX);
  await putSettings(uid, { lastSeenVersion: VERSION, view: 'full' });
  await openAt(page, '#/account');
  await signIn(page, ALEX);
  await expect(page.getByTestId('account.signIn')).toHaveCount(0, { timeout: 30_000 });

  await page.goto(PROD + CLASSIC_PATH);
  const wiz = page.locator('#setupWizard');
  await wiz.locator('#wizCurrentAge').fill('63');
  await wiz.locator('#wizRetired').check();
  await wiz.locator('#wizRetireAge').fill('63');
  await wiz.getByRole('button', { name: 'Next' }).click();
  await wiz.getByRole('button', { name: /already drawing my pension/ }).click();

  // the full view shows the Stress tester: Settings pressed, a way chosen, figures typed, all before the page's own press
  await expect(page.locator('#mainApp:not(.hidden) .tab.active[data-tab="stress"]')).toBeVisible({ timeout: 30_000 });
  await page.locator('.sub-tab[data-stresstab="stresssettings"]').click();
  await page.locator('button[data-strat="full-il-gilt"]').click();
  await page.locator('#miniSipp').fill('485000');
  await page.locator('#giltCashYears').fill('3');
  // the page's delayed presses of the open Settings tab (made certain here, whatever the machine's speed), then a moment
  await page.evaluate(() => document.querySelector('.sub-tab[data-stresstab="stresssettings"]').click());
  await page.waitForTimeout(1500);

  await expect(page.locator('button[data-strat="full-il-gilt"].active')).toBeVisible();
  await expect(page.locator('#miniSipp')).toHaveValue('485000');
  await expect(page.locator('#giltCashYears')).toHaveValue('3');

  await page.locator('#ssSaveBtn').click();
  await expect(page.getByText(/Settings saved/).first()).toBeVisible({ timeout: 30_000 });
  const s = (await plansOf(uid))[0].stressTool.settings;
  expect(s.strategyId).toBe('full-il-gilt');
  expect(s.strategyParams.sippTotal).toBe(485000);
  expect(s.strategyParams.cashYears).toBe(3);
});
