/**
 * Month by month, on a saved plan (research/v7/months-in-v7.md; 7.2.0): what the page shows and the two writes it makes —
 * a month recorded (with the months filled in before it), and a tax year set up.
 *
 * ONE ENGINE. Every figure is the classic planner's own: the month is worked out by legacyDecision through
 * services/MonthDecision.js (the engine's inputs as calcDecisionWithDeps builds them, the record as saveDecision stores it,
 * the fill as the classic Save runs it), the fill offer and its words are services/MonthFill.js, the pots' boxes and their
 * pre-fill services/MonthlyEntry.js, the set-up services/TaxYearSetUp.js. Nothing here is a second model: this file reads the
 * boxes, asks those functions and says what they said.
 *
 *   monthOf(entries, id, { today, typed, source })   everything the page draws
 *   monthRecordPatch(plan, typed, { today, nowIso })  "Record": ONE write of the records and the tax years (MONTH_WRITES)
 *   taxYearPatch(plan, typed, { today })               "Set up 2026/27": ONE write of the tax years
 *   readMonth(plan, typed, { today, nowIso })          the reading both share (exported for the tests)
 *
 * A plan records months here once it is locked (the lock is its own step; §1.2): an unlocked plan is told so and linked to it.
 *
 * Pure: no clock (the day arrives as `today`, the moment of a write as `nowIso`), no storage.
 */
import { monthInputsOf, recordMonths, decideMonth } from '../../services/MonthDecision.js';
import { getTaxYearFromDate } from '../../services/legacyDecision.js';
import { fillOffer, addMonth, monthsWords, latestRecordedMonth, earliestFillMonth, fillWords, FILL_HELP, setUpWords, filledInLabel, recalcWords, yearWords, aprilOf } from '../../services/MonthFill.js';
import { platformBoxes, splitFromPlatform, prefillFromHistory, enteredBlock } from '../../services/MonthlyEntry.js';
import { wizardDataFrom, isaCalcFor, topUpStart, settleTopUp, breakdownFor, setUpConfigOf, suggestedIncomeFor, validateIsaInput, bandsAssumptionText } from '../../services/TaxYearSetUp.js';
import { statePensionInfoFor } from '../../utils/StatePensionUtils.js';
import { defaultTaxYearConfig } from '../../models/TaxYear.js';
import { storedStressSettings, planStage } from '../../services/PlanReading.js';
import { arrivalCheck } from '../../services/LifeStage.js';
import { cadenceOf } from '../../services/DrawCadence.js';
import { isClosedPlan } from '../../services/PlanClosed.js';
import { isExamplePlan } from '../../services/GuestPlans.js';
import { MONTH_FIELDS } from './schema.js';
import { dateOf, monthWords, monthName, localMonth } from './dates.js';
import { partnerOf } from './household.js';
import { pounds } from './income.js';

const isObj = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const blank = (v) => v === undefined || v === null || (typeof v === 'string' && v.trim() === '');
const isLocked = (plan) => !!(plan && plan.decisionTool && plan.decisionTool.settings && plan.decisionTool.settings.locked);
const nameOf = (plan) => (plan && plan.planDetails && typeof plan.planDetails.name === 'string' && plan.planDetails.name) || (plan && typeof plan.name === 'string' && plan.name) || '';
const YM = /^\d{4}-\d{2}$/;
/** The money a box holds: whole pounds as typed ('£250,000' reads 250000); null when blank; NaN when not a number. */
const money = (v) => { if (blank(v)) return null; const n = +String(v).replace(/[£,\s]/g, ''); return Number.isFinite(n) ? n : NaN; };
/** A month of the plan's own records ('YYYY-MM'). */
const monthOfRecord = (h) => (h && typeof h.date === 'string' && YM.test(h.date.slice(0, 7)) ? h.date.slice(0, 7) : null);
/** How many months the chooser lists at most (the latest ones). */
export const MONTHS_LISTED = 36;

function safeStage(plan, now) {
  try { return planStage(plan, { now }); } catch { return { key: 'unknown' }; }
}

/** A box's problem: 'number' (not a figure), 'negative', 'big', or null. */
function boxError(path, raw) {
  const f = MONTH_FIELDS.find((x) => x.path === path);
  const v = money(raw);
  if (v === null) return null;
  if (!Number.isFinite(v)) return 'number';
  if (f && f.min != null && v < f.min) return 'negative';
  if (f && f.max != null && v > f.max) return 'big';
  return null;
}

