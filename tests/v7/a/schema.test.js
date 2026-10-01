/**
 * The input list for question A, tested as data (step 4 brief 6, P0; C's schema.test.js checks run over the list,
 * plus the brief's additions). Labels are checked by the wording test (P5), which owns the words.
 */
import { describe, it, expect } from 'vitest';
import { SCHEMA_A, answerA, TEST_ENV, get } from './_a.js';
import { SCHEMA_B } from '../b/_b.js';
import { SCHEMA_C } from '../c/_c.js';
import { defaults, fieldsThatApply, parseDraft, validate, checkInputs, flatten, MESSAGE_IDS } from '../../../src/answers/shared/validate.js';
import { partsText } from '../../../src/answers/shared/format.js';
import { RULES, SAVING, VERDICT, verdictOf } from '../../../src/answers/shared/rules.js';
import { personFields, saverFields, moreFields, SPEND_FIELDS, spendLevelAMonth } from '../../../src/answers/shared/schemaParts.js';
import { ACCUMULATION_RULES } from '../../../src/services/AccumulationEngine.js';
import { PLSA_2024 } from '../../../src/services/BudgetModel.js';
import { RISK_PRESETS } from '../../../src/services/GlidepathService.js';
import { DEFAULT_CHARGES_PCT } from '../../../src/services/Charges.js';
import { A as COPY_A } from '../../../src/v7/copy/a.js';

const TYPES = ['money', 'age', 'choice', 'yesNo', 'percent', 'count'];
const byPath = new Map(SCHEMA_A.fields.map((f) => [f.path, f]));
const isNumber = (f) => f.type === 'money' || f.type === 'age' || f.type === 'percent' || f.type === 'count';
const BASE = { 'you.pot': '250000', 'you.age': '50', 'stop.age': '60', 'spend.amount': '2000' };
const parse = (extra = {}, env = TEST_ENV) => parseDraft(SCHEMA_A, { ...BASE, ...extra }, env);

