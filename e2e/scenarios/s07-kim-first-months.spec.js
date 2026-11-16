/**
 * s07 · Kim, 62 · L3, L4, L5, R5 · stopped work last month · MONTH, FACTS, VIEWS   @phone
 *
 * Kim stopped work in October 2026, with £21,000 of pay from April to October. She has £520,000 in a pension and
 * £60,000 in an ISA, the full State Pension at 67, and wants £2,400 a month after tax, a quarter of each withdrawal
 * tax-free. She asks "Will it last?", keeps it, makes an account, opens the full view, locks the plan from Stress
 * settings, records November (the tax year set up with £21,000 of pay so far) and December, then opens the simple home.
 * Worked by hand (2026/27):
 *   the plan's year       £2,400 × 12 = 28,800 after tax; a quarter tax-free: (28,800 − 2,514) ÷ 0.85 = 30,924.71 → £30,925
 *   each month's draw     30,924.71 ÷ 12 = 2,577.06 → £2,577
 *   what reaches Kim      her pay used the year's allowance: 2,577.06 − 0.75 × 2,577.06 × 0.2 = 2,190.50 → £2,191
 *   for £2,400 to reach   2,400 ÷ 0.85 = 2,823.53 → £2,824
 *   two months            2 × 2,577.06 = 5,154.12 → £5,154 taken, and the plan said the same
 */
import { test } from '@playwright/test';
import { ask } from './ask.js';
import { accountFor } from './account.js';
import { at, planPage, settled, fullPage } from './routes.js';
import { visibleText, moneyAll, money, neverOnAnyPage, figuresOn } from './read.js';
import { kimKept, lockFromStressSettings, monthlyEntry, saveMonth } from './made.js';
import { knownUnanswered } from './known.js';
import { KIM62 } from './people.js';
import { grossQuarterFree, monthly, reachesWhenAllowanceUsed, takeForWhenAllowanceUsed, months, pounds } from './hand/money.js';

const ROUTE = { path: 'Already retired: will it last? > Keep > make an account > the full view > lock from Stress settings > Monthly Entry November (pay so far £21,000) > December > the simple home', who: 'guest, then signed in', view: 'full, then simple', asked: 'what her first months are, after stopping work part-way through the tax year' };
const has = (text, n, tol = 1) => moneyAll(text).some((v) => Math.abs(v - n) <= tol);

