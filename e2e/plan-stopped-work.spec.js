/**
 * Say when you stopped work (6.51.0; research/plan-start.md §7, browser cases a, c and e), without an account. The
 * PUBLISHED build: the planner at / and the preview at /v7/ on one site, so this window's plans (sessionStorage
 * pt_guest_scenarios) are seen by both. The clock is the corpus's: 30 September 2026 (tax year 2026/27).
 *
 *  (a) The planner, a draft for Alex (fictional; the corpus's fixture 13 made a draft that does not say when work stopped,
 *      its income from next April): the month box takes October 2023, the plan's income then starts in 2023/24 — the year
 *      offered and chosen by default — and the summary says plan year 3 now; the ladder's cash "until the plan's income
 *      starts" is not offered. Locked from the Stress settings: the document's ladder is bought from 2026/27 on and the pots
 *      are plan year 3's; the strip reads "Plan year 3 of …". September 2026 recorded in Month by month is "Year 3" in the
 *      History view and in plan vs actual, compared with the plan.
 *  (c) The same draft, saved with next April (7.4.0): read from this tax year, said once in the summary; nothing written by
 *      opening it; locked from the Stress settings, it is locked as it reads — from 2026/27 — with nothing to move. The words
 *      "run-up" and "bridge" appear nowhere.
 *  (e) The preview's "About you and when" on a draft whose start year has passed (offered "update it to today"): the month
 *      work stopped is typed — a past one — the tax year it is in is chosen by default; saved, the offer is gone and the plan
 *      page's stage line is the draft's own.
 *
 * Firebase is never reached: every request outside the site is stopped (`outside: 'block'`).
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test, expect, PROD, REPO, FIXED_NOW, V7_PATH, CLASSIC_PATH, WORKER_DATA_MISSING } from './helpers/app.js';
import { OPEN_PLACE_KEY, makeRequest } from '../src/services/OpenPlace.js';

test.use({ outside: 'block' });

const GUEST_KEY = 'pt_guest_scenarios';
const PLAN_ID = 'StopPlan01';
const read = (name) => JSON.parse(readFileSync(join(REPO, 'tests', 'fixtures', 'plans', name + '.json'), 'utf8'));

/** Fixture 13 as a draft that does not say when work stopped: income from next April (2027/28), nothing recorded, 2026/27 set up. */
function draft() {
  const p = read('13-stopped-drawing-since');
  p.id = PLAN_ID;
  p.planDetails.name = 'Alex’s plan';
  p.isActive = true;
  Object.assign(p.stressTool.settings, { firstTaxYear: 2027, shapeAgeNow: 64 });
  delete p.stressTool.settings.stoppedWork;
  p.decisionTool.settings = { ...p.decisionTool.settings, locked: false, firstTaxYear: 2027 };
  delete p.decisionTool.settings.lockedAt; delete p.decisionTool.settings.lockedBy;
  delete p.decisionTool.planOfRecord; delete p.planDocument; delete p.journey;
  p.decisionTool.history = [];
  p.decisionTool.taxYears = { '26/27': p.decisionTool.taxYears['26/27'] };
  return p;
}
const storedPlan = (page) => page.evaluate(([k, id]) => JSON.parse(sessionStorage.getItem(k)).find((p) => p.id === id), [GUEST_KEY, PLAN_ID]);

