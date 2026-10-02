/**
 * "Does what you spend change as you get older?" — the spending shape's block (research/v7/spending-shape.md 4.1–4.3,
 * 7.1, 7.3). The owner's rule (2 Oct 2026): at least what today's planner offers — any number of steps by age, each
 * staying the same, falling by a percentage a year, or moving evenly to the next; the go-go, go-slow and no-go years one
 * tap away; the picture of every year.
 *
 *   <StepsField state q dispatch />
 *
 * On A's and B's spend step, under the figure (amounts a month, after tax, at today's prices); under C's "Add more
 * detail" (each later step a share of what C works out you could start on). Closed, it is one line — "No: the same
 * every year, going up with prices." — and "Change it with age", so a first answer still takes three numbers. Open:
 *   - "Suggest go-go, go-slow and no-go years", and "Or: The same every year · Slowly less", each with Undo;
 *   - the first row (the figure above, from the stop; C: 100% from the start) and its "then";
 *   - one row per later step: its age (a couple: your age, your partner's beside it), its amount (C: its share) with its
 *     share of the start (and of the budget, a guide, when there is one), what
 *     happens from it ("stays the same", "falls by …% a year", "moves evenly to the next step" — not on the last) and
 *     "Remove";
 *   - "+ Add a step"; "Move the later steps in proportion" once the figure above has changed under them;
 *   - the picture of every year (ShapeChart) and "Show each year".
 *
 * Computes nothing: what it draws is select.js shapeView(state, q); every edit is an action (state/actions.js shape/*,
 * and draft/set for the first row's own "then"). Every box has its label, its error under it joined by
 * aria-describedby, and the test id and element id "<q>.<base>.steps.<i>.<field>" (the first row's "<q>.<base>.then"
 * and "<q>.<base>.fallsPct"). Remove buttons are named "Remove the step from 75". The keyboard order is the reading order.
 */
import { shapeView } from '../state/select.js';
import { money } from '../../answers/shared/format.js';
import { Button } from './Button.jsx';
import { ShapeChart } from './ShapeChart.jsx';
import { summaryWords } from './shapeWords.js';
import { SHAPE } from '../copy/shape.js';

const fill = (text, values) => String(text).replace(/\{(\w+)\}/g, (m, k) => (k in values ? values[k] : m));
const E = SHAPE.errors;

/**
 * The words under a box for a problem the checks gave (validate.js: the steps' own message ids — 'required',
 * 'notANumber', 'tooLow', 'tooHigh', 'notAnOption', 'range'; and the rule 'shape-steps' — 'beforeNow', 'beforeStop',
 * 'beforeStart', 'afterEnd', 'order', 'glidesLast', 'tooMany'), in the guide's words (spending-shape.md 7.3).
 */
export function stepErrorText(view, field, messageId, i) {
  if (!messageId) return null;
  const id = String(messageId);
  const prev = i > 0 && view.steps[i - 1] && typeof view.steps[i - 1].age === 'number' ? view.steps[i - 1].age : view.startAge;
  if (field === 'fromAge') {
    switch (id) {
      case 'required': return E.fromAge.required;
      case 'notANumber': return E.fromAge.notANumber;
      case 'order': return fill(E.fromAge.order, { age: prev });
      case 'afterEnd': case 'tooHigh': return fill(E.fromAge.afterEnd, { age: view.endAge });
      case 'beforeNow': return fill(E.fromAge.beforeNow, { age: view.youAge });
      case 'beforeStart': return fill(E.fromAge.beforeStart, { age: view.startAge });
      case 'beforeStop': case 'tooLow':
        if (view.unit === 'share') return fill(E.fromAge.beforeStart, { age: view.startAge });
        if (view.startKind === 'apart') return fill(E.fromAge.beforeFirstStop, { age: view.startAge });
        if (view.startKind === 'stop') return fill(E.fromAge.beforeStop, { age: view.startAge });
        return fill(E.fromAge.beforeNow, { age: view.youAge });
      default: return E.other;
    }
  }
  if (field === 'perMonth' || field === 'share') {
    const w = E[field];
    return w[id] || w.notANumber;
  }
  if (field === 'fallsPct') return E.fallsPct.range;
  if (field === 'then') return id === 'glidesLast' ? E.then.glidesLast : E.then.notAnOption;
  return E.other;
}

