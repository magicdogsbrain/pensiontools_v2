/**
 * What the first review of the slice found on the answer side (the numbers review and the two persona walks), each
 * pinned so it cannot come back:
 *   1  the higher-rate warning fires (a £2m pot)
 *   2  a couple with one partner under the earliest pension age: the start stays, the partner's pension is closed
 *      until they reach it, the warning names them, and a £1 pot is a £0 pot
 *   3  no pot to draw on: the three amounts are the take-home from the pensions, the field everything reads
 *   4  under the earliest pension age through the form: the pension-locked warning as well as the start-later note,
 *      and the headline says the figure holds if the pot stays as it is
 *   5  savings grow at a fixed 3% a year, and the line says so
 *   6  the guaranteed-floor case is a whole £10, rounded down, like every other amount
 *   7  the tax line says the £100,000 point stays fixed
 *   8  a final-salary pension rises with prices up to 5% a year: the household says so, the words say so, the rows
 *      show it, and the pot is not drained making it good
 *   9  "420k", "0.42m", "£420,000" and "420 000" are all £420,000
 *  10  a State Pension already being paid: "check what you are paid", not a forecast
 */
import { describe, it, expect } from 'vitest';
import { SCHEMA_C, TEST_ENV } from './_c.js';
import { answerC, checkAnswer } from './invariants.js';
import { checkTrace } from '../oracles/fromTrace.mjs';
import { parseDraft, checkInputs } from '../../../src/answers/shared/validate.js';
import { RULES } from '../../../src/answers/shared/rules.js';
import { startWhenPensionsOpen } from '../../../src/answers/shared/household.js';
import { toHousehold } from '../../../src/answers/c/toHousehold.js';
import { enginePlan, configsAt, breakdownAt } from '../../../src/answers/shared/toEngine.js';
import { TAX_DEFAULTS, ISA_DEFAULTS } from '../../../src/constants.js';

const ENV = { ...TEST_ENV, futures: 40 };
const ok = (a, inputs) => { const f = checkAnswer(a, inputs); expect(f, f.join('\n')).toEqual([]); return a; };
const texts = (a) => [...Object.values(a.sentences).flatMap((s) => (Array.isArray(s) ? s : [s])), ...a.assumed, ...a.warnings].map((s) => s.text).join('\n');
const warning = (a, id) => a.warnings.find((w) => w.id === id);
const assumed = (a, id) => a.assumed.find((x) => x.id === id);

describe('1 the higher-rate warning', () => {
  it('fires for a £2,000,000 pot at 58: the pension draw passes the basic-rate limit in every phase', () => {
    const a = ok(answerC({ you: { pot: 2000000, age: 58 } }, ENV));
    expect(a.phases.every((p) => p.byPerson[0].higherRate === true)).toBe(true);
    const w = warning(a, 'higher-rate');
    expect(w).toBeDefined();
    expect(w.severity).toBe('note');
    expect(w.text).toBe('Some of this is taxed at 40%. Spreading it over more years may lower the tax.');
    expect(warning(a, 'tax-free-limit')).toBeDefined();
  });

  it('does not fire for £250,000 at 58, and says "between you" for a couple', () => {
    const single = ok(answerC({ you: { pot: 250000, age: 58 } }, ENV));
    expect(single.phases.some((p) => p.byPerson.some((b) => b.higherRate))).toBe(false);
    expect(warning(single, 'higher-rate')).toBeUndefined();
    const couple = ok(answerC({ household: 'couple', you: { pot: 4000000, age: 60 }, partner: { age: 60, pot: 0 } }, ENV));
    expect(warning(couple, 'higher-rate').text).toContain('Spreading it between you, or over more years');
  });

  it('every byPerson entry carries higherRate and locked as booleans', () => {
    const a = answerC({ household: 'couple', you: { pot: 100000, age: 62 }, partner: { age: 60, pot: 50000 } }, ENV);
    for (const p of a.phases) for (const b of p.byPerson) { expect(typeof b.higherRate).toBe('boolean'); expect(typeof b.locked).toBe('boolean'); }
  });
});

