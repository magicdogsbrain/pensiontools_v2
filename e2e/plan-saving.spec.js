/**
 * "What you pay in", without an account (research/v7/road-to-7.md step 11b: save.relief, save.escalation, save.own-mix,
 * save.pot-record), on the PUBLISHED build. The committed saver (corpus 05, "Sam's plan", locked, with a record a month and
 * holdings) and a retired plan (corpus 12, "Alex's plan") are planted in the window. On #/plan/<id>/saving: the boxes and
 * what the pot could be equal the Node reading (saving.js savingOf: AccumulationEngine.projectAccumulation with "Your mix"
 * from what is held); a rise typed and saved writes the whole settings object equal to the Node patch (savingPatch, the
 * planner's readAccumulationInputs), the plan's lock untouched (the settings are outside it), Undo byte for byte; "Record
 * it" writes the record list whole equal to the Node patch (recordPatch, the planner's recordAccumulationMonth), nothing
 * deleted, Undo byte for byte; the saver rules hold on screen; the rail's "Am I saving enough?" opens question B with the
 * plan's figures in its boxes (6.55.0). No figure in any address; no sideways scroll. Firebase is never reached.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test, expect, PROD, REPO, FIXED_NOW, saverWording, V7_PATH, CLASSIC_PATH, WORKER_DATA_MISSING } from './helpers/app.js';
import { savingInNode } from './helpers/budgetInNode.js';
import { SAVING_WRITES } from '../src/answers/plan/schema.js';
import { applyPatch } from '../src/answers/plan/about.js';
import { saverInputsOf, saverDraftOf } from '../src/answers/plan/saverInputs.js';
import { answerB } from '../src/answers/b/answer.js';
import { upgradeScenario } from '../src/firebase/scenarioMigration.js';

test.use({ outside: 'block' });

const GUEST_KEY = 'pt_guest_scenarios';
const v7 = (hash) => PROD + V7_PATH + hash;
const TODAY = FIXED_NOW.slice(0, 10);
const BANNED = /\bstrategy\b|\bscenario\b|\bcontributions?\b|on track|\bprojection\b|\baccumulation\b|retirement age|\btarget\b|per month|\/mo\b|Monte Carlo|\bnet\b|\bgross\b/i;
const T = 'plan.saving';
const RECORD = { 'record.month': '2026-09', 'record.pension': '325,000', 'record.isa': '', 'record.gia': '' };

function plans() {
  const sam = JSON.parse(readFileSync(join(REPO, 'tests', 'fixtures', 'plans', '05-saver-committed.json'), 'utf8'));
  const alex = JSON.parse(readFileSync(join(REPO, 'tests', 'fixtures', 'plans', '12-lumpy-db-gia.json'), 'utf8'));
  sam.id = 'SavingPlan01'; sam.planDetails.name = 'Sam’s plan'; sam.isActive = true; delete sam.household;
  alex.id = 'SavingOther02'; alex.planDetails.name = 'Alex’s plan'; alex.isActive = false; delete alex.household;
  return { sam, alex };
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

test.describe('"What you pay in", without an account', () => {
  test('the boxes and the pot as Node reads them; a rise saved and a month recorded each write the Node patch, the lock untouched, Undo byte for byte; the saver rules on screen; no figure in the address', async ({ page, watch }) => {
    test.setTimeout(300_000);
    watch.allow(WORKER_DATA_MISSING);
    const { sam, alex } = plans();
    const planted = await plant(page, [sam, alex]);
    const node = savingInNode(sam, TODAY, { typed: { escalationPct: '2.5' }, record: RECORD, now: FIXED_NOW });   // the record's stamp is the page's clock
    expect(node.save.ok).toBe(true);
    expect(node.record.ok).toBe(true);
    for (const k of [...Object.keys(node.save.patch), ...Object.keys(node.record.patch)]) expect(SAVING_WRITES).toContain(k);
    expect(node.saving.locked).toBe(true);

    await test.step('the step: the boxes with the planner\'s figures, the relief closed then opened, the pot by the stop with "Your mix", the records; nothing written on opening; no sideways scroll; the saver rules', async () => {
      await page.goto(v7('#/plan/SavingPlan01/saving'));
      await expect(page.locator('#app [data-screen]')).toHaveAttribute('data-screen', 'plan.saving');
      await expect(page.getByTestId('plan.step.saving')).toHaveText('What you pay in');
      for (const [path, shown] of Object.entries(node.saving.fields)) {
        if (path === 'schemeType') await expect(page.getByTestId(`${T}.schemeType.${shown}`)).toBeChecked();
        else await expect(page.getByTestId(`${T}.${path}`)).toHaveValue(shown);
      }
      await expect(page.getByTestId(`${T}.ages`)).toHaveText(`From age ${node.saving.ages.currentAge} to age ${node.saving.ages.retirementAge}: ${node.saving.ages.years} years of saving. The ages are on “About you and when”.`);
      await expect(page.getByTestId(`${T}.notFrozen`)).toBeVisible();
      await expect(page.getByTestId(`${T}.relief.box`)).toHaveCount(0);
      await page.getByTestId(`${T}.relief.open`).click();
      await expect(page.getByTestId(`${T}.relief.box`)).toBeVisible();
      await expect(page.getByTestId(`${T}.relief.box`)).toContainText('the tax the government adds back');
      await expect(page.getByTestId(`${T}.pot`)).toHaveAttribute('data-mix', '1');
      await expect(page.locator(`[data-testid="${T}.pot.table"] tbody tr`)).toHaveCount(node.saving.rows);
      const last = page.locator(`[data-testid="${T}.pot.table"] tbody tr.is-last`);
      await expect(last).toHaveAttribute('data-mid', String(node.saving.last.raw.mid));
      await expect(last).toHaveAttribute('data-mix', String(node.saving.last.raw.mix));
      await expect(page.getByTestId(`${T}.pot.mix`)).toContainText(`shares ${node.saving.mix.shares}%, bonds ${node.saving.mix.bonds}%`);
      await expect(page.getByTestId(`${T}.records`)).toHaveAttribute('data-count', String(node.saving.recordsCount));
      const widths = await page.evaluate(() => ({ doc: document.documentElement.scrollWidth, win: window.innerWidth }));
      expect(widths.doc, 'no sideways scroll').toBeLessThanOrEqual(widths.win);
      expect(new URL(page.url()).hash).toBe('#/plan/SavingPlan01/saving');
      const text = await page.locator('#app').innerText();
      expect(text).not.toMatch(/undefined|NaN|\[object/);
      expect(text).not.toMatch(BANNED);
      expect(saverWording(text)).toEqual([]);
      expect(await stored(page), 'opening writes nothing').toBe(planted);
    });

    await test.step('"Are you paying in enough?" (release step R2): question B\'s own answer on the plan\'s figures, worked out in the worker — the band and the sentences Node works out at 1,000 futures; the planner\'s check a quiet link; nothing written', async () => {
      const read = saverInputsOf(upgradeScenario(JSON.parse(JSON.stringify(sam)), { now: new Date(FIXED_NOW) }).scenario, { today: TODAY });
      expect(read.ok).toBe(true);
      const result = answerB(read.inputs, { today: TODAY, futures: 1000, seed: 0, trace: false, detail: 'answer', ...read.env });
      const box = page.getByTestId(`${T}.verdict`);
      await expect(box).toHaveAttribute('data-status', 'final', { timeout: 120_000 });
      await expect(box).toHaveAttribute('data-verdict', result.verdict.band);
      await expect(box).toContainText(result.sentences.verdictHead.text);
      await expect(box).toContainText(result.sentences.verdictLine.text);
      if (result.sentences.enoughHead) await expect(box).toContainText(result.sentences.enoughHead.text);
      await expect(page.getByTestId(`${T}.verdict.rise`)).toContainText('Your plan raises it by 1% a year');
      await expect(page.getByTestId(`${T}.onCourse`)).toHaveText('The classic planner’s pot check (fixed rates)');
      const text = await page.locator('#app').innerText();
      expect(text).not.toMatch(BANNED);
      expect(saverWording(text)).toEqual([]);
      expect(await stored(page), 'working it out writes nothing').toBe(planted);
    });

    await test.step('the rail\'s "Am I saving enough?" opens question B with the plan\'s figures in its boxes (saving-enough-and-check-in.md 4.1, 6.55.0); nothing written', async () => {
      const want = saverDraftOf(upgradeScenario(JSON.parse(JSON.stringify(sam)), { now: new Date(FIXED_NOW) }).scenario, { today: TODAY });
      expect(want.ok).toBe(true);
      const ask = page.getByTestId('rail.ask.b');
      await expect(ask).toHaveAttribute('data-filled', 'plan');
      // the rail's question links are in its sheet, which a phone opens from the rail's one line; a wider screen draws the rail
      // open, its plan's question links with it (6.59.0: they open the question filled from the plan on every width)
      const line = page.getByTestId('rail.line');
      if (await line.isVisible()) await line.click();
      await ask.click();
      await expect(page.locator('#app [data-screen]')).toHaveAttribute('data-screen', 'b.numbers', { timeout: 30_000 });
      expect(new URL(page.url()).hash).toBe('#/b/numbers');
      for (const path of ['you.age', 'you.pot', 'stop.age']) await expect(page.getByTestId('b.' + path), path).toHaveValue(want.values[path]);
      const kind = want.values['you.payIn.kind'];
      await expect(page.getByTestId('b.you.payIn.kind.' + kind)).toBeChecked();
      const widths = await page.evaluate(() => ({ doc: document.documentElement.scrollWidth, win: window.innerWidth }));
      expect(widths.doc, 'no sideways scroll').toBeLessThanOrEqual(widths.win + 1);
      expect(await stored(page), 'opening B writes nothing to the plan').toBe(planted);
      // back to the plan's step for what follows
      await page.goto(v7('#/plan/SavingPlan01/saving'));
      await expect(page.locator('#app [data-screen]')).toHaveAttribute('data-screen', 'plan.saving');
      await expect(page.getByTestId(`${T}.escalationPct`)).toBeVisible({ timeout: 60_000 });
    });

    await test.step('a rise typed and saved: the whole settings object written equal to the Node patch, the lock and the records untouched, the other plan byte-identical; Undo byte for byte', async () => {
      await page.getByTestId(`${T}.escalationPct`).fill('2.5');
      await page.getByTestId(`${T}.save`).click();
      const toast = page.getByTestId(`${T}.toast`);
      await expect(toast).toBeVisible({ timeout: 60_000 });
      await expect(toast).toContainText('a month from you');
      const after = JSON.parse(await stored(page));
      const before = JSON.parse(planted);
      expect(stripped(after[0], SAVING_WRITES)).toBe(stripped(before[0], SAVING_WRITES));
      expect(JSON.stringify(after[0])).toBe(JSON.stringify(applyPatch(before[0], { ...node.save.patch, lastModified: FIXED_NOW })));
      expect(after[0].accumulationTool.settings.escalationPct).toBe(2.5);
      expect(JSON.stringify(after[0].accumulationTool.history)).toBe(JSON.stringify(before[0].accumulationTool.history));
      expect(JSON.stringify(after[0].decisionTool)).toBe(JSON.stringify(before[0].decisionTool));
      expect(JSON.stringify(after[1]), 'the other plan untouched').toBe(JSON.stringify(before[1]));
      await expect(page.getByTestId(`${T}.escalationPct`)).toHaveValue('2.5', { timeout: 60_000 });
      await page.getByTestId(`${T}.undo`).click();
      await expect(page.getByTestId(`${T}.toast`)).toContainText('Put back as it was.', { timeout: 60_000 });
      expect(await stored(page), 'Undo puts the text back byte for byte').toBe(planted);
      await expect(page.getByTestId(`${T}.escalationPct`)).toHaveValue(node.saving.fields.escalationPct, { timeout: 60_000 });
    });

    await test.step('"Record it": the record list written whole with this month added, equal to the Node patch, nothing deleted; Undo byte for byte', async () => {
      await page.getByTestId(`${T}.toastClose`).click();
      await page.getByTestId(`${T}.record.month`).fill(RECORD['record.month']);
      await page.getByTestId(`${T}.record.pension`).fill(RECORD['record.pension']);
      await page.getByTestId(`${T}.record`).click();
      await expect(page.getByTestId(`${T}.toast`)).toContainText('Recorded September 2026: £325,000 in all.', { timeout: 60_000 });
      const after = JSON.parse(await stored(page));
      const before = JSON.parse(planted);
      expect(JSON.stringify(after[0])).toBe(JSON.stringify(applyPatch(before[0], { ...node.record.patch, lastModified: FIXED_NOW })));
      // the same month recorded again is replaced, never doubled (the planner's recordAccumulationMonth); every other record stays
      const others = before[0].accumulationTool.history.filter((r) => r.date !== RECORD['record.month']);
      expect(after[0].accumulationTool.history).toHaveLength(others.length + 1);
      expect(after[0].accumulationTool.history.slice(0, -1)).toEqual(others);
      expect(after[0].accumulationTool.history.slice(-1)[0]).toMatchObject({ date: RECORD['record.month'], sipp: 325000, isa: null });
      expect(JSON.stringify(after[0].accumulationTool.settings)).toBe(JSON.stringify(before[0].accumulationTool.settings));
      await expect(page.getByTestId(`${T}.records`)).toHaveAttribute('data-count', String(others.length + 1), { timeout: 60_000 });
      await page.getByTestId(`${T}.undo`).click();
      await expect(page.getByTestId(`${T}.toast`)).toContainText('Put back as it was.', { timeout: 60_000 });
      expect(await stored(page)).toBe(planted);
      expect(new URL(page.url()).hash).toBe('#/plan/SavingPlan01/saving');
    });

    await test.step('the retired plan: the boxes still there, no saving years to work out', async () => {
      await page.goto(v7('#/plan/SavingOther02/saving'));
      await expect(page.locator('#app [data-screen]')).toHaveAttribute('data-screen', 'plan.saving');
      await expect(page.getByTestId(`${T}.pot.stopped`)).toBeVisible();
      await expect(page.getByTestId(`${T}.pot.table`)).toHaveCount(0);
      const text = await page.locator('#app').innerText();
      expect(text).not.toMatch(BANNED);
      expect(await stored(page)).toBe(planted);
    });
  });
});

/**
 * The planner's own page for a saver (research/saving-enough-and-check-in.md 4.6, release step R2): it opens a saver on
 * their stage's first lead (still saving and locked while saving: the Accumulation planner; within five years: the Stress
 * tester) and every other plan on Month by month (the Decision tool), as before; and its setup wizard has a door for
 * someone still saving that lands on the Accumulation planner. Fictional plans only, kept in this window.
 */
