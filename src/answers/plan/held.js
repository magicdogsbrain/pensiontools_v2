/**
 * "Your plan's mix" while living on a locked gilt ladder (7.12.0): the ONE reading, in the held phase, of the plan's gilts against
 * what is held, what the cash years still need, the money the pension holds beside the plan's gilts, and what else it holds.
 * Both views, the home's line and What you hold read it; nothing else works these figures out a second way.
 *
 * The held phase is Phases.heldPhase on the phase the home reads: Living on it, or Moving once what is held was accepted. While
 * living, every line is read as held, as it is: a "Keep this" mark is never a condition for counting, and no line is set against
 * a tax year by when it matures. A year the person typed against a line is shown as their label and changes no sum.
 *
 *   heldLadder(plan, { today, life })   the reading as data (figures in pounds as numbers), or null: see below
 *   heldLadderView(h)                   the reading as both drawings show it: sentences as { key, slots } (src/v7/copy/held.js)
 *   heldSummaryView(h)                  What you hold's two lines from the same reading
 *   sayHeld(sentence, HELD)             one sentence in words
 *   yearsWords(ys)                      tax years as words: "2032/33", "2029/30 to 2031/32"
 *
 * Pure: the plan brought up to date in memory and today's date; nothing here writes, runs or reads a clock. The diff is
 * the page's one diff (src/reading/holdings.js moveReadingOf: TransitionPlanner's on the plan whose lines carry no mark).
 */
import { yearNeedsOf, monthsLeftInTaxYear, shareStillToCome, isRungRow, standInPays, conventionalEvidence } from '../../services/TransitionPlanner.js';
import { planStage, effectiveStressSettings } from '../../services/PlanReading.js';
import { moveReadingOf, giltsCountOf } from '../../reading/holdings.js';
import { stageOf } from '../../services/LifeStage.js';
import { heldPhase } from '../../services/Phases.js';
import { normaliseHoldings, normaliseKeep, expectedOf } from '../../services/HoldingsRecord.js';
import { taxYearLabel, taxYearStartOf } from '../../services/PlanTiming.js';
import { dateOf, dayWords, monthWords, monthName } from './dates.js';
import { pounds } from './income.js';

const num = (v) => (Number.isFinite(+v) ? +v : 0);
const r0 = (v) => Math.round(num(v));
const r10 = (v) => Math.round(num(v) / 10) * 10;
const isObj = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const isLocked = (plan) => !!(plan && plan.decisionTool && plan.decisionTool.settings && plan.decisionTool.settings.locked);

/** Tax years as words: one year "2032/33"; consecutive years "2029/30 to 2031/32"; otherwise listed. */
export function yearsWords(ys) {
  const list = [...new Set((ys || []).map(Number).filter((y) => y > 2000))].sort((a, b) => a - b);
  if (!list.length) return '';
  if (list.length === 1) return taxYearLabel(list[0]);
  const run = list.every((y, i) => i === 0 || y === list[i - 1] + 1);
  if (run) return taxYearLabel(list[0]) + ' to ' + taxYearLabel(list[list.length - 1]);
  return list.slice(0, -1).map(taxYearLabel).join(', ') + ' and ' + taxYearLabel(list[list.length - 1]);
}

/** The phase the plan's home reads (LifeStage.stageOf, as read.js planPage reads it), or null. */
function lifeOf(plan, now) {
  try { return stageOf(plan, now, { placing: planStage(plan, { now }), settings: effectiveStressSettings(plan, { now }) }); } catch { return null; }
}

/** Why a year needs nothing from the pension: the plan's own timeline (a lump sum it counts, the State Pension, other income). */
export function paidByOf(doc, Y) {
  const row = Array.isArray(doc.timeline) ? doc.timeline.find((x) => x && x.taxYear === taxYearLabel(Y)) : null;
  if (row && num(row.lump) > 0) return Array.isArray(row.lumpIn) && row.lumpIn.some((x) => num(x && x.amount) > 0) ? 'lump' : 'lumpEarlier';
  if (row && num(row.sp) > 0) return num(row.other) > 0 ? 'spOther' : 'sp';
  if (row && num(row.other) > 0) return 'other';
  return 'else';
}

