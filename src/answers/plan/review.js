/**
 * Your review (7.10.0; research/v7/replan-nov-2026.md §6; spec-7100 §4): ONE page in every phase, #/plan/<id>/review. In
 * Saving it is the check-in (answers/plan/checkIn.js: that phase's review, kept where it always was); in Moving it reads how
 * far what is held is from the mix the plan moves to; in Living on it, the pots, what was taken and the year ahead. Every
 * phase shows the person's rule for off course and how often the review falls; Saving and Moving add the move window and the
 * saving level. Each is a choice, written alone (Phases.phasesPatch); nothing else is written unless the person presses a
 * named button. The next date is never stored: it follows from the log, the rule and how often (Phases.reviewDueOf).
 *
 * Pure: no clock (today arrives as text, the moment as `at`), no engine (a run is the review effect's, on a press), no storage.
 *
 *   reviewOf(entries, id, { today, typed, page, source })   the page, as data (ids and slots for copy/review.js)
 *   reviewBoxesOf(plan, { today })                          what the Living-on-it boxes start from: the last month recorded,
 *                                                           else the plan's own pots; what is recorded as taken since 6 April
 *   checkReview(plan, typed, { today })                     the boxes as typed: { values, errors, shown, entered }
 *   reviewEntryOf(plan, { phase, today, typed, at, reading })   the entry "Save this review" appends to the log
 *   reviewSavePatch(plan, { today, typed, at, reading })    → { ok, problem, patch: { phases }, entry }: ONE write
 *                                                           (PHASE_WRITES), refused on a closing or closed plan, the example,
 *                                                           a plan not in Moving or Living on it, and boxes with a problem
 *   phaseChoicePatch(plan, part, value, { at })             → { ok, problem, patch: { phases } }: the rule, how often, the
 *                                                           window or the saving level, each ONE write with a history line
 *   onTrackOf(drift, { start, monthsLeft, windowMonths })   whether the move is on course to finish by the stop
 *
 * The runs (only on a press; the review effect runs them in the worker, stressPanelRun.runStressRow):
 *   runInputsOf(plan, { today, typed, phase })              what a run is worked out on: the pots and what was taken (Living
 *                                                           on it), the rule, the plan document's version
 *   reviewRunKeyOf(plan, today, inputs)                     the key a run's results are held under, and its reading kept with:
 *                                                           the plan as stressPanel.stressKeyOf reads it, and the inputs
 *   runRowsOf(R)                                            the rows a press runs: Moving 'asPlanned' then 'whole' (what is
 *                                                           held, whole) — 'asPlanned' alone with no pension record to read;
 *                                                           Living on it 'today' (the plan from today on the pots entered); a
 *                                                           locked ladder none (its document's own figure is its reading)
 *   reviewSettingsOf(plan, { pots, today })                 the run-only settings of 'today': the plan's effective settings with
 *                                                           the pots entered in the plan's own proportions, run from today
 *                                                           (potsAsOf POTS_TODAY) — never saved
 *   readingOf(result, key)                                  the reading a review keeps: { source: 'run', key, weighted, sumW, n,
 *                                                           fixedAge: { lasts, n, age }, typicalLeft }
 *   documentReadingOf(plan)                                 a locked ladder's reading, from its document ({ source: 'document' }):
 *                                                           kept, never counted for off course
 *
 * The entry (Phases.js, `review.log`):
 *   { at, phase: 'moving'|'drawing', documentAt|null, pots: { pension, isa, other }|null, entered: { pots, took },
 *     took|null, choice: 'less'|'keep'|'more'|null, reading|null, guardrail: 'within'|'above'|'below'|null,
 *     drift: { shares, bonds, cash, diversifiers }|null, maxDrift|null }
 * `entered` says which figures the person typed (a default saved untouched is false), so the words say "the figures you
 * entered" only of those.
 */
import { planPage, dateOf, monthWords, offCourseWordsOf } from './read.js';
import { dayWords } from './dates.js';
import { pounds } from './income.js';
import { REVIEW_FIELDS, REVIEW_CHOICES } from './schema.js';
import { effectiveStressSettings, whereAmIInputs, moveInputs, historyAscending } from '../../services/PlanReading.js';
import { whereAmI, guardrailOf, bandMeasure, GUARDRAIL_STRATEGIES } from '../../services/PlanDocument.js';
import { driftOf } from '../../services/TransitionPlanner.js';
import { RISK_PRESETS } from '../../services/GlidepathService.js';
import { strategyIdOf, phasesOf, phasesPatch, reviewLogOf, reviewRuleOf, reviewEveryOf, ruleOrNull, windowYearsOrNull, windowOf, windowChosenOf, moveWindowOf, monthsBetween, OFF_COURSE, WINDOW, SAVING_LEVELS, REVIEW_EVERY } from '../../services/Phases.js';
import { startLaterOf } from '../../services/PlanMove.js';
import { taxYearStartOf, taxYearLabel } from '../../services/PlanTiming.js';
import { documentAtOf } from '../../services/PlanAmendments.js';
import { isExamplePlan } from '../../services/GuestPlans.js';
import { isClosedPlan } from '../../services/PlanClosed.js';
import { normaliseHoldings, holdingsSummary } from '../../services/HoldingsRecord.js';
import { POTS_TODAY } from '../../services/PlanFromToday.js';
import { hashOf, canonical, stressKeyOf, lockedLadderOf } from './stressPanel.js';
import { chanceWords, twentiethsOfFutures } from '../shared/format.js';

