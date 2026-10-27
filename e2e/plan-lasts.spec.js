/**
 * "Does it last?", without an account (research/v7/editing-in-v7.md 10.6, L7). The PUBLISHED build, which serves the
 * planner at / and the preview at /v7/ on one site, so this window's plans (sessionStorage pt_guest_scenarios) are seen
 * by both.
 *
 *  A Pots & Valves draft (corpus 02: 33 years, cuts on at 20% after 3 months) is planted in the window with a locked gilt
 *  ladder (corpus 03). On #/plan/<id>/lasts the one test runs in the V7 worker — the engine's chunk loads lazily, the
 *  progress bar shows, the band arrives within the slowed budget — and every figure on the band equals the same run in
 *  Node on the same plan, to the pound. The dials hold the saved facts with their sources; the cut is changed to 30% after
 *  4 months; Save writes ONE plan: the stored text differs only in the step's declared keys (and the planner's last-changed
 *  stamp); the test runs again on the saved plan and its band equals the Node run on the saved text; Undo puts the text
 *  back byte for byte. The locked plan shows the document's figure and today's. Nothing is written anywhere else.
 *
 * Firebase is never reached: the preview reads and writes this window's plans; every request outside the site is stopped.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test, expect, PROD, REPO, FIXED_NOW, SLOWDOWN, record } from './helpers/app.js';
import { lastsInNode } from './helpers/lastsInNode.js';
import { LASTS_WRITES } from '../src/answers/plan/schema.js';

test.use({ outside: 'block' });

const GUEST_KEY = 'pt_guest_scenarios';
const OWN_KEYS = new Set(['pt_v7_draft', 'pt_lastActivity', 'pt_open_place', 'pt_open_plan', 'pt_guest_minutes', 'pt_activeScenarioId', 'pt_lastSeenVersion']);   // pt_lastSeenVersion: What's new marks a first visit seen (6.44.0)
const v7 = (hash) => PROD + '/v7/' + hash;
const TODAY = FIXED_NOW.slice(0, 10);
/** The slowed budget for the one figure: the final answer's (e2e/helpers/app.js FIRST_ANSWER_BUDGET.finalMs). */
const BUDGET_MS = 15_000;