/**
 * The months the chooser lists (not recorded, within the months the plan may record — after the plan that came before, up to a
 * close), from the month the classic fill reaches back to (MonthFill.earliestFillMonth) up to next month; the latest
 * MONTHS_LISTED. And the month it opens on: this month when it is not recorded, else the first month after the latest record,
 * else the last listed.
 */
function monthChoices(I, mon) {
  const recorded = new Set(I.history.map(monthOfRecord).filter(Boolean));
  const found = earliestFillMonth(I.history, I.taxYears, I.planStart);
  let first = found && I.floor && found < I.floor ? I.floor : found;
  if (!first || first > mon) first = mon;
  let last = addMonth(mon, 1);
  if (I.ceiling && I.ceiling < last) last = I.ceiling;
  const all = [];
  for (let m = first; m <= last; m = addMonth(m, 1)) if (!recorded.has(m)) all.push(m);
  const listed = all.slice(-MONTHS_LISTED);
  const latest = latestRecordedMonth(I.history);
  const opens = listed.includes(mon) ? mon : (latest ? listed.find((m) => m > latest) : null) || listed[listed.length - 1] || null;
  return { listed, opens };
}

/** The set-up's boxes read, the top-up settled and the year as it would be stored (TaxYearSetUp, as the classic set-up runs it). */
function setUpOf(I, plan, key, ym, typed, now) {
  const existing = I.taxYears[key] || defaultTaxYearConfig();
  const ctx = wizardDataFrom(ym, {
    settings: I.settings, stressSettings: storedStressSettings(plan), existingConfig: existing, allTaxYears: I.taxYears,
    statePensionInfo: statePensionInfoFor(I.settings, I.taxYears, key, now), now
  });
  const errors = {};
  const read = (path, dflt) => { const e = boxError(path, typed[path]); if (e) { errors[path] = e; return dflt; } const v = money(typed[path]); return v === null ? dflt : v; };
  const cpiTyped = blank(typed['ty.cpi']) ? null : (() => { const e = boxError('ty.cpi', typed['ty.cpi']); if (e) { errors['ty.cpi'] = e; return null; } return money(typed['ty.cpi']) / 100; })();
  const cpi = cpiTyped == null ? ctx.defaults.cpi : cpiTyped;
  const suggestion = suggestedIncomeFor(ctx, cpiTyped);
  const inputs = {
    pa: read('ty.pa', ctx.defaults.pa), brl: read('ty.brl', ctx.defaults.brl), hrl: read('ty.hrl', ctx.defaults.hrl), cpi,
    other: read('ty.other', ctx.defaults.other), cgtExemptionUsed: read('ty.cgt', 0),
    grossIncomeToDate: ctx.isApril ? 0 : read('ty.toDate', 0),
    taxPaidToDate: ctx.isApril ? null : read('ty.taxToDate', null),
    confirmedSalary: read('ty.income', suggestion),
    isaSavingsAllocation: null, isTaxEfficient: true, taxEfficiencyChoice: null
  };
  if (!(inputs.confirmedSalary > 0)) errors['ty.income'] = errors['ty.income'] || 'income';
  const isaCalc = isaCalcFor(ctx, inputs);
  const start = topUpStart(isaCalc);
  inputs.isaSavingsAllocation = isaCalc.brlExhausted ? 0 : read('ty.isa', start);
  const choice = typed['ty.choice'] && ['increase', 'reduced', 'inefficient'].includes(typed['ty.choice']) ? typed['ty.choice'] : null;
  const validation = validateIsaInput(isaCalc.brlExhausted ? 0 : (inputs.isaSavingsAllocation || 0), isaCalc.isaNeeded || 0, !!isaCalc.brlExhausted);
  // a year the pension cannot be touched (7.4.1): the savings pay it, so there is no band to keep within and nothing to choose
  const needsChoice = !isaCalc.pensionClosed && !(validation.sufficient && !validation.isBrlExhausted);
  const choices = needsChoice ? validation.options.map((o) => o.key) : [];
  const settled = settleTopUp(inputs, isaCalc, choice && choices.includes(choice) ? choice : null);
  if (needsChoice && !settled) errors['ty.choice'] = 'choose';
  const final = settled ? { ...inputs, ...settled } : inputs;
  const breakdown = breakdownFor(ctx, final);
  const config = setUpConfigOf(ctx, final);
  const sp = ctx.statePension || {};
  return {
    key, year: yearWords(key), month: monthWords(ym), isApril: ctx.isApril, remaining: ctx.remainingMonths, prevMonth: ctx.isApril ? null : monthWords(addMonth(ym, -1)),
    source: ctx.suggestionSource, bridgeCover: ctx.bridgeCoverMonths, declining: (ctx.declineRate || 0) > 0, declinePct: Math.round((ctx.declineRate || 0) * 100),
    suggestion, cpiPct: Math.round(cpi * 1000) / 10, defaults: ctx.defaults,
    statePension: spOf(sp, ym), statePensionLater: sp.amount > 0 && sp.startYm && sp.startYm > ym ? { monthly: pounds(sp.monthlyFull || 0), from: sp.startDate || sp.startYm } : null,
    bands: bandsAssumptionText(final),
    topUp: {
      exhausted: !!isaCalc.brlExhausted, notNeeded: !!isaCalc.targetAchievableAtBrl, needed: Math.round(isaCalc.isaNeeded || 0),
      shortfall: Math.round(validation.shortfall || 0), needsChoice, choices, choice: settled ? settled.taxEfficiencyChoice : choice,
      ...(ctx.pensionClosed ? { closed: { age: String(ctx.pensionClosed.accessAge) } } : {})
    },
    inputs: final, breakdown, config, errors, ok: Object.keys(errors).length === 0 && (!needsChoice || !!settled),
    // the figures as the page says them, to the pound
    words: { suggestion: pounds(suggestion), income: pounds(final.confirmedSalary), incomeTyped: pounds(inputs.confirmedSalary), brl: pounds(final.brl), need: pounds(isaCalc.isaNeeded || 0), shortfall: pounds(validation.shortfall || 0) },
    bank: [
      { id: 'pension', ...bankRow(breakdown.sipp) },
      ...(breakdown.other.gross > 0 ? [{ id: 'other', ...bankRow(breakdown.other) }] : []),
      ...(breakdown.statePension.gross > 0 ? [{ id: 'statePension', ...bankRow(breakdown.statePension) }] : []),
      ...(breakdown.isa.net > 0 ? [{ id: 'isa', ...bankRow(breakdown.isa), tax: '£0' }] : [])
    ],
    bankTotal: { before: pounds(breakdown.totalGross), tax: pounds(breakdown.totalTax), after: pounds(breakdown.totalNet) },
    efficient: final.isTaxEfficient !== false
  };
}