test('s07 · Kim, 62, stopped last month: the year set up, two months recorded @phone', async ({ page }) => {
  knownUnanswered('s07');
  test.setTimeout(360_000);
  const me = accountFor(KIM62);
  await ask(KIM62, 'L3', ROUTE, async (q) => {
    const year = grossQuarterFree(12 * KIM62.wantMonthlyAfterTax);      // 30,924.71
    const draw = monthly(year);                                          // 2,577.06
    await at(page);
    const planId = await q.step('Will it last? > Keep > make an account', () => kimKept(page, me));

    // R5: the full view's first screen holds what Kim typed
    await q.step('the full view, Stress settings', () => fullPage(page, 'stress settings'));
    const first = await page.locator('body').innerText();
    const shown = await figuresOn(page);
    const sees = (n) => shown.some((v) => Math.abs(v - n) <= 1);
    q.never('the full view\'s first screen', /still the defaults/i.test(first) ? ['still the defaults'] : [], { must: 'Kim\'s figures, never "still the defaults"', owner: 'VIEWS' });
    q.reach('Kim\'s £520,000, £60,000 and £2,400 in the full view', sees(KIM62.pot) && sees(KIM62.isa) && (sees(KIM62.wantMonthlyAfterTax) || sees(pounds(year))), { did: `missing: ${[[KIM62.pot, '£520,000'], [KIM62.isa, '£60,000']].filter(([n]) => !sees(n)).map(([, w]) => w).join(', ') || 'the income'}`, owner: 'VIEWS' });

    await q.step('lock from Stress settings', () => lockFromStressSettings(page));
    let setUpIncome = null;
    const nov = await q.step('Monthly Entry, November 2026: the tax year set up with £21,000 of pay so far', () => monthlyEntry(page, {
      month: '2026-11', pension: KIM62.pot, isa: KIM62.isa,
      setUp: async (p) => { await p.locator('#wizIncomeToDate').fill(String(KIM62.payThisTaxYear)); setUpIncome = money(await p.locator('#wizSalary').inputValue()); }
    }));
    q.exact('this year\'s income before tax, on the tax-year set-up', setUpIncome, pounds(year), { byHand: '(28,800 − 2,514) ÷ 0.85 = 30,924.71', tolerance: 1, owner: 'MONTH', says: setUpIncome ? `was told £${setUpIncome.toLocaleString('en-GB')} for this year's income before tax, not £30,925` : undefined });
    q.reach('each month\'s draw, £2,577, on November\'s entry', has(nov, pounds(draw)), { did: 'no £2,577 on the Monthly Entry', byHand: '30,924.71 ÷ 12 = 2,577.06', owner: 'MONTH' });
    q.reach('what reaches Kim this month, £2,191, with the reason', has(nov, pounds(reachesWhenAllowanceUsed(draw))) && /allowance/i.test(nov), { did: has(nov, pounds(reachesWhenAllowanceUsed(draw))) ? 'the figure without the reason (the allowance used by pay)' : 'no £2,191 on the Monthly Entry', byHand: '2,577.06 − 0.75 × 2,577.06 × 0.2 = 2,190.50', owner: 'MONTH' });
    q.reach('what to take for £2,400 to reach Kim, £2,824', has(nov, pounds(takeForWhenAllowanceUsed(KIM62.wantMonthlyAfterTax))), { did: 'no £2,824 on the Monthly Entry', byHand: '2,400 ÷ 0.85 = 2,823.53', owner: 'MONTH' });
    await q.step('Save November', () => saveMonth(page));
    await q.step('Monthly Entry, December 2026', () => monthlyEntry(page, { month: '2026-12', pension: KIM62.pot - pounds(draw), isa: KIM62.isa }));
    await q.step('Save December', () => saveMonth(page));

    // the same year's income on Stress settings, the plan document and History
    const year30925 = [];
    for (const name of ['stress settings', 'plan document', 'history']) {
      await q.step(`the full view, ${name}`, () => fullPage(page, name));
      const t = await page.locator('body').innerText();
      year30925.push({ where: `full view ${name}`, value: has(t, pounds(year)) ? pounds(year) : (has(t, 32858) ? 32858 : null) });
      q.never(`the full view ${name}`, /months are not recorded: April/i.test(t) ? ['months are not recorded: April'] : []);
    }

    // the simple home: taken against the plan, the ISA Kim typed
    await q.step('the simple home', async () => { await planPage(page, planId, 'home'); await settled(page).catch(() => {}); });
    const home = await visibleText(page);
    const line = /£([\d,]+) taken; the plan said £([\d,]+)/.exec(home);
    const two = pounds(months(2, 2577.06));
    q.exact('taken in November and December', line ? money(line[1]) : null, two, { byHand: '2 × 2,577.06 = 5,154.12', owner: 'MONTH' });
    q.exact('what the plan said for November and December', line ? money(line[2]) : null, two, { byHand: '2 × 30,924.71 ÷ 12 = 5,154.12', owner: 'MONTH' });
    year30925.push({ where: 'simple home', value: has(home, pounds(year)) ? pounds(year) : null });
    q.same('this year\'s income before tax', year30925, { want: pounds(year), owner: 'MONTH' });
    q.never('the simple home', /months are not recorded: April|April 2026: (?:due|not recorded)/i.test(home) ? ['a month before November counted as due'] : [], { must: 'no month before November 2026 asked for or counted', owner: 'FACTS' });
    const isa = /ISA £([\d,]+)/.exec(home);
    q.exact('the ISA on the home', isa ? money(isa[1]) : null, KIM62.isa, { byHand: 'as typed each month', owner: 'HOLD' });
    q.never('the simple home', [...(await neverOnAnyPage(page)), ...(/no figure on record/i.test(home) ? ['no figure on record'] : [])]);
  });
});
