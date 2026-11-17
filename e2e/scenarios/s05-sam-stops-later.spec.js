/**
 * s05 · Sam, 45 · X2, X3 · stop at 67, spend £2,200 · FACTS, MEASURE
 *
 * Sam's plan from a year ago (s04's start), opened on 16 November 2026. Sam moves the stop from 65 to 67 on "About you
 * and when", then the spending to £2,200 a month on "What you spend". Worked by hand:
 *   two more years of paying in   2 × 625 × 12 = 15,000: the pot at the stop up by at least that on every page
 *   £2,200 a month after tax      26,400 a year. Sam's plan was kept from the answer with a quarter of each payment
 *                                 tax-free (the answer's own default), so what is taken a year before tax is
 *                                 (26,400 − 2,514) ÷ 0.85 = 28,101.18 — £28,102 on the page, which works from the plan's
 *                                 figure held to the pound (£29,858, all taxed: 26,400.40 after tax), so within £1
 */
import { test } from '@playwright/test';
import { ask } from './ask.js';
import { accountFor } from './account.js';
import { signIn, comeBack, planPage, settled, editAndSave, planName } from './routes.js';
import { visibleText, money } from './read.js';
import { sweep } from './sweep.js';
import { samAYearAgo } from './made.js';
import { knownUnanswered } from './known.js';
import { SAM45 } from './people.js';
import { goingIn, grossQuarterFree, pounds } from './hand/money.js';
import { leastMove } from './hand/growth.js';

const ROUTE = { path: 'Sam\'s plan from a year ago > About: stop 67 > What you spend: £2,200 > home, What you pay in, Your plan, Does it last?, full view Stress Tester and Accumulation', who: 'signed in', asked: 'whether every page follows a stop at 67 and £2,200 a month' };
const PAGES = { simple: ['home', 'plan', 'saving', 'lasts'], full: ['stress settings', 'accumulation', 'will it last'] };

test('s05 · Sam moves the stop to 67 and the spending to £2,200: every page follows', async ({ page, browser }) => {
  knownUnanswered('s05');
  test.setTimeout(360_000);
  const me = accountFor(SAM45);
  await ask(SAM45, 'X2', ROUTE, async (q) => {
    const planId = await q.step('a year ago: the plan made and kept', () => samAYearAgo(page, me));
    await page.context().close();
    const later = await comeBack(browser, page, '2026-11-16T10:00:00.000Z');
    await q.step('sign in', () => signIn(later, me));
    const before = await q.step('every page, at 65', () => sweep(later, planId, { ids: ['pot.atStop'], pages: PAGES }));
    await q.step('About you and when: stop at 67', () => editAndSave(later, planId, 'about', 'stopAge', 67));
    await q.step('What you spend: £2,200', () => editAndSave(later, planId, 'spend', 'first.amount', 2200));
    const after = await q.step('every page, at 67', () => sweep(later, planId, { ids: ['pot.atStop', 'lasts.chance'], pages: PAGES }));

    const least = leastMove(2, 12 * (goingIn(SAM45.fromTakeHome) + SAM45.employer));
    q.same('the pot when work stops, at 67', after.readings['pot.atStop'], { owner: 'SAVER' });
    for (const r of after.readings['pot.atStop']) {
      const was = before.readings['pot.atStop'].find((x) => x.where === r.where);
      q.follows(`the pot at the stop on ${r.where}`, was ? was.value : null, r.value, least, { byHand: '2 more years × 625 × 12 = 15,000, before any growth', owner: 'SAVER' });
    }
    q.same('the chance the money lasts', after.readings['lasts.chance'], { owner: 'MEASURE' });
    q.neverAcross([...before.never, ...after.never]);

    await q.step('What you spend', async () => { await planPage(later, planId, 'spend'); await settled(later).catch(() => {}); });
    const spend = await visibleText(later);
    const gross = /£([\d,]+) a year before tax/.exec(spend);
    q.exact('£2,200 a month after tax, before tax', gross ? money(gross[1]) : null, pounds(grossQuarterFree(26400)), { byHand: '(26,400 − 2,514) ÷ 0.85 = 28,101.18, a quarter of each payment tax-free', tolerance: 1, owner: 'FACTS' });
    const name = await q.step('the plan\'s name', () => planName(later, planId));
    const stale = ['65', '£2,400', '2,400'].filter((w) => new RegExp(`(^|[^\\d,£])${w.replace(/[£,]/g, (c) => `\\${c}`)}(?![\\d,])`).test(name));
    q.never(`the plan's name ("${name}")`, stale, { must: 'a name that no longer says the old stop age or the old income', owner: 'FACTS' });
  });
});
