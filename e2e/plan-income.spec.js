/**
 * "Money that comes in anyway", without an account (research/v7/editing-in-v7.md 7.5, I5). The PUBLISHED build, which
 * serves the planner at / and the preview at /v7/ on one site, so this window's plans (sessionStorage pt_guest_scenarios)
 * are seen by both.
 *
 *  The lumpy plan (corpus 12: a forecast, one final-salary pension, other income, two incomes for some years, two lump
 *  sums) is planted in the window. On #/plan/<id>/income the boxes and cards hold the saved facts with their sources; the
 *  State Pension choice is changed to none, a second final-salary pension is added at an age and a lump sum at an age;
 *  Save writes ONE plan: the stored text differs only in the step's declared keys (and the planner's last-changed stamp);
 *  Undo puts the text back byte for byte. The planner, opened at / in the same window by "Change this in the planner" on
 *  the Pots section, shows the new values in its own boxes. A locked plan's page has no box. Nothing is written anywhere else.
 *
 * Firebase is never reached: the preview reads and writes this window's plans; every request outside the site is stopped.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test, expect, PROD, REPO, FIXED_NOW } from './helpers/app.js';
import { INCOME_WRITES } from '../src/answers/plan/schema.js';

test.use({ outside: 'block' });

const GUEST_KEY = 'pt_guest_scenarios';
const OWN_KEYS = new Set(['pt_v7_draft', 'pt_lastActivity', 'pt_open_place', 'pt_open_plan', 'pt_guest_minutes', 'pt_activeScenarioId']);
const v7 = (hash) => PROD + '/v7/' + hash;

function lumpyPlan() {
  const plan = JSON.parse(readFileSync(join(REPO, 'tests', 'fixtures', 'plans', '12-lumpy-db-gia.json'), 'utf8'));
  plan.id = 'IncomePlan01';
  plan.planDetails.name = 'Alex’s plan';
  plan.isActive = true;
  delete plan.household;
  return plan;
}
function lockedPlan() {
  const plan = JSON.parse(readFileSync(join(REPO, 'tests', 'fixtures', 'plans', '03-gilt-ladder-runup.json'), 'utf8'));
  plan.id = 'IncomeLocked02';
  plan.isActive = false;
  return plan;
}
/** A plan's text with the declared paths and the stamp taken out: what must be byte-identical across a save. */
function stripped(plan) {
  const out = JSON.parse(JSON.stringify(plan));
  for (const path of [...INCOME_WRITES, 'lastModified']) { const parts = path.split('.'); let o = out; for (let i = 0; i < parts.length - 1 && o; i++) o = o[parts[i]]; if (o) delete o[parts[parts.length - 1]]; }
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

test.describe('"Money that comes in anyway", without an account', () => {
  test('the boxes and cards; none, a second final-salary pension and a lump sum; Save (one plan, the declared keys only); Undo byte for byte; the planner shows the new values', async ({ page, watch }) => {
    test.setTimeout(240_000);
    // as on the live site today: the engine worker asks for the market files beside itself (e2e/old-app-unchanged.spec.js)
    watch.allow(/^asked for a file that is not there: \/assets\/data\/(gilts|equity)\.json$/);
    const plan = lumpyPlan();
    const locked = lockedPlan();
    const stored = await plant(page, [plan, locked]);
    await page.goto(v7('#/plan/IncomePlan01/income'));
    await expect(page.locator('#app [data-screen]')).toHaveAttribute('data-screen', 'plan.income');
    await expect(page.getByTestId('plan.step.income')).toHaveText('Money that comes in anyway');
    const widths = await page.evaluate(() => ({ doc: document.documentElement.scrollWidth, win: window.innerWidth }));
    expect(widths.doc, 'no sideways scroll').toBeLessThanOrEqual(widths.win);
    // the saved facts, each with its source
    await expect(page.getByTestId('plan.income.spKind.forecast')).toBeChecked();
    await expect(page.getByTestId('plan.income.spWeekly')).toHaveValue('224.9');
    await expect(page.locator('[data-saved-for="spKind"]')).toHaveText('From your plan, saved 11 September 2026 (My forecast, £224.90 a week)');
    await expect(page.getByTestId('plan.income.fs.0.amount')).toHaveValue('9400');
    await expect(page.getByTestId('plan.income.fs.0.fromAge')).toHaveValue('65');
    await expect(page.locator('[data-saved-for="fs.0.fromAge"]')).toHaveText('From your plan, saved 11 September 2026 (65)');
    await expect(page.getByTestId('plan.income.other')).toHaveValue('1200');
    await expect(page.getByTestId('plan.income.streams.0.label')).toHaveValue('Rental flat');
    await expect(page.getByTestId('plan.income.lumps.1.atAge')).toHaveValue('69');
    const region = page.locator('[data-region="plan-income"]');
    await expect(region).toContainText('State Pension: £11,695 a year before tax from age 67 (tax year 2034/35).');
    await expect(region).toContainText('Downsizing: £90,000 at age 69 (tax year 2036/37), a cash lump sum.');
    const text = await page.locator('#app').innerText();
    expect(text).not.toMatch(/months? to go|years? to go|countdown/i);
    expect(text).not.toMatch(/undefined|NaN/);

    // none; a second final-salary pension at 66; a lump sum at 62 — the derived lines follow before Save
    await page.getByTestId('plan.income.spKind.none').check();
    await expect(page.getByTestId('plan.income.spWeekly')).toHaveCount(0);
    await expect(region).toContainText('No State Pension: the plan counts none.');
    await page.getByTestId('plan.income.fs.add').click();
    await expect(page.locator('[data-card="fs.n1"] > legend')).toHaveText('Final-salary pension 2');
    await page.getByTestId('plan.income.fs.n1.amount').fill('3,000');
    await page.getByTestId('plan.income.fs.n1.fromAge').fill('66');
    await page.getByTestId('plan.income.fs.n1.rises.cpi').check();
    await expect(region).toContainText('Final-salary pension 2: £3,000 a year before tax from age 66 (tax year 2033/34), going up with prices.');
    await page.getByTestId('plan.income.lumps.add').click();
    await page.getByTestId('plan.income.lumps.n1.label').fill('Gift');
    await page.getByTestId('plan.income.lumps.n1.amount').fill('10000');
    await page.getByTestId('plan.income.lumps.n1.atAge').fill('62');
    await expect(region).toContainText('Gift: £10,000 at age 62 (tax year 2029/30), a cash lump sum.');
    // Enter in a box submits
    await page.getByTestId('plan.income.lumps.n1.atAge').press('Enter');
    const toast = page.getByTestId('plan.income.toast');
    await expect(toast).toBeVisible();
    await expect(toast).toContainText('Saved. State Pension: none. Final-salary pensions: 2. Income for some years: 2. Lump sums: 3.');
    // one plan written, by the declared keys only; the locked plan byte-identical; the boxes now show the saved facts
    const after = await storedPlans(page);
    const before = JSON.parse(stored);
    expect(JSON.stringify(after[1])).toBe(JSON.stringify(before[1]));
    expect(stripped(after[0])).toBe(stripped(before[0]));
    expect(after[0].stressTool.settings.spWeeklyAmount).toBe(0);
    expect(after[0].stressTool.settings.statePension).toBe(0);
    expect(after[0].stressTool.settings.spStartDate).toBe('25 July 2034');
    expect(after[0].stressTool.settings.dbAmount).toBe(9400);
    expect(after[0].stressTool.settings.extraIncomes).toEqual([...before[0].stressTool.settings.extraIncomes, { label: 'Final-salary pension', annual: 3000, startYear: 6, endYear: null, indexation: 'cpi' }]);
    expect(after[0].stressTool.settings.windfalls).toEqual([...before[0].stressTool.settings.windfalls, { label: 'Gift', amount: 10000, year: 2, wrapper: 'cash' }]);
    expect(after[0].lastModified).not.toBe(before[0].lastModified);
    await expect(page.getByTestId('plan.income.spKind.none')).toBeChecked();
    await expect(page.getByTestId('plan.income.fs.1.fromAge')).toHaveValue('66');
    await expect(page.locator('[data-saved-for="lumps.2.atAge"]')).toHaveText('From your plan, saved 30 September 2026 (62)');
    const keys = await page.evaluate(() => ({ session: Object.keys(sessionStorage), local: Object.keys(localStorage) }));
    for (const k of [...keys.session, ...keys.local]) expect(OWN_KEYS.has(k) || k === GUEST_KEY, `a key the preview must not write: ${k}`).toBe(true);

    // the plan page: the section says so, and links back here
    await page.goto(v7('#/plan/IncomePlan01/plan'));
    await expect(page.getByTestId('plan.step.plan')).toBeVisible();
    const section = page.locator('[data-section="income"]');
    await expect(section).toContainText('No State Pension figure.');
    await expect(section).toContainText('Gift');
    await expect(section).toContainText('at age 62, a cash lump sum');
    await expect(page.getByTestId('plan.plan.edit.income')).toHaveText('Change this here');

    // the planner, in the same window, on the pots section: its own boxes hold the new values
    await page.getByTestId('plan.plan.change.pots').click();
    await page.waitForURL((u) => new URL(u).pathname === '/' || new URL(u).pathname === '/index.html');
    await expect(page.locator('#landingTryGuest')).toBeVisible();
    await page.locator('#landingTryGuest').click();
    await expect(page.locator('#mainApp')).toBeVisible();
    await expect(page.locator('#openPlaceNote')).toContainText('Opened from the preview.');
    await expect(page.locator('.tab[data-tab="stress"]')).toHaveClass(/active/);
    await expect(page.locator('#ssSpWeeklyAmount')).toHaveValue('');
    await expect(page.locator('#ssDbAmount')).toHaveValue('9400');
    await expect(page.locator('#ssDbStartAge')).toHaveValue('65');
    await expect(page.locator('#ssOther')).toHaveValue('1200');
    const rows = page.locator('#ssExtraIncomes input[type="text"]');
    await expect(rows.filter({ hasText: '' }).nth(0)).toHaveValue('Rental flat');
    const labels = await page.locator('#ssExtraIncomes input[type="text"]').evaluateAll((els) => els.map((e) => e.value));
    expect(labels).toContain('Final-salary pension');
    expect(labels).toContain('Gift');
    // the planner's own loader stamps its upgrade (schemaVersion, charges, the ISA choice) as it always has; this step's keys are as the preview wrote them
    const plansNow = await storedPlans(page);
    for (const k of INCOME_WRITES) { const key = k.split('.').pop(); expect(plansNow[0].stressTool.settings[key], key).toEqual(after[0].stressTool.settings[key]); }

    // back in the preview: the same change undone by hand, then Undo of that: byte for byte
    await page.goto(v7('#/plan/IncomePlan01/income'));
    await expect(page.getByTestId('plan.step.income')).toBeVisible();
    await page.getByTestId('plan.income.spKind.forecast').check();
    await page.getByTestId('plan.income.spWeekly').fill('224.9');
    await page.getByTestId('plan.income.fs.remove.1').click();
    await page.getByTestId('plan.income.lumps.remove.2').click();
    await page.getByTestId('plan.income.save').click();
    await expect(page.getByTestId('plan.income.toast')).toContainText('Saved. State Pension: £11,695 a year from age 67.');
    const restored = await storedPlans(page);
    expect(stripped(restored[0])).toBe(stripped(plansNow[0]));   // as the planner left it, but for this step's keys
    for (const k of ['spWeeklyAmount', 'extraIncomes', 'windfalls', 'dbAmount', 'dbStartYear', 'other']) expect(restored[0].stressTool.settings[k]).toEqual(before[0].stressTool.settings[k]);
    await page.getByTestId('plan.income.undo').click();
    await expect(page.getByTestId('plan.income.toast')).toContainText('Put back as it was.');
    const undone = await storedPlans(page);
    expect(JSON.stringify(undone[0])).toBe(JSON.stringify(plansNow[0]));   // exactly as it was before the second save, stamp included
  });

  test('a box left wrong is marked in plain words and nothing is written; Cancel clears the typing; a locked plan has no box', async ({ page }) => {
    test.setTimeout(120_000);
    const plan = lumpyPlan();
    const locked = lockedPlan();
    const stored = await plant(page, [plan, locked]);
    await page.goto(v7('#/plan/IncomePlan01/income'));
    await expect(page.getByTestId('plan.step.income')).toBeVisible();
    await page.getByTestId('plan.income.lumps.1.atAge').fill('59');
    await page.getByTestId('plan.income.save').click();
    await expect(page.locator('[data-error-for="plan.income.lumps.1.atAge"]')).toHaveText('The plan’s first year is at age 60: money arriving before then counts as part of your pots today. An age of 60 or more, please.');
    await expect(page.getByTestId('plan.income.problem')).toHaveText('Have a look at the boxes marked above.');
    await expect(page.getByTestId('plan.income.lumps.1.atAge')).toBeFocused();
    expect(await page.evaluate((k) => sessionStorage.getItem(k), GUEST_KEY)).toBe(stored);
    await page.getByTestId('plan.income.cancel').click();
    await expect(page.getByTestId('plan.income.lumps.1.atAge')).toHaveValue('69');
    expect(await page.evaluate(() => sessionStorage.getItem('pt_v7_draft'))).toBe(null);
    // the locked plan: figures only
    await page.goto(v7('#/plan/IncomeLocked02/income'));
    await expect(page.getByTestId('plan.step.income')).toBeVisible();
    expect(await page.locator('#app input, #app select, #app textarea').count()).toBe(0);
    await expect(page.getByTestId('plan.income.fixed')).toHaveText('Fixed when you locked the plan on 1 July 2026.');
    await expect(page.locator('[data-region="plan-income"]')).toContainText('State Pension: £11,973 a year before tax from age 67 (tax year 2036/37).');
    expect(await page.evaluate((k) => sessionStorage.getItem(k), GUEST_KEY)).toBe(stored);
  });
});
