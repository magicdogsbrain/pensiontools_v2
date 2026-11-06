/**
 * Month by month, without an account (decided 3 November 2026): the line under Calculate / Save says why Save is off;
 * the months missed between the latest record and the month in the box are filled in with these figures — one record
 * each, in date order, marked "filled in later" in the History view (and so on the record's PDF, which prints that view);
 * a failed Calculate leaves its reason on the page until the next Calculate, and so does a Calculate refused before the
 * engine runs (the platform view's figure problem); when September, worked out again with the filled-in months on
 * record, moves from what the panel showed at Calculate, the saved line says what moved.
 *
 * The PUBLISHED build at /, opened straight onto Monthly Entry through the preview's own hand-over request
 * (src/services/OpenPlace.js), on a plan kept in this window: corpus 04 (Buckets, running) with its July–September
 * records taken out, so April to June are on record, July and August are the missed months, and September 2026 (the
 * test clock, 30 September 2026) is the month in the box.
 *
 * Fill in from a month you choose (a person who started recording part-way through a tax year could not fill in the months
 * before their first record): the same plan with its 2026/27 set up from September — with what was received and the tax
 * on it before then entered in the set-up — and September alone on record. August in the box is refused before the
 * engine runs (the set-up already counts it). October in the box: nothing after the latest record to fill, so the quiet
 * line alone; pressed, the chooser at April; Save: April to August are recorded with their share of the set-up's figures,
 * the set-up is left as entered, and October's recommendation is what it was at Calculate. The strip's income line counts
 * the months just saved and says which, and its pension figure still dates from the month it was entered.
 *
 * Firebase is never reached: every request outside the site is stopped (`outside: 'block'`).
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test, expect, PROD, REPO, FIXED_NOW, V7_PATH, CLASSIC_PATH, WORKER_DATA_MISSING } from './helpers/app.js';
import { OPEN_PLACE_KEY, makeRequest } from '../src/services/OpenPlace.js';

test.use({ outside: 'block' });

const GUEST_KEY = 'pt_guest_scenarios';
const PLAN_ID = 'FillPlan01';

function plan() {
  const p = JSON.parse(readFileSync(join(REPO, 'tests', 'fixtures', 'plans', '04-buckets-running.json'), 'utf8'));
  p.id = PLAN_ID;
  p.planDetails.name = 'Alex’s plan';
  p.isActive = true;
  delete p.household;
  p.decisionTool.history = p.decisionTool.history.filter((h) => h.date < '2026-07');   // April, May, June on record
  return p;
}
// The same plan, its 2026/27 set up from September with £11,000 received and £900 of tax before it (fictional figures, on
// purpose not five times a month's draw and tax, so a set-up moved to April would show in October), September alone on record.
function partYearPlan() {
  const p = plan();
  Object.assign(p.decisionTool.taxYears['26/27'], { startMonth: 9, remainingMonths: 7, grossIncomeToDate: 11000, taxPaidToDate: 900 });
  p.decisionTool.history = JSON.parse(readFileSync(join(REPO, 'tests', 'fixtures', 'plans', '04-buckets-running.json'), 'utf8')).decisionTool.history.filter((h) => h.date === '2026-09');
  return p;
}
const storedPlan = (page) => page.evaluate(([k, id]) => JSON.parse(sessionStorage.getItem(k)).find((p) => p.id === id), [GUEST_KEY, PLAN_ID]);

test.describe('Month by month, without an account', () => {
  test('why Save is off; the missed months filled in, in order and marked; a failed Calculate stays on the page', async ({ page, watch }) => {
    test.setTimeout(240_000);
    // as on the live site today: the engine worker asks for the market files from its own address (e2e/old-app-unchanged.spec.js)
    watch.allow(WORKER_DATA_MISSING);
    // a Calculate that fails is logged by the planner as it always was; this test makes one fail on purpose at the end
    watch.allow(/^console error: Decision error: /);

    // plant: the plan in the window and the hand-over request for Monthly Entry, then the planner
    await page.clock.setFixedTime(new Date(FIXED_NOW));
    await page.goto(PROD + V7_PATH + '#/');
    await expect(page.locator('#app [data-screen]')).toBeVisible();
    const request = makeRequest({ planId: PLAN_ID, place: 'month', back: '#/plans', at: FIXED_NOW });
    expect(request).not.toBeNull();
    const planted = plan();
    await page.evaluate(([k, text, rk, req]) => { sessionStorage.setItem(k, text); sessionStorage.setItem(rk, req); }, [GUEST_KEY, JSON.stringify([planted]), OPEN_PLACE_KEY, request]);
    await page.goto(PROD + CLASSIC_PATH);
    await expect(page.locator('#mainApp')).toBeVisible({ timeout: 45_000 });
    await expect(page.locator('#openPlaceNote')).toContainText('Opened from PensionTools.');
    const entry = page.locator('#decision-entry');
    await expect(entry).toBeVisible({ timeout: 45_000 });
    await expect(page.locator('#entryMonth')).toHaveValue('2026-09');

    // nothing calculated: Save off and the line says so; the offer names the two missed months, unticked
    const saveBtn = page.locator('#saveBtn');
    const line = page.locator('#saveStateNote');
    const calculate = page.locator('#decisionForm button[type="submit"]');
    await expect(saveBtn).toBeDisabled();
    await expect(line).toHaveText('Press Calculate to work out September 2026.');
    const fillBox = page.locator('#monthFillBox');
    const tick = page.locator('#monthFillTick');
    await expect(fillBox).toBeVisible({ timeout: 45_000 });
    await expect(page.locator('#monthFillLabel')).toHaveText('Fill in 2 months you did not record, July 2026 and August 2026, with these figures');
    await expect(page.locator('#monthFillHelp')).toHaveText('One record for each month, worked out in order with the pension figures above, marked as filled in later. Use it when you drew the same amount each month and did not record it at the time. The figures were not the pot\'s on those months, so the records are a fair picture, not exact ones.');
    await expect(tick).not.toBeChecked();
    expect(await entry.innerText()).not.toMatch(/backfill/i);

    // "This month's payment has already been made" moves the month on in its own handler: the line and the offer follow it, and back
    const paid = page.locator('#entryPaidThisMonth');
    await paid.check();
    await expect(page.locator('#entryMonth')).toHaveValue('2026-10');
    await expect(line).toHaveText('Press Calculate to work out October 2026.');
    await expect(page.locator('#monthFillLabel')).toHaveText('Fill in 3 months you did not record, July 2026 to September 2026, with these figures');
    await paid.uncheck();
    await expect(page.locator('#entryMonth')).toHaveValue('2026-09');
    await expect(line).toHaveText('Press Calculate to work out September 2026.');
    await expect(page.locator('#monthFillLabel')).toHaveText('Fill in 2 months you did not record, July 2026 and August 2026, with these figures');

    // Calculate: the panel, Save on, the line blank
    await calculate.click();
    await expect(saveBtn).toBeEnabled({ timeout: 45_000 });
    await expect(line).toHaveText('');
    await expect(page.locator('#decisionOutput')).toContainText('£');

    // a figure changed after the calculation: Save off and the line says why; Calculate again puts it right
    await page.locator('#entryIsa').fill('1000');
    await expect(saveBtn).toBeDisabled();
    await expect(line).toHaveText('Changed since the last calculation: press Calculate again.');
    await page.locator('#entryIsa').fill('');
    await calculate.click();
    await expect(saveBtn).toBeEnabled({ timeout: 45_000 });
    await expect(line).toHaveText('');

    // what the panel shows at Calculate: the figures the person reads and acts on
    const headline = async () => ({
      draw: (await page.locator('#decisionOutput .draw-row.primary .value').innerText()).trim(),
      net: (await page.locator('#decisionOutput .draw-row.total .value').innerText()).trim(),
      protection: (await page.locator('#decisionOutput').innerText()).includes('Protection Mode')
    });
    const read = await headline();

    // the fill: the tick (an instruction to Save, not a figure: Save stays on), then Save — July and August first, then September
    await tick.check();
    await expect(saveBtn).toBeEnabled();
    await expect(line).toHaveText('');
    await saveBtn.click();
    await expect(line).toContainText('September 2026 saved, with July 2026 and August 2026 filled in.', { timeout: 60_000 });
    await expect(saveBtn).toBeDisabled();
    await expect(fillBox).toBeHidden();   // no gap after September now
    // September worked out again with July and August on record: held level month after month the pot falls behind its
    // track, and the recommendation moves from what was read at Calculate — the panel is redrawn and the line says what moved
    const saved = await headline();
    expect(saved.draw).not.toBe(read.draw);
    const moved = [];
    if (saved.draw !== read.draw) moved.push('SIPP withdrawal ' + saved.draw + ' a month (it was ' + read.draw + ')');
    if (saved.net !== read.net) moved.push('income after tax ' + saved.net + ' a month (it was ' + read.net + ')');
    if (saved.protection !== read.protection) moved.push(saved.protection ? 'now in Protection Mode' : 'no longer in Protection Mode');
    await expect(line).toHaveText('September 2026 saved, with July 2026 and August 2026 filled in. September 2026 was worked out again with the filled-in months on record, and the recommendation changed: ' + moved.join('; ') + '. To record another month, change the month and press Calculate.');

    // the records: six months in order; July and August marked, with the instant; the others not; the planted three untouched
    const S = await storedPlan(page);
    const hist = S.decisionTool.history;
    expect(hist.map((h) => h.date)).toEqual(['2026-04', '2026-05', '2026-06', '2026-07', '2026-08', '2026-09']);
    for (const d of ['2026-07', '2026-08']) { const h = hist.find((x) => x.date === d); expect(h.filledIn, d).toBe(true); expect(h.filledInOn, d).toBe(FIXED_NOW); }
    for (const d of ['2026-04', '2026-05', '2026-06', '2026-09']) { const h = hist.find((x) => x.date === d); expect('filledIn' in h, d).toBe(false); expect('filledInOn' in h, d).toBe(false); }
    for (let i = 0; i < 3; i++) expect(JSON.stringify(hist[i])).toBe(JSON.stringify(planted.decisionTool.history[i]));
    // the same pension figures on every filled-in month and on September (nothing invented between months), worked out in order: the tax to date climbs
    const jun = hist[2], jul = hist[3], aug = hist[4], sep = hist[5];
    for (const h of [jul, aug, sep]) { expect(h.equity).toBe(jun.equity); expect(h.bond).toBe(jun.bond); expect(h.cash).toBe(jun.cash); }
    expect(jul.taxPaidYTD).toBeGreaterThan(jun.taxPaidYTD);
    expect(aug.taxPaidYTD).toBeGreaterThan(jul.taxPaidYTD);
    expect(sep.taxPaidYTD).toBeGreaterThan(aug.taxPaidYTD);
    expect(sep.sipp).toBeGreaterThan(0);

    // the History view: the mark beside the two dates, the sentence on the record (its PDF prints this view), nothing on September
    await page.locator('.sub-tab[data-decisiontab="history"]').click();
    const tabs = page.locator('#historyTabs .history-tab');
    await expect(tabs).toHaveCount(6);
    await expect(tabs).toHaveText(['Apr 2026', 'May 2026', 'Jun 2026', '✎ Jul 2026', '✎ Aug 2026', 'Sep 2026']);
    await expect(tabs.nth(3)).toHaveAttribute('title', 'Filled in later on 30 September 2026');
    await expect(tabs.nth(4)).toHaveAttribute('title', 'Filled in later on 30 September 2026');
    expect(await tabs.nth(5).getAttribute('title')).toBe(null);
    // a record is picked through the row of tabs on a wide screen and through the dropdown on a phone (the tabs are there but hidden)
    const mobile = page.locator('#historyMobileSelector');
    const pick = async (i, date) => { if (await tabs.nth(i).isVisible()) await tabs.nth(i).click(); else await mobile.selectOption(date); };
    await pick(3, '2026-07');
    await expect(page.locator('#historyDetail h3').first()).toHaveText('Jul 2026');
    await expect(page.locator('#historyFilledInNote')).toHaveText('✎ Filled in later on 30 September 2026, with the pension figures entered for a later month: a fair picture of this month, not an exact one.');
    await pick(5, '2026-09');
    await expect(page.locator('#historyDetail h3').first()).toHaveText('Sep 2026');
    await expect(page.locator('#historyFilledInNote')).toHaveCount(0);
    // the dropdown's words carry the mark too; whether a month is in protection is the engine's call on the figures given
    // (held flat month after month, the pot falls behind its track), so that suffix is read past here
    expect((await mobile.locator('option').allTextContents()).map((s) => s.replace(' (Protection)', '').replace('(Protection, ', '('))).toEqual(['Apr 2026', 'May 2026', 'Jun 2026', 'Jul 2026 (filled in later)', 'Aug 2026 (filled in later)', 'Sep 2026']);

    // a failed Calculate stays on the page: back on Monthly Entry, the next month (nothing to fill), a figure the engine refuses
    await page.locator('.sub-tab[data-decisiontab="entry"]').click();
    await page.locator('#entryMonth').fill('2026-10');
    await expect(line).toHaveText('Changed since the last calculation: press Calculate again.');
    await expect(fillBox).toBeHidden();
    // the box's own min stops the browser submitting a negative figure; the handler is pressed directly, as the form would press it
    await page.evaluate(() => { document.getElementById('entryIsa').value = '-5'; return window.handleDecisionSubmit({ preventDefault() {} }); });
    const alert = page.locator('#decisionCalcError');
    await expect(alert).toBeVisible();
    await expect(alert).toContainText('October 2026 could not be worked out.');
    await expect(alert).toContainText('A fund value cannot be negative');
    await expect(saveBtn).toBeDisabled();
    await expect(line).toHaveText('October 2026 could not be worked out — see the message in the panel. Put it right and press Calculate again.');
    // put right: the next Calculate replaces the alert
    await page.locator('#entryIsa').fill('');
    await calculate.click();
    await expect(saveBtn).toBeEnabled({ timeout: 45_000 });
    await expect(alert).toHaveCount(0);
    await expect(line).toHaveText('');

    // a Calculate refused before the engine runs stays on the page as well: the platform view (the default) with its parts
    // adding up to more than the pension total
    const total = page.locator('#entryPlatTotal'), platCash = page.locator('#entryPlatCash');
    await expect(total).toBeVisible();
    const cashWas = await platCash.inputValue();
    await platCash.fill(String(Number(await total.inputValue()) + 1000));
    await calculate.click();
    await expect(alert).toBeVisible();
    await expect(alert).toHaveText('October 2026 could not be worked out. The parts add up to more than the pension total — check the figures.');
    await expect(saveBtn).toBeDisabled();
    await expect(line).toHaveText('October 2026 could not be worked out — see the message in the panel. Put it right and press Calculate again.');
    await platCash.fill(cashWas);
    await calculate.click();
    await expect(saveBtn).toBeEnabled({ timeout: 45_000 });
    await expect(alert).toHaveCount(0);
    await expect(line).toHaveText('');
    // nothing more was written
    expect((await storedPlan(page)).decisionTool.history.map((h) => h.date)).toEqual(['2026-04', '2026-05', '2026-06', '2026-07', '2026-08', '2026-09']);
  });
  test('fill in from a month you choose: before the first record, a part-year set-up left as entered, the next month as it was', async ({ page, watch }) => {
    test.setTimeout(240_000);
    watch.allow(WORKER_DATA_MISSING);
    await page.clock.setFixedTime(new Date(FIXED_NOW));
    await page.goto(PROD + V7_PATH + '#/');
    await expect(page.locator('#app [data-screen]')).toBeVisible();
    const request = makeRequest({ planId: PLAN_ID, place: 'month', back: '#/plans', at: FIXED_NOW });
    const planted = partYearPlan();
    await page.evaluate(([k, text, rk, req]) => { sessionStorage.setItem(k, text); sessionStorage.setItem(rk, req); }, [GUEST_KEY, JSON.stringify([planted]), OPEN_PLACE_KEY, request]);
    await page.goto(PROD + CLASSIC_PATH);
    await expect(page.locator('#mainApp')).toBeVisible({ timeout: 45_000 });
    await expect(page.locator('#decision-entry')).toBeVisible({ timeout: 45_000 });

    const saveBtn = page.locator('#saveBtn');
    const line = page.locator('#saveStateNote');
    const calculate = page.locator('#decisionForm button[type="submit"]');
    // August, a month before the year's set-up: refused before the engine runs (the set-up already counts it), on the page too
    await page.locator('#entryMonth').fill('2026-08');
    // no record before August to fill the boxes from: the figures typed, as the platform shows them
    await page.locator('#entryPlatTotal').fill('587700');
    await page.locator('#entryPlatCash').fill('47600');
    await page.locator('#entryPlatBonds').fill('151900');
    await calculate.click();
    const alert = page.locator('#decisionCalcError');
    await expect(alert).toBeVisible({ timeout: 45_000 });
    await expect(alert).toHaveText('August 2026 could not be worked out. August 2026 comes before your 2026/27 set-up: you set the year up from September 2026 and entered £11,000 of income received before then, which already counts August 2026. To record it, put a later month in the box, press Calculate and fill in earlier months from there: August 2026 then takes its share.');
    await expect(saveBtn).toBeDisabled();
    // October, the month after the latest record: Calculate, and read the recommendation the person acts on
    await page.locator('#entryMonth').fill('2026-10');
    await calculate.click();
    await expect(saveBtn).toBeEnabled({ timeout: 45_000 });
    await expect(line).toHaveText('');
    const headline = async () => ({
      draw: (await page.locator('#decisionOutput .draw-row.primary .value').innerText()).trim(),
      net: (await page.locator('#decisionOutput .draw-row.total .value').innerText()).trim(),
      text: (await page.locator('#decisionOutput').innerText()).replace(/\s+/g, ' ')
    });
    const before = await headline();
    const where = page.locator('#whereAmILine');
    await expect(where).toContainText('1 month recorded this tax year (September 2026): £2,600 taken before tax, against £2,500 the plan said for that month (£2,500 a month) — £100 more than the plan said.');
    await expect(where).toContainText('recorded September 2026');

    // the offer: nothing after the latest record to fill, so the quiet line alone, no ready tick
    const fillBox = page.locator('#monthFillBox');
    const more = page.locator('#monthFillMore');
    const tick = page.locator('#monthFillTick');
    const from = page.locator('#monthFillFrom');
    await expect(fillBox).toBeVisible();
    await expect(more).toBeVisible();
    await expect(more).toHaveText('Fill in earlier months you did not record…');
    await expect(tick).toBeHidden();
    await expect(from).toBeHidden();
    // pressed: the chooser at April, and what the set-up was given, said before the tick
    await more.click();
    await expect(from).toBeVisible();
    await expect(more).toBeHidden();
    expect(await from.locator('option').allTextContents()).toEqual(['April 2026', 'May 2026', 'June 2026', 'July 2026', 'August 2026']);
    await expect(from).toHaveValue('2026-04');
    await expect(tick).not.toBeChecked();
    await expect(page.locator('#monthFillLabel')).toHaveText('Fill in 5 months you did not record, April 2026 to August 2026, with these pension figures');
    await expect(page.locator('#monthFillHelp')).toHaveText('You set up 2026/27 from September 2026 and entered £11,000 of income received before then, with £900 of tax on it. That is spread evenly over April 2026 to August 2026 (£2,200 a month before tax, £180 of tax), and ticked, they are recorded as drawn from your pension, so the year\'s totals stay the same; the months from September 2026 on are worked out exactly as before. Only tick this if that money was pension you drew: if it was pay or other income, leave those months unrecorded. '
      + 'One record for each month, worked out in order with the pension figures above, marked as filled in later. Use it when you drew the same amount each month and did not record it at the time. The figures were not the pot\'s on those months, so the records are a fair picture, not exact ones.');
    // a narrower start, and back: the chooser is an instruction to Save, never a figure (Save stays on)
    await from.selectOption('2026-07');
    await expect(page.locator('#monthFillLabel')).toHaveText('Fill in 2 months you did not record, July 2026 and August 2026, with these pension figures');
    await from.selectOption('2026-04');
    await expect(page.locator('#monthFillLabel')).toHaveText('Fill in 5 months you did not record, April 2026 to August 2026, with these pension figures');
    await expect(saveBtn).toBeEnabled();
    await expect(line).toHaveText('');

    // Save with the tick: April to August first, then October, worked out again with them on record — and unchanged
    // (on a phone the tick can sit under the bottom tab bar where the chooser left the page: brought to the middle first)
    await tick.evaluate((el) => el.scrollIntoView({ block: 'center' }));
    await tick.check();
    await saveBtn.evaluate((el) => el.scrollIntoView({ block: 'center' }));
    await saveBtn.click();
    await expect(line).toHaveText('October 2026 saved, with April 2026 to August 2026 filled in. To record another month, change the month and press Calculate.', { timeout: 60_000 });
    const after = await headline();
    expect(after).toEqual(before);

    // the records: in date order; April to August marked, with the instant and where their figures came from; their
    // income and tax add up to what the set-up was given, to the penny; September as planted; October unmarked
    const S = await storedPlan(page);
    const hist = S.decisionTool.history;
    expect(hist.map((h) => h.date)).toEqual(['2026-04', '2026-05', '2026-06', '2026-07', '2026-08', '2026-09', '2026-10']);
    const filled = hist.slice(0, 5);
    for (const h of filled) { expect(h.filledIn, h.date).toBe(true); expect(h.filledInOn, h.date).toBe(FIXED_NOW); expect(h.fromSetUp, h.date).toBe(true); expect('paidAhead' in h, h.date).toBe(false); }
    expect(Math.round(filled.reduce((t, h) => t + ((h.sipp || 0) + (h.other || 0) + (h.state || 0)) * 100, 0))).toBe(1100000);
    expect(Math.round(filled.reduce((t, h) => t + h.monthlyTax * 100, 0))).toBe(90000);
    expect(filled.map((h) => h.taxPaidYTD)).toEqual([180, 360, 540, 720, 900]);
    expect(JSON.stringify(hist[5])).toBe(JSON.stringify(planted.decisionTool.history[0]));
    for (const k of ['filledIn', 'filledInOn', 'fromSetUp']) expect(k in hist[6], k).toBe(false);
    // the tax year's set-up after: exactly as entered
    expect(S.decisionTool.taxYears['26/27']).toEqual(planted.decisionTool.taxYears['26/27']);

    // the strip, drawn again after Save: the seven months, named, the five from the set-up said apart, against what the
    // plan said for those months; the pension figure still dates from September (the filled-in months carry October's
    // pots by design, so they are never read as a batch saved at once)
    await expect(where).toContainText(/7 months recorded this tax year \(April 2026 to October 2026; April 2026 to August 2026 are filled in from your tax-year set-up\): £[\d,]+ taken before tax, against £17,500 the plan said for those months \(£2,500 a month\) — /);
    await expect(where).not.toContainText('gross so far');
    await expect(where).toContainText('recorded September 2026');
    await expect(where).not.toContainText('recorded April 2026');

    // the History view: the mark on the five months, and where a filled-in month's income and tax came from
    await page.locator('.sub-tab[data-decisiontab="history"]').click();
    const tabs = page.locator('#historyTabs .history-tab');
    await expect(tabs).toHaveCount(7);
    await expect(tabs).toHaveText(['✎ Apr 2026', '✎ May 2026', '✎ Jun 2026', '✎ Jul 2026', '✎ Aug 2026', 'Sep 2026', 'Oct 2026']);
    const mobile = page.locator('#historyMobileSelector');
    if (await tabs.nth(0).isVisible()) await tabs.nth(0).click(); else await mobile.selectOption('2026-04');
    await expect(page.locator('#historyDetail h3').first()).toHaveText('Apr 2026');
    await expect(page.locator('#historyFilledInNote')).toHaveText('✎ Filled in later on 30 September 2026. Its income and tax are its share of what you entered, when you set up the tax year, as received before the month you set it up from, recorded as drawn from your pension; its pension figures are the ones entered for a later month: a fair picture of this month, not an exact one.');
    // undoing the fill takes the months filled in from the set-up alone, never September or October
    await expect(page.locator('#historyDetail .history-actions button')).toHaveText('Delete this & the later months filled in from the set-up');
  });
});
