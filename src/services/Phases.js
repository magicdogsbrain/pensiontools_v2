/**
 * The three phases and the one review (7.10.0; research/v7/replan-nov-2026.md §6): Saving, Moving and Living on it, with
 * the move window between the first two, the review that follows a plan in every phase, and the person's own choices for
 * each. Every constant the phases use lives here, in one place.
 *
 * The plan's own root `phases` (absent on every plan before 7.10.0, and read then as today; nothing is written on open):
 *
 *   phases: {
 *     of: createdAt,                                  // the plan the person-made parts belong to (belonging, below)
 *     saving:  { strategy: { level: 'cautious'|'balanced'|'adventurous', endTarget: 'drawdown', at } },
 *     moving:  { window: { years: 1..5, at },          // from and to are always derived (windowOf)
 *                agreed: { at, strategyId, how: 'done'|'asHeld'|'nothing', heldPct: 0..100|null, entryAt, carriedFrom? } },
 *     review:  { every: 'year'|'quarter'|'month', rule: { kind: 'success', floor } | { kind: 'guardrails', drift, step },
 *                log: [entry] },                      // at most REVIEW_LOG_MAX entries; no next date is ever stored
 *     history: [{ at, what, from, to }] }             // what: a part's name (PHASE_PARTS, less review.log)
 *
 * ONE writer (phasesPatch): every write starts from the root AS STORED — never from phasesOf's merged view, so a derived
 * default is never written — sets the one part the person chose, and appends to the history or the log. Readers
 * (phasesOf, windowOf, agreementOf) write nothing.
 *
 * Belonging (the rollback and stale-tab guard): a copy or successor made by a 7.9.0 tab is a JSON clone that keeps the
 * source's `phases` (and `tasks`). When `of` is set and differs from the plan's own `createdAt`, the person-made parts that
 * belong to one plan only — the agreement, the review log and the history — are read as absent, except an agreement carried
 * on by a successor (`carriedFrom` = the plan it carries on, `before.planId`). The choices (the saving level, the window,
 * how often and the rule) are kept: they are the person's, not the plan's. The next write drops what is read as absent.
 *
 * Pure: no storage, no clock of its own (`now` and `at` come in).
 */
import { deriveTiming } from './PlanTiming.js';
import { RISK_PRESETS } from './GlidepathService.js';
import { holdingsLines } from './HoldingsRecord.js';
import { proportions as holdingsProportions } from './Holdings.js';
import { savingMixOf } from './SaverPayIn.js';
import { beforeOf } from './PlanClosed.js';
import { LEVEL_FAILS20, LEVEL_DEFAULT, levelOf } from '../answers/shared/rules.js';
import { CADENCES } from '../answers/plan/schema.js';

// ---- the constants, in one place ---------------------------------------------------------------------------------------

/** The move window: its length in years before the month work stops (the person's choice, 1 to 5; 3 until they choose). */
export const WINDOW = Object.freeze({ min: 1, max: 5, def: 3 });
/**
 * Off course: the floors a person may pick for "the money lasts as long as you do" (in whole twentieths, 13 to 18 in 20), the
 * guardrails rule's drift and step, and the readings in a row it takes (never one bad year).
 */
export const OFF_COURSE = Object.freeze({ floors: Object.freeze([0.65, 0.70, 0.75, 0.80, 0.85, 0.90]), drift: 0.20, step: 0.10, readings: 2 });
/** A plan with no review log is first due no earlier than this day (the first 6 April after the release: no release-day nag). */
export const REVIEW_FROM = '2027-04-06';
/** The most review entries a plan keeps (the oldest goes first). */
export const REVIEW_LOG_MAX = 120;
/** The most stored dismissals a plan keeps (answers/plan/tasks.js). */
export const TASKS_MAX = 50;
/** A yearly Living-on-it review falls due once the plan was locked at least this many months before 6 April. */
export const LIVING_REVIEW_AFTER = 6;
/** The saving levels (GlidepathService.RISK_PRESETS' names). */
export const SAVING_LEVELS = Object.freeze(['cautious', 'balanced', 'adventurous']);
/** What the saving years end on: drawdown only until the annuity and ladder targets come. */
export const END_TARGETS = Object.freeze(['drawdown']);
/** How often a review falls (answers/plan/schema.js CADENCES). */
export const REVIEW_EVERY = CADENCES;
/** How a move was agreed: complete inside the band, what is held as it is, or with no pension record to read. */
export const AGREED_HOWS = Object.freeze(['done', 'asHeld', 'nothing']);
/** The parts phasesPatch writes, each by name; every one but the log is a history `what` too. */
export const PHASE_PARTS = Object.freeze(['window', 'saving.level', 'review.every', 'review.rule', 'moving.agreed', 'moving.withdrawn', 'review.log']);
export const HISTORY_WHATS = Object.freeze(PHASE_PARTS.filter((p) => p !== 'review.log'));
/** The phases a review entry is made in (Saving's review is its check-in, kept where it always was). */
export const ENTRY_PHASES = Object.freeze(['moving', 'drawing']);

