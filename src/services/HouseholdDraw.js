/**
 * Who draws what: the tax a couple saves by drawing together (research/household-draw-split.md, agreed
 * 12 Oct 2026; research/v7/v6-usability-audit.md §1 problem 8, §2.10 and §5 decision 5, option (a)).
 *
 * A couple with badly unequal pots pays far more tax than it needs to when each plan draws for itself: one pays 40%
 * while the other's tax-free allowance and 20% band go unused. This module works out, YEAR BY YEAR in today's prices,
 * the split of the household's after-tax spending that pays the least tax (section 9, decided 27 Oct 2026):
 *   - what is held fixed is the couple's take-home a year: the two plans' own, added up, or the sum typed (9.3);
 *   - every pound is compared (9.4): the household's net is filled from the cheapest place either person can draw it,
 *     the allowance, a quarter-tax-free pound in the 20% band, a taxed one, then the 40% band (each plan's ISA as its
 *     own policy draws it, never for the partner's pounds), ties broken for the plan's own draw, so two equal plans
 *     change nothing;
 *   - never more than a pot holds, and once the smaller pot is empty in the count its plan's draw falls to the bigger
 *     pension (9.5), so the tax table counts those years;
 *   - by default the smaller pot is kept until its owner's State Pension age (9.2: drawn evenly to it on what is left),
 *     the fast split (no limit) being the option; or a limit chosen ("keep B's pot until age X", "keep at least X").
 * The tax on every figure is the app's own sum (DrawdownStrategy.planDrawdown on TaxCalculator.grossToNet / netToGross):
 * the rows here ARE what planDrawdown pays for the targets the split sets, never a second tax rule.
 *
 * Output: each plan's income steps (gross, today's prices) for the comparison run, the per-year tax both ways, and the
 * words and figures of the headline (household-draw-split.md §4). Pure: no DOM, no storage, no engine — the strategy
 * runs that complete the table are the one test (strategies/stressTest.js stressTestStrategy, paired through
 * HouseholdService.combineHouseholdStrategies) and are read by comparisonFigures below.
 */

import { planDrawdown } from './DrawdownStrategy.js';
import { grossToNet, netToGross, calculateTax, taxKinks } from './TaxCalculator.js';
import { targetForYear, startOffset, spFor, isRetired } from './HouseholdService.js';
import { sippTodayOf, potScaleOf, isaTodayOrAtRetirement } from './PotsAtRetirement.js';
import { ISA_STRATEGIES } from './IsaDrawdown.js';
import { currentAgeNow } from '../utils/StatePensionUtils.js';
import { taxYearStartOf } from './PlanTiming.js';
import { simpleHash } from '../utils/MathUtils.js';
import { withoutPotsAsOf } from './PlanFromToday.js';
import { futuresOutOfTen } from './OneAnswer.js';

/** The headline shows when the first full year's saving is more than this (household-draw-split.md §2). */
export const SPLIT_HEADLINE_MIN = 1000;
/** Strategies whose income is bought as rungs: the comparison re-sizes the ladder to the lower draw (see ladderNote). */
export const LADDER_STRATEGIES = Object.freeze(['ladder-and-ratchet', 'bridge-and-engine', 'floor-and-flex', 'floor-the-schedule', 'floor-to-age', 'full-il-gilt', 'gilt-rotation']);
/** The normal minimum pension age rises from 55 to 57 on this day. */
export const PENSION_AGE_CHANGE = '2028-04-06';

const DEFAULT_BANDS = { pa: 12570, brl: 50270, hrl: 125140 };
const bandsOf = (s) => ({ pa: s.pa ?? DEFAULT_BANDS.pa, brl: s.brl ?? DEFAULT_BANDS.brl, hrl: s.hrl ?? DEFAULT_BANDS.hrl });
const ufplsFraction = (s, planYear) => ((s.accessMethod === 'ufpls' && (!s.ufplsYears || planYear < s.ufplsYears)) ? 0.25 : 0);
const potOf = (s) => {
  const prm = s.strategyParams || {};
  const pinned = s.strategyId && s.strategyId !== 'pots-and-valves' && +prm.sippTotal > 0 ? +prm.sippTotal : 0;
  return (pinned || sippTodayOf(s)) * potScaleOf(s).sipp;
};
const round = (v, to = 1) => Math.round((+v || 0) / to) * to;

/**
 * One person's plan, year by calendar year from today (year 0 = this tax year): whether the plan is drawing, its gross
 * target (today's money), its guaranteed income (State Pension, final-salary pension, other) and its way of drawing.
 */
