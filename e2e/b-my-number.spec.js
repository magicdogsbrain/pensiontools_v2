/**
 * J4, second half — "what's my number?" reached from A (step 4 brief 6 P6; test plan 11.1 J4; fixture B1-my-number).
 *
 * The published build, hooks off. The household is asked question A first (what B1 would type there), then A's
 * "Am I saving enough for this?" link carries it across: B's numbers step arrives with the boxes already filled
 * (the declared carry map, src/v7/state/carry.js), says where they came from, and asks for nothing more. One press
 * gives B's answer: the number, and — unless on course — what to pay in, each with its sentence, the figures
 * Node's for the carried draft. The hand-over itself is counted: nothing typed, at most two clicks.
 */
import { test, expect, v7, waitsFor, record, fixtureTyping, carriedDraft, expectHeadlineA, expectHeadlinesB, askAndTime, secondReading, NEEDS, BUILT, FINAL_ENV, SLOWDOWN } from './helpers/app.js';
import { money } from '../src/answers/shared/format.js';
import { KEEP } from '../src/v7/copy/keep.js';

const A_ENV = { ...FINAL_ENV, detail: 'chart' };
const B_ENV = { ...FINAL_ENV, detail: 'answer' };
const tidy = (typed) => money(Number(String(typed).replace(/[£,\s]/g, ''))).slice(1);

