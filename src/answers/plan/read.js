/**
 * Saved plans, read for the screen (research/v7/your-plan.md 1.2, 1.3, 2, 3, 6). Pure: a list of plans already brought
 * up to date in memory (src/v7/effects/planSource.js hands it in as { plan, newer, failed }) and today's date in; the
 * list's rows, and one plan's stage, steps, figures and next sentence out. Every figure is the plan's own record,
 * exact, with where it came from and its date (3). Nothing here writes, runs a future, or reads a clock.
 *
 *   planRows(entries, { today, source })                → the "Your plans" list: groups of rows
 *   planPage(entries, id, stepId, { today, source })    → one plan: stage, steps, the current step, the next sentence
 *   stageLine(stage, plan)                              → the stage's one line, in V7's words (rail-screens-language.md 1.3)
 *   theirLineOf(plan, now)                              → a partner's line, by their plan's phase (copy/plan.js theirLines)
 *   dateOf(today)                                       → 'YYYY-MM-DD' as a local Date at noon
 *
 * Words with {slots} are filled by the screen from copy/plan.js; the ids here match that file. A sentence's figures
 * are `parts` ({ key, kind }) into the step's `figures`, so the screen draws each through Money (data-key, data-value).
 */
import { planStage, effectiveStressSettings, whereAmIFor, whereAmIInputs, moveInputs, thisMonth, historyAscending } from '../../services/PlanReading.js';
import { CONTRACT_STRATEGIES, planToAgeOfDefinition, guardrailOf, pricesMonthKeyOf } from '../../services/PlanDocument.js';
import { taxYearLabel, taxYearStartOf, taxYearKey, ageOnDate } from '../../services/PlanTiming.js';
import { documentLadder, firstRungOf } from '../../services/LadderPosition.js';
import { saverPotOf } from '../../services/SaverReading.js';
import { payInShareOf } from '../../services/SaverPayIn.js';
import { holdingsSummary, normaliseHoldings } from '../../services/HoldingsRecord.js';
import { stepsFor, subStepsFor, ALL_STEPS, NEXT_ORDER, NEXT_INFO, DUE_IDS, RETIRED_STAGES, SAVER_STAGES } from './steps.js';
import { stageOf } from '../../services/LifeStage.js';
import { windowYearsOf, reviewDueOf, offCourseOf, moveWindowOf, heldPhase } from '../../services/Phases.js';
import { monthsWanted } from '../../services/DrawCadence.js';
import { taskKeyOf, isPutOff } from './tasks.js';
import { optionsFor } from './options.js';
import { answerAge, bandsOf, netOf, safeTiming } from './about.js';
import { stepLines } from './spend.js';
import { isBought } from './pots.js';
import { WAY_DIALS } from './schema.js';
import { savedLasts } from './lasts.js';
import { savedMix } from './mix.js';
import { budgetFiguresOf } from './budget.js';
import { oneAnswer, futuresOutOfTen } from '../../services/OneAnswer.js';
import { SUCCESS, planToAgeOf, STRESS as STRESS_ON } from '../shared/rules.js';
import { chanceWords, fixedAgeWords } from '../shared/format.js';

/**
 * What a locked document says about lasting, in its own words (7.8.0, the build spec's section 8). A document tested
 * under the weighted definition (assumptions.success with a weighted figure) says it as it was locked: the chance the money
 * lasted as long as you do, then the fixed-age count with its age. A document without one (every document before 7.8.0) keeps
 * its words, "Your plan lasts in 9 futures out of 10", and — once the figures are weighted (SUCCESS.weighted) — says how it
 * was counted, so it is never read against the weighted figures beside it. Nothing is written.
 */
export function lockedLastsWords(doc, a, dp, weighted = SUCCESS.weighted) {
  const def = doc && doc.assumptions && doc.assumptions.success && typeof doc.assumptions.success === 'object' ? doc.assumptions.success : null;
  const w = def && def.weighted && typeof def.weighted === 'object' ? def.weighted : null;
  if (w && typeof w.chance === 'number') {
    const age = planToAgeOfDefinition(def) ?? planToAgeOfDoc(dp);
    return 'When the plan was locked, counting how long people your age live, the money lasted as long as you do ' + chanceWords(w.chance) + '. ' + fixedAgeWords(typeof w.fixedAge === 'number' ? w.fixedAge : a.share, age).replace(/\.$/, '');
  }
  const own = 'Your plan lasts ' + futuresOutOfTen(a.share).words;
  if (!weighted || def) return own;
  return own + '; when it was locked, counted to ' + planToAgeOfDoc(dp) + '; not by how long you might live';
}

/** The age a document's plan runs to, as every page of both apps says it (rules.js planToAgeOf: "to 97" = to the 97th birthday). */
const planToAgeOfDoc = (dp) => planToAgeOf(+(dp && dp.startAge) || 0, +(dp && dp.durationYears) || 0);
import { unlockPatchesOf, lockedShortOf } from '../../services/PlanCommit.js';
import { checkInState, checkInsOf } from './checkInDue.js';
import { saverInputsOf } from './saverInputs.js';
import { MONTHS, dateOf, ym, monthWords, monthName, dayWords, monthsBetween, localDay, timeLeftWords } from './dates.js';
import { heldLadder } from './held.js';
import { moveStatusOf } from './moveWords.js';
import { isClosedPlan, closedReading, beforeReading, closedAtOf, monthRefusalWords } from '../../services/PlanClosed.js';
import { closeQuestionOf, successorName } from '../../services/PlanClose.js';
import { startLaterOf, laterDraftLeftOf } from '../../services/PlanMove.js';
import { shownPlanName } from '../../services/PlanName.js';
import { takenSentence, yearPlanOf, firstPaymentMonth, monthToRecord } from '../../services/YearPlan.js';
// the plans linked to this one, in either direction (6), this plan's own link first; never a closed plan (services/HouseholdLink.js)
import { partnersOf, partnerIdOf } from '../../services/HouseholdLink.js';

// The dates in words live in dates.js (shared with about.js); kept as exports here for everyone who reads them from read.js.
export { dateOf, monthWords, monthName, dayWords };
const num = (v) => (v == null || v === '' || !Number.isFinite(+v) ? null : +v);
const r0 = (v) => Math.round(num(v) || 0);
/** The name a plan is shown by: the person's own, else one that follows the plan's present figures (services/PlanName.js). */
const nameOf = (plan, now) => shownPlanName(plan, { now });
const isLocked = (plan) => !!(plan && plan.decisionTool && plan.decisionTool.settings && plan.decisionTool.settings.locked);
const lockedAtOf = (plan) => (plan && plan.decisionTool && plan.decisionTool.settings && plan.decisionTool.settings.lockedAt) || (plan && plan.planDocument && plan.planDocument.lockedAt) || null;

/** The strategy ids with plain names in copy/plan.js (the ladder word on the stage line: CONTRACT_STRATEGIES). */
const stratId = (plan, ss) => (plan && plan.planDocument && plan.planDocument.strategy && plan.planDocument.strategy.id) || (ss && ss.strategyId) || 'pots-and-valves';
const isLadderPlan = (plan, ss) => CONTRACT_STRATEGIES.includes(stratId(plan, ss));

/** The ladder a locked plan's document holds (the orders fixed at the lock), or null. */
const lockedLadderOf = (plan, ss) => (isLadderPlan(plan, ss) && plan && plan.planDocument ? documentLadder(plan.planDocument, stratId(plan, ss)) : null);

/**
 * When a locked plan pays (7.12.0): from the first month it paid (YearPlan.firstPaymentMonth: the first record, else the month
 * its first tax year was set up from, else the month work stopped) — never April by assumption; with none known, its first
 * tax year. A ladder whose cash pays the years before its first gilt says that gilt's year too: one fact each.
 */
function paysFromWords(fp, firstTaxYear, L, ladder = !!L) {
  const rung = L ? firstRungOf(L) : null;
  const Y0 = L ? L.years[0].Y : firstTaxYear;
  if (L && rung && rung.Y > Y0) return ' a year before tax; ' + (fp ? 'your plan pays from ' + monthWords(fp) : 'your plan’s first tax year is ' + taxYearLabel(Y0)) + '; the ladder’s first gilt from April ' + rung.Y;
  const who = ladder ? 'ladder' : 'plan';
  return ' a year before tax; ' + (fp ? 'your ' + who + ' pays from ' + monthWords(fp) : 'your ' + who + '’s first tax year is ' + taxYearLabel(Y0));
}

/**
 * The stage line (rail-screens-language.md 1.3; your-plan.md 2.1): the key, the dates and the flags only — never the
 * planner's label, chip or banner. { id, slots } — the words are copy/plan.js stageLines[id]. A ladder's months come from
 * the ladder the document holds, not the plan's start (6.51.0, research/plan-start.md §2 E): a plan living on its ladder
 * whose first gilt is still ahead (the cash years pay until then) says when that gilt pays.
 */
export function stageLine(stage, plan, ss = null) {
  const key = stage && stage.key;
  if (!key || key === 'unknown') return null;
  if (key === 'committed-saving') return { id: 'committed-saving', slots: { month: monthWords(stage.startMonth) || taxYearLabel(stage.firstTaxYear) } };
  // A locked retired plan is lived on — one stored the old way, with its year 0 still ahead, too: it has no words of its own
  // for the months before its start, and its home's to-do asks to move the start.
  if (key === 'running') {
    const rung = firstRungOf(lockedLadderOf(plan, ss));
    const thisTY = Number.isFinite(stage.planYearNow) && stage.firstTaxYear > 0 ? stage.firstTaxYear + stage.planYearNow : null;
    if (rung && thisTY != null && rung.Y > thisTY) return { id: 'running-ladder', slots: { month: 'April ' + rung.Y } };
    return { id: 'running', slots: {} };
  }
  return { id: key, slots: {} };
}

function safeStage(plan, now) {
  try { return planStage(plan, { now }); } catch { return { key: 'unknown', locked: isLocked(plan), retired: false, timingMode: 'legacy', firstTaxYear: null, startMonth: null, beforeStart: false, hasRecords: false, hasDocument: !!(plan && plan.planDocument), monthsToStart: 0, yearsToStart: 0 }; }
}
function safeSettings(plan, now) {
  try { return effectiveStressSettings(plan, { now }); } catch { return (plan && plan.stressTool && plan.stressTool.settings) || {}; }
}

/**
 * The stage line with the plans at hand: a closed plan's names the plan that carries it on (copy/plan.js stageLines.closed),
 * or only the month when that plan is not here ('closed-alone'). Every other stage's as stageLine gives it.
 */
function lineOf(stage, plan, ss, list, now, life = null) {
  const r = isClosedPlan(plan) ? closedReading(plan, list, now) : null;
  // closed for going back to work (research/plan-start.md §2 J): "Closed March 2029: back to work; carried on as ‘…’."
  const why = r && r.working ? '-working' : '';
  if (r && stage && stage.key === 'closed') return r.next ? { id: 'closed' + why, slots: { month: r.month, name: r.next.name } } : { id: 'closed-alone', slots: { month: r.month } };
  // closed at a change-over still to come: lived on until then, and said so (LifeStage keeps its stage)
  if (r && r.ahead) return r.next ? { id: 'closing' + why, slots: { month: r.month, name: r.next.name } } : { id: 'closing-alone', slots: { month: r.month } };
  return phaseLine(stage, plan, life) || stageLine(stage, plan, ss);
}

/**
 * The line follows the phase (7.10.0, LifeStage.stageOf), never a placing it has left: past the stop on a plan not locked,
 * the stop as the plan says it (the home asks "did you stop work?"); living on it by an agreement or a month recorded on a
 * saver's placing, the words of a plan lived on (not locked yet, or locked); a saver not locked, the phase's words, never the
 * placing's own five years (outside the plan's window "Still saving.", inside it the window's line — a window shorter or longer
 * than five years, or a stop the plan knows only as an age). Null where the placing's own line is the phase's.
 */
function phaseLine(stage, plan, life) {
  if (life && life.confirmStop && life.stop) return { id: 'pastStop', slots: { month: monthWords(life.stop) } };
  if (life && life.key === 'drawing' && stage && SAVER_STAGES.includes(stage.key)) return isLocked(plan) ? { id: 'running', slots: {} } : { id: 'draft-retired', slots: {} };
  if (life && stage && stage.key === 'approaching' && life.key === 'saving') return { id: 'saving', slots: {} };
  if (life && stage && stage.key === 'saving' && life.key === 'moving') return { id: 'approaching', slots: {} };
  return null;
}

/**
 * A partner's line, after "With ‘…’:" (copy/plan.js theirLines): their plan's phase as LifeStage.stageOf reads it (7.10.0),
 * as their own pages read it — so a partner past their stop is asked about it on their plan, never said to be inside the move
 * window. `ss`, their effective settings, when the caller has them.
 */
