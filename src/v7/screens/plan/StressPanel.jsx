/**
 * "Try the bad years" (7.9.0; research/v7/replan-nov-2026.md §5; the build spec's §2.1), a section of "Does it last?" on any
 * plan, locked or not: each row runs this plan again on the same futures with one thing made worse. Draws only — the rows,
 * their figures and their words' slots are the reading's (state/select.js planStressView: answers/plan/stressPanel.js
 * stressPanelView through the plan source), the run's status the state's (effects/stressPanel.js). The rows run only when
 * "Try the bad years" is pressed. "I accept this risk" on a row is ONE write after a confirm on the screen (plan/amend with
 * the row); an agreement shows, with Withdraw, before anything is run, and an agreed row offers Withdraw, never a second
 * accept ("I accept this risk" is a quiet button: nothing on the panel presses for it). The held rows say the keep
 * agreement's state once, as information, and never write: that is accepted on What you hold. What still comes in if the
 * money runs out, and why a locked ladder's four market rows are not tried, are each said once, above the rows. A link
 * inside a note stands on its own line, so a phone's tap target never stretches the sentence it follows.
 */
import { Button } from '../../components/index.js';
import { changeAction } from '../../components/PlanFigures.jsx';
import { sayStress, StressChance, StressMore } from '../../components/StressStrip.jsx';
import { planStressView } from '../../state/select.js';
import { href } from '../../router/routes.js';
import { STRESS } from '../../copy/stressPanel.js';
import { LASTS } from '../../copy/lasts.js';
import { sayKeep } from './KeepTest.jsx';

const keepFocus = { onMouseDown: (e) => e.preventDefault() };
/** The problems a row's accept or withdraw can have (stressPanel.stressAmendPatch's refusals); the form says the rest. */
export const STRESS_PROBLEMS = Object.freeze(['oldResult', 'same', 'nothingFails', 'noResult', 'none']);


/** A line of a row under "More about this line". */
function Line({ l }) {
  return <p class="stress-line" data-line={l.id}>{sayStress(l)}</p>;
}

/** What was accepted on a row: the date and the figures, the weighted one beside its fixed-age count; out of date said. */
function Accepted({ p, testid }) {
  if (!p) return null;
  return (
    <p class={p.stale ? 'notice' : 'note'} data-testid={testid} data-status={p.stale ? 'stale' : 'agreed'}>
      {p.fixed ? (
        <>
          <span data-weighted="1">{sayStress(p)}</span>
          <span data-fixed="age">{sayStress(p.fixed)}</span>
        </>
      ) : sayStress(p)}
      {p.stale ? ' ' + STRESS.agreement.stale : ''}
    </p>
  );
}

/**
 * After "Yes, I accept it": once the row's accepted line is drawn (the write done), it is brought into view, so the page never
 * ends up away from the row the person was reading (the confirm above it closes as the line arrives). Gives up after 8 s.
 */
function keepInView(testid) {
  if (typeof document === 'undefined') return;
  let tries = 0;
  const tick = () => {
    const el = document.querySelector(`[data-testid="${testid}"][data-status="agreed"]`);
    if (el) { if (typeof el.scrollIntoView === 'function') el.scrollIntoView({ block: 'nearest' }); return; }
    if (++tries < 80) setTimeout(tick, 100);
  };
  setTimeout(tick, 0);
}

/** The confirm of "I accept this risk": the figures said back, the weighted clause beside its fixed-age one. */
function Confirm({ row, v, dispatch, T }) {
  const c = row.parts.confirm;
  const [before, after] = STRESS.agreement.confirm.split('{figures}');
  return (
    <div class="notice lock-confirm" role="region" aria-label={STRESS.agreement.accept} data-testid={`${T}.confirm`}>
      <p>
        {before}
        {c.figures.weighted ? <><span data-weighted="1">{c.figures.weighted}</span>; <span data-fixed="age">{c.figures.fixed}</span></> : c.figures.fixed}
        {after}
      </p>
      <div class="actions-row">
        <Button testid={`${T}.confirm.yes`} kind="primary" disabled={!!v.saving} onClick={() => { dispatch({ type: 'plan/amend', planId: v.planId, op: 'accept', kind: row.kind, testId: row.id }); keepInView(`${T}.accepted`); }} {...keepFocus}>{STRESS.agreement.yes}</Button>
        <Button testid={`${T}.confirm.no`} kind="quiet" onClick={() => dispatch({ type: 'ui/toggle', id: 'stressConfirm.' + row.id })} {...keepFocus}>{STRESS.agreement.no}</Button>
      </div>
    </div>
  );
}

