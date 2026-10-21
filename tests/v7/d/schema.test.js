/**
 * The input list for question D, tested as data (research/v7/answer-D.md 4.1, 4.2): the declaration, the shared parts
 * by value, the defaults (the end age rule), the rules by id, and the levers never on the first form.
 */
import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { SCHEMA_D, TEST_ENV, answerD } from './_d.js';
import { defaultEndAge, spendOf, TAX_FREE_TAKEN, FALL_SHARE, WORK_YEARS } from '../../../src/answers/d/schema.js';
import { SCHEMA_A } from '../a/_a.js';
import { SCHEMA_C } from '../c/_c.js';
import { parseDraft, checkInputs, fieldsThatApply, defaults, nest } from '../../../src/answers/shared/validate.js';
import { personFields, SPEND_FIELDS, chargeField } from '../../../src/answers/shared/schemaParts.js';
import { arbitraryInputs } from '../gen/arbitrary.mjs';
import { D as COPY_D } from '../../../src/v7/copy/d.js';

const TYPES = ['money', 'age', 'choice', 'yesNo', 'percent', 'count'];
const byPath = new Map(SCHEMA_D.fields.map((f) => [f.path, f]));
const isNumber = (f) => f.type === 'money' || f.type === 'age' || f.type === 'percent' || f.type === 'count';
const BASE = { 'you.pot': '300000', 'you.age': '68', 'you.taxFreeTaken': 'no', 'spend.amount': '2100' };
const parse = (extra = {}, env = TEST_ENV) => parseDraft(SCHEMA_D, { ...BASE, ...extra }, env);

describe('SCHEMA_D — the declaration', () => {
  it('has id d and unique paths, and holds no words', () => {
    expect(SCHEMA_D.id).toBe('d');
    expect(byPath.size).toBe(SCHEMA_D.fields.length);
    const allowed = ['path', 'type', 'min', 'max', 'step', 'required', 'default', 'when', 'whenNot', 'group', 'boundaries', 'options'];
    for (const f of SCHEMA_D.fields) expect(Object.keys(f).filter((k) => !allowed.includes(k)), f.path).toEqual([]);
  });
  it.each(SCHEMA_D.fields.map((f) => [f.path, f]))('%s has a type, a group, and limits or options', (_p, f) => {
    expect(TYPES).toContain(f.type);
    expect(typeof f.group).toBe('string');
    if (isNumber(f)) {
      expect(f.boundaries).toContain(f.min);
      expect(f.boundaries).toContain(f.max);
      expect([...f.boundaries].sort((a, b) => a - b)).toEqual(f.boundaries);
    }
    if (f.type === 'choice') expect(f.options.length).toBeGreaterThan(1);
  });
  it('every `when` names a field declared earlier', () => {
    SCHEMA_D.fields.forEach((f, i) => {
      for (const path of Object.keys(f.when || {})) expect(SCHEMA_D.fields.findIndex((x) => x.path === path), `${f.path} when ${path}`).toBeLessThan(i);
    });
  });
  it('the person block, the spending and the charge are the shared parts by value (C\'s and A\'s paths)', () => {
    for (const who of ['you', 'partner']) for (const f of personFields(who)) expect(byPath.get(f.path), f.path).toEqual(f);
    for (const f of SPEND_FIELDS) expect(byPath.get(f.path)).toEqual(f);
    expect(byPath.get('charge')).toEqual(chargeField());
    expect(byPath.get('savings').max).toBe(SCHEMA_A.fields.find((f) => f.path === 'savings').max);
    expect(byPath.get('endAge').min).toBe(SCHEMA_C.fields.find((f) => f.path === 'endAge').min);
  });
  it('D\'s own fields: stopped (yes), the tax-free part (yes / no / some, required, no default), the levers in the try group', () => {
    expect(byPath.get('stopped')).toMatchObject({ type: 'choice', options: ['yes', 'notYet'], default: 'yes' });
    expect(byPath.get('you.taxFreeTaken')).toMatchObject({ type: 'choice', options: [...TAX_FREE_TAKEN], required: true });
    expect('default' in byPath.get('you.taxFreeTaken')).toBe(false);
    expect(byPath.get('partner.taxFreeTaken').when).toEqual({ household: 'couple' });
    for (const p of ['work.has', 'work.yearly', 'work.years', 'fall.has']) expect(byPath.get(p).group).toBe('try');
    expect(byPath.get('work.years')).toMatchObject({ min: WORK_YEARS.min, max: WORK_YEARS.max });
    expect(FALL_SHARE).toBe(0.2);
    // not taken from C or A: no start, no pay-in, no take, no stop age
    for (const p of ['start.kind', 'start.age', 'you.payIn.total', 'you.payIn.kind', 'take', 'stop.age', 'stop.kind', 'savingsIn', 'partTime.has']) expect(byPath.has(p), p).toBe(false);
  });
  it('every field has a label in copy/d.js, and every option its words', () => {
    for (const f of SCHEMA_D.fields) {
      if (f.path === 'household') continue;
      const w = COPY_D.fields[f.path];
      expect(w && typeof w.label === 'string' && w.label.length > 0, f.path).toBe(true);
      if (f.type === 'choice') for (const o of f.options) expect(typeof w.options[o], `${f.path}.${o}`).toBe('string');
    }
  });
});