const isObj = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const isNum = (v) => typeof v === 'number' && Number.isFinite(v);
const num = (v) => (Number.isFinite(+v) ? +v : 0);
const r0 = (v) => Math.round(num(v));
const blank = (v) => v === undefined || v === null || String(v).trim() === '';
const copy = (v) => (v === undefined ? undefined : JSON.parse(JSON.stringify(v)));
const isLocked = (plan) => !!(plan && plan.decisionTool && plan.decisionTool.settings && plan.decisionTool.settings.locked);
const BUCKETS = ['shares', 'bonds', 'cash', 'diversifiers'];
/** The phases a review is saved in (Saving's review is its check-in). */
export const REVIEW_PHASES = Object.freeze(['moving', 'drawing']);
/** How far behind the move may be and still be on course to finish by the stop, in points of the pension. */
export const ON_TRACK_SLACK = 5;

function safeSettings(plan, now) {
  try { return effectiveStressSettings(plan, { now }); } catch { return (plan && plan.stressTool && plan.stressTool.settings) || {}; }
}

// ---- the boxes (Living on it) ---------------------------------------------------------------------------------------------

/** The latest month recorded that holds the pots (equity, bond and cash; the ISA and the taxable account when it says them). */
function lastPotRecordOf(plan) {
  const hist = historyAscending(plan).filter((h) => ['equity', 'bond', 'cash'].some((k) => isNum(+h[k]) && h[k] !== null && h[k] !== ''));
  return hist.length ? hist[hist.length - 1] : null;
}

/**
 * What the Living-on-it boxes start from: the pots as the last month recorded says them, else as the plan has them (its
 * settings); what was taken since 6 April, as the months recorded in this tax year add up (taken before tax, whereAmI's own).
 * @returns {{ pots: { pension, isa, other }, potsFrom: 'record'|'plan', potsAsOf: string|null, took: number|null, tookFrom: 'record'|null, tookMonths: number }}
 */
export function reviewBoxesOf(plan, { today }) {
  const now = dateOf(today);
  const rec = lastPotRecordOf(plan);
  let pots, potsFrom, potsAsOf = null;
  if (rec) {
    pots = { pension: r0(num(rec.equity) + num(rec.bond) + num(rec.cash) + num(rec.diversifiers)), isa: r0(rec.isa), other: r0(rec.gia) };
    potsFrom = 'record';
    potsAsOf = String(rec.date).slice(0, 7);
  } else {
    const ss = safeSettings(plan, now);
    pots = { pension: r0(num(ss.equityMin) + num(ss.bondMin) + num(ss.cashTarget) + num(ss.diversifierStart)), isa: r0(ss.isaBalance), other: r0(ss.taxableStart) };
    potsFrom = 'plan';
  }
  const ty = taxYearStartOf(now);
  const key = String(ty % 100).padStart(2, '0') + '/' + String((ty + 1) % 100).padStart(2, '0');
  const recs = historyAscending(plan).filter((h) => h.taxYear === key);
  const took = recs.length ? r0(recs.reduce((t, h) => t + num(h.sipp) + num(h.other) + num(h.state), 0)) : null;
  return { pots, potsFrom, potsAsOf, took, tookFrom: recs.length ? 'record' : null, tookMonths: recs.length };
}

function parseMoney(t, f) {
  if (blank(t)) return { error: f.required ? 'required' : null, value: null };
  const s = String(t).replace(/[£,\s]/g, '');
  if (!/^\d{1,9}(\.\d{1,2})?$/.test(s)) return { error: 'notANumber', value: null };
  const n = Math.round(+s);
  if (n < f.min) return { error: 'tooLow', value: n };
  if (n > f.max) return { error: 'tooHigh', value: n };
  return { error: null, value: n };
}

/**
 * The boxes as typed over what they start from: { values, errors, shown, entered } — `entered.pots` / `entered.took` true
 * only when the person typed a figure that differs from the one the box started from.
 */
