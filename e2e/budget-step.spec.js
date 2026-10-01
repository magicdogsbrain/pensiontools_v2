/**
 * The budget step — "What would you spend?" (research/v7/budget-step.md), on the test build (the screen checks of
 * checkScreen run on every step):
 *   - A: the numbers, on to the budget step; line by line: the sheet, its total a month and a year, "Use £X a month"
 *     copies the total into the box — the only way it gets there; the answer is the answer for that figure (the
 *     engine's); the answer says the spending is the budget's total;
 *   - editing the budget afterwards never moves the figure: the draft and the answer stay; "your budget now adds up to
 *     … this uses …" says so, with "Use";
 *   - B: one figure, skipping the budget — the note once, "no budget yet" under the answer; the household's one sheet;
 *   - C, once a budget exists: what the careful amount gives against it;
 *   - the keyboard: the choice, the sheet's boxes (Enter in one never asks), the box, Enter asks;
 *   - no figure in any address.
 */
import { test, expect, v7, waitsFor, NEEDS, TEST, FINAL_ENV } from './helpers/app.js';
import { BUDGET } from '../src/v7/copy/budget.js';

const fill = (t, v) => t.replace(/\{(\w+)\}/g, (m, k) => (k in v ? v[k] : m));
const lineId = (page, label) => page.evaluate((l) => window.__pt.getState().budget.lines.find((x) => x.label === l).id, label);
const draftOf = (page, q) => page.evaluate((qq) => window.__pt.getState().draft[qq], q);
const addresses = (page) => { const seen = []; page.on('framenavigated', (f) => { if (f === page.mainFrame()) seen.push(f.url()); }); return seen; };
function noFigureIn(page, seen) {
  for (const u of [...seen, page.url()]) {
    const url = new URL(u);
    expect(url.search, u).toBe('');
    expect(/\d/.test(url.hash), `a figure in the address ${u}`).toBe(false);
  }
}

