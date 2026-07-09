/**
 * Guardrail: the committed characterization module MUST equal the mechanical extraction
 * of the CURRENT index.html. If someone edits the live calcDecisionPWA without
 * regenerating (`node scripts/extract_decision.mjs`) and re-reviewing fixtures, this
 * fails — so the golden master can never silently drift from the live code.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { extractDecisionModule } from '../../scripts/extract_decision.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const html = readFileSync(join(root, 'index.html'), 'utf8');
const committed = readFileSync(join(root, 'tests/golden/legacyDecisionEngine.js'), 'utf8');

describe('golden-master faithfulness', () => {
  it('committed module == mechanical extraction of current index.html', () => {
    expect(committed).toBe(extractDecisionModule(html));
  });

  it('extracted function has balanced braces (slice captured the whole function)', () => {
    const fn = committed.slice(committed.indexOf('export async function calcDecisionPWA'));
    const opens = (fn.match(/{/g) || []).length;
    const closes = (fn.match(/}/g) || []).length;
    expect(opens).toBe(closes);
  });

  it('all four pure helpers are present', () => {
    for (const h of ['getTaxYearFromDate', 'getYearNum', 'calcGlidepathMin', 'grossToNetIncome']) {
      expect(committed).toContain(`export function ${h}`);
    }
  });

  it('extractor guards hold: exactly one substitution per read, no residual storage call', () => {
    // extractDecisionModule() throws unless it substitutes exactly one of each of the
    // four reads within the calcDecisionPWA slice and leaves no residual storage call.
    expect(() => extractDecisionModule(html)).not.toThrow();
  });
});
