/**
 * "Your account" (research/v7/road-to-7.md step 11): signed in — the email and whether it is confirmed, the password-reset
 * email, "Download everything", "Delete my account" (two confirms on the screen, never a browser dialog), "Sign out", the
 * privacy policy; the email not confirmed — the "Confirm your email" gate (the same gate as the planner); nobody signed in —
 * the sign-in, sign-up and forgotten-password forms, and Google. The password lives in its box and in the action that
 * carries it to the effect — never in the state. Draws only: everything is state/select.js accountView's; the effect
 * (effects/account.js) does each thing. A visitor is never offered "Delete my account": there is no account.
 */
import { Button, LinkButton, fill } from '../components/index.js';
import { accountView } from '../state/select.js';
import { href } from '../router/routes.js';
import { ACCOUNT } from '../copy/account.js';
import { COMMON } from '../copy/common.js';
import { PLAN } from '../copy/plan.js';

const keepFocus = { onMouseDown: (e) => e.preventDefault() };
const T = 'account';
const ids = { email: `${T}.email`, password: `${T}.password` };

const problemText = (p) => (p ? ACCOUNT.problems[p.code] || (p.what === 'verifyCheck' && p.code === 'notYet' ? ACCOUNT.verify.notYet : ACCOUNT.problems.failed) : '');
const noteText = (n) => {
  if (!n) return '';
  const s = n.slots || {};
  if (n.what === 'reset') return fill(ACCOUNT.forms.resetSent, s);
  if (n.what === 'signUp') return fill(ACCOUNT.forms.signedUp, s);
  if (n.what === 'verifySend') return ACCOUNT.verify.sent;
  if (n.what === 'download') return fill(ACCOUNT.download.done, s);
  return '';
};

/** A field of the forms: a real label, the box uncontrolled (the state never holds it), the right keyboard. */
function Box({ id, type, label, autocomplete, inputmode }) {
  return (
    <div class={`field field-${type}`} data-field={id}>
      <label for={id}>{label}</label>
      <div class="box"><input type={type} id={id} data-testid={id} name={id} autocomplete={autocomplete} inputmode={inputmode} data-shell-box={type} required={false} /></div>
    </div>
  );
}

const read = (form, id) => { const el = form.elements.namedItem(id); return el && typeof el.value === 'string' ? el.value : ''; };

function Forms({ V, dispatch }) {
  const F = ACCOUNT.forms;
  const busy = V.busy;
  const ask = (what, form) => dispatch({ type: 'account/ask', what, email: read(form, ids.email), password: read(form, ids.password) });
  const mode = (m) => dispatch({ type: 'account/mode', mode: m });
  const problem = V.problem && V.problem.what !== 'delete' ? problemText(V.problem) : '';
  const note = noteText(V.note);
  const submit = (what) => (e) => { e.preventDefault(); if (!busy) ask(what, e.currentTarget); };
  return (
    <div data-testid={`${T}.forms`} data-mode={V.mode}>
      <p class="lead">{F.lead}</p>
      {note && <p class="notice" role="status" data-testid={`${T}.note`}>{note}</p>}
      {problem && <p class="notice" role="alert" data-testid={`${T}.problem`} data-problem={V.problem.code}>{problem}</p>}
      {V.mode === 'signIn' && (
        <form class="ask account-form" noValidate onSubmit={submit('signIn')} data-testid={`${T}.signIn`}>
          <h2>{F.signIn}</h2>
          <Box id={ids.email} type="email" label={F.email} autocomplete="email" inputmode="email" />
          <Box id={ids.password} type="password" label={F.password} autocomplete="current-password" />
          <div class="actions-row">
            <Button testid={`${T}.signIn.submit`} kind="primary" type="submit" aria-disabled={busy ? 'true' : undefined}>{busy === 'signIn' ? F.working : F.submitSignIn}</Button>
            <Button testid={`${T}.google`} onClick={() => { if (!busy) dispatch({ type: 'account/ask', what: 'google' }); }} aria-disabled={busy ? 'true' : undefined} {...keepFocus}>{busy === 'google' ? F.working : F.google}</Button>
          </div>
          <div class="actions-row">
            <Button testid={`${T}.toSignUp`} kind="quiet" onClick={() => mode('signUp')} {...keepFocus}>{F.toSignUp}</Button>
            <Button testid={`${T}.toReset`} kind="quiet" onClick={() => mode('reset')} {...keepFocus}>{F.toReset}</Button>
          </div>
        </form>
      )}
      {V.mode === 'signUp' && (
        <form class="ask account-form" noValidate onSubmit={submit('signUp')} data-testid={`${T}.signUp`}>
          <h2>{F.signUp}</h2>
          <Box id={ids.email} type="email" label={F.email} autocomplete="email" inputmode="email" />
          <Box id={ids.password} type="password" label={F.newPassword} autocomplete="new-password" />
          <div class="actions-row">
            <Button testid={`${T}.signUp.submit`} kind="primary" type="submit" aria-disabled={busy ? 'true' : undefined}>{busy === 'signUp' ? F.working : F.submitSignUp}</Button>
            <Button testid={`${T}.google`} onClick={() => { if (!busy) dispatch({ type: 'account/ask', what: 'google' }); }} aria-disabled={busy ? 'true' : undefined} {...keepFocus}>{busy === 'google' ? F.working : F.google}</Button>
          </div>
          <div class="actions-row"><Button testid={`${T}.toSignIn`} kind="quiet" onClick={() => mode('signIn')} {...keepFocus}>{F.toSignIn}</Button></div>
        </form>
      )}
      {V.mode === 'reset' && (
        <form class="ask account-form" noValidate onSubmit={submit('reset')} data-testid={`${T}.reset`}>
          <h2>{F.reset}</h2>
          <Box id={ids.email} type="email" label={F.email} autocomplete="email" inputmode="email" />
          <div class="actions-row">
            <Button testid={`${T}.reset.submit`} kind="primary" type="submit" aria-disabled={busy ? 'true' : undefined}>{busy === 'reset' ? F.working : F.submitReset}</Button>
            <Button testid={`${T}.back`} kind="quiet" onClick={() => mode('signIn')} {...keepFocus}>{F.back}</Button>
          </div>
        </form>
      )}
    </div>
  );
}

