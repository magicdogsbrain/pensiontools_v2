/**
 * Try a change on "Does it last?", without an account (research/v7/way-and-mix.md 4, 7; road-to-7.md step 8b), on the
 * PUBLISHED build. A Pots & Valves draft (corpus 02, "Alex's plan") is planted in the window with a locked Buckets plan
 * (corpus 04, "Sam's plan"). On #/plan/<id>/lasts, once the plan's own test is held: no box until "Try a change of your own"
 * is pressed; every box at the plan's saved value; a wrong figure said; the way, the years and the ISA policy moved and
 * tried in the V7 worker on a COPY of the plan — the band's figures equal the same try in Node to the pound, "Tried in 1 run",
 * "What's different" names exactly the boxes moved; "Use this", confirmed, writes ONE plan equal to the Node patch (lasts.js
 * tryPatch) folded onto the planted text, the other plan byte-identical, Undo byte for byte; "Keep as a separate plan" appends
 * ONE unlocked copy named "{name} · tried" to the window's plans with a guest id, every other plan byte-identical, and "Open
 * it" opens it. The locked plan: the change tried, no "Use this", nothing written. Firebase is never reached.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test, expect, PROD, REPO, FIXED_NOW } from './helpers/app.js';
import { tryInNode } from './helpers/tryInNode.js';
import { TRY_WRITES } from '../src/answers/plan/schema.js';
import { applyPatch } from '../src/answers/plan/about.js';

test.use({ outside: 'block' });

const GUEST_KEY = 'pt_guest_scenarios';
const v7 = (hash) => PROD + '/v7/' + hash;
const TODAY = FIXED_NOW.slice(0, 10);

function draftPlan() {
  const plan = JSON.parse(readFileSync(join(REPO, 'tests', 'fixtures', 'plans', '02-pnv-draft.json'), 'utf8'));
  plan.id = 'TryPlan01';
  plan.planDetails.name = 'Alex’s plan';
  plan.isActive = true;
  delete plan.household;
  return plan;
}
function lockedPlan() {
  const plan = JSON.parse(readFileSync(join(REPO, 'tests', 'fixtures', 'plans', '04-buckets-running.json'), 'utf8'));
  plan.id = 'TryLocked02';
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
async function awaitRun(page) {
  await expect(page.locator('[data-region="plan-lasts-answer"]')).toHaveAttribute('data-status', 'done', { timeout: 60_000 });
  await expect(page.locator('[data-region="plan-lasts-answer"]')).toHaveAttribute('data-fresh', '1');
}
const tenth = (n) => Math.round(n * 10) / 10;
const TYPED = { 'try.way': 'floor-to-age', 'try.years': '30', 'try.isaPolicy': 'hold' };

test.describe('Try a change on "Does it last?", without an account', () => {
  test('closed until pressed; the boxes at the saved values; a wrong figure said; the try equals Node; "Use this" writes the Node patch, Undo byte for byte; "Keep as a separate plan" appends one unlocked copy; the locked plan', async ({ page, watch }, testInfo) => {
    test.setTimeout(600_000);
    watch.allow(/^asked for a file that is not there: \/assets\/data\/(gilts|equity)\.json$/);
    const plan = draftPlan();
    const locked = lockedPlan();
    const planted = await plant(page, [plan, locked]);
    const node = tryInNode(plan, TODAY, { typed: TYPED, at: FIXED_NOW });
    expect(node.ok).toBe(true);
    expect(node.diffs).toEqual(['way', 'isaPolicy', 'years']);

    await test.step('once the plan\'s own test is held: "Try a change of your own" is closed, no box; pressed, every box at the plan\'s saved value', async () => {
      await page.goto(v7('#/plan/TryPlan01/lasts'));
      await expect(page.locator('#app [data-screen]')).toHaveAttribute('data-screen', 'plan.lasts');
      await awaitRun(page);
      const block = page.getByTestId('plan.lasts.try');
      await expect(block).toBeVisible();
      await expect(block).toHaveAttribute('data-open', '0');
      expect(await block.locator('input, select').count(), 'no box until pressed').toBe(0);
      await page.getByTestId('plan.lasts.try.open').click();
      await expect(block).toHaveAttribute('data-open', '1');
      await expect(page.getByTestId('plan.lasts.try.way.pots-and-valves')).toBeChecked();
      await expect(page.getByTestId('plan.lasts.try.pot')).toHaveValue(String(node.boxes.pot));
      await expect(page.getByTestId('plan.lasts.try.isa')).toHaveValue(String(node.boxes.isa));
      await expect(page.getByTestId('plan.lasts.try.isaPolicy.saved')).toBeChecked();
      await expect(page.getByTestId('plan.lasts.try.incomeMode.shape')).toBeChecked();
      expect(await page.locator('[data-testid="plan.lasts.try.income"]').count(), 'the flat figure only when flat').toBe(0);
      await expect(page.getByTestId('plan.lasts.try.years')).toHaveValue(String(plan.stressTool.settings.duration));
      await expect(page.getByTestId('plan.lasts.try.cuts.saved')).toBeChecked();
      await expect(page.getByTestId('plan.lasts.try.cutPct')).toHaveValue('');
      expect(await stored(page), 'opening writes nothing').toBe(planted);
    });

    await test.step('a wrong figure is said; the way, the years and the ISA policy moved and tried: the band equals the Node try to the pound, "Tried in 1 run", "What\'s different" names exactly the three', async () => {
      await page.getByTestId('plan.lasts.try.years').fill('4');
      await page.getByTestId('plan.lasts.try.run').click();
      await expect(page.locator('[data-error-for="plan.lasts.try.years"]')).toHaveText('At least 5 years.');
      await expect(page.getByTestId('plan.lasts.try.problems')).toBeVisible();
      expect(await page.locator('[data-testid="plan.lasts.try.result"]').count()).toBe(0);
      await page.getByTestId('plan.lasts.try.years').fill('30');
      await page.getByTestId('plan.lasts.try.way.floor-to-age').check();
      await page.getByTestId('plan.lasts.try.isaPolicy.hold').check();
      const t0 = Date.now();
      await page.getByTestId('plan.lasts.try.run').click();
      const result = page.getByTestId('plan.lasts.try.result');
      await expect(result).toBeVisible({ timeout: 90_000 });
      testInfo.annotations.push({ type: 'try-ms', description: `${Date.now() - t0} ms` });
      await expect(result).toHaveAttribute('data-stale', '0');
      await expect(page.getByTestId('plan.lasts.try.ran')).toHaveText(/^Tried in 1 run \(\d+(\.\d)? s\)\.$/);
      const band = page.getByTestId('plan.lasts.try.band');
      await expect(band).toHaveAttribute('data-ok', '1');
      expect(tenth(Number(await band.getAttribute('data-chance')))).toBe(tenth(node.tried.a.chancePct));
      expect(Number(await band.getAttribute('data-typical'))).toBe(Math.round(node.tried.a.typicalLeft));
      expect(Number(await band.getAttribute('data-bad'))).toBe(Math.round(node.tried.a.badCaseLeft));
      expect(Number(await band.getAttribute('data-years'))).toBe(30);
      const diffs = page.getByTestId('plan.lasts.try.diffs').locator('[data-diff]');
      expect(await diffs.evaluateAll((els) => els.map((el) => el.getAttribute('data-diff')))).toEqual(node.diffs);
      await expect(diffs.nth(0)).toHaveText('The way the money is taken: Floor to an age, then decide (the plan: Pots & Valves).');
      await expect(diffs.nth(1)).toContainText('held back, never drawn for income');
      await expect(diffs.nth(2)).toHaveText(`30 years (the plan: ${plan.stressTool.settings.duration}).`);
      // a box moved after the try: the result is stale until tried again
      await page.getByTestId('plan.lasts.try.years').fill('31');
      await expect(result).toHaveAttribute('data-stale', '1');
      await expect(page.getByTestId('plan.lasts.try.stale')).toBeVisible();
      expect(await page.locator('[data-testid="plan.lasts.try.use"]').count()).toBe(0);
      await page.getByTestId('plan.lasts.try.years').fill('30');
      await expect(result).toHaveAttribute('data-stale', '0');
      const text = await page.locator('#app').innerText();
      expect(text).not.toMatch(/undefined|NaN|\[object/);
      expect(text).not.toMatch(/\bstrategy\b|\ballocation\b|Monte Carlo|\bp10\b|what-if/i);
      expect(await stored(page), 'a try writes nothing').toBe(planted);
    });

    await test.step('"Use this" → the confirm lists the count → "Use it": ONE plan written, equal to the Node patch folded onto the planted text, the other byte-identical; Undo byte for byte', async () => {
      await page.getByTestId('plan.lasts.try.use').click();
      const confirm = page.getByTestId('plan.lasts.try.confirmBox');
      await expect(confirm).toBeVisible();
      await expect(confirm).toContainText('Your plan changes in 3 ways');
      await page.getByTestId('plan.lasts.try.confirm').click();
      const toast = page.getByTestId('plan.lasts.toast');
      await expect(toast).toBeVisible({ timeout: 60_000 });
      await expect(toast).toContainText('Saved. Your plan changed in 3 ways.');
      const after = JSON.parse(await stored(page));
      const before = JSON.parse(planted);
      expect(JSON.stringify(after[1]), 'the locked plan is not touched').toBe(JSON.stringify(before[1]));
      expect(stripped(after[0], TRY_WRITES)).toBe(stripped(before[0], TRY_WRITES));
      expect(node.patch.ok).toBe(true);
      expect(JSON.stringify(after[0])).toBe(JSON.stringify(applyPatch(before[0], { ...node.patch.patch, lastModified: FIXED_NOW })));
      expect(after[0].stressTool.settings.strategyId).toBe('floor-to-age');
      expect(after[0].stressTool.settings.duration).toBe(30);
      expect(after[0].stressTool.settings.isaDrawdownStrategy).toBe('hold');
      expect(after[0].stressTool.settings.strategyState['pots-and-valves'].savedAt).toBe(TODAY);
      // the test runs again on the saved plan; the try block is closed again
      await awaitRun(page);
      await expect(page.getByTestId('plan.lasts.try')).toHaveAttribute('data-open', '0');
      await page.getByTestId('plan.lasts.undo').click();
      await expect(page.getByTestId('plan.lasts.toast')).toContainText('Put back as it was.', { timeout: 60_000 });
      expect(await stored(page), 'Undo puts the text back byte for byte').toBe(planted);
      await awaitRun(page);
    });

    await test.step('"Keep as a separate plan": ONE unlocked copy named "Alex’s plan · tried" appended with a guest id, every other plan byte-identical; "Open it" opens it', async () => {
      await page.getByTestId('plan.lasts.try.open').click();
      await page.getByTestId('plan.lasts.try.years').fill('30');
      await page.getByTestId('plan.lasts.try.way.floor-to-age').check();
      await page.getByTestId('plan.lasts.try.isaPolicy.hold').check();
      await page.getByTestId('plan.lasts.try.run').click();
      await expect(page.getByTestId('plan.lasts.try.result')).toBeVisible({ timeout: 90_000 });
      await page.getByTestId('plan.lasts.try.keep').click();
      const kept = page.getByTestId('plan.lasts.try.kept');
      await expect(kept).toBeVisible({ timeout: 60_000 });
      await expect(kept).toContainText('Kept as ‘Alex’s plan · tried’ in this browser window.');
      await expect(kept).toContainText('The copy is not locked');
      const list = JSON.parse(await stored(page));
      const before = JSON.parse(planted);
      expect(list).toHaveLength(3);
      expect(JSON.stringify(list.slice(0, 2)), 'the two plans are byte-identical').toBe(JSON.stringify(before));
      const copy = list[2];
      expect(copy.id).toMatch(/^guest-[0-9a-z]{8}$/);
      expect(copy.planDetails.name).toBe('Alex’s plan · tried');
      expect(copy.isActive).toBe(false);
      expect(copy.stressTool.settings.strategyId).toBe(node.copy.strategyId);
      expect(copy.stressTool.settings.duration).toBe(node.copy.duration);
      expect(copy.stressTool.settings.strategyParams).toEqual(node.copy.strategyParams);
      expect(copy.strategy).toMatchObject({ id: 'floor-to-age', lockedAt: null });
      expect(!!(copy.decisionTool && copy.decisionTool.settings && copy.decisionTool.settings.locked)).toBe(false);
      expect(copy.planDocument).toBeUndefined();
      expect(copy.createdAt).toBe(FIXED_NOW);
      await page.getByTestId('plan.lasts.try.openKept').click();
      await expect(page.locator('#app [data-screen]')).toHaveAttribute('data-screen', 'plan');
      expect(new URL(page.url()).hash).toBe(`#/plan/${copy.id}/plan`);
      await expect(page.locator('#app')).toContainText('Alex’s plan · tried');
      expect(await page.locator('#app').innerText()).not.toMatch(/undefined|NaN/);
    });

    await test.step('the locked plan: the change tried against today\'s test, no "Use this", nothing written', async () => {
      const planted3 = await stored(page);
      await page.goto(v7('#/plan/TryLocked02/lasts'));
      await expect(page.getByTestId('plan.step.lasts')).toBeVisible();
      await awaitRun(page);
      expect(await page.locator('#app input, #app select, #app textarea').count(), 'no box on a locked plan before a try is opened').toBe(0);
      await page.getByTestId('plan.lasts.try.open').click();
      await page.getByTestId('plan.lasts.try.years').fill('28');
      await page.getByTestId('plan.lasts.try.run').click();
      const result = page.getByTestId('plan.lasts.try.result');
      await expect(result).toBeVisible({ timeout: 90_000 });
      const sam = tryInNode(locked, TODAY, { typed: { 'try.years': '28' }, at: FIXED_NOW });
      expect(sam.ok).toBe(true);
      expect(sam.patch.ok, 'nothing to write for a locked plan').toBe(false);
      const band = page.getByTestId('plan.lasts.try.band');
      if (sam.tried.a) {
        await expect(band).toHaveAttribute('data-ok', '1');
        expect(tenth(Number(await band.getAttribute('data-chance')))).toBe(tenth(sam.tried.a.chancePct));
      }
      await expect(page.getByTestId('plan.lasts.try.diffs').locator('[data-diff]')).toHaveCount(sam.diffs.length);
      expect(await page.locator('[data-testid="plan.lasts.try.use"]').count(), 'no "Use this" on a locked plan').toBe(0);
      expect(await page.locator('#app').innerText()).not.toMatch(/unlock the plan to/i);
      expect(await stored(page), 'the locked plan is not touched').toBe(planted3);
      expect(new URL(page.url()).hash).toBe('#/plan/TryLocked02/lasts');
    });
  });
});
