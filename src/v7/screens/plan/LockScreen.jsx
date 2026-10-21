/**
 * "Lock the plan" (research/v7/road-to-7.md step 6; v6-usability-audit.md 2.6): the rail step made real. Three things in
 * plain words — what the lock fixes, what stays changeable, what you get — a saver's line, one button "Lock this plan",
 * then a confirm step on the same screen (never a browser dialog) with "Lock it" / "Not now". While the lock is under way
 * the plan's own test runs in the worker and the one write follows (effects/planWrite.js); the page then moves to "Your
 * plan as locked" with the Undo toast. A locked plan reached by its address (R7) says "Locked {date}" and links there.
 * Draws only: the facts are the reading's (state/select.js planLockView: read.js lockStep), the write's state is the
 * state's. No figure is worked out here.
 */
import { PlanRail, PlanSentence, PlanButtons, UndoToast, fill, Button, LinkButton } from '../../components/index.js';
import { planLockView } from '../../state/select.js';
import { href } from '../../router/routes.js';
import { PLAN } from '../../copy/plan.js';
import { LOCK } from '../../copy/lock.js';

const w = PLAN.page;
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

function List({ title, lead, items, slots, testid }) {
  return (
    <section class="plan-section lock-list" data-section={testid}>
      <h3>{title}</h3>
      {lead && <p class="note">{fill(lead, slots)}</p>}
      <ul class="plan-lines">
        {Object.entries(items).map(([k, text]) => <li key={k} class="plan-line" data-line={`lock.${testid}.${k}`}>{fill(text, slots)}</li>)}
      </ul>
    </section>
  );
}

const toastText = (toast) => {
  if (toast.kind === 'undone') return LOCK.toast.undone;
  if (toast.kind === 'unchanged') return LOCK.toast.unchanged;
  const line = toast.line;
  if (line && LOCK.toast[line.id]) return fill(LOCK.toast[line.id], line.slots);
  return LOCK.toast.locked;
};

