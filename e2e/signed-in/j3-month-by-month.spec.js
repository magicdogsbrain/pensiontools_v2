/**
 * J3 (research/v7/after-7.md §2; research/v7/months-in-v7.md): living on the plan, month by month, signed in. A person with a
 * locked drawing plan in the account opens the site and lands on the plan's home (7.3.0; Month by month itself until then),
 * whose first to-do opens Month by month; sets up the tax
 * year (part-way through it: what came in so far); records this month, filling in the months missed since April with one
 * press; every month shows as recorded. Reloaded, everything is still there — read back from the emulator — and the plan's
 * settings are unchanged. And an unlocked drawing plan: asked to lock first, locked, then a month recorded.
 * Fictional plans (Alex), made in the local emulators of a demo- project; at desktop-1440 and phone-390.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test, expect, REPO } from '../helpers/app.js';
import { clearEmulators, makeAccount, putPlan, putSettings, plansOf, ALEX } from './emulator.js';
import { atFixedTime, openAt, signIn, planAddress } from './journeys.js';
import { VERSION } from '../../src/constants.js';

const T = 'plan.month';
const LOCKED = 'AlexMonthly01';
const DRAFT = 'AlexDraftPlan2';
const sortKeys = (v) => (Array.isArray(v) ? v.map(sortKeys) : v && typeof v === 'object' ? Object.keys(v).sort().reduce((o, k) => { if (v[k] !== undefined) o[k] = sortKeys(v[k]); return o; }, {}) : v);
const same = (a, b) => JSON.stringify(sortKeys(a)) === JSON.stringify(sortKeys(b));
const screen = (page) => page.locator('#app [data-screen]');

/** From the corpus's running plan: locked, drawing, with nothing recorded and no tax year set up yet. */
function lockedPlan() {
  const p = JSON.parse(readFileSync(join(REPO, 'tests', 'fixtures', 'plans', '04-buckets-running.json'), 'utf8'));
  delete p.household;
  p.decisionTool.history = []; p.decisionTool.taxYears = {};
  return { ...p, id: LOCKED, planDetails: { ...p.planDetails, name: 'Alex’s plan' }, isActive: true };
}
/** From the corpus's retired draft: drawing, not locked. */
function draftPlan() {
  const p = JSON.parse(readFileSync(join(REPO, 'tests', 'fixtures', 'plans', '02-pnv-draft.json'), 'utf8'));
  delete p.household;
  return { ...p, id: DRAFT, planDetails: { ...p.planDetails, name: 'Alex’s draft' }, isActive: true };
}

async function alexWith(page, plan, step) {
  const { uid } = await makeAccount(ALEX);
  await putPlan(uid, plan);
  await putSettings(uid, { lastSeenVersion: VERSION, lastLocation: { planId: plan.id, step } });
  await atFixedTime(page);
  await openAt(page, '#/account');
  await signIn(page, ALEX);
  // signed in on a new device with a plan remembered (7.3.0): taken to that plan, not left on "Your account"
  await expect(page).toHaveURL(new RegExp('#/plan/' + plan.id), { timeout: 30_000 });
  return uid;
}
async function type(page, path, value) {
  const box = page.getByTestId(`${T}.${path}`);
  await box.fill(value);
  await box.blur();
}

test.beforeEach(async () => { await clearEmulators(); });

