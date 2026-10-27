/**
 * "What you spend" (research/v7/editing-in-v7.md 8): the third editing step of a saved plan in V7. The figure from the
 * plan's start and the later steps by age — each a month after tax, at today's prices, with what happens from it (stays
 * the same, falls by a percentage a year, moves evenly to the next) — the go-go, go-slow and no-go suggestion, the picture
 * of every year, the one-off costs by age, and the budget as a guide beside it all. The before-tax figure the plan saves
 * is shown under every amount, never asked. Save, Cancel and after a save the Undo toast. A locked plan, or one shown as
 * saved, is read-only here. Draws only: everything is the reading's (state/select.js spendView, from
 * answers/plan/spend.js through the plan source).
 */
import { PlanRail, EditField, UndoToast, fill, Button, LinkButton, ShapeChart } from '../../components/index.js';
import { ThenBox } from '../../components/StepsField.jsx';
import { planView, planSpendView } from '../../state/select.js';
import { href } from '../../router/routes.js';
import { PLAN } from '../../copy/plan.js';
import { SHAPE } from '../../copy/shape.js';
import { SPEND } from '../../copy/spend.js';

const w = PLAN.page;
/** A button that does not take the focus on mousedown (IncomeScreen): the box being typed in keeps it. */
const keepFocus = { onMouseDown: (e) => e.preventDefault() };
const last = (path) => path.split('.').pop();

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

/** Ids in a line's slots drawn by their words. */
const worded = (slots) => ({ ...slots, prices: SPEND.prices[slots.prices] || slots.prices });

/** The derived figures (8.2): shown, never asked. */
function Derived({ sp }) {
  return (
    <section class="plan-section about-derived" data-section="derived">
      <h3>{SPEND.derivedTitle}</h3>
      <ul class="plan-lines">
        {sp.derived.map((d, i) => <li key={i} class="plan-line" data-line={'spend.' + d.id}>{fill(SPEND.derived[d.id] || '', worded(d.slots))}</li>)}
      </ul>
    </section>
  );
}

function Partners({ sp }) {
  if (!sp.partners.length) return null;
  return (
    <section class="plan-section" data-section="partners">
      {sp.partners.map((p) => (
        <p class="note" key={p.id} data-testid="plan.spend.partner">{fill(SPEND.partner, { name: p.name })} <a href={href.plan(p.id, 'spend')}>{fill(SPEND.partnerLink, { name: p.name })}</a></p>
      ))}
    </section>
  );
}

/** The budget as a guide (the owner's rule): read only; "Use" fills the first row; the lines are changed on the budget step (road-to-7.md step 11b). */
function BudgetGuide({ sp, planId, dispatch, editable }) {
  const b = sp.budget;
  const budgetHref = href.plan(planId, 'budget');
  return (
    <section class="plan-section spend-budget" data-section="budget" data-worked-out={b.workedOut ? '1' : '0'}>
      <h2>{SPEND.sections.budget}</h2>
      {b.workedOut ? (
        <>
          <p data-testid="plan.spend.budget.total">{fill(b.essentials ? SPEND.budget.total : SPEND.budget.totalNoEssentials, { total: b.total, essentials: b.essentials })} <span class="plan-source">{b.at ? fill(SPEND.budget.source, { date: b.at }) : SPEND.budget.sourceUndated}</span></p>
          <p class="note" data-testid="plan.spend.budget.guide">{SPEND.budget.guide}</p>
          <div class="actions-row">
            {editable && <Button testid="plan.spend.budget.use" kind="plain" onClick={() => dispatch({ type: 'plan/edit', planId, path: 'first.amount', value: String(b.totalValue) })} {...keepFocus}>{fill(SPEND.budget.use, { total: b.total })}</Button>}
            <LinkButton testid="plan.spend.budget.change" kind="quiet" href={budgetHref}>{SPEND.budget.change}</LinkButton>
          </div>
        </>
      ) : (
        <>
          <p class="note" data-testid="plan.spend.budget.none">{SPEND.budget.none}</p>
          <div class="actions-row">
            <LinkButton testid="plan.spend.budget.change" kind="quiet" href={budgetHref}>{SPEND.budget.workOut}</LinkButton>
          </div>
        </>
      )}
    </section>
  );
}

