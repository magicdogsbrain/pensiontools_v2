/**
 * J19: plans chosen from the full view's menu (lead4.md R2). Fictional plans (the parity fixtures: Sam saving, Kim retired
 * with months recorded, a retired draft). Signed in, against the local emulators.
 *   - two quick choices where the second goes back to the plan open before: the plan chosen last is the plan open;
 *   - the History month list holds the plan open now's months only: after a switch to a plan with none recorded it is
 *     empty, as when that plan is opened directly.
 */
import { test, expect } from '../helpers/app.js';
import { clearEmulators, makeAccount, putPlan, putSettings, plansOf, ALEX } from './emulator.js';
import { PARITY_TODAY, fixtureNamed } from '../parity/fixtures/plans.js';
import { waitQuiet } from '../parity/collect.js';
import { openFull, closeNews, signIn } from '../scenarios/routes.js';
import { VERSION } from '../../src/constants.js';

test.beforeEach(async () => { await clearEmulators(); });

async function seeded(page, activeId) {
  const { uid } = await makeAccount(ALEX);
  const seen = new Map();
  for (const k of ['couple', 'retired-draft']) for (const p of fixtureNamed(k).plans()) seen.set(p.id, p);
  for (const p of seen.values()) await putPlan(uid, { ...p, isActive: p.id === activeId });
  await putSettings(uid, { lastSeenVersion: VERSION, view: 'full' });
  await page.clock.setFixedTime(new Date(PARITY_TODAY));
  await signIn(page, ALEX);   // waits until signed in
  await openFull(page);
  await waitQuiet(page);
  await closeNews(page);
  return uid;
}
const choose = (page, id) => page.evaluate((id) => { document.querySelector(`.scenario-dropdown-item[data-scenario-id="${id}"]`).click(); }, id);
const monthsListed = (page) => page.evaluate(() => [...(document.getElementById('historyMobileSelector')?.options || [])].map((o) => o.value));

test('Sam open, Kim chosen and then Sam at once: Sam is the plan open', async ({ page }) => {
  test.setTimeout(240_000);
  const uid = await seeded(page, 'ParCoupleSam');
  await page.evaluate(() => {   // Kim, then Sam pressed while Kim is still opening (the menu as drawn for Sam)
    for (const id of ['ParCoupleKim', 'ParCoupleSam']) document.querySelector(`.scenario-dropdown-item[data-scenario-id="${id}"]`).click();
  });
  await waitQuiet(page);
  await expect.poll(async () => (await plansOf(uid)).filter((p) => p.isActive).map((p) => p.id), { timeout: 30_000 }).toEqual(['ParCoupleSam']);
  await expect(page.locator('#scenarioActiveName')).toHaveText('Sam');
});

test('the History month list after a switch to a plan with no months recorded is empty', async ({ page }) => {
  test.setTimeout(240_000);
  await seeded(page, 'ParCoupleKim');
  await expect.poll(() => monthsListed(page), { timeout: 30_000 }).toEqual(['2026-07', '2026-08', '2026-09']);
  await choose(page, 'ParRetiredDraft');
  await waitQuiet(page);
  await expect(page.locator('#scenarioActiveName')).toHaveText('Kim retired');
  expect(await monthsListed(page)).toEqual([]);
});