export function checkReview(plan, typed, { today }) {
  const b = reviewBoxesOf(plan, { today });
  const start = { 'rv.pension': String(b.pots.pension), 'rv.isa': String(b.pots.isa), 'rv.other': String(b.pots.other), 'rv.took': b.took == null ? '' : String(b.took), 'rv.choice': '' };
  const t = isObj(typed) ? typed : {};
  const shown = {}, values = {}, errors = {};
  for (const f of REVIEW_FIELDS) {
    const raw = f.path in t ? t[f.path] : start[f.path];
    shown[f.path] = blank(raw) ? '' : String(raw);
    if (f.type === 'choice') {
      if (blank(raw)) continue;
      if (f.options.includes(String(raw))) values[f.path] = String(raw); else errors[f.path] = 'notAnOption';
      continue;
    }
    const r = parseMoney(raw, f);
    if (r.error) errors[f.path] = r.error; else if (r.value != null) values[f.path] = r.value;
  }
  const differs = (p) => p in t && !blank(t[p]) && String(values[p]) !== start[p];
  const entered = { pots: ['rv.pension', 'rv.isa', 'rv.other'].some(differs), took: differs('rv.took') };
  return { values, errors, shown, entered, start: b };
}

// ---- the readings ---------------------------------------------------------------------------------------------------------

/**
 * The Living-on-it reading against the plan as locked: the pots against the band for now (whereAmI; with the figures the
 * person entered when they entered any), the rate taken against the start (guardrailOf), what was taken against what the plan
 * says for the year, and the ladder's place. Null without a plan document; no band, rate or taken line on a plan stored with a
 * later start whose year 0 is still ahead.
 */
function livingReadingOf(plan, { now, pots, entered, older }) {
  const doc = plan && plan.planDocument;
  if (!doc || !doc.timing) return null;
  let w = null;
  try {
    const { ladderInDocument, ...inputs } = whereAmIInputs(plan, { now });
    void ladderInDocument;
    let potsToday = null;
    if (entered && pots) {
      const m = bandMeasure(doc, { planYear: Math.max(0, taxYearStartOf(now) - num(doc.timing.firstTaxYear)) });
      potsToday = num(pots.pension) + (m.isa ? num(pots.isa) : 0) + (m.gia ? num(pots.other) : 0);
    }
    w = whereAmI(doc, { ...inputs, potsToday });
  } catch { w = null; }
  if (!w || older) return w ? { w, band: null, guardrail: null, taken: null, ladder: w.ladder || null } : null;
  const p = w.pot;
  const band = p && p.verdict === 'band' && isNum(p.real) && isNum(p.p10) && isNum(p.p90)
    ? { id: p.band === 'below p10' ? 'below' : p.band === 'p10–p50' ? 'lower' : p.band === 'p50–p90' ? 'upper' : 'above', slots: { pot: pounds(p.real), low: pounds(p.p10), mid: pounds(p.p50), high: pounds(p.p90) } }
    : null;
  let g = null;
  if (GUARDRAIL_STRATEGIES.includes(w.strategyId)) { try { g = guardrailOf(doc, w); } catch { g = null; } }
  const inc = w.incomeThisYear || null;
  const taken = inc && inc.planned != null ? { planned: r0(inc.planned), year: w.taxYear } : null;
  return { w, band, guardrail: g, taken, ladder: w.ladder || null };
}

/**
 * Where the move stands (Moving): months left to the stop, how far each bucket of what is held is from the mix the plan moves
 * to on today's pension (PlanReading.moveInputs `fromSettings`: on an unlocked plan against its settings, in memory), whether
 * it is on course, the lines nothing places, and on a ladder the years not yet held.
 */
