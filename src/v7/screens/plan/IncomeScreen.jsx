/**
 * "Money that comes in anyway" (research/v7/editing-in-v7.md 7): the second editing step of a saved plan in V7. The State
 * Pension (full, forecast, none — or as the planner assumes), final-salary pensions, other income, income for some years and
 * lump sums, each once, by age, before tax; the lists as cards with Add and Remove; the saved value and its source beside
 * each box; what it works out to shown, never asked; Save, Cancel and after a save the Undo toast. A locked plan, or one
 * shown as saved, is read-only here. Draws only: everything is the reading's (state/select.js incomeView, from
 * answers/plan/income.js through the plan source).
 */
import { PlanRail, EditField, UndoToast, fill, Button, LinkButton } from '../../components/index.js';
import { planView, incomeView } from '../../state/select.js';
import { href } from '../../router/routes.js';
import { PLAN } from '../../copy/plan.js';
import { INCOME } from '../../copy/income.js';

const w = PLAN.page;
/**
 * A button that does not take the focus on mousedown: the box being typed in keeps it, so nothing is marked (and the page
 * does not move under the pointer) before the click lands. Save marks every box itself; Add and Remove need no mark.
 */
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

/** Ids in a line's slots (how it rises, what a lump sum is) drawn by their words. */
const worded = (slots) => ({ ...slots, rises: INCOME.rises[slots.rises] || slots.rises, what: INCOME.wrappers[slots.what] || slots.what });

/** The derived figures (7.1): shown, never asked. */
function Derived({ inc }) {
  return (
    <section class="plan-section about-derived" data-section="derived">
      <h3>{INCOME.derivedTitle}</h3>
      <ul class="plan-lines">
        {inc.derived.map((d, i) => <li key={i} class="plan-line" data-line={'income.' + d.id}>{fill(INCOME.derived[d.id] || '', worded(d.slots))}</li>)}
      </ul>
    </section>
  );
}

function Partners({ inc }) {
  if (!inc.partners.length) return null;
  return (
    <section class="plan-section" data-section="partners">
      {inc.partners.map((p) => (
        <p class="note" key={p.id} data-testid="plan.income.partner">{fill(INCOME.partner, { name: p.name })} <a href={href.plan(p.id, 'income')}>{fill(INCOME.partnerLink, { name: p.name })}</a></p>
      ))}
    </section>
  );
}

const toastText = (toast) => {
  if (toast.kind === 'undone') return INCOME.toast.undone;
  if (toast.kind === 'unchanged') return INCOME.toast.unchanged;
  if (!toast.line) return INCOME.toast.savedShort;
  const s = toast.line.slots;
  return fill(INCOME.toast.saved, { ...s, sp: fill(INCOME.toast.sp[s.sp] || INCOME.toast.sp.paidNoAge, s) });
};

/** One card of a list (7.2): its boxes, the saved value beside each, Remove. */
function Card({ L, card, n, inc, planId, dispatch, sourceText, slots, onRemove }) {
  const words = INCOME.lists[L];
  const last = (path) => path.split('.').pop();
  return (
    <fieldset class="income-card" data-card={`${L}.${card.id}`} data-new={card.saved ? '0' : '1'}>
      <legend>{fill(words.one, { n })}</legend>
      {card.fields.map((f) => (
        <EditField key={f.path} step="income" f={f} words={words.fields[last(f.path)]} errors={words.errors[last(f.path)] || {}}
          source={card.saved ? sourceText : null} savedWords={INCOME.savedValue} planId={planId} dispatch={dispatch} slots={slots} />
      ))}
      <div class="actions-row income-card-actions">
        <Button testid={`plan.income.${L}.remove.${card.id}`} kind="quiet" onClick={() => onRemove(L, card.id)} {...keepFocus}>{words.remove}</Button>
      </div>
    </fieldset>
  );
}

