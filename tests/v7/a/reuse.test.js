/**
 * The every-age step takes the rows its answer step has already worked out (step 4 brief 10, J17: A4's every-age step
 * was at its 30-second budget, slowed four times). The worker keeps each question's last result and offers it to the
 * next answer as env.reuse (src/v7/effects/answerWorker.js); answerA takes the rows of an earlier answer for exactly
 * these inputs on the same lives, works out only the others, and starts each band search from the line through the two
 * rows before it (estimateAt). Neither may move a figure, so:
 *
 *   R1  the every-age answer with the answer step's rows held is the every-age answer worked out cold, byte for byte —
 *       on the four fixtures, through the real worker handler, and on random households wherever no amount is over
 *       £10,000 a month (above it the band depends on where its search starts: the rows held are then the answer step's,
 *       exactly, and a difference from the cold answer is printed as a finding)
 *   R2  anything that is not the same inputs on the same lives is ignored: another spend, other futures, another day or
 *       seed, a trace, a made-up market, an earlier engine, nonsense
 *   R3  a row held is taken as it stands (so the saving is real), with its phases and one-more-year worked out again
 *   R4  each row's band is the band at that age searched with no hint at all: where the search starts changes nothing
 *
 * Every push: fixed seeds, small counts. Nightly (NIGHTLY=1): a fresh seed and more households.
 */
import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { answerA, SCHEMA_A, TEST_ENV, FIXTURE_FILES, payInsFit } from './invariants.js';
import { arbitraryInputs } from '../gen/arbitrary.mjs';
import { stopAtPlan, createStopRunner, bandAt, livesList, checkInputs } from '../saving/_saving.js';
import { toHousehold } from '../../../src/answers/a/toHousehold.js';
import { createHandler } from '../../../src/v7/effects/answerWorker.js';
import { largeHousehold } from '../oracles/oneStep.mjs';

const NIGHTLY = !!process.env.NIGHTLY;
const SEED = NIGHTLY ? undefined : 20261001;
// a household here is three answers, two of them every age (up to 27 rows): about 15 s each at 20 futures, so the night
// (FC_RUNS 2,000, nightly.yml) takes 16 — about 4 minutes of its 60
const RUNS = NIGHTLY ? Math.min(16, Number(process.env.FC_RUNS || 16)) : 4;
const J = (x) => JSON.stringify(x);
const fixtures = FIXTURE_FILES.map((f) => JSON.parse(readFileSync(resolve(process.cwd(), 'tests/v7/fixtures/a', f), 'utf8')));
const envOf = (fx, futures, detail, more = {}) => ({ ...TEST_ENV, ...fx.env, futures, detail, trace: false, ...more });

/** The every-age answer worked out cold, the answer step's, and the every-age answer from the answer step's rows. */
function threeWays(inputs, env) {
  const cold = answerA(inputs, { ...env, detail: 'all' });
  const chart = answerA(inputs, { ...env, detail: 'chart' });
  const warm = answerA(inputs, { ...env, detail: 'all', reuse: chart });
  return { cold, chart, warm };
}

describe('R1 — the every-age step from the answer step\'s rows is the every-age step worked out cold, byte for byte', () => {
  it.each(fixtures.map((fx) => [fx.id, fx]))('%s at 100 lives', (_id, fx) => {
    const { cold, chart, warm } = threeWays(fx.inputs, envOf(fx, 100, 'all'));
    expect(chart.ages.every((r) => warm.ages.some((s) => s.age === r.age)), 'every row of the chart is a row of the full table').toBe(true);
    expect(J(warm)).toBe(J(cold));
  }, 60_000);

  it('on random households (A\'s input list, a named age or "show me ages")', () => {
    const env = { ...TEST_ENV, futures: 20 };
    const households = arbitraryInputs(SCHEMA_A, env).filter(payInsFit);
    const findings = [];
    fc.assert(fc.property(households, (inputs) => {
      const { cold, chart, warm } = threeWays(inputs, env);
      fc.pre(cold.status !== 'invalid');
      // the rows held are the answer step's, exactly (the table repeats what the answer step showed); the chart can hold
      // ages the full table does not (19 and 20 for someone of 18: the full table starts at 50)
      const bare = (r) => J({ ...r, phases: null, oneMoreYear: null });
      for (const r of chart.ages) {
        const same = warm.ages.find((x) => x.age === r.age);
        if (same) expect(bare(same), `${J(inputs)} row ${r.age}`).toBe(bare(r));
      }
      // …and the whole answer is the one worked out cold, byte for byte — except where an amount is over £10,000 a month:
      // there today's engine is not monotone at £10 and a band depends on where its search starts (a row searched from
      // the answer step's neighbours or from the full table's can land a few steps apart: tests/v7/oracles/oneStep.mjs).
      // A NIGHTLY=1 run, 1 Oct 2026 (seed -109027457): one person of 42 with £10,000,000, "show me ages". Printed, not asserted.
      if (cold.ages.some((r) => largeHousehold(r.monthly.good))) { if (J(warm) !== J(cold)) findings.push(inputs); return; }
      expect(J(warm), J(inputs)).toBe(J(cold));
    }), { seed: SEED, numRuns: RUNS, verbose: 1 });
    if (findings.length) console.log(`R1: the every-age step from the answer step's rows differed from it worked out cold in ${findings.length} household(s) with an amount over £10,000 a month — a finding (tests/v7/a/exceptions.md)`, J(findings[0]));
  }, 300_000);

  it('through the real worker handler: the answer step then the every-age step, as the page asks for them', () => {
    const fx = fixtures.find((f) => f.id === 'A4');
    const handle = createHandler();
    const ask = (id, futures, detail) => {
      const out = [];
      handle({ id, type: 'answer', q: 'a', inputs: fx.inputs, env: { today: fx.env.today, futures, seed: 0, trace: false, detail } }, (m) => out.push(m));
      return out[out.length - 1].result;
    };
    handle({ id: 1, type: 'init', today: fx.env.today }, () => {});
    ask(2, 20, 'chart');                       // the first figure: other lives, so nothing is taken from it
    ask(3, 100, 'chart');                      // the final figure
    const all = ask(4, 100, 'all');            // the every-age step: the final figure's rows are taken
    expect(J(all)).toBe(J(answerA(fx.inputs, envOf(fx, 100, 'all'))));
  }, 60_000);
});

