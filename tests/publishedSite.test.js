// @vitest-environment node
/**
 * The published site's layout (research/v7/switch-readiness.md §2 steps 3–8; vite.layout.js):
 *
 *   - where each build writes, and the two builds leaving each other's folder alone (so they run in either order);
 *   - the two pages' heads in each layout: at 7.0 V7's page is the one installable app and is indexed, the classic page
 *     links no manifest and is marked "do not index"; the rollback's heads are the ones before 7.0;
 *   - the old /v7/ address at 7.0: a page with no script of its own that forwards to the same place at the root;
 *   - docs/, the folder that is deployed, is one whole build of the layout LAYOUT names (the switch, 7.0's, unless a
 *     rollback is being checked with LAYOUT=preview): V7 at the root and the classic page at classic/, and the files a
 *     person or a browser asks for by name — the privacy policy, the market data (the root's and the classic engine
 *     worker's copy), the kill-switch sw.js, the manifest — are files there, served as files by the test server that
 *     answers as Cloudflare Pages does, never the single-page fallback; no redirect file sends them elsewhere.
 */
import { describe, it, expect, afterAll } from 'vitest';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { outFor, emptyOwnFolder, refuseToEmpty, classicHead, v7Head, FORWARD_PAGE, FORWARD_SCRIPT, FOLDERS, CLASSIC_NAME, CLASSIC_TO_FRONT, CLASSIC_TO_FRONT_OUTSIDE } from '../vite.layout.js';
import { CLASSIC_NAME as CLASSIC_NAME_IN_PAGE } from '../src/ui/classicName.js';
import { LAYOUTS, layoutNamed } from '../src/appLayout.js';
import { parseHeaders, headersFor, startServer } from '../e2e/helpers/serve.mjs';

const ROOT = process.cwd();
const read = (p) => readFileSync(join(ROOT, p), 'utf8');
const DOCS = join(ROOT, 'docs');
const scratch = [];
afterAll(() => { for (const d of scratch) rmSync(d, { recursive: true, force: true }); });
const tempDir = () => { const d = mkdtempSync(join(tmpdir(), 'pt-site-')); scratch.push(d); return d; };

/** A transformIndexHtml hook's handler, for one or several plugins, in Vite's order: the 'pre' ones, then the rest. */
function transform(plugins, html) {
  const list = [plugins].flat();
  const order = (p) => (p.transformIndexHtml && p.transformIndexHtml.order === 'pre' ? 0 : 1);
  for (const p of [...list].sort((a, b) => order(a) - order(b))) if (p.transformIndexHtml) html = p.transformIndexHtml.handler(html);
  return html;
}

