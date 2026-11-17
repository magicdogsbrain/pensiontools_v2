/**
 * s26 · Jo, 33 · X2, R1, S12 · Jo's sentence said out loud on every saver surface, and five changes of mind · SAVER, FACTS, VIEWS
 *
 * "I want £2,000 a month from 60; I am 33, I earn £38,000, I have £22,000; what must I pay in, as a share of my salary and
 * in pounds?" Then five changes of mind in a row — the amount (£2,500), the age (58), a lump (£10,000), back again, a
 * different age (65) — each followed at once by every figure, the plan's name, the rail and the pot table: on the guest
 * answer, the kept plan's What you pay in (left box by box, never a Save pressed), its home, and the full view's
 * Accumulation tab and Stress tester. The round-3 walks (walkers 1, 2, 9 and 10) read these screens. Worked by hand:
 *   a share T% of pay in all   Jo's own part is T − 3 (the employer's 3% as given); T × 38,000 ÷ 1200 a month in all;
 *                              (T − 3)% × 38,000 ÷ 12 × 0.8 from take-home pay
 *   a lump of £10,000          lands as 10,000 × 1.25 = £12,500 with the tax added back
 *   "back again"               the same figures give the same share as the first answer
 */
import { test, expect } from '@playwright/test';
import { ask } from './ask.js';
import { accountFor, confirmEmail } from './account.js';
import { at, openSimple, answer, signUp, planPage, settled, planAddress, fullPage, typeBox, savedLine, keep } from './routes.js';
import { visibleText, money, neverOnAnyPage } from './read.js';
import { knownUnanswered } from './known.js';
import { JO33, LEE58 } from './people.js';
import { JO_B } from './typed.js';
import { shareOfPay, fromTakeHome, pounds } from './hand/money.js';

const grab = (re, text) => { const m = re.exec(text); return m ? money(m[1]) : null; };
/** The answer's "what would be enough": the share in all, Jo's own share, in all a month and from take-home pay. */
const enoughOf = (t) => {
  const m = /(\d+(?:\.\d)?)% of your pay in all \(you (\d+(?:\.\d)?)%; £([\d,]+) a month in all going into your pension, (?:about )?£([\d,]+) from your take-home pay\)/.exec(t);
  return m ? { T: Number(m[1]), own: Number(m[2]), inAll: money(m[3]), takeHome: money(m[4]) } : null;
};
/** Each figure of a share said, checked against the share by hand. */
function checkShare(q, where, t) {
  const e = enoughOf(t);
  if (!e) return q.fail({ must: `${where}: what would be enough, as a share of pay and in pounds`, did: (/(Not enough|Close|On course)[^\n]{0,160}/.exec(t) || ['no verdict'])[0], owner: 'SAVER' });
  q.exact(`${where}: Jo's own share at ${e.T}% in all`, e.own, Math.round((e.T - JO33.employerPct) * 10) / 10, { byHand: `${e.T}% − the employer's 3%`, owner: 'SAVER' });
  q.exact(`${where}: ${e.T}% a month in all`, e.inAll, pounds(shareOfPay(e.T, JO33.pay)), { byHand: `${e.T} × 38,000 ÷ 1200`, tolerance: 1, owner: 'SAVER' });
  q.exact(`${where}: from Jo's take-home pay at ${e.T}%`, e.takeHome, pounds(fromTakeHome(shareOfPay(e.T - JO33.employerPct, JO33.pay))), { byHand: `${e.T - JO33.employerPct}% × 38,000 ÷ 12 × 0.8`, tolerance: 1, owner: 'SAVER' });
  return e;
}
const aimIn = (t) => { const m = /(?:Not enough for|On course for|Close — ) ?£([\d,]+) a month from (\d+)/.exec(t); return m ? { monthly: money(m[1]), age: Number(m[2]) } : null; };

