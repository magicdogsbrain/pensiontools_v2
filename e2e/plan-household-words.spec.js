/**
 * Who draws what, as we decided it on 27 Oct 2026 (research/household-draw-split.md 9), on the PUBLISHED build, without an
 * account. The couple fixtures (corpus 09 and 10, "Alex's plan" and "Sam's plan", linked both ways; Alex's pots four times over and
 * £70,000 a year as gate 9 derives them, and Sam's pots halved so that the default limit binds and the fast split has something to
 * say — derived here, never a new file) are planted in the window. On #/plan/<id>/household, after "Check the two plans together":
 * the baseline line ("Between you, after tax: … a year, both ways. …") equal to the same run in Node to the pound; the two columns
 * "As the two plans are written" / "Paid as a couple, tax first"; what the smaller pension's figure is made of; the need box with
 * its words; the limit's four choices with the usual one chosen; the fast split's line from the count alone with "Draw it faster",
 * which sets the limit to no limit and checks the two plans again — the line goes and the section says which limit applied, the
 * headline then Node's with no limit; a need typed marks the result stale. None of the words the household page keeps off it
 * (own, yours, hers, his, your pot) in "Who draws what". Nothing is written; Firebase is never reached.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test, expect, PROD, REPO, FIXED_NOW, V7_PATH, WORKER_DATA_MISSING } from './helpers/app.js';
import { householdInNode } from './helpers/householdInNode.js';

test.use({ outside: 'block' });

const GUEST_KEY = 'pt_guest_scenarios';
const v7 = (hash) => PROD + V7_PATH + hash;
const TODAY = FIXED_NOW.slice(0, 10);

function couple() {
  const alex = JSON.parse(readFileSync(join(REPO, 'tests', 'fixtures', 'plans', '09-couple-a.json'), 'utf8'));
  const sam = JSON.parse(readFileSync(join(REPO, 'tests', 'fixtures', 'plans', '10-couple-b.json'), 'utf8'));
  alex.id = 'HwAlex01'; alex.planDetails.name = 'Alex’s plan'; alex.isActive = true; alex.household = { partnerScenarioId: 'HwSam02' };
  sam.id = 'HwSam02'; sam.planDetails.name = 'Sam’s plan'; sam.isActive = false; sam.household = { partnerScenarioId: 'HwAlex01' };
  const a = alex.stressTool.settings; a.equityMin *= 4; a.bondMin *= 4; a.cashTarget *= 4; a.baseSalary = 70000;
  const b = sam.stressTool.settings; b.equityMin = Math.round(b.equityMin / 2); b.bondMin = Math.round(b.bondMin / 2); b.cashTarget = Math.round(b.cashTarget / 2);
  if (b.potAtRetirement) b.potAtRetirement = { ...b.potAtRetirement, sipp: Math.round(b.potAtRetirement.sipp / 2), isa: Math.round(b.potAtRetirement.isa / 2) };   // the pots at the stop, projected: halved with them
  return { alex, sam };
}
async function plant(page, plans) {
  await page.clock.setFixedTime(new Date(FIXED_NOW));
  await page.goto(v7('#/'));
  await expect(page.locator('#app [data-screen]')).toBeVisible();
  await page.evaluate(([k, text]) => { sessionStorage.setItem(k, text); }, [GUEST_KEY, JSON.stringify(plans)]);
  return JSON.stringify(plans);
}
const stored = (page) => page.evaluate((k) => sessionStorage.getItem(k), GUEST_KEY);
const pounds = (n) => '£' + Math.round(n).toLocaleString('en-GB');
/** The words the household page keeps off "Who draws what" (banned.js scope household, the same pattern): a plan's "its own" is let through. */
const WHOSE = /(?<!\bits )\b(own|yours|hers|his)\b|\b(your|her|his|their) (pots?|pensions?)\b/i;
const T = 'plan.household';

