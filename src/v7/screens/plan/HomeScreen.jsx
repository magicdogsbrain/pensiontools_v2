/**
 * A plan's home (7.3.0; research/v7/one-product-design.md, "The plan home"; the mock-up research/v7/mockups/first-visit.html,
 * screen 4), on #/plan/<id> for every plan, locked or not: the plan's line and its stage, the move window and the next
 * review, at most one thing due (7.10.0: the plan's own and a partner's in one list, the rest "and N more"), the year's
 * months against the plan and where you are side by side on a wide screen, the
 * tools with their one-line states, then everything else folded away — the steps, changing or trying something, and a
 * question with the plan's figures. The rail is not drawn here: the home is the rail laid out.
 *
 * Draws only: the reading is answers/plan/home.js homeOf (state/select.js planView → page.home), the same reading the
 * rail's "Next" comes from. Nothing here writes a plan: "Not now" and the other ways to put a to-do away ask the plan write
 * (plan/task) to store it on the plan, so it stays away on every device (7.10.0).
 */
import { PlanLine, PlanSentence, fill, Button, LinkButton, Counted, notNowPress, stepNameOf, LifeLine, YearCells } from '../../components/index.js';
import { planView, plansView, lifeStages, planKeepTestView } from '../../state/select.js';
import { KeepTestLine } from './KeepTest.jsx';
import { href } from '../../router/routes.js';
import { PLAN } from '../../copy/plan.js';
import { HOME } from '../../copy/home.js';
import { GAPS } from '../../copy/gaps.js';

const T = 'plan.home';

/** A to-do's title and line, filled from its slots. */
const itemWords = (it) => {
  const words = (it.soon ? HOME.soon[it.id] : null) || HOME.items[it.id] || { title: PLAN.next[it.pid] || it.id, detail: '' };
  // off course by the guardrails rule, or from readings that keep no figure, is said in its own words
  const detail = it.id === 'review.offCourse' && it.slots && it.slots.offKind === 'guardrails' ? HOME.offCourse.guardrails
    : it.id === 'review.offCourse' && it.slots && (it.slots.a === '' || it.slots.b === '') ? HOME.offCourse.plain : words.detail;
  return { title: fill(words.title, it.slots), detail: fill(detail, it.slots) };
};

function Item({ it, first, planId, dispatch }) {
  // a partner's to-do (7.10.0: in the one list, after the plan's own): named by its plan, never put away here
  const partner = it.planId ? { planId: it.planId, name: it.name } : null;
  const w = itemWords(it);
  const b = it.button;
  // a month missed in an earlier tax year is named with its year on the home, the button as the title ("Record February 2025")
  const label = b ? fill(PLAN.buttons[b.id] || b.id, it.id === 'month.gap' && it.slots.month ? { ...b.slots, month: it.slots.month } : b.slots) : null;
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
        {it.dismiss && !partner && it.dismiss.map((how) => <Button key={how} testid={`${T}.${how}.${it.id}`} kind="quiet" onClick={(e) => notNowPress(e, () => dispatch({ type: 'plan/task', planId, key: it.key, how }))}>{HOME.dismiss[how]}</Button>)}
      </span>
    </li>
  );
}

/**
 * What is held differently from the plan's mix, on a plan living on its money (7.10.0): one information line under "Where you
 * are" — never a to-do, never a sale — with the way to test it on a line of its own (on a phone every link is a full-height
 * target).
 */
function Drift({ D }) {
  const W = HOME.drift;
  const text = D.kind === 'ladder' ? fill(W.ladder, { year: D.year }) : fill(W[D.bucket], { held: String(D.held), mix: String(D.plan) });
  return (
    <div class="home-held" data-testid={`${T}.drift`} data-kind={D.kind} {...(D.kind === 'buckets' ? { 'data-bucket': D.bucket } : {})}>
      <p class="note">{text}</p>
      <p class="home-where-more"><a href={D.href} data-testid={`${T}.drift.test`}>{D.kind === 'ladder' ? W.ladderLink : W.link}</a></p>
    </div>
  );
}

function headlineOf(H) {
  const s = H.stage;
  const W = HOME.headline;
  if (s.key === 'saving') return s.stop ? fill(W.savingStop, { month: s.stop }) : W.saving;
  if (s.key === 'moving') return W.moving;
  if (s.key === 'drawing') return H.locked ? W.drawing : W.draft;
  if (s.key === 'closed') return W.closed;
  return W.none;
}

