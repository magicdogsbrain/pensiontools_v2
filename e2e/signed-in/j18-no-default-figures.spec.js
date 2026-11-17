/**
 * J18 (7.12.0, lead decision 2; the second walk): no default figure is shown or used as if it were the person's. A plan made
 * with the full view's own wizard showed an income step of £30,000 and a ticked bed-and-ISA nobody chose, "Try a strategy"
 * kept another plan's pot after a switch, "Am I on course?" said "You want £2,210 a month" (the default), and Will it last?
 * ran on figures nobody gave. Fictional: Kim, 66, retired; Sam, 61, saving. Signed in, against the local emulators.
 */
import { test, expect } from '../helpers/app.js';
import { clearEmulators, makeAccount, putSettings, ALEX } from './emulator.js';
import { openAt, signIn } from './journeys.js';
import { CLASSIC_PATH, PROD } from '../helpers/app.js';
import { VERSION } from '../../src/constants.js';

test.beforeEach(async () => { await clearEmulators(); });

async function wizard(page, { age, retired, retireAge, start }) {
  const wiz = page.locator('#setupWizard');
  await wiz.locator('#wizCurrentAge').fill(String(age));
  if (retired) await wiz.locator('#wizRetired').check();
  await wiz.locator('#wizRetireAge').fill(String(retireAge));
  await wiz.getByRole('button', { name: 'Next' }).click();
  await wiz.locator('[data-action="' + start + '"]').click();
  await expect(page.locator('#mainApp:not(.hidden)')).toBeVisible({ timeout: 30_000 });
}
async function willItLast(page) {
  await page.evaluate(() => window.switchToTab('stress'));
  await page.locator('.sub-tab[data-stresstab="stresssettings"]').click();
  await page.locator('.sub-tab[data-stresstab="montecarlo"]').click();
}

test('a new plan from the wizard: no income, no ticked bed-and-ISA, empty what-if boxes, and the test says what to add', async ({ page }) => {
  test.setTimeout(240_000);
  const { uid } = await makeAccount(ALEX);
  await putSettings(uid, { lastSeenVersion: VERSION, view: 'full' });
  await openAt(page, '#/account');
  await signIn(page, ALEX);
  await expect(page.getByTestId('account.signIn')).toHaveCount(0, { timeout: 30_000 });

  // Sam, saving: £120,000 typed on the Accumulation tab, no income given
  await page.goto(PROD + CLASSIC_PATH);
  await wizard(page, { age: 61, retired: false, retireAge: 63, start: 'start-accumulation' });
  await page.evaluate(() => window.switchToTab('accumulation'));
  await page.locator('#acPotNow').fill('120000');
  await page.keyboard.press('Tab');
  await expect(page.getByTestId('accumulation.saveState')).toHaveText('Saved', { timeout: 30_000 });
  await page.getByRole('button', { name: 'Work it out' }).click();
  const answer = page.getByTestId('ac.saver');
  await expect(answer).toHaveAttribute('data-why', 'noAim', { timeout: 60_000 });
  await expect(answer).not.toContainText('You want');
  await expect(answer).not.toContainText('2,210');

  // Settings: the income step empty, bed-and-ISA not ticked
  await page.evaluate(() => window.switchToTab('stress'));
  await page.locator('.sub-tab[data-stresstab="stresssettings"]').click();
  await expect(page.locator('#incomeStepsEditor input[type=number][step="1000"]').first()).toHaveValue('');
  await expect(page.locator('#ssBedAndIsa')).not.toBeChecked();
  // Will it last?: the what-if's income empty, and Run the test says what to add instead of a result
  await page.locator('.sub-tab[data-stresstab="montecarlo"]').click();
  await expect(page.locator('#tryIncome')).toHaveValue('');
  await page.getByRole('button', { name: 'Run the test' }).click();
  await expect(page.locator('#strategyRunResults')).toContainText('This plan has no income set yet, so there is nothing to test.');
  await expect(page.locator('#strategyRunResults')).not.toContainText('£');
  const samPot = await page.locator('#tryPot').inputValue();
  expect(samPot).toBe('120000');

  // Kim, a second plan: Try a strategy's boxes are Kim's (empty), never Sam's
  await page.evaluate(() => document.getElementById('scenarioDropdown').classList.add('open'));
  await page.locator('#scenarioNewBtn').click();
  await wizard(page, { age: 66, retired: true, retireAge: 66, start: 'start-stress' });
  await willItLast(page);
  await expect(page.locator('#tryPot')).toHaveValue('');
  await expect(page.locator('#tryIncome')).toHaveValue('');
  await page.getByRole('button', { name: 'Run the test' }).click();
  await expect(page.locator('#strategyRunResults')).toContainText('This plan has no figures yet. Add your pot and what you want to spend on Stress tester → Settings.');
  await page.locator('#strategyRunResults').screenshot({ path: test.info().outputPath('run-says-what-to-add.png'), timeout: 10_000 }).catch(() => {});   // a picture to look at, not a check
});
