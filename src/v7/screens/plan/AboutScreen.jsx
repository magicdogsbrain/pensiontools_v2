/**
 * "About you and when" (research/v7/editing-in-v7.md 2, 4): the first editing step of a saved plan in V7. Each fact asked
 * once, by age; the saved value and its source beside each box; the derived figures shown, never asked; problems in plain
 * words; Save and Cancel; after a save the Undo toast. A locked plan, or one shown as saved, is read-only here: figures,
 * "Fixed when you locked the plan on …", the unlock sentence once. Draws only: everything is the reading's
 * (state/select.js aboutView, from answers/plan/about.js through the plan source).
 */
import { PlanRail, EditField, UndoToast, fill, Button, LinkButton } from '../../components/index.js';
import { planView, aboutView } from '../../state/select.js';
import { href } from '../../router/routes.js';
import { PLAN } from '../../copy/plan.js';
import { ABOUT } from '../../copy/about.js';

const w = PLAN.page;

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

/** The derived figures (2): shown, never asked. */
function Derived({ about }) {
  return (
    <section class="plan-section about-derived" data-section="derived">
      <h3>{ABOUT.derivedTitle}</h3>
      <ul class="plan-lines">
        {about.derived.map((d, i) => <li key={i} class="plan-line" data-line={'about.' + d.id}>{fill(ABOUT.derived[d.id] || '', d.slots)}</li>)}
      </ul>
    </section>
  );
}

function Partners({ about }) {
  if (!about.partners.length) return null;
  return (
    <section class="plan-section" data-section="partners">
      {about.partners.map((p) => (
        <p class="note" key={p.id} data-testid="plan.about.partner">{fill(ABOUT.partner, { name: p.name })} <a href={href.plan(p.id, 'about')}>{fill(ABOUT.partnerLink, { name: p.name })}</a></p>
      ))}
    </section>
  );
}

const toastText = (toast) => (toast.kind === 'undone' ? ABOUT.toast.undone : toast.kind === 'unchanged' ? ABOUT.toast.unchanged : toast.line ? fill(ABOUT.toast.saved, toast.line.slots) : ABOUT.toast.savedShort);