describe('2 a couple with one partner under the earliest pension age', () => {
  const you = { pot: 250000, age: 60 };
  const inputs = { household: 'couple', you, partner: { age: 50, pot: 100000 } };

  it('keeps the start at the older person\'s choice (now) and names the partner in the warning', () => {
    const a = ok(answerC(inputs, { ...ENV, trace: true }), inputs);
    expect(a.basis.start).toBe('2026-09');
    expect(a.basis.startAge).toBe(50);                       // the younger person's age at the start
    expect(a.phases[0].ages.you.from).toBe(60);
    expect(a.sentences.sub.text).toContain('from now until the younger of you is 95');
    expect(assumed(a, 'start').text).toBe('The money is taken from now, when you are 60.');
    expect(warning(a, 'pension-locked')).toBeUndefined();
    const w = warning(a, 'pension-locked-partner');
    expect(w.severity).toBe('important');
    expect(w.text).toBe("Your partner can't take money from their pension until they are 57 (April 2028 rules). Until then it is left alone and the rest of the money pays.");
    expect(warning(a, 'start-later')).toBeUndefined();
    expect(checkTrace(a)).toEqual([]);
  });

  it('treats the partner\'s pension as closed until 57: nothing from it before, their share of the pots after', () => {
    const a = ok(answerC(inputs, { ...ENV, trace: true }), inputs);
    const locked = a.phases.filter((p) => p.byPerson[1].locked);
    const open = a.phases.filter((p) => !p.byPerson[1].locked);
    expect(locked.map((p) => p.ages.partner.from)).toEqual([50]);
    expect(locked[0].ages.partner.to).toBe(57);
    expect(locked[0].byPerson[1]).toMatchObject({ who: 'partner', fromPension: 0, fromSavings: 0, locked: true });
    expect(locked[0].byPerson[0].fromPension).toBeGreaterThan(0);
    expect(open[0].byPerson[1].fromPension).toBeGreaterThan(0);
    expect(open[0].byPerson[1].locked).toBe(false);
    for (const r of a.trace.atCareful.rows) if (r.who === 'partner' && r.age < 57) expect(r.fromPension, `m${r.m}`).toBe(0);
    expect(a.trace.atCareful.rows.some((r) => r.who === 'partner' && r.age >= 57 && r.fromPension > 0)).toBe(true);
    // the made-of lines say whose pot pays before the partner's opens
    expect(a.sentences.madeOf[0].text).toMatch(/^Until (you are 67|your partner is 57): £[\d,]+ a month, all from your pot\.$/);
  });

  it('is continuous: a partner pot of £1 gives the £0-pot answer, and more in the partner\'s pot never less', () => {
    const none = ok(answerC({ ...inputs, partner: { age: 50, pot: 0 } }, ENV));
    const one = ok(answerC({ ...inputs, partner: { age: 50, pot: 1 } }, ENV));
    const some = ok(answerC(inputs, ENV));
    for (const k of ['careful', 'middling', 'good']) {
      expect(one.monthly[k] - none.monthly[k], k).toBeGreaterThanOrEqual(0);
      expect(one.monthly[k] - none.monthly[k], k).toBeLessThanOrEqual(10);
      expect(some.monthly[k], k).toBeGreaterThanOrEqual(one.monthly[k]);
    }
    expect(none.basis.start).toBe(one.basis.start);
    expect(warning(none, 'pension-locked-partner')).toBeUndefined();
    expect(warning(one, 'pension-locked-partner')).toBeDefined();
  });

  it('the partner\'s half of the savings may be spent while their pension is closed, and afterwards', () => {
    // Today's engine cannot keep a pension shut while the ISA beside it is spent, so a closed pension's holder is run
    // as two: their savings for the whole plan, like a person with savings only, and their pension from the day it
    // opens. (Savings run for the closed years alone would be lost to the plan once the pension opened: a £1 pot
    // with a one-year wait cost £490 a month that way; and savings left idle until then cost £60 a month here.)
    const withSavings = { ...inputs, savings: 60000 };
    const a = ok(answerC(withSavings, { ...ENV, trace: true }), withSavings);
    const first = a.phases[0].byPerson[1];
    expect(first).toMatchObject({ locked: true, fromPension: 0 });
    expect(first.fromSavings).toBeGreaterThan(0);
    expect(a.phases[0].byPerson[0].fromPension).toBeGreaterThan(0);
    const partnerRows = a.trace.atCareful.rows.filter((r) => r.who === 'partner');
    expect(partnerRows[0].potStart).toBeCloseTo(130000, 6);           // pension and half the savings, in one row a month
    expect(partnerRows.filter((r) => r.age < 57).every((r) => r.fromPension === 0)).toBe(true);
    expect(partnerRows.some((r) => r.age < 57 && r.fromSavings > 0)).toBe(true);
    expect(partnerRows.some((r) => r.age >= 57 && r.fromPension > 0)).toBe(true);
    expect(warning(a, 'pension-locked-partner').text).toBe("Your partner can't take money from their pension until they are 57 (April 2028 rules). Until then it is left alone and the rest of the money pays.");
    expect(checkTrace(a)).toEqual([]);
    const without = ok(answerC(inputs, ENV), inputs);
    for (const k of ['careful', 'middling', 'good']) expect(a.monthly[k], k).toBeGreaterThanOrEqual(without.monthly[k]);
    // a partner with savings and no pension is the same household as one with savings and a £1 pension
    const none = ok(answerC({ ...withSavings, partner: { age: 50, pot: 0 } }, ENV));
    const one = ok(answerC({ ...withSavings, partner: { age: 50, pot: 1 } }, ENV));
    for (const k of ['careful', 'middling', 'good']) { expect(one.monthly[k] - none.monthly[k], k).toBeGreaterThanOrEqual(0); expect(one.monthly[k] - none.monthly[k], k).toBeLessThanOrEqual(10); }
  });

  it('the household model: the start waits only while every pension is closed', () => {
    const now = '2026-09-30';
    const person = (who, age, pension) => ({ who, age, stopWork: { kind: 'already' }, pots: { pension, isa: 0 }, statePension: { amountPerYear: 0, startAge: { years: 67, months: 0 } }, finalSalary: [] });
    const oneOpen = startWhenPensionsOpen({ people: [person('you', 60, 250000), person('partner', 50, 100000)] }, now);
    expect(oneOpen).toMatchObject({ moved: false, movedBy: 0, yearsFromNow: 0, movedFor: [], locked: ['partner'], lockedUntil: [{ who: 'partner', untilAge: 57, years: 7 }] });
    const bothClosed = startWhenPensionsOpen({ people: [person('you', 54, 250000), person('partner', 50, 100000)] }, now);
    expect(bothClosed).toMatchObject({ moved: true, movedBy: 1, yearsFromNow: 1, movedFor: ['you'], locked: ['you', 'partner'], lockedUntil: [{ who: 'partner', untilAge: 57, years: 6 }] });
    const onlyPartnerHasOne = startWhenPensionsOpen({ people: [person('you', 60, 0), person('partner', 50, 100000)] }, now);
    expect(onlyPartnerHasOne).toMatchObject({ moved: true, movedBy: 7, movedFor: ['partner'], locked: ['partner'], lockedUntil: [] });
  });

  it('the start stays while at least half the pension money is open; otherwise it moves to the opening that makes it so', () => {
    const minority = { household: 'couple', you: { pot: 100000, age: 60 }, partner: { age: 50, pot: 300000 } };
    const a = ok(answerC(minority, ENV), minority);
    expect(a.basis.start).toBe('2033-09');
    expect(warning(a, 'pension-locked-partner').text).toBe("Your partner can't take money from their pension until they are 57 (April 2028 rules). These figures start from then.");
    expect(a.phases.every((p) => !p.byPerson[1].locked)).toBe(true);
    const majority = { household: 'couple', you: { pot: 300000, age: 60 }, partner: { age: 50, pot: 100000 } };
    const b = ok(answerC(majority, ENV), majority);
    expect(b.basis.start).toBe('2026-09');
    expect(b.phases[0].byPerson[1].locked).toBe(true);
    const half = { household: 'couple', you: { pot: 200000, age: 60 }, partner: { age: 50, pot: 200000 } };
    expect(answerC(half, ENV).basis.start).toBe('2026-09');
    // savings alone do not hold the start: a person whose own pension is closed waits for it, and lives on the savings meanwhile
    const single = { you: { pot: 100000, age: 50 }, savings: 200000, start: { kind: 'now' } };
    const c = ok(answerC(single, ENV), single);
    expect(c.basis.start).toBe('2033-09');
    expect(warning(c, 'pension-locked').text).toBe("You can't take money from your pension until you are 57 (April 2028 rules). These figures start from then.");
    expect(warning(c, 'savings-cover-gap')).toBeDefined();
  });

  it('both under the age: the start moves to the first opening, and the other stays closed until theirs', () => {
    const both = { household: 'couple', you: { pot: 250000, age: 54 }, partner: { age: 50, pot: 100000 } };
    const a = ok(answerC(both, { ...ENV, trace: true }), both);
    expect(a.basis.start).toBe('2027-09');
    expect(warning(a, 'pension-locked').text).toBe("You can't take money from your pension until you are 55. These figures start from then.");
    expect(warning(a, 'pension-locked-partner').text).toBe("Your partner can't take money from their pension until they are 57 (April 2028 rules). Until then it is left alone and the rest of the money pays.");
    expect(a.phases[0].byPerson[1].locked).toBe(true);
    expect(a.phases[0].ages.partner.to).toBe(57);
    expect(checkTrace(a)).toEqual([]);
  });

  it('the adapter: two runs for the closed pension\'s holder, the pension one drawing nothing while it is closed', () => {
    const env = { today: ENV.today };
    const plan = enginePlan(toHousehold(checkInputs(SCHEMA_C, { ...inputs, savings: 60000 }, env).inputs, env).household, env);
    expect(plan.people[1]).toMatchObject({ who: 'partner', lockedYears: 7, untilAge: 57 });
    expect(plan.runs.map((r) => r.who + ':' + r.role).sort()).toEqual(['partner:pension', 'partner:savings', 'you:pension']);
    const configs = configsAt(plan, 30000);
    const pension = configs.find((c) => c.who === 'partner' && c.role === 'pension').config;
    const savings = configs.find((c) => c.who === 'partner' && c.role === 'savings').config;
    expect(pension.targetSchedule.slice(0, 7)).toEqual([0, 0, 0, 0, 0, 0, 0]);
    expect(pension.targetSchedule[7]).toBeGreaterThan(0);
    expect(pension.isaBalance).toBe(0);
    expect(pension.equityStart + pension.bondStart + pension.cashStart).toBeCloseTo(100000, 6);
    expect(savings).toMatchObject({ isaBalance: 30000, equityStart: 0, spWeeklyAmount: 0, dbAmount: 0, accessMethod: 'drawdown' });
    expect(savings.targetSchedule.every((t) => t > 0)).toBe(true);
    const per = breakdownAt(plan, 30000);
    expect(per[0].byPerson[1]).toMatchObject({ locked: true, fromPension: 0 });
    expect(per[0].byPerson[1].fromSavings).toBeGreaterThan(0);
    const shareOf = (k, who, role) => plan.periods[k].shares[plan.runs.findIndex((r) => r.who === who && r.role === role)];
    expect(shareOf(0, 'partner', 'pension')).toBe(0);
    expect(shareOf(0, 'partner', 'savings')).toBeCloseTo(30000 / 310000, 12);     // the partner's savings against your pot and savings
    expect(shareOf(1, 'partner', 'pension')).toBeCloseTo(100000 / 410000, 12);    // once open: everything counts
    expect(shareOf(1, 'partner', 'savings')).toBeCloseTo(30000 / 410000, 12);
  });
});

