/**
 * "The mix", without an account (research/v7/way-and-mix.md 3, 7; road-to-7.md step 8b), on the PUBLISHED build. A Pots &
 * Valves draft held as its own split (corpus 02, "Alex's plan") is planted in the window with a locked Buckets plan (corpus
 * 04, "Sam's plan"). On #/plan/<id>/mix: the split's four boxes with their £; "What it does in a bad case" for the bond tent
 * runs in the V7 worker and its figure equals the same try in Node to the pound, the cost said; a risk level with the slice
 * of gold and trend funds saved writes ONE plan equal to the Node patch (mix.js mixPatch) folded onto the planted text, the
 * other plan byte-identical, Undo byte for byte; a list pasted from a platform is read as Node reads it, the total line left
 * out and said; "Which mix lasts best?" runs the eight cells, each equal to the Node run, the best marked, "Tried in 8 runs";
 * "Use this mix", confirmed, writes the Node patch (useMixPatch), Undo byte for byte. The locked plan: the lines read-only,
 * no box, the tent's note for Buckets, the slice tried with the document's figure beside, no "Use this mix", nothing written.
 * No figure in any address; no sideways scroll; none of the planner's words.
 *
 * Firebase is never reached: every request outside the site is stopped.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test, expect, PROD, REPO, FIXED_NOW } from './helpers/app.js';
import { mixInNode } from './helpers/tryInNode.js';
import { MIX_WRITES } from '../src/answers/plan/schema.js';
import { applyPatch } from '../src/answers/plan/about.js';

test.use({ outside: 'block' });

const GUEST_KEY = 'pt_guest_scenarios';
const v7 = (hash) => PROD + '/v7/' + hash;
const TODAY = FIXED_NOW.slice(0, 10);
const PASTE = 'Fund\tTicker\tValue\nVanguard FTSE All-World UCITS ETF\tVWRP\t£300,000\niShares UK Gilts 0-5yr UCITS ETF\tIGLS\t£100,000\nTotal\t\t£400,000';

function draftPlan() {
  const plan = JSON.parse(readFileSync(join(REPO, 'tests', 'fixtures', 'plans', '02-pnv-draft.json'), 'utf8'));
  plan.id = 'MixPlan01';
  plan.planDetails.name = 'Alex’s plan';
  plan.isActive = true;
  delete plan.household;
  return plan;
}
function lockedPlan() {
  const plan = JSON.parse(readFileSync(join(REPO, 'tests', 'fixtures', 'plans', '04-buckets-running.json'), 'utf8'));
  plan.id = 'MixLocked02';
  plan.planDetails.name = 'Sam’s plan';
  plan.isActive = false;
  delete plan.household;
  return plan;
}
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
const pounds = (n) => '£' + Math.round(n).toLocaleString('en-GB');
const BANNED = /\bstrategy\b|\ballocation\b|\bportfolio\b|Monte Carlo|\bp10\b|\bsleeve\b|\bholdings?\b/i;

test.describe('"The mix", without an account', () => {
  test('the split with its £; the tent tried equals Node; a level saved is the Node patch, Undo byte for byte; a paste read as Node reads it; the eight cells equal Node and "Use this mix" writes the Node patch; the locked plan read-only', async ({ page, watch }, testInfo) => {
    test.setTimeout(900_000);
    watch.allow(/^asked for a file that is not there: \/assets\/data\/(gilts|equity)\.json$/);
    const plan = draftPlan();
    const locked = lockedPlan();
    const planted = await plant(page, [plan, locked]);
    const LEVEL = { held: 'level', level: 'cautious', sleeve: 'yes' };
    const node = mixInNode(plan, TODAY, { tryKind: 'tent', typed: LEVEL, cell: { key: 'balanced', tent: true }, paste: { text: PASTE, wrapper: 'SIPP' } });
    expect(node.saved.held).toBe('split');

    await test.step('the step: held as your own split, the four boxes at the saved percents with their £ on this pot; the derived lines; no sideways scroll; none of the planner\'s words', async () => {
      await page.goto(v7('#/plan/MixPlan01/mix'));
      await expect(page.locator('#app [data-screen]')).toHaveAttribute('data-screen', 'plan.mix');
      await expect(page.getByTestId('plan.step.mix')).toHaveText('The mix');
      await expect(page.getByTestId('plan.mix.held.split')).toBeChecked();
      await expect(page.getByTestId('plan.mix.shares')).toHaveValue(String(node.saved.pcts.shares));
      await expect(page.getByTestId('plan.mix.bonds')).toHaveValue(String(node.saved.pcts.bonds));
      await expect(page.getByTestId('plan.mix.cash')).toHaveValue(String(node.saved.pcts.cash));
      await expect(page.getByTestId('plan.mix.split.amounts')).toContainText(`${pounds(node.saved.amounts.equity)} shares, ${pounds(node.saved.amounts.bond)} bonds`);
      await expect(page.locator('[data-line="mix.held.split"]')).toContainText(pounds(node.saved.pot));
      await expect(page.locator('[data-line="mix.tent.off"]')).toHaveCount(1);
      await expect(page.locator('[data-line="mix.sleeve.off"]')).toHaveCount(1);
      await expect(page.getByTestId('plan.mix.tent.no')).toBeChecked();
      const widths = await page.evaluate(() => ({ doc: document.documentElement.scrollWidth, win: window.innerWidth }));
      expect(widths.doc, 'no sideways scroll').toBeLessThanOrEqual(widths.win);
      expect(new URL(page.url()).hash).toBe('#/plan/MixPlan01/mix');
      const text = await page.locator('#app').innerText();
      expect(text).not.toMatch(/undefined|NaN|\[object/);
      expect(text).not.toMatch(BANNED);
      expect(await stored(page), 'opening writes nothing').toBe(planted);
    });

    await test.step('"What it does in a bad case" for the tent: tried in the worker, the figure the Node try\'s to the pound, the cost said; put away, gone; nothing written', async () => {
      const t0 = Date.now();
      await page.getByTestId('plan.mix.try.tent.button').click();
      const result = page.getByTestId('plan.mix.try.tent.result');
      await expect(result).toBeVisible({ timeout: 120_000 });
      testInfo.annotations.push({ type: 'tent-try-ms', description: `${Date.now() - t0} ms` });
      expect(node.tried.on).toBe(true);
      expect(node.tried.affordable).toBe(true);
      const line = await result.locator('[data-line="mixTry.tent.withTried"]').innerText();
      expect(line).toContain(`With the tent, in a bad case (the worst 1 in 10) ${pounds(node.tried.a.badCaseLeft)} is left at the end; without, ${pounds(node.tried.base.badCaseLeft)}.`);
      await expect(result.getByTestId('plan.mix.try.tent.ran')).toHaveText(/^Tried in (1 run|2 runs) \(\d+(\.\d)? s\)\.$/);
      await page.getByTestId('plan.mix.try.tent.close').click();
      await expect(result).toHaveCount(0);
      await expect(page.getByTestId('plan.mix.try.tent.button')).toBeVisible();
      expect(await stored(page), 'a try writes nothing').toBe(planted);
    });

    await test.step('a risk level with the slice: each level says its £; wrong figures are said; Save writes ONE plan equal to the Node patch, the other byte-identical; Undo byte for byte', async () => {
      await page.getByTestId('plan.mix.held.level').check();
      await expect(page.getByTestId('plan.mix.level.cautious')).toBeVisible();
      await expect(page.getByTestId('plan.mix.level.cautious.amounts')).toContainText('shares');
      await page.getByTestId('plan.mix.level.cautious').check();
      await page.getByTestId('plan.mix.sleeve.yes').check();
      await expect(page.getByTestId('plan.mix.level.cautious.amounts')).toContainText('gold and trend');
      await expect(page.locator('[data-line="mix.held.level"]')).toContainText('cautious');
      await page.getByTestId('plan.mix.save').click();
      const toast = page.getByTestId('plan.mix.toast');
      await expect(toast).toBeVisible({ timeout: 60_000 });
      await expect(toast).toContainText('Saved.');
      const after = JSON.parse(await stored(page));
      const before = JSON.parse(planted);
      expect(JSON.stringify(after[1]), 'the locked plan is not touched').toBe(JSON.stringify(before[1]));
      expect(stripped(after[0], MIX_WRITES)).toBe(stripped(before[0], MIX_WRITES));
      expect(node.patch.ok).toBe(true);
      expect(JSON.stringify(after[0])).toBe(JSON.stringify(applyPatch(before[0], { ...node.patch.patch, lastModified: FIXED_NOW })));
      expect(after[0].stressTool.settings.allocMode).toBe('risk');
      expect(after[0].stressTool.settings.diversifierStart).toBeGreaterThan(0);
      expect(after[0].stressTool.settings.equityMin + after[0].stressTool.settings.bondMin + after[0].stressTool.settings.cashTarget + after[0].stressTool.settings.diversifierStart).toBe(node.saved.pot);
      await expect(page.getByTestId('plan.mix.held.level')).toBeChecked({ timeout: 60_000 });
      await page.getByTestId('plan.mix.undo').click();
      await expect(page.getByTestId('plan.mix.toast')).toContainText('Put back as it was.', { timeout: 60_000 });
      expect(await stored(page), 'Undo puts the text back byte for byte').toBe(planted);
      await expect(page.getByTestId('plan.mix.held.split')).toBeChecked({ timeout: 60_000 });
    });

    await test.step('the funds to test: a list pasted from a platform is read as Node reads it — the two funds recognised, the total line left out and said; added as cards; the draft dropped', async () => {
      await page.getByTestId('plan.mix.held.funds').check();
      await expect(page.getByTestId('plan.mix.funds.none')).toBeVisible();
      await page.getByTestId('plan.mix.search').fill('vwrp');
      await expect(page.getByTestId('plan.mix.search.matches')).toBeVisible();
      await page.getByTestId('plan.mix.search').fill('');
      await page.getByTestId('plan.mix.paste.open').click();
      await expect(page.getByTestId('plan.mix.paste')).toBeVisible();
      await page.getByTestId('plan.mix.paste.text').fill(PASTE);
      await expect(page.getByTestId('plan.mix.paste.rows')).toBeVisible();
      expect(node.paste.rows).toBe(2);
      expect(node.paste.leftOut).toBe(1);
      await expect(page.getByTestId('plan.mix.paste.rows').locator('tbody tr')).toHaveCount(node.paste.rows);
      await expect(page.getByTestId('plan.mix.paste.summary')).toContainText('2 lines read, £400,000 in all.');
      await expect(page.getByTestId('plan.mix.paste.leftOut')).toContainText('a total line, not a fund');
      expect(node.paste.canAdd).toBe(true);
      await page.getByTestId('plan.mix.paste.add').click();
      await expect(page.locator('[data-card^="funds."]')).toHaveCount(2);
      await expect(page.getByTestId('plan.mix.funds.summary')).toContainText('The list comes to £400,000 in the pension');
      await expect(page.locator('[data-line="mix.held.funds"]')).toContainText('£400,000');
      const text = await page.locator('#app').innerText();
      expect(text).not.toMatch(BANNED);
      await page.getByTestId('plan.mix.cancel').click();
      await expect(page.getByTestId('plan.mix.held.split')).toBeChecked();
      expect(await stored(page), 'a paste writes nothing').toBe(planted);
    });

    await test.step('"Which mix lasts best?": the eight cells in the worker, each the Node run\'s to the pound, the best marked, "Tried in 8 runs"; "Use this mix" confirmed writes the Node patch; Undo byte for byte', async () => {
      const t0 = Date.now();
      await page.getByTestId('plan.mix.compare.run').click();
      const table = page.getByTestId('plan.mix.compare.table');
      await expect(table).toBeVisible({ timeout: 300_000 });
      testInfo.annotations.push({ type: 'eight-cells-ms', description: `${Date.now() - t0} ms` });
      await expect(page.getByTestId('plan.mix.compare.ran')).toHaveText(/^Tried in 8 runs \(\d+(\.\d)? s\)\.$/);
      expect(node.compare.cells).toHaveLength(8);
      for (const c of node.compare.cells) {
        const cell = page.getByTestId(`plan.mix.compare.${c.key}.${c.tent ? 'tent' : 'flat'}`);
        await expect(cell).toHaveAttribute('data-affordable', c.affordable ? '1' : '0');
        if (!c.affordable) continue;
        expect(Number(await cell.getAttribute('data-typical'))).toBe(Math.round(c.typicalLeft));
        expect(Number(await cell.getAttribute('data-bad'))).toBe(Math.round(c.badCaseLeft));
        expect(Number(await cell.getAttribute('data-chance'))).toBe(Math.round(c.chancePct));
      }
      await expect(page.locator('[data-testid^="plan.mix.compare."][data-best="1"]')).toHaveCount(1);
      await expect(page.getByTestId('plan.mix.compare.best')).toContainText('lasts');
      expect(await page.locator('[data-testid="plan.mix.use.own.flat"]').count(), 'the plan\'s own cell has no "Use this mix"').toBe(0);
      await page.getByTestId('plan.mix.use.balanced.tent').click();
      const confirm = page.getByTestId('plan.mix.useConfirm');
      await expect(confirm).toBeVisible();
      await expect(confirm).toContainText('Balanced');
      await page.getByTestId('plan.mix.useConfirm.yes').click();
      const toast = page.getByTestId('plan.mix.toast');
      await expect(toast).toBeVisible({ timeout: 60_000 });
      await expect(toast).toContainText('Balanced');
      const after = JSON.parse(await stored(page));
      const before = JSON.parse(planted);
      expect(JSON.stringify(after[1])).toBe(JSON.stringify(before[1]));
      expect(stripped(after[0], MIX_WRITES)).toBe(stripped(before[0], MIX_WRITES));
      expect(node.use.ok).toBe(true);
      expect(JSON.stringify(after[0])).toBe(JSON.stringify(applyPatch(before[0], { ...node.use.patch, lastModified: FIXED_NOW })));
      expect(after[0].stressTool.settings.equityGlideEnabled).toBe(true);
      const balanced = node.compare.cells.find((c) => c.key === 'balanced' && c.tent);
      expect(after[0].stressTool.settings.equityMin).toBe(balanced.amounts.equity);
      expect(after[0].stressTool.settings.bondMin).toBe(balanced.amounts.bond);
      expect(after[0].stressTool.settings.cashTarget).toBe(balanced.amounts.cash);
      await expect(page.getByTestId('plan.mix.tent.yes')).toBeChecked({ timeout: 60_000 });
      await page.getByTestId('plan.mix.undo').click();
      await expect(page.getByTestId('plan.mix.toast')).toContainText('Put back as it was.', { timeout: 60_000 });
      expect(await stored(page), 'Undo puts the text back byte for byte').toBe(planted);
    });

    await test.step('the locked plan: the lines read-only, no box, the tent\'s note for Buckets, the slice tried with the document\'s figure beside, no "Use this mix", nothing written', async () => {
      await page.goto(v7('#/plan/MixLocked02/mix'));
      await expect(page.locator('#app [data-screen]')).toHaveAttribute('data-screen', 'plan.mix');
      await expect(page.getByTestId('plan.mix.locked')).toBeVisible();
      await expect(page.getByTestId('plan.mix.fixed')).toContainText('Fixed when you locked the plan on');
      expect(await page.locator('#app input, #app select, #app textarea').count()).toBe(0);
      expect(await page.locator('[data-testid="plan.mix.save"]').count()).toBe(0);
      await expect(page.getByTestId('plan.mix.tent.note')).toHaveText('Buckets in order ignores the tent: it holds its three buckets as they are and refills them in order.');
      await expect(page.locator('[data-line="mix.tent.buckets"]')).toHaveCount(1);
      expect(await page.locator('[data-testid="plan.mix.try.tent"]').count(), 'no tent try for Buckets').toBe(0);
      await page.getByTestId('plan.mix.try.sleeve.button').click();
      const result = page.getByTestId('plan.mix.try.sleeve.result');
      await expect(result).toBeVisible({ timeout: 120_000 });
      const sam = mixInNode(locked, TODAY, { tryKind: 'sleeve' });
      expect(sam.saved.locked).toBe(true);
      expect(sam.tried.on).toBe(true);
      if (sam.tried.affordable) await expect(result.locator('[data-line^="mixTry.sleeve."]')).toContainText(pounds(sam.tried.a.badCaseLeft));
      await expect(result.locator('[data-line="mixTry.document"]')).toContainText('The plan as locked on');
      await expect(page.getByTestId('plan.mix.document')).toContainText('locked');
      expect(await page.locator('[data-testid^="plan.mix.use."]').count()).toBe(0);
      const text = await page.locator('#app').innerText();
      expect(text).not.toMatch(/unlock the plan to|should unlock/i);
      expect(text).not.toMatch(BANNED);
      expect(await stored(page), 'the locked plan is not touched').toBe(planted);
      expect(new URL(page.url()).hash).toBe('#/plan/MixLocked02/mix');
    });
  });
});
