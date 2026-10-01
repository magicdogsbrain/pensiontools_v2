/**
 * The one place a limit is checked (V7 build brief 4.1). Pure: no clock, storage or screen. `env.today` is the date.
 *
 *   defaults(schema, values, env)         → { [path]: value } for every field that applies and has a default
 *   fieldsThatApply(schema, values)       → field[]
 *   parseDraft(schema, draftValues, env)  → { ok, inputs, errors, usedDefault, values }   (text as typed)
 *   checkInputs(schema, inputs, env)      → the same shape, from a nested object of real values
 *   validate(schema, inputs, env)         → { ok, errors }
 *
 * messageIds: 'required', 'notANumber', 'tooLow', 'tooHigh', 'notAnOption', and each rule id of the schema.
 * Money text accepts "£", commas and spaces, and the short forms "420k" and "0.42m". Ages are whole years.
 * Types (step 4 brief, conflict 25): money, age, choice, yesNo, and from step 4 `percent` (a number with up to one
 * decimal; "%" and spaces accepted) and `count` (a whole number).
 */
import { SAVING, RULES } from './rules.js';
import { startBeforeEveryPension, payingInPast75, peopleFromValues } from './schemaParts.js';

export const MESSAGE_IDS = ['required', 'notANumber', 'tooLow', 'tooHigh', 'notAnOption'];

const isBlank = (v) => v === undefined || v === null || (typeof v === 'string' && v.trim() === '');

/** Nested object → { 'you.pot': 250000, … } (plain objects only; arrays and null are values). */
export function flatten(obj, prefix = '', out = {}) {
  if (obj == null || typeof obj !== 'object') return out;
  for (const k of Object.keys(obj)) {
    const v = obj[k];
    const path = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) flatten(v, path, out);
    else out[path] = v;
  }
  return out;
}

/** { 'you.pot': 250000 } → { you: { pot: 250000 } } */
export function nest(flat) {
  const out = {};
  for (const path of Object.keys(flat)) {
    const keys = path.split('.');
    let o = out;
    for (let i = 0; i < keys.length - 1; i++) o = o[keys[i]] ??= {};
    o[keys[keys.length - 1]] = flat[path];
  }
  return out;
}

const applies = (field, values) => Object.entries(field.when || {}).every(([path, want]) => values[path] === want);

/** A field applies when every entry of its `when` matches. `values` is flat, { [path]: value }. */
export function fieldsThatApply(schema, values) {
  return schema.fields.filter((f) => applies(f, values || {}));
}

function defaultOf(schema, field, values, env) {
  const d = field.default;
  if (d && typeof d === 'object' && d.rule) return schema.defaultRules[d.rule](values, env);
  return d;
}

/** Text as typed → a value, or a messageId. */
function parseText(field, raw) {
  if (field.type === 'yesNo') {
    if (raw === true || raw === false) return { value: raw };
    const t = String(raw).trim().toLowerCase();
    if (t === 'true' || t === 'yes') return { value: true };
    if (t === 'false' || t === 'no') return { value: false };
    return { error: 'notAnOption' };
  }
  if (field.type === 'choice') {
    return field.options.includes(raw) ? { value: raw } : { error: 'notAnOption' };
  }
  if (typeof raw === 'number') return Number.isFinite(raw) ? { value: raw } : { error: 'notANumber' };
  if (field.type === 'percent') {
    const p = String(raw).replace(/[%\s]/g, '');
    return /^\d{1,3}(\.\d)?$/.test(p) ? { value: Number(p) } : { error: 'notANumber' };
  }
  const t = String(raw).replace(/[£,\s]/g, '');
  if (field.type === 'age' || field.type === 'count') return /^\d{1,3}$/.test(t) ? { value: Number(t) } : { error: 'notANumber' };
  return parseMoney(t);
}

