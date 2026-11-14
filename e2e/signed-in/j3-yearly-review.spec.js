/**
 * J3 (7.10.0; spec-7100 §9 "Signed in"; research/v7/replan-nov-2026.md §6.3, §6.4): the yearly review, signed in. A person
 * with a locked plan they live on in the account (the corpus's Buckets plan, fictional: Alex), locked more than six months
 * before 6 April and recording its months to September 2026, opens the site on 6 April 2027:
 *   1. the home shows ONE thing due — the new tax year's set-up — and "and 2 more" (the months missed, and the review);
 *   2. the review: the pots and what was taken entered, "Keep to the plan", the chance worked out from today, saved;
 *   3. ONE write, of `phases` (and the stamp) only: the settings, the plan document, the months and what is held
 *      byte-identical;
 *   4. after a reload: no review due, and "Your next review: April 2028.";
 *   5. "No, I do not keep a monthly record" on Month by month is ONE write of `decisionTool.recordMonths`, and the month
 *      to-dos go: nothing due, with the date of the next review.
 * Against the local emulators, at desktop-1440 and phone-390.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test, expect, REPO } from '../helpers/app.js';
import { clearEmulators, makeAccount, putPlan, putSettings, plansOf, ALEX } from './emulator.js';
import { openAt, signIn, planAddress } from './journeys.js';
import { VERSION } from '../../src/constants.js';

const ID = 'AlexReview04';
const H = 'plan.home';
const R = 'plan.review';
/** 6 April 2027: a new tax year, the plan locked in March 2026 (more than six months before), nothing logged in 2027/28. */
const APRIL_6 = '2027-04-06T09:00:00.000Z';
const sortKeys = (v) => (Array.isArray(v) ? v.map(sortKeys) : v && typeof v === 'object' ? Object.keys(v).sort().reduce((o, k) => { if (v[k] !== undefined) o[k] = sortKeys(v[k]); return o; }, {}) : v);
const same = (a, b) => JSON.stringify(sortKeys(a)) === JSON.stringify(sortKeys(b));
const changed = (a, b) => [...new Set([...Object.keys(a), ...Object.keys(b)])].filter((k) => !same(a[k], b[k])).sort();

/** The corpus's locked Buckets plan: records April to September 2026, 2026/27 set up, locked 20 March 2026. */
function drawingPlan() {
  const p = JSON.parse(readFileSync(join(REPO, 'tests', 'fixtures', 'plans', '04-buckets-running.json'), 'utf8'));
  delete p.household;
  return { ...p, id: ID, planDetails: { ...p.planDetails, name: 'Alex’s plan' }, isActive: true };
}

test.beforeEach(async () => { await clearEmulators(); });

