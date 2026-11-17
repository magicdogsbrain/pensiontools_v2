/**
 * Plans made on the screen, as a person makes them (rule 4): the routes several scenarios start from. Each returns the
 * plan's id and leaves the person signed in on the page it ends on.
 */
import { expect } from '@playwright/test';
import { confirmEmail } from './account.js';
import { at, openSimple, answer, keep, signUp, editAndSave, planAddress, settled, fullPage, closeNews, openFull } from './routes.js';
import { SAM_B, KIM_D } from './typed.js';
import { SAM45 } from './people.js';

/** A question answered as a guest, kept, and carried into a new account made from the kept panel. */
export async function keptIntoNewAccount(page, q, typed, me) {
  await openSimple(page, `#/${q}/numbers`);
  await answer(page, q, typed);
  await keep(page, q);
  await page.getByTestId(`${q}.keep.toAccount`).click();
  await signUp(page, me, confirmEmail);
  await page.waitForURL((u) => /#\/plan\//.test(u.hash), { timeout: 30_000 });
  await settled(page).catch(() => {});
  return planAddress(page).planId;
}

/**
 * Sam, 44, on 12 November 2025: "Am I saving enough?" with £120,000 and the pay-in as two amounts, kept into a new
 * account; then the pay, £52,000, on What you pay in.
 */
export async function samAYearAgo(page, me) {
  await at(page, '2025-11-12T10:00:00.000Z');
  const typed = { numbers: { ...SAM_B.numbers, 'you.age': SAM45.age - 1 }, spend: SAM_B.spend };
  const planId = await keptIntoNewAccount(page, 'b', typed, me);
  await editAndSave(page, planId, 'saving', 'salary', SAM45.pay);
  await expect(page.locator('#app [data-screen]')).toBeVisible();
  return planId;
}

/** Kim, 62, on 16 November 2026: "Will it last?" answered, kept into a new account. */
export async function kimKept(page, me) {
  return keptIntoNewAccount(page, 'd', KIM_D, me);
}

/** In the full view: Stress Tester > Settings > "Lock plan & create the plan document" > "Lock the plan". */
export async function lockFromStressSettings(page) {
  await fullPage(page, 'stress settings');
  await closeNews(page);
  await page.locator('#ssLockBtn').click();
  await page.getByRole('button', { name: 'Lock the plan' }).click();
  await expect(page.locator('.sub-tab[data-decisiontab="plandoc"].active').or(page.getByText('Plan locked')).first()).toBeVisible({ timeout: 60_000 });
}

/**
 * In the full view: Decision Tool > Monthly Entry for `month` ('2026-11') with the pension total and the ISA as the
 * platform shows them, then Calculate. The tax-year set-up opens the first time in a tax year; `setUp(page)` fills it.
 * Returns what the person read on the way: each step of the set-up, then the page after the recommendation is drawn.
 */
export async function monthlyEntry(page, { month, pension, isa, setUp = null }) {
  await fullPage(page, 'monthly entry');
  await page.locator('#entryMonth').fill(month);
  await page.locator('#entryPlatTotal').fill(String(pension));
  await page.locator('#entryIsa').fill(String(isa));
  await page.locator('#decisionForm button[type=submit]').click();
  const seen = [];
  // the tax-year set-up draws its steps inside #taxYearWizard; its heading says "Setting up tax year …"
  const wizard = page.locator('#taxYearWizard');
  const open = () => page.getByText(/^Setting up tax year/).first().isVisible().catch(() => false);
  await expect.poll(async () => (await open()) || (await page.locator('#saveBtn').isVisible().catch(() => false) && !(await open())), { timeout: 30_000 }).toBe(true);
  if (await open()) {
    if (setUp) await setUp(page);
    for (let i = 0; i < 5 && (await open()); i++) {
      // a person waits while the last press is saving ("Saving…" on its button), then reads the step that follows
      await expect.poll(async () => !/Saving…/.test(await wizard.innerText().catch(() => '')), { timeout: 30_000 }).toBe(true);
      if (!(await open())) break;
      const step = await wizard.innerText().catch(() => '');
      seen.push(step);
      await wizard.getByRole('button', { name: /^(Next|Confirm|Finish|Done|Save|Set up|Start)/ }).last().click();
      await expect.poll(async () => !(await open()) || (await wizard.innerText().catch(() => step)) !== step, { timeout: 15_000 }).toBe(true);
    }
  }
  await expect.poll(open, { timeout: 30_000 }).toBe(false);
  return [...seen, await page.locator('body').innerText()].join('\n');
}

/** "Save to History" for the month on the entry form. */
export async function saveMonth(page) {
  await page.locator('#saveBtn').click();
}

/**
 * A new account's first plan made in the full view's set-up: its name, age and the age work stops, then "See if I can
 * afford to retire". Leaves the full view open on the plan.
 */
export async function fullViewWizard(page, { name, age, stopAge }) {
  await openFull(page).catch(() => {});
  const wiz = page.locator('#setupWizard');
  await expect(wiz.locator('#wizScenarioName')).toBeVisible({ timeout: 45_000 });
  await wiz.locator('#wizScenarioName').fill(name);
  await wiz.locator('#wizCurrentAge').fill(String(age));
  await wiz.locator('#wizRetireAge').fill(String(stopAge));
  await wiz.getByRole('button', { name: 'Next' }).click();
  await wiz.getByRole('button', { name: /See if I can afford to retire/ }).click();
  await expect(wiz).toBeHidden({ timeout: 30_000 });
}

/** Stress Tester > Settings: the pension and the ISA as totals in the boxes it shows for them, then Save Settings. */
export async function stressTotals(page, { pension, isa }) {
  await fullPage(page, 'stress settings');
  await page.locator('#tmPotSipp').fill(String(pension));
  await page.locator('#tmPotIsa').fill(String(isa));
  await page.locator('#ssSaveBtn').click();
}
