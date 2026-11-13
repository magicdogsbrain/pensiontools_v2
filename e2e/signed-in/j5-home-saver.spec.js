/**
 * J5 (7.3.0; research/v7/one-product-design.md "The route", 7.3.0): coming back to a plan locked while saving, signed in.
 * A person with the corpus's locked saving plan (fictional: Sam), in mid-October with September's pot recorded, opens the
 * site and lands on the plan's HOME — not on the check-in form, though that is where they were last. This month's pot is
 * the one thing due, first; the steps are listed plainly (no "For later", no "Not done yet" on a locked plan). The check-in
 * done, the home says nothing is due and when the next check-in is. Reloaded, it reads the same, from the account; the
 * plan's settings and document are byte-identical. At desktop-1440 and phone-390, against the local emulators.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test, expect, REPO } from '../helpers/app.js';
import { clearEmulators, makeAccount, putPlan, putSettings, plansOf, SAM } from './emulator.js';
import { openAt, signIn, planAddress } from './journeys.js';
import { VERSION } from '../../src/constants.js';

const ID = 'SamSaver05';
const H = 'plan.home';
const CI = 'plan.checkin';
const MID_OCTOBER = '2026-10-15T09:00:00.000Z';
const sortKeys = (v) => (Array.isArray(v) ? v.map(sortKeys) : v && typeof v === 'object' ? Object.keys(v).sort().reduce((o, k) => { if (v[k] !== undefined) o[k] = sortKeys(v[k]); return o; }, {}) : v);
const same = (a, b) => JSON.stringify(sortKeys(a)) === JSON.stringify(sortKeys(b));

/** The corpus's plan locked while saving: stops work in February 2038, the pot recorded each month to September 2026. */
function saverPlan() {
  const p = JSON.parse(readFileSync(join(REPO, 'tests', 'fixtures', 'plans', '05-saver-committed.json'), 'utf8'));
  delete p.household;
  return { ...p, id: ID, planDetails: { ...p.planDetails, name: 'Sam’s plan' }, isActive: true };
}

test.beforeEach(async () => { await clearEmulators(); });

test('a locked saver: lands on the home, not the check-in form; the pot due first; no "For later" marks; checked in, a dated nothing-due; reload reads the same', async ({ page }) => {
  test.setTimeout(300_000);
  const planned = saverPlan();
  const { uid } = await makeAccount(SAM);
  await putPlan(uid, planned);
  await putSettings(uid, { lastSeenVersion: VERSION, lastLocation: { planId: ID, step: 'checkin' } });
  await page.clock.setFixedTime(new Date(MID_OCTOBER));
  await openAt(page, '#/account');
  await signIn(page, SAM);
  await expect(page.getByTestId(H)).toBeVisible({ timeout: 30_000 });

  await test.step('the site\'s root lands on the home, not the form: this month\'s pot first', async () => {
    await openAt(page, '');
    await expect(page.getByTestId(H)).toBeVisible({ timeout: 30_000 });
    expect(planAddress(page)).toEqual({ planId: ID, step: null });
    await expect(page.locator('#app form')).toHaveCount(0);
    await expect(page.getByTestId(`${H}.headline`)).toHaveText('Saving. You stop work in February 2038.');
    const first = page.getByTestId(`${H}.todo`).locator('.home-item').first();
    await expect(first).toHaveAttribute('data-todo', 'checkin.due');
    await expect(page.getByTestId(`${H}.todo.checkin.due`)).toHaveText('Record this month’s pot');
  });

  await test.step('the steps listed plainly: no "For later", no "Not done yet" on a locked plan', async () => {
    await page.getByTestId(`${H}.steps`).locator('summary').click();
    await expect(page.getByTestId(`${H}.steps`)).toBeVisible();
    await expect(page.getByTestId(`${H}.later`)).toHaveCount(0);
    await expect(page.getByTestId(H)).not.toContainText('For later');
    await expect(page.getByTestId(H)).not.toContainText('Not done yet');
  });

  await test.step('the check-in: the form, there because it is due; the pot recorded', async () => {
    await page.getByTestId(`${H}.todo.checkin.due`).click();
    await expect(page.locator('#app [data-screen]')).toHaveAttribute('data-screen', 'plan.checkin');
    await expect(page.getByTestId(`${CI}.ci.pension`)).toBeVisible({ timeout: 30_000 });
    // a pot well ahead of the plan's path, so the check-in reads on course and nothing more is due
    await page.getByTestId(`${CI}.ci.pension`).fill('520,000');
    await page.getByTestId(`${CI}.ci.isa`).fill('80,000');
    await page.getByTestId(`${CI}.submit`).click();
    await expect(page.getByTestId(`${CI}.toast`)).toContainText('Checked in for October 2026.', { timeout: 200_000 });
    await expect.poll(async () => { const [p] = await plansOf(uid); return (p.accumulationTool.checkIns || []).length; }, { timeout: 15_000 }).toBe(1);
    // 7.8.0: the reading kept now names its level and keeps both figures — the weighted chance and the count to its age
    const [withReading] = await plansOf(uid);
    const reading = withReading.accumulationTool.checkIns[0].reading;
    expect(reading.level).toBe('balanced');
    expect(typeof reading.weighted).toBe('number');
    expect(typeof reading.fixedAge).toBe('number');
    expect(reading.weighted + 1e-12).toBeGreaterThanOrEqual(0);
    // nothing due now: the last result and the next date, the form only when asked for
    await expect(page.getByTestId(`${CI}.anyway`)).toBeVisible();
    await expect(page.getByTestId(`${CI}.submit`)).toHaveCount(0);
  });

  const quiet = 'Nothing due. Your next check-in is November 2026.';
  await test.step('the home: nothing due, with the date of the next check-in', async () => {
    await openAt(page, `#/plan/${ID}`);
    await expect(page.getByTestId(`${H}.quiet`)).toHaveText(quiet, { timeout: 30_000 });
    await expect(page.getByTestId(`${H}.todo`).locator('.home-item')).toHaveCount(0);
  });

  await test.step('reloaded: the same, read back from the account; the plan\'s settings and document byte-identical', async () => {
    await page.reload();
    await expect(page.getByTestId(`${H}.quiet`)).toHaveText(quiet, { timeout: 30_000 });
    const [p] = await plansOf(uid);
    expect(p.decisionTool.settings.locked).toBe(true);
    expect(same(p.decisionTool, planned.decisionTool), 'the Decision side').toBe(true);
    expect(same(p.stressTool, planned.stressTool), 'the plan\'s settings').toBe(true);
    expect(same(p.planDocument, planned.planDocument), 'the plan document').toBe(true);
  });
});

