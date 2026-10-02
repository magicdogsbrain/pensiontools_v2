/**
 * The household model (answer-C-and-household.md 1.2–1.5; build brief 6, P2): State Pension age and pension
 * access age by birth date; the start; expandHousehold's defaults; a partner with nothing; swapping the two
 * people; validateHousehold as data.
 */
import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import {
  statePensionAge, wholeStatePensionAge, pensionAccessAge, bornFromAge, ageOn, householdStart, startWhenPensionsOpen,
  expandHousehold, validateHousehold, HOUSEHOLD_LIMITS, stopsOf, startAsGiven, firstOpenAge, APART, PAY_COVERS
} from '../../src/answers/shared/household.js';
import { accessAgeOn } from '../../src/answers/shared/rules.js';
import { enginePlan, configsAt, breakdownAt, mixOf, savingsTargetFor, BANDS } from '../../src/answers/shared/toEngine.js';
import { fullStatePensionYearly, RULES } from '../../src/answers/shared/rules.js';
import { toHousehold } from '../../src/answers/c/toHousehold.js';
import { checkInputs } from '../../src/answers/shared/validate.js';
import { SCHEMA_C } from '../../src/answers/c/schema.js';
import { RISK_PRESETS } from '../../src/services/GlidepathService.js';
import { grossToNet } from '../../src/services/TaxCalculator.js';
import { createBandSolver, bandFrom, badCaseAge, bandIndexes, mostPerFuture } from '../../src/answers/shared/band.js';
import { futuresList, futureReturns, marketSeed, priceIndexByYear } from '../../src/answers/shared/futures.js';
import { bootstrapPaths, annualNominal } from '../../src/strategies/ladderEngine.js';

const TODAY = '2026-09-30';

describe('State Pension age by date of birth', () => {
  it.each([
    [{ year: 1959, month: 12, day: 1 }, { years: 66, months: 0 }],
    [{ year: 1960, month: 4, day: 5 }, { years: 66, months: 0 }],
    [{ year: 1960, month: 4, day: 6 }, { years: 66, months: 1 }],
    [{ year: 1960, month: 5, day: 5 }, { years: 66, months: 1 }],
    [{ year: 1960, month: 5, day: 6 }, { years: 66, months: 2 }],
    [{ year: 1960, month: 9, day: 30 }, { years: 66, months: 6 }],
    [{ year: 1961, month: 3, day: 5 }, { years: 66, months: 11 }],
    [{ year: 1961, month: 3, day: 6 }, { years: 67, months: 0 }],
    [{ year: 1968, month: 9, day: 30 }, { years: 67, months: 0 }],
    [{ year: 1977, month: 4, day: 5 }, { years: 67, months: 0 }],
    [{ year: 1977, month: 4, day: 6 }, { years: 67, months: 1 }],
    [{ year: 1977, month: 9, day: 30 }, { years: 67, months: 6 }],
    [{ year: 1978, month: 3, day: 6 }, { years: 68, months: 0 }],
    [{ year: 1978, month: 4, day: 5 }, { years: 68, months: 0 }],
    [{ year: 1978, month: 4, day: 6 }, { years: 68, months: 0 }],
    [{ year: 2000, month: 1, day: 1 }, { years: 68, months: 0 }]
  ])('born %j → %j', (born, want) => {
    expect(statePensionAge(born)).toEqual(want);
  });

  it('with month and year only, a birthday in a changeover month takes the later age', () => {
    expect(statePensionAge({ year: 1960, month: 4 })).toEqual({ years: 66, months: 1 });
    expect(statePensionAge({ year: 1961, month: 3 })).toEqual({ years: 67, months: 0 });
    expect(statePensionAge({ year: 1977, month: 4 })).toEqual({ years: 67, months: 1 });
    expect(statePensionAge({ year: 1978, month: 4 })).toEqual({ years: 68, months: 0 });
  });

  it('as a whole year for a person known by age alone: 66 and some months is 66 (already receiving it); 67 and some months is 68', () => {
    expect(wholeStatePensionAge(bornFromAge(66, TODAY))).toBe(66);
    expect(wholeStatePensionAge(bornFromAge(65, TODAY))).toBe(67);
    expect(wholeStatePensionAge(bornFromAge(58, TODAY))).toBe(67);
    expect(wholeStatePensionAge(bornFromAge(49, TODAY))).toBe(68);      // born 30 Sep 1977: 67 and 6 months → the later age
    expect(wholeStatePensionAge(bornFromAge(48, TODAY))).toBe(68);
    expect(wholeStatePensionAge(bornFromAge(70, TODAY))).toBe(66);
  });
});

