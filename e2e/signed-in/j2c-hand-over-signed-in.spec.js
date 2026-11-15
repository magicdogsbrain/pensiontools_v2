/**
 * J2c (research/v7/after-7.md §2): signed in, every way from the new app to the classic planner arrives SIGNED IN — never
 * on its landing page or its sign-in screen:
 *   - Month by month's "Open them in the classic planner" (what is still only there until 7.3.0: the months against the plan,
 *     the spreadsheets): the classic planner on that plan's records by tax year. Since 7.2.0 "Record {month}" and
 *     "Set up {year}" stay in the new app (Month by month is its own; e2e/signed-in/j3-month-by-month.spec.js), and the
 *     second test here says so;
 *   - "Change this" on an unlocked plan: its settings, on that plan;
 *   - the header's "Show everything": the full view, signed in; on a plan page, THAT plan (7.3.2).
 * Before 7.1.0 the new app kept its sign-in under a Firebase app of its own name, which the classic planner never reads:
 * every one of these opened the classic planner as if nobody were signed in (the first test here failed so on 7.0.0).
 * And (7.11.0) the full view as the usual view: chosen on Your account or the strip, the site's root opens it before
 * anything is drawn, "Back to the simple view" stays, and a sign-out in either view leaves the root on the front door
 * (T1–T6 below).
 * Run against the local emulators (e2e/signed-in/emulator.js), at desktop-1440 and phone-390.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test, expect, PROD, REPO, FIXED_NOW, V7_PATH, CLASSIC_TITLE, atClassic, WORKER_DATA_MISSING } from '../helpers/app.js';
import { clearEmulators, makeAccount, putPlan, putSettings, settingsOf, plansOf, ALEX } from './emulator.js';
import { VERSION } from '../../src/constants.js';
import { SCHEMA_VERSION } from '../../src/storage/schema.js';

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

/**
 * Alex's account, with the plans given, having read What's new (and any other settings given): signed in on the new
 * app's account page — or, with a place last left in the settings, taken on to it (effects/place.js). `fixedClock: false`
 * leaves the page's clock real: Playwright's fixed clock replaces the page's performance object, so a reload would read
 * as a fresh open (the strip's test needs the difference).
 */
