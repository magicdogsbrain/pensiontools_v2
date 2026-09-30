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
 */
import { addYears, accessAgeOn } from './rules.js';

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
  const t = String(raw).replace(/[£,\s]/g, '');
  if (field.type === 'age') return /^\d{1,3}$/.test(t) ? { value: Number(t) } : { error: 'notANumber' };
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
  if (field.type === 'age' && !Number.isInteger(raw)) return { error: 'notANumber' };
  return { value: raw };
}

function checkRules(schema, values, env, errors) {
  const you = values['you.age'];
  if (typeof you !== 'number' || !env || !env.today) return;
  const put = (id) => {
    const rule = schema.rules.find((r) => r.id === id);
    if (rule && !errors[rule.fields[0]]) errors[rule.fields[0]] = id;
  };
  const startKind = values['start.kind'];
  const startAge = startKind === 'age' ? values['start.age'] : you;
  if (startKind === 'age' && typeof startAge === 'number') {
    if (startAge < you) put('start-not-before-now');
    else if (values['you.pot'] > 0 && startAge < accessAgeOn(addYears(env.today, startAge - you))) put('start-not-before-access');
  }
  const partner = values.household === 'couple' ? values['partner.age'] : undefined;
  const younger = typeof partner === 'number' ? Math.min(you, partner) : you;
  const endAge = values.endAge;
  if (typeof endAge === 'number' && typeof startAge === 'number' && startAge >= you) {
    if (endAge <= younger + (startAge - you)) put('end-after-start');
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
