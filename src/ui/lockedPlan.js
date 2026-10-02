/**
 * What a button says on a locked plan (6.20.2). The save functions refuse any change to a locked plan's settings
 * (services/LockedPlanGuard.js); these two let a button say so plainly — in the same words — and do nothing else.
 *
 *   refusedWhenLocked(win)  before a button that would change settings does anything: on a locked plan, the message
 *                           and true (the button returns); otherwise false. Cannot tell → refuse, as planIsLocked does.
 *   sayIfLocked(e, win)     in a catch: a refusal from the save functions is shown in the same words (true); any other
 *                           error is left to the caller (false).
 */
import { activePlanLocked } from '../storage/ScenarioRepository.js';
import { PLAN_LOCKED_MESSAGE, isPlanLockedError } from '../services/LockedPlanGuard.js';

const say = (win) => { if (win && typeof win.showToast === 'function') win.showToast(PLAN_LOCKED_MESSAGE, 'info', 7000); };

export async function refusedWhenLocked(win = window) {
  let locked;
  try { locked = await activePlanLocked(); } catch (e) { locked = true; }
  if (locked) say(win);
  return locked;
}

export function sayIfLocked(e, win = window) {
  if (!isPlanLockedError(e)) return false;
  say(win);
  return true;
}
