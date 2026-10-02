/**
 * Plan seed — today's app's side of "keep this answer as a plan" (research/v7/save-as-plan.md, Contract C.2–C.5).
 *
 * V7 (the question pages at /v7/) writes ONE plain JSON object, the seed, to localStorage['pt_v7_plan_seed'] and opens
 * `/#new-plan`. Today's app reads it here, asks the person to confirm the plan's name, makes a NEW plan from it (two
 * linked plans for a couple), makes that plan the active one, and deletes the seed. No figure ever travels in an
 * address.
 *
 *   SEED_KEY, SEED_VERSION, SEED_VERSIONS, SEED_MAX_AGE_MS
 *                                               where the seed is kept, the version V7 writes now, the versions this code
 *                                               reads (1, 2 and 3), its life
 *   checkSeed(seed, nowMs)                      → { ok: true } | { ok: false, problem, detail }
 *   readSeed(storage, nowMs)                    → { seed } | { problem, createdAt? }; a seed with any problem is DELETED
 *   clearSeed(storage, createdAt?)              deletes it — only if it is still the seed `createdAt` names, when given
 *                                               (a newer seed written meanwhile is never deleted by an older one's use)
 *   seedStillWaiting(storage, createdAt)        the seed read at start is still the one stored (re-checked before a save)
 *   RECEIPT_KEY, writeReceipt(session, createdAt, outcome, name?)
 *                                               what became of a seed — 'made' | 'declined' | 'refused' | 'cleared' —
 *                                               left in THIS TAB's session storage for the V7 page that sent it, which
 *                                               the same tab goes Back to. No figure: the seed's time, the outcome, and
 *                                               the name only when a plan was made under it
 *   dropSeed(storage, session)                  sign-out: the seed deleted, whatever it is, and a 'cleared' receipt
 *   takeSeedEntry(storage, nowMs, hash, drop, session)
 *                                               the start-up read: { wanted, seed, problem }; `drop()` clears '#new-plan'
 *   seedToScenario(seed, today, { name, partnerName })
 *                                               → { yours, partner } — the plan documents, without ids (Contract C.3, C.5)
 *   cleanPlanName / checkPlanName / uniqueName  the name rules of Contract C.4
 *   createPlansFromSeed({ seed, name, today, takenNames }, { create, setActive, remove })
 *                                               the create path: partner first (inactive), then yours, then active
 *   confirmAndCreate(seed, app)                 the confirm step, with every effect handed in (app.ask, app.create …)
 *   seedConfirmText, seedSavedNote, questionHref, SEED_WORDS   the words the entry shows
 *   budgetSummaryWords(figures, guide, money)   the Budget page's three lines about the plan's target: today's words, or
 *                                               — on a plan made from a V7 answer — the budget as a guide beside the
 *                                               target the person chose (owner, 1 Oct 2026)
 *   householdStartWords(own, partner)           the Household tab's line when one of the two plans begins later than the
 *                                               other (research/v7/couples-different-years.md 7); '' when they begin together
 *
 * Seed version 2 (6.20.0, research/v7/couples-different-years.md 6): a couple may stop work in different years. Each
 * person carries their own `stop` and `years` (so both plans end in the same tax year) and the seed an `untilBothStop`
 * ({ payCovers }, or null). Each plan starts at its own person's stop; the savings between them are in the plan of
 * whoever stops first; the budget's flags are per person. A version 1 seed (a V7 tab opened before 6.20.0) is still read,
 * as version 2 with each person at the household's stop, and makes exactly the plans 6.19.0 made — its record
 * (`fromAnswer`) included (tests/planSeed.test.js holds it to the frozen 6.19.0 copy). A planner that reads only version 1
 * refuses a version 2 seed rather than make wrong plans from it.
 *
 * Seed version 3 (research/v7/spending-shape.md 8): what is spent changes with age. Every version 2 field, plus
 * `spend.shape` (the shape as the answer tested it: for the record and the description) and each person's `takeHome` rows
 * exact to the year. The target is then today's own sum on each year — g(y) = round(grossUpAnnual(perMonth(y) × 12)) —
 * made into the fewest income steps whose compiled amount is g(y) to the pound in every year (compressSteps): a level
 * stretch one step, a stretch that moves evenly one glide, a stretch that falls at a typed rate one decline where it can be
 * (below the personal allowance, where after tax is before tax), otherwise one step a year. So the plan targets the
 * answer's after-tax amount every year, and nothing drifts when it is saved again. A planner that reads only 1 and 2
 * refuses a version 3 seed (the rule above).
 *
 * Pure: no storage, DOM or clock of its own — `storage`, `nowMs`, `today` and the create functions are passed in.
 *
 * The rules this file keeps (owner, 1 Oct 2026):
 *  - the plan is named by the person; the suggestion comes from V7 and is never "My plan";
 *  - the budget is a guide only: NOTHING here reads the budget to set a figure. The target is the monthly amount the
 *    person chose (spend.perMonth, split per person in takeHome); the budget lines are copied into the Budget tool as
 *    they are, and nothing else (no essentials floor, no headroom, no total);
 *  - the drawing mix is the risk level the person chose: the INTENDED portfolio. No fund list, no holdings;
 *  - saving always creates new plans (createScenario: a new document id every time) and never writes to an existing
 *    plan, except the `isActive` flag that making the new plan active moves (the same write as picking a plan in the
 *    menu — Contract Q12).
 */