export function theirLineOf(plan, now, ss = null) {
  const stage = safeStage(plan, now);
  const s = ss || safeSettings(plan, now);
  let life = null; try { life = stageOf(plan, now, { placing: stage, settings: s }); } catch { life = null; }
  return phaseLine(stage, plan, life) || stageLine(stage, plan, s);
}

/**
 * The question "Move to a new plan" asks on the row (services/PlanClose.js closeQuestionOf), as plain data for the screen:
 * the months to move from (suggested first), the new plan's name, the pots (filled in, and where from), and the partner's plan
 * whose link may move. Going back to work (§2 J) is offered beside it when the plan knows the person's age (`working`), with
 * its own name for the saving plan and, when money has been taken from the pension flexibly, the month that limit began
 * (the new plan carries it). Null for a plan not offered the move.
 */
function closeOf(plan, list, now) {
  let q = null;
  try { q = closeQuestionOf(plan, { now, plans: list.map((e) => e.plan) }); } catch { q = null; }
  if (!q) return null;
  return {
    // each month with the new plan's default name from it (either reason): the name box follows the month chosen until
    // the person types over it
    months: q.months.map((m) => ({ month: m.month, words: m.words, year: taxYearLabel(m.taxYear), name: successorName(plan, m.month), workingName: q.working ? successorName(plan, m.month, 'working') : null })),
    suggested: q.suggested,
    name: successorName(plan, q.suggested),
    asked: q.asked,
    held: q.held,
    pots: { pension: r0(q.pots.pension), isa: r0(q.pots.isa), gia: r0(q.pots.gia) },
    potsFrom: q.potsFrom,
    partner: q.partner,
    working: q.working ? { name: successorName(plan, q.suggested, 'working'), ageNow: q.ageNow, flexibleAccess: q.flexibleAccess ? { month: q.flexibleAccess.month } : null } : null
  };
}

/**
 * Whether a check-in is due: ONE rule (7.3.0, research/v7/one-product-design.md rank 11) — checkInDueOf's `due`, the plan
 * locked while saving that never chose how often included (due while this month's pot is not recorded), so the plans list,
 * the rail and the home say the same.
 */
function checkInDue(plan, now, stageKey) {
  try { return checkInState(plan, { today: localDay(now), stageKey }).due === true; } catch { return false; }
}

/**
 * The list (1.2). Groups, in order: "household" (plans joined by a link, either way), "other" (most recently changed
 * first) — or, when the plans are this window's (nobody signed in), one group "window".
 */
export function planRows(entries, { today, source = 'account' } = {}) {
  const now = dateOf(today);
  const list = (entries || []).filter((e) => e && e.plan && typeof e.plan === 'object' && e.plan.id != null);
  const rows = list.map((e) => {
    const plan = e.plan;
    const stage = safeStage(plan, now);
    // the stage in three words and how many things are due (7.3.0): the plan's own reading, the one its home and rail read
    let pg = null; try { pg = planPage(list, plan.id, null, { today, source }); } catch { pg = null; }
    const ss = safeSettings(plan, now);
    const partners = partnersOf(list, plan);
    return {
      id: String(plan.id),
      name: nameOf(plan, now),
      stageKey: stage.key,
      line: lineOf(stage, plan, ss, list, now, pg && pg.found ? pg.life : null),
      // a closed plan sits under "Previous plans" (once its last month has passed: until then it is lived on); one someone
      // has lived on may be moved to a new plan (6.56.0)
      closed: stage.key === 'closed',
      close: e.newer || e.failed || plan.example === true ? null : closeOf(plan, list, now),
      locked: isLocked(plan),
      lockedOn: isLocked(plan) ? dayWords(lockedAtOf(plan)) : null,
      madeOn: plan.fromAnswer && plan.fromAnswer.savedOn ? dayWords(plan.fromAnswer.savedOn) : null,
      shownAsSaved: !!(e.newer || e.failed),
      // the plan menu (road-to-7.md step 11): the read-only example (GuestPlans.js), and the main plan (the planner's isActive)
      example: plan.example === true,
      main: plan.isActive === true,
      records: !!(plan.decisionTool && ((Array.isArray(plan.decisionTool.history) && plan.decisionTool.history.length > 0) || Object.values(plan.decisionTool.taxYears && typeof plan.decisionTool.taxYears === 'object' ? plan.decisionTool.taxYears : {}).some((t) => t && t.yearSetupComplete))),
      linked: partners.length > 0,
      // "Check-in due" beside the plan (research/saving-enough-and-check-in.md 5.2): once a check-in has said how often
      checkInDue: SAVER_STAGES.includes(stage.key) && !(e.newer || e.failed) && checkInDue(plan, now, stage.key),
      // Month by month (research/v7/months-in-v7.md §0, 7.2.0): a plain way in beside every drawing plan, a plan closed after it was lived on included
      monthByMonth: MONTH_STAGES.includes(stage.key) && plan.example !== true,
      life: pg && pg.life ? pg.life.key : null,
      // a closed plan's way on is not a thing to do on it (the row says "Closed", and its home opens the plan carrying on)
      todo: pg && Array.isArray(pg.due) ? pg.due.filter((d) => d.id !== 'closed.next').length : 0,
      lastModified: typeof plan.lastModified === 'string' ? plan.lastModified : ''
    };
  });
  const byTime = (a, b) => String(b.lastModified).localeCompare(String(a.lastModified));
  // the closed plans last, under "Previous plans" (6.56.0), whichever store they are in
  const previous = rows.filter((r) => r.closed).sort(byTime);
  const open = rows.filter((r) => !r.closed);
  const tail = previous.length ? [{ id: 'previous', rows: previous }] : [];
  if (source === 'window') return { groups: [{ id: 'window', rows: open.slice().sort((a, b) => (a.linked === b.linked ? byTime(a, b) : a.linked ? -1 : 1)) }, ...tail].filter((g) => g.rows.length) };
  const household = open.filter((r) => r.linked).sort(byTime);
  const other = open.filter((r) => !r.linked).sort(byTime);
  const groups = [];
  if (household.length) groups.push({ id: 'household', rows: household });
  if (other.length) groups.push({ id: 'other', rows: other });
  return { groups: [...groups, ...tail] };
}

// ---- figures and sentences -------------------------------------------------------------------------------------------

const money = (key) => ({ key, kind: 'money' });
const count = (key) => ({ key, kind: 'count' });
/** How a dial's figure is written, by its type in schema.js WAY_DIALS; the two pots a ladder's document is built on are money. */
const DIAL_KINDS = Object.freeze({ count: 'count', age: 'age', money: 'money', percent: 'pct' });
const DOCUMENT_DIALS = Object.freeze({ sippTotal: 'money', isaTotal: 'money' });
const age = (key) => ({ key, kind: 'age' });
const pounds = (n) => '£' + String(Math.abs(Math.round(Number(n) || 0))).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
const textOf = (p, figures) => (typeof p === 'string' ? p : 'fixed' in p ? String(p.fixed) : p.kind === 'money' ? pounds(figures[p.key]) : String(Math.round(Number(figures[p.key]) || 0)));
/** A sentence: an id (for the tests), its parts, and the text as drawn. */
const sentence = (id, parts, figures) => ({ id, parts, text: parts.map((p) => textOf(p, figures)).join('') });

/** Where a figure came from (3.2): 'record' | 'hold' | 'locked' | 'saved' | 'budget', its date in words, and whether it is over three months old. */
function sourceOf(kind, at, now) {
  const p = at ? ym(at) : null;
  const t = { y: now.getFullYear(), m: now.getMonth() + 1 };
  const stale = !!p && monthsBetween(p, t) > 3;
  return { kind, at: at ? (String(at).length > 7 ? dayWords(at) : monthWords(at)) : null, stale };
}

/** One line of a step's panel: a label id, the sentence, its source. */
const line = (id, parts, figures, source, slots = {}) => ({ id, slots, sentence: sentence(id, parts, figures), source });
const button = (id, place, slots = {}) => ({ id, place, slots });
const link = (id, href, slots = {}) => ({ id, href, slots });

// ---- the steps -------------------------------------------------------------------------------------------------------

/**
 * "Record {August}": Month by month inside the new app since 7.2.0 (research/v7/months-in-v7.md) — it opens on the month to
 * record and offers every month missed before it, so the month rides along only as the button's words.
 */
const monthHref = (plan) => '#/plan/' + plan.id + '/month';
const recordButton = (plan, month) => ({ ...link('record', monthHref(plan), { month: monthName(month) }), month });
/** The stages a plan draws in, or has drawn in (a closed plan's months up to its close): Month by month is theirs. */
const MONTH_STAGES = ['draft-retired', 'running', 'closed'];

/**
 * This month's record (2.3 `month`). The month to record is the EARLIEST month not recorded, from the first record's
 * month up to last month — for example September and November recorded, October not: the
 * step said November was recorded, nothing to do, with no way to record October. With no such gap it is this month,
 * recorded when the latest record's month is this month or later ("paid this month already" dates an entry a month on,
 * and marks the record, so the month before it is never the gap once the calendar moves on). Batches (the quarterly and
 * annual cadence) write one record per month, so a gap is only ever a month nobody recorded.
 * A record LATER than the gap was worked out without the missing month (calcDecisionPWA reads the records before the
 * entry's month) and nothing rewrites it: the panel says so when there is one.
 */
function monthStep(C) {
  const { plan, now, ty, tyKey, mon } = C;
  const hist = historyAscending(plan);
  const latest = hist.length ? hist[hist.length - 1] : null;
  // the one month to record (7.12.0, YearPlan.monthToRecord): the same month Month by month and the full view open on
  const mtr = monthToRecord(plan, mon);
  const gap = mtr.gap ? mtr.month : null;
  const recorded = !mtr.month;
  const toRecord = mtr.month || mon;
  const figures = {};
  const lines = [];
  const setUp = !!(plan.decisionTool && plan.decisionTool.taxYears && plan.decisionTool.taxYears[tyKey] && plan.decisionTool.taxYears[tyKey].yearSetupComplete);
  // a closed plan past its last month (6.56.0): its months are read, and nothing after the close is set up or recorded here
  const closedAt = closedAtOf(plan);
  if (closedAt && mon > closedAt) {
    hist.slice(-3).reverse().forEach((h, i) => {
      figures['net' + i] = r0(h.monthlyNet); figures['tax' + i] = r0(h.monthlyTax);
      lines.push(line('month.record', [{ fixed: monthWords(h.date) }, ': ', money('net' + i), ' after tax, ', money('tax' + i), ' tax'], figures, sourceOf('record', h.date, now), { month: monthWords(h.date) }));
    });
    const result = sentence('month.closed', [monthRefusalWords({ why: 'closed', closedAt })], figures);
    return { done: true, result, figures, lines, buttons: [], notes: [], recorded: true, setUp, gap: null, toRecord: mon };
  }
  // a retired plan not locked yet (7.2.0): its months are recorded once it is locked, and the step says so with the way there
  if (!C.locked) {
    const result = sentence('month.lockFirst', ['Months are recorded once the plan is locked'], figures);
    return { done: false, result, figures, lines, buttons: [link('lockFirst', '#/plan/' + plan.id + '/lock'), link('monthByMonth', monthHref(plan))], notes: [], recorded: false, setUp, gap: null, toRecord: mon };
  }
  lines.push(line(setUp ? 'month.yearSetUp' : 'month.yearNotSetUp', [], figures, sourceOf('record', null, now), { year: taxYearLabel(ty) }));
  hist.slice(-3).reverse().forEach((h, i) => {
    figures['net' + i] = r0(h.monthlyNet); figures['tax' + i] = r0(h.monthlyTax);
    lines.push(line('month.record', [{ fixed: monthWords(h.date) }, ': ', money('net' + i), ' after tax, ', money('tax' + i), ' tax'], figures, sourceOf('record', h.date, now), { month: monthWords(h.date) }));
  });
  if (gap && String(latest.date).slice(0, 7) > gap) lines.push(line('month.gapLater', [], figures, sourceOf('record', latest.date, now), { month: monthWords(latest.date) }));
  let result;
  // the latest record's own month, with its own figure (never this month's name on a later month's figures)
  if (recorded) { figures.net = r0(latest.monthlyNet); result = sentence('month.recorded', [monthWords(latest.date) + ' recorded: ', money('net'), ' after tax'], figures); }
  else if (gap) result = sentence('month.gap', [monthWords(gap) + ' is not recorded yet; ' + monthWords(latest.date) + ' is.'], figures);
  else result = sentence('month.notYet', [monthWords(mon) + ' is not recorded yet'], figures);
  const buttons = [recordButton(plan, toRecord)];
  if (!setUp) buttons.push(link('setUpYear', monthHref(plan), { year: taxYearLabel(ty) }));
  return { done: recorded, result, figures, lines, buttons, notes: [], recorded, setUp, gap, toRecord };
}

