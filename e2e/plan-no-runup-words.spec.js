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
 *  - 03 on the new app (7.10.0): no start to-do; "About you and when" says the start stored later and how it changes (unlock,
 *    change it there, lock again), never moving it under the lock, and names no months before the plan.
 *  - Opening any of them in the planner adds nothing to its journey (an old `bridge` entry reads as running).
 *  - 03 in the planner: the next-step banner says the new app's home's first thing due (7.10.0: its month, never the start);
 *    the line under Timing says the later start and how it changes, with no button that moves it.
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

for (const name of ['20-locked-start-after-stop', '04-buckets-running', '07-pre-6.13-flat-params']) {
  test(`${name}: no words for months before the plan on the new app's pages`, async ({ page, watch }) => {
    test.setTimeout(240_000);
    watch.allow(WORKER_DATA_MISSING);
    const plan = planOf(name);
    await seed(page, plan);
    for (const step of ['', '/where', '/about', '/month', '/plan', '/move', '/way']) {
      await page.goto(PROD + V7_PATH + '#/plan/' + plan.id + step);
      await expect(page.locator('#app [data-screen]')).toBeVisible({ timeout: 45_000 });
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
    await expect(page.locator('#tmSummary')).not.toBeEmpty({ timeout: 45_000 });
    expect(await oldWordsOn(page, plannerText), name + ' on opening').toEqual([]);
    for (const tab of ['decision', 'stress', 'strategies', 'transition']) {
      await page.evaluate((t) => switchToTab(t), tab);
      await expect(page.locator('#' + tab + '-content')).toBeVisible({ timeout: 45_000 });
      expect(await oldWordsOn(page, plannerText), name + ' · ' + tab).toEqual([]);
    }
    await page.evaluate(() => switchToTab('stress'));
    await page.evaluate(() => document.querySelector('.sub-tab[data-stresstab="stresssettings"]').click());
    await expect(page.locator('#ssTimingBlock')).toBeVisible({ timeout: 45_000 });
    expect(await oldWordsOn(page, plannerText), name + ' · Stress settings').toEqual([]);
    // Opening writes nothing: an old journey ending in `bridge` is the stage the plan reads as now (running), so the
    // planner's stage check adds no entry to it.
    const stored = await page.evaluate((k) => JSON.parse(sessionStorage.getItem(k) || '[]'), GUEST_KEY);
    expect(stored.find((p) => p.id === plan.id)?.journey, name + ' · journey after opening').toEqual(plan.journey);
  });
}

// retaken in 7.10.0 (spec-7100 §5, §7 step 12): the start is no longer a to-do, nor moved under the lock — "About you and when"
// says the later start and how it changes; the home's one thing to do is the month
test('03 on the new app: no start to-do; "About you and when" says the later start and how it changes, with or without a month said, never a move', async ({ page, watch }) => {
  test.setTimeout(240_000);
  watch.allow(WORKER_DATA_MISSING);
  const plan = planOf('20-locked-start-after-stop');
  await seed(page, plan);
  await page.goto(PROD + V7_PATH + '#/plan/' + plan.id);
  await expect(page.getByTestId('plan.home')).toBeVisible({ timeout: 45_000 });
  await expect(page.locator('[data-todo^="start."]')).toHaveCount(0);
  expect(await page.locator('#app .home-items').first().innerText()).not.toMatch(OLD);
  await page.goto(PROD + V7_PATH + '#/plan/' + plan.id + '/about');
  await expect(page.locator('#app [data-screen]')).toHaveAttribute('data-screen', 'plan.about');
  await expect(page.getByTestId('plan.about.startLater')).toHaveText('Your plan is set to start in April 2027. To change its start, unlock it from “Your plan as locked”, change the start here, and lock it again.', { timeout: 45_000 });
  await expect(page.getByTestId('plan.about.moveStart')).toHaveCount(0);
  await expect(page.getByTestId('plan.about.stopAsk')).toContainText('When did you stop work?');

  // said (stored as the question would store it): the same line, the month changeable, and still no move
  await page.evaluate(([k, text]) => sessionStorage.setItem(k, text), [GUEST_KEY, JSON.stringify([planOf('20-locked-start-after-stop', { stoppedWork: '2026-05' })])]);
  await page.goto(PROD + V7_PATH + '#/plan/' + plan.id);
  await page.reload();   // the window's plans are read when the page loads
  await expect(page.getByTestId('plan.home')).toBeVisible({ timeout: 45_000 });
  await expect(page.locator('[data-todo^="start."]')).toHaveCount(0);
  await page.goto(PROD + V7_PATH + '#/plan/' + plan.id + '/about');
  await expect(page.getByTestId('plan.about.startLater')).toContainText('Your plan is set to start in April 2027.', { timeout: 45_000 });
  await expect(page.getByTestId('plan.about.stopChange')).toBeVisible();
  await expect(page.getByTestId('plan.about.moveStart')).toHaveCount(0);
  await expect(page.getByTestId('plan.about.moveConfirm')).toHaveCount(0);
  expect(await page.locator('#app').innerText()).not.toMatch(OLD);
  // where you are: the months and what was taken, nothing read against a later year; the start is changed on About you and when
  await page.goto(PROD + V7_PATH + '#/plan/' + plan.id + '/where');
  await expect(page.locator('#app')).toContainText('so these months are not read against it yet. You can change the start on About you and when', { timeout: 45_000 });
  expect(await page.locator('#app').innerText()).not.toMatch(/than the plan said|the plan says £/);
});

// retaken in 7.10.0 (spec-7100 §5, §7 step 12): the planner's banner reads the new app's home, so it says the same first thing
// due — 03's missed month, never the start; the line under Timing says the later start and how it changes, never a move
test('03 in the planner: the next-step banner says the home\'s first thing due; the line under Timing says how the start changes, with no move', async ({ page, watch }) => {
  test.setTimeout(240_000);
  watch.allow(WORKER_DATA_MISSING);
  const plan = planOf('20-locked-start-after-stop', { stoppedWork: '2026-05' });
  await seed(page, plan);
  await intoPlanner(page, plan, 'month');
  const banner = page.locator('#nextStepBanner');
  await expect(banner).toContainText('Next: record October 2026.', { timeout: 45_000 });
  await expect(banner).not.toContainText('set to start in');
  await expect(page.locator('#nextStepBtn')).toHaveText('Record October 2026');
  await page.evaluate(() => { window.switchToTab('stress'); setTimeout(() => document.querySelector('.sub-tab[data-stresstab="stresssettings"]')?.click(), 400); });
  const line = page.locator('#tmLockedStart');
  await expect(line).toBeVisible({ timeout: 45_000 });
  await expect(line).toContainText('Your plan is set to start in April 2027. To change its start, unlock the plan (Settings), change the start under Timing, and lock it again.');
  await expect(line.getByRole('button', { name: /Move the/ })).toHaveCount(0);
  await expect(page.locator('#tmStartMove')).toHaveCount(0);
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
