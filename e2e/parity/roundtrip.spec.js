/**
 * The round trips (lead4.md section 2, G5), generated from the field registry (e2e/parity/fields.js):
 *
 *  1. Each group of boxes (one fixture, one page), in each direction: the boxes typed in view A as a person types them and
 *     left; the save waited for (the stored plan read back from the emulator); when nothing was written, the page's Save
 *     button pressed and that RECORDED ("needs a press"); then view B opened at the boxes' page: each box shows what was
 *     typed (as one quantity, e2e/parity/fields.js canonOf); and the two pages read still agree on every fact the baseline
 *     does not list as a known disagreement.
 *  2. Typed, then a link pressed at once, in each view: the value is saved.
 *  3. Plan 1 open in the full view, then plan 2 chosen from its menu (e2e/parity/fixtures/plans.js SWITCHES): for each page,
 *     plan 1 opened ON that page (its figures drawn as a person draws them), plan 2 chosen, and the page left on screen read
 *     BEFORE anything is pressed — every mark, box and figure outside a mark equals that page with plan 2 opened directly.
 *     Then, as before, every page pressed open after the switch equals plan 2 opened directly (a press reloads a tab, so this
 *     second check cannot see a tab the switch left showing the first plan: the first one is there for that).
 *  4. A new plan made after another (the full view's wizard): no figure or box of the first plan appears on its pages, in
 *     either view.
 *
 * A simple page is typed into only once it is settled (#app data-ready="1", its plan's page drawn): leaving a box there saves
 * the plan and reads the plans again, and meanwhile the page says "Opening your plan" with no boxes, so each box is waited
 * out before the next. The stored plan is read before the first box is typed, so a save made while typing counts as a save.
 * PARITY_CPU=<n> runs the pages on a processor slowed n times (the harness must hold there too).
 *
 * One account per worker, signed in once; before each test it is emptied and seeded again with the fixture's plans. Every
 * outcome is written to test-results/parity/roundtrips/<test>.json and totalled by scripts/e2e-parity.mjs against
 * e2e/parity/known-roundtrips.json (a ratchet, gate.js ratchetTrips). The tests themselves fail only when the harness
 * cannot run (a page that does not open), never on a trip that does not come back: that is the gate's to count.
 */
import { test as base, expect } from '@playwright/test';
import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { PARITY_TODAY, fixtureNamed, SWITCHES } from './fixtures/plans.js';
import { makeAccount, plansOf } from '../signed-in/emulator.js';
import { resetTo, subjectOf, waitChange } from './account.js';
import { REGISTRY, DIRECTIONS, valueIn, canonOf, entryOf } from './fields.js';
import { switchDifferences } from './gate.js';
import { collectMarks, waitQuiet } from './collect.js';
import { FULL_PAGES, fullTab, fullLocked } from './pages.js';
import { signIn, openSimple, openFull, closeNews, fullWizard } from '../scenarios/routes.js';

const OUT = join(process.cwd(), 'test-results', 'parity', 'roundtrips');
const VERSION = JSON.parse(readFileSync(new URL('../../package.json', import.meta.url), 'utf8')).version;
const SETTINGS = { lastSeenVersion: VERSION, view: 'simple' };
const KNOWN = join(process.cwd(), 'e2e', 'parity', 'known-disagreements.json');
const knownPairs = existsSync(KNOWN) ? JSON.parse(readFileSync(KNOWN, 'utf8')).pairs || {} : {};
const only = process.env.PARITY_FIXTURE ? process.env.PARITY_FIXTURE.split(',').map((s) => s.trim()).filter(Boolean) : null;
const runs = (fixture) => !only || only.includes(fixture);

function write(name, fixture, entries) {
  mkdirSync(OUT, { recursive: true });
  writeFileSync(join(OUT, name.replace(/[^a-z0-9.-]+/gi, '_') + '.json'), JSON.stringify({ fixture, test: name, entries }, null, 1) + '\n');
}

// ---- one account per worker, signed in once --------------------------------------------------------------------------