export function personProfile(settings, { now = new Date(), years } = {}) {
  const s = settings || {};
  const dur = s.duration || 35;
  const off = startOffset(s, now);
  const sp = spFor(s, now);
  const startAge = +s.shapeAgeNow || 57;
  const yearsN = years ?? dur + off;
  const rows = [];
  for (let c = 0; c <= yearsN; c++) {
    const y = c - off;
    const working = y < 0 && !isRetired(s);
    const active = !working && y <= dur;
    const planYear = Math.max(0, y);
    const target = active ? targetForYear(s, planYear) : 0;
    const spNow = active && y >= sp.startYear ? sp.annual : 0;
    const db = active && +s.dbAmount > 0 && y >= (+s.dbStartYear || 0) ? +s.dbAmount : 0;
    const other = active ? (+s.other || 0) : 0;
    rows.push({ c, y, planYear, active, target, fixed: spNow + db + other, sp: spNow, db, other, f: ufplsFraction(s, planYear), age: startAge + y, yearsUntilSp: Math.max(0, sp.startYear - y) });
  }
  // A plan whose year 0 is behind it (a negative offset, 6.50.0): its years already lived, at the plan's own figures — so the
  // split's schedules keep them (never a £0 first step written by "Use this split") and the need by plan year has them.
  const lived = off < 0 ? Array.from({ length: -off }, (_, y) => {
    const spNow = y >= sp.startYear ? sp.annual : 0, db = +s.dbAmount > 0 && y >= (+s.dbStartYear || 0) ? +s.dbAmount : 0, other = +s.other || 0;
    return { y, target: targetForYear(s, y), fixed: spNow + db + other };
  }) : null;
  return {
    rows, dur, off, startAge, bands: bandsOf(s), isaStrategy: s.isaDrawdownStrategy || ISA_STRATEGIES.TAX_EFFICIENT, sp,
    ...(lived ? { lived } : {}),
    pot: potOf(s), isa: Math.max(0, +isaTodayOrAtRetirement(s) || 0),
    spAge: Number.isFinite(sp.startYear) && sp.annual > 0 ? startAge + sp.startYear : null,
    strategyId: s.strategyId || 'pots-and-valves', ladder: LADDER_STRATEGIES.includes(s.strategyId),
    spareGrowth: !!(s.strategyParams && s.strategyParams.spareGrowth)   // a gilt ladder's money left over in shares (6.35.0)
  };
}

/** What one person's own plan draws this year — planDrawdown on its own target (the app's withdrawal policy). */
function drawFor(P, r, targetGross, isaLeft) {
  const d = planDrawdown({ targetGross, fixedIncome: r.fixed, pa: P.bands.pa, brl: P.bands.brl, hrl: P.bands.hrl, isaBalance: isaLeft, strategy: P.isaStrategy, yearsUntilSp: r.yearsUntilSp, taxFreeFraction: r.f });
  return { gross: targetGross, sipp: d.sippGross, isa: d.isaDraw, taxable: d.taxable, tax: d.tax, net: d.net, isaLeft: d.remainingIsa };
}

/**
 * The most this person may take from the pot this year (gross). A pension may always pay what its own plan pays (that
 * plan's own run is the judge of that). The smaller pot — the one the split draws MORE from — is counted down at its real
 * value with no growth (today's prices, pessimistic by design): the extra stops when it is spent, and once it is EMPTY in
 * the count it pays nothing at all (§9.5: its plan's draw then falls to the bigger pension, at that pension's marginal
 * rate, so the tax table counts those years). A plan that never had a pension (an ISA alone) is not "emptied" by the
 * count: its draw stays its own, a fiction in both columns alike. The larger pot's draws are only ever lowered. A limit
 * names its pot and binds the extra: "keep the pot until 67" is drawn evenly to 67 on what is left and nothing extra
 * after; "keep at least £X" stops the extra at £X.
 */
function potCap(key, P, r, own, state, limit) {
  if (!r.active) return 0;
  const left = Math.max(0, state.potLeft[key]);
  if (key === state.smaller && left <= 1e-9) return P.pot > 0 ? 0 : own.sipp;
  if (limit && limit.who === key) {
    if (limit.kind === 'untilAge') return r.age >= +limit.age ? own.sipp : Math.max(own.sipp, left / Math.max(1, +limit.age - r.age));
    if (limit.kind === 'keepAtLeast') return Math.max(own.sipp, left - (+limit.amount || 0));
  }
  if (key !== state.smaller) return left > 1e-9 ? Infinity : own.sipp;   // the bigger pot, empty in the count too, pays its own plan's draw and no more
  return Math.max(own.sipp, left);
}

/** The slabs of taxable draw above the guaranteed income, each with its rate from the app's own tax sum. */
function slabsOf(P, r) {
  const { pa, brl, hrl } = P.bands;
  const edges = [...new Set([...taxKinks(pa, brl, hrl), brl].filter((k) => k > r.fixed))].sort((a, b) => a - b);
  const out = [];
  let lo = r.fixed;
  for (const hi of [...edges, lo + Math.max(edges[edges.length - 1] || 0, 1e6) + 1e6]) {
    if (hi <= lo) continue;
    const rate = (calculateTax(hi, pa, brl, hrl) - calculateTax(lo, pa, brl, hrl)) / (hi - lo);
    out.push({ lo: lo - r.fixed, hi: hi - r.fixed, rate, belowBand: hi <= brl + 1e-9 });
    lo = hi;
  }
  return out;
}
/** Net delivered by a taxable draw t for this person: the quarter tax-free comes on top of the taxed three quarters. */
const netOfTaxable = (P, r, t) => grossToNet(r.fixed + t, P.bands.pa, P.bands.brl, P.bands.hrl) - grossToNet(r.fixed, P.bands.pa, P.bands.brl, P.bands.hrl) + t * r.f / (1 - r.f);
/** Tax paid per £ of net a slab delivers (the quarter tax-free lowers it). */
const costOf = (rate, f) => { const eff = rate * (1 - f); return eff / Math.max(1e-9, 1 - eff); };

