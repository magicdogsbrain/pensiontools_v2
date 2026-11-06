/**
 * When the plan's income starts, in the planner (6.51.0, research/plan-start.md §1–3, §6): the month work stopped or stops
 * is asked beside the plan's start, a draft may start its income in the tax year work stopped however long ago, and every
 * page says where the plan stands. The planner's side of it lives here so index.html keeps one call for each:
 *
 *   installStopMonth(win, doc)            the Timing block's month box: its handlers, and the month as the form holds it
 *   stopMonthFromForm(doc, future, now)   'YYYY-MM' typed in the box when it fits the choice above it, else null
 *   paintStopMonth(doc, t, s, summary, locked)  the box's label, the summary's warning for a month that does not fit,
 *                                         and the ladder's "cash set aside" dial (only while the engines read it)
 *   wizardStop(wizardData, ...)           the setup wizard's month: the timing it adds and the years it moves year 0 back
 *   recordBeforeStart(h, anchor)          is a Decision record before the plan's income starts — from the plan's year 0 as
 *                                         it is now, the stamped mark only when there is none
 *   recordYearLabel(h, anchor)            "Year N", or "{Month YYYY} · tax year {TY}" for a month before year 0
 *   recordSourceWords(h, anchor, …)       where a ladder month was paid from, never the stamped words of an old start
 *   livedYearRowHtml(y, recs, plan, gbp)  plan vs actual for a year lived before the plan was locked: the draw only
 *   yearRowHtml(y, recs, plan, tyCfg, …)  plan vs actual's row for a plan year: lived, a part year, or a whole one
 *   beforeStartNoteHtml(n, label)         plan vs actual's note on months recorded before year 0 (a plan stored the old way)
 *   firstSetUpPlanYear(taxYears, anchor)  plan vs actual's part year: the first plan year the tax-year wizard set up
 *   lockedStartHtml(o)                    a locked plan's start, under the Timing block's summary (6.53.0): "When did you
 *                                         stop work?" once, or the action "Move the plan's start…", and the month changeable
 *   LOCKED_STOP_REFUSED                   why a month typed there is refused
 *   spCountOf(before, after)              the State Pension's tax year and its plan year before and after a move
 *   moveStartQuestion(move, facts)        the action's confirm: exactly what changes, as the unlock's does
 *   moveStartDoneWords(move)              the toast after it
 *   planVsActualWords(por, lockedAt, day) plan vs actual's heading and closing sentence: frozen at the lock, or written
 *                                         again when the start moved
 *
 * Pure, bar the two that read or write the page they are handed.
 */
import { stoppedWorkOf, hasStopped, ageOnDate, taxYearStartOf, planYearOf, taxYearLabel, monthName } from '../services/PlanTiming.js';
import { runUpCashSpent, draftPotsAsOf } from '../services/PlanFromToday.js';
// The day of the run's pots, for the Decision tool's ladder month (index.html ladderPositionForPlan; LadderPosition potsDay).
export { potsDayOf } from '../services/PlanFromToday.js';

/** 'YYYY-MM' in the Timing block's month box when it fits the choice (a past or this month for "I have stopped work", a later one for "I will stop work"), else null. */
export function stopMonthFromForm(doc, future, now = new Date()) {
  const v = stoppedWorkOf({ stoppedWork: doc.getElementById('tmStopMonth')?.value || '' });
  if (!v) return null;
  return future === !hasStopped(v, now) ? v : null;
}

/** The age reached by the end of a 'YYYY-MM' month, from the Timing block's age box (the age the plan reckons with). */
function ageAtMonthEnd(doc, base, ym) {
  const [y, m] = ym.split('-').map(Number);
  return ageOnDate({ currentAge: +doc.getElementById('tmAge')?.value || 0, currentAgeAsOf: base.currentAgeAsOf, spStartDate: doc.getElementById('ssSpStartDate')?.value?.trim() || base.spStartDate }, new Date(y, m, 0));
}