describe('the earliest pension age, ages and dates', () => {
  it('55 before 6 April 2028, 57 from that day', () => {
    expect(pensionAccessAge(bornFromAge(50, TODAY), '2028-04-05')).toBe(55);
    expect(pensionAccessAge(bornFromAge(50, TODAY), '2028-04-06')).toBe(57);
    expect(pensionAccessAge(null, TODAY)).toBe(55);
  });
  it('the birthday is taken to be today', () => {
    expect(bornFromAge(58, TODAY)).toEqual({ year: 1968, month: 9, day: 30 });
    expect(ageOn({ year: 1968, month: 9, day: 30 }, TODAY)).toBe(58);
    expect(ageOn({ year: 1968, month: 9, day: 30 }, '2026-09-29')).toBe(57);
    expect(ageOn({ year: 1968, month: 10 }, TODAY)).toBe(57);          // no day: the birthday has not come yet
    expect(bornFromAge(30, '2028-02-29')).toEqual({ year: 1998, month: 2, day: 28 });
  });
});

describe('the household start', () => {
  const person = (over = {}) => ({ who: 'you', age: 58, stopWork: { kind: 'already' }, pots: { pension: 100000, isa: 0 }, statePension: { amountPerYear: 0, startAge: { years: 67, months: 0 } }, finalSalary: [], ...over });
  it('is today when everyone has stopped, else the earliest stop', () => {
    expect(householdStart({ people: [person()] }, TODAY)).toEqual({ date: TODAY, yearsFromNow: 0 });
    expect(householdStart({ people: [person({ stopWork: { kind: 'age', age: 60 } })] }, TODAY)).toEqual({ date: '2028-09-30', yearsFromNow: 2 });
    expect(householdStart({ people: [person({ stopWork: { kind: 'age', age: 60 } }), person({ who: 'partner', age: 55, stopWork: { kind: 'age', age: 56 } })] }, TODAY)).toEqual({ date: '2027-09-30', yearsFromNow: 1 });
    expect(householdStart({ people: [person({ stopWork: { kind: 'date', month: 6, year: 2027 } })] }, TODAY).yearsFromNow).toBe(1);
    expect(householdStart({ people: [person({ stopWork: { kind: 'age', age: 50 } })] }, TODAY).yearsFromNow).toBe(0);
  });
  it('moves to the first date every pension holder can touch their pension', () => {
    const s = startWhenPensionsOpen({ people: [person({ age: 50 })] }, TODAY);
    expect(s).toMatchObject({ yearsFromNow: 7, moved: true, movedBy: 7, locked: ['you'], accessAge: 57, date: '2033-09-30' });
    expect(startWhenPensionsOpen({ people: [person({ age: 54 })] }, TODAY)).toMatchObject({ yearsFromNow: 1, moved: true, accessAge: 55 });
    expect(startWhenPensionsOpen({ people: [person({ age: 56 })] }, TODAY)).toMatchObject({ yearsFromNow: 0, moved: false, accessAge: 55 });
    expect(startWhenPensionsOpen({ people: [person({ age: 50, pots: { pension: 0, isa: 50000 } })] }, TODAY)).toMatchObject({ moved: false, yearsFromNow: 0 });
    expect(startWhenPensionsOpen({ people: [person({ age: 60, pots: { pension: 0, isa: 0 } }), person({ who: 'partner', age: 30 })] }, TODAY)).toMatchObject({ yearsFromNow: 27, locked: ['partner'] });
  });
});

