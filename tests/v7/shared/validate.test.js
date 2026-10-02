/** validate.js — the only place a limit is checked (V7 build brief 4.1; package 1's first tests). */
import { describe, it, expect } from 'vitest';
import { SCHEMA_C, TEST_ENV } from '../c/_c.js';
import { SCHEMA_A } from '../a/_a.js';
import { SCHEMA_B } from '../b/_b.js';
import { defaults, fieldsThatApply, parseDraft, validate, checkInputs, flatten, nest, applies } from '../../../src/answers/shared/validate.js';
import { addYears, accessAgeOn, firstAccessAge } from '../../../src/answers/shared/rules.js';
import { apartCheckYear, payCoversOf } from '../../../src/answers/shared/schemaParts.js';
import { APART } from '../../../src/answers/shared/household.js';

const BASE = { 'you.pot': '250000', 'you.age': '58' };
const parse = (extra = {}, env = TEST_ENV) => parseDraft(SCHEMA_C, { ...BASE, ...extra }, env);
const LIMIT_ERRORS = ['required', 'notANumber', 'tooLow', 'tooHigh', 'notAnOption'];

/** A draft in which `field` applies: every `when` it has is switched on (a list: its first value). */
function draftWhere(field) {
  const d = { ...BASE };
  for (const [path, want] of Object.entries(field.when || {})) d[path] = Array.isArray(want) ? want[0] : want;
  if (d.household === 'couple') d['partner.age'] = '60';
  return d;
}

describe('parseDraft — text as typed', () => {
  it.each([['250,000', 250000], ['£250000', 250000], ['£ 250,000', 250000], [' 250 000 ', 250000], ['250000.50', 250000.5], ['0', 0]])(
    'money %j → %d', (text, value) => {
      const r = parse({ 'you.pot': text });
      expect(r.errors).toEqual({});
      expect(r.inputs.you.pot).toBe(value);
    });

  it.each([['', 'required'], ['   ', 'required'], ['abc', 'notANumber'], ['25o,000', 'notANumber'], ['-5', 'notANumber'],
    ['1e6', 'notANumber'], ['12.345', 'notANumber'], ['10,000,001', 'tooHigh']])('money %j → %s', (text, id) => {
    const r = parse({ 'you.pot': text });
    expect(r.ok).toBe(false);
    expect(r.inputs).toBeNull();
    expect(r.errors).toEqual({ 'you.pot': id });
  });

  it('ages are whole years', () => {
    expect(parse({ 'you.age': '58' }).inputs.you.age).toBe(58);
    expect(parse({ 'you.age': ' 58 ' }).inputs.you.age).toBe(58);
    expect(parse({ 'you.age': '58.5' }).errors).toEqual({ 'you.age': 'notANumber' });
    expect(parse({ 'you.age': 'fifty' }).errors).toEqual({ 'you.age': 'notANumber' });
    expect(parse({ 'you.age': '17' }).errors).toEqual({ 'you.age': 'tooLow' });
    expect(parse({ 'you.age': '101' }).errors).toEqual({ 'you.age': 'tooHigh' });
  });

  it('nothing typed: the two required boxes, and nothing else', () => {
    const r = parseDraft(SCHEMA_C, {}, TEST_ENV);
    expect(r.errors).toEqual({ 'you.pot': 'required', 'you.age': 'required' });
    expect(parseDraft(SCHEMA_C, undefined, TEST_ENV).errors).toEqual(r.errors);
  });

  it('a pot of nothing is a valid case', () => {
    expect(parse({ 'you.pot': '0' }).ok).toBe(true);
  });

  it('choices and yes/no', () => {
    expect(parse({ risk: 'adventurous' }).inputs.risk).toBe('adventurous');
    expect(parse({ risk: 'medium' }).errors).toEqual({ risk: 'notAnOption' });
    expect(parse({ 'you.finalSalary.has': true, 'you.finalSalary.yearly': '9,000', 'you.finalSalary.fromAge': '60' }).inputs.you.finalSalary)
      .toEqual({ has: true, yearly: 9000, fromAge: 60 });
    expect(parse({ 'you.finalSalary.has': true }).errors).toEqual({ 'you.finalSalary.yearly': 'required', 'you.finalSalary.fromAge': 'required' });
  });

  it('fields that do not apply are left out, whatever was typed in them', () => {
    const r = parse({ 'partner.age': '60', 'partner.pot': 'abc', 'you.statePension.yearly': 'abc', 'you.finalSalary.yearly': '1' });
    expect(r.ok).toBe(true);
    expect(r.inputs.partner).toBeUndefined();
    expect(r.inputs.you.statePension).toEqual({ kind: 'full' });
    expect(r.inputs.you.finalSalary).toEqual({ has: false });
  });

  it('a couple: the partner block applies, the pot starts at nothing', () => {
    const r = parse({ household: 'couple', 'partner.age': '60' });
    expect(r.ok).toBe(true);
    expect(r.inputs.partner).toEqual({ age: 60, pot: 0, statePension: { kind: 'full' }, finalSalary: { has: false } });
    expect(parse({ household: 'couple' }).errors).toEqual({ 'partner.age': 'required' });
  });

  it('usedDefault lists every default that was used, and not the ones typed over', () => {
    expect(parse().usedDefault).toEqual(['household', 'start.kind', 'you.statePension.kind', 'you.finalSalary.has', 'savings', 'risk', 'charge', 'endAge']);
    expect(parse({ risk: 'cautious', charge: '0.75', endAge: '90', savings: '5000', take: '1500' }).usedDefault)
      .toEqual(['household', 'start.kind', 'you.statePension.kind', 'you.finalSalary.has']);
    expect(parse({ take: '1,500' }).inputs.take).toBe(1500);
    expect(parse().inputs.take).toBeNull();
  });

  it('`values` keeps what did parse, even when something else is wrong', () => {
    const r = parseDraft(SCHEMA_C, { 'you.pot': '250,000' }, TEST_ENV);
    expect(r.ok).toBe(false);
    expect(r.values['you.pot']).toBe(250000);
  });

  it('is pure: the same draft twice, and the draft itself untouched', () => {
    const draft = Object.freeze({ ...BASE, household: 'couple', 'partner.age': '60' });
    expect(parseDraft(SCHEMA_C, draft, TEST_ENV)).toEqual(parseDraft(SCHEMA_C, draft, TEST_ENV));
  });
});

