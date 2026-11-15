/**
 * The plan's home (7.3.0; research/v7/one-product-design.md, "The plan home" and "The to-do reader"): what a person carrying
 * out a plan comes back to — what is due, where they are, then everything else. Read from what the plan already holds;
 * NOTHING is written because a plan was opened, and nothing here is stored (no stage, no to-do list).
 *
 *   homeOf(entries, id, { today, source, page })
 *     → { found, id, name, …, stage, todo, quiet, review, moveWindow, where, drift?, whereFull, year, tools, steps, change, ask }
 *
 * One engine: the to-dos are read.js dueFor's, the very list whose first item is the rail's "Next" (planPage `due`), so
 * the two can never disagree. A partner's plan adds its own month and tax year (never its figures), named by that plan's
 * name, after the plan's own, in ONE list of which the home shows one (7.10.0, research/v7/replan-nov-2026.md §6.4: the
 * phase, the next review and at most one thing due). The year view is the current tax year's twelve months from the plan's own records
 * (decisionTool.history), against the plan document's figure for the year, a twelfth a month (whereAmI, as "Where you are"
 * reads it). Words are src/v7/copy/home.js's under the ids here.
 *
 * Pure: no clock (the day arrives as `today`), no storage.
 */
import { planPage, dateOf, monthWords, monthName } from './read.js';
import { whereAmIFor, historyAscending, moveInputs, effectiveStressSettings } from '../../services/PlanReading.js';
import { driftOf, DRIFT_BAND } from '../../services/TransitionPlanner.js';
import { monthsWanted } from '../../services/DrawCadence.js';
import { gapsOf, gapHeadline } from './gaps.js';
import { taxYearStartOf, taxYearKey, taxYearLabel, earlyPensionDrawOf } from '../../services/PlanTiming.js';
import { readDayOf } from '../../services/PlanClosed.js';
import { isFilledIn } from '../../services/MonthFill.js';
import { holdingsSummary, normaliseHoldings } from '../../services/HoldingsRecord.js';
import { moveWindowOf } from '../../services/Phases.js';
import { asHeldStateOf } from './agree.js';
import { ym, dayWords } from './dates.js';
import { startLaterOf } from '../../services/PlanMove.js';
import { pensionLockForSettings } from '../../services/PlanNeed.js';
import { closedYearsShort, shortYearsWords } from '../../services/PensionLock.js';

/**
 * A plan that starts before its pension can usually be taken (7.4.0, PlanTiming.earlyPensionDrawOf): the age, for the line
 * the home says beside the plan's draws — and (7.4.1) when the other savings cannot pay those years in full, by how much a
 * year and in which years (`short`), read from the closed years as the plan's run sees them (PlanNeed.pensionLockForSettings,
 * the very figures the "Does it last?" step and the planner say), so the home never says the savings pay what they cannot.
 * Null for a closed plan, and for every other plan.
 */
export function pensionAccessOf(plan, pg, now) {
  if (!plan || (pg && pg.closed)) return null;
  let s = null; try { s = effectiveStressSettings(plan, { now }); } catch { s = null; }
  let e = null; try { e = earlyPensionDrawOf(s, now); } catch { e = null; }
  let lock = null; try { lock = pensionLockForSettings(s, now); } catch { lock = null; }
  const short = lock ? closedYearsShort(lock) : null;
  if (short) return { age: String(lock.accessAge), short: { amount: '£' + short.perYear.toLocaleString('en-GB'), years: shortYearsWords(short) } };
  return e ? { age: String(e.age) } : null;
}

/** At most this many to-dos are shown at once — the plan's own and a partner's in one list; the rest are "and N more" (7.10.0). */
export const TODO_SHOWN = 1;
/**
 * A partner's to-dos that reach this home: the month and the tax year — never that plan's age, review or link, whose words
 * speak to the person whose plan it is ("Add your age", "Your review"). A partner's item is never put away here: a dismissal
 * stored on the partner's plan hides it here too (their reading reads their `tasks`).
 */
const PARTNER_IDS = ['month.taxYear', 'month.arrive', 'month.record', 'month.gap'];
/**
 * "Where you are" on the home is the headline, not the whole reading: the result sentence and at most this many of its
 * lines, chosen below; the full reading, with where each figure is from, is one link away on the "Where you are" step.
 */