/**
 * One row: its title and what it changes; its chance beside its fixed-age count and where it runs out (or why there are
 * none); the rest under "More about this line", closed; the agreement.
 */
function Row({ row, v, dispatch, planId }) {
  const T = `plan.lasts.stress.${row.id}`;
  const p = row.parts;
  const can = !v.readonly;
  const confirmOpen = v.confirmOpen.includes(row.id);
  const held = !row.kind;
  const more = p.more.length > 0;
  const withdraw = can && !!(row.agreement && row.agreement.entry);
  const accept = can && row.canAccept && !confirmOpen;
  return (
    <li class="block stress-row" data-row={row.id} data-status={row.status} data-same={row.same ? '1' : '0'} data-testid={T}>
      <h3 class="stress-title">{sayStress(p.title)}{row.a && row.status === 'done' && !row.na && !row.same && <> <span class={`verdict-word is-${row.a.verdict}`} data-verdict={row.a.verdict}>{LASTS.verdict.word[row.a.verdict]}</span></>}</h3>
      {p.what.map((w, i) => <p key={i} class="note">{sayStress(w)}</p>)}
      {p.na && <p class="note" data-testid={`${T}.na`} data-na={row.na || 'same'}>{p.na.id === 'na.notCounted' ? STRESS.na.notCounted : sayStress(p.na)}</p>}
      <StressChance c={p.chance} />
      {p.runsOut && <p class="line stress-line" data-line="runsOut">{sayStress(p.runsOut)}</p>}
      {p.closedYear && <p class="line stress-line" data-line="closedYear">{sayStress(p.closedYear)}</p>}
      {p.heldGap && <p class="note" data-testid={`${T}.gap`}>{sayStress(p.heldGap)}</p>}
      {row.id === 'fall' && can && !row.na && (
        <p class="note"><a href="#" data-testid="plan.lasts.stress.badStarts" onClick={(e) => { e.preventDefault(); dispatch(changeAction(planId, 'badStarts', href.plan(planId, 'lasts'))); }}>{STRESS.handOver}</a></p>
      )}
      {held && p.keepLine && (
        <>
          <p class="note" data-testid={`${T}.keep`} data-status={row.keep ? row.keep.status : ''}>{sayStress(p.keepLine)}</p>
          <p class="note"><a href={href.plan(planId, 'hold')} data-testid={`${T}.hold`}>{sayStress(p.holdLink)}</a></p>
        </>
      )}
      <Accepted p={p.accepted} testid={`${T}.accepted`} />
      {/* the row's foot, one line while closed: "More about this line" beside its quiet Withdraw or "I accept this risk" */}
      {(more || withdraw || accept) && (
        <div class="stress-foot">
          {more && <StressMore testid={`${T}.more`}>{p.more.map((l, i) => <Line key={i} l={l} />)}</StressMore>}
          {withdraw && (
            <div class="actions-row"><Button testid={`${T}.withdraw`} kind="quiet" disabled={!!v.saving} onClick={() => dispatch({ type: 'plan/amend', planId: v.planId, op: 'withdraw', kind: row.kind, testId: row.id })} {...keepFocus}>{STRESS.agreement.withdraw}</Button></div>
          )}
          {accept && (
            <div class="actions-row"><Button testid={`${T}.accept`} kind="quiet" disabled={!!v.saving} onClick={() => dispatch({ type: 'ui/toggle', id: 'stressConfirm.' + row.id })} {...keepFocus}>{STRESS.agreement.accept}</Button></div>
          )}
        </div>
      )}
      {can && row.canAccept && confirmOpen && p.confirm && <Confirm row={row} v={v} dispatch={dispatch} T={T} />}
      {v.saving && v.saving.testId === row.id && <p class="working-note" role="status" data-testid={`${T}.saving`}>{STRESS.agreement.saving}</p>}
    </li>
  );
}

