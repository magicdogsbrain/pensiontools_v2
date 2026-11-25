/**
 * J17 (7.12.0): what a person types on Stress tester → Settings just after a new plan opens stays typed. The full view
 * presses Settings a second time 400 ms after it opens (homeBannerUi.pressOpeningSub; the wizard's openStressSettings via
 * NextStep's later()); that press used to load the form again from the store, over the way of drawing pressed and the
 * figures typed. Fictional (Alex, 63, already drawing). Signed in, against the local emulators.
 */
import { test, expect } from '../helpers/app.js';
import { clearEmulators, makeAccount, putSettings, plansOf, ALEX } from './emulator.js';
import { openAt, signIn } from './journeys.js';
import { CLASSIC_PATH, PROD, V7_PATH } from '../helpers/app.js';
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
  await expect(page.locator('#mainApp:not(.hidden) #stress-content.active')).toBeVisible({ timeout: 30_000 });   // the Stress tester shown (either view width)
  const shownAt = await page.evaluate(() => performance.now());
  await page.locator('.sub-tab[data-stresstab="stresssettings"]').click();
  await page.locator('button[data-strat="full-il-gilt"]').click();
  await page.locator('#miniSipp').fill('485000');
  await page.locator('#giltCashYears').fill('3');
  // the page's delayed presses of the open Settings tab (made certain here, whatever the machine's speed)…
  await page.evaluate(() => document.querySelector('.sub-tab[data-stresstab="stresssettings"]').click());
  // …and the page's own presses, 400 ms after it opened, are past: what is under test is what they do
  await expect.poll(() => page.evaluate(() => performance.now()), { timeout: 10_000 }).toBeGreaterThan(shownAt + 1500);

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

// ---- 7.12.0, lead decision 1: on a plan not locked, Settings and the Accumulation tab save as they change ----------------

/** A new plan from the full view's own wizard (fictional ages), on its first screen. */
async function newPlan(page, { age, retired, retireAge, start }) {
  await page.goto(PROD + CLASSIC_PATH);
  const wiz = page.locator('#setupWizard');
  await wiz.locator('#wizCurrentAge').fill(String(age));
  if (retired) await wiz.locator('#wizRetired').check();
  await wiz.locator('#wizRetireAge').fill(String(retireAge));
  await wiz.getByRole('button', { name: 'Next' }).click();
  await wiz.locator('[data-action="' + start + '"]').click();
  await expect(page.locator('#mainApp:not(.hidden)')).toBeVisible({ timeout: 30_000 });
}
/** Stress tester → Settings, drawn from the plan as stored. */
async function openSettings(page) {
  await page.evaluate(() => window.switchToTab('stress'));
  await page.locator('.sub-tab[data-stresstab="montecarlo"]').click();
  await page.locator('.sub-tab[data-stresstab="stresssettings"]').click();
  await expect(page.locator('#stress-stresssettings')).toBeVisible();
}
/** Types into a box as a person does, and leaves it with Tab. */
async function typeIn(page, locator, text) {
  await locator.click();
  await locator.fill(text);
  await page.keyboard.press('Tab');
}
// (step F2) the step's box is a month after tax, as the simple view asks it; the plan stores the year before tax that pays it
const firstStepAmount = (page) => page.locator('#incomeStepsEditor input[data-step-amount]').first();
const saved = (page) => expect(page.getByTestId('settings.saveState')).toHaveText('Saved', { timeout: 30_000 });

