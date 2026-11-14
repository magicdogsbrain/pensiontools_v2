/**
 * The page frame: header, the line to the previous version, the offline line, the rail, one <main>, the footer. The <main> is the
 * screen root and carries data-screen and data-question (build brief 4.9; as package 1's stub drew it), and
 * data-view="retired" on A's and B's retired view (step 4 brief, conflict 44). One h1 per screen; after a move the keyboard goes to
 * it, or to the box the address names (?focus=<field>) — once that box is drawn, when it comes later than the page (a plan's
 * "Try the bad years" waits for its "Does it last?"). The only hooks in V7 are here, and only for focus.
 */
import { useEffect, useRef } from 'preact/hooks';
import { Rail } from './Rail.jsx';
import { GuestNag, GuestStop, BringIn, NewsPopup } from './Visitor.jsx';
import { fill, changeAction } from './PlanFigures.jsx';
import { format, href } from '../router/routes.js';
import { focusField } from './Field.jsx';
import { guestView, newsView, plansMenuView, previousLinkView } from '../state/select.js';
import { COMMON, ADVICE_SHORT, ADVICE_FULL } from '../copy/common.js';
import { PLAN } from '../copy/plan.js';

export function Shell({ state, dispatch, name, question = null, rail = false, full = false, view = null, children }) {
  const ref = useRef(null);
  const mounted = useRef(false);
  const pending = useRef(null);
  const address = format(state.route);
  const focusQ = state.route.screen === 'plan' ? 'plan' : state.route.q || 'c';

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    pending.current = null;
    // (a plan page's one section an address may name: "Try the bad years", [data-focus-for="plan.stress"])
    if (state.route.focus) {
      if (focusField(root, state.route.focus, focusQ)) return;
      // that section is drawn only once its page has its answer (the panel waits for "Does it last?"): tried again below
      pending.current = address;
    }
    if (!mounted.current) { mounted.current = true; return; }       // never steal the keyboard on first load
    const h1 = root.querySelector('h1');
    if (h1) h1.focus();
  }, [address]);

  // the box or section the address names, once it is drawn — unless the keyboard has gone somewhere since (anywhere but the
  // page itself or its heading, where the move above put it): then it is left where the person put it
  useEffect(() => {
    if (!pending.current || pending.current !== address || !state.route.focus) return;
    const root = ref.current;
    if (!root) return;
    const at = typeof document !== 'undefined' ? document.activeElement : null;
    if (at && at !== document.body && at.tagName !== 'H1') { pending.current = null; return; }
    if (focusField(root, state.route.focus, focusQ)) pending.current = null;
  });

  const focusMain = () => { const main = ref.current && ref.current.querySelector('main'); if (main) main.focus(); };
  const front = name === 'front';
  // the plan pages (research/v7/your-plan.md 1.1): "Your plans" in every header; "Sign out" on plan pages while signed in
  const onPlans = name === 'plans' || name === 'plan';
  const signedIn = onPlans && state.session && state.session.kind === 'in';
  // the shell's own boxes (road-to-7.md step 11): the visitor's reminder and stop, the hand-over after a sign-in, What's new
  const G = guestView(state);
  const N = newsView(state);
  const M = plansMenuView(state);
  // "Use the previous version" on a plan page opens THAT plan in the planner, at the matching page (7.3.2): the same
  // hand-over as "Change this" (select.js previousLinkView). A plain link opened the account's usual plan instead.
  const P = previousLinkView(state);
  const onPrevious = P ? (e) => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;   // a new tab: the plain address, as before
    e.preventDefault();
    dispatch(changeAction(P.planId, P.place, P.back));
  } : undefined;
  const bringInProblem = G.bringIn && M.problem && M.problem.planId === null && !M.saving ? M.problem : null;

  return (
    <div class={`pt pt-${name.replace('.', '-')}`} ref={ref}>
      <button type="button" class="skip" onClick={focusMain}>{COMMON.skip}</button>
      <header class="top">
        {/* the site's name and the one line saying what it does (7.1.0); the line gives way on a narrow phone (components.css) */}
        <a class="brand" href="#/" data-testid="nav.brand"><span class="brand-name">{COMMON.product}</span> <span class="brand-line">{COMMON.tagline}</span></a>
        <nav class="top-nav" aria-label={COMMON.product}>
          <a href="#/plans" data-testid="nav.plans">{PLAN.header.plans}</a>
          <a href="#/">{onPlans ? PLAN.header.ask : COMMON.allQuestions}</a>
          <a href={href.account()} data-testid="nav.account">{COMMON.account}</a>
          {signedIn && <button type="button" class="btn btn-quiet top-signout" data-testid="nav.signOut" onClick={() => dispatch({ type: 'session/out' })}>{PLAN.header.signOut}</button>}
        </nav>
      </header>
      {/* One line on a phone (the short words), the full sentence where there is room: components.css picks one. */}
      <p class="previous-line">
        <span class="previous-long">{COMMON.previous.text} <a href={COMMON.links.classic} data-testid="nav.previous" onClick={onPrevious}>{COMMON.previous.link}</a></span>
        <span class="previous-short">{COMMON.previous.shortText} <a href={COMMON.links.classic} data-testid="nav.previousShort" onClick={onPrevious}>{COMMON.previous.shortLink}</a></span>
      </p>
      {state.ui.online === false && <p class="offline" role="status">{COMMON.offline}</p>}
      {rail === true ? <Rail state={state} dispatch={dispatch} /> : rail || null}
      <main id="main" tabIndex={-1} data-screen={name} data-question={question || undefined} data-view={view || undefined}>{children}</main>
      <footer class="foot" data-region="footer">
        {full && <p class="advice-full">{ADVICE_FULL}</p>}
        <p class="advice">{front ? `${COMMON.footer.worksOut} ${ADVICE_SHORT}` : ADVICE_SHORT}</p>
        <p class="run-by">{COMMON.footer.runBy} <a href={COMMON.links.privacy}>{COMMON.footer.privacy}</a> · <a href={href.news()} data-testid="nav.whatsNew">{fill(COMMON.footer.whatsNew, { version: state.env.appVersion })}</a> · <a href={href.assumptions()} data-testid="nav.assumptions">{COMMON.footer.assumptions}</a></p>
      </footer>
      {G.stop && <GuestStop />}
      {!G.stop && G.nag && <GuestNag nag={G.nag} dispatch={dispatch} />}
      {G.bringIn && <BringIn offer={G.bringIn} problem={bringInProblem} dispatch={dispatch} />}
      {N.popup && <NewsPopup entries={N.popup} dispatch={dispatch} />}
    </div>
  );
}