describe('3 no pot to draw on', () => {
  it('58 with the full State Pension from 67: the three amounts are the take-home from the pension, and the headline reads it', () => {
    const a = ok(answerC({ you: { pot: 0, age: 58 } }, ENV));
    expect(a.status).toBe('guaranteed-only');
    const g = a.guaranteed.monthlyAfterTax;
    expect(g).toBeCloseTo(1045.63, 2);
    expect(a.monthly).toEqual({ careful: g, middling: g, good: g });
    expect(a.yearly.careful).toBeCloseTo(g * 12, 2);
    expect(a.phases.map((p) => p.takeHome)).toEqual([0, g]);
    expect(a.sentences.head.parts).toEqual([{ key: 'monthly.careful', kind: 'money' }, ' a month']);
    expect(a.sentences.head.text).toBe('£1,046 a month');
    expect(a.sentences.sub.text).toBe('after tax, from age 67 until you are 95, going up each year with prices');
    expect(a.sentences.range.text).toBe('Careful, middling and good are all the same here: £1,046 a month.');
    expect(a.sentences.nothing.text).toBe('There is no pot to draw on, so this is your State Pension only: £1,046 a month after tax.');
  });

  it('68, already paid: the same field, from now', () => {
    const a = ok(answerC({ you: { pot: 0, age: 68 } }, ENV));
    expect(a.monthly.careful).toBe(a.guaranteed.monthlyAfterTax);
    expect(a.phases[0].takeHome).toBe(a.monthly.careful);
    expect(a.sentences.sub.text).toBe('after tax, from now until you are 95, going up each year with prices');
  });
});

