/**
 * "What is covered, year by year" (7.6.0; 7.11.1: read with what the person actually holds): a locked ladder plan read with
 * what the person holds, keeps and expects. The settings and the plan document stay as locked; what the person holds may
 * differ from the ladder — a gilt that is none of the plan's rungs, shares or a fund outside the plan's mix, a line kept to
 * stand in for some years' money, a line kept by choice, money expected later — and this says honestly what that means, as
 * consequences and never as advice: per tax year from this one to the last year anything held is set against, what the
 * plan needs, what is held for it, the gap, and what could cover the gaps.
 *
 * What is held for a year (7.11.1): the plan's rungs, the pension's cash as it is today (with what a gilt paid after the
 * record was taken), and what the person set against tax years themselves ("stands in for"). Nothing else is ever set
 * against a year by the reading: a gilt is often bought to mature before the year its money is for, so when a gilt matures
 * never says which year it is for. Every other line in the pension beside the plan's rungs — a gilt, shares, a fund — is
 * money available, never ignored and never assigned: one line says what it is worth today, gilts and shares and funds apart,
 * and how much of the years not covered it would cover at that value. Money expected later, as today.
 *
 * By phase (7.11.1): living on the plan, or Moving once what is held was accepted, it reads what is held as above; in a move
 * it reads only what is kept, so it never counts a line the move sells (gapsOf).
 *
 *   gapsOf(plan, { today, asKept, life })   the reading, as data (null when there is nothing to read: see gapsOf)
 *   lifeOf(plan, now)                 the phase the home reads (LifeStage.stageOf), which gapsOf reads by
 *   heldOf(plan, { today })           each line of the record and the part it plays (rung, part-bought rung, a gilt outside
 *                                     the rungs and when it matures, outside the plan's mix, cash…), or null without a ladder
 *   gapSentences(g)                   the reading in words, from the words given (src/v7/copy/gaps.js): one list, both apps
 *
 * Pure: the plan brought up to date in memory and today's date; nothing here writes, runs or reads a clock. The diff is
 * TransitionPlanner's through PlanReading.moveInputs — the very reading the move page and the home make.
 */
import { yearNeedsOf, monthsLeftInTaxYear as monthsLeftOf } from '../../services/TransitionPlanner.js';
import { moveInputs, planStage, effectiveStressSettings } from '../../services/PlanReading.js';
import { stageOf } from '../../services/LifeStage.js';
import { heldPhase } from '../../services/Phases.js';
import { normaliseHoldings, hasKeeps, expectedOf } from '../../services/HoldingsRecord.js';
import { taxYearLabel, taxYearStartOf } from '../../services/PlanTiming.js';
import { dateOf, monthWords } from './dates.js';
import { pounds } from './income.js';

const num = (v) => (Number.isFinite(+v) ? +v : 0);
const r0 = (v) => Math.round(num(v));
const isObj = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const isLocked = (plan) => !!(plan && plan.decisionTool && plan.decisionTool.settings && plan.decisionTool.settings.locked);
const pad = (n) => String(n).padStart(2, '0');
/** 'YYYY-MM' `k` months after the month of `ym`. */
const addMonths = (ymKey, k) => { const [y, m] = ymKey.split('-').map(Number); const d = new Date(Date.UTC(y, m - 1 + k, 1)); return d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1); };
const monthOfDate = (d) => d.getFullYear() + '-' + pad(d.getMonth() + 1);

/** Months of the tax year still to come, this one included (November: November to March, 5) — the diff's own count. */
export function monthsLeftInTaxYear(today) {
  return monthsLeftOf(today instanceof Date ? today : dateOf(today));
}

/**
 * Where each gilt outside the rungs stands (7.11.1): 'available' (still to mature, or when it matures cannot be told: money
 * in the pension set against no year), 'cashNow' (it matured after the record was taken: its money is the pension's cash
 * now, counted there) or 'paid' (it matured before the record was taken: the pension's cash already holds it). A rung whose
 * gilt matured after the record was taken is 'cashNow' too. Every other line is as the diff reads it.
 */
