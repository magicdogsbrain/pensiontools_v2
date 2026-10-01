/**
 * The budget step's parts (research/v7/budget-step.md). They draw; they work nothing out — every figure comes from the
 * shell's pure readers (state/select.js: budgetView, spendView, budgetAgainstC) and is written by format.js.
 *
 *   <SpendHow state q dispatch />        "How would you like to work it out?" — line by line (better), or one figure
 *   <BudgetSheet state q dispatch />     the sheet: headings, lines (a month or a year, essential or not), one-off costs,
 *                                        the total a month and a year, the essentials, the national guide levels
 *   <SpendBeside state q dispatch />     beside the spending box: the budget's total and "Use £X a month" — the one way
 *                                        the budget reaches the figure — and the guide levels
 *   <SpendLine state q dispatch />       under an answer of A or B: the spending used, and whether a budget is behind it
 *   <BudgetAgainstC state />             under C's answer, when a budget exists: what the careful amount gives against it
 *
 * The sheet's boxes carry the test ids "budget.<line id>.<field>" (they are not fields of any question's input list).
 */
import { budgetView, spendView, budgetAgainstC, newLineId, newOneOffId } from '../state/select.js';
import { money } from '../../answers/shared/format.js';
import { href } from '../router/routes.js';
import { Button, LinkButton } from './Button.jsx';
import { BUDGET } from '../copy/budget.js';

const fill = (text, values) => String(text).replace(/\{(\w+)\}/g, (m, k) => (k in values ? values[k] : m));
const W = BUDGET.sheet;

/** "How would you like to work it out?" — two radios, outside the input list (they never reach an answer). */
export function SpendHow({ state, q, dispatch }) {
  const { how } = spendView(state, q);
  const id = `${q}.spendHow`;
  return (
    <fieldset class="field field-choice spend-how" data-spend-how={how || undefined}>
      <legend>{BUDGET.spend.howLegend}</legend>
      {['lines', 'one'].map((o) => (
        <div class="option" key={o}>
          <div class="option-row">
            <input type="radio" id={`${id}.${o}`} data-testid={`${id}.${o}`} name={id} value={o} checked={how === o}
              onClick={() => { if (how !== o) dispatch({ type: 'spend/how', q, how: o }); }} onChange={() => {}} />
            <label for={`${id}.${o}`}>{BUDGET.spend.how[o]}<span class="option-help">: {BUDGET.spend.howHelp[o]}</span></label>
          </div>
        </div>
      ))}
    </fieldset>
  );
}

/** One line of the sheet. A starter line's label is the catalogue's; a line added by the person has a box for it. */
function Line({ row, dispatch }) {
  const id = `budget.${row.id}`;
  const set = (field, value) => dispatch({ type: 'budget/line', id: row.id, field, value });
  const touch = (field) => dispatch({ type: 'budget/touch', id: row.id, field });
  const name = row.label.trim() || W.item;
  const help = row.hint !== null && !row.problem ? `${id}.help` : null;
  const err = row.problem ? `${id}.error` : null;
  return (
    <li class={`budget-line${row.problem ? ' has-error' : ''}`} data-line={row.id}>
      <div class="line-name">
        {row.starter
          ? <label for={`${id}.amount`} class="line-label">{row.label}</label>
          : (
            <>
              <label for={`${id}.label`} class="sr-only">{W.item}</label>
              <input type="text" inputmode="text" autocomplete="off" class="line-label-box" id={`${id}.label`} data-testid={`${id}.label`} name={`${id}.label`}
                value={row.label} placeholder={W.item} aria-invalid={row.labelProblem ? 'true' : undefined}
                aria-describedby={row.labelProblem ? `${id}.labelError` : undefined}
                onInput={(e) => set('label', e.currentTarget.value)} onBlur={() => touch('label')} />
              <label for={`${id}.amount`} class="sr-only">{row.label.trim() ? fill(W.amountOf, { name }) : W.amountNew}</label>
            </>
          )}
      </div>
      <div class="line-boxes">
        <div class="box">
          <span class="prefix" aria-hidden="true">£</span>
          <input type="text" inputmode="decimal" autocomplete="off" id={`${id}.amount`} data-testid={`${id}.amount`} name={`${id}.amount`}
            value={row.amount} aria-invalid={row.problem ? 'true' : undefined} aria-describedby={[help, err].filter(Boolean).join(' ') || undefined}
            onInput={(e) => set('amount', e.currentTarget.value)} onBlur={() => touch('amount')} />
        </div>
        <label for={`${id}.period`} class="sr-only">{W.period}</label>
        <select id={`${id}.period`} data-testid={`${id}.period`} name={`${id}.period`} value={row.period} onChange={(e) => set('period', e.currentTarget.value)}>
          <option value="mo">{W.periods.mo}</option>
          <option value="yr">{W.periods.yr}</option>
        </select>
        <div class="check">
          {/* a click, as the radios use: the tick box's new state is already there, in every browser */}
          <input type="checkbox" id={`${id}.essential`} data-testid={`${id}.essential`} name={`${id}.essential`} checked={row.essential}
            onClick={(e) => set('essential', e.currentTarget.checked)} onChange={() => {}} />
          <label for={`${id}.essential`}>{W.essential}</label>
        </div>
        <Button testid={`${id}.remove`} kind="quiet" class="line-remove" aria-label={fill(W.removeOf, { name })} onClick={() => dispatch({ type: 'budget/remove', id: row.id })}>{W.remove}</Button>
      </div>
      {help && <p class="help" id={help}>{fill(W.typical[row.hintPeriod], { amount: money(row.hintAmount) })}</p>}
      {err && <p class="error" id={err} data-error-for={`${id}.amount`}>{W.problems[row.problem]}</p>}
      {row.labelProblem && <p class="error" id={`${id}.labelError`} data-error-for={`${id}.label`}>{W.problems[row.labelProblem]}</p>}
    </li>
  );
}

