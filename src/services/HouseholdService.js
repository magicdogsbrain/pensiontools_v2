/**
 * Household Service — the couples view (Tier 4 v1, Aug 2026).
 *
 * DESIGN: UK pensions and tax are strictly individual, so the ENGINES stay per-person — a
 * household is two per-person plans presented together (the same architecture Guiide chose,
 * and the documented DIY workaround on the MSE forums). What two separate plans cannot answer
 * is "can WE afford to retire, together?" — that is this module's job.
 *
 * Every "will it last" figure here comes from the ONE test (6.24.0): each plan through its own strategy's
 * stressTestStrategy, on the plan planFromSettings builds, paired future for future (every strategy draws future i from
 * the same seeded market) and pooled by combineHouseholdStrategies. Nothing in this module runs an engine itself: the
 * caller hands in `test(settings, cfg, strategyId) → { r, p }` (the worker's or the page's planFromSettings +
 * stressTestStrategy). tests/oneTestOnly.test.js keeps it that way.
 */

import { spendingSmileFactor } from './SpendingModel.js';
import { spSimConfigFromSettings, currentAgeNow } from '../utils/StatePensionUtils.js';
import { defaultSpYear, scheduleFromSteps } from '../services/IncomeSchedule.js';
import { simulationConfigFromSettings } from './SimulationConfig.js';
import { grossToNet, netToGross } from './TaxCalculator.js';
import { oneAnswer } from './OneAnswer.js';

/**
 * Per-person yearly gross target (today's money): the schedule the ENGINES run (scheduleFromSteps — the saved per-year
 * schedule, else the income steps compiled), else baseSalary; × the spending profile. Until 1 Oct 2026 this read only a
 * saved targetSchedule, so a plan whose shape was steps without one (every plan made from a V7 answer, and any whose
 * steps were never re-saved) showed its first step every year here while its own test followed the steps.
 */
export function targetForYear(settings, year) {
  const sched = scheduleFromSteps(settings, +settings.shapeAgeNow || 57);
  const anchor = Array.isArray(sched) && sched[year] != null ? sched[year] : (settings.baseSalary || 0);
  return anchor * spendingSmileFactor(year, settings.spendingProfile || 'flat');
}

/** State Pension start year + annual amount (today's money) from either settings format. */
export function spFor(settings, now = new Date()) {
  const cfg = spSimConfigFromSettings(settings, now);
  if (cfg) return { startYear: cfg.spStartYear, annual: cfg.spWeeklyAmount * 52 };
  if (settings.statePension > 0) {
    // Same fallback as the simulation config: no SP date => 67 − income-start age.
    return { startYear: defaultSpYear(settings), annual: settings.statePension };
  }
  return { startYear: Infinity, annual: 0 };
}

/**
 * Deterministic household income timeline (today's money, gross-equivalent): what the household
 * needs each year, what is guaranteed (two State Pensions, DB floors, other income), and what
 * must come from the pots — with the bridge years (before both SPs are in payment) flagged.
 * @returns {Array<{year, needA, needB, need, spA, spB, db, other, guaranteed, drawNeed, bridge}>}
 */
export function householdIncomeTimeline(setA, setB, labelYears = null, now = new Date()) {   // `now`: injectable clock (tests)
  const durA = setA.duration || 35;
  const durB = setB.duration || 35;
  const offA = startOffset(setA, now), offB = startOffset(setB, now);
  const years = labelYears ?? Math.max(durA + offA, durB + offB);
  const a = spFor(setA, now), b = spFor(setB, now);
  const rows = [];
  // `year` is CALENDAR years from today; each plan's own year is that less its start offset.
  for (let c = 0; c <= years; c++) {
    const yA = c - offA, yB = c - offB;
    // Before a plan's year 0 the person is "still working" ONLY if the Timing block says they have not retired.
    // Someone already retired whose ladder starts next April is drawing the run-up from their SIPP cash —
    // their need counts from today (6.12.5; Alex, 16 Sep 2026: "Household seems to think I'm still working").
    const workingA = yA < 0 && !isRetired(setA), workingB = yB < 0 && !isRetired(setB);
    const needA = (!workingA && yA <= durA) ? targetForYear(setA, Math.max(0, yA)) : 0;
    const needB = (!workingB && yB <= durB) ? targetForYear(setB, Math.max(0, yB)) : 0;
    const spA = (!workingA && yA >= a.startYear) ? a.annual : 0;
    const spB = (!workingB && yB >= b.startYear) ? b.annual : 0;
    const db = (setA.dbAmount > 0 && yA >= (setA.dbStartYear || 0) ? setA.dbAmount : 0)
             + (setB.dbAmount > 0 && yB >= (setB.dbStartYear || 0) ? setB.dbAmount : 0);
    const other = (!workingA ? (setA.other || 0) : 0) + (!workingB ? (setB.other || 0) : 0);
    const need = needA + needB;
    const guaranteed = spA + spB + db + other;
    rows.push({
      year: c, needA, needB, need, spA, spB, db, other, guaranteed, workingA, workingB,
      drawNeed: Math.max(0, need - guaranteed),
      bridge: (!workingA && a.annual > 0 && yA < a.startYear) || (!workingB && b.annual > 0 && yB < b.startYear)
    });
  }
  return rows;
}