function placed(roles) {
  return roles.map((r) => {
    if (r.role === 'matured' && r.cashNow) return { ...r, state: 'cashNow' };
    if (r.role !== 'gilt') return r;
    if (r.matures && r.paid) return { ...r, state: r.cashNow ? 'cashNow' : 'paid' };
    return { ...r, state: 'available' };
  });
}
const firstYearOf = (T, now) => { const thisTY = taxYearStartOf(now); return Math.max(thisTY, num(T.firstTaxYear) || thisTY); };

/**
 * The phase the plan's home reads (LifeStage.stageOf, as read.js planPage reads it: agreements first, then facts), or null.
 * Whether "What is covered" reads what is held (7.11.1) or what is kept turns on it: one rule for every reader.
 */
export function lifeOf(plan, now) {
  try { return stageOf(plan, now, { placing: planStage(plan, { now }), settings: effectiveStressSettings(plan, { now }) }); } catch { return null; }
}

/**
 * Each line of the record and the part it plays against the plan as locked (TransitionPlanner's roles, a gilt outside the
 * rungs placed as `placed` says): information for the move and What you hold, never a list of moves. Null on a plan with no
 * locked ladder document.
 */
export function heldOf(plan, { today }) {
  const now = dateOf(today);
  const doc = isLocked(plan) && isObj(plan.planDocument) ? plan.planDocument : null;
  if (!doc) return null;
  let m = null; try { m = moveInputs(plan, { now, roles: true }); } catch { m = null; }
  if (!m || !m.target || m.target.kind !== 'ladder' || !Array.isArray(m.diff.roles)) return null;
  return placed(m.diff.roles);
}

/**
 * Why a year needs nothing from the pension (7.11.1): the plan's own timeline — a lump sum it counts that year, or one it
 * counted earlier and carries forward, the State Pension, other income, or else.
 */
function paidByOf(doc, Y) {
  const row = Array.isArray(doc.timeline) ? doc.timeline.find((x) => x && x.taxYear === taxYearLabel(Y)) : null;
  if (row && num(row.lump) > 0) return Array.isArray(row.lumpIn) && row.lumpIn.some((x) => num(x && x.amount) > 0) ? 'lump' : 'lumpEarlier';
  if (row && num(row.sp) > 0) return num(row.other) > 0 ? 'spOther' : 'sp';
  if (row && num(row.other) > 0) return 'other';
  return 'else';
}

/**
 * The reading. Null when there is nothing to read: no plan document; or a record that keeps nothing and expects nothing,
 * and — read with what is held — holds nothing in the pension beyond the plan's own rungs and cash (7.11.1): for such a plan
 * the move's rungs and cash say it all, and it reads exactly as before. A pot plan (no rungs) has no years to read: `ladder`
 * is false and only what is kept and expected is said, as before.
 *
 * By phase (7.11.1), one rule for every reader (the home's line, What you hold, the move page in both views): living on the
 * plan, or Moving once what is held was accepted (Phases.heldPhase on the phase the home reads, `life`, worked out here when
 * not given), it reads what is held. Otherwise — Moving, when the move sells what is not the plan's — it reads only what the
 * person chose to keep, as 7.10.0 did: never a line the page beside it lists to sell. `asKept` (the keep test's own reading,
 * keepTest.js) reads it so in every phase.
 *
 * Month by month: each year's months in turn are paid by its rung or what stands in for it, then by the pension's cash.
 * @returns {null | { ladder, held, rows: [{ Y, year, need, monthsLeft, thisYear, source, rungs, standIns: [{ label, pays, fixed }], cash, held, toBuy, gap, paidBy, shortAt }],
 *   lastYear, totalGap, firstGap: { Y, year, gap, lastMonth, shortFrom }|null, standIns: [], kept: [], fundsGaps: { lines, total },
 *   expected: { items, total, late }, withExpected: { covered, short }|null, withAll: { covered, short }|null, heldAnotherWay: number, keptCount: number,
 *   roles: [], gilts: [], outside: { lines, total, gilts, funds }, withHeld: { covered, short, cover }|null, fromHeld: boolean, lumps: [{ Y, year, amount }], cashLeft: number }}
 */
