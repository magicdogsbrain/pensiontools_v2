/**
 * "Your review" (7.10.0; research/v7/replan-nov-2026.md §6; spec-7100 §4): one page in every phase, on #/plan/<id>/review.
 *   - Saving: the check-in itself (CheckInScreen), with the choices under it;
 *   - Moving: how far what is held is from the mix the plan moves to, on today's pension, and whether the move is on course;
 *   - Living on it: the pots today, what was taken since 6 April and the year ahead, against the plan as locked.
 * Every phase shows the rule for off course and how often; Saving and Moving the move window and the saving level — each
 * with "Change", each its own write. Nothing else is written unless the person presses a named button.
 *
 * Draws only: the reading is the plan source's (answers/plan/review.js through state/select.js planReviewView). No figure is
 * worked out here.
 */
import { PlanRail, changeAction, EditField, UndoToast, fill, Button, LinkButton } from '../../components/index.js';
import { LOCK_DATE } from '../../components/facts.js';
import { fillMarked } from '../../components/PlanFigures.jsx';
import { ADVICE_SHORT } from '../../copy/common.js';
import { planView, planReviewView } from '../../state/select.js';
import { href } from '../../router/routes.js';
import { PLAN } from '../../copy/plan.js';
import { REVIEW as W } from '../../copy/review.js';
import { STRESS } from '../../copy/stressPanel.js';
import { CheckInScreen } from './CheckInScreen.jsx';

const w = PLAN.page;
const keepFocus = { onMouseDown: (e) => e.preventDefault() };
const T = 'plan.review';

function Head({ view }) {
  return (
    <div class="plan-head">
      <p class="plan-kicker">{w.title} <span class="plan-name">‘{view.name}’</span></p>
      <p class="plan-stage-line" data-testid="plan.stageLine">{view.line ? fill(PLAN.stageLines[view.line.id], view.line.slots) : ''}{view.lockedOn ? <> {fillMarked(w.lockedOn, { date: view.lockedOn }, LOCK_DATE)}</> : ''}</p>
      {view.readonly && <p class="notice" role="status" data-testid="plan.readonly">{w.shownAsSaved}</p>}
      {view.source === 'window' && <p class="note" data-testid="plan.windowWarning">{w.windowWarning}</p>}
    </div>
  );
}

/** The title, how often it falls, when it is next, and off course when it is. */
function Top({ V }) {
  return (
    <>
      {/* how often it falls, only while it falls at all: "whenever you like" says no "Due" (7.10.0) */}
      {V.due && V.due.next && <p class="lead" data-testid={`${T}.often`} data-often={V.often}>{W.often[V.often]}</p>}
      {V.due && V.due.due && <p class="notice" role="status" data-testid={`${T}.dueNow`}>{W.dueNow}</p>}
      {V.due && !V.due.due && <p data-testid={`${T}.next`}>{V.due.next ? fill(W.next, { month: V.due.next }) : W.nextAny}</p>}
      {V.last && <p class="note" data-testid={`${T}.last`}>{fill(W.last, V.last)}</p>}
      {V.offCourse && (
        <p class="notice" role="status" data-testid={`${T}.offCourse`} data-kind={V.offCourse.kind}>
          {V.offCourse.kind === 'guardrails' ? W.offCourse.guardrails : fill(V.offCourse.a && V.offCourse.b ? W.offCourse.success : W.offCourse.plain, { a: V.offCourse.a || '', b: V.offCourse.b || '', line: V.offCourse.line || '' })}
        </p>
      )}
      {V.closing && <p class="notice" role="status" data-testid={`${T}.closing`}>{fill(W.closing, V.closing)}</p>}
      {!V.closing && V.closed && <p class="notice" role="status" data-testid={`${T}.closed`}>{W.closed}</p>}
      {V.example && <p class="note" data-testid={`${T}.example`}>{W.example}</p>}
    </>
  );
}

/**
 * One choice: what it is now, "Change", and the options while open (each press is its own write). The option the plan reads
 * now closes the options when the person chose it before (`stored`); while it is only read (a default, or read from what is
 * held), pressing it is the person's choice and is written, as any other.
 */