describe('SCHEMA_A — the declaration', () => {
  it('has id a and unique paths', () => {
    expect(SCHEMA_A.id).toBe('a');
    expect(byPath.size).toBe(SCHEMA_A.fields.length);
  });

  it('holds no words: only the known keys, and no label, help or error text', () => {
    const allowed = ['path', 'type', 'min', 'max', 'step', 'required', 'default', 'when', 'group', 'boundaries', 'options'];
    for (const f of SCHEMA_A.fields) expect(Object.keys(f).filter((k) => !allowed.includes(k)), f.path).toEqual([]);
  });

  it.each(SCHEMA_A.fields.map((f) => [f.path, f]))('%s has a type, a group, and limits or options', (_p, f) => {
    expect(TYPES).toContain(f.type);
    expect(typeof f.group).toBe('string');
    if (isNumber(f)) {
      expect(Number.isFinite(f.min)).toBe(true);
      expect(Number.isFinite(f.max)).toBe(true);
      expect(f.min).toBeLessThanOrEqual(f.max);
      expect(Array.isArray(f.boundaries)).toBe(true);
      expect(f.boundaries).toContain(f.min);
      expect(f.boundaries).toContain(f.max);
      for (const b of f.boundaries) { expect(b).toBeGreaterThanOrEqual(f.min); expect(b).toBeLessThanOrEqual(f.max); }
      expect([...f.boundaries].sort((a, b) => a - b)).toEqual(f.boundaries);
    }
    if (f.type === 'choice') { expect(Array.isArray(f.options)).toBe(true); expect(f.options.length).toBeGreaterThan(1); }
  });

  it('every `when` names a field declared earlier, with a value that field can take', () => {
    SCHEMA_A.fields.forEach((f, i) => {
      for (const [path, want] of Object.entries(f.when || {})) {
        const at = SCHEMA_A.fields.findIndex((x) => x.path === path);
        expect(at, `${f.path} when ${path}`).toBeGreaterThanOrEqual(0);
        expect(at, `${f.path} when ${path} must come first`).toBeLessThan(i);
        const dep = SCHEMA_A.fields[at];
        if (dep.type === 'choice') expect(dep.options).toContain(want);
        if (dep.type === 'yesNo') expect(typeof want).toBe('boolean');
      }
    });
  });

  it('every partner field applies only to a couple', () => {
    for (const f of SCHEMA_A.fields.filter((x) => x.path.startsWith('partner.'))) expect(f.when.household, f.path).toBe('couple');
  });

  it('no required field has a default, and no field is both optional and without one', () => {
    for (const f of SCHEMA_A.fields) expect(Boolean(f.required) !== ('default' in f), f.path).toBe(true);
  });

  it('a default is an allowed value; an age is never assumed', () => {
    for (const f of SCHEMA_A.fields.filter((x) => 'default' in x)) {
      const d = f.default;
      if (f.type === 'choice') expect(f.options).toContain(d);
      else if (f.type === 'yesNo') expect(typeof d).toBe('boolean');
      else if (d !== null) { expect(d).toBeGreaterThanOrEqual(f.min); expect(d).toBeLessThanOrEqual(f.max); }
    }
    expect(byPath.get('you.age').default).toBeUndefined();
    expect(byPath.get('partner.age').default).toBeUndefined();
    expect(byPath.get('stop.age').default).toBeUndefined();
    expect(SCHEMA_A.defaultRules).toBeUndefined();
  });

  it('the groups are the blocks of the form', () => {
    expect([...new Set(SCHEMA_A.fields.map((f) => f.group))]).toEqual(['who', 'you', 'more', 'stop', 'spend', 'work', 'partner']);
    expect(byPath.get('savings').group).toBe('you');                   // on A's short form (conflict 23)
    expect(byPath.get('you.alreadyDrawing').group).toBe('more');
  });

  it('the stop-age boundaries include 53 to 57 (the rise to 57 on 6 April 2028), and 75 is the ceiling', () => {
    for (const a of [53, 54, 55, 56, 57]) expect(byPath.get('stop.age').boundaries).toContain(a);
    expect(byPath.get('stop.age').max).toBe(RULES.stopAgeMax);
    expect(byPath.get('stop.age').min).toBe(18);
    expect(byPath.get('stop.kind').options).toEqual(['age', 'ages']);
  });

  it('the pay-in ceiling is £10,000 a month, and part-time is a whole number of years from 1 to 15', () => {
    for (const p of ['you.payIn.total', 'you.payIn.own', 'you.payIn.employer', 'partner.payIn.total']) expect(byPath.get(p).max).toBe(SAVING.payInCeiling);
    expect(byPath.get('partTime.years')).toMatchObject({ type: 'count', min: 1, max: 15 });
    // the one charge (6.19.0): today's planner's range, steps and default, taken while saving and while drawing
    expect(byPath.get('charge')).toMatchObject({ type: 'percent', min: 0, max: 3, step: 0.05, default: 0.5, group: 'more' });
    expect(byPath.get('charge').default).toBe(SAVING.chargesPct);
    expect(byPath.get('charge').default).toBe(DEFAULT_CHARGES_PCT);
  });

  it('a single person must type four things, a couple five; the limit is five', () => {
    const required = (values) => fieldsThatApply(SCHEMA_A, { ...defaults(SCHEMA_A, values, TEST_ENV), ...values }).filter((f) => f.required).map((f) => f.path);
    expect(required({ household: 'single' })).toEqual(['you.pot', 'you.age', 'stop.age', 'spend.amount']);
    expect(required({ household: 'single', 'spend.kind': 'level' })).toEqual(['you.pot', 'you.age', 'stop.age', 'spend.level']);
    expect(required({ household: 'couple' })).toEqual(['you.pot', 'you.age', 'stop.age', 'spend.amount', 'partner.age']);
    expect(required({ household: 'single' }).length).toBeLessThanOrEqual(5);
    expect(required({ household: 'single', 'stop.kind': 'ages' })).toEqual(['you.pot', 'you.age', 'spend.amount']);
  });

  it('every rule has an id and names fields that exist; rule ids do not clash with the other message ids', () => {
    expect(SCHEMA_A.rules.map((r) => r.id)).toEqual(['stop-not-before-now', 'end-after-stop', 'stop-ages-past-75', 'pay-in-over-limit']);
    for (const r of SCHEMA_A.rules) {
      expect(MESSAGE_IDS).not.toContain(r.id);
      for (const p of r.fields) expect(byPath.has(p), `${r.id}: ${p}`).toBe(true);
    }
  });

  it('the risk levels are today\'s RISK_PRESETS, for saving and for drawing', () => {
    expect(byPath.get('risk').options).toEqual(Object.keys(RISK_PRESETS));
    expect(byPath.get('savingRisk').options).toEqual(Object.keys(RISK_PRESETS));
  });

  it('carries the rules of the list: agesToShow, and no grid', () => {
    expect(typeof SCHEMA_A.agesToShow).toBe('function');
    expect(SCHEMA_A.gridToShow).toBeNull();
  });

  it('the defaults plus the required fields pass, and come back as the checked inputs of the brief (4.1)', () => {
    const r = parseDraft(SCHEMA_A, { 'you.pot': '250000', 'you.age': '50', 'you.payIn.total': '600', savings: '40000', 'stop.age': '60', 'spend.amount': '2000' }, TEST_ENV);
    expect(r.ok).toBe(true);
    expect(r.inputs).toEqual({
      household: 'single',
      you: { age: 50, pot: 250000, payIn: { kind: 'total', total: 600 }, alreadyDrawing: false, statePension: { kind: 'full' }, finalSalary: { has: false } },
      savings: 40000, stop: { kind: 'age', age: 60 }, spend: { kind: 'amount', amount: 2000 }, partTime: { has: false },
      savingsIn: 0, savingRisk: 'balanced', risk: 'balanced', charge: 0.5, endAge: 95
    });
    expect(validate(SCHEMA_A, r.inputs, TEST_ENV)).toEqual({ ok: true, errors: {} });
    expect(checkInputs(SCHEMA_A, r.inputs, TEST_ENV).inputs).toEqual(r.inputs);   // checking twice changes nothing
    expect(Object.keys(flatten(r.inputs)).sort()).toEqual(fieldsThatApply(SCHEMA_A, r.values).map((f) => f.path).sort());
  });
});