/** Calendar years until this plan's income starts (0 for someone already retired). */
/** The Timing block's "I have already retired" (saved as retired: true; older plans may hold the string). */
export function isRetired(settings) { return settings && (settings.retired === true || settings.retired === 'true'); }

export function startOffset(settings, clock = new Date()) {
  const now = currentAgeNow(settings, clock), start = +settings.shapeAgeNow || 0;
  return (now > 0 && start > now) ? Math.round(start - now) : 0;
}

// ---- The survivor and care checks: each plan through its own strategy's one test (household sweep, Oct 2026) ----------
// Until then both ran the Pots & Valves engine directly on each plan's equity/bond/cash, whatever its strategy: a gilt
// ladder was modelled as a growth portfolio, the inheritance was the median pension plus the median ISA (from different
// futures) then raised by 2.5% a year into nominal pounds beside today's-money spending — about double what a ladder leaves.

/** The strategies whose test runs the Pots & Valves engine: their wealth cone holds the ISA, held or not. */
const PNV_ENGINE = ['pots-and-valves', 'buckets-in-order'];
const idOf = (settings) => (settings && settings.strategyId) || 'pots-and-valves';
const bandsOf = (s) => ({ pa: +s.pa > 0 ? +s.pa : 12570, brl: +s.brl > 0 ? +s.brl : 50270, hrl: +s.hrl > 0 ? +s.hrl : 125140 });
const netOf = (gross, b) => grossToNet(Math.max(0, +gross || 0), b.pa, b.brl, b.hrl);
/** The planner's own gross-up (BudgetModel.grossUpAnnual): exact within the allowance. */
const grossOf = (net, b) => { const n = Math.max(0, +net || 0); return n <= b.pa ? n : netToGross(n, b.pa, b.brl, b.hrl); };
const runOne = (test, settings) => test(settings, simulationConfigFromSettings({}, settings), idOf(settings));

/** The yearly spending (before tax, today's money) a plan's engines read: the saved schedule, else the steps compiled, else the flat figure. */
export function scheduleOf(settings) {
  const s = scheduleFromSteps(settings, +settings.shapeAgeNow || 57);
  const n = Math.max(1, +settings.duration || 35) + 1;
  if (Array.isArray(s) && s.length) return Array.from({ length: Math.max(n, s.length) }, (_, y) => +s[Math.min(y, s.length - 1)] || 0);
  return Array.from({ length: n }, () => +settings.baseSalary || 0);
}

/** The ISA a bought strategy holds aside, outside its own test's wealth (untouched, holding its real value); 0 otherwise. */
export function heldIsaOf(p, strategyId) {
  return p && !PNV_ENGINE.includes(strategyId || 'pots-and-valves') && p.isaHold ? Math.max(0, +p.isa || 0) : 0;
}

/**
 * What a plan leaves at its plan year y, read from its own test: the median and the worst 1 in 10 of the TOTAL wealth
 * the test carries (cones.wealth p50 / p10 — never a median pension plus a median ISA), today's money. A bought strategy
 * (ladders, floors, bridge) leaves a held ISA out of its cone — it buys nothing with it — so the held ISA is added as the
 * plan holds it: untouched, at its value at the start, holding its real value (the planner's assumption for parked money).
 * The Pots & Valves engines carry the ISA in their own cone. `isaShare`: the share of the rest that is ISA money, in the
 * proportion the plan started with (the cone is one total), so the inheritance can pass as pension and as ISA.
 */
