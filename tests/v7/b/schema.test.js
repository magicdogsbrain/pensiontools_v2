/**
 * The input list for question B, tested as data (step 4 brief 6, P0; C's schema.test.js checks run over the list,
 * plus the brief's additions). The shared parts are pinned against A and C in tests/v7/a/schema.test.js.
 */
import { describe, it, expect } from 'vitest';
import { SCHEMA_B, answerB, TEST_ENV, get } from './_b.js';
import { defaults, fieldsThatApply, parseDraft, validate, checkInputs, flatten, MESSAGE_IDS } from '../../../src/answers/shared/validate.js';
import { partsText } from '../../../src/answers/shared/format.js';
import { RULES, SAVING } from '../../../src/answers/shared/rules.js';
import { RISK_PRESETS } from '../../../src/services/GlidepathService.js';
import { gridToShow, stopKindField, partnerStopFields, untilBothStopField, taxFreeFields, handOverToC } from '../../../src/answers/shared/schemaParts.js';

const TYPES = ['money', 'age', 'choice', 'yesNo', 'percent', 'count', 'steps'];   // steps: the spending shape's later steps (spending-shape.md 3.3)
const byPath = new Map(SCHEMA_B.fields.map((f) => [f.path, f]));
const isNumber = (f) => f.type === 'money' || f.type === 'age' || f.type === 'percent' || f.type === 'count';
const BASE = { 'you.pot': '120000', 'you.age': '50', 'you.payIn.total': '700', 'stop.age': '60', 'spend.amount': '2000' };
const parse = (extra = {}, env = TEST_ENV) => parseDraft(SCHEMA_B, { ...BASE, ...extra }, env);