/**
 * The month box's handlers, on `win` (the page's inline handlers call them by name). A month just typed for someone who has
 * stopped starts the plan's income in its tax year (`win._tmStartFromStop`, read by the form) until another year is chosen;
 * for a stop to come, the age box shows the age reached by that month's end; an age typed by hand that disagrees with the
 * month clears the month.
 */
export function installStopMonth(win, doc) {
  win._tmStartFromStop = false;
  const base = () => win._ssTimingBase || {};
  win.tmStopMonthChanged = function () {
    const future = !!doc.getElementById('tmFuture')?.checked;
    const v = stopMonthFromForm(doc, future);
    if (future && v) { const a = ageAtMonthEnd(doc, base(), v); if (a > 0) doc.getElementById('tmRetireAge').value = a; }
    win._tmStartFromStop = !future && !!v;
    return win.renderTiming();
  };
  win.tmRetireAgeTyped = function () {
    const v = stopMonthFromForm(doc, true);
    if (v && doc.getElementById('tmFuture')?.checked && ageAtMonthEnd(doc, base(), v) !== +doc.getElementById('tmRetireAge').value) doc.getElementById('tmStopMonth').value = '';
    return win.renderTiming();
  };
  win.tmStartYearChanged = function () { win._tmStartFromStop = false; return win.renderTiming(); };
  win.paintGiltCashDial = () => paintGiltCashDial(doc);
}

/**
 * After the Timing block is derived: the month box's label follows the choice; a month that does not fit the choice is
 * said in front of the summary (never saved); the ladder's extra cash in its money-market fund is offered only while the
 * engines read it (§6 decision 8; PlanFromToday.runUpCashSpent) and only on a plan that holds some (paintGiltCashDial): a
 * draft is judged on the form as it stands, its pots being today's; a locked plan on the position its lock recorded (the
 * settings it was loaded with). Returns the summary.
 */
export function paintStopMonth(doc, t, s, summary, locked = false, now = new Date()) {
  const typed = stoppedWorkOf({ stoppedWork: doc.getElementById('tmStopMonth')?.value || '' });
  const label = doc.getElementById('tmStopLabel');
  if (label) label.textContent = t.mode === 'future' ? 'Or the month you stop work' : 'The month you stopped work';
  const wrap = doc.getElementById('giltBridgeWrap');
  if (wrap) wrap.dataset.spent = bridgeCashSpent(t, s, locked, now) ? '1' : '';
  paintGiltCashDial(doc);
  if (typed && !s.stoppedWork) return (t.mode === 'future' ? 'That month has passed: choose “I have stopped work” if you have. ' : 'That month is still ahead: choose “I will stop work” for a stop to come. ') + summary;
  return summary;
}

/**
 * The ladder's extra cash dial (7.3.3): shown only on a plan that holds some (above £0) and while the engines read it. It is
 * an older plan's setting — a new plan has nothing to set there — so it is never offered empty. Called when the Timing block
 * is painted and when a ladder's dials are filled from the saved settings.
 */
export function paintGiltCashDial(doc) {
  const wrap = doc.getElementById('giltBridgeWrap');
  if (wrap) wrap.style.display = !wrap.dataset.spent && +(doc.getElementById('giltBridge')?.value || 0) > 0 ? 'flex' : 'none';
}

/** Is the ladder's extra cash spent (not read) for the Timing block's plan (paintStopMonth)? */
export function bridgeCashSpent(t, s, locked = false, now = new Date()) {
  const settings = s || {};
  return runUpCashSpent(locked ? settings : { ...settings, potsAsOf: draftPotsAsOf(settings, now) }, t);
}

/**
 * The setup wizard's month work stopped or stops, when given and it fits "Already retired": the timing it adds (the month,
 * and for a stop to come the age reached by its end), and how many years year 0 moves back so the plan keeps its end age.
 * "Pick up from here" keeps writing this tax year whenever work stopped (research/plan-start.md §2 F).
 * @returns {{ extra: object, retireAge: number|null, movedBack: (timing) => number }}
 */
