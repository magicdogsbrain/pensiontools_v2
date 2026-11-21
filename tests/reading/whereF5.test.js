/**
 * Step F5 (lead4.md D17): "Where you are" has ONE gatherer (PlanReading.whereAmIFor) for both views: the full view's plan
 * document page, its Decision strip and its Accumulation strip read the plan through it, never through the page's own
 * repositories, ladder cache or clock.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';

const html = readFileSync('index.html', 'utf8');

describe('where you are: one gatherer, both views', () => {
  it('the full view\'s whereAmINow is whereAmIFor on the plan and the one clock', () => {
    const f = html.slice(html.indexOf('async function whereAmINow('), html.indexOf('window.renderPlanDocumentPage = async function'));
    expect(f).toContain('whereAmIFor(sc, { now: todayOf() })');
    for (const w of ['getHistoryAsync(', 'ladderPositionForPlan(', 'getActiveAccumulationHistory(', 'getActiveHoldings(', 'planReadDay(']) expect(f, w).not.toContain(w);
  });
  it('no other place in the full view gathers its own "where you are"', () => {
    expect(html).not.toMatch(/\bwhereAmI\(/);
    expect(html.match(/whereAmINow\(\)/g).length).toBeGreaterThanOrEqual(4);
  });
  it('the simple view reads the same gatherer', () => {
    const read = readFileSync('src/answers/plan/read.js', 'utf8');
    expect(read).toMatch(/whereAmIFor\(/);
  });
});
