/**
 * The move's readings that both views word the same way (7.12.0, the moving brief D1/D6/D7): the one status, what pays for
 * the buys, the lines the plan does not use, the totals and the cash to hold now — each as an id with slots, filled from
 * src/v7/copy/move.js by the simple view (MoveScreen.jsx), the full view (TransitionView.js) and the home tile (read.js).
 * Pure: a diff and a target from TransitionPlanner in, data out. It imports no copy and no other answer, so read.js and
 * move.js can both use it.
 */
import { taxYearLabel } from '../../services/PlanTiming.js';
import { isRungRow } from '../../services/TransitionPlanner.js';
import { planMoneyOf } from '../../services/PlanReading.js';

const num = (v) => (Number.isFinite(+v) ? +v : 0);
const pounds = (n) => '£' + String(Math.abs(Math.round(num(n)))).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
const grouped = (v) => String(Math.round(num(v))).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const dayWords = (iso) => { const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(iso || '')); return m ? (+m[3]) + ' ' + MONTHS[+m[2] - 1] + ' ' + m[1] : ''; };

/** A template with {slots} filled; a slot with nothing in it stays as written. */
export const fillMove = (t, slots) => String(t || '').replace(/\{(\w+)\}/g, (m, k) => (slots && slots[k] != null ? String(slots[k]) : m));

/**
 * The move's progress, worded one way everywhere (7.12.0): { id, slots } for MOVE.status. A ladder counts the gilts bought
 * (and those part bought) and the share of the plan's mix held — never moves ticked off; a pot plan the share held and the
 * moves done. Done: the plan's mix is held.
 */
export function moveStatusOf(target, diff, prog) {
  const T = target || {}, D = diff || {}, P = prog || { doneCount: 0, total: 0 };
  const ladder = T.kind === 'ladder';
  if (D.complete) return { id: ladder ? (((D.standIn && D.standIn.length) || (D.kept && D.kept.length)) ? 'doneKept' : 'doneLadder') : 'done', slots: {} };
  if (ladder) {
    const bought = D.rungs ? D.rungs.held : (D.hold || []).filter((h) => Array.isArray(h.taxYears)).length;
    const part = (D.buy || []).filter((b) => b.kind === 'gilt' && num(b.heldUnits) > 0).length;
    return { id: part ? 'giltsPart' : 'gilts', slots: { bought: String(bought), rungs: String((T.lines || []).length), held: String(D.progressPct), part: String(part) } };
  }
  return { id: 'held', slots: { held: String(D.progressPct), done: String(P.doneCount), moves: String(P.total) } };
}
/** The status as a sentence, from the move's words (MOVE). */
export const sayMoveStatus = (st, W) => fillMove(W.status[st.id], st.slots);

/** The move's buy order (TransitionPlanner.sequence): the cash years first, then the gilts by maturity, then the rest. */
const buyOrder = (b) => (b.kind === 'cash' ? 0 : b.kind === 'gilt' ? 1 + (b.matures ? new Date(b.matures).getFullYear() / 10000 : 0.5) : b.bucket === 'bonds' ? 2 : b.bucket === 'cash' ? 2.5 : 3);
const yearsOfBuy = (b) => (Array.isArray(b.taxYears) ? b.taxYears : Array.isArray(b.yearsLeft) ? b.yearsLeft : []).map(Number).filter(Number.isFinite);
/** '2031/32 to 2033/34', or one year alone. */
const yearsWords = (ys) => (!ys.length ? '' : ys.length === 1 ? taxYearLabel(ys[0]) : taxYearLabel(ys[0]) + ' to ' + taxYearLabel(ys[ys.length - 1]));

/**
 * What the money for the move cannot pay for (7.12.0, walks3 W5-H2), a ladder: the buys paid in the move's own order (the
 * cash years, then the gilts nearest first) from the pension's spare cash, the money the plan does not use and any new
 * money expected before the stop; `short` what is left unpaid, `years` every tax year a buy not paid in full was for.
 * A year the plan cannot pay is a shortfall, said with its amount, never money that "waits".
 */
