/**
 * The one place a limit is checked (V7 build brief 4.1). Pure: no clock, storage or screen. `env.today` is the date.
 *
 *   applies(field, values)                → whether a field applies, by its `when` and `whenNot` (the one rule: the
 *                                           screen and the screen test call it too)
 *   defaults(schema, values, env)         → { [path]: value } for every field that applies and has a default
 *   fieldsThatApply(schema, values)       → field[]
 *   parseDraft(schema, draftValues, env)  → { ok, inputs, errors, usedDefault, values }   (text as typed)
 *   checkInputs(schema, inputs, env)      → the same shape, from a nested object of real values
 *   validate(schema, inputs, env)         → { ok, errors }
 *
 * messageIds: 'required', 'notANumber', 'tooLow', 'tooHigh', 'notAnOption', and each rule id of the schema.
 * Money text accepts "£", commas and spaces, and the short forms "420k" and "0.42m". Ages are whole years.
 * Types (step 4 brief, conflict 25): money, age, choice, yesNo, and from step 4 `percent` (a number on the field's
 * `step` — 0.1 when it names none, the charge's 0.05 (6.19.0) — with up to two figures after the point; "%" and spaces
 * accepted) and `count` (a whole number).
 *
 * A field applies when every entry of its `when` matches — a value, or a list meaning "one of" — and no entry of its
 * `whenNot` does (a value or a list; "none of"). A path with no value matches no value: a field hidden by `whenNot`
 * shows while the question it hangs on is not answered (couples-different-years.md 3.2).
 */
import { SAVING, RULES } from './rules.js';
import { startBeforeEveryPension, payingInPast75, peopleFromValues, stopYearsFromValues, apartCheckYear, payCoversOf } from './schemaParts.js';
import { SHAPE_LIMITS, THEN } from './shape.js';

export const MESSAGE_IDS = ['required', 'notANumber', 'tooLow', 'tooHigh', 'notAnOption'];

const isBlank = (v) => v === undefined || v === null || (typeof v === 'string' && v.trim() === '');

/** A percent field's step: its own, or 0.1 (one figure after the point, as before steps were declared). */
const stepOf = (field) => (typeof field.step === 'number' && field.step > 0 ? field.step : 0.1);
/** Whether a percent lies on its field's steps (0.45 is on 0.05's, 0.07 is not), allowing for binary fractions. */
const onStep = (field, v) => { const k = v / stepOf(field); return Math.abs(k - Math.round(k)) < 1e-9; };

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

const matches = (want, v) => (Array.isArray(want) ? want.includes(v) : v === want);

/**
 * Whether a field applies, from flat values ({ [path]: value }): every `when` entry matches (a list: one of them) and no
 * `whenNot` entry does. The one copy of the rule (couples-different-years.md 3.2).
 */
export function applies(field, values) {
  const v = values || {};
  return Object.entries(field.when || {}).every(([path, want]) => matches(want, v[path]))
    && Object.entries(field.whenNot || {}).every(([path, not]) => !matches(not, v[path]));
}