function Choice({ id, title, line, options, value, stored = true, open, editable, dispatch, planId, part, saving, extra = null }) {
  return (
    <div class="review-choice" data-choice={id} data-testid={`${T}.choice.${id}`}>
      <h3>{title}</h3>
      <p data-testid={`${T}.choice.${id}.line`}>{line}</p>
      {extra}
      {editable && !open && (
        <div class="actions-row">
          <Button testid={`${T}.choice.${id}.change`} kind="quiet" onClick={() => dispatch({ type: 'ui/toggle', id: 'reviewChange.' + id })} {...keepFocus}>{W.change}</Button>
        </div>
      )}
      {editable && open && (
        <div class="actions-row review-options" role="group" aria-label={title}>
          {options.map((o) => (
            <Button key={String(o.value)} testid={`${T}.choice.${id}.${o.value}`} kind={o.value === value ? 'plain' : 'quiet'} aria-pressed={o.value === value ? 'true' : 'false'} disabled={!!saving}
              onClick={() => (o.value === value && stored ? dispatch({ type: 'ui/toggle', id: 'reviewChange.' + id }) : dispatch({ type: 'plan/phaseSet', planId, part, value: o.value }))} {...keepFocus}>{o.label}</Button>
          ))}
          <Button testid={`${T}.choice.${id}.cancel`} kind="quiet" onClick={() => dispatch({ type: 'ui/toggle', id: 'reviewChange.' + id })} {...keepFocus}>{W.cancel}</Button>
        </div>
      )}
    </div>
  );
}

/** The rule, how often, the move window and the saving level. */
function Choices({ V, dispatch }) {
  const ed = V.editable;
  const planId = V.id;
  const ruleLine = (o) => (o.kind === 'guardrails' ? W.rule.guardrails : fill(W.rule.success, { n: String(o.line) }));
  const rule = V.rule;
  const mw = V.moveWindow;
  const winLine = mw ? (mw.years === 1 ? W.moveWindow.lineOne : fill(W.moveWindow.line, { n: String(mw.years) })) : null;
  // once a year: from 6 April while living on it (by the tax year), else from the last review — the title's own words
  const everyWords = (v) => (v === 'year' && V.phase !== 'drawing' ? W.every.yearPlain : W.every.options[v]);
  return (
    <section class="plan-section review-choices" data-section="choices" data-testid={`${T}.choices`}>
      <Choice id="rule" part="review.rule" title={W.rule.title} line={ruleLine(rule)} value={rule.value} stored={!!rule.stored} open={V.changing.rule} editable={ed} dispatch={dispatch} planId={planId} saving={V.saving}
        options={rule.options.map((o) => ({ value: o.value, label: ruleLine(o) }))} extra={<p class="note">{W.rule.never}</p>} />
      {V.every ? (
        <Choice id="every" part="review.every" title={W.every.title} line={everyWords(V.every.value)} value={V.every.value} stored={!!V.every.stored} open={V.changing.every} editable={ed} dispatch={dispatch} planId={planId} saving={V.saving}
          options={V.every.options.map((o) => ({ value: o, label: everyWords(o) }))} />
      ) : (
        <div class="review-choice" data-choice="every" data-testid={`${T}.choice.every`}><h3>{W.every.title}</h3><p class="note">{W.every.saving}</p></div>
      )}
      {mw && (
        <Choice id="window" part="window" title={W.moveWindow.title} line={winLine} value={mw.years} stored={!!mw.stored} open={V.changing.moveWindow} editable={ed} dispatch={dispatch} planId={planId} saving={V.saving}
          options={mw.options.map((n) => ({ value: n, label: W.moveWindow.options[n] }))}
          extra={mw.from && mw.to ? <p class="note" data-testid={`${T}.choice.window.when`}>{fill(W.moveWindow.when, { from: mw.from, to: mw.to })}</p> : null} />
      )}
      {V.level && (
        <Choice id="level" part="saving.level" title={W.level.title} line={W.level.line[V.level.value]} value={V.level.value} stored={!!V.level.stored} open={V.changing.level} editable={ed} dispatch={dispatch} planId={planId} saving={V.saving}
          options={V.level.options.map((o) => ({ value: o, label: W.level.options[o] }))} extra={V.level.stored ? null : <p class="note" data-testid={`${T}.choice.level.read`} data-from={V.level.from || 'default'}>{W.level.read[V.level.from] || W.level.read.default}</p>} />
      )}
    </section>
  );
}