export const WHERE_LINES = 3;
/** The lines the home shows, in this order: like with like (taken against what the plan said), the pot and its middle line. */
const WHERE_HEADLINE = ['where.startLater', 'where.compareLess', 'where.compareLessCut', 'where.compareMore', 'where.compareSame', 'where.pot', 'where.potMid', 'where.ladderMonthly'];
/** The tools a home lists, by stage, in order (each a step of the plan with its one-line state). */
const TOOLS = {
  saving: ['checkin', 'saving', 'budget', 'hold', 'household'],
  // someone in their move window still pays in (7.10.0): the check-in first, where it is on the plan's list
  moving: ['checkin', 'move', 'hold', 'budget', 'household'],
  drawing: ['month', 'move', 'hold', 'budget', 'household'],
  closed: ['month'],
  none: ['budget', 'hold', 'household']
};
/** The questions a home offers with the plan's figures, by stage (B and A for a saver; C and D moving; D drawing). */
const ASK = { saving: ['b', 'a'], moving: ['c', 'd'], drawing: ['d'], closed: [], none: [] };
const STRIP = ['saving', 'moving', 'drawing'];

const addMonth = (m, n) => { const p = ym(m); if (!p) return null; const t = p.y * 12 + (p.m - 1) + n; return Math.floor(t / 12) + '-' + String((t % 12) + 1).padStart(2, '0'); };
const thisMonthOf = (now) => now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
const first = (m) => '1 ' + monthName(m);

/**
 * The three segments of the stage strip: each done, now or later, with the month it ends or begins when the plan says it. What
 * is held never marks the move part-done (7.10.0): how far it is from the plan's mix is an information line, never the stage.
 */
function stripOf(life) {
  if (!life || !life.key || life.key === 'closed') return null;
  const at = STRIP.indexOf(life.key);
  return STRIP.map((key, i) => ({ key, state: i < at ? 'done' : i === at ? 'now' : 'later',
    // saving ends where the move window opens (7.10.0), or at the stop when no window is read
    month: key === 'saving' && moveWindowOf(life) && moveWindowOf(life).from ? monthWords(moveWindowOf(life).from) : key === 'saving' && life.stop ? monthWords(life.stop) : key === 'drawing' && life.key === 'drawing' && life.since ? monthWords(life.since) : null }));
}

/**
 * The line that says nothing is due, always with the date something next will be (never "nothing to do" alone): the next
 * review, or that a review can be had whenever the person likes (7.10.0); on a plan living on its money and recording its
 * months, this month recorded and the 1st of the first month not recorded after it (a quarter or a year recorded at once
 * reaches ahead: the plan's own cadence); a plan not locked yet, that its months wait for the lock; a closed plan where it
 * carries on. Only ever a true sentence: null while something is due (the list says so then).
 */
function quietOf(page, life, now, { review, anyDue, wanted, recordMonths }) {
  const mon = thisMonthOf(now);
  if (!life || !life.key) return null;
  if (life.key === 'closed') {
    const c = page.closed || {};
    return c.next ? { id: 'closed', slots: { month: c.month || '', name: c.next.name } } : { id: 'closedAlone', slots: { month: c.month || '' } };
  }
  if (anyDue) return null;
  const rv = review && review.next ? { id: 'review', slots: { month: review.next } } : { id: 'reviewAny', slots: {} };
  if (life.key !== 'drawing') return rv;
  if (!page.locked) return recordMonths === false ? { id: 'reviewAny', slots: {} } : { id: 'draft', slots: {} };
  const latest = page.lastRecord || null;
  // the months' own line only while the plan records its months here and this month is recorded; else the review's date
  if (wanted && latest && latest >= mon) return { id: 'drawing', slots: { month: monthName(latest), next: first(addMonth(latest, 1)) } };
  return rv;
}

/** What a bucket is called on the home's drift line. */
const BUCKETS = ['shares', 'bonds', 'cash', 'diversifiers'];

/**
 * How far what is held is from the plan's mix (7.10.0, spec-7100 §3.2), on a plan living on its money: information, never a
 * to-do and never a sale — the bucket furthest from the plan's mix when it is more than DRIFT_BAND of the pension away, or on
 * a ladder a gilt needed this tax year or next that is not held. Read on the plan's document, or (not locked yet) on the
 * plan's settings in memory (PlanReading.moveInputs `fromSettings`). Null otherwise.
 */