describe('expandHousehold: the short form becomes the full form, and every default is named', () => {
  it('fills the defaults of answer-C-and-household.md 1.4', () => {
    const { household, assumed } = expandHousehold({ people: [{ age: 58, pots: { total: 250000 } }] }, TODAY);
    const you = household.people[0];
    expect(you.who).toBe('you');
    expect(you.born).toEqual({ year: 1968, month: 9, day: 30 });
    expect(you.pots).toEqual({ pension: 250000, isa: 0, otherSavings: 0, cash: 0 });
    expect(you.statePension).toEqual({ amountPerYear: fullStatePensionYearly(), startAge: { years: 67, months: 0 }, source: 'default' });
    expect(you.stopWork).toEqual({ kind: 'already' });
    expect(you.pensionTaxFreeCash).toBe('notTakenYet');
    expect(household.planToAge).toBe(95);
    expect(household.portfolio).toEqual({ kind: 'risk', level: 'balanced' });
    expect(household.strategy).toEqual({ id: 'steady' });
    // 6.19.0: the household's one fund and platform charge, percent a year — 0.5 unless given, and said so
    expect(household.chargesPct).toBe(0.5);
    expect(assumed.map((a) => a.id)).toEqual(['all-pension', 'state-pension-full', 'state-pension-age', 'quarter-tax-free', 'plan-to', 'risk', 'steady', 'charges']);
  });
  it('the charge as given (0 to 3, percent a year) is kept as it is and not listed as assumed; a bad one is the default', () => {
    for (const chargesPct of [0, 0.05, 1.35, 3]) {
      const { household, assumed } = expandHousehold({ people: [{ age: 58, pots: { pension: 250000 } }], chargesPct }, TODAY);
      expect(household.chargesPct).toBe(chargesPct);
      expect(assumed.map((a) => a.id)).not.toContain('charges');
      expect(validateHousehold(household, TODAY)).toEqual([]);
    }
    for (const chargesPct of [-0.05, 3.05, NaN, '0.5', null]) {
      const { household, assumed } = expandHousehold({ people: [{ age: 58, pots: { pension: 250000 } }], chargesPct }, TODAY);
      expect(household.chargesPct, String(chargesPct)).toBe(0.5);
      expect(assumed.map((a) => a.id)).toContain('charges');
    }
    expect(HOUSEHOLD_LIMITS.chargesPct).toEqual({ min: 0, max: 3 });
    const h = expandHousehold({ people: [{ age: 58, pots: { pension: 250000 } }] }, TODAY).household;
    expect(validateHousehold({ ...h, chargesPct: 3.05 }, TODAY)).toEqual([{ field: 'chargesPct', problem: 'tooHigh' }]);
    expect(validateHousehold({ ...h, chargesPct: 'lots' }, TODAY)).toEqual([{ field: 'chargesPct', problem: 'notANumber' }]);
  });
  it('a couple: the partner stops when the first person does, and joint savings are split evenly as ISA money', () => {
    const { household, assumed } = expandHousehold({ people: [{ age: 59, pots: { pension: 600000 }, stopWork: { kind: 'age', age: 62 }, finalSalary: [{ amountPerYear: 9000, startAge: 60 }] }, { age: 57 }], jointSavings: 150000 }, TODAY);
    expect(household.people[1].stopWork).toEqual({ kind: 'age', age: 60 });
    expect(household.people.map((p) => p.pots.isa)).toEqual([75000, 75000]);
    expect(household.people[0].finalSalary).toEqual([{ amountPerYear: 9000, startAge: 60, increases: 'pricesCapped5' }]);
    expect(assumed.map((a) => a.id)).toContain('both-stop-together');
    expect(assumed.map((a) => a.id)).toContain('savings-split');
    expect(assumed.map((a) => a.id)).toContain('both-alive');
    expect(assumed.map((a) => a.id)).toContain('final-salary-rises');
  });
  it('an entered State Pension is not a default; a given start age is kept', () => {
    const { household, assumed } = expandHousehold({ people: [{ age: 68, statePension: { amountPerYear: 11000, startAge: { years: 66, months: 0 } } }] }, TODAY);
    expect(household.people[0].statePension).toEqual({ amountPerYear: 11000, startAge: { years: 66, months: 0 }, source: 'entered' });
    expect(assumed.map((a) => a.id)).not.toContain('state-pension-full');
    expect(assumed.map((a) => a.id)).not.toContain('state-pension-age');
  });
  it('the household survives JSON', () => {
    const { household } = expandHousehold({ people: [{ age: 58, pots: { pension: 1 } }] }, TODAY);
    expect(JSON.parse(JSON.stringify(household))).toEqual(household);
  });
});

