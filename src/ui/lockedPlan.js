/**
 * What a button says on a locked plan (6.20.2), or on the read-only example plan (6.23.0). The save functions refuse
 * any change to a locked plan's settings (services/LockedPlanGuard.js) and the guest store refuses every change to the
 * example (services/GuestPlans.js); these two let a button say so plainly — in the same words — and do nothing else.
 *
 *   refusedWhenLocked(win)  before a button that would change the plan does anything: on the example plan or a locked
 *                           plan, the message and true (the button returns); otherwise false. Cannot tell → refuse,
 *                           as planIsLocked does.
 *   sayIfLocked(e, win)     in a catch: a refusal from the save functions or the store is shown in the same words
 *                           (true); any other error is left to the caller (false).
 */
import { activePlanLocked, activePlanIsExample } from '../storage/ScenarioRepository.js';
import { PLAN_LOCKED_MESSAGE, isPlanLockedError } from '../services/LockedPlanGuard.js';
import { EXAMPLE_PLAN_MESSAGE, isExamplePlanError } from '../services/GuestPlans.js';

const say = (win, message) => { if (win && typeof win.showToast === 'function') win.showToast(message, 'info', 7000); };

export async function refusedWhenLocked(win = window) {
  let example = false;
  try { example = await activePlanIsExample(); } catch (e) { example = false; }
  if (example) { say(win, EXAMPLE_PLAN_MESSAGE); return true; }
  let locked;
  try { locked = await activePlanLocked(); } catch (e) { locked = true; }
  if (locked) say(win, PLAN_LOCKED_MESSAGE);
  return locked;
}

export function sayIfLocked(e, win = window) {
  if (isExamplePlanError(e)) { say(win, EXAMPLE_PLAN_MESSAGE); return true; }
  if (!isPlanLockedError(e)) return false;
  say(win, PLAN_LOCKED_MESSAGE);
  return true;
}
