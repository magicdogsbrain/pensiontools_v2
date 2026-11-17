/**
 * s13 · Pat, 52 · S6, S13 · a late starter, as a guest · FACTS, WORDS   @phone
 *
 * Pat earns £31,000, has £45,000 in a workplace pension, pays 4% with 3% from the employer, and asks "Am I saving enough?"
 * for £1,200 a month from 67 (the second walk's walker 3). Worked by hand:
 *   State Pension      241.30 × 52 ÷ 12 = 1,045.63, £1,046 a month, from 67 (Pat is 52: born 1974, so 67)
 *   the full amount    needs 35 years of National Insurance; a forecast is at gov.uk/check-state-pension
 *   the guide levels   the lowest is the published "Minimum" (shown as Basic), and they are for a home owned outright
 *   on course with room  paying 7% in all is more than £1,200 from 67 needs: the page says there is room, and never invites
 *                      paying in less ("You could stop paying in yourself" read as a way to lose the employer's 3%)
 */
import { test, expect } from '@playwright/test';
import { ask } from './ask.js';
import { at, openSimple, setField, settled } from './routes.js';
import { visibleText, money, neverOnAnyPage } from './read.js';
import { knownUnanswered } from './known.js';
import { PAT52 } from './people.js';
import { FULL_MONTHLY, statePensionAgeFromAge } from './hand/statePension.js';
import { pounds } from './hand/money.js';

const ROUTE = { path: 'front page > Am I saving enough? > Pat\'s figures > £1,200 a month from 67 > Show what I need', who: 'guest', asked: 'whether the State Pension counts and how to check it, and what the least to live on is' };
const grab = (re, text) => { const m = re.exec(text); return m ? money(m[1]) : null; };

test('s13 · Pat, 52, a late starter: the State Pension, the least to live on, and room without an invitation to pay in less @phone', async ({ page }) => {
  knownUnanswered('s13');
  test.setTimeout(180_000);
  await ask(PAT52, 'S6', ROUTE, async (q) => {
    await q.step('the front page, "Am I saving enough?"', async () => { await at(page); await openSimple(page, ''); await page.getByTestId('front.q.b').click(); });
    await q.step('Pat\'s figures', async () => {
      await expect(page.locator('#app [data-screen]')).toHaveAttribute('data-screen', 'b.numbers', { timeout: 15_000 });
      for (const [path, v] of Object.entries({ 'you.age': PAT52.age, 'you.pot': PAT52.pot, 'you.payIn.kind': 'share', 'you.payIn.pay': PAT52.pay, 'you.payIn.ownPct': PAT52.ownPct, 'you.payIn.employerPct': PAT52.employerPct, 'stop.age': 67, 'you.statePension.kind': 'full' })) await setField(page, 'b', path, v);
    });
    // S6: beside "The full amount", what it needs and where a forecast is
    const step1 = await visibleText(page);
    q.reach('what the full State Pension needs: 35 years of National Insurance', /35 years of National Insurance/.test(step1), { did: 'not said beside "The full amount"', owner: 'FACTS' });
    q.reach('where to check a forecast: gov.uk/check-state-pension', /gov\.uk\/check-state-pension/.test(step1), { did: 'no address given', owner: 'FACTS' });

    // S13: the least to live on, and what the levels assume
    await q.step('Next: what you would spend', async () => { await page.getByTestId('b.action.onward').click(); await expect(page.locator('#app [data-screen]')).toHaveAttribute('data-screen', 'b.spend', { timeout: 15_000 }); });
    const step2 = await visibleText(page);
    q.reach('the lowest guide level named as the published "Minimum"', /published “Minimum”/.test(step2), { did: (/national guide levels[^\n]*/.exec(step2) || ['no guide levels line'])[0], owner: 'WORDS' });
    q.reach('the guide levels said to be for a home owned outright', /owned outright/.test(step2), { did: (/national guide levels[^\n]*/.exec(step2) || ['no guide levels line'])[0], owner: 'WORDS' });

    await q.step('£1,200 a month, Show what I need', async () => {
      await setField(page, 'b', 'spend.amount', 1200);
      await page.getByTestId('b.action.show').click();
      await expect(page.locator('#app [data-screen]')).toHaveAttribute('data-screen', 'b.answer', { timeout: 30_000 });
      await settled(page, 120_000);
    });
    const answer = await visibleText(page);
    const fold = page.getByRole('button', { name: /What we assumed/ });
    if (await fold.isVisible().catch(() => false)) await q.step('What we assumed', () => fold.click());
    const assumed = await visibleText(page);
    q.exact('the State Pension a month', grab(/State Pension of £([\d,]+) a month/, assumed), pounds(FULL_MONTHLY), { byHand: '241.30 × 52 ÷ 12 = 1,045.63', owner: 'FACTS' });
    const spAge = /State Pension[^.]*?from (?:age )?(\d+)/.exec(assumed);
    q.exact('the age the State Pension starts', spAge ? Number(spAge[1]) : null, statePensionAgeFromAge(PAT52.age), { byHand: 'Pat is 52: born 1974, so 67', owner: 'FACTS' });

    // on course with room: said as room, never as an invitation to pay in less (lead decision 9)
    q.reach('the answer: on course for £1,200 a month from 67', /On course for £1,200 a month from 67/.test(answer), { did: (/(Not enough|Close|On course)[^\n]{0,80}/.exec(answer) || ['no verdict'])[0], owner: 'SAVER' });
    q.reach('that there is room, said plainly', /There is room/.test(answer), { did: (/Paying in [^\n]{0,260}/.exec(answer) || ['no first sentence'])[0], owner: 'SAVER' });
    q.never('the answer', await neverOnAnyPage(page));
  });
});