/** The fields that apply (see applies). `values` is flat, { [path]: value }. */
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
  if (typeof raw === 'number') return Number.isFinite(raw) && (field.type !== 'percent' || onStep(field, raw)) ? { value: raw } : { error: 'notANumber' };
  if (field.type === 'percent') {
    const p = String(raw).replace(/[%\s]/g, '');
    if (!/^\d{1,3}(\.\d{1,2})?$/.test(p)) return { error: 'notANumber' };
    const value = Number(p);
    return onStep(field, value) ? { value } : { error: 'notANumber' };
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

/**
 * The spending shape's later steps (type `steps`, research/v7/spending-shape.md 3.3): a list, each item read by its own
 * rule — `fromAge` a whole age, the amount (`unit`: perMonth, £1 to £50,000 a month as money is typed; share, a percent
 * 1 to 500 on 0.01) and `then` one of shape.js THEN; `fallsPct` only when it falls, 0.25 to 10 on 0.25. `typed`: real
 * values (checkInputs) rather than text as typed (parseDraft). An empty list is no list (blank). Each problem is keyed by
 * the item's own box — '<path>.<i>.<field>' — so the screen puts it under that box: 'required', 'notANumber', 'tooLow',
 * 'tooHigh', 'notAnOption' for the amount, the age and the choice; 'range' for a fall.
 * → { value } (each item { fromAge, perMonth | share, then, fallsPct? }) or { errors }
 */
function parseSteps(field, raw, typed) {
  if (!Array.isArray(raw)) return { error: 'notAnOption' };
  const unit = field.unit === 'share' ? 'share' : 'perMonth';
  const lim = SHAPE_LIMITS[unit];
  const errors = {};
  const value = raw.map((item, i) => {
    const x = item && typeof item === 'object' && !Array.isArray(item) ? item : {};
    const at = (f) => `${field.path}.${i}.${f}`;
    const out = {};
    // the age
    const age = isBlank(x.fromAge) ? null : typed ? x.fromAge : (/^\d{1,3}$/.test(String(x.fromAge).replace(/\s/g, '')) ? Number(String(x.fromAge).replace(/\s/g, '')) : NaN);
    if (age === null) errors[at('fromAge')] = 'required';
    else if (typeof age !== 'number' || !Number.isInteger(age)) errors[at('fromAge')] = 'notANumber';
    else out.fromAge = age;
    // the amount: money a month, or a share of the start
    const rawAmount = x[unit];
    if (isBlank(rawAmount)) errors[at(unit)] = 'required';
    else {
      const got = unit === 'share'
        ? (typed ? (typeof rawAmount === 'number' && Number.isFinite(rawAmount) && onStep(lim, rawAmount) ? { value: rawAmount } : { error: 'notANumber' })
          : parseText({ type: 'percent', step: lim.step }, rawAmount))
        : (typed ? (typeof rawAmount === 'number' && Number.isFinite(rawAmount) ? { value: rawAmount } : { error: 'notANumber' }) : parseMoney(String(rawAmount).replace(/[£,\s]/g, '')));
      if (got.error) errors[at(unit)] = got.error;
      else if (got.value < lim.min) errors[at(unit)] = 'tooLow';
      else if (got.value > lim.max) errors[at(unit)] = 'tooHigh';
      else out[unit] = got.value;
    }
    // what happens from that age (not answered: it stays the same)
    const then = isBlank(x.then) ? 'level' : x.then;
    if (!THEN.includes(then)) errors[at('then')] = 'notAnOption';
    else out.then = then;
    if (then === 'falls') {
      const f = SHAPE_LIMITS.fallsPct;
      const got = isBlank(x.fallsPct) ? { error: 'range' } : typed
        ? (typeof x.fallsPct === 'number' && Number.isFinite(x.fallsPct) && onStep(f, x.fallsPct) ? { value: x.fallsPct } : { error: 'range' })
        : parseText({ type: 'percent', step: f.step }, x.fallsPct);
      if (got.error || got.value < f.min || got.value > f.max) errors[at('fallsPct')] = 'range';
      else out.fallsPct = got.value;
    }
    return out;
  });
  return Object.keys(errors).length ? { errors, partial: value } : { value };
}

/** A real value (from code, not a text box) → the value, or a messageId. */
function checkTyped(field, raw) {
  if (field.type === 'yesNo') return typeof raw === 'boolean' ? { value: raw } : { error: 'notAnOption' };
  if (field.type === 'choice') return field.options.includes(raw) ? { value: raw } : { error: 'notAnOption' };
  if (typeof raw !== 'number' || !Number.isFinite(raw)) return { error: 'notANumber' };
  if ((field.type === 'age' || field.type === 'count') && !Number.isInteger(raw)) return { error: 'notANumber' };
  if (field.type === 'percent' && !onStep(field, raw)) return { error: 'notANumber' };
  return { value: raw };
}

/**
 * The rules between fields, by id. A schema is checked against the rules it lists and no other; the error goes
 * on the first field the rule names, and never over a problem that field already has.
 *   C: start-not-before-now, start-not-before-access (per person: every pension closed and no savings, where the pay of
 *      the one still working stops covering — the second stop; the first under "None of it"), pay-in-past-75 and
 *      pay-in-past-75-partner (still paying in past 75 at their own stop), end-after-start
 *   A: stop-not-before-now (stop.age ≥ you.age), end-after-stop
 *   B: stop-after-now (stop.age > you.age), end-after-stop (endAge > the younger person's age at the later stop)
 *   A, B and C: pay-in-over-limit — a person's two parts together within what one person can pay in a month
 *   (SAVING.payInCeiling, the household check's limit); on the employer's part, the box that takes the sum over
 *   (step 4 brief section 10, J14)
 * Each of a couple stopping on their own date (couples-different-years.md 3.3):
 *   A, B and C: partner-stop-not-before-now (partner.stop.age ≥ partner.age: their age today is stopping now);
 *      end-after-start / end-after-stop at the LATER stop, which must also be under RULES.maxYears after the first
 *   A and B: already-needs-partner ("I've already stopped" for one person: C is their question); partner-stop-fits (you
 *      have stopped: the partner's stop must be an age — or "show me ages" in A — or "they already have", which is the
 *      retired view, not a problem)
 *   A: partner-ages-one-at-a-time ("show me ages" for the partner while you are still working); partner-stop-ages-past-75
 *   B: partner-stop-after-now (you have stopped: partner.stop.age > partner.age, B's stop-after-now for them)
 */
function checkRules(schema, values, env, errors, typedSteps = {}) {
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
  const shapeRule = schema.rules.find((r) => r.id === 'shape-steps');
  if (shapeRule) checkShape(shapeRule.fields[0].replace(/\.steps$/, ''), values, errors, typedSteps[shapeRule.fields[0]]);
  const put = (id) => {
    const rule = schema.rules.find((r) => r.id === id);
    if (rule && !errors[rule.fields[0]]) errors[rule.fields[0]] = id;
  };
  const partner = values.household === 'couple' ? values['partner.age'] : undefined;
  const younger = typeof partner === 'number' ? Math.min(you, partner) : you;
  const endAge = values.endAge;

  // Each person's whole years until they stop (C: your start; A and B: your stop), the partner's by their own answer —
  // not answered, or "when you do", is yours: the same year, today's rules exactly (couples-different-years.md 3.3).
  const stops = stopYearsFromValues(values);
  const known = [stops.you, stops.partner].filter((s) => typeof s === 'number');
  const later = known.length ? Math.max(...known) : 0;
  const tooFarApart = known.length > 1 && later - Math.min(...known) >= RULES.maxYears;

  // C: the money starts now or at an age. A start before ANY of the household's pensions (a pot, or one still being
  // paid into — the partner's too) can be touched is refused with nothing else to live on meanwhile; with savings, or
  // with a pension open at the start, it is the saver's question — a closed pension stays closed until it opens and the
  // rest pays first (step 4 brief section 10, J8), as A and B work it. Each pension opens from its holder's own stop,
  // and the check is where the pay of the one still working stops covering (apartCheckYear). Paying in is counted until
  // 75 at most, at each person's own stop: the tax the government adds back stops there (A's and B's stop age does too).
  const startKind = values['start.kind'];
  const startAge = startKind === 'age' ? values['start.age'] : you;
  if (startKind === 'age' && typeof startAge === 'number') {
    const people = peopleFromValues(values);
    const at = apartCheckYear(stops, payCoversOf(values.untilBothStop));
    if (startAge < you) put('start-not-before-now');
    else if (startBeforeEveryPension(people, values.savings || 0, startAge, env.today, at)) put('start-not-before-access');
    else {
      const late = payingInPast75(people, startAge);
      if (late.includes('you')) put('pay-in-past-75');
      else if (late.includes('partner')) put('pay-in-past-75-partner');
    }
  }
  if (typeof endAge === 'number' && typeof startAge === 'number' && startAge >= you) {
    if (endAge <= younger + later || tooFarApart) put('end-after-start');
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
  if (typeof endAge === 'number' && typeof stops.you === 'number' && !('start.kind' in values)) {
    if (endAge <= younger + later || tooFarApart) put('end-after-stop');
  }

  // The partner's own stop (A, B and C), and "I've already stopped" (A and B).
  const youStopped = values['stop.kind'] === 'already';
  if (youStopped && values.household !== 'couple') put('already-needs-partner');
  if (typeof partner === 'number') {
    const kind = values['partner.stop.kind'];
    const theirs = values['partner.stop.age'];
    if (kind === 'age' && typeof theirs === 'number') {
      if (youStopped && theirs <= partner) put('partner-stop-after-now');      // B: the answer is about them, still working
      if (theirs < partner) put('partner-stop-not-before-now');
    }
    if (youStopped && !['age', 'ages', 'already'].includes(kind)) put('partner-stop-fits');
    if (!youStopped && kind === 'ages') put('partner-ages-one-at-a-time');
    if (youStopped && kind === 'ages' && partner > RULES.stopAgeMax) put('partner-stop-ages-past-75');
  }
}

/**
 * The spending shape's steps against the rest of the form (spending-shape.md 3.3, 3.7; the rule 'shape-steps'). `base` is
 * 'spend' (A, B) or 'shape' (C). Ages are YOURS, whole and strictly rising, each later than your age today ('beforeNow'),
 * than the household's start ('beforeStop' in A and B — your age at the first stop, yours or your partner's own; C:
 * 'beforeStart', the money's start) and earlier than your age at the end of the plan ('afterEnd'); each later than the one
 * before ('order'); "moves evenly" never on the last step, nor on the first amount with no step after it ('glidesLast'); no
 * more steps than years in the plan ('tooMany', on the list). Each under its own box, never over a problem it has.
 */
function checkShape(base, values, errors, typed = null) {
  // the steps as checked, or — when a box of theirs has a problem of its own — as far as they could be read
  const steps = Array.isArray(values[`${base}.steps`]) ? values[`${base}.steps`] : Array.isArray(typed) ? typed : [];
  const then0 = values[`${base}.then`];
  const box = (i, f) => `${base}.steps.${i}.${f}`;
  const put = (path, id) => { if (!errors[path]) errors[path] = id; };
  if (!steps.length) {
    if (then0 === 'glides') put(`${base}.then`, 'glidesLast');
    return;
  }
  const you = values['you.age'];
  const partner = values.household === 'couple' && typeof values['partner.age'] === 'number' ? values['partner.age'] : null;
  const younger = partner === null ? you : Math.min(you, partner);
  // your age at the household's start: C's start; A and B the first of the stops (one not yet given: today)
  let startAge = you;
  let startYears = 0;
  if (base === 'shape') {
    if (values['start.kind'] === 'age' && typeof values['start.age'] === 'number') { startAge = values['start.age']; startYears = Math.max(0, startAge - you); }
  } else {
    const stops = stopYearsFromValues(values);
    const known = [stops.you, stops.partner].filter((s) => typeof s === 'number');
    if (known.length) { startYears = Math.min(...known); startAge = you + startYears; }
  }
  const endAge = values.endAge;
  const yourEnd = typeof endAge === 'number' ? endAge + (you - younger) : null;
  const years = typeof endAge === 'number' ? endAge - (younger + startYears) : null;
  steps.forEach((s, i) => {
    if (typeof s.fromAge !== 'number') return;
    if (s.fromAge <= you) put(box(i, 'fromAge'), 'beforeNow');
    else if (s.fromAge <= startAge) put(box(i, 'fromAge'), base === 'shape' ? 'beforeStart' : 'beforeStop');
    else if (yourEnd !== null && s.fromAge >= yourEnd) put(box(i, 'fromAge'), 'afterEnd');
    else if (i > 0 && typeof steps[i - 1].fromAge === 'number' && s.fromAge <= steps[i - 1].fromAge) put(box(i, 'fromAge'), 'order');
  });
  const last = steps.length - 1;
  if (steps[last].then === 'glides') put(box(last, 'then'), 'glidesLast');
  if (years !== null && steps.length > Math.max(1, Math.min(RULES.maxYears, years))) put(`${base}.steps`, 'tooMany');
}

/** The shared walk: fields in order, each either given, defaulted, or a problem. */
function walk(schema, flat, env, parse) {
  const values = {};
  const errors = {};
  const usedDefault = [];
  const typedSteps = {};
  for (const field of schema.fields) {
    if (!applies(field, values)) continue;
    const raw = flat[field.path];
    if (field.type === 'steps' && !isBlank(raw)) {
      // the spending shape's later steps: one value, each item's problem under its own box; an empty list is no list
      if (Array.isArray(raw) && !raw.length) continue;
      const got = parseSteps(field, raw, parse === checkTyped);
      if (got.errors) { Object.assign(errors, got.errors); typedSteps[field.path] = got.partial; }
      else if (got.error) errors[field.path] = got.error;
      else values[field.path] = got.value;
      continue;
    }
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
  checkRules(schema, values, env, errors, typedSteps);
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
    // a default by rule that gives none (how the savings grow with nothing in savings, 6.22.0) leaves no key, as walk does
    if (d === undefined) continue;
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
