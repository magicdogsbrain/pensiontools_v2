/**
 * "Moving to your plan's mix" (research/v7/holdings-and-move.md §3; road-to-7.md step 10): from what the person holds to
 * the plan as locked — the status, what skipping it costs, the saver's rule, the cash to hold now, the buy and sell lists
 * with their tick-offs, "Already held" and "Left alone", the totals, the schedule, the order sheet for a ladder plan (the
 * document's rungs, never re-priced; held back behind "Show the sheet anyway" while the plan was sized on an assumed
 * State Pension), and for the ladder + rotation the watch and the sell ticket. The target is always the plan document
 * (the plan as locked), never live settings. Pure: the plan brought up to date in memory, today's date, the index figures
 * the effect fetched, and the one run's result held in page memory; nothing here writes, runs, fetches or reads a clock.
 *
 *   savedMove(plan, { today, index })        the target, the diff, the progress, the schedule, the sheet, the watch — as data
 *   moveOf(entries, id, { today, index, M, page })  everything the screen draws (M: state.move, the one run on the held mix;
 *                                            page: the plan's page reading, planPage's, when the caller has it)
 *   heldMode(life)                           whether the page is what is held rather than a move (7.11.1, below)
 *   tickPatch(plan, key, { today, done })    → { ok, patch: { transition }, previous, line }: one tick-off, the object whole
 *   heldMixSettings(plan, { today })         the plan's effective settings with the mix AS HELD (moveRun.js runs them)
 *   runKeyOf                                 lasts.js's (the held run is filed under the plan's key)
 *
 * Every path written is in schema.js MOVE_WRITES (tested); the tick is TransitionPlanner.tickMove / untickMove, the
 * planner's own; the target, the diff, the progress and the schedule are TransitionPlanner's through PlanReading.moveInputs.
 *
 * By phase (7.11.1): the phase is the one the plan's home reads (read.js planPage `life`, LifeStage.stageOf — agreements
 * first, then facts). Living on it, and Moving once what is held was accepted (7.10.0's agreement), the page is not a move:
 * `mode` 'held' and `heldInfo` say, as information, the rungs held against the plan (a rung not fully bought with its line
 * of the order sheet), what else the pension holds and what each line is doing, the cash for the cash years, and where what
 * is held can be tested and accepted. The reading still carries the lists, the totals and the schedule
 * (as it does for a saver waiting), but no view draws them there. Moving otherwise (`mode` 'move'), and a saver waiting
 * (`mode` 'waiting'), as before.
 */
import { planStage, effectiveStressSettings, moveInputs } from '../../services/PlanReading.js';
import { sequence, tickMove, untickMove } from '../../services/TransitionPlanner.js';
import { normaliseHoldings } from '../../services/HoldingsRecord.js';
import { proportions } from '../../services/Holdings.js';
import { orderSheetRows } from '../../strategies/GiltLadderPlan.js';
import { rotationWatch } from '../../services/RotationStatus.js';
import { taxYearLabel, deriveTiming, taxYearStartOf } from '../../services/PlanTiming.js';
import { CONTRACT_STRATEGIES } from '../../services/PlanDocument.js';
import { oneAnswer, futuresOutOfTen } from '../../services/OneAnswer.js';
import { APPROACHING_YEARS } from '../../services/LifeStage.js';
import { windowYearsOf, windowOf, heldPhase } from '../../services/Phases.js';
import { runKeyOf, FAMILY } from './lasts.js';
import { pounds } from './income.js';
import { MOVE_WRITES } from './schema.js';
import { dateOf, dayWords, monthWords, MONTHS } from './dates.js';
import { isClosedPlan, closedReading } from '../../services/PlanClosed.js';
import { gapsOf, gapsView, heldOf, rolesView } from './gaps.js';
import { planPage, reviewHrefOf } from './read.js';
import { isRungRow, yearNeedsOf, monthsLeftInTaxYear } from '../../services/TransitionPlanner.js';

export { runKeyOf, APPROACHING_YEARS };

