/**
 * s03 · Sam, 45 · S3, S4 · the pay-in in one unit · SAVER
 *
 * Sam pays £300 a month out of take-home pay and the employer adds £250. Worked by hand:
 *   going in from Sam   300 × 1.25 = 375 (relief at source)
 *   in all              375 + 250 = 625 a month
 *   £100 more from pay  100 × 1.25 = 125 more going in: 750 in all
 * Every page that states a pay-in, in both views, must state £300 from take-home pay, £250 from the employer and £625 in
 * all (or leave a figure out), never one of them under another's name.
 */
import { test } from '@playwright/test';
import { ask } from './ask.js';
import { accountFor, confirmEmail } from './account.js';
import { at, openSimple, answer, setField, signUp, planPage, settled, fullPage, planAddress } from './routes.js';
import { visibleText, money, fact, neverOnAnyPage } from './read.js';
import { knownUnanswered } from './known.js';
import { SAM45 } from './people.js';
import { SAM_B } from './typed.js';
import { goingIn, fromTakeHome } from './hand/money.js';

const ROUTE = { path: 'Am I saving enough? > the pay-in as £300 from take-home pay and £250 from the employer > Show > Try a change: £100 more > Keep > make an account > every page that states a pay-in, both views', who: 'guest, then signed in', asked: 'whether £300 from take-home pay and £250 from the employer are each counted once' };
const grab = (re, text) => { const m = re.exec(text); return m ? money(m[1]) : null; };

