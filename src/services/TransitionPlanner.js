/**
 * Transition planner — "how do I actually buy it?" (6.8.0)
 *
 * Target = the plan document (the order sheet for a gilt ladder; the year-0 target mix for a pot
 * strategy). Ledger = today's holdings — the plan's `holdings.lines` record (6.12: NOT the Stress tester's
 * fund list, which is a strategy input). This module diffs the two in units and pounds per wrapper, lays
 * the moves out on a dated schedule to the plan start (cash first, near rungs before far ones, sales in
 * tranches, new contributions before sales), and measures progress. It says what to buy and sell; it
 * never places an order. Pure: no DOM, no storage.
 *
 * Time-aware (6.12, corrected 6.13): a ladder target is read against TODAY. A rung whose gilt has matured has
 * paid — it is no longer a target (the ladder buys gilts maturing BEFORE the April their year starts, so the
 * date, not the tax year, is the test). Once the plan is running the cash years' money is being spent as
 * designed, so cash is reported (held vs target) rather than diffed as a move. Rungs the rotation sold are not
 * targets either, and the fund their proceeds bought is kept. Spare SIPP cash and bank cash are never sells.
 */
import { tagPortfolio } from './PortfolioTagger.js';
import { normaliseKeep } from './HoldingsRecord.js';
import { giltOfName, couponOfName, maturityOfName, ilWords } from './GiltName.js';
import { taxYearLabel, taxYearStartOf } from './PlanTiming.js';
import giltsSnapshot from '../data/giltsSnapshot.js';

const num = (v) => (Number.isFinite(+v) ? +v : 0);
const up = (s) => String(s || '').toUpperCase().trim();
const gbp = (v) => '£' + Math.round(num(v)).toLocaleString('en-GB');
const dateGB = (iso) => { const d = new Date(String(iso).slice(0, 10) + 'T00:00:00Z'); return Number.isNaN(d.getTime()) ? String(iso) : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }); };
export const TRANSITION_TOLERANCE = 0.02;   // a rung within 2% of its target counts as held
const MONEY_MARKET = new Set(['CSH2', 'CASH', 'MMF', 'XSTR', 'ERNS', 'ERNX']);
// Every TIDM in the bundled gilt universe (6.13.0): codes like TRTQ, T2IL or TR8F fit no ticker pattern.
const GILT_LIST = (Array.isArray(giltsSnapshot?.gilts) ? giltsSnapshot.gilts : []).filter(Boolean);
const GILT_TIDMS = new Set(GILT_LIST.map((g) => up(g && g.tidm)).filter(Boolean));

/** Is this ledger line a gilt? A TIDM in the bundled universe, a ticker shape (TRxx / TGxx / Txx) or a GB00B… ISIN. */
export function isGiltTicker(t) { const u = up(t); return GILT_TIDMS.has(u) || /^T[RGNS]?\d{2}[A-Z]?$/.test(u) || /^GB00B/.test(u); }

/** A ledger row → the raw line's subClass and kind (7.6.0): ledgerView's rows keep their shape, so this rides beside them. */
const RAW = new WeakMap();
const rawOf = (h) => (h && RAW.get(h)) || h || {};

/**
 * The bundled gilt a line names (7.6.0), and how it was found. The line's own evidence comes first — its SEDOL, its exact
 * name, then its name's coupon and maturity date (GiltName.giltOfName) — and its code last: a pasted code is often a guess
 * ("T" + the year, and T27, T28, T29 are index-linked gilts' codes), so a code whose gilt the name contradicts (another
 * maturity date, another coupon, index-linked words on a conventional gilt) is not this line's.
 * @returns {{ g: object, by: 'sedol'|'name'|'words'|'code' }|null}
 */
function giltEvidence(h) {
  const t = up(h && h.ticker), s = up(h && h.sedol), n = String((h && h.name) || '').trim();
  const bySedol = s && GILT_LIST.find((g) => g.isin && up(g.isin).slice(4, 11) === s);
  if (bySedol) return { g: bySedol, by: 'sedol' };
  const byName = n && GILT_LIST.find((g) => String(g.name || '').trim().toLowerCase() === n.toLowerCase());
  if (byName) return { g: byName, by: 'name' };
  const byWords = giltOfName(n);
  if (byWords) return { g: byWords, by: 'words' };
  const byCode = t && GILT_LIST.find((g) => up(g.tidm) === t);
  if (byCode && !codeContradicted(byCode, n)) return { g: byCode, by: 'code' };
  return null;
}
function codeContradicted(g, name) {
  const date = maturityOfName(name);
  if (date && String(g.maturity || '').slice(0, 10) !== date) return true;
  const c = couponOfName(name);
  if (c != null && Number.isFinite(+g.coupon) && Math.abs(+g.coupon - c) >= 0.0005) return true;
  return ilWords(name) && g.type === 'conventional';
}
/** The bundled gilt a line names (7.6.0): by its SEDOL, its exact name, its name's coupon and date, then its code; null when none. */
export function giltOfLine(h) { const e = giltEvidence(h); return e ? e.g : null; }

/**
 * What a gilt line's own evidence says it is (7.6.0): true — conventional (fixed pay); false — index-linked; null — it cannot
 * be told (a typed name with no coupon or date, a code the bundled list does not know). Index-linked words in the name win.
 */
export function conventionalEvidence(h) {
  if (ilWords(h && h.name)) return false;
  const e = giltEvidence(h);
  return e ? e.g.type === 'conventional' : null;
}
/**
 * Never matched to an index-linked rung by its year or a guessed code (7.6.0): a line known to be conventional — by its
 * evidence, or, when that cannot tell, placed as long (conventional) gilts. A line that cannot be told keeps the old reading.
 */
function knownConventional(h) {
  const e = conventionalEvidence(h);
  return e === true || (e === null && rawOf(h).subClass === 'longGilts');
}
/** Known conventional by the line's own words or SEDOL — not by its code alone: a code the plan itself names as a rung is that rung. */
function conventionalByOwnWords(h) {
  if (ilWords(h && h.name)) return false;
  const e = giltEvidence(h);
  return !!e && e.by !== 'code' && e.g.type === 'conventional';
}
/** Priced as a conventional gilt when kept to stand in (7.6.0): its evidence; else how it was placed; else a gilt named as a Treasury or gilt. */
function isConventional(h) {
  if (ilWords(h && h.name)) return false;
  const e = giltEvidence(h);
  if (e && e.by !== 'code') return e.g.type === 'conventional';
  const r = rawOf(h);
  if (r.subClass === 'longGilts') return true;
  if (r.subClass === 'indexLinked') return false;
  if (e) return e.g.type === 'conventional';
  return !!(h && (h.gilt || r.kind === 'gilt')) && /treasury|gilt/i.test(String(h.name || ''));
}

