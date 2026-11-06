/**
 * Month by month, as one set of pure steps both apps run (research/v7/months-in-v7.md §2, 7.2.0).
 *
 * The classic planner works a month out in index.html calcDecisionWithDeps (the engine's inputs read from the
 * repositories), records it with DecisionService.saveDecision (decisionToHistory and its additions, then the ISA used so
 * far worked out again from the records) and fills in missed months with src/ui/monthFillEntry.js. The parts of those that
 * decide a figure or a field are here, so the new app's Month by month runs the very same steps on a saved plan, and the
 * classic planner calls them with what it read:
 *
 *   settingsAsLoaded(settings)                the Decision settings as loadDecisionDBAsync hands them out (the old "declining" bake)
 *   engineSetup({ decisionSettings, stressSettings, strategy })   the settings the engine runs on and the buckets' order
 *   engineDeps(setup, { history, taxYears, spInfo, potsYear, pots })   calcDecisionPWA's deps, as calcDecisionWithDeps built them
 *   recordOf(decision, settings)              the history record saveDecision stores (with the checksum when the settings are known)
 *   historyWith(history, record)              addHistoryRecord's list: the same month replaced, else added; date order
 *   taxYearsWithIsaUsed(taxYears, history, key)   recalculateIsaSavingsUsed's tax years: that year's ISA used, from its records
 *
 * And, for a SAVED plan (the new app, which has no repositories):
 *   monthInputsOf(plan, { now })              everything the engine and the fill read from a plan, read once
 *   decideMonth(inputs, ym, pots, { history, taxYears, entered, paidAhead })   the month, worked out (overlay included)
 *   recordMonths(inputs, { month, pots, entered, paidAhead, fill, nowIso })   the classic Save: the fill, then the month
 *
 * Pure: no storage, no DOM, no clock of its own.
 */
import { calcDecision, getTaxYearFromDate } from './legacyDecision.js';
import { historyForEngine, fillOffer, setUpShareDecision, fillMarks, planFillStart, refusedMonthWords } from './MonthFill.js';
import { decisionToHistory } from '../models/Decision.js';
import { defaultTaxYearConfig } from '../models/TaxYear.js';
import { decisionSettingsChecksum } from './PlanCommit.js';
import { tentGlideForSettings } from './GlidepathService.js';
import { deriveTiming, decisionAnchorYear, stoppedWorkOf } from './PlanTiming.js';
import { runPositionOf } from './PlanFromToday.js';
import { statePensionInfoFor } from '../utils/StatePensionUtils.js';
import { strategyOf } from './PlanFromSeed.js';
import { spendingSmileFactor } from './SpendingModel.js';
import { effectiveStressSettings } from './PlanReading.js';
import { strategyOverlayOf, ladderFromDocument, CONTRACT_IDS } from './DecisionOverlay.js';
import { beforeOf, closedAtOf, BEFORE_KINDS } from './PlanClosed.js';

/** The strategy names, as the registry's describe() gives them (equal, name for name: tests/monthDecision.test.js). */
export const STRATEGY_NAME = Object.freeze({
  'pots-and-valves': 'Pots & Valves', 'buckets-in-order': 'Buckets in order', 'ladder-and-ratchet': 'Ladder & Ratchet', 'bridge-and-engine': 'Gilts to State Pension, then shares',
  'floor-and-flex': 'Floor & Flex', 'floor-the-schedule': 'Floor the schedule', 'floor-to-age': 'Floor to an age, then decide',
  'full-il-gilt': 'Full index-linked gilt ladder', 'gilt-rotation': 'Gilt ladder + rotation'
});

const clone = (v) => (v === undefined ? undefined : JSON.parse(JSON.stringify(v)));


/**
 * The Decision settings as the repository hands them out (DecisionRepository.loadDecisionDBAsync): a copy still carrying
 * the old "Declining with age" profile has its saved schedule multiplied by the old smile once (v6.2.1). A copy; never written.
 */
export function settingsAsLoaded(settings) {
  const s = clone(settings || {});
  if (s.spendingProfile === 'declining') {
    if (Array.isArray(s.targetSchedule) && s.targetSchedule.length) s.targetSchedule = s.targetSchedule.map((v, y) => Math.round((+v || 0) * spendingSmileFactor(y, 'declining')));
    s.spendingProfile = 'flat';
    s.spendingMigratedFrom = 'declining';
  }
  return s;
}

/**
 * The settings the engine runs on (index.html calcDecisionWithDeps): a COPY of the Decision settings with the plan's first tax
 * year when the copy has none (from the Stress plan's Timing block, 6.4.0), the bond tent's glide when it is on, protection
 * off for a bought ladder (6.13.5), and the buckets' fixed order for Buckets in order.
 * @returns {{ settings: object, engineSettings: object, stratDeps: object }}
 */
