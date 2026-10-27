/**
 * The shell's own boxes (research/v7/road-to-7.md step 11), drawn on any page from the state: the visitor's reminder (a
 * line for the gentle ones, a box with buttons for the firm ones), the stop when the three free hours are used up (on every
 * page but the account page, which is the way out), "Bring in what you built without an account?" after a sign-in, and the
 * once-only "What's new" pop-up. Each is a region of the page, never a browser dialog; each dispatches and draws only.
 *
 *   <GuestNag nag dispatch />          ui.guest.nag: { level, left }
 *   <GuestStop />                      the stop
 *   <BringIn offer dispatch />         ui.bringIn: { count, busy } with the problem, if any
 *   <NewsPopup entries dispatch />     ui.news.popup
 */
import { Button, LinkButton } from './Button.jsx';
import { Release } from './ReleaseNotes.jsx';
import { fill } from './PlanFigures.jsx';
import { href } from '../router/routes.js';
import { GUEST } from '../copy/guest.js';
import { NEWS } from '../copy/news.js';

const keepFocus = { onMouseDown: (e) => e.preventDefault() };

/** "2.2 hours" or "30 minutes", as GuestMeter.js says it. */
export const leftWords = (minutes) => (minutes >= 60 ? fill(GUEST.leftHours, { n: Math.round(minutes / 60 * 10) / 10 }) : fill(GUEST.leftMinutes, { n: Math.round(minutes) }));
/** "12 min" or "1.5 h" used, as the planner's banner says it. */
export const usedWords = (minutes) => { const used = Math.round(minutes); return used < 60 ? fill(GUEST.usedMinutes, { n: used }) : fill(GUEST.usedHours, { n: Math.round(used / 6) / 10 }); };

export function GuestNag({ nag, dispatch }) {
  if (!nag) return null;
  const text = fill(GUEST.reminders[nag.level] || GUEST.reminders[4], { left: leftWords(nag.left) });
  const close = () => dispatch({ type: 'guest/nagClose' });
  if (nag.level < 3) {
    return (
      <div class="shell-toast" role="status" data-testid="guest.reminder" data-level={nag.level}>
        <span class="shell-toast-message">{text}</span>
        <Button testid="guest.reminder.gotIt" kind="quiet" onClick={close} {...keepFocus}>{GUEST.remind.gotIt}</Button>
      </div>
    );
  }
  return (
    <div class="shell-overlay" data-testid="guest.remindBox" data-level={nag.level}>
      <div class="shell-box" role="region" aria-label={GUEST.remind.title}>
        <h2>{GUEST.remind.title}</h2>
        <p>{text}</p>
        <p class="note">{GUEST.remind.line}</p>
        <div class="actions-row">
          <LinkButton testid="guest.remind.signUp" kind="primary" href={href.account()}>{GUEST.remind.signUp}</LinkButton>
          <LinkButton testid="guest.remind.signIn" href={href.account()}>{GUEST.remind.signIn}</LinkButton>
          <Button testid="guest.remind.notYet" kind="quiet" onClick={close} {...keepFocus}>{GUEST.remind.notYet}</Button>
        </div>
      </div>
    </div>
  );
}

export function GuestStop() {
  return (
    <div class="shell-overlay" data-testid="guest.stop">
      <div class="shell-box" role="region" aria-label={GUEST.stop.title}>
        <h2>{GUEST.stop.title}</h2>
        <p>{GUEST.stop.line}</p>
        <div class="actions-row">
          <LinkButton testid="guest.stop.signIn" kind="primary" href={href.account()}>{GUEST.stop.signIn}</LinkButton>
        </div>
        <p class="note"><a href={href.front()} data-testid="guest.stop.ask">{GUEST.stop.ask}</a></p>
      </div>
    </div>
  );
}

export function BringIn({ offer, problem, dispatch }) {
  if (!offer) return null;
  const one = offer.count === 1;
  return (
    <div class="shell-overlay" data-testid="guest.bringIn">
      <div class="shell-box" role="region" aria-label={GUEST.bringIn.title}>
        <h2>{GUEST.bringIn.title}</h2>
        <p>{one ? GUEST.bringIn.one : fill(GUEST.bringIn.many, { n: offer.count })}</p>
        {offer.busy && <p class="note" role="status" data-testid="guest.bringIn.working">{GUEST.bringIn.working}</p>}
        {!offer.busy && problem && <p class="notice" role="alert" data-testid="guest.bringIn.problem">{GUEST.bringIn.failed}</p>}
        {!offer.busy && (
          <div class="actions-row">
            <Button testid="guest.bringIn.yes" kind="primary" onClick={() => dispatch({ type: 'guest/bringIn' })} {...keepFocus}>{one ? GUEST.bringIn.yesOne : GUEST.bringIn.yesMany}</Button>
            <Button testid="guest.bringIn.no" kind="quiet" onClick={() => dispatch({ type: 'guest/offerClose' })} {...keepFocus}>{GUEST.bringIn.no}</Button>
          </div>
        )}
        <p class="note">{GUEST.bringIn.noNote}</p>
      </div>
    </div>
  );
}

export function NewsPopup({ entries, dispatch }) {
  if (!entries || !entries.length) return null;
  const head = entries.length === 1 ? fill(NEWS.popupOne, { version: entries[0].version }) : fill(NEWS.popupMany, { from: entries[entries.length - 1].version, to: entries[0].version });
  const dismiss = () => dispatch({ type: 'news/dismiss' });
  return (
    <div class="shell-overlay" data-testid="news.popup">
      <div class="shell-box shell-box-wide" role="region" aria-label={NEWS.title}>
        <h2>{head}</h2>
        <div class="rn-popup">
          {entries.map((r, i) => <Release key={r.version} r={r} words={NEWS} open={i === 0} level={3} />)}
        </div>
        <div class="actions-row">
          <Button testid="news.gotIt" kind="primary" onClick={dismiss} {...keepFocus}>{NEWS.gotIt}</Button>
          <LinkButton testid="news.seeAll" kind="quiet" href={href.news()} onClick={dismiss}>{NEWS.seeAll}</LinkButton>
        </div>
      </div>
    </div>
  );
}
