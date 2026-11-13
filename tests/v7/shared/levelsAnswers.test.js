/**
 * 7.8.0 step 4b: the levels wired through A, B, C and D, held two ways (spec section 10, "Rollback and machinery
 * equivalence"):
 *   - the rollback (SUCCESS.weighted false, the shipped state): every figure at Balanced, and every verdict, is the
 *     careful figure and verdict before 7.8.0 — the count at floor(n/10), legacyVerdictOf — and Careful and Bold are the
 *     counts at floor(n/20) and floor(6n/20);
 *   - the weighted path (env.weighted true) with a table where nobody dies (env.lifeTable), the end age 95 and the weighting
 *     age 95: every weight is one whole future, so solveLevels, the weighted verdict, B's weighted pot and its weighted
 *     pay-in give the same figures as the rollback, through the weighted machinery.
 * And the order: Careful asks for no more a month than Balanced, nor Balanced than Bold; the pots the other way.
 * Fictional households only (Alex, Sam).
 */
import { describe, it, expect } from 'vitest';
import { answerA } from '../../../src/answers/a/answer.js';
import { answerB } from '../../../src/answers/b/answer.js';
import { answerC } from '../../../src/answers/c/answer.js';
import { answerD } from '../../../src/answers/d/answer.js';
import { SUCCESS, legacyVerdictOf, LEVEL_FAILS20 } from '../../../src/answers/shared/rules.js';

const ENV = { today: '2026-09-30', futures: 40, seed: 0 };
/** Nobody dies: every weight one whole future. */
const IMMORTAL = { scale: 1e7, firstBirthYear: 1960, lastBirthYear: 1960, ageTo: 200, tablesVersion: 'test-immortal', m: { 1960: [18, 0] }, f: { 1960: [18, 0] } };
const ON = { ...ENV, weighted: true, lifeTable: IMMORTAL, weightToAge: 95 };
/** The rollback: not weighing (SUCCESS.weighted false), per answer. */
const OFF = { ...ENV, weighted: false };

const ALEX_C = { you: { pot: 320000, age: 66 }, endAge: 95 };
const SAM_C = { household: 'couple', you: { pot: 240000, age: 64 }, partner: { age: 61, pot: 90000 }, endAge: 95 };
const ALEX_D = { you: { age: 68, pot: 300000, taxFreeTaken: 'no' }, spend: { kind: 'amount', amount: 1700 }, endAge: 95 };
const ALEX_A = { you: { age: 55, pot: 250000, payIn: { kind: 'total', total: 500 } }, savings: 30000, stop: { kind: 'age', age: 60 }, spend: { kind: 'amount', amount: 1700 }, endAge: 95 };
const SAM_B = { you: { age: 45, pot: 90000, payIn: { kind: 'total', total: 400 } }, stop: { kind: 'age', age: 62 }, spend: { kind: 'amount', amount: 2000 }, endAge: 95 };

const monthly = (r) => ['careful', 'balanced', 'bold'].map((k) => r.levels[k].monthly);

// 7.8.0: the shipped state weighs (SUCCESS.weighted true); the rollback is one switch away, each answer's env.weighted false
describe('the rollback, one switch away (env.weighted false)', () => {
  it('SUCCESS.weighted is true: the shipped state weighs', () => {
    expect(SUCCESS.weighted).toBe(true);
  });

  it('C: Balanced is the careful amount (fixed-age within floor(n/10)), Careful within floor(n/20), Bold within floor(6n/20); weighted = fixed-age', () => {
    for (const inputs of [ALEX_C, SAM_C]) {
      const r = answerC(inputs, OFF);
      const n = r.basis.futures;
      for (const k of ['careful', 'balanced', 'bold']) {
        expect(Math.round((1 - r.levels[k].fixedAge) * n), k).toBeLessThanOrEqual(Math.floor((LEVEL_FAILS20[k] * n) / 20));
        expect(r.levels[k].weighted, k).toBe(r.levels[k].fixedAge);
      }
      const [c, b, x] = monthly(r);
      expect(c).toBeLessThanOrEqual(b);
      expect(b).toBeLessThanOrEqual(x);
    }
  });

  it('D and A: the verdict at the spend is legacyVerdictOf on the count', () => {
    const d = answerD(ALEX_D, OFF);
    expect(d.verdict).toBe(legacyVerdictOf(d.fails, d.basis.futures));
    const a = answerA(ALEX_A, OFF);
    for (const row of a.ages) expect(row.verdict, `row ${row.age}`).toBe(legacyVerdictOf(Math.round((1 - row.lasted) * a.basis.futures), a.basis.futures));
  });

  it('B: the pots at each level in order; the pay-in is Balanced\'s; on course is the count within floor(n/10)', () => {
    const r = answerB(SAM_B, OFF);
    expect(r.levels.careful.pot).toBeGreaterThanOrEqual(r.levels.balanced.pot);
    expect(r.levels.balanced.pot).toBeGreaterThanOrEqual(r.levels.bold.pot);
    expect(r.payIn.needed).toBe(r.levels.balanced.payIn);
    expect(r.onCourse).toBe(r.chance.fails <= Math.floor(r.basis.futures / 10));
  });
});

