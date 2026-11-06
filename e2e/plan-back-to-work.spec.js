/**
 * Back to work (research/plan-start.md §2 J, §7), without an account. The PUBLISHED build: the planner and the preview on one
 * site, so this window's plans (sessionStorage pt_guest_scenarios) are seen by both. The clock: 4 November 2026 (2026/27).
 *
 * The plan is the corpus's fixture 13 (Alex, fictional): an index-linked gilt ladder whose year 0 is 2024/25, locked, with
 * months recorded to September 2026 — each with income taken from the pension — and a record of what is held.
 *  - The planner: Stress tester → Settings offers "I'm going back to work…" beside "Move to a new plan…"; the question asks
 *    when work starts again (November 2026), when it is expected to stop again (June 2030) and says the limit the new plan
 *    carries; confirmed, the drawing plan is closed at the end of October 2026 and a saving plan made from its figures opens
 *    on its Accumulation page, which says the £10,000 limit since November 2024. Its Settings say what came before it, and
 *    the closed plan says why it closed.
 *  - The preview: the same close from "Your plans" — the row's "I'm going back to work", the box with the stop, one press;
 *    the closed plan under "Previous plans" saying why; the saving plan on the saver's rail, What you pay in saying the
 *    limit, its page saying what came before it.
 * At desktop-1440 and phone-390. Firebase is never reached: every request outside the site is stopped (`outside: 'block'`).
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test, expect, PROD, REPO, V7_PATH, CLASSIC_PATH, WORKER_DATA_MISSING } from './helpers/app.js';
import { OPEN_PLACE_KEY, makeRequest } from '../src/services/OpenPlace.js';

test.use({ outside: 'block' });

const GUEST_KEY = 'pt_guest_scenarios';
const PLAN_ID = 'WorkPlan13';
const NOW = '2026-11-04T08:00:00.000Z';
const LIMIT = 'Since you took money from your pension flexibly in November 2024, what you and your employer pay into pension pots in a tax year is limited to £10,000 before tax charges apply.';
const read = (name) => JSON.parse(readFileSync(join(REPO, 'tests', 'fixtures', 'plans', name + '.json'), 'utf8'));

/** Fixture 13, locked, months recorded to September 2026 with income taken from the pension, what is held on record. */
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

