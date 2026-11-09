/**
 * "What is covered, year by year" (7.6.0): a locked ladder plan read with what the person chose to keep. The settings and the
 * plan document stay as locked; what the person holds may differ from the ladder by choice — a line kept to stand in for some
 * years' money (a conventional gilt in place of a rung or a cash year, say), a line kept by choice, money expected later — and
 * this says honestly what that means, as consequences and never as advice: per tax year from this one to the last year a
 * kept line stands in for, what the plan needs, what is held for it, the gap, and what is named to cover the gaps.
 *
 *   gapsOf(plan, { today })      the reading, as data (null on a plan that keeps nothing and expects nothing)
 *   gapSentences(g, W)           the reading in words, from the words given (src/v7/copy/gaps.js): one list, both apps
 *
 * Pure: the plan brought up to date in memory and today's date; nothing here writes, runs or reads a clock. The diff is
 * TransitionPlanner's through PlanReading.moveInputs — the very reading the move page and the home make.
 */
import { moveInputs } from '../../services/PlanReading.js';
import { yearNeedsOf, monthsLeftInTaxYear as monthsLeftOf } from '../../services/TransitionPlanner.js';
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
 * The reading. Null when the plan keeps nothing and expects nothing (a plan without keeps reads exactly as before), or has
 * no plan document. A pot plan (no rungs) has no years to read: `ladder` is false and only what is kept and expected is said.
 * @returns {null | { ladder, rows: [{ Y, year, need, monthsLeft, thisYear, source, rungs, standIns: [{ label, pays, fixed }], cash, held, toBuy, gap }],
 *   lastYear, totalGap, firstGap: { Y, year, gap, lastMonth, shortFrom }|null, standIns: [], kept: [], fundsGaps: { lines, total },
 *   expected: { items, total, late }, withExpected: { covered, short }|null, withAll: { covered, short }|null, heldAnotherWay: number, keptCount: number }}
 */