test('a locked plan: lands on Month by month, sets up the tax year, records this month and fills in the months since April at once; all still there after a reload, the settings unchanged', async ({ page }) => {
  const planned = lockedPlan();
  const uid = await alexWith(page, planned, null);

  await test.step('the site opens on the plan\'s home, whose first to-do opens Month by month on the tax year to set up', async () => {
    await openAt(page, '');
    await expect(page.getByTestId('plan.home')).toBeVisible({ timeout: 30_000 });
    expect(planAddress(page)).toEqual({ planId: LOCKED, step: null });
    await expect(page.getByTestId('plan.home.todo').locator('.home-item').first()).toHaveAttribute('data-todo', 'month.taxYear');
    await page.getByTestId('plan.home.todo.month.taxYear').click();
    await expect(page.getByTestId('plan.step.month')).toHaveText('Month by month', { timeout: 30_000 });
    expect(planAddress(page)).toEqual({ planId: LOCKED, step: 'month' });
    await expect(page.getByTestId(`${T}.setUp`)).toHaveAttribute('data-year', '26/27');
    await expect(page.getByTestId(`${T}.submit`)).toHaveCount(0);
  });

  await test.step('the tax year set up part-way through it, with what came in so far: written to the account', async () => {
    await type(page, 'ty.toDate', '12000');
    await type(page, 'ty.taxToDate', '900');
    await page.getByTestId(`${T}.setUp.submit`).click();
    await expect(page.getByTestId(`${T}.toast`)).toHaveAttribute('data-kind', 'saved');
    await expect.poll(async () => { const [p] = await plansOf(uid); return p.decisionTool.taxYears['26/27'] && p.decisionTool.taxYears['26/27'].yearSetupComplete; }, { timeout: 15_000 }).toBe(true);
    await expect(page.getByTestId(`${T}.setUp`)).toHaveCount(0);
  });

  await test.step('this month recorded, the five months since April filled in with one press', async () => {
    await type(page, 'mo.total', '590000');
    await type(page, 'mo.cash', '48000');
    await type(page, 'mo.bonds', '150000');
    await expect(page.getByTestId(`${T}.gap`)).toHaveAttribute('data-count', '5');
    await expect(page.getByTestId(`${T}.gap`)).toContainText('April 2026 to August 2026');
    await page.getByTestId(`${T}.gap.fill`).click();
    await expect(page.getByTestId(`${T}.submit`)).toHaveText('Record September 2026 and fill in 5 months');
    await page.getByTestId(`${T}.submit`).click();
    await expect(page.getByTestId(`${T}.toast`)).toContainText('with 5 months filled in');
  });

  const months = ['2026-04', '2026-05', '2026-06', '2026-07', '2026-08', '2026-09'];
  const shownAsRecorded = async () => {
    await expect(page.getByTestId(`${T}.gap`)).toHaveCount(0);
    // nothing due (7.3.0): the tool says so, and the form comes when asked for ("Record a different month")
    await expect(page.getByTestId(`${T}.idle`)).toContainText('September is recorded. October opens on 1 October');
    await page.getByTestId(`${T}.other`).click();
    const offered = await page.getByTestId(`${T}.mo.month`).locator('option').evaluateAll((os) => os.map((o) => o.value));
    for (const m of months) expect(offered).not.toContain(m);
    await expect(page.getByTestId(`${T}.recent`).locator('li')).toHaveCount(3);
    await expect(page.getByTestId(`${T}.recent`).locator('[data-filled="1"]')).toHaveCount(2);
    await expect(page.getByTestId(`${T}.recent`)).toContainText('September 2026');
  };

  await test.step('every month shows as recorded, and the account holds them, the filled-in ones marked', async () => {
    await shownAsRecorded();
    const [p] = await plansOf(uid);
    expect(p.decisionTool.history.map((h) => h.date)).toEqual(months);
    expect(p.decisionTool.history.filter((h) => h.filledIn === true).map((h) => h.date)).toEqual(months.slice(0, 5));
  });

  await test.step('reloaded: everything still there, read back from the account; the plan\'s settings unchanged', async () => {
    await page.reload();
    await expect(page.getByTestId('plan.step.month')).toHaveText('Month by month', { timeout: 30_000 });
    await shownAsRecorded();
    await expect(page.getByTestId(`${T}.prefilled`)).toContainText('September 2026');   // the form asked for: October, from September's figures
    const [p] = await plansOf(uid);
    expect(same(p.decisionTool.settings, planned.decisionTool.settings), 'the Decision settings').toBe(true);
    expect(same(p.stressTool, planned.stressTool), 'the plan\'s settings').toBe(true);
    expect(same(p.strategy, planned.strategy), 'the way of drawing').toBe(true);
    expect(same(p.planDocument, planned.planDocument), 'the plan document').toBe(true);
  });
});

test('an unlocked drawing plan: asked to lock first, locked, then a month recorded', async ({ page }) => {
  test.setTimeout(240_000);
  const uid = await alexWith(page, draftPlan(), 'month');

  await test.step('Month by month says to lock first, with the way there, and nothing to type', async () => {
    await openAt(page, '');
    await expect(screen(page)).toHaveAttribute('data-screen', 'plan.month', { timeout: 30_000 });
    await expect(page.getByTestId(`${T}.needsLock`)).toBeVisible();
    await expect(page.locator('#app form')).toHaveCount(0);
  });

  await test.step('locked from "Lock the plan"', async () => {
    await page.getByTestId(`${T}.lock`).click();
    await expect(screen(page)).toHaveAttribute('data-screen', 'plan.lock');
    await page.getByTestId('plan.lock.lock').click();
    await page.getByTestId('plan.lock.confirm').click();
    await expect(page.getByTestId('plan.plan.toast')).toBeVisible({ timeout: 90_000 });
    await expect.poll(async () => { const [p] = await plansOf(uid); return !!(p.decisionTool.settings && p.decisionTool.settings.locked); }, { timeout: 15_000 }).toBe(true);
  });

  const [lockedNow] = await plansOf(uid);
  await test.step('back on Month by month: the tax year set up, then September recorded', async () => {
    await openAt(page, `#/plan/${DRAFT}/month`);
    await expect(page.getByTestId(`${T}.needsLock`)).toHaveCount(0);
    await expect(page.getByTestId(`${T}.setUp`)).toHaveAttribute('data-year', '26/27', { timeout: 30_000 });
    await page.getByTestId(`${T}.setUp.submit`).click();
    await expect(page.getByTestId(`${T}.toast`)).toHaveAttribute('data-kind', 'saved');
    await expect(page.getByTestId(`${T}.setUp`)).toHaveCount(0);
    await type(page, 'mo.total', '420000');
    await type(page, 'mo.cash', '30000');
    await type(page, 'mo.bonds', '120000');
    await expect(page.getByTestId(`${T}.submit`)).toHaveText('Record September 2026');
    await page.getByTestId(`${T}.submit`).click();
    await expect(page.getByTestId(`${T}.toast`)).toContainText('September 2026 recorded.');
  });

  await test.step('reloaded: the month is there, read back from the account; the locked settings unchanged by it', async () => {
    await page.reload();
    await expect(page.getByTestId(`${T}.recent`)).toContainText('September 2026', { timeout: 30_000 });
    const [p] = await plansOf(uid);
    expect(p.decisionTool.history.map((h) => h.date)).toEqual(['2026-09']);
    expect(same(p.decisionTool.settings, lockedNow.decisionTool.settings)).toBe(true);
    expect(same(p.stressTool, lockedNow.stressTool)).toBe(true);
  });
});