const isObj = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const copy = (v) => (v === undefined ? undefined : JSON.parse(JSON.stringify(v)));
const r0 = (v) => Math.round(+v || 0);
const num = (v) => (Number.isFinite(+v) ? +v : 0);
const isLocked = (plan) => !!(plan && plan.decisionTool && plan.decisionTool.settings && plan.decisionTool.settings.locked);
const lockedAtOf = (plan) => (plan && plan.decisionTool && plan.decisionTool.settings && plan.decisionTool.settings.lockedAt) || (plan && plan.planDocument && plan.planDocument.lockedAt) || null;
const nameOf = (plan) => (plan && plan.planDetails && typeof plan.planDetails.name === 'string' && plan.planDetails.name) || (plan && typeof plan.name === 'string' && plan.name) || '';
const safeStage = (plan, now) => { try { return planStage(plan, { now }); } catch { return { key: 'unknown', firstTaxYear: null, startMonth: null, yearsToStart: 0 }; } };
const safeSettings = (plan, now) => { try { return effectiveStressSettings(plan, { now }); } catch { return (plan && plan.stressTool && isObj(plan.stressTool.settings)) ? plan.stressTool.settings : {}; } };
/**
 * The stages in which the move is just where new money goes (§3.4): the stop further away than the plan's move window
 * (7.10.0, Phases.windowYearsOf: one clock). `saving` is placed outside the window already; a locked saver
 * (`committed-saving`) is waiting until the window opens (waitingOf), as steps.js laterFor keeps its move for later.
 */
export const WAITING_STAGES = Object.freeze(['saving', 'committed-saving']);
function waitingOf(plan, stage) {
  if (stage.key !== 'committed-saving') return WAITING_STAGES.includes(stage.key);
  const yearsToStop = Number.isFinite(stage.monthsToStart) && stage.timingMode === 'future' ? stage.monthsToStart / 12 : (Number.isFinite(stage.yearsToStart) ? stage.yearsToStart : null);
  return !(Number.isFinite(yearsToStop) && yearsToStop <= windowYearsOf(plan));
}
const units = (u) => (u == null ? null : String(r0(u)));
const ym = (s) => { const m = /^(\d{4})-(\d{2})$/.exec(String(s || '')); return m ? MONTHS[+m[2] - 1] + ' ' + m[1] : String(s || ''); };

/** New money a month (the planner's loadTransitionUI): the record's payments in, else the saver's own from the Accumulation tool. */
function contributionsMonthlyOf(plan, rec) {
  let m = 0;
  try { m = proportions(rec.lines).contributions.monthly || 0; } catch { m = 0; }
  if (!m) { const acc = plan && plan.accumulationTool && isObj(plan.accumulationTool.settings) ? plan.accumulationTool.settings : null; if (acc && (+acc.netMonthly > 0 || +acc.employerMonthly > 0)) m = (+acc.netMonthly || 0) * 1.25 + (+acc.employerMonthly || 0); }
  return m;
}

/** The lump a cash year's timeline row carries (the planner's breakdown says it in the label; here it is data). */
function lumpOf(doc, Y) {
  const row = Array.isArray(doc.timeline) ? doc.timeline.find((x) => x && taxYearLabel(+Y) === x.taxYear) : null;
  return row && num(row.lump) > 0 ? num(row.lump) : 0;
}

/**
 * The month a saver's move window opens ('YYYY-MM'), from the stop (Phases.windowOf): null for anyone not saving towards a
 * stop. One reading for both views' schedules (the full view's Transition tab reads it through keepHoldingsUi).
 */
export function opensAtOf(plan, stage, now) {
  return stage && stage.timingMode === 'future' && stage.startMonth ? windowOf(plan, { now, stop: stage.startMonth }).from : null;
}