/**
 * The reading (7.12.0). Null unless the plan is locked, has a ladder document and is in the held phase (`life`, the phase the
 * home reads; worked out here when not given).
 * @returns {null | {
 *   kind: 'ladder', agreed: string|null (the day what is held was accepted, 'YYYY-MM-DD…'), noRecord: boolean, running: boolean,
 *   gilts: { rows: [{ key, label, code, years: number[], planUnits, heldUnits, diff, state: 'same'|'over'|'under'|'none'|null,
 *            money, planValue, heldValue }], held, total, over, under, none, paid: string[], stale: string[] },
 *   cashYears: null | { rows: [{ Y, need, monthsLeft, thisYear, paidBy }], need },
 *   money: { cash, gilts, funds, available }, state: 'cash'|'cashGilts'|'all'|'less'|null, more, less,
 *   timing: null | { dueBy: 'YYYY-MM-DD', R, cash, next: { label, matures }|null },
 *   lines: [{ at, label, kind: 'gilt'|'fund', value, matures, pays, fixed, indexLinked, note, forYears }],
 *   outsidePension: [{ label, wrapper, value }],
 *   expected: [{ id, label, amount, by }], lumps: [{ Y, amount }], setYears: [{ label, years }] }}
 */
export function heldLadder(plan, { today, life, reading = null } = {}) {
  const now = dateOf(today);
  if (!isLocked(plan) || !isObj(plan.planDocument)) return null;
  const phase = life === undefined ? lifeOf(plan, now) : life;
  if (!heldPhase(phase)) return null;
  const doc = plan.planDocument;
  const rec = normaliseHoldings(plan.holdings);
  // the page's one diff (src/reading/holdings.js moveReadingOf: every line as it is, with its part), the caller's when it has it
  const m = (reading && reading.asHeld ? reading : moveReadingOf(plan, { now, life: phase })).m;
  if (!m || !m.target || m.target.kind !== 'ladder' || !m.diff) return null;
  const T = m.target, D = m.diff;
  const noRecord = rec.lines.length === 0;

  // the plan's gilts, in the plan's order, against what is held of each (the diff's own rung rows)
  const rungRows = new Map();
  for (const x of [...D.hold, ...D.buy, ...D.sell]) if (isRungRow(x)) rungRows.set(x.key, x);
  const rows = T.lines.map((t) => {
    const x = rungRows.get(t.key) || null;
    const years = (t.taxYears || []).map(Number);
    const base = { key: t.key, label: t.label || t.ticker || '', code: t.ticker || '', years };
    if (noRecord) return { ...base, planUnits: t.units > 0 ? t.units : null, heldUnits: null, diff: null, state: null, money: null, planValue: t.units > 0 ? null : r0(t.cost), heldValue: null };
    if (!(t.units > 0)) {
      // a gilt with no units to read: what is held against what it cost
      const heldValue = x ? (x.heldValue != null ? r0(x.heldValue) : Math.max(0, r0(num(x.value) - num(x.amount)))) : 0;
      const state = heldValue <= 0 ? 'none' : heldValue >= r0(t.cost) ? 'same' : 'under';
      return { ...base, planUnits: null, heldUnits: null, diff: null, state, money: null, planValue: r0(t.cost), heldValue };
    }
    const heldUnits = x && x.heldUnits != null ? r0(x.heldUnits) : 0;
    const diff = heldUnits - t.units;
    const state = diff === 0 ? 'same' : diff > 0 ? 'over' : heldUnits > 0 ? 'under' : 'none';
    return { ...base, planUnits: t.units, heldUnits, diff, state, money: diff !== 0 && t.indexRatio ? r10(Math.abs(diff) * t.indexRatio) : null, planValue: null, heldValue: null };
  });
  const count = (s) => rows.filter((r) => r.state === s).length;
  // the one count (giltsCountOf): once what is held was accepted, a gilt of the plan held in part is held as the person chose
  const agreed = !!(phase && phase.agreed && phase.agreed.at);
  const gc = giltsCountOf(T, D, { agreed });
  const gilts = { rows, held: gc.counted, total: gc.total, over: count('over'), under: count('under'), none: count('none'), chosen: agreed,
    paid: (T.paid || []).map((p) => p.label || p.ticker || ''), stale: (D.matured || []).map((x) => x.label || x.ticker || '') };

  // the cash years still ahead: this tax year's months still to come while the plan runs, each later one in full
  const needs = yearNeedsOf(doc);
  const thisTY = taxYearStartOf(now);
  const running = !!T.running;
  const firstY = Math.max(thisTY, num(T.firstTaxYear) || thisTY);
  const cashRows = Object.keys(needs).map(Number).filter((Y) => needs[Y].from === 'cash' && Y >= firstY).sort((a, b) => a - b).map((Y) => {
    const thisYear = running && Y === thisTY;
    const monthsLeft = thisYear ? monthsLeftInTaxYear(now) : 12;
    const full = num(needs[Y].need);
    // (a ladder's part first year holds its own months: its need is for those, so the months to come are at its own rate)
    return { Y, need: thisYear ? full * shareStillToCome(needs[Y], monthsLeft) : full, monthsLeft, thisYear, paidBy: full <= 0 ? paidByOf(doc, Y) : null };
  });
  const N = cashRows.reduce((s, r) => s + r.need, 0);
  const cashYears = cashRows.length ? { rows: cashRows.map((r) => ({ ...r, need: r0(r.need) })), need: r0(N) } : null;

  // the money the pension holds beside the plan's gilts, at today's value, set against no year
  const roles = Array.isArray(D.roles) ? D.roles : [];
  const lineOf = (at) => (at != null && rec.lines[at]) || null;
  const otherGilts = roles.filter((r) => r.role === 'gilt');
  const funds = roles.filter((r) => r.role === 'outside');
  const cash = num(D.totals && D.totals.cashHeld);
  const giltsMoney = otherGilts.filter((r) => !r.paid).reduce((s, r) => s + num(r.value), 0);
  const fundsMoney = funds.reduce((s, r) => s + num(r.value), 0);
  const available = cash + giltsMoney + fundsMoney;

  // what else the pension holds, line by line: when a gilt matures and what it pays then, as facts
  const forYearsOf = (at) => { const k = normaliseKeep(lineOf(at) && lineOf(at).keep); return k && k.as === 'rung' ? k.taxYears.slice() : null; };
  const lines = [
    ...otherGilts.map((r) => {
      const h = lineOf(r.at);
      const code = !!(r.ticker || r.sedol);
      const note = r.cashNow ? 'cashNow' : r.paid ? 'paid' : !r.matures ? (code ? 'notListed' : 'unknown') : null;
      const conv = h ? conventionalEvidence(h) : null;
      const p = h && r.matures && !r.paid && conv === true && num(h.units) > 0 ? standInPays(h, { today: now }) : null;
      return { at: r.at, label: r.label, kind: 'gilt', value: r0(r.value), matures: r.matures || null, pays: r.cashNow ? r0(r.pays) : p ? p.amount : null, fixed: !!(p && p.fixed), indexLinked: conv === false && !r.paid, note, forYears: forYearsOf(r.at) };
    }),
    ...funds.map((r) => ({ at: r.at, label: r.label, kind: 'fund', value: r0(r.value), matures: null, pays: null, fixed: false, indexLinked: false, note: null, forYears: forYearsOf(r.at) }))
  ].sort((a, b) => num(a.at) - num(b.at));

  // 7.12.0 round 3: the cash years as ONE dated reading — when the plan's cash pays out, against when money arrives in the
  // pension (the cash there now, then each other gilt on the day it matures, with what it pays then). A gilt that may have
  // matured already, or cannot be placed, arrives on no day and is in no total. Facts, never a move.
  const todayISO = isoOf(now);
  const winEnd = cashRows.length ? (cashRows[cashRows.length - 1].Y + 1) + '-04-05' : null;
  const arrivals = noRecord || !winEnd ? [] : lines
    .filter((l) => l.kind === 'gilt' && !l.note && l.matures && l.matures > todayISO && l.matures <= winEnd)
    .map((l) => ({ at: l.at, label: l.label, date: l.matures, amount: l.pays != null && l.fixed ? l.pays : l.value, fixed: l.pays != null && l.fixed, forYears: l.forYears }))
    .sort((a, b) => a.date.localeCompare(b.date));
  const inTable = new Set(arrivals.map((a) => a.at));
  const dated = noRecord || !cashYears ? null : datedCashYears({ now: todayISO, cash, cashRows, needs, arrivals });
  const arrives = cash + arrivals.reduce((s, a) => s + a.amount, 0);
  // what else could pay these years, at today's value: later gilts with a known day, and shares and funds
  const later = lines.filter((l) => l.kind === 'gilt' && !l.note && l.matures && !inTable.has(l.at)).reduce((s, l) => s + l.value, 0);

  // with nothing recorded, the money held is not known: no verdict on the cash years
  let state = null, more = 0, less = 0;
  if (cashYears && !noRecord) {
    if (cash >= N) { state = 'cash'; more = cash - N; }
    else if (arrives >= N) { state = 'cashGilts'; more = arrives - N; }
    else if (arrives + later + fundsMoney >= N) { state = 'all'; more = arrives + later + fundsMoney - N; }
    else { state = 'less'; less = N - arrives - later - fundsMoney; }
  }
  // the first stretch of months the money in hand does not reach, before the next gilt pays: a difference in timing only
  const timing = dated && dated.gaps.length && state !== 'less' ? dated.gaps[0] : null;
  const outsidePension = roles.filter((r) => r.role === 'outsidePension').map((r) => ({ label: r.label, wrapper: r.wrapper, value: r0(r.value) }));

  // money expected later, and the lump sums the plan itself counts in the cash years (the money expected may be one of them)
  const expected = expectedOf(rec).slice().sort((a, b) => String(a.by || '9999').localeCompare(String(b.by || '9999')))
    .map((e) => ({ id: e.id, label: e.label || '', amount: r0(e.amount), by: e.by || null }));
  const lumps = [];
  for (const r of cashRows) {
    const row = Array.isArray(doc.timeline) ? doc.timeline.find((x) => x && x.taxYear === taxYearLabel(r.Y)) : null;
    const amount = row && Array.isArray(row.lumpIn) ? row.lumpIn.reduce((s, x) => s + num(x && x.amount), 0) : 0;
    if (amount > 0) lumps.push({ Y: r.Y, amount: r0(amount) });
  }
  const setYears = lines.filter((l) => l.forYears).map((l) => ({ label: l.label, years: l.forYears }));

  return { kind: 'ladder', agreed: phase && phase.agreed && phase.agreed.at ? String(phase.agreed.at) : null, noRecord, running,
    gilts, cashYears, money: { cash: r0(cash), gilts: r0(giltsMoney), funds: r0(fundsMoney), available: r0(available) }, state, more: r0(more), less: r0(less),
    timing, dated, lines: lines.map((l) => (inTable.has(l.at) ? { ...l, inCash: true } : l)), outsidePension, expected, lumps, setYears };
}