const bankRow = (x) => ({ before: pounds(x.gross), tax: pounds(x.tax), after: pounds(x.net) });

/** The pots' boxes read (the platform view or by type), with the record they were pre-filled from. */
function potsOf(I, plan, ym, typed) {
  const contract = I.contract;
  const hasDiversifiers = I.settings.diversifierStart > 0 || !!I.settings.diversifiers;
  const hasGia = I.settings.taxableStart > 0 || I.history.some((h) => h && h.gia != null);
  const mode = typed['mo.mode'] === 'type' ? 'type' : 'platform';
  const prefill = prefillFromHistory(I.history, { contract, month: ym });
  const lastGia = [...I.history].reverse().find((h) => h && h.giaBasisAfter != null) || null;
  const pre = {
    'mo.total': prefill ? prefill.total : null, 'mo.cash': prefill ? prefill.cash : null, 'mo.bonds': prefill && !contract ? prefill.bonds : null, 'mo.diversifiers': prefill && prefill.diversifiers ? prefill.diversifiers : null,
    'mo.isa': null,
    'mo.gia': lastGia && lastGia.giaBalanceAfter > 0 ? Math.round(lastGia.giaBalanceAfter) : (!lastGia && I.settings.taxableStart > 0 ? Math.round(I.settings.taxableStart) : null),
    'mo.giaBasis': lastGia ? Math.round(lastGia.giaBasisAfter) : null
  };
  if (prefill) { const s = splitFromPlatform(prefill, { contract, hasDiversifiers }); if (!s.problem) Object.assign(pre, { 'mo.equity': s.equity, 'mo.bond': s.bond, 'mo.cashT': s.cash, 'mo.diversifier': s.diversifier }); }
  const shown = (path) => (path in typed ? String(typed[path]) : pre[path] == null ? '' : String(pre[path]));
  const errors = {};
  const val = (path) => { const e = boxError(path, shown(path)); if (e) { errors[path] = e; return null; } return money(shown(path)); };
  const boxes = mode === 'platform'
    ? platformBoxes({ contract, hasDiversifiers }).map((b) => ({ key: b.key, path: { total: 'mo.total', cash: 'mo.cash', bonds: 'mo.bonds', diversifiers: 'mo.diversifiers' }[b.key] }))
    : [['equity', 'mo.equity'], ['bond', 'mo.bond'], ['cash', 'mo.cashT'], ...(hasDiversifiers ? [['diversifier', 'mo.diversifier']] : [])].map(([key, path]) => ({ key, path }));
  let split = null, entered = null, problem = null;
  if (mode === 'platform') {
    const typedP = { total: val('mo.total'), cash: val('mo.cash'), bonds: contract ? null : val('mo.bonds'), diversifiers: hasDiversifiers && !contract ? val('mo.diversifiers') : null };
    if (!Object.keys(errors).length) {
      const s = splitFromPlatform(typedP, { contract, hasDiversifiers });
      if (s.problem) problem = typedP.total == null ? 'noTotal' : contract ? 'cashOverTotal' : 'partsOverTotal';
      else { split = s; entered = enteredBlock('platform', typedP, s); }
    }
  } else {
    const t = { equity: val('mo.equity') || 0, bond: val('mo.bond') || 0, cash: val('mo.cashT') || 0, diversifier: hasDiversifiers ? (val('mo.diversifier') || 0) : 0 };
    if (!Object.keys(errors).length) { split = { ...t, problem: null }; entered = enteredBlock('type', t, t); }
  }
  const isa = val('mo.isa');
  const gia = hasGia ? val('mo.gia') : null;
  const basisRaw = hasGia ? shown('mo.giaBasis') : '';
  const basis = hasGia && !blank(basisRaw) ? val('mo.giaBasis') : null;
  const pots = split ? { equity: split.equity, bond: split.bond, cash: split.cash, isa: isa || 0, diversifier: split.diversifier || 0, gia: gia || 0, giaBasis: hasGia && !blank(basisRaw) ? basis : null } : null;
  const fields = [...boxes.map((b) => b.path), 'mo.isa', ...(hasGia ? ['mo.gia', 'mo.giaBasis'] : [])].map((path) => ({ path, type: 'money', applies: true, shown: shown(path), saved: null, error: errors[path] || null }));
  return { mode, contract, hasDiversifiers, hasGia, prefill, prefillFrom: prefill ? monthWords(prefill.from) : null, fields, errors, problem, pots, entered, total: split ? split.equity + split.bond + split.cash + (split.diversifier || 0) : null };
}

