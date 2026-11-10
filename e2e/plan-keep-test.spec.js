/**
 * "Test what you keep against your plan" and "I accept this risk" (7.7.0), without an account, on the PUBLISHED build. The
 * locked ladder of the corpus ("Sam's plan", fixture 20, fictional) keeps its world fund by choice instead of buying its last
 * rungs, and expects money from a pension elsewhere. On #/plan/<id>/hold: opening writes nothing and runs nothing; the test runs
 * only on its button (in the worker) and shows the plan as locked beside the plan as held; "I accept this risk" asks first,
 * then is ONE write of the list of agreements (the settings and the plan document byte-identical); the home says the agreed
 * line; Undo puts the text back byte for byte. The classic planner's Transition tab runs the same test and agrees the same
 * way. No sideways scroll; none of the planner's words. Firebase is never reached.
 */
import { readFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { test, expect, PROD, REPO, FIXED_NOW, V7_PATH, CLASSIC_PATH, WORKER_DATA_MISSING } from './helpers/app.js';
import { OPEN_PLACE_KEY, makeRequest } from '../src/services/OpenPlace.js';

test.use({ outside: 'block' });

const GUEST_KEY = 'pt_guest_scenarios';
const ID = 'KeepTest77';
const v7 = (hash) => PROD + V7_PATH + hash;
const T = 'plan.hold.keepTest';
const BANNED = /\bstrategy\b|\bscenario\b|\bwrappers?\b|\bholdings\b|\btransition\b|\bportfolio\b|\bnominal\b|run-?up|you should|\brecommend|Monte Carlo|\bMC\b|\bp10\b|percentile|about £/i;

function plan() {
  const p = JSON.parse(readFileSync(join(REPO, 'tests', 'fixtures', 'plans', '20-locked-start-after-stop.json'), 'utf8'));
  p.id = ID; p.planDetails.name = 'Sam’s plan'; p.isActive = true; delete p.household;
  p.holdings.lines = p.holdings.lines.filter((l) => !/^(T29|T30I)$/.test(l.ticker || '')).map((l) => (l.ticker === 'VWRP' ? { ...l, keep: { as: 'mine', fundsGaps: false } } : l));
  p.holdings.expected = [{ id: 'e1', label: 'Pension elsewhere', wrapper: 'SIPP', amount: 30000, by: '2028-06' }];
  return p;
}
const stored = (page) => page.evaluate((k) => sessionStorage.getItem(k), GUEST_KEY);
/** The plan as stored, without what an agreement may change: the list of agreements and the stamp. */
const withoutAgreements = (p) => { const o = JSON.parse(JSON.stringify(p)); delete o.planAmendments; delete o.lastModified; return JSON.stringify(o); };
const shots = (name, info) => { const dir = process.env.SHOTS_DIR; if (!dir) return null; mkdirSync(dir, { recursive: true }); return join(dir, name + '-' + info.project.name + '.png'); };
const noSideways = async (page) => { const w = await page.evaluate(() => ({ doc: document.documentElement.scrollWidth, win: window.innerWidth })); expect(w.doc, 'no sideways scroll').toBeLessThanOrEqual(w.win); };

test.describe('"Test what you keep against your plan", without an account', () => {
  test('nothing on opening; the test on its button; "I accept this risk" one write after its confirm; the home says it; Undo byte for byte', async ({ page, watch }, info) => {
    test.setTimeout(240_000);
    watch.allow(WORKER_DATA_MISSING);
    await page.clock.setFixedTime(new Date(FIXED_NOW));
    await page.goto(v7('#/'));
    await expect(page.locator('#app [data-screen]')).toBeVisible();
    const planted = JSON.stringify([plan()]);
    await page.evaluate(([k, text]) => sessionStorage.setItem(k, text), [GUEST_KEY, planted]);

    await test.step('the home: one to-do; "What you hold": kept, not yet tested; opening writes nothing and runs nothing', async () => {
      await page.goto(v7('#/plan/' + ID));
      await expect(page.getByTestId('plan.home.keepTest.line')).toHaveAttribute('data-status', 'untested', { timeout: 60_000 });
      await page.goto(v7('#/plan/' + ID + '/hold'));
      await expect(page.getByTestId(T)).toHaveAttribute('data-status', 'untested', { timeout: 60_000 });
      await expect(page.getByTestId(`${T}.result`)).toHaveCount(0);
      await expect(page.getByTestId(`${T}.accept`)).toHaveCount(0);
      await expect(page.locator('[data-testid$=".keep.untested"]').first()).toHaveText('Kept — not yet tested against your plan.');
      expect(await stored(page), 'opening writes nothing').toBe(planted);
    });

    await test.step('the test: the plan as locked beside the plan as held, with and without the money expected', async () => {
      await page.getByTestId(`${T}.run`).click();
      await expect(page.getByTestId(`${T}.result`)).toBeVisible({ timeout: 120_000 });
      await expect(page.getByTestId(`${T}.locked.bad`)).toHaveText(/^lasts to \d+$/);
      await expect(page.getByTestId(`${T}.held.bad`)).toHaveText(/^runs short at \d+, in \d{4}\/\d{2}$/);
      await expect(page.getByTestId(`${T}.without.bad`)).toBeVisible();
      await expect(page.getByTestId(`${T}.firstShort`)).toContainText('is the first tax year not covered');
      await expect(page.getByTestId(`${T}.shock.shockNotCounted`)).toBeVisible();
      expect(await stored(page), 'testing writes nothing').toBe(planted);
      await noSideways(page);
      const text = await page.locator('#app').innerText();
      expect(text).not.toMatch(/undefined|NaN|\[object/);
      expect(text).not.toMatch(BANNED);
      const shot = shots('keep-test', info);
      if (shot) await page.getByTestId(T).scrollIntoViewIfNeeded().then(() => page.screenshot({ path: shot, fullPage: true }));
    });

    await test.step('"I accept this risk" asks first, then is ONE write of the agreements; the settings and the document byte-identical', async () => {
      await page.getByTestId(`${T}.accept`).click();
      await expect(page.getByTestId(`${T}.confirm`)).toBeVisible();
      expect(await stored(page), 'asking writes nothing').toBe(planted);
      await page.getByTestId(`${T}.confirm.yes`).click();
      await expect(page.getByTestId('plan.hold.toast')).toContainText('You accepted this risk on', { timeout: 60_000 });
      const after = JSON.parse(await stored(page))[0];
      const before = JSON.parse(planted)[0];
      expect(after.planAmendments).toHaveLength(1);
      expect(after.planAmendments[0]).toMatchObject({ kind: 'keep', expected: [{ id: 'e1', amount: 30000, by: '2028-06' }] });
      expect(withoutAgreements(after), 'nothing else changed').toBe(withoutAgreements(before));
      await expect(page.getByTestId(`${T}.line`)).toHaveAttribute('data-status', 'agreed', { timeout: 60_000 });
      await expect(page.getByTestId(`${T}.line`)).toContainText('with what you chose to keep (agreed');
      await expect(page.getByTestId(`${T}.withdraw`)).toBeVisible();
      await noSideways(page);
      const shot = shots('keep-accepted', info);
      if (shot) await page.getByTestId(T).scrollIntoViewIfNeeded().then(() => page.screenshot({ path: shot, fullPage: true }));
    });

    await test.step('Undo puts the text back byte for byte', async () => {
      await page.getByTestId('plan.hold.undo').click();
      await expect(page.getByTestId('plan.hold.toast')).toContainText('Put back as it was.', { timeout: 60_000 });
      expect(await stored(page)).toBe(planted);
      await expect(page.getByTestId(T)).toHaveAttribute('data-status', 'untested', { timeout: 60_000 });
    });
  });

  test('the classic planner\'s Transition tab: the same test, the same words, the agreement one save', async ({ page, watch }, info) => {
    test.setTimeout(240_000);
    watch.allow(WORKER_DATA_MISSING);
    await page.clock.setFixedTime(new Date(FIXED_NOW));
    await page.goto(v7('#/'));
    await expect(page.locator('#app [data-screen]')).toBeVisible();
    const planted = JSON.stringify([plan()]);
    const request = makeRequest({ planId: ID, place: 'about', back: '#/plans', at: FIXED_NOW });
    await page.evaluate(([k, text, rk, req]) => { sessionStorage.setItem(k, text); sessionStorage.setItem(rk, req); }, [GUEST_KEY, planted, OPEN_PLACE_KEY, request]);
    await page.goto(PROD + CLASSIC_PATH);
    await expect(page.locator('#mainApp')).toBeVisible({ timeout: 45_000 });
    await page.evaluate(() => switchToTab('transition'));
    const box = page.locator('#transitionPage');
    await expect(box.locator('#transitionKeepTest')).toHaveAttribute('data-status', 'untested', { timeout: 45_000 });
    const opened = JSON.parse(await stored(page)).find((p) => p.id === ID);
    await box.locator('#keepTestRun').click();
    await expect(box.locator('#keepTestResult')).toBeVisible({ timeout: 120_000 });
    await expect(box.locator('#keepTestResult')).toContainText('runs short at');
    await box.locator('#keepTestAccept').click();
    await box.locator('#keepTestConfirmYes').click();
    await expect(box.locator('#transitionKeepTest')).toHaveAttribute('data-status', 'agreed', { timeout: 45_000 });
    const after = JSON.parse(await stored(page)).find((p) => p.id === ID);
    expect(after.planAmendments).toHaveLength(1);
    expect(withoutAgreements(after), 'the settings and the plan document untouched').toBe(withoutAgreements(opened));
    expect(after.planDocument).toEqual(JSON.parse(planted)[0].planDocument);
    const shot = shots('classic-keep-test', info);
    if (shot) await page.screenshot({ path: shot, fullPage: true });
    // Undo (7.7.0 review): the list put back as it was, in one save
    await box.locator('#keepTestUndo').click();
    await expect(box.locator('#transitionKeepTest')).toHaveAttribute('data-status', 'untested', { timeout: 45_000 });
    const undone = JSON.parse(await stored(page)).find((p) => p.id === ID);
    expect(undone.planAmendments || []).toEqual([]);
    expect(withoutAgreements(undone)).toBe(withoutAgreements(opened));
  });
});
