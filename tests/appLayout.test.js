/**
 * Where each app lives (src/appLayout.js; research/v7/switch-readiness.md §2 steps 1, 2 and 4): one module holds every
 * address the two apps hand each other, for today's layout and 7.0's, chosen by one build flag.
 *
 *   - the switch layout's (7.0, and the default): V7 at /, the classic page at /classic/, one data folder at the root;
 *   - the preview layout's addresses are exactly the strings before 7.0 (the rollback);
 *   - in both, every address resolves from the page that uses it to the other app's page, the privacy policy and the data;
 *   - every cross-app link in both apps reads the module (no copy of a path is left);
 *   - the build flag: a misspelt flag is refused (both Vite configurations hand the name to `define`: tests/v7/liveBundle.test.js);
 *   - the browser tests' two addresses are the layout's.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { LAYOUTS, LAYOUT, layoutNamed } from '../src/appLayout.js';
import { PLANNER, SIGN_IN_DOOR } from '../src/v7/effects/openPlace.js';
import { COMMON } from '../src/v7/copy/common.js';
import { PREVIEW_PATH } from '../src/ui/components/OpenPlace.js';
import { questionHref } from '../src/services/PlanSeed.js';
import { loadMarket, forgetMarket, marketFolderOf } from '../src/reading/market.js';
import { V7_PATH, CLASSIC_PATH, atClassic, LAYOUT_UNDER_TEST } from '../e2e/helpers/paths.js';

const ROOT = process.cwd();
const read = (p) => readFileSync(join(ROOT, p), 'utf8');
const SITE = 'https://example.test';
/** An address as the browser resolves it from a page: its path from the site's root. */
const from = (page, rel) => { const u = new URL(rel, SITE + page); return u.pathname + u.search; };

describe('the two layouts', () => {
  it('preview is the layout before 7.0, exactly (the rollback): the classic page at /, V7 at /v7/', () => {
    expect(LAYOUTS.preview).toEqual({
      name: 'preview',
      v7: { at: '/v7/', classic: '../', privacy: '../privacy.html', data: '../data/' },
      classic: { at: '/', v7: 'v7/', privacy: 'privacy.html', data: './data/' }
    });
  });
  it('switch is 7.0: V7 at /, the classic page at /classic/, one data folder at the root', () => {
    expect(LAYOUTS.switch).toEqual({
      name: 'switch',
      v7: { at: '/', classic: './classic/', privacy: './privacy.html', data: './data/' },
      classic: { at: '/classic/', v7: '../', privacy: '../privacy.html', data: '../data/' }
    });
  });
  it.each(['preview', 'switch'])('%s: every address reaches its place from the page that uses it, at its folder and at its index.html', (name) => {
    const L = LAYOUTS[name];
    for (const v7Page of [L.v7.at, L.v7.at + 'index.html']) {
      expect(from(v7Page, L.v7.classic), v7Page).toBe(L.classic.at);
      expect(from(v7Page, L.v7.classic + '?signin=1')).toBe(L.classic.at + '?signin=1');
      expect(from(v7Page, L.v7.privacy)).toBe('/privacy.html');
      expect(from(v7Page, L.v7.data)).toBe('/data/');
    }
    for (const classicPage of [L.classic.at, L.classic.at + 'index.html']) {
      expect(from(classicPage, L.classic.v7), classicPage).toBe(L.v7.at);
      expect(from(classicPage, L.classic.v7 + '#/plans')).toBe(L.v7.at);
      // the policy has one published address (compliance/GDPR_TODO.md P5), whichever page links it
      expect(from(classicPage, L.classic.privacy)).toBe('/privacy.html');
      expect(from(classicPage, L.classic.data + 'gilts.json')).toBe('/data/gilts.json');
      expect(from(classicPage, L.classic.data + 'equity.json')).toBe('/data/equity.json');
    }
    // the two apps never share a page
    expect(L.v7.at).not.toBe(L.classic.at);
  });
  it('the module is frozen, so no caller can move an address under another', () => {
    for (const L of [LAYOUTS, LAYOUTS.preview, LAYOUTS.preview.v7, LAYOUTS.preview.classic, LAYOUTS.switch, LAYOUTS.switch.v7, LAYOUTS.switch.classic]) expect(Object.isFrozen(L)).toBe(true);
  });
});

