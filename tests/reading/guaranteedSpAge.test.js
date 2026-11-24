/**
 * The full view's "Guaranteed:" line marks the State Pension's age only where it says it (index.html, the strategy card and
 * its compact form). The line names every source that comes anyway, State Pension first (strategies/incomeAnyway.js); a
 * State Pension already being paid has no age, so a final-salary pension's "from age 63" after it is never marked as the
 * State Pension's age. Fictional figures only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { incomeAnywayWords } from '../../src/strategies/incomeAnyway.js';
import { markWithin } from '../../src/reading/mark.js';

const html = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8');
const finds = [...html.matchAll(/markWithin\(budEsc\(r\.guaranteedToAge\), \[\[\/(.+?)\/, 'statePension\.age'\]\]\)/g)].map((m) => new RegExp(m[1]));
const markedAges = (text, re) => [...markWithin(text, [[re, 'statePension.age']]).matchAll(/data-fact="statePension\.age"[^>]*>(\d+)</g)].map((m) => m[1]);

describe('the guaranteed line marks the State Pension age, and only that', () => {
  it('both places in the full view use the same find', () => {
    expect(finds.length).toBe(2);
    expect(finds[0].source).toBe(finds[1].source);
  });
  it('a State Pension still to come: its age is marked', () => {
    const words = incomeAnywayWords({ startAge: 60, yearsToStart: 0, spAnnual: 12000, spStartYear: 7, pnvCfg: { dbAmount: 6000, dbStartYear: 0 } });
    for (const re of finds) expect(markedAges(words, re)).toEqual(['67']);
  });
  it('a State Pension being paid, with a final-salary pension from 63: nothing is marked as the State Pension age', () => {
    const words = incomeAnywayWords({ startAge: 60, yearsToStart: 2, spAnnual: 12000, spPaidNow: true, pnvCfg: { dbAmount: 6000, dbStartYear: 3 } });
    expect(words).toContain('from age 63');
    for (const re of finds) expect(markedAges(words, re)).toEqual([]);
  });
});
