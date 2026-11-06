/**
 * The saved plans in the preview, without an account (research/v7/your-plan.md 9: T10, T12 on the guest path). The
 * PUBLISHED build, which serves the planner at / and the preview at /v7/ on one site, so this window's plans
 * (sessionStorage pt_guest_scenarios, where the planner keeps a guest's plans) are seen by both.
 *
 *  1. Two linked plans of one household are planted in the window: the locked ladder in its run-up and
 *     the saver. /v7/#/plans lists them together under "Kept in this window only", each by its own name with its stage
 *     line. Each opens on the step its stage names, with its own figures, exact; every step is visited; every link is
 *     followed; the stored text is byte-identical afterwards and only the preview's own keys were written.
 *  2. "Change this" lands the planner on the right plan, page and section with the boxes filled (the page's own loader
 *     ran), with the line and the way back at the top; Back returns to the plan page. Nothing was written to the plans.
 *  3. Every corpus plan at once (research/v7/switch-readiness.md gate 2): every step and every sub-step of each opened
 *     and left without saving; the stored text is byte-identical afterwards and only the preview's own keys were written.
 *
 * Firebase is never reached: the preview reads this window's plans; every request outside the site is stopped.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { test, expect, PROD, REPO, FIXED_NOW, watchLanding, landingShown, V7_PATH, atClassic, LAYOUT_UNDER_TEST, WORKER_DATA_MISSING } from './helpers/app.js';
import { parse, screenName, PLAN_STEPS, PLAN_SUB_STEPS } from '../src/v7/router/routes.js';
import { ALL_STEPS } from '../src/answers/plan/steps.js';
import { OPEN_PLACE_KEY, OPEN_PLAN_KEY } from '../src/services/OpenPlace.js';

test.use({ outside: 'block' });

const GUEST_KEY = 'pt_guest_scenarios';
// … and, since road-to-7.md step 11: the What's new mark (a first-visit visitor is marked seen silently) and the visitor's
// meter's count and reminders (GuestMeter.js's own keys, ticked once a minute while plans of the person's own are in the window)
const OWN_KEYS = new Set(['pt_v7_draft', 'pt_lastActivity', OPEN_PLACE_KEY, OPEN_PLAN_KEY, 'pt_lastSeenVersion', 'pt_guest_minutes', 'pt_guest_nag_level']);

/** The linked pair, from the corpus (tests/v7/plan/_plans.js household()). */
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

