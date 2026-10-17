/**
 * Who draws what: the tax a couple saves by drawing together (research/household-draw-split.md, owner-approved
 * 12 Oct 2026; research/v7/v6-usability-audit.md §1 problem 8, §2.10 and §5 decision 5, option (a)).
 *
 * A couple with badly unequal pots pays far more tax than it needs to when each plan draws for itself: one pays 40%
 * while the other's tax-free allowance and 20% band go unused. This module works out, YEAR BY YEAR in today's prices,
 * the split of the household's after-tax spending that pays the least tax while keeping each person's own plan where
 * it already fits:
 *   1. each person's own draw is kept, capped at the top of their 20% band (the part they would pay 40% on moves);
 *   2. what moved is taken by the other person in their unused allowance and 20% band — a quarter tax-free where
 *      their way of drawing gives it (accessMethod 'ufpls') — their ISA next, the cheapest first;
 *   3. only what no band room can take goes back above the 20% band, to whoever it came from (so two equal plans
 *      change nothing), then to the bigger pot;
 *   and never more than a pot holds, nor past an optional limit ("keep B's pot until age X": drawn evenly to that age,
 *   then nothing; "keep at least £X in B's pot").
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
  return {
    rows, dur, off, startAge, bands: bandsOf(s), isaStrategy: s.isaDrawdownStrategy || ISA_STRATEGIES.TAX_EFFICIENT, sp,
    pot: potOf(s), isa: Math.max(0, +isaTodayOrAtRetirement(s) || 0),
    spAge: Number.isFinite(sp.startYear) && sp.annual > 0 ? startAge + sp.startYear : null,
    strategyId: s.strategyId || 'pots-and-valves', ladder: LADDER_STRATEGIES.includes(s.strategyId)
  };
}

/** What one person's own plan draws this year — planDrawdown on its own target (the app's withdrawal policy). */
function drawFor(P, r, targetGross, isaLeft) {
  const d = planDrawdown({ targetGross, fixedIncome: r.fixed, pa: P.bands.pa, brl: P.bands.brl, hrl: P.bands.hrl, isaBalance: isaLeft, strategy: P.isaStrategy, yearsUntilSp: r.yearsUntilSp, taxFreeFraction: r.f });
  return { gross: targetGross, sipp: d.sippGross, isa: d.isaDraw, taxable: d.taxable, tax: d.tax, net: d.net, isaLeft: d.remainingIsa };
}

/**
 * The most this person may take from the pot this year (gross). A person may always take what their own plan draws
 * (their own run is the judge of that). The smaller pot — the one the split draws MORE from — is counted down at its
 * real value with no growth (today's prices, pessimistic by design), and the extra stops when it is spent, so the split
 * never draws more than it holds; the larger pot's draws are only ever lowered. A limit names its pot and binds its own
 * draws too: "keep the pot until 67" is drawn evenly to 67 and nothing after; "keep at least £X" stops at £X.
 */
function potCap(key, P, r, own, state, limit) {
  if (!r.active) return 0;
  const left = Math.max(0, state.potLeft[key]);
  if (limit && limit.who === key) {
    if (limit.kind === 'untilAge') return r.age >= +limit.age ? 0 : left / Math.max(1, +limit.age - r.age);
    if (limit.kind === 'keepAtLeast') return Math.max(0, left - (+limit.amount || 0));
  }
  return key === state.smaller ? Math.max(own.sipp, left) : Infinity;
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
 * One year drawn together: the household's net this year (the two own plans' nets) split as the rule says. Returns each
 * person's taxable draw, ISA draw and net, or null when even the two pots cannot meet it (the year then keeps its own
 * draws — the split never lowers the household's after-tax spending).
 */
