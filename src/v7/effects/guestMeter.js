/**
 * The visitor's meter in V7's shell (research/v7/road-to-7.md step 11; v6-usability-audit.md decision 7) — through
 * services/GuestMeter.js only: the same count of active minutes the planner keeps in this browser (localStorage, the
 * keys GuestMeter.js names and nothing else reads), ticked once a minute with the planner's own rule (the page visible,
 * activity in the last two minutes: GuestMeter.tick), the four reminders at the planner's milestones (pendingNag, each
 * shown once: markNagShown), and the stop when the three hours are used up (isBlocked) — which effects/planWrite.js
 * already refuses as 'usedUp'.
 *
 * The meter counts while the person is a visitor with plans of their own in this window: nobody signed in, the plans
 * read from the window (the example plan alone does not count — nor do V7's answers, which need no plan: the parity
 * ledger's rule for ways.guest-trial). What it says goes to the state (guest/tick); the shell draws the reminder and the
 * stop (components/Visitor.jsx).
 *
 *   TICK_MS                                  a minute
 *   startGuestMeter(store, { win, local, now }) → stop()
 */
import { A } from '../state/actions.js';
import { tick, readMinutes, isBlocked, pendingNag, markNagShown, remainingMinutes } from '../../services/GuestMeter.js';
import { guestOwnPlans } from '../../services/GuestPlans.js';
import { lastActivity } from './activity.js';

export const TICK_MS = 60 * 1000;

/** A visitor with plans of their own in this window. */
export function counting(state) {
  const p = state.plans;
  return !!state.session && state.session.kind === 'nobody' && !!p && p.status === 'read' && p.source === 'window' && guestOwnPlans(p.list.map((e) => e.plan)).length > 0;
}

/**
 * @param {{ getState, dispatch, subscribe }} store
 * @param {object} o
 * @param {Window} o.win
 * @param {Storage|null} o.local   localStorage (the count, the reminders shown): GuestMeter.js reads and writes it
 * @param {() => number} [o.now]   ms
 */
export function startGuestMeter(store, { win, local = null, now = () => Date.now() }) {
  let stopped = false;
  const dispatch = (a) => { if (!stopped) store.dispatch(a); };
  const visible = () => !win.document || win.document.visibilityState !== 'hidden';

  /** What the count says, without counting. */
  const report = () => {
    const m = local ? readMinutes(local) : 0;
    dispatch({ type: A.GUEST_TICK, minutes: m, usedUp: isBlocked(m) });
  };
  report();

  const minute = () => {
    if (!local || !counting(store.getState())) return;
    const m = tick(local, { now: now(), lastActivity: lastActivity(local), visible: visible() });
    const nag = pendingNag(local, m);
    if (nag) markNagShown(local, nag.level);
    dispatch({ type: A.GUEST_TICK, minutes: m, usedUp: isBlocked(m), ...(nag ? { nag: { level: nag.level, left: remainingMinutes(m) } } : {}) });
  };
  const timer = win.setInterval(minute, TICK_MS);

  // the plans read, or the session known: say what the count is (the stop shows at once when the hours are already used up)
  const off = store.subscribe((state, action) => {
    if (action.type === A.PLANS_SET || action.type === A.SESSION_SET) report();
  });

  return () => { stopped = true; off(); win.clearInterval(timer); };
}
