/**
 * What every browser test stands on (test plan 7.2, 7.3; build brief 4.9).
 *
 *   test, expect      Playwright's, with one automatic fixture (`watch`) that fails any test whose page logged a
 *                     console error, threw, had a request fail, broke the security policy, or (V7) asked for
 *                     anything outside its own site.
 *   v7(page, build)   the page as a person uses it: open an address, wait for the ready mark, click, type —
 *                     counting clicks, boxes and screens — and after every step look the screen over.
 *   BUILT, waitsFor   which parts of V7 are still package 1's stubs. A script that needs a part not built yet is
 *                     skipped WITH THE REASON; the moment the stub is replaced the script runs. Nothing to switch on.
 *
 * No test waits for a length of time. `ready()` waits for #app[data-ready="1"].
 */
import { test as base, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { existsSync, readFileSync, readdirSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SCHEMA_C } from '../../src/answers/c/schema.js';
import { QUESTIONS, BUILT as BUILT_QUESTIONS } from '../../src/v7/rail/questions.js';
import { parse, screenName } from '../../src/v7/router/routes.js';
import { answerFromDraft, get, near, TODAY, FINAL_ENV, FIRST_ENV } from './answerInNode.js';

export { expect, TODAY, FINAL_ENV, FIRST_ENV };

export const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
export const DIST = resolve(REPO, process.env.E2E_DIST || 'dist');
export const PROD = `http://127.0.0.1:${Number(process.env.E2E_PORT_PROD || 4173)}`;
export const TEST = `http://127.0.0.1:${Number(process.env.E2E_PORT_TEST || 4174)}`;
export const NIGHTLY = process.env.NIGHTLY === '1';

/** The moment every browser test is pinned to: the corpus date (tests/fixtures/plans/checks.mjs CORPUS_NOW). */
export const FIXED_NOW = '2026-09-30T08:00:00.000Z';

// ---- which parts are built --------------------------------------------------------------------------------

const has = (p) => existsSync(join(REPO, p));
const isStub = (p) => !has(p) || /STUB \(V7 package 1\)|answerCStub|tests\/v7\/stubs\//.test(readFileSync(join(REPO, p), 'utf8'));
const statesDir = join(REPO, 'tests', 'v7', 'states', 'c');

export const BUILT = Object.freeze({
  screens: !isStub('src/v7/App.jsx'),                                       // package 4
  shell: !isStub('src/v7/main.jsx'),                                        // package 3
  answer: !isStub('src/answers/c/answer.js'),                               // package 2
  hooks: !isStub('src/v7/main.jsx') && has('src/v7/testing/hooks.js'),      // package 3: window.__pt in the test build
  states: existsSync(statesDir) && readdirSync(statesDir).some((f) => f.endsWith('.json')),   // package 4
  checkScreen: has('tests/v7/render/checkScreen.js')                        // package 4
});
const WAITING = {
  screens: 'the screens (package 4): src/v7/App.jsx is still the package 1 stub',
  shell: 'the shell (package 3): src/v7/main.jsx is still the package 1 stub',
  answer: 'the real answer (package 2): src/answers/c/answer.js is still the package 1 stub',
  hooks: 'the test hooks (package 3): src/v7/testing/hooks.js',
  states: 'the named states (package 4): tests/v7/states/c/*.json',
  checkScreen: 'checkScreen (package 4): tests/v7/render/checkScreen.js'
};

/** Skips the test (or the describe block) while any named part is still a stub — saying which. */
export function waitsFor(...parts) {
  const missing = parts.filter((p) => !BUILT[p]);
  base.skip(missing.length > 0, `Not run yet — waits for ${missing.map((p) => WAITING[p]).join('; ')}`);
}

// ---- addresses --------------------------------------------------------------------------------------------

/** Every V7 address (brief 4.8), and the screen each draws. */
export const ADDRESSES = [
  { hash: '#/', screen: 'front' },
  ...BUILT_QUESTIONS.c.steps.map((s) => ({ hash: `#/c/${s.id}`, screen: s.built ? `c.${s.id}` : 'notBuilt' })),
  ...QUESTIONS.filter((q) => !q.built).map((q) => ({ hash: `#/soon/${q.id}`, screen: 'soon' })),
  { hash: '#/c/numbers?focus=you.age', screen: 'c.numbers' },
  { hash: '#/no-such-page', screen: 'front' },
  { hash: '#/plan/abc/c/answer', screen: 'front' },      // reserved for saved plans; "page not found" in this slice
  { hash: '#/soon/c', screen: 'front' }
];

/**
 * A LOCAL aid while another package's screens are mid-change: E2E_IGNORE=<regexp> drops matching problems from
 * the screen checks so the rest of a journey can be seen. Never set in a workflow (tests/v7/e2eRules.test.js).
 */
const IGNORE = process.env.E2E_IGNORE ? new RegExp(process.env.E2E_IGNORE) : null;
export const notIgnored = (text) => !(IGNORE && IGNORE.test(text));

// ---- the watch: what no page may do -----------------------------------------------------------------------

const isLocal = (u) => { try { const h = new URL(u).hostname; return h === '127.0.0.1' || h === 'localhost' || h === ''; } catch { return true; } };

export const test = base.extend({
  /** 'refuse': a request outside the site fails the test (V7). 'block': it is stopped quietly (the current app, which would call Firebase). */
  outside: ['refuse', { option: true }],

  watch: [async ({ page, context, outside }, use) => {
    const problems = [];
    const allowed = [];
    const add = (text) => { if (!allowed.some((re) => re.test(text))) problems.push(text); };

    // Nothing in a browser test reaches the internet: not the live site, not Firebase, not a font host.
    await context.route((url) => /^https?:$/.test(url.protocol) && !isLocal(url.href), (route) => {
      if (outside === 'refuse') add(`asked for something outside the site: ${route.request().url()}`);
      return route.abort();
    });

    await context.exposeFunction('e2eReportPolicy', (text) => add(`security policy: ${text}`));
    await context.addInitScript(() => {
      document.addEventListener('securitypolicyviolation', (e) => {
        window.e2eReportPolicy(`${e.effectiveDirective || e.violatedDirective} blocked ${e.blockedURI || 'inline'} (${e.sourceFile || 'page'}:${e.lineNumber || 0})`);
      });
    });

    page.on('console', (m) => {
      if (m.type() !== 'error') return;
      const from = (m.location() && m.location().url) || '';
      if (from && !isLocal(from)) return;                                         // a request this test stopped
      if (outside === 'block' && /Failed to load resource|net::ERR_FAILED/.test(m.text())) return;
      add(`console error: ${m.text()}`);
    });
    page.on('pageerror', (e) => add(`uncaught error: ${e.message}`));
    page.on('requestfailed', (r) => {
      if (!isLocal(r.url())) return;
      const why = (r.failure() && r.failure().errorText) || '';
      if (/ERR_ABORTED|NS_BINDING_ABORTED|cancelled|Load request cancelled/i.test(why)) return;   // the page moved on
      add(`request failed: ${r.url()} ${why}`);
    });
    page.on('response', (r) => {
      if (!isLocal(r.url())) return;
      // The server answers a missing path as Cloudflare Pages does (often the home page with a 200) and marks it.
      const path = new URL(r.url()).pathname;
      if (r.url().startsWith(TEST) && path === '/favicon.png') return;          // the test build is V7 alone: no site root, no favicon (Firefox asks)
      if (r.headers()['x-e2e-fallback']) add(`asked for a file that is not there: ${path}`);
      else if (r.status() >= 400) add(`HTTP ${r.status()}: ${r.url()}`);
    });

    await use({ problems, allow: (re) => allowed.push(re) });

    expect(problems, 'the page must not log an error, fail a request, or break the security policy').toEqual([]);
  }, { auto: true }]
});

// ---- looking a screen over (runs on every step, in both builds) --------------------------------------------

/**
 * Checks that need no state and no approved picture (test plan 5: R1, R6, R9, R12; 8.3: geometry).
 * Returns a list of problems as text; empty means the screen is sound.
 */
export async function lookOver(page) {
  return page.evaluate(() => {
    const out = [];
    const app = document.getElementById('app');
    if (!app) return ['there is no #app'];
    const seen = (el) => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none'; };
    const name = (el) => el.getAttribute('data-testid') || el.getAttribute('data-key') || el.id || el.tagName.toLowerCase();

    // R1 — no rubbish
    const text = app.innerText || '';
    for (const bad of ['undefined', 'NaN', 'Infinity', '[object', '-£0', '£-', '£NaN', '{', '}']) if (text.includes(bad)) out.push(`the screen shows "${bad}"`);
    if (/\bnull\b/.test(text)) out.push('the screen shows "null"');
    // R10 — one, not "1 years"
    const one = /\b1 (years|months|futures|pensions)\b/.exec(text);
    if (one) out.push(`the screen says "${one[0]}"`);

    // R2 (the part that needs no state), R6, R12 — every number carries its key, the same key the same value, money looks like money
    const values = new Map();
    for (const el of app.querySelectorAll('[data-value]')) {
      const key = el.getAttribute('data-key');
      if (!key) { out.push(`a number without a data-key: "${el.textContent}"`); continue; }
      const v = el.getAttribute('data-value');
      if (values.has(key) && values.get(key) !== v) out.push(`${key} is drawn with two values: ${values.get(key)} and ${v}`);
      values.set(key, v);
      const t = el.textContent.trim();
      if (t.includes('£') && !/^£\d{1,3}(,\d{3})*$/.test(t)) out.push(`${key} is not whole pounds: "${t}"`);
    }

    // R9 — one main heading
    const h1 = [...app.querySelectorAll('h1')].filter(seen).length;
    if (h1 !== 1) out.push(`${h1} main headings (there must be exactly one)`);

    // Geometry — nothing scrolls sideways; every control is inside the screen's width
    const doc = document.documentElement;
    if (doc.scrollWidth > doc.clientWidth) out.push(`the page scrolls sideways (${doc.scrollWidth} wide in a ${doc.clientWidth} window)`);
    for (const el of app.querySelectorAll('[data-testid]')) {
      if (!seen(el)) continue;
      const r = el.getBoundingClientRect();
      if (r.left < -0.5 || r.right > doc.clientWidth + 0.5) out.push(`${name(el)} is outside the screen (${Math.round(r.left)} to ${Math.round(r.right)} of ${doc.clientWidth})`);
    }
    // …no two children of the header or the rail overlap (the broken iPad header)
    for (const box of app.querySelectorAll('header, [data-region="rail"]')) {
      const kids = [...box.children].filter(seen).map((k) => ({ k, r: k.getBoundingClientRect() }));
      for (let i = 0; i < kids.length; i++) for (let j = i + 1; j < kids.length; j++) {
        const a = kids[i].r; const b = kids[j].r;
        if (a.left < b.right - 1 && b.left < a.right - 1 && a.top < b.bottom - 1 && b.top < a.bottom - 1) out.push(`${name(kids[i].k)} and ${name(kids[j].k)} overlap in the ${box.tagName === 'HEADER' ? 'header' : 'rail'}`);
      }
    }
    // …on a phone, every button, link and box is at least 44 pixels tall (a tick box or radio: its label)
    if (doc.clientWidth <= 390) {
      for (const el of app.querySelectorAll('button, a[href], input, select, textarea')) {
        if (!seen(el)) continue;
        const small = el.matches('input[type="radio"], input[type="checkbox"]');
        const target = small ? (el.closest('label') || (el.id && app.querySelector(`label[for="${CSS.escape(el.id)}"]`)) || el) : el;
        const h = target.getBoundingClientRect().height;
        if (h < 43.5) out.push(`${name(el)} is ${Math.round(h)} pixels tall on a phone (at least 44)`);
      }
    }
    return out;
  });
}

/** Phrases that must never be shown to someone already taking their money (test plan 5, the retired scope; Rail 3.2). */
export const RETIRED_BANNED = ['when you retire', 'until you retire', 'when you stop work', 'years to go', 'months to go', 'plan starts', 'countdown', 'to retirement'];
export function retiredWording(text) {
  const t = String(text).toLowerCase();
  const found = RETIRED_BANNED.filter((w) => t.includes(w));
  const wait = /\bin \d+ (years|months)\b/.exec(t);
  if (wait) found.push(wait[0]);
  return found;
}

/** Every number the screen draws from the answer: [{ key, value, text }]. */
export const drawnValues = (page) => page.$$eval('#app [data-key][data-value]', (els) => els.map((el) => ({ key: el.getAttribute('data-key'), value: el.getAttribute('data-value'), text: el.textContent.trim() })));

/**
 * Screen equals engine: every [data-value] on the page against the answer worked out in Node from the same
 * inputs, date and seed. Whole figures and ages exactly; raw money within 1p.
 */
export function againstEngine(drawn, answer, { before = null } = {}) {
  const out = [];
  for (const d of drawn) {
    // "Before / Now": the previous final answer's careful amount, kept in the state (brief 4.5 `before`), not in this answer.
    if (d.key.startsWith('before.')) { if (!before) continue; }
    const want = d.key.startsWith('before.') ? get(before, d.key.slice('before.'.length)) : get(answer, d.key);
    if (want === undefined) { out.push(`${d.key} is on the screen but not in the answer`); continue; }
    if (typeof want === 'number') {
      const got = Number(d.value);
      const exact = Number.isInteger(want);
      if (exact ? got !== want : !near(got, want)) out.push(`${d.key}: the screen has ${d.value} (${d.text}), the engine ${want}`);
    } else if (String(want) !== d.value) out.push(`${d.key}: the screen has ${d.value}, the engine ${want}`);
  }
  return out;
}

// ---- checkScreen, the render tests' own helper, run on the live page ---------------------------------------

let checkScreenBundle;
async function checkScreenSource() {
  if (checkScreenBundle !== undefined) return checkScreenBundle;
  const { build } = await import('esbuild');
  const entry = join(REPO, 'tests', 'v7', 'render', 'checkScreen.js');
  const made = await build({
    stdin: { contents: `import * as m from ${JSON.stringify(entry)}; globalThis.e2eCheckScreen = m.checkScreen || m.default;`, resolveDir: REPO, loader: 'js' },
    bundle: true, format: 'iife', write: false, platform: 'browser', target: 'es2022',
    jsx: 'automatic', jsxImportSource: 'preact', loader: { '.json': 'json' }, logLevel: 'silent',
    define: { 'import.meta.env.MODE': '"test"' }
  });
  checkScreenBundle = made.outputFiles[0].text;
  return checkScreenBundle;
}

/** checkScreen(root, state) on the live page. Needs the test build (the state comes from window.__pt) and the real screens. */
export async function checkScreenOnPage(page) {
  if (!BUILT.checkScreen || !BUILT.hooks || !BUILT.screens) return [];
  const hasHooks = await page.evaluate(() => typeof window.__pt === 'object' && !!window.__pt);
  if (!hasHooks) return [];
  await page.evaluate(await checkScreenSource());
  return page.evaluate(() => {
    try {
      const r = window.e2eCheckScreen(document.getElementById('app'), window.__pt.getState());
      if (Array.isArray(r)) return r.map(String);
      if (r && Array.isArray(r.problems)) return r.problems.map(String);
      return [];
    } catch (e) { return [`checkScreen: ${e && e.message ? e.message : e}`]; }
  });
}

// ---- the page as a person uses it --------------------------------------------------------------------------

const FIELD = new Map(SCHEMA_C.fields.map((f) => [f.path, f]));

class V7Page {
  constructor(page, build) {
    this.page = page;
    this.build = build;                                    // 'prod' | 'test'
    this.base = (build === 'prod' ? PROD : TEST) + '/v7/';
    this.counts = { clicks: 0, fields: new Set(), screens: [] };
    this.typed = {};                                       // what this test typed, by field path — the engine check's inputs
    this.app = page.locator('#app');
  }

  /** Fix the date (timers keep running) and open an address. The worker gets the date from the page, as an input. */
  async open(hash = '#/') {
    await this.page.clock.setFixedTime(new Date(FIXED_NOW));
    await this.page.goto(this.base + hash);
    await this.at(screenName(parse(hash)));
    await this.note();
  }

  /** Move to another address in the same tab, as a link or the address bar would, and wait for its screen. */
  async go(hash) {
    await this.page.evaluate((h) => { window.location.hash = h; }, hash);
    await this.at(screenName(parse(hash)));
    await this.note();
  }

  /** A screen is drawn (whether or not an answer is still being worked out). */
  async drawn() { await expect(this.page.locator('#app [data-screen]')).toBeVisible(); }

  /** The named screen is drawn (a move between steps is a hash change, which the page follows a moment later). */
  async at(screen) { await expect(this.page.locator('#app [data-screen]')).toHaveAttribute('data-screen', screen); }

  /** Follow a rail link to a step. On a phone the rail is a sheet, pulled up from its line first. */
  async rail(step) {
    const link = this.id(`rail.c.${step}`);
    if (!(await link.isVisible()) && (await this.id('rail.line').isVisible())) await this.click('rail.line');
    await this.click(`rail.c.${step}`);
    const s = BUILT_QUESTIONS.c.steps.find((x) => x.id === step);
    await this.at(s && s.built ? `c.${step}` : 'notBuilt');
  }

  /** Nothing is running and any answer shown is final. */
  async ready(timeout = 30_000) { await expect(this.app).toHaveAttribute('data-ready', '1', { timeout }); }

  screen() { return this.page.locator('#app [data-screen]').getAttribute('data-screen'); }

  async note() {
    const s = await this.screen();
    if (this.counts.screens[this.counts.screens.length - 1] !== s) this.counts.screens.push(s);
    return s;
  }

  id(testid) { return this.page.getByTestId(testid); }

  async click(testid) {
    this.counts.clicks += 1;
    await this.id(testid).click();
  }

  /** Type into a box one key at a time, as a person does. Clicking into the box counts as a click; a box that already has the cursor does not. */
  async type(testid, text, { delay = 0, path = null } = {}) {
    const box = this.id(testid);
    const focused = await box.evaluate((el) => el === document.activeElement);
    if (!focused) { this.counts.clicks += 1; await box.click(); }
    await box.pressSequentially(String(text), { delay });
    await expect(box).toHaveValue(String(text));          // a box that loses its place after a key ends up with the wrong text
    if (path) { this.counts.fields.add(path); this.typed[path] = String(text); }
  }

  /** Set one field of the input list the way its kind of control is used. */
  async set(path, value, { delay = 0 } = {}) {
    const f = FIELD.get(path);
    if (!f) throw new Error(`no such field: ${path}`);
    if (path === 'household') {
      const open = await this.id('c.partner.age').isVisible();
      if (value === 'couple' && !open) await this.click('c.action.addPartner');
      if (value === 'single' && open) await this.click('c.action.removePartner');
    } else {
      if (f.group === 'more' && !(await this.page.locator(`[data-testid^="c.${path}"]`).first().isVisible())) await this.click('c.action.moreDetail');
      if (f.type === 'choice') await this.click(`c.${path}.${value}`);
      else if (f.type === 'yesNo') await this.click(`c.${path}.${value ? 'yes' : 'no'}`);
      else {
        const box = this.id(`c.${path}`);
        if ((await box.inputValue()) !== '') { this.counts.clicks += 1; await box.click(); await box.fill(''); }
        await this.type(`c.${path}`, value, { delay, path });
      }
    }
    this.counts.fields.add(path);
    this.typed[path] = typeof value === 'boolean' ? value : String(value);
  }

  /** Several fields of the numbers step, in the order of the input list. `take` (the try-a-change row) is never on that step: a journey sets it on the answer. */
  async fill(values, opts) {
    for (const f of SCHEMA_C.fields) if (f.group !== 'try' && Object.prototype.hasOwnProperty.call(values, f.path)) await this.set(f.path, values[f.path], opts);
  }

  /** The answer Node gives for what this test has typed (defaults filled in by the same parseDraft the page uses). */
  engine(env = FINAL_ENV) { return answerFromDraft(this.typed, env); }

  /** Everything that is checked without being asked, after every step. `answer`: compare the drawn numbers with it. */
  async check({ answer = null, before = null } = {}) {
    const problems = [...(await lookOver(this.page)), ...(await checkScreenOnPage(this.page))];
    if (answer) problems.push(...againstEngine(await drawnValues(this.page), answer, { before }));
    expect(problems.filter(notIgnored), `the ${await this.screen()} screen`).toEqual([]);
  }

  /** One step of a journey: do it, then look the screen over. */
  async step(title, body, { answer = null, before = null } = {}) {
    await base.step(title, async () => {
      await body();
      await this.drawn();
      await this.note();
      await this.check({ answer: typeof answer === 'function' ? await answer() : answer, before });
    });
  }

  /** Reload: the same address, the same figures, the same values in the boxes (test plan 7.3). */
  async reloadKeeps() {
    const before = await this.snapshot();
    await this.page.reload();
    await this.drawn();
    if (before.ready) await this.ready();
    const after = await this.snapshot();
    expect(after.address, 'the address after a reload').toBe(before.address);
    expect(after.boxes, 'the boxes after a reload').toEqual(before.boxes);
    if (before.ready) expect(after.values, 'the figures after a reload').toEqual(before.values);
  }

  async snapshot() {
    return this.page.evaluate(() => ({
      address: window.location.hash,
      ready: document.getElementById('app').getAttribute('data-ready') === '1',
      boxes: [...document.querySelectorAll('#app [data-testid]')].filter((el) => /^(INPUT|SELECT|TEXTAREA)$/.test(el.tagName))
        .map((el) => [el.getAttribute('data-testid'), el.type === 'radio' || el.type === 'checkbox' ? el.checked : el.value]),
      // "Before / Now" is the previous answer of this visit; only the draft survives a reload, so it is not expected to.
      values: [...document.querySelectorAll('#app [data-key][data-value]')].map((el) => [el.getAttribute('data-key'), el.getAttribute('data-value')]).filter(([k]) => !k.startsWith('before.'))
    }));
  }
}

export const v7 = (page, build) => new V7Page(page, build);

/** Write a small record under the run's output folder (test-results/, uploaded with the report), e.g. the counted first answer. */
export function record(testInfo, relPath, data) {
  const file = join(testInfo.project.outputDir, relPath);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
  return file;
}

/** The three worked fixtures as a person would type them (package 2's files win when they exist). */
const FALLBACK = {
  // Single, 58, about £250,000; everything else left alone.
  F1: { 'you.pot': '250000', 'you.age': '58' },
  // A couple, 62 and 60: a final-salary pension of £9,000 from 65; the partner has a pot of £150,000.
  F2: { household: 'couple', 'you.pot': '400000', 'you.age': '62', 'you.finalSalary.has': true, 'you.finalSalary.yearly': '9000', 'you.finalSalary.fromAge': '65', 'partner.age': '60', 'partner.pot': '150000' },
  // Already retired: 68, State Pension and a final-salary pension already being paid, lower risk, spending £2,200 a month.
  F3: { 'you.pot': '180000', 'you.age': '68', 'you.statePension.kind': 'forecast', 'you.statePension.yearly': '11000', 'you.finalSalary.has': true, 'you.finalSalary.yearly': '6000', 'you.finalSalary.fromAge': '60', risk: 'cautious', take: '2200' }
};
const FIXTURE_FILES = { F1: 'F1-forum-guest.json', F2: 'F2-couple.json', F3: 'F3-retired.json' };

function flat(obj, prefix = '', out = {}) {
  for (const [k, v] of Object.entries(obj || {})) {
    const p = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) flat(v, p, out); else out[p] = v;
  }
  return out;
}

