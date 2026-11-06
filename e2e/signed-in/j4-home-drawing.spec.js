/**
 * J4 (7.3.0; research/v7/one-product-design.md "The route", 7.3.0): coming back to a plan being drawn on, signed in. A
 * person with a locked drawing plan in the account (the corpus's Buckets plan, fictional: Alex), in mid-October with
 * September recorded and the tax year set up, opens the site and lands on the plan's HOME — not on a form, whatever step
 * they were last on. October is due, first; what they hold is out of date and can wait ("Not now", this window only).
 * "Record October" opens the tool on October; recorded, the tool and the home both say nothing is due until 1 November.
 * Reloaded, the home reads the same, from the account; the plan's settings, its document and what it holds are
 * byte-identical — only the month was written. At desktop-1440 and phone-390, against the local emulators.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test, expect, REPO } from '../helpers/app.js';
import { clearEmulators, makeAccount, putPlan, putSettings, plansOf, ALEX } from './emulator.js';
import { openAt, signIn, planAddress } from './journeys.js';
import { VERSION } from '../../src/constants.js';

const ID = 'AlexDrawing04';
const H = 'plan.home';
const M = 'plan.month';
/** Mid-October 2026: September is the latest month recorded, so October is due (a month is due from its own 1st). */
const MID_OCTOBER = '2026-10-15T09:00:00.000Z';
const sortKeys = (v) => (Array.isArray(v) ? v.map(sortKeys) : v && typeof v === 'object' ? Object.keys(v).sort().reduce((o, k) => { if (v[k] !== undefined) o[k] = sortKeys(v[k]); return o; }, {}) : v);
const same = (a, b) => JSON.stringify(sortKeys(a)) === JSON.stringify(sortKeys(b));

/** The corpus's locked Buckets plan, living on it: records April to September 2026, 2026/27 set up, holdings from March. */
function drawingPlan() {
  const p = JSON.parse(readFileSync(join(REPO, 'tests', 'fixtures', 'plans', '04-buckets-running.json'), 'utf8'));
  delete p.household;
  return { ...p, id: ID, planDetails: { ...p.planDetails, name: 'Alex’s plan' }, isActive: true };
}

test.beforeEach(async () => { await clearEmulators(); });

test('a locked drawing plan: the root lands on its home; "Not now" on what you hold; Record October in the tool; nothing due until 1 November; reload reads the same; settings byte-identical', async ({ page }) => {
  test.setTimeout(180_000);
  const planned = drawingPlan();
  const { uid } = await makeAccount(ALEX);
  await putPlan(uid, planned);
  // the person was last on Month by month: a locked plan lands on its home all the same
  await putSettings(uid, { lastSeenVersion: VERSION, lastLocation: { planId: ID, step: 'month' } });
  await page.clock.setFixedTime(new Date(MID_OCTOBER));

  await test.step('signed in on a new device: taken to the last plan\'s home, not left on "Your account"', async () => {
    await openAt(page, '#/account');
    await signIn(page, ALEX);
    await expect(page.getByTestId(H)).toBeVisible({ timeout: 30_000 });
    expect(planAddress(page)).toEqual({ planId: ID, step: null });
  });

  await test.step('the site\'s root lands on the home: October due first, what you hold after it; no form, no rail', async () => {
    await openAt(page, '');
    await expect(page.getByTestId(H)).toBeVisible({ timeout: 30_000 });
    expect(planAddress(page)).toEqual({ planId: ID, step: null });
    await expect(page.getByTestId(`${H}.headline`)).toHaveText('Drawing.');
    await expect(page.locator('#app form')).toHaveCount(0);
    await expect(page.locator('[data-region="rail"]')).toHaveCount(0);
    const items = page.getByTestId(`${H}.todo`).locator('.home-item');
    await expect(items).toHaveCount(2);
    await expect(items.nth(0)).toHaveAttribute('data-todo', 'month.record');
    await expect(items.nth(1)).toHaveAttribute('data-todo', 'hold.stale');
    await expect(page.getByTestId(`${H}.todo.month.record`)).toHaveText('Record October');
  });

  await test.step('"Not now" on what you hold: it slides away, for this window only', async () => {
    await page.getByTestId(`${H}.notNow.hold.stale`).click();
    await expect(page.getByTestId(`${H}.todo`).locator('.home-item')).toHaveCount(1);
    await expect(page.locator('[data-todo="hold.stale"]')).toHaveCount(0);
    const [p] = await plansOf(uid);
    expect(same(p.holdings, planned.holdings), 'nothing written for "Not now"').toBe(true);
  });

  await test.step('"Record October" opens the tool on October; recorded with the figures carried from September', async () => {
    await page.getByTestId(`${H}.todo.month.record`).click();
    await expect(page.locator('#app [data-screen]')).toHaveAttribute('data-screen', 'plan.month');
    await expect(page.getByTestId(`${M}.submit`)).toHaveText('Record October 2026', { timeout: 30_000 });
    await expect(page.getByTestId(`${M}.prefilled`)).toContainText('September 2026');
    await page.getByTestId(`${M}.submit`).click();
    await expect(page.getByTestId(`${M}.toast`)).toContainText('October 2026 recorded.', { timeout: 30_000 });
    await expect.poll(async () => { const [p] = await plansOf(uid); return p.decisionTool.history.map((h) => h.date).pop(); }, { timeout: 15_000 }).toBe('2026-10');
    // the tool, nothing due: the idle line and the way to record early, no form
    await expect(page.getByTestId(`${M}.idle`)).toContainText('October is recorded. November opens on 1 November (record it early if the payment has gone).');
    await expect(page.getByTestId(`${M}.submit`)).toHaveCount(0);
  });

  const quiet = 'October is recorded. Nothing is due until 1 November.';
  await test.step('the home: nothing due, with the date', async () => {
    await openAt(page, `#/plan/${ID}`);
    await expect(page.getByTestId(`${H}.quiet`)).toHaveText(quiet, { timeout: 30_000 });
    await expect(page.getByTestId(`${H}.todo`).locator('.home-item')).toHaveCount(0);
  });

  await test.step('reloaded: the same, read back from the account; only the month was written', async () => {
    await page.reload();
    await expect(page.getByTestId(`${H}.quiet`)).toHaveText(quiet, { timeout: 30_000 });
    const [p] = await plansOf(uid);
    expect(p.decisionTool.history.map((h) => h.date)).toEqual(['2026-04', '2026-05', '2026-06', '2026-07', '2026-08', '2026-09', '2026-10']);
    expect(same(p.decisionTool.settings, planned.decisionTool.settings), 'the Decision settings').toBe(true);
    expect(same(p.stressTool, planned.stressTool), 'the plan\'s settings').toBe(true);
    expect(same(p.planDocument, planned.planDocument), 'the plan document').toBe(true);
    expect(same(p.holdings, planned.holdings), 'what you hold').toBe(true);
    expect(same(p.transition || null, planned.transition || null), 'the move').toBe(true);
    const changed = Object.keys({ ...p, ...planned }).filter((k) => !same(p[k], planned[k])).sort();
    expect(changed).toEqual(['decisionTool', 'lastModified']);
  });
});
