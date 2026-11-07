/**
 * Move a locked plan's start (6.53.0; research/plan-start.md §7, browser case b), without an account. The PUBLISHED build:
 * the planner and the preview on one site, so this window's plans (sessionStorage pt_guest_scenarios) are seen by both.
 * The clock: 4 November 2026 (tax year 2026/27).
 *
 * The plan is the corpus's fixture 03 (Alex, fictional): a full index-linked gilt ladder locked on 1 July 2026 to start its
 * income in 2027/28, with months recorded in 2026/27 before that start, and nothing said about when work stopped.
 *  - The preview's "About you and when" asks "When did you stop work?" on the locked plan; the planner's Timing block asks
 *    the same, once. October 2023 is saved: the plan stays locked and its start is as it was.
 *    A month before 16 is refused first, with the reason. The line's buttons are drawn at their own height.
 *  - The preview then offers the move. The planner's own action, "Move the plan's start…" (opened by the hand-over): the
 *    confirm says exactly what changes; confirmed, ONE write moves both copies of the plan's first tax year to 2023/24, keeps
 *    the plan locked (no unlock counted), and writes the plan document and plan vs actual again, the earlier ones kept.
 *  - The History page reads the recorded months as months of the plan (Year 3, no ◌, no "before the plan's income
 *    starts"); plan vs actual compares them; the document says "Plan started" and the strip "Plan year 3 of 24"; a month
 *    worked out now says the cash pays until the ladder's first gilt.
 *
 * (c) The preview makes the same move itself (6.55.0), on its own "About you and when": the confirm on the page says what the
 * planner's says, line for line; "Keep it as it is" writes nothing; confirmed, the plan as moved runs in the V7 worker and ONE
 * write follows, equal to the same move worked out in Node (e2e/helpers/moveInNode.js) and to the planner's in every figure
 * (b) checks; the toast says it is done, with no Undo (the planner offers none); the move is not offered again.
 *
 * Firebase is never reached: every request outside the site is stopped (`outside: 'block'`).
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test, expect, PROD, REPO, V7_PATH, CLASSIC_PATH, WORKER_DATA_MISSING } from './helpers/app.js';
import { OPEN_PLACE_KEY, makeRequest } from '../src/services/OpenPlace.js';
import { moveInNode } from './helpers/moveInNode.js';

test.use({ outside: 'block' });

const GUEST_KEY = 'pt_guest_scenarios';
const PLAN_ID = 'MovePlan03';
const NOW = '2026-11-04T08:00:00.000Z';
const read = (name) => JSON.parse(readFileSync(join(REPO, 'tests', 'fixtures', 'plans', name + '.json'), 'utf8'));

/** Fixture 03, locked, two months recorded before its start, nothing said about when work stopped. */
function lockedPlan() {
  const p = read('20-locked-start-after-stop');
  p.id = PLAN_ID;
  p.planDetails.name = 'Alex’s ladder';
  p.isActive = true;
  delete p.stressTool.settings.stoppedWork;
  p.decisionTool.history = p.decisionTool.history.slice(0, 2);   // July and August 2026
  return p;
}
const storedPlan = (page) => page.evaluate(([k, id]) => JSON.parse(sessionStorage.getItem(k)).find((p) => p.id === id), [GUEST_KEY, PLAN_ID]);