export function wizardStop(wizardData, { cur, retire, alreadyRetired, today, now = new Date() }) {
  const stop = stoppedWorkOf({ stoppedWork: wizardData && wizardData.stopMonth });
  const fits = !!stop && (alreadyRetired ? hasStopped(stop, now) : !hasStopped(stop, now));
  let retireAge = alreadyRetired ? null : retire;
  if (fits && !alreadyRetired && cur > 0) { const [y, m] = stop.split('-').map(Number); retireAge = ageOnDate({ currentAge: cur, currentAgeAsOf: today }, new Date(y, m, 0), now) || retire; }
  const moved = (timing) => (timing && alreadyRetired && fits && !wizardData.pickUp ? Math.max(0, taxYearStartOf(now) + 1 - timing.firstTaxYear) : 0);
  return { extra: fits ? { stoppedWork: stop } : {}, retireAge, movedBack: moved };
}

/**
 * Is a saved Decision record before the plan's income starts? From the plan's year 0 as it is now (`anchor`), and from the
 * mark stamped on the record only when there is no anchor: a plan whose year 0 moved back to the tax year work stopped has
 * months that were stamped as before the start and are plan months now.
 */
export function recordBeforeStart(h, anchor) {
  if (anchor > 0 && h && h.taxYear) return planYearOf(h.taxYear, anchor) < 0;
  return !!h && h.bridgeYear === true;
}

/**
 * "Year N" for a saved Decision record (6.4.2; 6.51.0). A month before year 0 — only on a plan stored with its start later
 * than it should be, which shows the move of its start as its to-do — is read by its month and tax year (7.3.3).
 */
export function recordYearLabel(h, anchor) {
  if (recordBeforeStart(h, anchor)) {
    const parts = [h && h.date ? monthName(String(h.date).slice(0, 7)) : '', h && /^\d\d\/\d\d$/.test(String(h.taxYear || '')) ? 'tax year 20' + h.taxYear : ''].filter(Boolean);
    const words = parts.join(' · ');
    return words.charAt(0).toUpperCase() + words.slice(1);
  }
  const y = anchor > 0 && h && h.taxYear ? planYearOf(h.taxYear, anchor) : ((h && h.yearNum) || 0);
  return 'Year ' + y;
}

/**
 * Where a gilt ladder's month was paid from, as the record says it — unless the record was stamped before the plan's year 0
 * and the plan's year 0 now says it is a plan month (its stamped words would name the old start), or its stamped words are
 * the old start's own ("SIPP cash (the plan's year 0 is …)", before 6.51.0): those are read in neutral words, as stored.
 */
export function recordSourceWords(h, anchor, before, otherwise) {
  const stale = !!h && ((h.bridgeYear === true && !recordBeforeStart(h, anchor)) || String(h.strategySource || '').startsWith('SIPP cash (the plan'));
  if (h && h.strategySource && !stale) return h.strategySource;
  return recordBeforeStart(h, anchor) ? before : otherwise;
}

/**
 * Plan vs actual's row for a year lived before the plan was locked (6.50.0): its draws against the plan's own figure for
 * the year; no tax or ISA yardstick, because the pots at that year's start were never entered (research/plan-start.md §6,
 * decision 7) — "—", never £0.
 */
export function livedYearRowHtml(y, recs, plan, gbp) {
  const avg = recs.reduce((t, h) => t + (h.sipp || 0), 0) / recs.length, pm = (+plan.sippDraw || 0) / 12, dd = avg - pm;
  return '<tr><td>Year ' + y + ' <span class="hint">(' + recs.length + ' mo; lived before the plan was locked)</span></td><td>' + gbp(Math.round(pm)) + '/mo</td><td>' + gbp(Math.round(avg)) + '/mo <span class="hint">(' + (dd >= 0 ? '+' : '−') + gbp(Math.round(Math.abs(dd))) + ')</span></td><td>—</td><td>—</td><td>—</td></tr>';
}

/**
 * Plan vs actual's row for plan year `y` (index.html renderPlanVsActual), against the plan of record's year `plan`: a year
 * lived before the plan was locked, the draw only (livedYearRowHtml); else the draw, the tax and the ISA. The first plan
 * year the tax-year wizard set up (`firstSetUpYear`) may be a part year, set up mid-year (`tyCfg`, its tax year's set-up:
 * `remainingMonths`): it is measured on its own months, not annualised — the wizard's expected tax over the months left
 * against the tax paid so far. It is "a 9-month first year" only when it is the plan's year 0: a plan whose year 0 is an
 * earlier tax year (6.51.0, or a start moved back under its lock, 6.53.0) has its part year later, in its own tax year.
 */