/**
 * The month whose prices the plan's band is in (7.12.0): April of its first tax year; or, for a document locked in a later
 * plan year (its pots `asOfPlanYear` > 0), the month it was locked.
 */
function pricesMonthOf(doc) {
  // the one rule both views say it by (PlanDocument.pricesMonthKeyOf, whereAmI's pot.prices.since)
  return monthWords(pricesMonthKeyOf(doc)) || 'the start of the plan';
}

/** Where you are (2.3 `where`): whereAmI on the plan document, never the countdown. */
function whereStep(C) {
  const { plan, now, ss } = C;
  const figures = {};
  const lines = [];
  const notes = [];
  // a closed plan locked by its months (or by the close) and never given a document: nothing to read against, but not "not locked"
  if (!plan.planDocument && isClosedPlan(plan)) return { done: true, result: sentence('where.closedNoDocument', ['This plan closed before it had a plan document; its months are in the full view'], figures), figures, lines, buttons: [], notes };
  if (!plan.planDocument) return { done: false, result: sentence('where.noDocument', ['Not locked: nothing to read against yet'], figures), figures, lines, buttons: [], notes };
  let w = null, inputs = { ladderInDocument: false };
  try { w = whereAmIFor(plan, { now }); inputs = whereAmIInputs(plan, { now }); } catch { w = null; }
  const lockedAt = lockedAtOf(plan);
  if (!w) return { done: false, result: sentence('where.noReading', ['The plan document could not be read'], figures), figures, lines, buttons: [button('seeDocument', 'document')], notes };
  let result;
  let compare = null;
  if (w.saving) {
    const s = w.saving;
    if (s.pathMissing || s.actual == null || s.expected == null) result = sentence('where.saverNone', ['No pot recorded against the plan’s path yet'], figures);
    else {
      figures.actual = r0(s.actual); figures.expected = r0(s.expected);
      // one basis (7.12.0): the figure the path is in first, as recorded in brackets, when prices have moved
      const moved = s.compared != null && s.prices && Number.isFinite(+s.prices.factor) && Math.abs(+s.prices.factor - 1) >= 0.0005 && s.prices.start;
      if (moved) {
        figures.compared = r0(s.compared);
        result = sentence('where.saver', [money('compared'), ' at the prices of ' + monthWords(s.prices.start) + ' (', money('actual'), ' as recorded in ' + monthWords(s.at) + '); the plan’s middle line for then is ', money('expected')], figures);
      } else result = sentence('where.saver', [money('actual'), ' on ' + monthWords(s.at), '; the plan’s middle line for then is ', money('expected')], figures);
      lines.push(line('where.saverPot', [money('actual')], figures, sourceOf(s.actualSource === 'holdings' ? 'hold' : 'record', s.recordedAt || s.at, now)));
      lines.push(line('where.saverLine', [money('expected')], figures, sourceOf('locked', lockedAt, now)));
    }
  } else {
    // A plan stored the old way (C.startLater) whose year 0 is still later than this tax year: this year's figure is year 0's,
    // a later tax year's, so the months recorded are said with what was taken and nothing is read against a plan figure until
    // its start is moved (on About you and when). Once year 0 has come its months are year 0's, read against the right year's
    // figure, as the planner's strip reads them (PlanDocument.whereAmI: only a year 0 ahead is held back).
    const older = !!C.startLater && C.startLater.start > C.ty;
    const inc = w.incomeThisYear || { recorded: 0, drawn: 0 };
    // like with like (7.12.0, services/YearPlan.js): what was taken in the months recorded against what each of those months
    // told the person to take (the records' own figures, never the document's year row a twelfth a month), the difference
    // said as less, more or "as your plan said", "because income was cut" only when a recorded month says the cut was on,
    // then what reached the bank — the very sentence the full view's strip says
    const said = takenSentence(inc, { year: w.taxYear, compare: !older });
    Object.assign(figures, said.figures);
    result = sentence('where.retired', said.parts, figures);
    compare = said.compare;
    // the year as it was set up (7.12.0, YearPlan.yearPlanOf): what the plan takes a month this tax year, and from when when
    // it was set up part-way; nothing for a year not set up (the to-do asks for the set-up)
    let yp = null; try { yp = older ? null : yearPlanOf(plan, taxYearKey(parseInt(w.taxYear, 10))); } catch { yp = null; }
    if (yp) {
      figures.yearMonthly = Math.round(yp.perMonth); figures.yearTotal = yp.total;
      const april = yp.from && yp.from.slice(5) === '04' && yp.payments === 12;
      lines.push(line('where.yearPlan', april
        ? ['In ' + w.taxYear + ' your plan takes ', money('yearMonthly'), ' a month before tax.']
        : ['In ' + w.taxYear + ' your plan takes ', money('yearMonthly'), ' a month before tax, from ' + monthWords(yp.from) + ': ' + yp.payments + ' payment' + (yp.payments === 1 ? '' : 's') + ', ', money('yearTotal'), '.'], figures, sourceOf('record', null, now), { year: w.taxYear }));
    }
    // (7.10.0: the start is changed on "About you and when", by unlock and lock again — no longer a to-do)
    if (older) lines.push(line('where.startLater', ['Your plan is set to start in April ' + C.startLater.start + ', so these months are not read against it yet' + (C.readonly ? '' : '. You can change the start on About you and when')], figures, sourceOf('locked', lockedAt, now), { start: 'April ' + C.startLater.start }));
    if (inc.recorded > 0) lines.push(line('where.taken', [money('drawn')], figures, sourceOf('record', null, now), { year: w.taxYear }));
    if (w.step && w.step.amount != null) { figures.stepNow = r0(w.step.amount); lines.push(line('where.step', [money('stepNow'), ' a year before tax'], figures, sourceOf('locked', lockedAt, now), { n: String(w.step.index), of: String(w.step.of) })); }
    // the pot (7.12.0): ONE basis, the one the band is in (whereAmI's `real`, as Review and the full view say it), with the
    // figure as recorded in brackets when prices have moved; its parts and their dates when they are more than a month apart;
    // and, when the band counts the ISA and no figure for it exists anywhere, that — never a pot set against the line
    const P = w.pot;
    if (P && P.real != null && P.actual != null) {
      figures.pot = r0(P.real); figures.potActual = r0(P.actual);
      const moved = P.prices && Number.isFinite(+P.prices.factor) && Math.abs(+P.prices.factor - 1) >= 0.0005;
      // its parts as typed (7.12.0): the pension and the ISA said in the same line when they come from the same month and
      // the same place (so the ISA typed with each month is said back on the home); else their own line, each with its date
      const parts = (Array.isArray(P.parts) ? P.parts : []).filter((x) => x && x.asOf && (x.key === 'pension' || x.key === 'isa'));
      const whence = (x) => (x.source === 'holdings' ? 'from What you hold, ' + monthWords(x.asOf) : 'recorded ' + monthWords(x.asOf));
      parts.forEach((x, i) => { figures['potPart' + i] = r0(x.value); });
      const partName = (x) => (x.key === 'isa' ? 'ISA ' : 'pension ');
      const together = parts.length > 1 && whence(parts[0]) === whence(parts[1]);
      const inLine = together ? parts.flatMap((x, i) => [i ? ', ' : '', partName(x), money('potPart' + i)]) : [];
      lines.push(line('where.pot', moved
        ? [money('pot'), ' at the prices of ' + pricesMonthOf(plan.planDocument) + ' (', money('potActual'), ' as recorded', ...(together ? [': ', ...inLine] : []), ').']
        : [money('pot'), ...(together ? [' (', ...inLine, ')'] : []), '.'], figures, sourceOf(P.source === 'holdings' ? 'hold' : 'record', P.asOf, now)));
      if (P.p50 != null && !older && !w.contract) { figures.potMid = r0(P.p50); lines.push(line('where.potMid', [money('potMid'), '.'], figures, sourceOf('locked', lockedAt, now))); }
      const ms = parts.map((x) => ym(x.asOf)).filter(Boolean);
      if (parts.length > 1 && !together && ms.length === parts.length && Math.abs(monthsBetween(ms[0], ms[1])) > 1) {
        const words = parts.map((x, i) => [(x.key === 'isa' ? 'ISA ' : 'Pension '), money('potPart' + i), ', ' + whence(x) + '.']);
        lines.push(line('where.potParts', words.reduce((a, b, i) => a.concat(i ? [' '] : [], b), []), figures, sourceOf('record', null, now)));
      }
    } else if (P && Array.isArray(P.missing) && P.missing.includes('isa') && !P.missing.includes('pension')) {
      lines.push(line('where.potNoIsa', ['Your plan counts your ISA too, and we have no figure for it. You can type it in the ISA box when you next record a month, or add it under What you hold.'], figures, sourceOf('record', null, now)));
    }
  }
  // the guardrail reading (7.9.0; services/PlanDocument.js guardrailOf): this year's draw as a share of what the pots hold,
  // beside the share the plan as locked began with — said once drawing has started, never before (rules.js STRESS.guardrail)
  let guardrail = null;
  if (STRESS_ON.guardrail && !w.saving) { try { const g = guardrailOf(plan.planDocument, w); guardrail = g ? { state: g.state, slots: g.slots, cuts: g.cutsOn } : null; } catch { guardrail = null; } }
  if (w.contract && !inputs.ladderInDocument) notes.push('where.ladderNotInDocument');
  if (w.ladder && typeof w.ladder.monthly === 'number' && w.ladder.monthly > 0 && !lines.some((l) => l.id === 'where.yearPlan')) {   // the month's figure once: the year as set up says it (7.12.0)
    figures.ladderMonthly = r0(w.ladder.monthly); lines.push(line('where.ladderMonthly', [money('ladderMonthly'), ' a month before tax'], figures, sourceOf('locked', lockedAt, now))); }
  // the records by tax year, a spreadsheet per year and the printed documents stay on the classic page (road-to-7.md step 11b, month.exports)
  const older = !w.saving && !!C.startLater && C.startLater.start > C.ty;
  const startHere = older && !C.readonly ? [link('aboutWhen', '#/plan/' + plan.id + '/about')] : [];
  return { done: true, result, compare, figures, lines, buttons: [...startHere, button('seeDocument', 'document'), button('exports', 'exports')], notes, ...(guardrail ? { guardrail } : {}) };
}

/** The income steps as the plan has them: the document's (locked), else the effective settings'. */
function incomeSteps(plan, ss, locked, now) {
  if (locked && plan.planDocument && Array.isArray(plan.planDocument.steps) && plan.planDocument.steps.length) return plan.planDocument.steps.map((s) => ({ fromAge: +s.fromAge, amount: r0(s.amount), taxYear: s.taxYear || null, decline: +s.decline || 0, glideToNext: !!s.glideToNext }));
  const ageNow = num(ss.shapeAgeNow) || null;
  if (ss.incomeShape === 'phases' && Array.isArray(ss.incomeSteps) && ss.incomeSteps.length) {
    // read as the Spend page reads them (7.12.0, spend.js stepLines): from the plan's own start, so a stop moved later moves
    // the first step with it; nothing is written
    const from = num(safeTiming(ss, now).shapeAgeNow) || ageNow;
    const shown = from ? stepLines(ss.incomeSteps, from, num(ss.duration) || 1, bandsOf(ss)) : [];
    if (shown.length) return shown.map((st) => ({ fromAge: st.fromAge, amount: r0(st.yearly), taxYear: null, decline: st.then === 'falls' ? +st.fallsPct || 0 : 0, glideToNext: st.then === 'glides' }));
    return ss.incomeSteps.filter((s) => s && num(s.amount) != null).map((s) => ({ fromAge: +s.fromAge, amount: r0(s.amount), taxYear: null, decline: +s.decline || 0, glideToNext: !!s.glideToNext }));
  }
  const first = Array.isArray(ss.targetSchedule) && ss.targetSchedule.length ? r0(ss.targetSchedule[0]) : r0(ss.baseSalary);
  return ageNow ? [{ fromAge: ageNow, amount: first, taxYear: null, decline: 0, glideToNext: false }] : [{ fromAge: null, amount: first, taxYear: null, decline: 0, glideToNext: false }];
}

/**
 * "Pots when you stop" (7.12.0): worked out from your pot and what goes in (services/PotsAtStop.js, the middling case,
 * to the nearest £1,000), your own typed figure (which does not follow), or the figure the plan was locked with.
 */
