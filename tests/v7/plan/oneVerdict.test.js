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

// ---- one chance for a plan still saving (walker 10 high 2, walker 1 high 2, walker 2 highs 1 and 2) ----------------------
import { verdictBlockView, chanceVerdictOf, chanceOptsOf } from '../../../src/ui/oneAnswerView.js';
import { lifeOfSettings } from '../../../src/answers/plan/life.js';
import { startSummaryHtml } from '../../../src/ui/startingPotsWords.js';

const LIFE = lifeOfSettings({ currentAge: 60, currentAgeAsOf: '2026-05-01' }, new Date(2026, 10, 17, 12), { startAge: 60 });
const PS = { startAge: 60, durationYears: 35, spAnnual: 11973, spStartYear: 8, pot: 743920 };
/** A made-up run from the middling pot at the stop: 1 of 20 futures failed, at run years 20 on (more than 19 in 20, weighted). */
const run = (() => {
  const survivedMc = Array.from({ length: 20 }, (_, i) => i >= 1);
  return { strategyId: 'pots-and-valves', affordable: true, ruin: { mc: 5, hist: 0 }, n: { mc: 20, hist: 705 }, coverage: 99.7, worst12: { min: 25082, median: 28992 },
    terminal: { p10: 0, p50: 1047000, p90: 4158000 }, failAges: [], survivedMc, futuresMc: { headYear: survivedMc.map((ok, i) => (ok ? null : 20 + i)), failYear: [] } };
})();

describe('the full view leads a saving plan with the saving chance', () => {
  // by hand: the saver run (question B) gives 0.85 = 17 in 20; Balanced asks for 18 in 20 (fails 2 of 20), close is 17
  const o = { life: LIFE, level: 'balanced', savingChance: 0.85 };
  it('the title, the hero and the tone say Close, 17 times in 20 — never On course, more than 19', () => {
    const html = verdictBlockView(run, PS, o);
    expect(html).toContain('Will your money last? — Close at Balanced');
    expect(html).toContain('17 times in 20');
    expect(html).not.toContain('more than 19 times in 20');
    expect(html).toContain('verdict-warning');
    expect(chanceVerdictOf(run, PS, o)).toBe('close');
  });
  it('says everything under it starts from the middling pension when work stops (£743,920), and puts no second figure beside the chance', () => {
    const html = verdictBlockView(run, PS, o).replace(/<[^>]+>/g, ' ');
    expect(html).toContain('Everything below starts from £743,920 in your pension when you stop work');
    expect(html).not.toContain('worst 12 months lived');
  });
  it('without a saving chance the block is the run\'s own, as before', () => {
    expect(verdictBlockView(run, PS, { life: LIFE, level: 'balanced' })).not.toContain('Everything below starts from');
  });
  it('another way of drawing on the same plan is judged for the same person at the same level (never the block before 7.8.0)', () => {
    const oneTest = { r: run, chance: { life: LIFE, level: 'balanced' } };
    const other = { ...run, strategyId: 'buckets-in-order' };
    expect(chanceOptsOf(other, {}, oneTest)).toEqual({ life: LIFE, level: 'balanced' });
    expect(verdictBlockView(other, PS, chanceOptsOf(other, {}, oneTest))).not.toMatch(/Likely to last|Very likely to last/);
  });
});

describe('the simple view\'s "Does it last?" labels what is not the saving chance', () => {
  it('a saving chance in the headline puts the from-the-stop line under it, with the pot', async () => {
    const { oneAnswer } = await import('../../../src/services/OneAnswer.js');
    const a = oneAnswer(run, PS, { life: LIFE, level: 'balanced' });
    const v = verdictOf({ strategyId: 'pots-and-valves', a, ran: { family: true, cutsOn: true, cutPct: 20, months: 3 } }, { endAge: 95, atStop: 743920 }, { chance: 0.85 });
    expect(v.verdict).toBe('close');
    expect(v.slots.words).toContain('17 times in 20');
    expect(v.sub.id).toBe('lasts.subFromStop');
    expect(v.sub.slots.pot).toBe('£743,920');
    expect(LASTS.verdict['lasts.subFromStop']).toContain('{pot}');
  });
  it('the lead no longer claims to be what every screen of the full view shows', () => {
    expect(LASTS.lead).not.toMatch(/every screen of the full view/);
  });
});

describe('the kept answer\'s chance is not said beside a saving plan\'s own (walker 1 high 2: "(2%)" never refreshed)', () => {
  it('a plan still saving: no "made from a quick answer, where the money lasted …"; a plan already drawing keeps it', async () => {
    const { seedToScenario } = await import('../../../src/services/PlanSeed.js');
    const { seedA, seedCNow } = await import('../../integration/fixtures/planSeeds.js');
    const saving = seedToScenario(seedA(), new Date(2026, 9, 1, 15)).yours;
    expect(saving.stressTool.settings.retired).toBe(false);
    expect(startSummaryHtml(saving.stressTool.settings, { fromAnswer: saving.fromAnswer })).not.toMatch(/made from a quick answer/);
    const drawing = seedToScenario(seedCNow(), new Date(2026, 9, 1, 15)).yours;
    expect(startSummaryHtml({ ...drawing.stressTool.settings, spWeeklyAmount: 241.3, spStartDate: '2031-10-01' }, { fromAnswer: drawing.fromAnswer })).toMatch(/made from a quick answer/);
  });
});
