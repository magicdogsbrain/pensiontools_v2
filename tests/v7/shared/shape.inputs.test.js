/**
 * The spending shape's inputs (research/v7/spending-shape.md 3.2, 3.3, 3.7, 9.5): A and B under `spend`, C under `shape`;
 * none with a default; the `steps` type read item by item, each problem under its own box; the rule 'shape-steps' against
 * the stop, the start and the end. Error ids are the screen's words' keys (src/v7/copy/shape.js errors): an item's
 * fromAge 'required' | 'notANumber' | 'beforeNow' | 'beforeStop' (A, B) | 'beforeStart' (C) | 'afterEnd' | 'order'; its
 * amount 'required' | 'notANumber' | 'tooLow' | 'tooHigh'; its fall 'range'; its then 'notAnOption' | 'glidesLast'; the
 * list 'tooMany'; the first amount's then 'glidesLast' (no step to move to).
 */
import { describe, it, expect } from 'vitest';
import { parseDraft, checkInputs, flatten } from '../../../src/answers/shared/validate.js';
import { SCHEMA_A } from '../../../src/answers/a/schema.js';
import { SCHEMA_B } from '../../../src/answers/b/schema.js';
import { SCHEMA_C } from '../../../src/answers/c/schema.js';
import { toHousehold as toHouseholdA } from '../../../src/answers/a/toHousehold.js';
import { toHousehold as toHouseholdB } from '../../../src/answers/b/toHousehold.js';
import { toHousehold as toHouseholdC } from '../../../src/answers/c/toHousehold.js';
import { shapeOfInputs, spendLevelAMonth } from '../../../src/answers/shared/schemaParts.js';

const ENV = { today: '2026-09-30' };
const A0 = { 'you.pot': '250000', 'you.age': '58', 'stop.age': '62', 'spend.amount': '2500' };
const C0 = { 'you.pot': '400000', 'you.age': '67', 'start.kind': 'now' };
const step = (fromAge, amount, then = 'level', fallsPct = '') => ({ fromAge: String(fromAge), perMonth: String(amount), then, fallsPct: String(fallsPct) });
const share = (fromAge, s, then = 'level', fallsPct = '') => ({ fromAge: String(fromAge), share: String(s), then, fallsPct: String(fallsPct) });
const errorsA = (extra) => parseDraft(SCHEMA_A, { ...A0, ...extra }, ENV).errors;
const errorsC = (extra) => parseDraft(SCHEMA_C, { ...C0, ...extra }, ENV).errors;

describe('not answered: today\'s inputs, key for key', () => {
  it('A, B and C: the checked inputs of a form that never answers the shape have no key of it', () => {
    const a = parseDraft(SCHEMA_A, A0, ENV);
    expect(a.ok).toBe(true);
    expect(Object.keys(flatten(a.inputs)).filter((k) => /then|fallsPct|steps/.test(k))).toEqual([]);
    const b = parseDraft(SCHEMA_B, { 'you.pot': '250000', 'you.age': '58', 'you.payIn.total': '600', 'stop.age': '62', 'spend.amount': '2500' }, ENV);
    expect(Object.keys(flatten(b.inputs)).filter((k) => /then|fallsPct|steps/.test(k))).toEqual([]);
    const c = parseDraft(SCHEMA_C, C0, ENV);
    expect(c.inputs.shape).toBeUndefined();
  });

  it('an empty list of steps is no list', () => {
    const a = parseDraft(SCHEMA_A, { ...A0, 'spend.steps': [] }, ENV);
    expect(a.ok).toBe(true);
    expect(a.inputs.spend.steps).toBeUndefined();
  });
});

