/**
 * "Check in" on a saved plan (research/saving-enough-and-check-in.md 5.4–5.7; release step R3): a saver's own step, on
 * #/plan/<id>/checkin and on the pot step's old address. Where you are today (typed, never filled in), whether anything has
 * changed (prefilled from the last check-in or the plan, in the person's own kind), a note, how often, and "Check in";
 * then the result — the verdict from here and what would be enough in B's own sentences, the pot against the saving path,
 * what changed since last time, then and now, the next check-in and the calendar file — and "Your check-ins", newest
 * first. A plan that is not still saving gets no boxes: its check-ins from the saving years only.
 *
 * Draws only: the reading is the plan source's (answers/plan/checkIn.js through state/select.js planCheckInView), the
 * answer the check-in's own run (state.checkIn). No figure is worked out here.
 */
import { PlanRail, changeAction, EditField, UndoToast, fill, Button, LinkButton, Sentence } from '../../components/index.js';
import { ADVICE_SHORT } from '../../copy/common.js';
import { planView, planCheckInView } from '../../state/select.js';
import { href } from '../../router/routes.js';
import { PLAN } from '../../copy/plan.js';
import { CHECKIN as W } from '../../copy/checkin.js';

const w = PLAN.page;
const keepFocus = { onMouseDown: (e) => e.preventDefault() };
const T = 'plan.checkin';
const VERDICT_BANDS = ['yes', 'close', 'no'];

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

/** "£317 a month for 1 month and £633 a month for 11 months". */
const runsText = (runs) => runs.map((x) => fill(W.result.changed.run, { perMonth: x.perMonth, months: String(x.months), s: x.months === 1 ? '' : 's' })).join(W.result.changed.and);
const enoughText = (e, words) => (e ? fill(words[e.id] || '', e.slots) : null);

/** The verdict from here, in B's own sentences (the check-in's run, held in page memory just after it was written). */
function LiveVerdict({ result }) {
  const s = (result && result.sentences) || {};
  const band = result && result.verdict && result.verdict.band;
  if (!(s.verdictHead && s.verdictLine && VERDICT_BANDS.includes(band))) return null;
  return (
    <>
      <div class="answer-region" data-region="answer" data-answer="final">
        <div class="headline" data-headline="verdict">
          <div class={`band verdict is-${band}`} data-verdict={band}>
            <Sentence s={s.verdictHead} source={result} class="figure" />
          </div>
          <Sentence s={s.verdictLine} source={result} class="line" data-sentence="verdict" />
          {s.verdictFour && <Sentence s={s.verdictFour} source={result} class="four" />}
          {s.income && <Sentence s={s.income} source={result} class="income" />}
          {s.atAim && <Sentence s={s.atAim} source={result} class="bad" />}
        </div>
        {s.enoughHead && (
          <div class="enough" data-enough={result.enough ? result.enough.how : undefined} data-testid={`${T}.result.enough`}>
            <h3>{W.result.enoughTitle}</h3>
            <Sentence s={s.enoughHead} source={result} class="figure" />
            {s.enoughLine && <Sentence s={s.enoughLine} source={result} class="enough-line" />}
            {s.enoughFour && <Sentence s={s.enoughFour} source={result} class="enough-four" />}
            {s.enoughPaused && <Sentence s={s.enoughPaused} source={result} class="note" />}
            {s.enoughMatch && <Sentence s={s.enoughMatch} source={result} class="note" />}
          </div>
        )}
      </div>
    </>
  );
}

/** The verdict as the check-in kept it (read again later): the band, the count, the incomes, what would have been enough. */
function KeptVerdict({ L }) {
  const R = W.result;
  const v = L.verdict;
  if (!v) return null;
  return (
    <div class="checkin-kept" data-verdict={v.band} data-testid={`${T}.result.kept`}>
      <p class={`band verdict is-${v.band}`}><strong>{fill(R.lasted, { band: R.band[v.band], words: v.words || '' })}</strong></p>
      {v.bad && v.middling && v.aim && <p class="note">{fill(R.spend, v)}</p>}
      {v.gap && <p class="note">{fill(R.gap, v)}</p>}
      {v.band !== 'yes' && L.enough && <p class="note" data-testid={`${T}.result.keptEnough`}>{enoughText(L.enough, R.enough)}</p>}
      {v.band !== 'yes' && L.four && <p class="note">{enoughText(L.four, R.four)}</p>}
    </div>
  );
}

