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
import { CONTRACT_STRATEGIES } from '../../services/PlanDocument.js';
import { taxYearLabel, taxYearStartOf, taxYearKey, staleDraft } from '../../services/PlanTiming.js';
import { saverPotOf } from '../../services/SaverReading.js';
import { holdingsSummary, normaliseHoldings } from '../../services/HoldingsRecord.js';
import { stepsFor, subStepsFor, ALL_STEPS, NEXT_ORDER, RETIRED_STAGES, SAVER_STAGES } from './steps.js';
import { optionsFor } from './options.js';
import { answerAge, bandsOf, netOf } from './about.js';
import { isBought } from './pots.js';
import { savedLasts } from './lasts.js';
import { savedMix } from './mix.js';
import { oneAnswer, futuresOutOfTen } from '../../services/OneAnswer.js';
import { unlockPatchesOf } from '../../services/PlanCommit.js';
import { MONTHS, dateOf, ym, monthWords, monthName, dayWords, monthsBetween } from './dates.js';

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

/**
 * The stage line (rail-screens-language.md 1.3; your-plan.md 2.1): the key, the dates and the flags only — never the
 * planner's label, chip or banner. { id, slots } — the words are copy/plan.js stageLines[id].
 */
export function stageLine(stage, plan, ss = null) {
  const key = stage && stage.key;
  if (!key || key === 'unknown') return null;
  if (key === 'committed-saving') return { id: 'committed-saving', slots: { month: monthWords(stage.startMonth) || taxYearLabel(stage.firstTaxYear) } };
  if (key === 'bridge') return { id: isLadderPlan(plan, ss) ? 'bridge-ladder' : 'bridge-plan', slots: { month: monthWords(stage.startMonth) || ('April ' + stage.firstTaxYear) } };
  return { id: key, slots: {} };
}

function safeStage(plan, now) {
  try { return planStage(plan, { now }); } catch { return { key: 'unknown', locked: isLocked(plan), retired: false, timingMode: 'legacy', firstTaxYear: null, startMonth: null, beforeStart: false, hasRecords: false, hasDocument: !!(plan && plan.planDocument), monthsToStart: 0, yearsToStart: 0 }; }
}
function safeSettings(plan, now) {
  try { return effectiveStressSettings(plan, { now }); } catch { return (plan && plan.stressTool && plan.stressTool.settings) || {}; }
}

/** The plans linked to `plan`, in either direction (6). */
function partnersOf(entries, plan) {
  const id = plan.id;
  const mine = partnerIdOf(plan);
  return entries.filter((e) => e.plan.id !== id && (e.plan.id === mine || partnerIdOf(e.plan) === id));
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
    const ss = safeSettings(plan, now);
    const partners = partnersOf(list, plan);
    return {
      id: String(plan.id),
      name: nameOf(plan),
      stageKey: stage.key,
      line: stageLine(stage, plan, ss),
      locked: isLocked(plan),
      lockedOn: isLocked(plan) ? dayWords(lockedAtOf(plan)) : null,
      madeOn: plan.fromAnswer && plan.fromAnswer.savedOn ? dayWords(plan.fromAnswer.savedOn) : null,
      shownAsSaved: !!(e.newer || e.failed),
      // the plan menu (road-to-7.md step 11): the read-only example (GuestPlans.js), and the main plan (the planner's isActive)
      example: plan.example === true,
      main: plan.isActive === true,
      records: !!(plan.decisionTool && ((Array.isArray(plan.decisionTool.history) && plan.decisionTool.history.length > 0) || Object.values(plan.decisionTool.taxYears && typeof plan.decisionTool.taxYears === 'object' ? plan.decisionTool.taxYears : {}).some((t) => t && t.yearSetupComplete))),
      linked: partners.length > 0,
      lastModified: typeof plan.lastModified === 'string' ? plan.lastModified : ''
    };
  });
  const byTime = (a, b) => String(b.lastModified).localeCompare(String(a.lastModified));
  if (source === 'window') return { groups: [{ id: 'window', rows: rows.slice().sort((a, b) => (a.linked === b.linked ? byTime(a, b) : a.linked ? -1 : 1)) }] };
  const household = rows.filter((r) => r.linked).sort(byTime);
  const other = rows.filter((r) => !r.linked).sort(byTime);
  const groups = [];
  if (household.length) groups.push({ id: 'household', rows: household });
  if (other.length) groups.push({ id: 'other', rows: other });
  return { groups };
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