/**
 * One year drawn together (§9.4, every pound compared): each person starts at their plan's own draw (scaled to a typed
 * need, §9.3) and pounds move, one slab at a time, from the person whose next pound to drop costs more to the person whose
 * next pound to take costs less — the allowance (0p), a quarter-tax-free pound in the 20% band (15p), a taxed pound there
 * (20p), a quarter-tax-free pound in the 40% band (30p), a taxed one (40p), and so on — until no move saves a penny. The
 * pound a plan drops first is the one planDrawdown drops first when its target falls: a pound above the band, then an ISA
 * pound (0p: dropping it saves nothing, so a plan drawing on its ISA keeps its taxed pounds — the engine would), then a
 * pound in the band or the allowance; the pound a plan takes next is the next slab of its taxable draw, within its pot cap
 * (never into its ISA: an ISA pound spent for the partner today is a 40p pension pound later, which a year's count cannot
 * see). Equal costs never move, so two equal plans change nothing and equal-cost pounds never move between the two for
 * nothing. A pension empty in the count (§9.5), or drawn past its cap, hands the PENSION's pounds above the cap to the
 * other first, whatever that costs; its ISA is not the pension and goes on paying what the plan's own policy draws from
 * it. Returns each person's net and ISA draw, or null when even the two pots cannot meet the year (it then keeps its own
 * draws: the split never lowers the household's after-tax spending).
 */
function togetherYear(PA, PB, rA, rB, ownA, ownB, anchorA, anchorB, state, limit) {
  const persons = { a: { P: PA, r: rA, own: ownA }, b: { P: PB, r: rB, own: ownB } };
  const t = { a: anchorA.taxable, b: anchorB.taxable }, isa = { a: anchorA.isa, b: anchorB.isa };
  const cap = { a: potCap('a', PA, rA, ownA, state, limit), b: potCap('b', PB, rB, ownB, state, limit) };
  const capT = (k) => cap[k] * (1 - persons[k].r.f);                              // the most taxable draw the pot cap allows
  const slabs = { a: slabsOf(PA, rA), b: slabsOf(PB, rB) };
  const bandTop = (k) => Math.max(0, persons[k].P.bands.brl - persons[k].r.fixed);
  const netPerOf = (k, rate) => 1 / (1 - persons[k].r.f) - rate;
  /** The pound this plan would drop first: above the band, then the ISA, then the band or the allowance — or, when only the pension's pounds may go (`taxableOnly`), its taxable pound whatever the ISA holds. */
  const give = (k, taxableOnly = false) => {
    const { r } = persons[k];
    if (!r.active) return null;
    const aboveBand = t[k] > bandTop(k) + 1e-9;
    if (!taxableOnly && !aboveBand && isa[k] > 1e-9) return { kind: 'isa', k, cost: 0, room: isa[k], netPer: 1 };
    if (t[k] <= 1e-9) return null;
    const sl = slabs[k].find((s) => t[k] > s.lo + 1e-9 && t[k] <= s.hi + 1e-9) || slabs[k][slabs[k].length - 1];
    const lo = aboveBand ? Math.max(sl.lo, bandTop(k)) : sl.lo;
    return { kind: 'sipp', k, cost: costOf(sl.rate, r.f), room: Math.max(0, t[k] - lo), netPer: netPerOf(k, sl.rate) };
  };
  /**
   * The pound this plan can take next: the slab its taxable draw is in, within the pot cap. Above the band only when its ISA
   * is on hold or empty (or the move is forced): planDrawdown pays a target above the band from the ISA first, so a pound the
   * count priced at 40p would be an ISA pound spent for the partner — and the two columns would no longer draw on the same money.
   */
  const take = (k, forced = false) => {
    const { P, r } = persons[k];
    if (!r.active) return null;
    const room = capT(k) - t[k];
    const sl = slabs[k].find((s) => t[k] < s.hi - 1e-9);
    if (room <= 1e-9 || !sl) return null;
    if (!sl.belowBand && !forced && P.isaStrategy !== ISA_STRATEGIES.HOLD && state.isaLeft[k] > 1e-9) return null;
    return { kind: 'sipp', k, cost: costOf(sl.rate, r.f), room: Math.min(sl.hi - Math.max(sl.lo, t[k]), room), netPer: netPerOf(k, sl.rate) };
  };
  /** Move `net` of after-tax money from g's pound to tk's. */
  const move = (g, tk, net) => {
    if (g.kind === 'sipp') t[g.k] = Math.max(0, t[g.k] - net / g.netPer); else isa[g.k] = Math.max(0, isa[g.k] - net / g.netPer);
    t[tk.k] += net / tk.netPer;
  };
  // first what must move: a pension empty in the count, or drawn past its cap, hands its pounds above the cap to the other,
  // whatever it costs — only the pension's pounds: an ISA pound is not the pension's and stays with its plan (§9.5 moves the
  // pension's draw; the plan's own policy goes on drawing its ISA)
  for (const k of ['a', 'b']) {
    const o = k === 'a' ? 'b' : 'a';
    for (let guard = 0; guard < 40 && persons[k].r.active && t[k] > capT(k) + 1e-9; guard++) {
      const g = give(k, true);
      const tk = take(o, true);
      if (!g || !tk || g.room <= 1e-9) return null;
      const net = Math.min(g.room * g.netPer, tk.room * tk.netPer, (t[k] - capT(k)) * g.netPer);
      if (net <= 1e-9) return null;
      move(g, tk, net);
    }
  }
  // then every pound compared: the dearest pound to drop against the cheapest to take, until no move saves a penny
  for (let guard = 0; guard < 200; guard++) {
    let best = null;
    for (const [k, o] of [['a', 'b'], ['b', 'a']]) {
      const g = give(k), tk = take(o);
      if (!g || !tk || g.room <= 1e-9 || tk.room <= 1e-9) continue;
      const saving = g.cost - tk.cost;
      if (saving > 1e-6 && (!best || saving > best.saving)) best = { g, tk, saving };
    }
    if (!best) break;
    const net = Math.min(best.g.room * best.g.netPer, best.tk.room * best.tk.netPer);
    if (net <= 1e-9) break;
    move(best.g, best.tk, net);
  }
  const fixedNet = (k) => { const { P, r } = persons[k]; return grossToNet(r.fixed, P.bands.pa, P.bands.brl, P.bands.hrl); };
  return { netA: fixedNet('a') + netOfTaxable(PA, rA, t.a) + isa.a, netB: fixedNet('b') + netOfTaxable(PB, rB, t.b) + isa.b, isaA: isa.a, isaB: isa.b };
}

