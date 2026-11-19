/**
 * The money a plan holds today (lead4.md D3; step F1): ONE reader each for the pension, the ISA, the general account and
 * cash, given (plan, ctx) — ctx as src/reading/context.js builds it (`now`), with the plan's effective settings when the
 * caller already has them (`settings`). Both views draw these figures through these functions and the one formatter
 * (src/reading/format.js); nothing else sums a pension today.
 *
 *   pensionToday(plan, ctx) → { value, from, asOf }
 *     services/PensionToday.js pensionTodayOf (a check-in, the newest pot record, a drawn plan's newest month or What you
 *     hold, the pot saved with what you pay in, the answer's, the plan's own pension total); nothing known → value 0,
 *     from 'none' (said as £0 in both views, never a default pot)
 *   isaToday(plan, ctx)  → { value, from }   the ISA that came with the pot record or check-in, else the ISA lines under
 *                                            What you hold, else the plan's ISA balance
 *   giaToday(plan, ctx)  → { value, from }   the general-account lines under What you hold, else the plan's taxable start
 *   cashToday(plan, ctx) → { value, from }   the cash lines under What you hold (bank and savings), else 0
 *
 * Pure (the plan's settings are read once, by PlanReading, on ctx.now).
 */
import { pensionTodayOf, isaTodayOf } from '../services/PensionToday.js';
import { settingsForScreen } from '../services/PlanReading.js';
import { wrapperFigure } from '../services/DrawingPot.js';

const isObj = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const num = (v) => (v == null || v === '' || !Number.isFinite(+v) ? null : +v);
const nowOf = (ctx) => (ctx && ctx.now instanceof Date ? ctx.now : new Date());

/** The plan's effective settings on the context's day (the caller's own when it has them). */
export function settingsOf(plan, ctx = {}) {
  return ctx && isObj(ctx.settings) ? ctx.settings : settingsForScreen(plan, { now: nowOf(ctx) });
}

export function pensionToday(plan, ctx = {}) {
  let t = null;
  try { t = pensionTodayOf(plan, { now: nowOf(ctx), settings: settingsOf(plan, ctx), checkIn: ctx && ctx.checkIn ? ctx.checkIn : null }); } catch { t = null; }
  if (!t || t.value == null) return { value: 0, from: 'none', asOf: null, isa: null };
  return { value: Math.max(0, +t.value || 0), from: t.from, asOf: t.asOf || null, isa: t.isa };
}

export function isaToday(plan, ctx = {}) {
  try { return isaTodayOf(plan, { now: nowOf(ctx), settings: settingsOf(plan, ctx), checkIn: ctx && ctx.checkIn ? ctx.checkIn : null }); } catch { return { value: 0, from: 'none' }; }
}

export function giaToday(plan, ctx = {}) {
  // the pension today read as the plan's own figure (a plan drawn from now on, not locked): its general account is the plan's own
  if (pensionToday(plan, ctx).from === 'plan') return { value: Math.max(0, num(settingsOf(plan, ctx).taxableStart) || 0), from: 'plan' };
  const held = wrapperFigure(plan && plan.holdings, 'GIA');
  if (held) return { value: Math.max(0, held.value), from: 'holdings' };
  return { value: Math.max(0, num(settingsOf(plan, ctx).taxableStart) || 0), from: 'plan' };
}

export function cashToday(plan, ctx = {}) {
  const held = wrapperFigure(plan && plan.holdings, 'CASH');
  return held ? { value: Math.max(0, held.value), from: 'holdings' } : { value: 0, from: 'none' };
}