describe('the build flag', () => {
  it('no flag is the switch (7.0); a flag that names neither layout is refused', () => {
    expect(layoutNamed(undefined)).toBe('switch');
    expect(layoutNamed('')).toBe('switch');
    expect(layoutNamed(null)).toBe('switch');
    expect(layoutNamed('preview')).toBe('preview');
    expect(layoutNamed('switch')).toBe('switch');
    expect(() => layoutNamed('swtich')).toThrow(/LAYOUT must be "preview" or "switch"/);
    expect(() => layoutNamed('Switch')).toThrow();
  });
  it('without Vite\'s define (these tests, Node scripts) the page reads the switch, the published layout', () => {
    expect(LAYOUT).toBe(LAYOUTS.switch);
  });
  it('the module reads the name the define writes, and only that name (the two configurations: tests/v7/liveBundle.test.js)', () => {
    const src = read('src/appLayout.js');
    expect(src).toMatch(/const BUILT = typeof __PT_LAYOUT__ === 'string' \? __PT_LAYOUT__ : 'switch';/);
    expect(src).toMatch(/export const LAYOUT = BUILT === 'preview' \? PREVIEW : SWITCH;/);
  });
});

describe('every cross-app link reads the module', () => {
  it('V7: the hand-over to the classic planner, its sign-in door, the line to the previous version, the privacy link', () => {
    expect(PLANNER).toBe(LAYOUT.v7.classic);
    expect(SIGN_IN_DOOR).toBe(LAYOUT.v7.classic + '?signin=1');
    expect(COMMON.links).toEqual({ classic: LAYOUT.v7.classic, privacy: LAYOUT.v7.privacy });
  });
  it('the classic page: the way back to V7, the landing page\'s line, the way back to a question, the privacy links, the market data', () => {
    expect(PREVIEW_PATH).toBe(LAYOUT.classic.v7);
    expect(questionHref('a')).toBe(LAYOUT.classic.v7 + '#/a/answer');
    expect(read('src/ui/components/LandingPage.js')).toContain('<a href="${LAYOUT.classic.v7}#/" id="landingPreviewLink">');
    // the two footers' policy links: the landing page's and the sign-in screen's
    for (const f of ['src/ui/components/LandingPage.js', 'src/ui/components/AuthScreen.js']) expect(read(f), f).toContain('<a href="${LAYOUT.classic.privacy}" target="_blank" rel="noopener">Privacy Policy</a>');
    // the market data: the page asks the one loader (src/reading/market.js) for its layout's data folder
    const html = read('index.html');
    expect(html).toContain('loadMarket({ folder: marketFolderOf(document.baseURI, LAYOUT.classic.data) })');
  });
  it('both views\' market data: the one data folder, from either page, in either layout', async () => {
    for (const L of Object.values(LAYOUTS)) {
      const site = 'https://example.test';
      expect(marketFolderOf(site + L.v7.at, L.v7.data)).toBe(site + '/data/');
      expect(marketFolderOf(site + L.classic.at, L.classic.data)).toBe(site + '/data/');
    }
    const asked = [];
    const fetchStub = async (url) => { asked.push(url); return { ok: false }; };
    forgetMarket();
    await loadMarket({ folder: 'https://example.test/data/', fetchImpl: fetchStub });
    expect(asked.sort()).toEqual(['https://example.test/data/equity.json', 'https://example.test/data/gilts.json']);
    forgetMarket();
  });
  it('no copy of a path is left in the files that link the two apps', () => {
    const files = ['src/v7/effects/openPlace.js', 'src/v7/effects/move.js', 'src/v7/copy/common.js', 'src/ui/components/OpenPlace.js', 'src/ui/components/LandingPage.js', 'src/ui/components/AuthScreen.js', 'src/services/PlanSeed.js', 'src/services/LinkerUniverse.js', 'src/services/EquityIndex.js'];
    // the code without comments and imports (one line or several): a string that is one of the layouts' addresses, written out again, would be a copy
    const code = (src) => src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"`])\/\/[^\n]*/g, '$1').replace(/^[ \t]*import\b[^;]*?\sfrom\s*['"][^'"\n]+['"];?|^[ \t]*import\s*['"][^'"\n]+['"];?/gm, '');
    const addresses = [...new Set(Object.values(LAYOUTS).flatMap((L) => [...Object.values(L.v7), ...Object.values(L.classic)]))].filter((a) => a.length > 1);
    for (const f of files) for (const a of addresses) expect(code(read(f)), `${f} writes ${a}`).not.toMatch(new RegExp(`['"\`]${a.replace(/[.?*+^$()[\]{}|\\/]/g, '\\$&')}`));
  });
});