/** This month's record (2.3 `month`): recorded when the latest record's month is this month or later. */
function monthStep(C) {
  const { plan, now, ty, tyKey, mon } = C;
  const hist = historyAscending(plan);
  const latest = hist.length ? hist[hist.length - 1] : null;
  const recorded = !!latest && String(latest.date).slice(0, 7) >= mon;
  const figures = {};
  const lines = [];
  const setUp = !!(plan.decisionTool && plan.decisionTool.taxYears && plan.decisionTool.taxYears[tyKey] && plan.decisionTool.taxYears[tyKey].yearSetupComplete);
  lines.push(line(setUp ? 'month.yearSetUp' : 'month.yearNotSetUp', [], figures, sourceOf('record', null, now), { year: taxYearLabel(ty) }));
  hist.slice(-3).reverse().forEach((h, i) => {
    figures['net' + i] = r0(h.monthlyNet); figures['tax' + i] = r0(h.monthlyTax);
    lines.push(line('month.record', [{ fixed: monthWords(h.date) }, ': ', money('net' + i), ' after tax, ', money('tax' + i), ' tax'], figures, sourceOf('record', h.date, now), { month: monthWords(h.date) }));
  });
  let result;
  if (recorded) { figures.net = r0(latest.monthlyNet); result = sentence('month.recorded', [monthWords(mon) + ' recorded: ', money('net'), ' after tax'], figures); }
  else result = sentence('month.notYet', [monthWords(mon) + ' is not recorded yet'], figures);
  const buttons = [button('record', 'month', { month: monthName(mon) })];
  if (!setUp) buttons.push(button('setUpYear', 'taxyear', { year: taxYearLabel(ty) }));
  return { done: recorded, result, figures, lines, buttons, notes: [], recorded, setUp };
}

/** Where you are (2.3 `where`): whereAmI on the plan document, never the countdown. */
function whereStep(C) {
  const { plan, now, ss } = C;
  const figures = {};
  const lines = [];
  const notes = [];
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
    const inc = w.incomeThisYear || { recorded: 0, drawn: 0, planned: null };
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
      const key = String(C.ty % 100).padStart(2, '0') + '/' + String((C.ty + 1) % 100).padStart(2, '0');
      const cutMonths = historyAscending(plan).filter((h) => h && h.taxYear === key && h.inProtection === true).length;
      figures.said = said; figures.diff = Math.abs(diff); figures.cutMonths = cutMonths;
      const head = [money('drawn'), ' taken; the plan said ', money('said'), ' for ' + (inc.recorded === 1 ? 'that month' : 'those months') + '; '];
      const id = diff < 0 ? (cutMonths > 0 ? 'where.compareLessCut' : 'where.compareLess') : diff > 0 ? 'where.compareMore' : 'where.compareSame';
      const tail = diff < 0 ? (cutMonths > 0 ? [money('diff'), ' less because income was cut in ' + (cutMonths === inc.recorded ? (cutMonths === 1 ? 'it' : 'all of them') : cutMonths + ' of them')] : [money('diff'), ' less than the plan said'])
        : diff > 0 ? [money('diff'), ' more than the plan said'] : ['the same as the plan said'];
      lines.push(line(id, [...head, ...tail], figures, sourceOf('record', null, now), { months: String(inc.recorded), cutMonths: String(cutMonths) }));
    }
    lines.push(line('where.taken', [money('drawn')], figures, sourceOf('record', null, now), { year: w.taxYear }));
    if (inc.planned != null) lines.push(line('where.planned', [money('planned')], figures, sourceOf('locked', lockedAt, now), { year: w.taxYear }));
    if (w.step && w.step.amount != null) { figures.stepNow = r0(w.step.amount); lines.push(line('where.step', [money('stepNow'), ' a year before tax'], figures, sourceOf('locked', lockedAt, now), { n: String(w.step.index), of: String(w.step.of) })); }
    if (w.pot && w.pot.actual != null) {
      figures.pot = r0(w.pot.actual);
      lines.push(line('where.pot', [money('pot')], figures, sourceOf(w.pot.source === 'holdings' ? 'hold' : 'record', w.pot.asOf, now)));
      if (w.pot.p50 != null) { figures.potMid = r0(w.pot.p50); lines.push(line('where.potMid', [money('potMid')], figures, sourceOf('locked', lockedAt, now))); }
    }
  }
  if (w.contract && !inputs.ladderInDocument) notes.push('where.ladderNotInDocument');
  if (w.ladder && typeof w.ladder.monthly === 'number' && w.ladder.monthly > 0) { figures.ladderMonthly = r0(w.ladder.monthly); lines.push(line('where.ladderMonthly', [money('ladderMonthly'), ' a month before tax'], figures, sourceOf('locked', lockedAt, now))); }
  return { done: true, result, figures, lines, buttons: [button('seeDocument', 'document')], notes };
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
      else lines.push(line('says.bad', ['Your plan lasts ' + futuresOutOfTen(a.share).words + '. Left at the end, at today’s prices: typically ', money('saysTypical'), '; in a bad case (the worst 1 in 10) ', money('saysBad')], figures, src));
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
  else if (retired || stage.timingMode === 'retired') about.push(line('about.retired', [], figures, src));
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
  for (const [k, v] of Object.entries(params)) { if (num(v) == null) continue; figures['dial.' + k] = num(v); way.push(line('way.dial', [k === 'cashYears' || k === 'years' || /Years$|Age$/.test(k) ? count('dial.' + k) : money('dial.' + k)], figures, src, { dial: k })); }

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
  return { done: recorded, result, figures, lines, buttons: [button('recordPot', 'potRecord')], notes: [], recorded };
}