function atStopLine(par, { locked, lockedAt, figures, src }) {
  const k1 = (v) => Math.round((+v || 0) / 1000) * 1000;
  if (locked) {
    figures.parSipp = r0(par.sipp); figures.parIsa = r0(par.isa);
    return line('pots.atStop', [money('parSipp'), ' pension', figures.parIsa > 0 ? [', ', money('parIsa'), ' in ISAs and savings'] : [], ', as worked out when the plan was locked' + (lockedAt ? ' on ' + dayWords(lockedAt) : '')].flat(), figures, src, { kind: 'locked' });
  }
  if (par.source === 'worked' && par.from) {
    figures.parSipp = k1(par.sipp); figures.parIsa = k1(par.isa); figures.parFrom = r0(par.from.pot); figures.parMonthly = r0(par.from.monthly); figures.parTo = par.from.toAge;
    return line('pots.atStop', [money('parSipp'), ' pension', ...(figures.parIsa > 0 ? [' and ', money('parIsa'), ' in ISAs and savings'] : []),
      // (7.12.0: "the pension you have now", so this line, whose first figure is the pot at the stop, never reads as the pot today)
      ' in a middling case. Worked out from the pension you have now, ', money('parFrom'), ', and ', money('parMonthly'), ' a month going in, to age ', age('parTo')], figures, src, { kind: 'worked' });
  }
  figures.parSipp = r0(par.sipp); figures.parIsa = r0(par.isa);
  if (par.source === 'override') {
    return line('pots.atStop', [money('parSipp'), ' pension', ...(figures.parIsa > 0 ? [', ', money('parIsa'), ' in ISAs and savings'] : []),
      ', your own figure. It does not follow your pot or what you pay in. You can clear it on “Your pots and tax”'], figures, src, { kind: 'typed' });
  }
  return line('pots.atStop', [money('parSipp'), ' pension, ', money('parIsa'), ' ISA'], figures, src);
}

/**
 * Whether the plan still asks what its last check-in tested (7.12.0): the stop age and the aim a month the check-in's
 * reading kept (`tested`). A reading from before 7.12.0 kept none: read as still tested, as before.
 */
function stillTested(plan, now) {
  const list = checkInsOf(plan);
  const last = list.length ? list[list.length - 1] : null;
  const t = last && last.reading && last.reading.tested;
  if (!t || typeof t !== 'object') return true;
  let read = null; try { read = saverInputsOf(plan, { today: localDay(now) }); } catch { read = null; }
  if (!read || !read.ok) return true;
  return read.notes.stopAge === t.stopAge && read.notes.aimMonthly === t.aim;
}

