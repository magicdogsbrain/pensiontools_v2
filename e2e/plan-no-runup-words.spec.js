/**
 * No months "before the plan" on any screen (7.3.3), without an account. The PUBLISHED build: the planner and the new app on
 * one site, this window's plans (sessionStorage pt_guest_scenarios) seen by both. The clock: 4 November 2026 (2026/27).
 *
 * Until 6.51.0 a retired person's plan started at the next April by default, and the months until then were given names
 * (the run-up, the bridge months, "before the plan's income starts"). Nobody retired has months before their plan: those
 * words are gone from both apps, and a plan stored that way shows ONE thing to do — move its start, or say when work
 * stopped first.
 *
 *  - Fixtures 03 (a locked ladder stored that way), 04 (a running plan) and 07 (an older plan with the ladder's extra cash):
 *    no old word on the new app's home and steps, nor on the planner's pages.
 *  - 03 on the new app: the home's first thing to do is "When did you stop work?"; said, it is "Start it from the tax year
 *    you stopped", whose button opens the move on "About you and when", its confirm naming no months before the plan.
 *  - 03 in the planner: the next-step banner says the same thing to do, and its button opens the line that moves the start.
 * Run at desktop-1440 and phone-390 alike.
 *
 * Firebase is never reached: every request outside the site is stopped (`outside: 'block'`).
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test, expect, PROD, REPO, V7_PATH, CLASSIC_PATH, WORKER_DATA_MISSING, NEVER_ON_SCREEN } from './helpers/app.js';
import { OPEN_PLACE_KEY, makeRequest } from '../src/services/OpenPlace.js';

test.use({ outside: 'block' });

const GUEST_KEY = 'pt_guest_scenarios';
const NOW = '2026-11-04T08:00:00.000Z';
const read = (name) => JSON.parse(readFileSync(join(REPO, 'tests', 'fixtures', 'plans', name + '.json'), 'utf8'));
/** Words for months before the plan, by any of their names, and "bridge" (a strategy's old name included). */
const OLD = /\bbridg(e|es|ed|ing)\b|run[\s-]?up|before (your|the) plan(['’]s income)? starts?|set aside until|next 6 April/i;

function planOf(name, more = {}) {
  const p = read(name);
  p.isActive = true;
  Object.assign(p.stressTool.settings, more);
  return p;
}
async function seed(page, plan) {
  await page.clock.setFixedTime(new Date(NOW));
  await page.goto(PROD + V7_PATH + '#/');
  await expect(page.locator('#app [data-screen]')).toBeVisible();
  await page.evaluate(([k, text]) => sessionStorage.setItem(k, text), [GUEST_KEY, JSON.stringify([plan])]);
}
/** Into the planner on this window's plan, by the new app's hand-over (as a person reaches it without an account). */
async function intoPlanner(page, plan, place = 'about') {
  const request = makeRequest({ planId: plan.id, place, back: '#/plans', at: NOW });
  await page.evaluate(([rk, req]) => sessionStorage.setItem(rk, req), [OPEN_PLACE_KEY, request]);
  await page.goto(PROD + CLASSIC_PATH);
  await expect(page.locator('#mainApp')).toBeVisible({ timeout: 45_000 });
}
const appText = (page) => page.locator('#app').innerText();
const plannerText = (page) => page.locator('#mainApp').innerText();
async function oldWordsOn(page, text) {
  const t = await text(page);
  const m = t.match(OLD);
  return m ? [m[0] + ' — "' + t.slice(Math.max(0, m.index - 60), m.index + 60).replace(/\s+/g, ' ') + '"'] : [];
}

for (const name of ['03-gilt-ladder-runup', '04-buckets-running', '07-pre-6.13-flat-params']) {
  test(`${name}: no words for months before the plan on the new app's pages`, async ({ page, watch }) => {
    test.setTimeout(240_000);
    watch.allow(WORKER_DATA_MISSING);
    const plan = planOf(name);
    await seed(page, plan);
    for (const step of ['', '/where', '/about', '/month', '/plan', '/move', '/way']) {
      await page.goto(PROD + V7_PATH + '#/plan/' + plan.id + step);
      await expect(page.locator('#app [data-screen]')).toBeVisible({ timeout: 45_000 });
      await page.waitForTimeout(800);
      expect(await oldWordsOn(page, appText), name + step).toEqual([]);
      const said = await page.locator('#app').innerText();
      for (const w of NEVER_ON_SCREEN.filter((x) => /before|run|April/.test(x))) expect(said.toLowerCase(), name + step + ': ' + w).not.toContain(w.toLowerCase());
    }
  });

  test(`${name}: no words for months before the plan in the planner`, async ({ page, watch }) => {
    test.setTimeout(240_000);
    watch.allow(WORKER_DATA_MISSING);
    const plan = planOf(name);
    await seed(page, plan);
    await intoPlanner(page, plan);
    await page.waitForTimeout(1500);
    expect(await oldWordsOn(page, plannerText), name + ' on opening').toEqual([]);
    for (const tab of ['decision', 'stress', 'strategies', 'transition']) {
      await page.evaluate((t) => switchToTab(t), tab);
      await page.waitForTimeout(1200);
      expect(await oldWordsOn(page, plannerText), name + ' · ' + tab).toEqual([]);
    }
    await page.evaluate(() => switchToTab('stress'));
    await page.evaluate(() => document.querySelector('.sub-tab[data-stresstab="stresssettings"]').click());
    await page.waitForTimeout(1200);
    expect(await oldWordsOn(page, plannerText), name + ' · Stress settings').toEqual([]);
  });
}

test('03 on the new app: one thing to do, first — say when work stopped; then the move, opened from the home', async ({ page, watch }) => {
  test.setTimeout(240_000);
  watch.allow(WORKER_DATA_MISSING);
  const plan = planOf('03-gilt-ladder-runup');
  await seed(page, plan);
  await page.goto(PROD + V7_PATH + '#/plan/' + plan.id);
  const first = page.locator('#app .home-item').first();
  await expect(first).toHaveAttribute('data-todo', 'start.ask', { timeout: 45_000 });
  await expect(first).toContainText('When did you stop work?');
  await expect(first).toContainText('Your plan is set to start in April 2027.');
  await page.getByTestId('plan.home.todo.start.ask').click();
  await expect(page.locator('#app [data-screen]')).toHaveAttribute('data-screen', 'plan.about');
  await expect(page.getByTestId('plan.about.stopAsk')).toContainText('When did you stop work?', { timeout: 45_000 });

  // said (stored as the question would store it): the to-do becomes the move, and its button opens it
  await page.evaluate(([k, text]) => sessionStorage.setItem(k, text), [GUEST_KEY, JSON.stringify([planOf('03-gilt-ladder-runup', { stoppedWork: '2026-05' })])]);
  await page.goto(PROD + V7_PATH + '#/plan/' + plan.id);
  await page.reload();   // the window's plans are read when the page loads
  const moved = page.locator('#app .home-item').first();
  await expect(moved).toHaveAttribute('data-todo', 'start.move', { timeout: 45_000 });
  await expect(moved).toContainText('Start it from the tax year you stopped');
  await expect(moved).toContainText('Your plan is set to start in April 2027, but you stopped work in May 2026.');
  await page.getByTestId('plan.home.todo.start.move').click();
  const offer = page.getByTestId('plan.about.moveStart');
  await expect(offer).toContainText('It can start from 2026/27, the tax year you stopped', { timeout: 45_000 });
  await page.getByTestId('plan.about.moveStart.open').click();
  const confirm = page.getByTestId('plan.about.moveConfirm');
  await expect(confirm).toBeVisible();
  await expect(confirm).toContainText('Move the plan’s start to 2026/27?');
  expect(await confirm.innerText()).not.toMatch(OLD);
  // where you are: the months and what was taken, nothing read against a later year
  await page.goto(PROD + V7_PATH + '#/plan/' + plan.id + '/where');
  await expect(page.locator('#app')).toContainText('so these months are not read against it yet: see To do', { timeout: 45_000 });
  expect(await page.locator('#app').innerText()).not.toMatch(/than the plan said|the plan says £/);
});

test('03 in the planner: the next-step banner says the same thing to do, and opens the line that moves the start', async ({ page, watch }) => {
  test.setTimeout(240_000);
  watch.allow(WORKER_DATA_MISSING);
  const plan = planOf('03-gilt-ladder-runup', { stoppedWork: '2026-05' });
  await seed(page, plan);
  await intoPlanner(page, plan, 'month');
  const banner = page.locator('#nextStepBanner');
  await expect(banner).toContainText('Your plan is set to start in April 2027, but you stopped work in May 2026. Start it from the tax year you stopped.', { timeout: 45_000 });
  await expect(page.locator('#nextStepBtn')).toHaveText('Move the start');
  await page.locator('#nextStepBtn').click();
  const line = page.locator('#tmLockedStart');
  await expect(line).toBeVisible({ timeout: 45_000 });
  await expect(line).toContainText('and your plan is set to start in 2027/28. Start it from 2026/27');
  await expect(line.getByRole('button', { name: /^Move the plan.s start/ })).toBeVisible();
  expect(await line.innerText()).not.toMatch(OLD);
});

test('the planner offers no later start: never "next 6 April" among the start years', async ({ page, watch }) => {
  test.setTimeout(240_000);
  watch.allow(WORKER_DATA_MISSING);
  const plan = planOf('02-pnv-draft', { stoppedWork: '2025-08' });
  await seed(page, plan);
  await intoPlanner(page, plan);
  await expect(page.locator('#ssTimingBlock')).toBeVisible({ timeout: 45_000 });
  const options = await page.locator('#tmStartYear option').allTextContents();
  expect(options.length).toBeGreaterThan(0);
  for (const o of options) expect(o).not.toMatch(/next 6 April|2027\/28(?! \(saved\))/);
  expect(options).toContain('2025/26 — the year you stopped work');
});
