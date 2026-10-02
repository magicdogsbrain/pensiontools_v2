/**
 * J7 — stopping at 55 from savings (step 4 brief 6 P6; test plan 11.1 J7; fixture A4-from-savings).
 *
 * The test build. The whole fixture typed (the pay-in, the savings and what goes into them each month, both risk
 * levels under "more detail"); the answer: a pension that cannot be touched at the stop is paid round by the
 * savings, in the answer's own words ("until you are 57" — an age, never a count of years), the first phase
 * paid from savings when the answer says the pension is closed. Then part-time work, £20,000 a year for 2 years:
 * the part-time figures are Node's, and the figures without it did not move. The fixture's never-words are
 * checked on every screen: no "bridge", "FIRE", "years to go", "countdown", nor any "in 8 years".
 */
import { test, expect, v7, waitsFor, fixtureTyping, expectHeadlineA, neverSaid, saverWording, NEEDS, BUILT, FINAL_ENV } from './helpers/app.js';

const CHART = { ...FINAL_ENV, detail: 'chart' };
const plain = (t) => String(t).replace(/\s+/g, ' ').trim();

test.describe('J7 — stopping at 55 from savings (question A)', () => {
  test.beforeEach(() => waitsFor('hooks', ...NEEDS.a));

  test('the savings pay until the pension opens; part-time work moves only the part-time figures', async ({ page }) => {
    test.setTimeout(240_000);
    const typing = fixtureTyping('A4');
    const app = v7(page, 'test', 'a');
    const words = async () => {
      expect(await neverSaid(page), 'words this fixture must never show').toEqual([]);
      expect(saverWording(await page.locator('#app').innerText()), 'no countdown').toEqual([]);
    };

    await app.step('types the whole fixture, "more detail" included', async () => {
      await app.open('#/a/numbers');
      await app.ready();
      await app.fill(typing);
      await words();
    });

    let first = null;
    await app.step('the answer: the savings pay first when the pension cannot be touched yet', async () => {
      await app.click('a.action.show');
      await app.at('a.answer');
      await app.ready(120_000);
      first = app.engine(CHART);
      expect(first.status).toBe('ok');
      await expectHeadlineA(page, first);
      const text = plain(await page.locator('#app').textContent())   /* folded sections count: the lines are drawn */;
      for (const s of (first.sentences.pays || [])) expect(text).toContain(plain(s.text));
      if (first.sentences.savingsNeeded) expect(text).toContain(plain(first.sentences.savingsNeeded.text));
      if (first.gapYears > 0) {
        const phases = first.shown.phases || [];
        expect(phases[0].pensionOpen, 'the first phase is before the pension opens').toBe(false);
        expect(phases[0].fromPension, 'nothing from a closed pension').toBe(0);
        expect(first.warnings.map((w) => w.id)).toContain('pension-closed');
      }
      await words();
    }, { answer: () => app.engine(CHART) });

    await app.step('part-time work, £20,000 a year for 2 years: the part-time figures are Node\'s', async () => {
      await app.rail('numbers');
      await app.fill({ 'partTime.has': true, 'partTime.yearly': '20000', 'partTime.years': '2' });
      await app.click('a.action.show');
      await app.at('a.answer');
      await app.ready(120_000);
      const withWork = app.engine(CHART);
      await expectHeadlineA(page, withWork);
      await words();
      if (!BUILT.aAnswer) { test.info().annotations.push({ type: 'not checked yet', description: 'the part-time figures wait for P2\'s real answerA' }); return; }
      expect(withWork.partTime).not.toBeNull();
      expect(withWork.partTime.yearly).toBe(20000);
      expect(withWork.partTime.years).toBe(2);
      // The figures without part-time are the answer before it was switched on.
      expect(withWork.partTime.without.verdict).toBe(first.shown.verdict);
      expect(withWork.partTime.without.lasted).toBe(first.shown.lasted);
      expect(withWork.partTime.without.runOutAge).toBe(first.shown.runOutAge);
      expect(withWork.partTime.lastedWith).toBeGreaterThanOrEqual(withWork.partTime.lastedWithout);
      if (withWork.sentences.partTime) expect(plain(await page.locator('#app').textContent())   /* folded sections count: the lines are drawn */).toContain(plain(withWork.sentences.partTime.text));
    }, { answer: () => app.engine(CHART) });

    await test.step('reload keeps it', async () => {
      await app.reloadKeeps();
      await words();
    });
  });

  test('how the savings grow (6.22.0): under the savings box once there are savings, "Mostly cash" unless chosen; what was assumed says it, with Change; "Invested like my pension" gives Node\'s figures', async ({ page }) => {
    test.setTimeout(240_000);
    const typing = fixtureTyping('A4');
    const app = v7(page, 'test', 'a');
    await app.open('#/a/numbers');
    await app.ready();
    // nothing in savings: the choice is not asked
    await expect(app.id('a.isaGrowth.cash')).toHaveCount(0);
    await app.fill(typing);
    await app.toSpend('a');
    await app.rail('numbers');
    await app.at('a.numbers');
    // straight under the savings box, "Mostly cash" ticked
    await expect(app.id('a.isaGrowth.cash')).toBeChecked();
    await expect(app.id('a.isaGrowth.invested')).not.toBeChecked();
    const order = await page.$$eval('#app [data-field]', (els) => els.map((el) => el.getAttribute('data-field')));
    expect(order.indexOf('isaGrowth'), 'drawn straight after the savings box').toBe(order.indexOf('savings') + 1);
    await expect(page.locator('#app fieldset[data-field="isaGrowth"] legend')).toHaveText('How your savings grow');

    await app.click('a.action.show');
    await app.at('a.answer');
    await app.ready(120_000);
    const cash = app.engine(CHART);
    expect(cash.inputs.isaGrowth).toBe('cash');
    await expectHeadlineA(page, cash);
    const line = page.locator('#app [data-assumed-id="savings-growth"]');
    expect(await line.textContent()).toContain(cash.assumed.find((x) => x.id === 'savings-growth').text);
    await expect(line).toContainText('They grow like cash');
    const change = line.locator('a[data-testid="assumed.savings-growth.change"]');
    await expect(change).toHaveAttribute('href', '#/a/numbers?focus=isaGrowth');
    // "Change" puts the cursor on the choice (on a phone the block opens first)
    if (!(await change.isVisible())) await app.click('a.toggle.assumed');
    await change.click();
    await app.at('a.numbers');
    await expect(app.id('a.isaGrowth.cash')).toBeFocused();
    await app.set('isaGrowth', 'invested');
    await app.click('a.action.show');
    await app.at('a.answer');
    await app.ready(120_000);
    const invested = app.engine(CHART);
    expect(invested.inputs.isaGrowth).toBe('invested');
    await expectHeadlineA(page, invested);
    expect(await page.locator('#app [data-assumed-id="savings-growth"]').textContent()).toContain('They are invested like your pension');
    expect(invested.shown.potAtStop.middling, 'invested savings end higher in the middle case here').not.toBe(cash.shown.potAtStop.middling);
  });
});
