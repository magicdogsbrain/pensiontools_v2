/**
 * One input, drawn from its declaration in SCHEMA_C and its words in copy/c.js. There is no other way to put a
 * box on a screen (architecture 3.5).
 *
 *   formView(state)              what every field needs to draw itself: the draft, the parsed draft, the errors to
 *                                show, what each field shows when nothing is typed, and which fields apply
 *   <Field form path dispatch />  a money or age box (text, with the right phone keypad), or a group of radios
 *   <AskForm form dispatch>       the form around them: submit = "Show what it pays" = draft/ask, and the first
 *                                box that needs attention takes focus
 *
 * Accessibility lives here: a real <label for>, help and error joined by aria-describedby, aria-invalid on error,
 * radios inside <fieldset><legend>. Boxes are controlled by the state; nothing reformats what is being typed.
 * Money boxes are type="text" with inputmode="decimal" (type="number" mangles commas and scrolls by accident).
 */
import { SCHEMA_C } from '../../answers/c/schema.js';
import { money, ageText } from '../../answers/shared/format.js';
import { parsedDraft, errorsToShow } from '../state/select.js';
import { C } from '../copy/c.js';

const Q = 'c';
export const FIELDS = SCHEMA_C.fields;
export const byPath = new Map(FIELDS.map((f) => [f.path, f]));
export const blank = (v) => v === undefined || v === null || (typeof v === 'string' && v.trim() === '');
const MORE = FIELDS.filter((f) => f.group === 'more').map((f) => f.path);

/** The plain default of a field (not one that comes from a rule), or undefined. */
const plainDefault = (f) => ('default' in f && (f.default === null || typeof f.default !== 'object') ? f.default : undefined);

/** What a field shows when nothing is typed: the checked value (rules included), else its plain default. */
export function formView(state) {
  const draft = state.draft[Q].values;
  const parsed = parsedDraft(state, Q);
  const errors = errorsToShow(state, Q);
  const shown = {};
  for (const f of FIELDS) {
    if (!blank(draft[f.path])) shown[f.path] = draft[f.path];
    else if (parsed.values[f.path] !== undefined) shown[f.path] = parsed.values[f.path];
    else if (plainDefault(f) !== undefined) shown[f.path] = plainDefault(f);
  }
  const applies = (f) => Object.entries(f.when || {}).every(([p, want]) => shown[p] === want);
  const moreOpen = state.ui.open.includes('more') || MORE.some((p) => !blank(draft[p])) || MORE.includes(state.route.focus);
  const couple = shown.household === 'couple';
  /** The earliest age this person can start taking a pension, by the input list's own rule. */
  const earliestStart = () => SCHEMA_C.defaultRules.startAge(parsed.values, state.env);
  return { draft, parsed, errors, shown, applies, moreOpen, couple, env: state.env, earliestStart };
}

const fill = (text, values) => String(text).replace(/\{(\w+)\}/g, (m, k) => (k in values ? values[k] : m));
const limit = (f, n) => (f.type === 'money' ? money(n) : ageText(n));

/** The sentence for a field's messageId, in the guide's words. */
export function errorText(form, f, messageId) {
  const words = C.fields[f.path] || {};
  const own = words.errors && words.errors[messageId];
  const kind = C.errors[f.type];
  const text = own || (kind && kind[messageId]) || C.errors.other;
  const values = { min: limit(f, f.min), max: limit(f, f.max) };
  if (messageId === 'start-not-before-access') values.age = ageText(form.earliestStart());
  return fill(text, values);
}

/** The value shown in a box when nothing is typed, as a placeholder (never as the value: the box must clear). */
function placeholderOf(form, f) {
  const d = form.parsed.values[f.path] !== undefined ? form.parsed.values[f.path] : plainDefault(f);
  if (typeof d !== 'number') return undefined;
  return f.type === 'money' ? money(d).slice(1) : ageText(d);
}

const set = (path, value) => ({ type: 'draft/set', q: Q, path, value });
const touch = (path) => ({ type: 'draft/touch', q: Q, path });

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
 * @param {object} p.form         formView(state)
 * @param {string} p.path         a path of SCHEMA_C
 * @param {Function} p.dispatch
 * @param {string} [p.testid]     the test id and element id (default "c.<path>")
 * @param {string} [p.label]      the visible label (default from copy/c.js)
 * @param {string} [p.help]       words under the box (default from copy/c.js)
 * @param {string} [p.placeholder]
 * @param {boolean} [p.showError] default true
 * @param {object} [p.nested]     for a choice: { option: vnode } drawn inside that option's row
 * @param {boolean} [p.autoFocus]
 */
export function Field({ form, path, dispatch, testid, label, help, placeholder, showError = true, nested, extra }) {
  const f = byPath.get(path);
  if (!f) return null;
  const id = testid || `${Q}.${path}`;
  const words = C.fields[path] || {};
  const text = label || words.label;
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
                onClick={() => { if (chosen !== o) dispatch(set(path, f.type === 'yesNo' ? o === 'yes' : o)); }}
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
  const value = blank(form.draft[path]) ? '' : String(form.draft[path]);
  return (
    <div class={`field field-${f.type}${error ? ' has-error' : ''}`} data-field={path}>
      <label for={id}>{text}</label>
      <div class="box">
        {isMoney && <span class="prefix" aria-hidden="true">£</span>}
        <input
          type="text"
          inputmode={isMoney ? 'decimal' : 'numeric'}
          autocomplete="off"
          id={id}
          data-testid={id}
          name={id}
          value={value}
          placeholder={placeholder !== undefined ? placeholder : placeholderOf(form, f)}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={described}
          onInput={(e) => dispatch(set(path, e.currentTarget.value))}
          onBlur={() => { const pretty = tidyMoney(form, f); if (pretty !== null) dispatch(set(path, pretty)); dispatch(touch(path)); }}
        />
      </div>
      {helpText && !error && <p id={helpId} class="help">{helpText}</p>}
      {error && <p id={errId} class="error" data-error-for={id}>{error}</p>}
    </div>
  );
}

/**
 * Puts the keyboard in the box for a field path (a radio group: the ticked one). A field with no box of its own
 * (`household`) goes to the control that changes it: whatever carries data-focus-for="c.<path>" ("+ Add a partner",
 * or "Remove" once there is one).
 */
export function focusField(root, path) {
  if (!root || !path) return false;
  const el = root.querySelector(`[id="${Q}.${path}"]`) || root.querySelector(`[name="${Q}.${path}"]:checked`) || root.querySelector(`[name="${Q}.${path}"]`)
    || root.querySelector(`[data-focus-for="${Q}.${path}"]`);
  if (!el) return false;
  el.focus();
  return true;
}

/** The first field, in the order of the input list, that has a problem. */
export const firstProblem = (form) => {
  const f = FIELDS.find((x) => form.parsed.errors[x.path]);
  return f ? f.path : null;
};

/**
 * The form around the boxes. Submitting (the button, or Enter) asks for the answer; with something missing the
 * first box that needs attention takes focus and shows its sentence. The button is never greyed out.
 */
export function AskForm({ form, dispatch, children, ...rest }) {
  const onSubmit = (e) => {
    e.preventDefault();
    dispatch({ type: 'draft/ask', q: Q });
    const first = firstProblem(form);
    if (first) focusField(e.currentTarget, first);
  };
  return <form class="ask" noValidate onSubmit={onSubmit} {...rest}>{children}</form>;
}