// ---- small readers ---------------------------------------------------------------------------------------------------------

const isObj = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const copy = (v) => (v === undefined ? undefined : JSON.parse(JSON.stringify(v)));
const MONTH = /^(\d{4})-(0[1-9]|1[0-2])$/;
const monthOrNull = (v) => (typeof v === 'string' && MONTH.test(v.slice(0, 7)) ? v.slice(0, 7) : null);
const monthKeyOf = (d) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
const indexOf = (ym) => { const [y, m] = ym.split('-').map(Number); return y * 12 + (m - 1); };
const monthAt = (i) => Math.floor(i / 12) + '-' + String((i % 12) + 1).padStart(2, '0');
/** 'YYYY-MM' moved by `n` months. */
export const addMonths = (ym, n) => monthAt(indexOf(ym) + n);
/** Months from one 'YYYY-MM' to another (negative when `to` is earlier). */
export const monthsBetween = (from, to) => indexOf(to) - indexOf(from);
const isoOf = (at) => {
  if (at instanceof Date && Number.isFinite(at.getTime())) return at.toISOString();
  if (typeof at === 'string' && at && Number.isFinite(Date.parse(at))) return at;
  throw new Error('phasesPatch: the moment comes in as `at`');
};

/** Window years as the person chose them: a whole number 1 to 5, else null. */
export const windowYearsOrNull = (v) => (Number.isInteger(v) && v >= WINDOW.min && v <= WINDOW.max ? v : null);
const levelOrNull = (v) => (SAVING_LEVELS.includes(v) ? v : null);
const everyOrNull = (v) => (REVIEW_EVERY.includes(v) ? v : null);
const twentieths = (x) => Math.round(x * 20);
/** A rule as stored, checked: success at one of the floors (compared in twentieths), or the guardrails rule. Else null. */
export function ruleOrNull(r) {
  if (!isObj(r)) return null;
  if (r.kind === 'success' && typeof r.floor === 'number') {
    const f = OFF_COURSE.floors.find((x) => twentieths(x) === twentieths(r.floor));
    return f != null && Math.abs(r.floor - f) < 1e-9 ? { kind: 'success', floor: f } : null;
  }
  if (r.kind === 'guardrails') return { kind: 'guardrails', drift: OFF_COURSE.drift, step: OFF_COURSE.step };
  return null;
}
const agreedOrNull = (a) => (isObj(a) && typeof a.strategyId === 'string' && a.strategyId && AGREED_HOWS.includes(a.how) && typeof a.at === 'string' ? a : null);

/**
 * The plan's level for "the money lasts as long as you do" (B's, kept with the answer the plan came from when the person
 * chose one; else Balanced). answers/plan/life.js reads it from here: one rule.
 */
export function planLevelOf(plan) {
  const row = plan && isObj(plan.fromAnswer) && isObj(plan.fromAnswer.answer) ? plan.fromAnswer.answer : null;
  return row && row.levelChosen === true ? levelOf(row.level, { stored: true }) : LEVEL_DEFAULT;
}

/** The off-course floor that follows a level: one twentieth below it (careful .90, balanced .85, bold .65). */
export function defaultFloorOf(level) {
  const fails = LEVEL_FAILS20[levelOf(level)];
  return (20 - fails - 1) / 20;
}

/** The rule a plan reads until the person picks one: success, at the floor that follows the plan's level. */
export const defaultRuleOf = (plan) => ({ kind: 'success', floor: defaultFloorOf(planLevelOf(plan)) });