describe('every boundary passes; one below and one above fail', () => {
  const numbers = SCHEMA_C.fields.filter((f) => f.boundaries);
  it.each(numbers.map((f) => [f.path, f]))('%s', (_p, f) => {
    for (const b of f.boundaries) {
      const e = parseDraft(SCHEMA_C, { ...draftWhere(f), [f.path]: String(b) }, TEST_ENV).errors[f.path];
      expect(LIMIT_ERRORS, `${f.path} = ${b} gave ${e}`).not.toContain(e);
    }
    const below = parseDraft(SCHEMA_C, { ...draftWhere(f), [f.path]: String(f.min - 1) }, TEST_ENV).errors[f.path];
    expect(f.min === 0 ? 'notANumber' : 'tooLow').toBe(below);   // "-1" is not a number a person can mean
    expect(parseDraft(SCHEMA_C, { ...draftWhere(f), [f.path]: String(f.max + 1) }, TEST_ENV).errors[f.path]).toBe('tooHigh');
    // the same limits for real values (what answerC is given)
    const typed = (v) => checkInputs(SCHEMA_C, nest({ ...draftTyped(f), [f.path]: v }), TEST_ENV).errors[f.path];
    expect(typed(f.min - 1)).toBe('tooLow');
    expect(typed(f.max + 1)).toBe('tooHigh');
    expect(LIMIT_ERRORS).not.toContain(typed(f.min));
    expect(LIMIT_ERRORS).not.toContain(typed(f.max));
  });
  function draftTyped(f) {
    const d = { 'you.pot': 250000, 'you.age': 58 };
    for (const [path, want] of Object.entries(f.when || {})) d[path] = Array.isArray(want) ? want[0] : want;
    if (d.household === 'couple') d['partner.age'] = 60;
    return d;
  }
});

/*
 * Couples who stop work in different years (research/v7/couples-different-years.md 3.2): a field's `when` may give a list
 * ("one of"), and `whenNot` hides a field ("none of"). One rule, exported, so the screen and the screen test use it too.
 */