/** Against the saving path (5.5): the band with the lines either side when the path is still the one it was read against. */
function PathLine({ L }) {
  const R = W.result.path;
  const p = L.path;
  if (!p) return null;
  const what = R.what[p.pension ? 'pension' : 'pot'];
  const KEPT = { below: R.keptBelow, lower: R.keptLower, upper: R.keptUpper, above: R.keptAbove };
  const withLines = p.low && p.high && p.actual;
  const text = p.band === 'start' ? R.start : withLines ? fill(R[p.band], { ...p, what }) : fill(KEPT[p.band] || '', { ...p, what });
  return (
    <section class="plan-section checkin-path" data-section="path" data-testid={`${T}.result.path`} data-band={p.band}>
      <h3>{W.result.pathTitle}</h3>
      <p>{text}{withLines && p.band !== 'start' ? ' ' + fill(R.at, p) : ''}</p>
      {withLines && p.prices && <p class="note" data-testid={`${T}.result.prices`}>{fill(R.prices, p.prices)}</p>}
      {p.band !== 'start' && <p class="note">{R.lines}</p>}
      {p.band !== 'start' && (p.band === 'below' || p.band === 'lower') && L.verdict && L.verdict.band === 'yes' && <p class="note">{R.both}</p>}
    </section>
  );
}

/** What changed since the last check-in (5.5): the parts add up to the change in the pot the path counts, to the pound. */
function Changed({ L, paused }) {
  const c = L.changed;
  if (!c) return null;
  const R = W.result.changed;
  const what = W.result.path.what[c.isaCounted ? 'pot' : 'pension'];
  const pension = c.pension.filter((x) => x.perMonth !== '£0');
  const savings = c.savings ? c.savings.filter((x) => x.perMonth !== '£0') : null;
  return (
    <section class="plan-section checkin-changed" data-section="changed" data-testid={`${T}.result.changed`}>
      <h3>{fill(W.result.changedTitle, { month: c.since })}</h3>
      <p>{fill(R.pot, { what, from: c.from, to: c.to })}</p>
      <p>{pension.length ? fill(R.paid, { runs: runsText(pension), total: c.paidPension }) : R.paidNothing}{' '}
        {c.isaCounted ? (savings && savings.length ? fill(R.savings, { runs: runsText(savings), total: c.paidSavings }) : R.savingsNothing) : ''}</p>
      {paused ? <p class="note">{paused.to ? fill(R.pausedTo, paused) : fill(R.paused, paused)}</p>
        : c.pausedBefore && <p class="note" data-testid={`${T}.result.pausedBefore`}>{c.pausedBefore.to ? fill(R.pausedTo, c.pausedBefore) : fill(R.pausedBefore, c.pausedBefore)}</p>}
      <p data-testid={`${T}.result.rest`}>{fill(R.rest, { sign: c.restSign, rest: c.rest })}</p>
    </section>
  );
}

