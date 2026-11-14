/**
 * J15 (7.9.0): "Try the bad years" and "I accept this risk" for a row, signed in, at desktop-1440 and phone-390, against the
 * local emulators. Fictional plans of the corpus, held by the made-up Alex and Sam:
 *   - Alex's locked plan (buckets in order, corpus 04) keeps a made-up share by choice and has agreed its keep test (J11's
 *     way): accepting the fall row is ONE write of the list (settings, plan document and what is held byte-identical), and
 *     withdrawing the keep agreement leaves the row's entry byte for byte;
 *   - opening the panel and pressing it, then C's answer and its strip, then a reload: nothing written;
 *   - accepted in the classic planner, seen in the new app; accepted in the new app, seen and withdrawn in the classic planner;
 *     withdrawn in the new app;
 *   - Sam's unlocked plan (corpus 02): a row accepted is one write of the list only; a setting changed in the classic planner
 *     makes it out of date in the new app, and the home shows no new to-do.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test, expect, REPO, FIXED_NOW, atClassic, WORKER_DATA_MISSING } from '../helpers/app.js';
import { clearEmulators, makeAccount, putPlan, putSettings, plansOf, ALEX, SAM } from './emulator.js';
import { openAt, signIn, answer } from './journeys.js';
import { VERSION } from '../../src/constants.js';

const S = 'plan.lasts.stress';
const K = 'plan.hold.keepTest';
const sortKeys = (v) => (Array.isArray(v) ? v.map(sortKeys) : v && typeof v === 'object' ? Object.keys(v).sort().reduce((o, k) => { if (v[k] !== undefined) o[k] = sortKeys(v[k]); return o; }, {}) : v);
const same = (a, b) => JSON.stringify(sortKeys(a)) === JSON.stringify(sortKeys(b));
const fixture = (name) => JSON.parse(readFileSync(join(REPO, 'tests', 'fixtures', 'plans', name), 'utf8'));
/** A plan as stored, less what an agreement writes (the list and the stamp). */
const rest = (p) => { const o = JSON.parse(JSON.stringify(p)); delete o.planAmendments; delete o.lastModified; return sortKeys(o); };
const listOf = async (uid, id) => { const p = (await plansOf(uid)).find((x) => x.id === id); return (p && p.planAmendments) || []; };

function lockedKeeps(id) {
  const p = fixture('04-buckets-running.json');
  delete p.household;
  p.holdings.lines.push({ asOf: '2026-09-01', contribution: null, kind: null, name: 'Example Shares plc', ocf: null, sedol: null, subClass: null, ticker: 'EXMPL', units: 100, value: 15000, wrapper: 'SIPP', keep: { as: 'mine', fundsGaps: true } });
  return { ...p, id, planDetails: { ...p.planDetails, name: 'Alex’s plan' }, isActive: true };
}
function unlocked(id, name) {
  const p = fixture('02-pnv-draft.json');
  delete p.household;
  return { ...p, id, planDetails: { ...p.planDetails, name }, isActive: true };
}
async function account(page, who, plans) {
  const { uid } = await makeAccount(who);
  for (const p of plans) await putPlan(uid, p);
  await putSettings(uid, { lastSeenVersion: VERSION });
  await page.clock.setFixedTime(new Date(FIXED_NOW));
  await openAt(page, '#/account');
  await signIn(page, who);
  return uid;
}
/** On the plan's "Does it last?", the panel pressed and every row tried. */
async function tryRows(page, id) {
  await openAt(page, '#/plan/' + id + '/lasts?focus=stress');
  await expect(page.getByTestId(S)).toHaveAttribute('data-status', 'idle', { timeout: 60_000 });
  await page.getByTestId(`${S}.run`).click();
  await expect(page.getByTestId(S)).toHaveAttribute('data-status', 'done', { timeout: 240_000 });
}
async function acceptRow(page, row) {
  await page.getByTestId(`${S}.${row}.accept`).click();
  await page.getByTestId(`${S}.${row}.confirm.yes`).click();
  await expect(page.getByTestId(`${S}.${row}.accepted`)).toHaveAttribute('data-status', 'agreed', { timeout: 30_000 });
}
/** The classic planner on this plan's Scenarios page, signed in: "Use the previous version" from its "Does it last?". */
async function classicScenarios(page, id) {
  await openAt(page, '#/plan/' + id + '/lasts?focus=stress');
  await expect(page.getByTestId(S)).toBeVisible({ timeout: 60_000 });
  await page.getByTestId('nav.previous').or(page.getByTestId('nav.previousShort')).filter({ visible: true }).click();
  await page.waitForURL((u) => atClassic(u.href));
  await expect(page.locator('#mainApp')).toBeVisible({ timeout: 45_000 });
  await expect(page.locator('#stress-scenarios')).toBeVisible({ timeout: 45_000 });
  await expect(page.locator('#stressPanel')).toHaveAttribute('data-status', /^(idle|done)$/, { timeout: 45_000 });
}

