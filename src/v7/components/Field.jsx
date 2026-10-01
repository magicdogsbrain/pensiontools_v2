/**
 * One input, drawn from its declaration in the question's input list (SCHEMA_C, SCHEMA_A, SCHEMA_B) and its words in
 * copy/<q>.js. There is no other way to put a box on a screen (architecture 3.5).
 *
 *   formView(state, q = 'c')     what every field needs to draw itself: the draft, the parsed draft, the errors to
 *                                show, what each field shows when nothing is typed, and which fields apply
 *   <Field form path dispatch />  a money, age, percent or count box (text, with the right phone keypad), or a group
 *                                of radios
 *   <AskForm form dispatch>       the form around them: submit = the question's "Show …" button = draft/ask (or
 *                                `action`: A's and B's numbers step sends draft/onward), and the first box that needs
 *                                attention takes focus
 *
 * Accessibility lives here: a real <label for>, help and error joined by aria-describedby, aria-invalid on error,
 * radios inside <fieldset><legend>. Boxes are controlled by the state; nothing reformats what is being typed.
 * Money boxes are type="text" with inputmode="decimal" (type="number" mangles commas and scrolls by accident).
 * Test ids and element ids are "<q>.<path>".
 */
import { SCHEMA_C, earliestStart as earliestStartC } from '../../answers/c/schema.js';
import { SCHEMA_A } from '../../answers/a/schema.js';
import { SCHEMA_B } from '../../answers/b/schema.js';
import { money, ageText } from '../../answers/shared/format.js';
import { parsedDraft, errorsToShow, SPEND_PATHS } from '../state/select.js';
import { C } from '../copy/c.js';
import { A } from '../copy/a.js';
import { B } from '../copy/b.js';

/** Each question's input list and words. */
export const SCHEMA_OF = { a: SCHEMA_A, b: SCHEMA_B, c: SCHEMA_C };
export const COPY_OF = { a: A, b: B, c: C };

export const FIELDS = SCHEMA_C.fields;
export const byPath = new Map(FIELDS.map((f) => [f.path, f]));
const BY_PATH = Object.fromEntries(Object.entries(SCHEMA_OF).map(([q, s]) => [q, new Map(s.fields.map((f) => [f.path, f]))]));
const MORE = Object.fromEntries(Object.entries(SCHEMA_OF).map(([q, s]) => [q, s.fields.filter((f) => f.group === 'more').map((f) => f.path)]));
export const blank = (v) => v === undefined || v === null || (typeof v === 'string' && v.trim() === '');
const EMPTY = Object.freeze({ values: {}, touched: [], asked: false, revealed: [] });

/** The plain default of a field (not one that comes from a rule), or undefined. */
const plainDefault = (f) => ('default' in f && (f.default === null || typeof f.default !== 'object') ? f.default : undefined);

/** What a field shows when nothing is typed: the checked value (rules included), else its plain default. */
export function formView(state, q = 'c') {
  const schema = SCHEMA_OF[q];
  const fields = schema.fields;
  const d = state.draft[q] || EMPTY;
  const draft = d.values;
  const parsed = parsedDraft(state, q);
  const errors = errorsToShow(state, q);
  const shown = {};
  for (const f of fields) {
    if (!blank(draft[f.path])) shown[f.path] = draft[f.path];
    else if (parsed.values[f.path] !== undefined) shown[f.path] = parsed.values[f.path];
    else if (plainDefault(f) !== undefined) shown[f.path] = plainDefault(f);
  }
  const applies = (f) => Object.entries(f.when || {}).every(([p, want]) => shown[p] === want);
  const more = MORE[q];
  const moreOpen = state.ui.open.includes('more') || more.some((p) => !blank(draft[p])) || more.includes(state.route.focus);
  const couple = shown.household === 'couple';
  /** Question C: your age when the first of the household's pensions can be touched (the start-not-before-access words). */
  const earliestStart = () => (schema.defaultRules ? earliestStartC(parsed.values, state.env) : null);
  /** Question C: the start age the form puts in when none is typed, by the input list's own rule. */
  const defaultStart = () => (schema.defaultRules ? schema.defaultRules.startAge(parsed.values, state.env) : null);
  return { q, schema, fields, byPath: BY_PATH[q], copy: COPY_OF[q], carriedFrom: d.carriedFrom || null,
    draft, parsed, errors, shown, applies, moreOpen, couple, env: state.env, earliestStart, defaultStart };
}

