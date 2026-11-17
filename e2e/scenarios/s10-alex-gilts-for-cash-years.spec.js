/**
 * s10 · Alex, 64 · L9, L10, L11, L12 · ordinary gilts bought for the years the plan pays from cash · HOLD, MONTH   @phone
 *
 * Alex lives on an index-linked gilt ladder locked on 10 April 2026: £30,000 a year, the tax-free cash already taken,
 * 2026/27 to 2028/29 paid from cash. Alex holds every ladder gilt at the plan's units (two a little above them) and, instead
 * of the cash, three ordinary gilts worth £86,000 today (maturing March 2027, January 2028 and January 2029) and £500 in
 * cash. April and May are recorded. On 20 June 2026 Alex opens the home, Your plan's mix, What you hold and Month by
 * month, in both views. Worked by hand:
 *   taken so far            2 × 30,000 ÷ 12 = 5,000; the plan said 5,000
 *   this month              2,500 before tax; (30,000 − 12,570) × 0.2 ÷ 12 = 290.50 tax; 2,209.50 after (the site says
 *                           money to the pound, as every scenario reads it: £291 and £2,210)
 *   the cash years' need    June 2026 to March 2027 is 10 months: 10 × 2,500 + 30,000 + 30,000 = 85,000 to April 2029
 *   held outside the ladder 86,000 + 500 = 86,500 at today's value: 1,500 more than those years need
 *
 * The route, as a person takes it: on 10 April the full view's set-up as already drawing, Stress settings with the full
 * index-linked gilt ladder, £485,000 and three years from cash, Save, Lock; the plan's units read off its order sheet; on
 * 30 April the platform's table pasted on What you hold and April recorded in the Decision tool; on 29 May May recorded;
 * on 20 June the pages read. Each date is a visit of its own (a new browser, signed in again).
 */
import { test, expect } from '@playwright/test';
import { ask } from './ask.js';
import { accountFor, made } from './account.js';
import { at, signIn, planPage, settled, fullPage, comeBack, planAddress } from './routes.js';
import { visibleText, moneyAll, neverOnAnyPage, takenAgainstPlan } from './read.js';
import { fullViewDrawing, stressLadder, lockFromStressSettings, orderSheet, pasteHoldings, monthlyEntry, saveMonth } from './made.js';
import { knownUnanswered } from './known.js';
import { ALEX64 } from './people.js';
import { monthly, months, monthlyTaxAllTaxable, pounds } from './hand/money.js';
import { cashYearsNeed, heldOutside, againstNeed } from './hand/held.js';
import { monthsLeftInTaxYear } from './hand/dates.js';
import { readFileSync } from 'node:fs';

const VERSION = JSON.parse(readFileSync(new URL('../../package.json', import.meta.url), 'utf8')).version;
const ROUTE = { path: 'a ladder locked 10 Apr 2026, holdings pasted, April and May recorded > 20 Jun 2026: home > Your plan\'s mix > What you hold > Month by month, both views', who: 'signed in', today: '20 Jun 2026', asked: 'whether the next few years are paid for, holding gilts instead of the plan\'s cash' };
const NEVER_HERE = ['not covered', 'not yet covered', 'runs short', 'Not kept', 'is not placed in the mix yet', 'and it counts', 'Not counted in the mix', 'check the last maturity landed', 'Keep it in a money-market fund', 'already in cash'];

/** What Alex's platform lists: each plan gilt at the plan's units (two above), the three ordinary gilts, the cash. */
function platformTable(orders) {
  const rows = [['Name', 'SEDOL', 'Units', 'Value']];
  for (const o of orders) {
    const units = o.units + (ALEX64.above[o.code] || 0);
    rows.push([o.name, o.sedol, units.toLocaleString('en-GB'), '£' + Math.round(units * 1.4).toLocaleString('en-GB')]);   // the platform's own price
  }
  for (const g of ALEX64.ordinaryGilts) rows.push([g.name, '', g.units.toLocaleString('en-GB'), '£' + g.value.toLocaleString('en-GB')]);
  rows.push(['Cash', '', '', '£' + ALEX64.cash]);
  return { text: rows.map((r) => r.join('\t')).join('\n'), total: rows.slice(1).reduce((s, r) => s + Number(r[3].replace(/[£,]/g, '')), 0) };
}

