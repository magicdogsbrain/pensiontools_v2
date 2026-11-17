/**
 * s01 · Jo, 33 · S1, S2, S6 · a guest in the simple view · SAVER   @phone
 *
 * Jo earns £38,000, has £22,000 in a workplace pension, pays 5% of pay and the employer adds 3%. Jo wants £2,000 a
 * month from 60 and asks "Am I saving enough?". Worked by hand:
 *   going in now   8% × 38,000 ÷ 12 = 253.33 in all; Jo's 5% is 158.33 going in, × 0.8 = 126.67 from take-home pay;
 *                  the employer's 3% is 95
 *   what is needed T% of pay in all read off the page; then T × 38,000 ÷ 1200 in all, (T − 3)% from Jo, and that × 0.8
 *                  from take-home pay (at T = 37: £1,172, 34%, £861)
 *   the pot at 60  between 22,000 + 3,040 × 27 = 104,080 (no growth) and 22,000 × 1.05^27 + 3,040 × 54.669 = 248,330
 *   State Pension  241.30 × 52 ÷ 12 = 1,045.63, £1,046 a month, from 68 (born 1992 or 1993)
 */
import { test } from '@playwright/test';
import { ask } from './ask.js';
import { at, openSimple, answer } from './routes.js';
import { visibleText, money, neverOnAnyPage } from './read.js';
import { knownUnanswered } from './known.js';
import { JO33 } from './people.js';
import { JO_B } from './typed.js';
import { shareOfPay, fromTakeHome, pounds } from './hand/money.js';
import { potBracket } from './hand/growth.js';
import { FULL_MONTHLY, statePensionAgeFromAge } from './hand/statePension.js';

const ROUTE = { path: 'front page > Am I saving enough? > 5% and 3%, £38,000, £22,000, 33, stop 60 > £2,000 > Show what I need', who: 'guest', asked: 'what to pay in for £2,000 a month at 60' };
const grab = (re, text) => { const m = re.exec(text); return m ? money(m[1]) : null; };

