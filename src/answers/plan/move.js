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
 *   moveOf(entries, id, { today, index, M })  everything the screen draws (M: state.move, the one run on the held mix)
 *   tickPatch(plan, key, { today, done })    → { ok, patch: { transition }, previous, line }: one tick-off, the object whole
 *   heldMixSettings(plan, { today })         the plan's effective settings with the mix AS HELD (moveRun.js runs them)
 *   runKeyOf                                 lasts.js's (the held run is filed under the plan's key)
 *
 * Every path written is in schema.js MOVE_WRITES (tested); the tick is TransitionPlanner.tickMove / untickMove, the
 * planner's own; the target, the diff, the progress and the schedule are TransitionPlanner's through PlanReading.moveInputs.
 */
import { planStage, effectiveStressSettings, moveInputs } from '../../services/PlanReading.js';
import { sequence, tickMove, untickMove } from '../../services/TransitionPlanner.js';
import { normaliseHoldings } from '../../services/HoldingsRecord.js';
import { proportions } from '../../services/Holdings.js';
import { orderSheetRows } from '../../strategies/GiltLadderPlan.js';
import { rotationWatch } from '../../services/RotationStatus.js';
import { taxYearLabel, deriveTiming } from '../../services/PlanTiming.js';
import { CONTRACT_STRATEGIES } from '../../services/PlanDocument.js';
import { oneAnswer, futuresOutOfTen } from '../../services/OneAnswer.js';
import { APPROACHING_YEARS } from '../../services/LifeStage.js';
import { runKeyOf, FAMILY } from './lasts.js';
import { pounds } from './income.js';
import { MOVE_WRITES } from './schema.js';
import { dateOf, dayWords, monthWords, MONTHS } from './dates.js';

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
/** The stages in which the move is just where new money goes (§3.4): the stop more than APPROACHING_YEARS away. */
export const WAITING_STAGES = Object.freeze(['saving', 'committed-saving']);
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

