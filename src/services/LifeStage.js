/**
 * Life stage — where this plan's owner is, derived from what the plan already knows. Never asked.
 *
 * Two axes: commitment (draft / locked) and time. Someone still working is before their plan's start (saving, approaching,
 * committed and still saving); someone retired is never before it: their plan starts in the tax year they stopped work, or
 * the one they pick it up from (7.4.0), so a locked retired plan is running and a draft one is being designed. A plan stored
 * the old way, with a year 0 still ahead, is running too (7.4.2), and shows one thing to do, the move of its start
 * (PlanMove.startLaterOf); an old journey entry that named its placing (`bridge`) is read as retired. Each stage
 * says which tools lead, which are read-only, which are hidden, what the next-step banner says, and
 * what moves the person on. The stage is recomputed on every load; only the journey (stage changes
 * with dates) is persisted, so a corrected age or start year can never strand anyone.
 *
 * A closed plan (6.56.0, research/plan-start.md §2 I; services/PlanClosed.js) has one stage of its own, `closed`, whatever
 * its dates say, once its last month has passed: it leads nothing, everything in it is read-only, the Accumulation planner
 * is hidden, and its banner says it carries on in a new plan. Until then (a change-over up to a year ahead) it keeps its
 * stage, and its banner says when it closes. Month by month refuses a month after the close, and on the plan that carries
 * it on a month before its first (decisionEntryAllowed).
 *
 * Pure: no DOM, no storage.
 */
import { deriveTiming, taxYearLabel, monthsUntilStart, monthsUntilMonth } from './PlanTiming.js';
import { saverReading, saverPrices, savingPathVersion, pathStart, pathCountsIsa, v3PensionLineAt, figureOrNull, monthOf, monthWords, OLD_PATH_CPI } from './SaverReading.js';
import { closedAtOf, nextPlanIdOf, beforeOf, monthRefusal, monthRefusalWords, monthWordsOf, closesAhead } from './PlanClosed.js';
import { WINDOW, windowOf, windowYearsOf, agreementOf } from './Phases.js';

/**
 * How far out "approaching retirement" starts when the person has not chosen: the move window's default (7.10.0, one clock
 * for both apps — Phases.WINDOW). A plan's own window (Phases.windowYearsOf) places it; this is only the default.
 */
export const APPROACHING_YEARS = WINDOW.def;
/** What the banner adds on a plan closed at a change-over still to come (6.56.0): it is lived on until then. */
export const CLOSING_TEXT = 'This plan closes at the end of {closed}: record the months until then here, and the months after it on the plan that carries it on.';