describe('where each build writes', () => {
  it('each layout puts each app where src/appLayout.js says it lives', () => {
    for (const [name, L] of Object.entries(LAYOUTS)) {
      for (const app of ['v7', 'classic']) {
        const folder = FOLDERS[name][app];
        expect('/' + (folder ? folder + '/' : ''), `${name} ${app}`).toBe(L[app].at);
      }
    }
  });
  it('the build at the site\'s root keeps the other app\'s folder; the other empties its own whole', () => {
    expect(outFor('switch', 'v7', { SITE_OUT: 'x' }).keep).toBe('classic');
    expect(outFor('switch', 'classic', { SITE_OUT: 'x' }).keep).toBe(null);
    expect(outFor('preview', 'classic', { SITE_OUT: 'x' }).keep).toBe('v7');
    expect(outFor('preview', 'v7', { SITE_OUT: 'x' }).keep).toBe(null);
  });
  it('emptying the site\'s root leaves the other app\'s folder as it was, and nothing else', () => {
    const site = tempDir();
    for (const p of ['assets/a.js', 'index.html', 'v7/index.html', 'classic/index.html', 'classic/assets/main-x.js', 'data/gilts.json']) {
      mkdirSync(join(site, p, '..'), { recursive: true });
      writeFileSync(join(site, p), p);
    }
    emptyOwnFolder(site, 'classic').buildStart();
    expect(readdirSync(site)).toEqual(['classic']);
    expect(readFileSync(join(site, 'classic/assets/main-x.js'), 'utf8')).toBe('classic/assets/main-x.js');
    emptyOwnFolder(join(site, 'classic'), null).buildStart();
    expect(readdirSync(join(site, 'classic'))).toEqual([]);
    emptyOwnFolder(join(site, 'not-there'), null).buildStart();   // a first build: nothing to empty
  });
  it('a mistyped SITE_OUT never empties the repository, a folder that holds it, or another project: the build stops and nothing is deleted', () => {
    // asked of the names only: nothing here ever empties the real repository, even if the check were broken
    for (const SITE_OUT of ['.', '..', ROOT, dirname(ROOT)]) {
      expect(refuseToEmpty(outFor('switch', 'v7', { SITE_OUT }).outDir), SITE_OUT).toMatch(/is the repository or holds it/);
    }
    for (const SITE_OUT of ['docs', 'dist/prod', 'dist/test']) {
      for (const app of ['v7', 'classic']) expect(refuseToEmpty(outFor('switch', app, { SITE_OUT }).outDir), `${SITE_OUT} ${app}`).toBe(null);
    }
    // a scratch folder outside the repository, as a rollback build uses, may be emptied
    const scratchSite = tempDir();
    expect(refuseToEmpty(scratchSite)).toBe(null);
    // another project's folder, wherever it is: refused, and every file of it is left
    const project = tempDir();
    for (const p of ['.git/HEAD', 'src/a.js', 'package.json', 'classic/index.html']) {
      mkdirSync(join(project, p, '..'), { recursive: true });
      writeFileSync(join(project, p), p);
    }
    expect(() => emptyOwnFolder(project, 'classic').buildStart()).toThrow(/will not empty the output folder: .* holds \.git/);
    expect(readdirSync(project).sort()).toEqual(['.git', 'classic', 'package.json', 'src']);
    const noGit = tempDir();
    for (const p of ['src/a.js', 'package.json']) { mkdirSync(join(noGit, p, '..'), { recursive: true }); writeFileSync(join(noGit, p), p); }
    expect(() => emptyOwnFolder(noGit, null).buildStart()).toThrow(/holds package\.json/);
    expect(readdirSync(noGit).sort()).toEqual(['package.json', 'src']);
  });
});

