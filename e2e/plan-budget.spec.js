/**
 * The budget on a saved plan, without an account (research/v7/road-to-7.md step 11b; budget-step.md), on the PUBLISHED
 * build. A plan with the planner's starter lines filled with the typical amounts (corpus 12, "Alex's plan", unlocked) and
 * the locked gilt ladder with the same (corpus 03, "Sam's plan") are planted in the window. On #/plan/<id>/budget: the totals
 * equal the Node reading; a sum typed into an amount box and left writes ONE plan equal to the Node patch (budget.js
 * budgetPatch: the whole budget as the planner's saveBudget writes it) folded onto the planted text, the other plan
 * byte-identical, Undo byte for byte; a line is named before it is added, and the add writes the Node patch; "Download it as
 * a spreadsheet" saves the planner's own file; on the LOCKED plan a line added still writes (the budget is outside the lock),
 * the plan's settings and document untouched. No figure in any address; no sideways scroll; none of the planner's words.
 * Firebase is never reached.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test, expect, PROD, REPO, FIXED_NOW } from './helpers/app.js';
import { budgetInNode } from './helpers/budgetInNode.js';
import { BUDGET_WRITES } from '../src/answers/plan/schema.js';
import { applyPatch } from '../src/answers/plan/about.js';
import { normalisedBudget } from '../src/answers/plan/budget.js';
import { budgetToSave, cleanBudgetForSave, fillTypicalAmounts, idMaker, resetBudgetLines, typicalMonthlyFor } from '../src/services/BudgetModel.js';
import { budgetCsvFileName } from '../src/v7/effects/download.js';

test.use({ outside: 'block' });

const GUEST_KEY = 'pt_guest_scenarios';
const v7 = (hash) => PROD + '/v7/' + hash;
const TODAY = FIXED_NOW.slice(0, 10);
const NOW = new Date(FIXED_NOW);
const BANNED = /\bstrategy\b|\bscenario\b|\bwizard\b|\btab\b|per month|\/mo\b|Monte Carlo|\bMC\b|about £|\bnet\b|\bgross\b/i;
const T = 'plan.budget';

/** The planner's starter lines with the typical amounts filled, one line far below typical, a one-off every few years and one once. */
function withBudget(raw) {
  const plan = JSON.parse(JSON.stringify(raw));
  const base = normalisedBudget(plan.budgetTool && plan.budgetTool.settings);
  let b = resetBudgetLines(base, idMaker(base));
  b = fillTypicalAmounts(b).budget;
  b.lines.find((l) => typicalMonthlyFor(l.label, b) != null).annual = 20;
  b.oneOffs[0].amount = 18000; b.oneOffs[0].atAge = 66;
  b.oneOffs[1].amount = 2500; b.oneOffs[1].atAge = 65; b.oneOffs[1].everyYears = null;
  plan.budgetTool = { ...(plan.budgetTool || {}), settings: budgetToSave(cleanBudgetForSave(b)) };
  return plan;
}
function plans() {
  const alex = withBudget(JSON.parse(readFileSync(join(REPO, 'tests', 'fixtures', 'plans', '12-lumpy-db-gia.json'), 'utf8')));
  const sam = withBudget(JSON.parse(readFileSync(join(REPO, 'tests', 'fixtures', 'plans', '03-gilt-ladder-runup.json'), 'utf8')));
  alex.id = 'BudgetPlan01'; alex.planDetails.name = 'Alex’s plan'; alex.isActive = true; delete alex.household;
  sam.id = 'BudgetLocked02'; sam.planDetails.name = 'Sam’s plan'; sam.isActive = false; delete sam.household;
  return { alex, sam };
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
const totalsLine = (t) => `${t.monthly} a month after tax (${t.yearly} a year), essentials ${t.essentials}.`;

test.describe('the budget on a saved plan, without an account', () => {
  test('the totals as Node reads them; a sum typed, a line named and added, each the Node patch, Undo byte for byte; the file is the planner\'s; the locked plan\'s budget still writes; no figure in the address', async ({ page, watch }) => {
    test.setTimeout(300_000);
    watch.allow(/^asked for a file that is not there: \/assets\/data\/(gilts|equity)\.json$/);
    const { alex, sam } = plans();
    const planted = await plant(page, [alex, sam]);
    const low = alex.budgetTool.settings.lines.find((l) => l.annual === 20);
    const node = budgetInNode(alex, TODAY, { changes: [{ kind: 'line', id: low.id, field: 'amount', value: 2400 }, { kind: 'add', tier: 'essential', label: 'Allotment' }] });
    expect(node.changes.every((c) => c.ok && c.writes.length === 1)).toBe(true);
    for (const c of node.changes) for (const k of Object.keys(c.writes[0].patch)) expect(BUDGET_WRITES).toContain(k);

    await test.step('the step: the totals the Node reading says, the lines in two groups, the nudge; nothing written on opening; no sideways scroll; none of the planner\'s words', async () => {
      await page.goto(v7('#/plan/BudgetPlan01/budget'));
      await expect(page.locator('#app [data-screen]')).toHaveAttribute('data-screen', 'plan.budget');
      await expect(page.getByTestId('plan.step.budget')).toHaveText('What you spend');
      await expect(page.getByTestId(`${T}.totals.line`)).toHaveText(totalsLine(node.budget.totals));
      await expect(page.locator('.budget-line')).toHaveCount(node.budget.count);
      await expect(page.getByTestId(`${T}.line.${low.id}.sanity`)).toContainText('looks low');
      await expect(page.getByTestId(`${T}.totals.singles`)).toBeVisible();
      await expect(page.getByTestId(`${T}.totals.recurring`)).toBeVisible();
      const widths = await page.evaluate(() => ({ doc: document.documentElement.scrollWidth, win: window.innerWidth }));
      expect(widths.doc, 'no sideways scroll').toBeLessThanOrEqual(widths.win);
      expect(new URL(page.url()).hash).toBe('#/plan/BudgetPlan01/budget');
      const text = await page.locator('#app').innerText();
      expect(text).not.toMatch(/undefined|NaN|\[object/);
      expect(text).not.toMatch(BANNED);
      expect(text).toContain('A guide beside your plan’s own figure');
      expect(await stored(page), 'opening writes nothing').toBe(planted);
    });

    await test.step('a sum typed into an amount box and left: ONE plan written equal to the Node patch (the whole budget, its totals worked out again), the other byte-identical; Undo byte for byte', async () => {
      const box = page.getByTestId(`${T}.line.${low.id}.amount`);
      await box.fill('=200*12');
      await box.press('Tab');
      const toast = page.getByTestId(`${T}.toast`);
      await expect(toast).toBeVisible({ timeout: 60_000 });
      await expect(toast).toContainText(`‘${low.label}’ changed`);
      const after = JSON.parse(await stored(page));
      const before = JSON.parse(planted);
      expect(stripped(after[0], BUDGET_WRITES)).toBe(stripped(before[0], BUDGET_WRITES));
      expect(JSON.stringify(after[0])).toBe(JSON.stringify(applyPatch(before[0], { ...node.changes[0].writes[0].patch, lastModified: FIXED_NOW })));
      expect(JSON.stringify(after[1]), 'the other plan untouched').toBe(JSON.stringify(before[1]));
      // the sum is in the line's own period (a month or a year), as the planner reads the box
      expect(after[0].budgetTool.settings.lines.find((l) => l.id === low.id).annual).toBe(2400 * (low.period === 'mo' ? 12 : 1));
      expect(after[0].budgetTool.settings.derived.allInComfortableMonthly).toBeGreaterThan(before[0].budgetTool.settings.derived.allInComfortableMonthly);
      await expect(box).toHaveValue('2400', { timeout: 60_000 });
      await page.getByTestId(`${T}.undo`).click();
      await expect(page.getByTestId(`${T}.toast`)).toContainText('Put back as it was.', { timeout: 60_000 });
      expect(await stored(page), 'Undo puts the text back byte for byte').toBe(planted);
      await expect(box).toHaveValue(low.period === 'mo' ? '2' : '20', { timeout: 60_000 });
    });

    await test.step('a new line is named first: the press with no name says so and writes nothing; named, the press writes the Node patch; Undo byte for byte', async () => {
      await page.getByTestId(`${T}.toastClose`).click();
      await page.getByTestId(`${T}.add.essential.press`).click();
      await expect(page.locator(`[data-error-for="${T}.add.essential"]`)).toHaveText('Give it a name first.');
      expect(await stored(page), 'no name, nothing written').toBe(planted);
      await page.getByTestId(`${T}.add.essential`).fill('Allotment');
      await page.getByTestId(`${T}.add.essential.press`).click();
      await expect(page.getByTestId(`${T}.toast`)).toContainText('‘Allotment’ added', { timeout: 60_000 });
      const after = JSON.parse(await stored(page));
      const before = JSON.parse(planted);
      expect(JSON.stringify(after[0])).toBe(JSON.stringify(applyPatch(before[0], { ...node.changes[1].writes[0].patch, lastModified: FIXED_NOW })));
      expect(after[0].budgetTool.settings.lines).toHaveLength(node.budget.count + 1);
      await expect(page.locator('.budget-line')).toHaveCount(node.budget.count + 1, { timeout: 60_000 });
      await expect(page.getByTestId(`${T}.add.essential`), 'the name box is empty again').toHaveValue('');
      await page.getByTestId(`${T}.undo`).click();
      await expect(page.getByTestId(`${T}.toast`)).toContainText('Put back as it was.', { timeout: 60_000 });
      expect(await stored(page)).toBe(planted);
      await expect(page.locator('.budget-line')).toHaveCount(node.budget.count, { timeout: 60_000 });
    });

    await test.step('"Download it as a spreadsheet": the file the browser saves is the planner\'s own, named as the planner names it; nothing written', async () => {
      await page.getByTestId(`${T}.toastClose`).click();
      const [download] = await Promise.all([page.waitForEvent('download'), page.getByTestId(`${T}.download`).click()]);
      expect(download.suggestedFilename()).toBe(budgetCsvFileName('Alex’s plan', NOW));
      const text = readFileSync(await download.path(), 'utf8');
      expect(text).toBe(node.budget.csvText);
      expect(text.startsWith('﻿Type,Section,Item')).toBe(true);
      expect(await stored(page)).toBe(planted);
    });

    await test.step('the locked plan: the budget is still the person\'s to change — a line added writes exactly the budget and the stamp; the settings, the document and its snapshot untouched', async () => {
      const locked = budgetInNode(sam, TODAY, { changes: [{ kind: 'add', tier: 'discretionary', label: 'Allotment' }] });
      expect(locked.budget.locked).toBe(true);
      expect(locked.changes[0].ok).toBe(true);
      await page.goto(v7('#/plan/BudgetLocked02/budget'));
      await expect(page.locator('#app [data-screen]')).toHaveAttribute('data-screen', 'plan.budget');
      await expect(page.getByTestId(`${T}.locked`)).toContainText('The budget is still yours to change');
      await page.getByTestId(`${T}.add.discretionary`).fill('Allotment');
      await page.getByTestId(`${T}.add.discretionary.press`).click();
      await expect(page.getByTestId(`${T}.toast`)).toContainText('‘Allotment’ added', { timeout: 60_000 });
      const after = JSON.parse(await stored(page));
      const before = JSON.parse(planted);
      expect(JSON.stringify(after[1])).toBe(JSON.stringify(applyPatch(before[1], { ...locked.changes[0].writes[0].patch, lastModified: FIXED_NOW })));
      expect(JSON.stringify(after[1].stressTool)).toBe(JSON.stringify(before[1].stressTool));
      expect(JSON.stringify(after[1].decisionTool)).toBe(JSON.stringify(before[1].decisionTool));
      expect(JSON.stringify(after[1].planDocument)).toBe(JSON.stringify(before[1].planDocument));
      expect(JSON.stringify(after[0]), 'the other plan untouched').toBe(JSON.stringify(before[0]));
      const text = await page.locator('#app').innerText();
      expect(text).not.toMatch(BANNED);
      expect(new URL(page.url()).hash).toBe('#/plan/BudgetLocked02/budget');
    });
  });
});
