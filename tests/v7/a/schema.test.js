/**
 * The input list for question A, tested as data (step 4 brief 6, P0; C's schema.test.js checks run over the list,
 * plus the brief's additions). Labels are checked by the wording test (P5), which owns the words.
 */
import { describe, it, expect, vi } from 'vitest';
import { SCHEMA_A, answerA, TEST_ENV, get } from './_a.js';
import { SCHEMA_B } from '../b/_b.js';
import { SCHEMA_C } from '../c/_c.js';
import { defaults, fieldsThatApply, parseDraft, validate, checkInputs, flatten, MESSAGE_IDS } from '../../../src/answers/shared/validate.js';
import { partsText } from '../../../src/answers/shared/format.js';
import { RULES, SAVING, VERDICT, verdictOf } from '../../../src/answers/shared/rules.js';
import { personFields, saverFields, moreFields, SPEND_FIELDS, spendLevelAMonth, partnerStopFields, untilBothStopField, taxFreeFields, stopKindField,
  askedAbout, alreadyStopped, agesToShow, handOverToC, stopYearsOf } from '../../../src/answers/shared/schemaParts.js';
import { APART } from '../../../src/answers/shared/household.js';
import { ACCUMULATION_RULES } from '../../../src/services/AccumulationEngine.js';
import { PLSA_2024 } from '../../../src/services/BudgetModel.js';
import { RISK_PRESETS } from '../../../src/services/GlidepathService.js';
import { DEFAULT_CHARGES_PCT } from '../../../src/services/Charges.js';
import { A as COPY_A } from '../../../src/v7/copy/a.js';

