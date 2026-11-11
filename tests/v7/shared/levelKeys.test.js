/**
 * 7.8.0 step 4a: the level keys. The figure an answer stands behind is read in one place, levels[level] (shared/levels.js
 * shownOf); the keys a level figure used to sit under are gone from every answer, so an old reader fails here rather than
 * read the wrong level quietly.
 *   - no source file reads `monthly.careful|middling|good`, `enough.nineInTen|threeInFour` or `at.nineInTen|threeInFour`
 *     (the whitelist: frozen readings and legacy document code — none in src today);
 *   - every answer of A to D carries level, levels and chance, the basis says what it was tested under, and none carries
 *     a deleted key;
 *   - shownOf reads the level chosen.
 * Fictional households only (Alex, Sam).
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve, join, relative } from 'node:path';
import { answerA } from '../../../src/answers/a/answer.js';
import { answerB } from '../../../src/answers/b/answer.js';
import { answerC } from '../../../src/answers/c/answer.js';
import { answerD } from '../../../src/answers/d/answer.js';
import { shownOf, LEVEL_IDS } from '../../../src/answers/shared/levels.js';

const ROOT = process.cwd();
const PATTERN = /monthly\.(careful|middling|good)|enough\.(nineInTen|threeInFour)|at\.(nineInTen|threeInFour)/;
/** Files allowed to hold the old keys: frozen readings and legacy document code (none in src today). */
const WHITELIST = new Set([]);

function files(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...files(p));
    else if (/\.(js|jsx|mjs)$/.test(name)) out.push(p);
  }
  return out;
}

describe('the old level keys are read nowhere', () => {
  it('no source file reads monthly.careful|middling|good, enough.nineInTen|threeInFour or at.nineInTen|threeInFour', () => {
    const hits = [];
    for (const f of [...files(resolve(ROOT, 'src')), resolve(ROOT, 'index.html')]) {
      const rel = relative(ROOT, f);
      if (WHITELIST.has(rel)) continue;
      readFileSync(f, 'utf8').split('\n').forEach((line, i) => { if (PATTERN.test(line)) hits.push(`${rel}:${i + 1}: ${line.trim().slice(0, 120)}`); });
    }
    expect(hits).toEqual([]);
  });
});

const ENV = { today: '2026-09-30', futures: 20, seed: 0 };
const ALEX_C = { you: { pot: 300000, age: 66 } };
const ALEX_D = { you: { age: 68, pot: 300000, taxFreeTaken: 'no' }, spend: { kind: 'amount', amount: 1800 } };
const ALEX_A = { you: { age: 55, pot: 250000, payIn: { kind: 'total', total: 500 } }, savings: 40000, stop: { kind: 'age', age: 60 }, spend: { kind: 'amount', amount: 1800 } };
const SAM_B = { you: { age: 45, pot: 90000, payIn: { kind: 'total', total: 400 } }, stop: { kind: 'age', age: 62 }, spend: { kind: 'amount', amount: 2200 } };
const CASES = { a: [answerA, ALEX_A], b: [answerB, SAM_B], c: [answerC, ALEX_C], d: [answerD, ALEX_D] };
const DELETED = ['monthly', 'yearly', 'lasted', 'runOutAge', 'lastedAt', 'runOutAgeAt', 'number'];

/** Every dotted key of a plain object (arrays by index), for the deleted-key scan. */
function keysOf(o, at = '', out = []) {
  if (!o || typeof o !== 'object') return out;
  for (const [k, v] of Object.entries(o)) { const p = at ? `${at}.${k}` : k; out.push(p); keysOf(v, p, out); }
  return out;
}

describe('every answer carries the levels and none of the deleted keys', () => {
  it.each(Object.keys(CASES))('%s', (q) => {
    const [answer, inputs] = CASES[q];
    const r = answer(inputs, ENV);
    expect(r.status).toBe('ok');
    expect(r.level).toBe('balanced');
    expect(Object.keys(r.levels)).toEqual(LEVEL_IDS);
    for (const id of LEVEL_IDS) expect(r.levels[id], id).toBeTruthy();
    expect(Object.keys(r.chance).sort()).toEqual(['fails', 'fixedAge', 'horizonRule', 'n', 'planToAge', 'weightToAge', 'weighted']);
    for (const k of ['level', 'levelFails20', 'planToAge', 'weightToAge', 'tablesVersion', 'sexUsed']) expect(r.basis, k).toHaveProperty(k);
    expect(r.basis).not.toHaveProperty('failuresAllowed');
    expect(r.basis).not.toHaveProperty('closeAllowed');
    // A: lasted / runOutAge are the verdict at the spend on a row and in the headline, not a level's; B's wholeLife too
    const top = q === 'a' || q === 'd' ? DELETED.filter((k) => !['lasted', 'runOutAge'].includes(k)) : DELETED;
    for (const k of top) expect(r, `${q}.${k}`).not.toHaveProperty(k);
    const keys = keysOf(r).filter((k) => !k.startsWith('inputs.') && !k.startsWith('sentences.') && !k.startsWith('trace.'));
    expect(keys.filter((k) => /(^|\.)(monthly|yearly|lastedAt|runOutAgeAt|shapeAt)\.(careful|middling|good)$/.test(k))).toEqual([]);
    expect(keys.filter((k) => /(nineInTen|threeInFour)/.test(k))).toEqual([]);
    expect(JSON.stringify(r)).not.toContain('undefined');
  });

  it('shownOf reads the level chosen, and Careful asks for no more than Balanced, Bold no less', () => {
    const r = answerC({ ...ALEX_C, confidence: 'careful' }, ENV);
    expect(r.level).toBe('careful');
    expect(shownOf(r)).toBe(r.levels.careful);
    expect(r.levels.careful.monthly).toBeLessThanOrEqual(r.levels.balanced.monthly);
    expect(r.levels.balanced.monthly).toBeLessThanOrEqual(r.levels.bold.monthly);
    const b = answerB(SAM_B, ENV);
    expect(b.levels.careful.pot).toBeGreaterThanOrEqual(b.levels.balanced.pot);
    expect(b.levels.balanced.pot).toBeGreaterThanOrEqual(b.levels.bold.pot);
  });

  it('a typed "9 in 10" or "3 in 4" still reads (Careful, Balanced)', () => {
    expect(answerC({ ...ALEX_C, confidence: 'nineInTen' }, ENV).level).toBe('careful');
    expect(answerC({ ...ALEX_C, confidence: 'threeInFour' }, ENV).level).toBe('balanced');
  });
});