export function yearRowHtml(y, recs, plan, tyCfg, firstSetUpYear, gbp) {
  if (plan.lived) return livedYearRowHtml(y, recs, plan, gbp);
  const partialMonths = (y === firstSetUpYear && tyCfg && tyCfg.remainingMonths > 0 && tyCfg.remainingMonths < 12) ? tyCfg.remainingMonths : 0;
  const partialPlannedTax = partialMonths ? ((tyCfg.expectedMonthly?.sipp?.tax || 0) + (tyCfg.expectedMonthly?.other?.tax || 0) + (tyCfg.expectedMonthly?.statePension?.tax || 0)) * partialMonths : 0;
  const actAvgSipp = recs.reduce((t, h) => t + (h.sipp || 0), 0) / recs.length;
  const actTax = recs.reduce((t, h) => t + (h.taxPaidMonthly || h.monthlyTax || 0), 0);
  const lastIsaVal = recs[recs.length - 1].isaBalance ?? null;
  const planMonthly = plan.sippDraw / 12;
  const drawDelta = actAvgSipp - planMonthly;
  const fmtD = (d) => (d >= 0 ? '+' : '−') + gbp(Math.round(Math.abs(d)));
  const part = partialMonths ? (y === 0 ? ' of a ' + partialMonths + '-month first year' : ' of the ' + partialMonths + ' months set up for this tax year')
    : (y === firstSetUpYear && recs.length < 12 ? ' — partial year: planned figures are for a full year' : '');
  return '<tr><td>Year ' + y + ' <span class="hint">(' + recs.length + ' mo' + part + ')</span></td>'
    + '<td>' + gbp(Math.round(planMonthly)) + '/mo</td>'
    + '<td>' + gbp(Math.round(actAvgSipp)) + '/mo <span class="hint">(' + fmtD(drawDelta) + ')</span></td>'
    + (partialMonths
      ? '<td>' + gbp(Math.round(partialPlannedTax)) + '<span class="hint"> for ' + partialMonths + ' mo</span></td>'
        + '<td>' + gbp(Math.round(actTax)) + '<span class="hint"> so far (' + recs.length + ' mo)</span></td>'
      : '<td>' + gbp(Math.round(plan.tax)) + '</td>'
        + '<td>' + gbp(Math.round(actTax * (12 / recs.length))) + '<span class="hint">/yr pace</span></td>')
    + '<td>' + gbp(Math.round(plan.isaBalance)) + (lastIsaVal != null ? ' <span class="hint">vs ' + gbp(Math.round(lastIsaVal)) + '</span>' : '') + '</td></tr>';
}

/**
 * Plan vs actual's note on months recorded before year 0: only on a plan stored with its start later than it should be (until
 * 6.51.0 a retired person's plan started at the next April). They are not compared with a later year's figure: the note
 * says where they are and points to the one thing to do, the move of the start (the banner at the top of the page).
 */
export function beforeStartNoteHtml(n, anchor) {
  if (!(n > 0) || !(anchor > 0)) return '';
  return '<p class="hint" style="margin-top:6px;">Your plan is set to start in ' + taxYearLabel(anchor) + ': ' + n + ' month' + (n === 1 ? '' : 's') + ' recorded since you stopped work ' + (n === 1 ? 'is' : 'are') + ' not in this table until its start is moved (the banner at the top of the page does it).</p>';
}

/**
 * The first plan year the tax-year wizard set up (plan vs actual's part year, a mid-year start): year 0 for a plan set up
 * from its start; a later year for one whose year 0 was in an earlier tax year (6.51.0). 0 when none is set up.
 */
export function firstSetUpPlanYear(taxYears, anchor) {
  const ys = Object.keys(taxYears || {}).filter((k) => taxYears[k] && taxYears[k].yearSetupComplete).map((k) => (anchor > 0 ? planYearOf(k, anchor) : NaN)).filter((y) => Number.isFinite(y) && y >= 0);
  return ys.length ? Math.min(...ys) : 0;
}

