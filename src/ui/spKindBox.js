/**
 * The full view's "Your State Pension" choice (step F2, lead4.md D2): the same four answers as the simple view's money that
 * comes in anyway (answers/plan/income.js spKind) — the full amount, a forecast, none, or left as assumed — read and written
 * the same way, so "none" is none in both views and a cleared box never leaves a hidden yearly figure running.
 *
 *   spKindOfSettings(s)                 'full' | 'forecast' | 'none' | 'assumed' from the plan's settings (income.js spView's rule)
 *   spKindForSave(kind, weeklyText, s)  the keys a save writes for the choice (income.js incomePatch's keys and values)
 *   FULL_SP_WEEKLY                      the full new State Pension a week (rules.js), what "The full amount" writes
 */
import { RULES } from '../answers/shared/rules.js';

export const FULL_SP_WEEKLY = RULES.fullStatePensionWeekly;
const r2 = (v) => Math.round(v * 100) / 100;
const num = (v) => (v == null || v === '' || !Number.isFinite(+v) ? null : +v);

export function spKindOfSettings(s) {
  const wk = num(s && s.spWeeklyAmount) || 0;
  if (wk > 0) return Math.abs(wk - FULL_SP_WEEKLY) < 0.005 ? 'full' : 'forecast';
  return (num(s && s.statePension) || 0) > 0 ? 'assumed' : 'none';
}

export function spKindForSave(kind, weeklyText, s = {}) {
  if (kind === 'none') return { spWeeklyAmount: 0, statePension: 0 };
  if (kind === 'full') return { spWeeklyAmount: FULL_SP_WEEKLY, statePension: r2(FULL_SP_WEEKLY * 52) };
  const wk = num(weeklyText) || 0;
  if (kind === 'forecast' && wk > 0) return { spWeeklyAmount: wk, statePension: r2(wk * 52) };
  // left as assumed (or a forecast with no figure yet): nothing of the assumption is written as if typed
  return { spWeeklyAmount: wk, statePension: num(s && s.statePension) ?? undefined };
}