/** Moving: how far what is held is from the mix the plan moves to, on today's pension. */
function MoveReview({ V }) {
  const M = V.moving;
  const planId = V.id;
  return (
    <section class="plan-section review-moving" data-section="moving" data-testid={`${T}.moving`} data-record={M.record ? '1' : '0'}>
      {V.confirmStop
        ? <p class="notice" role="status" data-testid={`${T}.confirmStop`}>{fill(W.moving.confirmStop, V.confirmStop)} <a href={href.plan(planId, 'about')}>{W.aboutLink}</a></p>
        : <p class="lead" data-testid={`${T}.moving.lead`}>{M.monthsLeftWords && M.stopWords ? fill(W.moving.lead, { left: M.monthsLeftWords, stop: M.stopWords }) : W.moving.leadNoStop}</p>}
      {!M.record && <p class="note" data-testid={`${T}.moving.noRecord`}>{W.moving.noRecord} <a href={href.plan(planId, 'hold')}>{W.moving.holdLink}</a></p>}
      {M.buckets && (
        <>
          <h2>{W.moving.title}</h2>
          <ul class="review-buckets" data-testid={`${T}.moving.buckets`}>
            {M.buckets.map((b) => <li key={b.bucket} data-bucket={b.bucket} data-held={b.held} data-plan={b.plan}>{fill(W.moving.bucket[b.bucket], { held: String(b.held), plan: String(b.plan) })}</li>)}
          </ul>
          {M.onTrack && (M.onTrack.on
            ? <p data-testid={`${T}.moving.onTrack`} data-on="1">{fill(W.moving.onTrack, { stop: M.stopWords || '' })}</p>
            : <p data-testid={`${T}.moving.onTrack`} data-on="0">{fill(W.moving.behind, { n: String(M.toMove) })}</p>)}
        </>
      )}
      {M.untagged.map((name) => <p class="note" key={name} data-testid={`${T}.moving.untagged`}>{fill(W.moving.untagged, { name })}</p>)}
      {M.noReading && <p class="note" data-testid={`${T}.moving.noReading`}>{W.moving.noReading}</p>}
      {M.ladder && (
        <>
          <p data-testid={`${T}.moving.ladder`}>{fill(W.moving.ladder, { held: String(M.ladder.held), needed: String(M.ladder.needed) })}</p>
          {M.ladder.years.length > 0 && <p class="note" data-testid={`${T}.moving.ladderYears`}>{fill(W.moving.ladderYears, { years: M.ladder.years.join(', ') })}</p>}
        </>
      )}
      {M.ladderLater && <p class="note" data-testid={`${T}.moving.ladderLater`}>{W.moving.ladderLater}</p>}
      <p class="note"><a href={href.plan(planId, 'move')}>{W.moving.moveLink}</a> · <a href={href.plan(planId, 'hold')}>{W.moving.holdLink}</a></p>
    </section>
  );
}

