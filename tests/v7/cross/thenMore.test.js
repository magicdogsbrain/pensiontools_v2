/**
 * A and B say what comes in anyway when it is more than the could-spend figure (answers/shared/spans.js thenMoreParts):
 * "From 67 your State Pension is £1,046 a month, more than that." Before, both said one flat figure with no "then", though
 * the answer held the take-home once the State Pension starts.
 *
 * Fictional people: Pat (52, pot £45,000, pay £31,000, 4% + employer 3%, wants £2,608 a month from 60) and Alex (57, pot
 * £410,000, savings £40,000, wants £2,000 a month from 60).
 */
import { describe, it, expect } from 'vitest';
import { answerA, SCHEMA_A } from '../a/_a.js';
import { answerB, SCHEMA_B } from '../b/_b.js';
import { parseDraft } from '../../../src/answers/shared/validate.js';

const TODAY = '2026-09-30';
const ENV = { today: TODAY, futures: 100, seed: 0, trace: false };
const text = (v) => Object.fromEntries(Object.entries(v).map(([k, x]) => [k, String(x)]));
const PAT = { household: 'single', 'you.age': 52, 'you.pot': 45000, 'you.payIn.kind': 'share', 'you.payIn.pay': 31000, 'you.payIn.ownPct': 4, 'you.payIn.employerPct': 3, 'spend.kind': 'amount', 'spend.amount': 2608 };
const ALEX = { household: 'single', 'you.age': 57, 'you.pot': 410000, savings: 40000, 'spend.kind': 'amount', 'spend.amount': 2000 };
// the full State Pension, 2026/27: £241.30 a week × 52 ÷ 12 = £1,045.63 → "£1,046"
const SP = (241.30 * 52) / 12;
const SP_WORDS = '£' + Math.round(SP).toLocaleString('en-GB');

function run(schema, fn, values) {
  const parsed = parseDraft(schema, text(values), { today: TODAY });
  expect(parsed.ok).toBe(true);
  return fn(parsed.inputs, ENV);
}
const A = (v) => run(SCHEMA_A, answerA, { ...v, 'stop.kind': 'age', 'stop.age': 60 });
const B = (v) => run(SCHEMA_B, answerB, { ...v, 'stop.age': 60 });

describe('"From 67 … more than that" in A and B', () => {
  it('A, Pat: the Balanced amount at 60 is less than the State Pension, so it is said', () => {
    const r = A(PAT);
    const could = r.shown.levels[r.level].monthly;
    expect(SP > could + 1).toBe(true);
    expect(r.sentences.rangeThen.text).toBe(`From 67 your State Pension is ${SP_WORDS} a month, more than the Balanced amount.`);
  });

  it('B, Pat: what could be spent paying in as now is less, so it is said', () => {
    const r = B(PAT);
    expect(SP > r.income.bad + 1).toBe(true);
    expect(r.sentences.incomeThen.text).toBe(`From 67 your State Pension is ${SP_WORDS} a month, more than that.`);
  });

  it('Alex: the could-spend figure is more than the State Pension, so neither says it', () => {
    const a = A(ALEX);
    expect(a.shown.levels[a.level].monthly).toBeGreaterThan(SP);
    expect(a.sentences.rangeThen).toBeUndefined();
    const b = B({ ...ALEX, 'you.payIn.kind': 'total', 'you.payIn.total': 0 });
    expect(b.income.bad).toBeGreaterThan(SP);
    expect(b.sentences.incomeThen).toBeUndefined();
  });
});
