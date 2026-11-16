/**
 * Rules for the scenario tests (e2e/scenarios/), kept by reading the files. Nothing here starts a browser.
 *
 *  1. Independence: the expected value is worked in the test, by hand. Nothing under e2e/scenarios/ reaches the app's
 *     code, directly or through a helper it imports: no import that leads to src/, to an engine-in-Node helper, or to a
 *     pins file. The only ways out are the addresses (e2e/helpers/paths.js), the emulators' REST calls
 *     (e2e/signed-in/emulator.js) and the hand-written tax oracle (tests/v7/oracles/ukTax.mjs).
 *  2. No whole sentence pinned (no toHaveText with more than 60 characters), no waiting for a length of time, and the
 *     emulators cleared only once, in the scenarios' global set-up.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, relative, resolve } from 'node:path';

const ROOT = process.cwd();
const DIR = 'e2e/scenarios';

function filesUnder(dir, out = []) {
  const abs = join(ROOT, dir);
  if (!existsSync(abs)) return out;
  for (const name of readdirSync(abs)) {
    const p = join(dir, name);
    if (statSync(join(ROOT, p)).isDirectory()) filesUnder(p, out); else out.push(p);
  }
  return out;
}

/** The code without its comments (strings kept), so a rule may be named in a comment without breaking it. */
export function code(src) {
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

/** Every module a file names: static imports, re-exports and dynamic import('…') with a literal. */
export function importsOf(src) {
  const c = code(src);
  const out = [];
  for (const m of c.matchAll(/\b(?:import|export)\s[^'"`;]*?\bfrom\s*(['"])([^'"]+)\1/g)) out.push(m[2]);
  for (const m of c.matchAll(/\bimport\s*(['"])([^'"]+)\1/g)) out.push(m[2]);
  for (const m of c.matchAll(/\bimport\(\s*(['"`])([^'"`]+)\1\s*\)/g)) out.push(m[2]);
  return out;
}

/** The ways out of e2e/scenarios/: these may be imported, and what they import in turn is not followed. */
export const ALLOWED_OUTSIDE = Object.freeze(['e2e/helpers/paths.js', 'e2e/signed-in/emulator.js', 'tests/v7/oracles/ukTax.mjs']);

/**
 * What a scenario file breaks of rule 1: every chain of imports from `file` that reaches the app, an engine helper or a
 * pins file, as text ("a.js → b.js → src/x.js"). Relative imports are followed; packages are not (Playwright, node:).
 */
export function reachesApp(file, read = (p) => readFileSync(join(ROOT, p), 'utf8')) {
  const bad = [];
  const seen = new Set();
  const walk = (p, chain) => {
    if (seen.has(p)) return;
    seen.add(p);
    const here = [...chain, p];
    if (/^src\//.test(p) || /InNode/.test(p) || /\.pins(\.|$)/.test(p) || /\.pins\.node\d+\.json$/.test(p)) { bad.push(here.join(' → ')); return; }
    if (!p.startsWith(DIR + '/') && !ALLOWED_OUTSIDE.includes(p)) { bad.push(`${here.join(' → ')} (outside the scenarios: only ${ALLOWED_OUTSIDE.join(', ')} may be imported)`); return; }
    if (ALLOWED_OUTSIDE.includes(p)) return;
    if (!/\.(m?js|json)$/.test(p) || p.endsWith('.json')) return;
    for (const spec of importsOf(read(p))) {
      if (!spec.startsWith('.') && !spec.startsWith('/')) continue;              // a package or node: built-in
      const target = relative(ROOT, resolve(ROOT, dirname(p), spec));
      walk(target, here);
    }
  };
  walk(file, []);
  return bad;
}

/** What a scenario file breaks of rule 2, as text. */
export function brokenRules(file, src) {
  const c = code(src);
  const out = [];
  if (/InNode/.test(c)) out.push('names an engine-in-Node helper');
  if (/\.pins\b/.test(c)) out.push('names a pins file');
  if (/waitForTimeout/.test(c)) out.push('waits for a length of time (waitForTimeout)');
  for (const m of c.matchAll(/toHaveText\(\s*(['"`])((?:\\.|(?!\1).)*)\1/g)) if (m[2].length > 60) out.push(`pins a whole sentence: toHaveText('${m[2].slice(0, 40)}…')`);
  if (/\bclearEmulators\b/.test(c) && !/(^|\/)global-setup\.m?js$/.test(file)) out.push('clears the emulators outside the global set-up');
  return out;
}

const FILES = filesUnder(DIR).filter((f) => /\.(m?js)$/.test(f));

describe('scenario tests: independence and plain checks', () => {
  it('the scenario folder exists and has its hand library', () => {
    expect(FILES.some((f) => f.startsWith(`${DIR}/hand/`))).toBe(true);
  });

  it('nothing under e2e/scenarios/ reaches the app, an engine helper or a pins file, directly or through what it imports', () => {
    const bad = FILES.flatMap((f) => reachesApp(f));
    expect(bad).toEqual([]);
  });

  it('no whole sentence pinned, no waiting for a length of time, the emulators cleared only in the global set-up', () => {
    const bad = FILES.flatMap((f) => brokenRules(f, readFileSync(join(ROOT, f), 'utf8')).map((w) => `${f}: ${w}`));
    expect(bad).toEqual([]);
  });

  it('the rules catch what they name (a planted file, read from memory)', () => {
    const planted = {
      [`${DIR}/zz.js`]: "import { a } from './zz2.js';\nimport { answerFromDraft } from '../helpers/answerInNode.js';\n",
      [`${DIR}/zz2.js`]: "export { COMMON } from '../../src/v7/copy/common.js';\n",
      [`${DIR}/zz3.js`]: "import '../signed-in/journeys.js';\n"
    };
    const read = (p) => planted[p] ?? readFileSync(join(ROOT, p), 'utf8');
    expect(reachesApp(`${DIR}/zz.js`, read)).toEqual([
      `${DIR}/zz.js → ${DIR}/zz2.js → src/v7/copy/common.js`,
      `${DIR}/zz.js → e2e/helpers/answerInNode.js`
    ]);
    expect(reachesApp(`${DIR}/zz3.js`, read)[0]).toMatch(/e2e\/signed-in\/journeys\.js \(outside the scenarios/);
    expect(brokenRules(`${DIR}/zz.js`, "await page.waitForTimeout(5);\nawait expect(x).toHaveText('" + 'a'.repeat(61) + "');\nawait clearEmulators();\n// InNode in a comment is fine\n"))
      .toEqual(['waits for a length of time (waitForTimeout)', `pins a whole sentence: toHaveText('${'a'.repeat(40)}…')`, 'clears the emulators outside the global set-up']);
    expect(brokenRules(`${DIR}/global-setup.js`, 'await clearEmulators();')).toEqual([]);
  });
});

describe('scenario tests: the register of facts', async () => {
  const { FACTS, PAGES } = await import('../e2e/scenarios/facts.js');
  const { NEVER_ON_SCREEN } = await import('../e2e/scenarios/read.js');

  it('every register entry names a page and a locator for both views, or says which view does not state it', () => {
    const bad = [];
    for (const [id, f] of Object.entries(FACTS)) {
      if (!f.owner || !f.kind) bad.push(`${id}: no owner or kind`);
      for (const view of ['simple', 'full']) {
        const places = f[view];
        if (places === undefined) { bad.push(`${id}: says nothing about the ${view} view`); continue; }
        if (!Array.isArray(places)) { if (!(places && typeof places.none === 'string' && places.none.length > 10)) bad.push(`${id}: the ${view} view neither lists places nor says why it does not state the fact`); continue; }
        if (!places.length) bad.push(`${id}: an empty list for the ${view} view`);
        for (const p of places) {
          if (!PAGES[view][p.page]) bad.push(`${id}: ${view} page "${p.page}" is not a page of that view`);
          if (!p.find && !p.input) bad.push(`${id}: ${view} ${p.page} has neither a pattern nor a box`);
          if (p.find) { try { const re = new RegExp(p.find); if (!/\((?!\?)/.test(re.source)) bad.push(`${id}: ${view} ${p.page}'s pattern catches no value`); } catch (e) { bad.push(`${id}: ${view} ${p.page}: ${e.message}`); } }
        }
      }
    }
    expect(bad).toEqual([]);
  });

  it('the first twelve facts of the brief are in the register', () => {
    const twelve = ['stage', 'stop.month', 'yearsToGo', 'plan.endAge', 'pot.today', 'pot.atStop', 'payIn.fromTakeHome', 'payIn.employer', 'payIn.total',
      'income.thisYear.beforeTax', 'income.perMonth.afterTax', 'taken.againstPlan', 'statePension.amount', 'statePension.age', 'lasts.chance', 'left.typically', 'due.next'];
    expect(twelve.filter((id) => !FACTS[id])).toEqual([]);
  });

  it('the simple view\'s never-list is the one the other browser tests use (e2e/helpers/app.js), word for word', () => {
    const src = readFileSync(join(ROOT, 'e2e/helpers/app.js'), 'utf8');
    const m = /export const NEVER_ON_SCREEN = (\[[^\]]*\]);/.exec(src);
    expect(m, 'app.js still names NEVER_ON_SCREEN').toBeTruthy();
    expect(JSON.stringify(NEVER_ON_SCREEN)).toBe(JSON.stringify(Function(`return ${m[1]}`)()));
  });
});