const pad2 = (n) => String(n).padStart(2, '0');
const isoOf = (d) => d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
/** 'YYYY-MM' k months after `m`. */
const monthPlus = (m, k) => { const [y, mo] = m.split('-').map(Number); const t = y * 12 + (mo - 1) + k; return Math.floor(t / 12) + '-' + pad2((t % 12) + 1); };
/** The tax year a day 'YYYY-MM-DD' is in (it starts on 6 April). */
const taxYearOfIso = (iso) => { const [y, m, d] = iso.split('-').map(Number); return m > 4 || (m === 4 && d >= 6) ? y : y - 1; };

/**
 * The cash years as one dated reading (7.12.0 round 3): rows in time order of what the plan pays from cash and what arrives in
 * the pension, the totals, and every stretch of months the money in hand does not reach before the next gilt pays.
 *   rows   { kind: 'now', arrives: [{ cash }] } — the pension's cash today
 *          { kind: 'months', from, to: 'YYYY-MM', n, per, due } — this tax year's payments still to come, split where a gilt pays
 *          { kind: 'day', date, arrives: [arrival] } — a gilt that pays inside this tax year (or outside every cash year)
 *          { kind: 'year', Y, due, paidBy, thisYear, monthsLeft, arrives: [arrival] } — a later cash year, and what pays in it
 *   due    what the cash years still need (the sum of the rows); arrives — the cash now and every arrival
 *   gaps   [{ from, to: 'YYYY-MM', due, cash, next: arrival|null, first }] — `due` is what the stretch's months pay; `cash` what
 *          was in hand when it began (the first stretch only; a later one begins short); `next` the gilt that pays after it
 * Each month of a later year pays a twelfth of its need; a gilt that pays in a month is taken to arrive before that month's
 * payment. Pure.
 */