/** Plant the plan in the window and open the planner on the Timing block ("When your plan starts"). */
async function openTiming(page, plan) {
  await page.clock.setFixedTime(new Date(FIXED_NOW));
  await page.goto(PROD + V7_PATH + '#/');
  await expect(page.locator('#app [data-screen]')).toBeVisible();
  const request = makeRequest({ planId: PLAN_ID, place: 'about', back: '#/plans', at: FIXED_NOW });
  await page.evaluate(([k, text, rk, req]) => { sessionStorage.setItem(k, text); sessionStorage.setItem(rk, req); }, [GUEST_KEY, JSON.stringify([plan]), OPEN_PLACE_KEY, request]);
  await page.goto(PROD + CLASSIC_PATH);
  await expect(page.locator('#mainApp')).toBeVisible({ timeout: 45_000 });
  await expect(page.locator('#ssTimingBlock')).toBeVisible({ timeout: 45_000 });
  await expect(page.locator('#tmRetired')).toBeChecked({ timeout: 45_000 });
}
/** Stress settings → "Lock plan & create the plan document", confirmed; the plan document opens. */
async function lock(page) {
  await page.locator('#ssLockBtn').click();
  await page.getByRole('button', { name: 'Lock the plan', exact: true }).click();
  await expect(page.locator('.pd-where')).toBeVisible({ timeout: 90_000 });
}
const noOldWords = (text) => expect(text).not.toMatch(/\brun[\s-]?up\b|\bbridge (month|year|cash)|SIPP cash to the first April/i);

