/**
 * J4 — "can I stop soon?" (step 4 brief 6 P6; test plan 11.1 J4, first half; fixture A1-stop-soon).
 *
 * The published build, hooks off, as a first-time visitor: the front door → question A; the four things typed
 * ONE KEY AT A TIME (120 ms a key); "Show if it works". Then:
 *   - the first answer is counted (at most 4 typed things, 4 screens — the budget step is one — 8 clicks; no sign-up or pop-up; the first
 *     figure within 3 s and the final one within 15 s with the processor slowed four times) and written to
 *     test-results/first-answer-a/<project>.json;
 *   - the headline: the verdict band and its words, the verdict sentence and the bad-case line — the answer's own;
 *     the chart of ages, one row per `ages[]` entry, the shown age marked; every figure on the screen is Node's;
 *   - the rest of the fixture typed (what goes in each month, savings) and asked again;
 *   - "every age": the optional step's one more pass arrives (`partial`, then final, within 30 s more) and the
 *     table is Node's answer with detail 'all', row for row;
 *   - a reload keeps the address, the boxes and the figures.
 * No countdown on any screen (checked on every step).
 */
import { test, expect, v7, waitsFor, record, fixtureTyping, fixtureFile, mustFill, expectHeadlineA, askAndTime, secondReading, NEEDS, BUILT, FINAL_ENV, FIRST_ANSWER_BUDGET, SLOWDOWN, KEY_DELAY } from './helpers/app.js';

const BUDGET = FIRST_ANSWER_BUDGET.a;
const CHART = { ...FINAL_ENV, detail: 'chart' };
const ALL = { ...FINAL_ENV, detail: 'all' };