const TYPES = ['money', 'age', 'choice', 'yesNo', 'percent', 'count', 'steps'];   // steps: the spending shape's later steps (spending-shape.md 3.3)
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
    const allowed = ['path', 'type', 'min', 'max', 'step', 'required', 'default', 'when', 'whenNot', 'group', 'boundaries', 'options', 'unit'];   // unit: a steps field's (perMonth | share)
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

  it('every `when` and `whenNot` names a field declared earlier, with values that field can take (a list: each of them)', () => {
    SCHEMA_A.fields.forEach((f, i) => {
      for (const [path, given] of [...Object.entries(f.when || {}), ...Object.entries(f.whenNot || {})]) {
        const at = SCHEMA_A.fields.findIndex((x) => x.path === path);
        expect(at, `${f.path} when ${path}`).toBeGreaterThanOrEqual(0);
        expect(at, `${f.path} when ${path} must come first`).toBeLessThan(i);
        const dep = SCHEMA_A.fields[at];
        for (const want of Array.isArray(given) ? given : [given]) {
          if (dep.type === 'choice') expect(dep.options, `${f.path}: ${path} = ${want}`).toContain(want);
          if (dep.type === 'yesNo') expect(typeof want).toBe('boolean');
        }
      }
      // the screen draws a field inside the LAST choice its `when` names (PersonBlock): never a list there
      const keys = Object.keys(f.when || {});
      if (keys.length) expect(Array.isArray(f.when[keys[keys.length - 1]]), f.path).toBe(false);
    });
  });

  it('every partner field applies only to a couple', () => {
    for (const f of SCHEMA_A.fields.filter((x) => x.path.startsWith('partner.'))) expect(f.when.household, f.path).toBe('couple');
  });

  it('no required field has a default, and no field is both optional and without one — but the questions of stopping apart', () => {
    // Couples who stop in different years (couples-different-years.md 3.1): none of the new questions has a default. Not
    // answered is today's meaning, so the checked inputs of a form that never answers them are today's, key for key.
    // …and the spending shape's (spending-shape.md 3.2): not answered is the same every year, today's inputs key for key
    const NO_DEFAULT = ['partner.stop.kind', 'untilBothStop', 'you.taxFreeTaken', 'partner.taxFreeTaken', 'spend.then', 'spend.steps'];
    for (const f of SCHEMA_A.fields) {
      if (NO_DEFAULT.includes(f.path)) { expect(f.required, f.path).toBeUndefined(); expect('default' in f, f.path).toBe(false); continue; }
      expect(Boolean(f.required) !== ('default' in f), f.path).toBe(true);
    }
  });

  it('a default is an allowed value; an age is never assumed', () => {
    for (const f of SCHEMA_A.fields.filter((x) => 'default' in x)) {
      const d = f.default;
      // a default by rule (6.22.0: how the savings grow, only once there is money in savings) names a rule of the list
      if (d && typeof d === 'object') { expect(typeof SCHEMA_A.defaultRules[d.rule], f.path).toBe('function'); continue; }
      if (f.type === 'choice') expect(f.options).toContain(d);
      else if (f.type === 'yesNo') expect(typeof d).toBe('boolean');
      else if (d !== null) { expect(d).toBeGreaterThanOrEqual(f.min); expect(d).toBeLessThanOrEqual(f.max); }
    }
    expect(byPath.get('you.age').default).toBeUndefined();
    expect(byPath.get('partner.age').default).toBeUndefined();
    expect(byPath.get('stop.age').default).toBeUndefined();
    // the one rule of A's list (6.22.0): "Mostly cash" once there is money in savings, nothing otherwise
    expect(Object.keys(SCHEMA_A.defaultRules)).toEqual(['isaGrowth']);
    expect(SCHEMA_A.defaultRules.isaGrowth({ savings: 1 })).toBe('cash');
    expect(SCHEMA_A.defaultRules.isaGrowth({ savings: 0, savingsIn: 1 })).toBe('cash');
    expect(SCHEMA_A.defaultRules.isaGrowth({ savings: 0, savingsIn: 0 })).toBeUndefined();
  });

  it('the groups are the blocks of the form', () => {
    // the stop comes before the pay-in block, which "I've already stopped" hides (couples-different-years.md 3.1)
    // the spending shape is its own block on the spend step (spending-shape.md 4.1)
    expect([...new Set(SCHEMA_A.fields.map((f) => f.group))]).toEqual(['who', 'you', 'stop', 'more', 'spend', 'shape', 'work', 'partner']);
    expect(byPath.get('savings').group).toBe('you');                   // on A's short form (conflict 23)
    expect(byPath.get('isaGrowth').group).toBe('you');                 // how the savings grow, with them (6.22.0)
    expect(byPath.get('you.alreadyDrawing').group).toBe('more');
  });

  it('the stop-age boundaries include 53 to 57 (the rise to 57 on 6 April 2028), and 75 is the ceiling', () => {
    for (const a of [53, 54, 55, 56, 57]) expect(byPath.get('stop.age').boundaries).toContain(a);
    expect(byPath.get('stop.age').max).toBe(RULES.stopAgeMax);
    expect(byPath.get('stop.age').min).toBe(18);
    expect(byPath.get('stop.kind').options).toEqual(['age', 'ages', 'already']);   // "I've already stopped" (a couple: the owner's switch 3)
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
    expect(SCHEMA_A.rules.map((r) => r.id)).toEqual(['stop-not-before-now', 'end-after-stop', 'stop-ages-past-75', 'pay-in-over-limit', 'shape-steps',
      'partner-stop-not-before-now', 'already-needs-partner', 'partner-stop-fits', 'partner-ages-one-at-a-time', 'partner-stop-ages-past-75']);
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
      savingsIn: 0, savingRisk: 'balanced', risk: 'balanced', charge: 0.5, endAge: 95, isaGrowth: 'cash'
    });
    expect(validate(SCHEMA_A, r.inputs, TEST_ENV)).toEqual({ ok: true, errors: {} });
    expect(checkInputs(SCHEMA_A, r.inputs, TEST_ENV).inputs).toEqual(r.inputs);   // checking twice changes nothing
    // (the spending shape's fields apply and have no default: not answered, they leave no key — spending-shape.md 3.2)
    expect(Object.keys(flatten(r.inputs)).sort()).toEqual(fieldsThatApply(SCHEMA_A, r.values).filter((f) => f.required || 'default' in f).map((f) => f.path).sort());
  });
});

