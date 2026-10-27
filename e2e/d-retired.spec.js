/**
 * "I'm retired. Will it last?" — question D (research/v7/answer-D.md; road-to-7.md step 7), on the PUBLISHED build, without
 * an account, every request outside the site stopped (nothing signs in, no account is touched):
 *   - the front door's D line opens D's one form; the five things typed (the tax-free part one tap); "Will it last?";
 *   - the answer: the verdict at what you take, the band in full, every figure the engine's own in Node for the same
 *     figures; the retired rules on every screen (no countdown, no "when you retire");
 *   - the levers, tried on the answer's own lives: "What if shares fell by a fifth?" on a press, "Would some work help?" with
 *     £15,000 a year for 3 years — each the engine's own figures; put away, the answer is as it was;
 *   - "Keep this as a plan": the preview makes the plan itself, in this window: ONE plan in sessionStorage, the planner's
 *     own shape, named as typed, with "Lock this plan?" leading to the new plan's lock step, and "Your plans" showing it;
 *   - without an account, the free time used up: the keep is refused with the editing steps' words, nothing written;
 *   - no figure in any address at any point.
 * The household is made up (the design's worked example, round figures).
 */
import { test, expect, v7, PROD, FIXED_NOW, TODAY, FINAL_ENV } from './helpers/app.js';
import { SCHEMA_D } from '../src/answers/d/schema.js';
import { answerD } from '../src/answers/d/answer.js';
import { parseDraft } from '../src/answers/shared/validate.js';
import { suggestedPlanName } from '../src/answers/shared/planName.js';
import { checkSeed } from '../src/services/PlanSeed.js';
import { seedProblems } from '../src/answers/keep/planSeed.js';
import { KEEP } from '../src/v7/copy/keep.js';
import { D } from '../src/v7/copy/d.js';
import { GUEST_ALLOWANCE_MINUTES, KEY_MINUTES } from '../src/services/GuestMeter.js';

test.use({ outside: 'block' });

const GUEST_KEY = 'pt_guest_scenarios';
const OWN_KEYS = new Set(['pt_v7_draft', 'pt_lastActivity', 'pt_open_place', 'pt_open_plan', 'pt_guest_minutes', 'pt_guest_nag_level', 'pt_activeScenarioId', 'pt_guest_handoff', 'pt_lastSeenVersion']);   // pt_lastSeenVersion: What's new marks a first visit seen (6.44.0)
/** The design's worked example (answer-D.md 1): 68, £300,000 left, the tax-free part not had, £40,000 of savings, £2,100 a month. */
const TYPED = { 'you.age': '68', 'you.pot': '300000', 'you.taxFreeTaken': 'no', savings: '40000', 'spend.amount': '2100' };
const plain = (t) => String(t).replace(/[’‘]/g, "'").replace(/\s+/g, ' ').trim();
const RETIRED_WORDS = /when you retire|until you retire|when you stop work|years to go|months to go|plan starts|countdown|to retirement/i;

/** The answer Node gives for what was typed, with the levers as set (the same parseDraft and env the page uses). */
function engine(typed, env = FINAL_ENV) {
  const parsed = parseDraft(SCHEMA_D, typed, { today: TODAY });
  if (!parsed.ok) throw new Error('the typed figures do not parse: ' + JSON.stringify(parsed.errors));
  return answerD(parsed.inputs, { ...env, trace: false });
}
/** Every address the page went to, and every request it made. */
function addresses(page) {
  const seen = [];
  page.on('framenavigated', (f) => { if (f === page.mainFrame()) seen.push(f.url()); });
  page.on('request', (r) => seen.push(r.url()));
  return seen;
}
const storedPlans = (page) => page.evaluate((k) => JSON.parse(sessionStorage.getItem(k) || '[]'), GUEST_KEY);