test('s10 · Alex, 64, holds ordinary gilts for the cash years: paid for, said once @phone', async ({ page, browser }) => {
  knownUnanswered('s10');
  test.setTimeout(420_000);
  const me = await made(accountFor(ALEX64), { lastSeenVersion: VERSION });
  await ask(ALEX64, 'L11', ROUTE, async (q) => {
    await at(page, '2026-04-10T10:00:00.000Z');
    await q.step('sign in, 10 April 2026', () => signIn(page, me));
    await q.step('the full view\'s set-up: already drawing', () => fullViewDrawing(page, { name: 'Alex', age: ALEX64.age }));
    // the income is typed as Alex's own (7.12.0: a new plan's income box starts empty; the factory £30,000 is nobody's)
    await q.step('Stress settings: the full index-linked gilt ladder, £485,000, £30,000 a year, three years from cash, Save', () => stressLadder(page, { pension: ALEX64.pot, cashYears: ALEX64.cashYearsDial, steps: [{ amount: ALEX64.yearly }] }));
    await q.step('lock from Stress settings', () => lockFromStressSettings(page));
    const orders = (await q.step('the plan\'s units, read off its order sheet', () => orderSheet(page))) || [];
    q.reach('the order sheet\'s gilts read off the plan document', orders.length > 0, { did: 'no gilt rows on the order sheet' });
    const planId = await q.step('the plan, in the simple view', async () => { await page.getByRole('link', { name: /Back to the simple view/ }).first().click(); await page.waitForURL((u) => /#\/plan\//.test(u.hash), { timeout: 30_000 }); return planAddress(page).planId; });

    // 30 April: the platform's table pasted, then April recorded
    const table = platformTable(orders);
    let p = await comeBack(browser, page, '2026-04-30T15:00:00.000Z');
    await q.step('sign in, 30 April 2026', () => signIn(p, me));
    await q.step('What you hold: the platform\'s table pasted', () => pasteHoldings(p, planId, table.text));
    await q.step('April recorded in the Decision tool', async () => { await monthlyEntry(p, { month: '2026-04', pension: table.total, isa: 0, cash: ALEX64.cash }); await saveMonth(p); });
    await p.context().close();
    // 29 May: May recorded
    p = await comeBack(browser, page, '2026-05-29T15:00:00.000Z');
    await q.step('sign in, 29 May 2026', () => signIn(p, me));
    await q.step('May recorded in the Decision tool', async () => { await monthlyEntry(p, { month: '2026-05', pension: table.total - 2500, isa: 0, cash: ALEX64.cash }); await saveMonth(p); });
    await p.context().close();

    // 20 June: what Alex reads
    p = await comeBack(browser, page, '2026-06-20T10:00:00.000Z');
    await q.step('sign in, 20 June 2026', () => signIn(p, me));
    await q.step('the home', async () => { await planPage(p, planId, 'home'); await settled(p).catch(() => {}); });
    const home = await visibleText(p);
    const line = takenAgainstPlan(home);
    const two = months(2, monthly(ALEX64.yearly));
    q.exact('taken in April and May', line ? line.taken : null, two, { byHand: '2 × 2,500' });
    q.exact('what the plan said for April and May', line ? line.said : null, two, { byHand: '2 × 2,500' });
    q.reach('every gilt of the plan held, on the home', /(\d+) of \1 gilts held/.test(home), { did: home.split('\n').find((l) => /gilts (held|bought)/.test(l)) || 'no count of the gilts held' });
    q.never('the home', [...NEVER_HERE.filter((w) => home.includes(w)), ...(await neverOnAnyPage(p))]);
    const need = cashYearsNeed({ monthsLeft: monthsLeftInTaxYear('2026-06'), perMonth: monthly(ALEX64.yearly), laterYears: [ALEX64.yearly, ALEX64.yearly] });
    const held = heldOutside([ALEX64.ordinaryGiltsToday, ALEX64.cash]);
    const tax = monthlyTaxAllTaxable(ALEX64.yearly);
    for (const name of ['move', 'hold', 'month']) {
      await q.step(`simple ${name}`, async () => { await planPage(p, planId, name); await settled(p).catch(() => {}); });
      const t = await visibleText(p);
      if (name === 'move') {
        q.reach('all the plan\'s gilts held, on Your plan\'s mix', /All \d+ of your plan’s gilts are held/.test(t), { did: 'no line saying every gilt is held' });
        q.reach(`the cash years' need, £${need.toLocaleString('en-GB')}`, moneyAll(t).includes(need), { byHand: '10 × 2,500 + 30,000 + 30,000 = 85,000' });
        q.reach(`held outside the ladder, £${held.toLocaleString('en-GB')}, £${againstNeed(held, need).spare.toLocaleString('en-GB')} more than needed`, moneyAll(t).includes(held) && moneyAll(t).includes(againstNeed(held, need).spare), { byHand: '86,000 + 500 = 86,500; 86,500 − 85,000 = 1,500' });
      }
      if (name === 'month') {
        q.reach(`this month: £2,500 before tax, £${pounds(tax)} tax, £${pounds(2500 - tax).toLocaleString('en-GB')} after`, moneyAll(t).includes(2500) && moneyAll(t).includes(pounds(tax)) && moneyAll(t).includes(pounds(2500 - tax)), { byHand: `(30,000 − 12,570) × 0.2 ÷ 12 = ${tax.toFixed(2)}; 2,500 − ${tax.toFixed(2)} = ${(2500 - tax).toFixed(2)}` });
        const where = (t.split('Where it comes from')[1] || '').split('\n').filter((l) => l.trim()).slice(0, 3).join('\n');
        q.reach('where this month comes from says £2,500, the month\'s own figure', moneyAll(where).length > 0 && moneyAll(where).every((v) => v === 2500 || v === ALEX64.cash), { did: `"${where.replace(/\n+/g, ' / ').slice(0, 160)}"` });
      }
      q.never(`simple ${name}`, [...NEVER_HERE.filter((w) => t.includes(w)), ...(await neverOnAnyPage(p))]);
    }
    for (const name of ['transition', 'monthly entry']) {
      if (!(await q.step(`the full view, ${name}`, () => fullPage(p, name)))) continue;
      await expect(p.getByText(name === 'transition' ? 'Your cash years' : 'Tell the broker to pay').first()).toBeVisible({ timeout: 30_000 });
      const t = await p.locator('body').innerText();
      q.never(`full view ${name}`, NEVER_HERE.filter((w) => t.includes(w)));
      if (name === 'monthly entry') {
        const box = /Tell the broker to pay\s*£([\d,]+)/.exec(t);
        q.exact('the ladder box\'s month, beside the £2,500 the plan pays', box ? Number(box[1].replace(/,/g, '')) : null, 2500, { byHand: '(30,000 − 2 × 2,500) ÷ 10 months = 2,500' });
      }
    }
    await p.context().close();
  });
});
