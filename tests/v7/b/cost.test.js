/**
 * What saying "what would be enough" costs (research/saving-enough-and-check-in.md 3.3, section 8 "Cost"; release step R1):
 * the 1,000-future answer for each B fixture no more than 25% slower than before R1.
 *
 * A machine's speed is taken out by measuring in units of one full count — verdictAt on the fixture's own stop plan at
 * today's pay-ins, one run per life — taken on the same machine in the same run. Before R1 each answer cost, in those
 * units, what BEFORE says (measured on our development machine, Node 24, 4 Nov 2026, the least of four runs, from main at
 * a6f1c27f); R1 adds, per chance stated, a full count at the figure and one at the step below, and the one-off sum's few.
 * Timings wobble when the machine is busy, so this runs with the nightly set only (NIGHTLY=1), on the least of four runs.
 * Two share-of-pay inputs sit beside the fixtures, so the grid search R1 adds is held to the budget too.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { answerB, SCHEMA_B } from './_b.js';
import { checkInputs } from '../../../src/answers/shared/validate.js';
import { toHousehold } from '../../../src/answers/b/toHousehold.js';
import { livesList } from '../../../src/answers/shared/lives.js';
import { stopAtPlan, createStopRunner, verdictAt } from '../../../src/answers/shared/stopAt.js';

const ENV = { today: '2026-09-30', futures: 1000, seed: 0, trace: false, detail: 'answer' };
/** The answer's cost before R1, in full counts. */
const BEFORE = { 'B1-my-number': 63.1, 'B2-coast': 33.5, 'B3-late-start': 65.5, 'B4-young': 74.4, 'B5-couple': 35.5,
  // shares of pay, where R1's search on the 0.5% grid runs (the five fixtures give pounds): measured the same way from
  // a6f1c27f's answer, the least of five runs
  'Sam share of pay': 58.9, 'Alex and Sam shares of pay': 70.4 };
/** Inputs that are not fixtures: Sam is the design note's row B (fictional), Alex and Sam a couple both giving a share. */
const INLINE = {
  'Sam share of pay': { household: 'single', you: { age: 41, pot: 62000, payIn: { kind: 'share', pay: 38000, ownPct: 6, employerPct: 4 } }, stop: { age: 63 }, spend: { kind: 'amount', amount: 1810 } },
  'Alex and Sam shares of pay': { household: 'couple', you: { age: 40, pot: 30000, payIn: { kind: 'share', pay: 52000, ownPct: 5, employerPct: 5 } },
    partner: { age: 38, pot: 20000, payIn: { kind: 'share', pay: 31000, ownPct: 4, employerPct: 3 } }, stop: { age: 62 }, spend: { kind: 'amount', amount: 3200 } }
};
const BUDGET = 1.25;

/** One full count on the fixture's own stop plan, in milliseconds. */
function oneCount(inputs) {
  const inp = checkInputs(SCHEMA_B, inputs, ENV).inputs;
  const { household } = toHousehold(inp, ENV);
  const younger = Math.min(inp.you.age, inp.partner ? inp.partner.age : Infinity);
  const sp = stopAtPlan(household, inp.stop.age, ENV, livesList(ENV.futures, inp.endAge - younger, ENV));
  const runner = createStopRunner(sp);
  const t = performance.now();
  verdictAt(sp, runner, (inp.spend.amount || 2000) * 12);
  return performance.now() - t;
}

describe.skipIf(!process.env.NIGHTLY)('what would be enough costs little: B\'s 1,000-future answer within 25% of its cost before R1', () => {
  it.each(Object.keys(BEFORE))('%s', (name) => {
    const inputs = INLINE[name] || JSON.parse(readFileSync(resolve(process.cwd(), `tests/v7/fixtures/b/${name}.json`), 'utf8')).inputs;
    let unit = Infinity;
    let answer = Infinity;
    for (let k = 0; k < 4; k++) {
      unit = Math.min(unit, oneCount(inputs));
      const t = performance.now();
      answerB(inputs, ENV);
      answer = Math.min(answer, performance.now() - t);
    }
    const now = answer / unit;
    expect(now, `${name}: ${now.toFixed(1)} full counts, ${BEFORE[name]} before R1`).toBeLessThanOrEqual(BEFORE[name] * BUDGET);
  }, 180_000);
});