test.beforeEach(async ({ watch }) => { await clearEmulators(); watch.allow(WORKER_DATA_MISSING); });

test('a locked plan with a keep agreement: the fall row accepted in one write; the keep agreement withdrawn, the row\'s entry untouched', async ({ page }) => {
  test.setTimeout(420_000);
  const ID = 'AlexKeeps15';
  const planted = lockedKeeps(ID);
  const uid = await account(page, ALEX, [planted]);

  await test.step('the keep test agreed on What you hold, as J11 does', async () => {
    await openAt(page, '#/plan/' + ID + '/hold');
    await expect(page.getByTestId(K)).toHaveAttribute('data-status', 'untested', { timeout: 60_000 });
    await page.getByTestId(`${K}.run`).click();
    await expect(page.getByTestId(`${K}.result`)).toBeVisible({ timeout: 120_000 });
    await page.getByTestId(`${K}.accept`).click();
    await page.getByTestId(`${K}.confirm.yes`).click();
    await expect.poll(async () => (await listOf(uid, ID)).length, { timeout: 15_000 }).toBe(1);
  });
  const keepEntry = (await listOf(uid, ID))[0];
  expect(keepEntry.kind).toBe('keep');

  let stressEntry = null;
  await test.step('the fall row: the held rows show the keep agreement as agreed; "I accept this risk" is one write; settings, document and what is held byte-identical', async () => {
    await tryRows(page, ID);
    await expect(page.getByTestId(`${S}.asHeld.keep`)).toHaveAttribute('data-status', 'agreed');
    await expect(page.getByTestId(`${S}.asHeld.accept`)).toHaveCount(0);
    await acceptRow(page, 'fall');
    await expect.poll(async () => (await listOf(uid, ID)).length, { timeout: 15_000 }).toBe(2);
    const [p] = await plansOf(uid);
    expect(same(p.planAmendments[0], keepEntry), 'the keep agreement as it was').toBe(true);
    stressEntry = p.planAmendments[1];
    expect(stressEntry).toMatchObject({ kind: 'stress', test: { id: 'fall' } });
    expect(same(p.stressTool, planted.stressTool), 'the plan\'s settings').toBe(true);
    expect(same(p.decisionTool, planted.decisionTool), 'the lock and the months').toBe(true);
    expect(same(p.planDocument, planted.planDocument), 'the plan document').toBe(true);
    expect(same(p.holdings, planted.holdings), 'what is held').toBe(true);
  });

  await test.step('the keep agreement withdrawn on What you hold: one write; the row\'s entry byte for byte', async () => {
    await openAt(page, '#/plan/' + ID + '/hold');
    await page.getByTestId(`${K}.withdraw`).click();
    await expect.poll(async () => (await listOf(uid, ID)).length, { timeout: 15_000 }).toBe(1);
    const [left] = await listOf(uid, ID);
    expect(JSON.stringify(sortKeys(left))).toBe(JSON.stringify(sortKeys(stressEntry)));
  });
});

test('the panel pressed, then C\'s strip, then a reload: nothing written', async ({ page }) => {
  test.setTimeout(420_000);
  const ID = 'AlexLooks15';
  const uid = await account(page, ALEX, [unlocked(ID, 'Alex’s plan')]);
  const before = await plansOf(uid);
  await tryRows(page, ID);
  await answer(page, 'c');
  await page.getByTestId('c.stress.run').click();
  await expect(page.locator('[data-stress-strip="c"]')).toHaveAttribute('data-status', 'done', { timeout: 120_000 });
  await page.reload();
  await expect(page.locator('#app [data-screen]')).toBeVisible({ timeout: 30_000 });
  const after = await plansOf(uid);
  expect(after.map((p) => JSON.stringify(sortKeys(p)))).toEqual(before.map((p) => JSON.stringify(sortKeys(p))));
});