describe('the shared parts — one declaration for A, B and C', () => {
  const cField = (path) => SCHEMA_C.fields.find((f) => f.path === path);
  const withoutWhen = ({ when, ...rest }) => rest;

  it('personFields(who) deep-equals SCHEMA_C\'s person block, field for field and in C\'s order', () => {
    const own = (p) => /\.(payIn\.|stop\.|taxFreeTaken$)/.test(p);   // paying in, the partner's stop and the tax-free part are blocks of their own
    for (const who of ['you', 'partner']) {
      const ours = personFields(who);
      const theirs = SCHEMA_C.fields.filter((f) => f.path.startsWith(`${who}.`) && !own(f.path));
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
        // the pay-in boxes are hidden after a stop: the partner's when they have stopped, in C as in A and B; yours only in A
        // and B ("I've already stopped") — C's "you" stop when the money starts, and say so with "still paying in?"
        expect(rest.whenNot, f.path).toEqual(who === 'partner' ? { 'partner.stop.kind': 'already' } : undefined);
        delete rest.whenNot; delete theirs.whenNot;
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

  it('every path A and B share is the same field in both (`when` aside; required/default on you.payIn.total aside; savings\' group aside, and that of how they grow)', () => {
    const bByPath = new Map(SCHEMA_B.fields.map((f) => [f.path, f]));
    // the stop question and the partner's stop question differ by "show me ages", which only A has (A: an age in mind or
    // ages to look at; B: an age); B's stop age is hidden by "I've already stopped", A's is inside "An age"
    const OWN = ['stop.kind', 'stop.age', 'partner.stop.kind', 'untilBothStop'];
    const exempt = (path, f) => {
      const { required, default: d, ...rest } = withoutWhen(f);
      if (path === 'you.payIn.total') return rest;
      if (path === 'savings' || path === 'isaGrowth') { const { group, ...r } = { required, default: d, ...rest }; return r; }
      return { required, default: d, ...rest };
    };
    let shared = 0;
    for (const [path, f] of byPath) {
      if (!bByPath.has(path) || OWN.includes(path)) continue;
      shared++;
      expect(exempt(path, f), path).toEqual(exempt(path, bByPath.get(path)));
    }
    expect(shared).toBeGreaterThan(25);
    expect(byPath.get('you.payIn.total')).toMatchObject({ default: 0 });
    expect(bByPath.get('you.payIn.total')).toMatchObject({ required: true });
    expect(bByPath.get('you.payIn.total').default).toBeUndefined();
  });

  it('A alone has the part-time block; B alone has confidence (both have the stop question: B\'s gained "I\'ve already stopped")', () => {
    const only = (s, t) => s.fields.map((f) => f.path).filter((p) => !t.fields.some((g) => g.path === p));
    expect(only(SCHEMA_A, SCHEMA_B)).toEqual(['partTime.has', 'partTime.yearly', 'partTime.years']);
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

/*
 * Couples who stop work in different years (research/v7/couples-different-years.md 2.1–2.3, 3.1–3.3, 5.2, 5.4). Not
 * answered is today's meaning: the checked inputs of a form that never answers the new questions are today's, key for key.
 */
describe('A: each of a couple stops on their own date', () => {
  const COUPLE = { household: 'couple', 'partner.age': '58', 'partner.pot': '90000' };
  const two = (extra = {}) => parse({ ...COUPLE, ...extra });

  it('the new questions, declared once in the shared parts', () => {
    expect(SCHEMA_A.fields.filter((f) => /stop\.|untilBothStop|taxFreeTaken/.test(f.path)).map((f) => f.path))
      .toEqual(['stop.kind', 'stop.age', 'partner.stop.kind', 'partner.stop.age', 'untilBothStop', 'you.taxFreeTaken', 'partner.taxFreeTaken']);
    for (const f of [...partnerStopFields('a'), untilBothStopField('a'), ...taxFreeFields('a'), stopKindField('a')]) expect(byPath.get(f.path), f.path).toEqual(f);
    expect(byPath.get('partner.stop.kind')).toEqual({ path: 'partner.stop.kind', type: 'choice', options: ['same', 'already', 'age', 'ages'], group: 'partner', when: { household: 'couple' } });
    expect(byPath.get('partner.stop.age')).toMatchObject({ type: 'age', min: 18, max: RULES.stopAgeMax, required: true, when: { household: 'couple', 'partner.stop.kind': 'age' } });
    expect(byPath.get('untilBothStop')).toEqual({ path: 'untilBothStop', type: 'choice', options: ['half', 'all', 'none'], group: 'partner',
      when: { 'partner.stop.kind': ['already', 'age', 'ages'], household: 'couple' } });
    expect(byPath.get('you.taxFreeTaken')).toEqual({ path: 'you.taxFreeTaken', type: 'yesNo', group: 'more', when: { 'stop.kind': 'already' } });
    expect(byPath.get('partner.taxFreeTaken')).toEqual({ path: 'partner.taxFreeTaken', type: 'yesNo', group: 'more', when: { household: 'couple', 'partner.stop.kind': 'already' } });
    // hidden by a stop: the pay-in blocks, and part-time work (it belongs to the one stopping)
    for (const p of ['you.payIn.kind', 'you.payIn.total', 'you.payIn.own', 'you.payIn.employer', 'you.alreadyDrawing', 'partTime.has']) expect(byPath.get(p).whenNot, p).toEqual({ 'stop.kind': 'already' });
    for (const p of ['partner.payIn.kind', 'partner.payIn.total', 'partner.payIn.own', 'partner.payIn.employer', 'partner.alreadyDrawing']) expect(byPath.get(p).whenNot, p).toEqual({ 'partner.stop.kind': 'already' });
  });

  it('never answered: today\'s checked inputs, key for key, single or couple', () => {
    const r = two({ 'you.payIn.total': '600', 'partner.payIn.total': '300' });
    expect(r.ok).toBe(true);
    expect(Object.keys(flatten(r.inputs)).sort()).toEqual(['charge', 'endAge', 'household', 'partTime.has', 'partner.age', 'partner.alreadyDrawing', 'partner.finalSalary.has',
      'partner.payIn.kind', 'partner.payIn.total', 'partner.pot', 'partner.statePension.kind', 'risk', 'savingRisk', 'savings', 'savingsIn', 'spend.amount', 'spend.kind',
      'stop.age', 'stop.kind', 'you.age', 'you.alreadyDrawing', 'you.finalSalary.has', 'you.payIn.kind', 'you.payIn.total', 'you.pot', 'you.statePension.kind']);
    expect(JSON.stringify(Object.keys(r.inputs))).toBe(JSON.stringify(['household', 'you', 'savings', 'stop', 'spend', 'partTime', 'partner', 'savingsIn', 'savingRisk', 'risk', 'charge', 'endAge']));
  });

  it('"They already have" hides their pay-in; an age is theirs; "show me ages" is for the one the answer is about', () => {
    const r = two({ 'partner.stop.kind': 'already', 'partner.payIn.total': '300', 'partner.taxFreeTaken': true });
    expect(r.ok).toBe(true);
    expect(r.inputs.partner).toEqual({ age: 58, pot: 90000, statePension: { kind: 'full' }, finalSalary: { has: false }, stop: { kind: 'already' }, taxFreeTaken: true });
    expect(two({ 'partner.stop.kind': 'age', 'partner.stop.age': '62', untilBothStop: 'all' }).inputs).toMatchObject({ partner: { stop: { kind: 'age', age: 62 } }, untilBothStop: 'all' });
    expect(two({ 'partner.stop.kind': 'ages' }).errors).toEqual({ 'partner.stop.kind': 'partner-ages-one-at-a-time' });
    expect(two({ 'partner.stop.kind': 'age', 'partner.stop.age': '57' }).errors).toEqual({ 'partner.stop.age': 'partner-stop-not-before-now' });
    expect(two({ 'partner.stop.kind': 'age', 'partner.stop.age': '58' }).ok).toBe(true);    // their age today: stopping now
  });

  it('"I\'ve already stopped": a couple only; the partner then gives an age or asks to be shown ages', () => {
    expect(parse({ 'stop.kind': 'already' }).errors).toEqual({ 'stop.kind': 'already-needs-partner' });
    expect(parse({ 'stop.kind': 'already', household: 'couple' }).errors).toEqual({ 'partner.age': 'required' });   // a couple: only the missing age is said
    expect(two({ 'stop.kind': 'already' }).errors).toEqual({ 'partner.stop.kind': 'partner-stop-fits' });
    expect(two({ 'stop.kind': 'already', 'partner.stop.kind': 'same' }).errors).toEqual({ 'partner.stop.kind': 'partner-stop-fits' });
    const r = two({ 'stop.kind': 'already', 'partner.stop.kind': 'age', 'partner.stop.age': '60', 'you.payIn.total': '600', 'partTime.has': true, 'you.taxFreeTaken': 'yes' });
    expect(r.ok).toBe(true);
    expect(r.inputs.stop).toEqual({ kind: 'already' });
    expect(r.inputs.you).toEqual({ pot: 250000, age: 50, statePension: { kind: 'full' }, finalSalary: { has: false }, taxFreeTaken: true });   // no pay-in
    expect('partTime' in r.inputs).toBe(false);
    expect(two({ 'stop.kind': 'already', 'partner.stop.kind': 'ages' }).ok).toBe(true);
    expect(two({ 'stop.kind': 'already', 'partner.stop.kind': 'already' }).ok).toBe(true);   // both stopped: the retired view, not an error
    expect(parse({ 'stop.kind': 'already', household: 'couple', 'partner.age': '76', 'partner.stop.kind': 'ages' }).errors).toEqual({ 'partner.stop.kind': 'partner-stop-ages-past-75' });
  });

  it('end-after-stop looks at the later stop; the later stop must be under 45 years after the first', () => {
    // you stop at 60 (in 10 years); your partner, 58, at 75 (in 17): the younger is 50 + 17 = 67 then
    expect(two({ 'partner.stop.kind': 'age', 'partner.stop.age': '75', endAge: '75' }).ok).toBe(true);
    expect(parse({ 'you.age': '60', 'stop.age': '60', household: 'couple', 'partner.age': '60', 'partner.stop.kind': 'age', 'partner.stop.age': '75', endAge: '75' }).errors)
      .toEqual({ endAge: 'end-after-stop' });
    expect(parse({ 'you.age': '60', 'stop.kind': 'already', household: 'couple', 'partner.age': '30', 'partner.stop.kind': 'age', 'partner.stop.age': '75', endAge: '105' }).errors)
      .toEqual({ endAge: 'end-after-stop' });                                                   // 45 years apart
    expect(parse({ 'you.age': '60', 'stop.kind': 'already', household: 'couple', 'partner.age': '31', 'partner.stop.kind': 'age', 'partner.stop.age': '75', endAge: '105' }).ok).toBe(true);
  });

  it('the same year by any route is today\'s inputs but for the answer itself: "when you do", or their age at your stop', () => {
    const base = two({ 'you.payIn.total': '600' });
    const same = two({ 'you.payIn.total': '600', 'partner.stop.kind': 'same' });
    const age = two({ 'you.payIn.total': '600', 'partner.stop.kind': 'age', 'partner.stop.age': '68' });   // 58 + 10
    const strip = (inputs) => { const { stop, ...partner } = inputs.partner; void stop; return { ...inputs, partner }; };
    expect(strip(same.inputs)).toEqual(base.inputs);
    expect(strip(age.inputs)).toEqual(base.inputs);
    expect(same.errors).toEqual(base.errors);
    expect(stopYearsOf(same.inputs)).toEqual(stopYearsOf(base.inputs));
    expect(stopYearsOf(age.inputs)).toEqual(stopYearsOf(base.inputs));
  });
});

describe('the shared rules about who the answer is for (couples-different-years.md 5.2, 5.4)', () => {
  const ins = (extra) => checkInputs(SCHEMA_A, { household: 'couple', you: { pot: 250000, age: 60 }, partner: { age: 55, pot: 90000 }, stop: { age: 62 }, spend: { amount: 2000 }, ...extra }, TEST_ENV).inputs;
  const stoppedYou = (partnerStop) => ins({ stop: { kind: 'already' }, partner: { age: 55, pot: 90000, stop: partnerStop } });

  it('askedAbout: "you", or the partner when you have already stopped', () => {
    expect(askedAbout(ins())).toBe('you');
    expect(askedAbout(stoppedYou({ kind: 'age', age: 58 }))).toBe('partner');
    expect(askedAbout(null)).toBe('you');
  });

  it('stopYearsOf: each person\'s years until their own stop; the asked person\'s from the row asked for', () => {
    expect(stopYearsOf(ins())).toEqual({ you: 2, partner: 2 });
    expect(stopYearsOf(ins({ partner: { age: 55, pot: 90000, stop: { kind: 'already' } } }))).toEqual({ you: 2, partner: 0 });
    expect(stopYearsOf(ins({ partner: { age: 55, pot: 90000, stop: { kind: 'age', age: 57 } } }))).toEqual({ you: 2, partner: 2 });
    expect(stopYearsOf(ins({ partner: { age: 55, pot: 90000, stop: { kind: 'age', age: 60 } } }), 64)).toEqual({ you: 4, partner: 5 });
    expect(stopYearsOf(stoppedYou({ kind: 'age', age: 58 }))).toEqual({ you: 0, partner: 3 });
    expect(stopYearsOf(stoppedYou({ kind: 'ages' }), 61)).toEqual({ you: 0, partner: 6 });
    expect(stopYearsOf(ins(), 65)).toEqual({ you: 5, partner: 5 });                     // "when you do": moves alongside
    expect(stopYearsOf(checkInputs(SCHEMA_A, { you: { pot: 1, age: 50 }, stop: { kind: 'ages' }, spend: { amount: 1 } }, TEST_ENV).inputs)).toEqual({ you: 0 });
  });

  it('alreadyStopped: also when you have both stopped; never while the partner still works', () => {
    expect(alreadyStopped(stoppedYou({ kind: 'already' }), TEST_ENV.today)).toBe(true);
    expect(alreadyStopped(stoppedYou({ kind: 'age', age: 58 }), TEST_ENV.today)).toBe(false);
    expect(alreadyStopped({ you: { age: 60 }, stop: { kind: 'already' } }, TEST_ENV.today)).toBe(false);   // one person: the form says so instead
    const atSpa = (partner) => ({ household: 'couple', you: { age: 67 }, stop: { age: 67 }, partner: { age: 60, ...partner } });
    expect(alreadyStopped(atSpa({}), TEST_ENV.today)).toBe(true);                                      // today's rule, the partner with you
    expect(alreadyStopped(atSpa({ stop: { kind: 'already' } }), TEST_ENV.today)).toBe(true);
    expect(alreadyStopped(atSpa({ stop: { kind: 'age', age: 63 } }), TEST_ENV.today)).toBe(false);       // the partner is still working
  });

  it('agesToShow: the sweep is the asked person\'s ages', () => {
    const shown = agesToShow(stoppedYou({ kind: 'age', age: 58 }), TEST_ENV, 'chart');
    expect(shown).toEqual([56, 57, 58, 59, 60, 63, 67]);                                  // 55 today, State Pension age 67
    expect(agesToShow(stoppedYou({ kind: 'ages' }), TEST_ENV, 'chart', null)).toEqual([55, 57, 60, 62, 65, 67]);
    expect(agesToShow(ins(), TEST_ENV, 'chart')).toEqual([60, 61, 62, 63, 64, 67]);         // you, as today (67 is five on and the State Pension age)
  });

  it('handOverToC: per person, at each one\'s own stop', () => {
    // you stop at 62; your partner stopped at 50 with their pension closed until 57, and no savings
    const closed = (untilBothStop) => checkInputs(SCHEMA_A, { household: 'couple', you: { pot: 250000, age: 56 }, partner: { age: 50, pot: 90000, stop: { kind: 'already' } },
      stop: { age: 57 }, spend: { amount: 2000 }, ...(untilBothStop ? { untilBothStop } : {}) }, TEST_ENV).inputs;
    expect(handOverToC(closed(), 57, TEST_ENV.today)).toEqual({ ok: true, same: true });
    expect(handOverToC(closed('none'), 57, TEST_ENV.today)).toEqual({ ok: false, same: true });
    // "I've already stopped": C starts now and takes the partner's own stop
    expect(handOverToC(stoppedYou({ kind: 'age', age: 58 }), 58, TEST_ENV.today)).toEqual({ ok: true, same: true });
    expect(handOverToC(stoppedYou({ kind: 'age', age: 58 }), 54, TEST_ENV.today).ok).toBe(false);   // before the partner's age today
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
    for (const [path, want] of Object.entries(f.when || {})) d[path] = Array.isArray(want) ? want[0] : want;
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
    expect(f.min - 1 < 0 ? 'notANumber' : 'tooLow').toBe(below);   // "-1" is not a number a person can mean
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
    expect(parse().usedDefault).toEqual(['household', 'you.statePension.kind', 'you.finalSalary.has', 'savings', 'stop.kind', 'you.payIn.kind', 'you.payIn.total',
      'you.alreadyDrawing', 'spend.kind', 'partTime.has', 'savingsIn', 'savingRisk', 'risk', 'charge', 'endAge']);
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

// Last in the file: it rebuilds the modules with the switch off, and nothing after it may import them again.
describe('the owner\'s switch 3 ("I\'ve already stopped" in A and B) is one switch', () => {
  it('off: A\'s and B\'s stop questions are today\'s, the partner sweeps no ages, and no rule names what is not offered', async () => {
    vi.resetModules();
    vi.doMock('../../../src/answers/shared/household.js', async () => {
      const real = await vi.importActual('../../../src/answers/shared/household.js');
      return { ...real, APART: Object.freeze({ ...real.APART, askAboutPartner: false }) };
    });
    try {
      const { SCHEMA_A: A } = await import('../../../src/answers/a/schema.js');
      const { SCHEMA_B: B } = await import('../../../src/answers/b/schema.js');
      const parts = await import('../../../src/answers/shared/schemaParts.js');
      const field = (s, path) => s.fields.find((f) => f.path === path);
      expect(field(A, 'stop.kind').options).toEqual(['age', 'ages']);
      expect(field(B, 'stop.kind')).toBeUndefined();
      expect(field(B, 'stop.age').whenNot).toBeUndefined();
      expect(field(A, 'partner.stop.kind').options).toEqual(['same', 'already', 'age']);
      expect(field(A, 'untilBothStop').when).toEqual({ 'partner.stop.kind': ['already', 'age'], household: 'couple' });
      expect(field(A, 'you.taxFreeTaken')).toBeUndefined();
      for (const s of [A, B]) {
        expect(field(s, 'you.payIn.kind').whenNot, s.id).toBeUndefined();
        expect(field(s, 'partner.payIn.kind').whenNot, s.id).toEqual({ 'partner.stop.kind': 'already' });
        for (const id of ['already-needs-partner', 'partner-stop-fits', 'partner-ages-one-at-a-time', 'partner-stop-ages-past-75', 'partner-stop-after-now']) {
          expect(s.rules.map((r) => r.id), `${s.id} ${id}`).not.toContain(id);
        }
      }
      expect(field(A, 'partTime.has').whenNot).toBeUndefined();
      expect(parts.askedAbout({ household: 'couple', partner: { age: 50 }, stop: { kind: 'already' } })).toBe('you');
      // the rest of the feature stands: a partner who has already stopped, the pay line
      const r = parseDraft(A, { ...BASE, household: 'couple', 'partner.age': '58', 'partner.stop.kind': 'already', untilBothStop: 'none' }, TEST_ENV);
      expect(r.ok).toBe(true);
      expect(r.inputs.untilBothStop).toBe('none');
    } finally {
      vi.doUnmock('../../../src/answers/shared/household.js');
      vi.resetModules();
    }
  });
});
