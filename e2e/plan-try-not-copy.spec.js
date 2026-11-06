/**
 * Trying figures never makes plans (6.59.0), on the PUBLISHED build, without an account, fictional figures only:
 *   - a saver's plan (kept from question B's own fixture, "Alex saving") is planted in the window; its rail's "Am I saving
 *     enough?" opens B filled from it; three different sets of figures are tried and worked out — no plan is made and the
 *     plan is not changed; "Use these in ‘…’" writes the figures tried onto THAT plan (still one plan; only What you pay in's
 *     settings and the stamp move) and its "What you pay in" shows them; "Keep as a new plan" makes exactly one more;
 *   - after that keep, B opened from ANOTHER saver's plan ("Sam saving"): "Use these" names and writes that plan, never the
 *     plan kept before;
 *   - "Delete several" on Your plans: five plans planted, three ticked, ONE confirm naming the three and the count (and a
 *     second for the two locked among them), yes — those three gone, the other two byte for byte; the main plan and the
 *     plan next in line both ticked — a plan that stays is the main plan after.
 * No figure in any address; no sideways scroll. Firebase is never reached (outside requests blocked).
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test, expect, v7 as v7app, waitsFor, NEEDS, PROD, REPO, FIXED_NOW, saverWording, V7_PATH, WORKER_DATA_MISSING } from './helpers/app.js';
import { buildPlanSeed } from '../src/answers/keep/planSeed.js';
import { plansFromSeed } from '../src/answers/keep/planCreate.js';
import { PLAN } from '../src/v7/copy/plan.js';
import { KEEP } from '../src/v7/copy/keep.js';

test.use({ outside: 'block' });

const GUEST_KEY = 'pt_guest_scenarios';
const v7 = (hash) => PROD + V7_PATH + hash;
const TODAY = FIXED_NOW.slice(0, 10);
// the words never shown here (B's own rail says "About £… a month in" for its pay-in step, as it always has)
const BANNED = /\bstrategy\b|\bscenario\b|\bguest\b|\bFirestore\b|\bFirebase\b|Monte Carlo|\bMC\b/i;
const PLAN_ID = 'guest-alexsav1';
const OTHER_ID = 'guest-samsav01';

/** A saver's plan, as "Keep this as a plan" makes it from B's own fixture answer (50, stopping at 60: fictional). */
function saverPlan({ id = PLAN_ID, name = 'Alex saving', first = true } = {}) {
  const state = JSON.parse(readFileSync(join(REPO, 'tests', 'v7', 'states', 'b', 'answer-B1.json'), 'utf8'));
  const result = state.answers.b.result;
  const seed = buildPlanSeed({ source: 'b', result, env: { today: TODAY, appVersion: 'test' }, name, createdAt: FIXED_NOW });
  const made = plansFromSeed(seed, { now: new Date(FIXED_NOW), first });
  return { ...made.yours, id };
}
async function plant(page, list) {
  await page.clock.setFixedTime(new Date(FIXED_NOW));
  await page.goto(v7('#/'));
  await expect(page.locator('#app [data-screen]')).toBeVisible();
  await page.evaluate(([k, text]) => { sessionStorage.setItem(k, text); }, [GUEST_KEY, JSON.stringify(list)]);
  return JSON.stringify(list);
}
const stored = (page) => page.evaluate((k) => JSON.parse(sessionStorage.getItem(k) || '[]'), GUEST_KEY);
async function sound(page) {
  const w = await page.evaluate(() => ({ doc: document.documentElement.scrollWidth, win: window.innerWidth }));
  expect(w.doc, 'no sideways scroll').toBeLessThanOrEqual(w.win + 1);
  expect(new URL(page.url()).hash).not.toMatch(/£|\d{3,}(?![\w-]*$)/);
  const text = await page.locator('#app').innerText();
  expect(text).not.toMatch(/undefined|NaN|\[object|\{\w+\}/);
  expect(text).not.toMatch(BANNED);
}
/** The plan without What you pay in's settings and the stamp: what "Use these" must not move. */
const rest = (plan) => { const o = JSON.parse(JSON.stringify(plan)); delete o.lastModified; if (o.accumulationTool) delete o.accumulationTool.settings; return JSON.stringify(o); };

test.describe('trying figures never makes plans, without an account', () => {
  test('B opened from a saver\'s plan: three tries make nothing; "Use these" changes that plan only; "Keep as a new plan" makes one', async ({ page, watch }) => {
    waitsFor(...NEEDS.b);
    test.setTimeout(600_000);
    watch.allow(WORKER_DATA_MISSING);
    const plan = saverPlan();
    // a second saver's plan (Sam's, fictional) that B is opened from at the end, after a keep
    const other = saverPlan({ id: OTHER_ID, name: 'Sam saving', first: false });
    const planted = await plant(page, [plan, other]);
    const app = v7app(page, 'prod', 'b');
    app.as('b');

    await test.step('the plan\'s rail opens "Am I saving enough?" filled from it', async () => {
      await page.goto(v7(`#/plan/${PLAN_ID}/saving`));
      await expect(page.locator('#app [data-screen]')).toHaveAttribute('data-screen', 'plan.saving');
      // the plan's own verdict worked out first, as a person reading the page would see it (its run belongs to this step)
      await expect(page.getByTestId('plan.saving.verdict')).toHaveAttribute('data-status', 'final', { timeout: 180_000 });
      const ask = page.getByTestId('rail.ask.b');
      await expect(ask).toHaveAttribute('data-filled', 'plan');
      const line = page.getByTestId('rail.line');
      if (await line.isVisible()) await line.click();
      await ask.click();
      await app.at('b.numbers');
      await expect(page.getByTestId('b.you.payIn.own')).toHaveValue('450');
      await sound(page);
    });

    for (const own of ['480', '500', '520']) {
      await test.step(`figures tried (${own} a month from you), worked out: no plan made, the plan unchanged`, async () => {
        if ((await app.screen()) !== 'b.numbers') await app.go('#/b/numbers');
        await app.set('you.payIn.own', own);
        await app.click('b.action.show');
        await app.at('b.answer');
        await app.ready(180_000);
        await expect(page.getByTestId('b.use')).toHaveAttribute('data-use', 'open');
        await expect(page.getByTestId('b.use')).toContainText('You opened this from ‘Alex saving’. Trying figures here changes nothing in it until you use them.');
        expect(JSON.stringify(await stored(page)), 'trying figures writes nothing').toBe(planted);
        await sound(page);
        expect(saverWording(await page.locator('#app').innerText())).toEqual([]);
      });
    }

    await test.step('the keep step leads with "Use these in your plan", and its next line names the press on the page', async () => {
      await app.go('#/b/keep');
      await app.at('b.keep');
      await expect(page.locator('#app h1')).toHaveText(KEEP.use.stepLabel);
      await expect(page.getByTestId('rail.next').locator('[data-next]')).toHaveText('Next: when you are happy with these figures, use them in ‘Alex saving’.');
      await expect(page.locator('#app')).not.toContainText('press "Keep as a plan"');
      await sound(page);
      await app.go('#/b/answer');
      await app.at('b.answer');
      await app.ready(180_000);
    });

    await test.step('"Use these in ‘Alex saving’": still one plan; only What you pay in moved, to the figures tried; the answer page says so', async () => {
      const choice = await page.getByTestId('b.use.payIn').count();
      const use = choice ? 'b.action.use.now' : 'b.action.use';
      if (!choice) await expect(page.getByTestId(use)).toHaveText('Use these in ‘Alex saving’');
      await expect(page.getByTestId(choice ? 'b.action.save.now' : 'b.action.save')).not.toHaveClass(/primary/);
      await page.getByTestId(use).scrollIntoViewIfNeeded();
      await page.getByTestId(use).click();
      await expect(page.getByTestId('b.use.done')).toBeVisible({ timeout: 60_000 });
      await expect(page.getByTestId('b.use.done')).toContainText('‘Alex saving’ now has £770 a month going into your pension. Nothing else in it changed.');
      await expect(page.getByTestId('b.use.toast')).toBeVisible();
      const after = await stored(page);
      expect(after.map((p) => p.id)).toEqual([PLAN_ID, OTHER_ID]);
      expect(rest(after[0]), 'nothing else in the plan moved').toBe(rest(plan));
      expect(after[0].accumulationTool.settings).toMatchObject({ netMonthly: 416, employerMonthly: 250 });
      expect(JSON.stringify(after[1]), 'the other plan untouched').toBe(JSON.stringify(other));
      await sound(page);
    });

    await test.step('the plan\'s own "What you pay in" shows the figures used', async () => {
      await page.getByTestId('b.use.see').click();
      await expect(page.locator('#app [data-screen]')).toHaveAttribute('data-screen', 'plan.saving');
      await expect(page.getByTestId('plan.saving.netMonthly')).toHaveValue('416', { timeout: 60_000 });
      await expect(page.getByTestId('plan.saving.verdict')).toHaveAttribute('data-status', 'final', { timeout: 180_000 });
      expect((await stored(page)).length).toBe(2);
    });

    await test.step('"Keep as a new plan": exactly one more plan, named apart from the first', async () => {
      await page.goBack();
      await app.at('b.answer');
      await app.ready(180_000);
      const choice = await page.getByTestId('b.keep.payIn').count();
      const save = choice ? 'b.action.save.now' : 'b.action.save';
      if (!choice) await expect(page.getByTestId(save)).toHaveText(KEEP.saveNew);
      await expect(page.getByTestId('b.keep.secondTitle')).toHaveText(KEEP.newTitle);
      await page.getByTestId(save).scrollIntoViewIfNeeded();
      await page.getByTestId(save).click();
      await expect(page.getByTestId('b.keep.made')).toBeVisible({ timeout: 60_000 });
      const after = await stored(page);
      expect(after.length).toBe(3);
      expect(after[2].planDetails.name).not.toBe('Alex saving');
      // another keep from here is "another new plan", plainly second
      await expect(page.getByTestId(choice ? 'b.action.save.now' : 'b.action.save')).not.toHaveClass(/primary/);
      if (!choice) await expect(page.getByTestId('b.action.save')).toHaveText(KEEP.saveAnother);
      await sound(page);
    });

    await test.step('B then opened from another saver\'s plan: "Use these" names THAT plan and writes it, never the plan kept before', async () => {
      const before = await stored(page);
      await page.goto(v7(`#/plan/${OTHER_ID}/saving`));
      await expect(page.locator('#app [data-screen]')).toHaveAttribute('data-screen', 'plan.saving');
      await expect(page.getByTestId('plan.saving.verdict')).toHaveAttribute('data-status', 'final', { timeout: 180_000 });
      const line = page.getByTestId('rail.line');
      if (await line.isVisible()) await line.click();
      await page.getByTestId('rail.ask.b').click();
      await app.at('b.numbers');
      await app.set('you.payIn.own', '530');
      await app.click('b.action.show');
      await app.at('b.answer');
      await app.ready(180_000);
      await expect(page.getByTestId('b.use')).toHaveAttribute('data-plan-id', OTHER_ID);
      await expect(page.getByTestId('b.use')).toContainText('You opened this from ‘Sam saving’.');
      // the "Kept as …" of the answer before belongs to it, not to this one
      await expect(page.getByTestId('b.keep.made')).toHaveCount(0);
      const choice = await page.getByTestId('b.use.payIn').count();
      const use = choice ? 'b.action.use.now' : 'b.action.use';
      await page.getByTestId(use).scrollIntoViewIfNeeded();
      await page.getByTestId(use).click();
      await expect(page.getByTestId('b.use.done')).toBeVisible({ timeout: 60_000 });
      const after = await stored(page);
      expect(after.map((p) => p.id)).toEqual(before.map((p) => p.id));
      expect(after[1].accumulationTool.settings).toMatchObject({ netMonthly: 424 });
      expect(JSON.stringify(after[0]), 'the plan B was first opened from untouched').toBe(JSON.stringify(before[0]));
      expect(JSON.stringify(after[2]), 'the plan kept before untouched').toBe(JSON.stringify(before[2]));
      await sound(page);
    });
  });

  test('"Delete several" on Your plans: three ticked of five, one confirm naming them, those three gone and the rest byte for byte', async ({ page }) => {
    test.setTimeout(240_000);
    const raw = (n) => JSON.parse(readFileSync(join(REPO, 'tests', 'fixtures', 'plans', n + '.json'), 'utf8'));
    const names = ['Alex 1', 'Alex 2', 'Sam 1', 'Sam 2', 'Alex and Sam'];
    const five = ['01-fresh-default', '02-pnv-draft', '04-buckets-running', '12-lumpy-db-gia', '13-stopped-drawing-since'].map((n, i) => {
      const p = raw(n);
      p.id = 'guest-several' + i; p.planDetails.name = names[i]; p.isActive = i === 0; delete p.household;
      return p;
    });
    await plant(page, five);
    await page.goto(v7('#/plans'));
    await expect(page.locator('#app [data-screen]')).toHaveAttribute('data-screen', 'plans');
    await expect(page.getByTestId('plans.group.window')).toBeVisible();
    const W = PLAN.list.actions;

    await page.getByTestId('plans.several').click();
    await expect(page.getByTestId('plans.severalCount')).toHaveText(W.severalCount.none);
    await expect(page.getByTestId('plans.severalGo')).toBeDisabled();
    for (const i of [0, 2, 4]) await page.getByTestId('plans.tick.' + five[i].id).check();
    await expect(page.getByTestId('plans.severalCount')).toHaveText('3 plans ticked.');
    await sound(page);
    await page.getByTestId('plans.severalGo').click();
    const box = page.getByTestId('plans.severalBox');
    await expect(box).toHaveAttribute('data-count', '3');
    await expect(box.locator('p').first()).toHaveText('Delete these 3 plans? Their settings, records and budgets go with them. This cannot be undone.');
    await expect(box.locator('li')).toHaveCount(3);
    for (const i of [0, 2, 4]) await expect(box).toContainText('‘' + names[i] + '’');
    for (const i of [1, 3]) await expect(box).not.toContainText('‘' + names[i] + '’');
    await sound(page);
    expect((await stored(page)).length, 'nothing deleted before yes').toBe(5);
    await page.getByTestId('plans.severalYes').click();
    // two of them are locked: asked again, by name, before anything goes
    await expect(box).toHaveAttribute('data-step', '2');
    await expect(box.locator('p').first()).toContainText('are locked. Delete them all the same?');
    expect((await stored(page)).length, 'nothing deleted before the second yes').toBe(5);
    await sound(page);
    await page.getByTestId('plans.severalYes').click();
    await expect(page.getByTestId('plans.severalDone')).toBeVisible({ timeout: 60_000 });
    await expect(page.getByTestId('plans.severalDeleted')).toHaveText('Deleted: ‘Alex 1’, ‘Sam 1’ and ‘Alex and Sam’.');
    const after = await stored(page);
    expect(after.map((p) => p.id)).toEqual([five[1].id, five[3].id]);
    // the main plan went: its place passed to a plan that stays (one flag); every other byte the same
    expect(after[0].isActive).toBe(true);
    expect(JSON.stringify({ ...after[0], isActive: false })).toBe(JSON.stringify({ ...five[1], isActive: false }));
    expect(JSON.stringify(after[1])).toBe(JSON.stringify(five[3]));
    await expect(page.locator('#app li.plan-row')).toHaveCount(2);
    await sound(page);
  });

  test('"Delete several": the main plan and the plan next in line both ticked — a plan that stays is the main plan after', async ({ page }) => {
    test.setTimeout(120_000);
    const raw = (n) => JSON.parse(readFileSync(join(REPO, 'tests', 'fixtures', 'plans', n + '.json'), 'utf8'));
    const names = ['Alex 1', 'Alex 2', 'Sam 1', 'Sam 2'];
    const four = ['01-fresh-default', '02-pnv-draft', '07-pre-6.13-flat-params', '12-lumpy-db-gia'].map((n, i) => {
      const p = raw(n);
      p.id = 'guest-mainnext' + i; p.planDetails.name = names[i]; p.isActive = i === 0; delete p.household;
      return p;
    });
    await plant(page, four);
    await page.goto(v7('#/plans'));
    await expect(page.locator('#app [data-screen]')).toHaveAttribute('data-screen', 'plans');
    await page.getByTestId('plans.several').click();
    for (const i of [0, 1]) await page.getByTestId('plans.tick.' + four[i].id).check();
    await page.getByTestId('plans.severalGo').click();
    await page.getByTestId('plans.severalYes').click();
    await expect(page.getByTestId('plans.severalDeleted')).toHaveText('Deleted: ‘Alex 1’ and ‘Alex 2’.', { timeout: 60_000 });
    const after = await stored(page);
    expect(after.map((p) => p.id)).toEqual([four[2].id, four[3].id]);
    expect(after.map((p) => p.isActive === true)).toEqual([true, false]);
    await expect(page.getByTestId('plans.mainTag.' + four[2].id)).toBeVisible();
    await sound(page);
  });
});
