/**
 * Saved plans, read for the screen (research/v7/your-plan.md 1.2, 1.3, 2, 3, 6). Pure: a list of plans already brought
 * up to date in memory (src/v7/effects/planSource.js hands it in as { plan, newer, failed }) and today's date in; the
 * list's rows, and one plan's stage, steps, figures and next sentence out. Every figure is the plan's own record,
 * exact, with where it came from and its date (3). Nothing here writes, runs a future, or reads a clock.
 *
 *   planRows(entries, { today, source })                → the "Your plans" list: groups of rows
 *   planPage(entries, id, stepId, { today, source })    → one plan: stage, steps, the current step, the next sentence
 *   stageLine(stage, plan)                              → the stage's one line, in V7's words (rail-screens-language.md 1.3)
 *   dateOf(today)                                       → 'YYYY-MM-DD' as a local Date at noon
 *
 * Words with {slots} are filled by the screen from copy/plan.js; the ids here match that file. A sentence's figures
 * are `parts` ({ key, kind }) into the step's `figures`, so the screen draws each through Money (data-key, data-value).
 */
import { planStage, effectiveStressSettings, whereAmIFor, whereAmIInputs, moveInputs, thisMonth, historyAscending } from '../../services/PlanReading.js';
import { CONTRACT_STRATEGIES, planToAgeOfDefinition } from '../../services/PlanDocument.js';
import { taxYearLabel, taxYearStartOf, taxYearKey, staleDraft } from '../../services/PlanTiming.js';
import { documentLadder, firstRungOf } from '../../services/LadderPosition.js';
import { saverPotOf } from '../../services/SaverReading.js';
import { payInShareOf } from '../../services/SaverPayIn.js';
import { holdingsSummary, normaliseHoldings } from '../../services/HoldingsRecord.js';
import { stepsFor, subStepsFor, ALL_STEPS, NEXT_ORDER, NEXT_INFO, DUE_IDS, RETIRED_STAGES, SAVER_STAGES } from './steps.js';
import { stageOf } from '../../services/LifeStage.js';
import { optionsFor } from './options.js';
import { answerAge, bandsOf, netOf } from './about.js';
import { isBought } from './pots.js';
import { savedLasts } from './lasts.js';
import { savedMix } from './mix.js';
import { oneAnswer, futuresOutOfTen } from '../../services/OneAnswer.js';
import { SUCCESS, planToAgeOf } from '../shared/rules.js';
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
import { unlockPatchesOf } from '../../services/PlanCommit.js';
import { checkInState } from './checkInDue.js';
import { MONTHS, dateOf, ym, monthWords, monthName, dayWords, monthsBetween, localDay } from './dates.js';
import { gapsOf, gapHeadline } from './gaps.js';
import { isClosedPlan, closedReading, beforeReading, readDayOf, closedAtOf, monthRefusalWords } from '../../services/PlanClosed.js';
import { closeQuestionOf, successorName } from '../../services/PlanClose.js';
import { startLaterOf, laterDraftLeftOf } from '../../services/PlanMove.js';

// The dates in words live in dates.js (shared with about.js); kept as exports here for everyone who reads them from read.js.
export { dateOf, monthWords, monthName, dayWords };
const num = (v) => (v == null || v === '' || !Number.isFinite(+v) ? null : +v);
const r0 = (v) => Math.round(num(v) || 0);
const nameOf = (plan) => (plan && plan.planDetails && typeof plan.planDetails.name === 'string' && plan.planDetails.name) || (plan && typeof plan.name === 'string' && plan.name) || '';
const partnerIdOf = (plan) => (plan && plan.household && typeof plan.household.partnerScenarioId === 'string' && plan.household.partnerScenarioId) || null;
const isLocked = (plan) => !!(plan && plan.decisionTool && plan.decisionTool.settings && plan.decisionTool.settings.locked);
const lockedAtOf = (plan) => (plan && plan.decisionTool && plan.decisionTool.settings && plan.decisionTool.settings.lockedAt) || (plan && plan.planDocument && plan.planDocument.lockedAt) || null;

/** The strategy ids with plain names in copy/plan.js (the ladder word on the stage line: CONTRACT_STRATEGIES). */
const stratId = (plan, ss) => (plan && plan.planDocument && plan.planDocument.strategy && plan.planDocument.strategy.id) || (ss && ss.strategyId) || 'pots-and-valves';
const isLadderPlan = (plan, ss) => CONTRACT_STRATEGIES.includes(stratId(plan, ss));

/** The ladder a locked plan's document holds (the orders fixed at the lock), or null. */
const lockedLadderOf = (plan, ss) => (isLadderPlan(plan, ss) && plan && plan.planDocument ? documentLadder(plan.planDocument, stratId(plan, ss)) : null);

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

/** The plans linked to `plan`, in either direction (6). A closed plan is no one's partner's plan: its successor is (6.56.0). */
function partnersOf(entries, plan) {
  const id = plan.id;
  const mine = partnerIdOf(plan);
  return entries.filter((e) => e.plan.id !== id && !isClosedPlan(e.plan) && (e.plan.id === mine || partnerIdOf(e.plan) === id));
}

/**
 * The stage line with the plans at hand: a closed plan's names the plan that carries it on (copy/plan.js stageLines.closed),
 * or only the month when that plan is not here ('closed-alone'). Every other stage's as stageLine gives it.
 */
