/**
 * What the household check starts from (7.12.0): each plan's pension and ISA at the start of its own plan, as the one test
 * runs it (services/PlanNeed.js planNeedOf: the pots at the stop for a plan still saving, worked out on read), and their
 * sum. Both views say it beside the verdict, so a change of stop age shows where it moves the check. Pure.
 *
 *   startPotsOf(settings, now)                    → { amount, pension, isa, startAge }
 *   householdStartsOf(setA, setB, names, offsets, now) → { total, a: { name, amount, age, later }, b: {…} }
 *   startsSlotsOf(starts)                         → the sentence's slots (both views mark its figures from these)
 *   startsWords(starts)                           → the sentence, in src/v7/copy/household.js's words
 */
import { simulationConfigFromSettings } from './SimulationConfig.js';
import { planNeedOf } from './PlanNeed.js';
import { HOUSEHOLD } from '../v7/copy/household.js';

const pounds = (v) => '£' + Math.round(+v || 0).toLocaleString('en-GB');
const fill = (t, s) => String(t).replace(/\{(\w+)\}/g, (m, k) => (s[k] != null ? String(s[k]) : m));

export function startPotsOf(settings, now = new Date()) {
  const s = settings || {};
  const cfg = simulationConfigFromSettings({}, s, now);
  const n = planNeedOf(s, cfg, { startAge: +s.shapeAgeNow || 57, now });
  const pension = Math.max(0, +n.pot || 0), isa = Math.max(0, +n.isa || 0);
  return { amount: pension + isa, pension, isa, startAge: n.startAge != null ? +n.startAge : null };
}

export function householdStartsOf(setA, setB, names = {}, offsets = {}, now = new Date()) {
  const side = (st, name, off) => { const p = startPotsOf(st, now); return { name, amount: Math.round(p.amount), age: p.startAge, later: +off > 0 }; };
  const a = side(setA, names.a || 'You', offsets.a), b = side(setB, names.b || 'Partner', offsets.b);
  return { total: a.amount + b.amount, a, b };
}

/** The sentence's slots (both views fill HOUSEHOLD.verdict.starts.line with them, the figures marked; step F6), or null. */
export function startsSlotsOf(starts) {
  if (!starts || !starts.a || !starts.b) return null;
  const W = HOUSEHOLD.verdict.starts;
  const when = (x) => (x.later && x.age != null ? fill(W.later, { name: x.name, age: x.age }) : W.now);
  return { total: pounds(starts.total), a: starts.a.name, potA: pounds(starts.a.amount), whenA: when(starts.a), b: starts.b.name, potB: pounds(starts.b.amount), whenB: when(starts.b) };
}

export function startsWords(starts) {
  const slots = startsSlotsOf(starts);
  return slots ? fill(HOUSEHOLD.verdict.starts.line, slots) : '';
}