test.describe('the budget step', () => {
  test('A: line by line; "Use" is the one way in; later edits never move the figure', async ({ page }) => {
    waitsFor(...NEEDS.a);
    test.setTimeout(240_000);
    const seen = addresses(page);
    const app = v7(page, 'test', 'a');

    await app.step('the numbers step asks three things, then goes on to "What would you spend?"', async () => {
      await app.open('#/a/numbers');
      await app.ready();
      await app.fill({ 'you.age': '55', 'you.pot': '300000', 'stop.age': '60' });
      await expect(app.id('a.spend.amount')).toHaveCount(0);
      await app.click('a.action.onward');
      await app.at('a.spend');
      await expect(page.locator('#app h1')).toHaveText('What would you spend?');
      await expect(app.id('a.spend.skipNote')).toHaveCount(0);
    });

    await app.step('line by line: the sheet, with typical amounts shown and never filled in', async () => {
      await app.click('a.spendHow.lines');
      await expect(page.locator('#app [data-region="budget"]')).toBeVisible();
      for (const [label, amount] of [['Council tax', '150'], ['Groceries & household', '420'], ['Electricity', '75']]) {
        await app.type(`budget.${await lineId(page, label)}.amount`, amount);
      }
      const holiday = await lineId(page, 'Main holiday');
      await app.type(`budget.${holiday}.amount`, '2,400');
      await expect(app.id(`budget.${holiday}.period`)).toHaveValue('yr');
      await expect(app.id('budget.total')).toContainText(fill(BUDGET.sheet.total, { amount: '£845', yearly: '£10,140' }));
      await expect(app.id('a.spend.amount')).toHaveValue('');                         // the total is beside the box, never in it
      expect((await draftOf(page, 'a')).values['spend.amount']).toBeUndefined();
    });

    await app.step('"Use £845 a month": the total, typed into the box', async () => {
      await app.click('a.spend.use');
      await expect(app.id('a.spend.amount')).toHaveValue('845');
      app.typed['spend.amount'] = '845';
      await expect(app.id('a.spend.budget')).toContainText(BUDGET.spend.budgetSame);
    });

    let answer = null;
    await app.step('the answer is the answer for £845 a month — the engine\'s — and says it is the budget\'s total', async () => {
      await app.click('a.action.show');
      await app.at('a.answer');
      await app.ready(120_000);
      answer = app.engine({ ...FINAL_ENV, detail: 'chart' });
      expect(answer.spend.perMonth).toBe(845);
      await expect(app.id('a.spend.line')).toContainText(fill(BUDGET.answer.fromBudget, { amount: '£845' }));
    }, { answer: () => answer });

    await app.step('editing the budget afterwards never moves the figure: "your budget now adds up to … this uses …"', async () => {
      const key = await page.evaluate(() => window.__pt.getState().answers.a.inputsKey);
      await app.rail('spend');
      await app.id(`budget.${await lineId(page, 'Electricity')}.amount`).fill('150');     // £75 → £150 a month
      await expect(app.id('a.spend.amount')).toHaveValue('845');
      await expect(app.id('a.spend.budget')).toContainText(fill(BUDGET.spend.budgetNow, { amount: '£920', used: '£845' }));
      await app.rail('answer');
      await app.ready();
      expect(await page.evaluate(() => window.__pt.getState().answers.a.inputsKey)).toBe(key);   // never worked out again
      await expect(app.id('a.spend.line')).toContainText(fill(BUDGET.spend.budgetNow, { amount: '£920', used: '£845' }));
      await expect(app.id('a.spend.use')).toHaveText('Use £920 a month');
    }, { answer: () => answer });

    await app.step('C, from the same tab: what the careful amount gives against the budget', async () => {
      app.as('c');
      await app.go('#/c/numbers');
      await app.set('you.pot', '300000');
      await app.set('you.age', '60');
      await app.click('c.action.show');
      await app.at('c.answer');
      await app.ready(120_000);
      await expect(app.id('c.budget.against')).toContainText('Your budget adds up to £920 a month.');
    }, { answer: () => app.engine(FINAL_ENV, 'c') });

    noFigureIn(page, seen);
  });

  test('B: one figure, skipping the budget — said once; "no budget yet" under the answer', async ({ page }) => {
    waitsFor(...NEEDS.b);
    test.setTimeout(240_000);
    const seen = addresses(page);
    const app = v7(page, 'test', 'b');
    await app.step('the numbers, then one figure', async () => {
      await app.open('#/b/numbers');
      await app.ready();
      await app.fill({ 'you.age': '48', 'you.pot': '350000', 'you.payIn.total': '700', 'stop.age': '60' });
      await app.click('b.action.onward');
      await app.at('b.spend');
      await app.click('b.spendHow.one');
      await app.set('spend.amount', '2500');
      await expect(app.id('b.spend.skipNote')).toHaveText(BUDGET.spend.skipNote);
    });
    await app.step('the answer: "your own figure (no budget yet)", and the way to work it out', async () => {
      await app.click('b.action.show');
      await app.at('b.answer');
      await app.ready(120_000);
      await expect(app.id('b.spend.line')).toContainText(fill(BUDGET.answer.noBudget, { amount: '£2,500' }));
      await expect(app.id('b.spend.workItOut')).toHaveAttribute('href', '#/b/spend');
    }, { answer: () => app.engine({ ...FINAL_ENV, detail: 'answer' }) });
    await app.step('back on the step: the note is not said twice', async () => {
      await app.rail('spend');
      await expect(app.id('b.spend.skipNote')).toHaveCount(0);
      expect((await draftOf(page, 'b')).skipNoted).toBe(true);
    });
    noFigureIn(page, seen);
  });

  test('the keyboard: the choice, the sheet, the box; Enter in the sheet never asks, Enter in the box does', async ({ page }) => {
    waitsFor(...NEEDS.a);
    test.setTimeout(180_000);
    const app = v7(page, 'test', 'a');
    await app.open('#/a/numbers');
    await app.ready();
    await app.fill({ 'you.age': '55', 'you.pot': '300000', 'stop.age': '60' });
    await page.keyboard.press('Enter');                                           // the numbers step's own button
    await app.at('a.spend');
    await expect(page.locator('#app h1')).toBeFocused();                         // the move has put the keyboard on the heading
    await app.id('a.spendHow.lines').focus();
    await page.keyboard.press('Space');
    await expect(page.locator('#app [data-region="budget"]')).toBeVisible();
    const first = await page.evaluate(() => window.__pt.getState().budget.lines[0].id);
    // from the choice (one stop for the group), Tab reaches the sheet's first box
    for (let i = 0; i < 4 && !(await app.id(`budget.${first}.amount`).evaluate((el) => el === document.activeElement)); i++) await page.keyboard.press('Tab');
    await expect(app.id(`budget.${first}.amount`)).toBeFocused();
    await page.keyboard.type('900');
    await page.keyboard.press('Enter');
    await app.at('a.spend');                                                     // still the step: the sheet is not the form
    await app.id('a.spend.amount').focus();
    await page.keyboard.type('1800');
    await page.keyboard.press('Enter');
    await app.at('a.answer');
    expect(new URL(page.url()).origin).toBe(TEST);
  });
});
