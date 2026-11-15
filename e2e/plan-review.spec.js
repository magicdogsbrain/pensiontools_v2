/**
 * "Your review" (7.10.0; spec-7100 §4, §9 "e2e at 1440 and 390"; research/v7/replan-nov-2026.md §6.3), without an account,
 * on the PUBLISHED build, at the fixed clock (30 September 2026). Fictional corpus plans, planted in this window:
 *
 *  - Moving (Alex, corpus 19, back at work and inside the move window, what is held recorded): the page says the months left
 *    and each bucket against the mix the plan moves to; opening writes nothing and runs nothing; "Test with what I hold"
 *    runs the plan as it stands and what is held within the review's budget (1.5 s a row × the slowdown); "I accept this as
 *    my plan" asks first, then "Yes, this is my plan" is ONE write (the phases, the agreement entry and the stamp: the
 *    settings, the record and the plan document byte-identical); the home says it was accepted, with nothing due; "Withdraw
 *    this" is ONE write that takes off the agreement and only its own entry.
 *  - Living on it, locked (Sam, corpus 04, what is held recorded): the boxes start from September's record; what is held
 *    against the plan's mix; "Test with what I hold" works out the chance from today on the pots entered, in the plan's own
 *    mix and as held, within budget; "Save this review" is ONE write of the phases and the stamp, its entry holding what
 *    was entered and the reading; the toast says the next review; "I accept this as my plan" is ONE write of the phases,
 *    the agreement entry and the stamp.
 *  - Living on it, unlocked (Alex, corpus 02): the pots only, and "once the plan is locked"; saved as ONE write of the phases.
 * No sideways scroll; none of the banned words. Firebase is never reached.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test, expect, PROD, REPO, FIXED_NOW, V7_PATH, WORKER_DATA_MISSING, REVIEW_BUDGET, SLOWDOWN, record } from './helpers/app.js';

test.use({ outside: 'block' });

const GUEST_KEY = 'pt_guest_scenarios';
const T = 'plan.review';
const v7 = (hash) => PROD + V7_PATH + hash;
const BANNED = /\bstrategy\b|\bscenario\b|\btransition\b|\bportfolio\b|\bmedian\b|glide ?path|run-?up|you should|\brecommend|will last|\bsafe\b|Monte Carlo|percentile|\bper month\b/i;
const load = (f) => JSON.parse(readFileSync(join(REPO, 'tests', 'fixtures', 'plans', f), 'utf8'));
const planted = (f, id, name) => { const p = load(f); p.id = id; p.planDetails = { ...(p.planDetails || {}), name }; delete p.household; p.isActive = true; return p; };
const stored = async (page) => JSON.parse(await page.evaluate((k) => sessionStorage.getItem(k), GUEST_KEY));
/** The keys of a plan whose value differs between two readings of the window's store. */
const changed = (a, b) => [...new Set([...Object.keys(a), ...Object.keys(b)])].filter((k) => JSON.stringify(a[k]) !== JSON.stringify(b[k])).sort();
const noSideways = async (page) => { const w = await page.evaluate(() => ({ doc: document.documentElement.scrollWidth, win: window.innerWidth })); expect(w.doc, 'no sideways scroll').toBeLessThanOrEqual(w.win); };

async function plant(page, plans) {
  await page.clock.setFixedTime(new Date(FIXED_NOW));
  await page.goto(v7('#/'));
  await expect(page.locator('#app [data-screen]')).toBeVisible();
  const text = JSON.stringify(plans);
  await page.evaluate(([k, t]) => { sessionStorage.setItem(k, t); }, [GUEST_KEY, text]);
  return text;
}