export function datedCashYears({ now, cash, cashRows, needs, arrivals }) {
  const nowMonth = now.slice(0, 7);
  const rows = [{ kind: 'now', key: now, arrives: [{ cash: r0(cash) }] }];
  const dueIn = new Map();
  const placed = new Set();
  for (const r of cashRows) {
    const full = num(needs[r.Y] && needs[r.Y].need);
    const inYear = arrivals.filter((a) => taxYearOfIso(a.date) === r.Y);
    if (r.thisYear && full > 0) {
      const per = full / 12;
      const months = []; for (let k = 0; k < r.monthsLeft; k++) months.push(monthPlus(nowMonth, k));
      let run = [];
      const flush = () => { if (run.length) rows.push({ kind: 'months', key: run[0] + '-01', from: run[0], to: run[run.length - 1], n: run.length, per: r0(per), due: r0(per * run.length) }); run = []; };
      for (const m of months) {
        const here = inYear.filter((a) => a.date.slice(0, 7) === m);
        if (here.length) { flush(); for (const a of here) { rows.push({ kind: 'day', key: a.date, date: a.date, arrives: [a] }); placed.add(a); } }
        run.push(m); dueIn.set(m, per);
      }
      flush();
    } else {
      rows.push({ kind: 'year', key: r.Y + '-04-06', Y: r.Y, due: r0(r.need), paidBy: r.paidBy, thisYear: !!r.thisYear, monthsLeft: r.monthsLeft, arrives: inYear });
      for (const a of inYear) placed.add(a);
      const per = num(r.need) / (r.thisYear ? r.monthsLeft : 12);
      const start = r.thisYear ? nowMonth : r.Y + '-04';
      for (let k = 0; k < (r.thisYear ? r.monthsLeft : 12); k++) dueIn.set(monthPlus(start, k), per);
    }
  }
  // a gilt that pays outside every cash year still in time: its own row, before the first row that starts after it
  for (const a of arrivals) {
    if (placed.has(a)) continue;
    const i = rows.findIndex((x, j) => j > 0 && x.key > a.date);
    rows.splice(i < 0 ? rows.length : i, 0, { kind: 'day', key: a.date, date: a.date, arrives: [a] });
  }

  // month by month, the money in hand: what arrives first, then the month's payment; a stretch below nothing is a gap
  const gaps = [];
  const last = [...dueIn.keys(), ...arrivals.map((a) => a.date.slice(0, 7))].sort().pop() || nowMonth;
  let bal = num(cash), gap = null;
  for (let m = nowMonth; m <= last; m = monthPlus(m, 1)) {
    const here = arrivals.filter((a) => a.date.slice(0, 7) === m);
    if (here.length && gap) { gap.next = here[0]; gaps.push(gap); gap = null; }
    for (const a of here) bal += a.amount;
    const d = dueIn.get(m) || 0;
    if (!gap && d > 0 && bal - d < -0.5) gap = { from: m, to: m, due: 0, cash: r0(Math.max(0, bal)), next: null, first: gaps.length === 0 && bal >= 0 };
    if (gap) { gap.to = m; gap.due += d; }
    bal -= d;
  }
  if (gap) gaps.push(gap);
  const due = [...dueIn.values()].reduce((s, v) => s + v, 0);
  return { rows, due: r0(due), arrives: r0(num(cash) + arrivals.reduce((s, a) => s + a.amount, 0)), gaps: gaps.map((g) => ({ ...g, due: r0(g.due) })) };
}

