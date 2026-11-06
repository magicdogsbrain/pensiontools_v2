/**
 * "Your plans" (research/v7/your-plan.md 1.1, 1.2; road-to-7.md step 11): the account's plans — or this window's, when
 * nobody is signed in — in groups, each by its own name with one stage line, "Open", and the plan menu on the row: Rename
 * (a box), Make a copy (a question: as it is, or with the records), Make this my main plan, Download this plan, Delete (a
 * confirm that names the plan; a second one for a locked plan; never undone), and on a plan someone has lived on Move to a
 * new plan (6.56.0: a box that says what happens and asks the month, the name, the pots (filled in from what is known), and
 * whether the partner's link moves; services/PlanClose.js) and, beside it, "I'm going back to work" (the same close: a saving plan carries
 * it on, and the box asks too when work is expected to stop again). Closed plans sit under "Previous plans". Under the list: "Start a new plan" (the
 * front door: every plan begins from a question), "Open a downloaded copy" (a file box), and for a visitor "Look around an
 * example", and with more than one plan "Delete several" (6.59.0: ticks on the rows, one confirm that names each plan and the
 * count, each deleted as one is, a plan refused named with why). The other states: checking, nobody signed in, email not
 * confirmed, could not read, used up. Draws only: the
 * rows are state/select.js plansView's, the menu's state plansMenuView's; every write is the one write file's.
 */
import { Button, LinkButton, UndoToast, fill } from '../../components/index.js';
import { usedWords } from '../../components/Visitor.jsx';
import { plansView, plansMenuView } from '../../state/select.js';
import { href } from '../../router/routes.js';
import { PLAN } from '../../copy/plan.js';
import { HOME } from '../../copy/home.js';
import { COMMON } from '../../copy/common.js';
import { GUEST } from '../../copy/guest.js';

/** The planner's sign-in screen, in this window (its own `?signin=1` door); the hand-over leaves the way back. */
export const SIGN_IN_PLACE = 'signin';
const keepFocus = { onMouseDown: (e) => e.preventDefault() };
const T = 'plans';

/** What the toast says after an action (no Undo). */
const doneText = (toast) => {
  const w = PLAN.list.actions.done;
  return toast && toast.op && w[toast.op] ? fill(w[toast.op], toast.slots || {}) : '';
};
/** Why an action did nothing, in words. */
const problemText = (p) => {
  const w = PLAN.list.actions.problems;
  if (!p) return '';
  const text = w[p.problem] || w.failed;
  return fill(text, { problem: p.detail || '', name: p.detail || '' });
};

/** A plan as "Delete several" names it: ‘its name’, or the example plan by what it is (its stored name is not in our words). */
const said = (t) => (t.example ? PLAN.list.actions.severalExample : '‘' + t.name + '’');
/** ‘A’, ‘B’ and ‘C’: plans said as a list. */
const listOf = (plans) => {
  const q = plans.map(said);
  return q.length > 1 ? q.slice(0, -1).join(', ') + ' and ' + q[q.length - 1] : q.join('');
};
const byCount = (w, n) => fill(n === 1 ? w.one : w.many, { n: String(n) });
const capital = (t) => t.charAt(0).toUpperCase() + t.slice(1);

/**
 * "Delete several" (6.59.0): the bar above the list while the ticks are out — how many are ticked, the press that asks, and
 * the ticks put away; then the ONE confirm that names each plan and the count; then the deletes under way; then what was
 * deleted and each plan refused with why. Every write is the one write file's.
 */