test('s26 · Jo, 33, says what she wants, then changes her mind five times, as a guest and signed in, in both views', async ({ page }) => {
  knownUnanswered('s26');
  test.setTimeout(600_000);
  const me = accountFor(JO33);
  await ask(JO33, 'X2', { path: 'Am I saving enough? > Try a change ×5 > Keep > make an account > What you pay in ×5 (boxes left, no Save) > home > full view Accumulation and Stress tester', who: 'guest, then signed in', asked: 'whether every figure, the name, the rail and the pot table follow each change at once' }, async (q) => {
    await q.step('the front page, "Am I saving enough?"', async () => { await at(page); await openSimple(page, ''); await page.getByTestId('front.q.b').click(); });
    await q.step('Jo\'s figures, then Show what I need', () => answer(page, 'b', JO_B));
    const first = checkShare(q, 'the answer, £2,000 from 60', await visibleText(page));

    // five changes of mind on the answer, each followed at once
    // each press as a person makes it: on a button that is ready (a press while the answer is being worked out is not taken)
    const press = async (id, n) => { for (let i = 0; i < n; i++) { await settled(page, 120_000); await page.getByTestId(id).click(); } await settled(page, 120_000); };
    const changes = [
      ['£2,500 a month', () => press('b.try.spend.up', 5), { monthly: 2500, age: 60 }],
      ['stop at 58', () => press('b.try.stop.down', 2), { monthly: 2500, age: 58 }],
      ['£10,000 put in now', async () => { const b = page.getByTestId('b.try.lump'); await b.fill('10000'); await b.press('Tab'); await settled(page, 120_000); }, { monthly: 2500, age: 58 }],
      ['back again', async () => { await page.getByTestId('b.try.lump.back').click(); await settled(page, 120_000); await press('b.try.spend.down', 5); await press('b.try.stop.up', 2); }, { monthly: 2000, age: 60 }],
      ['stop at 65', () => press('b.try.stop.up', 5), { monthly: 2000, age: 65 }]
    ];
    for (const [what, act, want] of changes) {
      await q.step(`Try a change: ${what}`, act);
      const t = await visibleText(page);
      const aim = aimIn(t);
      q.exact(`after "${what}": the amount the answer is for`, aim ? aim.monthly : null, want.monthly, { owner: 'SAVER' });
      q.exact(`after "${what}": the age the answer is for`, aim ? aim.age : null, want.age, { owner: 'SAVER' });
      const e = checkShare(q, `after "${what}"`, t);
      if (what === '£10,000 put in now') q.exact('the lump with the tax added back', grab(/£10,000[^.]*?£([\d,]+) in your pension/, t), 12500, { byHand: '10,000 × 1.25', owner: 'SAVER' });
      if (what === 'back again' && e && first) q.exact('back again: the same share as the first answer', e.T, first.T, { owner: 'SAVER' });
      const name = await page.getByTestId('b.keep.name').inputValue().catch(() => '');
      q.never('the name the keep box suggests', /paying £/.test(name) ? [name] : [], { must: 'no pay-in in a kept plan\'s name (two Keep buttons keep two pay-ins)', owner: 'FACTS' });
    }
    q.never('the answer', await neverOnAnyPage(page));

    // kept, signed up, on the plan
    await q.step('Keep: paying in as now', () => keep(page, 'b'));
    await q.step('Sign in or make an account', () => page.getByTestId('b.keep.toAccount').click());
    await q.step('make an account', () => signUp(page, me, confirmEmail));
    await q.step('back on the plan', () => page.waitForURL((u) => /#\/plan\//.test(u.hash), { timeout: 30_000 }));
    const planId = planAddress(page)?.planId;

    // What you pay in: each box left (Tab), never Save — the name, the rail, the stop line and the pot table follow at once
    const wants = [['£2,500 a month', { 'want.monthly': 2500 }, { monthly: 2500, age: 65 }], ['stop at 58', { 'want.stopAge': 58 }, { monthly: 2500, age: 58 }],
      ['back again', { 'want.monthly': 2000, 'want.stopAge': 60 }, { monthly: 2000, age: 60 }], ['stop at 65', { 'want.stopAge': 65 }, { monthly: 2000, age: 65 }]];
    for (const [what, boxes, want] of wants) {
      await q.step(`What you pay in: ${what}, the box left`, async () => {
        await planPage(page, planId, 'saving');
        for (const [path, v] of Object.entries(boxes)) { const b = page.getByTestId(`plan.saving.${path}`); await b.fill(String(v)); await b.press('Tab'); }
        await expect(page.locator('.plan-kicker').first()).toContainText(`Stop at ${want.age} · £${want.monthly.toLocaleString('en-GB')} a month`, { timeout: 30_000 }).catch(() => {});
        await settled(page, 120_000).catch(() => {});
      });
      const kicker = (await page.locator('.plan-kicker').first().innerText().catch(() => '')).replace(/\s+/g, ' ');
      const rail = (await page.locator('[data-region="rail"]').first().innerText().catch(() => '')).replace(/\s+/g, ' ');
      const last = (await page.getByTestId('plan.saving.pot.table').locator('tr.is-last').innerText().catch(() => '')).trim();
      const t = await visibleText(page);
      q.reach(`after "${what}": the plan's name says ${want.age} and £${want.monthly}`, kicker.includes(`Stop at ${want.age} · £${want.monthly.toLocaleString('en-GB')} a month`), { did: kicker, owner: 'FACTS' });
      q.reach(`after "${what}": the rail says stopping work at ${want.age}`, rail.includes(`Stopping work at ${want.age}`), { did: (/Stopping work at \d+/.exec(rail) || ['no stop on the rail'])[0], owner: 'FACTS' });
      q.exact(`after "${what}": the pot table ends at`, Number((/^\d+/.exec(last) || [NaN])[0]) || null, want.age, { owner: 'SAVER' });
      q.reach(`after "${what}": "You stop work in …, at ${want.age}"`, new RegExp(`You stop work in [A-Za-z]+ \\d{4}, at ${want.age}`).test(t), { did: (/You stop work in [^:]*/.exec(t) || ['no stop line'])[0], owner: 'SAVER' });
      const aim = aimIn(t);
      q.exact(`after "${what}": the answer is for`, aim ? `${aim.monthly} from ${aim.age}` : null, `${want.monthly} from ${want.age}`, { owner: 'SAVER' });
    }
    // the home and a reload: the last change was kept
    await q.step('the plan\'s home, after a reload', async () => { await page.reload(); await planPage(page, planId, 'home'); await settled(page, 120_000); });
    const home = await visibleText(page);
    const aimHome = aimIn(home);
    q.exact('the home after a reload: the answer is for', aimHome ? `${aimHome.monthly} from ${aimHome.age}` : null, '2000 from 65', { owner: 'SAVER' });
    q.never('the home', await neverOnAnyPage(page));

    // "See the ways to make it fit" from the home: £2,500 a month from 58 tried, then Use what would be enough — the plan then
    // wants £2,500 from 58 too, never only the pay-in (walker 1, high 1)
    await q.step('See the ways to make it fit', async () => {
      await page.getByTestId('plan.home.saver.ways').click();
      await expect(page.locator('#app [data-screen]')).toHaveAttribute('data-screen', 'b.numbers', { timeout: 15_000 });
      await page.getByTestId('b.action.onward').click();
      await expect(page.locator('#app [data-screen]')).toHaveAttribute('data-screen', 'b.spend', { timeout: 15_000 });
      await page.getByTestId('b.action.show').click();
      await expect(page.locator('#app [data-screen]')).toHaveAttribute('data-screen', 'b.answer', { timeout: 30_000 });
      await settled(page, 120_000);
    });
    await q.step('Try a change: stop at 58, £2,500 a month', async () => { await press('b.try.stop.down', 7); await press('b.try.spend.up', 5); });
    const tried = aimIn(await visibleText(page));
    q.exact('the answer tried is for', tried ? `${tried.monthly} from ${tried.age}` : null, '2500 from 58', { owner: 'SAVER' });
    await q.step('Use these in the plan', async () => {
      const enough = page.getByTestId('b.action.use.enough');
      if (await enough.isVisible().catch(() => false)) await enough.click(); else await page.getByTestId('b.action.use').click();
      await expect(page.getByTestId('b.use.done')).toBeVisible({ timeout: 30_000 });
    });
    await q.step('the plan\'s home after Use', async () => { await planPage(page, planId, 'home'); await settled(page, 120_000); });
    const used = aimIn(await visibleText(page));
    q.exact('the home after Use: the answer is for', used ? `${used.monthly} from ${used.age}` : null, '2500 from 58', { byHand: 'what was tried: £2,500 a month from 58', owner: 'SAVER' });
    const usedName = (await page.locator('.plan-kicker').first().innerText().catch(() => '')).replace(/\s+/g, ' ');
    q.reach('the plan\'s name after Use says 58 and £2,500', usedName.includes('Stop at 58 · £2,500 a month'), { did: usedName, owner: 'FACTS' });

    // the full view: Retiring at 60 typed and left — the plan menu's name and Stress tester's starting balances follow
    await q.step('the full view\'s Accumulation tab: Retiring at 60', async () => { await fullPage(page, 'accumulation'); await typeBox(page, '#acRetireAge', 60); });
    q.reach('"Saved" by the Accumulation heading', await savedLine(page, 'accumulation.saveState'), { owner: 'VIEWS' });
    await expect(page.locator('#scenarioActiveName')).toContainText('Stop at 60', { timeout: 30_000 }).catch(() => {});
    const menu = (await page.locator('#scenarioActiveName').innerText().catch(() => '')).trim();
    q.reach('the plan menu names the stop at 60', /Stop at 60/.test(menu), { did: menu, owner: 'VIEWS' });
    await q.step('Stress tester → Will it last?', () => fullPage(page, 'will it last'));
    const start = (await page.locator('#mcStartSummary').innerText().catch(() => '')).replace(/\s+/g, ' ');
    q.reach('Will it last? starts from the pots at 60', /at retirement \(age 60\)/.test(start), { did: start.slice(0, 160), owner: 'VIEWS' });
    q.never('the full view', await neverOnAnyPage(page, { view: 'full' }));
  });
});

test('s26 · Jo signs in with plans made without an account in the window, reloads before answering, and is asked again', async ({ page }) => {
  knownUnanswered('s26');
  test.setTimeout(240_000);
  const me = accountFor(JO33, 'returning');
  await ask(JO33, 'R1', { path: 'Am I saving enough? > Keep (no account) > Your account: make an account > reload before answering the offer', who: 'guest, then signed in', asked: 'whether plans made without an account can still be brought in after a reload' }, async (q) => {
    await q.step('the front page, "Am I saving enough?"', async () => { await at(page); await openSimple(page, ''); await page.getByTestId('front.q.b').click(); });
    await q.step('Jo\'s figures, then Show what I need', () => answer(page, 'b', JO_B));
    await q.step('Keep: paying in as now (no account)', () => keep(page, 'b'));
    await q.step('Your account: make an account', () => signUp(page, me, confirmEmail));
    const offer = page.getByTestId('guest.bringIn');
    const first = await offer.waitFor({ timeout: 30_000 }).then(() => true, () => false);
    q.reach('the offer to bring the plan in, after signing in', first, { owner: 'VIEWS' });
    await q.step('a reload before answering', async () => { await page.reload(); });
    const again = await offer.waitFor({ timeout: 30_000 }).then(() => true, () => false);
    q.reach('the offer again after the reload', again, { did: 'no offer: the plan made without an account sits in the window with no way to bring it in', owner: 'VIEWS' });
  });
});

test('s26 · Lee, 58, wants more than paying in could ever reach: the answer never offers a pay-in past the allowance', async ({ page }) => {
  knownUnanswered('s26');
  test.setTimeout(240_000);
  await ask(LEE58, 'S12', { path: 'front page > Am I saving enough? > Lee\'s figures > £2,200 a month from 63 > Show what I need', who: 'guest', asked: 'whether every way offered could really be paid' }, async (q) => {
    await q.step('the front page, "Am I saving enough?"', async () => { await at(page); await openSimple(page, ''); await page.getByTestId('front.q.b').click(); });
    await q.step('Lee\'s figures, then Show what I need', () => answer(page, 'b', { numbers: { 'you.age': LEE58.age, 'you.pot': LEE58.pot, 'you.payIn.kind': 'split', 'you.payIn.own': LEE58.fromTakeHome, 'you.payIn.employer': LEE58.employer, 'stop.age': LEE58.stopAge }, spend: { 'spend.amount': LEE58.wantMonthly } }));
    const t = await visibleText(page);
    // the yearly allowance: £60,000 a year is £5,000 a month going in; nothing past it is named as what to pay in
    const most = 60000 / 12;
    const offered = [...t.matchAll(/(?:Keep|Use): paying in £([\d,]+) a month|About £([\d,]+) a month in/g)].map((m) => money(m[1] || m[2])).filter((v) => v > most);
    q.never('the answer', offered.map((v) => `£${v.toLocaleString('en-GB')} a month`), { must: 'no pay-in past £5,000 a month offered, kept or named on the rail', byHand: '60,000 ÷ 12 = 5,000', owner: 'SAVER' });
    if (/cannot get there/.test(t)) q.reach('a way that works is named when paying in cannot', /stop(?:ping)? (?:at|later)|[Ss]pend(?:ing)? £[\d,]+ a month|spending less/.test(t), { owner: 'SAVER' });
    q.never('the answer', await neverOnAnyPage(page));
  });
});