const v7 = (hash) => PROD + V7_PATH + hash;
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
    await expect(group).toContainText('Retired. Living on the plan; your ladder’s first gilt pays from April 2029. Locked 1 July 2026.');   // 7.3.3: no words for months before its start
    await expect(group).toContainText('‘Saving plan’');
    await expect(group).toContainText('Still saving.');
    await expect(page.getByTestId('plans.signIn')).toBeVisible();
    // no box anywhere on the plan pages
    expect(await page.locator('#app input, #app select, #app textarea').count()).toBe(0);

    // the retired partner's plan opens on its home (7.3.0; Month by month until then): Drawing, as it records its months
    // (7.3.1, retaken on purpose: it read Moving in 7.3.0) — its ladder still short of its rungs is said under "Where you
    // are", not as a to-do; Month by month itself has September 2026 recorded at the fixed clock
    await page.getByTestId('plans.open.HouseLadder01').click();
    await expect(page.locator('#app [data-screen]')).toHaveAttribute('data-screen', 'plan');
    await expect(page.getByTestId('plan.home')).toBeVisible();
    await expect(page.getByTestId('plan.home.headline')).toHaveText('Drawing.');
    await expect(page.getByTestId('plan.stageLine')).toHaveText('Retired. Living on the plan; your ladder’s first gilt pays from April 2029. Locked 1 July 2026.');
    await expect(page.locator('[data-todo="move.next"]')).toHaveCount(0);
    await expect(page.getByTestId('plan.home.heldMix')).toContainText('of your plan’s mix');
    await page.evaluate(() => { window.location.hash = '#/plan/HouseLadder01/month'; });
    await expect(page.getByTestId('plan.step.month')).toBeVisible();
    await expect(page.locator('[data-region="plan-step"]')).toContainText('September 2026 recorded: £2,476 after tax');
    await expect(page.getByTestId('plan.month.idle')).toContainText('September is recorded. October opens on 1 October');
    // a Drawing plan's rail never names a move as Next (7.3.1, retaken on purpose: it was "Next: move 1 of …")
    await expect(page.getByTestId('rail.next')).toBeAttached();
    await expect(page.getByTestId('rail.next')).not.toContainText('to your plan’s mix');
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
    // the household step opens the partner's plan inside the preview, on its home (7.3.0): What you pay in among its tools
    await page.evaluate(() => { window.location.hash = '#/plan/HouseLadder01/household'; });
    await expect(page.getByTestId('plan.household.with')).toContainText('With ‘Saving plan’: still saving.');   // the household step draws its own screen since 6.42.0
    await page.getByTestId('plan.household.openPartner').click();
    await expect(page.getByTestId('plan.home')).toBeVisible();
    await expect(page.getByTestId('plan.home.tool.saving')).toContainText('£600 a month from you, £450 from your employer');
    await expect(page.getByTestId('plan.stageLine')).toHaveText('Still saving.');
    // every link on the plan pages leads inside the preview or to the planner
    const links = await page.locator('#app a[href]').evaluateAll((els) => els.map((el) => el.getAttribute('href')));
    for (const href of links) expect(href.startsWith('#/') || [LAYOUT_UNDER_TEST.v7.classic, LAYOUT_UNDER_TEST.v7.privacy].some((o) => href.startsWith(o)), href).toBe(true);
    // (the rail's "Lock the plan" step draws its own screen since 6.38.0: road-to-7.md step 6)
    // the plan's own sub-steps (plan.lock, plan.way, plan.mix, plan.household …) are inside the preview too
    // … and, since road-to-7.md step 11, every header's account page and every footer's What's new
    for (const href of links.filter((h) => h.startsWith('#/'))) { const n = screenName(parse(href)); if (!n.startsWith('plan.')) expect(['front', 'plans', 'plan', 'c.numbers', 'a.numbers', 'b.numbers', 'account', 'news', 'assumptions']).toContain(n); }   // "Assumptions and data" at the foot of every page (road-to-7.md step 11b)

    // a reload: the plans are read again from the window, nothing kept in the page's own storage
    await page.reload();
    await expect(page.getByTestId('plan.home')).toBeVisible();
    const after = await page.evaluate(([k]) => ({ guest: sessionStorage.getItem(k), session: Object.keys(sessionStorage), local: Object.keys(localStorage) }), [GUEST_KEY]);
    expect(after.guest === stored, 'the window\'s plans are byte-identical').toBe(true);
    for (const k of [...after.session, ...after.local]) expect(OWN_KEYS.has(k) || k === GUEST_KEY, `a key the preview must not write: ${k}`).toBe(true);
    const own = await page.evaluate(() => sessionStorage.getItem('pt_v7_draft'));
    if (own) { expect(own).not.toContain('planDocument'); expect(own).not.toContain('decisionTool'); }
  });

  test('"Change this" lands the planner on the right plan, page and section with the boxes filled; Back returns', async ({ page, watch }) => {
    test.setTimeout(180_000);
    // as on the live site today: the engine worker asks for the market files from its own address (e2e/old-app-unchanged.spec.js)
    watch.allow(WORKER_DATA_MISSING);
    const { ladder, saver } = household();
    const stored = await plant(page, [ladder, saver]);
    await page.goto(v7('#/plan/HouseSaver02'));
    await expect(page.getByTestId('plan.home')).toBeVisible();
    await expect(page.getByTestId('plan.windowWarning')).toHaveText('This plan is kept in this browser window only. The classic planner opens on it without an account.');
    // (7.3.0) the old step panel's "Are you paying in enough?" and "Change this here" links are no longer drawn at the plan's
    // address (its home is): the way into "What you pay in" is the home's tool, pinned here in their place
    await expect(page.getByTestId('plan.home.tool.saving')).toHaveAttribute('href', '#/plan/HouseSaver02/saving');
    await page.goto(v7('#/plan/HouseSaver02/saving'));
    await expect(page.getByTestId('plan.step.saving')).toBeVisible();

    // "Are you paying in enough?" leads to the plan's verdict inside V7 (release step R2), and "Change this here" to the same
    // page (road-to-7.md step 11b); the planner's fixed-rate pot check is still the planner's: the request in this window, then
    // the planner in the same window
    // (7.3.0: "What you pay in" draws its own screen; its pot check is the same hand-over)
    await watchLanding(page);   // every frame of the planner's document is looked at: the landing page must never be painted
    await page.getByTestId('plan.saving.onCourse').click();
    await page.waitForURL(atClassic);
    // the planner, reloaded: nobody is signed in and the plan is kept in this window, so the planner opens on it by itself —
    // the landing page is never shown (reported 2 Nov 2026: he took its account-first page for "sign in first").
    // The proof is #mainApp by itself, with no click, and the frame watch: a toBeHidden on #landingPage would be satisfied by
    // the bare div before the page's script has run.
    await expect(page.locator('#mainApp')).toBeVisible();
    expect(await landingShown(page), 'the landing page was never on screen, not for a frame').toBe(false);
    await expect(page.locator('#landingTryGuest')).toBeHidden();
    // the Accumulation page, on the saver's plan, its boxes filled by the page's own loader
    await expect(page.locator('#guestBanner')).toBeVisible();
    const note = page.locator('#openPlaceNote');
    await expect(note).toBeVisible();
    await expect(note).toContainText('Opened from PensionTools.');
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

    // Back to the preview: the saving step's own address, which since 6.45.0 draws "What you pay in" (road-to-7.md step 11b), the boxes as saved
    await note.locator('a').click();
    await expect(page.locator('#app [data-screen]')).toHaveAttribute('data-screen', 'plan.saving');
    await expect(page.getByTestId('plan.step.saving')).toBeVisible();
    await expect(page.getByTestId('plan.saving.netMonthly')).toHaveValue('600');
    await expect(page.getByTestId('plan.saving.employerMonthly')).toHaveValue('450');

    // the locked plan's own place: Month by month on the ladder, in the new app since 7.2.0; what comes next to it (the months
    // against the plan, the spreadsheets) is still the classic planner's History, handed over (the account's open plan: no
    // "this window only" line)
    await page.goto(v7('#/plan/HouseLadder01/month'));
    await expect(page.getByTestId('plan.step.month')).toBeVisible();
    await expect(page.locator('#app [data-screen]')).toHaveAttribute('data-screen', 'plan.month');
    // (the frame watch registered above runs afresh in this document too)
    await page.getByTestId('plan.month.classic').click();
    await page.waitForURL(atClassic);
    await expect(page.locator('#mainApp')).toBeVisible();
    expect(await landingShown(page), 'the landing page was never on screen, not for a frame').toBe(false);
    await expect(page.locator('#landingTryGuest')).toBeHidden();
    await expect(page.locator('#openPlaceNote')).toContainText('Opened from PensionTools.');
    await expect(page.locator('#openPlaceNote')).not.toContainText('in this window only');
    await expect(page.locator('.tab[data-tab="decision"]')).toHaveClass(/active/);
    await expect(page.locator('.sub-tab[data-decisiontab="history"]')).toHaveClass(/active/);
    await expect(page.locator('#scenarioActiveName')).toHaveText('Ladder plan');
    const finalPlans = await page.evaluate((k) => sessionStorage.getItem(k), GUEST_KEY);
    expect(JSON.parse(finalPlans).map((p) => p.id).sort()).toEqual(['HouseLadder01', 'HouseSaver02']);
    expect(JSON.parse(finalPlans).find((p) => p.id === 'HouseLadder01').decisionTool.history.length).toBe(JSON.parse(stored).find((p) => p.id === 'HouseLadder01').decisionTool.history.length);
  });

  test('a month that was missed (reported 3 Nov 2026): Month by month names it, offers to fill it in, and opens on it with the record before it filled in', async ({ page, watch }) => {
    test.setTimeout(180_000);
    watch.allow(WORKER_DATA_MISSING);
    // the running buckets plan (corpus 04: April to September 2026 recorded) with August taken out — September stands, August is the gap
    const buckets = JSON.parse(readFileSync(join(REPO, 'tests', 'fixtures', 'plans', '04-buckets-running.json'), 'utf8'));
    buckets.id = 'GapBuckets04'; buckets.planDetails.name = 'Buckets plan'; buckets.isActive = true;
    buckets.decisionTool.history = buckets.decisionTool.history.filter((h) => h.date !== '2026-08');
    const july = buckets.decisionTool.history.find((h) => h.date === '2026-07');
    await plant(page, [buckets]);
    // the plan's home (7.3.0): the month missed is the first thing to do, into Month by month
    await page.goto(v7('#/plan/GapBuckets04'));
    await expect(page.locator('[data-region="home-todo"] .home-item').first()).toHaveAttribute('data-todo', 'month.gap');
    // a month missed is named with its year on the home, title and button alike (retaken on purpose: it was "Record August"),
    // so a gap from an earlier tax year never reads as this year's month
    await expect(page.getByTestId('plan.home.todo.month.gap')).toHaveText('Record August 2026');
    await page.goto(v7('#/plan/GapBuckets04/month'));
    await expect(page.getByTestId('plan.step.month')).toBeVisible();
    const panel = page.locator('[data-region="plan-step"]');
    await expect(panel).toContainText('August 2026 is not recorded yet; September 2026 is.');
    await expect(panel).toContainText('September 2026 was recorded without it and stays as it is.');
    await expect(page.getByTestId('rail.next')).toContainText('Next: record August 2026.');
    await expect(page.getByTestId('rail.next')).not.toContainText('Nothing to do until');
    // the rail's button stays inside the new app (7.2.0): Month by month, which names August among the months not recorded
    await expect(page.getByTestId('rail.next.button')).toHaveText('Record August');
    await expect(page.getByTestId('rail.next.button')).toHaveAttribute('href', '#/plan/GapBuckets04/month');
    await page.evaluate(() => { window.location.hash = '#/plan/GapBuckets04/month'; });   // where it leads (on a phone the rail is folded)
    await expect(page.locator('#app [data-screen]')).toHaveAttribute('data-screen', 'plan.month');
    await expect(page.getByTestId('plan.month.gap')).toContainText('August 2026');
    // August chosen: the boxes hold July's figures — the balances going into August — not September's
    await page.getByTestId('plan.month.mo.month').selectOption('2026-08');
    await expect(page.getByTestId('plan.month.mo.total')).toHaveValue(String(july.equity + july.bond + july.cash));
    await expect(page.getByTestId('plan.month.mo.cash')).toHaveValue(String(july.cash));
    await expect(page.getByTestId('plan.month.mo.bonds')).toHaveValue(String(july.bond));
    await expect(page.getByTestId('plan.month.prefilled')).toContainText('July 2026');
    await expect(page.getByTestId('plan.month.submit')).toHaveText('Record August 2026');
    // nothing written to the plan by looking
    const plansNow = JSON.parse(await page.evaluate((k) => sessionStorage.getItem(k), GUEST_KEY));
    expect(plansNow.find((p) => p.id === 'GapBuckets04').decisionTool.history.map((h) => h.date)).toEqual(['2026-04', '2026-05', '2026-06', '2026-07', '2026-09']);
  });

  test('every step and sub-step of every corpus plan, opened and left without saving: the stored plans byte for byte (gate 2)', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop-1440', 'the browse of every plan is the same at every size: it runs once, at 1440');
    test.setTimeout(300_000);
    // the twelve corpus plans (tests/v7/plan/_plans.js corpus()), as they are kept: each its own id, the couple linked to each other
    const dir = join(REPO, 'tests', 'fixtures', 'plans');
    const plans = readdirSync(dir).filter((f) => /^\d\d-.*\.json$/.test(f)).sort().map((f) => JSON.parse(readFileSync(join(dir, f), 'utf8')));
    expect(plans.length).toBeGreaterThanOrEqual(12);
    expect(new Set(plans.map((p) => p.id)).size, 'one id each').toBe(plans.length);
    const stored = await plant(page, plans);
    await page.goto(v7('#/plans'));
    await expect(page.locator('#app [data-screen]')).toHaveAttribute('data-screen', 'plans');
    // every address a plan has (routes.js): the rail's steps and the sub-steps that draw their own screen
    const steps = [...new Set([...PLAN_STEPS, ...PLAN_SUB_STEPS])];
    for (const plan of plans) {
      // the plan's home (7.3.0) is browsed too: it reads, and writes nothing
      await page.evaluate((h) => { window.location.hash = h; }, `#/plan/${plan.id}`);
      await expect(page.getByTestId('plan.home'), plan.id).toBeVisible();
      expect(await page.locator('#app').innerText(), plan.id).not.toMatch(/undefined|NaN|\{\w+\}/);
      for (const step of steps) {
        const hash = `#/plan/${plan.id}/${step}`;
        await page.evaluate((h) => { window.location.hash = h; }, hash);
        await expect(page.locator('#app [data-screen]'), hash).toHaveAttribute('data-screen', screenName(parse(hash)));
        await expect(page.getByTestId(`plan.step.${step}`), hash).toBeVisible();
        expect(await page.locator('#app').innerText(), hash).not.toMatch(/undefined|NaN|\{\w+\}/);
      }
    }
    // read again from the window: nothing kept in the page's own storage, nothing written to a plan
    await page.reload();
    await expect(page.getByTestId(`plan.step.${steps[steps.length - 1]}`)).toBeVisible();
    const after = await page.evaluate(([k]) => ({ guest: sessionStorage.getItem(k), session: Object.keys(sessionStorage), local: Object.keys(localStorage) }), [GUEST_KEY]);
    expect(after.guest === stored, 'the window\'s plans are byte-identical').toBe(true);
    for (const k of [...after.session, ...after.local]) expect(OWN_KEYS.has(k) || k === GUEST_KEY, `a key the preview must not write: ${k}`).toBe(true);
  });
});