describe('the browser tests\' two addresses', () => {
  it('are the layout\'s, named by the same flag: / and /classic/ at 7.0 (/v7/ and / for the rollback)', () => {
    expect(V7_PATH).toBe(LAYOUT_UNDER_TEST.v7.at);
    expect(CLASSIC_PATH).toBe(LAYOUT_UNDER_TEST.classic.at);
    if (!process.env.LAYOUT) { expect(V7_PATH).toBe('/'); expect(CLASSIC_PATH).toBe('/classic/'); }
    if (process.env.LAYOUT === 'preview') { expect(V7_PATH).toBe('/v7/'); expect(CLASSIC_PATH).toBe('/'); }
    expect(atClassic('http://127.0.0.1:4173' + CLASSIC_PATH)).toBe(true);
    expect(atClassic('http://127.0.0.1:4173' + CLASSIC_PATH + 'index.html')).toBe(true);
    expect(atClassic('http://127.0.0.1:4173' + V7_PATH + '#/plans')).toBe(false);
  });
  it('both workers read the folder their page hands them (src/reading/market.js), never one resolved from their own script', () => {
    expect(read('src/workers/engineClient.js')).toContain('marketFolderOf(document.baseURI, LAYOUT.classic.data)');
    // the simple view's page folder is pageMarket.js's, the one its worker is told and its own pages load (move, Assumptions)
    expect(read('src/v7/effects/pageMarket.js')).toContain('marketFolderOf(document.baseURI, LAYOUT.v7.data)');
    expect(read('src/v7/effects/workerClient.js')).toContain("import { pageMarketFolder } from './pageMarket.js'");
    expect(read('src/workers/engineWorker.js')).toContain('loadMarket({ folder: payload && payload.market })');
    expect(read('src/v7/effects/answerWorker.js')).toContain("loadMarket({ folder })");
  });
  it('no build copies the market files beside the classic page: the one data folder is the site\'s /data/ (vite.layout.js)', () => {
    expect(read('vite.layout.js')).not.toMatch(/classicDataCopy|pt:classic-data/);
    expect(read('vite.config.js')).not.toMatch(/classicDataCopy/);
    expect(new URL(LAYOUTS.switch.classic.data, 'http://site.test' + LAYOUTS.switch.classic.at).pathname).toBe('/data/');
    expect(new URL(LAYOUTS.preview.classic.data, 'http://site.test' + LAYOUTS.preview.classic.at).pathname).toBe('/data/');
  });
  it('the specs and the server waits use them: no spec writes V7\'s address or waits for the classic page by hand', () => {
    // every spec, every helper and the configuration, so a spec added later is read too (the old site's fixtures under
    // e2e/fixtures/ are not the app's pages: they are served by old-worker.spec.js at addresses of their own)
    const js = (dir) => readdirSync(join(ROOT, dir)).filter((f) => /\.m?js$/.test(f)).map((f) => `${dir}/${f}`);
    const files = [...js('e2e'), ...js('e2e/helpers'), 'playwright.config.js'];
    expect(files.filter((f) => f.endsWith('.spec.js')).length).toBeGreaterThan(40);
    for (const f of files) {
      const text = read(f).split('\n').filter((l) => !/^\s*(\*|\/\/|\/\*\*)/.test(l)).join('\n');
      expect(text, f).not.toMatch(/['"`]\/v7\/|\/v7\/['"`]|(PROD|TEST) \+ '\/'|pathname === '\/'/);
      // nor a missing market file let pass by hand
      expect(text, f).not.toMatch(/not there: \\\//);
    }
    expect(read('playwright.config.js')).toMatch(/import \{ V7_PATH \} from '\.\/e2e\/helpers\/paths\.js';/);
  });
  it('the classic page\'s browser walk (tests/integration/newPlanFromSeed.browser.mjs) visits and expects the layout\'s addresses only', () => {
    const text = read('tests/integration/newPlanFromSeed.browser.mjs').split('\n').filter((l) => !/^\s*(\*|\/\/|\/\*\*)/.test(l)).join('\n');
    expect(text).toMatch(/import \{ V7_PATH, CLASSIC_PATH, LAYOUT_UNDER_TEST \} from '\.\.\/\.\.\/e2e\/helpers\/paths\.js';/);
    // no V7 folder by name (an address, a pattern or a build folder), and no classic-page address but the policy's
    expect(text).not.toMatch(/\/v7|\\\/v7|['"`]v7['"`/]/);
    expect(text).not.toMatch(/BASE \+ ['"`]\/(?!privacy\.html)/);
  });
});