const test = base.extend({
  acct: [async ({ browser }, use, info) => {
    const who = { email: `parity-trips-${info.workerIndex}-${Date.now()}@example.test`, password: 'parity-trips-pass-1' };
    const { uid } = await makeAccount(who);
    const use_ = info.project.use;
    const ctx = await browser.newContext({
      viewport: use_.viewport, deviceScaleFactor: use_.deviceScaleFactor, userAgent: use_.userAgent, locale: use_.locale,
      timezoneId: use_.timezoneId, colorScheme: use_.colorScheme, serviceWorkers: use_.serviceWorkers, reducedMotion: 'reduce'
    });
    await ctx.clock.setFixedTime(new Date(PARITY_TODAY));
    await resetTo(uid, [], SETTINGS);
    const first = await ctx.newPage();
    await signIn(first, who);
    await first.close();
    await use({ uid, ctx, who });
    await ctx.close();
  }, { scope: 'worker' }]
});

/** A fresh page in the worker's signed-in window, the account seeded with these plans. */
async function freshPage(acct, plans) {
  await resetTo(acct.uid, plans, SETTINGS);
  const page = await acct.ctx.newPage();
  page.setDefaultTimeout(20_000);
  if (process.env.PARITY_CPU) await (await acct.ctx.newCDPSession(page)).send('Emulation.setCPUThrottlingRate', { rate: Number(process.env.PARITY_CPU) });
  return page;
}

// ---- the views' pages ---------------------------------------------------------------------------------------------------

/**
 * The simple view settled: nothing being worked out, written or read (#app data-ready="1", src/v7/state/select.js readyMark)
 * and a plan's page drawn, not "Opening your plan"; then its text still (waitQuiet). False after `timeout`.
 */
async function settledSimple(page, timeout = 90_000) {
  const ok = await page.waitForFunction(() => document.querySelector('#app')?.getAttribute('data-ready') === '1' && !document.querySelector('[data-testid="plan.opening"]'), null, { timeout, polling: 100 }).then(() => true, () => false);
  return (await waitQuiet(page, { timeout })) && ok;
}

async function openSimplePage(page, planId, step) {
  await openSimple(page, `#/plan/${planId}${step ? '/' + step : ''}`);
  await closeNews(page);
  await settledSimple(page);
}

async function openFullPage(page, where) {
  await openFull(page);
  await waitQuiet(page);
  if (where && where.tab) {
    const opened = await fullTab(page, where);
    if (!opened) return false;
    await waitQuiet(page);
  }
  if (where && where.fold) {
    const sum = page.locator(`${where.fold} > summary`).first();
    if (await sum.isVisible().catch(() => false) && !(await page.locator(where.fold).evaluate((d) => d.open))) await sum.click();
  }
  if (where && where.press) {
    const b = page.locator(where.press).first();
    if (await b.isVisible().catch(() => false)) { await b.click(); await waitQuiet(page); }
  }
  return true;
}

const openIn = (page, view, e, planId) => (view === 'simple' ? openSimplePage(page, planId, e.simple.page).then(() => true) : openFullPage(page, e.full));

/** The values of a field's boxes on the page: visible form controls (a tick yes/no, radios as the one ticked); a hidden box
 * the view keeps behind buttons is read when no box of the field is visible. */
const boxesOf = (page, id) => page.evaluate((field) => {
  const seen = (el) => !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length) && getComputedStyle(el).visibility !== 'hidden' && !el.closest('details:not([open])');
  const els = [...document.querySelectorAll(`input[data-field="${field}"], select[data-field="${field}"], textarea[data-field="${field}"]`)];
  const shown = els.filter((el) => el.type !== 'hidden' && seen(el));
  const use = shown.length ? shown : els.filter((el) => el.type === 'hidden');
  const out = [];
  const radios = use.filter((el) => el.type === 'radio');
  if (radios.length) out.push(radios.find((r) => r.checked)?.value || '');
  for (const el of use) if (el.type !== 'radio') out.push(el.type === 'checkbox' ? (el.checked ? 'yes' : 'no') : String(el.value ?? '').trim());
  return { values: out, hidden: !shown.length && use.length > 0 };
}, id);

