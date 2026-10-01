/**
 * Question A's words, read from a result alone (step 4 brief 4.9; screens-A-B.md 7.2): the sentences, what was assumed
 * and the warnings are built from the hand-made result of the contract's shape (tests/v7/a/drawing-result.json,
 * the drawing of Screens 3.2 — P0's stub result, kept here as this test's fixture) and variations of it — so they are tested before, and apart from, the engine.
 *
 *  - every sentence is its parts joined, every key leads to a number of the result;
 *  - no banned word in any scope A is read in ('retired' too when the stop is today), and no countdown;
 *  - the verdict word follows the verdict; the count never contradicts it ("just under 9");
 *  - each optional sentence is there exactly when its block is.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { textsFor } from '../../../src/answers/a/sentences.js';
import { get, money, partsText } from '../../../src/answers/shared/format.js';
import { bannedHits } from '../render/checkScreen.js';
import { COUNTDOWN, scopesForA, allSentences } from './invariants.js';

const STUB = JSON.parse(readFileSync(resolve(process.cwd(), 'tests/v7/a/drawing-result.json'), 'utf8'));
const CTX = { usedDefault: ['you.statePension.kind', 'you.finalSalary.has', 'savingsIn', 'savingRisk', 'risk', 'charge', 'endAge', 'partTime.has'], fullStatePensionAYear: 12547.6, historyStartYear: 1871, madeUpFutures: false, capped: false };

/** A fresh copy of the stub with its words taken away, changed by `edit`, then given its words again. */
function made(edit = () => {}, ctx = CTX) {
  const r = JSON.parse(JSON.stringify(STUB));
  r.sentences = {}; r.assumed = []; r.warnings = [];
  edit(r);
  r.shown = r.ages.find((x) => x.age === r.shown.age) ? { ...r.ages.find((x) => x.age === r.shown.age), ...r.shown } : r.shown;
  r.ages = r.ages.map((x) => (x.age === r.shown.age ? r.shown : x));
  return textsFor(r, ctx);
}

function wordsAreClean(r) {
  const out = [];
  const all = allSentences(r);
  const context = all.map((s) => s.text).join(' ');
  for (const s of all) {
    if (partsText(s.parts, r) !== s.text) out.push(`${s.id}: text ≠ parts`);
    for (const p of s.parts) {
      if (p && p.key !== undefined && typeof get(r, p.key) !== 'number') out.push(`${s.id}: ${p.key} → ${get(r, p.key)}`);
      if (p && p.kind === 'money' && !s.text.includes(money(get(r, p.key)))) out.push(`${s.id}: ${p.key} not in the text`);
    }
    if (COUNTDOWN.test(s.text)) out.push(`${s.id}: countdown in "${s.text}"`);
    for (const hit of bannedHits(s.text, scopesForA(r.inputs), { context })) out.push(`${s.id}: ${hit}`);
  }
  return out;
}