function driftLineOf(plan, now, href) {
  let mv = null; try { mv = moveInputs(plan, { now, fromSettings: true }); } catch { mv = null; }
  const d = mv && mv.diff ? driftOf(mv.diff) : null;
  if (!d) return null;
  if (d.kind === 'buckets') {
    if (!(d.maxDrift > DRIFT_BAND * 100)) return null;
    const bucket = BUCKETS.reduce((best, k) => (Math.abs(d.drift[k] || 0) > Math.abs(d.drift[best] || 0) ? k : best), BUCKETS[0]);
    const x = mv.diff.buckets[bucket] || { held: 0, target: 0 };
    const inPlay = mv.diff.inPlay;
    return { kind: 'buckets', bucket, held: Math.round(100 * (+x.held || 0) / inPlay), plan: Math.round(100 * (+x.target || 0) / inPlay), href };
  }
  if (d.kind === 'ladder' && d.gapSoon) {
    const thisTY = Number(mv.target && mv.target.thisTaxYear);
    const ys = (mv.diff.buy || []).filter((b) => b.kind === 'gilt' && Array.isArray(b.taxYears)).flatMap((b) => b.taxYears.map(Number)).filter((Y) => Y === thisTY || Y === thisTY + 1).sort((p, q) => p - q);
    return ys.length ? { kind: 'ladder', year: taxYearLabel(ys[0]), href } : null;
  }
  return null;
}

/**
 * The move window, said on the home (7.10.0): inside it, how long is left to the month work stops (and, with no record of
 * what is held, that it can be recorded when the person likes); once what is held is accepted, that, and the stop; a saver
 * before it, the month it opens. Null with no month to stop in, and on a plan asked whether work has stopped.
 */
function windowLineOf(life, { held, agreed }) {
  const w = moveWindowOf(life);
  if (!w || !w.to || life.confirmStop) return null;
  const left = Number.isFinite(w.monthsLeft) ? (w.monthsLeft === 1 ? '1 month' : w.monthsLeft + ' months') : '';
  if (life.key === 'moving') {
    if (agreed) return { id: 'agreed', slots: { date: dayWords(agreed.at), stop: monthWords(w.to) } };
    return { id: held ? 'moving' : 'movingNoRecord', slots: { left, stop: monthWords(w.to) } };
  }
  if (life.key === 'saving' && w.state === 'before' && w.from) return { id: 'saving', slots: { from: monthWords(w.from) } };
  return null;
}

/**
 * The year view (the record keeper's picture): the twelve months of the tax year the plan is read in (a closed plan's, its
 * last), each recorded, filled in later, due, the year's set-up, or still to come; what was drawn that month (pension,
 * other income and State Pension before tax, as "Where you are" adds them) against the plan's own monthly figure, both as a
 * share of the tallest so the cells are drawn to scale. Null for a plan that does not record months.
 */
function yearOf(plan, page, now) {
  if (!page.locked || !['running', 'closed'].includes(page.stageKey)) return null;
  // a plan stored the old way (PlanMove.startLaterOf) whose year 0 is still later than this tax year: this year's figure is
  // a later year's, so no month is set against it (read.js whereStep reads it the same way)
  let older = false; try { const sl = startLaterOf(plan, now); older = !!sl && sl.start > taxYearStartOf(now); } catch { older = false; }
  const day = readDayOf(plan, now);
  const ty = taxYearStartOf(day);
  const key = taxYearKey(ty);
  const hist = historyAscending(plan);
  const byMonth = new Map(hist.map((h) => [String(h.date).slice(0, 7), h]));
  let perMonth = null;
  try { const w = older ? null : whereAmIFor(plan, { now }); perMonth = w && w.incomeThisYear ? w.incomeThisYear.perMonth : null; } catch { perMonth = null; }
  const cfg = plan.decisionTool && plan.decisionTool.taxYears ? plan.decisionTool.taxYears[key] : null;
  const setUp = !!(cfg && cfg.yearSetupComplete);
  const setUpMonth = setUp ? addMonth(ty + '-04', ((Number(cfg.startMonth) || 4) + 8) % 12) : null;
  const monthStep = page.steps.find((s) => s.id === 'month');
  const due = page.stageKey !== 'closed' && monthStep && !monthStep.recorded ? monthStep.toRecord : null;
  const mon = thisMonthOf(now);
  const cells = [];
  for (let i = 0; i < 12; i++) {
    const m = addMonth(ty + '-04', i);
    const h = byMonth.get(m) || null;
    const drawn = h ? Math.round((+h.sipp || 0) + (+h.other || 0) + (+h.state || 0)) : null;
    const state = h ? (isFilledIn(h) ? 'filled' : 'recorded') : m === due ? 'due' : m === setUpMonth ? 'setUp' : m > mon ? 'later' : 'none';
    cells.push({ month: m, name: monthName(m), words: monthWords(m), state, drawn, plan: h && perMonth != null ? perMonth : (perMonth != null && state !== 'none' ? perMonth : null) });
  }
  const top = Math.max(1, ...cells.map((c) => Math.max(c.drawn || 0, c.plan || 0)));
  for (const c of cells) {
    c.drawnPct = c.drawn != null ? Math.round((c.drawn / top) * 70) : null;
    c.planPct = c.plan != null ? Math.round((c.plan / top) * 70) : null;
  }
  return { year: taxYearLabel(ty), key, setUp, perMonth, cells, recorded: cells.filter((c) => c.state === 'recorded' || c.state === 'filled').length };
}