describe('validateHousehold: problems as data, never a throw', () => {
  const good = () => expandHousehold({ people: [{ age: 58, pots: { pension: 250000 } }] }, TODAY).household;
  it('a good household has no problems', () => { expect(validateHousehold(good(), TODAY)).toEqual([]); });
  it('names the field and the problem', () => {
    const h = good();
    h.people[0].age = 17;
    h.people[0].pots.pension = -1;
    h.planToAge = 200;
    h.portfolio = { kind: 'risk', level: 'wild' };
    expect(validateHousehold(h, TODAY)).toEqual([
      { field: 'people.0.age', problem: 'tooLow' },
      { field: 'people.0.pots.pension', problem: 'tooLow' },
      { field: 'planToAge', problem: 'tooHigh' },
      { field: 'portfolio.level', problem: 'notAnOption' }
    ]);
    expect(validateHousehold({}, TODAY)).toEqual([{ field: 'people', problem: 'required' }, { field: 'planToAge', problem: 'required' }, { field: 'portfolio.kind', problem: 'notAnOption' }]);
    expect(validateHousehold(null, 'not a date').map((p) => p.field)).toContain('now');
  });
  it('the plan-to age must be after the younger person\'s age at the start', () => {
    const h = expandHousehold({ people: [{ age: 80, pots: { pension: 1000 } }], planToAge: 80 }, TODAY).household;
    expect(validateHousehold(h, TODAY)).toEqual([{ field: 'planToAge', problem: 'end-after-start' }]);
    expect(HOUSEHOLD_LIMITS.planToAge).toEqual({ min: 75, max: 105 });
  });
});

/*
 * Couples who stop work in different years (research/v7/couples-different-years.md 3.4, 4.1, 4.3 g). The household carries
 * each person's own stop; the same year is today's household, key for key.
 */
