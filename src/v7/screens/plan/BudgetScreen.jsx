/**
 * The budget on a saved plan (research/v7/road-to-7.md step 11b; budget-step.md "The rule"): the budget rail step made real —
 * the planner's Budget page, line by line, in V7. The totals against the national guide levels, the level the typical amounts
 * aim at, "Fill the blanks", the lines in two groups (each with its amount, period, essential tick, typical hint, a nudge when
 * an amount looks wrong, from and to an age, who pays when the budget is shared, a breakdown into parts, a copy for the
 * partner, Remove), "Did you miss anything?", the one-off costs, who pays changing over time, the budget as a file (download,
 * open, replace) and "Start again". Every change is its own write of the whole budget (effects/planWrite.js, kind 'budget'),
 * with Undo. Draws only: everything is the reading's (state/select.js planBudgetView: answers/plan/budget.js through the plan
 * source). No figure is worked out here, and nothing here changes a figure the plan runs on.
 */
import { PlanRail, UndoToast, fill, Button, LinkButton } from '../../components/index.js';
import { planView, planBudgetView } from '../../state/select.js';
import { href } from '../../router/routes.js';
import { PLAN } from '../../copy/plan.js';
import { PLAN_BUDGET as W } from '../../copy/planBudget.js';

const w = PLAN.page;
const keepFocus = { onMouseDown: (e) => e.preventDefault() };
const T = 'plan.budget';

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

/** A text box of the step: typed into the draft, written when left (its change), its problem under it. */
function Box({ f, id, label, planId, dispatch, mode = 'text', prefix = null, srLabel = false, help = null, wide = false }) {
  const err = f.error ? W.errors[f.error] || W.errors.notANumber : null;
  const errId = `${id}.error`;
  const helpId = help ? `${id}.help` : null;
  return (
    <div class={`field field-${mode === 'decimal' ? 'money' : 'text'}${err ? ' has-error' : ''}${wide ? ' is-wide' : ''}`} data-field={f.path}>
      <label for={id} class={srLabel ? 'sr-only' : undefined}>{label}</label>
      <div class="box">
        {prefix && <span class="prefix" aria-hidden="true">{prefix}</span>}
        <input type="text" inputmode={mode} autocomplete="off" id={id} data-testid={id} name={id} value={f.shown || ''}
          aria-invalid={err ? 'true' : undefined} aria-describedby={[helpId, err ? errId : null].filter(Boolean).join(' ') || undefined}
          onInput={(e) => dispatch({ type: 'plan/edit', planId, path: f.path, value: e.currentTarget.value })}
          onBlur={() => { dispatch({ type: 'plan/touch', planId, path: f.path }); if (f.change) dispatch({ type: 'plan/budget', planId, change: f.change }); }} />
      </div>
      {help && !err && <p class="help" id={helpId}>{help}</p>}
      {err && <p class="error" id={errId} data-error-for={id}>{err}</p>}
    </div>
  );
}

/** A choice box (a select): written at once, the change made from the choice (`make`). */
function Pick({ f, id, label, options, make, planId, dispatch, srLabel = false }) {
  return (
    <div class="field field-choice-select" data-field={f.path}>
      <label for={id} class={srLabel ? 'sr-only' : undefined}>{label}</label>
      <div class="box">
        <select id={id} data-testid={id} name={id} value={f.shown} onChange={(e) => { const value = e.currentTarget.value; if (value === f.shown) return; dispatch({ type: 'plan/edit', planId, path: f.path, value }); dispatch({ type: 'plan/budget', planId, change: make(value) }); }}>
          {Object.entries(options).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>
    </div>
  );
}

/** "Add a line" / "Add a one-off cost": the name first (a line without one would be left out by the save), then the press adds it. */
function AddRow({ f, id, label, button, touched, planId, dispatch }) {
  const blank = !(f.shown || '').trim();
  const err = blank && touched.includes(f.path) ? W.errors.required : null;
  const errId = `${id}.error`;
  const press = () => { if (f.change) dispatch({ type: 'plan/budget', planId, change: f.change }); else dispatch({ type: 'plan/touch', planId, path: f.path }); };
  return (
    <div class={`budget-add${err ? ' has-error' : ''}`} data-field={f.path}>
      <div class="field field-text">
        <label for={id}>{label}</label>
        <div class="box">
          <input type="text" autocomplete="off" id={id} data-testid={id} name={id} value={f.shown || ''} aria-invalid={err ? 'true' : undefined} aria-describedby={err ? errId : undefined}
            onInput={(e) => dispatch({ type: 'plan/edit', planId, path: f.path, value: e.currentTarget.value })}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); press(); } }} />
        </div>
        {err && <p class="error" id={errId} data-error-for={id}>{err}</p>}
      </div>
      <div class="actions-row"><Button testid={`${id}.press`} kind="quiet" onClick={press} {...keepFocus}>+ {button}</Button></div>
    </div>
  );
}

