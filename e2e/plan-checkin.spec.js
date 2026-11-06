/**
 * A saver's check-in (research/saving-enough-and-check-in.md 5; release step R3), on the PUBLISHED build, without an
 * account, fictional figures only:
 *   - a saver keeps a plan from "Am I saving enough?" (question B's own fixture) and Keep's second button opens its first
 *     check-in; the pots are typed (never filled in), how often is chosen, "Check in" runs B in the worker on the
 *     check-in's figures and writes ONE change to the window's plan — the check-in, the month's pot record, how often and
 *     the saving path drawn from the check-in's own pot — every other byte the same; the result in B's own sentences, the
 *     path starting here, the next date, "Add to my calendar" and the history row;
 *   - a year on (the test clock): due on the rail and in the next sentence; a second check-in shows the pot against the
 *     path, what changed since the first and the second history row;
 *   - the classic planner's equivalent: its own monthly pot list shows both check-ins' pots, the same record;
 *   - a plan locked while saving checks in too, with three keys written and the lock in place.
 * No figure in any address; no sideways scroll; no banned word. Firebase is never reached.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test, expect, v7, waitsFor, NEEDS, PROD, REPO, FINAL_ENV, fixtureTyping, saverWording, CLASSIC_PATH, V7_PATH, WORKER_DATA_MISSING } from './helpers/app.js';
import { CHECK_IN_KEYS } from '../src/services/LockedPlanGuard.js';

test.use({ outside: 'block' });

const GUEST_KEY = 'pt_guest_scenarios';
const T = 'plan.checkin';
const BANNED = /\bstrategy\b|\bscenario\b|\bcontributions?\b|on track|\bprojection\b|\baccumulation\b|retirement age|\btarget\b|per month|\/mo\b|Monte Carlo|\bnet\b|\bgross\b|\bfail|\bshortfall\b|\bpaths\b/i;
const A_YEAR_ON = '2027-10-04T08:00:00.000Z';
const stored = (page) => page.evaluate((k) => JSON.parse(sessionStorage.getItem(k) || '[]'), GUEST_KEY);
/** The plan without the keys a check-in writes and the stamp: what must not move. */
const rest = (plan) => { const o = JSON.parse(JSON.stringify(plan)); delete o.lastModified; for (const k of ['checkIns', 'history', 'checkInEvery', 'path', 'pathArchive']) if (o.accumulationTool) delete o.accumulationTool[k]; return JSON.stringify(o); };
async function noSideways(page) {
  const w = await page.evaluate(() => ({ doc: document.documentElement.scrollWidth, win: window.innerWidth }));
  expect(w.doc, 'no sideways scroll').toBeLessThanOrEqual(w.win);
}
async function wordsOk(page) {
  const text = await page.locator('#app').innerText();
  expect(text).not.toMatch(/undefined|NaN|\[object|\{\w+\}/);
  expect(text).not.toMatch(BANNED);
  expect(saverWording(text)).toEqual([]);
}

test.describe('a saver\'s check-in, without an account', () => {
  test('kept from "Am I saving enough?": the first check-in, a year on the second, the classic planner\'s pot list; a locked saver checks in too', async ({ page, watch }) => {
    waitsFor(...NEEDS.b);
    test.setTimeout(600_000);
    watch.allow(WORKER_DATA_MISSING);
    const app = v7(page, 'prod', 'b');
    let planId = null;

    await test.step('B answered and kept as a plan; Keep\'s second button is the first check-in', async () => {
      const typing = fixtureTyping('B1');
      app.as('b');
      await app.open('#/b/numbers');
      await app.ready();
      await app.fill(Object.fromEntries(Object.entries(typing).filter(([, v]) => v !== undefined)));
      await app.click('b.action.show');
      await app.at('b.answer');
      await app.ready(120_000);
      const result = app.engine({ ...FINAL_ENV, detail: 'answer' });
      const save = result.verdict.band === 'yes' ? 'b.action.save' : 'b.action.save.now';
      await app.id(save).scrollIntoViewIfNeeded();
      await app.click(save);
      await expect(app.id('b.keep.made')).toBeVisible({ timeout: 60_000 });
      planId = await app.id('b.keep.made').getAttribute('data-plan-id');
      await expect(app.id('b.keep.saving')).toHaveAttribute('href', `#/plan/${planId}/saving`);
      await expect(app.id('b.keep.checkIn')).toHaveAttribute('href', `#/plan/${planId}/checkin`);
      await expect(app.id('b.keep.checkIn')).toHaveText('Start your first check-in');
      await app.id('b.keep.checkIn').click();
      await expect(page.locator('#app [data-screen]')).toHaveAttribute('data-screen', 'plan.checkin');
    });

    await test.step('the first check-in: the pots typed, how often chosen; one write; the result, the path starting here, the history row', async () => {
      await expect(page.getByTestId('plan.step.checkin')).toHaveText('Check in');
      await expect(page.getByTestId(`${T}.ci.pension`)).toHaveValue('');
      await expect(page.getByTestId(`${T}.ci.every.year`)).toBeChecked();
      await noSideways(page);
      await wordsOk(page);
      const before = await stored(page);
      await page.getByTestId(`${T}.ci.pension`).fill('124,000');
      await page.getByTestId(`${T}.ci.isa`).fill('6,500');
      await page.getByTestId(`${T}.ci.every.quarter`).check();
      await page.getByTestId(`${T}.ci.every.year`).check();
      await page.getByTestId(`${T}.ci.note`).fill('First check-in.');
      await page.getByTestId(`${T}.submit`).click();
      await expect(page.getByTestId(`${T}.result`)).toHaveAttribute('data-live', '1', { timeout: 180_000 });
      await expect(page.locator('#app')).toHaveAttribute('data-ready', '1', { timeout: 60_000 });
      await expect(page.getByTestId(`${T}.result`).locator('h2')).toHaveText('Checked in for September 2026');
      await expect(page.getByTestId(`${T}.result`).locator('[data-verdict]').first()).toBeVisible();
      await expect(page.getByTestId(`${T}.result.path`)).toHaveAttribute('data-band', 'start');
      await expect(page.getByTestId(`${T}.next`)).toHaveText('Next check-in: September 2027.');
      await expect(page.getByTestId(`${T}.calendar`)).toHaveText('Add to my calendar');
      await expect(page.locator(`[data-testid="${T}.history.table"] tbody tr[data-date]`)).toHaveCount(1);
      await expect(page.getByTestId(`${T}.history.table`)).toContainText('£124,000 pension, £6,500 ISAs and savings');
      await expect(page.getByTestId(`${T}.history.table`)).toContainText('First check-in.');
      await expect(page.getByTestId(`${T}.toast`)).toContainText('Checked in for September 2026.');
      const after = await stored(page);
      const i = after.findIndex((p) => p.id === planId);
      expect(rest(after[i]), 'every other byte of the plan the same').toBe(rest(before[i]));
      for (let j = 0; j < after.length; j++) if (j !== i) expect(JSON.stringify(after[j])).toBe(JSON.stringify(before[j]));
      const acc = after[i].accumulationTool;
      expect(acc.checkInEvery).toBe('year');
      expect(acc.checkIns).toHaveLength(1);
      expect(acc.checkIns[0]).toMatchObject({ date: '2026-09-30', pot: { pension: 124000, isa: 6500 }, note: 'First check-in.' });
      expect(['yes', 'close', 'no']).toContain(acc.checkIns[0].reading.band);
      expect(acc.path.path[0].nominal.middling).toBe(130500);
      expect(acc.history.map((r) => r.date)).toEqual(['2026-09']);
      expect(new URL(page.url()).hash).toBe(`#/plan/${planId}/checkin`);
      await noSideways(page);
      await wordsOk(page);
    });

    await test.step('a year on: due on the rail and in the next sentence; the second check-in reads the pot against the path and says what changed', async () => {
      await page.clock.setFixedTime(new Date(A_YEAR_ON));
      await page.reload();
      await expect(page.locator('#app [data-screen]')).toHaveAttribute('data-screen', 'plan.checkin');
      await expect(page.getByTestId(`${T}.result`)).toHaveAttribute('data-live', '0');
      await expect(page.getByTestId('rail.next')).toContainText('Next: your yearly check-in (the last was September 2026).');
      await page.getByTestId(`${T}.ci.pension`).fill('139,000');
      await page.getByTestId(`${T}.ci.isa`).fill('8,900');
      await page.getByTestId(`${T}.submit`).click();
      await expect(page.getByTestId(`${T}.result`)).toHaveAttribute('data-live', '1', { timeout: 180_000 });
      await expect(page.locator('#app')).toHaveAttribute('data-ready', '1', { timeout: 60_000 });
      await expect(page.getByTestId(`${T}.result`).locator('h2')).toHaveText('Checked in for October 2027');
      await expect(page.getByTestId(`${T}.result.path`)).not.toHaveAttribute('data-band', 'start');
      await expect(page.getByTestId(`${T}.result.path`)).toContainText('the worst 1 in 10');
      await expect(page.getByTestId(`${T}.result.changed`)).toContainText('Since your last check-in (September 2026)');
      await expect(page.getByTestId(`${T}.result.changed`)).toContainText('Your pot went from £130,500 to £147,900.');
      await expect(page.getByTestId(`${T}.result.rest`)).toHaveText(/^Markets, charges and anything not recorded: [+−]£[\d,]+\.$/);
      await expect(page.locator(`[data-testid="${T}.history.table"] tbody tr[data-date]`)).toHaveCount(2);
      const acc = (await stored(page)).find((p) => p.id === planId).accumulationTool;
      expect(acc.checkIns.map((c) => c.date)).toEqual(['2026-09-30', '2027-10-04']);
      expect(acc.history.map((r) => r.date)).toEqual(['2026-09', '2027-10']);
      await noSideways(page);
      await wordsOk(page);
    });

    await test.step('the classic planner\'s equivalent: its monthly pot list shows each check-in\'s pot (one ledger)', async () => {
      await page.goto(PROD + CLASSIC_PATH);
      await page.locator('#landingTryGuest').click();
      await expect(page.locator('#mainApp')).toBeVisible({ timeout: 30_000 });
      await expect(page.locator('nav.tabs .tab.active')).toHaveAttribute('data-tab', 'accumulation', { timeout: 30_000 });
      const list = page.locator('#acRecords');
      await expect(list).toContainText('£139,000', { timeout: 30_000 });
      await expect(list).toContainText('£124,000');
    });

    await test.step('a plan locked while saving checks in too: three keys written, the lock in place', async () => {
      const locked = JSON.parse(readFileSync(join(REPO, 'tests', 'fixtures', 'plans', '05-saver-committed.json'), 'utf8'));
      locked.id = 'LockedSaver01'; locked.planDetails.name = 'Alex saving'; locked.isActive = false; delete locked.household;
      const list = await stored(page);
      await page.evaluate(([k, text]) => { sessionStorage.setItem(k, text); }, [GUEST_KEY, JSON.stringify([...list, locked])]);
      await page.goto(PROD + V7_PATH + '#/plan/LockedSaver01/pot');
      await expect(page.locator('#app [data-screen]')).toHaveAttribute('data-screen', 'plan.checkin');
      await expect(page.getByTestId(`${T}.locked`)).toBeVisible();
      await expect(page.getByTestId(`${T}.ci.every.month`)).toBeChecked();
      const before = (await stored(page)).find((p) => p.id === 'LockedSaver01');
      await page.getByTestId(`${T}.ci.pension`).fill('331,000');
      await page.getByTestId(`${T}.ci.isa`).fill('41,500');
      await page.getByTestId(`${T}.submit`).click();
      await expect(page.getByTestId(`${T}.toast`)).toContainText('Checked in for October 2027.', { timeout: 180_000 });
      const after = (await stored(page)).find((p) => p.id === 'LockedSaver01');
      expect(after.decisionTool.settings.locked).toBe(true);
      expect(JSON.stringify(after.planDocument)).toBe(JSON.stringify(before.planDocument));
      expect(JSON.stringify(after.stressTool)).toBe(JSON.stringify(before.stressTool));
      const changed = Object.keys(after.accumulationTool).filter((k) => JSON.stringify(after.accumulationTool[k]) !== JSON.stringify(before.accumulationTool[k])).map((k) => 'accumulationTool.' + k).sort();
      expect(changed).toEqual([...CHECK_IN_KEYS.locked].sort());
      await wordsOk(page);
    });
  });
});
