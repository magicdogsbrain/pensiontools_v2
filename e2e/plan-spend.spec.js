/**
 * "What you spend", without an account (research/v7/editing-in-v7.md 8.5, S4). The PUBLISHED build, which serves the
 * planner at / and the preview at /v7/ on one site, so this window's plans (sessionStorage pt_guest_scenarios) are seen
 * by both.
 *
 *  The lumpy plan (corpus 12: three steps, the second moving evenly to the third, two one-off costs) is planted in the
 *  window. On #/plan/<id>/spend the first row and the cards hold the saved facts a month after tax with their sources and
 *  the before-tax figure under each; the first row's amount is changed, a step is added at an age with a fall; Save writes
 *  ONE plan: the stored text differs only in the step's declared keys (and the planner's last-changed stamp); Undo puts the
 *  text back byte for byte. The planner, opened at / in the same window, shows the new shape in its own boxes. A locked
 *  plan's page has no box. Nothing is written anywhere else.
 *
 * Firebase is never reached: the preview reads and writes this window's plans; every request outside the site is stopped.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test, expect, PROD, REPO, FIXED_NOW } from './helpers/app.js';
import { SPEND_WRITES } from '../src/answers/plan/schema.js';
import { monthlyNet, yearlyGross } from '../src/answers/plan/spend.js';
import { bandsOf } from '../src/answers/plan/about.js';

test.use({ outside: 'block' });

const GUEST_KEY = 'pt_guest_scenarios';
const OWN_KEYS = new Set(['pt_v7_draft', 'pt_lastActivity', 'pt_open_place', 'pt_open_plan', 'pt_guest_minutes', 'pt_activeScenarioId']);
const v7 = (hash) => PROD + '/v7/' + hash;

function lumpyPlan() {
  const plan = JSON.parse(readFileSync(join(REPO, 'tests', 'fixtures', 'plans', '12-lumpy-db-gia.json'), 'utf8'));
  plan.id = 'SpendPlan01';
  plan.planDetails.name = 'Alex’s plan';
  plan.isActive = true;
  delete plan.household;
  return plan;
}
function lockedPlan() {
  const plan = JSON.parse(readFileSync(join(REPO, 'tests', 'fixtures', 'plans', '03-gilt-ladder-runup.json'), 'utf8'));
  plan.id = 'SpendLocked02';
  plan.isActive = false;
  return plan;
}
/** A plan's text with the declared paths and the stamp taken out: what must be byte-identical across a save. */
function stripped(plan) {
  const out = JSON.parse(JSON.stringify(plan));
  for (const path of [...SPEND_WRITES, 'lastModified']) { const parts = path.split('.'); let o = out; for (let i = 0; i < parts.length - 1 && o; i++) o = o[parts[i]]; if (o) delete o[parts[parts.length - 1]]; }
  return JSON.stringify(out);
}

async function plant(page, plans) {
  await page.clock.setFixedTime(new Date(FIXED_NOW));
  await page.goto(v7('#/'));
  await expect(page.locator('#app [data-screen]')).toBeVisible();
  await page.evaluate(([k, text]) => { sessionStorage.setItem(k, text); }, [GUEST_KEY, JSON.stringify(plans)]);
  return JSON.stringify(plans);
}
const storedPlans = (page) => page.evaluate((k) => JSON.parse(sessionStorage.getItem(k)), GUEST_KEY);
const gbp = (n) => '£' + Math.round(n).toLocaleString('en-GB');