/** The month's figures as the page says them (a bought ladder: where from; else which pots; the cut; what to move). */
function adviceOf(d) {
  if (!d) return null;
  const r = (v) => Math.round(+v || 0);
  const ov = d.strategyOverlay || null;
  const moves = [];
  for (const a of Array.isArray(d.alerts) ? d.alerts : []) {
    if (!a || typeof a.message !== 'string') continue;
    if (ov && ov.hidePots && (a.type === 'low-cash' || a.type === 'rebalance' || a.type === 'cash-replenish')) continue;
    const amount = (/£([\d,]+)/.exec(a.message) || [])[1];
    const pts = amount ? '£' + amount : null;
    if (a.type === 'rebalance') moves.push({ id: /Equity→Bond/.test(a.message) ? 'sharesToBonds' : 'bondsToShares', slots: { amount: pts } });
    else if (a.type === 'cash-replenish' && /^Waterfall: move £[\d,]+ from equities/.test(a.message)) moves.push({ id: 'sharesToBonds', slots: { amount: pts } });
    else if (a.type === 'cash-replenish' && /^Waterfall: move £[\d,]+ from bonds/.test(a.message)) moves.push({ id: 'bondsToCash', slots: { amount: pts } });
    else if (a.type === 'cash-replenish') moves.push({ id: 'topUpCash', slots: { amount: pts } });
    else if (a.type === 'low-cash') moves.push({ id: 'lowCash', slots: {} });
  }
  const from = [];
  if (ov && (ov.floorMonthly > 0 || ov.hidePots)) {
    const label = String(ov.floorLabel || '');
    const rung = /^rung (.+) \(already cash\)$/.exec(label);
    const where = rung ? { id: 'rung', slots: { year: rung[1] } }
      : label === 'the cash years bucket' ? { id: 'cashYears', slots: {} }
        : /^cash, before/.test(label) ? { id: 'cashBefore', slots: {} }
          : label === 'the essentials rung' ? { id: 'essentials', slots: {} }
            : label === 'the engine' ? { id: 'invested', slots: {} }
              : { id: 'thisYear', slots: {} };
    if (ov.floorMonthly > 0) from.push({ ...where, amount: pounds(ov.floorMonthly) });
    if (ov.sleeveMonthly > 0) from.push({ id: 'investedRest', slots: {}, amount: pounds(ov.sleeveMonthly) });
  } else {
    if (d.drawFromCash > 0.5) from.push({ id: 'cash', slots: {}, amount: pounds(d.drawFromCash) });
    if (d.drawFromBond > 0.5) from.push({ id: 'bonds', slots: {}, amount: pounds(d.drawFromBond) });
    if (d.drawFromEquity > 0.5) from.push({ id: 'shares', slots: {}, amount: pounds(d.drawFromEquity) });
    if (d.drawFromDiversifier > 0.5) from.push({ id: 'diversifiers', slots: {}, amount: pounds(d.drawFromDiversifier) });
  }
  return {
    month: monthWords(d.date), taxYear: d.taxYear, pension: pounds(d.sippDraw), tax: pounds(d.monthlyTax), afterTax: pounds(d.totalMonthlyNet),
    isa: d.isaDraw > 0.5 ? pounds(d.isaDraw) : null,
    gia: d.giaNet > 0.5 ? { net: pounds(d.giaNet), sold: pounds(d.giaDraw), cgt: d.giaCgt > 0.5 ? pounds(d.giaCgt) : null } : null,
    statePension: d.statePension > 0.5 ? pounds(d.statePension) : null, other: d.other > 0.5 ? pounds(d.other) : null,
    recycle: d.recycleNet > 0.5 ? { net: pounds(d.recycleNet), gross: pounds(d.recycleGross) } : null,
    boost: d.boostAmount > 0 ? pounds(d.boostAmount) : null,
    cut: !!d.inProtection, efficient: d.isTaxEfficientYear !== false,
    contract: !!(ov && ov.hidePots), from, moves,
    raw: { sippDraw: r(d.sippDraw), monthlyTax: r(d.monthlyTax), totalMonthlyNet: r(d.totalMonthlyNet), isaDraw: r(d.isaDraw) }
  };
}

