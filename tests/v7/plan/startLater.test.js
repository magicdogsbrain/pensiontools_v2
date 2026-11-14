/**
 * A locked plan stored the old way (7.3.3): its start later than it should be. Until 6.51.0 a retired person's plan started
 * at the next April by default, and the months until then were named instead of removed. Nobody retired has months before
 * their plan, so such a plan shows ONE thing to do — move its start to the tax year work stopped, or say when that was —
 * in place of any words for those months, and nothing reads its months against a later year's figure.
 *
 *   - PlanMove.startLaterOf: which plans have the to-do (a locked retired plan whose year 0 is later than the stop's tax year,
 *     or than this tax year with no stop said), and which never do (a draft, a closed plan, the plan that carries one on);
 *   - the V7 home: from 7.10.0 no start to-do (spec-7100 §5): the start is changed on "About you and when";
 *   - "Where you are" on 03: the months and what was taken, a pointer to "About you and when", no "more/less than the plan said";
 *   - the move still works from the to-do: the button opens "About you and when", where the move is offered on 03 once it
 *     says when work stopped, with a confirm that names no months "before the plan";
 *   - the planner's next-step banner says the same to-do, word for word;
 *   - reads only: opening the home writes nothing.
 *
 * From 7.4.3 fixture 03's three recorded months (July to September 2026) say when the plan was picked up: with no month work
 * stopped it is moved to 2026/27, the tax year they begin in, with no question first ("Start it from 2026/27"; recordsFrom).
 * The question, and "this tax year" beside it, are a plan's with no months recorded: `noMonths()` below.
 */
import { describe, it, expect } from 'vitest';
import { planPage } from '../../../src/answers/plan/read.js';
import { homeOf } from '../../../src/answers/plan/home.js';
import { lockedStartOf } from '../../../src/answers/plan/about.js';
import { startLaterOf, laterDraftLeftOf } from '../../../src/services/PlanMove.js';
import { effectiveStressSettings } from '../../../src/services/PlanReading.js';
import { nextStepFor } from '../../../src/services/NextStep.js';
import { homeBannerOf } from '../../../src/ui/homeBannerUi.js';
import { deriveStage } from '../../../src/services/LifeStage.js';
import { HOME } from '../../../src/v7/copy/home.js';
import { PLAN } from '../../../src/v7/copy/plan.js';
import { ABOUT } from '../../../src/v7/copy/about.js';
import { bannedHits } from '../render/checkScreen.js';
import { corpus, entryOf, entriesAt, noon, TODAY } from './_plans.js';

const C = corpus();
const copy = (v) => JSON.parse(JSON.stringify(v));
const fill = (text, slots) => String(text).replace(/\{(\w+)\}/g, (m, k) => (k in slots && slots[k] != null ? String(slots[k]) : m));
/** Fixture 03 (locked ladder, year 0 2027/28, months recorded before it) saying it stopped work in a month of 2026/27. */
const stopped = (month = '2026-05') => { const r = copy(C['20-locked-start-after-stop']); r.stressTool.settings.stoppedWork = month; return r; };
/** Fixture 03 with no month recorded and no month work stopped: the question (7.4.3: one with months is moved to their year). */
const noMonths = () => { const r = copy(C['20-locked-start-after-stop']); r.decisionTool.history = []; return r; };
const SAID = /before (your|the) plan|run[\s-]?up|bridge|set aside until|more than the plan said|less than the plan said/i;
/** 03 saying it stopped, its State Pension given as a plan year that the move would turn into 12 ("at 67"): the move is blocked. */
const blocked = () => { const r = stopped(); for (const k of ['stressTool', 'decisionTool']) Object.assign(r[k].settings, { spStartDate: null, spWeeklyAmount: 0, statePension: 12000, statePensionYear: 11 }); return r; };