test.describe('J4 — what\'s my number? (A, then B with the figures carried across)', () => {
  test.beforeEach(() => waitsFor(...NEEDS.a, ...NEEDS.b, 'carry'));

  test('A answers; the link to B arrives filled; on through the spending, one press gives the number and the pay-in', async ({ page }, testInfo) => {
    test.setTimeout(240_000);
    const typing = fixtureTyping('B1');
    const app = v7(page, 'prod', 'a');

    await app.step('asks A with B1\'s household', async () => {
      await app.open('#/a/numbers');
      await app.ready();
      await app.fill(typing);
      await app.click('a.action.show');
      await app.at('a.answer');
      await app.ready(120_000);
      await expectHeadlineA(page, app.engine(A_ENV));
    }, { answer: () => app.engine(A_ENV) });

    const clicksBefore = app.counts.clicks;
    const fieldsBefore = app.counts.fields.size;
    const expected = carriedDraft(app.typedBy.a, 'a', 'b', app.engine(A_ENV));
    await app.step('"Am I saving enough for this?" opens B with the boxes filled, and says so', async () => {
      await app.click('a.next.b');
      app.as('b');
      await app.at('b.numbers');
      await expect(page.locator('#app [data-carried-from]')).toHaveAttribute('data-carried-from', 'a');
      await expect(app.id('b.carried')).toBeVisible();
      for (const [path, value] of Object.entries(expected)) {
        const box = app.id(`b.${path}`);
        if (!(await box.count()) || !(await box.isVisible())) continue;               // a radio group, or a box under "more"
        const kind = await box.evaluate((el) => el.type);
        if (kind === 'radio' || kind === 'checkbox') continue;
        const v = await box.inputValue();
        expect([String(value), tidy(value)], `b.${path} carried from A`).toContain(v);
      }
      // What was carried is B's draft now: the engine check below works from it.
      app.typedBy.b = { ...expected };
    });

    let times = null;
    await test.step('on through the spending (it came over too), one press: B\'s answer', async () => {
      times = await askAndTime(app, 'b.action.show');
      await app.at('b.answer');
    });
    times = await secondReading(app, times, { firstMs: 3_000, finalMs: 15_000 });

    await app.step('the number and the pay-in, each with its sentence — the screen is the engine', async () => {
      const b = app.engine(B_ENV);
      expect(b.status).not.toBe('invalid');
      await expectHeadlinesB(page, b);
    }, { answer: () => app.engine(B_ENV) });

    await test.step('counts the hand-over', async () => {
      const counts = {
        project: testInfo.project.name, build: 'published', question: 'b', from: 'a', stubAnswer: !BUILT.bAnswer,
        typedAfterHandOver: app.counts.fields.size - fieldsBefore, clicksAfterHandOver: app.counts.clicks - clicksBefore,
        ...times, slowdown: SLOWDOWN, waitFirstSlowedMs: times.firstMs * SLOWDOWN, waitFinalSlowedMs: times.finalMs * SLOWDOWN
      };
      record(testInfo, `first-answer-b-from-a/${testInfo.project.name}.json`, counts);
      expect(counts.typedAfterHandOver, 'nothing typed again after the hand-over').toBe(0);
      // the link, "Next: what you would spend" (the budget step: the spending came over too) and the button
      expect(counts.clicksAfterHandOver, 'the link, on to the spending, and the button').toBeLessThanOrEqual(3);
      expect(counts.waitFinalSlowedMs, 'final figure, processor slowed four times').toBeLessThanOrEqual(15_000);
    });

    await test.step('back returns to A\'s answer as it was', async () => {
      await page.goBack();
      await app.at('b.spend');
      await expect(app.id('b.spend.amount')).toHaveValue(/\S/);                       // the spending came over with the rest
      await page.goBack();
      await app.at('b.numbers');
      await page.goBack();
      app.as('a');
      await app.at('a.answer');
      await app.ready(120_000);
      await app.check({ answer: app.engine(A_ENV) });
    });
  });

  // "Am I saving enough?" said straight (research/saving-enough-and-check-in.md section 8, browser; release step R1). Sam is
  // fictional, the note's own row B: 41, £62,000 saved, £38,000 pay with 6% from Sam and 4% from the employer, stopping at
  // 63, £1,810 a month. The test build, so the grid and Keep can be read; every sentence checked is the engine's own.
  test('Sam: "Not on course", 31% of pay in the first sentence, both incomes with the State Pension, the gap a year, 22% for 3 in 4; the grid in shares; Keep asks as now or on course', async ({ page }) => {
    test.setTimeout(300_000);
    const numbers = { 'you.age': '41', 'you.pot': '62,000', 'you.payIn.kind': 'share', 'you.payIn.pay': '38,000', 'you.payIn.ownPct': '6', 'you.payIn.employerPct': '4', 'stop.age': '63' };
    const app = v7(page, 'test', 'b');

    await app.step('the answer: the verdict said straight, what would be enough in its first sentence', async () => {
      await app.open('#/b/numbers');
      await app.ready();
      await app.fill(numbers);
      await app.fill({ 'spend.amount': '1,810' });
      await app.click('b.action.show');
      await app.at('b.answer');
      await app.ready(120_000);
      const b = app.engine(B_ENV);
      expect(b.verdict.band).toBe('no');
      await expectHeadlinesB(page, b);
      const head = page.locator('#app [data-headline="verdict"]');
      await expect(head.locator('#answer-figure')).toHaveText('Not on course for £1,810 a month from 63');
      const first = head.locator('[data-sentence="verdict"]');
      await expect(first).toContainText('Paying in 10% of your pay as now (£317 a month, your employer\'s 4% included)');
      await expect(first).toContainText('31% of your pay in all (you 27%, £982 a month) would put you on course, which is 9 in 10; 22% (you 18%, £697 a month) would do it in 3 futures out of 4.');
      const income = page.locator('#app [data-testid="b.verdict.income"]');
      await expect(income).toContainText('you could spend £1,310 a month from 63 (£1,630 in a middling case');
      await expect(income).toContainText('with your State Pension from 68 (the full amount, as assumed): £500 a month (£6,000 a year) less than you want.');
      await expect(page.locator('#app [data-enough] h2')).toHaveText('To be on course: 31% of your pay in all');
      // the order: the verdict, then what would be enough, then the guide number
      const order = await page.$$eval('#app [data-headline="verdict"], #app [data-enough], #app [data-guide]', (els) => els.map((el) => (el.matches('[data-headline]') ? 'verdict' : el.matches('[data-enough]') ? 'enough' : 'guide')));
      expect(order).toEqual(['verdict', 'enough', 'guide']);
    }, { answer: () => app.engine(B_ENV) });

    await app.step('two levers together: the grid in shares of pay, up to the share that would be on course', async () => {
      waitsFor('extend');
      await app.rail('choices');
      await app.partialThenFinal(180_000);
      const grid = app.engine({ ...FINAL_ENV, detail: 'grid' }).grid;
      expect(grid.shares).toEqual([10, 16, 22, 28, 31]);
      const shares = await page.$$eval('#app [data-grid] thead th[data-share]', (els) => els.map((el) => Number(el.getAttribute('data-share'))));
      expect(shares).toEqual(grid.shares);
      await expect(page.locator('#app [data-grid] th[data-share="31"]')).toHaveAttribute('data-col-needed', '');
      await expect(page.locator('#app [data-testid="b.grid.shareKey"]')).toBeVisible();
      await app.click('b.action.back');
      await app.at('b.answer');
      await app.ready(120_000);
    });

    await app.step('Keep asks which pay-in, neither chosen: "as now (10%)" or "31% (on course)"; on course keeps it', async () => {
      const now = app.id('b.action.save.now');
      const enough = app.id('b.action.save.enough');
      await enough.scrollIntoViewIfNeeded();
      await expect(app.id('b.keep.payIn').locator('legend')).toHaveText(KEEP.payIn.ask);
      await expect(now).toHaveText('Keep: paying in as now (10%)');
      await expect(enough).toHaveText('Keep: paying in 31% (on course)');
      await expect(app.id('b.action.save')).toHaveCount(0);
      await app.click('b.action.save.enough');
      await expect(app.id('b.keep.made')).toBeVisible({ timeout: 60_000 });
    });
  });
});