/** Living on it: the boxes, and what they read against the plan as locked. */
function LivingReview({ V, dispatch }) {
  const L = V.living;
  const planId = V.id;
  const words = (path) => { const x = W.living.fields[path]; return path === 'rv.took' ? { ...x, label: fill(x.label, { year: L.taxYearFrom }) } : x; };
  const F = (f) => <EditField key={f.path} step="review" f={f} words={words(f.path)} errors={W.living.errors} source={null} planId={planId} dispatch={dispatch} />;
  return (
    <section class="plan-section review-living" data-section="living" data-testid={`${T}.living`} data-locked={L.locked ? '1' : '0'}>
      <h2>{W.living.asksTitle}</h2>
      <p class="note" data-testid={`${T}.living.from`}>{L.start.potsFrom === 'record' && L.start.potsAsOf ? fill(W.living.fromRecord, { month: L.start.potsAsOf }) : W.living.fromPlan}
        {L.locked && L.start.tookMonths > 0 ? ' ' + fill(W.living.tookFromRecord, { n: L.start.tookMonths === 1 ? '1 month' : L.start.tookMonths + ' months' }) : ''}</p>
      {V.editable && <div class="review-boxes">{L.fields.map(F)}</div>}
      {!L.locked && <p class="note" data-testid={`${T}.living.unlocked`}>{W.living.unlocked}</p>}
      {L.later && <p class="note" data-testid={`${T}.living.later`}>{fill(W.living.later, L.later)}</p>}
      {/* what is held against the plan's own mix (a pension record a pot plan can read): what "Test with what I hold" tries */}
      {L.held && (
        <div class="review-held" data-testid={`${T}.living.held`}>
          <h3>{W.living.held.title}</h3>
          <ul class="review-buckets" data-testid={`${T}.living.held.buckets`}>
            {L.held.buckets.map((b) => <li key={b.bucket} data-bucket={b.bucket} data-held={b.held} data-plan={b.plan}>{fill(W.living.held.bucket[b.bucket], { held: String(b.held), plan: String(b.plan) })}</li>)}
          </ul>
          {L.held.untagged.map((name) => <p class="note" key={name} data-testid={`${T}.living.held.untagged`}>{fill(W.moving.untagged, { name })}</p>)}
        </div>
      )}
      {L.locked && !L.later && (L.band || L.guardrail || L.taken || L.ladder) && (
        <div class="review-reading" data-testid={`${T}.living.reading`}>
          <h3>{W.living.readingTitle}</h3>
          {L.band && <p data-testid={`${T}.living.band`} data-band={L.band.id}>{fill(W.living.band[L.band.id], L.band.slots)}</p>}
          {L.guardrail && <p data-testid={`${T}.living.guardrail`} data-guardrail={L.guardrail.state}>{fill(STRESS.guardrail[L.guardrail.state], L.guardrail.slots)}</p>}
          {L.taken && <p data-testid={`${T}.living.taken`}>{fill(L.taken.entered ? W.living.takenEntered : W.living.taken, L.taken)}</p>}
          {L.ladder && <p data-testid={`${T}.living.ladder`}>{L.ladder.instruction}</p>}
        </div>
      )}
      {L.locked && <p class="note" data-testid={`${T}.living.note`}>{W.living.note} <a href={href.plan(planId, 'lasts')} data-testid={`${T}.living.try`}>{W.living.tryLink}</a></p>}
      {/* not locked yet: the way to see what a change does, on "Does it last?" (spec-7100 §4.2) */}
      {!L.locked && <p class="note" data-testid={`${T}.living.tryUnlocked`}>{W.living.tryUnlocked} <a href={href.plan(planId, 'lasts')} data-testid={`${T}.living.try`}>{W.living.tryLink}</a></p>}
    </section>
  );
}

/**
 * What is typically left, in the result's words: the middle of every future tried, or that more than half have nothing left
 * then; beside the reference's figure on a held result.
 */
function leftWords(R, res, slots) {
  const held = res.id === 'held' || res.id === 'heldFixed';
  if (res.left === 'none') return held && slots.refLeft ? R.heldLeftNone : R.leftNone;
  return held && slots.refLeft ? R.heldLeft : R.left;
}

/** The run: its button on a press, its progress, and what it worked out (held for this page, for these inputs only). */
function Run({ V, dispatch }) {
  const run = V.run;
  if (!run || !V.editable) return null;
  const res = V.result || { status: 'idle' };
  const working = res.status === 'working';
  const living = V.phase === 'drawing';
  const label = living ? (run.label === 'held' ? W.living.run.held : W.living.run.button) : W.moving.run[run.label];
  const busy = living ? W.living.run.working : W.moving.run.working;
  const R = living ? W.living.result : W.moving.result;
  const slots = res.slots ? { ...res.slots, on: res.on ? W.living.result.on[res.on] : '' } : {};
  return (
    <section class="plan-section review-run" data-section="run" data-testid={`${T}.run`} data-status={res.status}>
      <div class="actions-row">
        <Button testid={`${T}.run.button`} kind={res.status === 'done' ? 'quiet' : 'plain'} disabled={working} aria-busy={working ? 'true' : undefined}
          onClick={() => dispatch({ type: 'review/run', key: run.key, planId: V.id, rows: run.rows, pots: run.pots })} {...keepFocus}>{working ? busy : label}</Button>
      </div>
      {working && <p class="working-note" role="status" data-testid={`${T}.run.working`}>{busy}</p>}
      {res.status === 'failed' && <p class="notice" role="alert" data-testid={`${T}.run.problem`}>{res.reason === 'noWorker' ? W.run.noWorker : W.run.failed}</p>}
      {res.status === 'done' && res.id === 'na' && <p class="note" data-testid={`${T}.run.na`}>{W.run.na}</p>}
      {res.status === 'done' && res.id !== 'na' && (
        <div class="review-result" data-testid={`${T}.run.result`} data-result={res.id}>
          <p data-testid={`${T}.run.line`}>{fill(R[res.id], slots)}</p>
          {res.left && <p class="note" data-testid={`${T}.run.left`} data-left={res.left}>{fill(leftWords(R, res, slots), slots)}</p>}
          <p class="note">{W.run.kept}</p>
        </div>
      )}
    </section>
  );
}