describe('the weighted path with nobody dying gives the rollback\'s figures (spec section 10)', () => {
  it.each([['Alex', ALEX_C], ['Sam and a partner', SAM_C]])('C, %s: the same three amounts and chances', (_n, inputs) => {
    const off = answerC(inputs, OFF);
    const on = answerC(inputs, ON);
    expect(monthly(on)).toEqual(monthly(off));
    for (const k of ['careful', 'balanced', 'bold']) expect(on.levels[k].fixedAge, k).toBe(off.levels[k].fixedAge);
    expect(on.chance.weighted).toBe(on.chance.fixedAge);
    expect(on.basis.tablesVersion).toBe('test-immortal');
  });

  // (a yes is the same yes; "close" is one twentieth past the level when weighing, where the count before 7.8.0 said 3 in 4)
  const yes = (v) => v === 'yes';
  it('D: the same amounts, the same yes at the spend', () => {
    const off = answerD(ALEX_D, OFF);
    const on = answerD(ALEX_D, ON);
    expect(monthly(on)).toEqual(monthly(off));
    expect(yes(on.verdict)).toBe(yes(off.verdict));
    expect(on.fails).toBe(off.fails);
  });

  it('A: the same rows, amounts and verdicts, and the same stop age at each level', () => {
    const off = answerA(ALEX_A, OFF);
    const on = answerA(ALEX_A, ON);
    expect(on.ages.map((r) => [r.age, yes(r.verdict), ...monthly(r)])).toEqual(off.ages.map((r) => [r.age, yes(r.verdict), ...monthly(r)]));
    expect(on.levels).toEqual(off.levels);
  });

  it('B: the same pots at each level, the same pay-in that gets there, the same verdict', () => {
    const off = answerB(SAM_B, OFF);
    const on = answerB(SAM_B, ON);
    for (const k of ['careful', 'balanced', 'bold']) expect(on.levels[k].pot, k).toBe(off.levels[k].pot);
    expect(on.payIn.needed).toBe(off.payIn.needed);
    expect(yes(on.verdict.band)).toBe(yes(off.verdict.band));
    expect(on.onCourse).toBe(off.onCourse);
  });
});

describe('the weighted path on the ONS tables (the shipped state)', () => {
  const W = { ...ENV, weighted: true };
  it('C, D, A and B answer; every level\'s weighted chance is at least its fixed-age count; the levels in order', () => {
    // (the end age left to its default, the plan-to age: a typed end age below it lets a future that runs out after the
    // end age count as lasting to it while it still weighs, so only the default rule keeps weighted ≥ fixed-age)
    const own = (x) => { const { endAge, ...rest } = x; return rest; };
    for (const [answer, inputs] of [[answerC, own(ALEX_C)], [answerC, own(SAM_C)], [answerD, own(ALEX_D)], [answerA, own(ALEX_A)]]) {
      const r = answer(inputs, W);
      expect(r.status).toBe('ok');
      const L = r.levels.careful.monthly !== undefined ? r.levels : r.shown.levels;
      for (const k of ['careful', 'balanced', 'bold']) expect(L[k].weighted + 1e-12, k).toBeGreaterThanOrEqual(L[k].fixedAge);
      expect(L.careful.monthly).toBeLessThanOrEqual(L.balanced.monthly);
      expect(L.balanced.monthly).toBeLessThanOrEqual(L.bold.monthly);
      expect(r.basis.tablesVersion).toBe('ons-ew-2024-cohort/1');
      expect(r.chance.weighted + 1e-12).toBeGreaterThanOrEqual(r.chance.fixedAge);
    }
    const b = answerB(own(SAM_B), W);
    expect(b.levels.careful.pot).toBeGreaterThanOrEqual(b.levels.balanced.pot);
    expect(b.levels.balanced.pot).toBeGreaterThanOrEqual(b.levels.bold.pot);
    expect(b.payIn.needed).toBe(b.levels.balanced.payIn);
  });

  it('runs go up to 60 years while weighing (RULES.maxDrawYears), 45 in the rollback', async () => {
    const { drawYearsCap, RULES } = await import('../../../src/answers/shared/rules.js');
    expect(drawYearsCap({ weighted: true })).toBe(RULES.maxDrawYears);
    expect(RULES.maxDrawYears).toBe(60);
    expect(drawYearsCap({ weighted: false })).toBe(RULES.maxYears);
    expect(drawYearsCap(null)).toBe(RULES.maxDrawYears);   // (no env: the shipped state, weighing)
    // a young household asking for a long plan: 45 years in the rollback, more while weighing
    const young = { you: { age: 50, pot: 600000, taxFreeTaken: 'no' }, spend: { kind: 'amount', amount: 1500 }, endAge: 100 };
    expect(answerD(young, OFF).basis.years).toBe(45);
    // while weighing the run goes on past the end age to the weighting age (1 in 50 still alive), at most 60 years
    const w = answerD(young, W);
    expect(w.basis.weightToAge).toBeGreaterThan(100);
    expect(w.basis.lifeYears).toBe(Math.min(60, w.basis.weightToAge - 50));
    expect(w.basis.years).toBe(50);
    expect(w.basis.endAge).toBe(100);
  });
});
