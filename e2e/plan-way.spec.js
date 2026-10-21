/**
 * "How the money is taken", without an account (research/v7/way-and-mix.md 2, 7; road-to-7.md step 8a), on the PUBLISHED
 * build. A Pots & Valves draft (corpus 02, "Alex's plan") is planted in the window with a locked gilt ladder (corpus 03,
 * "Sam's plan"). On #/plan/<id>/way the nine ways run in the V7 worker — the engine's chunk loads lazily, the cards fill in
 * and the cost is said; every card's figure equals the same run in Node on the same plan, to the pound, and the cards sit in
 * the Node order (the plan's own first, the other eight ranked). A card opened shows its dials at the engine's defaults; a
 * dial moved tries that one way ("Tried in 1 run") and its figure equals the Node try. "Use this way of drawing", confirmed,
 * writes ONE plan: the stored text equals the Node switch (way.js wayPatch — PlanCommit.switchPatch) folded onto the planted
 * text, nothing else changes, the other plan is byte-identical; Undo puts the text back byte for byte. The locked plan: every
 * card runs, no "Use this" anywhere, the one comparison line beside the document's figure, nothing written. No figure in any
 * address; no sideways scroll.
 *
 * Firebase is never reached: every request outside the site is stopped.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test, expect, PROD, REPO, FIXED_NOW, SLOWDOWN, record } from './helpers/app.js';
import { wayInNode } from './helpers/wayInNode.js';
import { WAY_WRITES, WAY_IDS } from '../src/answers/plan/schema.js';
import { applyPatch } from '../src/answers/plan/about.js';

test.use({ outside: 'block' });

const GUEST_KEY = 'pt_guest_scenarios';
const v7 = (hash) => PROD + '/v7/' + hash;
const TODAY = FIXED_NOW.slice(0, 10);
/** The slowed budget for the nine: nine runs of the one test, about half a second each on the reference machine (way-and-mix.md 10). */
const BUDGET_MS = 40_000;

function draftPlan() {
  const plan = JSON.parse(readFileSync(join(REPO, 'tests', 'fixtures', 'plans', '02-pnv-draft.json'), 'utf8'));
  plan.id = 'WayPlan01';
  plan.planDetails.name = 'Alex’s plan';
  plan.isActive = true;
  delete plan.household;
  return plan;
}
function lockedPlan() {
  const plan = JSON.parse(readFileSync(join(REPO, 'tests', 'fixtures', 'plans', '03-gilt-ladder-runup.json'), 'utf8'));
  plan.id = 'WayLocked02';
  plan.planDetails.name = 'Sam’s plan';
  plan.isActive = false;
  return plan;
}
/** A plan's text with some paths and the stamp taken out: what must be byte-identical across a write. */
function stripped(plan, paths) {
  const out = JSON.parse(JSON.stringify(plan));
  for (const path of [...paths, 'lastModified']) { const parts = path.split('.'); let o = out; for (let i = 0; i < parts.length - 1 && o; i++) o = o[parts[i]]; if (o) delete o[parts[parts.length - 1]]; }
  return JSON.stringify(out);
}
async function plant(page, plans) {
  await page.clock.setFixedTime(new Date(FIXED_NOW));
  await page.goto(v7('#/'));
  await expect(page.locator('#app [data-screen]')).toBeVisible();
  await page.evaluate(([k, text]) => { sessionStorage.setItem(k, text); }, [GUEST_KEY, JSON.stringify(plans)]);
  return JSON.stringify(plans);
}
const stored = (page) => page.evaluate((k) => sessionStorage.getItem(k), GUEST_KEY);
async function awaitNine(page) {
  await expect(page.locator('[data-region="plan-way-answer"]')).toHaveAttribute('data-status', 'done', { timeout: 120_000 });
  await expect(page.locator('[data-region="plan-way-answer"]')).toHaveAttribute('data-has', '1');
}
const tenth = (n) => Math.round(n * 10) / 10;