/** The strategy the plan draws by (the Stress settings' strategyId as the one test runs it; absent = Pots & Valves). */
export function strategyIdOf(plan, settings = null) {
  const own = settings && typeof settings.strategyId === 'string' && settings.strategyId ? settings.strategyId : null;
  const stored = plan && plan.stressTool && isObj(plan.stressTool.settings) && typeof plan.stressTool.settings.strategyId === 'string' && plan.stressTool.settings.strategyId ? plan.stressTool.settings.strategyId : null;
  return own || stored || 'pots-and-valves';
}

/** The nearest named level to a mix, by its share in shares. */
function nearestLevel(equity) {
  let best = 'balanced', gap = Infinity;
  for (const k of SAVING_LEVELS) { const d = Math.abs(RISK_PRESETS[k].equity - equity); if (d < gap - 1e-12) { best = k; gap = d; } }
  return best;
}

/**
 * The saving level a plan is read at when the person has not chosen one: in SavingPath.savingPathMixes' own order — the mix
 * held (What you hold), then the saving mix kept from an answer — each to the nearest level by its share in shares; else
 * Balanced. Shown only: the engine reads a stored level and nothing derived.
 */
export function derivedLevelOf(plan) {
  const lines = holdingsLines(plan && plan.holdings);
  if (lines.length) {
    const prop = holdingsProportions(lines);
    if (prop && prop.total > 0) {
      const b = prop.buckets;
      const t = (b.shares || 0) + (b.bonds || 0) + (b.diversifiers || 0) + (b.cash || 0);
      if (t > 0) return nearestLevel((b.shares || 0) / t);
    }
  }
  const kept = savingMixOf(plan && plan.accumulationTool && plan.accumulationTool.settings);
  if (kept) return nearestLevel(kept.equity);
  return 'balanced';
}

// ---- belonging ------------------------------------------------------------------------------------------------------------

/**
 * Do a root's person-made parts (`phases` or `tasks`) belong to this plan? Yes when the root says nothing of where it was made
 * (`of` absent), when the plan has no `createdAt` (read as stored), or when the two are the same.
 */
export function belongsTo(root, plan) {
  if (!isObj(root) || root.of == null) return true;
  if (!plan || plan.createdAt == null || plan.createdAt === '') return true;
  return String(root.of) === String(plan.createdAt);
}

/** An agreement a successor carries on (successorOf, reason 'plan'): it names the plan this one carries on. */
const carriedHere = (agreed, plan) => {
  const b = beforeOf(plan);
  return !!(isObj(agreed) && typeof agreed.carriedFrom === 'string' && b && b.planId && agreed.carriedFrom === b.planId);
};

/**
 * The stored root with what does not belong to this plan taken out (a copy; never the stored object). Null when the plan
 * has no `phases`.
 */
export function phasesAsTheyBelong(plan) {
  const raw = plan && isObj(plan.phases) ? plan.phases : null;
  if (!raw) return null;
  const out = copy(raw);
  if (belongsTo(raw, plan)) return out;
  if (isObj(out.moving) && 'agreed' in out.moving && !carriedHere(out.moving.agreed, plan)) delete out.moving.agreed;
  if (isObj(out.review)) delete out.review.log;
  delete out.history;
  return out;
}

/** The review entries that belong to this plan, oldest first (a copy). */
export function reviewLogOf(plan) {
  const ph = phasesAsTheyBelong(plan);
  const log = ph && isObj(ph.review) && Array.isArray(ph.review.log) ? ph.review.log : [];
  return log.filter(isObj);
}

// ---- the window -------------------------------------------------------------------------------------------------------------

/** The window's length as the plan reads it: the person's choice, else WINDOW.def. Kept on a copy (it is a choice). */
export function windowYearsOf(plan) {
  const raw = plan && isObj(plan.phases) && isObj(plan.phases.moving) && isObj(plan.phases.moving.window) ? plan.phases.moving.window : null;
  return (raw && windowYearsOrNull(raw.years)) || WINDOW.def;
}

/**
 * The month work stops (a saver) or stopped (someone retired), as the plan says it: the stop LifeStage.stageOf reads.
 * `settings`: the Stress settings to read (the effective ones, where the caller has them); else the plan's own.
 */