function Gate({ V, dispatch }) {
  const G = ACCOUNT.verify;
  const busy = V.busy;
  const ask = (what) => { if (!busy) dispatch({ type: 'account/ask', what }); };
  const problem = V.problem ? problemText(V.problem) : '';
  const note = noteText(V.note);
  return (
    <div data-testid={`${T}.verify`}>
      <h2>{G.title}</h2>
      <p class="lead">{fill(G.line, { email: V.email || '' })}</p>
      <p class="note">{G.note}</p>
      {note && <p class="notice" role="status" data-testid={`${T}.note`}>{note}</p>}
      {problem && <p class="notice" role="alert" data-testid={`${T}.problem`} data-problem={V.problem.code}>{problem}</p>}
      <div class="actions-row">
        <Button testid={`${T}.verify.check`} kind="primary" onClick={() => ask('verifyCheck')} aria-disabled={busy ? 'true' : undefined} {...keepFocus}>{busy === 'verifyCheck' ? ACCOUNT.forms.working : G.check}</Button>
        <Button testid={`${T}.verify.send`} onClick={() => ask('verifySend')} aria-disabled={busy ? 'true' : undefined} {...keepFocus}>{busy === 'verifySend' ? ACCOUNT.forms.working : G.send}</Button>
        <Button testid={`${T}.verify.signOut`} kind="quiet" onClick={() => ask('signOut')} {...keepFocus}>{ACCOUNT.signOut}</Button>
      </div>
    </div>
  );
}

