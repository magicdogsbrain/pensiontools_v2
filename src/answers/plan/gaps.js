/**
 * "What is covered, year by year" (7.6.0; 7.11.1: read with what the person actually holds): a locked ladder plan read with
 * what the person holds, keeps and expects. The settings and the plan document stay as locked; what the person holds may
 * differ from the ladder — a gilt that is none of the plan's rungs, shares or a fund outside the plan's mix, a line kept to
 * stand in for some years' money, a line kept by choice, money expected later — and this says honestly what that means, as
 * consequences and never as advice: per tax year from this one to the last year anything held is counted toward, what the
 * plan needs, what is held for it, the gap, and what could cover the gaps.
 *
 * What counts (7.11.1), with no "Keep this" needed: the plan's rungs; the pension's cash, as it is today; a gilt that is none
 * of the rungs, toward the tax year it matures in — when that can be told from its SEDOL, its name or its code (never guessed
 * from a year) — at what it pays (TransitionPlanner.standInPays: a conventional gilt its face value and the coupons still to
 * come, at today's prices; an index-linked one its nominal times today's index ratio), what it pays beyond that year being the
 * pension's cash for the years after; a person's own "stands in for" choice wins over its maturity. Shares and funds outside
 * the plan's mix are never held for a year (their value can fall): one line says what they are worth today and how much of
 * the gaps they would cover at that value. Money expected later, as today.
 *
 *   gapsOf(plan, { today, asKept })   the reading, as data (null when there is nothing to read: see gapsOf)
 *   heldOf(plan, { today })           each line of the record and the part it plays (rung, part-bought rung, a gilt counted
 *                                     toward its tax year, outside the plan's mix, cash…), or null without a locked ladder
 *   gapSentences(g)                   the reading in words, from the words given (src/v7/copy/gaps.js): one list, both apps
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
 * Where each gilt outside the rungs stands (7.11.1): 'counted' toward a tax year (`Y`: the year it matures in, or the
 * reading's first year for one maturing before it), 'unknown' (when it matures cannot be told), 'paid' (it has matured) or
 * 'after' (it matures after the plan's last year). Every other line is as the diff reads it.
 */
function placed(roles, { firstY, planLast }) {
  return roles.map((r) => {
    if (r.role !== 'gilt') return r;
    if (!r.matures) return { ...r, state: 'unknown' };
    if (r.paid) return { ...r, state: 'paid' };
    const Y = Math.max(r.Y, firstY);
    return Y <= planLast ? { ...r, state: 'counted', countsToward: Y } : { ...r, state: 'after' };
  });
}
const firstYearOf = (T, now) => { const thisTY = taxYearStartOf(now); return Math.max(thisTY, num(T.firstTaxYear) || thisTY); };
const lastYearOf = (needs) => { const ys = Object.keys(needs).map(Number); return ys.length ? Math.max(...ys) : -Infinity; };

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
  return placed(m.diff.roles, { firstY: firstYearOf(m.target, now), planLast: lastYearOf(yearNeedsOf(doc)) });
}

/** Why a year needs nothing from the pension (7.11.1): the plan's own timeline — a lump sum it counts, other income, or else. */
function paidByOf(doc, Y) {
  const row = Array.isArray(doc.timeline) ? doc.timeline.find((x) => x && x.taxYear === taxYearLabel(Y)) : null;
  if (row && num(row.lump) > 0) return 'lump';
  if (row && num(row.other) > 0) return 'other';
  return 'else';
}

/**
 * The reading. Null when there is nothing to read: no plan document; or a record that keeps nothing, expects nothing and
 * holds nothing in the pension beyond the plan's own rungs and cash (7.11.1) — for such a plan the move's rungs and cash say it
 * all, and it reads exactly as before. A pot plan (no rungs) has no years to read: `ladder` is false and only what is kept
 * and expected is said, as before. `asKept` (the keep test's own reading, keepTest.js): only what the person chose to keep,
 * as before 7.11.1 — the lines not kept are the move's to sell there.
 * @returns {null | { ladder, rows: [{ Y, year, need, monthsLeft, thisYear, source, rungs, standIns: [{ label, pays, fixed }], gilts: [{ label, pays, fixed }], cash, held, toBuy, gap, paidBy }],
 *   lastYear, totalGap, firstGap: { Y, year, gap, lastMonth, shortFrom }|null, standIns: [], kept: [], fundsGaps: { lines, total },
 *   expected: { items, total, late }, withExpected: { covered, short }|null, withAll: { covered, short }|null, heldAnotherWay: number, keptCount: number,
 *   roles: [], gilts: [], outside: { lines, total }, withHeld: { covered, short }|null, fromHeld: boolean, lumps: [{ Y, year, amount }] }}
 */
