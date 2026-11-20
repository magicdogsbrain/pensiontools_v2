/**
 * The plan document's "5. Journey" (a dated record, lead4.md R4) names each stage with the three stage words both views use
 * (R7: Saving, Moving, Living on it; Closed for a plan kept to read), never an older placing's own label ("Running the
 * plan", "Approaching retirement"). Step F1's leftover.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { journeyStageWord, STAGE_WORDS } from '../../src/reading/labels.js';
import { planDocumentHtml } from '../../src/ui/components/PlanDocumentView.js';

describe('journeyStageWord', () => {
  it('the three keys of the reading and every stored placing read as one of the three words (or Closed)', () => {
    expect(journeyStageWord({ stage: 'saving' })).toBe('Saving');
    expect(journeyStageWord({ stage: 'committed-saving', label: 'Committed, still saving' })).toBe('Saving');
    expect(journeyStageWord({ stage: 'approaching', label: 'Approaching retirement' })).toBe('Moving');
    expect(journeyStageWord({ stage: 'moving' })).toBe('Moving');
    expect(journeyStageWord({ stage: 'running', label: 'Running the plan' })).toBe('Living on it');
    expect(journeyStageWord({ stage: 'bridge' })).toBe('Living on it');
    expect(journeyStageWord({ stage: 'draft-retired', label: 'Retired, designing the plan' })).toBe('Living on it');
    expect(journeyStageWord({ stage: 'drawing' })).toBe('Living on it');
    expect(journeyStageWord({ stage: 'closed', label: 'Closed — carried on in a new plan' })).toBe('Closed');
    expect(journeyStageWord({ stage: 'unknown', label: 'Getting started' })).toBe('');
    for (const s of ['saving', 'moving', 'drawing', 'running', 'approaching']) expect(STAGE_WORDS).toContain(journeyStageWord({ stage: s }));
  });
});

describe('the plan document draws them', () => {
  it('a journey of Pat\'s placings reads Saving, Moving, Living on it, each with its date', () => {
    const base = JSON.parse(readFileSync('tests/fixtures/plans/04-buckets-running.json', 'utf8')).planDocument;
    const doc = { ...base, journey: [
      { stage: 'saving', label: 'Saving', at: '2026-01-05T10:00:00Z' },
      { stage: 'approaching', label: 'Approaching retirement', at: '2026-06-05T10:00:00Z' },
      { stage: 'running', label: 'Running the plan', at: '2026-11-05T10:00:00Z' }] };
    const html = planDocumentHtml(doc, {});
    const at = html.indexOf('5. Journey');
    expect(at).toBeGreaterThan(-1);
    const part = html.slice(at, at + 1200);
    expect(part).toContain('Living on it');
    expect(part).toContain('Moving');
    expect(part).not.toContain('Running the plan');
    expect(part).not.toContain('Approaching retirement');
  });
});
