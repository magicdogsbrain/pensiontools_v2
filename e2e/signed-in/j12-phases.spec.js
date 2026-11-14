/**
 * J12 (7.10.0; spec-7100 §9 "Signed in", j12; research/v7/replan-nov-2026.md §6.1): any phase can be the way in, and the home
 * never nags. Signed in, against the local emulators, at desktop-1440 and phone-390. Fictional people only.
 *
 * Alex, still saving, a plan not locked, stopping work in 48 months (the corpus's couple plan B, on its own):
 *   1. on the review, chooses "Adventurously" and a 3-year move window: one write each;
 *   2. the clock moves on 24 months: "Moving.", "24 months left", nothing to do;
 *   3. records what Alex holds, then the review: "Test with what I hold" → "I accept this as my plan" → "Yes, this is my plan":
 *      ONE write (the phases and the agreement entry);
 *   4. the home: "Moving." with the accepted line and nothing due; after a reload the same, nothing written on opening;
 *   5. the clock moves past the stop: "Living on it. Not locked yet.", nothing written.
 * Sam keeps question C at 66 and signs in:
 *   1. "Living on it. Not locked yet." at once: no Moving, no move to-do;
 *   2. what Sam holds 15 points off the plan's mix: the drift line with "Test with what I hold", and no to-do;
 *   3. the new app shows no to-do and writes nothing; the classic planner's banner has no due item (its own onboarding
 *      sentence only), and it writes nothing of the phases, the to-dos or the figures — only the stage record it has kept
 *      on opening since 6.6.0 (`journey`, its first entry on a plan never opened there; spec-7100 §2 keeps it as 7.9.0 made it).
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test, expect, v7, REPO, PROD, CLASSIC_PATH, WORKER_DATA_MISSING } from '../helpers/app.js';
import { clearEmulators, makeAccount, putPlan, putSettings, plansOf, ALEX, SAM } from './emulator.js';
import { keep, openAt, signIn, planAddress } from './journeys.js';
import { VERSION } from '../../src/constants.js';
import { moveInputs } from '../../src/services/PlanReading.js';
import { driftOf } from '../../src/services/TransitionPlanner.js';

const H = 'plan.home';
const R = 'plan.review';
const HOLD = 'plan.hold';
const sortKeys = (v) => (Array.isArray(v) ? v.map(sortKeys) : v && typeof v === 'object' ? Object.keys(v).sort().reduce((o, k) => { if (v[k] !== undefined) o[k] = sortKeys(v[k]); return o; }, {}) : v);
const same = (a, b) => JSON.stringify(sortKeys(a)) === JSON.stringify(sortKeys(b));
const changed = (a, b) => [...new Set([...Object.keys(a), ...Object.keys(b)])].filter((k) => !same(a[k], b[k])).sort();

test.beforeEach(async ({ watch }) => {
  await clearEmulators();
  watch.allow(WORKER_DATA_MISSING);
});

/** The page at another moment: the clock moved, signed in again if the long gap signed the window out. */
async function at(page, when, who) {
  await page.clock.setFixedTime(new Date(when));
  await openAt(page, '#/account');
  await page.reload();   // the page reads today once, when it loads
  const form = page.getByTestId('account.signIn');
  const signedIn = page.getByTestId('account.signedIn');
  await expect(form.or(signedIn).first()).toBeVisible({ timeout: 30_000 });
  if (await form.isVisible()) await signIn(page, who);
  await expect(form).toHaveCount(0, { timeout: 30_000 });
}

/** Pastes a table of pension lines into "What you hold" and adds them: ONE write of the record. */
async function holds(page, planId, lines) {
  await openAt(page, `#/plan/${planId}/hold`);
  await expect(page.getByTestId('plan.step.hold')).toBeVisible({ timeout: 30_000 });
  await page.getByTestId(`${HOLD}.paste.open`).click();
  const wrapper = page.getByTestId(`${HOLD}.paste.wrapper`);
  if (await wrapper.count()) await wrapper.selectOption('SIPP');
  const text = ['Investment\tTicker\tUnits\tValue', ...lines.map(([name, ticker, value]) => `${name}\t${ticker}\t100\t£${value.toLocaleString('en-GB')}`)].join('\n');
  await page.getByTestId(`${HOLD}.paste.text`).fill(text);
  await expect(page.getByTestId(`${HOLD}.paste.add`)).toBeVisible({ timeout: 30_000 });
  await page.getByTestId(`${HOLD}.paste.add`).click();
  await expect(page.getByTestId(`${HOLD}.toast`)).toContainText('added to your pension', { timeout: 60_000 });
}

