/**
 * The plan's home (7.3.0; research/v7/one-product-design.md, "The plan home" and "The to-do reader"): what a person carrying
 * out a plan comes back to — what is due, where they are, then everything else. Read from what the plan already holds;
 * NOTHING is written because a plan was opened, and nothing here is stored (no stage, no to-do list).
 *
 *   homeOf(entries, id, { today, source, page })
 *     → { found, id, name, …, headLine, stage, todo, quiet, review, moveWindow, where, drift?, whereFull, year, tools, steps, change, ask }
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
import { historyAscending, moveInputs, effectiveStressSettings } from '../../services/PlanReading.js';
import { driftOf, DRIFT_BAND, MOVE_BAND } from '../../services/TransitionPlanner.js';
import { monthsWanted } from '../../services/DrawCadence.js';
import { gapsOf, gapHeadline } from './gaps.js';
import { heldLadder } from './held.js';
import { pounds } from './income.js';
import { taxYearStartOf, taxYearKey, taxYearLabel, earlyPensionDrawOf } from '../../services/PlanTiming.js';
import { readDayOf } from '../../services/PlanClosed.js';
import { partnersOf } from '../../services/HouseholdLink.js';
import { isFilledIn } from '../../services/MonthFill.js';
import { holdingsSummary, normaliseHoldings } from '../../services/HoldingsRecord.js';
import { moveWindowOf } from '../../services/Phases.js';
import { asHeldStateOf } from './agree.js';
import { ym, dayWords, timeLeftWords } from './dates.js';
import { takenAgainstPlan, yearPlanOf, firstPaymentMonth } from '../../services/YearPlan.js';
import { startLaterOf } from '../../services/PlanMove.js';
import { pensionLockForSettings } from '../../services/PlanNeed.js';
import { CONTRACT_STRATEGIES } from '../../services/PlanDocument.js';
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
/**
 * The lines the home shows under the result (which says what was taken against what the plan said, 7.12.0), in this order:
 * the year's plan, the pot and its middle line.
 */
const WHERE_HEADLINE = ['where.startLater', 'where.yearPlan', 'where.pot', 'where.potNoIsa', 'where.potMid', 'where.ladderMonthly'];
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
function stripOf(life, now) {
  if (!life || !life.key || life.key === 'closed') return null;
  const at = STRIP.indexOf(life.key);
  // saving's month is when the person stops work, while that is still to come: once it is past, saving is "done". Never the
  // move window's opening (the walk: a window that opened years before a person stopped read "Saving · to June 2023")
  const stopAhead = life.stop && (!now || life.stop >= thisMonthOf(now)) ? monthWords(life.stop) : null;
  return STRIP.map((key, i) => ({ key, state: i < at ? 'done' : i === at ? 'now' : 'later',
    month: key === 'saving' ? stopAhead : key === 'drawing' && life.key === 'drawing' && life.since ? monthWords(life.since) : null }));
}

/**
 * The line that says nothing is due, always with the date something next will be (never "nothing to do" alone): the next
 * review, or that a review can be had whenever the person likes (7.10.0); on a plan living on its money and recording its
 * months, this month recorded and the 1st of the first month not recorded after it (a quarter or a year recorded at once
 * reaches ahead: the plan's own cadence); a closed plan where it carries on. Only ever a true sentence: null while something
 * is due (the list says so then). Nothing due is only that: a plan not locked yet says the review's line like any other —
 * that its months wait for the lock is said on the Month by month tool, never in To do.
 */
