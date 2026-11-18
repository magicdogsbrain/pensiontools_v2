/**
 * 7.12.0 round 3 (walker 4) — the full view's ladder page and Settings say the same thing about when the rungs are bought.
 * For a saver three years from stopping, the ladder page said "Every year of your income plan is bought today" while Settings
 * said "the rungs are bought at retirement". The page now says what is true at any age: every year is bought up front, when
 * the plan starts. (Read from the page script itself; its words are not in a module.)
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const html = readFileSync(join(process.cwd(), 'index.html'), 'utf8');
describe('when a ladder\'s rungs are bought, in the full view', () => {
  it('never "bought today" on the ladder page or its strategy intro', () => {
    expect(html).not.toContain('Every year of your income plan is bought today');
    expect(html).not.toContain('the steps you chose — is bought today');
    expect(html).toContain('Every year of your income plan is bought up front, when your plan starts.');
  });
  it('the order sheet names no platform (walker 7)', () => {
    expect(html).toContain('How to give the order (most platforms take either):');
    expect(html).not.toMatch(/How to give the order \([A-Z][\w ]+ and most platforms/);
  });
});

describe('a fall said once (walker 7: "is -2.6% below its all-time high")', () => {
  it('the index\'s distance below its high is said without a minus sign', () => {
    expect(html).not.toMatch(/[^(]dd\.toFixed\(1\) \+ '% below/);
    expect(html).not.toMatch(/[^s]\(mk\.drawdown \* 100\)\.toFixed\(1\) \+ '% below/);
    expect(html).toContain("Math.abs(dd).toFixed(1) + '% below its all-time high'");
  });
});