/** The "then" box and its fall box for a row, on the plan's own paths. */
function Then({ base, shownThen, shownFalls, errThen, errFalls, isLast, label, planId, dispatch, hasSteps }) {
  const set = (path, value) => dispatch({ type: 'plan/edit', planId, path, value });
  const touch = (path) => dispatch({ type: 'plan/touch', planId, path });
  // "moves evenly" needs a later step: on the first row only while there is one; on a later step never on the last by age
  const lastForBox = base === 'first' ? !hasSteps : isLast;
  return (
    <ThenBox id={`plan.spend.${base}.then`} value={shownThen} last={lastForBox} label={label}
      error={errThen ? (base === 'first' ? SPEND.errors['first.then'][errThen] : SPEND.steps.errors.then[errThen]) || SHAPE.errors.other : null}
      onChange={(v) => set(`${base}.then`, v)}
      fallsId={`plan.spend.${base}.fallsPct`} falls={shownFalls || ''}
      fallsError={errFalls ? (base === 'first' ? SPEND.errors['first.fallsPct'][errFalls] : SPEND.steps.errors.fallsPct[errFalls]) || SHAPE.errors.fallsPct.range : null}
      onFalls={(v) => set(`${base}.fallsPct`, v)} onFallsLeave={() => touch(`${base}.fallsPct`)} />
  );
}

/** One later step as a card: its age and amount (EditField), its "then", Remove. */
function StepCard({ card, n, sp, planId, dispatch, sourceText, slots, onRemove }) {
  const words = SPEND.steps;
  const f = (name) => card.fields.find((x) => last(x.path) === name);
  const help = card.gross ? fill(card.ofBudget != null ? words.grossBudget : words.gross, { gross: card.gross, pct: card.ofStart == null ? '' : card.ofStart, budgetPct: card.ofBudget == null ? '' : card.ofBudget }) : undefined;
  return (
    <fieldset class="income-card spend-card" data-card={`steps.${card.id}`} data-new={card.saved ? '0' : '1'}>
      <legend>{fill(words.one, { n })}</legend>
      <EditField step="spend" f={f('fromAge')} words={words.fields.fromAge} errors={words.errors.fromAge} source={card.saved ? sourceText : null} savedWords={SPEND.savedValue} planId={planId} dispatch={dispatch} slots={slots} />
      <EditField step="spend" f={f('amount')} words={words.fields.amount} errors={words.errors.amount} source={card.saved ? sourceText : null} savedWords={SPEND.savedValue} planId={planId} dispatch={dispatch} slots={slots} help={help} />
      <Then base={`steps.${card.id}`} shownThen={f('then').shown || 'level'} shownFalls={f('fallsPct').shown} errThen={f('then').error} errFalls={f('fallsPct').error} isLast={card.last}
        label={f('fromAge').shown ? fill(SHAPE.then.labelOf, { age: f('fromAge').shown }) : SHAPE.step.titleNew} planId={planId} dispatch={dispatch} hasSteps />
      <div class="actions-row income-card-actions">
        <Button testid={`plan.spend.steps.remove.${card.id}`} kind="quiet" onClick={() => onRemove(card.id)} {...keepFocus}>{words.remove}</Button>
      </div>
    </fieldset>
  );
}

/** One one-off cost as a card. */
function CostCard({ card, n, planId, dispatch, sourceText, slots, onRemove }) {
  const words = SPEND.costs;
  return (
    <fieldset class="income-card spend-card" data-card={`costs.${card.id}`} data-new={card.saved ? '0' : '1'}>
      <legend>{fill(words.one, { n })}</legend>
      {card.fields.map((f) => (
        <EditField key={f.path} step="spend" f={f} words={words.fields[last(f.path)]} errors={words.errors[last(f.path)] || {}}
          source={card.saved ? sourceText : null} savedWords={SPEND.savedValue} planId={planId} dispatch={dispatch} slots={slots}
          help={last(f.path) === 'amount' && card.gross ? fill(words.gross, { gross: card.gross }) : undefined} />
      ))}
      <div class="actions-row income-card-actions">
        <Button testid={`plan.spend.costs.remove.${card.id}`} kind="quiet" onClick={() => onRemove(card.id)} {...keepFocus}>{words.remove}</Button>
      </div>
    </fieldset>
  );
}

