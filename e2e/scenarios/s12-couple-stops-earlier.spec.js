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
import { test, expect } from '@playwright/test';
import { ask } from './ask.js';
import { accountFor, made, plansOf } from './account.js';
import { at, signIn, openSimple, answer, keep, planPage, settled, editAndSave, fullPage, fullWizard, typeBox, savedLine } from './routes.js';
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
    // (7.12.0, lead decision 9; the second walk: "132.3% of your pay in all") no pay-in past all of Sam's pay is offered
    await q.step('Sam\'s home after the stop moved to 62', async () => { await planPage(page, sam, 'home'); await settled(page).catch(() => {}); });
    const samHome = await visibleText(page);
    const overPay = [...samHome.matchAll(/([\d.]+)% of your pay/g)].filter((m) => Number(m[1]) > 100).map((m) => m[0]);
    q.never('Sam\'s home', overPay, { must: 'no share of pay above all of Sam\'s pay', byHand: 'Sam\'s own part can be no more than the £38,000 a year Sam earns', owner: 'SAVER' });
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

// ---- 7.12.0 (the second walk, Kim and Sam in the full view): what is typed stays, and every answer uses it -------------
const ROUTE_FULL = { path: 'the full view\'s wizard: Kim > See if I can afford to retire > Settings: type, Tab, reload; Sam > I\'m still saving > Accumulation, Settings; Sam\'s Household: check with Kim', view: 'full', who: 'signed in', asked: 'whether the figures each typed into the full view are kept and used' };