/** The saved facts, as data (the words are the screen's). */
export function savedMove(plan, { today, index = null }) {
  const now = dateOf(today);
  const locked = isLocked(plan);
  const doc = locked && isObj(plan.planDocument) ? plan.planDocument : null;
  const stage = safeStage(plan, now);
  const ss = safeSettings(plan, now);
  const rec = normaliseHoldings(plan && plan.holdings);
  const strategyId = (doc && doc.strategy && doc.strategy.id) || ss.strategyId || 'pots-and-valves';
  const base = { locked, lockedOn: locked ? dayWords(lockedAtOf(plan)) : null, name: nameOf(plan), stage, waiting: waitingOf(plan, stage), opensAt: opensAtOf(plan, stage, now), strategyId, ladder: CONTRACT_STRATEGIES.includes(strategyId), family: FAMILY.includes(strategyId), record: rec, now, ss };
  if (!doc) return { ...base, hasDocument: false, m: null, seq: null, sheet: [], watch: null, spGate: null, own: null };
  let m = null; try { m = moveInputs(plan, { now }); } catch { m = null; }
  if (!m || !m.target || m.target.kind === 'none') return { ...base, hasDocument: true, m: null, seq: null, sheet: [], watch: null, spGate: null, own: null };
  const contributionsMonthly = contributionsMonthlyOf(plan, rec);
  let seq = null;
  try { seq = sequence(m.diff, { today: now, startYear: stage.firstTaxYear || (doc.timing && doc.timing.firstTaxYear) || taxYearStartOf(now), startMonth: stage.startMonth || (doc.timing && doc.timing.startMonth) || null, opensAt: base.opensAt, contributionsMonthly }); } catch { seq = null; }
  let sheet = [];
  if (m.target.kind === 'ladder') { try { sheet = orderSheetRows(doc, rec.lines, { today: now, params: m.strategyParams }); } catch { sheet = []; } }
  let watch = null;
  if (strategyId === 'gilt-rotation') { try { const t = deriveTiming(ss, now); watch = rotationWatch(doc, { today: now, ageToday: t.currentAge || null, params: ss.strategyParams || null, index }); } catch { watch = null; } }
  const dp = doc.strategy && isObj(doc.strategy.p) ? doc.strategy.p : null;
  const spGate = dp && dp.spAssumed && num(dp.spAnnual) > 0 ? { annual: r0(dp.spAnnual), atAge: r0(dp.startAge) + r0(dp.spStartYear) } : null;
  const dr = doc.strategy && isObj(doc.strategy.r) ? doc.strategy.r : null;
  const a = dr ? oneAnswer(dr, dp || {}) : null;
  const own = a ? { share: a.share, words: futuresOutOfTen(a.share).words, lockedOn: dayWords(doc.lockedAt || lockedAtOf(plan)) } : null;
  const cashRows = m.target.cash && Array.isArray(m.target.cash.breakdown) ? (() => {
    const rows = [];
    const plan0 = doc.strategy.r.plan;
    // cash years a kept line stands in for (7.6.0): said as held another way, never as cash to hold
    const coveredCash = new Set(((m.diff.covered || []).find((c) => c.kind === 'cash') || { taxYears: [] }).taxYears.map(Number));
    for (const c of Array.isArray(plan0.cashYears) ? plan0.cashYears : []) {
      if (m.target.running && +c.Y < m.target.thisTaxYear) continue;
      if (coveredCash.has(+c.Y)) { rows.push({ id: 'cashYearCovered', year: taxYearLabel(+c.Y), lump: null, amount: null }); continue; }
      const lump = lumpOf(doc, c.Y);
      rows.push({ id: lump > 0 ? 'cashYearLump' : 'cashYear', year: taxYearLabel(+c.Y), lump: lump > 0 ? pounds(lump) : null, amount: pounds(c.cost) });
    }
    return rows;
  })() : [];
  // the plan's own mix (the document's year-0 target), beside the held mix for a saver (§3.4)
  const mix0 = Array.isArray(doc.targetMix) && doc.targetMix.length ? doc.targetMix[0] : null;
  const planMix = mix0 ? { shares: String(r0(mix0.equity)), bonds: String(r0(mix0.bond)), cash: String(r0(mix0.cash)) } : null;
  return { ...base, hasDocument: true, m, seq, sheet, watch, spGate, own, contributionsMonthly, cashRows, planMix };
}

/** The plan's effective settings with the pension's mix AS HELD (§3.3): the four amounts in the proportions the record's pension lines hold, on the same pot. */
export function heldMixSettings(plan, { today }) {
  const now = dateOf(today);
  const ss = safeSettings(plan, now);
  const rec = normaliseHoldings(plan && plan.holdings);
  const sipp = rec.lines.filter((l) => String(l.wrapper || 'SIPP').toUpperCase() === 'SIPP');
  const p = proportions(sipp.length ? sipp : rec.lines);
  if (!(p.total > 0)) return null;
  const pot = r0(ss.equityMin) + r0(ss.bondMin) + r0(ss.cashTarget) + r0(ss.diversifierStart);
  const counted = p.buckets.shares + p.buckets.bonds + p.buckets.diversifiers + p.buckets.cash;
  if (!(counted > 0)) return null;
  const share = (b) => Math.round(pot * (p.buckets[b] / counted));
  const equityMin = share('shares'), bondMin = share('bonds'), diversifierStart = share('diversifiers');
  const cashTarget = Math.max(0, pot - equityMin - bondMin - diversifierStart);
  return { settings: { ...ss, equityMin, bondMin, cashTarget, diversifierStart, allocMode: 'risk' }, pcts: { shares: Math.round(100 * p.buckets.shares / counted), bonds: Math.round(100 * p.buckets.bonds / counted), diversifiers: Math.round(100 * p.buckets.diversifiers / counted), cash: Math.round(100 * p.buckets.cash / counted) }, pot, fromPension: sipp.length > 0 };
}

// ---- the writes ----------------------------------------------------------------------------------------------------------------

const declared = (patch) => { for (const k of Object.keys(patch)) if (!MOVE_WRITES.includes(k)) throw new Error('move: "' + k + '" is not a declared field path'); return patch; };