export function engineSetup({ decisionSettings, stressSettings, strategy }) {
  const settings = { ...(decisionSettings || {}) };
  if (!(+settings.firstTaxYear > 0)) {
    try { const ss = stressSettings || {}; const t = deriveTiming(ss); if (t.mode !== 'legacy' || +ss.firstTaxYear > 0) settings.firstTaxYear = t.firstTaxYear; } catch { /* fallback: first tax year set up */ }
  }
  const decision = settings.equityGlideEnabled ? { ...settings, equityGlide: tentGlideForSettings(settings) } : settings;
  let stratDeps = {};
  const st = strategy || {};
  if (st.id === 'buckets-in-order') {
    // Params can live on the scenario strategy block, on Decision settings (seeded from Stress) or on Stress settings itself — most specific wins.
    const sp = { ...((stressSettings || {}).strategyParams || {}), ...(settings.strategyParams || {}), ...(st.params || {}) };
    stratDeps = { sourcingMode: 'ordered', bucketBand: sp.bucketBand > 0 ? sp.bucketBand / 100 : 0.10 };
  }
  const engineSettings = CONTRACT_IDS.includes(st.id) ? { ...decision, disableProtection: true } : decision;
  return { settings, engineSettings, stratDeps };
}

/**
 * calcDecisionPWA's deps, field for field as calcDecisionWithDeps builds them. `pots`: the month's ISA, gold-and-trend and
 * taxable account as typed (equity, bond and cash go to the engine as arguments).
 */
export function engineDeps(setup, { history, taxYears, spInfo, potsYear, pots = {} }) {
  const p = pots || {};
  const basis = p.giaBasis;
  return {
    ...setup.stratDeps,
    settings: setup.engineSettings,
    history: historyForEngine(history, taxYears),
    allTaxYears: taxYears,
    spInfo,
    potsYear,
    isaBalance: +p.isa || 0,
    diversifier: +p.diversifier || 0,
    giaBalance: +p.gia || 0,
    giaBasis: basis === '' || basis == null ? null : +basis
  };
}

/**
 * The record saveDecision stores: decisionToHistory, the standard draw for the boost, the marks of a month filled in later
 * (and from a set-up's figures), and the checksum of the settings it was worked out against — when they are known.
 */
export function recordOf(decision, settings = null) {
  const r = decisionToHistory(decision);
  r.stdSipp = decision.stdSipp || decision.sippDraw;
  if (decision.filledIn === true) { r.filledIn = true; r.filledInOn = decision.filledInOn; }
  if (decision.fromSetUp === true) r.fromSetUp = true;
  if (settings) r.settingsChecksum = decisionSettingsChecksum(settings);
  return r;
}

/** addHistoryRecord's list: the record's month replaced when it is there, else added; in date order. A new list. */
export function historyWith(history, record) {
  const list = [...(Array.isArray(history) ? history : [])];
  const i = list.findIndex((h) => h.date === record.date);
  if (i >= 0) list[i] = record; else list.push(record);
  list.sort((a, b) => a.date.localeCompare(b.date));
  return list;
}

/** recalculateIsaSavingsUsed: the year's ISA used is the sum of its records' ISA draws; a year with no settings gets the defaults. A new map. */
export function taxYearsWithIsaUsed(taxYears, history, key) {
  const out = { ...(taxYears || {}) };
  const used = (Array.isArray(history) ? history : []).filter((h) => h.taxYear === key).reduce((t, h) => t + (h.isa || 0), 0);
  out[key] = { ...(out[key] || defaultTaxYearConfig()), isaSavingsUsed: used };
  return out;
}

// ---- a saved plan --------------------------------------------------------------------------------------------------------

const isObj = (v) => !!v && typeof v === 'object' && !Array.isArray(v);

/**
 * Everything the Decision tool reads from a plan, read once (the classic planner reads the same through its repositories):
 * the settings as loaded, the effective Stress settings, the strategy, the records in date order, the tax years, the plan
 * year the pots' floors start from (lockedStartUi.decisionPotsYear), the plan's first fillable month and the months it may
 * record (lockedStartUi.fillPlanStart / fillPlanBounds).
 */
export function monthInputsOf(plan, { now = new Date() } = {}) {
  const dt = (plan && plan.decisionTool) || {};
  const settings = settingsAsLoaded(isObj(dt.settings) ? dt.settings : {});
  const stressSettings = effectiveStressSettings(plan, { now });
  const strategy = strategyOf(plan, now.toISOString());
  const history = [...(Array.isArray(dt.history) ? dt.history : [])].sort((a, b) => String(a.date).localeCompare(String(b.date)));
  const taxYears = isObj(dt.taxYears) ? clone(dt.taxYears) : {};
  let potsYear = 0;
  try { potsYear = runPositionOf(stressSettings, deriveTiming(stressSettings)).elapsedYears; } catch { potsYear = 0; }
  const b = beforeOf(plan);
  const floor = b && BEFORE_KINDS.includes(b.kind) ? b.from : null;
  const ceiling = closedAtOf(plan);
  let planStart = null;
  try { planStart = planFillStart(decisionAnchorYear(settings, taxYears, null, stressSettings), stoppedWorkOf(stressSettings)); } catch { planStart = null; }
  if (planStart && floor && planStart < floor) planStart = floor;
  return { plan, settings, stressSettings, strategy, history, taxYears, potsYear, planStart, floor, ceiling, contract: CONTRACT_IDS.includes(strategy.id), now };
}