function movingReadingOf(plan, { now, life, log }) {
  const rec = normaliseHoldings(plan && plan.holdings);
  const record = holdingsSummary(rec).count > 0;
  let mv = null; try { mv = moveInputs(plan, { now, fromSettings: true }); } catch { mv = null; }
  const d = mv && mv.diff ? driftOf(mv.diff) : null;
  const w = moveWindowOf(life);
  const windowMonths = w && w.from && w.to ? monthsBetween(w.from, w.to) : null;
  const out = { record, monthsLeft: w && isNum(w.monthsLeft) ? w.monthsLeft : null, windowMonths, stop: w && w.to ? w.to : null,
    buckets: null, maxDrift: null, onTrack: null, untagged: [], ladder: null, ladderLater: !!(mv && mv.ladderLater), noReading: false };
  if (mv && mv.diff && Array.isArray(mv.diff.unknown)) out.untagged = mv.diff.unknown.map((u) => String(u.label || u.name || u.ticker || '')).filter(Boolean);
  if (d && d.kind === 'buckets') {
    const inPlay = num(mv.diff.inPlay);
    out.buckets = BUCKETS.map((b) => { const x = mv.diff.buckets[b] || { held: 0, target: 0 }; return { bucket: b, held: Math.round(100 * num(x.held) / inPlay), plan: Math.round(100 * num(x.target) / inPlay) }; })
      .filter((x) => x.held > 0 || x.plan > 0);
    out.drift = { ...d.drift };
    out.maxDrift = d.maxDrift;
    // the move's start: the first Moving review's drift, else how far the plan's saving level is from the mix it moves to
    const first = log.find((e) => e.phase === 'moving' && isNum(e.maxDrift));
    let start = first ? first.maxDrift : null;
    if (start == null) {
      const level = phasesOf(plan, { now }).saving.strategy.level;
      const P = RISK_PRESETS[level] || RISK_PRESETS.balanced;
      const mix0 = plan && plan.planDocument && Array.isArray(plan.planDocument.targetMix) && plan.planDocument.targetMix[0] ? plan.planDocument.targetMix[0] : null;
      const tgt = mix0 ? { equity: num(mix0.equity) / 100, bond: num(mix0.bond) / 100, cash: num(mix0.cash) / 100 } : targetSharesOf(mv);
      start = tgt ? Math.round(100 * Math.max(Math.abs(P.equity - tgt.equity), Math.abs(P.bond - tgt.bond), Math.abs(P.cash - tgt.cash))) : null;
    }
    out.onTrack = onTrackOf(d, { start, monthsLeft: out.monthsLeft, windowMonths: out.windowMonths });
    out.toMove = BUCKETS.reduce((t, b) => t + Math.max(0, d.drift[b] || 0), 0);
  } else if (d && d.kind === 'ladder') {
    const thisTY = Number(mv.target && mv.target.thisTaxYear);
    const years = [...new Set((mv.diff.buy || []).filter((b) => b.kind === 'gilt' && Array.isArray(b.taxYears)).flatMap((b) => b.taxYears.map(Number)))].sort((p, q) => p - q);
    out.ladder = { held: d.rungs.held, needed: d.rungs.needed, years: years.map(taxYearLabel), gapSoon: !!d.gapSoon, soon: years.filter((Y) => Y === thisTY || Y === thisTY + 1).map(taxYearLabel) };
  } else if (mv && mv.diff && mv.diff.kind === 'none') out.noReading = true;
  return out;
}

/** The target's shares of the pension money in play, from a pot plan's diff: { equity, bond, cash } as shares of 1. */
function targetSharesOf(mv) {
  const b = mv && mv.diff && mv.diff.buckets;
  const inPlay = mv && mv.diff ? num(mv.diff.inPlay) : 0;
  if (!b || !(inPlay > 0)) return null;
  const t = (k) => num(b[k] && b[k].target) / inPlay;
  return { equity: t('shares'), bond: t('bonds') + t('diversifiers'), cash: t('cash') };
}

/**
 * On course to finish the move by the stop (buckets only): at the start of the window the move was `start` points away; by
 * now it is expected to be `start × monthsLeft ÷ windowMonths`; on course when the largest bucket's drift is within
 * ON_TRACK_SLACK of that. Null when it cannot be read.
 */
export function onTrackOf(d, { start, monthsLeft, windowMonths }) {
  if (!d || d.kind !== 'buckets' || !isNum(d.maxDrift) || !isNum(start) || !isNum(monthsLeft) || !(windowMonths > 0)) return null;
  const expected = start * Math.min(1, Math.max(0, monthsLeft / windowMonths));
  return { on: d.maxDrift <= expected + ON_TRACK_SLACK, expected: Math.round(expected) };
}

// ---- the runs -------------------------------------------------------------------------------------------------------------

const POT_KEYS = ['equityMin', 'bondMin', 'cashTarget', 'diversifierStart'];

/** What a run is worked out on (see the header); nothing typed on a Moving review (it reads what is held, on What you hold). */
export function runInputsOf(plan, { today, typed = {}, phase }) {
  const rule = reviewRuleOf(plan);
  const base = { phase, rule, documentAt: documentAtOf(plan) || null };
  if (phase !== 'drawing') return { ...base, pots: null, took: null };
  const c = checkReview(plan, typed, { today });
  const v = c.values;
  return { ...base, pots: v['rv.pension'] == null ? null : { pension: v['rv.pension'], isa: v['rv.isa'] || 0, other: v['rv.other'] || 0 }, took: v['rv.took'] != null ? v['rv.took'] : null };
}

/** The key a run is held under and its reading kept with (see the header); null for a plan with no id. */
export function reviewRunKeyOf(plan, today, inputs) {
  const k = stressKeyOf(plan, today);
  return k ? k + '|' + hashOf(canonical(inputs)) : null;
}

/** Whether a plan holds a bought ladder in its document, locked: its own figure is its reading, never priced again. */
const lockedLadder = (plan) => { try { return lockedLadderOf(plan, strategyIdOf(plan)); } catch { return false; } };

/** The rows a press runs on the review page `R` (see the header). */
export function runRowsOf(R, plan) {
  if (!R || !R.found || !R.editable) return [];
  if (R.phase === 'moving') return R.moving && R.moving.runOn === 'held' ? ['asPlanned', 'whole'] : ['asPlanned'];
  if (R.phase === 'drawing') return lockedLadder(plan) ? [] : ['today'];
  return [];
}