const nextNewId = (ids) => { const used = ids.filter((x) => /^n\d+$/.test(x)).map((x) => +x.slice(1)); return 'n' + ((used.length ? Math.max(...used) : 0) + 1); };

const toastText = (toast) => {
  if (toast.kind === 'undone') return SPEND.toast.undone;
  if (toast.kind === 'unchanged') return SPEND.toast.unchanged;
  if (!toast.line) return SPEND.toast.savedShort;
  return fill(SPEND.toast.saved, toast.line.slots);
};

export function SpendScreen(state, dispatch) {
  const view = planView(state);
  const sp = planSpendView(state);
  const list = view.found ? null : (state.plans ? state.plans.status : 'none');
  if (!view.found || !sp.found) {
    const waiting = list === 'none' || list === 'checking' || list === 'reading' || (view.found && !sp.found);
    return {
      question: null, rail: false, full: false,
      content: (
        <>
          <h1 tabIndex={-1}>{SPEND.title}</h1>
          {waiting ? <p class="lead" role="status" data-testid="plan.opening">{PLAN.list.opening}</p>
            : state.session.kind === 'nobody' && (!state.plans || !state.plans.list.length) ? <p class="lead" data-testid="plan.signIn">{PLAN.list.signIn} <a href={href.plans()}>{PLAN.list.toPlans}</a></p>
              : <p class="lead" data-testid="plan.unknown">{PLAN.list.unknown} <a href={href.plans()}>{PLAN.list.toPlans}</a></p>}
        </>
      )
    };
  }
  const planId = sp.id;
  const onChange = (place, id = view.id) => dispatch({ type: 'plan/change', planId: id, place, back: href.plan(view.id, 'spend') });
  const back = href.plan(view.id, 'plan');
  const slots = { ageNow: sp.ageNow, endAge: sp.endAge, startAge: sp.startAge };
  const field = (path) => sp.fields.find((f) => f.path === path);
  const sourceText = sp.locked ? fill(SPEND.source.locked, { date: sp.lockedOn }) : sp.source && sp.source.at ? fill(SPEND.source.saved, { date: sp.source.at }) : SPEND.source.savedUndated;
  const chartOpen = state.ui.open.includes('shapeYears');
  const chart = sp.chart ? <ShapeChart q="plan.spend" chart={sp.chart} open={chartOpen} dispatch={dispatch} title={SPEND.chartTitle} /> : null;

  // A locked plan, or one shown as saved: the figures, read-only (8.4). The budget guide stays (the lock does not freeze it).
  if (!sp.editable) {
    return {
      question: null, rail: <PlanRail view={view} state={state} dispatch={dispatch} onChange={onChange} />, full: false,
      content: (
        <>
          <Head view={view} />
          <h1 tabIndex={-1} data-testid="plan.step.spend">{SPEND.title}</h1>
          <section class="headline plan-panel" data-region="plan-spend" data-editable="0">
            <Derived sp={sp} />
            {chart}
            {sp.locked ? <p class="note plan-fixed" data-testid="plan.spend.fixed">{fill(w.fixed, { date: sp.lockedOn })}</p> : <p class="notice" role="status">{SPEND.readonly}</p>}
            {sp.locked && <p class="note" data-testid="plan.unlock">{w.unlock}</p>}
            {!sp.readonly && <BudgetGuide sp={sp} planId={planId} dispatch={dispatch} editable={false} />}
            <Partners sp={sp} />
          </section>
          <div class="actions-row">
            <LinkButton testid="plan.spend.back" kind="quiet" href={back}>{SPEND.buttons.back}</LinkButton>
          </div>
        </>
      )
    };
  }

  const onSubmit = (e) => {
    e.preventDefault();
    const root = e.currentTarget;
    dispatch({ type: 'plan/save', planId });
    const firstPath = Object.keys(sp.errors)[0];
    if (!firstPath) return;
    const el = root.querySelector(`[id="plan.spend.${firstPath}"]`) || root.querySelector(`[name="plan.spend.${firstPath}"]:checked`) || root.querySelector(`[name="plan.spend.${firstPath}"]`);
    if (el) el.focus();
  };
  const onCancel = () => dispatch({ type: 'plan/cancel', planId });
  const problem = sp.problem ? (SPEND.problems[sp.problem] || SPEND.problems.failed) : null;
  const steps = sp.lists.steps, costs = sp.lists.costs;
  const setIds = (L, ids) => dispatch({ type: 'plan/edit', planId, path: `${L}.ids`, value: ids.join(',') });
  const onAddStep = () => setIds('steps', [...steps.ids, nextNewId(steps.ids)]);
  const onAddCost = () => setIds('costs', [...costs.ids, nextNewId(costs.ids)]);
  const onSuggest = () => { for (const ed of sp.suggestion.edits) dispatch({ type: 'plan/edit', planId, path: ed.path, value: ed.value }); };
  const sug = sp.suggestion;
  const sugWords = !sug ? '' : sug.age75 != null ? fill(SPEND.steps.suggestDone, { age75: sug.age75, age85: sug.age85, floor: sug.floor != null ? fill(SPEND.steps.suggestFloor, { amount: sug.floor }) : '' })
    : sug.age85 != null ? fill(SPEND.steps.suggestDoneOne, { age85: sug.age85, floor: sug.floor != null ? fill(SPEND.steps.suggestFloor, { amount: sug.floor }) : '' }) : SPEND.steps.suggestNone;
  const first = field('first.amount');
  const fThen = field('first.then'), fFalls = field('first.fallsPct');

  return {
    question: null,
    rail: <PlanRail view={view} state={state} dispatch={dispatch} onChange={onChange} />,
    full: false,
    content: (
      <>
        <Head view={view} />
        <h1 tabIndex={-1} data-testid="plan.step.spend">{SPEND.title}</h1>
        <p class="lead">{SPEND.lead}</p>
        <form class="ask about-form income-form spend-form" noValidate onSubmit={onSubmit} data-region="plan-spend" data-editable="1">
          <BudgetGuide sp={sp} planId={planId} dispatch={dispatch} editable />
          <section class="income-section" data-section="first">
            <h2>{SPEND.sections.first}</h2>
            <fieldset class="income-card spend-card spend-first" data-card="first">
              <legend data-testid="plan.spend.first.legend">{fill(sp.flat && !steps.cards.length ? SPEND.first.legendFlat : SPEND.first.legend, { age: sp.startAge })}</legend>
              <EditField step="spend" f={first} words={{ label: SPEND.first.amount }} errors={SPEND.errors['first.amount']} source={sourceText} savedWords={SPEND.savedValue} planId={planId} dispatch={dispatch} slots={slots}
                help={fill(SPEND.first.gross, { gross: sp.firstGross })} />
              <Then base="first" shownThen={fThen.shown || 'level'} shownFalls={fFalls.shown} errThen={fThen.error} errFalls={fFalls.error} isLast={!steps.cards.length}
                label={SHAPE.then.labelFirst} planId={planId} dispatch={dispatch} hasSteps={steps.cards.length > 0} />
              {sp.floorAndFlex && <p class="note" data-testid="plan.spend.floorAndFlex">{SPEND.first.floorAndFlex}</p>}
            </fieldset>
          </section>
          <section class="income-section" data-section="steps">
            <h2>{SPEND.sections.steps}</h2>
            <p class="note">{SPEND.steps.suggestHelp}</p>
            {steps.cards.length === 0 && <p class="note income-none" data-testid="plan.spend.steps.none">{SPEND.steps.none}</p>}
            {steps.cards.map((card, i) => <StepCard key={card.id} card={card} n={i + 1} sp={sp} planId={planId} dispatch={dispatch} sourceText={sourceText} slots={slots} onRemove={(id) => setIds('steps', steps.ids.filter((x) => x !== id))} />)}
            <div class="actions-row income-add-row">
              <Button testid="plan.spend.steps.add" kind="plain" onClick={onAddStep} {...keepFocus}>{SPEND.steps.add}</Button>
              {sug && <Button testid="plan.spend.steps.suggest" kind="plain" onClick={onSuggest} aria-describedby="plan.spend.steps.suggest.help" {...keepFocus}>{SPEND.steps.suggest}</Button>}
            </div>
            {sug && <p class="note" id="plan.spend.steps.suggest.help" data-testid="plan.spend.steps.suggestWords">{sugWords}</p>}
            {sp.lumps.length > 0 && (
              <div class="spend-lumps" data-testid="plan.spend.lumps">
                <p class="note">{SPEND.lumps.lead}</p>
                <ul class="plan-lines">
                  {sp.lumps.map((l) => (
                    <li key={l.id} class="plan-line" data-testid={`plan.spend.lumps.${l.id}`} data-age={l.age} data-per-year={l.perYearValue}>
                      {fill(SPEND.lumps.line, l)}
                      {l.edits && <div class="actions-row"><Button testid={`plan.spend.lumps.${l.id}.add`} kind="quiet" aria-describedby="plan.spend.lumps.help" onClick={() => { for (const ed of l.edits) dispatch({ type: 'plan/edit', planId, path: ed.path, value: ed.value }); }} {...keepFocus}>{fill(SPEND.lumps.add, l)}</Button></div>}
                    </li>
                  ))}
                </ul>
                <p class="help" id="plan.spend.lumps.help">{SPEND.lumps.help}</p>
              </div>
            )}
          </section>
          {chart && (
            <section class="income-section" data-section="chart">
              {chart}
              {sp.below && <p class="notice shape-below" data-testid="plan.spend.below">{fill(SHAPE.belowEssentials, { age: sp.below.age, amount: sp.below.amount })}</p>}
              {sp.floorFrom && <p class="notice shape-below" data-testid="plan.spend.floorFrom">{fill(SPEND.derived['floor.from'], { age: sp.floorFrom.age, monthly: sp.floorFrom.amount })}</p>}
            </section>
          )}
          <section class="income-section" data-section="costs">
            <h2>{SPEND.sections.costs}</h2>
            <p class="note">{SPEND.costs.lead}</p>
            {costs.cards.length === 0 && <p class="note income-none" data-testid="plan.spend.costs.none">{SPEND.costs.none}</p>}
            {costs.cards.map((card, i) => <CostCard key={card.id} card={card} n={i + 1} planId={planId} dispatch={dispatch} sourceText={sourceText} slots={slots} onRemove={(id) => setIds('costs', costs.ids.filter((x) => x !== id))} />)}
            <div class="actions-row income-add-row">
              <Button testid="plan.spend.costs.add" kind="plain" onClick={onAddCost} {...keepFocus}>{SPEND.costs.add}</Button>
            </div>
          </section>
          <Derived sp={sp} />
          <Partners sp={sp} />
          {problem && <p class="notice" role="alert" data-testid="plan.spend.problem" data-problem={sp.problem}>{problem}</p>}
          <div class="actions-row about-actions">
            <Button testid="plan.spend.save" kind="primary" type="submit" disabled={!!sp.saving} {...keepFocus}>{sp.saving ? SPEND.saving : SPEND.buttons.save}</Button>
            <Button testid="plan.spend.cancel" kind="quiet" onClick={onCancel} {...keepFocus}>{SPEND.buttons.cancel}</Button>
            <LinkButton testid="plan.spend.back" kind="quiet" href={back}>{SPEND.buttons.back}</LinkButton>
          </div>
        </form>
        <UndoToast prefix="plan.spend" toast={sp.toast} text={sp.toast ? toastText(sp.toast) : ''} words={SPEND.buttons}
          onUndo={() => dispatch({ type: 'plan/undo', planId })} onClose={() => dispatch({ type: 'plan/toastClose' })} />
      </>
    )
  };
}