export function AboutScreen(state, dispatch) {
  const view = planView(state);
  const about = aboutView(state);
  const list = view.found ? null : (state.plans ? state.plans.status : 'none');
  if (!view.found || !about.found) {
    const waiting = list === 'none' || list === 'checking' || list === 'reading' || (view.found && !about.found);
    return {
      question: null, rail: false, full: false,
      content: (
        <>
          <h1 tabIndex={-1}>{ABOUT.title}</h1>
          {waiting ? <p class="lead" role="status" data-testid="plan.opening">{PLAN.list.opening}</p>
            : state.session.kind === 'nobody' && (!state.plans || !state.plans.list.length) ? <p class="lead" data-testid="plan.signIn">{PLAN.list.signIn} <a href={href.plans()}>{PLAN.list.toPlans}</a></p>
              : <p class="lead" data-testid="plan.unknown">{PLAN.list.unknown} <a href={href.plans()}>{PLAN.list.toPlans}</a></p>}
        </>
      )
    };
  }
  const planId = about.id;
  const onChange = (place, id = view.id) => dispatch({ type: 'plan/change', planId: id, place, back: href.plan(view.id, 'about') });
  const back = href.plan(view.id, 'plan');
  const slots = { yearNow: about.yearNow, yearApril: about.yearApril, yearSaved: about.yearSaved || '', min: about.minYears, minAge: about.endAgeMin };
  const field = (path) => about.fields.find((f) => f.path === path);
  const sourceWords = (src) => (about.locked ? fill(ABOUT.source.locked, { date: about.lockedOn }) : src && src.at ? fill(ABOUT.source.saved, { date: src.at }) : ABOUT.source.savedUndated);
  const sourceText = sourceWords(about.source);
  const F = (path, more = {}) => <EditField f={field(path)} words={ABOUT.fields[path]} errors={ABOUT.errors[path]} source={path === 'age' ? sourceWords(about.ageSource) : sourceText} savedWords={ABOUT.savedValue} planId={planId} dispatch={dispatch} slots={slots} {...more} />;

  // A locked plan, or one shown as saved: the figures, read-only (4).
  if (!about.editable) {
    const saved = about.fields.filter((f) => f.applies && f.saved !== null && !['sex', 'chance'].includes(f.path));
    return {
      question: null, rail: <PlanRail view={view} state={state} dispatch={dispatch} onChange={onChange} />, full: false,
      content: (
        <>
          <Head view={view} />
          <h1 tabIndex={-1} data-testid="plan.step.about">{ABOUT.title}</h1>
          <section class="headline plan-panel" data-region="plan-about" data-editable="0">
            <ul class="plan-lines">
              {saved.map((f) => (
                <li class="plan-line" key={f.path} data-line={'about.saved.' + f.path}>
                  <span class="plan-label">{ABOUT.fields[f.path].label}: </span>
                  <span class="plan-value" data-saved-for={f.path}>{f.type === 'choice' ? fill(ABOUT.fields[f.path].options[f.saved] || f.saved, slots) : f.saved}</span>
                </li>
              ))}
            </ul>
            {about.locked ? <p class="note plan-fixed" data-testid="plan.about.fixed">{fill(w.fixed, { date: about.lockedOn })}</p> : <p class="notice" role="status">{ABOUT.readonly}</p>}
            <Derived about={about} />
            {about.locked && <p class="note" data-testid="plan.unlock">{w.unlock}</p>}
            <Partners about={about} />
          </section>
          <div class="actions-row">
            <LinkButton testid="plan.about.back" kind="quiet" href={back}>{ABOUT.buttons.back}</LinkButton>
          </div>
        </>
      )
    };
  }

  const onSubmit = (e) => {
    e.preventDefault();
    const root = e.currentTarget;
    dispatch({ type: 'plan/save', planId });
    const first = about.fields.find((f) => f.applies && about.errors[f.path] && !['sex', 'chance'].includes(f.path));
    if (!first) return;
    const el = root.querySelector(`[id="plan.about.${first.path}"]`) || root.querySelector(`[name="plan.about.${first.path}"]:checked`) || root.querySelector(`[name="plan.about.${first.path}"]`);
    if (el) el.focus();
  };
  const onCancel = () => dispatch({ type: 'plan/cancel', planId });
  const onSuggest = () => { if (about.suggestion) { dispatch({ type: 'plan/edit', planId, path: 'endAge', value: String(about.suggestion.endAge) }); dispatch({ type: 'plan/touch', planId, path: 'endAge' }); } };
  const stoppedNested = {
    age: F('stopAge'),
    month: F('stopMonth')
  };
  const suggest = about.suggestion;
  const notUsed = new Set(about.notUsed || []);
  const problem = about.problem ? (ABOUT.problems[about.problem] || ABOUT.problems.failed) : null;

  return {
    question: null,
    rail: <PlanRail view={view} state={state} dispatch={dispatch} onChange={onChange} />,
    full: false,
    content: (
      <>
        <Head view={view} />
        <h1 tabIndex={-1} data-testid="plan.step.about">{ABOUT.title}</h1>
        <p class="lead">{ABOUT.lead}</p>
        <form class="ask about-form" noValidate onSubmit={onSubmit} data-region="plan-about" data-editable="1">
          {F('age')}
          {notUsed.has('age') && <p class="note">{ABOUT.notUsed}</p>}
          {F('stopped', { nested: stoppedNested })}
          {F('startWhen')}
          {notUsed.has('startWhen') && <p class="note">{ABOUT.notUsed}</p>}
          {F('endAge')}
          {notUsed.has('endAge') && <p class="note">{ABOUT.notUsed}</p>}
          <fieldset class="field about-suggest" data-field="suggest">
            <legend>{ABOUT.suggest.title}</legend>
            <div class="about-suggest-row">
              {F('sex', { source: null })}
              {F('chance', { source: null })}
            </div>
            <div class="actions-row">
              <Button testid="plan.about.suggest" kind="quiet" onClick={onSuggest} disabled={!suggest}>{ABOUT.suggest.button}</Button>
              {suggest && suggest.applied && <span class="note" data-testid="plan.about.suggested">{fill(ABOUT.suggest.result[suggest.slots.chance] || ABOUT.suggest.result[10], suggest.slots)}</span>}
            </div>
            <p class="help">{ABOUT.suggest.note}</p>
          </fieldset>
          <Derived about={about} />
          <Partners about={about} />
          {problem && <p class="notice" role="alert" data-testid="plan.about.problem" data-problem={about.problem}>{problem}</p>}
          <div class="actions-row about-actions">
            <Button testid="plan.about.save" kind="primary" type="submit" disabled={!!about.saving}>{about.saving ? ABOUT.saving : ABOUT.buttons.save}</Button>
            <Button testid="plan.about.cancel" kind="quiet" onClick={onCancel}>{ABOUT.buttons.cancel}</Button>
            <LinkButton testid="plan.about.back" kind="quiet" href={back}>{ABOUT.buttons.back}</LinkButton>
          </div>
        </form>
        <UndoToast toast={about.toast} text={about.toast ? toastText(about.toast) : ''} words={ABOUT.buttons}
          onUndo={() => dispatch({ type: 'plan/undo', planId })} onClose={() => dispatch({ type: 'plan/toastClose' })} />
      </>
    )
  };
}
