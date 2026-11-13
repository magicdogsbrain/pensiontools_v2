/**
 * ONE answer to "will the money last?" (research/v7/v6-usability-audit.md §1 problem 1 and §5 decision 2, option (a),
 * agreed 17 Oct 2026).
 *
 * Every "will it last" figure the planner shows is read from the ONE stress test every strategy runs —
 * stressTestStrategy on the plan's own strategy, with the plan's own cuts setting and its full length — through the
 * helpers here. Until 6.24 the same plan read a different chance on almost every screen: the Monte Carlo tab ran its
 * own futures (5-year blocks of 1928–2024), the Historical tab its own start years from 1928, the Scenarios tab five
 * looped decades, the Strategies ranking ran with the cuts switched off ("level footing"), and "worst" meant the worst
 * of 1,000 in some places and the worst 1 in 10 in others. Now:
 *   - the chance is `100 − ruin.mc` of that one result, said as "lasts in 9 futures out of 10";
 *   - the bad case is the worst 1 in 10 (the 10th percentile), never the worst of 1,000;
 *   - the income cuts are counted from the same futures (how many were cut, by how much, for how long);
 *   - History and Scenarios explain that same test — its own real start years — with no rival percentage.
 *
 * Pure: no DOM, no storage, no engine. index.html reads words and figures from here (its script may only shrink).
 */
import { jointSurvivalOf } from './LongevityModel.js';
import { RULES, WEIGHT_ONE, LEVEL_FAILS20, levelOf, verdictAtLevel } from '../answers/shared/rules.js';
import { planToAgeOf } from './AgeConvention.js';
import { chanceWords, fixedAgeWords, failTwentiethsWords } from '../answers/shared/format.js';

const RULES_MAX_DRAW_YEARS = RULES.maxDrawYears;

/** The named start years History and Scenarios explain: real crises, in plain words. */
export const NAMED_STARTS = [
  { year: 1929, label: 'the Great Depression' },
  { year: 1937, label: 'the 1937 slump' },
  { year: 1966, label: 'the 1966 start — the worst a retiree has had' },
  { year: 1973, label: 'the 1970s inflation' },
  { year: 2000, label: 'the dot-com bust and the lost decade' },
  { year: 2008, label: 'the 2008 crisis' }
];

const num = (v) => (typeof v === 'number' && Number.isFinite(v) ? v : 0);

const median = (arr) => { if (!arr.length) return 0; const s = [...arr].sort((a, b) => a - b); const m = Math.floor(s.length / 2); return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };

/**
 * "in 9 futures out of 10" from a share 0–1 — the same banding as the quick answer's words (PlanSeed.answerLastedWords,
 * language guide 3.4): 9 in 10 is the "on course" bar, so a share just under it must not read as 9.
 * @returns {{ n: number, words: string }}  n = whole futures out of 10 (for sorting and bars), words = the phrase
 */
export function futuresOutOfTen(share) {
  const s = Math.max(0, Math.min(1, num(share)));
  const n = Math.round(s * 10);
  if (s >= 1) return { n: 10, words: 'in every future it tried' };
  if (s >= 0.95) return { n: 10, words: 'in more than 9 futures out of 10' };
  if (s >= 0.9) return { n: 9, words: 'in 9 futures out of 10' };
  if (s >= 0.85) return { n: 9, words: 'in just under 9 futures out of 10' };
  if (s >= 0.15) return { n, words: 'in ' + n + ' futures out of 10' };
  if (s >= 0.05) return { n: 1, words: 'in only 1 future out of 10' };
  if (s > 0) return { n: 0, words: 'in fewer than 1 future out of 10' };
  return { n: 0, words: 'in none of the futures it tried' };
}

/** The lines a chance of lasting is judged against (on course, likely, at real risk), and the same for running out. */
export const CHANCE_BARS = [90, 75, 50];
export const RUIN_BARS = [10, 25, 50];

