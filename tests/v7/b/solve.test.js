/**
 * The pay-in that gets there and the ways to make it fit (step 4 brief 4.8 steps 4–8, with section 10's J9). ONE TEST:
 * every figure is "the money lasted to the end age in the whole life — the saving years and the drawing years — in 9
 * lives out of 10". Each figure is worked out again by asking B again with the one thing it changes, and must agree
 * exactly: the lives are one market (a life is the same whatever the stop age, brief 4.4), so a second answer is the
 * same arithmetic on the same numbers. (A, C and B against each other: tests/v7/cross/oneTest.test.js.)
 */
import { describe, it, expect } from 'vitest';
import { TEST_ENV, answerB, checkAnswerB } from './invariants.js';
import { RULES, SAVING } from '../../../src/answers/shared/rules.js';
import { stopAtPlan, verdictAtPot } from '../../../src/answers/shared/stopAt.js';
import { toHousehold } from '../../../src/answers/b/toHousehold.js';

const ENV = { ...TEST_ENV, futures: 40, trace: true };
const ok = (a, given) => { const f = checkAnswerB(a, given); expect(f, f.join('\n')).toEqual([]); return a; };

const CASES = {
  'short at 60': { you: { age: 50, pot: 120000, payIn: { kind: 'split', own: 450, employer: 250 } }, stop: { age: 60 }, spend: { amount: 2000 } },
  'a young saver, adventurous while saving': { you: { age: 35, pot: 40000, payIn: { total: 400 } }, stop: { age: 65 }, spend: { amount: 2000 }, savingRisk: 'adventurous' },
  'late start, cautious': { you: { age: 58, pot: 90000, payIn: { total: 300 } }, stop: { age: 65 }, spend: { amount: 1800 }, savingRisk: 'cautious', risk: 'cautious' },
  'a couple': { household: 'couple', you: { age: 52, pot: 200000, payIn: { total: 600 } }, partner: { age: 50, pot: 80000, payIn: { total: 300 } }, stop: { age: 60 }, spend: { kind: 'level', level: 'moderate' } },
  'three in four': { you: { age: 48, pot: 350000, payIn: { total: 900 } }, stop: { age: 60 }, spend: { amount: 2500 }, confidence: 'threeInFour' },
  // stopping before the pension opens (the numbers review's cases): the savings and the pension are one life
  'closed until 57, some savings': { you: { age: 47, pot: 150000, payIn: { total: 800 } }, savings: 30000, stop: { age: 55 }, spend: { amount: 1800 } },
  'closed until 57, no savings': { you: { age: 47, pot: 400000, payIn: { total: 2500 } }, stop: { age: 55 }, spend: { amount: 1800 } }
};
const answers = Object.fromEntries(Object.entries(CASES).map(([name, given]) => [name, answerB(given, ENV)]));
const copy = (v) => JSON.parse(JSON.stringify(v));
const withChange = (given, change) => ({ ...copy(given), ...change });

/** The inputs with a household pay-in into the pension, split between the people as now (the answer's own arithmetic). */
function withPayIn(given, answer, total) {
  const out = copy(given);
  const people = answer.saving;
  const now = answer.payIn.now;
  people.forEach((p, j) => {
    const mine = total === now ? p.payIn.total : total * (now > 0 ? p.payIn.total / now : 1 / people.length);
    out[p.who].payIn = { kind: 'total', total: mine };
  });
  return out;
}