/**
 * What to type for a fixture: only the fields a person would have to touch (values that differ from the
 * default are typed; the rest are left alone, which is the point of the journey).
 */
export function fixtureTyping(name) {
  const file = join(REPO, 'tests', 'v7', 'fixtures', 'c', FIXTURE_FILES[name]);
  if (!existsSync(file)) return { ...FALLBACK[name] };
  const inputs = JSON.parse(readFileSync(file, 'utf8')).inputs;
  if (!inputs) return { ...FALLBACK[name] };
  const out = {};
  for (const [path, value] of Object.entries(flat(inputs))) {
    const f = FIELD.get(path);
    if (!f || value === null || value === undefined) continue;
    const isDefault = Object.prototype.hasOwnProperty.call(f, 'default') && typeof f.default !== 'object' && f.default === value;
    if (isDefault || (f.default && typeof f.default === 'object')) continue;      // a default by rule (the start) is left alone
    out[path] = typeof value === 'boolean' ? value : String(value);
  }
  return out;
}

// ---- accessibility (test plan 8.3) -------------------------------------------------------------------------

const AXE_EXCEPTIONS = JSON.parse(readFileSync(join(REPO, 'e2e', 'axe-exceptions.json'), 'utf8')).exceptions;

/**
 * axe-core, WCAG 2.1 A and AA: contrast, labels, names, landmarks. Returns the violations as text.
 * An exception (e2e/axe-exceptions.json) names a rule, optionally one element, and always a reason.
 */