test('s01 · Jo, 33, asks what to pay in for £2,000 a month from 60 @phone', async ({ page }) => {
  knownUnanswered('s01');
  test.setTimeout(180_000);
  await ask(JO33, 'S1', ROUTE, async (q) => {
    await q.step('the front page, "Am I saving enough?"', async () => { await at(page); await openSimple(page, ''); await page.getByTestId('front.q.b').click(); });
    await q.step('Jo\'s figures, then Show what I need', () => answer(page, 'b', JO_B));
    const text = await visibleText(page);

    // going in now, by hand
    const inAllNow = shareOfPay(JO33.ownPct + JO33.employerPct, JO33.pay);              // 253.33
    const takeHomeNow = fromTakeHome(shareOfPay(JO33.ownPct, JO33.pay));                 // 126.67
    const employerNow = shareOfPay(JO33.employerPct, JO33.pay);                          // 95
    q.exact('what goes in a month now, in all', grab(/Paying in [\d.]+% of your pay as now \(£([\d,]+) a month/, text), pounds(inAllNow), { byHand: '8% × 38,000 ÷ 12 = 253.33', tolerance: 1 });
    q.exact('what leaves Jo\'s take-home pay now', grab(/£([\d,]+)(?: a month)? from (?:your|Jo's) take-home pay/, text), pounds(takeHomeNow), { byHand: '5% × 38,000 ÷ 12 = 158.33 going in; × 0.8 = 126.67 from take-home pay', tolerance: 1 });
    q.exact('the employer\'s part now', grab(/£([\d,]+)(?: a month)? from (?:your|Jo's) employer/, text), pounds(employerNow), { byHand: '3% × 38,000 ÷ 12 = 95', tolerance: 1 });

    // what is needed: T read off the page, everything else worked from it
    const T = grab(/(\d+)% of your pay in all/, text);
    q.within('the share of pay in all that would be enough', T, JO33.ownPct + JO33.employerPct + 1, 99, { byHand: 'more than the 8% going in now (Jo is not on course), less than all of the pay' });
    if (T !== null) {
      const inAll = shareOfPay(T, JO33.pay);
      const ownPct = T - JO33.employerPct;
      const takeHome = fromTakeHome(shareOfPay(ownPct, JO33.pay));
      q.exact(`what ${T}% comes to a month in all`, grab(/£([\d,]+) a month (?:in all )?going into your pension/, text), pounds(inAll), { byHand: `${T} × 38,000 ÷ 1200 = ${inAll.toFixed(2)}`, tolerance: 1 });
      q.exact(`Jo's own share at ${T}%`, grab(/you (\d+)%/, text), ownPct, { byHand: `${T}% − the employer's 3%` });
      const takeHomes = [...text.matchAll(/£([\d,]+)(?: a month)? from (?:your|Jo's) take-home pay/g)].map((m) => money(m[1]));
      q.exact(`what leaves Jo's take-home pay at ${T}%`, takeHomes.find((v) => Math.abs(v - takeHome) <= 1) ?? takeHomes[takeHomes.length - 1] ?? null, pounds(takeHome),
        { byHand: `${ownPct}% × 38,000 ÷ 12 = ${shareOfPay(ownPct, JO33.pay).toFixed(2)} going in from Jo; × 0.8 = ${takeHome.toFixed(2)} from take-home pay`, tolerance: 1,
          says: 'was not told what leaves Jo\'s pay', did: (/\d+% of your pay in all[^.]*/.exec(text) || ['no "of your pay in all" line'])[0] + (takeHomes.length ? '' : '; no take-home figure on the page') });
      // a £ figure labelled as Jo's that is the total going in
      const labelled = /you \d+%, £([\d,]+) a month/.exec(text);
      q.never('the answer', labelled && Math.abs(money(labelled[1]) - inAll) <= 1 ? [labelled[0]] : [], { must: 'no total going in labelled as Jo\'s own', owner: 'SAVER' });
    }

    // carrying on as now (S2): what Jo could spend, and the pot at 60 in a middling case
    const could = grab(/you could spend £([\d,]+) a month from 60/, text);
    q.within('what Jo could spend a month from 60 paying in as now', could, 1, JO33.wantMonthly - 1, { byHand: 'below the £2,000 wanted, since 8% is not on course' });
    const b = potBracket({ pot: JO33.pot, yearlyIn: 12 * inAllNow, years: 60 - 33 });
    q.within('the pension at 60 in a middling case, paying in as now', grab(/as now, your pension at 60:[^.]*?£([\d,]+) in a middling case/, text), b.low, b.high,
      { byHand: '22,000 + 3,040 × 27 = 104,080 (no growth) to 22,000 × 1.05^27 + 3,040 × 54.669 = 248,330 (5% a year above prices)' });

    // the State Pension (S6): on a phone "What we assumed" is folded; Jo presses it
    const fold = page.getByRole('button', { name: /What we assumed/ });
    if (await fold.isVisible().catch(() => false)) await q.step('What we assumed', () => fold.click());
    const assumed = await visibleText(page);
    q.exact('the State Pension a month', grab(/State Pension of £([\d,]+) a month/, assumed), pounds(FULL_MONTHLY), { byHand: '241.30 × 52 ÷ 12 = 1,045.63', owner: 'FACTS' });
    const spAge = /State Pension[^.]*?from (?:age )?(\d+)/.exec(assumed);
    q.exact('the age the State Pension starts', spAge ? Number(spAge[1]) : null, statePensionAgeFromAge(33), { byHand: 'born 1992 or 1993: on or after 6 April 1978, so 68', owner: 'FACTS' });
    q.reach('a way to check a State Pension forecast', /check (?:your|a) (?:State Pension )?forecast/i.test(assumed), { owner: 'FACTS' });

    // the share-of-pay slider reaches what is needed; moving it never makes a new "as now"
    await q.step('the share-of-pay slider, to the end', async () => { await page.getByTestId('b.slider.input').focus(); await page.keyboard.press('End'); });
    const shown = money((await page.getByTestId('b.slider.value').innerText().catch(() => '')).replace('%', ''));
    q.reach(`the slider at Jo's share of ${T === null ? 'what is needed' : `${T - JO33.employerPct}%`}`, T !== null && shown !== null && shown >= T - JO33.employerPct, { did: `the slider goes no further than ${shown}%` });
    const after = await visibleText(page);
    const asNow = /Paying in ([\d.]+)% of your pay as now/.exec(after);
    q.never('the answer after the slider moved', asNow && Number(asNow[1]) !== JO33.ownPct + JO33.employerPct ? [asNow[0]] : [], { must: '"as now" only beside the 8% Jo typed', owner: 'SAVER' });
    q.never('the answer', await neverOnAnyPage(page));
  });
});
