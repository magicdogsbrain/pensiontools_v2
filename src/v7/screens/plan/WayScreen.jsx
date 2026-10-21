/**
 * "How the money is taken" (research/v7/way-and-mix.md 2; road-to-7.md step 8a): the way of drawing of a saved plan in V7.
 * Your plan's way first, as an open card: its name, its promise, the verdict the nine-way run gave it, its dials at the
 * plan's values. Below, "The other eight, on this plan", ranked and closed: name, promise, the verdict line, the left or
 * cost line, one button "Open". Opened, a card shows its dials at the plan's stashed values for that way (else the engine's
 * defaults), the verdict for those values, "Use this way of drawing" and what can go wrong. A dial moved tries that one way
 * again ("Tried in 1 run"). One card open at a time. "More columns" under the cards: the planner's other columns and orders.
 * A locked plan: every card runs, "Use this" is never drawn, one line sets the tried figure beside the document's.
 *
 * Draws only: everything is the reading's (state/select.js planWayView: answers/plan/way.js through the plan source) and
 * the run's status is the state's (effects/ways.js). No figure is worked out here. The write is the one write file's
 * (effects/planWrite.js, kind 'way'), on plan/useWay after the confirm on the same screen.
 */
import { PlanRail, UndoToast, OutOfTenBar, fill, Button, LinkButton } from '../../components/index.js';
import { planView, planWayView } from '../../state/select.js';
import { href } from '../../router/routes.js';
import { PLAN } from '../../copy/plan.js';
import { WAY } from '../../copy/way.js';
import { RANK_BYS } from '../../../answers/plan/schema.js';

const w = PLAN.page;
const keepFocus = { onMouseDown: (e) => e.preventDefault() };
const name = (id) => WAY.names[id] || id;
const seconds = (ms) => (Math.round((ms || 0) / 100) / 10).toFixed(1);

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

/** The figures of one card: the verdict word and bar, then the lines (the reading's ids into the words). */
function Figures({ card }) {
  const v = card.verdict;
  const id = card.id;
  return (
    <div class={`way-figures${card.stale ? ' is-stale' : ''}`} data-testid={`plan.way.${id}.figures`} data-stale={card.stale ? '1' : '0'}
      data-affordable={card.affordable ? '1' : '0'} data-chance={v ? v.chancePct : undefined} data-typical={v ? v.typicalLeft : undefined} data-bad={v ? v.badCaseLeft : undefined}>
      {v && <p class="lasts-bar"><span class={`verdict-word is-${v.word}`} data-verdict={v.word}>{WAY.card.verdictWord[v.word]}</span> <OutOfTenBar source={v} k="share" /></p>}
      <ul class="plan-lines">
        {card.lines.map((l, i) => <li key={i} class="plan-line" data-line={'way.' + l.id}>{fill(WAY.card[l.id] || '', { ...l.slots, docWay: l.slots.docWay ? name(l.slots.docWay) : undefined, way: l.slots.way ? name(l.slots.way) : undefined })}</li>)}
      </ul>
    </div>
  );
}

/** The dials of an open card (2.3): a box or a choice each, the words from copy/way.js, every change sent as typed. */
function Dials({ card, locked, dispatch }) {
  const id = card.id;
  const D = WAY.dials;
  if (!card.dials.length) return <section class="way-dials" data-section="dials"><h4>{D.title}</h4><p class="note" data-testid={`plan.way.${id}.noDials`}>{D.none}</p></section>;
  const set = (key, value) => dispatch({ type: 'ways/dial', id, key, value });
  return (
    <section class="way-dials" data-section="dials">
      <h4>{D.title}</h4>
      <p class="note">{locked ? D.leadLocked : D.lead}</p>
      {card.dials.map((d) => {
        const base = `plan.way.${id}.${d.key}`;
        const label = D.labels[d.key] || d.key;
        const help = D.help[d.key] || null;
        const error = d.error ? fill(D.errors[d.error] || D.errors.notANumber, { min: d.min, max: d.max }) : null;
        if (d.type === 'choice') {
          return (
            <fieldset key={d.key} class={`field field-choice${error ? ' has-error' : ''}`} data-field={d.key}>
              <legend>{label}</legend>
              {d.options.map((o) => (
                <div class="option" key={o}>
                  <div class="option-row">
                    <input type="radio" id={`${base}.${o}`} data-testid={`${base}.${o}`} name={base} value={o} checked={d.shown === o} onClick={() => { if (d.shown !== o) set(d.key, o); }} onChange={() => {}} />
                    <label for={`${base}.${o}`}>{(D.options[d.key] && D.options[d.key][o]) || o}</label>
                  </div>
                </div>
              ))}
              {help && <p class="help">{help}</p>}
              {error && <p class="error" data-error-for={base}>{error}</p>}
            </fieldset>
          );
        }
        const mode = d.type === 'number' || d.type === 'percent' ? 'decimal' : 'numeric';
        return (
          <div key={d.key} class={`field field-${d.type}${error ? ' has-error' : ''}`} data-field={d.key}>
            <label for={base}>{label}</label>
            <div class="box">
              {d.type === 'money' && <span class="prefix" aria-hidden="true">£</span>}
              <input type="text" inputmode={mode} autocomplete="off" id={base} data-testid={base} name={base} value={d.shown} aria-invalid={error ? 'true' : undefined} onInput={(e) => set(d.key, e.currentTarget.value)} />
            </div>
            {help && <p class="help">{help}</p>}
            {error && <p class="error" data-error-for={base}>{error}</p>}
          </div>
        );
      })}
    </section>
  );
}

