/**
 * Move to a new plan (6.56.0; research/plan-start.md §2 I, §7), without an account. The PUBLISHED build: the planner and the
 * preview on one site, so this window's plans (sessionStorage pt_guest_scenarios) are seen by both. The clock: 4 November
 * 2026 (tax year 2026/27).
 *
 * The plan is the corpus's fixture 13 (Alex, fictional): an index-linked gilt ladder whose year 0 is 2024/25, locked, with
 * months recorded to September 2026 and a record of what is held.
 *  - The planner: Stress tester → Settings offers "Move to a new plan…" beside the lock; the question says what happens and
 *    asks the month (November 2026 suggested) and the name; confirmed, the new plan is made from the plan's figures and opened —
 *    a draft whose year 0 is 2026/27, saying what came before it — and the old plan is closed at the end of October 2026.
 *    Opened again, the old plan is closed: the banner names the plan that carries it on, its Settings say so with no unlock,
 *    and Month by month refuses November 2026 with the reason.
 *    Its Month by month Settings, plan document, tax years and What you hold are read, not changed (no unlock, no new
 *    version, no tax year after the close, no tick-offs).
 *  - The preview (desktop-1440 and phone-390): the same close from "Your plans" — the row's box, the month, the pots (always
 *    asked, filled in) and the name, one press; the closed plan under "Previous plans", the new one the main plan, the closed
 *    plan's page saying so with the way to the new one, its What you hold read-only; the new plan's page saying what came
 *    before it.
 *
 * Firebase is never reached: every request outside the site is stopped (`outside: 'block'`).
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test, expect, PROD, REPO, V7_PATH, CLASSIC_PATH, WORKER_DATA_MISSING } from './helpers/app.js';
import { OPEN_PLACE_KEY, makeRequest } from '../src/services/OpenPlace.js';

test.use({ outside: 'block' });

const GUEST_KEY = 'pt_guest_scenarios';
const PLAN_ID = 'ClosePlan13';
const NOW = '2026-11-04T08:00:00.000Z';
const read = (name) => JSON.parse(readFileSync(join(REPO, 'tests', 'fixtures', 'plans', name + '.json'), 'utf8'));

/** Fixture 13, locked, months recorded to September 2026, what is held on record. */
function lockedPlan() {
  const p = read('13-stopped-drawing-since');
  p.id = PLAN_ID;
  p.planDetails.name = 'Alex’s linkers';
  p.isActive = true;
  return p;
}
const storedPlans = (page) => page.evaluate((k) => JSON.parse(sessionStorage.getItem(k)), GUEST_KEY);

async function seed(page) {
  await page.clock.setFixedTime(new Date(NOW));
  await page.goto(PROD + V7_PATH + '#/');
  await expect(page.locator('#app [data-screen]')).toBeVisible();
  await page.evaluate(([k, text]) => sessionStorage.setItem(k, text), [GUEST_KEY, JSON.stringify([lockedPlan()])]);
}

async function openStressSettings(page) {
  await page.evaluate(() => switchToTab('stress'));
  await page.evaluate(() => document.querySelector('.sub-tab[data-stresstab="stresssettings"]').click());
}

