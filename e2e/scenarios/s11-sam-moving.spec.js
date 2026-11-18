/**
 * s11 · Sam, 59 · M8, M9, M10, M12 · moving into the plan's mix · HOLD   @phone
 *
 * Sam stops work in October 2027 at 60 on a locked index-linked gilt ladder, £26,000 a year then £22,000 from 75. Sam
 * holds a share fund of £300,000, a bond fund of £90,000, 17,300 units of T29 and 14,700 of TR31, an ordinary gilt TG28
 * worth £20,000 and £25,000 in cash. Sam opens Moving to your plan's mix and the full view's Transition. Worked by hand,
 * from the plan's own figures read off its order sheet (on this build: T29 44,000 units, TR31 18,100, cash £52,392):
 *   to buy      T29 44,000 − 17,300 = 26,700 units; TR31 18,100 − 14,700 = 3,400 units; cash 52,392 − 25,000 = 27,392
 *   to sell     no more than the buy total B read off the page; what is not sold, £410,000 less the sell total, stays
 * Then Sam says "This is how I want to hold it" (two presses): the page lists nothing to buy, and the home says so.
 *
 * The route, as a person takes it: the full view's set-up (59, stopping at 60, in October 2027), Stress settings with the
 * full index-linked gilt ladder, the pension's total and the two income steps, Save, Lock; the plan's units read off its
 * order sheet; the platform's table pasted on What you hold; then the move page, the home and the full view.
 */
import { test, expect } from '@playwright/test';
import { ask } from './ask.js';
import { accountFor, made } from './account.js';
import { at, signIn, planPage, settled, fullPage, planAddress } from './routes.js';
import { visibleText, money } from './read.js';
import { fullViewWizard, stressLadder, lockFromStressSettings, orderSheet, pasteHoldings } from './made.js';
import { knownUnanswered } from './known.js';
import { SAM59 } from './people.js';
import { unitsToBuy } from './hand/held.js';
import { readFileSync } from 'node:fs';

const VERSION = JSON.parse(readFileSync(new URL('../../package.json', import.meta.url), 'utf8')).version;
const ROUTE = { path: 'a locked ladder made on the screen, holdings pasted > Moving to your plan\'s mix > home; full view Transition; "This is how I want to hold it"', who: 'signed in', asked: 'what is still to buy, and what would be sold to pay for it' };
const grab = (re, text) => { const m = re.exec(text); return m ? money(m[1]) : null; };
const OUTSIDE = 300000 + 90000 + 20000;   // the share fund, the bond fund and TG28: what the ladder does not use

/** What Sam's platform lists: the two funds, the two plan gilts held (their names and SEDOLs as the order sheet has them), TG28, the cash. */
function platformTable(orders) {
  const of = (code) => orders.find((o) => o.code === code) || { name: code, sedol: '' };
  const rows = [['Name', 'Code', 'SEDOL', 'Units', 'Value'],
    ['Invesco FTSE All-World (Acc)', 'FWRA', '', '', '£300,000'],
    ['iShares Core Global Agg GBP-Hedged', 'AGBP', '', '', '£90,000'],
    [of('T29').name, 'T29', of('T29').sedol, '17,300', '£30,000'],
    [of('TR31').name, 'TR31', of('TR31').sedol, '14,700', '£21,000'],
    ['1 5/8% Treasury Gilt 2028', 'TG28', '', '21,200', '£20,000'],
    ['Cash', '', '', '', '£25,000']];
  return { text: rows.map((r) => r.join('\t')).join('\n'), total: rows.slice(1).reduce((s, r) => s + Number(r[4].replace(/[£,]/g, '')), 0) };
}
/** Units to buy of a gilt on the move page's Buy list: the figure after its code and SEDOL. */
const buyUnits = (code, text) => { const m = new RegExp(`\\b${code} · [A-Z0-9]{7}\\s+(?:Units\\s+)?([\\d,]+)\\b`).exec(text); return m ? money(m[1]) : null; };