/** A list of cards with its Add button; the next new id is "n" + one more than the highest new id in use. */
function Cards({ L, inc, planId, dispatch, sourceText, slots }) {
  const list = inc.lists[L];
  const words = INCOME.lists[L];
  const setIds = (ids) => dispatch({ type: 'plan/edit', planId, path: `${L}.ids`, value: ids.join(',') });
  const onAdd = () => {
    const used = list.ids.filter((x) => /^n\d+$/.test(x)).map((x) => +x.slice(1));
    setIds([...list.ids, 'n' + ((used.length ? Math.max(...used) : 0) + 1)]);
  };
  const onRemove = (l, id) => setIds(list.ids.filter((x) => x !== id));
  return (
    <section class="income-section" data-section={L}>
      <h2>{INCOME.sections[L]}</h2>
      {list.cards.length === 0 && <p class="note income-none" data-testid={`plan.income.${L}.none`}>{words.none}</p>}
      {list.cards.map((card, i) => <Card key={card.id} L={L} card={card} n={i + 1} inc={inc} planId={planId} dispatch={dispatch} sourceText={sourceText} slots={slots} onRemove={onRemove} />)}
      <div class="actions-row income-add-row">
        <Button testid={`plan.income.${L}.add`} kind="plain" onClick={onAdd} {...keepFocus}>{words.add}</Button>
      </div>
    </section>
  );
}

