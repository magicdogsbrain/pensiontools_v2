/**
 * B2 — a couple who stop work in different years (research/v7/couples-different-years.md 9.7 B2), on the PUBLISHED
 * build, end to end: the one who has stopped fills in "When can I afford to stop work?" with "I've already stopped", sees
 * "Yes — your partner could stop at 56", saves it as a plan, and finds both plans in today's planner — each starting at
 * its own stop, both ending in the same tax year — with the Household tab saying when the partner's plan begins.
 *
 * The household is made up (round, generic figures; fixture A5): you 56, stopped and drawing, £500,000 in a pension;
 * your partner 55 with £450,000, £850 a month going in, stopping next year at 56; £60,000 of savings; £3,500 a month.
 *
 * Today's planner at / is the real one, without an account ("Carry on without an account": the plans live in this tab
 * only). Firebase is never reached: every request outside the local server is stopped (`outside: 'block'`), so nothing
 * signs in and no real account or data is touched.
 */
import { test, expect, v7, waitsFor, NEEDS, PROD, TODAY, FINAL_ENV, expectHeadlineA } from './helpers/app.js';
import { SEED_WORDS, householdStartWords } from '../src/services/PlanSeed.js';
import { SEED_VERSION } from '../src/answers/keep/planSeed.js';
import { suggestedPlanName } from '../src/answers/shared/planName.js';
import { APART } from '../src/answers/shared/household.js';

test.use({ outside: 'block' });

const CHART = { ...FINAL_ENV, detail: 'chart' };
/** As a person types it, in the order of the form (A5's household). */
const TYPED = {
  household: 'couple', 'you.age': '56', 'you.pot': '500,000', savings: '60,000', 'stop.kind': 'already',
  'partner.age': '55', 'partner.pot': '450,000', 'partner.stop.kind': 'age', 'partner.stop.age': '56', 'partner.payIn.total': '850',
  'spend.amount': '3,500'
};
const plain = (t) => String(t).replace(/[’‘]/g, "'").replace(/\s+/g, ' ').trim();

