/**
 * J9 (7.4.0, no later start): opening a plan stored with a start later than it should be writes nothing. Two plans saved
 * the old way, fictional (Alex): a retired DRAFT saved with next April (the corpus's fixture 07), which the site now reads
 * from this tax year until its next Save; and a LOCKED gilt ladder set to start next April with no month work stopped (the
 * corpus's fixture 03), whose months are recorded from July 2026: from 7.4.3 its home and "About you and when" offer to start
 * it from 2026/27, the tax year those months begin, with no question first. Signed in, against the local
 * emulators: the draft's home and "About you and when", then the locked plan's home and "About you and when", are opened
 * and read; afterwards both plans in the account are byte-identical to what was put there. At desktop-1440 and phone-390.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test, expect, REPO } from '../helpers/app.js';
import { clearEmulators, makeAccount, putPlan, putSettings, plansOf, toValue, fromValue, ALEX } from './emulator.js';
import { openAt, signIn } from './journeys.js';
import { VERSION } from '../../src/constants.js';

const LATE = 'AlexLaterDraft07';
const LOCKED = 'AlexLockedLadder03';
const NOW = '2026-11-04T09:00:00.000Z';   // tax year 2026/27
const sortKeys = (v) => (Array.isArray(v) ? v.map(sortKeys) : v && typeof v === 'object' ? Object.keys(v).sort().reduce((o, k) => { if (v[k] !== undefined) o[k] = sortKeys(v[k]); return o; }, {}) : v);
const read = (name) => JSON.parse(readFileSync(join(REPO, 'tests', 'fixtures', 'plans', name + '.json'), 'utf8'));
/** A plan as the account holds it once written (Firestore's own values, read back), for a byte-for-byte comparison. */
const asStored = ({ id, ...fields }) => ({ id, ...fromValue(toValue(fields)) });

function plans() {
  const late = read('07-pre-6.13-flat-params');
  const locked = read('20-locked-start-after-stop');
  delete locked.stressTool.settings.stoppedWork;
  delete late.household; delete locked.household;
  return [
    { ...late, id: LATE, planDetails: { ...late.planDetails, name: 'Alex’s draft' }, isActive: true },
    { ...locked, id: LOCKED, planDetails: { ...locked.planDetails, name: 'Alex’s ladder' }, isActive: false }
  ];
}

test.beforeEach(async () => { await clearEmulators(); });

test('a draft saved with next April reads from this tax year, a locked one is offered the move to where its months begin; opening either writes nothing', async ({ page }) => {
  test.setTimeout(240_000);
  const put = plans();
  const { uid } = await makeAccount(ALEX);
  for (const p of put) await putPlan(uid, p);
  await putSettings(uid, { lastSeenVersion: VERSION });
  const before = JSON.stringify(sortKeys((await plansOf(uid)).sort((a, b) => a.id.localeCompare(b.id))));
  expect(before).toBe(JSON.stringify(sortKeys(put.map(asStored).sort((a, b) => a.id.localeCompare(b.id)))));
  await page.clock.setFixedTime(new Date(NOW));

  await test.step('signed in', async () => {
    await openAt(page, '#/account');
    await signIn(page, ALEX);
    await expect(page.getByTestId('account.signIn')).toHaveCount(0, { timeout: 30_000 });
  });

  await test.step('the draft: its home, then "About you and when" says once where it runs from', async () => {
    await openAt(page, '#/plan/' + LATE);
    await expect(page.getByTestId('plan.home')).toBeVisible({ timeout: 30_000 });
    await openAt(page, '#/plan/' + LATE + '/about');
    await expect(page.locator('[data-line="about.laterNow"]')).toHaveText('Your plan runs from 2026/27, this tax year.', { timeout: 30_000 });
    await expect(page.locator('[data-line^="about.later"]')).toHaveCount(1);
  });

  await test.step('the locked plan: its home and "About you and when" offer to start it where its recorded months begin', async () => {
    await openAt(page, '#/plan/' + LOCKED);
    await expect(page.getByTestId('plan.home')).toBeVisible({ timeout: 30_000 });
    await expect(page.locator('[data-todo="start.moveRecords"]')).toContainText('Your plan is set to start in April 2027, but your recorded months begin in July 2026.', { timeout: 30_000 });
    await expect(page.locator('[data-todo="start.ask"]')).toHaveCount(0);
    await openAt(page, '#/plan/' + LOCKED + '/about');
    await expect(page.getByTestId('plan.about.moveStart')).toContainText('Start it from 2026/27', { timeout: 30_000 });
    await expect(page.getByTestId('plan.about.startPointer')).toContainText('Move it to 2026/27, when your recorded months begin.');
    await expect(page.getByTestId('plan.about.stopAsk')).toHaveCount(0);
  });

  await test.step('nothing was written: both plans byte-identical in the account', async () => {
    const after = JSON.stringify(sortKeys((await plansOf(uid)).sort((a, b) => a.id.localeCompare(b.id))));
    expect(after).toBe(before);
  });
});
