/**
 * "Your plans" (research/v7/your-plan.md 1.1, 1.2; road-to-7.md step 11): the account's plans — or this window's, when
 * nobody is signed in — in groups, each by its own name with one stage line, "Open", and the plan menu on the row: Rename
 * (a box), Make a copy (a question: as it is, or with the records), Make this my main plan, Download this plan, Delete (a
 * confirm that names the plan; a second one for a locked plan; never undone). Under the list: "Start a new plan" (the
 * front door: every plan begins from a question), "Open a downloaded copy" (a file box), and for a visitor "Look around an
 * example". The other states: checking, nobody signed in, email not confirmed, could not read, used up. Draws only: the
 * rows are state/select.js plansView's, the menu's state plansMenuView's; every write is the one write file's.
 */
import { Button, LinkButton, UndoToast, fill } from '../../components/index.js';
import { usedWords } from '../../components/Visitor.jsx';
import { plansView, plansMenuView } from '../../state/select.js';
import { href } from '../../router/routes.js';
import { PLAN } from '../../copy/plan.js';
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
  return fill(text, { problem: p.detail || '' });
};

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
  const problemFor = (id) => (M.problem && (M.problem.planId === id) ? M.problem : null);
  let body;
  if (v.session.kind === 'unverified') body = (
    <div data-testid="plans.unverified">
      <p class="lead">{w.unverified}</p>
      <div class="actions-row"><LinkButton testid="plans.account" href={href.account()}>{PLAN.header.account}</LinkButton></div>
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
      {v.groups.map((g) => (
        <section class="plan-group" key={g.id} data-testid={`plans.group.${g.id}`}>
          <h2>{w.groups[g.id]}</h2>
          <ul class="plan-list">
            {g.rows.map((r) => (
              <li class="plan-row" key={r.id} data-plan-id={r.id} data-example={r.example ? '1' : undefined} data-main={r.main ? '1' : undefined}>
                <div class="plan-row-top">
                  <div class="plan-row-text">
                    <span class="plan-name">‘{r.name}’{r.main && <span class="plan-tag" data-testid={`plans.mainTag.${r.id}`}> {W.mainNow}</span>}{r.example && <span class="plan-tag" data-testid={`plans.exampleTag.${r.id}`}> {W.exampleRow}</span>}</span>
                    <span class="plan-stage">{r.example ? W.exampleLine + ' ' : ''}{r.line ? fill(PLAN.stageLines[r.line.id], r.line.slots) : ''}{r.lockedOn ? ' ' + fill(w.lockedOn, { date: r.lockedOn }) : ''}{r.madeOn ? ' ' + fill(w.madeOn, { date: r.madeOn }) : ''}{r.shownAsSaved ? ' ' + w.shownAsSaved : ''}</span>
                  </div>
                  <LinkButton testid={`plans.open.${r.id}`} href={href.plan(r.id)}>{w.open}</LinkButton>
                </div>
                <Menu r={r} M={M} dispatch={dispatch} />
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
        <UndoToast prefix="plans" toast={M.toast} text={doneText(M.toast)} words={{ undo: '', close: W.notNow }} onUndo={() => {}} onClose={() => dispatch({ type: 'plan/toastClose' })} />
      </>
    )
  };
}