/**
 * A percentage said honestly (6.33.0): rounding never turns a near miss into a clean 100% or a trace into 0%, and never
 * carries a figure across one of `bar` (a number or a list — the lines the words beside it change at), so 89.6% never
 * reads "90%" beside "not on course". 99.8% of the years paid read "100%" beside income cuts until now; a 0.3% chance
 * of a cut read "0%". The figure keeps `dp` decimals and adds up to two more where rounding would mislead; if it still
 * would, it is cut toward its true side (89.996 → "89.99%", 99.999 → "99.99%"), and a trace reads "under 0.01%".
 * Exactly 0 and exactly 100 (and anything outside) read as themselves.
 * @returns {string} e.g. '98%', '99.8%', '89.99%', 'under 0.01%' — always with the % sign
 */
export function pctText(v, dp = 0, bar = null) {
  const x = num(v);
  if (x <= 0) return '0%';
  if (x >= 100) return '100%';
  const bars = bar == null ? [] : [].concat(bar).filter((b) => Number.isFinite(+b));
  const fair = (t) => t > 0 && t < 100 && bars.every((b) => (t >= b) === (x >= b));
  for (let d = dp; d <= dp + 2; d++) {
    const t = x.toFixed(d);
    if (fair(+t)) return t + '%';
  }
  const d = dp + 2, f = Math.pow(10, d);
  const down = Math.floor(x * f) / f;   // a cut, never a rounding up: stays below any line x is below, and under 100
  return fair(down) ? down.toFixed(d) + '%' : 'under ' + (1 / f).toFixed(d) + '%';
}

/**
 * The same share as futures out of 10 to one decimal (Compare allocations): never "10.0" while a future failed, never
 * "9.0" under the on-course line, never "0.0" while one lasted (6.33.0).
 */
export function tenthsOutOfTen(share) {
  const s = Math.max(0, Math.min(1, num(share)));
  const t = Math.round(s * 100) / 10;
  return (s < 1 && t >= 10 ? 9.9 : s < 0.9 && t >= 9 ? 8.9 : s > 0 && t <= 0 ? 0.1 : t).toFixed(1);
}

/**
 * The income cuts, counted from the per-future record of the one test (stressTest pnvRun: the engine's cutYears =
 * tax years in which more than 1% of the planned income went unpaid and was never caught up; cutReal = the income done
 * without over the run, today's money). A future that ran out is counted among the cut ones too.
 * @param {Array<{ failed: boolean, cutYears: number, cutReal: number }>} windows
 */
export function summariseCuts(windows, planYears) {
  const ws = Array.isArray(windows) ? windows : [];
  const cut = ws.filter((w) => w && (num(w.cutYears) > 0 || w.failed));
  const ranOut = cut.filter((w) => w.failed).length;
  const perYear = cut.map((w) => (num(w.cutYears) > 0 ? num(w.cutReal) / num(w.cutYears) : num(w.cutReal)));
  const years = cut.map((w) => Math.max(w.failed ? 1 : 0, num(w.cutYears)));
  const totals = cut.map((w) => num(w.cutReal));
  return {
    futures: ws.length,
    cutN: cut.length,
    cutPct: ws.length ? Math.round(1000 * cut.length / ws.length) / 10 : 0,
    ranOutN: ranOut,
    typicalCutPerYear: Math.round(median(perYear)),
    typicalCutYears: Math.round(Math.min(num(planYears) || Infinity, median(years))),
    typicalCutTotal: Math.round(median(totals)),
    worstCutTotal: Math.round(totals.length ? Math.max(...totals) : 0)
  };
}

/**
 * The figures every screen reads from one strategy result (stressTestStrategy) on one plan (planFromSettings).
 * null when there is no result or the strategy is not affordable on the plan.
 *
 * 7.8.0 (research/v7/replan-nov-2026.md 5): with `opts.life` (answers/plan/life.js lifeOf) the answer also carries the
 * chance the money lasts as long as you do — weightedPartOf below — beside the fixed-age count it always had. Without it the
 * answer is the object it always was (every caller before 7.8.0, and every one while SUCCESS.weighted is false).
 */
