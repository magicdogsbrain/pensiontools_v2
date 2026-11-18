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
 *   held outside the ladder 86,000 + 500 = 86,500 at today's value
 *   what arrives, held to the day each gilt pays (round 3: what Your plan's mix sets against the need):
 *     3¾% 2027, 28,056 units, 7 Mar 2027: coupons Sep 2026, Mar 2027: 28,056 + 2 × 526.05 = 29,108
 *     0 1/8% 2028, 30,459 units, 31 Jan 2028: four coupons from Jul 2026: 30,459 + 4 × 19.04 = 30,535
 *     0½% 2029, 31,823 units, 31 Jan 2029: six coupons from Jul 2026: 31,823 + 6 × 79.56 = 32,300
 *     500 + 29,108 + 30,535 + 32,300 = 92,443, against 85,000: 7,443 more
 *   the timing                June 2026 to February 2027, 9 × 2,500 = 22,500, is due before the 2027 gilt pays on 7 March
 *                           2027, and the pension holds £500 of cash
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
import { cashYearsNeed, heldOutside, againstNeed, paysAtMaturity } from './hand/held.js';
import { monthsLeftInTaxYear } from './hand/dates.js';
import { readFileSync } from 'node:fs';

const VERSION = JSON.parse(readFileSync(new URL('../../package.json', import.meta.url), 'utf8')).version;
const ROUTE = { path: 'a ladder locked 10 Apr 2026, holdings pasted, April and May recorded > 20 Jun 2026: home > Your plan\'s mix > What you hold > Month by month, both views', who: 'signed in', today: '20 Jun 2026', asked: 'whether the next few years are paid for, holding gilts instead of the plan\'s cash' };
const NEVER_HERE = ['Tell the broker', 'Instruct the broker', 'Nothing is sold', 'cash years bucket', 'not covered', 'not yet covered', 'runs short', 'Not kept', 'is not placed in the mix yet', 'and it counts', 'Not counted in the mix', 'check the last maturity landed', 'Keep it in a money-market fund', 'already in cash'];

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
        // round 3 (walker 7): the page opens on its one line, and the cash years are one dated table of what is due against
        // what arrives, each gilt on the day it pays with its interest
        const [g27, g28, g29] = ALEX64.ordinaryGilts;
        const arrives = ALEX64.cash + paysAtMaturity(g27.units, 3.75, 2) + paysAtMaturity(g28.units, 0.125, 4) + paysAtMaturity(g29.units, 0.5, 6);
        const one = t.indexOf('In one line:'), gilts = t.indexOf('The gilts your plan pays from');
        const firstLines = one >= 0 ? t.slice(one, one + 300) : t.slice(Math.max(0, gilts - 300), gilts);
        q.reach('Your plan\'s mix opens on its one line, before the gilts: every gilt held, and the cash years paid by what is held', one >= 0 && one < gilts && /^In one line: all \d+ of your plan’s gilts are held, and what you hold pays your cash years/.test(firstLines), { did: firstLines.replace(/\n+/g, ' / ').slice(0, 300) });
        q.reach(`what arrives by the end of the cash years, £${arrives.toLocaleString('en-GB')}, £${againstNeed(arrives, need).spare.toLocaleString('en-GB')} more than they need`, moneyAll(t).includes(arrives) && moneyAll(t).includes(againstNeed(arrives, need).spare), { byHand: '500 + 29,108 + 30,535 + 32,300 = 92,443; 92,443 − 85,000 = 7,443' });
        const gap = (monthsLeftInTaxYear('2026-06') - 1) * monthly(ALEX64.yearly);
        q.reach(`the one difference in timing: £${gap.toLocaleString('en-GB')} due June 2026 to February 2027, before the 2027 gilt pays on 7 March 2027`, t.includes(`£${gap.toLocaleString('en-GB')} is due June 2026 to February 2027, before 3¾% Treasury Gilt 2027 pays on 7 March 2027`), { byHand: '9 × 2,500 = 22,500 (June to February; the March payment comes after the gilt pays)' });
        q.reach('the cash years are one dated table: when money is due, and when it arrives', t.includes('Due from the plan’s cash') && t.includes('Arrives in your pension'), { did: 'no dated table' });
      }
      if (name === 'month') {
        q.reach(`this month: £2,500 before tax, £${pounds(tax)} tax, £${pounds(2500 - tax).toLocaleString('en-GB')} after`, moneyAll(t).includes(2500) && moneyAll(t).includes(pounds(tax)) && moneyAll(t).includes(pounds(2500 - tax)), { byHand: `(30,000 − 12,570) × 0.2 ÷ 12 = ${tax.toFixed(2)}; 2,500 − ${tax.toFixed(2)} = ${(2500 - tax).toFixed(2)}` });
        // the source line, the one line under the heading (round 3: the sentence under it now names the next money in)
        const where = (t.split('Where it comes from')[1] || '').split('\n').filter((l) => l.trim()).slice(0, 1).join('\n');
        q.reach('where this month comes from says £2,500, the month\'s own figure', moneyAll(where).length > 0 && moneyAll(where).every((v) => v === 2500 || v === ALEX64.cash), { did: `"${where.replace(/\n+/g, ' / ').slice(0, 160)}"` });
        // round 3 (walker 7, decision 6): £500 of cash is less than the month, so the page says where the money can come from
        const next = paysAtMaturity(ALEX64.ordinaryGilts[0].units, 3.75, 2);
        q.reach(`this month is not in cash, and the next money in is the 2027 gilt: £${next.toLocaleString('en-GB')} on 7 March 2027`, t.includes(`Your pension’s cash is £${ALEX64.cash}, so this month’s £2,500 is not in cash. The next money into your pension is 3¾% Treasury Gilt 2027: £${next.toLocaleString('en-GB')} on 7 March 2027.`), { byHand: '28,056 + 2 × 526.05 = 29,108' });
      }
      q.never(`simple ${name}`, [...NEVER_HERE.filter((w) => t.includes(w)), ...(await neverOnAnyPage(p))]);
    }
    for (const name of ['transition', 'monthly entry']) {
      if (!(await q.step(`the full view, ${name}`, () => fullPage(p, name)))) continue;
      // the ladder box's month (round 3: "The plan pays", what the plan's rule does, never "Tell the broker to pay")
      await expect(p.getByText(name === 'transition' ? 'Your cash years' : 'The plan pays').first()).toBeVisible({ timeout: 30_000 });
      const t = await p.locator('body').innerText();
      if (name === 'transition') {
        // walker 7: the tab opened on a 24-row form; the reading is first now, and the form is below it
        const at = (s) => t.toLowerCase().indexOf(s.toLowerCase());   // a table's headings are drawn in capitals
        q.reach('the full view\'s mix tab opens on the reading, What you hold below it', at('In one line:') > -1 && at('In one line:') < at('Ticker / gilt code'), { did: `"In one line" at ${at('In one line:')}, the form at ${at('Ticker / gilt code')}` });
      }
      q.never(`full view ${name}`, NEVER_HERE.filter((w) => t.includes(w)));
      if (name === 'monthly entry') {
        const box = /The plan pays\s*£([\d,]+) \/ month/.exec(t);
        q.exact('the ladder box\'s month, beside the £2,500 the plan pays', box ? Number(box[1].replace(/,/g, '')) : null, 2500, { byHand: '(30,000 − 2 × 2,500) ÷ 10 months = 2,500' });
      }
    }
    await p.context().close();
  });
});