/** The run-only settings of 'today' (see the header): never saved, never in a plan or a document. */
export function reviewSettingsOf(plan, { pots, today }) {
  const now = dateOf(today);
  const s = copy(safeSettings(plan, now));
  const P = Math.max(0, Math.round(num(pots && pots.pension)));
  const T = POT_KEYS.reduce((t, k) => t + num(s[k]), 0);
  if (T > 0) {
    const f = P / T;
    for (const k of ['equityMin', 'bondMin', 'diversifierStart']) s[k] = Math.round(num(s[k]) * f);
    s.cashTarget = Math.max(0, P - s.equityMin - s.bondMin - s.diversifierStart);
    if (isObj(s.strategyParams) && num(s.strategyParams.sippTotal) > 0) s.strategyParams = { ...s.strategyParams, sippTotal: Math.round(s.strategyParams.sippTotal * f) };
  } else {
    const B = RISK_PRESETS.balanced;
    s.equityMin = Math.round(P * B.equity); s.bondMin = Math.round(P * B.bond); s.diversifierStart = 0;
    s.cashTarget = Math.max(0, P - s.equityMin - s.bondMin);
  }
  s.isaBalance = Math.max(0, Math.round(num(pots && pots.isa)));
  s.taxableStart = Math.max(0, Math.round(num(pots && pots.other)));
  s.potsAsOf = POTS_TODAY;
  return s;
}

/** The reading a review keeps of a run's result (see the header); null for a row not tried or that could not be. */
export function readingOf(result, key) {
  const a = result && !result.na && isObj(result.a) ? result.a : null;
  if (!a) return null;
  const share = isNum(a.fixedAge) ? a.fixedAge : isNum(a.share) ? a.share : null;
  const futures = isNum(a.futures) && a.futures > 0 ? a.futures : null;
  return {
    source: 'run', key,
    weighted: isNum(a.weighted) ? a.weighted : null, sumW: isNum(a.sumW) ? a.sumW : null, n: isNum(a.n) ? a.n : null,
    fixedAge: { lasts: share != null && futures ? Math.round(share * futures) : null, n: futures, age: isNum(a.planToAge) ? Math.round(a.planToAge) : null },
    typicalLeft: isNum(a.typicalLeft) ? Math.round(a.typicalLeft) : null
  };
}

/** A locked ladder's reading, from its document (see the header): its weighted chance and its fixed-age count as locked. */
export function documentReadingOf(plan) {
  const doc = plan && plan.planDocument;
  const def = doc && isObj(doc.assumptions) && isObj(doc.assumptions.success) ? doc.assumptions.success : null;
  const w = def && isObj(def.weighted) && isNum(def.weighted.chance) ? def.weighted.chance : null;
  return { source: 'document', key: null, weighted: w, sumW: null, n: null, fixedAge: { lasts: null, n: null, age: null }, typicalLeft: null };
}

const poundsK = (v) => pounds(Math.round(Math.max(0, num(v)) / 1000) * 1000);
/** A run's figures in words: the chance counting how long people live, the fixed-age count and its age, what is typically left. */
function figuresOf(result) {
  const a = result && !result.na && isObj(result.a) ? result.a : null;
  if (!a) return null;
  const share = isNum(a.fixedAge) ? a.fixedAge : isNum(a.share) ? a.share : 0;
  return {
    chance: isNum(a.weighted) && a.weighted !== null ? chanceWords(a.weighted, { sumW: a.sumW, n: a.n }) : null,
    fixed: twentiethsOfFutures(share),
    age: isNum(a.planToAge) ? String(Math.round(a.planToAge)) : '',
    left: isNum(a.typicalLeft) ? poundsK(a.typicalLeft) : null
  };
}

/**
 * The run held for this page (the review effect's, state.review), in words — only when it was run on the plan and the inputs
 * as they are now (its key). Moving: what is held against as planned, or the plan as it stands; Living on it: from today.
 */
function resultOf(R, held) {
  const run = R.run;
  if (!run || !held || held.key !== run.key || held.planId !== R.id) return { status: 'idle' };
  if (held.status === 'working') return { status: 'working', done: run.rows.filter((id) => held.rows[id]).length, total: run.rows.length };
  if (held.status === 'failed') return { status: 'failed', reason: held.reason || null };
  if (held.status !== 'done') return { status: 'idle' };
  const main = held.rows[R.phase === 'moving' ? (run.rows.includes('whole') ? 'whole' : 'asPlanned') : 'today'];
  const me = figuresOf(main);
  if (!me) return { status: 'done', id: 'na' };
  if (R.phase === 'moving' && run.rows.includes('whole')) {
    const ref = figuresOf(held.rows.asPlanned);
    return { status: 'done', id: me.chance ? 'held' : 'heldFixed', slots: { ...me, ref: ref ? ref.chance || ref.fixed : '', refFixed: ref ? ref.fixed : '', refLeft: ref && ref.left ? ref.left : '' }, left: !!me.left };
  }
  if (R.phase === 'moving') return { status: 'done', id: me.chance ? 'asPlanned' : 'asPlannedFixed', slots: me, left: !!me.left };
  const on = R.living && R.living.entered && R.living.entered.pots ? 'entered' : R.living && R.living.start.potsFrom === 'record' ? 'recorded' : 'plan';
  return { status: 'done', id: me.chance ? 'today' : 'todayFixed', on, slots: me, left: !!me.left };
}