describe('`when` with a list, `whenNot`, and the one exported `applies`', () => {
  it('a plain value is today\'s rule; a list means "one of"; `whenNot` means "none of", and not answered is none of them', () => {
    const plain = { path: 'p', when: { k: 'x' } };
    expect([applies(plain, { k: 'x' }), applies(plain, { k: 'y' }), applies(plain, {})]).toEqual([true, false, false]);
    const list = { path: 'l', when: { k: ['x', 'y'] } };
    expect(['x', 'y', 'z', undefined].map((k) => applies(list, { k }))).toEqual([true, true, false, false]);
    const not = { path: 'n', whenNot: { k: 'x' } };
    expect(['x', 'y', undefined].map((k) => applies(not, { k }))).toEqual([false, true, true]);
    const notList = { path: 'm', whenNot: { k: ['x', 'y'] } };
    expect(['x', 'y', 'z', undefined].map((k) => applies(notList, { k }))).toEqual([false, false, true, true]);
    const both = { path: 'b', when: { household: 'couple', k: ['x', 'y'] }, whenNot: { j: true } };
    expect(applies(both, { household: 'couple', k: 'y' })).toBe(true);
    expect(applies(both, { household: 'couple', k: 'y', j: true })).toBe(false);
    expect(applies(both, { household: 'single', k: 'y' })).toBe(false);
    expect(applies({ path: 'free' }, {})).toBe(true);
    expect(applies(plain, undefined)).toBe(false);
    expect(applies({ path: 'free' }, undefined)).toBe(true);
  });

  it('the walk, defaults() and fieldsThatApply all read it', () => {
    const SCHEMA = { id: 't', rules: [], fields: [
      { path: 'k', type: 'choice', options: ['x', 'y', 'z'], default: 'x', group: 'g' },
      { path: 'inList', type: 'age', min: 18, max: 100, default: 50, group: 'g', boundaries: [18, 100], when: { k: ['y', 'z'] } },
      { path: 'notX', type: 'age', min: 18, max: 100, default: 60, group: 'g', boundaries: [18, 100], whenNot: { k: 'x' } },
      { path: 'free', type: 'yesNo', group: 'g', whenNot: { k: ['z'] } }
    ] };
    expect(parseDraft(SCHEMA, {}, TEST_ENV).inputs).toEqual({ k: 'x' });
    expect(parseDraft(SCHEMA, { k: 'y', inList: '40', notX: '41', free: 'yes' }, TEST_ENV).inputs).toEqual({ k: 'y', inList: 40, notX: 41, free: true });
    expect(parseDraft(SCHEMA, { k: 'z', inList: '40', notX: '41', free: 'yes' }, TEST_ENV).inputs).toEqual({ k: 'z', inList: 40, notX: 41 });
    expect(parseDraft(SCHEMA, { k: 'x', inList: '40', notX: '41', free: 'no' }, TEST_ENV).inputs).toEqual({ k: 'x', free: false });
    expect(defaults(SCHEMA, { k: 'y' }, TEST_ENV)).toEqual({ k: 'x', inList: 50, notX: 60 });
    expect(fieldsThatApply(SCHEMA, { k: 'z' }).map((f) => f.path)).toEqual(['k', 'inList', 'notX']);
    expect(checkInputs(SCHEMA, { k: 'y', inList: 40 }, TEST_ENV).inputs).toEqual({ k: 'y', inList: 40, notX: 60 });
  });
});

/*
 * C with a partner who stops on their own date (couples-different-years.md 3.1, 3.3, 5.1). Not answered is today's meaning:
 * the partner starts with you, and the checked inputs are today's, key for key.
 */
