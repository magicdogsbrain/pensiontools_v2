/**
 * Rules for the browser tests, checked by reading the files (V7 build brief, package 5; test plan 7.2, 8.2, 11).
 * Nothing here starts a browser or imports Playwright, so this file runs in the ordinary suite — and in the
 * nightly data update's gate — whether or not any browser is installed.
 *
 *  1. No browser test waits for a length of time: `waitForTimeout` is banned in e2e/. Wait for the ready mark.
 *  2. Playwright is pinned to one exact version, and every workflow's container tag names that version
 *     (the pictures are tied to the container, so the two must never drift).
 *  3. The `browser` job is a separate job. The existing `test` job is as it was, and the data update's
 *     workflow does not mention Playwright at all: a browser problem cannot stop the data update.
 *  4. The static server sends what public/_headers says: the security policy on every page, "noindex" on /v7/.
 *  5. No test is retried, none is marked `.only`, none opens the live site.
 *  6. Pictures are not compared unless the gate is switched on.
 *  7. Every browser test file the brief lists exists.
 *  8. Step 4 (questions A and B): the five journeys exist and run where the plan says (published build for the
 *     counted first answer to A and the hand-over to B; sizes and night engines as test plan A–B 11.1, 14.2),
 *     the counted budgets are the brief's, the night run may take 60 minutes, `v7:cases` writes all three
 *     lists, and RELEASING.md has a stopwatch line for each question.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { parseHeaders, headersFor } from '../../e2e/helpers/serve.mjs';

const ROOT = process.cwd();
const read = (p) => readFileSync(join(ROOT, p), 'utf8');

function filesUnder(dir, out = []) {
  const abs = join(ROOT, dir);
  if (!existsSync(abs)) return out;
  for (const name of readdirSync(abs)) {
    const p = join(dir, name);
    if (statSync(join(ROOT, p)).isDirectory()) { if (!name.endsWith('-snapshots')) filesUnder(p, out); } else out.push(p);
  }
  return out;
}

/** The code without its comments (strings kept), so a rule may be described in a comment without breaking it. */
function code(src) {
  let out = '';
  let i = 0;
  while (i < src.length) {
    const c = src[i];
    const d = src[i + 1];
    if (c === '/' && d === '/' && src[i - 1] !== ':') { while (i < src.length && src[i] !== '\n') i++; continue; }
    if (c === '/' && d === '*') { i = src.indexOf('*/', i + 2); i = i === -1 ? src.length : i + 2; continue; }
    if (c === '"' || c === "'" || c === '`') {
      let j = i + 1;
      while (j < src.length && src[j] !== c) { if (src[j] === '\\') j++; j++; }
      out += src.slice(i, j + 1);
      i = j + 1;
      continue;
    }
    out += c;
    i++;
  }
  return out;
}

/** One job's text from a workflow file: from its "  name:" line to the next job or the end. */
function jobText(workflow, name) {
  const lines = workflow.split('\n');
  const start = lines.findIndex((l) => l === `  ${name}:`);
  if (start === -1) return null;
  let end = lines.length;
  for (let i = start + 1; i < lines.length; i++) if (/^ {2}[A-Za-z0-9_-]+:\s*$/.test(lines[i])) { end = i; break; }
  return lines.slice(start, end).join('\n');
}

const E2E = filesUnder('e2e').filter((f) => /\.(js|mjs)$/.test(f));
const SPECS = E2E.filter((f) => f.endsWith('.spec.js'));
const pkg = JSON.parse(read('package.json'));
const WORKFLOWS = filesUnder('.github/workflows').filter((f) => /\.ya?ml$/.test(f));