/** Your plan (2.3 `plan`): the settings as sections, from the document when locked. */
function planStep(C) {
  const { plan, ss, ds, now, stage, locked, readonly } = C;
  const doc = locked ? plan.planDocument : null;
  const lockedAt = lockedAtOf(plan);
  const figures = {};
  const lines = [];
  const notes = [];
  const steps = incomeSteps(plan, ss, locked, now);
  const first = steps[0] || null;
  const src = locked ? sourceOf('locked', lockedAt, now) : sourceOf('saved', null, now);
  const timing = doc && doc.timing ? doc.timing : null;
  const startMonth = (timing && timing.startMonth) || stage.startMonth || null;
  const firstTaxYear = (timing && timing.firstTaxYear) || stage.firstTaxYear || null;
  const ladder = isLadderPlan(plan, ss);
  // the one-line result
  let result;
  if (first) figures.yearly = first.amount;
  if (locked && first) {
    result = stage.timingMode === 'future'
      // (7.12.0) someone still saving reads what they will spend, a month after tax, as they set it: never a drawing year's
      // figure before tax ahead of the stop
      ? sentence('plan.lockedSaver', [money('monthlyNet'), ' a month after tax from ' + (monthWords(startMonth) || taxYearLabel(firstTaxYear)) + ' (tax year ' + taxYearLabel(firstTaxYear) + ')'], Object.assign(figures, { monthlyNet: Math.round(netOf(first.amount, bandsOf(ss)) / 12) }))
      // the first month it paid, never April by assumption (7.12.0); a ladder's own first year from the document (6.51.0)
      : sentence(ladder ? 'plan.lockedLadder' : 'plan.lockedPlan', [money('yearly'), paysFromWords(firstPaymentMonth(plan, { now, settings: ss }).month, firstTaxYear, ladder ? lockedLadderOf(plan, ss) : null, ladder)], figures);
  } else if (stage.timingMode === 'future' && num(ss.retireAge)) {
    figures.retireAge = +ss.retireAge;
    result = sentence('plan.saver', ['Stopping work at ', age('retireAge'), ', in ' + (monthWords(startMonth) || taxYearLabel(firstTaxYear))], figures);
  } else if (first && stage.key !== 'unknown') {
    result = sentence('plan.retired', ['Retired. ', money('yearly'), ' a year before tax'], figures);
  } else if (first) {
    result = sentence('plan.noAge', [money('yearly'), ' a year before tax'], figures);
  } else result = sentence('plan.nothing', ['No figures yet'], figures);

  // "Your plan as locked" opens on sentences (v6-usability-audit.md 2.6): the money before and after tax by age (the
  // document's steps, after tax through the planner's own tax sum at the plan's own thresholds), the State Pension and
  // whether it is assumed, the bad case (the worst 1 in 10, from the document's own verdict) and the rules for cutting
  // income (the settings the lock froze, or "no cuts" for a bought strategy). The document only, never a live run.
  if (locked && doc) {
    const bands = bandsOf(doc.assumptions && num(doc.assumptions.pa) != null ? { pa: doc.assumptions.pa, brl: doc.assumptions.brl, hrl: doc.assumptions.hrl } : ss);
    steps.forEach((st, i) => {
      figures['saysGross' + i] = st.amount; figures['saysNet' + i] = Math.round(netOf(st.amount, bands) / 12);
      const parts = [];
      if (st.fromAge != null) { figures['saysAge' + i] = st.fromAge; parts.push('From age ', age('saysAge' + i), ': '); }
      parts.push(money('saysGross' + i), ' a year before tax, ', money('saysNet' + i), ' a month after tax');
      if (st.taxYear) parts.push(' (tax year ' + st.taxYear + ')');
      lines.push(line('says.pays', parts, figures, src));
    });
    const sp = doc.layers && doc.layers.sp;
    const dp = doc.strategy && doc.strategy.p;
    if (sp && num(sp.annual) > 0) { figures.saysSp = r0(sp.annual); figures.saysSpAge = r0(sp.fromAge); lines.push(line('says.sp', ['State Pension: ', money('saysSp'), ' a year from age ', age('saysSpAge')], figures, src)); }
    else if (dp && dp.spAssumed && num(dp.spAnnual) > 0) { figures.saysSp = r0(dp.spAnnual); const at = (num(dp.startAge) || 0) + (num(dp.spStartYear) || 0); figures.saysSpAge = at; lines.push(line('says.spAssumed', ['State Pension: assumed, ', money('saysSp'), ' a year from age ', age('saysSpAge'), ', because no State Pension figure was entered'], figures, src)); }
    else lines.push(line('says.noSp', ['No State Pension in this plan'], figures, src));
    const dr = doc.strategy && doc.strategy.r;
    const a = dr && typeof dr === 'object' ? oneAnswer(dr, dp || {}) : null;
    if (a) {
      figures.saysBad = r0(a.badCaseLeft); figures.saysTypical = r0(a.typicalLeft);
      if (doc.strategy.contract) lines.push(line('says.badContract', ['Every year is bought by contract, so no future and no start year can run it out. Left at the end, at today’s prices: typically ', money('saysTypical'), '; in a bad case (the worst 1 in 10) ', money('saysBad')], figures, src));
      else lines.push(line('says.bad', [lockedLastsWords(doc, a, dp) + '. Left at the end, at today’s prices: typically ', money('saysTypical'), '; in a bad case (the worst 1 in 10) ', money('saysBad')], figures, src));
    }
    const sl = savedLasts(plan, { today: now.toISOString().slice(0, 10) });
    const v = sl.values;
    if (sl.bought) lines.push(line('says.cutsBought', ['Income cuts: none. ' + (sl.strategyId === 'floor-and-flex' ? 'The treats flex instead' : 'This way of drawing pays the plan in full until it cannot')], figures, src));
    else if (v.cutsOn !== 'yes') lines.push(line('says.cutsOff', ['Income cuts: none. The plan is paid in full until the money runs out'], figures, src));
    else {
      figures.saysBuffer = r0(v.buffer || 0); figures.saysMonths = v.cutAfterMonths; figures.saysCut = v.cutPct; figures.saysHalf = Math.round(v.cutPct / 2); figures.saysFirst = v.deeperAfterMonths;
      const parts = ['Income cuts: in a slump, after ', count('saysMonths'), ' month' + (v.cutAfterMonths === 1 ? '' : 's') + ' in a row below the plan’s line, income is cut by '];
      if (v.deeperAfterMonths > 0) parts.push(count('saysHalf'), '% for ', count('saysFirst'), ' months and by ', count('saysCut'), '% if the slump lasts');
      else parts.push(count('saysCut'), '%');
      parts.push('; the cut ends once the pots are ', money('saysBuffer'), ' above the line again, and missed income is made up later');
      lines.push(line('says.cuts', parts, figures, src));
    }
  }

  // About you
  const about = [];
  const ageTyped = locked && timing && num(timing.currentAge) != null ? timing.currentAge : num(ss.currentAge);
  const ageAsOf = locked && timing ? timing.currentAgeAsOf : ss.currentAgeAsOf;
  // (7.12.0) the age today: the age typed, a year older for each birthday since its day (About's box says the same)
  let ageToday = ageTyped;
  if (ageTyped != null && ageAsOf) { try { const a = ageOnDate({ currentAge: ageTyped, currentAgeAsOf: ageAsOf, spStartDate: ss.spStartDate }, now, now); if (num(a) != null) ageToday = a; } catch { ageToday = ageTyped; } }
  // (a rolled-on age is today's: no "as of" the day the younger age was typed)
  if (ageToday != null) { figures.ageToday = ageToday; about.push(line('about.age', [age('ageToday')], figures, locked ? src : sourceOf('saved', ageAsOf || null, now), { asOf: ageAsOf && ageToday === ageTyped ? dayWords(ageAsOf) : '' })); }
  const retired = locked && timing ? timing.mode === 'retired' : ss.retired === true;
  const retireAge = locked && timing ? num(timing.retireAge) : num(ss.retireAge);
  if (stage.timingMode === 'future' && retireAge != null) { figures.stopAge = retireAge; about.push(line('about.stopAt', [age('stopAge')], figures, src, { month: monthWords(startMonth) })); }
  else if (retired || stage.timingMode === 'retired') {
    // the month work stopped, when the plan says it (6.51.0): the document's when locked, else the settings'
    const stop = (locked && timing && timing.stoppedWork) || (!locked ? ss.stoppedWork : null) || null;
    if (stop && monthWords(stop)) about.push(line('about.stoppedIn', [], figures, src, { month: monthWords(stop) }));
    else about.push(line('about.retired', [], figures, src));
  }
  if (firstTaxYear) about.push(line('about.firstYear', [], figures, src, { year: taxYearLabel(firstTaxYear) }));
  const N = locked && doc ? ((doc.timeline && doc.timeline.length) || (doc.assumptions && doc.assumptions.duration) || null) : num(ss.duration);
  // the age the plan runs to, as every page of both apps says it: "to 97" = to the 97th birthday (rules.js planToAgeOf; the
  // planner's "— to age" hint and PlanTiming.describeTiming say the same)
  if (N) { figures.years = N; const ageAt = (timing && num(timing.shapeAgeNow) != null ? timing.shapeAgeNow : num(ss.shapeAgeNow)); if (ageAt != null) figures.ageEnd = planToAgeOf(ageAt, N); about.push(line('about.runs', [count('years'), ' years' + (ageAt != null ? ', to age ' : '')].concat(ageAt != null ? [age('ageEnd')] : []), figures, src)); }

  // What the plan pays
  const pays = [];
  steps.forEach((s, i) => {
    figures['step' + i] = s.amount;
    const parts = [];
    if (s.fromAge != null) { figures['stepAge' + i] = s.fromAge; parts.push('From age ', age('stepAge' + i), ': '); }
    parts.push(money('step' + i), ' a year before tax');
    if (s.taxYear) parts.push(' (tax year ' + s.taxYear + ')');
    if (s.decline > 0) parts.push(', falling ' + String(s.decline) + '% a year');
    else if (s.glideToNext && i < steps.length - 1) parts.push(', sloping to the next step');
    pays.push(line('pays.step', parts, figures, src));
  });
  if (locked) notes.push({ id: 'prices', slots: { month: monthWords(lockedAt) || dayWords(lockedAt) } });
  else notes.push({ id: 'pricesToday', slots: {} });

  // Pots and other income
  const pots = [];
  const potSipp = locked && doc && doc.pots ? r0(doc.pots.sipp) : (num(ss.strategyParams && ss.strategyParams.sippTotal) > 0 ? r0(ss.strategyParams.sippTotal) : r0(ss.equityMin) + r0(ss.bondMin) + r0(ss.cashTarget) + r0(ss.diversifierStart));
  const potIsa = locked && doc && doc.pots ? r0(doc.pots.isa) : r0(ss.isaBalance);
  const potGia = locked && doc && doc.pots ? r0(doc.pots.gia) : r0(ss.taxableStart);
  figures.sipp = potSipp; figures.isa = potIsa; figures.gia = potGia;
  pots.push(line('pots.pension', [money('sipp')], figures, src));
  if (!locked) { figures.shares = r0(ss.equityMin); figures.bonds = r0(ss.bondMin); figures.cash = r0(ss.cashTarget); pots.push(line('pots.split', [money('shares'), ' shares, ', money('bonds'), ' bonds, ', money('cash'), ' cash'], figures, src)); }
  else if (doc && doc.pots && doc.pots.allocation) { const a = doc.pots.allocation; figures.shares = r0(a.equityMin); figures.bonds = r0(a.bondMin); figures.cash = r0(a.cashTarget); pots.push(line('pots.split', [money('shares'), ' shares, ', money('bonds'), ' bonds, ', money('cash'), ' cash'], figures, src)); }
  pots.push(line('pots.isa', [money('isa')], figures, src));
  if (potGia > 0) pots.push(line('pots.gia', [money('gia')], figures, src));
  const par = locked && doc && doc.pots ? doc.pots.potAtRetirement : ss.potAtRetirement;
  if (par && (num(par.sipp) > 0 || num(par.isa) > 0)) pots.push(atStopLine(par, { locked, lockedAt, figures, src }));

  // Money that comes in anyway (editing-in-v7.md 7): the State Pension, final-salary pensions, other income, income for some
  // years and lump sums — its own section, edited inside V7
  const income = [];
  const spWeekly = locked && doc && doc.assumptions ? num(doc.assumptions.spWeeklyAmount) : num(ss.spWeeklyAmount);
  const spDate = locked && doc && doc.assumptions ? doc.assumptions.spStartDate : ss.spStartDate;
  if (spWeekly > 0) { figures.spWeekly = r0(spWeekly); income.push(line('pots.statePension', [money('spWeekly'), ' a week'], figures, src, { from: spDate ? (/^\d{4}-\d{2}-\d{2}$/.test(String(spDate)) ? dayWords(spDate) : String(spDate)) : '' })); }   // (a start date kept from an answer as a date is said in words)
  else if (num(ss.statePension) > 0) { figures.spYearly = r0(ss.statePension); const fromYear = firstTaxYear && num(ss.statePensionYear) != null ? taxYearLabel(firstTaxYear + r0(ss.statePensionYear)) : ''; income.push(line('pots.statePensionOld', [money('spYearly'), ' a year'], figures, src, { year: fromYear })); }
  else income.push(line('pots.noStatePension', [], figures, src));
  // the planner's rows are plan years; an age is the plan's start age plus the year (PlanDocument.shapeLayersFromSettings;
  // the final-salary start as dbStartSetting.dbStartAgeOf reads it: the age when saved, else the start age plus the year)
  const ageNow = timing && num(timing.shapeAgeNow) != null ? timing.shapeAgeNow : num(ss.shapeAgeNow);
  if (num(ss.dbAmount) > 0) {
    figures.db = r0(ss.dbAmount);
    const dbAge = num(ss.dbStartAge) > 0 ? r0(ss.dbStartAge) : (ageNow != null && num(ss.dbStartYear) != null ? ageNow + r0(ss.dbStartYear) : null);
    const from = dbAge != null ? 'age ' + String(dbAge) : (num(ss.dbStartYear) != null && firstTaxYear ? 'tax year ' + taxYearLabel(firstTaxYear + r0(ss.dbStartYear)) : '');
    income.push(line('pots.finalSalary', [money('db'), ' a year'], figures, src, { from }));
  }
  if (num(ss.other) > 0) { figures.other = r0(ss.other); income.push(line('pots.other', [money('other'), ' a year'], figures, src)); }
  (Array.isArray(ss.extraIncomes) ? ss.extraIncomes : []).forEach((r, i) => {
    if (!r || typeof r !== 'object' || !(num(r.annual) > 0)) return;
    figures['stream' + i] = r0(r.annual);
    const from = ageNow != null ? ageNow + (num(r.startYear) || 0) : '';
    const to = r.endYear == null ? null : (ageNow != null ? ageNow + num(r.endYear) : '');
    income.push(line(to == null ? 'income.streamLife' : 'income.stream', [money('stream' + i), ' a year'], figures, src, { label: r.label || 'Income for some years', from: String(from), to: to == null ? '' : String(to) }));
  });
  (Array.isArray(ss.windfalls) ? ss.windfalls : []).forEach((r, i) => {
    if (!r || typeof r !== 'object' || !(num(r.amount) > 0) || r.year == null) return;
    figures['lump' + i] = r0(r.amount);
    income.push(line('income.lump', [money('lump' + i)], figures, src, { label: r.label || 'Lump sum', age: ageNow != null ? String(ageNow + num(r.year)) : '', what: ['cash', 'pension', 'isa'].includes(r.wrapper) ? r.wrapper : 'cash' }));
  });

  // How the money is taken
  const way = [];
  const sid = stratId(plan, ss);
  way.push(line('way.strategy', [], figures, src, { strategy: sid }));
  const params = (locked && doc && doc.strategy && doc.strategy.params) || ss.strategyParams || {};
  // An older ladder's extra cash beside its cash years (`bridgeCash`) is no dial since 7.4.2: nothing reads it, so it is not said.
  // each dial with its figure, written as the way's own dial is (schema.js WAY_DIALS); the figure is filed under a key with
  // no dot, as the screen reads a dotted key as a path. A choice, a flag or a dial with no figure kind is not said here
  for (const [k, v] of Object.entries(params)) {
    if (k === 'bridgeCash' || typeof v === 'boolean' || num(v) == null) continue;
    const d = (WAY_DIALS[sid] || []).find((x) => x.key === k);
    const kind = d ? (d.cut ? null : DIAL_KINDS[d.type]) : DOCUMENT_DIALS[k];
    if (!kind) continue;
    figures['dial_' + k] = num(v);
    way.push(line('way.dial', [{ key: 'dial_' + k, kind }], figures, src, { dial: k }));
  }

  // The mix (way-and-mix.md 3): how the pension is held, the amounts, the sleeve and the tent — its own section, edited inside V7
  // (the "set by risk level / from the funds to test" line moved here from "How the money is taken" in 6.41.0)
  const mix = [];
  const sm = savedMix(plan, { today: now.toISOString().slice(0, 10) });
  if (sm.bought) mix.push(line('mix.bought', [], figures, src, { strategy: sid }));
  else {
    mix.push(line(sm.values.held === 'funds' ? 'mix.heldFunds' : sm.values.held === 'split' ? 'mix.heldSplit' : 'mix.heldLevel', [], figures, src, sm.values.held === 'level' ? { level: sm.values.level } : {}));
    figures.mixShares = sm.amounts.equity; figures.mixBonds = sm.amounts.bond; figures.mixCash = sm.amounts.cash;
    const parts = [money('mixShares'), ' shares, ', money('mixBonds'), ' bonds, ', money('mixCash'), ' cash'];
    if (sm.amounts.div > 0) { figures.mixDiv = sm.amounts.div; parts.push(', ', money('mixDiv'), ' gold and trend funds'); }
    mix.push(line('mix.amounts', parts, figures, src));
    if (sm.values.held === 'funds') { figures.mixFunds = sm.values.funds.length; mix.push(line('mix.funds', [count('mixFunds'), ' fund' + (sm.values.funds.length === 1 ? '' : 's') + ' on the list'], figures, src)); }
    mix.push(line(sm.amounts.div > 0 ? 'mix.sleeveOn' : 'mix.sleeveOff', [], figures, src));
    mix.push(line(sm.buckets ? 'mix.tentBuckets' : sm.values.tent === 'yes' ? 'mix.tentOn' : 'mix.tentOff', [], figures, src, { years: String(sm.tentYears) }));
  }

  // Everything else this plan uses (2.5)
  const options = optionsFor(ss, ds, plan);
  const allOptions = optionsFor(ss, ds, plan, { all: true });

  const sections = [
    // "About you and when" is edited inside V7 (editing-in-v7.md 2): the section links to the sub-step, never to the planner
    { id: 'about', lines: about, place: 'about', sub: 'about', href: '#/plan/' + plan.id + '/about' },
    // "What you spend" is edited inside V7 too (editing-in-v7.md 8): the shape, the one-off costs, the budget as a guide
    { id: 'pays', lines: pays, place: 'spend', sub: 'spend', href: '#/plan/' + plan.id + '/spend' },
    // "Your pots and tax" is edited inside V7 too (editing-in-v7.md 9): the pots, the ISA choices, the ordinary account, charges, tax
    { id: 'pots', lines: pots, place: 'pots', sub: 'pots', href: '#/plan/' + plan.id + '/pots' },
    // "Money that comes in anyway" is edited inside V7 too (editing-in-v7.md 7)
    { id: 'income', lines: income, place: 'pots', sub: 'income', href: '#/plan/' + plan.id + '/income' },
    // "How the money is taken" is in V7 too (way-and-mix.md 2.1): the nine ways on this plan; on a locked plan the link says a try changes nothing
    { id: 'way', lines: way, place: 'way', sub: 'way', href: '#/plan/' + plan.id + '/way', lockedButton: 'tryWay' },
    // "The mix" (way-and-mix.md 3): how the pension is held; on a locked plan the tries still run there, nothing is written.
    // A gilt ladder has no mix to try (7.12.0, as its home's change list): its way of drawing is gilts and cash years
    { id: 'mix', lines: mix, place: 'allocation', sub: 'mix', href: '#/plan/' + plan.id + '/mix', ...(isLadderPlan(plan, ss) ? {} : { lockedButton: 'tryMix' }) }
  ];
  const buttons = [];
  // "Does it last?" is inside V7 (editing-in-v7.md 10): the one test runs there; a locked plan still has the planner's what-ifs
  // a plan shown as saved is not run (its shape is newer than this code), so it gets no link into the step
  if (locked) { buttons.push(button('openDocument', 'document')); if (!readonly) buttons.push(link('lastsLocked', '#/plan/' + plan.id + '/lasts')); buttons.push(button('testLocked', 'test')); }
  else if (!readonly) buttons.push(link('lasts', '#/plan/' + plan.id + '/lasts'));
  const journey = Array.isArray(plan.journey) ? plan.journey.filter((j) => j && j.stage).map((j) => ({ stage: j.stage, on: dayWords(j.at), arrival: /arrival/i.test(String(j.note || '')) })) : [];
  const pastVersions = Array.isArray(plan.planDocumentArchive) ? plan.planDocumentArchive.length : 0;
  // the unlock's confirm (road-to-7.md step 6): the defaults a plan locked before a setting existed gets on unlocking (PlanCommit.unlockPatchesOf)
  const up = locked ? (unlockPatchesOf(ss) || {}) : {};
  const unlockDefaults = [...('chargesPct' in up ? [{ id: 'charges', value: String(up.chargesPct) }] : []), ...('isaGrowth' in up ? [{ id: 'isa', value: String(up.isaGrowth) }] : [])];
  return { done: stage.key !== 'unknown', result, figures, lines, buttons, notes, sections, options, allOptions, journey, pastVersions, lockedOn: locked ? dayWords(lockedAt) : null,
    hasDocument: !!doc, documentOn: doc ? dayWords(doc.createdAt || doc.lockedAt || lockedAt) : null, unlockDefaults };
}

/** This month's pot (2.3 `pot`). */
function potStep(C) {
  const { plan, now, mon } = C;
  const figures = {};
  const lines = [];
  const hist = Array.isArray(plan.accumulationTool && plan.accumulationTool.history) ? plan.accumulationTool.history : [];
  const pot = saverPotOf({ accHistory: hist, today: now });
  const recorded = pot.source === 'record' && String(pot.at) >= mon;
  let result;
  if (pot.source === 'record') {
    figures.pension = r0(pot.pension);
    if (pot.isa != null) figures.isa = r0(pot.isa);
    const parts = [money('pension'), ' pension'].concat(pot.isa != null ? [', ', money('isa'), ' ISA'] : []);
    lines.push(line('pot.latest', parts, figures, sourceOf('record', pot.recordedAt || pot.at, now), { month: monthWords(pot.at) }));
    result = recorded ? sentence('pot.recorded', [money('pension'), ' recorded for ' + monthWords(mon)], figures) : sentence('pot.notYet', [monthName(mon) + '’s pot is not recorded yet'], figures);
  } else result = sentence('pot.notYet', [monthName(mon) + '’s pot is not recorded yet'], figures);
  // "Record this month's pot" lives on "What you pay in" inside V7 (road-to-7.md step 11b): a link, no hand-over
  return { done: recorded, result, figures, lines, buttons: [link('recordPot', '#/plan/' + plan.id + '/saving')], notes: [], recorded };
}

