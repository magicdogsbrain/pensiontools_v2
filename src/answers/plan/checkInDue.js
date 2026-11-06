/**
 * When a saver's check-in is due, and what the last one said (research/saving-enough-and-check-in.md 4.2, 5.2; release
 * step R3) — the part of the check-in the rail, the next sentence and the plans list read. Kept apart from checkIn.js
 * (the screen and the write, which reach the saving-years engine through the path and question B's inputs), so the plan
 * page's readers stay as light as they were. Reads only what is stored: never a run.
 *
 *   CADENCE_MONTHS                          how often, in months
 *   addMonths('YYYY-MM', n)                 a month n months on
 *   checkInsOf(plan)                        the check-ins, valid ones only, newest last
 *   cadenceOf(plan, stageKey)               { every, chosen, legacy }
 *   checkInDueOf(plan, { today, stageKey }) { every, chosen, legacy, last, next, due }
 *   checkInState(plan, { today, stageKey }) the due, the count and the last check-in's stored band
 *
 * Pure: no clock (the day arrives as `today`), no storage.
 */
import { saverPotOf } from '../../services/SaverReading.js';
import { CADENCES } from './schema.js';
import { dateOf, ym, localMonth } from './dates.js';

const isObj = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const isNum = (v) => typeof v === 'number' && Number.isFinite(v);
const accOf = (plan) => (plan && isObj(plan.accumulationTool) ? plan.accumulationTool : {});
const keyOf = (p) => p.y + '-' + String(p.m).padStart(2, '0');
const monthOfDate = (d) => String(d || '').slice(0, 7);

/** How often, in months (5.2). */
export const CADENCE_MONTHS = Object.freeze({ year: 12, quarter: 3, month: 1 });
/** 'YYYY-MM' plus n months. */
export function addMonths(month, n) {
  const p = ym(month);
  if (!p) return null;
  const t = p.y * 12 + (p.m - 1) + n;
  return keyOf({ y: Math.floor(t / 12), m: (t % 12) + 1 });
}
/** The check-ins as stored, valid ones only (a date and a pension figure), newest last. */
export function checkInsOf(plan) {
  const list = accOf(plan).checkIns;
  return Array.isArray(list) ? list.filter((c) => isObj(c) && /^\d{4}-\d{2}-\d{2}$/.test(String(c.date)) && isObj(c.pot) && isNum(c.pot.pension)).slice().sort((a, b) => String(a.date).localeCompare(String(b.date))) : [];
}

/**
 * How often (5.2). Chosen: the plan's own word. Not chosen: a plan locked while saving keeps the monthly pot step it has
 * always had (`legacy`, read as monthly from its pot records, needing no check-in to fall due); any other saver is not
 * reminded until they choose.
 */
export function cadenceOf(plan, stageKey) {
  const e = accOf(plan).checkInEvery;
  if (CADENCES.includes(e)) return { every: e, chosen: true, legacy: false };
  if (stageKey === 'committed-saving') return { every: 'month', chosen: false, legacy: true };
  return { every: null, chosen: false, legacy: false };
}

/**
 * When the next check-in is due (5.2), by month. Chosen: due once this month is at least the last check-in's month plus
 * 12, 3 or 1 — never before the first check-in (choosing is part of the first). The plan locked while saving that never
 * chose: due while this month's pot is not recorded, exactly as the pot step has always been.
 */
export function checkInDueOf(plan, { today, stageKey }) {
  const now = dateOf(today);
  const mon = localMonth(now);
  const c = cadenceOf(plan, stageKey);
  if (c.chosen) {
    const list = checkInsOf(plan);
    const last = list.length ? monthOfDate(list[list.length - 1].date) : null;
    const next = last ? addMonths(last, CADENCE_MONTHS[c.every]) : null;
    return { ...c, last, next, due: !!next && mon >= next };
  }
  if (c.legacy) {
    const hist = Array.isArray(accOf(plan).history) ? accOf(plan).history : [];
    const pot = saverPotOf({ accHistory: hist, today: now });
    const recorded = pot.source === 'record' && String(pot.at) >= mon;
    return { ...c, last: pot.source === 'record' ? pot.at : null, next: recorded ? addMonths(mon, 1) : mon, due: !recorded };
  }
  return { ...c, last: null, next: null, due: false };
}

/** What the rail and the next sentence read (4.2): the due, and the last check-in's stored band — never a run. */
export function checkInState(plan, { today, stageKey }) {
  const d = checkInDueOf(plan, { today, stageKey });
  const list = checkInsOf(plan);
  const last = list.length ? list[list.length - 1] : null;
  const band = last && isObj(last.reading) && ['yes', 'close', 'no'].includes(last.reading.band) ? last.reading.band : null;
  return { ...d, count: list.length, lastCheckIn: last ? { month: monthOfDate(last.date), band } : null };
}

