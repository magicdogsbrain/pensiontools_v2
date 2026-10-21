/**
 * The three levers of "Will it last?" on a saved plan's "Does it last?" (research/v7/answer-D.md 3.9; road-to-7.md step 7),
 * without an account, on the PUBLISHED build. A Pots & Valves draft (corpus 02, "Alex's plan") is planted in the window with
 * a locked gilt ladder (corpus 03). On #/plan/<id>/lasts, once the plan's own test is held: "What if shares fell by a fifth?"
 * and "Could I spend more?" on a press, "Would some work help?" with its two boxes — each tried in the V7 worker on a COPY
 * of the plan, its figures equal to the same lever worked out in Node to the pound, the cost said; put away, gone. The
 * stored plans are byte-identical throughout: a lever writes nothing. The locked plan: no box before a lever is opened,
 * the document's figure stays, and ONE comparison line once a lever is done — never a word of unlocking.
 *
 * Firebase is never reached: every request outside the site is stopped.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test, expect, PROD, REPO, FIXED_NOW } from './helpers/app.js';
import { leverInNode } from './helpers/leverInNode.js';

test.use({ outside: 'block' });

const GUEST_KEY = 'pt_guest_scenarios';
const v7 = (hash) => PROD + '/v7/' + hash;
const TODAY = FIXED_NOW.slice(0, 10);

function draftPlan() {
  const plan = JSON.parse(readFileSync(join(REPO, 'tests', 'fixtures', 'plans', '02-pnv-draft.json'), 'utf8'));
  plan.id = 'LeverPlan01';
  plan.planDetails.name = 'Alex’s plan';
  plan.isActive = true;
  delete plan.household;
  return plan;
}
function lockedPlan() {
  const plan = JSON.parse(readFileSync(join(REPO, 'tests', 'fixtures', 'plans', '03-gilt-ladder-runup.json'), 'utf8'));
  plan.id = 'LeverLocked02';
  plan.isActive = false;
  return plan;
}
async function plant(page, plans) {
  await page.clock.setFixedTime(new Date(FIXED_NOW));
  await page.goto(v7('#/'));
  await expect(page.locator('#app [data-screen]')).toBeVisible();
  await page.evaluate(([k, text]) => { sessionStorage.setItem(k, text); }, [GUEST_KEY, JSON.stringify(plans)]);
  return JSON.stringify(plans);
}
const stored = (page) => page.evaluate((k) => sessionStorage.getItem(k), GUEST_KEY);
async function awaitRun(page) {
  await expect(page.locator('[data-region="plan-lasts-answer"]')).toHaveAttribute('data-status', 'done', { timeout: 60_000 });
  await expect(page.locator('[data-region="plan-lasts-answer"]')).toHaveAttribute('data-fresh', '1');
}
/** The chance the lever's line says, as the number before "% of futures". */
const chanceOn = (text) => { const m = /([\d.]+)% of futures/.exec(text); return m ? Number(m[1]) : null; };
const tenth = (n) => Math.round(n * 10) / 10;