describe('C: the partner\'s own stop, and the rules that read each person\'s stop', () => {
  const couple = (extra = {}) => parse({ household: 'couple', 'partner.age': '56', 'partner.pot': '100000', ...extra });

  it('not answered leaves today\'s inputs; "when you do" and an age keep their answer; C has no "show me ages"', () => {
    expect(couple().inputs.partner).toEqual({ age: 56, pot: 100000, statePension: { kind: 'full' }, finalSalary: { has: false } });
    expect('untilBothStop' in couple().inputs).toBe(false);
    expect(couple({ 'partner.stop.kind': 'same' }).inputs.partner.stop).toEqual({ kind: 'same' });
    expect(couple({ 'partner.stop.kind': 'age', 'partner.stop.age': '60' }).inputs.partner.stop).toEqual({ kind: 'age', age: 60 });
    expect(couple({ 'partner.stop.kind': 'age' }).errors).toEqual({ 'partner.stop.age': 'required' });
    expect(couple({ 'partner.stop.kind': 'ages' }).errors).toEqual({ 'partner.stop.kind': 'notAnOption' });
    expect(parse({ 'partner.stop.kind': 'already' }).inputs.partner).toBeUndefined();          // one person: nothing of the partner's
  });

  it('partner-stop-not-before-now: their age today is stopping now; younger is refused; 75 is the ceiling', () => {
    expect(couple({ 'partner.stop.kind': 'age', 'partner.stop.age': '55' }).errors).toEqual({ 'partner.stop.age': 'partner-stop-not-before-now' });
    expect(couple({ 'partner.stop.kind': 'age', 'partner.stop.age': '56' }).ok).toBe(true);
    expect(couple({ 'partner.stop.kind': 'age', 'partner.stop.age': '75' }).ok).toBe(true);
    expect(couple({ 'partner.stop.kind': 'age', 'partner.stop.age': '76' }).errors).toEqual({ 'partner.stop.age': 'tooHigh' });
  });

  it('the pay line applies only while one of you is still working, and has no default', () => {
    expect('untilBothStop' in couple({ untilBothStop: 'all' }).inputs).toBe(false);
    expect('untilBothStop' in couple({ 'partner.stop.kind': 'same', untilBothStop: 'all' }).inputs).toBe(false);
    expect(couple({ 'partner.stop.kind': 'already', untilBothStop: 'all' }).inputs.untilBothStop).toBe('all');
    expect(couple({ 'partner.stop.kind': 'age', 'partner.stop.age': '60', untilBothStop: 'none' }).inputs.untilBothStop).toBe('none');
    expect('untilBothStop' in couple({ 'partner.stop.kind': 'already' }).inputs).toBe(false);   // not answered: half (the household says so)
    expect(couple({ 'partner.stop.kind': 'already', untilBothStop: 'most' }).errors).toEqual({ untilBothStop: 'notAnOption' });
  });

  it('"They already have" hides the partner\'s paying-in block; the tax-free part is asked only of someone who has stopped', () => {
    const r = couple({ 'partner.stop.kind': 'already', 'partner.payIn.has': 'yes', 'partner.payIn.own': '300', 'partner.payIn.employer': '0', 'partner.taxFreeTaken': 'yes', 'you.taxFreeTaken': 'yes' });
    expect(r.ok).toBe(true);
    expect(r.inputs.partner).toEqual({ age: 56, pot: 100000, statePension: { kind: 'full' }, finalSalary: { has: false }, stop: { kind: 'already' }, taxFreeTaken: true });
    expect(r.inputs.you.taxFreeTaken).toBe(true);                                                   // C from now: you have stopped
    expect('taxFreeTaken' in parse({ 'start.kind': 'age', 'start.age': '60', 'you.taxFreeTaken': 'yes' }).inputs.you).toBe(false);
    expect('taxFreeTaken' in couple({ 'partner.stop.kind': 'age', 'partner.stop.age': '60', 'partner.taxFreeTaken': 'yes' }).inputs.partner).toBe(false);
    expect('taxFreeTaken' in parse().inputs.you).toBe(false);                                       // not answered: not taken (today's line)
  });

  it('end-after-start looks at the later stop, and the later stop must be under 45 years after the first', () => {
    const at = (youAge, partnerAge, stopAge, endAge) => parse({ 'you.age': String(youAge), household: 'couple', 'partner.age': String(partnerAge),
      'partner.stop.kind': 'age', 'partner.stop.age': String(stopAge), endAge: String(endAge) }).errors;
    expect(at(70, 60, 75, 75)).toEqual({ endAge: 'end-after-start' });                  // the younger is 75 when the second stops
    expect(at(70, 60, 75, 76)).toEqual({});
    expect(parse({ 'you.age': '70', household: 'couple', 'partner.age': '60', endAge: '75' }).ok).toBe(true);   // not answered: today's rule
    expect(at(60, 30, 75, 105)).toEqual({ endAge: 'end-after-start' });                 // 45 years apart
    expect(at(60, 31, 75, 105)).toEqual({});                                            // 44
  });

  it('start-not-before-access is checked where the pay stops covering: the second stop (half or all), the first under "None of it"', () => {
    // You stop at 57 next year, when your pension opens; your partner stopped at 50 and theirs is closed until 57. No savings.
    const base = { 'you.age': '56', 'start.kind': 'age', 'start.age': '57', household: 'couple', 'partner.age': '50', 'partner.pot': '100000', 'partner.stop.kind': 'already' };
    expect(parse(base).ok).toBe(true);                                                              // half: the pay covers until you stop
    expect(parse({ ...base, untilBothStop: 'all' }).ok).toBe(true);
    expect(parse({ ...base, untilBothStop: 'none' }).errors).toEqual({ 'start.age': 'start-not-before-access' });
    expect(parse({ ...base, untilBothStop: 'none', savings: '5000' }).ok).toBe(true);
    // every pension still closed at the second stop: refused whatever the pay covers, unless there are savings
    const closed = { 'you.age': '40', 'start.kind': 'age', 'start.age': '45', household: 'couple', 'partner.age': '40', 'partner.pot': '100000', 'partner.stop.kind': 'already' };
    expect(parse(closed).errors).toEqual({ 'start.age': 'start-not-before-access' });
    expect(parse({ ...closed, savings: '1' }).ok).toBe(true);
  });

  it('where the check is made: the owner\'s switches 1 and 2, one each', () => {
    expect(payCoversOf(undefined)).toBe(0.5);                                       // switch 1: not answered is half
    expect([payCoversOf('half'), payCoversOf('all'), payCoversOf('none'), payCoversOf('most')]).toEqual([0.5, 1, 0, 0.5]);
    const stops = { you: 1, partner: 0 };
    expect(APART.payCoversGap).toBe(true);
    expect([0.5, 1, 0].map((c) => apartCheckYear(stops, c))).toEqual([1, 1, 0]);      // switch 2 on: half and all at the second stop
    expect([0.5, 1, 0].map((c) => apartCheckYear(stops, c, false))).toEqual([0, 1, 0]);   // off: half at the first (all still pays nothing before)
    expect(apartCheckYear({ you: 3, partner: 3 }, 0)).toBe(3);                       // one year: that year
    expect(apartCheckYear({ you: 4, partner: null }, 0.5)).toBe(4);
    expect(apartCheckYear({}, 0.5)).toBeNull();
  });

  it('pay-in-past-75 is per person, at their own stop', () => {
    const base = { 'you.age': '60', 'start.kind': 'age', 'start.age': '70', household: 'couple', 'partner.age': '72',
      'partner.payIn.has': 'yes', 'partner.payIn.own': '200', 'partner.payIn.employer': '0' };
    expect(parse(base).errors).toEqual({ 'start.age': 'pay-in-past-75-partner' });                       // stopping with you, at 82
    expect(parse({ ...base, 'partner.stop.kind': 'same' }).errors).toEqual({ 'start.age': 'pay-in-past-75-partner' });
    expect(parse({ ...base, 'partner.stop.kind': 'age', 'partner.stop.age': '74' }).ok).toBe(true);        // their own stop, at 74
  });

  it('the same year by any route is today\'s check: "when you do", or their age at your start', () => {
    const drafts = [
      { 'you.age': '50', 'start.kind': 'age', 'start.age': '54', household: 'couple', 'partner.age': '52', 'partner.pot': '1' },
      { 'you.age': '60', 'start.kind': 'age', 'start.age': '70', household: 'couple', 'partner.age': '72', 'partner.payIn.has': 'yes', 'partner.payIn.own': '200', 'partner.payIn.employer': '0' },
      { 'you.age': '76', household: 'couple', 'partner.age': '75', endAge: '75' },
      { 'you.age': '40', 'start.kind': 'age', 'start.age': '45', household: 'couple', 'partner.age': '40', endAge: '84' }
    ];
    for (const d of drafts) {
      const S = d['start.kind'] === 'age' ? Number(d['start.age']) - Number(d['you.age']) : 0;
      const today = parse(d).errors;
      expect(Object.keys(today).length, JSON.stringify(d)).toBe(1);                       // each draft is refused today, for one reason
      expect(parse({ ...d, 'partner.stop.kind': 'same' }).errors, JSON.stringify(d)).toEqual(today);
      const theirs = Number(d['partner.age']) + S;
      if (theirs <= 75) expect(parse({ ...d, 'partner.stop.kind': 'age', 'partner.stop.age': String(theirs) }).errors, JSON.stringify(d)).toEqual(today);
    }
  });
});

