/**
 * A locked plan stored the old way (7.3.3): its start later than it should be. Until 6.51.0 a retired person's plan started
 * at the next April by default, and the months until then were named instead of removed. Nobody retired has months before
 * their plan, so such a plan shows ONE thing to do — move its start to the tax year work stopped, or say when that was —
 * in place of any words for those months, and nothing reads its months against a later year's figure.
 *
 *   - PlanMove.startLaterOf: which plans have the to-do (a locked retired plan whose year 0 is later than the stop's tax year,
 *     or than this tax year with no stop said), and which never do (a draft, a closed plan, the plan that carries one on);
 *   - the V7 home: the to-do first on fixture 03, with and without a month work stopped, its words and its button; none on 04;
 *   - "Where you are" on 03: the months and what was taken, a pointer to the to-do, no "more/less than the plan said";
 *   - the move still works from the to-do: the button opens "About you and when", where the move is offered on 03 once it
 *     says when work stopped, with a confirm that names no months "before the plan";
 *   - the planner's next-step banner says the same to-do, word for word;
 *   - reads only: opening the home writes nothing.
 */
import { describe, it, expect } from 'vitest';
import { planPage } from '../../../src/answers/plan/read.js';
import { homeOf } from '../../../src/answers/plan/home.js';
import { lockedStartOf } from '../../../src/answers/plan/about.js';
import { startLaterOf, laterDraftLeftOf } from '../../../src/services/PlanMove.js';
import { effectiveStressSettings } from '../../../src/services/PlanReading.js';
import { nextStepFor, NEXT_STEP_WORDS } from '../../../src/services/NextStep.js';
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
const stopped = (month = '2026-05') => { const r = copy(C['03-gilt-ladder-runup']); r.stressTool.settings.stoppedWork = month; return r; };
const SAID = /before (your|the) plan|run[\s-]?up|bridge|set aside until|more than the plan said|less than the plan said/i;
/** 03 saying it stopped, its State Pension given as a plan year that the move would turn into 12 ("at 67"): the move is blocked. */
const blocked = () => { const r = stopped(); for (const k of ['stressTool', 'decisionTool']) Object.assign(r[k].settings, { spStartDate: null, spWeeklyAmount: 0, statePension: 12000, statePensionYear: 11 }); return r; };

describe('which plans are stored the old way (PlanMove.startLaterOf)', () => {
  const at = noon(TODAY);
  it('fixture 03, saying no month work stopped: asks when (its year 0 is later than this tax year), and offers this tax year (7.4.0)', () => {
    expect(startLaterOf(C['03-gilt-ladder-runup'], at)).toEqual({ kind: 'ask', start: 2027, thisYear: 2026 });
  });
  it('fixture 03, saying it stopped in May 2026: the move to 2026/27', () => {
    expect(startLaterOf(stopped(), at)).toMatchObject({ kind: 'move', start: 2027, stopMonth: '2026-05', to: 2026 });
  });
  it('fixture 03 once its year 0 has come, months still marked: still asks (until the month is said)', () => {
    expect(startLaterOf(C['03-gilt-ladder-runup'], noon('2027-06-01'))).toEqual({ kind: 'ask', start: 2027 });
  });
  it('never a draft, a closed plan, or the plan that carries a closed one on; never 04 (a running plan)', () => {
    const draft = copy(C['03-gilt-ladder-runup']); draft.decisionTool.settings.locked = false;
    expect(startLaterOf(draft, at)).toBe(null);
    const closed = copy(C['03-gilt-ladder-runup']); closed.closedAt = '2026-09';
    expect(startLaterOf(closed, at)).toBe(null);
    const next = copy(C['03-gilt-ladder-runup']); next.before = { kind: 'plan', from: '2027-04', planId: 'x' };
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
    const same = copy(C['03-gilt-ladder-runup']);
    same.stressTool.settings.stoppedWork = '2026-05'; same.stressTool.settings.firstTaxYear = 2026; same.decisionTool.settings.firstTaxYear = 2026;
    for (const h of same.decisionTool.history) delete h.bridgeYear;
    expect(startLaterOf(same, at)).toBe(null);
  });
});