export function unpaidOf(diff, { newMoney = 0 } = {}) {
  const F = diff && diff.funding;
  if (!F) return { short: 0, years: [] };
  let left = num(F.spareCash) + num(F.available) + num(newMoney);
  const years = new Set();
  let short = 0;
  for (const b of (diff.buy || []).slice().sort((a, c) => buyOrder(a) - buyOrder(c))) {
    const paid = Math.min(left, num(b.amount)); left -= paid;
    const gap = num(b.amount) - paid;
    if (gap > 0.5) { short += gap; for (const Y of yearsOfBuy(b)) years.add(Y); }
  }
  return { short: Math.round(short), years: [...years].sort((a, c) => a - c) };
}

/**
 * Paying for it (7.12.0), a ladder only: { ids, slots } — the sentences in order, ids of MOVE.paying — or null when there is
 * nothing to buy. `newMoney` is the new money expected before the stop (the schedule's), `from` where the plan's own money
 * was read ('plan' | 'checkIn' | 'record') when nothing is listed and the caller gave it.
 */
export function payingOf(diff, { newMoney = 0, planMoney = null, said = false } = {}) {
  const F = diff && diff.funding;
  if (!F || !(F.need > 0)) return null;
  const unpaid = unpaidOf(diff, { newMoney });
  const slots = { need: pounds(F.need), available: pounds(F.available), toRaise: pounds(F.toRaise), leftOver: pounds(F.leftOver), short: pounds(F.short), newMoney: newMoney > 0 ? pounds(newMoney) : null,
    gap: pounds(unpaid.short), years: yearsWords(unpaid.years) };
  // what stays short once new money is counted: the years it leaves unpaid, or nothing when new money pays the rest
  const shortTail = unpaid.short > 0 && unpaid.years.length ? ['shortYears'] : unpaid.short > 0 ? ['shortNoYears'] : ['shortPaidByNew'];
  const held = F.leftOverHeld === 'shares' ? 'heldShares' : 'heldValue';
  const rest = F.short > 0 ? ['short', ...(newMoney > 0 ? ['newMoney'] : []), ...shortTail] : F.leftOver > 0 ? ['enough', 'leftOver', held, 'leave'] : ['enoughAll'];
  if (F.toRaise <= 0) return { ids: ['need', 'cash'], slots };
  if (F.fromPlan) {
    const pm = planMoney || F.planMoney || {};
    // `said`: the status above already said nothing is listed and the plan's own pension (unlistedStatusOf): said once
    return { ids: [...(said ? [] : ['unlisted', num(pm.isa) > 0 ? 'planHasIsa' : 'planHas']), 'need', ...(F.short > 0 ? ['planShort', ...(newMoney > 0 ? ['newMoney'] : []), ...shortTail] : ['planEnough'])],
      slots: { ...slots, pension: pounds(pm.pension), isa: pounds(pm.isa), from: pm.from || 'plan' } };
  }
  if (F.listed === false) return { ids: [...(said ? [] : ['unlisted']), 'need'], slots };
  return { ids: ['need', 'youHold', ...rest], slots };
}

/**
 * What is held that the plan does not use (7.12.0), a ladder only: the lines outside it and a rung's units above its target,
 * each { key, label, ticker, value, note } — `note` an id of MOVE.outside.notes with slots, or null (a fund).
 */
export function outsideRowsOf(diff) {
  const D = diff || {};
  if (!D.funding) return [];
  const rows = (D.outside || []).map((x) => {
    let note = null;
    if (x.kind === 'gilt') {
      note = x.matures
        ? { id: num(x.real) > 0 && Math.round(num(x.real)) !== Math.round(num(x.pays)) ? 'giltReal' : 'gilt', slots: { date: dayWords(x.matures), pays: pounds(x.pays), real: pounds(x.real), year: x.cashYear ? taxYearLabel(x.cashYear) : null }, cashYear: !!x.cashYear }
        : { id: 'giltUnknown', slots: {} };
    }
    return { key: x.key, label: x.label || x.ticker || '', ticker: x.ticker || '', value: pounds(x.value), note };
  });
  for (const x of (D.sell || []).filter(isRungRow)) rows.push({ key: x.key, label: x.label || x.ticker || '', ticker: x.ticker || '', value: pounds(x.amount), note: { id: 'overRung', slots: { excess: grouped(x.units), amount: pounds(x.amount) } } });
  return rows;
}