/** One line of the budget (index.html budgetLineRowHtml): its name, the amount with its hint and nudge, the period, the tick, the extras. */
function Line({ l, V, planId, dispatch }) {
  const base = `${T}.line.${l.id}`;
  const change = (c) => dispatch({ type: 'plan/budget', planId, change: c });
  const edit = (path, value) => dispatch({ type: 'plan/edit', planId, path, value });
  const name = l.label.trim() || W.line.label;
  const typical = l.typical != null ? fill(W.line.typical[l.period], { amount: '£' + String(Math.round(l.typical)).replace(/\B(?=(\d{3})+(?!\d))/g, ',') }) : null;
  const sanity = l.sanity ? W.line.sanity[l.sanity] : null;
  if (!V.editable) {
    return (
      <li class="budget-line" data-line={l.id} data-testid={base}>
        <div class="line-name"><span class="line-label">{name}</span></div>
        <p class="line">{l.fields.amount.saved ? '£' + l.fields.amount.saved + ' ' + W.line.periods[l.period] : '—'}{l.tier === 'essential' ? ' · ' + W.line.essential : ''}</p>
      </li>
    );
  }
  return (
    <li class={`budget-line${l.fields.amount.error ? ' has-error' : ''}`} data-line={l.id} data-testid={base} data-sanity={l.sanity || undefined}>
      <div class="line-name">
        {l.starter
          ? <><label for={`${base}.amount`} class="line-label">{l.label}</label>{l.hint && <span class="note line-hint"> {l.hint}</span>}</>
          : <Box f={l.fields.label} id={`${base}.label`} label={W.line.label} planId={planId} dispatch={dispatch} srLabel wide />}
      </div>
      <div class="line-boxes">
        <Box f={l.fields.amount} id={`${base}.amount`} label={fill(W.line.amountOf, { name })} planId={planId} dispatch={dispatch} mode="decimal" prefix="£" srLabel />
        <Pick f={l.fields.period} id={`${base}.period`} label={W.line.period} options={W.line.periods} make={(value) => ({ kind: 'line', id: l.id, field: 'period', value })} planId={planId} dispatch={dispatch} srLabel />
        <div class="check">
          <input type="checkbox" id={`${base}.essential`} data-testid={`${base}.essential`} name={`${base}.essential`} checked={l.fields.essential.shown}
            onClick={(e) => { const value = e.currentTarget.checked; edit(l.fields.essential.path, value ? '1' : '0'); change({ kind: 'line', id: l.id, field: 'essential', value }); }} onChange={() => {}} />
          <label for={`${base}.essential`}>{W.line.essential}</label>
        </div>
        {V.sharedWithPartner && <Pick f={l.fields.paidBy} id={`${base}.paidBy`} label={W.line.paidBy} options={W.line.paidBys} make={(value) => ({ kind: 'line', id: l.id, field: 'paidBy', value })} planId={planId} dispatch={dispatch} srLabel />}
        {V.sharedWithPartner && l.fields.paidBy.shown === 'shared' && <Box f={l.fields.mySharePct} id={`${base}.mySharePct`} label={W.line.mySharePct} planId={planId} dispatch={dispatch} mode="numeric" srLabel />}
      </div>
      {typical && !l.fields.amount.error && <p class="help" data-testid={`${base}.typical`}>{typical}</p>}
      {sanity && <p class="notice budget-nudge" role="status" data-testid={`${base}.sanity`}>{sanity}</p>}
      <div class="actions-row budget-line-actions">
        <Button testid={`${base}.ages`} kind="quiet" aria-expanded={l.agesOpen ? 'true' : 'false'} onClick={() => { if (l.agesOpen) { edit(`line.${l.id}.ages`, '0'); change({ kind: 'ages', id: l.id, open: false }); } else edit(`line.${l.id}.ages`, '1'); }} {...keepFocus}>{l.agesOpen ? W.line.agesOpen : W.line.ages}</Button>
        <Button testid={`${base}.parts`} kind="quiet" aria-expanded={l.partsOpen ? 'true' : 'false'} onClick={() => change({ kind: 'partToggle', id: l.id })} {...keepFocus}>{l.partsOpen ? W.line.partsClose : W.line.parts}</Button>
        {V.sharedWithPartner && <Button testid={`${base}.duplicate`} kind="quiet" onClick={() => change({ kind: 'duplicate', id: l.id })} {...keepFocus}>{W.line.duplicate}</Button>}
        <Button testid={`${base}.remove`} kind="quiet" class="line-remove" aria-label={fill(W.line.removeOf, { name })} onClick={() => change({ kind: 'remove', id: l.id })} {...keepFocus}>{W.line.remove}</Button>
      </div>
      {l.agesOpen && (
        <div class="budget-ages" data-testid={`${base}.agesBox`}>
          <Box f={l.fields.fromAge} id={`${base}.fromAge`} label={W.line.fromAge} planId={planId} dispatch={dispatch} mode="numeric" />
          <Box f={l.fields.toAge} id={`${base}.toAge`} label={W.line.toAge} planId={planId} dispatch={dispatch} mode="numeric" help={W.line.agesHelp} />
        </div>
      )}
      {l.partsOpen && (
        <div class="budget-parts" data-testid={`${base}.partsBox`}>
          <p class="note">{W.line.partsLead}</p>
          {l.parts.map((p) => (
            <div class="budget-part" key={p.i} data-part={p.i}>
              <Box f={p.label} id={`${base}.part.${p.i}.label`} label={W.line.part.label} planId={planId} dispatch={dispatch} srLabel />
              <Box f={p.amount} id={`${base}.part.${p.i}.amount`} label={W.line.part.amount} planId={planId} dispatch={dispatch} mode="decimal" prefix="£" srLabel />
              <Pick f={p.period} id={`${base}.part.${p.i}.period`} label={W.line.part.period} options={W.line.periods} make={(value) => ({ kind: 'part', id: l.id, i: p.i, field: 'period', value })} planId={planId} dispatch={dispatch} srLabel />
              <Button testid={`${base}.part.${p.i}.remove`} kind="quiet" aria-label={W.line.partRemove} onClick={() => change({ kind: 'partRemove', id: l.id, i: p.i })} {...keepFocus}>{W.line.remove}</Button>
            </div>
          ))}
          <div class="actions-row">
            <Button testid={`${base}.partAdd`} kind="quiet" onClick={() => change({ kind: 'partAdd', id: l.id })} {...keepFocus}>+ {W.line.partAdd}</Button>
            <span class="note" data-testid={`${base}.partsTotal`}>{fill(W.line.partsTotal, { total: '£' + String(Math.round(l.period === 'mo' ? l.partsTotal / 12 : l.partsTotal)).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' ' + W.line.periods[l.period] })}</span>
          </div>
        </div>
      )}
    </li>
  );
}