/** "I accept this as my plan" (Moving): the press, the confirm on the screen, the accepted line, why it is stale, Withdraw. */
function Agreement({ V, dispatch, open }) {
  const G = V.agreement;
  if (!G) return null;
  const A = W.agreement;
  const name = (id) => PLAN.strategies[id] || id || '';
  const clauses = G.confirm ? fill(A[G.confirm.id], G.confirm.slots) : '';
  // of what is held, or (no pension record) of the plan as it stands: the words never say "what you hold" of nothing recorded
  const asItStands = G.of === 'asItStands';
  return (
    <section class="plan-section review-agreement" data-section="agreement" data-testid={`${T}.agreement`} data-status={G.status} data-how={G.how || undefined}>
      <h2>{asItStands ? A.titleAsItStands : A.title}</h2>
      {G.accepted && <p data-testid={`${T}.agreement.accepted`}>{fill(A[G.accepted.id], { ...G.accepted.slots, what: A.what[G.of] || A.what.held })}</p>}
      {G.stale && <p class="notice" role="status" data-testid={`${T}.agreement.stale`} data-why={G.stale.why}>{fill(A.stale[G.stale.why] || A.stale.version, { date: G.stale.date, old: name(G.stale.old), now: name(G.stale.now) })}</p>}
      {G.canAccept && !open && (
        <div class="actions-row">
          <Button testid={`${T}.agreement.accept`} kind="plain" disabled={!!V.saving} onClick={() => dispatch({ type: 'ui/toggle', id: 'agreeConfirm' })} {...keepFocus}>{A.accept}</Button>
          <LinkButton testid={`${T}.agreement.notYet`} kind="quiet" href={href.plan(V.id)}>{A.notYet}</LinkButton>
        </div>
      )}
      {G.canAccept && open && (
        <div class="confirm" role="group" data-testid={`${T}.agreement.confirm`}>
          <p>{fill(G.phase === 'drawing' ? A.confirmLiving : asItStands ? A.confirmAsItStands : A.confirm, { clauses })}</p>
          <div class="actions-row">
            <Button testid={`${T}.agreement.yes`} kind="primary" disabled={!!V.saving} onClick={() => dispatch({ type: 'plan/agree', planId: V.id })} {...keepFocus}>{A.yes}</Button>
            <Button testid={`${T}.agreement.no`} kind="quiet" onClick={() => dispatch({ type: 'ui/toggle', id: 'agreeConfirm' })} {...keepFocus}>{A.no}</Button>
          </div>
        </div>
      )}
      {G.withdrawable && (
        <div class="actions-row">
          <Button testid={`${T}.agreement.withdraw`} kind="quiet" disabled={!!V.saving} onClick={() => dispatch({ type: 'plan/agreeWithdraw', planId: V.id })} {...keepFocus}>{A.withdraw}</Button>
        </div>
      )}
    </section>
  );
}

const toastText = (toast) => {
  if (toast.kind === 'undone') return W.toast.undone;
  if (toast.kind === 'unchanged') return W.toast.unchanged;
  const line = toast.line;
  if (!line) return W.toast.unchanged;
  if (line.id === 'reviewSaved') return fill(W.toast.saved, line.slots || {});
  if (line.id === 'reviewSavedAny') return W.toast.savedAny;
  const v = line.slots ? line.slots.value : '';
  if (line.id === 'phase.window') return fill(W.toast.moveWindow, { n: W.moveWindow.options[v] || v });
  if (line.id === 'phase.saving.level') return fill(W.toast.level, { level: String(W.level.options[v] || v).toLowerCase() });
  if (line.id === 'phase.review.every') return fill(W.toast.every, { every: String(W.every.options[v] || v).toLowerCase() });
  if (line.id === 'phase.review.rule') return W.toast.rule;
  if (line.id === 'agreed') return W.toast.agreed;
  if (line.id === 'agreedAsItStands') return W.toast.agreedAsItStands;
  if (line.id === 'agreeWithdrawn') return W.toast.agreeWithdrawn;
  return W.toast.unchanged;
};

