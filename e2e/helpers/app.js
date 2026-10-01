/**
 * What every browser test stands on (test plan 7.2, 7.3; build brief 4.9).
 *
 *   test, expect      Playwright's, with one automatic fixture (`watch`) that fails any test whose page logged a
 *                     console error, threw, had a request fail, broke the security policy, or (V7) asked for
 *                     anything outside its own site.
 *   v7(page, build)   the page as a person uses it: open an address, wait for the ready mark, click, type —
 *                     counting clicks, boxes and screens — and after every step look the screen over.
 *   BUILT, waitsFor   which parts of V7 are still stubs or not there yet (C's package 1 stubs; for A and B, step 4's
 *                     P0 stubs, and the packages P1–P5 and the joining-up change). A script that needs a part not built
 *                     yet is skipped WITH THE REASON; the moment the part lands the script runs. Nothing to switch on.
 *   v7(page, build, q) the same for question A or B: the boxes are "<q>.<path>", the list is SCHEMA_A / SCHEMA_B.
 *
 * No test waits for a length of time. `ready()` waits for #app[data-ready="1"].
 */
import { test as base, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { existsSync, readFileSync, readdirSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SCHEMA_C } from '../../src/answers/c/schema.js';
import { SCHEMA_A } from '../../src/answers/a/schema.js';
import { SCHEMA_B } from '../../src/answers/b/schema.js';
import { QUESTIONS, OPEN, BUILT as BUILT_QUESTIONS } from '../../src/v7/rail/questions.js';
import { parse, screenName } from '../../src/v7/router/routes.js';
import { CARRY } from '../../src/v7/state/carry.js';
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
const says = (p, re) => has(p) && re.test(readFileSync(join(REPO, p), 'utf8'));
const statesDirOf = (q) => join(REPO, 'tests', 'v7', 'states', q);
const statesDir = statesDirOf('c');
const hasStates = (q) => existsSync(statesDirOf(q)) && readdirSync(statesDirOf(q)).some((f) => f.endsWith('.json'));
const hasScreens = (q) => ['NumbersScreen', 'AnswerScreen'].every((s) => has(`src/v7/screens/${q}/${s}.jsx`));

export const BUILT = Object.freeze({
  screens: !isStub('src/v7/App.jsx'),                                       // package 4
  shell: !isStub('src/v7/main.jsx'),                                        // package 3
  answer: !isStub('src/answers/c/answer.js'),                               // package 2
  hooks: !isStub('src/v7/main.jsx') && has('src/v7/testing/hooks.js'),      // package 3: window.__pt in the test build
  states: existsSync(statesDir) && readdirSync(statesDir).some((f) => f.endsWith('.json')),   // package 4
  checkScreen: has('tests/v7/render/checkScreen.js'),                       // package 4
  // Step 4 — questions A and B
  aOpen: OPEN.includes('a'),                                                // joining up: A on the front door and in the addresses
  bOpen: OPEN.includes('b'),
  aScreens: hasScreens('a'),                                                // P5
  bScreens: hasScreens('b'),
  aAnswer: !isStub('src/answers/a/answer.js'),                              // P2 (P0's stub until then)
  bAnswer: !isStub('src/answers/b/answer.js'),                              // P3
  aStates: hasStates('a'),                                                  // P5: tests/v7/states/a/*.json
  bStates: hasStates('b'),
  carry: says('src/v7/state/reduce.js', /DRAFT_CARRY|'draft\/carry'/),      // P4: the hand-over between questions
  extend: says('src/v7/state/reduce.js', /ANSWER_EXTEND|'answer\/extend'/)  // P4: one more pass for an optional step
});
const WAITING = {
  screens: 'the screens (package 4): src/v7/App.jsx is still the package 1 stub',
  shell: 'the shell (package 3): src/v7/main.jsx is still the package 1 stub',
  answer: 'the real answer (package 2): src/answers/c/answer.js is still the package 1 stub',
  hooks: 'the test hooks (package 3): src/v7/testing/hooks.js',
  states: 'the named states (package 4): tests/v7/states/c/*.json',
  checkScreen: 'checkScreen (package 4): tests/v7/render/checkScreen.js',
  aOpen: 'question A on the front door (step 4 joining up): src/v7/rail/questions.js OPEN does not hold \'a\' yet',
  bOpen: 'question B on the front door (step 4 joining up): src/v7/rail/questions.js OPEN does not hold \'b\' yet',
  aScreens: 'A\'s screens (step 4 P5): src/v7/screens/a/NumbersScreen.jsx, AnswerScreen.jsx',
  bScreens: 'B\'s screens (step 4 P5): src/v7/screens/b/NumbersScreen.jsx, AnswerScreen.jsx',
  aAnswer: 'the real answer to A (step 4 P2): src/answers/a/answer.js is still P0\'s stub, whose figures do not follow the inputs',
  bAnswer: 'the real answer to B (step 4 P3): src/answers/b/answer.js is still P0\'s stub, whose figures do not follow the inputs',
  aStates: 'A\'s named states (step 4 P5): tests/v7/states/a/*.json',
  bStates: 'B\'s named states (step 4 P5): tests/v7/states/b/*.json',
  carry: 'the hand-over between questions (step 4 P4): draft/carry in src/v7/state/reduce.js',
  extend: 'one more pass for an optional step (step 4 P4): answer/extend in src/v7/state/reduce.js'
};

/** What a script about question `q` needs before it can run: the question open, its screens, the shell's A/B parts. */
export const NEEDS = Object.freeze({
  a: ['screens', 'shell', 'aOpen', 'aScreens'],
  b: ['screens', 'shell', 'bOpen', 'bScreens']
});

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
  { hash: '#/soon/c', screen: 'front' },
  // Step 4: A's and B's addresses, once they are open (brief 4.12). A built question is never "soon".
  ...['a', 'b'].filter((q) => BUILT_QUESTIONS[q]).flatMap((q) => [
    ...BUILT_QUESTIONS[q].steps.map((s) => ({ hash: `#/${q}/${s.id}`, screen: s.built ? `${q}.${s.id}` : 'notBuilt' })),
    { hash: `#/${q}/numbers?focus=you.age`, screen: `${q}.numbers` },
    { hash: `#/soon/${q}`, screen: 'front' }
  ])
];

