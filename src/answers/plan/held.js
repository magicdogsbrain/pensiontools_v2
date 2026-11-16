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
 * TransitionPlanner's through PlanReading.moveInputs, on an in-memory copy of the plan whose lines carry no mark.
 */
import { yearNeedsOf, monthsLeftInTaxYear, isRungRow, standInPays, conventionalEvidence } from '../../services/TransitionPlanner.js';
import { moveInputs, planStage, effectiveStressSettings } from '../../services/PlanReading.js';
import { stageOf } from '../../services/LifeStage.js';
import { heldPhase } from '../../services/Phases.js';
import { normaliseHoldings, normaliseKeep, expectedOf } from '../../services/HoldingsRecord.js';
import { taxYearLabel, taxYearStartOf } from '../../services/PlanTiming.js';
import { dateOf, dayWords, monthWords } from './dates.js';
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

/** The plan with every line's mark taken off, in memory: while living, every line counts as it is. */
function unmarked(plan) {
  const rec = normaliseHoldings(plan && plan.holdings);
  return { ...plan, holdings: { ...(isObj(plan.holdings) ? plan.holdings : {}), lines: rec.lines.map((l) => { const { keep, ...rest } = l; return rest; }) } };
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
export function heldLadder(plan, { today, life } = {}) {
  const now = dateOf(today);
  if (!isLocked(plan) || !isObj(plan.planDocument)) return null;
  const phase = life === undefined ? lifeOf(plan, now) : life;
  if (!heldPhase(phase)) return null;
  const doc = plan.planDocument;
  const rec = normaliseHoldings(plan.holdings);
  let m = null; try { m = moveInputs(unmarked(plan), { now, roles: true }); } catch { m = null; }
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
  const gilts = { rows, held: D.rungs ? D.rungs.held : 0, total: D.rungs ? D.rungs.needed : T.lines.length, over: count('over'), under: count('under'), none: count('none'),
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
    return { Y, need: full * monthsLeft / 12, monthsLeft, thisYear, paidBy: full <= 0 ? paidByOf(doc, Y) : null };
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
  let state = null, more = 0, less = 0;
  if (cashYears) {
    if (cash >= N) { state = 'cash'; more = cash - N; }
    else if (cash + giltsMoney >= N) { state = 'cashGilts'; more = cash + giltsMoney - N; }
    else if (available >= N) { state = 'all'; more = available - N; }
    else { state = 'less'; less = N - available; }
  }

  // this tax year's timing, a fact only: the plan pays from cash by 5 April, and the pension's cash is less than that
  let timing = null;
  const cur = cashRows.find((r) => r.thisYear);
  if (running && cur && cur.need > 0 && cash < cur.need) {
    const ahead = otherGilts.filter((r) => r.matures && !r.paid).sort((a, b) => String(a.matures).localeCompare(String(b.matures)));
    timing = { dueBy: (thisTY + 1) + '-04-05', R: r0(cur.need), cash: r0(cash), next: ahead.length ? { label: ahead[0].label, matures: ahead[0].matures } : null };
  }

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
    timing, lines, outsidePension, expected, lumps, setYears };
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
      const bracket = r.money != null ? S(r.state === 'over' ? (several ? 'moreYears' : 'moreYear') : (several ? 'lessYears' : 'lessYear'), { money: P(r.money) }) : null;
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
    if (g.under + g.none > 0) under.push(S('belowUnder'));
  }
  if (g.paid.length) under.push(S('paid', { list: g.paid.join(', ') }));
  if (g.stale.length) under.push(S('stale', { list: g.stale.join(', ') }));

  const set = h.noRecord ? [] : h.setYears.map((s) => S('setYears', { label: s.label, years: yearsWords(s.years) }));
  let cash = null;
  if (!h.noRecord && h.cashYears) {
    const c = h.cashYears, M = h.money;
    const rows = c.rows.map((r) => ({ Y: r.Y,
      year: r.thisYear ? S('yearPart', { year: taxYearLabel(r.Y), months: String(r.monthsLeft), s: r.monthsLeft === 1 ? '' : 's' }) : S('year', { year: taxYearLabel(r.Y) }),
      amount: r.need > 0 ? P(r.need) : S('zero', { why: WHY[r.paidBy] || 'whyElse' }) }));
    const lines = [];
    if (h.state === 'cash') lines.push(S('stateCash', { cash: P(M.cash), more: P(h.more) }));
    else {
      const parts = [M.cash > 0 ? S('partCash', { cash: P(M.cash) }) : null, M.gilts > 0 ? S('partGilts', { gilts: P(M.gilts) }) : null, M.funds > 0 ? S('partFunds', { funds: P(M.funds) }) : null].filter(Boolean);
      lines.push(M.gilts > 0 || M.funds > 0 ? S('holds', { parts, available: P(M.available) }) : S('holdsCash', { cash: P(M.cash) }));
      lines.push(h.state === 'cashGilts' ? S('stateCashGilts', { more: P(h.more) }) : h.state === 'all' ? S('stateAll', { more: P(h.more) }) : S('stateLess', { less: P(h.less) }));
    }
    const timing = [];
    if (h.timing) {
      timing.push(S('timing', { R: P(h.timing.R), dueBy: dayWords(h.timing.dueBy), cash: P(h.timing.cash) }));
      if (h.timing.next) timing.push(S('next', { label: h.timing.next.label, date: dayWords(h.timing.next.matures) }));
    }
    cash = { need: S('need', { years: yearsWords(c.rows.map((r) => r.Y)), need: P(c.need) }), rows, set, lines, timing };
  }
  const noCash = !h.noRecord && !h.cashYears ? S('noCashYears', { cash: P(h.money.cash) }) : null;

  const lines = h.noRecord ? [] : h.lines.map((l) => ({ at: l.at, what: l.label, value: P(l.value),
    matures: l.note === 'notListed' ? S('notListedCell') : l.note === 'unknown' ? S('unknownCell') : (l.note === 'paid' || l.note === 'cashNow') ? S('maturedCell', { month: monthWords(String(l.matures || '').slice(0, 7)) }) : l.matures ? dayWords(l.matures) : '',
    pays: !l.note && l.pays != null && l.fixed ? S('paysFixed', { amount: P(l.pays) }) : !l.note && l.indexLinked && l.matures ? S('paysIndexLinked') : '' }));
  const notes = [];
  if (!h.noRecord) {
    for (const l of h.lines) {
      const month = l.matures ? monthWords(String(l.matures).slice(0, 7)) : '';
      if (l.note === 'notListed') notes.push(S('notListed', { label: l.label }));
      else if (l.note === 'unknown') notes.push(S('unknown', { label: l.label }));
      else if (l.note === 'paid') notes.push(S('paidNote', { label: l.label, month }));
      else if (l.note === 'cashNow') notes.push(S('cashNow', { label: l.label, month, pays: P(l.pays) }));
    }
    if (h.lines.some((l) => l.kind === 'gilt' && !l.note && l.matures)) notes.push(S('riskGilts'));
    if (h.lines.some((l) => l.kind === 'fund')) notes.push(S('riskFunds'));
  }
  const outside = h.noRecord ? [] : h.outsidePension.map((o) => S('outsideOne', { label: o.label, wrapper: o.wrapper, value: P(o.value) }));
  const expected = [];
  if (!h.noRecord && h.expected.length) {
    for (const e of h.expected) expected.push(S(e.by ? 'expected' : 'expectedNoBy', { label: e.label || { key: 'expectedNoLabel', slots: {} }, amount: P(e.amount), by: e.by ? monthWords(e.by) : '' }));
    for (const l of h.lumps) expected.push(S('lumpCounted', { amount: P(l.amount), year: taxYearLabel(l.Y) }));
  }
  return { head, figure, gilts, under, cash, noCash, set: cash ? [] : set, lines, notes, outside, expected, footer: S('footer') };
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