/**
 * Why a month cannot be recorded (MonthFill.refusedMonthWords' two reasons, in the new app's words): already recorded, or it
 * comes before its tax year's set-up, which already counts what was received in it.
 */
function refusalOf(I, month) {
  if (I.history.some((h) => monthOfRecord(h) === month)) return { id: 'recorded', slots: { month: monthWords(month) } };
  const key = getTaxYearFromDate(month), cfg = I.taxYears[key] || {};
  const start = Number(cfg.startMonth) || 4;
  return { id: 'beforeSetUp', slots: { month: monthWords(month), year: yearWords(key), from: monthWords(addMonth(aprilOf(key), (start + 8) % 12)) } };
}

/** The State Pension for the set-up, as facts the page words (statePensionLine's cases, without its classic page's directions). */
function spOf(sp, ym) {
  const s = sp || {};
  const amount = +s.amount || 0;
  const when = s.startDate || s.startYm || null;
  if (!amount) return { id: when ? 'noAmount' : 'none', slots: { when } };
  const monthly = s.monthlyFull != null ? +s.monthlyFull : (s.monthly != null ? +s.monthly : amount / 12);
  const started = s.startYm ? String(s.startYm) <= String(ym) : !!s.isReceiving;
  return { id: started ? 'paying' : s.isReceiving ? 'startsThisYear' : 'later', slots: { when, monthly: pounds(monthly), amount: pounds(amount) } };
}

/** The fill's help in the new app's words where the classic one names its own buttons ("the month box", "Calculate"). */
function fillHelpOf(offer, boxMonth) {
  if (!offer) return [];
  const out = offer.setUp.map((s) => ({ id: 'setUp', text: setUpWords(s) }));
  if (offer.notSetUp) out.push({ id: offer.months.length ? 'notSetUpStops' : 'notSetUpNone', slots: { year: yearWords(offer.notSetUp.key), month: monthWords(offer.notSetUp.month), box: monthWords(boxMonth), april: monthWords(aprilOf(offer.notSetUp.key) || offer.notSetUp.month) } });
  if (offer.months.length) out.push({ id: 'fill', text: FILL_HELP });
  if (offer.pending.length) out.push({ id: offer.pending.length === 1 ? 'pendingOne' : 'pending', slots: { months: monthsWords(offer.pending), year: yearWords(getTaxYearFromDate(boxMonth)) } });
  return out;
}