test.describe('"How the money is taken", without an account', () => {
  test('the nine cards equal the Node run and its order; a dial tried; "Use this" writes the Node switch, Undo byte for byte; the locked plan\'s comparison line', async ({ page, watch }, testInfo) => {
    test.setTimeout(600_000);
    // as on the live site today: the engine worker asks for the market files beside itself (e2e/old-app-unchanged.spec.js)
    watch.allow(/^asked for a file that is not there: \/assets\/data\/(gilts|equity)\.json$/);
    const plan = draftPlan();
    const locked = lockedPlan();
    const planted = await plant(page, [plan, locked]);
    const node = wayInNode(plan, TODAY, { tryWay: { id: 'floor-to-age', dials: { floorToAge: 82 } }, at: FIXED_NOW });

    await test.step('the nine run in the worker; each card\'s figure is the Node run\'s, to a tenth of a point; the cards in the Node order; the cost said', async () => {
      const t0 = Date.now();
      await page.goto(v7('#/plan/WayPlan01/way'));
      await expect(page.locator('#app [data-screen]')).toHaveAttribute('data-screen', 'plan.way');
      await expect(page.getByTestId('plan.step.way')).toHaveText('How the money is taken');
      await awaitNine(page);
      const ms = Date.now() - t0;
      record(testInfo, `way/${testInfo.project.name}.json`, { nineMs: ms, slowdown: SLOWDOWN, nineSlowedMs: ms * SLOWDOWN, budgetMs: BUDGET_MS, method: 'From the address being opened to the nine cards holding their figures (the lazy engine chunk loaded, nine runs of the one test in the worker); measured at full speed and multiplied by the slowdown, which stands for a phone four times slower.' });
      testInfo.annotations.push({ type: 'nine-ways-ms', description: `${ms} ms at full speed; × ${SLOWDOWN} = ${Math.round(ms * SLOWDOWN)} ms against ${BUDGET_MS} ms` });
      expect(ms * SLOWDOWN, 'the nine within the slowed budget').toBeLessThanOrEqual(BUDGET_MS);
      await expect(page.getByTestId('plan.way.ran')).toHaveText(/^Ran the nine ways in \d+(\.\d)? s\.$/);
      const cards = page.locator('[data-way].way-card');
      await expect(cards).toHaveCount(9);
      const ids = await cards.evaluateAll((els) => els.map((el) => el.getAttribute('data-way')));
      expect(ids).toEqual(node.order);
      expect(ids[0]).toBe(node.current);
      await expect(cards.first()).toHaveAttribute('data-open', '1');
      await expect(cards.first()).toHaveAttribute('data-current', '1');
      for (const w of node.ways.ways) {
        const fig = page.getByTestId(`plan.way.${w.id}.figures`);
        await expect(fig).toHaveAttribute('data-affordable', w.affordable ? '1' : '0');
        if (!w.affordable) continue;
        expect(tenth(Number(await fig.getAttribute('data-chance')))).toBe(tenth(w.a.chancePct));
        expect(Number(await fig.getAttribute('data-typical'))).toBe(Math.round(w.a.typicalLeft));
        expect(Number(await fig.getAttribute('data-bad'))).toBe(Math.round(w.a.badCaseLeft));
      }
      // closed cards have "Open" and no box; the plan's own card has its cut dials at the plan's values
      expect(await page.locator('[data-way][data-open="0"] input').count()).toBe(0);
      expect(await page.locator('[data-testid^="plan.way.open."]').count()).toBe(8);
      await expect(page.getByTestId('plan.way.pots-and-valves.cutPct')).toHaveValue('20');
      const widths = await page.evaluate(() => ({ doc: document.documentElement.scrollWidth, win: window.innerWidth }));
      expect(widths.doc, 'no sideways scroll').toBeLessThanOrEqual(widths.win);
      expect(new URL(page.url()).hash).toBe('#/plan/WayPlan01/way');
      const text = await page.locator('#app').innerText();
      expect(text).not.toMatch(/undefined|NaN|\[object/);
      expect(text).not.toMatch(/\bstrategy\b|\ballocation\b|Monte Carlo|\bp10\b/);
      expect(await stored(page), 'running writes nothing').toBe(planted);
    });

    await test.step('open "Floor to an age, then decide": its dial at the engine\'s default; moved to 82 it is tried once, "Tried in 1 run", the figure the Node try\'s', async () => {
      await page.getByTestId('plan.way.open.floor-to-age').click();
      const card = page.locator('[data-way="floor-to-age"]');
      await expect(card).toHaveAttribute('data-open', '1');
      await expect(page.locator('[data-way][data-open="1"]')).toHaveCount(1);
      const dial = page.getByTestId('plan.way.floor-to-age.floorToAge');
      const def = node.ways.ways.find((w) => w.id === 'floor-to-age').dials.defaults.floorToAge;
      await expect(dial).toHaveValue(String(def));
      await expect(card.getByTestId('plan.way.floor-to-age.wrong')).toBeVisible();
      const t0 = Date.now();
      await dial.fill('82');
      const tried = page.getByTestId('plan.way.floor-to-age.tried');
      await expect(tried).toBeVisible({ timeout: 60_000 });
      testInfo.annotations.push({ type: 'try-ms', description: `${Date.now() - t0} ms` });
      await expect(tried).toHaveText(/^Tried in 1 run( \(\d+(\.\d)? s\))?\.$/);
      const fig = page.getByTestId('plan.way.floor-to-age.figures');
      await expect(fig).toHaveAttribute('data-stale', '0');
      expect(tenth(Number(await fig.getAttribute('data-chance')))).toBe(tenth(node.tried.a.chancePct));
      expect(Number(await fig.getAttribute('data-typical'))).toBe(Math.round(node.tried.a.typicalLeft));
      expect(await stored(page), 'a try writes nothing').toBe(planted);
    });

    await test.step('"Use this way of drawing" → the confirm → "Use it": ONE plan written, equal to the Node switch folded onto the planted text; the other plan byte-identical; the toast; Undo byte for byte', async () => {
      await page.getByTestId('plan.way.use.floor-to-age').click();
      const confirm = page.getByTestId('plan.way.confirmBox');
      await expect(confirm).toBeVisible();
      await expect(confirm).toContainText('Your plan will be drawn as Floor to an age, then decide.');
      await page.getByTestId('plan.way.confirm').click();
      const toast = page.getByTestId('plan.way.toast');
      await expect(toast).toBeVisible({ timeout: 60_000 });
      await expect(toast).toContainText('Saved. The plan is now drawn as Floor to an age, then decide.');
      const after = JSON.parse(await stored(page));
      const before = JSON.parse(planted);
      expect(JSON.stringify(after[1]), 'the locked plan is not touched').toBe(JSON.stringify(before[1]));
      expect(stripped(after[0], WAY_WRITES)).toBe(stripped(before[0], WAY_WRITES));
      expect(node.patch.ok).toBe(true);
      expect(JSON.stringify(after[0])).toBe(JSON.stringify(applyPatch(before[0], { ...node.patch.patch, lastModified: FIXED_NOW })));
      expect(after[0].stressTool.settings.strategyId).toBe('floor-to-age');
      expect(after[0].stressTool.settings.strategyParams).toEqual({ floorToAge: 82 });
      expect(after[0].strategy).toMatchObject({ id: 'floor-to-age', params: { floorToAge: 82 }, lockedAt: FIXED_NOW });
      expect(after[0].stressTool.settings.strategyState['pots-and-valves'].savedAt).toBe(TODAY);
      // the page re-reads the plan: its own way is now Floor to an age, first and open; the nine run again on the saved plan
      await expect(page.locator('[data-way].way-card').first()).toHaveAttribute('data-way', 'floor-to-age', { timeout: 60_000 });
      await page.getByTestId('plan.way.undo').click();
      await expect(page.getByTestId('plan.way.toast')).toContainText('Put back as it was.', { timeout: 60_000 });
      expect(await stored(page), 'Undo puts the text back byte for byte').toBe(planted);
    });

    await test.step('the locked plan: every card runs, no "Use this" anywhere, a card opened says the one comparison line beside the document\'s figure, nothing written', async () => {
      await page.goto(v7('#/plan/WayLocked02/way'));
      await expect(page.locator('#app [data-screen]')).toHaveAttribute('data-screen', 'plan.way');
      await expect(page.getByTestId('plan.way.locked')).toContainText('This plan is locked');
      await awaitNine(page);
      await expect(page.locator('[data-way].way-card')).toHaveCount(9);
      await expect(page.locator('[data-way].way-card').first()).toHaveAttribute('data-way', 'full-il-gilt');
      expect(await page.locator('[data-testid^="plan.way.use."]').count()).toBe(0);
      await page.getByTestId('plan.way.open.floor-to-age').click();
      const compare = page.getByTestId('plan.way.compare');
      await expect(compare).toBeVisible({ timeout: 60_000 });
      await expect(compare).toContainText('Your plan as locked lasts');
      await expect(compare).toContainText('on Full index-linked gilt ladder; Floor to an age, then decide would have lasted');
      expect(await compare.innerText()).not.toMatch(/unlock/i);
      expect(await page.locator('[data-testid="plan.way.compare"]').count()).toBe(1);
      expect(await page.locator('[data-testid^="plan.way.use."]').count()).toBe(0);
      expect(await stored(page), 'the locked plan is not touched').toBe(planted);
      expect(new URL(page.url()).hash).toBe('#/plan/WayLocked02/way');
      for (const id of WAY_IDS) await expect(page.locator(`[data-way="${id}"]`)).toHaveCount(1);
    });
  });
});
