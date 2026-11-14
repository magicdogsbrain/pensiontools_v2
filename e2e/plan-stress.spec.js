/**
 * "Try the bad years" on a plan (7.9.0; the build spec's §2.1, §2.3, §9) and "Test what you keep against your plan" (7.7.0),
 * without an account, on the PUBLISHED build. Renamed from plan-keep-test.spec.js: its two tests are unchanged.
 *
 * The bad years: an unlocked pots-and-valves plan ("Alex's plan", the corpus's fixture 02, fictional) streams its rows on
 * "Does it last?" within the panel's budget, As planned first and equal to the page's own figure; "I accept this risk" on
 * "Spending a tenth more" asks first, then is ONE write of the list of agreements (nothing else changes), says the accepted
 * line, and Withdraw takes it off in one more; the classic planner's Scenarios page gives the same rows. A locked ladder
 * ("Sam's plan", fixture 20, keeping a world fund by choice) says why its market rows are not tried and shows the keep
 * agreement's state on the held rows, never an accept. Opening writes nothing and runs nothing; no sideways scroll.
 *
 * The keep test: the locked ladder keeps its world fund by choice instead of buying its last rungs, and expects money from
 * a pension elsewhere. On #/plan/<id>/hold: opening writes nothing and runs nothing; the test runs only on its button (in the
 * worker) and shows the plan as locked beside the plan as held; "I accept this risk" asks first, then is ONE write of the
 * list of agreements (the settings and the plan document byte-identical); the home says the agreed line; Undo puts the text
 * back byte for byte. The classic planner's Transition tab runs the same test and agrees the same way. No sideways scroll;
 * none of the planner's words. Firebase is never reached.
 */
import { readFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { test, expect, PROD, REPO, FIXED_NOW, V7_PATH, CLASSIC_PATH, WORKER_DATA_MISSING, PANEL_BUDGET, SLOWDOWN, record } from './helpers/app.js';
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

// ---- "Try the bad years" (7.9.0) ------------------------------------------------------------------------------------------

const PNV_ID = 'BadYears79';
const S = 'plan.lasts.stress';
const ROWS = ['asPlanned', 'fall', 'lower', 'spend', 'prices'];
function pnvPlan() {
  const p = JSON.parse(readFileSync(join(REPO, 'tests', 'fixtures', 'plans', '02-pnv-draft.json'), 'utf8'));
  p.id = PNV_ID; p.planDetails.name = 'Alex’s plan'; p.isActive = true; delete p.household;
  return p;
}
/** Each row's lines, as the screen says them (the panel's own `.stress-line`s), by row id. */
const rowLines = (page, root) => page.locator(root).evaluate((el) => Object.fromEntries([...el.querySelectorAll('li.stress-row[data-row]')].map((li) => [li.getAttribute('data-row'), [...li.querySelectorAll('.stress-line')].map((x) => x.textContent.trim())])));

test.describe('"Try the bad years", without an account', () => {
  test('an unlocked plan: the rows stream within the budget, As planned equals the page\'s figure; "I accept this risk" one write, the accepted line, Withdraw; the classic planner gives the same rows', async ({ page, watch }, info) => {
    test.setTimeout(300_000);
    watch.allow(WORKER_DATA_MISSING);
    await page.clock.setFixedTime(new Date(FIXED_NOW));
    await page.goto(v7('#/'));
    await expect(page.locator('#app [data-screen]')).toBeVisible();
    const planted = JSON.stringify([pnvPlan()]);
    await page.evaluate(([k, text]) => sessionStorage.setItem(k, text), [GUEST_KEY, planted]);
    let v7Rows = null;

    await test.step('opening: the page\'s own figure; the panel with its button; nothing run, nothing written', async () => {
      await page.goto(v7('#/plan/' + PNV_ID + '/lasts?focus=stress'));
      await expect(page.locator('[data-region="plan-lasts-answer"]')).toHaveAttribute('data-status', 'done', { timeout: 90_000 });
      await expect(page.getByTestId(S)).toHaveAttribute('data-status', 'idle');
      // the address names the panel: once it is drawn, its heading has the keyboard and is in view
      await expect(page.locator('[data-focus-for="plan.stress"]')).toBeFocused({ timeout: 15_000 });
      await expect(page.locator('[data-focus-for="plan.stress"]')).toBeInViewport();
      await expect(page.getByTestId(`${S}.rows`)).toHaveCount(0);
      await expect(page.getByTestId(`${S}.run`)).toHaveText('Try the bad years');
      expect(await stored(page), 'opening writes nothing').toBe(planted);
    });

    await test.step('the press: As planned first, every row within the budget; As planned is "Does it last?"\'s own figure', async () => {
      const t0 = Date.now();
      await page.getByTestId(`${S}.run`).click();
      await expect(page.getByTestId(`${S}.asPlanned`)).toHaveAttribute('data-status', 'done', { timeout: 120_000 });
      const firstMs = Date.now() - t0;
      await expect(page.getByTestId(S)).toHaveAttribute('data-status', 'done', { timeout: 180_000 });
      const ms = Date.now() - t0;
      record(info, `stress/${info.project.name}.json`, { firstRowMs: firstMs, panelMs: ms, slowdown: SLOWDOWN, budgetMs: PANEL_BUDGET, method: 'From the press to the last row on the page (five rows, one worker call each, the lazy engine already loaded by the page\'s own run); measured at full speed against 9.6 s × the slowdown.' });
      info.annotations.push({ type: 'stress-panel-ms', description: `first row ${firstMs} ms, all ${ms} ms at full speed, against ${PANEL_BUDGET} ms` });
      expect(ms, 'every row within the panel\'s budget').toBeLessThanOrEqual(PANEL_BUDGET);
      expect(await page.locator(`[data-testid="${S}.rows"] > li.stress-row`).evaluateAll((els) => els.map((e) => e.getAttribute('data-row')))).toEqual(ROWS);
      const head = (await page.getByTestId('plan.lasts.result.headline').innerText()).trim();
      const sub = (await page.getByTestId('plan.lasts.result.sub').innerText()).trim();
      const asPlanned = page.getByTestId(`${S}.asPlanned`);
      await expect(asPlanned.locator('[data-weighted]')).toHaveText(head);
      await expect(asPlanned.locator('[data-fixed="age"]')).toHaveText(sub);
      await expect(page.getByTestId(`${S}.fall`).locator('[data-weighted]')).toContainText('(as planned: ');
      await expect(page.getByTestId('plan.lasts.stress.badStarts')).toHaveText('Real bad starts, one at a time');
      expect(await stored(page), 'trying writes nothing').toBe(planted);
      await noSideways(page);
      const text = await page.getByTestId(S).innerText();
      expect(text).not.toMatch(/undefined|NaN|\[object|\{\w+\}/);
      expect(text).not.toMatch(/one every [\d,]+ months/);
      expect(text).not.toMatch(BANNED);
      v7Rows = await rowLines(page, `[data-testid="${S}.rows"]`);
      const shot = shots('stress-panel', info);
      if (shot) await page.getByTestId(S).screenshot({ path: shot });
    });

    await test.step('"I accept this risk" on a tenth more: asks first, then ONE write of the list; the accepted line; Withdraw is one more', async () => {
      await page.getByTestId(`${S}.spend.accept`).click();
      await expect(page.getByTestId(`${S}.spend.confirm`)).toBeVisible();
      await expect(page.getByTestId(`${S}.spend.confirm`)).toContainText('It is not advice');
      expect(await stored(page), 'asking writes nothing').toBe(planted);
      await page.getByTestId(`${S}.spend.confirm.yes`).click();
      await expect(page.getByTestId(`${S}.spend.accepted`)).toHaveAttribute('data-status', 'agreed', { timeout: 60_000 });
      await expect(page.getByTestId(`${S}.spend.accepted`)).toContainText('You accepted this on 30 September 2026');
      // accepted: Withdraw is the row's one button, and the row stays in view; the toast never covers a column of the page
      await expect(page.getByTestId(`${S}.spend.accept`)).toHaveCount(0);
      await expect(page.getByTestId(`${S}.spend.accepted`)).toBeInViewport();
      const box = await page.getByTestId('plan.lasts.stress.toast').boundingBox();
      const vw = page.viewportSize().width;
      if (box && vw <= 600) expect(box.width, 'the toast is a full-width line on a phone, never a narrow column').toBeGreaterThanOrEqual(vw - 32 - 1);
      const after = JSON.parse(await stored(page))[0];
      expect(after.planAmendments).toHaveLength(1);
      expect(after.planAmendments[0]).toMatchObject({ kind: 'stress', test: { id: 'spend', inputs: { shock: { kind: 'spend', factor: 1.1 } } } });
      expect(Object.keys(after.planAmendments[0].test.inputs).sort()).toEqual(['firstTaxYear', 'shock', 'startAge', 'strategyId', 'years']);
      expect(withoutAgreements(after), 'nothing else changed').toBe(withoutAgreements(JSON.parse(planted)[0]));
      // the rows stay (accepting moves no key)
      await expect(page.getByTestId(S)).toHaveAttribute('data-status', 'done');
      const shot = shots('stress-accepted', info);
      if (shot) await page.getByTestId(`${S}.spend`).screenshot({ path: shot });
      await page.getByTestId(`${S}.spend.withdraw`).click();
      await expect(page.getByTestId(`${S}.spend.accepted`)).toHaveCount(0, { timeout: 60_000 });
      const back = JSON.parse(await stored(page))[0];
      expect(back.planAmendments).toEqual([]);
      expect(withoutAgreements(back)).toBe(withoutAgreements(JSON.parse(planted)[0]));
    });

    await test.step('the classic planner\'s Scenarios page: the same rows, line for line, and the named stresses below with no figure of their own', async () => {
      const request = makeRequest({ planId: PNV_ID, place: 'badYears', back: '#/plan/' + PNV_ID + '/lasts', at: FIXED_NOW });
      await page.evaluate(([rk, req]) => sessionStorage.setItem(rk, req), [OPEN_PLACE_KEY, request]);
      await page.goto(PROD + CLASSIC_PATH);
      await expect(page.locator('#mainApp')).toBeVisible({ timeout: 45_000 });
      await expect(page.locator('#stress-scenarios')).toBeVisible({ timeout: 45_000 });
      await expect(page.locator('#stressPanelTitle')).toHaveText('Try the bad years');
      await expect(page.locator('#stressPanel')).toHaveAttribute('data-status', 'idle', { timeout: 30_000 });
      await page.locator('#stressPanelRun').click();
      await expect(page.locator('#stressPanel')).toHaveAttribute('data-status', 'done', { timeout: 180_000 });
      const classic = await rowLines(page, '#stressRows');
      expect(Object.keys(classic)).toEqual(ROWS);
      expect(classic).toEqual(v7Rows);
      await expect(page.locator('#scenResults [data-stress-hint]')).toBeVisible({ timeout: 60_000 });
      await expect(page.locator('#scenResults')).toContainText("real starts behind this plan's figure above");
      await expect(page.locator('#scenResults')).not.toContainText('behind your figure of');
      await noSideways(page);
      const shot = shots('classic-scenarios', info);
      if (shot) await page.locator('#stress-scenarios').screenshot({ path: shot });
    });
  });

  test('a locked ladder: the market rows say why they are not tried; the held rows show the keep agreement\'s state and never an accept', async ({ page, watch }, info) => {
    test.setTimeout(240_000);
    watch.allow(WORKER_DATA_MISSING);
    await page.clock.setFixedTime(new Date(FIXED_NOW));
    await page.goto(v7('#/'));
    await expect(page.locator('#app [data-screen]')).toBeVisible();
    const planted = JSON.stringify([plan()]);
    await page.evaluate(([k, text]) => sessionStorage.setItem(k, text), [GUEST_KEY, planted]);
    // the way in from What you hold: "See it beside the other bad years" lands on the panel, its heading focused and in view
    // (the panel is drawn only once "Does it last?" has its answer, a few screens down the page)
    await page.goto(v7('#/plan/' + ID + '/hold'));
    await page.getByTestId('plan.hold.keepTest.badYears').click();
    await expect(page.getByTestId(S)).toHaveAttribute('data-status', 'idle', { timeout: 90_000 });
    expect(page.url()).toContain('#/plan/' + ID + '/lasts?focus=stress');
    await expect(page.locator('[data-focus-for="plan.stress"]')).toBeFocused({ timeout: 15_000 });
    await expect(page.locator('[data-focus-for="plan.stress"]')).toBeInViewport();
    await expect(page.getByTestId(`${S}.keep`)).toHaveAttribute('data-status', 'untested');
    await page.getByTestId(`${S}.run`).click();
    await expect(page.getByTestId(S)).toHaveAttribute('data-status', 'done', { timeout: 180_000 });
    expect(await page.locator(`[data-testid="${S}.rows"] > li.stress-row`).evaluateAll((els) => els.map((e) => e.getAttribute('data-row')))).toEqual([...ROWS, 'asHeld', 'heldHalf']);
    for (const id of ['fall', 'lower', 'spend', 'prices']) await expect(page.getByTestId(`${S}.${id}.na`)).toHaveAttribute('data-na', 'lockedLadder');
    // the keep agreement's state once, on "As you hold it", with the one thing What you hold can do now; never an accept
    await expect(page.getByTestId(`${S}.asHeld.keep`)).toHaveAttribute('data-status', 'untested');
    await expect(page.getByTestId(`${S}.asHeld.hold`)).toHaveAttribute('href', '#/plan/' + ID + '/hold');
    await expect(page.getByTestId(`${S}.asHeld.hold`)).toHaveText('Accept it on What you hold.');
    await expect(page.getByTestId(`${S}.heldHalf.keep`)).toHaveCount(0);
    for (const id of ['asHeld', 'heldHalf']) await expect(page.getByTestId(`${S}.${id}.accept`)).toHaveCount(0);
    // the fall row is not tried on a locked ladder: no walk through real bad starts under it
    await expect(page.getByTestId('plan.lasts.stress.badStarts')).toHaveCount(0);
    expect(await stored(page), 'trying writes nothing').toBe(planted);
    await noSideways(page);
    const text = await page.getByTestId(S).innerText();
    expect(text).not.toMatch(/undefined|NaN|\[object|\{\w+\}/);
    const shot = shots('stress-ladder', info);
    if (shot) await page.getByTestId(S).screenshot({ path: shot });
  });
});
