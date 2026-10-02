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
import { DEFAULT_CHARGES_PCT, CHARGES_LIMITS } from '../../../src/services/Charges.js';
import { moreFields, partnerStopFields, untilBothStopField, taxFreeFields, payingInFields, stopYearsOf } from '../../../src/answers/shared/schemaParts.js';

const TYPES = ['money', 'age', 'choice', 'yesNo', 'percent'];
const byPath = new Map(SCHEMA_C.fields.map((f) => [f.path, f]));
const isNumber = (f) => f.type === 'money' || f.type === 'age' || f.type === 'percent';

describe('SCHEMA_C — the declaration', () => {
  it('has id c and unique paths', () => {
    expect(SCHEMA_C.id).toBe('c');
    expect(byPath.size).toBe(SCHEMA_C.fields.length);
  });

  it('holds no words: only the known keys, and no label, help or error text', () => {
    const allowed = ['path', 'type', 'min', 'max', 'step', 'required', 'default', 'when', 'whenNot', 'group', 'boundaries', 'options'];
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

  it('every `when` and `whenNot` names a field declared earlier, with values that field can take (a list: each of them)', () => {
    SCHEMA_C.fields.forEach((f, i) => {
      for (const [path, given] of [...Object.entries(f.when || {}), ...Object.entries(f.whenNot || {})]) {
        const at = SCHEMA_C.fields.findIndex((x) => x.path === path);
        expect(at, `${f.path} when ${path}`).toBeGreaterThanOrEqual(0);
        expect(at, `${f.path} when ${path} must come first`).toBeLessThan(i);
        const dep = SCHEMA_C.fields[at];
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
    for (const f of SCHEMA_C.fields.filter((x) => x.path.startsWith('partner.'))) expect(f.when.household, f.path).toBe('couple');
  });

  it('no required field has a default, and no field is both optional and without one — but "still paying in?"', () => {
    // C's "Are you still paying into this pension?" has no default: not answered is "not paying in", and leaves the
    // checked inputs as they were before the question existed (C's pinned answers stay byte for byte; step 4 brief J8)
    // …and the questions of a couple who stop in different years (couples-different-years.md 3.1): not answered is today's
    // meaning, the partner starting with you, nothing more said
    const NO_DEFAULT = ['you.payIn.has', 'partner.payIn.has', 'partner.stop.kind', 'untilBothStop', 'you.taxFreeTaken', 'partner.taxFreeTaken'];
    for (const f of SCHEMA_C.fields) {
      if (NO_DEFAULT.includes(f.path)) { expect(f.required, f.path).toBeUndefined(); expect('default' in f, f.path).toBe(false); continue; }
      expect(Boolean(f.required) !== ('default' in f), f.path).toBe(true);
    }
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
    expect(SCHEMA_C.rules.map((r) => r.id)).toEqual(['start-not-before-now', 'start-not-before-access', 'pay-in-past-75', 'pay-in-past-75-partner', 'end-after-start', 'pay-in-over-limit',
      'partner-stop-not-before-now']);
    for (const r of SCHEMA_C.rules) {
      expect(MESSAGE_IDS).not.toContain(r.id);
      for (const p of r.fields) expect(byPath.has(p), `${r.id}: ${p}`).toBe(true);
    }
  });

  /*
   * Fund and platform charges (6.19.0; the owner, 1 Oct 2026: "Yes half a percent. But put it as a config parameter
   * somewhere"): ONE setting, under "Add more detail" in C as in A and B — the same field, today's planner's default and
   * range — taken off while saving and while drawing.
   */
  it('the charge: under "Add more detail", A\'s and B\'s very field, 0 to 3 in steps of 0.05, today\'s planner\'s default', () => {
    const charge = byPath.get('charge');
    expect(charge).toEqual(moreFields().find((f) => f.path === 'charge'));
    expect(charge).toMatchObject({ type: 'percent', group: 'more', min: CHARGES_LIMITS.min, max: CHARGES_LIMITS.max, step: CHARGES_LIMITS.step, default: DEFAULT_CHARGES_PCT });
    expect(charge.required).toBeUndefined();
    expect(charge.boundaries).toEqual([0, 0.05, 0.5, 1, 3]);
    // in the more-detail block, between the risk level and the end age (the order A and B keep)
    const more = SCHEMA_C.fields.filter((f) => f.group === 'more').map((f) => f.path);
    expect(more).toEqual(['you.taxFreeTaken', 'partner.taxFreeTaken', 'savings', 'risk', 'charge', 'endAge']);   // the tax-free part: under more detail too
    const at = (path) => parseDraft(SCHEMA_C, { 'you.pot': '250000', 'you.age': '58', charge: path }, TEST_ENV);
    expect(at('1.35').inputs.charge).toBe(1.35);
    expect(at('0.07').errors).toEqual({ charge: 'notANumber' });
    expect(at('3.05').errors).toEqual({ charge: 'tooHigh' });
    expect(at('').inputs.charge).toBe(0.5);
    expect(at('').usedDefault).toContain('charge');
  });

  it('the risk levels are today\'s RISK_PRESETS', () => {
    expect(byPath.get('risk').options).toEqual(Object.keys(RISK_PRESETS));
  });

  it('the defaults plus the required fields pass, and come back as the checked inputs of the brief', () => {
    const r = parseDraft(SCHEMA_C, { 'you.pot': '250000', 'you.age': '58' }, TEST_ENV);
    expect(r.ok).toBe(true);
    expect(r.inputs).toEqual({
      household: 'single', you: { pot: 250000, age: 58, statePension: { kind: 'full' }, finalSalary: { has: false } },
      start: { kind: 'now' }, savings: 0, risk: 'balanced', charge: 0.5, endAge: 95, take: null
    });
    expect(validate(SCHEMA_C, r.inputs, TEST_ENV)).toEqual({ ok: true, errors: {} });
    expect(checkInputs(SCHEMA_C, r.inputs, TEST_ENV).inputs).toEqual(r.inputs);   // checking twice changes nothing
    // every field that applies is in the checked inputs, but a question with no default that was not answered
    expect(Object.keys(flatten(r.inputs)).sort()).toEqual(fieldsThatApply(SCHEMA_C, r.values).filter((f) => f.required || 'default' in f).map((f) => f.path).sort());
  });

  it('"still paying in" answered yes brings what goes in; answered no, or not at all, leaves nothing behind', () => {
    const yes = parseDraft(SCHEMA_C, { 'you.pot': '275,000', 'you.age': '55', 'you.payIn.has': 'yes', 'you.payIn.own': '500', 'you.payIn.employer': '300', 'start.kind': 'age', 'start.age': '67' }, TEST_ENV);
    expect(yes.ok).toBe(true);
    expect(yes.inputs.you.payIn).toEqual({ has: 'yes', kind: 'split', own: 500, employer: 300 });
    expect(parseDraft(SCHEMA_C, { 'you.pot': '275,000', 'you.age': '55', 'you.payIn.has': 'yes' }, TEST_ENV).errors).toEqual({ 'you.payIn.own': 'required', 'you.payIn.employer': 'required' });
    const no = parseDraft(SCHEMA_C, { 'you.pot': '275,000', 'you.age': '55', 'you.payIn.has': 'no', 'you.payIn.own': '500' }, TEST_ENV);
    expect(no.inputs.you.payIn).toEqual({ has: 'no' });
    expect('payIn' in parseDraft(SCHEMA_C, { 'you.pot': '275,000', 'you.age': '55' }, TEST_ENV).inputs.you).toBe(false);
    // still paying in, the start left alone: from the State Pension age, pot or no pot (the reviewers' finding, 1 Oct 2026)
    expect(parseDraft(SCHEMA_C, { 'you.pot': '0', 'you.age': '50', 'you.payIn.has': 'yes', 'you.payIn.own': '300', 'you.payIn.employer': '0' }, TEST_ENV).inputs.start).toEqual({ kind: 'age', age: 67 });
    expect(parseDraft(SCHEMA_C, { 'you.pot': '275,000', 'you.age': '55', 'you.payIn.has': 'yes', 'you.payIn.own': '500', 'you.payIn.employer': '300' }, TEST_ENV).inputs.start).toEqual({ kind: 'age', age: 67 });
    // …but "yes" with nothing going in is not paying in: the start is what it would have been
    expect(parseDraft(SCHEMA_C, { 'you.pot': '275,000', 'you.age': '55', 'you.payIn.has': 'yes', 'you.payIn.own': '0', 'you.payIn.employer': '0' }, TEST_ENV).inputs.start).toEqual({ kind: 'now' });
    // and past the State Pension age, paying in or not, the money is from now unless an age is chosen
    expect(parseDraft(SCHEMA_C, { 'you.pot': '275,000', 'you.age': '68', 'you.payIn.has': 'yes', 'you.payIn.own': '500', 'you.payIn.employer': '0' }, TEST_ENV).inputs.start).toEqual({ kind: 'now' });
  });
});

/*
 * Couples who stop work in different years (research/v7/couples-different-years.md 2.1, 2.3, 3.1, 5.1): C asks when the
 * partner stops (in C's words, "when you start taking money"), the pay line, and the tax-free part of someone who has
 * stopped. Not answered is today's meaning, key for key.
 */
describe('C: each of a couple stops on their own date', () => {
  const two = (extra = {}) => parseDraft(SCHEMA_C, { 'you.pot': '250000', 'you.age': '58', household: 'couple', 'partner.age': '56', ...extra }, TEST_ENV);

  it('the new questions sit in the partner block, after the person, before paying in; the tax-free part under more detail', () => {
    const paths = SCHEMA_C.fields.map((f) => f.path);
    expect(paths.slice(paths.indexOf('partner.finalSalary.fromAge') + 1, paths.indexOf('partner.payIn.has') + 1))
      .toEqual(['partner.stop.kind', 'partner.stop.age', 'untilBothStop', 'partner.payIn.has']);
    for (const f of [...partnerStopFields('c'), untilBothStopField('c'), ...taxFreeFields('c'), ...payingInFields('partner')]) expect(byPath.get(f.path), f.path).toEqual(f);
    expect(byPath.get('partner.stop.kind').options).toEqual(['same', 'already', 'age']);
    expect(byPath.get('you.taxFreeTaken').when).toEqual({ 'start.kind': 'now' });
    for (const f of payingInFields('partner')) expect(f.whenNot, f.path).toEqual({ 'partner.stop.kind': 'already' });
    for (const f of payingInFields('you')) expect(f.whenNot, f.path).toBeUndefined();
  });

  it('never answered: today\'s inputs, key for key, in today\'s order', () => {
    const r = two({ 'partner.payIn.has': 'yes', 'partner.payIn.own': '200', 'partner.payIn.employer': '100', 'start.kind': 'age', 'start.age': '60' });
    expect(r.ok).toBe(true);
    expect(JSON.stringify(Object.keys(r.inputs))).toBe(JSON.stringify(['household', 'you', 'start', 'partner', 'savings', 'risk', 'charge', 'endAge', 'take']));
    expect(Object.keys(r.inputs.partner)).toEqual(['age', 'pot', 'statePension', 'finalSalary', 'payIn']);
    expect(Object.keys(two().inputs.you)).toEqual(['pot', 'age', 'statePension', 'finalSalary']);   // from now: the tax-free question not answered
  });

  it('stopYearsOf reads C\'s start as your stop', () => {
    expect(stopYearsOf(two().inputs)).toEqual({ you: 0, partner: 0 });
    expect(stopYearsOf(two({ 'start.kind': 'age', 'start.age': '60' }).inputs)).toEqual({ you: 2, partner: 2 });
    expect(stopYearsOf(two({ 'partner.stop.kind': 'age', 'partner.stop.age': '60' }).inputs)).toEqual({ you: 0, partner: 4 });
    expect(stopYearsOf(two({ 'start.kind': 'age', 'start.age': '60', 'partner.stop.kind': 'already' }).inputs)).toEqual({ you: 2, partner: 0 });
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
    // `budget` (the household's budget sheet) and `keep` ("Save this as a plan"): budget-step.md, save-as-plan.md C.2, C.5
    expect(Object.keys(s)).toEqual(['route', 'env', 'session', 'plan', 'draft', 'answers', 'budget', 'keep', 'ui']);
    expect(s.budget).toBeNull();
    expect(Object.keys(s.keep).sort()).toEqual(Object.keys(s.draft).sort());
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