// ---- A locked plan's start (6.53.0, research/plan-start.md §4 "Migration of existing plans") -----------------------------

const pounds = (v) => '£' + Math.round(+v || 0).toLocaleString('en-GB');
const plural = (n, one, many) => n + ' ' + (n === 1 ? one : many);

/**
 * The month box a locked plan's line asks with, or changes the month with (the ids saveLockedStopMonth reads). A `row-flex`
 * row, so the box is drawn as the Timing block's own are, dark mode included.
 */
function stopMonthBox(value, label = 'The month you stopped work') {
  return '<div class="row-flex" style="align-items:flex-end;"><label class="hint" style="display:flex;flex-direction:column;gap:2px;">' + label + '<input type="month" id="tmLockedStopMonth" style="width:160px;"' + (value ? ' value="' + value + '"' : '') + '></label>'
    + '<button type="button" id="tmLockedStopSave" data-on-click="saveLockedStopMonth()">Save</button>';
}
/** A folded month box under `summary`. */
const foldedStopHtml = (id, summary, value, label) => '<details class="hint" id="' + id + '" style="margin-top:4px;"><summary>' + summary + '</summary><div style="margin-top:6px;">' + stopMonthBox(value, label) + '</div></div></details>';
/**
 * "Change the month you stopped work", folded: a month typed wrongly can be put right while the plan is locked. Its box is
 * "The right month": the frozen form above still shows the month saved, under "The month you stopped work".
 */
const changeStopHtml = (stopped) => (stopped ? foldedStopHtml('tmLockedStopChange', 'Change the month you stopped work', stopped, 'The right month') : '');
/** "Say when you stopped work", folded: after "Leave it" the question is not asked again, but the month can still be said. */
const laterStopHtml = () => foldedStopHtml('tmLockedStopLater', 'Say when you stopped work', null, 'The month you stopped work');

/**
 * The line under a LOCKED plan's Timing summary (the form above it is frozen; this line is not). `ask`: the plan does not
 * say when work stopped (PlanMove.stopAskOf) — the question, once, with Save and "Leave it" (remembered). `offer`
 * (PlanMove.moveOfferOf): it does, and that tax year is earlier than the plan's first — the action, with what it does to the
 * income said plainly (§6 decision 4): the steps' words only for income in steps (`stepped`), else the yearly figure
 * (`income`). `blocked` (PlanMove.moveBlockedOf): the start cannot be moved under the lock, and why. `stopped`: the month
 * the plan says, which stays changeable ("Change the month you stopped work"). `left` (PlanMove.stopLeftOf): "Leave it" was
 * said and no month — the month can still be said ("Say when you stopped work"). '' for none of them. While the line asks
 * (`ask` or `left`), the Timing form's own month box, frozen and empty, is hidden (lockedStartUi.js), so one box asks.
 * @param {{ ask?: boolean, start?: number|null, offer?: { stopMonth, from, to }|null, stepAge?: number|null, stepped?: boolean,
 *   income?: number|null, blocked?: { stopMonth, from }|null, stopped?: string|null, left?: boolean }} o
 *   `start`: the plan's first tax year now; `stepAge`: the age the plan's income starts at after the move
 */
