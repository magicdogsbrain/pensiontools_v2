/**
 * "About you and when" (research/v7/editing-in-v7.md 2, 4): the first editing step of a saved plan in V7. Each fact asked
 * once, by age; the saved value and its source beside each box; the derived figures shown, never asked; problems in plain
 * words; Save and Cancel; after a save the Undo toast. A locked plan, or one shown as saved, is read-only here: figures,
 * "Fixed when you locked the plan on …", the unlock sentence once. Draws only: everything is the reading's
 * (state/select.js aboutView, from answers/plan/about.js through the plan source).
 */
import { PlanRail, changeAction, EditField, UndoToast, fill, Button, LinkButton } from '../../components/index.js';
import { planView, aboutView, planKeepTestView } from '../../state/select.js';
import { KeepTestLine } from './KeepTest.jsx';
import { href } from '../../router/routes.js';
import { PLAN } from '../../copy/plan.js';
import { ABOUT } from '../../copy/about.js';

const w = PLAN.page;
/** A button press keeps the focus where it is (the confirm's buttons: the page under them changes). */
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

const toastText = (toast) => (toast.kind === 'undone' ? ABOUT.toast.undone : toast.kind === 'unchanged' ? ABOUT.toast.unchanged : toast.line ? fill(ABOUT.toast[toast.line.id] || ABOUT.toast.saved, toast.line.slots) : ABOUT.toast.savedShort);

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
  const onChange = (place, id = view.id, month = null) => dispatch(changeAction(id, place, href.plan(view.id, 'about'), month));
  const back = href.plan(view.id, 'plan');
  const slots = { yearNow: about.yearNow, yearSaved: about.yearSaved || '', yearStop: about.yearStop || '', min: about.minYears, minAge: about.endAgeMin };
  // the start-year choices between the tax year work stopped and this one are each named by their year (6.51.0)
  const startWords = { ...ABOUT.fields.startWhen, options: { ...ABOUT.fields.startWhen.options, ...(about.stopThisYear ? { now: ABOUT.fields.startWhen.nowStopped } : {}), ...(about.yearSavedIsSet === false ? { saved: ABOUT.fields.startWhen.notSaved } : {}), ...(about.yearChoices || {}) } };
  const field = (path) => about.fields.find((f) => f.path === path);
  const sourceWords = (src) => (about.locked ? fill(ABOUT.source.locked, { date: about.lockedOn }) : src && src.at ? fill(ABOUT.source.saved, { date: src.at }) : ABOUT.source.savedUndated);
  const sourceText = sourceWords(about.source);
  const F = (path, more = {}) => <EditField f={field(path)} words={path === 'startWhen' ? startWords : ABOUT.fields[path]} errors={ABOUT.errors[path]} source={path === 'age' ? sourceWords(about.ageSource) : sourceText} savedWords={ABOUT.savedValue} planId={planId} dispatch={dispatch} slots={slots} {...more} />;
  // Many years between the tax year work stopped and this one (a stop long ago): the years between are one choice, "Another
  // tax year", with a list, so the page is not a column of radios on a phone. The values sent are the same ('y<YYYY>').
  const startField = () => {
    const f = field('startWhen');
    const between = f && Array.isArray(f.options) ? f.options.filter((o) => /^y\d{4}$/.test(o)) : [];
    if (between.length <= 2) return F('startWhen');
    const picked = between.includes(f.shown) ? f.shown : null;
    const options = f.options.flatMap((o) => (o === between[0] ? ['other'] : between.includes(o) ? [] : [o]));
    const send = (a) => dispatch(a && a.type === 'plan/edit' && a.path === 'startWhen' && a.value === 'other' ? { ...a, value: picked || between[0] } : a);
    const listId = 'plan.about.startWhen.otherYear';
    const list = (
      <div class="box">
        <select id={listId} data-testid={listId} aria-label={ABOUT.fields.startWhen.otherList} value={picked || ''}
          onChange={(e) => dispatch({ type: 'plan/edit', planId, path: 'startWhen', value: e.currentTarget.value })}>
          {!picked && <option value="" disabled>{ABOUT.fields.startWhen.otherList}</option>}
          {between.map((o) => <option key={o} value={o}>{startWords.options[o]}</option>)}
        </select>
      </div>
    );
    return <EditField f={{ ...f, options, shown: picked ? 'other' : f.shown }} words={startWords} errors={ABOUT.errors.startWhen} source={sourceText} savedWords={ABOUT.savedValue} planId={planId} dispatch={send} slots={slots} nested={{ other: list }} />;
  };

  // A locked plan, or one shown as saved: the figures, read-only (4) — bar a locked plan's start (6.53.0): "When did you stop
  // work?" once (one write the lock allows), or the move to the tax year work stopped, confirmed and made here (6.55.0).
  if (!about.editable) {
    const saved = about.fields.filter((f) => f.applies && f.saved !== null && !['sex', 'chance'].includes(f.path));
    const ls = about.lockedStart;
    const L = ABOUT.lockedStart;
    const lockedProblem = about.problem ? (ABOUT.problems[about.problem] || ABOUT.problems.failed) : null;
    const onStopSave = (e) => { e.preventDefault(); dispatch({ type: 'plan/save', planId }); };
    const onStopLeave = () => { dispatch({ type: 'plan/edit', planId, path: 'stopAskLeft', value: 'yes' }); dispatch({ type: 'plan/save', planId }); };
    const stopId = 'plan.about.lockedStopMonth';
    // the move of the plan's start (6.55.0): its confirm on the page, the write under way
    const C = L.confirm;
    const moving = !!(about.saving && about.saving.kind === 'moveStart');
    const toggleMove = () => dispatch({ type: 'ui/toggle', id: 'moveStartConfirm' });
    // the month box: asked once, or the month already said put right (the same write, the same rules)
    const stopBox = (
      <div class="field" data-field="lockedStopMonth">
        <label for={stopId}>{ABOUT.fields.stoppedMonth.label}</label>
        <div class="box">
          <input id={stopId} data-testid={stopId} type="text" inputMode="text" autoComplete="off" value={ls ? ls.shown : ''} placeholder="2023-10"
            aria-invalid={ls && ls.error ? 'true' : 'false'} aria-describedby={ls && ls.error ? stopId + '.error' : undefined}
            onInput={(e) => dispatch({ type: 'plan/edit', planId, path: 'stopMonth', value: e.currentTarget.value })} />
        </div>
        <p class="help">{L.help}</p>
        {ls && ls.error && <p class="error" id={stopId + '.error'} role="alert">{L.errors[ls.error] || L.errors.notAMonth}</p>}
      </div>
    );
    const saveStop = <Button testid="plan.about.stopAsk.save" kind="primary" type="submit" disabled={!!about.saving || !(ls && ls.shown) || !!(ls && ls.error)}>{about.saving ? ABOUT.saving : L.save}</Button>;
    // folded: the month said, put right; or, after "Leave it", the month still to say (it is not asked again)
    const changeBlock = ls && (ls.change || ls.left) ? (
      <details class="locked-start-change" data-testid={ls.change ? 'plan.about.stopChange' : 'plan.about.stopLater'} open={!!(ls.shown || ls.error)}>
        <summary>{ls.change ? L.change : L.later}</summary>
        <form class="ask" noValidate onSubmit={onStopSave}>
          {stopBox}
          <div class="actions-row">{saveStop}</div>
        </form>
      </details>
    ) : null;
    // the State Pension's start date, asked where the plan gives it only as a plan year (7.4.0): written with the move
    const spId = 'plan.about.moveSpDate';
    const spBox = (
      <div class="field" data-field="moveSpDate">
        <label for={spId}>{L.spLabel}</label>
        <div class="box">
          <input id={spId} data-testid={spId} type="text" inputMode="text" autoComplete="off" value={ls ? ls.spShown : ''} placeholder="14 March 2032"
            aria-invalid={ls && ls.spError ? 'true' : 'false'} aria-describedby={ls && ls.spError ? spId + '.error' : undefined}
            onInput={(e) => dispatch({ type: 'plan/edit', planId, path: 'moveSpDate', value: e.currentTarget.value })} />
        </div>
        <p class="help">{L.spHelp}</p>
        {ls && ls.spPlanYear && <p class="help" data-line="about.spPlanYear">{fill(L.spPlanYear, { year: ls.spPlanYear })}</p>}
        {ls && ls.spError && <p class="error" id={spId + '.error'} role="alert">{L.spError}</p>}
      </div>
    );
    // the move's confirm (6.55.0): what the planner's own confirm says, line for line, then ONE write under the lock; no Undo
    const confirmOf = (mv) => !moving && about.moveConfirm && mv && mv.how && (
      <div class="notice lock-confirm" role="region" aria-label={fill(C.title, mv)} data-testid="plan.about.moveConfirm">
        <h3>{fill(C.title, mv)}</h3>
        <p>{C.intro}</p>
        <ul class="plan-lines">
          {mv.confirm.map((l, i) => <li key={l.id + '.' + i} class="plan-line" data-line={'move.' + l.id}>{fill(C.lines[l.id], l.slots)}</li>)}
        </ul>
        <div class="actions-row">
          <Button testid="plan.about.moveConfirm.yes" kind="primary" onClick={() => dispatch({ type: 'plan/moveStart', planId, how: mv.how })} disabled={!!about.saving} {...keepFocus}>{fill(C.yes, mv)}</Button>
          <Button testid="plan.about.moveConfirm.no" kind="quiet" onClick={toggleMove} {...keepFocus}>{C.no}</Button>
        </div>
      </div>
    );
    const working = moving && <div class="working" role="status" data-testid="plan.about.moving"><p class="working-title">{C.working}</p><progress aria-label={C.progress} /></div>;
    const nm = ls && ls.nowMove;
    // beside the saved first tax year (7.4.3): where the start belongs, when the move is offered, with the move's own button
    const pointer = ls && ls.move && ls.move.how && !moving && !about.moveConfirm ? (
      <span class="plan-pointer" data-testid="plan.about.startPointer">
        {'. '}{fill(ls.move.records ? L.pointer : L.pointerStop, ls.move)}{' '}
        <Button testid="plan.about.startPointer.open" kind="quiet" onClick={toggleMove} disabled={!!about.saving} {...keepFocus}>{L.pointerOpen}</Button>
      </span>
    ) : null;
    const lockedStartBlock = ls && ls.ask ? (
      <>
        <form class="ask notice locked-start" noValidate onSubmit={onStopSave} data-testid="plan.about.stopAsk">
          <p>{L.ask}</p>
          {stopBox}
          <div class="actions-row">
            {saveStop}
            {ls.leave && <Button testid="plan.about.stopAsk.leave" kind="quiet" onClick={onStopLeave} disabled={!!about.saving}>{L.leave}</Button>}
          </div>
          <p class="help">{L.askHelp}{ls.leave ? ' ' + L.leaveHelp : ''}</p>
        </form>
        {/* no month said, and a start later than this tax year (7.4.0): "I'm already drawing: start it this tax year" */}
        {nm && (
          <div class="notice locked-start" role="status" data-testid="plan.about.moveNow">
            <p>{fill(L.now, nm)}</p>
            {nm.spAsk && spBox}
            {working || (!about.moveConfirm && (
              <div class="actions-row">
                <Button testid="plan.about.moveNow.open" kind="primary" onClick={toggleMove} disabled={!!about.saving || !nm.how} {...keepFocus}>{L.nowOpen}</Button>
              </div>
            ))}
          </div>
        )}
        {confirmOf(nm)}
      </>
    ) : ls && ls.move ? (
      <>
        <div class="notice locked-start" role="status" data-testid="plan.about.moveStart">
          <p>{fill(ls.move.records ? (ls.move.stepped ? L.moveRecords : L.moveRecordsLevel) : ls.move.stepped ? L.move : L.moveLevel, ls.move)}</p>
          {ls.move.spAsk && spBox}
          {working || (!about.moveConfirm && (
            <div class="actions-row">
              <Button testid="plan.about.moveStart.open" kind="primary" onClick={toggleMove} disabled={!!about.saving || !ls.move.how} {...keepFocus}>{L.open}</Button>
            </div>
          ))}
          <p class="help">{L.moveHelp}</p>
          {changeBlock}
        </div>
        {confirmOf(ls.move)}
      </>
    ) : ls && ls.blocked ? (
      <div class="notice locked-start" role="status" data-testid="plan.about.moveBlocked">
        <p>{fill(ls.blocked.records ? L.blockedRecords : L.blocked, ls.blocked)}</p>
        {changeBlock}
      </div>
    ) : changeBlock;
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
                  <span class="plan-label">{(f.path === 'stopMonth' && field('stopped') && field('stopped').saved === 'yes' ? ABOUT.fields.stoppedMonth : ABOUT.fields[f.path]).label}: </span>
                  <span class="plan-value" data-saved-for={f.path}>{f.type === 'choice' ? fill((f.path === 'startWhen' ? startWords : ABOUT.fields[f.path]).options[f.saved] || f.saved, slots) : f.saved}</span>
                  {f.path === 'startWhen' && pointer}
                </li>
              ))}
            </ul>
            {about.locked ? <p class="note plan-fixed" data-testid="plan.about.fixed">{fill(w.fixed, { date: about.lockedOn })}</p> : <p class="notice" role="status">{ABOUT.readonly}</p>}
            {/* 7.7.0: what the person chose to keep, tested against the plan and agreed — or not yet */}
            <KeepTestLine K={planKeepTestView(state)} prefix="plan.about" />
            <Derived about={about} />
            {lockedStartBlock}
            {lockedProblem && <p class="notice" role="alert" data-testid="plan.about.problem" data-problem={about.problem}>{lockedProblem}</p>}
            {about.locked && <p class="note" data-testid="plan.unlock">{w.unlock}</p>}
            <Partners about={about} />
          </section>
          <div class="actions-row">
            <LinkButton testid="plan.about.back" kind="quiet" href={back}>{ABOUT.buttons.back}</LinkButton>
          </div>
          <UndoToast toast={about.toast} text={about.toast ? toastText(about.toast) : ''} words={ABOUT.buttons}
            onUndo={() => dispatch({ type: 'plan/undo', planId })} onClose={() => dispatch({ type: 'plan/toastClose' })} />
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
  // the month box is one field drawn under whichever answer is chosen: "the month you stopped" or "the month you stop" (6.51.0)
  const stoppedNow = field('stopped') ? field('stopped').shown : '';
  const stoppedNested = {
    yes: stoppedNow === 'yes' ? F('stopMonth', { words: ABOUT.fields.stoppedMonth }) : null,
    age: F('stopAge'),
    month: stoppedNow === 'month' ? F('stopMonth') : null
  };
  const suggest = about.suggestion;
  const notUsed = new Set(about.notUsed || []);
  const problem = about.problem ? (ABOUT.problems[about.problem] || ABOUT.problems.failed) : null;
  // an out-of-date draft (road-to-7.md step 11b): "Update it" sets the boxes as the planner's update does and saves; "Leave it" is remembered
  const onStaleUpdate = () => { for (const ed of about.stale.edits) dispatch({ type: 'plan/edit', planId, path: ed.path, value: ed.value }); dispatch({ type: 'plan/save', planId }); };

  return {
    question: null,
    rail: <PlanRail view={view} state={state} dispatch={dispatch} onChange={onChange} />,
    full: false,
    content: (
      <>
        <Head view={view} />
        <h1 tabIndex={-1} data-testid="plan.step.about">{ABOUT.title}</h1>
        <p class="lead">{ABOUT.lead}</p>
        {about.stale && (
          <div class="notice stale-draft" role="status" data-testid="plan.about.stale" data-saved-year={about.stale.savedYear}>
            <p>{fill(ABOUT.stale.line, about.stale)}</p>
            <div class="actions-row">
              <Button testid="plan.about.stale.update" kind="primary" onClick={onStaleUpdate} disabled={!!about.saving}>{fill(ABOUT.stale.update, about.stale)}</Button>
              <Button testid="plan.about.stale.leave" kind="quiet" onClick={() => dispatch({ type: 'plan/staleLeave', planId })} disabled={!!about.saving}>{ABOUT.stale.leave}</Button>
            </div>
            <p class="help">{ABOUT.stale.help}</p>
          </div>
        )}
        <form class="ask about-form" noValidate onSubmit={onSubmit} data-region="plan-about" data-editable="1">
          {F('age')}
          {notUsed.has('age') && <p class="note">{ABOUT.notUsed}</p>}
          {F('stopped', { nested: stoppedNested })}
          {startField()}
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
              {suggest && suggest.applied && <span class="note" data-testid="plan.about.suggested">{fill(ABOUT.suggest.result[suggest.slots.chance] || ABOUT.suggest.result[10], suggest.slots)}{suggest.notSaid ? ' ' + ABOUT.suggest.notSaid : ''}</span>}
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