function SignedIn({ V, dispatch }) {
  const busy = V.busy;
  const ask = (what) => { if (!busy) dispatch({ type: 'account/ask', what }); };
  const confirm = (step) => dispatch({ type: 'account/confirm', step });
  const R = ACCOUNT.remove;
  const problem = V.problem ? problemText(V.problem) : '';
  const note = noteText(V.note);
  return (
    <div data-testid={`${T}.signedIn`}>
      <p class="lead" data-testid={`${T}.email`}>{fill(ACCOUNT.signedInAs, { email: V.email || '' })} {ACCOUNT.confirmed}</p>
      {V.deleted && !V.deleted.signInGone && <p class="notice" role="status" data-testid={`${T}.deleted.again`}>{R.needsSignIn}</p>}
      {note && <p class="notice" role="status" data-testid={`${T}.note`}>{note}</p>}
      {problem && <p class="notice" role="alert" data-testid={`${T}.problem`} data-problem={V.problem.code}>{problem}</p>}
      <section class="plan-section account-section" data-section="password">
        <h2>{ACCOUNT.password.title}</h2>
        <p class="note">{ACCOUNT.password.note}</p>
        <div class="actions-row"><Button testid={`${T}.reset.send`} onClick={() => ask('reset')} aria-disabled={busy ? 'true' : undefined} {...keepFocus}>{busy === 'reset' ? ACCOUNT.forms.working : ACCOUNT.password.button}</Button></div>
      </section>
      <section class="plan-section account-section" data-section="download">
        <h2>{ACCOUNT.download.title}</h2>
        <p class="note">{ACCOUNT.download.note}</p>
        <div class="actions-row"><Button testid={`${T}.download`} onClick={() => ask('download')} aria-disabled={busy ? 'true' : undefined} {...keepFocus}>{busy === 'download' ? ACCOUNT.forms.working : ACCOUNT.download.button}</Button></div>
      </section>
      <section class="plan-section account-section" data-section="delete">
        <h2>{R.title}</h2>
        <p class="note">{R.note}</p>
        {busy === 'delete' && <p class="note" role="status" data-testid={`${T}.delete.working`}>{R.working}</p>}
        {!busy && V.confirm === null && <div class="actions-row"><Button testid={`${T}.delete`} onClick={() => confirm(1)} {...keepFocus}>{R.button}</Button></div>}
        {!busy && V.confirm === 1 && (
          <div class="notice lock-confirm" role="region" aria-label={R.title} data-testid={`${T}.delete.confirm1`}>
            <p>{R.ask1}</p>
            <div class="actions-row">
              <Button testid={`${T}.delete.yes1`} kind="primary" onClick={() => confirm(2)} {...keepFocus}>{R.yes1}</Button>
              <Button testid={`${T}.delete.no`} kind="quiet" onClick={() => confirm(null)} {...keepFocus}>{R.no}</Button>
            </div>
          </div>
        )}
        {!busy && V.confirm === 2 && (
          <div class="notice lock-confirm" role="region" aria-label={R.title} data-testid={`${T}.delete.confirm2`}>
            <p>{R.ask2}</p>
            <div class="actions-row">
              <Button testid={`${T}.delete.yes2`} kind="primary" onClick={() => ask('delete')} {...keepFocus}>{R.yes2}</Button>
              <Button testid={`${T}.delete.no`} kind="quiet" onClick={() => confirm(null)} {...keepFocus}>{R.no}</Button>
            </div>
          </div>
        )}
      </section>
      <div class="actions-row">
        <Button testid={`${T}.signOut`} kind="quiet" onClick={() => dispatch({ type: 'session/out' })} {...keepFocus}>{ACCOUNT.signOut}</Button>
        <a href={COMMON.links.privacy} data-testid={`${T}.privacy`}>{ACCOUNT.privacy}</a>
      </div>
    </div>
  );
}

export function AccountScreen(state, dispatch) {
  const V = accountView(state);
  const k = V.session.kind;
  let body;
  if (k === 'none' || k === 'checking') body = <p class="lead" role="status" data-testid={`${T}.opening`}>{ACCOUNT.opening}</p>;
  else if (k === 'in') body = <SignedIn V={V} dispatch={dispatch} />;
  else if (k === 'unverified') body = <Gate V={V} dispatch={dispatch} />;
  else body = (
    <>
      {V.deleted && V.deleted.signInGone && <p class="notice" role="status" data-testid={`${T}.deleted.done`}>{ACCOUNT.remove.done}</p>}
      {V.deleted && !V.deleted.signInGone && <p class="notice" role="status" data-testid={`${T}.deleted.again`}>{ACCOUNT.remove.needsSignIn}</p>}
      <Forms V={V} dispatch={dispatch} />
      <p class="note"><a href={COMMON.links.privacy} data-testid={`${T}.privacy`}>{ACCOUNT.privacy}</a> · <LinkButton testid={`${T}.toPlans`} kind="quiet" href={href.plans()}>{PLAN.header.plans}</LinkButton></p>
    </>
  );
  return {
    question: null,
    rail: false,
    full: false,
    content: (
      <>
        <h1 tabIndex={-1}>{ACCOUNT.title}</h1>
        {body}
      </>
    )
  };
}
