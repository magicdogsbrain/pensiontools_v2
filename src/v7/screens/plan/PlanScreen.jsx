/**
 * "Your plan" (research/v7/your-plan.md 1.3, 2.3, 2.5): one saved plan on one step of its life stage — the step's
 * figures with their sources, its buttons, and, on "Your plan", the settings as sections with "Everything else this plan
 * uses". Nothing typeable; nothing worked out here (state/select.js planView). "Change this" leaves for the planner by
 * the hand-over (plan/change); without an account the warning says what to press there.
 */
import { PlanRail, PlanLine, PlanSentence, PlanButtons, fill, Button, LinkButton, Money } from '../../components/index.js';
import { planView, plansView } from '../../state/select.js';
import { href } from '../../router/routes.js';
import { PLAN } from '../../copy/plan.js';

const w = PLAN.page;

function Section({ section, view, onChange }) {
  const title = PLAN.sections[section.id];
  return (
    <section class="plan-section" data-section={section.id}>
      <h3>{title}</h3>
      {section.lines.length ? <ul class="plan-lines">{section.lines.map((l, i) => <PlanLine key={i} line={l} figures={view.figures} hideSource />)}</ul> : null}
      {view.lockedOn ? <p class="note plan-fixed">{fill(w.fixed, { date: view.lockedOn })}</p>
        : view.readonly ? null
          : <div class="actions-row"><Button testid={`plan.plan.change.${section.id}`} onClick={() => onChange(section.place)}>{w.changeThis}</Button></div>}
    </section>
  );
}

function Fact({ rowId, f }) {
  const label = (PLAN.options[rowId] && PLAN.options[rowId].facts[f.k.replace(/\d+$/, '')]) || f.k;
  const key = `options.${rowId}.${f.k}`;
  let value;
  if (f.kind === 'yesNo') value = <span data-key={key} data-value={f.v ? 1 : 0}>{f.v ? PLAN.yes : PLAN.no}</span>;
  else if (f.kind === 'choice') value = <span data-key={key} data-choice={f.v}>{PLAN.choices[f.v] || f.v}</span>;
  else if (f.kind === 'text') value = <span data-key={key} data-text={f.v}>{f.v || '—'}</span>;
  else value = <Money source={{ v: f.v }} k="v" kind={f.kind} />;
  return <span class="plan-fact">{label}: {value}</span>;
}

function Options({ step, view, open, dispatch, onChange }) {
  const rows = open ? step.allOptions : step.options;
  return (
    <section class="plan-section plan-options" data-section="else">
      <h3>{PLAN.sections.else}</h3>
      {!open && !rows.length && <p class="note">{w.noneChanged}</p>}
      <ul class="plan-lines">
        {rows.map((r) => (
          <li class="plan-line" key={r.id} data-option={r.id} data-set={r.set ? '1' : '0'}>
            <span class="plan-label">{(PLAN.options[r.id] && PLAN.options[r.id].name) || r.id}.</span>{' '}
            {r.facts.map((f, i) => <span key={i}>{i > 0 ? '; ' : ''}<Fact rowId={r.id} f={f} /></span>)}
            {!r.facts.length && <span class="note">—</span>}
          </li>
        ))}
      </ul>
      <div class="actions-row">
        <Button testid="plan.plan.allOptions" kind="quiet" aria-expanded={open ? 'true' : 'false'} onClick={() => dispatch({ type: 'ui/toggle', id: 'allOptions' })}>{open ? w.hideAll : w.showAll}</Button>
        {view.lockedOn ? <span class="note plan-fixed">{fill(w.fixed, { date: view.lockedOn })}</span>
          : view.readonly ? null : <Button testid="plan.plan.change.else" onClick={() => onChange('settings')}>{w.changeThis}</Button>}
      </div>
    </section>
  );
}