/** What you pay in (2.3 `saving`). */
function savingStep(C) {
  const { plan, now } = C;
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
  return { done: any, result, figures, lines, buttons: [button('changeSaving', 'saving'), button('onCourse', 'onCourse')], notes: ['saving.notFrozen'] };
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
  return { done: workedOut, result, figures, lines, buttons: [button('changeBudget', 'budget')], notes: ['budget.guide'] };
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
  return { done: false, result: sentence('lock.notLocked', ['Not locked'], figures), figures, lines: [], buttons: [], notes, locked: false, lockedOn: null, saver, strategyId, bought, hasDocument: false };
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

const BUILDERS = { month: monthStep, where: whereStep, plan: planStep, pot: potStep, saving: savingStep, budget: budgetStep, lock: lockStep, hold: holdStep, move: moveStep, household: householdStep };

// ---- the next sentence (2.4) ---------------------------------------------------------------------------------------------

function nextFor(C, built) {
  const { stage, readonly, plan, ss, locked, mon, ty, tyKey, now } = C;
  const key = stage.key;
  const retiredRunning = key === 'bridge' || key === 'running';
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
  const potRecorded = pot ? pot.recorded : false;
  // the stored "will it last" answer is older than its inputs (editing-in-v7.md 4) — never on a locked plan, whose answer is its document's
  const answerStale = !locked ? answerAge(plan, ss) : null;
  const RULES = {
    'P.readonly':    () => readonly,
    'P.noAge':       () => key === 'unknown',
    'P.arrive':      () => key === 'running' && stage.timingMode === 'future' && !!stop && !(latest && latest >= stop) && !arrivalDone,
    'P.taxyear':     () => retiredRunning && !setUp,
    'P.month':       () => retiredRunning && !recorded,
    'P.idle':        () => retiredRunning,
    'P.pot':         () => key === 'committed-saving' && !potRecorded,
    'P.working':     () => key === 'committed-saving',
    'P.recheck':     () => !!answerStale,
    'P.stale':       () => !!stale,
    'P.draft':       () => key === 'draft-retired',
    'P.approaching': () => key === 'approaching',
    'P.saving':      () => key === 'saving'
  };
  const id = NEXT_ORDER.find((x) => RULES[x]());
  const nextMonth = (() => { const p = ym(mon); const m2 = p.m === 12 ? { y: p.y + 1, m: 1 } : { y: p.y, m: p.m + 1 }; return MONTHS[m2.m - 1]; })();
  const slots = { month: monthWords(mon), monthName: monthName(mon), nextMonth, year: taxYearLabel(ty), stop: monthWords(stop) || '', savedYear: stale ? stale.savedLabel : '' };
  const aboutHref = '#/plan/' + plan.id + '/about';   // "About you and when", inside V7 (editing-in-v7.md 2)
  const lastsHref = '#/plan/' + plan.id + '/lasts';   // "Does it last?", inside V7 (editing-in-v7.md 10): no hand-over to the run
  const BUTTONS = {
    'P.readonly': null,
    'P.noAge': link('addAge', aboutHref),
    'P.arrive': button('record', 'month', { month: monthName(mon) }),
    'P.taxyear': button('setUpYear', 'taxyear', { year: taxYearLabel(ty) }),
    'P.month': button('record', 'month', { month: monthName(mon) }),
    'P.idle': null,
    'P.pot': button('recordPot', 'potRecord'),
    'P.working': button('onCourse', 'onCourse'),
    'P.recheck': link('recheck', lastsHref),
    'P.stale': link('updateIt', aboutHref),
    'P.draft': link('lasts', lastsHref),
    'P.approaching': link('lasts', lastsHref),
    'P.saving': button('onCourse', 'onCourse')
  };
  return { id: id || 'P.saving', slots, button: id ? BUTTONS[id] : null, answerStale };
}

// ---- one plan ----------------------------------------------------------------------------------------------------------

/**
 * One plan's page (1.3, 2). `stepId` null opens the stage's first step; a step not on the stage's list still opens and
 * says so (`listed: false`, R7); an unknown step id opens the first step.
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
  const C = { plan, entries: list, now, ss, ds, stage, locked, readonly, mon: thisMonth(now), ty, tyKey: taxYearKey(ty), source };
  const listed = stepsFor(stage.key, { locked, linked: partners.length > 0, manyPlans: list.length > 1 });
  const ids = listed.map((s) => s.id);
  const wanted = stepId && ALL_STEPS.includes(stepId) ? stepId : null;
  const current = wanted || ids[0];
  const shown = wanted && !ids.includes(wanted) ? [...listed, { id: wanted, optional: true, listed: false }] : listed;
  const built = {};
  for (const s of shown) { try { built[s.id] = BUILDERS[s.id](C); } catch (e) { built[s.id] = { done: false, result: sentence(s.id + '.failed', ['Could not be read'], {}), figures: {}, lines: [], buttons: [], notes: [], error: e && e.message }; } }
  // The next sentence reads the month and pot steps whether or not they are on this stage's list.
  if (!built.month && ['bridge', 'running'].includes(stage.key)) built.month = monthStep(C);
  if (!built.pot && stage.key === 'committed-saving') built.pot = potStep(C);
  const steps = shown.map((s) => {
    const b = built[s.id];
    const buttons = readonly ? b.buttons.filter((x) => x.href) : b.buttons;   // a plan shown as saved offers no change
    return { id: s.id, optional: !!s.optional, listed: s.listed !== false, state: s.id === current ? 'current' : b.done ? 'done' : 'open', ...b, buttons };
  });
  const { answerStale, ...next } = nextFor(C, built);
  // the editing sub-steps the page links to (editing-in-v7.md 2): "About you and when" under "Your plan"
  const subSteps = subStepsFor(stage.key, { locked, linked: partners.length > 0, manyPlans: list.length > 1 });
  return {
    found: true,
    id: String(plan.id),
    name: nameOf(plan),
    // the read-only example (GuestPlans.js; road-to-7.md step 11): the page heads it by its tag, not the stored name
    example: plan.example === true,
    stageKey: stage.key,
    retired: RETIRED_STAGES.includes(stage.key),
    saver: SAVER_STAGES.includes(stage.key),
    line: stageLine(stage, plan, ss),
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
    // the questions the rail ends with: savers get A and B, retired stages C (2.4)
    askLinks: RETIRED_STAGES.includes(stage.key) ? ['c'] : ['a', 'b']
  };
}