test('s11 · Sam, 59, moving: buy what is missing, sell no more than that, keep the rest @phone', async ({ page }) => {
  knownUnanswered('s11');
  test.setTimeout(360_000);
  const me = await made(accountFor(SAM59), { lastSeenVersion: VERSION });
  await ask(SAM59, 'M8', ROUTE, async (q) => {
    await at(page);
    await q.step('sign in', () => signIn(page, me));
    await q.step('the full view\'s set-up: 59, stopping at 60 in October 2027', () => fullViewWizard(page, { name: 'Sam', age: SAM59.age, stopAge: SAM59.stopAge, stopMonth: SAM59.stopMonth }));
    const t29 = SAM59.holds.find((h) => h.what === 'T29'); const tr31 = SAM59.holds.find((h) => h.what === 'TR31'); const cash = SAM59.holds.find((h) => h.what === 'cash');
    const table0 = platformTable([]);
    await q.step('Stress settings: the full index-linked gilt ladder, the pension\'s total, £26,000 then £22,000 from 75, Save', () => stressLadder(page, { pension: table0.total, cashYears: null, steps: [{ amount: SAM59.ladder.yearly }, { from: SAM59.ladder.laterFrom, amount: SAM59.ladder.laterYearly }] }));
    await q.step('lock from Stress settings', () => lockFromStressSettings(page));
    const orders = (await q.step('the plan\'s units, read off its order sheet', () => orderSheet(page))) || [];
    const planT29 = orders.find((o) => o.code === 'T29')?.units ?? null, planTR31 = orders.find((o) => o.code === 'TR31')?.units ?? null, planCash = orders.cash ?? null;
    q.reach('the plan\'s T29, TR31 and cash read off its order sheet', planT29 !== null && planTR31 !== null && planCash !== null, { did: `T29 ${planT29}, TR31 ${planTR31}, cash ${planCash}` });
    const planId = await q.step('the plan, in the simple view', async () => { await page.getByRole('link', { name: /Back to the simple view/ }).first().click(); await page.waitForURL((u) => /#\/plan\//.test(u.hash), { timeout: 30_000 }); return planAddress(page).planId; });
    await q.step('What you hold: the platform\'s table pasted', () => pasteHoldings(page, planId, platformTable(orders).text));

    await q.step('Moving to your plan\'s mix', async () => { await planPage(page, planId, 'move'); await settled(page).catch(() => {}); });
    const t = await visibleText(page);
    q.exact('T29 units to buy', buyUnits('T29', t), unitsToBuy(planT29, t29.units), { byHand: `${planT29} − 17,300` });
    q.exact('TR31 units to buy', buyUnits('TR31', t), unitsToBuy(planTR31, tr31.units), { byHand: `${planTR31} − 14,700` });
    q.exact('cash to set aside', grab(/Money-market fund \/ cash[^£]*£([\d,]+)/, t), planCash - cash.value, { byHand: `${planCash} − 25,000` });
    const buy = grab(/Totals: buy £([\d,]+)/, t); const sell = grab(/paid from what your plan does not use, £([\d,]+)/, t); const left = grab(/left as it is, £([\d,]+)/, t);
    q.reach('the sell total no more than the buy total', buy !== null && sell !== null && sell <= buy, { did: `buy ${buy}, sell ${sell}` });
    q.exact('what is not sold stays as it is: £410,000 less the sell total', left, sell === null ? null : OUTSIDE - sell, { byHand: `410,000 − ${sell}` });
    q.reach('TG28\'s maturity, 22 October 2028, said beside it', /22 October 2028/.test(t), { did: 'no maturity date for TG28' });
    q.never('the move page', /proceeds|ticked off|\bNext:/i.test(t) ? ['proceeds / ticked off / Next:'] : []);
    // round 3 (walker 5, decision 8): the order sheet orders what is still to buy of a gilt part bought, the Buy list's figure
    const anyway = page.getByTestId('plan.move.sheet.anyway');
    if (await anyway.isVisible().catch(() => false)) await q.step('the order sheet: "Show the sheet anyway"', () => anyway.click());
    const sheet = await visibleText(page);
    const t29Buy = unitsToBuy(planT29, t29.units);
    const g = (n) => Number(n).toLocaleString('en-GB');
    q.reach(`the order sheet's T29 units are ${g(t29Buy)}, the Buy list's, with the 17,300 held said`, new RegExp(`${g(t29Buy)}\\s*\\(${Math.round(t29Buy / 100)} if the screen counts £100 lots\\)\\s*You hold 17,300 of the ${g(planT29)}\\.`).test(sheet), { byHand: `${planT29} − 17,300` });

    await q.step('the home', async () => { await planPage(page, planId, 'home'); await settled(page).catch(() => {}); });
    const home = await visibleText(page);
    q.same('the buy total', [{ where: 'simple Moving', value: buy }, { where: 'home To do', value: grab(/Moving to your plan’s mix: £([\d,]+) still to buy/, home) }], { everywhere: true });

    await q.step('the full view, Transition', () => fullPage(page, 'transition'));
    await expect(page.getByText(/^Totals: buy/).first()).toBeVisible({ timeout: 30_000 }).catch(() => {});
    const full = await page.locator('body').innerText();
    q.same('the buy total, both views', [{ where: 'simple Moving', value: buy }, { where: 'full view Transition', value: grab(/Totals: buy £([\d,]+)/, full) }], { everywhere: true });
    // round 3 (walker 5, decision 8): "Stands in for some years" on TG28 fills no year by itself; a year it cannot pay is refused
    const tg28 = page.locator('#holdingsCard tr', { has: page.locator('input[value="TG28"]') }).first();
    await q.step('What you hold: TG28, Keep this = "Stands in for some years"', () => tg28.locator('select[aria-label="Keep this"]').selectOption('rung'));
    const years = tg28.locator('.keep-years input');
    q.reach('the years box beside it is there and empty: nothing is filled in by itself', (await years.isVisible().catch(() => false)) && (await years.inputValue().catch(() => 'x')) === '', { did: `box value "${await years.inputValue().catch(() => '?')}"` });
    q.never('the full view after choosing "Stands in"', /stands in for 2027\/28|Cash year 2027\/28: paid by what you keep/i.test(await page.locator('body').innerText()) ? ['a year filled in by itself'] : []);
    await q.step('type 2027/28, a year that ends before TG28 pays', async () => { await years.fill('2027/28'); await years.press('Tab'); });
    await expect(page.getByText('This gilt pays on 22 October 2028, after 2027/28 ends, so it cannot pay for 2027/28.').first()).toBeVisible({ timeout: 15_000 }).catch(() => {});
    q.reach('2027/28 is refused with the reason: 2027/28 ends 5 April 2028, TG28 pays 22 October 2028', await page.getByText('This gilt pays on 22 October 2028, after 2027/28 ends, so it cannot pay for 2027/28.').first().isVisible().catch(() => false), { byHand: '5 April 2028 is before 22 October 2028' });

    // M10: "This is how I want to hold it", one press and a confirm
    await q.step('Moving to your plan\'s mix: "This is how I want to hold it", then yes', async () => {
      await planPage(page, planId, 'move');
      await page.getByTestId('plan.move.sayHeld.button').click();
      await page.getByTestId('plan.move.sayHeld.yes').click();
      await expect(page.getByTestId('plan.move.saidHeld')).toBeVisible({ timeout: 30_000 });
    });
    const after = await visibleText(page);
    q.never('the move page after saying how it is held', /Totals: buy|By \w+ \d{4}: buy/.test(after) ? ['a list to buy'] : []);
    await q.step('the home, after', async () => { await planPage(page, planId, 'home'); await settled(page).catch(() => {}); });
    const homeAfter = await visibleText(page);
    q.reach('the home says it is held your own way, and has no to-do to buy', /your own way/i.test(homeAfter) && !/still to buy/.test(homeAfter), { did: homeAfter.split('\n').find((l) => /mix/i.test(l)) || 'nothing about the move' });
  });
});
