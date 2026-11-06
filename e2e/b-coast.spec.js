/**
 * J6 — "could I pay in less?" (step 4 brief 6 P6: replaces test plan 11.1's J6 as the B journey; fixture B2-coast).
 *
 * The test build, at a phone's and an iPad's width. From the front door to B; the things that must be filled in
 * typed one key at a time; "Show what I need". The first answer to B is counted (at most 5 typed things, 3
 * screens, 8 clicks; waits as A's) and written to test-results/first-answer-b/<project>.json. Then:
 *   - one headline when on course, two when not, each with its sentence — the answer's own;
 *   - a try-a-change (£50 less going in) redraws every figure from the new draft;
 *   - "Two levers together": the grid arrives as `partial` then final, every cell Node's; pressing a cell sets
 *     the stop age and the pay-in and returns to the answer;
 *   - "When could I stop?" carries the household to A, whose numbers step says where the figures came from.
 * Then, on its own (not counted): the pay-in said as a share of pay (6.46.0) — £40,000 a year at 5% and 3% — lands £167
 * and £100 under the boxes, and the answer takes £267 a month going in as now, the engine's own figure.
 */
import { test, expect, v7, waitsFor, record, fixtureTyping, mustFill, carriedDraft, expectHeadlinesB, askAndTime, secondReading, NEEDS, BUILT, FINAL_ENV, FIRST_ANSWER_BUDGET, SLOWDOWN, KEY_DELAY } from './helpers/app.js';

const BUDGET = FIRST_ANSWER_BUDGET.b;
const ANSWER = { ...FINAL_ENV, detail: 'answer' };
const GRID = { ...FINAL_ENV, detail: 'grid' };
const num = (v) => Number(String(v).replace(/[£,\s]/g, ''));