test('accepted in the classic planner, seen in the new app; accepted in the new app, seen and withdrawn in the classic planner', async ({ page }) => {
  test.setTimeout(480_000);
  const ID = 'AlexBoth15';
  const planted = unlocked(ID, 'Alex’s plan');
  const uid = await account(page, ALEX, [planted]);

  await test.step('the classic planner: the rows on its Scenarios page; "lower returns" accepted, one save', async () => {
    await classicScenarios(page, ID);
    await page.locator('#stressPanelRun').click();
    await expect(page.locator('#stressPanel')).toHaveAttribute('data-status', 'done', { timeout: 240_000 });
    await page.locator('#stressRow-lower-accept').click();
    await page.locator('#stressRow-lower-yes').click();
    await expect(page.locator('#stressRow-lower-accepted')).toHaveAttribute('data-status', 'agreed', { timeout: 30_000 });
    await expect.poll(async () => (await listOf(uid, ID)).map((e) => e.test && e.test.id), { timeout: 15_000 }).toEqual(['lower']);
  });
  // the plan as the classic planner keeps it once opened (it stores its own defaults then): every later write is the list only
  const [opened] = await plansOf(uid);

  await test.step('the new app: the agreement before anything is tried; then "a tenth more" accepted', async () => {
    await openAt(page, '#/plan/' + ID + '/lasts?focus=stress');
    await expect(page.getByTestId(`${S}.agreement.lower.line`)).toHaveAttribute('data-status', 'agreed', { timeout: 60_000 });
    await page.getByTestId(`${S}.run`).click();
    await expect(page.getByTestId(S)).toHaveAttribute('data-status', 'done', { timeout: 240_000 });
    await acceptRow(page, 'spend');
    await expect.poll(async () => (await listOf(uid, ID)).map((e) => e.test && e.test.id), { timeout: 15_000 }).toEqual(['lower', 'spend']);
  });

  await test.step('the classic planner: both agreements before anything is tried; "a tenth more" withdrawn there', async () => {
    await classicScenarios(page, ID);
    await expect(page.locator('#stressAgreement-lower')).toBeVisible();
    await expect(page.locator('#stressAgreement-spend-line')).toHaveAttribute('data-status', 'agreed');
    await page.locator('#stressAgreement-spend-withdraw').click();
    await expect.poll(async () => (await listOf(uid, ID)).map((e) => e.test && e.test.id), { timeout: 15_000 }).toEqual(['lower']);
  });

  await test.step('the new app: "lower returns" withdrawn; nothing else written since the first agreement', async () => {
    await openAt(page, '#/plan/' + ID + '/lasts?focus=stress');
    await page.getByTestId(`${S}.agreement.lower.withdraw`).click();
    await expect.poll(async () => (await listOf(uid, ID)).length, { timeout: 15_000 }).toBe(0);
    const [p] = await plansOf(uid);
    expect(JSON.stringify(rest(p))).toBe(JSON.stringify(rest(opened)));
    expect(same(p.planDocument, planted.planDocument) && same(p.holdings, planted.holdings), 'no document, what is held as planted').toBe(true);
  });
});

test('an unlocked plan: a row accepted is one write of the list only; a setting changed in the classic planner makes it out of date, and no new to-do', async ({ page }) => {
  test.setTimeout(420_000);
  const ID = 'SamDraft15';
  const planted = unlocked(ID, 'Sam’s plan');
  const uid = await account(page, SAM, [planted]);
  await tryRows(page, ID);
  await acceptRow(page, 'fall');
  await expect.poll(async () => (await listOf(uid, ID)).length, { timeout: 15_000 }).toBe(1);
  const [p] = await plansOf(uid);
  expect(JSON.stringify(rest(p)), 'only the list of agreements and the stamp written').toBe(JSON.stringify(rest(planted)));
  await openAt(page, '#/plan/' + ID);
  await expect(page.locator('#app [data-screen]')).toHaveAttribute('data-screen', /^plan/, { timeout: 30_000 });
  const todos = await page.locator('[data-todo]').evaluateAll((els) => els.map((e) => e.getAttribute('data-todo')).sort());

  await test.step('the classic planner: a setting changed and saved', async () => {
    await classicScenarios(page, ID);
    await page.locator('.sub-tab[data-stresstab="stresssettings"]').click();
    // the form filled from the plan first (it loads after the press, and would put the box back), then one figure changed
    await expect(page.locator('#ssDuration')).toHaveValue(String(planted.stressTool.settings.duration), { timeout: 30_000 });
    const box = page.locator('#ssChargesPct');
    const saved = async () => { const [x] = await plansOf(uid); return x.stressTool.settings.chargesPct; };
    // typed and saved again until the saved figure is the one typed (no fixed wait: the form's own load may come after)
    await expect(async () => {
      await box.fill('0.6');
      await page.locator('#ssSaveBtn').click();
      await expect.poll(saved, { timeout: 5_000 }).toBe(0.6);
    }).toPass({ timeout: 45_000 });
  });

  await test.step('the new app: the row\'s agreement says it is out of date; the home shows no new to-do', async () => {
    await openAt(page, '#/plan/' + ID + '/lasts?focus=stress');
    await expect(page.getByTestId(`${S}.agreement.fall.line`)).toHaveAttribute('data-status', 'stale', { timeout: 60_000 });
    await expect(page.getByTestId(`${S}.agreement.fall.line`)).toContainText('The plan’s figures have changed since, so it no longer stands.');
    await openAt(page, '#/plan/' + ID);
    await expect(page.locator('#app [data-screen]')).toHaveAttribute('data-screen', /^plan/, { timeout: 30_000 });
    const now = await page.locator('[data-todo]').evaluateAll((els) => els.map((e) => e.getAttribute('data-todo')).sort());
    expect(now.filter((t) => !todos.includes(t))).toEqual([]);
  });
});