/**
 * The draw of a plan whose pension is empty in the count (§9.5): nothing from the pension, its ISA paying what the plan's
 * own policy draws from it while it lasts, the guaranteed income as it comes — the rest of its plan's draw is the other
 * pension's (togetherYear moved it there). planDrawdown cannot say this: it fills the band from a pension it does not know
 * is empty.
 */
function isaOnlyDraw(P, r, isaDraw, isaLeft) {
  const isa = Math.max(0, Math.min(isaDraw, isaLeft));
  const fixedNet = grossToNet(r.fixed, P.bands.pa, P.bands.brl, P.bands.hrl);
  return { gross: r.fixed + isa, sipp: 0, isa, taxable: r.fixed, tax: r.fixed - fixedNet, net: fixedNet + isa, isaLeft: isaLeft - isa };
}

/**
 * The default limit (§9.2): keep the smaller pot until its owner's State Pension age, drawn evenly to it on what is left.
 * When that State Pension is already in payment in the first year both plans draw (the age reached, or the plan beginning
 * after it) there is no bridge to keep the pot for, and the default is no limit: "until the State Pension age" would
 * otherwise let the smaller pension take nothing extra, ever.
 */
function defaultLimit(smaller, PA, PB) {
  const Ps = smaller === 'b' ? PB : PA, Po = smaller === 'b' ? PA : PB;
  const age = Ps.spAge || 67;
  const both = Ps.rows.find((r, c) => r.active && Po.rows[c] && Po.rows[c].active) || Ps.rows.find((r) => r.active) || null;
  if (both && both.age >= age) return { kind: 'none' };
  return { kind: 'untilAge', who: smaller, age };
}
const isNone = (limit) => !!limit && limit.kind === 'none';

/**
 * The split's count, year by year: the rows, the schedules, the tax both ways and the first full year. `limit` is the
 * limit that applies (null for none); `need` the household's after-tax need a year, or null for the two plans' own.
 */