/** Months of the tax year still to come on `today`, this one included (November: November to March, 5; 1–5 April: 1). */
export function monthsLeftInTaxYear(today) {
  const d = today instanceof Date ? today : new Date(String(today).slice(0, 10) + 'T12:00:00');
  const m = d.getMonth() + 1;
  if (m === 4 && d.getDate() < 6) return 1;
  return m >= 4 ? 16 - m : 4 - m;
}

// The bundled Bank of England implied inflation curve (spot, by years ahead): what a fixed pound later is worth today.
const INFLATION = (Array.isArray(giltsSnapshot?.boeInflationCurve) ? giltsSnapshot.boeInflationCurve : []).filter((p) => p && +p.years > 0 && Number.isFinite(+p.yield)).sort((a, b) => a.years - b.years);
const INFLATION_FALLBACK = 0.03;
/** The yearly inflation the curve implies to `years` ahead (the nearest point before its start or after its end; in between, read along it). */
export function inflationTo(years) {
  if (!INFLATION.length) return INFLATION_FALLBACK;
  if (years <= INFLATION[0].years) return +INFLATION[0].yield;
  const last = INFLATION[INFLATION.length - 1];
  if (years >= last.years) return +last.yield;
  const i = INFLATION.findIndex((p) => p.years >= years);
  const a = INFLATION[i - 1], b = INFLATION[i];
  return +a.yield + (+b.yield - +a.yield) * (years - a.years) / (b.years - a.years);
}
/** A fixed amount paid on `when`, in today's money: less the inflation the curve implies between today and then. */
export function inTodaysMoney(amount, when, today) {
  if (!(when instanceof Date) || !(today instanceof Date) || Number.isNaN(when.getTime()) || Number.isNaN(today.getTime())) return amount;
  const years = (when.getTime() - today.getTime()) / (365.25 * 24 * 3600 * 1000);
  if (!(years > 0)) return amount;
  return amount / Math.pow(1 + inflationTo(years), years);
}

/**
 * What a line kept to stand in for the plan's money pays (7.6.0), never priced as something it is not:
 *   a conventional gilt — its nominal (the units) at maturity plus the coupons still to come: a fixed amount that does not
 *     rise with prices (`fixed`); the nominal is read from the value at the bundled price when no units are recorded.
 *     `real` is that amount in today's money (the plan's needs are in today's money): less the inflation the bundled curve
 *     implies to its maturity date — or, with none known, to the April of the first tax year it stands in for (`from`);
 *   an index-linked gilt — its nominal times today's index ratio (it rises with prices);
 *   anything else — its value today (it can change).
 * @returns {{ amount: number, real: number, payKind: 'conventional'|'indexLinked'|'value', fixed: boolean, matures: string|null, coupon: number|null, nominal: number|null }}
 */
export function standInPays(h, { today = null, from = null } = {}) {
  const g = giltOfLine(h);
  const units = num(h && h.units) > 0 ? num(h.units) : null;
  const value = num(h && h.value);
  if (isConventional(h)) {
    const gc = g && g.type === 'conventional' ? g : null;
    const nominal = units != null ? units : (gc && num(gc.cleanPrice) > 0 ? value / (num(gc.cleanPrice) / 100) : value);
    const coupon = gc && Number.isFinite(+gc.coupon) ? +gc.coupon : null;
    const matures = gc && gc.maturity ? String(gc.maturity).slice(0, 10) : (maturityOfName(h && h.name) || null);
    // coupons still to come: every six months back from maturity, while after today; with no day to read against, the last one
    let couponsLeft = 1;
    const now = today instanceof Date && !Number.isNaN(today.getTime()) ? today : null;
    if (matures && now) {
      const [y, m, d] = matures.split('-').map(Number);
      couponsLeft = 0;
      for (let k = 0; k < 200; k++) { const at = Date.UTC(y, m - 1 - 6 * k, d); if (at <= now.getTime()) break; couponsLeft++; }
      couponsLeft = Math.max(1, couponsLeft);   // the last coupon is paid with the nominal, even on a line kept past maturity
    }
    const amount = nominal + (coupon ? nominal * coupon / 200 * couponsLeft : 0);
    const when = matures ? new Date(matures + 'T12:00:00') : (+from > 2000 ? new Date(+from, 3, 6, 12) : null);
    const real = now && when ? inTodaysMoney(amount, when, now) : amount;
    return { amount: Math.round(amount), real: Math.round(real), payKind: 'conventional', fixed: true, matures, coupon, nominal: Math.round(nominal) };
  }
  const il = ilWords(h && h.name) || (!!g && g.type !== 'conventional');
  // the index ratio is a ratio (1.4…): a rung of N units pays N × the ratio (the ladder sizes its nominal so)
  if (il && units != null && g && g.type !== 'conventional' && num(g.indexRatio) > 0) { const a = Math.round(units * num(g.indexRatio)); return { amount: a, real: a, payKind: 'indexLinked', fixed: false, matures: g.maturity ? String(g.maturity).slice(0, 10) : null, coupon: null, nominal: Math.round(units) }; }
  return { amount: Math.round(value), real: Math.round(value), payKind: 'value', fixed: false, matures: g && g.maturity ? String(g.maturity).slice(0, 10) : null, coupon: null, nominal: null };
}

/**
 * The tax year a kept line most likely stands in for (7.6.0): the tax year its gilt matures in — by its bundled maturity date,
 * else its name's date, else the year in its name or code — when that is one of `years` (the years "Keep this" offers); null
 * otherwise. A suggestion only: the person ticks the years.
 */
export function standInYearOf(h, years = []) {
  const g = giltOfLine(h);
  // a gilt only: a fund with a year in its name ("… 2040") is not one that matures
  if (!(g || (h && h.kind === 'gilt') || isGiltTicker(h && h.ticker) || /treasury|gilt/i.test(String((h && h.name) || '')))) return null;
  const date = (g && g.maturity ? String(g.maturity).slice(0, 10) : null) || maturityOfName(h && h.name);
  let Y = null;
  if (date) Y = taxYearStartOf(new Date(date + 'T12:00:00'));
  else {
    const m = /\b(20\d{2})\b/.exec(String((h && h.name) || '')) || null;
    const c = /^T[RGNS]?(\d{2})[A-Z]?$/.exec(up(h && h.ticker));
    Y = m ? +m[1] : c ? 2000 + +c[1] : null;
  }
  return Y != null && years.map(Number).includes(Y) ? Y : null;
}

