/**
 * "Your pots and tax" (research/v7/editing-in-v7.md 9): the fourth editing step of a saved plan in V7. The pension pot
 * today (and, stopping later, the pots at the day you stop), the ISAs and how they grow and are used, the ordinary account,
 * charges, the tax bands and the tax-free part — each once, with its saved value and source beside it; what it works out to
 * shown, never asked; the split and the funds left to the way of drawing and mix, and the page says so. Save, Cancel and
 * after a save the Undo toast. A locked plan, or one shown as saved, is read-only here. Draws only: everything is the
 * reading's (state/select.js planPotsView, from answers/plan/pots.js through the plan source).
 */
import { PlanRail, EditField, UndoToast, fill, Button, LinkButton } from '../../components/index.js';
import { planView, planPotsView } from '../../state/select.js';
import { href } from '../../router/routes.js';
import { PLAN } from '../../copy/plan.js';
import { POTS } from '../../copy/pots.js';

const w = PLAN.page;
/** A button that does not take the focus on mousedown (IncomeScreen): the box being typed in keeps it. */
const keepFocus = { onMouseDown: (e) => e.preventDefault() };

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

/** Ids in a line's slots drawn by their words. */
function worded(id, slots) {
  if (id === 'tax.bands') return { ...slots, mode: POTS.modes[slots.mode] || slots.mode };
  if (id === 'tax.free.ufpls') return { ...slots, years: slots.years ? fill(POTS.ufplsYears.some, { years: slots.years }) : POTS.ufplsYears.whole, then: POTS.ufplsThen[slots.then] || '' };
  return slots;
}

/** The derived figures (9.2): shown, never asked. */
function Derived({ pt }) {
  return (
    <section class="plan-section about-derived" data-section="derived">
      <h3>{POTS.derivedTitle}</h3>
      <ul class="plan-lines">
        {pt.derived.map((d, i) => <li key={i} class="plan-line" data-line={'pots.' + d.id}>{fill(POTS.derived[d.id] || '', worded(d.id, d.slots))}</li>)}
      </ul>
    </section>
  );
}

function Partners({ pt }) {
  if (!pt.partners.length) return null;
  return (
    <section class="plan-section" data-section="partners">
      {pt.partners.map((p) => (
        <p class="note" key={p.id} data-testid="plan.pots.partner">{fill(POTS.partner, { name: p.name })} <a href={href.plan(p.id, 'pots')}>{fill(POTS.partnerLink, { name: p.name })}</a></p>
      ))}
    </section>
  );
}

const toastText = (toast) => {
  if (toast.kind === 'undone') return POTS.toast.undone;
  if (toast.kind === 'unchanged') return POTS.toast.unchanged;
  if (!toast.line) return POTS.toast.savedShort;
  return fill(POTS.toast.saved, toast.line.slots);
};