test('the yearly review: one thing due and "and 2 more"; the review saved as one write of the phases; after a reload, the next review April 2028; no monthly record, the month to-dos gone', async ({ page }) => {
  test.setTimeout(300_000);
  const planned = drawingPlan();
  const { uid } = await makeAccount(ALEX);
  await putPlan(uid, planned);
  await putSettings(uid, { lastSeenVersion: VERSION, lastLocation: { planId: ID, step: null } });
  await page.clock.setFixedTime(new Date(APRIL_6));

  await test.step('signed in on 6 April: the home, one thing due — the tax year — and "and 2 more"', async () => {
    await openAt(page, '#/account');
    await signIn(page, ALEX);
    await expect(page.getByTestId(H)).toBeVisible({ timeout: 30_000 });
    expect(planAddress(page)).toEqual({ planId: ID, step: null });
    await expect(page.getByTestId(`${H}.headline`)).toHaveText('Living on it.');
    const items = page.getByTestId(`${H}.todo`).locator(':scope > .home-items > .home-item');
    await expect(items).toHaveCount(1);
    await expect(items.first()).toHaveAttribute('data-todo', 'month.taxYear');
    const more = page.getByTestId(`${H}.more`);
    await expect(more.locator('summary')).toHaveText('and 2 more');
    await more.locator('summary').click();
    expect(await more.locator('.home-item').evaluateAll((els) => els.map((e) => e.getAttribute('data-todo')))).toEqual(['month.gap', 'review.due']);
    await expect(more.locator('[data-todo="review.due"]')).toContainText('Your review');
    await expect(more.locator('[data-todo="review.due"]')).toContainText('Due once a tax year. A few figures, a few minutes. Nothing about your plan changes unless you say so.');
    expect(changed(planned, (await plansOf(uid))[0]), 'opening the home writes nothing').toEqual([]);
  });

  await test.step('the review: the pots and what was taken entered, "Keep to the plan", the chance from today, saved', async () => {
    await page.getByTestId(`${H}.todo.review.due`).click();
    await expect(page.getByTestId('plan.step.review')).toHaveAttribute('data-phase', 'drawing', { timeout: 30_000 });
    await expect(page.getByTestId(`${R}.dueNow`)).toBeVisible();
    await expect(page.getByTestId(`${R}.living.from`)).toContainText('September 2026');
    await page.getByTestId(`${R}.rv.pension`).fill('560000');
    await page.getByTestId(`${R}.rv.isa`).fill('40000');
    await page.getByTestId(`${R}.rv.took`).fill('0');
    await page.getByTestId(`${R}.rv.choice.keep`).check();
    await page.getByTestId(`${R}.run.button`).click();
    await expect(page.getByTestId(`${R}.run`)).toHaveAttribute('data-status', 'done', { timeout: 120_000 });
    await expect(page.getByTestId(`${R}.run.line`)).toContainText('From today, on the pots you entered');
    expect(changed(planned, (await plansOf(uid))[0]), 'typing and working it out write nothing').toEqual([]);
    await page.getByTestId(`${R}.save`).click();
    await expect(page.getByTestId(`${R}.toast`)).toContainText('Saved. Your next review is April 2028.', { timeout: 30_000 });
  });

  await test.step('ONE write, of the phases and the stamp: the settings, the document, the months and what is held byte-identical', async () => {
    await expect.poll(async () => { const [p] = await plansOf(uid); return p.phases ? p.phases.review.log.length : 0; }, { timeout: 15_000 }).toBe(1);
    const [p] = await plansOf(uid);
    expect(changed(planned, p)).toEqual(['lastModified', 'phases']);
    expect(Object.keys(p.phases).sort()).toEqual(['of', 'review']);
    const [entry] = p.phases.review.log;
    expect(entry).toMatchObject({ phase: 'drawing', choice: 'keep', took: 0, pots: { pension: 560000, isa: 40000, other: 0 }, entered: { pots: true } });
    expect(entry.reading).toMatchObject({ source: 'run' });
    expect(same(p.stressTool, planned.stressTool), 'the settings').toBe(true);
    expect(same(p.planDocument, planned.planDocument), 'the plan document').toBe(true);
    expect(same(p.decisionTool, planned.decisionTool), 'the months and the lock').toBe(true);
    expect(same(p.holdings, planned.holdings), 'what is held').toBe(true);
  });

  await test.step('after a reload: no review due, "Your next review: April 2028."', async () => {
    await openAt(page, `#/plan/${ID}`);
    await page.reload();
    await expect(page.getByTestId(H)).toBeVisible({ timeout: 30_000 });
    await expect(page.getByTestId(`${H}.review`)).toContainText('Your next review: April 2028.');
    await expect(page.locator('[data-todo="review.due"]')).toHaveCount(0);
    await expect(page.getByTestId(`${H}.todo`).locator(':scope > .home-items > .home-item').first()).toHaveAttribute('data-todo', 'month.taxYear');
  });

  await test.step('"No, I do not keep a monthly record": ONE write of that field; the month to-dos go, nothing due', async () => {
    const [before] = await plansOf(uid);
    await openAt(page, `#/plan/${ID}/month`);
    await expect(page.getByTestId('plan.month.recordMonths')).toHaveAttribute('data-wanted', '1', { timeout: 30_000 });
    await page.getByTestId('plan.month.recordMonths.no').click();
    await expect(page.getByTestId('plan.month.recordMonths')).toHaveAttribute('data-wanted', '0', { timeout: 30_000 });
    await expect.poll(async () => { const [p] = await plansOf(uid); return p.decisionTool.recordMonths; }, { timeout: 15_000 }).toBe(false);
    const [p] = await plansOf(uid);
    // (the clock is fixed, so the stamp is written with the same moment as the review's)
    expect(changed(before, p)).toEqual(['decisionTool']);
    expect(p.lastModified).toBe(APRIL_6);
    const { recordMonths, ...dt } = p.decisionTool;
    expect(same(dt, before.decisionTool), 'only the one field in the Decision side').toBe(true);
    await openAt(page, `#/plan/${ID}`);
    await expect(page.getByTestId(`${H}.quiet`)).toHaveText('Nothing due. Your next review is April 2028.', { timeout: 30_000 });
    await expect(page.getByTestId(`${H}.todo`).locator('.home-item')).toHaveCount(0);
  });
});