test.describe('Back to work, without an account', () => {
  test('the planner: the drawing plan closed, a saving plan made that says the £10,000 limit on its Accumulation page', async ({ page, watch }) => {
    test.setTimeout(360_000);
    watch.allow(WORKER_DATA_MISSING);
    await seed(page);
    const request = makeRequest({ planId: PLAN_ID, place: 'about', back: '#/plans', at: NOW });
    await page.evaluate(([rk, req]) => sessionStorage.setItem(rk, req), [OPEN_PLACE_KEY, request]);
    await page.goto(PROD + CLASSIC_PATH);
    await expect(page.locator('#mainApp')).toBeVisible({ timeout: 45_000 });
    await expect(page.locator('#ssTimingBlock')).toBeVisible({ timeout: 45_000 });
    const line = page.locator('#ssPlanClose');
    await expect(line).toContainText('Going back to work?', { timeout: 45_000 });
    await expect(line.getByRole('button', { name: 'Move to a new plan…' })).toBeEnabled();   // the move, as before, beside it
    await line.getByRole('button', { name: 'I’m going back to work…' }).click();
    const q = page.locator('div', { has: page.locator('h3', { hasText: 'I’m going back to work' }) }).last();
    await expect(q).toBeVisible();
    await expect(page.locator('#pcMonth')).toHaveValue('2026-11');
    await expect(q).toContainText('‘Alex’s linkers’ closes at the end of October 2026 and is kept as it is');
    await expect(q).toContainText('The new saving plan takes the months from November 2026.');
    await expect(page.getByTestId('planClose.flexibleAccess')).toContainText(LIMIT);
    // the default name says the month, and follows the month chosen until it is typed over
    await expect(page.locator('#pcName')).toHaveValue('Alex’s linkers, back to work from November 2026');
    await page.locator('#pcMonth').selectOption('2026-12');
    await expect(page.locator('#pcName')).toHaveValue('Alex’s linkers, back to work from December 2026');
    await page.locator('#pcMonth').selectOption('2026-11');
    await expect(page.locator('#pcStopMonth')).toHaveAttribute('placeholder', '2030-06');
    await page.locator('#pcStopMonth').fill('2030-06');
    await page.locator('#pcName').fill('Alex saving again');
    await page.getByRole('button', { name: 'Close this plan and start saving', exact: true }).click();

    // the saving plan, opened on its Accumulation page: what goes in is asked there, and the limit is said
    await expect(page.locator('#mainApp')).toBeVisible({ timeout: 60_000 });
    await expect(page.locator('#scenarioActiveName')).toHaveText('Alex saving again', { timeout: 45_000 });
    await expect(page.locator('#acWarnings')).toContainText(LIMIT, { timeout: 45_000 });
    const plans = await storedPlans(page);
    const old = plans.find((p) => p.id === PLAN_ID), made = plans.find((p) => p.id !== PLAN_ID);
    expect(old).toMatchObject({ closedAt: '2026-10', nextPlanId: made.id });
    expect('flexibleAccess' in old).toBe(false);
    expect(made).toMatchObject({ previousPlanId: PLAN_ID, before: { kind: 'working', from: '2026-11' }, flexibleAccess: { since: '2024-11', fromPlanId: PLAN_ID }, isActive: true });
    expect(made.stressTool.settings).toMatchObject({ retired: false, stoppedWork: '2030-06', firstTaxYear: 2030 });
    expect(made.decisionTool.settings.locked).toBe(false);
    // its Settings say what came before it; the closed plan says why it closed
    await openStressSettings(page);
    await expect(page.locator('#ssPlanClose')).toContainText('Under your previous plan ‘Alex’s linkers’ until October 2026 — its months are there.', { timeout: 45_000 });
    await page.locator('#ssPlanClose').getByRole('button', { name: 'Open ‘Alex’s linkers’' }).click();
    await expect(page.locator('#scenarioActiveName')).toHaveText('Alex’s linkers', { timeout: 60_000 });
    await openStressSettings(page);
    await expect(page.locator('#ssLockBanner')).toContainText('Closed October 2026: back to work; carried on as ‘Alex saving again’.', { timeout: 45_000 });

    const widths = await page.evaluate(() => ({ doc: document.documentElement.scrollWidth, win: window.innerWidth }));
    expect(widths.doc, 'no sideways scroll').toBeLessThanOrEqual(widths.win + 1);
  });

  test('the preview: the same close from "Your plans"; the saving plan on the saver\'s rail, What you pay in saying the limit', async ({ page, watch }) => {
    test.setTimeout(240_000);
    watch.allow(WORKER_DATA_MISSING);
    await seed(page);
    await page.goto(PROD + V7_PATH + '#/plans');
    await expect(page.locator('#app [data-screen]')).toHaveAttribute('data-screen', 'plans', { timeout: 45_000 });
    await page.getByTestId('plans.closeWorking.' + PLAN_ID).click();
    const box = page.getByTestId('plans.closeBox.' + PLAN_ID);
    await expect(box).toHaveAttribute('data-reason', 'working');
    await expect(page.getByTestId('plans.close.month')).toHaveValue('2026-11');
    await expect(page.getByTestId('plans.close.flexible')).toContainText(LIMIT);
    // the default name says the month, and follows the month chosen until it is typed over
    await expect(page.getByTestId('plans.close.name')).toHaveValue('Alex’s linkers, back to work from November 2026');
    await page.getByTestId('plans.close.month').selectOption('2026-12');
    await expect(page.getByTestId('plans.close.name')).toHaveValue('Alex’s linkers, back to work from December 2026');
    await page.getByTestId('plans.close.month').selectOption('2026-11');
    await page.getByTestId('plans.close.stopMonth').fill('June 2030');
    await page.getByTestId('plans.close.name').fill('Alex saving again');
    await page.getByTestId('plans.close.yes').click();
    await expect(page.getByTestId('plans.toast')).toContainText('‘Alex’s linkers’ is closed. ‘Alex saving again’ carries on from November 2026, saving until you stop again.', { timeout: 45_000 });
    await expect(page.getByTestId('plans.group.previous')).toContainText('Closed October 2026: back to work; carried on as ‘Alex saving again’.', { timeout: 45_000 });
    const plans = await storedPlans(page);
    const made = plans.find((p) => p.id !== PLAN_ID);
    expect(made).toMatchObject({ before: { kind: 'working', from: '2026-11' }, flexibleAccess: { since: '2024-11', fromPlanId: PLAN_ID } });
    expect(made.stressTool.settings).toMatchObject({ retired: false, stoppedWork: '2030-06' });

    // the saving plan: what came before it (on its home, 7.3.0, with What you pay in among its tools), the saver's rail, What you pay in with the limit
    await page.goto(PROD + V7_PATH + '#/plan/' + made.id);
    await expect(page.getByTestId('plan.before')).toContainText('Under your previous plan ‘Alex’s linkers’ until October 2026 — its months are there.', { timeout: 45_000 });
    await expect(page.getByTestId('plan.home.tool.saving')).toHaveCount(1);
    await page.goto(PROD + V7_PATH + '#/plan/' + made.id + '/plan');
    await expect(page.getByTestId('rail.plan.saving')).toHaveCount(1);
    await page.goto(PROD + V7_PATH + '#/plan/' + made.id + '/saving');
    await expect(page.getByTestId('plan.saving.allowance')).toHaveText(LIMIT, { timeout: 45_000 });

    const widths = await page.evaluate(() => ({ doc: document.documentElement.scrollWidth, win: window.innerWidth }));
    expect(widths.doc, 'no sideways scroll').toBeLessThanOrEqual(widths.win + 1);
  });
});