test('figures typed on Settings stay after Tab and a reload, after another sub-tab, and after another plan', async ({ page }) => {
  test.setTimeout(300_000);
  const { uid } = await makeAccount(ALEX);
  await putSettings(uid, { lastSeenVersion: VERSION, view: 'full' });
  await openAt(page, '#/account');
  await signIn(page, ALEX);
  await expect(page.getByTestId('account.signIn')).toHaveCount(0, { timeout: 30_000 });
  await newPlan(page, { age: 66, retired: true, retireAge: 66, start: 'start-stress' });
  await openSettings(page);

  // type, press Tab, reload: the figures are there (the walker read the boxes; we read them and the store)
  await typeIn(page, page.locator('#ssPot'), '300000');
  await typeIn(page, firstStepAmount(page), '2100');
  await saved(page);
  await page.reload();
  await expect(page.locator('#mainApp:not(.hidden)')).toBeVisible({ timeout: 30_000 });
  await openSettings(page);
  await expect(page.locator('#ssPot')).toHaveValue('300000');
  await expect(firstStepAmount(page)).toHaveValue('2100');
  let s = (await plansOf(uid))[0].stressTool.settings;
  expect(s.equityMin + s.bondMin + s.cashTarget).toBe(300000);
  expect(s.incomeSteps.map((x) => x.amount)).toEqual([28358]);   // £2,100 a month after tax on the plan's own bands

  // type, switch sub-tab and back: there, and "Will it last?" starts from it
  await typeIn(page, page.locator('#ssIsaBalance'), '40000');
  await page.locator('.sub-tab[data-stresstab="montecarlo"]').click();
  await page.locator('.sub-tab[data-stresstab="stresssettings"]').click();
  await expect(page.locator('#ssIsaBalance')).toHaveValue('40000');
  await expect.poll(async () => (await plansOf(uid))[0].stressTool.settings.isaBalance, { timeout: 15_000 }).toBe(40000);   // the write lands a moment after the screen

  // type, switch plan and back: there, and the other plan untouched
  const first = (await plansOf(uid))[0].id;
  await typeIn(page, page.locator('#ssPot'), '310000');
  const openMenu = () => page.evaluate(() => document.getElementById('scenarioDropdown').classList.add('open'));   // the plan menu (its button's chip opens an explainer)
  await openMenu();
  await page.locator('#scenarioNewBtn').click();
  const wiz = page.locator('#setupWizard');
  await wiz.locator('#wizCurrentAge').fill('61');
  await wiz.locator('#wizRetireAge').fill('63');
  await wiz.getByRole('button', { name: 'Next' }).click();
  await wiz.locator('[data-action="start-stress"]').click();
  await expect(page.locator('#mainApp:not(.hidden)')).toBeVisible({ timeout: 30_000 });
  const plans = await plansOf(uid);
  expect(plans.length).toBe(2);
  const a = plans.find((p) => p.id === first).stressTool.settings;
  expect(a.equityMin + a.bondMin + a.cashTarget).toBe(310000);
  await openMenu();
  await page.locator('.scenario-dropdown-item[data-scenario-id="' + first + '"]').click();
  await openSettings(page);
  await expect(page.locator('#ssPot')).toHaveValue('310000');
  await expect(page.locator('#ssIsaBalance')).toHaveValue('40000');
  await page.evaluate(() => scrollTo(0, 0));
  await page.locator('#stress-stresssettings h2').screenshot({ path: test.info().outputPath('settings-saved.png') });
});

test('a box with a problem says what beside it, the heading says "Not saved yet", and nothing of it is stored', async ({ page }) => {
  test.setTimeout(240_000);
  const { uid } = await makeAccount(ALEX);
  await putSettings(uid, { lastSeenVersion: VERSION, view: 'full' });
  await openAt(page, '#/account');
  await signIn(page, ALEX);
  await expect(page.getByTestId('account.signIn')).toHaveCount(0, { timeout: 30_000 });
  await newPlan(page, { age: 66, retired: true, retireAge: 66, start: 'start-stress' });
  await openSettings(page);
  await typeIn(page, page.locator('#ssPot'), '-5');
  await expect(page.locator('#ssPot + [data-testid="field.problem"]')).toHaveText('Type an amount of £0 or more. Not saved yet.');
  await expect(page.getByTestId('settings.saveState')).toHaveText(/^Not saved yet: “.+” needs a change \(said beside it\)\.$/);
  // the State Pension start date says which box and what to type
  await typeIn(page, page.locator('#ssPot'), '300000');
  await typeIn(page, page.locator('#ssSpStartDate'), '2026-08');
  await expect(page.locator('#ssSpStartDate + [data-testid="field.problem"]')).toHaveText('We could not read “2026-08” as a date. Type the day, the month and the year, like “6 August 2040”. Not saved yet.');
  await expect(page.getByTestId('settings.saveState')).toHaveText('Not saved yet: “State Pension start date” needs a change (said beside it).');
  await page.locator('#ssSpStartDate').scrollIntoViewIfNeeded();
  await page.locator('#ssSpStartDate').locator('xpath=..').screenshot({ path: test.info().outputPath('date-problem.png') });
  await typeIn(page, page.locator('#ssSpStartDate'), '6 August 2040');
  await saved(page);
  const s = (await plansOf(uid))[0].stressTool.settings;
  expect(s.equityMin + s.bondMin + s.cashTarget).toBe(300000);
  expect(s.spStartDate).toBe('6 August 2040');
});

test('the Accumulation tab keeps what is typed: the stop age and the pot today, after a reload, and Settings says the same stop', async ({ page }) => {
  test.setTimeout(240_000);
  const { uid } = await makeAccount(ALEX);
  await putSettings(uid, { lastSeenVersion: VERSION, view: 'full' });
  await openAt(page, '#/account');
  await signIn(page, ALEX);
  await expect(page.getByTestId('account.signIn')).toHaveCount(0, { timeout: 30_000 });
  await newPlan(page, { age: 61, retired: false, retireAge: 63, start: 'start-accumulation' });
  await page.evaluate(() => window.switchToTab('accumulation'));
  await expect(page.locator('#acRetireAge')).toHaveValue('63', { timeout: 30_000 });
  await typeIn(page, page.locator('#acPotNow'), '120000');
  await typeIn(page, page.locator('#acRetireAge'), '62');
  await expect(page.getByTestId('accumulation.saveState')).toHaveText('Saved', { timeout: 30_000 });
  await page.reload();
  await expect(page.locator('#mainApp:not(.hidden)')).toBeVisible({ timeout: 30_000 });
  await page.evaluate(() => window.switchToTab('accumulation'));
  await expect(page.locator('#acRetireAge')).toHaveValue('62', { timeout: 30_000 });
  await expect(page.locator('#acPotNow')).toHaveValue('120000');
  const plan = (await plansOf(uid))[0];
  expect(plan.stressTool.settings.retireAge).toBe(62);
  expect(plan.accumulationTool.settings.potNow).toBe(120000);
  // Stress tester → Settings stops at 62 too, without a reload of its own
  await openSettings(page);
  await expect(page.locator('#tmRetireAge')).toHaveValue('62');
});