export function IncomeScreen(state, dispatch) {
  const view = planView(state);
  const inc = incomeView(state);
  const list = view.found ? null : (state.plans ? state.plans.status : 'none');
  if (!view.found || !inc.found) {
    const waiting = list === 'none' || list === 'checking' || list === 'reading' || (view.found && !inc.found);
    return {
      question: null, rail: false, full: false,
      content: (
        <>
          <h1 tabIndex={-1}>{INCOME.title}</h1>
          {waiting ? <p class="lead" role="status" data-testid="plan.opening">{PLAN.list.opening}</p>
            : state.session.kind === 'nobody' && (!state.plans || !state.plans.list.length) ? <p class="lead" data-testid="plan.signIn">{PLAN.list.signIn} <a href={href.plans()}>{PLAN.list.toPlans}</a></p>
              : <p class="lead" data-testid="plan.unknown">{PLAN.list.unknown} <a href={href.plans()}>{PLAN.list.toPlans}</a></p>}
        </>
      )
    };
  }
  const planId = inc.id;
  const onChange = (place, id = view.id) => dispatch({ type: 'plan/change', planId: id, place, back: href.plan(view.id, 'income') });
  const back = href.plan(view.id, 'plan');
  const slots = { full: inc.fullYearly, ageNow: inc.ageNow, endAge: inc.endAge };
  const field = (path) => inc.fields.find((f) => f.path === path);
  const sourceText = inc.locked ? fill(INCOME.source.locked, { date: inc.lockedOn }) : inc.source && inc.source.at ? fill(INCOME.source.saved, { date: inc.source.at }) : INCOME.source.savedUndated;
  const F = (path, more = {}) => <EditField step="income" f={field(path)} words={INCOME.fields[path]} errors={INCOME.errors[path]} source={sourceText} savedWords={INCOME.savedValue} planId={planId} dispatch={dispatch} slots={slots} {...more} />;

  // A locked plan, or one shown as saved: the figures, read-only (7.4).
  if (!inc.editable) {
    return {
      question: null, rail: <PlanRail view={view} state={state} dispatch={dispatch} onChange={onChange} />, full: false,
      content: (
        <>
          <Head view={view} />
          <h1 tabIndex={-1} data-testid="plan.step.income">{INCOME.title}</h1>
          <section class="headline plan-panel" data-region="plan-income" data-editable="0">
            <Derived inc={inc} />
            {inc.locked ? <p class="note plan-fixed" data-testid="plan.income.fixed">{fill(w.fixed, { date: inc.lockedOn })}</p> : <p class="notice" role="status">{INCOME.readonly}</p>}
            {inc.locked && <p class="note" data-testid="plan.unlock">{w.unlock}</p>}
            <Partners inc={inc} />
          </section>
          <div class="actions-row">
            <LinkButton testid="plan.income.back" kind="quiet" href={back}>{INCOME.buttons.back}</LinkButton>
          </div>
        </>
      )
    };
  }

  const onSubmit = (e) => {
    e.preventDefault();
    const root = e.currentTarget;
    dispatch({ type: 'plan/save', planId });
    const firstPath = Object.keys(inc.errors).find((p) => (field(p) ? field(p).applies : true));
    if (!firstPath) return;
    const el = root.querySelector(`[id="plan.income.${firstPath}"]`) || root.querySelector(`[name="plan.income.${firstPath}"]:checked`) || root.querySelector(`[name="plan.income.${firstPath}"]`);
    if (el) el.focus();
  };
  const onCancel = () => dispatch({ type: 'plan/cancel', planId });
  const notUsed = new Set(inc.notUsed || []);
  const problem = inc.problem ? (INCOME.problems[inc.problem] || INCOME.problems.failed) : null;
  // beside the State Pension choice: "(My forecast, £230.25 a week)" when a forecast is saved
  const spSavedWords = inc.spSaved.kind === 'forecast' && inc.spSaved.weekly ? `({value}, ${inc.spSaved.weekly} a week)` : INCOME.savedValue;

  return {
    question: null,
    rail: <PlanRail view={view} state={state} dispatch={dispatch} onChange={onChange} />,
    full: false,
    content: (
      <>
        <Head view={view} />
        <h1 tabIndex={-1} data-testid="plan.step.income">{INCOME.title}</h1>
        <p class="lead">{INCOME.lead}</p>
        <form class="ask about-form income-form" noValidate onSubmit={onSubmit} data-region="plan-income" data-editable="1">
          <section class="income-section" data-section="sp">
            <h2>{INCOME.sections.sp}</h2>
            {inc.assumed && <p class="note" data-testid="plan.income.assumed">{fill(inc.assumed.age != null ? INCOME.assumedNote : INCOME.assumedNoteNoAge, inc.assumed)}</p>}
            {F('spKind', { nested: { forecast: F('spWeekly') }, savedWords: spSavedWords })}
            {notUsed.has('spKind') && <p class="note">{INCOME.notUsed}</p>}
          </section>
          <Cards L="fs" inc={inc} planId={planId} dispatch={dispatch} sourceText={sourceText} slots={slots} />
          <section class="income-section" data-section="other">
            <h2>{INCOME.sections.other}</h2>
            {F('other')}
            {notUsed.has('other') && <p class="note">{INCOME.notUsed}</p>}
          </section>
          <Cards L="streams" inc={inc} planId={planId} dispatch={dispatch} sourceText={sourceText} slots={slots} />
          <Cards L="lumps" inc={inc} planId={planId} dispatch={dispatch} sourceText={sourceText} slots={slots} />
          <Derived inc={inc} />
          <Partners inc={inc} />
          {problem && <p class="notice" role="alert" data-testid="plan.income.problem" data-problem={inc.problem}>{problem}</p>}
          <div class="actions-row about-actions">
            <Button testid="plan.income.save" kind="primary" type="submit" disabled={!!inc.saving} {...keepFocus}>{inc.saving ? INCOME.saving : INCOME.buttons.save}</Button>
            <Button testid="plan.income.cancel" kind="quiet" onClick={onCancel} {...keepFocus}>{INCOME.buttons.cancel}</Button>
            <LinkButton testid="plan.income.back" kind="quiet" href={back}>{INCOME.buttons.back}</LinkButton>
          </div>
        </form>
        <UndoToast prefix="plan.income" toast={inc.toast} text={inc.toast ? toastText(inc.toast) : ''} words={INCOME.buttons}
          onUndo={() => dispatch({ type: 'plan/undo', planId })} onClose={() => dispatch({ type: 'plan/toastClose' })} />
      </>
    )
  };
}