/** "then": a pick-list of the three; "moves evenly" only where there is a next step (or where it is already chosen). */
function ThenBox({ id, value, last, label, error, onChange, fallsId, falls, fallsError, onFalls, onFallsLeave }) {
  // data-field is the box's path ("spend.steps.0.then"): the form puts the keyboard in the first one with a problem
  const pathOf = (x) => x.slice(x.indexOf('.') + 1);
  const options = ['level', 'falls', 'glides'].filter((o) => o !== 'glides' || !last || value === 'glides');
  const errId = `${id}.error`;
  const fallsErrId = `${fallsId}.error`;
  return (
    <div class="shape-then">
      <div class={`field field-then${error ? ' has-error' : ''}`} data-field={pathOf(id)}>
        <label for={id}>{SHAPE.then.label}<span class="sr-only"> ({label})</span></label>
        <select id={id} data-testid={id} name={id} value={value} aria-invalid={error ? 'true' : undefined} aria-describedby={error ? errId : undefined}
          onChange={(e) => onChange(e.currentTarget.value)}>
          {options.map((o) => <option key={o} value={o}>{SHAPE.then[o]}</option>)}
        </select>
        {error && <p id={errId} class="error" data-error-for={id}>{error}</p>}
      </div>
      {value === 'falls' && (
        <div class={`field field-percent shape-falls${fallsError ? ' has-error' : ''}`} data-field={pathOf(fallsId)}>
          <label for={fallsId}>{SHAPE.then.fallsBox}</label>
          <div class="box">
            <input type="text" inputmode="decimal" autocomplete="off" id={fallsId} data-testid={fallsId} name={fallsId} value={falls}
              placeholder="1" aria-invalid={fallsError ? 'true' : undefined} aria-describedby={fallsError ? fallsErrId : `${fallsId}.help`}
              onInput={(e) => onFalls(e.currentTarget.value)} onBlur={onFallsLeave} />
            <span class="suffix" aria-hidden="true">%</span>
          </div>
          {!fallsError && <p id={`${fallsId}.help`} class="help">{SHAPE.then.fallsHelp}</p>}
          {fallsError && <p id={fallsErrId} class="error" data-error-for={fallsId}>{fallsError}</p>}
        </div>
      )}
    </div>
  );
}

/** The first row: the figure above (A, B) from the stop or now; C's start, 100%. Its own "then". */
function FirstRow({ view, dispatch }) {
  const { q, base } = view;
  const set = (path, value) => dispatch({ type: 'draft/set', q, path, value });
  const touch = (path) => dispatch({ type: 'draft/touch', q, path });
  const title = view.unit === 'share' ? SHAPE.firstRowC
    : view.startKind === 'stop' ? fill(SHAPE.firstRow, { age: view.startAge })
      : view.startKind === 'now' ? fill(SHAPE.firstRowNow, { age: view.startAge })
        : view.startKind === 'apart' ? fill(SHAPE.firstRowApart, { age: view.startAge }) : SHAPE.firstRowAges;
  const amount = view.unit === 'share' ? SHAPE.firstShareC
    : typeof view.first === 'number' ? fill(SHAPE.firstAmount, { amount: money(view.first) }) : SHAPE.firstAmountNone;
  const thenId = `${q}.${base}.then`;
  const fallsId = `${q}.${base}.fallsPct`;
  return (
    <li class="shape-step shape-first" data-step="first">
      <p class="step-title" data-testid={`${q}.shape.first`}><strong>{title}</strong>: {amount}</p>
      <ThenBox id={thenId} value={view.then} last={view.steps.length === 0} label={SHAPE.then.labelFirst}
        error={stepErrorText(view, 'then', view.firstErrors.then)} onChange={(v) => set(`${base}.then`, v)}
        fallsId={fallsId} falls={view.fallsPct} fallsError={stepErrorText(view, 'fallsPct', view.firstErrors.fallsPct)}
        onFalls={(v) => set(`${base}.fallsPct`, v)} onFallsLeave={() => touch(`${base}.fallsPct`)} />
    </li>
  );
}