describe('the V7 home: one thing to do, ranked first', () => {
  it('fixture 03 without a month work stopped: "When did you stop work?", first, opening "About you and when"', () => {
    const e = entryOf(C['03-gilt-ladder-runup'], TODAY);
    const h = homeOf([e], e.plan.id, { today: TODAY });
    const first = h.todo.items[0];
    expect(first.id).toBe('start.ask');
    expect(first.slots.start).toBe('April 2027');
    expect(first.button).toMatchObject({ id: 'sayWhen', href: '#/plan/' + e.plan.id + '/about' });
    expect(fill(HOME.items['start.ask'].title, first.slots)).toBe('When did you stop work?');
    expect(fill(HOME.items['start.ask'].detail, first.slots)).toBe('Your plan is set to start in April 2027. If you are already drawing, it can start this tax year instead.');
    expect(PLAN.buttons.sayWhen).toBe('Say when');
    // the rail's "Next" is the same thing
    expect(fill(PLAN.next['P.startAsk'], first.slots)).toBe('Your plan is set to start in April 2027. Next: say when you stopped work.');
  });
  it('fixture 03 saying it stopped in May 2026: "Start it from the tax year you stopped", first, opening the move', () => {
    const e = entryOf(stopped(), TODAY);
    const h = homeOf([e], e.plan.id, { today: TODAY });
    const first = h.todo.items[0];
    expect(first.id).toBe('start.move');
    expect(first.slots).toMatchObject({ start: 'April 2027', stopped: 'May 2026' });
    expect(first.button).toMatchObject({ id: 'moveStart', href: '#/plan/' + e.plan.id + '/about' });
    expect(fill(HOME.items['start.move'].detail, first.slots)).toBe('Your plan is set to start in April 2027, but you stopped work in May 2026.');
    expect(HOME.items['start.move'].title).toBe('Start it from the tax year you stopped');
    expect(PLAN.buttons.moveStart).toBe('Move the start');
  });
  it('a move whose State Pension is given only as a plan year: the move, its date asked on "About you and when" (7.4.0)', () => {
    const e = entryOf(blocked(), TODAY);
    const h = homeOf([e], e.plan.id, { today: TODAY });
    const ids = h.todo.items.map((i) => i.id);
    expect(ids[0]).toBe('start.move');
    expect(ids).not.toContain('start.blocked');
    const first = h.todo.items[0];
    expect(first.button).toMatchObject({ id: 'moveStart', href: '#/plan/' + e.plan.id + '/about' });
    const ls = lockedStartOf(e.plan, { today: TODAY });
    expect(ls.blocked).toBeNull();
    expect(ls.move).toMatchObject({ spAsk: true, how: null });
  });
  it('a read-only entry: no to-do (it cannot be acted on), and still no month read against a later year\'s figure', () => {
    const e = { ...entryOf(C['03-gilt-ladder-runup'], TODAY), newer: true };
    const pg = planPage([e], e.plan.id, 'where', { today: TODAY });
    expect(pg.due.map((d) => d.id).filter((x) => x.startsWith('start.'))).toEqual([]);
    const w = pg.steps.find((st) => st.id === 'where');
    if (w) {
      const ids = w.lines.map((l) => l.id);
      for (const no of ['where.compareLess', 'where.compareLessCut', 'where.compareMore', 'where.compareSame', 'where.planned']) expect(ids, no).not.toContain(no);
      for (const l of w.lines) expect(l.sentence.text, l.id).not.toMatch(/see To do/);
    }
  });
  it('fixture 04 (a running plan) has no such to-do; nor has any other plan of the corpus but 03', () => {
    const entries = entriesAt(TODAY);
    for (const e of entries) {
      const ids = planPage(entries, e.plan.id, null, { today: TODAY }).due.map((d) => d.id);
      if (e.plan.id === C['03-gilt-ladder-runup'].id) expect(ids[0]).toBe('start.ask');
      else expect(ids.filter((x) => x.startsWith('start.')), e.plan.id).toEqual([]);
    }
  });
  it('its words pass the banned list in every scope a plan page is shown in', () => {
    const scopes = ['all', 'record', 'retired', 'saver', 'planner'];
    const slots = { start: 'April 2027', stopped: 'May 2026' };
    for (const t of [HOME.items['start.ask'].title, HOME.items['start.ask'].detail, HOME.items['start.move'].title, HOME.items['start.move'].detail,
      HOME.items['start.askOnly'].title, HOME.items['start.askOnly'].detail, HOME.items['start.draft'].title, HOME.items['start.draft'].detail, PLAN.next['P.startDraft'], PLAN.buttons.chooseStart, NEXT_STEP_WORDS.startDraft, NEXT_STEP_WORDS.startDraftBtn,
      PLAN.next['P.startAsk'], PLAN.next['P.startMove'], PLAN.buttons.moveStart, PLAN.buttons.sayWhen,
      HOME.items['start.blocked'].title, HOME.items['start.blocked'].detail, PLAN.next['P.startBlocked'], PLAN.buttons.seeWhy, NEXT_STEP_WORDS.startBlocked]) expect(bannedHits(fill(t, slots), scopes), t).toEqual([]);
  });
  it('opening the home writes nothing: the stored plan is byte-identical', () => {
    const raw = copy(C['03-gilt-ladder-runup']);
    const before = JSON.stringify(raw);
    const e = entryOf(raw, TODAY);
    homeOf([e], e.plan.id, { today: TODAY });
    expect(JSON.stringify(raw)).toBe(before);
  });
});

