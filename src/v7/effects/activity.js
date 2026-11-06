/**
 * Activity, for the planner's idle sign-out (research/v7/your-plan.md 4.3). The planner signs everyone out after an hour
 * idle, shared across windows through localStorage['pt_lastActivity'] (index.html ACTIVITY_KEY). V7 records activity
 * under the same key, at most every 10 seconds, on EVERY V7 page — so an idle planner window cannot sign out someone
 * reading the preview. This is the one thing V7 writes to local storage besides the plan seed (tests/v7/boundaries.test.js).
 *
 *   ACTIVITY_KEY                    'pt_lastActivity'
 *   IDLE_MS                         an hour, the planner's INACTIVITY_TIMEOUT
 *   lastActivity(storage)           the time any window last recorded, in ms (0 when none)
 *   recordActivity(storage, nowMs)  writes it (throttled by the caller)
 *   startActivity(win, { storage, now }) → stop()   listens for a person's activity and records it
 */
export const ACTIVITY_KEY = 'pt_lastActivity';
export const IDLE_MS = 60 * 60 * 1000;
export const THROTTLE_MS = 10 * 1000;
const EVENTS = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click'];

export function lastActivity(storage) {
  try { return +storage.getItem(ACTIVITY_KEY) || 0; } catch { return 0; }
}

export function recordActivity(storage, nowMs) {
  try { storage.setItem(ACTIVITY_KEY, String(nowMs)); return true; } catch { return false; }
}

export function startActivity(win, { storage, now = () => Date.now() } = {}) {
  if (!storage) return () => {};
  let last = 0;
  const on = () => { const t = now(); if (!last || t - last > THROTTLE_MS) { last = t; recordActivity(storage, t); } };
  for (const e of EVENTS) win.addEventListener(e, on, { passive: true });
  on();
  return () => { for (const e of EVENTS) win.removeEventListener(e, on); };
}