export function ReviewScreen(state, dispatch) {
  const view = planView(state);
  const V = planReviewView(state);
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
  const problem = V.problem ? (W.problems[V.problem] || W.problems.failed) : null;
  // a saver's review is the check-in itself, with the choices under it
  if (V.phase === 'saving') {
    const ci = CheckInScreen(state, dispatch);
    return {
      ...ci,
      content: (
        <>
          {ci.content}
          <section class="block plan-section" data-testid={T} data-phase="saving">
            <h2>{W.title}</h2>
            <Top V={V} />
            {problem && V.saving === null && <p class="notice" role="alert" data-testid={`${T}.problem`} data-problem={V.problem}>{problem}</p>}
            <Choices V={V} dispatch={dispatch} />
          </section>
          {/* a choice's own toast, with Undo (the check-in's toast says the check-in's writes) */}
          <UndoToast prefix={T} toast={V.toast && V.toast.op === 'phase' ? V.toast : null} text={V.toast ? toastText(V.toast) : ''} words={W.buttons}
            onUndo={() => dispatch({ type: 'plan/undo', planId })} onClose={() => dispatch({ type: 'plan/toastClose' })} />
        </>
      )
    };
  }
  const onChange = (place, id = view.id, month = null) => dispatch(changeAction(id, place, href.plan(view.id, 'review'), month));
  const rail = <PlanRail view={view} state={state} dispatch={dispatch} onChange={onChange} />;
  const saving = !!(V.saving && V.saving.kind === 'reviewSave');
  return {
    question: null, rail, full: false,
    content: (
      <>
        <Head view={view} />
        <h1 tabIndex={-1} data-testid="plan.step.review" data-phase={V.phase || 'none'}>{W.title}</h1>
        {V.phase === null && <p class="notice" role="status" data-testid={`${T}.noAge`}>{W.noAge} <a href={href.plan(planId, 'about')}>{W.aboutLink}</a></p>}
        <Top V={V} />
        {V.moving && <MoveReview V={V} />}
        {V.living && <LivingReview V={V} dispatch={dispatch} />}
        {V.documentReading && <p class="note" data-testid={`${T}.living.ladderKept`}>{W.living.ladder}</p>}
        <Run V={V} dispatch={dispatch} />
        <Agreement V={V} dispatch={dispatch} open={(state.ui.open || []).includes('agreeConfirm')} />
        {V.save && (
          <form class="ask review-save" noValidate onSubmit={(e) => { e.preventDefault(); dispatch({ type: 'plan/reviewSave', planId }); }} data-region="plan-review" aria-busy={saving ? 'true' : undefined}>
            {problem && <p class="notice" role="alert" data-testid={`${T}.problem`} data-problem={V.problem}>{problem}</p>}
            <div class="actions-row">
              <Button testid={`${T}.save`} kind="primary" type="submit" disabled={!!V.saving} aria-busy={saving ? 'true' : undefined} {...keepFocus}>{saving ? W.save.working : W.save.button}</Button>
            </div>
            <p class="note">{W.save.note}</p>
          </form>
        )}
        {!V.save && problem && <p class="notice" role="alert" data-testid={`${T}.problem`} data-problem={V.problem}>{problem}</p>}
        {V.phase && V.phase !== 'closed' && <Choices V={V} dispatch={dispatch} />}
        <p class="advice">{ADVICE_SHORT}</p>
        <div class="actions-row">
          <LinkButton testid={`${T}.back`} kind="quiet" href={href.plan(view.id)}>{W.back}</LinkButton>
        </div>
        <UndoToast prefix={T} toast={V.toast} text={V.toast ? toastText(V.toast) : ''} words={W.buttons}
          onUndo={() => dispatch({ type: 'plan/undo', planId })} onClose={() => dispatch({ type: 'plan/toastClose' })} />
      </>
    )
  };
}