/** The result of the last check-in (5.5), and what may follow from it (5.3, 5.6), the next date and the calendar file. */
function Result({ V, dispatch, planId }) {
  const L = V.latest;
  if (!L) return null;
  const R = W.result;
  const live = V.live;
  const latestRow = V.rows[0] || null;
  const tn = L.thenNow;
  return (
    <section class="block plan-section checkin-result" data-section="result" data-testid={`${T}.result`} data-live={live ? '1' : '0'} aria-labelledby="checkin-result-title">
      <h2 id="checkin-result-title">{fill(live ? R.checkedIn : R.lastTitle, { month: L.month })}</h2>
      {live ? <LiveVerdict result={live} /> : <KeptVerdict L={L} />}
      {/* a couple's plan is read on its own until two plans are read together (release step R5), and the plan's own rise in
          what goes in is not the test's: said beside the verdict, as What you pay in says them */}
      {(live || L.verdict) && V.notes && V.notes.couple && <p class="note" data-testid={`${T}.result.couple`}>{R.couple}</p>}
      {(live || L.verdict) && V.notes && V.notes.rise && <p class="note" data-testid={`${T}.result.rise`}>{V.notes.rise.pct === '0' ? R.riseNone : fill(R.rise, V.notes.rise)}</p>}
      {!live && L.verdict && <p class="note">{R.seeSaving} <a href={href.plan(planId, 'saving')}>{R.seeSavingLink}</a></p>}
      {!L.verdict && V.verdictWhy === 'noAim' && <p class="note">{W.noVerdict.noAim} <a href={href.plan(planId, 'spend')}>{W.noAimLink}</a></p>}
      {!L.verdict && V.verdictWhy === 'invalid' && <p class="note">{W.noVerdict.invalid} <a href={href.plan(planId, 'about')}>{W.aboutLink}</a></p>}
      <PathLine L={L} />
      {!L.path && <p class="note" data-testid={`${T}.result.noPath`}>{R.noPath}</p>}
      <Changed L={L} paused={latestRow && latestRow.paused} />
      {tn && (
        <p data-testid={`${T}.result.thenNow`}>{fill(R.thenNow, tn)}{tn.enoughThen && tn.enoughNow ? ' ' + fill(R.thenNowEnough, { then: enoughText(tn.enoughThen, R.enoughShort), now: enoughText(tn.enoughNow, R.enoughShort) }) : ''}</p>
      )}
      {L.path && L.path.band !== 'start' && <p class="note">{R.caution}</p>}
      {V.pathDiffers && <p class="note" data-testid={`${T}.result.pathDiffers`}>{fill(R.pathDiffers, V.pathDiffers)}</p>}
      {V.useInPlan && (
        <div class="checkin-use" data-testid={`${T}.useInPlan`}>
          <p>{fill(R.useInPlan[V.useInPlan.id], V.useInPlan.slots)}</p>
          <div class="actions-row">
            <Button testid={`${T}.use`} kind="plain" disabled={!!V.saving} onClick={() => dispatch({ type: 'plan/useCheckIn', planId })} {...keepFocus}>{fill(R.useButton[V.useInPlan.id], V.useInPlan.slots)}</Button>
          </div>
          <p class="note">{R.useHelp}</p>
        </div>
      )}
      {V.cadence.chosen && V.cadence.next && (
        <div class="checkin-next">
          <p data-testid={`${T}.next`}>{fill(R.next, { month: V.cadence.next })}</p>
          {V.calendar && (
            <div class="actions-row">
              <Button testid={`${T}.calendar`} kind="quiet" onClick={() => dispatch({ type: 'plan/calendar', planId })} {...keepFocus}>{R.calendar}</Button>
            </div>
          )}
          <p class="note">{R.calendarHelp}</p>
        </div>
      )}
      {V.restartable && (
        <div class="checkin-restart">
          <div class="actions-row">
            <Button testid={`${T}.restart`} kind="quiet" disabled={!!V.saving} onClick={() => dispatch({ type: 'plan/restartPath', planId })} {...keepFocus}>{R.restart}</Button>
          </div>
          <p class="note">{R.restartHelp}</p>
        </div>
      )}
      <p class="advice">{ADVICE_SHORT}</p>
    </section>
  );
}

