/**
 * "Does it last?" (research/v7/editing-in-v7.md 10): the fifth editing step of a saved plan in V7. The one test's result
 * for this plan — the band (lasts in N futures out of 10, the bar, the count of futures, the real starts, the length),
 * what is left, the income cuts, the cuts setting the run used; the history (the hardest and the named real starts); then
 * the dials: the spending cuts in a slump and the emergency reserve, each once with the saved value and source beside it.
 * Save, Cancel and after a save the Undo toast; the test runs again on the saved plan. A locked plan: the document's
 * figure, today's test beside it, the dials read-only. Draws only: everything is the reading's (state/select.js
 * planLastsView: answers/plan/lasts.js through the plan source; the run's words from verdictOf there) and the run's
 * status is the state's (effects/lasts.js). No figure is worked out here.
 */
import { PlanRail, EditField, UndoToast, OutOfTenBar, fill, Button, LinkButton } from '../../components/index.js';
import { planView, planLastsView } from '../../state/select.js';
import { href } from '../../router/routes.js';
import { PLAN } from '../../copy/plan.js';
import { LASTS } from '../../copy/lasts.js';

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

/** The band of one result (verdictOf): the word, the bar, the headline, the rows. `stale`: an older run's, greyed. */
function Band({ v, stale = false, testid }) {
  if (!v) return null;
  if (!v.ok) return <p class="notice" role="status" data-testid={testid} data-ok="0">{fill(LASTS.verdict[v.id] || '', v.slots)}</p>;
  const f = v.figures || {};
  return (
    <div class={`band verdict lasts-band is-${v.verdict}${stale ? ' is-stale' : ''}`} data-verdict={v.verdict} data-testid={testid} data-ok="1" data-stale={stale ? '1' : '0'}
      data-chance={f.chancePct} data-typical={f.typicalLeft} data-bad={f.badCaseLeft} data-good={f.goodCaseLeft} data-futures={f.futures} data-histories={f.histories} data-years={f.years}
      data-cut-n={f.cutN == null ? undefined : f.cutN} data-cut-per-year={f.cutPerYear == null ? undefined : f.cutPerYear} data-cut-years={f.cutYears == null ? undefined : f.cutYears}>
      <p class="figure" data-testid={testid + '.headline'}>{fill(LASTS.verdict[v.id], v.slots)}</p>
      <p class="lasts-bar"><span class={`verdict-word is-${v.verdict}`} data-verdict={v.verdict}>{LASTS.verdict.word[v.verdict]}</span> <OutOfTenBar source={v} k="share" /></p>
      <p class="figure-sub" data-testid={testid + '.sub'}>{fill(LASTS.verdict[v.sub.id], v.sub.slots)}</p>
      <ul class="plan-lines">
        {v.rows.map((r, i) => <li key={i} class="plan-line" data-line={'lasts.' + r.id}>{fill(LASTS.rows[r.id] || '', r.slots)}</li>)}
      </ul>
    </div>
  );
}

function StartRow({ r }) {
  const H = LASTS.history;
  return (
    <li class="plan-line lasts-start" data-start={r.when} data-row={r.id}>
      <strong>{r.when}</strong>{r.label ? ' — ' + r.label : ''}: {fill(H.rows[r.id] || '', r.slots)}
      {r.lowest ? '; ' + fill(H.lowest, { lowest: r.lowest }) : ''}{r.left ? '; ' + fill(H.left, { left: r.left }) : ''}
    </li>
  );
}

/** History: "What if you had retired into a bad year?" — the one test's own real starts, from the same run. */
function History({ v, onChange, readonly }) {
  const H = LASTS.history;
  if (!v || !v.ok || !v.history) return null;
  const h = v.history;
  return (
    <section class="plan-section lasts-history" data-section="history">
      <h3>{H.title}</h3>
      <p class="note">{h.contract ? H.leadContract : fill(h.failKind === 'cut' ? H.leadCut : h.failKind === 'lean' ? H.leadLean : H.lead, { histories: h.histories, ranOut: h.histRanOut })}</p>
      {h.worst.length > 0 && <><h4>{H.worstTitle}</h4><p class="note">{H.worstLead}</p><ul class="plan-lines" data-testid="plan.lasts.worst">{h.worst.map((r, i) => <StartRow key={i} r={r} />)}</ul></>}
      {h.named.length > 0 && <><h4>{H.namedTitle}</h4><p class="note">{H.namedLead}</p><ul class="plan-lines" data-testid="plan.lasts.named">{h.named.map((r, i) => <StartRow key={i} r={r} />)}</ul></>}
      <p class="note">{H.scenarios}</p>
      {!readonly && <div class="actions-row"><Button testid="plan.lasts.scenarios" kind="quiet" onClick={() => onChange('test')}>{H.scenariosButton}</Button></div>}
    </section>
  );
}