export function oneAnswer(r, p, opts = null) {
  const a = oneAnswerCount(r, p);
  if (!a || !opts || !opts.life) return a;
  return { ...a, ...weightedPartOf(r, p, a, opts) };
}

function oneAnswerCount(r, p) {
  if (!r || !r.affordable || !r.ruin) return null;
  const chancePct = Math.max(0, Math.min(100, 100 - num(r.ruin.mc)));
  const share = chancePct / 100;
  const nHist = num(r.n && r.n.hist);
  const t = r.terminal || {};
  return {
    strategyId: r.strategyId || null,
    chancePct, share,
    outOfTen: futuresOutOfTen(share),
    futures: num(r.n && r.n.mc),
    histories: nHist,
    years: num(p && p.durationYears),
    // Pots & Valves and Buckets run their real starts `p.stride` months apart; every other strategy runs every month.
    histStrideMonths: (r.strategyId === 'pots-and-valves' || r.strategyId === 'buckets-in-order') ? Math.max(1, num(p && p.stride) || 1) : 1,
    histRanOutPct: num(r.ruin.hist),
    histRanOutN: Math.round(num(r.ruin.hist) * nHist / 100),
    typicalLeft: num(t.p50),
    badCaseLeft: num(t.p10),    // the worst 1 in 10 — never the worst of 1,000
    goodCaseLeft: num(t.p90),
    worst12: num(r.worst12 && r.worst12.min),
    coverage: r.coverage == null ? null : num(r.coverage),
    cuts: r.cuts || null,
    cutLabel: r.ruinLabel || null,
    // What a failed future IS for this strategy (sweep 20 Oct 2026): the money ran out; the plan was cut (a floor to an
    // age, a rotation — neither runs out); or a lean year (Floor & flex — the bills are always paid).
    failKind: !r.ruinLabel ? 'ran-out' : r.strategyId === 'floor-and-flex' ? 'lean' : 'cut'
  };
}

// ---- 7.8.0: the chance the money lasts as long as you do (the build spec's sections 1, 4, 6 and 11) -------------------------

const isNum = (v) => typeof v === 'number' && Number.isFinite(v);
const gbpW = (v) => '£' + String(Math.abs(Math.round(+v || 0))).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
/** Pounds to the nearest £1,000 (money left: a spread of futures, never a balance to the pound). */
const gbpK = (v) => gbpW(Math.round((+v || 0) / 1000) * 1000);
/** What failing means, in the words of each kind (OneAnswer.failKind). */
const LASTS_AS_LONG = { 'ran-out': 'the money lasts as long as you do', cut: 'your income is paid in full as long as you live', lean: 'you have no lean year while you are alive' };
const RUNS_OUT = { 'ran-out': 'the money ran out', cut: 'your income was first cut', lean: 'you had your first lean year' };

/**
 * Bold's consequence from the plan's own chance (the weighted one; the fixed-age count when there is none), in the same
 * twentieths the chance is said in (format.js failTwentiethsWords): "About 4 times in 20 …", "Less than once in 20 …" —
 * never a figure the plan did not give, never rounded the kinder way.
 */
export function boldConsequenceOf(a) {
  const weighted = !!a && typeof a.weighted === 'number';
  const share = weighted ? a.weighted : a ? a.share : 1;
  const words = failTwentiethsWords(Math.max(0, Math.min(1, +share || 0)), { plain: !weighted });
  const what = a && a.failKind && a.failKind !== 'ran-out' ? 'your income falls short' : 'the money runs out';
  if (words === null) return 'In none of the futures we tried does ' + (what === 'the money runs out' ? 'the money run out' : 'your income fall short') + ' while you are alive.';
  return words.charAt(0).toUpperCase() + words.slice(1) + ' ' + what + ' while you are alive, and you would spend less from then on.';
}