export function stopMonthOf(plan, { now = new Date(), settings = null } = {}) {
  const s = settings || (plan && plan.stressTool && isObj(plan.stressTool.settings) ? plan.stressTool.settings : {});
  const t = deriveTiming(s, now);
  if (t.mode === 'future') return monthOrNull(t.startMonth);
  if (t.mode === 'retired') return monthOrNull(t.stoppedWork);
  return null;
}

/**
 * The move window: { years, from, to, monthsLeft, windowMonths, state }.
 *   - `to` is the stop (stageOf's: pass `stop` when the caller has it, else it is read from the plan);
 *   - `from` is `to` less the window's years, widened back to the earliest Moving review when that is earlier, but never
 *     earlier than `to` less WINDOW.max years;
 *   - `state`: 'before' (now < from), 'inside' (from <= now < to), 'after' (now >= to), or 'none' when there is no stop month.
 * Months are 'YYYY-MM'; `monthsLeft` is never below 0.
 */
export function windowOf(plan, { now = new Date(), settings = null, stop } = {}) {
  const years = windowYearsOf(plan);
  const to = stop !== undefined ? monthOrNull(stop) : stopMonthOf(plan, { now, settings });
  if (!to) return { years, from: null, to: null, monthsLeft: null, windowMonths: null, state: 'none' };
  let from = addMonths(to, -years * 12);
  const floor = addMonths(to, -WINDOW.max * 12);
  const firstMoving = reviewLogOf(plan).filter((e) => e.phase === 'moving').map((e) => monthOrNull(e.at)).filter(Boolean).sort()[0] || null;
  if (firstMoving && firstMoving < from) from = firstMoving < floor ? floor : firstMoving;
  const nowKey = monthKeyOf(now);
  const state = nowKey < from ? 'before' : nowKey < to ? 'inside' : 'after';
  return { years, from, to, monthsLeft: Math.max(0, monthsBetween(nowKey, to)), windowMonths: monthsBetween(from, to), state };
}

// ---- the agreement ----------------------------------------------------------------------------------------------------------

/**
 * The agreement that counts (stageOf's A): `moving.agreed` stored, belonging to the plan (or carried on by a successor), and
 * made for the strategy the plan draws by. Holdings never void it; no other write can make one. A copy, or null.
 */
export function agreementOf(plan, { settings = null } = {}) {
  const ph = phasesAsTheyBelong(plan);
  const a = ph && isObj(ph.moving) ? agreedOrNull(ph.moving.agreed) : null;
  if (!a) return null;
  return a.strategyId === strategyIdOf(plan, settings) ? copy(a) : null;
}

/** The agreement as stored, when it belongs to the plan (whatever strategy it was made for): a copy, or null. */
export function storedAgreementOf(plan) {
  const ph = phasesAsTheyBelong(plan);
  const a = ph && isObj(ph.moving) ? agreedOrNull(ph.moving.agreed) : null;
  return a ? copy(a) : null;
}

/**
 * The phases a successor starts with (PlanClose.successorOf), from what its copy kept (`kept`, phasesForCopy's) and the plan
 * it carries on: for a move to a new plan (reason 'plan') the Moving agreement goes with it, marked `carriedFrom` the plan it
 * carries on, so the belonging rule keeps it there; back to work (a saving spell) carries none. Null when nothing is left.
 */
export function phasesForSuccessor(kept, plan, { reason = 'plan' } = {}) {
  const base = isObj(kept) ? copy(kept) : null;
  const agreed = reason === 'plan' ? storedAgreementOf(plan) : null;
  if (!agreed || !plan || plan.id == null) return base;
  const out = base || (isObj(plan.phases) && plan.phases.of != null ? { of: plan.phases.of } : {});
  out.moving = { ...(isObj(out.moving) ? out.moving : {}), agreed: { ...agreed, carriedFrom: String(plan.id) } };
  return out;
}

// ---- the reader ---------------------------------------------------------------------------------------------------------------