test('a saver\'s pension typed on Settings is the pension today on the Accumulation tab, and the pot at the stop follows', async ({ page }) => {
  test.setTimeout(240_000);
  const { uid } = await makeAccount(ALEX);
  await putSettings(uid, { lastSeenVersion: VERSION, view: 'full' });
  await openAt(page, '#/account');
  await signIn(page, ALEX);
  await expect(page.getByTestId('account.signIn')).toHaveCount(0, { timeout: 30_000 });
  // Pat (fictional), 52, stopping at 63: £45,000 on the Accumulation tab, then £52,000 typed on Settings
  await newPlan(page, { age: 52, retired: false, retireAge: 63, start: 'start-accumulation' });
  await page.evaluate(() => window.switchToTab('accumulation'));
  await typeIn(page, page.locator('#acSalary'), '31000');
  await typeIn(page, page.locator('#acPotNow'), '45000');
  await typeIn(page, page.locator('#acNetMonthly'), '103');
  await expect(page.getByTestId('accumulation.saveState')).toHaveText('Saved', { timeout: 30_000 });
  await openSettings(page);
  const line = page.locator('#tmProjectionLine');
  await expect(line).toContainText('£45,000');
  const atStop = async () => Number(((await line.innerText()).match(/pension £([\d,]+)/) || [])[1]?.replace(/,/g, '') || 0);
  const before = await atStop();
  await typeIn(page, page.locator('#ssPot'), '52000');
  await saved(page);
  await page.evaluate(() => window.switchToTab('accumulation'));
  await expect(page.locator('#acPotNow')).toHaveValue('52000', { timeout: 30_000 });
  await openSettings(page);
  await expect(line).toContainText('£52,000');
  // by hand: £7,000 more today, grown at the middle rate (never below nothing), is at least £7,000 more when work stops
  expect(await atStop()).toBeGreaterThanOrEqual(before + 7000);
  const plan = (await plansOf(uid))[0];
  expect(plan.accumulationTool.settings.potNow).toBe(52000);
});

// (wrap-up) a figure typed and the link to the other view pressed straight away, without
// leaving the box first: the figure is saved before the page moves, both ways. Fictional (Alex, 50, stopping at 60).
test('a figure typed and the link to the other view pressed at once is saved, both ways', async ({ page }) => {
  test.setTimeout(300_000);
  const { uid } = await makeAccount(ALEX);
  await putSettings(uid, { lastSeenVersion: VERSION, view: 'full' });
  await openAt(page, '#/account');
  await signIn(page, ALEX);
  await expect(page.getByTestId('account.signIn')).toHaveCount(0, { timeout: 30_000 });
  await newPlan(page, { age: 50, retired: false, retireAge: 60, start: 'start-accumulation' });
  await page.evaluate(() => window.switchToTab('accumulation'));
  await expect(page.locator('#acRetireAge')).toHaveValue('60', { timeout: 30_000 });
  await typeIn(page, page.locator('#acNetMonthly'), '200');
  await expect(page.getByTestId('accumulation.saveState')).toHaveText('Saved', { timeout: 30_000 });
  const id = (await plansOf(uid))[0].id;
  await expect(page.locator('#classicToSimple')).toHaveAttribute('href', new RegExp('#/plan/' + id + '$'), { timeout: 30_000 });

  // the full view: 250 typed, the link pressed with the box still in use
  await page.locator('#acNetMonthly').click();
  await page.locator('#acNetMonthly').fill('250');
  await page.locator('#classicToSimple').click();
  await expect(page.locator('#app [data-screen]').first()).toBeVisible({ timeout: 30_000 });
  expect((await plansOf(uid))[0].accumulationTool.settings.netMonthly).toBe(250);

  // the simple view: 300 and a stop at 61 typed on What you pay in, "Show everything." pressed with the box still in use
  await page.goto(PROD + V7_PATH + '#/plan/' + id + '/saving');
  const pay = page.getByTestId('plan.saving.netMonthly');
  await expect(pay).toHaveValue('250', { timeout: 30_000 });
  await pay.click();
  await pay.fill('300');
  await page.getByTestId(/^nav\.everything/).locator('visible=true').first().click();
  await expect(page.locator('#mainApp:not(.hidden)')).toBeVisible({ timeout: 30_000 });
  expect((await plansOf(uid))[0].accumulationTool.settings.netMonthly).toBe(300);
  await page.evaluate(() => window.switchToTab('accumulation'));
  await expect(page.locator('#acNetMonthly')).toHaveValue('300', { timeout: 30_000 });
});