export const STAGES = Object.freeze({
  // A saver's tools (research/saving-enough-and-check-in.md 4.3, 4.6, release step R2): the Accumulation planner leads,
  // so a saver opens on it; what they hold, the move and the lock come when they are ready, never as the next step.
  saving: {
    key: 'saving', label: 'Saving', chip: 'saving',
    leads: ['accumulation', 'budget'], readOnly: [], hidden: [],
    banner: { text: 'You are saving. Set the income you will want (Budget), then check you are on course for it (Accumulation planner). The Stress tester can price the plan on the pots you will have at retirement.', btn: 'Open the Accumulation planner', tab: 'accumulation' }
  },
  approaching: {
    key: 'approaching', label: 'Approaching retirement', chip: 'approaching',
    leads: ['stress', 'strategies', 'accumulation'], readOnly: [], hidden: [],
    // the words only changed (4.3): the button still opens the Stress tester, the tab this stage opens on (openingTab);
    // {window} is the plan's move window ("3 years", "1 year": 7.10.0)
    banner: { text: 'Within {window} of the month you stop work. Check you are on course (Accumulation), then stress-test the plan you will draw on; locking it and moving what you hold come when you are ready.', btn: 'Open the Stress tester', tab: 'stress' }
  },
  'committed-saving': {
    key: 'committed-saving', label: 'Committed, still saving', chip: 'to go',
    leads: ['accumulation'], readOnly: ['stress', 'strategies'], hidden: [],
    // A locked saver keeps paying in and checks in once a year (7.10.0: the yearly review, never a monthly pot); buying the
    // plan's mix years ahead was never the next step.
    // `nearText` is added inside the move window (Phases.windowYearsOf), when moving what you hold starts to matter.
    banner: { text: 'Your plan is locked and you stop work in {stop}. Keep paying in, and check in once a year on the Accumulation planner; the Decision tool opens when you stop.', nearText: 'Moving what you hold to the plan\'s mix can start now, if you want to.', btn: 'Open the Accumulation planner', tab: 'accumulation' }
  },
  running: {
    key: 'running', label: 'Running the plan', chip: 'running',
    leads: ['decision'], readOnly: ['stress', 'strategies'], hidden: ['accumulation'],
    banner: null   // the where-am-I strip is the banner
  },
  'draft-retired': {
    key: 'draft-retired', label: 'Retired, designing the plan', chip: 'retired',
    leads: ['stress', 'strategies'], readOnly: [], hidden: ['accumulation'],
    banner: { text: 'You are retired and the plan is still a draft. Stress-test it, then lock it from the Stress tester\'s Settings page to write the plan document and start recording months.', btn: 'Open the Stress tester', tab: 'stress',
      // unlocked to change with months recorded (7.12.0 round 3, decision 10): never "still a draft … start recording"
      keptText: 'Your plan is unlocked to change, and the months you recorded are kept. Lock it again from the Stress tester\'s Settings page to carry on recording.' }
  },
  // A closed plan (PlanClosed.js): kept to read, carried on by the plan that followed it. Nothing leads; every tool that
  // could change it is read-only; Month by month keeps its months (and takes none after the close).
  closed: {
    key: 'closed', label: 'Closed — carried on in a new plan', chip: 'closed',
    leads: [], readOnly: ['stress', 'strategies', 'transition', 'decision'], hidden: ['accumulation'],
    banner: { text: 'This plan is closed: it ran to the end of {closed} and carries on in a new plan. Its months stay here to read; record the months after it on the plan that carries it on.', btn: 'Open the plan that carries it on', tab: 'decision' }
  },
  unknown: {
    key: 'unknown', label: 'Getting started', chip: '',
    leads: ['budget'], readOnly: [], hidden: [],
    banner: null   // the onboarding chain (budget → target → stress → decision) speaks here
  }
});

/**
 * @param {object} scenario  { stressTool: { settings }, decisionTool: { settings, history, taxYears }, planDocument }
 * @returns {{ key, label, chip, leads, readOnly, hidden, banner, locked, retired, timingMode, firstTaxYear,
 *   startLabel, yearsToStart, monthsToStart, beforeStart, hasRecords, hasDocument, reasons: string[] }}
 */
