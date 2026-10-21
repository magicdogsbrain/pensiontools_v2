/**
 * A plan from a seed — the pure part of "keep this answer as a plan", lifted line for line out of services/PlanSeed.js
 * and storage/ScenarioRepository.js (6.39.0, road-to-7.md step 7: the preview makes a plan itself, and may not reach the
 * repositories — tests/v7/boundaries.test.js rule 3a). The precedent is services/PlanCommit.js (6.38.0).
 *
 *   from storage/ScenarioRepository.js   getDefaultTaxYears, getDefaultBudget, defaultStrategyBlock, getDefaultScenario
 *   from services/PlanSeed.js            the seed's versions and life, the words of the name check, the name rules
 *                                        (cleanPlanName, checkPlanName, uniqueName), the seed check (checkSeed), the
 *                                        mapping (seedToScenario and everything it reads: the income target, compressSteps,
 *                                        the budget sheet, the description), targetAtAge, answerLastedWords
 *
 * Each repository keeps its name as a re-export, so nothing the planner calls changes. The seed's reading and storage
 * (readSeed, clearSeed, the receipts), the create path through the store (createPlansFromSeed, confirmAndCreate) and
 * the words of the planner's entry stay in services/PlanSeed.js.
 *
 * Pure: no storage, no DOM, no clock of its own — `today` is passed in; `defaultStrategyBlock(lockedAt)` and
 * `getDefaultScenario(…, now)` take the time they stamp (the repository's wrappers read the clock, as the originals did;
 * seedToScenario passes the day the plan is made, which planFor stamps on the strategy block anyway).
 *
 * QUESTION_TITLES: the question a seed came from, in the plan's description. 'd' joined in 6.39.0 (question D).
 */
import { getDefaultDecisionSettings } from './PlanCommit.js';
import { deriveTiming, taxYearStartOf } from './PlanTiming.js';
import { RISK_PRESETS } from './GlidepathService.js';
import { grossUpAnnual, defaultBudget, BUDGET_CATEGORIES, SUGGESTED_EXTRAS } from './BudgetModel.js';
import { amountAtAge } from './IncomeSchedule.js';
import { isChargesPct, DEFAULT_CHARGES_PCT } from './Charges.js';
import { isIsaGrowth, DEFAULT_ISA_GROWTH } from './IsaGrowth.js';
import { pctText, CHANCE_BARS } from './OneAnswer.js';
import { ENGINE_VERSION } from '../strategies/version.js';
import { SCHEMA_VERSION } from '../storage/schema.js';
import { getDefaultStressSettings } from '../storage/stressDefaults.js';

// ---- the defaults of a new plan (storage/ScenarioRepository.js, by the same names) -----------------------------------

/**
 * Default tax years object for a new scenario
 */
export function getDefaultTaxYears() {
  return {};
}

/**
 * Default budget object for a new scenario (net-first budgeting tool, Stage 0)
 */
export function getDefaultBudget() {
  return defaultBudget();
}

/**
 * Create a default scenario object
 * @param {string} name - Scenario name
 * @param {string} description - Scenario description
 * @param {string[]} enabledTools - Enabled tools array
 * @returns {object} Default scenario
 */
export function defaultStrategyBlock(lockedAt) {
  return { id: 'pots-and-valves', params: {}, lockedAt, engineVersion: ENGINE_VERSION };
}

/** `now`: the time the strategy block is stamped with (ISO). The repository's wrapper reads its clock; a pure caller passes it in. */
export function getDefaultScenario(name = 'My Plan', description = '', enabledTools = ['stress', 'decision'], now = null) {
  return {
    // The saved-plan schema version (6.15.0, ./schema.js). At the ROOT — never inside a settings map, so it
    // never enters decisionSettingsChecksum. New plans, duplicates and partner plans are born current.
    schemaVersion: SCHEMA_VERSION,
    planDetails: { name, description },
    enabledTools,
    isActive: true,
    // Phase B (strategy brief §3): every plan locks exactly one strategy. New plans start on
    // the incumbent; changing strategy is an explicit unlock/clone, never a silent edit.
    strategy: defaultStrategyBlock(now),
    decisionTool: {
      settings: getDefaultDecisionSettings(),
      history: [],
      taxYears: getDefaultTaxYears()
    },
    stressTool: {
      // Fund and platform charges (6.19.0): every new plan — "+ New plan", the setup wizard, a partner plan, a demo or
      // guest plan, a plan made from a V7 answer — starts at the default, 0.5% a year. A Stress setting only.
      // How the ISA and savings grow (6.22.0): every new plan starts "Mostly cash". A Stress setting only — never in
      // getDefaultStressSettings, which is merged under stored plans and would hand it to a locked one.
      settings: { ...getDefaultStressSettings(), chargesPct: DEFAULT_CHARGES_PCT, isaGrowth: DEFAULT_ISA_GROWTH }
    },
    budgetTool: {
      settings: getDefaultBudget()
    }
  };
}

// ---- the seed (services/PlanSeed.js, by the same names) --------------------------------------------------------------

/** The version V7 writes now for a flat spend (src/answers/keep/planSeed.js has the same value; a shaped spend writes 3). */
export const SEED_VERSION = 2;
/**
 * The versions this code makes plans from: 1 (one stop for everyone), 2 (each person at their own stop) and 3 (what is spent
 * changes with age: takeHome rows exact to the year, spend.shape).
 */
export const SEED_VERSIONS = Object.freeze([1, 2, 3]);
export const SEED_MAX_AGE_MS = 24 * 60 * 60 * 1000;
/** A seed dated further ahead than this was not written by this browser's clock in the last day: it is discarded. */
export const SEED_FUTURE_SLACK_MS = 5 * 60 * 1000;
export const PLAN_NAME_LIMITS = Object.freeze({ typedMax: 60 });