test.describe('the planner opens a saver on their own page, and has a door for them', () => {
  const fixture = (name) => JSON.parse(readFileSync(join(REPO, 'tests', 'fixtures', 'plans', name + '.json'), 'utf8'));
  const unlocked = (p) => { delete p.planDocument; delete p.journey; p.decisionTool.settings = { ...p.decisionTool.settings, locked: false }; return p; };
  /** Alex, 30, stopping at 67 (fictional): ages typed only on the Accumulation tab. */
  const agesOnly = (p) => { p.accumulationTool = { settings: { currentAge: 30, retirementAge: 67, salary: 31000, potNow: 9000, netMonthly: 100, schemeType: 'ras', employerMonthly: 93, escalationPct: 0, isaMonthly: 0 } }; return p; };
  const CASES = [
    ['locked while saving', () => fixture('05-saver-committed'), 'accumulation'],
    ['still saving, unlocked', () => unlocked(fixture('05-saver-committed')), 'accumulation'],
    ['ages only on the Accumulation tab', () => agesOnly(fixture('01-fresh-default')), 'accumulation'],
    ['within five years of stopping', () => fixture('10-couple-b'), 'stress'],
    ['retired, locked and recording', () => fixture('04-buckets-running'), 'decision'],
    ['a draft', () => fixture('02-pnv-draft'), 'decision'],
    ['no age at all', () => fixture('01-fresh-default'), 'decision']
  ];
  test('each plan opens on the tab its stage leads with; only the saver stages moved', async ({ page, watch }) => {
    test.setTimeout(300_000);
    watch.allow(WORKER_DATA_MISSING);
    for (const [name, make, tab] of CASES) {
      await test.step(`${name}: ${tab}`, async () => {
        const plan = make();
        plan.isActive = true;
        delete plan.household;
        await plant(page, [plan]);
        await page.goto(PROD + CLASSIC_PATH);
        await page.locator('#landingTryGuest').click();
        await expect(page.locator('#mainApp')).toBeVisible({ timeout: 30_000 });
        await expect(page.locator(`#${tab}-content`)).toHaveClass(/\bactive\b/, { timeout: 30_000 });
        await expect(page.locator('nav.tabs .tab.active')).toHaveAttribute('data-tab', tab);
        // the tab was pressed, so its own loader filled it (the Accumulation ages are in its boxes)
        if (name === 'ages only on the Accumulation tab') await expect(page.locator('#acAge')).toHaveValue('30');
      });
    }
  });
  test('the setup wizard\'s door for someone still saving lands on the Accumulation planner', async ({ page, watch }) => {
    test.setTimeout(120_000);
    watch.allow(WORKER_DATA_MISSING);
    await page.clock.setFixedTime(new Date(FIXED_NOW));
    await page.goto(PROD + CLASSIC_PATH);
    await page.locator('#landingTryGuest').click();
    await page.locator('#wizCurrentAge').fill('30');
    await page.locator('#wizRetireAge').fill('67');
    await page.locator('[data-action="to-router"]').click();
    const door = page.locator('[data-action="start-accumulation"]');
    await expect(door).toContainText('I\'m still saving: am I paying in enough?');
    await door.click();
    await expect(page.locator('#mainApp')).toBeVisible({ timeout: 30_000 });
    await expect(page.locator('#accumulation-content')).toHaveClass(/\bactive\b/, { timeout: 30_000 });
    await expect(page.locator('nav.tabs .tab.active')).toHaveAttribute('data-tab', 'accumulation');
  });
});
