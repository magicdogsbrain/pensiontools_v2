/**
 * A plan's home (7.3.0; research/v7/one-product-design.md, "The plan home"; the mock-up research/v7/mockups/first-visit.html,
 * screen 4), on #/plan/<id> for every plan, locked or not: the plan's line and its stage, what is due (at most three, the
 * first the one thing to press), the year's months against the plan and where you are side by side on a wide screen, the
 * tools with their one-line states, then everything else folded away — the steps, changing or trying something, and a
 * question with the plan's figures. The rail is not drawn here: the home is the rail laid out.
 *
 * Draws only: the reading is answers/plan/home.js homeOf (state/select.js planView → page.home), the same reading the
 * rail's "Next" comes from. Nothing here writes a plan; "Not now" is kept for this window only (effects/place.js).
 */
import { PlanLine, PlanSentence, fill, Button, LinkButton, Money, Counted, notNowPress } from '../../components/index.js';
import { planView, plansView } from '../../state/select.js';
import { href } from '../../router/routes.js';
import { PLAN } from '../../copy/plan.js';
import { HOME } from '../../copy/home.js';

const T = 'plan.home';

/** A to-do's title and line, filled from its slots. */
const itemWords = (it) => {
  const words = (it.soon ? HOME.soon[it.id] : null) || HOME.items[it.id] || { title: PLAN.next[it.pid] || it.id, detail: '' };
  return { title: fill(words.title, it.slots), detail: fill(words.detail, it.slots) };
};

function Item({ it, first, planId, dispatch, partner = null }) {
  const w = itemWords(it);
  const b = it.button;
  const label = b ? fill(PLAN.buttons[b.id] || b.id, b.slots) : null;
  // a soon item's button chooses the month it opens Month by month on (the tax year's set-up is reached from there)
  const onPress = b && b.choose ? () => dispatch({ type: 'plan/edit', planId: partner ? partner.planId : planId, path: 'mo.month', value: b.choose }) : undefined;
  return (
    <li class={`home-item${first ? ' is-first' : ''}${it.soon ? ' is-soon' : ''}`} data-todo={it.id} data-pid={it.pid} data-plan={partner ? partner.planId : undefined}>
      <span class="home-dot" aria-hidden="true" />
      <span class="home-item-text">
        <strong>{partner ? fill(HOME.partnerItem, { title: w.title, name: partner.name }) : w.title}</strong>
        {w.detail && <span class="home-item-detail">{w.detail}</span>}
      </span>
      <span class="home-item-acts">
        {b && b.href && <LinkButton testid={`${T}.todo.${it.id}${partner ? '.' + partner.planId : ''}`} kind={first ? 'pop' : 'quiet'} href={b.href} onClick={onPress}>{label}</LinkButton>}
        {it.dismiss && !partner && <Button testid={`${T}.notNow.${it.id}`} kind="quiet" onClick={(e) => notNowPress(e, () => dispatch({ type: 'todo/notNow', key: planId + '|' + it.id }))}>{HOME.notNow}</Button>}
      </span>
    </li>
  );
}

function Strip({ strip }) {
  return (
    <div class="stage-strip" data-testid={`${T}.strip`}>
      <p class="sr-only">{HOME.strip.label}</p>
      <div class="strip-segs" aria-hidden="true">
        {strip.map((sg) => <span key={sg.key} class={`strip-seg is-${sg.key} is-${sg.state}`}>{sg.state === 'now' && <span class="strip-dot" />}</span>)}
      </div>
      <ul class="strip-words">
        {strip.map((sg) => (
          <li key={sg.key} data-stage={sg.key} data-state={sg.state} aria-current={sg.state === 'now' ? 'step' : undefined}>
            <strong>{HOME.stages[sg.key]}</strong>{' · '}
            {sg.state === 'now' ? HOME.strip.now : sg.key === 'saving' && sg.month ? fill(HOME.strip.to, { month: sg.month }) : sg.state === 'done' ? HOME.strip.done : HOME.strip.later}
          </li>
        ))}
      </ul>
    </div>
  );
}

