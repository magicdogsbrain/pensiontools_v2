/**
 * "Lock the plan", without an account (research/v7/road-to-7.md step 6). The PUBLISHED build, which serves the planner at
 * / and the preview at /v7/ on one site, so this window's plans (sessionStorage pt_guest_scenarios) are seen by both.
 *
 *  A Pots & Valves draft (corpus 02) is planted in the window with a locked gilt ladder (corpus 03). On #/plan/<id>/lock the
 *  screen says what the lock fixes, what stays changeable and what you get; "Lock this plan", then "Lock it" on the same
 *  screen; the plan's own test runs in the V7 worker and ONE write follows: the stored text gains exactly the declared keys
 *  (the Decision tool seeded, the flags, the plan of record, the plan document, the journey) and nothing else changes; the
 *  document, the plan of record and the journey equal the same lock worked out in Node, to the byte; the other plan is
 *  byte-identical. The page lands on "Your plan as locked" with its four sentences and the Undo toast. Then the classic
 *  planner, opened as the guest through the preview's own hand-over, reads the plan as one it locked itself: the lock chip,
 *  the plan document page, and the Stress settings' lock banner naming the preview. Back in the preview, the plan is
 *  unlocked once from "Your plan as locked": the Stress settings are as before the lock but for the two usual starting values
 *  an unlock writes into a plan locked without them (the charge, how the ISA grows — as the planner's own unlock does), the
 *  document is kept as a past version, the flag is off and the unlock counted.
 *
 * Firebase is never reached: every request outside the site is stopped (`outside: 'block'`).
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test, expect, PROD, REPO, FIXED_NOW, SLOWDOWN, record } from './helpers/app.js';
import { lockInNode } from './helpers/lockInNode.js';
import { LOCK_WRITES, UNLOCK_WRITES } from '../src/answers/plan/schema.js';
import { TIMING_PIN_KEYS } from '../src/services/PlanTiming.js';

test.use({ outside: 'block' });

const GUEST_KEY = 'pt_guest_scenarios';
const OWN_KEYS = new Set(['pt_v7_draft', 'pt_lastActivity', 'pt_open_place', 'pt_open_plan', 'pt_guest_minutes', 'pt_guest_nag_level', 'pt_activeScenarioId', 'pt_guest_handoff']);
const v7 = (hash) => PROD + '/v7/' + hash;
const TODAY = FIXED_NOW.slice(0, 10);
/** The slowed budget for the lock: the final answer's (e2e/helpers/app.js FIRST_ANSWER_BUDGET.finalMs). */
const BUDGET_MS = 15_000;