describe('the steps, read box by box', () => {
  it('text as typed → numbers; "then" not answered stays the same; a fall only when it falls', () => {
    const r = parseDraft(SCHEMA_A, { ...A0, 'spend.then': 'falls', 'spend.fallsPct': '0.5', 'spend.steps': [step(75, '2,130'), step(85, '£1,750', 'falls', '1.25'), { fromAge: '90', perMonth: '1500', then: '', fallsPct: '3' }] }, ENV);
    expect(r.ok, JSON.stringify(r.errors)).toBe(true);
    expect(r.inputs.spend).toEqual({ kind: 'amount', amount: 2500, then: 'falls', fallsPct: 0.5,
      steps: [{ fromAge: 75, perMonth: 2130, then: 'level' }, { fromAge: 85, perMonth: 1750, then: 'falls', fallsPct: 1.25 }, { fromAge: 90, perMonth: 1500, then: 'level' }] });
    // checking the checked inputs again changes nothing
    expect(checkInputs(SCHEMA_A, r.inputs, ENV).inputs).toEqual(r.inputs);
  });

  it('the amount: £1 to £50,000 a month — 0 too low, 50,001 too high, words not a number', () => {
    expect(errorsA({ 'spend.steps': [step(75, '0')] })['spend.steps.0.perMonth']).toBe('tooLow');
    expect(errorsA({ 'spend.steps': [step(75, '1')] })['spend.steps.0.perMonth']).toBeUndefined();
    expect(errorsA({ 'spend.steps': [step(75, '50000')] })['spend.steps.0.perMonth']).toBeUndefined();
    expect(errorsA({ 'spend.steps': [step(75, '50001')] })['spend.steps.0.perMonth']).toBe('tooHigh');
    expect(errorsA({ 'spend.steps': [step(75, 'lots')] })['spend.steps.0.perMonth']).toBe('notANumber');
    expect(errorsA({ 'spend.steps': [step(75, '')] })['spend.steps.0.perMonth']).toBe('required');
  });

  it('a fall: 0.25% to 10% a year in quarter steps — 0, 10.25 and 0.3 are out; on the first amount the box is required', () => {
    for (const [f, want] of [['0', 'range'], ['0.25', undefined], ['10', undefined], ['10.25', 'range'], ['0.3', 'range'], ['', 'range']]) {
      expect(errorsA({ 'spend.steps': [step(75, '2000', 'falls', f)] })['spend.steps.0.fallsPct'], f).toBe(want);
    }
    expect(errorsA({ 'spend.then': 'falls' })['spend.fallsPct']).toBe('required');
    expect(errorsA({ 'spend.then': 'falls', 'spend.fallsPct': '0.3' })['spend.fallsPct']).toBe('notANumber');
    expect(errorsA({ 'spend.then': 'falls', 'spend.fallsPct': '10.25' })['spend.fallsPct']).toBe('tooHigh');
  });

  it('C: a share from 1% to 500% on two places', () => {
    expect(errorsC({ 'shape.steps': [share(75, '0.5')] })['shape.steps.0.share']).toBe('tooLow');
    expect(errorsC({ 'shape.steps': [share(75, '1')] })['shape.steps.0.share']).toBeUndefined();
    expect(errorsC({ 'shape.steps': [share(75, '85.25')] })['shape.steps.0.share']).toBeUndefined();
    expect(errorsC({ 'shape.steps': [share(75, '85.255')] })['shape.steps.0.share']).toBe('notANumber');
    expect(errorsC({ 'shape.steps': [share(75, '500')] })['shape.steps.0.share']).toBeUndefined();
    expect(errorsC({ 'shape.steps': [share(75, '500.01')] })['shape.steps.0.share']).toBe('tooHigh');
    const c = parseDraft(SCHEMA_C, { ...C0, 'shape.steps': [share(75, '85%')] }, ENV);
    expect(c.inputs.shape).toEqual({ steps: [{ fromAge: 75, share: 85, then: 'level' }] });
  });
});

describe('the steps against the form (the rule shape-steps)', () => {
  it('A: after your age today, after the stop, before the end (your age when the plan ends), rising', () => {
    expect(errorsA({ 'spend.steps': [step(58, '2000')] })['spend.steps.0.fromAge']).toBe('beforeNow');
    expect(errorsA({ 'spend.steps': [step(62, '2000')] })['spend.steps.0.fromAge']).toBe('beforeStop');
    expect(errorsA({ 'spend.steps': [step(63, '2000')] })['spend.steps.0.fromAge']).toBeUndefined();
    expect(errorsA({ 'spend.steps': [step(94, '2000')] })['spend.steps.0.fromAge']).toBeUndefined();
    expect(errorsA({ 'spend.steps': [step(95, '2000')] })['spend.steps.0.fromAge']).toBe('afterEnd');
    expect(errorsA({ 'spend.steps': [step(80, '2000'), step(80, '1800')] })['spend.steps.1.fromAge']).toBe('order');
    expect(errorsA({ 'spend.steps': [step(80, '2000'), step(75, '1800')] })['spend.steps.1.fromAge']).toBe('order');
  });

  it('"moves evenly" never on the last step, nor on the first amount with no step', () => {
    expect(errorsA({ 'spend.steps': [step(75, '2000', 'glides')] })['spend.steps.0.then']).toBe('glidesLast');
    expect(errorsA({ 'spend.steps': [step(75, '2000', 'glides'), step(85, '1700')] })['spend.steps.0.then']).toBeUndefined();
    expect(errorsA({ 'spend.then': 'glides' })['spend.then']).toBe('glidesLast');
    expect(errorsA({ 'spend.then': 'glides', 'spend.steps': [step(75, '2000')] })['spend.then']).toBeUndefined();
    expect(errorsA({ 'spend.steps': [step(75, '2000', 'sideways')] })['spend.steps.0.then']).toBe('notAnOption');
  });

  it('a couple: the ages are yours, after the first of the stops (your partner\'s own, when it comes first) and before your age at the end', () => {
    const couple = { ...A0, household: 'couple', 'partner.age': '60', 'partner.stop.kind': 'age', 'partner.stop.age': '61' };
    // your partner stops at 61, when you are 59: the household's money starts then — a step from 60 is after it
    expect(parseDraft(SCHEMA_A, { ...couple, 'spend.steps': [step(60, '2000')] }, ENV).errors['spend.steps.0.fromAge']).toBeUndefined();
    expect(parseDraft(SCHEMA_A, { ...couple, 'spend.steps': [step(59, '2000')] }, ENV).errors['spend.steps.0.fromAge']).toBe('beforeStop');
    // the younger of you (58) is 95 at the end: you are 95 then too
    expect(parseDraft(SCHEMA_A, { ...couple, 'spend.steps': [step(95, '2000')] }, ENV).errors['spend.steps.0.fromAge']).toBe('afterEnd');
    const older = { ...A0, household: 'couple', 'partner.age': '50' };
    // you are 8 years older: at the end (your partner 95) you are 103
    expect(parseDraft(SCHEMA_A, { ...older, 'spend.steps': [step(102, '2000')] }, ENV).errors['spend.steps.0.fromAge']).toBeUndefined();
    expect(parseDraft(SCHEMA_A, { ...older, 'spend.steps': [step(103, '2000')] }, ENV).errors['spend.steps.0.fromAge']).toBe('afterEnd');
  });

  it('B: the same rule; C: after the start ("beforeStart"), shares', () => {
    const B0 = { 'you.pot': '250000', 'you.age': '58', 'you.payIn.total': '600', 'stop.age': '62', 'spend.amount': '2500' };
    expect(parseDraft(SCHEMA_B, { ...B0, 'spend.steps': [step(61, '2000')] }, ENV).errors['spend.steps.0.fromAge']).toBe('beforeStop');
    expect(errorsC({ 'shape.steps': [share(67, '80')] })['shape.steps.0.fromAge']).toBe('beforeNow');
    const later = { 'you.pot': '400000', 'you.age': '60', savings: '50000', 'start.kind': 'age', 'start.age': '65' };
    expect(parseDraft(SCHEMA_C, { ...later, 'shape.steps': [share(65, '80')] }, ENV).errors['shape.steps.0.fromAge']).toBe('beforeStart');
    expect(parseDraft(SCHEMA_C, { ...later, 'shape.steps': [share(66, '80')] }, ENV).errors['shape.steps.0.fromAge']).toBeUndefined();
  });

  it('a box with a problem of its own does not hide the rule from the others: every problem at once', () => {
    const e = errorsA({ 'spend.steps': [step(61, '1700'), step(57, '0', 'glides'), step(99, '1700', 'falls', '0.3')] });
    expect(e).toMatchObject({ 'spend.steps.0.fromAge': 'beforeStop', 'spend.steps.1.fromAge': 'beforeNow', 'spend.steps.1.perMonth': 'tooLow',
      'spend.steps.2.fromAge': 'afterEnd', 'spend.steps.2.fallsPct': 'range' });
  });
});

