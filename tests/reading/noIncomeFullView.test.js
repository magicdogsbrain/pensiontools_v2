/**
 * A plan nobody gave an income (step F2's check round 3): the full view paints the simple view's "No income set yet" line
 * and the State Pension line under its State Pension boxes even when there is no shape to draw. The shape preview used to
 * return before it painted them, and the span the words go into was drawn only with a first step.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';

const src = readFileSync('index.html', 'utf8');
const at = src.indexOf('window.renderIncomeShapePreview = function');
const noShape = src.slice(at, src.indexOf('// Layers: State Pension', at));

describe('the full view with no income steps', () => {
  it('draws the first-step span and paints the plan\'s own lines (No income set yet, the State Pension)', () => {
    expect(noShape).toContain('No shape yet');
    expect(noShape).toMatch(/<span id="firstStepNote"><\/span>/);
    expect(noShape).toMatch(/paintFirstStepNote\(\)/);
    expect(noShape.indexOf('paintFirstStepNote()')).toBeLessThan(noShape.indexOf('\n        return;'));
  });
});