describe('the two pages\' heads', () => {
  const classic = read('index.html');
  const v7 = read('v7/index.html');

  it('at 7.0 the classic page links no manifest, is no home-screen app, is marked "do not index", names itself, and takes the root\'s favicon', () => {
    const out = transform(classicHead('switch'), classic);
    expect(out).not.toMatch(/rel="manifest"|apple-mobile-web-app/);
    expect(out).toMatch(/<meta name="robots" content="noindex">\n {2}<title>The classic planner<\/title>/);
    expect(out).toContain('<link rel="icon" type="image/png" href="../favicon.png">');
    // the body: the header's heading names it, and the way back to the front page sits just above the header
    expect(out).toContain('<h1>The classic planner</h1>');
    expect(out).not.toContain('<h1>Pension Planner</h1>');
    expect(out).toContain('      ' + CLASSIC_TO_FRONT + '\n      <header class="header">\n');
    // …and its twin above the screens drawn outside the app (the landing page, the sign-in screen), 7.0.1
    expect(out).toContain('  ' + CLASSIC_TO_FRONT_OUTSIDE + '\n  <div id="landingPage"></div>\n');
    // the rest of the page is untouched
    expect(out.length).toBeGreaterThan(classic.length - 400);
    const back = out.slice(out.indexOf('<style>')).replace('      ' + CLASSIC_TO_FRONT + '\n', '').replace('  ' + CLASSIC_TO_FRONT_OUTSIDE + '\n', '').replace('<h1>The classic planner</h1>', '<h1>Pension Planner</h1>');
    expect(back).toBe(classic.slice(classic.indexOf('<style>')));
  });
  it('at 7.0 the classic page\'s way back is a plain link to the site\'s front page (PensionTools, 7.1.0), from /classic/; it adds no script', () => {
    const href = /<a href="([^"]+)"[^>]*>Back to PensionTools<\/a>/.exec(CLASSIC_TO_FRONT)[1];
    expect(new URL(href, 'https://site.test' + LAYOUTS.switch.classic.at).pathname).toBe(LAYOUTS.switch.v7.at);
    expect(CLASSIC_TO_FRONT).not.toMatch(/<script|\son[a-z]+=/i);
    expect(CLASSIC_TO_FRONT).toMatch(/^<p id="classicToFront"/);
    // its twin outside the app (7.0.1): the same address and words, no script, and one rule that hides it once the app shows
    const twin = /<a href="([^"]+)"[^>]*>Back to PensionTools<\/a>/.exec(CLASSIC_TO_FRONT_OUTSIDE)[1];
    expect(twin).toBe(href);
    expect(CLASSIC_TO_FRONT_OUTSIDE).not.toMatch(/<script|\son[a-z]+=/i);
    expect(CLASSIC_TO_FRONT_OUTSIDE).toMatch(/^<style>body:has\(#mainApp:not\(\.hidden\)\) #classicToFrontOutside\{display:none\}<\/style><p id="classicToFrontOutside"/);
  });
  it('the classic page has one name at 7.0: its tab title, its header and the headings its modules draw (landing page, sign-in, the first-plan welcome)', () => {
    expect(CLASSIC_NAME).toBe('The classic planner');
    expect(CLASSIC_NAME_IN_PAGE).toBe(CLASSIC_NAME);   // these tests run the published layout (src/appLayout.js)
    expect(read('src/ui/components/LandingPage.js')).toContain('<h1>${CLASSIC_NAME}</h1>');
    expect(read('src/ui/components/AuthScreen.js').match(/<h1>\$\{CLASSIC_NAME\}<\/h1>/g)).toHaveLength(3);
    expect(read('src/ui/components/SetupWizard.js')).toContain("'Welcome to ' + CLASSIC_NAME_MID");
    for (const f of ['src/ui/components/LandingPage.js', 'src/ui/components/AuthScreen.js', 'src/ui/components/SetupWizard.js']) expect(read(f), f).not.toMatch(/Pension Planner/);
  });
  it('in the rollback the classic page\'s head is as before 7.0', () => {
    expect(transform(classicHead('preview'), classic)).toBe(classic);
    expect(classic).toContain('<link rel="manifest" href="manifest.json">');
    expect(classic).toContain('<title>Pension Planner v6</title>');
  });
  it('a changed classic head stops the build rather than skipping a step', () => {
    expect(() => transform(classicHead('switch'), classic.replace('<link rel="manifest" href="manifest.json">\n', ''))).toThrow(/expected exactly one/);
  });
  it('at 7.0 V7\'s page is the one installable app: its manifest, icons and colour, and no "do not index"', () => {
    const out = transform(v7Head('switch'), v7);
    expect(out).toMatch(/<link rel="manifest" href="\.\/manifest\.json">\n {2}<title>PensionTools: plan your pension, from saving to living on it<\/title>/);
    for (const line of ['<meta name="theme-color" content="#6366f1">', '<link rel="icon" type="image/png" href="./favicon.png">', '<link rel="apple-touch-icon" href="./icon-192.png">']) expect(out).toContain(line);
    expect(out).not.toMatch(/name="robots"/);
  });
  it('in the rollback V7\'s page is the preview as before 7.0: "do not index", the root\'s favicon, no manifest', () => {
    const out = transform(v7Head('preview'), v7);
    expect(out).toMatch(/<meta name="robots" content="noindex">\n {2}<link rel="icon" href="\.\.\/favicon\.png">\n {2}<title>/);
    expect(out).not.toMatch(/rel="manifest"/);
  });
  it('the manifest: "PensionTools" (7.1.0), starting and scoped at the site\'s root page (an installed app keeps its identity, /index.html)', () => {
    const m = JSON.parse(read('public/manifest.json'));
    expect(m.name).toBe('PensionTools');
    expect(m.id).toBeUndefined();
    expect(new URL(m.start_url, 'https://site.test/manifest.json').pathname).toBe('/index.html');
    expect(new URL(m.scope, 'https://site.test/manifest.json').pathname).toBe('/');
    for (const icon of m.icons) expect(existsSync(join(ROOT, 'public', icon.src)), icon.src).toBe(true);
  });
});