/** Sets a field's box as a person does: a press where the view keeps it behind buttons, a radio, a tick, a list, or typing. */
async function setBox(page, view, e, value) {
  const press = view === 'full' && e.full && e.full.set && e.full.set[value];
  if (press) { await page.locator(press).first().click(); return; }
  const sel = `[data-field="${e.id}"]`;
  const kind = await page.locator(`input${sel}, select${sel}, textarea${sel}`).evaluateAll((els) => {
    const el = els.find((x) => x.type !== 'hidden' && !!(x.offsetWidth || x.offsetHeight));
    return el ? (el.tagName === 'SELECT' ? 'select' : el.type) : null;
  });
  if (kind === 'radio') await page.locator(`input[type="radio"]${sel}[value="${value}"]`).first().click();
  else if (kind === 'checkbox') await page.locator(`input[type="checkbox"]${sel}`).locator('visible=true').first().setChecked(value === 'yes');
  else if (kind === 'select') await page.locator(`select${sel}`).locator('visible=true').first().selectOption(value);
  else {
    const b = page.locator(`input${sel}, textarea${sel}`).locator('visible=true').first();
    await b.click();
    await b.fill(value);
    await page.keyboard.press('Tab');
  }
}

/** The facts read on a page, as the sweep reads them. */
const marksOf = async (page) => (await page.evaluate(collectMarks, {})).places;

/** Facts that disagree across the pages read, for pairs the baseline does not list. */
function newDisagreements(fixture, places) {
  const by = new Map();
  for (const p of places) { if (!by.has(p.fact)) by.set(p.fact, new Set()); by.get(p.fact).add(p.text); }
  return [...by].filter(([fact, texts]) => texts.size > 1 && !knownPairs[`${fixture}|${fact}`]).map(([fact, texts]) => `${fact}: ${[...texts].map((t) => `"${t}"`).join(' / ')}`);
}

// ---- 1. the boxes, each group in each direction ------------------------------------------------------------------------

const groups = new Map();
for (const e of REGISTRY) if (e.kind === 'box' && e.simple && e.full) {
  if (!groups.has(e.group)) groups.set(e.group, []);
  groups.get(e.group).push(e);
}

