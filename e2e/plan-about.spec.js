/**
 * "About you and when", without an account (research/v7/editing-in-v7.md 5, E8). The PUBLISHED build, which serves the
 * planner at / and the preview at /v7/ on one site, so this window's plans (sessionStorage pt_guest_scenarios) are seen by both.
 *
 *  A plan made from an answer (corpus 10, with the answer's own record folded in) is planted in the window. On
 *  #/plan/<id>/about the boxes hold the saved facts with their sources; the stop age and the end age are changed; Save
 *  writes ONE plan: the stored text differs only in the step's declared keys (and the planner's last-changed stamp); the
 *  plan page then says the "will it last" answer is older than the change and its next sentence is "check it still lasts";
 *  Undo puts the text back byte for byte. A locked plan's page has no box. Nothing is written anywhere else.
 *
 * Firebase is never reached: the preview reads and writes this window's plans; every request outside the site is stopped.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test, expect, PROD, REPO, FIXED_NOW } from './helpers/app.js';
import { ALL_WRITES } from '../src/answers/plan/schema.js';

test.use({ outside: 'block' });

const GUEST_KEY = 'pt_guest_scenarios';
const OWN_KEYS = new Set(['pt_v7_draft', 'pt_lastActivity', 'pt_guest_minutes', 'pt_guest_nag_level', 'pt_lastSeenVersion']);
const v7 = (hash) => PROD + '/v7/' + hash;

/** Corpus plan 10 (stopping at 62, plans to 93), made from an answer: the answer's record of its inputs matches its settings. */
function planFromAnswer() {
  const plan = JSON.parse(readFileSync(join(REPO, 'tests', 'fixtures', 'plans', '10-couple-b.json'), 'utf8'));
  const ss = plan.stressTool.settings;
  plan.id = 'AboutPlan01';
  plan.planDetails.name = 'Alex’s plan';
  plan.isActive = true;
  delete plan.household;
  plan.lastModified = '2026-09-20T10:00:00.000Z';
  plan.fromAnswer = {
    createdAt: '2026-09-20T10:00:00.000Z', today: '2026-09-20', source: 'a', household: 'single', endAge: ss.shapeAgeNow + ss.duration - 1, years: ss.duration,
    stop: { kind: 'later', yearsFromNow: ss.retireAge - ss.currentAge },
    people: [{ who: 'you', ageToday: ss.currentAge, ageAtStop: ss.retireAge, years: ss.duration, stop: { kind: 'later', yearsFromNow: ss.retireAge - ss.currentAge } }],
    who: 'you', savedOn: '2026-09-20T10:00:00.000Z',
    answer: { lasted: 9, verdict: 'yes', monthly: null, runOutAge: null, potAtStop: null, number: null, payInNeeded: null }
  };
  return plan;
}
function lockedPlan() {
  const plan = JSON.parse(readFileSync(join(REPO, 'tests', 'fixtures', 'plans', '03-gilt-ladder-runup.json'), 'utf8'));
  plan.id = 'AboutLocked02';
  plan.isActive = false;
  return plan;
}
/** A plan's text with the declared paths taken out: what must be byte-identical across a save. */
function stripped(plan) {
  const out = JSON.parse(JSON.stringify(plan));
  for (const path of ALL_WRITES) { const parts = path.split('.'); let o = out; for (let i = 0; i < parts.length - 1 && o; i++) o = o[parts[i]]; if (o) delete o[parts[parts.length - 1]]; }
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

test.describe('"About you and when", without an account', () => {
  test('the boxes, Save (one plan, the declared keys only), the stale answer on the plan page, Undo byte for byte', async ({ page }) => {
    test.setTimeout(180_000);
    const plan = planFromAnswer();
    const locked = lockedPlan();
    const stored = await plant(page, [plan, locked]);
    await page.goto(v7('#/plan/AboutPlan01/about'));
    await expect(page.locator('#app [data-screen]')).toHaveAttribute('data-screen', 'plan.about');
    await expect(page.getByTestId('plan.step.about')).toHaveText('About you and when');
    // no sideways scroll, whatever the width
    const widths = await page.evaluate(() => ({ doc: document.documentElement.scrollWidth, win: window.innerWidth }));
    expect(widths.doc, 'no sideways scroll').toBeLessThanOrEqual(widths.win);
    // the saved facts, each with its source
    await expect(page.getByTestId('plan.about.age')).toHaveValue('58');
    await expect(page.getByTestId('plan.about.stopped.age')).toBeChecked();
    await expect(page.getByTestId('plan.about.stopAge')).toHaveValue('62');
    await expect(page.getByTestId('plan.about.endAge')).toHaveValue('93');
    await expect(page.locator('[data-saved-for="age"]')).toHaveText('From your plan, saved 22 August 2026 (58)');
    await expect(page.locator('[data-saved-for="endAge"]')).toHaveText('From your plan, saved 20 September 2026 (93)');
    await expect(page.locator('[data-region="plan-about"]')).toContainText('You stop work in January 2030, at 62.');
    await expect(page.locator('[data-region="plan-about"]')).toContainText('Your plan runs 32 years, from January 2030 to age 93.');
    const text = await page.locator('#app').innerText();
    expect(text).not.toMatch(/months? to go|years? to go|countdown/i);
    expect(text).not.toMatch(/undefined|NaN/);

    // the stop age and the end age, changed; the derived lines follow before Save
    await page.getByTestId('plan.about.stopAge').fill('63');
    await page.getByTestId('plan.about.endAge').fill('95');
    await expect(page.locator('[data-region="plan-about"]')).toContainText('You stop work in January 2031, at 63.');
    await expect(page.locator('[data-region="plan-about"]')).toContainText('Your plan runs 33 years, from January 2031 to age 95.');
    // the keyboard reaches Save: Enter in a box submits
    await page.getByTestId('plan.about.endAge').press('Enter');
    const toast = page.getByTestId('plan.about.toast');
    await expect(toast).toBeVisible();
    await expect(toast).toContainText('Saved. Your plan now runs 33 years, to age 95.');
    // one plan written, by the declared keys only; the locked plan byte-identical; the boxes now show the saved facts
    const after = await storedPlans(page);
    const before = JSON.parse(stored);
    expect(JSON.stringify(after[1])).toBe(JSON.stringify(before[1]));
    expect(stripped(after[0])).toBe(stripped(before[0]));
    expect(after[0].stressTool.settings.retireAge).toBe(63);
    expect(after[0].stressTool.settings.duration).toBe(33);
    expect(after[0].stressTool.settings.shapeAgeNow).toBe(63);
    expect(after[0].stressTool.settings.firstTaxYear).toBe(2030);
    expect(after[0].decisionTool.settings.firstTaxYear).toBe(2030);
    expect(after[0].budgetTool.settings.retirementAge).toBe(63);
    expect(after[0].lastModified).not.toBe(before[0].lastModified);
    await expect(page.getByTestId('plan.about.stopAge')).toHaveValue('63');
    await expect(page.locator('[data-saved-for="endAge"]')).toHaveText('From your plan, saved 30 September 2026 (95)');
    // nothing else was written: only the preview's own keys and the window's plans
    const keys = await page.evaluate(() => ({ session: Object.keys(sessionStorage), local: Object.keys(localStorage) }));
    for (const k of [...keys.session, ...keys.local]) expect(OWN_KEYS.has(k) || k === GUEST_KEY, `a key the preview must not write: ${k}`).toBe(true);

    // the plan page: the answer is older than its inputs; next: check it still lasts
    await page.goto(v7('#/plan/AboutPlan01/plan'));
    await expect(page.getByTestId('plan.step.plan')).toBeVisible();
    await expect(page.getByTestId('plan.answerStale')).toHaveText('Your ‘will it last’ answer was worked out on 20 September 2026, before the plan was changed on 30 September 2026.');
    await expect(page.getByTestId('rail.next')).toContainText('The plan has changed since its ‘will it last’ answer. Next: check it still lasts.');
    await expect(page.getByTestId('rail.next.button')).toHaveText('Check it still lasts');
    await expect(page.getByTestId('plan.plan.edit.about')).toHaveText('Change this here');
    await expect(page.locator('[data-region="plan-step"]')).toContainText('Stopping work at 63, in January 2031');

    // back to the step, the same change undone: byte for byte, the stale line gone
    await page.getByTestId('plan.plan.edit.about').click();
    await expect(page.getByTestId('plan.step.about')).toBeVisible();
    await page.getByTestId('plan.about.stopAge').fill('62');
    await page.getByTestId('plan.about.endAge').fill('93');
    await page.getByTestId('plan.about.save').click();
    await expect(page.getByTestId('plan.about.toast')).toContainText('Saved. Your plan now runs 32 years, to age 93.');
    await page.getByTestId('plan.about.undo').click();
    await expect(page.getByTestId('plan.about.toast')).toContainText('Put back as it was.');
    const undone = await storedPlans(page);
    expect(stripped(undone[0])).toBe(stripped(before[0]));
    expect(undone[0].stressTool.settings.retireAge).toBe(63);   // the undo of the second save: back to 63 and 95
    expect(undone[0].stressTool.settings.duration).toBe(33);

    // and the first change undone by hand: the plan as planted, byte for byte
    await page.getByTestId('plan.about.stopAge').fill('62');
    await page.getByTestId('plan.about.endAge').fill('93');
    await page.getByTestId('plan.about.save').click();
    await expect(page.getByTestId('plan.about.toast')).toContainText('Saved.');
    const restored = await storedPlans(page);
    expect(stripped(restored[0])).toBe(stripped(before[0]));
    for (const k of ['retireAge', 'duration', 'shapeAgeNow', 'firstTaxYear']) expect(restored[0].stressTool.settings[k]).toBe(before[0].stressTool.settings[k]);
    await page.goto(v7('#/plan/AboutPlan01/plan'));
    await expect(page.getByTestId('plan.step.plan')).toBeVisible();
    await expect(page.getByTestId('plan.answerStale')).toHaveCount(0);
    await expect(page.getByTestId('rail.next')).not.toContainText('check it still lasts');
  });

  test('a box left wrong is marked in plain words and nothing is written; Cancel clears the typing; a locked plan has no box', async ({ page }) => {
    test.setTimeout(120_000);
    const plan = planFromAnswer();
    const locked = lockedPlan();
    const stored = await plant(page, [plan, locked]);
    await page.goto(v7('#/plan/AboutPlan01/about'));
    await expect(page.getByTestId('plan.step.about')).toBeVisible();
    await page.getByTestId('plan.about.stopAge').fill('50');
    await page.getByTestId('plan.about.save').click();
    await expect(page.locator('[data-error-for="plan.about.stopAge"]')).toHaveText('The age you stop cannot be below your age today.');
    await expect(page.getByTestId('plan.about.problem')).toHaveText('Have a look at the boxes marked above.');
    await expect(page.getByTestId('plan.about.stopAge')).toBeFocused();
    expect(await page.evaluate((k) => sessionStorage.getItem(k), GUEST_KEY)).toBe(stored);
    await page.getByTestId('plan.about.cancel').click();
    await expect(page.getByTestId('plan.about.stopAge')).toHaveValue('62');
    expect(await page.evaluate(() => sessionStorage.getItem('pt_v7_draft'))).toBe(null);
    // the locked plan: figures only
    await page.goto(v7('#/plan/AboutLocked02/about'));
    await expect(page.getByTestId('plan.step.about')).toBeVisible();
    expect(await page.locator('#app input, #app select, #app textarea').count()).toBe(0);
    await expect(page.getByTestId('plan.about.fixed')).toHaveText('Fixed when you locked the plan on 1 July 2026.');
    await expect(page.locator('[data-region="plan-about"]')).toContainText('Your plan runs 33 years, from April 2027 to age 90.');
    expect(await page.evaluate((k) => sessionStorage.getItem(k), GUEST_KEY)).toBe(stored);
  });
});
