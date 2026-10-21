/**
 * "Your household", without an account (research/v7/road-to-7.md step 9; your-plan.md 6; v6-usability-audit.md 2.10), on the
 * PUBLISHED build. The couple fixtures (corpus 09 and 10, "Alex's plan" and "Sam's plan", linked both ways; Alex's pots four
 * times over and £70,000 a year so "Who draws what" applies, as gate 9 derives them) are planted in the window. On
 * #/plan/<id>/household: the partner's plan with its line and Open; "Check the two plans together" runs both plans each way in
 * the V7 worker and the pooled verdict's share, the rows and the split's pounds equal the same run in Node to the pound, the
 * cost said; the survivor question, asked in ages, runs and its headline equals Node; "Use this split", confirmed, writes BOTH
 * window plans equal to the Node patches (household.js splitPatches) folded onto the planted text, Undo byte for byte; "Share
 * this plan's budget", confirmed, writes the partner's plan equal to the Node write, Undo byte for byte; Unlink writes the
 * link off this plan only. No figure in any address; no sideways scroll; none of the planner's words. Firebase is never reached.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test, expect, PROD, REPO, FIXED_NOW } from './helpers/app.js';
import { householdInNode } from './helpers/householdInNode.js';
import { HOUSEHOLD_WRITES } from '../src/answers/plan/schema.js';
import { applyPatch } from '../src/answers/plan/about.js';
import { pctText, CHANCE_BARS } from '../src/services/OneAnswer.js';

test.use({ outside: 'block' });

const GUEST_KEY = 'pt_guest_scenarios';
const v7 = (hash) => PROD + '/v7/' + hash;
const TODAY = FIXED_NOW.slice(0, 10);

function couple() {
  const alex = JSON.parse(readFileSync(join(REPO, 'tests', 'fixtures', 'plans', '09-couple-a.json'), 'utf8'));
  const sam = JSON.parse(readFileSync(join(REPO, 'tests', 'fixtures', 'plans', '10-couple-b.json'), 'utf8'));
  alex.id = 'HhAlex01'; alex.planDetails.name = 'Alex’s plan'; alex.isActive = true; alex.household = { partnerScenarioId: 'HhSam02' };
  sam.id = 'HhSam02'; sam.planDetails.name = 'Sam’s plan'; sam.isActive = false; sam.household = { partnerScenarioId: 'HhAlex01' };
  const s = alex.stressTool.settings; s.equityMin *= 4; s.bondMin *= 4; s.cashTarget *= 4; s.baseSalary = 70000;
  return { alex, sam };
}
function stripped(plan, paths) {
  const out = JSON.parse(JSON.stringify(plan));
  for (const path of [...paths, 'lastModified']) { const parts = path.split('.'); let o = out; for (let i = 0; i < parts.length - 1 && o; i++) o = o[parts[i]]; if (o) delete o[parts[parts.length - 1]]; }
  return JSON.stringify(out);
}
async function plant(page, plans) {
  await page.clock.setFixedTime(new Date(FIXED_NOW));
  await page.goto(v7('#/'));
  await expect(page.locator('#app [data-screen]')).toBeVisible();
  await page.evaluate(([k, text]) => { sessionStorage.setItem(k, text); }, [GUEST_KEY, JSON.stringify(plans)]);
  return JSON.stringify(plans);
}
const stored = (page) => page.evaluate((k) => sessionStorage.getItem(k), GUEST_KEY);
const pounds = (n) => '£' + Math.round(n).toLocaleString('en-GB');
const BANNED = /\bstrategy\b|\bscenario\b|Monte Carlo|\bMC\b|\bp10\b|\bDB\b|years from now|today's money|survivor spends|\bmedian\b|about £/i;
const T = 'plan.household';

test.describe('"Your household", without an account', () => {
  test('the partner, the pooled verdict and the split equal Node to the pound; the survivor question in ages; "Use this split" writes both plans as Node patches them, Undo byte for byte; the budget shared and Undo; Unlink', async ({ page, watch }, testInfo) => {
    test.setTimeout(900_000);
    watch.allow(/^asked for a file that is not there: \/assets\/data\/(gilts|equity)\.json$/);
    const { alex, sam } = couple();
    const planted = await plant(page, [alex, sam]);
    const node = householdInNode(alex, sam, TODAY, { survivor: { who: 'a', atAge: 74, spendPct: 70, dbPct: 50 } });
    expect(node.pooled.ok).toBe(true);
    expect(node.pooled.split.applies).toBe(true);
    expect(node.split.mode).toBe('write');

    await test.step('the step: Sam\'s plan with its line, linked each way, Open; nothing run; the questions in ages at the planner\'s defaults; no sideways scroll; none of the planner\'s words', async () => {
      await page.goto(v7('#/plan/HhAlex01/household'));
      await expect(page.locator('#app [data-screen]')).toHaveAttribute('data-screen', 'plan.household');
      await expect(page.getByTestId('plan.step.household')).toHaveText('Your household');
      await expect(page.getByTestId(`${T}.with`)).toContainText('With ‘Sam’s plan’:');
      await expect(page.getByTestId(`${T}.openPartner`)).toHaveAttribute('href', '#/plan/HhSam02');
      await expect(page.getByTestId(`${T}.check`)).toHaveText('Check the two plans together');
      await expect(page.getByTestId(`${T}.survivor.atAge`)).toHaveValue(node.boxes['survivor.atAge']);
      await expect(page.getByTestId(`${T}.care.fromAge`)).toHaveValue(node.boxes['care.fromAge']);
      await expect(page.getByTestId(`${T}.care.cost`)).toHaveValue('90000');
      const widths = await page.evaluate(() => ({ doc: document.documentElement.scrollWidth, win: window.innerWidth }));
      expect(widths.doc, 'no sideways scroll').toBeLessThanOrEqual(widths.win);
      expect(new URL(page.url()).hash).toBe('#/plan/HhAlex01/household');
      const text = await page.locator('#app').innerText();
      expect(text).not.toMatch(/undefined|NaN|\[object/);
      expect(text).not.toMatch(BANNED);
      expect(await stored(page), 'opening writes nothing').toBe(planted);
    });

    await test.step('"Check the two plans together": run in the worker; the pooled share, each plan alone and the split\'s pounds equal Node; "Tried in 4 runs"', async () => {
      const t0 = Date.now();
      await page.getByTestId(`${T}.check`).click();
      const result = page.getByTestId(`${T}.result`);
      await expect(result).toBeVisible({ timeout: 300_000 });
      testInfo.annotations.push({ type: 'household-ms', description: `${Date.now() - t0} ms` });
      const c = node.pooled.own.combined;
      const pct = (share) => pctText(share * 100, 0, [...CHANCE_BARS, 70]).replace(/%$/, '');   // the page's own reading of a share (OneAnswer.pctText)
      await expect(page.locator(`[data-testid="${T}.rows"] tr[data-row="household"]`)).toHaveAttribute('data-pct', pct(c.pooled.success));
      await expect(page.locator(`[data-testid="${T}.rows"] tr[data-row="a"]`)).toHaveAttribute('data-pct', pct(c.successA));
      await expect(page.locator(`[data-testid="${T}.rows"] tr[data-row="b"]`)).toHaveAttribute('data-pct', pct(c.successB));
      await expect(page.locator(`[data-testid="${T}.rows"] tr[data-row="both"]`)).toHaveAttribute('data-pct', pct(c.jointSuccess));
      await expect(page.getByTestId(`${T}.ran`)).toHaveText(/^Tried in 4 runs \(\d+(\.\d)? s\)\.$/);
      const split = node.pooled.split;
      await expect(page.getByTestId(`${T}.split`)).toHaveAttribute('data-applies', '1');
      await expect(page.getByTestId(`${T}.split.headline`)).toHaveText(`Drawing together saves ${pounds(split.saving.year)} a year in tax — ${pounds(split.saving.until)} by the time Sam’s plan is ${split.untilAge}.`);
      await expect(page.locator(`[data-testid="${T}.split.table"] tr[data-row="taxYear"]`)).toContainText(pounds(split.tax.firstYear.together));
      const fig = node.pooled.fig;
      await expect(page.locator(`[data-testid="${T}.split.table"] tr[data-row="lasts"]`)).toContainText(fig.together.lasts.household.words);
      await expect(page.locator(`[data-testid="${T}.split.table"] tr[data-row="left"]`)).toContainText(pounds(fig.own.left90.p50) + ' / ' + pounds(fig.own.left90.p10));
      await expect(page.locator('[data-line="split.b"]')).toContainText(`${pounds(split.steps.b[0].amount)} a year before tax from ${split.steps.b[0].fromAge}`);
      await expect(page.getByTestId(`${T}.use`)).toHaveText('Use this split');
      const text = await page.locator('#app').innerText();
      expect(text).not.toMatch(BANNED);
      expect(await stored(page), 'the check writes nothing').toBe(planted);
    });

    await test.step('the survivor question, asked in ages: tried in the worker, the headline the Node run\'s; put away; nothing written', async () => {
      await page.getByTestId(`${T}.survivor.atAge`).fill('74');
      await page.getByTestId(`${T}.survivor.button`).click();
      const result = page.getByTestId(`${T}.survivor.result`);
      await expect(result).toBeVisible({ timeout: 300_000 });
      const sv = node.survivor;
      expect(sv.affordable).toBe(true);
      await expect(page.getByTestId(`${T}.survivor.headline`)).toContainText(`If Alex’s plan died at 74, Sam’s plan’s plan lasts ${sv.middling.a.outOfTen.words} with a middling inheritance, and ${sv.bad.a.outOfTen.words} with a bad-case one (the worst 1 in 10).`);
      await expect(page.locator('[data-line="survivor.inherit"]')).toContainText(pounds(sv.inherited.middling.total));
      await expect(page.getByTestId(`${T}.survivor.ran`)).toHaveText(/^Tried in 3 runs \(\d+(\.\d)? s\)\.$/);
      await page.getByTestId(`${T}.survivor.close`).click();
      await expect(result).toHaveCount(0);
      expect(await stored(page), 'a question writes nothing').toBe(planted);
    });

    await test.step('"Use this split", confirmed: BOTH window plans folded with the Node patches, nothing else touched; Undo puts the text back byte for byte', async () => {
      await page.getByTestId(`${T}.use`).click();
      const confirm = page.getByTestId(`${T}.useConfirm`);
      await expect(confirm).toBeVisible();
      await expect(confirm).toContainText('Write the split into both plans as their income shape?');
      await page.getByTestId(`${T}.useConfirm.yes`).click();
      const toast = page.getByTestId(`${T}.toast`);
      await expect(toast).toBeVisible({ timeout: 60_000 });
      await expect(toast).toContainText('Both plans now draw together');
      const after = JSON.parse(await stored(page));
      const before = JSON.parse(planted);
      expect(stripped(after[0], HOUSEHOLD_WRITES)).toBe(stripped(before[0], HOUSEHOLD_WRITES));
      expect(stripped(after[1], HOUSEHOLD_WRITES)).toBe(stripped(before[1], HOUSEHOLD_WRITES));
      expect(JSON.stringify(after[0])).toBe(JSON.stringify(applyPatch(before[0], { ...node.split.writes[0].patch, lastModified: FIXED_NOW })));
      expect(JSON.stringify(after[1])).toBe(JSON.stringify(applyPatch(before[1], { ...node.split.writes[1].patch, lastModified: FIXED_NOW })));
      expect(after[0].stressTool.settings.incomeShape).toBe('phases');
      expect(after[1].stressTool.settings.incomeSteps[0].amount).toBe(node.pooled.split.steps.b[0].amount);
      await page.getByTestId(`${T}.undo`).click();
      await expect(page.getByTestId(`${T}.toast`)).toContainText('Put back as it was.', { timeout: 60_000 });
      expect(await stored(page), 'Undo puts the text back byte for byte').toBe(planted);
    });

    await test.step('"Share this plan\'s budget", confirmed: the partner\'s plan written as Node writes it, this plan untouched; Undo byte for byte; then Unlink writes the link off this plan only', async () => {
      await page.getByTestId(`${T}.budget.share`).click();
      await expect(page.getByTestId(`${T}.budgetConfirm`)).toBeVisible();
      await page.getByTestId(`${T}.budgetConfirm.yes`).click();
      const toast = page.getByTestId(`${T}.toast`);
      await expect(toast).toBeVisible({ timeout: 60_000 });
      await expect(toast).toContainText('now reads this plan’s budget');
      const after = JSON.parse(await stored(page));
      const before = JSON.parse(planted);
      expect(JSON.stringify(after[0]), 'this plan untouched').toBe(JSON.stringify(before[0]));
      expect(JSON.stringify(after[1])).toBe(JSON.stringify(applyPatch(before[1], { ...node.share.patch, lastModified: FIXED_NOW })));
      expect(after[1].budgetTool.sharedFrom).toBe('HhAlex01');
      await expect(page.getByTestId(`${T}.budget`)).toHaveAttribute('data-shared', '1', { timeout: 60_000 });
      await page.getByTestId(`${T}.undo`).click();
      await expect(page.getByTestId(`${T}.toast`)).toContainText('Put back as it was.', { timeout: 60_000 });
      expect(await stored(page)).toBe(planted);
      await page.getByTestId(`${T}.unlink`).click();
      await page.getByTestId(`${T}.unlinkConfirm.yes`).click();
      await expect(page.getByTestId(`${T}.toast`)).toContainText('no longer linked', { timeout: 60_000 });
      const unlinked = JSON.parse(await stored(page));
      expect(unlinked[0].household.partnerScenarioId).toBe(null);
      expect(JSON.stringify(unlinked[1]), 'the partner\'s plan untouched').toBe(JSON.stringify(before[1]));
      // Sam's plan still points at Alex's, so the pair still shows, linked from their side
      await expect(page.getByTestId(`${T}.linkedBy`)).toHaveText('‘Sam’s plan’ points at this plan.', { timeout: 60_000 });
      const text = await page.locator('#app').innerText();
      expect(text).not.toMatch(BANNED);
      expect(new URL(page.url()).hash).toBe('#/plan/HhAlex01/household');
    });
  });
});
