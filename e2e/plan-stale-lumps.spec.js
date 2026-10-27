/**
 * Road step 11b's rows on the existing steps, without an account (research/v7/road-to-7.md step 11b), on the PUBLISHED build.
 * Two plans are planted in the window: a draft whose start year has passed (corpus 02, "Alex's draft", set to start last tax
 * year) and the lumpy plan (corpus 12, "Sam's plan": a saved State Pension date in the planner's own words, two lump sums).
 *   - "About you and when": the out-of-date draft's offer in the Node reading's words; "Leave it" writes ONE plan equal to the
 *     Node patch (the planner's own key), Undo byte for byte; "Update it" sets the boxes and saves the Node patch (the start
 *     moved to this tax year), the offer then gone;
 *   - "Money that comes in anyway": the date box holds the saved text; a new date typed and saved writes the Node patch (the
 *     day, to the Stress key and the Decision tool's copy), Undo byte for byte; where each lump sum lands is the Node reading;
 *   - "What you spend": the lump sum's line is the Node reading; "Add … a year from age …" moves the cards (nothing written);
 *     Save writes the Node patch (the steps the planner's own spendLumpSum makes); the budget's button links into the preview.
 * No figure in any address; no sideways scroll; none of the planner's words. Firebase is never reached.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test, expect, PROD, REPO, FIXED_NOW } from './helpers/app.js';
import { rows11bInNode } from './helpers/rows11bInNode.js';
import { ABOUT_WRITES, INCOME_WRITES, SPEND_WRITES } from '../src/answers/plan/schema.js';
import { applyPatch } from '../src/answers/plan/about.js';
import { taxYearStartOf } from '../src/services/PlanTiming.js';

test.use({ outside: 'block' });

const GUEST_KEY = 'pt_guest_scenarios';
const v7 = (hash) => PROD + '/v7/' + hash;
const TODAY = FIXED_NOW.slice(0, 10);
const BANNED = /\bstrategy\b|\bscenario\b|\bwizard\b|\(in the planner\)|Monte Carlo|\bMC\b|about £|\bnet\b|\bgross\b/i;   // the window warning names the planner by design; a step's own hand-over wording "(in the planner)" is gone

function plans() {
  const [y, m, d] = TODAY.split('-').map(Number);
  const thisTY = taxYearStartOf(new Date(y, m - 1, d, 12));
  const alex = JSON.parse(readFileSync(join(REPO, 'tests', 'fixtures', 'plans', '02-pnv-draft.json'), 'utf8'));
  const sam = JSON.parse(readFileSync(join(REPO, 'tests', 'fixtures', 'plans', '12-lumpy-db-gia.json'), 'utf8'));
  alex.id = 'StaleDraft01'; alex.planDetails.name = 'Alex’s draft'; alex.isActive = true; delete alex.household;
  alex.stressTool.settings.firstTaxYear = thisTY - 1; alex.stressTool.settings.retired = true; delete alex.stressTool.settings.staleDraftDismissedFor;
  sam.id = 'LumpyPlan02'; sam.planDetails.name = 'Sam’s plan'; sam.isActive = false; delete sam.household;
  return { alex, sam, thisTY };
}
function stripped(plan, paths) {
  const out = JSON.parse(JSON.stringify(plan));
  for (const path of [...paths, 'lastModified']) { const parts = path.split('.'); let o = out; for (let i = 0; i < parts.length - 1 && o; i++) o = o[parts[i]]; if (o) delete o[parts[parts.length - 1]]; }
  return JSON.stringify(out);
}
async function plant(page, list) {
  await page.clock.setFixedTime(new Date(FIXED_NOW));
  await page.goto(v7('#/'));
  await expect(page.locator('#app [data-screen]')).toBeVisible();
  await page.evaluate(([k, text]) => { sessionStorage.setItem(k, text); }, [GUEST_KEY, JSON.stringify(list)]);
  return JSON.stringify(list);
}
const stored = (page) => page.evaluate((k) => sessionStorage.getItem(k), GUEST_KEY);

test.describe('the out-of-date draft, the State Pension date and the lump sums, without an account', () => {
  test('"Leave it" and "Update it" write the Node patches; the date typed writes the Node patch; the lump sum into the steps writes the Node patch; Undo byte for byte', async ({ page, watch }) => {
    test.setTimeout(300_000);
    watch.allow(/^asked for a file that is not there: \/assets\/data\/(gilts|equity)\.json$/);
    const { alex, sam, thisTY } = plans();
    const planted = await plant(page, [alex, sam]);
    const stale = rows11bInNode(alex, TODAY, {});
    expect(stale.stale).not.toBe(null);
    expect(stale.stale.leave.ok).toBe(true);
    expect(stale.stale.update.ok).toBe(true);
    for (const k of [...Object.keys(stale.stale.leave.patch), ...Object.keys(stale.stale.update.patch)]) expect(ABOUT_WRITES).toContain(k);
    const lumpy = rows11bInNode(sam, TODAY, { spDate: '6 May 2035', lump: 1 });
    expect(lumpy.income.write.ok).toBe(true);
    expect(lumpy.spend.write.ok).toBe(true);
    for (const k of Object.keys(lumpy.income.write.patch)) expect(INCOME_WRITES).toContain(k);
    for (const k of Object.keys(lumpy.spend.write.patch)) expect(SPEND_WRITES).toContain(k);

    await test.step('the out-of-date draft: the offer in the Node reading\'s words; "Leave it" writes the planner\'s own key, the other plan byte-identical; Undo byte for byte', async () => {
      await page.goto(v7('#/plan/StaleDraft01/about'));
      await expect(page.locator('#app [data-screen]')).toHaveAttribute('data-screen', 'plan.about');
      const offer = page.getByTestId('plan.about.stale');
      await expect(offer).toBeVisible();
      await expect(offer).toContainText(`This plan was set to start in ${stale.stale.offer.yearSaved}, which has passed. Update it to start now (${stale.stale.offer.year})?`);
      expect(await stored(page), 'opening writes nothing').toBe(planted);
      await page.getByTestId('plan.about.stale.leave').click();
      await expect(page.locator('#app')).toContainText(`Left as it is, starting in ${stale.stale.offer.yearSaved}.`, { timeout: 60_000 });
      const after = JSON.parse(await stored(page));
      const before = JSON.parse(planted);
      expect(JSON.stringify(after[0])).toBe(JSON.stringify(applyPatch(before[0], { ...stale.stale.leave.patch, lastModified: FIXED_NOW })));
      expect(after[0].stressTool.settings.staleDraftDismissedFor).toBe(thisTY - 1);
      expect(JSON.stringify(after[1]), 'the other plan untouched').toBe(JSON.stringify(before[1]));
      await expect(page.getByTestId('plan.about.stale')).toHaveCount(0, { timeout: 60_000 });
      await page.getByTestId('plan.about.undo').click();
      await expect(page.locator('#app')).toContainText('Put back as it was.', { timeout: 60_000 });
      expect(await stored(page), 'Undo puts the text back byte for byte').toBe(planted);
      await expect(page.getByTestId('plan.about.stale')).toBeVisible({ timeout: 60_000 });
      const text = await page.locator('#app').innerText();
      expect(text).not.toMatch(BANNED);
      expect(new URL(page.url()).hash).toBe('#/plan/StaleDraft01/about');
    });

    await test.step('"Update it": the boxes set and saved — the start moved to this tax year, the plan stopped, the Node patch exactly; the offer gone; Undo byte for byte', async () => {
      await page.getByTestId('plan.about.toastClose').click();
      await page.getByTestId('plan.about.stale.update').click();
      await expect(page.locator('#app')).toContainText('Saved. Your plan now runs', { timeout: 60_000 });
      const after = JSON.parse(await stored(page));
      const before = JSON.parse(planted);
      expect(stripped(after[0], ABOUT_WRITES)).toBe(stripped(before[0], ABOUT_WRITES));
      expect(JSON.stringify(after[0])).toBe(JSON.stringify(applyPatch(before[0], { ...stale.stale.update.patch, lastModified: FIXED_NOW })));
      expect(after[0].stressTool.settings.firstTaxYear).toBe(thisTY);
      expect(after[0].stressTool.settings.retired).toBe(true);
      await expect(page.getByTestId('plan.about.stale')).toHaveCount(0, { timeout: 60_000 });
      await page.getByTestId('plan.about.undo').click();
      await expect(page.locator('#app')).toContainText('Put back as it was.', { timeout: 60_000 });
      expect(await stored(page)).toBe(planted);
    });

    await test.step('the State Pension date: the box holds the saved text; where each lump sum lands is the Node reading; a new date saved writes the Node patch (the day, both keys); Undo byte for byte', async () => {
      await page.goto(v7('#/plan/LumpyPlan02/income'));
      await expect(page.locator('#app [data-screen]')).toHaveAttribute('data-screen', 'plan.income');
      await expect(page.getByTestId('plan.income.spDate')).toHaveValue(lumpy.income.dateShown);
      expect(lumpy.income.dateShown).toBe(sam.stressTool.settings.spStartDate);
      for (const [i, landing] of lumpy.income.landings.entries()) await expect(page.getByTestId(`plan.income.lumps.landing.${i}`)).toHaveAttribute('data-landing', landing.id);
      await expect(page.getByTestId('plan.income.lumps.landing.1')).toContainText('into the ISA');
      await page.getByTestId('plan.income.spDate').fill('6 May 2035');
      await page.getByTestId('plan.income.save').click();
      await expect(page.locator('#app')).toContainText('Saved. State Pension:', { timeout: 60_000 });
      const after = JSON.parse(await stored(page));
      const before = JSON.parse(planted);
      expect(stripped(after[1], INCOME_WRITES)).toBe(stripped(before[1], INCOME_WRITES));
      expect(JSON.stringify(after[1])).toBe(JSON.stringify(applyPatch(before[1], { ...lumpy.income.write.patch, lastModified: FIXED_NOW })));
      expect(after[1].stressTool.settings.spStartDate).toBe('2035-05-06');
      expect(after[1].decisionTool.settings.spStartDate).toBe('2035-05-06');
      expect(JSON.stringify(after[0]), 'the other plan untouched').toBe(JSON.stringify(before[0]));
      await page.getByTestId('plan.income.undo').click();
      await expect(page.locator('#app')).toContainText('Put back as it was.', { timeout: 60_000 });
      expect(await stored(page)).toBe(planted);
      const text = await page.locator('#app').innerText();
      expect(text).not.toMatch(BANNED);
    });

    await test.step('"Turn a lump sum into income": the line as Node reads it; the press moves the cards and writes nothing; Save writes the Node patch; the budget button links into the preview', async () => {
      await page.goto(v7('#/plan/LumpyPlan02/spend'));
      await expect(page.locator('#app [data-screen]')).toHaveAttribute('data-screen', 'plan.spend');
      const L = lumpy.spend.line;
      const line = page.getByTestId(`plan.spend.lumps.${L.id}`);
      await expect(line).toHaveAttribute('data-per-year', String(L.perYearValue));
      await expect(line).toContainText(`${L.label}, ${L.amount} at age ${L.age}: ${L.perYear} a year more before tax over the ${L.years} years left`);
      await expect(page.getByTestId('plan.spend.budget.change')).toHaveAttribute('href', '#/plan/LumpyPlan02/budget');
      const cardsBefore = await page.locator('[data-card^="steps."]').count();
      await page.getByTestId(`plan.spend.lumps.${L.id}.add`).click();
      await expect(page.locator('[data-card^="steps."]')).toHaveCount(cardsBefore + (lumpy.spend.edits.some((e) => e.path === 'steps.ids') ? 1 : 0));
      expect(await stored(page), 'the press writes nothing').toBe(planted);
      await page.getByTestId('plan.spend.save').click();
      await expect(page.locator('#app')).toContainText('Saved. From age', { timeout: 60_000 });
      const after = JSON.parse(await stored(page));
      const before = JSON.parse(planted);
      expect(stripped(after[1], SPEND_WRITES)).toBe(stripped(before[1], SPEND_WRITES));
      expect(JSON.stringify(after[1])).toBe(JSON.stringify(applyPatch(before[1], { ...lumpy.spend.write.patch, lastModified: FIXED_NOW })));
      expect(after[1].stressTool.settings.incomeSteps.some((s) => s.fromAge === L.age)).toBe(true);
      expect(JSON.stringify(after[0]), 'the other plan untouched').toBe(JSON.stringify(before[0]));
      await page.getByTestId('plan.spend.undo').click();
      await expect(page.locator('#app')).toContainText('Put back as it was.', { timeout: 60_000 });
      expect(await stored(page)).toBe(planted);
      const widths = await page.evaluate(() => ({ doc: document.documentElement.scrollWidth, win: window.innerWidth }));
      expect(widths.doc, 'no sideways scroll').toBeLessThanOrEqual(widths.win);
      const text = await page.locator('#app').innerText();
      expect(text).not.toMatch(BANNED);
      expect(new URL(page.url()).hash).toBe('#/plan/LumpyPlan02/spend');
    });
  });
});
