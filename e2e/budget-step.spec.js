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
import { test, expect, v7, waitsFor, NEEDS, TEST, FINAL_ENV, axeProblems } from './helpers/app.js';
import { BUDGET } from '../src/v7/copy/budget.js';
import { yearFigures } from '../src/v7/state/shapeModel.js';
import { SHAPE } from '../src/v7/copy/shape.js';

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

/*
 * The spending shape on the spend step (research/v7/spending-shape.md 9.7; the owner, 2 Oct 2026: "We MUST offer as many
 * steps and tapers as V6! … We must have Gogo, goslow and nogo years."), on the test build, at every width this file runs
 * at — the screen checks (no sideways scroll, every control 44 pixels on a phone, checkScreen, the page's own looking
 * over) after every step:
 *   - closed it is one line; "Change it with age" opens it;
 *   - "Suggest go-go, go-slow and no-go years" fills 75 and 85, then Undo;
 *   - three steps added by the keyboard alone, each "then" (stays the same, falls by …% a year, moves evenly — never on
 *     the last), one removed (the keyboard goes on to the next step);
 *   - the picture's bars are the model's figures to the pound; "Show each year" opens the table;
 *   - the answer is the engine's for the shape as typed.
 */

test.describe('the spending shape on the spend step', () => {
  test('A: open, suggest and undo; three steps by keyboard; each "then"; remove; the picture and every year; the answer', async ({ page }) => {
    waitsFor(...NEEDS.a);
    test.setTimeout(240_000);
    const app = v7(page, 'test', 'a');
    const state = () => page.evaluate(() => window.__pt.getState().draft.a);

    await app.step('the numbers, then the figure; the shape closed: one line', async () => {
      await app.open('#/a/numbers');
      await app.ready();
      await app.fill({ 'you.age': '55', 'you.pot': '400000', 'stop.age': '62' });
      await app.toSpend('a');
      await app.set('spend.amount', '3000');
      await expect(app.id('a.shape.summary')).toHaveText(SHAPE.closed.level);
      await expect(app.id('a.shape.open')).toHaveAttribute('aria-expanded', 'false');
    });

    await app.step('"Change it with age", then "Suggest go-go, go-slow and no-go years": 75 and 85, with the line and Undo', async () => {
      await app.id('a.shape.open').focus();
      await page.keyboard.press('Enter');
      await expect(app.id('a.shape.open')).toHaveAttribute('aria-expanded', 'true');
      await app.id('a.shape.suggest').focus();
      await page.keyboard.press('Enter');
      await expect(app.id('a.spend.steps.0.fromAge')).toHaveValue('75');
      await expect(app.id('a.spend.steps.0.perMonth')).toHaveValue('2,550');
      await expect(app.id('a.spend.steps.1.fromAge')).toHaveValue('85');
      await expect(app.id('a.spend.steps.1.perMonth')).toHaveValue('2,100');
      await expect(app.id('a.shape.note')).toContainText('Filled in: 15% less from 75 and 30% less from 85.');
      expect(await axeProblems(page), 'accessibility of the open block (WCAG 2.1 A and AA)').toEqual([]);
    });

    await app.step('Undo: back as it was', async () => {
      await app.id('a.shape.undo').focus();
      await page.keyboard.press('Enter');
      await expect(app.id('a.spend.steps.0.fromAge')).toHaveCount(0);
      await expect(app.id('a.shape.note')).toHaveText(SHAPE.undone);
    });

    await app.step('three steps by the keyboard alone: each new age box takes the keyboard', async () => {
      for (const [age, amount] of [['70', '2800'], ['78', '2400'], ['86', '2000']]) {
        await app.id('a.shape.add').focus();
        await page.keyboard.press('Enter');
        const i = (await state()).values['spend.steps'].length - 1;
        await expect(app.id(`a.spend.steps.${i}.fromAge`)).toBeFocused();
        await page.keyboard.press('ControlOrMeta+a');
        await page.keyboard.type(age);
        await page.keyboard.press('Tab');
        await expect(app.id(`a.spend.steps.${i}.perMonth`)).toBeFocused();
        await page.keyboard.press('ControlOrMeta+a');
        await page.keyboard.type(amount);
        await page.keyboard.press('Tab');
        await expect(app.id(`a.spend.steps.${i}.then`)).toBeFocused();
      }
      expect((await state()).values['spend.steps'].map((x) => x.fromAge)).toEqual(['70', '78', '86']);
    });

    await app.step('each "then": falls by 2% a year; moves evenly to the next — never offered on the last', async () => {
      await app.id('a.spend.steps.0.then').selectOption('falls');
      await app.id('a.spend.steps.0.fallsPct').fill('2');
      await app.id('a.spend.steps.1.then').selectOption('glides');
      await expect(app.id('a.spend.steps.2.then').locator('option')).toHaveCount(2);
      await expect(app.id('a.spend.steps.2.then').locator('option[value="glides"]')).toHaveCount(0);
    });

    await app.step('remove the middle step: the keyboard goes on to the next step\'s age', async () => {
      await app.id('a.shape.remove.1').focus();
      await page.keyboard.press('Enter');
      await expect(app.id('a.spend.steps.1.fromAge')).toBeFocused();
      await expect(app.id('a.spend.steps.1.fromAge')).toHaveValue('86');
    });

    await app.step('the picture is the model\'s, to the pound; "Show each year" opens every year', async () => {
      const bars = await page.$$eval('[data-testid="a.shape.chart"] g.year', (gs) => gs.map((g) => [Number(g.getAttribute('data-age')), Number(g.getAttribute('data-figure'))]));
      const model = { unit: 'perMonth', start: { then: 'level' }, steps: [
        { fromAge: 70, perMonth: 2800, then: 'falls', fallsPct: 2 }, { fromAge: 86, perMonth: 2000, then: 'level' }] };
      const want = yearFigures(model, 3000, 62, 33);
      expect(bars.map(([age]) => age)).toEqual(want.map((_, y) => 62 + y));
      bars.forEach(([, v], y) => expect(Math.abs(v - want[y])).toBeLessThan(0.005));
      await app.id('a.shape.years').focus();
      await page.keyboard.press('Enter');
      await expect(page.locator('table[data-table="shape"] tbody tr')).toHaveCount(33);
      expect(await axeProblems(page), 'accessibility with steps, falls, moves and the table (WCAG 2.1 A and AA)').toEqual([]);
    });

    let answer = null;
    await app.step('the answer is the engine\'s for the shape as typed', async () => {
      app.typed['spend.steps'] = [{ fromAge: '70', perMonth: '2800', then: 'falls', fallsPct: '2' }, { fromAge: '86', perMonth: '2000', then: 'level', fallsPct: '' }];
      await app.click('a.action.show');
      await app.at('a.answer');
      await app.ready(120_000);
      answer = app.engine({ ...FINAL_ENV, detail: 'chart' });
      expect(answer.spendShape.map((x) => x.fromAge)).toEqual([62, 70, 86]);
      await expect(app.id('a.shape.answer')).toBeVisible();
      expect(await page.locator('[data-testid="a.shape.answer"] g.year').count()).toBe(answer.byYear.length);
      expect(await axeProblems(page), 'accessibility of the answer with its picture (WCAG 2.1 A and AA)').toEqual([]);
    }, { answer: () => answer });
  });
});