describe('the old /v7/ address at 7.0', () => {
  it('is a page with no script written in it (the security policy runs none), marked "do not index", with a plain link as well', () => {
    expect(FORWARD_PAGE.match(/<script\b[^>]*>[\s\S]*?<\/script>/g)).toEqual(['<script src="./forward.js"></script>']);
    expect(FORWARD_PAGE).toContain('<meta name="robots" content="noindex">');
    expect(FORWARD_PAGE).toContain('<a href="../">');
    expect(FORWARD_PAGE).not.toMatch(/\sstyle=|\son[a-z]+=/);
  });
  it('forwards to the same place at the root, the #/… part and any query kept, from the folder or its index.html, on a site at the root or under a path', () => {
    const run = (href) => {
      const u = new URL(href);
      let went = null;
      new Function('location', FORWARD_SCRIPT)({ search: u.search, hash: u.hash, replace: (to) => { went = new URL(to, href).href; } });
      return went;
    };
    expect(run('https://site.test/v7/#/plan/abc/lasts')).toBe('https://site.test/#/plan/abc/lasts');
    expect(run('https://site.test/v7/index.html#/plans')).toBe('https://site.test/#/plans');
    expect(run('https://site.test/v7/')).toBe('https://site.test/');
    expect(run('https://mirror.test/pensiontools/v7/?x=1#/c/answer')).toBe('https://mirror.test/pensiontools/?x=1#/c/answer');
  });
});