export function lockedStartHtml({ ask = false, start = null, offer = null, stepAge = null, stepped = true, income = null, blocked = null, stopped = null, left = false } = {}) {
  if (offer) {
    const at = taxYearLabel(offer.to) + (stepAge > 0 ? ', at ' + stepAge : '');
    return '<p class="hint" style="margin:0 0 6px;">You stopped work in ' + monthName(offer.stopMonth) + ', and your plan is set to start in ' + taxYearLabel(offer.from) + '. '
      + '<strong>Start it from ' + taxYearLabel(offer.to) + '</strong>, the tax year you stopped: your months since then are read against the plan. '
      + (stepped ? 'Your first income step keeps its amount and runs from ' + at + '; your later steps keep their ages.' : 'Your income stays ' + (income > 0 ? pounds(income) + ' a year' : 'as it is') + ', now from ' + at + '.')
      + ' The plan stays locked.</p>'
      + '<div style="display:flex;gap:8px;flex-wrap:wrap;"><button type="button" id="tmMoveStartBtn" data-on-click="moveLockedPlanStart()">Move the plan\'s start…</button></div>'
      + changeStopHtml(stopped);
  }
  if (blocked) {
    return '<p class="hint" style="margin:0 0 6px;">You stopped work in ' + monthName(blocked.stopMonth) + ', and your plan is set to start in ' + taxYearLabel(blocked.from) + '. '
      + 'Its start cannot be moved while the plan is locked: your State Pension is set by the plan\'s count of years, and moved it would read as starting at 67. To change the start, unlock the plan.</p>'
      + changeStopHtml(stopped);
  }
  if (!ask) return stopped ? changeStopHtml(stopped) : left ? laterStopHtml() : '';
  return '<p class="hint" style="margin:0 0 6px;"><strong>When did you stop work?</strong> The plan stays locked, and saying the month changes no figure by itself.'
    + (start > 0 ? ' Your plan is set to start in ' + taxYearLabel(start) + '; once the month is said, it can start from the tax year you stopped.' : '') + '</p>'
    + stopMonthBox(null)
    + '<button type="button" class="secondary" id="tmLockedStopLeave" data-on-click="leaveLockedStopMonth()">Leave it</button></div>';
}

/** Why a month typed for a locked plan's stop is refused (about.js lockedStopAnswer's errors), in the planner's words. */
export const LOCKED_STOP_REFUSED = Object.freeze({
  required: 'Type the month you stopped work, like 2023-10.',
  notAMonth: 'Type the month you stopped work, like 2023-10.',
  'month-ahead': 'That month is still ahead: type the month you stopped, this one or an earlier one.',
  'too-early': 'That is before you were 16: check the year.'
});

/** The State Pension's start, before and after a move, in the plan's count of years (PlanMove.spCountOf, where it lives with the move's other facts). */
export { spCountOf } from '../services/PlanMove.js';

/**
 * The action's confirm (index.html moveLockedPlanStart, as the unlock's: exactly what changes). `move` is PlanMove.planMoveOf;
 * `facts`: what the plan holds, read before (PlanMove.moveFactsOf, the same facts the preview's confirm states) — the first
 * income step's amount (or the yearly income), whether the income is in steps, the plan's end age, the recorded months and
 * the tax year the run starts in, whether its way of drawing buys
 * a gilt ladder, and the State Pension's count (spCountOf).
 * @param {object} move
 * @param {{ stepAmount?: number|null, stepped?: boolean, endAge?: number|null, months?: string[],
 *   runYear?: number|null, ladder?: boolean, dated?: boolean, sp?: { taxYear: number, before: number|null, after: number }|null }} facts
 * @returns {{ html: string, okLabel: string, cancelLabel: string }}
 */