function togetherYear(PA, PB, rA, rB, ownA, ownB, state, limit) {
  const persons = { a: { P: PA, r: rA, own: ownA }, b: { P: PB, r: rB, own: ownB } };
  const N = ownA.net + ownB.net;
  const t = { a: 0, b: 0 }, isa = { a: 0, b: 0 };
  const cap = { a: potCap('a', PA, rA, ownA, state, limit), b: potCap('b', PB, rB, ownB, state, limit) };
  const taxCap = (k) => Math.max(0, cap[k] * (1 - persons[k].r.f) - t[k]);   // taxable room left under the pot cap
  const netNow = () => netOfTaxable(PA, rA, t.a) + isa.a + netOfTaxable(PB, rB, t.b) + isa.b + grossToNet(rA.fixed, PA.bands.pa, PA.bands.brl, PA.bands.hrl) + grossToNet(rB.fixed, PB.bands.pa, PB.bands.brl, PB.bands.hrl);
  // 1. own draws, capped at the top of the 20% band (and the pot)
  for (const k of ['a', 'b']) {
    const { P, r, own } = persons[k];
    const room = Math.max(0, P.bands.brl - r.fixed);
    t[k] = Math.min(Math.max(0, own.taxable - r.fixed), room, taxCap(k));
    isa[k] = Math.min(own.isa, Math.max(0, state.isaLeft[k]));
  }
  // 2. what moved: the other's unused allowance and 20% band, then an ISA — the cheapest first
  const slabs = { a: slabsOf(PA, rA), b: slabsOf(PB, rB) };
  const nextSlab = (k, belowOnly) => {
    const { r, P } = persons[k];
    if (!r.active) return null;
    const isaRoom = (P.isaStrategy === ISA_STRATEGIES.HOLD) ? 0 : Math.max(0, state.isaLeft[k] - isa[k]);
    for (const sl of slabs[k]) {
      if (belowOnly && !sl.belowBand) break;
      if (t[k] < sl.hi - 1e-9) {
        const room = Math.min(sl.hi - Math.max(sl.lo, t[k]), taxCap(k));
        if (room > 1e-9) return { kind: 'sipp', k, rate: sl.rate, cost: costOf(sl.rate, r.f), room, netPer: 1 / (1 - r.f) - sl.rate };
        if (!sl.belowBand) return null;   // over the band and the pot is spent
      }
    }
    if (isaRoom > 1e-9) return { kind: 'isa', k, rate: 0, cost: 0, room: isaRoom, netPer: 1 };
    return null;
  };
  const take = (slab, netNeed) => {
    const amount = Math.min(slab.room, netNeed / slab.netPer);
    if (slab.kind === 'sipp') t[slab.k] += amount; else isa[slab.k] += amount;
    return amount * slab.netPer;
  };
  let short = N - netNow();
  for (let guard = 0; short > 0.005 && guard < 40; guard++) {
    const cands = ['a', 'b'].map((k) => nextSlab(k, true)).filter(Boolean);
    if (!cands.length) break;
    cands.sort((x, y) => x.cost - y.cost || (persons[y.k].P.pot - persons[x.k].P.pot));
    short -= take(cands[0], short);
  }
  // 3. what no band room can take: back above the band to whoever it came from, then to the bigger pot
  if (short > 0.005) {
    const order = ['a', 'b'].sort((x, y) => persons[y].P.pot - persons[x].P.pot);
    for (const k of order) {
      const { P, r, own } = persons[k];
      const ownAbove = Math.max(0, own.taxable - P.bands.brl);
      if (!(ownAbove > 0) || short <= 0.005) continue;
      const base = Math.max(t[k], Math.max(0, P.bands.brl - r.fixed));
      const want = Math.min(ownAbove, taxCap(k) - (base - t[k]));
      if (want <= 0) continue;
      const before = netOfTaxable(P, r, t[k]);
      t[k] = base + want;
      let got = netOfTaxable(P, r, t[k]) - before;
      if (got > short) {   // only part of the own excess is needed: find the taxable that gives exactly `short`
        let lo = base, hi = t[k];
        for (let i = 0; i < 60; i++) { const mid = (lo + hi) / 2; if (netOfTaxable(P, r, mid) - before < short) lo = mid; else hi = mid; }
        t[k] = hi; got = netOfTaxable(P, r, t[k]) - before;
      }
      short -= got;
    }
    for (let guard = 0; short > 0.005 && guard < 40; guard++) {
      const cands = ['a', 'b'].map((k) => nextSlab(k, false)).filter(Boolean);
      if (!cands.length) break;
      cands.sort((x, y) => x.cost - y.cost || (persons[y.k].P.pot - persons[x.k].P.pot));
      short -= take(cands[0], short);
    }
  }
  if (short > 1) return null;   // neither pot can pay: this year keeps its own draws
  const netA = grossToNet(rA.fixed, PA.bands.pa, PA.bands.brl, PA.bands.hrl) + netOfTaxable(PA, rA, t.a) + isa.a;
  const netB = grossToNet(rB.fixed, PB.bands.pa, PB.bands.brl, PB.bands.hrl) + netOfTaxable(PB, rB, t.b) + isa.b;
  return { netA, netB };
}

