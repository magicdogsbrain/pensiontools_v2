/**
 * s02 · Jo, 33 · X1, X2, X3, R1, R3 · keeps, makes an account, comes back a day later, changes her mind · SAVER, FACTS   @phone
 *
 * From s01's answer Jo keeps the plan paying in as now, makes an account, closes the browser, and comes back the next
 * day to the site's root. Then she moves her stop to 65 on "About you and when", and her spending to £2,500 on "What you
 * spend". Worked by hand:
 *   what you pay in   5% × 38,000 ÷ 12 × 0.8 = 126.67 from take-home pay; 3% × 38,000 ÷ 12 = 95 from the employer
 *   stop 60 → 65      five more years of 3,040 going in: the pot at the stop up by at least 5 × 3,040 = 15,200 on every page
 *   stop month        Jo is 33 now; stopping at 65 is 32 years on, so the stop month reads a later year than at 60
 *
 * Landing: the lead's decision for 7.12.0 opens the view last chosen, and the full view when none was ever chosen. Jo
 * never chose, so the root may open either view; it must open Jo's plan.
 */
import { test } from '@playwright/test';
import { ask } from './ask.js';
import { accountFor, confirmEmail } from './account.js';
import { at, openSimple, answer, signUp, signIn, comeBack, landing, planPage, settled, editAndSave, planName, planAddress } from './routes.js';
import { visibleText, money, fact, neverOnAnyPage } from './read.js';
import { sweep } from './sweep.js';
import { knownUnanswered } from './known.js';
import { JO33 } from './people.js';
import { JO_B } from './typed.js';
import { shareOfPay, fromTakeHome, pounds } from './hand/money.js';
import { leastMove } from './hand/growth.js';

const ROUTE = { path: 's01\'s answer > Keep > make an account > a day later, the site\'s root > About: stop 65 > What you spend: £2,500', who: 'guest, then signed in', asked: 'whether a kept plan comes back and follows a change of mind' };
const FOLLOW = ['stop.month', 'yearsToGo', 'pot.atStop'];
const PAGES = { simple: ['home', 'plan', 'saving', 'lasts'], full: ['accumulation', 'stress settings'] };
const grab = (re, text) => { const m = re.exec(text); return m ? money(m[1]) : null; };

