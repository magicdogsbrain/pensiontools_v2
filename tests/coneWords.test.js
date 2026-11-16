/**
 * The Stress tester's cone caption and its year labels (the walk: a ladder with no market risk read "Middle line = median of
 * 1 bootstrapped futures", and the last year label was cut off at the chart's right edge).
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { coneCaption } from '../src/ui/coneWords.js';

describe('the cone caption', () => {
  it('many futures: how many, and what the bands are', () => {
    expect(coneCaption(1000, 'Today’s money')).toBe('Middle line = median of 1,000 bootstrapped futures; dark band = the middle half; light band = 10th to 90th percentile. Today’s money.');
  });
  it('one path (no market risk): never "the median of 1 futures"', () => {
    for (const n of [1, 0, undefined]) {
      const t = coneCaption(n, 'Today’s money');
      expect(t).toBe('One fixed path (no market risk): the line is what you would have left each year. Today’s money.');
      expect(t).not.toMatch(/median|bootstrapped/);
    }
  });
  it('the page draws its caption from it', () => {
    const html = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8');
    expect(html).toContain('coneCaption(r.n && r.n.mc, r.wealthLabel)');
    expect(html).not.toContain("'Middle line = median of ' + r.n.mc");
  });
  it('the last year label ends at the chart\'s edge instead of being centred past it', () => {
    const html = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8');
    const ticks = html.split('\n').filter((l) => l.includes('>Year ${i}</text>'));
    expect(ticks.length).toBe(2);
    for (const l of ticks) expect(l).toContain("i === n - 1 ? 'end'");
  });
});
