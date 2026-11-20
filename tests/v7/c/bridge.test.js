/**
 * "What you could have a month" is read from the phases, in one place (answers/shared/spans.js). Before, the headline said
 * one flat figure "until you are 100" while what it was made of said "From 67: £1,046 State Pension", and a warning said the
 * pot was used up by 67 while "what is left" named a sum: four readers of one fact that disagreed.
 *
 * Fictional people: Pat (52, pot £45,000, pay £31,000, 4% + employer 3%, from 60) and Alex (57, pot £410,000, savings
 * £40,000, from 60), and Kim (68, pot £200,000, from now, already paid a State Pension).
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { answerC, SCHEMA_C } from './_c.js';
import { parseDraft } from '../../../src/answers/shared/validate.js';
import { currentKey } from '../../../src/v7/state/select.js';
import { draw } from '../render/checkScreen.js';
import { laterMore, bridgeOf } from '../../../src/answers/shared/spans.js';

const TODAY = '2026-09-30';
const ENV = { today: TODAY, futures: 100, seed: 0, trace: false };
const text = (v) => Object.fromEntries(Object.entries(v).map(([k, x]) => [k, String(x)]));
const PAT = { household: 'single', 'you.age': 52, 'you.pot': 45000, 'you.payIn.has': 'yes', 'you.payIn.kind': 'share', 'you.payIn.pay': 31000, 'you.payIn.ownPct': 4, 'you.payIn.employerPct': 3, 'start.kind': 'age', 'start.age': 60 };
const ALEX = { household: 'single', 'you.age': 57, 'you.pot': 410000, savings: 40000, 'start.kind': 'age', 'start.age': 60 };
const KIM = { household: 'single', 'you.age': 68, 'you.pot': 200000, 'start.kind': 'now' };

function answerOf(values) {
  const parsed = parseDraft(SCHEMA_C, text(values), { today: TODAY });
  expect(parsed.ok).toBe(true);
  return answerC(parsed.inputs, ENV);
}
const pounds = (n) => '£' + Math.round(n).toLocaleString('en-GB');
// the full State Pension, 2026/27: £241.30 a week; a month is 52 weeks ÷ 12
const SP_MONTH = pounds((241.30 * 52) / 12);   // 1,045.63 → "£1,046"

describe('C reads the phases for what you have a month', () => {
  it('Pat: the amount is said until 67, then the State Pension, which is more', () => {
    expect(SP_MONTH).toBe('£1,046');
    const r = answerOf(PAT);
    expect(r.status).toBe('ok');
    expect(r.basis.weighted).toBe(true);
    const s = r.sentences;
    const monthly = r.levels[r.level].monthly;
    expect(monthly).toBeLessThan(1045.63);
    expect(s.sub.text).toContain('until 67');
    expect(s.sub.text).toContain(`From 67: ${SP_MONTH} a month`);
    for (const k of ['head', 'sub', 'line', 'bridge']) expect(s[k].text).not.toContain('until you are 100');
    expect(s.line.text).toContain(`until 67, then ${SP_MONTH} a month from your State Pension`);
    // the bridge: 67 − 60 = 7 years of the answer's own amount, 7 × 12 = 84 months, to the nearest £1,000
    const total = pounds(Math.round((monthly * 84) / 1000) * 1000);
    expect(s.bridge.text).toBe(`From 60 to 67 all of it comes from your pot: 7 years, about ${total} at today's prices. From 67 your State Pension is more than ${pounds(monthly)} a month, so nothing more is taken from your pot.`);
    // "what is left" names a sum, so no warning says the pot is used up
    expect(s.left.text).toMatch(/what is typically left then is £[\d,]+/);
    expect(r.warnings.map((w) => w.id)).not.toContain('pot-used-before-state-pension');
  });

  it('Alex: the State Pension is less than the amount, so it runs to the plan-to age; the bridge says 7 years', () => {
    const r = answerOf(ALEX);
    const s = r.sentences;
    expect(s.sub.text).toContain('until you are 100');
    expect(s.bridge.text).toMatch(/^From 60 to 67 all of it comes from your pot and savings: 7 years, about £[\d,]+,000 at today's prices\. From 67 your State Pension pays £1,046 of it\.$/);
  });

  it('Pat (60, a final-salary pension from 63): the bridge ends where the final-salary pension starts, not at the State Pension', () => {
    // from now, £200,000 in a pension, £20,000 of savings, a final-salary pension of £9,000 a year (£750 a month) from 63.
    // Before, the bridge ran to the State Pension at 67 — 7 years of the first stretch's draw — though from 63 the
    // final-salary pension pays £750 of each month: about £30,000 too high at a draw of £1,850 a month (4 × 12 × £750 =
    // £36,000 counted that the pots do not pay). Now 60 to 63, and the months the kept plan pays from the pots alone: its
    // year 0 is October 2026 to March 2027 and September's own, 7 months, then run years 1 and 2, 24: 31 months of the
    // first stretch's draw, "2 years and 7 months" (36 months before step P2's fix round, a whole year 0).
    const r = answerOf({ household: 'single', 'you.age': 60, 'you.pot': 200000, savings: 20000, 'you.finalSalary.has': 'yes', 'you.finalSalary.yearly': 9000, 'you.finalSalary.fromAge': 63, 'start.kind': 'now' });
    const first = r.phases[0];
    expect([first.fromAge, first.toAge, first.finalSalary, first.statePension, first.months]).toEqual([60, 63, 0, 0, 31]);
    const total = pounds(Math.round((first.shown.fromPots * 31) / 1000) * 1000);
    expect(r.sentences.bridge.text).toBe(`From 60 to 63 all of it comes from your pot and savings: 2 years and 7 months, about ${total} at today's prices. From 63 your final-salary pension pays £750 of it.`);
  });

  it('Kim: money from now with a State Pension already paid has no bridge', () => {
    const r = answerOf(KIM);
    expect(r.sentences.bridge).toBeUndefined();
    expect(r.sentences.sub.text).toMatch(/until you are \d+, going up each year with prices$/);
  });

  it('the screen draws the bridge under the line', () => {
    const s = JSON.parse(readFileSync(join(process.cwd(), 'tests/v7/states/c/answer-F1.json'), 'utf8'));
    s.draft.c.values = text(PAT);
    const parsed = parseDraft(SCHEMA_C, s.draft.c.values, s.env);
    expect(parsed.ok).toBe(true);
    s.answers.c.result = answerC(parsed.inputs, { ...ENV, today: s.env.today });
    s.answers.c.inputsKey = currentKey(s, 'c');
    s.answers.c.status = 'final';
    const { root } = draw(s);
    const bridge = root.querySelector('[data-testid="answer.bridge"]');
    expect(bridge).not.toBeNull();
    expect(bridge.textContent).toContain('all of it comes from your pot');
  });
});

describe('spans.js', () => {
  const ph = (fromAge, takeHome, fromPots, statePension) => ({ fromAge, statePension, finalSalary: 0, shown: { takeHome, fromPots, statePension, finalSalary: 0 } });
  it('laterMore: only a later stretch £1 or more above the amount', () => {
    expect(laterMore([ph(60, 700, 700, 0), ph(67, 1046, 0, 1045.63)], 700)).toEqual({ index: 1, takeHome: 1046 });
    expect(laterMore([ph(60, 700, 700, 0), ph(67, 700.5, 0, 700.5)], 700)).toBeNull();
    expect(laterMore([ph(60, 1950, 1950, 0), ph(67, 1950, 904, 1045.63)], 1950)).toBeNull();
  });
  it('bridgeOf: 7 years of £700 is 7 × 12 × 700 = £58,800 → £59,000', () => {
    expect(bridgeOf([ph(60, 700, 700, 0), ph(67, 1046, 0, 1045.63)])).toEqual({ toIndex: 1, years: 7, extraMonths: 0, months: 84, total: 59000 });
    expect(bridgeOf([ph(68, 1660, 614, 1045.63)])).toBeNull();
  });
  it('bridgeOf: a final-salary pension before the State Pension ends the bridge — 3 years of £1,900 is 3 × 12 × 1,900 = £68,400 → £68,000', () => {
    const fs = { fromAge: 63, statePension: 0, finalSalary: 750, shown: { takeHome: 1900, fromPots: 1150, statePension: 0, finalSalary: 750 } };
    expect(bridgeOf([ph(60, 1900, 1900, 0), fs, ph(67, 1900, 104, 1045.63)])).toEqual({ toIndex: 1, years: 3, extraMonths: 0, months: 36, total: 68000 });
  });
});