function quietOf(page, life, now, { review, anyDue, wanted }) {
  const mon = thisMonthOf(now);
  if (!life || !life.key) return null;
  if (life.key === 'closed') {
    const c = page.closed || {};
    return c.next ? { id: 'closed', slots: { month: c.month || '', name: c.next.name } } : { id: 'closedAlone', slots: { month: c.month || '' } };
  }
  if (anyDue) return null;
  const rv = review && review.next ? { id: 'review', slots: { month: review.next } } : { id: 'reviewAny', slots: {} };
  if (life.key !== 'drawing') return rv;
  if (!page.locked) return rv;
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
 * plan's settings in memory (PlanReading.moveInputs `fromSettings`). The buckets' line links to the review, whose "Test with
 * what I hold" tries what is held and can accept it (the line then rests); a ladder's to What you hold. Null otherwise.
 */
function driftLineOf(plan, now, href, { phase = 'drawing' } = {}) {
  let mv = null; try { mv = moveInputs(plan, { now, fromSettings: true }); } catch { mv = null; }
  const d = mv && mv.diff ? driftOf(mv.diff) : null;
  if (!d) return null;
  if (d.kind === 'buckets') {
    // Moving (spec-7100 §3.2: the window line, then the held line): where what is held stands against the mix the plan moves
    // to — the bucket furthest from it, or within the move's band of it; Living on it only beyond DRIFT_BAND
    const moving = phase === 'moving';
    if (!moving && !(d.maxDrift > DRIFT_BAND * 100)) return null;
    if (moving && !(d.maxDrift > MOVE_BAND * 100)) return { kind: 'buckets', phase: 'moving', close: true, href };
    const bucket = BUCKETS.reduce((best, k) => (Math.abs(d.drift[k] || 0) > Math.abs(d.drift[best] || 0) ? k : best), BUCKETS[0]);
    const x = mv.diff.buckets[bucket] || { held: 0, target: 0 };
    const inPlay = mv.diff.inPlay;
    return { kind: 'buckets', ...(moving ? { phase: 'moving' } : {}), bucket, held: Math.round(100 * (+x.held || 0) / inPlay), plan: Math.round(100 * (+x.target || 0) / inPlay), href };
  }
  if (d.kind === 'ladder' && d.gapSoon) {
    const thisTY = Number(mv.target && mv.target.thisTaxYear);
    const ys = (mv.diff.buy || []).filter((b) => b.kind === 'gilt' && Array.isArray(b.taxYears)).flatMap((b) => b.taxYears.map(Number)).filter((Y) => Y === thisTY || Y === thisTY + 1).sort((p, q) => p - q);
    // a ladder's rungs are read on What you hold (its gaps), not tested by the review
    return ys.length ? { kind: 'ladder', year: taxYearLabel(ys[0]), href: '#/plan/' + plan.id + '/hold' } : null;
  }
  return null;
}

/**
 * The move window, said on the home (7.10.0): inside it, how long is left to the month work stops (and, with no record of
 * what is held, that it can be recorded when the person likes); once what is held is accepted, that, and the stop; a saver
 * before it, the month it opens. Null with no month to stop in, and on a plan asked whether work has stopped.
 */
function windowLineOf(life, { held, agreed, now = null }) {
  const w = moveWindowOf(life);
  if (!w || !w.to || life.confirmStop) return null;
  const left = timeLeftWords(w.monthsLeft);   // "11 months", "2 years 2 months" (7.12.0)
  if (life.key === 'moving') {
    // of what is held, or (no pension record to read) of the plan as it stands
    if (agreed) return { id: agreed.how === 'nothing' ? 'agreedAsItStands' : 'agreed', slots: { date: dayWords(agreed.at), stop: monthWords(w.to) } };
    return { id: held ? 'moving' : 'movingNoRecord', slots: { left, stop: monthWords(w.to) } };
  }
  // a saver before the window: the month it opens, however far off (7.12.0: the same month the review page and the full view
  // name, so which stage comes next, and when, is one fact on every page)
  if (life.key === 'saving' && w.state === 'before' && w.from) return { id: 'saving', slots: { from: monthWords(w.from) } };
  return null;
}

/**
 * The line under the home's headline (7.10.0): each fact said once. The headline says the phase ("Saving. You stop work in
 * …", "Moving.", "Living on it. Not locked yet."), the move window's line how long is left and the stop, "Did you stop work in
 * …?" the stop past, and the to-do or the nothing-due line a closed plan's month and the plan that carries it on — so of the
 * plan's line (read.js lineOf, as every other page of the plan says it) the home keeps only what none of them says: a
 * ladder's first gilt still ahead, a close still to come, back to work, the stop past on a plan whose question is put off, a
 * closed plan's line where nothing else says it. "Locked {date}" is said beside it, or alone (the screen adds it). Null
 * when the line has nothing to add. { id, slots }: copy/home.js headLine[id], else copy/plan.js stageLines[id].
 */
function headLineOf(line, { shown, quietShown }) {
  if (!line || !line.id) return null;
  if (line.id === 'running-ladder') return { id: 'ladder', slots: line.slots };
  if (line.id === 'pastStop') return shown.includes('plan.confirmStop') ? null : line;
  if (line.id === 'closed') return shown.includes('closed.next') || quietShown === 'closed' ? null : line;
  if (line.id === 'closed-alone') return quietShown === 'closedAlone' ? null : line;
  // closed for going back to work: the to-do says the month and the plan that carries it on; the line why
  if (line.id === 'closed-working') return shown.includes('closed.next') ? { id: 'backToWork', slots: {} } : line;
  // a close still to come (and why): said nowhere else on the home
  if (/^closing/.test(line.id)) return line;
  // still saving, inside the move window, locked and working until the stop, retired with the plan locked or not: the
  // headline and the window's line say them
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
  // what the plan takes a month this year, for the months still to come: the year's set-up (7.12.0, YearPlan.yearPlanOf);
  // a recorded month's own figure is what that month told the person to take
  let yp = null; try { yp = older ? null : yearPlanOf(plan, key); } catch { yp = null; }
  const perMonth = yp ? yp.perMonth : null;
  const cfg = plan.decisionTool && plan.decisionTool.taxYears ? plan.decisionTool.taxYears[key] : null;
  const setUp = !!(cfg && cfg.yearSetupComplete);
  const setUpMonth = setUp ? addMonth(ty + '-04', ((Number(cfg.startMonth) || 4) + 8) % 12) : null;
  const monthStep = page.steps.find((s) => s.id === 'month');
  const due = page.stageKey !== 'closed' && monthStep && !monthStep.recorded ? monthStep.toRecord : null;
  const mon = thisMonthOf(now);
  // the months before the plan's first payment (7.12.0, YearPlan.firstPaymentMonth) are not the plan's to record: never "not
  // recorded", never a nag; with the first month not known, every month before this one with no record
  let fp = null; try { fp = firstPaymentMonth(plan, { now, settings: effectiveStressSettings(plan, { now }) }).month; } catch { fp = null; }
  const cells = [];
  for (let i = 0; i < 12; i++) {
    const m = addMonth(ty + '-04', i);
    const h = byMonth.get(m) || null;
    const said = h ? takenAgainstPlan([h]) : null;
    const drawn = said ? said.taken : null;
    const before = !h && (fp ? m < fp : m < mon);
    const state = h ? (isFilledIn(h) ? 'filled' : 'recorded') : before ? 'before' : m === due ? 'due' : m === setUpMonth ? 'setUp' : m > mon ? 'later' : 'none';
    const planned = older ? null : said ? said.said : perMonth != null && state !== 'none' ? perMonth : null;
    // "; the plan said £X" only when it differs from what was taken by £1 or more
    cells.push({ month: m, name: monthName(m), words: monthWords(m), state, ...(before ? { wordsKey: fp ? 'before' : 'beforeUnknown' } : {}), drawn, plan: before ? null : planned, planDiffers: planned != null && !!said && Math.abs(said.diff) >= 1 });
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
    for (const e of pg.closed ? [] : partnersOf(list, plan)) {
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
  // (Moving: inside the window, the same line about where what is held stands, until what is held is accepted)
  const inWindow = stageKey === 'moving' && !!life && !life.confirmStop && !!moveWindowOf(life) && moveWindowOf(life).state === 'inside';
  const drift = (stageKey === 'drawing' || inWindow) && recorded && !pg.readonly && !pg.closed && review && !accepted ? driftLineOf(plan, now, review.href, { phase: stageKey }) : null;
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
  if (!pg.readonly && !pg.closed) { try { const h = gapHeadline(gapsOf(plan, { today, life })); gapLine = h ? { ...h, Y: String(h.Y), href: '#/plan/' + pg.id + '/hold' } : null; } catch { gapLine = null; } }
  // 7.12.0: living on a ladder, one line only when the pension holds less than the cash years still need (held.js, the one reading)
  let heldLess = null;
  if (!pg.readonly && !pg.closed) { try { const hl = heldLadder(plan, { today, life }); heldLess = hl && hl.state === 'less' ? { less: pounds(hl.less), href: '#/plan/' + pg.id + '/move' } : null; } catch { heldLess = null; } }
  // the household's partner with their plan's phase (7.12.0, read.js householdStep theirLine), beside "With ‘…’"
  const tools = (TOOLS[stageKey] || TOOLS.none).map(stepOf).filter(Boolean).map((s) => ({ id: s.id, href: '#/plan/' + pg.id + '/' + s.id, result: s.railResult || s.result, figures: s.figures || {}, ...(s.theirLine && !s.railResult ? { theirLine: s.theirLine } : {}) }));
  // the steps, read-only with each result line; a saver's "For later" group stays on a plan not locked, but a locked plan
  // is being carried out: its steps are listed plainly, never marked for later or not done
  const steps = pg.steps.map((s) => ({ id: s.id, href: '#/plan/' + pg.id + '/' + s.id, result: (!pg.locked && s.railResult) || s.result, figures: s.figures || {}, later: !pg.locked && !!s.later, done: s.state === 'done', ...(s.theirLine && !(!pg.locked && s.railResult) ? { theirLine: s.theirLine } : {}) }));
  // change the plan, or try something: a locked plan's tries change nothing; an unlocked plan's pages change it
  const base = '#/plan/' + pg.id + '/';
  const lived = pg.locked && pg.stageKey === 'running' && !!lastRecord && !pg.closing;
  let ladderWay = false; try { ladderWay = CONTRACT_STRATEGIES.includes((plan.planDocument && plan.planDocument.strategy && plan.planDocument.strategy.id) || effectiveStressSettings(plan, { now }).strategyId); } catch { ladderWay = false; }
  const change = pg.readonly || pg.closed ? [] : pg.locked
    // a gilt ladder has no mix to try (7.12.0): its way of drawing is a list of gilts and cash years
    ? [{ id: 'tryChange', href: base + 'lasts' }, { id: 'tryWay', href: base + 'way' }, ...(ladderWay ? [] : [{ id: 'tryMix', href: base + 'mix' }]),
      ...(lived && !pg.example ? [{ id: 'moveToNew', href: '#/plans' }, { id: 'backToWork', href: '#/plans' }] : []),
      { id: 'unlock', href: base + 'plan' }]
    : [{ id: 'about', href: base + 'about' }, { id: 'income', href: base + 'income' }, { id: 'spend', href: base + 'spend' }, { id: 'pots', href: base + 'pots' },
      { id: 'lasts', href: base + 'lasts' }, { id: 'way', href: base + 'way' }, { id: 'mix', href: base + 'mix' }, ...(pg.example ? [] : [{ id: 'lock', href: base + 'lock' }])];
  const quiet = quietOf({ ...pg, lastRecord }, life, now, { review, anyDue: all.length > 0, wanted: monthsWanted(dt) });
  const shown = all.slice(0, TODO_SHOWN).map((d) => d.id);
  return {
    found: true, id: pg.id, name: pg.name, example: pg.example, readonly: pg.readonly, source: pg.source,
    pensionAccess: pensionAccessOf(plan, pg, now),
    locked: pg.locked, lockedOn: pg.lockedOn, line: pg.line, closing: pg.closing, before: pg.before,
    // the line under the headline: only what the headline, the window's line and To do do not say already (7.10.0)
    headLine: headLineOf(pg.line, { shown, quietShown: !shown.length && !pg.readonly && quiet ? quiet.id : null }),
    closed: pg.closed, stageKey: pg.stageKey,
    stage: { key: life ? life.key : null, stop: life && life.stop ? monthWords(life.stop) : null, strip: stripOf(life, now) },
    // one list (7.10.0): the plan's own to-dos then a partner's, one shown, the rest "and N more"
    todo: { items: all.slice(0, TODO_SHOWN), more: all.slice(TODO_SHOWN), count: all.length, soon: (pg.soon || []).map((d) => item(d)) },
    quiet,
    // 7.10.0: the next review (never stored: read from the log, the check-ins, the records and the rule), and the move window
    review: pg.readonly || pg.closed ? null : review,
    moveWindow: pg.readonly || pg.closed ? null : windowLineOf(life, { held: recorded, agreed: life && life.agreed ? life.agreed : null, now }),
    where,
    ...(drift ? { drift } : {}),
    // 7.6.0: the first tax year not yet covered by what is held and kept, once — only on a plan that keeps something
    ...(gapLine ? { gap: gapLine } : {}),
    ...(heldLess ? { heldLess } : {}),
    whereFull,
    year: yearOf(plan, pg, now),
    tools,
    steps,
    change,
    ask: ASK[stageKey] || []
  };
}