describe('the shared parts — one declaration for A, B and C', () => {
  const cField = (path) => SCHEMA_C.fields.find((f) => f.path === path);
  const withoutWhen = ({ when, ...rest }) => rest;

  it('personFields(who) deep-equals SCHEMA_C\'s person block, field for field and in C\'s order', () => {
    for (const who of ['you', 'partner']) {
      const ours = personFields(who);
      const theirs = SCHEMA_C.fields.filter((f) => f.path.startsWith(`${who}.`) && !f.path.startsWith(`${who}.payIn.`));
      expect(ours).toEqual(theirs);
    }
  });

  it('C\'s "still paying in" block is saverFields\' boxes (`when` aside), behind a no / yes question with no default', () => {
    for (const who of ['you', 'partner']) {
      const c = SCHEMA_C.fields.filter((f) => f.path.startsWith(`${who}.payIn.`));
      expect(c.map((f) => f.path)).toEqual([`${who}.payIn.has`, `${who}.payIn.kind`, `${who}.payIn.total`, `${who}.payIn.own`, `${who}.payIn.employer`]);
      expect(c[0]).toMatchObject({ type: 'choice', options: ['no', 'yes'] });
      expect('default' in c[0]).toBe(false);
      expect(c[0].required).toBeUndefined();
      const saver = new Map(saverFields(who).map((f) => [f.path, withoutWhen(f)]));
      for (const f of c.slice(1)) {
        const { required, default: d, ...rest } = withoutWhen(f);
        const { required: r2, default: d2, ...theirs } = saver.get(f.path);
        expect(rest, f.path).toEqual(theirs);
        expect(f.when[`${who}.payIn.has`], f.path).toBe('yes');
        void required; void d; void r2; void d2;
      }
      expect(c.find((f) => f.path === `${who}.payIn.kind`).default).toBe('split');
      for (const p of ['own', 'employer', 'total']) expect(c.find((f) => f.path === `${who}.payIn.${p}`).required, p).toBe(true);
    }
  });

  it('the person block is in A, B and C by value; risk, endAge and household too', () => {
    const shared = ['household', ...personFields('you').map((f) => f.path), ...personFields('partner').map((f) => f.path), 'risk', 'endAge'];
    for (const path of shared) {
      expect(byPath.get(path), path).toEqual(cField(path));
      expect(SCHEMA_B.fields.find((f) => f.path === path), path).toEqual(cField(path));
    }
    // savings: the same field (its group and its boundaries are each list's own — conflict 23)
    const strip = ({ group, boundaries, ...rest }) => rest;
    expect(strip(byPath.get('savings'))).toEqual(strip(cField('savings')));
    expect(strip(SCHEMA_B.fields.find((f) => f.path === 'savings'))).toEqual(strip(cField('savings')));
  });

  it('every path A and B share is the same field in both (`when` aside; required/default on you.payIn.total aside; savings\' group aside)', () => {
    const bByPath = new Map(SCHEMA_B.fields.map((f) => [f.path, f]));
    const exempt = (path, f) => {
      const { required, default: d, ...rest } = withoutWhen(f);
      if (path === 'you.payIn.total') return rest;
      if (path === 'savings') { const { group, ...r } = { required, default: d, ...rest }; return r; }
      return { required, default: d, ...rest };
    };
    let shared = 0;
    for (const [path, f] of byPath) {
      if (!bByPath.has(path)) continue;
      shared++;
      expect(exempt(path, f), path).toEqual(exempt(path, bByPath.get(path)));
    }
    expect(shared).toBeGreaterThan(25);
    expect(byPath.get('you.payIn.total')).toMatchObject({ default: 0 });
    expect(bByPath.get('you.payIn.total')).toMatchObject({ required: true });
    expect(bByPath.get('you.payIn.total').default).toBeUndefined();
  });

  it('A alone has stop.kind and the part-time block; B alone has confidence', () => {
    const only = (s, t) => s.fields.map((f) => f.path).filter((p) => !t.fields.some((g) => g.path === p));
    expect(only(SCHEMA_A, SCHEMA_B)).toEqual(['stop.kind', 'partTime.has', 'partTime.yearly', 'partTime.years']);
    expect(only(SCHEMA_B, SCHEMA_A)).toEqual(['confidence']);
  });

  it('saverFields and moreFields are the brief\'s (4.1)', () => {
    expect(saverFields('you').map((f) => f.path)).toEqual(['you.payIn.kind', 'you.payIn.total', 'you.payIn.own', 'you.payIn.employer', 'you.alreadyDrawing']);
    expect(saverFields('partner').every((f) => f.when.household === 'couple')).toBe(true);
    expect(saverFields('you', { payInRequired: true })[1]).toMatchObject({ required: true });
    expect(moreFields().map((f) => f.path)).toEqual(['savingsIn', 'savingRisk', 'risk', 'charge', 'endAge']);
    expect(SPEND_FIELDS.map((f) => f.path)).toEqual(['spend.kind', 'spend.amount', 'spend.level']);
    expect(saverFields('you')).toEqual(saverFields('you'));   // fresh objects, equal by value
  });
});

describe('the level figures and the PLSA boundaries', () => {
  it('a level is PLSA_2024 ÷ 12 to the pound, single or couple by household', () => {
    expect(spendLevelAMonth('single', 'minimum')).toBe(Math.round(PLSA_2024.single.minimum / 12));
    expect(spendLevelAMonth('single', 'moderate')).toBe(2608);
    expect(spendLevelAMonth('single', 'comfortable')).toBe(3592);
    expect(spendLevelAMonth('couple', 'minimum')).toBe(1867);
    expect(spendLevelAMonth('couple', 'moderate')).toBe(3592);
    expect(spendLevelAMonth('couple', 'comfortable')).toBe(4917);
    expect(byPath.get('spend.level').options).toEqual(['minimum', 'moderate', 'comfortable']);
  });
  it('the spend boundaries hold every level figure', () => {
    for (const h of ['single', 'couple']) for (const l of ['minimum', 'moderate', 'comfortable']) expect(byPath.get('spend.amount').boundaries).toContain(spendLevelAMonth(h, l));
  });
});

