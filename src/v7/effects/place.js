/**
 * Coming back to where you were (7.1.0; research/v7/after-7.md J2). Two things, both about places, never figures:
 *
 * Keep → sign in → back. "Keep this as a plan" without an account offers the account page with a way back
 * (account/return; state/place.js cleanBack): this effect keeps that way back in the window and opens "Your account". When
 * the person is then signed in — a sign-in, a new account confirmed, or Google — they are taken back instead of being left
 * on "Your account":
 *   - an answer not kept yet: back on its step, where the panel now keeps it in the account;
 *   - a plan just kept in this window: the plan source offers to bring the window's plans in (guest/offer) and, asked for
 *     here, they are brought in at once (guest/bringIn: the one create, as "Yes, bring them in" does); the person is then
 *     on that plan, by the id the account gave it, at the step it was kept for ("What you pay in" for a saver).
 * Leaving the account page before signing in lets the way back go: a person who opens "Your account" from the header later
 * stays there.
 *
 * Land where you left off. While someone is signed in, the plan and step they are on is kept in this window
 * (sessionStorage PLACE_KEY) and in the account's settings document (place/keep: the account effect writes lastLocation),
 * and this browser notes that someone is signed in here (localStorage SIGNED_IN_KEY: '1', nothing else; gone on
 * sign-out). Opening the site's root with no address of its own (`landing`: main.jsx's first hash was empty) and that
 * note present, the plan source is started (effects/index.js) and, once the account's plans and settings are read, the
 * person is taken to the window's place, else the account's, when that plan is there and not closed — else to "Your
 * plans". Nobody signed in, or any address of its own (the header's "All questions" is #/): the questions, as before.
 *
 *   RETURN_KEY, PLACE_KEY       sessionStorage keys: { planId, step, kept } | { q, step }; { planId, step }
 *   SIGNED_IN_KEY               localStorage key: '1' while someone is signed in in this browser
 *   hasSignedInHint(local)      whether the note is there
 *   placeFor(state, windowPlace)     the place to land on in the simple view, null to stay, undefined while not known yet
 *   TO_FULL                     what landingFor gives for someone who opens in the full view (7.11.0; 7.11.1: by default)
 *   landingFor(state, windowPlace)   TO_FULL, else placeFor's
 *   startPlace(store, { session, local, landing, full }) → stop()
 *
 * The view the site opens in (7.11.0; research/v7/replan-nov-2026.md §8): someone signed in lands in the full view instead
 * (`full`: effects/index.js opens it, replacing this page), with plans or without — unless the account holds the choice of
 * the simple view (7.11.1: the full view is the default for someone signed in, services/ViewChoice.js openingView). Most such
 * opens never reach here: effects/view.js fullViewForward sends the page on before anything is drawn, from this browser's
 * copy.
 */
import { A } from '../state/actions.js';
import { parse, href } from '../router/routes.js';
import { cleanBack, cleanPlace, placeHref, backHref } from '../state/place.js';
import { isClosedPlan } from '../../services/PlanClosed.js';
import { openingView } from '../../services/ViewChoice.js';

export const RETURN_KEY = 'pt_v7_return';
export const PLACE_KEY = 'pt_v7_place';
export const SIGNED_IN_KEY = 'pt_v7_signed_in';
/** The account page's asks that sign someone in (ACCOUNT_ASK `what`): a form sent, Google, an email confirmed. */
export const SIGN_IN_ASKS = Object.freeze(['signIn', 'signUp', 'google', 'verifyCheck']);

export function hasSignedInHint(local) {
  try { return !!local && local.getItem(SIGNED_IN_KEY) === '1'; } catch { return false; }
}

const samePlace = (a, b) => !!a && !!b && a.planId === b.planId && (a.step || null) === (b.step || null);

/**
 * Where a person opening the site's root lands in the simple view (land where you left off): undefined while the session,
 * the plans or the settings are not known yet; null to stay on the questions; else the address. The window's place first
 * (the plan this window was last on), then the account's (the last plan on any device); a plan gone or closed is passed
 * over, and with no place to go "Your plans" opens when the account has a plan.
 */