/**
 * The weighted part of one answer on a saved plan:
 *   level        the level the plan is judged at ('careful' | 'balanced' | 'bold')
 *   weighted     the chance weighted by how long people live (0–1), from the run that follows each future on to the
 *                weighting age (`rW`, the plan's own run `r` when it already runs that far): each future that failed counts
 *                by the chance someone is still alive at the start of the year it first failed (headYearsOf: the year before
 *                the closed years' cut; a failed future with no year counts at its run's last year), given alive at
 *                the drawing start. Null — the fixed-age line leads, with its age — when life.reason says so ('couple',
 *                'linked', 'durationShaped') or the result is a stored one with no figure of its own ('stored')
 *   sumW, n      the whole-number weighted failures and the futures they are out of (rules.js passes reads them)
 *   fixedAge     the plain count to the plan's end age (= share), always shown beside it, with its age
 *   planToAge    the age the plan runs to; weightToAge the age the weighted run follows each future on to; horizonRule
 *                'plan' or 'capped' (the run could not reach it: RULES.maxDrawYears)
 *   verdict      'yes' | 'close' | 'no' at the level: on the weighted failures (rules.js verdictAtLevel) or, with none, on
 *                the count to the plan's age at floor(t·n/20) and one more twentieth
 *   lasts        verdict === 'yes'
 *   floor        { age, yearly, spAge } at the middle age the money ran out at in the futures that ran out, what comes in
 *                anyway that year after tax (`floorAt`), and the State Pension's age when it has not started by then; null
 *                when none ran out
 *   left         { age, typical, best, mostNone }: what is left at the plan's end age, typically and in the best 1 in 10,
 *                at today's prices; mostNone when more than half the futures have nothing left by then
 *   words        { headline, fixed, floor, left, assumed[], why }: the sentences, by failKind (both apps say these)
 * @param {object} opts { life, rW, wYears, level, floorAt(runYear) → £ a year after tax, capped, stored: { chance }|null, table }
 */
export function weightedPartOf(r, p, a, { life, rW = null, wYears = null, level = 'balanced', floorAt = null, capped = false, stored = null, table = undefined } = {}) {
  const lvl = levelOf(level);
  const t = LEVEL_FAILS20[lvl];
  const startAge = num(p && p.startAge);
  // the age the plan runs to, as both apps say it everywhere (planToAgeOf: "to 97" = to the 97th birthday, lastsOf's endAge)
  const planToAge = planToAgeOf(startAge, p && p.durationYears);
  const run = rW || r;
  const kind = a.failKind;
  let weighted = null, sumW = null, n = null, reason = life.reason || null;
  const S = jointSurvivalOf(life.people, life.d, table);
  const lost = run && Array.isArray(run.survivedMc) ? run.survivedMc : null;
  const head = headYearsOf(run);
  const lastYear = Math.max(0, (isNum(wYears) ? wYears : num(p && p.durationYears)) - 1);
  if (!reason && stored) {
    // a stored result (a locked ladder's document): its own weighted figure when it was locked with one, else none
    if (isNum(stored.chance)) weighted = stored.chance; else reason = 'stored';
  } else if (!reason && lost) {
    const f = weightedFailsOf(run, life, startAge, lastYear, S);
    n = f.n; sumW = f.sumW;
    weighted = n ? 1 - sumW / (n * WEIGHT_ONE) : 1;
  } else if (!reason) reason = 'stored';
  const nCount = num(a.futures) || 0;
  const fails = Math.round((1 - a.share) * nCount);
  let verdict;
  if (weighted !== null && sumW !== null) verdict = verdictAtLevel(sumW, n, lvl, true);
  else if (weighted !== null) verdict = weighted >= 1 - t / 20 - 1e-12 ? 'yes' : weighted >= 1 - (t + 1) / 20 - 1e-12 ? 'close' : 'no';
  else verdict = fails <= Math.floor((t * nCount) / 20) ? 'yes' : fails <= Math.floor(((t + 1) * nCount) / 20) ? 'close' : 'no';
  // the middle age the money ran out at, in the futures that ran out (to the weighting age), and what comes in anyway then
  let floor = null;
  if (lost && lost.some((x) => x === false)) {
    const ys = []; lost.forEach((x, i) => { if (x === false) ys.push(head && isNum(head[i]) ? head[i] : lastYear); });
    ys.sort((x, y) => x - y);
    const mid = ys[Math.floor((ys.length - 1) / 2)];
    const yearly = typeof floorAt === 'function' ? floorAt(mid) : null;
    const spAge = num(p && p.spAnnual) > 0 && isNum(p && p.spStartYear) && p.spStartYear > mid ? Math.round(startAge + p.spStartYear) : null;
    floor = { age: Math.round(startAge + mid), yearly: isNum(yearly) ? Math.round(yearly) : null, spAge, ...(p && p.spAssumed && !spAge && num(p.spAnnual) > 0 ? { spAssumed: true } : {}) };
  }
  const left = { age: planToAge, typical: Math.round(a.typicalLeft), best: Math.round(a.goodCaseLeft), mostNone: a.share < 0.5 };
  const weightToAge = Math.min(life.weightToAge, Math.round(startAge + (isNum(wYears) ? wYears : num(p && p.durationYears))));
  const out = { level: lvl, weighted, sumW, n, fixedAge: a.share, planToAge, weightToAge, horizonRule: capped ? 'capped' : 'plan', reason, verdict, lasts: verdict === 'yes', floor, left };
  return { ...out, words: weightedWordsOf({ ...a, ...out }, life, S) };
}

