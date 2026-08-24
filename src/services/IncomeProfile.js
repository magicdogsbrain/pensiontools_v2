/**
 * Income Profile — engine-level module (strategy brief §4a): the shape of target income over
 * plan years, in today's money. Every strategy consumes the same profile object.
 *
 * Types:
 *  - { type: 'flat' }                                — constant target (the conservative default)
 *  - { type: 'taper', rate, startYear, years }       — the EXISTING decline exactly as coded:
 *      level for years 0..startYear-1, −rate/yr real for `years` years, then level.
 *  - { type: 'phases', phases: [{ fromYear, amount }] }  — go-go / go-slow / no-go steps:
 *      the phase with the highest fromYear ≤ year wins; `amount` is £/yr today's money
 *      (absolute), so "£60k for 10 years then £36.5k" is two phases. State-pension offset is
 *      applied by the engine as it already does (SP is fixed income inside planDrawdown).
 *  - { type: 'schedule', values: [] }                — explicit per-year £ (the budget hand-off).
 *
 * Back-compat: resolveIncomeProfile maps today's settings 1:1 —
 *   spendingProfile 'flat'      → flat
 *   spendingProfile 'declining' → taper(1%/yr, start 5, 20 years)  [= spendingSmileFactor]
 *   targetSchedule[]            → schedule
 * so wiring the engines through this module later is a pure re-expression, never a behaviour
 * change. Until then it is the canonical definition Phase C strategies consume.
 */

import { SPEND_DECLINE_START_YEAR, SPEND_DECLINE_YEARS, SPEND_DECLINE_RATE, spendingSmileFactor } from './SpendingModel.js';

/** Map today's plan settings onto a canonical profile object. */
export function resolveIncomeProfile(settings = {}) {
  if (Array.isArray(settings.targetSchedule) && settings.targetSchedule.length) {
    return { type: 'schedule', values: settings.targetSchedule.slice() };
  }
  if ((settings.spendingProfile || 'flat') === 'declining') {
    return { type: 'taper', rate: SPEND_DECLINE_RATE, startYear: SPEND_DECLINE_START_YEAR, years: SPEND_DECLINE_YEARS };
  }
  return { type: 'flat' };
}

/**
 * Target income for a plan year, in TODAY'S money.
 * @param {object} profile - canonical profile object
 * @param {number} year - plan year, 0-based
 * @param {number} baseAnnual - the flat/taper anchor (£/yr today's money)
 */
export function profileTargetForYear(profile, year, baseAnnual) {
  if (!profile || profile.type === 'flat') return baseAnnual;
  if (profile.type === 'taper') {
    // Delegates to the shared smile so this module can NEVER drift from the engines.
    return baseAnnual * spendingSmileFactor(year, 'declining');
  }
  if (profile.type === 'schedule') {
    const v = profile.values[year];
    return v != null ? v : baseAnnual;
  }
  if (profile.type === 'phases') {
    const applicable = (profile.phases || [])
      .filter((p) => Number.isFinite(+p.fromYear) && +p.fromYear <= year && Number.isFinite(+p.amount))
      .sort((a, b) => +a.fromYear - +b.fromYear)
      .pop();
    return applicable ? +applicable.amount : baseAnnual;
  }
  return baseAnnual;
}