/** One later step. */
function StepRow({ view, step, i, dispatch }) {
  const { q, base, unit } = view;
  const id = (field) => `${q}.${base}.steps.${i}.${field}`;
  const edit = (field, value) => dispatch({ type: 'shape/step', q, i, field, value });
  const leave = (field) => dispatch({ type: 'shape/touch', q, i, field });
  const last = i === view.steps.length - 1;
  const ageErr = stepErrorText(view, 'fromAge', step.errors.fromAge, i);
  const amountErr = stepErrorText(view, unit, step.errors[unit], i);
  const named = typeof step.age === 'number' ? step.age : null;
  const box = (field, mode, prefix, suffix, err, help, label) => (
    <div class={`field field-${field === 'fromAge' ? 'age' : unit === 'share' ? 'percent' : 'money'}${err ? ' has-error' : ''}`} data-field={`${base}.steps.${i}.${field}`}>
      <label for={id(field)}>{label}</label>
      <div class="box">
        {prefix && <span class="prefix" aria-hidden="true">{prefix}</span>}
        <input type="text" inputmode={mode} autocomplete="off" id={id(field)} data-testid={id(field)} name={id(field)} value={step[field === 'fromAge' ? 'fromAge' : 'amount']}
          aria-invalid={err ? 'true' : undefined} aria-describedby={err ? `${id(field)}.error` : help ? `${id(field)}.help` : undefined}
          onInput={(e) => edit(field, e.currentTarget.value)} onBlur={() => leave(field)} />
        {suffix && <span class="suffix" aria-hidden="true">{suffix}</span>}
      </div>
      {help && !err && <p id={`${id(field)}.help`} class="help">{help}</p>}
      {err && <p id={`${id(field)}.error`} class="error" data-error-for={id(field)}>{err}</p>}
    </div>
  );
  const help = unit === 'share' ? SHAPE.step.shareHelp
    : typeof step.ofStart === 'number' && typeof step.ofBudget === 'number' ? fill(SHAPE.step.ofStartBudget, { pct: step.ofStart, budgetPct: step.ofBudget })
      : typeof step.ofStart === 'number' ? fill(SHAPE.step.ofStart, { pct: step.ofStart }) : SHAPE.step.amountHelp;
  const remove = (e) => {
    const list = e.currentTarget.closest('[data-region="shape"]');
    dispatch({ type: 'shape/remove', q, i });
    // the keyboard goes to the next step's age, or to "+ Add a step"
    const next = list && (list.querySelector(`[id="${q}.${base}.steps.${i}.fromAge"]`) || list.querySelector(`[data-testid="${q}.shape.add"]`));
    if (next) next.focus();
  };
  return (
    <li class="shape-step" data-step={i}>
      <div class="step-head">
        {box('fromAge', 'numeric', null, null, ageErr, null, view.couple ? SHAPE.step.ageCouple : SHAPE.step.age)}
        {view.couple && typeof step.partnerAge === 'number' && <span class="partner-age" data-testid={`${q}.shape.partner.${i}`}>{fill(SHAPE.step.partner, { age: step.partnerAge })}</span>}
      </div>
      {box(unit, 'decimal', unit === 'share' ? null : '£', unit === 'share' ? '%' : null, amountErr, help, unit === 'share' ? SHAPE.step.share : SHAPE.step.amount)}
      <ThenBox id={id('then')} value={step.then} last={last} label={named !== null ? fill(SHAPE.then.labelOf, { age: named }) : SHAPE.step.titleNew}
        error={stepErrorText(view, 'then', step.errors.then, i)} onChange={(v) => edit('then', v)}
        fallsId={id('fallsPct')} falls={step.fallsPct} fallsError={stepErrorText(view, 'fallsPct', step.errors.fallsPct, i)}
        onFalls={(v) => edit('fallsPct', v)} onFallsLeave={() => leave('fallsPct')} />
      {/* last in the row, so the keyboard goes age, amount, "then" — and only then to "Remove" */}
      <p class="step-foot">
        <Button testid={`${q}.shape.remove.${i}`} kind="quiet" class="step-remove" aria-label={named !== null ? fill(SHAPE.removeOf, { age: named }) : SHAPE.removeNew}
          onClick={remove}>{SHAPE.remove}</Button>
      </p>
    </li>
  );
}

/** The line under the buttons after a suggestion, a preset, Undo or a rescale (role="status"), with Undo where it can. */
function Note({ view, dispatch }) {
  const n = view.note;
  if (!n) return null;
  const v = n.values || {};
  const floor = typeof v.floor === 'number' ? fill(SHAPE.suggestFloor, { amount: money(v.floor) }) : '';
  const c = view.unit === 'share';
  const words = {
    suggest: typeof v.age75 === 'number' ? fill(c ? SHAPE.suggestDoneC : SHAPE.suggestDone, { age75: v.age75, age85: v.age85, floor })
      : typeof v.age85 === 'number' ? fill(c ? SHAPE.suggestDoneOneC : SHAPE.suggestDoneOne, { age85: v.age85, floor }) : SHAPE.suggestNone,
    suggestNeedsFirst: SHAPE.suggestNeedsFirst,
    slowlyNeedsStop: SHAPE.slowlyNeedsStop,
    level: SHAPE.presetLevelDone,
    slowly: SHAPE.presetSlowlyDone,
    undone: SHAPE.undone,
    rescaled: SHAPE.rescaled
  }[n.kind];
  if (!words) return null;
  return (
    <div class="shape-note" role="status" data-testid={`${view.q}.shape.note`} data-note={n.kind}>
      <p>{words}{n.kind === 'suggest' && v.couple && <> {SHAPE.suggestCouple}</>}</p>
      {view.canUndo && <Button testid={`${view.q}.shape.undo`} kind="quiet" onClick={() => dispatch({ type: 'shape/undo', q: view.q })}>{SHAPE.undo}</Button>}
    </div>
  );
}