/** One tick-off (§3.5): the whole `transition` object written, the key set to the day or taken off (TransitionPlanner.tickMove / untickMove). */
export function tickPatch(plan, key, { today, done = true }) {
  const s = savedMove(plan, { today });
  if (!s.hasDocument || !s.m) return { ok: false, errors: { plan: 'notLocked' }, patch: {}, previous: {} };
  const item = [...s.m.diff.buy, ...s.m.diff.sell].find((x) => x.key === key);
  if (!item) return { ok: false, errors: { key: 'notAMove' }, patch: {}, previous: {} };
  const was = plan.transition && isObj(plan.transition) ? plan.transition : null;
  const next = done ? tickMove(was, key, String(today).slice(0, 10)) : untickMove(was, key);
  const previous = { transition: plan && Object.prototype.hasOwnProperty.call(plan, 'transition') ? copy(plan.transition) : undefined };
  return { ok: true, errors: {}, patch: declared({ transition: next }), previous, line: { id: done ? 'ticked' : 'unticked', slots: { label: item.label || item.ticker || '' } } };
}

// ---- the words ----------------------------------------------------------------------------------------------------------------

const moveRow = (x, done) => ({ key: x.key, kind: x.kind, label: x.label || x.ticker || '', ticker: x.ticker || '', sedol: x.sedol || '', units: units(x.units), amount: x.amount == null ? null : pounds(x.amount), heldUnits: units(x.heldUnits), heldValue: x.heldValue == null ? null : pounds(x.heldValue), why: whyOf(x), done: done && done[x.key] ? dayWords(done[x.key]) : null, taxYears: Array.isArray(x.taxYears) ? x.taxYears.map((y) => taxYearLabel(+y)) : [] });
/** The planner's "why" as an id with slots, so the screen words it (the planner says "rung for 2029/30", "bring shares up to 60% of the pot"). */
function whyOf(x) {
  const w = String(x.why || '');
  if (/^rung for /.test(w)) return { id: 'rung', slots: { years: (x.taxYears || []).map((y) => taxYearLabel(+y)).join(', ') } };
  if (/^more than the rung needs/.test(w)) return { id: 'moreThanRung', slots: {} };
  if (/^the cash years/.test(w)) return { id: 'cashYears', slots: {} };
  if (/^not in the plan/.test(w)) return { id: 'notInPlan', slots: {} };
  if (/^bring (\w+) up to (\d+)%/.test(w)) { const m = /^bring (\w+) up to (\d+)%/.exec(w); return { id: 'bringUp', slots: { bucket: m[1], pct: m[2] } }; }
  if (/^bring (\w+) down to (\d+)%/.test(w)) { const m = /^bring (\w+) down to (\d+)%/.exec(w); return { id: 'bringDown', slots: { bucket: m[1], pct: m[2] } }; }
  if (/^not in the target mix/.test(w)) return { id: 'notInMix', slots: {} };
  if (/^ISA/.test(w)) return { id: 'isaKept', slots: {} };
  if (/^bank/.test(w)) return { id: 'cashKept', slots: {} };
  if (/^taxable/.test(w)) return { id: 'giaKept', slots: {} };
  if (/^bought by the rotation/.test(w)) return { id: 'rotationKept', slots: {} };
  if (/^matured and paid/.test(w)) return { id: 'matured', slots: { years: (x.taxYears || []).map((y) => taxYearLabel(+y)).join(', ') } };
  if (/^sold by the rotation/.test(w)) return { id: 'soldByRotation', slots: {} };
  return { id: 'other', slots: { text: w } };
}

