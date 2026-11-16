/**
 * The plan, month by month (7.12.0): what the plan asked a person to take, read in ONE place for both views. Pure: no
 * storage and no clock of its own.
 *
 *   takenAgainstPlan(records) → { n, months, taken, said, diff, net, netKnown, cut, setUpMonths }
 *   yearPlanOf(plan, key)     → { setUp, from, payments, perMonth, total } | null: a tax year as it was set up
 *   firstPaymentMonth(plan, { now, settings }) → { month: 'YYYY-MM' | null, from: 'record' | 'setUp' | 'stop' | null }
 *   takenSentence(inc, { year, compare, setUpNote }) → { id, compare, parts, figures }: the words both views say
 *
 * "What the plan said" for a month is what the month itself told the person to take: the record's standard pension draw
 * before any cut (`stdSipp`, else what was taken) with the other income and State Pension of that month. Never the plan
 * document's year row a twelfth at a time: that figure is frozen at the lock, in the lock's prices, and counts the whole
 * need as if every pound were taxed, so it read a year raised with prices, or a quarter taken tax-free, as taking more or
 * less than the plan.
 */

import { monthsWords } from './MonthFill.js';
import { stoppedWorkOf } from './PlanTiming.js';
import { beforeOf, BEFORE_KINDS } from './PlanClosed.js';

const num = (v) => (v == null || v === '' || !Number.isFinite(+v) ? null : +v);
const pence = (v) => Math.round((num(v) || 0) * 100);

/**
 * The records of one tax year, against what each month told the person to take. Summed in pence and rounded once, so
 * three months of £2,833.33 read £8,500, never £8,499. `diff` = taken − said in whole pounds. `net` is what reached the
 * bank (the records' `monthlyNet`); `netKnown` false when any record lacks it. `cut` counts the months the plan's
 * protection cut (`inProtection === true`). An old record with no `stdSipp` reads as taken = said.
 */
export function takenAgainstPlan(records) {
  const recs = (Array.isArray(records) ? records : []).filter((h) => h && typeof h === 'object');
  let taken = 0, said = 0, net = 0;
  let netKnown = recs.length > 0;
  for (const h of recs) {
    const rest = pence(h.other) + pence(h.state);
    taken += pence(h.sipp) + rest;
    said += pence(num(h.stdSipp) != null ? h.stdSipp : h.sipp) + rest;
    if (num(h.monthlyNet) == null) netKnown = false;
    else net += pence(h.monthlyNet);
  }
  const T = Math.round(taken / 100), S = Math.round(said / 100);
  return {
    n: recs.length,
    months: recs.map((h) => String(h.date).slice(0, 7)).sort(),
    taken: T, said: S, diff: T - S,
    net: netKnown ? Math.round(net / 100) : null, netKnown,
    cut: recs.filter((h) => h.inProtection === true).length,
    setUpMonths: recs.filter((h) => h.fromSetUp === true).map((h) => String(h.date).slice(0, 7)).sort()
  };
}

/** 'YYYY-MM' n months on. */
export function addMonths(m, n) {
  const a = /^(\d{4})-(\d{2})/.exec(String(m || ''));
  if (!a) return null;
  const t = +a[1] * 12 + (+a[2] - 1) + n;
  return Math.floor(t / 12) + '-' + String((t % 12) + 1).padStart(2, '0');
}

/** '26/27' (or '2026/27') → 2026. */
const yearOfKey = (key) => { const a = parseInt(String(key).split('/')[0], 10); return Number.isFinite(a) ? (a < 100 ? 2000 + a : a) : NaN; };

/**
 * A tax year as it was set up (the Decision tool's `taxYears[key]`, key '26/27'): `from` the month the set-up runs from
 * (April, else the month it was set up part-way from: `startMonth`), `payments` the months it pays (`remainingMonths`, 12
 * from April), `perMonth` what the plan takes a month before tax in the measure the records use (pension + other income
 * + State Pension): the latest record of that year not filled in from the set-up gives its own figure (`stdSipp`, else
 * `sipp`, with `other` and `state`); with none, the set-up's own expected month. `total` = perMonth × payments, rounded
 * once. Null for a year not set up: nothing is said for it (the document's year row is not read for this).
 */