function draftPlan() {
  const plan = JSON.parse(readFileSync(join(REPO, 'tests', 'fixtures', 'plans', '02-pnv-draft.json'), 'utf8'));
  plan.id = 'LastsPlan01';
  plan.planDetails.name = 'Alex’s plan';
  plan.isActive = true;
  delete plan.household;
  return plan;
}
function lockedPlan() {
  const plan = JSON.parse(readFileSync(join(REPO, 'tests', 'fixtures', 'plans', '03-gilt-ladder-runup.json'), 'utf8'));
  plan.id = 'LastsLocked02';
  plan.isActive = false;
  return plan;
}
/** A plan's text with the declared paths and the stamp taken out: what must be byte-identical across a save. */
function stripped(plan) {
  const out = JSON.parse(JSON.stringify(plan));
  for (const path of [...LASTS_WRITES, 'lastModified']) { const parts = path.split('.'); let o = out; for (let i = 0; i < parts.length - 1 && o; i++) o = o[parts[i]]; if (o) delete o[parts[parts.length - 1]]; }
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

/** The figures on a band, as the data the screen carries. */
async function bandFigures(page, testid) {
  const band = page.getByTestId(testid);
  await expect(band).toHaveAttribute('data-ok', '1');
  return band.evaluate((el) => ({ chance: Number(el.getAttribute('data-chance')), typical: Number(el.getAttribute('data-typical')), bad: Number(el.getAttribute('data-bad')), good: Number(el.getAttribute('data-good')), futures: Number(el.getAttribute('data-futures')), histories: Number(el.getAttribute('data-histories')), years: Number(el.getAttribute('data-years')), cutN: el.getAttribute('data-cut-n') == null ? null : Number(el.getAttribute('data-cut-n')), cutPerYear: el.getAttribute('data-cut-per-year') == null ? null : Number(el.getAttribute('data-cut-per-year')), cutYears: el.getAttribute('data-cut-years') == null ? null : Number(el.getAttribute('data-cut-years')), verdict: el.getAttribute('data-verdict') }));
}
/** The same figures from the Node run's result (lastsRun.js), as lasts.js verdictOf reads them. */
function nodeFigures(result) {
  const a = result.a;
  return { chance: a.chancePct, typical: Math.round(a.typicalLeft), bad: Math.round(a.badCaseLeft), good: Math.round(a.goodCaseLeft), futures: a.futures, histories: a.histories, years: Math.round(a.years), cutN: a.cuts ? a.cuts.cutN : null, cutPerYear: a.cuts ? a.cuts.typicalCutPerYear : null, cutYears: a.cuts ? a.cuts.typicalCutYears : null, verdict: a.share >= 0.9 ? 'yes' : a.share >= 0.85 ? 'close' : 'no' };
}
/** Wait for the run on the page to finish and be the plan's own; return how long it took from `since`. */
async function awaitRun(page, since) {
  await expect(page.locator('[data-region="plan-lasts-answer"]')).toHaveAttribute('data-status', 'done', { timeout: 60_000 });
  await expect(page.locator('[data-region="plan-lasts-answer"]')).toHaveAttribute('data-fresh', '1');
  return Date.now() - since;
}

test.describe('"Does it last?", without an account', () => {
  test('the one test runs in the preview and equals the Node run to the pound; the dials with their sources; a new cut; Save (one plan, the declared keys only); the test runs again; Undo byte for byte', async ({ page, watch }, testInfo) => {
    test.setTimeout(300_000);
    // as on the live site today: the engine worker asks for the market files beside itself (e2e/old-app-unchanged.spec.js)
    watch.allow(/^asked for a file that is not there: \/assets\/data\/(gilts|equity)\.json$/);
    const plan = draftPlan();
    const locked = lockedPlan();
    const stored = await plant(page, [plan, locked]);
    const t0 = Date.now();
    await page.goto(v7('#/plan/LastsPlan01/lasts'));
    await expect(page.locator('#app [data-screen]')).toHaveAttribute('data-screen', 'plan.lasts');
    await expect(page.getByTestId('plan.step.lasts')).toHaveText('Does it last?');
    const ms = await awaitRun(page, t0);
    const widths = await page.evaluate(() => ({ doc: document.documentElement.scrollWidth, win: window.innerWidth }));
    expect(widths.doc, 'no sideways scroll').toBeLessThanOrEqual(widths.win);
    record(testInfo, `lasts/${testInfo.project.name}.json`, { firstRunMs: ms, slowdown: SLOWDOWN, firstRunSlowedMs: ms * SLOWDOWN, budgetMs: BUDGET_MS, method: 'From the address being opened to the band for the plan as saved (the lazy engine chunk loaded, the one test run in the worker); measured at full speed and multiplied by the slowdown, which stands for a phone four times slower.' });
    testInfo.annotations.push({ type: 'lasts-run-ms', description: `${ms} ms at full speed; × ${SLOWDOWN} = ${Math.round(ms * SLOWDOWN)} ms against ${BUDGET_MS} ms` });
    expect(ms * SLOWDOWN, 'the figure within the slowed budget').toBeLessThanOrEqual(BUDGET_MS);

    // every figure on the band equals the same run in Node on the same plan
    const before = await bandFigures(page, 'plan.lasts.result');
    const node = lastsInNode(plan, TODAY);
    expect(before).toEqual(nodeFigures(node));
    const band = page.getByTestId('plan.lasts.result');
    await expect(band).toContainText('Your plan lasts in');
    await expect(band.locator('.verdict-word')).toHaveText(/On course|Close|Not yet/);
    await expect(band).toContainText('Left at the end, at today’s prices: typically £');
    await expect(band).toContainText('Income cuts: in ');
    await expect(band).toContainText('Run with the spending cuts you set: up to 20% after 3 months in a row below the plan’s line.');
    await expect(page.getByTestId('plan.lasts.ran')).toContainText('Worked out just now, on the plan as saved');
    await expect(page.locator('[data-section="history"]')).toContainText('What if you had retired into a bad year?');
    expect(await page.locator('[data-testid="plan.lasts.worst"] li').count()).toBe(node.history.worst.length);
    expect(await page.locator('[data-testid="plan.lasts.named"] li').count()).toBe(node.history.named.length);
    // the named stresses as whole decades, and the years one by one (road-to-7.md step 11b): the same run's extras, as Node has them
    expect(await page.locator('[data-testid="plan.lasts.scenarios"] li').count()).toBe(node.extras.scenarios.length);
    const yearRows = node.extras.schedule || node.extras.own;
    await expect(page.getByTestId('plan.lasts.years')).toHaveAttribute('data-years', String(yearRows.length));
    await expect(page.getByTestId('plan.lasts.schedule.table')).toHaveCount(0);
    await page.getByTestId('plan.lasts.schedule').click();
    expect(await page.locator('[data-testid="plan.lasts.schedule.table"] tbody tr').count()).toBe(yearRows.length);
    await expect(page.locator('[data-testid="plan.lasts.schedule.table"] tbody tr').first()).toHaveAttribute('data-age', String(yearRows[0].age));
    if (node.extras.glidepath) {
      await page.getByTestId('plan.lasts.glidepath').click();
      expect(await page.locator('[data-testid="plan.lasts.glidepath.table"] tbody tr').count()).toBe(node.extras.glidepath.rows.length);
      await expect(page.locator('[data-testid="plan.lasts.glidepath.table"] tbody tr').first()).toHaveAttribute('data-total', String(node.extras.glidepath.rows[0].total));
    }
    const text = await page.locator('#app').innerText();
    expect(text).not.toMatch(/months? to go|years? to go|countdown/i);
    expect(text).not.toMatch(/undefined|NaN|Monte Carlo|percentile|FAILED/);

    // the saved facts, each with its source
    await expect(page.getByTestId('plan.lasts.cutsOn.yes')).toBeChecked();
    await expect(page.getByTestId('plan.lasts.cutAfterMonths')).toHaveValue('3');
    await expect(page.locator('[data-saved-for="cutAfterMonths"]')).toHaveText(/From your plan, saved .* \(3\)/);
    await expect(page.getByTestId('plan.lasts.cutPct')).toHaveValue('20');
    await expect(page.getByTestId('plan.lasts.deeperAfterMonths')).toHaveValue('12');
    await expect(page.getByTestId('plan.lasts.buffer')).toHaveValue('15000');
    await expect(page.getByTestId('plan.lasts.reserveOn.no')).toBeChecked();
    const region = page.locator('[data-region="plan-lasts"]');
    await expect(region).toContainText('In a slump, after 3 months in a row below the plan’s line, income is cut by 10% for 12 months and by 20% if it lasts');

    // a deeper cut, sooner — the derived line follows before Save
    await page.getByTestId('plan.lasts.cutPct').fill('30');
    await page.getByTestId('plan.lasts.cutAfterMonths').fill('4');
    await expect(region).toContainText('In a slump, after 4 months in a row below the plan’s line, income is cut by 15% for 12 months and by 30% if it lasts');
    // Enter in a box submits
    const t1 = Date.now();
    await page.getByTestId('plan.lasts.cutAfterMonths').press('Enter');
    const toast = page.getByTestId('plan.lasts.toast');
    await expect(toast).toBeVisible();
    await expect(toast).toContainText('Saved. Cuts of up to 30% after 4 months; no reserve. The test is running again on the saved plan.');
    // one plan written, by the declared keys only; the locked plan byte-identical
    const after = await storedPlans(page);
    const planted = JSON.parse(stored);
    expect(JSON.stringify(after[1])).toBe(JSON.stringify(planted[1]));
    expect(stripped(after[0])).toBe(stripped(planted[0]));
    const S = after[0].stressTool.settings;
    expect(S.consecutiveLimit).toBe(4);
    expect(S.protectionMult).toBe(0.7);
    expect(S.disableProtection).toBe(planted[0].stressTool.settings.disableProtection);
    expect(after[0].decisionTool.settings).toEqual(planted[0].decisionTool.settings);
    expect(after[0].lastModified).not.toBe(planted[0].lastModified);
    await expect(page.getByTestId('plan.lasts.cutPct')).toHaveValue('30');
    await expect(page.locator('[data-saved-for="cutPct"]')).toHaveText('From your plan, saved 30 September 2026 (30)');
    // the test runs again on the saved plan, and its band equals the Node run on the saved text
    const ms2 = await awaitRun(page, t1);
    testInfo.annotations.push({ type: 'lasts-rerun-ms', description: `${ms2} ms at full speed after Save` });
    const again = await bandFigures(page, 'plan.lasts.result');
    expect(again).toEqual(nodeFigures(lastsInNode(after[0], TODAY)));
    expect(again).not.toEqual(before);
    await expect(band).toContainText('Run with the spending cuts you set: up to 30% after 4 months in a row below the plan’s line.');
    const keys = await page.evaluate(() => ({ session: Object.keys(sessionStorage), local: Object.keys(localStorage) }));
    for (const k of [...keys.session, ...keys.local]) expect(OWN_KEYS.has(k) || k === GUEST_KEY, `a key the preview must not write: ${k}`).toBe(true);

    // Undo: the plan as planted, byte for byte, stamp included; the band is the first one again
    await page.getByTestId('plan.lasts.undo').click();
    await expect(page.getByTestId('plan.lasts.toast')).toContainText('Put back as it was.');
    const undone = await storedPlans(page);
    expect(JSON.stringify(undone[0])).toBe(JSON.stringify(planted[0]));
    await awaitRun(page, Date.now());
    expect(await bandFigures(page, 'plan.lasts.result')).toEqual(before);

    // the plan page: "Does it last?" links here; the next sentence too, with no hand-over to the planner's run
    await page.goto(v7('#/plan/LastsPlan01/plan'));
    await expect(page.getByTestId('plan.step.plan')).toBeVisible();
    await expect(page.getByTestId('plan.plan.lasts')).toHaveAttribute('href', '#/plan/LastsPlan01/lasts');
    await expect(page.getByTestId('rail.next')).toContainText('Next: check it lasts, then lock it when it is right.');
    await expect(page.getByTestId('rail.next.button')).toHaveAttribute('href', '#/plan/LastsPlan01/lasts');
  });

  test('a box left wrong is marked in plain words and nothing is written; Cancel clears the typing; the locked plan shows the document\'s figure and today\'s, and has no box', async ({ page, watch }) => {
    test.setTimeout(180_000);
    watch.allow(/^asked for a file that is not there: \/assets\/data\/(gilts|equity)\.json$/);
    const plan = draftPlan();
    const locked = lockedPlan();
    const stored = await plant(page, [plan, locked]);
    await page.goto(v7('#/plan/LastsPlan01/lasts'));
    await expect(page.getByTestId('plan.step.lasts')).toBeVisible();
    await page.getByTestId('plan.lasts.cutPct').fill('120');
    await page.getByTestId('plan.lasts.save').click();
    await expect(page.locator('[data-error-for="plan.lasts.cutPct"]')).toHaveText('Up to 95%, please.');
    await expect(page.getByTestId('plan.lasts.problem')).toHaveText('Have a look at the boxes marked above.');
    await expect(page.getByTestId('plan.lasts.cutPct')).toBeFocused();
    expect(await page.evaluate((k) => sessionStorage.getItem(k), GUEST_KEY)).toBe(stored);
    await page.getByTestId('plan.lasts.cancel').click();
    await expect(page.getByTestId('plan.lasts.cutPct')).toHaveValue('20');
    expect(await page.evaluate(() => sessionStorage.getItem('pt_v7_draft'))).toBe(null);
    // the locked plan: the document's figure, today's test on the same plan, figures only
    await page.goto(v7('#/plan/LastsLocked02/lasts'));
    await expect(page.getByTestId('plan.step.lasts')).toBeVisible();
    await awaitRun(page, Date.now());
    expect(await page.locator('#app input, #app select, #app textarea').count()).toBe(0);
    await expect(page.getByTestId('plan.lasts.fixed')).toHaveText('Fixed when you locked the plan on 1 July 2026.');
    await expect(page.getByTestId('plan.lasts.documentLine')).toHaveText('Worked out when the plan was locked on 1 July 2026.');
    const doc = await bandFigures(page, 'plan.lasts.document');
    const today = await bandFigures(page, 'plan.lasts.result');
    const node = lastsInNode(locked, TODAY);
    expect(today).toEqual(nodeFigures(node));
    expect(doc.chance).toBe(node.stored.a.chancePct);
    expect(doc.chance).toBe(100);
    // a locked gilt ladder is the document's own: today's test is the same, so no "earlier test" line
    expect(node.stored.note).toBe('');
    await expect(page.getByTestId('plan.lasts.earlierTest')).toHaveCount(0);
    await expect(page.getByTestId('plan.lasts.result')).toContainText('Every year is bought by contract');
    expect(await page.evaluate((k) => sessionStorage.getItem(k), GUEST_KEY)).toBe(stored);
  });
});