describe('defaults by rule: when the money starts', () => {
  const start = (age, today, pot = '250000') => parseDraft(SCHEMA_C, { 'you.pot': pot, 'you.age': String(age) }, { ...TEST_ENV, today }).inputs.start;

  it('before 6 April 2028 the earliest pension age is 55', () => {
    expect(start(54, '2028-04-05')).toEqual({ kind: 'age', age: 57 });   // 55 comes after the change
    expect(start(55, '2028-04-05')).toEqual({ kind: 'now' });
    expect(start(56, '2028-04-05')).toEqual({ kind: 'now' });
    expect(start(57, '2028-04-05')).toEqual({ kind: 'now' });
  });

  it('from 6 April 2028 it is 57', () => {
    expect(start(54, '2028-04-06')).toEqual({ kind: 'age', age: 57 });
    expect(start(55, '2028-04-06')).toEqual({ kind: 'age', age: 57 });
    expect(start(56, '2028-04-06')).toEqual({ kind: 'age', age: 57 });
    expect(start(57, '2028-04-06')).toEqual({ kind: 'now' });
  });

  it('today (30 Sep 2026): 54 reaches 55 before the change, 53 does not', () => {
    expect(start(54, '2026-09-30')).toEqual({ kind: 'age', age: 55 });
    expect(start(53, '2026-09-30')).toEqual({ kind: 'age', age: 57 });
    expect(start(55, '2026-09-30')).toEqual({ kind: 'now' });
    expect(start(40, '2026-09-30')).toEqual({ kind: 'age', age: 57 });
  });

  it('with no pot there is nothing to wait for', () => {
    expect(start(50, '2026-09-30', '0')).toEqual({ kind: 'now' });
  });

  it('defaults() lists every default that applies', () => {
    expect(defaults(SCHEMA_C, { 'you.pot': 250000, 'you.age': 50 }, TEST_ENV)).toEqual({
      household: 'single', 'start.kind': 'age', 'start.age': 57, 'you.statePension.kind': 'full', 'you.finalSalary.has': false,
      savings: 0, risk: 'balanced', charge: 0.5, endAge: 95, take: null
    });
    expect(defaults(SCHEMA_C, { household: 'couple' }, TEST_ENV)).toMatchObject({ 'partner.pot': 0, 'partner.statePension.kind': 'full' });
    expect(defaults(SCHEMA_C, {}, TEST_ENV)['start.kind']).toBe('now');   // no age yet: nothing to work it out from
  });

  it('the date helpers', () => {
    expect(addYears('2026-09-30', 1)).toBe('2027-09-30');
    expect(addYears('2028-02-29', 1)).toBe('2029-02-28');
    expect(addYears('2028-02-29', 4)).toBe('2032-02-29');
    expect(accessAgeOn('2028-04-05')).toBe(55);
    expect(accessAgeOn('2028-04-06')).toBe(57);
    expect(firstAccessAge(60, '2026-09-30')).toBe(55);
    expect(firstAccessAge(60, '2030-01-01')).toBe(57);
  });
});

