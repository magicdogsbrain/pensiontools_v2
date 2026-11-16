/**
 * s04 · Sam, 45 · S7, S8, R3 · a year later · SAVER, FACTS
 *
 * On 12 November 2025 Sam, then 44, makes and keeps a saving plan: £120,000 in the pension, £300 a month from take-home
 * pay and £250 from the employer, pay £52,000, stopping at 65 on £2,400 a month. On 16 November 2026 Sam comes back,
 * checks in with the pot at £131,000 and the new pay, £55,000. Worked by hand:
 *   paid in over the year     625 × 12 = 7,500 (375 from Sam with the tax added back, 250 from the employer)
 *   markets and the rest      131,000 − 120,000 − 7,500 = 3,500
 *   the pay rise              55,000 − 50,270 = 4,730 of pay in the 40% band; 375 × 12 = 4,500 going in from Sam;
 *                             20% × 4,500 = 900 a year of extra relief to claim
 */
import { test } from '@playwright/test';
import { ask } from './ask.js';
import { accountFor } from './account.js';
import { signIn, comeBack, planPage, settled, fullPage, closeNews } from './routes.js';
import { visibleText, money, neverOnAnyPage } from './read.js';
import { samAYearAgo } from './made.js';
import { knownUnanswered } from './known.js';
import { SAM45 } from './people.js';
import { goingIn, months, higherRateClaim } from './hand/money.js';

const ROUTE = { path: '12 Nov 2025: Am I saving enough? > Keep > make an account > pay £52,000 > 16 Nov 2026: the home > review > pot £131,000, pay £55,000 > check in > About, Your plan, What you pay in, full view Accumulation', who: 'signed in', asked: 'a year on, whether the plan is still on course after a pay rise' };
const grab = (re, text) => { const m = re.exec(text); return m ? money(m[1]) : null; };
const box = async (page, sel) => { const b = page.locator(sel).first(); return (await b.count()) && (await b.isVisible()) ? money(await b.inputValue()) : null; };