export async function axeProblems(page) {
  const found = await new AxeBuilder({ page }).include('#app').withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  const out = [];
  for (const v of found.violations) {
    for (const node of v.nodes) {
      const target = node.target.join(' ');
      if (AXE_EXCEPTIONS.some((x) => x.rule === v.id && (!x.selector || x.selector === target))) continue;
      out.push(`${v.id} (${v.impact}): ${target} — ${v.help}`);
    }
  }
  return out;
}

// ---- named states (the test build) -------------------------------------------------------------------------

/** The names of the named states package 4 keeps in tests/v7/states/c/. */
export function namedStates() {
  if (!BUILT.states) return [];
  return readdirSync(statesDir).filter((f) => f.endsWith('.json')).map((f) => f.slice(0, -5)).sort();
}

export function readState(name) {
  const data = JSON.parse(readFileSync(join(statesDir, `${name}.json`), 'utf8'));
  return data && data.state && data.state.route ? data.state : data;
}

/**
 * Draw a state through window.__pt (the test build). A state whose answer is final, or that shows no answer,
 * is waited for until the ready mark; a state frozen part-way ("working", "first", "failed") is only drawn.
 */
export async function drawState(page, state) {
  await page.evaluate((s) => window.__pt.setState(s), state);
  await expect(page.locator('#app [data-screen]')).toBeVisible();
  const status = state.answers && state.answers.c ? state.answers.c.status : 'idle';
  if (status === 'final' || status === 'idle') await expect(page.locator('#app')).toHaveAttribute('data-ready', '1', { timeout: 30_000 });
  await page.evaluate(() => document.fonts.ready.then(() => new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(() => done())))));
}