export function deriveStage(scenario, now = new Date()) {
  const s = scenario || {};
  const stress = s.stressTool?.settings || {};
  const ds = s.decisionTool?.settings || {};
  const locked = !!ds.locked;
  const history = Array.isArray(s.decisionTool?.history) ? s.decisionTool.history : [];
  const taxYears = s.decisionTool?.taxYears || {};
  const hasRecords = history.length > 0 || Object.values(taxYears).some((t) => t && t.yearSetupComplete);
  const hasDocument = !!s.planDocument;
  const t = deriveTiming(stress, now);
  // A future retiree is "before the start" until the retirement MONTH (their birthday), not just until the
  // plan's tax year begins — they may still be working in April of plan year 0 (6.10.3). Only someone still working is ever
  // before their plan (7.4.2): a retired plan stored with a later year 0 is running, and shows the move of its start.
  const nowKey = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
  const beforeStart = t.mode === 'future' && !!t.startMonth && nowKey < t.startMonth;
  const monthsToStart = t.mode === 'future' && t.startMonth ? monthsUntilMonth(t.startMonth, now) : monthsUntilStart(t.firstTaxYear, now);
  const reasons = [];
  let key;
  // One placing for both apps (research/saving-enough-and-check-in.md 4.6): an unlocked plan whose ages are typed only on
  // the Accumulation tab is placed by those ages, so the planner's banner, its next step, V7's rail and its next sentence
  // all see a saver — before, it was "Getting started" and was told to set up the Decision tool. The ages carry no date,
  // so they are read as typed (V7 asks once to confirm them). A locked plan with no Timing age stays running: it has records.
  const acc = accumulationAgesOf(s);
  // one clock (7.10.0): the plan's move window, its years as the person chose them, else the default
  const yw = windowYearsOf(s);
  let fromAccumulation = false;
  if (t.mode === 'legacy' && !locked && acc) {
    fromAccumulation = true;
    key = acc.years > yw ? 'saving' : 'approaching';
    reasons.push('ages from the Accumulation tab');
  } else if (t.mode === 'legacy') {
    // No age today: the app cannot place them, and the implicit "next April" start means nothing here.
    // A locked legacy plan has records — it is running; a draft is simply getting started.
    key = locked ? 'running' : 'unknown';
    reasons.push('no age today in the Timing block');
  } else if (t.mode === 'future') {
    if (locked) key = beforeStart ? 'committed-saving' : 'running';
    else key = monthsToStart > yw * 12 ? 'saving' : 'approaching';
    reasons.push('retiring at ' + t.retireAge + ' (' + taxYearLabel(t.firstTaxYear) + ')');
  } else {
    key = locked ? 'running' : 'draft-retired';
    reasons.push('already retired; plan starts ' + taxYearLabel(t.firstTaxYear));
  }
  // A closed plan is closed whatever its dates say (PlanClosed.js) — once its last month has passed. Closed at a change-over
  // still to come, it is lived on until then (its months up to the close are recorded on it), so it keeps its stage and its
  // banner says when it closes.
  const closedAt = closedAtOf(s);
  const closing = !!closedAt && closesAhead(s, now);
  if (closedAt && !closing) { key = 'closed'; reasons.push('closed at the end of ' + monthWordsOf(closedAt)); }
  else if (closing) reasons.push('closes at the end of ' + monthWordsOf(closedAt));
  if (locked) reasons.push('plan locked' + (hasDocument ? ' with a plan document' : ''));
  const def = STAGES[key];
  // The transition tool (6.8.0) LEADS from Approaching to the plan start (and for a retiree still designing —
  // a reconcile of what is already held). It is never hidden (6.13.0): it is the home of the holdings record
  // ("What you hold"), which a saver records long before there is anything to transition, and a plan that is
  // Running still needs reconciling now and then (6.10.4) — so Saving and Getting started show it without leading with it.
  const leads = def.leads.slice(), hidden = def.hidden.slice();
  if (['approaching', 'committed-saving', 'draft-retired'].includes(key)) leads.push('transition');
  const startLabel = taxYearLabel(t.firstTaxYear);
  const stopWords = (t.mode === 'future' && t.startMonth && monthWords(monthOf(t.startMonth))) || startLabel;
  const near = def.banner && def.banner.nearText && beforeStart && monthsToStart <= yw * 12;
  const windowWords = yw === 1 ? '1 year' : yw + ' years';
  const closingText = closing ? ' ' + CLOSING_TEXT.replace('{closed}', monthWordsOf(closedAt)) : '';
  // a stage with no banner of its own (running: the where-am-I strip is its banner) still says when a closing plan closes
  const bannerText = def.banner && def.banner.keptText && !locked && history.length ? def.banner.keptText : def.banner ? def.banner.text : '';
  const banner = closing && !def.banner ? { text: closingText.trim(), btn: 'Open the Decision tool', tab: 'decision' } : def.banner ? { text: (bannerText + (near ? ' ' + def.banner.nearText : '') + closingText).replace(/\{start\}/g, startLabel).replace(/\{stop\}/g, stopWords).replace(/\{window\}/g, windowWords).replace(/\{closed\}/g, monthWordsOf(closedAt)), btn: def.banner.btn, tab: def.banner.tab, ...(def.banner.sub ? { sub: def.banner.sub } : {}) } : null;
  const before = beforeOf(s);
  return {
    key, label: def.label, chip: chipText(def, monthsToStart, beforeStart),
    leads, readOnly: def.readOnly.slice(), hidden, banner,
    locked, retired: t.mode === 'retired', timingMode: t.mode, firstTaxYear: t.firstTaxYear, startLabel, startMonth: t.startMonth || null,
    // today's plan year, signed (negative before the plan's income starts), and the month work stopped when the plan says
    planYearNow: t.planYearNow, stoppedWork: t.stoppedWork || null,
    yearsToStart: fromAccumulation ? acc.years : t.yearsToStart, monthsToStart, beforeStart, hasRecords, hasDocument, reasons,
    // the close (PlanClosed.js): the last month a closed plan covers and the plan that carries it on; on that plan, its first month
    closedAt: closedAt || null, nextPlanId: closedAt ? nextPlanIdOf(s) : null, closing, beforeFrom: before ? before.from : null,
    // placed by the Accumulation tab's ages (4.6): their ages, as typed, for the readers that ask to confirm them
    ...(fromAccumulation ? { fromAccumulation: true, accumulationAges: { currentAge: acc.currentAge, retirementAge: acc.retirementAge } } : {})
  };
}