describe('SCHEMA_B — the declaration', () => {
  it('has id b and unique paths', () => {
    expect(SCHEMA_B.id).toBe('b');
    expect(byPath.size).toBe(SCHEMA_B.fields.length);
  });

  it('holds no words: only the known keys, and no label, help or error text', () => {
    const allowed = ['path', 'type', 'min', 'max', 'step', 'required', 'default', 'when', 'whenNot', 'group', 'boundaries', 'options', 'unit'];   // unit: a steps field's (perMonth | share)
    for (const f of SCHEMA_B.fields) expect(Object.keys(f).filter((k) => !allowed.includes(k)), f.path).toEqual([]);
  });

  it.each(SCHEMA_B.fields.map((f) => [f.path, f]))('%s has a type, a group, and limits or options', (_p, f) => {
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
    SCHEMA_B.fields.forEach((f, i) => {
      for (const [path, given] of [...Object.entries(f.when || {}), ...Object.entries(f.whenNot || {})]) {
        const at = SCHEMA_B.fields.findIndex((x) => x.path === path);
        expect(at, `${f.path} when ${path}`).toBeGreaterThanOrEqual(0);
        expect(at, `${f.path} when ${path} must come first`).toBeLessThan(i);
        const dep = SCHEMA_B.fields[at];
        for (const want of Array.isArray(given) ? given : [given]) {
          if (dep.type === 'choice') expect(dep.options, `${f.path}: ${path} = ${want}`).toContain(want);
          if (dep.type === 'yesNo') expect(typeof want).toBe('boolean');
        }
      }
      const keys = Object.keys(f.when || {});
      if (keys.length) expect(Array.isArray(f.when[keys[keys.length - 1]]), f.path).toBe(false);
    });
  });

  it('every partner field applies only to a couple', () => {
    for (const f of SCHEMA_B.fields.filter((x) => x.path.startsWith('partner.'))) expect(f.when.household, f.path).toBe('couple');
  });

  it('no required field has a default, and no field is both optional and without one — but the questions of stopping apart', () => {
    // couples-different-years.md 3.1: none of the new questions has a default (B's new stop question too: not answered is
    // an age), so the checked inputs of a form that never answers them are today's, key for key
    // …and the spending shape's (spending-shape.md 3.2): not answered is the same every year, today's inputs key for key
    const NO_DEFAULT = ['stop.kind', 'partner.stop.kind', 'untilBothStop', 'you.taxFreeTaken', 'partner.taxFreeTaken', 'spend.then', 'spend.steps'];
    for (const f of SCHEMA_B.fields) {
      if (NO_DEFAULT.includes(f.path)) { expect(f.required, f.path).toBeUndefined(); expect('default' in f, f.path).toBe(false); continue; }
      expect(Boolean(f.required) !== ('default' in f), f.path).toBe(true);
    }
  });

  it('a default is an allowed value; an age is never assumed', () => {
    for (const f of SCHEMA_B.fields.filter((x) => 'default' in x)) {
      const d = f.default;
      if (f.type === 'choice') expect(f.options).toContain(d);
      else if (f.type === 'yesNo') expect(typeof d).toBe('boolean');
      else if (d !== null) { expect(d).toBeGreaterThanOrEqual(f.min); expect(d).toBeLessThanOrEqual(f.max); }
    }
    expect(byPath.get('you.age').default).toBeUndefined();
    expect(byPath.get('stop.age').default).toBeUndefined();
    expect(SCHEMA_B.defaultRules).toBeUndefined();
  });

  it('the groups are the blocks of the form; savings and confidence are under more detail', () => {
    // the stop question comes before the pay-in block, which "I've already stopped" hides (couples-different-years.md 3.1)
    // the spending shape is its own block on the spend step (spending-shape.md 4.1)
    expect([...new Set(SCHEMA_B.fields.map((f) => f.group))]).toEqual(['who', 'you', 'stop', 'more', 'spend', 'shape', 'partner']);
    expect(byPath.get('savings').group).toBe('more');
    expect(byPath.get('confidence')).toEqual({ path: 'confidence', type: 'choice', options: ['nineInTen', 'threeInFour'], default: 'nineInTen', group: 'more' });
    expect(byPath.get('stop.kind')).toEqual({ path: 'stop.kind', type: 'choice', options: ['age', 'already'], group: 'stop' });   // no "show me ages", no default
    expect(byPath.has('partTime.has')).toBe(false);
  });

  it('the stop-age boundaries include 53 to 57, the stop age is always asked, and 75 is the ceiling', () => {
    for (const a of [53, 54, 55, 56, 57]) expect(byPath.get('stop.age').boundaries).toContain(a);
    expect(byPath.get('stop.age')).toMatchObject({ required: true, min: 18, max: RULES.stopAgeMax, group: 'stop' });
    expect(byPath.get('stop.age').when).toBeUndefined();
    expect(byPath.get('stop.age').whenNot).toEqual({ 'stop.kind': 'already' });   // asked unless "I've already stopped"
  });

  it('the pay-in is required, up to £10,000 a month', () => {
    expect(byPath.get('you.payIn.total')).toMatchObject({ required: true, min: 0, max: SAVING.payInCeiling, when: { 'you.payIn.kind': 'total' } });
    expect(byPath.get('partner.payIn.total')).toMatchObject({ default: 0 });
  });

  it('a single person must type five things, a couple six; the limit is five plus the partner\'s age', () => {
    const required = (values) => fieldsThatApply(SCHEMA_B, { ...defaults(SCHEMA_B, values, TEST_ENV), ...values }).filter((f) => f.required).map((f) => f.path);
    expect(required({ household: 'single' })).toEqual(['you.pot', 'you.age', 'you.payIn.total', 'stop.age', 'spend.amount']);
    expect(required({ household: 'single', 'spend.kind': 'level' })).toEqual(['you.pot', 'you.age', 'you.payIn.total', 'stop.age', 'spend.level']);
    expect(required({ household: 'couple' })).toEqual(['you.pot', 'you.age', 'you.payIn.total', 'stop.age', 'spend.amount', 'partner.age']);
    expect(required({ household: 'single' }).length).toBeLessThanOrEqual(5);
  });

  it('every rule has an id and names fields that exist; rule ids do not clash with the other message ids', () => {
    expect(SCHEMA_B.rules.map((r) => r.id)).toEqual(['stop-after-now', 'end-after-stop', 'pay-in-over-limit', 'shape-steps',
      'partner-stop-after-now', 'partner-stop-not-before-now', 'already-needs-partner', 'partner-stop-fits']);
    for (const r of SCHEMA_B.rules) {
      expect(MESSAGE_IDS).not.toContain(r.id);
      for (const p of r.fields) expect(byPath.has(p), `${r.id}: ${p}`).toBe(true);
    }
  });

  it('the risk levels are today\'s RISK_PRESETS', () => {
    expect(byPath.get('risk').options).toEqual(Object.keys(RISK_PRESETS));
    expect(byPath.get('savingRisk').options).toEqual(Object.keys(RISK_PRESETS));
  });

  it('carries the rules of the list: gridToShow, and no ages rule', () => {
    expect(typeof SCHEMA_B.gridToShow).toBe('function');
    expect(SCHEMA_B.agesToShow).toBeNull();
  });

  it('the defaults plus the required fields pass, and come back as the checked inputs', () => {
    const r = parse();
    expect(r.ok).toBe(true);
    expect(r.inputs).toEqual({
      household: 'single',
      you: { age: 50, pot: 120000, payIn: { kind: 'total', total: 700 }, alreadyDrawing: false, statePension: { kind: 'full' }, finalSalary: { has: false } },
      stop: { age: 60 }, spend: { kind: 'amount', amount: 2000 },
      savings: 0, savingsIn: 0, savingRisk: 'balanced', risk: 'balanced', charge: 0.5, endAge: 95, confidence: 'nineInTen'
    });
    expect(validate(SCHEMA_B, r.inputs, TEST_ENV)).toEqual({ ok: true, errors: {} });
    expect(checkInputs(SCHEMA_B, r.inputs, TEST_ENV).inputs).toEqual(r.inputs);
    // every field that applies is in the checked inputs, but a question with no default that was not answered (B's stop
    // question: not answered is an age)
    expect(Object.keys(flatten(r.inputs)).sort()).toEqual(fieldsThatApply(SCHEMA_B, r.values).filter((f) => f.required || 'default' in f).map((f) => f.path).sort());
    expect(r.usedDefault).toEqual(['household', 'you.statePension.kind', 'you.finalSalary.has', 'you.payIn.kind', 'you.alreadyDrawing', 'spend.kind',
      'savings', 'savingsIn', 'savingRisk', 'risk', 'charge', 'endAge', 'confidence']);
  });

  it('nothing typed: the five required boxes, and nothing else', () => {
    expect(parseDraft(SCHEMA_B, {}, TEST_ENV).errors).toEqual({ 'you.pot': 'required', 'you.age': 'required', 'you.payIn.total': 'required', 'stop.age': 'required', 'spend.amount': 'required' });
  });

  it('a pay-in of nothing is a valid case; "split it up" needs both parts', () => {
    expect(parse({ 'you.payIn.total': '0' }).ok).toBe(true);
    expect(parse({ 'you.payIn.kind': 'split' }).errors).toEqual({ 'you.payIn.own': 'required', 'you.payIn.employer': 'required' });
    expect(parse({ 'you.payIn.kind': 'split', 'you.payIn.own': '450', 'you.payIn.employer': '250' }).inputs.you.payIn).toEqual({ kind: 'split', own: 450, employer: 250 });
    expect(parse({ 'you.payIn.total': '10,001' }).errors).toEqual({ 'you.payIn.total': 'tooHigh' });
  });

  it('percent and count as typed: a charge of "0.5", "0.5%", " 1 "', () => {
    for (const [text, value] of [['0.5', 0.5], ['0.5%', 0.5], [' 1 ', 1]]) expect(parse({ charge: text }).inputs.charge).toBe(value);
    expect(parse({ charge: 'half' }).errors).toEqual({ charge: 'notANumber' });
    // 6.19.0: 0 to 3 in steps of 0.05 (today's planner's range); a 0.05 stays 0.05 all the way to the household
    for (const [text, value] of [['0.05', 0.05], ['0.45%', 0.45], ['2.95', 2.95], ['3', 3]]) expect(parse({ charge: text }).inputs.charge).toBe(value);
    expect(parse({ charge: '0.07' }).errors).toEqual({ charge: 'notANumber' });
    expect(parse({ charge: '3.05' }).errors).toEqual({ charge: 'tooHigh' });
  });
});