describe('the three rules between fields', () => {
  it('start-not-before-now', () => {
    expect(parse({ 'start.kind': 'age', 'start.age': '57' }).errors).toEqual({ 'start.age': 'start-not-before-now' });
    expect(parse({ 'start.kind': 'age', 'start.age': '58' }).ok).toBe(true);
    expect(parse({ 'start.kind': 'age', 'start.age': '62' }).inputs.start).toEqual({ kind: 'age', age: 62 });
  });

  it('start-not-before-access, only when there is a pot', () => {
    const at = (age, startAge, pot = '250000') => parseDraft(SCHEMA_C, { 'you.pot': pot, 'you.age': String(age), 'start.kind': 'age', 'start.age': String(startAge) }, TEST_ENV).errors;
    expect(at(50, 54)).toEqual({ 'start.age': 'start-not-before-access' });
    expect(at(50, 56)).toEqual({ 'start.age': 'start-not-before-access' });   // 56 in 2032: the age is 57 by then
    expect(at(50, 57)).toEqual({});
    expect(at(54, 55)).toEqual({});                                            // 55 in 2027: still 55
    expect(at(50, 54, '0')).toEqual({});
  });

  it('end-after-start, by the younger person\'s age at the start', () => {
    expect(parse({ 'you.age': '80', endAge: '80' }).errors).toEqual({ endAge: 'end-after-start' });
    expect(parse({ 'you.age': '80', endAge: '81' }).ok).toBe(true);
    expect(parse({ 'you.age': '70', 'start.kind': 'age', 'start.age': '76', endAge: '76' }).errors).toEqual({ endAge: 'end-after-start' });
    // a couple: the older is 90, the younger 70 — the younger's age decides
    expect(parse({ 'you.age': '90', household: 'couple', 'partner.age': '70', endAge: '75' }).ok).toBe(true);
    expect(parse({ 'you.age': '70', household: 'couple', 'partner.age': '90', endAge: '75' }).ok).toBe(true);
    expect(parse({ 'you.age': '76', household: 'couple', 'partner.age': '80', endAge: '76' }).errors).toEqual({ endAge: 'end-after-start' });
  });

  it('a field\'s own problem is reported before a rule', () => {
    expect(parse({ 'start.kind': 'age', 'start.age': '17' }).errors).toEqual({ 'start.age': 'tooLow' });
  });
});

describe('the two types of step 4: percent and count (brief, conflict 25)', () => {
  // A list of its own, so the types are tested apart from any question's list.
  const SCHEMA = {
    id: 't',
    fields: [
      { path: 'you.age', type: 'age', min: 18, max: 100, required: true, group: 'you', boundaries: [18, 100] },
      { path: 'charge', type: 'percent', min: 0, max: 2, default: 0.5, group: 'more', boundaries: [0, 0.5, 1, 2] },
      { path: 'years', type: 'count', min: 1, max: 15, default: 3, group: 'more', boundaries: [1, 15] }
    ],
    rules: []
  };
  const p = (values) => parseDraft(SCHEMA, { 'you.age': '50', ...values }, TEST_ENV);
  it.each([['0.5', 0.5], ['0.5%', 0.5], ['0.5 %', 0.5], [' 1 ', 1], ['1%', 1], ['0', 0], ['2', 2], ['2.0', 2], ['1.5', 1.5]])('percent %j → %s', (text, value) => {
    expect(p({ charge: text }).inputs.charge).toBe(value);
  });
  it.each([['abc', 'notANumber'], ['0.55', 'notANumber'], ['-1', 'notANumber'], ['.5', 'notANumber'], ['1e0', 'notANumber'], ['£1', 'notANumber'],
    ['2.1', 'tooHigh'], ['3', 'tooHigh']])('percent %j → %s', (text, id) => {
    expect(p({ charge: text }).errors).toEqual({ charge: id });
  });
  it.each([['3', 3], [' 5 ', 5], ['15', 15], ['1', 1], ['007', 7]])('count %j → %s', (text, value) => {
    expect(p({ years: text }).inputs.years).toBe(value);
  });
  it.each([['three', 'notANumber'], ['2.5', 'notANumber'], ['2 days a week', 'notANumber'], ['-1', 'notANumber'], ['0', 'tooLow'], ['16', 'tooHigh']])('count %j → %s', (text, id) => {
    expect(p({ years: text }).errors).toEqual({ years: id });
  });
  it('blank falls back to the default; the same limits for real values', () => {
    expect(p({}).inputs).toEqual({ you: { age: 50 }, charge: 0.5, years: 3 });
    const typed = (extra) => checkInputs(SCHEMA, { you: { age: 50 }, ...extra }, TEST_ENV).errors;
    expect(typed({ charge: 1.5, years: 2 })).toEqual({});
    expect(typed({ charge: 0.55 })).toEqual({ charge: 'notANumber' });
    expect(typed({ charge: '1' })).toEqual({ charge: 'notANumber' });
    expect(typed({ years: 2.5 })).toEqual({ years: 'notANumber' });
    expect(typed({ years: '2' })).toEqual({ years: 'notANumber' });
    expect(typed({ charge: 2.1 })).toEqual({ charge: 'tooHigh' });
    expect(typed({ years: 0 })).toEqual({ years: 'tooLow' });
  });
});

