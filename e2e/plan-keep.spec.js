/**
 * "Keep this" (7.6.0), without an account, on the PUBLISHED build. The locked ladder of the corpus ("Sam's plan", fixture 20)
 * is planted with two made-up lines more: a conventional gilt and a share. On #/plan/<id>/hold: opening writes nothing; the
 * gilt kept to stand in for 2027/28 is ONE write of the record (the settings and the plan document byte-identical), the
 * gaps are read year by year, Undo puts the text back byte for byte; the share kept by choice is no longer a sell on the move.
 * In the classic planner's Transition tab the same keep is one save, and the page says the same sentences. No sideways
 * scroll; none of the planner's words. Firebase is never reached.
 */
import { readFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { test, expect, PROD, REPO, FIXED_NOW, V7_PATH, CLASSIC_PATH, WORKER_DATA_MISSING } from './helpers/app.js';
import { OPEN_PLACE_KEY, makeRequest } from '../src/services/OpenPlace.js';

test.use({ outside: 'block' });

const GUEST_KEY = 'pt_guest_scenarios';
const ID = 'KeepPlan01';
const v7 = (hash) => PROD + V7_PATH + hash;
const T = 'plan.hold';
const BANNED = /\bstrategy\b|\bscenario\b|\bwrappers?\b|\bholdings\b|\btransition\b|\bportfolio\b|\bnominal\b|run-?up|you should|\brecommend|Monte Carlo|\bMC\b|\bp10\b|about £/i;

function plan() {
  const p = JSON.parse(readFileSync(join(REPO, 'tests', 'fixtures', 'plans', '20-locked-start-after-stop.json'), 'utf8'));
  p.id = ID; p.planDetails.name = 'Sam’s plan'; p.isActive = true; delete p.household;
  p.holdings.lines.push(
    { asOf: '2026-09-01', contribution: null, kind: 'gilt', name: 'Example Treasury Gilt 2027', ocf: null, sedol: null, subClass: null, ticker: null, units: 20000, value: 19600, wrapper: 'SIPP' },
    { asOf: '2026-09-01', contribution: null, kind: null, name: 'Example Shares plc', ocf: null, sedol: null, subClass: null, ticker: 'EXMPL', units: 100, value: 15000, wrapper: 'SIPP' }
  );
  return p;
}
const GILT = 8, SHARE = 9;
const stored = (page) => page.evaluate((k) => sessionStorage.getItem(k), GUEST_KEY);
/** The plan as stored, without what a keep may change: the record and the stamp. */
const withoutRecord = (p) => { const o = JSON.parse(JSON.stringify(p)); delete o.holdings; delete o.lastModified; return JSON.stringify(o); };
const shots = (name, info) => { const dir = process.env.SHOTS_DIR; if (!dir) return null; mkdirSync(dir, { recursive: true }); return join(dir, name + '-' + info.project.name + '.png'); };

test.describe('"Keep this", without an account', () => {
  test('a line kept on a locked plan: one write of the record, the gaps read, Undo byte for byte; kept by choice is never a sell', async ({ page, watch }, info) => {
    test.setTimeout(240_000);
    watch.allow(WORKER_DATA_MISSING);
    await page.clock.setFixedTime(new Date(FIXED_NOW));
    await page.goto(v7('#/'));
    await expect(page.locator('#app [data-screen]')).toBeVisible();
    const planted = JSON.stringify([plan()]);
    await page.evaluate(([k, text]) => sessionStorage.setItem(k, text), [GUEST_KEY, planted]);

    await test.step('opening "What you hold" writes nothing; every line offers Keep this', async () => {
      await page.goto(v7('#/plan/' + ID + '/hold'));
      await expect(page.getByTestId('plan.step.hold')).toHaveText('What you hold');
      await expect(page.getByTestId(`${T}.line.${GILT}.keep.open`)).toHaveText('Keep this');
      await expect(page.getByTestId(`${T}.expected`)).toBeVisible();
      expect(await stored(page), 'opening writes nothing').toBe(planted);
    });

    await test.step('the gilt kept to stand in for 2027/28: ONE write of the record, the settings and the document byte-identical', async () => {
      await page.getByTestId(`${T}.line.${GILT}.keep.open`).click();
      await expect(page.getByTestId(`${T}.line.${GILT}.keep.box`)).toBeVisible();
      await page.getByTestId(`${T}.line.${GILT}.keep.as.rung`).click();
      await page.getByTestId(`${T}.line.${GILT}.keep.year.2027`).click();
      expect(await stored(page), 'choosing writes nothing').toBe(planted);
      await page.getByTestId(`${T}.line.${GILT}.keep.save`).click();
      await expect(page.getByTestId(`${T}.toast`)).toContainText('‘Example Treasury Gilt 2027’ kept.', { timeout: 60_000 });
      const after = JSON.parse(await stored(page))[0];
      const before = JSON.parse(planted)[0];
      expect(after.holdings.lines[GILT].keep).toEqual({ as: 'rung', taxYears: [2027] });
      expect(withoutRecord(after), 'the settings and the plan document untouched').toBe(withoutRecord(before));
      expect(after.holdings.lines.filter((l, i) => i !== GILT)).toEqual(before.holdings.lines.filter((l, i) => i !== GILT));
      await expect(page.getByTestId(`${T}.line.${GILT}.keep.saved`)).toHaveText('Kept: stands in for 2027/28.');
      const gaps = page.getByTestId(`${T}.gaps`);
      await expect(gaps).toBeVisible({ timeout: 60_000 });
      await expect(gaps.locator('[data-line="strategy"]')).toHaveText('Your ladder, with 1 year held another way and 0 lines you keep by choice.');
      await expect(gaps.locator('[data-line="fixed"]')).toHaveText('Example Treasury Gilt 2027 pays a fixed £20,000; it does not rise with prices.');
      await expect(gaps.locator('tbody tr[data-year="2027"]')).toBeVisible();
      const widths = await page.evaluate(() => ({ doc: document.documentElement.scrollWidth, win: window.innerWidth }));
      expect(widths.doc, 'no sideways scroll').toBeLessThanOrEqual(widths.win);
      const text = await page.locator('#app').innerText();
      expect(text).not.toMatch(/undefined|NaN|\[object/);
      expect(text).not.toMatch(BANNED);
      const shot = shots('hold-gaps', info);
      if (shot) await gaps.scrollIntoViewIfNeeded().then(() => page.screenshot({ path: shot, fullPage: true }));
    });

    await test.step('Undo puts the text back byte for byte', async () => {
      await page.getByTestId(`${T}.undo`).click();
      await expect(page.getByTestId(`${T}.toast`)).toContainText('Put back as it was.', { timeout: 60_000 });
      expect(await stored(page)).toBe(planted);
      await expect(page.getByTestId(`${T}.gaps`)).toHaveCount(0);
    });

    await test.step('the share kept by choice, counted toward the gaps: no longer a sell on the move, listed as kept by you', async () => {
      await page.getByTestId(`${T}.toastClose`).click();
      await page.goto(v7('#/plan/' + ID + '/move'));
      await expect(page.locator(`[data-testid="plan.move.sell"] tr[data-key="sell:EXMPL"]`)).toHaveCount(1, { timeout: 60_000 });
      await page.goto(v7('#/plan/' + ID + '/hold'));
      await page.getByTestId(`${T}.line.${SHARE}.keep.open`).click();
      await page.getByTestId(`${T}.line.${SHARE}.keep.as.mine`).click();
      await page.getByTestId(`${T}.line.${SHARE}.keep.gaps`).click();
      await page.getByTestId(`${T}.line.${SHARE}.keep.save`).click();
      await expect(page.getByTestId(`${T}.toast`)).toContainText('‘Example Shares plc’ kept.', { timeout: 60_000 });
      expect(JSON.parse(await stored(page))[0].holdings.lines[SHARE].keep).toEqual({ as: 'mine', fundsGaps: true });
      await expect(page.getByTestId(`${T}.gaps`).locator('[data-line="canFall"]')).toBeVisible();
      await page.goto(v7('#/plan/' + ID + '/move'));
      await expect(page.getByTestId('plan.move.kept')).toContainText('Example Shares plc', { timeout: 60_000 });
      await expect(page.locator(`[data-testid="plan.move.sell"] tr[data-key="sell:EXMPL"]`)).toHaveCount(0);
      const text = await page.locator('#app').innerText();
      expect(text).not.toMatch(BANNED);
    });
  });

  test('the classic planner\'s Transition tab: Keep this is one save, and the page says the same sentences', async ({ page, watch }, info) => {
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
    await expect(box).toContainText('Target:', { timeout: 45_000 });
    await expect(box.locator(`select[data-on-change="keepHolding(${SHARE},this.value)"]`)).toBeVisible();
    const opened = JSON.parse(await stored(page)).find((p) => p.id === ID);
    await box.locator(`select[data-on-change="keepHolding(${SHARE},this.value)"]`).selectOption('mineGaps');
    await expect(box).toContainText('Kept by you', { timeout: 45_000 });
    await expect(box.locator('#transitionGaps [data-line="canFall"]')).toHaveText('What you keep by choice can fall in value; if it is worth less when you sell, the gap is bigger.');
    const after = JSON.parse(await stored(page)).find((p) => p.id === ID);
    expect(after.holdings.lines[SHARE].keep).toEqual({ as: 'mine', fundsGaps: true });
    expect(withoutRecord(after), 'the settings and the plan document untouched').toBe(withoutRecord(opened));
    expect(after.planDocument).toEqual(JSON.parse(planted)[0].planDocument);
    const shot = shots('classic-transition', info);
    if (shot) await page.screenshot({ path: shot, fullPage: true });
  });
});