/** How often, said in the next sentence and on the rail ("your yearly check-in"). */
const OFTEN = { year: 'yearly', quarter: 'quarterly', month: 'monthly' };
const BAND_WORDS = { yes: ': on course', close: ': close', no: ': not on course yet' };

/**
 * Check in (research/saving-enough-and-check-in.md 4.1, 5; release step R3): a saver's own step, in the pot step's place.
 * Due, it says so; done, it says what the last check-in said, from its stored reading (never a run). A plan locked while
 * saving that never chose how often reads exactly as its pot step did: this month's pot, recorded or not.
 */
function checkinStep(C) {
  const { plan, now, stage } = C;
  const st = checkInState(plan, { today: localDay(now), stageKey: stage.key });
  const here = link('checkIn', '#/plan/' + plan.id + '/checkin');
  if (st.legacy) {
    // a plan locked while saving that never chose how often (7.10.0): once a year, its pot records read as they were — the
    // month's pot is no longer a thing to do each month
    const p = potStep(C);
    const figures = { ...(p.figures || {}) };
    const result = st.due ? sentence('checkin.due', ['Due: your yearly check-in' + (st.last ? ' (the last was ' + monthWords(st.last) + ')' : '')], figures)
      : st.lastCheckIn ? sentence('checkin.' + (st.lastCheckIn.band || 'done'), ['Checked in for ' + monthWords(st.lastCheckIn.month) + (BAND_WORDS[st.lastCheckIn.band] || '')], figures)
        : st.next ? sentence('checkin.next', ['Your next check-in: ' + monthWords(st.next)], figures) : p.result;
    return { ...p, result, figures, buttons: [here], done: !st.due, due: st.due === true, checkIn: st };
  }
  const figures = {};
  let result;
  if (st.chosen && st.due) result = sentence('checkin.due', ['Due: your ' + OFTEN[st.every] + ' check-in (the last was ' + monthWords(st.last) + ')'], figures);
  else if (st.lastCheckIn) result = sentence('checkin.' + (st.lastCheckIn.band || 'done'), ['Checked in for ' + monthWords(st.lastCheckIn.month) + (BAND_WORDS[st.lastCheckIn.band] || '')], figures);
  else result = sentence('checkin.none', ['Not checked in yet'], figures);
  return { done: !!st.lastCheckIn && !st.due, result, figures, lines: [], buttons: [here], notes: [], due: st.due === true, checkIn: st };
}

/** What you pay in (2.3 `saving`). */
function savingStep(C) {
  const { plan, now, stage, readonly } = C;
  const s = (plan.accumulationTool && plan.accumulationTool.settings) || {};
  const figures = {};
  const lines = [];
  const you = r0(s.netMonthly), employer = r0(s.employerMonthly), isa = r0(s.isaMonthly), esc = num(s.escalationPct);
  const any = you > 0 || employer > 0 || isa > 0;
  let result;
  if (any) {
    figures.you = you; figures.employer = employer;
    const parts = [money('you'), ' a month from you, ', money('employer'), ' from your employer'];
    if (isa > 0) { figures.isaMonthly = isa; parts.push(', ', money('isaMonthly'), ' into ISAs and savings'); }
    result = sentence('saving.payIn', parts, figures);
    lines.push(line('saving.you', [money('you'), ' a month'], figures, sourceOf('saved', null, now)));
    lines.push(line('saving.employer', [money('employer'), ' a month'], figures, sourceOf('saved', null, now)));
    if (isa > 0) lines.push(line('saving.isa', [money('isaMonthly'), ' a month'], figures, sourceOf('saved', null, now)));
    if (esc > 0) { figures.rise = esc; lines.push(line('saving.rise', [count('rise'), '% a year'], figures, sourceOf('saved', null, now))); }
  } else result = sentence('saving.none', ['Nothing paid in'], figures);
  // a share of pay, while it agrees with the pounds (saving-enough-and-check-in.md 4.5): said as the share, rising with pay
  const share = payInShareOf(s);
  if (share) { figures.ownPct = share.ownPct; figures.employerPct = share.employerPct; lines.push(line('saving.share', [count('ownPct'), '% of your pay from you, ', count('employerPct'), '% from your employer'], figures, sourceOf('saved', null, now))); }
  // the step draws its own screen inside V7 (road-to-7.md step 11b), where the plan now says whether what goes in is enough
  // (release step R2): for someone still saving that answer is the step's first button, named for the question, since this
  // page shows only the summary; the planner's fixed-rate pot check stays a quiet link under its own name
  const savingHref = '#/plan/' + plan.id + '/saving';
  const asks = !readonly && SAVER_STAGES.includes(stage.key);
  const buttons = [...(asks ? [{ ...link('payingEnough', savingHref), primary: true }] : []), link('changeSaving', savingHref), { ...button('potCheck', 'onCourse'), quiet: true }];
  return { done: any, result, figures, lines, buttons, notes: ['saving.notFrozen'] };
}

/**
 * What you spend (2.3 `budget`): a guide beside the plan's own figure. Read as the budget page reads it (7.11.1,
 * budget.js budgetFiguresOf: the plan's own budget or the household's shared one, summed from its lines), never a second rule.
 */
function budgetStep(C) {
  const { plan, now, entries } = C;
  const B = budgetFiguresOf(plan, entries);
  const figures = {};
  const lines = [];
  const total = r0(B.monthly);
  const essentials = r0(B.essentialsMonthly);
  const workedOut = B.workedOut;
  let result;
  if (workedOut) {
    figures.total = total; figures.essentials = essentials;
    result = sentence('budget.total', [money('total'), ' a month after tax, ', money('essentials'), ' of it essentials. A guide only'], figures);
    lines.push(line('budget.totalLine', [money('total'), ' a month after tax'], figures, sourceOf('budget', null, now)));
    lines.push(line('budget.essentialsLine', [money('essentials'), ' a month after tax'], figures, sourceOf('budget', null, now)));
  } else result = sentence('budget.none', ['Not worked out. A guide only'], figures);
  // the budget draws its own screen inside V7 (road-to-7.md step 11b): a link, no hand-over
  return { done: workedOut, result, figures, lines, buttons: [link('changeBudget', '#/plan/' + plan.id + '/budget')], notes: ['budget.guide'] };
}

/**
 * Lock the plan (2.3 `lock`; road-to-7.md step 6): its own screen in V7 (src/v7/screens/plan/LockScreen.jsx). On an unlocked
 * plan: what the lock fixes, what stays changeable, what you get — said by the screen from copy/lock.js; the facts here are
 * whether the person is still saving, the way of drawing and whether it buys its income (the cut rules line). On a locked
 * plan (the address opened by hand, R7): "Locked {date}" and the way to "Your plan as locked".
 */
function lockStep(C) {
  const { plan, stage, locked, ss } = C;
  const saver = SAVER_STAGES.includes(stage.key);
  const strategyId = stratId(plan, ss);
  const bought = isBought(strategyId);
  const figures = {};
  if (locked) {
    const lockedOn = dayWords(lockedAtOf(plan));
    return { done: true, result: sentence('lock.locked', ['Locked ' + lockedOn], figures), figures, lines: [], buttons: [link('seeLocked', '#/plan/' + plan.id + '/plan')], notes: [], locked: true, lockedOn, saver, strategyId, bought, hasDocument: !!plan.planDocument };
  }
  const notes = ['lock.what'];
  if (saver) notes.push('lock.saver');
  // a saver's lock says when Month by month opens: the month they stop work (saving-enough-and-check-in.md 4.3)
  const stopMonth = saver ? (monthWords(stage.startMonth) || null) : null;
  return { done: false, result: sentence('lock.notLocked', ['Not locked'], figures), figures, lines: [], buttons: [], notes, locked: false, lockedOn: null, saver, stopMonth, strategyId, bought, hasDocument: false };
}

/** What you hold (2.3 `hold`). */
function holdStep(C) {
  const { plan, now } = C;
  const rec = normaliseHoldings(plan.holdings);
  const sum = holdingsSummary(rec);
  const figures = {};
  const lines = [];
  const has = sum.count > 0;
  let result;
  if (has) {
    figures.pension = r0(sum.byWrapper.SIPP); figures.isa = r0(sum.byWrapper.ISA);
    const src = sourceOf('hold', rec.updatedAt || null, now);
    const parts = ['Pension ', money('pension'), ', ISA ', money('isa')];
    if (sum.byWrapper.GIA > 0) { figures.gia = r0(sum.byWrapper.GIA); parts.push(', other account ', money('gia')); }
    if (sum.byWrapper.CASH > 0) { figures.cash = r0(sum.byWrapper.CASH); parts.push(', cash ', money('cash')); }
    parts.push(rec.updatedAt ? '. Updated ' + dayWords(rec.updatedAt) : '');
    result = sentence('hold.summary', parts, figures);
    figures.lines = sum.count; figures.total = r0(sum.total);
    lines.push(line('hold.total', [money('total'), ' across ', count('lines'), ' line' + (sum.count === 1 ? '' : 's')], figures, src));
  } else result = sentence('hold.none', ['Not recorded yet'], figures);
  // "Change this here": the record is kept inside V7 (road-to-7.md step 10; holdings-and-move.md §4)
  return { done: has, result, figures, lines, buttons: [link('changeHold', '#/plan/' + plan.id + '/hold')], notes: [] };
}

/** Moving to your plan's mix (2.3 `move`). */
function moveStep(C) {
  const { plan, now, life } = C;
  const figures = {};
  const lines = [];
  let m = null; try { m = moveInputs(plan, { now }); } catch { m = null; }
  // Living on it, or Moving once what is held was accepted (7.11.1, Phases.heldPhase): what is held, never moves to make
  const asHeld = heldPhase(life);
  let result, done = false;
  // living on a ladder (7.12.0): the gilts held, as "Your plan's mix" counts them (held.js, the one reading)
  let hl = null; if (asHeld && m && m.target && m.target.kind === 'ladder') { try { hl = heldLadder(plan, { today: localDay(now), life }); } catch { hl = null; } }
  if (!m || !m.target || m.target.kind === 'none') result = sentence('move.notSet', ['Set when the plan is locked'], figures);
  // Moving, once the person said this is how they want to hold it (7.12.0): said so, with the day
  else if (asHeld && life && life.key === 'moving' && life.agreed && life.agreed.at) { result = sentence('move.ownWay', ['You hold it your own way (said ', { fixed: dayWords(life.agreed.at) }, ').'], figures); }
  else if (hl) { figures.bought = hl.gilts.held; figures.rungs = hl.gilts.total; result = sentence('move.giltsHeld', [count('bought'), ' of ', count('rungs'), ' gilts held'], figures); done = !!m.diff.complete; }
  else if (m.diff.complete) { result = sentence('move.done', ['Done'], figures); done = true; }
  else if (m.target.kind === 'ladder') {
    // the move's one status (7.12.0, moveWords.moveStatusOf), in the words of src/v7/copy/move.js MOVE.status.gilts and
    // giltsPart: the move page and the full view say the same sentence (tests/v7/plan/moveSays.test.js holds them equal)
    const st = moveStatusOf(m.target, m.diff, m.prog);
    figures.bought = +st.slots.bought; figures.rungs = +st.slots.rungs; figures.part = +st.slots.part; figures.heldPct = +st.slots.held;
    result = sentence('move.' + st.id, st.id === 'giltsPart'
      ? [count('bought'), ' of ', count('rungs'), ' gilts bought, and ', count('part'), ' part bought. ', count('heldPct'), '% of your plan’s mix is held.']
      : [count('bought'), ' of ', count('rungs'), ' gilts bought. ', count('heldPct'), '% of your plan’s mix is held.'], figures);
  } else if (asHeld && typeof m.diff.progressPct === 'number') {
    figures.heldPct = m.diff.progressPct;
    result = sentence('move.heldShare', [count('heldPct'), '% of the plan’s mix held'], figures);
  } else {
    figures.movesDone = m.prog.doneCount; figures.moves = m.prog.total;
    result = sentence('move.moves', [count('movesDone'), ' of ', count('moves'), ' moves done'], figures);
  }
  // the share held, once: a ladder's status sentence already says it (7.12.0)
  if (m && m.diff && typeof m.diff.progressPct === 'number' && !(result.id === 'move.gilts' || result.id === 'move.giltsPart')) { figures.heldPct = m.diff.progressPct; lines.push(line('move.held', [count('heldPct'), '% of the plan’s mix held'], figures, sourceOf('hold', normaliseHoldings(plan.holdings).updatedAt || null, now))); }
  // what is still to buy while the move is under way (7.12.0, the moving brief S4: the home's to-do says it)
  const toBuy = !asHeld && m && m.target && m.target.kind !== 'none' && m.diff && !m.diff.complete && m.diff.totals ? Math.round(num(m.diff.totals.buyCost) || 0) : 0;
  // "Open it": the move is drawn inside V7 (road-to-7.md step 10; holdings-and-move.md §4)
  return { done, result, figures, lines, buttons: [link('openMove', '#/plan/' + plan.id + '/move')], notes: asHeld ? [] : ['move.optional'], toBuy };
}

