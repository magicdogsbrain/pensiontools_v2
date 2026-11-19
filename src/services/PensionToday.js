/**
 * One reader for the pension today (7.12.0). Every screen that names "your pension today" reads it here, so no two of them
 * can disagree. In order:
 *
 *   1 'checkIn'   the check-in being made (the caller hands it in)
 *   2 'record'    the newest monthly pot record (SaverReading.saverPotOf on accumulationTool.history)
 *   2b 'record' / 'holdings'  a plan being drawn: the newest month record's pots, or What you hold when it is newer
 *                 (services/DrawingPot.js drawingPensionOf — the very figure Where you are sets against the plan)
 *   2c 'plan'     a plan drawn from now on (not saving), not locked, with its own pension figure: that figure
 *   3 'holdings'  the pension lines under What you hold, when they come to more than £0
 *   4 'saved'     the pot today saved with what you pay in (accumulationTool.settings.potNow) when above £0;
 *      'answer'   the same figure when it is the one the plan was kept with, or the answer's £0 when it said £0
 *   5 'plan'      the plan's own pension total (its Stress pots, PotsAtRetirement.sippTodayOf) on a plan with figures —
 *                 never on a plan kept from an answer that said £0, whose pots hold the pot at the stop
 *   6 'none'      nothing known: value null
 *
 *   pensionTodayOf(plan, { now, checkIn, settings }) → { value, from, asOf, isa }
 *     asOf  'YYYY-MM' of a record or a check-in, the day an answer was kept, else null
 *     isa   the ISA figure that came with the same record or check-in, else null
 *   pensionTodayPatch(plan, value, { now, settings }) → the paths one write sets so the pot typed is the one read next:
 *     the saving settings with `potNow`, and this month's pot record (any ISA and other savings already recorded this month
 *     kept). An unchanged figure writes nothing.
 *
 * Pure: no storage, no clock (the caller hands in `now`).
 */
import { saverPotOf, figureOrNull } from './SaverReading.js';
import { pensionPotFromHoldings } from './Holdings.js';
import { holdingsLines, normaliseWrapper, numOrNull } from './HoldingsRecord.js';
import { sippTodayOf } from './PotsAtRetirement.js';
import { drawingPensionOf, drawingIsaOf } from './DrawingPot.js';

/** The strategies a plan's mix is drawn by (PlanDocument.POT_STRATEGIES): only these hold diversifiers in their band. */
const POT_STRATEGIES = ['pots-and-valves', 'buckets-in-order'];

/** Whether a locked plan's band counts diversifiers the month record does not keep (PlanDocument.bandMeasure). */
function holdsDiversifiers(plan) {
  const d = plan && plan.planDocument;
  if (!isObj(d)) return false;
  const id = (d.strategy && d.strategy.id) || 'pots-and-valves';
  return POT_STRATEGIES.includes(id) && (+(d.pots && d.pots.allocation && d.pots.allocation.diversifierStart) || 0) > 0;
}

const isObj = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const isNum = (v) => typeof v === 'number' && Number.isFinite(v);
const num = (v) => (v == null || v === '' || !Number.isFinite(+v) ? null : +v);
const monthKey = (d) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
/** The most monthly pot records a plan keeps (ScenarioRepository.saveActiveAccumulationHistory). */
const RECORDS_KEPT = 600;

const accOf = (plan) => (plan && plan.accumulationTool && isObj(plan.accumulationTool.settings) ? plan.accumulationTool.settings : {});

/** The pension today the answer a plan was kept from was given, or null (no answer, or one that did not say). */
export function answerPensionToday(plan) {
  const fa = plan && plan.fromAnswer;
  const p = isObj(fa) && Array.isArray(fa.people) && isObj(fa.people[0]) && isObj(fa.people[0].pension) ? fa.people[0].pension : null;
  return p && isNum(p.today) ? p.today : null;
}

/** Whether the plan was kept from an answer that said the pension today was £0 (its Stress pots then hold the pot at the stop). */
export function keptWithNoPension(plan) {
  return answerPensionToday(plan) === 0;
}

