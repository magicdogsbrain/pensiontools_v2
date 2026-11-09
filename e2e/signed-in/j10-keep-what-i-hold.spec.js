/**
 * J10 (7.6.0): "this is what I hold, and I'm keeping it", signed in. A person with a locked index-linked ladder in the account
 * (the corpus's "Sam's plan", fictional, with a made-up share line) opens What you hold, keeps the share by choice and
 * counted toward the gaps, and adds money expected later. Each is ONE write of the record; reloaded, the page reads the
 * same from the account; the plan's settings and its plan document are byte-identical to what was planted; the share is no
 * longer a sell on the move. At desktop-1440 and phone-390, against the local emulators.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test, expect, REPO } from '../helpers/app.js';
import { clearEmulators, makeAccount, putPlan, putSettings, plansOf, SAM } from './emulator.js';
import { openAt, signIn } from './journeys.js';
import { VERSION } from '../../src/constants.js';

const ID = 'SamKeeps10';
const T = 'plan.hold';
const NOW = '2026-11-09T09:00:00.000Z';
const sortKeys = (v) => (Array.isArray(v) ? v.map(sortKeys) : v && typeof v === 'object' ? Object.keys(v).sort().reduce((o, k) => { if (v[k] !== undefined) o[k] = sortKeys(v[k]); return o; }, {}) : v);
const same = (a, b) => JSON.stringify(sortKeys(a)) === JSON.stringify(sortKeys(b));

function lockedLadder() {
  const p = JSON.parse(readFileSync(join(REPO, 'tests', 'fixtures', 'plans', '20-locked-start-after-stop.json'), 'utf8'));
  delete p.household;
  p.holdings.lines.push({ asOf: '2026-11-01', contribution: null, kind: null, name: 'Example Shares plc', ocf: null, sedol: null, subClass: null, ticker: 'EXMPL', units: 100, value: 15000, wrapper: 'SIPP' });
  return { ...p, id: ID, planDetails: { ...p.planDetails, name: 'Sam’s plan' }, isActive: true };
}
const SHARE = 8;

test.beforeEach(async () => { await clearEmulators(); });

test('a locked ladder: a share kept by choice and money expected later, each one write; reload reads the same; settings and the plan document byte-identical', async ({ page }) => {
  test.setTimeout(180_000);
  const planted = lockedLadder();
  const { uid } = await makeAccount(SAM);
  await putPlan(uid, planted);
  await putSettings(uid, { lastSeenVersion: VERSION });
  await page.clock.setFixedTime(new Date(NOW));

  await test.step('signed in, What you hold opens with Keep this on every line; opening writes nothing', async () => {
    await openAt(page, '#/account');
    await signIn(page, SAM);
    await openAt(page, '#/plan/' + ID + '/hold');
    await expect(page.getByTestId(`${T}.line.${SHARE}.keep.open`)).toBeVisible({ timeout: 30_000 });
    const [p] = await plansOf(uid);
    expect(same(p.holdings, planted.holdings), 'opening writes nothing').toBe(true);
  });

  await test.step('the share kept by choice, counted toward the gaps: one write of the record', async () => {
    await page.getByTestId(`${T}.line.${SHARE}.keep.open`).click();
    await expect(page.getByTestId(`${T}.line.${SHARE}.keep.as.mine`)).toBeChecked();
    await page.getByTestId(`${T}.line.${SHARE}.keep.gaps`).click();
    await page.getByTestId(`${T}.line.${SHARE}.keep.save`).click();
    await expect(page.getByTestId(`${T}.toast`)).toContainText('‘Example Shares plc’ kept.', { timeout: 30_000 });
    await expect.poll(async () => { const [p] = await plansOf(uid); return p.holdings.lines[SHARE].keep; }, { timeout: 15_000 }).toEqual({ as: 'mine', fundsGaps: true });
  });

  await test.step('money expected later, added: one write of the record', async () => {
    await page.getByTestId(`${T}.toastClose`).click();
    await page.getByTestId('plan.hold.expected.label').fill('Pension elsewhere');
    await page.getByTestId('plan.hold.expected.amount').fill('40,000');
    await page.getByTestId('plan.hold.expected.by').fill('April 2027');
    await page.getByTestId(`${T}.expected.addButton`).click();
    await expect(page.getByTestId(`${T}.toast`)).toContainText('Money you expect added.', { timeout: 30_000 });
    await expect.poll(async () => { const [p] = await plansOf(uid); return p.holdings.expected; }, { timeout: 15_000 })
      .toEqual([{ id: 'e1', label: 'Pension elsewhere', wrapper: 'SIPP', amount: 40000, by: '2027-04' }]);
  });

  await test.step('reloaded: the page reads the same from the account; the settings and the plan document byte-identical; no sell of the share', async () => {
    await page.reload();
    await expect(page.getByTestId(`${T}.line.${SHARE}.keep.saved`)).toHaveText('Kept by choice, counted toward the gaps.', { timeout: 30_000 });
    await expect(page.getByTestId(`${T}.expected.e1.line`)).toHaveText('Pension elsewhere: £40,000, expected by April 2027.');
    await expect(page.getByTestId(`${T}.gaps`).locator('[data-line="canFall"]')).toBeVisible();
    const [p] = await plansOf(uid);
    expect(same(p.stressTool, planted.stressTool), 'the plan\'s settings').toBe(true);
    expect(same(p.decisionTool, planted.decisionTool), 'the lock and the months').toBe(true);
    expect(same(p.planDocument, planted.planDocument), 'the plan document').toBe(true);
    await openAt(page, '#/plan/' + ID + '/move');
    await expect(page.getByTestId('plan.move.kept')).toContainText('Example Shares plc', { timeout: 30_000 });
    await expect(page.locator('[data-testid="plan.move.sell"] tr[data-key="sell:EXMPL"]')).toHaveCount(0);
  });
});