export function PotsScreen(state, dispatch) {
  const view = planView(state);
  const pt = planPotsView(state);
  const list = view.found ? null : (state.plans ? state.plans.status : 'none');
  if (!view.found || !pt.found) {
    const waiting = list === 'none' || list === 'checking' || list === 'reading' || (view.found && !pt.found);
    return {
      question: null, rail: false, full: false,
      content: (
        <>
          <h1 tabIndex={-1}>{POTS.title}</h1>
          {waiting ? <p class="lead" role="status" data-testid="plan.opening">{PLAN.list.opening}</p>
            : state.session.kind === 'nobody' && (!state.plans || !state.plans.list.length) ? <p class="lead" data-testid="plan.signIn">{PLAN.list.signIn} <a href={href.plans()}>{PLAN.list.toPlans}</a></p>
              : <p class="lead" data-testid="plan.unknown">{PLAN.list.unknown} <a href={href.plans()}>{PLAN.list.toPlans}</a></p>}
        </>
      )
    };
  }
  const planId = pt.id;
  const onChange = (place, id = view.id) => dispatch({ type: 'plan/change', planId: id, place, back: href.plan(view.id, 'pots') });
  const back = href.plan(view.id, 'plan');
  const field = (path) => pt.fields.find((f) => f.path === path);
  const sourceText = pt.locked ? fill(POTS.source.locked, { date: pt.lockedOn }) : pt.source && pt.source.at ? fill(POTS.source.saved, { date: pt.source.at }) : POTS.source.savedUndated;
  const notUsed = new Set(pt.notUsed || []);
  /** A box, with the planner's note under it where this way of drawing ignores it or sizes it elsewhere. */
  const F = (path, more = {}) => (
    <>
      <EditField step="pots" f={field(path)} words={POTS.fields[path]} errors={POTS.errors[path]} source={sourceText} savedWords={POTS.savedValue} planId={planId} dispatch={dispatch} {...more} />
      {field(path).applies && notUsed.has(path) && <p class="note" data-not-used={path}>{POTS.notUsed}</p>}
      {pt.useNotes[path] && <p class="note" data-use-note={path}>{POTS.useNotes[pt.useNotes[path]]}</p>}
    </>
  );

  // A locked plan, or one shown as saved: the figures, read-only (9.4).
  if (!pt.editable) {
    return {
      question: null, rail: <PlanRail view={view} state={state} dispatch={dispatch} onChange={onChange} />, full: false,
      content: (
        <>
          <Head view={view} />
          <h1 tabIndex={-1} data-testid="plan.step.pots">{POTS.title}</h1>
          <section class="headline plan-panel" data-region="plan-pots" data-editable="0">
            <Derived pt={pt} />
            {pt.locked ? <p class="note plan-fixed" data-testid="plan.pots.fixed">{fill(w.fixed, { date: pt.lockedOn })}</p> : <p class="notice" role="status">{POTS.readonly}</p>}
            {pt.locked && <p class="note" data-testid="plan.unlock">{w.unlock}</p>}
            <Partners pt={pt} />
          </section>
          <div class="actions-row">
            <LinkButton testid="plan.pots.back" kind="quiet" href={back}>{POTS.buttons.back}</LinkButton>
          </div>
        </>
      )
    };
  }

  const onSubmit = (e) => {
    e.preventDefault();
    const root = e.currentTarget;
    dispatch({ type: 'plan/save', planId });
    const firstPath = Object.keys(pt.errors).find((p) => (field(p) ? field(p).applies : true));
    if (!firstPath) return;
    const el = root.querySelector(`[id="plan.pots.${firstPath}"]`) || root.querySelector(`[name="plan.pots.${firstPath}"]:checked`) || root.querySelector(`[name="plan.pots.${firstPath}"]`);
    if (el) el.focus();
  };
  const onCancel = () => dispatch({ type: 'plan/cancel', planId });
  const problem = pt.problem ? (POTS.problems[pt.problem] || POTS.problems.failed) : null;

  return {
    question: null,
    rail: <PlanRail view={view} state={state} dispatch={dispatch} onChange={onChange} />,
    full: false,
    content: (
      <>
        <Head view={view} />
        <h1 tabIndex={-1} data-testid="plan.step.pots">{POTS.title}</h1>
        <p class="lead">{POTS.lead}</p>
        <form class="ask about-form income-form pots-form" noValidate onSubmit={onSubmit} data-region="plan-pots" data-editable="1">
          <section class="income-section" data-section="pension">
            <h2>{POTS.sections.pension}</h2>
            <p class="note">{POTS.notes.pension}</p>
            {F('pension')}
            {pt.later && (
              <>
                <h3>{POTS.sections.stop}</h3>
                <p class="note">{POTS.notes.stop}</p>
                {F('stopSipp')}
                {F('stopIsa')}
              </>
            )}
          </section>
          <section class="income-section" data-section="isa">
            <h2>{POTS.sections.isa}</h2>
            {F('isa')}
            {F('isaGrowth')}
            {F('isaUse')}
          </section>
          <section class="income-section" data-section="taxable">
            <h2>{POTS.sections.taxable}</h2>
            <p class="note">{POTS.notes.taxable}</p>
            {F('taxable')}
            {F('taxableMix')}
            {F('giaBand')}
            {F('earnings')}
            {F('bedAndIsa')}
          </section>
          <section class="income-section" data-section="charges">
            <h2>{POTS.sections.charges}</h2>
            <p class="note">{POTS.notes.charges}</p>
            {F('charges')}
          </section>
          <section class="income-section" data-section="tax">
            <h2>{POTS.sections.tax}</h2>
            <p class="note" data-testid="plan.pots.saves">{POTS.notes.tax}</p>
            {F('pa')}
            {F('brl')}
            {F('hrl')}
            {F('taxMode')}
            {F('taxFree', { nested: { ufpls: <>{F('ufplsYears')}{F('ufplsThenIsa')}</> } })}
            {F('bandFill')}
          </section>
          <Derived pt={pt} />
          <Partners pt={pt} />
          {problem && <p class="notice" role="alert" data-testid="plan.pots.problem" data-problem={pt.problem}>{problem}</p>}
          <div class="actions-row about-actions">
            <Button testid="plan.pots.save" kind="primary" type="submit" disabled={!!pt.saving} {...keepFocus}>{pt.saving ? POTS.saving : POTS.buttons.save}</Button>
            <Button testid="plan.pots.cancel" kind="quiet" onClick={onCancel} {...keepFocus}>{POTS.buttons.cancel}</Button>
            <LinkButton testid="plan.pots.back" kind="quiet" href={back}>{POTS.buttons.back}</LinkButton>
          </div>
        </form>
        <UndoToast prefix="plan.pots" toast={pt.toast} text={pt.toast ? toastText(pt.toast) : ''} words={POTS.buttons}
          onUndo={() => dispatch({ type: 'plan/undo', planId })} onClose={() => dispatch({ type: 'plan/toastClose' })} />
      </>
    )
  };
}
