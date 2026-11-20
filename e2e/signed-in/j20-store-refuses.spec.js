/**
 * J20: the store refuses to hand the plans back (lead4.md R2, D1; the check of step LEFT, round 2). Fictional plan (the
 * parity fixture: Pat, retired, locked on pots, months recorded). Signed in, against the local emulators, whose security
 * rules are set for this test to refuse every read and write, then put back.
 *   - the full view says the plan could not be read, in the words both views use, and shows none of its figures;
 *   - it never offers the first-plan wizard to a person who has a plan, and the plan menu never says "No plans yet".
 * The emulators are shared one test at a time (playwright.signed-in.config.js: workers 1), so the rules change touches
 * no other test; they are put back even when the test fails.
 */
import { readFileSync } from 'node:fs';
import { test, expect } from '../helpers/app.js';
import { clearEmulators, makeAccount, putPlan, putSettings, ALEX, PROJECT } from './emulator.js';
import { PARITY_TODAY, fixtureNamed } from '../parity/fixtures/plans.js';
import { waitQuiet } from '../parity/collect.js';
import { openFull, closeNews, signIn } from '../scenarios/routes.js';
import { VERSION } from '../../src/constants.js';
import { READ_FAULT_WORDS } from '../../src/reading/readFault.js';

const RULES_URL = `http://127.0.0.1:8080/emulator/v1/projects/${PROJECT}:securityRules`;
const RULES = readFileSync(new URL('../../firestore.rules', import.meta.url), 'utf8');
const REFUSE_ALL = "rules_version = '2';\nservice cloud.firestore { match /databases/{db}/documents { match /{d=**} { allow read, write: if false; } } }";
async function putRules(content) {
  const r = await fetch(RULES_URL, { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ rules: { files: [{ name: 'firestore.rules', content }] } }) });
  if (!r.ok) throw new Error('emulator rules: ' + r.status);
}

test.beforeEach(async () => { await clearEmulators(); await putRules(RULES); });
test.afterEach(async () => { await putRules(RULES); });

test('a plan the store refuses: the fault is said, no figures, no first-plan wizard', async ({ page }) => {
  test.setTimeout(240_000);
  const { uid } = await makeAccount(ALEX);
  for (const p of fixtureNamed('retired-locked-pots').plans()) await putPlan(uid, { ...p, isActive: p.id === 'ParRetiredPots' });
  await putSettings(uid, { lastSeenVersion: VERSION, view: 'full' });
  await page.clock.setFixedTime(new Date(PARITY_TODAY));
  await signIn(page, ALEX);
  await openFull(page);
  await waitQuiet(page);
  await closeNews(page);
  await expect(page.locator('#planReadFault')).toHaveCount(0);   // read as stored first: no fault

  await putRules(REFUSE_ALL);
  await page.reload();
  await expect(page.locator('#planReadFault')).toHaveText(READ_FAULT_WORDS, { timeout: 45_000 });
  await waitQuiet(page);
  await expect(page.locator('#setupWizard')).toBeHidden();
  await expect(page.locator('#mainApp')).toBeVisible();
  for (const id of ['ssPot', 'tryPot']) expect(await page.locator('#' + id).inputValue()).toBe('');
  await expect(page.locator('#scenarioActiveName')).not.toHaveText(/No Plan|Loading/);
  expect(await page.locator('#scenarioList').innerText()).not.toMatch(/No plans yet/);
});