/**
 * Every part of a plan's phases, each as stored when the person chose it, else derived; `stored` says which were stored.
 * Writes nothing; its output is for reading and showing only, and no writer starts from it.
 * @param {object} plan
 * @param {{ now?: Date, settings?: object|null, phase?: string|null, stop?: string|null }} [o]
 *   `settings`: the effective Stress settings, where the caller has them; `phase`: the stage key (stageOf), for how often
 *   a saver's review falls (a check-in's own choice); `stop`: stageOf's stop, for the window
 */
export function phasesOf(plan, { now = new Date(), settings = null, phase = null, stop } = {}) {
  const ph = phasesAsTheyBelong(plan) || {};
  const sv = isObj(ph.saving) && isObj(ph.saving.strategy) ? ph.saving.strategy : null;
  const mv = isObj(ph.moving) ? ph.moving : {};
  const rv = isObj(ph.review) ? ph.review : {};
  const level = sv ? levelOrNull(sv.level) : null;
  const winYears = isObj(mv.window) ? windowYearsOrNull(mv.window.years) : null;
  const agreed = agreedOrNull(mv.agreed);
  const every = everyOrNull(rv.every);
  const rule = ruleOrNull(rv.rule);
  const log = Array.isArray(rv.log) ? rv.log.filter(isObj) : [];
  const history = Array.isArray(ph.history) ? ph.history.filter(isObj) : [];
  const ci = plan && isObj(plan.accumulationTool) ? everyOrNull(plan.accumulationTool.checkInEvery) : null;
  const w = windowOf(plan, { now, settings, stop });
  return {
    of: ph.of != null ? ph.of : null,
    belongs: belongsTo(plan && plan.phases, plan),
    saving: { strategy: { level: level || derivedLevelOf(plan), endTarget: END_TARGETS[0], at: level ? sv.at || null : null } },
    moving: { window: { ...w, at: winYears ? mv.window.at || null : null }, agreed: agreed ? copy(agreed) : null },
    drawing: { strategyId: strategyIdOf(plan, settings) },
    review: { every: phase === 'saving' ? ci || 'year' : every || 'year', rule: rule || defaultRuleOf(plan), log: copy(log) },
    history: copy(history),
    stored: { saving: !!level, window: !!winYears, agreed: !!agreed, every: !!every, rule: !!rule, log: log.length > 0, history: history.length > 0 }
  };
}

// ---- the one writer --------------------------------------------------------------------------------------------------------

/**
 * ONE part of the phases, written from the root as stored: `{ phases }`, the whole root to write (PHASE_WRITES, or
 * AGREE_WRITES for the agreement and its withdrawal). It deep-copies `plan.phases`, drops what does not belong to this plan
 * (belonging, above), sets only the named part, appends to the history (a choice, the agreement, its withdrawal) or to the
 * review log (a save, the agreement), and stamps `of` with the plan's `createdAt`. It never reads phasesOf, so nothing
 * derived is ever written.
 *
 *   part              value
 *   'window'          years, 1 to 5
 *   'saving.level'    'cautious' | 'balanced' | 'adventurous'
 *   'review.every'    'year' | 'quarter' | 'month'
 *   'review.rule'     { kind: 'success', floor } (a floor of OFF_COURSE.floors) | { kind: 'guardrails' }
 *   'review.log'      a review entry ({ at, phase: 'moving'|'drawing', … }); the log keeps the last REVIEW_LOG_MAX
 *   'moving.agreed'   { strategyId, how, heldPct, entryAt, entry? } — the agreement (dated `at`), and its review entry
 *   'moving.withdrawn' null — the agreement taken away
 *
 * @param {object} plan  the plan as stored (read as a load reads it)
 * @returns {{ phases: object }}
 */
