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
import { stepsFor, ALL_STEPS, NEXT_ORDER, RETIRED_STAGES, SAVER_STAGES } from './steps.js';
import { optionsFor } from './options.js';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/** 'YYYY-MM-DD' → a local Date at noon (never midnight: a clock change cannot move the day). */
export function dateOf(today) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(today || ''));
  if (!m) throw new Error('planRead needs today as YYYY-MM-DD');
  return new Date(+m[1], +m[2] - 1, +m[3], 12, 0, 0, 0);
}
const ym = (s) => { const m = /^(\d{4})-(\d{2})/.exec(String(s || '')); return m ? { y: +m[1], m: +m[2] } : null; };
/** '2026-10' (or any date text starting so) → 'October 2026'; '' when it is not one. */
export const monthWords = (s) => { const p = ym(s); return p && p.m >= 1 && p.m <= 12 ? MONTHS[p.m - 1] + ' ' + p.y : ''; };
export const monthName = (s) => { const p = ym(s); return p && p.m >= 1 && p.m <= 12 ? MONTHS[p.m - 1] : ''; };
/** '2026-07-01T08:15:00.000Z' or '2026-07-01' → '1 July 2026' (the calendar day as written). */
export const dayWords = (s) => { const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(s || '')); return m && +m[2] >= 1 && +m[2] <= 12 ? +m[3] + ' ' + MONTHS[+m[2] - 1] + ' ' + m[1] : monthWords(s); };
const monthsBetween = (a, b) => (b.y - a.y) * 12 + (b.m - a.m);
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
  if (N) { figures.years = N; const ageAt = (timing && num(timing.shapeAgeNow) != null ? timing.shapeAgeNow : num(ss.shapeAgeNow)); if (ageAt != null) figures.ageEnd = ageAt + N; about.push(line('about.runs', [count('years'), ' years' + (ageAt != null ? ', to age ' : '')].concat(ageAt != null ? [age('ageEnd')] : []), figures, src)); }

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
  const spWeekly = locked && doc && doc.assumptions ? num(doc.assumptions.spWeeklyAmount) : num(ss.spWeeklyAmount);
  const spDate = locked && doc && doc.assumptions ? doc.assumptions.spStartDate : ss.spStartDate;
  if (spWeekly > 0) { figures.spWeekly = r0(spWeekly); pots.push(line('pots.statePension', [money('spWeekly'), ' a week'], figures, src, { from: spDate ? String(spDate) : '' })); }
  else if (num(ss.statePension) > 0) { figures.spYearly = r0(ss.statePension); const fromYear = firstTaxYear && num(ss.statePensionYear) != null ? taxYearLabel(firstTaxYear + r0(ss.statePensionYear)) : ''; pots.push(line('pots.statePensionOld', [money('spYearly'), ' a year'], figures, src, { year: fromYear })); }
  else pots.push(line('pots.noStatePension', [], figures, src));
  if (num(ss.dbAmount) > 0) { figures.db = r0(ss.dbAmount); const from = num(ss.dbStartAge) != null ? 'age ' + String(r0(ss.dbStartAge)) : (num(ss.dbStartYear) != null && firstTaxYear ? 'tax year ' + taxYearLabel(firstTaxYear + r0(ss.dbStartYear)) : ''); pots.push(line('pots.finalSalary', [money('db'), ' a year'], figures, src, { from })); }
  if (num(ss.other) > 0) { figures.other = r0(ss.other); pots.push(line('pots.other', [money('other'), ' a year'], figures, src)); }

  // How the money is taken
  const way = [];
  const sid = stratId(plan, ss);
  way.push(line('way.strategy', [], figures, src, { strategy: sid }));
  const params = (locked && doc && doc.strategy && doc.strategy.params) || ss.strategyParams || {};
  for (const [k, v] of Object.entries(params)) { if (num(v) == null) continue; figures['dial.' + k] = num(v); way.push(line('way.dial', [k === 'cashYears' || k === 'years' || /Years$|Age$/.test(k) ? count('dial.' + k) : money('dial.' + k)], figures, src, { dial: k })); }
  if (!locked && ss.allocMode) way.push(line('way.allocMode', [], figures, src, { mode: String(ss.allocMode) }));

  // Everything else this plan uses (2.5)
  const options = optionsFor(ss, ds, plan);
  const allOptions = optionsFor(ss, ds, plan, { all: true });

  const sections = [
    { id: 'about', lines: about, place: 'about' },
    { id: 'pays', lines: pays, place: 'spend' },
    { id: 'pots', lines: pots, place: 'pots' },
    { id: 'way', lines: way, place: 'way' }
  ];
  const buttons = [];
  if (locked) { buttons.push(button('openDocument', 'document'), button('testLocked', 'test')); }
  else if (!readonly) buttons.push(button('testPlan', 'test'));
  const journey = Array.isArray(plan.journey) ? plan.journey.filter((j) => j && j.stage).map((j) => ({ stage: j.stage, on: dayWords(j.at), arrival: /arrival/i.test(String(j.note || '')) })) : [];
  const pastVersions = Array.isArray(plan.planDocumentArchive) ? plan.planDocumentArchive.length : 0;
  return { done: stage.key !== 'unknown', result, figures, lines, buttons, notes, sections, options, allOptions, journey, pastVersions, lockedOn: locked ? dayWords(lockedAt) : null };
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