const fill = (text, values) => String(text).replace(/\{(\w+)\}/g, (m, k) => (k in values ? values[k] : m));
const limit = (f, n) => (f.type === 'money' ? money(n) : f.type === 'percent' ? `${n}%` : ageText(n));

/** The sentence for a field's messageId, in the guide's words. */
export function errorText(form, f, messageId) {
  const copy = form.copy || C;
  const words = copy.fields[f.path] || {};
  // a sentence of its own for two people where there is one (start-not-before-access: the rule is per person)
  const own = words.errors && ((form.couple && words.errors[`${messageId}-couple`]) || words.errors[messageId]);
  const kind = copy.errors[f.type];
  const text = own || (kind && kind[messageId]) || copy.errors.other;
  const values = { min: limit(f, f.min), max: limit(f, f.max) };
  if (messageId === 'start-not-before-access') values.age = ageText(form.earliestStart());
  return fill(text, values);
}

/** The value shown in a box when nothing is typed, as a placeholder (never as the value: the box must clear). */
function placeholderOf(form, f) {
  const d = form.parsed.values[f.path] !== undefined ? form.parsed.values[f.path] : plainDefault(f);
  if (typeof d !== 'number') return undefined;
  return f.type === 'money' ? money(d).slice(1) : f.type === 'percent' ? String(d) : ageText(d);
}

const qOf = (form) => form.q || 'c';
const set = (form, path, value) => ({ type: 'draft/set', q: qOf(form), path, value });
const touch = (form, path) => ({ type: 'draft/touch', q: qOf(form), path });

/**
 * On leaving a money box, whole pounds typed without their commas are written with them ("310000" → "310,000"):
 * the same figure, easier to check. Returns the text to set, or null when the box is left as it is (anything that
 * is not a whole number of pounds, or that already reads that way).
 */
export function tidyMoney(form, f) {
  if (f.type !== 'money') return null;
  const typed = form.draft[f.path];
  if (blank(typed)) return null;
  const n = form.parsed.values[f.path];
  if (typeof n !== 'number' || !Number.isInteger(n) || n < 0) return null;
  const pretty = money(n).slice(1);
  return String(typed) === pretty ? null : pretty;
}

/**
 * @param {object} p
 * @param {object} p.form         formView(state, q)
 * @param {string} p.path         a path of the question's input list
 * @param {Function} p.dispatch
 * @param {string} [p.testid]     the test id and element id (default "<q>.<path>")
 * @param {string} [p.label]      the visible label (default from copy/<q>.js: `labelCouple` for two people where it has one)
 * @param {string} [p.help]       words under the box (default from copy/<q>.js)
 * @param {string} [p.placeholder]
 * @param {boolean} [p.showError] default true
 * @param {object} [p.nested]     for a choice: { option: vnode } drawn inside that option's row
 */