describe('couples who stop in different years: the household', () => {
  const ids = (r) => r.assumed.map((a) => a.id);
  const apartShort = (over = {}) => ({
    people: [{ age: 56, pots: { pension: 300000 }, stopWork: { kind: 'age', age: 57 } }, { age: 60, pots: { pension: 100000 }, stopWork: { kind: 'already' } }],
    jointSavings: 40000, ...over
  });

  it('the owner\'s three answers are one switch each: half by default, the pay makes up a gap, A and B can ask about the partner', () => {
    expect(APART).toEqual({ payCoversDefault: 'half', payCoversGap: true, askAboutPartner: true });
    expect(Object.isFrozen(APART)).toBe(true);
    expect(PAY_COVERS).toEqual({ half: 0.5, all: 1, none: 0 });
    expect(PAY_COVERS[APART.payCoversDefault]).toBe(0.5);
  });

  it('stopsOf: each person\'s whole years until they stop, and the year (from the household\'s start) their money joins', () => {
    const p = (who, age, stopWork) => ({ who, age, stopWork });
    expect(stopsOf({ people: [p('you', 56, { kind: 'age', age: 57 }), p('partner', 60, { kind: 'already' })] }, TODAY))
      .toEqual([{ who: 'you', S: 1, join: 1 }, { who: 'partner', S: 0, join: 0 }]);
    expect(stopsOf({ people: [p('you', 50, { kind: 'age', age: 55 }), p('partner', 54, { kind: 'age', age: 62 })] }, TODAY))
      .toEqual([{ who: 'you', S: 5, join: 0 }, { who: 'partner', S: 8, join: 3 }]);
    expect(stopsOf({ people: [p('you', 50, { kind: 'age', age: 55 }), p('partner', 48, { kind: 'age', age: 53 })] }, TODAY))
      .toEqual([{ who: 'you', S: 5, join: 0 }, { who: 'partner', S: 5, join: 0 }]);
    expect(stopsOf({ people: [p('you', 50, { kind: 'age', age: 52 })] }, TODAY)).toEqual([{ who: 'you', S: 2, join: 0 }]);
    expect(stopsOf({ people: [p('you', 50, { kind: 'age', age: 40 })] }, TODAY)).toEqual([{ who: 'you', S: 0, join: 0 }]);
  });

  it('the same year: today\'s household — no pay line, the savings split evenly, both-stop-together only when the partner\'s stop was not given', () => {
    const people = [{ age: 59, pots: { pension: 600000 }, stopWork: { kind: 'age', age: 62 } }, { age: 57, stopWork: { kind: 'age', age: 60 } }];
    const given = expandHousehold({ people, jointSavings: 150000, untilBothStop: { payCovers: 1 } }, TODAY);
    expect('untilBothStop' in given.household).toBe(false);
    expect(given.household.people.map((p) => p.pots.isa)).toEqual([75000, 75000]);
    expect(ids(given)).toContain('savings-split');
    for (const id of ['savings-first', 'stop-apart', 'both-stop-together']) expect(ids(given)).not.toContain(id);
    const derived = expandHousehold({ people: [people[0], { age: 57 }], jointSavings: 150000 }, TODAY);
    expect(derived.household).toEqual(given.household);
    expect(ids(derived)).toContain('both-stop-together');
    expect(ids(derived).filter((id) => id !== 'both-stop-together')).toEqual(ids(given));
  });

  it('apart: the savings between you go to whoever stops first; the pay line is kept as given, or half and said so', () => {
    const r = expandHousehold(apartShort(), TODAY);
    expect(r.household.people.map((p) => p.pots.isa)).toEqual([0, 40000]);
    expect(r.household.untilBothStop).toEqual({ payCovers: 0.5 });
    expect(ids(r)).toEqual(expect.arrayContaining(['savings-first', 'stop-apart']));
    for (const id of ['savings-split', 'both-stop-together']) expect(ids(r)).not.toContain(id);
    expect(validateHousehold(r.household, TODAY)).toEqual([]);
    for (const payCovers of [0, 0.5, 1]) {
      const g = expandHousehold(apartShort({ untilBothStop: { payCovers } }), TODAY);
      expect(g.household.untilBothStop).toEqual({ payCovers });
      expect(ids(g)).not.toContain('stop-apart');
    }
    for (const bad of [0.3, '1', null, {}]) {
      const g = expandHousehold(apartShort({ untilBothStop: bad && typeof bad === 'object' ? bad : { payCovers: bad } }), TODAY);
      expect(g.household.untilBothStop, JSON.stringify(bad)).toEqual({ payCovers: 0.5 });
      expect(ids(g)).toContain('stop-apart');
    }
    // the other way round: you stopped first, so the savings are yours
    const swapped = expandHousehold({ people: [apartShort().people[1], apartShort().people[0]], jointSavings: 40000 }, TODAY);
    expect(swapped.household.people.map((p) => p.pots.isa)).toEqual([40000, 0]);
    // one person: all theirs, as today, and nothing about stopping apart
    const one = expandHousehold({ people: [apartShort().people[0]], jointSavings: 40000, untilBothStop: { payCovers: 1 } }, TODAY);
    expect(one.household.people[0].pots.isa).toBe(40000);
    expect('untilBothStop' in one.household).toBe(false);
  });

  it('the tax-free part already taken is kept, and is not then assumed', () => {
    const r = expandHousehold({ people: [{ age: 60, pots: { pension: 100000 }, pensionTaxFreeCash: 'alreadyTaken' }] }, TODAY);
    expect(r.household.people[0].pensionTaxFreeCash).toBe('alreadyTaken');
    expect(ids(r)).not.toContain('quarter-tax-free');
  });

  it('validateHousehold: stopping apart needs the pay line (stop-together otherwise); a bad one is named', () => {
    const h = expandHousehold(apartShort(), TODAY).household;
    const { untilBothStop, ...without } = h;
    void untilBothStop;
    expect(validateHousehold(without, TODAY)).toEqual([{ field: 'people.1.stopWork', problem: 'stop-together' }]);
    expect(validateHousehold({ ...h, untilBothStop: { payCovers: 0.25 } }, TODAY)).toEqual([{ field: 'untilBothStop.payCovers', problem: 'notAnOption' }]);
    expect(validateHousehold({ ...h, untilBothStop: null }, TODAY)).toEqual([{ field: 'untilBothStop.payCovers', problem: 'notAnOption' }]);
    // a saver household too (A and B mark theirs with `saving`)
    const saver = expandHousehold({ ...apartShort(), saving: {} }, TODAY).household;
    expect(validateHousehold(saver, TODAY)).toEqual([]);
  });

  it('validateHousehold: the end must come after the later stop, and the later stop under 45 years after the first', () => {
    const at = (youAge, youStop, partnerAge, partnerStop, planToAge) => validateHousehold(expandHousehold({
      people: [{ age: youAge, pots: { pension: 100000 }, stopWork: youStop === null ? { kind: 'already' } : { kind: 'age', age: youStop } },
        { age: partnerAge, pots: { pension: 100000 }, stopWork: { kind: 'age', age: partnerStop } }], planToAge, saving: {} }, TODAY).household, TODAY);
    expect(at(70, null, 60, 75, 75)).toEqual([{ field: 'planToAge', problem: 'end-after-start' }]);
    expect(at(70, null, 60, 75, 76)).toEqual([]);
    expect(at(60, null, 30, 75, 105)).toEqual([{ field: 'planToAge', problem: 'end-after-start' }]);   // 45 years apart
    expect(at(60, null, 31, 75, 105)).toEqual([]);
    expect(at(76, 78, 74, 76, 77)).toEqual([]);                                                          // the same year: today's rule
    expect(at(76, 78, 74, 76, 76)).toEqual([{ field: 'planToAge', problem: 'end-after-start' }]);
  });

  it('startAsGiven: a closed pension is measured from its holder\'s own stop, its years counted from the household\'s start', () => {
    // your partner stopped already (their pension open); you stop at 56 in 2028, after the rise, so yours opens at 57
    const h = expandHousehold({ people: [{ age: 54, pots: { pension: 200000 }, stopWork: { kind: 'age', age: 56 } }, { age: 60, pots: { pension: 100000 }, stopWork: { kind: 'already' } }], saving: {} }, TODAY).household;
    expect(firstOpenAge(54, TODAY, 2)).toBe(57);
    expect(startAsGiven(h, TODAY)).toEqual({ date: TODAY, yearsFromNow: 0, moved: false, movedBy: 0, movedFor: [], locked: ['you'], lockedUntil: [{ who: 'you', untilAge: 57, years: 3 }], accessAge: 55 });
    // a partner who stopped at 50 waits for 57; you, stopping at 60 in three years, do not
    const k = expandHousehold({ people: [{ age: 57, pots: { pension: 200000 }, stopWork: { kind: 'age', age: 60 } }, { age: 50, pots: { pension: 100000 }, stopWork: { kind: 'already' } }], saving: {} }, TODAY).household;
    expect(startAsGiven(k, TODAY).lockedUntil).toEqual([{ who: 'partner', untilAge: 57, years: 7 }]);
  });

  /** startAsGiven as it was before each person had a stop of their own (6.19.0), frozen here for the same-year check. */
  function startAsGivenV1(household, now) {
    const base = householdStart(household, now);
    const lockedUntil = [];
    for (const p of household.people) {
      if (!(p.pots && p.pots.pension > 0)) continue;
      const first = firstOpenAge(p.age, now, base.yearsFromNow);
      const opensIn = first - (p.age + base.yearsFromNow);
      if (opensIn > 0) lockedUntil.push({ who: p.who, untilAge: first, years: opensIn });
    }
    return { date: base.date, yearsFromNow: base.yearsFromNow, moved: false, movedBy: 0, movedFor: [], locked: lockedUntil.map((l) => l.who), lockedUntil, accessAge: accessAgeOn(base.date) };
  }

  it('the same year, by any route: startAsGiven, householdStart and validateHousehold are today\'s, for any household', () => {
    const today = fc.constantFrom('2026-09-30', '2028-04-05', '2028-04-06', '2030-01-15');
    fc.assert(fc.property(today, fc.integer({ min: 18, max: 100 }), fc.integer({ min: 18, max: 100 }), fc.integer({ min: 0, max: 30 }),
      fc.constantFrom(0, 1, 250000), fc.constantFrom(0, 1, 90000), fc.boolean(), fc.integer({ min: 75, max: 105 }), (now, a, b, S, pa, pb, routeB, planToAge) => {
        const stopB = routeB ? { kind: 'age', age: b + S } : undefined;      // given as their age at your stop, or not given (derived)
        const short = { people: [{ age: a, pots: { pension: pa }, stopWork: S === 0 ? { kind: 'already' } : { kind: 'age', age: a + S } },
          { age: b, pots: { pension: pb }, ...(stopB ? { stopWork: stopB } : {}) }], jointSavings: 1000, planToAge, saving: {} };
        const { household } = expandHousehold(short, now);
        expect('untilBothStop' in household).toBe(false);
        expect(household.people.map((p) => p.pots.isa)).toEqual([500, 500]);
        expect(startAsGiven(household, now)).toEqual(startAsGivenV1(household, now));
        expect(stopsOf(household, now).map((s) => s.join)).toEqual([0, 0]);
      }), { numRuns: 400 });
  });
});