test.describe('parity round trips: the boxes', () => {
  for (const [group, entries] of groups) {
    const fx = fixtureNamed(entries[0].fixture);
    if (!runs(fx.key)) continue;
    for (const dir of DIRECTIONS) {
      const A = dir === 's2f' ? 'simple' : 'full';
      const B = dir === 's2f' ? 'full' : 'simple';
      test(`${group} ${dir}`, async ({ acct }) => {
        test.setTimeout(6 * 60_000);
        const plans = fx.plans();
        const subject = plans.find((p) => p.id === fx.subject);
        const page = await freshPage(acct, plans);
        const out = new Map(entries.map((e) => [e.id, { key: `${e.id}|${dir}`, field: e.id, kind: 'ok', press: false }]));
        const fail = (id, kind, detail) => { const t = out.get(id); if (t.kind === 'ok') Object.assign(t, { kind, detail }); };

        expect(await openIn(page, A, entries[0], fx.subject), `${A} view opens the page of ${group}`).toBe(true);
        // each box left as a person leaves it: in the simple view, waited out until the page is drawn again
        const settle = () => (A === 'simple' ? settledSimple(page) : null);
        for (const [id, v] of (entries[0].prep && entries[0].prep[A]) || []) { await setBox(page, A, entryOf(id), v); await settle(); }
        // read before the boxes are typed: a box saved on leaving it (the simple "What you pay in") writes while the rest are typed
        const before = JSON.stringify(await subjectOf(acct.uid, fx.subject));
        const typed = [];
        for (const e of entries) {
          const v = valueIn(e, A, subject);
          const now = await boxesOf(page, e.id);
          if (!now.values.length && !(A === 'full' && e.full.set)) { fail(e.id, 'not reachable', `no box of ${e.id} on the ${A} view's page`); continue; }
          if (now.values.length && now.values.every((x) => canonOf(e.id, A, x) === canonOf(e.id, A, v))) { fail(e.id, 'not reachable', `the registry's value ${v} is already shown: not a change`); continue; }
          await setBox(page, A, e, v);
          await settle();
          typed.push(e);
        }
        for (const [id, v] of (entries[0].then && entries[0].then[A]) || []) { await setBox(page, A, entryOf(id), v); await settle(); }
        if (typed.length) await page.keyboard.press('Tab');
        let saved = typed.length ? await waitChange(acct.uid, fx.subject, before, 5_000) : false;
        let press = false;
        if (typed.length && !saved) {
          const save = A === 'simple' ? page.getByTestId(`plan.${entries[0].simple.page}.save`) : page.locator(entries[0].full.save || '#ssSaveBtn');
          if (await save.first().isVisible().catch(() => false)) { press = true; await save.first().click(); saved = await waitChange(acct.uid, fx.subject, before, 15_000); }
        }
        for (const e of typed) { out.get(e.id).press = press; if (!saved) fail(e.id, 'not saved', press ? 'nothing written, even after the Save button' : 'nothing written and no Save button'); }
        await (settle() || waitQuiet(page));
        const placesA = (await marksOf(page)).map((p) => ({ ...p, view: A }));

        // view B, opened fresh at the boxes' page
        const pageB = await acct.ctx.newPage();
        expect(await openIn(pageB, B, entries[0], fx.subject), `${B} view opens the page of ${group}`).toBe(true);
        for (const e of typed) {
          const got = await boxesOf(pageB, e.id);
          if (!got.values.length) { fail(e.id, 'not in the other view', `no box of ${e.id} on the ${B} view's page`); continue; }
          const want = canonOf(e.id, A, valueIn(e, A, subject));
          const shows = got.values.map((x) => canonOf(e.id, B, x));
          if (shows.some((x) => x !== want)) fail(e.id, 'shows another value', `typed ${valueIn(e, A, subject)} in the ${A} view; the ${B} view shows ${got.values.join(' / ')}`);
        }
        const placesB = (await marksOf(pageB)).map((p) => ({ ...p, view: B }));
        const broken = newDisagreements(fx.key, [...placesA, ...placesB]);
        const entriesOut = [...out.values()];
        entriesOut.push({ key: `sweep:${group}|${dir}`, kind: typed.length && broken.length ? 'sweep breaks' : 'ok', press: false, ...(broken.length ? { detail: broken.slice(0, 6).join('; ') } : {}) });
        write(`box-${group}-${dir}`, fx.key, entriesOut);
        await pageB.close();
        await page.close();
      });
    }
  }
});

// lists of rows, not typed into yet: counted as not tried, both directions (no browser needed)
test('parity round trips: the lists, not tried yet', async () => {
  const byFixture = new Map();
  for (const e of REGISTRY) if (e.kind === 'list' && e.simple && e.full && runs(e.fixture)) {
    if (!byFixture.has(e.fixture)) byFixture.set(e.fixture, []);
    for (const dir of DIRECTIONS) byFixture.get(e.fixture).push({ key: `${e.id}|${dir}`, field: e.id, kind: 'not tried', press: false, detail: e.why || 'rows of boxes' });
  }
  for (const [fixture, entries] of byFixture) write(`lists-${fixture}`, fixture, entries);
});

// ---- 2. typed, then a link pressed at once ----------------------------------------------------------------------------