/*
 * Fund and platform charges (6.19.0; research/charges-setting.md T12): a percent field may name its `step`. The charge's
 * is 0.05 — "0.45" and "2.95" are charges, "0.07" and "0.123" are not, "3.05" is over the top. A percent without a step
 * keeps one figure after the point (steps of 0.1), as before.
 */
describe('percent in steps: the charge, 0 to 3 in steps of 0.05', () => {
  const SCHEMA = {
    id: 't',
    fields: [
      { path: 'you.age', type: 'age', min: 18, max: 100, required: true, group: 'you', boundaries: [18, 100] },
      { path: 'charge', type: 'percent', min: 0, max: 3, step: 0.05, default: 0.5, group: 'more', boundaries: [0, 0.05, 0.5, 1, 3] }
    ],
    rules: []
  };
  const p = (values) => parseDraft(SCHEMA, { 'you.age': '50', ...values }, TEST_ENV);
  const typed = (extra) => checkInputs(SCHEMA, { you: { age: 50 }, ...extra }, TEST_ENV).errors;
  it.each([['0.05', 0.05], ['0.45', 0.45], ['0.45%', 0.45], ['2.95', 2.95], ['3', 3], ['0', 0], ['1.5', 1.5], ['0.10', 0.1], ['0.5', 0.5]])('percent %j → %s', (text, value) => {
    expect(p({ charge: text }).inputs.charge).toBe(value);
  });
  it.each([['0.07', 'notANumber'], ['0.123', 'notANumber'], ['1.01', 'notANumber'], ['.05', 'notANumber'], ['3.05', 'tooHigh'], ['4', 'tooHigh']])('percent %j → %s', (text, id) => {
    expect(p({ charge: text }).errors).toEqual({ charge: id });
  });
  it('the same steps for real values', () => {
    for (const v of [0, 0.05, 0.15, 0.45, 1.35, 2.95, 3]) expect(typed({ charge: v }), String(v)).toEqual({});
    for (const v of [0.07, 0.01, 1.234]) expect(typed({ charge: v }), String(v)).toEqual({ charge: 'notANumber' });
    expect(typed({ charge: 3.05 })).toEqual({ charge: 'tooHigh' });
  });
});

