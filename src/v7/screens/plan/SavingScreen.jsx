/**
 * "What you pay in" on a saved plan (research/v7/road-to-7.md step 11b): the saving rail step made real — the planner's
 * Accumulation page in V7. The boxes (what you pay in, your employer's part, into ISAs and savings, the yearly rise, how tax
 * relief is given and your salary, the pot today) with Save, Cancel and the Undo toast; "How tax relief works, and your
 * salary" as a closed block with the person's own figures; what the pot could be by the stop at the regulator's three rates and
 * at the mix you hold; the rule warnings; "Record this month's pot" (one write, nothing deleted); "Am I on course?" handed to
 * the planner. Draws only: everything is the reading's (state/select.js planSavingView: answers/plan/saving.js through the
 * plan source). No figure is worked out here.
 */
import { PlanRail, EditField, UndoToast, fill, Button, LinkButton } from '../../components/index.js';
import { planView, planSavingView } from '../../state/select.js';
import { href } from '../../router/routes.js';
import { PLAN } from '../../copy/plan.js';
import { SAVING as W } from '../../copy/saving.js';

const w = PLAN.page;
const keepFocus = { onMouseDown: (e) => e.preventDefault() };
const T = 'plan.saving';

function Head({ view }) {
  return (
    <div class="plan-head">
      <p class="plan-kicker">{w.title} <span class="plan-name">‘{view.name}’</span></p>
      <p class="plan-stage-line" data-testid="plan.stageLine">{view.line ? fill(PLAN.stageLines[view.line.id], view.line.slots) : ''}{view.lockedOn ? ' ' + fill(w.lockedOn, { date: view.lockedOn }) : ''}</p>
      {view.readonly && <p class="notice" role="status" data-testid="plan.readonly">{w.shownAsSaved}</p>}
      {view.source === 'window' && <p class="note" data-testid="plan.windowWarning">{w.windowWarning}</p>}
    </div>
  );
}

/** "How tax relief works, and your salary": a closed block with the person's own figures (save.relief). */
function Relief({ V, open, dispatch }) {
  return (
    <section class="plan-section saving-relief" data-section="relief" data-testid={`${T}.relief`}>
      <h3>{W.sections.relief}</h3>
      <div class="actions-row"><Button testid={`${T}.relief.open`} kind="quiet" aria-expanded={open ? 'true' : 'false'} aria-controls={open ? `${T}.relief.box` : undefined} onClick={() => dispatch({ type: 'ui/toggle', id: 'savingRelief' })} {...keepFocus}>{open ? w.close : W.sections.relief}</Button></div>
      {open && (
        <div id={`${T}.relief.box`} data-testid={`${T}.relief.box`}>
          <p class="note">{W.relief.lead}</p>
          <ul class="plan-lines">{V.relief.map((l, i) => <li key={i} class="plan-line" data-line={l.id}>{fill(W.relief[l.id] || '', l.slots)}</li>)}</ul>
        </div>
      )}
    </section>
  );
}

