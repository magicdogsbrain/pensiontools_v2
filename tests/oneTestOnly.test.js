/**
 * One "will it last" test (6.24.0): every figure that says whether a plan lasts comes from stressTestStrategy
 * (src/strategies/stressTest.js) on the plan planFromSettings builds. Nothing else may run the Pots & Valves engine
 * directly — the Household tab's survivor and care checks did until the household sweep, and so modelled every plan as
 * a growth portfolio whatever its strategy: a gilt ladder's inheritance came out about double what the ladder leaves.
 *
 * This walks every module under src/ and index.html's inline script and fails on a direct call to the engine —
 * `.simulate(`, `monteCarloReturns(`, or `getStrategy('pots-and-valves').engine` — outside the files below.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

const ROOT = resolve(process.cwd());

// The files that ARE the one test's internals, and nothing else:
const ALLOW = {
  // the one test itself: pnvRun runs the Pots & Valves engine for the Pots & Valves and Buckets-in-order rows
  'src/strategies/stressTest.js': true,
  // the one test's configs (deriveCompareConfigs, which stressTestStrategy reads) and the canned-decade read-out of its windows
  'src/strategies/compareRunner.js': true,
  // the engine itself: it defines simulate and monteCarloReturns (runMonteCarlo and simulateTraced call them on themselves)
  'src/services/SimulationEngine.js': true
};

const PATTERNS = [
  { name: '.simulate(', re: /\.simulate\s*\(/ },
  { name: 'monteCarloReturns(', re: /\bmonteCarloReturns\s*\(/ },
  { name: "getStrategy('pots-and-valves').engine", re: /getStrategy\(\s*['"]pots-and-valves['"]\s*\)\s*\.engine\b/ }
];

/** The code with comments blanked (a comment may name the engine; only code counts). Line numbers are kept. */
function codeOnly(src) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '))
    .replace(/(^|[^:'"\\])\/\/[^\n]*/g, (m, pre) => pre);
}

function offences(rel, src) {
  const out = [];
  codeOnly(src).split('\n').forEach((line, i) => {
    for (const p of PATTERNS) if (p.re.test(line)) out.push(rel + ':' + (i + 1) + ' calls ' + p.name);
  });
  return out;
}

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const f = join(dir, name);
    if (statSync(f).isDirectory()) walk(f, acc);
    else if (/\.js$/.test(name)) acc.push(f);
  }
  return acc;
}

describe('one test only: nothing outside the one test runs the engine directly', () => {
  it('src/**/*.js', () => {
    const bad = [];
    for (const f of walk(join(ROOT, 'src'))) {
      const rel = relative(ROOT, f).split('\\').join('/');
      if (ALLOW[rel]) continue;
      bad.push(...offences(rel, readFileSync(f, 'utf8')));
    }
    expect(bad).toEqual([]);
  });
  it("index.html's inline script", () => {
    const html = readFileSync(join(ROOT, 'index.html'), 'utf8');
    const inline = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)].filter((m) => !/\bsrc=/.test(m[1]));
    expect(inline.length).toBeGreaterThan(0);
    expect(inline.flatMap((m) => offences('index.html', m[2]))).toEqual([]);
  });
  it('bites: a direct call is caught, a comment naming one is not', () => {
    expect(offences('x.js', "const r = getStrategy('pots-and-valves').engine.simulate(cfg, ret, 1);")).toHaveLength(2);
    expect(offences('x.js', 'const ret = eng(cfg).monteCarloReturns({ years: 30 }, i);')).toHaveLength(1);
    expect(offences('x.js', '// eng.simulate(cfg) used to run here\n/* monteCarloReturns(cfg, i) */')).toEqual([]);
  });
  it('every allow-listed file still exists (a stale entry is removed, not kept)', () => {
    for (const rel of Object.keys(ALLOW)) expect(statSync(join(ROOT, rel)).isFile(), rel).toBe(true);
  });
});