describe('the engine adapter', () => {
  const env = { today: TODAY };
  const inputsOf = (raw) => checkInputs(SCHEMA_C, raw, env).inputs;
  const planOf = (raw) => enginePlan(toHousehold(inputsOf(raw), env).household, env);

  it('builds one config per person with money, in the shape createSimulationConfigFromSettings builds', () => {
    const plan = planOf({ you: { pot: 250000, age: 58 } });
    expect(plan).toMatchObject({ years: 37, startAge: 58, endAge: 95, whose: 'you', accessAge: 55, start: '2026-09', yearsFromNow: 0, totalPots: 250000 });
    const [c] = configsAt(plan, 16560);
    expect(c.who).toBe('you');
    expect(c.config).toMatchObject({
      equityStart: 125000, bondStart: 100000, cashStart: 25000, equityMin: 125000, bondMin: 100000, cashTarget: 25000,
      years: 37, duration: 37, spStartYear: 9, spWeeklyAmount: RULES.fullStatePensionWeekly, spFirstYearRatio: 1,
      pa: 12570, brl: 50270, hrl: 125140, taxMode: 'inflates', disableProtection: true, accessMethod: 'ufpls', strategyId: 'pots-and-valves',
      isaBalance: 0, dbAmount: 0, hodlEnabled: false
    });
    expect(c.config.targetSchedule).toHaveLength(37);
    // before the State Pension the whole take-home comes from the pot; after it, the pot pays the rest
    expect(grossToNet(c.config.targetSchedule[0], BANDS.pa, BANDS.brl, BANDS.hrl)).toBeCloseTo(16560, 6);
    expect(grossToNet(c.config.targetSchedule[9], BANDS.pa, BANDS.brl, BANDS.hrl)).toBeCloseTo(16560, 6);
    expect(c.config.targetSchedule[9]).toBe(c.config.targetSchedule[0]);       // the same before-tax equivalent: the engine takes the State Pension off itself
    expect(c.config.baseSalary).toBe(c.config.targetSchedule[0]);
  });

  it('a person with savings but no pension pot runs without their pensions, fully taxable, on the before-tax value of their share', () => {
    const plan = planOf({ household: 'couple', you: { pot: 600000, age: 59 }, partner: { age: 57, pot: 0 }, savings: 150000 });
    const partner = plan.people[1];
    expect(partner.kind).toBe('savings');
    expect(partner.share).toBeCloseTo(75000 / 750000, 12);
    const cfg = configsAt(plan, 43320).find((c) => c.who === 'partner').config;
    expect(cfg).toMatchObject({ accessMethod: 'drawdown', spWeeklyAmount: 0, dbAmount: 0, isaBalance: 75000, equityStart: 0 });
    expect(grossToNet(cfg.targetSchedule[0], BANDS.pa, BANDS.brl, BANDS.hrl)).toBeCloseTo(partner.share * 43320, 6);
    expect(savingsTargetFor(0)).toBe(0);
    expect(grossToNet(savingsTargetFor(20000), BANDS.pa, BANDS.brl, BANDS.hrl)).toBeCloseTo(20000, 6);
  });

  it('a partner with nothing changes nothing in the plan but the labels', () => {
    const single = planOf({ you: { pot: 250000, age: 58 } });
    const couple = planOf({ household: 'couple', you: { pot: 250000, age: 58 }, partner: { age: 58, pot: 0, statePension: { kind: 'none' } } });
    expect(couple.people[1].kind).toBe('none');
    expect(configsAt(couple, 16560).map((c) => c.config)).toEqual(configsAt(single, 16560).map((c) => c.config));
    expect(breakdownAt(couple, 16560).map((p) => p.takeHome)).toEqual(breakdownAt(single, 16560).map((p) => p.takeHome));
  });

  it('swapping the two people gives the same configs in the same content order', () => {
    const a = planOf({ household: 'couple', you: { pot: 400000, age: 62, finalSalary: { has: true, yearly: 9000, fromAge: 65 } }, partner: { age: 60, pot: 150000 } });
    const b = planOf({ household: 'couple', you: { pot: 150000, age: 60 }, partner: { age: 62, pot: 400000, finalSalary: { has: true, yearly: 9000, fromAge: 65 } } });
    expect(configsAt(a, 30000).map((c) => c.config)).toEqual(configsAt(b, 30000).map((c) => c.config));
    expect(configsAt(a, 30000).map((c) => c.who)).toEqual(['partner', 'you']);
    expect(configsAt(b, 30000).map((c) => c.who)).toEqual(['you', 'partner']);
    expect(a.whose).toBe('partner');
    expect(b.whose).toBe('you');
  });

  it('the breakdown adds up and the guaranteed income fills the take-home first', () => {
    const plan = planOf({ you: { pot: 250000, age: 58 } });
    const per = breakdownAt(plan, 16560);
    expect(per).toHaveLength(2);
    expect(per[0]).toMatchObject({ from: 0, to: 9, takeHome: 16560, beforeStatePension: true });
    expect(per[1]).toMatchObject({ from: 9, to: 37, takeHome: 16560, beforeStatePension: false });
    const you = per[1].byPerson[0];
    expect(you.statePension).toBeCloseTo(fullStatePensionYearly(), 6);
    expect(you.statePension + you.fromPension + you.fromSavings - you.tax).toBeCloseTo(16560, 6);
    expect(you.fromPension).toBeCloseTo(4715, -1);
    // a small pot: the take-home from the State Pension on is the State Pension, whatever H
    const small = breakdownAt(planOf({ you: { pot: 30000, age: 60 } }), 4000);
    expect(small[1].takeHome).toBeCloseTo(fullStatePensionYearly(), 6);
    expect(small[1].byPerson[0].fromPension).toBeCloseTo(0, 6);
  });

  it('the years are capped at 45 and the plan says so; the mix follows the risk level', () => {
    const plan = planOf({ you: { pot: 100000, age: 30 }, endAge: 105 });
    expect(plan).toMatchObject({ years: 45, capped: true, startAge: 57, endAge: 102, startMoved: false, yearsFromNow: 27 });   // the form's default start is the first pension age
    const moved = planOf({ you: { pot: 100000, age: 30 }, start: { kind: 'now' }, endAge: 105 });
    expect(moved).toMatchObject({ years: 45, startAge: 57, startMoved: true, movedBy: 27, locked: ['you'] });
    expect(mixOf({ kind: 'risk', level: 'cautious' })).toEqual({ equity: RISK_PRESETS.cautious.equity, bond: RISK_PRESETS.cautious.bond, cash: RISK_PRESETS.cautious.cash });
    expect(mixOf({ kind: 'mix', equity: 1, bond: 0, cash: 0 })).toEqual({ equity: 1, bond: 0, cash: 0 });
  });
});