describe('parseDraft — the two new types', () => {
  // the one charge (6.19.0): 0 to 3 in steps of 0.05
  it.each([['0.5', 0.5], ['0.5%', 0.5], [' 1 ', 1], ['1%', 1], ['0', 0], ['2', 2], ['1.5 %', 1.5], ['0.55', 0.55], ['0.05', 0.05], ['3', 3]])('percent %j → %s', (text, value) => {
    const r = parse({ charge: text });
    expect(r.errors).toEqual({});
    expect(r.inputs.charge).toBe(value);
  });
  it.each([['abc', 'notANumber'], ['0.57', 'notANumber'], ['0.123', 'notANumber'], ['-1', 'notANumber'], ['3.05', 'tooHigh'], ['4', 'tooHigh'], ['half', 'notANumber']])('percent %j → %s', (text, id) => {
    expect(parse({ charge: text }).errors).toEqual({ charge: id });
  });
  it.each([['3', 3], [' 5 ', 5], ['15', 15], ['1', 1]])('count %j → %s', (text, value) => {
    const r = parse({ 'partTime.has': true, 'partTime.yearly': '12000', 'partTime.years': text });
    expect(r.errors).toEqual({});
    expect(r.inputs.partTime).toEqual({ has: true, yearly: 12000, years: value });
  });
  it.each([['three', 'notANumber'], ['2.5', 'notANumber'], ['2 days a week', 'notANumber'], ['0', 'tooLow'], ['16', 'tooHigh'], ['', 'required']])('count %j → %s', (text, id) => {
    expect(parse({ 'partTime.has': true, 'partTime.yearly': '12000', 'partTime.years': text }).errors).toEqual({ 'partTime.years': id });
  });
  it('the same limits for real values (what answerA is given)', () => {
    const typed = (extra) => checkInputs(SCHEMA_A, { you: { pot: 250000, age: 50 }, stop: { age: 60 }, spend: { amount: 2000 }, ...extra }, TEST_ENV).errors;
    expect(typed({ charge: 0.5 })).toEqual({});
    expect(typed({ charge: 0.55 })).toEqual({});
    expect(typed({ charge: 0.57 })).toEqual({ charge: 'notANumber' });
    expect(typed({ charge: '0.5' })).toEqual({ charge: 'notANumber' });
    expect(typed({ charge: 3.05 })).toEqual({ charge: 'tooHigh' });
    expect(typed({ partTime: { has: true, yearly: 12000, years: 3 } })).toEqual({});
    expect(typed({ partTime: { has: true, yearly: 12000, years: 2.5 } })).toEqual({ 'partTime.years': 'notANumber' });
    expect(typed({ partTime: { has: true, yearly: 12000, years: 0 } })).toEqual({ 'partTime.years': 'tooLow' });
  });
});

describe('every boundary passes; one below and one above fail', () => {
  const LIMIT_ERRORS = ['required', 'notANumber', 'tooLow', 'tooHigh', 'notAnOption'];
  function draftWhere(f, typed = false) {
    const d = typed ? { 'you.pot': 250000, 'you.age': 50, 'stop.age': 60, 'spend.amount': 2000 } : { ...BASE };
    for (const [path, want] of Object.entries(f.when || {})) d[path] = want;
    if (d.household === 'couple') d['partner.age'] = typed ? 48 : '48';
    if (d['partTime.has'] === true) { d['partTime.yearly'] ??= typed ? 12000 : '12000'; d['partTime.years'] ??= typed ? 3 : '3'; }
    if (d['stop.kind'] === 'ages') delete d['stop.age'];
    if (f.path === 'endAge') { d['you.age'] = typed ? 30 : '30'; d['stop.age'] = typed ? 60 : '60'; }
    if (f.path === 'stop.age') { d['you.age'] = typed ? 18 : '18'; }
    if (f.path === 'you.age') { delete d['stop.age']; d['stop.kind'] = 'ages'; }
    if (f.path === 'partner.age') { d['you.age'] = typed ? 18 : '18'; d['stop.age'] = typed ? 18 : '18'; }
    return d;
  }
  const numbers = SCHEMA_A.fields.filter((f) => f.boundaries);
  it.each(numbers.map((f) => [f.path, f]))('%s', (_p, f) => {
    for (const b of f.boundaries) {
      const e = parseDraft(SCHEMA_A, { ...draftWhere(f), [f.path]: String(b) }, TEST_ENV).errors[f.path];
      expect(LIMIT_ERRORS, `${f.path} = ${b} gave ${e}`).not.toContain(e);
    }
    const below = parseDraft(SCHEMA_A, { ...draftWhere(f), [f.path]: String(f.min - 1) }, TEST_ENV).errors[f.path];
    expect(f.min === 0 ? 'notANumber' : 'tooLow').toBe(below);   // "-1" is not a number a person can mean
    expect(parseDraft(SCHEMA_A, { ...draftWhere(f), [f.path]: String(f.max + 1) }, TEST_ENV).errors[f.path]).toBe('tooHigh');
    const typed = (v) => checkInputs(SCHEMA_A, nestFlat({ ...draftWhere(f, true), [f.path]: v }), TEST_ENV).errors[f.path];
    expect(typed(f.min - 1)).toBe('tooLow');
    expect(typed(f.max + 1)).toBe('tooHigh');
    expect(LIMIT_ERRORS).not.toContain(typed(f.min));
    expect(LIMIT_ERRORS).not.toContain(typed(f.max));
  });
  function nestFlat(flat) {
    const out = {};
    for (const path of Object.keys(flat)) {
      const keys = path.split('.');
      let o = out;
      for (let i = 0; i < keys.length - 1; i++) o = o[keys[i]] ??= {};
      o[keys[keys.length - 1]] = flat[path];
    }
    return out;
  }
});