/** One card: closed (name, promise, the figures, "Open") or open (the dials, the try, "Use this way of drawing", what can go wrong). */
function Card({ card, V, planId, dispatch }) {
  const id = card.id;
  const open = card.open;
  const t = card.tried;
  const canUse = V.editable && !V.saving && (!card.current || card.typed);
  const confirmOpen = V.confirm && open;
  const toggle = () => dispatch({ type: 'ui/toggle', id: 'wayConfirm' });
  return (
    <article class={`way-card${open ? ' is-open' : ''}${card.current ? ' is-current' : ''}`} data-way={id} data-testid={`plan.way.card.${id}`} data-open={open ? '1' : '0'} data-current={card.current ? '1' : '0'} data-rank={card.rank == null ? undefined : card.rank}>
      <h3 class="way-name">{name(id)}</h3>
      <p class="way-promise">{WAY.promise[id]}</p>
      {card.has ? <Figures card={card} /> : V.run.status === 'working' ? <p class="working-note" role="status">{WAY.working.one}</p> : null}
      {open && card.has && (
        <>
          {card.compare && <p class="note" data-testid="plan.way.compare">{fill(WAY.card.compare, { ...card.compare.slots, docWay: name(card.compare.slots.docWay), way: name(card.compare.slots.way) })}</p>}
          {card.family && <p class="note" data-line="way.mix">{WAY.card.mix}</p>}
          {id === 'buckets-in-order' && <p class="note" data-line="way.noTent">{WAY.card.noTent}</p>}
          {card.bought && card.affordable && <p class="note" data-line="way.bundled">{WAY.card.bundled}</p>}
          <Dials card={card} locked={V.locked} dispatch={dispatch} />
          {t && t.status === 'working' && <p class="working-note" role="status" data-testid={`plan.way.${id}.trying`}>{WAY.working.one}</p>}
          {t && t.status === 'failed' && <p class="notice" role="alert" data-testid={`plan.way.${id}.tryFailed`}>{t.reason === 'noWorker' ? WAY.failed.noWorker : WAY.failed.one}</p>}
          {t && t.status === 'done' && !card.stale && <p class="plan-source" data-testid={`plan.way.${id}.tried`}>{t.ms != null ? fill(WAY.ran.oneTimed, { s: seconds(t.ms) }) : WAY.ran.one}</p>}
          <h4>{WAY.card.wrongTitle}</h4>
          <p class="way-wrong" data-testid={`plan.way.${id}.wrong`}>{WAY.wrong[id]}</p>
          {canUse && !confirmOpen && card.ok && !(t && t.status === 'working') && (
            <div class="actions-row">
              <Button testid={`plan.way.use.${id}`} kind="primary" onClick={toggle} {...keepFocus}>{WAY.buttons.use}</Button>
            </div>
          )}
          {canUse && confirmOpen && (
            <div class="notice lock-confirm" role="region" aria-label={WAY.confirm.title} data-testid="plan.way.confirmBox">
              <h3>{WAY.confirm.title}</h3>
              <p>{fill(WAY.confirm.body, { name: name(id), old: name(V.current) })}</p>
              <p>{WAY.confirm.undo}</p>
              <div class="actions-row">
                <Button testid="plan.way.confirm" kind="primary" onClick={() => dispatch({ type: 'plan/useWay', planId, id })} {...keepFocus}>{WAY.buttons.confirm}</Button>
                <Button testid="plan.way.notNow" kind="quiet" onClick={toggle} {...keepFocus}>{WAY.buttons.notNow}</Button>
              </div>
            </div>
          )}
        </>
      )}
      {!open && <div class="actions-row"><Button testid={`plan.way.open.${id}`} kind="quiet" onClick={() => dispatch({ type: 'ways/open', id })} {...keepFocus}>{WAY.buttons.open}</Button></div>}
    </article>
  );
}

