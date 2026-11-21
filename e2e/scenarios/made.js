/**
 * Plans made on the screen, as a person makes them (rule 4): the routes several scenarios start from. Each returns the
 * plan's id and leaves the person signed in on the page it ends on.
 */
import { expect } from '@playwright/test';

/**
 * A year before tax as a month after tax, by hand on the default bands (no app code: scenarios stay independent). The
 * allowance falls by £1 for every £2 over £100,000; 20% to the basic-rate limit, 40% to the higher-rate limit, 45% above.
 */
function monthAfterTax(gross) {
  const g = Math.max(0, +gross || 0);
  const pa = Math.max(0, 12570 - Math.max(0, g - 100000) / 2);
  const slice = (lo, hi) => Math.max(0, Math.min(g, hi) - lo);
  const tax = 0.2 * slice(pa, 50270) + 0.4 * slice(Math.max(pa, 50270), 125140) + 0.45 * Math.max(0, g - 125140);
  return Math.round((g - tax) / 12);
}
import { confirmEmail } from './account.js';
import { at, openSimple, answer, keep, signUp, editAndSave, planAddress, settled, fullPage, closeNews, openFull, planPage } from './routes.js';
import { SAM_B, KIM_D } from './typed.js';
import { SAM45 } from './people.js';

/** A question answered as a guest, kept, and carried into a new account made from the kept panel. */
export async function keptIntoNewAccount(page, q, typed, me) {
  await openSimple(page, `#/${q}/numbers`);
  await answer(page, q, typed);
  await keep(page, q);
  await page.getByTestId(`${q}.keep.toAccount`).click();
  await signUp(page, me, confirmEmail);
  await page.waitForURL((u) => /#\/plan\//.test(u.hash), { timeout: 30_000 });
  await settled(page).catch(() => {});
  return planAddress(page).planId;
}

/**
 * Sam, 44, on 12 November 2025: "Am I saving enough?" with £120,000 and the pay-in as two amounts, kept into a new
 * account; then the pay, £52,000, on What you pay in.
 */
export async function samAYearAgo(page, me) {
  await at(page, '2025-11-12T10:00:00.000Z');
  const typed = { numbers: { ...SAM_B.numbers, 'you.age': SAM45.age - 1 }, spend: SAM_B.spend };
  const planId = await keptIntoNewAccount(page, 'b', typed, me);
  await editAndSave(page, planId, 'saving', 'salary', SAM45.pay);
  await expect(page.locator('#app [data-screen]')).toBeVisible();
  return planId;
}

/** Kim, 62, on 16 November 2026: "Will it last?" answered, kept into a new account. */
export async function kimKept(page, me) {
  return keptIntoNewAccount(page, 'd', KIM_D, me);
}

/** In the full view: Stress Tester > Settings > "Lock plan & create the plan document" > "Lock the plan". */
export async function lockFromStressSettings(page) {
  await fullPage(page, 'stress settings');
  await closeNews(page);
  await page.locator('#ssLockBtn').click();
  await page.getByRole('button', { name: 'Lock the plan' }).click();
  await expect(page.locator('.sub-tab[data-decisiontab="plandoc"].active').or(page.getByText('Plan locked')).first()).toBeVisible({ timeout: 60_000 });
}

/**
 * In the full view: Decision Tool > Monthly Entry for `month` ('2026-11') with the pension total and the ISA as the
 * platform shows them, then Calculate. The tax-year set-up opens the first time in a tax year; `setUp(page)` fills it.
 * Returns what the person read on the way: each step of the set-up, then the page after the recommendation is drawn.
 */
export async function monthlyEntry(page, { month, pension, isa, cash = null, setUp = null }) {
  await fullPage(page, 'monthly entry');
  await page.locator('#entryMonth').fill(month);
  // the form fills itself from the last month a moment after the month is chosen: "of which cash" is typed over that
  if (cash != null) await typeUntilItHolds(page, [['#entryPlatTotal', pension], ['#entryPlatCash', cash]]);
  else await page.locator('#entryPlatTotal').fill(String(pension));
  await page.locator('#entryIsa').fill(String(isa));
  await page.locator('#decisionForm button[type=submit]').click();
  const seen = [];
  // the tax-year set-up draws its steps inside #taxYearWizard; its heading says "Setting up tax year …"
  const wizard = page.locator('#taxYearWizard');
  const open = () => page.getByText(/^Setting up tax year/).first().isVisible().catch(() => false);
  await expect.poll(async () => (await open()) || (await page.locator('#saveBtn').isVisible().catch(() => false) && !(await open())), { timeout: 30_000 }).toBe(true);
  if (await open()) {
    if (setUp) await setUp(page);
    for (let i = 0; i < 5 && (await open()); i++) {
      // a person waits while the last press is saving ("Saving…" on its button), then reads the step that follows
      await expect.poll(async () => !/Saving…/.test(await wizard.innerText().catch(() => '')), { timeout: 30_000 }).toBe(true);
      if (!(await open())) break;
      const step = await wizard.innerText().catch(() => '');
      seen.push(step);
      await wizard.getByRole('button', { name: /^(Next|Confirm|Finish|Done|Save|Set up|Start)/ }).last().click();
      await expect.poll(async () => !(await open()) || (await wizard.innerText().catch(() => step)) !== step, { timeout: 15_000 }).toBe(true);
    }
  }
  await expect.poll(open, { timeout: 30_000 }).toBe(false);
  return [...seen, await page.locator('body').innerText()].join('\n');
}

/**
 * Boxes typed as a person types them, then looked at again: a form that fills itself a moment later (from the last month,
 * or from the store) can write over what was typed, and then it is typed again. Waits until the boxes have held their
 * figures at two looks in a row.
 */
export async function typeUntilItHolds(page, boxes) {
  let held = 0;
  await expect.poll(async () => {
    let same = true;
    for (const [sel, v] of boxes) if ((await page.locator(sel).inputValue()) !== String(v)) { same = false; await page.locator(sel).fill(String(v)); }
    held = same ? held + 1 : 0;
    return held >= 2;
  }, { timeout: 30_000, intervals: [750] }).toBe(true);
}

/** "Save to History" for the month on the entry form. */
export async function saveMonth(page) {
  await page.locator('#saveBtn').click();
  await expect(page.getByText(/saved to history|^Saved, with|^Batch saved/i).first()).toBeVisible({ timeout: 30_000 });
}

/**
 * A new account's first plan made in the full view's set-up: its name, age and the age work stops, then "See if I can
 * afford to retire". Leaves the full view open on the plan.
 */
export async function fullViewWizard(page, { name, age, stopAge, stopMonth = null }) {
  await openFull(page).catch(() => {});
  const wiz = page.locator('#setupWizard');
  await expect(wiz.locator('#wizScenarioName')).toBeVisible({ timeout: 45_000 });
  await wiz.locator('#wizScenarioName').fill(name);
  await wiz.locator('#wizCurrentAge').fill(String(age));
  await wiz.locator('#wizRetireAge').fill(String(stopAge));
  if (stopMonth) await wiz.locator('#wizStopMonth').fill(stopMonth);   // "Or the month you stop"
  await wiz.getByRole('button', { name: 'Next' }).click();
  await wiz.getByRole('button', { name: /See if I can afford to retire/ }).click();
  await expect(wiz).toBeHidden({ timeout: 30_000 });
  // the new plan opens on the Stress tester; a person starts once it shows the plan
  await expect(page.locator('#scenarioSelector')).toContainText(name, { timeout: 30_000 });
}

/**
 * Stress Tester > Settings: the pension and the ISA today as totals, in "Total in your SIPP" and "Total in your ISA" under
 * the allocation (no funds listed), then Save Settings. (Not the "Or SIPP at retirement" boxes: those take the pots at the
 * stop, and these are the figures today.)
 */
export async function stressTotals(page, { pension, isa }) {
  await fullPage(page, 'stress settings');
  await closeNews(page);
  await typeUntilItHolds(page, [['#ssPot', pension], ['#ssIsaBalance', isa]]);
  await page.locator('#ssSaveBtn').click();
  await expect(page.getByText(/Settings saved/).first()).toBeVisible({ timeout: 30_000 });
}

/**
 * A new account's first plan made in the full view's set-up by someone already drawing: its name, age, "Already retired"
 * at that age, then "I'm already drawing my pension — pick up from here". Leaves the full view open on the Stress tester.
 */
export async function fullViewDrawing(page, { name, age }) {
  await openFull(page).catch(() => {});
  const wiz = page.locator('#setupWizard');
  await expect(wiz.locator('#wizScenarioName')).toBeVisible({ timeout: 45_000 });
  await wiz.locator('#wizScenarioName').fill(name);
  await wiz.locator('#wizCurrentAge').fill(String(age));
  await wiz.locator('#wizRetired').check();
  await wiz.locator('#wizRetireAge').fill(String(age));
  await wiz.getByRole('button', { name: 'Next' }).click();
  await wiz.getByRole('button', { name: /already drawing my pension/ }).click();
  await expect(wiz).toBeHidden({ timeout: 30_000 });
  // the new plan opens on Stress tester > Settings, where its figures are added: a person starts once it is there
  await expect(page.locator('#scenarioSelector')).toContainText(name, { timeout: 30_000 });
  await expect(page.locator('.sub-tab[data-stresstab="stresssettings"].active')).toBeVisible({ timeout: 30_000 });
}

/**
 * Stress Tester > Settings: "Full index-linked gilt ladder", the pension it is bought from, the years paid from cash
 * first, then Save Settings.
 */
export async function stressLadder(page, { pension, cashYears, steps = null, access = null }) {
  await fullPage(page, 'stress settings');
  await closeNews(page);
  // the way's boxes are drawn and filled from the plan a moment after the press ("Buys with …" under them); a new plan's
  // settings can be drawn again from the store a moment later, over what was typed (reported in the round's notes): the
  // way is pressed and the figures typed until they hold at two looks in a row
  await page.locator('button[data-strat="full-il-gilt"]').click();
  await expect(page.locator('#miniPotNote')).toContainText('Buys with', { timeout: 15_000 });
  const nums = page.locator('#incomeStepsEditor input[type=number]');
  const typedSteps = async () => { const v = await nums.evaluateAll((es) => es.map((e) => e.value.replace(/\s/g, ''))); const out = []; for (let i = 0; i + 1 < v.length; i += 2) out.push([v[i], v[i + 1]]); return out; };
  let held = 0;
  await expect.poll(async () => {
    let same = true;
    if (!(await page.locator('button[data-strat="full-il-gilt"].active').isVisible())) { await page.locator('button[data-strat="full-il-gilt"]').click(); held = 0; return false; }
    if (steps) {
      // "Your income shape": the first step's amount by "or a number", then each later step added and typed
      // (step F2) the step boxes are a month after tax (worked out by hand on the default bands); "or a
      // number" still takes the year before tax for the first step
      const want = steps.map((x, i) => [i ? String(x.from) : null, String(monthAfterTax(x.amount))]);
      let got = await typedSteps();
      if (got.length !== want.length || got[0][1] !== want[0][1]) {
        same = false;
        // (each press tried briefly: if the form is drawn again under it, the next look types it again)
        await page.locator('#shapeStartNumber').fill(String(steps[0].amount), { timeout: 3_000 }).catch(() => {});
        await page.getByRole('button', { name: 'Use it' }).click({ timeout: 3_000 }).catch(() => {});
        for (let i = 1; i < want.length; i++) await page.getByRole('button', { name: '+ Add a step' }).click({ timeout: 3_000 }).catch(() => {});
        got = await typedSteps();
      }
      for (let i = 1; i < want.length && got.length === want.length; i++) {
        if (got[i][0] !== want[i][0]) { same = false; await nums.nth(2 * i).fill(want[i][0], { timeout: 3_000 }).catch(() => {}); }
        if (got[i][1] !== want[i][1]) { same = false; await nums.nth(2 * i + 1).fill(want[i][1], { timeout: 3_000 }).catch(() => {}); }
      }
    }
    for (const [sel, v] of [['#miniSipp', pension], ['#giltCashYears', cashYears]]) if (v != null && (await page.locator(sel).inputValue({ timeout: 3_000 }).catch(() => '')) !== String(v)) { same = false; await page.locator(sel).fill(String(v), { timeout: 3_000 }).catch(() => {}); await page.locator(sel).dispatchEvent('change', {}, { timeout: 3_000 }).catch(() => {}); }
    // (step F2) how the tax-free part is taken, pressed as a person presses it ("Kept separate, or already taken" when it is)
    if (access) { const b = page.locator(`#stress-stresssettings button[data-access="${access}"]`); if (!(await b.evaluate((el) => el.classList.contains('active')).catch(() => false))) { same = false; await b.click({ timeout: 3_000 }).catch(() => {}); } }
    held = same ? held + 1 : 0;
    return held >= 2;
  }, { timeout: 45_000, intervals: [750] }).toBe(true);
  await page.locator('#ssSaveBtn').click();
  await expect(page.getByText(/Settings saved/).first()).toBeVisible({ timeout: 30_000 });   // a person waits for the save to be said
}

/**
 * The plan document's order sheet, as a person reads it off the page: every gilt row's name, SEDOL, code and units to
 * order (the "Units to order" column), and (`.cash`) the cash for the cash years, the money-market row's amount.
 */
export async function orderSheet(page) {
  await fullPage(page, 'plan document');
  await expect(page.getByRole('heading', { name: /^Plan document/ }).first()).toBeVisible({ timeout: 30_000 });
  // the document's sections are folded; a person opens them (all of them, as they are drawn)
  await expect.poll(async () => { await page.locator('details').evaluateAll((ds) => ds.forEach((d) => { d.open = true; })); return page.getByText('Order sheet', { exact: true }).first().isVisible().catch(() => false); }, { timeout: 30_000 }).toBe(true);
  const t = await page.locator('body').innerText();
  const cash = /^\d+\tMoney-market fund\t[^\n]*?£([\d,]+)\s*$/m.exec(t);
  return Object.assign([...t.matchAll(/^\d+\t([^\t]+)\t([A-Z0-9]{7})\t([A-Z0-9.]+)\t[^\n]*?([\d,]+) units/gm)].map((m) => ({ name: m[1], sedol: m[2], code: m[3], units: Number(m[4].replace(/,/g, '')) })), { cash: cash ? Number(cash[1].replace(/,/g, '')) : null });
}

/** What you hold > "Paste a table": the table pasted into the pension, then "Add these lines". */
export async function pasteHoldings(page, planId, text) {
  await planPage(page, planId, 'hold');
  await page.getByTestId('plan.hold.paste.open').click();
  await page.getByTestId('plan.hold.paste.text').fill(text);
  await expect(page.getByTestId('plan.hold.paste.summary')).toBeVisible({ timeout: 15_000 });
  await page.getByTestId('plan.hold.paste.add').click();
  await expect(page.getByTestId('plan.hold.paste.add')).toHaveCount(0, { timeout: 30_000 });
  await settled(page).catch(() => {});
}