/** Every word the entry shows, in one place. Today's app's words; "without an account", never "guest". */
export const SEED_WORDS = Object.freeze({
  nothingWaiting: 'There was nothing waiting to be saved. If you pressed Save more than a day ago, please do it again.',
  signedOut: 'Sign in or make a free account to keep this plan, or carry on without an account (kept in this tab only).',
  carryOn: 'Carry on without an account',
  signIn: 'Sign in or make an account',
  save: 'Save as a new plan',
  notNow: 'Not now',
  empty: 'Give the plan a name.',
  tooLong: 'Keep the name to 60 characters or fewer.',
  failed: (why) => 'Could not save the plan: ' + (String(why || '').trim() || 'something went wrong') + '. Your figures are still waiting; try again.',
  /** The seed went (or was replaced) while the confirm box was open: another window used it, or a later Save took its place. */
  usedElsewhere: 'These figures were used or replaced in another window, so no plan was made here. Go back to the question and press Save again if you want this plan.',
  back: 'Back to the question'
});



export const QUESTION_TITLES = Object.freeze({ c: 'What is that a month?', a: 'When can I afford to stop work?', b: 'Am I saving enough?', d: 'Will it last?' });
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DB_INDEXATION = Object.freeze({ prices: 'cpi', pricesCapped5: 'lpi5', none: 'level' });
const ENABLED_TOOLS = Object.freeze(['budget', 'stress', 'decision', 'accumulation', 'household']);


// ---- small helpers --------------------------------------------------------------------------------------------------

export const isObj = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
export const isNum = (v) => typeof v === 'number' && Number.isFinite(v);
const isMoney = (v) => isNum(v) && v >= 0;
const isAge = (v) => Number.isInteger(v) && v >= 0 && v <= 130;
const round2 = (v) => Math.round(v * 100) / 100;
const clone = (v) => JSON.parse(JSON.stringify(v));   // also drops undefined: the plan must be Firestore-safe