/** Lock the plan (2.3 `lock`): on an unlocked plan only. */
function lockStep(C) {
  const notes = ['lock.what'];
  if (SAVER_STAGES.includes(C.stage.key)) notes.push('lock.saver');
  return { done: false, result: sentence('lock.notLocked', ['Not locked'], {}), figures: {}, lines: [], buttons: [button('lockIt', 'lock')], notes };
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
  return { done: has, result, figures, lines, buttons: [button('changeHold', 'hold')], notes: [] };
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
  return { done, result, figures, lines, buttons: [button('openMove', 'move')], notes: ['move.optional'] };
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
    const holder = mine && partners.some((e) => e.plan.id === mine) ? String(plan.id) : String(partners[0].plan.id);
    buttons.push({ ...button('checkTogether', 'household'), planId: holder });
    return { done: true, result, figures, lines, buttons, notes: [], theirLine };
  }
  if (missing) return { done: false, result: sentence('household.notInAccount', ['Your partner’s plan is not in this account'], figures), figures, lines, buttons: [button('linkOne', 'household')], notes: [] };
  return { done: false, result: sentence('household.none', ['No partner’s plan is linked'], figures), figures, lines, buttons: [button('linkOne', 'household')], notes: [] };
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
  const RULES = {
    'P.readonly':    () => readonly,
    'P.noAge':       () => key === 'unknown',
    'P.arrive':      () => key === 'running' && stage.timingMode === 'future' && !!stop && !(latest && latest >= stop) && !arrivalDone,
    'P.taxyear':     () => retiredRunning && !setUp,
    'P.month':       () => retiredRunning && !recorded,
    'P.idle':        () => retiredRunning,
    'P.pot':         () => key === 'committed-saving' && !potRecorded,
    'P.working':     () => key === 'committed-saving',
    'P.stale':       () => !!stale,
    'P.draft':       () => key === 'draft-retired',
    'P.approaching': () => key === 'approaching',
    'P.saving':      () => key === 'saving'
  };
  const id = NEXT_ORDER.find((x) => RULES[x]());
  const nextMonth = (() => { const p = ym(mon); const m2 = p.m === 12 ? { y: p.y + 1, m: 1 } : { y: p.y, m: p.m + 1 }; return MONTHS[m2.m - 1]; })();
  const slots = { month: monthWords(mon), monthName: monthName(mon), nextMonth, year: taxYearLabel(ty), stop: monthWords(stop) || '', savedYear: stale ? stale.savedLabel : '' };
  const BUTTONS = {
    'P.readonly': null,
    'P.noAge': button('addAge', 'about'),
    'P.arrive': button('record', 'month', { month: monthName(mon) }),
    'P.taxyear': button('setUpYear', 'taxyear', { year: taxYearLabel(ty) }),
    'P.month': button('record', 'month', { month: monthName(mon) }),
    'P.idle': null,
    'P.pot': button('recordPot', 'potRecord'),
    'P.working': button('onCourse', 'onCourse'),
    'P.stale': button('updateIt', 'about'),
    'P.draft': button('testPlan', 'test'),
    'P.approaching': button('testPlan', 'test'),
    'P.saving': button('onCourse', 'onCourse')
  };
  return { id: id || 'P.saving', slots, button: id ? BUTTONS[id] : null };
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
  const next = nextFor(C, built);
  return {
    found: true,
    id: String(plan.id),
    name: nameOf(plan),
    stageKey: stage.key,
    retired: RETIRED_STAGES.includes(stage.key),
    saver: SAVER_STAGES.includes(stage.key),
    line: stageLine(stage, plan, ss),
    locked,
    lockedOn: locked ? dayWords(lockedAtOf(plan)) : null,
    readonly,
    source,
    steps,
    current,
    next: readonly ? { ...next, button: null } : next,
    // the questions the rail ends with: savers get A and B, retired stages C (2.4)
    askLinks: RETIRED_STAGES.includes(stage.key) ? ['c'] : ['a', 'b']
  };
}