/** The saved facts, as data (the words are the screen's). */
export function savedMove(plan, { today, index = null }) {
  const now = dateOf(today);
  const locked = isLocked(plan);
  const doc = locked && isObj(plan.planDocument) ? plan.planDocument : null;
  const stage = safeStage(plan, now);
  const ss = safeSettings(plan, now);
  const rec = normaliseHoldings(plan && plan.holdings);
  const strategyId = (doc && doc.strategy && doc.strategy.id) || ss.strategyId || 'pots-and-valves';
  const base = { locked, lockedOn: locked ? dayWords(lockedAtOf(plan)) : null, name: nameOf(plan), stage, waiting: WAITING_STAGES.includes(stage.key), strategyId, ladder: CONTRACT_STRATEGIES.includes(strategyId), family: FAMILY.includes(strategyId), record: rec, now, ss };
  if (!doc) return { ...base, hasDocument: false, m: null, seq: null, sheet: [], watch: null, spGate: null, own: null };
  let m = null; try { m = moveInputs(plan, { now }); } catch { m = null; }
  if (!m || !m.target || m.target.kind === 'none') return { ...base, hasDocument: true, m: null, seq: null, sheet: [], watch: null, spGate: null, own: null };
  const contributionsMonthly = contributionsMonthlyOf(plan, rec);
  let seq = null;
  try { seq = sequence(m.diff, { today: now, startYear: stage.firstTaxYear || (doc.timing && doc.timing.firstTaxYear) || (now.getFullYear() + 1), startMonth: stage.startMonth || (doc.timing && doc.timing.startMonth) || null, contributionsMonthly }); } catch { seq = null; }
  let sheet = [];
  if (m.target.kind === 'ladder') { try { sheet = orderSheetRows(doc, rec.lines, { today: now, params: m.strategyParams, runUpMonthly: m.runUpMonthly }); } catch { sheet = []; } }
  let watch = null;
  if (strategyId === 'gilt-rotation') { try { const t = deriveTiming(ss, now); watch = rotationWatch(doc, { today: now, ageToday: t.currentAge || null, params: ss.strategyParams || null, index }); } catch { watch = null; } }
  const dp = doc.strategy && isObj(doc.strategy.p) ? doc.strategy.p : null;
  const spGate = dp && dp.spAssumed && num(dp.spAnnual) > 0 ? { annual: r0(dp.spAnnual), atAge: r0(dp.startAge) + r0(dp.spStartYear) } : null;
  const dr = doc.strategy && isObj(doc.strategy.r) ? doc.strategy.r : null;
  const a = dr ? oneAnswer(dr, dp || {}) : null;
  const own = a ? { share: a.share, words: futuresOutOfTen(a.share).words, lockedOn: dayWords(doc.lockedAt || lockedAtOf(plan)) } : null;
  const cashRows = m.target.cash && Array.isArray(m.target.cash.breakdown) ? (() => {
    const rows = [];
    const ru = m.target.cash.runUp;
    if (ru && ru.value > 0) rows.push({ id: 'runUp', months: String(ru.months), monthly: pounds(ru.monthly), amount: pounds(ru.value) });
    const plan0 = doc.strategy.r.plan;
    for (const c of Array.isArray(plan0.cashYears) ? plan0.cashYears : []) {
      if (m.target.running && +c.Y < m.target.thisTaxYear) continue;
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
export function moveOf(entries, id, { today, index = null, M = null, source = 'account' } = {}) {
  const list = (entries || []).filter((e) => e && e.plan && typeof e.plan === 'object' && e.plan.id != null);
  const entry = list.find((e) => String(e.plan.id) === String(id)) || null;
  if (!entry) return { found: false, id: String(id || '') };
  const plan = entry.plan;
  const readonly = !!(entry.newer || entry.failed);
  const s = savedMove(plan, { today, index });
  const runKey = readonly ? null : runKeyOf(plan);
  // no box is typed on this step (schema.js isMovePath): the fields are empty, so the shell reads it as every editing step
  const base = { found: true, id: String(plan.id), name: s.name, locked: s.locked, lockedOn: s.lockedOn, readonly, editable: !readonly, source, strategyId: s.strategyId, ladder: s.ladder, family: s.family, stageKey: s.stage.key, runKey, recorded: s.record.lines.length > 0, fields: [], errors: {}, ok: true };
  if (!s.hasDocument || !s.m) return { ...base, hasDocument: s.hasDocument, kind: 'none' };
  const { m, seq } = s;
  const T = m.target, D = m.diff, P = m.prog;
  const done = (plan.transition && isObj(plan.transition) && isObj(plan.transition.done)) ? plan.transition.done : {};
  const rungs = T.kind === 'ladder' ? { total: T.lines.length, bought: D.hold.filter((h) => Array.isArray(h.taxYears)).length } : null;
  const status = D.complete ? { id: 'done', slots: {} } : rungs ? { id: 'gilts', slots: { bought: String(rungs.bought), rungs: String(rungs.total), held: String(D.progressPct) } } : { id: 'held', slots: { held: String(D.progressPct), done: String(P.doneCount), moves: String(P.total) } };
  const runUp = T.cash && T.cash.runUp && T.cash.runUp.months > 0 && !T.running ? { months: String(T.cash.runUp.months), monthly: pounds(T.cash.runUp.monthly), value: pounds(T.cash.runUp.value) } : null;
  // what skipping it costs (§3.3): for a ladder the tax years whose rung is not bought; for a pot plan the one run on the held mix
  const uncovered = T.kind === 'ladder' ? [...new Set(D.buy.filter((b) => b.kind === 'gilt').flatMap((b) => (b.taxYears || []).map((y) => +y)))].sort((a, b) => a - b) : [];
  const held = heldMixSettings(plan, { today });
  const mine = M && runKey && M.key === runKey ? M : null;
  const heldRun = mine ? { status: mine.status, reason: mine.reason || null, ms: mine.ms == null ? null : mine.ms,
    result: mine.status === 'done' && mine.result ? (mine.result.affordable && mine.result.a ? { words: futuresOutOfTen(mine.result.a.share).words, share: mine.result.a.share, badCaseLeft: pounds(mine.result.a.badCaseLeft), typicalLeft: pounds(mine.result.a.typicalLeft), pcts: mine.result.held ? mine.result.held.pcts : null } : { unaffordable: true, reason: mine.result.reason || null }) : null } : { status: 'idle', reason: null, ms: null, result: null };
  const start = seq && !seq.startPassed ? { months: String(seq.months), when: s.stage.startMonth ? monthWords(s.stage.startMonth) : (s.stage.firstTaxYear ? 'April ' + s.stage.firstTaxYear : '') } : null;
  const sheet = s.sheet.map((r) => ({ ...r, matures: r.matures ? dayWords(r.matures) : '', pays: pounds(r.pays), cost: pounds(r.cost), nominal: r.nominal == null ? null : String(r.nominal), indexRatio: r.indexRatio == null ? null : r.indexRatio.toFixed(3), cleanPrice: r.cleanPrice == null ? null : r.cleanPrice.toFixed(2), taxYears: r.taxYears.map((y) => taxYearLabel(+y)) }));
  const first = s.sheet.length ? s.sheet[0] : null;
  const example = first ? { name: first.name, code: first.tidm, nominal: String(first.nominal || ''), cost: pounds(first.cost), pays: pounds(first.pays), years: first.taxYears.map((y) => taxYearLabel(+y)).join(', '), matures: first.matures ? dayWords(first.matures) : '' } : null;
  const w = s.watch;
  const watch = w ? {
    state: w.state, cutAge: String(w.cutAge), disarmAge: String(w.disarmAge), triggerPct: String(Math.round(w.triggerPct * 100)), firedOn: w.firedAt ? dayWords(w.firedAt) : null, yearsArmed: w.yearsArmed == null ? null : String(w.yearsArmed),
    block: w.block ? { rungs: String(w.block.rungs), from: String(w.block.ages[0]), to: String(w.block.ages[1]), value: pounds(w.block.value), income: pounds(w.block.income), years: w.block.years.map((y) => taxYearLabel(+y)) } : null,
    market: w.market ? { symbol: w.market.symbol || '', level: String(r0(w.market.level)).replace(/\B(?=(\d{3})+(?!\d))/g, ','), ath: String(r0(w.market.ath)).replace(/\B(?=(\d{3})+(?!\d))/g, ','), asOf: w.market.asOf ? dayWords(w.market.asOf) : null, athOn: w.market.athDate ? dayWords(w.market.athDate) : null, below: (-(w.market.drawdown) * 100).toFixed(1), fireLevel: String(w.market.fireLevel).replace(/\B(?=(\d{3})+(?!\d))/g, ','), live: w.market.live } : null,
    ticket: w.ticket && w.market && w.market.live ? { rows: w.ticket.rows.map((r) => ({ n: String(r.n), name: r.name, sedol: r.sedol, tidm: r.tidm, matures: r.matures ? dayWords(r.matures) : '', nominal: String(r.nominal), proceeds: pounds(r.proceeds), pays: pounds(r.pays), taxYears: r.taxYears.map((y) => taxYearLabel(+y)) })), proceeds: pounds(w.ticket.proceeds), income: pounds(w.ticket.income) } : null
  } : null;
  return {
    ...base, hasDocument: true, kind: T.kind, running: !!T.running, status, complete: !!D.complete, reason: D.reason, progressPct: String(D.progressPct), movesDone: String(P.doneCount), moves: String(P.total), rungs: rungs ? { bought: String(rungs.bought), total: String(rungs.total) } : null,
    next: P.next ? moveRow(P.next, done) : null, runUp, waiting: s.waiting, yearsToStart: String(s.stage.yearsToStart || 0), startsAround: s.stage.startMonth ? monthWords(s.stage.startMonth) : (s.stage.firstTaxYear ? 'April ' + s.stage.firstTaxYear : ''),
    own: s.own, held: held ? { pcts: held.pcts, fromPension: held.fromPension } : null, heldRun, planMix: s.planMix || null,
    newMoney: (() => { const p = proportions(s.record.lines); if (!(p.contributions && p.contributions.monthly > 0)) return null; const m = p.contributions.monthly; return { monthly: pounds(m), parts: ['shares', 'bonds', 'diversifiers', 'cash'].filter((b) => p.contributions.byBucket[b] > 0.004).map((b) => ({ bucket: b, word: b === 'diversifiers' ? 'gold and trend' : b, amount: pounds(m * p.contributions.byBucket[b]) })) }; })(),
    cost: { uncovered: uncovered.map((y) => taxYearLabel(y)), canRun: !!held && !s.ladder && !readonly },
    cash: T.cash && !D.cashInfo ? { rows: s.cashRows, target: pounds(T.cash.value), held: pounds(D.totals.cashHeld), spare: D.totals.cashHeld >= T.cash.value ? pounds(D.totals.cashHeld - T.cash.value) : null, short: D.totals.cashHeld < T.cash.value ? pounds(T.cash.value - D.totals.cashHeld) : null } : null,
    cashInfo: D.cashInfo ? { held: pounds(D.cashInfo.held), target: pounds(D.cashInfo.target), years: D.cashInfo.yearsLeft.map((y) => taxYearLabel(+y)) } : null,
    paid: (T.paid || []).map((p) => ({ label: p.label, ticker: p.ticker || '' })), matured: D.matured.map((x) => moveRow(x, done)), sold: D.sold.map((x) => moveRow(x, done)), rotated: !!T.rotated,
    buy: D.buy.map((x) => moveRow(x, done)), sell: D.sell.map((x) => moveRow(x, done)),
    hold: D.hold.map((x) => ({ key: x.key, label: x.label || x.ticker || '', ticker: x.ticker || '', held: x.heldUnits != null ? { units: units(x.heldUnits) } : { value: pounds(x.heldValue) }, spare: x.spare > 0 ? pounds(x.spare) : null, target: x.units ? { units: units(x.units) } : { value: pounds(x.value) } })),
    keep: D.keep.map((x) => ({ label: x.ticker || x.name || '', wrapper: x.wrapper, value: pounds(x.value), why: whyOf(x) })),
    totals: { buy: pounds(D.totals.buyCost), sell: pounds(D.totals.sellValue), short: D.totals.shortfall > 0 ? pounds(D.totals.shortfall) : null },
    schedule: seq ? { steps: seq.steps.map((st) => ({ when: ym(st.when), action: st.action, label: st.label, ticker: st.ticker || '', units: units(st.units), amount: pounds(st.amount) })), tranches: String(seq.tranches), months: String(seq.months), funded: !!seq.funded, startPassed: !!seq.startPassed, short: !seq.funded ? pounds(seq.totals.buy - seq.totals.sell - seq.totals.contributions) : null, newMoney: seq.totals.contributions > 0 ? pounds(seq.totals.contributions) : null } : null,
    start, isaPolicy: s.ss.isaDrawdownStrategy === 'hold' ? 'hold' : 'draw',
    sheet, example, spGate: s.spGate ? { annual: pounds(s.spGate.annual), atAge: String(s.spGate.atAge) } : null, pricedOn: s.lockedOn,
    watch
  };
}