function lineOf(stage, plan, ss, list, now) {
  const r = isClosedPlan(plan) ? closedReading(plan, list, now) : null;
  // closed for going back to work (research/plan-start.md §2 J): "Closed March 2029: back to work; carried on as ‘…’."
  const why = r && r.working ? '-working' : '';
  if (r && stage && stage.key === 'closed') return r.next ? { id: 'closed' + why, slots: { month: r.month, name: r.next.name } } : { id: 'closed-alone', slots: { month: r.month } };
  // closed at a change-over still to come: lived on until then, and said so (LifeStage keeps its stage)
  if (r && r.ahead) return r.next ? { id: 'closing' + why, slots: { month: r.month, name: r.next.name } } : { id: 'closing-alone', slots: { month: r.month } };
  return stageLine(stage, plan, ss);
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
export function planRows(entries, { today, source = 'account', notNow = [] } = {}) {
  const now = dateOf(today);
  const list = (entries || []).filter((e) => e && e.plan && typeof e.plan === 'object' && e.plan.id != null);
  const rows = list.map((e) => {
    const plan = e.plan;
    const stage = safeStage(plan, now);
    // the stage in three words and how many things are due (7.3.0): the plan's own reading, the one its home and rail read
    let pg = null; try { pg = planPage(list, plan.id, null, { today, source, notNow }); } catch { pg = null; }
    const ss = safeSettings(plan, now);
    const partners = partnersOf(list, plan);
    return {
      id: String(plan.id),
      name: nameOf(plan),
      stageKey: stage.key,
      line: lineOf(stage, plan, ss, list, now),
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
 * The earliest month with no record, counted from the FIRST record's month up to the month BEFORE `mon` (this month);
 * null with no records or no gap. This month itself is never a gap: it is "not recorded yet" as it always was. Months
 * before the first record are never counted (a plan may begin with a later month on purpose), nor months after this one.
 * The month before a record made with "This month's payment has already been made" — the planner dates that entry a
 * month on and marks the record `paidAhead` (index.html handleDecisionSubmit, models/Decision.js) — is not a gap either:
 * the person said it was paid. A record with no mark, every record made before the mark existed among them, reads as it
 * did, so no saved plan's reading changes.
 */
function firstGap(hist, mon) {
  if (!hist.length) return null;
  const byMonth = new Map(hist.map((h) => [String(h.date).slice(0, 7), h]));
  let p = ym(hist[0].date);
  const end = ym(mon);
  if (!p || !end) return null;
  const key = (q) => q.y + '-' + String(q.m).padStart(2, '0');
  while (monthsBetween(p, end) > 0) {
    const next = p.m === 12 ? { y: p.y + 1, m: 1 } : { y: p.y, m: p.m + 1 };
    const after = byMonth.get(key(next));
    if (!byMonth.has(key(p)) && !(after && after.paidAhead === true)) return key(p);
    p = next;
  }
  return null;
}

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
  const gap = firstGap(hist, mon);
  const recorded = !gap && !!latest && String(latest.date).slice(0, 7) >= mon;
  const toRecord = gap || mon;
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
  if (recorded) { figures.net = r0(latest.monthlyNet); result = sentence('month.recorded', [monthWords(mon) + ' recorded: ', money('net'), ' after tax'], figures); }
  else if (gap) result = sentence('month.gap', [monthWords(gap) + ' is not recorded yet; ' + monthWords(latest.date) + ' is.'], figures);
  else result = sentence('month.notYet', [monthWords(mon) + ' is not recorded yet'], figures);
  const buttons = [recordButton(plan, toRecord)];
  if (!setUp) buttons.push(link('setUpYear', monthHref(plan), { year: taxYearLabel(ty) }));
  return { done: recorded, result, figures, lines, buttons, notes: [], recorded, setUp, gap, toRecord };
}

/** Where you are (2.3 `where`): whereAmI on the plan document, never the countdown. */
function whereStep(C) {
  const { plan, now, ss } = C;
  const figures = {};
  const lines = [];
  const notes = [];
  // a closed plan locked by its months (or by the close) and never given a document: nothing to read against, but not "not locked"
  if (!plan.planDocument && isClosedPlan(plan)) return { done: true, result: sentence('where.closedNoDocument', ['This plan closed before it had a plan document; its months are in the classic planner'], figures), figures, lines, buttons: [], notes };
  if (!plan.planDocument) return { done: false, result: sentence('where.noDocument', ['Not locked: nothing to read against yet'], figures), figures, lines, buttons: [], notes };
  let w = null, inputs = { ladderInDocument: false };
  try { w = whereAmIFor(plan, { now }); inputs = whereAmIInputs(plan, { now }); } catch { w = null; }
  const lockedAt = lockedAtOf(plan);
  if (!w) return { done: false, result: sentence('where.noReading', ['The plan document could not be read'], figures), figures, lines, buttons: [button('seeDocument', 'document')], notes };
  let result;
  if (w.saving) {
    const s = w.saving;
    if (s.pathMissing || s.actual == null || s.expected == null) result = sentence('where.saverNone', ['No pot recorded against the plan’s path yet'], figures);
    else {
      figures.actual = r0(s.actual); figures.expected = r0(s.expected);
      result = sentence('where.saver', [money('actual'), ' on ' + monthWords(s.at), '; the plan’s middle line for then is ', money('expected')], figures);
      lines.push(line('where.saverPot', [money('actual')], figures, sourceOf(s.actualSource === 'holdings' ? 'hold' : 'record', s.recordedAt || s.at, now)));
      lines.push(line('where.saverLine', [money('expected')], figures, sourceOf('locked', lockedAt, now)));
    }
  } else {
    // A plan stored the old way (C.startLater) whose year 0 is still later than this tax year: this year's figure is year 0's,
    // a later tax year's, so the months recorded are said with what was taken and nothing is read against a plan figure until
    // its start is moved (the home's to-do). Once year 0 has come its months are year 0's, read against the right year's
    // figure, as the planner's strip reads them (PlanDocument.whereAmI: only a year 0 ahead is held back).
    const older = !!C.startLater && C.startLater.start > C.ty;
    const inc0 = w.incomeThisYear || { recorded: 0, drawn: 0, planned: null };
    const inc = older ? { ...inc0, planned: null, perMonth: null } : inc0;
    figures.months = inc.recorded; figures.drawn = r0(inc.drawn);
    const parts = [count('months'), ' month' + (inc.recorded === 1 ? '' : 's') + ' recorded in ' + w.taxYear + ': ', money('drawn'), ' taken before tax'];
    if (inc.planned != null) { figures.planned = r0(inc.planned); parts.push('; the plan says ', money('planned'), ' for the year'); }
    result = sentence('where.retired', parts, figures);
    // like with like (v6-usability-audit.md 2.6): what was taken in the months recorded against what the plan said for those
    // months — the document's figure for the year, a twelfth a month (whereAmI's perMonth), times the months recorded —
    // and the difference, said as less, more or the same; "because income was cut" only when a recorded month says the
    // cut was on (the record's own inProtection flag), never a reckoning of its own
    if (inc.recorded > 0 && inc.perMonth != null) {
      const said = r0(inc.perMonth) * inc.recorded;
      const diff = r0(inc.drawn) - said;
      // the tax year of the reading (w.taxYear): a closed plan is read as at its close (readDayOf), not in today's tax year
      const rty = taxYearStartOf(readDayOf(plan, now));
      const key = String(rty % 100).padStart(2, '0') + '/' + String((rty + 1) % 100).padStart(2, '0');
      const cutMonths = historyAscending(plan).filter((h) => h && h.taxYear === key && h.inProtection === true).length;
      figures.said = said; figures.diff = Math.abs(diff); figures.cutMonths = cutMonths;
      const head = [money('drawn'), ' taken; the plan said ', money('said'), ' for ' + (inc.recorded === 1 ? 'that month' : 'those months') + '; '];
      const id = diff < 0 ? (cutMonths > 0 ? 'where.compareLessCut' : 'where.compareLess') : diff > 0 ? 'where.compareMore' : 'where.compareSame';
      const tail = diff < 0 ? (cutMonths > 0 ? [money('diff'), ' less because income was cut in ' + (cutMonths === inc.recorded ? (cutMonths === 1 ? 'it' : 'all of them') : cutMonths + ' of them')] : [money('diff'), ' less than the plan said'])
        : diff > 0 ? [money('diff'), ' more than the plan said'] : ['the same as the plan said'];
      lines.push(line(id, [...head, ...tail], figures, sourceOf('record', null, now), { months: String(inc.recorded), cutMonths: String(cutMonths) }));
    }
    if (older) lines.push(line('where.startLater', ['Your plan is set to start in April ' + C.startLater.start + ', so these months are not read against it yet' + (C.readonly ? '' : ': see To do')], figures, sourceOf('locked', lockedAt, now), { start: 'April ' + C.startLater.start }));
    lines.push(line('where.taken', [money('drawn')], figures, sourceOf('record', null, now), { year: w.taxYear }));
    if (inc.planned != null) lines.push(line('where.planned', [money('planned')], figures, sourceOf('locked', lockedAt, now), { year: w.taxYear }));
    if (w.step && w.step.amount != null) { figures.stepNow = r0(w.step.amount); lines.push(line('where.step', [money('stepNow'), ' a year before tax'], figures, sourceOf('locked', lockedAt, now), { n: String(w.step.index), of: String(w.step.of) })); }
    if (w.pot && w.pot.actual != null) {
      figures.pot = r0(w.pot.actual);
      lines.push(line('where.pot', [money('pot')], figures, sourceOf(w.pot.source === 'holdings' ? 'hold' : 'record', w.pot.asOf, now)));
      if (w.pot.p50 != null && !older) { figures.potMid = r0(w.pot.p50); lines.push(line('where.potMid', [money('potMid')], figures, sourceOf('locked', lockedAt, now))); }
    }
  }
  if (w.contract && !inputs.ladderInDocument) notes.push('where.ladderNotInDocument');
  if (w.ladder && typeof w.ladder.monthly === 'number' && w.ladder.monthly > 0) { figures.ladderMonthly = r0(w.ladder.monthly); lines.push(line('where.ladderMonthly', [money('ladderMonthly'), ' a month before tax'], figures, sourceOf('locked', lockedAt, now))); }
  // the records by tax year, a spreadsheet per year and the printed documents stay on the classic page (road-to-7.md step 11b, month.exports)
  return { done: true, result, figures, lines, buttons: [button('seeDocument', 'document'), button('exports', 'exports')], notes };
}

/** The income steps as the plan has them: the document's (locked), else the effective settings'. */
function incomeSteps(plan, ss, locked) {
  if (locked && plan.planDocument && Array.isArray(plan.planDocument.steps) && plan.planDocument.steps.length) return plan.planDocument.steps.map((s) => ({ fromAge: +s.fromAge, amount: r0(s.amount), taxYear: s.taxYear || null, decline: +s.decline || 0, glideToNext: !!s.glideToNext }));
  const ageNow = num(ss.shapeAgeNow) || null;
  if (ss.incomeShape === 'phases' && Array.isArray(ss.incomeSteps) && ss.incomeSteps.length) return ss.incomeSteps.filter((s) => s && num(s.amount) != null).map((s) => ({ fromAge: +s.fromAge, amount: r0(s.amount), taxYear: null, decline: +s.decline || 0, glideToNext: !!s.glideToNext }));
  const first = Array.isArray(ss.targetSchedule) && ss.targetSchedule.length ? r0(ss.targetSchedule[0]) : r0(ss.baseSalary);
  return ageNow ? [{ fromAge: ageNow, amount: first, taxYear: null, decline: 0, glideToNext: false }] : [{ fromAge: null, amount: first, taxYear: null, decline: 0, glideToNext: false }];
}

/** Your plan (2.3 `plan`): the settings as sections, from the document when locked. */
function planStep(C) {
  const { plan, ss, ds, now, stage, locked, readonly } = C;
  const doc = locked ? plan.planDocument : null;
  const lockedAt = lockedAtOf(plan);
  const figures = {};
  const lines = [];
  const notes = [];
  const steps = incomeSteps(plan, ss, locked);
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
      ? sentence('plan.lockedSaver', [money('yearly'), ' a year before tax from ' + (monthWords(startMonth) || taxYearLabel(firstTaxYear)) + ' (tax year ' + taxYearLabel(firstTaxYear) + ')'], figures)
      : ladder && lockedLadderOf(plan, ss)
        // the ladder's own first year, from the document (6.51.0): a plan locked once it had started bought its ladder from then
        ? sentence('plan.lockedLadder', [money('yearly'), ' a year before tax; your ladder pays from April ' + lockedLadderOf(plan, ss).years[0].Y + ' (tax year ' + taxYearLabel(lockedLadderOf(plan, ss).years[0].Y) + ')'], figures)
        : sentence(ladder ? 'plan.lockedLadder' : 'plan.lockedPlan', [money('yearly'), ' a year before tax; your ' + (ladder ? 'ladder' : 'plan') + ' pays from ' + (monthWords(startMonth) || taxYearLabel(firstTaxYear)) + ' (tax year ' + taxYearLabel(firstTaxYear) + ')'], figures);
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
  const ageToday = locked && timing && num(timing.currentAge) != null ? timing.currentAge : num(ss.currentAge);
  const ageAsOf = locked && timing ? timing.currentAgeAsOf : ss.currentAgeAsOf;
  if (ageToday != null) { figures.ageToday = ageToday; about.push(line('about.age', [age('ageToday')], figures, locked ? src : sourceOf('saved', ageAsOf || null, now), { asOf: ageAsOf ? dayWords(ageAsOf) : '' })); }
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
  // the age reached in the plan's last year is start + years − 1 (the planner's "— to age" hint, PlanTiming.describeTiming)
  if (N) { figures.years = N; const ageAt = (timing && num(timing.shapeAgeNow) != null ? timing.shapeAgeNow : num(ss.shapeAgeNow)); if (ageAt != null) figures.ageEnd = ageAt + N - 1; about.push(line('about.runs', [count('years'), ' years' + (ageAt != null ? ', to age ' : '')].concat(ageAt != null ? [age('ageEnd')] : []), figures, src)); }

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
  if (par && (num(par.sipp) > 0 || num(par.isa) > 0)) { figures.parSipp = r0(par.sipp); figures.parIsa = r0(par.isa); pots.push(line('pots.atStop', [money('parSipp'), ' pension, ', money('parIsa'), ' ISA'], figures, src)); }

  // Money that comes in anyway (editing-in-v7.md 7): the State Pension, final-salary pensions, other income, income for some
  // years and lump sums — its own section, edited inside V7
  const income = [];
  const spWeekly = locked && doc && doc.assumptions ? num(doc.assumptions.spWeeklyAmount) : num(ss.spWeeklyAmount);
  const spDate = locked && doc && doc.assumptions ? doc.assumptions.spStartDate : ss.spStartDate;
  if (spWeekly > 0) { figures.spWeekly = r0(spWeekly); income.push(line('pots.statePension', [money('spWeekly'), ' a week'], figures, src, { from: spDate ? String(spDate) : '' })); }
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
  for (const [k, v] of Object.entries(params)) { if (num(v) == null || k === 'bridgeCash') continue; figures['dial.' + k] = num(v); way.push(line('way.dial', [k === 'cashYears' || k === 'years' || /Years$|Age$/.test(k) ? count('dial.' + k) : money('dial.' + k)], figures, src, { dial: k })); }

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
    // "The mix" (way-and-mix.md 3): how the pension is held; on a locked plan the tries still run there, nothing is written
    { id: 'mix', lines: mix, place: 'settings', sub: 'mix', href: '#/plan/' + plan.id + '/mix', lockedButton: 'tryMix' }
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
    const p = potStep(C);
    return { ...p, buttons: [here], due: !p.recorded, checkIn: st };
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

/** What you spend (2.3 `budget`): a guide beside the plan's own figure. */
function budgetStep(C) {
  const { plan, now } = C;
  const b = (plan.budgetTool && plan.budgetTool.settings) || {};
  const d = b.derived || {};
  const figures = {};
  const lines = [];
  const total = r0(d.allInComfortableMonthly || d.comfortableMonthlyNet);
  const essentials = r0(d.essentialMonthlyNet);
  const linesCount = Array.isArray(b.lines) ? b.lines.filter((l) => l && num(l.amount) > 0).length : 0;
  const workedOut = total > 0 && linesCount > 0;
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
  const { plan, now } = C;
  const figures = {};
  const lines = [];
  let m = null; try { m = moveInputs(plan, { now }); } catch { m = null; }
  let result, done = false;
  if (!m || !m.target || m.target.kind === 'none') result = sentence('move.notSet', ['Set when the plan is locked'], figures);
  else if (m.diff.complete) { result = sentence('move.done', ['Done'], figures); done = true; }
  else if (m.target.kind === 'ladder') {
    const total = m.target.lines.length;
    const bought = m.diff.hold.filter((h) => Array.isArray(h.taxYears)).length;
    figures.bought = bought; figures.rungs = total;
    result = sentence('move.gilts', [count('bought'), ' of ', count('rungs'), ' gilts bought'], figures);
  } else {
    figures.movesDone = m.prog.doneCount; figures.moves = m.prog.total;
    result = sentence('move.moves', [count('movesDone'), ' of ', count('moves'), ' moves done'], figures);
  }
  if (m && m.diff && typeof m.diff.progressPct === 'number') { figures.heldPct = m.diff.progressPct; lines.push(line('move.held', [count('heldPct'), '% of the plan’s mix held'], figures, sourceOf('hold', normaliseHoldings(plan.holdings).updatedAt || null, now))); }
  // "Open it": the move is drawn inside V7 (road-to-7.md step 10; holdings-and-move.md §4)
  return { done, result, figures, lines, buttons: [link('openMove', '#/plan/' + plan.id + '/move')], notes: ['move.optional'] };
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
    const stage = safeStage(p.plan, now);
    const theirLine = stageLine(stage, p.plan, safeSettings(p.plan, now));
    result = sentence('household.with', ['With ‘' + nameOf(p.plan) + '’'], figures);
    for (const e of partners) {
      const st = safeStage(e.plan, now);
      lines.push({ id: 'household.partner', slots: { name: nameOf(e.plan) }, sentence: sentence('household.partner', [], figures), source: sourceOf('saved', null, now), theirLine: stageLine(st, e.plan, safeSettings(e.plan, now)), theirId: String(e.plan.id) });
      buttons.push(link('openPartner', '#/plan/' + e.plan.id, { name: nameOf(e.plan) }));
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

/** "Not now" on a to-do (7.3.0): the key this window keeps for it (effects/place.js, session storage) — never the plan. */
export const notNowKey = (planId, itemId) => String(planId) + '|' + itemId;

/**
 * The rules of the next sentence and of the plan's to-do list (2.4; research/v7/one-product-design.md, "The to-do reader"):
 * which fire, the button each offers and the slots their words take. ONE reading for both, so the rail's "Next" and the
 * home's first to-do can never disagree.
 */
function rulesFor(C, built) {
  const { stage, readonly, plan, ss, locked, mon, ty, tyKey, now, life, mv } = C;
  const key = stage.key;
  const retiredRunning = key === 'running';
  const month = built.month;
  const pot = built.pot;
  const hist = historyAscending(plan);
  const latest = hist.length ? String(hist[hist.length - 1].date).slice(0, 7) : null;
  const arrivalDone = Array.isArray(plan.journey) && plan.journey.some((j) => j && /arrival/i.test(String(j.note || '')));
  const stop = stage.startMonth || null;
  const hasRecords = stage.hasRecords;
  let stale = null;
  try { stale = ['saving', 'approaching', 'draft-retired', 'unknown'].includes(key) ? staleDraft(ss, { locked, hasRecords, now }) : null; } catch { stale = null; }
  const setUp = month ? month.setUp : !!(plan.decisionTool && plan.decisionTool.taxYears && plan.decisionTool.taxYears[tyKey] && plan.decisionTool.taxYears[tyKey].yearSetupComplete);
  const recorded = month ? month.recorded : (!!latest && latest >= mon);
  // the month to record: the earliest month not recorded (monthStep), else this month — P.month names it and its button carries it
  const toRecord = month && month.toRecord ? month.toRecord : mon;
  const potRecorded = pot ? pot.recorded : false;
  // the stored "will it last" answer is older than its inputs (editing-in-v7.md 4) — never on a locked plan, whose answer is its document's
  const answerStale = !locked ? answerAge(plan, ss) : null;
  // a saver's plan with no income set has nothing to test what goes in against (saving-enough-and-check-in.md 4.2); never
  // asked of a locked plan, whose sentence stays today's
  const saverStage = SAVER_STAGES.includes(key);
  const noAim = saverStage && !locked && !(incomeSteps(plan, ss, false).some((st) => st.amount > 0));
  const closed = key === 'closed' ? closedReading(plan, C.entries) : null;
  // the check-in (release step R3): how often, whether it is due, and what the last one said — read from what is stored
  const ci = !saverStage ? null : built.checkin && built.checkin.checkIn ? built.checkin.checkIn : (() => { try { return checkInState(plan, { today: localDay(now), stageKey: key }); } catch { return null; } })();
  const chosen = !!(ci && ci.chosen);
  const lastBand = ci && ci.lastCheckIn ? ci.lastCheckIn.band : null;
  // 7.3.0: the move (TransitionPlanner.progress, read through PlanReading.moveInputs) — the next order still to place, and
  // every order ticked while what you hold does not show it yet; what you hold not updated for over three months (sourceOf's
  // own rule); a partner's plan the link names that is not in this account
  const prog = mv && mv.prog ? mv.prog : null;
  const rec = normaliseHoldings(plan.holdings);
  const holdCount = holdingsSummary(rec).count;
  const holdStale = holdCount > 0 && !!rec.updatedAt && sourceOf('hold', rec.updatedAt, now).stale;
  const mine = partnerIdOf(plan);
  const partnerMissing = !!mine && !C.entries.some((e) => String(e.plan.id) === mine);
  const drawingOrMoving = !!life && (life.key === 'moving' || life.key === 'drawing');
  // 7.6.0: the first tax year not yet covered by what is held and kept, said as a thing to do only when that year has begun
  // or starts within six months (6 April), and only once (the first such year); it opens "What you hold", never a sale
  let gapSoon = null;
  if (locked && !readonly) {
    try {
      const h = gapHeadline(gapsOf(plan, { today: localDay(now) }));
      if (h && (h.Y <= ty || monthsBetween({ y: now.getFullYear(), m: now.getMonth() + 1 }, { y: h.Y, m: 4 }) <= 6)) gapSoon = h;
    } catch { gapSoon = null; }
  }
  // (7.9.0: something kept that the locked plan did not have is no longer a to-do — the home never pushes it, research/v7/
  // replan-nov-2026.md §6.4; What you hold says where its agreement stands, as information)
  // the last check-in's band, said with the move invitation (the design: "At your last check-in you were on course / behind")
  const band = lastBand === 'yes' ? 'yes' : lastBand === 'close' || lastBand === 'no' ? 'behind' : null;
  const RULES = {
    'P.readonly':    () => readonly,
    'P.closed':      () => !!closed && !!closed.next,
    'P.closedAlone': () => !!closed,
    'P.noAge':       () => key === 'unknown',
    'P.agesFromSaving': () => saverStage && !locked && stage.fromAccumulation === true,
    // the invitation is a thing to do from the stop month (before it, the home says it is coming: soonFor)
    'P.invite':      () => !!life && !!life.invite && life.invite.passed === true,
    'P.arrive':      () => key === 'running' && stage.timingMode === 'future' && !!stop && !(latest && latest >= stop) && !arrivalDone,
    'P.taxyear':     () => retiredRunning && !setUp,
    'P.month':       () => retiredRunning && !recorded,
    'P.moveNext':    () => locked && !!life && life.key === 'moving' && !!prog && !!prog.next,
    'P.moveFinish':  () => locked && !!life && life.key === 'moving' && !!prog && prog.total > 0 && !prog.next,
    'P.gapSoon':     () => !!gapSoon,
    'P.firstCheckIn': () => saverStage && key !== 'unknown' && !!ci && !ci.chosen && !ci.legacy && !(ci.count > 0),
    'P.idle':        () => retiredRunning,
    'P.noAim':       () => noAim,
    // a plan locked while saving that never chose how often: today's monthly pot step, word for word (5.2)
    'P.pot':         () => key === 'committed-saving' && !chosen && !potRecorded,
    'P.working':     () => key === 'committed-saving' && !chosen,
    'P.checkinDue':  () => chosen && ci.due,
    'P.behind':      () => !!ci && (lastBand === 'close' || lastBand === 'no'),
    'P.holdStale':   () => locked && drawingOrMoving && holdStale,
    // a locked plan read as Drawing with nothing it holds recorded: its move is still all to make, so it is said, below the
    // month and the check-ins (the design's "drawing (lower)"); a holdings record that shows the plan's mix has nothing left
    // to move, and one short of it on a plan recording months (Drawing, 7.3.1) is said on the home as information, not a to-do
    'P.moveLater':   () => locked && !!life && life.key === 'drawing' && !C.held && !!prog && !!prog.next,
    'P.recheck':     () => !!answerStale,
    'P.stale':       () => !!stale,
    'P.householdPending': () => partnerMissing,
    'P.draft':       () => key === 'draft-retired',
    // a locked plan stored the old way (PlanMove.startLaterOf): move its start to the tax year work stopped, or say when that was
    'P.startMove':   () => !C.readonly && !!C.startLater && C.startLater.kind === 'move' && !C.startLater.blocked,
    // the move cannot keep the State Pension's tax year under the lock (PlanMove.moveBlockedOf): said as it is, never a
    // "Move the start" that the page it opens would refuse
    'P.startBlocked': () => !C.readonly && !!C.startLater && C.startLater.kind === 'move' && !!C.startLater.blocked,
    'P.startAsk':    () => !C.readonly && !!C.startLater && C.startLater.kind === 'ask',
    // a draft whose start is still later than this tax year (C.startDraft): choose it on "About you and when"
    'P.startDraft':  () => !C.readonly && !!C.startDraft,
    'P.approaching': () => key === 'approaching',
    'P.onCourse':    () => !!ci && lastBand === 'yes',
    'P.nextCheckIn': () => chosen && !!ci.lastCheckIn,
    'P.saving':      () => key === 'saving'
  };
  const nextMonth = (() => { const p = ym(mon); const m2 = p.m === 12 ? { y: p.y + 1, m: 1 } : { y: p.y, m: p.m + 1 }; return MONTHS[m2.m - 1]; })();
  // {stop}: the month work stops; a saver with no month for it (saving-enough-and-check-in.md 4.2) is told their age then
  const stopWords = monthWords(stop) || (saverStage ? (stage.accumulationAges ? 'age ' + stage.accumulationAges.retirementAge : num(ss.retireAge) ? 'age ' + num(ss.retireAge) : '') : '');
  const slots = { month: monthWords(toRecord), monthName: monthName(toRecord), nextMonth, year: taxYearLabel(ty), stop: stopWords, savedYear: stale ? stale.savedLabel : '', closed: closed ? closed.month : '', next: closed && closed.next ? closed.next.name : '',
    ...(chosen ? { often: OFTEN[ci.every], last: ci.lastCheckIn ? monthWords(ci.lastCheckIn.month) : '', nextCheck: monthWords(ci.next) } : ci && ci.lastCheckIn ? { last: monthWords(ci.lastCheckIn.month) } : {}),
    // the move's next order, by its place in the list and its own name (never a figure: the move page says the amounts)
    ...(prog && prog.next ? { n: String(prog.doneCount + 1), of: String(prog.total), label: String(prog.next.label || prog.next.ticker || '') } : prog ? { n: String(prog.doneCount), of: String(prog.total) } : {}),
    ...(holdCount > 0 && rec.updatedAt ? { date: dayWords(rec.updatedAt) } : {}),
    ...(gapSoon ? { gapYear: gapSoon.year, gap: gapSoon.gap } : {}),
    ...(band ? { band } : {}),
    ...(C.startLater ? { start: 'April ' + C.startLater.start, ...(C.startLater.stopMonth ? { stopped: monthWords(C.startLater.stopMonth) } : {}),
      // the move to the tax year the recorded months begin in (7.4.3): that month, and the tax year it moves to
      ...(C.startLater.recordsFrom ? { records: monthWords(C.startLater.recordsFrom), moveTo: taxYearLabel(C.startLater.to) } : {}) } : C.startDraft ? { start: 'April ' + C.startDraft.start } : {}) };
  const aboutHref = '#/plan/' + plan.id + '/about';   // "About you and when", inside V7 (editing-in-v7.md 2)
  const lastsHref = '#/plan/' + plan.id + '/lasts';   // "Does it last?", inside V7 (editing-in-v7.md 10): no hand-over to the run
  const savingHref = '#/plan/' + plan.id + '/saving'; // "What you pay in", inside V7: whether what goes in is enough (release step R2)
  const checkinHref = '#/plan/' + plan.id + '/checkin'; // "Check in" (release step R3)
  const holdHref = '#/plan/' + plan.id + '/hold';
  const BUTTONS = {
    'P.readonly': null,
    'P.closed': closed && closed.next ? link('openNext', '#/plan/' + closed.next.id, { name: closed.next.name }) : null,
    'P.closedAlone': null,
    'P.noAge': link('addAge', aboutHref),
    'P.agesFromSaving': link('checkAges', aboutHref),
    // the agreement to move comes in a later release (research/v7/one-product-design.md 7.4.0): until then the invitation
    // opens the month work stops on "About you and when"
    'P.invite': link('checkStop', aboutHref),
    'P.noAim': link('setAim', '#/plan/' + plan.id + '/spend'),
    'P.arrive': recordButton(plan, mon),
    'P.taxyear': link('setUpYear', monthHref(plan), { year: taxYearLabel(ty) }),
    'P.month': recordButton(plan, toRecord),
    'P.moveNext': link('seeMove', '#/plan/' + plan.id + '/move'),
    'P.moveLater': link('seeMove', '#/plan/' + plan.id + '/move'),
    'P.moveFinish': link('updateHold', holdHref),
    'P.firstCheckIn': link('checkIn', checkinHref),
    'P.idle': null,
    // the old words open the check-in now, "Each month" kept (4.2): the pot is recorded there, with the rest of a check-in
    'P.pot': link('recordPot', checkinHref),
    'P.working': button('onCourse', 'onCourse'),
    'P.checkinDue': link('checkIn', checkinHref),
    'P.behind': link('seeSaving', savingHref),
    'P.holdStale': link('updateHold', holdHref),
    'P.gapSoon': link('seeGaps', holdHref),
    'P.householdPending': link('linkOne', '#/plan/' + plan.id + '/household'),
    'P.onCourse': null,
    'P.nextCheckIn': null,
    'P.recheck': link('recheck', lastsHref),
    'P.stale': link('updateIt', aboutHref),
    'P.draft': link('lasts', lastsHref),
    // both open "About you and when", where the month is asked and the move is made after its confirm
    'P.startMove': link('moveStart', aboutHref),
    'P.startAsk': link('sayWhen', aboutHref),
    'P.startBlocked': link('seeWhy', aboutHref),
    'P.startDraft': link('chooseStart', aboutHref),
    'P.approaching': link('lasts', lastsHref),
    'P.saving': link('seeSaving', savingHref)
  };
  return { RULES, BUTTONS, slots, answerStale, gap: !!(month && month.gap) };
}

/**
 * Everything due now on one plan, in the design's order (research/v7/one-product-design.md, "The to-do reader"): each with
 * the design's id, the P.* id its words are under in copy/plan.js, its button and slots. Nothing on a plan shown as saved
 * (nothing can be changed there), and on a closed plan only the way to the plan that carries it on. A to-do the person put
 * off with "Not now" in this window (`C.notNow`) is left out until the window closes. Pure; nothing is written.
 */
const DISMISSIBLE = ['P.invite', 'P.holdStale', 'P.moveLater'];
export function dueFor(C, built, R = rulesFor(C, built)) {
  if (C.readonly) return [];
  const out = [];
  for (const pid of NEXT_ORDER) {
    if (NEXT_INFO.includes(pid) || !R.RULES[pid]()) continue;
    if (C.stage.key === 'closed' && pid !== 'P.closed') continue;
    // "When did you stop work?" offers this tax year beside it only where the move to it is offered (startLater.thisYear),
    // as the planner's own words do (NextStep startAsk / startAskOnly)
    const id = pid === 'P.month' && R.gap ? 'month.gap' : pid === 'P.startAsk' && !(C.startLater && C.startLater.thisYear) ? 'start.askOnly' : DUE_IDS[pid];
    // the move to the tax year the recorded months begin in (7.4.3) says so, in its own words on the home and the rail
    const records = (pid === 'P.startMove' || pid === 'P.startBlocked') && !!(C.startLater && C.startLater.recordsFrom);
    // put off for this window: what you hold out of date and the move on a plan that records nothing it holds ("Not now"),
    // and the move invitation ("Not yet", the design's rank 3) — kept in the window only, nothing written
    const dismiss = DISMISSIBLE.includes(pid) ? 'window' : null;
    if (dismiss && (C.notNow || []).includes(notNowKey(C.plan.id, id))) continue;
    out.push({ id: records ? id + 'Records' : id, pid, slots: R.slots, button: R.BUTTONS[pid] || null, ...(dismiss ? { dismiss } : {}), ...(records ? { words: pid + 'Records' } : {}) });
  }
  return out;
}

/**
 * What is coming but not due yet ("soon": listed apart on the home, never counted, never the rail's next): the move
 * invitation before the stop month (a locked saver within twelve months of it), and the next tax year's set-up from 1 March, on a locked plan that records months, when it is not set up already. Its button chooses
 * April on Month by month, where the set-up is reached (the tool never offers it otherwise).
 */
function soonFor(C, slots = {}) {
  const { stage, plan, locked, now, ty, readonly, life } = C;
  if (readonly) return [];
  // the move invitation on a locked saver within twelve months of the stop: what is coming, said with its month (and the
  // last check-in's band), never counted until the stop month makes it a thing to do
  if (life && life.invite && !life.invite.passed) {
    return [{ id: 'move.invite', pid: 'P.invite', soon: true, slots: { stop: monthWords(life.invite.stop), ...(slots.band ? { band: slots.band } : {}) }, button: link('checkStop', '#/plan/' + plan.id + '/about') }];
  }
  if (!locked || stage.key !== 'running' || now.getMonth() !== 2) return [];
  const nextKey = taxYearKey(ty + 1);
  const ty2 = plan.decisionTool && plan.decisionTool.taxYears && plan.decisionTool.taxYears[nextKey];
  if (ty2 && ty2.yearSetupComplete) return [];
  const april = (ty + 1) + '-04';
  return [{ id: 'month.taxYear', pid: 'P.taxyear', soon: true, slots: { year: taxYearLabel(ty + 1), month: monthWords(april) }, button: { ...link('setUpYear', monthHref(plan), { year: taxYearLabel(ty + 1) }), choose: april } }];
}

function nextFor(C, built) {
  const R = rulesFor(C, built);
  const due = dueFor(C, built, R);
  if (due.length) return { id: due[0].pid, ...(due[0].words ? { words: due[0].words } : {}), slots: R.slots, button: due[0].button, answerStale: R.answerStale, due };
  // nothing due: where things stand (NEXT_INFO), word for word as before
  const id = NEXT_ORDER.find((x) => NEXT_INFO.includes(x) && R.RULES[x]());
  return { id: id || 'P.saving', slots: R.slots, button: id ? R.BUTTONS[id] : null, answerStale: R.answerStale, due };
}

// ---- one plan ----------------------------------------------------------------------------------------------------------

/**
 * One plan's page (1.3, 2). `stepId` null opens the stage's first step; a step not on the stage's list still opens and
 * says so (`listed: false`, R7); an unknown step id opens the first step. (The screen draws the plan's home at the plan's
 * own address, 7.3.0: `current` still names the first real step, so every step's reading is as it was.)
 *
 * `due` is everything due now (dueFor), `soon` what is coming (soonFor), `life` the three-word stage (LifeStage.stageOf);
 * `notNow` the to-dos put off in this window ("Not now", effects/place.js), left out of `due` and of the next sentence alike.
 */
export function planPage(entries, id, stepId, { today, source = 'account', notNow = [] } = {}) {
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
  let life = null; try { life = stageOf(plan, now, { placing: stage, move: { recorded: held, complete: mv && mv.diff ? mv.diff.complete === true : null } }); } catch { life = null; }
  // a locked retired plan stored the old way, its start later than it should be (PlanMove.startLaterOf): one to-do, and no
  // reading of its months against a later year's figure. Read on a read-only entry too, so its months are never set against
  // a later year's figure; only the to-do is left out there (it cannot be acted on), as the home's year view reads it.
  let startLater = null; try { startLater = startLaterOf(plan, now); } catch { startLater = null; }
  // a retired draft still read from a start later than this tax year (7.4.0, PlanMove.laterDraftLeftOf: months recorded, or
  // a State Pension by plan year the reading could not keep): one to-do, to choose the start on "About you and when"
  let startDraft = null; try { startDraft = locked ? null : laterDraftLeftOf(plan, ss, now); } catch { startDraft = null; }
  const C = { plan, entries: list, now, ss, ds, stage, locked, readonly, mon: thisMonth(now), ty, tyKey: taxYearKey(ty), source, life, mv, held, startLater, startDraft, notNow: Array.isArray(notNow) ? notNow : [] };
  // how far the stop is, for what a saver keeps "For later" (steps.js laterFor): months to the stop month, in years
  const yearsToStop = Number.isFinite(stage.monthsToStart) && stage.timingMode === 'future' ? stage.monthsToStart / 12 : (Number.isFinite(stage.yearsToStart) ? stage.yearsToStart : null);
  const listed = stepsFor(stage.key, { locked, linked: partners.length > 0, manyPlans: list.length > 1, yearsToStop });
  const ids = listed.map((s) => s.id);
  // `pot`'s address opens the check-in where the stage has one (saving-enough-and-check-in.md 4.1): no address breaks
  const asked = stepId === 'pot' && ids.includes('checkin') ? 'checkin' : stepId;
  const wanted = asked && ALL_STEPS.includes(asked) ? asked : null;
  const current = wanted || ids[0];
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
  const subSteps = subStepsFor(stage.key, { locked, linked: partners.length > 0, manyPlans: list.length > 1, yearsToStop });
  return {
    found: true,
    id: String(plan.id),
    name: nameOf(plan),
    // the read-only example (GuestPlans.js; road-to-7.md step 11): the page heads it by its tag, not the stored name
    example: plan.example === true,
    stageKey: stage.key,
    retired: RETIRED_STAGES.includes(stage.key),
    saver: SAVER_STAGES.includes(stage.key),
    line: lineOf(stage, plan, ss, list, now),
    // a closed plan, and the plan that carries one on (6.56.0): what the page says above its steps, with the way to the other
    closed: stage.key === 'closed' ? { ...closedReading(plan, list, now), hasDocument: !!plan.planDocument } : null,
    // closed at a change-over still to come: lived on until then, but never unlocked (the guard refuses it)
    closing: stage.closing === true,
    before: beforeReading(plan, list),
    locked,
    lockedOn: locked ? dayWords(lockedAtOf(plan)) : null,
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
    soon: soonFor(C, next.slots),
    life,
    // the questions the rail ends with: savers get A and B, retired stages C (2.4)
    // (what the B link opens B with, a saver's own figures, is saving.js askFillOf's: the plan source puts it on the page as
    // `askFill`, so this reading, which the household's and the hold's readings import, never reaches the saving years' run)
    askLinks: RETIRED_STAGES.includes(stage.key) ? ['c'] : ['a', 'b']
  };
}