function countSplit(PA, PB, years, { limit, need }) {
  const smaller = (PB.pot + PB.isa) <= (PA.pot + PA.isa) ? 'b' : 'a';
  const Psmall = smaller === 'b' ? PB : PA;
  const state = { potLeft: { a: PA.pot, b: PB.pot }, isaLeft: { a: PA.isa, b: PB.isa }, smaller };
  let isaOwnA = PA.isa, isaOwnB = PB.isa;
  const rows = [];
  const schedTogether = { a: [], b: [] }, schedOwn = { a: [], b: [] };
  // the years a started plan has already lived: its own figures, the same both ways (nothing can move in the past)
  for (const [P, k] of [[PA, 'a'], [PB, 'b']]) for (const l of P.lived || []) { schedOwn[k][l.y] = l.target; schedTogether[k][l.y] = l.target; }
  const fixedNetOf = (P, r) => grossToNet(r.fixed, P.bands.pa, P.bands.brl, P.bands.hrl);
  const anchorsOf = (rA, rB, ownA, ownB, N) => {   // where each person starts: their own draw, or (§9.3) the draws scaled to the typed need in proportion to their nets
    const asIs = (own, r) => ({ taxable: Math.max(0, own.taxable - r.fixed), isa: own.isa });
    if (need == null) return [asIs(ownA, rA), asIs(ownB, rB)];
    const fixedA = fixedNetOf(PA, rA), fixedB = fixedNetOf(PB, rB);
    const drawA = Math.max(0, ownA.net - fixedA), drawB = Math.max(0, ownB.net - fixedB);
    const x = Math.max(0, N - fixedA - fixedB);                                   // what the pots must pay after the money that comes anyway
    const shareA = drawA + drawB > 0 ? drawA / (drawA + drawB) : (smaller === 'b' ? 1 : 0);
    const at = (P, r, net, isaLeft) => { const d = drawFor(P, r, Math.max(0, netToGross(net, P.bands.pa, P.bands.brl, P.bands.hrl)), isaLeft); return { taxable: Math.max(0, d.taxable - r.fixed), isa: d.isa }; };
    return [rA.active ? at(PA, rA, fixedA + x * shareA, isaOwnA) : asIs(ownA, rA), rB.active ? at(PB, rB, fixedB + x * (1 - shareA), isaOwnB) : asIs(ownB, rB)];
  };
  for (let c = 0; c <= years; c++) {
    const rA = PA.rows[c], rB = PB.rows[c];
    const ownA = drawFor(PA, rA, rA.target, isaOwnA), ownB = drawFor(PB, rB, rB.target, isaOwnB);
    const written = ownA.net + ownB.net;
    const N = need != null ? need : written;
    const [anchorA, anchorB] = anchorsOf(rA, rB, ownA, ownB, N);
    const split = N > 0 ? togetherYear(PA, PB, rA, rB, ownA, ownB, anchorA, anchorB, state, limit) : null;
    isaOwnA = ownA.isaLeft; isaOwnB = ownB.isaLeft;
    // a person whose net is their own plan's keeps their own target (the gross-equivalent of a net below the guaranteed income is not a draw)
    const targetA = split ? (Math.abs(split.netA - ownA.net) < 0.005 ? rA.target : Math.max(0, netToGross(split.netA, PA.bands.pa, PA.bands.brl, PA.bands.hrl))) : rA.target;
    const targetB = split ? (Math.abs(split.netB - ownB.net) < 0.005 ? rB.target : Math.max(0, netToGross(split.netB, PB.bands.pa, PB.bands.brl, PB.bands.hrl))) : rB.target;
    // the smaller pension empty in the count (§9.5): its plan's draw is the ISA's while that lasts and the other pension's for the rest
    const emptied = split && Psmall.pot > 0 && state.potLeft[smaller] <= 1e-9;
    const togA = emptied && smaller === 'a' ? isaOnlyDraw(PA, rA, split.isaA, state.isaLeft.a) : drawFor(PA, rA, targetA, state.isaLeft.a);
    const togB = emptied && smaller === 'b' ? isaOnlyDraw(PB, rB, split.isaB, state.isaLeft.b) : drawFor(PB, rB, targetB, state.isaLeft.b);
    state.isaLeft.a = togA.isaLeft; state.isaLeft.b = togB.isaLeft;
    state.potLeft.a = Math.max(0, state.potLeft.a - togA.sipp); state.potLeft.b = Math.max(0, state.potLeft.b - togB.sipp);
    const own = { netA: ownA.net, netB: ownB.net, taxA: ownA.tax, taxB: ownB.tax, drawA: ownA.sipp, drawB: ownB.sipp, isaA: ownA.isa, isaB: ownB.isa, grossA: rA.target, grossB: rB.target, taxableA: ownA.taxable, taxableB: ownB.taxable };
    const together = { netA: togA.net, netB: togB.net, taxA: togA.tax, taxB: togB.tax, drawA: togA.sipp, drawB: togB.sipp, isaA: togA.isa, isaB: togB.isa, grossA: targetA, grossB: targetB, taxableA: togA.taxable, taxableB: togB.taxable };
    rows.push({ year: c, ageA: rA.age, ageB: rB.age, activeA: rA.active, activeB: rB.active, own, together, saving: (own.taxA + own.taxB) - (together.taxA + together.taxB), fallback: !split, left: { a: state.potLeft.a, b: state.potLeft.b } });
    if (rA.y >= 0 && rA.y <= PA.dur) { schedOwn.a[rA.y] = rA.target; schedTogether.a[rA.y] = targetA; }
    if (rB.y >= 0 && rB.y <= PB.dur) { schedOwn.b[rB.y] = rB.target; schedTogether.b[rB.y] = targetB; }
  }
  const fill = (arr, len) => Array.from({ length: len + 1 }, (_, y) => (arr[y] == null ? 0 : arr[y]));
  const schedules = { own: { a: fill(schedOwn.a, PA.dur), b: fill(schedOwn.b, PB.dur) }, together: { a: fill(schedTogether.a, PA.dur), b: fill(schedTogether.b, PB.dur) } };
  // nothing moved between the two while the smaller pot had money: what moves after it is empty in the count is forced (9.5), not the split's doing
  const unchanged = rows.every((r, i) => (i > 0 && rows[i - 1].left[smaller] <= 1e-9) || (Math.abs(r.saving) < 1 && Math.abs(r.own.grossA - r.together.grossA) < 1 && Math.abs(r.own.grossB - r.together.grossB) < 1));
  // the first full year: the first in which both plans draw and the split saves (before the second plan begins nothing can move;
  // a typed need lowers a lone plan's draw, which is not the split's doing), else the first that saves at all
  const first = rows.find((r) => r.activeA && r.activeB && r.saving > 1) || rows.find((r) => r.saving > 1) || null;
  const untilAge = Psmall.spAge || 67;
  // the calendar year the smaller's State Pension begins: "until 67" is the years BEFORE it (the bridge), that year not among them
  const untilC = Math.max(0, Math.min(years, untilAge - Psmall.startAge + Psmall.off));
  const sum = (sel, before = years + 1) => rows.reduce((t, r) => t + (r.year < before ? sel(r) : 0), 0);
  const tax = {
    firstYear: first ? { own: first.own.taxA + first.own.taxB, together: first.together.taxA + first.together.taxB, year: first.year } : null,
    until: { own: sum((r) => r.own.taxA + r.own.taxB, untilC), together: sum((r) => r.together.taxA + r.together.taxB, untilC) },
    whole: { own: sum((r) => r.own.taxA + r.own.taxB), together: sum((r) => r.together.taxA + r.together.taxB) }
  };
  const goneRow = Psmall.pot > 0 ? rows.find((r) => r.left[smaller] <= 1e-9) : null;
  return { smaller, rows, schedules, unchanged, first, untilAge, untilC, tax, saving: { year: first ? first.saving : 0, until: tax.until.own - tax.until.together, whole: tax.whole.own - tax.whole.together }, goneAt: goneRow ? goneRow[smaller === 'b' ? 'ageB' : 'ageA'] : null };
}

