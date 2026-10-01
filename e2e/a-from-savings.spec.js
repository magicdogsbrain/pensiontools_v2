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
});