test.describe('Move a locked plan\'s start, without an account', () => {
  test('(b) stopped in October 2023: asked once, then the start moved to 2023/24 under the lock; History, plan vs actual and the strip read it', async ({ page, watch }) => {
    test.setTimeout(360_000);
    watch.allow(WORKER_DATA_MISSING);
    await page.clock.setFixedTime(new Date(NOW));
    await page.goto(PROD + V7_PATH + '#/');
    await expect(page.locator('#app [data-screen]')).toBeVisible();
    await page.evaluate(([k, text]) => sessionStorage.setItem(k, text), [GUEST_KEY, JSON.stringify([lockedPlan()])]);

    // the preview: a locked plan's "About you and when" asks the month, and its only box is that one
    await page.goto(PROD + V7_PATH + '#/plan/' + PLAN_ID + '/about');
    await expect(page.locator('#app [data-screen]')).toHaveAttribute('data-screen', 'plan.about');
    const ask = page.getByTestId('plan.about.stopAsk');
    await expect(ask).toBeVisible({ timeout: 45_000 });
    await expect(ask).toContainText('When did you stop work?');
    await expect(page.getByTestId('plan.about.stopAsk.save')).toBeDisabled();

    // the planner, opened on the Timing block by the hand-over: the same question, once
    const request = makeRequest({ planId: PLAN_ID, place: 'about', back: '#/plan/' + PLAN_ID + '/about', at: NOW });
    await page.evaluate(([rk, req]) => sessionStorage.setItem(rk, req), [OPEN_PLACE_KEY, request]);
    await page.goto(PROD + CLASSIC_PATH);
    await expect(page.locator('#mainApp')).toBeVisible({ timeout: 45_000 });
    await expect(page.locator('#ssTimingBlock')).toBeVisible({ timeout: 45_000 });
    const line = page.locator('#tmLockedStart');
    await expect(line).toContainText('When did you stop work?', { timeout: 45_000 });
    await expect(page.locator('#tmStopMonth')).toBeDisabled();          // the form is frozen; the line is not
    await expect(page.locator('#tmStopWrap')).toBeHidden();             // and while the line asks, the form's own empty box is not shown: one box asks
    // the line's buttons are drawn at their own height, not stretched by the banner's text rule (a phone's bottom bar hid one)
    // (7.4.0: no "Leave it" while the start is later than this tax year — "I'm already drawing: start it this tax year" instead)
    expect((await page.locator('#tmLockedStopSave').boundingBox()).height).toBeLessThan(60);
    expect((await page.locator('#tmMoveNowBtn').boundingBox()).height, 'two lines at most on a phone').toBeLessThan(80);
    await expect(page.locator('#tmLockedStopLeave')).toHaveCount(0);
    // a month typed wrongly first (a stop before 16), refused with the reason; nothing written
    await page.locator('#tmLockedStopMonth').fill('1970-01');
    await page.locator('#tmLockedStopSave').click();
    await expect(page.locator('body')).toContainText('That is before you were 16: check the year.');
    expect((await storedPlan(page)).stressTool.settings.stoppedWork).toBeUndefined();
    await page.locator('#tmLockedStopMonth').fill('2023-10');
    await page.locator('#tmLockedStopSave').click();
    await expect(line).toContainText('You stopped work in October 2023, and your plan is set to start in 2027/28. Start it from 2023/24, the tax year you stopped', { timeout: 45_000 });   // 7.3.3
    await expect(line).toContainText('Your first income step keeps its amount and runs from 2023/24, at 62; your later steps keep their ages. The plan stays locked.');
    expect((await page.locator('#tmMoveStartBtn').boundingBox()).height).toBeLessThan(60);
    await expect(line).toContainText('Change the month you stopped work');   // a month typed wrongly stays changeable under the lock
    let stored = await storedPlan(page);
    expect(stored.stressTool.settings.stoppedWork).toBe('2023-10');
    expect(stored.stressTool.settings.firstTaxYear).toBe(2027);         // the month alone moves nothing
    expect(stored.decisionTool.settings).toMatchObject({ locked: true, firstTaxYear: 2027 });
    await expect(page.locator('#tmStopWrap')).toBeVisible();            // the month said: the frozen form shows it again
    await expect(page.locator('#tmStopMonth')).toHaveValue('2023-10');

    // the preview, once the month is said: the move is offered there (the preview's own move is case c)
    await page.goto(PROD + V7_PATH + '#/plan/' + PLAN_ID + '/about');
    await expect(page.locator('#app [data-screen]')).toHaveAttribute('data-screen', 'plan.about', { timeout: 45_000 });
    await expect(page.getByTestId('plan.about.moveStart')).toContainText('It can start from 2023/24, the tax year you stopped', { timeout: 45_000 });   // 7.3.3
    await expect(page.getByTestId('plan.about.stopAsk')).toHaveCount(0);
    // the planner's own action, on the Timing block, opened by the hand-over
    await page.evaluate(([rk, req]) => sessionStorage.setItem(rk, req), [OPEN_PLACE_KEY, makeRequest({ planId: PLAN_ID, place: 'about', back: '#/plan/' + PLAN_ID + '/about', at: NOW })]);
    await page.goto(PROD + CLASSIC_PATH);
    await expect(page.locator('#mainApp')).toBeVisible({ timeout: 45_000 });
    await expect(page.locator('#tmMoveStartBtn')).toBeVisible({ timeout: 45_000 });
    expect((await page.locator('#tmMoveStartBtn').boundingBox()).height).toBeLessThan(60);

    // the move: the confirm says what changes; confirmed, one write under the lock
    await page.locator('#tmMoveStartBtn').click();
    // the confirm (the planner's own appConfirm, as the unlock's)
    const confirm = page.locator('div', { has: page.locator('h3', { hasText: 'Move the plan\'s start to 2023/24?' }) }).last();
    await expect(confirm).toBeVisible();
    await expect(confirm).toContainText('Here is exactly what changes');
    await expect(confirm).toContainText('The plan stays locked');
    await expect(confirm).toContainText('2 recorded months (July 2026 to August 2026)');
    await expect(confirm).toContainText('the gilt ladder is bought from 2026/27 on');
    await expect(confirm).toContainText('Your State Pension still starts in 2028/29, as before');
    await expect(confirm).toContainText('on Monthly Entry');
    await page.getByRole('button', { name: 'Move the start to 2023/24', exact: true }).click();
    await expect(page.locator('#tmSummary')).toContainText('Plan started 6 April 2023 (tax year 2023/24); today is plan year 3 of 24.', { timeout: 120_000 });
    await expect(page.locator('#tmMoveStartBtn')).toHaveCount(0);          // no second move; the month can still be put right
    await expect(line).toContainText('Change the month you stopped work');
    await expect(line).not.toContainText('When did you stop work?');
    stored = await storedPlan(page);
    expect(stored.stressTool.settings).toMatchObject({ firstTaxYear: 2023, shapeAgeNow: 62, duration: 24, stoppedWork: '2023-10' });
    expect(stored.decisionTool.settings).toMatchObject({ locked: true, firstTaxYear: 2023, shapeAgeNow: 62, duration: 24, lockedPosition: { elapsedYears: 3, monthsIntoYear: 3 } });
    expect(stored.decisionTool.settings.unlockCount).toBeUndefined();
    expect(stored.decisionTool.settings.unlockedAt).toBeUndefined();
    expect(stored.planDocumentArchive.length).toBe(1);
    expect(stored.decisionTool.planOfRecordArchive.length).toBe(1);
    expect(stored.planDocument.pots.asOfPlanYear).toBe(3);
    expect('bridgeCash' in stored.planDocument.assumptions).toBe(false);   // 7.4.2: never written
    expect(stored.planDocument.strategy.r.plan.years[0].Y).toBe(2026);
    expect(stored.decisionTool.history.map((h) => [h.date, h.yearNum, h.bridgeYear ?? null])).toEqual([['2026-07', 3, null], ['2026-08', 3, null]]);
    expect(stored.stressTool.settings.strategyParams.cashYears).toBe(6);   // the ladder's first gilt keeps its tax year
    expect(stored.decisionTool.planOfRecord.rewrittenFor).toBe('start moved to 2023/24');
    expect(stored.journey.at(-1).label).toBe('The plan’s start moved to 2023/24, the tax year you stopped work');

    // History: the months are months of the plan, no ◌; plan vs actual compares them
    await page.evaluate(() => switchToTab('decision'));
    await page.evaluate(() => document.querySelector('.sub-tab[data-decisiontab="history"]').click());
    await expect(page.locator('#historyDetail')).toContainText('Tax Year 26/27 • Year 3', { timeout: 45_000 });
    const historyText = await page.locator('#decision-history').innerText();
    expect(historyText).not.toContain('◌');
    expect(historyText).not.toMatch(/recorded under previous settings|before the plan's income starts/i);
    const pva = page.locator('#planVsActual');
    await expect(pva).toContainText('Plan vs actual', { timeout: 45_000 });
    await expect(pva).toContainText('Year 3 (2 mo of the 9 months set up for this tax year)');   // its part year, never "a first year"
    expect(await pva.innerText()).not.toMatch(/before the plan|first year/i);
    await expect(pva).toContainText('written again on 4 November 2026, when the plan\'s start moved to 2023/24 (the plan was locked 1 July 2026');
    expect(await pva.innerText()).not.toMatch(/never moves/);

    // the document and the strip
    await page.evaluate(() => document.querySelector('.sub-tab[data-decisiontab="plandoc"]').click());
    await expect(page.locator('.pd-where')).toContainText(/Plan year 3 of 24 — tax year 2026\/27/, { timeout: 60_000 });
    const doc = await page.locator('.pd').innerText();
    expect(doc).toContain('Plan started');
    expect(doc).toContain('As written on 4 November 2026:');
    expect(doc).not.toContain('As written when the plan was locked');
    expect(await page.locator('.pd').textContent()).toContain('The plan’s start moved to 2023/24, the tax year you stopped work');   // the journey (folded): why it was written again

    // a month worked out now: the ladder's own timing — the cash pays until its first gilt
    await page.evaluate(() => document.querySelector('.sub-tab[data-decisiontab="entry"]').click());
    await expect(page.locator('#decision-entry')).toBeVisible({ timeout: 45_000 });
    await expect(page.locator('#entryMonth')).toHaveValue('2026-11');
    await page.locator('#entryPlatTotal').fill('600000');
    await page.locator('#entryPlatCash').fill('90000');
    await page.locator('#entryIsa').fill('35000');
    await page.locator('#decisionForm button[type="submit"]').click();
    await expect(page.locator('#decisionOutput')).toContainText('Your cash pays until the ladder\'s first gilt, from', { timeout: 60_000 });
    expect(await page.locator('#decisionOutput').innerText()).not.toMatch(/before the ladder's first year|until the first gilt pays|run[\s-]?up/i);

    const widths = await page.evaluate(() => ({ doc: document.documentElement.scrollWidth, win: window.innerWidth }));
    expect(widths.doc, 'no sideways scroll').toBeLessThanOrEqual(widths.win + 1);

    // back in the preview: no question, and the move is not offered again
    await page.goto(PROD + V7_PATH + '#/plan/' + PLAN_ID + '/about');
    await expect(page.locator('#app [data-screen]')).toHaveAttribute('data-screen', 'plan.about', { timeout: 45_000 });
    await expect(page.locator('[data-line="about.stoppedIn"]')).toHaveText('You stopped work in October 2023.', { timeout: 45_000 });
    await expect(page.getByTestId('plan.about.stopAsk')).toHaveCount(0);
    await expect(page.getByTestId('plan.about.moveStart')).toHaveCount(0);
  });

  test('(c) the preview\'s own move: the confirm on the page, one write under the lock equal to the move worked out in Node, no Undo', async ({ page, watch }) => {
    test.setTimeout(300_000);
    watch.allow(WORKER_DATA_MISSING);
    await page.clock.setFixedTime(new Date(NOW));
    await page.goto(PROD + V7_PATH + '#/');
    await expect(page.locator('#app [data-screen]')).toBeVisible();
    // the same plan, the month already said
    const planted = lockedPlan();
    planted.stressTool.settings.stoppedWork = '2023-10';
    const text = JSON.stringify([planted]);
    await page.evaluate(([k, t]) => sessionStorage.setItem(k, t), [GUEST_KEY, text]);
    await page.goto(PROD + V7_PATH + '#/plan/' + PLAN_ID + '/about');
    await expect(page.locator('#app [data-screen]')).toHaveAttribute('data-screen', 'plan.about');
    const offer = page.getByTestId('plan.about.moveStart');
    await expect(offer).toContainText('It can start from 2023/24, the tax year you stopped', { timeout: 45_000 });   // 7.3.3
    await expect(offer).toContainText('Before anything is written, this page says exactly what changes');
    await expect(page.getByTestId('plan.about.moveConfirm')).toHaveCount(0);
    const open = page.getByTestId('plan.about.moveStart.open');
    await expect(open).toHaveText('Move the plan’s start…');
    expect((await open.boundingBox()).height).toBeLessThan(60);

    // the confirm, on the page: what the planner's confirm says, line for line
    await open.click();
    const confirm = page.getByTestId('plan.about.moveConfirm');
    await expect(confirm).toBeVisible();
    await expect(confirm.locator('h3')).toHaveText('Move the plan’s start to 2023/24?');
    for (const words of [
      'Here is exactly what changes:',
      'The plan’s first tax year becomes 2023/24, the tax year you stopped work (October 2023); it was 2027/28. The plan stays locked: nothing is unlocked and no setting is added.',
      'Your income: the first step keeps its amount (£34,000 a year) and now runs from 2023/24, at 62; your later steps keep their ages.',
      '2 recorded months (July 2026 to August 2026) keep every figure you entered. They now count from the new start, 2023/24.',
      'the gilt ladder is bought from 2026/27 on',
      'Your State Pension still starts in 2028/29, as before',
      'Not affected: what you hold, what you spend, and the tax years you set up.'
    ]) await expect(confirm).toContainText(words);
    for (const id of ['plan.about.moveConfirm.yes', 'plan.about.moveConfirm.no']) expect((await page.getByTestId(id).boundingBox()).height, id).toBeLessThan(60);
    const widths = await page.evaluate(() => ({ doc: document.documentElement.scrollWidth, win: window.innerWidth }));
    expect(widths.doc, 'no sideways scroll').toBeLessThanOrEqual(widths.win + 1);
    const words = await page.locator('#app').innerText();
    expect(words).not.toMatch(/undefined|NaN|\[object|\{\w+\}/);
    // "Keep it as it is": the confirm goes, nothing is written
    await page.getByTestId('plan.about.moveConfirm.no').click();
    await expect(confirm).toHaveCount(0);
    expect(await page.evaluate((k) => sessionStorage.getItem(k), GUEST_KEY)).toBe(text);

    // confirmed: the plan as moved runs in the worker, then ONE write; the toast says it is done, with no Undo
    await open.click();
    await page.getByTestId('plan.about.moveConfirm.yes').click();
    const toast = page.getByTestId('plan.about.toast');
    await expect(toast).toContainText('The plan’s start is now 2023/24, the tax year you stopped work. The plan document and plan vs actual were written again; the earlier plan document is kept as a past version.', { timeout: 120_000 });
    await expect(page.getByTestId('plan.about.undo')).toHaveCount(0);
    const stored = await storedPlan(page);
    // the planner's move, in every figure case (b) checks
    expect(stored.stressTool.settings).toMatchObject({ firstTaxYear: 2023, shapeAgeNow: 62, duration: 24, stoppedWork: '2023-10' });
    expect(stored.decisionTool.settings).toMatchObject({ locked: true, firstTaxYear: 2023, shapeAgeNow: 62, duration: 24, lockedPosition: { elapsedYears: 3, monthsIntoYear: 3 } });
    expect(stored.decisionTool.settings.unlockCount).toBeUndefined();
    expect(stored.decisionTool.settings.unlockedAt).toBeUndefined();
    expect(stored.planDocumentArchive.length).toBe(1);
    expect(stored.decisionTool.planOfRecordArchive.length).toBe(1);
    expect(stored.planDocument.pots.asOfPlanYear).toBe(3);
    expect('bridgeCash' in stored.planDocument.assumptions).toBe(false);   // 7.4.2: never written
    expect(stored.planDocument.strategy.r.plan.years[0].Y).toBe(2026);
    expect(stored.decisionTool.history.map((h) => [h.date, h.yearNum, h.bridgeYear ?? null])).toEqual([['2026-07', 3, null], ['2026-08', 3, null]]);
    expect(stored.stressTool.settings.strategyParams.cashYears).toBe(6);
    expect(stored.decisionTool.planOfRecord.rewrittenFor).toBe('start moved to 2023/24');
    expect(stored.journey.at(-1).label).toBe('The plan’s start moved to 2023/24, the tax year you stopped work');
    // …and the same move worked out in Node, to the byte, path by path
    const node = moveInNode(planted, NOW.slice(0, 10), NOW);
    expect(node.ok, JSON.stringify(node.errors)).toBe(true);
    const at = (o, path) => path.split('.').reduce((x, k) => (x == null ? undefined : x[k]), o);
    for (const [path, v] of Object.entries(node.patch)) expect(JSON.stringify(at(stored, path)), path).toBe(JSON.stringify(v));

    // read again: the move is not offered a second time; the month stays changeable
    await expect(page.getByTestId('plan.about.moveStart')).toHaveCount(0, { timeout: 45_000 });
    await expect(page.getByTestId('plan.about.stopChange')).toBeVisible();
    await expect(page.locator('[data-line="about.stoppedIn"]')).toHaveText('You stopped work in October 2023.');
  });

  test('(d) no month said (7.4.0): "I\'m already drawing: start it this tax year", confirmed, ONE write under the lock; no month written', async ({ page, watch }) => {
    test.setTimeout(300_000);
    watch.allow(WORKER_DATA_MISSING);
    await page.clock.setFixedTime(new Date(NOW));
    await page.goto(PROD + V7_PATH + '#/');
    await expect(page.locator('#app [data-screen]')).toBeVisible();
    const planted = lockedPlan();
    planted.stressTool.settings.stopMonthLeft = true;   // "Leave it" said before: the plan is asked all the same while its start is later
    const text = JSON.stringify([planted]);
    await page.evaluate(([k, t]) => sessionStorage.setItem(k, t), [GUEST_KEY, text]);
    // the home: one thing to do, which says the plan can start this tax year
    await page.goto(PROD + V7_PATH + '#/plan/' + PLAN_ID);
    await expect(page.locator('[data-todo="start.ask"]')).toContainText('If you are already drawing, it can start this tax year instead.', { timeout: 45_000 });
    await page.goto(PROD + V7_PATH + '#/plan/' + PLAN_ID + '/about');
    await expect(page.getByTestId('plan.about.stopAsk')).toBeVisible({ timeout: 45_000 });
    await expect(page.getByTestId('plan.about.stopAsk.leave')).toHaveCount(0);
    const offer = page.getByTestId('plan.about.moveNow');
    await expect(offer).toContainText('Your plan is set to start in 2027/28. It can start this tax year, 2026/27, from where it stands today. The plan stays locked.');
    expect(await page.evaluate((k) => sessionStorage.getItem(k), GUEST_KEY)).toBe(text);   // read, nothing written
    await page.getByTestId('plan.about.moveNow.open').click();
    const confirm = page.getByTestId('plan.about.moveConfirm');
    await expect(confirm.locator('h3')).toHaveText('Move the plan’s start to 2026/27?');
    await expect(confirm).toContainText('The plan’s first tax year becomes 2026/27, this tax year; it was 2027/28. The plan stays locked: nothing is unlocked, and no month you stopped work is saved.');
    const widths = await page.evaluate(() => ({ doc: document.documentElement.scrollWidth, win: window.innerWidth }));
    expect(widths.doc, 'no sideways scroll').toBeLessThanOrEqual(widths.win + 1);
    expect(await page.locator('#app').innerText()).not.toMatch(/undefined|NaN|\[object|\{\w+\}/);
    expect(await page.locator('#app').innerText()).not.toMatch(/\brun[\s-]?up\b/i);
    await page.getByTestId('plan.about.moveConfirm.yes').click();
    await expect(page.getByTestId('plan.about.toast')).toContainText('The plan’s start is now 2026/27, this tax year.', { timeout: 120_000 });
    const stored = await storedPlan(page);
    expect(stored.stressTool.settings.firstTaxYear).toBe(2026);
    expect(stored.stressTool.settings.stoppedWork).toBeUndefined();
    expect(stored.decisionTool.settings).toMatchObject({ locked: true, firstTaxYear: 2026 });
    expect(stored.decisionTool.settings.unlockCount).toBeUndefined();
    expect(stored.journey.at(-1).label).toBe('The plan’s start moved to 2026/27, this tax year');
    // the same move worked out in Node, to the byte
    const node = moveInNode(planted, NOW.slice(0, 10), NOW, { thisYear: true });
    expect(node.ok, JSON.stringify(node.errors)).toBe(true);
    const at = (o, path) => path.split('.').reduce((x, k) => (x == null ? undefined : x[k]), o);
    for (const [path, v] of Object.entries(node.patch)) expect(JSON.stringify(at(stored, path)), path).toBe(JSON.stringify(v));
    // nothing more to move, and no to-do for the start
    await expect(page.getByTestId('plan.about.moveNow')).toHaveCount(0, { timeout: 45_000 });
    await page.goto(PROD + V7_PATH + '#/plan/' + PLAN_ID);
    await expect(page.getByTestId('plan.home')).toBeVisible({ timeout: 45_000 });
    await expect(page.locator('[data-todo^="start."]')).toHaveCount(0);
  });
});
