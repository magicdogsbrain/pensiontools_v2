/**
 * Step F5, pass 3 (lead4.md R2): every write the full view makes straight to the store (FirestoreService.saveScenario, past
 * ScenarioRepository's cached plan) drops that cache with the write, and a write that changes what the plan says (the
 * household split written into both plans, and its undo) repaints every tab from the plan as written — never the boxes
 * of the plan as it was.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';

const html = readFileSync('index.html', 'utf8');
const repaint = readFileSync('src/ui/repaintPlan.js', 'utf8');

describe('direct writes from the full view', () => {
  it('every direct write drops the plan cache in the same step', () => {
    const lines = html.split('\n');
    const at = lines.map((l, i) => [l, i]).filter(([l]) => /await saveScenarioDoc\(|saveScenario: saveScenarioDoc/.test(l));
    expect(at.length).toBeGreaterThanOrEqual(3);
    for (const [l, i] of at) {
      const near = lines.slice(i, i + 3).join('\n');
      expect(near, 'index.html:' + (i + 1)).toMatch(/invalidateScenarioCache\(\)/);
    }
  });
  it('the household split, written or undone, repaints every tab from the plan as written', () => {
    const body = html.slice(html.indexOf('window.useHouseholdSplit = async function'), html.indexOf('window.keepHouseholdAsIs'));
    expect(body).toMatch(/done\.mode === 'write'\) \{[^\n]*\n\s*await repaintPlan\('split'\)/);
    expect(body).toMatch(/await done\.undo\(\); invalidateScenarioCache\(\); [^\n]*await repaintPlan\('split'\)/);
  });
  it('a split stays on the page it was asked on (the same plan, like a lock)', () => {
    expect(repaint).toMatch(/const SAME_PLAN = \[[^\]]*'split'/);
  });
});