/**
 * What the plan needs each tax year (7.6.0), from the document: { [Y]: { need, cost, from } } — `need` the year's money in
 * today's pounds (what the plan pays out, less the State Pension), `cost` what a cash year's money cost to set aside, `from`
 * 'cash', a rung's TIDM, or 'none'. Empty when the document carries no years.
 */
export function yearNeedsOf(doc) {
  const plan = doc && doc.strategy && doc.strategy.r && doc.strategy.r.plan;
  const out = {};
  for (const y of (plan && Array.isArray(plan.years) ? plan.years : [])) if (y && +y.Y > 2000) out[+y.Y] = { need: num(y.need), cost: y.cost != null ? num(y.cost) : null, from: y.from || null };
  return out;
}

/** The per-year needs a diff reads: the document's when given, else worked from the target (a rung's pay split over its years; a cash year's cost). */
function needsFrom(target, given) {
  if (given && typeof given === 'object' && Object.keys(given).length) return given;
  const out = {};
  for (const t of [...(target.paid || []), ...(target.sold || []), ...(target.lines || [])]) {
    const ys = Array.isArray(t.taxYears) ? t.taxYears : [];
    for (const Y of ys) out[+Y] = { need: num(t.pays) / ys.length, cost: null, from: t.ticker || 'gilt' };
  }
  const c = target.cash;
  if (c && Array.isArray(c.yearsLeft) && Array.isArray(c.breakdown) && c.breakdown.length === c.yearsLeft.length) c.yearsLeft.forEach((Y, i) => { out[+Y] = { need: num(c.breakdown[i].amount), cost: num(c.breakdown[i].amount), from: 'cash' }; });
  return out;
}

/** The plan's first tax year: the plan object's own anchor, else the document's timing, else the earliest year it funds. */
function planStartYear(d, plan) {
  if (+plan?.firstTaxYear > 0) return +plan.firstTaxYear;
  if (+d.timing?.firstTaxYear > 0) return +d.timing.firstTaxYear;
  if (+d.assumptions?.firstTaxYear > 0) return +d.assumptions.firstTaxYear;
  const ys = [...(Array.isArray(plan?.cashYears) ? plan.cashYears.map((c) => +c.Y) : []), ...(Array.isArray(plan?.orders) ? plan.orders.flatMap((o) => (Array.isArray(o.taxYears) ? o.taxYears.map(Number) : [])) : [])].filter((y) => y > 2000);
  return ys.length ? Math.min(...ys) : null;
}

/**
 * Is the plan running on `today`? From 6 April of its first tax year — or, for someone retiring later in
 * that year, from the retirement month the document carries (`timing.startMonth`, 'YYYY-MM').
 */
export function planRunning(doc, today = new Date()) {
  const d = doc || {};
  const plan = d.strategy?.r?.plan;
  const fty = planStartYear(d, plan);
  if (!(fty > 0)) return false;
  if (taxYearStartOf(today) < fty) return false;
  const sm = d.timing?.startMonth;
  if (typeof sm === 'string' && /^\d{4}-\d{2}$/.test(sm)) {
    const nowKey = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0');
    return nowKey >= sm;
  }
  return true;
}

/**
 * The plan's target holdings, from the plan document, as of `today`.
 * @param {object} doc      the plan document
 * @param {{ today?: Date, params?: object|null }} o   `params` — the LIVE strategy params when the shell has them: the
 *   document is a lock-time snapshot, so a rotation fired afterwards (its `borrowedFloor`) is only on the live settings.
 * @returns {{ kind: 'ladder'|'buckets'|'none', lines: [], paid: [], sold: [], rotated: boolean,
 *   cash: { value, spending, yearsLeft, breakdown }|null, running: boolean, thisTaxYear: number, firstTaxYear: number|null, note }}
 *   `paid` = rungs whose gilt has matured (no longer targets). `sold` = rungs the rotation sold (no longer targets;
 *   `rotated` says the equity fund it bought is the plan now). `cash.spending` = true once the plan is running: the cash
 *   years are being spent, so the value is what the years still ahead need, for information.
 */