test.describe('parity round trips: typed, then a link at once', () => {
  const fx = fixtureNamed('saver-draft');
  if (!runs(fx.key)) return;
  for (const view of ['simple', 'full']) {
    test(`type then link: ${view}`, async ({ acct }) => {
      const plans = fx.plans();
      const page = await freshPage(acct, plans);
      const e = entryOf('about.age');
      expect(await openIn(page, view, e, fx.subject)).toBe(true);
      const before = JSON.stringify(await subjectOf(acct.uid, fx.subject));
      const sel = `input[data-field="about.age"]`;
      await page.locator(sel).locator('visible=true').first().fill('44');
      // the link at once: the simple view's rail to the next step, the full view's next tab
      if (view === 'simple') {
        // a link to another page of the plan: the rail's home, or any other step shown
        const links = page.locator(`#app a[href*="#/plan/${fx.subject}"]:not([href$="/about"])`).locator('visible=true');
        await links.first().click();
      }
      else await page.locator('.tab[data-tab="strategies"]').click();
      const saved = await waitChange(acct.uid, fx.subject, before, 6_000);
      write(`link-${view}`, fx.key, [{ key: `typeThenLink|${view}`, kind: saved ? 'ok' : 'not saved', press: false, ...(saved ? {} : { detail: 'typed 44 as the age, then a link pressed at once: nothing written' }) }]);
      await page.close();
    });
  }
});

// ---- 3. plan 1, then plan 2 chosen inside the full view ----------------------------------------------------------------

/** The full view's plan menu opened as a person opens it (the plan button at the top) and a plan chosen in it. */
async function chooseInMenu(page, id) {
  await closeNews(page);
  await page.locator('#scenarioActiveBtn').click();
  await page.locator(`.scenario-dropdown-item[data-scenario-id="${id}"]`).click();
}

/** The page of the full view on screen now: { tab, sub } (sub null on a tab without sub-tabs). */
const landedOn = (page) => page.evaluate(() => {
  const tab = document.querySelector('.tab.active')?.getAttribute('data-tab') || null;
  const sub = tab ? document.querySelector(`.sub-tab.active[data-${tab}tab]`)?.getAttribute(`data-${tab}tab`) || null : null;
  return { tab, sub };
});
const pageNameOf = ({ tab, sub }) => (FULL_PAGES.find((p) => p.tab === tab && (!p.sub || p.sub === sub)) || {}).name || `${tab}${sub ? '/' + sub : ''}`;

/** The page on screen read as it stands, nothing pressed: { facts, fields, figures } (gate.js switchDifferences). */
async function readAsIs(page) {
  const got = await page.evaluate(collectMarks, { figures: true });
  const facts = {};
  for (const x of got.places) (facts[x.fact] ||= []).push(x.text);
  for (const c of got.cells) (facts[`table:${c.table}:${c.row}:${c.col}`] ||= []).push(c.text);
  const fields = {};
  for (const f of got.fields) if (entryOf(f.field)) (fields[f.field] ||= []).push(f.value);
  return { facts, fields, figures: got.figures };
}

/** Every page of the full view read as the sweep reads it: { '<page>': { facts: {id: [texts]}, fields: {id: [values]} } }. */
async function readFullView(page) {
  const out = {};
  for (const p of FULL_PAGES) {
    const opened = await fullTab(page, p);
    if (!opened) { out[p.name] = null; continue; }
    if (p.press && (!p.onlyLocked || await fullLocked(page))) {
      const run = page.locator(p.press).first();
      if (await run.isVisible().catch(() => false)) await run.click();
    }
    await waitQuiet(page);
    if (p.openFolds) await page.evaluate((sel) => { for (const d of document.querySelectorAll(sel + ' details')) d.open = true; }, p.openFolds);
    const got = await page.evaluate(collectMarks, {});
    const facts = {};
    for (const x of got.places) (facts[x.fact] ||= []).push(x.text);
    for (const c of got.cells) (facts[`table:${c.table}:${c.row}:${c.col}`] ||= []).push(c.text);
    const fields = {};
    for (const f of got.fields) if (entryOf(f.field)) (fields[f.field] ||= []).push(f.value);
    out[p.name] = { facts, fields };
  }
  return out;
}

const plansWithOpen = (fx, activeId) => fx.plans().map((p) => ({ ...p, isActive: p.id === activeId }));