export function pensionTodayOf(plan, { now = new Date(), checkIn = null, settings = null } = {}) {
  const ci = isObj(checkIn) ? checkIn : null;
  if (ci && isObj(ci.pot) && isNum(ci.pot.pension)) return { value: ci.pot.pension, from: 'checkIn', asOf: monthKey(now), isa: isNum(ci.pot.isa) ? ci.pot.isa : null };
  const hist = Array.isArray(plan && plan.accumulationTool && plan.accumulationTool.history) ? plan.accumulationTool.history : [];
  const rec = saverPotOf({ accHistory: hist, today: now });
  if (rec.source === 'record' && isNum(rec.pension)) return { value: rec.pension, from: 'record', asOf: rec.at, isa: isNum(rec.isa) ? rec.isa : null };
  const months = Array.isArray(plan && plan.decisionTool && plan.decisionTool.history) ? plan.decisionTool.history.filter(isObj) : [];
  if (months.length) {
    const drawn = drawingPensionOf({ history: months, holdings: plan.holdings, diversifiers: holdsDiversifiers(plan) });
    if (drawn && isNum(drawn.pension)) {
      const isa = drawingIsaOf({ history: months, holdings: plan.holdings });
      return { value: drawn.pension, from: drawn.source, asOf: drawn.asOf, isa: isa ? isa.value : null };
    }
  }
  // a plan drawn from now on, not locked, with its own pension figure (step F1): that figure — the one its runs start from and
  // the one typed on its pots page — before a list under What you hold, which may be older
  const ssFirst = isObj(settings) ? settings : (plan && plan.stressTool && isObj(plan.stressTool.settings) ? plan.stressTool.settings : null);
  const lockedPlan = !!(plan && plan.decisionTool && isObj(plan.decisionTool.settings) && plan.decisionTool.settings.locked);
  if (ssFirst && ssFirst.retired !== false && !lockedPlan && ssFirst.configured === true && sippTodayOf(ssFirst) > 0) return { value: sippTodayOf(ssFirst), from: 'plan', asOf: null, isa: null };
  const held = pensionPotFromHoldings(holdingsLines(plan && plan.holdings));
  if (held > 0) return { value: held, from: 'holdings', asOf: null, isa: null };
  const acc = accOf(plan);
  const said = answerPensionToday(plan);
  const savedOn = plan && isObj(plan.fromAnswer) && typeof plan.fromAnswer.savedOn === 'string' ? plan.fromAnswer.savedOn : null;
  if (num(acc.potNow) > 0) return { value: +acc.potNow, from: said != null && said === +acc.potNow ? 'answer' : 'saved', asOf: said != null && said === +acc.potNow ? savedOn : null, isa: null };
  if (said === 0) return { value: 0, from: 'answer', asOf: savedOn, isa: null };
  const ss = isObj(settings) ? settings : (plan && plan.stressTool && isObj(plan.stressTool.settings) ? plan.stressTool.settings : null);
  if (ss && ss.configured === true && sippTodayOf(ss) > 0) return { value: sippTodayOf(ss), from: 'plan', asOf: null, isa: null };
  return { value: null, from: 'none', asOf: null, isa: null };
}

/**
 * The ISA today, by the same rule everywhere (lead4.md D3): the ISA that came with the pot record or check-in the pension
 * today was read from, else the ISA lines under What you hold (their sum, £0 included), else the plan's ISA balance.
 * → { value, from: 'checkIn' | 'record' | 'holdings' | 'plan' }
 */
export function isaTodayOf(plan, { now = new Date(), checkIn = null, settings = null, today = null } = {}) {
  const t = today || pensionTodayOf(plan, { now, checkIn, settings });
  if (t && isNum(t.isa)) return { value: Math.max(0, t.isa), from: t.from };
  const ss = isObj(settings) ? settings : (plan && plan.stressTool && isObj(plan.stressTool.settings) ? plan.stressTool.settings : {});
  // the pension today read as the plan's own figure (a plan drawn from now on, not locked): its ISA is the plan's own too
  if (t && t.from === 'plan') return { value: Math.max(0, num(ss.isaBalance) || 0), from: 'plan' };
  const isa = holdingsLines(plan && plan.holdings).filter((l) => l && normaliseWrapper(l.wrapper) === 'ISA' && numOrNull(l.value) != null);
  if (isa.length) return { value: Math.max(0, isa.reduce((a, l) => a + numOrNull(l.value), 0)), from: 'holdings' };
  return { value: Math.max(0, num(ss.isaBalance) || 0), from: 'plan' };
}

/**
 * The write that makes `value` the pension today: the saving settings (`settings` when the caller is writing its own, else
 * the stored ones) with `potNow`, and this month's record with the pension replaced. {} when the figure read is already it.
 */
export function pensionTodayPatch(plan, value, { now = new Date(), settings = null } = {}) {
  const v = figureOrNull(value);
  if (v == null || v < 0) return {};
  const read = pensionTodayOf(plan, { now });
  if (read.value === v) return {};
  const base = isObj(settings) ? settings : accOf(plan);
  const out = { 'accumulationTool.settings': { ...base, potNow: v } };
  const month = monthKey(now);
  const hist = Array.isArray(plan && plan.accumulationTool && plan.accumulationTool.history) ? plan.accumulationTool.history.filter(isObj) : [];
  const old = hist.find((r) => r.date === month) || null;
  const isa = old && old.isa != null ? old.isa : null;
  const gia = old ? +old.gia || 0 : 0;
  const rec = { date: month, sipp: v, isa, gia, total: v + (+isa || 0) + gia, recordedAt: now.toISOString(), ...(old && old.isaEntered ? { isaEntered: true } : {}) };
  out['accumulationTool.history'] = hist.filter((r) => r.date !== month).concat([rec]).sort((a, b) => String(a.date).localeCompare(String(b.date))).slice(-RECORDS_KEPT);
  return out;
}

/** Where a saving path's pension today came from, in the words a plan document keeps (SavingPath potSource). */
const PATH_SOURCE = { checkIn: 'check-in', record: 'record', holdings: 'holdings', saved: 'accumulation', answer: 'accumulation', plan: 'plan' };

/**
 * The pension today a lock draws its saving path from (7.12.0): buildSavingPath's `explicit` input, or null when nothing is
 * known (the path then records the gap, as before).
 */
export function pathPensionOf(plan, { now = new Date(), settings = null } = {}) {
  if (!plan) return null;
  const t = pensionTodayOf(plan, { now, settings });
  return t.value != null ? { potNow: t.value, potSource: PATH_SOURCE[t.from] || 'accumulation' } : null;
}