async function words(page) {
  const text = await page.locator('#app').innerText();
  expect(text).not.toMatch(/undefined|NaN|\[object|\{\w+\}/);
  expect(text).not.toMatch(BANNED);
}

test.describe('"Your review", without an account', () => {
  test('Moving: the buckets and the months left; the test within budget; "I accept this as my plan" one write; the home says it; Withdraw one write', async ({ page, watch }, info) => {
    test.setTimeout(240_000);
    watch.allow(WORKER_DATA_MISSING);
    const ID = 'ReviewMoving19';
    const before = await plant(page, [planted('19-back-to-work-saving.json', ID, 'Alex’s plan')]);
    const was = JSON.parse(before)[0];

    await test.step('opening: Moving, the months left and each bucket; nothing run, nothing written', async () => {
      await page.goto(v7('#/plan/' + ID + '/review'));
      await expect(page.getByTestId('plan.step.review')).toHaveAttribute('data-phase', 'moving', { timeout: 60_000 });
      await expect(page.getByTestId('plan.step.review')).toHaveText('Your review');
      await expect(page.getByTestId(`${T}.moving.lead`)).toContainText(/^You are in your move window: \d+ months? left, to [A-Z][a-z]+ \d{4}\./);
      const buckets = page.getByTestId(`${T}.moving.buckets`).locator('li');
      expect(await buckets.count()).toBeGreaterThan(0);
      for (const t of await buckets.allInnerTexts()) expect(t).toMatch(/^(Shares|Bonds|Cash|Other investments): \d+% of your pension now; your plan moves to \d+%\.$/);
      await expect(page.getByTestId(`${T}.run`)).toHaveAttribute('data-status', 'idle');
      await expect(page.getByTestId(`${T}.run.button`)).toHaveText('Test with what I hold');
      await expect(page.getByTestId(`${T}.agreement.accept`)).toHaveCount(0);
      await words(page);
      await noSideways(page);
      expect(JSON.stringify(await stored(page)), 'opening writes nothing').toBe(before);
    });

    await test.step('"Test with what I hold": as planned and what is held, within the review\'s budget; nothing written', async () => {
      const t0 = Date.now();
      await page.getByTestId(`${T}.run.button`).click();
      await expect(page.getByTestId(`${T}.run`)).toHaveAttribute('data-status', 'done', { timeout: 120_000 });
      const ms = Date.now() - t0;
      const rows = 2;
      record(info, `review/moving-${info.project.name}.json`, { ms, rows, slowdown: SLOWDOWN, budgetMs: REVIEW_BUDGET * rows, method: 'From the press to the result on the page: as planned, then what is held (one worker call each, the lazy engine loaded by the first); measured at full speed against 1.5 s × the slowdown a row.' });
      info.annotations.push({ type: 'review-moving-ms', description: `${ms} ms for ${rows} rows at full speed, against ${REVIEW_BUDGET * rows} ms` });
      expect(ms, 'each row within the review\'s budget').toBeLessThanOrEqual(REVIEW_BUDGET * rows);
      await expect(page.getByTestId(`${T}.run.result`)).toHaveAttribute('data-result', /^held/);
      await expect(page.getByTestId(`${T}.run.line`)).toContainText(/^With what you hold, /);
      await expect(page.getByTestId(`${T}.run.line`)).toContainText('(as planned');
      await words(page);
      expect(JSON.stringify(await stored(page)), 'testing writes nothing').toBe(before);
    });

    await test.step('"I accept this as my plan": the confirm first, then "Yes, this is my plan" is ONE write', async () => {
      await page.getByTestId(`${T}.agreement.accept`).click();
      const confirm = page.getByTestId(`${T}.agreement.confirm`);
      await expect(confirm).toContainText('You are saying you have moved what you intend to move');
      await expect(confirm).toContainText('It is not advice, and we have not judged whether the plan suits you.');
      expect(JSON.stringify(await stored(page)), 'the confirm writes nothing').toBe(before);
      await page.getByTestId(`${T}.agreement.yes`).click();
      await expect(page.getByTestId(`${T}.toast`)).toContainText('Saved: you accepted what you hold as your plan.', { timeout: 30_000 });
      const after = (await stored(page))[0];
      expect(changed(was, after), 'the phases, the agreements and the stamp only').toEqual(['lastModified', 'phases', 'planAmendments']);
      expect(after.phases.moving.agreed).toMatchObject({ strategyId: 'pots-and-valves', how: expect.stringMatching(/^(done|asHeld)$/) });
      expect(after.phases.moving.agreed.entryAt).toBe(after.planAmendments[after.planAmendments.length - 1].at);
      expect(after.planAmendments).toHaveLength((was.planAmendments || []).length + 1);
      expect(after.planAmendments[after.planAmendments.length - 1]).toMatchObject({ kind: 'asHeld', test: { id: 'whole' } });
      expect(after.phases.review.log).toHaveLength(1);
      expect(after.phases.review.log[0].reading.source).toBe('run');
      expect(after.phases.of).toBe(was.createdAt);
      await expect(page.getByTestId(`${T}.agreement`)).toHaveAttribute('data-status', 'agreed');
      await expect(page.getByTestId(`${T}.agreement.accepted`)).toContainText(/^On .+ you accepted what you held as your plan/);
    });

    await test.step('the home: "Moving.", the accepted line, nothing due; opening writes nothing', async () => {
      const now = JSON.stringify(await stored(page));
      await page.goto(v7('#/plan/' + ID));
      await expect(page.getByTestId('plan.home.headline')).toHaveText('Moving.', { timeout: 30_000 });
      await expect(page.getByTestId('plan.home.moveWindow')).toContainText(/^You accepted what you hold on .+\. You stop work in [A-Z][a-z]+ \d{4}\.$/);
      await expect(page.getByTestId('plan.home.todo').locator('.home-item')).toHaveCount(0);
      expect(JSON.stringify(await stored(page)), 'opening the home writes nothing').toBe(now);
    });

    await test.step('"Withdraw this": ONE write, the agreement and only its own entry gone', async () => {
      const agreed = (await stored(page))[0];
      await page.goto(v7('#/plan/' + ID + '/review'));
      await page.getByTestId(`${T}.agreement.withdraw`).click();
      await expect(page.getByTestId(`${T}.toast`)).toContainText('Withdrawn. The plan is read from its dates again.', { timeout: 30_000 });
      const after = (await stored(page))[0];
      // (the clock is fixed, so the stamp is written with the same moment as the agreement's)
      expect(changed(agreed, after)).toEqual(['phases', 'planAmendments']);
      expect(after.lastModified).toBe(FIXED_NOW);
      expect(after.phases.moving.agreed).toBeUndefined();
      expect(after.planAmendments || []).toEqual(was.planAmendments || []);
      expect(after.phases.review.log).toHaveLength(1);
      await words(page);
      await noSideways(page);
    });
  });

  test('Living on it, locked: the boxes from September\'s record; what is held tested from today within budget; "Save this review" one write of the phases; accepting what is held one write', async ({ page, watch }, info) => {
    test.setTimeout(240_000);
    watch.allow(WORKER_DATA_MISSING);
    const ID = 'ReviewLiving04';
    const before = await plant(page, [planted('04-buckets-running.json', ID, 'Sam’s plan')]);
    const was = JSON.parse(before)[0];

    await test.step('opening: Living on it, the boxes from the last month recorded, the band; nothing run, nothing written', async () => {
      await page.goto(v7('#/plan/' + ID + '/review'));
      await expect(page.getByTestId('plan.step.review')).toHaveAttribute('data-phase', 'drawing', { timeout: 60_000 });
      await expect(page.getByTestId(`${T}.often`)).toHaveText('Due once a tax year');
      await expect(page.getByTestId(`${T}.living`)).toHaveAttribute('data-locked', '1');
      await expect(page.getByTestId(`${T}.living.from`)).toContainText('September 2026');
      await expect(page.getByTestId(`${T}.rv.pension`)).not.toHaveValue('');
      await expect(page.getByTestId(`${T}.living.band`)).toBeVisible();
      for (const t of await page.getByTestId(`${T}.living.held.buckets`).locator('li').allInnerTexts()) expect(t).toMatch(/^(Shares|Bonds|Cash|Other investments): \d+% of your pension now; your plan’s mix has \d+%\.$/);
      await expect(page.getByTestId(`${T}.run`)).toHaveAttribute('data-status', 'idle');
      await expect(page.getByTestId(`${T}.run.button`)).toHaveText('Test with what I hold');
      await words(page);
      await noSideways(page);
      expect(JSON.stringify(await stored(page)), 'opening writes nothing').toBe(before);
    });

    await test.step('the pots and the income entered, "Keep to the plan"; "Test with what I hold" from today, within budget', async () => {
      await page.getByTestId(`${T}.rv.pension`).fill('540000');
      await page.getByTestId(`${T}.rv.took`).fill('16000');
      await page.getByTestId(`${T}.rv.choice.keep`).check();
      await expect(page.getByTestId(`${T}.living.taken`)).toBeVisible();
      const t0 = Date.now();
      await page.getByTestId(`${T}.run.button`).click();
      await expect(page.getByTestId(`${T}.run`)).toHaveAttribute('data-status', 'done', { timeout: 120_000 });
      const ms = Date.now() - t0;
      const rows = 2;
      record(info, `review/living-${info.project.name}.json`, { ms, rows, slowdown: SLOWDOWN, budgetMs: REVIEW_BUDGET * rows, method: 'From the press to the result: the plan from today on the pots entered, in its own mix and then as held (one worker call each, the lazy engine loaded by the first); measured at full speed against 1.5 s × the slowdown a row.' });
      info.annotations.push({ type: 'review-living-ms', description: `${ms} ms for ${rows} rows at full speed, against ${REVIEW_BUDGET * rows} ms` });
      expect(ms, 'each row within the review\'s budget').toBeLessThanOrEqual(REVIEW_BUDGET * rows);
      await expect(page.getByTestId(`${T}.run.line`)).toContainText('From today, on the pots you entered, with what you hold');
      await expect(page.getByTestId(`${T}.run.line`)).toContainText('(in your plan’s own mix');
      expect(JSON.stringify(await stored(page)), 'typing and working it out write nothing').toBe(before);
    });

    await test.step('"Save this review": ONE write of the phases and the stamp; the entry as entered, with the reading', async () => {
      await page.getByTestId(`${T}.save`).click();
      await expect(page.getByTestId(`${T}.toast`)).toContainText('Saved. Your next review is April 2027.', { timeout: 30_000 });
      const after = (await stored(page))[0];
      expect(changed(was, after), 'the phases and the stamp only').toEqual(['lastModified', 'phases']);
      const [entry] = after.phases.review.log;
      expect(entry).toMatchObject({ phase: 'drawing', choice: 'keep', took: 16000, entered: { pots: true, took: true } });
      expect(entry.pots.pension).toBe(540000);
      expect(entry.reading).toMatchObject({ source: 'run' });
      expect(typeof entry.reading.n).toBe('number');
      expect(after.phases.of).toBe(was.createdAt);
      expect(Object.keys(after.phases).sort()).toEqual(['of', 'review']);
      await words(page);
    });

    await test.step('after a reload: the next review is April 2027, no review due', async () => {
      await page.reload();
      await expect(page.getByTestId(`${T}.next`)).toHaveText('Your next review: April 2027.', { timeout: 60_000 });
      await expect(page.getByTestId(`${T}.last`)).toBeVisible();
    });

    await test.step('"Test with what I hold", then "I accept this as my plan": the confirm first, then ONE write of the phases, the agreement entry and the stamp', async () => {
      const saved = (await stored(page))[0];
      await page.getByTestId(`${T}.run.button`).click();
      await expect(page.getByTestId(`${T}.run`)).toHaveAttribute('data-status', 'done', { timeout: 120_000 });
      await page.getByTestId(`${T}.agreement.accept`).click();
      const confirm = page.getByTestId(`${T}.agreement.confirm`);
      await expect(confirm).toContainText('You are saying you have seen what the money does with what you hold now');
      await expect(confirm).not.toContainText('From the month you stop work');
      await page.getByTestId(`${T}.agreement.yes`).click();
      await expect(page.getByTestId(`${T}.toast`)).toContainText('Saved: you accepted what you hold as your plan.', { timeout: 30_000 });
      const after = (await stored(page))[0];
      // (the clock is fixed, so the stamp is written with the same moment as the review's save)
      expect(changed(saved, after), 'the phases and the agreements only').toEqual(['phases', 'planAmendments']);
      expect(after.lastModified).toBe(FIXED_NOW);
      expect(after.phases.moving.agreed).toMatchObject({ how: expect.stringMatching(/^(done|asHeld)$/) });
      for (const k of ['stressTool', 'planDocument', 'holdings', 'decisionTool']) expect(JSON.stringify(after[k]), k).toBe(JSON.stringify(was[k]));
      await words(page);
      await noSideways(page);
    });
  });

  test('Living on it, unlocked: the pots only, the band "once the plan is locked"; "Save this review" one write of the phases', async ({ page }) => {
    test.setTimeout(180_000);
    const ID = 'ReviewDraft02';
    const before = await plant(page, [planted('02-pnv-draft.json', ID, 'Alex’s plan')]);
    const was = JSON.parse(before)[0];
    await page.goto(v7('#/plan/' + ID + '/review'));
    await expect(page.getByTestId('plan.step.review')).toHaveAttribute('data-phase', 'drawing', { timeout: 60_000 });
    await expect(page.getByTestId(`${T}.living`)).toHaveAttribute('data-locked', '0');
    await expect(page.getByTestId(`${T}.living.unlocked`)).toHaveText('The band and the rate against the start show once the plan is locked.');
    await expect(page.getByTestId(`${T}.rv.took`)).toHaveCount(0);
    await expect(page.getByTestId(`${T}.rv.pension`)).toBeVisible();
    await expect(page.getByTestId(`${T}.living.band`)).toHaveCount(0);
    await words(page);
    await noSideways(page);
    expect(JSON.stringify(await stored(page)), 'opening writes nothing').toBe(before);
    await page.getByTestId(`${T}.rv.pension`).fill('410000');
    await page.getByTestId(`${T}.save`).click();
    await expect(page.getByTestId(`${T}.toast`)).toContainText('Saved. You can review your plan again whenever you like.', { timeout: 30_000 });
    const after = (await stored(page))[0];
    expect(changed(was, after)).toEqual(['lastModified', 'phases']);
    expect(after.phases.review.log[0]).toMatchObject({ phase: 'drawing', pots: { pension: 410000 }, entered: { pots: true, took: false }, reading: null, guardrail: null });
  });
});