/** The result region: working, failed, the band(s), the history. */
function Answer({ L, onChange, dispatch, view }) {
  const run = L.run || { status: 'idle' };
  const v = L.verdict || null;
  if (!L.runKey) return <section class="headline plan-panel lasts-answer" data-region="plan-lasts-answer" data-status="none"><p class="notice" role="status" data-testid="plan.lasts.notRun">{LASTS.notRun}</p></section>;
  const working = run.status === 'working' || run.status === 'idle';
  const doc = L.document;
  const sourceLine = L.source && L.source.at ? fill(LASTS.ran.now, { date: L.source.at }) : LASTS.ran.nowUndated;
  return (
    <section class="headline plan-panel lasts-answer" data-region="plan-lasts-answer" data-status={run.status} data-fresh={run.fresh ? '1' : '0'}>
      {doc && (
        <>
          <p class="note" data-testid="plan.lasts.documentLine">{fill(LASTS.ran.document, { date: doc.lockedOn })}</p>
          <Band v={L.documentVerdict} testid="plan.lasts.document" />
          <p class="note">{LASTS.ran.today}</p>
        </>
      )}
      {working && (
        <div class="working" role="status" data-testid="plan.lasts.working">
          <p class="working-title">{LASTS.working.title}</p>
          <p>{LASTS.working.trying}</p>
          {run.progress && run.progress.total > 0
            ? <progress value={run.progress.done} max={run.progress.total} aria-label={LASTS.working.progress} />
            : <progress aria-label={LASTS.working.progress} />}
          {run.slow && <p class="working-slow">{LASTS.working.slow}</p>}
        </div>
      )}
      {run.status === 'failed' && run.reason === 'noWorker' && (
        <div class="notice" role="alert" data-testid="plan.lasts.noWorker">
          <p>{LASTS.failed.noWorker}</p>
          {!view.readonly && <Button testid="plan.lasts.noWorkerPlanner" kind="quiet" onClick={() => onChange('test')}>{LASTS.failed.inPlanner}</Button>}
        </div>
      )}
      {run.status === 'failed' && run.reason !== 'noWorker' && (
        <div class="notice" role="alert" data-testid="plan.lasts.failed">
          <p>{LASTS.failed.title}</p>
          <p>{LASTS.failed.body}</p>
          <Button testid="plan.lasts.retry" kind="quiet" onClick={() => dispatch({ type: 'lasts/retry' })}>{LASTS.failed.tryAgain}</Button>
        </div>
      )}
      {v && <Band v={v} stale={!run.fresh} testid="plan.lasts.result" />}
      {v && run.fresh && v.ok && <p class="plan-source" data-testid="plan.lasts.ran">{sourceLine}</p>}
      {v && run.fresh && L.note && <p class="notice" role="status" data-testid="plan.lasts.earlierTest">{L.note}</p>}
      {v && run.fresh && <History v={v} onChange={onChange} readonly={view.readonly} />}
    </section>
  );
}

/** The derived figures (10.2): shown, never asked. */
function Derived({ L }) {
  return (
    <section class="plan-section about-derived" data-section="derived">
      <h3>{LASTS.derivedTitle}</h3>
      <ul class="plan-lines">
        {L.derived.map((d, i) => <li key={i} class="plan-line" data-line={'lasts.' + d.id}>{fill(LASTS.derived[d.id] || '', d.slots)}</li>)}
      </ul>
    </section>
  );
}

function Partners({ L, onChange, readonly }) {
  if (!L.partners.length) return null;
  return (
    <section class="plan-section" data-section="partners">
      {L.partners.map((p) => (
        <p class="note" key={p.id} data-testid="plan.lasts.partner">{fill(LASTS.partner, { name: p.name })} <a href={href.plan(p.id, 'lasts')}>{fill(LASTS.partnerLink, { name: p.name })}</a></p>
      ))}
      <p class="note">{LASTS.together}</p>
      {!readonly && <div class="actions-row"><Button testid="plan.lasts.together" kind="quiet" onClick={() => onChange('household')}>{LASTS.togetherButton}</Button></div>}
    </section>
  );
}

const toastText = (toast) => {
  if (toast.kind === 'undone') return LASTS.toast.undone;
  if (toast.kind === 'unchanged') return LASTS.toast.unchanged;
  if (!toast.line) return LASTS.toast.savedShort;
  return fill(LASTS.toast[toast.line.id] || LASTS.toast.savedShort, toast.line.slots);
};