/**
 * Money as people write it, once "£", commas and spaces are gone: "420000", "420000.50", and the short forms
 * "420k" (thousands) and "0.42m" (millions), upper or lower case. Never more than two decimal places in the result.
 */
function parseMoney(t) {
  const m = /^(\d{1,12}(?:\.\d{1,6})?)([kKmM])?$/.exec(t);
  if (!m) return { error: 'notANumber' };
  const scale = m[2] ? (m[2].toLowerCase() === 'k' ? 1000 : 1000000) : 1;
  const value = Math.round(Number(m[1]) * scale * 100) / 100;
  if (!m[2] && !/^\d{1,12}(\.\d{1,2})?$/.test(m[1])) return { error: 'notANumber' };   // pence only, in full figures
  return { value };
}

/** A real value (from code, not a text box) → the value, or a messageId. */
function checkTyped(field, raw) {
  if (field.type === 'yesNo') return typeof raw === 'boolean' ? { value: raw } : { error: 'notAnOption' };
  if (field.type === 'choice') return field.options.includes(raw) ? { value: raw } : { error: 'notAnOption' };
  if (typeof raw !== 'number' || !Number.isFinite(raw)) return { error: 'notANumber' };
  if ((field.type === 'age' || field.type === 'count') && !Number.isInteger(raw)) return { error: 'notANumber' };
  if (field.type === 'percent' && Math.round(raw * 10) / 10 !== raw) return { error: 'notANumber' };
  return { value: raw };
}

/**
 * The rules between fields, by id. A schema is checked against the rules it lists and no other; the error goes
 * on the first field the rule names, and never over a problem that field already has.
 *   C: start-not-before-now, start-not-before-access (per person: every pension closed at the start and no savings),
 *      pay-in-past-75 and pay-in-past-75-partner (still paying in past 75 at the start), end-after-start
 *   A: stop-not-before-now (stop.age ≥ you.age), end-after-stop
 *   B: stop-after-now (stop.age > you.age), end-after-stop (endAge > the younger person's age at the stop)
 *   A, B and C: pay-in-over-limit — a person's two parts together within what one person can pay in a month
 *   (SAVING.payInCeiling, the household check's limit); on the employer's part, the box that takes the sum over
 *   (step 4 brief section 10, J14)
 */
function checkRules(schema, values, env, errors) {
  if (schema.rules.some((r) => r.id === 'pay-in-over-limit')) {
    for (const who of ['you', 'partner']) {
      const own = values[`${who}.payIn.own`];
      const employer = values[`${who}.payIn.employer`];
      const box = `${who}.payIn.employer`;
      if (typeof own === 'number' && typeof employer === 'number' && own + employer > SAVING.payInCeiling && !errors[box]) errors[box] = 'pay-in-over-limit';
    }
  }
  const you = values['you.age'];
  if (typeof you !== 'number' || !env || !env.today) return;
  const put = (id) => {
    const rule = schema.rules.find((r) => r.id === id);
    if (rule && !errors[rule.fields[0]]) errors[rule.fields[0]] = id;
  };
  const partner = values.household === 'couple' ? values['partner.age'] : undefined;
  const younger = typeof partner === 'number' ? Math.min(you, partner) : you;
  const endAge = values.endAge;

  // C: the money starts now or at an age. A start before ANY of the household's pensions (a pot, or one still being
  // paid into — the partner's too) can be touched is refused with nothing else to live on meanwhile; with savings, or
  // with a pension open at the start, it is the saver's question — a closed pension stays closed until it opens and the
  // rest pays first (step 4 brief section 10, J8), as A and B work it. Paying in is counted until 75 at most: the tax
  // the government adds back stops there (A's and B's stop age does too).
  const startKind = values['start.kind'];
  const startAge = startKind === 'age' ? values['start.age'] : you;
  if (startKind === 'age' && typeof startAge === 'number') {
    const people = peopleFromValues(values);
    if (startAge < you) put('start-not-before-now');
    else if (startBeforeEveryPension(people, values.savings || 0, startAge, env.today)) put('start-not-before-access');
    else {
      const late = payingInPast75(people, startAge);
      if (late.includes('you')) put('pay-in-past-75');
      else if (late.includes('partner')) put('pay-in-past-75-partner');
    }
  }
  if (typeof endAge === 'number' && typeof startAge === 'number' && startAge >= you) {
    if (endAge <= younger + (startAge - you)) put('end-after-start');
  }

  // A and B: work stops at an age (A's "show me ages" has no stop age: the stop is taken as now for the end rule).
  const stopAge = values['stop.age'];
  if (typeof stopAge === 'number') {
    if (stopAge < you) put('stop-not-before-now');
    if (stopAge <= you) put('stop-after-now');
  }
  // A's "show me ages" lists ages from today's to 75 (RULES.stopAgeMax): past 75 there is none to show. Said on the
  // form, so the answer is never asked (it would return `invalid` with the same id).
  if (values['stop.kind'] === 'ages' && you > RULES.stopAgeMax) put('stop-ages-past-75');
  const stopIn = typeof stopAge === 'number' ? Math.max(0, stopAge - you) : 0;
  if (typeof endAge === 'number' && ('stop.age' in values || values['stop.kind'] === 'ages')) {
    if (endAge <= younger + stopIn) put('end-after-stop');
  }
}