/** A run of months as words: "March 2027", "November to December 2026", "November 2026 to February 2027". */
function whenWords(g) {
  if (g.from === g.to) return { key: 'whenOne', slots: { month: monthWords(g.from) } };
  return { key: 'whenRun', slots: { from: g.from.slice(0, 4) === g.to.slice(0, 4) ? monthName(g.from) : monthWords(g.from), to: monthWords(g.to) } };
}

/**
 * The next money into the pension while living on a ladder (7.12.0 round 3, decision 6): the first gilt, beside the plan's own,
 * that pays on or after `today`, as { label, date: 'YYYY-MM-DD', amount } — from the one dated reading of the cash years. Null
 * outside the held phase, or when nothing pays inside the cash years. Pure.
 */
export function nextMoneyIn(plan, { today, life } = {}) {
  let h = null; try { h = heldLadder(plan, { today, life }); } catch { h = null; }
  if (!h || !h.dated) return null;
  for (const r of h.dated.rows) for (const a of r.arrives || []) if (a.date && a.date >= today) return { label: a.label, date: a.date, amount: a.amount };
  return null;
}

const WHY = { lump: 'whyLump', lumpEarlier: 'whyLumpEarlier', sp: 'whySp', spOther: 'whySpOther', other: 'whyOther', else: 'whyElse' };
const isAre = (n) => (n === 1 ? 'is' : 'are');
const grouped = (v) => String(Math.round(Math.abs(num(v)))).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