describe('4 under the earliest pension age, through the form', () => {
  it('50 with £250,000 and the form\'s default start (57): pension-locked and start-later, and the headline holds "if the pot stays"', () => {
    const draft = parseDraft(SCHEMA_C, { 'you.pot': '250,000', 'you.age': '50' }, ENV);
    expect(draft.ok).toBe(true);
    expect(draft.inputs.start).toEqual({ kind: 'age', age: 57 });
    const a = ok(answerC(draft.inputs, ENV), draft.inputs);
    expect(a.basis.start).toBe('2033-09');
    expect(warning(a, 'pension-locked').text).toBe("You can't take money from your pension until you are 57 (April 2028 rules). These figures start from then.");
    expect(warning(a, 'start-later').text).toBe('This leaves out any growth, and anything you pay in, between now and then.');
    expect(a.sentences.sub.text).toBe('after tax, from age 57 until you are 95, going up each year with prices, if the pot stays at £250,000 until 57');
    expect(a.sentences.sub.parts).toContainEqual({ key: 'inputs.you.pot', kind: 'money' });
    expect(assumed(a, 'pot-as-is')).toBeDefined();
  });

  it('47 with £420,000 (the forum guest): the same, from 57', () => {
    const a = ok(answerC({ you: { pot: 420000, age: 47 } }, ENV));
    expect(a.sentences.sub.text).toContain('if the pot stays at £420,000 until 57');
    expect(warning(a, 'pension-locked')).toBeDefined();
    expect(warning(a, 'start-later')).toBeDefined();
  });

  it('a start chosen later than the earliest age (60 at 50): the warning says when the figures start', () => {
    const a = ok(answerC({ you: { pot: 250000, age: 50 }, start: { kind: 'age', age: 60 } }, ENV));
    expect(warning(a, 'pension-locked').text).toBe("You can't take money from your pension until you are 57 (April 2028 rules). These figures start from when you are 60.");
  });

  it('two years away or less says nothing about the pot staying; a couple or savings say "as they are"', () => {
    const soon = ok(answerC({ you: { pot: 250000, age: 58 }, start: { kind: 'age', age: 60 } }, ENV));
    expect(soon.sentences.sub.text).not.toContain('stays');
    const couple = ok(answerC({ household: 'couple', you: { pot: 250000, age: 58 }, partner: { age: 56, pot: 100000 }, start: { kind: 'age', age: 62 } }, ENV));
    expect(couple.sentences.sub.text).toContain(', if the pots stay as they are until 62');
    const savings = ok(answerC({ you: { pot: 250000, age: 58 }, savings: 20000, start: { kind: 'age', age: 62 } }, ENV));
    expect(savings.sentences.sub.text).toContain(', if the pot and savings stay as they are until 62');
    const now = ok(answerC({ you: { pot: 250000, age: 58 } }, ENV));
    expect(now.sentences.sub.text).toBe('after tax, from now until you are 95, going up each year with prices');
  });

  it('a person at or past the earliest age gets no pension-locked warning', () => {
    const a = ok(answerC({ you: { pot: 250000, age: 57 } }, ENV));
    expect(warning(a, 'pension-locked')).toBeUndefined();
    const b = ok(answerC({ you: { pot: 250000, age: 56 } }, ENV));      // 55 before April 2028: open today
    expect(warning(b, 'pension-locked')).toBeUndefined();
  });
});

