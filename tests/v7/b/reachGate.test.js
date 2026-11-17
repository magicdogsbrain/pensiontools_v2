/**
 * No pay-in past the reach of paying in is ever offered or kept (7.12.0, lead decision 9; the second walk: "132.3% of your
 * pay", "Keep: paying in £5,820 a month"). Fictional people only.
 *
 *  - The reach rule knows the pay of someone who gives pounds when the plan holds it (the plan's salary): their own part,
 *    with the tax added back, is no more than all of their pay.
 *  - Every card that offers or keeps "what would be enough" reads the one rule: the rail, the keep and "Use" choice, the
 *    seed kept "at what would be enough", and the plan home's share-of-pay line.
 */
import { describe, it, expect } from 'vitest';
import { reachOf } from '../../../src/answers/b/enough.js';
import { atEnough } from '../../../src/answers/keep/planSeed.js';
import { saverBlockOf } from '../../../src/v7/state/saverBlock.js';
import { keepPayInOf } from '../../../src/v7/state/select.js';
import { railAnswerB } from '../../../src/v7/rail/index.js';

describe('the reach rule reads the pay of a pounds payer when the plan holds it', () => {
  // Sam, 61: £375 going in from Sam with the tax added back and £200 from the employer, £575 a month in all; pay £38,000
  // a year, £3,166.67 a month. To stop at 62 the answer finds £4,190 a month going in: Sam's own part 4,190 − 200 = 3,990,
  // more than 3,166.67 — out of reach, whatever the allowance (3,990 + 200 = 4,190 is under 60,000 ÷ 12 = 5,000).
  const inp = { you: { payIn: { kind: 'split', own: 375, employer: 200 } } };
  const base = { onCourse: false, enough: { atLevel: { payIn: 4190 } }, needed: 4190, levers: {}, inp, whos: ['you'], savers: [true], now: 575 };
  it('without the pay: within the allowance, so within reach (as before)', () => {
    expect(reachOf(base).payIn).toBe(true);
  });
  it('with the plan\'s pay: the own part past all of the pay is out of reach', () => {
    expect(reachOf({ ...base, salary: 38000 }).payIn).toBe(false);
  });
  it('a pay-in whose own part fits the pay is still within reach: £3,000 going in is 2,800 of Sam\'s own, under 3,166.67', () => {
    expect(reachOf({ ...base, enough: { atLevel: { payIn: 3000 } }, needed: 3000, salary: 38000 }).payIn).toBe(true);
  });
});

describe('a figure past the reach is never offered or kept', () => {
  // Jo, 58: £5,820 a month would be enough, more than 60,000 ÷ 12 = 5,000 a month: the answer says paying in more cannot
  // get there (result.reach.payIn false), so nothing offers £5,820
  const past = {
    status: 'ok', inputs: { household: 'single', you: { age: 58, payIn: { kind: 'split', own: 400, employer: 200 } } },
    stop: { age: 63 }, verdict: { band: 'no' }, onCourse: false, reach: { payIn: false, lump: true, moreRisk: true, ways: {} },
    enough: { how: 'pounds', savingsOnly: false, atLevel: { payIn: 5820, savingsIn: null, parts: [{ who: 'you', payIn: 5820, own: 5620, employer: 200 }] } },
    saving: [{ who: 'you', yearsSaving: 5 }], payIn: { now: 600 }, sentences: {}
  };
  it('the keep and "Use" choice offers only paying in as now', () => {
    expect(keepPayInOf('b', past)).toBe(null);
  });
  it('the seed "at what would be enough" is not made', () => {
    expect(atEnough(past)).toBe(null);
  });
  it('the rail never says "About £5,820 a month in"', () => {
    const r = railAnswerB(past);
    expect(JSON.stringify(r || {})).not.toContain('enough.atLevel');
  });
  it('the plan home never says the share of pay it would be', () => {
    const verdict = { ok: true, notes: { aimMonthly: '£2,200', stopAge: 63 }, now: { line: { id: 'pounds', slots: {} }, salary: 30000, total: 600 } };
    const b = saverBlockOf(verdict, { status: 'done', result: past });
    expect(b.lines.map((l) => l.id)).not.toContain('enoughShare');
  });
  it('within reach, each still offers it (the same figures, reach.payIn true)', () => {
    const within = { ...past, reach: { ...past.reach, payIn: true } };
    expect(keepPayInOf('b', within)).toEqual({ how: 'pounds', savingsOnly: false, savingsIn: null });
    expect(JSON.stringify(railAnswerB(within))).toContain('enough.atLevel.payIn');
    const verdict = { ok: true, notes: { aimMonthly: '£2,200', stopAge: 63 }, now: { line: { id: 'pounds', slots: {} }, salary: 30000, total: 600 } };
    expect(saverBlockOf(verdict, { status: 'done', result: within }).lines.map((l) => l.id)).toContain('enoughShare');
  });
});