/** Everything the screen draws. `M` is state.move: { key, status, result, ms, reason, index }. */
export function moveOf(entries, id, { today, index = null, M = null, source = 'account', page = null } = {}) {
  const list = (entries || []).filter((e) => e && e.plan && typeof e.plan === 'object' && e.plan.id != null);
  const entry = list.find((e) => String(e.plan.id) === String(id)) || null;
  if (!entry) return { found: false, id: String(id || '') };
  const plan = entry.plan;
  // the phase the plan's home reads (7.11.1): its page reading's `life`, made here when the caller has none
  let pg = page && page.found && String(page.id) === String(plan.id) ? page : null;
  if (!pg) { try { pg = planPage(list, plan.id, 'move', { today, source }); } catch { pg = null; } }
  const life = pg && pg.found && pg.life ? pg.life : null;
  const readonly = !!(entry.newer || entry.failed);
  // a closed plan's record and its tick-offs moved to the plan that carries it on (6.56.0, PlanClosed.js): nothing to tick here
  const closed = isClosedPlan(plan) ? closedReading(plan, list, dateOf(today)) : null;
  const s = savedMove(plan, { today, index });
  const runKey = readonly || closed ? null : runKeyOf(plan);
  // no box is typed on this step (schema.js isMovePath): the fields are empty, so the shell reads it as every editing step
  const base = { found: true, id: String(plan.id), name: s.name, locked: s.locked, lockedOn: s.lockedOn, readonly, editable: !readonly && !closed, closed, source, strategyId: s.strategyId, ladder: s.ladder, family: s.family, stageKey: s.stage.key, runKey, recorded: s.record.lines.length > 0, fields: [], errors: {}, ok: true, phase: life ? life.key : null };
  if (!s.hasDocument || !s.m) return { ...base, hasDocument: s.hasDocument, kind: 'none' };
  // a record with nothing in the pension the move can read (7.10.0, TransitionPlanner: every pension line unplaced, or none):
  // nothing to compare, said as that — never a mix of zeros
  if (s.m.diff && s.m.diff.kind === 'none') return { ...base, hasDocument: true, kind: 'none', unread: true, unknown: (s.m.diff.unknown || []).map((u) => u.label).filter(Boolean) };
  const { m, seq } = s;
  const T = m.target, D = m.diff, P = m.prog;
  const done = (plan.transition && isObj(plan.transition) && isObj(plan.transition.done)) ? plan.transition.done : {};
  // the rungs bought: held, or held above the target (7.11.1, the diff's own count) — the order sheet says the same
  const rungs = T.kind === 'ladder' ? { total: T.lines.length, bought: D.rungs ? D.rungs.held : D.hold.filter((h) => Array.isArray(h.taxYears)).length } : null;
  // a rung part bought (some of its units held: gaps.js heldOf's 'partRung', as Living on it reads it) is never "no gilt
  // bought": its years are left out of the uncovered ones, and it is said with the units held of the units it needs
  const partRungs = T.kind === 'ladder' ? D.buy.filter((b) => b.kind === 'gilt' && num(b.heldUnits) > 0) : [];
  const status = D.complete ? { id: 'done', slots: {} } : rungs ? { id: partRungs.length ? 'giltsPart' : 'gilts', slots: { bought: String(rungs.bought), rungs: String(rungs.total), held: String(D.progressPct), part: String(partRungs.length) } } : { id: 'held', slots: { held: String(D.progressPct), done: String(P.doneCount), moves: String(P.total) } };
  // what skipping it costs (§3.3): for a ladder the tax years whose rung is not bought at all; for a pot plan the one run on the held mix
  const uncovered = T.kind === 'ladder' ? [...new Set(D.buy.filter((b) => b.kind === 'gilt' && !partRungs.includes(b)).flatMap((b) => (b.taxYears || []).map((y) => +y)))].sort((a, b) => a - b) : [];
  const parts = partRungs.map((b) => ({ label: b.label || b.ticker || '', years: (b.taxYears || []).map((y) => taxYearLabel(+y)).join(', '), held: grouped(b.heldUnits), units: grouped(num(b.units) + num(b.heldUnits)) }));
  const held = heldMixSettings(plan, { today });
  const mine = M && runKey && M.key === runKey ? M : null;
  const heldRun = mine ? { status: mine.status, reason: mine.reason || null, ms: mine.ms == null ? null : mine.ms,
    result: mine.status === 'done' && mine.result ? (mine.result.affordable && mine.result.a ? { words: futuresOutOfTen(mine.result.a.share).words, share: mine.result.a.share, badCaseLeft: pounds(mine.result.a.badCaseLeft), typicalLeft: pounds(mine.result.a.typicalLeft), pcts: mine.result.held ? mine.result.held.pcts : null } : { unaffordable: true, reason: mine.result.reason || null }) : null } : { status: 'idle', reason: null, ms: null, result: null };
  const start = seq && !seq.startPassed ? { months: String(seq.months), when: s.stage.startMonth ? monthWords(s.stage.startMonth) : (s.stage.firstTaxYear ? 'April ' + s.stage.firstTaxYear : '') } : null;
  const sheet = s.sheet.map((r) => ({ ...r, matures: r.matures ? dayWords(r.matures) : '', pays: pounds(r.pays), cost: pounds(r.cost), nominal: r.nominal == null ? null : String(r.nominal), indexRatio: r.indexRatio == null ? null : r.indexRatio.toFixed(3), cleanPrice: r.cleanPrice == null ? null : r.cleanPrice.toFixed(2), taxYears: r.taxYears.map((y) => taxYearLabel(+y)) }));
  const first = s.sheet.length ? s.sheet[0] : null;
  const example = first ? { name: first.name, code: first.tidm, nominal: String(first.nominal || ''), cost: pounds(first.cost), pays: pounds(first.pays), years: first.taxYears.map((y) => taxYearLabel(+y)).join(', '), matures: first.matures ? dayWords(first.matures) : '' } : null;
  // "What is covered, year by year": one reading for the page, by the phase the home reads (7.11.1)
  let g = null; try { g = gapsOf(plan, { today, life }); } catch { g = null; }
  const w = s.watch;
  const watch = w ? {
    state: w.state, cutAge: String(w.cutAge), disarmAge: String(w.disarmAge), triggerPct: String(Math.round(w.triggerPct * 100)), firedOn: w.firedAt ? dayWords(w.firedAt) : null, yearsArmed: w.yearsArmed == null ? null : String(w.yearsArmed),
    block: w.block ? { rungs: String(w.block.rungs), from: String(w.block.ages[0]), to: String(w.block.ages[1]), value: pounds(w.block.value), income: pounds(w.block.income), years: w.block.years.map((y) => taxYearLabel(+y)) } : null,
    market: w.market ? { symbol: w.market.symbol || '', level: String(r0(w.market.level)).replace(/\B(?=(\d{3})+(?!\d))/g, ','), ath: String(r0(w.market.ath)).replace(/\B(?=(\d{3})+(?!\d))/g, ','), asOf: w.market.asOf ? dayWords(w.market.asOf) : null, athOn: w.market.athDate ? dayWords(w.market.athDate) : null, below: (-(w.market.drawdown) * 100).toFixed(1), fireLevel: String(w.market.fireLevel).replace(/\B(?=(\d{3})+(?!\d))/g, ','), live: w.market.live } : null,
    ticket: w.ticket && w.market && w.market.live ? { rows: w.ticket.rows.map((r) => ({ n: String(r.n), name: r.name, sedol: r.sedol, tidm: r.tidm, matures: r.matures ? dayWords(r.matures) : '', nominal: String(r.nominal), proceeds: pounds(r.proceeds), pays: pounds(r.pays), taxYears: r.taxYears.map((y) => taxYearLabel(+y)) })), proceeds: pounds(w.ticket.proceeds), income: pounds(w.ticket.income) } : null
  } : null;
  return {
    ...base, hasDocument: true, kind: T.kind, running: !!T.running, status, complete: !!D.complete, reason: D.reason, progressPct: String(D.progressPct), movesDone: String(P.doneCount), moves: String(P.total), rungs: rungs ? { bought: String(rungs.bought), total: String(rungs.total) } : null,
    next: P.next ? moveRow(P.next, done) : null, waiting: s.waiting, yearsToStart: String(s.stage.yearsToStart || 0), opens: s.opensAt ? monthWords(s.opensAt) : null, startsAround: s.stage.startMonth ? monthWords(s.stage.startMonth) : (s.stage.firstTaxYear ? 'April ' + s.stage.firstTaxYear : ''),
    own: s.own, held: held ? { pcts: held.pcts, fromPension: held.fromPension } : null, heldRun, planMix: s.planMix || null,
    newMoney: (() => { const p = proportions(s.record.lines); if (!(p.contributions && p.contributions.monthly > 0)) return null; const m = p.contributions.monthly; return { monthly: pounds(m), parts: ['shares', 'bonds', 'diversifiers', 'cash'].filter((b) => p.contributions.byBucket[b] > 0.004).map((b) => ({ bucket: b, word: b === 'diversifiers' ? 'gold and trend' : b, amount: pounds(m * p.contributions.byBucket[b]) })) }; })(),
    cost: { uncovered: uncovered.map((y) => taxYearLabel(y)), parts, canRun: !!held && !s.ladder && !readonly },
    // the cash to hold: the cash years' money, less the years a kept line stands in for (7.6.0, the diff's cashLeft)
    cash: T.cash && !D.cashInfo ? (() => { const tv = (D.cashLeft || T.cash).value; return { rows: s.cashRows, target: pounds(tv), held: pounds(D.totals.cashHeld), spare: D.totals.cashHeld >= tv ? pounds(D.totals.cashHeld - tv) : null, short: D.totals.cashHeld < tv ? pounds(tv - D.totals.cashHeld) : null }; })() : null,
    cashInfo: D.cashInfo ? { held: pounds(D.cashInfo.held), target: pounds(D.cashInfo.target), years: D.cashInfo.yearsLeft.map((y) => taxYearLabel(+y)) } : null,
    paid: (T.paid || []).map((p) => ({ label: p.label, ticker: p.ticker || '' })), matured: D.matured.map((x) => moveRow(x, done)), sold: D.sold.map((x) => moveRow(x, done)), rotated: !!T.rotated,
    buy: D.buy.map((x) => moveRow(x, done)), sell: D.sell.map((x) => moveRow(x, done)),
    hold: D.hold.map((x) => ({ key: x.key, label: x.label || x.ticker || '', ticker: x.ticker || '', held: x.heldUnits != null ? { units: units(x.heldUnits) } : { value: pounds(x.heldValue) }, spare: x.spare > 0 ? pounds(x.spare) : null, target: x.units ? { units: units(x.units) } : { value: pounds(x.value) } })),
    keep: D.keep.map((x) => ({ label: x.ticker || x.name || '', wrapper: x.wrapper, value: pounds(x.value), why: whyOf(x) })),
    totals: { buy: pounds(D.totals.buyCost), sell: pounds(D.totals.sellValue), short: D.totals.shortfall > 0 ? pounds(D.totals.shortfall) : null },
    schedule: seq ? { steps: seq.steps.map((st) => ({ when: ym(st.when), action: st.action, label: st.label, ticker: st.ticker || '', units: units(st.units), amount: pounds(st.amount) })), tranches: String(seq.tranches), months: String(seq.months), funded: !!seq.funded, startPassed: !!seq.startPassed, short: !seq.funded ? pounds(seq.totals.buy - seq.totals.sell - seq.totals.contributions) : null, newMoney: seq.totals.contributions > 0 ? pounds(seq.totals.contributions) : null } : null,
    start, isaPolicy: s.ss.isaDrawdownStrategy === 'hold' ? 'hold' : 'draw',
    sheet, example, spGate: s.spGate ? { annual: pounds(s.spGate.annual), atAge: String(s.spGate.atAge) } : null, pricedOn: s.lockedOn,
    watch,
    // 7.11.1: by phase — Living on it, or Moving once what is held was accepted, the page is what is held, never a move
    ...(() => { const mode = heldMode(life) ? 'held' : s.waiting ? 'waiting' : 'move'; return { mode, heldInfo: mode === 'held' ? heldInfoOf(plan, s, { today, life, page: pg, rungs, recorded: base.recorded, g }) : null }; })(),
    // 7.6.0: what the person keeps — held another way, kept by choice, the rungs covered — and the gaps it leaves; only on a
    // record that keeps something or expects money, so a plan without keeps reads exactly as before (7.11.1: living on the
    // plan, also what it holds beyond the plan's own; in a move, never a line the move sells — gapsOf by phase)
    ...keptOf(D, g)
  };
}

