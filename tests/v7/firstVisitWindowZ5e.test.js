/**
 * Ruling Z5e: the figures a person types before keeping a plan are kept per window (effects/draftStore.js: sessionStorage),
 * so the first-visit pages say "in this window", never "in this browser".
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { A } from '../../src/v7/copy/a.js';
import { B } from '../../src/v7/copy/b.js';
import { C } from '../../src/v7/copy/c.js';
import { D } from '../../src/v7/copy/d.js';

describe('where a guest\'s figures stay', () => {
  it('each question says "in this window"', () => {
    const all = [A, B, C, D].map((q) => JSON.stringify(q));
    for (const s of all) {
      expect(s).not.toMatch(/stay in this browser/);
      expect(s).toMatch(/stay in this window until you choose to (save|keep) them as a plan/);
    }
  });
  it('they are kept per window', () => {
    expect(readFileSync('src/v7/effects/draftStore.js', 'utf8')).toMatch(/win\.sessionStorage/);
  });
});