export function gapsOf(plan, { today }) {
  const now = dateOf(today);
  const rec = normaliseHoldings(plan && plan.holdings);
  if (!hasKeeps(rec)) return null;
  const doc = isLocked(plan) && isObj(plan.planDocument) ? plan.planDocument : null;
  if (!doc) return null;
  let m = null; try { m = moveInputs(plan, { now }); } catch { m = null; }
  if (!m || !m.target || m.target.kind === 'none') return null;
  const D = m.diff, T = m.target;
  const kept = (D.kept || []).map((k) => ({ label: k.label || k.ticker || '', wrapper: k.wrapper, value: r0(k.value), fundsGaps: !!k.fundsGaps }));
  const fundsLines = kept.filter((k) => k.fundsGaps);
  const fundsGaps = { lines: fundsLines, total: fundsLines.reduce((s, k) => s + k.value, 0) };
  const expItems = expectedOf(rec).slice().sort((a, b) => String(a.by || '9999').localeCompare(String(b.by || '9999')));
  const expected = { items: expItems.map((e) => ({ id: e.id, label: e.label || '', wrapper: e.wrapper, amount: r0(e.amount), by: e.by })), total: expItems.reduce((s, e) => s + r0(e.amount), 0), late: [] };
  // each stand-in in the diff's order (two lines can share a name: never looked up by it)
  const standIns = (D.standIn || []).map((s) => ({ label: s.label || s.ticker || '', ticker: s.ticker || '', wrapper: s.wrapper, pays: r0(s.pays), real: r0(s.real != null ? s.real : s.pays), fixed: !!s.fixed, payKind: s.payKind, matures: s.matures || null, taxYears: s.taxYears.slice(), perYear: Array.isArray(s.perYear) ? s.perYear : [], gap: r0(s.gap), spare: r0(s.spare) }));
  const base = { standIns, kept, fundsGaps, expected, heldAnotherWay: new Set(standIns.flatMap((s) => s.taxYears)).size, keptCount: kept.length };
  if (T.kind !== 'ladder') return { ...base, ladder: false, rows: [], lastYear: null, totalGap: 0, toBuy: 0, firstGap: null, withExpected: null, withAll: null };

  const needs = yearNeedsOf(doc);
  const thisTY = taxYearStartOf(now);
  const running = !!T.running;
  const firstY = Math.max(thisTY, num(T.firstTaxYear) || thisTY);
  const standYears = new Set(standIns.flatMap((s) => s.taxYears));
  const cashAhead = Object.keys(needs).map(Number).filter((Y) => needs[Y].from === 'cash' && Y >= firstY);
  const lastY = Math.max(firstY, ...[...standYears].filter((Y) => Y >= firstY), ...cashAhead);
  const paidTidms = new Set((T.paid || []).map((p) => String(p.ticker || '').toUpperCase()));
  const rungRow = (Y) => {
    const has = (x) => Array.isArray(x.taxYears) && x.taxYears.map(Number).includes(Y);
    if (D.hold.some(has)) return { held: 1, toBuy: 0 };
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
    rows.push({ Y, year: taxYearLabel(Y), need: r0(need), full: r0(full), monthsLeft, thisYear, source, rungs: r0(rungs), standIns: sIn, cash: 0, held: 0, toBuy: r0(toBuy), gap: 0 });
  }
  // the pension's cash, used year by year: this year's months first, then each year whose money is cash or stood in for. What
  // a stand-in pays beyond the years it stands in for is cash from the year after its last (said, never lost).
  let pool = num(D.totals && D.totals.cashHeld);
  const spares = standIns.filter((s) => s.spare > 0).map((s) => ({ after: Math.max(...s.taxYears), amount: s.spare, used: false }));
  for (const r of rows) {
    for (const x of spares) if (!x.used && x.after < r.Y) { pool += x.amount; x.used = true; }
    if (r.source === 'rung') { r.held = r.rungs; continue; }
    const fromStandIns = r.standIns.reduce((s, x) => s + x.pays, 0);
    const want = Math.max(0, r.need - fromStandIns);
    const take = Math.min(pool, want);
    pool -= take;
    r.cash = r0(take);
    r.held = r0(fromStandIns + take);
    const short = Math.max(0, r.need - r.held);
    // before the plan runs, a cash year's money still to set aside is a move (the cash to hold), not a gap
    if (!running && r.source === 'cash') r.toBuy = r0(short); else r.gap = r0(short);
  }
  const totalGap = rows.reduce((s, r) => s + r.gap, 0);
  const g0 = rows.find((r) => r.gap > 0) || null;
  let firstGap = null;
  if (g0) {
    const monthly = g0.full / 12;
    const start = g0.thisYear ? monthOfDate(now) : g0.Y + '-04';
    const months = monthly > 0 ? Math.max(0, Math.min(g0.monthsLeft, Math.floor((g0.held + 0.5) / monthly))) : 0;
    firstGap = { Y: g0.Y, year: g0.year, gap: g0.gap, lastMonth: months > 0 ? addMonths(start, months - 1) : null, shortFrom: addMonths(start, months) };
  }
  // money expected after the first year's money runs short (an expected date later than that month)
  if (firstGap) expected.late = expected.items.filter((e) => e.by && e.by > firstGap.shortFrom).map((e) => e.id);
  const toBuyTotal = rows.reduce((s, r) => s + r.toBuy, 0);
  const cover = (have) => (totalGap <= 0 ? null : have >= totalGap ? { covered: true, short: 0 } : { covered: false, short: r0(totalGap - have) });
  return { ...base, ladder: true, rows, lastYear: lastY, totalGap: r0(totalGap), toBuy: r0(toBuyTotal), firstGap,
    withExpected: expected.total > 0 ? cover(expected.total) : null,
    withAll: expected.total > 0 && fundsGaps.total > 0 ? cover(expected.total + fundsGaps.total) : fundsGaps.total > 0 ? cover(fundsGaps.total) : null };
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
  if (g.ladder) {
    // a clause with nothing in it is left out
    const n = g.heldAnotherWay, k = g.keptCount;
    const key = n > 0 && k > 0 ? 'strategyBoth' : n > 0 ? 'strategyYears' : k > 0 ? 'strategyKept' : 'strategyNone';
    say('strategy', [key, { n: String(n), k: String(k) }, { years: n === 1 ? 'yearOne' : 'yearMany', holdings: k === 1 ? 'holdingOne' : 'holdingMany' }]);
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
  for (const e of g.expected.items.filter((x) => g.expected.late.includes(x.id))) say('late', e.label ? ['late', { label: e.label, by: monthWords(e.by), month: monthWords(g.firstGap.shortFrom) }] : ['late', { by: monthWords(e.by), month: monthWords(g.firstGap.shortFrom) }, { label: 'expectedNoLabel' }]);
  if (g.fundsGaps.total > 0) {
    say('fundsGaps', ['fundsGaps', { list: listWords(g.fundsGaps.lines.map((k) => k.label)), total: pounds(g.fundsGaps.total) }]);
    const both = g.expected.total > 0;
    if (g.withAll) say('withAll', g.withAll.covered ? [both ? 'withAll' : 'withKept', { year: last }] : [both ? 'withAllShort' : 'withKeptShort', { short: pounds(g.withAll.short), year: last }]);
  }
  if (g.kept.length) say('canFall', ['canFall']);
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
      parts: [...r.standIns.filter((s) => s.pays > 0).map((s) => ({ kind: 'standIn', label: s.label, amount: P(s.pays) })), ...(r.rungs > 0 ? [{ kind: 'rungs', amount: P(r.rungs) }] : []), ...(r.cash > 0 ? [{ kind: 'cash', amount: P(r.cash) }] : [])] })),
    standIns: g.standIns.map((s) => ({ label: s.label, wrapper: s.wrapper, pays: P(s.pays), real: P(s.real), fixed: s.fixed, years: s.taxYears.map(taxYearLabel) })),
    kept: g.kept.map((k) => ({ label: k.label, wrapper: k.wrapper, value: P(k.value), fundsGaps: k.fundsGaps })),
    expected: g.expected.items.map((e) => ({ id: e.id, label: e.label, amount: P(e.amount), by: e.by ? monthWords(e.by) : null, late: g.expected.late.includes(e.id) })),
    lines: gapSentences(g)
  };
}

/** The one line the plan's home says when a year is not yet covered: the first such year and its gap, or null. */
export function gapHeadline(g) {
  return g && g.firstGap ? { year: g.firstGap.year, Y: g.firstGap.Y, gap: pounds(g.firstGap.gap) } : null;
}