/** 'YYYY-MM-DD' → a LOCAL Date (never new Date('YYYY-MM-DD'), which is midnight UTC). Null when not a real day. */
export function localDate(day) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(day ?? ''));
  if (!m) return null;
  const d = new Date(+m[1], +m[2] - 1, +m[3]);
  return d.getFullYear() === +m[1] && d.getMonth() === +m[2] - 1 && d.getDate() === +m[3] ? d : null;
}
/** A Date's LOCAL calendar day as 'YYYY-MM-DD'. */
export function localDay(d) {
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}
/** '£341,000' — whole pounds, commas, no locale lookup. */
export function gbp(n) { return '£' + String(Math.round(Math.abs(+n || 0))).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
/** A pot in a sentence: to the nearest £1,000 (language guide 3.5). */
export const pot = (n) => gbp(Math.round((+n || 0) / 1000) * 1000);
/** '1 Oct 2026' */
export function dayWords(day) { const d = localDate(day); return d ? d.getDate() + ' ' + MONTHS[d.getMonth()] + ' ' + d.getFullYear() : String(day); }


// ---- names (Contract C.4) -------------------------------------------------------------------------------------------

/** NFC, control characters and line breaks removed, runs of spaces made one, ends trimmed. */
export function cleanPlanName(text) {
  return String(text ?? '').normalize('NFC').replace(/[\p{Cc}\p{Zl}\p{Zp}]/gu, '').replace(/\s+/gu, ' ').trim();
}

/** A typed name: empty or over 60 characters (counted as characters) is refused with a plain message. */
export function checkPlanName(text) {
  const name = cleanPlanName(text);
  if (name === '') return { ok: false, problem: 'empty', message: SEED_WORDS.empty };
  if ([...name].length > PLAN_NAME_LIMITS.typedMax) return { ok: false, problem: 'tooLong', message: SEED_WORDS.tooLong };
  return { ok: true, name };
}

/**
 * The name made different from every name already taken (compared cleaned, upper and lower case alike) by adding
 * " (2)", " (3)" … — the lowest number free. A name the app builds this way may pass 60 characters.
 */
export function uniqueName(name, existingNames = []) {
  const key = (s) => cleanPlanName(s).toLowerCase();
  const base = cleanPlanName(name);
  const taken = new Set((Array.isArray(existingNames) ? existingNames : []).map(key));
  if (!taken.has(key(base))) return base;
  for (let n = 2; ; n++) { const c = base + ' (' + n + ')'; if (!taken.has(key(c))) return c; }
}


// ---- the seed: checking and reading (Contract C.1, C.2) ---------------------------------------------------------------

function personProblem(p, i, seed) {
  const at = 'people.' + i;
  if (!isObj(p)) return at + ' is not a person';
  if (p.who !== (i === 0 ? 'you' : 'partner')) return at + '.who';
  for (const k of ['ageToday', 'ageAtStop', 'pensionOpensAge']) if (!isAge(p[k])) return at + '.' + k;
  if (p.ageAtStop < p.ageToday) return at + '.ageAtStop is before today';
  for (const k of ['pension', 'savings']) {
    const m = p[k];
    if (!isObj(m) || !isMoney(m.today) || !isObj(m.atStop) || !isMoney(m.atStop.careful) || !isMoney(m.atStop.middling)) return at + '.' + k;
  }
  const moneyOrNone = (v) => v == null || isMoney(v);
  if (p.payIn != null && (!isObj(p.payIn) || !isMoney(p.payIn.total) || !moneyOrNone(p.payIn.own) || !moneyOrNone(p.payIn.employer) || !moneyOrNone(p.payIn.savingsIn))) return at + '.payIn';
  if (p.statePension != null && (!isObj(p.statePension) || !isMoney(p.statePension.yearly) || !isAge(p.statePension.fromAge) || !localDate(p.statePension.fromDate))) return at + '.statePension';
  if (p.finalSalary != null && (!isObj(p.finalSalary) || !isMoney(p.finalSalary.yearly) || !isAge(p.finalSalary.fromAge) || !DB_INDEXATION[p.finalSalary.increases])) return at + '.finalSalary';
  if (p.partTime != null && (!isObj(p.partTime) || !isMoney(p.partTime.yearly) || !isMoney(p.partTime.years))) return at + '.partTime';
  if (typeof p.taxFreeQuarter !== 'boolean') return at + '.taxFreeQuarter';
  if (!Array.isArray(p.takeHome) || !p.takeHome.length) return at + '.takeHome';
  for (let r = 0; r < p.takeHome.length; r++) {
    const row = p.takeHome[r];
    if (!isObj(row) || !isAge(row.fromAge) || !isMoney(row.perMonth)) return at + '.takeHome.' + r;
    if (r > 0 && !(row.fromAge > p.takeHome[r - 1].fromAge)) return at + '.takeHome.' + r + ' is out of order';
  }
  if (seed.seedVersion === 1 && seed.stop.kind === 'now' && p.ageAtStop !== p.ageToday) return at + '.ageAtStop must be today\'s age when taking money now';
  return null;
}

const PAY_COVERS = [0, 0.5, 1];

/**
 * Version 2's own stops (research/v7/couples-different-years.md 6.1): each person's `stop` ({ kind: 'now' | 'later',
 * yearsFromNow }, 'later' exactly when it is after today) with their age at it, the household's stop the first of them,
 * each person's `years` ending with the household's, and a pay line (`untilBothStop`) exactly when the stops differ.
 * "Taking money now" is checked per person (K4): a partner still working is older at their stop than today.
 */
function stopsProblem(seed) {
  const people = seed.people;
  for (let i = 0; i < people.length; i++) {
    const p = people[i], at = 'people.' + i, st = p.stop;
    if (!isObj(st) || (st.kind !== 'now' && st.kind !== 'later') || !Number.isInteger(st.yearsFromNow) || st.yearsFromNow < 0
      || (st.kind === 'later') !== (st.yearsFromNow > 0)) return at + '.stop';
    if (p.ageAtStop !== p.ageToday + st.yearsFromNow) {
      return at + (st.kind === 'now' ? '.ageAtStop must be today\'s age when taking money now' : '.ageAtStop is not their age at their stop');
    }
    if (!Number.isInteger(p.years) || p.years < 1 || p.years > 60) return at + '.years';
  }
  const first = people.reduce((a, p) => (p.stop.yearsFromNow < a.stop.yearsFromNow ? p : a), people[0]).stop;
  if (seed.stop.kind !== first.kind || seed.stop.yearsFromNow !== first.yearsFromNow) return 'stop is not the first of the people\'s stops';
  for (let i = 0; i < people.length; i++) {
    if (people[i].years !== seed.years - (people[i].stop.yearsFromNow - first.yearsFromNow)) return 'people.' + i + '.years does not end with the plan\'s';
  }
  const apart = new Set(people.map((p) => p.stop.yearsFromNow)).size > 1;
  const u = seed.untilBothStop;
  if (apart ? !(isObj(u) && PAY_COVERS.includes(u.payCovers)) : u !== null) return 'untilBothStop';
  return null;
}

/**
 * A seed as version 2 reads: a version 1 seed (one stop for everyone) with each person at the household's stop and years,
 * and no pay line. A version 2 seed as it is.
 */
export function asVersion2(seed) {
  if (seed.seedVersion !== 1) return seed;
  return { ...seed, untilBothStop: null, people: seed.people.map((p) => ({ ...p, stop: { ...seed.stop }, years: seed.years })) };
}

/**
 * Version 3's shape (spending-shape.md 8.2): kinds, ages rising, amounts not below nothing. Only for the record and the
 * description — nothing is worked out from it — but a seed that carries a bad one is refused, as any other bad field.
 */
function shapeProblem(shape) {
  if (!isObj(shape) || shape.unit !== 'perMonth' || !isObj(shape.start) || !Array.isArray(shape.steps)) return 'spend.shape';
  const THEN = ['level', 'falls', 'glides'];
  const thenBad = (x) => !THEN.includes(x.then) || (x.then === 'falls' && !(isNum(x.fallsPct) && x.fallsPct > 0 && x.fallsPct <= 50));
  if (thenBad(shape.start)) return 'spend.shape.start';
  for (let i = 0; i < shape.steps.length; i++) {
    const x = shape.steps[i];
    if (!isObj(x) || !isAge(x.fromAge) || !isMoney(x.perMonth) || thenBad(x)) return 'spend.shape.steps.' + i;
    if (i > 0 && !(x.fromAge > shape.steps[i - 1].fromAge)) return 'spend.shape.steps.' + i + ' is out of order';
  }
  return null;
}

/** A couple stopping in different years (version 2, with a pay line). */
export const apartOf = (seed) => seed.household === 'couple' && isObj(seed.untilBothStop);

function budgetProblem(b) {
  if (b == null) return null;
  if (!isObj(b) || !Array.isArray(b.lines)) return 'budget.lines';
  for (let i = 0; i < b.lines.length; i++) {
    const l = b.lines[i];
    if (!isObj(l) || typeof l.label !== 'string' || !isMoney(l.annual) || typeof l.essential !== 'boolean') return 'budget.lines.' + i;
  }
  if (b.oneOffs != null && !Array.isArray(b.oneOffs)) return 'budget.oneOffs';
  for (let i = 0; i < (b.oneOffs || []).length; i++) {
    const o = b.oneOffs[i];
    if (!isObj(o) || typeof o.label !== 'string' || !isMoney(o.amount) || !Number.isInteger(o.year) || !(o.everyYears == null || (Number.isInteger(o.everyYears) && o.everyYears > 0))) return 'budget.oneOffs.' + i;
  }
  return null;
}

/**
 * Is this a seed this code can make a plan from, now? Version, age (at most a day old, at most five minutes ahead of
 * this clock) and every field the mapping reads.
 * @returns {{ ok: true } | { ok: false, problem: 'unreadable'|'version'|'expired'|'future'|'shape', detail?: string }}
 */
export function checkSeed(seed, nowMs) {
  if (!isObj(seed)) return { ok: false, problem: 'unreadable' };
  if (!SEED_VERSIONS.includes(seed.seedVersion)) return { ok: false, problem: 'version', detail: String(seed.seedVersion) };
  const created = Date.parse(seed.createdAt);
  if (typeof seed.createdAt !== 'string' || !Number.isFinite(created)) return { ok: false, problem: 'unreadable', detail: 'createdAt' };
  if (nowMs - created > SEED_MAX_AGE_MS) return { ok: false, problem: 'expired' };
  if (created - nowMs > SEED_FUTURE_SLACK_MS) return { ok: false, problem: 'future' };
  const bad = (detail) => ({ ok: false, problem: 'shape', detail });
  if (!localDate(seed.today)) return bad('today');
  if (!QUESTION_TITLES[seed.source]) return bad('source');
  if (!isObj(seed.name) || typeof seed.name.chosen !== 'string') return bad('name');
  if (seed.household !== 'single' && seed.household !== 'couple') return bad('household');
  if (!isObj(seed.stop) || (seed.stop.kind !== 'now' && seed.stop.kind !== 'later')) return bad('stop');
  if (!Number.isInteger(seed.years) || seed.years < 1 || seed.years > 60) return bad('years');
  if (!isAge(seed.endAge)) return bad('endAge');
  if (!RISK_PRESETS[seed.risk]) return bad('risk');
  if (!isObj(seed.spend) || !isMoney(seed.spend.perMonth)) return bad('spend');
  if (!Array.isArray(seed.people) || seed.people.length !== (seed.household === 'couple' ? 2 : 1)) return bad('people');
  for (let i = 0; i < seed.people.length; i++) { const p = personProblem(seed.people[i], i, seed); if (p) return bad(p); }
  if (seed.seedVersion >= 2) { const st = stopsProblem(seed); if (st) return bad(st); }
  if (seed.seedVersion === 3) { const sh = shapeProblem(seed.spend.shape); if (sh) return bad(sh); }
  const b = budgetProblem(seed.budget); if (b) return bad(b);
  return { ok: true };
}



// ---- the mapping (Contract C.3, C.5) --------------------------------------------------------------------------------

/** Each row of take-home (after tax, £ a month) → the planner's before-tax target, £ a year (BudgetModel.grossUpAnnual). */
const grossRow = (perMonth) => Math.round(grossUpAnnual(perMonth * 12));

/**
 * The falls a step of today's planner can hold and SHOW: its editor's slider ("Your income shape", index.html: <input
 * type=range min=0 max=5 step=0.25>), so a fall written here is one the person can see and move back. The model takes up to
 * 50, but a 7.5% fall showed as 5% beside a label saying 7.5%, and touching the slider changed it (review, 2 Oct 2026).
 */
export const PLANNER_DECLINE = Object.freeze({ step: 0.25, max: 5 });

/**
 * The fewest income steps whose compiled amount (IncomeSchedule.amountAtAge, rounded to the pound as the Stress save rounds
 * it) is g[y] in every year y, the first from `ageNow` (spending-shape.md 8.2). Greedy from year 0: a level stretch is one
 * step; else the longest glide whose straight line rounds to g at every year between its ends (the next step starts at the
 * far end); else the longest decline at a quarter-point rate from 0.25% to today's slider's 5% (PLANNER_DECLINE) that rounds
 * to g every year (it happens below the personal allowance); else one step for that year (a faster fall, V7 allowing 10%,
 * is one step a year). Pure.
 * @param {number[]} g   whole pounds a year, before tax, for ages ageNow, ageNow + 1, …
 * @returns {{ fromAge: number, amount: number, decline?: number, glideToNext?: true }[]}
 */
export function compressSteps(g, ageNow) {
  const n = g.length;
  const steps = [];
  let i = 0;
  while (i < n) {
    let j = i + 1;
    while (j < n && g[j] === g[i]) j++;
    if (j - i >= 2 || j === n) { steps.push({ fromAge: ageNow + i, amount: g[i] }); i = j; continue; }
    // a glide from i to k: amountAtAge's straight line, k − i years long, arriving at g[k] as the next step starts
    let glide = -1;
    for (let k = i + 2; k < n; k++) {
      let fits = true;
      for (let y = i + 1; y < k && fits; y++) fits = Math.round(g[i] + (g[k] - g[i]) * (y - i) / (k - i)) === g[y];
      if (fits) glide = k;
    }
    // a decline at a quarter-point rate today's slider can show: amountAtAge's amount × (1 − d)^t
    let decline = null;
    for (let q = 1; q * PLANNER_DECLINE.step <= PLANNER_DECLINE.max; q++) {
      const d = q * PLANNER_DECLINE.step;
      let t = 1;
      while (i + t < n && Math.round(g[i] * Math.pow(1 - d / 100, t)) === g[i + t]) t++;
      if (t - 1 >= 2 && (!decline || t > decline.t)) decline = { d, t };
    }
    const glideYears = glide > 0 ? glide - i : 0;
    const declineYears = decline ? decline.t : 0;
    if (glideYears >= 2 && glideYears >= declineYears) { steps.push({ fromAge: ageNow + i, amount: g[i], glideToNext: true }); i = glide; continue; }
    if (declineYears >= 3) { steps.push({ fromAge: ageNow + i, amount: g[i], decline: decline.d }); i += declineYears; continue; }
    steps.push({ fromAge: ageNow + i, amount: g[i] });
    i += 1;
  }
  return steps;
}

/**
 * The income target from one person's take-home rows EXACT TO THE YEAR (seed version 3): each year's before-tax figure by
 * today's own sum on the row in force at that age (the first row from the plan's start), then compressSteps. A £0 year
 * after one above £0 cannot be a step (the planner drops £0 steps), so then — as for version 2 — the per-year
 * targetSchedule is written too.
 */
function incomeTargetByYear(rows, shapeAgeNow, duration) {
  const at = (age) => { let r = rows[0]; for (const x of rows) if (x.fromAge <= age) r = x; return r; };
  const g = Array.from({ length: duration + 1 }, (_, y) => grossRow(at(shapeAgeNow + y).perMonth));
  const first = g.findIndex((v) => v > 0);
  if (first < 0) return { incomeShape: 'level', baseSalary: 0, incomeSteps: [{ fromAge: shapeAgeNow, amount: 0 }] };
  const steps = compressSteps(g, shapeAgeNow).filter((x) => x.amount > 0);
  if (steps.length === 1 && !steps[0].decline && !steps[0].glideToNext) return { incomeShape: 'level', baseSalary: steps[0].amount, incomeSteps: [{ fromAge: shapeAgeNow, amount: steps[0].amount }] };
  const out = { incomeShape: 'phases', baseSalary: first === 0 ? g[0] : 0, incomeSteps: steps };
  if (g.slice(first).some((v) => v === 0)) out.targetSchedule = g.slice();
  return out;
}

/**
 * The income target from one person's take-home rows (Contract C.3, S.baseSalary / incomeShape / incomeSteps).
 * One row: level. More: phases, the first step from the plan's start age. Leading £0 rows: no target until the first
 * row above £0. A £0 row AFTER one above £0 (a couple whose guaranteed income covers everything later) cannot be a step
 * — the planner ignores steps of £0 — so that case alone also writes the per-year targetSchedule the engines read.
 */
function incomeTarget(rows, shapeAgeNow, duration) {
  const steps = rows.map((r, i) => ({ fromAge: i === 0 ? shapeAgeNow : r.fromAge, amount: grossRow(r.perMonth) }));
  const first = steps.findIndex((s) => s.amount > 0);
  if (first < 0) return { incomeShape: 'level', baseSalary: 0, incomeSteps: [{ fromAge: shapeAgeNow, amount: 0 }] };
  if (steps.length === 1) return { incomeShape: 'level', baseSalary: steps[0].amount, incomeSteps: [{ fromAge: shapeAgeNow, amount: steps[0].amount }] };
  const kept = steps.slice(first);
  const out = { incomeShape: 'phases', baseSalary: first === 0 ? steps[0].amount : 0, incomeSteps: kept };
  if (kept.some((s) => s.amount === 0)) {
    // the exact schedule: each year's amount from the row in force at that age (£0 included)
    const at = (age) => { let a = out.baseSalary; for (const s of kept) if (s.fromAge <= age) a = s.amount; return a; };
    out.targetSchedule = Array.from({ length: duration + 1 }, (_, y) => at(shapeAgeNow + y));
  }
  return out;
}

const HINTS = (() => {
  const m = new Map();
  for (const c of [...BUDGET_CATEGORIES.essential, ...BUDGET_CATEGORIES.discretionary, ...SUGGESTED_EXTRAS]) if (!m.has(c.label)) m.set(c.label, c.hint || '');
  return m;
})();

/**
 * The plan's Budget tool (Contract C.5). The sheet's lines are copied as they are, for the person's own judgement;
 * nothing in the plan's figures is taken from them. With no sheet: a blank budget with the ages, and the Budget page
 * adds its starter lines the first time it is opened. Whether each of you has stopped is each person's own (seed
 * version 2, K3): `retired` this person's, `partnerRetired` and `partnerRetirementAge` the other's.
 */
function budgetFor(seed, p, other, endAge) {
  const couple = seed.household === 'couple';
  const b = {
    ...defaultBudget(p.ageToday, p.ageAtStop, endAge),
    currentAgeAsOf: seed.today, agesSetByUser: true,
    retired: p.stop.kind === 'now',
    plsaTier: ['minimum', 'moderate', 'comfortable'].includes(seed.spend.level) ? seed.spend.level : 'moderate',
    sharedWithPartner: couple,
    mySharePct: couple && seed.spend.perMonth > 0 ? Math.round(100 * p.takeHome[0].perMonth / seed.spend.perMonth) : 50
  };
  if (couple) Object.assign(b, { partnerAge: other.ageToday, partnerRetirementAge: other.ageAtStop, partnerRetired: other.stop.kind === 'now' });
  // One sheet, the household's: it goes on YOUR plan only, so there is one place to change it.
  if (p.who === 'you' && seed.budget) {
    const yearToday = localDate(seed.today).getFullYear();
    b.lines = seed.budget.lines.filter((l) => l.annual > 0).map((l) => ({
      label: l.label, tier: l.essential ? 'essential' : 'discretionary', annual: l.annual,
      period: l.period === 'yr' ? 'yr' : 'mo', fromAge: null, toAge: null, hint: HINTS.get(l.label) || '',
      ...(l.heading ? { heading: l.heading } : {}), ...(couple ? { paidBy: 'shared' } : {})
    }));
    b.oneOffs = (seed.budget.oneOffs || []).filter((o) => o.amount > 0).map((o) => ({
      label: o.label, tier: 'essential', hint: '', amount: o.amount,
      atAge: p.ageToday + (o.year - yearToday), everyYears: o.everyYears > 0 ? o.everyYears : null
    }));
  }
  return b;
}

/**
 * "lasted to 95 in 4 futures out of 10 (43%)" — the quick answer's own figure, beside which the planner's percentage
 * can be read (language guide 3.4's counting, with the share as the planner states it). '' when the seed has none.
 */
export function answerLastedWords(seed) {
  const share = seed && seed.answer && isNum(seed.answer.lasted) ? Math.max(0, Math.min(1, seed.answer.lasted)) : null;
  if (share === null) return '';
  const out = share >= 1 ? 'in every future it tried'
    : share >= 0.95 ? 'in more than 9 futures out of 10'
    : share >= 0.9 ? 'in 9 futures out of 10'
    : share >= 0.85 ? 'in just under 9 futures out of 10'   // not the 9 in 10 "on course" is (6.22.0; V7's lastedText)
    : share >= 0.15 ? 'in ' + Math.round(share * 10) + ' futures out of 10'
    : share >= 0.05 ? 'in only 1 future out of 10'
    : share > 0 ? 'in fewer than 1 future out of 10' : 'in none of the futures it tried';
  const to = seed.household === 'couple' ? 'until the younger of you was ' + seed.endAge : 'to ' + seed.endAge;
  return 'the money lasted ' + to + ' ' + out + ' (' + pctText(share * 100, 0, CHANCE_BARS) + ')';
}

/**
 * Why the planner's own test differs from the quick answer, and the quick answer's figure (found 1 Oct 2026: the gaps were
 * not "a little"). Per person: `p` at their own stop (a seed read as version 2). A couple apart, the partner's plan says
 * whose stop: "before your partner stops".
 */
export function differenceWords(seed, p) {
  const lasted = answerLastedWords(seed);
  const tail = lasted ? ', where ' + lasted + '.' : '.';
  const before = apartOf(seed) && p.who === 'partner' ? 'before your partner stops' : 'before you stop';
  return p.stop.kind === 'later'
    ? `This plan starts from the middling pot at ${p.ageAtStop} and does not vary the years ${before}, so its tests can differ from the quick answer${tail}`
    : `The planner runs its own test, so its figures can differ from the quick answer${tail}`;
}

/** "you" / "your partner" and the words that go with each. */
const WHO = Object.freeze({
  you: { subject: 'you', stops: 'stop', pay: 'your pay', Plan: 'Your plan', pronoun: 'you' },
  partner: { subject: 'your partner', stops: 'stops', pay: 'their pay', Plan: 'Their plan', pronoun: 'they' }
});

/**
 * A couple apart (research/v7/couples-different-years.md 6.2, "coupleWords"): until the second stop, who pays what — the
 * one still working covers `payCovers` of what you spend from their pay and the plan of the one who has stopped pays the
 * rest — and where the savings between you are (with whoever stops first). `p` is this plan's person; `names` the two
 * plans' final names.
 */
function apartWords(seed, p, names) {
  const first = seed.people.reduce((a, x) => (x.stop.yearsFromNow < a.stop.yearsFromNow ? x : a), seed.people[0]);
  const joiner = seed.people.find((x) => x !== first);
  const J = WHO[joiner.who], F = WHO[first.who];
  const firstName = '‘' + (first.who === 'you' ? names.yours : names.partner) + '’';
  const until = `Until ${J.subject} ${J.stops} at ${joiner.ageAtStop}, `;
  const begins = ` ${J.Plan} begins when ${J.pronoun} stop.`;
  const covers = seed.untilBothStop.payCovers;
  const paid = p === first
    ? (covers >= 1 ? until + `${J.pay} covers all of what you spend and this plan's money is left alone.` + begins
      : covers > 0 ? until + `this plan pays half of what you spend and ${J.pay} covers the rest.` + begins
        : until + 'this plan pays all of what you spend.' + begins)
    : `This plan begins when ${J.subject} ${J.stops} at ${joiner.ageAtStop}. Until then `
      + (covers >= 1 ? `${J.pay} covers all of what you spend.`
        : covers > 0 ? `${J.pay} covers half of what you spend and ${firstName} pays the rest.`
          : `${firstName} pays all of what you spend.`);
  const when = first.stop.kind === 'now' ? 'stopped' : F.stops;
  const savings = `Your savings between you are in ${p === first ? 'this plan' : firstName}, because ${F.subject} ${when} first.`;
  return paid + ' ' + savings;
}

/**
 * "£1,896 from 62, £2,194 from 67, £1,445 from 69" — one person's part of the monthly amount, by stretch of years. Rows exact
 * to the year (seed version 3) can be one a year: more than six read as the first three, then where they end.
 */
function partWords(p) {
  const rows = p.takeHome;
  const words = (r) => gbp(r.perMonth) + ' from ' + r.fromAge;
  if (rows.length <= 6) return rows.map(words).join(', ');
  return rows.slice(0, 3).map(words).join(', ') + ', changing year by year to ' + words(rows[rows.length - 1]);
}

/**
 * Seed version 3 (spending-shape.md 8.3): what is spent, after tax, as the answer tested it — "Spending, after tax at today's
 * prices: £2,500 a month from 62, £2,130 from 75, £1,750 from 85." — and, where it falls a little each year, why the
 * plan holds one step a year. '' for a flat spend.
 */
function shapeWords(seed, p) {
  const sh = seed.seedVersion === 3 && seed.spend && seed.spend.shape;
  if (!sh) return '';
  const pct = (x) => String(Math.round(x * 100) / 100);
  const then = (x) => (x.then === 'falls' ? ', then ' + pct(x.fallsPct) + '% less each year' : x.then === 'glides' ? ', then moving evenly to the next' : '');
  const start = seed.people.reduce((a, x) => (x.stop.yearsFromNow < a.stop.yearsFromNow ? x : a), seed.people[0]);
  const youAt = seed.people[0].ageToday + start.stop.yearsFromNow;
  const parts = [gbp(seed.spend.perMonth) + ' a month from ' + youAt + then(sh.start), ...sh.steps.map((x) => gbp(x.perMonth) + ' from ' + x.fromAge + then(x))];
  const falls = [sh.start, ...sh.steps].some((x) => x.then === 'falls');
  const many = p.takeHome.length > 6;
  // a part that falls or moves evenly carries a clause of its own: the parts are then kept apart with semicolons
  const sep = [sh.start, ...sh.steps].some((x) => x.then !== 'level') ? '; ' : ', ';
  return 'Spending, after tax at today\'s prices' + (seed.household === 'couple' ? ' (yours together, by your ages)' : '') + ': ' + parts.join(sep) + '.'
    + (falls && many ? ' Where it falls a little each year, this plan holds it as one step a year; each gives the same after-tax amount as the answer.' : '');
}

/**
 * A couple's line: whose part of the chosen amount this plan holds, where the rest is, the even split of the savings
 * (V7 splits them that way; found 1 Oct 2026: "the ISA is half of what was typed" with nothing on screen to say why).
 */
export function coupleWords(seed, p, names) {
  if (seed.household !== 'couple' || !names) return '';
  const mine = p.who === 'you';
  const other = mine ? names.partner : names.yours;
  const between = apartOf(seed) ? apartWords(seed, p, names) : 'Savings are split evenly between you.';
  return (mine ? 'This plan holds your part' : 'This plan holds your partner\'s part') + ' of the ' + gbp(seed.spend.perMonth) + ' a month ('
    + partWords(p) + '); ' + (mine ? 'your partner\'s part' : 'your part') + ' is in ‘' + other + '’. ' + between + ' The Household tab checks the two plans together.';
}

/** The plan's description (Contract C.3): what it came from, why its tests differ (and the answer's own figure), and for a couple whose part it holds. */
function describe(seed, p, names = null) {
  const later = p.stop.kind === 'later';
  const title = QUESTION_TITLES[seed.source];
  const on = dayWords(seed.today);
  let first = `From '${title}' on ${on}.`;
  if (later) {
    const pm = p.pension.atStop.middling, sm = p.savings.atStop.middling;
    const pc = p.pension.atStop.careful, sc = p.savings.atStop.careful;
    const parts = [];
    if (pm > 0) parts.push(['a pension of about ' + pot(pm), pot(pc)]);
    if (sm > 0) parts.push(['savings of about ' + pot(sm), pot(sc)]);
    if (parts.length) {
      const mid = parts.map((x) => x[0]).join(' and ');
      const bad = parts.map((x) => x[1]).join(' and ');
      first = `From '${title}' on ${on}: ${mid} at ${p.ageAtStop} in a middling case, ${bad} in a bad case (the worst 1 in 10).`;
    }
  }
  let second = differenceWords(seed, p);
  const hasPension = p.pension.today > 0 || p.pension.atStop.middling > 0;
  if (hasPension && p.pensionOpensAge > p.ageAtStop) {
    second += ' ' + (p.who === 'you' ? 'Your pension' : 'Your partner\'s pension') + ` cannot be touched until ${p.pensionOpensAge}; this planner does not hold it closed.`;
  }
  const third = coupleWords(seed, p, names);
  const shape = shapeWords(seed, p);
  return first + '\n' + second + (shape ? '\n' + shape : '') + (third ? '\n' + third : '');
}

/**
 * One person's plan (Contract C.3). `S` = stressTool.settings. `seed` is read as version 2 (asVersion2), so `p` carries
 * their own stop and years: the plan starts at their stop and ends with the household's plan. `record` is the seed as it
 * came, and this person in it, for `fromAnswer`.
 */
function planFor(seed, p, other, name, savedOn, lockedAt, names, record) {
  const later = p.stop.kind === 'later';
  const T = localDate(seed.today);
  const younger = Math.min(...seed.people.map((x) => x.ageToday));
  const endAge = seed.endAge + (p.ageToday - younger);   // the age THIS person is when the younger reaches the end age
  const plan = getDefaultScenario(name, describe(seed, p, names), [...ENABLED_TOOLS], lockedAt);
  plan.isActive = false;
  plan.strategy = defaultStrategyBlock(lockedAt);
  const S = plan.stressTool.settings;

  // State Pension first: its date is also the birthday today's app reckons ages from (PlanTiming.birthdayOf), so the
  // start below is derived exactly as every later load derives it. statePension 0 matters: without it the default
  // £12,000 would be used.
  const sp = p.statePension && p.statePension.yearly > 0 ? p.statePension : null;
  Object.assign(S, sp
    ? { statePension: sp.yearly, spStartDate: sp.fromDate, spWeeklyAmount: round2(sp.yearly / 52) }
    : { statePension: 0, spStartDate: null, spWeeklyAmount: 0 });

  // Who, when: the age today (dated), stopping later or taking money now.
  Object.assign(S, { configured: true, currentAge: p.ageToday, currentAgeAsOf: seed.today, retired: !later, retireAge: later ? p.ageAtStop : null });
  S.firstTaxYear = later ? deriveTiming(S, T).firstTaxYear : taxYearStartOf(T);
  S.shapeAgeNow = deriveTiming(S, T).shapeAgeNow;
  S.duration = p.years;

  // The pots: the intended mix is the risk level (never holdings). A £0 pension today on a plan stopping later cannot be
  // scaled up (its mix is the three pots), so the middling pot at the stop is written in its place (Q10); the true £0 is
  // kept in fromAnswer. Savings are one figure: today's £0 is written as it is, and the savings at the stop are the ISA at
  // retirement, which the runs start from (PlanTiming.isaAtRetirementOf). Until the review of 6.22.0 the savings at the
  // stop stood in for today's savings too, and the readers that now add what goes in each month counted it twice.
  const preset = RISK_PRESETS[seed.risk];
  const sippBase = later && !(p.pension.today > 0) ? p.pension.atStop.middling : p.pension.today;
  const equity = Math.round(sippBase * preset.equity), bond = Math.round(sippBase * preset.bond);
  Object.assign(S, {
    equityMin: equity, bondMin: bond, cashTarget: Math.round(sippBase) - equity - bond,
    allocMode: 'risk', taggedFunds: [], diversifierStart: 0, equityGlideEnabled: false,
    isaBalance: p.savings.today,
    isaDrawdownStrategy: 'minimiseEarlyTax', isaReturn: 0.03,
    potAtRetirement: later ? { sipp: p.pension.atStop.middling || null, isa: p.savings.atStop.middling || null, source: 'override' } : null
  });

  // The target: the person's own part of the monthly amount they chose, grossed up by today's own sum — exact to the year
  // when what is spent changes with age (seed version 3).
  Object.assign(S, seed.seedVersion === 3 ? incomeTargetByYear(p.takeHome, S.shapeAgeNow, p.years) : incomeTarget(p.takeHome, S.shapeAgeNow, p.years));

  // A final-salary pension and part-time work.
  const fs = p.finalSalary && p.finalSalary.yearly > 0 ? p.finalSalary : null;
  Object.assign(S, fs
    ? { dbAmount: fs.yearly, dbStartYear: Math.max(0, fs.fromAge - S.shapeAgeNow), dbIndexation: DB_INDEXATION[fs.increases] }
    : { dbAmount: 0, dbStartYear: 0, dbIndexation: 'lpi5' });
  const workYears = p.partTime ? Math.round(p.partTime.years) : 0;
  S.extraIncomes = p.partTime && p.partTime.yearly > 0 && workYears > 0
    ? [{ label: 'Part-time work', startYear: 0, endYear: workYears - 1, annual: p.partTime.yearly, indexation: 'cpi' }]
    : [];

  // V7's own assumptions, carried so the person can see and change them (Q9).
  Object.assign(S, {
    accessMethod: p.taxFreeQuarter ? 'ufpls' : 'drawdown', ufplsYears: null,
    disableProtection: true, hodlEnabled: false,
    pa: 12570, brl: 50270, hrl: 125140, taxMode: 'inflates', other: 0,
    strategyId: 'pots-and-valves', strategyParams: {}
  });
  // Fund and platform charges (6.19.0): the answer's one charge (its checked inputs travel in the seed), percent a year;
  // a seed without one (an older V7 tab) or with an invalid one gives the default every new plan gets. A Stress setting
  // only — the Decision settings never carry it.
  const answerCharge = seed.inputs && seed.inputs.charge;
  S.chargesPct = isChargesPct(answerCharge) ? answerCharge : DEFAULT_CHARGES_PCT;
  // How the ISA and savings grow (6.22.0): the answer's own choice under its savings box ("Mostly cash" or "Invested like
  // my pension"), carried in its checked inputs like the charge; a seed without one (an older V7 tab) or with an invalid
  // one gives the default every new plan gets, "Mostly cash". A Stress setting only.
  const answerIsaGrowth = seed.inputs && seed.inputs.isaGrowth;
  S.isaGrowth = isIsaGrowth(answerIsaGrowth) ? answerIsaGrowth : DEFAULT_ISA_GROWTH;

  // Month by month: the wizard's two fields only — nothing recorded, not locked (Q11).
  plan.decisionTool = { settings: { ...getDefaultDecisionSettings(), duration: p.years, firstTaxYear: S.firstTaxYear }, history: [], taxYears: {} };

  // Money still going in: the saving section. V7's figures are what lands in the pension, the tax added back included;
  // relief at source makes gross = net ÷ 0.8, so the person's own part is entered as × 0.8 and what lands is V7's figure.
  // A split with a part missing takes it as the rest of the total. What goes into savings each month (6.22.0) has its own
  // box, "Into ISAs and savings" (isaMonthly): the section is written when either is above £0.
  const pay = p.payIn;
  const savingsIn = pay && isMoney(pay.savingsIn) && pay.savingsIn > 0 ? pay.savingsIn : 0;
  if (later && pay && (pay.total > 0 || savingsIn > 0)) {
    const split = pay.kind === 'split';
    const employer = split ? (isMoney(pay.employer) ? pay.employer : Math.max(0, pay.total - (pay.own || 0))) : 0;
    const own = split ? (isMoney(pay.own) ? pay.own : Math.max(0, pay.total - employer)) : pay.total;
    plan.accumulationTool = { settings: {
      currentAge: p.ageToday, retirementAge: p.ageAtStop, potNow: p.pension.today, salary: 0, schemeType: 'ras',
      netMonthly: round2(own * 0.8), employerMonthly: employer, escalationPct: 0, ...(savingsIn > 0 ? { isaMonthly: savingsIn } : {})
    } };
  }

  plan.budgetTool = { settings: budgetFor(seed, p, other, endAge) };

  // The record of where it came from: the seed as it came, less the budget, this person only.
  const { budget, people, ...rest } = record.seed;
  plan.fromAnswer = { ...clone(rest), people: [clone(record.person)], who: p.who, savedOn };
  return clone(plan);
}

/**
 * The plan document(s) a seed makes (Contract C.3). No ids, not active, born at SCHEMA_VERSION; `isActive`, the
 * partner link and the final names are set by createPlansFromSeed.
 * @param {object} seed       a seed that passed checkSeed
 * @param {Date|string} today the day the plan is made (fromAnswer.savedOn, strategy.lockedAt) — every other date comes
 *                            from seed.today
 * @param {{ name?: string, partnerName?: string }} [opts]   the name confirmed by the person (default: seed.name.chosen),
 *                            and the partner plan's final name (default: name + ' · partner')
 * @returns {{ yours: object, partner: object|null }}
 */
export function seedToScenario(seed, today, opts = {}) {
  const c = checkSeed({ ...seed, createdAt: new Date(0).toISOString() }, 0);   // the shape only; age is readSeed's job
  if (!c.ok) throw new Error('This plan seed cannot be used (' + c.problem + (c.detail ? ': ' + c.detail : '') + ').');
  const day = today instanceof Date ? today : localDate(today);
  if (!day) throw new Error('seedToScenario: today must be a Date or YYYY-MM-DD');
  const savedOn = localDay(day);
  const lockedAt = today instanceof Date ? today.toISOString() : savedOn + 'T00:00:00.000Z';
  const name = cleanPlanName(opts.name != null ? opts.name : seed.name.chosen);
  const read = asVersion2(seed);
  const [you, partner] = read.people;
  const names = partner ? { yours: name, partner: opts.partnerName != null ? String(opts.partnerName) : name + ' · partner' } : null;
  return {
    yours: planFor(read, you, partner || null, name, savedOn, lockedAt, names, { seed, person: seed.people[0] }),
    partner: partner ? planFor(read, partner, you, names.partner, savedOn, lockedAt, names, { seed, person: seed.people[1] }) : null
  };
}

/** What the planner's per-year target is at an age, from a made plan's settings (tests and the confirm line). */
export function targetAtAge(S, age) {
  if (Array.isArray(S.targetSchedule) && S.targetSchedule.length) return S.targetSchedule[Math.max(0, Math.min(S.targetSchedule.length - 1, age - S.shapeAgeNow))];
  return S.incomeShape === 'phases' ? amountAtAge(S.incomeSteps, age, S.baseSalary || 0) : S.baseSalary;
}
