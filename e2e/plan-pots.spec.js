/**
 * "Your pots and tax", without an account (research/v7/editing-in-v7.md 9.5, T4). The PUBLISHED build, which serves the
 * planner at / and the preview at /v7/ on one site, so this window's plans (sessionStorage pt_guest_scenarios) are seen
 * by both.
 *
 *  The lumpy plan (corpus 12: a pension pot of £440,000 split 280/120/40, £60,000 of ISAs growing "mostly cash", an
 *  ordinary account of £85,000 at the higher rate, a charge of 0.5%) is planted in the window. On #/plan/<id>/pots every
 *  box holds the saved fact with its source; the pension pot, the ISA growth choice and the charge are changed; Save
 *  writes ONE plan: the stored text differs only in the step's declared keys (and the planner's last-changed stamp);
 *  Undo puts the text back byte for byte. The planner, opened at / in the same window, shows the new values in its own
 *  boxes. A locked plan's page has no box. Nothing is written anywhere else.
 *
 * Firebase is never reached: the preview reads and writes this window's plans; every request outside the site is stopped.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test, expect, PROD, REPO, FIXED_NOW } from './helpers/app.js';
import { POTS_WRITES } from '../src/answers/plan/schema.js';

test.use({ outside: 'block' });

const GUEST_KEY = 'pt_guest_scenarios';
const OWN_KEYS = new Set(['pt_v7_draft', 'pt_lastActivity', 'pt_open_place', 'pt_open_plan', 'pt_guest_minutes', 'pt_activeScenarioId']);
const v7 = (hash) => PROD + '/v7/' + hash;

function lumpyPlan() {
  const plan = JSON.parse(readFileSync(join(REPO, 'tests', 'fixtures', 'plans', '12-lumpy-db-gia.json'), 'utf8'));
  plan.id = 'PotsPlan01';
  plan.planDetails.name = 'Alex’s plan';
  plan.isActive = true;
  delete plan.household;
  return plan;
}
function lockedPlan() {
  const plan = JSON.parse(readFileSync(join(REPO, 'tests', 'fixtures', 'plans', '03-gilt-ladder-runup.json'), 'utf8'));
  plan.id = 'PotsLocked02';
  plan.isActive = false;
  return plan;
}
/** A plan's text with the declared paths and the stamp taken out: what must be byte-identical across a save. */
function stripped(plan) {
  const out = JSON.parse(JSON.stringify(plan));
  for (const path of [...POTS_WRITES, 'lastModified']) { const parts = path.split('.'); let o = out; for (let i = 0; i < parts.length - 1 && o; i++) o = o[parts[i]]; if (o) delete o[parts[parts.length - 1]]; }
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

test.describe('"Your pots and tax", without an account', () => {
  test('the boxes with their sources; a new pension pot, ISA growth and charge; Save (one plan, the declared keys only); Undo byte for byte; the planner shows the new values', async ({ page, watch }) => {
    test.setTimeout(240_000);
    // as on the live site today: the engine worker asks for the market files beside itself (e2e/old-app-unchanged.spec.js)
    watch.allow(/^asked for a file that is not there: \/assets\/data\/(gilts|equity)\.json$/);
    const plan = lumpyPlan();
    const locked = lockedPlan();
    const stored = await plant(page, [plan, locked]);
    await page.goto(v7('#/plan/PotsPlan01/pots'));
    await expect(page.locator('#app [data-screen]')).toHaveAttribute('data-screen', 'plan.pots');
    await expect(page.getByTestId('plan.step.pots')).toHaveText('Your pots and tax');
    const widths = await page.evaluate(() => ({ doc: document.documentElement.scrollWidth, win: window.innerWidth }));
    expect(widths.doc, 'no sideways scroll').toBeLessThanOrEqual(widths.win);
    // the saved facts, each with its source
    await expect(page.getByTestId('plan.pots.pension')).toHaveValue('440000');
    await expect(page.locator('[data-saved-for="pension"]')).toHaveText('From your plan, saved 11 September 2026 (440000)');
    await expect(page.getByTestId('plan.pots.isa')).toHaveValue('60000');
    await expect(page.getByTestId('plan.pots.isaGrowth.cash')).toBeChecked();
    await expect(page.getByTestId('plan.pots.taxable')).toHaveValue('85000');
    await expect(page.getByTestId('plan.pots.giaBand.higher')).toBeChecked();
    await expect(page.getByTestId('plan.pots.earnings')).toHaveValue('12000');
    await expect(page.getByTestId('plan.pots.charges')).toHaveValue('0.5');
    await expect(page.getByTestId('plan.pots.pa')).toHaveValue('12570');
    await expect(page.getByTestId('plan.pots.taxFree.drawdown')).toBeChecked();
    const region = page.locator('[data-region="plan-pots"]');
    await expect(region).toContainText('Pension £440,000 and ISAs and savings £60,000 today; £85,000 in your ordinary account.');
    await expect(region).toContainText('Split as saved: £280,000 shares, £120,000 bonds, £40,000 cash.');
    await expect(region).toContainText('What each choice saves in tax over the plan comes from ‘Does it last?’, later.');
    const text = await page.locator('#app').innerText();
    expect(text).not.toMatch(/months? to go|years? to go|countdown/i);
    expect(text).not.toMatch(/undefined|NaN/);

    // a new pension pot, "Invested like my pension", a charge of 0.25 — the derived lines follow before Save
    await page.getByTestId('plan.pots.pension').fill('500,000');
    await expect(region).toContainText('Split as saved: £318,182 shares, £136,364 bonds, £45,454 cash.');
    await page.getByTestId('plan.pots.isaGrowth.invested').check();
    await page.getByTestId('plan.pots.charges').fill('0.25');
    await expect(region).toContainText('Charges of 0.25% a year come off your funds and cash every month');
    await expect(region).toContainText('Your ISAs and savings grow like your pension');
    // Enter in a box submits
    await page.getByTestId('plan.pots.charges').press('Enter');
    const toast = page.getByTestId('plan.pots.toast');
    await expect(toast).toBeVisible();
    await expect(toast).toContainText('Saved. Pension £500,000, ISAs and savings £60,000. Charges 0.25% a year.');
    // one plan written, by the declared keys only; the locked plan byte-identical; the boxes now show the saved facts
    const after = await storedPlans(page);
    const before = JSON.parse(stored);
    expect(JSON.stringify(after[1])).toBe(JSON.stringify(before[1]));
    expect(stripped(after[0])).toBe(stripped(before[0]));
    const S = after[0].stressTool.settings;
    expect([S.equityMin, S.bondMin, S.cashTarget]).toEqual([318182, 136364, 45454]);
    expect(S.isaGrowth).toBe('invested');
    expect(S.chargesPct).toBe(0.25);
    expect(S.isaBalance).toBe(60000);
    expect(S.taxableStart).toBe(85000);
    expect(after[0].decisionTool.settings).toEqual(before[0].decisionTool.settings);
    expect(after[0].lastModified).not.toBe(before[0].lastModified);
    await expect(page.getByTestId('plan.pots.pension')).toHaveValue('500000');
    await expect(page.locator('[data-saved-for="pension"]')).toHaveText('From your plan, saved 30 September 2026 (500000)');
    await expect(page.getByTestId('plan.pots.isaGrowth.invested')).toBeChecked();
    const keys = await page.evaluate(() => ({ session: Object.keys(sessionStorage), local: Object.keys(localStorage) }));
    for (const k of [...keys.session, ...keys.local]) expect(OWN_KEYS.has(k) || k === GUEST_KEY, `a key the preview must not write: ${k}`).toBe(true);

    // the plan page: the section says so, and links back here
    await page.goto(v7('#/plan/PotsPlan01/plan'));
    await expect(page.getByTestId('plan.step.plan')).toBeVisible();
    const section = page.locator('[data-section="pots"]');
    await expect(section).toContainText('£500,000');
    await expect(section).toContainText('£318,182 shares');
    await expect(page.getByTestId('plan.plan.edit.pots')).toHaveText('Change this here');

    // the planner, in the same window, on the way-of-drawing section: its own pot, ISA growth and charges boxes hold the new values
    await page.getByTestId('plan.plan.change.way').click();
    await page.waitForURL((u) => new URL(u).pathname === '/' || new URL(u).pathname === '/index.html');
    await expect(page.locator('#landingTryGuest')).toBeVisible();
    await page.locator('#landingTryGuest').click();
    await expect(page.locator('#mainApp')).toBeVisible();
    await expect(page.locator('#openPlaceNote')).toContainText('Opened from the preview.');
    await expect(page.locator('.tab[data-tab="stress"]')).toHaveClass(/active/);
    await expect(page.locator('#ssPot')).toHaveValue('500000');
    await expect(page.locator('#ssIsaGrowthInvested')).toBeChecked();
    await expect(page.locator('#ssChargesPct')).toHaveValue('0.25');
    await expect(page.locator('#ssIsaBalance')).toHaveValue('60000');
    await expect(page.locator('#ssTaxableStart')).toHaveValue('85000');
    // the planner's own loader stamps its upgrade as it always has; this step's keys are as the preview wrote them
    const plansNow = await storedPlans(page);
    for (const k of POTS_WRITES) { const [tool, , key] = k.split('.'); expect(plansNow[0][tool].settings[key], k).toEqual(after[0][tool].settings[key]); }

    // back in the preview: the same change undone by hand, then Undo of that: byte for byte
    await page.goto(v7('#/plan/PotsPlan01/pots'));
    await expect(page.getByTestId('plan.step.pots')).toBeVisible();
    await page.getByTestId('plan.pots.pension').fill('440,000');
    await page.getByTestId('plan.pots.isaGrowth.cash').check();
    await page.getByTestId('plan.pots.charges').fill('0.5');
    await page.getByTestId('plan.pots.save').click();
    await expect(page.getByTestId('plan.pots.toast')).toContainText('Saved. Pension £440,000, ISAs and savings £60,000. Charges 0.5% a year.');
    const restored = await storedPlans(page);
    expect(stripped(restored[0])).toBe(stripped(plansNow[0]));   // as the planner left it, but for this step's keys
    expect([restored[0].stressTool.settings.equityMin, restored[0].stressTool.settings.bondMin, restored[0].stressTool.settings.cashTarget]).toEqual([280000, 120000, 40000]);
    await page.getByTestId('plan.pots.undo').click();
    await expect(page.getByTestId('plan.pots.toast')).toContainText('Put back as it was.');
    const undone = await storedPlans(page);
    expect(JSON.stringify(undone[0])).toBe(JSON.stringify(plansNow[0]));   // exactly as it was before the second save, stamp included
  });

  test('a box left wrong is marked in plain words and nothing is written; Cancel clears the typing; a locked plan has no box', async ({ page }) => {
    test.setTimeout(120_000);
    const plan = lumpyPlan();
    const locked = lockedPlan();
    const stored = await plant(page, [plan, locked]);
    await page.goto(v7('#/plan/PotsPlan01/pots'));
    await expect(page.getByTestId('plan.step.pots')).toBeVisible();
    await page.getByTestId('plan.pots.charges').fill('4');
    await page.getByTestId('plan.pots.save').click();
    await expect(page.locator('[data-error-for="plan.pots.charges"]')).toHaveText('A charge from 0 to 3% a year, please.');
    await expect(page.getByTestId('plan.pots.problem')).toHaveText('Have a look at the boxes marked above.');
    await expect(page.getByTestId('plan.pots.charges')).toBeFocused();
    expect(await page.evaluate((k) => sessionStorage.getItem(k), GUEST_KEY)).toBe(stored);
    await page.getByTestId('plan.pots.cancel').click();
    await expect(page.getByTestId('plan.pots.charges')).toHaveValue('0.5');
    expect(await page.evaluate(() => sessionStorage.getItem('pt_v7_draft'))).toBe(null);
    // the locked plan: figures only
    await page.goto(v7('#/plan/PotsLocked02/pots'));
    await expect(page.getByTestId('plan.step.pots')).toBeVisible();
    expect(await page.locator('#app input, #app select, #app textarea').count()).toBe(0);
    await expect(page.getByTestId('plan.pots.fixed')).toHaveText('Fixed when you locked the plan on 1 July 2026.');
    await expect(page.locator('[data-region="plan-pots"]')).toContainText('Pension £1,050,000 and ISAs and savings £80,000 today.');
    expect(await page.evaluate((k) => sessionStorage.getItem(k), GUEST_KEY)).toBe(stored);
  });
});
