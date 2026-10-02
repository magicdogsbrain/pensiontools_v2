/**
 * A plan's pots at retirement, as the runs start from them (moved out of services/PlanTiming.js in the review of 6.22.0, and
 * re-exported there by name): today's SIPP-side pot, the scale that turns today's pots into the Timing block's pots at
 * retirement, and the ISA a run starts from. A light module — it imports nothing heavier than IsaGrowth.js — so the Drawdown
 * table (DrawdownService) and the household checks (HouseholdService) can read the same ISA without the engines.
 *
 * Pure: no DOM, no storage, no clock.
 */
import { isaGrowthOf } from './IsaGrowth.js';

/** Today's SIPP-side pot as the settings describe it (the allocation pots + diversifiers). */
export function sippTodayOf(settings) {
  const s = settings || {};
  return (+s.equityMin || 0) + (+s.bondMin || 0) + (+s.cashTarget || 0) + (+s.diversifierStart || 0);
}

/**
 * Scale factors that turn today's pots into the pots at retirement (future mode only). Read from the
 * saved `potAtRetirement` — the UI writes the projection (or the user's override) there at save time,
 * so the engines never need the Accumulation inputs. 1 when nothing is set.
 */
export function potScaleOf(settings) {
  const s = settings || {};
  const p = s.potAtRetirement;
  const out = { sipp: 1, isa: 1 };
  if (!p || s.retired !== false) return out;
  const sippToday = sippTodayOf(s), isaToday = +s.isaBalance || 0;
  if (+p.sipp > 0 && sippToday > 0) out.sipp = +p.sipp / sippToday;
  if (+p.isa > 0 && isaToday > 0) out.isa = +p.isa / isaToday;
  return out;
}

/**
 * The ISA a plan's runs start from (review of 6.22.0). Retiring later, today's ISA is scaled to the Timing block's ISA at
 * retirement (potScaleOf) — but a scale cannot lift £0: someone with no ISA today and money going into one (the Accumulation
 * planner's "Into ISAs and savings", 6.22.0), or an ISA at retirement typed in the boxes, had every run start with no ISA
 * while the Timing block and the age spin counted it. With no ISA today, the ISA at retirement is now that figure itself.
 * Only on a plan with the ISA choice (services/IsaGrowth.js): a plan locked before it keeps its figures. Already retired,
 * or no ISA at retirement: today's ISA as before.
 * `isaToday` defaults to the settings' ISA; planFromSettings passes a pinned "ISA total" (strategyParams.isaTotal).
 * @returns {number} £, today's money
 */
export function isaAtRetirementOf(settings, isaToday = settings ? settings.isaBalance : 0) {
  const s = settings || {};
  const today = +isaToday || 0;
  if (today !== 0 || !isaGrowthOf(s)) return today * potScaleOf(s).isa;
  const p = s.potAtRetirement;
  return s.retired === false && p && +p.isa > 0 && !((+s.isaBalance || 0) > 0) ? +p.isa : 0;
}

/**
 * For the readers that work from today's ISA as the ISA a plan starts with (the Stress tester's Drawdown table, the couples'
 * allowance nudge): today's ISA as it always was, or — with none today — the ISA at retirement the runs start from
 * (isaAtRetirementOf). A plan made from a V7 answer with no savings today carried its savings at the stop as today's ISA
 * until the review of 6.22.0; these readers keep seeing that figure.
 */
export function isaTodayOrAtRetirement(settings) {
  const s = settings || {};
  return (+s.isaBalance || 0) !== 0 ? s.isaBalance : isaAtRetirementOf(s);
}