test.describe('parity round trips: a plan chosen inside the full view, the page on screen read before any press', () => {
  for (const sw of SWITCHES) {
    const fx = fixtureNamed(sw.fixture);
    if (!runs(fx.key)) continue;
    for (const p of FULL_PAGES) {
      test(`switch ${sw.key} on ${p.name}`, async ({ acct }) => {
        test.setTimeout(5 * 60_000);
        const key = `switch:${sw.key}:${p.name}`;
        // plan 1 open on the page, its figures drawn as a person draws them (the page's own press, its folds opened)
        let page = await freshPage(acct, plansWithOpen(fx, sw.from));
        await openFull(page);
        await waitQuiet(page);
        if (!(await fullTab(page, p))) {
          write(`switch-${sw.key}-${p.name}`, fx.key, [{ key: `${key}|all`, kind: 'ok', press: false, detail: 'the first plan does not offer this page' }]);
          await page.close();
          return;
        }
        if (p.press && (!p.onlyLocked || await fullLocked(page))) {
          const run = page.locator(p.press).first();
          if (await run.isVisible().catch(() => false)) await run.click();
        }
        await waitQuiet(page);
        if (p.openFolds) await page.evaluate((sel) => { for (const d of document.querySelectorAll(sel + ' details')) d.open = true; }, p.openFolds);
        // plan 2 chosen from the menu; the page the view leaves on screen read as it stands
        await chooseInMenu(page, sw.to);
        await waitQuiet(page);
        const landed = await landedOn(page);
        const switched = await readAsIs(page);
        await page.close();
        // plan 2 opened directly on that page, nothing pressed
        page = await freshPage(acct, plansWithOpen(fx, sw.to));
        await openFull(page);
        await waitQuiet(page);
        const entries = [];
        const there = landed.tab ? await fullTab(page, landed) : true;
        if (!there) {
          entries.push({ key: `${key}|page`, kind: 'differs from opened directly', press: false, detail: `the switch leaves the ${pageNameOf(landed)} page on screen; the plan opened directly does not offer it` });
        } else {
          await waitQuiet(page);
          const direct = await readAsIs(page);
          for (const d of switchDifferences(direct, switched)) {
            entries.push({ key: `${key}|${d.id}`, kind: 'differs from opened directly', press: false, detail: `${pageNameOf(landed)}: directly ${d.direct.slice(0, 120)} / after the switch ${d.switched.slice(0, 120)}` });
          }
        }
        if (!entries.length) entries.push({ key: `${key}|all`, kind: 'ok', press: false, detail: `read on ${pageNameOf(landed)}` });
        write(`switch-${sw.key}-${p.name}`, fx.key, entries);
        await page.close();
      });
    }
  }
});

test.describe('parity round trips: a plan chosen inside the full view, then every page pressed open', () => {
  const fx = fixtureNamed('couple');
  if (!runs(fx.key)) return;
  test('plan 1 then plan 2 equals plan 2 opened directly', async ({ acct }) => {
    test.setTimeout(15 * 60_000);
    const other = fx.plans().find((p) => p.id !== fx.subject);
    // plan 2 opened directly
    let page = await freshPage(acct, plansWithOpen(fx, other.id));
    await openFull(page);
    await waitQuiet(page);
    const direct = await readFullView(page);
    await page.close();
    // plan 1 opened, then plan 2 chosen from the menu
    page = await freshPage(acct, plansWithOpen(fx, fx.subject));
    await openFull(page);
    await waitQuiet(page);
    await chooseInMenu(page, other.id);
    await waitQuiet(page);
    const switched = await readFullView(page);
    await page.close();
    const differs = new Map();
    const note = (k, what) => { if (!differs.has(k)) differs.set(k, what); };
    for (const name of Object.keys(direct)) {
      const a = direct[name], b = switched[name];
      if (!a || !b) { if (!!a !== !!b) note(`page:${name}`, `${name} opens ${a ? 'only when opened directly' : 'only after the switch'}`); continue; }
      for (const kind of ['facts', 'fields']) {
        const ids = new Set([...Object.keys(a[kind]), ...Object.keys(b[kind])]);
        for (const id of ids) {
          const x = JSON.stringify(a[kind][id] || []), y = JSON.stringify(b[kind][id] || []);
          if (x !== y) note(`${kind === 'fields' ? 'field:' : ''}${id.startsWith('table:years:') ? 'table:years' : id}`, `${name}: directly ${x.slice(0, 80)} / after the switch ${y.slice(0, 80)}`);
        }
      }
    }
    const entries = [...differs].map(([k, detail]) => ({ key: `switch|${k}`, kind: 'differs from opened directly', press: false, detail }));
    if (!entries.length) entries.push({ key: 'switch|all', kind: 'ok', press: false });
    write('switch-plans', fx.key, entries);
  });
});