describe('a draft still set to start later than this tax year, which the reading leaves as saved (7.4.0, PlanMove.laterDraftLeftOf)', () => {
  const at = noon(TODAY);
  /** Fixture 03 unlocked: a draft with months recorded against its saved start (April 2027). */
  const recorded = () => { const r = copy(C['03-gilt-ladder-runup']); r.decisionTool.settings.locked = false; return r; };
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
    const locked = entryOf(C['03-gilt-ladder-runup'], TODAY).plan;
    expect(laterDraftLeftOf(locked, effectiveStressSettings(locked, { now: at }), at)).toBe(null);
    for (const e of entriesAt(TODAY)) expect(laterDraftLeftOf(e.plan, effectiveStressSettings(e.plan, { now: at }), at), e.plan.id).toBe(null);
    expect(laterDraftLeftOf({}, {}, at)).toBe(null);
  });
  it('the V7 home: "Choose your plan’s first tax year", first, opening "About you and when"; the planner\'s banner the same', () => {
    for (const make of [recorded, spByYear]) {
      const e = entryOf(make(), TODAY);
      const h = homeOf([e], e.plan.id, { today: TODAY });
      const first = h.todo.items[0];
      expect(first.id).toBe('start.draft');
      expect(first.button).toMatchObject({ id: 'chooseStart', href: '#/plan/' + e.plan.id + '/about' });
      expect(fill(HOME.items['start.draft'].detail, first.slots)).toBe('Your plan is set to start in April 2027. It can start this tax year, or the tax year you stopped work.');
      const left = laterDraftLeftOf(e.plan, effectiveStressSettings(e.plan, { now: at }), at);
      const step = nextStepFor({ stage: deriveStage(e.plan, at), budget: {}, stress: {}, decision: {}, startDraft: left });
      expect(step.html).toBe('Your plan is set to start in April 2027. It can start this tax year, or the tax year you stopped work: choose it under Timing.');
      expect(step.action).toEqual({ kind: 'stress-settings' });
    }
  });
});