export function leftAtYear(r, p, strategyId, y) {
  const w = r.cones.wealth;
  const i = Math.max(0, Math.min(Math.round(y), w.p50.length - 1));
  const held = heldIsaOf(p, strategyId);
  const pot = Math.max(0, +p.pot || 0), isa = Math.max(0, +p.isa || 0);
  const isaShare = held > 0 || pot + isa <= 0 ? 0 : isa / (pot + isa);
  const split = (v) => { const rest = Math.max(0, v); const toIsa = held + rest * isaShare; return { total: rest + held, isa: toIsa, pension: rest + held - toIsa }; };
  return { year: i, middling: split(w.p50[i]), bad: split(w.p10[i]), heldIsa: held, isaShare };
}

/**
 * The survivor's plan from the year of death, written in the planner's own keys (nothing here is a second model):
 *  - spending (targetSchedule, which every engine reads first): their own until then; from then the chosen share of the
 *    household's spending — both plans' figures for that calendar year taken after tax on each one's own bands, the
 *    share of that grossed up again on the survivor's bands (one person's tax, not two);
 *  - the inheritance as two windfalls in today's money: the pension stays a pension (wrapper 'pension': beneficiary
 *    drawdown), the ISA passes as ISA (wrapper 'isa': the additional permitted subscription);
 *  - a final-salary survivor's pension as an income stream (extraIncomes), on the deceased's own indexation.
 */
export function survivorSettingsFor({ survivorSettings: sv, deceasedSettings: dc, survivorYear, offsets, spendFraction, dbSurvivorPct, inherit }) {
  const own = scheduleOf(sv), theirs = scheduleOf(dc);
  const bS = bandsOf(sv), bD = bandsOf(dc);
  const durD = Math.max(1, +dc.duration || 35);
  const shift = (offsets.survivor || 0) - (offsets.deceased || 0);
  const targetSchedule = own.map((g, y) => {
    if (y < survivorYear) return g;
    const yd = Math.max(0, y + shift);   // the deceased's plan year in the same calendar year (their first figure while still working)
    const d = yd <= durD ? theirs[Math.min(yd, theirs.length - 1)] : 0;
    return Math.round(grossOf(spendFraction * (netOf(g, bS) + netOf(d, bD)), bS));
  });
  const windfalls = [...(Array.isArray(sv.windfalls) ? sv.windfalls : []), ...[
    { label: 'Inherited pension', year: survivorYear, amount: Math.round(inherit.pension), wrapper: 'pension', indexation: 'cpi' },
    { label: 'Inherited ISA', year: survivorYear, amount: Math.round(inherit.isa), wrapper: 'isa', indexation: 'cpi' }
  ].filter((w) => w.amount > 0)];
  const extraIncomes = [...(Array.isArray(sv.extraIncomes) ? sv.extraIncomes : [])];
  if (+dc.dbAmount > 0 && dbSurvivorPct > 0) {
    extraIncomes.push({ label: 'Survivor\'s pension', startYear: Math.max(survivorYear, (+dc.dbStartYear || 0) - shift), annual: Math.round(+dc.dbAmount * dbSurvivorPct), indexation: dc.dbIndexation || 'lpi5' });
  }
  return { ...sv, targetSchedule, windfalls, extraIncomes };
}

const answerOf = (x) => (x && x.r && x.r.affordable ? oneAnswer(x.r, x.p) : null);
const reasonOf = (x) => (x && x.r && !x.r.affordable ? (x.r.reason || 'not affordable as configured') : null);

/**
 * Survivor one-shot stress: "if one of you dies N years from now, is the survivor still OK?" Everything through the
 * planner's one test, in today's money:
 *  1. what the deceased leaves: their OWN strategy's test, its wealth at their plan year for that calendar year — the
 *     middling case (median) and the bad case (worst 1 in 10) of the total (leftAtYear);
 *  2. the survivor's plan with that inheritance, the household share of spending and the survivor's pension written in
 *     (survivorSettingsFor), run through the survivor's OWN strategy's test — twice: with the middling inheritance and
 *     with the bad-case one. (Not paired future for future: a test takes one plan, and a windfall is one figure; the
 *     bad case pairs the deceased's worst 1 in 10 with every future of the survivor's — cautious.)
 * `test(settings, cfg, strategyId) → { r, p }`.
 */