describe('which plans are stored the old way (PlanMove.startLaterOf)', () => {
  const at = noon(TODAY);
  it('fixture 03, saying no month work stopped: the move to 2026/27, the tax year its recorded months begin in (7.4.3)', () => {
    expect(startLaterOf(C['20-locked-start-after-stop'], at)).toEqual({ kind: 'move', start: 2027, stopMonth: null, to: 2026, blocked: false, recordsFrom: '2026-07' });
  });
  it('with no month recorded either: asks when (its year 0 is later than this tax year), and offers this tax year (7.4.0)', () => {
    expect(startLaterOf(noMonths(), at)).toEqual({ kind: 'ask', start: 2027, thisYear: 2026 });
  });
  it('fixture 03, saying it stopped in May 2026: the move to 2026/27', () => {
    expect(startLaterOf(stopped(), at)).toMatchObject({ kind: 'move', start: 2027, stopMonth: '2026-05', to: 2026 });
  });
  it('fixture 03 once its year 0 has come: still the move back to 2026/27, where its months begin (7.4.3); with none, nothing', () => {
    expect(startLaterOf(C['20-locked-start-after-stop'], noon('2027-06-01'))).toEqual({ kind: 'move', start: 2027, stopMonth: null, to: 2026, blocked: false, recordsFrom: '2026-07' });
    expect(startLaterOf(noMonths(), noon('2027-06-01'))).toBe(null);   // nothing marked, its start this tax year: nothing to say
  });
  it('never a draft, a closed plan, or the plan that carries a closed one on; never 04 (a running plan)', () => {
    const draft = copy(C['20-locked-start-after-stop']); draft.decisionTool.settings.locked = false;
    expect(startLaterOf(draft, at)).toBe(null);
    const closed = copy(C['20-locked-start-after-stop']); closed.closedAt = '2026-09';
    expect(startLaterOf(closed, at)).toBe(null);
    const next = copy(C['20-locked-start-after-stop']); next.before = { kind: 'plan', from: '2027-04', planId: 'x' };
    expect(startLaterOf(next, at)).toBe(null);
    expect(startLaterOf(C['04-buckets-running'], at)).toBe(null);
  });
  it('a move that cannot keep the State Pension\'s tax year as it is asks the State Pension\'s date (7.4.0): no longer blocked', () => {
    expect(startLaterOf(blocked(), at)).toEqual({ kind: 'move', start: 2027, stopMonth: '2026-05', to: 2026, blocked: false, spAsk: true });
    expect(startLaterOf(stopped(), at).blocked).toBe(false);
  });
  it('a plan whose year 0 is the tax year work stopped has nothing to move', () => {
    const r = stopped('2027-05');   // a month still ahead is not a stop: nothing to say
    expect(startLaterOf(r, at)).toEqual({ kind: 'ask', start: 2027 });
    const same = copy(C['20-locked-start-after-stop']);
    same.stressTool.settings.stoppedWork = '2026-05'; same.stressTool.settings.firstTaxYear = 2026; same.decisionTool.settings.firstTaxYear = 2026;
    for (const h of same.decisionTool.history) delete h.bridgeYear;
    expect(startLaterOf(same, at)).toBe(null);
  });
});

