/**
 * The static ratchet (lead4.md G6): the banned direct uses in the views, outside the reading layer, may only go down.
 * Counted by tests/reading/staticRatchet.js against tests/reading/static-ratchet.json (the baseline, written at step G1).
 * A change that removes a use lowers its count in the JSON in the same commit; no change raises one.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { countAll, RULES, withoutComments } from './staticRatchet.js';

const ROOT = process.cwd();
const BASE = JSON.parse(readFileSync(join(ROOT, 'tests', 'reading', 'static-ratchet.json'), 'utf8'));
const NOW = countAll(ROOT);

describe('the static ratchet: banned direct uses only go down', () => {
  it.each(Object.keys(RULES))('%s: no file uses it more than the baseline, and the total is no higher', (rule) => {
    const was = BASE.byRule[rule] || {};
    for (const [file, n] of Object.entries(NOW.byRule[rule])) {
      expect(n, `${rule} in ${file}: ${was[file] || 0} in the baseline`).toBeLessThanOrEqual(was[file] || 0);
    }
    expect(NOW.totals[rule]).toBeLessThanOrEqual(BASE.totals[rule]);
  });

  it('the counter sees a use and ignores a comment', () => {
    const code = withoutComments("const a = grossToNet(x); // grossToNet(y)\n/* DEFAULT_TAX_BANDS */ document.getElementById('ssPA').value; g('acRecIsa')?.value;");
    expect((code.match(RULES.grossToNet) || []).length).toBe(1);
    expect((code.match(RULES.DEFAULT_TAX_BANDS) || []).length).toBe(0);
    expect((code.match(RULES.boxValue) || []).length).toBe(2);
    expect(("import { x } from '../../strategies/stressTest.js';".match(RULES.engineImport) || []).length).toBe(1);
  });
});
