/**
 * Byte-faithful extractor for the golden-master characterization of the LIVE decision
 * engine. Slices calcDecisionPWA + its four pure helpers out of index.html and injects
 * the four storage/SP reads as `deps`, changing nothing else. Exports the transform so
 * a test can assert the committed module stays in sync with the live inline code.
 *
 * CLI:  node scripts/extract_decision.mjs        # (re)writes tests/golden/legacyDecisionEngine.js
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

function slice(html, startMarker, endMarker) {
  const s = html.indexOf(startMarker);
  if (s < 0) throw new Error('start marker not found: ' + startMarker);
  const e = html.indexOf(endMarker, s);
  if (e < 0) throw new Error('end marker not found: ' + endMarker);
  return html.slice(s, e);
}

/** Produce the characterization module source from index.html contents. */
export function extractDecisionModule(html) {
  const helpers = slice(html, '// Get tax year from date string', '// Calculate decision (PWA logic)').trimEnd();
  let fn = slice(html, 'async function calcDecisionPWA(dateStr, equity, bond, cash) {', '// Decision form handler').trimEnd();

  fn = fn
    .replace('async function calcDecisionPWA(dateStr, equity, bond, cash) {',
             'export async function calcDecisionPWA(dateStr, equity, bond, cash, deps) {')
    .replace(/const settings = await getDecisionSettingsAsync\(\);/, 'const settings = deps.settings;')
    .replace(/const history = await getHistoryAsync\(\);/, 'const history = deps.history;')
    .replace(/const allTaxYears = await getAllTaxYearsAsync\(\);/, 'const allTaxYears = deps.allTaxYears;')
    .replace(/const spInfo = await getStatePensionForTaxYear\(taxYear\);/, 'const spInfo = deps.spInfo;');

  // Guards: exactly the 5 documented substitutions, no residual storage calls.
  for (const [needle, want] of [
    ['export async function calcDecisionPWA', 1],
    ['deps.settings', 1], ['deps.history', 1], ['deps.allTaxYears', 1], ['deps.spInfo', 1]
  ]) {
    const n = fn.split(needle).length - 1;
    if (n !== want) throw new Error(`expected ${want} of "${needle}", got ${n}`);
  }
  for (const bad of ['getDecisionSettingsAsync', 'getHistoryAsync(', 'getAllTaxYearsAsync', 'getStatePensionForTaxYear']) {
    if (fn.includes(bad)) throw new Error('residual storage call remains: ' + bad);
  }

  const helperExports = helpers
    .replace('function getTaxYearFromDate', 'export function getTaxYearFromDate')
    .replace('function getYearNum', 'export function getYearNum')
    .replace('function calcGlidepathMin', 'export function calcGlidepathMin')
    .replace('function grossToNetIncome', 'export function grossToNetIncome');

  return `/**
 * GOLDEN-MASTER CHARACTERIZATION — DO NOT EDIT BY HAND.
 *
 * Byte-faithful extraction of the LIVE inline decision engine (calcDecisionPWA and its
 * four pure helpers) from index.html, produced by scripts/extract_decision.mjs. The only
 * changes vs the inline source are: (1) the function is exported and takes a \`deps\`
 * argument; (2) the four storage/SP reads
 *   getDecisionSettingsAsync / getHistoryAsync / getAllTaxYearsAsync / getStatePensionForTaxYear
 * are replaced by deps.settings / deps.history / deps.allTaxYears / deps.spInfo.
 * Everything else is identical, so this pins the CURRENT live behaviour (bugs included).
 * The live app is untouched. Regenerate if index.html's calcDecisionPWA changes.
 */

${helperExports}

${fn}
`;
}

// CLI entry
if (import.meta.url === `file://${process.argv[1]}`) {
  const root = join(dirname(fileURLToPath(import.meta.url)), '..');
  const html = readFileSync(join(root, 'index.html'), 'utf8');
  const out = extractDecisionModule(html);
  mkdirSync(join(root, 'tests/golden'), { recursive: true });
  writeFileSync(join(root, 'tests/golden/legacyDecisionEngine.js'), out);
  console.log('OK — wrote tests/golden/legacyDecisionEngine.js');
}