export function phasesPatch(plan, part, value, { at } = {}) {
  if (!PHASE_PARTS.includes(part)) throw new Error('phasesPatch: ' + part + ' is not a part of the phases');
  const when = isoOf(at);
  const stored = plan && isObj(plan.phases) ? copy(plan.phases) : {};
  const ph = belongsTo(stored, plan) ? stored : phasesAsTheyBelong({ ...plan, phases: stored });
  const history = Array.isArray(ph.history) ? ph.history : [];
  const note = (what, from, to) => { ph.history = [...history, { at: when, what, from: from === undefined ? null : from, to: to === undefined ? null : to }]; };
  const logged = (entry) => {
    if (!isObj(entry)) throw new Error('phasesPatch: a review entry is an object');
    const rv = isObj(ph.review) ? ph.review : {};
    const log = Array.isArray(rv.log) ? rv.log : [];
    ph.review = { ...rv, log: [...log, copy(entry)].slice(-REVIEW_LOG_MAX) };
  };
  const moving = () => (isObj(ph.moving) ? ph.moving : {});
  switch (part) {
    case 'window': {
      const years = windowYearsOrNull(value);
      if (years == null) throw new Error('phasesPatch: a window is ' + WINDOW.min + ' to ' + WINDOW.max + ' years');
      const was = isObj(moving().window) ? windowYearsOrNull(moving().window.years) : null;
      ph.moving = { ...moving(), window: { years, at: when } };
      note('window', was, years);
      break;
    }
    case 'saving.level': {
      const level = levelOrNull(value);
      if (!level) throw new Error('phasesPatch: ' + value + ' is not a saving level');
      const sv = isObj(ph.saving) ? ph.saving : {};
      const was = isObj(sv.strategy) ? levelOrNull(sv.strategy.level) : null;
      ph.saving = { ...sv, strategy: { level, endTarget: END_TARGETS[0], at: when } };
      note('saving.level', was, level);
      break;
    }
    case 'review.every': {
      const every = everyOrNull(value);
      if (!every) throw new Error('phasesPatch: ' + value + ' is not how often a review falls');
      const rv = isObj(ph.review) ? ph.review : {};
      ph.review = { ...rv, every };
      note('review.every', everyOrNull(rv.every), every);
      break;
    }
    case 'review.rule': {
      const rule = ruleOrNull(value);
      if (!rule) throw new Error('phasesPatch: not a rule for off course');
      const rv = isObj(ph.review) ? ph.review : {};
      ph.review = { ...rv, rule };
      note('review.rule', ruleOrNull(rv.rule), rule);
      break;
    }
    case 'review.log':
      logged(value);
      break;
    case 'moving.agreed': {
      const v = isObj(value) ? value : {};
      if (typeof v.strategyId !== 'string' || !v.strategyId) throw new Error('phasesPatch: an agreement names its strategy');
      if (!AGREED_HOWS.includes(v.how)) throw new Error('phasesPatch: ' + v.how + ' is not how a move was agreed');
      const heldPct = v.heldPct == null ? null : Math.max(0, Math.min(100, Math.round(+v.heldPct)));
      if (heldPct != null && !Number.isFinite(heldPct)) throw new Error('phasesPatch: heldPct is a share of 100');
      const was = agreedOrNull(moving().agreed);
      ph.moving = { ...moving(), agreed: { at: when, strategyId: v.strategyId, how: v.how, heldPct, entryAt: typeof v.entryAt === 'string' ? v.entryAt : when } };
      note('moving.agreed', was ? was.how : null, v.how);
      if (v.entry != null) logged(v.entry);
      break;
    }
    case 'moving.withdrawn': {
      const was = agreedOrNull(moving().agreed);
      if (!was) throw new Error('phasesPatch: there is no agreement to withdraw');
      const { agreed, ...rest } = moving();
      void agreed;
      ph.moving = rest;
      note('moving.withdrawn', was.how, null);
      break;
    }
    default:
      throw new Error('phasesPatch: ' + part);
  }
  delete ph.of;
  const of = plan && typeof plan.createdAt === 'string' && plan.createdAt ? plan.createdAt : null;
  return { phases: of ? { of, ...ph } : ph };
}

/**
 * What a copy of a plan keeps of its phases (PlanCopy.copyOf): the person's choices — the saving level, the window, how often
 * and the rule — and `of`; never the agreement, the review log or the history (they belong to the plan they were made on).
 * Null when nothing is left.
 */
export function phasesForCopy(phases) {
  if (!isObj(phases)) return null;
  const p = copy(phases);
  delete p.history;
  if (isObj(p.moving)) { delete p.moving.agreed; if (!Object.keys(p.moving).length) delete p.moving; }
  if (isObj(p.review)) { delete p.review.log; if (!Object.keys(p.review).length) delete p.review; }
  const left = Object.keys(p).filter((k) => k !== 'of');
  return left.length ? p : null;
}