test('s03 · Sam, 45, pays £300 from take-home pay and the employer £250: one unit everywhere', async ({ page }) => {
  knownUnanswered('s03');
  test.setTimeout(240_000);
  const me = accountFor(SAM45);
  await ask(SAM45, 'S3', ROUTE, async (q) => {
    const fromSam = goingIn(SAM45.fromTakeHome);                 // 375
    const inAll = fromSam + SAM45.employer;                       // 625

    // the form asks for what leaves Sam's pay, and says what goes in
    await q.step('Am I saving enough?, step 1', async () => { await at(page); await openSimple(page, '#/b/numbers'); });
    await q.step('the pay-in as two amounts', async () => { for (const [p, v] of Object.entries(SAM_B.numbers)) await setField(page, 'b', p, v); });
    const step1 = await visibleText(page);
    q.reach('the form saying it wants what leaves Sam\'s take-home pay', /take-home/i.test(step1), { did: 'no mention of take-home pay on step 1', owner: 'SAVER' });
    q.exact('what goes in from Sam for £300 typed', [...step1.matchAll(/£([\d,]+)(?: a month)? (?:going in )?from you/g)].map((m) => money(m[1])).find((v) => v === fromSam) ?? grab(/£([\d,]+)(?: a month)? (?:going in )?from you/, step1), fromSam,
      { byHand: '300 × 1.25 = 375 (the tax added back at source)', owner: 'SAVER' });

    await q.step('Next, £2,400, Show what I need', () => answer(page, 'b', SAM_B));
    const ans = await visibleText(page);
    q.exact('what goes in a month, in all, on the answer', grab(/Paying in £([\d,]+) a month as now/, ans), inAll, { byHand: '375 + 250 = 625', owner: 'SAVER' });
    // every "on course" line gives what leaves take-home pay beside what goes in
    const lines = ans.split('\n').filter((l) => /on course|To be on course/.test(l) && /£[\d,]+ a month/.test(l));
    const noTakeHome = lines.filter((l) => !/take-home/.test(l));
    q.never('the answer\'s "on course" lines', noTakeHome.slice(0, 2), { must: 'each "to be on course" line saying what leaves take-home pay (going in × 0.8)', owner: 'SAVER' });
    for (const l of lines) {
      const gi = grab(/£([\d,]+) a month going into your pension/, l);
      const th = grab(/£([\d,]+)(?: a month)? from (?:your )?take-home pay/, l);
      if (gi !== null && th !== null) q.exact(`what leaves take-home pay for £${gi} going in`, th, Math.round(fromTakeHome(gi - SAM45.employer)), { byHand: `(${gi} − the employer's 250) × 0.8`, tolerance: 1 });
    }

    // S4: £100 more from Sam's pay
    await q.step('Try a change: pay in more, twice', async () => { await page.getByTestId('b.try.payIn.up').click(); await settled(page); await page.getByTestId('b.try.payIn.up').click(); await settled(page); });
    const tried = await visibleText(page);
    const triedTotal = grab(/Paying in £([\d,]+) a month/, tried);
    q.exact('what goes in, in all, with £100 more from Sam\'s pay', triedTotal, goingIn(SAM45.fromTakeHome + 100) + SAM45.employer, { byHand: '(300 + 100) × 1.25 + 250 = 750', owner: 'SAVER' });
    const asNow = /Paying in £([\d,]+) a month as now/.exec(tried);
    q.never('the answer after trying £100 more', asNow && money(asNow[1]) !== inAll ? [asNow[0]] : [], { must: '"as now" only beside the £625 Sam pays', owner: 'SAVER' });

    // keep, sign up, and read every page that states a pay-in
    await q.step('back to paying in as now', async () => { await page.getByTestId('b.try.payIn.down').click(); await settled(page); await page.getByTestId('b.try.payIn.down').click(); await settled(page); });
    await q.step('Keep', async () => { const now = page.getByTestId('b.action.save.now'); if (await now.isVisible().catch(() => false)) await now.click(); else await page.getByTestId('b.action.save').click(); await page.getByTestId('b.keep.made').waitFor({ timeout: 30_000 }); });
    await q.step('Sign in or make an account', () => page.getByTestId('b.keep.toAccount').click());
    await q.step('make an account', () => signUp(page, me, confirmEmail));
    await q.step('back on the plan', () => page.waitForURL((u) => /#\/plan\//.test(u.hash), { timeout: 30_000 }));
    const planId = planAddress(page)?.planId;
    const readings = { fromTakeHome: [], employer: [], total: [] };
    for (const name of ['home', 'saving']) {
      await q.step(`simple ${name}`, async () => { await planPage(page, planId, name); await settled(page).catch(() => {}); });
      readings.fromTakeHome.push({ where: `simple ${name}`, value: (await fact(page, 'payIn.fromTakeHome', { page: name, timeout: 5_000 }))?.value ?? null });
      readings.employer.push({ where: `simple ${name}`, value: (await fact(page, 'payIn.employer', { page: name, timeout: 2_000 }))?.value ?? null });
      readings.total.push({ where: `simple ${name}`, value: (await fact(page, 'payIn.total', { page: name, timeout: 2_000 }))?.value ?? null });
      q.never(`simple ${name}`, await neverOnAnyPage(page));
    }
    await q.step('the full view, Accumulation', () => fullPage(page, 'accumulation'));
    readings.fromTakeHome.push({ where: 'full view accumulation', value: (await fact(page, 'payIn.fromTakeHome', { view: 'full', page: 'accumulation', timeout: 10_000 }))?.value ?? null });
    readings.employer.push({ where: 'full view accumulation', value: (await fact(page, 'payIn.employer', { view: 'full', page: 'accumulation', timeout: 5_000 }))?.value ?? null });
    readings.total.push({ where: 'full view accumulation', value: (await fact(page, 'payIn.total', { view: 'full', page: 'accumulation', timeout: 5_000 }))?.value ?? null });
    q.same('what leaves Sam\'s take-home pay', readings.fromTakeHome, { want: SAM45.fromTakeHome, everywhere: true, byHand: 'as typed: 300', owner: 'SAVER' });
    q.same('the employer\'s part', readings.employer, { want: SAM45.employer, byHand: 'as typed: 250', owner: 'SAVER' });
    q.same('what goes in, in all', readings.total, { want: inAll, byHand: '300 × 1.25 + 250 = 625', owner: 'SAVER' });
  });
});
