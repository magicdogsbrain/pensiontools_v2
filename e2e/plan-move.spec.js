/**
 * "Moving to your plan's mix", without an account (research/v7/holdings-and-move.md §3, §7; road-to-7.md step 10), on the
 * PUBLISHED build. The locked gilt ladder in its run-up (corpus 03, "Sam's plan", 8 lines, 23 rungs) and the locked Buckets
 * plan with its shares line cut by a third (corpus 04, "Alex's plan", so there is something to buy and sell) are planted in
 * the window. On #/plan/<id>/move: "Optional…" on its face; the status in gilts bought equals the Node reading; the order
 * sheet's first rung is the document's; a Done tick writes ONE plan equal to the Node patch (move.js tickPatch — the whole
 * transition object) folded onto the planted text, the other plan byte-identical, Undo byte for byte; on the pot plan
 * "What if I keep what I hold?" runs once in the V7 worker and its headline equals the same run in Node to the pound, the
 * cost said, nothing written. The last line is always "Illustration, not advice. Nothing here places an order." No figure in
 * any address; no sideways scroll; none of the planner's words. Firebase is never reached.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test, expect, PROD, REPO, FIXED_NOW } from './helpers/app.js';
import { holdInNode } from './helpers/holdInNode.js';
import { MOVE_WRITES } from '../src/answers/plan/schema.js';
import { applyPatch } from '../src/answers/plan/about.js';

test.use({ outside: 'block' });

const GUEST_KEY = 'pt_guest_scenarios';
const v7 = (hash) => PROD + '/v7/' + hash;
const TODAY = FIXED_NOW.slice(0, 10);

function plans() {
  const sam = JSON.parse(readFileSync(join(REPO, 'tests', 'fixtures', 'plans', '03-gilt-ladder-runup.json'), 'utf8'));
  const alex = JSON.parse(readFileSync(join(REPO, 'tests', 'fixtures', 'plans', '04-buckets-running.json'), 'utf8'));
  sam.id = 'MovePlan01'; sam.planDetails.name = 'Sam’s plan'; sam.isActive = true; delete sam.household;
  alex.id = 'MoveMix02'; alex.planDetails.name = 'Alex’s plan'; alex.isActive = false; delete alex.household;
  // a third of the shares line sold into cash: shares to buy back, cash to sell down (derived here, never a new fixture)
  const shares = alex.holdings.lines[0].value;
  alex.holdings.lines[0].value = Math.round(shares * 2 / 3);
  alex.holdings.lines[2].value = Math.round(alex.holdings.lines[2].value + shares / 3);
  return { sam, alex };
}
function stripped(plan, paths) {
  const out = JSON.parse(JSON.stringify(plan));
  for (const path of [...paths, 'lastModified']) { const parts = path.split('.'); let o = out; for (let i = 0; i < parts.length - 1 && o; i++) o = o[parts[i]]; if (o) delete o[parts[parts.length - 1]]; }
  return JSON.stringify(out);
}
async function plant(page, list) {
  await page.clock.setFixedTime(new Date(FIXED_NOW));
  await page.goto(v7('#/'));
  await expect(page.locator('#app [data-screen]')).toBeVisible();
  await page.evaluate(([k, text]) => { sessionStorage.setItem(k, text); }, [GUEST_KEY, JSON.stringify(list)]);
  return JSON.stringify(list);
}
const stored = (page) => page.evaluate((k) => sessionStorage.getItem(k), GUEST_KEY);
const BANNED = /\bstrategy\b|\bscenario\b|\bwrappers?\b|\bholdings\b|\btransition\b|\bportfolio\b|\bnominal\b|run-?up|Monte Carlo|\bMC\b|\bp10\b|about £/i;
const T = 'plan.move';
const FOOTER = 'Illustration, not advice. Nothing here places an order.';

test.describe('"Moving to your plan\'s mix", without an account', () => {
  test('the ladder: the status, the order sheet and the lists as Node reads them; a tick writes the Node patch, Undo byte for byte; the pot plan: the one run on the held mix equals Node, nothing written', async ({ page, watch }, testInfo) => {
    test.setTimeout(600_000);
    watch.allow(/^asked for a file that is not there: \/assets\/data\/(gilts|equity)\.json$/);
    const { sam, alex } = plans();
    const planted = await plant(page, [sam, alex]);
    const node = holdInNode(sam, TODAY, { tick: { key: 'gilt:T29', done: true } });
    expect(node.move.kind).toBe('ladder');
    expect(node.move.locked).toBe(true);
    expect(node.tick.ok).toBe(true);
    expect(node.move.buy[0]).toBe('gilt:T29');

    await test.step('the step: "Optional…" on its face, the status in gilts bought, the cash to hold now, Buy with a Done tick each, the order sheet\'s first rung as the document has it, "How to read this" closed, the last line; nothing written on opening', async () => {
      await page.goto(v7('#/plan/MovePlan01/move'));
      await expect(page.locator('#app [data-screen]')).toHaveAttribute('data-screen', 'plan.move');
      await expect(page.getByTestId('plan.step.move')).toHaveText('Moving to your plan’s mix');
      await expect(page.getByTestId(`${T}.optional`)).toHaveText('Optional. Skipping it means what you hold may not match what the plan was tested on.');
      await expect(page.getByTestId(`${T}.status.line`)).toHaveText(`${node.move.rungs.bought} of ${node.move.rungs.total} gilts bought; ${node.move.progressPct}% of the plan’s mix held.`);
      await expect(page.locator(`[data-testid="${T}.buy"] tbody tr`)).toHaveCount(node.move.buy.length);
      await expect(page.locator(`[data-testid="${T}.sell"] tbody tr`)).toHaveCount(node.move.sell.length);
      await expect(page.locator(`[data-testid="${T}.cash.table"] tr[data-row="runUp"]`)).toBeVisible();
      await expect(page.locator(`[data-testid="${T}.sheet.table"] tbody tr`)).toHaveCount(node.move.sheet);
      const first = page.locator(`[data-testid="${T}.sheet.table"] tbody tr`).first();
      await expect(first).toHaveAttribute('data-bought', node.move.sheetFirst.bought);
      await expect(first).toContainText(node.move.sheetFirst.tidm);
      await expect(first).toContainText(node.move.sheetFirst.sedol);
      await expect(first).toContainText(node.move.sheetFirst.matures);
      await expect(first).toContainText(node.move.sheetFirst.cost);
      await expect(page.getByTestId(`${T}.cost.ladder`)).toContainText(`${node.move.uncovered} tax years`);
      await expect(page.getByTestId(`${T}.how.open`)).toHaveText('How to read this');
      await page.getByTestId(`${T}.how.open`).click();
      await expect(page.locator(`[data-testid="${T}.how.items"] li`)).toHaveCount(4);
      await expect(page.getByTestId(`${T}.footer`)).toHaveText(FOOTER);
      const widths = await page.evaluate(() => ({ doc: document.documentElement.scrollWidth, win: window.innerWidth }));
      expect(widths.doc, 'no sideways scroll').toBeLessThanOrEqual(widths.win);
      expect(new URL(page.url()).hash).toBe('#/plan/MovePlan01/move');
      const text = await page.locator('#app').innerText();
      expect(text).not.toMatch(/undefined|NaN|\[object/);
      expect(text).not.toMatch(BANNED);
      expect(text.trim().endsWith(FOOTER) || text.includes(FOOTER)).toBe(true);
      expect(await stored(page), 'opening writes nothing').toBe(planted);
    });

    await test.step('a Done tick: ONE plan written equal to the Node patch (the whole transition object), the other byte-identical; the status counts it; Undo puts the text back byte for byte', async () => {
      await page.getByTestId(`${T}.tick.gilt:T29`).check();
      const toast = page.getByTestId(`${T}.toast`);
      await expect(toast).toBeVisible({ timeout: 60_000 });
      await expect(toast).toContainText('ticked as placed');
      const after = JSON.parse(await stored(page));
      const before = JSON.parse(planted);
      expect(stripped(after[0], MOVE_WRITES)).toBe(stripped(before[0], MOVE_WRITES));
      expect(JSON.stringify(after[0])).toBe(JSON.stringify(applyPatch(before[0], { ...node.tick.patch, lastModified: FIXED_NOW })));
      expect(after[0].transition).toEqual({ done: { 'gilt:T29': TODAY } });
      expect(JSON.stringify(after[1]), 'the other plan untouched').toBe(JSON.stringify(before[1]));
      await expect(page.locator(`[data-testid="${T}.buy"] tbody tr[data-key="gilt:T29"]`)).toHaveAttribute('data-done', '1', { timeout: 60_000 });
      await page.getByTestId(`${T}.undo`).click();
      await expect(page.getByTestId(`${T}.toast`)).toContainText('Put back as it was.', { timeout: 60_000 });
      expect(await stored(page), 'Undo puts the text back byte for byte').toBe(planted);
    });

    await test.step('the pot plan: "What if I keep what I hold?" runs once in the worker; the headline equals the same run in Node; "Tried in 1 run"; nothing written', async () => {
      const mix = holdInNode(alex, TODAY, { held: true });
      expect(mix.move.kind).toBe('buckets');
      expect(mix.move.buy).toEqual(['bucket:shares']);
      expect(mix.held.affordable).toBe(true);
      await page.goto(v7('#/plan/MoveMix02/move'));
      await expect(page.locator('#app [data-screen]')).toHaveAttribute('data-screen', 'plan.move');
      await expect(page.getByTestId(`${T}.status.line`)).toHaveText(`${mix.move.progressPct}% of the plan’s mix held; ${mix.move.movesDone} of ${mix.move.moves} moves ticked off.`);
      await expect(page.locator(`[data-testid="${T}.buy"] tbody tr`)).toHaveCount(1);
      await expect(page.locator(`[data-testid="${T}.sell"] tbody tr`)).toHaveCount(1);
      const t0 = Date.now();
      await page.getByTestId(`${T}.cost.button`).click();
      const result = page.getByTestId(`${T}.cost.result`);
      await expect(result).toBeVisible({ timeout: 300_000 });
      testInfo.annotations.push({ type: 'held-ms', description: `${Date.now() - t0} ms` });
      const p = mix.held.held.pcts;
      await expect(page.getByTestId(`${T}.cost.headline`)).toHaveText(`Tested on the mix you hold today (shares ${p.shares}%, bonds ${p.bonds}%, gold and trend ${p.diversifiers}%, cash ${p.cash}%), the plan lasts ${mix.held.words}; on its own mix, ${mix.move.own.words}.`);
      await expect(page.getByTestId(`${T}.cost.ran`)).toHaveText(/^Tried in 1 run \(\d+(\.\d)? s\)\.$/);
      await expect(page.getByTestId(`${T}.footer`)).toHaveText(FOOTER);
      const text = await page.locator('#app').innerText();
      expect(text).not.toMatch(BANNED);
      expect(text).toContain('in a bad case (the worst 1 in 10)');
      expect(await stored(page), 'the run writes nothing').toBe(planted);
      expect(new URL(page.url()).hash).toBe('#/plan/MoveMix02/move');
    });
  });
});
