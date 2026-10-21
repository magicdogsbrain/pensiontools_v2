/**
 * The planner's side of the hand-over from the preview (research/v7/your-plan.md 5.4): "Change this" on a plan page of
 * /v7/ leaves a request in this window (src/services/OpenPlace.js); this module reads and deletes it at start-up and, at
 * the FIRST showMainApp of the page's life, opens that plan in this window only, presses the page's own button (so its
 * loader runs and every box fills), scrolls to the section, and shows one line at the top with the way back.
 *
 *   startOpenPlace(win) → { atMainApp(initialTab, showStrategyPage), showing() }
 *
 *   - At start-up: the request is read and deleted. A good one that names a plan pins that plan in this window
 *     (ScenarioRepository.pinPlanInWindow) BEFORE anything is loaded, so every read of "which plan is open" already
 *     answers it; nothing is written to any plan. A request for the sign-in screen stashes the window's plans made
 *     without an account, so that signing in goes through "keep this work" and carries them into the account.
 *   - The old one-shot `pt_open_tab` (the demo link's: open this tab after a reload) is read here too, so the inline
 *     script carries one call in place of its line.
 *   - atMainApp: called once from showMainApp. Returns the tab showMainApp should open; after showMainApp has drawn,
 *     presses the real tab and sub-page buttons (their click handlers are the loaders), scrolls to the section, and adds
 *     the line. If the plan is not in this account or window, the line says so and nothing else happens.
 *   - showing(): true while the line is on screen — the release pop-up waits (index.html maybeAnnounceRelease).
 *
 * The markup of index.html is untouched: the line is a new element, built with DOM calls.
 */
import { OPEN_PLACE_KEY, PLACES, SUB_ATTR, readRequest, OPEN_PLACE_WORDS as W } from '../../services/OpenPlace.js';
import { stashHandoff } from '../../services/GuestMeter.js';
import { listScenariosAsync, getActiveScenarioId, pinPlanInWindow } from '../../storage/ScenarioRepository.js';
import { guestSnapshot } from '../../firebase/FirestoreService.js';
import { storageOf } from './NewPlanFromSeed.js';

export const NOTE_ID = 'openPlaceNote';
export const OLD_TAB_KEY = 'pt_open_tab';
/** The preview's address, from the planner's page. */
export const PREVIEW_PATH = 'v7/';

/** Read and delete the request (and the old tab key) from this window's session storage. */
export function takeRequest(session, nowMs) {
  if (!session) return { request: null, oldTab: null };
  let text = null, oldTab = null;
  try { text = session.getItem(OPEN_PLACE_KEY); if (text !== null) session.removeItem(OPEN_PLACE_KEY); } catch (e) { text = null; }
  try { oldTab = session.getItem(OLD_TAB_KEY); if (oldTab !== null) session.removeItem(OLD_TAB_KEY); } catch (e) { oldTab = null; }
  const r = readRequest(text, nowMs);
  return { request: r.ok ? r.request : null, oldTab: oldTab || null };
}

function el(doc, tag, props = {}, text = null) {
  const e = doc.createElement(tag);
  for (const [k, v] of Object.entries(props)) e.setAttribute(k, v);
  if (text != null) e.textContent = text;
  return e;
}

/** The line at the top of the planner: "Opened from the preview. [Back to ‘…’]", with the window-only sentence when it applies. */
export function noteElement(doc, { lead, back, backLabel, extra = null }) {
  const box = el(doc, 'div', { id: NOTE_ID, role: 'status', style: 'margin:8px 0 10px;padding:10px 14px;border:1px solid var(--accent);border-radius:10px;background:rgba(99,102,241,.08);font-size:13px;' });
  box.appendChild(el(doc, 'span', {}, lead + ' '));
  box.appendChild(el(doc, 'a', { href: back, style: 'color:inherit;text-decoration:underline;font-weight:600;' }, backLabel));
  if (extra) { box.appendChild(doc.createTextNode(' ')); box.appendChild(el(doc, 'span', {}, extra)); }
  return box;
}

/**
 * @param {Window} [win]
 * @returns {{ atMainApp: (initialTab: string|null, showStrategyPage?: Function) => string|null, showing: () => boolean, request: object|null }}
 */