/**
 * Whether the page is what is held rather than a move (7.11.1): Living on it, or Moving once what is held was accepted
 * (Phases.heldPhase on LifeStage.stageOf's stage). `life` is the plan's page reading's (planPage), the phase the home reads.
 */
export const heldMode = (life) => heldPhase(life);

const grouped = (v) => String(Math.round(num(v))).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
const BUCKETS = ['shares', 'bonds', 'cash', 'diversifiers'];
/** The words of each sentence heldInfo carries (src/v7/copy/move.js MOVE.held; both views fill them). */
const RUNG_WORDS = { part: 'rungPart', none: 'rungNone', over: 'rungOver' };
const LINE_WORDS = { paid: 'giltPaid', cashNow: 'giltCashNow' };

/**
 * What is held, as information (7.11.1; `mode` 'held'): never a list of things to buy or sell.
 *   agreed   { date } when what is held was accepted as the plan (7.10.0), else null
 *   rungs    a ladder's rungs held of those the plan still needs, and each rung not held as the plan has it: part bought or
 *            not held (with its line of the order sheet), or held with more than it needs — { held, total, rows: [{ key, id,
 *            label, code, years, state: 'part'|'none'|'over', held, units, excess, value, cost, n }] }
 *            (each sentence's `id` names its words in MOVE.held, its other fields are the slots)
 *   lines    each line of the pension beside the rungs (gaps.js heldOf/rolesView), with its value today: a gilt (when it
 *            matures, a fact only: it is set against no year), shares or a fund outside the mix
 *   cash     a ladder's cash years still ahead, what they need, and the pension's cash
 *   buckets  a pot plan's mix held against the plan's, in whole points of the pension money read; `unknown` the lines nothing
 *            places; `review` where "Test with what I hold" and the agreement are (Your review), when it can test them
 *   noRecord nothing recorded yet
 */