function Several({ S, dispatch }) {
  const W = PLAN.list.actions;
  if (S.working) return <p class="note plan-working" role="status" data-testid="plans.severalWorking">{W.severalWorking}</p>;
  if (S.confirm && S.step === 2) {
    // a locked plan among those going: asked again, by name, as deleting one locked plan asks again
    const L = S.locked;
    const ask = L.length === 1 ? fill(W.severalLockedAsk.one, { name: said(L[0]), lockedOn: L[0].lockedOn || '' }) : fill(W.severalLockedAsk.many, { names: listOf(L) });
    return (
      <div class="notice plan-menu-box plan-delete" role="region" aria-label={W.several} data-testid="plans.severalBox" data-step="2" data-count={String(S.going.length)}>
        <p>{ask}</p>
        <div class="actions-row">
          <Button testid="plans.severalYes" kind="primary" onClick={() => dispatch({ type: 'plans/deleteSeveral' })} {...keepFocus}>{L.length === 1 ? W.severalLockedYes.one : W.severalLockedYes.many}</Button>
          <Button testid="plans.severalNotNow" kind="quiet" onClick={() => dispatch({ type: 'plans/severalAsk', ask: false })} {...keepFocus}>{W.notNow}</Button>
        </div>
      </div>
    );
  }
  if (S.confirm) {
    // only the plans that can go are counted and named; with every plan ticked, the one that stays is said first
    const n = S.going.length;
    const yes = S.locked.length ? () => dispatch({ type: 'plans/severalAsk', ask: true, step: 2 }) : () => dispatch({ type: 'plans/deleteSeveral' });
    return (
      <div class="notice plan-menu-box plan-delete" role="region" aria-label={W.several} data-testid="plans.severalBox" data-step="1" data-count={String(n)}>
        {n > 0 && <p>{byCount(W.severalAsk, n)}</p>}
        {n > 0 && (
          <ul class="plan-several-list">
            {S.going.map((t) => <li key={t.id} data-plan-id={t.id}>{said(t)}{t.locked ? ' ' + fill(W.severalLocked, { lockedOn: t.lockedOn || '' }) : ''}</li>)}
          </ul>
        )}
        {S.stays && <p data-testid="plans.severalStays" data-plan-id={S.stays.id}>{fill(W.severalStays, { name: said(S.stays) })}</p>}
        <div class="actions-row">
          {n > 0 && <Button testid="plans.severalYes" kind="primary" onClick={yes} {...keepFocus}>{byCount(W.severalYes, n)}</Button>}
          <Button testid="plans.severalNotNow" kind="quiet" onClick={() => dispatch({ type: 'plans/severalAsk', ask: false })} {...keepFocus}>{W.notNow}</Button>
        </div>
      </div>
    );
  }
  const n = S.ticked.length;
  return (
    <div class="notice plan-several" role="region" aria-label={W.several} data-testid="plans.severalBar">
      <p>{W.severalHelp}</p>
      <p class="note" role="status" data-testid="plans.severalCount">{n === 0 ? W.severalCount.none : byCount(W.severalCount, n)}</p>
      <div class="actions-row">
        <Button testid="plans.severalGo" kind="primary" disabled={n === 0} onClick={() => dispatch({ type: 'plans/severalAsk', ask: true })} {...keepFocus}>{W.severalGo}</Button>
        <Button testid="plans.severalClose" kind="quiet" onClick={() => dispatch({ type: 'plans/several', on: false })} {...keepFocus}>{W.severalClose}</Button>
      </div>
    </div>
  );
}

/** What the last "Delete several" did: the names deleted, and each plan refused with why. */
function SeveralDone({ done, dispatch }) {
  const W = PLAN.list.actions;
  return (
    <div class="notice saved" role="status" data-testid="plans.severalDone">
      <p data-testid="plans.severalDeleted">{done.deleted.length ? fill(W.severalDeleted, { names: listOf(done.deleted) }) : W.severalNone}</p>
      {done.refused.map((r) => <p key={r.id} data-testid={`plans.severalRefused.${r.id}`} data-problem={r.problem}>{fill(W.severalRefused, { name: capital(said(r)), why: problemText({ problem: r.problem, detail: null }) })}</p>)}
      <div class="actions-row"><Button testid="plans.severalDoneClose" kind="quiet" onClick={() => dispatch({ type: 'plans/several', on: false })} {...keepFocus}>{W.severalDoneClose}</Button></div>
    </div>
  );
}