/** The agreements on the plan before anything is tried, each with its date, its figures and Withdraw (no run needed). */
function Agreements({ v, dispatch }) {
  if (!v.agreements.length) return null;
  return (
    <div class="stress-agreed" data-testid="plan.lasts.stress.agreements">
      <h3>{STRESS.acceptedTitle}</h3>
      <ul class="stress-rows">
        {v.agreements.map((g) => (
          <li key={g.id} class="block stress-row" data-row={g.id} data-testid={`plan.lasts.stress.agreement.${g.id}`}>
            <h4 class="stress-title">{sayStress(g.parts.title)}</h4>
            <Accepted p={{ ...g.parts.accepted, stale: g.parts.stale }} testid={`plan.lasts.stress.agreement.${g.id}.line`} />
            {!v.readonly && <div class="actions-row"><Button testid={`plan.lasts.stress.agreement.${g.id}.withdraw`} kind="quiet" disabled={!!v.saving} onClick={() => dispatch({ type: 'plan/amend', planId: v.planId, op: 'withdraw', kind: g.kind, testId: g.id })} {...keepFocus}>{STRESS.agreement.withdraw}</Button></div>}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** The toast of an accept or a withdraw on a row: what was done, with Undo. */
function Toast({ v, dispatch }) {
  const t = v.toast;
  if (!t) return null;
  const text = t.kind === 'undone' ? LASTS.toast.undone : t.line && t.line.id === 'stressWithdrawn' ? sayStress({ id: 'agreement.withdrawn', slots: t.line.slots }) : sayStress({ id: 'agreement.acceptedNow', slots: t.line ? t.line.slots : {} });
  return (
    <div class={`undo-toast is-${t.kind}`} role="status" data-testid="plan.lasts.stress.toast" data-kind={t.kind}>
      <span class="undo-toast-message">{text}</span>
      {t.kind === 'saved' && <Button testid="plan.lasts.stress.undo" kind="quiet" class="undo-toast-btn" onClick={() => dispatch({ type: 'plan/undo', planId: t.planId })}>{LASTS.buttons.undo}</Button>}
      <Button testid="plan.lasts.stress.toastClose" kind="quiet" class="undo-toast-close" aria-label={LASTS.buttons.close} onClick={() => dispatch({ type: 'plan/toastClose' })}>×</Button>
    </div>
  );
}

export function StressPanel({ state, dispatch }) {
  const v = planStressView(state);
  if (!v || v.hidden) return null;
  const run = v.run || { status: 'idle' };
  // once pressed (or with rows tried earlier for the plan as it is now): the rows; before, what is accepted and the button
  const tried = run.status !== 'idle' || v.rows.some((r) => r.status === 'done');
  const press = () => dispatch({ type: 'stress/run', key: v.key, planId: v.planId, rows: v.order });
  // (a problem of the dials' own save is said by the form; one of a row's accept or withdraw is said here)
  const problem = v.problem && STRESS_PROBLEMS.includes(v.problem) ? (STRESS.agreement.problems[v.problem] || STRESS.agreement.problems.failed) : null;
  return (
    <section class="plan-section lasts-stress" data-section="stress" data-testid="plan.lasts.stress" data-status={run.status} data-key={v.key}>
      <h2 tabIndex={-1} {...(v.settled ? { 'data-focus-for': 'plan.stress' } : {})}>{STRESS.title}</h2>
      <p class="note">{STRESS.lead}</p>
      {!tried && v.keep && v.keep.line && (
        <>
          <p class="note" data-testid="plan.lasts.stress.keep" data-status={v.keep.status}>{sayKeep(v.keep.line)}</p>
          <p class="note"><a href={href.plan(v.planId, 'hold')} data-testid="plan.lasts.stress.keepHold">{sayStress(v.keep.link)}</a></p>
        </>
      )}
      {!tried && <Agreements v={v} dispatch={dispatch} />}
      <div class="actions-row">
        <Button testid="plan.lasts.stress.run" kind={tried ? 'quiet' : 'primary'} disabled={run.status === 'working' || !v.order.length} onClick={press} {...keepFocus}>{tried ? STRESS.again : STRESS.run}</Button>
      </div>
      {run.status === 'working' && <p class="note" role="status" data-testid="plan.lasts.stress.working">{sayStress({ id: 'working', slots: { i: String(Math.min(run.total, run.done + 1)), n: String(run.total) } })}</p>}
      {run.status === 'failed' && <p class="notice" role="alert" data-testid="plan.lasts.stress.failed">{run.reason === 'noWorker' ? STRESS.noWorker : STRESS.failed}</p>}
      {tried && v.floor && <p class="line stress-floor" data-testid="plan.lasts.stress.floor">{sayStress(v.floor)}</p>}
      {tried && v.notTried && <p class="note" data-testid="plan.lasts.stress.notTried" data-na="lockedLadder">{sayStress(v.notTried)}</p>}
      {tried && (
        <ul class="stress-rows" data-testid="plan.lasts.stress.rows">
          {v.rows.map((row) => <Row key={row.id} row={row} v={v} dispatch={dispatch} planId={v.planId} />)}
        </ul>
      )}
      {problem && <p class="notice" role="alert" data-testid="plan.lasts.stress.problem" data-problem={v.problem}>{problem}</p>}
      <Toast v={v} dispatch={dispatch} />
    </section>
  );
}