describe('5 savings', () => {
  it('are treated as ISA money growing at a fixed 3% a year, the engine\'s own figure', () => {
    expect(RULES.savingsGrowth).toBe(ISA_DEFAULTS.RETURN);
    const a = ok(answerC({ you: { pot: 250000, age: 58 }, savings: 20000 }, ENV));
    expect(assumed(a, 'savings-as-isa').text).toBe('Your savings are treated as ISA money: tax-free to take, growing at a fixed 3% a year.');
    expect(texts(a)).not.toMatch(/what cash earns/);
  });
});

describe('6 the guaranteed floor', () => {
  it('£1,000 at 66: the careful amount is the State Pension rounded down to £10, a whole £10 like every other amount', () => {
    const a = ok(answerC({ you: { pot: 1000, age: 66 } }, { ...ENV, trace: true }));
    expect(a.monthly.careful).toBe(1040);
    for (const k of ['careful', 'middling', 'good']) expect(a.monthly[k] % 10).toBe(0);
    expect(a.phases[0].takeHome).toBeCloseTo(1045.63, 2);
    expect(a.sentences.head.text).toBe('About £1,040 a month');
    expect(checkTrace(a)).toEqual([]);
  });
});

describe('7 the tax line', () => {
  it('says the £100,000 point stays fixed, the engine\'s own figure', () => {
    expect(RULES.taperFrom).toBe(TAX_DEFAULTS.PA_TAPER_THRESHOLD);
    const a = ok(answerC({ you: { pot: 250000, age: 58 } }, ENV));
    expect(assumed(a, 'tax-rules').text).toBe('Tax rules for 2026/27 in England, Wales and Northern Ireland, with allowances rising with prices; the £100,000 point where the allowance starts to be withdrawn stays fixed.');
  });
});