export function yearPlanOf(plan, key) {
  const dt = plan && plan.decisionTool && typeof plan.decisionTool === 'object' ? plan.decisionTool : null;
  const cfg = dt && dt.taxYears && typeof dt.taxYears === 'object' ? dt.taxYears[key] : null;
  if (!cfg || !cfg.yearSetupComplete) return null;
  const Y = yearOfKey(key);
  if (!Number.isFinite(Y)) return null;
  const sm = Number(cfg.startMonth);
  const from = addMonths(Y + '-04', Number.isFinite(sm) && sm >= 1 && sm <= 12 ? (sm + 8) % 12 : 0);
  const rm = Number(cfg.remainingMonths);
  const payments = Number.isFinite(rm) && rm >= 1 && rm <= 12 ? Math.round(rm) : 12;
  const recs = (Array.isArray(dt.history) ? dt.history : []).filter((h) => h && h.taxYear === key && h.fromSetUp !== true).sort((a, b) => String(a.date).localeCompare(String(b.date)));
  const latest = recs.length ? recs[recs.length - 1] : null;
  let perMonth = null;
  if (latest) perMonth = (pence(num(latest.stdSipp) != null ? latest.stdSipp : latest.sipp) + pence(latest.other) + pence(latest.state)) / 100;
  else {
    const em = cfg.expectedMonthly && typeof cfg.expectedMonthly === 'object' ? cfg.expectedMonthly : null;
    const g = (k) => (em && em[k] && num(em[k].gross) != null ? +em[k].gross : 0);
    if (em) perMonth = (pence(g('sipp')) + pence(g('other')) + pence(g('statePension'))) / 100;
  }
  if (perMonth == null) return null;
  return { setUp: true, from, payments, perMonth, total: Math.round(perMonth * payments) };
}

/** 'YYYY-MM' of a local day. */
const monthOfDay = (d) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
const YM = /^\d{4}-\d{2}$/;

/**
 * The first month the plan paid (or pays), never stored: the earlier of the first record's month and the month the earliest
 * tax year set up was set up from (April of its year, or the month it was set up part-way from). With neither, the month
 * work stopped when the plan says it (the document's timing when locked, else `settings`, the effective Stress settings the
 * caller holds) and it is this month or before. With none of these: { month: null, from: null } — we do not know, and say
 * nothing about earlier months. Never earlier than the first month of a plan that carries a closed one on (`plan.before`).
 * Not April by assumption: a plan whose first payment was November does not have April to October to record.
 */
export function firstPaymentMonth(plan, { now = new Date(), settings = null } = {}) {
  const dt = plan && plan.decisionTool && typeof plan.decisionTool === 'object' ? plan.decisionTool : {};
  const rec = (Array.isArray(dt.history) ? dt.history : []).map((h) => (h && typeof h.date === 'string' ? h.date.slice(0, 7) : null)).filter((m) => m && YM.test(m)).sort()[0] || null;
  const tys = dt.taxYears && typeof dt.taxYears === 'object' ? dt.taxYears : {};
  const setUp = Object.keys(tys).filter((k) => tys[k] && tys[k].yearSetupComplete).map((k) => {
    const Y = yearOfKey(k);
    if (!Number.isFinite(Y)) return null;
    const sm = Number(tys[k].startMonth);
    return addMonths(Y + '-04', Number.isFinite(sm) && sm >= 1 && sm <= 12 ? (sm + 8) % 12 : 0);
  }).filter(Boolean).sort()[0] || null;
  let month = null, from = null;
  if (setUp && (!rec || setUp <= rec)) { month = setUp; from = 'setUp'; }
  else if (rec) { month = rec; from = 'record'; }
  else {
    const doc = plan && plan.planDocument && plan.planDocument.timing ? plan.planDocument.timing : null;
    const locked = !!(dt.settings && dt.settings.locked);
    const stop = stoppedWorkOf(locked && doc && doc.stoppedWork ? doc : settings);
    if (stop && stop <= monthOfDay(now)) { month = stop; from = 'stop'; }
  }
  const b = beforeOf(plan);
  const floor = b && BEFORE_KINDS.includes(b.kind) ? b.from : null;
  if (month && floor && month < floor) month = floor;
  return { month, from };
}