test.describe('Move to a new plan, without an account', () => {
  test('the planner: closed at the end of October 2026 and carried on in a new plan from November; the old one read-only, a later month refused', async ({ page, watch }) => {
    test.setTimeout(360_000);
    watch.allow(WORKER_DATA_MISSING);
    await seed(page);
    // into the planner on this window's plan, by the preview's hand-over (its Timing block, in Stress tester → Settings)
    const request = makeRequest({ planId: PLAN_ID, place: 'about', back: '#/plans', at: NOW });
    await page.evaluate(([rk, req]) => sessionStorage.setItem(rk, req), [OPEN_PLACE_KEY, request]);
    await page.goto(PROD + CLASSIC_PATH);
    await expect(page.locator('#mainApp')).toBeVisible({ timeout: 45_000 });
    await expect(page.locator('#ssTimingBlock')).toBeVisible({ timeout: 45_000 });
    const line = page.locator('#ssPlanClose');
    await expect(line).toContainText('Moving to another plan?', { timeout: 45_000 });
    const btn = line.getByRole('button', { name: 'Move to a new plan…' });
    await expect(btn).toBeEnabled();   // the lock freezes the form, not this line
    await btn.click();
    const q = page.locator('div', { has: page.locator('h3', { hasText: 'Move to a new plan' }) }).last();
    await expect(q).toBeVisible();
    await expect(page.locator('#pcMonth')).toHaveValue('2026-11');
    await expect(q).toContainText('‘Alex’s linkers’ closes at the end of October 2026 and is kept as it is');
    await expect(q).toContainText('The new plan’s first tax year is 2026/27; it takes the months from November 2026.');
    await expect(q).toContainText('Put in what you hold today. The boxes are filled in from your record for September 2026 for the pension');
    await expect(page.locator('#pcPension')).toHaveValue('429700');   // the last month recorded is newer than what is held on record
    await page.locator('#pcName').fill('Alex from November');
    await page.getByRole('button', { name: 'Close this plan and make the new one', exact: true }).click();

    // the new plan, opened: a draft from 2026/27 that says what came before it
    await expect(page.locator('#mainApp')).toBeVisible({ timeout: 60_000 });
    await expect(page.locator('#scenarioActiveName')).toHaveText('Alex from November', { timeout: 45_000 });
    let plans = await storedPlans(page);
    const old = plans.find((p) => p.id === PLAN_ID), made = plans.find((p) => p.id !== PLAN_ID);
    expect(old).toMatchObject({ closedAt: '2026-10', nextPlanId: made.id });
    expect(old.decisionTool.settings.locked).toBe(true);
    expect(made).toMatchObject({ previousPlanId: PLAN_ID, before: { kind: 'plan', planId: PLAN_ID, from: '2026-11' }, isActive: true });
    expect(made.stressTool.settings.firstTaxYear).toBe(2026);
    expect(made.decisionTool.settings.locked).toBe(false);
    expect(made.decisionTool.history).toEqual([]);
    await openStressSettings(page);
    await expect(page.locator('#ssPlanClose')).toContainText('Under your previous plan ‘Alex’s linkers’ until October 2026 — its months are there.', { timeout: 45_000 });
    await expect(page.locator('#tmSummary')).toContainText('2026/27');
    await expect(page.locator('#ssLockBanner')).toBeHidden();

    // the old plan, opened from the new one: closed, read-only, saying so
    await page.locator('#ssPlanClose').getByRole('button', { name: 'Open ‘Alex’s linkers’' }).click();
    await expect(page.locator('#scenarioActiveName')).toHaveText('Alex’s linkers', { timeout: 60_000 });
    await expect(page.locator('#nextStepBanner')).toContainText('This plan is closed: it ran to the end of October 2026 and carries on in ‘Alex from November’.', { timeout: 45_000 });
    await expect(page.locator('#nextStepBtn')).toHaveText('Open ‘Alex from November’');
    await openStressSettings(page);
    const banner = page.locator('#ssLockBanner');
    await expect(banner).toContainText('Closed October 2026; carried on as ‘Alex from November’.', { timeout: 45_000 });
    await expect(banner.getByRole('button', { name: 'Unlock to edit…' })).toHaveCount(0);
    await expect(page.locator('#ssPlanClose')).toBeHidden();   // the banner says it; the move is not offered again
    await expect(page.locator('#tmLockedStart')).toBeHidden();   // no move of its start, no stop month asked
    await expect(page.locator('#tmSummary')).toContainText('This plan closed at the end of October 2026, in plan year 2.');

    // Month by month's own Settings: no unlock either; the plan document: the closed line, no new version
    await page.evaluate(() => switchToTab('decision'));
    await page.evaluate(() => document.querySelector('.sub-tab[data-decisiontab="decisionsettings"]').click());
    const dsBanner = page.locator('#dsLockBanner');
    await expect(dsBanner).toContainText('Closed October 2026; carried on as ‘Alex from November’.', { timeout: 45_000 });
    await expect(dsBanner.getByRole('button', { name: 'Unlock to edit…' })).toHaveCount(0);
    await page.evaluate(() => document.querySelector('.sub-tab[data-decisiontab="plandoc"]').click());
    await expect(page.locator('[data-testid="planNotice"]').first()).toContainText('Closed October 2026; carried on as ‘Alex from November’.', { timeout: 45_000 });
    await expect(page.locator('#pdNewVersionBtn')).toBeHidden();
    // Tax years after the close are not offered, nor "+ Add Year"
    await page.evaluate(() => document.querySelector('.sub-tab[data-decisiontab="taxyears"]')?.click());
    await expect(page.locator('.tax-year-add-btn')).toBeHidden({ timeout: 45_000 });
    await expect(page.locator('#taxYearTabs')).not.toContainText('27/28');
    // What you hold: to read, with the way to the new plan; no moves to tick off
    await page.evaluate(() => switchToTab('transition'));
    await expect(page.locator('[data-testid="transition.closed"]')).toContainText('What you hold moved to ‘Alex from November’ when this plan closed: change it there.', { timeout: 45_000 });
    await expect(page.locator('#transitionPage input[type="checkbox"]')).toHaveCount(0);

    // Month by month: November 2026 is the new plan's
    await page.evaluate(() => switchToTab('decision'));
    await page.evaluate(() => document.querySelector('.sub-tab[data-decisiontab="entry"]').click());
    await expect(page.locator('#decision-entry')).toBeVisible({ timeout: 45_000 });
    await page.locator('#entryMonth').fill('2026-11');
    await page.locator('#entryPlatTotal').fill('600000');
    await page.locator('#entryPlatCash').fill('60000');
    await page.locator('#entryIsa').fill('17000');
    await page.locator('#decisionForm button[type="submit"]').click();
    await expect(page.locator('body')).toContainText('This plan is closed: its last month is October 2026. Record November 2026 and later on the plan that carries it on.', { timeout: 45_000 });
    plans = await storedPlans(page);
    expect(plans.find((p) => p.id === PLAN_ID).decisionTool.history.map((h) => String(h.date).slice(0, 7))).not.toContain('2026-11');

    const widths = await page.evaluate(() => ({ doc: document.documentElement.scrollWidth, win: window.innerWidth }));
    expect(widths.doc, 'no sideways scroll').toBeLessThanOrEqual(widths.win + 1);
  });

  test('the preview: the same close from "Your plans"; the closed plan under "Previous plans", each page pointing to the other', async ({ page, watch }) => {
    test.setTimeout(240_000);
    watch.allow(WORKER_DATA_MISSING);
    await seed(page);
    await page.goto(PROD + V7_PATH + '#/plans');
    await expect(page.locator('#app [data-screen]')).toHaveAttribute('data-screen', 'plans', { timeout: 45_000 });
    await page.getByTestId('plans.close.' + PLAN_ID).click();
    const box = page.getByTestId('plans.closeBox.' + PLAN_ID);
    await expect(box).toBeVisible();
    await expect(box).toContainText('‘Alex’s linkers’ closes at the end of the month before');
    await expect(page.getByTestId('plans.close.month')).toHaveValue('2026-11');
    await expect(page.getByTestId('plans.close.pension')).toHaveValue('429700');   // always asked, filled in from the newest figure
    await page.getByTestId('plans.close.name').fill('Alex from November');
    await page.getByTestId('plans.close.yes').click();
    await expect(page.getByTestId('plans.toast')).toContainText('‘Alex’s linkers’ is closed. ‘Alex from November’ carries on from November 2026.', { timeout: 45_000 });
    const previous = page.getByTestId('plans.group.previous');
    await expect(previous).toContainText('Previous plans', { timeout: 45_000 });
    await expect(previous).toContainText('Closed October 2026; carried on as ‘Alex from November’.');
    await expect(page.getByTestId('plans.close.' + PLAN_ID)).toHaveCount(0);
    const plans = await storedPlans(page);
    const made = plans.find((p) => p.id !== PLAN_ID);
    expect(plans.find((p) => p.id === PLAN_ID)).toMatchObject({ closedAt: '2026-10', nextPlanId: made.id, isActive: false });
    expect(made.isActive).toBe(true);   // the main plan moved with the close, as the planner's close does
    expect(made.stressTool.settings.firstTaxYear).toBe(2026);
    expect(made.before).toEqual({ kind: 'plan', planId: PLAN_ID, from: '2026-11' });

    // the closed plan's page: closed, its months there, the way to the new one; no unlock
    await page.goto(PROD + V7_PATH + '#/plan/' + PLAN_ID);
    await expect(page.getByTestId('plan.stageLine')).toContainText('Closed October 2026; carried on as ‘Alex from November’.', { timeout: 45_000 });
    await expect(page.getByTestId('plan.closed')).toContainText('nothing of it changes again');
    await expect(page.getByTestId('plan.plan.unlock')).toHaveCount(0);
    // what you hold, opened by its address: read here, changed on the new plan
    await page.goto(PROD + V7_PATH + '#/plan/' + PLAN_ID + '/hold');
    await expect(page.getByTestId('plan.hold.closed')).toContainText('make changes on ‘Alex from November’', { timeout: 45_000 });
    await expect(page.locator('[data-region="plan-hold"]')).toHaveAttribute('data-editable', '0');
    await page.goto(PROD + V7_PATH + '#/plan/' + PLAN_ID);
    await page.getByTestId('plan.closed.open').click();
    // the new plan's page: what came before it, with the way back
    await expect(page.getByTestId('plan.before')).toContainText('Under your previous plan ‘Alex’s linkers’ until October 2026 — its months are there.', { timeout: 45_000 });
    await expect(page.getByTestId('plan.before.open')).toBeVisible();

    const widths = await page.evaluate(() => ({ doc: document.documentElement.scrollWidth, win: window.innerWidth }));
    expect(widths.doc, 'no sideways scroll').toBeLessThanOrEqual(widths.win + 1);
  });
});
