/**
 * Question A's inputs → the household model (step 4 brief 4.10): C's mapping plus the stop, the pay-in, the savings
 * going in, the risk and charge while saving, part-time work and the spending. Pure; checked here apart from the engine.
 */
import { describe, it, expect } from 'vitest';
import { toHousehold, payInOf, namedStopAge } from '../../../src/answers/a/toHousehold.js';
import { checkInputs } from '../../../src/answers/shared/validate.js';
import { validateHousehold } from '../../../src/answers/shared/household.js';
import { SCHEMA_A, TEST_ENV } from './invariants.js';

const checked = (inputs, env = TEST_ENV) => { const r = checkInputs(SCHEMA_A, inputs, env); expect(r.ok, JSON.stringify(r.errors)).toBe(true); return r.inputs; };

describe('A — toHousehold', () => {
  it('a single saver: the stop S years on, the pay-in as given, the savings as ISA money, the one charge in percent', () => {
    const inputs = checked({ you: { age: 50, pot: 250000, payIn: { total: 600 } }, savings: 40000, stop: { age: 60 }, spend: { amount: 2000 } });
    const { household, S, stopAge } = toHousehold(inputs, TEST_ENV);
    expect(S).toBe(10);
    expect(stopAge).toBe(60);
    const [you] = household.people;
    expect(you.stopWork).toEqual({ kind: 'age', age: 60 });
    expect(you.pots.pension).toBe(250000);
    expect(you.pots.isa).toBe(40000);
    expect(you.saving).toEqual({ payIn: { total: 600, own: null, employer: null }, savingsIn: 0, alreadyDrawing: false });
    expect(you.otherIncome).toEqual([]);
    expect(household.spending).toEqual({ kind: 'amount', perMonthTakeHome: 2000 });
    // 6.19.0: the household's one charge (percent a year, saving and drawing), not a saving-years share any more
    expect(household.saving).toEqual({ risk: 'balanced' });
    expect(household.chargesPct).toBe(0.5);
    expect(household.planToAge).toBe(95);
    expect(household.portfolio).toEqual({ kind: 'risk', level: 'balanced' });
    expect(validateHousehold(household, TEST_ENV.today)).toEqual([]);
  });

  it('a couple: both stop in the same year, the savings and what goes into them split evenly, each their own pay-in', () => {
    const inputs = checked({ household: 'couple', you: { age: 52, pot: 220000, payIn: { kind: 'split', own: 500, employer: 400 } }, partner: { age: 50, pot: 90000, payIn: { total: 400 } },
      savings: 80000, savingsIn: 600, stop: { age: 55 }, spend: { kind: 'level', level: 'comfortable' }, savingRisk: 'adventurous', charge: 1 });
    const { household } = toHousehold(inputs, TEST_ENV);
    const [you, partner] = household.people;
    expect(you.stopWork).toEqual({ kind: 'age', age: 55 });
    expect(partner.stopWork).toEqual({ kind: 'age', age: 53 });
    expect(you.pots.isa).toBe(40000);
    expect(partner.pots.isa).toBe(40000);
    expect(you.saving.payIn).toEqual({ total: 900, own: 500, employer: 400 });
    expect(partner.saving.payIn).toEqual({ total: 400, own: null, employer: null });
    expect(you.saving.savingsIn).toBe(300);
    expect(partner.saving.savingsIn).toBe(300);
    expect(household.spending).toEqual({ kind: 'lifestyle', level: 'comfortable' });
    expect(household.saving).toEqual({ risk: 'adventurous' });
    expect(household.chargesPct).toBe(1);
  });

  it('the charge passes through as typed: 0.05 stays 0.05, 0 stays 0, 3 stays 3 (no rounding to tenths)', () => {
    for (const charge of [0, 0.05, 0.45, 1.35, 3]) {
      const inputs = checked({ you: { age: 50, pot: 250000 }, stop: { age: 60 }, spend: { amount: 2000 }, charge });
      const { household } = toHousehold(inputs, TEST_ENV);
      expect(household.chargesPct, String(charge)).toBe(charge);
      expect(validateHousehold(household, TEST_ENV.today)).toEqual([]);
    }
  });

  it('part-time work: the first person only, from the stop, for the years given — for whichever stop is asked for', () => {
    const inputs = checked({ you: { age: 59, pot: 180000 }, stop: { age: 59 }, spend: { amount: 1800 }, partTime: { has: true, yearly: 12000, years: 3 } });
    expect(toHousehold(inputs, TEST_ENV).household.people[0].otherIncome).toEqual([{ label: 'Part-time work', kind: 'work', amountPerYear: 12000, fromAge: 59, toAge: 62 }]);
    const later = toHousehold(inputs, TEST_ENV, 61);
    expect(later.S).toBe(2);
    expect(later.household.people[0].otherIncome[0]).toMatchObject({ fromAge: 61, toAge: 64 });
    expect(later.household.people[0].stopWork).toEqual({ kind: 'age', age: 61 });
  });

  it('"show me ages": the household is built for today unless a stop is named; env.mix holds an exact mix (tests)', () => {
    const inputs = checked({ you: { age: 45, pot: 100000 }, stop: { kind: 'ages' }, spend: { amount: 1500 } });
    expect(namedStopAge(inputs)).toBe(45);
    expect(toHousehold(inputs, TEST_ENV).S).toBe(0);
    const mixed = toHousehold(inputs, { ...TEST_ENV, mix: { equity: 0, bond: 0, cash: 1 } }).household;
    expect(mixed.portfolio).toEqual({ kind: 'mix', equity: 0, bond: 0, cash: 1 });
  });

  it('payInOf: the total, or own plus employer when split', () => {
    expect(payInOf({ payIn: { kind: 'total', total: 700 } })).toEqual({ total: 700, own: null, employer: null });
    expect(payInOf({ payIn: { kind: 'split', own: 450, employer: 250 } })).toEqual({ total: 700, own: 450, employer: 250 });
    expect(payInOf({})).toEqual({ total: 0, own: null, employer: null });
  });
});