/** Alex: the corpus's couple plan B on its own, a year younger, so the stop is in January 2031 — 48 months on from January 2027. */
function alexPlan() {
  const p = JSON.parse(readFileSync(join(REPO, 'tests', 'fixtures', 'plans', '10-couple-b.json'), 'utf8'));
  delete p.household;
  // the age said once in each place the plan keeps it (the Budget's is read when it is the newer)
  p.stressTool.settings.currentAge = 57;
  p.stressTool.settings.firstTaxYear = 2030;
  p.accumulationTool.settings.currentAge = 57;
  p.budgetTool.settings.currentAge = 57;
  return { ...p, id: 'AlexPhases12', planDetails: { ...p.planDetails, name: 'Alex’s plan' }, isActive: true };
}

test('Alex: saving, a choice each one write; the window opens with nothing to do; "I accept this as my plan" one write; Moving until the stop, then Living on it', async ({ page }) => {
  test.setTimeout(420_000);
  const planned = alexPlan();
  const ID = planned.id;
  const { uid } = await makeAccount(ALEX);
  await putPlan(uid, planned);
  await putSettings(uid, { lastSeenVersion: VERSION });

  await test.step('January 2027, 48 months to the stop: Saving; on the review, "Adventurously" and 3 years, one write each', async () => {
    await at(page, '2027-01-15T09:00:00.000Z', ALEX);
    await openAt(page, `#/plan/${ID}`);
    await expect(page.getByTestId(`${H}.headline`)).toHaveText(/^Saving\./, { timeout: 30_000 });
    await expect(page.getByTestId(`${H}.moveWindow`)).toHaveText('Your move window opens in January 2028.');
    await expect(page.getByTestId(`${H}.todo`).locator('.home-item')).toHaveCount(0);
    await openAt(page, `#/plan/${ID}/review`);
    await expect(page.locator(`[data-testid="${R}"][data-phase="saving"]`)).toBeVisible({ timeout: 30_000 });
    await page.getByTestId(`${R}.choice.level.change`).click();
    await page.getByTestId(`${R}.choice.level.adventurous`).click();
    await expect(page.getByTestId(`${R}.toast`)).toContainText('adventurously', { timeout: 30_000 });
    let [p] = await plansOf(uid);
    expect(changed(planned, p)).toEqual(['lastModified', 'phases']);
    expect(p.phases.saving.strategy.level).toBe('adventurous');
    expect(p.phases.moving).toBeUndefined();
    const afterLevel = p;
    await page.getByTestId(`${R}.toastClose`).click();
    await page.getByTestId(`${R}.choice.window.change`).click();
    await page.getByTestId(`${R}.choice.window.3`).click();
    await expect(page.getByTestId(`${R}.toast`)).toContainText('Your move window is now 3 years.', { timeout: 30_000 });
    [p] = await plansOf(uid);
    // (the clock is fixed, so the stamp is written with the same moment as the first choice's)
    expect(changed(afterLevel, p)).toEqual(['phases']);
    expect(p.lastModified).toBe(afterLevel.lastModified);
    expect(p.phases.moving.window.years).toBe(3);
    expect(p.phases.history.map((h) => h.what)).toEqual(['saving.level', 'window']);
  });

  await test.step('24 months on: "Moving.", 24 months left, nothing to do; nothing written', async () => {
    const [before] = await plansOf(uid);
    await at(page, '2029-01-15T09:00:00.000Z', ALEX);
    await openAt(page, `#/plan/${ID}`);
    await expect(page.getByTestId(`${H}.headline`)).toHaveText('Moving.', { timeout: 30_000 });
    await expect(page.getByTestId(`${H}.moveWindow`)).toHaveText('In your move window: 24 months left, to January 2031. You can record what you hold when you like.');
    await expect(page.getByTestId(`${H}.todo`).locator('.home-item')).toHaveCount(0);
    await expect(page.locator('[data-todo^="move."]')).toHaveCount(0);
    expect(same((await plansOf(uid))[0], before), 'opening writes nothing').toBe(true);
  });

  await test.step('what Alex holds recorded; the review: "Test with what I hold" → "I accept this as my plan" → "Yes, this is my plan": ONE write', async () => {
    await holds(page, ID, [['Vanguard FTSE All-World', 'VWRP', 170000], ['iShares UK Gilts', 'IGLT', 40000], ['Cash fund', 'CSH2', 11000]]);
    const [held] = await plansOf(uid);
    await openAt(page, `#/plan/${ID}/review`);
    await expect(page.getByTestId('plan.step.review')).toHaveAttribute('data-phase', 'moving', { timeout: 30_000 });
    await expect(page.getByTestId(`${R}.moving.lead`)).toContainText('You are in your move window: 24 months left, to January 2031.');
    await page.getByTestId(`${R}.run.button`).click();
    await expect(page.getByTestId(`${R}.run`)).toHaveAttribute('data-status', 'done', { timeout: 120_000 });
    await page.getByTestId(`${R}.agreement.accept`).click();
    await page.getByTestId(`${R}.agreement.yes`).click();
    await expect(page.getByTestId(`${R}.toast`)).toContainText('Saved: you accepted what you hold as your plan.', { timeout: 30_000 });
    await expect.poll(async () => { const [p] = await plansOf(uid); return !!(p.phases && p.phases.moving && p.phases.moving.agreed); }, { timeout: 15_000 }).toBe(true);
    const [p] = await plansOf(uid);
    // (the clock is fixed: the record's write and this one carry the same stamp, the moment of the clock)
    expect(changed(held, p)).toEqual(['phases', 'planAmendments']);
    expect(p.lastModified).toBe('2029-01-15T09:00:00.000Z');
    expect(p.phases.moving.agreed).toMatchObject({ strategyId: 'pots-and-valves' });
    expect(p.planAmendments).toHaveLength(1);
    expect(p.planAmendments[0]).toMatchObject({ kind: 'asHeld', test: { id: 'whole' } });
    expect(same(p.stressTool, planned.stressTool), 'the settings').toBe(true);
    expect(same(p.holdings, held.holdings), 'what is held').toBe(true);
  });

  await test.step('the home: "Moving." with the accepted line, nothing due; after a reload the same, nothing written on opening', async () => {
    const [before] = await plansOf(uid);
    await openAt(page, `#/plan/${ID}`);
    const read = async () => {
      await expect(page.getByTestId(`${H}.headline`)).toHaveText('Moving.', { timeout: 30_000 });
      await expect(page.getByTestId(`${H}.moveWindow`)).toHaveText('You accepted what you hold on 15 January 2029. You stop work in January 2031.');
      await expect(page.getByTestId(`${H}.todo`).locator('.home-item')).toHaveCount(0);
    };
    await read();
    await page.reload();
    await read();
    expect(same((await plansOf(uid))[0], before), 'opening writes nothing').toBe(true);
  });

  await test.step('past the stop: "Living on it. Not locked yet.", nothing written', async () => {
    const [before] = await plansOf(uid);
    await at(page, '2031-02-15T09:00:00.000Z', ALEX);
    await openAt(page, `#/plan/${ID}`);
    await expect(page.getByTestId(`${H}.headline`)).toHaveText('Living on it. Not locked yet.', { timeout: 30_000 });
    await expect(page.locator('[data-todo="plan.confirmStop"]')).toHaveCount(0);
    expect(same((await plansOf(uid))[0], before), 'opening writes nothing').toBe(true);
  });
});