/**
 * One month worked out on a saved plan, exactly as the classic Calculate does it (calcDecisionWithDeps, then the overlay):
 * the history and tax years as they stand (`o.history`, `o.taxYears` — a fill hands in its own as it goes). Throws as the
 * engine throws (a tax year not set up).
 * @param {object} I  monthInputsOf
 * @param {string} ym  'YYYY-MM'
 * @param {{ equity, bond, cash, isa?, diversifier?, gia?, giaBasis? }} pots
 */
export function decideMonth(I, ym, pots, { history = I.history, taxYears = I.taxYears, entered = null, paidAhead = false } = {}) {
  const setup = engineSetup({ decisionSettings: I.settings, stressSettings: I.stressSettings, strategy: I.strategy });
  const spInfo = statePensionInfoFor(I.settings, taxYears, getTaxYearFromDate(ym), I.now);
  const deps = engineDeps(setup, { history, taxYears, spInfo, potsYear: I.potsYear, pots });
  const d = calcDecision(ym, +pots.equity || 0, +pots.bond || 0, +pots.cash || 0, deps);
  try {
    const ladder = I.contract ? ladderFromDocument(I.plan.planDocument, I.stressSettings, ym, I.now) : null;
    d.strategyOverlay = strategyOverlayOf(d, ym, { strategy: I.strategy, stressSettings: I.stressSettings, name: STRATEGY_NAME[I.strategy.id] || I.strategy.id, ladder });
  } catch { /* the overlay is words; the month stands without it, as on the classic page */ }
  d.cadenceMonths = 1;
  if (entered) d.entered = entered;
  d.paidAhead = !!paidAhead;
  return d;
}

/**
 * The classic Save (monthFillEntry.save with a month at a time): with `fill.on`, every month of the fill offer first, in date
 * order — each worked out on the records before it, a month before its tax year's set-up taking its share, each marked as
 * filled in later — stopping before a tax year not set up (the month itself then not recorded); then the month itself,
 * worked out again when months went in before it. After each record the ISA used in its tax year is worked out again, as
 * saveDecision does, so the next month reads it.
 * @param {object} I  monthInputsOf
 * @param {{ month: string, pots: object, entered?: object, paidAhead?: boolean, fill?: { on: boolean, from?: string|null }, nowIso: string }} o
 * @returns {{ ok: boolean, problem?: string, refused?: string, history, taxYears, records: object[], filled: string[], stopped: string|null,
 *   decision: object|null, first: object|null, offer: object|null }}
 */
export function recordMonths(I, { month, pots, entered = null, paidAhead = false, fill = null, nowIso }) {
  let history = I.history, taxYears = I.taxYears;
  const refused = refusedMonthWords(history, month, taxYears, getTaxYearFromDate);
  if (refused) return { ok: false, problem: 'refused', refused, history, taxYears, records: [], filled: [], stopped: null, decision: null, first: null, offer: null };
  const save = (d) => {
    const r = recordOf(d, I.settings);
    history = historyWith(history, r);
    if (d.taxYear) taxYears = taxYearsWithIsaUsed(taxYears, history, d.taxYear);
    return r;
  };
  const first = decideMonth(I, month, pots, { history, taxYears, entered, paidAhead });
  const offer = fill && fill.on ? fillOffer(history, month, { taxYears, taxYearOf: getTaxYearFromDate, from: fill.from || null, planStart: I.planStart, floor: I.floor, ceiling: I.ceiling }) : null;
  const records = [], filled = [];
  let stopped = null;
  if (offer) {
    for (const date of offer.months) {
      const cfg = taxYears[getTaxYearFromDate(date)];
      if (!(cfg && cfg.yearSetupComplete === true)) { stopped = date; break; }
      let d = decideMonth(I, date, pots, { history, taxYears, entered });
      if (offer.shares && offer.shares[date]) d = setUpShareDecision(d, offer.shares[date]);
      records.push(save({ ...d, ...fillMarks(nowIso), paidAhead: false }));
      filled.push(date);
    }
    if (!stopped && offer.notSetUp && offer.months.length) stopped = offer.notSetUp.month;
  }
  if (stopped) return { ok: true, history, taxYears, records, filled, stopped, decision: null, first, offer };
  const current = filled.length ? decideMonth(I, month, pots, { history, taxYears, entered, paidAhead }) : first;
  records.push(save(current));
  return { ok: true, history, taxYears, records, filled, stopped: null, decision: current, first, offer };
}