export function targetHoldings(doc, { today = new Date(), params = null } = {}) {
  const d = doc || {};
  const plan = d.strategy?.r?.plan;
  const thisTY = taxYearStartOf(today);
  if (d.strategy?.contract && plan && Array.isArray(plan.orders)) {
    const firstTaxYear = planStartYear(d, plan);
    const running = planRunning(d, today);
    const toLine = (o) => ({
      key: 'gilt:' + up(o.tidm || o.sedol || o.name), wrapper: 'SIPP', kind: 'gilt',
      label: o.name, ticker: up(o.tidm), sedol: o.sedol || null, matures: o.matures || null,
      units: Math.round(num(o.nominal)), cost: Math.round(num(o.cost)), pays: Math.round(num(o.pays)),
      taxYears: Array.isArray(o.taxYears) ? o.taxYears.slice() : [], cleanPrice: num(o.cleanPrice) || null, indexRatio: num(o.indexRatio) || null
    });
    // A gilt that pays nothing is not a target (6.11.3): its years are covered by a lump sum expected later or other income.
    const paying = plan.orders.filter((o) => num(o.pays) > 0);
    // A rung retires once its gilt has MATURED (6.13.0): the ladder buys gilts maturing before the April their tax year
    // starts, so from redemption to that 6 April the money is cash, not a rung to hold — the old "every tax year passed"
    // rule kept a redeemed gilt as a target for up to a year. No maturity date → paid once every year it funds has passed.
    const isPaid = (o) => { const m = o.matures ? Date.parse(o.matures) : NaN; return Number.isFinite(m) ? m < today.getTime() : (Array.isArray(o.taxYears) && o.taxYears.length > 0 && o.taxYears.every((Y) => +Y < thisTY)); };
    // Rungs the rotation sold are not targets either: the borrowed floor (live params first — the document is a snapshot
    // — then the document's params or its rotation record) lists their TIDMs; the proceeds bought the equity fund.
    const bf = (params && params.borrowedFloor) || d.strategy?.params?.borrowedFloor || d.rotation?.borrowedFloor || null;
    const soldTidms = new Set(bf && Array.isArray(bf.tidms) ? bf.tidms.map(up).filter(Boolean) : []);
    const isSold = (o) => soldTidms.has(up(o.tidm));
    const live = paying.filter((o) => !isSold(o));
    const lines = live.filter((o) => !isPaid(o)).map(toLine);
    const paid = live.filter(isPaid).map(toLine);
    const sold = paying.filter(isSold).map(toLine);
    const rotated = !!bf;
    const cashYears = Array.isArray(plan.cashYears) ? plan.cashYears : [];
    const yearsLeft = cashYears.filter((c) => +c.Y >= thisTY).map((c) => +c.Y);
    // The cash to hold is the cash YEARS' money (7.4.2: a ladder's only cash): their costs when the plan carries them. A
    // document written before them is read from plan.cash — less the extra cash an older document set aside beside the
    // cash years (its `assumptions.bridgeCash`), which is no target: nobody retired has months before their plan.
    const oldExtra = Math.max(0, num(d.assumptions?.bridgeCash ?? d.strategy?.params?.bridgeCash));
    const cyCost = cashYears.reduce((s, c) => s + num(c.cost), 0);
    const cashYearsMoney = cyCost > 0 ? cyCost : Math.max(0, num(plan.cash) - oldExtra);
    // While running, the cash target is what the cash years still ahead need (the current one in full — part of it
    // is already spent, which is exactly why this is information and not a move). From `years` when the plan carries
    // them, else the cash years' money pro-rated by the years left.
    let cashValue = Math.round(cashYearsMoney);
    if (running) {
      if (Array.isArray(plan.years) && plan.years.length) cashValue = Math.round(plan.years.filter((y) => y.from === 'cash' && +y.Y >= thisTY).reduce((t, y) => t + num(y.need), 0));
      else if (cashYears.length) cashValue = Math.round(cashYearsMoney * yearsLeft.length / cashYears.length);
    }
    // A plain breakdown of the cash to hold now, row by row, for the page to show as a small table (6.13.3).
    const breakdown = [];
    for (const c of cashYears) {
      if (running && +c.Y < thisTY) continue;
      const row = Array.isArray(d.timeline) ? d.timeline.find((x) => x && taxYearLabel(+c.Y) === x.taxYear) : null;
      const lump = row && num(row.lump) > 0 ? num(row.lump) : 0;
      breakdown.push({ label: 'Cash year ' + taxYearLabel(+c.Y) + (lump > 0 ? ' (' + gbp(lump) + ' of it paid by a lump sum expected that year)' : ''), amount: Math.round(num(c.cost)) });
    }
    const cash = { key: 'cash:SIPP', wrapper: 'SIPP', kind: 'cash', label: 'Money-market fund / cash', value: cashValue, breakdown, spending: running, yearsLeft: running ? yearsLeft : cashYears.map((c) => +c.Y) };
    let note = 'The ladder is bought in the SIPP. The ISA is ' + (d.pots?.isaPolicy === 'hold' ? 'held aside and not part of the ladder.' : 'drawn by its own policy and not part of the ladder.');
    if (running) note += ' The plan is running (tax year ' + taxYearLabel(thisTY) + ')' + (paid.length ? ': ' + paid.length + ' rung' + (paid.length === 1 ? ' has' : 's have') + ' matured and paid, so ' + (paid.length === 1 ? 'it is' : 'they are') + ' no longer targets' : '') + '; the cash years\' money is being spent as designed, so cash is reported, not diffed.';
    if (sold.length) note += ' The rotation fired' + (bf.soldAt ? ' on ' + dateGB(bf.soldAt) : '') + ': ' + sold.length + ' rung' + (sold.length === 1 ? ' was' : 's were') + ' sold and the proceeds bought the equity fund, so ' + (sold.length === 1 ? 'it is no longer a target' : 'they are no longer targets') + ' and the fund is kept.';
    return { kind: 'ladder', lines, paid, sold, rotated, cash, running, thisTaxYear: thisTY, firstTaxYear, note };
  }
  const mix = Array.isArray(d.targetMix) && d.targetMix.length ? d.targetMix[0] : null;
  const pot = num(d.pots?.potAtRetirement?.sipp) > 0 ? num(d.pots.potAtRetirement.sipp) : num(d.pots?.sipp);
  if (mix && pot > 0) {
    const lines = [
      { key: 'bucket:shares', wrapper: 'SIPP', kind: 'bucket', bucket: 'shares', label: 'Shares (world tracker)', value: Math.round(pot * mix.equity / 100), pct: mix.equity },
      { key: 'bucket:bonds', wrapper: 'SIPP', kind: 'bucket', bucket: 'bonds', label: 'Bonds (gilts / index-linked / global agg)', value: Math.round(pot * mix.bond / 100), pct: mix.bond },
      { key: 'bucket:cash', wrapper: 'SIPP', kind: 'bucket', bucket: 'cash', label: 'Cash (money-market fund)', value: Math.round(pot * mix.cash / 100), pct: mix.cash }
    ];
    return { kind: 'buckets', lines, paid: [], sold: [], rotated: false, cash: null, running: planRunning(d, today), thisTaxYear: thisTY, firstTaxYear: planStartYear(d, null), note: 'A pot strategy: the target is a mix, not a list of funds. Any world tracker, gilt fund or money-market fund fills its bucket; the Stress tester\'s "Example funds" shows one way.' };
  }
  return { kind: 'none', lines: [], paid: [], sold: [], rotated: false, cash: null, running: false, thisTaxYear: thisTY, firstTaxYear: null, note: 'No plan document yet — lock the plan first.' };
}

/**
 * Today's holdings, normalised: ticker, wrapper, value, units, bucket, and whether it is a gilt or cash. A CASH
 * wrapper (bank / savings money) keeps its wrapper (6.13.0) — it is outside the pension and never the SIPP's cash years.
 */
export function ledgerView(holdings) {
  const list = (holdings || []).filter((h) => h && (num(h.value) > 0 || num(h.units) > 0));
  const tagged = tagPortfolio(list.map((h) => ({ ...h, value: num(h.value) })));
  return list.map((h) => {
    const ticker = up(h.ticker);
    const gilt = isGiltTicker(ticker) || h.kind === 'gilt';
    const cash = MONEY_MARKET.has(ticker) || up(h.wrapper) === 'CASH' || h.kind === 'cash' || h.subClass === 'cash' || h.subClass === 'moneyMarket';
    const slice = tagged.tagged.find((t) => t.ticker === h.ticker && t.wrapper === h.wrapper && Math.abs(num(t.value) - num(h.value)) < 1);
    const keep = normaliseKeep(h.keep);
    const row = { ticker, name: h.name || '', sedol: h.sedol || null, wrapper: up(h.wrapper) || 'SIPP', value: num(h.value), units: num(h.units) || null, gilt, cash, bucket: cash ? 'cash' : gilt ? 'bonds' : (slice ? slice.bucket : (h.subClass ? 'shares' : null)),
      // "I'm keeping this" (7.6.0), only on a line the person kept
      ...(keep ? { keep } : {}) };
    RAW.set(row, { subClass: h.subClass || null, kind: h.kind || null });   // how the line was placed, beside the row (7.6.0)
    return row;
  });
}