export function gapsOf(plan, { today, asKept = false, life } = {}) {
  const now = dateOf(today);
  const rec = normaliseHoldings(plan && plan.holdings);
  const keeps = hasKeeps(rec);
  // nothing kept or expected: read only a pension line beyond the plan's own, while what is held is read (7.11.1)
  if (!keeps && (asKept || !rec.lines.some((l) => l.wrapper === 'SIPP'))) return null;
  const doc = isLocked(plan) && isObj(plan.planDocument) ? plan.planDocument : null;
  if (!doc) return null;
  const held = !asKept && heldPhase(life === undefined ? lifeOf(plan, now) : life);
  if (!keeps && !held) return null;
  let m = null; try { m = moveInputs(plan, { now, ...(held ? { roles: true } : {}) }); } catch { m = null; }
  if (!m || !m.target || m.target.kind === 'none') return null;
  const D = m.diff, T = m.target;
  const needs = yearNeedsOf(doc);
  const firstY = firstYearOf(T, now);
  const roles = held && T.kind === 'ladder' && Array.isArray(D.roles) ? placed(D.roles) : [];
  const fromHeld = roles.some((r) => r.role === 'gilt' || r.role === 'outside' || r.state === 'cashNow');
  if (!keeps && !fromHeld) return null;
  const kept = (D.kept || []).map((k) => ({ label: k.label || k.ticker || '', wrapper: k.wrapper, value: r0(k.value), fundsGaps: !!k.fundsGaps }));
  const fundsLines = kept.filter((k) => k.fundsGaps);
  const fundsGaps = { lines: fundsLines, total: fundsLines.reduce((s, k) => s + k.value, 0) };
  const expItems = expectedOf(rec).slice().sort((a, b) => String(a.by || '9999').localeCompare(String(b.by || '9999')));
  const expected = { items: expItems.map((e) => ({ id: e.id, label: e.label || '', wrapper: e.wrapper, amount: r0(e.amount), by: e.by })), total: expItems.reduce((s, e) => s + r0(e.amount), 0), late: [] };
  // each stand-in in the diff's order (two lines can share a name: never looked up by it)
  const standIns = (D.standIn || []).map((s) => ({ label: s.label || s.ticker || '', ticker: s.ticker || '', wrapper: s.wrapper, pays: r0(s.pays), real: r0(s.real != null ? s.real : s.pays), fixed: !!s.fixed, payKind: s.payKind, matures: s.matures || null, taxYears: s.taxYears.slice(), perYear: Array.isArray(s.perYear) ? s.perYear : [], gap: r0(s.gap), spare: r0(s.spare) }));
  // 7.11.1, read with what is held: the gilts outside the rungs (each placed), and every line in the pension beside the plan's
  // rungs and cash — a gilt still to mature, shares, a fund — as money available at today's value, set against no year
  const gilts = roles.filter((r) => r.role === 'gilt' || r.state === 'cashNow').map((r) => ({ at: r.at, label: r.label, state: r.state, matures: r.matures || null, value: r0(r.value), pays: r0(r.pays) }));
  const outLines = [...gilts.filter((x) => x.state === 'available').map((x) => ({ at: x.at, label: x.label, value: x.value, gilt: true })),
    ...roles.filter((r) => r.role === 'outside').map((r) => ({ at: r.at, label: r.label, value: r0(r.value) }))].sort((a, b) => num(a.at) - num(b.at));
  const giltsOut = outLines.filter((x) => x.gilt).reduce((s, x) => s + x.value, 0), fundsOut = outLines.filter((x) => !x.gilt).reduce((s, x) => s + x.value, 0);
  const outside = { lines: outLines, total: giltsOut + fundsOut, gilts: giltsOut, funds: fundsOut };
  const base = { held, standIns, kept, fundsGaps, expected, heldAnotherWay: new Set(standIns.flatMap((s) => s.taxYears)).size, keptCount: kept.length, roles, gilts, outside, fromHeld, lumps: [], cashLeft: 0 };
  if (T.kind !== 'ladder') return { ...base, ladder: false, rows: [], lastYear: null, totalGap: 0, toBuy: 0, firstGap: null, withExpected: null, withAll: null, withHeld: null };

  const thisTY = taxYearStartOf(now);
  const running = !!T.running;
  const standYears = new Set(standIns.flatMap((s) => s.taxYears));
  const cashAhead = Object.keys(needs).map(Number).filter((Y) => needs[Y].from === 'cash' && Y >= firstY);
  const lastY = Math.max(firstY, ...[...standYears].filter((Y) => Y >= firstY), ...cashAhead);
  const paidTidms = new Set((T.paid || []).map((p) => String(p.ticker || '').toUpperCase()));
  const rungRow = (Y) => {
    const has = (x) => Array.isArray(x.taxYears) && x.taxYears.map(Number).includes(Y);
    // a rung held above its target is held too (7.11.1: its excess is the move's, never this year's money missing)
    if (D.hold.some(has) || D.sell.some((x) => x.kind === 'gilt' && has(x))) return { held: 1, toBuy: 0 };
    const b = D.buy.find((x) => x.kind === 'gilt' && has(x));
    if (b) { const hu = num(b.heldUnits), u = num(b.units); return { held: hu + u > 0 ? hu / (hu + u) : 0, toBuy: hu + u > 0 ? u / (hu + u) : 1 }; }
    return null;
  };
  const rows = [];
  for (let Y = firstY; Y <= lastY; Y++) {
    const full = needs[Y] ? num(needs[Y].need) : 0;
    const thisYear = running && Y === thisTY;
    const monthsLeft = thisYear ? monthsLeftInTaxYear(now) : 12;
    const need = full * monthsLeft / 12;
    const from = needs[Y] ? needs[Y].from : null;
    const sIn = standIns.map((s) => { const p = s.perYear.find((x) => x.Y === Y); return p ? { label: s.label, pays: Math.min(r0(p.pays), r0(need)), fixed: s.fixed } : null; }).filter(Boolean);
    let source = standYears.has(Y) ? 'standIn' : thisYear ? 'thisYear' : from === 'cash' ? 'cash' : (from && paidTidms.has(String(from).toUpperCase())) ? 'paid' : 'rung';
    let rungs = 0, toBuy = 0;
    if (source === 'rung') { const r = rungRow(Y); if (r) { rungs = need * r.held; toBuy = need * r.toBuy; } else source = 'cash'; }
    // a year the plan needs nothing from the pension for (7.11.1): what pays it, from the plan's own timeline
    const paidBy = needs[Y] && full <= 0 ? paidByOf(doc, Y) : null;
    rows.push({ Y, year: taxYearLabel(Y), need: r0(need), full: r0(full), needExact: need, monthsLeft, thisYear, source, rungs: r0(rungs), rungsExact: rungs, standIns: sIn, cash: 0, held: 0, toBuy: r0(toBuy), gap: 0, paidBy, shortAt: null });
  }
  // The pension's cash, used year by year and month by month: each year's months in turn are paid by what is there from its
  // start (its rung, or what stands in for it), then by the pension's cash. What a stand-in pays beyond its years is cash
  // from the year after (said, never lost). While the plan runs, this year's months are the ones still to come.
  let pool = num(D.totals && D.totals.cashHeld);
  const spares = standIns.filter((s) => s.spare > 0).map((s) => ({ after: Math.max(...s.taxYears), amount: s.spare, used: false }));
  for (const r of rows) {
    for (const x of spares) if (!x.used && x.after < r.Y) { pool += x.amount; x.used = true; }
    const fromStandIns = r.standIns.reduce((s, x) => s + x.pays, 0);
    const n = r.monthsLeft;
    const monthly = n > 0 ? r.needExact / n : 0;
    // the rung's months short (before the plan runs its share to buy; while living on it, from the pension's cash)
    const rungShort = r.source === 'rung' && !held;
    let fromStart = r.source === 'rung' ? r.rungsExact : fromStandIns;
    let fromPool = 0, short = 0, buy = 0;
    for (let k = 0; k < n && monthly > 0; k++) {
      let want = monthly;
      const a = Math.min(fromStart, want); fromStart -= a; want -= a;
      if (want > 0 && rungShort) { buy += want; continue; }
      if (want > 0) { const c = Math.min(pool, want); pool -= c; fromPool += c; want -= c; }
      if (want > 0.5) { short += want; if (r.shortAt == null) r.shortAt = k; }
    }
    if (r.source === 'rung' && !held) { r.held = r0(r.rungsExact); r.toBuy = r0(buy); continue; }
    r.cash = r0(fromPool);
    r.held = r0((r.source === 'rung' ? r.rungsExact : fromStandIns) + fromPool);
    // before the plan runs, a cash year's money still to set aside is a move (the cash to hold), not a gap; living on the plan
    // (or once what is held was accepted) it is never a move: what is not held is not covered
    if (!running && !held && r.source === 'cash') r.toBuy = r0(short); else { r.gap = r0(short); r.toBuy = 0; }
  }
  for (const x of spares) if (!x.used) { pool += x.amount; x.used = true; }
  const totalGap = rows.reduce((s, r) => s + r.gap, 0);
  const g0 = rows.find((r) => r.gap > 0) || null;
  let firstGap = null;
  if (g0) {
    const start = g0.thisYear ? monthOfDate(now) : g0.Y + '-04';
    const months = g0.shortAt != null ? g0.shortAt : 0;
    firstGap = { Y: g0.Y, year: g0.year, gap: g0.gap, lastMonth: months > 0 ? addMonths(start, months - 1) : null, shortFrom: addMonths(start, months) };
  }
  for (const r of rows) { delete r.needExact; delete r.rungsExact; }
  // money expected after the first year's money runs short (an expected date later than that month)
  if (firstGap) expected.late = expected.items.filter((e) => e.by && e.by > firstGap.shortFrom).map((e) => e.id);
  // the lump sums the plan itself counts in the years read (7.11.1): money expected later may be one of them
  const lumps = [];
  for (const r of rows) {
    const row = Array.isArray(doc.timeline) ? doc.timeline.find((x) => x && x.taxYear === r.year) : null;
    const amount = row && Array.isArray(row.lumpIn) ? row.lumpIn.reduce((s, x) => s + num(x && x.amount), 0) : 0;
    if (amount > 0) lumps.push({ Y: r.Y, year: r.year, amount: r0(amount) });
  }
  const toBuyTotal = rows.reduce((s, r) => s + r.toBuy, 0);
  const cover = (have) => (totalGap <= 0 ? null : have >= totalGap ? { covered: true, short: 0 } : { covered: false, short: r0(totalGap - have) });
  // what the money available would cover of the years not covered, at today's value (7.11.1)
  const coverHeld = (have) => { const c = cover(have); return c ? { ...c, cover: r0(Math.min(totalGap, Math.max(0, have))) } : null; };
  return { ...base, lumps, ladder: true, rows, lastYear: lastY, totalGap: r0(totalGap), toBuy: r0(toBuyTotal), firstGap,
    // the pension's cash left after the last year read (7.11.1, read with what is held)
    cashLeft: fromHeld ? r0(pool) : 0,
    withExpected: expected.total > 0 ? cover(expected.total) : null,
    withAll: expected.total > 0 && fundsGaps.total > 0 ? cover(expected.total + fundsGaps.total) : fundsGaps.total > 0 ? cover(fundsGaps.total) : null,
    // 7.11.1: what the money available in the pension (and what is kept and counted) would cover at today's value; the money
    // expected is leant on only when what is held alone falls short, since it may not arrive (expected: true when it is)
    withHeld: outside.total > 0 ? withHeldOf(coverHeld, fundsGaps.total + outside.total, expected.total) : null };
}