export function placeFor(state, windowPlace = null) {
  const k = state.session && state.session.kind;
  if (k === 'nobody' || k === 'unverified') return null;
  if (k !== 'in') return undefined;
  const p = state.plans;
  if (!p || p.status === 'failed') return p ? null : undefined;
  if (p.status !== 'read') return undefined;
  if (p.source !== 'account') return undefined;
  if (state.ui.profile === null) return undefined;
  const plans = p.list.map((e) => e && e.plan).filter(Boolean);
  if (!plans.length) return null;
  const open = (place) => !!place && plans.some((pl) => String(pl.id) === place.planId && !isClosedPlan(pl));
  const account = state.ui.profile ? cleanPlace(state.ui.profile.lastLocation) : null;
  for (const place of [cleanPlace(windowPlace), account]) if (open(place)) return hrefOf(place, plans);
  return href.plans();
}

/** The full view, for someone who opens in it (7.11.0; 7.11.1: everyone signed in who has not chosen the simple view). */
export const TO_FULL = Object.freeze({ view: 'full' });

/**
 * Where a person opening the site's root lands: nobody signed in, null (the questions); undefined while the session or the
 * settings are not known; the full view (TO_FULL) with plans or without, unless the settings, read, hold the choice of the
 * simple view (7.11.1, ViewChoice.openingView: no choice stored is the full view) — then placeFor's. Settings that could not
 * be read are no choice of the full view either: placeFor's, as before.
 */
export function landingFor(state, windowPlace = null) {
  const k = state.session && state.session.kind;
  if (k === 'nobody' || k === 'unverified') return null;
  if (k !== 'in') return undefined;
  const p = state.ui.profile;
  if (p && !p.unread && openingView(p) === 'full') return TO_FULL;
  return placeFor(state, windowPlace);
}

/**
 * A remembered place as an address (7.3.0): on a LOCKED plan the plan's home, whatever step was last open there — someone
 * carrying out a plan comes back to what is due — and on any other plan the step itself.
 */
function hrefOf(place, plans) {
  const pl = plans.find((x) => String(x.id) === place.planId);
  const locked = !!(pl && pl.decisionTool && pl.decisionTool.settings && pl.decisionTool.settings.locked);
  return locked ? href.plan(place.planId) : placeHref(place);
}

/**
 * Signed in on the account page with no way back to anything (a new device: 7.3.0, research/v7/one-product-design.md
 * "Landing"): the last plan the account was on, at its home (locked or not), instead of staying on "Your account";
 * undefined while not known yet, null to stay (no plan remembered, or that plan gone or closed).
 */
export function afterSignInFor(state) {
  // the simple view's place, whatever view the account opens in: a sign-in on Your account here stays in the simple view
  const to = placeFor(state, null);
  if (to === undefined) return undefined;
  const account = state.ui.profile ? cleanPlace(state.ui.profile.lastLocation) : null;
  // the plan's home whether or not it is locked: a new device starts from what is due, not from a step left open elsewhere
  return to && account && to !== href.plans() ? href.plan(account.planId) : null;
}

/**
 * @param {{ getState, dispatch, subscribe }} store
 * @param {object} o
 * @param {Storage|null} [o.session]   sessionStorage (the way back; the window's place)
 * @param {Storage|null} [o.local]     localStorage (the signed-in note)
 * @param {boolean} [o.landing]        the page was opened at the site's root, with no address of its own, and the note is there
 * @param {Function} [o.full]          opens the full view in place of this page (a landing for someone whose account says so)
 */