test('Sam: question C kept at 66, signed in — Living on it at once; what is held 15 points off the mix is a line, never a to-do; the classic banner has no due item; nothing written', async ({ page }) => {
  test.setTimeout(360_000);
  const { uid } = await makeAccount(SAM);
  await putSettings(uid, { lastSeenVersion: VERSION });
  await page.clock.setFixedTime(new Date('2026-11-16T09:00:00.000Z'));
  let ID = null;

  await test.step('question C at 66, kept, then signed in: on the kept plan\'s home, "Living on it. Not locked yet.", no Moving and no move to-do', async () => {
    const app = v7(page, 'prod', 'c');
    await app.open('#/c/numbers');
    await app.ready();
    await app.fill({ 'you.age': '66', 'you.pot': '250000' });
    await app.click('c.action.show');
    await app.at('c.answer');
    await app.ready(120_000);
    await keep(page, 'c');
    await page.getByTestId('c.keep.toAccount').click();
    await signIn(page, SAM);
    await expect(page.locator('#app [data-screen]')).toHaveAttribute('data-screen', /^plan/, { timeout: 30_000 });
    ID = planAddress(page).planId;
    await openAt(page, `#/plan/${ID}`);
    await expect(page.getByTestId(`${H}.headline`)).toHaveText('Living on it. Not locked yet.', { timeout: 30_000 });
    await expect(page.getByTestId(`${H}.moveWindow`)).toHaveCount(0);
    await expect(page.getByTestId(`${H}.todo`).locator('.home-item')).toHaveCount(0);
    await expect(page.locator('[data-todo^="move."]')).toHaveCount(0);
  });

  await test.step('what Sam holds, 15 points more in shares than the plan\'s mix: the drift line with "Test with what I hold", no to-do', async () => {
    const [plan] = await plansOf(uid);
    // the plan's own mix on its pension, read as the home reads it (in memory, from the settings): what 100% cash is off by
    const now = new Date('2026-11-16T09:00:00.000Z');
    const probe = driftOf(moveInputs({ ...plan, holdings: { lines: [{ wrapper: 'SIPP', ticker: 'CSH2', name: 'Cash fund', value: 100000 }] } }, { now, fromSettings: true }).diff);
    // (held 100% cash: each bucket's points are what is held less the plan's share, so the plan's share is what is missing)
    const mix = { shares: -probe.drift.shares, bonds: -probe.drift.bonds, cash: 100 - probe.drift.cash };
    expect(mix.bonds, 'the plan holds bonds to move 15 points from').toBeGreaterThanOrEqual(15);
    const pot = 100000;
    const lines = [['Vanguard FTSE All-World', 'VWRP', Math.round(pot * (mix.shares + 15) / 100)], ['iShares UK Gilts', 'IGLT', Math.round(pot * (mix.bonds - 15) / 100)], ['Cash fund', 'CSH2', Math.round(pot * mix.cash / 100)]].filter(([, , v]) => v > 0);
    await holds(page, ID, lines);
    await openAt(page, `#/plan/${ID}`);
    const drift = page.getByTestId(`${H}.drift`);
    await expect(drift).toBeVisible({ timeout: 30_000 });
    await expect(drift).toContainText(/^(Shares|Bonds) (is|are) \d+% of your pension; the plan’s mix has \d+% in (shares|bonds)\./);
    await expect(page.getByTestId(`${H}.drift.test`)).toHaveText('Test with what I hold');
    await expect(page.getByTestId(`${H}.todo`).locator('.home-item')).toHaveCount(0);
  });

  await test.step('the new app shows no to-do and writes nothing; the classic planner\'s banner has no due item and writes only its stage record', async () => {
    const before = await plansOf(uid);
    await openAt(page, `#/plan/${ID}`);
    await expect(page.getByTestId(`${H}.todo`).locator('.home-item')).toHaveCount(0);
    await page.reload();
    await expect(page.getByTestId(`${H}.headline`)).toHaveText('Living on it. Not locked yet.', { timeout: 30_000 });
    expect(changed(before[0], (await plansOf(uid))[0]), 'the new app writes nothing on opening').toEqual([]);
    await page.goto(PROD + CLASSIC_PATH);
    await expect(page.locator('#nextStepBanner')).toBeVisible({ timeout: 60_000 });
    await expect.poll(() => page.evaluate(() => window._nextStepDismiss && window._nextStepDismiss.kind), { timeout: 30_000 }).toBe('banner');
    await expect(page.locator('#nextStepText')).not.toContainText('Next:');
    // (the banner is drawn after the page's stage is worked out and its stage record saved: index.html updateNextStepBanner)
    const after = await plansOf(uid);
    expect(after.map((p) => p.id)).toEqual(before.map((p) => p.id));
    // the classic planner's stage record (6.6.0, LifeStage.journeyAppend): the plan's first entry, its stage, and nothing else
    const moved = changed(before[0], after[0]);
    expect(moved.filter((k) => k !== 'journey'), 'nothing else written on opening').toEqual([]);
    if (moved.includes('journey')) {
      expect(before[0].journey || []).toEqual([]);
      expect(after[0].journey.map((e) => e.stage)).toEqual(['draft-retired']);
    }
  });
});
