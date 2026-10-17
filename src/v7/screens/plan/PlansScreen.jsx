/**
 * "Your plans" (research/v7/your-plan.md 1.1, 1.2): the account's plans — or this window's, when nobody is signed in —
 * in groups, each by its own name with one stage line and "Open". The other states: checking, nobody signed in, email
 * not confirmed, could not read, used up. Draws only: the rows are state/select.js plansView's.
 */
import { Button, LinkButton, fill } from '../../components/index.js';
import { plansView } from '../../state/select.js';
import { href } from '../../router/routes.js';
import { PLAN } from '../../copy/plan.js';
import { COMMON } from '../../copy/common.js';

/** The planner's sign-in screen, in this window (its own `?signin=1` door); the hand-over leaves the way back. */
export const SIGN_IN_PLACE = 'signin';

export function PlansScreen(state, dispatch) {
  const v = plansView(state);
  const w = PLAN.list;
  const onChange = (place) => dispatch({ type: 'plan/change', planId: null, place, back: href.plans() });
  let body;
  if (v.session.kind === 'unverified') body = (
    <div data-testid="plans.unverified">
      <p class="lead">{w.unverified}</p>
      <div class="actions-row"><LinkButton testid="plans.openPlanner" href={COMMON.links.current}>{w.openPlanner}</LinkButton></div>
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
      <div class="actions-row"><Button testid="plans.signIn" kind="primary" onClick={() => onChange(SIGN_IN_PLACE)}>{w.signInButton}</Button></div>
    </div>
  );
  else if (v.session.kind === 'nobody' && v.count === 0) body = (
    <div data-testid="plans.nobody">
      <p class="lead">{w.signIn}</p>
      <div class="actions-row"><Button testid="plans.signIn" kind="primary" onClick={() => onChange(SIGN_IN_PLACE)}>{w.signInButton}</Button></div>
      <p class="note">{w.noAccount} <a href={href.front()}>{PLAN.header.ask}</a></p>
    </div>
  );
  else if (v.count === 0) body = <p class="lead" data-testid="plans.empty">{v.source === 'window' ? w.emptyWindow : w.empty}</p>;
  else body = (
    <>
      {v.groups.map((g) => (
        <section class="plan-group" key={g.id} data-testid={`plans.group.${g.id}`}>
          <h2>{w.groups[g.id]}</h2>
          <ul class="plan-list">
            {g.rows.map((r) => (
              <li class="plan-row" key={r.id} data-plan-id={r.id}>
                <div class="plan-row-text">
                  <span class="plan-name">‘{r.name}’</span>
                  <span class="plan-stage">{r.line ? fill(PLAN.stageLines[r.line.id], r.line.slots) : ''}{r.lockedOn ? ' ' + fill(w.lockedOn, { date: r.lockedOn }) : ''}{r.madeOn ? ' ' + fill(w.madeOn, { date: r.madeOn }) : ''}{r.shownAsSaved ? ' ' + w.shownAsSaved : ''}</span>
                </div>
                <LinkButton testid={`plans.open.${r.id}`} href={href.plan(r.id)}>{w.open}</LinkButton>
              </li>
            ))}
          </ul>
        </section>
      ))}
      {v.session.kind === 'nobody' && (
        <div class="actions-row">
          <Button testid="plans.signIn" onClick={() => onChange(SIGN_IN_PLACE)}>{w.signInButton}</Button>
        </div>
      )}
    </>
  );
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
      </>
    )
  };
}