/** What is held would cover, alone first; with the money expected only when what is held alone falls short. */
function withHeldOf(coverHeld, held, expected) {
  const alone = coverHeld(held);
  if (!alone || alone.covered || !(expected > 0)) return alone ? { ...alone, expected: false } : null;
  return { ...coverHeld(held + expected), expected: true };
}

const listWords = (xs) => (xs.length <= 1 ? xs.join('') : xs.slice(0, -1).join(', ') + ' and ' + xs[xs.length - 1]);

/**
 * The reading as sentences (one list for both apps), each { id, parts: [{ key, slots, words }] }: `key` names a template in
 * src/v7/copy/gaps.js GAPS, `slots` its figures (already in pounds and months), `words` slot → another GAPS key (a plural).
 * The apps fill them (sayGapLine below for the classic planner; the V7 screen with its own fill). Consequences only: what
 * lasts until when, what is covered with the money expected, what a fixed pay or a value that can fall means.
 */
export function gapSentences(g) {
  if (!g) return [];
  const out = [];
  const say = (id, ...parts) => out.push({ id, parts: parts.map((p) => ({ key: p[0], slots: p[1] || {}, words: p[2] || {} })) });
  const last = g.lastYear ? taxYearLabel(g.lastYear) : '';
  // a clause with nothing in it is left out; read with what is held and nothing kept, the lead says it all (7.11.1)
  if (g.ladder && !(g.fromHeld && g.heldAnotherWay === 0 && g.keptCount === 0)) {
    const n = g.heldAnotherWay, k = g.keptCount;
    const key = n > 0 && k > 0 ? 'strategyBoth' : n > 0 ? 'strategyYears' : k > 0 ? 'strategyKept' : 'strategyNone';
    say('strategy', [key, { n: String(n), k: String(k) }, { years: n === 1 ? 'yearOne' : 'yearMany', holdings: k === 1 ? 'holdingOne' : 'holdingMany' }]);
  }
  // a year the plan needs nothing from the pension for (7.11.1): what pays it, so "£0" is never a puzzle
  const W = { lump: 'whyLump', lumpEarlier: 'whyLumpEarlier', sp: 'whySp', spOther: 'whySpOther', other: 'whyOther', else: 'whyElse' };
  for (const r of g.rows.filter((x) => x.paidBy)) say('noNeed', ['noNeed', { year: r.year }, { why: W[r.paidBy] }]);
  // a gilt outside the rungs that has matured (7.11.1): its money is the pension's cash, counted there and never twice
  for (const x of g.gilts || []) {
    const month = x.matures ? monthWords(x.matures.slice(0, 7)) : '';
    if (x.state === 'paid') say('gilt', ['giltPaid', { label: x.label, month }]);
    // matured after the record was taken: what it paid is counted as the pension's cash now (7.11.1)
    else if (x.state === 'cashNow') say('gilt', ['giltCashNow', { label: x.label, month, pays: pounds(x.pays) }]);
  }
  // a fixed pay, and what it is worth in today's money by the time it is paid (the plan's needs are in today's money)
  for (const s of g.standIns.filter((x) => x.fixed)) say('fixed', s.real < s.pays - 1 ? ['fixedReal', { label: s.label, pays: pounds(s.pays), real: pounds(s.real) }] : ['fixed', { label: s.label, pays: pounds(s.pays) }]);
  for (const s of g.standIns.filter((x) => x.spare > 0)) say('spare', ['spare', { label: s.label, spare: pounds(s.spare) }]);
  // every year covered — by what is held, or once the cash still to set aside is bought (never "held" while it is still to buy)
  if (g.ladder && !g.firstGap) say('noGap', g.toBuy > 0 ? ['noGapToBuy', { year: last, toBuy: pounds(g.toBuy) }] : ['noGap', { year: last }]);
  if (g.firstGap) {
    const f = g.firstGap;
    const runs = [f.lastMonth ? 'lastsUntil' : 'shortFrom', { year: f.year, month: monthWords(f.lastMonth || f.shortFrom) }];
    if (g.expected.total > 0) say('runsOut', ['withoutExpected'], runs); else say('runsOut', runs);
    say('totalGap', ['totalGap', { gap: pounds(g.totalGap), year: last }]);
  }
  if (g.withExpected) say('withExpected', g.withExpected.covered ? ['withExpected', { year: last }] : ['withExpectedShort', { short: pounds(g.withExpected.short), year: last }]);
  // a lump sum the plan itself counts (7.11.1): money expected later may be that money, and then it is not extra
  if (g.expected.total > 0) for (const l of g.lumps || []) say('lumpExpected', ['lumpExpected', { amount: pounds(l.amount), year: l.year }]);
  for (const e of g.expected.items.filter((x) => g.expected.late.includes(x.id))) say('late', e.label ? ['late', { label: e.label, by: monthWords(e.by), month: monthWords(g.firstGap.shortFrom) }] : ['late', { by: monthWords(e.by), month: monthWords(g.firstGap.shortFrom) }, { label: 'expectedNoLabel' }]);
  if (g.fundsGaps.total > 0) {
    // a pot plan has no years to fill: what is counted is counted toward the plan's money
    say('fundsGaps', [g.ladder ? 'fundsGaps' : 'fundsPlan', { list: listWords(g.fundsGaps.lines.map((k) => k.label)), total: pounds(g.fundsGaps.total) }]);
    const both = g.expected.total > 0;
    // with money available in the pension too, one sentence says what all of it would cover (below)
    if (g.withAll && !(g.outside && g.outside.total > 0)) say('withAll', g.withAll.covered ? [both ? 'withAll' : 'withKept', { year: last }] : [both ? 'withAllShort' : 'withKeptShort', { short: pounds(g.withAll.short), year: last }]);
  }
  // the money available in the pension beside the plan's rungs and cash (7.11.1): set against no year, never ignored — one
  // line with what it is worth today, gilts and shares and funds apart; what that would cover; and that shares and funds can fall
  if (g.outside && g.outside.total > 0) {
    const o = g.outside;
    say('outside', [o.gilts > 0 && o.funds > 0 ? 'availableBoth' : o.gilts > 0 ? 'availableGilts' : 'availableFunds', { gilts: pounds(o.gilts), funds: pounds(o.funds) }]);
    const exp = g.withHeld && g.withHeld.expected;
    if (g.withHeld) say('withHeld', g.withHeld.covered ? [exp ? 'withHeldExpected' : 'withHeld', { year: last }] : [exp ? 'withHeldExpectedShort' : 'withHeldShort', { cover: pounds(g.withHeld.cover), short: pounds(g.withHeld.short), year: last }]);
    if (o.funds > 0) say('outsideCanFall', [o.gilts > 0 ? 'outsideCanFallGilts' : 'outsideCanFall']);
  }
  // what the pension's cash still holds after the last year read (7.11.1): never lost
  if (g.ladder && g.fromHeld && g.cashLeft > 0 && g.lastYear) say('cashLeft', ['cashLeft', { amount: pounds(g.cashLeft), year: last }]);
  if (g.kept.length) say('canFall', [g.ladder ? 'canFall' : 'canFallPot']);
  return out;
}