/**
 * The three words a person sees (research/v7/replan-nov-2026.md §6): Saving, Moving, Living on it ('drawing') — and Closed
 * for a plan kept to read. Agreements first, then facts (7.10.0, spec-7100 §2); nothing is written, and what the person
 * holds never decides the stage.
 *
 *   Inputs
 *     the window (Phases.windowOf on the stop below): before (now < from), inside (from <= now < stop), after (now >= stop);
 *       none with no stop month — and for a plan placed by the Accumulation tab's ages, which carry no date (it reads
 *       Saving until the ages are confirmed on "About you and when")
 *     A: the Moving agreement (phases.moving.agreed), belonging to the plan and made for the strategy it draws by
 *        (Phases.agreementOf). Holdings never void it; no other write can make one
 *     M: a month recorded on Month by month (decisionTool.history)
 *   Rule, in order
 *     1. unknown → null                     5. A otherwise → moving, by agreement
 *     2. closed → closed                    6. after → drawing; an unlocked plan in future timing reads moving with
 *     3. A, and the dates read drawing         `confirmStop` (the person says on About that they have stopped: never a
 *        (after, or none on running or         silent change of placing)
 *        draft-retired) → drawing, by       7. none on running or draft-retired → drawing
 *        agreement                          8. inside → moving
 *     4. M → drawing                        9. else saving
 *   An agreement made before the stop keeps the plan Moving until the stop; it never makes someone still working
 *   "Living on it".
 *
 * Pure. `placing` (deriveStage's result, or V7's planStage on the effective settings) may be passed in by a caller that has
 * it, and `settings` (the effective Stress settings) for the strategy an agreement must name.
 * @returns {{ key: 'saving'|'moving'|'drawing'|'closed'|null, placing: string, locked: boolean, stop: string|null,
 *   since: string|null, by: 'facts'|'agreement', window: { years, from, to, monthsLeft, state }|null, agreed: object|null,
 *   confirmStop: boolean }}
 */
