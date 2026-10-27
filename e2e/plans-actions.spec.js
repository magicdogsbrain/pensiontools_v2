/**
 * The plan menu on "Your plans", without an account (research/v7/road-to-7.md step 11), on the PUBLISHED build. Two plans
 * are planted in the window: Alex's (corpus 12, unlocked) and Sam's locked ladder (corpus 03). Then, as a person would:
 *   - Rename Alex's plan: the box, the new name on the row, the stored text with Sam's plan byte-identical;
 *   - Download this plan: the file the browser saves is planExportJson of the plan, named by planExportFileName;
 *   - Open a downloaded copy: that very file, back in as "… (opened)", a plan of its own;
 *   - Delete it: the confirm names the plan and says there is no undo; the plan is gone from the list and the window;
 *   - Make a copy of Sam's plan with its records: the copy is locked from the start; a fourth plan is refused in words;
 *   - Make this my main plan: the flags in the window;
 *   - "Look around an example": the example plan opens, is listed read-only, does not count, and can be deleted;
 *   - the account page as a visitor: the sign-in form, never "Delete my account".
 * No figure in any address; no sideways scroll; none of the planner's words. Firebase is never reached.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test, expect, PROD, REPO, FIXED_NOW } from './helpers/app.js';
import { planExportJson, planExportFileName } from '../src/services/PlanExport.js';
import { copyOf } from '../src/services/PlanCopy.js';
import { upgradeScenario } from '../src/firebase/scenarioMigration.js';
import { DEMO_PLANS, EXAMPLE_PLAN_KEY } from '../src/services/GuestPlans.js';
import { PLAN } from '../src/v7/copy/plan.js';
import { ACCOUNT } from '../src/v7/copy/account.js';

test.use({ outside: 'block' });

const GUEST_KEY = 'pt_guest_scenarios';
const v7 = (hash) => PROD + '/v7/' + hash;
const NOW = new Date(FIXED_NOW);
const BANNED = /\bstrategy\b|\bscenario\b|\bguest\b|\bFirestore\b|\bFirebase\b|Monte Carlo|\bMC\b|about £/i;
const W = PLAN.list.actions;

function plans() {
  const alex = JSON.parse(readFileSync(join(REPO, 'tests', 'fixtures', 'plans', '12-lumpy-db-gia.json'), 'utf8'));
  const sam = JSON.parse(readFileSync(join(REPO, 'tests', 'fixtures', 'plans', '03-gilt-ladder-runup.json'), 'utf8'));
  alex.id = 'MenuPlan01'; alex.planDetails.name = 'Alex’s plan'; alex.isActive = true; delete alex.household;
  sam.id = 'MenuLocked02'; sam.planDetails.name = 'Sam’s plan'; sam.isActive = false; delete sam.household;
  return { alex, sam };
}
async function plant(page, list) {
  await page.clock.setFixedTime(NOW);
  await page.goto(v7('#/'));
  await expect(page.locator('#app [data-screen]')).toBeVisible();
  await page.evaluate(([k, text]) => { sessionStorage.setItem(k, text); }, [GUEST_KEY, JSON.stringify(list)]);
  return JSON.stringify(list);
}
const stored = (page) => page.evaluate((k) => JSON.parse(sessionStorage.getItem(k) || '[]'), GUEST_KEY);
const onPlans = async (page) => { await page.goto(v7('#/plans')); await expect(page.locator('#app [data-screen]')).toHaveAttribute('data-screen', 'plans'); await expect(page.getByTestId('plans.group.window')).toBeVisible(); };
const sound = async (page) => {
  const widths = await page.evaluate(() => ({ doc: document.documentElement.scrollWidth, win: window.innerWidth }));
  expect(widths.doc, 'no sideways scroll').toBeLessThanOrEqual(widths.win);
  expect(new URL(page.url()).hash).not.toMatch(/\d(?![\w-]*$)/);
  const text = await page.locator('#app').innerText();
  expect(text).not.toMatch(/undefined|NaN|\[object|\{\w+\}/);
  expect(text).not.toMatch(BANNED);
};

test.describe('the plan menu, without an account', () => {
  test('rename, download, open the downloaded copy, delete with its confirm, a copy with the records, the main plan, the three-plan limit, the example read-only, the account page', async ({ page }) => {
    test.setTimeout(300_000);
    const { alex, sam } = plans();
    await plant(page, [alex, sam]);
    await onPlans(page);

    await test.step('the list: each row has its menu, no box, the banner with the one rule, the ways to a new plan', async () => {
      await expect(page.getByTestId('plans.banner')).toContainText('kept in this browser window until you close it. Make a free account to keep it for good.');
      await expect(page.getByTestId('plans.banner')).toContainText('of your 3 free hours used');
      expect(await page.locator('#app input, #app select, #app textarea').count()).toBe(0);
      for (const id of ['rename', 'copy', 'download', 'delete']) await expect(page.getByTestId(`plans.${id}.MenuPlan01`)).toBeVisible();
      await expect(page.getByTestId('plans.main.MenuPlan01')).toHaveCount(0);           // the main plan already
      await expect(page.getByTestId('plans.main.MenuLocked02')).toBeVisible();
      await expect(page.getByTestId('plans.mainTag.MenuPlan01')).toContainText(W.mainNow);
      await expect(page.getByTestId('plans.start')).toHaveAttribute('href', '#/');
      await expect(page.getByTestId('plans.example')).toBeVisible();
      await expect(page.getByTestId('nav.account')).toHaveAttribute('href', '#/account');
      await expect(page.getByTestId('nav.whatsNew')).toHaveAttribute('href', '#/whats-new');
      await expect(page.getByTestId('news.popup')).toHaveCount(0);                      // a first visit: nothing to announce
      await sound(page);
    });

    await test.step('Rename: the box holds the name; "Rename it" writes it; Sam\'s plan is byte-identical', async () => {
      const before = await stored(page);
      await page.getByTestId('plans.rename.MenuPlan01').click();
      const box = page.getByTestId('plans.rename.name');
      await expect(box).toHaveValue('Alex’s plan');
      await box.fill('Alex’s new plan');
      await page.getByTestId('plans.rename.save').click();
      await expect(page.getByTestId('plans.toast')).toContainText('Renamed to ‘Alex’s new plan’.');
      await expect(page.locator('[data-plan-id="MenuPlan01"] .plan-name')).toContainText('‘Alex’s new plan’');
      const after = await stored(page);
      expect(after.find((p) => p.id === 'MenuPlan01').planDetails.name).toBe('Alex’s new plan');
      expect(JSON.stringify(after.find((p) => p.id === 'MenuLocked02'))).toBe(JSON.stringify(before.find((p) => p.id === 'MenuLocked02')));
      expect(await page.locator('#app input').count()).toBe(0);
      await sound(page);
    });

    let downloaded = null;
    await test.step('Download this plan: the file is the plan as planExportJson, named by planExportFileName; nothing else changes', async () => {
      const before = await stored(page);
      const [download] = await Promise.all([page.waitForEvent('download'), page.getByTestId('plans.download.MenuPlan01').click()]);
      expect(download.suggestedFilename()).toBe(planExportFileName('Alex’s new plan', NOW));
      downloaded = await download.path();
      const text = readFileSync(downloaded, 'utf8');
      const expected = planExportJson(upgradeScenario(before.find((p) => p.id === 'MenuPlan01'), { now: NOW }).scenario);
      expect(text).toBe(expected);
      expect(JSON.stringify(await stored(page))).toBe(JSON.stringify(before));
    });

    await test.step('Open a downloaded copy: the file box, the file, a plan of its own named "… (opened)"', async () => {
      await page.getByTestId('plans.openCopy').click();
      const box = page.getByTestId('plans.openFile');
      await expect(box).toBeVisible();
      await box.setInputFiles(downloaded);
      await expect(page.getByTestId('plans.toast')).toContainText('Opened as ‘Alex’s new plan (opened)’.');
      await expect(page.locator('.plan-row')).toHaveCount(3);
      const after = await stored(page);
      expect(after.length).toBe(3);
      const opened = after.find((p) => p.planDetails.name === 'Alex’s new plan (opened)');
      expect(opened.id).toMatch(/^guest-[0-9a-z]{8}$/);
      expect(opened.isActive).toBe(false);
      expect(opened.example).toBeUndefined();
      await sound(page);
    });

    await test.step('Delete the opened plan: the confirm names it and says there is no undo; "Not now" keeps it; "Delete it" removes it from the list and the window', async () => {
      const openedId = (await stored(page)).find((p) => p.planDetails.name === 'Alex’s new plan (opened)').id;
      await page.getByTestId(`plans.delete.${openedId}`).click();
      const box = page.getByTestId(`plans.deleteBox.${openedId}`);
      await expect(box).toContainText('Delete ‘Alex’s new plan (opened)’?');
      await expect(box).toContainText('This cannot be undone.');
      await page.getByTestId('plans.delete.notNow').click();
      await expect(box).toHaveCount(0);
      expect((await stored(page)).length).toBe(3);
      await page.getByTestId(`plans.delete.${openedId}`).click();
      await page.getByTestId('plans.delete.yes').click();
      await expect(page.getByTestId('plans.toast')).toContainText('‘Alex’s new plan (opened)’ has been deleted.');
      await expect(page.locator('.plan-row')).toHaveCount(2);
      expect((await stored(page)).map((p) => p.id).sort()).toEqual(['MenuLocked02', 'MenuPlan01']);
      await sound(page);
    });

    await test.step('Make a copy of Sam\'s locked plan with its records: the question, the copy locked from the start, equal to the rules in Node', async () => {
      await page.getByTestId('plans.copy.MenuLocked02').click();
      await expect(page.getByTestId('plans.copyBox.MenuLocked02')).toContainText('with its monthly records');
      await page.getByTestId('plans.copy.records').click();
      await expect(page.getByTestId('plans.toast')).toContainText('Copied as ‘Sam’s plan (copy)’, with the records, locked.');
      const after = await stored(page);
      const made = after.find((p) => p.planDetails.name === 'Sam’s plan (copy)');
      const want = upgradeScenario({ ...copyOf(upgradeScenario(sam, { now: NOW }).scenario, 'Sam’s plan (copy)', { carryHistory: true, now: NOW }), createdAt: NOW.toISOString(), lastModified: NOW.toISOString() }, { now: NOW }).scenario;
      const { id, ...rest } = made; void id;
      expect(rest).toEqual(want);
      expect(made.decisionTool.settings.lockedBy).toBe('copied with records');
      await expect(page.locator(`[data-plan-id="${made.id}"] .plan-stage`)).toContainText('Locked 30 September 2026.');
      await sound(page);
    });

    await test.step('the third plan fills the window: a fourth copy is refused in words, nothing written; "Make this my main plan" moves the flag', async () => {
      const before = await stored(page);
      await page.getByTestId('plans.copy.MenuPlan01').click();
      await page.getByTestId('plans.copy.plain').click();
      await expect(page.getByTestId('plans.problem.MenuPlan01')).toContainText('Without an account you can keep up to three plans in this browser window.');
      expect(JSON.stringify(await stored(page))).toBe(JSON.stringify(before));
      await page.getByTestId('plans.main.MenuLocked02').click();
      await expect(page.getByTestId('plans.toast')).toContainText('‘Sam’s plan’ is now your main plan.');
      const after = await stored(page);
      expect(after.find((p) => p.id === 'MenuLocked02').isActive).toBe(true);
      expect(after.find((p) => p.id === 'MenuPlan01').isActive).toBe(false);
      await expect(page.getByTestId('plans.mainTag.MenuLocked02')).toBeVisible();
      await sound(page);
    });

    await test.step('"Look around an example": the example plan opens; on the list it is marked, read-only, does not count, and can be deleted', async () => {
      await page.getByTestId('plans.example').click();
      await expect(page.locator('#app [data-screen]')).toHaveAttribute('data-screen', /^plan/);
      await expect(page.getByTestId('plan.stageLine')).toBeVisible();
      const all = await stored(page);
      const example = all.find((p) => p.example === true);
      expect(example.planDetails.name).toBe(DEMO_PLANS[EXAMPLE_PLAN_KEY].name);
      expect(example.stressTool.settings.equityMin).toBe(DEMO_PLANS[EXAMPLE_PLAN_KEY].stress.equityMin);
      expect(new URL(page.url()).hash).toBe('#/plan/' + example.id);
      await onPlans(page);
      await expect(page.getByTestId(`plans.exampleTag.${example.id}`)).toContainText(W.exampleRow);
      await expect(page.getByTestId(`plans.rename.${example.id}`)).toHaveCount(0);
      await expect(page.getByTestId(`plans.main.${example.id}`)).toHaveCount(0);
      await expect(page.getByTestId(`plans.copy.${example.id}`)).toBeVisible();
      // it does not count: the window still holds its three of the person's own, and refuses a fourth
      await page.getByTestId('plans.copy.MenuPlan01').click();
      await page.getByTestId('plans.copy.plain').click();
      await expect(page.getByTestId('plans.problem.MenuPlan01')).toBeVisible();
      // deletable
      await page.getByTestId(`plans.delete.${example.id}`).click();
      await page.getByTestId('plans.delete.yes').click();
      await expect(page.locator(`[data-plan-id="${example.id}"]`)).toHaveCount(0);
      expect((await stored(page)).some((p) => p.example === true)).toBe(false);
      await sound(page);
    });

    await test.step('the account page as a visitor: the sign-in form, Google, the other forms; never "Delete my account"', async () => {
      await page.getByTestId('nav.account').click();
      await expect(page.locator('#app [data-screen]')).toHaveAttribute('data-screen', 'account');
      await expect(page.getByTestId('account.signIn')).toBeVisible();
      await expect(page.getByTestId('account.email')).toBeVisible();
      await expect(page.getByTestId('account.password')).toHaveAttribute('type', 'password');
      await expect(page.getByTestId('account.google')).toBeVisible();
      await expect(page.getByTestId('account.delete')).toHaveCount(0);
      expect(await page.locator('#app').innerText()).not.toContain(ACCOUNT.remove.button);
      await page.getByTestId('account.toSignUp').click();
      await expect(page.getByTestId('account.signUp')).toBeVisible();
      await page.getByTestId('account.toSignIn').click();
      await page.getByTestId('account.toReset').click();
      await expect(page.getByTestId('account.reset')).toBeVisible();
      await expect(page.getByTestId('account.password')).toHaveCount(0);
      await expect(page.getByTestId('account.privacy')).toHaveAttribute('href', '../privacy.html');
      await sound(page);
      // the stop (the three hours used up) is drawn on the plans page, never here
      await page.evaluate(() => { localStorage.setItem('pt_guest_minutes', '180'); });
      await page.reload();
      await expect(page.getByTestId('account.signIn')).toBeVisible();
      await expect(page.getByTestId('guest.stop')).toHaveCount(0);
      await page.goto(v7('#/plans'));
      await expect(page.getByTestId('guest.stop')).toBeVisible();
      await expect(page.getByTestId('guest.stop')).toContainText('Your 3 free hours are used up — sign in to keep going');
      await expect(page.getByTestId('guest.stop.signIn')).toHaveAttribute('href', '#/account');
    });
  });
});