/**
 * The run year each future first failed by its strategy's own test (null where it lasted): futuresMc.headYear where the
 * closed years' cut rewrote failYear (stressTest.closedYearsCut keeps it there), else failYear itself, which is that year.
 * Null when the run keeps no per-future record.
 */
export function headYearsOf(run) {
  const f = run && run.futuresMc;
  if (!f) return null;
  return Array.isArray(f.headYear) ? f.headYear : Array.isArray(f.failYear) ? f.failYear : null;
}

/**
 * The whole-number weighted failures of one run (rules.js passes reads them): every future the run counts as failed
 * (survivedMc false) adds round(S × 2^30), S the chance someone is still alive at the start of the run year it first
 * failed (futuresMc.headYear; `lastYear` when it has none), given alive at the drawing start (life.d). One rule for the
 * answer (weightedPartOf) and the pot that passes (stressTest.requiredPotForStrategy).
 * @returns {{ sumW: number, n: number }}
 */
export function weightedFailsOf(run, life, startAge, lastYear, S = jointSurvivalOf(life.people, life.d)) {
  const lost = run && Array.isArray(run.survivedMc) ? run.survivedMc : [];
  const head = headYearsOf(run);
  let sumW = 0;
  for (let i = 0; i < lost.length; i++) if (lost[i] === false) sumW += Math.round(S(startAge + (head && isNum(head[i]) ? head[i] : lastYear) - life.ageNow) * WEIGHT_ONE);
  return { sumW, n: lost.length };
}

/**
 * The sentences of the weighted part (the build spec's section 11), one reading for both apps:
 *   headline   "Counting how long people your age live, the money lasts as long as you do 18 times in 20." (by failKind);
 *              null when there is no weighted figure (the fixed-age line then leads)
 *   fixed      "If you live to 97, the money lasts that long in 14 of 20 futures we tried." — always, with its age
 *   floor      "If the money ran out at 88, you would still have £12,500 a year after tax from the income you get anyway."
 *   left       "If you live to 97, what is typically left then is £180,000 at today's prices. In the best 1 in 10 futures
 *              it is £640,000 or more." (or "In more than half the futures nothing is left at 97.")
 *   assumed    what we assumed: the plan's age against how long people live, the age the futures are followed on to, the
 *              cap, the table used when the sex is not said
 *   why        one line when there is no weighted figure, saying what the figure counts instead
 */