describe('B — the pay-in that gets there is the one test', () => {
  it.each(Object.keys(CASES))('%s: every rule holds', (name) => {
    ok(answers[name], CASES[name]);
  });

  it.each(Object.keys(CASES))('%s: paying in what is needed (with the savings the closed years need) is on course; £10 less into the pension is not', (name) => {
    const a = answers[name];
    const need = a.payIn.at.nineInTen;
    if (need === null) { expect(a.status).toBe('out-of-reach'); return; }
    const savingsIn = a.payIn.outside !== null && a.payIn.outside > (a.payIn.savingsNow || 0) ? a.payIn.outside : a.inputs.savingsIn;
    const at = ok(answerB({ ...withPayIn(CASES[name], a, need), savingsIn }, { ...ENV, trace: false }));
    expect(at.onCourse, `${name}: at ${need}`).toBe(true);
    expect(at.chance.fails).toBeLessThanOrEqual(a.basis.failuresAllowed);
    if (need > 0) {
      const less = answerB({ ...withPayIn(CASES[name], a, need - 10), savingsIn }, { ...ENV, trace: false });
      expect(less.onCourse, `${name}: at ${need - 10}`).toBe(false);
    }
  });

  it.each(Object.keys(CASES))('%s: 3 in 4 is B asked at 3 in 4, and never more than 9 in 10', (name) => {
    const a = answers[name];
    const other = a.inputs.confidence === 'nineInTen' ? 'threeInFour' : 'nineInTen';
    const b = answerB(withChange(CASES[name], { confidence: other }), { ...ENV, trace: false });
    expect(b.payIn.at).toEqual(a.payIn.at);
    expect(b.payIn.needed).toBe(b.payIn.at[other]);
    if (a.payIn.at.nineInTen !== null) expect(a.payIn.at.threeInFour).toBeLessThanOrEqual(a.payIn.at.nineInTen);
  });
});

describe('B — the ways to make it fit: each applied, and B asked again, gives its own figures', () => {
  const short = Object.keys(CASES).filter((k) => !answers[k].onCourse && answers[k].status !== 'guaranteed-only');

  it('at least four of the cases are short, so the levers are tested', () => {
    expect(short.length).toBeGreaterThanOrEqual(4);
  });

  it.each(short)('%s: stop later is the first later age at which today\'s pay-in is on course — every age before it is not', (name) => {
    const a = answers[name];
    const lever = a.levers.stopLater;
    const at = (age) => answerB(withChange(CASES[name], { stop: { age } }), { ...ENV, trace: false });
    const until = lever ? lever.age : RULES.stopAgeMax + 1;
    for (let age = a.stop.age + 1; age < until; age++) {
      const later = at(age);
      if (later.status === 'invalid') break;
      expect(later.onCourse, `age ${age}`).toBe(false);
    }
    if (lever) {
      const later = ok(at(lever.age));
      expect(later.onCourse).toBe(true);
      expect(later.chance.lasted).toBe(lever.lasted);
    } else {
      expect(a.sentences.lever.stopLaterNone.text).toContain(String(a.basis.laterTo));
    }
  });

  it.each(short)('%s: pay in more — both figures applied — is on course, and lasted as the lever says', (name) => {
    const a = answers[name];
    const lever = a.levers.payMore;
    if (!lever) { expect(a.payIn.needed === null || (a.payIn.needed <= a.payIn.now && !(a.payIn.outside > a.payIn.savingsNow))).toBe(true); return; }
    const given = { ...withPayIn(CASES[name], a, lever.payIn), ...(lever.savingsIn !== null ? { savingsIn: lever.savingsIn } : {}) };
    const at = ok(answerB(given, { ...ENV, trace: false }));
    expect(at.chance.lasted).toBe(lever.lasted);
    if (a.inputs.confidence === 'nineInTen') expect(at.onCourse).toBe(true);
  });

  it.each(short)('%s: spend less is the careful amount paying in as now: asked again it is on course, £10 more is not', (name) => {
    const a = answers[name];
    const lever = a.levers.spendLess;
    if (!lever) { expect(a.monthlyIfShort === 0 || a.monthlyIfShort >= a.spend.perMonth).toBe(true); return; }
    expect(lever.spend).toBe(a.monthlyIfShort);
    const at = ok(answerB(withChange(CASES[name], { spend: { kind: 'amount', amount: lever.spend } }), { ...ENV, trace: false }));
    expect(at.onCourse).toBe(true);
    expect(at.chance.lasted).toBe(lever.lasted);
    const more = answerB(withChange(CASES[name], { spend: { kind: 'amount', amount: lever.spend + 10 } }), { ...ENV, trace: false });
    expect(more.onCourse).toBe(false);
  });

  it.each(short)('%s: more risk while saving is B again one level up — its pay-in and its count', (name) => {
    const a = answers[name];
    const lever = a.levers.moreRisk;
    if (a.inputs.savingRisk === 'adventurous') { expect(lever).toBeNull(); return; }
    const at = ok(answerB(withChange(CASES[name], { savingRisk: lever.level }), { ...ENV, trace: false }));
    expect(lever.payIn).toBe(at.payIn.at[a.inputs.confidence]);
    expect(lever.lasted).toBe(at.chance.lasted);
    expect(lever.helps).toBe(lever.payIn !== null && (a.payIn.needed === null || (a.payIn.needed > a.payIn.now && lever.payIn < a.payIn.needed)));
  });

  it('on course: no lever but "accept", and one headline', () => {
    const given = withChange(CASES['short at 60'], { spend: { amount: 900 } });
    const a = ok(answerB(given, ENV), given);
    expect(a.onCourse).toBe(true);
    for (const k of ['stopLater', 'payMore', 'spendLess', 'moreRisk']) expect(a.levers[k], k).toBeNull();
    expect(a.sentences.payInHead).toBeUndefined();
    expect(a.sentences.bad.id).toBe('b.bad.onCourse');
  });
});

