/**
 * s09 · Alex, 57 · M4, M5, M6 · totals only · HOLD, SAVER, FACTS
 *
 * Alex, 57, signed in from the start, makes the plan in the full view's set-up: stop at 60, a pension of £410,000 and an
 * ISA of £40,000 as totals, no funds listed. Saves, locks from Stress settings, then reads every plan page in both views.
 * Worked by hand: the pension is £410,000 wherever the plan states it; the State Pension starts at 67 (born 1968 or
 * 1969); the years to go are worked from the stop month the plan states on About.
 */
import { test } from '@playwright/test';
import { ask } from './ask.js';
import { accountFor, made } from './account.js';
import { at, signIn, planPage, settled, fullPage, openFull } from './routes.js';
import { visibleText, moneyAll, neverOnAnyPage, figuresOn, fact } from './read.js';
import { fullViewWizard, stressTotals, lockFromStressSettings } from './made.js';
import { knownUnanswered } from './known.js';
import { ALEX57 } from './people.js';
import { statePensionAgeFromAge } from './hand/statePension.js';
import { monthsBetween } from './hand/dates.js';
import { readFileSync } from 'node:fs';

const VERSION = JSON.parse(readFileSync(new URL('../../package.json', import.meta.url), 'utf8')).version;
const ROUTE = { path: 'the full view\'s set-up > Stress settings: pension £410,000, ISA £40,000, stop 60 > Save > lock > every plan page, both views', who: 'signed in', view: 'full, then simple', asked: 'whether totals are enough, without the funds' };
const NEVER_HERE = ['without a pension pot on record', 'Record what you hold', '0% of the plan’s mix held', "0% of the plan's mix held", 'Short by', 'No pension pot today', 'runs out at 61'];

test('s09 · Alex, 57, plans with totals only: £410,000 and £40,000', async ({ page }) => {
  knownUnanswered('s09');
  test.setTimeout(300_000);
  const me = await made(accountFor(ALEX57), { lastSeenVersion: VERSION });
  await ask(ALEX57, 'M4', ROUTE, async (q) => {
    await at(page);
    await q.step('sign in', () => signIn(page, me));
    await q.step('the full view\'s set-up: Alex at 60', () => fullViewWizard(page, { name: 'Alex at 60', age: ALEX57.age, stopAge: ALEX57.stopAge }));
    await q.step('Stress settings: £410,000 and £40,000, Save', () => stressTotals(page, { pension: ALEX57.pot, isa: ALEX57.isa }));
    await q.step('lock from Stress settings', () => lockFromStressSettings(page));

    // the full view: the pension on Accumulation, the stage and the stop on the chip and the plan document
    await q.step('the full view, Accumulation', () => fullPage(page, 'accumulation'));
    const acc = await figuresOn(page);
    q.reach('£410,000 as the pension on Accumulation', acc.some((v) => v === ALEX57.pot), { did: `no £410,000 on Accumulation (${acc.slice(0, 6).map((v) => `£${v.toLocaleString('en-GB')}`).join(', ')})`, owner: 'SAVER' });
    const fullNever = [];
    for (const name of ['accumulation', 'plan document', 'stress settings', 'transition']) {
      if (!(await q.step(`the full view, ${name}`, () => fullPage(page, name)))) continue;
      const t = await page.locator('body').innerText();
      for (const w of NEVER_HERE) if (t.includes(w)) fullNever.push({ where: `full view ${name}`, found: [w] });
      fullNever.push({ where: `full view ${name}`, found: await neverOnAnyPage(page, { view: 'full' }) });
    }
    const chip = (await fact(page, 'stage', { view: 'full', page: 'top', timeout: 5_000 }))?.value ?? null;

    // the simple view
    await q.step('back to the simple view', async () => { await page.getByRole('link', { name: /Back to the simple view/ }).first().click(); await page.waitForURL((u) => /#\/plan\//.test(u.hash), { timeout: 30_000 }); });
    const planId = /#\/plan\/([^/?]+)/.exec(new URL(page.url()).hash)?.[1];
    const simpleNever = [];
    const reads = {};
    for (const name of ['home', 'about', 'saving', 'income', 'hold', 'move', 'lasts']) {
      await q.step(`simple ${name}`, async () => { await planPage(page, planId, name); await settled(page).catch(() => {}); });
      const t = await visibleText(page);
      reads[name] = t;
      if (name === 'home') reads.stage = (await fact(page, 'stage', { page: 'home', timeout: 5_000 }))?.value ?? null;
      for (const w of NEVER_HERE) if (t.includes(w)) simpleNever.push({ where: `simple ${name}`, found: [w] });
      if (/£0\b[^\n]*(?:at|by) 60|projected[^\n]*£0\b/i.test(t)) simpleNever.push({ where: `simple ${name}`, found: ['£0 projected'] });
      simpleNever.push({ where: `simple ${name}`, found: await neverOnAnyPage(page) });
    }
    q.reach('£410,000 as the pension on What you pay in', moneyAll(reads.saving).includes(ALEX57.pot) || (await figuresOn(page)).includes(ALEX57.pot), { did: 'no £410,000 on What you pay in', owner: 'SAVER' });
    q.neverAcross([...fullNever, ...simpleNever], { owner: 'HOLD' });

    // one stage, one stop month, one time to go
    q.same('the stage', [{ where: 'simple home', value: reads.stage }, { where: 'full view chip', value: chip }], { everywhere: true, owner: 'FACTS' });
    const stopAbout = /stop work in ((?:January|February|March|April|May|June|July|August|September|October|November|December) \d{4})/.exec(reads.about)?.[1] ?? null;
    const stopHome = /stop work in ((?:January|February|March|April|May|June|July|August|September|October|November|December) \d{4})/.exec(reads.home)?.[1] ?? null;
    q.same('the month work stops', [{ where: 'About', value: stopAbout }, { where: 'home', value: stopHome }], { everywhere: true, owner: 'FACTS' });
    if (stopAbout) {
      const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const [mName, y] = stopAbout.split(' ');
      const toGo = monthsBetween('2026-11', `${y}-${String(MONTHS.indexOf(mName) + 1).padStart(2, '0')}`);
      // where the site says it (the register, facts.js yearsToGo): "3 years of saving" on What you pay in, "… 3 years left" on
      // the home (the site never says a countdown, "to go" or "away", to anyone: src/v7/copy/banned.js)
      const said = /(\d+) years?(?: and (\d+) months?)? (?:to go|away|from now|left|of saving)/.exec(reads.home + '\n' + reads.about + '\n' + reads.saving);
      q.exact('the whole years to go, from the stop month on About', said ? Number(said[1]) : null, Math.floor(toGo / 12), { byHand: `November 2026 to ${stopAbout}: ${toGo} months`, owner: 'FACTS' });
    }
    // money that comes in anyway: the State Pension from 67
    const sp = /State Pension[^\n]*?from (?:age )?(\d{2})\b/.exec(reads.income);
    q.exact('the age the State Pension starts', sp ? Number(sp[1]) : null, statePensionAgeFromAge(ALEX57.age), { byHand: 'born 1968 or 1969: 67', owner: 'FACTS' });
  });
});