test.describe('J6 — could I pay in less? (question B)', () => {
  test.beforeEach(() => waitsFor('hooks', ...NEEDS.b));

  test('the first answer counted; a change; the grid; a cell pressed; on to A with the figures carried', async ({ page }, testInfo) => {
    test.setTimeout(300_000);
    const typing = fixtureTyping('B2');
    const five = mustFill('b', typing);
    const app = v7(page, 'test', 'b');
    const dialogs = [];
    page.on('dialog', (d) => { dialogs.push(d.message()); d.dismiss(); });

    const started = Date.now();
    await app.step('from the front door to "Am I saving enough?"', async () => {
      await app.open('#/');
      await app.ready();
      await app.click('front.q.b');
      await app.at('b.numbers');
    });

    await app.step('types what must be filled in, one key at a time', async () => {
      if (typing['spend.kind'] === 'level') { await app.set('spend.kind', 'level'); app.counts.fields.delete('spend.kind'); }
      for (const path of five) await app.set(path, typing[path], { delay: KEY_DELAY });
    });

    let times = null;
    await test.step('asks', async () => {
      times = await askAndTime(app, 'b.action.show');
      await app.at('b.answer');
      await app.note();
    });
    times = await secondReading(app, times, BUDGET);

    await test.step('counts the first answer', async () => {
      const counts = {
        project: testInfo.project.name, build: 'test', question: 'b', stubAnswer: !BUILT.bAnswer,
        mustFill: app.counts.fields.size, filled: [...app.counts.fields], screens: app.counts.screens, clicks: app.counts.clicks,
        popUps: dialogs.length, keyDelayMs: KEY_DELAY, ...times, slowdown: SLOWDOWN,
        waitFirstSlowedMs: times.firstMs * SLOWDOWN, waitFinalSlowedMs: times.finalMs * SLOWDOWN, journeyMs: Date.now() - started, budget: BUDGET
      };
      const file = record(testInfo, `first-answer-b/${testInfo.project.name}.json`, counts);
      await testInfo.attach('first-answer-b.json', { path: file, contentType: 'application/json' });
      expect(counts.mustFill).toBeLessThanOrEqual(BUDGET.mustFill);
      expect(counts.screens).toEqual(['front', 'b.numbers', 'b.spend', 'b.answer']);
      expect(counts.clicks).toBeLessThanOrEqual(BUDGET.clicks);
      expect(counts.popUps).toBe(0);
      expect(counts.waitFirstSlowedMs).toBeLessThanOrEqual(BUDGET.firstMs);
      expect(counts.waitFinalSlowedMs).toBeLessThanOrEqual(BUDGET.finalMs);
    });

    await app.step('the headlines: the number; what to pay in unless on course — the answer\'s own', async () => {
      await expectHeadlinesB(page, app.engine(ANSWER));
      // The levers: one per lever the answer has; never drawn when on course.
      const b = app.engine(ANSWER);
      const drawn = await page.$$eval('#app [data-levers] [data-lever]', (els) => els.map((el) => el.getAttribute('data-lever')));
      if (b.onCourse) expect(drawn).toEqual([]);
      else {
        const wanted = Object.entries(b.levers).filter(([, v]) => v !== null).map(([k]) => k);
        expect(drawn.sort()).toEqual(wanted.sort());
        await expect(page.locator('#app [data-lever="accept"] button')).toHaveCount(0);
      }
    }, { answer: () => app.engine(ANSWER) });

    await app.step('£50 less going in: every figure redrawn from the new draft', async () => {
      const was = num(typing['you.payIn.total']);
      await app.click('b.try.payIn.down');
      await app.ready(120_000);
      app.typed = await app.draftValues('b');
      expect(num(app.typed['you.payIn.total'])).toBe(Math.max(0, was - 50));
      await expectHeadlinesB(page, app.engine(ANSWER));
    }, { answer: () => app.engine(ANSWER) });

    await app.step('two levers together: the grid arrives, every cell Node\'s; a cell pressed returns to the answer', async () => {
      waitsFor('extend');
      await app.rail('choices');
      await app.partialThenFinal(180_000);
      const grid = app.engine(GRID).grid;
      expect(grid).not.toBeNull();
      const cells = await page.$$eval('#app [data-grid] [data-cell]', (els) => els.map((el) => el.getAttribute('data-cell')));
      const want = grid.ages.flatMap((row) => row.cells.map((c) => `${row.age}:${c.payIn}`));
      expect(cells).toEqual(want);
      // Press one that differs from today's figures, as a person trying a change would.
      const pick = want.find((c) => c !== `${num(app.typed['stop.age'])}:${num(app.typed['you.payIn.total'])}`) || want[0];
      await page.locator(`#app [data-grid] [data-cell="${pick}"]`).click();
      app.counts.clicks += 1;
      await app.at('b.answer');
      await app.ready(120_000);
      app.typed = await app.draftValues('b');
      const [age, payIn] = pick.split(':').map(Number);
      expect(num(app.typed['stop.age'])).toBe(age);
      expect(num(app.typed['you.payIn.total'])).toBe(payIn);
    }, { answer: () => app.engine(ANSWER) });

    await app.step('"When could I stop?" carries the household to A', async () => {
      waitsFor('carry', ...NEEDS.a);
      const bAnswer = app.engine(ANSWER);
      const expected = carriedDraft(app.typedBy.b, 'b', 'a', bAnswer);
      await app.click('b.next.a');
      app.as('a');
      await app.at('a.numbers');
      await expect(page.locator('#app [data-carried-from]')).toHaveAttribute('data-carried-from', 'b');
      await expect(app.id('a.carried')).toBeVisible();
      const draft = await app.draftValues('a');
      for (const [path, value] of Object.entries(expected)) expect(draft[path], `a draft ${path}`).toEqual(value);
      app.typed = draft;
      await app.click('a.action.show');
      await app.at('a.answer');
      await app.ready(120_000);
    }, { answer: () => app.engine({ ...FINAL_ENV, detail: 'chart' }) });
  });

  test('a share of your pay: £40,000 at 5% and 3% lands £167 and £100 under the boxes; the answer takes £267 a month as now', async ({ page }) => {
    test.setTimeout(240_000);
    const typing = { ...fixtureTyping('B2'), 'you.payIn.kind': 'share', 'you.payIn.pay': '40,000', 'you.payIn.ownPct': '5', 'you.payIn.employerPct': '3' };
    delete typing['you.payIn.total'];
    const spend = Object.fromEntries(Object.entries(typing).filter(([p]) => p.startsWith('spend.')));
    const numbers = Object.fromEntries(Object.entries(typing).filter(([p]) => !p.startsWith('spend.')));
    const app = v7(page, 'test', 'b');

    await app.step('the numbers step: "A share of your pay" chosen, the three boxes typed, what lands said under them', async () => {
      await app.open('#/b/numbers');
      await app.ready();
      await app.fill(numbers);
      await expect(app.id('b.you.payIn.lands')).toHaveText('£167 a month from you and £100 from your employer.');
      await expect(app.id('b.you.payIn.total')).toHaveCount(0);
      await expect(app.id('b.you.payIn.own')).toHaveCount(0);
    });

    await app.step('on through the spending: the answer takes £267 a month going in as now — the engine\'s own figure', async () => {
      await app.fill(spend);
      await app.click('b.action.show');
      await app.at('b.answer');
      await app.ready(120_000);
      const b = app.engine(ANSWER);
      expect(b.status).toBe('ok');
      expect(b.payIn).toMatchObject({ now: 266.67, own: 166.67, employer: 100 });
      await expectHeadlinesB(page, b);
      const now = page.locator('#app [data-key="payIn.now"]').first();
      await expect(now).toHaveText('£267');
      await expect(now).toHaveAttribute('data-value', '266.67');
    }, { answer: () => app.engine(ANSWER) });
  });
});