/**
 * The split, year by year (today's prices), with each plan's income steps for the comparison run and the per-year tax
 * both ways. `a` is this plan (you), `b` the partner's.
 * @param {{ settings: object, name?: string }} a
 * @param {{ settings: object, name?: string }} b
 * @param {{ limit?: object|null, need?: number|null, now?: Date }} [o]
 *   limit   null → the default limit (§9.2: keep the smaller pot until its owner's State Pension age — no limit when that
 *           State Pension is already in payment); { kind: 'none' } → no limit (the fast split); { kind: 'untilAge', age } or
 *           { kind: 'keepAtLeast', amount } as chosen. A limit is always the smaller pension's, whichever side it is given on
 *           (`who` is set here, not read).
 *   need    what the couple needs after tax a year, today's prices (§9.3), or null for the two plans' own take-home added up
 * The result says which limit applied (`limit`, `limitDefaulted`) and, under a default limit that binds, what the fast split
 * would do from the count alone (`fast`: its saving in the same first year and until the smaller's State Pension age, and the
 * age the smaller pot is empty in the count; null when the default is already no limit).
 */
export function householdDrawSplit(a, b, { limit = null, need = null, now = new Date() } = {}) {
  const sA = a.settings || {}, sB = b.settings || {};
  const nameA = a.name || 'You', nameB = b.name || 'Partner';
  const PA = personProfile(sA, { now }), PB = personProfile(sB, { now });
  const years = Math.max(PA.rows.length, PB.rows.length) - 1;
  if (PA.rows.length - 1 < years) PA.rows.push(...personProfile(sA, { now, years }).rows.slice(PA.rows.length));
  if (PB.rows.length - 1 < years) PB.rows.push(...personProfile(sB, { now, years }).rows.slice(PB.rows.length));
  const smaller = (PB.pot + PB.isa) <= (PA.pot + PA.isa) ? 'b' : 'a';
  const typed = Number.isFinite(+need) && +need > 0 ? +need : null;
  const limitDefaulted = limit == null;
  // a chosen limit is the smaller pension's whichever side it names: a limit on the larger pot would leave the smaller one unlimited
  const applied = limitDefaulted ? defaultLimit(smaller, PA, PB) : (limit.kind === 'untilAge' || limit.kind === 'keepAtLeast') ? { ...limit, who: smaller } : limit;
  const c = countSplit(PA, PB, years, { limit: isNone(applied) ? null : applied, need: typed });
  const { rows, schedules, unchanged, first, untilAge, untilC, tax } = c;
  const steps = { a: stepsFromSchedule(schedules.together.a, PA.startAge), b: stepsFromSchedule(schedules.together.b, PB.startAge) };
  // the fast split (§9.2): the same count with no limit, only when a default limit applied — its saving in the paced split's first year
  let fast = null;
  if (limitDefaulted && !isNone(applied)) {
    const f = countSplit(PA, PB, years, { limit: null, need: typed });
    const year = first ? f.rows[first.year].saving : f.saving.year;
    fast = { saving: { year, until: f.saving.until, whole: f.saving.whole }, goneAt: f.goneAt };
  }
  const savingYear = c.saving.year;
  const applies = !unchanged && (savingYear > SPLIT_HEADLINE_MIN || !!(fast && fast.saving.year > SPLIT_HEADLINE_MIN));
  // the baseline (§9.1): the couple's take-home a year, the same both ways unless a need was typed; and what the smaller pension's figure is made of
  const base = first || rows.find((r) => r.activeA || r.activeB) || rows[0];
  const S = smaller.toUpperCase(), L = (smaller === 'b' ? 'a' : 'b').toUpperCase();
  const baseline = base ? { year: base.year, net: base.together.netA + base.together.netB, written: base.own.netA + base.own.netB, typed } : { year: 0, net: 0, written: 0, typed };
  const madeOf = base ? { year: base.year, pays: base.together['draw' + S], own: base.own['draw' + S], moved: base.together['draw' + S] - base.own['draw' + S], stops: base.own['draw' + L] - base.together['draw' + L] } : null;
  return {
    names: { a: nameA, b: nameB }, smaller, larger: smaller === 'b' ? 'a' : 'b', untilAge, untilC,
    rows, steps, schedules, unchanged, limit: applied, limitDefaulted, need: typed, fast, baseline, madeOf, goneAt: c.goneAt,
    applies,
    saving: { year: savingYear, until: c.saving.until, whole: c.saving.whole },
    tax,
    profiles: { a: PA, b: PB },
    pots: { a: PA.pot + PA.isa, b: PB.pot + PB.isa },
    settings: { a: settingsWithSchedule(sA, schedules.together.a, steps.a), b: settingsWithSchedule(sB, schedules.together.b, steps.b) },
    needs: {
      own: { a: needByYear(schedules.own.a, PA), b: needByYear(schedules.own.b, PB) },
      together: { a: needByYear(schedules.together.a, PA), b: needByYear(schedules.together.b, PB) }
    },
    unused: first ? unusedWords(first, PA, PB, smaller) : null,
    note2028: pensionAgeNote(rows, { a: sA, b: sB }, { a: nameA, b: nameB }, now),
    ladderNote: ladderNote({ a: PA, b: PB }, { a: nameA, b: nameB }),
    fingerprint: splitFingerprint(sA, sB)
  };
}