import { getDefaultScenario, getDefaultDecisionSettings, defaultStrategyBlock } from '../storage/ScenarioRepository.js';
import { deriveTiming, taxYearStartOf, taxYearLabel } from './PlanTiming.js';
import { RISK_PRESETS } from './GlidepathService.js';
import { grossUpAnnual, defaultBudget, BUDGET_CATEGORIES, SUGGESTED_EXTRAS } from './BudgetModel.js';
import { amountAtAge } from './IncomeSchedule.js';
import { isChargesPct, DEFAULT_CHARGES_PCT } from './Charges.js';
import { isIsaGrowth, DEFAULT_ISA_GROWTH } from './IsaGrowth.js';

export const SEED_KEY = 'pt_v7_plan_seed';
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
export const NEW_PLAN_HASH = '#new-plan';
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

/** The receipt V7 reads on coming Back (this tab's session storage; src/answers/keep/planSeed.js has the same key). */
export const RECEIPT_KEY = 'pt_v7_plan_receipt';
export const RECEIPT_OUTCOMES = Object.freeze(['made', 'declined', 'refused', 'cleared']);
const RECEIPT_KEEP = 8;

const QUESTION_TITLES = Object.freeze({ c: 'What is that a month?', a: 'When can I afford to stop work?', b: 'Am I saving enough?' });
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DB_INDEXATION = Object.freeze({ prices: 'cpi', pricesCapped5: 'lpi5', none: 'level' });
const ENABLED_TOOLS = Object.freeze(['budget', 'stress', 'decision', 'accumulation', 'household']);

// ---- small helpers --------------------------------------------------------------------------------------------------