describe('docs/, the folder that is deployed', () => {
  const layout = existsSync(join(DOCS, 'classic', 'index.html')) ? 'switch' : 'preview';
  const L = LAYOUTS[layout];
  const SWITCHED = layout === 'switch';
  const at = (path) => join(DOCS, ...path.split('/').filter(Boolean));
  const page = (path) => readFileSync(at(path.endsWith('/') ? path + 'index.html' : path), 'utf8');

  it('is one whole build in the layout LAYOUT names (7.0\'s unless a rollback is checked): V7 at the root, the classic page at classic/', () => {
    expect(layout).toBe(layoutNamed(process.env.LAYOUT));
    expect(page(L.v7.at)).toMatch(/<div id="app" data-ready="0"/);
    expect(page(L.classic.at)).toMatch(/<div id="mainApp"/);
    expect(page(L.classic.at)).toMatch(SWITCHED ? /<title>The classic planner<\/title>/ : /<title>Pension Planner v6<\/title>/);
  });
  it('every script, stylesheet, icon and manifest each page names is in it', () => {
    for (const p of [L.v7.at, L.classic.at]) {
      const html = page(p);
      const named = [...html.matchAll(/<(?:script|link)\b[^>]*\s(?:src|href)="([^"]+)"/g)].map((m) => m[1]).filter((u) => !/^https?:/.test(u));
      expect(named.length, p).toBeGreaterThan(1);
      for (const u of named) expect(existsSync(at(new URL(u, 'https://site.test' + p).pathname)), `${p} names ${u}`).toBe(true);
    }
  });
  it('the files asked for by name are files: the policy, the market data (the root\'s and the classic engine worker\'s), the kill switch, the manifest, the headers, the forward', () => {
    expect(page('/privacy.html')).toMatch(/<h1>Privacy Policy<\/h1>/);
    // the classic engine worker's copy is made at 7.0 only (in the rollback layout the worker keeps its bundled figures)
    for (const dir of ['/data/', ...(SWITCHED ? [new URL(L.classic.data, 'https://site.test' + L.classic.at + 'assets/').pathname] : [])]) {
      for (const f of ['gilts.json', 'equity.json']) expect(() => JSON.parse(page(dir + f)), dir + f).not.toThrow();
    }
    expect(page('/sw.js')).toBe(read('public/sw.js'));
    expect(page('/manifest.json')).toBe(read('public/manifest.json'));
    expect(page('/_headers')).toBe(read('public/_headers'));
    if (!SWITCHED) return;
    expect(page('/v7/')).toBe(FORWARD_PAGE);
    expect(page('/v7/forward.js')).toBe(FORWARD_SCRIPT);
    // no other manifest, so one app can be installed
    expect(readdirSync(at(L.classic.at + 'assets')).filter((f) => /manifest/.test(f))).toEqual([]);
    expect(readdirSync(at('/assets')).filter((f) => /manifest/.test(f))).toEqual([]);
  });
  it('no redirect file sends any address elsewhere (the hosts answer a missing path with the front page; a known file is never missing)', () => {
    expect(existsSync(at('/_redirects'))).toBe(false);
  });
  it('the headers: "do not index" on the classic page and the old address only (in the rollback layout, on V7\'s /v7/ only)', () => {
    const rules = parseHeaders(page('/_headers'));
    const hidden = SWITCHED ? [L.classic.at, L.classic.at + 'index.html', L.classic.at + 'assets/main-x.js', '/v7/', '/v7/forward.js'] : [L.v7.at, L.v7.at + 'assets/index-x.js'];
    for (const p of hidden) expect(headersFor(rules, p)['X-Robots-Tag'], p).toBe('noindex');
    for (const p of ['/', '/index.html', '/privacy.html', '/data/gilts.json', '/sw.js', '/manifest.json']) expect(headersFor(rules, p)['X-Robots-Tag'], p).toBeUndefined();
  });
  it('served by the test server that answers as Cloudflare Pages does: each of those files is itself, never the single-page fallback', async () => {
    const server = startServer(DOCS, 0, { headersFile: at('/_headers') });
    await new Promise((done) => server.once('listening', done));
    const base = `http://127.0.0.1:${server.address().port}`;
    try {
      const files = ['/privacy.html', '/data/gilts.json', '/data/equity.json', '/sw.js', '/manifest.json', L.classic.at, L.v7.at, '/',
        ...(SWITCHED ? [L.classic.at + 'data/gilts.json', L.classic.at + 'data/equity.json', '/v7/forward.js'] : [])];
      for (const p of files) {
        const r = await fetch(base + p);
        expect(r.status, p).toBe(200);
        expect(r.headers.get('x-e2e-fallback'), p).toBe(null);
        const type = r.headers.get('content-type');
        if (p.endsWith('.json')) expect(type, p).toMatch(/^application\/json/);
        if (p.endsWith('.js')) expect(type, p).toMatch(/^text\/javascript/);
        if (p.endsWith('/') || p.endsWith('.html')) expect(type, p).toMatch(/^text\/html/);
        await r.arrayBuffer();
      }
      // and an address that is not a file is the fallback: V7's front door, as the host answers
      const missing = await fetch(base + '/no-such-file.json');
      expect(missing.headers.get('x-e2e-fallback')).toBe('1');
      expect(await missing.text()).toBe(page('/'));
    } finally {
      server.closeAllConnections();
      await new Promise((done) => server.close(done));
    }
  });
});
