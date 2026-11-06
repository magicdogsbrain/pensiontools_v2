/**
 * J2c (research/v7/after-7.md §2): signed in, every way from the new app to the classic planner arrives SIGNED IN — never
 * on its landing page or its sign-in screen:
 *   - Month by month's "Open them in the classic planner" (what is still only there until 7.3.0: the months against the plan,
 *     the spreadsheets): the classic planner on that plan's records by tax year. Since 7.2.0 "Record {month}" and
 *     "Set up {year}" stay in the new app (Month by month is its own; e2e/signed-in/j3-month-by-month.spec.js), and the
 *     second test here says so;
 *   - "Change this" on an unlocked plan: its settings, on that plan;
 *   - the header's "Use the previous version": the classic planner, signed in, with no hand-over at all.
 * Before 7.1.0 the new app kept its sign-in under a Firebase app of its own name, which the classic planner never reads:
 * every one of these opened the classic planner as if nobody were signed in (the first test here failed so on 7.0.0).
 * Run against the local emulators (e2e/signed-in/emulator.js), at desktop-1440 and phone-390.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test, expect, PROD, REPO, FIXED_NOW, V7_PATH, atClassic, WORKER_DATA_MISSING } from '../helpers/app.js';
import { clearEmulators, makeAccount, putPlan, putSettings, ALEX } from './emulator.js';
import { VERSION } from '../../src/constants.js';

const DRAW_ID = 'AlexDrawPlan1';
const FRESH_ID = 'AlexFreshPlan1';

const fixture = (name) => JSON.parse(readFileSync(join(REPO, 'tests', 'fixtures', 'plans', name), 'utf8'));

/** A drawing plan with records to the end of June (corpus 04, Buckets, running), as Alex's: July is the month to record. */
function drawingPlan({ yearSetUp = true } = {}) {
  const p = fixture('04-buckets-running.json');
  p.id = DRAW_ID;
  p.planDetails.name = 'Alex’s plan';
  p.isActive = true;
  delete p.household;
  p.decisionTool.history = p.decisionTool.history.filter((h) => h.date < '2026-07');
  if (!yearSetUp) delete p.decisionTool.taxYears['26/27'];
  return p;
}
/** An unlocked plan with nothing recorded (corpus 01), as Alex's second plan. */
function freshPlan() {
  const p = fixture('01-fresh-default.json');
  p.id = FRESH_ID;
  p.planDetails.name = 'Alex’s other plan';
  p.isActive = false;
  return p;
}

/** Alex's account, with the plans given, having read What's new: signed in on the new app's account page. */
async function signedInWith(page, plans) {
  const { uid } = await makeAccount(ALEX);
  for (const p of plans) await putPlan(uid, p);
  await putSettings(uid, { lastSeenVersion: VERSION });
  await page.clock.setFixedTime(new Date(FIXED_NOW));
  await page.goto(PROD + V7_PATH + '#/account');
  await expect(page.getByTestId('account.signIn')).toBeVisible();
  await page.getByTestId('account.email').fill(ALEX.email);
  await page.getByTestId('account.password').fill(ALEX.password);
  await page.getByTestId('account.signIn.submit').click();
  await expect(page.getByTestId('account.signedIn')).toBeVisible();
  return uid;
}

/** The classic planner, opened and signed in: its main app, never its landing page or sign-in screen. */
async function classicSignedIn(page) {
  await page.waitForURL((u) => atClassic(u.href));
  await expect(page.locator('#mainApp')).toBeVisible({ timeout: 45_000 });
  await expect(page.locator('#landingPage')).toBeHidden();
  await expect(page.locator('#authScreen')).toBeHidden();
  await expect(page.locator('#userEmail')).toHaveText(ALEX.email);
}

test.beforeEach(async ({ watch }) => {
  await clearEmulators();
  watch.allow(WORKER_DATA_MISSING);
});

test('Month by month\'s "Open them in the classic planner" opens the classic planner signed in, on the plan\'s records by tax year', async ({ page }) => {
  await signedInWith(page, [drawingPlan()]);
  await page.goto(PROD + V7_PATH + `#/plan/${DRAW_ID}/month`);
  await expect(page.getByTestId('plan.month.submit')).toHaveText('Record September 2026');   // this month; July and August named as missed
  await expect(page.getByTestId('plan.month.gap')).toContainText('July 2026 and August 2026');
  await page.getByTestId('plan.month.classic').click();
  await classicSignedIn(page);
  await expect(page.locator('#openPlaceNote')).toContainText('‘Alex’s plan’');
  await expect(page.locator('#decision-history')).toBeVisible({ timeout: 45_000 });
});

test('"Record {month}" and "Set up {year}" stay in the new app (7.2.0): Month by month, on the plan', async ({ page }) => {
  await signedInWith(page, [drawingPlan({ yearSetUp: false })]);
  await page.goto(PROD + V7_PATH + `#/plan/${DRAW_ID}/where`);
  const setUp = page.locator(`a[href="#/plan/${DRAW_ID}/month"]`).filter({ hasText: 'Set up 2026/27' }).first();
  await expect(setUp).toHaveCount(1);
  await page.goto(PROD + V7_PATH + `#/plan/${DRAW_ID}/month`);
  await expect(page.locator('#app [data-screen]')).toHaveAttribute('data-screen', 'plan.month');
  await expect(page.getByTestId('plan.month.setUp')).toHaveAttribute('data-year', '26/27');
  expect(atClassic(page.url())).toBe(false);
});

test('"Change this" on an unlocked plan opens the classic planner signed in, on that plan\'s settings', async ({ page }) => {
  await signedInWith(page, [drawingPlan(), freshPlan()]);
  await page.goto(PROD + V7_PATH + `#/plan/${FRESH_ID}/plan`);
  await page.getByTestId('plan.plan.change.else').click();
  await classicSignedIn(page);
  await expect(page.locator('#openPlaceNote')).toContainText('‘Alex’s other plan’');
  await expect(page.locator('.sub-tab[data-stresstab="stresssettings"]')).toHaveClass(/active/, { timeout: 45_000 });
});

test('the header\'s "Use the previous version" opens the classic planner signed in', async ({ page }) => {
  await signedInWith(page, [drawingPlan()]);
  await page.goto(PROD + V7_PATH + '#/plans');
  const link = page.getByTestId('nav.previous').or(page.getByTestId('nav.previousShort')).filter({ visible: true });
  await link.click();
  await classicSignedIn(page);
});