describe('"Where you are" on 03: the months and what was taken, never read against a later year', () => {
  for (const [what, raw] of [['without a month work stopped', () => C['03-gilt-ladder-runup']], ['saying it stopped', () => stopped()]]) {
    it(what, () => {
      const e = entryOf(raw(), TODAY);
      const pg = planPage([e], e.plan.id, 'where', { today: TODAY });
      const w = pg.steps.find((s) => s.id === 'where');
      const ids = w.lines.map((l) => l.id);
      expect(ids).toContain('where.startLater');
      for (const no of ['where.compareLess', 'where.compareLessCut', 'where.compareMore', 'where.compareSame', 'where.planned', 'where.potMid']) expect(ids, no).not.toContain(no);
      expect(w.result.text).not.toMatch(/the plan says/);
      const line = w.lines.find((l) => l.id === 'where.startLater');
      expect(line.sentence.text).toBe('Your plan is set to start in April 2027, so these months are not read against it yet: see To do');
      for (const l of w.lines) expect(l.sentence.text, l.id).not.toMatch(SAID);
      // the home's headline leads with the same pointer, and its year view sets no month against a plan figure
      const h = homeOf([e], e.plan.id, { today: TODAY });
      expect(h.where[0].lines[0].id).toBe('where.startLater');
      expect(h.year.cells.every((c) => c.plan == null)).toBe(true);
    });
  }
  it('03 once its year 0 has come (June 2027, months still marked): the to-do stays, and its months are read against the plan', () => {
    const today = '2027-06-01';
    const e = entryOf(C['03-gilt-ladder-runup'], today);
    const pg = planPage([e], e.plan.id, 'where', { today });
    // its start is already this tax year: "When did you stop work?" without the offer of this tax year (as the planner says it)
    expect(pg.due.map((d) => d.id)).toContain('start.askOnly');
    expect(pg.due.map((d) => d.id)).not.toContain('start.ask');
    const ask = pg.due.find((d) => d.id === 'start.askOnly');
    expect(fill(HOME.items['start.askOnly'].detail, ask.slots)).toBe('Your plan is set to start in April 2027.');
    expect(nextStepFor({ stage: deriveStage(e.plan, noon(today)), budget: {}, stress: {}, decision: {}, startLater: startLaterOf(e.plan, noon(today)) }).html)
      .toBe(NEXT_STEP_WORDS.startAskOnly.replace('{start}', 'April 2027'));
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
  it('on 03 without a month, "About you and when" asks it, and its words name no months before the plan', () => {
    const e = entryOf(C['03-gilt-ladder-runup'], TODAY);
    const ls = lockedStartOf(e.plan, { today: TODAY });
    expect(ls.ask).toBe(true);
    expect(ABOUT.lockedStart.askHelp).not.toMatch(SAID);
  });
});

describe('the planner\'s next-step banner says the same to-do', () => {
  const stageOf = (raw) => deriveStage(raw, noon(TODAY));
  it('without a month: asks when, with the V7 words', () => {
    const raw = C['03-gilt-ladder-runup'];
    const step = nextStepFor({ stage: stageOf(raw), budget: {}, stress: {}, decision: {}, startLater: startLaterOf(raw, noon(TODAY)) });
    expect(step).toEqual({ html: 'Your plan is set to start in April 2027. When did you stop work? If you are already drawing, it can start this tax year instead.', btn: 'Say when', action: { kind: 'start-later' } });
  });
  it('with a month: the move, with the V7 words', () => {
    const raw = stopped();
    const step = nextStepFor({ stage: stageOf(raw), budget: {}, stress: {}, decision: {}, startLater: startLaterOf(raw, noon(TODAY)) });
    expect(step.html).toBe('Your plan is set to start in April 2027, but you stopped work in May 2026. Start it from the tax year you stopped.');
    expect(step.btn).toBe(NEXT_STEP_WORDS.startMoveBtn);
  });
  it('a State Pension given only as a plan year: the move (its date asked on the line it opens), never "only once unlocked"', () => {
    const raw = blocked();
    const step = nextStepFor({ stage: stageOf(raw), budget: {}, stress: {}, decision: {}, startLater: startLaterOf(raw, noon(TODAY)) });
    expect(step).toEqual({ html: 'Your plan is set to start in April 2027, but you stopped work in May 2026. Start it from the tax year you stopped.', btn: NEXT_STEP_WORDS.startMoveBtn, action: { kind: 'start-later' } });
  });
  it('the old placing\'s own banner, label and chip carry no words for months before the plan', () => {
    const st = stageOf(C['03-gilt-ladder-runup']);
    expect(st.key).toBe('running');   // 7.4.2: the old placing is gone; the plan is running, its to-do the move
    expect([st.label, st.chip].join(' ')).not.toMatch(SAID);
    expect(st.banner).toBe(null);
  });
});