function draftPlan() {
  const plan = JSON.parse(readFileSync(join(REPO, 'tests', 'fixtures', 'plans', '02-pnv-draft.json'), 'utf8'));
  plan.id = 'LockPlan01';
  plan.planDetails.name = 'Alex’s plan';
  plan.isActive = true;
  delete plan.household;
  return plan;
}
function lockedPlan() {
  const plan = JSON.parse(readFileSync(join(REPO, 'tests', 'fixtures', 'plans', '03-gilt-ladder-runup.json'), 'utf8'));
  plan.id = 'LockLocked02';
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
const storedPlans = (page) => page.evaluate((k) => JSON.parse(sessionStorage.getItem(k)), GUEST_KEY);

test.describe('"Lock the plan", without an account', () => {
  test('the lock step, the lock (one write, the declared keys, equal to the Node lock), "Your plan as locked", the planner reads it as locked, the unlock', async ({ page, watch }, testInfo) => {
    test.setTimeout(300_000);
    // as on the live site today: the engine worker asks for the market files beside itself (e2e/old-app-unchanged.spec.js)
    watch.allow(/^asked for a file that is not there: \/assets\/data\/(gilts|equity)\.json$/);
    const plan = draftPlan();
    const locked = lockedPlan();
    const stored = await plant(page, [plan, locked]);
    const planted = JSON.parse(stored);

    // the lock step: the three things in plain words, one button
    await page.goto(v7('#/plan/LockPlan01/lock'));
    await expect(page.locator('#app [data-screen]')).toHaveAttribute('data-screen', 'plan.lock');
    await expect(page.getByTestId('plan.step.lock')).toContainText('Lock the plan');
    const panel = page.locator('[data-region="plan-step"]');
    await expect(panel).toContainText('What the lock fixes');
    await expect(panel).toContainText('the way of drawing (Pots and valves) and its dials;');
    await expect(panel).toContainText('What stays changeable');
    await expect(panel).toContainText('What you get');
    await expect(panel).toContainText('the plan document: the plan as committed');
    await expect(page.getByTestId('plan.lock.confirmBox')).toHaveCount(0);
    const widths = await page.evaluate(() => ({ doc: document.documentElement.scrollWidth, win: window.innerWidth }));
    expect(widths.doc, 'no sideways scroll').toBeLessThanOrEqual(widths.win);
    expect(await page.locator('#app input, #app select, #app textarea').count()).toBe(0);
    const text0 = await page.locator('#app').innerText();
    expect(text0).not.toMatch(/months? to go|years? to go|countdown|plan of record/i);
    expect(text0).not.toMatch(/undefined|NaN|\[object/);

    // "Lock this plan" → the confirm on the same screen → "Lock it": the run in the worker, then one write
    await page.getByTestId('plan.lock.lock').click();
    const confirm = page.getByTestId('plan.lock.confirmBox');
    await expect(confirm).toBeVisible();
    await expect(confirm).toContainText('Lock this plan?');
    await expect(page.getByTestId('plan.lock.lock')).toHaveCount(0);
    const t0 = Date.now();
    await page.getByTestId('plan.lock.confirm').click();
    // the page lands on "Your plan as locked" with the toast
    await page.waitForURL((u) => new URL(u).hash === '#/plan/LockPlan01/plan', { timeout: 60_000 });
    const toast = page.getByTestId('plan.plan.toast');
    await expect(toast).toBeVisible({ timeout: 60_000 });
    const ms = Date.now() - t0;
    await expect(toast).toContainText('Locked 30 September 2026. The plan document is written.');
    record(testInfo, `lock/${testInfo.project.name}.json`, { lockMs: ms, slowdown: SLOWDOWN, lockSlowedMs: ms * SLOWDOWN, budgetMs: BUDGET_MS, method: 'From "Lock it" being pressed to the toast on "Your plan as locked" (the lazy engine chunk loaded, the one test run in the worker, the document built, one write); measured at full speed and multiplied by the slowdown, which stands for a phone four times slower.' });
    testInfo.annotations.push({ type: 'lock-ms', description: `${ms} ms at full speed; × ${SLOWDOWN} = ${Math.round(ms * SLOWDOWN)} ms against ${BUDGET_MS} ms` });
    expect(ms * SLOWDOWN, 'the lock within the slowed budget').toBeLessThanOrEqual(BUDGET_MS);
    await expect(page.getByTestId('plan.step.plan')).toHaveText('Your plan as locked');

    // ONE plan written, by the declared keys only; the locked plan byte-identical; the text otherwise identical
    const after = await storedPlans(page);
    expect(JSON.stringify(after[1])).toBe(JSON.stringify(planted[1]));
    expect(stripped(after[0], LOCK_WRITES)).toBe(stripped(planted[0], LOCK_WRITES));
    const S = after[0];
    expect(S.decisionTool.settings.locked).toBe(true);
    expect(S.decisionTool.settings.lockedBy).toBe('locked in the preview');
    expect(S.decisionTool.settings.lockedAt).toBe(FIXED_NOW);
    expect(S.decisionTool.settings.seededFrom).toBe('stress');
    expect(S.planDocument.version).toBe(3);
    expect(S.planDocument.lockedAt).toBe(FIXED_NOW);
    expect(S.planDocument.planName).toBe('Alex’s plan');
    expect(S.decisionTool.planOfRecord.savedAt).toBe(FIXED_NOW);
    expect(S.journey[S.journey.length - 1].at).toBe(FIXED_NOW);
    expect(S.stressTool.settings).toEqual(planted[0].stressTool.settings);
    expect(S.lastModified).toBe(FIXED_NOW);
    // the document, the plan of record and the journey equal the same lock worked out in Node — every figure to the pound
    // (the browser's and Node's floating point differ in the last digit of a cone's value; the planner's own checks read to the pound)
    const node = lockInNode(planted[0], TODAY, FIXED_NOW);
    expect(node.ok).toBe(true);
    const toThePound = (v) => JSON.stringify(v, (k, x) => (typeof x === 'number' ? Math.round(x) : x));
    expect(toThePound(S.planDocument)).toBe(toThePound(node.patch.planDocument));
    expect(toThePound(S.decisionTool.planOfRecord)).toBe(toThePound(node.patch['decisionTool.planOfRecord']));
    expect(JSON.stringify(S.journey)).toBe(JSON.stringify(node.patch.journey));
    // the parts that carry no engine figure, to the byte
    for (const k of ['timing', 'steps', 'layers', 'assumptions', 'decisionRun', 'pots', 'journey', 'holdingsAtLock', 'targetMix']) expect(JSON.stringify(S.planDocument[k]), k).toBe(JSON.stringify(node.patch.planDocument[k]));
    for (const [k, v] of Object.entries(node.patch)) if (k.startsWith('decisionTool.settings.')) expect(S.decisionTool.settings[k.split('.')[2]], k).toEqual(v);
    const keys = await page.evaluate(() => ({ session: Object.keys(sessionStorage), local: Object.keys(localStorage) }));
    for (const k of [...keys.session, ...keys.local]) expect(OWN_KEYS.has(k) || k === GUEST_KEY, `a key the preview must not write: ${k}`).toBe(true);

    // "Your plan as locked": the four sentences first, the unlock offered once, the new version; the rail has no lock step now
    const step = page.locator('[data-region="plan-step"]');
    await expect(step.locator('[data-line="says.pays"]').first()).toContainText(/From age \d+: £[\d,]+ a year before tax, £[\d,]+ a month after tax/);
    await expect(step.locator('[data-line="says.sp"], [data-line="says.spAssumed"], [data-line="says.noSp"]')).toHaveCount(1);
    await expect(step.locator('[data-line="says.bad"]')).toContainText(/Your plan lasts in .+ out of 10\. Left at the end, at today’s prices: typically £[\d,]+; in a bad case \(the worst 1 in 10\) £[\d,]+/);
    await expect(step.locator('[data-line="says.cuts"]')).toContainText(/Income cuts: in a slump, after \d+ months? in a row below the plan’s line/);
    await expect(page.getByTestId('plan.unlock')).toHaveCount(1);
    await expect(page.getByTestId('plan.plan.unlock')).toHaveText('Unlock this plan');
    await expect(page.getByTestId('plan.plan.newVersion')).toHaveText('Write a new version from today’s settings');
    await expect(page.getByTestId('rail.plan.lock')).toHaveCount(0);
    await expect(page.getByTestId('plan.stageLine')).toContainText('Locked 30 September 2026.');
    await expect(page.locator('.plan-fixed').first()).toContainText('Fixed when you locked the plan on 30 September 2026.');
    // the lock step by its address: locked, with the way back
    await page.goto(v7('#/plan/LockPlan01/lock'));
    await expect(page.getByTestId('plan.step.lock')).toHaveText('This plan is locked');
    await expect(page.getByTestId('plan.lock.seeLocked')).toHaveAttribute('href', '#/plan/LockPlan01/plan');
    await page.goto(v7('#/plan/LockPlan01/plan'));
    await expect(page.getByTestId('plan.step.plan')).toHaveText('Your plan as locked');

    // the classic planner, opened as the guest through the preview's hand-over, reads the plan as one it locked itself
    await page.getByTestId('plan.plan.openDocument').click();
    await page.waitForURL((u) => new URL(u).pathname === '/' || new URL(u).pathname === '/index.html');
    await expect(page.locator('#landingTryGuest')).toBeVisible();
    await page.locator('#landingTryGuest').click();
    await expect(page.locator('#mainApp')).toBeVisible();
    await expect(page.locator('#openPlaceNote')).toContainText('Opened from the preview.');
    await expect(page.locator('#scenarioActiveName')).toHaveText('Alex’s plan');
    await expect(page.locator('#planLockChip')).toContainText('locked', { timeout: 45_000 });
    await expect(page.locator('.sub-tab[data-decisiontab="plandoc"]')).toHaveClass(/active/);
    await expect(page.locator('#planDocumentPage')).toContainText('Alex’s plan', { timeout: 45_000 });
    await expect(page.locator('#planDocumentPage')).not.toContainText('has no plan document yet');
    // the Stress settings page: the lock banner names the preview; the settings are frozen. On a wide screen the tab is in the
    // row of tabs; on a phone the bottom bar's button opens it (a click on the hidden wide tab would wait for ever).
    const wideTab = page.locator('nav.tabs .tab[data-tab="stress"]');
    if (await wideTab.isVisible()) await wideTab.click(); else await page.locator('button[data-on-click="mobileGo(\'stress\')"]').click();
    const settingsTab = page.locator('.sub-tab[data-stresstab="stresssettings"]');
    await expect(settingsTab).toBeVisible({ timeout: 30_000 });
    await settingsTab.click();
    const banner = page.locator('#ssLockBanner');
    await expect(banner).toBeVisible({ timeout: 45_000 });
    await expect(banner).toContainText('This plan is locked');
    await expect(banner).toContainText('locked in the preview');
    await expect(banner).toContainText('the plan document records what you committed to');
    // nothing was written by the planner's reading of it
    const seen = await storedPlans(page);
    expect(JSON.stringify(seen.find((p) => p.id === 'LockPlan01').planDocument)).toBe(JSON.stringify(S.planDocument));
    expect(seen.find((p) => p.id === 'LockPlan01').decisionTool.settings.locked).toBe(true);

    // back in the preview: unlock, once, from "Your plan as locked"
    await page.goto(v7('#/plan/LockPlan01/plan'));
    await expect(page.getByTestId('plan.step.plan')).toHaveText('Your plan as locked');
    await page.getByTestId('plan.plan.unlock').click();
    const uc = page.getByTestId('plan.plan.unlockConfirm');
    await expect(uc).toBeVisible();
    await expect(uc).toContainText('Unlock this plan?');
    await expect(uc).toContainText('The plan document is kept as a past version');
    await page.getByTestId('plan.plan.unlockConfirm.yes').click();
    await expect(page.getByTestId('plan.plan.toast')).toContainText('Unlocked. The plan document is kept as a past version (1 kept).', { timeout: 30_000 });
    await expect(page.getByTestId('plan.step.plan')).toHaveText('Your plan', { timeout: 30_000 });
    const undone = await storedPlans(page);
    const U = undone.find((p) => p.id === 'LockPlan01');
    // the other plan: untouched by the preview; the planner's visit stamped its own schema version on it on load (its usual guest-path upgrade), nothing more
    const sansSchema = (p) => { const { schemaVersion, ...rest } = p; return JSON.stringify(rest); };
    expect(sansSchema(undone.find((p) => p.id === 'LockLocked02'))).toBe(sansSchema(planted[1]));
    // the Stress settings byte-identical to before the lock, but for (a) the planner's own on-load bookkeeping on the plan it
    // opened (the timing pin, LockedPlanGuard.LOCKED_BOOKKEEPING) and (b) the two usual starting values an unlock writes into a
    // plan locked without them (this fixture's text has neither): the charge and how the ISA grows, as the planner's own unlock does
    const UNLOCK_DEFAULTS = ['chargesPct', 'isaGrowth'];
    const sansPin = (s) => { const out = { ...s }; for (const k of [...TIMING_PIN_KEYS, ...UNLOCK_DEFAULTS]) delete out[k]; return JSON.stringify(out); };
    expect(sansPin(U.stressTool.settings)).toBe(sansPin(planted[0].stressTool.settings));
    expect('chargesPct' in planted[0].stressTool.settings).toBe(false);
    expect(U.stressTool.settings.chargesPct).toBe(0.5);
    expect(U.stressTool.settings.isaGrowth).toBe('cash');
    for (const k of Object.keys(U.stressTool.settings)) if (!TIMING_PIN_KEYS.includes(k) && !UNLOCK_DEFAULTS.includes(k)) expect(U.stressTool.settings[k], k).toEqual(planted[0].stressTool.settings[k]);
    expect(U.planDocument).toBe(null);
    expect(U.planDocumentArchive.length).toBe(1);
    expect(U.planDocumentArchive[0].archivedAt).toBe(FIXED_NOW);
    expect(JSON.stringify({ ...U.planDocumentArchive[0], archivedAt: undefined })).toBe(JSON.stringify({ ...S.planDocument, archivedAt: undefined }));
    expect(U.decisionTool.planOfRecord).toBe(null);
    expect(U.decisionTool.planOfRecordArchive.length).toBe(1);
    expect(U.decisionTool.settings.locked).toBe(false);
    expect(U.decisionTool.settings.unlockCount).toBe(1);
    expect(U.decisionTool.settings.unlockedAt).toBe(FIXED_NOW);
    expect(U.decisionTool.settings.lockedBy).toBe('locked in the preview');   // the lock's record stays, as the planner's unlock leaves it
    // everything the unlock does not touch is as it was after the lock (less the planner's on-load bookkeeping: its schema stamp and timing pin)
    const planners = ['schemaVersion', ...TIMING_PIN_KEYS.map((k) => 'stressTool.settings.' + k)];
    expect(stripped(U, [...UNLOCK_WRITES, ...planners])).toBe(stripped(S, [...UNLOCK_WRITES, ...planners]));
    // and the plan is a draft again: the lock step is back on the rail
    await expect(page.getByTestId('rail.plan.lock')).toHaveCount(1);   // on the rail again (a closed sheet on a phone: present, not shown)
    // (the storage keys were checked before the planner's visit; the planner writes its own, such as pt_lastSeenVersion, on load)
    const keys2 = await page.evaluate(() => Object.keys(sessionStorage));
    for (const k of keys2) expect(OWN_KEYS.has(k) || k === GUEST_KEY || !k.startsWith('pt_v7_'), `a key the preview must not write: ${k}`).toBe(true);
  });

  test('"Not now" locks nothing; Undo within the toast\'s time puts the text back byte for byte', async ({ page, watch }) => {
    test.setTimeout(180_000);
    watch.allow(/^asked for a file that is not there: \/assets\/data\/(gilts|equity)\.json$/);
    const plan = draftPlan();
    const locked = lockedPlan();
    const stored = await plant(page, [plan, locked]);
    await page.goto(v7('#/plan/LockPlan01/lock'));
    await expect(page.getByTestId('plan.step.lock')).toContainText('Lock the plan');
    await page.getByTestId('plan.lock.lock').click();
    await expect(page.getByTestId('plan.lock.confirmBox')).toBeVisible();
    await page.getByTestId('plan.lock.notNow').click();
    await expect(page.getByTestId('plan.lock.confirmBox')).toHaveCount(0);
    await expect(page.getByTestId('plan.lock.lock')).toBeVisible();
    expect(await page.evaluate((k) => sessionStorage.getItem(k), GUEST_KEY)).toBe(stored);
    // the lock, then Undo
    await page.getByTestId('plan.lock.lock').click();
    await page.getByTestId('plan.lock.confirm').click();
    const toast = page.getByTestId('plan.plan.toast');
    await expect(toast).toBeVisible({ timeout: 60_000 });
    await expect(toast).toContainText('Locked 30 September 2026.');
    expect((await storedPlans(page))[0].decisionTool.settings.locked).toBe(true);
    await page.getByTestId('plan.plan.undo').click();
    await expect(page.getByTestId('plan.plan.toast')).toContainText('Put back as it was.', { timeout: 30_000 });
    expect(await page.evaluate((k) => sessionStorage.getItem(k), GUEST_KEY)).toBe(stored);
    await expect(page.getByTestId('plan.step.plan')).toHaveText('Your plan', { timeout: 30_000 });
    await expect(page.getByTestId('rail.plan.lock')).toHaveCount(1);   // on the rail again (a closed sheet on a phone: present, not shown)
  });
});
