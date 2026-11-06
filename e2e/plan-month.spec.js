/**
 * Month by month, without an account (research/v7/months-in-v7.md; 7.2.0), on the PUBLISHED build. Fictional plans planted in
 * the window (from the corpus's running plan, corpus 04): "Alex's plan", locked, with no tax year set up and nothing recorded;
 * "Sam's plan", locked, with April recorded and the months since missed. On #/plan/<id>/month:
 *   - Alex: the tax year is set up on the page (part-way through the year: income and tax so far asked), ONE write equal to the
 *     Node patch (month.js taxYearPatch) folded onto the planted text; then this month is recorded, ONE write equal to the Node
 *     patch; the plan's settings byte-identical throughout (a locked plan records months; its settings stay frozen).
 *   - Sam: the months missed since April are named; "Fill them in" ticks the fill; Record writes every month from May on, each
 *     marked as filled in later, equal to the Node patch; each month then shows as recorded (the chooser no longer lists it,
 *     the recent months show the marks); Undo puts the text back byte for byte.
 * No figure in any address; no sideways scroll; none of the planner's words. Firebase is never reached.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test, expect, PROD, REPO, FIXED_NOW, V7_PATH, WORKER_DATA_MISSING } from './helpers/app.js';
import { monthInNode } from './helpers/monthInNode.js';
import { applyPatch } from '../src/answers/plan/about.js';

test.use({ outside: 'block' });

const GUEST_KEY = 'pt_guest_scenarios';
const v7 = (hash) => PROD + V7_PATH + hash;
const TODAY = FIXED_NOW.slice(0, 10);
const T = 'plan.month';
const BANNED = /\bstrategy\b|\bscenario\b|\bdecision tool\b|\bwizard\b|\btabs?\b|\bnet\b|\bgross\b|\bequit(y|ies)\b|\bSIPP\b|\brecommend|Monte Carlo|about £/i;

function plans() {
  const base = JSON.parse(readFileSync(join(REPO, 'tests', 'fixtures', 'plans', '04-buckets-running.json'), 'utf8'));
  const alex = JSON.parse(JSON.stringify(base));
  alex.id = 'MonthPlan01'; alex.planDetails.name = 'Alex’s plan'; alex.isActive = true; delete alex.household;
  alex.decisionTool.history = []; alex.decisionTool.taxYears = {};
  const sam = JSON.parse(JSON.stringify(base));
  sam.id = 'MonthGaps02'; sam.planDetails.name = 'Sam’s plan'; sam.isActive = false; delete sam.household;
  sam.decisionTool.history = sam.decisionTool.history.filter((h) => h.date === '2026-04');
  return { alex, sam };
}
async function plant(page, list) {
  await page.clock.setFixedTime(new Date(FIXED_NOW));
  await page.goto(v7('#/'));
  await expect(page.locator('#app [data-screen]')).toBeVisible();
  await page.evaluate(([k, text]) => { sessionStorage.setItem(k, text); }, [GUEST_KEY, JSON.stringify(list)]);
  return JSON.stringify(list);
}
const stored = (page) => page.evaluate((k) => JSON.parse(sessionStorage.getItem(k)), GUEST_KEY);
const without = (plan) => { const { lastModified, ...rest } = plan; return JSON.stringify(rest); };
async function looks(page, hash) {
  const widths = await page.evaluate(() => ({ doc: document.documentElement.scrollWidth, win: window.innerWidth }));
  expect(widths.doc, 'no sideways scroll').toBeLessThanOrEqual(widths.win);
  expect(new URL(page.url()).hash).toBe(hash);
  const text = await page.locator('main').innerText();
  expect(text).not.toMatch(/undefined|NaN|\[object|\{\w+\}/);
  expect(text).not.toMatch(BANNED);
}

test.describe('Month by month, without an account', () => {
  test('a plan with no tax year: set it up on the page, then record this month; each write equals Node\'s; the locked plan\'s settings unchanged', async ({ page, watch }) => {
    test.setTimeout(240_000);
    watch.allow(WORKER_DATA_MISSING);
    const { alex, sam } = plans();
    await plant(page, [alex, sam]);
    const setUpTyped = { 'mo.month': '2026-09', 'ty.toDate': '15000', 'ty.taxToDate': '1200' };
    const nodeSetUp = monthInNode(alex, TODAY, setUpTyped);
    expect(nodeSetUp.taxYear.ok).toBe(true);

    await test.step('the step: September, its tax year not set up; the set-up asks what came in so far; what reaches the bank equals Node', async () => {
      await page.goto(v7('#/plan/MonthPlan01/month'));
      await expect(page.locator('#app [data-screen]')).toHaveAttribute('data-screen', 'plan.month');
      await expect(page.getByTestId('plan.step.month')).toHaveText('Month by month');
      await expect(page.getByTestId(`${T}.setUp`)).toHaveAttribute('data-year', '26/27');
      await expect(page.getByTestId(`${T}.submit`)).toHaveCount(0);
      await page.getByTestId('plan.month.ty.toDate').fill('15000');
      await page.getByTestId('plan.month.ty.toDate').blur();
      await page.getByTestId('plan.month.ty.taxToDate').fill('1200');
      await page.getByTestId('plan.month.ty.taxToDate').blur();
      await expect(page.getByTestId(`${T}.setUp.bankAfter`)).toHaveText(nodeSetUp.view.bankAfter);
      await looks(page, '#/plan/MonthPlan01/month');
    });

    await test.step('"Set up 2026/27": ONE plan written, equal to the Node patch folded onto the planted plan; the other plan and the settings untouched', async () => {
      await page.getByTestId(`${T}.setUp.submit`).click();
      await expect(page.getByTestId(`${T}.toast`)).toHaveAttribute('data-kind', 'saved');
      const list = await stored(page);
      expect(without(list[0])).toBe(without(applyPatch(alex, nodeSetUp.taxYear.patch)));
      expect(JSON.stringify(list[1])).toBe(JSON.stringify(sam));
      expect(JSON.stringify(list[0].decisionTool.settings)).toBe(JSON.stringify(alex.decisionTool.settings));
      expect(JSON.stringify(list[0].stressTool)).toBe(JSON.stringify(alex.stressTool));
    });

    await test.step('then this month: what to draw equals Node; Record writes the Node patch; the settings still byte-identical', async () => {
      const after = (await stored(page))[0];
      const pots = { 'mo.total': '590000', 'mo.cash': '48000', 'mo.bonds': '150000' };
      const node = monthInNode(after, TODAY, { 'mo.month': '2026-09', ...pots }, FIXED_NOW);
      expect(node.record.ok).toBe(true);
      await expect(page.getByTestId(`${T}.setUp`)).toHaveCount(0);
      for (const [path, v] of Object.entries(pots)) { await page.getByTestId(`plan.month.${path}`).fill(v); await page.getByTestId(`plan.month.${path}`).blur(); }
      await expect(page.getByTestId(`${T}.pension`)).toHaveText(node.view.advice.pension);
      await expect(page.getByTestId(`${T}.afterTax`)).toHaveText(node.view.advice.afterTax);
      await expect(page.getByTestId(`${T}.submit`)).toHaveText('Record September 2026');
      await page.getByTestId(`${T}.submit`).click();
      await expect(page.getByTestId(`${T}.toast`)).toContainText('September 2026 recorded.');
      const list = await stored(page);
      expect(without(list[0])).toBe(without(applyPatch(after, node.record.patch)));
      expect(list[0].decisionTool.history.map((h) => h.date)).toEqual(['2026-09']);
      expect(JSON.stringify(list[0].decisionTool.settings)).toBe(JSON.stringify(alex.decisionTool.settings));
      expect(JSON.stringify(list[0].stressTool)).toBe(JSON.stringify(alex.stressTool));
      await looks(page, '#/plan/MonthPlan01/month');
    });
  });

  test('months missed since April: fill them in at once, each recorded and marked; Undo byte for byte', async ({ page, watch }) => {
    test.setTimeout(240_000);
    watch.allow(WORKER_DATA_MISSING);
    const { alex, sam } = plans();
    const planted = await plant(page, [alex, sam]);
    const typed = { 'mo.month': '2026-09', 'mo.from': '2026-05', 'mo.fill': 'yes' };
    const node = monthInNode(sam, TODAY, typed, FIXED_NOW);
    expect(node.record.ok).toBe(true);
    expect(node.view.offer.count).toBe(4);

    await test.step('the months not recorded are named at the top', async () => {
      await page.goto(v7('#/plan/MonthGaps02/month'));
      await expect(page.getByTestId(`${T}.gap`)).toHaveAttribute('data-count', '4');
      await expect(page.getByTestId(`${T}.gap`)).toContainText('May 2026 to August 2026');
      await expect(page.getByTestId(`${T}.prefilled`)).toContainText('April 2026');
      await looks(page, '#/plan/MonthGaps02/month');
    });

    await test.step('"Fill them in": the fill ticked, its months named on Record; what to draw equals Node', async () => {
      await page.getByTestId(`${T}.gap.fill`).click();
      await expect(page.getByTestId(`${T}.submit`)).toHaveText('Record September 2026 and fill in 4 months');
      await expect(page.getByTestId(`${T}.pension`)).toHaveText(node.view.advice.pension);
    });

    await test.step('Record: ONE plan written, equal to the Node patch; May to September recorded, the four filled in marked', async () => {
      await page.getByTestId(`${T}.submit`).click();
      await expect(page.getByTestId(`${T}.toast`)).toContainText('with 4 months filled in');
      const list = await stored(page);
      expect(without(list[1])).toBe(without(applyPatch(sam, node.record.patch)));
      expect(JSON.stringify(list[0])).toBe(JSON.stringify(alex));
      const hist = list[1].decisionTool.history;
      expect(hist.map((h) => h.date)).toEqual(['2026-04', '2026-05', '2026-06', '2026-07', '2026-08', '2026-09']);
      expect(hist.filter((h) => h.filledIn === true).map((h) => h.date)).toEqual(['2026-05', '2026-06', '2026-07', '2026-08']);
      expect(JSON.stringify(list[1].decisionTool.settings)).toBe(JSON.stringify(sam.decisionTool.settings));
      // each month shows as recorded: no longer offered, the recent months marked
      await expect(page.getByTestId(`${T}.gap`)).toHaveCount(0);
      const offered = await page.getByTestId('plan.month.mo.month').locator('option').evaluateAll((os) => os.map((o) => o.value));
      for (const m of ['2026-05', '2026-06', '2026-07', '2026-08', '2026-09']) expect(offered).not.toContain(m);
      await expect(page.getByTestId(`${T}.recent`).locator('[data-filled="1"]')).toHaveCount(2);
      await looks(page, '#/plan/MonthGaps02/month');
    });

    await test.step('Undo: the text back byte for byte', async () => {
      await page.getByTestId(`${T}.undo`).click();
      await expect(page.getByTestId(`${T}.toast`)).toHaveAttribute('data-kind', 'undone');
      const back = await stored(page);
      expect(without(back[1])).toBe(without(JSON.parse(planted)[1]));
    });
  });
});