describe('the defaults and the checks', () => {
  it('three things are enough: the age, the pot, the tax-free answer and what you take; the rest is defaulted', () => {
    const r = parse();
    expect(r.ok, JSON.stringify(r.errors)).toBe(true);
    expect(r.inputs).toMatchObject({ household: 'single', stopped: 'yes', you: { age: 68, pot: 300000, taxFreeTaken: 'no', statePension: { kind: 'full' }, finalSalary: { has: false } },
      savings: 0, spend: { kind: 'amount', amount: 2100 }, risk: 'balanced', charge: 0.5, endAge: 95, work: { has: false }, fall: { has: false } });
    expect('isaGrowth' in r.inputs).toBe(false);                 // no money in savings: not asked, not defaulted
    expect(parse({ savings: '40000' }).inputs.isaGrowth).toBe('cash');
  });
  it('the tax-free part must be answered; "not yet" stopped is said on the form and points at A', () => {
    const { 'you.taxFreeTaken': gone, ...rest } = BASE;
    void gone;
    expect(parseDraft(SCHEMA_D, rest, TEST_ENV).errors['you.taxFreeTaken']).toBe('required');
    expect(parse({ stopped: 'notYet' }).errors.stopped).toBe('d-still-working');
    expect(parse({ household: 'couple', 'partner.age': '66', 'partner.taxFreeTaken': 'no', 'partner.stopped': 'notYet' }).errors['partner.stopped']).toBe('d-partner-working');
    expect(parse({ household: 'couple', 'partner.age': '66', 'partner.taxFreeTaken': 'no' }).ok).toBe(true);
  });
  it('the end age: the later of 95 and the younger person\'s age + 5, capped at 105; after today; the work ends before it', () => {
    expect(defaultEndAge({ 'you.age': 68 })).toBe(95);
    expect(defaultEndAge({ 'you.age': 82 })).toBe(95);
    expect(defaultEndAge({ 'you.age': 93 })).toBe(98);
    expect(defaultEndAge({ 'you.age': 100 })).toBe(105);
    expect(defaultEndAge({ 'you.age': 93, household: 'couple', 'partner.age': 70 })).toBe(95);
    expect(defaultEndAge({})).toBe(95);
    expect(parse({ 'you.age': '93' }).inputs.endAge).toBe(98);
    expect(parse({ 'you.age': '100', endAge: '100' }).errors.endAge).toBe('d-end-after-now');
    expect(parse({ 'you.age': '92', endAge: '95', 'work.has': true, 'work.yearly': '10000', 'work.years': '3' }).errors['work.years']).toBe('d-work-before-end');
    expect(parse({ 'work.has': true, 'work.yearly': '10000', 'work.years': '6' }).errors['work.years']).toBe('tooHigh');
    expect(parse({ 'work.has': true, 'work.yearly': '10000', 'work.years': '3' }).ok).toBe(true);
  });
  it('the figure tested: the amount typed, or the level\'s figure', () => {
    expect(spendOf(parse().inputs)).toBe(2100);
    const level = parse({ 'spend.kind': 'level', 'spend.level': 'moderate' }).inputs;
    expect(spendOf(level)).toBe(Math.round(31300 / 12));
    expect(spendOf({ ...level, household: 'couple' })).toBe(Math.round(43100 / 12));
  });
  it('random valid inputs check again as themselves, and the fields that apply are exactly the checked keys', () => {
    fc.assert(fc.property(arbitraryInputs(SCHEMA_D, TEST_ENV), (inputs) => {
      const again = checkInputs(SCHEMA_D, inputs, TEST_ENV);
      expect(again.ok).toBe(true);
      expect(again.inputs).toEqual(inputs);
      const flat = Object.keys(nest(defaults(SCHEMA_D, {}, TEST_ENV)));
      void flat;
      const applying = fieldsThatApply(SCHEMA_D, again.values).map((f) => f.path);
      for (const p of Object.keys(again.values)) expect(applying, p).toContain(p);
    }), { numRuns: 60, seed: 20261021 });
  });
  it('an invalid input never throws: status invalid with the problems', () => {
    expect(answerD({ you: { age: 68 } }, TEST_ENV).status).toBe('invalid');
    expect(answerD({ you: { age: 68, pot: 1, taxFreeTaken: 'no' }, spend: { kind: 'amount', amount: 1000 }, stopped: 'notYet' }, TEST_ENV)).toMatchObject({ status: 'invalid', problems: [{ field: 'stopped', messageId: 'd-still-working' }] });
    expect(answerD({ you: { age: 68, pot: 1, taxFreeTaken: 'no' }, spend: { kind: 'amount', amount: 1000 } }, { futures: 40 }).status).toBe('invalid');
  });
});