describe('8 a final-salary pension rises with prices up to 5% a year', () => {
  const inputs = { you: { pot: 250000, age: 62, finalSalary: { has: true, yearly: 9000, fromAge: 65 } } };

  it('the household says pricesCapped5, and the line says so', () => {
    const { household } = toHousehold(checkInputs(SCHEMA_C, inputs, ENV).inputs, ENV);
    expect(household.people[0].finalSalary[0].increases).toBe('pricesCapped5');
    const a = ok(answerC(inputs, ENV), inputs);
    expect(assumed(a, 'final-salary-rises')).toMatchObject({ value: 'pricesCapped5', text: 'Your final-salary pension rises with prices, up to 5% a year.' });
    const couple = ok(answerC({ household: 'couple', you: inputs.you, partner: { age: 60, pot: 0, finalSalary: { has: true, yearly: 5000, fromAge: 60 } } }, ENV));
    expect(assumed(couple, 'final-salary-rises').text).toBe('Your final-salary pensions rise with prices, up to 5% a year.');
  });

  it('the month-by-month rows carry the capped rise, and the trace check allows for what it takes off', () => {
    const a = ok(answerC(inputs, { ...ENV, trace: true }), inputs);
    const rows = a.trace.atCareful.rows.filter((r) => r.finalSalary > 0);
    expect(rows.length).toBeGreaterThan(0);
    // never above the pension risen with prices in full; below it once prices have risen faster than 5% a year
    for (const r of rows) expect(r.finalSalary).toBeLessThanOrEqual((9000 / 12) * r.priceIndex + 1e-6);
    expect(checkTrace(a)).toEqual([]);
  });

  it('the pot is not drained making the cap good: a pot beside a pension still adds to the answer, and more pension is never less', () => {
    const small = ok(answerC({ you: { pot: 30000, age: 60, finalSalary: { has: true, yearly: 20000, fromAge: 60 } } }, ENV));
    const large = ok(answerC({ you: { pot: 100000, age: 60, finalSalary: { has: true, yearly: 20000, fromAge: 60 } } }, ENV));
    const floor = ok(answerC({ you: { pot: 0, age: 60, finalSalary: { has: true, yearly: 20000, fromAge: 60 } } }, ENV)).phases[0].takeHome;   // the pension alone, before the State Pension
    expect(floor).toBeCloseTo(1542.83, 1);                               // £20,000 less tax on it, a month
    expect(small.monthly.careful).toBeGreaterThan(floor + 100);
    expect(large.monthly.careful).toBeGreaterThan(small.monthly.careful + 300);
    // the review's counterexample: a £100 pension from 60 beside a £1 pot must not sink the household
    const base = { household: 'couple', you: { pot: 1, age: 18 }, start: { kind: 'now' }, partner: { age: 18, pot: 150000 }, endAge: 75 };
    const more = { ...base, you: { ...base.you, finalSalary: { has: true, yearly: 100, fromAge: 60 } } };
    const a = ok(answerC(base, ENV), base);
    const b = ok(answerC(more, ENV), more);
    for (const k of ['careful', 'middling', 'good']) expect(b.monthly[k], k).toBeGreaterThanOrEqual(a.monthly[k]);
  });
});