test('s12 · Kim and Sam in the full view: what each types stays, and Will it last?, Try a strategy and the household check use it', async ({ page }) => {
  test.setTimeout(420_000);
  const me = await made(accountFor({ name: 'Kim and Sam' }, 'full'), { lastSeenVersion: VERSION, view: 'full' });
  await ask({ name: 'Kim, 66 and Sam, 61' }, 'X8', ROUTE_FULL, async (q) => {
    await at(page);
    await q.step('sign in', () => signIn(page, me));
    await q.step('Kim\'s plan: the full view\'s wizard > See if I can afford to retire', () => fullWizard(page, { age: KIM66.age, retired: true, retireAge: KIM66.age, start: 'start-stress' }));
    await q.step('Stress tester > Settings', () => fullPage(page, 'stress settings'));
    // decision 11: the first screen asks what everyone has; the tax-free cash rules wait under "More detail"
    const first = await visibleText(page, '#stress-stresssettings');
    q.never('Settings, as it opens', ['UFPLS', 'Money Purchase Annual Allowance', 'bed-and-ISA'].filter((w) => first.includes(w)), { must: 'no tax-free-cash rules before a pot and an income', owner: 'VIEWS' });
    q.reach('the income step empty, never a figure Kim did not give', (await page.locator('#incomeStepsEditor input[type=number][step="1000"]').first().inputValue()) === '', { did: 'a figure in the first step', owner: 'VIEWS' });
    // Kim types: the pension, the ISA, the first step, and the State Pension date as a platform shows it
    await q.step('type the pension, the ISA and what Kim wants a year', async () => {
      await typeBox(page, '#ssPot', KIM66.pot); await typeBox(page, '#ssIsaBalance', KIM66.isa);
      await typeBox(page, '#incomeStepsEditor input[type=number][step="1000"]', 28000);
    });
    await q.step('type the State Pension date as 2026-08', async () => {
      await typeBox(page, '#ssSpStartDate', '2026-08');
      await page.locator('#ssSpStartDate + [data-testid="field.problem"]').waitFor({ timeout: 15_000 }).catch(() => {});   // said a moment after the box is left
    });
    const said = await visibleText(page, '#ssSpStartDate + [data-testid="field.problem"]');
    q.reach('the date box saying it could not read "2026-08", with the format to type', /could not read “2026-08”/.test(said) && /6 August 2040/.test(said), { did: said || 'nothing beside the box', owner: 'VIEWS' });
    const line = await visibleText(page, 'settings.saveState');
    q.reach('the heading naming the State Pension start date box as not saved yet', /Not saved yet/.test(line) && /State Pension start date/.test(line), { did: line || 'nothing by the heading', owner: 'VIEWS' });
    await q.step('type the date in full', () => typeBox(page, '#ssSpStartDate', '6 August 2026'));
    q.reach('"Saved" by the heading', await savedLine(page, 'settings.saveState'), { did: await visibleText(page, 'settings.saveState'), owner: 'VIEWS' });
    // a reload: the boxes are what was typed (by hand: the figures Kim typed)
    await q.step('reload, Stress tester > Settings', async () => { await page.reload(); await fullPage(page, 'stress settings'); });
    q.exact('Kim\'s pension pot box after a reload', Number(await page.locator('#ssPot').inputValue()), KIM66.pot, { byHand: 'typed', owner: 'VIEWS' });
    q.exact('Kim\'s ISA box after a reload', Number(await page.locator('#ssIsaBalance').inputValue()), KIM66.isa, { byHand: 'typed', owner: 'VIEWS' });
    q.exact('Kim\'s first income step after a reload', Number(await page.locator('#incomeStepsEditor input[type=number][step="1000"]').first().inputValue()), 28000, { byHand: 'typed', owner: 'VIEWS' });
    // Will it last?: the what-if starts from Kim's own figures
    await q.step('Will it last?', () => fullPage(page, 'will it last'));
    q.exact('Try a strategy\'s pension pot, Kim\'s', Number(await page.locator('#tryPot').inputValue()), KIM66.pot, { byHand: 'Kim\'s pension as typed', owner: 'VIEWS' });
    q.exact('Try a strategy\'s ISA, Kim\'s', Number(await page.locator('#tryIsa').inputValue()), KIM66.isa, { byHand: 'Kim\'s ISA as typed', owner: 'VIEWS' });

    // Sam: a saver's plan from the same wizard, filled in on the Accumulation tab
    await q.step('Sam\'s plan: the wizard > I\'m still saving', () => fullWizard(page, { age: SAM61.age, retired: false, retireAge: SAM61.stopAge, start: 'start-accumulation' }));
    await q.step('the Accumulation tab: pay, pot, what goes in', async () => {
      await fullPage(page, 'accumulation');
      await typeBox(page, '#acSalary', SAM61.pay); await typeBox(page, '#acPotNow', SAM61.pot);
      await typeBox(page, '#acNetMonthly', SAM61.fromTakeHome); await typeBox(page, '#acEmployerMonthly', SAM61.employer);
    });
    q.reach('"Saved" by the Accumulation heading', await savedLine(page, 'accumulation.saveState'), { did: await visibleText(page, 'accumulation.saveState'), owner: 'VIEWS' });
    // what Sam wants: £1,300 a month after tax, typed as the year before tax on Settings
    await q.step('Settings: what Sam wants a year', async () => { await fullPage(page, 'stress settings'); await typeBox(page, '#incomeStepsEditor input[type=number][step="1000"]', 16358); });
    q.reach('"Saved" by the Settings heading', await savedLine(page, 'settings.saveState'), { did: await visibleText(page, 'settings.saveState'), byHand: '(16,358 − 12,570) × 20% = 757.60 tax; 16,358 − 757.60 = 15,600.40 a year = £1,300 a month', owner: 'VIEWS' });
    await q.step('Will it last?', () => fullPage(page, 'will it last'));
    q.exact('Try a strategy\'s pension pot on Sam\'s plan: Sam\'s, never Kim\'s or a default', Number(await page.locator('#tryPot').inputValue()), SAM61.pot, { byHand: 'Sam\'s pension today, as typed on the Accumulation tab', owner: 'VIEWS' });
    // the second walk (walker 8, high 5): the box said "SIPP / pension pot" under a line giving the pension when work stops,
    // so one page showed two pots for Sam with nothing to say which; it is the pension today, and says so, with the other
    const tryLabel = await visibleText(page, '#tryPotLabel');
    const tryHint = await visibleText(page, '#tryPotHint');
    const atStop = (/\(pension £([\d,]+)\)/.exec(await visibleText(page, '#mcStartSummary')) || [])[1] || '';
    q.reach('Try a strategy\'s pension box named as Sam\'s pension today', tryLabel === 'Your pension today (£)', { did: tryLabel || 'no label', owner: 'VIEWS' });
    q.reach('the pension when work stops beside the box, the figure the line above gives', !!atStop && tryHint.includes('£' + atStop + ' by ' + SAM61.stopAge), { did: tryHint || 'nothing under the box', byHand: `the line above: £${atStop || '?'} at ${SAM61.stopAge}`, owner: 'VIEWS' });

    // the household check from Sam's plan, with Kim's: run, never "no figures saved"
    const plans = await plansOf(me.uid);
    const kim = plans.find((p) => p.stressTool && p.stressTool.settings && +p.stressTool.settings.currentAge === KIM66.age);
    await q.step('Household: Kim\'s plan chosen, run the check', async () => {
      await fullPage(page, 'household');
      if (kim) await page.locator('#hhPartnerSelect').selectOption(kim.id);
      await page.getByRole('button', { name: 'Run the household check' }).click();
      await expect(page.locator('#hhResults')).not.toContainText('Running both plans', { timeout: 180_000 });
    });
    const hh = await visibleText(page, '#hhResults');
    q.reach('the household check run on both plans', !/no figures saved yet|no income set yet|no pot yet/.test(hh) && /in 10|in 20|%/.test(hh), { did: hh.split('\n').slice(0, 2).join(' / ') || 'nothing', owner: 'COUPLE' });
    q.reach('Kim\'s pots as typed, £320,000, in the household check', moneyAll(hh).includes(KIM66.pot + KIM66.isa), { did: `sums on the page: ${moneyAll(hh).slice(0, 8).map((v) => `£${v.toLocaleString('en-GB')}`).join(', ')}`, byHand: '280,000 + 40,000 = 320,000', owner: 'COUPLE' });
  });
});
