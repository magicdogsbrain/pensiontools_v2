/**
 * J11 (7.7.0): "Test what you keep against your plan" and "I accept this risk", signed in. A person with a locked index-linked
 * ladder in the account (the corpus's "Sam's plan", fictional) keeps a made-up share by choice: What you hold says it is not
 * yet tested; the test runs on its button; "I accept this risk" asks, then is ONE write of the agreements; reloaded, the
 * page and the home read it from the account; the plan's settings and its plan document are byte-identical to what was
 * planted; "Withdraw this" takes it off again in one write. At desktop-1440 and phone-390, against the local emulators.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test, expect, REPO } from '../helpers/app.js';
import { clearEmulators, makeAccount, putPlan, putSettings, plansOf, SAM } from './emulator.js';
import { openAt, signIn } from './journeys.js';
import { VERSION } from '../../src/constants.js';

const ID = 'SamKeeps11';
const T = 'plan.hold.keepTest';
const NOW = '2026-11-09T09:00:00.000Z';
const sortKeys = (v) => (Array.isArray(v) ? v.map(sortKeys) : v && typeof v === 'object' ? Object.keys(v).sort().reduce((o, k) => { if (v[k] !== undefined) o[k] = sortKeys(v[k]); return o; }, {}) : v);
const same = (a, b) => JSON.stringify(sortKeys(a)) === JSON.stringify(sortKeys(b));

function lockedLadder() {
  const p = JSON.parse(readFileSync(join(REPO, 'tests', 'fixtures', 'plans', '20-locked-start-after-stop.json'), 'utf8'));
  delete p.household;
  p.holdings.lines.push({ asOf: '2026-11-01', contribution: null, kind: null, name: 'Example Shares plc', ocf: null, sedol: null, subClass: null, ticker: 'EXMPL', units: 100, value: 15000, wrapper: 'SIPP', keep: { as: 'mine', fundsGaps: true } });
  return { ...p, id: ID, planDetails: { ...p.planDetails, name: 'Sam’s plan' }, isActive: true };
}

test.beforeEach(async () => { await clearEmulators(); });

test('keep → test → accept → reload → settings and document byte-identical → withdraw', async ({ page }) => {
  test.setTimeout(240_000);
  const planted = lockedLadder();
  const { uid } = await makeAccount(SAM);
  await putPlan(uid, planted);
  await putSettings(uid, { lastSeenVersion: VERSION });
  await page.clock.setFixedTime(new Date(NOW));

  await test.step('signed in: What you hold says the kept line is not yet tested; opening writes nothing', async () => {
    await openAt(page, '#/account');
    await signIn(page, SAM);
    await openAt(page, '#/plan/' + ID + '/hold');
    await expect(page.getByTestId(T)).toHaveAttribute('data-status', 'untested', { timeout: 30_000 });
    const [p] = await plansOf(uid);
    expect(p.planAmendments, 'opening writes nothing').toBeUndefined();
  });

  await test.step('the test, then "I accept this risk": one write of the agreements', async () => {
    await page.getByTestId(`${T}.run`).click();
    await expect(page.getByTestId(`${T}.result`)).toBeVisible({ timeout: 120_000 });
    await page.getByTestId(`${T}.accept`).click();
    await page.getByTestId(`${T}.confirm.yes`).click();
    await expect(page.getByTestId('plan.hold.toast')).toContainText('You accepted this risk on', { timeout: 30_000 });
    await expect.poll(async () => { const [p] = await plansOf(uid); return (p.planAmendments || []).length; }, { timeout: 15_000 }).toBe(1);
  });

  await test.step('reloaded: the agreement read from the account, on What you hold and the home; settings and the plan document byte-identical', async () => {
    await page.reload();
    await expect(page.getByTestId(`${T}.line`)).toHaveAttribute('data-status', 'agreed', { timeout: 30_000 });
    const [p] = await plansOf(uid);
    expect(same(p.stressTool, planted.stressTool), 'the plan\'s settings').toBe(true);
    expect(same(p.decisionTool, planted.decisionTool), 'the lock and the months').toBe(true);
    expect(same(p.planDocument, planted.planDocument), 'the plan document').toBe(true);
    expect(same(p.holdings, planted.holdings), 'what you hold').toBe(true);
    await openAt(page, '#/plan/' + ID);
    await expect(page.getByTestId('plan.home.keepTest.line')).toHaveAttribute('data-status', 'agreed', { timeout: 30_000 });
  });

  await test.step('"Withdraw this": one write, the agreement gone, the to-do back', async () => {
    await openAt(page, '#/plan/' + ID + '/hold');
    await page.getByTestId(`${T}.withdraw`).click();
    await expect(page.getByTestId('plan.hold.toast')).toContainText('is withdrawn', { timeout: 30_000 });
    await expect.poll(async () => { const [p] = await plansOf(uid); return (p.planAmendments || []).length; }, { timeout: 15_000 }).toBe(0);
    await expect(page.getByTestId(`${T}.line`)).toHaveAttribute('data-status', 'untested', { timeout: 30_000 });
  });
});