/**
 * Diff the ledger against the target.
 * @returns {{ kind, buy: [], sell: [], hold: [], keep: [], matured: [], sold: [], cashInfo: { held, target, yearsLeft }|null,
 *   totals: { buyCost, sellValue, shortfall, cashHeld, cashTarget }, progressPct, complete: boolean, reason: string }}
 *   `complete` = no buys, no sells, and every remaining target held. `matured` / `sold` = ledger gilts that match a rung
 *   already paid / sold by the rotation (stale lines to remove from the record — not sales). `keep` = ISA, GIA and bank
 *   cash lines, plus — once the rotation has fired — the equity fund it bought. `cashInfo` is set while the plan is
 *   running: cash is being spent, so it is reported here and never diffed as a move. A cash `hold` before the start
 *   carries `spare` (held above the target): spare cash is never a sell.
 *
 *   Lines the person keeps (7.6.0, a line's `keep`) are never a sell and never matched to a rung by code or year:
 *   `standIn` — a line kept to stand in for the plan's money for some tax years ({ as: 'rung' }): the rungs (or cash years)
 *     of those years are counted as held by it (`covered`), no buy and no sell for them; what it pays (standInPays) is set
 *     against each year's need in turn, and `perYear` says the need, the pay and the gap of each;
 *   `kept` — a line kept by choice ({ as: 'mine' }), with its value and whether it is counted toward the gaps.
 *   These three lists are on the result only when the record keeps something: a record without keeps diffs exactly as before.
 * @param {{ tolerance?: number, needs?: object, today?: Date|null }} o  `needs` = yearNeedsOf(document) (else worked from the
 *   target); `today` counts a conventional gilt's coupons still to come.
 */
