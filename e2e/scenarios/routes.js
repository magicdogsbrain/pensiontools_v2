/**
 * The routes people take, in both views, as presses and typing on the page. Nothing here reads the app's code: the
 * addresses come from e2e/helpers/paths.js and every step is a click or a key, by the page's own test ids.
 *
 * (The brief asks this file to wrap e2e/signed-in/journeys.js. It does its own steps instead: journeys.js loads the
 * browser tests' helper, which loads the engine in Node, and nothing under e2e/scenarios/ may reach the engine.)
 */
import { expect } from '@playwright/test';
import { V7_PATH, CLASSIC_PATH } from '../helpers/paths.js';
import { PAGES } from './facts.js';

export const PROD = `http://127.0.0.1:${Number(process.env.E2E_PORT_PROD || 4173)}`;
/** The default "today" of a scenario: 16 November 2026, mid-morning in London. */
export const TODAY = '2026-11-16T10:00:00.000Z';

/** The clock fixed at `when` (timers keep running), before anything is opened. */
export async function at(page, when = TODAY) { await page.clock.setFixedTime(new Date(when)); }

/** Opens an address of the simple view and waits for its screen. */
export async function openSimple(page, hash = '') {
  await page.goto(PROD + V7_PATH + hash);
  await expect(page.locator('#app [data-screen]')).toBeVisible({ timeout: 30_000 });
}

/** The screen the simple view is drawing. */
export const screenOf = (page) => page.locator('#app [data-screen]').getAttribute('data-screen');

/** Waits until nothing is being worked out on the simple view. */
export async function settled(page, timeout = 90_000) {
  await expect(page.locator('#app')).toHaveAttribute('data-ready', '1', { timeout });
}

/** A plan's page in the simple view (#/plan/<id>/<step>; '' is its home). */
export async function planPage(page, planId, pageName = 'home') {
  const p = PAGES.simple[pageName];
  if (!p) throw new Error(`routes.planPage: no simple page "${pageName}"`);
  await openSimple(page, `#/plan/${planId}${p.step ? `/${p.step}` : ''}`);
  await expect(page.locator('#app [data-screen]')).toHaveAttribute('data-screen', /^plan/, { timeout: 30_000 });
}

/** The plan the address is on: { planId, step } or null. */
export function planAddress(page) {
  const m = /#\/plan\/([^/?]+)(?:\/([a-z]+))?/.exec(new URL(page.url()).hash);
  return m ? { planId: m[1], step: m[2] || null } : null;
}

// ---- the full view --------------------------------------------------------------------------------------------------

/** Opens the full view and waits for its tabs. */
export async function openFull(page) {
  await page.goto(PROD + CLASSIC_PATH);
  await expect(page.locator('.tab[data-tab="stress"]')).toBeVisible({ timeout: 45_000 });
}

/**
 * A page of the full view: its tab, then its sub-tab. Opens the full view first when it is not open. Returns false when
 * the full view does not show that tab for this plan (a stage's tabs only), true when the page is open.
 */
export async function fullPage(page, pageName) {
  const p = PAGES.full[pageName];
  if (!p) throw new Error(`routes.fullPage: no full-view page "${pageName}"`);
  if (!new URL(page.url()).pathname.startsWith(CLASSIC_PATH) || !(await page.locator('.tab[data-tab="stress"]').isVisible())) await openFull(page);
  if (!p.tab) return true;
  const tab = page.locator(`.tab[data-tab="${p.tab}"]`);
  if (!(await tab.isVisible())) return false;
  await tab.click();
  if (p.sub) {
    const sub = page.locator(`.sub-tab[data-${p.tab}tab="${p.sub}"]`);
    if (!(await sub.isVisible())) return false;
    await sub.click();
  }
  return true;
}

// ---- the account ----------------------------------------------------------------------------------------------------

/** "Your account", signed in with email and password. */
export async function signIn(page, who) {
  if (!/#\/account/.test(page.url())) await openSimple(page, '#/account');
  await expect(page.getByTestId('account.signIn')).toBeVisible({ timeout: 30_000 });
  await page.getByTestId('account.email').fill(who.email);
  await page.getByTestId('account.password').fill(who.password);
  await page.getByTestId('account.signIn.submit').click();
  await expect(page.getByTestId('account.signIn')).toHaveCount(0, { timeout: 30_000 });
}

/** "Your account": a new account made on the page; the emailed link followed (`confirm`, the emulator's code). */
export async function signUp(page, who, confirm) {
  if (!/#\/account/.test(page.url())) await openSimple(page, '#/account');
  await expect(page.getByTestId('account.signIn')).toBeVisible({ timeout: 30_000 });
  await page.getByTestId('account.toSignUp').click();
  await page.getByTestId('account.email').fill(who.email);
  await page.getByTestId('account.password').fill(who.password);
  await page.getByTestId('account.signUp.submit').click();
  await expect(page.getByTestId('account.verify')).toBeVisible({ timeout: 30_000 });
  await confirm(who.email);
  await page.getByTestId('account.verify.check').click();
  await expect(page.getByTestId('account.verify')).toHaveCount(0, { timeout: 30_000 });
}

// ---- a question, asked on the page ----------------------------------------------------------------------------------

/**
 * One field of a question, as a person sets it: a choice or a yes/no by its button, a box by typing. `more` fields sit
 * behind "More detail", opened once.
 */
export async function setField(page, q, path, value) {
  const id = `${q}.${path}`;
  const option = page.getByTestId(`${id}.${value === true ? 'yes' : value === false ? 'no' : value}`);
  const box = page.getByTestId(id);
  if (!(await option.count()) && !(await box.count())) {
    const more = page.getByTestId(`${q}.action.moreDetail`);
    if (await more.count()) await more.click();
  }
  if (await option.count()) { await option.first().click(); return; }
  await box.first().click();
  await box.first().fill('');
  await box.first().pressSequentially(String(value));
  await expect(box.first()).toHaveValue(String(value));
}

/**
 * A question answered from its first step: `numbers` typed on the numbers step, then "Next: what you would spend", then
 * `spend` on that step, then "Show". Waits for the final answer.
 */
export async function answer(page, q, { numbers = {}, spend = {} } = {}) {
  if ((await screenOf(page).catch(() => null)) !== `${q}.numbers`) await openSimple(page, `#/${q}/numbers`);
  for (const [path, v] of Object.entries(numbers)) await setField(page, q, path, v);
  const onward = page.getByTestId(`${q}.action.onward`);
  if (Object.keys(spend).length || (await onward.isVisible().catch(() => false))) {
    if (await onward.isVisible().catch(() => false)) await onward.click();
    await expect(page.locator('#app [data-screen]')).toHaveAttribute('data-screen', `${q}.spend`, { timeout: 15_000 });
    for (const [path, v] of Object.entries(spend)) await setField(page, q, path, v);
  }
  await page.getByTestId(`${q}.action.show`).click();
  await expect(page.locator('#app [data-screen]')).toHaveAttribute('data-screen', `${q}.answer`, { timeout: 30_000 });
  await settled(page, 120_000);
}

/** "Keep" at the foot of an answer; returns the new plan's id (from the kept note). */
export async function keep(page, q) {
  const now = page.getByTestId(`${q}.action.save.now`);
  if (await now.isVisible().catch(() => false)) await now.click();
  else await page.getByTestId(`${q}.action.save`).click();
  const made = page.getByTestId(`${q}.keep.made`);
  await expect(made).toBeVisible({ timeout: 30_000 });
  return made.getAttribute('data-plan-id');
}