function OneOff({ o, V, planId, dispatch }) {
  const base = `${T}.oneOff.${o.id}`;
  const change = (c) => dispatch({ type: 'plan/budget', planId, change: c });
  const name = o.label.trim() || W.oneOffs.label;
  if (!V.editable) return <li class="budget-oneoff" data-one-off={o.id}><span>{name}: {o.fields.amount.saved ? '£' + o.fields.amount.saved : '—'}{o.fields.atAge.saved ? ' at age ' + o.fields.atAge.saved : ''}</span></li>;
  return (
    <li class="budget-oneoff plan-oneoff" data-one-off={o.id} data-testid={base}>
      <Box f={o.fields.label} id={`${base}.label`} label={W.oneOffs.label} planId={planId} dispatch={dispatch} help={o.hint || null} />
      <Box f={o.fields.amount} id={`${base}.amount`} label={W.oneOffs.amount} planId={planId} dispatch={dispatch} mode="decimal" prefix="£" />
      <Box f={o.fields.atAge} id={`${base}.atAge`} label={W.oneOffs.atAge} planId={planId} dispatch={dispatch} mode="numeric" />
      <Box f={o.fields.everyYears} id={`${base}.everyYears`} label={W.oneOffs.everyYears} planId={planId} dispatch={dispatch} mode="numeric" />
      {V.sharedWithPartner && <Pick f={o.fields.paidBy} id={`${base}.paidBy`} label={W.line.paidBy} options={W.line.paidBys} make={(value) => ({ kind: 'oneOff', id: o.id, field: 'paidBy', value })} planId={planId} dispatch={dispatch} />}
      {V.sharedWithPartner && o.fields.paidBy.shown === 'shared' && <Box f={o.fields.mySharePct} id={`${base}.mySharePct`} label={W.line.mySharePct} planId={planId} dispatch={dispatch} mode="numeric" />}
      <div class="actions-row">
        {V.sharedWithPartner && <Button testid={`${base}.duplicate`} kind="quiet" onClick={() => change({ kind: 'duplicateOneOff', id: o.id })} {...keepFocus}>{W.line.duplicate}</Button>}
        <Button testid={`${base}.remove`} kind="quiet" aria-label={fill(W.line.removeOf, { name })} onClick={() => change({ kind: 'removeOneOff', id: o.id })} {...keepFocus}>{W.oneOffs.remove}</Button>
      </div>
    </li>
  );
}