describe('the futures', () => {
  it('future i of seed 0 is the strategy comparison\'s future i: seed i × 7919 + 3', () => {
    expect(marketSeed(0)).toBe(3);
    expect(marketSeed(7)).toBe(7 * 7919 + 3);
    expect(marketSeed(7, 2)).toBe((2 * 100003 + 7) * 7919 + 3);
    const path = bootstrapPaths(7 * 7919 + 3, 20 * 12);
    expect(futureReturns(7, 20, { seed: 0 })).toEqual(annualNominal(path.rtr, path.cpi, 0, 20));
  });
  it('depends only on the seed, the count and the years — never on an amount', () => {
    const a = futuresList(5, 30, { seed: 0 });
    const b = futuresList(5, 30, { seed: 0 });
    expect(b).toEqual(a);
    expect(futuresList(5, 30, { seed: 1 })).not.toEqual(a);
    expect(a.map((f) => f.seed)).toEqual([0, 1, 2, 3, 4]);
  });
  it('a made-up future is filled in, and flat prices stay flat', () => {
    const r = futureReturns(0, 3, { futureReturns: () => ({ equity: { 0: 0.1 }, inflation: {} }) });
    expect(r.equity).toEqual({ 0: 0.1, 1: 0, 2: 0 });
    expect(r.inflation[1]).toBeGreaterThan(0);
    expect(r.inflation[1]).toBeLessThan(1e-9);
    expect(priceIndexByYear(r, 3)[2]).toBeCloseTo(1, 9);
  });
});