test.describe('Say when you stopped work, without an account', () => {
  test('(a) stopped in October 2023: the plan from 2023/24, plan year 3 now; locked, the strip and a month recorded say Year 3', async ({ page, watch }) => {
    test.setTimeout(300_000);
    watch.allow(WORKER_DATA_MISSING);
    await openTiming(page, draft());
    // before: no month said — saved with next April, read from this tax year (7.4.0)
    await expect(page.locator('#tmStopMonth')).toHaveValue('');
    await expect(page.locator('#tmStartYear')).toHaveValue('2026');
    // the month work stopped: its tax year is offered, named, and chosen
    await page.locator('#tmStopMonth').fill('2023-10');
    await expect(page.locator('#tmStartYear')).toHaveValue('2023');
    await expect(page.locator('#tmStartYear option[value="2023"]')).toHaveText('2023/24 — the year you stopped work');
    // 7.3.3: never a later year than this one (7.4.0: the year saved the old way is read as this one, so it is not offered)
    await expect(page.locator('#tmStartYear option')).toHaveText(['2023/24 — the year you stopped work', '2024/25', '2025/26', 'this tax year — pick up from here — 2026/27']);
    await expect(page.locator('#tmSummary')).toContainText('You stopped work in October 2023. Plan started 6 April 2023 (tax year 2023/24); today is plan year 3 of');
    await expect(page.locator('#giltBridgeWrap')).toHaveCount(0);   // 7.4.2: the ladder's extra cash is gone from the page
    noOldWords(await page.locator('#ssTimingBlock').innerText());

    // locked: the document's pots are plan year 3's and its ladder is bought from this tax year on, no year lived bought again
    await lock(page);
    const locked = await storedPlan(page);
    expect(locked.stressTool.settings).toMatchObject({ stoppedWork: '2023-10', firstTaxYear: 2023, retired: true });
    expect(locked.decisionTool.settings).toMatchObject({ locked: true, firstTaxYear: 2023 });
    expect(locked.planDocument.pots.asOfPlanYear).toBe(3);
    expect(locked.planDocument.timing.monthsIntoYear).toBe(5);
    expect(locked.planDocument.strategy.r.plan.firstTaxYear).toBe(2026);
    expect(locked.planDocument.strategy.r.plan.years[0].Y).toBe(2026);
    expect('bridgeCash' in locked.planDocument.assumptions).toBe(false);   // 7.4.2: never written
    const strip = page.locator('.pd-where');
    await expect(strip).toContainText(/Plan year 3 of \d+ — tax year 2026\/27/);
    const doc = await page.locator('.pd').innerText();
    expect(doc).toContain('Plan started');
    expect(doc).toContain('locked in plan year 3, on the pots as they stood in September 2026');
    noOldWords(doc);

    // September 2026 in Month by month: Year 3, compared with the plan
    await page.evaluate(() => document.querySelector('.sub-tab[data-decisiontab="entry"]').click());
    await expect(page.locator('#decision-entry')).toBeVisible({ timeout: 45_000 });
    await expect(page.locator('#entryMonth')).toHaveValue('2026-09');
    // the platform view of a ladder: the pension total and the cash in it (fictional figures)
    await page.locator('#entryPlatTotal').fill('415000');
    await page.locator('#entryPlatCash').fill('105000');
    await page.locator('#entryIsa').fill('15000');
    // the month's guidance is the ladder's own: this tax year paid by its cash years until the first gilt
    await expect(page.locator('#decision-entry')).toContainText('Your gilt ladder — tax year 2026/27');
    await page.locator('#decisionForm button[type="submit"]').click();
    await expect(page.locator('#saveBtn')).toBeEnabled({ timeout: 60_000 });
    await page.locator('#saveBtn').click();
    await expect(page.locator('#saveStateNote')).toContainText('September 2026 saved', { timeout: 60_000 });
    const after = await storedPlan(page);
    expect(after.decisionTool.history.map((h) => h.date)).toEqual(['2026-09']);
    await page.evaluate(() => document.querySelector('.sub-tab[data-decisiontab="history"]').click());
    await expect(page.locator('#historyDetail')).toContainText('Tax Year 26/27 • Year 3', { timeout: 45_000 });
    const pva = page.locator('#planVsActual');
    await expect(pva).toContainText('Plan vs actual', { timeout: 45_000 });
    await expect(pva).toContainText('Year 3');
    expect(await pva.innerText()).not.toMatch(/before the plan/i);
    const widths = await page.evaluate(() => ({ doc: document.documentElement.scrollWidth, win: window.innerWidth }));
    expect(widths.doc, 'no sideways scroll').toBeLessThanOrEqual(widths.win + 1);
  });

  test('(c) a draft saved with next April reads from this tax year, said once; opening writes nothing; locked as it reads (7.4.0)', async ({ page, watch }) => {
    test.setTimeout(240_000);
    watch.allow(WORKER_DATA_MISSING);
    const planted = draft();
    await openTiming(page, planted);
    await expect(page.locator('#tmStartYear')).toHaveValue('2026');
    await expect(page.locator('#tmStartYear option')).toHaveText(['this tax year — pick up from here — 2026/27']);
    await expect(page.locator('#tmSummary')).toContainText('Your plan runs from 2026/27, this tax year.');
    expect((await page.locator('#tmSummary').innerText()).match(/Your plan runs from/g).length).toBe(1);
    expect(await page.locator('#tmSummary').innerText()).not.toMatch(/set aside|not compared|before the plan/);
    await expect(page.locator('#giltBridgeWrap')).toHaveCount(0);   // 7.4.2: the ladder's extra cash is gone from the page
    noOldWords(await page.locator('#ssTimingBlock').innerText());
    // opened and read: nothing written (the stored plan is the one planted, its saved year next April)
    expect((await storedPlan(page)).stressTool.settings.firstTaxYear).toBe(2027);
    expect((await storedPlan(page)).stressTool.settings).toEqual(planted.stressTool.settings);
    await lock(page);
    const locked = await storedPlan(page);
    expect(locked.stressTool.settings).toMatchObject({ firstTaxYear: 2026 });
    expect(locked.stressTool.settings.stoppedWork).toBeUndefined();
    expect(locked.decisionTool.settings).toMatchObject({ locked: true, firstTaxYear: 2026 });
    // nothing to move: no start-later to-do on the strip or the banner
    await expect(page.locator('.pd-where')).toBeVisible();
    expect(await page.locator('.pd-where').innerText()).not.toMatch(/set to start in 2027/);
    expect(await page.locator('#nextStepBanner').innerText()).not.toMatch(/set to start in April 2027/);
    noOldWords(await page.locator('.pd').innerText());
    // the Transition page names no months before the plan either (7.3.3: its "You have stopped work … until then" note is gone)
    await page.evaluate(() => switchToTab('transition'));
    const transition = page.locator('#transitionPage');
    await expect(transition).toContainText('Target:', { timeout: 45_000 });
    const tt = await transition.innerText();
    expect(tt).not.toMatch(/You have stopped work|set aside|before the plan/);
    noOldWords(tt);
    expect(tt).not.toMatch(/SIPP cash/);
  });

  test('(e) "About you and when": a past month accepted, its tax year chosen; the out-of-date offer goes, the stage line is the draft\'s', async ({ page }) => {
    test.setTimeout(180_000);
    const plan = read('02-pnv-draft');
    plan.id = 'StopAbout02';
    plan.planDetails.name = 'Sam’s plan';
    plan.isActive = true;
    delete plan.household;
    plan.stressTool.settings.firstTaxYear = 2025;            // a start that has passed: offered "update it to today"
    plan.decisionTool.settings.firstTaxYear = 2025;
    await page.clock.setFixedTime(new Date(FIXED_NOW));
    await page.goto(PROD + V7_PATH + '#/');
    await expect(page.locator('#app [data-screen]')).toBeVisible();
    await page.evaluate(([k, text]) => sessionStorage.setItem(k, text), [GUEST_KEY, JSON.stringify([plan])]);
    await page.goto(PROD + V7_PATH + '#/plan/StopAbout02/about');
    await expect(page.locator('#app [data-screen]')).toHaveAttribute('data-screen', 'plan.about');
    await expect(page.getByTestId('plan.about.stale')).toBeVisible({ timeout: 45_000 });
    await expect(page.getByTestId('plan.about.stopped.yes')).toBeChecked();
    // the month work stopped, under "I have stopped work": a past month is taken, and the tax year it is in is chosen
    await page.getByTestId('plan.about.stopMonth').fill('September 2025');
    await expect(page.getByTestId('plan.about.startWhen.stop')).toBeChecked();
    await expect(page.locator('label[for="plan.about.startWhen.stop"]')).toHaveText('2025/26, the tax year you stopped work');
    await expect(page.locator('[data-line="about.stoppedIn"]')).toHaveText('You stopped work in September 2025.');
    await expect(page.locator('[data-line="about.started"]')).toContainText('Your plan’s income started in 2025/26.');
    await page.getByTestId('plan.about.save').click();
    await expect(page.locator('#app')).toContainText('Saved.', { timeout: 60_000 });
    const saved = await page.evaluate((k) => JSON.parse(sessionStorage.getItem(k))[0], GUEST_KEY);
    expect(saved.stressTool.settings).toMatchObject({ stoppedWork: '2025-09', firstTaxYear: 2025, retired: true });
    expect(saved.decisionTool.settings.firstTaxYear).toBe(2025);
    // running, not out of date: the offer is gone, and the plan page says what a draft says
    await expect(page.getByTestId('plan.about.stale')).toHaveCount(0, { timeout: 45_000 });
    await page.goto(PROD + V7_PATH + '#/plan/StopAbout02');
    await expect(page.getByTestId('plan.stageLine')).toHaveText('Retired. Plan not locked yet.', { timeout: 45_000 });
    // the plan's home (7.3.0): the draft's own to-do, never "update it to today"; the rail on a page of the plan says the same
    await expect(page.locator('[data-todo="draft.stale"]')).toHaveCount(0);
    await expect(page.locator('[data-todo="lock.first"]')).toHaveCount(1);
    await page.goto(PROD + V7_PATH + '#/plan/StopAbout02/plan');
    await expect(page.getByTestId('rail.next')).not.toContainText('was set to start in', { timeout: 45_000 });
    await expect(page.getByTestId('rail.next')).toContainText('Next: check it lasts, then lock it when it is right.');
    const text = await page.locator('#app').innerText();
    expect(text).not.toMatch(/\bplan year\b|\byear \d\b|\brun[\s-]?up\b|\bbridge\b/i);
    const widths = await page.evaluate(() => ({ doc: document.documentElement.scrollWidth, win: window.innerWidth }));
    expect(widths.doc, 'no sideways scroll').toBeLessThanOrEqual(widths.win + 1);
  });
});