/** The shared walk: fields in order, each either given, defaulted, or a problem. */
function walk(schema, flat, env, parse) {
  const values = {};
  const errors = {};
  const usedDefault = [];
  for (const field of schema.fields) {
    if (!applies(field, values)) continue;
    const raw = flat[field.path];
    if (isBlank(raw)) {
      if (field.required) { errors[field.path] = 'required'; continue; }
      const d = defaultOf(schema, field, values, env);
      // A field with no default at all (C's "still paying in?", not answered) leaves no key behind: the checked inputs
      // of a form that never answers it are what they were before the field existed.
      if (d === undefined) continue;
      values[field.path] = d;
      if (d !== null && d !== undefined) usedDefault.push(field.path);
      continue;
    }
    const got = parse(field, raw);
    if (got.error) { errors[field.path] = got.error; continue; }
    if (typeof field.min === 'number' && got.value < field.min) { errors[field.path] = 'tooLow'; continue; }
    if (typeof field.max === 'number' && got.value > field.max) { errors[field.path] = 'tooHigh'; continue; }
    values[field.path] = got.value;
  }
  checkRules(schema, values, env, errors);
  const ok = Object.keys(errors).length === 0;
  return { ok, inputs: ok ? nest(values) : null, errors, usedDefault, values };
}

/** Every field that applies and has a default → its default. `values` is flat and may be partial. */
export function defaults(schema, values, env) {
  const seen = { ...(values || {}) };
  const out = {};
  for (const field of schema.fields) {
    if (!applies(field, seen) || !('default' in field)) continue;
    const d = defaultOf(schema, field, seen, env);
    out[field.path] = d;
    if (isBlank(seen[field.path])) seen[field.path] = d;
  }
  return out;
}

/**
 * Text as typed (state.draft.c.values) → checked inputs.
 * @returns {{ ok: boolean, inputs: object|null, errors: Object<string,string>, usedDefault: string[], values: Object<string,*> }}
 *   inputs: the nested checked inputs (null unless ok). values: flat, every field that did parse or was defaulted.
 */
export function parseDraft(schema, draftValues, env) {
  return walk(schema, draftValues || {}, env, parseText);
}

/** The same for a nested object of real values (what answerC receives): defaults filled in, fields that do not apply removed. */
export function checkInputs(schema, inputs, env) {
  return walk(schema, flatten(inputs), env, checkTyped);
}

/** Checked inputs → { ok, errors }. */
export function validate(schema, inputs, env) {
  const { ok, errors } = checkInputs(schema, inputs, env);
  return { ok, errors };
}