test.describe('J4 — can I stop soon? (question A, the published build)', () => {
  test.beforeEach(() => waitsFor(...NEEDS.a));

  test('the four things, one key at a time; the first answer counted; the chart, every age, a reload', async ({ page }, testInfo) => {
    test.setTimeout(240_000);
    const typing = fixtureTyping('A1');
    const four = mustFill('a', typing);
    const app = v7(page, 'prod', 'a');
    const dialogs = [];
    page.on('dialog', (d) => { dialogs.push(d.message()); d.dismiss(); });

    const started = Date.now();
    await app.step('arrives at the front door and picks "When can I afford to stop work?"', async () => {
      await app.open('#/');
      await app.ready();
      await app.click('front.q.a');
      await app.at('a.numbers');
      expect(new URL(page.url()).hash).toMatch(/^#\/a\/numbers/);
    });

    await app.step('types the four things, one key at a time', async () => {
      // Picking a level is one thing (the level), not two: the radio that opens the levels is not counted.
      if (typing['spend.kind'] === 'level') { await app.set('spend.kind', 'level'); app.counts.fields.delete('spend.kind'); }
      for (const path of four) await app.set(path, typing[path], { delay: KEY_DELAY });
    });

    let times = null;
    await test.step('asks, and waits for the answer', async () => {
      times = await askAndTime(app, 'a.action.show');
      await app.at('a.answer');
      await app.note();
    });
    // Over budget at the first reading (other tests share the machine): read it once more on a quiet page.
    times = await secondReading(app, times, BUDGET);

    const answer = app.engine(CHART);
    await app.step('reads the answer: the verdict, the sentence, the bad case — the screen is the engine', async () => {
      expect(answer.status).toBe('ok');
      expect(new URL(page.url()).hash).toBe('#/a/answer');
      await expect(page.locator('#app [data-screen]')).toHaveAttribute('data-question', 'a');
      await expect(page.locator('#app')).toHaveAttribute('data-answer', 'final');
      await expectHeadlineA(page, answer);
      // The chart: one row per age of the answer, in order, the shown age marked.
      const rows = page.locator('#app [data-region="answer"] [data-chart="ages"] [data-age]');
      expect(await rows.evaluateAll((els) => els.map((el) => Number(el.getAttribute('data-age'))))).toEqual(answer.ages.map((r) => r.age));
      await expect(page.locator(`#app [data-chart="ages"] [data-age="${answer.shown.age}"]`)).toHaveAttribute('aria-current', 'true');
      // Each bar is ten cells, labelled with the count in words.
      const bars = page.locator('#app [data-chart="ages"] [data-key$=".lasted"]');
      for (let i = 0; i < await bars.count(); i++) await expect(bars.nth(i).locator('[data-fixed]')).toHaveCount(10);
    }, { answer });

    await test.step('counts the first answer', async () => {
      const counts = {
        project: testInfo.project.name, build: 'published', question: 'a', stubAnswer: !BUILT.aAnswer,
        mustFill: app.counts.fields.size, filled: [...app.counts.fields], screens: app.counts.screens, clicks: app.counts.clicks,
        popUps: dialogs.length, keyDelayMs: KEY_DELAY, ...times, slowdown: SLOWDOWN,
        waitFirstSlowedMs: times.firstMs * SLOWDOWN, waitFinalSlowedMs: times.finalMs * SLOWDOWN, journeyMs: Date.now() - started,
        method: 'Waits are measured at full speed and multiplied by the slowdown: Chromium cannot slow a worker\'s processor.',
        budget: BUDGET
      };
      const file = record(testInfo, `first-answer-a/${testInfo.project.name}.json`, counts);
      await testInfo.attach('first-answer-a.json', { path: file, contentType: 'application/json' });
      expect(counts.mustFill, 'things that must be filled in').toBeLessThanOrEqual(BUDGET.mustFill);
      expect(counts.screens, 'screens passed').toEqual(['front', 'a.numbers', 'a.spend', 'a.answer']);
      expect(counts.clicks, 'clicks or taps').toBeLessThanOrEqual(BUDGET.clicks);
      expect(counts.popUps, 'sign-up, tour or pop-up before the answer').toBe(0);
      await expect(page.locator('dialog[open], [role="dialog"], [aria-modal="true"]')).toHaveCount(0);
      expect(counts.waitFirstSlowedMs, 'first figure, processor slowed four times').toBeLessThanOrEqual(BUDGET.firstMs);
      expect(counts.waitFinalSlowedMs, 'final figure, processor slowed four times').toBeLessThanOrEqual(BUDGET.finalMs);
      expect(counts.journeyMs, 'arriving to the final figure, at typing speed').toBeLessThanOrEqual(BUDGET.journeyMs);
    });

    await app.step('types the rest of the fixture and asks again; the pinned verdict when the fixture is approved', async () => {
      await app.rail('numbers');
      const rest = Object.fromEntries(Object.entries(typing).filter(([p]) => !four.includes(p) && p !== 'spend.kind'));
      await app.fill(rest);
      await app.click('a.action.show');
      await app.at('a.answer');
      await app.ready(120_000);
      const full = app.engine(CHART);
      await expectHeadlineA(page, full);
      const pinned = fixtureFile('A1');
      if (BUILT.aAnswer && pinned && pinned.expect && pinned.expect.verdict) expect(full.headline.verdict).toBe(pinned.expect.verdict);
    }, { answer: () => app.engine(CHART) });

    await app.step('every age: one more pass arrives as "partial", then the table is Node\'s, row for row', async () => {
      waitsFor('extend');
      const t0 = Date.now();
      await app.rail('ages');
      await app.partialThenFinal(180_000);
      const ms = Date.now() - t0;
      const all = app.engine(ALL);
      const rows = page.locator('#app [data-table="ages"] [data-age]');
      expect(await rows.evaluateAll((els) => els.map((el) => Number(el.getAttribute('data-age'))))).toEqual(all.ages.map((r) => r.age));
      // Row k's figures are row k's (a planted "row k shows row k + 1" goes red here).
      const byRow = await rows.evaluateAll((els) => els.map((el) => [...el.querySelectorAll('[data-key]')].map((k) => k.getAttribute('data-key'))));
      expect(byRow.flat().length).toBeGreaterThan(0);
      byRow.forEach((keys, k) => { for (const key of keys) expect(key, `row ${k}`).toMatch(new RegExp(`^ages\\.${k}\\.`)); });
      expect(ms * SLOWDOWN, 'the optional step, processor slowed four times').toBeLessThanOrEqual(BUDGET.optionalMs);
    }, { answer: () => app.engine(ALL) });

    await test.step('reload: the same address, the same figures, the same values in the boxes', async () => {
      await app.reloadKeeps();
    });
  });
});
