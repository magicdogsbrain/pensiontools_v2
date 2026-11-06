/**
 * Month by month on a saved plan (research/v7/months-in-v7.md §1; 7.2.0), on #/plan/<id>/month: the months not recorded at the
 * top, the month, its tax year's set-up when it is not set up, what the platform shows, what to draw and where it comes
 * from, the months missed to fill in with it, Record, the recent months, and what comes next. A plan that is not locked is
 * told to lock first. Each press is ONE write (effects/planWrite.js kinds 'month' and 'taxYear'), with Undo.
 *
 * Draws only: the reading is the plan source's (answers/plan/month.js through state/select.js planMonthView). Every figure is
 * the classic planner's own, worked out there; nothing is worked out here.
 */
import { PlanRail, changeAction, EditField, UndoToast, fill, Button, LinkButton, PlanSentence, PlanLine } from '../../components/index.js';
import { planView, planMonthView } from '../../state/select.js';
import { href } from '../../router/routes.js';
import { PLAN } from '../../copy/plan.js';
import { MONTH as W } from '../../copy/month.js';

const w = PLAN.page;
const keepFocus = { onMouseDown: (e) => e.preventDefault() };
const T = 'plan.month';

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

/** A month chosen from the reading's own list (a native select: a phone shows its own picker). */
function MonthSelect({ path, label, help, value, options, planId, dispatch, blankLabel = null }) {
  const id = `${T}.${path}`;
  return (
    <div class="field field-select" data-field={path}>
      <label for={id}>{label}</label>
      <div class="box">
        <select id={id} data-testid={id} name={id} value={value || ''} aria-describedby={help ? id + '.help' : undefined}
          onChange={(e) => dispatch({ type: 'plan/edit', planId, path, value: e.currentTarget.value })}>
          {blankLabel && <option value="">{blankLabel}</option>}
          {options.map((o) => <option key={o.ym} value={o.ym}>{o.words}</option>)}
        </select>
      </div>
      {help && <p id={id + '.help'} class="help">{help}</p>}
    </div>
  );
}

/** A box of the step: the reading's field with the problem shown once the box is left (planMonthView). */
function Box({ V, path, words, errors, dispatch, shownErrors, slots = {} }) {
  const f = (V.pots && V.pots.fields.find((x) => x.path === path)) || { path, type: 'money', applies: true, shown: (V.draft.values[path] ?? ''), saved: null };
  const err = shownErrors[path] || null;
  return <EditField step="month" f={{ ...f, error: err }} words={{ ...words, label: fill(words.label, slots), help: words.help ? fill(words.help, slots) : undefined }} errors={errors} source={null} planId={V.id} dispatch={dispatch} slots={slots} />;
}

function Choice({ V, path, value, dispatch, words, options, slots = {}, error = null }) {
  return <EditField step="month" f={{ path, type: 'choice', options, applies: true, shown: value, saved: null, error }} words={words} errors={W.errors} source={null} planId={V.id} dispatch={dispatch} slots={slots} />;
}

