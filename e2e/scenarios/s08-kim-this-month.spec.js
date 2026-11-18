/**
 * s08 · Kim, 62 · L2 · what to take this month, and from which pot · MONTH   @phone
 *
 * Kim's plan as s07 makes it, locked from Stress settings, nothing recorded yet. On 16 November 2026 she opens the simple
 * home and asks what to take this month and from which pot. Worked by hand: this month's draw is £2,577
 * ((28,800 − 2,514) ÷ 0.85 ÷ 12); the pots named each carry a £ figure and they add up to the month's total. The full
 * view's Monthly Recommendation gives the same amount and the same split, and gives no orders (round 3, walker 6: "Move
 * £8,000 Equity→Bond", "Replenish Cash", "Tax Saved -£129"). Then she saves November and unlocks the plan to change it, as
 * the site tells her to: the home keeps the month, 1 month and £2,577 taken before tax (round 3, decision 10).
 */
import { test, expect } from '@playwright/test';
import { ask } from './ask.js';
import { accountFor } from './account.js';
import { at, planPage, settled, screenOf, fullPage } from './routes.js';
import { visibleText, moneyAll } from './read.js';
import { kimKept, lockFromStressSettings, monthlyEntry, saveMonth } from './made.js';
import { knownUnanswered } from './known.js';
import { KIM62 } from './people.js';
import { grossQuarterFree, monthly, pounds } from './hand/money.js';

const ROUTE = { path: 'Kim\'s locked plan > the simple home > this month (at most two presses) > the full view\'s Monthly Entry', who: 'signed in', asked: 'what to take this month, and from which pot' };
// a pot named with its figure; "State Pension: £12,548 a year" names an income, not a pot, so it is never read as one
const POTS = /(?<!State )\b(pension|SIPP|ISA|cash|savings)\b[^£\n]{0,30}£([\d,]+)|£([\d,]+)[^\n£]{0,20}\bfrom (?:your )?(pension|SIPP|ISA|cash|savings)\b/gi;
const split = (text) => [...String(text).matchAll(POTS)].map((m) => ({ pot: (m[1] || m[4]).toLowerCase(), amount: Number(String(m[2] || m[3]).replace(/,/g, '')) }));

