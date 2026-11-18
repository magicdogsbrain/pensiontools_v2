/**
 * The static ratchet's counter (lead4.md G6), by reading the source. Not a test file: tests/reading/staticRatchet.test.js
 * holds the counts to the baseline in tests/reading/static-ratchet.json, which may only go down.
 *
 * Counted in index.html, src/ui, src/v7 and src/answers/plan (never in src/reading, the shared reading layer), outside
 * comments:
 *   getStressSettingsAsync   a call of the full view's cached settings reader            getStressSettingsAsync(
 *   DEFAULT_TAX_BANDS        a figure taxed on default bands, not the plan's             DEFAULT_TAX_BANDS
 *   grossToNet               after tax worked out on a page                              grossToNet(
 *   projectAccumulation      a saver's pot projected on a page                           projectAccumulation(
 *   diffHoldings             a holdings diff made on a page                              diffHoldings(
 *   newDate                  a bare clock (handed to a calculation, or not)              new Date()
 *   boxValue                 the value of a ss*, ac*, dd*, gp* or hh* box read           (… 'ssX' …).value / g('acX')?.value
 *   engineImport             an engine imported straight into a view                     import … strategies/, SimulationEngine,
 *                                                                                       AccumulationEngine, fastEngine
 * `newDate` counts every bare `new Date()`: telling one handed to a calculation from one that stamps a save is a judgement
 * this counter does not make, so it counts both and may only go down.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

export const RULES = Object.freeze({
  getStressSettingsAsync: /\bgetStressSettingsAsync\s*\(/g,
  DEFAULT_TAX_BANDS: /\bDEFAULT_TAX_BANDS\b/g,
  grossToNet: /\bgrossToNet\s*\(/g,
  projectAccumulation: /\bprojectAccumulation\s*\(/g,
  diffHoldings: /\bdiffHoldings\s*\(/g,
  newDate: /\bnew Date\(\s*\)/g,
  boxValue: /\(\s*['"`](?:ss|ac|dd|gp|hh)[A-Z][A-Za-z0-9]*['"`]\s*\)\s*\??\.value\b/g,
  engineImport: /^\s*import\b[^;]*?from\s*['"][^'"]*(?:\/strategies\/|SimulationEngine|AccumulationEngine|fastEngine)[^'"]*['"]/gm
});

const SCOPE = ['index.html', 'src/ui', 'src/v7', 'src/answers/plan'];
const CODE = /\.(js|jsx|mjs|html)$/;

function filesOf(root, rel) {
  const abs = join(root, rel);
  const st = statSync(abs);
  if (st.isFile()) return [rel];
  const out = [];
  for (const name of readdirSync(abs).sort()) {
    const p = join(rel, name);
    if (statSync(join(root, p)).isDirectory()) out.push(...filesOf(root, p));
    else if (CODE.test(name)) out.push(p);
  }
  return out;
}

/** The source without its comments (line and block; strings kept as they are, roughly: enough for counting). */
export function withoutComments(src) {
  return String(src)
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:'"`\\])\/\/[^\n]*/g, '$1');
}

/** { rule: { file: count } } over the scope, files with no hit left out; and the totals by rule. */
export function countAll(root) {
  const files = SCOPE.flatMap((d) => filesOf(root, d)).filter((f) => !f.startsWith('src/reading'));
  const byRule = Object.fromEntries(Object.keys(RULES).map((k) => [k, {}]));
  for (const f of files) {
    const code = withoutComments(readFileSync(join(root, f), 'utf8'));
    for (const [k, re] of Object.entries(RULES)) {
      const n = (code.match(re) || []).length;
      if (n) byRule[k][relative(root, join(root, f))] = n;
    }
  }
  const totals = Object.fromEntries(Object.entries(byRule).map(([k, m]) => [k, Object.values(m).reduce((a, b) => a + b, 0)]));
  return { byRule, totals };
}
