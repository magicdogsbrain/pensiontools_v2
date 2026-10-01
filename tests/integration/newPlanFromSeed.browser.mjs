/**
 * Browser walk of today's app receiving a plan seed (research/v7/save-as-plan.md C.2) — WITHOUT AN ACCOUNT ONLY.
 * Nothing here signs in, types a credential or reaches Firebase: every request that leaves the local server is
 * stopped, as e2e/old-app-unchanged.spec.js does.
 *
 *   npx vite build --outDir <scratch>/prod --emptyOutDir          (never into docs/)
 *   node tests/integration/newPlanFromSeed.browser.mjs <scratch>/prod [--shots <folder>]
 *
 * It is a plain Node script (Playwright's library, the repo's own static server with the real headers) rather than an
 * e2e/*.spec.js, so it runs on the current app's build alone and does not wait on V7's builds. Exit code 0 = all good.
 *
 * Walks:
 *  1. A seed waiting, a locked plan already in the tab: open /#new-plan → "carry on without an account" → the confirm
 *     step shows the name and the line about the planner's own test → Save → the planner opens on the NEW plan at
 *     Stress tester → Settings with the one-line note; the seed is gone; the address carries no figure; the locked plan
 *     is unchanged but for isActive.
 *  2. A second save in the same tab: a second plan, named " (2)".
 *  3. A couple: two more plans, linked.
 *  4. "Not now": the seed is deleted and nothing is made.
 *  5. A day-old seed: deleted at start, and the "nothing waiting" line is shown.
 *  6. No console error, no page error, no request outside the site that was not stopped.
 * Added by the review of 1 Oct 2026:
 *  - the receipt the planner leaves in the tab for V7: 'made' with the final name, 'declined' on "Not now";
 *  - the plan's own words: why its tests differ (and the quick answer's own figure), the pots at retirement the
 *    strategies are priced on and every run starts from, the Budget page's total as a GUIDE beside the target chosen
 *    (never "what your plan funds"), the chart's marker "your budget (a guide)", a couple's line;
 *  - "Just try it" after a reload carries on with the tab's plans (they were deleted), the partner link intact;
 *  - two windows holding one seed make ONE plan; the second says so;
 *  - a browser that blocks site data still gets today's app (it was a blank page);
 *  - with V7's build beside it (<dist>/v7): the whole way, V7 → the planner → "Not now" → Back: "Not saved…"
 *    (it said "Saved as"); then Save → the plan → Back: "Saved as …".
 */