test('s08 · Kim asks what to take this month, and from which pot @phone', async ({ page }) => {
  knownUnanswered('s08');
  test.setTimeout(300_000);
  const me = accountFor(KIM62);
  await ask(KIM62, 'L2', ROUTE, async (q) => {
    const draw = pounds(monthly(grossQuarterFree(12 * KIM62.wantMonthlyAfterTax)));   // 2,577
    await at(page);
    const planId = await q.step('Will it last? > Keep > make an account', () => kimKept(page, me));
    await q.step('lock from Stress settings', () => lockFromStressSettings(page));

    // the simple view: this month's amount within two presses of the home, before anything is recorded
    await q.step('the simple home', async () => { await planPage(page, planId, 'home'); await settled(page).catch(() => {}); });
    let text = await visibleText(page);
    let presses = 0;
    for (const name of [/^Record (November|this month)/i, /Month by month/i]) {
      if (moneyAll(text).some((v) => Math.abs(v - draw) <= 1) || presses >= 2) break;
      const link = page.getByRole('link', { name }).or(page.getByRole('button', { name })).first();
      if (!(await link.isVisible().catch(() => false))) continue;
      // a person waits for the page the press opens (on a phone the old page's text can still be there a moment)
      const was = await screenOf(page).catch(() => null);
      await q.step(`press "${(await link.innerText()).trim().slice(0, 40)}"`, async () => { await link.click(); await expect.poll(() => screenOf(page).catch(() => null), { timeout: 15_000 }).not.toBe(was).catch(() => {}); await settled(page).catch(() => {}); });
      presses += 1;
      text = await visibleText(page);
    }
    q.reach(`this month's amount, £${draw.toLocaleString('en-GB')}, within two presses of the home`, moneyAll(text).some((v) => Math.abs(v - draw) <= 1), { did: `after ${presses} press${presses === 1 ? '' : 'es'}: ${moneyAll(text).slice(0, 8).map((v) => `£${v.toLocaleString('en-GB')}`).join(', ') || 'no sums'}`, byHand: '(28,800 − 2,514) ÷ 0.85 ÷ 12 = 2,577.06', owner: 'MONTH' });
    const simpleSplit = split(text);
    q.never('the simple view', /\bMixed\b/.test(text) && !simpleSplit.length ? ['"Mixed" without a figure for each pot'] : [], { must: 'named pots, each with a £ figure', owner: 'MONTH' });
    if (simpleSplit.length) q.exact('the pots\' figures added up (simple view)', simpleSplit.reduce((s, x) => s + x.amount, 0), draw, { tolerance: 2, byHand: 'each pot\'s £ figure, added: the month\'s total', owner: 'MONTH' });
    else q.reach('the pots this month comes from, each with a £ figure (simple view)', false, { did: 'no pot named with a figure', owner: 'MONTH' });

    // the full view's Monthly Recommendation: the same amount and the same split
    const full = await q.step('the full view, Monthly Entry for November', () => monthlyEntry(page, { month: '2026-11', pension: KIM62.pot, isa: KIM62.isa, setUp: async (p) => { await p.locator('#wizIncomeToDate').fill(String(KIM62.payThisTaxYear)); } }));
    q.reach(`the same amount, £${draw.toLocaleString('en-GB')}, in the full view`, moneyAll(full).some((v) => Math.abs(v - draw) <= 1), { did: 'no such figure on the Monthly Entry', owner: 'MONTH' });
    const fullSplit = split(full);
    for (const s of simpleSplit) q.exact(`what comes from the ${s.pot} in the full view`, (fullSplit.find((x) => x.pot === s.pot) || {}).amount ?? null, s.amount, { tolerance: 2, owner: 'MONTH' });
    const alarm = await page.locator('.alert-danger:visible, [role="alert"]:visible').allInnerTexts();
    q.never('the full view\'s first month', alarm.filter((t) => /floor|below|short/i.test(t)).map((t) => t.slice(0, 80)), { must: 'no red alarm in the first month for floors equal to the starting pots', owner: 'MONTH' });
    // round 3 (walker 6, decision 6): what the plan's rule does, in "you can" words; a saving never shown with a minus (the tax
    // taken off the pension in the gross / tax / net row is a deduction, and keeps its minus)
    q.never('the full view\'s Monthly Recommendation', [...['Equity→Bond', 'Bond→Equity', 'Replenish Cash', 'Rebalancing Suggestions', 'Total Surplus'].filter((w) => full.includes(w)), ...(/Tax Saved[^\n]*-£/i.test(full) ? ['a tax saving with a minus: "' + (/Tax Saved[^\n]*/i.exec(full) || [''])[0] + '"'] : [])], { must: 'what the plan\'s rule does this month, never an order', owner: 'MONTH' });

    // round 3 (walker 6, decision 10): November saved, then the plan unlocked to change; the months recorded are kept and said
    await q.step('Save November', () => saveMonth(page));
    await q.step('unlock to edit, from the full view\'s Stress settings', async () => {
      await fullPage(page, 'stress settings');
      await page.getByRole('button', { name: /Unlock to edit/ }).first().click();
      await page.getByRole('button', { name: 'Unlock — I understand' }).click();
      await expect(page.getByRole('button', { name: /Unlock to edit/ }).first()).toBeHidden({ timeout: 30_000 }).catch(() => {});
    });
    await q.step('the simple home, unlocked', async () => { await planPage(page, planId, 'home'); await settled(page).catch(() => {}); });
    const home = await visibleText(page);
    const kept = `Your 1 recorded month is kept: £${draw.toLocaleString('en-GB')} taken before tax (November 2026)`;
    q.reach(`the home keeps November: 1 month, £${draw.toLocaleString('en-GB')} taken before tax`, home.includes(kept), { byHand: '1 × 2,577', did: home.split('\n').find((l) => /recorded|Unlocked/i.test(l)) || 'no line about the months recorded', owner: 'MONTH' });
    q.never('the home after unlocking', ['Nothing recorded to read against the plan yet', 'Months are recorded once the plan is locked'].filter((w) => home.includes(w)), { must: 'the months recorded, kept and said', owner: 'MONTH' });
  });
});
