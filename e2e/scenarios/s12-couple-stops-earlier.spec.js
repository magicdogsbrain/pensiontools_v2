/**
 * s12 · Kim, 66 and Sam, 61 · C1, C4, C5 · Sam stops at 62 instead of 63 · COUPLE
 *
 * One account, two plans made on the screen: Kim's ("Already retired: will it last?": £280,000 in a pension, £40,000 in
 * an ISA, a final-salary pension of £6,000 a year, a State Pension of £221.20 a week) and Sam's ("Am I saving enough?":
 * £150,000, £300 a month from take-home pay and £200 from the employer, stopping at 63). Sam links the two from Sam's
 * plan and runs the household check; then Sam stops at 62 on "About you and when" and checks again. Worked by hand:
 *   a year less of paying in   (375 + 200) × 12 = 6,900: Sam's pot at 62 is at least that below the pot at 63
 *   the household's start      Kim's 280,000 + 40,000 = 320,000, plus Sam's pot at 62 read from Sam's plan
 *   the verdict                for p %, "N in 20" with N = round(p ÷ 5)
 */
import { test } from '@playwright/test';
import { ask } from './ask.js';
import { accountFor, made } from './account.js';
import { at, signIn, openSimple, answer, keep, planPage, settled, editAndSave, fullPage } from './routes.js';
import { visibleText, moneyAll, fact, neverOnAnyPage } from './read.js';
import { knownUnanswered } from './known.js';
import { KIM66, SAM61 } from './people.js';
import { goingIn } from './hand/money.js';
import { leastMove, nIn20 } from './hand/growth.js';
import { readFileSync } from 'node:fs';

const VERSION = JSON.parse(readFileSync(new URL('../../package.json', import.meta.url), 'utf8')).version;
const ROUTE = { path: 'both plans made in one account > Sam\'s household page: link Kim\'s plan > check > Sam\'s About: stop 62 > check again; both plans, both views', who: 'signed in', asked: 'whether together they have enough, and what Sam stopping a year earlier changes' };
const KIM_D = { numbers: { stopped: 'yes', 'you.age': KIM66.age, 'you.pot': KIM66.pot, savings: KIM66.isa, 'you.taxFreeTaken': 'yes', 'you.statePension.kind': 'forecast', 'you.statePension.yearly': Math.round(KIM66.statePensionWeekly * 52), 'you.finalSalary.has': true, 'you.finalSalary.yearly': KIM66.finalSalary, 'you.finalSalary.fromAge': 60 }, spend: { 'spend.amount': 2200 } };
const SAM_B = { numbers: { 'you.age': SAM61.age, 'you.pot': SAM61.pot, 'you.payIn.kind': 'split', 'you.payIn.own': SAM61.fromTakeHome, 'you.payIn.employer': SAM61.employer, 'stop.age': SAM61.stopAge }, spend: { 'spend.amount': 1800 } };

/** The household check on a plan's household page: pressed, and its result read. */
async function check(page, planId) {
  await planPage(page, planId, 'household');
  await page.getByTestId('plan.household.check').click();
  await page.getByTestId('plan.household.headline').waitFor({ timeout: 120_000 });
  await settled(page).catch(() => {});
  return visibleText(page);
}