/** One row's menu: the box or confirm open on it, or its buttons. */
function Menu({ r, M, dispatch }) {
  const a = M.action && M.action.planId === r.id ? M.action : null;
  const busy = M.saving && M.saving.planId === r.id;
  const W = PLAN.list.actions;
  const act = (kind, extra = {}) => dispatch({ type: 'plan/action', planId: r.id, kind, ...extra });
  const close = () => dispatch({ type: 'plan/action', planId: r.id, kind: null });
  if (busy) return <p class="note plan-working" role="status" data-testid={`${T}.working.${r.id}`}>{W.working}</p>;
  if (a && a.kind === 'rename') {
    const id = `${T}.rename.name`;
    return (
      <form class="plan-menu-box" noValidate data-testid={`${T}.renameBox.${r.id}`} onSubmit={(e) => { e.preventDefault(); dispatch({ type: 'plan/rename', planId: r.id, name: a.text }); }}>
        <div class="field field-text" data-field="rename">
          <label for={id}>{W.renameLabel}</label>
          <div class="box"><input type="text" id={id} data-testid={id} name={id} autocomplete="off" inputmode="text" value={a.text} data-shell-box="rename" onInput={(e) => dispatch({ type: 'plan/actionText', value: e.currentTarget.value })} /></div>
        </div>
        <div class="actions-row">
          <Button testid={`${T}.rename.save`} kind="primary" type="submit">{W.renameSave}</Button>
          <Button testid={`${T}.rename.notNow`} kind="quiet" onClick={close} {...keepFocus}>{W.notNow}</Button>
        </div>
      </form>
    );
  }
  if (a && a.kind === 'copy') {
    return (
      <div class="notice plan-menu-box" role="region" aria-label={W.copy} data-testid={`${T}.copyBox.${r.id}`}>
        <p>{fill(r.records ? W.copyAsk : W.copyAskPlain, { name: r.name })}</p>
        <div class="actions-row">
          {r.records
            ? <>
              <Button testid={`${T}.copy.plain`} kind="primary" onClick={() => dispatch({ type: 'plan/copy', planId: r.id, carry: false })} {...keepFocus}>{W.copyPlain}</Button>
              <Button testid={`${T}.copy.records`} onClick={() => dispatch({ type: 'plan/copy', planId: r.id, carry: true })} {...keepFocus}>{W.copyWithRecords}</Button>
            </>
            : <Button testid={`${T}.copy.plain`} kind="primary" onClick={() => dispatch({ type: 'plan/copy', planId: r.id, carry: false })} {...keepFocus}>{W.copyYes}</Button>}
          <Button testid={`${T}.copy.notNow`} kind="quiet" onClick={close} {...keepFocus}>{W.notNow}</Button>
        </div>
      </div>
    );
  }
  if (a && a.kind === 'close' && r.close && (a.reason !== 'working' || r.close.working)) {
    const c = r.close;
    const working = a.reason === 'working';
    const id = (k) => `${T}.close.${k}`;
    // the boxes are read when the form is sent (one write, after the press), so nothing here is typed into state
    const send = (e) => {
      e.preventDefault();
      const f = e.currentTarget.elements;
      const val = (k) => (f[id(k)] ? f[id(k)].value : null);
      dispatch({ type: 'plan/close', planId: r.id, month: val('month'), name: val('name') || '', pots: { pension: val('pension'), isa: val('isa'), gia: val('gia') }, partner: !!(f[id('partner')] && f[id('partner')].checked),
        ...(working ? { reason: 'working', stop: { month: val('stopMonth') || '', age: val('stopAge') || '' } } : {}) });
    };
    const box = (k, label, value) => (
      <div class="field field-money" data-field={`close.${k}`}>
        <label for={id(k)}>{label}</label>
        <div class="box"><span class="unit">£</span><input type="text" id={id(k)} data-testid={id(k)} name={id(k)} inputmode="numeric" autocomplete="off" defaultValue={String(value)} data-shell-box={`close.${k}`} /></div>
      </div>
    );
    // the default name says the month: while the box still holds a month's default name, it follows the month chosen
    const followName = (e) => {
      const f = e.currentTarget.form;
      const box = f && f.elements[id('name')];
      const key = working ? 'workingName' : 'name';
      const to = c.months.find((m) => m.month === e.currentTarget.value);
      if (box && to && c.months.some((m) => m[key] === box.value)) box.value = to[key];
    };
    const text = (k, label, hint) => (
      <div class="field field-text" data-field={`close.${k}`}>
        <label for={id(k)}>{label}</label>
        <div class="box"><input type="text" id={id(k)} data-testid={id(k)} name={id(k)} inputmode={hint} autocomplete="off" data-shell-box={`close.${k}`} /></div>
      </div>
    );
    return (
      <form class="notice plan-menu-box plan-close" noValidate aria-label={working ? W.closeWorking : W.close} data-testid={`${T}.closeBox.${r.id}`} data-reason={working ? 'working' : 'plan'} onSubmit={send}>
        <p>{fill(working ? W.closeWorkingIntro : W.closeIntro, { name: r.name })}</p>
        <div class="field field-select" data-field="close.month">
          <label for={id('month')}>{working ? W.closeWorkingMonth : W.closeMonth}</label>
          <div class="box"><select id={id('month')} data-testid={id('month')} name={id('month')} data-shell-box="close.month" onChange={followName}>
            {c.months.map((m) => <option key={m.month} value={m.month} selected={m.month === c.suggested}>{working ? m.words : fill(W.closeMonthOption, { month: m.words, year: m.year })}</option>)}
          </select></div>
        </div>
        <p>{fill(W.closeKeeps, { name: r.name })}</p>
        <p>{working ? W.closeWorkingNew : W.closeNew}</p>
        {/* back to work: when work is expected to stop again (a month, or an age), and the limit the new plan carries */}
        {working && <p>{W.closeStopAsk}</p>}
        {working && text('stopMonth', W.closeStopMonth, 'text')}
        {working && text('stopAge', W.closeStopAge, 'numeric')}
        {working && c.working.flexibleAccess && <p data-testid={id('flexible')}>{fill(W.closeFlexible, { month: c.working.flexibleAccess.month })}</p>}
        {/* the pots, always asked: boxes filled in from what is known, each said where it came from (PlanClose.closePotsOf) */}
        <p data-testid={id('from')}>{fill(W.closeAsk, { from: c.potsFrom })}{c.held ? ' ' + W.closeHeld : ''}</p>
        {box('pension', W.closePension, c.pots.pension)}
        {box('isa', W.closeIsa, c.pots.isa)}
        {box('gia', W.closeGia, c.pots.gia)}
        <div class="field field-text" data-field="close.name">
          <label for={id('name')}>{W.closeName}</label>
          <div class="box"><input type="text" id={id('name')} data-testid={id('name')} name={id('name')} autocomplete="off" inputmode="text" defaultValue={working ? c.working.name : c.name} data-shell-box="close.name" /></div>
        </div>
        {c.partner && (
          <div class="field field-check" data-field="close.partner">
            <label for={id('partner')}><input type="checkbox" id={id('partner')} data-testid={id('partner')} name={id('partner')} defaultChecked data-shell-box="close.partner" /> {fill(W.closePartner, { partner: c.partner.name })}</label>
          </div>
        )}
        <div class="actions-row">
          <Button testid={id('yes')} kind="primary" type="submit">{working ? W.closeWorkingYes : W.closeYes}</Button>
          <Button testid={id('notNow')} kind="quiet" onClick={close} {...keepFocus}>{W.notNow}</Button>
        </div>
      </form>
    );
  }
  if (a && a.kind === 'delete') {
    const second = a.step === 2;
    return (
      <div class="notice plan-menu-box plan-delete" role="region" aria-label={W.remove} data-testid={`${T}.deleteBox.${r.id}`} data-step={second ? '2' : '1'}>
        <p>{second ? fill(W.deleteLockedAsk, { name: r.name, lockedOn: r.lockedOn || '' }) : fill(W.deleteAsk, { name: r.name })}</p>
        <div class="actions-row">
          {!second && r.locked
            ? <Button testid={`${T}.delete.yes`} kind="primary" onClick={() => act('delete', { step: 2 })} {...keepFocus}>{W.deleteYes}</Button>
            : <Button testid={`${T}.delete.yes`} kind="primary" onClick={() => dispatch({ type: 'plan/delete', planId: r.id })} {...keepFocus}>{second ? W.deleteLockedYes : W.deleteYes}</Button>}
          <Button testid={`${T}.delete.notNow`} kind="quiet" onClick={close} {...keepFocus}>{W.notNow}</Button>
        </div>
      </div>
    );
  }
  const changeable = !r.shownAsSaved && !r.example;
  return (
    <div class="plan-menu" data-testid={`${T}.menu.${r.id}`}>
      {changeable && <Button testid={`${T}.rename.${r.id}`} kind="quiet" onClick={() => act('rename', { text: r.name })} {...keepFocus}>{W.rename}</Button>}
      {!r.shownAsSaved && <Button testid={`${T}.copy.${r.id}`} kind="quiet" onClick={() => act('copy')} {...keepFocus}>{W.copy}</Button>}
      {changeable && r.close && <Button testid={`${T}.close.${r.id}`} kind="quiet" onClick={() => act('close')} {...keepFocus}>{W.close}</Button>}
      {changeable && r.close && r.close.working && <Button testid={`${T}.closeWorking.${r.id}`} kind="quiet" onClick={() => act('close', { reason: 'working' })} {...keepFocus}>{W.closeWorking}</Button>}
      {changeable && !r.main && <Button testid={`${T}.main.${r.id}`} kind="quiet" onClick={() => dispatch({ type: 'plan/makeMain', planId: r.id })} {...keepFocus}>{W.main}</Button>}
      <Button testid={`${T}.download.${r.id}`} kind="quiet" onClick={() => dispatch({ type: 'plan/download', planId: r.id })} {...keepFocus}>{W.download}</Button>
      <Button testid={`${T}.delete.${r.id}`} kind="quiet" onClick={() => act('delete')} {...keepFocus}>{W.remove}</Button>
    </div>
  );
}