describe('9 money as people write it', () => {
  it.each([
    ['420k', 420000], ['420K', 420000], ['0.42m', 420000], ['0.42M', 420000], ['£420,000', 420000], ['420 000', 420000],
    ['£420k', 420000], ['1.5m', 1500000], ['250000.50', 250000.5], ['12.5k', 12500]
  ])('%s is £%d', (typed, value) => {
    const r = parseDraft(SCHEMA_C, { 'you.pot': typed, 'you.age': '58' }, ENV);
    expect(r.errors).toEqual({});
    expect(r.inputs.you.pot).toBe(value);
  });

  it.each(['420kk', 'k', '4.2.0k', '420,00o', '420 thousand', '1.234'])('%s is not an amount', (typed) => {
    const r = parseDraft(SCHEMA_C, { 'you.pot': typed, 'you.age': '58' }, ENV);
    expect(r.errors['you.pot']).toBe('notANumber');
  });
});

describe('10 a State Pension already being paid', () => {
  it('66 with £180,000: "check what you are paid", not a forecast', () => {
    const a = ok(answerC({ you: { pot: 180000, age: 66 } }, ENV));
    expect(assumed(a, 'state-pension-full').text).toBe('The full State Pension of £1,046 a month. Yours may be different — check what you are paid.');
    expect(texts(a)).not.toMatch(/forecast/);
  });

  it('58: still a forecast; a couple with one paid and one not: each their own', () => {
    const a = ok(answerC({ you: { pot: 250000, age: 58 } }, ENV));
    expect(assumed(a, 'state-pension-full').text).toBe('The full State Pension of £1,046 a month from age 67. Yours may be different — check your forecast.');
    const c = ok(answerC({ household: 'couple', you: { pot: 250000, age: 68 }, partner: { age: 60, pot: 0 } }, ENV));
    expect(assumed(c, 'state-pension-full').text).toContain('check what you are paid');
    expect(assumed(c, 'state-pension-full-partner').text).toContain('check their forecast');
  });
});