export function stageOf(plan, now = new Date(), { placing = null, settings = null } = {}) {
  const st = placing || deriveStage(plan, now);
  const p = st.key;
  // the month work stops (a saver) or stopped (someone retired), when the plan says it
  const stop = st.timingMode === 'future' ? (st.startMonth || null) : (st.stoppedWork ? String(st.stoppedWork).slice(0, 7) : null);
  const w = windowOf(plan, { now, stop: st.fromAccumulation ? null : stop });
  const state = w.state;
  const agreed = p === 'unknown' || p === 'closed' ? null : agreementOf(plan, { settings });
  // a month recorded: the same reading deriveStage makes of the history (its own months only, never a tax year's set-up)
  const months = Array.isArray(plan && plan.decisionTool && plan.decisionTool.history) ? plan.decisionTool.history.length > 0 : false;
  const retiredPlacing = p === 'running' || p === 'draft-retired';
  const datesDrawing = state === 'after' || (state === 'none' && retiredPlacing);
  let key, by = 'facts', confirmStop = false;
  if (p === 'unknown') key = null;
  else if (p === 'closed') key = 'closed';
  else if (agreed && datesDrawing) { key = 'drawing'; by = 'agreement'; }
  else if (months) key = 'drawing';
  else if (agreed) { key = 'moving'; by = 'agreement'; }
  else if (state === 'after') {
    if (st.timingMode === 'future' && !st.locked) { key = 'moving'; confirmStop = true; } else key = 'drawing';
  } else if (state === 'none' && retiredPlacing) key = 'drawing';
  else if (state === 'inside') key = 'moving';
  else key = 'saving';
  const window = state === 'none' ? null : { years: w.years, from: w.from, to: w.to, monthsLeft: w.monthsLeft, state };
  const since = key === 'closed' ? (st.closedAt || null) : key === 'saving' || key == null ? null
    : key === 'moving' ? (window && state !== 'before' ? window.from : agreed ? String(agreed.at).slice(0, 7) : null)
    : stop || (st.firstTaxYear ? st.firstTaxYear + '-04' : null);
  return { key, placing: p, locked: !!st.locked, stop, since, by, window, agreed: key === null || key === 'closed' ? null : agreed, confirmStop };
}

/** The Accumulation tab's own ages, when both are typed and the stop is later: { currentAge, retirementAge, years }; else null. */
export function accumulationAgesOf(scenario) {
  const a = scenario && scenario.accumulationTool && scenario.accumulationTool.settings;
  const cur = a && Number.isFinite(+a.currentAge) ? +a.currentAge : 0;
  const ret = a && Number.isFinite(+a.retirementAge) ? +a.retirementAge : 0;
  if (!(cur > 0) || !(ret > cur)) return null;
  return { currentAge: cur, retirementAge: ret, years: ret - cur };
}

/** The stages of someone still saving (V7's src/answers/plan/steps.js SAVER_STAGES, the same three). */
export const SAVER_STAGE_KEYS = Object.freeze(['saving', 'approaching', 'committed-saving']);

/**
 * The first screen the full view opens a plan on (7.12.0: by stage, never a set-up warning). `phase` is the plan home's
 * stage key (answers/plan/home.js homeOf; src/ui/homeBannerUi.js openingTabOf passes it); `held`: What you hold has lines;
 * `figures`: the plan holds figures someone gave it (services/DraftDecision.js planHasFigures).
 *
 *   closed                                          Decision → History
 *   no figures yet                                  Stress tester → Settings
 *   inside the move window, not locked              Stress tester
 *   inside the move window, locked, something held  Transition
 *   inside the move window, locked, nothing held    Decision → Plan document (holdings are never required)
 *   saving (locked or not, before the window)       Accumulation
 *   retired, not locked                             Stress tester
 *   locked, living on it                            Decision → Monthly Entry
 *   anything else (an old plan with no age)         Decision, as before
 * @returns {{ tab: string, sub: string|null }}
 */
export function openingTab(stage, phase = null, { held = false, figures = true } = {}) {
  const key = stage ? stage.key : null;
  const locked = !!(stage && stage.locked);
  if (key === 'closed' || phase === 'closed') return { tab: 'decision', sub: 'history' };
  if (!figures && !locked) return { tab: 'stress', sub: 'stresssettings' };
  if (phase === 'moving') return locked ? (held ? { tab: 'transition', sub: null } : { tab: 'decision', sub: 'plandoc' }) : { tab: 'stress', sub: null };
  if (key && SAVER_STAGE_KEYS.includes(key) && Array.isArray(stage.leads) && stage.leads.length) return { tab: stage.leads[0], sub: null };
  if (key === 'draft-retired') return { tab: 'stress', sub: null };
  if (key === 'running') return { tab: 'decision', sub: 'entry' };
  return { tab: 'decision', sub: null };
}