function heldInfoOf(plan, s, { today, life, page, rungs, recorded, g = null }) {
  const T = s.m.target, D = s.m.diff;
  const agreed = life && life.agreed && life.agreed.at ? { date: dayWords(life.agreed.at) } : null;
  const base = { kind: T.kind, agreed, noRecord: !recorded, rungs: null, lines: [], cash: null, buckets: null, unknown: [], review: null };
  if (T.kind === 'ladder') {
    const nOf = new Map(s.sheet.map((r) => [String(r.tidm || '').toUpperCase(), String(r.n)]));
    const order = new Map(T.lines.map((t, i) => [t.key, i]));
    const row = (x, state) => {
      const total = x.units == null ? null : state === 'over' ? num(x.heldUnits) - num(x.units) : num(x.units) + num(x.heldUnits);
      return { key: x.key, id: state === 'part' && x.units == null ? 'rungPartValue' : RUNG_WORDS[state], label: x.label || x.ticker || '', code: x.ticker || '', years: (x.taxYears || []).map((y) => taxYearLabel(+y)).join(', '), state,
        held: x.units == null ? null : grouped(x.heldUnits), units: total == null ? null : grouped(total), excess: state === 'over' && x.units != null ? grouped(x.units) : null,
        value: x.units == null ? pounds(Math.max(0, num(x.value) - num(x.amount))) : null, cost: x.units == null ? pounds(x.value) : null, n: nOf.get(String(x.ticker || '').toUpperCase()) || '' };
    };
    const rows = [...D.buy.filter(isRungRow).map((x) => row(x, num(x.heldUnits) > 0 || (x.units == null && num(x.amount) < num(x.value)) ? 'part' : 'none')), ...D.sell.filter(isRungRow).map((x) => row(x, 'over'))]
      .sort((a, b) => (order.has(a.key) ? order.get(a.key) : 1e9) - (order.has(b.key) ? order.get(b.key) : 1e9));
    base.rungs = { held: rungs ? String(rungs.bought) : '0', total: rungs ? String(rungs.total) : String(T.lines.length), rows };
    // the one reading's lines (gapsOf's roles), so each says what What is covered does with it; else read here
    let raw = g && g.fromHeld ? g.roles : null;
    if (!raw) { try { raw = heldOf(plan, { today }); } catch { raw = null; } }
    const roles = rolesView(raw);
    // a gilt still to mature says when it matures, as a fact: it is set against no year (7.11.1)
    const idOf = (r) => (r.role === 'outside' ? 'outside' : LINE_WORDS[r.state] || (r.matures ? 'gilt' : 'giltUnknown'));
    base.lines = (roles || []).filter((r) => r.role === 'gilt' || r.role === 'outside' || (r.role === 'matured' && r.state === 'cashNow')).map((r) => ({ at: r.at, id: idOf(r), label: r.label, value: r.value, role: r.role, ...(r.role !== 'outside' ? { state: r.state, month: r.matures || '' } : {}) }));
    if (T.cash) {
      const c = D.cashInfo ? { target: D.cashInfo.target, years: D.cashInfo.yearsLeft } : { target: (D.cashLeft || T.cash).value, years: (D.cashLeft || T.cash).yearsLeft || [] };
      // while the plan runs, this tax year's need is its months still to come (as What is covered reads it): one figure
      const thisTY = T.running ? taxYearStartOf(dateOf(today)) : null;
      const ny = yearNeedsOf(plan.planDocument);
      const part = thisTY != null && (c.years || []).map(Number).includes(thisTY) && ny[thisTY];
      const target = part ? Math.max(0, num(c.target) - num(ny[thisTY].need) * (12 - monthsLeftInTaxYear(dateOf(today))) / 12) : num(c.target);
      const years = (c.years || []).map((y) => taxYearLabel(+y));
      base.cash = { id: years.length ? (part ? 'cashThisYear' : 'cash') : 'cashNone', held: pounds(D.totals.cashHeld), target: pounds(target), years: years.join(', ') };
    }
  } else if (T.kind === 'buckets') {
    const inPlay = num(D.inPlay);
    if (inPlay > 0 && D.buckets) base.buckets = BUCKETS.filter((b) => D.buckets[b] && (num(D.buckets[b].held) > 0 || num(D.buckets[b].target) > 0)).map((b) => ({ bucket: b, held: String(Math.round(100 * num(D.buckets[b].held) / inPlay)), plan: String(Math.round(100 * num(D.buckets[b].target) / inPlay)) }));
    base.unknown = (D.unknown || []).map((u) => u.label).filter(Boolean);
    // "Test with what I hold" and "I accept this as my plan" are on Your review, once there is a pension record to read
    base.review = recorded && inPlay > 0 ? ((page && page.reviewDue && page.reviewDue.href) || reviewHrefOf(plan)) : null;
  }
  return base;
}

/** The move's view of what the person keeps (7.6.0), or nothing at all when the record keeps nothing and expects nothing. */
function keptOf(D, g) {
  if (!D.standIn && !g) return {};
  return {
    standIn: (D.standIn || []).map((x) => ({ key: x.key, label: x.label || x.ticker || '', wrapper: x.wrapper, pays: pounds(x.pays), fixed: !!x.fixed, years: x.taxYears.map((y) => taxYearLabel(+y)) })),
    kept: (D.kept || []).map((x) => ({ key: x.key, label: x.label || x.ticker || '', wrapper: x.wrapper, value: pounds(x.value), fundsGaps: !!x.fundsGaps })),
    covered: (D.covered || []).map((x) => ({ key: x.key, label: x.label || x.ticker || '', years: x.taxYears.map((y) => taxYearLabel(+y)), part: !!x.part })),
    gaps: gapsView(g)
  };
}