function YearView({ Y }) {
  const W = HOME.year;
  return (
    <section class="home-year" data-region="home-year" data-testid={`${T}.year`} data-year={Y.key}>
      <h2 class="eyebrow">{fill(HOME.yearTitle, { year: Y.year })}</h2>
      <ol class="year-cells" aria-label={fill(W.label, { year: Y.year })}>
        {Y.cells.map((c, i) => (
          <li key={c.month} class={`year-cell is-${c.state}`} data-month={c.month} data-state={c.state}>
            <span class="year-plot" aria-hidden="true">
              {c.drawnPct != null && <span class="year-bar" style={`height:${c.drawnPct}%;animation-delay:${i * 45}ms`} />}
              {c.planPct != null && <span class="year-plan" style={`bottom:${c.planPct}%`} />}
            </span>
            <span class="year-name" aria-hidden="true">{c.name.slice(0, 3)}</span>
            <span class="sr-only">
              {c.drawn != null ? <>{fill(W.cell[c.state].split('{drawn}')[0], { month: c.words })}<Money source={c} k="drawn" />{W.cell[c.state].split('{drawn}')[1] || ''}</> : fill(W.cell[c.state], { month: c.words })}
              {c.plan != null && (c.state === 'recorded' || c.state === 'filled') && <>{W.planSaid.split('{plan}')[0]}<Money source={c} k="plan" /></>}
            </span>
          </li>
        ))}
      </ol>
      <ul class="year-legend" aria-hidden="true">
        <li><i class="key-drawn" />{W.legendDrawn}</li>
        <li><i class="key-plan" />{W.legendPlan}</li>
        <li><i class="key-filled" />{W.legendFilled}</li>
        <li><i class="key-setup" />{W.legendSetUp}</li>
        <li><i class="key-due" />{W.legendDue}</li>
      </ul>
      <p class="note" data-testid={`${T}.year.count`}>{Y.recorded === 0 ? fill(W.recordedCount.none, { year: Y.year }) : Y.recorded === 1 ? fill(W.recordedCount.one, { year: Y.year }) : fill(W.recordedCount.many, { n: String(Y.recorded), year: Y.year })}</p>
    </section>
  );
}

function headlineOf(H) {
  const s = H.stage;
  const W = HOME.headline;
  if (s.key === 'saving') return s.stop ? fill(W.savingStop, { month: s.stop }) : W.saving;
  if (s.key === 'moving') return s.moves && s.moves.of > 0 ? fill(W.movingMoves, { done: String(s.moves.done), of: String(s.moves.of) }) : W.moving;
  if (s.key === 'drawing') return H.locked ? W.drawing : W.draft;
  if (s.key === 'closed') return W.closed;
  return W.none;
}

/** A question with the plan's figures (the rail's links, moved here): B with a saver's own boxes filled, the others plain. */
function Ask({ H, view, dispatch }) {
  return (
    <ul class="home-links">
      {H.ask.map((q) => {
        const fillOf = view.askFill && view.askFill[q];
        const onAsk = fillOf ? (e) => { e.preventDefault(); dispatch({ type: 'draft/load', q, values: fillOf.values, ...(fillOf.mixes ? { mixes: fillOf.mixes } : {}), ...(fillOf.flexibleAccess ? { flexibleAccess: fillOf.flexibleAccess } : {}), ...(q === 'b' && view.id ? { planId: String(view.id) } : {}) }); } : undefined;
        return <li key={q}><a href={href.step(q, 'numbers')} data-testid={`${T}.ask.${q}`} data-filled={fillOf ? 'plan' : undefined} onClick={onAsk}>{PLAN.page.ask[q]}</a></li>;
      })}
    </ul>
  );
}