export function LockScreen(state, dispatch) {
  const L = planLockView(state);
  const list = L.found ? null : (state.plans ? state.plans.status : 'none');
  if (!L.found || !L.lock) {
    const waiting = list === 'none' || list === 'checking' || list === 'reading' || (L.found && !L.lock);
    return {
      question: null, rail: false, full: false,
      content: (
        <>
          <h1 tabIndex={-1}>{LOCK.title}</h1>
          {waiting ? <p class="lead" role="status" data-testid="plan.opening">{PLAN.list.opening}</p>
            : state.session.kind === 'nobody' && (!state.plans || !state.plans.list.length) ? <p class="lead" data-testid="plan.signIn">{PLAN.list.signIn} <a href={href.plans()}>{PLAN.list.toPlans}</a></p>
              : <p class="lead" data-testid="plan.unknown">{PLAN.list.unknown} <a href={href.plans()}>{PLAN.list.toPlans}</a></p>}
        </>
      )
    };
  }
  const step = L.lock;
  const planId = L.id;
  const onChange = (place, id = L.id) => dispatch({ type: 'plan/change', planId: id, place, back: href.plan(L.id, 'lock') });
  const rail = <PlanRail view={L} state={state} dispatch={dispatch} onChange={onChange} />;
  const back = href.plan(L.id, 'plan');
  const slots = { strategy: PLAN.strategies[step.strategyId] || step.strategyId };

  // A locked plan, by its address (R7): says so and links to "Your plan as locked"; no button.
  if (step.locked || L.locked) {
    return {
      question: null, rail, full: false,
      content: (
        <>
          <Head view={L} />
          <h1 tabIndex={-1} data-testid="plan.step.lock">{LOCK.locked.title}</h1>
          {!step.listed && <p class="note" data-testid="plan.notListed">{w.notListed}</p>}
          <section class="headline plan-panel" data-region="plan-step" data-locked="1">
            <p class="line"><PlanSentence s={step.result} figures={step.figures} data-testid="plan.lock.result" /></p>
            <p class="note" data-testid="plan.lock.lockedLine">{fill(LOCK.locked.line, { date: step.lockedOn || L.lockedOn || '' })}</p>
            <PlanButtons buttons={step.buttons} planId={planId} stepId="lock" onChange={onChange} readonly={L.readonly} />
          </section>
          <UndoToast prefix="plan.lock" toast={L.toast} text={L.toast ? toastText(L.toast) : ''} words={LOCK.buttons}
            onUndo={() => dispatch({ type: 'plan/undo', planId })} onClose={() => dispatch({ type: 'plan/toastClose' })} />
        </>
      )
    };
  }

  const saving = L.saving && L.saving.kind === 'lock';
  const problem = L.problem ? (LOCK.problems[L.problem] || LOCK.problems.failed) : null;
  const confirmOpen = L.confirm === 'lock';
  const toggle = () => dispatch({ type: 'ui/toggle', id: 'lockConfirm' });
  const canLock = !L.readonly && !saving;

  return {
    question: null, rail, full: false,
    content: (
      <>
        <Head view={L} />
        <h1 tabIndex={-1} data-testid="plan.step.lock">{LOCK.title}{step.optional && <span class="rail-optional"> ({w.optional})</span>}</h1>
        {!step.listed && <p class="note" data-testid="plan.notListed">{w.notListed}</p>}
        <section class="headline plan-panel lock-panel" data-region="plan-step" data-locked="0" data-saving={saving ? '1' : '0'}>
          <p class="line"><PlanSentence s={step.result} figures={step.figures} data-testid="plan.lock.result" /></p>
          <p class="lead">{LOCK.lead}</p>
          {step.saver && <p class="note" data-testid="plan.lock.saver">{LOCK.saver}</p>}
          <List title={LOCK.fixes.title} lead={LOCK.fixes.lead} items={LOCK.fixes.items} slots={slots} testid="fixes" />
          <p class="note">{LOCK.fixes.both}</p>
          <List title={LOCK.stays.title} items={LOCK.stays.items} slots={slots} testid="stays" />
          <List title={LOCK.gets.title} items={LOCK.gets.items} slots={slots} testid="gets" />
          <p class="note">{LOCK.test}</p>
          <p class="note">{LOCK.later}</p>
          {L.readonly && <p class="notice" role="status" data-testid="plan.lock.readonly">{LOCK.readonly}</p>}
          {saving && (
            <div class="working" role="status" data-testid="plan.lock.working">
              <p class="working-title">{LOCK.working.title}</p>
              <p>{LOCK.working.body}</p>
              <progress aria-label={LOCK.working.progress} />
            </div>
          )}
          {!saving && !confirmOpen && !L.readonly && (
            <div class="actions-row about-actions">
              <Button testid="plan.lock.lock" kind="primary" onClick={toggle} {...keepFocus}>{LOCK.buttons.lock}</Button>
              <LinkButton testid="plan.lock.back" kind="quiet" href={back}>{LOCK.buttons.back}</LinkButton>
            </div>
          )}
          {!saving && confirmOpen && canLock && (
            <div class="notice lock-confirm" role="region" aria-label={LOCK.confirm.title} data-testid="plan.lock.confirmBox">
              <h3>{LOCK.confirm.title}</h3>
              <p>{LOCK.confirm.fixes}</p>
              <p>{LOCK.confirm.stays}</p>
              <p>{LOCK.confirm.undo}</p>
              <div class="actions-row">
                <Button testid="plan.lock.confirm" kind="primary" onClick={() => dispatch({ type: 'plan/lock', planId })} {...keepFocus}>{LOCK.buttons.confirm}</Button>
                <Button testid="plan.lock.notNow" kind="quiet" onClick={toggle} {...keepFocus}>{LOCK.buttons.notNow}</Button>
              </div>
            </div>
          )}
          {problem && <p class="notice" role="alert" data-testid="plan.lock.problem" data-problem={L.problem}>{problem}</p>}
          {L.readonly && <div class="actions-row"><LinkButton testid="plan.lock.back" kind="quiet" href={back}>{LOCK.buttons.back}</LinkButton></div>}
        </section>
        <UndoToast prefix="plan.lock" toast={L.toast} text={L.toast ? toastText(L.toast) : ''} words={LOCK.buttons}
          onUndo={() => dispatch({ type: 'plan/undo', planId })} onClose={() => dispatch({ type: 'plan/toastClose' })} />
      </>
    )
  };
}