/**
 * The split, year by year (today's prices), with each plan's income steps for the comparison run and the per-year tax
 * both ways. `a` is this plan (you), `b` the partner's.
 * @param {{ settings: object, name?: string }} a
 * @param {{ settings: object, name?: string }} b
 * @param {{ limit?: { kind: 'untilAge', who: 'a'|'b', age: number } | { kind: 'keepAtLeast', who: 'a'|'b', amount: number } | null, now?: Date }} [o]
 */
export function householdDrawSplit(a, b, { limit = null, now = new Date() } = {}) {
  const sA = a.settings || {}, sB = b.settings || {};
  const nameA = a.name || 'You', nameB = b.name || 'Partner';
  const PA = personProfile(sA, { now }), PB = personProfile(sB, { now });
  const years = Math.max(PA.rows.length, PB.rows.length) - 1;
  if (PA.rows.length - 1 < years) PA.rows.push(...personProfile(sA, { now, years }).rows.slice(PA.rows.length));
  if (PB.rows.length - 1 < years) PB.rows.push(...personProfile(sB, { now, years }).rows.slice(PB.rows.length));
  const smaller = (PB.pot + PB.isa) <= (PA.pot + PA.isa) ? 'b' : 'a';
  const state = { potLeft: { a: PA.pot, b: PB.pot }, isaLeft: { a: PA.isa, b: PB.isa }, smaller };
  let isaOwnA = PA.isa, isaOwnB = PB.isa;
  const rows = [];
  const schedTogether = { a: [], b: [] }, schedOwn = { a: [], b: [] };
  for (let c = 0; c <= years; c++) {
    const rA = PA.rows[c], rB = PB.rows[c];
    const ownA = drawFor(PA, rA, rA.target, isaOwnA), ownB = drawFor(PB, rB, rB.target, isaOwnB);
    isaOwnA = ownA.isaLeft; isaOwnB = ownB.isaLeft;
    const split = togetherYear(PA, PB, rA, rB, ownA, ownB, state, limit);
    const targetA = split ? Math.max(0, netToGross(split.netA, PA.bands.pa, PA.bands.brl, PA.bands.hrl)) : rA.target;
    const targetB = split ? Math.max(0, netToGross(split.netB, PB.bands.pa, PB.bands.brl, PB.bands.hrl)) : rB.target;
    const togA = drawFor(PA, rA, targetA, state.isaLeft.a), togB = drawFor(PB, rB, targetB, state.isaLeft.b);
    state.isaLeft.a = togA.isaLeft; state.isaLeft.b = togB.isaLeft;
    state.potLeft.a = Math.max(0, state.potLeft.a - togA.sipp); state.potLeft.b = Math.max(0, state.potLeft.b - togB.sipp);
    const own = { netA: ownA.net, netB: ownB.net, taxA: ownA.tax, taxB: ownB.tax, drawA: ownA.sipp, drawB: ownB.sipp, isaA: ownA.isa, isaB: ownB.isa, grossA: rA.target, grossB: rB.target, taxableA: ownA.taxable, taxableB: ownB.taxable };
    const together = { netA: togA.net, netB: togB.net, taxA: togA.tax, taxB: togB.tax, drawA: togA.sipp, drawB: togB.sipp, isaA: togA.isa, isaB: togB.isa, grossA: targetA, grossB: targetB, taxableA: togA.taxable, taxableB: togB.taxable };
    rows.push({ year: c, ageA: rA.age, ageB: rB.age, activeA: rA.active, activeB: rB.active, own, together, saving: (own.taxA + own.taxB) - (together.taxA + together.taxB), fallback: !split });
    if (rA.y >= 0 && rA.y <= PA.dur) { schedOwn.a[rA.y] = rA.target; schedTogether.a[rA.y] = targetA; }
    if (rB.y >= 0 && rB.y <= PB.dur) { schedOwn.b[rB.y] = rB.target; schedTogether.b[rB.y] = targetB; }
  }
  const fill = (arr, len) => Array.from({ length: len + 1 }, (_, y) => (arr[y] == null ? 0 : arr[y]));
  const schedules = { own: { a: fill(schedOwn.a, PA.dur), b: fill(schedOwn.b, PB.dur) }, together: { a: fill(schedTogether.a, PA.dur), b: fill(schedTogether.b, PB.dur) } };
  const steps = { a: stepsFromSchedule(schedules.together.a, PA.startAge), b: stepsFromSchedule(schedules.together.b, PB.startAge) };
  const unchanged = rows.every((r) => Math.abs(r.saving) < 1 && Math.abs(r.own.grossA - r.together.grossA) < 1 && Math.abs(r.own.grossB - r.together.grossB) < 1);
  const first = rows.find((r) => r.saving > 1) || null;
  const Psmall = smaller === 'b' ? PB : PA;
  const untilAge = Psmall.spAge || 67;
  const untilC = Math.max(0, Math.min(years, untilAge - Psmall.startAge + Psmall.off));
  const sum = (sel, to = years) => rows.reduce((t, r) => t + (r.year <= to ? sel(r) : 0), 0);
  const tax = {
    firstYear: first ? { own: first.own.taxA + first.own.taxB, together: first.together.taxA + first.together.taxB, year: first.year } : null,
    until: { own: sum((r) => r.own.taxA + r.own.taxB, untilC), together: sum((r) => r.together.taxA + r.together.taxB, untilC) },
    whole: { own: sum((r) => r.own.taxA + r.own.taxB), together: sum((r) => r.together.taxA + r.together.taxB) }
  };
  const savingYear = first ? first.saving : 0;
  const savingUntil = tax.until.own - tax.until.together;
  return {
    names: { a: nameA, b: nameB }, smaller, larger: smaller === 'b' ? 'a' : 'b', untilAge, untilC,
    rows, steps, schedules, unchanged, limit,
    applies: !unchanged && savingYear > SPLIT_HEADLINE_MIN,
    saving: { year: savingYear, until: savingUntil, whole: tax.whole.own - tax.whole.together },
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
  return schedule.map((v, y) => { const r = P.rows[y + P.off] || P.rows[P.rows.length - 1]; return Math.max(0, v - (r ? r.fixed : 0)); });
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

/** The ladder note (household-draw-split.md §8): the engine cannot reinvest money a bought rung pays beyond the draw. */
export function ladderNote(profiles, names) {
  const who = ['a', 'b'].filter((k) => profiles[k].ladder).map((k) => names[k]);
  if (!who.length) return '';
  return who.join(' and ') + (who.length > 1 ? '’s plans are gilt ladders' : '’s plan is a gilt ladder') + ': the comparison sizes the ladder to the lower draw. Money a rung already bought pays beyond the draw stays as cash in the pension, as the engine keeps it today; it is not reinvested in the growth part.';
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

/** What "Keep things as they are" is dismissed against: both plans' settings as they stand. */
export function splitFingerprint(settingsA, settingsB) {
  return String(simpleHash([settingsA || {}, settingsB || {}]));
}

/** The limit a person set, read from a form: { kind, who, age | amount } or null. */
export function limitFrom({ kind, who = 'b', age, amount } = {}) {
  if (kind === 'untilAge' && +age > 0) return { kind, who, age: +age };
  if (kind === 'keepAtLeast' && +amount > 0) return { kind, who, amount: +amount };
  return null;
}

// ---- The figures of the table: the split's own rows plus the paired strategy runs both ways ---------------------------

const at = (arr, i) => (Array.isArray(arr) && arr.length ? arr[Math.max(0, Math.min(arr.length - 1, i))] : null);
/** A plan's middling wealth at an age: its wealth cone's p50 at that plan year (null before the plan begins). */
export function potAtAge(r, P, age) {
  const y = age - P.startAge;
  if (y < 0 || !r || !r.cones || !r.cones.wealth) return null;
  return at(r.cones.wealth.p50, Math.min(y, P.dur));
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
    headline: 'Drawing together saves about ' + about(split.saving.year) + ' a year in tax — about ' + about(split.saving.until) + ' by the time ' + nm[small] + ' is ' + split.untilAge + '.',
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
