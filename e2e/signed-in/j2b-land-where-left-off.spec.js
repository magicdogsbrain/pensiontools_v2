/**
 * J2b (research/v7/after-7.md §2): signed in with plans, opening the site's root lands where the person left off — their
 * last plan and step — with "All questions" one plain link away.
 *   - a new tab at the root: the last place, as the account remembers it (users/{uid}/profile/settings lastLocation: a plan
 *     id and a step name, no figure);
 *   - a window's own last place wins over another window's in the same browser;
 *   - a plan that is gone, or closed: "Your plans";
 *   - a LOCKED plan lands on its home (7.3.0), whatever step was last open: someone carrying out a plan comes back to what is due;
 *   - "All questions" (and the name in the header) still open the questions; nobody signed in: the questions, as before.
 * On 7.0.0 the root always opened the questions (the first test failed there). Run against the local emulators, at
 * desktop-1440 and phone-390.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test, expect, REPO } from '../helpers/app.js';
import { clearEmulators, makeAccount, putPlan, putSettings, settingsOf, ALEX } from './emulator.js';
import { atFixedTime, openAt, signIn, planAddress } from './journeys.js';
import { VERSION } from '../../src/constants.js';

const ONE = 'AlexPlanOne1';
const TWO = 'AlexPlanTwo2';

function plan(id, name, more = {}) {
  const p = JSON.parse(readFileSync(join(REPO, 'tests', 'fixtures', 'plans', '01-fresh-default.json'), 'utf8'));
  return { ...p, id, planDetails: { ...p.planDetails, name }, isActive: id === ONE, ...more };
}

async function alexWith(page, plans, settings = {}) {
  const { uid } = await makeAccount(ALEX);
  for (const p of plans) await putPlan(uid, p);
  await putSettings(uid, { lastSeenVersion: VERSION, ...settings });
  await atFixedTime(page);
  await openAt(page, '#/account');
  await signIn(page, ALEX);
  await expect(page.getByTestId('account.signedIn')).toBeVisible();
  return uid;
}

const screen = (page) => page.locator('#app [data-screen]');
/** A new tab in the same browser (the sign-in and the note are the browser's; the window's own place is not). */
async function newTab(page) {
  const tab = await page.context().newPage();
  await atFixedTime(tab);
  return tab;
}

test.beforeEach(async () => { await clearEmulators(); });

test('a new tab at the site\'s root lands on the last plan and step; "All questions" still opens the questions', async ({ page }) => {
  const uid = await alexWith(page, [plan(ONE, 'Alex’s plan'), plan(TWO, 'Alex’s other plan')]);
  await openAt(page, `#/plan/${TWO}/about`);
  await expect(screen(page)).toHaveAttribute('data-screen', 'plan.about');
  await expect.poll(async () => (await settingsOf(uid)).lastLocation, { timeout: 15_000 }).toEqual({ planId: TWO, step: 'about' });

  const tab = await newTab(page);
  await openAt(tab, '');
  await expect(screen(tab)).toHaveAttribute('data-screen', 'plan.about', { timeout: 30_000 });
  expect(planAddress(tab)).toEqual({ planId: TWO, step: 'about' });

  // the questions are one plain link away, and stay put
  await tab.locator('header a[href="#/"]').filter({ visible: true }).last().click();
  await expect(screen(tab)).toHaveAttribute('data-screen', 'front');
  await tab.reload();
  await expect(screen(tab)).toHaveAttribute('data-screen', 'front');
  // someone signed in keeps today's front door (7.5.0 redesigns only the stranger's)
  await expect(tab.locator('#app h1')).toHaveText('What would you like to know?', { timeout: 30_000 });
});

test('a locked plan lands on its home, whatever step was last open (7.3.0); an unlocked one on the step', async ({ page }) => {
  const locked = JSON.parse(readFileSync(join(REPO, 'tests', 'fixtures', 'plans', '04-buckets-running.json'), 'utf8'));
  delete locked.household;
  const LOCKED = 'AlexLocked03';
  await alexWith(page, [{ ...locked, id: LOCKED, planDetails: { ...locked.planDetails, name: 'Alex’s locked plan' }, isActive: false }, plan(ONE, 'Alex’s plan')]);
  await openAt(page, `#/plan/${LOCKED}/month`);
  await expect(screen(page)).toHaveAttribute('data-screen', 'plan.month');
  const tab = await newTab(page);
  await openAt(tab, '');
  await expect(tab.getByTestId('plan.home')).toBeVisible({ timeout: 30_000 });
  expect(planAddress(tab)).toEqual({ planId: LOCKED, step: null });
  await expect(tab.locator('#app form')).toHaveCount(0);
});

test('a window\'s own last place wins over another window\'s', async ({ page }) => {
  await alexWith(page, [plan(ONE, 'Alex’s plan'), plan(TWO, 'Alex’s other plan')]);
  await openAt(page, `#/plan/${ONE}/spend`);
  await expect(screen(page)).toHaveAttribute('data-screen', 'plan.spend');
  const tab = await newTab(page);
  await openAt(tab, `#/plan/${TWO}/income`);
  await expect(screen(tab)).toHaveAttribute('data-screen', 'plan.income');
  // the first window, opened again at the root: its own place, not the other window's later one
  await openAt(page, '');
  await expect(screen(page)).toHaveAttribute('data-screen', 'plan.spend', { timeout: 30_000 });
  expect(planAddress(page)).toEqual({ planId: ONE, step: 'spend' });
});

test('the last place\'s plan closed: "Your plans"', async ({ page }) => {
  await alexWith(page, [plan(ONE, 'Alex’s plan', { closedAt: '2026-08', nextPlanId: TWO }), plan(TWO, 'Alex’s other plan')], { lastLocation: { planId: ONE, step: 'about' } });
  const tab = await newTab(page);
  await openAt(tab, '');
  await expect(screen(tab)).toHaveAttribute('data-screen', 'plans', { timeout: 30_000 });
});

test('the last place\'s plan gone: "Your plans"', async ({ page }) => {
  await alexWith(page, [plan(TWO, 'Alex’s other plan')], { lastLocation: { planId: 'GonePlan99', step: 'about' } });
  const tab = await newTab(page);
  await openAt(tab, '');
  await expect(screen(tab)).toHaveAttribute('data-screen', 'plans', { timeout: 30_000 });
});

test('nobody signed in: the site\'s root opens the questions — the stranger\'s front door (7.5.0): three doors', async ({ page }) => {
  await atFixedTime(page);
  await openAt(page, '');
  await expect(screen(page)).toHaveAttribute('data-screen', 'front');
  await expect(page.locator('#app h1')).toHaveText('Your pension, from saving to living on it.');
  await expect(page.locator('#app [data-door]')).toHaveCount(3);
});