test('s02 · Jo keeps the plan, comes back the next day, and moves her stop to 65 @phone', async ({ page, browser }) => {
  knownUnanswered('s02');
  test.setTimeout(420_000);
  const me = accountFor(JO33);
  await ask(JO33, 'R1', ROUTE, async (q) => {
    await q.step('s01\'s answer', async () => { await at(page); await openSimple(page, ''); await page.getByTestId('front.q.b').click(); await answer(page, 'b', JO_B); });
    await q.step('Keep: paying in as now', async () => { await page.getByTestId('b.action.save.now').click(); await page.getByTestId('b.keep.made').waitFor({ timeout: 30_000 }); });
    const firstAction = (await page.getByTestId('b.keep.made').locator('a, button').first().innerText().catch(() => '')).trim();
    q.never('the kept panel\'s first action', /lock/i.test(firstAction) ? [firstAction] : [], { must: 'nothing asks Jo to lock before Jo has pressed anything about locking', owner: 'VIEWS' });
    await q.step('Sign in or make an account', () => page.getByTestId('b.keep.toAccount').click());
    await q.step('make an account', () => signUp(page, me, confirmEmail));
    await q.step('back on the plan', () => page.waitForURL((u) => /#\/plan\//.test(u.hash), { timeout: 30_000 }));
    const planId = planAddress(page)?.planId;
    await page.context().close();

    // a day later, a new browser
    const later = await comeBack(browser, page, '2026-11-17T09:00:00.000Z');
    await q.step('a day later: sign in again', () => signIn(later, me));
    const landed = await q.step('the site\'s root', () => landing(later));
    q.reach('Jo\'s plan from the site\'s root', landed.view === 'simple' ? landed.planId === planId : /Stop at|60|£2,000|Jo/.test(landed.name || ''),
      { did: landed.view === 'simple' ? `the simple view, ${landed.screen} (${landed.planId || 'no plan'})` : `the full view, its picker reading "${landed.name}"`, owner: 'VIEWS' });

    // R3: the home says it in pounds without a press, the same figures as the Saving page
    await q.step('the plan\'s home', async () => { await planPage(later, planId, 'home'); await settled(later).catch(() => {}); });
    const home = await visibleText(later);
    const homeCould = grab(/could spend £([\d,]+) a month/, home);
    const homeNeed = grab(/(\d+)% of your pay in all/, home);
    await q.step('What you pay in', async () => { await planPage(later, planId, 'saving'); await settled(later).catch(() => {}); });
    const saving = await visibleText(later);
    q.same('what Jo could spend a month paying in as now', [{ where: 'home', value: homeCould }, { where: 'What you pay in', value: grab(/could spend £([\d,]+) a month/, saving) }], { everywhere: true, owner: 'SAVER' });
    q.same('the share of pay that would be enough', [{ where: 'home', value: homeNeed }, { where: 'What you pay in', value: grab(/(\d+)% of your pay in all/, saving) }], { everywhere: true, owner: 'SAVER' });

    // What you pay in, in Jo's units
    const takeHome = fromTakeHome(shareOfPay(JO33.ownPct, JO33.pay));
    const fromJo = (await fact(later, 'payIn.fromTakeHome', { page: 'saving' }))?.value ?? null;
    const fromEmployer = (await fact(later, 'payIn.employer', { page: 'saving' }))?.value ?? null;
    q.exact('what leaves Jo\'s take-home pay, on What you pay in', fromJo, pounds(takeHome), { byHand: '5% × 38,000 ÷ 12 × 0.8 = 126.67', tolerance: 1, owner: 'SAVER' });
    q.exact('the employer\'s part, on What you pay in', fromEmployer, pounds(shareOfPay(JO33.employerPct, JO33.pay)), { byHand: '3% × 38,000 ÷ 12 = 95', tolerance: 1, owner: 'SAVER' });

    // the second walk (walkers 9, 1 and 4): "Cuts in a slump. Switched off: yes; … Income cut to: 80%" on a plan kept from
    // the answer, which runs with the cut off: a double negative, then the dials of a rule that never runs
    await q.step('Your plan', async () => { await planPage(later, planId, 'plan'); await settled(later).catch(() => {}); });
    const yourPlan = await visibleText(later);
    q.never('Your plan, "Everything else this plan uses"', ['Switched off', 'Income cut to'].filter((w) => yourPlan.includes(w)), { must: 'cuts switched off said as "On: no", with no dials', owner: 'VIEWS' });

    // X2: stop at 65; every page follows
    const before = await q.step('every page, before the change', () => sweep(later, planId, { ids: FOLLOW, pages: PAGES }));
    await q.step('About you and when: stop at 65', () => editAndSave(later, planId, 'about', 'stopAge', 65));
    const after = await q.step('every page, after the change', () => sweep(later, planId, { ids: FOLLOW, pages: PAGES }));
    for (const id of ['stop.month', 'yearsToGo', 'pot.atStop']) q.same(`${id} after the stop moved to 65`, after.readings[id], { owner: 'FACTS' });
    const least = leastMove(5, 12 * shareOfPay(JO33.ownPct + JO33.employerPct, JO33.pay));
    for (const r of after.readings['pot.atStop']) {
      const was = before.readings['pot.atStop'].find((x) => x.where === r.where);
      q.follows(`the pot at the stop on ${r.where}`, was ? was.value : null, r.value, least, { byHand: '5 more years × 3,040 = 15,200, before any growth', owner: 'SAVER' });
    }
    const pagesAfter = new Set(after.readings['pot.atStop'].map((r) => r.where));
    for (const r of before.readings['pot.atStop']) if (!pagesAfter.has(r.where)) q.fail({ must: `the pot at the stop on ${r.where} after the change`, did: `stated before (£${r.value}), not after`, says: `lost the pot at the stop on ${r.where} after the change`, owner: 'FACTS' });
    q.neverAcross([...before.never, ...after.never]);

    // X3: the spending to £2,500; the name follows
    await q.step('What you spend: £2,500', () => editAndSave(later, planId, 'spend', 'first.amount', 2500));
    const name = await q.step('the plan\'s name', () => planName(later, planId));
    const stale = ['60', '£2,000', '2,000'].filter((w) => new RegExp(`(^|[^\\d,£])${w.replace(/[£,]/g, (c) => `\\${c}`)}(?![\\d,])`).test(name));
    q.never(`the plan's name ("${name}")`, stale, { must: 'a name that no longer says the old stop age or the old income', owner: 'FACTS' });
    q.never('the home', await neverOnAnyPage(later));
  });
});