test.describe('B2 — "I\'ve already stopped": your partner\'s answer, saved as two plans that each begin at their own stop', () => {
  test('A about your partner → "Save as a plan" → today\'s planner: two linked plans, each from its own stop', async ({ page, watch }) => {
    waitsFor(...NEEDS.a);
    test.skip(!APART.askAboutPartner, 'the owner\'s switch 3 is off: A does not offer "I\'ve already stopped"');
    test.setTimeout(300_000);
    // As on the live site today: the planner's engine worker asks for the market files beside itself, where they are not,
    // and falls back to the bundled figures (e2e/old-app-unchanged.spec.js). Any OTHER missing file still fails the test.
    watch.allow(/^asked for a file that is not there: \/assets\/data\/(gilts|equity)\.json$/);
    const app = v7(page, 'prod', 'a');
    let answer = null;

    await app.step('the one who has stopped answers A: "I\'ve already stopped", your partner at 56', async () => {
      await app.open('#/a/numbers');
      await app.ready();
      await app.fill(TYPED);
      await app.click('a.action.show');
      await app.at('a.answer');
      await app.ready(120_000);
      answer = app.engine(CHART);
      expect(answer.status).toBe('ok');
      expect(answer.askedAbout).toBe('partner');
      expect(answer.headline.verdict).toBe('yes');
      await expectHeadlineA(page, answer);
      const headline = page.locator('#app section[data-headline="verdict"]');
      expect(plain(await headline.innerText())).toContain('Yes — your partner could stop at 56');
      await expect(app.id('a.answer.second')).toHaveText('You have already stopped.');
      await expect(page.locator('#app h1')).toHaveText('Could your partner stop at 56?');
    }, { answer: () => answer });

    const suggested = () => suggestedPlanName('a', answer.inputs, answer);
    await app.step('"Save this as a plan": the name suggested is the partner\'s stop', async () => {
      const box = app.id('a.keep.name');
      await box.scrollIntoViewIfNeeded();
      await expect(box).toHaveValue(suggested());
      expect(suggested()).toBe('Partner stops at 56 · £3,500 a month');
    }, { answer: () => answer });

    await test.step('today\'s planner, without an account: the name confirmed, and two plans made', async () => {
      await app.click('a.action.save');
      await page.waitForURL((u) => u.origin === PROD && !u.pathname.startsWith('/v7/'));
      await page.getByRole('button', { name: SEED_WORDS.carryOn }).click();
      await page.getByRole('button', { name: SEED_WORDS.save }).click();
      await expect(page.locator('#seedNote')).toBeVisible({ timeout: 60_000 });
      await expect(page.locator('#guestBanner')).toBeVisible();
    });

    let plans = null;
    await test.step('each plan begins at its own stop, and both end in the same tax year', async () => {
      plans = await page.evaluate(() => JSON.parse(sessionStorage.getItem('pt_guest_scenarios') || '[]'));
      const made = plans.filter((p) => p.fromAnswer);
      expect(made).toHaveLength(2);
      const yours = made.find((p) => p.fromAnswer.who === 'you');
      const theirs = made.find((p) => p.fromAnswer.who === 'partner');
      expect(yours.planDetails.name).toBe(suggested());
      expect(theirs.planDetails.name).toBe(`${suggested()} · partner`);
      expect(yours.household.partnerScenarioId).toBe(theirs.id);
      expect(yours.fromAnswer.seedVersion).toBe(SEED_VERSION);
      const Y = yours.stressTool.settings;
      const P = theirs.stressTool.settings;
      // you have stopped: your plan takes money from this tax year; your partner's begins when they stop, at 56
      expect(Y.retired).toBe(true);
      expect(Y.currentAge).toBe(56);
      expect(Y.firstTaxYear).toBe(Number(TODAY.slice(0, 4)));
      expect(P.retired).toBe(false);
      expect(P.retireAge).toBe(56);
      expect(P.currentAge).toBe(55);
      expect(P.firstTaxYear).toBe(Y.firstTaxYear + 1);
      expect(P.firstTaxYear + P.duration).toBe(Y.firstTaxYear + Y.duration);
      // the savings between you are in the plan of the one who stopped first; the answer's charge in both
      expect(Y.isaBalance).toBe(60_000);
      expect(P.isaBalance).toBe(0);
      expect(Y.chargesPct).toBe(0.5);
      expect(P.chargesPct).toBe(0.5);
      // your partner is still paying in: their plan has the saving years until they stop
      expect(theirs.accumulationTool.settings.retirementAge).toBe(56);
    });

    await test.step('the Household tab says when your partner\'s plan begins', async () => {
      await page.locator('nav.tabs .tab[data-tab="household"]').click();
      const theirs = plans.find((p) => p.fromAnswer && p.fromAnswer.who === 'partner');
      await expect(page.locator('#hhPartnerSelect')).toHaveValue(theirs.id);
      await page.getByRole('button', { name: 'Run the household check' }).click();
      const note = page.locator('#hhStartsNote');
      await expect(note).toBeVisible({ timeout: 120_000 });
      const yours = plans.find((p) => p.fromAnswer && p.fromAnswer.who === 'you');
      const want = householdStartWords({ offset: 0, firstTaxYear: yours.stressTool.settings.firstTaxYear },
        { offset: 1, firstTaxYear: theirs.stressTool.settings.firstTaxYear });
      expect(want).toContain('2027/28');
      await expect(note).toHaveText(want);
    });
  });

  /*
   * The reviewers' findings of 2 Oct 2026, in the browser: C "from now" with your partner stopping next year hands over
   * to A as "I've already stopped" (it opened as if you were still saving, the stop age empty and focused); and a press
   * on "I've already stopped" while the empty stop-age box has the keyboard chooses it at once (the box's sentence used
   * to appear between the press and its release, the options moved, and the first click chose nothing).
   */
  test('C → A: the one who has stopped comes from C\'s "What next?" and A opens as "I\'ve already stopped", nothing red', async ({ page }) => {
    waitsFor(...NEEDS.a);
    test.skip(!APART.askAboutPartner, 'the owner\'s switch 3 is off: A does not offer "I\'ve already stopped"');
    test.setTimeout(240_000);
    const app = v7(page, 'prod', 'c');
    await app.open('#/c/numbers');
    await app.ready();
    await app.fill({ 'you.pot': '500,000', 'you.age': '56', household: 'couple', 'partner.age': '55', 'partner.pot': '450,000',
      'partner.stop.kind': 'age', 'partner.stop.age': '56', savings: '60,000' });
    await app.click('c.action.show');
    await app.at('c.answer');
    await app.ready(120_000);
    await expect(app.id('c.next.working').locator('.next-prompt')).toHaveText('Your partner still working?');
    await expect(app.id('c.next.a')).toHaveText('When could my partner afford to stop?');
    await app.click('c.next.a');
    await app.as('a').at('a.numbers');
    await expect(page).toHaveURL(/#\/a\/numbers$/);
    await expect(app.id('a.stop.kind.already')).toBeChecked();
    await expect(app.id('a.partner.stop.kind.age')).toBeChecked();
    await expect(app.id('a.partner.stop.age')).toHaveValue('56');
    await expect(page.locator('#app [data-error-for]')).toHaveCount(0);
  });

  test('A: a press on "I\'ve already stopped" with the empty stop-age box focused chooses it at once — nothing moves under it', async ({ page }) => {
    waitsFor(...NEEDS.a);
    test.skip(!APART.askAboutPartner, 'the owner\'s switch 3 is off: A does not offer "I\'ve already stopped"');
    const app = v7(page, 'prod', 'a');
    await app.open('#/a/numbers');
    await app.ready();
    await app.fill({ household: 'couple', 'you.age': '56', 'you.pot': '500,000', 'partner.age': '55', 'partner.pot': '450,000' });
    await app.go('#/a/numbers?focus=stop.age');
    await expect(app.id('a.stop.age')).toBeFocused();
    await expect(app.id('a.stop.age')).toHaveValue('');
    const label = page.locator('label[for="a.stop.kind.already"]');
    await label.scrollIntoViewIfNeeded();
    const before = await label.boundingBox();
    // as a hand does it: down, the page draws whatever the press set off (two frames), up
    await page.mouse.move(before.x + 10, before.y + before.height / 2);
    await page.mouse.down();
    await page.evaluate(() => new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done))));
    const during = await label.boundingBox();
    await page.mouse.up();
    expect(during).toEqual(before);
    await expect(app.id('a.stop.kind.already')).toBeChecked();
    await expect(page.locator('[data-error-for="a.stop.age"]')).toHaveCount(0);
  });
});