// retaken in 7.10.0 (spec-7100 §5, §7): the start's move is no longer a to-do on the home or the rail — it is changed on "About you
// and when" (by unlock and lock again; the confirm flows there are unchanged until they go). The plan's months are its to-do.
describe('the V7 home: no start to-do (7.10.0); the start is changed on "About you and when"', () => {
  it('fixture 03, with or without a month work stopped, with months or none, a State Pension by plan year: no start to-do', () => {
    for (const make of [() => C['20-locked-start-after-stop'], noMonths, stopped, blocked]) {
      const e = entryOf(make(), TODAY);
      const h = homeOf([e], e.plan.id, { today: TODAY });
      const ids = [...h.todo.items, ...h.todo.more].map((i) => i.id);
      expect(ids.filter((x) => x.startsWith('start.'))).toEqual([]);
      const pg = planPage([e], e.plan.id, null, { today: TODAY });
      expect(pg.due.map((d) => d.id).filter((x) => x.startsWith('start.'))).toEqual([]);
      expect(String(pg.next.id)).not.toMatch(/^P\.start/);
      expect(pg.next.words).toBeUndefined();
    }
    // the months are its to-do (03 records months, so it wants them asked for)
    const e = entryOf(C['20-locked-start-after-stop'], TODAY);
    expect(homeOf([e], e.plan.id, { today: TODAY }).todo.items.map((i) => i.id)).toEqual(['month.record']);
    // the words are gone with the to-dos
    for (const id of ['start.move', 'start.ask', 'start.askOnly', 'start.blocked', 'start.moveRecords', 'start.blockedRecords', 'start.draft']) expect(HOME.items[id], id).toBeUndefined();
    for (const pid of ['P.startMove', 'P.startAsk', 'P.startBlocked', 'P.startDraft', 'P.startMoveRecords', 'P.startBlockedRecords']) expect(PLAN.next[pid], pid).toBeUndefined();
  });
  it('a read-only entry: no to-do (it cannot be acted on), and still no month read against a later year\'s figure', () => {
    const e = { ...entryOf(C['20-locked-start-after-stop'], TODAY), newer: true };
    const pg = planPage([e], e.plan.id, 'where', { today: TODAY });
    expect(pg.due.map((d) => d.id).filter((x) => x.startsWith('start.'))).toEqual([]);
    const w = pg.steps.find((st) => st.id === 'where');
    if (w) {
      const ids = w.lines.map((l) => l.id);
      for (const no of ['where.compareLess', 'where.compareLessCut', 'where.compareMore', 'where.compareSame', 'where.planned']) expect(ids, no).not.toContain(no);
      for (const l of w.lines) expect(l.sentence.text, l.id).not.toMatch(/see To do/);
    }
  });
  it('no plan of the corpus has a start to-do, at any of the three dates', () => {
    for (const today of ['2026-10-02', '2027-04-05', '2027-04-06']) {
      const entries = entriesAt(today);
      for (const e of entries) expect(planPage(entries, e.plan.id, null, { today }).due.map((d) => d.id).filter((x) => x.startsWith('start.')), e.plan.id).toEqual([]);
    }
  });
  it('the words that stay (the buttons "About you and when" still offers) pass the banned list in every scope a plan page is shown in', () => {
    const scopes = ['all', 'record', 'retired', 'saver', 'planner'];
    for (const t of [PLAN.buttons.moveStart, PLAN.buttons.sayWhen, PLAN.buttons.seeWhy, PLAN.buttons.chooseStart]) expect(bannedHits(t, scopes), t).toEqual([]);
  });
  it('opening the home writes nothing: the stored plan is byte-identical', () => {
    const raw = copy(C['20-locked-start-after-stop']);
    const before = JSON.stringify(raw);
    const e = entryOf(raw, TODAY);
    homeOf([e], e.plan.id, { today: TODAY });
    expect(JSON.stringify(raw)).toBe(before);
  });
});

describe('a draft still set to start later than this tax year, which the reading leaves as saved (7.4.0, PlanMove.laterDraftLeftOf)', () => {
  const at = noon(TODAY);
  /** Fixture 03 unlocked: a draft with months recorded against its saved start (April 2027). */
  const recorded = () => { const r = copy(C['20-locked-start-after-stop']); r.decisionTool.settings.locked = false; return r; };
  /** The same draft with nothing recorded, its State Pension given only as a plan year the reading would land on 12. */
  const spByYear = () => { const r = recorded(); r.decisionTool.history = []; r.stressTool.settings.stoppedWork = '2026-05'; Object.assign(r.stressTool.settings, { spStartDate: null, spWeeklyAmount: 0, statePension: 12000, statePensionYear: 11 }); return r; };
  it('named, with why: months recorded, or a State Pension the reading could not keep', () => {
    for (const [make, why] of [[recorded, 'records'], [spByYear, 'statePension']]) {
      const e = entryOf(make(), TODAY);
      expect(startLaterOf(e.plan, at)).toBe(null);
      expect(laterDraftLeftOf(e.plan, effectiveStressSettings(e.plan, { now: at }), at)).toEqual({ start: 2027, why });
    }
  });
  it('none for the plans the reading moves, a locked plan, a saver, and every corpus plan', () => {
    const locked = entryOf(C['20-locked-start-after-stop'], TODAY).plan;
    expect(laterDraftLeftOf(locked, effectiveStressSettings(locked, { now: at }), at)).toBe(null);
    for (const e of entriesAt(TODAY)) expect(laterDraftLeftOf(e.plan, effectiveStressSettings(e.plan, { now: at }), at), e.plan.id).toBe(null);
    expect(laterDraftLeftOf({}, {}, at)).toBe(null);
  });
  // retaken in 7.10.0 (spec-7100 §5): no longer a to-do on the V7 home or the planner's banner (which reads the home): the start
  // is chosen on "About you and when", or under Timing on the planner
  it('the V7 home and the planner\'s banner: no start to-do', () => {
    for (const make of [recorded, spByYear]) {
      const e = entryOf(make(), TODAY);
      const h = homeOf([e], e.plan.id, { today: TODAY });
      expect([...h.todo.items, ...h.todo.more].map((i) => i.id)).not.toContain('start.draft');
      const step = homeBannerOf([e], e.plan.id, { today: TODAY, stage: deriveStage(e.plan, at), budget: {}, stress: {}, decision: {} });
      expect(step && step.html).not.toMatch(/set to start in/);
    }
  });
});