// The nightly run, 1 Oct 2026 (C's M2 and M6, A's PA1): each box holds up to £10,000, but what one person pays in a month
// is checked on the two parts together (the household check, HOUSEHOLD_LIMITS); £5,000 + £5,001 passed the form and the
// answer then came back "invalid" naming people.0.saving.payIn.total — no box to point at, so the screen said only "we
// could not work that out". The form says it instead, on the employer's part (step 4 brief section 10, J14).
describe('pay-in-over-limit: a person\'s two parts together, in all three lists', () => {
  const LISTS = [
    ['C', SCHEMA_C, { 'you.pot': '250000', 'you.age': '55', 'start.kind': 'age', 'start.age': '67', 'you.payIn.has': 'yes', 'you.payIn.kind': 'split' }, { 'partner.payIn.has': 'yes', 'partner.payIn.kind': 'split' }],
    ['A', SCHEMA_A, { 'you.pot': '250000', 'you.age': '55', 'stop.kind': 'age', 'stop.age': '67', 'spend.kind': 'amount', 'spend.amount': '2000', 'you.payIn.kind': 'split' }, { 'partner.payIn.kind': 'split' }],
    ['B', SCHEMA_B, { 'you.pot': '250000', 'you.age': '55', 'stop.age': '67', 'spend.kind': 'amount', 'spend.amount': '2000', 'you.payIn.kind': 'split' }, { 'partner.payIn.kind': 'split' }]
  ];
  it.each(LISTS)('%s: £5,000 + £5,001 is refused on the employer\'s part; £5,000 + £5,000 is fine; a partner the same', (_q, schema, base, partner) => {
    const p = (extra) => parseDraft(schema, { ...base, ...extra }, TEST_ENV);
    expect(p({ 'you.payIn.own': '5000', 'you.payIn.employer': '5001' }).errors).toEqual({ 'you.payIn.employer': 'pay-in-over-limit' });
    expect(p({ 'you.payIn.own': '5000', 'you.payIn.employer': '5000' }).ok).toBe(true);
    expect(p({ 'you.payIn.own': '10000', 'you.payIn.employer': '0' }).ok).toBe(true);
    const two = { household: 'couple', 'partner.age': '53', 'partner.pot': '0', ...partner, 'you.payIn.own': '500', 'you.payIn.employer': '300' };
    expect(p({ ...two, 'partner.payIn.own': '9000', 'partner.payIn.employer': '1001' }).errors).toEqual({ 'partner.payIn.employer': 'pay-in-over-limit' });
    // a box's own problem comes first
    expect(p({ 'you.payIn.own': '5000', 'you.payIn.employer': '10001' }).errors).toEqual({ 'you.payIn.employer': 'tooHigh' });
    // real values, as an answer function is given them
    expect(checkInputs(schema, nest({ ...p({ 'you.payIn.own': '5000', 'you.payIn.employer': '5000' }).values, 'you.payIn.employer': 5001 }), TEST_ENV).errors)
      .toEqual({ 'you.payIn.employer': 'pay-in-over-limit' });
  });
  it('one figure is held to £10,000 by its box alone (nothing to add)', () => {
    const r = parseDraft(SCHEMA_A, { 'you.pot': '250000', 'you.age': '55', 'stop.kind': 'age', 'stop.age': '67', 'spend.kind': 'amount', 'spend.amount': '2000', 'you.payIn.kind': 'total', 'you.payIn.total': '10000' }, TEST_ENV);
    expect(r.ok).toBe(true);
  });
});

describe('the rules between fields belong to the list that names them', () => {
  it('C\'s list never reports A\'s or B\'s rule ids, and a list with no rules reports none', () => {
    const ids = new Set(Object.values(parse({ 'you.age': '80', endAge: '80', 'start.kind': 'age', 'start.age': '79' }).errors));
    for (const id of ['stop-not-before-now', 'stop-after-now', 'end-after-stop']) expect(ids.has(id)).toBe(false);
    const bare = { id: 'x', fields: [{ path: 'you.age', type: 'age', min: 18, max: 100, required: true, group: 'you', boundaries: [18, 100] },
      { path: 'stop.age', type: 'age', min: 18, max: 75, required: true, group: 'stop', boundaries: [18, 75] },
      { path: 'endAge', type: 'age', min: 75, max: 105, default: 95, group: 'more', boundaries: [75, 105] }], rules: [] };
    expect(parseDraft(bare, { 'you.age': '70', 'stop.age': '60', endAge: '75' }, TEST_ENV).errors).toEqual({});
  });
});

describe('validate and checkInputs — real values', () => {
  it('passes checked inputs and fills defaults for unchecked ones', () => {
    expect(validate(SCHEMA_C, { you: { pot: 250000, age: 58 } }, TEST_ENV)).toEqual({ ok: true, errors: {} });
    expect(checkInputs(SCHEMA_C, { you: { pot: 250000, age: 58 } }, TEST_ENV).inputs).toEqual(parse().inputs);
  });
  it('does not accept text where a number belongs', () => {
    expect(validate(SCHEMA_C, { you: { pot: '250000', age: 58 } }, TEST_ENV).errors).toEqual({ 'you.pot': 'notANumber' });
    expect(validate(SCHEMA_C, { you: { pot: NaN, age: 58.5 } }, TEST_ENV).errors).toEqual({ 'you.pot': 'notANumber', 'you.age': 'notANumber' });
    expect(validate(SCHEMA_C, { you: { pot: 1, age: 58, finalSalary: { has: 'yes' } } }, TEST_ENV).errors).toEqual({ 'you.finalSalary.has': 'notAnOption' });
    expect(validate(SCHEMA_C, null, TEST_ENV).ok).toBe(false);
  });
  it('fieldsThatApply follows `when`', () => {
    const paths = (v) => fieldsThatApply(SCHEMA_C, v).map((f) => f.path);
    expect(paths({})).not.toContain('start.age');
    expect(paths({ 'start.kind': 'age' })).toContain('start.age');
    expect(paths({ household: 'couple', 'partner.finalSalary.has': true })).toContain('partner.finalSalary.yearly');
    expect(paths({ household: 'single', 'partner.finalSalary.has': true })).not.toContain('partner.finalSalary.yearly');
  });
  it('flatten and nest are each other\'s opposite', () => {
    const inputs = parse({ household: 'couple', 'partner.age': '60' }).inputs;
    expect(nest(flatten(inputs))).toEqual(inputs);
  });
});