/**
 * The reading as both drawings show it (7.12.0): each sentence as { key, slots } (src/v7/copy/held.js HELD, filled by sayHeld),
 * each table cell a string or a sentence. One function, so the two views cannot say it two ways. Null in, null out.
 *   head      the agreement (Moving, accepted) and the lead, or the line for nothing recorded
 *   figure    the gilts' summary line(s); gilts the table's rows; under the lines under it
 *   cash      the cash years: { need, rows, set, lines, timing } (null when none is left, or nothing is recorded)
 *   noCash    the one line when no cash year is left
 *   lines     what else the pension holds, as table rows; notes the lines under it; outside, expected as sentences
 */
export function heldLadderView(h) {
  if (!h) return null;
  const P = (v) => pounds(v);
  const S = (key, slots = {}) => ({ key, slots });
  const g = h.gilts;
  const head = [];
  if (h.agreed) head.push(S('agreed', { date: dayWords(h.agreed) }));
  head.push(S(h.noRecord ? 'noRecord' : 'lead'));

  const gilts = g.rows.map((r) => {
    const several = r.years.length > 1;
    let difference = 'same';
    if (!h.noRecord && (r.state === 'over' || r.state === 'under' || r.state === 'none')) {
      // once what is held was accepted (g.chosen; step F6), fewer units is the person's choice: never "less than the plan says"
      const bracket = r.state !== 'over' && g.chosen ? S(several ? 'chosenYears' : 'chosenYear') : r.money != null ? S(r.state === 'over' ? (several ? 'moreYears' : 'moreYear') : (several ? 'lessYears' : 'lessYear'), { money: P(r.money) }) : null;
      difference = { key: r.state === 'over' ? 'diffOver' : r.state === 'under' ? 'diffUnder' : 'diffNone', slots: { units: grouped(r.diff) }, bracket };
    }
    return { key: r.key, state: r.state || '', gilt: r.code ? r.label + ' (' + r.code + ')' : r.label, years: yearsWords(r.years),
      plan: r.planUnits != null ? grouped(r.planUnits) : r.planValue != null ? P(r.planValue) : '—',
      held: h.noRecord ? '—' : r.planUnits != null ? grouped(r.heldUnits) : P(r.heldValue),
      difference: difference === 'same' ? S('same') : difference };
  });
  const figure = [], under = [];
  if (!h.noRecord) {
    if (g.under + g.none === 0 && g.held >= g.total) {
      if (g.over === 0) figure.push(S('allSame', { total: String(g.total) }));
      else figure.push(S('allHeld', { total: String(g.total) }), S('over', { over: String(g.over), isAre: isAre(g.over) }));
    } else {
      figure.push(S('someHeld', { held: String(g.held), total: String(g.total) }));
      if (g.under > 0 && g.none > 0) figure.push(S('underNone', { under: String(g.under), isAre: isAre(g.under), none: String(g.none), noneIsAre: isAre(g.none) }));
      else if (g.under > 0) figure.push(S('under', { under: String(g.under), isAre: isAre(g.under) }));
      else if (g.none > 0) figure.push(S('none', { none: String(g.none), isAre: isAre(g.none) }));
    }
    if (g.over > 0) under.push(S('belowOver'));
    if (g.under + g.none > 0) under.push(S(g.chosen ? 'belowChosen' : 'belowUnder'));
  }
  if (g.paid.length) under.push(S('paid', { list: g.paid.join(', ') }));
  if (g.stale.length) under.push(S('stale', { list: g.stale.join(', ') }));

  // a year set against a line in the dated table is said in its row; one set against anything else is said under the also table
  const inCash = new Set(h.lines.filter((l) => l.inCash).map((l) => l.label));
  const set = h.noRecord ? [] : h.setYears.filter((s) => !inCash.has(s.label)).map((s) => S('setYears', { label: s.label, years: yearsWords(s.years) }));
  let cash = null, summary;
  if (!h.noRecord && h.cashYears && h.dated) {
    const c = h.cashYears, d = h.dated;
    const when = whenWords;
    const amountOf = (a) => (a.fixed ? P(a.amount) : S('linkedAmount', { value: P(a.amount) }));
    const setOf = (a) => (a.forYears && a.forYears.length ? S(a.forYears.every((Y) => Y + 1 + '-04-05' < a.date) ? 'setEnds' : 'setOn', { years: yearsWords(a.forYears) }) : null);
    const arrive = (a, withDate) => ({ ...S(withDate ? 'arriveOn' : 'arrive', { amount: amountOf(a), date: dayWords(a.date), label: a.label }), bracket: setOf(a) });
    const rows = d.rows.map((r) => {
      if (r.kind === 'now') return { id: 'now', when: S('now'), due: S('none'), arrives: S('arriveCash', { cash: P(r.arrives[0].cash) }) };
      if (r.kind === 'months') return { id: r.from, when: when(r), due: r.n > 1 ? S('dueMonths', { due: P(r.due), n: String(r.n), per: P(r.per) }) : P(r.due), arrives: S('none') };
      if (r.kind === 'day') return { id: r.date, when: dayWords(r.date), due: S('none'), arrives: r.arrives.map((a) => arrive(a, false)) };
      return { id: String(r.Y), when: r.thisYear ? S('yearPart', { year: taxYearLabel(r.Y), months: String(r.monthsLeft), s: r.monthsLeft === 1 ? '' : 's' }) : S('year', { year: taxYearLabel(r.Y) }),
        due: r.due > 0 ? P(r.due) : S('zero', { why: WHY[r.paidBy] || 'whyElse' }), arrives: r.arrives.length ? r.arrives.map((a) => arrive(a, true)) : S('none') };
    });
    const lines = [];
    if (h.state === 'cash') lines.push(S('stateCash', { cash: P(h.money.cash), more: P(h.more) }));
    else if (h.state === 'cashGilts') lines.push(S('stateArrives', { arrives: P(d.arrives), more: P(h.more) }));
    else if (h.state === 'all') lines.push(d.rows.some((r) => r.kind !== 'now' && (r.arrives || []).length) ? S('stateAll', { arrives: P(d.arrives), more: P(h.more) }) : S('stateAllCash', { cash: P(h.money.cash), more: P(h.more) }));
    else lines.push(S('stateLess', { less: P(h.less) }));
    const g = h.timing;
    if (g) lines.push(S(g.next ? 'timing' : 'timingNoNext', { due: P(g.due), when: when(g), label: g.next ? g.next.label : '', date: g.next ? dayWords(g.next.date) : '', cash: P(g.cash) }));
    if (d.rows.some((r) => (r.arrives || []).some((a) => a.fixed))) lines.push(S('fixedRisk'));
    cash = { need: S('need', { years: yearsWords(c.rows.map((r) => r.Y)), need: P(c.need) }), rows, total: { when: S('total'), due: P(d.due), arrives: P(d.arrives) }, lines };
  }
  // the page in one line, first: the gilts, the cash years, and the one difference in timing
  {
    const giltsPart = g.under + g.none === 0 && g.held >= g.total ? S('sumAll', { total: String(g.total) }) : S('sumSome', { held: String(g.held), total: String(g.total) });
    const cashPart = !cash ? null : h.state === 'cash' ? S('sumCash') : h.state === 'cashGilts' ? S('sumArrives') : h.state === 'all' ? S('sumAllMoney') : S('sumLess', { less: P(h.less) });
    summary = h.noRecord ? null : { ...S(cashPart ? 'summary' : 'summaryGilts', { gilts: giltsPart, cash: cashPart || '' }),
      bracket: cash && h.timing && h.timing.next ? S('summaryGap', { due: P(h.timing.due), when: whenWords(h.timing), label: h.timing.next.label, date: dayWords(h.timing.next.date) }) : null };
  }
  const noCash = !h.noRecord && !h.cashYears ? S('noCashYears', { cash: P(h.money.cash) }) : null;

  const also = h.lines.filter((l) => !l.inCash);
  const lines = h.noRecord ? [] : also.map((l) => ({ at: l.at, what: l.label, value: P(l.value),
    matures: l.note === 'notListed' ? S('notListedCell') : l.note === 'unknown' ? S('unknownCell') : (l.note === 'paid' || l.note === 'cashNow') ? S('maturedCell', { month: monthWords(String(l.matures || '').slice(0, 7)) }) : l.matures ? dayWords(l.matures) : '',
    pays: !l.note && l.pays != null && l.fixed ? S('paysFixed', { amount: P(l.pays) }) : !l.note && l.indexLinked && l.matures ? S('paysIndexLinked') : '' }));
  const notes = [];
  if (!h.noRecord) {
    for (const l of also) {
      const month = l.matures ? monthWords(String(l.matures).slice(0, 7)) : '';
      if (l.note === 'notListed') notes.push(S('notListed', { label: l.label }));
      else if (l.note === 'unknown') notes.push(S('unknown', { label: l.label }));
      else if (l.note === 'paid') notes.push(S('paidNote', { label: l.label, month }));
      else if (l.note === 'cashNow') notes.push(S('cashNow', { label: l.label, month, pays: P(l.pays) }));
    }
    if (also.some((l) => l.kind === 'gilt' && !l.note && l.matures)) notes.push(S('riskGilts'));
    if (also.some((l) => l.kind === 'fund')) notes.push(S('riskFunds'));
  }
  const outside = h.noRecord ? [] : h.outsidePension.map((o) => S('outsideOne', { label: o.label, wrapper: o.wrapper, value: P(o.value) }));
  const expected = [];
  if (!h.noRecord && h.expected.length) {
    for (const e of h.expected) expected.push(S(e.by ? 'expected' : 'expectedNoBy', { label: e.label || { key: 'expectedNoLabel', slots: {} }, amount: P(e.amount), by: e.by ? monthWords(e.by) : '' }));
    for (const l of h.lumps) expected.push(S('lumpCounted', { amount: P(l.amount), year: taxYearLabel(l.Y) }));
  }
  return { head, summary, figure, gilts, under, cash, noCash, set, lines, notes, outside, expected, footer: S('footer') };
}