test.describe('"Who draws what", the words of 27 Oct 2026, without an account', () => {
  test('the baseline, the two columns, the smaller pension\'s line, the need box, the limit\'s four choices and the fast split\'s line equal Node; "Draw it faster" checks again with no limit; a need typed is stale; never whose money; nothing written', async ({ page, watch }, testInfo) => {
    test.setTimeout(900_000);
    watch.allow(WORKER_DATA_MISSING);
    const { alex, sam } = couple();
    const planted = await plant(page, [alex, sam]);
    const node = householdInNode(alex, sam, TODAY);
    const fastNode = householdInNode(alex, sam, TODAY, { limit: { kind: 'none' } });
    const split = node.pooled.split;
    expect(node.pooled.ok).toBe(true);
    expect(split.applies).toBe(true);
    expect(split.limitDefaulted).toBe(true);
    expect(split.limit).toEqual({ kind: 'untilAge', who: 'b', age: split.untilAge });
    const more = split.fast.saving.year - split.saving.year;
    expect(more, 'on this pair the default limit binds, so the fast split saves more').toBeGreaterThanOrEqual(1);

    await test.step('after the check: the baseline, the columns, the smaller pension\'s line, the need box, the limit\'s choices, the fast line — Node\'s figures; nothing written', async () => {
      await page.goto(v7('#/plan/HwAlex01/household'));
      await expect(page.locator('#app [data-screen]')).toHaveAttribute('data-screen', 'plan.household');
      const t0 = Date.now();
      await page.getByTestId(`${T}.check`).click();
      await expect(page.getByTestId(`${T}.result`)).toBeVisible({ timeout: 300_000 });
      testInfo.annotations.push({ type: 'household-ms', description: `${Date.now() - t0} ms` });
      await expect(page.getByTestId(`${T}.split`)).toHaveAttribute('data-applies', '1');
      await expect(page.getByTestId(`${T}.split`)).toHaveAttribute('data-limit-kind', 'untilAge');
      await expect(page.getByTestId(`${T}.split.baseline`)).toHaveText(`Between you, after tax: ${pounds(split.baseline.net)} a year, both ways. The only question is which pension pays how much of it.`);
      await expect(page.getByTestId(`${T}.split.headline`)).toHaveText(`Drawing together saves ${pounds(split.saving.year)} a year in tax — ${pounds(split.saving.until)} by the time Sam’s plan is ${split.untilAge}.`);
      await expect(page.locator(`[data-testid="${T}.split.table"] thead th`)).toHaveText(['', 'As the two plans are written', 'Paid as a couple, tax first']);
      expect(split.madeOf.own).toBeGreaterThan(0);
      await expect(page.getByTestId(`${T}.split.madeOf`)).toHaveText(`Sam’s plan’s pension pays ${pounds(split.madeOf.pays)} a year: the ${pounds(split.madeOf.own)} its plan pays plus ${pounds(split.madeOf.moved)} more. Alex’s plan’s pension pays ${pounds(split.madeOf.stops)} a year less than its plan is written to.`);
      await expect(page.locator('label[for="plan.household.need.amount"]')).toHaveText('What the couple needs after tax, a year');
      await expect(page.getByTestId('plan.household.need.amount')).toHaveValue('');
      await expect(page.locator('[id="plan.household.need.amount.help"]')).toHaveText('Leave it blank for what the two plans pay between them.');
      await expect(page.locator('input[name="plan.household.limit.kind"]')).toHaveCount(4);
      await expect(page.getByTestId('plan.household.limit.kind.none')).toBeChecked();
      await expect(page.locator('label[for="plan.household.limit.kind.none"]')).toHaveText('Keep it until the State Pension starts (the usual)');
      await expect(page.locator('label[for="plan.household.limit.kind.fast"]')).toHaveText('Draw it faster: no limit');
      const fastLine = page.locator(`[data-testid="${T}.split.fast"] p`);
      const untilDiff = Math.round(split.fast.saving.until - split.saving.until);   // what the fast split does by the State Pension age, the years after the pension is empty counted
      const untilWords = untilDiff > 0 ? `and ${pounds(untilDiff)} more` : untilDiff < 0 ? `but ${pounds(-untilDiff)} less` : 'and the same';
      await expect(fastLine).toHaveText(split.fast.goneAt != null
        ? `Draw Sam’s plan’s pension faster: saves another ${pounds(more)} a year in tax at first, ${untilWords} by the time Sam’s plan is ${split.untilAge}; Sam’s plan’s pension gone at about ${split.fast.goneAt}.`
        : `Draw Sam’s plan’s pension faster: saves another ${pounds(more)} a year in tax at first, ${untilWords} by the time Sam’s plan is ${split.untilAge}.`);
      await expect(page.getByTestId(`${T}.fast`)).toHaveText('Draw it faster');
      const words = await page.getByTestId(`${T}.split`).innerText();
      expect(words).not.toMatch(WHOSE);
      expect(words).not.toMatch(/Each for their own|undefined|NaN|\[object/);
      expect(await stored(page), 'the check writes nothing').toBe(planted);
    });

    await test.step('"Draw it faster": the limit set to no limit and the two plans checked again — the line goes, the section says so, the headline is Node\'s with no limit; nothing written', async () => {
      await page.getByTestId(`${T}.fast`).click();
      // the split (and the limit's choices in it) is drawn again only when the check is done: on a slow machine that is
      // longer than the default wait, so the choice is read after the result, not before (CI, 3 Nov 2026)
      await expect(page.getByTestId(`${T}.result`)).toBeVisible({ timeout: 300_000 });
      await expect(page.getByTestId(`${T}.split`)).toHaveAttribute('data-limit-kind', 'none', { timeout: 300_000 });
      await expect(page.getByTestId('plan.household.limit.kind.fast')).toBeChecked();
      await expect(page.getByTestId(`${T}.split.fast`)).toHaveCount(0);
      const f = fastNode.pooled.split;
      expect(f.limit).toEqual({ kind: 'none' });
      await expect(page.getByTestId(`${T}.split.headline`)).toHaveText(`Drawing together saves ${pounds(f.saving.year)} a year in tax — ${pounds(f.saving.until)} by the time Sam’s plan is ${f.untilAge}.`);
      await expect(page.getByTestId(`${T}.split.baseline`)).toHaveText(`Between you, after tax: ${pounds(f.baseline.net)} a year, both ways. The only question is which pension pays how much of it.`);
      await expect(page.getByTestId(`${T}.stale`)).toHaveCount(0);
      expect(await stored(page), 'the second check writes nothing').toBe(planted);
    });

    await test.step('a need typed marks the result stale and "Check again with this limit" is offered; the box keeps what was typed; nothing written', async () => {
      await page.getByTestId('plan.household.need.amount').fill('40,000');
      await expect(page.getByTestId(`${T}.stale`)).toHaveText('The limit has changed since this was checked.');
      await expect(page.getByTestId(`${T}.rerun`)).toHaveText('Check again with this limit');
      await expect(page.getByTestId('plan.household.need.amount')).toHaveValue('40,000');
      expect(await stored(page), 'typing writes nothing').toBe(planted);
      expect(new URL(page.url()).hash).toBe('#/plan/HwAlex01/household');
    });
  });
});