test('s12 · Kim and Sam: Sam stops at 62 instead of 63, and the household check follows', async ({ page }) => {
  knownUnanswered('s12');
  test.setTimeout(420_000);
  const me = await made(accountFor({ name: 'Kim and Sam' }), { lastSeenVersion: VERSION, view: 'simple' });
  await ask({ name: 'Kim, 66 and Sam, 61' }, 'C4', ROUTE, async (q) => {
    await at(page);
    await q.step('sign in', () => signIn(page, me));
    const kim = await q.step('Kim\'s plan: Will it last? > Keep', async () => { await openSimple(page, '#/d/numbers'); await answer(page, 'd', KIM_D); return keep(page, 'd'); });
    const sam = await q.step('Sam\'s plan: Am I saving enough? > Keep as a new plan', async () => { await openSimple(page, '#/b/numbers'); await answer(page, 'b', SAM_B); return keep(page, 'b'); });
    await q.step('Sam\'s household page: link Kim\'s plan', async () => {
      await planPage(page, sam, 'household');
      const pick = page.getByTestId('plan.household.link.choice');
      const options = await pick.locator('option').evaluateAll((os) => os.map((o) => ({ value: o.value, text: o.textContent })));
      const kimOption = options.find((o) => o.value && o.value === kim) || options.find((o) => /62|66|2,200|Kim/.test(o.text) && o.value);
      await pick.selectOption(kimOption ? kimOption.value : { index: 1 });
      await page.getByTestId('plan.household.link').click();
    });
    const p63 = await q.step('Sam\'s pot at 63, on Sam\'s plan', async () => { await planPage(page, sam, 'plan'); await settled(page).catch(() => {}); return (await fact(page, 'pot.atStop', { page: 'plan' }))?.value ?? null; });
    const before = await q.step('the household check', () => check(page, sam));
    // C5: the link shows from Kim's plan too, in both views
    await q.step('Kim\'s household page', async () => { await planPage(page, kim, 'household'); await settled(page).catch(() => {}); });
    const fromKim = await visibleText(page);
    q.reach('the link to Sam\'s plan, from Kim\'s plan', /linked|together|household/i.test(fromKim) && !/(not linked|no other plan)/i.test(fromKim), { did: fromKim.split('\n').filter((l) => /link/i.test(l)).slice(0, 2).join(' / ') || 'no word of the link', owner: 'COUPLE' });
    const fullHousehold = await q.step('the full view, Household', async () => (await fullPage(page, 'household')) ? page.locator('body').innerText() : '');
    q.reach('both plans on the full view\'s Household tab', /linked|both plans|together/i.test(fullHousehold), { did: fullHousehold ? 'the tab names no link' : 'no Household tab', owner: 'COUPLE' });

    // C4: Sam stops at 62
    await q.step('Sam\'s About: stop at 62', () => editAndSave(page, sam, 'about', 'stopAge', SAM61.stopAgeLater));
    const p62 = await q.step('Sam\'s pot at 62, on Sam\'s plan', async () => { await planPage(page, sam, 'plan'); await settled(page).catch(() => {}); return (await fact(page, 'pot.atStop', { page: 'plan' }))?.value ?? null; });
    q.follows('Sam\'s pot at the stop, 63 against 62', p62, p63, leastMove(1, 12 * (goingIn(SAM61.fromTakeHome) + SAM61.employer)), { byHand: '(375 + 200) × 12 = 6,900 a year less going in', owner: 'COUPLE' });
    const after = await q.step('check again', () => check(page, sam));
    if (p62 !== null) {
      const start = KIM66.pot + KIM66.isa + p62;
      q.reach(`the household's starting pot, £${start.toLocaleString('en-GB')}`, moneyAll(after).some((v) => Math.abs(v - start) <= 1000), { did: `sums on the page: ${moneyAll(after).slice(0, 8).map((v) => `£${v.toLocaleString('en-GB')}`).join(', ')}`, byHand: `320,000 (Kim's) + £${p62.toLocaleString('en-GB')} (Sam's at 62)`, owner: 'COUPLE' });
    }
    // the verdict's words and its percentage agree
    const v = /(\d{1,3})%/.exec(after); const n = /(\d+) (?:times )?in 20/.exec(after);
    if (v && n) q.exact(`the verdict's "N in 20" for ${v[1]}%`, Number(n[1]), nIn20(Number(v[1])), { byHand: `round(${v[1]} ÷ 5)`, owner: 'MEASURE' });
    // whose age, and both chances after "check again"
    const flat = (await visibleText(page, 'plan.household.result')).replace(/\s+/g, ' ');
    const ages = [...flat.matchAll(/(?:until|to|at) (?:age )?(\d{2})\b(?! ·)/g)].map((m) => flat.slice(Math.max(0, m.index - 30), m.index + m[0].length + 15).trim());
    q.never('the household check\'s result', ages.filter((s) => !/Kim|Sam/.test(s)).slice(0, 3), { must: 'every age said with whose it is', owner: 'COUPLE' });
    q.reach('the chance before and after the change, both on the page', (after.match(/\d+ (?:times )?in 20|\d{1,3}%/g) || []).length >= 2 && /before|was|now/i.test(after), { did: 'one chance only', owner: 'COUPLE' });
    q.never('the household check', [...await neverOnAnyPage(page), ...(/\bUntil \d\b/.test(before) ? ['Until <plan year>'] : [])]);
  });
});