/** The questions a home offers that really open with this plan's figures (a saver's B): the fold's words promise no more. */
const filledAsk = (H, view) => H.ask.filter((q) => !!(view.askFill && view.askFill[q]));

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
  // the move step by the mix it keeps to on a Drawing plan (7.3.1), in the tools and the steps alike, as the rail names it
  const stepName = (id) => stepNameOf(id, view);
  const steps = H.steps.filter((x) => !x.later);
  const later = H.steps.filter((x) => x.later);
  const filled = filledAsk(H, view);
  // the closed plan's way on is its to-do when it is listed: the notice then says what happened, without a second button
  const closedListed = todo.items.some((it) => it.id === 'closed.next');
  // a to-do put away on this plan (7.10.0): gone from the list while its write is under way, and "Not now" said once, with how
  // long it lasts, until the toast closes
  const ui = state.ui || {};
  const pending = ui.saving && ui.saving.kind === 'task' && ui.saving.planId === String(planId) ? ui.saving.key : null;
  const told = ui.toast && ui.toast.op === 'task' && ui.toast.planId === String(planId) && ui.toast.line ? ui.toast.line : null;
  const away = (it) => it.key && (it.key === pending || (told && it.key === told.key));
  // still one shown: the next in the list takes the place of the one put away
  const left = [...todo.items, ...todo.more].filter((it) => !away(it));
  const items = left.slice(0, todo.items.length);
  const more = left.slice(todo.items.length);
  const putOff = !H.readonly && told && told.id === 'putOff' ? fill(HOME.putOff, told.slots) : null;
  // the next review, said once: by the nothing-due line when it is shown, else here
  const quietShown = items.length === 0 && !H.readonly && !!H.quiet;
  const quietSaysIt = quietShown && (H.quiet.id === 'review' || H.quiet.id === 'reviewAny');
  const reviewLine = H.review && !quietSaysIt ? (H.review.next ? fill(HOME.review.next, { month: H.review.next }) : HOME.review.any) : null;
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
          {/* the move window (7.10.0): how long is left to the stop, or when it opens — said, never a to-do */}
          {H.moveWindow && <p class="line" data-testid={`${T}.moveWindow`} data-line={H.moveWindow.id}>{fill(HOME.moveWindow[H.moveWindow.id], H.moveWindow.slots)}</p>}
          {H.readonly && <p class="notice" role="status" data-testid="plan.readonly">{HOME.readonly}</p>}
          {H.closed && <p class="notice" role="status" data-testid="plan.closed">{H.closed.hasDocument ? PLAN.page.closedKeeps : PLAN.page.closedKeepsNoDocument}{H.closed.next && !closedListed && <> <LinkButton testid="plan.closed.open" kind="quiet" href={href.plan(H.closed.next.id)}>{fill(PLAN.buttons.openNext, { name: H.closed.next.name })}</LinkButton></>}</p>}
          {H.before && <p class="note" data-testid="plan.before">{H.before.previous ? fill(PLAN.page.before, { name: H.before.previous.name, month: H.before.until }) : fill(PLAN.page.beforeAlone, { month: H.before.until })}{H.before.previous && <> <LinkButton testid="plan.before.open" kind="quiet" href={href.plan(H.before.previous.id)}>{fill(PLAN.buttons.openPrevious, { name: H.before.previous.name })}</LinkButton></>}</p>}
          {H.source === 'window' && <p class="note" data-testid="plan.windowWarning">{PLAN.page.windowWarning}</p>}
        </div>

        {/* the life line reduced to the plan's three stages, the dot on the one it is in (7.5.0: one component with the front door's) */}
        {s.strip && <LifeLine stages={lifeStages(s.strip)} words={{ ...HOME.strip, stages: HOME.stages }} testid={`${T}.strip`} />}

        <section class="home-todo" data-region="home-todo" data-testid={`${T}.todo`} data-count={String(todo.count)}>
          <h2 class="eyebrow">{HOME.todoTitle}</h2>
          {items.length > 0 ? (
            <ul class="home-items">{items.map((it, i) => <Item key={(it.planId || '') + it.id} it={it} first={i === 0} planId={planId} dispatch={dispatch} />)}</ul>
          ) : !H.readonly && H.quiet ? <p class="home-quiet" data-testid={`${T}.quiet`} data-quiet={H.quiet.id}>{fill(HOME.quiet[H.quiet.id], H.quiet.slots)}</p> : null}
          {more.length > 0 && (
            <details class="plan-fold home-more" data-testid={`${T}.more`}>
              <summary>{more.length === 1 ? HOME.more.one : fill(HOME.more.many, { n: String(more.length) })}</summary>
              <ul class="home-items">{more.map((it) => <Item key={(it.planId || '') + it.id} it={it} first={false} planId={planId} dispatch={dispatch} />)}</ul>
            </details>
          )}
          {putOff && <p class="note" role="status" data-testid={`${T}.notNowDone`}>{putOff}</p>}
          {/* the next review (7.10.0), when the line above does not say its date already, with the way to it; "Review now" is
              always offered (a pay change, a new job: spec-7100 §4.3), so with the date said above it stands on its own */}
          {reviewLine && <p class="line" data-testid={`${T}.review`}>{reviewLine} <a href={H.review.href} data-testid={`${T}.review.now`}>{HOME.review.link}</a></p>}
          {!reviewLine && quietSaysIt && H.review && H.review.href && <p class="line home-review-now"><a href={H.review.href} data-testid={`${T}.review.now`}>{HOME.review.link}</a></p>}
          {todo.soon.length > 0 && (
            <div class="home-soon" data-testid={`${T}.soon`}>
              <p class="eyebrow">{HOME.soonTitle}</p>
              <ul class="home-items">{todo.soon.map((it) => <Item key={it.id} it={it} first={false} planId={planId} dispatch={dispatch} />)}</ul>
            </div>
          )}
        </section>

        <div class={`home-row2${H.year ? '' : ' is-one'}`}>
          {H.year && <YearCells Y={H.year} words={HOME.year} title={HOME.yearTitle} testid={`${T}.year`} />}
          <Counted as="section" class="home-where" data-region="home-where" data-testid={`${T}.where`}>
            <h2 class="eyebrow">{HOME.whereTitle}</h2>
            {/* the headline only: the result and a few lines; where each figure is from, and the rest, on the step itself */}
            {H.where.length === 0 ? <p class="note">{HOME.whereNone}</p> : H.where.map((b) => (
              <div class="home-where-block" key={b.step} data-step={b.step}>
                {b.result && <p class="line"><PlanSentence s={b.result} figures={b.figures} /></p>}
                {b.lines.length > 0 && <ul class="plan-lines">{b.lines.map((l, i) => <PlanLine key={i} line={l} figures={b.figures} hideSource />)}</ul>}
              </div>
            ))}
            {H.drift && <Drift D={H.drift} />}
            {/* 7.6.0: a year not yet covered by what the person holds and keeps: the first such year, said once, with the way to see it */}
            {H.gap && <p class="line" data-testid={`${T}.gap`} data-year={H.gap.Y}><a href={H.gap.href}>{fill(GAPS.home, H.gap)}</a></p>}
            {/* 7.7.0: what the person chose to keep, tested against the plan and agreed — or not yet */}
            <KeepTestLine K={planKeepTestView(state)} prefix={T} />
            {/* the plan draws from a pension before it can usually be taken (7.4.0): a plain fact beside the plan's draws */}
            {/* the plan starts before its pension can be taken: what it does until then, or (7.4.1) the warning when the other savings run short */}
            {H.pensionAccess && H.pensionAccess.short && <p class="notice" role="status" data-testid={`${T}.pensionShort`}>{fill(HOME.pensionShort, { age: H.pensionAccess.age, ...H.pensionAccess.short })}</p>}
            {H.pensionAccess && !H.pensionAccess.short && <p class="note" data-testid={`${T}.pensionAccess`}>{fill(HOME.pensionAccess, H.pensionAccess)}</p>}
            {H.whereFull && <p class="home-where-more"><a href={H.whereFull} data-testid={`${T}.whereFull`}>{HOME.whereMore}</a></p>}
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
            <summary>{filled.length ? HOME.askTitle : HOME.askTitlePlain}</summary>
            <p class="note" data-testid={`${T}.askLead`}>{filled.length ? fill(HOME.askLead, { question: PLAN.page.ask[filled[0]] }) : HOME.askLeadPlain}</p>
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