// ---- the page -------------------------------------------------------------------------------------------------------------

/** How often, said as the review's title says it. */
const oftenOf = (phase, every) => (every === 'quarter' ? 'quarter' : every === 'month' ? 'month' : phase === 'drawing' ? 'taxYear' : 'year');

/**
 * The review page (see the header). `page` is read.js planPage's reading of this plan (the plan source has it); without it, it
 * is read here. `typed` the boxes as typed (the plan draft). Nothing here runs or writes.
 */
export function reviewOf(entries, id, { today, typed = {}, page = null, source = 'account', held = null } = {}) {
  const pg = page && page.found && String(page.id) === String(id) ? page : planPage(entries, id, null, { today, source });
  if (!pg.found) return { found: false, id: String(id || '') };
  const now = dateOf(today);
  const list = (entries || []).filter((e) => e && e.plan && typeof e.plan === 'object' && e.plan.id != null);
  const plan = list.find((e) => String(e.plan.id) === String(id)).plan;
  const life = pg.life || null;
  const phase = life && ['saving', 'moving', 'drawing', 'closed'].includes(life.key) ? life.key : null;
  const locked = isLocked(plan);
  const example = isExamplePlan(plan);
  const closing = phase !== 'closed' && (pg.closing === true || plan.closedAt != null) ? { month: monthWords(String(plan.closedAt || '').slice(0, 7)) } : null;
  const closed = phase === 'closed' || isClosedPlan(plan) && !closing;
  // a choice or a save may be made: not a plan shown as saved, the example, or one with a close (the plan that carries it on keeps them)
  const editable = !pg.readonly && !example && !closing && !closed && phase !== null;
  const span = moveWindowOf(life);
  const ph = phasesOf(plan, { now, phase, stop: span ? span.to : undefined });
  const rule = reviewRuleOf(plan);
  const every = phase === 'saving' ? ph.review.every : reviewEveryOf(plan);
  const due = pg.reviewDue || null;
  const log = reviewLogOf(plan);
  const R = {
    found: true, id: String(plan.id), name: pg.name, phase, locked, example, readonly: !!pg.readonly, source, editable,
    closing, closed,
    often: oftenOf(phase, every),
    due: due ? { next: due.next ? monthWords(due.next.slice(0, 7)) : null, due: !!due.due } : null,
    offCourse: pg.offCourse && pg.offCourse.off ? { ...offCourseWordsOf(pg.offCourse), kind: pg.offCourse.rule.kind } : null,
    confirmStop: life && life.confirmStop ? { stop: monthWords(life.stop) } : null,
    count: log.filter((e) => REVIEW_PHASES.includes(e.phase)).length,
    last: (() => { const l = log.filter((e) => e.phase === phase); return l.length ? { on: dayWords(l[l.length - 1].at) } : null; })()
  };
  // the choices: the rule and how often in every phase (Saving's how often is the check-in's own); the window and the
  // saving level while saving or moving
  const guardrailOffered = phase === 'drawing' && locked && (() => { try { const lr = livingReadingOf(plan, { now, pots: null, entered: false, older: false }); return !!(lr && lr.guardrail); } catch { return false; } })();
  R.rule = {
    kind: rule.kind, line: rule.kind === 'success' ? Math.round(20 * rule.floor) : null, stored: ph.stored.rule,
    options: [...OFF_COURSE.floors.map((f) => ({ value: 'success:' + Math.round(20 * f), kind: 'success', line: Math.round(20 * f) })), ...(guardrailOffered || rule.kind === 'guardrails' ? [{ value: 'guardrails', kind: 'guardrails', line: null }] : [])],
    value: rule.kind === 'success' ? 'success:' + Math.round(20 * rule.floor) : 'guardrails'
  };
  R.every = phase === 'saving' ? null : { value: every, stored: ph.stored.every, options: [...REVIEW_EVERY] };
  if (phase === 'saving' || phase === 'moving') {
    const wnd = windowOf(plan, { now, stop: span ? span.to : undefined });
    R.moveWindow = { years: wnd.years, stored: windowChosenOf(plan), options: Array.from({ length: WINDOW.max - WINDOW.min + 1 }, (_, i) => WINDOW.min + i), from: wnd.from ? monthWords(wnd.from) : null, to: wnd.to ? monthWords(wnd.to) : null };
    R.level = { value: ph.saving.strategy.level, stored: ph.stored.saving, options: [...SAVING_LEVELS] };
  } else { R.moveWindow = null; R.level = null; }

  if (phase === 'moving') {
    const m = movingReadingOf(plan, { now, life, log });
    R.moving = {
      ...m,
      monthsLeftWords: m.monthsLeft == null ? null : m.monthsLeft === 1 ? '1 month' : m.monthsLeft + ' months',
      stopWords: m.stop ? monthWords(m.stop) : null,
      // what the move's test runs on: what is held when a pension record can be read, else the plan as it stands
      runOn: m.record && !m.noReading && (m.buckets || m.ladder) ? 'held' : 'asPlanned'
    };
  } else R.moving = null;

  if (phase === 'drawing') {
    const ty = taxYearStartOf(now);
    let later = null; try { const sl = startLaterOf(plan, now); later = sl && sl.start > ty ? { year: String(sl.start) } : null; } catch { later = null; }
    const c = checkReview(plan, typed, { today });
    const lr = locked ? livingReadingOf(plan, { now, pots: c.values['rv.pension'] != null ? { pension: c.values['rv.pension'], isa: c.values['rv.isa'] || 0, other: c.values['rv.other'] || 0 } : null, entered: c.entered.pots, older: !!later }) : null;
    const took = c.values['rv.took'] != null ? c.values['rv.took'] : null;
    R.living = {
      locked, later,
      fields: REVIEW_FIELDS.filter((f) => locked || ['rv.pension', 'rv.isa', 'rv.other'].includes(f.path)).map((f) => ({
        path: f.path, type: f.type, options: f.type === 'choice' ? f.options : null, applies: true, shown: c.shown[f.path] || '', saved: null, error: c.errors[f.path] || null
      })),
      errors: c.errors,
      start: { potsFrom: c.start.potsFrom, potsAsOf: c.start.potsAsOf ? monthWords(c.start.potsAsOf) : null, tookFrom: c.start.tookFrom, tookMonths: c.start.tookMonths },
      entered: c.entered,
      taxYearFrom: String(ty),
      band: lr ? lr.band : null,
      guardrail: lr && lr.guardrail ? { state: lr.guardrail.state, slots: lr.guardrail.slots } : null,
      taken: lr && lr.taken && took != null ? { took: pounds(took), planned: pounds(lr.taken.planned), year: lr.taken.year, entered: c.entered.took } : null,
      ladder: lr && lr.ladder && typeof lr.ladder.instruction === 'string' ? { instruction: lr.ladder.instruction } : null,
      choice: c.values['rv.choice'] || null
    };
  } else R.living = null;

  // "Save this review": Moving and Living on it, on a plan that may take it
  R.save = REVIEW_PHASES.includes(phase) && editable ? { allowed: !(R.living && Object.keys(R.living.errors).length) } : null;
  // the run a press makes (only on a press: the review effect), the key it is held under, and what is held for it in words
  const rows = runRowsOf(R, plan);
  const inputs = rows.length ? runInputsOf(plan, { today, typed, phase }) : null;
  R.run = rows.length && !(phase === 'drawing' && !inputs.pots) ? { key: reviewRunKeyOf(plan, today, inputs), rows, pots: inputs.pots, label: phase === 'moving' ? (rows.includes('whole') ? 'held' : 'asPlanned') : 'today' } : null;
  R.result = R.run ? resultOf(R, held) : { status: 'idle' };
  R.documentReading = phase === 'drawing' && lockedLadder(plan);
  return R;
}

