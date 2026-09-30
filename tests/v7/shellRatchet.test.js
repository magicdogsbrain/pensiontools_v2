/**
 * The old shell only shrinks (research/v7/architecture.md, section 1 "Old shell"): index.html's inline script is
 * frozen to fixes from V7 step 3 on. New behaviour goes into V7 (src/v7/), not into this script.
 *
 * When a fix makes the script SHORTER, lower MAX_LINES to the new count in the same change.
 * If a fix truly must add lines, raise MAX_LINES in that change and say why in the commit — that is a decision,
 * and this test exists so that it is one.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const MAX_LINES = 10585;   // counted at v6.15.0, 30 Sep 2026

describe('index.html\'s inline script may only get shorter', () => {
  const html = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8');
  const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)].filter((m) => !/\bsrc=/.test(m[1]));

  it('there is still exactly one inline script', () => {
    expect(scripts.length).toBe(1);
  });
  it(`it has at most ${MAX_LINES} lines`, () => {
    const lines = scripts[0][2].split('\n').length;
    expect(lines).toBeLessThanOrEqual(MAX_LINES);
  });
});