describe('the rules between fields', () => {
  it('stop-not-before-now: the stop age may equal today\'s age (stopping now), never come before it', () => {
    expect(parse({ 'you.age': '60', 'stop.age': '59' }).errors).toEqual({ 'stop.age': 'stop-not-before-now' });
    expect(parse({ 'you.age': '60', 'stop.age': '60' }).ok).toBe(true);
    expect(parse({ 'you.age': '60', 'stop.age': '61' }).ok).toBe(true);
    expect(parse({ 'stop.kind': 'ages' }).ok).toBe(true);
  });
  it('end-after-stop, by the younger person\'s age at the stop', () => {
    expect(parse({ 'you.age': '70', 'stop.age': '75', endAge: '75' }).errors).toEqual({ endAge: 'end-after-stop' });
    expect(parse({ 'you.age': '70', 'stop.age': '75', endAge: '76' }).ok).toBe(true);
    expect(parse({ 'you.age': '70', 'stop.age': '75', household: 'couple', 'partner.age': '60', endAge: '75' }).ok).toBe(true);   // the younger is 65 at the stop
    expect(parse({ 'you.age': '75', 'stop.kind': 'ages', endAge: '75' }).errors).toEqual({ endAge: 'end-after-stop' });      // "show me ages": the stop is now
    expect(parse({ 'you.age': '74', 'stop.kind': 'ages', endAge: '75' }).ok).toBe(true);
  });
  it('stop-ages-past-75: "show me ages" lists ages up to 75, so past 75 it is named on the choice, with its own words', () => {
    expect(parse({ 'you.age': '75', 'stop.kind': 'ages', endAge: '95' }).ok).toBe(true);
    expect(parse({ 'you.age': '76', 'stop.kind': 'ages', endAge: '95' }).errors).toEqual({ 'stop.kind': 'stop-ages-past-75' });
    expect(parse({ 'you.age': '100', 'stop.kind': 'ages', endAge: '105' }).errors).toEqual({ 'stop.kind': 'stop-ages-past-75' });
    expect(parse({ 'you.age': '76', 'stop.kind': 'age', 'stop.age': '76', endAge: '95' }).errors).toEqual({ 'stop.age': 'tooHigh' });   // an age in mind: its own box says so
    expect(COPY_A.fields['stop.kind'].errors['stop-ages-past-75']).toMatch(/up to 75/);
  });
  it('a field\'s own problem is reported before a rule, and C\'s rules never fire on A', () => {
    expect(parse({ 'stop.age': '17' }).errors).toEqual({ 'stop.age': 'tooLow' });
    expect(parse({ 'you.age': '80', endAge: '80', 'stop.age': '80' }).errors).toEqual({ 'stop.age': 'tooHigh' });
    expect(Object.values(parse({ 'you.age': '80', endAge: '80', 'stop.kind': 'ages' }).errors)).not.toContain('end-after-start');
  });
  it('usedDefault lists every default that was used, and not the ones typed over', () => {
    expect(parse().usedDefault).toEqual(['household', 'you.statePension.kind', 'you.finalSalary.has', 'you.payIn.kind', 'you.payIn.total', 'you.alreadyDrawing',
      'savings', 'stop.kind', 'spend.kind', 'partTime.has', 'savingsIn', 'savingRisk', 'risk', 'charge', 'endAge']);
    expect(parse({ 'you.payIn.total': '600', charge: '1' }).usedDefault).not.toContain('you.payIn.total');
    expect(parse({ 'you.payIn.total': '600', charge: '1' }).usedDefault).not.toContain('charge');
  });
  it('"split it up": own and employer are both required, and the total does not apply', () => {
    expect(parse({ 'you.payIn.kind': 'split' }).errors).toEqual({ 'you.payIn.own': 'required', 'you.payIn.employer': 'required' });
    const r = parse({ 'you.payIn.kind': 'split', 'you.payIn.own': '450', 'you.payIn.employer': '250', 'you.payIn.total': '999' });
    expect(r.inputs.you.payIn).toEqual({ kind: 'split', own: 450, employer: 250 });
  });
});