export function weightedWordsOf(w, life, S) {
  const kind = LASTS_AS_LONG[w.failKind] ? w.failKind : 'ran-out';
  const headline = w.weighted === null ? null
    : 'Counting how long people your age live, ' + LASTS_AS_LONG[kind] + ' ' + chanceWords(w.weighted, { sumW: w.sumW, n: w.n }) + '.';
  // (a couple's plan counts its futures while one of you is alive: said by the plan's own age, never as one person's life)
  const fixed = fixedAgeWords(w.fixedAge, w.planToAge, { kind, couple: life.reason === 'couple' ? { name: 'you' } : null });
  let floor = null;
  if (w.floor && isNum(w.floor.yearly)) {
    const at = 'If ' + RUNS_OUT[kind] + ' at ' + w.floor.age;
    floor = w.floor.yearly > 0 ? at + ', you would still have ' + gbpW(w.floor.yearly) + ' a year after tax from the income you get anyway' + (w.floor.spAssumed ? ', with the State Pension we assumed (none is entered).' : '.')
      : w.floor.spAge ? at + ', nothing would come in until your State Pension starts at ' + w.floor.spAge + '.'
      : at + ', nothing else would come in.';
  }
  // (to the nearest £1,000, as every answer rounds what is left: these are spreads of futures, not balances)
  const left = w.left.mostNone ? 'In more than half the futures nothing is left at ' + w.left.age + '.'
    : 'If you live to ' + w.left.age + ', what is typically left then is ' + gbpK(w.left.typical) + ' at today\'s prices. In the best 1 in 10 futures it is ' + gbpK(w.left.best) + ' or more.';
  const who = life.sex === 'm' ? 'men' : 'women';
  const assumed = [];
  const livesOn = Math.round(10 * S(w.planToAge - life.ageNow));
  assumed.push('We tested to ' + w.planToAge + ', the age your plan runs to. ' + (livesOn >= 1 ? 'About ' + livesOn + ' in 10 ' + who + ' your age live longer than that.' : 'Fewer than 1 in 10 ' + who + ' your age live longer than that.'));
  if (w.weighted !== null && w.weightToAge > w.planToAge) assumed.push('We follow each future on to ' + w.weightToAge + ', when fewer than 1 in 50 ' + who + ' your age are still alive.');
  if (w.horizonRule === 'capped') assumed.push('We could test only to ' + w.weightToAge + ': ' + RULES_MAX_DRAW_YEARS + ' years is the most we run.');
  if (!life.sexGiven) assumed.push('We used the figures for women, who tend to live longer, because the plan does not say.');
  const why = w.weighted !== null ? null
    : w.reason === 'durationShaped' ? 'This way of drawing buys what the plan\'s own years need, so its figure counts the futures to ' + w.planToAge + ', the age your plan runs to.'
    : w.reason === 'stored' ? 'This is the figure the plan was locked with, counted to ' + w.planToAge + '.'
    : 'For a plan shared with a partner, the figure counts the futures to ' + w.planToAge + ', the age the plan runs to.';
  return { headline, fixed, floor, left, assumed, why };
}

/** A month index since January 1871 (the one test's history) → the calendar start. */
export function startOfWindow(s) {
  const i = Math.max(0, Math.round(num(s)));
  return { year: 1871 + Math.floor(i / 12), month: (i % 12) + 1 };
}

/**
 * The worst start years, read from the one test's own per-window history (stressTest pnvTest `histWindows`): the
 * windows that ran out first, then the leanest of the rest. Each is marked as an unfair test — nobody retires into
 * the worst month of 150 years on purpose, but the test counts them all the same.
 */
export function worstStarts(histWindows, n = 5) {
  const ws = Array.isArray(histWindows) ? histWindows.filter(Boolean) : [];
  const key = (w) => (w.failed ? [0, num(w.failAge) || 0, num(w.worst12)] : [1, num(w.worst12), num(w.terminal)]);
  const sorted = [...ws].sort((a, b) => { const ka = key(a), kb = key(b); for (let i = 0; i < ka.length; i++) if (ka[i] !== kb[i]) return ka[i] - kb[i]; return 0; });
  return sorted.slice(0, Math.max(0, n)).map((w) => ({ ...startOfWindow(w.s), ...w, unfair: true }));
}

/**
 * A locked plan's document keeps the figure it was worked out with (never rewritten). When today's test on the same
 * plan gives a different figure, the page says so in one line. '' when they agree (within a tenth of a point on the
 * chance, and within half a percent on what is typically left) or either side is missing.
 */