test.describe('the levers on "Does it last?", without an account', () => {
  test('shares fall, spend more, some work — each the Node run to the pound, nothing written; the locked plan\'s one comparison line', async ({ page, watch }, testInfo) => {
    test.setTimeout(420_000);
    watch.allow(/^asked for a file that is not there: \/assets\/data\/(gilts|equity)\.json$/);
    const plan = draftPlan();
    const locked = lockedPlan();
    const planted = await plant(page, [plan, locked]);
    await page.goto(v7('#/plan/LeverPlan01/lasts'));
    await expect(page.locator('#app [data-screen]')).toHaveAttribute('data-screen', 'plan.lasts');
    await awaitRun(page);
    const levers = page.getByTestId('plan.lasts.levers');
    await expect(levers).toBeVisible();
    await expect(levers).toContainText('Try a change');
    expect(await levers.locator('input').count(), 'no box until the work lever is opened').toBe(0);

    await test.step('"What if shares fell by a fifth?": one run; the Node figures to the pound', async () => {
      const t0 = Date.now();
      await page.getByTestId('plan.lasts.lever.fall').click();
      const result = page.getByTestId('plan.lasts.lever.fall.result');
      await expect(result).toBeVisible({ timeout: 60_000 });
      testInfo.annotations.push({ type: 'lever-fall-ms', description: `${Date.now() - t0} ms` });
      const node = leverInNode(plan, TODAY, { kind: 'fall' });
      expect(node.ok).toBe(true);
      const line = await result.locator('[data-line="lever.fall.line"]').innerText();
      expect(chanceOn(line)).toBe(tenth(node.at.chancePct));
      expect(line).toContain(`(the pots £${node.potBefore.toLocaleString('en-GB')} to £${node.potAfter.toLocaleString('en-GB')})`);
      expect(line).toContain(`typically £${Math.round(node.at.typicalLeft).toLocaleString('en-GB')} left`);
      await expect(result.locator('[data-line="lever.fall.how"]')).toContainText('The shares part of each pot cut by a fifth');
      expect(await stored(page), 'a lever writes nothing').toBe(planted);
    });

    await test.step('"Could I spend more?": the base run then the bounded search, the cost said; the Node figures to the pound', async () => {
      const t0 = Date.now();
      await page.getByTestId('plan.lasts.lever.spendMore').click();
      const result = page.getByTestId('plan.lasts.lever.spendMore.result');
      await expect(result).toBeVisible({ timeout: 90_000 });
      testInfo.annotations.push({ type: 'lever-spend-more-ms', description: `${Date.now() - t0} ms` });
      const node = leverInNode(plan, TODAY, { kind: 'spendMore' });
      expect(node.ok).toBe(true);
      expect(node.runs).toBeLessThanOrEqual(7);
      await expect(result.locator('[data-line="lever.runs"]')).toHaveText(`Tried in ${node.runs} run${node.runs === 1 ? '' : 's'} of the one test.`);
      const text = await result.innerText();
      if (node.perMonth > 0) {
        expect(text).toContain(`£${node.perMonth.toLocaleString('en-GB')} a month more would still last in 9 futures out of 10`);
        expect(chanceOn(text)).toBe(tenth(node.at.chancePct));
      } else expect(text).toMatch(/9 futures out of 10/);
      expect(await stored(page)).toBe(planted);
    });

    await test.step('"Would some work help?": the boxes open on a press, £15,000 for 3 years is tried; the Node figures; wrong figures are said', async () => {
      await page.getByTestId('plan.lasts.lever.work').click();
      await expect(page.getByTestId('plan.lasts.lever.work.yearly')).toBeVisible();
      await page.getByTestId('plan.lasts.lever.work.yearly').fill('15,000');
      await page.getByTestId('plan.lasts.lever.work.years').fill('9');
      await page.getByTestId('plan.lasts.lever.work.try').click();
      await expect(page.locator('[data-error-for="plan.lasts.lever.work.years"]')).toHaveText('Whole years, from 1 to 5.');
      await page.getByTestId('plan.lasts.lever.work.years').fill('3');
      const t0 = Date.now();
      await page.getByTestId('plan.lasts.lever.work.try').click();
      const result = page.getByTestId('plan.lasts.lever.work.result');
      await expect(result).toBeVisible({ timeout: 60_000 });
      testInfo.annotations.push({ type: 'lever-work-ms', description: `${Date.now() - t0} ms` });
      const node = leverInNode(plan, TODAY, { kind: 'work', yearly: 15000, years: 3 });
      expect(node.ok).toBe(true);
      const line = await result.locator('[data-line="lever.work.line"]').innerText();
      expect(line).toContain('With £15,000 a year from work for 3 years');
      expect(chanceOn(line)).toBe(tenth(node.at.chancePct));
      await expect(result.locator('[data-line="lever.work.how"]')).toContainText('the planner’s own extra incomes');
      expect(await stored(page)).toBe(planted);
      // put away: gone, and the boxes with it
      await page.getByTestId('plan.lasts.lever.work.close').click();
      await expect(result).toHaveCount(0);
      await expect(page.getByTestId('plan.lasts.lever.work.yearly')).toHaveCount(0);
      await page.getByTestId('plan.lasts.lever.fall.close').click();
      await expect(page.getByTestId('plan.lasts.lever.fall.result')).toHaveCount(0);
      const text = await page.locator('#app').innerText();
      expect(text).not.toMatch(/months? to go|years? to go|countdown/i);
      expect(text).not.toMatch(/undefined|NaN/);
    });

    await test.step('the locked plan: no box before a lever is opened; the document\'s figure stays; ONE comparison line, no word of unlocking in it', async () => {
      await page.goto(v7('#/plan/LeverLocked02/lasts'));
      await expect(page.getByTestId('plan.step.lasts')).toBeVisible();
      await awaitRun(page);
      expect(await page.locator('#app input, #app select, #app textarea').count()).toBe(0);
      await expect(page.getByTestId('plan.lasts.levers.locked')).toHaveCount(0);
      await page.getByTestId('plan.lasts.lever.fall').click();
      await expect(page.getByTestId('plan.lasts.lever.fall.result')).toBeVisible({ timeout: 60_000 });
      const compare = page.getByTestId('plan.lasts.levers.locked');
      await expect(compare).toHaveCount(1);
      await expect(compare).toContainText('The plan as locked on 1 July 2026 said');
      await expect(compare).toContainText('the same plan on a different day.');
      expect(await compare.innerText()).not.toMatch(/unlock|wrong/i);
      await expect(page.getByTestId('plan.lasts.document')).toBeVisible();
      await expect(page.getByTestId('plan.lasts.documentLine')).toHaveText('Worked out when the plan was locked on 1 July 2026.');
      expect(await stored(page), 'the locked plan is not touched').toBe(planted);
    });
  });
});
