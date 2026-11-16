/**
 * s11 · Sam, 59 · M8, M9, M10, M12 · moving into the plan's mix · HOLD   @phone
 *
 * Sam stops work in October 2027 at 60 on a locked index-linked gilt ladder, £26,000 a year then £22,000 from 75. Sam
 * holds a share fund of £300,000, a bond fund of £90,000, 17,300 units of T29 and 14,700 of TR31, an ordinary gilt TG28
 * worth £20,000 and £25,000 in cash. Sam opens Moving to your plan's mix and the full view's Transition. Worked by hand,
 * from the plan's own figures read off its order sheet (here as the brief has them: T29 44,000 units, TR31 18,100, cash
 * £52,392):
 *   to buy      T29 44,000 − 17,300 = 26,700 units; TR31 18,100 − 14,700 = 3,400 units; cash 52,392 − 25,000 = 27,392
 *   to sell     no more than the buy total B read off the page; what is not sold, £410,000 less the sell total, stays
 *
 * NOT WALKED YET: the ladder made and locked on the screen with Sam's stop in October 2027, and the holdings pasted. The
 * plan's units come from its own order sheet, which must be read off the page first. Until the presses are found for
 * this build the scenario is listed but does not run (fixme, with this reason).
 */
import { test } from '@playwright/test';
import { ask } from './ask.js';
import { accountFor, made } from './account.js';
import { at, signIn, planPage, settled, fullPage } from './routes.js';
import { visibleText, money } from './read.js';
import { knownUnanswered } from './known.js';
import { SAM59 } from './people.js';
import { unitsToBuy } from './hand/held.js';

const ROUTE = { path: 'a locked ladder made on the screen, holdings pasted > home > Moving to your plan\'s mix; full view Transition', who: 'signed in', asked: 'what is still to buy, and what would be sold to pay for it' };
const grab = (re, text) => { const m = re.exec(text); return m ? money(m[1]) : null; };

test('s11 · Sam, 59, moving: buy what is missing, sell no more than that, keep the rest @phone', async ({ page }) => {
  test.fixme(true, 'not walked yet: the ladder locked on screen with a stop in October 2027 and the holdings pasted (see the head of this file)');
  knownUnanswered('s11');
  test.setTimeout(300_000);
  const me = await made(accountFor(SAM59));
  await ask(SAM59, 'M8', ROUTE, async (q) => {
    await at(page);
    await q.step('sign in', () => signIn(page, me));
    const planId = null;   // made on the screen once the route is walked
    await q.step('Moving to your plan\'s mix', async () => { await planPage(page, planId, 'move'); await settled(page).catch(() => {}); });
    const t = await visibleText(page);
    const t29 = SAM59.holds.find((h) => h.what === 'T29'); const tr31 = SAM59.holds.find((h) => h.what === 'TR31'); const cash = SAM59.holds.find((h) => h.what === 'cash');
    q.exact('T29 units to buy', grab(/T29[^\n]*?([\d,]+) units/, t), unitsToBuy(t29.planUnits, t29.units), { byHand: '44,000 − 17,300' });
    q.exact('TR31 units to buy', grab(/TR31[^\n]*?([\d,]+) units/, t), unitsToBuy(tr31.planUnits, tr31.units), { byHand: '18,100 − 14,700' });
    q.exact('cash to set aside', grab(/cash[^\n£]*£([\d,]+)/i, t), cash.planCash - cash.value, { byHand: '52,392 − 25,000' });
    const buy = grab(/buy[^\n£]*£([\d,]+) in all/i, t); const sell = grab(/sell[^\n£]*£([\d,]+) in all/i, t);
    q.reach('the sell total no more than the buy total', buy !== null && sell !== null && sell <= buy, { did: `buy ${buy}, sell ${sell}` });
    q.reach('TG28\'s maturity, 22 October 2028, before it is listed to sell', /22 October 2028/.test(t), { did: 'no maturity date for TG28' });
    await q.step('the full view, Transition', () => fullPage(page, 'transition'));
    const full = await page.locator('body').innerText();
    q.same('the buy total', [{ where: 'simple Moving', value: buy }, { where: 'full view Transition', value: grab(/buy[^\n£]*£([\d,]+) in all/i, full) }], { everywhere: true });
  });
});