export function HomeScreen(state, dispatch) {
  const view = planView(state);
  const H = view.found ? view.home : null;
  if (!H || !H.found) {
    const list = plansView(state);
    return {
      question: null, rail: false, full: false,
      content: (
        <>
          <h1 tabIndex={-1}>{HOME.title}</h1>
          <p class="lead" role="status" data-testid="plan.opening">{PLAN.list.opening}</p>
          {list.status === 'failed' && <p><a href={href.plans()}>{PLAN.list.toPlans}</a></p>}
        </>
      )
    };
  }
  const planId = H.id;
  const s = H.stage;
  const todo = H.todo;
  const stepName = (id) => (id === 'plan' && H.locked ? PLAN.steps.plan.locked : PLAN.steps[id].label);
  const steps = H.steps.filter((x) => !x.later);
  const later = H.steps.filter((x) => x.later);
  return {
    question: null, rail: false, full: false,
    content: (
      <div class={`home is-${s.key || 'none'}`} data-region="plan-home" data-testid={T} data-stage={s.key || 'none'} data-locked={H.locked ? '1' : '0'}>
        <div class="plan-head home-head">
          <p class="plan-kicker" data-testid={`${T}.kicker`}>
            {PLAN.page.title} <span class="plan-name">{H.example ? PLAN.list.actions.exampleRow : <>‘{H.name}’</>}</span>
          </p>
          <h1 tabIndex={-1} data-testid={`${T}.headline`}>
            {s.key && <span class={`stage-word is-${s.key}`}><span class="stage-dot" aria-hidden="true" /></span>}{headlineOf(H)}
          </h1>
          {/* the plan's line, as every page of the plan says it: the stage in words, when it was locked */}
          <p class="plan-stage-line" data-testid="plan.stageLine">{H.line ? fill(PLAN.stageLines[H.line.id], H.line.slots) : ''}{H.lockedOn ? ' ' + fill(PLAN.page.lockedOn, { date: H.lockedOn }) : ''}</p>
          {H.readonly && <p class="notice" role="status" data-testid="plan.readonly">{HOME.readonly}</p>}
          {H.closed && <p class="notice" role="status" data-testid="plan.closed">{H.closed.hasDocument ? PLAN.page.closedKeeps : PLAN.page.closedKeepsNoDocument}{H.closed.next && <> <LinkButton testid="plan.closed.open" kind="quiet" href={href.plan(H.closed.next.id)}>{fill(PLAN.buttons.openNext, { name: H.closed.next.name })}</LinkButton></>}</p>}
          {H.before && <p class="note" data-testid="plan.before">{H.before.previous ? fill(PLAN.page.before, { name: H.before.previous.name, month: H.before.until }) : fill(PLAN.page.beforeAlone, { month: H.before.until })}{H.before.previous && <> <LinkButton testid="plan.before.open" kind="quiet" href={href.plan(H.before.previous.id)}>{fill(PLAN.buttons.openPrevious, { name: H.before.previous.name })}</LinkButton></>}</p>}
          {H.source === 'window' && <p class="note" data-testid="plan.windowWarning">{PLAN.page.windowWarning}</p>}
        </div>

        {s.strip && <Strip strip={s.strip} />}

        <section class="home-todo" data-region="home-todo" data-testid={`${T}.todo`} data-count={String(todo.count)}>
          <h2 class="eyebrow">{HOME.todoTitle}</h2>
          {todo.items.length > 0 ? (
            <ul class="home-items">{todo.items.map((it, i) => <Item key={it.id} it={it} first={i === 0} planId={planId} dispatch={dispatch} />)}</ul>
          ) : !H.readonly && H.quiet ? <p class="home-quiet" data-testid={`${T}.quiet`} data-quiet={H.quiet.id}>{fill(HOME.quiet[H.quiet.id], H.quiet.slots)}</p> : null}
          {todo.more.length > 0 && (
            <details class="plan-fold home-more" data-testid={`${T}.more`}>
              <summary>{todo.more.length === 1 ? HOME.more.one : fill(HOME.more.many, { n: String(todo.more.length) })}</summary>
              <ul class="home-items">{todo.more.map((it) => <Item key={it.id} it={it} first={false} planId={planId} dispatch={dispatch} />)}</ul>
            </details>
          )}
          {todo.partner.length > 0 && (
            <ul class="home-items home-partner" data-testid={`${T}.partner`}>{todo.partner.map((it) => <Item key={it.planId + it.id} it={it} first={false} planId={planId} dispatch={dispatch} partner={{ planId: it.planId, name: it.name }} />)}</ul>
          )}
          {todo.soon.length > 0 && (
            <div class="home-soon" data-testid={`${T}.soon`}>
              <p class="eyebrow">{HOME.soonTitle}</p>
              <ul class="home-items">{todo.soon.map((it) => <Item key={it.id} it={it} first={false} planId={planId} dispatch={dispatch} />)}</ul>
            </div>
          )}
        </section>

        <div class="home-row2">
          {H.year && <YearView Y={H.year} />}
          <Counted as="section" class="home-where" data-region="home-where" data-testid={`${T}.where`}>
            <h2 class="eyebrow">{HOME.whereTitle}</h2>
            {H.where.length === 0 ? <p class="note">{HOME.whereNone}</p> : H.where.map((b) => (
              <div class="home-where-block" key={b.step} data-step={b.step}>
                <p class="line"><PlanSentence s={b.result} figures={b.figures} /></p>
                {b.lines.length > 0 && <ul class="plan-lines">{b.lines.map((l, i) => <PlanLine key={i} line={l} figures={b.figures} />)}</ul>}
              </div>
            ))}
          </Counted>
        </div>

        {H.tools.length > 0 && (
          <section class="home-tools-section" data-testid={`${T}.tools`}>
            <h2 class="eyebrow">{HOME.toolsTitle}</h2>
            <ul class="home-tools">
              {H.tools.map((t) => (
                <li key={t.id}><a class="home-tool" href={t.href} data-testid={`${T}.tool.${t.id}`}>
                  <span class="home-tool-name">{stepName(t.id)}</span>
                  {t.result && <span class="home-tool-state"> · <PlanSentence s={t.result} figures={t.figures} /></span>}
                </a></li>
              ))}
            </ul>
          </section>
        )}

        <details class="plan-fold" data-testid={`${T}.steps`}>
          <summary>{HOME.stepsTitle}</summary>
          <p class="note">{HOME.stepsLead}</p>
          <ul class="home-steps">
            {steps.map((x) => <li key={x.id} data-step={x.id}><a href={x.href} data-testid={`${T}.step.${x.id}`}>{stepName(x.id)}</a>{x.result && <> — <PlanSentence s={x.result} figures={x.figures} /></>}</li>)}
          </ul>
          {later.length > 0 && (
            <>
              <p class="rail-later-title" data-testid={`${T}.later`}>{PLAN.page.laterTitle}</p>
              <ul class="home-steps">{later.map((x) => <li key={x.id} data-step={x.id}><a href={x.href} data-testid={`${T}.step.${x.id}`}>{stepName(x.id)}</a></li>)}</ul>
            </>
          )}
        </details>

        {H.change.length > 0 && (
          <details class="plan-fold" data-testid={`${T}.change`}>
            <summary>{H.locked ? HOME.changeTitle : HOME.changeTitleUnlocked}</summary>
            {H.locked && <p class="note">{HOME.changeLockedLead}</p>}
            <ul class="home-links">{H.change.map((c) => <li key={c.id}><a href={c.href} data-testid={`${T}.change.${c.id}`}>{HOME.change[c.id]}</a></li>)}</ul>
          </details>
        )}

        {H.ask.length > 0 && !H.readonly && (
          <details class="plan-fold" data-testid={`${T}.ask`}>
            <summary>{HOME.askTitle}</summary>
            <p class="note">{HOME.askLead}</p>
            <Ask H={H} view={view} dispatch={dispatch} />
          </details>
        )}

        <div class="actions-row">
          <LinkButton testid="plan.toPlans" kind="quiet" href={href.plans()}>{PLAN.list.toPlans}</LinkButton>
        </div>
      </div>
    )
  };
}