// ---- the writes -----------------------------------------------------------------------------------------------------------

/** The phase a plan is in today, as the page reads it (LifeStage.stageOf through planPage). */
function phaseNow(plan, today) {
  const pg = planPage([{ plan, newer: false, failed: false }], plan.id, null, { today });
  return pg.found && pg.life && pg.life.key ? { phase: pg.life.key, closing: pg.closing === true } : { phase: null, closing: false };
}

/**
 * The entry "Save this review" appends (see the header). `reading` is a run's reading kept with it (the review effect's) or
 * null; Moving keeps no pots (it asks what is held, on What you hold).
 */
export function reviewEntryOf(plan, { phase, today, typed = {}, at, reading = null }) {
  const now = dateOf(today);
  const entry = { at, phase, documentAt: documentAtOf(plan) || null, pots: null, entered: { pots: false, took: false }, took: null, choice: null, reading: reading ? copy(reading) : null, guardrail: null, drift: null, maxDrift: null };
  if (phase === 'drawing') {
    const c = checkReview(plan, typed, { today });
    const pots = { pension: c.values['rv.pension'] != null ? c.values['rv.pension'] : null, isa: c.values['rv.isa'] != null ? c.values['rv.isa'] : 0, other: c.values['rv.other'] != null ? c.values['rv.other'] : 0 };
    entry.pots = pots.pension == null ? null : pots;
    entry.entered = { ...c.entered };
    entry.took = c.values['rv.took'] != null ? c.values['rv.took'] : null;
    entry.choice = REVIEW_CHOICES.includes(c.values['rv.choice']) ? c.values['rv.choice'] : null;
    // a plan stored with a later start whose year 0 is ahead: nothing is read against a later year's figure
    let older = false; try { const sl = startLaterOf(plan, now); older = !!(sl && sl.start > taxYearStartOf(now)); } catch { older = false; }
    if (isLocked(plan) && !older) {
      const lr = livingReadingOf(plan, { now, pots: entry.pots, entered: c.entered.pots, older });
      entry.guardrail = lr && lr.guardrail ? lr.guardrail.state : null;
    }
  }
  if (phase === 'moving') {
    let mv = null; try { mv = moveInputs(plan, { now, fromSettings: true }); } catch { mv = null; }
    const d = mv && mv.diff ? driftOf(mv.diff) : null;
    if (d && d.kind === 'buckets') { entry.drift = { ...d.drift }; entry.maxDrift = d.maxDrift; }
  }
  return entry;
}

