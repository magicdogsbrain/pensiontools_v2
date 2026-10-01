/**
 * J5 — a couple, stopping before 57 (step 4 brief 6 P6; test plan 11.1 J5; fixture A2-couple-before-57).
 *
 * The test build. The first person's figures are typed and answered; THEN "Add a partner" (after the first
 * answer is showing): nothing typed is lost, the partner's boxes appear, the partner's figures are typed and the
 * answer asked again. The couple's answer: the headline and every "what pays" line are the answer's own (the
 * lines for a pension that cannot be touched yet among them), the phases before the State Pension drawn from
 * it; then a try-a-change on the stop age moves every place the household figure appears together.
 */
import { test, expect, v7, waitsFor, fixtureTyping, expectHeadlineA, sentenceTexts, NEEDS, BUILT, FINAL_ENV } from './helpers/app.js';

const CHART = { ...FINAL_ENV, detail: 'chart' };
const plain = (t) => String(t).replace(/\s+/g, ' ').trim();

test.describe('J5 — a couple, stopping before 57 (question A)', () => {
  test.beforeEach(() => waitsFor('hooks', ...NEEDS.a));

  test('one person first, then the partner; the couple\'s answer; a change moves every figure together', async ({ page }) => {
    test.setTimeout(240_000);
    const typing = fixtureTyping('A2');
    const mine = Object.fromEntries(Object.entries(typing).filter(([p]) => p !== 'household' && !p.startsWith('partner.')));
    const theirs = Object.fromEntries(Object.entries(typing).filter(([p]) => p.startsWith('partner.')));
    const app = v7(page, 'test', 'a');

    await app.step('the first person\'s figures, and a first answer', async () => {
      await app.open('#/a/numbers');
      await app.ready();
      await app.fill(mine);
      await app.click('a.action.show');
      await app.at('a.answer');
      await app.ready(120_000);
      await expectHeadlineA(page, app.engine(CHART));
    }, { answer: () => app.engine(CHART) });

    await app.step('adds a partner after the answer is showing: nothing typed is lost', async () => {
      await app.rail('numbers');
      const before = await app.snapshot();
      await app.set('household', 'couple');
      await expect(app.id('a.partner.age')).toBeVisible();
      await expect(app.id('a.partner.pot')).toBeVisible();
      const after = await app.snapshot();
      const kept = Object.fromEntries(after.boxes);
      for (const [id, v] of before.boxes) expect(kept[id], `${id} after adding a partner`).toEqual(v);
      await app.fill(theirs);
      expect(await app.draftValues('a')).toMatchObject(Object.fromEntries(Object.entries(theirs).map(([p, v]) => [p, typeof v === 'boolean' ? v : expect.any(String)])));
    });

    let couple = null;
    await app.step('the couple\'s answer: the headline, and every line of what pays — the answer\'s own', async () => {
      await app.click('a.action.show');
      await app.at('a.answer');
      await app.ready(120_000);
      couple = app.engine(CHART);
      expect(couple.status).toBe('ok');
      expect(couple.inputs.household).toBe('couple');
      await expectHeadlineA(page, couple);
      const text = plain(await page.locator('#app').textContent())   /* folded sections count: the lines are drawn */;
      for (const s of (couple.sentences.pays || [])) expect(text, 'a "what pays" line').toContain(plain(s.text));
      if (couple.sentences.savingsNeeded) expect(text).toContain(plain(couple.sentences.savingsNeeded.text));
      // A pension closed at the stop: the answer warns, and its phases say which periods it cannot pay.
      if (couple.warnings.some((w) => w.id === 'pension-closed')) expect(couple.shown.phases.some((p) => p.pensionOpen === false)).toBe(true);
      // The phases before the State Pension are drawn: their take-home figures are on the screen (the engine check).
      const phaseKeys = await page.$$eval('#app [data-key*="phases."]', (els) => els.map((el) => el.getAttribute('data-key')));
      expect(phaseKeys.length, 'the phases are drawn').toBeGreaterThan(0);
      expect(sentenceTexts(couple).length).toBeGreaterThan(0);
    }, { answer: () => app.engine(CHART) });

    await app.step('a change of the stop age moves every place the household figure appears, together', async () => {
      const before = await page.$$eval('#app [data-key][data-value]', (els) => Object.fromEntries(els.map((el) => [el.getAttribute('data-key'), el.getAttribute('data-value')])));
      await app.click('a.try.stop.up');
      await app.ready(120_000);
      // The draft now holds the new stop age: the engine check works from the page's own draft.
      app.typed = await app.draftValues('a');
      expect(Number(String(app.typed['stop.age']).replace(/\D/g, ''))).toBe(Number(typing['stop.age']) + 1);
      const moved = app.engine(CHART);
      await expectHeadlineA(page, moved);
      const after = await page.$$eval('#app [data-key][data-value]', (els) => Object.fromEntries(els.map((el) => [el.getAttribute('data-key'), el.getAttribute('data-value')])));
      // One key, one value: the same figure everywhere it is drawn (lookOver checks), and it is the new answer's.
      expect(Object.keys(after).length).toBeGreaterThan(0);
      // A real answer follows the stop age; P0's stub does not (its figures are fixed), so only then must they move.
      if (BUILT.aAnswer) expect(before).not.toEqual(after);
    }, { answer: () => app.engine(CHART) });

    await test.step('reload keeps the couple', async () => {
      await app.reloadKeeps();
    });
  });
});