export function runSurvivorCheck({ survivorSettings, deceasedSettings, deathYear = 10, spendFraction = 0.7, dbSurvivorPct = 0.5, now = new Date() }, test) {
  const offsets = { survivor: startOffset(survivorSettings, now), deceased: startOffset(deceasedSettings, now) };
  const deceasedYear = Math.max(0, deathYear - offsets.deceased), survivorYear = Math.max(0, deathYear - offsets.survivor);
  const D = runOne(test, deceasedSettings);
  if (!D.r.affordable) return { affordable: false, who: 'deceased', reason: reasonOf(D) };
  const left = leftAtYear(D.r, D.p, idOf(deceasedSettings), deceasedYear);
  const settingsFor = (inherit) => survivorSettingsFor({ survivorSettings, deceasedSettings, survivorYear, offsets, spendFraction, dbSurvivorPct, inherit });
  const middling = settingsFor(left.middling), bad = settingsFor(left.bad);
  const M = runOne(test, middling), B = runOne(test, bad);
  const g = middling.targetSchedule[Math.min(survivorYear, middling.targetSchedule.length - 1)];
  return {
    affordable: true, deathYear, deceasedYear, survivorYear, offsets,
    deceasedStrategy: idOf(deceasedSettings), survivorStrategy: idOf(survivorSettings),
    inherited: left,
    spending: { gross: g, net: Math.round(netOf(g, bandsOf(survivorSettings))) },
    middling: { a: answerOf(M), reason: reasonOf(M) },
    bad: { a: answerOf(B), reason: reasonOf(B) },
    settings: { middling, bad }   // the plans the survivor's two runs were (what-ifs: never saved)
  };
}

/**
 * The care cost as the planner's own one-off spend rows (extraWithdrawals, as 6.29.0's spend step writes them): a year
 * before tax, today's money ('cpi'), on top of that year's figure — the after-tax cost grossed up at the plan's own bands
 * on top of that year's spending (one row a year, each at its own year's figure). Plan years before 0 count at year 0.
 */
export function careRowsFor(settings, { fromYear, years, annualCost }) {
  const sched = scheduleOf(settings), b = bandsOf(settings);
  const rows = [];
  for (let k = 0; k < years; k++) {
    const y = Math.max(0, fromYear + k);
    const g = sched[Math.min(y, sched.length - 1)] || 0;
    const gross = Math.round(grossOf(netOf(g, b) + annualCost, b) - grossOf(netOf(g, b), b));
    if (gross > 0) rows.push({ label: 'Care', amount: gross, year: y, years: 1, indexation: 'cpi' });
  }
  return rows;
}

const jointOf = (c) => (c ? { runs: c.runs, jointSuccess: c.jointSuccess, successA: c.successA, successB: c.successB, pooled: c.pooled } : null);

/**
 * Long-term-care one-shot stress: "if one of you needs care from N years from now for M years at £X a year (after
 * tax, today's money), while the other keeps living normally — do the plans hold?" Deliberately cautious: the cost is
 * ADDED to that person's plan in full (no offset for reduced normal spending), and only the COST is modelled — never
 * local-authority means-testing, which is benefits advice. Each plan through its own strategy's one test, paired
 * future for future, the household read pooled (combineHouseholdStrategies, 6.25.0) — with the care and without it.
 * @param {{ needs?: { a: number[], b: number[] } }} o   each plan's draw need by plan year (HouseholdDraw's needs.own),
 *   for the pooled verdict; the care years' cost before tax is added to the cared-for plan's need
 */
