/**
 * J3 — a retired person (test plan 7.4). The test build; phone and iPad width.
 *
 * Aged 68, State Pension and a final-salary pension already being paid, taking money now, spending £2,200 a
 * month. Asserts the engine's figures and sentences, the £1,343 a month of pensions (a figure that needs no
 * futures: £17,000 a year less £886 tax), and — on every screen passed, rail labels and "what next" links
 * included — that nothing speaks of retiring, stopping work, or a length of time to wait.
 */
import { test, expect, v7, waitsFor, fixtureTyping, retiredWording, BUILT, FINAL_ENV } from './helpers/app.js';

test.describe('J3 — already retired: 68, taking money now', () => {
  test.beforeEach(() => waitsFor('screens', 'shell'));

  test('gets an answer in words that fit someone already retired', async ({ page }) => {
    const F3 = fixtureTyping('F3');
    const { take, ...figures } = F3;
    const app = v7(page, 'test');
    const passed = [];
    const wording = async () => {
      const text = await page.locator('#app').innerText();
      const links = await page.locator('#app a, #app button').allInnerTexts();
      const found = retiredWording([text, ...links].join('\n'));
      passed.push(await app.screen());
      expect(found, `words on the ${await app.screen()} screen that do not fit a retired person`).toEqual([]);
    };

    await app.step('the front door', async () => {
      await app.open('#/');
      await app.ready();
      await wording();
      // Question C is open on the front door: its pot box and button (front.c.pot, front.c.show).
      await app.type('front.c.pot', figures['you.pot'], { path: 'you.pot' });
      await app.click('front.c.show');
      await app.at('c.numbers');
    });

    await app.step('types their figures', async () => {
      const rest = { ...figures };
      delete rest['you.pot'];
      await app.fill(rest);
      // At 68 the money starts now without being asked: no "when do you stop work".
      await expect(app.id('c.start.kind.now')).toBeChecked();
      await wording();
    });

    await test.step('asks', async () => {
      await app.click('c.action.show');
      await app.at('c.answer');
      await app.ready(120_000);
      await app.note();
    });

    const answer = app.engine(FINAL_ENV);
    await app.step('the answer', async () => {
      expect(answer.status).toBe('ok');
      const headline = page.locator('[data-headline="monthly.careful"]');
      await expect(headline.locator('[data-key="monthly.careful"]').first()).toHaveAttribute('data-value', String(answer.monthly.careful));
      await expect(headline.locator('[data-sentence="monthly.careful"]')).toHaveText(answer.sentences.line.text);
      await wording();
      // Every sentence the engine wrote for this person passes the same rule.
      const sentences = [answer.sentences.head, answer.sentences.sub, answer.sentences.line, answer.sentences.bad, answer.sentences.range, ...(answer.sentences.madeOf || [])]
        .filter(Boolean).map((s) => s.text);
      expect(retiredWording([...sentences, ...answer.assumed.map((a) => a.text), ...answer.warnings.map((w) => w.text)].join('\n'))).toEqual([]);
    }, { answer });

    await test.step('the pensions alone: £1,343 a month', async () => {
      // The package 1 stub answers with the forum guest's figures whatever is typed, so this waits for the real answer.
      if (!BUILT.answer) { test.info().annotations.push({ type: 'not checked yet', description: 'the £1,343 figure waits for the real answer (package 2)' }); return; }
      // £11,000 + £6,000 = £17,000 a year; tax (17,000 − 12,570) × 20% = £886; £16,114 a year; £1,342.83 a month.
      expect(answer.guaranteed.monthlyAfterTax).toBeCloseTo(16114 / 12, 2);
      const shown = page.locator('#app [data-key="guaranteed.monthlyAfterTax"]').first();
      // Whole pounds, like every figure in "what it is made of" and the State Pension line beside it (the
      // build brief's phases.shown rule): £1,342.83 reads "£1,343", not the test plan's "£1,340".
      await expect(shown).toHaveText('£1,343');
    });

    await app.step('says what they spend: how long that lasts', async () => {
      if (!take) return;
      const box = (await app.id('c.take').count()) ? 'c.take' : 'c.try.take';
      await app.type(box, take, { path: 'take' });
      if (box === 'c.take' && (await app.id('c.try.take').count())) await app.click('c.try.take'); else await page.keyboard.press('Enter');
      await app.ready(120_000);
      const withTake = app.engine(FINAL_ENV);
      if (BUILT.answer) {
        expect(withTake.take).not.toBeNull();
        await expect(page.locator('#app')).toContainText(withTake.sentences.take.text);
      } else test.info().annotations.push({ type: 'not checked yet', description: 'how long £2,200 a month lasts waits for the real answer (package 2)' });
      await wording();
      await app.check({ answer: withTake, before: answer });
    });

    await app.step('the step not built yet ("ways"), "Save this as a plan?", and the way back', async () => {
      for (const step of ['ways', 'keep']) {
        await app.rail(step);
        await wording();
        await page.goBack();
        await app.at('c.answer');
      }
      await app.ready();
    });

    expect(passed).toEqual(expect.arrayContaining(['front', 'c.numbers', 'c.answer', 'notBuilt']));
    await app.reloadKeeps();
  });
});
