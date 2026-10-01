/**
 * One person's fields, in the order of the input list: for "you" (with the start of the money, on C) and, repeated,
 * for "partner". A field that depends on a choice of the same person (the forecast amount, the final-salary amount
 * and age, the start age, the pay-in boxes) is drawn inside that option's row, and only while the option is chosen —
 * so the form holds exactly the fields that apply, no more, no fewer.
 *
 *   <PersonBlock who form dispatch />          every top-level field of the person's group, in list order
 *   <PersonBlock who form dispatch only={[…]} />  just those top-level paths, in the order given (A and B draw the
 *                                             person in the order their drawings ask: age, pot, pay-in, …)
 *   <FieldGroup path form dispatch />          one field and, inside its options, the fields that depend on it
 *
 * Works for any question: the fields and words come from formView(state, q).
 */
import { Field, FIELDS } from './Field.jsx';
import { payingIn } from '../../answers/c/schema.js';
import { C } from '../copy/c.js';
import { ageText } from '../../answers/shared/format.js';

const fieldsOf = (form) => form.fields || FIELDS;
/** Fields of this person's group that stand on their own (their `when` names nothing but the household). */
const topLevel = (form, who) => fieldsOf(form).filter((f) => f.group === who && Object.keys(f.when || {}).every((p) => p === 'household'));
/**
 * Fields drawn inside a parent's option: [{ field, option }] for a parent path. A field goes inside the LAST choice its
 * `when` names (the innermost one): C's "your part" applies when "still paying in" is yes, inside whatever that answer
 * itself sits in — so it is drawn once, inside "Yes", never twice.
 */
const innermost = (f) => { const keys = Object.keys(f.when || {}); return keys.length ? keys[keys.length - 1] : null; };
const nestedUnder = (form, parentPath) => fieldsOf(form).filter((f) => f.when && innermost(f) === parentPath).map((f) => ({ field: f, option: f.when[parentPath] }));
const optionName = (parent, value) => (parent.type === 'yesNo' ? (value ? 'yes' : 'no') : value);

/**
 * One field, with the fields that depend on it drawn inside the option they belong to (only those that apply).
 * `skip` leaves some nested fields out (drawn elsewhere); `help` and `extra` pass through to Field.
 */
export function FieldGroup({ form, path, dispatch, help, extra, skip = [] }) {
  const f = fieldsOf(form).find((x) => x.path === path);
  if (!f || !form.applies(f)) return null;
  if (f.type !== 'choice' && f.type !== 'yesNo') return <Field form={form} path={f.path} dispatch={dispatch} help={help} />;
  const nested = {};
  for (const { field, option } of nestedUnder(form, f.path)) {
    if (!form.applies(field) || skip.includes(field.path)) continue;
    const name = optionName(f, option);
    // a choice inside an option draws its own options (and what sits inside them) in turn
    nested[name] = <>{nested[name]}<FieldGroup form={form} path={field.path} dispatch={dispatch} skip={skip} /></>;
  }
  return <Field form={form} path={f.path} dispatch={dispatch} nested={nested} extra={extra} help={help} />;
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