/** One one-off cost: what it is, the amount, the year, and every how many years (blank: once). */
function OneOff({ row, dispatch }) {
  const id = `budget.${row.id}`;
  const set = (field, value) => dispatch({ type: 'budget/oneOff', id: row.id, field, value });
  const touch = (field) => dispatch({ type: 'budget/touch', id: row.id, field });
  const box = (field, mode, label) => {
    const problem = row.problems[field];
    const err = problem ? `${id}.${field}.error` : null;
    return (
      <div class={`field field-oneoff${problem ? ' has-error' : ''}`}>
        <label for={`${id}.${field}`}>{label}</label>
        <div class="box">
          {field === 'amount' && <span class="prefix" aria-hidden="true">£</span>}
          <input type="text" inputmode={mode} autocomplete="off" id={`${id}.${field}`} data-testid={`${id}.${field}`} name={`${id}.${field}`} value={row[field]}
            aria-invalid={problem ? 'true' : undefined} aria-describedby={err || undefined}
            onInput={(e) => set(field, e.currentTarget.value)} onBlur={() => touch(field)} />
        </div>
        {err && <p class="error" id={err} data-error-for={`${id}.${field}`}>{W.problems[problem]}</p>}
      </div>
    );
  };
  const name = row.label.trim() || W.oneOff.label;
  return (
    <li class="budget-oneoff" data-one-off={row.id}>
      {box('label', 'text', W.oneOff.label)}
      {box('amount', 'decimal', W.oneOff.amount)}
      {box('year', 'numeric', W.oneOff.year)}
      {box('everyYears', 'numeric', W.oneOff.every)}
      <Button testid={`${id}.remove`} kind="quiet" aria-label={fill(W.removeOf, { name })} onClick={() => dispatch({ type: 'budget/removeOneOff', id: row.id })}>{W.remove}</Button>
    </li>
  );
}

/** "+ Add a line": the new line's own box takes the keyboard (the page is drawn as the action is applied). */
function addThen(e, dispatch, action, focusId) {
  const region = e.currentTarget.closest('[data-region="budget"]');
  dispatch(action);
  const el = region && region.querySelector(`[id="${focusId}"]`);
  if (el) el.focus();
}

export function BudgetSheet({ state, q, dispatch }) {
  const v = budgetView(state, q);
  if (!v.exists) return null;
  const who = BUDGET.spend.who[v.household];
  return (
    <section class="block budget" data-region="budget" aria-labelledby="budget-title">
      <h2 id="budget-title">{W.title}</h2>
      <p class="note">{fill(W.intro, { level: W.levelWord[v.level], who })}</p>
      {v.household === 'couple' && <p class="note">{W.couple}</p>}
      {v.headings.map((h) => (
        <section class="budget-heading" key={h.id} data-heading={h.id} aria-labelledby={`budget-${h.id}`}>
          <h3 id={`budget-${h.id}`}>
            {W.headings[h.id]}
            {h.monthly > 0 && <span class="subtotal" data-testid={`budget.${h.id}.subtotal`}> {fill(W.subtotal, { amount: money(h.monthly) })}</span>}
          </h3>
          {h.rows.length > 0 && <ul class="budget-lines">{h.rows.map((r) => <Line key={r.id} row={r} dispatch={dispatch} />)}</ul>}
          <Button testid={`budget.add.${h.id}`} kind="quiet" aria-label={fill(W.addTo, { name: W.headings[h.id] })}
            onClick={(e) => addThen(e, dispatch, { type: 'budget/add', heading: h.id }, `budget.${newLineId(state)}.label`)}>+ {W.add}</Button>
        </section>
      ))}
      <div class="budget-total" data-testid="budget.total" role="status">
        <p class="total-line">{v.has ? fill(W.total, { amount: money(v.totals.monthly), yearly: money(v.totals.yearly) }) : W.noTotal}</p>
        {v.has && <p class="note">{fill(W.essentials, { amount: money(v.totals.essentialMonthly) })}</p>}
        {v.has && <p class="note" data-testid="budget.where">{fill(W.where[v.where], { who })}</p>}
      </div>
      <section class="budget-oneoffs" aria-labelledby="oneoffs-title">
        <h3 id="oneoffs-title">{W.oneOffsTitle}</h3>
        <p class="note">{W.oneOffsNote}</p>
        {v.oneOffs.length > 0 && <ul class="budget-oneoff-list">{v.oneOffs.map((o) => <OneOff key={o.id} row={o} dispatch={dispatch} />)}</ul>}
        <Button testid="budget.addOneOff" kind="quiet" onClick={(e) => addThen(e, dispatch, { type: 'budget/addOneOff' }, `budget.${newOneOffId(state)}.label`)}>+ {W.addOneOff}</Button>
      </section>
    </section>
  );
}