/** Your household (2.3 `household`; 6). */
function householdStep(C) {
  const { plan, entries, now } = C;
  const partners = partnersOf(entries, plan);
  const figures = {};
  const lines = [];
  const buttons = [];
  const mine = partnerIdOf(plan);
  const missing = !!mine && !entries.some((e) => e.plan.id === mine);
  let result;
  if (partners.length) {
    const p = partners[0];
    // each partner's line by their plan's phase (7.10.0), as their own plan's pages say it
    const theirLine = theirLineOf(p.plan, now);
    result = sentence('household.with', ['With ‘' + nameOf(p.plan, now) + '’'], figures);
    for (const e of partners) {
      lines.push({ id: 'household.partner', slots: { name: nameOf(e.plan, now) }, sentence: sentence('household.partner', [], figures), source: sourceOf('saved', null, now), theirLine: theirLineOf(e.plan, now), theirId: String(e.plan.id) });
      buttons.push(link('openPartner', '#/plan/' + e.plan.id, { name: nameOf(e.plan, now) }));
    }
    // the two together — the pooled verdict, who draws what, the survivor and care questions — inside V7 (road-to-7.md step 9)
    buttons.push(link('checkTogether', '#/plan/' + plan.id + '/household'));
    return { done: true, result, figures, lines, buttons, notes: [], theirLine };
  }
  const linkHere = link('linkOne', '#/plan/' + plan.id + '/household');
  if (missing) return { done: false, result: sentence('household.notInAccount', ['Your partner’s plan is not in this account'], figures), figures, lines, buttons: [linkHere], notes: [] };
  return { done: false, result: sentence('household.none', ['No partner’s plan is linked'], figures), figures, lines, buttons: [linkHere], notes: [] };
}

const BUILDERS = { month: monthStep, where: whereStep, plan: planStep, pot: potStep, checkin: checkinStep, saving: savingStep, budget: budgetStep, lock: lockStep, hold: holdStep, move: moveStep, household: householdStep };

// ---- the next sentence (2.4) ---------------------------------------------------------------------------------------------

/**
 * The rules of the next sentence and of the plan's to-do list (2.4; research/v7/one-product-design.md, "The to-do reader";
 * 7.10.0, research/v7/replan-nov-2026.md §6.4 and spec-7100 §5): which fire, the button each offers, the slots their words take
 * and the occurrence each is put away for. ONE reading for both, so the rail's "Next" and the home's first to-do can never
 * disagree. The whole list of things to do, in order: closed; no age; ages taken from the saving figures; "did you stop
 * work?"; the tax year's set-up; the month to record (Living on it, and only when months are wanted); the review due; off
 * course by the person's own rule; a partner's plan missing. Everything else is information, said only when nothing is due.
 */
function rulesFor(C, built) {
  const { stage, readonly, plan, ss, locked, mon, ty, now, life } = C;
  const key = stage.key;
  const retiredRunning = key === 'running';
  const month = built.month;
  const hist = historyAscending(plan);
  const latest = hist.length ? String(hist[hist.length - 1].date).slice(0, 7) : null;
  const arrivalDone = Array.isArray(plan.journey) && plan.journey.some((j) => j && /arrival/i.test(String(j.note || '')));
  const stop = stage.startMonth || null;
  const setUp = month ? month.setUp : !!(plan.decisionTool && plan.decisionTool.taxYears && plan.decisionTool.taxYears[C.tyKey] && plan.decisionTool.taxYears[C.tyKey].yearSetupComplete);
  const recorded = month ? month.recorded : (!!latest && latest >= mon);
  // the month to record: the earliest month not recorded (monthStep), else this month — P.month names it and its button carries it
  const toRecord = month && month.toRecord ? month.toRecord : mon;
  // the stored "will it last" answer is older than its inputs (editing-in-v7.md 4) — never on a locked plan, whose answer is
  // its document's. Said on "Does it last?" and About; no longer a to-do (7.10.0)
  const answerStale = !locked ? answerAge(plan, ss) : null;
  const saverStage = SAVER_STAGES.includes(key);
  const closed = key === 'closed' ? closedReading(plan, C.entries) : null;
  // a plan lived on until a close still to come: its reviews carry on with the plan that carries it on
  const closing = stage.closing === true || (plan.closedAt != null && key !== 'closed');
  // the check-in (release step R3): how often, whether it is due, and what the last one said — read from what is stored
  const ci = !saverStage ? null : built.checkin && built.checkin.checkIn ? built.checkin.checkIn : (() => { try { return checkInState(plan, { today: localDay(now), stageKey: key }); } catch { return null; } })();
  const lastBand = ci && ci.lastCheckIn ? ci.lastCheckIn.band : null;
  const mine = partnerIdOf(plan);
  const partnerMissing = !!mine && !C.entries.some((e) => String(e.plan.id) === mine);
  const phase = life && life.key ? life.key : null;
  // Living on it, carried out month by month: a locked plan running from its stop, and only when months are wanted (7.10.0,
  // DrawCadence.monthsWanted: said, a cadence, or a month recorded) — an annual drawer or someone who keeps no record here
  // is never asked for eleven months
  const wanted = monthsWanted(plan.decisionTool);
  // Moving, inside the window, with what is held listed and not said to be how the person wants it: what is still to buy
  // (7.12.0, the moving brief S4), from the move step's one reading
  const inWindow = phase === 'moving' && !(life && life.confirmStop) && !!moveWindowOf(life) && moveWindowOf(life).state === 'inside';
  const listed = (() => { try { return holdingsSummary(normaliseHoldings(plan.holdings)).count > 0; } catch { return false; } })();
  const toBuy = inWindow && listed && !heldPhase(life) && built.move && built.move.toBuy > 0 ? built.move.toBuy : 0;
  const livingMonths = retiredRunning && locked && phase === 'drawing' && wanted;
  // the review (spec-7100 §4.3, §4.4): when it is next and whether it is due; off course by the person's own rule
  const reviewDue = C.reviewDue;
  const offCourse = C.offCourse;
  const RULES = {
    'P.readonly':    () => readonly,
    'P.closed':      () => !!closed && !!closed.next,
    'P.closedAlone': () => !!closed,
    'P.noAge':       () => key === 'unknown',
    'P.agesFromSaving': () => saverStage && !locked && stage.fromAccumulation === true,
    // an unlocked plan whose stop month has passed is asked, never moved on quietly (stageOf's confirmStop)
    'P.confirmStop': () => !!life && life.confirmStop === true,
    'P.taxyear':     () => livingMonths && !setUp,
    'P.arrive':      () => livingMonths && stage.timingMode === 'future' && !!stop && !(latest && latest >= stop) && !arrivalDone,
    'P.month':       () => livingMonths && !recorded,
    'P.review':      () => !closing && !!reviewDue && reviewDue.due,
    'P.offCourse':   () => !closing && !!offCourse && offCourse.off,
    'P.householdPending': () => partnerMissing,
    'P.move':        () => toBuy > 0,
    // the sentences that say where things stand: never a to-do
    'P.idle':        () => retiredRunning && wanted && recorded,
    // inside the window only: never once the stop has passed (asked "did you stop work?") or before it opens
    'P.window':      () => inWindow,
    'P.onCourse':    () => !!ci && lastBand === 'yes',
    'P.nextReview':  () => !!reviewDue && !!reviewDue.next,
    'P.reviewAny':   () => true
  };
  const nextMonth = (() => { const p = ym(mon); const m2 = p.m === 12 ? { y: p.y + 1, m: 1 } : { y: p.y, m: p.m + 1 }; return MONTHS[m2.m - 1]; })();
  // {stop}: the month work stops; a saver with no month for it (saving-enough-and-check-in.md 4.2) is told their age then
  const stopWords = monthWords(stop) || (saverStage ? (stage.accumulationAges ? 'age ' + stage.accumulationAges.retirementAge : num(ss.retireAge) ? 'age ' + num(ss.retireAge) : '') : '');
  const win = moveWindowOf(life);
  const left = win && Number.isFinite(win.monthsLeft) ? win.monthsLeft : null;
  const nextReview = reviewDue && reviewDue.next ? monthWords(reviewDue.next.slice(0, 7)) : '';
  const slots = { month: monthWords(toRecord), monthName: monthName(toRecord), nextMonth, year: taxYearLabel(ty), stop: stopWords, closed: closed ? closed.month : '', next: closed && closed.next ? closed.next.name : '',
    nextReview, nextCheck: nextReview || (ci && ci.chosen && ci.next ? monthWords(ci.next) : ''), reviewOften: reviewOftenOf(phase, reviewDue ? reviewDue.every : 'year'),
    ...(ci && ci.lastCheckIn ? { last: monthWords(ci.lastCheckIn.month) } : {}),
    ...(left != null ? { windowLeft: timeLeftWords(left) } : {}),
    ...(toBuy > 0 ? { toBuy: pounds(toBuy) } : {}),
    ...(offCourse && offCourse.off ? { ...offCourseWordsOf(offCourse), offKind: offCourse.rule.kind } : {}) };
  // what each to-do is put away for (answers/plan/tasks.js): its month, tax year, review date, partner's plan or stop
  const occurrence = {
    'P.confirmStop': stop,
    'P.taxyear': taxYearLabel(ty),
    'P.arrive': mon,
    'P.month': toRecord,
    'P.review': reviewDue ? reviewDue.occurrence : null,
    'P.offCourse': offCourse ? offCourse.occurrence : null,
    'P.householdPending': mine,
    'P.move': stop
  };
  const aboutHref = '#/plan/' + plan.id + '/about';   // "About you and when", inside V7 (editing-in-v7.md 2)
  const review = reviewHrefOf(plan);
  const BUTTONS = {
    'P.readonly': null,
    'P.closed': closed && closed.next ? link('openNext', '#/plan/' + closed.next.id, { name: closed.next.name }) : null,
    'P.closedAlone': null,
    'P.noAge': link('addAge', aboutHref),
    'P.agesFromSaving': link('checkAges', aboutHref),
    'P.confirmStop': link('aboutWhen', aboutHref),
    'P.arrive': recordButton(plan, mon),
    'P.taxyear': link('setUpYear', monthHref(plan), { year: taxYearLabel(ty) }),
    'P.month': recordButton(plan, toRecord),
    'P.review': link('startReview', review),
    'P.offCourse': link('seeChange', review),
    'P.householdPending': link('linkOne', '#/plan/' + plan.id + '/household'),
    'P.move': link('openMove', '#/plan/' + plan.id + '/move'),
    'P.idle': null,
    'P.window': null,
    'P.onCourse': null,
    'P.nextReview': link('reviewNow', review),
    'P.reviewAny': link('reviewNow', review)
  };
  return { RULES, BUTTONS, slots, answerStale, gap: !!(month && month.gap), occurrence };
}

/**
 * Off course in words (7.10.0): each of the two readings' chance as the run's own line says it ("once in 20", "16 times in
 * 20": format.js chanceWords, so the to-do and the run it came from never disagree), and the line in twentieths; '' for a
 * reading that keeps no weighted chance (the words then say it without the figures).
 */
export function offCourseWordsOf(off) {
  const w = (r) => (r && typeof r.weighted === 'number' && Number.isFinite(r.weighted) ? chanceWords(r.weighted, { sumW: r.sumW, n: r.n }) : '');
  const rs = off && Array.isArray(off.readings) ? off.readings : [];
  return { a: w(rs[0]), b: w(rs[1]), line: off && off.line != null ? String(off.line) : '' };
}

/** How often a review falls, in words: once a tax year (Living on it), once a year, every three months, every month. */
const reviewOftenOf = (phase, every) => (every === 'quarter' ? 'every three months' : every === 'month' ? 'every month' : phase === 'drawing' ? 'once a tax year' : 'once a year');

/**
 * Where a plan's review is (spec-7100 §4.1): ONE page in every phase, #/plan/<id>/review. In Saving it draws the check-in,
 * which is that phase's review, with the choices under it (the move window, the saving level, the rule); #/plan/<id>/checkin
 * still opens the check-in alone.
 */
export function reviewHrefOf(plan) {
  return '#/plan/' + plan.id + '/review';
}