export function earlierTestNote(storedR, liveR) {
  if (!storedR || !liveR || !storedR.affordable || !liveR.affordable || !storedR.ruin || !liveR.ruin) return '';
  const a = oneAnswer(storedR, {}), b = oneAnswer(liveR, {});
  const chanceMoved = Math.abs(a.chancePct - b.chancePct) >= 0.1;
  const leftMoved = Math.abs(a.typicalLeft - b.typicalLeft) > 0.005 * Math.max(1, Math.abs(a.typicalLeft));
  if (!chanceMoved && !leftMoved) return '';
  const gbp = (v) => '£' + Math.round(v).toLocaleString('en-GB');
  const pc = (v) => pctText(v, 0, CHANCE_BARS);
  let s = 'This figure was worked out under the earlier test, when the plan was locked: ' + pc(a.chancePct) + ' (' + a.outOfTen.words + ')';
  if (chanceMoved) s += '; today\'s test gives ' + pc(b.chancePct) + ' (' + b.outOfTen.words + ')';
  if (leftMoved) s += '; then typically ' + gbp(a.typicalLeft) + ' left, today ' + gbp(b.typicalLeft);
  s += '. The document keeps the figure it was locked with; the market data and the test have moved since.';
  return s;
}

/**
 * The Strategies ranking's orders (6.40.0, research/v7/way-and-mix.md 6): the keys of the planner's ranking card
 * (ui/oneAnswerView.js rankingCardHtml), lifted so the card and V7's "How the money is taken" rank one way. Rows are
 * [{ id, r, sc }] — `r` a strategy result (ruin.mc, terminal.p50, coverage), `sc` its score (scoreStrategy: vac,
 * coverageRatio) or null; every row is kept and gains `share` (the share of futures paid in full). `by`: 'lasts' (the
 * default — the share, ties by coverage), 'left' (typically left), 'score', 'coverage'. A stable sort, highest first.
 */
export function rankWays(rows, by = 'lasts') {
  const out = (rows || []).map((x) => { const share = Math.max(0, Math.min(1, (100 - (+x.r.ruin.mc || 0)) / 100)); return { ...x, share }; });
  const keyOf = (x) => by === 'left' ? (+x.r.terminal.p50 || 0) : by === 'score' ? (x.sc ? x.sc.vac : 0) : by === 'coverage' ? (x.sc ? x.sc.coverageRatio : 0) : x.share * 1000 + (+x.r.coverage || 0);
  out.sort((a, b) => keyOf(b) - keyOf(a));
  return out;
}

/**
 * The Strategies ranking: by how many futures out of 10 each strategy lasts (the share of futures the plan is paid in
 * full), ties broken by the share of the plan's years it paid for. Rows: [{ id, r }] → [{ id, r, share, lasts }].
 */
export function rankByLasting(rows) {
  const out = (rows || []).filter((x) => x && x.r && x.r.affordable).map((x) => {
    const share = Math.max(0, Math.min(1, (100 - num(x.r.ruin && x.r.ruin.mc)) / 100));
    return { ...x, share, lasts: futuresOutOfTen(share) };
  });
  out.sort((a, b) => (b.share - a.share) || (num(b.r.coverage) - num(a.r.coverage)));
  return out;
}

/** What the plan's cuts setting is, in words — the one line every screen says about the cuts it ran with. */
export function cutsSettingWords(settings, strategyId) {
  const s = settings || {};
  const family = !strategyId || strategyId === 'pots-and-valves' || strategyId === 'buckets-in-order';
  if (!family) return 'no spending cuts — ' + (strategyId === 'floor-and-flex' ? 'the treats flex instead' : 'this strategy pays the plan in full until it cannot');
  if (s.disableProtection) return 'with spending cuts in a slump switched OFF (as you set it): the plan is paid in full until the money runs out';
  const cut = Math.round((1 - (s.protectionMult ?? 0.8)) * 100);
  const months = s.consecutiveLimit ?? 3;
  return 'with the spending cuts you set (up to ' + cut + '% after ' + months + ' month' + (months === 1 ? '' : 's') + ' in a row below the glidepath)';
}
