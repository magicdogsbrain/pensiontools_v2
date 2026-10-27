/**
 * The saved plans in the preview, without an account (research/v7/your-plan.md 9: T10, T12 on the guest path). The
 * PUBLISHED build, which serves the planner at / and the preview at /v7/ on one site, so this window's plans
 * (sessionStorage pt_guest_scenarios, where the planner keeps a guest's plans) are seen by both.
 *
 *  1. Two linked plans shaped like the owner's household are planted in the window: the locked ladder in its run-up and
 *     the saver. /v7/#/plans lists them together under "Kept in this window only", each by its own name with its stage
 *     line. Each opens on the step its stage names, with its own figures, exact; every step is visited; every link is
 *     followed; the stored text is byte-identical afterwards and only the preview's own keys were written.
 *  2. "Change this" lands the planner on the right plan, page and section with the boxes filled (the page's own loader
 *     ran), with the line and the way back at the top; Back returns to the plan page. Nothing was written to the plans.
 *
 * Firebase is never reached: the preview reads this window's plans; every request outside the site is stopped.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test, expect, PROD, REPO, FIXED_NOW } from './helpers/app.js';
import { parse, screenName } from '../src/v7/router/routes.js';
import { ALL_STEPS } from '../src/answers/plan/steps.js';
import { OPEN_PLACE_KEY, OPEN_PLAN_KEY } from '../src/services/OpenPlace.js';

test.use({ outside: 'block' });

const GUEST_KEY = 'pt_guest_scenarios';
const OWN_KEYS = new Set(['pt_v7_draft', 'pt_lastActivity', OPEN_PLACE_KEY, OPEN_PLAN_KEY]);

/** The owner-shaped pair, from the corpus (tests/v7/plan/_plans.js household()). */
function household() {
  const load = (f) => JSON.parse(readFileSync(join(REPO, 'tests', 'fixtures', 'plans', f), 'utf8'));
  const ladder = load('03-gilt-ladder-runup.json');
  const saver = load('05-saver-committed.json');
  ladder.id = 'HouseLadder01'; ladder.planDetails.name = 'Ladder plan'; ladder.isActive = true; ladder.household = { partnerScenarioId: 'HouseSaver02' };
  saver.id = 'HouseSaver02'; saver.planDetails.name = 'Saving plan'; saver.isActive = false;
  delete saver.planDocument; delete saver.journey;
  saver.decisionTool.settings = { ...saver.decisionTool.settings, locked: false }; delete saver.decisionTool.settings.lockedAt; delete saver.decisionTool.settings.lockedBy;
  return { ladder, saver };
}

const v7 = (hash) => PROD + '/v7/' + hash;
const screenAt = (page) => page.locator('#app [data-screen]').getAttribute('data-screen');

async function plant(page, plans) {
  await page.clock.setFixedTime(new Date(FIXED_NOW));
  await page.goto(v7('#/'));
  await expect(page.locator('#app [data-screen]')).toBeVisible();
  await page.evaluate(([k, text]) => { sessionStorage.setItem(k, text); }, [GUEST_KEY, JSON.stringify(plans)]);
  return JSON.stringify(plans);
}

