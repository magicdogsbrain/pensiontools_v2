/**
 * Guest-mode trial meter. Guest mode is a try-before-you-sign-in: everything works, nothing leaves
 * the browser. It is not meant to be a permanent way to use the app — only signed-in users can be
 * supported, and only they get their work kept. So guest use is metered (active minutes, across
 * tabs and days, in this browser), nudged at a few milestones, and stopped after an allowance —
 * always with the offer to sign in and take the guest work along (see handoffPayload).
 *
 * Pure logic: storage is injected so it is testable. index.html owns the timer and the UI.
 */
export const GUEST_ALLOWANCE_MINUTES = 180;          // 3 hours of active use, then sign in to continue
export const GUEST_NAG_MINUTES = [15, 45, 90, 150];  // gentle → firmer reminders on the way
export const GUEST_ACTIVE_WINDOW_MS = 2 * 60 * 1000; // a minute counts if there was activity in the last 2 min
export const KEY_MINUTES = 'pt_guest_minutes';
export const KEY_NAG = 'pt_guest_nag_level';
export const KEY_HANDOFF = 'pt_guest_handoff';

const num = (v) => { const n = parseFloat(v); return Number.isFinite(n) && n > 0 ? n : 0; };
const safeGet = (storage, k) => { try { return storage.getItem(k); } catch (e) { return null; } };
const safeSet = (storage, k, v) => { try { storage.setItem(k, String(v)); } catch (e) { /* private mode */ } };

export function readMinutes(storage) { return num(safeGet(storage, KEY_MINUTES)); }
export function readNagLevel(storage) { return Math.floor(num(safeGet(storage, KEY_NAG))); }

/**
 * Called once a minute by the page. Counts the minute only when the tab is visible and the person
 * was active recently — a tab left open overnight must not burn the allowance.
 * @returns {number} minutes used after this tick
 */
export function tick(storage, { now, lastActivity, visible }) {
  let m = readMinutes(storage);
  if (visible && now - (lastActivity || 0) <= GUEST_ACTIVE_WINDOW_MS) { m += 1; safeSet(storage, KEY_MINUTES, m); }
  return m;
}

/** The highest nag milestone reached (1-based), 0 when none. */
export function nagLevelFor(minutes) { let lvl = 0; for (const t of GUEST_NAG_MINUTES) if (minutes >= t) lvl++; return lvl; }
export function isBlocked(minutes) { return minutes >= GUEST_ALLOWANCE_MINUTES; }
export function remainingMinutes(minutes) { return Math.max(0, GUEST_ALLOWANCE_MINUTES - minutes); }

/** A nag not yet shown at this level → { level, message, firm } ; null when nothing new to say. */
export function pendingNag(storage, minutes) {
  const lvl = nagLevelFor(minutes), shown = readNagLevel(storage);
  if (lvl <= shown) return null;
  const left = remainingMinutes(minutes);
  const hrs = (v) => (v >= 60 ? Math.round(v / 60 * 10) / 10 + ' hours' : v + ' minutes');
  const messages = [
    'You have been trying things for a quarter of an hour. Nothing here is saved — when you are ready, sign in and it comes with you.',
    'Guest mode keeps nothing. You have ' + hrs(left) + ' of guest time left; sign in now and everything you have built is kept.',
    'Sign in soon: ' + hrs(left) + ' of guest time left. Your plan, budget and settings will be copied into your account when you do.',
    'Last reminder before guest mode stops: ' + hrs(left) + ' left. Sign in and keep your work.'
  ];
  return { level: lvl, message: messages[Math.min(lvl, messages.length) - 1], firm: lvl >= 3 };
}
export function markNagShown(storage, level) { safeSet(storage, KEY_NAG, level); }

/** What the guest banner says. */
export function bannerText(minutes) {
  const left = remainingMinutes(minutes);
  if (left <= 0) return 'Your guest time is used up — sign in to continue; your work comes with you.';
  const used = Math.round(minutes);
  return 'Guest mode — nothing is saved. ' + (used < 60 ? used + ' min' : (Math.round(used / 6) / 10) + ' h') + ' of your ' + (GUEST_ALLOWANCE_MINUTES / 60) + ' free hours used. Sign in and everything you have done is kept.';
}

/**
 * The guest's plans, packaged for the hand-off into an account: ids and the active flag are dropped
 * (Firestore assigns new ids; the app decides what is active), names are marked so the person can
 * tell them apart from plans they make afterwards.
 */
export function handoffPayload(scenarios, stashedAt = new Date().toISOString()) {
  const list = (Array.isArray(scenarios) ? scenarios : []).filter((s) => s && typeof s === 'object').map((s) => {
    const { id, isActive, createdAt, lastModified, ...rest } = s;
    const name = (rest.planDetails && rest.planDetails.name) || rest.name || 'Guest plan';
    return { ...rest, planDetails: { ...(rest.planDetails || {}), name: /\(from guest\)$/.test(name) ? name : name + ' (from guest)' } };
  });
  return { stashedAt, scenarios: list };
}
export function stashHandoff(storage, scenarios) { const p = handoffPayload(scenarios); if (!p.scenarios.length) return null; safeSet(storage, KEY_HANDOFF, JSON.stringify(p)); return p; }
export function readHandoff(storage) { try { const p = JSON.parse(safeGet(storage, KEY_HANDOFF) || 'null'); return p && Array.isArray(p.scenarios) && p.scenarios.length ? p : null; } catch (e) { return null; } }
export function clearHandoff(storage) { try { storage.removeItem(KEY_HANDOFF); } catch (e) { /* ignore */ } }