// ---- 4. a new plan after another --------------------------------------------------------------------------------------

/** The first plan's own figures, in the forms a page writes them: £280,000, 280,000, 280000. */
function figuresOf(plan) {
  const s = (plan.stressTool && plan.stressTool.settings) || {};
  const nums = new Set();
  const add = (n) => { if (typeof n === 'number' && Number.isFinite(n) && Math.abs(n) >= 1000) nums.add(Math.round(n)); };
  for (const v of Object.values(s)) add(v);
  for (const list of [s.windfalls, s.extraIncomes, s.incomeSteps, s.extraWithdrawals]) for (const r of list || []) for (const v of Object.values(r || {})) add(v);
  return nums;
}

test.describe('parity round trips: a new plan after another', () => {
  const fx = fixtureNamed('retired-everything');
  if (!runs(fx.key)) return;
  test('a new plan shows nothing of the first', async ({ acct }) => {
    test.setTimeout(15 * 60_000);
    const plans = fx.plans();
    const first = plans.find((p) => p.id === fx.subject);
    const page = await freshPage(acct, plans);
    await openFull(page);
    await waitQuiet(page);
    await fullWizard(page, { age: 52, retired: false, retireAge: 63, start: 'start-stress' });
    await waitQuiet(page);
    const stored = (await plansOf(acct.uid)).find((p) => p.id !== first.id);
    expect(stored, 'the wizard made a new plan').toBeTruthy();
    // a figure the new plan holds itself (a default it shares with the first) is not a carry-over; the first plan's name in
    // the plan menus is the first plan itself, so names are not looked for
    const own = figuresOf(stored);
    const look = [...figuresOf(first)].filter((n) => !own.has(n));
    const hits = new Map();
    const scan = async (where) => {
      const got = await page.evaluate((nums) => {
        const text = document.body.innerText;
        const boxes = [...document.querySelectorAll('input, select, textarea')].filter((el) => el.type !== 'hidden' && !!(el.offsetWidth || el.offsetHeight)).map((el) => String(el.value));
        const found = [];
        for (const n of nums) {
          const grouped = n.toLocaleString('en-GB');
          if (new RegExp(`£${grouped}(?![\\d,])`).test(text)) found.push(`£${grouped}`);
          if (boxes.includes(String(n))) found.push(`a box holding ${n}`);
        }
        return found;
      }, look);
      for (const f of got) { if (!hits.has(f)) hits.set(f, []); if (!hits.get(f).includes(where)) hits.get(f).push(where); }   // every place a figure is seen (check round 2 of step S: the first place alone hid a carry-over on a later page)
    };
    for (const p of FULL_PAGES) {
      if (!(await fullTab(page, p))) continue;
      await waitQuiet(page);
      await scan(`full ${p.name}`);
    }
    for (const step of ['', 'about', 'income', 'spend', 'pots', 'lasts']) {
      await openSimplePage(page, stored.id, step);
      await scan(`simple ${step || 'home'}`);
    }
    const entries = [...hits].map(([f, where]) => ({ key: `newPlan|${f}`, kind: 'carried over', press: false, detail: `seen on ${where.join('; ')}` }));
    if (!entries.length) entries.push({ key: 'newPlan|all', kind: 'ok', press: false });
    write('new-plan', fx.key, entries);
    await page.close();
  });
});