export function startOpenPlace(win = window) {
  const doc = win.document;
  const session = storageOf(win, 'sessionStorage');
  const { request, oldTab } = takeRequest(session, Date.now());
  let acted = false;
  if (request && request.planId) pinPlanInWindow(request.planId);
  if (request && request.place === 'signin') {
    // Plans kept in this window without an account go through "keep this work" when the person signs in (5.3).
    try { const local = storageOf(win, 'localStorage'); const plans = guestSnapshot(); if (local && plans.length) stashHandoff(local, plans); } catch (e) { /* nothing to keep */ }
  }

  const showing = () => !!doc.getElementById(NOTE_ID);
  const backHref = (back) => PREVIEW_PATH + back;

  function addNote(parts) {
    const main = doc.getElementById('mainApp');
    if (!main) return;
    const old = doc.getElementById(NOTE_ID); if (old) old.remove();
    main.insertBefore(noteElement(doc, parts), main.firstChild);
  }

  /** The hand-over's steps, after showMainApp has drawn: the plan check, the tab, the sub-page, the section, the line. */
  async function apply(showStrategyPage) {
    const r = request;
    const place = PLACES[r.place];
    let plans = [];
    try { plans = await listScenariosAsync(); } catch (e) { plans = []; }
    if (r.place === 'signin') {
      addNote({ lead: W.signedIn, back: backHref(r.back), backLabel: W.backToPlans });
      return;
    }
    const mine = plans.find((p) => p.id === r.planId) || null;
    let openId = null; try { openId = await getActiveScenarioId(); } catch (e) { openId = null; }
    if (!mine || openId !== r.planId) {
      pinPlanInWindow(null);
      addNote({ lead: W.notHere, back: backHref(r.back), backLabel: W.back });
      return;
    }
    const name = (mine.planDetails && mine.planDetails.name) || mine.name || '';
    const accountOpen = plans.find((p) => p.isActive) || null;
    const extra = accountOpen && accountOpen.id !== mine.id
      ? W.thisWindow.replace('{name}', name).replace('{other}', (accountOpen.planDetails && accountOpen.planDetails.name) || accountOpen.name || '')
      : null;
    // The page is hidden for this plan (its tools, or its stage): say so instead of opening it.
    const tab = place.tab && doc.querySelector('.tab[data-tab="' + place.tab + '"]');
    const switchedOff = place.needs && Array.isArray(mine.enabledTools) && !mine.enabledTools.includes(place.needs);
    if (tab && !switchedOff && tab.style.display !== 'none') {
      tab.click();                                                     // the tab's click handler runs its loader
      if (place.sub && SUB_ATTR[place.tab]) {
        const sub = doc.querySelector('.sub-tab[' + SUB_ATTR[place.tab] + '="' + place.sub + '"]');
        if (sub) sub.click();                                          // the sub-page's handler loads its boxes
      }
      if (place.section) {
        win.setTimeout(() => {
          const s = doc.getElementById(place.section);
          if (s && typeof s.scrollIntoView === 'function') s.scrollIntoView({ block: 'start', behavior: 'smooth' });
        }, 400);
      }
    }
    addNote({ lead: W.opened, back: backHref(r.back), backLabel: W.back + ' (‘' + name + '’)', extra });
    // a place may name the strategy page to open (the rotation watch's switch, 6.43.0); the overview otherwise
    if (showStrategyPage && place.tab === 'strategies') win.setTimeout(() => { try { showStrategyPage(place.page || 'overview'); } catch (e) { /* optional */ } }, 400);
  }

  /**
   * From showMainApp, once. Returns the tab showMainApp should open: the request's tab, else the old one-shot key's.
   * The hand-over's own steps run after showMainApp has drawn (a task later), and only on the page's first showMainApp.
   */
  function atMainApp(initialTab, showStrategyPage = null) {
    let tab = initialTab;
    if (oldTab && !acted) {
      tab = oldTab;
      if (oldTab === 'strategies' && showStrategyPage) win.setTimeout(() => { try { showStrategyPage('overview'); } catch (e) { /* optional */ } }, 400);
    }
    if (request && !acted) {
      const place = PLACES[request.place];
      if (place && place.tab) tab = place.tab;
      win.setTimeout(() => { apply(showStrategyPage).catch(() => {}); }, 0);
    }
    acted = true;
    return tab;
  }

  return { atMainApp, showing, request };
}