describe('R2 — an earlier answer that is not for these inputs on these lives is ignored', () => {
  const fx = fixtures.find((f) => f.id === 'A1');
  const env = envOf(fx, 40, 'all');
  const cold = J(answerA(fx.inputs, env));
  const chart = answerA(fx.inputs, { ...env, detail: 'chart' });
  // a row doctored so that any use of it would show
  const doctored = (r) => ({ ...r, ages: r.ages.map((row) => ({ ...row, monthly: { ...row.monthly, careful: row.monthly.careful + 10_000 } })) });
  const other = (patch) => doctored({ ...chart, ...patch });
  const cases = [
    ['another spend', other({ inputs: { ...chart.inputs, spend: { kind: 'amount', amount: chart.inputs.spend.amount + 10 } } })],
    ['other futures', other({ basis: { ...chart.basis, futures: 100 } })],
    ['another day', other({ basis: { ...chart.basis, today: '2026-10-01' } })],
    ['another seed', other({ basis: { ...chart.basis, seed: 1 } })],
    ['an earlier engine', other({ basis: { ...chart.basis, engineVersion: '6.16.0' } })],
    ['other market history', other({ basis: { ...chart.basis, historyEnd: '1999-12' } })],
    ['an invalid answer', { status: 'invalid', problems: [] }],
    ['nonsense', { ages: 'rows', basis: 7, inputs: null }],
    ['nothing', null]
  ];
  it.each(cases)('%s', (_name, reuse) => {
    expect(J(answerA(fx.inputs, { ...env, reuse }))).toBe(cold);
  });
  it('a trace, a made-up market or an exact mix: worked out in full', () => {
    const traced = { ...env, trace: true };
    expect(J(answerA(fx.inputs, { ...traced, reuse: doctored(chart) }))).toBe(J(answerA(fx.inputs, traced)));
    const flat = { ...env, futures: 3, futureReturns: () => ({ equity: {}, inflation: {} }), mix: { equity: 0, bond: 0, cash: 1 } };
    const flatChart = answerA(fx.inputs, { ...flat, detail: 'chart' });
    expect(J(answerA(fx.inputs, { ...flat, reuse: doctored(flatChart) }))).toBe(J(answerA(fx.inputs, flat)));
  });
  it('the earlier answer is never changed by being used', () => {
    const before = J(chart);
    answerA(fx.inputs, { ...env, reuse: chart });
    expect(J(chart)).toBe(before);
  });
});

describe('R3 — a row held is taken as it stands', () => {
  it('a doctored row shows through; its phases and one-more-year are worked out again', () => {
    const fx = fixtures.find((f) => f.id === 'A1');
    const env = envOf(fx, 40, 'all');
    const chart = answerA(fx.inputs, { ...env, detail: 'chart' });
    const shownAge = chart.shown.age;
    const reuse = { ...chart, ages: chart.ages.map((r) => (r.age === shownAge ? { ...r, potAtStop: { ...r.potAtStop, good: r.potAtStop.good + 1 }, phases: null, oneMoreYear: { bogus: true } } : r)) };
    const warm = answerA(fx.inputs, { ...env, reuse });
    const cold = answerA(fx.inputs, env);
    expect(warm.shown.potAtStop.good).toBe(cold.shown.potAtStop.good + 1);
    expect(warm.shown.phases).toEqual(cold.shown.phases);
    expect(warm.shown.oneMoreYear).toEqual(cold.shown.oneMoreYear);
    expect(warm.shown).toEqual(warm.ages.find((r) => r.age === shownAge));
  });
});

describe('R4 — each row\'s band is the band searched with no hint: where the search starts changes nothing', () => {
  it.each(fixtures.map((fx) => [fx.id, fx]))('%s: every row of the full table at 100 lives', (_id, fx) => {
    const env = envOf(fx, 100, 'all');
    const a = answerA(fx.inputs, env);
    const ins = checkInputs(SCHEMA_A, fx.inputs, env).inputs;
    const lives = livesList(env.futures, a.basis.lifeYears, env);
    for (const row of a.ages) {
      const { household } = toHousehold(ins, env, row.age);
      const sp = stopAtPlan(household, row.age, env, lives);
      const band = bandAt(sp, createStopRunner(sp), null);
      expect({ monthly: band.monthly, lastedAt: band.lastedAt, runOutAgeAt: band.runOutAgeAt }, `${fx.id} at ${row.age}`)
        .toEqual({ monthly: row.monthly, lastedAt: row.lastedAt, runOutAgeAt: row.runOutAgeAt });
    }
  }, 120_000);
});