export function diffHoldings(holdings, target, { tolerance = TRANSITION_TOLERANCE, needs: needsGiven = null, today = null } = {}) {
  const L = ledgerView(holdings);
  const anyKeep = L.some((h) => h.keep);
  const sipp = L.filter((h) => h.wrapper === 'SIPP' && !h.keep);
  const keepWhy = (h) => h.wrapper === 'ISA' ? 'ISA — kept as it is' : h.wrapper === 'CASH' ? 'bank / savings cash — outside the pension, kept as it is' : 'taxable account — kept as it is';
  const buy = [], sell = [], hold = [], matured = [], sold = [], keep = L.filter((h) => h.wrapper !== 'SIPP' && !h.keep).map((h) => ({ ...h, why: keepWhy(h) }));
  const standIn = [], kept = [], covered = [];
  const keyOfLine = (h) => (h.ticker || h.sedol || h.name || '').toString();
  for (const h of L) if (h.keep && h.keep.as === 'mine') kept.push({ ...h, key: 'kept:' + h.wrapper + ':' + keyOfLine(h), label: h.name || h.ticker, fundsGaps: !!h.keep.fundsGaps, why: 'kept by you' });
  let targetTotal = 0, heldOfTarget = 0, targetCount = 0, cashHeld = 0, cashTarget = 0, cashInfo = null, coveredCount = 0, coveredCashMoney = null;
  if (target.kind === 'ladder') {
    // Lines kept to stand in for some tax years (7.6.0): what each pays (in today's money, as the needs are), set against each
    // year's need in turn. While the plan runs, this tax year needs only its months still to come.
    const needs = anyKeep ? needsFrom(target, needsGiven) : {};
    const needOf = (Y) => (needs[+Y] ? num(needs[+Y].need) : 0);
    const now = today instanceof Date && !Number.isNaN(today.getTime()) ? today : null;
    const running = !!target.running;
    const shareOf = (Y) => (running && now && +Y === target.thisTaxYear ? monthsLeftInTaxYear(now) / 12 : 1);
    const wantOf = (Y) => needOf(Y) * shareOf(Y);
    const left = new Map();
    const standYears = new Map();   // Y → labels of the lines standing in for it
    for (const h of L) {
      if (!h.keep || h.keep.as !== 'rung') continue;
      const p = standInPays(h, { today: now, from: h.keep.taxYears[0] });
      let rest = p.real;
      const perYear = h.keep.taxYears.map((Y) => {
        const want = left.has(Y) ? left.get(Y) : wantOf(Y);
        const pays = Math.max(0, Math.min(rest, want));
        rest -= pays; left.set(Y, want - pays);
        standYears.set(Y, [...(standYears.get(Y) || []), h.name || h.ticker]);
        return { Y, need: Math.round(wantOf(Y)), pays: Math.round(pays), gap: Math.round(Math.max(0, want - pays)) };
      });
      standIn.push({ ...h, key: 'standIn:' + h.wrapper + ':' + keyOfLine(h), label: h.name || h.ticker, taxYears: h.keep.taxYears.slice(), pays: p.amount, real: p.real, payKind: p.payKind, fixed: p.fixed, matures: p.matures, coupon: p.coupon, nominal: p.nominal,
        perYear, gap: perYear.reduce((s, y) => s + y.gap, 0), spare: Math.round(Math.max(0, rest)), why: 'stands in for ' + h.keep.taxYears.map(taxYearLabel).join(', ') });
    }
    // how much of a stood-in year's need what stands in for it pays (0–1): the share of a covered target counted as held
    const paidShare = (ys) => { const w = ys.reduce((s, Y) => s + wantOf(Y), 0); return w > 0 ? Math.max(0, Math.min(1, ys.reduce((s, Y) => s + (wantOf(Y) - (left.has(+Y) ? left.get(+Y) : wantOf(Y))), 0) / w)) : 1; };
    // a rung all of whose years are stood in for is held by those lines; one some of whose years are keeps only the rest
    const lines = [];
    for (const t of target.lines) {
      const cov = standYears.size ? t.taxYears.filter((Y) => standYears.has(+Y)) : [];
      if (!cov.length) { lines.push(t); continue; }
      if (cov.length === t.taxYears.length) {
        covered.push({ key: t.key, kind: t.kind, label: t.label, ticker: t.ticker, taxYears: cov.slice(), by: [...new Set(cov.flatMap((Y) => standYears.get(+Y)))] });
        targetTotal += t.cost; heldOfTarget += t.cost * paidShare(cov); targetCount++; coveredCount++;
        continue;
      }
      const restYears = t.taxYears.filter((Y) => !standYears.has(+Y));
      const all = t.taxYears.reduce((s, Y) => s + needOf(Y), 0);
      const frac = all > 0 ? restYears.reduce((s, Y) => s + needOf(Y), 0) / all : restYears.length / t.taxYears.length;
      covered.push({ key: t.key + ':part', kind: t.kind, label: t.label, ticker: t.ticker, taxYears: cov.slice(), by: [...new Set(cov.flatMap((Y) => standYears.get(+Y)))], part: true });
      // the part stood in for counts toward the plan's mix as far as what stands in for it pays
      targetTotal += t.cost * (1 - frac); heldOfTarget += t.cost * (1 - frac) * paidShare(cov);
      lines.push({ ...t, units: Math.round(t.units * frac), cost: Math.round(t.cost * frac), pays: Math.round(t.pays * frac), taxYears: restYears });
    }
    target = { ...target, lines };
    // cash years stood in for: their money is not cash to hold (the year in full while running: the target counts it so)
    const coveredCash = [...standYears.keys()].filter((Y) => needs[+Y] && needs[+Y].from === 'cash');
    if (coveredCash.length && target.cash) {
      const ahead = coveredCash.filter((Y) => !running || Y >= (target.thisTaxYear || 0));
      const moneyOf = (Y) => (running ? needOf(Y) : num(needs[+Y].cost != null ? needs[+Y].cost : needs[+Y].need));
      const less = ahead.reduce((s, Y) => s + moneyOf(Y), 0);
      const ys = target.cash.yearsLeft || [], bd = Array.isArray(target.cash.breakdown) ? target.cash.breakdown : [];
      // the breakdown is the cash years' rows in the order of yearsLeft (targetHoldings): the covered years' rows come out too
      const breakdown = bd.length === ys.length ? bd.filter((_, i) => !coveredCash.includes(+ys[i])) : bd;
      target = { ...target, cash: { ...target.cash, value: Math.max(0, Math.round(num(target.cash.value) - less)), yearsLeft: ys.filter((Y) => !coveredCash.includes(+Y)), breakdown } };
      covered.push({ key: 'cash:covered', kind: 'cash', label: target.cash.label, ticker: '', taxYears: coveredCash.slice().sort((a, b) => a - b), by: [...new Set(coveredCash.flatMap((Y) => standYears.get(+Y)))] });
      // before the start, the cash years stood in for still count toward the plan's mix: held as far as what stands in for
      // them pays, and then by the pension's cash beyond the cash still to hold (keeping a line never lowers the share held)
      if (!running && less > 0) {
        const cashHeldNow = sipp.filter((h) => h.cash).reduce((s, h) => s + h.value, 0);
        const paid = ahead.reduce((s, Y) => s + moneyOf(Y) * paidShare([Y]), 0);
        coveredCashMoney = { target: less, held: Math.min(less, paid + Math.max(0, cashHeldNow - target.cash.value)) };
      }
    }
    const used = new Set();
    const yearOf = (x) => { const m = String(x || '').match(/(20\d{2})/); if (m) return +m[1]; const c = String(x || '').match(/^T[RGNS]?(\d{2})[A-Z]?$/i); return c ? 2000 + +c[1] : null; };
    // Two passes (6.13.0): every rung takes its EXACT matches (code or SEDOL) first; only a rung left with nothing then
    // falls back to the maturity year — the pasted name gave only a guessed code like "T31" (6.10.5). Each ledger line
    // is used once, so two linkers maturing the same year (T2IL and TR35, both 2035) cannot be mis-paired.
    // A conventional gilt is never an index-linked rung (7.6.0): it pays a fixed amount, not one that rises with prices. A line
    // known to be one by its own words or SEDOL (GiltName: its coupon and date) never takes a rung's code its name contradicts
    // (a pasted "T29" is often a guess); one known by its words, its code or its placing as long gilts is never matched by its
    // year. A code that IS the rung's code, with nothing in the name against it, is that rung. A line that cannot be told
    // reads as before. The person can say it stands in for some years instead ("Keep this").
    const exact = (h, t) => (h.ticker && t.ticker && h.ticker === t.ticker && !conventionalByOwnWords(h)) || (t.sedol && (up(h.sedol) === up(t.sedol) || up(h.name).includes(up(t.sedol))));
    const loose = (h, t, ty) => !knownConventional(h) && ((h.ticker && h.ticker.length >= 3 && t.label && up(t.label).includes(h.ticker)) || (ty && (yearOf(h.name) === ty || yearOf(h.ticker) === ty)));
    const all = [...(target.paid || []), ...(target.sold || []), ...target.lines];
    const rowsOf = new Map();
    const take = (t, pred) => { const rows = sipp.filter((h) => !used.has(h) && h.gilt && pred(h)); rows.forEach((r) => used.add(r)); rowsOf.set(t, rows); };
    for (const t of all) take(t, (h) => exact(h, t));
    for (const t of all) if (!rowsOf.get(t).length) { const ty = yearOf(t.matures) || yearOf(t.label) || yearOf(t.ticker); take(t, (h) => loose(h, t, ty)); }
    const rowsFor = (t) => rowsOf.get(t) || [];
    // Rungs already paid (6.12): a ledger line still carrying one is stale — the platform paid it out — not a sale.
    for (const t of (target.paid || [])) for (const r of rowsFor(t)) matured.push({ ...r, key: 'matured:' + (r.ticker || t.ticker), label: r.name || r.ticker || t.label, rung: t.label, why: 'matured and paid' + (t.taxYears.length ? ' in ' + t.taxYears.map(taxYearLabel).join(', ') : '') + ' — remove it from your record' });
    // Rungs the rotation sold: a line still carrying one is stale too — the sale is on record — not a sale to make.
    for (const t of (target.sold || [])) for (const r of rowsFor(t)) sold.push({ ...r, key: 'sold:' + (r.ticker || t.ticker), label: r.name || r.ticker || t.label, rung: t.label, why: 'sold by the rotation — remove it from your record' });
    for (const t of target.lines) {
      const rows = rowsFor(t);
      const unitPrice = t.cleanPrice && t.indexRatio ? (t.cleanPrice * t.indexRatio / 100) : (t.units > 0 ? t.cost / t.units : null);
      const heldUnits = rows.reduce((s, r) => s + (r.units != null ? r.units : (unitPrice ? r.value / unitPrice : 0)), 0);
      const delta = t.units - heldUnits;
      targetTotal += t.cost; heldOfTarget += Math.min(t.cost, unitPrice ? heldUnits * unitPrice : 0); targetCount++;
      if (t.units > 0 && Math.abs(delta) <= tolerance * t.units) hold.push({ ...t, heldUnits: Math.round(heldUnits) });
      else if (delta > 0) buy.push({ ...t, units: Math.round(delta), amount: Math.round(unitPrice ? delta * unitPrice : t.cost * (delta / t.units)), heldUnits: Math.round(heldUnits), why: 'rung for ' + t.taxYears.map(taxYearLabel).join(', ') });
      else sell.push({ ...t, units: Math.round(-delta), amount: Math.round(unitPrice ? -delta * unitPrice : 0), heldUnits: Math.round(heldUnits), why: 'more than the rung needs' });
    }
    // SIPP money-market cash only: a CASH-wrapper line is bank money, kept outside the plan.
    cashHeld = sipp.filter((h) => h.cash).reduce((s, h) => s + h.value, 0);
    cashTarget = target.cash ? target.cash.value : 0;
    if (target.cash && target.cash.spending) {
      // The plan is running: the cash years are being spent as designed. Held vs target is information, not a move.
      cashInfo = { held: Math.round(cashHeld), target: Math.round(cashTarget), yearsLeft: Array.isArray(target.cash.yearsLeft) ? target.cash.yearsLeft.slice() : [] };
    } else if (target.cash) {
      targetTotal += cashTarget; heldOfTarget += Math.min(cashTarget, cashHeld); if (cashTarget > 0) targetCount++;
      // Spare SIPP cash before the start is never a sell (6.13.0): it is spending money or a float — held, with the spare
      // said. Only a shortfall (beyond tolerance) is a move.
      if (cashTarget > 0 && cashHeld >= cashTarget * (1 - tolerance)) hold.push({ ...target.cash, heldValue: Math.round(cashHeld), spare: Math.round(Math.max(0, cashHeld - cashTarget)) });
      else if (cashTarget > cashHeld) buy.push({ ...target.cash, amount: Math.round(cashTarget - cashHeld), heldValue: Math.round(cashHeld), why: 'the cash years' });
      // every cash year stood in for (7.6.0): the pension's cash is still held — all of it spare, never a sell
      else if (coveredCashMoney && cashHeld > 0) hold.push({ ...target.cash, heldValue: Math.round(cashHeld), spare: Math.round(cashHeld) });
      if (coveredCashMoney) { targetTotal += coveredCashMoney.target; heldOfTarget += coveredCashMoney.held; }
    }
    // Everything else in the SIPP funds the buys — unless the rotation has fired: the fund its proceeds bought IS the plan now.
    for (const h of sipp) if (!used.has(h) && !h.cash) {
      if (target.rotated && !h.gilt) keep.push({ ...h, why: 'bought by the rotation — kept' });
      else sell.push({ key: 'sell:' + (h.ticker || h.name), wrapper: 'SIPP', kind: h.gilt ? 'gilt' : 'fund', label: h.name || h.ticker, ticker: h.ticker, amount: Math.round(h.value), units: h.units, why: 'not in the plan — proceeds fund the ladder' });
    }
  } else if (target.kind === 'buckets') {
    // a pot plan has no rungs: a line kept to stand in for years is simply kept (7.6.0), like one kept by choice
    for (const h of L) if (h.keep && h.keep.as === 'rung') kept.push({ ...h, key: 'kept:' + h.wrapper + ':' + keyOfLine(h), label: h.name || h.ticker, fundsGaps: false, why: 'kept by you' });
    const held = { shares: 0, bonds: 0, cash: 0, diversifiers: 0 };
    for (const h of sipp) held[h.bucket || 'shares'] += h.value;
    cashHeld = held.cash;
    // A kept pension line is out of the mix's maths (7.7.0): it is neither counted in its bucket nor replaced. The plan's own
    // mix is then read on the pension money still in play (what is held less what is kept) — not on the pot the plan was
    // locked with, which may or may not have held the kept line: either way a pound kept would be asked to be bought again
    // in its bucket, or the bucket sold down. A record that keeps no pension line reads the plan's pot exactly as before.
    if (L.some((h) => h.keep && h.wrapper === 'SIPP')) {
      const inPlay = sipp.reduce((s, h) => s + h.value, 0);
      const pctSum = target.lines.reduce((s, t) => s + num(t.pct), 0) || 100;
      target = { ...target, lines: target.lines.map((t) => ({ ...t, value: Math.round(inPlay * num(t.pct) / pctSum) })) };
    }
    for (const t of target.lines) {
      const hv = held[t.bucket] || 0; const delta = t.value - hv;
      targetTotal += t.value; heldOfTarget += Math.min(t.value, hv); if (t.value > 0) targetCount++;
      if (t.bucket === 'cash') cashTarget = t.value;
      if (t.value > 0 && Math.abs(delta) <= tolerance * t.value) hold.push({ ...t, heldValue: Math.round(hv) });
      else if (delta > 0) buy.push({ ...t, amount: Math.round(delta), heldValue: Math.round(hv), why: 'bring ' + t.bucket + ' up to ' + t.pct + '% of the pot' });
      else if (t.value > 0 || hv > 0) sell.push({ ...t, amount: Math.round(-delta), heldValue: Math.round(hv), why: 'bring ' + t.bucket + ' down to ' + t.pct + '% of the pot' });
    }
    if (held.diversifiers > 0) sell.push({ key: 'bucket:diversifiers', wrapper: 'SIPP', kind: 'bucket', bucket: 'diversifiers', label: 'Diversifiers', amount: Math.round(held.diversifiers), why: 'not in the target mix' });
  }
  const buyCost = buy.reduce((s, b) => s + num(b.amount), 0), sellValue = sell.reduce((s, b) => s + num(b.amount), 0);
  // Complete = nothing to buy, nothing to sell, and every target that still counts is held (6.12). Said with a reason
  // so the page can say WHY it is (or is not) complete — a ladder with every remaining rung held reads "nothing to do".
  let complete = false, reason;
  if (target.kind === 'none') reason = 'no plan document to read against';
  else if (buy.length) reason = buy.length + ' line' + (buy.length === 1 ? '' : 's') + ' still to buy';
  else if (sell.length) reason = sell.length + ' line' + (sell.length === 1 ? '' : 's') + ' to sell';
  else if (hold.length + coveredCount < targetCount) reason = (targetCount - hold.length - coveredCount) + ' target line' + (targetCount - hold.length - coveredCount === 1 ? '' : 's') + ' not held';
  else if (targetCount === 0) { complete = true; reason = target.kind === 'ladder' ? 'every rung has matured and paid — nothing left to hold' : 'the target is empty'; }
  else if (anyKeep && target.kind === 'ladder') { complete = true; reason = 'every rung is held or covered by what you chose to keep' + (target.cash && !target.cash.spending ? ', and the cash years are covered' : ''); }
  else { complete = true; reason = target.kind === 'ladder' ? 'every rung the plan still needs is held' + (target.cash && !target.cash.spending ? ', and the cash years are covered' : '') : 'every bucket is within ' + Math.round(tolerance * 100) + '% of its target'; }
  return { kind: target.kind, buy, sell, hold, keep, matured, sold, cashInfo,
    totals: { buyCost: Math.round(buyCost), sellValue: Math.round(sellValue), shortfall: Math.round(Math.max(0, buyCost - sellValue)), cashHeld: Math.round(cashHeld), cashTarget: Math.round(cashTarget) },
    progressPct: targetTotal > 0 ? Math.round(100 * heldOfTarget / targetTotal) : (complete ? 100 : 0), complete, reason,
    // what the person keeps (7.6.0): only on a record that keeps something
    // and, on a ladder, the cash still to hold once the cash years stood in for come out (the move's "Cash to hold now")
    ...(anyKeep ? { standIn, kept, covered, ...(target.kind === 'ladder' && target.cash ? { cashLeft: target.cash } : {}) } : {}) };
}