test.describe('D — "I\'m retired. Will it last?"', () => {
  test('the form, the answer, the levers, "Keep this as a plan" in this window, "Lock this plan?" to the lock step', async ({ page }) => {
    test.setTimeout(420_000);
    const seen = addresses(page);
    const app = v7(page, 'prod', 'd');
    let answer = null;

    await app.step('the front door: D opens its own form', async () => {
      await app.open('#/');
      await app.ready();
      await expect(app.id('front.q.d')).toHaveAttribute('href', '#/d/numbers');
      await app.click('front.q.d');
      await app.at('d.numbers');
      await expect(page.locator('#app h1')).toHaveText(D.steps.numbers.label);
      await expect(app.id('d.stopped.yes')).toBeChecked();
      await expect(app.id('d.wayIn')).toHaveCount(0);                                   // no plan in this window yet
      expect(await page.locator('#app').innerText()).not.toMatch(RETIRED_WORDS);
    });

    await app.step('the five things, the tax-free part one tap; "Will it last?"', async () => {
      await app.fill(TYPED);
      await app.click('d.action.show');
      await app.at('d.answer');
      await app.ready(120_000);
      answer = engine(app.typed);
      expect(answer.status).toBe('ok');
    }, { answer: () => answer });

    await app.step('the answer: the verdict at what you take, the band in full, every figure the engine\'s own', async () => {
      const band = page.locator('#app section[data-headline="verdict"] [data-verdict]');
      await expect(band).toHaveAttribute('data-verdict', answer.verdict);
      expect(plain(await band.innerText())).toContain(plain(answer.sentences.head.text));
      await expect(page.locator('#app [data-sentence="verdict"]')).toHaveText(answer.sentences.line.text);
      await expect(app.id('d.answer.headroom')).toHaveText(answer.sentences.headroom.text);
      await expect(app.id('d.answer.headroom')).toHaveAttribute('data-headroom', answer.headroom.kind);
      await expect(app.id('d.more')).toContainText(answer.sentences.middling.text);
      await expect(page.locator('[data-key="monthly.careful"]').first()).toHaveAttribute('data-value', String(answer.monthly.careful));
      await expect(page.locator('#app h1')).toHaveText(D.steps.answer.label);
      expect(await page.locator('#app').innerText()).not.toMatch(RETIRED_WORDS);
      // the levers are off: nothing was run for them
      await expect(app.id('d.lever.work')).toHaveAttribute('data-lever-on', '0');
      await expect(app.id('d.lever.fall')).toHaveAttribute('data-lever-on', '0');
      expect(answer.work).toBe(null);
      expect(answer.fall).toBe(null);
    }, { answer: () => answer });

    await app.step('"What if shares fell by a fifth?": one press, the engine\'s own figures on the same lives', async () => {
      await app.id('d.lever.fall.try').scrollIntoViewIfNeeded();
      await app.click('d.lever.fall.try');
      app.typed['fall.has'] = true;
      await app.ready(120_000);
      answer = engine(app.typed);
      expect(answer.fall).not.toBe(null);
      await expect(app.id('d.lever.fall')).toHaveAttribute('data-lever-on', '1');
      await expect(app.id('d.fall.result')).toContainText(answer.sentences.fall.text);
      await expect(page.locator('[data-key="fall.monthly.careful"]').first()).toHaveAttribute('data-value', String(answer.fall.monthly.careful));
      expect(answer.fall.lasted).toBeLessThanOrEqual(answer.lasted);
    }, { answer: () => answer });

    await app.step('"Would some work help?": £15,000 a year for 3 years — the engine\'s own figures, year by year', async () => {
      await app.id('d.try.work.yearly').fill('15,000');
      await app.id('d.try.work.years').fill('3');
      await app.click('d.lever.work.try');
      app.typed['work.has'] = true; app.typed['work.yearly'] = '15,000'; app.typed['work.years'] = '3';
      await app.ready(120_000);
      answer = engine(app.typed);
      expect(answer.work).not.toBe(null);
      await expect(app.id('d.lever.work')).toHaveAttribute('data-lever-on', '1');
      await expect(app.id('d.work.result')).toContainText(answer.sentences.work.text);
      expect(await app.id('d.work.result').locator('.work-rows li').count()).toBe(answer.work.byYears.length);
      expect(answer.work.lasted).toBeGreaterThanOrEqual(answer.lasted - 1e-9);
    }, { answer: () => answer });

    await app.step('the levers put away: the answer as it was', async () => {
      await app.click('d.lever.work.off');
      await app.click('d.lever.fall.off');
      app.typed['work.has'] = false; app.typed['fall.has'] = false;
      await app.ready(120_000);
      answer = engine(app.typed);
      expect(answer.work).toBe(null);
      expect(answer.fall).toBe(null);
      await expect(app.id('d.fall.result')).toHaveCount(0);
      await expect(app.id('d.work.result')).toHaveCount(0);
    }, { answer: () => answer });

    const suggested = suggestedPlanName('d', answer.inputs, answer);
    let made = null;
    await app.step('"Keep this as a plan": the preview makes ONE plan in this window, the planner\'s own shape, named as typed', async () => {
      const box = app.id('d.keep.name');
      await box.scrollIntoViewIfNeeded();
      await expect(box).toHaveValue(suggested);
      expect(suggested).toBe('From 68 · £2,100 a month');
      await expect(page.locator('#app [data-region="keep"] h2')).toHaveText(KEEP.title);
      expect(await storedPlans(page)).toEqual([]);
      await box.fill('Alex, 68');
      await app.click('d.action.save');
      const note = app.id('d.keep.made');
      await expect(note).toBeVisible({ timeout: 60_000 });
      await expect(note).toContainText('Kept as ‘Alex, 68’ in this browser window. Try something else and keep that too.');
      const plans = await storedPlans(page);
      expect(plans.length).toBe(1);
      made = plans[0];
      expect(made.id).toMatch(/^guest-[0-9a-z]{8}$/);
      expect(made.planDetails.name).toBe('Alex, 68');
      expect(made.isActive).toBe(true);
      expect(made.createdAt).toBe(FIXED_NOW);
      expect(made.lastModified).toBe(FIXED_NOW);
      expect(made.fromAnswer && made.fromAnswer.source).toBe('d');
      expect(made.fromAnswer.v7 && made.fromAnswer.v7.appVersion).toBeTruthy();
      expect(checkSeed(made.fromAnswer, Date.parse(FIXED_NOW)).ok).toBe(true);
      expect(seedProblems(made)).toEqual([]);
      expect(made.decisionTool.settings.locked).toBeFalsy();
      expect(made.stressTool.settings.configured).toBe(true);
      expect(made.stressTool.settings.retired).toBe(true);
      expect(made.stressTool.settings.shapeAgeNow).toBe(68);
      await expect(app.id('d.keep.lock')).toHaveAttribute('href', `#/plan/${made.id}/lock`);
      await expect(app.id('d.keep.plans')).toHaveAttribute('href', '#/plans');
      await expect(note).not.toContainText('Undo');
      await expect(app.id('d.keep.name')).toHaveValue(suggested);                      // the next try gets its own name
      // the rail says the step is done (on a phone the rail is a sheet: pulled up from its line, then closed again)
      const sheet = !(await app.id('rail.d.keep').isVisible());
      if (sheet) await app.click('rail.line');
      await expect(app.id('rail.d.keep').locator('..')).toContainText('Kept');
      if (sheet) await app.click('rail.close');
      const keys = await page.evaluate(() => ({ session: Object.keys(sessionStorage), local: Object.keys(localStorage) }));
      for (const k of [...keys.session, ...keys.local]) expect(OWN_KEYS.has(k) || k === GUEST_KEY, `a key the preview must not write: ${k}`).toBe(true);
      expect(keys.local).not.toContain('pt_v7_plan_seed');
    }, { answer: () => answer });

    await test.step('"Lock this plan?": the new plan\'s lock step; "Your plans" shows it; D\'s form now offers the plan\'s own test first', async () => {
      await app.id('d.keep.lock').click();
      await page.waitForURL((u) => new URL(u).hash === `#/plan/${made.id}/lock`);
      await expect(page.locator('#app [data-screen]')).toHaveAttribute('data-screen', 'plan.lock');
      await expect(page.getByTestId('plan.step.lock')).toBeVisible();
      await expect(page.locator('#app')).toContainText('Alex, 68');
      await page.goto(PROD + '/v7/#/plans');
      await expect(page.locator('#app [data-screen]')).toHaveAttribute('data-screen', 'plans');
      await expect(page.locator('#app')).toContainText('Alex, 68');
      await page.goto(PROD + '/v7/#/d/numbers');
      await expect(page.locator('#app [data-screen]')).toHaveAttribute('data-screen', 'd.numbers');
      const wayIn = page.getByTestId('d.wayIn');
      await expect(wayIn).toBeVisible();
      await expect(wayIn).toContainText(D.numbers.hasPlan);
      await expect(page.getByTestId(`d.wayIn.${made.id}`)).toHaveAttribute('href', `#/plan/${made.id}/lasts`);
      expect((await storedPlans(page)).length).toBe(1);                               // nothing more was written
    });

    await test.step('no figure in any address, at any point', async () => {
      for (const u of [...seen, page.url()]) {
        const url = new URL(u);
        expect(url.search, `a query string: ${u}`).toBe('');
        // a saved plan's id is the one place a digit may appear (your-plan.md 3.8); nothing typed is in any address
        if (!/^#\/plan\//.test(url.hash)) expect(/\d/.test(url.hash), `a figure in the address ${u}`).toBe(false);
        for (const f of ['300000', '300,000', '2100', '2,100', '40000']) if (!/\/assets\//.test(url.pathname)) expect(decodeURIComponent(url.pathname + url.hash), u).not.toContain(f);
      }
    });
  });

  test('without an account, the free time used up: the keep is refused in the editing steps\' words; nothing is written', async ({ page }) => {
    test.setTimeout(240_000);
    const app = v7(page, 'prod', 'd');
    await app.open('#/d/numbers');
    await app.ready();
    await page.evaluate(([k, v]) => localStorage.setItem(k, v), [KEY_MINUTES, String(GUEST_ALLOWANCE_MINUTES)]);
    await app.fill(TYPED);
    await app.click('d.action.show');
    await app.at('d.answer');
    await app.ready(120_000);
    await app.id('d.action.save').scrollIntoViewIfNeeded();
    await app.click('d.action.save');
    await expect(app.id('d.keep.problem')).toHaveText(KEEP.problems.usedUp, { timeout: 60_000 });
    await expect(app.id('d.keep.made')).toHaveCount(0);
    expect(await storedPlans(page)).toEqual([]);
    expect(new URL(page.url()).hash).toBe('#/d/answer');
  });

  test('"Not yet" under "Have you stopped work?": the box\'s own sentence points at the stop-work question; nothing is run', async ({ page }) => {
    test.setTimeout(120_000);
    const app = v7(page, 'prod', 'd');
    await app.open('#/d/numbers');
    await app.ready();
    await app.fill({ ...TYPED, stopped: 'notYet' });
    await app.click('d.action.show');
    await app.at('d.numbers');
    await expect(page.locator('[data-error-for="d.stopped"]')).toHaveText(D.fields.stopped.errors['d-still-working']);
    await expect(page.locator('#app')).toContainText('"When can I afford to stop work?"');
  });
});