/** "Set up 2026/27": the classic set-up's three screens as one form, in their order. */
function SetUp({ V, dispatch, open }) {
  const S = V.setUp;
  const E = V.setUpErrors;
  const typed = V.draft.values;
  const box = (path, dflt, slots = {}, words = W.fields[path]) => {
    const shown = path in typed ? String(typed[path]) : dflt == null ? '' : String(dflt);
    return <EditField step="month" f={{ path, type: 'money', applies: true, shown, saved: null, error: E[path] || null }} words={{ ...words, label: fill(words.label, slots), help: words.help ? fill(words.help, slots) : undefined }} errors={W.errors} source={null} planId={V.id} dispatch={dispatch} slots={slots} />;
  };
  const sug = W.setUp.suggestion;
  const sw = S.words;
  const suggestion = S.source === 'bridge' ? fill(sug.bridge, { amount: sw.suggestion }) + (S.bridgeCover != null ? fill(sug.bridgeCover, { n: String(S.bridgeCover), m: String(S.remaining) }) : '')
    : S.source === 'budget-schedule' ? fill(sug['budget-schedule'], { amount: sw.suggestion })
      : S.declining ? fill(sug.declining, { pct: String(S.declinePct), amount: sw.suggestion }) : fill(sug.chain, { cpi: String(S.cpiPct), amount: sw.suggestion });
  const tu = S.topUp;
  const working = !!(V.saving && V.saving.kind === 'taxYear');
  return (
    <section class="plan-section month-setup" data-section="setUp" data-testid={`${T}.setUp`} data-year={S.key}>
      <h2>{fill(W.sections.setUp, { year: S.year })}</h2>
      <p class="lead">{S.isApril ? W.setUp.leadApril : fill(W.setUp.leadPart, { month: S.month, n: String(S.remaining) })}</p>
      {!S.isApril && box('ty.toDate', null, { prev: S.prevMonth, month: S.month })}
      {!S.isApril && box('ty.taxToDate', null)}
      {box('ty.cpi', null)}
      <p class="note" data-testid={`${T}.setUp.suggestion`}>{suggestion}</p>
      {box('ty.income', S.suggestion)}
      {box('ty.other', S.defaults.other)}
      {box('ty.cgt', null)}
      <p class="note" data-testid={`${T}.setUp.statePension`}>{fill(W.setUp.statePension[S.statePension.id], S.statePension.slots)}</p>
      {S.statePensionLater && <p class="note">{fill(W.setUp.spLater, S.statePensionLater)}</p>}
      <p class="note">{S.bands} <Button testid={`${T}.setUp.bands`} kind="quiet" aria-expanded={open ? 'true' : 'false'} onClick={() => dispatch({ type: 'ui/toggle', id: 'monthBands' })} {...keepFocus}>{open ? W.setUp.bandsHide : W.setUp.bandsChange}</Button></p>
      {open && <div class="month-bands">{box('ty.pa', S.defaults.pa)}{box('ty.brl', S.defaults.brl)}{box('ty.hrl', S.defaults.hrl)}</div>}
      <h3>{W.setUp.topUp.title}</h3>
      {tu.exhausted ? <p class="notice" data-testid={`${T}.setUp.exhausted`}>{fill(W.setUp.topUp.exhausted, { brl: sw.brl })}</p>
        : tu.notNeeded ? <p class="note" data-testid={`${T}.setUp.notNeeded`}>{fill(W.setUp.topUp.notNeeded, { income: sw.income, brl: sw.brl })}</p>
          : <p class="note" data-testid={`${T}.setUp.need`}>{fill(W.setUp.topUp.need, { brl: sw.brl, n: String(S.remaining), income: sw.incomeTyped, need: sw.need })}</p>}
      {!tu.exhausted && box('ty.isa', tu.notNeeded ? 0 : tu.needed, {}, { ...W.fields['ty.isa'], label: tu.notNeeded ? W.fields['ty.isa'].labelOptional : W.fields['ty.isa'].label })}
      {tu.needsChoice && !tu.exhausted && tu.shortfall > 0 && <p class="note">{fill(W.setUp.topUp.short, { shortfall: sw.shortfall, need: sw.need })}</p>}
      {tu.needsChoice && <Choice V={V} path="ty.choice" value={V.draft.values['ty.choice'] || ''} dispatch={dispatch} words={W.fields['ty.choice']} options={tu.choices} error={E['ty.choice'] || null}
        slots={{ need: sw.need, brl: sw.brl, income: sw.incomeTyped }} />}
      <div class="month-bank" data-testid={`${T}.setUp.bank`}>
        <h3>{W.setUp.bank.title}</h3>
        <div class="table-wrap">
          <table class="plan-table">
            <thead><tr><th scope="col">{W.setUp.bank.from}</th><th scope="col">{W.setUp.bank.before}</th><th scope="col">{W.setUp.bank.tax}</th><th scope="col">{W.setUp.bank.after}</th></tr></thead>
            <tbody>{S.bank.map((r) => <tr key={r.id} data-row={r.id}><th scope="row">{W.setUp.bank[r.id]}</th><td>{r.before}</td><td>{r.tax}</td><td>{r.after}</td></tr>)}</tbody>
            <tfoot><tr><th scope="row">{W.setUp.bank.total}</th><td>{S.bankTotal.before}</td><td>{S.bankTotal.tax}</td><td data-testid={`${T}.setUp.bankAfter`}>{S.bankTotal.after}</td></tr></tfoot>
          </table>
        </div>
        <p class="note">{S.efficient ? W.setUp.efficient : W.setUp.inefficient}</p>
      </div>
      {V.editable && (
        <div class="actions-row">
          <Button testid={`${T}.setUp.submit`} kind="primary" disabled={!!V.saving} aria-busy={working ? 'true' : undefined} onClick={() => dispatch({ type: 'plan/taxYear', planId: V.id })} {...keepFocus}>{working ? W.setUp.working : fill(W.setUp.button, { year: S.year })}</Button>
        </div>
      )}
    </section>
  );
}