describe('rules.js — the saving-years figures agree with today\'s engine and the budget model', () => {
  it('the allowances and the large-pot line are the engine\'s own', () => {
    expect(RULES.annualAllowance).toBe(ACCUMULATION_RULES.ANNUAL_ALLOWANCE);
    expect(RULES.moneyPurchaseAllowance).toBe(ACCUMULATION_RULES.MPAA);
    expect(RULES.largePot).toBe(ACCUMULATION_RULES.LSA_POT_THRESHOLD);
    expect(RULES.isaAllowance).toBe(20000);
    expect(RULES.stopAgeMax).toBe(75);
  });
  it('the PLSA levels are BudgetModel\'s PLSA_2024', () => {
    expect(RULES.plsa).toEqual(PLSA_2024);
  });
  it('the saving constants and the verdict rule', () => {
    expect(SAVING).toEqual({ chargesPct: 0.5, charge: 0.005, slideYears: 10, payInCeiling: 10000, potStep: 1000, potMax: 5_000_000, laterYears: 10 });
    // 6.19.0: V7's default charge IS today's planner's one default (services/Charges.js), in both forms
    expect(SAVING.chargesPct).toBe(DEFAULT_CHARGES_PCT);
    expect(SAVING.charge).toBe(DEFAULT_CHARGES_PCT / 100);
    expect(VERDICT).toEqual({ yes: 0.10, close: 0.25 });
    expect(verdictOf(0, 40)).toBe('yes');
    expect(verdictOf(4, 40)).toBe('yes');
    expect(verdictOf(5, 40)).toBe('close');
    expect(verdictOf(10, 40)).toBe('close');
    expect(verdictOf(11, 40)).toBe('no');
    expect(verdictOf(100, 1000)).toBe('yes');
    expect(verdictOf(101, 1000)).toBe('close');
    expect(verdictOf(250, 1000)).toBe('close');
    expect(verdictOf(251, 1000)).toBe('no');
  });
});