export function PlansScreen(state, dispatch) {
  const v = plansView(state);
  const M = plansMenuView(state);
  const w = PLAN.list;
  const W = w.actions;
  const visitor = v.session.kind === 'nobody';
  const S = M.several;
  const problemFor = (id) => (M.problem && (M.problem.planId === id) ? M.problem : null);
  let body;
  if (v.session.kind === 'unverified') body = (
    <div data-testid="plans.unverified">
      <p class="lead">{w.unverified}</p>
      <div class="actions-row"><LinkButton testid="plans.account" href={href.account()}>{COMMON.account}</LinkButton></div>
    </div>
  );
  else if (v.status === 'none' || v.status === 'checking' || v.status === 'reading' && !v.groups.length) body = <p class="lead" role="status" data-testid="plans.opening">{w.opening}</p>;
  else if (v.status === 'failed') body = (
    <div data-testid="plans.failed">
      <p class="lead" role="status">{w.failed}</p>
      <div class="actions-row"><Button testid="plans.tryAgain" onClick={() => dispatch({ type: 'plans/reading' })}>{w.tryAgain}</Button></div>
    </div>
  );
  else if (v.usedUp) body = (
    <div data-testid="plans.usedUp">
      <p class="lead">{w.usedUp}</p>
      <div class="actions-row"><LinkButton testid="plans.signIn" kind="primary" href={href.account()}>{w.signInButton}</LinkButton></div>
    </div>
  );
  else if (v.session.kind === 'nobody' && v.count === 0) body = (
    <div data-testid="plans.nobody">
      <p class="lead">{w.signIn}</p>
      <div class="actions-row"><LinkButton testid="plans.signIn" kind="primary" href={href.account()}>{w.signInButton}</LinkButton></div>
      <p class="note">{w.noAccount} <a href={href.front()}>{PLAN.header.ask}</a></p>
    </div>
  );
  else if (v.count === 0) body = <p class="lead" data-testid="plans.empty">{v.source === 'window' ? w.emptyWindow : w.empty}</p>;
  else body = (
    <>
      {visitor && <p class="note plan-banner" data-testid="plans.banner">{fill(GUEST.banner, { used: usedWords(M.guest.minutes) })}</p>}
      {S.open && <Several S={S} dispatch={dispatch} />}
      {S.done && <SeveralDone done={S.done} dispatch={dispatch} />}
      {v.groups.map((g) => (
        <section class="plan-group" key={g.id} data-testid={`plans.group.${g.id}`}>
          <h2>{w.groups[g.id]}</h2>
          <ul class="plan-list">
            {g.rows.map((r) => (
              <li class="plan-row" key={r.id} data-plan-id={r.id} data-example={r.example ? '1' : undefined} data-main={r.main ? '1' : undefined}>
                <div class="plan-row-top">
                  {/* "Delete several": the row's tick, labelled with what it does to this plan */}
                  {S.open && !S.confirm && !S.working && (
                    <label class="plan-tick" for={`plans.tick.${r.id}`}>
                      <input type="checkbox" id={`plans.tick.${r.id}`} data-testid={`plans.tick.${r.id}`} checked={S.ids.includes(r.id)}
                        onChange={(e) => dispatch({ type: 'plans/tick', planId: r.id, on: e.currentTarget.checked })} />
                      <span class="sr-only">{r.example ? PLAN.list.actions.severalTickExample : fill(PLAN.list.actions.severalTick, { name: r.name })}</span>
                    </label>
                  )}
                  <div class="plan-row-text">
                    {/* the example's row is headed by its tag alone: the stored name is the planner's (GuestPlans.js DEMO_PLANS), not in V7's words */}
                    <span class="plan-name">{r.example ? <span class="plan-tag" data-testid={`plans.exampleTag.${r.id}`}>{W.exampleRow}</span> : <>‘{r.name}’</>}{r.main && <span class="plan-tag" data-testid={`plans.mainTag.${r.id}`}> {W.mainNow}</span>}</span>
                    <span class="plan-stage">{r.example ? W.exampleLine + ' ' : ''}{r.line ? fill(PLAN.stageLines[r.line.id], r.line.slots) : ''}{r.lockedOn ? ' ' + fill(w.lockedOn, { date: r.lockedOn }) : ''}{r.madeOn ? ' ' + fill(w.madeOn, { date: r.madeOn }) : ''}{r.shownAsSaved ? ' ' + w.shownAsSaved : ''}{r.checkInDue && !(r.todo > 0) ? <> <strong class="plan-due" data-testid={`plans.checkInDue.${r.id}`}>{w.checkInDue}</strong></> : null}</span>
                    {/* the stage in three words and what is due (7.3.0): the plan's home says what each is; the count covers a
                        check-in due, so "Check-in due." is said only on a row that has no count */}
                    {(r.life || r.todo > 0) && !r.shownAsSaved && (
                      <span class="plan-life-row">
                        {r.life && <span class={`stage-word is-${r.life}`} data-testid={`plans.life.${r.id}`}><span class="stage-dot" aria-hidden="true" />{HOME.stages[r.life]}</span>}
                        {r.todo > 0 && <strong class="plan-todo" data-testid={`plans.todo.${r.id}`} data-count={String(r.todo)}>{r.todo === 1 ? HOME.rowTodo.one : fill(HOME.rowTodo.many, { n: String(r.todo) })}</strong>}
                      </span>
                    )}
                  </div>
                  <LinkButton testid={`plans.open.${r.id}`} href={href.plan(r.id)}>{w.open}</LinkButton>
                  {/* Month by month (7.2.0): a plain way in beside every drawing plan */}
                  {r.monthByMonth && <LinkButton testid={`plans.month.${r.id}`} kind="quiet" href={href.plan(r.id, 'month')}>{PLAN.steps.month.label}</LinkButton>}
                </div>
                {!S.open && <Menu r={r} M={M} dispatch={dispatch} />}
                {problemFor(r.id) && <p class="notice" role="alert" data-testid={`plans.problem.${r.id}`} data-problem={problemFor(r.id).problem}>{problemText(problemFor(r.id))}</p>}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </>
  );
  // under the list (every state but the gate and the wait): a new plan, a downloaded copy, the example for a visitor
  const under = v.status === 'read' && v.session.kind !== 'unverified' && !v.usedUp;
  const busyAny = M.saving && M.saving.planId === null ? M.saving.kind : null;
  const onFile = (e) => { const f = e.currentTarget.files && e.currentTarget.files[0]; if (f) dispatch({ type: 'plan/openFile', file: f }); e.currentTarget.value = ''; };
  return {
    question: null,
    rail: false,
    full: false,
    content: (
      <>
        <div class="plan-head">
          <h1 tabIndex={-1}>{w.title}</h1>
          {v.status === 'read' && v.readAt && <p class="note plan-read-at">{fill(w.readAt, { time: v.readAt })} <Button testid="plans.readAgain" kind="quiet" onClick={() => dispatch({ type: 'plans/reading' })}>{w.readAgain}</Button></p>}
        </div>
        {state.ui.leaveProblem && <p class="notice" role="alert">{PLAN.list.leaveProblem}</p>}
        {body}
        {under && (
          <section class="plan-group plan-under" data-testid="plans.under">
            <div class="actions-row">
              <LinkButton testid="plans.start" kind="primary" href={href.front()}>{W.start}</LinkButton>
              <Button testid="plans.openCopy" kind="plain" onClick={() => dispatch({ type: 'ui/toggle', id: 'openCopy' })} aria-expanded={M.openCopy ? 'true' : 'false'} {...keepFocus}>{M.openCopy ? W.openCopyClose : W.openCopy}</Button>
              {visitor && <Button testid="plans.example" kind="plain" onClick={() => dispatch({ type: 'plan/example' })} {...keepFocus}>{W.example}</Button>}
              {visitor && v.count > 0 && <LinkButton testid="plans.signIn" kind="quiet" href={href.account()}>{w.signInButton}</LinkButton>}
              {/* the person's own tidy-up of plans they no longer want (6.59.0): never offered with one plan, which cannot be deleted */}
              {v.count > 1 && !S.open && <Button testid="plans.several" kind="quiet" onClick={() => dispatch({ type: 'plans/several', on: true })} {...keepFocus}>{W.several}</Button>}
            </div>
            <p class="note">{W.startHelp}{visitor ? ' ' + W.exampleHelp : ''}</p>
            {M.openCopy && (
              <div class="notice plan-menu-box" data-testid="plans.openBox">
                <p class="note">{W.openHelp}</p>
                <div class="field field-file" data-field="openFile">
                  <label for="plans.openFile">{W.openPick}</label>
                  <div class="box"><input type="file" id="plans.openFile" data-testid="plans.openFile" name="plans.openFile" accept=".json,application/json" data-shell-box="file" onChange={onFile} /></div>
                </div>
              </div>
            )}
            {busyAny && <p class="note" role="status" data-testid={`plans.working.${busyAny}`}>{W.working}</p>}
            {problemFor(null) && <p class="notice" role="alert" data-testid="plans.problem" data-problem={problemFor(null).problem}>{problemText(problemFor(null))}</p>}
          </section>
        )}
        <UndoToast prefix="plans" toast={M.toast} text={doneText(M.toast)} words={{ undo: '', close: PLAN.page.close }} onUndo={() => {}} onClose={() => dispatch({ type: 'plan/toastClose' })} />
      </>
    )
  };
}