/** One sentence in words, from the words given (GAPS): every part's template filled with its slots and its plural words. */
export function sayGapLine(line, W) {
  const fillIn = (t, slots) => String(t || '').replace(/\{(\w+)\}/g, (m, k) => (slots && slots[k] != null ? String(slots[k]) : m));
  return (line && Array.isArray(line.parts) ? line.parts : []).map((p) => {
    const words = {};
    for (const [k, v] of Object.entries(p.words || {})) words[k] = W[v];
    return fillIn(W[p.key], { ...p.slots, ...words });
  }).join('');
}

/** The reading as the screens draw it: every figure in pounds, each row's parts named. Null in, null out. */
export function gapsView(g) {
  if (!g) return null;
  const P = (v) => pounds(v);
  return {
    ladder: g.ladder, lastYear: g.lastYear ? taxYearLabel(g.lastYear) : null, totalGap: P(g.totalGap), hasGap: g.totalGap > 0,
    rows: g.rows.map((r) => ({ Y: r.Y, year: r.year, thisYear: r.thisYear, monthsLeft: String(r.monthsLeft), source: r.source, need: P(r.need), held: P(r.held), gap: r.gap > 0 ? P(r.gap) : null, toBuy: r.toBuy > 0 ? P(r.toBuy) : null,
      parts: [...r.standIns.filter((s) => s.pays > 0).map((s) => ({ kind: 'standIn', label: s.label, amount: P(s.pays) })), ...(r.rungs > 0 ? [{ kind: 'rungs', amount: P(r.rungs) }] : []),
        ...(r.cash > 0 ? [{ kind: 'cash', amount: P(r.cash) }] : [])] })),
    standIns: g.standIns.map((s) => ({ label: s.label, wrapper: s.wrapper, pays: P(s.pays), real: P(s.real), fixed: s.fixed, years: s.taxYears.map(taxYearLabel) })),
    kept: g.kept.map((k) => ({ label: k.label, wrapper: k.wrapper, value: P(k.value), fundsGaps: k.fundsGaps })),
    expected: g.expected.items.map((e) => ({ id: e.id, label: e.label, amount: P(e.amount), by: e.by ? monthWords(e.by) : null, late: g.expected.late.includes(e.id) })),
    lines: gapSentences(g),
    // 7.11.1, only on a reading of what is held beyond the plan's own (a reading of what is kept is drawn as before): the lead
    // that says so, and each line of the record with its part (rolesView)
    ...(g.fromHeld ? { lead: 'leadHeld', held: rolesView(g.roles) } : {})
  };
}