/** Income steps ("from age X take £Y") from a per-plan-year schedule: a new step wherever the amount changes. */
export function stepsFromSchedule(schedule, startAge) {
  const steps = [];
  (schedule || []).forEach((v, y) => {
    const amount = round(v);
    if (!steps.length || Math.abs(steps[steps.length - 1].amount - amount) >= 1) steps.push({ fromAge: startAge + y, amount });
  });
  return steps;
}

/** The plan's settings with the split's schedule as its income shape (what "Use this split" writes, and what the comparison runs). */
export function settingsWithSchedule(settings, schedule, steps) {
  const sched = (schedule || []).map((v) => round(v));
  return { ...settings, incomeShape: 'phases', incomeSteps: steps, targetSchedule: sched, baseSalary: sched[0] || 0, spendingProfile: 'flat' };
}

/** Each plan year's draw need (gross, net of guaranteed income) — what the pooled verdict asks the other pot to cover. */
function needByYear(schedule, P) {
  // a year a started plan has already lived (y + off < 0) is read from its own lived figures
  return schedule.map((v, y) => { const r = (y + P.off < 0 && P.lived ? P.lived[y] : null) || P.rows[y + P.off] || P.rows[P.rows.length - 1]; return Math.max(0, v - (r ? r.fixed : 0)); });
}

function unusedWords(first, PA, PB, smaller) {
  const big = smaller === 'b' ? 'a' : 'b';
  const Pb = big === 'a' ? PA : PB, Ps = smaller === 'a' ? PA : PB;
  const over = Math.max(0, first.own['taxable' + big.toUpperCase()] - Pb.bands.brl);
  const used = first.own['taxable' + smaller.toUpperCase()];
  const allowanceUnused = Math.max(0, Ps.bands.pa - used);
  const bandUnused = Math.max(0, Ps.bands.brl - Math.max(Ps.bands.pa, used));
  return { over, allowanceUnused, bandUnused, bandMost: bandUnused > 0.5 * (Ps.bands.brl - Ps.bands.pa) };
}

/**
 * The ladder note (household-draw-split.md §8): the comparison prices a bought income at the lower draw, as if bought
 * that way today. On a gilt ladder the money that frees is the ladder's money left over: kept, holding its value, or in
 * shares when the plan says so (strategyParams.spareGrowth, 6.35.0). One sentence per plan, true for its own strategy.
 */
export function ladderNote(profiles, names) {
  return ['a', 'b'].filter((k) => profiles[k].ladder).map((k) => {
    const P = profiles[k], n = names[k];
    if (P.strategyId === 'floor-the-schedule' || P.strategyId === 'floor-to-age') return n + '’s plan buys its income' + (P.strategyId === 'floor-to-age' ? ' to an age' : '') + ': the comparison prices it at the lower draw, as if it were bought that way today.';
    if (P.strategyId !== 'full-il-gilt' && P.strategyId !== 'gilt-rotation') return n + '’s plan buys part of its income and invests the rest: the comparison runs it at the lower draw, as if it were set up that way today.';
    return n + '’s plan is a gilt ladder: the comparison sizes the ladder to the lower draw, as if the rungs not needed were sold today. '
      + (P.spareGrowth ? 'The money that frees joins the money left over in shares, as the plan is set.' : 'The money that frees stays as cash in the pension, holding its value — Stress tester → Settings → "Money left over" can put it in shares.');
  }).join(' ');
}

/**
 * The 2028 words (household-draw-split.md §4): someone 55 or 56 on 6 April 2028 whose pot is drawn before then.
 * @returns {string} '' when it does not apply
 */
export function pensionAgeNote(rows, settings, names, now = new Date()) {
  const change = new Date(PENSION_AGE_CHANGE + 'T00:00:00Z');
  if (now >= change) return '';
  const ty = taxYearStartOf(now);
  const lastC = 2027 - ty;   // calendar years (from this tax year) that begin before 6 April 2028
  const out = [];
  for (const k of ['a', 'b']) {
    const ageNow = currentAgeNow(settings[k] || {}, now);
    if (!(ageNow > 0)) continue;
    const ageThen = Math.floor(ageNow + (change - now) / (365.25 * 24 * 3600 * 1000));
    if (ageThen !== 55 && ageThen !== 56) continue;
    const draws = rows.some((r) => r.year <= lastC && (r.together['draw' + k.toUpperCase()] > 0 || r.own['draw' + k.toUpperCase()] > 0));
    if (!draws) continue;
    out.push(names[k] + ' will be ' + ageThen + ' on 6 April 2028: take the months up to the 57th birthday in one go before then (or check whether the scheme gives a protected pension age).');
  }
  return out.join(' ');
}

/**
 * What "Keep things as they are" is dismissed against: both plans' settings as they stand — as saved, without the position
 * a locked plan's loaded copy carries (PlanFromToday.lockedPotsAsOf), so a choice made before it stays made.
 */
export function splitFingerprint(settingsA, settingsB) {
  return String(simpleHash([withoutPotsAsOf(settingsA || {}), withoutPotsAsOf(settingsB || {})]));
}

/**
 * The limit a person set, read from a form: 'none' is no limit (the fast split, { kind: 'none' }); an absent choice is
 * null, which householdDrawSplit takes as the default limit (section 9.2); else { kind, age | amount }. A limit is always
 * the smaller pension's: householdDrawSplit names it, so no side is guessed here.
 */
export function limitFrom({ kind, age, amount } = {}) {
  if (kind === 'none') return { kind: 'none' };
  if (kind === 'untilAge' && +age > 0) return { kind, age: +age };
  if (kind === 'keepAtLeast' && +amount > 0) return { kind, amount: +amount };
  return null;
}

