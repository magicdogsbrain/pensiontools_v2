/**
 * J2 — a couple (test plan 7.4). The test build, typed not seeded.
 *
 * Starts as one person, gets a first answer, THEN says "two of us": nothing already typed is lost, the
 * partner's boxes appear, the answer shows that it is being worked out again and then the couple's figures.
 * "Answer in full detail" opens and comes back to the same figures. Changing the partner's pot changes every
 * place the household figure is shown, together.
 *
 * The waits are set from a measurement, not blindly: the couple's answer (F2, the first figure of 100 futures and
 * the final of 1,000) measured on the page's main thread with the processor slowed four times — 1.4 s in
 * Chromium on 30 September 2026 (scratch benchmark: reference path 13.9 s) — times three, plus half a second for
 * a cold worker. The whole journey asks for three answers.
 */
import { test, expect, v7, waitsFor, fixtureTyping, drawnValues, BUILT, FINAL_ENV } from './helpers/app.js';
import { money } from '../src/answers/shared/format.js';

const MEASURED_COUPLE_MS = 1_400;                        // first + final figure, processor slowed four times
const ANSWER_MS = MEASURED_COUPLE_MS * 3 + 500;          // one answer's wait: 4.7 s
const JOURNEY_MS = 3 * ANSWER_MS + 15_000;               // three answers, the typing and the screens between: ~29 s

/** A money box, once left, shows whole pounds with their commas: "400000" typed reads "400,000". */
const tidy = (typed) => money(Number(String(typed).replace(/[£,\s]/g, ''))).slice(1);

test.describe('J2 — a couple, the partner added part-way through', () => {
  test.beforeEach(() => waitsFor('screens', 'shell'));

  test('adds a partner after the first answer; nothing is lost; the household figure moves together', async ({ page }) => {
    test.setTimeout(JOURNEY_MS);
    const F2 = fixtureTyping('F2');
    const alone = { 'you.pot': F2['you.pot'], 'you.age': F2['you.age'] };
    const app = v7(page, 'test');

    await app.step('one person first', async () => {
      await app.open('#/c/numbers');
      await app.fill(alone);
      await app.click('c.action.show');
      await app.at('c.answer');
      await app.ready(ANSWER_MS);
    }, { answer: () => app.engine(FINAL_ENV) });
    const single = app.engine(FINAL_ENV);
    await expect(page.locator('[data-headline="monthly.careful"] [data-key="monthly.careful"]').first()).toHaveAttribute('data-value', String(single.monthly.careful));

    await app.step('goes back and says "two of us"', async () => {
      await app.rail('numbers');
      await app.set('household', 'couple');
      // Nothing already typed is lost (the pot now reads with its commas, as every money box does once left).
      await expect(app.id('c.you.pot')).toHaveValue(tidy(alone['you.pot']));
      await expect(app.id('c.you.age')).toHaveValue(alone['you.age']);
      // The partner's boxes appear; the pot starts at nothing and only the age must be typed.
      await expect(app.id('c.partner.age')).toBeVisible();
      await expect(app.id('c.partner.pot')).toBeVisible();
      await expect(app.id('c.partner.age')).toHaveValue('');
    });

    await app.step('types the rest of the couple\'s figures', async () => {
      const rest = { ...F2 };
      for (const k of ['household', 'you.pot', 'you.age']) delete rest[k];
      await app.fill(rest);
      // A final-salary pension's start is asked as an age — never a year of the plan.
      if (F2['you.finalSalary.has']) {
        const from = app.id('c.you.finalSalary.fromAge');
        await expect(from).toBeVisible();
        await expect(from).toHaveValue(F2['you.finalSalary.fromAge']);
        const label = await page.locator('label[for="c.you.finalSalary.fromAge"]').innerText();
        expect(label.toLowerCase()).toContain('age');
        expect(label.toLowerCase()).not.toMatch(/year \d|plan year/);
      }
    });

    await test.step('asks again: working, then the couple\'s figures', async () => {
      await app.click('c.action.show');
      await app.at('c.answer');
      await expect(page.locator('#app')).toHaveAttribute('data-answer', /^(first|final)$/, { timeout: ANSWER_MS });
      await app.ready(ANSWER_MS);
      await app.note();
    });

    const couple = app.engine(FINAL_ENV);
    await app.step('the couple\'s answer is the engine\'s', async () => {
      expect(couple.status).toBe('ok');
      expect(couple.inputs.household).toBe('couple');
      const headline = page.locator('[data-headline="monthly.careful"]');
      await expect(headline.locator('[data-key="monthly.careful"]').first()).toHaveAttribute('data-value', String(couple.monthly.careful));
      await expect(headline.locator('[data-sentence="monthly.careful"]')).toHaveText(couple.sentences.line.text);
      // The package 1 stub answers with one person's sentence whatever is typed; the real answer names the two of them.
      if (BUILT.answer) await expect(headline.locator('[data-sentence="monthly.careful"]')).toContainText('the two of you');
      else test.info().annotations.push({ type: 'not checked yet', description: 'the couple\'s wording waits for the real answer (package 2)' });
    }, { answer: couple, before: single });   // "Before / Now": the one-person figure beside the couple's

    await app.step('"answer in full detail" opens, and coming back shows the same figures', async () => {
      const before = await drawnValues(page);
      await app.click('c.action.fullDetail');
      await app.at('soon');
      expect(new URL(page.url()).hash).toBe('#/soon/e');
      await page.goBack();
      await app.at('c.answer');
      await app.ready();
      expect(await drawnValues(page)).toEqual(before);
    });

    await test.step('changing the partner\'s pot changes every place the household figure is shown, together', async () => {
      await app.rail('numbers');
      await app.set('partner.pot', String(Number(F2['partner.pot'] || 0) + 100000));
      await app.click('c.action.show');
      await app.at('c.answer');
      await app.ready(ANSWER_MS);
      await app.note();
      const more = app.engine(FINAL_ENV);
      if (BUILT.answer) expect(more.monthly.careful).toBeGreaterThan(couple.monthly.careful);
      const shown = await page.locator('#app [data-key="monthly.careful"]').evaluateAll((els) => els.map((el) => el.getAttribute('data-value')));
      expect(shown.length).toBeGreaterThan(0);
      expect([...new Set(shown)]).toEqual([String(more.monthly.careful)]);
      await app.check({ answer: more, before: couple });
      await app.reloadKeeps();
    });
  });
});