export function LastsScreen(state, dispatch) {
  const view = planView(state);
  const L = planLastsView(state);
  const list = view.found ? null : (state.plans ? state.plans.status : 'none');
  if (!view.found || !L.found) {
    const waiting = list === 'none' || list === 'checking' || list === 'reading' || (view.found && !L.found);
    return {
      question: null, rail: false, full: false,
      content: (
        <>
          <h1 tabIndex={-1}>{LASTS.title}</h1>
          {waiting ? <p class="lead" role="status" data-testid="plan.opening">{PLAN.list.opening}</p>
            : state.session.kind === 'nobody' && (!state.plans || !state.plans.list.length) ? <p class="lead" data-testid="plan.signIn">{PLAN.list.signIn} <a href={href.plans()}>{PLAN.list.toPlans}</a></p>
              : <p class="lead" data-testid="plan.unknown">{PLAN.list.unknown} <a href={href.plans()}>{PLAN.list.toPlans}</a></p>}
        </>
      )
    };
  }
  const planId = L.id;
  const onChange = (place, id = view.id) => dispatch({ type: 'plan/change', planId: id, place, back: href.plan(view.id, 'lasts') });
  const back = href.plan(view.id, 'plan');
  const field = (path) => L.fields.find((f) => f.path === path);
  const sourceText = L.locked ? fill(LASTS.source.locked, { date: L.lockedOn }) : L.source && L.source.at ? fill(LASTS.source.saved, { date: L.source.at }) : LASTS.source.savedUndated;
  const notUsed = new Set(L.notUsed || []);
  const F = (path, more = {}) => (
    <>
      <EditField step="lasts" f={field(path)} words={LASTS.fields[path]} errors={LASTS.errors[path]} source={sourceText} savedWords={LASTS.savedValue} planId={planId} dispatch={dispatch} {...more} />
      {field(path).applies && notUsed.has(path) && <p class="note" data-not-used={path}>{LASTS.notUsed}</p>}
    </>
  );
  const rail = <PlanRail view={view} state={state} dispatch={dispatch} onChange={onChange} />;
  const answer = <Answer L={L} onChange={onChange} dispatch={dispatch} view={view} />;

  // A locked plan, or one shown as saved: the result, then the dials read-only (10.5).
  if (!L.editable) {
    return {
      question: null, rail, full: false,
      content: (
        <>
          <Head view={view} />
          <h1 tabIndex={-1} data-testid="plan.step.lasts">{LASTS.title}</h1>
          <p class="lead">{LASTS.lead}</p>
          {answer}
          <section class="plan-panel" data-region="plan-lasts" data-editable="0">
            <Derived L={L} />
            {L.locked ? <p class="note plan-fixed" data-testid="plan.lasts.fixed">{fill(w.fixed, { date: L.lockedOn })}</p> : <p class="notice" role="status">{LASTS.readonly}</p>}
            {L.locked && <p class="note" data-testid="plan.unlock">{w.unlock}</p>}
            <Partners L={L} onChange={onChange} readonly={view.readonly} />
          </section>
          <div class="actions-row">
            <LinkButton testid="plan.lasts.back" kind="quiet" href={back}>{LASTS.buttons.back}</LinkButton>
          </div>
        </>
      )
    };
  }

  const onSubmit = (e) => {
    e.preventDefault();
    const root = e.currentTarget;
    dispatch({ type: 'plan/save', planId });
    const firstPath = Object.keys(L.errors).find((p) => (field(p) ? field(p).applies : true));
    if (!firstPath) return;
    const el = root.querySelector(`[id="plan.lasts.${firstPath}"]`) || root.querySelector(`[name="plan.lasts.${firstPath}"]:checked`) || root.querySelector(`[name="plan.lasts.${firstPath}"]`);
    if (el) el.focus();
  };
  const onCancel = () => dispatch({ type: 'plan/cancel', planId });
  const problem = L.problem ? (LASTS.problems[L.problem] || LASTS.problems.failed) : null;

  return {
    question: null, rail, full: false,
    content: (
      <>
        <Head view={view} />
        <h1 tabIndex={-1} data-testid="plan.step.lasts">{LASTS.title}</h1>
        <p class="lead">{LASTS.lead}</p>
        {answer}
        <form class="ask about-form income-form lasts-form" noValidate onSubmit={onSubmit} data-region="plan-lasts" data-editable="1">
          <section class="income-section" data-section="cuts">
            <h2>{LASTS.sections.cuts}</h2>
            <p class="note">{LASTS.notes.cuts}</p>
            {F('cutsOn', { nested: { yes: <>{F('cutAfterMonths')}{F('cutPct')}{F('deeperAfterMonths')}{F('buffer')}</> } })}
          </section>
          <section class="income-section" data-section="reserve">
            <h2>{LASTS.sections.reserve}</h2>
            <p class="note">{LASTS.notes.reserve}</p>
            {F('reserveOn', { nested: { yes: F('reserveAmount') } })}
          </section>
          <Derived L={L} />
          <Partners L={L} onChange={onChange} readonly={view.readonly} />
          {problem && <p class="notice" role="alert" data-testid="plan.lasts.problem" data-problem={L.problem}>{problem}</p>}
          <div class="actions-row about-actions">
            <Button testid="plan.lasts.save" kind="primary" type="submit" disabled={!!L.saving} {...keepFocus}>{L.saving ? LASTS.saving : LASTS.buttons.save}</Button>
            <Button testid="plan.lasts.cancel" kind="quiet" onClick={onCancel} {...keepFocus}>{LASTS.buttons.cancel}</Button>
            <LinkButton testid="plan.lasts.back" kind="quiet" href={back}>{LASTS.buttons.back}</LinkButton>
          </div>
        </form>
        <UndoToast prefix="plan.lasts" toast={L.toast} text={L.toast ? toastText(L.toast) : ''} words={LASTS.buttons}
          onUndo={() => dispatch({ type: 'plan/undo', planId })} onClose={() => dispatch({ type: 'plan/toastClose' })} />
      </>
    )
  };
}