/** The closed line: "No: the same every year …", or what the shape holds. */
function Summary({ view }) {
  const text = summaryWords(view);
  return <p class="shape-summary" data-testid={`${view.q}.shape.summary`}>{text}</p>;
}

export function StepsField({ state, q, dispatch, level = 2, forceOpen = false }) {
  const shown = shapeView(state, q);
  if (!shown) return null;
  // on a short form whose problem is in the steps, the block is open and stays open (its boxes are what needs a look)
  const view = forceOpen ? { ...shown, open: true } : shown;
  const toggle = () => dispatch({ type: 'ui/toggle', id: 'shape' });
  const add = (e) => {
    const region = e.currentTarget.closest('[data-region="shape"]');
    const i = view.steps.length;
    dispatch({ type: 'shape/add', q });
    const box = region && region.querySelector(`[id="${q}.${view.base}.steps.${i}.fromAge"]`);
    if (box) box.focus();
  };
  // the steps are put in order of age once the keyboard leaves them (today's editor sorts too), never while a person is
  // still moving through a row: the boxes would change places under them
  const sortOnLeave = (e) => {
    const list = e.currentTarget;
    if (e.relatedTarget && list.contains(e.relatedTarget)) return;
    dispatch({ type: 'shape/sort', q });
  };
  const blockId = `${q}.shape.block`;
  return (
    <section class={`block shape${view.open ? ' is-open' : ''}`} data-region="shape" data-testid={`${q}.shape`} aria-labelledby={`${q}.shape.legend`}
      data-shaped={view.shaped ? 'yes' : 'no'}>
      {level === 3
        ? <h3 id={`${q}.shape.legend`} class="shape-legend">{SHAPE.legend}</h3>
        : <h2 id={`${q}.shape.legend`} class="shape-legend">{SHAPE.legend}</h2>}
      {!view.open && <Summary view={view} />}
      {!forceOpen && (
        <p>
          <Button testid={`${q}.shape.open`} aria-expanded={view.open ? 'true' : 'false'} aria-controls={view.open ? blockId : undefined} onClick={toggle}>
            {view.open ? SHAPE.close : SHAPE.open}
          </Button>
        </p>
      )}
      {view.open && (
        <div class="shape-body" id={blockId}>
          <p class="note shape-lead">{view.unit === 'share' ? SHAPE.leadC : SHAPE.lead}</p>
          <div class="shape-actions">
            <Button testid={`${q}.shape.suggest`} onClick={() => dispatch({ type: 'shape/suggest', q })}>{SHAPE.suggest}</Button>
            <p class="shape-presets">
              <span>{SHAPE.presets}</span>{' '}
              <Button testid={`${q}.shape.preset.level`} kind="quiet" onClick={() => dispatch({ type: 'shape/preset', q, id: 'level' })}>{SHAPE.presetLevel}</Button>{' '}
              <Button testid={`${q}.shape.preset.slowly`} kind="quiet" aria-describedby={`${q}.shape.slowly.help`}
                onClick={() => dispatch({ type: 'shape/preset', q, id: 'slowly' })}>{SHAPE.presetSlowly}</Button>
            </p>
            <p class="note" id={`${q}.shape.slowly.help`}>{SHAPE.presetSlowlyHelp}</p>
          </div>
          <Note view={view} dispatch={dispatch} />
          <ol class="shape-steps" onFocusOut={sortOnLeave}>
            <FirstRow view={view} dispatch={dispatch} />
            {view.steps.map((step, i) => <StepRow key={i} view={view} step={step} i={i} dispatch={dispatch} />)}
          </ol>
          {view.stepsError && <p class="error" data-error-for={`${q}.shape.add`} data-testid={`${q}.shape.tooMany`}>{E.steps.tooMany}</p>}
          <p class="shape-add-row">
            <Button testid={`${q}.shape.add`} onClick={add}>{SHAPE.add}</Button>
            {view.rescaleDue && <> <Button testid={`${q}.shape.rescale`} kind="quiet" onClick={() => dispatch({ type: 'shape/rescale', q })}>{SHAPE.rescale}</Button></>}
          </p>
          {view.rescaleDue && <p class="note" data-testid={`${q}.shape.rescaleNote`}>{SHAPE.rescaleNote}</p>}
          {view.below && <p class="notice shape-below" data-testid={`${q}.shape.below`}>{fill(SHAPE.belowEssentials, { age: view.below.age, amount: money(view.below.amount) })}</p>}
          <ShapeChart q={q} chart={view.chart} open={state.ui.open.includes('shapeYears')} dispatch={dispatch} />
        </div>
      )}
    </section>
  );
}