/**
 * Each line of the record and its part, as the screens draw it (7.11.1; heldOf / gapsOf `roles`): figures in pounds, a gilt
 * outside the rungs with the month it matures, a fact only (`state`: available, paid or cashNow), a rung with its tax years
 * and its units held and to buy. Null in, null out.
 */
export function rolesView(roles) {
  if (!Array.isArray(roles)) return null;
  const u = (v) => (v == null ? null : String(Math.round(+v || 0)));
  return roles.map((r) => ({
    at: r.at, label: r.label, ticker: r.ticker || '', sedol: r.sedol || '', wrapper: r.wrapper, role: r.role, value: pounds(r.value), units: u(r.units),
    ...(r.role === 'gilt' || r.state === 'cashNow' ? { state: r.state, matures: r.matures ? monthWords(r.matures.slice(0, 7)) : null, pays: r.pays != null ? pounds(r.pays) : null } : {}),
    ...(r.rung ? { rung: { label: r.rung.label, ticker: r.rung.ticker, years: r.rung.taxYears.map(taxYearLabel), units: u(r.rung.units), heldUnits: u(r.rung.heldUnits) } } : {})
  }));
}

/** The one line the plan's home says when a year is not yet covered: the first such year and its gap, or null. */
export function gapHeadline(g) {
  return g && g.firstGap ? { year: g.firstGap.year, Y: g.firstGap.Y, gap: pounds(g.firstGap.gap) } : null;
}
