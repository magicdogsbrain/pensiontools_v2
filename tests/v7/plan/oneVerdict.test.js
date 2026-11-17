/**
 * One verdict per plan, one figure per fact (7.12.0, round 3: lead decisions 3 and 5). Each expectation here is worked by
 * hand from the walkers' reports (s7120/walks2.md), not copied from the code's output.
 */
import { describe, it, expect } from 'vitest';
import { verdictOf } from '../../../src/answers/plan/lasts.js';
import { LASTS } from '../../../src/v7/copy/lasts.js';
import { oneAnswer, cutsSettingWords } from '../../../src/services/OneAnswer.js';

/** A stored Buckets-in-order result as a plan document keeps it: trimmed, with no count of cuts (fixture 04's shape). */
const storedBuckets = {
  affordable: true, strategyId: 'buckets-in-order', ruin: { mc: 1.7, hist: 0 }, n: { mc: 1000, hist: 705 },
  terminal: { p10: 200000, p50: 968682, p90: 2000000 }, worst12: { min: 24000, median: 30000 },
  signature: { protection: { enabled: true, cutPct: 20, limit: 3 } }
};
const P = { durationYears: 30, startAge: 63 };

describe('income cuts on a stored result that never counted them (walker 10 high 3, walker 4 medium)', () => {
  it('a Pots & Valves-family document with no count of cuts says they were not counted, never "none"', () => {
    const a = oneAnswer(storedBuckets, P);
    expect(a.cuts).toBe(null);
    const v = verdictOf({ a, strategyId: 'buckets-in-order', ran: { family: true, cutsOn: true, cutPct: 20, months: 3 }, history: null }, { endAge: 93 });
    const ids = v.rows.map((r) => r.id);
    expect(ids).not.toContain('cuts.bought');
    expect(ids).toContain('cuts.notCounted');
    const words = LASTS.rows['cuts.notCounted'];
    expect(words).toBeTypeOf('string');
    // by hand: the plan does cut (up to 20% after 3 months), so the line may not say "none"
    expect(words).not.toMatch(/\bnone\b/);
    expect(words).toMatch(/not counted/);
  });

  it('a bought way of drawing with no count of cuts still says it pays in full (that is true of it)', () => {
    const a = oneAnswer({ ...storedBuckets, strategyId: 'full-il-gilt' }, P);
    const v = verdictOf({ a, strategyId: 'full-il-gilt', ran: { family: false }, history: null }, { endAge: 93 });
    expect(v.rows.map((r) => r.id)).toContain('cuts.bought');
  });
});

describe('the cuts a stored result ran with (walker 6 high 6: "never cut" beside "the spending cuts you set")', () => {
  it('reads the run’s own record when the settings carried none (a plan document keeps no engine config)', () => {
    const off = cutsSettingWords(undefined, 'pots-and-valves', { signature: { protection: { enabled: false, cutPct: 20, limit: 3 } } });
    expect(off).toMatch(/switched off/i);
    expect(off).not.toMatch(/up to 20%/);
    const on = cutsSettingWords(undefined, 'buckets-in-order', { signature: { protection: { enabled: true, cutPct: 25, limit: 6 } } });
    // by hand: 25% after 6 months, from the run's record, never the 20% / 3 months default
    expect(on).toMatch(/up to 25% after 6 months/);
  });

  it('never tells someone the setting is "as you set it" (it may be the starting setting nobody chose)', () => {
    expect(cutsSettingWords({ disableProtection: true }, 'pots-and-valves')).not.toMatch(/as you set it/);
    expect(LASTS.rows['ran.cutsOff']).not.toMatch(/as you set it/);
  });
});