/** What you hold, in the held phase on a ladder (7.12.0): the gilts' summary line(s) and the cash years' line, from the one reading. */
export function heldSummaryView(h) {
  const v = heldLadderView(h);
  if (!v) return null;
  const cash = h.noRecord ? null : h.cashYears ? { key: 'holdCash', slots: { need: pounds(h.cashYears.need), available: pounds(h.money.available) } } : v.noCash;
  return { figure: v.figure, cash };
}

/**
 * One sentence in words (7.12.0): the template `W[key]` filled with its slots. A slot that is itself a sentence is filled the
 * same way; a list of sentences is joined "a, b and c"; `why` names another template. A plain string is itself. A `bracket`
 * follows the sentence after a space.
 */
export function sayHeld(s, W) {
  if (s == null) return '';
  if (typeof s === 'string') return s;
  if (Array.isArray(s)) { const xs = s.map((x) => sayHeld(x, W)); return xs.length <= 1 ? xs.join('') : xs.slice(0, -1).join(', ') + ' and ' + xs[xs.length - 1]; }
  const slot = (k, v) => (k === 'why' && typeof v === 'string' && W[v] ? W[v] : typeof v === 'object' ? sayHeld(v, W) : String(v));
  const main = String(W[s.key] || '').replace(/\{(\w+)\}/g, (m, k) => (s.slots && s.slots[k] != null ? slot(k, s.slots[k]) : m));
  return s.bracket ? main + ' ' + sayHeld(s.bracket, W) : main;
}