async function signedInWith(page, plans, settings = {}, { fixedClock = true } = {}) {
  const { uid } = await makeAccount(ALEX);
  for (const p of plans) await putPlan(uid, p);
  await putSettings(uid, { lastSeenVersion: VERSION, ...settings });
  if (fixedClock) await page.clock.setFixedTime(new Date(FIXED_NOW));
  await page.goto(PROD + V7_PATH + '#/account');
  await expect(page.getByTestId('account.signIn')).toBeVisible();
  await page.getByTestId('account.email').fill(ALEX.email);
  await page.getByTestId('account.password').fill(ALEX.password);
  await page.getByTestId('account.signIn.submit').click();
  await expect(page.getByTestId('account.signedIn').or(page.locator('#app main[data-screen^="plan"]'))).toBeVisible();
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

test('the header\'s "Show everything" opens the full view signed in', async ({ page }) => {
  await signedInWith(page, [drawingPlan()]);
  await page.goto(PROD + V7_PATH + '#/plans');
  const link = page.getByTestId('nav.everything').or(page.getByTestId('nav.everythingShort')).filter({ visible: true });
  await link.click();
  await classicSignedIn(page);
});

test('7.3.2: on a plan page, "Show everything" opens THAT plan, not the account\'s usual one', async ({ page }) => {
  // the account's usual plan is the other one (isActive): before 7.3.2 the plain link opened it, on its own last tab
  const viewed = drawingPlan(); viewed.isActive = false;
  const usual = freshPlan(); usual.isActive = true;
  await signedInWith(page, [viewed, usual]);
  await page.goto(PROD + V7_PATH + `#/plan/${DRAW_ID}`);
  await expect(page.locator('#app [data-screen]')).toHaveAttribute('data-screen', /^plan/);
  const link = page.getByTestId('nav.everything').or(page.getByTestId('nav.everythingShort')).filter({ visible: true });
  await link.click();
  await classicSignedIn(page);
  await expect(page.locator('#openPlaceNote')).toContainText('‘Alex’s plan’');
  await expect(page.locator('.sub-tab[data-decisiontab="entry"]')).toHaveClass(/active/, { timeout: 45_000 });
});

// ---- the full view as the usual view (7.11.0; research/v7/replan-nov-2026.md §8) ---------------------------------------
//
// Alex's main plan (isActive) is the drawing plan; the account was last on the other plan. The choice is made on Your
// account (or the strip); the site's root then opens the full view before anything is drawn, from this browser's copy;
// "Back to the simple view" changes only the place; signing out in either view takes the copy and the notes away.

const screen = (page) => page.locator('#app [data-screen]');
const stored = (page, key) => page.evaluate((k) => localStorage.getItem(k), key);
/** The page stays out of the full view for three seconds (no bounce): waiting for it to get there, and it does not. */
async function staysInSimple(page) {
  const went = await page.waitForURL((u) => atClassic(u.href), { timeout: 3_000 }).then(() => true, () => false);
  expect(went, 'the page went on to the full view').toBe(false);
}
/** The plan's keys whose values differ between two reads (as j12 compares them). */
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const changed = (a, b) => [...new Set([...Object.keys(a || {}), ...Object.keys(b || {})])].filter((k) => !same(a[k], b[k])).sort();
/** Choose a view on Your account, and wait until the account and this browser's copy both say so. */
async function choose(page, uid, view) {
  await page.goto(PROD + V7_PATH + '#/account');
  const button = page.getByTestId('account.view.' + view);
  await expect(button).toBeVisible({ timeout: 30_000 });
  await button.click();
  await expect(button).toHaveAttribute('aria-pressed', 'true');
  await expect.poll(async () => ((await settingsOf(uid)) || {}).view, { timeout: 15_000 }).toBe(view);
  await expect.poll(() => stored(page, 'pt_view')).toBe(view === 'full' ? 'full' : null);
}
/** The plan's home in the simple view, drawn, with the account's settings read. */
async function simpleHome(page, id) {
  await expect(page).toHaveURL(new RegExp(`${V7_PATH.replace(/\//g, '\\/')}#/plan/${id}$`));
  await expect(screen(page)).toHaveAttribute('data-screen', /^plan/, { timeout: 30_000 });
  await expect(page.locator('#app')).toHaveAttribute('data-ready', '1', { timeout: 30_000 });
}
/** From a plan's home, "Show everything" to the full view and its note's way back: the strip's round trip. */
async function roundTrip(page, id) {
  await page.getByTestId('nav.everything').or(page.getByTestId('nav.everythingShort')).filter({ visible: true }).click();
  await classicSignedIn(page);
  await expect(page.locator('#openPlaceNote')).toContainText('Opened from the simple view.', { timeout: 45_000 });
  await page.locator('#openPlaceNote a').click();
  await simpleHome(page, id);
}

test.describe('the full view as the usual view', () => {
  test('T1: chosen on Your account, the site\'s root opens the full view on the main plan, writing nothing; "Back to the simple view" stays there and keeps the choice', async ({ page }) => {
    // plans saved in today's format, so the full view's own bringing of an older plan up to date is not what is counted
    const current = (p) => ({ ...p, schemaVersion: SCHEMA_VERSION });
    const uid = await signedInWith(page, [current(drawingPlan()), current(freshPlan())], { lastLocation: { planId: FRESH_ID, step: null } });
    // the sign-in on Your account goes on to the plan the account was last on (effects/place.js followSignIn)
    await page.waitForURL((u) => new URL(u.href).hash === `#/plan/${FRESH_ID}`);
    await expect(screen(page)).toHaveAttribute('data-screen', /^plan/, { timeout: 30_000 });
    await choose(page, uid, 'full');
    const s0 = await settingsOf(uid);
    const p0 = await plansOf(uid);

    await page.goto(PROD + V7_PATH);
    await classicSignedIn(page);
    await expect(page).toHaveTitle(CLASSIC_TITLE);
    await expect(page.locator('#openPlaceNote')).toHaveCount(0);
    await expect(page.locator('#classicToFront')).toHaveText('This is the full view. Back to the simple view.');
    await expect(page.locator('#scenarioActiveName')).toHaveText('Alex’s plan', { timeout: 45_000 });
    // the banner is drawn after the page's stage is worked out and its stage record saved (homeBannerUi.js updateHomeBanner)
    await expect(page.locator('#nextStepBanner')).toBeVisible({ timeout: 60_000 });
    await expect.poll(() => page.evaluate(() => !!window._nextStepDismiss), { timeout: 30_000 }).toBe(true);

    // nothing written by the root (the simple view never ran); the full view's own stage record, and nothing else
    expect(await settingsOf(uid)).toEqual(s0);
    const p1 = await plansOf(uid);
    expect(p1.map((p) => p.id).sort()).toEqual(p0.map((p) => p.id).sort());
    for (const before of p0) {
      const after = p1.find((p) => p.id === before.id);
      expect(changed(before, after).filter((k) => k !== 'journey'), before.id).toEqual([]);
    }

    // one home in both views: the first thing due on the simple view's home is the full view's banner line
    const two = await page.context().newPage();
    await two.clock.setFixedTime(new Date(FIXED_NOW));
    await two.goto(PROD + V7_PATH + `#/plan/${DRAW_ID}`);
    const first = two.getByTestId('plan.home.todo').locator('.home-item').first();
    await expect(first).toBeVisible({ timeout: 30_000 });
    const title = (await first.locator('.home-item-text strong').first().textContent() || '').trim();
    expect(title.length).toBeGreaterThan(0);
    await expect(page.locator('#nextStepText')).toContainText(title, { ignoreCase: true });
    await two.close();

    const back = page.locator('#classicToSimple');
    await expect.poll(() => back.getAttribute('href')).toMatch(new RegExp(`#/plan/${DRAW_ID}$`));
    await back.click();
    await simpleHome(page, DRAW_ID);
    await staysInSimple(page);
    await expect(page.getByTestId('view.strip')).toHaveCount(0);
    expect(((await settingsOf(uid)) || {}).view).toBe('full');

    await page.goto(PROD + V7_PATH);
    await page.waitForURL((u) => atClassic(u.href));

    // back to the simple view, and on to Your account from there, to choose the simple view again
    await page.locator('#classicToSimple').click();
    await simpleHome(page, DRAW_ID);
    await choose(page, uid, 'simple');
    expect(((await settingsOf(uid)) || {}).lastLocation.planId).toBe(DRAW_ID);
    await page.goto(PROD + V7_PATH);
    await simpleHome(page, DRAW_ID);
    await staysInSimple(page);
  });

  test('T2: the strip after a visit to the full view, until it is answered or put off — never on a reload, never after "Not now", never once a view is stored', async ({ page }) => {
    const uid = await signedInWith(page, [drawingPlan(), freshPlan()], {}, { fixedClock: false });
    await page.goto(PROD + V7_PATH + `#/plan/${DRAW_ID}`);
    await simpleHome(page, DRAW_ID);
    const strip = page.getByTestId('view.strip');
    await expect(strip).toHaveCount(0);

    await roundTrip(page, DRAW_ID);
    await expect(strip).toBeVisible({ timeout: 30_000 });
    await expect(strip).toContainText('You have just been in the full view.');

    await page.reload();
    await simpleHome(page, DRAW_ID);
    await expect(strip).toHaveCount(0);

    await roundTrip(page, DRAW_ID);
    await expect(strip).toBeVisible({ timeout: 30_000 });
    await page.getByTestId('view.strip.notNow').click();
    await expect(strip).toHaveCount(0);
    expect(((await settingsOf(uid)) || {}).view).toBe(undefined);
    expect(await stored(page, 'pt_view_asked')).toBe('1');

    await roundTrip(page, DRAW_ID);
    await expect(strip).toHaveCount(0);

    await page.evaluate(() => localStorage.removeItem('pt_view_asked'));
    await roundTrip(page, DRAW_ID);
    await expect(strip).toBeVisible({ timeout: 30_000 });
    await page.getByTestId('view.strip.simple').click();
    await expect.poll(async () => ((await settingsOf(uid)) || {}).view, { timeout: 15_000 }).toBe('simple');
    await expect(page.getByTestId('view.strip.done')).toHaveText('Done: PensionTools keeps opening in the simple view. You can change this on Your account.');
    await expect(page.getByTestId('view.strip.done').locator('a')).toHaveAttribute('href', '#/account');
    await page.goto(PROD + V7_PATH + '#/plans');
    await expect(screen(page)).toHaveAttribute('data-screen', 'plans');
    await expect(strip).toHaveCount(0);

    await page.goto(PROD + V7_PATH + `#/plan/${DRAW_ID}`);
    await simpleHome(page, DRAW_ID);
    await roundTrip(page, DRAW_ID);
    await expect(strip).toHaveCount(0);
    expect(await stored(page, 'pt_view')).toBe(null);
  });

  test('T3: signing out in the simple view takes this browser\'s copy and the signed-in note away; the root is the front door', async ({ page }) => {
    const uid = await signedInWith(page, [drawingPlan()]);
    await choose(page, uid, 'full');
    await page.getByTestId('account.signOut').click();
    await expect(page.getByTestId('account.signIn')).toBeVisible({ timeout: 30_000 });
    await expect.poll(() => stored(page, 'pt_view')).toBe(null);
    await expect.poll(() => stored(page, 'pt_v7_signed_in')).toBe(null);
    await page.goto(PROD + V7_PATH);
    await expect(screen(page)).toHaveAttribute('data-screen', 'front', { timeout: 30_000 });
    await staysInSimple(page);
  });

  test('T4: signing out in the full view takes the simple view\'s notes away too; and when a session ends elsewhere, the full view\'s landing page has the way back', async ({ page }) => {
    const uid = await signedInWith(page, [drawingPlan()]);
    await choose(page, uid, 'full');
    await page.evaluate(() => localStorage.setItem('pt_view_asked', '1'));
    await page.goto(PROD + V7_PATH);
    await classicSignedIn(page);
    // the header's Sign Out (on a phone it is behind the menu, whose "Sign out" presses this same button)
    await page.evaluate(() => document.getElementById('logoutBtn').click());
    await expect(page.locator('#signinForm')).toBeVisible({ timeout: 30_000 });
    await expect(page.locator('#mainApp')).toBeHidden();
    for (const key of ['pt_v7_signed_in', 'pt_view', 'pt_view_asked']) await expect.poll(() => stored(page, key), { message: key }).toBe(null);
    await page.goto(PROD + V7_PATH);
    await expect(screen(page)).toHaveAttribute('data-screen', 'front', { timeout: 30_000 });
    await staysInSimple(page);

    // a session that ended elsewhere (a password changed on another device) leaves the notes as they were
    await page.evaluate(() => { localStorage.setItem('pt_v7_signed_in', '1'); localStorage.setItem('pt_view', 'full'); });
    await page.goto(PROD + V7_PATH);
    await page.waitForURL((u) => atClassic(u.href));
    // the full view's landing page, signed out: its line to the simple view
    await expect(page.locator('#landingPreviewLink')).toBeVisible({ timeout: 30_000 });
    await expect(page.locator('#mainApp')).toBeHidden();
    await page.locator('#landingPreviewLink').click();
    await expect(page).toHaveURL(new RegExp(`${V7_PATH.replace(/\//g, '\\/')}#/$`));
    await expect(screen(page)).toHaveAttribute('data-screen', 'front', { timeout: 30_000 });
    await expect.poll(() => stored(page, 'pt_v7_signed_in'), { timeout: 30_000 }).toBe(null);
    await expect.poll(() => stored(page, 'pt_view')).toBe(null);
    await staysInSimple(page);
    await page.goto(PROD + V7_PATH);
    await expect(screen(page)).toHaveAttribute('data-screen', 'front', { timeout: 30_000 });
    await staysInSimple(page);
  });

  test('T5: the full view opens the plan this window last opened there; its plan menu moves the banner and the way back with it', async ({ page }) => {
    const uid = await signedInWith(page, [drawingPlan(), freshPlan()]);
    await choose(page, uid, 'full');
    await page.goto(PROD + V7_PATH + `#/plan/${FRESH_ID}`);
    await simpleHome(page, FRESH_ID);
    await roundTrip(page, FRESH_ID);

    await page.goto(PROD + V7_PATH);
    await classicSignedIn(page);
    await expect(page.locator('#openPlaceNote')).toHaveCount(0);
    await expect(page.locator('#scenarioActiveName')).toHaveText('Alex’s other plan', { timeout: 45_000 });
    const back = page.locator('#classicToSimple');
    await expect.poll(() => back.getAttribute('href'), { timeout: 30_000 }).toMatch(new RegExp(`#/plan/${FRESH_ID}$`));

    // the plan menu (on a phone, "Switch plan" in the menu presses the same button)
    await page.evaluate(() => document.getElementById('scenarioActiveBtn').click());
    await page.locator(`.scenario-dropdown-item[data-scenario-id="${DRAW_ID}"] .scenario-item-name`).dispatchEvent('click');
    await expect(page.locator('#scenarioActiveName')).toHaveText('Alex’s plan', { timeout: 45_000 });
    await expect.poll(() => back.getAttribute('href'), { timeout: 30_000 }).toMatch(new RegExp(`#/plan/${DRAW_ID}$`));
  });

  test('T6: a browser with no signed-in note opens the simple view\'s front door until a plan page there reads the account; then the root follows the choice', async ({ page }) => {
    const uid = await signedInWith(page, [drawingPlan()]);
    await choose(page, uid, 'full');
    // as in a browser that has only seen Alex signed in in the full view
    await page.evaluate(() => { localStorage.removeItem('pt_v7_signed_in'); localStorage.removeItem('pt_view'); });
    await page.goto(PROD + V7_PATH);
    await expect(screen(page)).toHaveAttribute('data-screen', 'front', { timeout: 30_000 });
    await staysInSimple(page);
    await page.goto(PROD + V7_PATH + `#/plan/${DRAW_ID}`);
    await expect.poll(() => stored(page, 'pt_v7_signed_in'), { timeout: 30_000 }).toBe('1');
    await expect.poll(() => stored(page, 'pt_view'), { timeout: 30_000 }).toBe('full');
    await page.goto(PROD + V7_PATH);
    await page.waitForURL((u) => atClassic(u.href));
    await classicSignedIn(page);
  });
});
