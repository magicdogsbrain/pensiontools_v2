/**
 * The full view's ranking reads a locked ladder's own way from its plan document (7.12.0): the own way's result and plan are
 * the document's, never the live run's, and every other way is the live run's. Fictional results; the score is the test's own
 * (lasts × 10), so the figures are worked here: the document's own way lasts 1.0 → 10; the live run's 0.8 would give 8.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { rankedWays } from '../src/strategies/compareRunner.js';

const live = { 'full-il-gilt': { affordable: true, lasts: 0.8 }, 'pots-and-valves': { affordable: true, lasts: 0.9 }, 'floor-and-flex': { affordable: false } };
const docR = { affordable: true, lasts: 1.0 };
const score = (r, p) => ({ lasts: r.lasts * 10, potSeen: p.pot });

describe('a locked ladder\'s own way in the ranking', () => {
  it('is the document\'s, scored on the document\'s plan; the others are the live run\'s', () => {
    const rows = rankedWays(live, { pot: 500000 }, { id: 'full-il-gilt', r: docR, p: { pot: 480000 } }, score);
    const own = rows.find((x) => x.id === 'full-il-gilt');
    expect(own.sc).toEqual({ lasts: 10, potSeen: 480000 });
    expect(own.asLocked).toBe(true);
    expect(rows.find((x) => x.id === 'pots-and-valves').sc).toEqual({ lasts: 9, potSeen: 500000 });
    expect(rows.some((x) => x.id === 'floor-and-flex')).toBe(false);
  });
  it('with no locked own way, every way is the live run\'s', () => {
    expect(rankedWays(live, { pot: 500000 }, null, score).find((x) => x.id === 'full-il-gilt').sc.lasts).toBe(8);
  });
  it('the full view\'s ranking uses it, with the document of a locked plan', () => {
    const html = readFileSync('index.html', 'utf8');
    expect(html).toMatch(/const scored = rankedWays\(S, c\.p, lockedOwn, scoreStrategy\)/);
  });
});