export function PlanScreen(state, dispatch) {
  const view = planView(state);
  const list = plansView(state);
  const onChange = (place, planId = view.id) => dispatch({ type: 'plan/change', planId, place, back: href.plan(view.id, view.current) });
  if (!view.found) {
    const waiting = list.status === 'none' || list.status === 'checking' || list.status === 'reading';
    return {
      question: null, rail: false, full: false,
      content: (
        <>
          <h1 tabIndex={-1}>{w.title}</h1>
          {waiting ? <p class="lead" role="status" data-testid="plan.opening">{PLAN.list.opening}</p>
            : list.session.kind === 'nobody' && list.count === 0 ? <p class="lead" data-testid="plan.signIn">{PLAN.list.signIn} <a href={href.plans()}>{PLAN.list.toPlans}</a></p>
              : <p class="lead" data-testid="plan.unknown">{PLAN.list.unknown} <a href={href.plans()}>{PLAN.list.toPlans}</a></p>}
        </>
      )
    };
  }
  const step = view.steps.find((s) => s.id === view.current) || view.steps[0];
  const stepName = step.id === 'plan' && view.locked ? PLAN.steps.plan.locked : PLAN.steps[step.id].label;
  const allOpen = state.ui.open.includes('allOptions');
  return {
    question: null,
    rail: <PlanRail view={view} state={state} dispatch={dispatch} onChange={onChange} />,
    full: false,
    content: (
      <>
        <div class="plan-head">
          <p class="plan-kicker">{w.title} <span class="plan-name">‘{view.name}’</span></p>
          <p class="plan-stage-line" data-testid="plan.stageLine">{view.line ? fill(PLAN.stageLines[view.line.id], view.line.slots) : ''}{view.lockedOn ? ' ' + fill(w.lockedOn, { date: view.lockedOn }) : ''}</p>
          {view.readonly && <p class="notice" role="status" data-testid="plan.readonly">{w.shownAsSaved}</p>}
          {view.source === 'window' && <p class="note" data-testid="plan.windowWarning">{w.windowWarning}</p>}
          {state.ui.leaveProblem && <p class="notice" role="alert">{fill(w.leaveProblem, { name: view.name })}</p>}
        </div>
        <h1 tabIndex={-1} data-testid={`plan.step.${step.id}`}>{stepName}{step.optional && <span class="rail-optional"> ({w.optional})</span>}</h1>
        {!step.listed && <p class="note" data-testid="plan.notListed">{w.notListed}</p>}
        <section class="headline plan-panel" data-region="plan-step">
          <p class="line"><PlanSentence s={step.result} figures={step.figures} data-testid={`plan.${step.id}.result`} /></p>
          {step.lines.length > 0 && <ul class="plan-lines">{step.lines.map((l, i) => <PlanLine key={i} line={l} figures={step.figures} />)}</ul>}
          {step.notes.map((n, i) => (typeof n === 'string'
            ? <p class="note" key={i}>{PLAN.notes[n] || ''}</p>
            : <p class="note" key={i}>{n.id === 'prices' ? fill(w.prices, n.slots) : n.id === 'pricesToday' ? w.pricesToday : ''}</p>))}
          {step.id === 'plan' && step.sections && (
            <>
              {step.sections.map((sec) => <Section key={sec.id} section={sec} view={{ figures: step.figures, lockedOn: view.lockedOn, readonly: view.readonly }} onChange={onChange} />)}
              <Options step={step} view={{ lockedOn: view.lockedOn, readonly: view.readonly }} open={allOpen} dispatch={dispatch} onChange={onChange} />
              {view.locked && <p class="note" data-testid="plan.unlock">{w.unlock}</p>}
              {view.locked && step.pastVersions > 0 && <p class="note">{fill(w.pastVersions, { n: String(step.pastVersions) })}</p>}
              {step.journey && step.journey.length > 0 && (
                <div class="plan-journey">
                  <h3>{w.journeyTitle}</h3>
                  <ul class="plan-lines">{step.journey.map((j, i) => <li key={i} class="plan-line">{j.arrival ? fill(w.journeyArrival, { date: j.on }) : (PLAN.stageLines[j.stage === 'bridge' ? 'bridge-plan' : j.stage] ? fill(PLAN.stageLines[j.stage === 'bridge' ? 'bridge-plan' : j.stage], { month: '' }).replace(/ from \.$/, '.').replace(/ until \.$/, '.') : j.stage) + ' — ' + j.on}</li>)}</ul>
                </div>
              )}
            </>
          )}
          <PlanButtons buttons={step.buttons} planId={view.id} stepId={step.id} onChange={onChange} readonly={view.readonly} />
        </section>
        <div class="actions-row">
          <LinkButton testid="plan.toPlans" kind="quiet" href={href.plans()}>{PLAN.list.toPlans}</LinkButton>
        </div>
      </>
    )
  };
}
