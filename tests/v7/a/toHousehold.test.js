/**
 * Question A's inputs → the household model (step 4 brief 4.10): C's mapping plus the stop, the pay-in, the savings
 * going in, the risk and charge while saving, part-time work and the spending. Pure; checked here apart from the engine.
 */
import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { toHousehold, payInOf, namedStopAge } from '../../../src/answers/a/toHousehold.js';
import { toHousehold as toHouseholdB } from '../../../src/answers/b/toHousehold.js';
import { toHousehold as toHouseholdC } from '../../../src/answers/c/toHousehold.js';
import { checkInputs } from '../../../src/answers/shared/validate.js';
import { validateHousehold, stopsOf } from '../../../src/answers/shared/household.js';
import { SCHEMA_A, TEST_ENV } from './invariants.js';
import { SCHEMA_B } from '../b/_b.js';
import { SCHEMA_C } from '../c/_c.js';
import { arbitraryInputs } from '../gen/arbitrary.mjs';

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

/*
 * Couples who stop work in different years (research/v7/couples-different-years.md 3.4): the mapping in all three
 * questions. Each person's stop is their own; the same year — by "when you do", by an age that is the same year, or by
 * not answering — is today's household, key for key.
 */
describe('the three mappings: each person\'s own stop', () => {
  const checkedB = (inputs) => { const r = checkInputs(SCHEMA_B, inputs, TEST_ENV); expect(r.ok, JSON.stringify(r.errors)).toBe(true); return r.inputs; };
  const checkedC = (inputs) => { const r = checkInputs(SCHEMA_C, inputs, TEST_ENV); expect(r.ok, JSON.stringify(r.errors)).toBe(true); return r.inputs; };
  const COUPLE_A = { household: 'couple', you: { age: 56, pot: 220000, payIn: { total: 900 } }, partner: { age: 60, pot: 90000, payIn: { total: 400 } },
    savings: 40000, savingsIn: 600, stop: { age: 57 }, spend: { amount: 2600 } };

  it('A, your partner has already stopped: their stop now, nothing paid in, the savings and what goes into them yours alone', () => {
    const inputs = checked({ ...COUPLE_A, partner: { ...COUPLE_A.partner, stop: { kind: 'already' }, taxFreeTaken: true } });
    const { household, S, stopAge } = toHousehold(inputs, TEST_ENV);
    expect([S, stopAge]).toEqual([1, 57]);
    const [you, partner] = household.people;
    expect(you.stopWork).toEqual({ kind: 'age', age: 57 });
    expect(partner.stopWork).toEqual({ kind: 'already' });
    expect(partner.saving).toEqual({ payIn: { total: 0, own: null, employer: null }, savingsIn: 0, alreadyDrawing: false });
    expect(you.saving).toEqual({ payIn: { total: 900, own: null, employer: null }, savingsIn: 600, alreadyDrawing: false });
    expect(household.people.map((p) => p.pots.isa)).toEqual([0, 40000]);           // savings-first: the one who stopped first
    expect(partner.pensionTaxFreeCash).toBe('alreadyTaken');
    expect(you.pensionTaxFreeCash).toBe('notTakenYet');
    expect(household.untilBothStop).toEqual({ payCovers: 0.5 });                   // not answered: half
    expect(stopsOf(household, TEST_ENV.today)).toEqual([{ who: 'you', S: 1, join: 1 }, { who: 'partner', S: 0, join: 0 }]);
    expect(validateHousehold(household, TEST_ENV.today)).toEqual([]);
  });

  it('A, the pay line: half, all or none of what you spend', () => {
    for (const [untilBothStop, payCovers] of [['half', 0.5], ['all', 1], ['none', 0]]) {
      const inputs = checked({ ...COUPLE_A, partner: { ...COUPLE_A.partner, stop: { kind: 'age', age: 63 } }, untilBothStop });
      expect(toHousehold(inputs, TEST_ENV).household.untilBothStop, untilBothStop).toEqual({ payCovers });
    }
  });

  it('A, your partner stops at an age of their own: both saving, each until their own stop; the sweep moves only yours', () => {
    const inputs = checked({ ...COUPLE_A, partner: { ...COUPLE_A.partner, stop: { kind: 'age', age: 63 } } });
    const { household } = toHousehold(inputs, TEST_ENV);
    expect(household.people.map((p) => p.stopWork)).toEqual([{ kind: 'age', age: 57 }, { kind: 'age', age: 63 }]);
    expect(household.people.map((p) => p.saving.savingsIn)).toEqual([300, 300]);      // both still working today: split evenly
    expect(household.people.map((p) => p.pots.isa)).toEqual([40000, 0]);              // you stop first
    const later = toHousehold(inputs, TEST_ENV, 60);
    expect(later.S).toBe(4);
    expect(later.household.people.map((p) => p.stopWork)).toEqual([{ kind: 'age', age: 60 }, { kind: 'age', age: 63 }]);
  });

  it('A, "I\'ve already stopped": the answer is about your partner, whose stop is the one swept; part-time work is not yours', () => {
    const inputs = checked({ ...COUPLE_A, stop: { kind: 'already' }, partner: { ...COUPLE_A.partner, stop: { kind: 'age', age: 63 } }, you: { age: 56, pot: 220000, taxFreeTaken: true } });
    expect(namedStopAge(inputs)).toBe(63);
    const { household, S, stopAge } = toHousehold(inputs, TEST_ENV);
    expect([S, stopAge]).toEqual([3, 63]);
    expect(household.people.map((p) => p.stopWork)).toEqual([{ kind: 'already' }, { kind: 'age', age: 63 }]);
    expect(household.people.map((p) => p.saving.payIn.total)).toEqual([0, 400]);
    expect(household.people.map((p) => p.saving.savingsIn)).toEqual([0, 600]);
    expect(household.people[0].pensionTaxFreeCash).toBe('alreadyTaken');
    expect(household.people[0].otherIncome).toEqual([]);
    const swept = toHousehold(inputs, TEST_ENV, 61);
    expect(swept.S).toBe(1);
    expect(swept.household.people.map((p) => p.stopWork)).toEqual([{ kind: 'already' }, { kind: 'age', age: 61 }]);
    // "show me ages" for the partner: the household is built for today unless a row is asked for
    const ages = checked({ ...COUPLE_A, stop: { kind: 'already' }, partner: { ...COUPLE_A.partner, stop: { kind: 'ages' } }, you: { age: 56, pot: 220000 } });
    expect(namedStopAge(ages)).toBe(60);
    expect(toHousehold(ages, TEST_ENV).S).toBe(0);
  });

  it('B: each person\'s own stop (b/toHousehold no longer gives everyone the shared one)', () => {
    const base = { household: 'couple', you: { age: 50, pot: 120000, payIn: { total: 700 } }, partner: { age: 48, pot: 60000, payIn: { total: 300 } }, stop: { age: 60 }, spend: { amount: 2000 }, savings: 10000, savingsIn: 200 };
    const own = toHouseholdB(checkedB({ ...base, partner: { ...base.partner, stop: { kind: 'age', age: 62 } }, untilBothStop: 'none' }), TEST_ENV).household;
    expect(own.people.map((p) => p.stopWork)).toEqual([{ kind: 'age', age: 60 }, { kind: 'age', age: 62 }]);
    expect(own.untilBothStop).toEqual({ payCovers: 0 });
    expect(own.people.map((p) => p.pots.isa)).toEqual([10000, 0]);
    const stopped = toHouseholdB(checkedB({ ...base, stop: { kind: 'already' }, partner: { ...base.partner, stop: { kind: 'age', age: 56 } } }), TEST_ENV);
    expect(stopped.S).toBe(8);
    expect(stopped.household.people.map((p) => p.stopWork)).toEqual([{ kind: 'already' }, { kind: 'age', age: 56 }]);
    expect(stopped.household.people.map((p) => p.saving.payIn.total)).toEqual([0, 300]);
    expect(stopped.household.people.map((p) => p.saving.savingsIn)).toEqual([0, 200]);
    expect(validateHousehold(stopped.household, TEST_ENV.today)).toEqual([]);
    // a row of B's: the asked person's stop moves, the other's stays
    const row = toHouseholdB(checkedB({ ...base, stop: { kind: 'already' }, partner: { ...base.partner, stop: { kind: 'age', age: 56 } } }), TEST_ENV, 58);
    expect(row.S).toBe(10);
    expect(row.household.people.map((p) => p.stopWork)).toEqual([{ kind: 'already' }, { kind: 'age', age: 58 }]);
    expect(toHouseholdB(checkedB(base), TEST_ENV, 63).household.people.map((p) => p.stopWork)).toEqual([{ kind: 'age', age: 63 }, { kind: 'age', age: 61 }]);   // "when you do"
    expect(toHouseholdB(checkedB(base), TEST_ENV)).toEqual(toHouseholdB(checkedB(base), TEST_ENV, 60));
  });

  it('C: the partner\'s own stop beside your start; the tax-free part already taken', () => {
    const base = { household: 'couple', you: { age: 58, pot: 250000 }, partner: { age: 56, pot: 100000 }, savings: 30000 };
    const now = toHouseholdC(checkedC({ ...base, you: { ...base.you, taxFreeTaken: true }, partner: { ...base.partner, stop: { kind: 'age', age: 57 } } }), TEST_ENV).household;
    expect(now.people.map((p) => p.stopWork)).toEqual([{ kind: 'already' }, { kind: 'age', age: 57 }]);
    expect(now.people.map((p) => p.pensionTaxFreeCash)).toEqual(['alreadyTaken', 'notTakenYet']);
    expect(now.people.map((p) => p.pots.isa)).toEqual([30000, 0]);
    expect(now.untilBothStop).toEqual({ payCovers: 0.5 });
    const later = toHouseholdC(checkedC({ ...base, start: { kind: 'age', age: 60 }, partner: { ...base.partner, stop: { kind: 'already' }, taxFreeTaken: true }, untilBothStop: 'all' }), TEST_ENV).household;
    expect(later.people.map((p) => p.stopWork)).toEqual([{ kind: 'age', age: 60 }, { kind: 'already' }]);
    expect(later.people.map((p) => p.pensionTaxFreeCash)).toEqual(['notTakenYet', 'alreadyTaken']);
    expect(later.untilBothStop).toEqual({ payCovers: 1 });
    // C from now, your partner already stopped: you have both stopped now — today's household (couples-different-years.md 5.1, I3)
    const both = toHouseholdC(checkedC({ ...base, partner: { ...base.partner, stop: { kind: 'already' } } }), TEST_ENV);
    expect(both).toEqual(toHouseholdC(checkedC(base), TEST_ENV));
  });

  /** The partner's stop given as "when you do", or as their age at your stop: the very household of not answering. */
  function sameYearRoutes(inputs, S) {
    const p = inputs.partner;
    const routes = [{ ...inputs, partner: { ...p, stop: { kind: 'same' } } }];
    if (p.age + S <= 75) routes.push({ ...inputs, partner: { ...p, stop: { kind: 'age', age: p.age + S } } });
    return routes;
  }
  const strip = (h) => JSON.parse(JSON.stringify(h));

  it('the same year by any route is today\'s household, key for key — A, B and C, over random inputs (I2)', () => {
    const env = { today: TEST_ENV.today };
    const runs = [
      ['a', SCHEMA_A, toHousehold, (i) => Math.max(0, namedStopAge(i) - i.you.age)],
      ['b', SCHEMA_B, toHouseholdB, (i) => Math.max(0, i.stop.age - i.you.age)],
      ['c', SCHEMA_C, toHouseholdC, (i) => (i.start.kind === 'age' ? i.start.age - i.you.age : 0)]
    ];
    for (const [q, schema, map, Sof] of runs) {
      let couples = 0;
      const without = (o, ...keys) => Object.fromEntries(Object.entries(o).filter(([k]) => !keys.includes(k)));
      fc.assert(fc.property(arbitraryInputs(schema, env), (raw) => {
        // a form that never answered the new questions (what every existing state and fixture is)
        if (raw.stop && raw.stop.kind === 'already') return;
        const inputs = { ...without(raw, 'untilBothStop'), you: without(raw.you, 'taxFreeTaken'), ...(raw.partner ? { partner: without(raw.partner, 'stop', 'taxFreeTaken') } : {}) };
        const r = checkInputs(schema, inputs, env);
        if (!r.ok || r.inputs.household !== 'couple') return;
        couples++;
        const today = strip(map(r.inputs, env));
        for (const route of sameYearRoutes(r.inputs, Sof(r.inputs))) {
          const c = checkInputs(schema, route, env);
          expect(c.ok, `${q} ${JSON.stringify(c.errors)}`).toBe(true);
          expect(strip(map(c.inputs, env)), `${q} ${JSON.stringify(route.partner.stop)}`).toEqual(today);
        }
      }), { numRuns: 150, seed: 5 });
      expect(couples, q).toBeGreaterThan(10);
    }
  });
});