describe('browser tests: rules kept by reading the files', () => {
  it('every browser test file the brief lists exists', () => {
    const wanted = [
      'playwright.config.js',
      'e2e/helpers/serve.mjs', 'e2e/helpers/app.js', 'e2e/helpers/answerInNode.js',
      'e2e/c-forum-guest.spec.js', 'e2e/c-couple.spec.js', 'e2e/c-retired.spec.js', 'e2e/crawl.spec.js',
      'e2e/production.spec.js', 'e2e/old-app-unchanged.spec.js', 'e2e/keyboard.spec.js', 'e2e/screens.spec.js',
      'e2e/sameness.spec.js', 'e2e/axe-exceptions.json',
      '.github/workflows/nightly.yml', '.github/workflows/screenshots.yml',
      // Step 4 (brief 3, P6)
      'e2e/a-stop-soon.spec.js', 'e2e/a-couple.spec.js', 'e2e/a-from-savings.spec.js', 'e2e/b-my-number.spec.js', 'e2e/b-coast.spec.js',
      'tests/v7/cross/questions.test.js'
    ];
    expect(wanted.filter((f) => !existsSync(join(ROOT, f)))).toEqual([]);
  });

  it('no browser test waits for a length of time (waitForTimeout is banned in e2e/)', () => {
    expect(E2E.length).toBeGreaterThan(5);
    const bad = E2E.filter((f) => /waitForTimeout|\bsetTimeout\s*\(\s*(?:resolve|r)\b/.test(code(read(f))));
    expect(bad).toEqual([]);
  });

  it('no test is marked .only, skipped without a reason, or pointed at the live site', () => {
    const only = SPECS.filter((f) => /\b(?:test|describe|it)\.only\b/.test(code(read(f))));
    expect(only).toEqual([]);
    const bare = SPECS.filter((f) => /\btest\.(?:skip|fixme)\(\s*\)/.test(code(read(f))));
    expect(bare).toEqual([]);
    const live = E2E.filter((f) => /pensiontools\.uk|github\.io|pages\.dev/.test(code(read(f))));
    expect(live).toEqual([]);
  });

  it('Playwright is pinned to one exact version', () => {
    const v = pkg.devDependencies['@playwright/test'];
    expect(v).toMatch(/^\d+\.\d+\.\d+$/);
    const installed = JSON.parse(read('node_modules/@playwright/test/package.json')).version;
    expect(installed).toBe(v);
  });

  it('every Playwright container tag in the workflows is that version', () => {
    const v = pkg.devDependencies['@playwright/test'];
    const tags = [];
    for (const f of WORKFLOWS) for (const m of read(f).matchAll(/mcr\.microsoft\.com\/playwright:v([0-9.]+)-/g)) tags.push({ f, tag: m[1] });
    // The picture workflow and the night run use the container; if either stops, this count says so.
    expect(tags.map((t) => t.f).sort()).toEqual(['.github/workflows/nightly.yml', '.github/workflows/screenshots.yml']);
    expect(tags.filter((t) => t.tag !== v)).toEqual([]);
  });

  it('the browser job is separate, and the existing test job is as it was', () => {
    const yml = read('.github/workflows/test.yml');
    const testJob = jobText(yml, 'test');
    const browserJob = jobText(yml, 'browser');
    expect(testJob).not.toBeNull();
    expect(browserJob).not.toBeNull();
    // The vitest job: the same five steps, and no word of Playwright.
    const steps = testJob.split('\n').filter((l) => /^ {6}- /.test(l)).map((l) => l.trim());
    expect(steps).toEqual(['- uses: actions/checkout@v4', '- uses: actions/setup-node@v4', '- run: npm ci', '- run: npx vitest run', '- run: npm run build']);
    expect(testJob).not.toMatch(/playwright|e2e/i);
    // Neither job waits for the other.
    expect(browserJob).not.toMatch(/^\s+needs:/m);
    expect(testJob).not.toMatch(/^\s+needs:/m);
    expect(browserJob).toMatch(/timeout-minutes: 20/);
    // Split across runners; each runs its share.
    expect(browserJob).toMatch(/shard: \[1, 2, 3\]/);
    expect(browserJob).toMatch(/--shard=\$\{\{ matrix\.shard \}\}\/3/);
    // The browsers are cached by the installed Playwright version.
    expect(browserJob).toMatch(/actions\/cache@v4/);
    expect(browserJob).toMatch(/ms-playwright/);
    expect(browserJob).toMatch(/npm run e2e:build/);
    expect(browserJob).toMatch(/npx playwright test/);
  });

  it('a browser problem cannot stop the data update', () => {
    const bot = read('.github/workflows/update-gilt-data.yml');
    expect(bot).not.toMatch(/playwright|e2e/i);
    // …and this very file, which the data update's gate does run, needs no browser: it imports only vitest,
    // Node's own modules and the header reader.
    const imports = [...code(read('tests/v7/e2eRules.test.js')).matchAll(/^import .* from '([^']+)';$/gm)].map((m) => m[1]);
    expect(imports.filter((i) => !(i === 'vitest' || i.startsWith('node:') || i.endsWith('serve.mjs')))).toEqual([]);
  });

  it('no workflow drops a screen problem (E2E_IGNORE is a local aid only)', () => {
    for (const f of WORKFLOWS) expect(read(f), f).not.toMatch(/E2E_IGNORE/);
  });

  it('only the picture workflow may write to the repository', () => {
    for (const f of WORKFLOWS) {
      const y = read(f);
      if (f.endsWith('screenshots.yml')) { expect(y).toMatch(/contents: write/); expect(y).toMatch(/workflow_dispatch/); expect(y).not.toMatch(/^\s+push:|^\s+schedule:|pull_request/m); }
      if (f.endsWith('nightly.yml') || f.endsWith('test.yml')) expect(y).not.toMatch(/contents: write/);
    }
  });

  it('no test is retried, and the two builds are served by the header-sending server', () => {
    const cfg = code(read('playwright.config.js'));
    expect(cfg).toMatch(/retries:\s*0/);
    expect(cfg).toMatch(/testDir:\s*'e2e'/);
    expect(cfg).toMatch(/serviceWorkers:\s*'block'/);
    expect(cfg).toMatch(/locale:\s*'en-GB'/);
    expect(cfg).toMatch(/timezoneId:\s*'Europe\/London'/);
    expect(cfg.match(/helpers\/serve\.mjs/g).length).toBeGreaterThanOrEqual(1);
    expect(cfg).not.toMatch(/vite preview/);
  });

  it('pictures are compared only when the gate is on (baselines wait for the owner)', () => {
    const spec = code(read('e2e/screens.spec.js'));
    expect(spec).toMatch(/SCREENS_GATE/);
    // The one place a picture is compared sits behind the switch.
    const uses = [...spec.matchAll(/toHaveScreenshot/g)].length;
    expect(uses).toBe(1);
    expect(spec).toMatch(/if \(COMPARE\)[^\n]*toHaveScreenshot/);
    // No workflow that runs on a push switches the gate on.
    expect(read('.github/workflows/test.yml')).not.toMatch(/SCREENS_GATE:\s*['"]?1/);
  });

  it('the static server sends what public/_headers says', () => {
    const rules = parseHeaders(read('public/_headers'));
    const v7 = headersFor(rules, '/v7/');
    const asset = headersFor(rules, '/v7/assets/index-abc.js');
    const home = headersFor(rules, '/');
    for (const h of [v7, asset, home]) {
      expect(h['Content-Security-Policy']).toMatch(/^default-src 'self'; script-src 'self' /);
      expect(h['Content-Security-Policy']).not.toMatch(/unsafe-eval/);
      expect(h['X-Content-Type-Options']).toBe('nosniff');
      expect(h['X-Frame-Options']).toBe('SAMEORIGIN');
    }
    expect(v7['X-Robots-Tag']).toBe('noindex');
    expect(asset['X-Robots-Tag']).toBe('noindex');
    expect(home['X-Robots-Tag']).toBeUndefined();
    expect(headersFor(rules, '/v7')['X-Robots-Tag']).toBeUndefined();   // Cloudflare's /v7/* does not match /v7; the server forwards /v7 to /v7/
  });

  it('the header reader follows Cloudflare\'s rules: comments, splats, and every matching block', () => {
    const rules = parseHeaders('# note\n/*\n  A: 1\n  B: x: y\n\n/a/*\n  C: 3\n/exact\n  D: 4\n');
    expect(headersFor(rules, '/a/b')).toEqual({ A: '1', B: 'x: y', C: '3' });
    expect(headersFor(rules, '/exact')).toEqual({ A: '1', B: 'x: y', D: '4' });
    expect(headersFor(rules, '/exact/no')).toEqual({ A: '1', B: 'x: y' });
  });

  describe('step 4: questions A and B', () => {
    const JOURNEYS = { 'a-stop-soon': 'prod', 'b-my-number': 'prod', 'a-couple': 'test', 'a-from-savings': 'test', 'b-coast': 'test' };
    const cfg = code(read('playwright.config.js'));
    /** The config's named lists (`const X = [ 'a', ...Y ]`), resolved, read from its text (the config imports Playwright). */
    const lists = {};
    for (const m of cfg.matchAll(/const (\w+) = \[([^\]]*)\]/g)) lists[m[1]] = m[2];
    const resolve = (body, seen = new Set()) => {
      const out = [...body.matchAll(/'([\w-]+)'/g)].map((x) => x[1]);
      for (const [, v] of body.matchAll(/\.\.\.(\w+)/g)) if (lists[v] !== undefined && !seen.has(v)) out.push(...resolve(lists[v], new Set([...seen, v])));
      return out;
    };
    /** The specs a project runs: its `testMatch: only(…)`, a list name or a list written in place. */
    const project = (name) => {
      const m = new RegExp(`name: '${name}'[^\\n]*testMatch: only\\((\\w+|\\[[^\\]]*\\])\\)`).exec(cfg);
      if (!m) return null;
      return m[1].startsWith('[') ? resolve(m[1]) : resolve(lists[m[1]] || '');
    };

    it('each journey runs on the build the plan names: the counted first answer to A and the hand-over on the published build', () => {
      for (const [name, build] of Object.entries(JOURNEYS)) {
        const spec = code(read(`e2e/${name}.spec.js`));
        expect(spec, name).toMatch(new RegExp(`v7\\(page, '${build}'`));
        if (build === 'test') expect(spec, name).not.toMatch(/v7\(page, 'prod'/);
      }
    });

    it('each journey runs at the sizes of the plan, and the night runs J4 and J7 in WebKit and J4 in Firefox', () => {
      const where = (n) => ['phone-390', 'ipad-744', 'wide-1024', 'desktop-1440'].filter((p) => (project(p) || []).includes(n));
      expect(where('a-stop-soon')).toEqual(['phone-390', 'desktop-1440']);
      expect(where('b-my-number')).toEqual(['phone-390', 'desktop-1440']);
      expect(where('a-couple')).toEqual(['phone-390', 'desktop-1440']);
      expect(where('a-from-savings')).toEqual(['phone-390', 'desktop-1440']);
      expect(where('b-coast')).toEqual(['phone-390', 'ipad-744']);
      for (const p of ['nightly-webkit-390', 'nightly-webkit-744']) for (const n of ['a-stop-soon', 'a-from-savings']) expect(project(p), `${n} in ${p}`).toContain(n);
      expect(project('nightly-firefox')).toContain('a-stop-soon');
    });

    it('the counted first answers keep the brief\'s budgets: A 4 things, B 5; 4 screens (the budget step adds one); 8 clicks; 3 s, 15 s, 30 s more', () => {
      const helper = code(read('e2e/helpers/app.js'));
      expect(helper).toMatch(/a: \{ mustFill: 4, screens: 4, clicks: 8, firstMs: 3_000, finalMs: 15_000, optionalMs: 30_000/);
      expect(helper).toMatch(/b: \{ mustFill: 5, screens: 4, clicks: 8, firstMs: 3_000, finalMs: 15_000, optionalMs: 30_000/);
      // A phone four times slower than the reference machine: 4 there, scaled by this machine's measured speed
      // elsewhere, never above 4 and never below 1.
      expect(helper).toMatch(/SLOWDOWN = Number\(process\.env\.E2E_SLOWDOWN\) \|\| 4\b/);
      expect(code(read('playwright.config.js'))).toMatch(/globalSetup: '\.\/e2e\/global-setup\.js'/);
      const cal = code(read('e2e/helpers/calibrate.mjs'));
      expect(cal).toMatch(/Math\.min\(4, Math\.max\(1, 4 \* reference \/ measured\)\)/);
      // The counted journeys type one key at a time and write their counts down.
      for (const name of ['a-stop-soon', 'b-coast']) {
        const spec = code(read(`e2e/${name}.spec.js`));
        expect(spec, name).toMatch(/delay: KEY_DELAY/);
        expect(spec, name).toMatch(/record\(testInfo, `first-answer-[ab]\//);
      }
    });

    it('the night run may take 60 minutes', () => {
      expect(jobText(read('.github/workflows/nightly.yml'), 'nightly')).toMatch(/timeout-minutes: 60\b/);
    });

    it('v7:cases writes all three case lists', () => {
      const script = pkg.scripts['v7:cases'];
      for (const f of ['tests/v7/gen/build-cases.mjs', 'tests/v7/gen/dimensionsA.mjs', 'tests/v7/gen/dimensionsB.mjs']) expect(script).toContain(f);
    });

    it('RELEASING.md has a stopwatch line for each question and the real-phone look for A and B', () => {
      const text = read('RELEASING.md');
      for (const q of ['C:', 'A (', 'B (']) expect(text).toMatch(new RegExp(`- ${q.replace('(', '\\(')}[^\\n]*stopwatch: __ s`));
      expect(text).toMatch(/For A and B, the same on a real phone and iPad/);
    });

    it('no A or B journey and no cross-question check is skipped without saying why', () => {
      for (const name of Object.keys(JOURNEYS)) {
        const spec = code(read(`e2e/${name}.spec.js`));
        expect(spec, name).toMatch(/waitsFor\(/);                                  // skips say which part they wait for
        expect(spec, name).not.toMatch(/\btest\.(?:skip|fixme)\(\s*\)/);
      }
      const cross = code(read('tests/v7/cross/questions.test.js'));
      const skips = [...cross.matchAll(/skipIf\([^\n]*/g)].map((m) => m[0]);
      expect(skips.length).toBeGreaterThan(0);
      for (const line of skips) expect(line, 'a skipped block names what it waits for').toMatch(/WAIT_|waiting\(/);
    });
  });
});
