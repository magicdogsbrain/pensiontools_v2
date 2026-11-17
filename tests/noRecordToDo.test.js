/**
 * Listing what you hold is never said as a to-do (7.12.0, the moving brief S4/S6): a plan with totals only is told it does
 * not need to.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';

const FILES = ['index.html', 'src/ui/components/PlanDocumentView.js', 'src/ui/monthlyEntry.js'];
describe('no "Record what you hold" to-do in the full view', () => {
  for (const f of FILES) it(f, () => {
    const t = readFileSync(f, 'utf8');
    expect(t).not.toContain('Record what you hold');
  });
});