// ---- The shell's data for A: the rail, the hand-over map, the registry, the state shapes (step 4 brief 4.11–4.14). --
describe('the shell\'s data for question A', () => {
  it('QUESTION_A has the steps of the brief with the budget step (budget-step.md) and keep built (save-as-plan.md), and every "needs" names a field of the input list or the answer', async () => {
    const { QUESTION_A, NEXT_A } = await import('../../../src/v7/rail/a.js');
    expect(QUESTION_A.id).toBe('a');
    expect(QUESTION_A.steps.map((s) => s.id)).toEqual(['numbers', 'spend', 'answer', 'ages', 'keep']);
    expect(QUESTION_A.steps.map((s) => s.optional)).toEqual([false, false, false, true, true]);
    expect(QUESTION_A.steps.map((s) => s.built)).toEqual([true, true, true, true, true]);
    expect(QUESTION_A.steps.map((s) => s.end)).toEqual([false, false, false, false, true]);
    for (const s of QUESTION_A.steps) for (const n of s.needs) expect(n === 'answer' || byPath.has(n), n).toBe(true);
    expect(QUESTION_A.steps[2].needs).toEqual(['you.age', 'you.pot', 'stop.age', 'spend.amount']);
    expect(NEXT_A).toEqual(['a.retired', 'a.failed', 'a.working', 'a.blank', 'a.spend', 'a.fix', 'a.ready', 'a.keep', 'a.no', 'a.close', 'a.yes', 'a.ages', 'a.ages.none']);
  });

  it('the step lists of A and B exist beside C\'s, and the questions open to a visitor derive from OPEN', async () => {
    const { STEP_LISTS, OPEN, QUESTIONS, BUILT } = await import('../../../src/v7/rail/questions.js');
    expect(Object.keys(STEP_LISTS).sort()).toEqual(['a', 'b', 'c']);
    expect(STEP_LISTS.a.id).toBe('a');
    expect(STEP_LISTS.b.id).toBe('b');
    for (const id of OPEN) expect(STEP_LISTS[id], id).toBeDefined();
    expect(OPEN).toContain('c');
    expect(QUESTIONS.map((q) => q.id)).toEqual(['a', 'b', 'c', 'd', 'e', 'f']);
    expect(QUESTIONS.filter((q) => q.built).map((q) => q.id)).toEqual(OPEN.filter((id) => ['a', 'b', 'c'].includes(id)));
    expect(Object.keys(BUILT)).toEqual([...OPEN]);
  });

  it('the hand-over map: every path is a field of the list it names; figures come from keys the answer has', async () => {
    const { CARRY, CARRY_OPENS, carryKey } = await import('../../../src/v7/state/carry.js');
    const { STEP_LISTS } = await import('../../../src/v7/rail/questions.js');
    const r = answerA({ you: { pot: 250000, age: 50 }, stop: { age: 60 }, spend: { amount: 2000 } }, TEST_ENV);
    const lists = { a: SCHEMA_A, b: SCHEMA_B, c: SCHEMA_C };
    const results = { a: r };
    expect(Object.keys(CARRY).sort()).toEqual(['a→b', 'a→c', 'b→a', 'b→c', 'c→a', 'c→b']);
    expect(carryKey('c', 'a')).toBe('c→a');
    for (const [key, entries] of Object.entries(CARRY)) {
      const [from, to] = key.split('→');
      const source = new Map(lists[from].fields.map((f) => [f.path, f]));
      const target = new Map(lists[to].fields.map((f) => [f.path, f]));
      const seen = new Set();
      for (const [src, toPath] of entries) {
        expect(target.has(toPath), `${key}: ${toPath}`).toBe(true);
        expect(seen.has(toPath), `${key}: ${toPath} twice`).toBe(false);
        seen.add(toPath);
        if (typeof src === 'string') expect(source.has(src), `${key}: ${src}`).toBe(true);
        // a partner's figure (saving.1, byPerson.1) is there for a couple only; for one person the box is emptied
        else if ('result' in src) { if (results[from] && !/\.1\./.test(src.result)) expect(typeof get(results[from], src.result), `${key}: ${src.result}`).toBe('number'); }
        else if ('fixed' in src) { const f = target.get(toPath); expect(f.type === 'choice' ? f.options.includes(src.fixed) : typeof src.fixed === 'string', `${key}: ${toPath} = ${src.fixed}`).toBe(true); }
        else throw new Error(`${key}: unknown source ${JSON.stringify(src)}`);
      }
      const open = CARRY_OPENS[key];
      expect(open.q).toBe(to);
      expect(STEP_LISTS[to].steps.some((s) => s.id === open.step), `${key} opens ${open.step}`).toBe(true);
      expect(open.step).toBe(to === 'c' ? 'answer' : 'numbers');
      if (open.focus !== null) expect(target.has(open.focus), `${key} focus ${open.focus}`).toBe(true);
    }
    // ONE TEST (step 4 brief section 10, J10): into C go the inputs — each pot as typed, what goes in — never a figure
    // worked out of them; C then runs on the same lives and gives A's careful figure at that age
    expect(CARRY['a→c']).toContainEqual(['you.pot', 'you.pot']);
    expect(CARRY['a→c']).toContainEqual(['savings', 'savings']);
    expect(CARRY['a→c']).toContainEqual([{ result: 'saving.0.payIn.total' }, 'you.payIn.total']);
    expect(CARRY['b→c']).toContainEqual(['you.pot', 'you.pot']);
    expect(CARRY['b→c']).toContainEqual(['stop.age', 'start.age']);
    for (const k of ['a→c', 'b→c']) expect(CARRY[k].some(([src]) => src && src.result && /potAtStop|number/.test(src.result)), k).toBe(false);
    expect(CARRY['a→b']).toContainEqual([{ result: 'shown.age' }, 'stop.age']);
    expect(CARRY['c→a']).toContainEqual(['start.age', 'stop.age']);
    expect(CARRY['c→a']).toContainEqual(['take', 'spend.amount']);
    expect(CARRY['a→b']).toContainEqual(['you.payIn.total', 'you.payIn.total']);
  });

  it('answerA is registered under ANSWERS.a with SCHEMA_A', async () => {
    const { ANSWERS } = await import('../../../src/answers/index.js');
    expect(Object.keys(ANSWERS).sort()).toEqual(['a', 'b', 'c']);
    expect(ANSWERS.a.schema).toBe(SCHEMA_A);
    expect(ANSWERS.a.answer).toBe(answerA);
    expect(ANSWERS.b.schema).toBe(SCHEMA_B);
  });

  it('the state shapes and the actions of step 4', async () => {
    const { A, A_NEXT, ACTION_TYPES, OPENABLE } = await import('../../../src/v7/state/actions.js');
    const { emptySaverDraft, emptySaverAnswer, emptyDraft, emptyAnswer, keptDraft, emptyDraftFor, emptyAnswerFor } = await import('../../../src/v7/state/initial.js');
    expect(A_NEXT).toEqual({ DRAFT_CARRY: 'draft/carry', ANSWER_EXTEND: 'answer/extend' });
    for (const t of Object.values(A_NEXT)) expect(Object.values(A)).toContain(t);         // the reducer knows them (P4)
    expect(ACTION_TYPES).toEqual(Object.values(A));
    for (const id of ['split', 'partTime', 'pots', 'levers', 'chart', 'partner', 'more', 'assumed', 'madeOf', 'allAssumed']) expect(OPENABLE).toContain(id);
    expect(emptySaverDraft()).toEqual({ ...emptyDraft(), carriedFrom: null, spendHow: null, skipNoted: false });
    expect(emptySaverAnswer()).toEqual({ ...emptyAnswer(), detail: null, extending: false });
    expect(emptyDraftFor('a')).toEqual(emptySaverDraft());
    expect(emptyDraftFor('c')).toEqual(emptyDraft());
    expect(emptyAnswerFor('b')).toEqual(emptySaverAnswer());
    expect(emptyAnswerFor('c')).toEqual(emptyAnswer());
    expect(keptDraft({ a: { values: { 'you.pot': '250,000', x: 1 }, touched: ['you.pot', 2], asked: true, carriedFrom: 'c' } }, 'a'))
      .toEqual({ values: { 'you.pot': '250,000' }, touched: ['you.pot'], asked: true, revealed: [], carriedFrom: 'c', spendHow: null, skipNoted: false });
    expect(keptDraft({ a: { spendHow: 'lines', skipNoted: true } }, 'a')).toMatchObject({ spendHow: 'lines', skipNoted: true });
    expect(keptDraft({ a: { spendHow: 'budget', skipNoted: 'yes' } }, 'a')).toMatchObject({ spendHow: null, skipNoted: false });
    expect(keptDraft({ a: { carriedFrom: 'z' } }, 'a').carriedFrom).toBeNull();
    expect(keptDraft({ c: { values: { 'you.pot': '1' }, carriedFrom: 'a' } }, 'c')).toEqual({ values: { 'you.pot': '1' }, touched: [], asked: false, revealed: [] });
    expect(keptDraft(null, 'b')).toEqual(emptySaverDraft());
  });
});