export function runCareCheck({ setA, setB, who = 'A', startYear = 15, years = 3, annualCost = 90000, needs = null, now = new Date() }, test) {
  const care = who === 'B' ? setB : setA;
  const fromYear = startYear - startOffset(care, now);
  const rows = careRowsFor(care, { fromYear, years, annualCost });
  const withCare = { ...care, extraWithdrawals: [...(Array.isArray(care.extraWithdrawals) ? care.extraWithdrawals : []), ...rows] };
  const A = runOne(test, setA), B = runOne(test, setB);
  const bad = [A, B].find((x) => !x.r.affordable);
  if (bad) return { affordable: false, reason: reasonOf(bad) };
  const C = runOne(test, withCare);
  if (!C.r.affordable) return { affordable: false, reason: reasonOf(C) };
  const addCare = (need) => {
    if (!Array.isArray(need)) return null;
    const out = [...need];
    for (const r of rows) if (r.year < out.length) out[r.year] = (out[r.year] || 0) + r.amount;
    return out;
  };
  const nA = needs && needs.a, nB = needs && needs.b;
  const opts = (careA, careB) => ({ needA: careA ? addCare(nA) : nA, needB: careB ? addCare(nB) : nB, startAgeA: A.p.startAge, startAgeB: B.p.startAge,
    heldA: heldIsaOf(A.p, idOf(setA)), heldB: heldIsaOf(B.p, idOf(setB)) });
  const baseline = combineHouseholdStrategies(A.r, B.r, opts(false, false));
  const withIt = who === 'B' ? combineHouseholdStrategies(A.r, C.r, opts(false, true)) : combineHouseholdStrategies(C.r, B.r, opts(true, false));
  return {
    affordable: true, who, fromYear, rows,
    baseline: jointOf(baseline), care: jointOf(withIt),
    totalCareCost: annualCost * years,
    totalCareGross: rows.reduce((t, r) => t + r.amount, 0),
    settings: withCare   // the cared-for plan as run (a what-if: never saved)
  };
}


/**
 * Household check with each partner on their OWN strategy. Every engine draws future i from the
 * same seeded market (seed i·7919+3), so partner A's future i and partner B's future i are the same
 * markets and "both survive" is read off the paired survival arrays. Wealth is summed from the
 * evenly spaced sample of futures each strategy exposes (the same indices for both when the run
 * counts match). A working partner's later start is NOT year-shifted here (the contract engines
 * generate their own paths) — the caller states that caveat.
 * @param {object} rA - stressTestStrategy result for partner A (needs survivedMc, samples.wealth)
 * @param {object} rB - same for partner B
 */
/**
 * The pooled household verdict (usability audit §5 decision 5, option (a); household-draw-split.md §8): when one pot is
 * empty the other pays that share, so the household runs out only when both have. Read from each test's per-future
 * read-out (stressTest futuresOf): in a future where one plan ran out in plan year t and the other lasted, the other
 * covers it if the wealth it had left at its end is at least the empty plan's draw need from t to its end — counted a
 * quarter higher for the tax the payer's own bands add. A future marked not survived for a cut (money left, income
 * short) is covered whenever the other plan lasted. Without needs or read-outs the pooled share is the paired one.
 * @param {{ needA?: number[], needB?: number[], startAgeA?: number, startAgeB?: number, heldA?: number, heldB?: number }} [opts]  each plan's draw need
 *   by plan year (gross, today's money, net of its own guaranteed income) and the age its year 0 is; heldA / heldB: an ISA
 *   each plan holds aside (heldIsaOf), added to every year of the combined figure
 */
export function combineHouseholdStrategies(rA, rB, opts = {}) {
  const sa = rA.survivedMc || [true], sb = rB.survivedMc || [true];
  // A deterministic plan (one "future", e.g. the full gilt ladder) is broadcast across the other's futures.
  const bc = (arr, i) => (arr.length === 1 ? arr[0] : arr[i]);
  const n = (sa.length === 1 || sb.length === 1) ? Math.max(sa.length, sb.length) : Math.min(sa.length, sb.length);
  let both = 0, okA = 0, okB = 0;
  for (let i = 0; i < n; i++) { const a = !!bc(sa, i), b = !!bc(sb, i); if (a) okA++; if (b) okB++; if (a && b) both++; }
  const wa = (rA.samples && rA.samples.wealth && rA.samples.wealth.length) ? rA.samples.wealth : [rA.cones.wealth.p50];
  const wb = (rB.samples && rB.samples.wealth && rB.samples.wealth.length) ? rB.samples.wealth : [rB.cones.wealth.p50];
  const m = (wa.length === 1 || wb.length === 1) ? Math.max(wa.length, wb.length) : Math.min(wa.length, wb.length);
  const years = Math.max(wa[0] ? wa[0].length : 0, wb[0] ? wb[0].length : 0);
  const pct = (arr, q) => { const s2 = [...arr].sort((x, y) => x - y); return s2[Math.min(s2.length - 1, Math.floor(q * s2.length))]; };
  // An ISA a bought strategy holds aside is outside its test's wealth: added as the plan holds it (leftAtYear), so the
  // combined figure is everything both plans hold (sweep 20 Oct 2026 — it was left out of a ladder plan's side).
  const held = Math.max(0, +opts.heldA || 0) + Math.max(0, +opts.heldB || 0);
  const potFan = [];
  for (let y = 0; y < years; y++) {
    const vals = [];
    for (let i = 0; i < m; i++) { const a = bc(wa, i) || [], b = bc(wb, i) || []; vals.push((a[Math.min(y, a.length - 1)] || 0) + (b[Math.min(y, b.length - 1)] || 0) + held); }
    potFan.push({ year: y, p10: pct(vals, 0.10), p50: pct(vals, 0.50), p90: pct(vals, 0.90) });
  }
  const pooled = pooledVerdict(rA, rB, sa, sb, n, opts, bc);
  return { runs: n, jointSuccess: n ? both / n : 0, successA: n ? okA / n : 0, successB: n ? okB / n : 0, independenceAssumed: n ? (okA / n) * (okB / n) : 0, potFan, sampleFutures: m, byStrategy: true, pooled };
}