/**
 * A dated schedule to the plan start: cash and near rungs first, sales in tranches, contributions before sales.
 * @param {ReturnType<typeof diffHoldings>} diff
 * @param {{ today?: Date, startYear: number, contributionsMonthly?: number, trancheMonths?: number, decisionPoint?: { when: string, label: string } }} o
 * @returns {{ steps: [{ when, action, wrapper, label, ticker, units, amount, why }], months, tranches, funded: boolean, note }}
 */
export function sequence(diff, { today = new Date(), startYear, startMonth = null, contributionsMonthly = 0, trancheMonths = 3, horizonMonths = 6 } = {}) {
  // The deadline is the retirement month when known (a future retiree), else 6 April of plan year 0. Once the
  // plan is already running there is no deadline: reconcile over a rolling horizon instead (6.10.5).
  let start;
  if (startMonth && /^\d{4}-\d{2}$/.test(startMonth)) { const [y, m] = startMonth.split('-').map(Number); start = new Date(y, m - 1, 1); }
  else start = new Date(+startYear || today.getFullYear() + 1, 3, 6);
  const startPassed = start.getTime() <= today.getTime();
  const months = startPassed ? Math.max(1, horizonMonths) : Math.max(1, Math.round((start.getTime() - today.getTime()) / (30.44 * 24 * 3600 * 1000)));
  const tranches = Math.max(1, Math.ceil(months / trancheMonths));
  const monthKey = (k) => { const d = new Date(today.getFullYear(), today.getMonth() + k, 1); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0'); };
  // Buy order: cash years first, then rungs by maturity, then buckets bonds → cash → shares
  const order = (b) => b.kind === 'cash' ? 0 : b.kind === 'gilt' ? 1 + (b.matures ? new Date(b.matures).getFullYear() / 10000 : 0.5) : b.bucket === 'bonds' ? 2 : b.bucket === 'cash' ? 2.5 : 3;
  const buys = diff.buy.slice().sort((a, b) => order(a) - order(b));
  const sells = diff.sell.slice().sort((a, b) => num(b.amount) - num(a.amount));
  const totalBuy = buys.reduce((s, b) => s + num(b.amount), 0);
  const totalSell = sells.reduce((s, b) => s + num(b.amount), 0);
  const contributions = num(contributionsMonthly) * months;
  const funded = totalSell + contributions >= totalBuy - 1;
  const steps = [];
  const perTranche = totalBuy / tranches;
  let bi = 0, remainingInBuy = buys.length ? num(buys[0].amount) : 0;
  for (let t = 0; t < tranches; t++) {
    const when = monthKey(t * trancheMonths);
    let budget = perTranche;
    // Sales for this tranche: the share of each sale not covered by contributions, spread evenly
    const contribThis = num(contributionsMonthly) * Math.min(trancheMonths, months - t * trancheMonths);
    let needFromSales = Math.max(0, budget - contribThis);
    for (const s of sells) { const part = Math.round(num(s.amount) / tranches); if (part > 0) steps.push({ when, action: 'sell', wrapper: s.wrapper, label: s.label, ticker: s.ticker || null, units: s.units ? Math.round(s.units / tranches) : null, amount: part, why: s.why }); }
    // Buys: walk the ordered list until this tranche's budget is used
    while (bi < buys.length && budget > 0) {
      const b = buys[bi];
      const take = Math.min(remainingInBuy, budget);
      const frac = num(b.amount) > 0 ? take / num(b.amount) : 1;
      steps.push({ when, action: 'buy', wrapper: b.wrapper, label: b.label, ticker: b.ticker || null, units: b.units ? Math.round(b.units * frac) : null, amount: Math.round(take), why: b.why });
      budget -= take; remainingInBuy -= take;
      if (remainingInBuy <= 0.5) { bi++; remainingInBuy = bi < buys.length ? num(buys[bi].amount) : 0; }
    }
  }
  return { steps, months, tranches, funded, startPassed, totals: { buy: Math.round(totalBuy), sell: Math.round(totalSell), contributions: Math.round(contributions) },
    note: funded ? 'Funded by sales' + (contributions > 0 ? ' and contributions' : '') + '.' : 'Short by ' + Math.round(totalBuy - totalSell - contributions).toLocaleString('en-GB') + ' — the plan was priced on a bigger pot than the ledger holds, or holdings are missing from the ledger.' };
}

/**
 * The tick-offs changed, as the planner's toggleTransitionDone changes them (6.43.0, lifted pure): the whole `transition`
 * object with one key set to the day the order was placed, or taken off. Never deleteField: the object is written whole.
 * @param {object|null} transition  the plan's `transition` ({ done: { [key]: 'YYYY-MM-DD' } }, or absent)
 */
export function tickMove(transition, key, dateIso) {
  const t = transition && typeof transition === 'object' ? transition : { done: {} };
  return { ...t, done: { ...(t.done && typeof t.done === 'object' ? t.done : {}), [key]: dateIso } };
}
export function untickMove(transition, key) {
  const t = transition && typeof transition === 'object' ? transition : { done: {} };
  const done = { ...(t.done && typeof t.done === 'object' ? t.done : {}) };
  delete done[key];
  return { ...t, done };
}

/** Progress and the next item, with tick-offs applied. */
export function progress(diff, done = {}) {
  const items = [...diff.buy.map((b) => ({ ...b, action: 'buy' })), ...diff.sell.map((s) => ({ ...s, action: 'sell' }))];
  const outstanding = items.filter((i) => !done[i.key]);
  const doneCount = items.length - outstanding.length;
  return { pct: items.length ? Math.round(100 * (diff.progressPct / 100 * 0 + (items.length - outstanding.length) / items.length)) : 100, held: diff.progressPct, doneCount, total: items.length, next: outstanding[0] || null };
}