describe('every boundary passes; one below and one above fail', () => {
  const LIMIT_ERRORS = ['required', 'notANumber', 'tooLow', 'tooHigh', 'notAnOption'];
  function draftWhere(f, typed = false) {
    const d = typed ? { 'you.pot': 120000, 'you.age': 50, 'you.payIn.total': 700, 'stop.age': 60, 'spend.amount': 2000 } : { ...BASE };
    for (const [path, want] of Object.entries(f.when || {})) d[path] = Array.isArray(want) ? want[0] : want;
    if (d.household === 'couple') d['partner.age'] = typed ? 48 : '48';
    if (d['you.payIn.kind'] === 'split') { d['you.payIn.own'] ??= typed ? 450 : '450'; d['you.payIn.employer'] ??= typed ? 250 : '250'; }
    if (d['partner.payIn.kind'] === 'split') { d['partner.payIn.own'] ??= typed ? 450 : '450'; d['partner.payIn.employer'] ??= typed ? 250 : '250'; }
    if (f.path === 'endAge') { d['you.age'] = typed ? 30 : '30'; }
    if (f.path === 'stop.age') { d['you.age'] = typed ? 18 : '18'; }
    if (f.path === 'you.age') { d['stop.age'] = typed ? 75 : '75'; d.endAge = typed ? 105 : '105'; }
    if (f.path === 'partner.age') { d['you.age'] = typed ? 18 : '18'; d['stop.age'] = typed ? 19 : '19'; }
    return d;
  }
  const numbers = SCHEMA_B.fields.filter((f) => f.boundaries);
  it.each(numbers.map((f) => [f.path, f]))('%s', (_p, f) => {
    for (const b of f.boundaries) {
      if (f.path === 'you.age' && b >= 75) continue;   // a stop age after today's age cannot exist for someone of 75 or more: B's rule, tested below
      const e = parseDraft(SCHEMA_B, { ...draftWhere(f), [f.path]: String(b) }, TEST_ENV).errors[f.path];
      expect(LIMIT_ERRORS, `${f.path} = ${b} gave ${e}`).not.toContain(e);
    }
    const below = parseDraft(SCHEMA_B, { ...draftWhere(f), [f.path]: String(f.min - 1) }, TEST_ENV).errors[f.path];
    expect(f.min - 1 < 0 ? 'notANumber' : 'tooLow').toBe(below);
    expect(parseDraft(SCHEMA_B, { ...draftWhere(f), [f.path]: String(f.max + 1) }, TEST_ENV).errors[f.path]).toBe('tooHigh');
    const typed = (v) => checkInputs(SCHEMA_B, nestFlat({ ...draftWhere(f, true), [f.path]: v }), TEST_ENV).errors[f.path];
    expect(typed(f.min - 1)).toBe('tooLow');
    expect(typed(f.max + 1)).toBe('tooHigh');
    expect(LIMIT_ERRORS).not.toContain(typed(f.min));
    if (f.path !== 'you.age') expect(LIMIT_ERRORS).not.toContain(typed(f.max));
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
  it('stop-after-now: the stop age must come after today\'s age (this question is for people still working)', () => {
    expect(parse({ 'you.age': '60', 'stop.age': '60' }).errors).toEqual({ 'stop.age': 'stop-after-now' });
    expect(parse({ 'you.age': '60', 'stop.age': '59' }).errors).toEqual({ 'stop.age': 'stop-after-now' });
    expect(parse({ 'you.age': '60', 'stop.age': '61' }).ok).toBe(true);
    expect(parse({ 'you.age': '75', 'stop.age': '75' }).errors).toEqual({ 'stop.age': 'stop-after-now' });
  });
  it('end-after-stop, by the younger person\'s age at the stop', () => {
    expect(parse({ 'you.age': '70', 'stop.age': '75', endAge: '75' }).errors).toEqual({ endAge: 'end-after-stop' });
    expect(parse({ 'you.age': '70', 'stop.age': '75', endAge: '76' }).ok).toBe(true);
    expect(parse({ 'you.age': '70', 'stop.age': '75', household: 'couple', 'partner.age': '60', endAge: '75' }).ok).toBe(true);
  });
  it('a field\'s own problem is reported before a rule, and A\'s and C\'s rules never fire on B', () => {
    expect(parse({ 'stop.age': '17' }).errors).toEqual({ 'stop.age': 'tooLow' });
    const ids = Object.values(parse({ 'you.age': '60', 'stop.age': '59', endAge: '75' }).errors);
    expect(ids).not.toContain('stop-not-before-now');
    expect(ids).not.toContain('start-not-before-now');
  });
});

/*
 * Couples who stop work in different years (research/v7/couples-different-years.md 2.2, 3.1–3.3, 5.3). Not answered is
 * today's meaning: B's checked inputs of a form that never answers the new questions are today's, key for key.
 */
describe('B: each of a couple stops on their own date', () => {
  const COUPLE = { household: 'couple', 'partner.age': '48', 'partner.pot': '90000' };
  const two = (extra = {}) => parse({ ...COUPLE, ...extra });

  it('the new questions, declared once in the shared parts; B\'s partner sweeps no ages', () => {
    for (const f of [...partnerStopFields('b'), untilBothStopField('b'), ...taxFreeFields('b'), stopKindField('b')]) expect(byPath.get(f.path), f.path).toEqual(f);
    expect(byPath.get('partner.stop.kind').options).toEqual(['same', 'already', 'age']);
    expect(byPath.get('untilBothStop').when).toEqual({ 'partner.stop.kind': ['already', 'age'], household: 'couple' });
    for (const p of ['you.payIn.kind', 'you.payIn.total', 'you.alreadyDrawing']) expect(byPath.get(p).whenNot, p).toEqual({ 'stop.kind': 'already' });
    for (const p of ['partner.payIn.kind', 'partner.payIn.total', 'partner.alreadyDrawing']) expect(byPath.get(p).whenNot, p).toEqual({ 'partner.stop.kind': 'already' });
  });

  it('never answered: today\'s inputs, key for key, in today\'s order', () => {
    const r = two({ 'partner.payIn.total': '300' });
    expect(r.ok).toBe(true);
    expect(JSON.stringify(Object.keys(r.inputs))).toBe(JSON.stringify(['household', 'you', 'stop', 'spend', 'partner', 'savings', 'savingsIn', 'savingRisk', 'risk', 'charge', 'endAge', 'confidence']));
    expect(r.inputs.stop).toEqual({ age: 60 });
    expect(Object.keys(r.inputs.partner)).toEqual(['age', 'pot', 'statePension', 'finalSalary', 'payIn', 'alreadyDrawing']);
  });

  it('"I\'ve already stopped" hides your stop age and your pay-in; the partner must then stop after today', () => {
    expect(parse({ 'stop.kind': 'already' }).errors).toEqual({ 'stop.kind': 'already-needs-partner' });
    expect(two({ 'stop.kind': 'already' }).errors).toEqual({ 'partner.stop.kind': 'partner-stop-fits' });
    expect(two({ 'stop.kind': 'already', 'partner.stop.kind': 'age', 'partner.stop.age': '48' }).errors).toEqual({ 'partner.stop.age': 'partner-stop-after-now' });
    expect(two({ 'stop.kind': 'already', 'partner.stop.kind': 'age', 'partner.stop.age': '47' }).errors).toEqual({ 'partner.stop.age': 'partner-stop-after-now' });
    const r = two({ 'stop.kind': 'already', 'partner.stop.kind': 'age', 'partner.stop.age': '56', 'partner.payIn.total': '400' });
    expect(r.ok).toBe(true);
    expect(r.inputs.stop).toEqual({ kind: 'already' });
    expect('payIn' in r.inputs.you).toBe(false);
    expect(r.inputs.partner.payIn).toEqual({ kind: 'total', total: 400 });
    // your partner working on while you work: their age is theirs, and may be today's (stopping now)
    expect(two({ 'partner.stop.kind': 'age', 'partner.stop.age': '48' }).ok).toBe(true);
    expect(two({ 'partner.stop.kind': 'age', 'partner.stop.age': '47' }).errors).toEqual({ 'partner.stop.age': 'partner-stop-not-before-now' });
    expect(two({ 'partner.stop.kind': 'ages' }).errors).toEqual({ 'partner.stop.kind': 'notAnOption' });
  });

  it('gridToShow: the asked person\'s stop ages are the rows; the ceiling counts only the people still saving', () => {
    const ins = (extra) => checkInputs(SCHEMA_B, { household: 'couple', you: { pot: 120000, age: 50, payIn: { total: 700 } }, partner: { age: 48, payIn: { total: 300 } },
      stop: { age: 60 }, spend: { amount: 2000 }, ...extra }, TEST_ENV).inputs;
    expect(gridToShow(ins(), TEST_ENV).payIns[0]).toBe(1000);
    const stopped = ins({ stop: { kind: 'already' }, partner: { age: 48, payIn: { total: 300 }, stop: { kind: 'age', age: 56 } } });
    const g = gridToShow(stopped, TEST_ENV, { needed: 15000 });
    expect(g.ages).toEqual([54, 55, 56, 57, 58, 59, 60, 61]);                          // the partner's, around 56
    expect(g.payIns[0]).toBe(300);                                                      // what goes in now: theirs
    expect(g.payIns.at(-1)).toBeLessThan(15000);                                        // one person saving: £10,000 a month at most
    expect(gridToShow(ins({ partner: { age: 48, stop: { kind: 'already' } } }), TEST_ENV, { needed: 15000 }).payIns).toEqual([700, 800, 900, 1000, 1100]);
  });

  it('handOverToC: "I\'ve already stopped" carries as C from now, with the partner\'s own stop', () => {
    const ins = checkInputs(SCHEMA_B, { household: 'couple', you: { pot: 120000, age: 60 }, partner: { age: 48, payIn: { total: 300 }, stop: { kind: 'age', age: 56 } },
      stop: { kind: 'already' }, spend: { amount: 2000 } }, TEST_ENV).inputs;
    expect(handOverToC(ins, 56, TEST_ENV.today)).toEqual({ ok: true, same: true });
  });
});

// ---- The shell's data for B: the rail and the registry (step 4 brief 4.12, 4.14). ---------------------------------
describe('the shell\'s data for question B', () => {
  it('QUESTION_B has the steps of the brief with the budget step (budget-step.md) and keep built (save-as-plan.md), and every "needs" names a field of the input list or the answer', async () => {
    const { QUESTION_B, NEXT_B } = await import('../../../src/v7/rail/b.js');
    expect(QUESTION_B.id).toBe('b');
    expect(QUESTION_B.steps.map((s) => s.id)).toEqual(['numbers', 'spend', 'answer', 'choices', 'keep']);
    expect(QUESTION_B.steps.map((s) => s.optional)).toEqual([false, false, false, true, true]);
    expect(QUESTION_B.steps.map((s) => s.built)).toEqual([true, true, true, true, true]);
    expect(QUESTION_B.steps.map((s) => s.end)).toEqual([false, false, false, false, true]);
    for (const s of QUESTION_B.steps) for (const n of s.needs) expect(n === 'answer' || byPath.has(n), n).toBe(true);
    expect(QUESTION_B.steps[2].needs).toEqual(['you.age', 'you.pot', 'you.payIn.total', 'stop.age', 'spend.amount']);
    // 'b.choices': on the grid step itself, read or press a cell — never "try two together" (review of 1 Oct 2026)
    expect(NEXT_B).toEqual(['b.retired', 'b.failed', 'b.working', 'b.blank', 'b.spend', 'b.fix', 'b.ready', 'b.keep', 'b.choices', 'b.none', 'b.short', 'b.onCourse']);
  });
  it('answerB is registered under ANSWERS.b with SCHEMA_B, and the worker\'s question ids are the registry\'s', async () => {
    const { ANSWERS } = await import('../../../src/answers/index.js');
    expect(ANSWERS.b.schema).toBe(SCHEMA_B);
    expect(ANSWERS.b.answer).toBe(answerB);
    for (const q of Object.keys(ANSWERS)) expect(ANSWERS[q].schema.id).toBe(q);
  });
});

// ---- The answer function's contract, on the stub (P0) and then the real function (P3). ----------------------------
describe('the answer function', () => {
  const inputs = { household: 'single', you: { pot: 120000, age: 50, payIn: { kind: 'split', own: 450, employer: 250 } }, stop: { age: 60 }, spend: { amount: 2000 } };
  const flat = (s) => (Array.isArray(s) ? s.flatMap(flat) : s && s.parts ? [s] : s && typeof s === 'object' ? Object.values(s).flatMap(flat) : []);
  const sentencesOf = (r) => [...flat(r.sentences), ...r.assumed, ...r.warnings];

  it('returns plain data of the contract\'s shape with inputs and the basis filled in, the same twice, every sentence its parts joined', () => {
    const r = answerB(inputs, TEST_ENV);
    expect(r.status).toBe('ok');
    expect(r.inputs).toEqual(checkInputs(SCHEMA_B, inputs, TEST_ENV).inputs);
    expect(r.basis).toMatchObject({ today: '2026-09-30', futures: 40, seed: 0, failuresAllowed: 4, closeAllowed: 10, detail: 'answer', potStep: 1000, potMax: 5000000, payInCeiling: 10000, laterYears: 10 });
    for (const key of ['whose', 'spend', 'stop', 'ages', 'years', 'pensionOpens', 'gapYears', 'saving', 'number', 'already', 'chance', 'onCourse', 'payIn', 'potAtStop',
      'short', 'monthlyIfShort', 'wholeLife', 'outside', 'levers', 'grid', 'phases', 'guaranteed', 'assumed', 'warnings', 'sentences', 'basis', 'units']) {
      expect(key in r, key).toBe(true);
    }
    expect(r.grid).toBeNull();                                        // the answer step's detail carries no grid
    for (const s of sentencesOf(r)) expect(partsText(s.parts, r), s.id).toBe(s.text);
    for (const s of sentencesOf(r)) for (const p of s.parts) if (p && p.key) expect(typeof get(r, p.key), `${s.id}: ${p.key}`).toBe('number');
    for (const a of r.assumed) if (a.source === 'default') expect(typeof a.field, a.id).toBe('string');
    expect(answerB(inputs, TEST_ENV)).toEqual(r);
    expect(JSON.parse(JSON.stringify(r))).toEqual(r);
  });

  it('the number is a whole £1,000; the pay-ins whole £10; short and extra never below 0; the levers each null or of their shape', () => {
    const r = answerB(inputs, TEST_ENV);
    for (const k of ['careful', 'middling', 'good']) expect(r.number[k] % 1000).toBe(0);
    expect(r.number.careful).toBeGreaterThanOrEqual(r.number.middling);
    expect(r.number.middling).toBeGreaterThanOrEqual(r.number.good);
    expect(r.payIn.now).toBe(r.payIn.own + r.payIn.employer);
    expect(r.payIn.needed % 10).toBe(0);
    expect(r.payIn.extra).toBe(Math.max(0, r.payIn.needed - r.payIn.now));
    expect(r.payIn.at.nineInTen).toBeGreaterThanOrEqual(r.payIn.at.threeInFour);
    expect(r.payIn.needed).toBe(r.payIn.at[r.payIn.confidence]);
    expect(r.short).toBe(Math.max(0, r.number.careful - r.potAtStop.now.careful));
    expect(r.already).toBe(r.inputs.you.pot >= r.number.careful);
    expect(r.onCourse).toBe(r.chance.fails <= r.basis.failuresAllowed);
    expect(Object.keys(r.levers)).toEqual(['stopLater', 'payMore', 'spendLess', 'moreRisk', 'accept']);
    expect(r.levers.accept).toEqual({ lasted: r.chance.lasted, short: r.short, monthlyIfShort: r.monthlyIfShort });
    if (r.levers.moreRisk) expect(r.levers.moreRisk.helps).toBe(r.levers.moreRisk.payIn < r.payIn.needed);
    r.phases.forEach((ph, i) => {
      expect(ph.shown.fromPots + ph.shown.statePension + ph.shown.finalSalary + ph.shown.fromWork).toBe(ph.shown.takeHome);
      if (i > 0) expect(ph.fromAge).toBe(r.phases[i - 1].toAge);
    });
    expect(r.phases[0].fromAge).toBe(r.stop.age);
    expect(r.phases.at(-1).toAge).toBe(r.basis.endAge);
  });

  it('the grid comes with detail "grid": one row per age of gridToShow with a cell per pay-in, counts as shares', () => {
    const r = answerB(inputs, { ...TEST_ENV, detail: 'grid' });
    expect(r.basis.detail).toBe('grid');
    expect(r.grid).not.toBeNull();
    expect(r.grid.payIns.length).toBeGreaterThan(0);
    for (const row of r.grid.ages) {
      expect(row.cells.map((c) => c.payIn)).toEqual(r.grid.payIns);
      expect(row.number % 1000).toBe(0);
      for (const c of row.cells) { expect(c.lasted).toBeGreaterThanOrEqual(0); expect(c.lasted).toBeLessThanOrEqual(1); expect(typeof c.outOfTen.words).toBe('string'); }
      row.cells.forEach((c, j) => { if (j > 0) expect(c.lasted).toBeGreaterThanOrEqual(row.cells[j - 1].lasted); });   // non-decreasing along a row
    }
    expect(r.sentences.gridCell).toBeDefined();
    expect(answerB(inputs, TEST_ENV).sentences.gridCell).toBeUndefined();
  });

  it('never throws: bad inputs and a missing date come back as status invalid', () => {
    expect(answerB({ ...inputs, you: { ...inputs.you, pot: -1 } }, TEST_ENV)).toEqual({ status: 'invalid', problems: [{ field: 'you.pot', messageId: 'tooLow' }] });
    expect(answerB({}, TEST_ENV).problems.map((p) => p.field)).toEqual(['you.pot', 'you.age', 'you.payIn.total', 'stop.age', 'spend.amount']);
    expect(answerB(null, TEST_ENV).status).toBe('invalid');
    expect(answerB({ ...inputs, you: { ...inputs.you, age: 60 } }, TEST_ENV).problems).toEqual([{ field: 'stop.age', messageId: 'stop-after-now' }]);
    expect(answerB(inputs, { futures: 40 }).problems).toEqual([{ field: 'env.today', messageId: 'required' }]);
    expect(answerB(inputs, undefined).status).toBe('invalid');
  });
});