/** The idle line's months: { month, next } as names, when this month (or later) is recorded; else null. */
function idleOf(history, mon) {
  const latest = latestRecordedMonth(history);
  if (!latest || latest < mon) return null;
  return { month: monthName(latest), next: monthName(addMonth(latest, 1)) };
}

/**
 * The reading the page and the writes share. `typed` the boxes as typed (plan draft values). The month is the chooser's (or
 * the month it opens on), moved on one when "This month's payment has already been made" is ticked on this month.
 */
export function readMonth(plan, typed0, { today, nowIso = null, entries = null } = {}) {
  const typed = isObj(typed0) ? typed0 : {};
  const now = dateOf(today);
  const mon = localMonth(now);
  const I = monthInputsOf(plan, { now });
  const stage = safeStage(plan, now);
  const locked = isLocked(plan);
  const closed = isClosedPlan(plan);
  const { listed, opens } = monthChoices(I, mon);
  const chosen = typeof typed['mo.month'] === 'string' && listed.includes(typed['mo.month']) ? typed['mo.month'] : opens;
  const paidAsked = typed['mo.paid'] === 'yes' && chosen === mon;
  const marchPaid = paidAsked && Number(mon.slice(5, 7)) === 3;
  const paidAhead = paidAsked && !marchPaid;
  const month = chosen ? (paidAhead ? addMonth(chosen, 1) : chosen) : null;
  const errors = {};
  if (marchPaid) errors['mo.paid'] = 'march';
  const base = {
    stageKey: stage.key, locked, closed, months: listed.map((m) => ({ ym: m, words: monthWords(m) })), chosen, mon, month, monthWords: month ? monthWords(month) : '',
    paidOffered: chosen === mon && !(I.ceiling && I.ceiling <= mon), paidAhead, cadence: cadenceOf(plan.decisionTool),
    recent: I.history.slice(-3).reverse().map((h) => ({ month: monthWords(h.date), afterTax: pounds(h.monthlyNet), tax: pounds(h.monthlyTax), filled: filledInLabel(h) || null, fromSetUp: h.fromSetUp === true })),
    recordedCount: I.history.length,
    // nothing due (7.3.0, "Forms become tools"): the latest month recorded (a quarter or a year recorded at once reaches
    // ahead) and the month that opens next, due from its own 1st — said by name only, the year being plain
    idle: idleOf(I.history, mon)
  };
  if (!month) return { ...base, nothing: true, errors, ok: false };
  if (paidAhead && I.history.some((h) => monthOfRecord(h) === month)) errors['mo.paid'] = 'recorded';
  const key = getTaxYearFromDate(month);
  const cfg = I.taxYears[key];
  const setUpDone = !!(cfg && cfg.yearSetupComplete === true);
  const setUp = setUpDone ? null : setUpOf(I, plan, key, month, typed, now);
  const yearLine = setUpDone ? { year: yearWords(key), from: monthWords(addMonth(aprilOf(key), (((Number(cfg.startMonth) || 4) + 8) % 12))), income: cfg.confirmedSalary > 0 ? pounds(cfg.confirmedSalary) : null } : null;
  const P = potsOf(I, plan, month, typed);
  Object.assign(errors, P.errors);
  // the months missed before this one (MonthFill.fillOffer, as the classic page offers them): the nudge at the top names every
  // month the fill could reach, a gap inside the records as well as after them; the offer under the figures
  const from = typeof typed['mo.from'] === 'string' && YM.test(typed['mo.from']) ? typed['mo.from'] : null;
  const offer = fillOffer(I.history, month, { taxYears: I.taxYears, taxYearOf: getTaxYearFromDate, from, planStart: I.planStart, floor: I.floor, ceiling: I.ceiling });
  // … less a month whose payment the next record says was made already (its paidAhead mark, as read.js firstGap reads it)
  const paidBefore = new Set(I.history.filter((h) => h && h.paidAhead === true).map((h) => addMonth(monthOfRecord(h), -1)));
  const gap = offer ? offer.choices.filter((m) => !paidBefore.has(m)) : [];
  const fillOn = typed['mo.fill'] === 'yes' && !!offer && offer.months.length > 0;
  // the arrival check (LifeStage.arrivalCheck): a plan locked while saving, its first month after the stop
  let arrival = null;
  try {
    if (stage.timingMode === 'future' && !stage.beforeStart && plan.planDocument && I.history.length === 0 && P.pots) {
      const a = arrivalCheck(stage, plan.planDocument, { sipp: P.pots.equity + P.pots.bond + P.pots.cash, isa: blank(typed['mo.isa']) ? null : typed['mo.isa'] }, { at: month, now });
      if (a) arrival = { within: !!a.within, message: a.message, expected: a.expected, actual: a.compared ?? a.actual };
    }
  } catch { arrival = null; }
  let first = null, result = null, problem = null, refused = null;
  if (setUpDone && P.pots && !Object.keys(errors).length) {
    try {
      result = recordMonths(I, { month, pots: P.pots, entered: P.entered, paidAhead, fill: { on: fillOn, from }, nowIso: nowIso || now.toISOString() });
      if (!result.ok) { refused = refusalOf(I, month); problem = 'refused'; result = null; }
      else first = result.first;
    } catch (e) { problem = 'failed'; result = null; }
  } else if (!setUpDone && P.pots && setUp.ok && !Object.keys(errors).length) {
    // before the set-up is saved: the month as it will be worked out once it is, so the person sees what the year gives
    try { first = decideMonth(I, month, P.pots, { taxYears: { ...I.taxYears, [key]: { ...(I.taxYears[key] || defaultTaxYearConfig()), ...setUp.config } }, entered: P.entered, paidAhead }); } catch { first = null; }
  }
  const shown = result && result.decision ? result.decision : first;
  // the month worked out again with the filled-in months on record moved (MonthFill.recalcWords): the page says the figures include them
  const recalc = !!(result && result.decision && result.filled.length && recalcWords(first, result.decision));
  const partner = entries ? partnerOf(entries, plan) : null;
  const ok = setUpDone && !!result && !problem;
  return {
    ...base, key, year: yearWords(key), setUpDone, yearLine, setUp, pots: P, errors, problem, refused, arrival,
    gap: gap.length ? { count: gap.length, words: monthsWords(gap), from: gap[0] } : null,
    offer: offer ? {
      months: offer.months, words: offer.months.length ? fillWords(offer.months, offer.setUp.length > 0) : '', count: offer.months.length,
      choices: offer.choices.map((m) => ({ ym: m, words: monthWords(m) })), chosenFrom: offer.chosenFrom, closed: offer.closed, widened: offer.widened,
      help: fillHelpOf(offer, month), stops: !!offer.notSetUp
    } : null,
    fillOn, advice: adviceOf(shown), preview: !setUpDone && !!shown, recalc,
    stopped: result && result.stopped ? { month: monthWords(result.stopped), year: yearWords(getTaxYearFromDate(result.stopped)), written: result.records.length, april: monthWords(aprilOf(getTaxYearFromDate(result.stopped))) } : null,
    write: ok ? { history: result.history, taxYears: result.taxYears, records: result.records, filled: result.filled, stopped: result.stopped } : null,
    partner: partner ? { id: String(partner.plan.id), name: nameOf(partner.plan) } : null,
    ok, I, firstDecision: first, decision: shown
  };
}