test.describe('"What you spend", without an account', () => {
  test('the first row and the cards; a new first figure and a step with a fall; Save (one plan, the declared keys only); Undo byte for byte; the planner shows the new shape', async ({ page, watch }) => {
    test.setTimeout(240_000);
    // as on the live site today: the engine worker asks for the market files beside itself (e2e/old-app-unchanged.spec.js)
    watch.allow(/^asked for a file that is not there: \/assets\/data\/(gilts|equity)\.json$/);
    const plan = lumpyPlan();
    const locked = lockedPlan();
    const b = bandsOf(plan.stressTool.settings);
    const first = monthlyNet(48000, b), second = monthlyNet(42000, b), third = monthlyNet(34000, b);
    const stored = await plant(page, [plan, locked]);
    await page.goto(v7('#/plan/SpendPlan01/spend'));
    await expect(page.locator('#app [data-screen]')).toHaveAttribute('data-screen', 'plan.spend');
    await expect(page.getByTestId('plan.step.spend')).toHaveText('What you spend');
    const widths = await page.evaluate(() => ({ doc: document.documentElement.scrollWidth, win: window.innerWidth }));
    expect(widths.doc, 'no sideways scroll').toBeLessThanOrEqual(widths.win);
    // the saved facts, each with its source and its before-tax figure
    await expect(page.getByTestId('plan.spend.first.legend')).toHaveText('From age 60, the plan’s first year');
    await expect(page.getByTestId('plan.spend.first.amount')).toHaveValue(String(first));
    await expect(page.locator('[data-saved-for="first.amount"]')).toHaveText(`From your plan, saved 11 September 2026 (${first})`);
    await expect(page.locator('#plan\\.spend\\.first\\.amount\\.help')).toHaveText('£48,000 a year before tax, as the plan saves it.');
    await expect(page.getByTestId('plan.spend.steps.0.fromAge')).toHaveValue('66');
    await expect(page.getByTestId('plan.spend.steps.0.amount')).toHaveValue(String(second));
    await expect(page.locator('[id="plan.spend.steps.0.then"]')).toHaveValue('glides');
    await expect(page.getByTestId('plan.spend.steps.1.fromAge')).toHaveValue('76');
    await expect(page.getByTestId('plan.spend.costs.0.label')).toHaveValue('New roof');
    await expect(page.getByTestId('plan.spend.costs.1.years')).toHaveValue('3');
    const region = page.locator('[data-region="plan-spend"]');
    await expect(region).toContainText(`From age 60: ${gbp(first)} a month after tax (£48,000 a year before tax).`);
    await expect(region).toContainText(`From age 66: ${gbp(second)} a month after tax (£42,000 a year before tax), moving evenly to ${gbp(third)} at 76.`);
    await expect(region).toContainText('Your budget is not worked out, so you are choosing by one figure.');
    await expect(page.getByTestId('plan.spend.shape.chart')).toBeVisible();
    expect(await page.locator('[data-testid="plan.spend.shape.chart"] g.year').count()).toBe(32);
    const text = await page.locator('#app').innerText();
    expect(text).not.toMatch(/months? to go|years? to go|countdown/i);
    expect(text).not.toMatch(/undefined|NaN/);

    // a new first figure; a step at 85, falling 1% a year — the derived lines follow before Save
    await page.getByTestId('plan.spend.first.amount').fill('3,000');
    await expect(page.locator('#plan\\.spend\\.first\\.amount\\.help')).toHaveText(`${gbp(yearlyGross(3000, b))} a year before tax, as the plan saves it.`);
    await page.getByTestId('plan.spend.steps.add').click();
    await expect(page.locator('[data-card="steps.n1"] > legend')).toHaveText('Step 3');
    await page.getByTestId('plan.spend.steps.n1.fromAge').fill('85');
    await page.getByTestId('plan.spend.steps.n1.amount').fill('2,000');
    await page.locator('[id="plan.spend.steps.n1.then"]').selectOption('falls');
    await page.getByTestId('plan.spend.steps.n1.fallsPct').fill('1');
    await expect(region).toContainText(`From age 85: £2,000 a month after tax (${gbp(yearlyGross(2000, b))} a year before tax), falling 1% a year to`);
    // Enter in a box submits
    await page.getByTestId('plan.spend.steps.n1.fallsPct').press('Enter');
    const toast = page.getByTestId('plan.spend.toast');
    await expect(toast).toBeVisible();
    await expect(toast).toContainText('Saved. From age 60: £3,000 a month after tax. Later steps: 3. One-off costs: 2.');
    // one plan written, by the declared keys only; the locked plan byte-identical; the boxes now show the saved facts
    const after = await storedPlans(page);
    const before = JSON.parse(stored);
    expect(JSON.stringify(after[1])).toBe(JSON.stringify(before[1]));
    expect(stripped(after[0])).toBe(stripped(before[0]));
    const S = after[0].stressTool.settings;
    expect(S.incomeShape).toBe('phases');
    expect(S.incomeSteps).toEqual([{ amount: yearlyGross(3000, b), fromAge: 60 }, before[0].stressTool.settings.incomeSteps[1], before[0].stressTool.settings.incomeSteps[2], { fromAge: 85, amount: yearlyGross(2000, b), decline: 1 }]);
    expect(S.baseSalary).toBe(yearlyGross(3000, b));
    expect(S.targetSchedule.length).toBe(S.duration + 1);
    expect(S.targetSchedule[0]).toBe(yearlyGross(3000, b));
    expect(S.extraWithdrawals).toEqual(before[0].stressTool.settings.extraWithdrawals);
    expect(after[0].decisionTool.settings.baseSalary).toBe(yearlyGross(3000, b));
    expect(after[0].decisionTool.settings.targetSchedule).toEqual(S.targetSchedule);
    expect(after[0].lastModified).not.toBe(before[0].lastModified);
    await expect(page.getByTestId('plan.spend.first.amount')).toHaveValue('3000');
    await expect(page.getByTestId('plan.spend.steps.2.fromAge')).toHaveValue('85');
    await expect(page.locator('[data-saved-for="steps.2.fromAge"]')).toHaveText('From your plan, saved 30 September 2026 (85)');
    const keys = await page.evaluate(() => ({ session: Object.keys(sessionStorage), local: Object.keys(localStorage) }));
    for (const k of [...keys.session, ...keys.local]) expect(OWN_KEYS.has(k) || k === GUEST_KEY, `a key the preview must not write: ${k}`).toBe(true);

    // the plan page: the section says so, and links back here
    await page.goto(v7('#/plan/SpendPlan01/plan'));
    await expect(page.getByTestId('plan.step.plan')).toBeVisible();
    const section = page.locator('[data-section="pays"]');
    await expect(section).toContainText(`${gbp(yearlyGross(3000, b))} a year before tax`);
    await expect(section).toContainText('From age 85');
    await expect(section).toContainText('falling 1% a year');
    await expect(page.getByTestId('plan.plan.edit.pays')).toHaveText('Change this here');

    // the planner, in the same window, on the way-of-drawing section: its own income-shape boxes hold the new values
    await page.getByTestId('plan.plan.change.way').click();
    await page.waitForURL((u) => new URL(u).pathname === '/' || new URL(u).pathname === '/index.html');
    await expect(page.locator('#landingTryGuest')).toBeVisible();
    await page.locator('#landingTryGuest').click();
    await expect(page.locator('#mainApp')).toBeVisible();
    await expect(page.locator('#openPlaceNote')).toContainText('Opened from the preview.');
    await expect(page.locator('.tab[data-tab="stress"]')).toHaveClass(/active/);
    const stepRows = page.locator('#incomeStepsEditor input[type="number"]');
    const values = await stepRows.evaluateAll((els) => els.map((e) => e.value));
    expect(values).toContain('85');
    expect(values).toContain(String(yearlyGross(3000, b)));
    expect(values).toContain(String(yearlyGross(2000, b)));
    await expect(page.locator('#ssBaseSalary')).toHaveValue(String(yearlyGross(3000, b)));
    // the planner's own loader stamps its upgrade as it always has; this step's keys are as the preview wrote them
    const plansNow = await storedPlans(page);
    for (const k of SPEND_WRITES) { const [tool, , key] = k.split('.'); expect(plansNow[0][tool].settings[key], k).toEqual(after[0][tool].settings[key]); }

    // back in the preview: the same change undone by hand, then Undo of that: byte for byte
    await page.goto(v7('#/plan/SpendPlan01/spend'));
    await expect(page.getByTestId('plan.step.spend')).toBeVisible();
    await page.getByTestId('plan.spend.first.amount').fill(String(first));
    await page.getByTestId('plan.spend.steps.remove.2').click();
    await page.getByTestId('plan.spend.save').click();
    await expect(page.getByTestId('plan.spend.toast')).toContainText(`Saved. From age 60: ${gbp(first)} a month after tax. Later steps: 2.`);
    const restored = await storedPlans(page);
    expect(stripped(restored[0])).toBe(stripped(plansNow[0]));   // as the planner left it, but for this step's keys
    // a figure typed by hand is grossed up by the planner's own sum: £3,410 a month is the rounded take-home of £48,000, so it lands on £48,008
    expect(restored[0].stressTool.settings.incomeSteps).toEqual([{ amount: yearlyGross(first, b), fromAge: 60 }, ...before[0].stressTool.settings.incomeSteps.slice(1)]);
    expect(restored[0].stressTool.settings.baseSalary).toBe(yearlyGross(first, b));
    expect(Math.abs(yearlyGross(first, b) - 48000)).toBeLessThan(20);
    await page.getByTestId('plan.spend.undo').click();
    await expect(page.getByTestId('plan.spend.toast')).toContainText('Put back as it was.');
    const undone = await storedPlans(page);
    expect(JSON.stringify(undone[0])).toBe(JSON.stringify(plansNow[0]));   // exactly as it was before the second save, stamp included
  });

  test('a box left wrong is marked in plain words and nothing is written; Cancel clears the typing; a locked plan has no box', async ({ page }) => {
    test.setTimeout(120_000);
    const plan = lumpyPlan();
    const locked = lockedPlan();
    const stored = await plant(page, [plan, locked]);
    await page.goto(v7('#/plan/SpendPlan01/spend'));
    await expect(page.getByTestId('plan.step.spend')).toBeVisible();
    await page.getByTestId('plan.spend.steps.0.fromAge').fill('60');
    await page.getByTestId('plan.spend.save').click();
    await expect(page.locator('[data-error-for="plan.spend.steps.0.fromAge"]')).toHaveText('This is not later than the plan’s first year, at 60. Make it later, or change the figure above instead.');
    await expect(page.getByTestId('plan.spend.problem')).toHaveText('Have a look at the boxes marked above.');
    await expect(page.getByTestId('plan.spend.steps.0.fromAge')).toBeFocused();
    expect(await page.evaluate((k) => sessionStorage.getItem(k), GUEST_KEY)).toBe(stored);
    await page.getByTestId('plan.spend.cancel').click();
    await expect(page.getByTestId('plan.spend.steps.0.fromAge')).toHaveValue('66');
    expect(await page.evaluate(() => sessionStorage.getItem('pt_v7_draft'))).toBe(null);
    // the locked plan: figures only
    await page.goto(v7('#/plan/SpendLocked02/spend'));
    await expect(page.getByTestId('plan.step.spend')).toBeVisible();
    expect(await page.locator('#app input, #app select, #app textarea').count()).toBe(0);
    await expect(page.getByTestId('plan.spend.fixed')).toHaveText('Fixed when you locked the plan on 1 July 2026.');
    await expect(page.locator('[data-region="plan-spend"]')).toContainText('(£52,000 a year before tax).');
    expect(await page.evaluate((k) => sessionStorage.getItem(k), GUEST_KEY)).toBe(stored);
  });
});