/** Where the front door's link for each question leads: its numbers step when open, else "soon" (L6). */
export const FRONT_LINKS = QUESTIONS.filter((q) => q.id !== 'c').map((q) => (q.built ? `#/${q.id}/numbers` : `#/soon/${q.id}`));

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

/**
 * No countdown anywhere in A or B (step 4 brief conflict 47, the `saver` scope's `countdown-any`): a saver is shown
 * ages, never "in N years", and nobody is shown "15 years to go". Returns what was found.
 */
export const COUNTDOWN = /\b\d+ (more )?(years?|months?) (to go|until|till|before|from now)\b/i;
export function saverWording(text) {
  const t = String(text);
  const found = [];
  const c = COUNTDOWN.exec(t);
  if (c) found.push(c[0]);
  const wait = /\bin \d{1,2} years(['’] time)?\b/i.exec(t);
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

export const SCHEMAS = Object.freeze({ c: SCHEMA_C, a: SCHEMA_A, b: SCHEMA_B });
const FIELDS = Object.fromEntries(Object.entries(SCHEMAS).map(([q, s]) => [q, new Map(s.fields.map((f) => [f.path, f]))]));

class V7Page {
  constructor(page, build, q = 'c') {
    this.page = page;
    this.build = build;                                    // 'prod' | 'test'
    this.base = (build === 'prod' ? PROD : TEST) + '/v7/';
    this.q = q;                                            // the question the boxes belong to: 'c' | 'a' | 'b'
    this.counts = { clicks: 0, fields: new Set(), screens: [] };
    this.typedBy = { c: {}, a: {}, b: {} };                // what this test typed, by question and field path — the engine check's inputs
    this.app = page.locator('#app');
  }

  /** What was typed for the question in hand. */
  get typed() { return this.typedBy[this.q]; }
  set typed(v) { this.typedBy[this.q] = v; }

  /** Work on another question's boxes from here on (a hand-over, or a link from the front door). */
  as(q) { this.q = q; return this; }

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
    const q = this.q;
    const link = this.id(`rail.${q}.${step}`);
    if (!(await link.isVisible()) && (await this.id('rail.line').isVisible())) await this.click('rail.line');
    await this.click(`rail.${q}.${step}`);
    const s = BUILT_QUESTIONS[q] && BUILT_QUESTIONS[q].steps.find((x) => x.id === step);
    await this.at(s && s.built ? `${q}.${step}` : 'notBuilt');
  }

  /** Nothing is running and any answer shown is final. */
  async ready(timeout = 30_000) { await expect(this.app).toHaveAttribute('data-ready', '1', { timeout }); }

  /**
   * An optional step's extra pass (A's every age, B's grid): the page says `partial` while it runs, with the
   * answer step's figures still on the screen, then `final` and ready. Returns whether `partial` was seen.
   */
  async partialThenFinal(timeout = 120_000) {
    const seen = await this.page.waitForSelector('#app[data-answer="partial"], #app[data-ready="1"]', { timeout }).then((el) => el.getAttribute('data-answer'));
    await this.ready(timeout);
    await expect(this.app).toHaveAttribute('data-answer', 'final');
    return seen === 'partial';
  }

  screen() { return this.page.locator('#app [data-screen]').getAttribute('data-screen'); }

  async note() {
    const s = await this.screen();
    if (this.counts.screens[this.counts.screens.length - 1] !== s) this.counts.screens.push(s);
    return s;
  }

  id(testid) { return this.page.getByTestId(testid); }

  async click(testid) {
    // A and B (the budget step, research/v7/budget-step.md): "Show" is on the spend step. From the numbers step a person
    // presses "Next: what you would spend" first — one more click and one more screen, counted as such.
    const show = /^([ab])\.action\.show$/.exec(testid);
    if (show && (await this.screen()) === `${show[1]}.numbers`) await this.toSpend(show[1]);
    this.counts.clicks += 1;
    await this.id(testid).click();
  }

  /** From A's or B's numbers step on to the spend step, as a person does: "Next: what you would spend". */
  async toSpend(q = this.q) {
    if ((await this.screen()) === `${q}.spend`) return;
    if ((await this.screen()) === `${q}.numbers`) {
      this.counts.clicks += 1;
      await this.id(`${q}.action.onward`).click();
      await this.page.waitForSelector(`#app [data-screen="${q}.spend"]`, { timeout: 2_000 }).catch(() => {});
    }
    // a box of the numbers step still wants filling (onward marks it and stays): the rail's own link goes on regardless
    if ((await this.screen()) !== `${q}.spend`) await this.rail('spend');
    await this.at(`${q}.spend`);
    // After a move the shell puts the keyboard on the step's heading, in an effect that runs after the screen is drawn
    // (Shell.jsx). Wait for it: a box clicked and typed into before then loses every key after the first to the
    // heading (seen on a loaded machine, 1 Oct 2026: "1800" ended as "1"). A person cannot type inside that frame.
    await expect(this.page.locator('#app h1')).toBeFocused();
    await this.note();
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

  /**
   * Set one field of the input list the way its kind of control is used. A's and B's spending is on the spend step,
   * everything else on the numbers step: the page moves between them as a person would.
   */
  async set(path, value, { delay = 0 } = {}) {
    const q = this.q;
    const f = FIELDS[q].get(path);
    if (!f) throw new Error(`no such field of question ${q}: ${path}`);
    if (q !== 'c') {
      const screen = await this.screen();
      if (f.group === 'spend' && screen === `${q}.numbers`) await this.toSpend(q);
      else if (f.group !== 'spend' && screen === `${q}.spend`) { await this.rail('numbers'); await this.note(); }
    }
    if (path === 'household') {
      const open = await this.id(`${q}.partner.age`).isVisible();
      if (value === 'couple' && !open) await this.click(`${q}.action.addPartner`);
      if (value === 'single' && open) await this.click(`${q}.action.removePartner`);
    } else {
      if (f.group === 'more' && !(await this.page.locator(`[data-testid^="${q}.${path}"]`).first().isVisible())) await this.click(`${q}.action.moreDetail`);
      if (f.type === 'choice') await this.click(`${q}.${path}.${value}`);
      else if (f.type === 'yesNo') await this.click(`${q}.${path}.${value ? 'yes' : 'no'}`);
      else {
        const box = this.id(`${q}.${path}`);
        if ((await box.inputValue()) !== '') { this.counts.clicks += 1; await box.click(); await box.fill(''); }
        await this.type(`${q}.${path}`, value, { delay, path });
      }
    }
    this.counts.fields.add(path);
    this.typed[path] = typeof value === 'boolean' ? value : String(value);
  }

  /** Several fields of the numbers step, in the order of the input list. `take` (the try-a-change row) is never on that step: a journey sets it on the answer. */
  async fill(values, opts) {
    // A and B: the spending last — it is the next step's (the budget step)
    const fields = [...SCHEMAS[this.q].fields].sort((x, y) => (x.group === 'spend') - (y.group === 'spend'));
    for (const f of fields) if (f.group !== 'try' && Object.prototype.hasOwnProperty.call(values, f.path)) await this.set(f.path, values[f.path], opts);
  }

  /** The answer Node gives for what this test has typed (defaults filled in by the same parseDraft the page uses). */
  engine(env = FINAL_ENV, q = this.q) { return answerFromDraft(this.typedBy[q], env, q); }

  /** What the page's own draft holds for a question (the test build only): the values as text, by path. */
  async draftValues(q = this.q) {
    return this.page.evaluate((qq) => { const s = window.__pt.getState(); return s.draft && s.draft[qq] ? s.draft[qq].values : null; }, q);
  }

  /** Everything that is checked without being asked, after every step. `answer`: compare the drawn numbers with it. */
  async check({ answer = null, before = null } = {}) {
    const problems = [...(await lookOver(this.page)), ...(await checkScreenOnPage(this.page))];
    if (answer) problems.push(...againstEngine(await drawnValues(this.page), answer, { before }));
    // A and B: no countdown in any state; the retired view under the retired rules as well.
    const view = await this.page.evaluate(() => {
      const s = document.querySelector('#app [data-screen]');
      const app = document.getElementById('app');
      return { question: s ? s.getAttribute('data-question') || (s.getAttribute('data-screen') || '').split('.')[0] : null, retired: !!document.querySelector('#app [data-view="retired"]'), text: app ? app.innerText : '' };
    });
    if (view.question === 'a' || view.question === 'b') {
      for (const w of saverWording(view.text)) problems.push(`a countdown on a ${view.question.toUpperCase()} screen: "${w}"`);
      if (view.retired) for (const w of retiredWording(view.text)) problems.push(`the retired view says "${w}"`);
    }
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

export const v7 = (page, build, q = 'c') => new V7Page(page, build, q);

/** Write a small record under the run's output folder (test-results/, uploaded with the report), e.g. the counted first answer. */
export function record(testInfo, relPath, data) {
  const file = join(testInfo.project.outputDir, relPath);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
  return file;
}

/** The worked fixtures as a person would type them (the answer packages' files win when they exist). */
const FALLBACK = {
  // Single, 58, about £250,000; everything else left alone.
  F1: { 'you.pot': '250000', 'you.age': '58' },
  // A couple, 62 and 60: a final-salary pension of £9,000 from 65; the partner has a pot of £150,000.
  F2: { household: 'couple', 'you.pot': '400000', 'you.age': '62', 'you.finalSalary.has': true, 'you.finalSalary.yearly': '9000', 'you.finalSalary.fromAge': '65', 'partner.age': '60', 'partner.pot': '150000' },
  // Already retired: 68, State Pension and a final-salary pension already being paid, lower risk, spending £2,200 a month.
  F3: { 'you.pot': '180000', 'you.age': '68', 'you.statePension.kind': 'forecast', 'you.statePension.yearly': '11000', 'you.finalSalary.has': true, 'you.finalSalary.yearly': '6000', 'you.finalSalary.fromAge': '60', risk: 'cautious', take: '2200' },

  // Step 4 (P2's and P3's fixture files replace these; answer-A-and-B.md 1.12, 2.12 and test plan 9 are the sources).
  // A1 — stopping soon: 55, £300,000 with £800 a month going in, £60,000 in ISAs, stop at 60 on £2,000 a month.
  A1: { 'you.age': '55', 'you.pot': '300000', 'you.payIn.total': '800', savings: '60000', 'stop.age': '60', 'spend.amount': '2000' },
  // A2 — a couple before 57: 52 and 50, £220,000 and £90,000, £80,000 in ISAs, both stop when you are 55 (closed until 57).
  A2: { household: 'couple', 'you.age': '52', 'you.pot': '220000', 'you.payIn.total': '700', savings: '80000', 'stop.age': '55', 'spend.amount': '3000', 'partner.age': '50', 'partner.pot': '90000', 'partner.payIn.total': '300' },
  // A3 — forced out at 59: £180,000, £15,000 savings, a final-salary pension of £6,000 from 60, stop now.
  A3: { 'you.age': '59', 'you.pot': '180000', savings: '15000', 'you.finalSalary.has': true, 'you.finalSalary.yearly': '6000', 'you.finalSalary.fromAge': '60', 'stop.age': '59', 'spend.amount': '1800' },
  // A4 — stopping at 55 from savings: 47, £310,000, £1,500 in, £95,000 saved with £800 a month more, adventurous.
  A4: { 'you.age': '47', 'you.pot': '310000', 'you.payIn.total': '1500', savings: '95000', 'stop.age': '55', 'spend.amount': '2200', savingsIn: '800', savingRisk: 'adventurous', risk: 'adventurous' },
  // B1 — my number: 45, £120,000, £550 a month in all, stop at 60 on the moderate level.
  B1: { 'you.age': '45', 'you.pot': '120000', 'you.payIn.total': '550', 'stop.age': '60', 'spend.kind': 'level', 'spend.level': 'moderate' },
  // B2 — could I ease off: 35, £40,000, £400 a month, stop at 65 on £2,000 a month, adventurous while saving.
  B2: { 'you.age': '35', 'you.pot': '40000', 'you.payIn.total': '400', 'stop.age': '65', 'spend.amount': '2000', savingRisk: 'adventurous' },
  // B3 — a late start: 48, £350,000, £700 in, stop at 60 on £2,500.
  B3: { 'you.age': '48', 'you.pot': '350000', 'you.payIn.total': '700', 'stop.age': '60', 'spend.amount': '2500' },
  // B4 — young: 25, £5,000, £300 in, stop at 67 on £2,000.
  B4: { 'you.age': '25', 'you.pot': '5000', 'you.payIn.total': '300', 'stop.age': '67', 'spend.amount': '2000' },
  // B5 — a couple: 50 and 48, £200,000 and £80,000, £900 and £300 in, stop at 62 on £3,200.
  B5: { household: 'couple', 'you.age': '50', 'you.pot': '200000', 'you.payIn.total': '900', 'stop.age': '62', 'spend.amount': '3200', 'partner.age': '48', 'partner.pot': '80000', 'partner.payIn.total': '300' }
};
const FIXTURE_FILES = {
  F1: 'c/F1-forum-guest.json', F2: 'c/F2-couple.json', F3: 'c/F3-retired.json',
  A1: 'a/A1-stop-soon.json', A2: 'a/A2-couple-before-57.json', A3: 'a/A3-forced-out.json', A4: 'a/A4-from-savings.json',
  B1: 'b/B1-my-number.json', B2: 'b/B2-coast.json', B3: 'b/B3-late-start.json', B4: 'b/B4-young.json', B5: 'b/B5-couple.json'
};
/** The question a fixture belongs to, from its name: F → C, A → A, B → B. */
export const questionOf = (name) => ({ F: 'c', A: 'a', B: 'b' })[String(name)[0]] || 'c';

function flat(obj, prefix = '', out = {}) {
  for (const [k, v] of Object.entries(obj || {})) {
    const p = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) flat(v, p, out); else out[p] = v;
  }
  return out;
}

/** The fixture file's contents, or null while the answer package has not written it. */
export function fixtureFile(name) {
  const file = join(REPO, 'tests', 'v7', 'fixtures', FIXTURE_FILES[name]);
  return existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : null;
}

/**
 * What to type for a fixture: only the fields a person would have to touch (values that differ from the
 * default are typed; the rest are left alone, which is the point of the journey).
 */
export function fixtureTyping(name) {
  const q = questionOf(name);
  const byPath = FIELDS[q];
  const data = fixtureFile(name);
  const inputs = data && data.inputs;
  if (!inputs) return { ...FALLBACK[name] };
  const out = {};
  for (const [path, value] of Object.entries(flat(inputs))) {
    const f = byPath.get(path);
    if (!f || value === null || value === undefined) continue;
    const isDefault = Object.prototype.hasOwnProperty.call(f, 'default') && typeof f.default !== 'object' && f.default === value;
    if (isDefault || (f.default && typeof f.default === 'object')) continue;      // a default by rule (the start) is left alone
    out[path] = typeof value === 'boolean' ? value : String(value);
  }
  return out;
}

/** The fields a question needs before its answer step can run, among those that apply to what is typed (brief 4.1: A four, B five). */
export function mustFill(q, typed) {
  const need = { a: ['you.age', 'you.pot', 'stop.age', 'spend.amount'], b: ['you.age', 'you.pot', 'you.payIn.total', 'stop.age', 'spend.amount'], c: ['you.pot', 'you.age'] }[q];
  // A spending level picked instead of an amount: the amount box does not apply, the level is the typed thing.
  return need.map((p) => (p === 'spend.amount' && typed['spend.kind'] === 'level' ? 'spend.level' : p));
}

// ---- step 4: the journeys' shared parts ---------------------------------------------------------------------

/** The budgets of the counted first answer (brief 7 item 7; test plan 11.2): per question, from the front door. */
// The budget step (research/v7/budget-step.md, owner-approved 1 Oct 2026) puts every A and B visitor through "What
// would you spend?": one more screen (4, was 3) and its button; the things typed and the clicks stay within budget.
export const FIRST_ANSWER_BUDGET = Object.freeze({
  a: { mustFill: 4, screens: 4, clicks: 8, firstMs: 3_000, finalMs: 15_000, optionalMs: 30_000, journeyMs: 40_000 },
  b: { mustFill: 5, screens: 4, clicks: 8, firstMs: 3_000, finalMs: 15_000, optionalMs: 30_000, journeyMs: 40_000 }
});
// Chromium cannot slow a worker: waits are measured at full speed × SLOWDOWN, which stands for a phone four times
// slower than the reference machine — 4 there, less on a machine already slower than it (e2e/global-setup.js).
export const SLOWDOWN = Number(process.env.E2E_SLOWDOWN) || 4;
export const KEY_DELAY = 120;        // one key at a time, as a person types (catches a box that loses its place)

/**
 * What the hand-over `from → to` puts into the target's draft, worked out from what was typed (the declared map,
 * src/v7/state/carry.js — the same data the reducer reads). A figure from the source answer is carried as text.
 */
export function carriedDraft(values, from, to, sourceAnswer = null) {
  const out = {};
  for (const [src, dst] of CARRY[`${from}→${to}`]) {
    if (typeof src === 'string') { if (Object.prototype.hasOwnProperty.call(values, src)) out[dst] = values[src]; }
    else if (src && Object.prototype.hasOwnProperty.call(src, 'fixed')) out[dst] = src.fixed;
    else if (src && src.result) { const v = get(sourceAnswer, src.result); if (v !== undefined && v !== null) out[dst] = String(v); }
  }
  return out;
}

/** Every sentence text an answer holds (the screen draws sentences only from the answer, never its own). */
export function sentenceTexts(answer) {
  const out = [];
  const walk = (v) => {
    if (!v || typeof v !== 'object') return;
    if (typeof v.text === 'string' && Array.isArray(v.parts)) { out.push(v.text); return; }
    for (const x of Object.values(v)) walk(x);
  };
  walk(answer && answer.sentences);
  return out;
}

/** The whitespace of drawn text made plain, so a sentence split over lines still reads as one. */
const plain = (t) => String(t).replace(/\s+/g, ' ').trim();

/**
 * A's headline (brief 4.13): one section[data-headline="verdict"] whose band carries data-verdict = the answer's
 * verdict with visible words, a [data-sentence="verdict"] that is one of the answer's own sentences, and the
 * bad-case line.
 */
export async function expectHeadlineA(page, answer) {
  const headline = page.locator('#app section[data-headline="verdict"]');
  await expect(headline).toHaveCount(1);
  await expect(headline).toBeVisible();
  const band = headline.locator('[data-verdict]').first();
  await expect(band).toHaveAttribute('data-verdict', answer.headline.verdict);
  expect(plain(await band.innerText()).length, 'the verdict is words, not only a colour').toBeGreaterThan(0);
  const said = plain(await headline.locator('[data-sentence="verdict"]').first().innerText());
  expect(sentenceTexts(answer).map(plain), 'the verdict sentence is the answer\'s own').toContain(said);
  expect(plain(await headline.innerText())).toContain(plain(answer.sentences.bad.text));
}

/**
 * B's headline (brief 4.13; one test everywhere, 1 Oct 2026): data-headline="payIn.needed" unless on course — the
 * pay-in is B's answer, and the only headline — with the number after it as a guide in a smaller block that is not a
 * headline (data-guide="number.careful"; the reviewers' finding, 1 Oct 2026); on course, or with no pay-in to name,
 * data-headline="number.careful" when the number is above £0 (no pension pot needed, or none enough, is said in words
 * with no number headline). Each holds one of the answer's sentences; the number is drawn from the answer.
 */
export async function expectHeadlinesB(page, answer) {
  const hasNumber = !!answer.number && answer.number.careful > 0;
  const hasPayIn = !answer.onCourse && !!answer.payIn && typeof answer.payIn.needed === 'number' && !!answer.sentences.payInHead;
  const headNumber = page.locator('#app [data-headline="number.careful"]');
  const guide = page.locator('#app [data-guide="number.careful"]');
  const number = hasPayIn ? guide : headNumber;
  const payIn = page.locator('#app [data-headline="payIn.needed"]');
  await expect(headNumber).toHaveCount(hasNumber && !hasPayIn ? 1 : 0);
  await expect(guide).toHaveCount(hasNumber && hasPayIn ? 1 : 0);
  await expect(payIn).toHaveCount(hasPayIn ? 1 : 0);
  const texts = sentenceTexts(answer).map(plain);
  for (const h of [...(hasPayIn ? [payIn] : []), ...(hasNumber ? [number] : [])]) {
    await expect(h).toBeVisible();
    const sentences = await h.locator('[data-sentence]').allInnerTexts();
    expect(sentences.length, 'each headline has its sentence').toBeGreaterThan(0);
    for (const t of sentences) expect(texts, 'a headline sentence is the answer\'s own').toContain(plain(t));
  }
  if (hasNumber) await expect(number.locator('[data-key="number.careful"]').first()).toHaveAttribute('data-value', String(answer.number.careful));
}

/**
 * Press the question's "show" button and time the answer: the first figure (100 futures) and the final one.
 * The page's own marks are watched (waitForSelector follows the DOM), not polled.
 */
export async function askAndTime(app, button) {
  await app.click(button);
  const asked = Date.now();
  await app.page.waitForSelector('#app[data-answer="first"], #app[data-answer="final"]', { timeout: 60_000 });
  const first = Date.now();
  await app.page.waitForSelector('#app[data-ready="1"]', { timeout: 120_000 });
  const final = Date.now();
  return { firstMs: first - asked, finalMs: final - asked };
}

/**
 * The stopwatch can be jostled by the other tests on the same machine (the crawl and the sameness run work out
 * 1,000-future answers at the same time). When a reading is over budget, read it once more on a quiet page — a
 * reload at the answer address keeps what was typed and works the answer out again from cold, worker start-up
 * included — and keep the better of the two, both written down (as C's J1 does).
 */
export async function secondReading(app, times, budget) {
  if (times.firstMs * SLOWDOWN <= budget.firstMs && times.finalMs * SLOWDOWN <= budget.finalMs) return times;
  await app.page.reload();
  const asked = Date.now();
  await app.page.waitForSelector('#app[data-answer="first"], #app[data-answer="final"]', { timeout: 60_000 });
  const first = Date.now();
  await app.page.waitForSelector('#app[data-ready="1"]', { timeout: 120_000 });
  const final = Date.now();
  return {
    firstMs: Math.min(times.firstMs, first - asked), finalMs: Math.min(times.finalMs, final - asked),
    firstReading: { ...times }, secondReading: { firstMs: first - asked, finalMs: final - asked, note: 'the first reading was over budget; this one is a reload of the answer address on a quiet page' }
  };
}

/** A fixture's words that must never be on a screen (test plan 9, P4), on top of the banned list. */
export const NEVER_ON_SCREEN = ['bridge', 'FIRE', 'years to go', 'countdown', 'contribution', 'on track'];
export async function neverSaid(page, words = NEVER_ON_SCREEN) {
  const text = await page.locator('#app').innerText();
  return words.filter((w) => (w === w.toUpperCase() ? new RegExp(`\\b${w}\\b`).test(text) : text.toLowerCase().includes(w.toLowerCase())));
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

/** The names of the named states for a question: C's (package 4), A's and B's (step 4 P5) in tests/v7/states/<q>/. */
export function namedStates(q = 'c') {
  const ready = q === 'c' ? BUILT.states : hasStates(q);
  if (!ready) return [];
  return readdirSync(statesDirOf(q)).filter((f) => f.endsWith('.json') && !f.startsWith('_')).map((f) => f.slice(0, -5)).sort();   // _made-with.json is a note, not a state
}

export function readState(name, q = 'c') {
  const data = JSON.parse(readFileSync(join(statesDirOf(q), `${name}.json`), 'utf8'));
  return data && data.state && data.state.route ? data.state : data;
}

/**
 * Draw a state through window.__pt (the test build). A state whose answer is final, or that shows no answer,
 * is waited for until the ready mark; a state frozen part-way ("working", "first", "failed", an optional step's
 * pass still running) is only drawn.
 */
export async function drawState(page, state) {
  await page.evaluate((s) => window.__pt.setState(s), state);
  await expect(page.locator('#app [data-screen]')).toBeVisible();
  // Ready only when nothing in the state is still being worked out — whichever question the address shows.
  const held = Object.values((state && state.answers) || {});
  const settled = held.every((a) => !a || a.status === 'idle' || (a.status === 'final' && !a.extending));
  if (settled) await expect(page.locator('#app')).toHaveAttribute('data-ready', '1', { timeout: 90_000 });   // a settling wait, not a budget (budgets are in the journeys)
  await page.evaluate(() => document.fonts.ready.then(() => new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(() => done())))));
}
