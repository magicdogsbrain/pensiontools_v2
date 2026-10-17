/**
 * One box of a saved plan's editing step (research/v7/editing-in-v7.md 2), drawn from the step's reading (aboutView): the
 * label, the box or the choice, the saved value with where it came from, the problem in plain words. Draws only: what is
 * shown, whether it applies and its problem are the reading's. Accessibility as Field.jsx: a real <label for>, help and
 * error joined by aria-describedby, aria-invalid on error, radios inside <fieldset><legend>. Boxes are controlled by the
 * state and type="text" with the right phone keypad. Test ids and element ids are "plan.about.<path>".
 *
 *   <EditField f words errors source planId dispatch slots nested />
 *     f        { path, type, options, applies, shown, saved, error } from the reading
 *     words    ABOUT.fields[path]; errors: ABOUT.errors[path]
 *     source   the sentence beside the saved value ("From your plan, saved 22 August 2026"), or null
 *     slots    fills {yearNow} and the like in option words and error sentences
 *     nested   for a choice: { option: vnode } drawn inside that option's row
 */
const fill = (text, slots = {}) => String(text == null ? '' : text).replace(/\{(\w+)\}/g, (m, k) => (k in slots && slots[k] != null ? String(slots[k]) : m));

export function EditField({ f, words = {}, errors = {}, source = null, savedWords = '({value})', planId, dispatch, slots = {}, nested = null, help, extra = null }) {
  if (!f || f.applies === false) return null;
  const id = `plan.about.${f.path}`;
  const error = f.error ? fill(errors[f.error] || errors.other || f.error, slots) : null;
  const helpText = help !== undefined ? help : words.help;
  const helpId = `${id}.help`;
  const errId = `${id}.error`;
  const srcId = `${id}.source`;
  const described = [helpText && !error ? helpId : null, source ? srcId : null, error ? errId : null].filter(Boolean).join(' ') || undefined;
  const set = (value) => dispatch({ type: 'plan/edit', planId, path: f.path, value });
  const touch = () => dispatch({ type: 'plan/touch', planId, path: f.path });
  const savedLine = f.saved !== null && f.saved !== undefined && source
    ? <p id={srcId} class="plan-source edit-source" data-saved-for={f.path}>{source} {f.type === 'choice' ? fill(savedWords, { value: (words.options && fill(words.options[f.saved] || f.saved, slots)) }) : fill(savedWords, { value: f.saved })}</p>
    : source ? <p id={srcId} class="plan-source edit-source" data-saved-for={f.path}>{source}</p> : null;

  if (f.type === 'choice') {
    return (
      <fieldset class={`field field-choice${error ? ' has-error' : ''}`} data-field={f.path} aria-describedby={described}>
        <legend>{words.label}</legend>
        {(f.options || []).map((o) => (
          <div class="option" key={o}>
            <div class="option-row">
              <input type="radio" id={`${id}.${o}`} data-testid={`${id}.${o}`} name={id} value={o} checked={f.shown === o}
                onClick={() => { if (f.shown !== o) set(o); }} onChange={() => {}} onBlur={touch} />
              <label for={`${id}.${o}`}>{fill((words.options && words.options[o]) || o, slots)}</label>
            </div>
            {nested && nested[o]}
          </div>
        ))}
        {extra}
        {savedLine}
        {helpText && !error && <p id={helpId} class="help">{helpText}</p>}
        {error && <p id={errId} class="error" data-error-for={id}>{error}</p>}
      </fieldset>
    );
  }
  const numeric = f.type === 'age';
  return (
    <div class={`field field-${f.type}${error ? ' has-error' : ''}`} data-field={f.path}>
      <label for={id}>{words.label}</label>
      <div class="box">
        <input type="text" inputmode={numeric ? 'numeric' : 'text'} autocomplete="off" id={id} data-testid={id} name={id} value={f.shown || ''}
          aria-invalid={error ? 'true' : undefined} aria-describedby={described}
          onInput={(e) => set(e.currentTarget.value)} onBlur={touch} />
      </div>
      {savedLine}
      {helpText && !error && <p id={helpId} class="help">{helpText}</p>}
      {error && <p id={errId} class="error" data-error-for={id}>{error}</p>}
    </div>
  );
}
