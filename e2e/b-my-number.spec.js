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

const A_ENV = { ...FINAL_ENV, detail: 'chart' };
const B_ENV = { ...FINAL_ENV, detail: 'answer' };
const tidy = (typed) => money(Number(String(typed).replace(/[£,\s]/g, ''))).slice(1);

test.describe('J4 — what\'s my number? (A, then B with the figures carried across)', () => {
  test.beforeEach(() => waitsFor(...NEEDS.a, ...NEEDS.b, 'carry'));

  test('A answers; the link to B arrives filled; one press gives the number and the pay-in', async ({ page }, testInfo) => {
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
    await test.step('one press: B\'s answer', async () => {
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
      expect(counts.clicksAfterHandOver, 'the link and the button').toBeLessThanOrEqual(2);
      expect(counts.waitFinalSlowedMs, 'final figure, processor slowed four times').toBeLessThanOrEqual(15_000);
    });

    await test.step('back returns to A\'s answer as it was', async () => {
      await page.goBack();
      await app.at('b.numbers');
      await page.goBack();
      app.as('a');
      await app.at('a.answer');
      await app.ready(120_000);
      await app.check({ answer: app.engine(A_ENV) });
    });
  });
});