describe('"Where you are" on 03: the months and what was taken, never read against a later year', () => {
  for (const [what, raw] of [['without a month work stopped', () => C['20-locked-start-after-stop']], ['saying it stopped', () => stopped()]]) {
    it(what, () => {
      const e = entryOf(raw(), TODAY);
      const pg = planPage([e], e.plan.id, 'where', { today: TODAY });
      const w = pg.steps.find((s) => s.id === 'where');
      const ids = w.lines.map((l) => l.id);
      expect(ids).toContain('where.startLater');
      for (const no of ['where.compareLess', 'where.compareLessCut', 'where.compareMore', 'where.compareSame', 'where.planned', 'where.potMid']) expect(ids, no).not.toContain(no);
      expect(w.result.text).not.toMatch(/the plan says/);
      const line = w.lines.find((l) => l.id === 'where.startLater');
      // 7.10.0: the start is changed on "About you and when" (spec-7100 §8 where.startLater), with the way there
      expect(line.sentence.text).toBe('Your plan is set to start in April 2027, so these months are not read against it yet. You can change the start on About you and when');
      expect(w.buttons[0]).toMatchObject({ id: 'aboutWhen', href: '#/plan/' + e.plan.id + '/about' });
      for (const l of w.lines) expect(l.sentence.text, l.id).not.toMatch(SAID);
      // the home's headline leads with the same pointer, and its year view sets no month against a plan figure
      const h = homeOf([e], e.plan.id, { today: TODAY });
      expect(h.where[0].lines[0].id).toBe('where.startLater');
      expect(h.year.cells.every((c) => c.plan == null)).toBe(true);
    });
  }
  it('03 once its year 0 has come (June 2027): no to-do for the start (7.10.0), the planner\'s banner still names it, and its months are read against the plan', () => {
    const today = '2027-06-01';
    const e = entryOf(C['20-locked-start-after-stop'], today);
    const pg = planPage([e], e.plan.id, 'where', { today });
    expect(pg.due.map((d) => d.id).filter((x) => x.startsWith('start.'))).toEqual([]);
    const w = pg.steps.find((st) => st.id === 'where');
    const ids = w.lines.map((l) => l.id);
    expect(ids).not.toContain('where.startLater');
    for (const l of w.lines) expect(l.sentence.text, l.id).not.toMatch(/set to start in April 2027, so|not read against it yet/);
  });
  it('04 still reads its months against the plan', () => {
    const entries = entriesAt(TODAY);
    const pg = planPage(entries, C['04-buckets-running'].id, 'where', { today: TODAY });
    expect(pg.steps.find((s) => s.id === 'where').lines.map((l) => l.id)).not.toContain('where.startLater');
  });
});