/**
 * The reading "Save this review" keeps: the run held for this page when its key is the key of the inputs being saved (else
 * none, as the panel refuses an old result); a locked ladder's own document figure.
 */
export function savedReadingOf(plan, { today, typed = {}, phase, held = null }) {
  if (phase === 'drawing' && lockedLadder(plan)) return documentReadingOf(plan);
  if (!held || held.status !== 'done' || !isObj(held.rows)) return null;
  const key = reviewRunKeyOf(plan, today, runInputsOf(plan, { today, typed, phase }));
  if (!key || held.key !== key || String(held.planId) !== String(plan.id)) return null;
  const main = phase === 'moving' ? (held.rows.whole || held.rows.asPlanned) : held.rows.today;
  return readingOf(main, key);
}

/** "Save this review" (see the header): ONE write of the whole `phases` root with the entry on the end of the log. */
export function reviewSavePatch(plan, { today, typed = {}, at, reading = undefined, held = null } = {}) {
  const fail = (problem) => ({ ok: false, problem, patch: {}, entry: null });
  if (!plan || isExamplePlan(plan)) return fail('example');
  const { phase, closing } = phaseNow(plan, today);
  if (closing || plan.closedAt != null || isClosedPlan(plan)) return fail('closed');
  if (!REVIEW_PHASES.includes(phase)) return fail('notNow');
  if (phase === 'drawing') { const c = checkReview(plan, typed, { today }); if (Object.keys(c.errors).length) return fail('problems'); }
  const kept = reading !== undefined ? reading : savedReadingOf(plan, { today, typed, phase, held });
  const entry = reviewEntryOf(plan, { phase, today, typed, at, reading: kept });
  let patch;
  try { patch = phasesPatch(plan, 'review.log', entry, { at }); } catch { return fail('problems'); }
  return { ok: true, problem: null, patch, entry };
}

/** The parts a person chooses on the review, and how a pressed value is read. */
export const CHOICE_PARTS = Object.freeze(['window', 'saving.level', 'review.every', 'review.rule']);
/** A pressed rule ('success:17', 'guardrails') as Phases reads one; null when it is not one. */
export function ruleOfChoice(value) {
  if (value === 'guardrails') return { kind: 'guardrails' };
  const m = /^success:(\d{1,2})$/.exec(String(value || ''));
  if (!m) return null;
  return ruleOrNull({ kind: 'success', floor: +m[1] / 20 });
}

/** One choice (see the header): ONE write of the whole `phases` root with the one part set and a history line. */
export function phaseChoicePatch(plan, part, value, { at, today } = {}) {
  const fail = (problem) => ({ ok: false, problem, patch: {} });
  if (!CHOICE_PARTS.includes(part)) return fail('problems');
  if (!plan || isExamplePlan(plan)) return fail('example');
  if (plan.closedAt != null || isClosedPlan(plan)) return fail('closed');
  if (today) { const { phase, closing } = phaseNow(plan, today); if (closing) return fail('closed'); if (phase === null || phase === 'closed') return fail('notNow'); }
  let v = value;
  if (part === 'window') { v = windowYearsOrNull(+value); if (v == null) return fail('problems'); }
  if (part === 'saving.level' && !SAVING_LEVELS.includes(value)) return fail('problems');
  if (part === 'review.every' && !REVIEW_EVERY.includes(value)) return fail('problems');
  if (part === 'review.rule') { v = ruleOfChoice(value); if (!v) return fail('problems'); }
  let patch;
  try { patch = phasesPatch(plan, part, v, { at }); } catch { return fail('problems'); }
  return { ok: true, problem: null, patch };
}
