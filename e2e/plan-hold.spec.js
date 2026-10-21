/**
 * "What you hold", without an account (research/v7/holdings-and-move.md §2, §7; road-to-7.md step 10), on the PUBLISHED build.
 * A plan with a pasted record (corpus 12, "Alex's plan", unlocked) and the locked gilt ladder (corpus 03, "Sam's plan") are
 * planted in the window. On #/plan/<id>/hold: the headline equals the Node reading; a line added from the bundled list writes
 * ONE plan equal to the Node patch (hold.js holdPatch) folded onto the planted text, the other plan byte-identical, Undo byte
 * for byte; Remove asks first and writes the Node patch; a table pasted from a platform is read as Node reads it (every line,
 * the total line left out and said, the lines not pasted listed as "sold?" and never removed) and "Add these lines" writes
 * the Node patch; on the LOCKED plan a line added as typed still writes (the record is outside the lock), the plan's settings
 * and document untouched. No figure in any address; no sideways scroll; none of the planner's words. Firebase is never reached.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test, expect, PROD, REPO, FIXED_NOW } from './helpers/app.js';
import { holdInNode } from './helpers/holdInNode.js';
import { HOLD_WRITES } from '../src/answers/plan/schema.js';
import { applyPatch } from '../src/answers/plan/about.js';

test.use({ outside: 'block' });

const GUEST_KEY = 'pt_guest_scenarios';
const v7 = (hash) => PROD + '/v7/' + hash;
const TODAY = FIXED_NOW.slice(0, 10);
const PASTE = 'Investment\tTicker\tUnits\tValue\niShares Core MSCI World\tSWDA\t3,150\t£284,000.00\nA fund of my own\t\t10\t£1,000\nTotal\t\t\t£285,000';

function plans() {
  const alex = JSON.parse(readFileSync(join(REPO, 'tests', 'fixtures', 'plans', '12-lumpy-db-gia.json'), 'utf8'));
  const sam = JSON.parse(readFileSync(join(REPO, 'tests', 'fixtures', 'plans', '03-gilt-ladder-runup.json'), 'utf8'));
  alex.id = 'HoldPlan01'; alex.planDetails.name = 'Alex’s plan'; alex.isActive = true; delete alex.household;
  sam.id = 'HoldLocked02'; sam.planDetails.name = 'Sam’s plan'; sam.isActive = false; delete sam.household;
  return { alex, sam };
}
function stripped(plan, paths) {
  const out = JSON.parse(JSON.stringify(plan));
  for (const path of [...paths, 'lastModified']) { const parts = path.split('.'); let o = out; for (let i = 0; i < parts.length - 1 && o; i++) o = o[parts[i]]; if (o) delete o[parts[parts.length - 1]]; }
  return JSON.stringify(out);
}
async function plant(page, list) {
  await page.clock.setFixedTime(new Date(FIXED_NOW));
  await page.goto(v7('#/'));
  await expect(page.locator('#app [data-screen]')).toBeVisible();
  await page.evaluate(([k, text]) => { sessionStorage.setItem(k, text); }, [GUEST_KEY, JSON.stringify(list)]);
  return JSON.stringify(list);
}
const stored = (page) => page.evaluate((k) => sessionStorage.getItem(k), GUEST_KEY);
const headlineText = (h) => `Pension ${h.pension}, ISA ${h.isa}` + (h.gia ? `, other account ${h.gia}` : '') + (h.cash ? `, cash ${h.cash}` : '') + (h.date ? `. Updated ${h.date}.` : '.');
const BANNED = /\bstrategy\b|\bscenario\b|\bwrappers?\b|\bholdings\b|\bledger\b|\btransition\b|\bportfolio\b|Monte Carlo|\bMC\b|\bp10\b|about £/i;
const T = 'plan.hold';

test.describe('"What you hold", without an account', () => {
  test('the record as Node reads it; a line added, removed and a table pasted each write the Node patch, Undo byte for byte; the locked plan\'s record still writes; no figure in the address', async ({ page, watch }) => {
    test.setTimeout(300_000);
    watch.allow(/^asked for a file that is not there: \/assets\/data\/(gilts|equity)\.json$/);
    const { alex, sam } = plans();
    const planted = await plant(page, [alex, sam]);
    const node = holdInNode(alex, TODAY, { add: { text: 'VWRP', wrapper: 'ISA', pick: 'fund:VWRP' }, remove: { index: 0 }, paste: { text: PASTE, wrapper: 'SIPP', answers: { 2: 'bonds' } } });
    expect(node.add.ok).toBe(true);
    expect(node.remove.ok).toBe(true);
    expect(node.paste.ok).toBe(true);

    await test.step('the step: the headline the plan page says, the lines by account, the ruling; nothing written on opening; no sideways scroll; none of the planner\'s words', async () => {
      await page.goto(v7('#/plan/HoldPlan01/hold'));
      await expect(page.locator('#app [data-screen]')).toHaveAttribute('data-screen', 'plan.hold');
      await expect(page.getByTestId('plan.step.hold')).toHaveText('What you hold');
      await expect(page.getByTestId(`${T}.headline`)).toHaveText(headlineText(node.hold.headline));
      await expect(page.locator('.hold-line')).toHaveCount(node.hold.count);
      await expect(page.getByTestId(`${T}.mix.line`)).toHaveText(`Shares ${node.hold.mix.shares}%, bonds ${node.hold.mix.bonds}%, gold and trend ${node.hold.mix.diversifiers}%, cash ${node.hold.mix.cash}% — on ${node.hold.mix.total} across your accounts.`);
      const widths = await page.evaluate(() => ({ doc: document.documentElement.scrollWidth, win: window.innerWidth }));
      expect(widths.doc, 'no sideways scroll').toBeLessThanOrEqual(widths.win);
      expect(new URL(page.url()).hash).toBe('#/plan/HoldPlan01/hold');
      const text = await page.locator('#app').innerText();
      expect(text).not.toMatch(/undefined|NaN|\[object/);
      expect(text).not.toMatch(BANNED);
      expect(text).not.toMatch(/test (it )?on what (I|you) hold|funds to test/i);
      expect(text).toContain('nothing here is copied from the plan');
      expect(await stored(page), 'opening writes nothing').toBe(planted);
    });

    await test.step('a line added from the bundled list: ONE plan written equal to the Node patch, the other byte-identical; Undo puts the text back byte for byte', async () => {
      await page.getByTestId('plan.hold.add.wrapper.ISA').check();
      await page.getByTestId('plan.hold.add.text').fill('VWRP');
      await page.getByTestId(`${T}.add.match.fund:VWRP`).click();
      const toast = page.getByTestId(`${T}.toast`);
      await expect(toast).toBeVisible({ timeout: 60_000 });
      await expect(toast).toContainText('added to your ISA');
      const after = JSON.parse(await stored(page));
      const before = JSON.parse(planted);
      expect(stripped(after[0], HOLD_WRITES)).toBe(stripped(before[0], HOLD_WRITES));
      expect(JSON.stringify(after[0])).toBe(JSON.stringify(applyPatch(before[0], { ...node.add.patch, lastModified: FIXED_NOW })));
      expect(JSON.stringify(after[1]), 'the other plan untouched').toBe(JSON.stringify(before[1]));
      expect(after[0].holdings.lines).toHaveLength(node.hold.count + 1);
      expect(after[0].holdings.updatedAt).toBe(TODAY);
      await expect(page.locator('.hold-line')).toHaveCount(node.hold.count + 1, { timeout: 60_000 });
      await page.getByTestId(`${T}.undo`).click();
      await expect(page.getByTestId(`${T}.toast`)).toContainText('Put back as it was.', { timeout: 60_000 });
      expect(await stored(page), 'Undo puts the text back byte for byte').toBe(planted);
      await expect(page.locator('.hold-line')).toHaveCount(node.hold.count, { timeout: 60_000 });
    });

    await test.step('Remove asks first on the screen, then writes the Node patch; Undo byte for byte', async () => {
      await page.getByTestId(`${T}.toastClose`).click();
      await page.getByTestId(`${T}.line.0.remove`).click();
      const confirm = page.getByTestId(`${T}.line.0.removeConfirm`);
      await expect(confirm).toBeVisible();
      await expect(confirm).toContainText('Nothing is sold; this only changes the record.');
      await page.getByTestId(`${T}.line.0.removeConfirm.yes`).click();
      await expect(page.getByTestId(`${T}.toast`)).toContainText('removed from your pension', { timeout: 60_000 });
      const after = JSON.parse(await stored(page));
      const before = JSON.parse(planted);
      expect(JSON.stringify(after[0])).toBe(JSON.stringify(applyPatch(before[0], { ...node.remove.patch, lastModified: FIXED_NOW })));
      expect(after[0].holdings.lines).toHaveLength(node.hold.count - 1);
      await page.getByTestId(`${T}.undo`).click();
      await expect(page.getByTestId(`${T}.toast`)).toContainText('Put back as it was.', { timeout: 60_000 });
      expect(await stored(page)).toBe(planted);
    });

    await test.step('a table pasted: read as Node reads it (every line, the total left out, the lines not pasted as "sold?"), "What is this?" answered, "Add these lines" writes the Node patch; Undo byte for byte', async () => {
      await page.getByTestId(`${T}.toastClose`).click();
      await page.getByTestId(`${T}.paste.open`).click();
      await page.getByTestId(`${T}.paste.text`).fill(PASTE);
      await expect(page.locator(`[data-testid="${T}.paste.rows"] tbody tr`)).toHaveCount(node.paste.rows);
      await expect(page.locator(`[data-testid="${T}.paste.rows"] tbody tr[data-unrecognised="1"]`)).toHaveCount(node.paste.unrecognised);
      await expect(page.locator(`[data-testid="${T}.paste.leftOut"] li`)).toHaveCount(node.paste.leftOut);
      await expect(page.locator(`[data-testid="${T}.paste.unseen"] li`)).toHaveCount(node.paste.unseen.length);
      await page.getByTestId(`${T}.paste.2.what`).selectOption('bonds');
      await expect(page.locator(`[data-testid="${T}.paste.rows"] tbody tr[data-unrecognised="1"]`)).toHaveCount(0);
      await expect(page.getByTestId(`${T}.paste.summary`)).toContainText(`updates ${node.paste.merged.updated} you already have and adds ${node.paste.merged.added}`);
      expect(await stored(page), 'reading the paste writes nothing').toBe(planted);
      await page.getByTestId(`${T}.paste.add`).click();
      await expect(page.getByTestId(`${T}.toast`)).toContainText('added to your pension', { timeout: 60_000 });
      const after = JSON.parse(await stored(page));
      const before = JSON.parse(planted);
      expect(JSON.stringify(after[0])).toBe(JSON.stringify(applyPatch(before[0], { ...node.paste.patch, lastModified: FIXED_NOW })));
      expect(after[0].holdings.source).toBe('paste');
      expect(after[0].holdings.lines.length, 'nothing is removed by itself').toBe(node.hold.count + node.paste.merged.added);
      await page.getByTestId(`${T}.undo`).click();
      await expect(page.getByTestId(`${T}.toast`)).toContainText('Put back as it was.', { timeout: 60_000 });
      expect(await stored(page)).toBe(planted);
    });

    await test.step('the locked plan: the record is still the person\'s to change — a line added as typed writes exactly the record and the stamp; the settings, the document and its snapshot untouched', async () => {
      const locked = holdInNode(sam, TODAY, { add: { text: 'Easy-access savings 2', wrapper: 'CASH', value: '500', pick: 'typed' } });
      expect(locked.hold.locked).toBe(true);
      expect(locked.add.ok).toBe(true);
      await page.goto(v7('#/plan/HoldLocked02/hold'));
      await expect(page.locator('#app [data-screen]')).toHaveAttribute('data-screen', 'plan.hold');
      await expect(page.getByTestId(`${T}.locked`)).toBeVisible();
      await expect(page.getByTestId(`${T}.atLock`)).toContainText('Your plan was locked on');
      await page.getByTestId('plan.hold.add.wrapper.CASH').check();
      await page.getByTestId('plan.hold.add.text').fill('Easy-access savings 2');
      await page.getByTestId('plan.hold.add.value').fill('500');
      await page.getByTestId(`${T}.add.asTyped`).click();
      await expect(page.getByTestId(`${T}.toast`)).toContainText('added to your cash', { timeout: 60_000 });
      const after = JSON.parse(await stored(page));
      const before = JSON.parse(planted);
      expect(JSON.stringify(after[1])).toBe(JSON.stringify(applyPatch(before[1], { ...locked.add.patch, lastModified: FIXED_NOW })));
      expect(JSON.stringify(after[1].stressTool)).toBe(JSON.stringify(before[1].stressTool));
      expect(JSON.stringify(after[1].decisionTool)).toBe(JSON.stringify(before[1].decisionTool));
      expect(JSON.stringify(after[1].planDocument)).toBe(JSON.stringify(before[1].planDocument));
      expect(JSON.stringify(after[0]), 'the other plan untouched').toBe(JSON.stringify(before[0]));
      const text = await page.locator('#app').innerText();
      expect(text).not.toMatch(BANNED);
      expect(new URL(page.url()).hash).toBe('#/plan/HoldLocked02/hold');
    });
  });
});
