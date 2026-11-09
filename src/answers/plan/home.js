/**
 * The plan's home (7.3.0; research/v7/one-product-design.md, "The plan home" and "The to-do reader"): what a person carrying
 * out a plan comes back to — what is due, where they are, then everything else. Read from what the plan already holds;
 * NOTHING is written because a plan was opened, and nothing here is stored (no stage, no to-do list).
 *
 *   homeOf(entries, id, { today, source, notNow, page })
 *     → { found, id, name, …, stage, todo, quiet, where, heldMix, whereFull, year, tools, steps, change, ask }
 *
 * One engine: the to-dos are read.js dueFor's, the very list whose first item is the rail's "Next" (planPage `due`), so
 * the two can never disagree. A partner's plan adds its own due lines (the month, the tax year, the move; never its
 * figures), named by that plan's name. The year view is the current tax year's twelve months from the plan's own records
 * (decisionTool.history), against the plan document's figure for the year, a twelfth a month (whereAmI, as "Where you are"
 * reads it). Words are src/v7/copy/home.js's under the ids here.
 *
 * Pure: no clock (the day arrives as `today`), no storage.
 */
import { planPage, dateOf, monthWords, monthName } from './read.js';
import { whereAmIFor, historyAscending, moveInputs, effectiveStressSettings } from '../../services/PlanReading.js';
import { gapsOf, gapHeadline } from './gaps.js';
import { taxYearStartOf, taxYearKey, taxYearLabel, earlyPensionDrawOf } from '../../services/PlanTiming.js';
import { readDayOf } from '../../services/PlanClosed.js';
import { isFilledIn } from '../../services/MonthFill.js';
import { holdingsSummary, normaliseHoldings } from '../../services/HoldingsRecord.js';
import { ym } from './dates.js';
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

/** At most this many to-dos are listed at once; the rest are "and N more" (the design's rule). */
export const TODO_SHOWN = 3;
/**
 * A partner's to-dos that reach this home: the month, the tax year and the move (the design's ranks 5 to 9) — never that
 * plan's age, lock or invitation, whose words speak to the person whose plan it is ("Add your age", "Lock the plan").
 */
const PARTNER_IDS = ['month.taxYear', 'month.arrive', 'month.record', 'month.gap', 'move.next', 'move.finish'];
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
  moving: ['month', 'move', 'hold', 'budget', 'household'],
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

/** The three segments of the stage strip: each done, now or later, with the month it ends or begins when the plan says it. */
function stripOf(life, heldMix = null) {
  if (!life || !life.key || life.key === 'closed') return null;
  const at = STRIP.indexOf(life.key);
  // a Drawing plan whose record of what is held is short of the plan's mix (7.3.1): its move is not called done while the note
  // under "Where you are" says how much of the mix is held — the segment is 'part', filled to that share, with no word
  return STRIP.map((key, i) => ({ key, state: i < at ? (key === 'moving' && heldMix ? 'part' : 'done') : i === at ? 'now' : 'later',
    ...(key === 'moving' && heldMix && i < at ? { held: heldMix.pct } : {}),
    month: key === 'saving' && life.stop ? monthWords(life.stop) : key === 'drawing' && life.key === 'drawing' && life.since ? monthWords(life.since) : null }));
}

/**
 * The line that says nothing is due, always with the date something next will be (never "nothing to do" alone): a saver's
 * next check-in, or this month's pot recorded and the 1st of next month; on a drawing plan the month recorded and the 1st of
 * the first month not recorded after it (a quarter or a year recorded at once reaches ahead: the plan's own cadence); a
 * closed plan where it carries on. Only ever a true sentence: null while the thing it would say is done is still due (the
 * list says so then); a plan not locked yet says its months wait for the lock.
 */
