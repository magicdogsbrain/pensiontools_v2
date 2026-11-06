/**
 * Places a person comes back to (7.1.0; research/v7/after-7.md J2). Pure: data in, data out; no figure is ever part of one.
 *
 *   A place is { planId, step }: one saved plan and one of its steps (step null: the plan's own first step). It is where a
 *   signed-in person was last (land where you left off), kept in the window and in the account's settings document.
 *
 *   A way back after signing in (ui.returnTo, from "Keep this as a plan"):
 *     { planId, step, kept: true }   the plan just kept in this window: after the sign-in it is brought into the account, and
 *                                    the person is on it (by the id the account gave it) at that step;
 *     { q, step }                    an answer not kept yet: after the sign-in the person is back on it, to keep it there.
 *
 *   cleanPlace(v)          a place, or null when it is not one
 *   cleanBack(v)           a way back, or null when it is not one
 *   placeHref(place)       the address of a place
 *   backHref(back, newId)  the address of a way back (newId: the id the account gave a plan kept in the window)
 */
import { PLAN_ID, PLAN_STEPS, PLAN_SUB_STEPS, href } from '../router/routes.js';
import { BUILT } from '../rail/questions.js';

const stepOk = (s) => s === null || PLAN_STEPS.includes(s) || PLAN_SUB_STEPS.includes(s);

export function cleanPlace(v) {
  if (!v || typeof v !== 'object' || Array.isArray(v)) return null;
  if (typeof v.planId !== 'string' || !PLAN_ID.test(v.planId)) return null;
  const step = v.step === undefined || v.step === '' ? null : v.step;
  if (!stepOk(step)) return null;
  return { planId: v.planId, step };
}

export function cleanBack(v) {
  if (!v || typeof v !== 'object' || Array.isArray(v)) return null;
  if (v.kept === true) {
    const p = cleanPlace(v);
    return p ? { ...p, kept: true } : null;
  }
  if (typeof v.q === 'string' && BUILT[v.q] && typeof v.step === 'string' && BUILT[v.q].steps.some((s) => s.id === v.step)) return { q: v.q, step: v.step };
  return null;
}

export const placeHref = (place) => href.plan(place.planId, place.step || null);

export function backHref(back, newId = null) {
  if (!back) return null;
  if (back.kept) return newId && PLAN_ID.test(newId) ? href.plan(newId, back.step || null) : href.plans();
  return href.step(back.q, back.step);
}