/**
 * Everything due now on one plan, in the design's order (research/v7/one-product-design.md, "The to-do reader"): each with
 * the design's id, the P.* id its words are under in copy/plan.js, its button and slots. Nothing on a plan shown as saved
 * (nothing can be changed there), and on a closed plan only the way to the plan that carries it on.
 *
 * A to-do whose rule may be put away (`DISMISSIBLE`: the buttons it offers, answers/plan/schema.js DISMISS) carries `key`, the
 * key its dismissal is stored under on the plan (taskKeyOf: its id and its occurrence — the month, the tax year, the review's
 * date, the partner's plan, the stop), and `dismiss`, the buttons; one put off or done (the plan's own `tasks`, as it belongs
 * to the plan) is left out — on every device, in both apps. Pure; nothing is written.
 */
const DISMISSIBLE = {
  'P.confirmStop': ['notNow'],
  'P.taxyear': ['notNow'],
  'P.arrive': ['notNow'],
  'P.month': ['notNow'],
  'P.review': ['notNow', 'notThisTime'],
  'P.offCourse': ['notNow', 'seen'],
  'P.householdPending': ['notNow', 'done'],
  'P.move': ['notNow']
};
export function dueFor(C, built, R = rulesFor(C, built)) {
  if (C.readonly) return [];
  const out = [];
  for (const pid of NEXT_ORDER) {
    if (NEXT_INFO.includes(pid) || !R.RULES[pid]()) continue;
    if (C.stage.key === 'closed' && pid !== 'P.closed') continue;
    const id = pid === 'P.month' && R.gap ? 'month.gap' : DUE_IDS[pid];
    // a to-do the person may put away: stored on the plan, so it stays away on every device
    const dismiss = DISMISSIBLE[pid] || null;
    const key = dismiss ? taskKeyOf(id, R.occurrence[pid]) : null;
    if (key && isPutOff(C.plan, key, { now: C.now })) continue;
    out.push({ id, pid, slots: R.slots, button: R.BUTTONS[pid] || null, ...(dismiss ? { dismiss, key } : {}) });
  }
  return out;
}

/**
 * What is coming but not due yet ("soon": listed apart on the home, never counted, never the rail's next): the next tax
 * year's set-up from 1 March, on a locked plan that records months and wants them asked for (DrawCadence.monthsWanted), when
 * it is not set up already. Its button chooses April on Month by month, where the set-up is reached (the tool never offers
 * it otherwise).
 */
function soonFor(C) {
  const { stage, plan, locked, now, ty, readonly } = C;
  if (readonly) return [];
  if (!locked || stage.key !== 'running' || now.getMonth() !== 2 || !monthsWanted(plan.decisionTool)) return [];
  const nextKey = taxYearKey(ty + 1);
  const ty2 = plan.decisionTool && plan.decisionTool.taxYears && plan.decisionTool.taxYears[nextKey];
  if (ty2 && ty2.yearSetupComplete) return [];
  const april = (ty + 1) + '-04';
  return [{ id: 'month.taxYear', pid: 'P.taxyear', soon: true, slots: { year: taxYearLabel(ty + 1), month: monthWords(april) }, button: { ...link('setUpYear', monthHref(plan), { year: taxYearLabel(ty + 1) }), choose: april } }];
}

function nextFor(C, built) {
  const R = rulesFor(C, built);
  const due = dueFor(C, built, R);
  if (due.length) return { id: due[0].pid, slots: R.slots, button: due[0].button, answerStale: R.answerStale, due };
  // nothing due: where things stand (NEXT_INFO); the last of them always says something
  const id = NEXT_ORDER.find((x) => NEXT_INFO.includes(x) && R.RULES[x]()) || 'P.reviewAny';
  return { id, slots: R.slots, button: R.BUTTONS[id] || null, answerStale: R.answerStale, due };
}

// ---- one plan ----------------------------------------------------------------------------------------------------------

/**
 * One plan's page (1.3, 2). `stepId` null opens the stage's first step; a step not on the stage's list still opens and
 * says so (`listed: false`, R7); an unknown step id opens the first step. (The screen draws the plan's home at the plan's
 * own address, 7.3.0: `current` still names the first real step, so every step's reading is as it was.)
 *
 * `due` is everything due now (dueFor), `soon` what is coming (soonFor), `life` the three-word stage (LifeStage.stageOf). A to-do
 * put away on the plan ("Not now", "I have done this": answers/plan/tasks.js) is left out of `due` and of the next sentence alike.
 */
export function planPage(entries, id, stepId, { today, source = 'account' } = {}) {
  const now = dateOf(today);
  const list = (entries || []).filter((e) => e && e.plan && typeof e.plan === 'object' && e.plan.id != null);
  const entry = list.find((e) => String(e.plan.id) === String(id)) || null;
  if (!entry) return { found: false, id: String(id || '') };
  const plan = entry.plan;
  const readonly = !!(entry.newer || entry.failed);
  const stage = safeStage(plan, now);
  const ss = safeSettings(plan, now);
  const ds = (plan.decisionTool && plan.decisionTool.settings) || {};
  const locked = isLocked(plan);
  const partners = partnersOf(list, plan);
  const ty = taxYearStartOf(now);
  // the move as the plan's mix reads it (only a plan with a document has one) and the three words of the stage (7.3.0)
  let mv = null; try { mv = moveInputs(plan, { now }); } catch { mv = null; }
  const held = holdingsSummary(normaliseHoldings(plan.holdings)).count > 0;
  // the stage (7.10.0): agreements first, then facts; what is held never decides it
  let life = null; try { life = stageOf(plan, now, { placing: stage, settings: ss }); } catch { life = null; }
  // a locked retired plan stored the old way, its start later than it should be (PlanMove.startLaterOf): one to-do, and no
  // reading of its months against a later year's figure. Read on a read-only entry too, so its months are never set against
  // a later year's figure; only the to-do is left out there (it cannot be acted on), as the home's year view reads it.
  let startLater = null; try { startLater = startLaterOf(plan, now); } catch { startLater = null; }
  // a retired draft still read from a start later than this tax year (7.4.0, PlanMove.laterDraftLeftOf: months recorded, or
  // a State Pension by plan year the reading could not keep): one to-do, to choose the start on "About you and when"
  let startDraft = null; try { startDraft = locked ? null : laterDraftLeftOf(plan, ss, now); } catch { startDraft = null; }
  // the review (7.10.0, spec-7100 §4.3, §4.4): when it is next and whether it is due, and off course by the person's own rule —
  // read from what is stored, never a run (a saver's from the check-ins, as the check-in reads them)
  const phase = life && life.key ? life.key : null;
  const closing = stage.closing === true;
  let checkIn = null; try { checkIn = phase === 'saving' && SAVER_STAGES.includes(stage.key) ? checkInState(plan, { today: localDay(now), stageKey: stage.key }) : null; } catch { checkIn = null; }
  // a plan Moving by its agreement before its stop has nothing due: no review and no off course
  const agreedMoving = phase === 'moving' && !!life && life.by === 'agreement';
  let reviewDue = null; try { reviewDue = reviewDueOf(plan, { now, phase, locked, closing, agreed: agreedMoving, checkIn }); } catch { reviewDue = null; }
  let offCourse = null; try { offCourse = offCourseOf(plan, { phase, closing, agreed: agreedMoving, checkIns: phase === 'saving' ? checkInsOf(plan) : [] }); } catch { offCourse = null; }
  // (7.12.0) a saver's "past your line" is said only while the plan still asks what the last check-in tested: once the stop
  // or the aim has changed, the home's own answer is the truth
  if (offCourse && offCourse.off && phase === 'saving' && !stillTested(plan, now)) offCourse = { ...offCourse, off: false };
  const C = { plan, entries: list, now, ss, ds, stage, locked, readonly, mon: thisMonth(now), ty, tyKey: taxYearKey(ty), source, life, mv, held, startLater, startDraft, reviewDue, offCourse };
  // how far the stop is, for what a saver keeps "For later" (steps.js laterFor): months to the stop month, in years
  const yearsToStop = Number.isFinite(stage.monthsToStart) && stage.timingMode === 'future' ? stage.monthsToStart / 12 : (Number.isFinite(stage.yearsToStart) ? stage.yearsToStart : null);
  // the plan's move window (7.10.0): the one clock for what a locked saver keeps for later
  const windowYears = windowYearsOf(plan);
  const listed = stepsFor(stage.key, { locked, linked: partners.length > 0, manyPlans: list.length > 1, yearsToStop, windowYears });
  const ids = listed.map((s) => s.id);
  // `pot`'s address opens the check-in where the stage has one (saving-enough-and-check-in.md 4.1): no address breaks.
  // "Your review" (7.10.0) is no step of the rail: a saver's is the check-in, which is current there; in any other phase no
  // step is current on it (the rail never says "you are here" of a step the page is not)
  const onReview = stepId === 'review';
  const asked = (stepId === 'pot' || (onReview && phase === 'saving')) && ids.includes('checkin') ? 'checkin' : stepId;
  const wanted = asked && ALL_STEPS.includes(asked) ? asked : null;
  const current = wanted || (onReview ? null : ids[0]);
  const shown = wanted && !ids.includes(wanted) ? [...listed, { id: wanted, optional: true, listed: false }] : listed;
  const built = {};
  for (const s of shown) { try { built[s.id] = BUILDERS[s.id](C); } catch (e) { built[s.id] = { done: false, result: sentence(s.id + '.failed', ['Could not be read'], {}), figures: {}, lines: [], buttons: [], notes: [], error: e && e.message }; } }
  // The next sentence reads the month and pot steps whether or not they are on this stage's list.
  if (!built.month && stage.key === 'running') built.month = monthStep(C);
  if (!built.pot && stage.key === 'committed-saving') built.pot = potStep(C);
  const steps = shown.map((s) => {
    const b = built[s.id];
    const buttons = readonly ? b.buttons.filter((x) => x.href) : b.buttons;   // a plan shown as saved offers no change
    // a step kept "For later" (saving-enough-and-check-in.md 4.1): on the rail its result reads "For later" until it is done,
    // never "Not recorded yet"; its own page still says what it says
    const later = s.later === true;
    const railResult = later && !b.done ? sentence('later', ['For later'], {}) : null;
    // a locked plan is being carried out, not filled in (7.3.0): a step not done there carries no "Not done yet" mark
    const unmarked = locked && s.id !== current && !b.done;
    return { id: s.id, optional: !!s.optional, listed: s.listed !== false, ...(later ? { later: true, railResult } : {}), ...(unmarked ? { unmarked: true } : {}), state: s.id === current ? 'current' : b.done ? 'done' : 'open', ...b, buttons };
  });
  const { answerStale, due, ...next } = nextFor(C, built);
  // the editing sub-steps the page links to (editing-in-v7.md 2): "About you and when" under "Your plan"
  const subSteps = subStepsFor(stage.key, { locked, linked: partners.length > 0, manyPlans: list.length > 1, yearsToStop, windowYears });
  return {
    found: true,
    id: String(plan.id),
    name: nameOf(plan, now),
    // the read-only example (GuestPlans.js; road-to-7.md step 11): the page heads it by its tag, not the stored name
    example: plan.example === true,
    stageKey: stage.key,
    retired: RETIRED_STAGES.includes(stage.key),
    saver: SAVER_STAGES.includes(stage.key),
    line: lineOf(stage, plan, ss, list, now, life),
    // a closed plan, and the plan that carries one on (6.56.0): what the page says above its steps, with the way to the other
    closed: stage.key === 'closed' ? { ...closedReading(plan, list, now), hasDocument: !!plan.planDocument } : null,
    // closed at a change-over still to come: lived on until then, but never unlocked (the guard refuses it)
    closing: stage.closing === true,
    before: beforeReading(plan, list),
    locked,
    lockedOn: locked ? dayWords(lockedAtOf(plan)) : null,
    // 7.12.0: locked when its gilt ladder cost more than its pots (an old document): said at the top of "Your plan as locked"
    lockedShort: locked && plan.planDocument ? (() => { const x = lockedShortOf(plan.planDocument); return x ? { short: '£' + x.short.toLocaleString('en-GB') } : null; })() : null,
    readonly,
    source,
    steps,
    subSteps,
    current,
    // the stored "will it last" answer, when the plan's settings no longer match the inputs it was worked out from
    answerStale: answerStale || null,
    next: readonly ? { ...next, button: null } : next,
    // 7.3.0 (research/v7/one-product-design.md, "The to-do reader"): every thing due now, in order — the first is `next`
    due,
    soon: soonFor(C),
    life,
    // 7.10.0: when the review is next (never stored), and its address
    reviewDue: reviewDue ? { ...reviewDue, href: reviewHrefOf(plan) } : null,
    offCourse,
    // the questions the rail ends with: savers get A and B, retired stages C (2.4)
    // (what the B link opens B with, a saver's own figures, is saving.js askFillOf's: the plan source puts it on the page as
    // `askFill`, so this reading, which the household's and the hold's readings import, never reaches the saving years' run)
    askLinks: RETIRED_STAGES.includes(stage.key) ? ['c'] : ['a', 'b']
  };
}