describe('B — before the pension opens, the savings do not spend the 1-in-10 allowance on their own (numbers review, finding 1)', () => {
  const case47 = CASES['closed until 57, no savings'];

  it('the savings set aside for the closed years carry them in every future tried: no life fails before the pension opens', () => {
    const a = answers['closed until 57, no savings'];
    expect(a.outside).not.toBeNull();
    expect(a.basis.closedYearsFails).toBe(0);
    expect(a.outside.careful).toBeGreaterThanOrEqual(a.outside.amount);
    // with every life's savings at the stop at least that much and a pension that cannot run out, nothing fails at all
    const { household } = toHousehold(a.inputs, ENV);
    const sp = stopAtPlan(household, a.stop.age, ENV);
    const floor = { savingsOf: (i, j) => Math.max(sp.pots[j].savings[i], a.outside.careful * sp.split[j]) };
    expect(verdictAtPot(sp, a.spend.perYear, SAVING.potMax, floor).fails).toBe(0);
    // and £1,000 less is not enough in every future (it is the least that is)
    if (a.outside.careful > a.outside.amount) {
      const less = { savingsOf: (i, j) => Math.max(sp.pots[j].savings[i], (a.outside.careful - 1000) * sp.split[j]) };
      expect(verdictAtPot(sp, a.spend.perYear, SAVING.potMax, less).fails).toBeGreaterThan(0);
    }
    // paying into savings what the answer says, the closed years never fail either (the pension out of the way)
    const paying = answerB({ ...case47, savingsIn: a.payIn.outside }, { ...ENV, trace: false });
    expect(paying.payIn.outside).toBe(a.payIn.outside);
  });

  it('the number stopping at 55 is no more than stopping at 57 (when the pension is open), plus 2%', () => {
    const at55 = answers['closed until 57, no savings'];
    const at57 = answerB({ ...case47, stop: { age: 57 } }, { ...ENV, trace: false });
    expect(at57.outside).toBeNull();
    expect(at55.number.careful).toBeLessThanOrEqual(Math.ceil(at57.number.careful * 1.02 / 1000) * 1000);
  });

  it('when it is savings that fall short, the pension pay-in is left as it is and the headline is the savings', () => {
    const a = answers['closed until 57, no savings'];
    expect(a.onCourse).toBe(false);
    expect(a.payIn.at.nineInTen).toBeLessThanOrEqual(a.payIn.now);
    expect(a.payIn.outside).toBeGreaterThan(0);
    expect(a.levers.payMore).toMatchObject({ payIn: a.payIn.now, savingsIn: a.payIn.outside });
    expect(a.sentences.payInHead.id).toBe('b.payIn.head.savings');
    // the bad-case pot is said as it is, never weighed against the guide number (the reviewers' finding, 1 Oct 2026)
    expect(a.sentences.bad.text).not.toMatch(/short of it|enough in the pension/);
    expect(a.sentences.bad.text).not.toMatch(/about £0 /);
  });

  it('the ceilings stand: no pension pay-in above £10,000 a person, no savings pay-in above it', () => {
    for (const a of Object.values(answers)) {
      if (a.payIn.needed !== null) expect(a.payIn.needed).toBeLessThanOrEqual(a.basis.payInCeiling);
      if (a.payIn.outside !== null) expect(a.payIn.outside).toBeLessThanOrEqual(SAVING.payInCeiling * a.saving.length);
    }
  });
});

