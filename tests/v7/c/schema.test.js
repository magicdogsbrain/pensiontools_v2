/**
 * The input list for question C, tested as data (V7 build brief 6, package 1; test plan 1.2).
 * Labels are checked by the wording test (package 4), which owns the words.
 */
import { describe, it, expect } from 'vitest';
import { SCHEMA_C, answerC, TEST_ENV, get, renderScreen } from './_c.js';
import { defaults, fieldsThatApply, parseDraft, validate, checkInputs, flatten, MESSAGE_IDS } from '../../../src/answers/shared/validate.js';
import { partsText } from '../../../src/answers/shared/format.js';
import { RULES, BAND, fullStatePensionYearly } from '../../../src/answers/shared/rules.js';
import { LUMP_SUM_ALLOWANCE } from '../../../src/services/PensionAccess.js';
import { TAX_DEFAULTS } from '../../../src/constants.js';
import { RISK_PRESETS } from '../../../src/services/GlidepathService.js';
import { initialState } from '../../../src/v7/state/initial.js';

const TYPES = ['money', 'age', 'choice', 'yesNo'];
const byPath = new Map(SCHEMA_C.fields.map((f) => [f.path, f]));
const isNumber = (f) => f.type === 'money' || f.type === 'age';

describe('SCHEMA_C — the declaration', () => {
  it('has id c and unique paths', () => {
    expect(SCHEMA_C.id).toBe('c');
    expect(byPath.size).toBe(SCHEMA_C.fields.length);
  });

  it('holds no words: only the known keys, and no label, help or error text', () => {
    const allowed = ['path', 'type', 'min', 'max', 'required', 'default', 'when', 'group', 'boundaries', 'options'];
    for (const f of SCHEMA_C.fields) expect(Object.keys(f).filter((k) => !allowed.includes(k)), f.path).toEqual([]);
  });

  it.each(SCHEMA_C.fields.map((f) => [f.path, f]))('%s has a type, a group, and limits or options', (_p, f) => {
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
    SCHEMA_C.fields.forEach((f, i) => {
      for (const [path, want] of Object.entries(f.when || {})) {
        const at = SCHEMA_C.fields.findIndex((x) => x.path === path);
        expect(at, `${f.path} when ${path}`).toBeGreaterThanOrEqual(0);
        expect(at, `${f.path} when ${path} must come first`).toBeLessThan(i);
        const dep = SCHEMA_C.fields[at];
        if (dep.type === 'choice') expect(dep.options).toContain(want);
        if (dep.type === 'yesNo') expect(typeof want).toBe('boolean');
      }
    });
  });

  it('every partner field applies only to a couple', () => {
    for (const f of SCHEMA_C.fields.filter((x) => x.path.startsWith('partner.'))) expect(f.when.household, f.path).toBe('couple');
  });

  it('no required field has a default, and no field is both optional and without one', () => {
    for (const f of SCHEMA_C.fields) expect(Boolean(f.required) !== ('default' in f), f.path).toBe(true);
  });

  it('a default is an allowed value, or names a default rule that exists', () => {
    for (const f of SCHEMA_C.fields.filter((x) => 'default' in x)) {
      const d = f.default;
      if (d && typeof d === 'object') expect(typeof SCHEMA_C.defaultRules[d.rule], f.path).toBe('function');
      else if (f.type === 'choice') expect(f.options).toContain(d);
      else if (f.type === 'yesNo') expect(typeof d).toBe('boolean');
      else if (d !== null) { expect(d).toBeGreaterThanOrEqual(f.min); expect(d).toBeLessThanOrEqual(f.max); }
    }
    expect(byPath.get('you.age').default).toBeUndefined();   // an age is never assumed
  });

  it('a single person must type two things, a couple three; the limit is five', () => {
    const required = (values) => fieldsThatApply(SCHEMA_C, { ...defaults(SCHEMA_C, values, TEST_ENV), ...values }).filter((f) => f.required).map((f) => f.path);
    expect(required({ household: 'single' })).toEqual(['you.pot', 'you.age']);
    expect(required({ household: 'couple' })).toEqual(['you.pot', 'you.age', 'partner.age']);
    expect(required({ household: 'single' }).length).toBeLessThanOrEqual(5);
  });

  it('every rule has an id and names fields that exist; rule ids do not clash with the other message ids', () => {
    expect(SCHEMA_C.rules.map((r) => r.id)).toEqual(['start-not-before-now', 'start-not-before-access', 'end-after-start']);
    for (const r of SCHEMA_C.rules) {
      expect(MESSAGE_IDS).not.toContain(r.id);
      for (const p of r.fields) expect(byPath.has(p), `${r.id}: ${p}`).toBe(true);
    }
  });

  it('the risk levels are today\'s RISK_PRESETS', () => {
    expect(byPath.get('risk').options).toEqual(Object.keys(RISK_PRESETS));
  });

  it('the defaults plus the required fields pass, and come back as the checked inputs of the brief', () => {
    const r = parseDraft(SCHEMA_C, { 'you.pot': '250000', 'you.age': '58' }, TEST_ENV);
    expect(r.ok).toBe(true);
    expect(r.inputs).toEqual({
      household: 'single', you: { pot: 250000, age: 58, statePension: { kind: 'full' }, finalSalary: { has: false } },
      start: { kind: 'now' }, savings: 0, risk: 'balanced', endAge: 95, take: null
    });
    expect(validate(SCHEMA_C, r.inputs, TEST_ENV)).toEqual({ ok: true, errors: {} });
    expect(checkInputs(SCHEMA_C, r.inputs, TEST_ENV).inputs).toEqual(r.inputs);   // checking twice changes nothing
    expect(Object.keys(flatten(r.inputs)).sort()).toEqual(fieldsThatApply(SCHEMA_C, r.values).map((f) => f.path).sort());
  });
});