/** What to draw this month and where it comes from (the classic engine's month, in plain words). */
function Advice({ V }) {
  const a = V.advice;
  if (!a) return null;
  const A = W.advice;
  return (
    <section class="plan-section month-advice headline" data-section="advice" data-testid={`${T}.advice`} data-month={V.month} data-cut={a.cut ? '1' : '0'}>
      <h2>{W.sections.advice}</h2>
      {V.preview && <p class="note" data-testid={`${T}.preview`}>{fill(W.setUp.preview, { year: V.setUp ? V.setUp.year : V.year, month: a.month })}</p>}
      <ul class="plan-lines month-figures">
        <li class="plan-line" data-figure="pension"><span class="plan-label">{A.pension}</span> <strong data-testid={`${T}.pension`}>{a.pension}</strong></li>
        <li class="plan-line" data-figure="tax"><span class="plan-label">{A.tax}</span> <span data-testid={`${T}.tax`}>{a.tax}</span></li>
        {a.isa && <li class="plan-line" data-figure="isa"><span class="plan-label">{A.isa}</span> <span>{a.isa}</span></li>}
        {a.other && <li class="plan-line note">{fill(A.other, { amount: a.other })}</li>}
        {a.statePension && <li class="plan-line note">{fill(A.statePension, { amount: a.statePension })}</li>}
        <li class="plan-line month-total" data-figure="afterTax"><span class="plan-label">{A.afterTax}</span> <strong data-testid={`${T}.afterTax`}>{a.afterTax}</strong></li>
      </ul>
      {a.gia && <p class="note">{fill(A.gia, { sold: a.gia.sold, net: a.gia.net, cgt: a.gia.cgt ? fill(A.giaCgt, { cgt: a.gia.cgt }) : '' })}</p>}
      {a.recycle && <p class="note">{fill(A.recycle, a.recycle)}</p>}
      {a.boost && <p class="note">{fill(A.boost, { boost: a.boost })}</p>}
      {a.cut && <p class="notice" data-testid={`${T}.cut`}>{A.cut}</p>}
      {!a.efficient && <p class="note">{A.notEfficient}</p>}
      {a.from.length > 0 && (
        <>
          <h3>{A.fromTitle}</h3>
          <ul class="plan-lines" data-testid={`${T}.from`}>{a.from.map((x, i) => <li class="plan-line" key={i} data-from={x.id}><span class="plan-label">{fill(A.from[x.id] || x.id, x.slots)}</span> {x.amount}</li>)}</ul>
          {a.contract && <p class="note">{A.bought}</p>}
        </>
      )}
      {a.moves.length > 0 && (
        <>
          <h3>{A.movesTitle}</h3>
          <ul class="plan-lines" data-testid={`${T}.moves`}>{a.moves.map((m, i) => <li class="plan-line" key={i} data-move={m.id}>{fill(A.moves[m.id] || '', m.slots)}</li>)}</ul>
        </>
      )}
      {V.recalc && <p class="note">{A.recalc}</p>}
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

export function MonthScreen(state, dispatch) {
  const view = planView(state);
  const V = planMonthView(state);
  if (!view.found || !V.found) {
    const status = state.plans ? state.plans.status : 'none';
    const waiting = status === 'none' || status === 'checking' || status === 'reading' || (view.found && !V.found);
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
  const onChange = (place, id = view.id, month = null) => dispatch(changeAction(id, place, href.plan(view.id, 'month'), month));
  const rail = <PlanRail view={view} state={state} dispatch={dispatch} onChange={onChange} />;
  const step = view.steps.find((s) => s.id === 'month') || null;
  const typed = V.draft.values;
  const shownErrors = V.shownErrors;
  const problem = V.problem ? (W.problems[V.problem] || W.problems.failed) : null;
  const working = !!(V.saving && V.saving.kind === 'month');
  const bandsOpen = state.ui.open.includes('monthBands');
  const P = V.pots;
  const pathBox = (path, more = {}) => <Box V={V} path={path} words={path === 'mo.total' && P && P.contract ? { ...W.fields[path], help: W.fields[path].helpContract } : W.fields[path]} errors={W.errors} dispatch={dispatch} shownErrors={shownErrors} {...more} />;
  const offer = V.offer;
  const fillOffered = !!(offer && offer.count > 0);
  const recordLabel = V.fillOn ? fill(W.record.withFill, { month: V.monthWords, n: String(offer.count), s: offer.count === 1 ? '' : 's' }) : fill(W.record.button, { month: V.monthWords });
  const canRecord = V.editable && V.setUpDone && !V.refused;
  return {
    question: null, rail, full: false,
    content: (
      <>
        <Head view={view} />
        <h1 tabIndex={-1} data-testid="plan.step.month">{W.title}</h1>
        {step && !step.listed && <p class="note" data-testid="plan.notListed">{w.notListed}</p>}
        <p class="lead">{W.lead}</p>
        {/* where the months stand, as the rail reads it (read.js monthStep): the month to record, a month missed, the tax year */}
        {step && step.result && (
          <section class="headline plan-panel" data-region="plan-step" data-testid={`${T}.status`}>
            <p class="line"><PlanSentence s={step.result} figures={step.figures} data-testid="plan.month.result" /></p>
            {step.lines.filter((l) => l.id !== 'month.record').length > 0 && <ul class="plan-lines">{step.lines.filter((l) => l.id !== 'month.record').map((l, i) => <PlanLine key={i} line={l} figures={step.figures} />)}</ul>}
          </section>
        )}
        {V.failed && <p class="notice" role="status" data-testid={`${T}.failed`}>{W.failed}</p>}
        {V.example && <p class="notice" role="status" data-testid={`${T}.example`}>{W.example}</p>}
        {V.needsLock && !V.readonly && (
          <div class="notice" role="status" data-testid={`${T}.needsLock`}>
            <p>{W.needsLock}</p>
            <div class="actions-row"><LinkButton testid={`${T}.lock`} kind="primary" href={href.plan(planId, 'lock')}>{W.lockLink}</LinkButton></div>
          </div>
        )}
        {V.nothing && !V.needsLock && <p class="note" data-testid={`${T}.nothing`}>{W.nothing}</p>}
        {!V.failed && !V.needsLock && !V.nothing && (
          <>
            {V.locked && <p class="note" data-testid={`${T}.locked`}>{W.locked}</p>}
            {V.gap && V.editable && !V.fillOn && (
              <div class="notice month-gap" role="status" data-testid={`${T}.gap`} data-count={String(V.gap.count)}>
                <p>{V.gap.count === 1 ? fill(W.gap.one, V.gap) : fill(W.gap.many, { count: String(V.gap.count), words: V.gap.words })}</p>
                <div class="actions-row"><Button testid={`${T}.gap.fill`} kind="plain" onClick={() => { dispatch({ type: 'plan/edit', planId, path: 'mo.from', value: V.gap.from }); dispatch({ type: 'plan/edit', planId, path: 'mo.fill', value: 'yes' }); }} {...keepFocus}>{W.gap.button}</Button></div>
              </div>
            )}
            <form class="ask about-form month-form" noValidate onSubmit={(e) => { e.preventDefault(); if (canRecord) dispatch({ type: 'plan/monthRecord', planId }); }} data-region="plan-month" aria-busy={working ? 'true' : undefined}>
              <section class="income-section" data-section="month">
                <h2>{W.sections.month}</h2>
                <MonthSelect path="mo.month" label={W.fields['mo.month'].label} help={W.fields['mo.month'].help} value={V.chosen} options={V.months} planId={planId} dispatch={dispatch} />
                {V.paidOffered && <Choice V={V} path="mo.paid" value={typed['mo.paid'] === 'yes' ? 'yes' : 'no'} dispatch={dispatch} words={W.fields['mo.paid']} options={['no', 'yes']} error={shownErrors['mo.paid'] || (V.errors['mo.paid'] ? V.errors['mo.paid'] : null)} />}
                {V.cadence !== 'monthly' && W.cadence[V.cadence] && <p class="note" data-testid={`${T}.cadence`}>{W.cadence[V.cadence]}</p>}
                {V.yearLine && <p class="note" data-testid={`${T}.yearDone`}>{V.yearLine.income ? fill(W.yearDoneIncome, V.yearLine) : fill(W.yearDone, V.yearLine)} {W.yearEdit}</p>}
              </section>
              {V.setUp && <SetUp V={V} dispatch={dispatch} open={bandsOpen} />}
              {P && (
                <section class="income-section" data-section="pots" data-testid={`${T}.pots`}>
                  <h2>{W.sections.pots}</h2>
                  {P.prefillFrom && <p class="note" data-testid={`${T}.prefilled`}>{fill(W.prefilled, { month: P.prefillFrom })}</p>}
                  <Choice V={V} path="mo.mode" value={P.mode} dispatch={dispatch} words={W.fields['mo.mode']} options={['platform', 'type']} />
                  {P.fields.map((f) => <div key={f.path}>{pathBox(f.path)}</div>)}
                  {P.problem && <p class="notice" role="alert" data-testid={`${T}.potsProblem`}>{W.potsProblems[P.problem]}</p>}
                </section>
              )}
              {V.arrival && <p class={V.arrival.within ? 'note' : 'notice'} data-testid={`${T}.arrival`}>{V.arrival.message}</p>}
              <Advice V={V} />
              {V.refused && <p class="notice" role="status" data-testid={`${T}.refused`}>{fill(W.refused[V.refused.id], V.refused.slots)}</p>}
              {offer && V.setUpDone && (fillOffered || offer.closed || offer.help.length > 0) && (
                <section class="income-section month-fill" data-section="fill" data-testid={`${T}.fill`}>
                  <h2>{W.sections.fill}</h2>
                  {offer.closed && offer.choices.length > 0 && <MonthSelect path="mo.from" label={W.fill.closed} value="" options={offer.choices} planId={planId} dispatch={dispatch} blankLabel={W.fill.choose} />}
                  {fillOffered && <Choice V={V} path="mo.fill" value={V.fillOn ? 'yes' : 'no'} dispatch={dispatch} words={{ label: W.fill.tickLabel, options: { yes: offer.words, no: W.fill.no } }} options={['yes', 'no']} />}
                  {fillOffered && offer.choices.length > 1 && <MonthSelect path="mo.from" label={W.fields['mo.from'].label} value={offer.chosenFrom} options={offer.choices} planId={planId} dispatch={dispatch} />}
                  {offer.help.map((h, i) => <p class="note" key={i} data-help={h.id}>{h.text || fill(W.fill.help[h.id] || '', h.slots)}</p>)}
                </section>
              )}
              {problem && <p class="notice" role="alert" data-testid={`${T}.problem`} data-problem={V.problem}>{problem}</p>}
              {canRecord && (
                <div class="actions-row about-actions">
                  <Button testid={`${T}.submit`} kind="primary" type="submit" disabled={!!V.saving} aria-busy={working ? 'true' : undefined} {...keepFocus}>{working ? W.record.working : recordLabel}</Button>
                </div>
              )}
              {working && <p class="working-note" role="status" data-testid={`${T}.working`}>{W.record.working}</p>}
            </form>
          </>
        )}
        <section class="plan-section month-recent" data-section="recent" data-testid={`${T}.recent`}>
          <h2>{W.sections.recent}</h2>
          {V.recent && V.recent.length ? (
            <ul class="plan-lines">{V.recent.map((r, i) => <li class="plan-line" key={i} data-filled={r.filled ? '1' : '0'}>{fill(W.recent.row, r)}{r.filled ? <span class="note"> {r.filled}</span> : null}</li>)}</ul>
          ) : <p class="note">{W.recent.none}</p>}
        </section>
        {V.partner && <p class="note" data-testid={`${T}.partner`}>{fill(W.partner, { name: V.partner.name })} <a href={href.plan(V.partner.id, 'month')}>{W.partnerLink}</a></p>}
        <section class="plan-section month-later" data-section="later">
          <h2>{W.sections.later}</h2>
          <ul class="plan-lines">{W.later.items.map((x, i) => <li class="plan-line" key={i}>{x}</li>)}</ul>
          <p class="note">{W.later.until}</p>
          {!V.readonly && <div class="actions-row"><Button testid={`${T}.classic`} kind="quiet" onClick={() => onChange('exports')}>{W.later.button}</Button></div>}
        </section>
        <div class="actions-row">
          <LinkButton testid={`${T}.back`} kind="quiet" href={href.plan(view.id, 'plan')}>{W.buttons.back}</LinkButton>
        </div>
        <UndoToast prefix={T} toast={V.toast} text={V.toast ? toastText(V.toast) : ''} words={W.buttons}
          onUndo={() => dispatch({ type: 'plan/undo', planId })} onClose={() => dispatch({ type: 'plan/toastClose' })} />
      </>
    )
  };
}