/**
 * Everything the page draws (research/v7/months-in-v7.md §1), with the boxes as typed. `editable` is false for a plan shown as
 * saved, the read-only example, a plan not locked (it is told to lock first) and a closed plan past its last month.
 */
export function monthOf(entries, id, { today, typed = null, source = 'account' } = {}) {
  const list = (entries || []).filter((e) => e && e.plan && typeof e.plan === 'object' && e.plan.id != null);
  const entry = list.find((e) => String(e.plan.id) === String(id)) || null;
  if (!entry) return { found: false, id: String(id || '') };
  const plan = entry.plan;
  const readonly = !!(entry.newer || entry.failed);
  const example = isExamplePlan(plan);
  let R;
  try { R = readMonth(plan, typed || {}, { today, entries: list }); } catch (e) { return { found: true, id: String(plan.id), name: nameOf(plan), readonly, source, failed: true, editable: false }; }
  const { I, write, firstDecision, decision, ...rest } = R;
  const needsLock = !R.locked && !R.closed;
  return {
    found: true, id: String(plan.id), name: nameOf(plan), readonly, example, source, needsLock,
    editable: !readonly && !example && !needsLock && !R.nothing,
    ...rest,
    records: write ? write.records.length : 0
  };
}

const prevOf = (plan, key) => {
  const dt = (plan && plan.decisionTool) || {};
  if (key === 'decisionTool.history') return Array.isArray(dt.history) ? dt.history : null;
  if (key === 'decisionTool.taxYears') return isObj(dt.taxYears) ? dt.taxYears : null;
  if (key === 'journey') return Array.isArray(plan.journey) ? plan.journey : null;
  return null;
};