function chipText(def, monthsToStart, beforeStart) {
  if (def.key === 'committed-saving') {
    if (!beforeStart || monthsToStart <= 0) return def.chip;
    return monthsToStart >= 24 ? Math.round(monthsToStart / 12) + ' years to go' : monthsToStart + ' month' + (monthsToStart === 1 ? '' : 's') + ' to go';
  }
  return def.chip;
}

/**
 * Decision-tool gate: may a month be entered? A saver's plan takes none before the stop month. A closed plan takes no month
 * after its close, and the plan that carries it on none before its first month (PlanClosed.monthRefusal): those months
 * belong to the other plan.
 */
export function decisionEntryAllowed(stage, entryMonth) {
  if (!stage) return { ok: true };
  const shut = monthRefusal({ closedAt: stage.closedAt, before: stage.beforeFrom ? { kind: 'plan', from: stage.beforeFrom } : null }, entryMonth);
  if (shut) return { ok: false, reason: monthRefusalWords(shut) };
  if (stage.key === 'committed-saving') {
    const key = String(entryMonth || '').slice(0, 7);
    const gate = stage.startMonth || (stage.firstTaxYear + '-04');
    if (!/^\d{4}-\d{2}$/.test(key) || key < gate) {
      const [y, m] = gate.split('-').map(Number);
      const mon = MONTHS[m - 1];
      return { ok: false, reason: 'This plan is locked and you retire in ' + mon + ' ' + y + ' (plan year 0 is ' + stage.startLabel + '). Monthly entries open then — until then you are still saving, so record your pot on the Accumulation planner instead.' };
    }
  }
  return { ok: true };
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/**
 * The check-in's gate, beside the Decision tool's (research/saving-enough-and-check-in.md 5.8): a check-in is a saver's
 * moment to say where they are, so it is offered only while the plan is still saving. From the stop month the plan is
 * running and Month by month takes over, with the arrival check; a drawing plan never has one.
 * @returns {{ ok: boolean, reason: string|null }}  reason: 'notSaving' when refused
 */
export function checkInAllowed(stage) {
  return stage && SAVER_STAGE_KEYS.includes(stage.key) ? { ok: true, reason: null } : { ok: false, reason: 'notSaving' };
}

/**
 * Before a Decision month locks a SAVER's plan (6.20.2). Recording a month, or setting up its tax year, locks the plan
 * (PlanLock.lockPlanIfNeeded). For someone still saving that is rarely meant: the lock writes no saving path, freezes
 * the plan, and the Decision tool then takes no more months until they stop (decisionEntryAllowed). So a plan in future
 * mode, before the month it stops and not locked yet, asks first. Everyone else keeps today's behaviour: null.
 * @returns {{ title: string, paragraphs: string[], okLabel: string, cancelLabel: string }|null}
 */
export function decisionLockQuestion(stage) {
  if (!stage || stage.locked) return null;
  // Still saving (6.20.2): the month would lock a plan that has not started; say where a saver records their pot.
  if (stage.timingMode === 'future' && stage.beforeStart) {
    const m = /^(\d{4})-(\d{2})$/.exec(String(stage.startMonth || ''));
    const when = m ? MONTHS[+m[2] - 1] + ' ' + m[1] : 'you retire (' + stage.startLabel + ')';
    return {
      title: 'This locks the plan. Lock it now?',
      paragraphs: [
        'Your plan says you are still saving until ' + when + '. Recording a month in the Decision tool locks the plan.',
        'Locking copies your Stress tester settings across to the Decision tool and freezes both until you unlock; it writes the plan document, which follows your saving month by month; and the Decision tool takes no more months until you stop saving.',
        'While you are saving, record your pot each month on the Accumulation tab instead. That does not lock anything.',
        '"Not now" leaves this month unrecorded. How often you draw, your records, what you hold and the Budget stay changeable either way.'
      ],
      okLabel: 'Lock the plan and carry on',
      cancelLabel: 'Not now'
    };
  }
  // Everyone else (v6 usability audit, decision 3): the first month, or its tax-year set-up, locks the plan — ask, and
  // lock the plan as the Stress settings do (settings copied across, document written), never on the Decision tool's defaults.
  return {
    title: 'This locks the plan. Lock it now?',
    paragraphs: [
      'Recording a month in the Decision tool — or setting up its tax year — locks the plan' + (stage.startLabel ? ' (plan starts ' + stage.startLabel + ')' : '') + '.',
      'Locking copies your Stress tester settings across to the Decision tool — the pots, income steps, State Pension and strategy you tested — and freezes both until you unlock. It also writes the plan document: the record of what you committed to, which "Where you are" reads against each month.',
      'How often you draw, your records, what you hold and the Budget stay changeable. "Not now" leaves this month unrecorded; to lock without recording a month, use Stress tester → Settings → "Lock plan & create the plan document".'
    ],
    okLabel: 'Lock the plan and record this month',
    cancelLabel: 'Not now'
  };
}

/**
 * Arrival check: the first month after a locked-while-saving plan starts brings the real pots. Compare them with what the
 * locked plan expected at the stop — with the SAME measure as the monthly reading (6.22.0, services/SaverReading.js):
 *  - a version-3 path (locks from 6.22.0): pension + ISA (when the path counts one) against the path's middle line at the
 *    stop, both in pounds of the day. With no ISA figure above £0 in the entry — a blank box, or the Decision box left at
 *    £0, which there means "use the tax year's ISA set-up" — the pension against the path's own pension line, and the
 *    words say the ISA is left out (review of 6.22.0: a blank box was read as £0, so a saver on course was offered to
 *    unlock and re-plan);
 *  - an older path: the pension, put into the path's prices (2.5% a year, as the path was drawn), against the path's own
 *    line at the stop (its "your mix" line when it has one, else the middle line);
 *  - no path (locked with no pot on record, or before 6.7.0): the pension at retirement the plan was priced on, the pot
 *    put into the prices of the day the document was written in the same way.
 * Until 6.22.0 it set the pot in the pounds of the day against a figure in the prices of the lock, pension only, so a
 * saver exactly on course after years of rising prices was told to unlock and re-plan.
 * @param {{ sipp: number, isa?: number|string|null }} potsEntered   the first Decision entry's pension (equity + bond + cash)
 *   and its ISA box as it stands (blank or null: no figure)
 * @param {{ tolerance?: number, now?: Date, at?: string|Date }} [opts]   `at`: the entry's month ('YYYY-MM'); default this month (`now`)
 * @returns {null | { expected, actual, compared, ratio, within, measure: 'path-v3'|'path-v3-pension'|'path-v2'|'priced', message }}
 */
export function arrivalCheck(stage, planDocument, potsEntered, { tolerance = 0.10, now = new Date(), at = now } = {}) {
  if (!stage || !planDocument || stage.timingMode !== 'future' || stage.beforeStart) return null;
  const doc = planDocument;
  const sipp = +(potsEntered?.sipp || 0);
  const isaFig = figureOrNull(potsEntered ? potsEntered.isa : null);
  const isaIn = isaFig == null ? 0 : isaFig;
  const version = savingPathVersion(doc);
  const pathOk = version != null && Array.isArray(doc.accumulation.path) && doc.accumulation.path.length > 0;
  const pctOff = (r) => (r > 1 ? '+' : '') + Math.round((r - 1) * 100) + '%';
  const within = (r) => Math.abs(r - 1) <= tolerance;
  const tail = (r) => (within(r) ? ' — within ' + Math.round(tolerance * 100) + '%. The locked plan runs as it is.'
    : ' (' + pctOff(r) + '). Run the locked plan on what you have, or unlock and re-plan — the plan document is kept as version one either way.');
  // A reading at the stop: the entry's month, but never read past the path's end (clamped to it).
  if (pathOk) {
    if (version === 3 && pathCountsIsa(doc) && !(isaIn > 0)) {
      const line = v3PensionLineAt(doc, at);
      if (!(line > 0)) return null;
      const ratio = sipp / line;
      return { expected: Math.round(line), actual: Math.round(sipp), compared: Math.round(sipp), ratio, within: within(ratio), measure: 'path-v3-pension',
        message: 'Your pension pot is ' + gbp(sipp) + ' against ' + gbp(line) + ' the locked path expects in your pension at the stop (its middle line, in pounds of the day). No ISA figure was entered with this month, so your ISA is left out' + tail(ratio) };
    }
    const r = saverReading(doc, { at, pension: sipp, isa: isaIn });
    if (!r || !(r.expected > 0) || r.compared == null) return null;
    const ratio = r.compared / r.expected;
    if (version === 3) {
      const what = r.isaCounted ? 'Your pension and ISA come to ' : 'Your pension pot is ';
      return { expected: r.expected, actual: r.actual, compared: r.compared, ratio, within: within(ratio), measure: 'path-v3',
        message: what + gbp(r.actual) + ' against ' + gbp(r.expected) + ' the locked path expects at the stop (its middle line, in pounds of the day)' + tail(ratio) };
    }
    return { expected: r.expected, actual: r.actual, compared: r.compared, ratio, within: within(ratio), measure: 'path-v2',
      message: 'Your pension pot is ' + gbp(r.actual) + pricesWords(doc, r.compared, r.prices.factor, 'the locked path was drawn') + ', against ' + gbp(r.expected) + ' the locked path expects at the stop' + tail(ratio) };
  }
  const par = doc.pots?.potAtRetirement;
  const expected = +(par?.sipp || 0) > 0 ? +par.sipp : +(doc.pots?.sipp || 0);
  if (!(expected > 0)) return null;
  const pr = saverPrices({ createdAt: doc.createdAt, lockedAt: doc.lockedAt }, monthOf(at) || at);
  const compared = sipp / pr.factor;
  const ratio = compared / expected;
  return { expected, actual: sipp, compared: Math.round(compared), ratio, within: within(ratio), measure: 'priced',
    message: 'Your pot is ' + gbp(sipp) + pricesWords({ createdAt: doc.createdAt, lockedAt: doc.lockedAt }, compared, pr.factor, 'the plan document was written') + ', against ' + gbp(expected) + ' the plan was priced on' + tail(ratio) };
}

/** ", which is £Y in the prices of July 2026, when the locked path was drawn (prices assumed to rise 2.5% a year, as the path does)" */
function pricesWords(doc, compared, factor, when) {
  const start = pathStart(doc).at;
  if (!start || !(Math.abs(factor - 1) >= 0.0005)) return '';
  return ', which is ' + gbp(compared) + ' in the prices of ' + monthWords(start) + ', when ' + when + ' (prices assumed to rise ' + (OLD_PATH_CPI * 100).toFixed(1) + '% a year, as the path does)';
}

const gbp = (v) => '£' + Math.round(+v || 0).toLocaleString('en-GB');

/**
 * The journey's key for a placing: a stored `bridge` entry is the old placing of a plan now read as running (7.4.2), and
 * `saving` and `approaching` are one stage (7.10.0): the line between them is the move window, which the person may choose
 * and a release or a rollback may move — so neither a release, a window chosen nor a rollback makes the planner write the
 * journey when a plan is opened.
 */
const journeyKeyOf = (k) => (k === 'bridge' ? 'running' : k === 'approaching' ? 'saving' : k);
/** Append a stage change to the journey (pure; returns the same array when nothing changed). A stored `bridge`
 *  entry is the old placing of a plan now read as running (7.4.2): it is the same stage, so reading the plan again
 *  adds nothing, and opening it writes nothing. Saving and approaching are one stage here (journeyKeyOf). */
export function journeyAppend(journey, stage, now = new Date(), note = null) {
  const list = Array.isArray(journey) ? journey : [];
  const last = list[list.length - 1];
  if (last && journeyKeyOf(last.stage) === journeyKeyOf(stage.key)) return list;
  return [...list, { stage: stage.key, label: stage.label, at: now.toISOString(), ...(note ? { note } : {}) }].slice(-40);
}