/**
 * Beside the spending box: the budget's total, and "Use £X a month" when the box does not hold it — the one way the
 * budget reaches the figure. Then the national guide levels, as a second guide.
 */
export function SpendBeside({ state, q, dispatch }) {
  const v = spendView(state, q);
  const who = BUDGET.spend.who[budgetView(state, q).household];
  const levels = Object.fromEntries(Object.entries(budgetView(state, q).levels).map(([k, n]) => [k, money(n)]));
  const b = v.budget;
  return (
    <div class="spend-beside">
      {b && (
        <p class="budget-beside" data-testid={`${q}.spend.budget`}>
          {v.figure !== null && b.differs ? fill(BUDGET.spend.budgetNow, { amount: money(b.total), used: money(v.figure) }) : fill(BUDGET.spend.budgetIs, { amount: money(b.total) })}
          {v.figure !== null && !b.differs && <> {BUDGET.spend.budgetSame}</>}
        </p>
      )}
      {b && v.canUse && (
        <p><Button testid={`${q}.spend.use`} onClick={() => dispatch({ type: 'budget/use', q })}>{fill(BUDGET.spend.use, { amount: money(b.total) })}</Button></p>
      )}
      <p class="note" data-testid={`${q}.spend.levels`}>{fill(BUDGET.spend.levels, { who, ...levels })}</p>
    </div>
  );
}

/** Under an answer of A or B: the spending this answer used, and whether a budget is behind it. */
export function SpendLine({ state, q, dispatch }) {
  const v = spendView(state, q);
  if (v.figure === null) return null;
  const A = BUDGET.answer;
  const amount = money(v.figure);
  const toSheet = () => dispatch({ type: 'spend/how', q, how: 'lines' });
  let line;
  let action;
  if (!v.budget) {
    line = v.kind === 'level' ? fill(A.noBudgetLevel, { amount, level: W.levelWord[v.level] }) : fill(A.noBudget, { amount });
    action = <LinkButton testid={`${q}.spend.workItOut`} kind="quiet" href={href.step(q, 'spend')} onClick={toSheet}>{A.workItOut}</LinkButton>;
  } else if (v.budget.differs) {
    line = fill(BUDGET.spend.budgetNow, { amount: money(v.budget.total), used: amount });
    action = v.canUse && <Button testid={`${q}.spend.use`} onClick={() => dispatch({ type: 'budget/use', q })}>{fill(BUDGET.spend.use, { amount: money(v.budget.total) })}</Button>;
  } else {
    line = fill(A.fromBudget, { amount });
    action = <LinkButton testid={`${q}.spend.see`} kind="quiet" href={href.step(q, 'spend')} onClick={toSheet}>{A.changeBudget}</LinkButton>;
  }
  return (
    <section class="spend-line" data-region="spending" data-testid={`${q}.spend.line`} data-budget={v.budget ? 'yes' : 'no'}>
      <p>{line}</p>
      {action && <p>{action}</p>}
    </section>
  );
}

/** Under C's answer, when a budget exists: "Your budget adds up to £2,340 a month. This gives about £490 a month less." */
export function BudgetAgainstC({ state }) {
  const c = budgetAgainstC(state);
  if (!c) return null;
  return (
    <p class="budget-against" data-region="spending" data-testid="c.budget.against" data-direction={c.direction}>
      {fill(BUDGET.answer.c[c.direction], { amount: money(c.total), diff: money(c.diff) })}
    </p>
  );
}
