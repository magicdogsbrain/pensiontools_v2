/**
 * The Stress tester prints no fresh order sheet for a locked gilt ladder (7.12.0, the living-ladder brief step 8): where the
 * page shows the plan document's own ladder, the sheet is one line pointing to the plan document and to "Your plan's mix".
 * A what-if (a dial turned, another way tried) keeps its priced sheet under its "A what-if at today's prices" notice.
 *
 * The full view's inline script is not a module, so this reads it: giltOrderSheetHtml is taken out of index.html and run with
 * nothing else defined — the locked line must come before anything the sheet needs — and its two callers are read.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const html = readFileSync(join(process.cwd(), 'index.html'), 'utf8');
const LINE = 'Your ladder as locked, gilt by gilt, is in your plan document. What you hold of each gilt is on Your plan’s mix.';

function sheetFn() {
  const i = html.indexOf('    function giltOrderSheetHtml(plan, opts = {}) {');
  expect(i).toBeGreaterThan(0);
  const j = html.indexOf('\n    }\n', i);
  // eslint-disable-next-line no-new-func
  return new Function(html.slice(i, j + 6) + '\nreturn giltOrderSheetHtml;')();
}

describe('a locked ladder\'s sheet in the Stress tester is a pointer', () => {
  it('giltOrderSheetHtml, told the ladder is the locked one, prints the one line and no order sheet', () => {
    const out = sheetFn()({ cash: 1, cashYears: [], orders: [] }, { locked: true });
    expect(out).toContain(LINE);
    expect(out).not.toContain('Order sheet');
  });

  it('the full-ladder page passes it when it shows the document\'s ladder, and says no prices for a sheet it does not print', () => {
    expect(html).toContain("giltOrderSheetHtml(plan, { p, locked: fromDoc })");
    expect(html).not.toContain('This order sheet is the one in your plan document');
  });

  it('the result card passes it when the result is the document\'s (the one test\'s locked note is set)', () => {
    expect(html).toContain("giltOrderSheetHtml(r.plan, { p, locked: !!opts.docSheet })");
    expect(html).toContain("strategyResultCard(r, p, { docSheet: !!lockedNote })");
  });
});
