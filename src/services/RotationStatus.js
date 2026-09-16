/**
 * Rotation status (6.12) — what the "Gilt ladder + rotation" watch is doing today, in one line.
 *
 * The strategy's one escape (src/strategies/GiltRotation.js): while world equities are within `trigger`
 * (default 30%) of their all-time high, do nothing; on the first close at or below that, sell every rung
 * whose years all fund ages above `cutAge` (default 75) and buy the equity fund. The trigger DISARMS
 * `rotateDisarmYears` (default 8) before the block starts paying — a late crash has no runway, so it is
 * lived through on the rungs (research/rotation-plan-aug-2026.md §F). Three states, then:
 *   armed     — the plan-year age is at or below the disarm age: watch the market, nothing else to do
 *   disarmed  — past the disarm age with no rotation: the full ladder, held to maturity
 *   fired     — the block was sold (the guided switch records a `borrowedFloor` on the strategy params)
 * A ladder already bought therefore reads "complete — nothing to do" with, at most, this watch.
 *
 * Pure: (plan document, today, age) → status or null. No DOM, no storage.
 */
import { planYearOf } from './PlanTiming.js';

export const ROTATION_DEFAULTS = { cutAge: 75, triggerPct: 0.30, disarmYears: 8 };

const dateGB = (iso) => { const d = new Date(String(iso) + (String(iso).length === 10 ? 'T00:00:00Z' : '')); return Number.isNaN(d.getTime()) ? String(iso) : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }); };

/**
 * @param {object} doc  the plan document (strategy.id, strategy.params, timing, journey, optional rotation record)
 * @param {{ today?: Date, ageToday?: number|null, params?: object|null }} o
 *   `ageToday` — whole-years age today, the FALLBACK for a document without timing: the engine arms by the plan-year
 *   age (shapeAgeNow + plan year), which the document's timing gives exactly, so timing wins when present. `params` —
 *   the LIVE strategy params, when the shell has them: the document is a snapshot at lock time, so a rotation fired
 *   afterwards is only visible on the live settings.
 * @returns {null | { applies: true, cutAge, triggerPct, disarmAge, disarmYears, ageToday, state: 'armed'|'disarmed'|'fired',
 *   firedAt: string|null, yearsArmed: number|null, text }}
 */
export function rotationStatus(doc, { today = new Date(), ageToday = null, params = null } = {}) {
  const d = doc || {};
  if (!d.strategy || d.strategy.id !== 'gilt-rotation') return null;
  const prm = { ...(d.strategy.params || {}), ...(params || {}) };
  const cutAge = +prm.rotateCutAge > 0 ? Math.round(+prm.rotateCutAge) : ROTATION_DEFAULTS.cutAge;
  // The dials store the trigger as a percent (30); accept a fraction (0.30) too and always report a fraction.
  const trigRaw = +prm.rotateTrigger > 0 ? +prm.rotateTrigger : ROTATION_DEFAULTS.triggerPct * 100;
  const triggerPct = trigRaw > 1 ? trigRaw / 100 : trigRaw;
  const disarmYears = +prm.rotateDisarmYears > 0 ? +prm.rotateDisarmYears : ROTATION_DEFAULTS.disarmYears;
  const disarmAge = cutAge - disarmYears;
  // Fired = the guided switch wrote the borrowed floor, or the document/journey records the rotation.
  const bf = prm.borrowedFloor || (d.rotation && d.rotation.borrowedFloor) || null;
  const rec = d.rotation || {};
  const firedAt = (bf && bf.soldAt) || rec.firedAt || rec.soldAt || null;
  const journeyFired = Array.isArray(d.journey) && d.journey.some((j) => j && j.stage === 'rotated');
  const fired = !!(bf || rec.fired === true || firedAt || journeyFired);
  // The engine arms by the PLAN-YEAR age (GiltRotation.js: fires while y <= lastRotateYear = (cutAge − disarm) − startAge,
  // i.e. THROUGH the plan year in which the disarm age is reached). The document's timing gives that age exactly; a
  // whole-years age today is only the fallback for a document without timing. Mirrored exactly: armed while age <= disarmAge.
  let age = null;
  if (+d.timing?.shapeAgeNow > 0 && +d.timing?.firstTaxYear > 0) age = +d.timing.shapeAgeNow + planYearOf(today, +d.timing.firstTaxYear);
  else if (Number.isFinite(+ageToday) && +ageToday > 0) age = Math.floor(+ageToday);
  const state = fired ? 'fired' : (age != null && age > disarmAge) ? 'disarmed' : 'armed';
  const pct = Math.round(triggerPct * 100);
  let text;
  if (state === 'fired') text = 'Rotation fired' + (firedAt ? ' on ' + dateGB(firedAt) : '') + ': the rungs above ' + cutAge + ' were sold and the proceeds bought the equity fund. Income above ' + cutAge + ' now depends on that fund — the borrowed floor is on record on the plan.';
  else if (state === 'disarmed') text = 'Rotation watch disarmed: past age ' + disarmAge + ' the trigger no longer fires, so the rungs above ' + cutAge + ' are held to maturity whatever the market does. The ladder runs as bought — nothing to do.';
  else text = 'Rotation watch armed: if world equities close ' + pct + '% below their all-time high while you are ' + disarmAge + ' or younger, the rungs above ' + cutAge + ' are sold and buy the equity fund. Nothing to do until then.';
  return { applies: true, cutAge, triggerPct, disarmAge, disarmYears, ageToday: age, state, firedAt: firedAt || null, yearsArmed: state === 'armed' && age != null ? disarmAge - age : null, text };
}
