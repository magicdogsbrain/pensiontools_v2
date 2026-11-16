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
  await closeNews(page);
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
  await expect.poll(async () => (await page.locator('.tab[data-tab="stress"]').isVisible()) || (await page.locator('#mobileTabBar [data-mtab="stress"]').isVisible()), { timeout: 45_000 }).toBe(true);
}

/**
 * The once-only "What's new" pop-up of either view, closed as a person closes it ("Got it"). It opens for a new account
 * on its next visit; until it is closed nothing under it can be pressed in the full view, and in the simple view it sits
 * over the plan's page.
 */
export async function closeNews(page) {
  const news = page.locator('[role="dialog"][aria-label="What\'s new"]');
  if (await news.isVisible().catch(() => false)) await news.getByRole('button', { name: 'Got it' }).click();
  const v7 = page.getByTestId('news.gotIt');                       // the simple view's own, over a plan's page
  if (await v7.isVisible().catch(() => false)) await v7.click();
}

/**
 * A page of the full view: its tab, then its sub-tab. Opens the full view first when it is not open. Returns false when
 * the full view does not show that tab for this plan (a stage's tabs only), true when the page is open.
 */
export async function fullPage(page, pageName) {
  const p = PAGES.full[pageName];
  if (!p) throw new Error(`routes.fullPage: no full-view page "${pageName}"`);
  const bar = page.locator('#mobileTabBar');
  if (!new URL(page.url()).pathname.startsWith(CLASSIC_PATH) || !(await page.locator('.tab[data-tab="stress"]').isVisible() || await bar.isVisible())) await openFull(page);
  await closeNews(page);
  if (!p.tab) return true;
  const tab = page.locator(`.tab[data-tab="${p.tab}"]`);
  if (await tab.isVisible()) await tab.click();
  else if (await bar.isVisible()) {
    // a phone: the bottom bar, or its "More" sheet; a tab the stage hides is not offered there either
    if (!(await tab.evaluate((b) => b.style.display !== 'none').catch(() => false))) return false;
    const direct = bar.locator(`[data-mtab="${p.tab}"]`);
    if (await direct.isVisible()) await direct.click();
    else {
      await bar.locator('[data-mtab="more"]').click();
      const item = page.locator(`#mobileSheetBody button[data-on-click*="mobileGo('${p.tab}')"]`);
      if (!(await item.isVisible().catch(() => false))) return false;
      await item.click();
    }
  } else return false;
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
 * A question answered from its first step: `numbers` typed on the numbers step, then "Next: what you would spend" where
 * there is one, then `spend`, then "Show". Waits for the final answer.
 */
export async function answer(page, q, { numbers = {}, spend = {} } = {}) {
  if ((await screenOf(page).catch(() => null)) !== `${q}.numbers`) await openSimple(page, `#/${q}/numbers`);
  for (const [path, v] of Object.entries(numbers)) await setField(page, q, path, v);
  const onward = page.getByTestId(`${q}.action.onward`);
  if (await onward.isVisible().catch(() => false)) {
    await onward.click();
    await expect(page.locator('#app [data-screen]')).toHaveAttribute('data-screen', `${q}.spend`, { timeout: 15_000 });
  }
  for (const [path, v] of Object.entries(spend)) await setField(page, q, path, v);    // a question with one form (D) has its spending on it
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

/**
 * A box on a plan's page changed and saved, as a person does: open the page, type, press Save. `box` is the field's
 * path on that page (plan.<step>.<path>).
 */
export async function editAndSave(page, planId, pageName, path, value) {
  await planPage(page, planId, pageName);
  const step = PAGES.simple[pageName].step;
  const box = page.getByTestId(`plan.${step}.${path}`).or(page.locator(`[id="plan.${step}.${path}"]`)).first();
  await expect(box).toBeVisible({ timeout: 30_000 });
  await box.fill('');
  await box.pressSequentially(String(value));
  await page.getByTestId(`plan.${step}.save`).click();
  await expect(page.getByTestId(`plan.${step}.save`)).toHaveCount(0, { timeout: 30_000 }).catch(() => {});
  await settled(page).catch(() => {});
}

/** The plan's name as its home shows it (the kicker: YOUR PLAN '…'). */
export async function planName(page, planId) {
  await planPage(page, planId, 'home');
  const k = page.getByTestId('plan.home.kicker');
  await expect(k).toBeVisible({ timeout: 30_000 });
  return (await k.innerText()).replace(/^\s*your plan\s*/i, '').replace(/^[‘']|[’']$/g, '').trim();
}

/**
 * Coming back later: a new browser context (nothing kept from the last visit but the account), the same screen size,
 * its clock at `when`. Returns its page; the caller signs in again.
 */
export async function comeBack(browser, page, when) {
  const ctx = await browser.newContext({
    viewport: page.viewportSize(), locale: 'en-GB', timezoneId: 'Europe/London', colorScheme: 'dark', serviceWorkers: 'block',
    hasTouch: page.viewportSize().width < 500, isMobile: page.viewportSize().width < 500, reducedMotion: 'reduce'
  });
  const later = await ctx.newPage();
  await at(later, when);
  return later;
}

/** The plan's name in the full view's picker ("PLAN: <name> 🔒 locked · …"), or '' while it is still loading. */
const pickerName = (t) => { const n = String(t).replace(/^\s*plan:\s*/i, '').split('\n').map((l) => l.trim()).filter(Boolean)[0] || ''; return /^loading/i.test(n) ? '' : n; };

/** Where the site's root lands: { view: 'simple', planId, step } or { view: 'full', name } (the plan the picker shows). */
export async function landing(page) {
  await page.goto(PROD + '/');
  await expect.poll(async () => {
    const u = new URL(page.url());
    if (u.pathname.startsWith(CLASSIC_PATH) && CLASSIC_PATH !== '/') return pickerName(await page.locator('#scenarioSelector').innerText().catch(() => '')) ? 'full' : '';
    return (await page.locator('#app [data-screen]').count()) ? 'simple' : '';
  }, { timeout: 45_000 }).not.toBe('');
  const u = new URL(page.url());
  if (u.pathname.startsWith(CLASSIC_PATH) && CLASSIC_PATH !== '/') return { view: 'full', name: pickerName(await page.locator('#scenarioSelector').innerText()) };
  return { view: 'simple', ...(planAddress(page) || {}), screen: await screenOf(page) };
}