/**
 * 7.8.0 (the build spec's section 10, signed in, j5): a reading kept before 7.8.0 stays as it was. The same locked saver,
 * checked in in October before the flip — its reading frozen in the old shape, a count with no level (written here the way
 * the check-in wrote it then: checkInPatch with weighted false) — opens on the check-in in mid-October: the kept result
 * says its count in its own words, nothing of it is weighted after the event, and opening it writes nothing.
 */
test('a locked saver with a reading kept before 7.8.0: the check-in shows it in its own words, never weighted; nothing written', async ({ page }) => {
  test.setTimeout(240_000);
  const { checkInPatch } = await import('../../src/answers/plan/checkIn.js');
  const { applyPatch } = await import('../../src/answers/plan/about.js');
  const base = saverPlan();
  const old = checkInPatch(base, { 'ci.pension': '520,000', 'ci.isa': '80,000' }, {
    today: '2026-10-05', now: new Date('2026-10-05T10:00:00.000Z'), weighted: false,
    result: { status: 'ok', verdict: { band: 'yes' }, chance: { fails: 40 }, spend: { perMonth: 1810 }, income: { bad: 1900, middling: 2300 }, gap: { year: 0 }, enough: null, basis: { engineVersion: '7.6.0' } }
  });
  expect(old.ok, JSON.stringify(old.errors)).toBe(true);
  const planned = applyPatch(base, { ...old.patch, lastModified: '2026-10-05T10:00:00.000Z' });
  const reading = planned.accumulationTool.checkIns[planned.accumulationTool.checkIns.length - 1].reading;
  expect('level' in reading).toBe(false);
  expect(reading.fails).toBe(40);
  const { uid } = await makeAccount(SAM);
  await putPlan(uid, planned);
  await putSettings(uid, { lastSeenVersion: VERSION });
  await page.clock.setFixedTime(new Date(MID_OCTOBER));
  await openAt(page, '#/account');
  await signIn(page, SAM);
  const before = await plansOf(uid);
  await openAt(page, `#/plan/${ID}/checkin`);
  await expect(page.locator('#app [data-screen]')).toHaveAttribute('data-screen', 'plan.checkin', { timeout: 60_000 });
  const kept = page.getByTestId(`${CI}.result.kept`);
  await expect(kept).toBeVisible({ timeout: 60_000 });
  await expect(kept).not.toHaveAttribute('data-level', /./);
  await expect(kept).toContainText('in more than 9 futures out of 10');
  await expect(kept.locator('[data-weighted]')).toHaveCount(0);
  expect(await page.locator('#app').innerText()).not.toMatch(/undefined|NaN/);
  expect(same(await plansOf(uid), before), 'opening the check-in writes nothing').toBe(true);
});