// ---- The figures of the table: the split's own rows plus the paired strategy runs both ways ---------------------------

const at = (arr, i) => (Array.isArray(arr) && arr.length ? arr[Math.max(0, Math.min(arr.length - 1, i))] : null);
/**
 * A plan's middling wealth at an age: its wealth cone's p50 at that plan year (null before the plan begins). A started
 * plan's test runs from today (a negative offset, 6.50.0): its cone's year 0 is the plan year it has reached, and an age
 * already behind it has no figure.
 */
export function potAtAge(r, P, age) {
  const lived = Math.max(0, -(P.off || 0));
  const y = age - P.startAge - lived;
  if (y < 0 || !r || !r.cones || !r.cones.wealth) return null;
  return at(r.cones.wealth.p50, Math.min(y, P.dur - lived));
}

/**
 * Every figure the headline and the table show (household-draw-split.md §4), from the split and the two paired runs.
 * @param {object} split    householdDrawSplit's result
 * @param {{ own: { combined, rA, rB }, together: { combined, rA, rB } }} runs   each way: combineHouseholdStrategies +
 *   each plan's stressTestStrategy result (ruin, cones.wealth.p50, terminal)
 * @param {{ ages?: number[] }} [o]
 */
export function comparisonFigures(split, runs, { ages = [67, 75, 90] } = {}) {
  const PA = split.profiles.a, PB = split.profiles.b;
  const way = (w) => {
    const r = runs[w] || {};
    const cmb = r.combined || {};
    const share = cmb.pooled ? cmb.pooled.success : cmb.jointSuccess;
    const c90 = 90 - PA.startAge + PA.off;
    const fan = at(cmb.potFan, c90);
    return {
      lasts: { household: futuresOutOfTen(share || 0), a: futuresOutOfTen(r.rA ? 1 - (r.rA.ruin?.mc || 0) / 100 : 0), b: futuresOutOfTen(r.rB ? 1 - (r.rB.ruin?.mc || 0) / 100 : 0), pooled: cmb.pooled || null, shareHousehold: share || 0 },
      potA: ages.map((age) => potAtAge(r.rA, PA, age)), potB: ages.map((age) => potAtAge(r.rB, PB, age)),
      left90: fan ? { p50: fan.p50, p10: fan.p10 } : null,
      smallerAtUntil: potAtAge(split.smaller === 'b' ? r.rB : r.rA, split.smaller === 'b' ? PB : PA, split.untilAge)
    };
  };
  const own = way('own'), together = way('together');
  return {
    ages, own, together,
    tax: split.tax,
    betterOff90: own.left90 && together.left90 ? together.left90.p50 - own.left90.p50 : null,
    cost: { own: own.smallerAtUntil, together: together.smallerAtUntil }
  };
}

/** "about £12,800": yearly figures to the nearest £100, pots and totals to the nearest £1,000 (over £100,000: £10,000). */
export function about(v) {
  const n = Math.abs(+v || 0);
  const to = n >= 100000 ? 10000 : n >= 20000 ? 1000 : 100;
  return '£' + round(n, to).toLocaleString('en-GB');
}

/**
 * The words of the headline (household-draw-split.md §4), as plain text parts the view lays out. Every figure is from
 * the split or the runs. `fig` may be null while the runs are still going: the first two lines stand on the split alone.
 */
export function headlineWords(split, fig = null) {
  const nm = split.names, small = split.smaller, big = split.larger;
  const u = split.unused || {};
  const bandWords = u.bandMost ? 'most of ' + nm[small] + '’s 20% band' : '£' + round(u.bandUnused).toLocaleString('en-GB') + ' of ' + nm[small] + '’s 20% band';
  return {
    // no bridge (the smaller's State Pension already in payment when the count begins): the whole plan's figure, not "by the time … is 68"
    headline: 'Drawing together saves about ' + about(split.saving.year) + ' a year in tax — about ' + (split.untilC === 0 ? about(split.saving.whole) + ' over the whole plan.' : about(split.saving.until) + ' by the time ' + nm[small] + ' is ' + split.untilAge + '.'),
    why: 'Your pots are very unequal (' + about(split.pots.a) + ' and ' + about(split.pots.b) + '). When each of you draws for your own plan, ' + nm[big] + ' pays 40% on ' + about(u.over) + ' a year while £' + round(u.allowanceUnused).toLocaleString('en-GB') + ' of ' + nm[small] + '’s tax-free allowance and ' + bandWords + ' go unused.',
    cost: fig && fig.cost.together != null && fig.cost.own != null
      ? 'The cost: ' + nm[small] + '’s pot is spent as the bridge to the State Pension: about ' + about(fig.cost.together) + ' at ' + split.untilAge + ' in a middling case, instead of about ' + about(fig.cost.own) + ' if each of you draws for your own plan.'
      : 'The cost: ' + nm[small] + '’s pot is spent as the bridge to the State Pension.',
    closing: fig && fig.betterOff90 != null
      ? 'Paying the tax keeps ' + nm[small] + '’s pot, and your money more separate. Drawing together leaves the household about ' + about(fig.betterOff90) + (fig.betterOff90 >= 0 ? ' better off' : ' worse off') + ' at 90. This is your choice; neither is wrong.'
      : 'Paying the tax keeps ' + nm[small] + '’s pot, and your money more separate. This is your choice; neither is wrong.',
    note2028: split.note2028, ladderNote: split.ladderNote
  };
}