test.describe('the saved plans, without an account', () => {
  test('the list, each plan on its own step with its own figures, every step and link; the stored plans byte for byte', async ({ page }) => {
    test.setTimeout(180_000);
    const { ladder, saver } = household();
    const stored = await plant(page, [ladder, saver]);
    await page.goto(v7('#/plans'));
    await expect(page.locator('#app [data-screen]')).toHaveAttribute('data-screen', 'plans');
    const group = page.getByTestId('plans.group.window');
    await expect(group).toBeVisible();
    await expect(group.locator('h2')).toHaveText('Kept in this window only, without an account');
    const rows = group.locator('.plan-row');
    await expect(rows).toHaveCount(2);
    await expect(group).toContainText('‘Ladder plan’');
    await expect(group).toContainText('Retired. Your ladder pays from April 2027. Locked 1 July 2026.');
    await expect(group).toContainText('‘Saving plan’');
    await expect(group).toContainText('Still saving.');
    await expect(page.getByTestId('plans.signIn')).toBeVisible();
    // no box anywhere on the plan pages
    expect(await page.locator('#app input, #app select, #app textarea').count()).toBe(0);

    // the retired partner's plan opens on This month (September 2026 at the fixed clock), with the plan's own record
    await page.getByTestId('plans.open.HouseLadder01').click();
    await expect(page.locator('#app [data-screen]')).toHaveAttribute('data-screen', 'plan');
    await expect(page.getByTestId('plan.step.month')).toBeVisible();
    await expect(page.getByTestId('plan.stageLine')).toHaveText('Retired. Your ladder pays from April 2027. Locked 1 July 2026.');
    await expect(page.locator('[data-region="plan-step"]')).toContainText('September 2026 recorded: £3,395 after tax');
    await expect(page.getByTestId('rail.next')).toContainText('September 2026 is recorded. Nothing to do until October.');
    const text = await page.locator('#app').innerText();
    expect(text).not.toMatch(/months? to go|years? to go|countdown/i);
    expect(text).not.toMatch(/undefined|NaN/);
    // every step of the ladder, moved to inside the tab
    for (const step of ALL_STEPS) {
      await page.evaluate((h) => { window.location.hash = h; }, `#/plan/HouseLadder01/${step}`);
      await expect(page.getByTestId(`plan.step.${step}`)).toBeVisible();
      // a step drawn on the plan page itself is box-free; a step with its own screen (household since 6.42.0, hold and move since 6.43.0) has its boxes by design
      const screen = await page.locator('#app [data-screen]').getAttribute('data-screen');
      if (screen === 'plan') expect(await page.locator('#app input, #app select, #app textarea').count(), step).toBe(0);
      expect(await page.locator('#app').innerText()).not.toMatch(/undefined|NaN|\{\w+\}/);
    }
    // the household step opens the partner's plan inside the preview; the saver opens on What you pay in
    await page.evaluate(() => { window.location.hash = '#/plan/HouseLadder01/household'; });
    await expect(page.getByTestId('plan.household.with')).toContainText('With ‘Saving plan’: still saving.');   // the household step draws its own screen since 6.42.0
    await page.getByTestId('plan.household.openPartner').click();
    await expect(page.getByTestId('plan.step.saving')).toBeVisible();
    await expect(page.locator('[data-region="plan-step"]')).toContainText('£600 a month from you, £450 from your employer');
    await expect(page.getByTestId('plan.stageLine')).toHaveText('Still saving.');
    // every link on the plan pages leads inside the preview or to the planner
    const links = await page.locator('#app a[href]').evaluateAll((els) => els.map((el) => el.getAttribute('href')));
    for (const href of links) expect(href).toMatch(/^(#\/|\.\.\/)/);
    // (the rail's "Lock the plan" step draws its own screen since 6.38.0: road-to-7.md step 6)
    // the plan's own sub-steps (plan.lock, plan.way, plan.mix, plan.household …) are inside the preview too
    for (const href of links.filter((h) => h.startsWith('#/'))) { const n = screenName(parse(href)); if (!n.startsWith('plan.')) expect(['front', 'plans', 'plan', 'c.numbers', 'a.numbers', 'b.numbers']).toContain(n); }

    // a reload: the plans are read again from the window, nothing kept in the page's own storage
    await page.reload();
    await expect(page.getByTestId('plan.step.saving')).toBeVisible();
    const after = await page.evaluate(([k]) => ({ guest: sessionStorage.getItem(k), session: Object.keys(sessionStorage), local: Object.keys(localStorage) }), [GUEST_KEY]);
    expect(after.guest === stored, 'the window\'s plans are byte-identical').toBe(true);
    for (const k of [...after.session, ...after.local]) expect(OWN_KEYS.has(k) || k === GUEST_KEY, `a key the preview must not write: ${k}`).toBe(true);
    const own = await page.evaluate(() => sessionStorage.getItem('pt_v7_draft'));
    if (own) { expect(own).not.toContain('planDocument'); expect(own).not.toContain('decisionTool'); }
  });

  test('"Change this" lands the planner on the right plan, page and section with the boxes filled; Back returns', async ({ page, watch }) => {
    test.setTimeout(180_000);
    // as on the live site today: the engine worker asks for the market files beside itself (e2e/old-app-unchanged.spec.js)
    watch.allow(/^asked for a file that is not there: \/assets\/data\/(gilts|equity)\.json$/);
    const { ladder, saver } = household();
    const stored = await plant(page, [ladder, saver]);
    await page.goto(v7('#/plan/HouseSaver02'));
    await expect(page.getByTestId('plan.step.saving')).toBeVisible();
    await expect(page.getByTestId('plan.windowWarning')).toHaveText('In the planner, press ‘Just try it — no account’ to carry on with this plan.');

    // Change what you pay in: the request in this window, then the planner in the same window
    await page.getByTestId('plan.saving.changeSaving').click();
    await page.waitForURL((u) => new URL(u).pathname === '/' || new URL(u).pathname === '/index.html');
    // the planner, reloaded: nobody is signed in, so its landing page; "Carry on with the plans in this window"
    await expect(page.locator('#landingTryGuest')).toBeVisible();
    await page.locator('#landingTryGuest').click();
    // the Accumulation page, on the saver's plan, its boxes filled by the page's own loader
    await expect(page.locator('#mainApp')).toBeVisible();
    const note = page.locator('#openPlaceNote');
    await expect(note).toBeVisible();
    await expect(note).toContainText('Opened from the preview.');
    await expect(note).toContainText('‘Saving plan’ is open in this window only. Your other windows and devices stay on ‘Ladder plan’.');
    await expect(page.locator('.tab[data-tab="accumulation"]')).toHaveClass(/active/);
    await expect(page.locator('#acNetMonthly')).toHaveValue('600');
    await expect(page.locator('#acEmployerMonthly')).toHaveValue('450');
    await expect(page.locator('#scenarioActiveName')).toHaveText('Saving plan');
    // the request was read once; the window's plan is pinned; nothing written to the plans
    expect(await page.evaluate((k) => sessionStorage.getItem(k), OPEN_PLACE_KEY)).toBe(null);
    expect(await page.evaluate((k) => sessionStorage.getItem(k), OPEN_PLAN_KEY)).toBe('HouseSaver02');
    const plansNow = JSON.parse(await page.evaluate((k) => sessionStorage.getItem(k), GUEST_KEY));
    expect(plansNow.find((p) => p.id === 'HouseLadder01').isActive, 'the account\'s open plan is unmoved').toBe(true);
    expect(plansNow.find((p) => p.id === 'HouseSaver02').isActive).toBe(false);
    expect(plansNow.find((p) => p.id === 'HouseLadder01').planDocument).toEqual(ladder.planDocument);

    // Back to the preview: the same plan page
    await note.locator('a').click();
    await expect(page.locator('#app [data-screen]')).toHaveAttribute('data-screen', 'plan');
    await expect(page.getByTestId('plan.step.saving')).toBeVisible();
    await expect(page.locator('[data-region="plan-step"]')).toContainText('£600 a month from you, £450 from your employer');

    // the locked plan's own place: Monthly Entry on the ladder (the account's open plan: no "this window only" line)
    await page.goto(v7('#/plan/HouseLadder01/month'));
    await expect(page.getByTestId('plan.step.month')).toBeVisible();
    await page.getByTestId('plan.month.record').click();
    await expect(page.locator('#landingTryGuest')).toBeVisible();
    await page.locator('#landingTryGuest').click();
    await expect(page.locator('#openPlaceNote')).toContainText('Opened from the preview.');
    await expect(page.locator('#openPlaceNote')).not.toContainText('in this window only');
    await expect(page.locator('.tab[data-tab="decision"]')).toHaveClass(/active/);
    await expect(page.locator('.sub-tab[data-decisiontab="entry"]')).toHaveClass(/active/);
    await expect(page.locator('#scenarioActiveName')).toHaveText('Ladder plan');
    const finalPlans = await page.evaluate((k) => sessionStorage.getItem(k), GUEST_KEY);
    expect(JSON.parse(finalPlans).map((p) => p.id).sort()).toEqual(['HouseLadder01', 'HouseSaver02']);
    expect(JSON.parse(finalPlans).find((p) => p.id === 'HouseLadder01').decisionTool.history.length).toBe(JSON.parse(stored).find((p) => p.id === 'HouseLadder01').decisionTool.history.length);
  });
});