/** "Your check-ins" (5.7): one row a check-in, newest first; the path each was read against, when it changed. */
function History({ V }) {
  const H = W.history;
  const text = (x, words) => (x ? fill(words[x.id] || '', x.slots) : H.none2);
  return (
    <section class="plan-section checkin-history" data-section="history" data-testid={`${T}.history`} data-count={V.count}>
      <h2>{W.sections.history}</h2>
      {V.rows.length === 0 && <p class="note" data-testid={`${T}.history.none`}>{H.none}</p>}
      {V.rows.length > 0 && (
        <div class="table-wrap">
          <table class="way-table checkin-table" data-testid={`${T}.history.table`}>
            <thead><tr>{['month', 'pot', 'pay', 'payIn', 'path', 'lasted', 'enough', 'note'].map((k) => <th key={k} scope="col">{H.columns[k]}</th>)}</tr></thead>
            <tbody>
              {V.rows.map((r) => [
                <tr key={r.date} data-date={r.date} data-verdict={r.verdict ? r.verdict.band : undefined}>
                  <th scope="row">{r.month}</th>
                  <td>{r.isa ? fill(H.potIsa, r) : fill(H.pot, r)}</td>
                  <td>{r.pay || H.none2}</td>
                  <td>{text(r.payIn, H.payIn)}{r.savingsIn ? fill(H.savingsIn, { amount: r.savingsIn }) : ''}{r.paused ? '. ' + (r.paused.to ? fill(H.pausedTo, r.paused) : fill(H.paused, r.paused)) : ''}</td>
                  <td>{r.path ? H.path[r.path.band] + (r.path.expected && r.path.band !== 'start' ? fill(H.pathMiddle, r.path) : '') : H.none2}</td>
                  <td>{r.verdict ? fill(H.lasted[r.verdict.band], { words: r.verdict.words || '' }) : H.none2}</td>
                  <td>{text(r.enough, H.enough)}</td>
                  <td class="checkin-note">{r.note || H.none2}</td>
                </tr>,
                r.pathChanged ? <tr key={r.date + '.path'} class="checkin-path-row"><td colSpan={8} class="note">{fill(H.pathFrom, { month: r.pathChanged.month, why: H.why[r.pathChanged.why] })}</td></tr> : null
              ])}
            </tbody>
          </table>
        </div>
      )}
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

export function CheckInScreen(state, dispatch) {
  const view = planView(state);
  const V = planCheckInView(state);
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
  const onChange = (place, id = view.id, month = null) => dispatch(changeAction(id, place, href.plan(view.id, 'checkin'), month));
  const rail = <PlanRail view={view} state={state} dispatch={dispatch} onChange={onChange} />;
  const step = view.steps.find((s) => s.id === 'checkin' || s.id === 'pot') || null;
  const field = (path) => V.fields.find((f) => f.path === path);
  const F = (path, more = {}) => {
    // the ISA box: needed once the path counts ISAs and savings; before an unlocked plan's first path, it decides whether it will
    const words = path === 'ci.isa' && V.isaNeeded ? { ...W.fields[path], help: W.fields[path].helpNeeded }
      : path === 'ci.isa' && V.first && !V.locked ? { ...W.fields[path], help: W.fields[path].helpFirst }
        : path === 'ci.every' && !V.first ? { ...W.fields[path], label: W.fields[path].labelAgain }
          : path === 'ci.since' && V.pausedBefore ? { ...W.fields[path], label: W.fields[path].labelAfterPause } : W.fields[path];
    return <EditField step="checkin" f={field(path)} words={words} errors={W.errors[path]} source={null} savedWords={W.savedValue} planId={planId} dispatch={dispatch} {...more} />;
  };
  const problem = V.problem ? (W.problems[V.problem] || W.problems.failed) : null;
  const working = !!(V.saving && V.saving.kind === 'checkIn');
  const onSubmit = (e) => {
    e.preventDefault();
    const root = e.currentTarget;
    dispatch({ type: 'plan/checkIn', planId });
    const firstPath = V.fields.find((f) => f.applies && V.errors[f.path]);
    if (!firstPath) return;
    const el = root.querySelector(`[id="plan.checkin.${firstPath.path}"]`) || root.querySelector(`[name="plan.checkin.${firstPath.path}"]:checked`) || root.querySelector(`[name="plan.checkin.${firstPath.path}"]`);
    if (el) el.focus();
  };
  return {
    question: null, rail, full: false,
    content: (
      <>
        <Head view={view} />
        {/* the pot step's old address opens this screen (research/saving-enough-and-check-in.md 4.1): the heading names the address it was opened on */}
        {/* a plan that has stopped work offers no check-in: the page is its saving years, read only (5.8) */}
        <h1 tabIndex={-1} data-testid={state.route.step === 'pot' ? 'plan.step.pot' : 'plan.step.checkin'}>{V.allowed || V.stageKey === 'unknown' ? W.title : W.savingYearsTitle}</h1>
        {step && !step.listed && <p class="note" data-testid="plan.notListed">{w.notListed}</p>}
        {V.allowed ? <p class="lead">{V.first && !V.locked ? W.firstLead : W.lead}</p>
          : V.stageKey === 'unknown' ? <p class="notice" role="status" data-testid={`${T}.noAge`}>{W.noAge} <a href={href.plan(planId, 'about')}>{W.aboutLink}</a></p>
            : <p class="notice" role="status" data-testid={`${T}.notSaving`}>{W.notSaving}{V.count ? ' ' + W.savingYears : ''}</p>}
        {V.readonly && <p class="notice" role="status" data-testid={`${T}.readonly`}>{W.readonly}</p>}
        {V.allowed && V.locked && <p class="note" data-testid={`${T}.locked`}>{W.locked}</p>}
        {/* money taken from a pension flexibly, carried from a plan drawn on and closed (research/plan-start.md §2 J) */}
        {V.allowed && V.allowance && <p class="notice" data-testid={`${T}.allowance`} data-over={V.allowance.over ? '1' : '0'}>{fill(W.allowance, V.allowance)}{V.allowance.over ? ' ' + fill(V.first ? W.allowanceOverPlan : W.allowanceOver, V.allowance) : ''}</p>}
        {/* a saving plan whose change-over is still to come (research/plan-start.md §2 J): no check-in until it begins */}
        {V.allowed && V.notYet && <p class="notice" role="status" data-testid={`${T}.notYet`}>{fill(W.notYet, V.notYet)}</p>}
        {V.allowed && <Result V={V} dispatch={dispatch} planId={planId} />}
        {V.editable && (
          <form class="ask about-form income-form checkin-form" noValidate onSubmit={onSubmit} data-region="plan-checkin" aria-busy={working ? 'true' : undefined}>
            {V.first ? null : <h2>{W.button}</h2>}
            {V.verdictWhy === 'noAim' && <p class="note" data-testid={`${T}.noAim`}>{W.noVerdict.noAim} <a href={href.plan(planId, 'spend')}>{W.noAimLink}</a></p>}
            <section class="income-section" data-section="where">
              <h3>{W.sections.where}</h3>
              {F('ci.pension')}
              {F('ci.isa')}
              {F('ci.other')}
            </section>
            <section class="income-section" data-section="changed">
              <h3>{W.sections.changed}</h3>
              {F('ci.pay')}
              {F('ci.kind')}
              {F('ci.ownPct')}
              {F('ci.employerPct')}
              {F('ci.own')}
              {F('ci.employer')}
              {F('ci.total')}
              {F('ci.savingsIn')}
              {!V.first && F('ci.since')}
              {F('ci.paused')}
              {F('ci.pausedFrom')}
              {F('ci.pausedTo')}
              <p class="note">{W.elsewhere} <a href={href.plan(planId, 'about')}>{W.elsewhereLinks.about}</a> · <a href={href.plan(planId, 'income')}>{W.elsewhereLinks.income}</a> · <a href={href.plan(planId, 'spend')}>{W.elsewhereLinks.spend}</a></p>
            </section>
            <section class="income-section" data-section="note">
              <h3>{W.sections.note}</h3>
              {F('ci.note')}
            </section>
            <section class="income-section" data-section="often">
              <h3>{W.sections.often}</h3>
              {F('ci.every')}
            </section>
            {V.dropWarning && <p class="note" data-testid={`${T}.dropWarning`}>{W.dropWarning}</p>}
            {V.again && <p class="note" data-testid={`${T}.again`}>{W.again}</p>}
            {problem && <p class="notice" role="alert" data-testid={`${T}.problem`} data-problem={V.problem}>{problem}</p>}
            <div class="actions-row about-actions">
              <Button testid={`${T}.submit`} kind="primary" type="submit" disabled={!!V.saving} aria-busy={working ? 'true' : undefined} {...keepFocus}>{working ? W.working : W.button}</Button>
            </div>
            {working && <p class="working-note" role="status" data-testid={`${T}.working`}>{W.working}</p>}
          </form>
        )}
        <History V={V} />
        <div class="actions-row">
          <LinkButton testid={`${T}.back`} kind="quiet" href={href.plan(view.id, 'plan')}>{W.buttons.back}</LinkButton>
        </div>
        <UndoToast prefix={T} toast={V.toast} text={V.toast ? toastText(V.toast) : ''} words={W.buttons}
          onUndo={() => dispatch({ type: 'plan/undo', planId })} onClose={() => dispatch({ type: 'plan/toastClose' })} />
      </>
    )
  };
}
