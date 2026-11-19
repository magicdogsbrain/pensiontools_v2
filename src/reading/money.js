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
 *   pensionBoxOf(plan, ctx) → null | { value, today, pots }
 *     what the pension box (field pots.pension) holds in both views: a saver's plan not locked shows the pension today (the
 *     line beside the box says the same figure), its pots split in the plan's own shares; nothing known → value null (the
 *     box empty, never a default pot). A plan already drawing shows its own pots, which its runs start from (today: false).
 *     Null for a locked plan (its pots are the lock's) and a plan whose pots a funds list sets (no box is drawn).
 *
 *   isaBoxOf(plan, ctx) → null | { value, today }
 *     what the ISA box (field pots.isa) holds in both views, by the pension box's rule: a saver's plan not locked shows the
 *     ISA today (isaToday: a record, What you hold or the plan's own); a plan already drawing its own ISA (what its runs start
 *     from); null for a locked plan. Its write is the plan's ISA plus PensionToday.isaTodayPatch.
 *
 * Pure (the plan's settings are read once, by PlanReading, on ctx.now).
 */
import { pensionTodayOf, isaTodayOf } from '../services/PensionToday.js';
import { settingsForScreen, potsAs } from '../services/PlanReading.js';
import { sippTodayOf } from '../services/PotsAtRetirement.js';
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

const POT_KEYS = ['equityMin', 'bondMin', 'cashTarget', 'diversifierStart'];
const isLocked = (plan) => !!(plan && plan.decisionTool && isObj(plan.decisionTool.settings) && plan.decisionTool.settings.locked);

export function pensionBoxOf(plan, ctx = {}) {
  if (!plan || isLocked(plan)) return null;
  const ss = settingsOf(plan, ctx);
  if (!isObj(ss) || ss.readFault || ss.allocMode === 'funds') return null;
  const own = Math.round(sippTodayOf(ss));
  const potsOf = (s) => Object.fromEntries(POT_KEYS.map((k) => [k, Math.round(+s[k] || 0)]));
  if (ss.potsNotSet) return { value: null, today: false, pots: null };
  // a plan still saving: its runs grow the pension today to the stop (PotsAtRetirement.potScaleOf), so the box says that figure
  if (ss.retired === false) {
    const t = pensionToday(plan, { ...ctx, settings: ss });
    if (t.from !== 'none') {
      const v = Math.round(t.value);
      return { value: v, today: true, pots: potsOf(v === own ? ss : potsAs(ss, v)) };
    }
  }
  return { value: own, today: false, pots: potsOf(ss) };
}

export function isaBoxOf(plan, ctx = {}) {
  if (!plan || isLocked(plan)) return null;
  const ss = settingsOf(plan, ctx);
  if (!isObj(ss) || ss.readFault) return null;
  if (ss.retired === false) return { value: Math.round(isaToday(plan, { ...ctx, settings: ss }).value), today: true };
  return { value: Math.round(Math.max(0, num(ss.isaBalance) || 0)), today: false };
}