/** The totals line (7.12.0), a ladder: { id, slots } for MOVE.lists.totalsLadder / totalsShort; null otherwise. */
export function moveTotalsOf(diff) {
  const F = diff && diff.funding;
  if (!F) return null;
  const unpaid = F.short > 0 ? unpaidOf(diff) : null;
  return F.short > 0 ? { id: unpaid.years.length ? 'totalsShort' : 'totalsShortNoYears', slots: { need: pounds(F.need), available: pounds(F.available), short: pounds(F.short), years: yearsWords(unpaid.years) } }
    : { id: 'totalsLadder', slots: { need: pounds(F.need), toRaise: pounds(Math.min(F.toRaise, F.available)), leftOver: pounds(F.leftOver) } };
}

/**
 * The pace (7.12.0): the whole months from this one to the month work stops, and the buying a month that finishes by then,
 * to the £100. Null when the stop is not ahead or there is nothing to buy.
 */
export function paceOf(buyCost, { today, stopMonth }) {
  const m = /^(\d{4})-(\d{2})$/.exec(String(stopMonth || ''));
  const d = today instanceof Date ? today : new Date(String(today).slice(0, 10) + 'T12:00:00');
  if (!m || Number.isNaN(d.getTime()) || !(num(buyCost) > 0)) return null;
  const months = (+m[1] - d.getFullYear()) * 12 + (+m[2] - (d.getMonth() + 1));
  if (!(months > 0)) return null;
  return { months: String(months), when: MONTHS[+m[2] - 1] + ' ' + m[1], perMonth: pounds(Math.round(num(buyCost) / months / 100) * 100) };
}

/**
 * The cash to hold now, row by row (7.12.0, S2): { id, year, need, amount, gap, label, lump } — `need` what the year needs,
 * `amount` the cash to hold for it now; a year a kept line pays in part ('cashYearBeside': `gap` after what `label` pays), and
 * one it pays in full ('cashYearCovered', no figures). `over`: some row holds more than its year needs (said once).
 */
export function cashRowsOf(target, diff) {
  const T = target || {}, D = diff || {};
  if (!T.cash || D.cashInfo) return null;
  const left = D.cashLeft || T.cash;
  const byY = new Map((Array.isArray(left.breakdown) ? left.breakdown : []).filter((r) => r && r.Y).map((r) => [+r.Y, r]));
  const rows = [];
  for (const r of (Array.isArray(T.cash.breakdown) ? T.cash.breakdown : [])) {
    const Y = +r.Y, year = taxYearLabel(Y);
    const now = byY.get(Y);
    if (!now) { rows.push({ id: 'cashYearCovered', year, need: null, amount: null, gap: null, label: null, lump: null }); continue; }
    if (now.besideKept) { rows.push({ id: 'cashYearBeside', year, need: null, gap: pounds(now.need), label: (now.by || []).join(', '), amount: pounds(now.amount), lump: null }); continue; }
    rows.push({ id: num(r.lump) > 0 ? 'cashYearLump' : 'cashYear', year, need: pounds(r.need != null ? r.need : r.amount), amount: pounds(r.amount), gap: null, label: null, lump: num(r.lump) > 0 ? pounds(r.lump) : null, over: num(r.amount) > num(r.need) + 0.5 });
  }
  const target0 = num(left.value), held = num(D.totals && D.totals.cashHeld);
  return { rows, over: rows.some((r) => r.over), target: pounds(target0), held: pounds(held), spare: held >= target0 ? pounds(held - target0) : null, short: held < target0 ? pounds(target0 - held) : null };
}

const FROM_WORDS = { plan: 'from your plan', checkIn: 'from your check-in', record: 'from your last record' };
/**
 * The move's status with nothing listed under What you hold (7.12.0, the moving brief S4): { id: 'unlisted' | 'unlistedIsa',
 * slots: { pension, isa, from } } from the plan's own money (PlanReading.planMoneyOf, the one pension-today reader), or null
 * when the plan has no pension figure at all.
 */
export function unlistedStatusOf(plan, { now } = {}) {
  let pm = null; try { pm = planMoneyOf(plan, { now }); } catch { pm = null; }
  if (!pm || !(num(pm.pension) > 0)) return null;
  return { id: num(pm.isa) > 0 ? 'unlistedIsa' : 'unlisted', slots: { pension: pounds(pm.pension), isa: pounds(pm.isa), from: FROM_WORDS[pm.from] || FROM_WORDS.plan } };
}