describe('the band', () => {
  it('positions, rounding down, and the age in a bad case', () => {
    expect(bandIndexes(40)).toEqual({ careful: 4, middling: 20, good: 36 });
    expect(bandIndexes(1000)).toEqual({ careful: 100, middling: 500, good: 900 });
    expect(bandIndexes(1)).toEqual({ careful: 0, middling: 0, good: 0 });
    const s = Array.from({ length: 40 }, (_, i) => 1000 + i * 25);
    expect(bandFrom(s)).toEqual({ careful: 1100, middling: 1500, good: 1900 });
    expect(badCaseAge([95, 95, 70, 95, 80, 95, 95, 95, 95, 95])).toBe(80);
  });
  it('the solver finds the same three amounts as searching every future on its own', () => {
    const env = { today: TODAY, seed: 0 };
    const plan = enginePlan(toHousehold(checkInputs(SCHEMA_C, { you: { pot: 250000, age: 58 } }, env).inputs, env).household, env);
    const futures = futuresList(20, plan.years, env);
    const solver = createBandSolver(plan, futures);
    const { k, fails } = solver.solve();
    const most = futures.map((f) => mostPerFuture(plan, f, { kLow: solver.kLow, kMax: solver.kMax })).sort((a, b) => a - b);
    expect({ careful: k.careful * 10, middling: k.middling * 10, good: k.good * 10 }).toEqual(bandFrom(most));
    expect(fails.careful).toBeLessThanOrEqual(2);
    expect(fails.middling).toBeLessThanOrEqual(10);
    expect(solver.evaluations).toBeLessThan(20 * 12);
  });
});