/**
 * The months of a tax year against the plan, in words, the same in both views (the simple view's "Where you are" and the
 * full view's strip): "2 months recorded in 2026/27: £5,154 taken before tax, as your plan said. £4,382 reached your
 * bank." `inc` is whereAmI's `incomeThisYear` (recorded, drawn, said, diff, net, cut, setUpMonths). `compare` false (a
 * plan stored the old way whose start is still ahead) says what was taken and no more. `setUpNote` names the months
 * filled in from the tax-year set-up after the count (the full view). `parts` are strings and { key, kind: 'money' |
 * 'count' } into `figures`; `id` is 'where.retired' and `compare` the id of the difference said (where.compareSame,
 * where.compareLess, where.compareLessCut, where.compareMore), or null.
 */
export function takenSentence(inc, { year, compare = true, setUpNote = false } = {}) {
  const n = inc && Number.isFinite(+inc.recorded) ? +inc.recorded : 0;
  const figures = {};
  if (!n) return { id: 'where.retired', compare: null, parts: ['No month recorded in ' + year + ' yet.'], figures };
  const money = (key) => ({ key, kind: 'money' });
  figures.months = n; figures.drawn = Math.round(+inc.drawn || 0);
  const setUp = setUpNote && Array.isArray(inc.setUpMonths) && inc.setUpMonths.length ? inc.setUpMonths : [];
  const note = setUp.length ? ' (' + monthsWords(setUp) + (setUp.length === 1 ? ' is' : ' are') + ' filled in from your tax-year set-up)' : '';
  const parts = [{ key: 'months', kind: 'count' }, ' month' + (n === 1 ? '' : 's') + ' recorded in ' + year + note + ': ', money('drawn'), ' taken before tax'];
  let id = null;
  const diff = Math.round(+inc.diff || 0);
  if (!compare || !Number.isFinite(+inc.said)) parts.push('.');
  else if (diff === 0) { id = 'where.compareSame'; parts.push(', as your plan said.'); }
  else {
    figures.said = Math.round(+inc.said); figures.diff = Math.abs(diff);
    const cut = +inc.cut || 0;
    if (diff < 0 && cut > 0) {
      id = 'where.compareLessCut';
      parts.push('. That is ', money('diff'), ' less than your plan said, because income was cut in ' + (cut >= n ? (n === 1 ? 'that month' : 'all of them') : cut + ' of them') + '.');
    } else {
      id = diff < 0 ? 'where.compareLess' : 'where.compareMore';
      parts.push('. That is ', money('diff'), (diff < 0 ? ' less' : ' more') + ' than your plan said.');
    }
  }
  if (inc.net != null && Number.isFinite(+inc.net)) { figures.net = Math.round(+inc.net); parts.push(' ', money('net'), ' reached your bank.'); }
  return { id: 'where.retired', compare: id, parts, figures };
}

/** A sentence's parts as plain text (the full view): money as £1,234, counts as figures. */
export function sentenceText({ parts, figures }) {
  const pounds = (v) => '£' + Math.abs(Math.round(+v || 0)).toLocaleString('en-GB');
  return parts.map((p) => (typeof p === 'string' ? p : p.kind === 'money' ? pounds(figures[p.key]) : String(Math.round(+figures[p.key] || 0)))).join('');
}