describe('the household model: a shape only when it changes', () => {
  it('A and B: { unit perMonth, first: the figure (or the level\'s), start, steps }; nothing for a shape that never changes', () => {
    const ins = parseDraft(SCHEMA_A, { ...A0, 'spend.steps': [step(75, '2130'), step(85, '1750', 'falls', '1')] }, ENV).inputs;
    expect(toHouseholdA(ins, ENV).household.shape).toEqual({ unit: 'perMonth', first: 2500, start: { then: 'level' },
      steps: [{ fromAge: 75, perMonth: 2130, then: 'level' }, { fromAge: 85, perMonth: 1750, then: 'falls', fallsPct: 1 }] });
    const level = parseDraft(SCHEMA_A, { ...A0, 'spend.kind': 'level', 'spend.level': 'moderate', 'spend.steps': [step(75, '2000')] }, ENV).inputs;
    expect(toHouseholdA(level, ENV).household.shape.first).toBe(spendLevelAMonth('single', 'moderate'));
    const same = parseDraft(SCHEMA_A, { ...A0, 'spend.then': 'level', 'spend.steps': [step(75, '2500')] }, ENV).inputs;
    expect('shape' in toHouseholdA(same, ENV).household).toBe(false);
    const b = parseDraft(SCHEMA_B, { 'you.pot': '250000', 'you.age': '58', 'you.payIn.total': '600', 'stop.age': '62', 'spend.amount': '2500', 'spend.then': 'falls', 'spend.fallsPct': '1' }, ENV).inputs;
    expect(toHouseholdB(b, ENV).household.shape).toEqual({ unit: 'perMonth', first: 2500, start: { then: 'falls', fallsPct: 1 }, steps: [] });
  });

  it('C: { unit share, start, steps }; the household without one is today\'s, key for key', () => {
    const ins = parseDraft(SCHEMA_C, { ...C0, 'shape.steps': [share(75, '85')] }, ENV).inputs;
    expect(toHouseholdC(ins, ENV).household.shape).toEqual({ unit: 'share', start: { then: 'level' }, steps: [{ fromAge: 75, share: 85, then: 'level' }] });
    const flat = parseDraft(SCHEMA_C, C0, ENV).inputs;
    // (6.22.0: every form's household says how its savings grow — "Mostly cash" unless chosen)
    expect(Object.keys(toHouseholdC(flat, ENV).household)).toEqual(['inputVersion', 'people', 'spending', 'planToAge', 'portfolio', 'strategy', 'chargesPct', 'isaGrowth']);
    expect(shapeOfInputs({}, 'shape')).toBeNull();
  });
});