const toastText = (toast) => {
  if (toast.kind === 'undone') return W.toast.undone;
  if (toast.kind === 'unchanged') return W.toast.unchanged;
  const line = toast.line;
  if (line && W.toast[line.id]) return fill(W.toast[line.id], { ...(line.slots || {}), tier: line.slots && line.slots.tier ? W.tierWords[line.slots.tier] || line.slots.tier : '' });
  return W.toast.savedShort;
};

export function BudgetScreen(state, dispatch) {
  const view = planView(state);
  const V = planBudgetView(state);
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
  const onChange = (place, id = view.id) => dispatch({ type: 'plan/change', planId: id, place, back: href.plan(view.id, 'budget') });
  const rail = <PlanRail view={view} state={state} dispatch={dispatch} onChange={onChange} />;
  const back = href.plan(view.id, 'plan');
  const change = (c) => dispatch({ type: 'plan/budget', planId, change: c });
  const problem = V.problem ? fill(W.problems[V.problem] || W.problems.failed, { store: W.problems.store[V.source] || 'account' }) : null;
  const t = V.totals;
  const who = W.totals.who[V.sharedWithPartner ? 'couple' : 'single'];
  const onFile = (e) => { const f = e.currentTarget.files && e.currentTarget.files[0]; e.currentTarget.value = ''; if (f) dispatch({ type: 'plan/budgetFile', planId, file: f }); };
  return {
    question: null, rail, full: false,
    content: (
      <>
        <Head view={view} />
        <h1 tabIndex={-1} data-testid="plan.step.budget">{W.title}</h1>
        <p class="lead">{W.lead}</p>
        <p class="plan-source" data-testid={`${T}.stamp`}>{V.stampWords ? fill(W.stamp, { date: V.stampWords }) : W.stampUndated} {fill(W.ages, V.ages)}</p>
        {V.locked && <p class="note" data-testid={`${T}.locked`}>{W.locked}</p>}
        {V.shared && <p class="note" data-testid={`${T}.sharedFrom`}>{fill(W.sharedFrom, { name: V.holderName })}</p>}
        {!V.shared && V.readers.length > 0 && <p class="note" data-testid={`${T}.sharedWith`}>{fill(W.sharedWith, { names: V.readers.map((r) => r.name).join('’, ‘') })}</p>}
        {V.readonly && <p class="notice" role="status" data-testid={`${T}.readonly`}>{W.readonly}</p>}

        <section class="headline plan-panel budget-totals" data-region="plan-budget-totals" data-testid={`${T}.totals`} data-has={t.has ? '1' : '0'}>
          <h2>{W.totals.title}</h2>
          {!t.has && <p class="note" data-testid={`${T}.totals.none`}>{W.totals.none}</p>}
          {t.has && <p class="figure" data-testid={`${T}.totals.line`}>{fill(t.shared ? W.totals.monthlyShared : W.totals.monthly, t)}</p>}
          {t.has && <p class="note" data-testid={`${T}.totals.madeOf`}>{t.hasPeriodic ? fill(W.totals.madeOf, { recurring: t.recurringMonthly, periodic: t.periodicMonthly }) : W.totals.madeOfPlain}</p>}
          <p class="note" data-testid={`${T}.totals.levels`}>{fill(W.totals.levels, { who, ...t.levels })}{t.has ? ' ' + fill(W.totals.where[t.where], { spend: t.plsaSpendYearly }) : ''}</p>
          {t.recurring.length > 0 && (
            <div data-testid={`${T}.totals.recurring`}>
              <h3>{W.totals.recurringTitle}</h3>
              <p class="note">{W.totals.recurringLead}</p>
              <ul class="plan-lines">{t.recurring.map((r, i) => <li key={i} class="plan-line">{fill(W.totals.recurringLine, r)}</li>)}</ul>
            </div>
          )}
          {t.singles.length > 0 && (
            <div data-testid={`${T}.totals.singles`}>
              <h3>{W.totals.singlesTitle}</h3>
              <p class="note">{W.totals.singlesLead}</p>
              <ul class="plan-lines">{t.singles.map((r, i) => <li key={i} class="plan-line">{fill(W.totals.singlesLine, r)}{r.age ? fill(W.totals.singlesAt, r) : ''}</li>)}</ul>
            </div>
          )}
          <p class="note" data-testid={`${T}.totals.guide`}>{fill(W.totals.guide, { monthly: t.monthly })}</p>
          <div class="actions-row"><LinkButton testid={`${T}.toSpend`} kind="quiet" href={href.plan(view.id, 'spend')}>{W.totals.toSpend}</LinkButton></div>
        </section>

        <form class="ask about-form income-form budget-form" noValidate onSubmit={(e) => e.preventDefault()} data-region="plan-budget" data-editable={V.editable ? '1' : '0'}>
          {V.editable && (
            <fieldset class="field field-choice budget-tier" data-field="tier" data-testid={`${T}.tier`}>
              <legend>{W.tier.legend}</legend>
              {V.tiers.map((k) => (
                <div class="option" key={k}>
                  <div class="option-row">
                    <input type="radio" id={`${T}.tier.${k}`} data-testid={`${T}.tier.${k}`} name={`${T}.tier`} value={k} checked={V.tier === k} onClick={() => { if (V.tier !== k) change({ kind: 'tier', tier: k }); }} onChange={() => {}} />
                    <label for={`${T}.tier.${k}`}>{W.tier.options[k]}</label>
                  </div>
                </div>
              ))}
              <p class="help">{W.tier.help}</p>
              <div class="actions-row"><Button testid={`${T}.fill`} kind="plain" onClick={() => change({ kind: 'fill' })} aria-describedby={`${T}.fill.help`} {...keepFocus}>{W.tier.fill}</Button></div>
              <p class="help" id={`${T}.fill.help`}>{W.tier.fillHelp}</p>
            </fieldset>
          )}
          {V.editable && <p class="note">{W.saveNote}</p>}
          {V.groups.map((g) => (
            <section class="plan-section budget" key={g.tier} data-section={g.tier} data-testid={`${T}.group.${g.tier}`}>
              <h2>{W.groups[g.tier]} <span class="subtotal" data-testid={`${T}.group.${g.tier}.total`}>{fill(W.groupTotal, { monthly: g.monthly })}</span></h2>
              {g.lines.length === 0 && <p class="note">{W.line.none}</p>}
              {g.lines.length > 0 && <ul class="budget-lines">{g.lines.map((l) => <Line key={l.id} l={l} V={V} planId={planId} dispatch={dispatch} />)}</ul>}
              {V.editable && <AddRow f={V.adds[g.tier]} id={`${T}.add.${g.tier}`} label={fill(W.line.addTo, { group: W.groups[g.tier] })} button={W.line.add} touched={V.touched} planId={planId} dispatch={dispatch} />}
            </section>
          ))}
          {V.editable && (
            <section class="plan-section budget-missed" data-section="missed" data-testid={`${T}.missed`}>
              <h2>{W.missed.title}</h2>
              <p class="note">{W.missed.lead}</p>
              {V.missing.length === 0 && <p class="note">{W.missed.none}</p>}
              {V.missing.length > 0 && <ul class="budget-chips">{V.missing.map((m) => <li key={m.label}><Button testid={`${T}.missed.${m.label.replace(/[^A-Za-z0-9]+/g, '-')}`} kind="quiet" title={m.hint} onClick={() => change({ kind: 'suggest', label: m.label })} {...keepFocus}>{fill(W.missed.add, { label: m.label })}</Button></li>)}</ul>}
            </section>
          )}
          <section class="plan-section budget-oneoffs" data-section="oneOffs" data-testid={`${T}.oneOffs`}>
            <h2>{W.oneOffs.title}</h2>
            <p class="note">{W.oneOffs.lead}</p>
            {V.oneOffs.length === 0 && <p class="note">{W.oneOffs.none}</p>}
            {V.oneOffs.length > 0 && <ul class="budget-oneoff-list">{V.oneOffs.map((o) => <OneOff key={o.id} o={o} V={V} planId={planId} dispatch={dispatch} />)}</ul>}
            {V.editable && <AddRow f={V.adds.oneOff} id={`${T}.addOneOff`} label={W.oneOffs.addName} button={W.oneOffs.add} touched={V.touched} planId={planId} dispatch={dispatch} />}
          </section>
          {V.sharedWithPartner && (
            <section class="plan-section budget-phases" data-section="phases" data-testid={`${T}.phases`}>
              <h2>{W.phases.title}</h2>
              <p class="note">{W.phases.lead}</p>
              {V.phases.length === 0 && <p class="note">{W.phases.none}</p>}
              {V.phases.map((p) => (
                <div class="budget-part budget-phase" key={p.i} data-phase={p.i} data-testid={`${T}.phase.${p.i}`}>
                  {V.editable ? (
                    <>
                      <Box f={p.fromAge} id={`${T}.phase.${p.i}.fromAge`} label={W.phases.fromAge} planId={planId} dispatch={dispatch} mode="numeric" />
                      <Box f={p.mySharePct} id={`${T}.phase.${p.i}.mySharePct`} label={W.phases.mySharePct} planId={planId} dispatch={dispatch} mode="numeric" />
                      <Button testid={`${T}.phase.${p.i}.remove`} kind="quiet" aria-label={W.phases.remove} onClick={() => change({ kind: 'phaseRemove', i: p.i })} {...keepFocus}>{W.line.remove}</Button>
                    </>
                  ) : <span>{W.phases.fromAge} {p.fromAge.saved || '—'}, {W.phases.mySharePct} {p.mySharePct.saved || '—'}</span>}
                </div>
              ))}
              {V.editable && <div class="actions-row"><Button testid={`${T}.phaseAdd`} kind="quiet" onClick={() => change({ kind: 'phaseAdd' })} {...keepFocus}>+ {W.phases.add}</Button></div>}
            </section>
          )}
          <section class="plan-section budget-tools" data-section="tools" data-testid={`${T}.tools`}>
            <h2>{W.tools.title}</h2>
            <div class="actions-row">
              <Button testid={`${T}.download`} kind="plain" onClick={() => dispatch({ type: 'plan/budgetDownload', planId })} aria-describedby={`${T}.download.help`} {...keepFocus}>{W.tools.download}</Button>
            </div>
            <p class="help" id={`${T}.download.help`}>{W.tools.downloadHelp}</p>
            {V.editable && (
              <div class="field field-file" data-field="spreadsheet">
                <label for={`${T}.open`}>{W.tools.open}</label>
                <div class="box"><input type="file" id={`${T}.open`} data-testid={`${T}.open`} name={`${T}.open`} accept=".csv,text/csv" data-shell-box onChange={onFile} aria-describedby={`${T}.open.help`} /></div>
                <p class="help" id={`${T}.open.help`}>{W.tools.openHelp}</p>
                {V.imported && (
                  <div class="notice lock-confirm" role="region" aria-label={W.tools.open} data-testid={`${T}.import`}>
                    <p data-testid={`${T}.import.read`}>{V.imported.canImport ? fill(W.tools.read, { lines: String(V.imported.lines), s: V.imported.lines === 1 ? '' : 's', oneOffs: String(V.imported.oneOffs), t: V.imported.oneOffs === 1 ? '' : 's' }) : W.tools.readNone}</p>
                    {V.imported.warnings.length > 0 && <p class="note" data-testid={`${T}.import.warnings`}>{W.tools.warnings}{V.imported.warnings.join('; ')}</p>}
                    <div class="actions-row">
                      {V.imported.canImport && <Button testid={`${T}.import.replace`} kind="primary" onClick={() => change({ kind: 'spreadsheet', text: V.importText })} {...keepFocus}>{W.tools.replace}</Button>}
                      <Button testid={`${T}.import.cancel`} kind="quiet" onClick={() => dispatch({ type: 'plan/edit', planId, path: 'import.text', value: '' })} {...keepFocus}>{W.tools.cancel}</Button>
                    </div>
                  </div>
                )}
              </div>
            )}
            {V.editable && (
              <div class="budget-reset" data-testid={`${T}.resetBox`}>
                <h3>{W.tools.resetTitle}</h3>
                {!V.resetOpen && <div class="actions-row"><Button testid={`${T}.reset`} kind="quiet" onClick={() => dispatch({ type: 'ui/toggle', id: 'budgetReset' })} {...keepFocus}>{W.tools.reset}</Button></div>}
                {V.resetOpen && (
                  <div class="notice lock-confirm" role="region" aria-label={W.tools.resetTitle} data-testid={`${T}.resetConfirm`}>
                    <p>{W.tools.resetAsk}</p>
                    <div class="actions-row">
                      <Button testid={`${T}.resetConfirm.yes`} kind="primary" onClick={() => { dispatch({ type: 'ui/toggle', id: 'budgetReset' }); change({ kind: 'reset' }); }} {...keepFocus}>{W.tools.resetYes}</Button>
                      <Button testid={`${T}.resetConfirm.no`} kind="quiet" onClick={() => dispatch({ type: 'ui/toggle', id: 'budgetReset' })} {...keepFocus}>{W.tools.resetNo}</Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>
          {problem && <p class="notice" role="alert" data-testid={`${T}.problem`} data-problem={V.problem}>{problem}</p>}
        </form>
        <div class="actions-row">
          <LinkButton testid={`${T}.back`} kind="quiet" href={back}>{W.buttons.back}</LinkButton>
        </div>
        <UndoToast prefix={T} toast={V.toast} text={V.toast ? toastText(V.toast) : ''} words={W.buttons}
          onUndo={() => dispatch({ type: 'plan/undo', planId })} onClose={() => dispatch({ type: 'plan/toastClose' })} />
      </>
    )
  };
}