/**
 * A to-do as the home draws it: the design's id, the P.* id, its words' slots, the button, and — when it may be put away —
 * the buttons that do it (`dismiss`) and the key the dismissal is stored under on the plan (`key`, answers/plan/tasks.js).
 */
const item = (d, extra = {}) => ({ id: d.id, pid: d.pid, slots: d.slots, button: d.button, ...(d.dismiss ? { dismiss: d.dismiss, key: d.key } : {}), ...(d.soon ? { soon: true } : {}), ...extra });

/**
 * Everything the plan's home draws. `page` may be the planPage reading already made for this plan at its own address (the
 * plan source has it); without it, it is read here.
 */
export function homeOf(entries, id, { today, source = 'account', page = null } = {}) {
  const pg = page && page.found && String(page.id) === String(id) ? page : planPage(entries, id, null, { today, source });
  if (!pg.found) return { found: false, id: String(id || '') };
  const now = dateOf(today);
  const list = (entries || []).filter((e) => e && e.plan && typeof e.plan === 'object' && e.plan.id != null);
  const plan = list.find((e) => String(e.plan.id) === String(id)).plan;
  const life = pg.life || null;
  const stageKey = life && life.key ? life.key : 'none';
  const hist = historyAscending(plan);
  const lastRecord = hist.length ? String(hist[hist.length - 1].date).slice(0, 7) : null;
  const due = (pg.due || []).map((d) => item(d));
  // the partner's plan(s): their month and tax year, one line each, named by the plan (never its figures), after the plan's
  // own in the one list; put away on their own plan, never here
  const partner = [];
  if (!pg.readonly) {
    const mine = plan.household && typeof plan.household.partnerScenarioId === 'string' ? plan.household.partnerScenarioId : null;
    for (const e of list) {
      if (String(e.plan.id) === String(id)) continue;
      const linked = String(e.plan.id) === mine || (e.plan.household && e.plan.household.partnerScenarioId === String(plan.id));
      if (!linked || pg.closed) continue;
      const their = planPage(list, e.plan.id, null, { today, source });
      if (!their.found || their.closed) continue;
      for (const d of their.due || []) if (PARTNER_IDS.includes(d.id)) { const { dismiss, key, ...rest } = item(d, { planId: String(e.plan.id), name: their.name }); void dismiss; void key; partner.push(rest); }
    }
  }
  const all = [...due, ...partner];
  // the review (7.10.0): when it is next, whether it is due, and where it is
  const rd = pg.reviewDue || null;
  const review = rd && stageKey !== 'none' ? { next: rd.next ? monthWords(rd.next.slice(0, 7)) : null, due: !!rd.due, href: rd.href } : null;
  const recorded = holdingsSummary(normaliseHoldings(plan.holdings)).count > 0;
  // what is held differently from the plan's mix, on a plan living on its money: one information line, never a to-do
  // (never once what is held was accepted as the plan and still stands: answers/plan/agree.js asHeldStateOf)
  let accepted = false; try { accepted = asHeldStateOf(plan, { today }).status === 'agreed'; } catch { accepted = false; }
  const drift = stageKey === 'drawing' && recorded && !pg.readonly && !pg.closed && review && !accepted ? driftLineOf(plan, now, review.href) : null;
  const dt = plan.decisionTool && typeof plan.decisionTool === 'object' ? plan.decisionTool : {};
  const stepOf = (sid) => pg.steps.find((s) => s.id === sid) || null;
  // where you are, as a headline: the saver's reading against the path (or the last check-in); a moving plan's share of the
  // mix held, then its months; a drawing plan's months against the plan — each the result and a few chosen lines, the full
  // reading on the "Where you are" step
  const where = [];
  let cut = false;
  const add = (sid, { result = true, ids = WHERE_HEADLINE } = {}) => {
    const s = stepOf(sid);
    if (!s || !s.result) return;
    const all = s.lines || [];
    const room = Math.max(0, WHERE_LINES - where.reduce((n, b) => n + b.lines.length, 0));
    const lines = ids.map((id) => all.find((l) => l.id === id)).filter(Boolean).slice(0, room);
    if (lines.length < all.length) cut = true;
    if (!result && !lines.length) return;
    where.push({ step: sid, result: result ? s.result : null, lines, figures: s.figures || {} });
  };
  if (stageKey === 'saving') { if (stepOf('where')) add('where', { ids: [] }); else add('checkin', { ids: [] }); }
  else if (stageKey === 'moving') { add('move', { result: false, ids: ['move.held'] }); add('where'); }
  else if (stageKey === 'drawing' || stageKey === 'closed') add('where');
  const whereFull = cut && stepOf('where') ? '#/plan/' + pg.id + '/where' : null;
  let gapLine = null;
  if (!pg.readonly && !pg.closed) { try { const h = gapHeadline(gapsOf(plan, { today })); gapLine = h ? { ...h, Y: String(h.Y), href: '#/plan/' + pg.id + '/hold' } : null; } catch { gapLine = null; } }
  const tools = (TOOLS[stageKey] || TOOLS.none).map(stepOf).filter(Boolean).map((s) => ({ id: s.id, href: '#/plan/' + pg.id + '/' + s.id, result: s.railResult || s.result, figures: s.figures || {} }));
  // the steps, read-only with each result line; a saver's "For later" group stays on a plan not locked, but a locked plan
  // is being carried out: its steps are listed plainly, never marked for later or not done
  const steps = pg.steps.map((s) => ({ id: s.id, href: '#/plan/' + pg.id + '/' + s.id, result: (!pg.locked && s.railResult) || s.result, figures: s.figures || {}, later: !pg.locked && !!s.later, done: s.state === 'done' }));
  // change the plan, or try something: a locked plan's tries change nothing; an unlocked plan's pages change it
  const base = '#/plan/' + pg.id + '/';
  const lived = pg.locked && pg.stageKey === 'running' && !!lastRecord && !pg.closing;
  const change = pg.readonly || pg.closed ? [] : pg.locked
    ? [{ id: 'tryChange', href: base + 'lasts' }, { id: 'tryWay', href: base + 'way' }, { id: 'tryMix', href: base + 'mix' },
      ...(lived && !pg.example ? [{ id: 'moveToNew', href: '#/plans' }, { id: 'backToWork', href: '#/plans' }] : []),
      { id: 'unlock', href: base + 'plan' }]
    : [{ id: 'about', href: base + 'about' }, { id: 'income', href: base + 'income' }, { id: 'spend', href: base + 'spend' }, { id: 'pots', href: base + 'pots' },
      { id: 'lasts', href: base + 'lasts' }, { id: 'way', href: base + 'way' }, { id: 'mix', href: base + 'mix' }, ...(pg.example ? [] : [{ id: 'lock', href: base + 'lock' }])];
  return {
    found: true, id: pg.id, name: pg.name, example: pg.example, readonly: pg.readonly, source: pg.source,
    pensionAccess: pensionAccessOf(plan, pg, now),
    locked: pg.locked, lockedOn: pg.lockedOn, line: pg.line, closing: pg.closing, before: pg.before,
    closed: pg.closed, stageKey: pg.stageKey,
    stage: { key: life ? life.key : null, stop: life && life.stop ? monthWords(life.stop) : null, strip: stripOf(life) },
    // one list (7.10.0): the plan's own to-dos then a partner's, one shown, the rest "and N more"
    todo: { items: all.slice(0, TODO_SHOWN), more: all.slice(TODO_SHOWN), count: all.length, soon: (pg.soon || []).map((d) => item(d)) },
    quiet: quietOf({ ...pg, lastRecord }, life, now, { review, anyDue: all.length > 0, wanted: monthsWanted(dt), recordMonths: dt.recordMonths }),
    // 7.10.0: the next review (never stored: read from the log, the check-ins, the records and the rule), and the move window
    review: pg.readonly || pg.closed ? null : review,
    moveWindow: pg.readonly || pg.closed ? null : windowLineOf(life, { held: recorded, agreed: life && life.agreed ? life.agreed : null }),
    where,
    ...(drift ? { drift } : {}),
    // 7.6.0: the first tax year not yet covered by what is held and kept, once — only on a plan that keeps something
    ...(gapLine ? { gap: gapLine } : {}),
    whereFull,
    year: yearOf(plan, pg, now),
    tools,
    steps,
    change,
    ask: ASK[stageKey] || []
  };
}
