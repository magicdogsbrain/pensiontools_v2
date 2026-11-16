/**
 * s10 · Alex, 64 · L9, L10, L11, L12 · ordinary gilts bought for the years the plan pays from cash · HOLD, MONTH   @phone
 *
 * Alex lives on an index-linked gilt ladder locked on 10 April 2026: £30,000 a year, the tax-free cash already taken,
 * 2026/27 to 2028/29 paid from cash. Alex holds every ladder gilt at the plan's units and, instead of the cash, three
 * ordinary gilts worth £86,000 today (maturing March 2027, January 2028 and January 2029) and £500 in cash. April and May
 * are recorded. On 20 June 2026 Alex opens the home, Your plan's mix, What you hold and Month by month, in both views.
 * Worked by hand:
 *   taken so far            2 × 30,000 ÷ 12 = 5,000; the plan said 5,000
 *   this month              2,500 before tax; (30,000 − 12,570) × 0.2 ÷ 12 = 290.50 tax; 2,209.50 after
 *   the cash years' need    June 2026 to March 2027 is 10 months: 10 × 2,500 + 30,000 + 30,000 = 85,000 to April 2029
 *   held outside the ladder 86,000 + 500 = 86,500 at today's value: 1,500 more than those years need
 *
 * NOT WALKED YET: the plan is made on the screen with the clock at 10 April 2026 (the full view's set-up as already
 * drawing, the ladder chosen and locked), April and May recorded with the clock moved, and the holdings pasted with the
 * plan's own units read off its order sheet. Those presses are not yet found for this build; until they are, the
 * scenario is listed but does not run (fixme, with this reason).
 */
import { test } from '@playwright/test';
import { ask } from './ask.js';
import { accountFor, made } from './account.js';
import { at, signIn, planPage, settled, fullPage } from './routes.js';
import { visibleText, money, moneyAll, neverOnAnyPage } from './read.js';
import { knownUnanswered } from './known.js';
import { ALEX64 } from './people.js';
import { monthly, months, monthlyTaxAllTaxable } from './hand/money.js';
import { cashYearsNeed, heldOutside, againstNeed } from './hand/held.js';
import { monthsLeftInTaxYear } from './hand/dates.js';

const ROUTE = { path: 'a ladder locked 10 Apr 2026, April and May recorded, holdings pasted > 20 Jun 2026: home > Your plan\'s mix > What you hold > Month by month, both views', who: 'signed in', today: '20 Jun 2026', asked: 'whether the next few years are paid for, holding gilts instead of the plan\'s cash' };
const NEVER_HERE = ['not covered', 'not yet covered', 'runs short', 'Not kept', 'is not placed in the mix yet', 'and it counts', 'Not counted in the mix', 'check the last maturity landed', 'Keep it in a money-market fund'];

test('s10 · Alex, 64, holds ordinary gilts for the cash years: paid for, said once @phone', async ({ page }) => {
  test.fixme(true, 'not walked yet: the ladder locked on screen in April and the holdings pasted at the plan\'s units (see the head of this file)');
  knownUnanswered('s10');
  test.setTimeout(300_000);
  const me = await made(accountFor(ALEX64));
  await ask(ALEX64, 'L11', ROUTE, async (q) => {
    await at(page, '2026-06-20T10:00:00.000Z');
    await q.step('sign in', () => signIn(page, me));
    const planId = null;   // made on the screen once the route is walked
    await q.step('the home', async () => { await planPage(page, planId, 'home'); await settled(page).catch(() => {}); });
    const home = await visibleText(page);
    const line = /£([\d,]+) taken; the plan said £([\d,]+)/.exec(home);
    const two = months(2, monthly(ALEX64.yearly));
    q.exact('taken in April and May', line ? money(line[1]) : null, two, { byHand: '2 × 2,500' });
    q.exact('what the plan said for April and May', line ? money(line[2]) : null, two, { byHand: '2 × 2,500' });
    const need = cashYearsNeed({ monthsLeft: monthsLeftInTaxYear('2026-06'), perMonth: monthly(ALEX64.yearly), laterYears: [ALEX64.yearly, ALEX64.yearly] });
    const held = heldOutside([ALEX64.ordinaryGiltsToday, ALEX64.cash]);
    for (const name of ['mix', 'hold', 'month']) {
      await q.step(`simple ${name}`, async () => { await planPage(page, planId, name); await settled(page).catch(() => {}); });
      const t = await visibleText(page);
      if (name === 'mix') {
        q.reach(`the cash years' need, £${need.toLocaleString('en-GB')}`, moneyAll(t).includes(need), { byHand: '10 × 2,500 + 30,000 + 30,000 = 85,000' });
        q.reach(`held outside the ladder, £${held.toLocaleString('en-GB')}, £${againstNeed(held, need).spare.toLocaleString('en-GB')} more than needed`, moneyAll(t).includes(held) && moneyAll(t).includes(againstNeed(held, need).spare), { byHand: '86,000 + 500 = 86,500; 86,500 − 85,000 = 1,500' });
      }
      if (name === 'month') {
        q.reach('this month: £2,500 before tax, £290.50 tax, £2,209.50 after', /2,500/.test(t) && /290\.50/.test(t) && /2,209\.50/.test(t), { byHand: `(30,000 − 12,570) × 0.2 ÷ 12 = ${monthlyTaxAllTaxable(30000).toFixed(2)}` });
        q.never('simple month by month', /already in cash/i.test(t) ? ['already in cash (while cash is £500)'] : []);
      }
      q.never(`simple ${name}`, [...NEVER_HERE.filter((w) => t.includes(w)), ...(await neverOnAnyPage(page))]);
    }
    for (const name of ['transition', 'monthly entry']) {
      if (!(await q.step(`the full view, ${name}`, () => fullPage(page, name)))) continue;
      const t = await page.locator('body').innerText();
      q.never(`full view ${name}`, NEVER_HERE.filter((w) => t.includes(w)));
    }
  });
});
