/**
 * One person's fields, in the order of the input list: for "you" (with the start of the money, on C) and, repeated,
 * for "partner". A field that depends on a choice of the same person (the forecast amount, the final-salary amount
 * and age, the start age, the pay-in boxes, the partner's stop age) is drawn inside that option's row, and only while
 * the option is chosen — so the form holds exactly the fields that apply, no more, no fewer.
 *
 *   <PersonBlock who form dispatch />          every top-level field of the person's group, in list order
 *   <PersonBlock who form dispatch only={[…]} />  just those top-level paths, in the order given (A and B draw the
 *                                             person in the order their drawings ask: age, pot, pay-in, …)
 *   <FieldGroup path form dispatch />          one field and, inside its options, the fields that depend on it
 *
 * Works for any question: the fields and words come from formView(state, q).
 *
 * Couples who stop work in different years (research/v7/couples-different-years.md 2.1–2.3):
 *  - a field under "more detail" is drawn there, never inside the choice it depends on ("Already had the tax-free
 *    part?" hangs on "Now" in C and on "I've already stopped" in A and B, and is asked under more detail);
 *  - a choice that is not asked (select.js choiceAsked: B's stop for one person) draws nothing;
 *  - `inside` puts a field in an option although its rule is not a `when` on that choice (B's stop age, hidden by "I've
 *    already stopped", is drawn inside "At an age");
 *  - a field whose `when` names this choice by a list ("one of") is drawn under it, not inside an option: the pay line,
 *    one line with "Change" until it is answered, then its three settings (PayLine).
 */
import { Field, FIELDS } from './Field.jsx';
import { LinkButton } from './Button.jsx';
import { href } from '../router/routes.js';
import { payingIn } from '../../answers/c/schema.js';
import { C } from '../copy/c.js';
import { ageText } from '../../answers/shared/format.js';

const fieldsOf = (form) => form.fields || FIELDS;
/** Fields of this person's group that stand on their own (their `when` names nothing but the household). */
const topLevel = (form, who) => fieldsOf(form).filter((f) => f.group === who && Object.keys(f.when || {}).every((p) => p === 'household'));
/**
 * Fields drawn inside a parent's option: [{ field, option }] for a parent path. A field goes inside the LAST choice its
 * `when` names (the innermost one): C's "your part" applies when "still paying in" is yes, inside whatever that answer
 * itself sits in — so it is drawn once, inside "Yes", never twice. A `when` that names the parent by a list ("one of")
 * is never inside one option: it is drawn under the choice (linesUnder).
 */
const innermost = (f) => { const keys = Object.keys(f.when || {}); return keys.length ? keys[keys.length - 1] : null; };
const nestedUnder = (form, parentPath) => fieldsOf(form).filter((f) => f.when && innermost(f) === parentPath && !Array.isArray(f.when[parentPath]))
  .map((f) => ({ field: f, option: f.when[parentPath] }));
/** Fields whose `when` names this choice by a list: drawn under it, on their own (the pay line). */
const linesUnder = (form, parentPath) => fieldsOf(form).filter((f) => f.when && Array.isArray(f.when[parentPath]));
const optionName = (parent, value) => (parent.type === 'yesNo' ? (value ? 'yes' : 'no') : value);

/**
 * The pay line (couples-different-years.md 2.1): while it is not answered, one line saying what not answering means —
 * "Until you've both stopped, the one still working covers half of what you spend from their pay, and keeps paying in." —
 * and "Change", a link to this step with ?focus=untilBothStop, which opens the three settings and puts the keyboard in
 * them. Answered (or asked for), the three settings themselves. The words are copy/<q>.js's; the setting the line
 * describes is the reader's (select.js payLineOf), never chosen here.
 */
function PayLine({ form, path, dispatch }) {
  const line = form.payLine;
  if (!line) return null;
  if (line.open) return <Field form={form} path={path} dispatch={dispatch} />;
  const words = form.copy.fields[path];
  return (
    <p class="help pay-line" data-testid={`${form.q}.${path}.line`}>
      {words.line[line.covers]}{' '}
      <LinkButton testid={`${form.q}.${path}.change`} kind="quiet" href={href.step(form.q, 'numbers', path)}>{words.change}</LinkButton>
    </p>
  );
}

/**
 * One field, with the fields that depend on it drawn inside the option they belong to (only those that apply), and the
 * lines that hang on it under it. `skip` leaves some nested fields out (drawn elsewhere); `inside` ({ option: [paths] })
 * draws more inside an option; `help` and `extra` pass through to Field.
 */
export function FieldGroup({ form, path, dispatch, help, extra, skip = [], inside = {} }) {
  const f = fieldsOf(form).find((x) => x.path === path);
  if (!f || !form.applies(f)) return null;
  if (f.type === 'choice' && form.isAsked && !form.isAsked(path)) return null;
  if (f.type !== 'choice' && f.type !== 'yesNo') return <Field form={form} path={f.path} dispatch={dispatch} help={help} />;
  const nested = {};
  for (const { field, option } of nestedUnder(form, f.path)) {
    // a "more detail" question is drawn under more detail, never inside the choice it depends on
    if (!form.applies(field) || skip.includes(field.path) || field.group === 'more') continue;
    const name = optionName(f, option);
    // a choice inside an option draws its own options (and what sits inside them) in turn
    nested[name] = <>{nested[name]}<FieldGroup form={form} path={field.path} dispatch={dispatch} skip={skip} /></>;
  }
  for (const [option, paths] of Object.entries(inside)) {
    for (const p of paths) nested[option] = <>{nested[option]}<FieldGroup form={form} path={p} dispatch={dispatch} skip={skip} /></>;
  }
  const field = <Field form={form} path={f.path} dispatch={dispatch} nested={nested} extra={extra} help={help} />;
  const lines = linesUnder(form, f.path).filter((x) => form.applies(x));
  if (!lines.length) return field;
  return <>{field}{lines.map((x) => <PayLine key={x.path} form={form} path={x.path} dispatch={dispatch} />)}</>;
}

export function PersonBlock({ who, form, dispatch, only }) {
  const top = only ? only.map((p) => fieldsOf(form).find((f) => f.path === p)).filter(Boolean) : topLevel(form, who);
  return (
    <div class={`person person-${who}`}>
      {top.map((f) => {
        if (!form.applies(f)) return null;
        let extra = null;
        // Question C, nothing chosen and "From age" picked by the form: still paying in, the State Pension age (the age to
        // change to the one they stop at); else, under the earliest pension age, that age.
        if (f.path === 'start.kind' && form.shown['start.kind'] === 'age' && form.draft['start.kind'] === undefined && typeof form.parsed.values['you.age'] === 'number') {
          const paying = payingIn(form.parsed.values);
          const age = ageText(paying ? form.defaultStart() : form.earliestStart());
          extra = <p class="help" data-testid="c.start.picked">{(paying ? C.numbers.payingInStart : C.numbers.tooYoung).replace(/\{age\}/g, age)}</p>;
        }
        return <FieldGroup key={f.path} form={form} path={f.path} dispatch={dispatch} extra={extra} />;
      })}
    </div>
  );
}