describe('rules.js — the UK figures agree with today\'s engine', () => {
  it('shares its limits with the engine', () => {
    expect(RULES.taxFreeLimit).toBe(LUMP_SUM_ALLOWANCE);
    expect(RULES.personalAllowance).toBe(TAX_DEFAULTS.PERSONAL_ALLOWANCE);
    expect(RULES.basicRateLimit).toBe(TAX_DEFAULTS.BASIC_RATE_LIMIT);
    expect(RULES.higherRateLimit).toBe(TAX_DEFAULTS.HIGHER_RATE_LIMIT);
  });
  it('the full State Pension is weekly × 52, and the band is 9, 5 and 1 in 10', () => {
    expect(fullStatePensionYearly()).toBe(12547.6);
    expect(BAND).toEqual({ careful: 0.9, middling: 0.5, good: 0.1 });
  });
});

// ---- The answer function's contract, on the real function (once the package-1 stub; joined up). ----------------
describe('the answer function', () => {
  const inputs = { household: 'single', you: { pot: 250000, age: 58 } };
  const sentencesOf = (r) => [...Object.values(r.sentences).flatMap((s) => (Array.isArray(s) ? s : [s])), ...r.assumed, ...r.warnings];

  it('returns plain data with inputs and the basis filled in, the same twice, every sentence its parts joined', () => {
    const couple = { household: 'couple', you: { pot: 400000, age: 62 }, partner: { age: 60 } };
    const r = answerC(couple, TEST_ENV);
    expect(r.status).toBe('ok');
    expect(r.inputs.partner).toEqual({ age: 60, pot: 0, statePension: { kind: 'full' }, finalSalary: { has: false } });
    expect(r.basis).toMatchObject({ today: '2026-09-30', futures: 40, seed: 0, failuresAllowed: 4 });
    for (const s of sentencesOf(r)) expect(partsText(s.parts, r), s.id).toBe(s.text);
    for (const s of sentencesOf(r)) for (const p of s.parts) if (p && p.key) expect(typeof get(r, p.key), `${s.id}: ${p.key}`).toBe('number');
    for (const a of r.assumed) if (a.source === 'default') expect(typeof a.field, a.id).toBe('string');
    r.phases.forEach((ph, i) => {
      expect(ph.shown.fromPots + ph.shown.statePension + ph.shown.finalSalary).toBe(ph.shown.takeHome);
      if (i > 0) expect(ph.fromAge).toBe(r.phases[i - 1].toAge);
    });
    expect(r.phases.at(-1).toAge).toBe(r.inputs.endAge);
    expect(r.sentences.line.text).toContain('£400,000');
    expect(answerC(couple, TEST_ENV)).toEqual(r);
    expect(JSON.parse(JSON.stringify(r))).toEqual(r);
  });

  it('never throws: bad inputs and a missing date come back as status invalid', () => {
    expect(answerC({ you: { pot: -1, age: 58 } }, TEST_ENV)).toEqual({ status: 'invalid', problems: [{ field: 'you.pot', messageId: 'tooLow' }] });
    expect(answerC({}, TEST_ENV).problems.map((p) => p.field)).toEqual(['you.pot', 'you.age']);
    expect(answerC(null, TEST_ENV).status).toBe('invalid');
    expect(answerC(inputs, { futures: 40 }).problems).toEqual([{ field: 'env.today', messageId: 'required' }]);
    expect(answerC(inputs, undefined).status).toBe('invalid');
  });
});

describe('the first state and the screen by name', () => {
  it('initialState is plain data in the agreed shape', () => {
    const s = initialState({ today: '2026-09-30', build: 'test' });
    expect(JSON.parse(JSON.stringify(s))).toEqual(s);
    expect(Object.keys(s)).toEqual(['route', 'env', 'session', 'plan', 'draft', 'answers', 'ui']);
    expect(s.env).toMatchObject({ today: '2026-09-30', build: 'test', historyEnd: null });
    expect(s.session).toEqual({ kind: 'none' });
    expect(s.plan).toBeNull();
    expect(() => initialState({})).toThrow();
  });

  it('renderScreen draws the state\'s screen by name', () => {
    const s = initialState({ today: '2026-09-30' });
    expect(renderScreen(s).querySelector('main').getAttribute('data-screen')).toBe('front');
    s.route = { screen: 'step', q: 'c', step: 'answer', planId: null, focus: null };
    const main = renderScreen(s).querySelector('main');
    expect(main.getAttribute('data-screen')).toBe('c.answer');
    expect(main.getAttribute('data-question')).toBe('c');
  });
});