describe('B — the number of nought, and the notes that must not over-reach (the reviewers\' findings)', () => {
  it('savings that already pay: no "£0 number" — the line says the savings and State Pension pay, and nothing more is needed in the pension', () => {
    const given = { you: { age: 47, pot: 60000, payIn: { total: 500 } }, savings: 1000000, stop: { age: 53 }, spend: { amount: 2000 } };
    const a = ok(answerB(given, ENV), given);
    expect(a.number.careful).toBe(0);
    expect(a.onCourse).toBe(true);
    expect(a.sentences.line).toMatchObject({ id: 'b.line.zero', text: 'Your savings and State Pension already pay for this: nothing more is needed in your pension.' });
    expect(a.sentences.have).toBeUndefined();
    for (const s of [a.sentences.head, a.sentences.sub, a.sentences.line, a.sentences.bad, a.sentences.change]) expect(s.text, s.id).not.toMatch(/£0\b/);
  });

  it('the rise to 57 in April 2028 is noted only for someone it touches (a partner already 56 is not)', () => {
    const ids = (given) => answerB(given, { ...ENV, trace: false }).warnings.map((w) => w.id);
    expect(ids({ you: { age: 53, pot: 200000, payIn: { total: 800 } }, savings: 60000, stop: { age: 55 }, spend: { amount: 1500 } })).toContain('access-age-rises');
    expect(ids({ household: 'couple', you: { age: 58, pot: 310000, payIn: { total: 1000 } }, partner: { age: 56, pot: 150000, payIn: { total: 500 } }, savings: 80000, stop: { age: 66 }, spend: { amount: 3500 } })).not.toContain('access-age-rises');
    expect(ids({ you: { age: 50, pot: 200000, payIn: { total: 800 } }, stop: { age: 60 }, spend: { amount: 1500 } })).not.toContain('access-age-rises');
  });

  it('the pots at the stop say the savings are on top; savings that are most of the money, held mostly as cash, get a note (6.22.0)', () => {
    const given = { you: { age: 47, pot: 60000, payIn: { total: 500 } }, savings: 360000, stop: { age: 57 }, spend: { amount: 2000 } };
    const a = ok(answerB(given, ENV), given);
    expect(a.sentences.potsNow.text).toContain('(your savings are on top)');
    expect(a.warnings.find((w) => w.id === 'savings-mostly-cash')).toMatchObject({ severity: 'note' });
    expect(a.warnings.map((w) => w.id)).not.toContain('savings-fixed-growth');
    expect(a.assumed.find((x) => x.id === 'savings-growth')).toMatchObject({ field: 'isaGrowth', value: 'cash' });
    expect(a.assumed.find((x) => x.id === 'savings-growth').text).toContain('They grow like cash');
  });

  it('the grid is built around the answer: the stop-later age is a row, the pay-in that gets there a column; a sentence when no cell reaches 9 in 10', () => {
    const a = ok(answerB(CASES['short at 60'], { ...ENV, detail: 'grid' }));
    expect(a.grid.ages.map((r) => r.age)).toContain(a.levers.stopLater.age);
    expect(a.grid.payIns[0]).toBe(a.payIn.now);
    expect(a.grid.payIns[a.grid.payIns.length - 1]).toBe(a.payIn.needed);
    expect(a.grid.reaches).toBe(true);
    expect(a.sentences.gridNone).toBeUndefined();
    const own = a.grid.ages.find((r) => r.age === a.stop.age);
    expect(own.cells[0].lasted).toBe(a.chance.lasted);
    expect(own.cells[own.cells.length - 1].verdict).toBe('yes');
    // a household no cell reaches: the grid says so in a sentence
    const far = { you: { age: 58, pot: 20000, payIn: { total: 100 } }, stop: { age: 59 }, spend: { amount: 4000 } };
    const b = answerB(far, { ...ENV, detail: 'grid', trace: false });
    if (!b.grid.reaches) expect(b.sentences.gridNone.text).toBe('None of these lasted in 9 futures out of 10. A later age, or a lower amount to spend, is needed as well.');
  });
});