export function Field({ form, path, dispatch, testid, label, help, placeholder, showError = true, nested, extra }) {
  const f = (form.byPath || byPath).get(path);
  if (!f) return null;
  const q = qOf(form);
  const id = testid || `${q}.${path}`;
  const words = (form.copy || C).fields[path] || {};
  const text = label || (form.couple && words.labelCouple) || words.label;
  const messageId = showError ? form.errors[path] : undefined;
  const error = messageId ? errorText(form, f, messageId) : null;
  const helpText = help !== undefined ? help : words.help;
  const helpId = `${id}.help`;
  const errId = `${id}.error`;
  const described = [helpText && !error ? helpId : null, error ? errId : null].filter(Boolean).join(' ') || undefined;

  if (f.type === 'choice' || f.type === 'yesNo') {
    const options = f.type === 'yesNo' ? ['no', 'yes'] : f.options;
    const shown = form.shown[path];
    const chosen = f.type === 'yesNo' ? (shown === true ? 'yes' : 'no') : shown;
    return (
      <fieldset class={`field field-choice${error ? ' has-error' : ''}`} data-field={path} aria-describedby={described}>
        <legend>{text}</legend>
        {options.map((o) => (
          <div class="option" key={o}>
            <div class="option-row">
              <input
                type="radio"
                id={`${id}.${o}`}
                data-testid={`${id}.${o}`}
                name={id}
                value={o}
                checked={chosen === o}
                onClick={() => { if (chosen !== o) dispatch(set(form, path, f.type === 'yesNo' ? o === 'yes' : o)); }}
                onChange={() => {}}
              />
              <label for={`${id}.${o}`}>
                {words.options ? words.options[o] : o}
                {words.optionHelp && words.optionHelp[o] && <span class="option-help">: {words.optionHelp[o]}</span>}
              </label>
            </div>
            {nested && nested[o]}
          </div>
        ))}
        {extra}
        {helpText && !error && <p id={helpId} class="help">{helpText}</p>}
        {error && <p id={errId} class="error" data-error-for={id}>{error}</p>}
      </fieldset>
    );
  }

  const isMoney = f.type === 'money';
  const isPercent = f.type === 'percent';
  const value = blank(form.draft[path]) ? '' : String(form.draft[path]);
  return (
    <div class={`field field-${f.type}${error ? ' has-error' : ''}`} data-field={path}>
      <label for={id}>{text}</label>
      <div class="box">
        {isMoney && <span class="prefix" aria-hidden="true">£</span>}
        <input
          type="text"
          inputmode={isMoney || isPercent ? 'decimal' : 'numeric'}
          autocomplete="off"
          id={id}
          data-testid={id}
          name={id}
          value={value}
          placeholder={placeholder !== undefined ? placeholder : placeholderOf(form, f)}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={described}
          onInput={(e) => dispatch(set(form, path, e.currentTarget.value))}
          onBlur={() => { const pretty = tidyMoney(form, f); if (pretty !== null) dispatch(set(form, path, pretty)); dispatch(touch(form, path)); }}
        />
        {isPercent && <span class="suffix" aria-hidden="true">%</span>}
      </div>
      {helpText && !error && <p id={helpId} class="help">{helpText}</p>}
      {error && <p id={errId} class="error" data-error-for={id}>{error}</p>}
    </div>
  );
}

/**
 * Puts the keyboard in the box for a field path of question q (a radio group: the ticked one). A field with no box
 * of its own (`household`) goes to the control that changes it: whatever carries data-focus-for="<q>.<path>"
 * ("+ Add a partner", or "Remove" once there is one).
 */
export function focusField(root, path, q = 'c') {
  if (!root || !path) return false;
  const el = root.querySelector(`[id="${q}.${path}"]`) || root.querySelector(`[name="${q}.${path}"]:checked`) || root.querySelector(`[name="${q}.${path}"]`)
    || root.querySelector(`[data-focus-for="${q}.${path}"]`);
  if (!el) return false;
  el.focus();
  return true;
}

/** The first field, in the order of the input list, that has a problem (of those `keep` lets through). */
const firstProblemOf = (form, keep = () => true) => {
  const f = (form.fields || FIELDS).find((x) => keep(x.path) && form.parsed.errors[x.path]);
  return f ? f.path : null;
};
export const firstProblem = (form) => firstProblemOf(form);

/**
 * The form around the boxes. Submitting (the button, or Enter) asks for the answer; with something missing the
 * first box ON SCREEN that needs attention takes focus and shows its sentence (A and B draw in the order of their
 * drawings, not of their input lists). The button is never greyed out.
 *
 * A's and B's numbers step (`action` 'draft/onward') moves on to the spend step when its own boxes are all right, and
 * the screen is drawn again inside this handler. Only a box of the numbers step may then take focus — never the
 * spending box the next step has just drawn (found 1 Oct 2026: it took focus, the shell then moved the keyboard to
 * the step's heading, the box counted as left, and "Type what you would spend a month…" was red on arrival).
 */
export function AskForm({ form, dispatch, action = 'draft/ask', children, ...rest }) {
  const q = qOf(form);
  const onSubmit = (e) => {
    e.preventDefault();
    const root = e.currentTarget;
    const onward = action === 'draft/onward';
    const own = (p) => !onward || !SPEND_PATHS.includes(p);
    dispatch({ type: action, q });
    const drawn = [...root.querySelectorAll('[data-field]')].map((el) => el.getAttribute('data-field')).filter(own);
    const first = drawn.find((p) => form.parsed.errors[p]) || (onward ? firstProblemOf(form, own) : firstProblem(form));
    if (first) focusField(root, first, q);
  };
  return <form class="ask" noValidate onSubmit={onSubmit} {...rest}>{children}</form>;
}