export function moveStartQuestion(move, { stepAmount = null, stepped = true, endAge = null, months = [], runYear = null, ladder = false, dated = false, sp = null } = {}) {
  const to = taxYearLabel(move.to), from = taxYearLabel(move.from);
  const age = move.stress && +move.stress.shapeAgeNow > 0 ? +move.stress.shapeAgeNow : null;
  const li = [];
  li.push('<li><strong>The plan\'s first tax year becomes ' + to + '</strong>, the tax year you stopped work (' + monthName(move.stopMonth) + '); it was ' + from + '. Both tools read the new start. The plan stays locked: nothing is unlocked and no setting is added.</li>');
  const ends = endAge > 0 ? ' The plan still runs to age ' + endAge + ', ' + plural(move.years, 'year', 'years') + ' longer from its new start.' : '';
  li.push('<li><strong>Your income:</strong> ' + (stepped
    ? 'the first step keeps its amount' + (stepAmount > 0 ? ' (' + pounds(stepAmount) + ' a year)' : '') + ' and now runs from ' + to + (age ? ', at ' + age : '') + '; your later steps keep their ages.'
    : 'it stays ' + (stepAmount > 0 ? pounds(stepAmount) + ' a year' : 'as it is') + ', now from ' + to + (age ? ', at ' + age : '') + '.') + ends + '</li>');
  if (dated) li.push('<li>Your lump sums, one-off spends, other income and final-salary pension keep their tax years.</li>');
  const ms = (Array.isArray(months) ? months : []).slice().sort();
  if (ms.length) {
    const as = ' They now count from the new start, ' + to + '.';
    li.push('<li><strong>' + plural(ms.length, 'recorded month', 'recorded months') + '</strong> (' + monthName(ms[0]) + (ms.length > 1 ? ' to ' + monthName(ms[ms.length - 1]) : '') + ') keep every figure you entered.' + as + '</li>');
  }
  li.push('<li><strong>The plan document and plan vs actual</strong> are written again from the new start, from your pots as they stood when you locked the plan: '
    + (ladder && runYear ? 'the gilt ladder is bought from ' + taxYearLabel(runYear) + ' on, ' : '') + 'no year you have already lived is bought or paid for again. The earlier plan document stays under Previous versions on the plan document page; the earlier plan vs actual is kept with the plan\'s saved figures.</li>');
  const spWords = sp ? 'Your State Pension still starts in ' + taxYearLabel(sp.taxYear) + ', as before; only the plan\'s count of years to it changes (' + sp.after + ' from the new start' + (sp.before != null && sp.before >= 0 ? ', not ' + sp.before : '') + '). ' : '';
  li.push('<li><strong>The figures move:</strong> ' + spWords + 'The plan counts ' + plural(move.years, 'more year', 'more years') + ' to the same end age, and ' + (ladder ? 'the ladder\'s cost leaves out the years already lived.' : 'the years already lived are no longer run again.') + '</li>');
  li.push('<li>Months you did not record since you stopped can then be filled in on Monthly Entry: set each earlier tax year up first, under Tax Years.</li>');
  li.push('<li><strong>Not affected:</strong> what you hold, your Budget, and the tax years you set up.</li>');
  return {
    html: '<h3 style="margin:0 0 10px;">Move the plan\'s start to ' + to + '?</h3><p class="hint" style="margin:0 0 10px;">Here is exactly what changes:</p><ul style="margin:0 0 10px 18px;font-size:13px;line-height:1.5;">' + li.join('') + '</ul>',
    okLabel: 'Move the start to ' + to, cancelLabel: 'Keep it as it is'
  };
}

/** The toast after a move. */
export function moveStartDoneWords(move) {
  return 'The plan\'s start is now ' + taxYearLabel(move.to) + ', the tax year you stopped work. The plan document and plan vs actual were written again; the earlier plan document is under Previous versions.';
}

/**
 * Plan vs actual's heading and closing sentence (index.html renderPlanVsActual). Its yardstick, the plan of record, is
 * frozen when the plan is locked; a move of the plan's start writes it again (moveStart.js: `rewrittenFor`), and then the
 * heading says when, beside the lock's own date, and the closing sentence why it moved.
 * @param {object} por  the plan of record
 * @param {string|null} lockedAt  the Decision settings' lock date
 * @param {(d: Date) => string} day  the page's date words
 */
export function planVsActualWords(por, lockedAt, day) {
  const cpi = (por.assumedCpi * 100).toFixed(0) + '% assumed CPI';
  const at = (v) => day(new Date(v));
  if (!por.rewrittenFor) {
    return { head: '— against the projection frozen when this plan was locked (' + at(por.savedAt) + ', ' + cpi + ')',
      foot: 'The plan of record never moves — that\'s its job. Your monthly recommendations always use your real fund values and entered CPI.' };
  }
  return { head: '— against the projection written again on ' + at(por.savedAt) + ', when the plan\'s ' + por.rewrittenFor + ' (the plan was locked ' + (lockedAt ? at(lockedAt) : 'earlier') + '; ' + cpi + ')',
    foot: 'The plan of record does not move: it was written again only when the plan\'s start moved, from your pots as they stood when you locked the plan. Your monthly recommendations always use your real fund values and entered CPI.' };
}