describe('the move still works from the to-do', () => {
  it('on 03 saying when work stopped, "About you and when" offers the move, and its confirm names no months before the plan', () => {
    const e = entryOf(stopped(), TODAY);
    const ls = lockedStartOf(e.plan, { today: TODAY });
    expect(ls.move).toBeTruthy();
    expect(ls.move).toMatchObject({ yearStop: '2026/27', yearStart: '2027/28', month: 'May 2026' });
    const words = [fill(ls.move.stepped ? ABOUT.lockedStart.move : ABOUT.lockedStart.moveLevel, ls.move),
      ...ls.move.confirm.map((l) => fill(ABOUT.lockedStart.confirm.lines[l.id], l.slots))];
    for (const t of words) expect(t).not.toMatch(SAID);
    expect(ls.move.confirm.map((l) => l.id)).not.toContain('bridgedAll');
  });
  it('on 03 without a month, "About you and when" offers the move to where its months begin (7.4.3), with no question first', () => {
    const e = entryOf(C['20-locked-start-after-stop'], TODAY);
    const ls = lockedStartOf(e.plan, { today: TODAY });
    expect(ls.ask).toBe(false);
    expect(ls.move).toMatchObject({ yearStop: '2026/27', yearStart: '2027/28', records: 'July 2026', start: 'April 2027', how: {} });
    const words = [fill(ls.move.stepped ? ABOUT.lockedStart.moveRecords : ABOUT.lockedStart.moveRecordsLevel, ls.move),
      ...ls.move.confirm.map((l) => fill(ABOUT.lockedStart.confirm.lines[l.id], l.slots))];
    for (const t of words) expect(t).not.toMatch(SAID);
    expect(ls.move.confirm[0]).toEqual({ id: 'firstRecords', slots: { yearStop: '2026/27', records: 'July 2026', yearStart: '2027/28' } });
  });
  it('with no month recorded either, "About you and when" asks it, and its words name no months before the plan', () => {
    const e = entryOf(noMonths(), TODAY);
    const ls = lockedStartOf(e.plan, { today: TODAY });
    expect(ls.ask).toBe(true);
    expect(ABOUT.lockedStart.askHelp).not.toMatch(SAID);
  });
});

// retaken in 7.10.0 (spec-7100 §5): the planner's banner reads the plan home (src/ui/homeBannerUi.js), so it says the home's
// first thing due — 03's month — never the start, which is changed under Timing (the line there is unchanged)
describe('the planner\'s next-step banner reads the home: the month, never the start', () => {
  const stageOf = (raw) => deriveStage(raw, noon(TODAY));
  const bannerOf = (raw) => { const e = entryOf(raw, TODAY); return homeBannerOf([e], e.plan.id, { today: TODAY, stage: stageOf(raw), budget: {}, stress: {}, decision: {} }); };
  it('03, with or without a month work stopped, a State Pension by plan year: "Next: record October 2026.", to the Decision tool', () => {
    for (const raw of [C['20-locked-start-after-stop'], stopped(), blocked()]) {
      const step = bannerOf(raw);
      expect(step).toMatchObject({ html: 'Next: record October 2026.', btn: 'Record October', action: { kind: 'tab', tab: 'decision' }, id: 'month.record' });
      expect(step.dismiss).toEqual({ kind: 'task', key: 'month.record@2026-10' });
    }
  });
  it('03 with no month recorded either: nothing due — months are its choice — so the stage\'s own sentence, if it has one; never the start', () => {
    const step = bannerOf(noMonths());
    if (step) expect(step.html).not.toMatch(/set to start in|When did you stop work/);
    expect(nextStepFor({ stage: stageOf(noMonths()), budget: {}, stress: {}, decision: {}, startLater: startLaterOf(noMonths(), noon(TODAY)) })).toEqual(nextStepFor({ stage: stageOf(noMonths()), budget: {}, stress: {}, decision: {} }));
  });
  it('the old placing\'s own banner, label and chip carry no words for months before the plan', () => {
    const st = stageOf(C['20-locked-start-after-stop']);
    expect(st.key).toBe('running');   // 7.4.2: the old placing is gone; the plan is running, its to-do the move
    expect([st.label, st.chip].join(' ')).not.toMatch(SAID);
    expect(st.banner).toBe(null);
  });
});