describe('A — the words, from a result alone', () => {
  it('the drawing\'s result (close at 60): the headline, the sentence, the bad case, the pot, the chart, one more year', () => {
    const r = made();
    expect(wordsAreClean(r)).toEqual([]);
    expect(r.sentences.head).toMatchObject({ id: 'a.head.close', text: 'Close — stopping at 60 is tight' });
    expect(r.sentences.sub.text).toBe('spending £2,000 a month after tax from 60 until you are 95, going up each year with prices');
    expect(r.sentences.line.text).toBe('Stopping at 60 and spending £2,000 a month, your money lasted to 95 in only 8 futures out of 10.');
    expect(r.sentences.bad.text).toBe('In a bad case (the worst 1 in 10) it would run out at age 89. Stopping at 61 instead lasted in 9 futures out of 10.');
    expect(r.sentences.after.text).toBe('After it runs out at 89, you would have £1,046 a month from your State Pension.');
    expect(r.sentences.range.text).toBe('At 60 you could spend: careful £1,900, middling £2,300, good £2,650 a month.');
    expect(r.sentences.pot.text).toBe('By 60 your pension and savings could be about £480,000. In a bad case (the worst 1 in 10) it is £390,000, and in a good case (the best 1 in 10) £590,000.');
    expect(r.sentences.chart).toHaveLength(r.ages.length);
    expect(r.sentences.chart[0].text).toBe('At 58, you could spend about £1,650 a month; £2,000 a month lasted in only 5 futures out of 10.');
    expect(r.sentences.oneMore.text).toBe('Working until 61 instead of 60 buys about £150 a month more for life.');
    expect(r.sentences.oneMoreMoves.text).toBe('It moves £2,000 a month from lasting in 8 futures out of 10 to 9, and a bad case (the worst 1 in 10) from running out at 89 to lasting to 95.');
    expect(r.sentences.pays.map((s) => s.id)).toEqual(['a.pays.pots', 'a.pays.tax', 'a.pays.mixed']);
    expect(r.sentences.pays[2].text).toBe('From 67: £1,046 State Pension + £954 from your pot and savings.');
    expect(r.sentences.late).toBeUndefined();
    expect(r.sentences.partTime).toBeUndefined();
  });

  it('what was assumed: every default names its field, in a fixed order, C\'s start lines left out', () => {
    const r = made();
    const ids = r.assumed.map((a) => a.id);
    expect(ids).toEqual(['pay-in', 'pay-in-as-given', 'savings-in', 'risk-saving', 'saving-rebalanced', 'same-futures', 'stop-age', 'spend-steady', 'no-part-time',
      'state-pension-full', 'state-pension-age', 'quarter-tax-free', 'risk-drawing', 'charges', 'plan-to', 'todays-prices', 'no-final-salary', 'isa-fixed-growth', 'tax-rules', 'futures']);
    for (const a of r.assumed) if (a.source === 'default') expect(typeof a.field, a.id).toBe('string');
    expect(r.assumed.find((a) => a.id === 'pay-in').text).toBe('£600 a month goes into your pension until you stop at 60, going up with prices.');
    // 6.19.0: the one charge, taken while saving and while drawing, with Change (its field)
    expect(r.assumed.find((a) => a.id === 'charges')).toMatchObject({ field: 'charge', source: 'default', value: 0.5,
      text: 'Charges of 0.5% a year come off the money in funds and cash, while saving and while drawing; not off State Pension or final-salary pension.' });
    expect(r.warnings.map((w) => w.id)).toEqual(['state-pension-assumed']);
  });

  it('yes, no, and a count in 85–90% that reads "just under 9"', () => {
    const yes = made((r) => { r.shown.verdict = 'yes'; r.shown.lasted = 0.95; r.headline.verdict = 'yes'; r.shown.runOutAge = 95; });
    expect(wordsAreClean(yes)).toEqual([]);
    expect(yes.sentences.head.text).toBe('Yes — you could stop at 60');
    expect(yes.sentences.bad.id).toBe('a.bad.yes');
    expect(yes.sentences.after).toBeUndefined();
    const no = made((r) => { r.shown.verdict = 'no'; r.shown.lasted = 0.5; });
    expect(no.sentences.head.text).toBe('Not at 60 on these figures');
    const under = made((r) => { r.shown.lasted = 0.875; });
    expect(under.sentences.line.id).toBe('a.line.justUnder');
    expect(under.sentences.line.text).toContain('in just under 9 futures out of 10');
  });

  it('none of the ages shown worked: the late sentence and the not-in-range warning', () => {
    const r = made((x) => { x.earliest = { yes: null, close: null }; x.ages.forEach((a) => { a.verdict = 'no'; }); x.shown.verdict = 'no'; x.headline.verdict = 'no'; });
    expect(wordsAreClean(r)).toEqual([]);
    expect(r.sentences.late.id).toBe('a.late');
    expect(r.sentences.bad.text).toBe('In a bad case (the worst 1 in 10) it would run out at age 89.');
    expect(r.warnings.map((w) => w.id)).toContain('not-in-range');
  });

  it('"show me ages": the earliest age leads, and so do its sentences', () => {
    const r = made((x) => {
      x.inputs.stop = { kind: 'ages' }; x.stop = { kind: 'ages', age: 61 }; x.headline = { ...x.headline, kind: 'earliest', age: 61, verdict: 'yes', lasted: 0.9, runOutAge: 95 };
      x.shown = x.ages.find((a) => a.age === 61);
    });
    expect(wordsAreClean(r)).toEqual([]);
    expect(r.sentences.head.text).toBe('You could stop at 61 on these figures');
    expect(r.sentences.line.text).toBe('The earliest age at which £2,000 a month lasted to 95 in 9 futures out of 10 is 61. At 60 it lasted in only 8 futures out of 10.');
    expect(r.sentences.bad.text).toBe('In a bad case (the worst 1 in 10), stopping at 61 still lasts to 95. Stopping at 60 instead would run out at age 89.');
    expect(r.assumed.find((a) => a.id === 'stop-age').field).toBe('stop.kind');
  });

  it('a couple: "between you", "the younger of you", both stopping together, and the couple\'s yes', () => {
    const r = made((x) => {
      x.inputs.household = 'couple';
      x.inputs.partner = { age: 48, pot: 100000, payIn: { kind: 'total', total: 200 }, alreadyDrawing: false, statePension: { kind: 'full' }, finalSalary: { has: false } };
      x.whose = 'partner';
      x.pensionOpens.partner = 57;
      x.ages.forEach((a) => { a.ages.partner = a.age - 2; });
      x.shown.ages.partner = 58; x.shown.verdict = 'yes'; x.headline.verdict = 'yes'; x.shown.lasted = 0.9;
      x.saving.push({ ...x.saving[0], who: 'partner', payIn: { total: 200, own: null, employer: null, savings: 0 } });
    });
    expect(wordsAreClean(r)).toEqual([]);
    expect(r.sentences.head.text).toBe('Yes — you could both stop when you are 60 (your partner 58)');
    expect(r.sentences.sub.text).toContain('between you');
    expect(r.sentences.sub.text).toContain('until the younger of you is 95');
    const ids = r.assumed.map((a) => a.id);
    expect(ids).toContain('stop-together');
    expect(ids).toContain('both-alive');
    expect(ids).toContain('pay-in-partner');
  });

  it('stopping before the pension opens: the closed years, the savings they need, the warning and the line under what was assumed', () => {
    const r = made((x) => {
      x.pensionOpens.you = 57; x.gapYears = 2; x.shown.gapYears = 2; x.shown.age = 55; x.stop.age = 55; x.headline.age = 55; x.inputs.stop.age = 55;
      x.ages.forEach((a) => { if (a.age === 60) a.age = 55; });
      x.shown.yearsSaving = 5; x.saving[0].yearsSaving = 5;
      x.shown.phases = [
        { ...x.shown.phases[0], fromAge: 55, toAge: 57, ages: { you: { from: 55, to: 57 } }, fromPension: 0, fromSavings: 2000, tax: 0, pensionOpen: false, byPerson: [{ ...x.shown.phases[0].byPerson[0], fromPension: 0, fromSavings: 2000, tax: 0, locked: true }], shown: { takeHome: 2000, fromPots: 2000, statePension: 0, finalSalary: 0, fromWork: 0 } },
        { ...x.shown.phases[0], fromAge: 57, toAge: 67, ages: { you: { from: 57, to: 67 } } },
        x.shown.phases[1]
      ];
      x.savingsNeeded = { amount: 48000, untilAge: 57 };
      x.shown.runOutAge = 56;
    });
    expect(wordsAreClean(r)).toEqual([]);
    expect(r.sentences.pays[0]).toMatchObject({ id: 'a.pays.locked', text: "From 55 until 57: £2,000 a month, all from your savings. Your pension can't be touched until then." });
    expect(r.sentences.savingsNeeded.text).toBe('Your savings would need to be about £48,000 at 55 to cover the years from 55 to 57 on their own.');
    expect(r.sentences.pays.at(-1).id).toBe('a.pays.short');
    expect(r.warnings.map((w) => w.id)).toEqual(expect.arrayContaining(['pension-closed', 'savings-run-short']));
    expect(r.assumed.map((a) => a.id)).toContain('pension-closed-until');
  });

  it('part-time work: the line with it and without it, and one more year of it', () => {
    const r = made((x) => {
      x.inputs.partTime = { has: true, yearly: 12000, years: 3 };
      x.partTime = { yearly: 12000, years: 3, fromAge: 60, toAge: 63, lastedWith: 0.8, lastedWithout: 0.6, runOutWith: 89, runOutWithout: 84, without: { verdict: 'no', lasted: 0.6, runOutAge: 84, monthly: { careful: 1700 } }, oneMore: { years: 4, lasted: 0.9, runOutAge: 95 } };
    }, { ...CTX, usedDefault: CTX.usedDefault.filter((p) => p !== 'partTime.has') });
    expect(wordsAreClean(r)).toEqual([]);
    expect(r.sentences.partTime.text).toBe('That is with £12,000 a year from part-time work for 3 years after you stop (from 60 until 63), taxed as income. Without it, the money lasted in only 6 futures out of 10.');
    expect(r.sentences.partTimeOneMore.text).toBe('One more year of part-time work, until 64, moves £2,000 a month from lasting in 8 futures out of 10 to 9.');
    expect(r.assumed.map((a) => a.id)).toContain('work-tax');
    expect(r.assumed.map((a) => a.id)).not.toContain('no-part-time');
    const one = made((x) => {
      x.inputs.partTime = { has: true, yearly: 12000, years: 1 };
      x.partTime = { yearly: 12000, years: 1, fromAge: 60, toAge: 61, lastedWith: 0.8, lastedWithout: 0.8, runOutWith: 89, runOutWithout: 89, without: { verdict: 'close', lasted: 0.8, runOutAge: 89, monthly: { careful: 1900 } }, oneMore: { years: 2, lasted: 0.8, runOutAge: 89 } };
    });
    expect(one.sentences.partTime.text).toContain('for 1 year after you stop');
  });

  it('one more year that pays less (the next age\'s futures start in other markets: exceptions.md, M-A4) says so, never "very little"', () => {
    const r = made((x) => { x.shown.oneMoreYear = { ...x.shown.oneMoreYear, extraMonthly: -2150, sameish: false }; });
    expect(wordsAreClean(r)).toEqual([]);
    expect(r.sentences.oneMore).toMatchObject({ id: 'a.oneMore.less', text: 'Working until 61 instead of 60 does not add to what you could spend on these futures: it is about £2,150 a month less.' });
    const same = made((x) => { x.shown.oneMoreYear = { ...x.shown.oneMoreYear, extraMonthly: -20, sameish: true }; });
    expect(same.sentences.oneMore.id).toBe('a.oneMore.same');
  });

  it('the rise to 57 in April 2028 is noted only for someone it touches: not 55 by then, and stopping before 57', () => {
    const at = (age, stop) => made((x) => { x.inputs.you.age = age; x.shown.age = stop; x.shown.yearsSaving = stop - age; x.shown.ages = { you: stop }; x.saving[0].yearsSaving = stop - age; });
    const ids = (r) => r.warnings.map((w) => w.id);
    expect(ids(at(53, 55))).toContain('access-age-rises');            // 54 on 6 April 2028: waits until 57
    expect(ids(at(40, 52))).toContain('access-age-rises');
    expect(ids(at(54, 55))).not.toContain('access-age-rises');        // 55 before 6 April 2028
    expect(ids(at(56, 58))).not.toContain('access-age-rises');
    expect(ids(at(50, 57))).not.toContain('access-age-rises');        // stops at 57: the rise does not touch it
    expect(at(53, 55).warnings.find((w) => w.id === 'access-age-rises').text).toBe('The earliest age you can take money from a pension rises from 55 to 57 on 6 April 2028.');
  });

  it('savings: the 3% is before rising prices; when they are most of the money, an important note says the one figure matters most', () => {
    const r = made((x) => { x.shown.potAtStop = { ...x.shown.potAtStop, byPerson: [{ who: 'you', pension: 100000, savings: 300000 }] }; });
    expect(wordsAreClean(r)).toEqual([]);
    expect(r.assumed.find((a) => a.id === 'isa-fixed-growth').text).toBe('Once you have stopped, your savings are treated as ISA money: tax-free to take, growing at a fixed 3% a year before rising prices, so they lose ground whenever prices rise faster than that.');
    expect(r.warnings.find((w) => w.id === 'savings-fixed-growth')).toMatchObject({ severity: 'important' });
    expect(made().warnings.map((w) => w.id)).not.toContain('savings-fixed-growth');
  });

  it('the every-age table (detail "all"): a note for the ages before a pension opens and the ages left out; "Now:" names part-time work', () => {
    const r = made((x) => { x.basis.detail = 'all'; x.inputs.you.age = 45; x.ages = x.ages.map((row) => ({ ...row })); x.ages[0] = { ...x.ages[0], age: 50 }; });
    expect(r.sentences.agesNote.text).toMatch(/^Stopping before 57 means living on savings until a pension can be touched at 57[.:]/);
    expect(r.sentences.agesNote.text).toContain('Ages under 50 are left out, apart from your age today.');
    expect(made().sentences.agesNote).toBeUndefined();
    const pt = made((x) => {
      x.inputs.partTime = { has: true, yearly: 12000, years: 3 };
      x.partTime = { yearly: 12000, years: 3, fromAge: 60, toAge: 63, lastedWith: 0.8, lastedWithout: 0.6, runOutWith: 89, runOutWithout: 84, without: { verdict: 'no', lasted: 0.6, runOutAge: 84, monthly: { careful: 1700 } }, oneMore: { years: 4, lasted: 0.9, runOutAge: 95 } };
    });
    expect(pt.sentences.change.text).toMatch(/, with 3 years of part-time work\.$/);
    expect(made().sentences.change.text).not.toMatch(/part-time/);
  });

  it('stopping today: no pot growth, the pot as typed, and nothing a person who has stopped may not read', () => {
    const r = made((x) => {
      x.inputs.you.age = 60; x.shown.yearsSaving = 0; x.saving[0].yearsSaving = 0; x.shown.paidIn = { total: 0, byPerson: [{ who: 'you', amount: 0 }] };
      x.shown.potAtStop = { careful: 290000, middling: 290000, good: 290000, byPerson: [{ who: 'you', pension: 250000, savings: 40000 }] };
      x.shown.oneMoreYear = null;
    });
    expect(wordsAreClean(r)).toEqual([]);
    expect(scopesForA(r.inputs)).toContain('retired');
    expect(r.sentences.pot).toMatchObject({ id: 'a.pot.now', text: 'Your pension and savings come to £290,000 today.' });
    const ids = r.assumed.map((a) => a.id);
    for (const id of ['pay-in', 'nothing-paid-in', 'same-futures', 'risk-saving', 'charge-saving', 'savings-in']) expect(ids).not.toContain(id);
    // the charge is taken while drawing too, so it is said to someone who has stopped as well
    expect(ids).toContain('charges');
  });
});