export function gapsOf(plan, { today, asKept = false }) {
  const now = dateOf(today);
  const rec = normaliseHoldings(plan && plan.holdings);
  const keeps = hasKeeps(rec);
  // nothing kept or expected: read only a pension line beyond the plan's own (7.11.1); the keep test reads what is kept alone
  if (!keeps && (asKept || !rec.lines.some((l) => l.wrapper === 'SIPP'))) return null;
  const doc = isLocked(plan) && isObj(plan.planDocument) ? plan.planDocument : null;
  if (!doc) return null;
  let m = null; try { m = moveInputs(plan, { now, ...(asKept ? {} : { roles: true }) }); } catch { m = null; }
  if (!m || !m.target || m.target.kind === 'none') return null;
  const D = m.diff, T = m.target;
  const needs = yearNeedsOf(doc);
  const firstY = firstYearOf(T, now);
  const roles = !asKept && T.kind === 'ladder' && Array.isArray(D.roles) ? placed(D.roles, { firstY, planLast: lastYearOf(needs) }) : [];
  const fromHeld = roles.some((r) => r.role === 'gilt' || r.role === 'outside');
  if (!keeps && !fromHeld) return null;
  const kept = (D.kept || []).map((k) => ({ label: k.label || k.ticker || '', wrapper: k.wrapper, value: r0(k.value), fundsGaps: !!k.fundsGaps }));
  const fundsLines = kept.filter((k) => k.fundsGaps);
  const fundsGaps = { lines: fundsLines, total: fundsLines.reduce((s, k) => s + k.value, 0) };
  const expItems = expectedOf(rec).slice().sort((a, b) => String(a.by || '9999').localeCompare(String(b.by || '9999')));
  const expected = { items: expItems.map((e) => ({ id: e.id, label: e.label || '', wrapper: e.wrapper, amount: r0(e.amount), by: e.by })), total: expItems.reduce((s, e) => s + r0(e.amount), 0), late: [] };
  // each stand-in in the diff's order (two lines can share a name: never looked up by it)
  const standIns = (D.standIn || []).map((s) => ({ label: s.label || s.ticker || '', ticker: s.ticker || '', wrapper: s.wrapper, pays: r0(s.pays), real: r0(s.real != null ? s.real : s.pays), fixed: !!s.fixed, payKind: s.payKind, matures: s.matures || null, taxYears: s.taxYears.slice(), perYear: Array.isArray(s.perYear) ? s.perYear : [], gap: r0(s.gap), spare: r0(s.spare) }));
  // 7.11.1: the gilts outside the rungs (each placed), and the shares and funds outside the plan's mix, at today's value
  // (what is kept alone still counts a gilt maturing in a cash year: the move never sells it, it is that year's cash)
  const gilts = asKept ? (D.cashGilts || []).map((x) => ({ at: null, label: x.label, state: 'counted', matures: x.matures, Y: x.taxYear, pays: r0(x.pays), real: r0(x.real != null ? x.real : x.pays), fixed: !!x.fixed, payKind: x.payKind || null, used: 0, spare: 0 }))
    : roles.filter((r) => r.role === 'gilt').map((r) => ({ at: r.at, label: r.label, state: r.state, matures: r.matures, Y: r.state === 'counted' ? r.countsToward : null, pays: r0(r.pays), real: r0(r.real != null ? r.real : r.pays), fixed: !!r.fixed, payKind: r.payKind || null, used: 0, spare: 0 }));
  const outLines = roles.filter((r) => r.role === 'outside').map((r) => ({ at: r.at, label: r.label, value: r0(r.value) }));
  const outside = { lines: outLines, total: outLines.reduce((s, x) => s + x.value, 0) };
  const base = { standIns, kept, fundsGaps, expected, heldAnotherWay: new Set(standIns.flatMap((s) => s.taxYears)).size, keptCount: kept.length, roles, gilts, outside, fromHeld, lumps: [] };
  if (T.kind !== 'ladder') return { ...base, ladder: false, rows: [], lastYear: null, totalGap: 0, toBuy: 0, firstGap: null, withExpected: null, withAll: null, withHeld: null };

  const thisTY = taxYearStartOf(now);
  const running = !!T.running;
  const standYears = new Set(standIns.flatMap((s) => s.taxYears));
  const counted = gilts.filter((x) => x.state === 'counted');
  const cashAhead = Object.keys(needs).map(Number).filter((Y) => needs[Y].from === 'cash' && Y >= firstY);
  const lastY = Math.max(firstY, ...[...standYears].filter((Y) => Y >= firstY), ...cashAhead, ...counted.map((x) => x.Y));
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
    rows.push({ Y, year: taxYearLabel(Y), need: r0(need), full: r0(full), monthsLeft, thisYear, source, rungs: r0(rungs), standIns: sIn, gilts: [], cash: 0, held: 0, toBuy: r0(toBuy), gap: 0, paidBy });
  }
  // the pension's cash, used year by year: this year's months first, then each year whose money is cash or stood in for. What
  // a stand-in, or a gilt counted toward its year, pays beyond that year is cash from the year after (said, never lost).
  let pool = num(D.totals && D.totals.cashHeld);
  const spares = standIns.filter((s) => s.spare > 0).map((s) => ({ after: Math.max(...s.taxYears), amount: s.spare, used: false }));
  for (const r of rows) {
    for (const x of spares) if (!x.used && x.after < r.Y) { pool += x.amount; x.used = true; }
    const fromStandIns = r.standIns.reduce((s, x) => s + x.pays, 0);
    // each gilt maturing this year, set against what the rungs and what stands in leave of the year's need (7.11.1)
    let want = Math.max(0, r.need - (r.source === 'rung' ? r.rungs : fromStandIns));
    for (const gx of counted.filter((x) => x.Y === r.Y)) {
      const pays = Math.max(0, Math.min(gx.real, want));
      want -= pays;
      gx.used = r0(pays); gx.spare = r0(gx.real - pays);
      r.gilts.push({ label: gx.label, pays: r0(pays), fixed: gx.fixed });
      if (gx.spare > 0) spares.push({ after: r.Y, amount: gx.spare, used: false });
    }
    const fromGilts = r.gilts.reduce((s, x) => s + x.pays, 0);
    if (r.source === 'rung') { r.held = r0(r.rungs + fromGilts); r.toBuy = r0(Math.max(0, r.toBuy - fromGilts)); continue; }
    const wantCash = Math.max(0, r.need - fromStandIns - fromGilts);
    const take = Math.min(pool, wantCash);
    pool -= take;
    r.cash = r0(take);
    r.held = r0(fromStandIns + fromGilts + take);
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
  // the lump sums the plan itself counts in the years read (7.11.1): money expected later may be one of them
  const lumps = [];
  for (const r of rows) {
    const row = Array.isArray(doc.timeline) ? doc.timeline.find((x) => x && x.taxYear === r.year) : null;
    const amount = row && Array.isArray(row.lumpIn) ? row.lumpIn.reduce((s, x) => s + num(x && x.amount), 0) : 0;
    if (amount > 0) lumps.push({ Y: r.Y, year: r.year, amount: r0(amount) });
  }
  const toBuyTotal = rows.reduce((s, r) => s + r.toBuy, 0);
  const cover = (have) => (totalGap <= 0 ? null : have >= totalGap ? { covered: true, short: 0 } : { covered: false, short: r0(totalGap - have) });
  return { ...base, lumps, ladder: true, rows, lastYear: lastY, totalGap: r0(totalGap), toBuy: r0(toBuyTotal), firstGap,
    withExpected: expected.total > 0 ? cover(expected.total) : null,
    withAll: expected.total > 0 && fundsGaps.total > 0 ? cover(expected.total + fundsGaps.total) : fundsGaps.total > 0 ? cover(fundsGaps.total) : null,
    // 7.11.1: with the shares and funds outside the plan's mix at today's value too (and what is expected and counted)
    withHeld: outside.total > 0 ? cover(expected.total + fundsGaps.total + outside.total) : null };
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
  // a year the plan needs nothing from the pension for (7.11.1): what pays it, so "£0" is never a puzzle
  const W = { lump: 'whyLump', other: 'whyOther', else: 'whyElse' };
  for (const r of g.rows.filter((x) => x.paidBy)) say('noNeed', ['noNeed', { year: r.year }, { why: W[r.paidBy] }]);
  // each gilt outside the rungs (7.11.1): the tax year it counts toward and what it pays — or why it is not counted
  for (const x of g.gilts || []) {
    const month = x.matures ? monthWords(x.matures.slice(0, 7)) : '';
    if (x.state === 'unknown') { say('gilt', ['giltUnknown', { label: x.label }]); continue; }
    if (x.state === 'paid') { say('gilt', ['giltPaid', { label: x.label, month }]); continue; }
    if (x.state === 'after') { say('gilt', ['giltAfter', { label: x.label, month }]); continue; }
    const year = taxYearLabel(x.Y);
    if (x.fixed) say('gilt', x.real < x.pays - 1 ? ['giltFixedReal', { label: x.label, month, year, pays: pounds(x.pays), real: pounds(x.real) }] : ['giltFixed', { label: x.label, month, year, pays: pounds(x.pays) }]);
    else say('gilt', [x.payKind === 'indexLinked' ? 'giltLinked' : 'giltValue', { label: x.label, month, year, pays: pounds(x.pays) }]);
    if (x.spare > 0) say('giltSpare', ['giltSpare', { label: x.label, spare: pounds(x.spare), year }]);
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
    // with shares and funds outside the plan's mix too, one sentence says what all of it would cover (below)
    if (g.withAll && !(g.outside && g.outside.total > 0)) say('withAll', g.withAll.covered ? [both ? 'withAll' : 'withKept', { year: last }] : [both ? 'withAllShort' : 'withKeptShort', { short: pounds(g.withAll.short), year: last }]);
  }
  // shares and funds outside the plan's mix (7.11.1): never held for a year, never ignored — worth today, what that would
  // cover, and that it can fall
  if (g.outside && g.outside.total > 0) {
    say('outside', ['outside', { list: listWords(g.outside.lines.map((x) => x.label)), total: pounds(g.outside.total) }]);
    const exp = g.expected.total > 0;
    if (g.withHeld) say('withHeld', g.withHeld.covered ? [exp ? 'withHeldExpected' : 'withHeld', { year: last }] : [exp ? 'withHeldExpectedShort' : 'withHeldShort', { short: pounds(g.withHeld.short), year: last }]);
    say('outsideCanFall', ['outsideCanFall']);
  }
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
        // a gilt counted toward the year it matures in (7.11.1), by its name, as a line kept to stand in is
        ...(r.gilts || []).filter((x) => x.pays > 0).map((x) => ({ kind: 'gilt', label: x.label, amount: P(x.pays) })), ...(r.cash > 0 ? [{ kind: 'cash', amount: P(r.cash) }] : [])] })),
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
 * outside the rungs with the month it matures and the tax year it counts toward (`state`: counted, unknown, paid or after),
 * a rung with its tax years and its units held and to buy. Null in, null out.
 */
export function rolesView(roles) {
  if (!Array.isArray(roles)) return null;
  const u = (v) => (v == null ? null : String(Math.round(+v || 0)));
  return roles.map((r) => ({
    at: r.at, label: r.label, ticker: r.ticker || '', sedol: r.sedol || '', wrapper: r.wrapper, role: r.role, value: pounds(r.value), units: u(r.units),
    ...(r.role === 'gilt' ? { state: r.state, matures: r.matures ? monthWords(r.matures.slice(0, 7)) : null, year: r.state === 'counted' ? taxYearLabel(r.countsToward) : null, pays: r.pays != null ? pounds(r.pays) : null, fixed: !!r.fixed } : {}),
    ...(r.rung ? { rung: { label: r.rung.label, ticker: r.rung.ticker, years: r.rung.taxYears.map(taxYearLabel), units: u(r.rung.units), heldUnits: u(r.rung.heldUnits) } } : {})
  }));
}

/** The one line the plan's home says when a year is not yet covered: the first such year and its gap, or null. */
export function gapHeadline(g) {
  return g && g.firstGap ? { year: g.firstGap.year, Y: g.firstGap.Y, gap: pounds(g.firstGap.gap) } : null;
}