/**
 * "Record" (the classic Save, research/v7/months-in-v7.md §3): ONE write of the records — this month, and the months filled in
 * before it — and the tax years with their ISA used worked out again; with the arrival check outside the plan's margin, the
 * journey too. Refused on a plan that is not locked, with a tax year not set up, a box with a problem, or a month refused.
 * @returns {{ ok, problem?, patch, previous, line, filled, stopped }}
 */
export function monthRecordPatch(plan, typed, { today, nowIso, stageKey = null } = {}) {
  if (!isLocked(plan) && !isClosedPlan(plan)) return { ok: false, problem: 'notLocked', patch: {}, previous: {} };
  const R = readMonth(plan, typed || {}, { today, nowIso });
  if (R.nothing) return { ok: false, problem: 'noMonth', patch: {}, previous: {} };
  if (!R.setUpDone) return { ok: false, problem: 'notSetUp', patch: {}, previous: {} };
  if (Object.keys(R.errors).length || !R.pots.pots) return { ok: false, problem: 'problems', patch: {}, previous: {} };
  if (R.problem === 'refused') return { ok: false, problem: 'refused', patch: {}, previous: {}, refused: R.refused };
  if (!R.ok || !R.write) return { ok: false, problem: 'failed', patch: {}, previous: {} };
  const patch = { 'decisionTool.history': R.write.history, 'decisionTool.taxYears': R.write.taxYears };
  if (R.arrival && !R.arrival.within && !R.write.stopped) {
    const j = Array.isArray(plan.journey) ? plan.journey : [];
    patch.journey = [...j, { stage: stageKey || R.stageKey, label: 'Arrival check', at: nowIso, note: 'pot ' + Math.round(R.arrival.actual) + ' vs ' + Math.round(R.arrival.expected) + ' expected at the stop, same measure; ran as locked' }];
  }
  const previous = Object.fromEntries(Object.keys(patch).map((k) => [k, prevOf(plan, k)]));
  const filled = R.write.filled;
  const line = R.write.stopped
    ? { id: 'stopped', slots: { written: String(R.write.records.length), month: R.stopped.month, year: R.stopped.year, box: R.monthWords } }
    : filled.length ? { id: 'recordedFilled', slots: { month: R.monthWords, n: String(filled.length), months: monthsWords(filled), s: filled.length === 1 ? '' : 's' } }
      : { id: 'recorded', slots: { month: R.monthWords } };
  return { ok: true, patch, previous, line, filled, stopped: R.write.stopped };
}

/**
 * "Set up 2026/27" (the classic set-up's Confirm & save): ONE write of the tax years, the year's settings over what it held (or
 * the defaults), as saveTaxYearConfig merges them. Refused on a plan that is not locked, a year already set up, or a box with
 * a problem (and, when the top-up falls short, no choice made).
 */
export function taxYearPatch(plan, typed, { today } = {}) {
  if (!isLocked(plan) && !isClosedPlan(plan)) return { ok: false, problem: 'notLocked', patch: {}, previous: {} };
  const R = readMonth(plan, typed || {}, { today });
  if (R.nothing) return { ok: false, problem: 'noMonth', patch: {}, previous: {} };
  if (R.setUpDone || !R.setUp) return { ok: false, problem: 'setUpAlready', patch: {}, previous: {} };
  if (!R.setUp.ok) return { ok: false, problem: 'problems', patch: {}, previous: {} };
  const taxYears = (plan.decisionTool && isObj(plan.decisionTool.taxYears)) ? plan.decisionTool.taxYears : {};
  const next = { ...taxYears, [R.key]: { ...(taxYears[R.key] || defaultTaxYearConfig()), ...R.setUp.config } };
  return { ok: true, patch: { 'decisionTool.taxYears': next }, previous: { 'decisionTool.taxYears': prevOf(plan, 'decisionTool.taxYears') }, line: { id: 'setUp', slots: { year: R.setUp.year, month: R.setUp.month } } };
}