/** The gross-up on a share one plan pays for the other (its own bands are already in use: a quarter more, pessimistic). */
export const POOLED_TAX_UPLIFT = 1.25;

function pooledVerdict(rA, rB, sa, sb, n, opts, bc) {
  const fa = rA.futuresMc, fb = rB.futuresMc;
  const needA = Array.isArray(opts.needA) ? opts.needA : null, needB = Array.isArray(opts.needB) ? opts.needB : null;
  if (!fa || !fb || !needA || !needB || !n) return null;
  const rest = (need, from) => { let t = 0; for (let y = from; y < need.length; y++) t += Math.max(0, need[y] || 0); return t * POOLED_TAX_UPLIFT; };
  let ok = 0, coveredByA = 0, coveredByB = 0;
  const fromAges = [];
  for (let i = 0; i < n; i++) {
    const a = !!bc(sa, i), b = !!bc(sb, i);
    if (a && b) { ok++; continue; }
    if (!a && !b) continue;
    const payer = a ? fa : fb, empty = a ? fb : fa, need = a ? needB : needA, startAge = a ? opts.startAgeB : opts.startAgeA;
    const fy = bc(empty.failYear, i);
    const covered = fy == null || bc(payer.terminal, i) >= rest(need, fy);
    if (covered) { ok++; if (a) coveredByA++; else coveredByB++; if (fy != null && startAge > 0) fromAges.push(startAge + fy); }
  }
  fromAges.sort((x, y) => x - y);
  return {
    success: ok / n, coveredByA, coveredByB,
    fromAgeMedian: fromAges.length ? fromAges[Math.floor(fromAges.length / 2)] : null,
    fromAgeEarliest: fromAges.length ? fromAges[0] : null
  };
}

/** The parts of a strategy result the couples table reads (what the worker sends back for each plan each way). */
export function compactStrategyResult(r) {
  if (!r) return null;
  if (!r.affordable) return { affordable: false, reason: r.reason || '', name: r.name };
  const w = (r.cones && r.cones.wealth) || {};
  return { affordable: true, name: r.name, ruin: r.ruin, terminal: r.terminal, n: r.n, cones: { wealth: { p10: w.p10 || [], p50: w.p50 || [] } } };
}

/**
 * Both plans through the ONE test (stressTestStrategy), paired future for future, each way — "each draws for their
 * own plan" and "drawing together" — with the pooled household verdict. `test(settings, cfg, id)` runs one plan (the
 * worker's or the page's planFromSettings + stressTestStrategy) and returns { r, p }.
 * @param {{ own: { settingsA, cfgA, settingsB, cfgB }, together: {…} }} ways
 * @param {{ own: { a: number[], b: number[] }, together: {…} }} needs   each plan's draw need by plan year, each way
 */
export function runHouseholdWays(ways, needs, idA, idB, test) {
  const out = {};
  for (const w of Object.keys(ways)) {
    const x = ways[w];
    const A = test(x.settingsA, x.cfgA, idA), B = test(x.settingsB, x.cfgB, idB);
    const nd = (needs && needs[w]) || {};
    out[w] = {
      combined: (A.r.affordable && B.r.affordable) ? combineHouseholdStrategies(A.r, B.r, { needA: nd.a, needB: nd.b, startAgeA: A.p.startAge, startAgeB: B.p.startAge, heldA: heldIsaOf(A.p, idA), heldB: heldIsaOf(B.p, idB) }) : null,
      rA: compactStrategyResult(A.r), rB: compactStrategyResult(B.r)
    };
  }
  return out;
}