import { chromium } from '@playwright/test';
import { mkdirSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { startServer } from '../../e2e/helpers/serve.mjs';
import { seedA, seedBCouple } from './fixtures/planSeeds.js';

const args = process.argv.slice(2);
const DIST = resolve(args[0] || process.env.SEED_E2E_DIST || 'dist/prod');
const shotsAt = args.indexOf('--shots');
const SHOTS = shotsAt >= 0 ? resolve(args[shotsAt + 1]) : null;
const PORT = Number(process.env.SEED_E2E_PORT || 4391);
const BASE = `http://127.0.0.1:${PORT}`;
const SEED_KEY = 'pt_v7_plan_seed';
const GUEST_KEY = 'pt_guest_scenarios';
const RECEIPT_KEY = 'pt_v7_plan_receipt';
const receipt = (page, createdAt) => page.evaluate(([k, c]) => { const all = JSON.parse(sessionStorage.getItem(k) || 'null'); return all ? all[c] || null : null; }, [RECEIPT_KEY, createdAt]);
const textOf = async (page, sel) => ((await page.locator(sel).first().textContent()) || '').replace(/\s+/g, ' ').trim();

const LOCKED = {
  id: 'guest-locked', schemaVersion: 1, planDetails: { name: 'My real plan', description: '' }, enabledTools: ['stress', 'decision'], isActive: true,
  strategy: { id: 'pots-and-valves', params: {}, lockedAt: '2026-09-12T10:00:00.000Z', engineVersion: '6.17.0' },
  decisionTool: { settings: { locked: true, lockedAt: '2026-09-12T10:00:00.000Z', duration: 30 }, history: [{ date: '2026-09', settingsChecksum: 'abc' }], taxYears: {} },
  stressTool: { settings: { currentAge: 61, currentAgeAsOf: '2026-09-12', retired: true, firstTaxYear: 2026, configured: true, equityMin: 300000, bondMin: 200000, cashTarget: 50000 } },
  planDocument: { version: 1 }, createdAt: '2026-01-01T00:00:00.000Z', lastModified: '2026-09-12T10:00:00.000Z'
};

const failures = [];
const check = (ok, what) => { if (!ok) failures.push(what); console.log((ok ? '  ok   ' : '  FAIL ') + what); };
const localDay = (d) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
/** A fixture seed dated now (as V7 writes it the moment Keep is pressed). */
const fresh = (seed, minutesAgo = 0) => ({ ...seed, createdAt: new Date(Date.now() - minutesAgo * 60000).toISOString(), today: localDay(new Date()) });
const without = (o, k) => { const c = { ...o }; delete c[k]; return JSON.stringify(c); };

async function plant(page, { seed = null, guestPlans = undefined } = {}) {
  await page.goto(BASE + '/privacy.html');   // the same origin, without starting the app
  await page.evaluate(([k, v, gk, g]) => { if (v) localStorage.setItem(k, v); if (g !== undefined) sessionStorage.setItem(gk, g); }, [SEED_KEY, seed ? JSON.stringify(seed) : null, GUEST_KEY, guestPlans === undefined ? undefined : JSON.stringify(guestPlans)]);
}
const store = (page) => page.evaluate(([k, gk]) => ({ seed: localStorage.getItem(k), plans: JSON.parse(sessionStorage.getItem(gk) || '[]'), url: location.href }), [SEED_KEY, GUEST_KEY]);
const shot = async (page, name) => { if (SHOTS) await page.screenshot({ path: join(SHOTS, name + '.png'), fullPage: false }); };

/** Open /#new-plan, choose to carry on without an account, and answer the confirm step. */
async function openAndConfirm(page, { name = null, save = true } = {}) {
  await page.goto(BASE + '/#new-plan');
  const carryOn = page.getByRole('button', { name: 'Carry on without an account' });
  await carryOn.waitFor({ timeout: 20000 });
  await shot(page, 'offer-' + (name || 'default'));
  await carryOn.click();
  const saveBtn = page.getByRole('button', { name: 'Save as a new plan' });
  await saveBtn.waitFor({ timeout: 20000 });
  const dialog = saveBtn.locator('xpath=../..');            // the app's own prompt: <p> words, the name box, the two buttons
  const box = dialog.locator('input');
  const prompt = await dialog.locator('p').innerText();
  const value = await box.inputValue();
  await shot(page, 'confirm-' + (name || 'default'));
  if (name != null) await box.fill(name);
  if (save) await saveBtn.click(); else await page.getByRole('button', { name: 'Not now' }).click();
  return { prompt, value };
}

const server = startServer(DIST, PORT);
const browser = await chromium.launch();
const problems = [];
try {
  if (SHOTS) mkdirSync(SHOTS, { recursive: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  // Firebase and anything else outside the local site: stopped, so no account, no network, no real data.
  await context.route((url) => /^https?:$/.test(url.protocol) && !url.href.startsWith(BASE), (route) => route.abort());
  const page = await context.newPage();
  page.on('pageerror', (e) => problems.push('page error: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource|net::ERR_FAILED|ERR_FAILED/.test(m.text())) problems.push('console error: ' + m.text()); });

  // ---- 1. the first save, beside a locked plan ----------------------------------------------------------------------
  console.log('1. a seed waiting, a locked plan in the tab');
  const a = fresh(seedA());
  await plant(page, { seed: a, guestPlans: [LOCKED] });
  const first = await openAndConfirm(page);
  check(first.value === a.name.chosen, 'the name box holds the chosen name: ' + first.value);
  check(/A new plan from your quick answer: Stop at 60, £1,800 a month, paying in £800 a month, a pension of about £341,000 then\./.test(first.prompt), 'the confirm step says what is in the plan, money going in too');
  check(/so its tests can differ from the quick answer, where the money lasted to 95 in 9 futures out of 10 \(93%\)\./.test(first.prompt), 'the confirm step says why the planner\'s own test differs, with the quick answer\'s own figure');
  await page.locator('#seedNote').waitFor({ state: 'visible', timeout: 30000 });
  await shot(page, 'planner-after-save');
  const note = await page.locator('#seedNote').innerText();
  check(note.startsWith('Made from your quick answer: saved as ‘Stop at 60 · £1,800 a month’.'), 'the planner opens with the one-line note: ' + note);
  check((await page.locator('#seedNoteBack').getAttribute('href')) === 'v7/#/a/answer', 'the note links back to the question, with no figure');
  check(await page.locator('#mainApp').isVisible(), 'the planner is open');
  check(await page.locator('.sub-tab[data-stresstab="stresssettings"].active').count() === 1, 'on Stress tester → Settings');
  check((await page.locator('#scenarioActiveName').innerText()).trim() === 'Stop at 60 · £1,800 a month', 'the new plan is the open one');
  check(await page.locator('#guestBanner').isVisible(), 'without an account: the banner and the meter are on');
  const s1 = await store(page);
  check(s1.seed === null, 'the seed is gone');
  check(s1.url === BASE + '/', 'the address has no hash and no figure: ' + s1.url);
  check(s1.plans.length === 2, 'two plans in the tab (the locked one and the new one)');
  const locked1 = s1.plans.find((p) => p.id === 'guest-locked');
  check(locked1 && without(locked1, 'isActive') === without(LOCKED, 'isActive'), 'the locked plan is byte-identical except isActive');
  const made1 = s1.plans.find((p) => p.id !== 'guest-locked');
  check(made1 && made1.isActive === true && locked1.isActive === false, 'the new plan is active, the locked one is not');
  check(made1 && made1.schemaVersion === 1 && made1.stressTool.settings.retireAge === 60 && made1.stressTool.settings.potAtRetirement.sipp === 341000, 'the new plan carries the answer\'s figures');
  const ssBase = await page.locator('#ssBaseSalary').inputValue();
  check(+ssBase === made1.stressTool.settings.baseSalary, 'the planner\'s settings show the plan\'s target (' + ssBase + ')');
  check(+(await page.locator('#tmPotSipp').inputValue()) === 341000 && +(await page.locator('#tmAge').inputValue()) === 56, 'the Timing block shows the age today and the middling pot at the stop');
  await page.waitForTimeout(2500);   // let the planner finish loading the plan (any write-back would land by now)
  const after = await store(page);
  check(JSON.stringify(after.plans) === JSON.stringify(s1.plans), 'opening the plan wrote nothing back');
  const r1 = await receipt(page, a.createdAt);
  check(r1 && r1.outcome === 'made' && r1.name === 'Stop at 60 · £1,800 a month', 'the tab holds the receipt V7 reads on coming Back: made, under its name: ' + JSON.stringify(r1));
  check(/so its tests can differ from the quick answer, where the money lasted to 95 in 9 futures out of 10 \(93%\)\./.test(note) && !/a little/.test(note), 'the note says why the planner\'s figures differ, with the quick answer\'s own');
  const projLine = await textOf(page, '#tmProjectionLine');
  check(projLine.startsWith('Every strategy is priced on the pots at retirement in the boxes below: SIPP £341,000 · ISA £23,000'), 'the Timing line names the pots the strategies are priced on: ' + projLine.slice(0, 120));
  await page.locator('.sub-tab[data-stresstab="montecarlo"]').click();
  await page.waitForFunction(() => /at retirement/.test(document.getElementById('mcStartSummary')?.textContent || ''), null, { timeout: 15000 }).catch(() => {});
  const mcLine = await textOf(page, '#mcStartSummary');
  check(/^Starting balances at retirement \(age 60\), as every run uses them: .*\(pension £341,000\) · ISA £23,000\./.test(mcLine), 'Monte Carlo says the runs start from the pots at 60: ' + mcLine.slice(0, 160));
  check(/This plan was made from a quick answer, where the money lasted to 95 in 9 futures out of 10 \(93%\)\./.test(mcLine), 'and gives the quick answer\'s own figure beside its own');
  await shot(page, 'planner-monte-carlo-start');
  await page.locator('.tab[data-tab="budget"]').click();
  await page.waitForFunction(() => /a guide/.test(document.getElementById('budSummary')?.textContent || ''), null, { timeout: 15000 }).catch(() => {});
  const bud1 = await textOf(page, '#budSummary');
  check(/a guide; this plan’s target is £1,800\/mo/.test(bud1), 'the Budget page: the total is a guide beside the target chosen: ' + bud1.slice(0, 200));
  check(/Plan target: £1,800\/mo take-home \(≈ £[\d,]+\/yr before tax\) — the figure you chose/.test(bud1), 'the Budget page names the plan\'s real target');
  check(!/what your plan funds|becomes the target/.test(bud1), 'never "what your plan funds" or "becomes the target"');
  await shot(page, 'planner-budget-guide');
  await page.locator('.tab[data-tab="stress"]').click();

  // ---- 2. a second save in the same tab -----------------------------------------------------------------------------
  console.log('2. a second save, same tab');
  await plant(page, { seed: fresh(seedA()) });
  await openAndConfirm(page, { name: 'Stop at 60 · £1,800 a month' });
  await page.locator('#seedNote').waitFor({ state: 'visible', timeout: 30000 });
  const s2 = await store(page);
  check(s2.plans.length === 3, 'three plans now: two saves give two plans');
  check(s2.plans.some((p) => p.planDetails.name === 'Stop at 60 · £1,800 a month (2)' && p.isActive), 'the second is named " (2)" and open');
  check(s2.seed === null, 'the seed is gone');

  // ---- 3. a couple ---------------------------------------------------------------------------------------------------
  console.log('3. a couple');
  await plant(page, { seed: fresh(seedBCouple()) });
  await openAndConfirm(page, { name: 'Us at 60 and 58' });
  await page.locator('#seedNote').waitFor({ state: 'visible', timeout: 30000 });
  const s3 = await store(page);
  const us = s3.plans.find((p) => p.planDetails.name === 'Us at 60 and 58');
  const them = s3.plans.find((p) => p.planDetails.name === 'Us at 60 and 58 · partner');
  check(s3.plans.length === 5 && us && them, 'two more plans: yours and your partner\'s');
  check(us && them && us.household.partnerScenarioId === them.id && us.isActive && !them.isActive, 'yours is open and linked to the partner\'s');
  const note3 = await page.locator('#seedNote').innerText();
  check(/and ‘Us at 60 and 58 · partner’ for your partner/.test(note3), 'the note names both');
  check(/This plan holds your part of the £3,500 a month \(£2,000 from 60, £2,100 from 67\); your partner's part is in ‘Us at 60 and 58 · partner’\. Savings are split evenly between you\./.test(note3), 'the note says whose part this plan holds, and where the rest is');
  check(/This plan holds your part/.test(us && us.planDetails.description) && /This plan holds your partner's part/.test(them && them.planDetails.description), 'so do the two plans\' descriptions');
  await page.waitForFunction(() => /your budget \(a guide\)/.test(document.body.innerHTML), null, { timeout: 15000 }).catch(() => {});
  check(/your budget \(a guide\) £\d+k/.test(await page.content()), 'the income-shape chart marks the budget as a guide');
  check(!/today's budget £\d+k/.test(await page.content()), 'not "today\'s budget"');
  await shot(page, 'planner-couple-shape');
  await page.locator('.tab[data-tab="budget"]').click();
  await page.waitForFunction(() => /a guide/.test(document.getElementById('budSummary')?.textContent || ''), null, { timeout: 15000 }).catch(() => {});
  const bud3 = await textOf(page, '#budSummary');
  check(/Your share of the budget adds up to/.test(bud3) && /this plan’s target \(your part\) is £2,000\/mo/.test(bud3), 'a couple\'s Budget page: your share is a guide beside your part of the target: ' + bud3.slice(0, 160));
  await page.locator('.tab[data-tab="stress"]').click();

  // ---- 4. "Not now" ----------------------------------------------------------------------------------------------------
  console.log('4. "Not now"');
  const declined = fresh(seedA());
  await plant(page, { seed: declined });
  await openAndConfirm(page, { save: false });
  await page.locator('#mainApp').waitFor({ state: 'visible', timeout: 30000 });
  const s4 = await store(page);
  check(s4.seed === null, '"Not now" deletes the seed');
  check(s4.plans.length === 5, 'and makes nothing');
  check(!(await page.locator('#seedNote').isVisible()), 'no note');
  const r4 = await receipt(page, declined.createdAt);
  check(r4 && r4.outcome === 'declined' && !('name' in r4), 'and leaves V7 the word "declined" — never "made": ' + JSON.stringify(r4));

  // ---- 5. a day-old seed -------------------------------------------------------------------------------------------
  console.log('5. a seed more than a day old');
  await plant(page, { seed: fresh(seedA(), 24 * 60 + 1) });
  await page.goto(BASE + '/#new-plan');
  const toast = page.locator('.toast-notification', { hasText: 'There was nothing waiting to be saved.' });
  await toast.waitFor({ timeout: 20000 });
  check(true, 'the "nothing waiting" line is shown');
  const s5 = await store(page);
  check(s5.seed === null, 'the old seed was deleted at start');
  check(s5.url === BASE + '/', 'and the hash cleared');
  check(await page.getByRole('button', { name: 'Carry on without an account' }).count() === 0, 'nothing is offered');

  // ---- 6. choosing to sign in: the sign-in screen, and the seed waits (nothing is typed) -----------------------------
  console.log('6. "Sign in or make an account"');
  await plant(page, { seed: fresh(seedA()) });
  await page.goto(BASE + '/#new-plan');
  await page.getByRole('button', { name: 'Sign in or make an account' }).click({ timeout: 20000 });
  await page.locator('#signinForm').waitFor({ state: 'visible', timeout: 20000 });
  await shot(page, 'sign-in-screen');
  check(true, 'the sign-in screen is shown');
  const s6 = await store(page);
  check(s6.seed !== null, 'the figures wait for the sign-in (for their day)');
  check(s6.url === BASE + '/', 'the address has no hash and no figure');

  // ---- 8. "Just try it" after a reload: the tab's plans carry on (they were deleted) -----------------------------------
  console.log('8. a reload of /, then "Just try it": the tab\'s plans carry on');
  const before8 = await store(page);
  await page.goto(BASE + '/');
  const tryBtn = page.locator('#landingTryGuest');
  await tryBtn.waitFor({ state: 'visible', timeout: 20000 });
  const tryText = ((await tryBtn.textContent()) || '').trim();
  check(tryText === 'Carry on with the plans in this tab — no account', 'the landing button says it carries on with the tab\'s plans: ' + tryText);
  await shot(page, 'landing-tab-holds-plans');
  await tryBtn.click();
  await page.locator('#mainApp').waitFor({ state: 'visible', timeout: 30000 });
  const s8 = await store(page);
  check(s8.plans.length === before8.plans.length && before8.plans.length >= 5, 'every plan in the tab is still there: ' + before8.plans.length + ' → ' + s8.plans.length);
  const us8 = s8.plans.find((p) => p.planDetails.name === 'Us at 60 and 58');
  check(us8 && s8.plans.some((p) => p.id === us8.household.partnerScenarioId), 'and the couple\'s link still finds the partner\'s plan');
  check(!s8.plans.some((p) => p.planDetails.name === 'r/FiredUK — £1M, £40k rising'), 'no demo plan pushed in');
  check(await page.locator('#guestBanner').isVisible(), 'the banner and the meter are on');

  // ---- 9. two windows, one seed: ONE plan ------------------------------------------------------------------------------
  console.log('9. two windows holding the same seed');
  const one = fresh(seedA());
  await plant(page, { seed: one });
  await page.goto(BASE + '/#new-plan');
  await page.getByRole('button', { name: 'Carry on without an account' }).click({ timeout: 20000 });
  await page.getByRole('button', { name: 'Save as a new plan' }).waitFor({ timeout: 20000 });   // window 1: the box open
  const page2 = await context.newPage();                                                       // window 2: a new tab, the same browser
  page2.on('pageerror', (e) => problems.push('page error (window 2): ' + e.message));
  await page2.goto(BASE + '/#new-plan');
  await page2.getByRole('button', { name: 'Carry on without an account' }).click({ timeout: 20000 });
  const box2 = page2.getByRole('button', { name: 'Save as a new plan' });
  await box2.waitFor({ timeout: 20000 });
  await box2.locator('xpath=../..').locator('input').fill('Two windows');
  await box2.click();
  await page2.locator('#seedNote').waitFor({ state: 'visible', timeout: 30000 });
  const before9 = await store(page);
  await page.getByRole('button', { name: 'Save as a new plan' }).click();                      // window 1 saves too, later
  const warned9 = page.locator('.toast-notification', { hasText: 'These figures were used or replaced in another window' });
  await warned9.waitFor({ timeout: 20000 }).catch(() => {});
  check(await warned9.count() > 0, 'window 1 is told the figures were used in another window');
  await page.locator('#mainApp').waitFor({ state: 'visible', timeout: 30000 });
  const s9 = await store(page), t9 = await store(page2);
  check(s9.plans.length === before9.plans.length && !s9.plans.some((p) => p.planDetails.name.startsWith('Two windows')), 'window 1 made nothing');
  check(t9.plans.filter((p) => p.planDetails.name.startsWith('Two windows')).length === 1, 'window 2 made the one plan');
  check(((await receipt(page, one.createdAt)) || {}).outcome === 'refused' && ((await receipt(page2, one.createdAt)) || {}).outcome === 'made', 'each window has its own word for V7');
  await page2.close();

  // ---- 7. Sign Out deletes a waiting seed ------------------------------------------------------------------------------
  console.log('7. Sign Out');
  await plant(page, { seed: fresh(seedA()) });
  await openAndConfirm(page, { save: false });                 // into the app without an account, nothing made
  await page.locator('#mainApp').waitFor({ state: 'visible', timeout: 30000 });
  await page.evaluate(([k, v]) => localStorage.setItem(k, v), [SEED_KEY, JSON.stringify(fresh(seedA()))]);   // a seed written meanwhile
  await Promise.all([page.waitForNavigation({ timeout: 20000 }), page.locator('#logoutBtn').click()]);
  check((await store(page)).seed === null, 'signing out deletes it');

  // ---- 10. a browser that blocks site data: today's app still starts -------------------------------------------------
  console.log('10. site data blocked');
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    await ctx.route((url) => /^https?:$/.test(url.protocol) && !url.href.startsWith(BASE), (route) => route.abort());
    await ctx.addInitScript(() => {
      const deny = () => { throw new DOMException('Access is denied for this document.', 'SecurityError'); };
      for (const k of ['localStorage', 'sessionStorage', 'indexedDB']) Object.defineProperty(window, k, { get: deny, configurable: true });
    });
    const b = await ctx.newPage();
    const errs = [];
    b.on('pageerror', (e) => errs.push(e.message));
    for (const address of ['/', '/#new-plan']) {
      await b.goto(BASE + address);
      await b.locator('#landingTryGuest').waitFor({ state: 'visible', timeout: 20000 }).catch(() => {});
      check(await b.locator('#landingTryGuest').isVisible(), address + ': the landing page is drawn');
      check(await b.evaluate(() => !!document.getElementById('signinForm') && typeof window.startGuest === 'function'), address + ': the sign-in form and the rest of the page\'s script are there');
    }
    await shot(b, 'blocked-storage-landing');
    await b.locator('#landingTryGuest').click();
    await b.locator('#mainApp').waitFor({ state: 'visible', timeout: 30000 }).catch(() => {});
    check(await b.locator('#mainApp').isVisible(), 'without an account, the planner opens');
    check(!errs.some((m) => /Access is denied/.test(m)), 'no page error from the blocked storage: ' + errs.join(' | ').slice(0, 200));
    await ctx.close();
  }

  // ---- 11. the whole way, with V7's own build: Save → "Not now" → Back; Save → made → Back -------------------------
  if (existsSync(join(DIST, 'v7', 'index.html'))) {
    console.log('11. V7 → the planner → "Not now" → Back; then Save → made → Back');
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    await ctx.route((url) => /^https?:$/.test(url.protocol) && !url.href.startsWith(BASE), (route) => route.abort());
    const v = await ctx.newPage();
    const seen = [];
    v.on('framenavigated', (f) => { if (f === v.mainFrame()) seen.push(f.url()); });
    v.on('request', (r) => seen.push(r.url()));
    v.on('pageerror', (e) => problems.push('page error (V7 walk): ' + e.message));
    await v.goto(BASE + '/v7/#/c/numbers');
    await v.getByTestId('c.you.pot').fill('250000');
    await v.getByTestId('c.you.age').fill('58');
    await v.getByTestId('c.action.show').click();
    const final = () => v.waitForSelector('#app[data-answer="final"][data-ready="1"]', { timeout: 120000 });
    await final();
    const name1 = await v.getByTestId('c.keep.name').inputValue();
    check(/^From 58 · £[\d,]+ a month$/.test(name1), 'V7 suggests the name: ' + name1);
    await v.getByTestId('c.action.save').click();
    await v.getByRole('button', { name: 'Carry on without an account' }).click({ timeout: 30000 });
    await v.getByRole('button', { name: 'Not now' }).click({ timeout: 20000 });
    await v.locator('#mainApp').waitFor({ state: 'visible', timeout: 30000 });
    await v.goBack();
    await v.waitForURL(/\/v7\/#\/c\/answer$/, { timeout: 20000 });
    await final();
    const notSaved = v.getByTestId('c.keep.notSaved');
    await notSaved.waitFor({ timeout: 20000 }).catch(() => {});
    const ns = ((await notSaved.textContent().catch(() => '')) || '').trim();
    check(ns === 'Not saved: you chose not to make ‘' + name1 + '’ in the planner. Your figures are still here; save again whenever you like.', 'Back in V7 after "Not now": not saved, said plainly: ' + ns);
    check(await v.getByTestId('c.keep.saved').count() === 0 && !/Saved as/.test(await v.locator('#app').innerText()), 'never "Saved as"');
    check(!/is-done/.test((await v.locator('[data-testid="rail.c.keep"]').first().evaluate((el) => (el.closest('li') || el).className)) || ''), 'and the rail\'s save step is not ticked');
    await shot(v, 'v7-after-not-now');
    await v.getByTestId('c.action.save').click();
    await v.getByRole('button', { name: 'Carry on without an account' }).click({ timeout: 30000 });
    await v.getByRole('button', { name: 'Save as a new plan' }).click({ timeout: 20000 });
    await v.locator('#seedNote').waitFor({ state: 'visible', timeout: 30000 });
    await v.goBack();
    await v.waitForURL(/\/v7\/#\/c\/answer$/, { timeout: 20000 });
    await final();
    const saved = v.getByTestId('c.keep.saved');
    await saved.waitFor({ timeout: 20000 }).catch(() => {});
    const sv = ((await saved.textContent().catch(() => '')) || '').trim();
    check(sv === 'Saved as ‘' + name1 + '’. Try something else and save that too.', 'Back in V7 after the plan was made: "Saved as …": ' + sv);
    check(/is-done/.test((await v.locator('[data-testid="rail.c.keep"]').first().evaluate((el) => (el.closest('li') || el).className)) || ''), 'and the rail\'s save step is ticked');
    await shot(v, 'v7-after-saved');
    // this site's addresses (Firebase's own, outside it, are stopped and carry nothing of the plan)
    const badAddress = [...seen, v.url()].filter((u) => u.startsWith(BASE)).filter((u) => { const x = new URL(u); return x.search !== '' || /\d/.test(x.hash) || /250,?000/.test(decodeURIComponent(x.pathname)); });
    check(badAddress.length === 0, 'no figure in any address: ' + badAddress.slice(0, 3).join(' '));
    await ctx.close();
  } else {
    console.log('11. (skipped: no V7 build at ' + join(DIST, 'v7') + ')');
  }
} catch (e) {
  failures.push('the walk stopped: ' + (e && e.message ? e.message.split('\n')[0] : e));
} finally {
  await browser.close();
  server.close();
}

for (const p of problems) { failures.push(p); console.log('  FAIL ' + p); }
console.log(failures.length ? '\n' + failures.length + ' problem(s)' : '\nall good');
process.exit(failures.length ? 1 : 0);