test('s04 · Sam comes back a year later, checks in with £131,000 and a pay rise to £55,000', async ({ page, browser }) => {
  knownUnanswered('s04');
  test.setTimeout(300_000);
  const me = accountFor(SAM45);
  await ask(SAM45, 'S7', ROUTE, async (q) => {
    const planId = await q.step('a year ago: the plan made and kept', () => samAYearAgo(page, me));
    await page.context().close();
    const later = await comeBack(browser, page, '2026-11-16T10:00:00.000Z');
    await q.step('a year later: sign in', () => signIn(later, me));
    await q.step('the plan\'s home', async () => { await planPage(later, planId, 'home'); await settled(later).catch(() => {}); });
    await q.step('Review now', async () => { await closeNews(later); await later.getByTestId('plan.home.review.now').click(); });
    await q.step('the check-in: pot £131,000, pay £55,000', async () => {
      await later.getByTestId('plan.checkin.ci.pension').fill(String(SAM45.potLater));
      const isa = later.getByTestId('plan.checkin.ci.isa');
      if (await isa.isVisible().catch(() => false) && (await isa.inputValue()) === '') await isa.fill('0');
      const pay = later.getByTestId('plan.checkin.ci.pay');
      if (await pay.isVisible().catch(() => false)) await pay.fill(String(SAM45.payLater));
      else q.fail({ must: 'a box for the new pay on the check-in', did: 'no pay box on the check-in', says: 'could not tell the check-in about the pay rise', owner: 'SAVER' });
      await later.getByTestId('plan.checkin.submit').click();
      await later.getByTestId('plan.checkin.result').waitFor({ timeout: 120_000 });
      await settled(later).catch(() => {});
    });
    const result = await visibleText(later);
    const paidIn = months(12, goingIn(SAM45.fromTakeHome) + SAM45.employer);
    q.exact('what was paid in since the last check-in', grab(/paid in £([\d,]+)/i, result), paidIn, { byHand: '625 × 12 = 7,500', owner: 'SAVER' });
    q.exact('what markets and the rest added', grab(/markets[^£\n]*\+?£([\d,]+)/i, result), SAM45.potLater - SAM45.pot - paidIn, { byHand: '131,000 − 120,000 − 7,500 = 3,500', owner: 'SAVER' });
    const relief = higherRateClaim(SAM45.payLater, 12 * goingIn(SAM45.fromTakeHome));
    const reliefLine = /£([\d,]+)[^.\n]*(?:relief|claim)|(?:relief|claim)[^.\n]*£([\d,]+)/i.exec(result);
    q.exact('the extra tax relief a year Sam can claim after the rise', reliefLine ? money(reliefLine[1] || reliefLine[2]) : null, relief, { byHand: '55,000 − 50,270 = 4,730 in the 40% band; 375 × 12 = 4,500 going in; 20% × 4,500 = 900', owner: 'SAVER' });
    q.never('the check-in', /Past your line at your last two reviews/i.test(result) ? ['Past your line at your last two reviews'] : [], { must: 'no "last two reviews" when the first was the day the plan was made', owner: 'SAVER' });

    // age 45 and £131,000 today on every page, both views; the pay £55,000
    const ages = []; const pots = []; const pays = []; const stale = [];
    for (const name of ['about', 'plan', 'saving', 'home']) {
      await q.step(`simple ${name}`, async () => { await planPage(later, planId, name); await settled(later).catch(() => {}); });
      const t = await visibleText(later);
      ages.push({ where: `simple ${name}`, value: (await box(later, '[id="plan.about.age"]')) ?? grab(/(?:^|\n)(?:Your age|Age)(?: now| today)?:\s*(\d+)/i, t) ?? grab(/\byou are (\d+)\b(?! when)/i, t) ?? grab(/From age (\d+) to age/, t) });
      pots.push({ where: `simple ${name}`, value: grab(/(?:pot|pension)[^£\n]*£([\d,]+)[^\n]*today|£([\d,]+) today/i, t) ?? (await box(later, '[id="plan.saving.potNow"]')) });
      if (name === 'saving') pays.push({ where: 'simple What you pay in', value: await box(later, '[id="plan.saving.salary"]') });
      for (const w of ['£120,000 today', 'age 44', 'you are 44']) if (t.includes(w)) stale.push(`${w} (simple ${name})`);
      q.never(`simple ${name}`, await neverOnAnyPage(later));
    }
    await q.step('the full view, Accumulation', () => fullPage(later, 'accumulation'));
    ages.push({ where: 'full view accumulation', value: await box(later, '#acAge') });
    pots.push({ where: 'full view accumulation', value: await box(later, '#acPotNow') });
    pays.push({ where: 'full view accumulation', value: await box(later, '#acSalary') });
    q.same('Sam\'s age today', ages, { want: SAM45.age, owner: 'FACTS' });
    q.same('the pot today', pots, { want: SAM45.potLater, owner: 'FACTS' });
    q.same('Sam\'s pay', pays, { want: SAM45.payLater, everywhere: true, owner: 'SAVER' });
    q.never('the plan\'s pages', stale, { must: 'never 44 or £120,000 as today', owner: 'FACTS' });

    // R3: the home states the pot against the plan's path in pounds, and what Sam could spend
    await q.step('the home again', async () => { await planPage(later, planId, 'home'); await settled(later).catch(() => {}); });
    const home = await visibleText(later);
    q.reach('the pot against the plan\'s path, in pounds, on the home', /£[\d,]+[^\n]*(?:path|line|on course)/i.test(home) || /(?:path|line)[^\n]*£[\d,]+/i.test(home), { did: 'no pounds against the plan\'s path on the home', owner: 'SAVER' });
    const homeCould = grab(/could spend £([\d,]+) a month/, home);
    q.same('what Sam could spend a month', [{ where: 'home', value: homeCould }, { where: 'the check-in', value: grab(/could spend £([\d,]+) a month/, result) }], { everywhere: true, owner: 'SAVER' });
  });
});
