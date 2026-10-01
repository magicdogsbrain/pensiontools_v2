/**
 * J6 — the owner's 55-year-old (the owner's report, 1 Oct 2026): "tried a 55 year old testing how much monthly income
 * a £275,000 pot would produce at 67. But there is no way to add ongoing pension contributions. This is the most
 * likely situation! They have a lump sum invested. They are adding x to pension (employer contribution also)."
 *
 * The published build, hooks off, at 390 and 1280 wide, as a visitor who arrives at "What is that a month?" from a link:
 *   - types the pot and the age; picks "From age" and types 67; answers "Are you still paying into this pension?"
 *     with Yes — ON THE FIRST FORM, never under "Add more detail" — and types £500 (their part) and £300 (the
 *     employer's) a month; presses "Show what it pays";
 *   - the headline is the monthly figure from 67, the engine's to the pound, with its sentence; the answer says
 *     plainly what it assumed about the paying in (£800 a month, until 67, going up with prices);
 *   - it is more than the same person paying nothing in (Node's answer for that, from the same inputs);
 *   - "Try a change": the pot up by £25,000 keeps the keyboard on that button while the answer is worked out again;
 *   - a reload keeps the address, the boxes and the figures.
 */
import { test, expect, v7, waitsFor, SCHEMAS, FINAL_ENV } from './helpers/app.js';
import { answerFromDraft } from './helpers/answerInNode.js';

/** The paying-in fields are the answers' (SCHEMA_C): until they land, this journey says so and waits. */
const PAYING_IN = SCHEMAS.c.fields.some((f) => f.path === 'you.payIn.has');

/** As a person types them, in the order of the form. */
const OWNER = {
  'you.pot': '275000', 'you.age': '55', 'start.kind': 'age', 'start.age': '67',
  'you.payIn.has': 'yes', 'you.payIn.own': '500', 'you.payIn.employer': '300'
};

test.describe('J6 — 55, £275,000, still paying in £500 + £300 a month: what is that a month from 67?', () => {
  test.beforeEach(() => {
    waitsFor('screens', 'shell');
    test.skip(!PAYING_IN, 'Not run yet — waits for the answers\' "still paying in" fields of SCHEMA_C (you.payIn.has, .own, .employer)');
  });

  test('the first form takes what goes in each month; the answer is the monthly figure from 67, and says what it assumed', async ({ page }) => {
    test.setTimeout(180_000);
    const app = v7(page, 'prod');

    await app.step('arrives at "What is that a month?"', async () => {
      await app.open('#/c/numbers');
      await app.ready();
      // the question is on the first form — not behind "Add more detail" — and not yet answered (that is "not paying in")
      await expect(app.id('c.you.payIn.has.yes')).toBeVisible();
      await expect(app.id('c.you.payIn.has.no')).not.toBeChecked();
      await expect(app.id('c.action.moreDetail')).toHaveAttribute('aria-expanded', 'false');
    });

    await app.step('types the pot, the age, the age the money starts, and what goes in each month', async () => {
      await app.fill(OWNER);
      await expect(app.id('c.you.payIn.own')).toBeVisible();
      await expect(app.id('c.you.payIn.employer')).toBeVisible();
      // the help says the tax the government adds back is in "your part"
      await expect(page.locator('#app [data-field="you.payIn.own"]')).toContainText('the tax the government adds back');
      await expect(app.id('c.action.moreDetail')).toHaveAttribute('aria-expanded', 'false');
    });

    await test.step('asks, and waits for the answer', async () => {
      await app.click('c.action.show');
      await app.at('c.answer');
      await app.ready(90_000);
      await app.note();
    });

    const answer = app.engine(FINAL_ENV);
    await app.step('the monthly figure from 67 is the engine\'s, and the answer says what it assumed about the paying in', async () => {
      expect(answer.status).toBe('ok');
      expect(answer.inputs.start.age).toBe(67);
      const head = page.locator('#app [data-headline="monthly.careful"]');
      await expect(head.locator('[data-key="monthly.careful"]').first()).toHaveAttribute('data-value', String(answer.monthly.careful));
      await expect(head.locator('[data-sentence="monthly.careful"]')).toHaveText(answer.sentences.line.text);
      const text = await page.locator('#app [data-region="answer"]').innerText();
      expect(text).toContain('£800');
      expect(text).toMatch(/\b67\b/);
      expect(text).toMatch(/prices/);
      expect(text).not.toMatch(/leaves out any growth, and anything you pay in/i);
    }, { answer });

    await test.step('paying in is worth something: more than the same person paying nothing in', async () => {
      const typed = app.typedBy.c;
      const none = answerFromDraft({ ...typed, 'you.payIn.has': 'no' }, FINAL_ENV, 'c');
      expect(none.status).toBe('ok');
      expect(answer.monthly.careful).toBeGreaterThan(none.monthly.careful);
    });

    await app.step('try a change: the pot up — the keyboard stays on the button while the answer is worked out again', async () => {
      const up = app.id('c.try.pot.up');
      await up.focus();
      await page.keyboard.press('Enter');
      await app.ready(90_000);
      const still = await page.evaluate(() => document.activeElement && document.activeElement.getAttribute('data-testid'));
      expect(still).toBe('c.try.pot.up');
      app.typedBy.c['you.pot'] = '300000';
    }, { answer: () => app.engine(FINAL_ENV) });

    await test.step('reload: the same address, the same figures, the same values in the boxes', async () => {
      await app.reloadKeeps();
    });
  });

  // The reviewers' finding, 1 Oct 2026: someone who answers "Yes" and never touches "Start taking it" was answered "from
  // now", with what they pay in left out. Still paying in, the form starts the money at their State Pension age.
  test('"Start taking it" left alone: "From age" 67 is picked for them, and the answer is the same figure from 67', async ({ page }) => {
    test.setTimeout(180_000);
    const app = v7(page, 'prod');
    const { 'start.kind': kind, 'start.age': age, ...untouched } = OWNER;
    void kind; void age;
    await app.step('types the pot, the age and what goes in — and leaves the start alone', async () => {
      await app.open('#/c/numbers');
      await app.ready();
      await app.fill(untouched);
      await expect(app.id('c.start.kind.age')).toBeChecked();
      await expect(app.id('c.start.age')).toHaveAttribute('placeholder', '67');
      await expect(app.id('c.start.picked')).toContainText('State Pension age, 67');
    });
    await test.step('asks, and waits for the answer', async () => {
      await app.click('c.action.show');
      await app.at('c.answer');
      await app.ready(90_000);
    });
    const answer = app.engine(FINAL_ENV);
    await app.step('the monthly figure is from 67, with £800 a month going in until then', async () => {
      expect(answer.inputs.start).toEqual({ kind: 'age', age: 67 });
      const head = page.locator('#app [data-headline="monthly.careful"]');
      await expect(head.locator('[data-key="monthly.careful"]').first()).toHaveAttribute('data-value', String(answer.monthly.careful));
      await expect(app.id('c.answer.payIn')).toHaveText(answer.sentences.payIn.text);
      const typedFrom67 = answerFromDraft({ ...app.typedBy.c, 'start.kind': 'age', 'start.age': '67' }, FINAL_ENV, 'c');
      expect(answer.monthly).toEqual(typedFrom67.monthly);
    }, { answer });
  });
});