export function startPlace(store, { session = null, local = null, landing = false, full = () => {} } = {}) {
  let stopped = false;
  const dispatch = (a) => { if (!stopped) store.dispatch(a); };
  const read = (key) => { try { const t = session ? session.getItem(key) : null; return t ? JSON.parse(t) : null; } catch { return null; } };
  const keep = (key, v) => { try { if (!session) return; if (v == null) session.removeItem(key); else session.setItem(key, JSON.stringify(v)); } catch { /* private mode: kept in memory only */ } };
  const note = (on) => { try { if (!local) return; if (on) local.setItem(SIGNED_IN_KEY, '1'); else local.removeItem(SIGNED_IN_KEY); } catch { /* private mode */ } };
  const go = (address) => { if (address) dispatch({ type: A.ROUTE_SET, route: parse(address) }); };
  const letGo = () => { keep(RETURN_KEY, null); dispatch({ type: A.ACCOUNT_RETURN, back: null }); };

  let windowPlace = cleanPlace(read(PLACE_KEY));
  let sent = null;                       // the place last sent to the account (or read from it)
  let landed = !landing;
  let asked = false;                     // a sign-in was asked for on this page (7.12.0: a session restored is no sign-in)
  let afterSignIn = false;               // signed in on this page, on the account page with no way back: to the last plan
  // A way back kept in this window survives a reload of the account page (an email confirmed in another tab, this page
  // opened again); on any other page it is let go.
  {
    const back = cleanBack(read(RETURN_KEY));
    const s = store.getState();
    if (back && s.route && s.route.screen === 'account') dispatch({ type: A.ACCOUNT_RETURN, back });
    else if (back) keep(RETURN_KEY, null);
  }

  const land = (state) => {
    if (landed) return;
    if (!state.route || state.route.screen !== 'front') { landed = true; return; }   // the person went somewhere already
    const to = landingFor(state, windowPlace);
    if (to === undefined) return;
    landed = true;
    if (to === TO_FULL) { full(); return; }
    go(to);
  };

  const followSignIn = (state) => {
    if (!afterSignIn) return;
    if (!state.route || state.route.screen !== 'account' || state.ui.returnTo) { afterSignIn = false; return; }
    const to = afterSignInFor(state);
    if (to === undefined) return;
    afterSignIn = false;
    go(to);
  };

  const off = store.subscribe((state, action, previous) => {
    const back = state.ui.returnTo || null;
    if (action.type === A.ACCOUNT_RETURN) {
      keep(RETURN_KEY, back);
      if (back && state.route.screen !== 'account') go(href.account());
      return;
    }
    // the account page left before signing in: the way back is let go
    if (back && action.type === A.ROUTE_SET && state.route.screen !== 'account') letGo();
    if (action.type === A.ACCOUNT_ASK && SIGN_IN_ASKS.includes(action.what)) asked = true;
    if (action.type === A.SESSION_SET) {
      const was = previous.session && previous.session.kind;
      const now = state.session.kind;
      if (now === 'in') note(true);
      if (now === 'nobody' && was === 'in') { note(false); keep(PLACE_KEY, null); windowPlace = null; sent = null; }
      if (now === 'nobody' && was !== 'in') note(false);
      // signed in with a way back to an answer: back on it (a plan kept in the window waits for the bring-in, below)
      if (back && now === 'in' && was !== 'in' && !back.kept) { letGo(); go(backHref(back)); }
      // a sign-in asked for on this page, on the account page with no way back: once the account's plans and settings are
      // read, to the last plan (7.3.0). A session restored when the page opens is no sign-in (7.12.0): a bookmark to Your
      // account stays on Your account.
      if (!back && asked && now === 'in' && was !== 'in' && state.route && state.route.screen === 'account') { afterSignIn = true; asked = false; }
    }
    // a plan kept in this window and a way back to it: the window's plans brought in at once, then the plan opened
    if (back && back.kept && action.type === A.GUEST_OFFER && state.session.kind === 'in') dispatch({ type: A.GUEST_BRING_IN });
    if (back && back.kept && action.type === A.PLAN_ACTION_DONE && action.op === 'brought') {
      const moved = Array.isArray(action.moved) ? action.moved : [];
      const pair = moved.find((m) => Array.isArray(m) && m[0] === back.planId);
      letGo();
      go(backHref(back, pair ? pair[1] : null));
    }
    if (action.type === A.PROFILE_SET && !sent && state.ui.profile) sent = cleanPlace(state.ui.profile.lastLocation);
    // the place, while signed in: in this window, and in the account when it has changed
    const r = state.route;
    if (state.session.kind === 'in' && r && r.screen === 'plan' && r.planId) {
      const place = { planId: r.planId, step: r.step || null };
      if (!samePlace(place, windowPlace)) { windowPlace = place; keep(PLACE_KEY, place); }
      if (!samePlace(place, sent) && state.ui.profile !== null) { sent = place; dispatch({ type: A.PLACE_KEEP, place }); }
    }
    land(state);
    followSignIn(state);
  });
  land(store.getState());
  return () => { stopped = true; off(); };
}