function quietOf(page, life, now) {
  const mon = thisMonthOf(now);
  if (!life || !life.key) return null;
  if (life.key === 'closed') {
    const c = page.closed || {};
    return c.next ? { id: 'closed', slots: { month: c.month || '', name: c.next.name } } : { id: 'closedAlone', slots: { month: c.month || '' } };
  }
  if (life.key === 'saving') {
    const ci = page.steps.find((s) => s.id === 'checkin');
    const st = ci && ci.checkIn ? ci.checkIn : null;
    if (!st || st.due) return null;
    if (st.chosen && st.next) return { id: 'savingNext', slots: { month: monthWords(st.next) } };
    if (st.legacy) return { id: 'savingPot', slots: { monthName: monthName(mon), next: first(addMonth(mon, 1)) } };
    return null;
  }
  if (!page.locked) return { id: 'draft', slots: {} };
  const latest = page.lastRecord || null;
  if (!latest || latest < mon) return null;
  return { id: 'drawing', slots: { month: monthName(latest), next: first(addMonth(latest, 1)) } };
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

/** A to-do as the home draws it: the design's id, the P.* id, its words' slots, the button, whether "Not now" is offered. */
const item = (d, extra = {}) => ({ id: d.id, pid: d.pid, slots: d.slots, button: d.button, ...(d.dismiss ? { dismiss: d.dismiss } : {}), ...(d.soon ? { soon: true } : {}), ...extra });

/**
 * Everything the plan's home draws. `page` may be the planPage reading already made for this plan at its own address (the
 * plan source has it); without it, it is read here.
 */
export function homeOf(entries, id, { today, source = 'account', notNow = [], page = null } = {}) {
  const pg = page && page.found && String(page.id) === String(id) ? page : planPage(entries, id, null, { today, source, notNow });
  if (!pg.found) return { found: false, id: String(id || '') };
  const now = dateOf(today);
  const list = (entries || []).filter((e) => e && e.plan && typeof e.plan === 'object' && e.plan.id != null);
  const plan = list.find((e) => String(e.plan.id) === String(id)).plan;
  const life = pg.life || null;
  const stageKey = life && life.key ? life.key : 'none';
  const hist = historyAscending(plan);
  const lastRecord = hist.length ? String(hist[hist.length - 1].date).slice(0, 7) : null;
  const due = (pg.due || []).map((d) => item(d));
  // the partner's plan(s): their month, tax year and move, one line each, named by the plan (never its figures)
  const partner = [];
  if (!pg.readonly) {
    const mine = plan.household && typeof plan.household.partnerScenarioId === 'string' ? plan.household.partnerScenarioId : null;
    for (const e of list) {
      if (String(e.plan.id) === String(id)) continue;
      const linked = String(e.plan.id) === mine || (e.plan.household && e.plan.household.partnerScenarioId === String(plan.id));
      if (!linked || pg.closed) continue;
      const their = planPage(list, e.plan.id, null, { today, source, notNow });
      if (!their.found || their.closed) continue;
      for (const d of their.due || []) if (PARTNER_IDS.includes(d.id)) partner.push(item(d, { planId: String(e.plan.id), name: their.name }));
    }
  }
  const stepOf = (sid) => pg.steps.find((s) => s.id === sid) || null;
  // the move, counted once on the home: its orders (TransitionPlanner.progress, the very list the to-do names the next of),
  // in the headline and the move tool alike — never the orders in one place and the gilts bought in another
  let mv = null; try { mv = moveInputs(plan, { now }); } catch { mv = null; }
  const prog = mv && mv.prog && mv.prog.total > 0 ? mv.prog : null;
  const moves = prog ? { done: prog.doneCount, of: prog.total } : null;
  // 7.3.1 (one-product-design.md, "Drawing while the holdings are not exact"): a plan recording months is Drawing whatever
  // its record of what is held says, so what is still held differently from the plan is said here, as information — never
  // a to-do, never the stage. The same reading as the move page and its "% of the plan's mix held" line (moveInputs: the
  // record diffed against the plan's mix, then the orders still open), so the two figures cannot differ. Drift inside the
  // plan's own tolerance is no difference (`complete`): then nothing is said.
  const recorded = holdingsSummary(normaliseHoldings(plan.holdings)).count > 0;
  const shortOfMix = stageKey === 'drawing' && !!life && life.placing === 'running' && recorded
    && !!mv && !!mv.diff && !!mv.target && mv.target.kind !== 'none' && mv.diff.complete === false && typeof mv.diff.progressPct === 'number';
  const open = prog ? prog.total - prog.doneCount : 0;
  const heldMix = shortOfMix ? {
    pct: mv.diff.progressPct,
    // the next order still open, by its own name, and how many more after it; every order ticked, the record has not caught up
    label: prog && prog.next ? String(prog.next.label || prog.next.ticker || '') : null,
    more: prog && prog.next ? Math.max(0, open - 1) : 0,
    ticked: !!prog && !prog.next,
    href: '#/plan/' + pg.id + '/move'
  } : null;
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
  const tools = (TOOLS[stageKey] || TOOLS.none).map(stepOf).filter(Boolean).map((s) => ({ id: s.id, href: '#/plan/' + pg.id + '/' + s.id, result: s.railResult || s.result, figures: s.figures || {},
    // a Drawing plan short of its mix: the move tool says the share held, as "Where you are" does (never a count of moves to make)
    ...(s.id === 'move' && heldMix ? { held: heldMix.pct }
      // the move tool says the same count as the headline and the to-do: the orders done
      : s.id === 'move' && moves && !s.done ? { moves } : {}) }));
  // the steps, read-only with each result line; a saver's "For later" group stays on a plan not locked, but a locked plan
  // is being carried out: its steps are listed plainly, never marked for later or not done
  const steps = pg.steps.map((s) => ({ id: s.id, href: '#/plan/' + pg.id + '/' + s.id, result: (!pg.locked && s.railResult) || s.result, figures: s.figures || {}, later: !pg.locked && !!s.later, done: s.state === 'done',
    // the move step on a Drawing plan short of its mix says the one share the home says everywhere (7.3.1), not its gilts bought
    ...(s.id === 'move' && heldMix ? { held: heldMix.pct } : {}) }));
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
    stage: { key: life ? life.key : null, invite: life ? life.invite : null, stop: life && life.stop ? monthWords(life.stop) : null, strip: stripOf(life, heldMix),
      moves: stageKey === 'moving' ? moves : null },
    todo: { items: due.slice(0, TODO_SHOWN), more: due.slice(TODO_SHOWN), count: due.length, soon: (pg.soon || []).map((d) => item(d)), partner },
    quiet: quietOf({ ...pg, lastRecord }, life, now),
    where,
    heldMix,
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