/** What the pot could be by the stop (save.escalation rides in the rows; save.own-mix the "Your mix" column). */
function Pot({ V }) {
  const P = W.pot;
  if (!V.ages.known) return <p class="notice" role="status" data-testid={`${T}.pot.noAges`}>{W.agesNone}</p>;
  if (!V.ages.stillSaving) return <p class="note" data-testid={`${T}.pot.stopped`}>{W.stopped}</p>;
  return (
    <section class="plan-section saving-pot" data-section="pot" data-testid={`${T}.pot`} data-mix={V.mix ? '1' : '0'}>
      <h3>{W.sections.pot}</h3>
      <p class="note">{fill(P.lead, V.rates)}</p>
      <p class="note" data-testid={`${T}.pot.potNow`}>{fill(V.potNow.fromHoldings ? P.potNowHoldings : P.potNow, V.potNow)}</p>
      {V.mix && <p class="note" data-testid={`${T}.pot.mix`}>{fill(P.mix, { ...V.mix, mix: V.rates.mix })}{V.rates.charges ? ' ' + fill(P.mixCharge, V.mix) : ''}</p>}
      <div class="table-wrap">
        <table class="way-table saving-table" data-testid={`${T}.pot.table`}>
          <thead><tr><th scope="col">{P.columns.age}</th><th scope="col">{P.columns.low}</th><th scope="col">{P.columns.mid}</th>{V.mix && <th scope="col">{P.columns.mix}</th>}<th scope="col">{P.columns.high}</th><th scope="col">{P.columns.paidIn}</th>{V.isaLine && <th scope="col">{P.columns.isa}</th>}</tr></thead>
          <tbody>
            {V.rows.map((r) => (
              <tr key={r.age} data-age={r.age} class={r.last ? 'is-last' : undefined} data-low={r.raw.low} data-mid={r.raw.mid} data-high={r.raw.high} data-mix={r.raw.mix == null ? undefined : r.raw.mix}>
                <th scope="row">{r.age}</th><td>{r.low}</td><td>{r.mid}</td>{V.mix && <td>{r.mix}</td>}<td>{r.high}</td><td>{r.paidIn}</td>{V.isaLine && <td>{r.isa}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p class="note" data-testid={`${T}.pot.charges`}>{V.rates.charges ? fill(P.charges, V.rates) : P.chargesNone}</p>
      {V.isaLine && <p class="note" data-testid={`${T}.pot.isa`}>{fill(P.isa[V.isaHow] || P.isa.before, { isaMonthly: V.isaMonthly })}</p>}
      {V.warnings.length > 0 && <ul class="plan-lines" data-testid={`${T}.pot.warnings`}>{V.warnings.map((id) => <li key={id} class="plan-line notice" data-warning={id}>{P.warnings[id]}</li>)}</ul>}
    </section>
  );
}

/** "Record this month's pot" (save.pot-record): the boxes and "Record it"; the records, newest first. */
function Records({ V, planId, dispatch, F }) {
  const R = W.records;
  return (
    <section class="plan-section saving-records" data-section="records" data-testid={`${T}.records`} data-count={V.recordsCount}>
      <h3>{W.sections.records}</h3>
      <p class="note">{R.lead}</p>
      {V.editable && (
        <div class="saving-record-boxes">
          {F('record.month')}
          {F('record.pension')}
          {F('record.isa')}
          {F('record.gia')}
          <div class="actions-row">
            <Button testid={`${T}.record`} kind="plain" onClick={() => dispatch({ type: 'plan/record', planId })} disabled={!!V.saving} {...keepFocus}>{R.button}</Button>
            {V.recordProblem && <span class="error" data-testid={`${T}.record.problem`}>{W.errors['record.pension'][V.recordProblem] || W.errors['record.month'][V.recordProblem] || W.problems.problems}</span>}
          </div>
        </div>
      )}
      {V.records.length === 0 && <p class="note" data-testid={`${T}.records.none`}>{R.none}</p>}
      {V.records.length > 0 && (
        <div class="table-wrap">
          <table class="way-table saving-table" data-testid={`${T}.records.table`}>
            <thead><tr><th scope="col">{R.columns.month}</th><th scope="col">{R.columns.pension}</th><th scope="col">{R.columns.isa}</th><th scope="col">{R.columns.gia}</th><th scope="col">{R.columns.total}</th></tr></thead>
            <tbody>{V.records.map((r) => <tr key={r.date} data-month={r.date}><th scope="row">{r.month}</th><td>{r.pension}</td><td>{r.isa == null ? '—' : r.isa}</td><td>{r.gia}</td><td>{r.total}</td></tr>)}</tbody>
          </table>
        </div>
      )}
      {V.recordsCount > 36 && <p class="note">{fill(R.more, { n: String(V.recordsCount), s: 's' })}</p>}
    </section>
  );
}

const toastText = (toast) => {
  if (toast.kind === 'undone') return W.toast.undone;
  if (toast.kind === 'unchanged') return W.toast.unchanged;
  const line = toast.line;
  if (line && W.toast[line.id]) return fill(W.toast[line.id], line.slots || {});
  return W.toast.savedShort;
};

export function SavingScreen(state, dispatch) {
  const view = planView(state);
  const V = planSavingView(state);
  const list = view.found ? null : (state.plans ? state.plans.status : 'none');
  if (!view.found || !V.found) {
    const waiting = list === 'none' || list === 'checking' || list === 'reading' || (view.found && !V.found);
    return {
      question: null, rail: false, full: false,
      content: (
        <>
          <h1 tabIndex={-1}>{W.title}</h1>
          {waiting ? <p class="lead" role="status" data-testid="plan.opening">{PLAN.list.opening}</p>
            : state.session.kind === 'nobody' && (!state.plans || !state.plans.list.length) ? <p class="lead" data-testid="plan.signIn">{PLAN.list.signIn} <a href={href.plans()}>{PLAN.list.toPlans}</a></p>
              : <p class="lead" data-testid="plan.unknown">{PLAN.list.unknown} <a href={href.plans()}>{PLAN.list.toPlans}</a></p>}
        </>
      )
    };
  }
  const planId = V.id;
  const onChange = (place, id = view.id) => dispatch({ type: 'plan/change', planId: id, place, back: href.plan(view.id, 'saving') });
  const rail = <PlanRail view={view} state={state} dispatch={dispatch} onChange={onChange} />;
  const back = href.plan(view.id, 'plan');
  const step = view.steps.find((s) => s.id === 'saving') || null;
  const field = (path) => V.fields.find((f) => f.path === path);
  const sourceText = V.savedAt ? fill(W.source.saved, { date: V.savedAt }) : W.source.savedUndated;
  const F = (path, more = {}) => <EditField step="saving" f={field(path)} words={W.fields[path]} errors={W.errors[path]} source={path.startsWith('record.') ? null : sourceText} savedWords={W.savedValue} planId={planId} dispatch={dispatch} {...more} />;
  const problem = V.problem ? (W.problems[V.problem] || W.problems.failed) : null;
  const onSubmit = (e) => {
    e.preventDefault();
    const root = e.currentTarget;
    dispatch({ type: 'plan/save', planId });
    const firstPath = Object.keys(V.errors).find((p) => !p.startsWith('record.'));
    if (!firstPath) return;
    const el = root.querySelector(`[id="plan.saving.${firstPath}"]`) || root.querySelector(`[name="plan.saving.${firstPath}"]:checked`) || root.querySelector(`[name="plan.saving.${firstPath}"]`);
    if (el) el.focus();
  };
  const onCancel = () => dispatch({ type: 'plan/cancel', planId });
  return {
    question: null, rail, full: false,
    content: (
      <>
        <Head view={view} />
        <h1 tabIndex={-1} data-testid="plan.step.saving">{W.title}</h1>
        {step && !step.listed && <p class="note" data-testid="plan.notListed">{w.notListed}</p>}
        <p class="lead">{W.lead}</p>
        {V.ages.known && <p class="note" data-testid={`${T}.ages`}>{fill(W.ages, { ...V.ages, s: V.ages.years === 1 ? '' : 's' })}</p>}
        {V.locked && <p class="note" data-testid={`${T}.notFrozen`}>{W.notFrozen}</p>}
        {V.readonly && <p class="notice" role="status" data-testid={`${T}.readonly`}>{W.readonly}</p>}
        <form class="ask about-form income-form saving-form" noValidate onSubmit={onSubmit} data-region="plan-saving" data-editable={V.editable ? '1' : '0'}>
          {V.editable ? (
            <section class="income-section" data-section="payIn">
              <h2>{W.sections.payIn}</h2>
              {F('netMonthly')}
              {F('employerMonthly')}
              {F('isaMonthly')}
              {F('escalationPct')}
              {F('schemeType')}
              {F('salary')}
              {F('potNow')}
              {problem && <p class="notice" role="alert" data-testid={`${T}.problem`} data-problem={V.problem}>{problem}</p>}
              <div class="actions-row about-actions">
                <Button testid={`${T}.save`} kind="primary" type="submit" disabled={!!V.saving} {...keepFocus}>{V.saving && V.saving.kind === 'save' ? W.saving : W.buttons.save}</Button>
                <Button testid={`${T}.cancel`} kind="quiet" onClick={onCancel} {...keepFocus}>{W.buttons.cancel}</Button>
              </div>
            </section>
          ) : (
            <section class="income-section" data-section="payIn">
              <h2>{W.sections.payIn}</h2>
              <ul class="plan-lines">
                {['netMonthly', 'employerMonthly', 'isaMonthly', 'escalationPct', 'salary', 'potNow'].map((p) => { const f = field(p); return f && f.saved ? <li key={p} class="plan-line" data-line={'saving.' + p}>{W.fields[p].label}: {f.saved}</li> : null; })}
                <li class="plan-line" data-line="saving.schemeType">{W.fields.schemeType.label}: {W.fields.schemeType.options[V.scheme]}</li>
              </ul>
            </section>
          )}
          <Relief V={V} open={state.ui.open.includes('savingRelief')} dispatch={dispatch} />
          <Pot V={V} />
          <Records V={V} planId={planId} dispatch={dispatch} F={F} />
          <section class="plan-section" data-section="onCourse">
            <h3>{W.sections.onCourse}</h3>
            <p class="note">{W.onCourse.lead}</p>
            {!V.readonly && <div class="actions-row"><Button testid={`${T}.onCourse`} kind="plain" onClick={() => onChange('onCourse')}>{W.onCourse.button}</Button></div>}
          </section>
        </form>
        <div class="actions-row">
          <LinkButton testid={`${T}.back`} kind="quiet" href={back}>{W.buttons.back}</LinkButton>
        </div>
        <UndoToast prefix={T} toast={V.toast} text={V.toast ? toastText(V.toast) : ''} words={W.buttons}
          onUndo={() => dispatch({ type: 'plan/undo', planId })} onClose={() => dispatch({ type: 'plan/toastClose' })} />
      </>
    )
  };
}