/** "More columns": the planner's other columns on the same runs, and the orders — never the cards' default. */
function More({ V, dispatch }) {
  const T = WAY.table;
  const rows = V.cards.filter((c) => c.rank != null).sort((a, b) => a.rank - b.rank);
  const cell = (v) => (v == null ? T.none : v);
  return (
    <section class="plan-section way-more" data-section="more" data-open={V.more ? '1' : '0'}>
      <div class="actions-row"><Button testid="plan.way.more" kind="quiet" onClick={() => dispatch({ type: 'ui/toggle', id: 'waysMore' })} {...keepFocus}>{V.more ? WAY.buttons.fewer : WAY.buttons.more}</Button></div>
      {V.more && (
        <>
          <p class="note">{T.lead}</p>
          <fieldset class="field field-choice way-rank" data-field="rankBy">
            <legend>{T.rankBy}</legend>
            {RANK_BYS.map((by) => (
              <div class="option" key={by}>
                <div class="option-row">
                  <input type="radio" id={`plan.way.rankBy.${by}`} data-testid={`plan.way.rankBy.${by}`} name="plan.way.rankBy" value={by} checked={V.rankBy === by} onClick={() => { if (V.rankBy !== by) dispatch({ type: 'ways/rankBy', by }); }} onChange={() => {}} />
                  <label for={`plan.way.rankBy.${by}`}>{T.orders[by]}</label>
                </div>
              </div>
            ))}
          </fieldset>
          <div class="table-wrap">
            <table class="way-table" data-testid="plan.way.table">
              <thead><tr><th>#</th><th>{T.columns.way}</th><th>{T.columns.lasts}</th><th>{T.columns.worst12}</th><th>{T.columns.left}</th><th>{T.columns.covered}</th><th>{T.columns.coverage}</th><th>{T.columns.spent}</th><th>{T.columns.bumpiness}</th><th>{T.columns.score}</th></tr></thead>
              <tbody>
                {rows.map((c) => (
                  <tr key={c.id} data-way={c.id}>
                    <td>{c.rank + 1}</td>
                    <td>{name(c.id)}</td>
                    {c.table ? (
                      <>
                        <td>{c.verdict ? c.verdict.words.replace(/^in /, '') : T.none}</td>
                        <td>{cell(c.table.worst12)}</td>
                        <td>{c.verdict ? '£' + String(c.verdict.typicalLeft).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : T.none}</td>
                        <td>{cell(c.table.covered)}</td>
                        <td>{cell(c.table.coverage)}</td>
                        <td>{cell(c.table.spent)}</td>
                        <td>{cell(c.table.bumpiness)}</td>
                        <td>{cell(c.table.score)}</td>
                      </>
                    ) : <td colSpan={8}>{T.cannot}</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p class="note" data-testid="plan.way.score">{T.score}</p>
        </>
      )}
    </section>
  );
}

const toastText = (toast) => {
  if (toast.kind === 'undone') return WAY.toast.undone;
  if (toast.kind === 'unchanged') return WAY.toast.unchanged;
  const line = toast.line;
  if (line && line.id === 'way') return fill(WAY.toast.way, { name: name(line.slots.way) });
  return WAY.toast.way;
};

export function WayScreen(state, dispatch) {
  const view = planView(state);
  const V = planWayView(state);
  const list = view.found ? null : (state.plans ? state.plans.status : 'none');
  if (!view.found || !V.found) {
    const waiting = list === 'none' || list === 'checking' || list === 'reading' || (view.found && !V.found);
    return {
      question: null, rail: false, full: false,
      content: (
        <>
          <h1 tabIndex={-1}>{WAY.title}</h1>
          {waiting ? <p class="lead" role="status" data-testid="plan.opening">{PLAN.list.opening}</p>
            : state.session.kind === 'nobody' && (!state.plans || !state.plans.list.length) ? <p class="lead" data-testid="plan.signIn">{PLAN.list.signIn} <a href={href.plans()}>{PLAN.list.toPlans}</a></p>
              : <p class="lead" data-testid="plan.unknown">{PLAN.list.unknown} <a href={href.plans()}>{PLAN.list.toPlans}</a></p>}
        </>
      )
    };
  }
  const planId = V.id;
  const onChange = (place, id = view.id) => dispatch({ type: 'plan/change', planId: id, place, back: href.plan(view.id, 'way') });
  const rail = <PlanRail view={view} state={state} dispatch={dispatch} onChange={onChange} />;
  const back = href.plan(view.id, 'plan');
  const run = V.run || { status: 'idle' };
  const working = !!V.runKey && (run.status === 'working' || run.status === 'idle') && !V.has;
  const problem = V.problem ? (WAY.problems[V.problem] || WAY.problems.failed) : null;
  const yours = V.cards[0] || null;
  const others = V.cards.slice(1);
  return {
    question: null, rail, full: false,
    content: (
      <>
        <Head view={view} />
        <h1 tabIndex={-1} data-testid="plan.step.way">{WAY.title}</h1>
        <p class="lead">{WAY.lead}</p>
        {V.locked && <p class="note" data-testid="plan.way.locked">{WAY.locked.lead} {fill(WAY.locked.fixed, { date: V.lockedOn })}</p>}
        {V.readonly && <p class="notice" role="status" data-testid="plan.way.readonly">{WAY.readonly}</p>}
        <section class="plan-panel way-answer" data-region="plan-way-answer" data-status={V.runKey ? run.status : 'none'} data-has={V.has ? '1' : '0'}>
          {!V.runKey && <p class="notice" role="status" data-testid="plan.way.notRun">{WAY.notRun}</p>}
          {working && (
            <div class="working" role="status" data-testid="plan.way.working">
              <p class="working-title">{WAY.working.title}</p>
              <p>{WAY.working.body}</p>
              {run.progress && run.progress.total > 0
                ? <progress value={run.progress.done} max={run.progress.total} aria-label={WAY.working.progress} />
                : <progress aria-label={WAY.working.progress} />}
              {run.slow && <p class="working-slow">{WAY.working.slow}</p>}
            </div>
          )}
          {run.status === 'failed' && run.reason === 'noWorker' && (
            <div class="notice" role="alert" data-testid="plan.way.noWorker">
              <p>{WAY.failed.noWorker}</p>
              {!V.readonly && <Button testid="plan.way.noWorkerPlanner" kind="quiet" onClick={() => onChange('way')}>{WAY.buttons.inPlanner}</Button>}
            </div>
          )}
          {run.status === 'failed' && run.reason !== 'noWorker' && (
            <div class="notice" role="alert" data-testid="plan.way.failed">
              <p>{WAY.failed.title}</p>
              <p>{WAY.failed.body}</p>
              <Button testid="plan.way.retry" kind="quiet" onClick={() => dispatch({ type: 'ways/retry' })}>{WAY.buttons.tryAgain}</Button>
            </div>
          )}
          {V.has && V.ran && <p class="plan-source" data-testid="plan.way.ran">{fill(WAY.ran.nine, { s: seconds(V.ran.ms) })}</p>}
        </section>
        {yours && (
          <section class="plan-section way-yours" data-section="yours">
            <h2>{WAY.yours}</h2>
            <Card card={yours} V={V} planId={planId} dispatch={dispatch} />
          </section>
        )}
        {others.length > 0 && (
          <section class="plan-section way-others" data-section="others">
            <h2>{WAY.others}</h2>
            <p class="note">{WAY.othersLead}</p>
            <ol class="way-list" data-testid="plan.way.others">
              {others.map((c) => <li key={c.id}><Card card={c} V={V} planId={planId} dispatch={dispatch} /></li>)}
            </ol>
          </section>
        )}
        {V.has && <More V={V} dispatch={dispatch} />}
        {problem && <p class="notice" role="alert" data-testid="plan.way.problem" data-problem={V.problem}>{problem}</p>}
        {V.saving && V.saving.kind === 'way' && <p class="working-note" role="status" data-testid="plan.way.saving">{WAY.saving}</p>}
        <div class="actions-row">
          <LinkButton testid="plan.way.back" kind="quiet" href={back}>{WAY.buttons.back}</LinkButton>
        </div>
        <UndoToast prefix="plan.way" toast={V.toast} text={V.toast ? toastText(V.toast) : ''} words={WAY.buttons}
          onUndo={() => dispatch({ type: 'plan/undo', planId })} onClose={() => dispatch({ type: 'plan/toastClose' })} />
      </>
    )
  };
}
