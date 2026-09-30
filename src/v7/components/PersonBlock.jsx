/**
 * One person's fields, in the order of the input list: for "you" (with the start of the money) and, repeated, for
 * "partner". A field that depends on a choice of the same person (the forecast amount, the final-salary amount
 * and age, the start age) is drawn inside that option's row, and only while the option is chosen — so the form
 * holds exactly the fields that apply, no more, no fewer.
 */
import { Field, FIELDS } from './Field.jsx';
import { C } from '../copy/c.js';
import { ageText } from '../../answers/shared/format.js';

/** Fields of this person's group that stand on their own (their `when` names nothing but the household). */
const topLevel = (who) => FIELDS.filter((f) => f.group === who && Object.keys(f.when || {}).every((p) => p === 'household'));
/** Fields drawn inside a parent's option: [{ field, option }] for a parent path. */
const nestedUnder = (parentPath) => FIELDS.filter((f) => f.when && parentPath in f.when).map((f) => ({ field: f, option: f.when[parentPath] }));
const optionName = (parent, value) => (parent.type === 'yesNo' ? (value ? 'yes' : 'no') : value);

export function PersonBlock({ who, form, dispatch }) {
  return (
    <div class={`person person-${who}`}>
      {topLevel(who).map((f) => {
        if (f.type !== 'choice' && f.type !== 'yesNo') return <Field key={f.path} form={form} path={f.path} dispatch={dispatch} />;
        const nested = {};
        for (const { field, option } of nestedUnder(f.path)) {
          if (!form.applies(field)) continue;
          const name = optionName(f, option);
          nested[name] = <>{nested[name]}<Field form={form} path={field.path} dispatch={dispatch} /></>;
        }
        let extra = null;
        // Under the earliest pension age, and nothing chosen: we have picked "From age" and the earliest age allowed.
        if (f.path === 'start.kind' && form.shown['start.kind'] === 'age' && form.draft['start.kind'] === undefined && typeof form.parsed.values['you.age'] === 'number') {
          const age = ageText(form.earliestStart());
          extra = <p class="help">{C.numbers.tooYoung.replace(/\{age\}/g, age)}</p>;
        }
        return <Field key={f.path} form={form} path={f.path} dispatch={dispatch} nested={nested} extra={extra} />;
      })}
    </div>
  );
}