// ---- The answer function's contract, on the stub (P0) and then the real function (P2). ----------------------------
describe('the answer function', () => {
  const inputs = { household: 'single', you: { pot: 250000, age: 50, payIn: { total: 600 } }, savings: 40000, stop: { age: 60 }, spend: { amount: 2000 } };
  const flat = (s) => (Array.isArray(s) ? s.flatMap(flat) : s && s.parts ? [s] : s && typeof s === 'object' ? Object.values(s).flatMap(flat) : []);
  const sentencesOf = (r) => [...flat(r.sentences), ...r.assumed, ...r.warnings];

  it('returns plain data of the contract\'s shape with inputs and the basis filled in, the same twice, every sentence its parts joined', () => {
    const r = answerA(inputs, TEST_ENV);
    expect(r.status).toBe('ok');
    expect(r.inputs).toEqual(checkInputs(SCHEMA_A, inputs, TEST_ENV).inputs);
    expect(r.basis).toMatchObject({ today: '2026-09-30', futures: 40, seed: 0, failuresAllowed: 4, closeAllowed: 10, detail: 'chart', bondDraws: 'life', cashRule: 'previous-year', grid: 'yearly' });
    for (const key of ['whose', 'spend', 'stop', 'headline', 'shown', 'ages', 'earliest', 'pensionOpens', 'gapYears', 'savingsNeeded', 'partTime', 'saving', 'guaranteed', 'assumed', 'warnings', 'sentences', 'basis', 'units']) {
      expect(key in r, key).toBe(true);
    }
    expect(r.units).toEqual({ money: 'todays-prices', tax: 'after-tax', period: 'month', who: 'household' });
    for (const s of sentencesOf(r)) expect(partsText(s.parts, r), s.id).toBe(s.text);
    for (const s of sentencesOf(r)) for (const p of s.parts) if (p && p.key) expect(typeof get(r, p.key), `${s.id}: ${p.key}`).toBe('number');
    for (const a of r.assumed) if (a.source === 'default') expect(typeof a.field, a.id).toBe('string');
    expect(answerA(inputs, TEST_ENV)).toEqual(r);
    expect(JSON.parse(JSON.stringify(r))).toEqual(r);
  });

  it('the rows: in age order, no repeats, each a full band block with a verdict; `shown` is the row the headline is about', () => {
    const r = answerA(inputs, TEST_ENV);
    const ages = r.ages.map((row) => row.age);
    expect(ages).toEqual([...new Set(ages)].sort((a, b) => a - b));
    expect(r.shown).toEqual(r.ages.find((row) => row.age === r.stop.age));
    expect(r.headline).toMatchObject({ age: r.shown.age, verdict: r.shown.verdict, lasted: r.shown.lasted, runOutAge: r.shown.runOutAge });
    for (const row of r.ages) {
      expect(['yes', 'close', 'no']).toContain(row.verdict);
      expect(row.status).toBe('final');
      expect(row.monthly.careful).toBeLessThanOrEqual(row.monthly.middling);
      expect(row.monthly.middling).toBeLessThanOrEqual(row.monthly.good);
      expect(row.potAtStop.careful).toBeLessThanOrEqual(row.potAtStop.middling);
      expect(row.potAtStop.middling).toBeLessThanOrEqual(row.potAtStop.good);
      expect(row.spare).toBe(Math.max(0, row.monthly.careful - r.spend.perMonth));
      expect(row.outOfTen.words).toMatch(/futures? out of 10|every future|none of the futures/);
    }
    expect(r.shown.phases.at(-1).toAge).toBe(r.basis.endAge);
    r.shown.phases.forEach((ph, i) => {
      expect(ph.shown.fromPots + ph.shown.statePension + ph.shown.finalSalary + ph.shown.fromWork).toBe(ph.shown.takeHome);
      expect(typeof ph.pensionOpen).toBe('boolean');
      if (i > 0) expect(ph.fromAge).toBe(r.shown.phases[i - 1].toAge);
    });
  });

  it('the detail asked for is the detail of the basis', () => {
    expect(answerA(inputs, { ...TEST_ENV, detail: 'all' }).basis.detail).toBe('all');
    expect(answerA(inputs, { ...TEST_ENV, detail: undefined }).basis.detail).toBe('chart');
  });

  it('never throws: bad inputs and a missing date come back as status invalid', () => {
    expect(answerA({ ...inputs, you: { ...inputs.you, pot: -1 } }, TEST_ENV)).toEqual({ status: 'invalid', problems: [{ field: 'you.pot', messageId: 'tooLow' }] });
    expect(answerA({}, TEST_ENV).problems.map((p) => p.field)).toEqual(['you.pot', 'you.age', 'stop.age', 'spend.amount']);
    expect(answerA(null, TEST_ENV).status).toBe('invalid');
    expect(answerA({ ...inputs, you: { ...inputs.you, age: 61 } }, TEST_ENV).problems).toEqual([{ field: 'stop.age', messageId: 'stop-not-before-now' }]);
    expect(answerA(inputs, { futures: 40 }).problems).toEqual([{ field: 'env.today', messageId: 'required' }]);
    expect(answerA(inputs, undefined).status).toBe('invalid');
  });
});