const isObj = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const isNum = (v) => typeof v === 'number' && Number.isFinite(v);
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
function gbp(n) { return '£' + String(Math.round(Math.abs(+n || 0))).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
/** A pot in a sentence: to the nearest £1,000 (language guide 3.5). */
const pot = (n) => gbp(Math.round((+n || 0) / 1000) * 1000);
/** '1 Oct 2026' */
function dayWords(day) { const d = localDate(day); return d ? d.getDate() + ' ' + MONTHS[d.getMonth()] + ' ' + d.getFullYear() : String(day); }

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
function asVersion2(seed) {
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
const apartOf = (seed) => seed.household === 'couple' && isObj(seed.untilBothStop);

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

/** The createdAt of what is stored now: a string, or null (nothing there, unreadable, or storage refused). */
function storedCreatedAt(storage) {
  try {
    const text = storage.getItem(SEED_KEY);
    if (text == null) return null;
    const seed = JSON.parse(text);
    return isObj(seed) && typeof seed.createdAt === 'string' ? seed.createdAt : null;
  } catch (e) { return null; }
}

/**
 * Delete the seed. Never throws (a browser that refuses storage has nothing kept to delete). With `createdAt`, only the
 * seed of that time is deleted: one used (or declined) here never deletes a newer one another window wrote meanwhile.
 */
export function clearSeed(storage, createdAt = null) {
  if (createdAt != null && storedCreatedAt(storage) !== createdAt) return;
  try { storage.removeItem(SEED_KEY); } catch (e) { /* storage refused: nothing was kept */ }
}

/** Is the seed read at start (its createdAt) still the one stored? False when it was used, replaced or cannot be read. */
export function seedStillWaiting(storage, createdAt) {
  return typeof createdAt === 'string' && storedCreatedAt(storage) === createdAt;
}

/**
 * Leave a receipt for the V7 page that sent the seed: the same tab goes Back to it, and it then says "Saved as …" only
 * when a plan was made — never on "Not now", a refused seed or a sign-out (found 1 Oct 2026: it took any missing seed
 * to mean the plan was made). Kept in the tab's session storage, which closes with the tab; the last few only. No
 * figure: the seed's time (its id), the outcome, and the name only when a plan was made under it. Never throws.
 * @returns {boolean} written
 */
export function writeReceipt(session, createdAt, outcome, name = null) {
  if (!session || typeof createdAt !== 'string' || !RECEIPT_OUTCOMES.includes(outcome)) return false;
  try {
    let all = null;
    try { all = JSON.parse(session.getItem(RECEIPT_KEY) || 'null'); } catch (e) { all = null; }
    if (!isObj(all)) all = {};
    delete all[createdAt];
    all[createdAt] = outcome === 'made' && typeof name === 'string' ? { outcome, name } : { outcome };
    const keys = Object.keys(all);
    for (const k of keys.slice(0, Math.max(0, keys.length - RECEIPT_KEEP))) delete all[k];
    session.setItem(RECEIPT_KEY, JSON.stringify(all));
    return true;
  } catch (e) { return false; }
}

/** Sign-out (every way: the menu, the idle timer, the verify-email screen): the seed goes, whatever it is. */
export function dropSeed(storage, session) {
  const createdAt = storedCreatedAt(storage);
  clearSeed(storage);
  if (createdAt) writeReceipt(session, createdAt, 'cleared');
}

/**
 * Read the seed. A seed with any problem — unreadable, a version this code does not know, more than a day old, dated
 * ahead of this clock, or missing a field — is deleted on the spot (and its time given back, when it had one, so the
 * caller can leave a 'refused' receipt). A good seed is left in place until it is used.
 * @returns {{ seed: object } | { problem: 'none'|'storage'|'unreadable'|'version'|'expired'|'future'|'shape', createdAt?: string }}
 */
export function readSeed(storage, nowMs) {
  let text;
  try { text = storage.getItem(SEED_KEY); } catch (e) { return { problem: 'storage' }; }
  if (text == null) return { problem: 'none' };
  let seed;
  try { seed = JSON.parse(text); } catch (e) { seed = undefined; }
  const c = seed === undefined ? { ok: false, problem: 'unreadable' } : checkSeed(seed, nowMs);
  if (!c.ok) {
    clearSeed(storage);
    return isObj(seed) && typeof seed.createdAt === 'string' ? { problem: c.problem, createdAt: seed.createdAt } : { problem: c.problem };
  }
  return { seed };
}

/**
 * The read the app makes every time it starts (Contract C.2 step 1). Bad and old seeds are deleted whatever the
 * address (with a 'refused' receipt in this tab); `wanted` is true when the address is '#new-plan', which `dropHash()`
 * then clears so a reload does not ask twice. A good seed is offered only when wanted.
 * @returns {{ wanted: boolean, seed: object|null, problem: string|null }}
 */
export function takeSeedEntry(storage, nowMs, hash, dropHash, session = null) {
  const r = readSeed(storage, nowMs);
  if (r.problem && r.createdAt) writeReceipt(session, r.createdAt, 'refused');
  const wanted = String(hash || '') === NEW_PLAN_HASH;
  if (wanted && typeof dropHash === 'function') { try { dropHash(); } catch (e) { /* the address stays; harmless */ } }
  return { wanted, seed: wanted && r.seed ? r.seed : null, problem: r.problem || null };
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
  return 'the money lasted ' + to + ' ' + out + ' (' + Math.round(share * 100) + '%)';
}

/**
 * Why the planner's own test differs from the quick answer, and the quick answer's figure (found 1 Oct 2026: the gaps were
 * not "a little"). Per person: `p` at their own stop (a seed read as version 2). A couple apart, the partner's plan says
 * whose stop: "before your partner stops".
 */
function differenceWords(seed, p) {
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
function coupleWords(seed, p, names) {
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
  const plan = getDefaultScenario(name, describe(seed, p, names), [...ENABLED_TOOLS]);
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

// ---- creating the plans (Contract C.2 step 7) --------------------------------------------------------------------------

/**
 * Make the plan(s): the partner's first (not active), then yours with the link to it, then yours made active. Only
 * `create` writes plans, and it always makes a NEW document. If yours cannot be made, the partner plan made a moment
 * before is deleted again, and nothing else is touched. A failure to make yours active leaves both plans made
 * (`activeError` says so); saving again would only make copies.
 * @param {{ seed: object, name: string, today: Date|string, takenNames?: string[] }} what
 * @param {{ create: (plan: object) => Promise<string>, setActive: (id: string) => Promise<void>, remove: (id: string) => Promise<void> }} store
 * @returns {Promise<{ yours: { id: string, name: string }, partner: { id: string, name: string } | null, activeError: Error|null }>}
 */
export async function createPlansFromSeed({ seed, name, today, takenNames = [] }, { create, setActive, remove }) {
  const checked = checkPlanName(name);
  if (!checked.ok) throw new Error(checked.message);
  // The final names first: a couple's two descriptions name each other's plan.
  const yourName = uniqueName(checked.name, takenNames);
  const partnerName = seed.household === 'couple' ? uniqueName(checked.name + ' · partner', [...takenNames, yourName]) : null;
  const { yours, partner } = seedToScenario(seed, today, { name: yourName, ...(partnerName ? { partnerName } : {}) });
  yours.planDetails.name = yourName;
  let partnerMade = null;
  if (partner) {
    partner.planDetails.name = partnerName;
    delete partner.id;
    const id = await create({ ...partner, isActive: false });
    if (!id) throw new Error('the plan could not be made');
    partnerMade = { id, name: partnerName };
    yours.household = { partnerScenarioId: id };
  }
  delete yours.id;
  let yourId;
  try {
    yourId = await create({ ...yours, isActive: false });
    if (!yourId) throw new Error('the plan could not be made');
  } catch (e) {
    if (partnerMade) { try { await remove(partnerMade.id); } catch (e2) { /* nothing more to undo */ } }
    throw e;
  }
  let activeError = null;
  try { await setActive(yourId); } catch (e) { activeError = e instanceof Error ? e : new Error(String(e)); }
  return { yours: { id: yourId, name: yourName }, partner: partnerMade, activeError };
}

/**
 * The confirm step (Contract C.2 steps 6–9), with every effect handed in:
 *   app.listNames()        every plan name in the account (or this tab)
 *   app.ask(text, name)    shows the line and the name box; resolves the name, or null for "Not now" (or closed)
 *   app.warn(message)      a plain message (a name refused, a save that failed)
 *   app.create / setActive / remove   as createPlansFromSeed
 *   app.now()              today
 *   app.storage            where the seed is kept
 *   app.session            this tab's session storage, for the receipt V7 reads on coming Back (may be null)
 * "Not now" deletes THIS seed (never a newer one) and leaves a 'declined' receipt. A refused name asks again. Before
 * anything is made the stored seed is read again: if it went, or another replaced it, while the box was open (another
 * window used it), nothing is made — two windows never make two plans from one seed. A save that fails keeps the seed
 * and asks again. A plan made: the seed deleted, a 'made' receipt with the final name.
 * @returns {Promise<{ outcome: 'made', made: object, hadPlans: boolean } | { outcome: 'notNow' } | { outcome: 'gone' }>}
 */
export async function confirmAndCreate(seed, app) {
  let taken = [];
  try { taken = (await app.listNames()) || []; } catch (e) { taken = []; }
  let name = seed.name.chosen;
  for (;;) {
    const typed = await app.ask(seedConfirmText(seed), name);
    if (typed == null) {
      clearSeed(app.storage, seed.createdAt);
      writeReceipt(app.session, seed.createdAt, 'declined');
      return { outcome: 'notNow' };
    }
    name = typed;
    const checked = checkPlanName(typed);
    if (!checked.ok) { app.warn(checked.message); continue; }
    if (!seedStillWaiting(app.storage, seed.createdAt)) {
      app.warn(SEED_WORDS.usedElsewhere);
      writeReceipt(app.session, seed.createdAt, 'refused');
      return { outcome: 'gone' };
    }
    try {
      const made = await createPlansFromSeed({ seed, name: checked.name, today: app.now(), takenNames: taken }, app);
      clearSeed(app.storage, seed.createdAt);
      writeReceipt(app.session, seed.createdAt, 'made', made.yours.name);
      return { outcome: 'made', made, hadPlans: taken.length > 0 };
    } catch (e) {
      app.warn(SEED_WORDS.failed(e && e.message));
    }
  }
}

// ---- the words of the entry -----------------------------------------------------------------------------------------

/** A monthly amount the answer worked out: to the nearest £10 from £1,000, £5 below (language guide 3.5). */
const aboutMonthly = (n) => gbp(n >= 1000 ? Math.round(n / 10) * 10 : Math.round(n / 5) * 5);

/**
 * "Stop at 60, £1,800 a month, a pension of about £341,000 then" — what the plan holds, in one line. Money still going
 * in is said too (found 1 Oct 2026: B's confirm step named its pay-in only in the name box), and for B the pay-in the
 * answer worked out when it is more: "paying in £1,050 a month as now (the answer suggested about £4,660)".
 */
export function seedSummary(seed) {
  if (apartOf(seed)) return apartSummary(seed);
  const later = seed.stop.kind === 'later';
  const ages = seed.people.map((p) => p.ageAtStop).join(' and ');
  // seed version 3: what is spent changes with age, as the answer was given it (the description lists the steps)
  let line = (later ? 'Stop at ' : 'From ') + ages + ', ' + gbp(seed.spend.perMonth) + ' a month' + (seed.seedVersion === 3 ? ' at the start, changing with age as you set it' : '');
  const paying = later ? seed.people.reduce((t, p) => t + (p.payIn && p.payIn.total > 0 ? p.payIn.total : 0), 0) : 0;
  const needed = seed.source === 'b' && seed.answer && isNum(seed.answer.payInNeeded) ? seed.answer.payInNeeded : null;
  if (paying > 0) {
    line += ', paying in ' + gbp(paying) + ' a month' + (seed.source === 'b' ? ' as now' : '');
    if (needed !== null && needed > paying + 0.5) line += ' (the answer suggested about ' + aboutMonthly(needed) + ')';
  } else if (later && needed !== null && needed > 0.5) {
    line += ', paying in nothing now (the answer suggested about ' + aboutMonthly(needed) + ' a month)';
  }
  const pensions = seed.people.map((p) => (later ? p.pension.atStop.middling : p.pension.today));
  if (!pensions.some((v) => v > 0)) return line;
  const many = pensions.length > 1;
  const figures = pensions.map((v) => (later ? pot(v) : gbp(v))).join(' and ');
  return line + ', ' + (many ? 'pensions of ' : 'a pension of ') + (later ? 'about ' : '') + figures + (later ? ' then' : '');
}

/**
 * seedSummary for a couple who stop in different years: "You stop at 60 and your partner at 62, £3,200 a month once
 * you've both stopped, …" or "You from now and your partner from 56, …"; the money still going in; each pension at its
 * holder's own stop ("about" only for what the answer worked out).
 */
function apartSummary(seed) {
  const people = seed.people;
  const bothLater = people.every((p) => p.stop.kind === 'later');
  const [you, partner] = people;
  const when = (p) => (p.stop.kind === 'now' ? 'now' : String(p.ageAtStop));
  let line = (bothLater ? `You stop at ${you.ageAtStop} and your partner at ${partner.ageAtStop}` : `You from ${when(you)} and your partner from ${when(partner)}`)
    + ', ' + gbp(seed.spend.perMonth) + ' a month' + (seed.seedVersion === 3 ? ' at the start (changing with age as you set it)' : ' once you\'ve both stopped');
  const paying = people.reduce((t, p) => t + (p.stop.kind === 'later' && p.payIn && p.payIn.total > 0 ? p.payIn.total : 0), 0);
  const needed = seed.source === 'b' && seed.answer && isNum(seed.answer.payInNeeded) ? seed.answer.payInNeeded : null;
  if (paying > 0) {
    line += ', paying in ' + gbp(paying) + ' a month' + (seed.source === 'b' ? ' as now' : '');
    if (needed !== null && needed > paying + 0.5) line += ' (the answer suggested about ' + aboutMonthly(needed) + ')';
  } else if (needed !== null && needed > 0.5) {
    line += ', paying in nothing now (the answer suggested about ' + aboutMonthly(needed) + ' a month)';
  }
  const pension = (p) => (p.stop.kind === 'later' ? p.pension.atStop.middling : p.pension.today);
  if (!people.some((p) => pension(p) > 0)) return line;
  if (bothLater) return line + ', pensions of about ' + pot(pension(you)) + ' at ' + you.ageAtStop + ' and ' + pot(pension(partner)) + ' at ' + partner.ageAtStop;
  const each = (p) => (p.who === 'you' ? 'your pension ' : 'your partner\'s ') + (p.stop.kind === 'later' ? 'about ' + pot(pension(p)) + ' at ' + p.ageAtStop : gbp(pension(p)) + ' now');
  return line + ', ' + people.map(each).join(' and ');
}

/** The confirm step's words, above the name box. */
export function seedConfirmText(seed) {
  const read = asVersion2(seed);
  return 'A new plan from your quick answer: ' + seedSummary(seed) + '. ' + differenceWords(read, read.people[0]) + ' Name the plan:';
}

/**
 * The note the planner opens with: the name(s) it was saved as, why its own test can differ (with the quick answer's
 * figure), and for a couple whose part this plan holds. The same words are in the plan's description, which stays.
 */
export function seedSavedNote(made, seed = null) {
  const names = '‘' + made.yours.name + '’' + (made.partner ? ' and ‘' + made.partner.name + '’ for your partner' : '');
  const open = made.activeError ? ' It could not be opened just now: choose it from the plan menu.' : '';
  if (!seed) return 'Made from your quick answer: saved as ' + names + '.' + open + ' The planner runs its own test, so its figures can differ from the quick answer.';
  const read = asVersion2(seed);
  const couple = made.partner ? ' ' + coupleWords(read, read.people[0], { yours: made.yours.name, partner: made.partner.name }) : '';
  return 'Made from your quick answer: saved as ' + names + '.' + open + ' ' + differenceWords(read, read.people[0]) + couple;
}

/**
 * The Budget page's three lines about the plan's target (index.html updateBudgetSummary).
 *  - No guide (a plan made in the planner): today's words, exactly as they were.
 *  - A guide (planTargetGuide: a plan made from a V7 answer): the budget's total is a guide shown beside the target the
 *    person chose, which is what the plan works to. Found 1 Oct 2026: the page said the budget's total, with an averaged
 *    allowance for one-offs added, was "what your plan funds" and "the target both tools work to" — it was neither, and
 *    the owner's rule is that the budget never formulates how much they need.
 * @param {{ allInMonthly: number, allInAnnual: number, periodicMonthly: number, headroomMonthly: number, targetGrossAnnual: number, shared: boolean }} f
 * @param {null | { monthly: number, grossAnnual: number, steps: boolean }} guide
 * @param {(n: number) => string} money
 * @returns {{ allInCaption: string, handoff: string, targetLine: string }}   HTML (figures and fixed words only)
 */
export function budgetSummaryWords(f, guide, money) {
  const headM = +f.headroomMonthly || 0;
  if (!guide) {
    return {
      allInCaption: money(f.allInAnnual) + '/yr — what your plan funds',
      handoff: 'Your all-in take-home of <strong>' + money(f.allInMonthly) + '/mo</strong> becomes the <strong>target both tools work to</strong>: the Stress Tester asks “will my pots deliver this for life?” and the Decision Tool works out each month’s withdrawal to hit it tax-efficiently.',
      targetLine: 'Plan target: <strong>' + money(f.allInMonthly + headM) + '/mo take-home</strong> <span style="color:var(--text-muted);">(≈ ' + money(f.targetGrossAnnual) + '/yr before tax' + (headM ? ' — budget + ' + money(headM) + '/mo headroom' : '') + ')</span>'
    };
  }
  const yours = f.shared ? ' (your part)' : '';
  const start = guide.steps ? ' to start with' : '';
  return {
    allInCaption: money(f.allInAnnual) + '/yr — a guide; this plan’s target' + yours + ' is ' + money(guide.monthly) + '/mo',
    handoff: (f.shared ? 'Your share of the budget adds up to <strong>' : 'Your budget adds up to <strong>') + money(f.allInMonthly) + '/mo</strong>'
      + (f.periodicMonthly > 0 ? ', including ' + money(f.periodicMonthly) + '/mo set aside for one-offs' : '')
      + '. This plan’s target' + yours + ' is <strong>' + money(guide.monthly) + '/mo</strong> take-home' + start
      + ', the figure you chose. The budget is a guide to it: it does not change the target.',
    targetLine: 'Plan target: <strong>' + money(guide.monthly) + '/mo take-home</strong>' + start + ' <span style="color:var(--text-muted);">(≈ '
      + money(guide.grossAnnual) + '/yr before tax) — the figure you chose; it is set in Stress tester → Settings → Your income shape.</span>'
  };
}

/**
 * The Household tab's line when one of the two plans begins later than the other (research/v7/couples-different-years.md
 * 7): a plan made for someone still working starts at their stop, and until then the tab counts nothing from it — their
 * pay covers their part — and holds their pot at what it is expected to be when they stop. Words only: the joint check
 * itself already lines the two plans up by their start (HouseholdService startOffset). '' when they begin together.
 * Which begins later is read from the plans' own first tax years when both have one (deriveTiming): two plans that begin
 * in the same tax year say nothing, whatever their rounded offsets — currentAgeNow does not follow the birthday, so two
 * plans whose ages were typed on different dates can round to offsets 2 and 1 in the same tax year (the reviewers'
 * finding, 2 Oct 2026). Without both years, by the offsets.
 * @param {{ offset: number, firstTaxYear?: number }} own       this plan (you): years until it begins (startOffset) and its first tax year
 * @param {{ offset: number, firstTaxYear?: number }} partner   the partner's plan
 * @returns {string}   plain text (no markup)
 */
export function householdStartWords(own, partner) {
  const ya = +(own && own.firstTaxYear), yb = +(partner && partner.firstTaxYear);
  const years = Number.isInteger(ya) && ya > 0 && Number.isInteger(yb) && yb > 0;
  const a = years ? ya : Math.max(0, +(own && own.offset) || 0);
  const b = years ? yb : Math.max(0, +(partner && partner.offset) || 0);
  if (a === b) return '';
  const theirs = b > a;
  const year = +(theirs ? partner : own).firstTaxYear;
  const when = Number.isInteger(year) && year > 0 ? ' in ' + taxYearLabel(year) : ' later';
  return theirs
    ? `Your partner's plan begins${when}, when they stop work. Until then their pay covers their part, and what they pay in is in that plan's pot at the start. Before then, “What you'd have left” counts their pot as it is expected to be when they stop.`
    : `This plan begins${when}, when you stop work. Until then your pay covers your part, and what you pay in is in this plan's pot at the start. Before then, “What you'd have left” counts your pot as it is expected to be when you stop.`;
}

/** The way back to the question the plan came from, relative to the app's root. */
export function questionHref(source) {
  return 'v7/#/' + (QUESTION_TITLES[source] ? source : 'c') + '/answer';
}
